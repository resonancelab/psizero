# Nomyx Resonance Platform SDK Implementation Guide

## Leveraging Existing Dynamic API Foundation

The existing [`dynamic-api.ts`](src/dynamic-api.ts) provides a sophisticated foundation with:

- ✅ **Rate Limiting**: Built-in per-endpoint rate limiting with configurable limits
- ✅ **Request Queuing**: Concurrent request management with configurable concurrency 
- ✅ **Retry Logic**: Configurable retry strategies with exponential backoff
- ✅ **Dynamic Method Generation**: Automatic API method creation from configuration
- ✅ **Authentication**: Built-in token management and header customization
- ✅ **Error Handling**: Comprehensive error interception and handling

## Enhanced SDK Architecture Using Dynamic API

### Core Resonance Client Implementation

```typescript
// src/resonance-client.ts
import { DynamicApi, ApiConfig, EndpointConfig } from './dynamic-api';
import { WebSocketManager } from './realtime/websocket-manager';
import { RNETClient } from './foundation/rnet-client';
import { SAIClient } from './flagship/sai-client';
// ... other imports

export interface ResonanceClientConfig {
  apiKey: string;
  baseURL?: string;
  environment?: 'production' | 'sandbox';
  timeout?: number;
  retries?: number;
  realtime?: RealtimeConfig;
  debug?: boolean;
}

export class ResonanceClient {
  private dynamicApi: DynamicApi;
  private wsManager: WebSocketManager;
  
  // API Clients
  public readonly rnet: RNETClient;      // Foundational layer
  public readonly sai: SAIClient;        // Flagship AI service
  public readonly engines: {             // Specialized engines
    srs: SRSClient;
    hqe: HQEClient;
    qsem: QSEMClient;
    nlc: NLCClient;
    qcr: QCRClient;
    iching: IChingClient;
    unified: UnifiedClient;
  };

  constructor(config: ResonanceClientConfig) {
    // Create enhanced API configuration
    const apiConfig = this.createApiConfig(config);
    this.dynamicApi = new DynamicApi(apiConfig);
    
    // Initialize WebSocket manager for real-time features
    this.wsManager = new WebSocketManager(config);
    
    // Initialize all API clients
    this.rnet = new RNETClient(this.dynamicApi, this.wsManager);
    this.sai = new SAIClient(this.dynamicApi, this.wsManager);
    this.engines = {
      srs: new SRSClient(this.dynamicApi),
      hqe: new HQEClient(this.dynamicApi, this.wsManager),
      qsem: new QSEMClient(this.dynamicApi),
      nlc: new NLCClient(this.dynamicApi, this.wsManager),
      qcr: new QCRClient(this.dynamicApi, this.wsManager),
      iching: new IChingClient(this.dynamicApi),
      unified: new UnifiedClient(this.dynamicApi)
    };
  }

  private createApiConfig(config: ResonanceClientConfig): ApiConfig {
    return {
      baseUrl: config.baseURL || 'https://api.nomyx.dev',
      timeout: config.timeout || 30000,
      globalHeaders: {
        'Content-Type': 'application/json',
        'X-API-Key': config.apiKey,
        'User-Agent': '@nomyx/resonance-sdk/1.0.0'
      },
      endpoints: {
        ...this.getRNETEndpoints(),
        ...this.getSAIEndpoints(),
        ...this.getEngineEndpoints()
      },
      globalRetryConfig: {
        maxRetries: config.retries || 3,
        retryDelay: 1000,
        retryCondition: (error) => {
          const status = error.response?.status;
          return status === 429 || status >= 500;
        }
      },
      queueConcurrency: 10,
      responseInterceptor: this.createResponseInterceptor(),
      errorInterceptor: this.createErrorInterceptor()
    };
  }
}
```

## API Endpoint Configurations

### RNET (Foundational Layer) Endpoints

