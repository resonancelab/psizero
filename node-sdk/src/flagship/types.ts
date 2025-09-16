// SAI (Symbolic AI) Flagship Service Types

import { BaseEntity, JobStatus, EngineType, PrimeBasis } from '../core/types';

/**
 * AI Engine configuration
 */
export interface EngineConfig {
  /** Engine name */
  name: string;
  /** Engine type */
  type: EngineType;
  /** Associated space ID (optional) */
  spaceId?: string;
  /** Engine description */
  description?: string;
  /** Engine configuration parameters */
  configuration?: EngineConfiguration;
  /** Engine capabilities */
  capabilities?: string[];
  /** Custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Engine configuration parameters
 */
export interface EngineConfiguration {
  /** Base model to use */
  model?: string;
  /** Model parameters */
  parameters?: ModelParameters;
  /** Training configuration */
  training?: TrainingConfiguration;
  /** Inference configuration */
  inference?: InferenceConfiguration;
  /** Quantum enhancement settings */
  quantum?: QuantumEnhancement;
}

/**
 * Model parameters
 */
export interface ModelParameters {
  /** Temperature for randomness (0.0 - 2.0) */
  temperature?: number;
  /** Maximum tokens to generate */
  maxTokens?: number;
  /** Top-p sampling */
  topP?: number;
  /** Top-k sampling */
  topK?: number;
  /** Frequency penalty */
  frequencyPenalty?: number;
  /** Presence penalty */
  presencePenalty?: number;
  /** Stop sequences */
  stopSequences?: string[];
  /** Enable prime signature generation */
  primeSignature?: boolean;
}

/**
 * Training configuration
 */
export interface TrainingConfiguration {
  /** Learning rate */
  learningRate?: number;
  /** Batch size */
  batchSize?: number;
  /** Number of epochs */
  epochs?: number;
  /** Validation split */
  validationSplit?: number;
  /** Early stopping patience */
  earlyStopping?: number;
  /** Quantum noise level */
  quantumNoise?: number;
  /** Prime basis for quantum enhancement */
  primeBasis?: PrimeBasis;
}

/**
 * Inference configuration
 */
export interface InferenceConfiguration {
  /** Enable streaming responses */
  streaming?: boolean;
  /** Response caching */
  caching?: boolean;
  /** Batch inference settings */
  batching?: {
    enabled: boolean;
    maxBatchSize: number;
    maxWaitTime: number;
  };
  /** Safety filters */
  safety?: {
    enabled: boolean;
    categories: string[];
    threshold: number;
  };
}

/**
 * Quantum enhancement settings
 */
export interface QuantumEnhancement {
  /** Enable quantum enhancement */
  enabled: boolean;
  /** Quantum noise level */
  noiseLevel?: number;
  /** Entanglement strength */
  entanglement?: number;
  /** Coherence time */
  coherenceTime?: number;
  /** Prime basis for quantum calculations */
  basis?: number[];
}

/**
 * AI Engine entity
 */
export interface AIEngine extends BaseEntity {
  /** Engine name */
  name: string;
  /** Engine type */
  type: EngineType;
  /** Current status */
  status: 'training' | 'ready' | 'error' | 'updating' | 'archived';
  /** Associated space ID */
  spaceId: string | undefined;
  /** Engine description */
  description: string | undefined;
  /** Engine capabilities */
  capabilities: string[];
  /** Engine configuration */
  configuration: EngineConfiguration;
  /** Engine metrics */
  metrics: EngineMetrics;
  /** Version information */
  version: string;
  /** Last trained timestamp */
  lastTrained: string | undefined;
  /** Model size in parameters */
  modelSize: number | undefined;
}

/**
 * Engine performance metrics
 */
export interface EngineMetrics {
  /** Inference metrics */
  inference: {
    /** Average response time in ms */
    avgResponseTime: number;
    /** Requests per second */
    requestsPerSecond: number;
    /** Success rate */
    successRate: number;
    /** Error rate */
    errorRate: number;
  };
  /** Training metrics */
  training: {
    /** Final training loss */
    finalLoss: number | undefined;
    /** Final accuracy */
    finalAccuracy: number | undefined;
    /** Training time in seconds */
    trainingTime: number | undefined;
    /** Data points trained on */
    dataPoints: number | undefined;
  };
  /** Resource usage */
  resources: {
    /** Memory usage in MB */
    memoryUsage: number;
    /** GPU utilization percentage */
    gpuUtilization: number;
    /** CPU utilization percentage */
    cpuUtilization: number;
  };
  /** Quality metrics */
  quality: {
    /** Coherence score */
    coherence: number | undefined;
    /** Relevance score */
    relevance: number | undefined;
    /** Creativity score */
    creativity: number | undefined;
    /** Safety score */
    safety: number | undefined;
  };
}

/**
 * Training job configuration
 */
export interface TrainingConfig {
  /** Training dataset */
  dataset: TrainingDataset;
  /** Hyperparameters */
  hyperparameters: TrainingHyperparameters;
  /** Training schedule */
  schedule?: TrainingSchedule;
  /** Validation configuration */
  validation?: ValidationConfiguration;
  /** Associated space ID */
  spaceId?: string;
  /** Quantum enhancement */
  quantum?: QuantumTrainingConfig;
}

/**
 * Training dataset configuration
 */
export interface TrainingDataset {
  /** Dataset type */
  type: 'text-corpus' | 'conversation' | 'instruction' | 'custom';
  /** Dataset source */
  source: string;
  /** Preprocessing steps */
  preprocessing?: string[];
  /** Data format */
  format?: 'json' | 'csv' | 'text' | 'parquet';
  /** Dataset size information */
  size?: {
    totalSize: number;
    trainSize: number;
    validationSize: number;
    testSize: number;
  };
}

/**
 * Training hyperparameters
 */
export interface TrainingHyperparameters {
  /** Learning rate */
  learningRate: number;
  /** Batch size */
  batchSize: number;
  /** Number of epochs */
  epochs: number;
  /** Optimizer */
  optimizer?: 'adam' | 'sgd' | 'rmsprop';
  /** Learning rate schedule */
  lrSchedule?: 'constant' | 'linear' | 'cosine' | 'exponential';
  /** Gradient clipping */
  gradientClipping?: number;
  /** Dropout rate */
  dropout?: number;
  /** Weight decay */
  weightDecay?: number;
}

/**
 * Training schedule
 */
export interface TrainingSchedule {
  /** Warmup steps */
  warmupSteps?: number;
  /** Decay strategy */
  decayStrategy?: 'linear' | 'cosine' | 'exponential';
  /** Save checkpoint interval */
  checkpointInterval?: number;
  /** Evaluation interval */
  evaluationInterval?: number;
  /** Early stopping configuration */
  earlyStopping?: {
    enabled: boolean;
    patience: number;
    metric: string;
    minDelta: number;
  };
}

/**
 * Validation configuration
 */
export interface ValidationConfiguration {
  /** Validation split ratio */
  split: number;
  /** Validation metrics to track */
  metrics: string[];
  /** Validation frequency */
  frequency: number;
  /** Validation dataset */
  dataset?: string;
}

/**
 * Quantum training configuration
 */
export interface QuantumTrainingConfig {
  /** Enable quantum training */
  enabled: boolean;
  /** Quantum noise during training */
  noise: number;
  /** Quantum entanglement in weights */
  entanglement: number;
  /** Prime basis for quantum calculations */
  basis: number[];
  /** Quantum optimization algorithm */
  optimizer?: 'quantum-adam' | 'quantum-sgd';
}

/**
 * Training job entity
 */
export interface TrainingJob extends BaseEntity {
  /** Associated engine ID */
  engineId: string;
  /** Job status */
  status: JobStatus;
  /** Training configuration */
  configuration: TrainingConfig;
  /** Training progress */
  progress: TrainingProgress;
  /** Job metrics */
  metrics: TrainingMetrics;
  /** Error information */
  error: string | undefined;
  /** Estimated completion time */
  estimatedCompletion: string | undefined;
  /** Started timestamp */
  startedAt: string | undefined;
  /** Completed timestamp */
  completedAt: string | undefined;
}

/**
 * Training progress information
 */
export interface TrainingProgress {
  /** Current epoch */
  epoch: number;
  /** Total epochs */
  totalEpochs: number;
  /** Current step */
  step: number;
  /** Total steps */
  totalSteps: number;
  /** Current loss */
  loss: number;
  /** Current accuracy */
  accuracy: number;
  /** Validation loss */
  validationLoss: number | undefined;
  /** Validation accuracy */
  validationAccuracy: number | undefined;
  /** Progress percentage */
  percentage: number;
  /** Estimated time remaining */
  estimatedTimeRemaining: number | undefined;
}

/**
 * Training metrics
 */
export interface TrainingMetrics {
  /** Loss history */
  lossHistory: number[];
  /** Accuracy history */
  accuracyHistory: number[];
  /** Validation loss history */
  validationLossHistory: number[];
  /** Validation accuracy history */
  validationAccuracyHistory: number[];
  /** Learning rate history */
  learningRateHistory: number[];
  /** Training time per epoch */
  epochTimes: number[];
  /** Resource usage during training */
  resourceUsage: {
    maxMemory: number;
    avgGpuUtilization: number;
    avgCpuUtilization: number;
  };
}

/**
 * Inference request configuration
 */
export interface InferenceRequest {
  /** Input prompt */
  prompt: string;
  /** Maximum tokens to generate */
  maxTokens?: number;
  /** Temperature for randomness */
  temperature?: number;
  /** Top-p sampling */
  topP?: number;
  /** Top-k sampling */
  topK?: number;
  /** Stop sequences */
  stopSequences?: string[];
  /** Enable streaming response */
  stream?: boolean;
  /** Include prime signature */
  primeSignature?: boolean;
  /** Resonance filtering */
  resonanceFiltering?: {
    threshold: number;
    basis: number[];
  };
  /** Context window settings */
  context?: {
    maxLength: number;
    preserveContext: boolean;
  };
  /** Safety settings */
  safety?: {
    enabled: boolean;
    categories: string[];
  };
}

/**
 * Inference result
 */
export interface InferenceResult {
  /** Generated text */
  text: string;
  /** Confidence score */
  confidence: number;
  /** Prime signature */
  primeSignature: number[];
  /** Resonance score */
  resonanceScore: number;
  /** Number of tokens generated */
  tokens: number;
  /** Processing time in milliseconds */
  processingTime: number;
  /** Finish reason */
  finishReason: 'stop' | 'length' | 'filter' | 'error';
  /** Additional metadata */
  metadata: InferenceMetadata;
}

/**
 * Inference metadata
 */
export interface InferenceMetadata {
  /** Model version used */
  modelVersion: string;
  /** Engine ID */
  engineId: string;
  /** Request timestamp */
  requestTime: string;
  /** Response timestamp */
  responseTime: string;
  /** Token usage details */
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  /** Quality scores */
  qualityScores: {
    coherence: number;
    relevance: number;
    creativity: number;
    safety: number;
  };
  /** Quantum metrics */
  quantumMetrics?: {
    entanglement: number;
    coherence: number;
    primeResonance: number;
  };
}

/**
 * Chat completion request
 */
export interface ChatCompletionRequest {
  /** Conversation messages */
  messages: ChatMessage[];
  /** Model configuration */
  model?: string;
  /** Maximum tokens */
  maxTokens?: number;
  /** Temperature */
  temperature?: number;
  /** Stream response */
  stream?: boolean;
  /** Function calling */
  functions?: ChatFunction[];
  /** Function call configuration */
  functionCall?: 'auto' | 'none' | { name: string };
}

/**
 * Chat message
 */
export interface ChatMessage {
  /** Message role */
  role: 'system' | 'user' | 'assistant' | 'function';
  /** Message content */
  content: string;
  /** Function name (for function messages) */
  name?: string;
  /** Function call information */
  functionCall?: {
    name: string;
    arguments: string;
  };
}

/**
 * Chat function definition
 */
export interface ChatFunction {
  /** Function name */
  name: string;
  /** Function description */
  description: string;
  /** Function parameters schema */
  parameters: Record<string, unknown>;
}

/**
 * Embeddings request
 */
export interface EmbeddingsRequest {
  /** Input text or array of texts */
  input: string | string[];
  /** Model to use for embeddings */
  model?: string;
  /** Embedding dimensions */
  dimensions?: number;
  /** Encoding format */
  encodingFormat?: 'float' | 'base64';
  /** Prime basis for quantum embeddings */
  primeBasis?: number[];
}

/**
 * Embeddings result
 */
export interface EmbeddingsResult {
  /** Generated embeddings */
  data: Embedding[];
  /** Model used */
  model: string;
  /** Token usage */
  usage: {
    promptTokens: number;
    totalTokens: number;
  };
}

/**
 * Individual embedding
 */
export interface Embedding {
  /** Embedding vector */
  embedding: number[];
  /** Input index */
  index: number;
  /** Prime signature */
  primeSignature?: number[];
  /** Resonance score */
  resonanceScore?: number;
}