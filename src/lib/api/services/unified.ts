import apiClient from '../client';
import {
  GravityRequest,
  GravityResponse,
  UnifiedConfig,
  ApiResponse
} from '../types';

export class UnifiedPhysicsApiService {
  /**
   * Compute emergent gravity from observer-entropy parameters
   */
  async computeGravity(request: GravityRequest): Promise<ApiResponse<GravityResponse>> {
    return apiClient.post<GravityResponse>('/unified/gravity/compute', request);
  }

  /**
   * Quick gravity computation with defaults
   */
  async quickGravity(
    observerEntropyReductionRate: number,
    regionEntropyGradient: number = 0.002,
    config?: UnifiedConfig
  ): Promise<ApiResponse<GravityResponse>> {
    const request: GravityRequest = {
      observerEntropyReductionRate,
      regionEntropyGradient,
      config
    };

    return this.computeGravity(request);
  }

  /**
   * Advanced gravity computation with custom parameters
   */
  async advancedGravity(
    observerEntropyReductionRate: number,
    options: {
      regionEntropyGradient?: number;
      config?: UnifiedConfig;
    } = {}
  ): Promise<ApiResponse<GravityResponse>> {
    const request: GravityRequest = {
      observerEntropyReductionRate,
      regionEntropyGradient: options.regionEntropyGradient || 0.002,
      config: options.config
    };

    return this.computeGravity(request);
  }

  /**
   * Simulate gravitational field evolution
   */
  async simulateFieldEvolution(
    initialEntropyRate: number,
    steps: number = 10,
    stepSize: number = 0.1
  ): Promise<ApiResponse<{
    evolution: Array<{
      step: number;
      entropyRate: number;
      effectiveG: number;
      fieldStrength: number;
      notes: string;
    }>;
    finalState: GravityResponse;
    analysis: {
      stability: string;
      convergence: string;
      physicalInterpretation: string;
    };
  }>> {
    try {
      const evolution = [];

      for (let i = 0; i < steps; i++) {
        const entropyRate = initialEntropyRate + (i * stepSize);
        const response = await this.quickGravity(entropyRate);

        if (response.data) {
          evolution.push({
            step: i,
            entropyRate,
            effectiveG: response.data.effectiveG,
            fieldStrength: response.data.fieldStrength,
            notes: response.data.notes
          });
        } else {
          throw new Error(response.error || `Failed at step ${i}`);
        }
      }

      // Get final state
      const finalResponse = await this.quickGravity(initialEntropyRate + ((steps - 1) * stepSize));
      if (!finalResponse.data) {
        throw new Error(finalResponse.error || 'Failed to get final state');
      }

      const analysis = this.analyzeEvolution(evolution);

      return {
        data: {
          evolution,
          finalState: finalResponse.data,
          analysis
        },
        status: 200,
        message: 'Field evolution simulation complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Field evolution simulation failed',
        status: 500,
        message: 'Failed to simulate gravitational field evolution'
      };
    }
  }

  /**
   * Compare different entropy scenarios
   */
  async compareScenarios(
    scenarios: Array<{
      name: string;
      observerEntropyReductionRate: number;
      regionEntropyGradient?: number;
      blackHoleProxyDensity?: number;
    }>
  ): Promise<ApiResponse<{
    comparisons: Array<{
      name: string;
      result: GravityResponse;
      relativeStrength: number;
    }>;
    analysis: {
      strongestField: string;
      weakestField: string;
      averageStrength: number;
      fieldVariance: number;
    };
  }>> {
    try {
      const comparisons = [];

      for (const scenario of scenarios) {
        const response = await this.computeGravity({
          observerEntropyReductionRate: scenario.observerEntropyReductionRate,
          regionEntropyGradient: scenario.regionEntropyGradient || 0.002
        });

        if (response.data) {
          comparisons.push({
            name: scenario.name,
            result: response.data,
            relativeStrength: response.data.fieldStrength
          });
        } else {
          throw new Error(response.error || `Failed for scenario: ${scenario.name}`);
        }
      }

      const analysis = this.analyzeComparisons(comparisons);

      return {
        data: {
          comparisons,
          analysis
        },
        status: 200,
        message: 'Scenario comparison complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Scenario comparison failed',
        status: 500,
        message: 'Failed to compare gravitational scenarios'
      };
    }
  }

