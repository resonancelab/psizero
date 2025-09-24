import { useState, useEffect, useCallback, useRef } from 'react';
import {
  EngineState,
  EngineSearchFilters,
  EngineSortOptions,
  EngineManagerStats,
  CreateEngineRequest,
  UpdateEngineRequest,
  SAIWebSocketEvent,
  TrainingProgressEvent,
  TrainingCompleteEvent,
  EngineStatusEvent,
  EngineStatus,
  TrainingExample,
  TrainingConfig
} from '@/types/sai';
import { saiApi, mockEngines } from '@/lib/api/services/sai';
import { useToast } from '@/hooks/use-toast';

interface UseSAIEnginesOptions {
  autoConnect?: boolean;
  useMockData?: boolean;
}

interface UseSAIEnginesReturn {
  engines: EngineState[];
  loading: boolean;
  error: string | null;
  stats: EngineManagerStats | null;
  filters: EngineSearchFilters;
  sort: EngineSortOptions;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  
  // Actions
  loadEngines: () => Promise<void>;
  createEngine: (request: CreateEngineRequest) => Promise<EngineState>;
  updateEngine: (id: string, request: UpdateEngineRequest) => Promise<EngineState>;
  deleteEngine: (id: string) => Promise<void>;
  cloneEngine: (id: string, name: string) => Promise<EngineState>;
  
  // Filtering and sorting
  setFilters: (filters: Partial<EngineSearchFilters>) => void;
  setSort: (sort: EngineSortOptions) => void;
  setPagination: (page: number, limit?: number) => void;
  clearFilters: () => void;
  
  // Real-time updates
  connectWebSocket: () => Promise<void>;
  disconnectWebSocket: () => void;
  isWebSocketConnected: boolean;
  
  // Training operations
  startTraining: (engineId: string, data: TrainingExample[]) => Promise<void>;
  stopTraining: (engineId: string) => Promise<void>;
  pauseTraining: (engineId: string) => Promise<void>;
  resumeTraining: (engineId: string) => Promise<void>;
}

// Helper function to derive engine status from state
function getEngineStatus(engine: EngineState): EngineStatus {
  if (engine.training_history.some(session => session.status === 'running')) {
    return 'running';
  }
  if (engine.training_history.some(session => session.status === 'paused')) {
    return 'paused';
  }
  if (engine.training_history.some(session => session.status === 'failed')) {
    return 'failed';
  }
  return 'idle';
}

