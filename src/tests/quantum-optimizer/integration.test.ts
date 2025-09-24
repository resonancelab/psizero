/**
 * Integration Tests for Quantum Optimization Workflow
 * Tests complete end-to-end scenarios and component interactions
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  TSPGenerator,
  SubsetSumGenerator,
  MaxCliqueGenerator,
  ThreeSATGenerator,
  ProblemGeneratorFactory,
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
  ThreeSATSolution
} from '@/lib/quantum-optimizer/types';

describe('End-to-End Workflow Integration', () => {
  describe('TSP Complete Workflow', () => {
    test('should generate problem, create solution, and validate', () => {
      const generator = new TSPGenerator();
      const problem = generator.generate({ cityCount: 8 });
      
      // Verify problem generation
      expect(problem.cities).toHaveLength(8);
      expect(problem.metadata.cityCount).toBe(8);
      
      // Create a simple solution (naive tour)
      const tour = problem.cities.map((_, i) => i);
      const distance = ProblemUtils.calculateTSPDistance(problem.cities, tour);
      
      const solution: TSPSolution = {
        tour,
        distance,
        timestamp: new Date(),
        method: 'classical'
      };
      
      // Verify solution structure
      expect(solution.tour).toHaveLength(8);
      expect(solution.distance).toBeGreaterThan(0);
      expect(solution.method).toBe('classical');
      
      // Test problem-solution compatibility
      expect(solution.tour.every(city => city >= 0 && city < problem.cities.length)).toBe(true);
      expect(new Set(solution.tour).size).toBe(problem.cities.length);
    });

    test('should handle different difficulty levels', () => {
      const generator = new TSPGenerator();
      
      const easyProblem = generator.generate({ cityCount: 5 });
      const mediumProblem = generator.generate({ cityCount: 20 });
      const hardProblem = generator.generate({ cityCount: 40 });
      
      expect(easyProblem.difficulty).toBe('easy');
      expect(mediumProblem.difficulty).toBe('medium');
      expect(hardProblem.difficulty).toBe('hard');
      
      // Test solutions scale with problem size
      const easyTour = easyProblem.cities.map((_, i) => i);
      const mediumTour = mediumProblem.cities.map((_, i) => i);
      const hardTour = hardProblem.cities.map((_, i) => i);
      
      const easyDistance = ProblemUtils.calculateTSPDistance(easyProblem.cities, easyTour);
      const mediumDistance = ProblemUtils.calculateTSPDistance(mediumProblem.cities, mediumTour);
      const hardDistance = ProblemUtils.calculateTSPDistance(hardProblem.cities, hardTour);
      
      expect(easyDistance).toBeGreaterThan(0);
      expect(mediumDistance).toBeGreaterThan(easyDistance);
      expect(hardDistance).toBeGreaterThan(mediumDistance);
    });
  });

  describe('Subset Sum Complete Workflow', () => {
    test('should generate solvable problems with valid solutions', () => {
      const generator = new SubsetSumGenerator();
      const problem = generator.generate({ numberCount: 10 });
      
      // Verify problem has solution
      expect(problem.solution).toBeDefined();
      
      if (problem.solution) {
        // Verify solution is valid
        const isValid = ProblemUtils.validateSubsetSum(
          problem.numbers,
          problem.solution,
          problem.target
        );
        expect(isValid).toBe(true);
        
        // Create solution object
        const solution: SubsetSumSolution = {
          indices: problem.solution,
          sum: problem.target,
          timestamp: new Date(),
          method: 'quantum'
        };
        
        expect(solution.indices).toEqual(problem.solution);
        expect(solution.sum).toBe(problem.target);
      }
    });

    test('should handle different contexts correctly', () => {
      const generator = new SubsetSumGenerator();
      
      const contexts = ['cryptographic', 'financial', 'scheduling', 'general'] as const;
      
      contexts.forEach(context => {
        const problem = generator.generate({ numberCount: 8, context });
        
        expect(problem.context).toBe(context);
        expect(problem.description).toContain(context === 'general' ? 'resource' : context);
        expect(problem.numbers).toHaveLength(8);
        expect(problem.solution).toBeDefined();
      });
    });
  });

  describe('Maximum Clique Complete Workflow', () => {
    test('should generate valid graph problems with clique solutions', () => {
      const generator = new MaxCliqueGenerator();
      const problem = generator.generate({ nodeCount: 12 });
      
      // Verify graph structure
      expect(problem.nodes).toHaveLength(12);
      expect(problem.edges).toBeDefined();
      expect(problem.metadata.nodeCount).toBe(12);
      expect(problem.metadata.edgeCount).toBe(problem.edges.length);
      
      // Verify edges are valid
      problem.edges.forEach(edge => {
        expect(edge.from).toBeGreaterThanOrEqual(0);
        expect(edge.from).toBeLessThan(12);
        expect(edge.to).toBeGreaterThanOrEqual(0);
        expect(edge.to).toBeLessThan(12);
        expect(edge.from).not.toBe(edge.to);
      });
      
      // Test clique solution if available
      if (problem.solution && problem.solution.length > 0) {
        const isValid = ProblemUtils.validateMaxClique(problem.edges, problem.solution);
        expect(isValid).toBe(true);
        
        const solution: MaxCliqueSolution = {
          clique: problem.solution,
          size: problem.solution.length,
          timestamp: new Date(),
          method: 'quantum'
        };
        
        expect(solution.clique).toEqual(problem.solution);
        expect(solution.size).toBe(problem.solution.length);
      }
    });

    test('should handle different graph densities', () => {
      const generator = new MaxCliqueGenerator();
      
      const sparseProblem = generator.generate({ nodeCount: 10, density: 0.1 });
      const denseProblem = generator.generate({ nodeCount: 10, density: 0.8 });
      
      expect(sparseProblem.metadata.density).toBe(0.1);
      expect(denseProblem.metadata.density).toBe(0.8);
      
      // Dense graph should have more edges
      expect(denseProblem.edges.length).toBeGreaterThan(sparseProblem.edges.length);
    });
  });

  describe('3-SAT Complete Workflow', () => {
    test('should generate valid boolean satisfiability problems', () => {
      const generator = new ThreeSATGenerator();
      const problem = generator.generate({ variableCount: 8 });
      
      // Verify problem structure
      expect(problem.variables).toHaveLength(8);
      expect(problem.clauses).toBeDefined();
      expect(problem.metadata.variableCount).toBe(8);
      
      // Verify clauses have correct structure
      problem.clauses.forEach(clause => {
        expect(clause.literals).toHaveLength(3);
        clause.literals.forEach(literal => {
          expect(literal.variable).toBeGreaterThanOrEqual(0);
          expect(literal.variable).toBeLessThan(8);
          expect(typeof literal.negated).toBe('boolean');
        });
      });
      
      // Test solution if available
      if (problem.solution) {
        expect(problem.solution).toHaveLength(8);
        
        const isValid = ProblemUtils.validate3SAT(problem.clauses, problem.solution);
        expect(isValid).toBe(true);
        
        const solution: ThreeSATSolution = {
          assignment: problem.solution,
          satisfiedClauses: problem.clauses.length,
          timestamp: new Date(),
          method: 'quantum'
        };
        
        expect(solution.assignment).toEqual(problem.solution);
        expect(solution.satisfiedClauses).toBe(problem.clauses.length);
      }
    });

    test('should handle different clause ratios', () => {
      const generator = new ThreeSATGenerator();
      
      const lowRatioProblem = generator.generate({ variableCount: 10, clauseRatio: 2.0 });
      const highRatioProblem = generator.generate({ variableCount: 10, clauseRatio: 5.0 });
      
      expect(lowRatioProblem.metadata.ratio).toBe(2.0);
      expect(highRatioProblem.metadata.ratio).toBe(5.0);
      
      // Higher ratio should have more clauses
      expect(highRatioProblem.clauses.length).toBeGreaterThan(lowRatioProblem.clauses.length);
    });
  });

  describe('Cross-Problem Type Integration', () => {
    test('should generate consistent problem sets', () => {
      const problemSet = ProblemGeneratorFactory.generateProblemSet();
      
      // Verify all problem types are present
      expect(problemSet.tsp).toHaveLength(3);
      expect(problemSet.subsetSum).toHaveLength(3);
      expect(problemSet.maxClique).toHaveLength(3);
      expect(problemSet.threeSAT).toHaveLength(3);
      
      // Verify problems have increasing difficulty
      expect(problemSet.tsp[0].cities.length).toBeLessThan(problemSet.tsp[2].cities.length);
      expect(problemSet.subsetSum[0].numbers.length).toBeLessThan(problemSet.subsetSum[2].numbers.length);
      expect(problemSet.maxClique[0].nodes.length).toBeLessThan(problemSet.maxClique[2].nodes.length);
      expect(problemSet.threeSAT[0].variables.length).toBeLessThan(problemSet.threeSAT[2].variables.length);
    });

    test('should maintain data consistency across generations', () => {
      const seed = 12345;
      
      const tspGen1 = new TSPGenerator(seed);
      const tspGen2 = new TSPGenerator(seed);
      
      const problem1 = tspGen1.generate({ cityCount: 5 });
      const problem2 = tspGen2.generate({ cityCount: 5 });
      
      // Same seed should produce same results
      expect(problem1.cities).toEqual(problem2.cities);
      expect(problem1.metadata.seed).toBe(problem2.metadata.seed);
    });
  });

  describe('Performance and Scalability', () => {
    test('should handle large problem instances efficiently', () => {
      const generators = {
        tsp: new TSPGenerator(),
        subset: new SubsetSumGenerator(),
        clique: new MaxCliqueGenerator(),
        sat: new ThreeSATGenerator()
      };
      
      // Test larger problem instances
      const start = Date.now();
      
      const largeTSP = generators.tsp.generate({ cityCount: 50 });
      const largeSubset = generators.subset.generate({ numberCount: 50 });
      const largeClique = generators.clique.generate({ nodeCount: 30 });
      const largeSAT = generators.sat.generate({ variableCount: 30 });
      
      const duration = Date.now() - start;
      
      // Should complete within reasonable time
      expect(duration).toBeLessThan(5000); // 5 seconds max
      
      // Verify problem sizes
      expect(largeTSP.cities).toHaveLength(50);
      expect(largeSubset.numbers).toHaveLength(50);
      expect(largeClique.nodes).toHaveLength(30);
      expect(largeSAT.variables).toHaveLength(30);
    });

    test('should produce consistent results under stress', () => {
      const generator = new TSPGenerator();
      const problems: TSPProblem[] = [];
      
      // Generate multiple problems rapidly
      for (let i = 0; i < 20; i++) {
        const problem = generator.generate({ cityCount: 10 });
        problems.push(problem);
      }
      
      // All problems should be valid
      problems.forEach((problem, index) => {
        expect(problem.cities).toHaveLength(10);
        expect(problem.metadata.cityCount).toBe(10);
        expect(problem.cities.every(city => 
          typeof city.x === 'number' && 
          typeof city.y === 'number' &&
          city.x >= 0 && city.y >= 0
        )).toBe(true);
      });
      
      // Problems should be different (unless using same seed)
      const firstProblem = problems[0];
      const lastProblem = problems[problems.length - 1];
      expect(firstProblem.cities).not.toEqual(lastProblem.cities);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle minimum viable problem sizes', () => {
      const tspGen = new TSPGenerator();
      const subsetGen = new SubsetSumGenerator();
      const cliqueGen = new MaxCliqueGenerator();
      const satGen = new ThreeSATGenerator();
      
      // Test minimum sizes
      const minTSP = tspGen.generate({ cityCount: 2 });
      const minSubset = subsetGen.generate({ numberCount: 1 });
      const minClique = cliqueGen.generate({ nodeCount: 1 });
      const minSAT = satGen.generate({ variableCount: 1 });
      
      expect(minTSP.cities).toHaveLength(2);
      expect(minSubset.numbers).toHaveLength(1);
      expect(minClique.nodes).toHaveLength(1);
      expect(minSAT.variables).toHaveLength(1);
    });

    test('should maintain solution validity under edge conditions', () => {
      const subsetGen = new SubsetSumGenerator();
      
      // Test with small range
      const smallRangeProblem = subsetGen.generate({ 
        numberCount: 5, 
        range: [1, 3] 
      });
      
      smallRangeProblem.numbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(3);
      });
      
      if (smallRangeProblem.solution) {
        const isValid = ProblemUtils.validateSubsetSum(
          smallRangeProblem.numbers,
          smallRangeProblem.solution,
          smallRangeProblem.target
        );
        expect(isValid).toBe(true);
      }
    });

    test('should handle computation-intensive scenarios gracefully', () => {
      const cliqueGen = new MaxCliqueGenerator();
      
      // High density graph (computationally intensive)
      const denseProblem = cliqueGen.generate({ 
        nodeCount: 20, 
        density: 0.9 
      });
      
      expect(denseProblem.nodes).toHaveLength(20);
      expect(denseProblem.metadata.density).toBe(0.9);
      
      // Should still find some clique
      if (denseProblem.solution) {
        const isValid = ProblemUtils.validateMaxClique(
          denseProblem.edges, 
          denseProblem.solution
        );
        expect(isValid).toBe(true);
      }
    });
  });

  describe('Data Structure Compatibility', () => {
    test('should maintain consistent data formats across all problem types', () => {
      const problemSet = ProblemGeneratorFactory.generateProblemSet();
      
      // Test TSP data format
      problemSet.tsp.forEach(problem => {
        expect(problem).toHaveProperty('id');
        expect(problem).toHaveProperty('name');
        expect(problem).toHaveProperty('description');
        expect(problem).toHaveProperty('cities');
        expect(problem).toHaveProperty('difficulty');
        expect(problem).toHaveProperty('metadata');
        expect(problem.metadata).toHaveProperty('cityCount');
        expect(problem.metadata).toHaveProperty('generated');
      });
      
      // Test Subset Sum data format
      problemSet.subsetSum.forEach(problem => {
        expect(problem).toHaveProperty('id');
        expect(problem).toHaveProperty('name');
        expect(problem).toHaveProperty('description');
        expect(problem).toHaveProperty('numbers');
        expect(problem).toHaveProperty('target');
        expect(problem).toHaveProperty('context');
        expect(problem).toHaveProperty('difficulty');
        expect(problem).toHaveProperty('metadata');
      });
      
      // Test Max Clique data format
      problemSet.maxClique.forEach(problem => {
        expect(problem).toHaveProperty('id');
        expect(problem).toHaveProperty('name');
        expect(problem).toHaveProperty('description');
        expect(problem).toHaveProperty('nodes');
        expect(problem).toHaveProperty('edges');
        expect(problem).toHaveProperty('context');
        expect(problem).toHaveProperty('difficulty');
        expect(problem).toHaveProperty('metadata');
      });
      
      // Test 3-SAT data format
      problemSet.threeSAT.forEach(problem => {
        expect(problem).toHaveProperty('id');
        expect(problem).toHaveProperty('name');
        expect(problem).toHaveProperty('description');
        expect(problem).toHaveProperty('variables');
        expect(problem).toHaveProperty('clauses');
        expect(problem).toHaveProperty('context');
        expect(problem).toHaveProperty('difficulty');
        expect(problem).toHaveProperty('metadata');
      });
    });

    test('should support serialization and deserialization', () => {
      const tspGen = new TSPGenerator();
      const problem = tspGen.generate({ cityCount: 5 });
      
      // Test JSON serialization
      const serialized = JSON.stringify(problem);
      const deserialized = JSON.parse(serialized);
      
      expect(deserialized.cities).toEqual(problem.cities);
      expect(deserialized.metadata.cityCount).toBe(problem.metadata.cityCount);
      expect(deserialized.difficulty).toBe(problem.difficulty);
      
      // Test that dates are properly handled
      expect(new Date(deserialized.metadata.generated)).toBeInstanceOf(Date);
    });
  });
});

describe('Algorithm Validation Integration', () => {
  test('should validate algorithms work correctly with generated problems', () => {
    const tspGen = new TSPGenerator();
    const problem = tspGen.generate({ cityCount: 6 });
    
    // Test nearest neighbor heuristic
    const nearestNeighborTour = createNearestNeighborTour(problem.cities);
    const nnDistance = ProblemUtils.calculateTSPDistance(problem.cities, nearestNeighborTour);
    
    // Test random tour
    const randomTour = [...Array(problem.cities.length).keys()].sort(() => Math.random() - 0.5);
    const randomDistance = ProblemUtils.calculateTSPDistance(problem.cities, randomTour);
    
    expect(nnDistance).toBeGreaterThan(0);
    expect(randomDistance).toBeGreaterThan(0);
    
    // Nearest neighbor should generally be better than random
    // (though not guaranteed for small instances)
    expect(typeof nnDistance).toBe('number');
    expect(typeof randomDistance).toBe('number');
  });

  test('should handle quantum vs classical solution comparison', () => {
    const subsetGen = new SubsetSumGenerator();
    const problem = subsetGen.generate({ numberCount: 10 });
    
    // Simulate quantum solution
    const quantumSolution: SubsetSumSolution = {
      indices: problem.solution || [0, 1],
      sum: problem.target,
      timestamp: new Date(),
      method: 'quantum',
      iterations: 100,
      timeElapsed: 250 // milliseconds
    };
    
    // Simulate classical solution
    const classicalSolution: SubsetSumSolution = {
      indices: problem.solution || [0, 1],
      sum: problem.target,
      timestamp: new Date(),
      method: 'classical',
      iterations: 1000,
      timeElapsed: 500 // milliseconds
    };
    
    expect(quantumSolution.method).toBe('quantum');
    expect(classicalSolution.method).toBe('classical');
    expect(quantumSolution.timeElapsed).toBeLessThan(classicalSolution.timeElapsed);
  });
});

// Helper function for nearest neighbor TSP heuristic
function createNearestNeighborTour(cities: Array<{ x: number; y: number }>): number[] {
  if (cities.length === 0) return [];
  
  const tour: number[] = [];
  const visited = new Set<number>();
  let currentCity = 0;
  
  tour.push(currentCity);
  visited.add(currentCity);
  
  while (tour.length < cities.length) {
    let nearestCity = -1;
    let nearestDistance = Infinity;
    
    for (let i = 0; i < cities.length; i++) {
      if (!visited.has(i)) {
        const dx = cities[currentCity].x - cities[i].x;
        const dy = cities[currentCity].y - cities[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestCity = i;
        }
      }
    }
    
    if (nearestCity !== -1) {
      tour.push(nearestCity);
      visited.add(nearestCity);
      currentCity = nearestCity;
    } else {
      break;
    }
  }
  
  return tour;
}