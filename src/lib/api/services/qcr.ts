import apiClient from '../client';
import {
  QCRSessionCreate,
  QCRState,
  QCRObservation,
  ApiResponse
} from '../types';

export class QCRApiService {
  /**
   * Create a quantum consciousness resonator session
   */
  async createSession(request: QCRSessionCreate): Promise<ApiResponse<QCRState>> {
    return apiClient.post<QCRState>('/qcr/sessions', request);
  }

  /**
   * Get current session state
   */
  async getSession(sessionId: string): Promise<ApiResponse<QCRState>> {
    return apiClient.get<QCRState>(`/qcr/sessions/${sessionId}`);
  }

  /**
   * Submit a prompt for consciousness resonance analysis
   */
  async observe(sessionId: string, prompt: string): Promise<ApiResponse<QCRObservation>> {
    return apiClient.post<QCRObservation>(`/qcr/sessions/${sessionId}/observe`, {
      prompt
    });
  }

  /**
   * Quick session creation with common cognitive modes
   */
  async quickSession(
    modes: ('analytical' | 'creative' | 'ethical' | 'pragmatic' | 'emotional')[] = ['analytical', 'creative', 'ethical'],
    maxIterations: number = 21
  ): Promise<ApiResponse<QCRState>> {
    const request: QCRSessionCreate = {
      modes,
      maxIterations
    };

    return this.createSession(request);
  }

  /**
   * Advanced session with custom configuration
   */
  async advancedSession(
    modes: ('analytical' | 'creative' | 'ethical' | 'pragmatic' | 'emotional')[],
    options: {
      maxIterations?: number;
    } = {}
  ): Promise<ApiResponse<QCRState>> {
    const request: QCRSessionCreate = {
      modes,
      ...options
    };

    return this.createSession(request);
  }