export const useSAIEngines = (options: UseSAIEnginesOptions = {}): UseSAIEnginesReturn => {
  const { autoConnect = false, useMockData = true } = options;
  const { toast } = useToast();
  
  // State
  const [engines, setEngines] = useState<EngineState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<EngineManagerStats | null>(null);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  
  // Filters and sorting
  const [filters, setFiltersState] = useState<EngineSearchFilters>({});
  const [sort, setSortState] = useState<EngineSortOptions>({
    field: 'last_accessed',
    direction: 'desc'
  });
  const [pagination, setPaginationState] = useState({
    page: 1,
    limit: 12,
    total: 0
  });
  
  // WebSocket event handlers
  const wsEventHandlers = useRef<Map<string, (event: SAIWebSocketEvent) => void>>(new Map());
  
  // Load engines with filters, sorting, and pagination
  const loadEngines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (useMockData) {
        // Use mock data for development
        let filteredEngines = [...mockEngines];
        
        // Apply filters
        if (filters.status?.length) {
          filteredEngines = filteredEngines.filter(engine => 
            filters.status!.includes(getEngineStatus(engine))
          );
        }
        
        if (filters.name) {
          filteredEngines = filteredEngines.filter(engine => 
            engine.config.name.toLowerCase().includes(filters.name!.toLowerCase())
          );
        }
        
        if (filters.dateRange) {
          filteredEngines = filteredEngines.filter(engine => {
            const createdAt = new Date(engine.config.created_at);
            return createdAt >= filters.dateRange!.start && createdAt <= filters.dateRange!.end;
          });
        }
        
        if (filters.hasTrainingHistory !== undefined) {
          filteredEngines = filteredEngines.filter(engine => 
            (engine.training_history.length > 0) === filters.hasTrainingHistory
          );
        }
        
        // Apply sorting
        filteredEngines.sort((a, b) => {
          let aValue: unknown, bValue: unknown;
          
          switch (sort.field) {
            case 'name':
              aValue = a.config.name.toLowerCase();
              bValue = b.config.name.toLowerCase();
              break;
            case 'created_at':
              aValue = new Date(a.config.created_at).getTime();
              bValue = new Date(b.config.created_at).getTime();
              break;
            case 'last_accessed':
              aValue = new Date(a.last_accessed).getTime();
              bValue = new Date(b.last_accessed).getTime();
              break;
            case 'total_processed_texts':
              aValue = a.statistics.total_processed_texts;
              bValue = b.statistics.total_processed_texts;
              break;
            default:
              aValue = new Date(a.last_accessed).getTime();
              bValue = new Date(b.last_accessed).getTime();
          }
          
          if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
          return 0;
        });
        
        // Apply pagination
        const startIndex = (pagination.page - 1) * pagination.limit;
        const paginatedEngines = filteredEngines.slice(startIndex, startIndex + pagination.limit);
        
        setEngines(paginatedEngines);
        setPaginationState(prev => ({ ...prev, total: filteredEngines.length }));
        
        // Mock stats
        setStats({
          total_engines: mockEngines.length,
          active_engines: mockEngines.filter(e => getEngineStatus(e) === 'running').length,
          idle_engines: mockEngines.filter(e => getEngineStatus(e) === 'idle').length,
          total_users: 1,
          engines_created: mockEngines.length,
          engines_destroyed: 0,
          evictions_performed: 0,
          average_engine_age: 86400000000000, // 1 day in nanoseconds
          memory_usage: mockEngines.reduce((sum, e) => sum + e.statistics.memory_usage, 0),
          user_distribution: { 'user_123': mockEngines.length },
          created_at: mockEngines[0]?.config.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } else {
        // Use real API
        const response = await saiApi.getEngines(filters, sort, pagination.page, pagination.limit);
        setEngines(response.engines);
        setPaginationState(prev => ({ 
          ...prev, 
          total: response.total,
          page: response.page,
          limit: response.limit 
        }));
        
        // Use mock stats for now since backend doesn't return proper stats
        setStats({
          total_engines: 1,
          active_engines: 0,
          idle_engines: 1,
          total_users: 1,
          engines_created: 1,
          engines_destroyed: 0,
          evictions_performed: 0,
          average_engine_age: 86400000000000,
          memory_usage: 1000000,
          user_distribution: { 'user_123': 1 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load engines';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination.page, pagination.limit, useMockData, toast]);
  
  // Create engine
  const createEngine = useCallback(async (request: CreateEngineRequest): Promise<EngineState> => {
    try {
      if (useMockData) {
        // Mock creation
        const newEngine: EngineState = {
          id: request.id,
          user_id: request.user_id,
          config: {
            id: request.id,
            user_id: request.user_id,
            name: request.name,
            max_symbols: request.max_symbols || 10000,
            prime_limits: request.prime_limits || [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
            entropy_threshold: request.entropy_threshold || 0.1,
            symbol_mapping_type: request.symbol_mapping_type || 'unicode',
            training_settings: {
              batch_size: 32,
              learning_rate: 0.001,
              max_epochs: 100,
              early_stopping: true,
              patience_epochs: 10,
              validation_split: 0.2,
              min_improvement: 0.001,
              enable_metrics: true,
              save_checkpoints: true,
              checkpoint_interval: 10,
              priority: 5,
              max_training_duration: 3600,
              ...request.training_settings,
            },
            custom_mappings: request.custom_mappings || {},
            max_training_size: request.max_training_size || 1000,
            auto_save: request.auto_save !== undefined ? request.auto_save : true,
            max_cache_size: request.max_cache_size || 1000,
            validation_enabled: request.validation_enabled !== undefined ? request.validation_enabled : true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          symbol_mappings: {},
          training_history: [],
          statistics: {
            total_processing_requests: 0,
            total_processed_texts: 0,
            total_training_sessions: 0,
            total_symbols_learned: 0,
            average_processing_time: 0,
            average_training_time: 0,
            last_training_accuracy: 0,
            current_entropy_level: 0,
            memory_usage: 0,
            cache_hit_rate: 0,
            custom_metrics: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          last_accessed: new Date().toISOString(),
          version: 1,
          checksum: Math.random().toString(36).substring(7),
        };
        
        // Add to mock data
        mockEngines.unshift(newEngine);
        await loadEngines(); // Refresh the list
        
        toast({
          title: "Engine Created",
          description: `Successfully created "${request.name}"`,
        });
        
        return newEngine;
      } else {
        const newEngine = await saiApi.createEngine(request);
        await loadEngines(); // Refresh the list
        
        toast({
          title: "Engine Created",
          description: `Successfully created "${request.name}"`,
        });
        
        return newEngine;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create engine';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [useMockData, loadEngines, toast]);
  
  // Update engine
  const updateEngine = useCallback(async (id: string, request: UpdateEngineRequest): Promise<EngineState> => {
    try {
      if (useMockData) {
        // Mock update
        const engineIndex = mockEngines.findIndex(e => e.id === id);
        if (engineIndex === -1) throw new Error('Engine not found');
        
        const currentConfig = mockEngines[engineIndex].config;
        const updatedEngine: EngineState = {
          ...mockEngines[engineIndex],
          config: {
            ...currentConfig,
            name: request.name || currentConfig.name,
            max_symbols: request.max_symbols || currentConfig.max_symbols,
            prime_limits: request.prime_limits || currentConfig.prime_limits,
            entropy_threshold: request.entropy_threshold || currentConfig.entropy_threshold,
            symbol_mapping_type: request.symbol_mapping_type || currentConfig.symbol_mapping_type,
            training_settings: request.training_settings ? {
              ...currentConfig.training_settings,
              ...request.training_settings,
            } : currentConfig.training_settings,
            custom_mappings: request.custom_mappings || currentConfig.custom_mappings,
            max_training_size: request.max_training_size || currentConfig.max_training_size,
            auto_save: request.auto_save !== undefined ? request.auto_save : currentConfig.auto_save,
            max_cache_size: request.max_cache_size || currentConfig.max_cache_size,
            validation_enabled: request.validation_enabled !== undefined ? request.validation_enabled : currentConfig.validation_enabled,
            updated_at: new Date().toISOString(),
          },
        };
        
        mockEngines[engineIndex] = updatedEngine;
        await loadEngines(); // Refresh the list
        
        toast({
          title: "Engine Updated",
          description: `Successfully updated "${updatedEngine.config.name}"`,
        });
        
        return updatedEngine;
      } else {
        const updatedEngine = await saiApi.updateEngine(id, request);
        await loadEngines(); // Refresh the list
        
        toast({
          title: "Engine Updated",
          description: `Successfully updated "${updatedEngine.config.name}"`,
        });
        
        return updatedEngine;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update engine';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [useMockData, loadEngines, toast]);
  
  // Delete engine
  const deleteEngine = useCallback(async (id: string): Promise<void> => {
    try {
      if (useMockData) {
        const engineIndex = mockEngines.findIndex(e => e.id === id);
        if (engineIndex === -1) throw new Error('Engine not found');
        
        const engineName = mockEngines[engineIndex].config.name;
        mockEngines.splice(engineIndex, 1);
        await loadEngines(); // Refresh the list
        
        toast({
          title: "Engine Deleted",
          description: `Successfully deleted "${engineName}"`,
        });
      } else {
        await saiApi.deleteEngine(id);
        await loadEngines(); // Refresh the list
        
        toast({
          title: "Engine Deleted",
          description: "Engine successfully deleted",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete engine';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [useMockData, loadEngines, toast]);
  
  // Clone engine
  const cloneEngine = useCallback(async (id: string, name: string): Promise<EngineState> => {
    try {
      if (useMockData) {
        const originalEngine = mockEngines.find(e => e.id === id);
        if (!originalEngine) throw new Error('Engine not found');
        
        const clonedEngine: EngineState = {
          ...originalEngine,
          id: `engine_${Date.now()}`,
          config: {
            ...originalEngine.config,
            id: `engine_${Date.now()}`,
            name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          training_history: [],
          last_accessed: new Date().toISOString(),
          version: 1,
        };
        
        mockEngines.unshift(clonedEngine);
        await loadEngines(); // Refresh the list
        
        toast({
          title: "Engine Cloned",
          description: `Successfully cloned to "${name}"`,
        });
        
        return clonedEngine;
      } else {
        const clonedEngine = await saiApi.cloneEngine(id, name);
        await loadEngines(); // Refresh the list
        
        toast({
          title: "Engine Cloned",
          description: `Successfully cloned to "${name}"`,
        });
        
        return clonedEngine;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clone engine';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [useMockData, loadEngines, toast]);
  
  // Training operations
  const startTraining = useCallback(async (engineId: string, data: TrainingExample[]): Promise<void> => {
    try {
      if (useMockData) {
        const engineIndex = mockEngines.findIndex(e => e.id === engineId);
        if (engineIndex === -1) throw new Error('Engine not found');
        
        // Add a running training session
        const newSession = {
          id: `session_${Date.now()}`,
          user_id: 'user_123',
          engine_id: engineId,
          status: 'running' as const,
          progress: 0,
          current_epoch: 0,
          total_epochs: 100,
          current_loss: 1.0,
          best_loss: 1.0,
          validation_loss: 1.0,
          learning_rate: 0.001,
          start_time: new Date().toISOString(),
          last_update_time: new Date().toISOString(),
          training_examples: data.length,
          config: mockEngines[engineIndex].config.training_settings,
          metrics: {},
        };
        
        mockEngines[engineIndex].training_history.push(newSession);
        await loadEngines();
        
        toast({
          title: "Training Started",
          description: "Engine training has begun",
        });
      } else {
        await saiApi.startTraining(engineId, { data });
        await loadEngines();
        
        toast({
          title: "Training Started",
          description: "Engine training has begun",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start training';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [useMockData, loadEngines, toast]);
  
  const stopTraining = useCallback(async (engineId: string): Promise<void> => {
    try {
      if (useMockData) {
        const engineIndex = mockEngines.findIndex(e => e.id === engineId);
        if (engineIndex === -1) throw new Error('Engine not found');
        
        // Mark latest training session as completed
        const engine = mockEngines[engineIndex];
        if (engine.training_history.length > 0) {
          const latestSession = engine.training_history[engine.training_history.length - 1];
          latestSession.status = 'completed';
          latestSession.end_time = new Date().toISOString();
        }
        
        await loadEngines();
        
        toast({
          title: "Training Stopped",
          description: "Engine training has been stopped",
        });
      } else {
        await saiApi.stopTraining(engineId);
        await loadEngines();
        
        toast({
          title: "Training Stopped",
          description: "Engine training has been stopped",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop training';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [useMockData, loadEngines, toast]);
  
  const pauseTraining = useCallback(async (engineId: string): Promise<void> => {
    try {
      if (useMockData) {
        const engineIndex = mockEngines.findIndex(e => e.id === engineId);
        if (engineIndex === -1) throw new Error('Engine not found');
        
        // Mark latest training session as paused
        const engine = mockEngines[engineIndex];
        if (engine.training_history.length > 0) {
          const latestSession = engine.training_history[engine.training_history.length - 1];
          latestSession.status = 'paused';
        }
        
        await loadEngines();
        
        toast({
          title: "Training Paused",
          description: "Engine training has been paused",
        });
      } else {
        await saiApi.pauseTraining(engineId);
        await loadEngines();
        
        toast({
          title: "Training Paused",
          description: "Engine training has been paused",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pause training';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [useMockData, loadEngines, toast]);
  
  const resumeTraining = useCallback(async (engineId: string): Promise<void> => {
    try {
      if (useMockData) {
        const engineIndex = mockEngines.findIndex(e => e.id === engineId);
        if (engineIndex === -1) throw new Error('Engine not found');
        
        // Mark latest training session as running
        const engine = mockEngines[engineIndex];
        if (engine.training_history.length > 0) {
          const latestSession = engine.training_history[engine.training_history.length - 1];
          latestSession.status = 'running';
        }
        
        await loadEngines();
        
        toast({
          title: "Training Resumed",
          description: "Engine training has been resumed",
        });
      } else {
        await saiApi.resumeTraining(engineId);
        await loadEngines();
        
        toast({
          title: "Training Resumed",
          description: "Engine training has been resumed",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resume training';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [useMockData, loadEngines, toast]);
  
  // Filter and sort management
  const setFilters = useCallback((newFilters: Partial<EngineSearchFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPaginationState(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);
  
  const setSort = useCallback((newSort: EngineSortOptions) => {
    setSortState(newSort);
    setPaginationState(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);
  
  const setPagination = useCallback((page: number, limit?: number) => {
    setPaginationState(prev => ({
      ...prev,
      page,
      ...(limit && { limit })
    }));
  }, []);
  
  const clearFilters = useCallback(() => {
    setFiltersState({});
    setPaginationState(prev => ({ ...prev, page: 1 }));
  }, []);
  
  // WebSocket management
  const connectWebSocket = useCallback(async (): Promise<void> => {
    if (!useMockData) {
      try {
        await saiApi.connectWebSocket();
        setIsWebSocketConnected(true);
        
        // Set up event handlers
        const trainingProgressHandler = (event: SAIWebSocketEvent) => {
          if (event.type === 'training_progress') {
            const trainingEvent = event as TrainingProgressEvent;
            setEngines(prev => prev.map(engine => 
              engine.id === trainingEvent.engine_id 
                ? { 
                    ...engine, 
                    // Update training progress if available
                    training_history: engine.training_history.map(session =>
                      session.id === trainingEvent.session_id 
                        ? { ...session, ...trainingEvent.data.session }
                        : session
                    )
                  }
                : engine
            ));
          }
        };
        
        const trainingCompleteHandler = (event: SAIWebSocketEvent) => {
          if (event.type === 'training_complete') {
            const completeEvent = event as TrainingCompleteEvent;
            setEngines(prev => prev.map(engine => 
              engine.id === completeEvent.engine_id 
                ? { 
                    ...engine,
                    training_history: engine.training_history.map(session =>
                      session.id === completeEvent.session_id 
                        ? { ...session, ...completeEvent.data.session }
                        : session
                    )
                  }
                : engine
            ));
            
            toast({
              title: "Training Complete",
              description: `Engine training finished ${completeEvent.data.success ? 'successfully' : 'with errors'}`,
              variant: completeEvent.data.success ? "default" : "destructive",
            });
          }
        };
        
        const statusHandler = (event: SAIWebSocketEvent) => {
          if (event.type === 'status') {
            const statusEvent = event as EngineStatusEvent;
            setEngines(prev => prev.map(engine => 
              engine.id === statusEvent.engine_id 
                ? { ...engine, /* Update status if needed */ }
                : engine
            ));
          }
        };
        
        saiApi.subscribeToEvents('training_progress', trainingProgressHandler);
        saiApi.subscribeToEvents('training_complete', trainingCompleteHandler);
        saiApi.subscribeToEvents('status', statusHandler);
        
        wsEventHandlers.current.set('training_progress', trainingProgressHandler);
        wsEventHandlers.current.set('training_complete', trainingCompleteHandler);
        wsEventHandlers.current.set('status', statusHandler);
        
      } catch (err) {
        console.error('Failed to connect WebSocket:', err);
        setIsWebSocketConnected(false);
      }
    }
  }, [useMockData, toast]);
  
  const disconnectWebSocket = useCallback(() => {
    if (!useMockData) {
      // Unsubscribe from events
      wsEventHandlers.current.forEach((handler, eventType) => {
        saiApi.unsubscribeFromEvents(eventType, handler);
      });
      wsEventHandlers.current.clear();
      
      saiApi.disconnectWebSocket();
      setIsWebSocketConnected(false);
    }
  }, [useMockData]);
  
  // Effects
  useEffect(() => {
    loadEngines();
  }, [loadEngines]);
  
  useEffect(() => {
    if (autoConnect) {
      connectWebSocket();
    }
    
    return () => {
      disconnectWebSocket();
    };
  }, [autoConnect, connectWebSocket, disconnectWebSocket]);
  
  return {
    engines,
    loading,
    error,
    stats,
    filters,
    sort,
    pagination,
    loadEngines,
    createEngine,
    updateEngine,
    deleteEngine,
    cloneEngine,
    setFilters,
    setSort,
    setPagination,
    clearFilters,
    connectWebSocket,
    disconnectWebSocket,
    isWebSocketConnected,
    startTraining,
    stopTraining,
    pauseTraining,
    resumeTraining,
  };
};