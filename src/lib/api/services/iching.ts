import apiClient from '../client';
import {
  IChingEvolveRequest,
  IChingEvolveResponse,
  IChingConfig,
  ApiResponse
} from '../types';

export class IChingApiService {
  /**
   * Evolve hexagram sequences from a question
   */
  async evolve(request: IChingEvolveRequest): Promise<ApiResponse<IChingEvolveResponse>> {
    return apiClient.post<IChingEvolveResponse>('/iching/evolve', request);
  }

  /**
   * Quick hexagram evolution with defaults
   */
  async quickEvolve(
    question: string,
    steps: number = 7
  ): Promise<ApiResponse<IChingEvolveResponse>> {
    const request: IChingEvolveRequest = {
      question,
      steps
    };

    return this.evolve(request);
  }

  /**
   * Advanced evolution with custom parameters
   */
  async advancedEvolve(
    question: string,
    options: {
      steps?: number;
      customParameters?: Record<string, unknown>;
    } = {}
  ): Promise<ApiResponse<IChingEvolveResponse>> {
    const request: IChingEvolveRequest = {
      question,
      ...options
    };

    return this.evolve(request);
  }

  /**
   * Multi-question evolution for comparative analysis
   */
  async compareQuestions(
    questions: string[],
    steps: number = 7
  ): Promise<ApiResponse<{
    evolutions: Array<{
      question: string;
      response: IChingEvolveResponse;
    }>;
    comparison: {
      commonThemes: string[];
      divergentPaths: string[];
      stabilityAnalysis: Record<string, number>;
    };
  }>> {
    try {
      const evolutions = [];

      for (const question of questions) {
        const response = await this.quickEvolve(question, steps);
        if (response.data) {
          evolutions.push({
            question,
            response: response.data
          });
        } else {
          throw new Error(response.error || `Failed to evolve question: ${question}`);
        }
      }

      // Generate comparison analysis
      const comparison = this.analyzeComparisons(evolutions);

      return {
        data: {
          evolutions,
          comparison
        },
        status: 200,
        message: 'Question comparison complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Question comparison failed',
        status: 500,
        message: 'Failed to compare questions'
      };
    }
  }

  /**
   * Monitor hexagram evolution over time
   */
  async monitorEvolution(
    question: string,
    durationMs: number = 30000,
    intervalMs: number = 5000
  ): Promise<ApiResponse<{
    question: string;
    evolutions: IChingEvolveResponse[];
    temporalAnalysis: {
      stability: number;
      changePatterns: string[];
      attractorPoints: string[];
    };
  }>> {
    try {
      const evolutions: IChingEvolveResponse[] = [];
      const startTime = Date.now();

      while (Date.now() - startTime < durationMs) {
        const response = await this.quickEvolve(question, 7);
        if (response.data) {
          evolutions.push(response.data);
        }

        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }

      const temporalAnalysis = this.analyzeTemporalEvolution(evolutions);

      return {
        data: {
          question,
          evolutions,
          temporalAnalysis
        },
        status: 200,
        message: 'Evolution monitoring complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Evolution monitoring failed',
        status: 500,
        message: 'Failed to monitor hexagram evolution'
      };
    }
  }

  /**
   * Analyze hexagram patterns and meanings
   */
  async analyzeHexagram(
    hexagram: string,
    context?: string
  ): Promise<ApiResponse<{
    hexagram: string;
    binary: string;
    analysis: {
      structure: string;
      energy: string;
      transformation: string;
      guidance: string;
    };
    contextInfluence?: string;
  }>> {
    try {
      // This would typically call a separate analysis endpoint
      // For now, we'll provide a basic analysis
      const analysis = this.performHexagramAnalysis(hexagram, context);

      return {
        data: {
          hexagram,
          binary: hexagram,
          analysis,
          contextInfluence: context ? `Context "${context}" influences the reading toward ${analysis.energy}` : undefined
        },
        status: 200,
        message: 'Hexagram analysis complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Hexagram analysis failed',
        status: 500,
        message: 'Failed to analyze hexagram'
      };
    }
  }

  /**
   * Generate wisdom insights from hexagram evolution
   */
  async generateInsights(
    question: string,
    evolution: IChingEvolveResponse
  ): Promise<ApiResponse<{
    question: string;
    insights: string[];
    recommendations: string[];
    warnings: string[];
  }>> {
    try {
      const insights = this.extractInsights(evolution);
      const recommendations = this.generateRecommendations(evolution);
      const warnings = this.identifyWarnings(evolution);

      return {
        data: {
          question,
          insights,
          recommendations,
          warnings
        },
        status: 200,
        message: 'Wisdom insights generated'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Insight generation failed',
        status: 500,
        message: 'Failed to generate wisdom insights'
      };
    }
  }

  /**
   * Analyze comparisons between multiple evolutions
   */
  private analyzeComparisons(evolutions: Array<{
    question: string;
    response: IChingEvolveResponse;
  }>): {
    commonThemes: string[];
    divergentPaths: string[];
    stabilityAnalysis: Record<string, number>;
  } {
    const commonThemes: string[] = [];
    const divergentPaths: string[] = [];
    const stabilityAnalysis: Record<string, number> = {};

    // Simple analysis logic
    evolutions.forEach(({ question, response }) => {
      const stability = response.stabilized ? 1 : 0;
      stabilityAnalysis[question] = stability;

      if (response.stabilized) {
        commonThemes.push(`${question}: Shows stable, resolved energy patterns`);
      } else {
        divergentPaths.push(`${question}: Indicates ongoing transformation and change`);
      }
    });

    return {
      commonThemes,
      divergentPaths,
      stabilityAnalysis
    };
  }

