// Resonance API Client Service
// This service provides a clean interface to interact with the Go backend API

import axios, { AxiosInstance, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/v1';
const API_KEY = import.meta.env.VITE_API_KEY || 'demo_api_key_12345';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  metadata?: {
    request_id: string;
    timestamp: string;
    processing_time_ms: number;
  };
}

// Service Status
export interface ServiceStatus {
  status: string;
  version: string;
  services: {
    [key: string]: {
      status: string;
      latency_ms: number;
    };
  };
}

// SRS Types
export interface SRSProblem {
  problem_type: '3sat' | 'tsp' | 'knapsack';
  clauses?: number[][];
  variables?: number;
  max_iterations?: number;
}

export interface SRSSolution {
  solution: number[] | boolean[];
  iterations: number;
  convergence_history: number[];
  processing_time_ms: number;
}

// HQE Types
export interface HQESimulation {
  system_type: 'harmonic_oscillator' | 'quantum_field' | 'entangled_system';
  dimensions: number;
  particles: number;
  time_steps: number;
}

export interface HQEResult {
  energy_levels: number[];
  wave_functions: number[][];
  entanglement_entropy: number;
  simulation_time_ms: number;
}

// QSEM Types
export interface QSEMEncoding {
  concepts: string[];
  encoding_type: 'contextual' | 'semantic' | 'hybrid';
  dimension: number;
}

export interface QSEMResult {
  embeddings: number[][];
  resonance_frequencies: number[];
  semantic_distances: number[][];
  encoding_time_ms: number;
}

// API Service Class
class ResonanceAPIService {
  // Health & Status
  async getHealth(): Promise<{ status: string }> {
    const response = await apiClient.get('/health');
    return response.data;
  }

  async getStatus(): Promise<ApiResponse<ServiceStatus>> {
    const response = await apiClient.get('/status');
    return response.data;
  }

  // SRS - Stochastic Resonance Solver
  async solveProblem(problem: SRSProblem): Promise<ApiResponse<SRSSolution>> {
    const response = await apiClient.post('/srs/solve', problem);
    return response.data;
  }

  async getSRSHistory(problemId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/srs/history/${problemId}`);
    return response.data;
  }

  // HQE - Hypercomplex Quantum Engine
  async runSimulation(simulation: HQESimulation): Promise<ApiResponse<HQEResult>> {
    const response = await apiClient.post('/hqe/simulate', simulation);
    return response.data;
  }

  async optimizeSystem(systemId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/hqe/optimize/${systemId}`);
    return response.data;
  }

  // QSEM - Quantum Semantic Encoding Machine
  async encodeConcepts(encoding: QSEMEncoding): Promise<ApiResponse<QSEMResult>> {
    const response = await apiClient.post('/qsem/encode', encoding);
    return response.data;
  }

  async searchSimilar(conceptId: string, limit: number = 10): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/qsem/search/${conceptId}?limit=${limit}`);
    return response.data;
  }

  // NLC - Non-Local Communication
  async createChannel(): Promise<ApiResponse<{ channel_id: string; entanglement_strength: number }>> {
    const response = await apiClient.post('/nlc/channel/create');
    return response.data;
  }

  async sendMessage(channelId: string, message: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/nlc/channel/${channelId}/send`, { message });
    return response.data;
  }

  // QCR - Quantum Consciousness Resonator
  async evolveConsciousness(observerId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/qcr/evolve/${observerId}`);
    return response.data;
  }

  async measureCoherence(observerId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/qcr/coherence/${observerId}`);
    return response.data;
  }

  // I-Ching Oracle
  async consultOracle(question: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/iching/consult', { question });
    return response.data;
  }

  async getHexagramEvolution(hexagramId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/iching/evolution/${hexagramId}`);
    return response.data;
  }

  // Unified Physics
  async calculateField(coordinates: number[]): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/physics/field', { coordinates });
    return response.data;
  }

  async simulateSpacetime(parameters: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/physics/spacetime', parameters);
    return response.data;
  }
}

// Export singleton instance
export const resonanceAPI = new ResonanceAPIService();

// Export types
export type { ResonanceAPIService };