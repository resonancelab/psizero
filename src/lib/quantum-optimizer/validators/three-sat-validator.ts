/**
 * 3-SAT Solution Validator
 */

import type { ThreeSATProblem } from '../problem-generators';
import type { ThreeSATSolution, SolutionQuality } from '../types';

export class ThreeSATValidator {
  static validate(problem: ThreeSATProblem, solution: ThreeSATSolution): SolutionQuality {
    const violations: string[] = [];
    const improvements: string[] = [];
    const metrics: Record<string, number> = {};

    // Validate assignment length
    const isValidLength = solution.assignment.length === problem.variables.length;
    if (!isValidLength) {
      violations.push(`Assignment length ${solution.assignment.length} does not match variable count ${problem.variables.length}`);
    }

    // Count satisfied clauses
    const satisfiedCount = this.countSatisfiedClauses(problem, solution.assignment);
    metrics.satisfiedClauses = satisfiedCount;
    metrics.totalClauses = problem.clauses.length;
    metrics.reportedSatisfied = solution.satisfiedClauses;
    metrics.satisfactionRatio = satisfiedCount / problem.clauses.length;

    if (satisfiedCount !== solution.satisfiedClauses) {
      violations.push(`Reported satisfied clauses ${solution.satisfiedClauses} does not match actual ${satisfiedCount}`);
    }

    // Check if fully satisfiable
    const isFullySatisfied = satisfiedCount === problem.clauses.length;
    metrics.isFullySatisfied = isFullySatisfied ? 1 : 0;

    // Quality metrics
    metrics.balance = this.calculateAssignmentBalance(solution.assignment);
    metrics.consistency = this.calculateAssignmentConsistency(problem, solution.assignment);

    // Generate improvements
    this.suggest3SATImprovements(problem, solution, improvements);

    const score = metrics.satisfactionRatio;
    const optimality = isFullySatisfied ? 1 : metrics.satisfactionRatio * 0.8;

    return {
      isValid: isValidLength && violations.length === 0,
      score,
      optimality,
      confidence: 1.0, // 3-SAT validation is deterministic
      details: {
        violations,
        improvements,
        metrics
      }
    };
  }

  private static countSatisfiedClauses(problem: ThreeSATProblem, assignment: boolean[]): number {
    let satisfied = 0;
    
    for (const clause of problem.clauses) {
      const clauseSatisfied = clause.literals.some(literal => {
        const value = assignment[literal.variable];
        return literal.negated ? !value : value;
      });
      
      if (clauseSatisfied) {
        satisfied++;
      }
    }
    
    return satisfied;
  }

  private static calculateAssignmentBalance(assignment: boolean[]): number {
    const trueCount = assignment.filter(Boolean).length;
    const totalCount = assignment.length;
    const ratio = trueCount / totalCount;
    
    // Balance is best when ratio is close to 0.5
    return 1 - Math.abs(ratio - 0.5) * 2;
  }

  private static calculateAssignmentConsistency(
    problem: ThreeSATProblem,
    assignment: boolean[]
  ): number {
    // Consistency based on how often variables appear in satisfied clauses
    const variableUsage = new Map<number, { satisfied: number; total: number }>();
    
    for (let i = 0; i < problem.variables.length; i++) {
      variableUsage.set(i, { satisfied: 0, total: 0 });
    }

    for (const clause of problem.clauses) {
      const clauseSatisfied = clause.literals.some(literal => {
        const value = assignment[literal.variable];
        return literal.negated ? !value : value;
      });

      for (const literal of clause.literals) {
        const usage = variableUsage.get(literal.variable)!;
        usage.total++;
        if (clauseSatisfied) {
          usage.satisfied++;
        }
      }
    }

    // Calculate average satisfaction rate per variable
    let totalConsistency = 0;
    let variableCount = 0;

    for (const [, usage] of variableUsage) {
      if (usage.total > 0) {
        totalConsistency += usage.satisfied / usage.total;
        variableCount++;
      }
    }

    return variableCount > 0 ? totalConsistency / variableCount : 0;
  }

  private static suggest3SATImprovements(
    problem: ThreeSATProblem,
    solution: ThreeSATSolution,
    improvements: string[]
  ): void {
    const satisfactionRatio = solution.satisfiedClauses / problem.clauses.length;
    
    if (satisfactionRatio < 1.0) {
      const unsatisfied = problem.clauses.length - solution.satisfiedClauses;
      improvements.push(`Try to satisfy ${unsatisfied} remaining clauses (${Math.round((1 - satisfactionRatio) * 100)}% unsatisfied)`);
    }

    // Check assignment balance
    const balance = this.calculateAssignmentBalance(solution.assignment);
    if (balance < 0.7) {
      improvements.push('Consider more balanced variable assignments (current assignment is skewed)');
    }

    // Context-specific suggestions
    switch (problem.context) {
      case 'circuit': {
        improvements.push('For circuit design, verify logical consistency of gate outputs');
        break;
      }
      case 'planning': {
        improvements.push('For planning problems, check action dependencies and preconditions');
        break;
      }
      case 'verification': {
        improvements.push('For verification, ensure critical properties are satisfied first');
        break;
      }
      default: {
        improvements.push('Consider using local search methods to improve partial solutions');
        break;
      }
    }

    if (solution.method === 'classical') {
      improvements.push('Try quantum approaches like QAOA for better solution space exploration');
    }

    // Specific algorithm suggestions
    if (satisfactionRatio > 0.8 && satisfactionRatio < 1.0) {
      improvements.push('Use local search techniques like WalkSAT to satisfy remaining clauses');
    } else if (satisfactionRatio < 0.5) {
      improvements.push('Consider complete restart with different initialization strategy');
    }
  }
}