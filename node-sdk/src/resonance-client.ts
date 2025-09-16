// Main ResonanceClient - Primary SDK Entry Point

import { DynamicApi, ApiConfig, EndpointConfig } from './dynamic-api';
import { WebSocketManager } from './realtime/websocket-manager';
import { RNETClient } from './foundation/rnet-client';
import { SAIClient } from './flagship/sai-client';
import { SRSClient } from './engines/srs-client';
import { HQEClient } from './engines/hqe-client';
import { QSEMClient } from './engines/qsem-client';
import { NLCClient } from './engines/nlc-client';
import { QCRClient } from './engines/qcr-client';
import { IChingClient } from './engines/iching-client';
import { UnifiedPhysicsClient } from './engines/unified-client';
import {
  ResonanceClientConfig,
  RealtimeConfig
} from './core/types';
import { DEFAULT_CONFIG, HEADERS, API_VERSION } from './core/constants';
import { ConfigurationError, AuthenticationError } from './core/errors';
import { validateApiKeyAndAssert, validateUrlAndAssert } from './utils/validation';
import { loggers } from './utils/logger';

/**
 * Main Resonance Client - Entry point for the Nomyx Resonance Platform SDK
 */
export class ResonanceClient {
  private dynamicApi: DynamicApi;
  private wsManager: WebSocketManager;
  
  // API Clients
  public readonly rnet: RNETClient;      // Foundational layer
  public readonly sai: SAIClient;        // Flagship AI service
  public readonly engines: {             // Specialized engines
    srs: SRSClient;                      // Symbolic Resonance Solver
    hqe: HQEClient;                      // Holographic Quantum Encoder
    qsem: QSEMClient;                    // Quantum Semantic Engine
    nlc: NLCClient;                      // Non-Local Communication
    qcr: QCRClient;                      // Quantum Consciousness Resonator
    iching: IChingClient;                // I-Ching Oracle
    unified: UnifiedPhysicsClient;       // Unified Physics Engine
  };

  constructor(config: ResonanceClientConfig) {
    // Validate configuration
    this.validateConfig(config);
    
    // Create enhanced API configuration
    const apiConfig = this.createApiConfig(config);
    this.dynamicApi = new DynamicApi(apiConfig);
    
    // Initialize WebSocket manager for real-time features
    this.wsManager = new WebSocketManager();
    
    // Initialize all API clients
    this.rnet = new RNETClient(this.dynamicApi, this.wsManager);
    this.sai = new SAIClient(this.dynamicApi, this.wsManager);
    this.engines = {
      srs: new SRSClient(this.dynamicApi),
      hqe: new HQEClient(this.dynamicApi),
      qsem: new QSEMClient(this.dynamicApi),
      nlc: new NLCClient(this.dynamicApi),
      qcr: new QCRClient(this.dynamicApi),
      iching: new IChingClient(this.dynamicApi),
      unified: new UnifiedPhysicsClient(this.dynamicApi)
    };

    loggers.core.info('ResonanceClient initialized', {
      baseURL: config.baseURL || DEFAULT_CONFIG.BASE_URL,
      environment: config.environment || 'production',
      debug: config.debug || false
    });
  }

  /**
   * Update authentication token
   */
  setAuthToken(token: string): void {
    this.dynamicApi.setAuthToken(token);
    loggers.core.debug('Authentication token updated');
  }

  /**
   * Update global headers
   */
  updateHeaders(headers: Record<string, string>): void {
    this.dynamicApi.updateGlobalHeaders(headers);
    loggers.core.debug('Global headers updated', headers);
  }

  /**
   * Get WebSocket manager for advanced real-time operations
   */
  getWebSocketManager(): WebSocketManager {
    return this.wsManager;
  }

  /**
   * Get underlying dynamic API instance for advanced usage
   */
  getDynamicApi(): DynamicApi {
    return this.dynamicApi;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await this.wsManager.cleanup();
    loggers.core.info('ResonanceClient cleaned up');
  }

  /**
   * Validate client configuration
   */
  private validateConfig(config: ResonanceClientConfig): void {
    try {
      // Validate API key
      validateApiKeyAndAssert(config.apiKey, 'apiKey');
      
      // Validate base URL if provided
      if (config.baseURL) {
        validateUrlAndAssert(config.baseURL, 'baseURL');
      }
      
      // Validate timeout
      if (config.timeout !== undefined && config.timeout <= 0) {
        throw new ConfigurationError('Timeout must be positive');
      }
      
      // Validate retries
      if (config.retries !== undefined && config.retries < 0) {
        throw new ConfigurationError('Retries cannot be negative');
      }
      
    } catch (error) {
      if (error instanceof ConfigurationError) {
        throw error;
      }
      throw new ConfigurationError('Invalid configuration', error);
    }
  }

