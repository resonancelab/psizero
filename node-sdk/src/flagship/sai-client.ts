// SAI (Symbolic AI) Flagship Service Client

import { EventEmitter } from 'eventemitter3';
import { DynamicApi } from '../dynamic-api';
import { WebSocketManager } from '../realtime/websocket-manager';
import {
  AIEngine,
  EngineConfig,
  TrainingJob,
  TrainingConfig,
  InferenceRequest,
  InferenceResult,
  ChatCompletionRequest,
  EmbeddingsRequest,
  EmbeddingsResult,
  TrainingProgress
} from './types';
import { PaginatedResponse } from '../core/types';
import { loggers } from '../utils/logger';

/**
 * Enhanced training job with real-time progress streaming
 */
export class TrainingJobWithProgress extends EventEmitter {
  constructor(
    private jobData: TrainingJob,
    private wsManager: WebSocketManager
  ) {
    super();
    this.setupProgressStreaming();
  }

  /**
   * Get job data
   */
  get data(): TrainingJob {
    return this.jobData;
  }

  /**
   * Get job ID
   */
  get id(): string {
    return this.jobData.id;
  }

  /**
   * Get current status
   */
  get status(): TrainingJob['status'] {
    return this.jobData.status;
  }

  /**
   * Get progress information
   */
  get progress(): TrainingProgress {
    return this.jobData.progress;
  }

  /**
   * Setup real-time progress streaming
   */
  private async setupProgressStreaming(): Promise<void> {
    try {
      const progressStream = await this.wsManager.streamTrainingProgress(this.jobData.id);
      
      progressStream.onmessage = (event) => {
        try {
          const progress = JSON.parse(event.data) as TrainingProgress & { status?: string; result?: unknown };
          
          // Update internal job data
          this.jobData.progress = progress;
          if (progress.status) {
            this.jobData.status = progress.status as TrainingJob['status'];
          }
          
          this.emit('progress', progress);
          
          if (progress.status === 'completed') {
            this.emit('completed', progress.result);
          } else if (progress.status === 'failed') {
            this.emit('failed', progress);
          }
        } catch (error) {
          loggers.sai.error('Failed to parse training progress', error);
          this.emit('error', error);
        }
      };

      progressStream.onerror = (error) => {
        loggers.sai.error('Training progress stream error', error);
        this.emit('error', error);
      };

      progressStream.onopen = () => {
        loggers.sai.debug('Training progress stream connected', { jobId: this.jobData.id });
        this.emit('streamConnected');
      };

    } catch (error) {
      loggers.sai.error('Failed to setup training progress stream', error);
      this.emit('error', error);
    }
  }

  /**
   * Stop the training job
   */
  async stop(): Promise<void> {
    // This would call the API to stop the training job
    // Implementation depends on the actual API endpoint
    loggers.sai.info('Training job stop requested', { jobId: this.id });
  }

  /**
   * Get training logs
   */
  async getLogs(): Promise<string[]> {
    // This would fetch training logs from the API
    // Implementation depends on the actual API endpoint
    loggers.sai.debug('Training logs requested', { jobId: this.id });
    return [];
  }
}

/**
 * SAI Client - Flagship AI service with symbolic reasoning
 */
export class SAIClient {
  constructor(
    private api: DynamicApi,
    private wsManager: WebSocketManager
  ) {}

  /**
   * Create a new AI engine
   */
  async createEngine(config: EngineConfig): Promise<AIEngine> {
    loggers.sai.debug('Creating AI engine', config);
    const apiMethods = this.api.createApiMethods();
    const createMethod = apiMethods.createEngine;
    if (!createMethod) {
      throw new Error('SAI createEngine method not available');
    }
    const engine = await createMethod(config);
    loggers.sai.info('AI engine created', { engineId: engine.id, name: config.name });
    return engine;
  }

  /**
   * List available engines
   */
  async listEngines(options?: {
    page?: number;
    limit?: number;
    status?: AIEngine['status'];
    type?: AIEngine['type'];
    spaceId?: string;
  }): Promise<PaginatedResponse<AIEngine>> {
    loggers.sai.debug('Listing AI engines', options);
    const apiMethods = this.api.createApiMethods();
    const listMethod = apiMethods.listEngines;
    if (!listMethod) {
      throw new Error('SAI listEngines method not available');
    }
    return await listMethod(options);
  }

  /**
   * Get engine by ID
   */
  async getEngine(engineId: string): Promise<AIEngine> {
    loggers.sai.debug('Getting AI engine', { engineId });
    const apiMethods = this.api.createApiMethods();
    const getMethod = apiMethods.getEngine;
    if (!getMethod) {
      throw new Error('SAI getEngine method not available');
    }
    return await getMethod({ id: engineId });
  }

  /**
   * Update engine configuration
   */
  async updateEngine(engineId: string, updates: Partial<EngineConfig>): Promise<AIEngine> {
    loggers.sai.debug('Updating AI engine', { engineId, updates });
    const apiMethods = this.api.createApiMethods();
    const updateMethod = apiMethods.updateEngine;
    if (!updateMethod) {
      throw new Error('SAI updateEngine method not available');
    }
    const engine = await updateMethod({ id: engineId, ...updates });
    loggers.sai.info('AI engine updated', { engineId });
    return engine;
  }