  /**
   * Analyze temporal evolution patterns
   */
  private analyzeTemporalEvolution(evolutions: IChingEvolveResponse[]): {
    stability: number;
    changePatterns: string[];
    attractorPoints: string[];
  } {
    const stability = evolutions.filter(e => e.stabilized).length / evolutions.length;
    const changePatterns: string[] = [];
    const attractorPoints: string[] = [];

    // Analyze patterns
    if (stability > 0.7) {
      changePatterns.push('High stability indicates consistent guidance');
    } else if (stability < 0.3) {
      changePatterns.push('Low stability suggests rapid transformation');
    } else {
      changePatterns.push('Moderate stability with evolving insights');
    }

    // Find common hexagrams
    const hexagramCounts: Record<string, number> = {};
    evolutions.forEach(evolution => {
      evolution.sequence.forEach(step => {
        hexagramCounts[step.hexagram] = (hexagramCounts[step.hexagram] || 0) + 1;
      });
    });

    Object.entries(hexagramCounts).forEach(([hexagram, count]) => {
      if (count > evolutions.length * 0.5) {
        attractorPoints.push(`Hexagram ${hexagram} appears frequently (${count} times)`);
      }
    });

    return {
      stability,
      changePatterns,
      attractorPoints
    };
  }

  /**
   * Perform basic hexagram analysis
   */
  private performHexagramAnalysis(hexagram: string, context?: string): {
    structure: string;
    energy: string;
    transformation: string;
    guidance: string;
  } {
    // Simple analysis based on hexagram patterns
    const solidLines = (hexagram.match(/1/g) || []).length;
    const brokenLines = (hexagram.match(/0/g) || []).length;

    let structure = '';
    let energy = '';
    let transformation = '';
    let guidance = '';

    if (solidLines > brokenLines) {
      structure = 'Strong, stable foundation';
      energy = 'Yang-dominant, active energy';
      transformation = 'Building and creating';
      guidance = 'Focus on structure and stability';
    } else if (brokenLines > solidLines) {
      structure = 'Flexible, adaptive foundation';
      energy = 'Yin-dominant, receptive energy';
      transformation = 'Adapting and receiving';
      guidance = 'Embrace flexibility and change';
    } else {
      structure = 'Balanced, harmonious foundation';
      energy = 'Balanced yin-yang energy';
      transformation = 'Maintaining equilibrium';
      guidance = 'Seek balance and harmony';
    }

    if (context) {
      guidance += ` (considering: ${context})`;
    }

    return {
      structure,
      energy,
      transformation,
      guidance
    };
  }

  /**
   * Extract insights from evolution
   */
  private extractInsights(evolution: IChingEvolveResponse): string[] {
    const insights: string[] = [];

    if (evolution.stabilized) {
      insights.push('The situation shows signs of resolution and clarity');
    } else {
      insights.push('The situation is still evolving and transforming');
    }

    const avgEntropy = evolution.sequence.reduce((sum, step) => sum + step.entropy, 0) / evolution.sequence.length;
    if (avgEntropy > 0.7) {
      insights.push('High entropy suggests creative potential and new possibilities');
    } else if (avgEntropy < 0.3) {
      insights.push('Low entropy indicates stability and established patterns');
    }

    return insights;
  }

  /**
   * Generate recommendations based on evolution
   */
  private generateRecommendations(evolution: IChingEvolveResponse): string[] {
    const recommendations: string[] = [];

    if (evolution.stabilized) {
      recommendations.push('The time is right for decisive action');
      recommendations.push('Trust in the current direction and proceed with confidence');
    } else {
      recommendations.push('Allow the situation to evolve naturally');
      recommendations.push('Practice patience and observe developments');
    }

    const finalStep = evolution.sequence[evolution.sequence.length - 1];
    if (finalStep.entropy > 0.8) {
      recommendations.push('Embrace creativity and explore new approaches');
    } else if (finalStep.entropy < 0.2) {
      recommendations.push('Focus on practical implementation and details');
    }

    return recommendations;
  }

  /**
   * Identify warnings from evolution
   */
  private identifyWarnings(evolution: IChingEvolveResponse): string[] {
    const warnings: string[] = [];

    const entropyVariance = this.calculateVariance(
      evolution.sequence.map(step => step.entropy)
    );

    if (entropyVariance > 0.5) {
      warnings.push('High entropy fluctuations suggest potential instability');
    }

    const proximityVariance = this.calculateVariance(
      evolution.sequence.map(step => step.attractorProximity)
    );

    if (proximityVariance > 0.3) {
      warnings.push('Variable attractor proximity indicates uncertain direction');
    }

    return warnings;
  }

  /**
   * Calculate variance of an array of numbers
   */
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
    return squaredDifferences.reduce((sum, value) => sum + value, 0) / values.length;
  }

  /**
   * Get default configuration for different types of questions
   */
  getDefaultConfig(questionType: 'personal' | 'business' | 'spiritual' | 'general' = 'general') {
    const configs = {
      personal: {
        steps: 7,
        focus: 'relationships and personal growth'
      },
      business: {
        steps: 6,
        focus: 'decisions and strategy'
      },
      spiritual: {
        steps: 9,
        focus: 'wisdom and enlightenment'
      },
      general: {
        steps: 7,
        focus: 'general guidance'
      }
    };

    return configs[questionType];
  }
}

// Create singleton instance
const ichingApi = new IChingApiService();

export default ichingApi;