export interface LanguageModel {
  id: string;
  name: string;
  description?: string;
  baseModel: 'gpt-4' | 'claude-3' | 'llama-2' | 'mistral' | 'custom';
  status: 'ready' | 'training' | 'fine-tuning' | 'error' | 'deploying';
  createdAt: string;
  lastUsed?: string;
  config: {
    maxTokens: number;
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    stopSequences: string[];
    primeBasisIntegration: boolean;
    quantumEnhanced: boolean;
  };
  fineTuning?: {
    currentStep: number;
    totalSteps: number;
    loss: number;
    accuracy: number;
    startTime: string;
    estimatedCompletion?: string;
    datasetSize: number;
  };
  performance: {
    totalTokens: number;
    averageLatency: number;
    successRate: number;
    conversationsCount: number;
    lastWeekUsage: number;
  };
  capabilities: string[];
}

export interface FineTuningJob {
  id: string;
  modelId: string;
  modelName: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  startTime: string;
  estimatedCompletion?: string;
  datasetName: string;
  datasetSize: number;
  metrics: {
    loss: number;
    accuracy: number;
    perplexity: number;
    step: number;
    totalSteps: number;
  };
  hyperparameters: {
    learningRate: number;
    batchSize: number;
    epochs: number;
    warmupSteps: number;
  };
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  modelName: string;
  userId: string;
  startTime: string;
  endTime?: string;
  messageCount: number;
  tokenCount: number;
  status: 'active' | 'completed' | 'error';
  tags: string[];
  summary?: string;
  quality: {
    relevance: number;
    coherence: number;
    helpfulness: number;
    safety: number;
  };
}

export interface InferenceJob {
  id: string;
  modelId: string;
  modelName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  prompt: string;
  response?: string;
  startTime: string;
  completionTime?: string;
  tokenCount: {
    input: number;
    output: number;
    total: number;
  };
  latency: number;
  cost: number;
}

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  type: 'instruction' | 'conversation' | 'completion' | 'classification';
  size: number;
  format: 'jsonl' | 'csv' | 'parquet';
  uploadedAt: string;
  usedBy: string[];
  validation: {
    passed: boolean;
    issues: string[];
    quality: number;
  };
}