  /**
   * Delete an engine
   */
  async deleteEngine(engineId: string): Promise<void> {
    loggers.sai.debug('Deleting AI engine', { engineId });
    const apiMethods = this.api.createApiMethods();
    const deleteMethod = apiMethods.deleteEngine;
    if (!deleteMethod) {
      throw new Error('SAI deleteEngine method not available');
    }
    await deleteMethod({ id: engineId });
    loggers.sai.info('AI engine deleted', { engineId });
  }

  /**
   * Start training an AI engine with real-time progress monitoring
   */
  async startTraining(engineId: string, config: TrainingConfig): Promise<TrainingJobWithProgress> {
    loggers.sai.debug('Starting AI training', { engineId, config });
    const apiMethods = this.api.createApiMethods();
    const startMethod = apiMethods.startTraining;
    if (!startMethod) {
      throw new Error('SAI startTraining method not available');
    }
    const job = await startMethod({ engineId, ...config });

    loggers.sai.info('AI training started', {
      jobId: job.id,
      engineId,
      estimatedCompletion: job.estimatedCompletion
    });

    // Return enhanced job with real-time progress streaming
    return new TrainingJobWithProgress(job, this.wsManager);
  }

  /**
   * Get training job status
   */
  async getTrainingJob(jobId: string): Promise<TrainingJob> {
    loggers.sai.debug('Getting training job', { jobId });
    const apiMethods = this.api.createApiMethods();
    const getJobMethod = apiMethods.getTrainingJob;
    if (!getJobMethod) {
      throw new Error('SAI getTrainingJob method not available');
    }
    return await getJobMethod({ id: jobId });
  }

  /**
   * Stop training job
   */
  async stopTraining(jobId: string): Promise<void> {
    loggers.sai.debug('Stopping training job', { jobId });
    const apiMethods = this.api.createApiMethods();
    const stopMethod = apiMethods.stopTraining;
    if (!stopMethod) {
      throw new Error('SAI stopTraining method not available');
    }
    await stopMethod({ id: jobId });
    loggers.sai.info('Training job stopped', { jobId });
  }

  /**
   * Get training job logs
   */
  async getTrainingLogs(jobId: string): Promise<EventSource> {
    loggers.sai.debug('Getting training logs', { jobId });
    const apiMethods = this.api.createApiMethods();
    const getLogsMethod = apiMethods.getTrainingLogs;
    if (!getLogsMethod) {
      throw new Error('SAI getTrainingLogs method not available');
    }
    return await getLogsMethod({ id: jobId });
  }

  /**
   * Generate text using trained AI engine
   */
  async processText(engineId: string, request: InferenceRequest): Promise<InferenceResult> {
    loggers.sai.debug('Processing text', { 
      engineId, 
      promptLength: request.prompt.length,
      maxTokens: request.maxTokens 
    });

    const apiMethods = this.api.createApiMethods();
    const startTime = performance.now();

    const processMethod = apiMethods.processText;
    if (!processMethod) {
      throw new Error('SAI processText method not available');
    }
    const result = await processMethod({ engineId, ...request });
    
    const processingTime = performance.now() - startTime;
    loggers.sai.info('Text processed', { 
      engineId, 
      tokensGenerated: result.tokens,
      processingTime,
      confidence: result.confidence 
    });

    return result;
  }

  /**
   * Chat completion with conversation context
   */
  async chatCompletion(engineId: string, request: ChatCompletionRequest): Promise<InferenceResult> {
    loggers.sai.debug('Chat completion', { 
      engineId, 
      messageCount: request.messages.length,
      hasFunction: !!request.functions?.length 
    });

    const apiMethods = this.api.createApiMethods();
    const chatMethod = apiMethods.chatCompletion;
    if (!chatMethod) {
      throw new Error('SAI chatCompletion method not available');
    }
    const result = await chatMethod({ engineId, ...request });
    
    loggers.sai.info('Chat completion generated', { 
      engineId, 
      tokensGenerated: result.tokens 
    });

    return result;
  }

  /**
   * Batch inference for multiple inputs
   */
  async batchInference(engineId: string, requests: InferenceRequest[]): Promise<InferenceResult[]> {
    loggers.sai.debug('Batch inference', { 
      engineId, 
      batchSize: requests.length 
    });

    const apiMethods = this.api.createApiMethods();
    const batchMethod = apiMethods.batchInference;
    if (!batchMethod) {
      throw new Error('SAI batchInference method not available');
    }
    const results = await batchMethod({ engineId, requests });
    
    loggers.sai.info('Batch inference completed', { 
      engineId, 
      batchSize: requests.length,
      totalTokens: results.reduce((sum: number, r: InferenceResult) => sum + r.tokens, 0)
    });

    return results;
  }

