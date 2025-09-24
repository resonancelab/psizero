/**
 * Mock API service for local development
 * Provides simulated responses when backend is not available
 */

import { ApiResponse } from './types';

// Mock data generators
const generateMockHQEData = () => ({
  snapshots: Array.from({ length: 64 }, (_, i) => ({
    step: i,
    amplitudes: Array.from({ length: 8 }, () => Math.random() * 2 - 1),
    metrics: {
      entropy: Math.random() * 0.8 + 0.2,
      plateauDetected: i > 50,
      dominance: Math.random() * 0.5 + 0.3,
      locality: Math.random() * 0.7 + 0.1,
      resonanceStrength: Math.random() * 0.6 + 0.4
    }
  })),
  finalMetrics: {
    entropy: 0.45,
    plateauDetected: true,
    dominance: 0.65,
    locality: 0.35,
    resonanceStrength: 0.78
  }
});

const generateMockQSEMData = () => ({
  vectors: [
    { concept: 'bullish momentum', alpha: [0.8, 0.6, 0.4, 0.2] },
    { concept: 'market volatility', alpha: [0.5, 0.7, 0.3, 0.8] },
    { concept: 'price stability', alpha: [0.3, 0.4, 0.9, 0.1] },
    { concept: 'accumulation phase', alpha: [0.6, 0.2, 0.7, 0.5] },
    { concept: 'breakout potential', alpha: [0.4, 0.8, 0.2, 0.6] }
  ]
});

const generateMockIChingData = () => ({
  sequence: Array.from({ length: 7 }, (_, i) => ({
    step: i,
    hexagram: Math.random().toString(2).substring(2, 9).padStart(6, '0'),
    entropy: Math.random() * 0.6 + 0.2,
    attractorProximity: Math.random() * 0.8 + 0.2
  })),
  stabilized: Math.random() > 0.3
});

const generateMockNLCData = () => ({
  id: `nlc-${Date.now()}`,
  status: 'stable',
  metrics: {
    entropy: 0.35,
    plateauDetected: false,
    dominance: 0.55,
    locality: 0.25,
    resonanceStrength: 0.72
  }
});

const generateMockUnifiedData = () => ({
  effectiveG: 6.674e-11 * (1 + Math.random() * 0.1),
  fieldStrength: Math.random() * 50 + 25,
  notes: 'Emergent gravity computed from market entropy dynamics'
});

// Mock API service class
class MockApiService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async hqeSimulate(request: any): Promise<ApiResponse<any>> {
    await this.delay(500 + Math.random() * 1000); // Simulate network delay

    if (Math.random() < 0.1) { // 10% chance of error
      return {
        error: 'Simulated HQE API error',
        status: 500,
        message: 'Internal server error'
      };
    }

    return {
      data: generateMockHQEData(),
      status: 200,
      message: 'HQE simulation completed'
    };
  }

  async qsemEncodeAndAnalyze(concepts: string[]): Promise<ApiResponse<any>> {
    await this.delay(300 + Math.random() * 700);

    if (Math.random() < 0.05) { // 5% chance of error
      return {
        error: 'Simulated QSEM API error',
        status: 500,
        message: 'Semantic analysis failed'
      };
    }

    return {
      data: generateMockQSEMData(),
      status: 200,
      message: 'Semantic analysis completed'
    };
  }

  async ichingQuickEvolve(question: string): Promise<ApiResponse<any>> {
    await this.delay(200 + Math.random() * 500);

    if (Math.random() < 0.08) { // 8% chance of error
      return {
        error: 'Simulated I-Ching API error',
        status: 500,
        message: 'Pattern evolution failed'
      };
    }

    return {
      data: generateMockIChingData(),
      status: 200,
      message: 'Pattern evolution completed'
    };
  }

  async nlcQuickSession(): Promise<ApiResponse<any>> {
    await this.delay(150 + Math.random() * 300);

    if (Math.random() < 0.03) { // 3% chance of error
      return {
        error: 'Simulated NLC API error',
        status: 500,
        message: 'Non-local channel failed'
      };
    }

    return {
      data: generateMockNLCData(),
      status: 200,
      message: 'Non-local channel established'
    };
  }

  async unifiedQuickGravity(entropyRate: number): Promise<ApiResponse<any>> {
    await this.delay(100 + Math.random() * 200);

    if (Math.random() < 0.02) { // 2% chance of error
      return {
        error: 'Simulated Unified Physics API error',
        status: 500,
        message: 'Gravity computation failed'
      };
    }

    return {
      data: generateMockUnifiedData(),
      status: 200,
      message: 'Gravity computation completed'
    };
  }

  async testConnection(): Promise<{ connected: boolean; authenticated: boolean; error?: string }> {
    await this.delay(100);
    return {
      connected: true,
      authenticated: true // Mock is always "authenticated"
    };
  }
}

// Create singleton instance
const mockApi = new MockApiService();

export default mockApi;