  /**
   * Create API configuration with all endpoint definitions
   */
  private createApiConfig(config: ResonanceClientConfig): ApiConfig {
    const baseUrl = config.baseURL || DEFAULT_CONFIG.BASE_URL;
    
    return {
      baseUrl,
      timeout: config.timeout || DEFAULT_CONFIG.TIMEOUT,
      globalHeaders: {
        [HEADERS.CONTENT_TYPE]: 'application/json',
        [HEADERS.API_KEY]: config.apiKey,
        [HEADERS.USER_AGENT]: `@nomyx/resonance-sdk/1.0.0 (${process.platform})`,
        'X-SDK-Version': API_VERSION.CURRENT
      },
      endpoints: {
        // RNET Foundation Layer Endpoints
        ...this.getRNETEndpoints(),
        // SAI Flagship Service Endpoints  
        ...this.getSAIEndpoints(),
        // Specialized Engine Endpoints
        ...this.getEngineEndpoints()
      },
      globalRetryConfig: {
        maxRetries: config.retries || DEFAULT_CONFIG.RETRIES,
        retryDelay: 1000,
        retryCondition: (error) => {
          const status = error.response?.status;
          return status === 429 || (status !== undefined && status >= 500);
        }
      },
      queueConcurrency: 10,
      responseInterceptor: this.createResponseInterceptor(),
      errorInterceptor: this.createErrorInterceptor()
    };
  }