  /**
   * Interactive consciousness exploration
   */
  async exploreConsciousness(
    sessionId: string,
    prompts: string[],
    delayMs: number = 2000
  ): Promise<ApiResponse<{
    session: QCRState;
    observations: QCRObservation[];
    insights: string[];
  }>> {
    try {
      const observations: QCRObservation[] = [];
      const insights: string[] = [];

      for (const prompt of prompts) {
        const response = await this.observe(sessionId, prompt);
        if (response.data) {
          observations.push(response.data);

          // Extract insights from response
          const insight = this.extractInsight(response.data);
          if (insight) {
            insights.push(insight);
          }
        } else {
          throw new Error(response.error || 'Failed to observe consciousness');
        }

        // Add delay between observations
        if (delayMs > 0 && prompts.indexOf(prompt) < prompts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }

      // Get final session state
      const sessionResponse = await this.getSession(sessionId);
      if (!sessionResponse.data) {
        throw new Error(sessionResponse.error || 'Failed to get final session state');
      }

      return {
        data: {
          session: sessionResponse.data,
          observations,
          insights
        },
        status: 200,
        message: 'Consciousness exploration complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Consciousness exploration failed',
        status: 500,
        message: 'Failed to explore consciousness'
      };
    }
  }

  /**
   * Monitor consciousness evolution over time
   */
  async monitorEvolution(
    sessionId: string,
    durationMs: number = 60000,
    intervalMs: number = 10000
  ): Promise<ApiResponse<{
    initialState: QCRState;
    finalState: QCRState;
    evolution: Array<{
      timestamp: number;
      iteration: number;
      stabilized: boolean;
      entropy: number;
      resonanceStrength: number;
    }>;
  }>> {
    try {
      const startTime = Date.now();
      const evolution = [];

      // Get initial state
      const initialResponse = await this.getSession(sessionId);
      if (!initialResponse.data) {
        throw new Error(initialResponse.error || 'Failed to get initial state');
      }

      evolution.push({
        timestamp: Date.now(),
        iteration: initialResponse.data.iteration,
        stabilized: initialResponse.data.stabilized,
        entropy: initialResponse.data.lastObservation?.metrics.entropy || 0,
        resonanceStrength: initialResponse.data.lastObservation?.metrics.resonanceStrength || 0
      });

      // Monitor evolution
      while (Date.now() - startTime < durationMs) {
        const stateResponse = await this.getSession(sessionId);
        if (stateResponse.data) {
          evolution.push({
            timestamp: Date.now(),
            iteration: stateResponse.data.iteration,
            stabilized: stateResponse.data.stabilized,
            entropy: stateResponse.data.lastObservation?.metrics.entropy || 0,
            resonanceStrength: stateResponse.data.lastObservation?.metrics.resonanceStrength || 0
          });
        }

        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }

      // Get final state
      const finalResponse = await this.getSession(sessionId);
      if (!finalResponse.data) {
        throw new Error(finalResponse.error || 'Failed to get final state');
      }

      return {
        data: {
          initialState: initialResponse.data,
          finalState: finalResponse.data,
          evolution
        },
        status: 200,
        message: 'Evolution monitoring complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Evolution monitoring failed',
        status: 500,
        message: 'Failed to monitor consciousness evolution'
      };
    }
  }

  /**
   * Analyze cognitive mode effectiveness
   */
  async analyzeModes(
    sessionId: string,
    testPrompts: string[]
  ): Promise<ApiResponse<{
    modeAnalysis: Record<string, {
      observations: number;
      averageEntropy: number;
      averageResonance: number;
      insights: string[];
    }>;
    recommendations: string[];
  }>> {
    try {
      const modeAnalysis: Record<string, {
        observations: number;
        totalEntropy: number;
        totalResonance: number;
        insights: string[];
      }> = {};

      // Get current session to know the modes
      const sessionResponse = await this.getSession(sessionId);
      if (!sessionResponse.data) {
        throw new Error(sessionResponse.error || 'Failed to get session');
      }

      // Test each prompt
      for (const prompt of testPrompts) {
        const response = await this.observe(sessionId, prompt);
        if (response.data) {
          // This is a simplified analysis - in reality, we'd need to track which mode was dominant
          const modeKey = 'combined'; // Simplified for this implementation

          if (!modeAnalysis[modeKey]) {
            modeAnalysis[modeKey] = {
              observations: 0,
              totalEntropy: 0,
              totalResonance: 0,
              insights: []
            };
          }

          modeAnalysis[modeKey].observations++;
          modeAnalysis[modeKey].totalEntropy += response.data.metrics.entropy;
          modeAnalysis[modeKey].totalResonance += response.data.metrics.resonanceStrength;

          const insight = this.extractInsight(response.data);
          if (insight) {
            modeAnalysis[modeKey].insights.push(insight);
          }
        }
      }

      // Calculate averages and generate recommendations
      const finalAnalysis = Object.entries(modeAnalysis).reduce((acc, [mode, data]) => {
        acc[mode] = {
          observations: data.observations,
          averageEntropy: data.totalEntropy / data.observations,
          averageResonance: data.totalResonance / data.observations,
          insights: data.insights
        };
        return acc;
      }, {} as Record<string, {
        observations: number;
        averageEntropy: number;
        averageResonance: number;
        insights: string[];
      }>);

      const recommendations = this.generateRecommendations(finalAnalysis);

      return {
        data: {
          modeAnalysis: finalAnalysis,
          recommendations
        },
        status: 200,
        message: 'Mode analysis complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Mode analysis failed',
        status: 500,
        message: 'Failed to analyze cognitive modes'
      };
    }
  }

  /**
   * Extract insight from observation
   */
  private extractInsight(observation: QCRObservation): string | null {
    // Simple insight extraction - in reality, this would be more sophisticated
    const response = observation.response.toLowerCase();

    if (response.includes('consciousness') && response.includes('emergent')) {
      return 'Consciousness appears to be an emergent property of complex interactions';
    }

    if (response.includes('resonance') && response.includes('harmony')) {
      return 'Resonance creates harmony between different cognitive modes';
    }

    if (response.includes('stability') && response.includes('convergence')) {
      return 'System shows signs of converging toward stable states';
    }

    return null;
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(analysis: Record<string, {
    observations: number;
    averageEntropy: number;
    averageResonance: number;
    insights: string[];
  }>): string[] {
    const recommendations: string[] = [];

    // Simple recommendation logic
    Object.entries(analysis).forEach(([mode, data]) => {
      if (data.averageResonance > 0.8) {
        recommendations.push(`High resonance in ${mode} mode - excellent cognitive coherence`);
      }

      if (data.averageEntropy < 0.3) {
        recommendations.push(`Low entropy in ${mode} mode - consider introducing more cognitive diversity`);
      }

      if (data.insights.length > 2) {
        recommendations.push(`Rich insights generated in ${mode} mode - continue exploring this cognitive space`);
      }
    });

    return recommendations;
  }

  /**
   * Get default configuration for different consciousness exploration modes
   */
  getDefaultConfig(explorationType: 'philosophical' | 'scientific' | 'creative' | 'therapeutic' | 'general' = 'general') {
    const configs = {
      philosophical: {
        modes: ['analytical', 'ethical', 'creative'],
        maxIterations: 21
      },
      scientific: {
        modes: ['analytical', 'pragmatic'],
        maxIterations: 15
      },
      creative: {
        modes: ['creative', 'emotional', 'analytical'],
        maxIterations: 25
      },
      therapeutic: {
        modes: ['emotional', 'ethical', 'analytical'],
        maxIterations: 18
      },
      general: {
        modes: ['analytical', 'creative', 'ethical'],
        maxIterations: 21
      }
    };

    return configs[explorationType];
  }
}

// Create singleton instance
const qcrApi = new QCRApiService();

export default qcrApi;