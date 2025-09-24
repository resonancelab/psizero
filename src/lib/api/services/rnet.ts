import apiClient from '../client';
import {
  RNETSpaceCreate,
  RNETSpace,
  RNETSession,
  RNETDelta,
  ApiResponse
} from '../types';

export class RNETApiService {
  /**
   * Create a resonance space for collaborative quantum state synchronization
   */
  async createSpace(request: RNETSpaceCreate): Promise<ApiResponse<RNETSpace>> {
    return apiClient.post<RNETSpace>('/v1/spaces', request);
  }

  /**
   * Get space status and telemetry
   */
  async getSpace(spaceId: string): Promise<ApiResponse<RNETSpace>> {
    return apiClient.get<RNETSpace>(`/v1/spaces/${spaceId}`);
  }

  /**
   * Join a resonance space and create session
   */
  async joinSpace(spaceId: string): Promise<ApiResponse<RNETSession>> {
    return apiClient.post<RNETSession>(`/v1/spaces/${spaceId}/sessions`, {});
  }

  /**
   * Leave a resonance space
   */
  async leaveSpace(spaceId: string, sessionId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/v1/spaces/${spaceId}/sessions/${sessionId}`);
  }

  /**
   * Propose a delta to the shared resonance state
   */
  async proposeDelta(spaceId: string, sessionId: string, delta: RNETDelta): Promise<ApiResponse<void>> {
    return apiClient.post(`/v1/spaces/${spaceId}/deltas`, { delta });
  }

  /**
   * Get current snapshot of resonance space
   */
  async getSnapshot(spaceId: string): Promise<ApiResponse<{
    version: number;
    primes: number[];
    phases: number[];
    telemetry: {
      resonanceStrength: number;
      coherence: number;
      entropy: number;
      connectedNodes: number;
    };
  }>> {
    return apiClient.get(`/v1/spaces/${spaceId}/snapshot`);
  }

  /**
   * Quick space creation for quaternionic communication
   */
  async quickQuantumSpace(
    name: string = 'quantum-comm-space',
    primes: number[] = [2, 3, 5, 7, 11, 13, 17, 19]
  ): Promise<ApiResponse<RNETSpace>> {
    const request: RNETSpaceCreate = {
      name,
      basis: {
        primes,
        phases: primes.map((_, i) => (i * Math.PI * 1.618034) % (2 * Math.PI)) // Golden ratio phases
      },
      operators: {
        resonanceTarget: 0.9,
        localityBias: 0.1, // Low locality bias for quantum non-locality
        damping: 0.02,
        mixer: {
          gamma0: 0.2,
          gammaGrowth: 0.001,
          temperature0: 1.0,
          beta: 0.98
        }
      },
      entropy: {
        collapseThreshold: 0.95,
        plateauDetection: true,
        lambda: 0.02
      }
    };

    return this.createSpace(request);
  }

  /**
   * Create space optimized for non-local quantum communication
   */
  async createQuantumEntanglementSpace(
    primes: number[],
    options: {
      name?: string;
      maxClients?: number;
      goldenPhase?: boolean;
      silverPhase?: boolean;
    } = {}
  ): Promise<ApiResponse<RNETSpace>> {
    const {
      name = 'quantum-entanglement-space',
      maxClients = 128,
      goldenPhase = true,
      silverPhase = true
    } = options;

    // Generate phase patterns for quantum entanglement
    const phases = primes.map((prime, i) => {
      let phase = 0;
      if (goldenPhase) {
        phase += (i * Math.PI * 1.618034) % (2 * Math.PI); // Golden ratio
      }
      if (silverPhase) {
        phase += (i * Math.PI * 2.414214) % (2 * Math.PI); // Silver ratio
      }
      return phase % (2 * Math.PI);
    });

    const request: RNETSpaceCreate = {
      name,
      basis: { primes, phases },
      operators: {
        resonanceTarget: 0.95, // High resonance for quantum entanglement
        localityBias: 0.05,    // Very low locality for non-local effects
        damping: 0.01,         // Low damping to preserve quantum coherence
        mixer: {
          gamma0: 0.15,
          gammaGrowth: 0.0005,
          temperature0: 0.8,   // Lower temperature for stable entanglement
          beta: 0.99
        }
      },
      entropy: {
        collapseThreshold: 0.98, // High threshold for stable quantum states
        plateauDetection: true,
        lambda: 0.01
      },
      policy: {
        maxClients,
        telemetryRate: 20, // High telemetry rate for quantum monitoring
        deltaCompression: true,
        enableWebhooks: true
      }
    };

    return this.createSpace(request);
  }

  /**
   * Update space configuration for quantum optimization
   */
  async updateSpaceConfig(
    spaceId: string,
    updates: {
      resonanceTarget?: number;
      localityBias?: number;
      damping?: number;
      collapseThreshold?: number;
    }
  ): Promise<ApiResponse<RNETSpace>> {
    return apiClient.patch<RNETSpace>(`/v1/spaces/${spaceId}`, updates);
  }

  /**
   * Monitor space telemetry over time
   */
  async monitorTelemetry(
    spaceId: string,
    durationMs: number = 30000,
    intervalMs: number = 1000
  ): Promise<ApiResponse<{
    samples: Array<{
      timestamp: number;
      resonanceStrength: number;
      coherence: number;
      entropy: number;
      locality: number;
      connectedNodes: number;
    }>;
    analysis: {
      averageResonance: number;
      stabilityIndex: number;
      quantumCoherence: string;
    };
  }>> {
    try {
      const samples = [];
      const startTime = Date.now();

      while (Date.now() - startTime < durationMs) {
        const spaceResponse = await this.getSpace(spaceId);
        if (spaceResponse.data) {
          samples.push({
            timestamp: Date.now(),
            resonanceStrength: spaceResponse.data.telemetry.resonanceStrength,
            coherence: spaceResponse.data.telemetry.coherence,
            entropy: spaceResponse.data.telemetry.entropy,
            locality: spaceResponse.data.telemetry.locality,
            connectedNodes: spaceResponse.data.connectedNodes
          });
        }

        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }

      const averageResonance = samples.reduce((sum, s) => sum + s.resonanceStrength, 0) / samples.length;
      const resonanceVariance = samples.reduce((sum, s) => sum + Math.pow(s.resonanceStrength - averageResonance, 2), 0) / samples.length;
      const stabilityIndex = 1 / (1 + resonanceVariance);

      let quantumCoherence = 'Low';
      if (averageResonance > 0.8 && stabilityIndex > 0.7) {
        quantumCoherence = 'High';
      } else if (averageResonance > 0.6 && stabilityIndex > 0.5) {
        quantumCoherence = 'Moderate';
      }

      return {
        data: {
          samples,
          analysis: {
            averageResonance,
            stabilityIndex,
            quantumCoherence
          }
        },
        status: 200,
        message: 'Telemetry monitoring complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Telemetry monitoring failed',
        status: 500,
        message: 'Failed to monitor space telemetry'
      };
    }
  }

  /**
   * Establish WebSocket connection for real-time updates using the backend's telemetry stream
   */
  createWebSocketConnection(spaceId: string, sessionId: string): WebSocket | null {
    try {
      // Connect to the backend's telemetry stream endpoint
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:8080/v1/spaces/${spaceId}/telemetry`;
      const ws = new WebSocket(wsUrl);
      
      // Add session ID to the connection for identification
      ws.addEventListener('open', () => {
        console.log('🌐 RNET: Connected to backend telemetry stream for space:', spaceId);
        // Send session identification
        ws.send(JSON.stringify({
          type: 'session_identify',
          sessionId: sessionId
        }));
      });

      return ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection to RNET backend:', error);
      return null;
    }
  }

  /**
   * Create telemetry stream using Server-Sent Events
   */
  createTelemetryStream(spaceId: string, callback: (data: any) => void): EventSource | null {
    try {
      const sseUrl = `${window.location.protocol}//${window.location.hostname}:8080/v1/spaces/${spaceId}/telemetry`;
      const eventSource = new EventSource(sseUrl);
      
      eventSource.addEventListener('telemetry', (event) => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch (error) {
          console.error('Failed to parse telemetry data:', error);
        }
      });

      eventSource.addEventListener('error', (error) => {
        console.error('SSE connection error:', error);
      });

      return eventSource;
    } catch (error) {
      console.error('Failed to create SSE connection to RNET backend:', error);
      return null;
    }
  }

  /**
   * Get default configuration for different quantum scenarios
   */
  getDefaultConfig(scenario: 'entanglement' | 'communication' | 'computation' | 'research' = 'entanglement') {
    const configs = {
      entanglement: {
        name: 'quantum-entanglement-lab',
        primes: [2, 3, 5, 7, 11, 13, 17, 19, 23],
        resonanceTarget: 0.95,
        localityBias: 0.05,
        damping: 0.01,
        collapseThreshold: 0.98
      },
      communication: {
        name: 'quantum-communication-channel',
        primes: [2, 3, 5, 7, 11, 13, 17],
        resonanceTarget: 0.9,
        localityBias: 0.1,
        damping: 0.02,
        collapseThreshold: 0.95
      },
      computation: {
        name: 'quantum-computation-space',
        primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
        resonanceTarget: 0.85,
        localityBias: 0.15,
        damping: 0.03,
        collapseThreshold: 0.92
      },
      research: {
        name: 'quantum-research-sandbox',
        primes: [2, 3, 5, 7, 11, 13],
        resonanceTarget: 0.8,
        localityBias: 0.2,
        damping: 0.02,
        collapseThreshold: 0.9
      }
    };

    return configs[scenario];
  }
}

// Create singleton instance
const rnetApi = new RNETApiService();

export default rnetApi;