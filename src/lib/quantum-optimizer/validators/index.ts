/**
 * Solution Validator Factory and Comparison Utilities
 */

import type {
  TSPProblem,
  SubsetSumProblem,
  MaxCliqueProblem,
  ThreeSATProblem
} from '../problem-generators';

import type {
  TSPSolution,
  SubsetSumSolution,
  MaxCliqueSolution,
  ThreeSATSolution,
  SolutionQuality,
  ProblemType,
  OptimizationProblem,
  OptimizationSolution
} from '../types';

import { TSPValidator } from './tsp-validator';
import { SubsetSumValidator } from './subset-sum-validator';
import { MaxCliqueValidator } from './max-clique-validator';
import { ThreeSATValidator } from './three-sat-validator';

/**
 * Unified Solution Validator Factory
 */
export class SolutionValidatorFactory {
  /**
   * Validate any solution type
   */
  static validate(
    problemType: ProblemType,
    problem: OptimizationProblem,
    solution: OptimizationSolution
  ): SolutionQuality {
    switch (problemType) {
      case 'tsp':
        return TSPValidator.validate(problem as TSPProblem, solution as TSPSolution);
      case 'subsetSum':
        return SubsetSumValidator.validate(problem as SubsetSumProblem, solution as SubsetSumSolution);
      case 'maxClique':
        return MaxCliqueValidator.validate(problem as MaxCliqueProblem, solution as MaxCliqueSolution);
      case 'threeSAT':
        return ThreeSATValidator.validate(problem as ThreeSATProblem, solution as ThreeSATSolution);
      default:
        throw new Error(`Unknown problem type: ${problemType}`);
    }
  }

  /**
   * Get validator for specific problem type
   */
  static getValidator(problemType: ProblemType) {
    switch (problemType) {
      case 'tsp':
        return TSPValidator;
      case 'subsetSum':
        return SubsetSumValidator;
      case 'maxClique':
        return MaxCliqueValidator;
      case 'threeSAT':
        return ThreeSATValidator;
      default:
        throw new Error(`Unknown problem type: ${problemType}`);
    }
  }
}

/**
 * Solution quality comparison utilities
 */
export const SolutionComparison = {
  /**
   * Compare two solutions of the same problem type
   */
  compare(
    quality1: SolutionQuality,
    quality2: SolutionQuality
  ): {
    better: 'first' | 'second' | 'tie';
    scoreDifference: number;
    optimalityDifference: number;
    improvements: string[];
  } {
    const scoreDiff = quality1.score - quality2.score;
    const optimalityDiff = quality1.optimality - quality2.optimality;
    
    let better: 'first' | 'second' | 'tie';
    if (Math.abs(scoreDiff) < 0.01 && Math.abs(optimalityDiff) < 0.01) {
      better = 'tie';
    } else if (quality1.score > quality2.score || 
               (Math.abs(scoreDiff) < 0.01 && quality1.optimality > quality2.optimality)) {
      better = 'first';
    } else {
      better = 'second';
    }

    const improvements: string[] = [];
    
    if (better === 'first' && quality2.details.improvements.length > 0) {
      improvements.push('Second solution could improve by:');
      improvements.push(...quality2.details.improvements);
    } else if (better === 'second' && quality1.details.improvements.length > 0) {
      improvements.push('First solution could improve by:');
      improvements.push(...quality1.details.improvements);
    } else if (better === 'tie') {
      improvements.push('Both solutions have similar quality');
      improvements.push(...quality1.details.improvements);
    }

    return {
      better,
      scoreDifference: scoreDiff,
      optimalityDifference: optimalityDiff,
      improvements
    };
  },

  /**
   * Rank multiple solutions
   */
  rank(qualities: SolutionQuality[]): Array<{ index: number; quality: SolutionQuality; rank: number }> {
    const indexed = qualities.map((quality, index) => ({ index, quality }));
    
    // Sort by score first, then optimality
    indexed.sort((a, b) => {
      const scoreDiff = b.quality.score - a.quality.score;
      if (Math.abs(scoreDiff) < 0.01) {
        return b.quality.optimality - a.quality.optimality;
      }
      return scoreDiff;
    });

    return indexed.map((item, rank) => ({ ...item, rank: rank + 1 }));
  },

  /**
   * Generate quality summary
   */
  summarize(quality: SolutionQuality): string {
    const validText = quality.isValid ? 'Valid' : 'Invalid';
    const scoreText = `Score: ${(quality.score * 100).toFixed(1)}%`;
    const optimalityText = `Optimality: ${(quality.optimality * 100).toFixed(1)}%`;
    
    let summary = `${validText} solution - ${scoreText}, ${optimalityText}`;
    
    if (quality.details.violations.length > 0) {
      summary += ` (${quality.details.violations.length} violations)`;
    }
    
    if (quality.details.improvements.length > 0) {
      summary += ` (${quality.details.improvements.length} improvement suggestions)`;
    }
    
    return summary;
  }
};

// Re-export individual validators
export { TSPValidator } from './tsp-validator';
export { SubsetSumValidator } from './subset-sum-validator';
export { MaxCliqueValidator } from './max-clique-validator';
export { ThreeSATValidator } from './three-sat-validator';

// Re-export types
export type * from '../types';