  /**
   * Calculate gravitational binding energy
   */
  async calculateBindingEnergy(
    observerEntropyReductionRate: number,
    systemMass: number = 1.0,
    systemRadius: number = 1.0
  ): Promise<ApiResponse<{
    gravitationalResult: GravityResponse;
    bindingEnergy: number;
    bindingEnergyPerMass: number;
    stability: string;
    physicalNotes: string[];
  }>> {
    try {
      const gravityResponse = await this.quickGravity(observerEntropyReductionRate);
      if (!gravityResponse.data) {
        throw new Error(gravityResponse.error || 'Failed to compute gravity');
      }

      // Calculate binding energy using emergent G
      const G = gravityResponse.data.effectiveG;
      const M = systemMass;
      const R = systemRadius;

      const bindingEnergy = (3/5) * G * M * M / R;
      const bindingEnergyPerMass = bindingEnergy / M;

      const stability = this.assessStability(bindingEnergy, bindingEnergyPerMass);
      const physicalNotes = this.generatePhysicalNotes(gravityResponse.data, bindingEnergy);

      return {
        data: {
          gravitationalResult: gravityResponse.data,
          bindingEnergy,
          bindingEnergyPerMass,
          stability,
          physicalNotes
        },
        status: 200,
        message: 'Binding energy calculation complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Binding energy calculation failed',
        status: 500,
        message: 'Failed to calculate gravitational binding energy'
      };
    }
  }

  /**
   * Analyze black hole formation conditions
   */
  async analyzeBlackHoleFormation(
    entropyScenarios: Array<{
      name: string;
      observerEntropyReductionRate: number;
      blackHoleProxyDensity: number;
    }>
  ): Promise<ApiResponse<{
    scenarios: Array<{
      name: string;
      result: GravityResponse;
      eventHorizon: boolean;
      schwarzschildRadius: number;
      formationProbability: number;
    }>;
    analysis: {
      mostLikelyFormation: string;
      criticalThreshold: number;
      stabilityAssessment: string;
    };
  }>> {
    try {
      const scenarios = [];

      for (const scenario of entropyScenarios) {
        const response = await this.computeGravity({
          observerEntropyReductionRate: scenario.observerEntropyReductionRate,
          regionEntropyGradient: 0.002 // Use default value since scenarios may not have this field
        });

        if (response.data) {
          const eventHorizon = response.data.effectiveG > 1e10; // Simplified threshold
          const schwarzschildRadius = this.calculateSchwarzschildRadius(response.data);
          const formationProbability = this.calculateFormationProbability(response.data);

          scenarios.push({
            name: scenario.name,
            result: response.data,
            eventHorizon,
            schwarzschildRadius,
            formationProbability
          });
        } else {
          throw new Error(response.error || `Failed for scenario: ${scenario.name}`);
        }
      }

      const analysis = this.analyzeFormationConditions(scenarios);

      return {
        data: {
          scenarios,
          analysis
        },
        status: 200,
        message: 'Black hole formation analysis complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Black hole formation analysis failed',
        status: 500,
        message: 'Failed to analyze black hole formation conditions'
      };
    }
  }

  /**
   * Analyze evolution patterns
   */
  private analyzeEvolution(evolution: Array<{
    step: number;
    entropyRate: number;
    effectiveG: number;
    fieldStrength: number;
    notes: string;
  }>): {
    stability: string;
    convergence: string;
    physicalInterpretation: string;
  } {
    const gValues = evolution.map(e => e.effectiveG);
    const gVariance = this.calculateVariance(gValues);

    let stability = '';
    let convergence = '';
    let physicalInterpretation = '';

    if (gVariance < 0.01) {
      stability = 'Highly stable - consistent gravitational field';
      convergence = 'Strong convergence to equilibrium state';
      physicalInterpretation = 'System reaches stable gravitational configuration';
    } else if (gVariance < 0.1) {
      stability = 'Moderately stable - minor fluctuations';
      convergence = 'Gradual convergence with some oscillations';
      physicalInterpretation = 'System experiences minor gravitational perturbations';
    } else {
      stability = 'Unstable - significant fluctuations';
      convergence = 'Poor convergence - chaotic behavior';
      physicalInterpretation = 'System shows chaotic gravitational dynamics';
    }

    return {
      stability,
      convergence,
      physicalInterpretation
    };
  }

  /**
   * Analyze comparison results
   */
  private analyzeComparisons(comparisons: Array<{
    name: string;
    result: GravityResponse;
    relativeStrength: number;
  }>): {
    strongestField: string;
    weakestField: string;
    averageStrength: number;
    fieldVariance: number;
  } {
    const strengths = comparisons.map(c => c.relativeStrength);
    const maxStrength = Math.max(...strengths);
    const minStrength = Math.min(...strengths);
    const averageStrength = strengths.reduce((sum, s) => sum + s, 0) / strengths.length;
    const fieldVariance = this.calculateVariance(strengths);

    const strongestField = comparisons.find(c => c.relativeStrength === maxStrength)?.name || '';
    const weakestField = comparisons.find(c => c.relativeStrength === minStrength)?.name || '';

    return {
      strongestField,
      weakestField,
      averageStrength,
      fieldVariance
    };
  }