```typescript
// Foundation layer - Resonance Spaces with real-time collaboration
private getRNETEndpoints(): Record<string, EndpointConfig> {
  return {
    // Space Management
    createSpace: {
      method: 'POST',
      path: '/v1/spaces',
      rateLimitPerSecond: 5,
      retryConfig: { maxRetries: 3, retryDelay: 1000 }
    },
    listSpaces: {
      method: 'GET',
      path: '/v1/spaces',
      rateLimitPerSecond: 10
    },
    getSpace: {
      method: 'GET',
      path: '/v1/spaces/:id',
      params: ['id'],
      rateLimitPerSecond: 15
    },
    updateSpace: {
      method: 'PATCH',
      path: '/v1/spaces/:id',
      params: ['id'],
      rateLimitPerSecond: 5
    },
    updateSpaceBasis: {
      method: 'POST',
      path: '/v1/spaces/:id/basis',
      params: ['id'],
      rateLimitPerSecond: 2 // Disruptive operation
    },
    
    // Session Management (Real-time)
    createSession: {
      method: 'POST',
      path: '/v1/spaces/:spaceId/sessions',
      params: ['spaceId'],
      rateLimitPerSecond: 10
    },
    
    // State Synchronization
    getSnapshot: {
      method: 'GET',
      path: '/v1/spaces/:id/snapshot',
      params: ['id'],
      rateLimitPerSecond: 20
    },
    proposeDelta: {
      method: 'POST',
      path: '/v1/spaces/:id/deltas',
      params: ['id'],
      rateLimitPerSecond: 30 // High frequency for real-time collab
    },
    
    // Telemetry Streams (SSE handled separately)
    getTelemetry: {
      method: 'GET',
      path: '/v1/spaces/:id/telemetry',
      params: ['id'],
      responseType: 'stream'
    }
  };
}
```

### SAI (Flagship Service) Endpoints

```typescript
// Flagship AI service - Symbolic AI with comprehensive capabilities
private getSAIEndpoints(): Record<string, EndpointConfig> {
  return {
    // Engine Management
    createEngine: {
      method: 'POST',
      path: '/v1/engines',
      rateLimitPerSecond: 3,
      retryConfig: { maxRetries: 2, retryDelay: 2000 }
    },
    listEngines: {
      method: 'GET',
      path: '/v1/engines',
      rateLimitPerSecond: 10
    },
    getEngine: {
      method: 'GET',
      path: '/v1/engines/:id',
      params: ['id'],
      rateLimitPerSecond: 15
    },
    updateEngine: {
      method: 'PUT',
      path: '/v1/engines/:id',
      params: ['id'],
      rateLimitPerSecond: 5
    },
    deleteEngine: {
      method: 'DELETE',
      path: '/v1/engines/:id',
      params: ['id'],
      rateLimitPerSecond: 2
    },
    
    // Training Operations
    startTraining: {
      method: 'POST',
      path: '/v1/training/jobs',
      rateLimitPerSecond: 2,
      retryConfig: { maxRetries: 2, retryDelay: 3000 }
    },
    getTrainingJob: {
      method: 'GET',
      path: '/v1/training/jobs/:id',
      params: ['id'],
      rateLimitPerSecond: 20
    },
    stopTraining: {
      method: 'POST',
      path: '/v1/training/jobs/:id/stop',
      params: ['id'],
      rateLimitPerSecond: 5
    },
    getTrainingLogs: {
      method: 'GET',
      path: '/v1/training/jobs/:id/logs',
      params: ['id'],
      responseType: 'stream'
    },
    
    // Inference Operations
    processText: {
      method: 'POST',
      path: '/v1/inference/generate',
      rateLimitPerSecond: 10,
      retryConfig: { maxRetries: 3, retryDelay: 1000 }
    },
    chatCompletion: {
      method: 'POST',
      path: '/v1/inference/chat',
      rateLimitPerSecond: 15
    },
    batchInference: {
      method: 'POST',
      path: '/v1/inference/batch',
      rateLimitPerSecond: 2
    },
    getEmbeddings: {
      method: 'POST',
      path: '/v1/inference/embeddings',
      rateLimitPerSecond: 20
    },
    
    // Data Management
    addTrainingData: {
      method: 'POST',
      path: '/v1/engines/:id/training-data',
      params: ['id'],
      rateLimitPerSecond: 10
    },
    getTrainingData: {
      method: 'GET',
      path: '/v1/engines/:id/training-data',
      params: ['id'],
      rateLimitPerSecond: 10
    }
  };
}
```

