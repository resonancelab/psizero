import apiClient from '../client';
import {
  SRSRequest,
  SRSolution,
  ApiResponse
} from '../types';

export class SRSApiService {
  /**
   * Solve an NP-complete problem using Symbolic Resonance
   */
  async solve(request: SRSRequest): Promise<ApiResponse<SRSolution>> {
    return apiClient.post<SRSolution>('/srs/solve', request);
  }

  /**
   * Solve a 3-SAT problem
   */
  async solve3SAT(
    variables: number,
    clauses: Array<Array<{ var: number; neg: boolean }>>,
    config?: SRSRequest['config']
  ): Promise<ApiResponse<SRSolution>> {
    const request: SRSRequest = {
      problem: '3sat',
      Spec: { variables, clauses },
      Config: config
    };

    return this.solve(request);
  }

  /**
   * Solve a Subset Sum problem
   */
  async solveSubsetSum(
    weights: number[],
    target: number,
    config?: SRSRequest['Config']
  ): Promise<ApiResponse<SRSolution>> {
    const request: SRSRequest = {
      Problem: 'subsetsum',
      Spec: { weights, target },
      Config: config
    };

    return this.solve(request);
  }

  /**
   * Solve a Hamiltonian Path problem
   */
  async solveHamiltonianPath(
    adjacencyMatrix: number[][],
    config?: SRSRequest['Config']
  ): Promise<ApiResponse<SRSolution>> {
    // Convert adjacency matrix to the expected format
    const edges = [];
    for (let i = 0; i < adjacencyMatrix.length; i++) {
      for (let j = 0; j < adjacencyMatrix[i].length; j++) {
        if (adjacencyMatrix[i][j] === 1) {
          edges.push([i, j]);
        }
      }
    }

    const request: SRSRequest = {
      Problem: 'hamiltonian_path',
      Spec: { edges },
      Config: config
    };

    return this.solve(request);
  }

  /**
   * Solve a Vertex Cover problem
   */
  async solveVertexCover(
    edges: Array<[number, number]>,
    maxCoverSize?: number,
    config?: SRSRequest['Config']
  ): Promise<ApiResponse<SRSolution>> {
    const request: SRSRequest = {
      Problem: 'vertex_cover',
      Spec: { edges, maxCoverSize },
      Config: config
    };

    return this.solve(request);
  }

  /**
   * Solve a Graph Clique problem
   */
  async solveClique(
    edges: Array<[number, number]>,
    minCliqueSize?: number,
    config?: SRSRequest['Config']
  ): Promise<ApiResponse<SRSolution>> {
    const request: SRSRequest = {
      Problem: 'clique',
      Spec: { edges, minCliqueSize },
      Config: config
    };

    return this.solve(request);
  }

  /**
   * Solve an Exact Cover (X3C) problem
   */
  async solveX3C(
    universe: number[],
    subsets: number[][],
    config?: SRSRequest['Config']
  ): Promise<ApiResponse<SRSolution>> {
    const request: SRSRequest = {
      Problem: 'x3c',
      Spec: { universe, subsets },
      Config: config
    };

    return this.solve(request);
  }

  /**
   * Get default configuration for different problem types
   */
  getDefaultConfig(problemType: string) {
    const baseConfig = {
      stop: {
        plateauEps: 1e-6,
        plateauT: 150,
        massThreshold: 0.97,
        satProb: 0.995,
        iterMax: 20000,
        restarts: 20
      },
      entropy: {
        lambdaPrime: 0.1,
        betaPrimes: 'auto'
      }
    };

    switch (problemType) {
      case '3sat':
        return {
          ...baseConfig,
          schedules: {
            eta0: 0.3,
            etaDecay: 0.002,
            alphaMin: 0.2,
            alphaGrowth: 0.01
          }
        };

      case 'subsetsum':
        return {
          ...baseConfig,
          schedules: {
            eta0: 0.25,
            etaDecay: 0.001,
            alphaMin: 0.15,
            alphaGrowth: 0.005
          }
        };

      default:
        return baseConfig;
    }
  }
}

// Create singleton instance
const srsApi = new SRSApiService();

export default srsApi;