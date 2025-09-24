import apiClient from '../client';
import {
  HQERequest,
  HQEResponse,
  HQESession,
  HQESnapshot,
  HQEConfig,
  ApiResponse
} from '../types';

export class HQEApiService {
  /**
   * Run a holographic quantum encoder simulation
   */
  async simulate(request: HQERequest): Promise<ApiResponse<HQEResponse>> {
    return apiClient.post<HQEResponse>('/hqe/simulate', request);
  }

  /**
   * Create a long-running HQE session
   */
  async createSession(request: HQERequest): Promise<ApiResponse<HQESession>> {
    return apiClient.post<HQESession>('/hqe/sessions', request);
  }

  /**
   * Get session status and metrics
   */
  async getSession(sessionId: string): Promise<ApiResponse<HQESession>> {
    return apiClient.get<HQESession>(`/hqe/sessions/${sessionId}`);
  }

  /**
   * Advance session by N steps
   */
  async stepSession(sessionId: string, steps: number = 32): Promise<ApiResponse<HQESnapshot>> {
    return apiClient.post<HQESnapshot>(`/hqe/sessions/${sessionId}/step`, { steps });
  }

  /**
   * Close/terminate a session
   */
  async closeSession(sessionId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/hqe/sessions/${sessionId}`);
  }

  /**
   * Get session snapshots with pagination
   */
  async getSnapshots(
    sessionId: string,
    cursor?: string,
    pageSize: number = 100
  ): Promise<ApiResponse<{ items: HQESnapshot[]; next_cursor?: string }>> {
    return apiClient.get(`/hqe/sessions/${sessionId}/snapshots`, {
      cursor,
      page_size: pageSize
    });
  }

  /**
   * Quick simulation with common defaults
   */
  async quickSimulate(
    primes: number[] = [2, 3, 5, 7],
    steps: number = 128,
    lambda: number = 0.02,
    simulationType: string = 'holographic_reconstruction'
  ): Promise<ApiResponse<HQEResponse>> {
    const request: HQERequest = {
      simulation_type: simulationType,
      primes,
      steps,
      lambda
    };

    return this.simulate(request);
  }

  /**
   * Advanced simulation with phase seeding
   */
  async advancedSimulate(
    primes: number[],
    options: {
      simulation_type?: string;
      steps?: number;
      lambda?: number;
      config?: HQEConfig;
      parameters?: Record<string, unknown>;
    } = {}
  ): Promise<ApiResponse<HQEResponse>> {
    const request: HQERequest = {
      simulation_type: options.simulation_type || 'holographic_reconstruction',
      primes,
      steps: options.steps || 256,
      lambda: options.lambda || 0.02,
      config: options.config,
      parameters: options.parameters
    };

    return this.simulate(request);
  }

  /**
   * Create session with real-time monitoring
   */
  async createMonitoredSession(
    primes: number[],
    options: {
      simulation_type?: string;
      steps?: number;
      lambda?: number;
      config?: HQEConfig;
    } = {}
  ): Promise<ApiResponse<HQESession>> {
    const request: HQERequest = {
      simulation_type: options.simulation_type || 'holographic_reconstruction',
      primes,
      steps: options.steps || 256,
      lambda: options.lambda || 0.02,
      config: options.config
    };

    return this.createSession(request);
  }

  /**
   * Get default configuration for different use cases
   */
  getDefaultConfig(useCase: 'basic' | 'advanced' | 'research' | 'realtime' = 'basic') {
    const configs = {
      basic: {
        simulation_type: 'holographic_reconstruction',
        primes: [2, 3, 5, 7],
        steps: 128,
        lambda: 0.02,
        config: {
          time_step: 0.1,
          entanglement_threshold: 0.8
        }
      },
      advanced: {
        simulation_type: 'holographic_reconstruction',
        primes: [2, 3, 5, 7, 11, 13],
        steps: 256,
        lambda: 0.01,
        config: {
          time_step: 0.05,
          entanglement_threshold: 0.9,
          holographic_complexity: 1.2
        }
      },
      research: {
        simulation_type: 'holographic_reconstruction',
        primes: [2, 3, 5, 7, 11, 13, 17],
        steps: 512,
        lambda: 0.005,
        config: {
          time_step: 0.02,
          entanglement_threshold: 0.95,
          holographic_complexity: 1.5
        }
      },
      realtime: {
        simulation_type: 'holographic_reconstruction',
        primes: [2, 3, 5, 7],
        steps: 64,
        lambda: 0.03,
        config: {
          time_step: 0.2,
          entanglement_threshold: 0.7
        }
      }
    };

    return configs[useCase];
  }
}

// Create singleton instance
const hqeApi = new HQEApiService();

export default hqeApi;