### Specialized Engine Endpoints

```typescript
// All specialized engines with their unique capabilities
private getEngineEndpoints(): Record<string, EndpointConfig> {
  return {
    // SRS - Symbolic Resonance System
    'srs.solve': {
      method: 'POST',
      path: '/v1/srs/solve',
      rateLimitPerSecond: 5,
      retryConfig: { maxRetries: 2, retryDelay: 2000 }
    },
    'srs.getProblems': {
      method: 'GET',
      path: '/v1/srs/problems',
      rateLimitPerSecond: 10
    },
    'srs.getStatus': {
      method: 'GET',
      path: '/v1/srs/status',
      rateLimitPerSecond: 20
    },
    
    // HQE - Holographic Quantum Encoder
    'hqe.simulate': {
      method: 'POST',
      path: '/v1/hqe/simulate',
      rateLimitPerSecond: 3,
      retryConfig: { maxRetries: 2, retryDelay: 3000 }
    },
    'hqe.getSupportedPrimes': {
      method: 'GET',
      path: '/v1/hqe/primes',
      rateLimitPerSecond: 10
    },
    'hqe.getStatus': {
      method: 'GET',
      path: '/v1/hqe/status',
      rateLimitPerSecond: 20
    },
    
    // QSEM - Quantum Semantic Engine
    'qsem.encode': {
      method: 'POST',
      path: '/v1/qsem/encode',
      rateLimitPerSecond: 10,
      retryConfig: { maxRetries: 3, retryDelay: 1000 }
    },
    'qsem.computeResonance': {
      method: 'POST',
      path: '/v1/qsem/resonance',
      rateLimitPerSecond: 10
    },
    'qsem.getSupportedBasis': {
      method: 'GET',
      path: '/v1/qsem/basis',
      rateLimitPerSecond: 15
    },
    'qsem.getStatus': {
      method: 'GET',
      path: '/v1/qsem/status',
      rateLimitPerSecond: 20
    },
    
    // NLC - Non-Local Communication
    'nlc.createSession': {
      method: 'POST',
      path: '/v1/nlc/sessions',
      rateLimitPerSecond: 5,
      retryConfig: { maxRetries: 2, retryDelay: 2000 }
    },
    'nlc.getSession': {
      method: 'GET',
      path: '/v1/nlc/sessions/:id',
      params: ['id'],
      rateLimitPerSecond: 15
    },
    'nlc.closeSession': {
      method: 'DELETE',
      path: '/v1/nlc/sessions/:id',
      params: ['id'],
      rateLimitPerSecond: 5
    },
    'nlc.sendMessage': {
      method: 'POST',
      path: '/v1/nlc/sessions/:id/messages',
      params: ['id'],
      rateLimitPerSecond: 20
    },
    'nlc.getMessages': {
      method: 'GET',
      path: '/v1/nlc/sessions/:id/messages',
      params: ['id'],
      rateLimitPerSecond: 15
    },
    'nlc.getChannelInfo': {
      method: 'GET',
      path: '/v1/nlc/channels',
      rateLimitPerSecond: 10
    },
    'nlc.getStatus': {
      method: 'GET',
      path: '/v1/nlc/status',
      rateLimitPerSecond: 20
    },
    
    // QCR - Quantum Consciousness Resonance
    'qcr.createSession': {
      method: 'POST',
      path: '/v1/qcr/sessions',
      rateLimitPerSecond: 3,
      retryConfig: { maxRetries: 2, retryDelay: 2000 }
    },
    'qcr.observe': {
      method: 'POST',
      path: '/v1/qcr/sessions/:id/observe',
      params: ['id'],
      rateLimitPerSecond: 10
    },
    'qcr.getSession': {
      method: 'GET',
      path: '/v1/qcr/sessions/:id',
      params: ['id'],
      rateLimitPerSecond: 15
    },
    'qcr.getStatus': {
      method: 'GET',
      path: '/v1/qcr/status',
      rateLimitPerSecond: 20
    },
    
    // I-Ching - Quantum Oracle
    'iching.evolve': {
      method: 'POST',
      path: '/v1/iching/evolve',
      rateLimitPerSecond: 5,
      retryConfig: { maxRetries: 3, retryDelay: 1000 }
    },
    'iching.getStatus': {
      method: 'GET',
      path: '/v1/iching/status',
      rateLimitPerSecond: 20
    },
    
    // Unified Physics Engine
    'unified.computeGravity': {
      method: 'POST',
      path: '/v1/unified/gravity/compute',
      rateLimitPerSecond: 5,
      retryConfig: { maxRetries: 2, retryDelay: 2000 }
    },
    'unified.getStatus': {
      method: 'GET',
      path: '/v1/unified/status',
      rateLimitPerSecond: 20
    }
  };
}
```

