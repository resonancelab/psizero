/**
 * Type definitions for quantum optimization problems and solutions
 */

import type {
  TSPProblem,
  SubsetSumProblem,
  MaxCliqueProblem,
  ThreeSATProblem,
  City
} from './problem-generators';

// Re-export problem types for convenient importing
export type {
  TSPProblem,
  SubsetSumProblem,
  MaxCliqueProblem,
  ThreeSATProblem,
  City
};

// Solution quality metrics
export interface SolutionQuality {
  isValid: boolean;
  score: number; // 0-1, higher is better
  optimality: number; // 0-1, estimated optimality
  confidence: number; // 0-1, confidence in quality assessment
  details: {
    violations: string[];
    improvements: string[];
    metrics: Record<string, number>;
  };
}

// Base solution interface
interface BaseSolution {
  timestamp: Date;
  method: 'quantum' | 'classical' | 'hybrid';
  iterations?: number;
  timeElapsed?: number;
}

// TSP Solution representation
export interface TSPSolution extends BaseSolution {
  tour: number[];
  distance: number;
}

// Subset Sum Solution representation
export interface SubsetSumSolution extends BaseSolution {
  indices: number[];
  sum: number;
}

// Maximum Clique Solution representation
export interface MaxCliqueSolution extends BaseSolution {
  clique: number[];
  size: number;
}

// 3-SAT Solution representation
export interface ThreeSATSolution extends BaseSolution {
  assignment: boolean[];
  satisfiedClauses: number;
}

// Union types for generic handling
export type OptimizationProblem = TSPProblem | SubsetSumProblem | MaxCliqueProblem | ThreeSATProblem;
export type OptimizationSolution = TSPSolution | SubsetSumSolution | MaxCliqueSolution | ThreeSATSolution;

// Problem type discriminator
export type ProblemType = 'tsp' | 'subsetSum' | 'maxClique' | 'threeSAT';

// Validator interface
export interface SolutionValidator<TProblem, TSolution> {
  validate(problem: TProblem, solution: TSolution): SolutionQuality;
}