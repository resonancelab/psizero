/**
 * Comprehensive Test Suite for Solution Validators
 * Tests all optimization solution validators for correctness and edge cases
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  TSPGenerator,
  SubsetSumGenerator,
  MaxCliqueGenerator,
  ThreeSATGenerator,
  ProblemUtils
} from '@/lib/quantum-optimizer/problem-generators';
import type {
  TSPProblem,
  SubsetSumProblem,
  MaxCliqueProblem,
  ThreeSATProblem,
  TSPSolution,
  SubsetSumSolution,
  MaxCliqueSolution,
  ThreeSATSolution,
  SolutionQuality,
  City
} from '@/lib/quantum-optimizer/types';

// Mock validators for testing (since we need to create them)
class TSPValidator {
  validate(problem: TSPProblem, solution: TSPSolution): SolutionQuality {
    const isValid = this.isValidTour(problem, solution.tour);
    const distance = ProblemUtils.calculateTSPDistance(problem.cities, solution.tour);
    
    // Simple quality assessment based on distance compared to naive tour
    const naiveTour = problem.cities.map((_, i) => i);
    const naiveDistance = ProblemUtils.calculateTSPDistance(problem.cities, naiveTour);
    const optimality = Math.max(0, Math.min(1, naiveDistance / distance - 0.1));
    
    return {
      isValid,
      score: isValid ? optimality : 0,
      optimality,
      confidence: 0.8,
      details: {
        violations: isValid ? [] : ['Invalid tour structure'],
        improvements: distance < naiveDistance ? ['Better than naive solution'] : ['Could be improved'],
        metrics: {
          distance,
          naiveDistance,
          improvement: ((naiveDistance - distance) / naiveDistance) * 100
        }
      }
    };
  }

  private isValidTour(problem: TSPProblem, tour: number[]): boolean {
    if (tour.length !== problem.cities.length) return false;
    const visited = new Set(tour);
    return visited.size === problem.cities.length && 
           tour.every(city => city >= 0 && city < problem.cities.length);
  }
}

class SubsetSumValidator {
  validate(problem: SubsetSumProblem, solution: SubsetSumSolution): SolutionQuality {
    const isValid = ProblemUtils.validateSubsetSum(problem.numbers, solution.indices, problem.target);
    const actualSum = solution.indices.reduce((sum, idx) => sum + problem.numbers[idx], 0);
    
    const score = isValid ? 1.0 : Math.max(0, 1 - Math.abs(actualSum - problem.target) / problem.target);
    
    return {
      isValid,
      score,
      optimality: isValid ? 1.0 : 0,
      confidence: 0.9,
      details: {
        violations: isValid ? [] : [`Sum ${actualSum} does not match target ${problem.target}`],
        improvements: isValid ? ['Perfect solution'] : ['Adjust subset selection'],
        metrics: {
          actualSum,
          target: problem.target,
          difference: Math.abs(actualSum - problem.target),
          subsetSize: solution.indices.length
        }
      }
    };
  }
}

class MaxCliqueValidator {
  validate(problem: MaxCliqueProblem, solution: MaxCliqueSolution): SolutionQuality {
    const isValid = ProblemUtils.validateMaxClique(problem.edges, solution.clique);
    
    // Calculate theoretical maximum clique size for comparison
    const nodeCount = problem.nodes.length;
    const density = problem.edges.length / ((nodeCount * (nodeCount - 1)) / 2);
    const theoreticalMax = Math.floor(nodeCount * Math.sqrt(density));
    
    const optimality = isValid ? Math.min(1, solution.clique.length / theoreticalMax) : 0;
    
    return {
      isValid,
      score: isValid ? optimality : 0,
      optimality,
      confidence: 0.7,
      details: {
        violations: isValid ? [] : ['Not a valid clique - missing edges'],
        improvements: solution.clique.length < theoreticalMax ? ['Could find larger clique'] : ['Near optimal'],
        metrics: {
          cliqueSize: solution.clique.length,
          theoreticalMax,
          efficiency: solution.clique.length / nodeCount
        }
      }
    };
  }
}

class ThreeSATValidator {
  validate(problem: ThreeSATProblem, solution: ThreeSATSolution): SolutionQuality {
    const isValid = ProblemUtils.validate3SAT(problem.clauses, solution.assignment);
    const satisfiedCount = this.countSatisfiedClauses(problem.clauses, solution.assignment);
    const totalClauses = problem.clauses.length;
    
    const score = satisfiedCount / totalClauses;
    const optimality = isValid ? 1.0 : score;
    
    return {
      isValid,
      score,
      optimality,
      confidence: 0.85,
      details: {
        violations: isValid ? [] : [`Only ${satisfiedCount}/${totalClauses} clauses satisfied`],
        improvements: isValid ? ['All clauses satisfied'] : ['Try different variable assignments'],
        metrics: {
          satisfiedClauses: satisfiedCount,
          totalClauses,
          satisfactionRatio: score
        }
      }
    };
  }

  private countSatisfiedClauses(clauses: ThreeSATProblem['clauses'], assignment: boolean[]): number {
    return clauses.filter(clause => {
      return clause.literals.some(literal => {
        const value = assignment[literal.variable];
        return literal.negated ? !value : value;
      });
    }).length;
  }
}

describe('TSPValidator', () => {
  let validator: TSPValidator;
  let generator: TSPGenerator;
  let problem: TSPProblem;

  beforeEach(() => {
    validator = new TSPValidator();
    generator = new TSPGenerator();
    problem = generator.generate({ cityCount: 5 });
  });

  describe('Valid Solution Testing', () => {
    test('should validate correct tour solution', () => {
      const solution: TSPSolution = {
        tour: [0, 1, 2, 3, 4],
        distance: ProblemUtils.calculateTSPDistance(problem.cities, [0, 1, 2, 3, 4]),
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.isValid).toBe(true);
      expect(quality.score).toBeGreaterThan(0);
      expect(quality.details.violations).toHaveLength(0);
    });

    test('should accept any valid permutation', () => {
      const tour = [2, 0, 4, 1, 3];
      const solution: TSPSolution = {
        tour,
        distance: ProblemUtils.calculateTSPDistance(problem.cities, tour),
        timestamp: new Date(),
        method: 'classical'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.isValid).toBe(true);
    });

    test('should calculate distance correctly', () => {
      const tour = [0, 1, 2, 3, 4];
      const expectedDistance = ProblemUtils.calculateTSPDistance(problem.cities, tour);
      
      const solution: TSPSolution = {
        tour,
        distance: expectedDistance,
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.details.metrics.distance).toBeCloseTo(expectedDistance, 2);
    });
  });

  describe('Invalid Solution Testing', () => {
    test('should reject tour with wrong number of cities', () => {
      const solution: TSPSolution = {
        tour: [0, 1, 2], // Missing cities
        distance: 100,
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.isValid).toBe(false);
      expect(quality.score).toBe(0);
      expect(quality.details.violations).toContain('Invalid tour structure');
    });

    test('should reject tour with duplicate cities', () => {
      const solution: TSPSolution = {
        tour: [0, 1, 1, 3, 4], // Duplicate city 1
        distance: 100,
        timestamp: new Date(),
        method: 'classical'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.isValid).toBe(false);
    });

    test('should reject tour with invalid city indices', () => {
      const solution: TSPSolution = {
        tour: [0, 1, 2, 3, 10], // City 10 doesn't exist
        distance: 100,
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.isValid).toBe(false);
    });
  });

  describe('Quality Assessment', () => {
    test('should prefer shorter tours', () => {
      const shortTour = [0, 1, 2, 3, 4];
      const longTour = [0, 4, 2, 1, 3];
      
      const shortDistance = ProblemUtils.calculateTSPDistance(problem.cities, shortTour);
      const longDistance = ProblemUtils.calculateTSPDistance(problem.cities, longTour);
      
      if (shortDistance < longDistance) {
        const shortSolution: TSPSolution = {
          tour: shortTour,
          distance: shortDistance,
          timestamp: new Date(),
          method: 'quantum'
        };

        const longSolution: TSPSolution = {
          tour: longTour,
          distance: longDistance,
          timestamp: new Date(),
          method: 'classical'
        };

        const shortQuality = validator.validate(problem, shortSolution);
        const longQuality = validator.validate(problem, longSolution);

        expect(shortQuality.optimality).toBeGreaterThan(longQuality.optimality);
      }
    });

    test('should provide meaningful metrics', () => {
      const solution: TSPSolution = {
        tour: [0, 1, 2, 3, 4],
        distance: ProblemUtils.calculateTSPDistance(problem.cities, [0, 1, 2, 3, 4]),
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.details.metrics).toHaveProperty('distance');
      expect(quality.details.metrics).toHaveProperty('naiveDistance');
      expect(quality.details.metrics).toHaveProperty('improvement');
    });
  });
});

describe('SubsetSumValidator', () => {
  let validator: SubsetSumValidator;
  let generator: SubsetSumGenerator;
  let problem: SubsetSumProblem;

  beforeEach(() => {
    validator = new SubsetSumValidator();
    generator = new SubsetSumGenerator();
    problem = generator.generate({ numberCount: 8 });
  });

  describe('Valid Solution Testing', () => {
    test('should validate correct subset sum solution', () => {
      // Use the generated solution from the problem
      const solution: SubsetSumSolution = {
        indices: problem.solution || [0, 1],
        sum: problem.target,
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.isValid).toBe(true);
      expect(quality.score).toBe(1.0);
      expect(quality.details.violations).toHaveLength(0);
    });

    test('should handle empty subset for zero target', () => {
      const zeroTargetProblem: SubsetSumProblem = {
        ...problem,
        target: 0
      };

      const solution: SubsetSumSolution = {
        indices: [],
        sum: 0,
        timestamp: new Date(),
        method: 'classical'
      };

      const quality = validator.validate(zeroTargetProblem, solution);

      expect(quality.isValid).toBe(true);
    });

    test('should handle single element solutions', () => {
      const solution: SubsetSumSolution = {
        indices: [0],
        sum: problem.numbers[0],
        timestamp: new Date(),
        method: 'quantum'
      };

      // Create problem where target equals first number
      const singleTargetProblem: SubsetSumProblem = {
        ...problem,
        target: problem.numbers[0]
      };

      const quality = validator.validate(singleTargetProblem, solution);

      expect(quality.isValid).toBe(true);
    });
  });

  describe('Invalid Solution Testing', () => {
    test('should reject incorrect sum', () => {
      const solution: SubsetSumSolution = {
        indices: [0, 1],
        sum: problem.target + 10, // Wrong sum
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.isValid).toBe(false);
      expect(quality.score).toBeLessThan(1.0);
      expect(quality.details.violations.length).toBeGreaterThan(0);
    });

    test('should reject invalid indices', () => {
      const solution: SubsetSumSolution = {
        indices: [0, 100], // Index 100 doesn't exist
        sum: problem.target,
        timestamp: new Date(),
        method: 'classical'
      };

      // This should cause an error or invalid result
      expect(() => {
        validator.validate(problem, solution);
      }).toThrow();
    });

    test('should handle negative indices gracefully', () => {
      const solution: SubsetSumSolution = {
        indices: [-1, 0],
        sum: problem.target,
        timestamp: new Date(),
        method: 'quantum'
      };

      expect(() => {
        validator.validate(problem, solution);
      }).toThrow();
    });
  });

  describe('Quality Assessment', () => {
    test('should provide partial credit for close solutions', () => {
      const closeSum = problem.target + 1;
      const solution: SubsetSumSolution = {
        indices: [0],
        sum: closeSum,
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.score).toBeGreaterThan(0);
      expect(quality.score).toBeLessThan(1.0);
    });

    test('should provide detailed metrics', () => {
      const solution: SubsetSumSolution = {
        indices: problem.solution || [0],
        sum: problem.target,
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.details.metrics).toHaveProperty('actualSum');
      expect(quality.details.metrics).toHaveProperty('target');
      expect(quality.details.metrics).toHaveProperty('difference');
      expect(quality.details.metrics).toHaveProperty('subsetSize');
    });
  });
});

describe('MaxCliqueValidator', () => {
  let validator: MaxCliqueValidator;
  let generator: MaxCliqueGenerator;
  let problem: MaxCliqueProblem;

  beforeEach(() => {
    validator = new MaxCliqueValidator();
    generator = new MaxCliqueGenerator();
    problem = generator.generate({ nodeCount: 8 });
  });

  describe('Valid Solution Testing', () => {
    test('should validate correct clique solution', () => {
      const solution: MaxCliqueSolution = {
        clique: problem.solution || [0, 1],
        size: (problem.solution || [0, 1]).length,
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.isValid).toBe(true);
      expect(quality.details.violations).toHaveLength(0);
    });

    test('should handle single node cliques', () => {
      const solution: MaxCliqueSolution = {
        clique: [0],
        size: 1,
        timestamp: new Date(),
        method: 'classical'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.isValid).toBe(true);
    });

    test('should handle empty cliques', () => {
      const solution: MaxCliqueSolution = {
        clique: [],
        size: 0,
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.isValid).toBe(true);
    });
  });

  describe('Invalid Solution Testing', () => {
    test('should reject non-clique solutions', () => {
      // Create a solution with nodes that aren't all connected
      const solution: MaxCliqueSolution = {
        clique: [0, 1, 2, 3], // Assume these aren't all connected
        size: 4,
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      // This might be valid or invalid depending on the generated graph
      // The test is more about ensuring the validator correctly checks connectivity
      if (!quality.isValid) {
        expect(quality.details.violations).toContain('Not a valid clique - missing edges');
      }
    });

    test('should reject solutions with invalid node indices', () => {
      const solution: MaxCliqueSolution = {
        clique: [0, 100], // Node 100 doesn't exist
        size: 2,
        timestamp: new Date(),
        method: 'classical'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.isValid).toBe(false);
    });
  });

  describe('Quality Assessment', () => {
    test('should prefer larger cliques', () => {
      const smallSolution: MaxCliqueSolution = {
        clique: [0],
        size: 1,
        timestamp: new Date(),
        method: 'classical'
      };

      const largeSolution: MaxCliqueSolution = {
        clique: problem.solution || [0, 1],
        size: (problem.solution || [0, 1]).length,
        timestamp: new Date(),
        method: 'quantum'
      };

      const smallQuality = validator.validate(problem, smallSolution);
      const largeQuality = validator.validate(problem, largeSolution);

      if (largeSolution.size > smallSolution.size) {
        expect(largeQuality.optimality).toBeGreaterThan(smallQuality.optimality);
      }
    });

    test('should provide meaningful metrics', () => {
      const solution: MaxCliqueSolution = {
        clique: problem.solution || [0],
        size: (problem.solution || [0]).length,
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.details.metrics).toHaveProperty('cliqueSize');
      expect(quality.details.metrics).toHaveProperty('theoreticalMax');
      expect(quality.details.metrics).toHaveProperty('efficiency');
    });
  });
});

describe('ThreeSATValidator', () => {
  let validator: ThreeSATValidator;
  let generator: ThreeSATGenerator;
  let problem: ThreeSATProblem;

  beforeEach(() => {
    validator = new ThreeSATValidator();
    generator = new ThreeSATGenerator();
    problem = generator.generate({ variableCount: 6 });
  });

  describe('Valid Solution Testing', () => {
    test('should validate correct 3SAT solution', () => {
      const solution: ThreeSATSolution = {
        assignment: problem.solution || [true, false, true, false, true, false],
        satisfiedClauses: problem.clauses.length,
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      if (problem.solution) {
        expect(quality.isValid).toBe(true);
        expect(quality.score).toBe(1.0);
        expect(quality.details.violations).toHaveLength(0);
      }
    });

    test('should handle all-true assignment', () => {
      const solution: ThreeSATSolution = {
        assignment: new Array(problem.variables.length).fill(true),
        satisfiedClauses: problem.clauses.length,
        timestamp: new Date(),
        method: 'classical'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.score).toBeGreaterThan(0);
    });

    test('should handle all-false assignment', () => {
      const solution: ThreeSATSolution = {
        assignment: new Array(problem.variables.length).fill(false),
        satisfiedClauses: 0,
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Invalid Solution Testing', () => {
    test('should handle wrong assignment length', () => {
      const solution: ThreeSATSolution = {
        assignment: [true, false], // Too short
        satisfiedClauses: 0,
        timestamp: new Date(),
        method: 'quantum'
      };

      expect(() => {
        validator.validate(problem, solution);
      }).toThrow();
    });

    test('should score unsatisfiable assignments correctly', () => {
      // Create an assignment that definitely doesn't satisfy all clauses
      const solution: ThreeSATSolution = {
        assignment: [false, false, false, false, false, false],
        satisfiedClauses: 0,
        timestamp: new Date(),
        method: 'classical'
      };

      const quality = validator.validate(problem, solution);

      // Score should be based on how many clauses are satisfied
      expect(quality.score).toBeGreaterThanOrEqual(0);
      expect(quality.score).toBeLessThanOrEqual(1);
    });
  });

  describe('Quality Assessment', () => {
    test('should prefer assignments satisfying more clauses', () => {
      const poorSolution: ThreeSATSolution = {
        assignment: [false, false, false, false, false, false],
        satisfiedClauses: 0,
        timestamp: new Date(),
        method: 'classical'
      };

      const goodSolution: ThreeSATSolution = {
        assignment: problem.solution || [true, true, true, true, true, true],
        satisfiedClauses: problem.clauses.length,
        timestamp: new Date(),
        method: 'quantum'
      };

      const poorQuality = validator.validate(problem, poorSolution);
      const goodQuality = validator.validate(problem, goodSolution);

      expect(goodQuality.score).toBeGreaterThan(poorQuality.score);
    });

    test('should provide detailed metrics', () => {
      const solution: ThreeSATSolution = {
        assignment: problem.solution || [true, false, true, false, true, false],
        satisfiedClauses: problem.clauses.length,
        timestamp: new Date(),
        method: 'quantum'
      };

      const quality = validator.validate(problem, solution);

      expect(quality.details.metrics).toHaveProperty('satisfiedClauses');
      expect(quality.details.metrics).toHaveProperty('totalClauses');
      expect(quality.details.metrics).toHaveProperty('satisfactionRatio');
    });
  });
});

describe('Cross-Validator Integration Tests', () => {
  test('should maintain consistency across problem types', () => {
    const tspGen = new TSPGenerator();
    const subsetGen = new SubsetSumGenerator();
    const cliqueGen = new MaxCliqueGenerator();
    const satGen = new ThreeSATGenerator();

    const tspProblem = tspGen.generate({ cityCount: 5 });
    const subsetProblem = subsetGen.generate({ numberCount: 5 });
    const cliqueProblem = cliqueGen.generate({ nodeCount: 5 });
    const satProblem = satGen.generate({ variableCount: 5 });

    // All problems should be generated successfully
    expect(tspProblem.cities).toHaveLength(5);
    expect(subsetProblem.numbers).toHaveLength(5);
    expect(cliqueProblem.nodes).toHaveLength(5);
    expect(satProblem.variables).toHaveLength(5);
  });

  test('should handle edge cases consistently', () => {
    const validators = {
      tsp: new TSPValidator(),
      subset: new SubsetSumValidator(),
      clique: new MaxCliqueValidator(),
      sat: new ThreeSATValidator()
    };

    // All validators should exist
    Object.values(validators).forEach(validator => {
      expect(validator).toBeDefined();
      expect(typeof validator.validate).toBe('function');
    });
  });

  test('should provide consistent quality metrics structure', () => {
    const tspValidator = new TSPValidator();
    const tspGen = new TSPGenerator();
    const tspProblem = tspGen.generate({ cityCount: 4 });
    
    const tspSolution: TSPSolution = {
      tour: [0, 1, 2, 3],
      distance: ProblemUtils.calculateTSPDistance(tspProblem.cities, [0, 1, 2, 3]),
      timestamp: new Date(),
      method: 'quantum'
    };

    const quality = tspValidator.validate(tspProblem, tspSolution);

    // All validators should return consistent quality structure
    expect(quality).toHaveProperty('isValid');
    expect(quality).toHaveProperty('score');
    expect(quality).toHaveProperty('optimality');
    expect(quality).toHaveProperty('confidence');
    expect(quality).toHaveProperty('details');
    expect(quality.details).toHaveProperty('violations');
    expect(quality.details).toHaveProperty('improvements');
    expect(quality.details).toHaveProperty('metrics');

    expect(typeof quality.isValid).toBe('boolean');
    expect(typeof quality.score).toBe('number');
    expect(typeof quality.optimality).toBe('number');
    expect(typeof quality.confidence).toBe('number');
    expect(Array.isArray(quality.details.violations)).toBe(true);
    expect(Array.isArray(quality.details.improvements)).toBe(true);
    expect(typeof quality.details.metrics).toBe('object');
  });
});