## Real-Time Integration Architecture

### WebSocket Manager for RNET Collaboration

```typescript
// src/realtime/websocket-manager.ts
export class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map();
  private eventBus: EventEmitter = new EventEmitter();
  
  // Connect to RNET space for real-time collaboration
  async connectToSpace(spaceId: string, sessionToken: string): Promise<SpaceSession> {
    const wsUrl = `wss://rt.nomyx.dev/spaces/${spaceId}?token=${sessionToken}`;
    const ws = new WebSocket(wsUrl);
    
    const session = new SpaceSession(spaceId, ws, this.eventBus);
    this.connections.set(spaceId, ws);
    
    return session;
  }
  
  // Handle HQE real-time simulation updates
  async streamHQESimulation(simulationId: string): Promise<EventSource> {
    const sseUrl = `https://api.nomyx.dev/v1/hqe/simulations/${simulationId}/stream`;
    return new EventSource(sseUrl);
  }
  
  // Handle SAI training progress streams
  async streamTrainingProgress(jobId: string): Promise<EventSource> {
    const sseUrl = `https://api.nomyx.dev/v1/training/jobs/${jobId}/stream`;
    return new EventSource(sseUrl);
  }
}

// Real-time RNET space session
export class SpaceSession extends EventEmitter {
  constructor(
    public readonly spaceId: string,
    private ws: WebSocket,
    private eventBus: EventEmitter
  ) {
    super();
    this.setupWebSocketHandlers();
  }
  
  // Propose delta changes to space state
  async proposeDelta(delta: SpaceDelta): Promise<void> {
    this.ws.send(JSON.stringify({
      type: 'propose_delta',
      delta
    }));
  }
  
  // Real-time event handlers
  private setupWebSocketHandlers(): void {
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'delta':
          this.emit('deltaApplied', message.delta);
          break;
        case 'telemetry':
          this.emit('telemetry', message.metrics);
          break;
        case 'member_joined':
          this.emit('memberJoined', message.member);
          break;
        case 'collapse':
          this.emit('collapse', message.event);
          break;
      }
    };
  }
}
```

## Enhanced Error Handling Strategy

### Resonance-Specific Error Classes

```typescript
// src/core/errors.ts
export class ResonanceError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'ResonanceError';
  }
}

export class SpaceError extends ResonanceError {
  constructor(code: string, message: string, public spaceId?: string) {
    super(code, message);
    this.name = 'SpaceError';
  }
}

export class EngineError extends ResonanceError {
  constructor(code: string, message: string, public engineType?: string) {
    super(code, message);
    this.name = 'EngineError';
  }
}

// Error interceptor for common resonance platform errors
private createErrorInterceptor() {
  return (error: any) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 429:
          throw new ResonanceError('RATE_LIMITED', 'Rate limit exceeded', data, true);
        case 503:
          throw new ResonanceError('SERVICE_UNAVAILABLE', 'Service temporarily unavailable', data, true);
        case 409:
          throw new SpaceError('VERSION_CONFLICT', 'Space version conflict - fetch latest snapshot', data.spaceId);
        case 422:
          throw new EngineError('ENGINE_BUSY', 'Engine is currently processing another request', data.engineType);
        default:
          throw new ResonanceError('API_ERROR', data.message || 'Unknown API error', data);
      }
    }
    
    throw new ResonanceError('NETWORK_ERROR', 'Network request failed', error);
  };
}
```

## Client Implementation Examples

### RNET Client (Foundational Layer)

```typescript
// src/foundation/rnet-client.ts
export class RNETClient {
  constructor(
    private api: DynamicApi,
    private wsManager: WebSocketManager
  ) {}
  