  /**
   * Assess system stability
   */
  private assessStability(bindingEnergy: number, bindingEnergyPerMass: number): string {
    if (bindingEnergyPerMass > 1e5) {
      return 'Highly bound - extremely stable system';
    } else if (bindingEnergyPerMass > 1e3) {
      return 'Well bound - stable gravitational system';
    } else if (bindingEnergyPerMass > 1e2) {
      return 'Moderately bound - marginally stable';
    } else {
      return 'Weakly bound - potentially unstable';
    }
  }

  /**
   * Generate physical interpretation notes
   */
  private generatePhysicalNotes(result: GravityResponse, bindingEnergy: number): string[] {
    const notes: string[] = [];

    if (result.effectiveG > 6.674e-11 * 2) {
      notes.push('Gravitational constant significantly enhanced by entropy dynamics');
    }

    if (bindingEnergy > 1e40) {
      notes.push('Extremely high binding energy suggests supermassive system formation');
    }

    if (result.fieldStrength > 100) {
      notes.push('Strong gravitational field may lead to relativistic effects');
    }

    notes.push(`Emergent gravity computed from observer entropy reduction rate`);
    notes.push(`Field strength indicates ${result.fieldStrength > 9.8 ? 'enhanced' : 'standard'} gravitational effects`);

    return notes;
  }

  /**
   * Calculate Schwarzschild radius
   */
  private calculateSchwarzschildRadius(result: GravityResponse): number {
    // Simplified calculation using emergent G
    const G = result.effectiveG;
    const c = 299792458; // speed of light
    const M = 1.989e30; // solar mass (example)

    return (2 * G * M) / (c * c);
  }

  /**
   * Calculate formation probability
   */
  private calculateFormationProbability(result: GravityResponse): number {
    // Simplified probability based on field strength
    const normalizedStrength = Math.min(result.fieldStrength / 1000, 1);
    return Math.max(0, Math.min(1, normalizedStrength));
  }

  /**
   * Analyze formation conditions
   */
  private analyzeFormationConditions(scenarios: Array<{
    name: string;
    result: GravityResponse;
    eventHorizon: boolean;
    schwarzschildRadius: number;
    formationProbability: number;
  }>): {
    mostLikelyFormation: string;
    criticalThreshold: number;
    stabilityAssessment: string;
  } {
    const formationScenarios = scenarios.filter(s => s.eventHorizon);
    const maxProbability = Math.max(...scenarios.map(s => s.formationProbability));

    const mostLikelyFormation = scenarios.find(s => s.formationProbability === maxProbability)?.name || '';
    const criticalThreshold = scenarios.reduce((min, s) =>
      s.result.effectiveG < min ? s.result.effectiveG : min, Infinity
    );

    let stabilityAssessment = '';
    if (formationScenarios.length === 0) {
      stabilityAssessment = 'No black hole formation conditions detected';
    } else if (formationScenarios.length === 1) {
      stabilityAssessment = 'Single scenario shows black hole formation potential';
    } else {
      stabilityAssessment = `${formationScenarios.length} scenarios show black hole formation potential`;
    }

    return {
      mostLikelyFormation,
      criticalThreshold: isFinite(criticalThreshold) ? criticalThreshold : 0,
      stabilityAssessment
    };
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
   * Get default configuration for different physics scenarios
   */
  getDefaultConfig(scenario: 'stellar' | 'galactic' | 'cosmological' | 'quantum' | 'general' = 'general') {
    const configs = {
      stellar: {
        observerEntropyReductionRate: 15.0,
        regionEntropyGradient: 0.001,
        blackHoleProxyDensity: 0.01
      },
      galactic: {
        observerEntropyReductionRate: 12.0,
        regionEntropyGradient: 0.0005,
        blackHoleProxyDensity: 0.005
      },
      cosmological: {
        observerEntropyReductionRate: 10.0,
        regionEntropyGradient: 0.0001,
        blackHoleProxyDensity: 0.001
      },
      quantum: {
        observerEntropyReductionRate: 20.0,
        regionEntropyGradient: 0.01,
        blackHoleProxyDensity: 0.1
      },
      general: {
        observerEntropyReductionRate: 12.4,
        regionEntropyGradient: 0.002,
        blackHoleProxyDensity: 0.001
      }
    };

    return configs[scenario];
  }
}

// Create singleton instance
const unifiedApi = new UnifiedPhysicsApiService();

export default unifiedApi;