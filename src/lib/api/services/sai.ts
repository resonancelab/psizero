import {
  EngineState,
  CreateEngineRequest,
  UpdateEngineRequest,
  ProcessingRequest,
  ProcessingResult,
  StartTrainingRequest,
  BatchProcessingRequest,
  BatchProcessingResult,
  EngineSearchFilters,
  EngineSortOptions,
  EngineManagerStats,
  TrainingSession,
  SAIWebSocketEvent,
  APIResponse,
  parseEngineState
} from '@/types/sai';

// SAI API Client
class SAIApiClient {
  private baseUrl: string;
  private apiKey: string;
  private wsConnection?: WebSocket;
  private eventHandlers: Map<string, ((event: SAIWebSocketEvent) => void)[]> = new Map();

  constructor(baseUrl: string = '/api/v1', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey || '';
  }

  // Authentication
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Engine Management
  async createEngine(request: CreateEngineRequest): Promise<EngineState> {
    const response = await this.request<APIResponse<EngineState>>('/sai/engines', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return parseEngineState(response.data);
  }

  async getEngines(
    filters?: EngineSearchFilters,
    sort?: EngineSortOptions,
    page?: number,
    limit?: number
  ): Promise<{ engines: EngineState[]; total: number; page: number; limit: number }> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status) params.append('status', filters.status.join(','));
      if (filters.name) params.append('name', filters.name);
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.start.toISOString());
        params.append('endDate', filters.dateRange.end.toISOString());
      }
      if (filters.hasTrainingHistory !== undefined) {
        params.append('hasTrainingHistory', filters.hasTrainingHistory.toString());
      }
    }
    
    if (sort) {
      params.append('sortBy', sort.field);
      params.append('sortOrder', sort.direction);
    }
    
    if (page !== undefined) params.append('page', page.toString());
    if (limit !== undefined) params.append('limit', limit.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/sai/engines?${queryString}` : '/sai/engines';
    
    const response = await this.request<APIResponse<EngineState[]>>(endpoint);
    
    // For now, return mock pagination structure since backend doesn't implement it yet
    return {
      engines: response.data.map(parseEngineState),
      total: response.data.length,
      page: page || 1,
      limit: limit || 10
    };
  }

  async getEngine(id: string): Promise<EngineState> {
    const response = await this.request<APIResponse<EngineState>>(`/sai/engines/${id}`);
    return parseEngineState(response.data);
  }

  async updateEngine(id: string, request: UpdateEngineRequest): Promise<EngineState> {
    const response = await this.request<APIResponse<EngineState>>(`/sai/engines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
    return parseEngineState(response.data);
  }

  async deleteEngine(id: string): Promise<void> {
    await this.request<APIResponse<{ message: string }>>(`/sai/engines/${id}`, {
      method: 'DELETE',
    });
  }

  async cloneEngine(id: string, name: string): Promise<EngineState> {
    // Clone functionality not in backend yet, throw error for now
    throw new Error('Clone functionality not yet implemented in backend');
  }

  // Text Processing
  async processText(engineId: string, request: ProcessingRequest): Promise<ProcessingResult> {
    const response = await this.request<APIResponse<ProcessingResult>>(`/sai/engines/${engineId}/process`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.data;
  }

  async batchProcess(engineId: string, request: BatchProcessingRequest): Promise<BatchProcessingResult> {
    const response = await this.request<APIResponse<BatchProcessingResult>>(`/sai/engines/${engineId}/batch-process`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.data;
  }

  // Training Operations
  async startTraining(engineId: string, request: StartTrainingRequest): Promise<TrainingSession> {
    return this.request<TrainingSession>(`/engines/${engineId}/training/start`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async stopTraining(engineId: string): Promise<void> {
    await this.request<void>(`/engines/${engineId}/training/stop`, {
      method: 'POST',
    });
  }

  async pauseTraining(engineId: string): Promise<void> {
    await this.request<void>(`/engines/${engineId}/training/pause`, {
      method: 'POST',
    });
  }

  async resumeTraining(engineId: string): Promise<void> {
    await this.request<void>(`/engines/${engineId}/training/resume`, {
      method: 'POST',
    });
  }

  async getTrainingStatus(engineId: string): Promise<TrainingSession | null> {
    try {
      return await this.request<TrainingSession>(`/engines/${engineId}/training/status`);
    } catch (error) {
      // Return null if no active training session
      return null;
    }
  }

  async getTrainingHistory(engineId: string): Promise<TrainingSession[]> {
    return this.request<TrainingSession[]>(`/engines/${engineId}/training/history`);
  }

  // Data Management
  async getDatasets(): Promise<Dataset[]> {
    return this.request<Dataset[]>('/datasets');
  }

  async uploadDataset(file: File, name: string, description: string): Promise<Dataset> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);

    const response = await fetch(`${this.baseUrl}/datasets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async deleteDataset(id: string): Promise<void> {
    await this.request<void>(`/datasets/${id}`, {
      method: 'DELETE',
    });
  }

  // Statistics & Monitoring
  async getEngineStats(): Promise<EngineStats> {
    return this.request<EngineStats>('/stats/engines');
  }

  async getUserUsage(): Promise<UsageQuotas> {
    return this.request<UsageQuotas>('/user/usage');
  }

  // WebSocket Integration
  connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws?token=${this.apiKey}`;
      
      this.wsConnection = new WebSocket(wsUrl);
      
      this.wsConnection.onopen = () => {
        console.log('SAI WebSocket connected');
        resolve();
      };
      
      this.wsConnection.onerror = (error) => {
        console.error('SAI WebSocket error:', error);
        reject(error);
      };
      
      this.wsConnection.onmessage = (event) => {
        try {
          const wsEvent: SAIWebSocketEvent = JSON.parse(event.data);
          this.handleWebSocketEvent(wsEvent);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.wsConnection.onclose = () => {
        console.log('SAI WebSocket disconnected');
        // Auto-reconnect after 5 seconds
        setTimeout(() => {
          this.connectWebSocket().catch(console.error);
        }, 5000);
      };
    });
  }

  private handleWebSocketEvent(event: SAIWebSocketEvent) {
    const handlers = this.eventHandlers.get(event.type) || [];
    handlers.forEach(handler => handler(event));
  }

  subscribeToEvents(eventType: string, handler: (event: SAIWebSocketEvent) => void) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  unsubscribeFromEvents(eventType: string, handler: (event: SAIWebSocketEvent) => void) {
    const handlers = this.eventHandlers.get(eventType) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  disconnectWebSocket() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = undefined;
    }
  }

  // RNET Integration (placeholder - not yet implemented in backend)
  async createCollaborativeSpace(engineId: string, spaceName: string): Promise<{ spaceId: string }> {
    throw new Error('RNET collaboration not yet implemented in backend');
  }

  async joinCollaborativeSpace(engineId: string, spaceId: string): Promise<void> {
    throw new Error('RNET collaboration not yet implemented in backend');
  }

  async leaveCollaborativeSpace(engineId: string): Promise<void> {
    throw new Error('RNET collaboration not yet implemented in backend');
  }

  async getCollaborativeSpaces(): Promise<Array<{ id: string; name: string; engines: number; active: boolean }>> {
    throw new Error('RNET collaboration not yet implemented in backend');
  }
}

// Create singleton instance
export const saiApi = new SAIApiClient();

// Mock data for development/demo (aligned with backend types)
export const mockEngines: EngineState[] = [
  {
    id: 'engine_001',
    user_id: 'user_123',
    config: {
      id: 'engine_001',
      user_id: 'user_123',
      name: 'General Language Model',
      max_symbols: 10000,
      prime_limits: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
      entropy_threshold: 0.1,
      symbol_mapping_type: 'unicode',
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
      },
      custom_mappings: {},
      max_training_size: 1000,
      auto_save: true,
      max_cache_size: 1000,
      validation_enabled: true,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z',
    },
    symbol_mappings: {},
    training_history: [],
    statistics: {
      total_processing_requests: 152,
      total_processed_texts: 15230,
      total_training_sessions: 3,
      total_symbols_learned: 156,
      average_processing_time: 45000000, // 45ms in nanoseconds
      average_training_time: 1800000000000, // 30min in nanoseconds
      last_training_accuracy: 0.89,
      current_entropy_level: 0.75,
      memory_usage: 45234567,
      cache_hit_rate: 0.84,
      custom_metrics: {},
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z',
    },
    last_accessed: '2024-01-20T12:00:00Z',
    version: 1,
    checksum: 'abc123',
  },
  {
    id: 'engine_002',
    user_id: 'user_123',
    config: {
      id: 'engine_002',
      user_id: 'user_123',
      name: 'Scientific Literature Analyzer',
      max_symbols: 20000,
      prime_limits: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37],
      entropy_threshold: 0.15,
      symbol_mapping_type: 'unicode',
      training_settings: {
        batch_size: 16,
        learning_rate: 0.0005,
        max_epochs: 200,
        early_stopping: true,
        patience_epochs: 15,
        validation_split: 0.25,
        min_improvement: 0.0005,
        enable_metrics: true,
        save_checkpoints: true,
        checkpoint_interval: 25,
        priority: 7,
        max_training_duration: 7200,
      },
      custom_mappings: {},
      max_training_size: 2000,
      auto_save: true,
      max_cache_size: 2000,
      validation_enabled: true,
      created_at: '2024-01-10T00:00:00Z',
      updated_at: '2024-01-22T00:00:00Z',
    },
    symbol_mappings: {},
    training_history: [],
    statistics: {
      total_processing_requests: 89,
      total_processed_texts: 8940,
      total_training_sessions: 5,
      total_symbols_learned: 203,
      average_processing_time: 67000000, // 67ms in nanoseconds
      average_training_time: 3600000000000, // 60min in nanoseconds
      last_training_accuracy: 0.73,
      current_entropy_level: 0.82,
      memory_usage: 67834567,
      cache_hit_rate: 0.71,
      custom_metrics: {},
      created_at: '2024-01-10T00:00:00Z',
      updated_at: '2024-01-22T00:00:00Z',
    },
    last_accessed: '2024-01-22T10:30:00Z',
    version: 3,
    checksum: 'def456',
  },
  {
    id: 'engine_003',
    user_id: 'user_123',
    config: {
      id: 'engine_003',
      user_id: 'user_123',
      name: 'Creative Writing Assistant',
      max_symbols: 5000,
      prime_limits: [2, 3, 5, 7, 11, 13, 17, 19, 23],
      entropy_threshold: 0.2,
      symbol_mapping_type: 'unicode',
      training_settings: {
        batch_size: 24,
        learning_rate: 0.002,
        max_epochs: 150,
        early_stopping: false,
        patience_epochs: 20,
        validation_split: 0.15,
        min_improvement: 0.002,
        enable_metrics: true,
        save_checkpoints: true,
        checkpoint_interval: 15,
        priority: 3,
        max_training_duration: 1800,
      },
      custom_mappings: {},
      max_training_size: 500,
      auto_save: true,
      max_cache_size: 500,
      validation_enabled: true,
      created_at: '2024-01-18T00:00:00Z',
      updated_at: '2024-01-21T00:00:00Z',
    },
    symbol_mappings: {},
    training_history: [],
    statistics: {
      total_processing_requests: 34,
      total_processed_texts: 3420,
      total_training_sessions: 2,
      total_symbols_learned: 89,
      average_processing_time: 23000000, // 23ms in nanoseconds
      average_training_time: 900000000000, // 15min in nanoseconds
      last_training_accuracy: 0.42,
      current_entropy_level: 0.91,
      memory_usage: 23456789,
      cache_hit_rate: 0.38,
      custom_metrics: {},
      created_at: '2024-01-18T00:00:00Z',
      updated_at: '2024-01-21T00:00:00Z',
    },
    last_accessed: '2024-01-21T15:45:00Z',
    version: 2,
    checksum: 'ghi789',
  },
];

export default saiApi;