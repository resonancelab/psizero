/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '../client';
import {
  FastFactorRequest,
  FastFactorResponse,
  FastFactorConfig,
  ApiResponse
} from '../types';

// Additional service-specific types
interface FastFactorStatusResponse {
  service: string;
  status: string;
  version: string;
  engine_status: Record<string, unknown>;
  description: string;
  capabilities: string[];
}

interface FastFactorPerformanceResponse {
  telemetry_points: number;
  current_state: Record<string, unknown>;
  recent_telemetry: unknown[];
  statistics?: {
    average_entropy: number;
    average_resonance: number;
    total_measurements: number;
  };
}

export class FastFactorApiService {
  /**
   * Factorize a large integer using quantum-inspired resonance patterns
   */
  async factorizeNumber(request: FastFactorRequest): Promise<ApiResponse<FastFactorResponse>> {
    return apiClient.post<FastFactorResponse>('/v1/fastfactor/factorize', request);
  }

  /**
   * Get FastFactor service status
   */
  async getStatus(): Promise<ApiResponse<FastFactorStatusResponse>> {
    return apiClient.get<FastFactorStatusResponse>('/v1/fastfactor/status');
  }

  /**
   * Get FastFactor performance metrics
   */
  async getPerformance(): Promise<ApiResponse<FastFactorPerformanceResponse>> {
    return apiClient.get<FastFactorPerformanceResponse>('/v1/fastfactor/performance');
  }

  /**
   * Quick factorization with default settings
   */
  async quickFactorize(number: string): Promise<ApiResponse<FastFactorResponse>> {
    const request: FastFactorRequest = {
      number,
      config: {
        max_iterations: 5000,
        resonance_threshold: 0.95,
        timeout_seconds: 120,
      }
    };

    return this.factorizeNumber(request);
  }

  /**
   * Advanced factorization with custom configuration
   */
  async advancedFactorize(
    number: string,
    options: {
      maxIterations?: number;
      resonanceThreshold?: number;
      phaseCoherence?: number;
      basisSetSize?: number;
      adaptiveThresholding?: boolean;
      parallelProcessors?: number;
      timeoutSeconds?: number;
      maxDigits?: number;
    } = {}
  ): Promise<ApiResponse<FastFactorResponse>> {
    const config: FastFactorConfig = {
      max_iterations: options.maxIterations || 10000,
      resonance_threshold: options.resonanceThreshold || 0.95,
      phase_coherence: options.phaseCoherence || 0.98,
      basis_set_size: options.basisSetSize || 100,
      adaptive_thresholding: options.adaptiveThresholding !== false,
      parallel_processors: options.parallelProcessors || 4,
      timeout_seconds: options.timeoutSeconds || 300,
      max_digits: options.maxDigits || 1000,
    };

    const request: FastFactorRequest = {
      number,
      config,
    };

    return this.factorizeNumber(request);
  }

  /**
   * Factorize with optimized settings for different number types
   */
  async factorizeOptimized(
    number: string,
    optimization: 'speed' | 'accuracy' | 'balanced' = 'balanced'
  ): Promise<ApiResponse<FastFactorResponse>> {
    let config: FastFactorConfig;

    switch (optimization) {
      case 'speed':
        config = {
          max_iterations: 2000,
          resonance_threshold: 0.9,
          phase_coherence: 0.95,
          basis_set_size: 50,
          adaptive_thresholding: true,
          parallel_processors: 8,
          timeout_seconds: 60,
        };
        break;

      case 'accuracy':
        config = {
          max_iterations: 20000,
          resonance_threshold: 0.98,
          phase_coherence: 0.995,
          basis_set_size: 200,
          adaptive_thresholding: true,
          parallel_processors: 2,
          timeout_seconds: 600,
        };
        break;

      case 'balanced':
      default:
        config = {
          max_iterations: 10000,
          resonance_threshold: 0.95,
          phase_coherence: 0.98,
          basis_set_size: 100,
          adaptive_thresholding: true,
          parallel_processors: 4,
          timeout_seconds: 300,
        };
        break;
    }

    const request: FastFactorRequest = {
      number,
      config,
    };

    return this.factorizeNumber(request);
  }

  /**
   * Validate a number before factorization
   */
  validateNumber(number: string): { valid: boolean; error?: string } {
    // Check if string is empty
    if (!number || number.trim() === '') {
      return { valid: false, error: 'Number cannot be empty' };
    }

    // Check if string contains only digits
    if (!/^\d+$/.test(number.trim())) {
      return { valid: false, error: 'Number must contain only digits' };
    }

    // Check if number is greater than 1
    if (number === '0' || number === '1') {
      return { valid: false, error: 'Number must be greater than 1' };
    }

    // Check for reasonable length (up to 25,000 digits by default)
    if (number.length > 25000) {
      return { valid: false, error: 'Number is too large (max 25,000 digits)' };
    }

    return { valid: true };
  }

  /**
   * Estimate factorization difficulty and time
   */
  estimateComplexity(number: string): {
    digits: number;
    estimatedDifficulty: 'trivial' | 'easy' | 'moderate' | 'hard' | 'extreme';
    estimatedTimeRange: string;
  } {
    const digits = number.length;

    let difficulty: 'trivial' | 'easy' | 'moderate' | 'hard' | 'extreme';
    let timeRange: string;

    if (digits <= 100) {
      difficulty = 'trivial';
      timeRange = '< 1 second';
    } else if (digits <= 1000) {
      difficulty = 'easy';
      timeRange = '< 1 second';
    } else if (digits <= 5000) {
      difficulty = 'moderate';
      timeRange = '< 1 second';
    } else if (digits <= 10000) {
      difficulty = 'hard';
      timeRange = '1-10 seconds';
    } else {
      difficulty = 'extreme';
      timeRange = '10 seconds - 2 minutes';
    }

    return {
      digits,
      estimatedDifficulty: difficulty,
      estimatedTimeRange: timeRange,
    };
  }

  /**
   * Generate sample numbers for testing
   */
  generateSampleNumbers(): { [key: string]: string } {
    return {
      'Small Composite': '12345',
      'Medium Composite': '123456789012345',
      'Large Semiprime': '1234567890123456789012345678901234567890123456789',
      'RSA-100': '1522605027922533360535618378132637429718068114961380688657908494580122963258952897654000350692006139',
      'Mersenne Composite': '170141183460469231731687303715884105727', // 2^127 - 1
      'Random Large': '98765432109876543210987654321098765432109876543210987654321',
    };
  }
}

// Create singleton instance
const fastFactorApi = new FastFactorApiService();

export default fastFactorApi;