  /**
   * Get RNET endpoint configurations
   */
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
        rateLimitPerSecond: 2
      },
      deleteSpace: {
        method: 'DELETE',
        path: '/v1/spaces/:id',
        params: ['id'],
        rateLimitPerSecond: 2
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
        path: '/v1/spaces/:spaceId/deltas',
        params: ['spaceId'],
        rateLimitPerSecond: 30
      },
      
      // Member Management
      getMembers: {
        method: 'GET',
        path: '/v1/spaces/:spaceId/members',
        params: ['spaceId'],
        rateLimitPerSecond: 15
      },
      inviteMember: {
        method: 'POST',
        path: '/v1/spaces/:spaceId/members',
        params: ['spaceId'],
        rateLimitPerSecond: 5
      },
      removeMember: {
        method: 'DELETE',
        path: '/v1/spaces/:spaceId/members/:userId',
        params: ['spaceId', 'userId'],
        rateLimitPerSecond: 5
      },
      updateMemberRole: {
        method: 'PATCH',
        path: '/v1/spaces/:spaceId/members/:userId',
        params: ['spaceId', 'userId'],
        rateLimitPerSecond: 5
      },
      
      // Activity and Telemetry
      getActivity: {
        method: 'GET',
        path: '/v1/spaces/:spaceId/activity',
        params: ['spaceId'],
        rateLimitPerSecond: 10
      },
      getTelemetry: {
        method: 'GET',
        path: '/v1/spaces/:spaceId/telemetry',
        params: ['spaceId'],
        rateLimitPerSecond: 10
      }
    };
  }

  /**
   * Get SAI endpoint configurations
   */
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
        path: '/v1/engines/:engineId/training-data',
        params: ['engineId'],
        rateLimitPerSecond: 10
      },
      getTrainingData: {
        method: 'GET',
        path: '/v1/engines/:engineId/training-data',
        params: ['engineId'],
        rateLimitPerSecond: 10
      }
    };
  }

  /**
   * Get specialized engine endpoint configurations
   */
  private getEngineEndpoints(): Record<string, EndpointConfig> {
    return {
      // SRS - Symbolic Resonance System
      'srs.solve': {
        method: 'POST',
        path: '/v1/srs/solve',
        rateLimitPerSecond: 5,
        retryConfig: { maxRetries: 2, retryDelay: 2000 }
      },
      'srs.getAlgorithmInfo': {
        method: 'GET',
        path: '/v1/srs/algorithm-info',
        rateLimitPerSecond: 10
      },
      'srs.getStatus': {
        method: 'GET',
        path: '/v1/srs/status',
        rateLimitPerSecond: 10
      },
      'srs.getStats': {
        method: 'GET',
        path: '/v1/srs/stats',
        rateLimitPerSecond: 10
      },

      // HQE - Holographic Quantum Encoder
      'hqe.encode': {
        method: 'POST',
        path: '/v1/hqe/encode',
        rateLimitPerSecond: 5,
        retryConfig: { maxRetries: 2, retryDelay: 2000 }
      },
      'hqe.decode': {
        method: 'POST',
        path: '/v1/hqe/decode',
        rateLimitPerSecond: 5
      },
      'hqe.createPattern': {
        method: 'POST',
        path: '/v1/hqe/pattern',
        rateLimitPerSecond: 3
      },
      'hqe.reconstruct': {
        method: 'POST',
        path: '/v1/hqe/reconstruct',
        rateLimitPerSecond: 3
      },
      'hqe.optimize': {
        method: 'POST',
        path: '/v1/hqe/optimize',
        rateLimitPerSecond: 2
      },
      'hqe.applyGates': {
        method: 'POST',
        path: '/v1/hqe/gates',
        rateLimitPerSecond: 5
      },
      'hqe.measureEntanglement': {
        method: 'POST',
        path: '/v1/hqe/entanglement',
        rateLimitPerSecond: 10
      },
      'hqe.verifyIntegrity': {
        method: 'POST',
        path: '/v1/hqe/verify',
        rateLimitPerSecond: 10
      },
      'hqe.getStats': {
        method: 'GET',
        path: '/v1/hqe/stats',
        rateLimitPerSecond: 10
      },
      'hqe.getStatus': {
        method: 'GET',
        path: '/v1/hqe/status',
        rateLimitPerSecond: 10
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
        rateLimitPerSecond: 15
      },
      'qsem.analyzeContextual': {
        method: 'POST',
        path: '/v1/qsem/contextual',
        rateLimitPerSecond: 10
      },
      'qsem.generatePrimeBasis': {
        method: 'POST',
        path: '/v1/qsem/basis',
        rateLimitPerSecond: 5
      },
      'qsem.optimizeBasis': {
        method: 'POST',
        path: '/v1/qsem/optimize',
        rateLimitPerSecond: 3
      },
      'qsem.getStats': {
        method: 'GET',
        path: '/v1/qsem/stats',
        rateLimitPerSecond: 10
      },
      'qsem.getStatus': {
        method: 'GET',
        path: '/v1/qsem/status',
        rateLimitPerSecond: 10
      },

      // NLC - Non-Local Communication
      'nlc.establishSession': {
        method: 'POST',
        path: '/v1/nlc/session',
        rateLimitPerSecond: 5,
        retryConfig: { maxRetries: 2, retryDelay: 2000 }
      },
      'nlc.transmitMessage': {
        method: 'POST',
        path: '/v1/nlc/transmit',
        rateLimitPerSecond: 20
      },
      'nlc.receiveMessages': {
        method: 'GET',
        path: '/v1/nlc/receive',
        rateLimitPerSecond: 30
      },
      'nlc.measureEntanglement': {
        method: 'GET',
        path: '/v1/nlc/entanglement',
        rateLimitPerSecond: 10
      },
      'nlc.amplifyEntanglement': {
        method: 'POST',
        path: '/v1/nlc/amplify',
        rateLimitPerSecond: 3
      },
      'nlc.stabilizeChannel': {
        method: 'POST',
        path: '/v1/nlc/stabilize',
        rateLimitPerSecond: 5
      },
      'nlc.broadcastMessage': {
        method: 'POST',
        path: '/v1/nlc/broadcast',
        rateLimitPerSecond: 10
      },
      'nlc.getSessionParticipants': {
        method: 'GET',
        path: '/v1/nlc/participants',
        rateLimitPerSecond: 15
      },
      'nlc.terminateSession': {
        method: 'DELETE',
        path: '/v1/nlc/session',
        rateLimitPerSecond: 5
      },
      'nlc.getStats': {
        method: 'GET',
        path: '/v1/nlc/stats',
        rateLimitPerSecond: 10
      },
      'nlc.getStatus': {
        method: 'GET',
        path: '/v1/nlc/status',
        rateLimitPerSecond: 10
      },

      // QCR - Quantum Consciousness Resonator
      'qcr.initializeSession': {
        method: 'POST',
        path: '/v1/qcr/session',
        rateLimitPerSecond: 3,
        retryConfig: { maxRetries: 2, retryDelay: 3000 }
      },
      'qcr.measureConsciousness': {
        method: 'POST',
        path: '/v1/qcr/measure',
        rateLimitPerSecond: 5
      },
      'qcr.performObservation': {
        method: 'POST',
        path: '/v1/qcr/observe',
        rateLimitPerSecond: 5
      },
      'qcr.measureObserverEffect': {
        method: 'GET',
        path: '/v1/qcr/observer-effect',
        rateLimitPerSecond: 10
      },
      'qcr.calibrateMeasurement': {
        method: 'POST',
        path: '/v1/qcr/calibrate',
        rateLimitPerSecond: 3
      },
      'qcr.analyzeResonancePatterns': {
        method: 'GET',
        path: '/v1/qcr/resonance',
        rateLimitPerSecond: 10
      },
      'qcr.evolveConsciousness': {
        method: 'POST',
        path: '/v1/qcr/evolve',
        rateLimitPerSecond: 2
      },
      'qcr.measureQuantumCoherence': {
        method: 'GET',
        path: '/v1/qcr/coherence',
        rateLimitPerSecond: 10
      },
      'qcr.transferConsciousness': {
        method: 'POST',
        path: '/v1/qcr/transfer',
        rateLimitPerSecond: 1
      },
      'qcr.getStats': {
        method: 'GET',
        path: '/v1/qcr/stats',
        rateLimitPerSecond: 10
      },
      'qcr.getStatus': {
        method: 'GET',
        path: '/v1/qcr/status',
        rateLimitPerSecond: 10
      },

      // I-Ching - Quantum Oracle
      'iching.castHexagram': {
        method: 'POST',
        path: '/v1/iching/cast',
        rateLimitPerSecond: 10,
        retryConfig: { maxRetries: 3, retryDelay: 1000 }
      },
      'iching.evolveHexagram': {
        method: 'POST',
        path: '/v1/iching/evolve',
        rateLimitPerSecond: 5
      },
      'iching.interpretHexagram': {
        method: 'POST',
        path: '/v1/iching/interpret',
        rateLimitPerSecond: 15
      },
      'iching.analyzeTransformation': {
        method: 'POST',
        path: '/v1/iching/analyze',
        rateLimitPerSecond: 10
      },
      'iching.measureResonance': {
        method: 'GET',
        path: '/v1/iching/resonance',
        rateLimitPerSecond: 10
      },
      'iching.findRelatedHexagrams': {
        method: 'GET',
        path: '/v1/iching/related',
        rateLimitPerSecond: 10
      },
      'iching.getHexagramInfo': {
        method: 'GET',
        path: '/v1/iching/info',
        rateLimitPerSecond: 20
      },
      'iching.getStats': {
        method: 'GET',
        path: '/v1/iching/stats',
        rateLimitPerSecond: 10
      },
      'iching.getStatus': {
        method: 'GET',
        path: '/v1/iching/status',
        rateLimitPerSecond: 10
      },

      // Unified Physics Engine
      'unified.computeGravitationalField': {
        method: 'POST',
        path: '/v1/unified/gravitational-field',
        rateLimitPerSecond: 5,
        retryConfig: { maxRetries: 2, retryDelay: 2000 }
      },
      'unified.validateHypothesis': {
        method: 'POST',
        path: '/v1/unified/validate-hypothesis',
        rateLimitPerSecond: 3
      },
      'unified.computeOrbitalMechanics': {
        method: 'POST',
        path: '/v1/unified/orbital-mechanics',
        rateLimitPerSecond: 3
      },
      'unified.simulateBlackHole': {
        method: 'POST',
        path: '/v1/unified/black-hole',
        rateLimitPerSecond: 2
      },
      'unified.computeSpacetimeCurvature': {
        method: 'POST',
        path: '/v1/unified/spacetime-curvature',
        rateLimitPerSecond: 2
      },
      'unified.analyzeQuantumGravity': {
        method: 'POST',
        path: '/v1/unified/quantum-gravity',
        rateLimitPerSecond: 2
      },
      'unified.simulateCosmologicalEvolution': {
        method: 'POST',
        path: '/v1/unified/cosmological-evolution',
        rateLimitPerSecond: 1
      },
      'unified.computeFieldEquations': {
        method: 'POST',
        path: '/v1/unified/field-equations',
        rateLimitPerSecond: 2
      },
      'unified.analyzeSymmetryBreaking': {
        method: 'POST',
        path: '/v1/unified/symmetry-breaking',
        rateLimitPerSecond: 2
      },
      'unified.getStats': {
        method: 'GET',
        path: '/v1/unified/stats',
        rateLimitPerSecond: 10
      },
      'unified.getStatus': {
        method: 'GET',
        path: '/v1/unified/status',
        rateLimitPerSecond: 10
      }
    };
  }

  /**
   * Create response interceptor
   */
  private createResponseInterceptor() {
    return (response: any) => {
      loggers.api.logResponse(
        response.config.method?.toUpperCase(),
        response.config.url,
        response.status,
        response.data
      );
      return response;
    };
  }

  /**
   * Create error interceptor
   */
  private createErrorInterceptor() {
    return (error: any) => {
      if (error.response) {
        const { status, data } = error.response;
        
        loggers.api.error('API request failed', {
          status,
          url: error.config?.url,
          method: error.config?.method,
          data
        });
        
        // Transform to appropriate ResonanceError
        switch (status) {
          case 401:
            throw new AuthenticationError(data.message || 'Authentication failed', data);
          case 429:
            // Rate limiting is handled by retry logic
            break;
          default:
            // Other errors are passed through
            break;
        }
      } else {
        loggers.api.error('Network error', error);
      }
      
      throw error;
    };
  }
}