  async createSpace(config: SpaceConfig): Promise<Space> {
    const apiMethods = this.api.createApiMethods();
    return await apiMethods.createSpace(config);
  }
  
  async joinSpace(spaceId: string, sessionConfig: SessionConfig): Promise<SpaceSession> {
    // First create session token via REST API
    const apiMethods = this.api.createApiMethods();
    const sessionToken = await apiMethods.createSession({ 
      spaceId, 
      ...sessionConfig 
    });
    
    // Then establish WebSocket connection for real-time collaboration
    return await this.wsManager.connectToSpace(spaceId, sessionToken.token);
  }
  
  async proposeDelta(spaceId: string, delta: SpaceDelta): Promise<SpaceSnapshot> {
    const apiMethods = this.api.createApiMethods();
    return await apiMethods.proposeDelta({ spaceId, ...delta });
  }
}
```

### SAI Client (Flagship Service)

```typescript
// src/flagship/sai-client.ts
export class SAIClient {
  constructor(
    private api: DynamicApi,
    private wsManager: WebSocketManager
  ) {}
  
  async createEngine(config: EngineConfig): Promise<AIEngine> {
    const apiMethods = this.api.createApiMethods();
    return await apiMethods.createEngine(config);
  }
  
  async startTraining(engineId: string, config: TrainingConfig): Promise<TrainingJob> {
    const apiMethods = this.api.createApiMethods();
    const job = await apiMethods.startTraining({ engineId, ...config });
    
    // Return enhanced job with real-time progress streaming
    return new TrainingJob(job, this.wsManager);
  }
  
  async processText(engineId: string, request: InferenceRequest): Promise<InferenceResult> {
    const apiMethods = this.api.createApiMethods();
    return await apiMethods.processText({ engineId, ...request });
  }
}

// Enhanced training job with real-time progress
export class TrainingJob extends EventEmitter {
  constructor(
    private jobData: any,
    private wsManager: WebSocketManager
  ) {
    super();
    this.setupProgressStreaming();
  }
  
  private async setupProgressStreaming(): Promise<void> {
    const progressStream = await this.wsManager.streamTrainingProgress(this.jobData.id);
    
    progressStream.onmessage = (event) => {
      const progress = JSON.parse(event.data);
      this.emit('progress', progress);
      
      if (progress.status === 'completed') {
        this.emit('completed', progress.result);
      }
    };
  }
}
```

## Usage Examples Leveraging Dynamic API

### Simple Usage

```typescript
import { ResonanceClient } from '@nomyx/resonance-sdk';

const client = new ResonanceClient({
  apiKey: process.env.NOMYX_API_KEY!
});

// All the sophisticated rate limiting, retry logic, and request queuing 
// from dynamic-api.ts is automatically applied
const space = await client.rnet.createSpace({
  name: 'quantum-lab',
  basis: { primes: [2, 3, 5, 7] }
});

const engine = await client.sai.createEngine({
  spaceId: space.id,
  name: 'my-ai-engine'
});
```

### Advanced Real-Time Usage

```typescript
// Join collaborative space with real-time synchronization
const session = await client.rnet.joinSpace(space.id, {
  role: 'writer',
  displayName: 'researcher'
});

// Listen to space events with built-in error handling
session.on('deltaApplied', (delta) => {
  console.log('Space updated:', delta);
});

session.on('telemetry', (metrics) => {
  console.log('Resonance metrics:', metrics);
});

// Start AI training with real-time progress
const training = await client.sai.startTraining(engine.id, {
  dataset: 'quantum-patterns',
  spaceId: space.id
});

training.on('progress', (progress) => {
  console.log(`Training: ${progress.iteration}/${progress.maxIterations}`);
});
```

This implementation leverages all the sophisticated features of the existing `dynamic-api.ts` while adding the resonance platform-specific enhancements for real-time collaboration, specialized error handling, and the hierarchical API structure with RNET as foundation and SAI as flagship service.