  /**
   * Generate embeddings for text inputs
   */
  async getEmbeddings(engineId: string, request: EmbeddingsRequest): Promise<EmbeddingsResult> {
    loggers.sai.debug('Getting embeddings', { 
      engineId, 
      inputType: Array.isArray(request.input) ? 'array' : 'string',
      inputCount: Array.isArray(request.input) ? request.input.length : 1
    });

    const apiMethods = this.api.createApiMethods();
    const embeddingsMethod = apiMethods.getEmbeddings;
    if (!embeddingsMethod) {
      throw new Error('SAI getEmbeddings method not available');
    }
    const result = await embeddingsMethod({ engineId, ...request });
    
    loggers.sai.info('Embeddings generated', { 
      engineId, 
      embeddingCount: result.data.length,
      dimensions: result.data[0]?.embedding.length 
    });

    return result;
  }

  /**
   * Add training data to an engine
   */
  async addTrainingData(engineId: string, data: {
    format: 'json' | 'csv' | 'text';
    content: string | Record<string, unknown>[];
    metadata?: Record<string, unknown>;
  }): Promise<{ datasetId: string; size: number }> {
    loggers.sai.debug('Adding training data', { 
      engineId, 
      format: data.format,
      contentSize: typeof data.content === 'string' ? data.content.length : data.content.length
    });

    const apiMethods = this.api.createApiMethods();
    const addDataMethod = apiMethods.addTrainingData;
    if (!addDataMethod) {
      throw new Error('SAI addTrainingData method not available');
    }
    const result = await addDataMethod({ engineId, ...data });
    
    loggers.sai.info('Training data added', { 
      engineId, 
      datasetId: result.datasetId,
      size: result.size 
    });

    return result;
  }

  /**
   * Get training data for an engine
   */
  async getTrainingData(engineId: string, options?: {
    page?: number;
    limit?: number;
    format?: 'json' | 'csv' | 'text';
  }): Promise<PaginatedResponse<{
    id: string;
    format: string;
    size: number;
    createdAt: string;
    metadata: Record<string, unknown>;
  }>> {
    loggers.sai.debug('Getting training data', { engineId, options });
    const apiMethods = this.api.createApiMethods();
    const getDataMethod = apiMethods.getTrainingData;
    if (!getDataMethod) {
      throw new Error('SAI getTrainingData method not available');
    }
    return await getDataMethod({ engineId, ...options });
  }

  /**
   * Get engine performance metrics
   */
  async getEngineMetrics(engineId: string, options?: {
    timeRange?: 'hour' | 'day' | 'week' | 'month';
    metrics?: string[];
  }): Promise<{
    inference: Record<string, number>;
    training: Record<string, number>;
    resources: Record<string, number>;
    quality: Record<string, number>;
  }> {
    loggers.sai.debug('Getting engine metrics', { engineId, options });
    const apiMethods = this.api.createApiMethods();
    const getMetricsMethod = apiMethods.getEngineMetrics;
    if (!getMetricsMethod) {
      throw new Error('SAI getEngineMetrics method not available');
    }
    return await getMetricsMethod({ engineId, ...options });
  }

  /**
   * Clone an existing engine
   */
  async cloneEngine(sourceEngineId: string, config: {
    name: string;
    description?: string;
    spaceId?: string;
  }): Promise<AIEngine> {
    loggers.sai.debug('Cloning engine', { sourceEngineId, config });
    const apiMethods = this.api.createApiMethods();
    const cloneMethod = apiMethods.cloneEngine;
    if (!cloneMethod) {
      throw new Error('SAI cloneEngine method not available');
    }
    const engine = await cloneMethod({ sourceEngineId, ...config });
    
    loggers.sai.info('Engine cloned', { 
      sourceEngineId, 
      newEngineId: engine.id 
    });

    return engine;
  }

  /**
   * Export engine model
   */
  async exportEngine(engineId: string, format: 'onnx' | 'tensorflow' | 'pytorch' = 'onnx'): Promise<Blob> {
    loggers.sai.debug('Exporting engine', { engineId, format });
    const apiMethods = this.api.createApiMethods();
    const exportMethod = apiMethods.exportEngine;
    if (!exportMethod) {
      throw new Error('SAI exportEngine method not available');
    }
    const blob = await exportMethod({ engineId, format });
    
    loggers.sai.info('Engine exported', { 
      engineId, 
      format, 
      size: blob.size 
    });

    return blob;
  }

  /**
   * Import engine model
   */
  async importEngine(data: Blob | File, config: {
    name: string;
    format: 'onnx' | 'tensorflow' | 'pytorch';
    spaceId?: string;
  }): Promise<AIEngine> {
    loggers.sai.debug('Importing engine', { 
      format: config.format,
      name: config.name,
      dataSize: data.size 
    });

    const apiMethods = this.api.createApiMethods();
    const importMethod = apiMethods.importEngine;
    if (!importMethod) {
      throw new Error('SAI importEngine method not available');
    }
    const engine = await importMethod({ data, ...config });
    
    loggers.sai.info('Engine imported', { 
      engineId: engine.id,
      name: config.name 
    });

    return engine;
  }
}