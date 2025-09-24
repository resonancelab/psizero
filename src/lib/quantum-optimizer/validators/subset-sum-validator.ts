/**
 * Subset Sum Solution Validator
 */

import type { SubsetSumProblem } from '../problem-generators';
import type { SubsetSumSolution, SolutionQuality } from '../types';

export class SubsetSumValidator {
  static validate(problem: SubsetSumProblem, solution: SubsetSumSolution): SolutionQuality {
    const violations: string[] = [];
    const improvements: string[] = [];
    const metrics: Record<string, number> = {};

    // Validate indices
    const isValidIndices = this.validateIndices(problem, solution.indices, violations);
    
    // Calculate sum
    const calculatedSum = solution.indices.reduce((sum, idx) => sum + problem.numbers[idx], 0);
    metrics.calculatedSum = calculatedSum;
    metrics.targetSum = problem.target;
    metrics.sumError = Math.abs(calculatedSum - problem.target);

    // Validate sum
    const isCorrectSum = calculatedSum === problem.target;
    if (!isCorrectSum) {
      violations.push(`Sum ${calculatedSum} does not equal target ${problem.target}`);
    }

    // Quality metrics
    metrics.subsetSize = solution.indices.length;
    metrics.subsetRatio = solution.indices.length / problem.numbers.length;
    metrics.efficiency = this.calculateEfficiency(problem, solution);

    // Generate improvements
    this.suggestSubsetSumImprovements(problem, solution, improvements);

    const score = isCorrectSum ? 1 - metrics.subsetRatio * 0.3 : 0; // Prefer smaller subsets
    const optimality = isCorrectSum ? this.estimateSubsetSumOptimality(problem, solution) : 0;

    return {
      isValid: isValidIndices && isCorrectSum,
      score,
      optimality,
      confidence: 0.9, // Subset sum validation is very reliable
      details: {
        violations,
        improvements,
        metrics
      }
    };
  }

  private static validateIndices(
    problem: SubsetSumProblem,
    indices: number[],
    violations: string[]
  ): boolean {
    const numberCount = problem.numbers.length;
    
    // Check for valid indices
    for (const idx of indices) {
      if (idx < 0 || idx >= numberCount) {
        violations.push(`Invalid index: ${idx} (must be 0-${numberCount - 1})`);
        return false;
      }
    }

    // Check for duplicates
    const uniqueIndices = new Set(indices);
    if (uniqueIndices.size !== indices.length) {
      violations.push('Subset contains duplicate indices');
      return false;
    }

    return true;
  }

  private static calculateEfficiency(
    problem: SubsetSumProblem,
    solution: SubsetSumSolution
  ): number {
    const numbers = problem.numbers;
    const selectedNumbers = solution.indices.map(idx => numbers[idx]);
    
    // Efficiency based on how well-packed the selection is
    const totalValue = selectedNumbers.reduce((sum, val) => sum + val, 0);
    const avgValue = selectedNumbers.length > 0 ? totalValue / selectedNumbers.length : 0;
    const valueVariance = selectedNumbers.length > 0 
      ? selectedNumbers.reduce((sum, val) => sum + Math.pow(val - avgValue, 2), 0) / selectedNumbers.length 
      : 0;
    
    // Lower variance indicates more consistent selection
    return Math.max(0, 1 - Math.sqrt(valueVariance) / avgValue);
  }

  private static estimateSubsetSumOptimality(
    problem: SubsetSumProblem,
    solution: SubsetSumSolution
  ): number {
    // For subset sum, optimal means finding the smallest subset that hits the target
    const minPossibleSize = this.estimateMinimumSubsetSize(problem);
    const actualSize = solution.indices.length;
    
    if (minPossibleSize === 0) return 1; // No valid solution possible
    
    return Math.max(0, 1 - (actualSize - minPossibleSize) / problem.numbers.length);
  }

  private static estimateMinimumSubsetSize(problem: SubsetSumProblem): number {
    // Greedy estimate: sort numbers by value and see minimum needed
    const sortedNumbers = [...problem.numbers].sort((a, b) => b - a);
    let sum = 0;
    let count = 0;
    
    for (const num of sortedNumbers) {
      sum += num;
      count++;
      if (sum >= problem.target) {
        return count;
      }
    }
    
    return problem.numbers.length; // Fallback
  }

  private static suggestSubsetSumImprovements(
    problem: SubsetSumProblem,
    solution: SubsetSumSolution,
    improvements: string[]
  ): void {
    const minEstimate = this.estimateMinimumSubsetSize(problem);
    
    if (solution.indices.length > minEstimate * 1.5) {
      improvements.push(`Try to reduce subset size from ${solution.indices.length} closer to estimated minimum of ${minEstimate}`);
    }

    if (solution.method === 'classical') {
      improvements.push('Consider quantum approaches for exploring solution space more efficiently');
    }

    // Context-specific suggestions
    switch (problem.context) {
      case 'cryptographic': {
        improvements.push('For cryptographic applications, prefer subsets with powers of 2');
        break;
      }
      case 'financial': {
        improvements.push('In financial contexts, consider transaction costs of multiple selections');
        break;
      }
      case 'scheduling': {
        improvements.push('For scheduling, prefer contiguous time blocks when possible');
        break;
      }
      default: {
        improvements.push('Consider greedy algorithms for initial solution approximation');
        break;
      }
    }
  }
}