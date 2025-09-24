// SAI Engine Types and Interfaces - Aligned with Backend API

// Backend-aligned types (matching Go structs)
export interface SAIConfig {
  id: string;
  user_id: string;
  name: string;
  max_symbols: number;
  prime_limits: number[];
  entropy_threshold: number;
  symbol_mapping_type: 'unicode' | 'ascii' | 'custom';
  training_settings: TrainingConfig;
  custom_mappings: Record<string, unknown>;
  max_training_size: number;
  auto_save: boolean;
  max_cache_size: number;
  validation_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrainingConfig {
  batch_size: number;
  learning_rate: number;
  max_epochs: number;
  early_stopping: boolean;
  patience_epochs: number;
  validation_split: number;
  min_improvement: number;
  enable_metrics: boolean;
  save_checkpoints: boolean;
  checkpoint_interval: number;
  priority: number; // 1-10, higher = more priority
  max_training_duration: number; // seconds
}

export interface SymbolMapping {
  text: string;
  symbol: string;
  prime_signature: number[];
  frequency: number;
  entropy: number;
  last_used: string;
  user_defined: boolean;
  context_patterns: string[];
}

export interface TrainingExample {
  id: string;
  input: string;
  output: string;
  context: Record<string, unknown>;
  weight: number;
  labels: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  validated_at?: string;
}

export interface TrainingSession {
  id: string;
  user_id: string;
  engine_id: string;
  status: 'starting' | 'running' | 'paused' | 'completed' | 'failed';
  progress: number; // 0-100
  current_epoch: number;
  total_epochs: number;
  current_loss: number;
  best_loss: number;
  validation_loss: number;
  learning_rate: number;
  start_time: string;
  end_time?: string;
  last_update_time: string;
  training_examples: number;
  config: TrainingConfig;
  metrics: Record<string, number>;
  error_message?: string;
  checkpoint_path?: string;
}

export interface ProcessingRequest {
  text: string;
  options?: ProcessingOptions;
  context?: Record<string, unknown>;
  return_details: boolean;
  cache_results: boolean;
}

export interface ProcessingOptions {
  max_symbols: number;
  min_entropy: number;
  include_context: boolean;
  filter_patterns: string[];
  custom_mappings: boolean;
  normalize_text: boolean;
  preserve_spacing: boolean;
}

export interface ProcessingResult {
  original_text: string;
  processed_text: string;
  symbols: SymbolMapping[];
  prime_signatures: number[][];
  total_entropy: number;
  processing_time: number; // nanoseconds
  cache_hit: boolean;
  context: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface BatchProcessingRequest {
  texts: string[];
  options?: ProcessingOptions;
  parallel_workers: number;
  context?: Record<string, unknown>;
}

export interface BatchProcessingResult {
  results: ProcessingResult[];
  total_texts: number;
  success_count: number;
  error_count: number;
  total_time: number; // nanoseconds
  average_time: number; // nanoseconds
  context: Record<string, unknown>;
}

export interface EngineState {
  id: string;
  user_id: string;
  config: SAIConfig;
  symbol_mappings: Record<string, SymbolMapping>;
  training_history: TrainingSession[];
  statistics: EngineStatistics;
  last_accessed: string;
  version: number;
  checksum: string;
}

export interface EngineStatistics {
  total_processing_requests: number;
  total_processed_texts: number;
  total_training_sessions: number;
  total_symbols_learned: number;
  average_processing_time: number; // nanoseconds
  average_training_time: number; // nanoseconds
  last_training_accuracy: number;
  current_entropy_level: number;
  memory_usage: number;
  cache_hit_rate: number;
  custom_metrics: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export interface EngineManagerStats {
  total_engines: number;
  active_engines: number;
  idle_engines: number;
  total_users: number;
  engines_created: number;
  engines_destroyed: number;
  evictions_performed: number;
  average_engine_age: number; // nanoseconds
  memory_usage: number;
  user_distribution: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export interface SAIMetrics {
  symbol_mapping_count: number;
  active_training_sessions: number;
  queued_training_jobs: number;
  total_processed_texts: number;
  average_symbols_per_text: number;
  entropy_distribution: Record<string, number>;
  prime_usage_stats: Record<number, number>;
  training_success_rate: number;
  cache_efficiency: number;
  resource_utilization: Record<string, number>;
}

// Frontend-specific types
export type EngineStatus = 'starting' | 'running' | 'paused' | 'completed' | 'failed' | 'idle';
export type EngineVisibility = 'private' | 'shared' | 'public';

export interface EngineSearchFilters {
  status?: EngineStatus[];
  name?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  hasTrainingHistory?: boolean;
}

export interface EngineSortOptions {
  field: 'name' | 'created_at' | 'last_accessed' | 'total_processed_texts';
  direction: 'asc' | 'desc';
}

// API Request/Response types
export interface CreateEngineRequest {
  id: string;
  user_id: string;
  name: string;
  max_symbols?: number;
  prime_limits?: number[];
  entropy_threshold?: number;
  symbol_mapping_type?: 'unicode' | 'ascii' | 'custom';
  training_settings?: Partial<TrainingConfig>;
  custom_mappings?: Record<string, unknown>;
  max_training_size?: number;
  auto_save?: boolean;
  max_cache_size?: number;
  validation_enabled?: boolean;
}

export interface UpdateEngineRequest {
  name?: string;
  max_symbols?: number;
  prime_limits?: number[];
  entropy_threshold?: number;
  symbol_mapping_type?: 'unicode' | 'ascii' | 'custom';
  training_settings?: Partial<TrainingConfig>;
  custom_mappings?: Record<string, unknown>;
  max_training_size?: number;
  auto_save?: boolean;
  max_cache_size?: number;
  validation_enabled?: boolean;
}

export interface StartTrainingRequest {
  data: TrainingExample[];
  config?: TrainingConfig;
}

// API Response wrapper
export interface APIResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  request_id: string;
  timestamp: string;
}

// WebSocket Event Types
export interface WebSocketMessage {
  type: 'training_progress' | 'training_complete' | 'error' | 'status';
  user_id: string;
  engine_id: string;
  session_id?: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface TrainingProgressEvent extends WebSocketMessage {
  type: 'training_progress';
  data: {
    session: TrainingSession;
    estimated_time_remaining?: number;
  };
}

export interface TrainingCompleteEvent extends WebSocketMessage {
  type: 'training_complete';
  data: {
    session: TrainingSession;
    success: boolean;
    final_metrics: Record<string, number>;
  };
}

export interface EngineStatusEvent extends WebSocketMessage {
  type: 'status';
  data: {
    status: EngineStatus;
    message?: string;
  };
}

export type SAIWebSocketEvent = TrainingProgressEvent | TrainingCompleteEvent | EngineStatusEvent;

// Error Types
export interface SAIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export interface ValidationError extends SAIError {
  field: string;
  value: unknown;
  constraint: string;
}

// Helper function to convert backend timestamps to Date objects
export function parseEngineState(apiResponse: EngineState): EngineState {
  return {
    ...apiResponse,
    last_accessed: apiResponse.last_accessed,
    config: {
      ...apiResponse.config,
      created_at: apiResponse.config.created_at,
      updated_at: apiResponse.config.updated_at,
    },
    training_history: apiResponse.training_history.map(session => ({
      ...session,
      start_time: session.start_time,
      end_time: session.end_time,
      last_update_time: session.last_update_time,
    })),
    statistics: {
      ...apiResponse.statistics,
      created_at: apiResponse.statistics.created_at,
      updated_at: apiResponse.statistics.updated_at,
    },
  };
}

// Helper to create default configs
export function createDefaultSAIConfig(userId: string, engineId: string, name: string): CreateEngineRequest {
  return {
    id: engineId,
    user_id: userId,
    name,
    max_symbols: 10000,
    prime_limits: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47],
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
      max_training_duration: 3600, // 1 hour
    },
    custom_mappings: {},
    max_training_size: 1000,
    auto_save: true,
    max_cache_size: 1000,
    validation_enabled: true,
  };
}

export function createDefaultTrainingConfig(): TrainingConfig {
  return {
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
    max_training_duration: 3600, // 1 hour
  };
}