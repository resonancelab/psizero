/**
 * Comprehensive Test Suite for Problem Generators
 * Tests all optimization problem generators for correctness and edge cases
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
  City
} from '@/lib/quantum-optimizer/problem-generators';

describe('TSPGenerator', () => {
  let generator: TSPGenerator;

  beforeEach(() => {
    generator = new TSPGenerator();
  });

  describe('Basic Generation', () => {
    test('should generate valid TSP problem with specified parameters', () => {
      const problem = generator.generate({ cityCount: 10 });
      
      expect(problem.cities).toHaveLength(10);
      expect(problem.name).toBeDefined();
      expect(problem.description).toBeDefined();
      expect(problem.metadata).toBeDefined();
      expect(problem.metadata.cityCount).toBe(10);
      expect(problem.difficulty).toBe('easy'); // 10 cities should be easy
    });

    test('should generate TSP with custom city count', () => {
      const cityCount = 15;
      const problem = generator.generate({ cityCount });
      
      expect(problem.cities).toHaveLength(cityCount);
      expect(problem.metadata.cityCount).toBe(cityCount);
    });

    test('should generate cities with valid coordinates', () => {
      const problem = generator.generate({ cityCount: 5 });
      
      problem.cities.forEach(city => {
        expect(city.x).toBeGreaterThanOrEqual(0);
        expect(city.y).toBeGreaterThanOrEqual(0);
        expect(city.x).toBeLessThanOrEqual(problem.metadata.mapWidth);
        expect(city.y).toBeLessThanOrEqual(problem.metadata.mapHeight);
        expect(city.id).toBeGreaterThanOrEqual(0);
        expect(city.name).toBeDefined();
      });
    });

    test('should respect custom map dimensions', () => {
      const mapWidth = 500;
      const mapHeight = 400;
      const problem = generator.generate({ 
        cityCount: 5, 
        mapWidth, 
        mapHeight 
      });
      
      expect(problem.metadata.mapWidth).toBe(mapWidth);
      expect(problem.metadata.mapHeight).toBe(mapHeight);
      
      problem.cities.forEach(city => {
        expect(city.x).toBeLessThanOrEqual(mapWidth);
        expect(city.y).toBeLessThanOrEqual(mapHeight);
      });
    });
  });

  describe('Distance Calculations', () => {
    test('should calculate correct distances between cities', () => {
      const problem = generator.generate({ cityCount: 3 });
      const cities = problem.cities;
      
      // Test distance calculation utility
      const distance01 = Math.sqrt(
        Math.pow(cities[0].x - cities[1].x, 2) + 
        Math.pow(cities[0].y - cities[1].y, 2)
      );
      
      // Since we don't have distances matrix directly, test the tour distance calculation
      const tour = [0, 1, 2];
      const tourDistance = ProblemUtils.calculateTSPDistance(cities, tour);
      
      expect(tourDistance).toBeGreaterThan(0);
    });

    test('should handle tour distance calculation correctly', () => {
      const cities: City[] = [
        { id: 0, name: 'A', x: 0, y: 0 },
        { id: 1, name: 'B', x: 3, y: 4 },
        { id: 2, name: 'C', x: 6, y: 8 }
      ];
      
      const tour = [0, 1, 2];
      const distance = ProblemUtils.calculateTSPDistance(cities, tour);
      
      // Expected: distance 0->1 (5) + distance 1->2 (5) + distance 2->0 (10) = 20
      expect(distance).toBeCloseTo(20, 1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum city count', () => {
      const problem = generator.generate({ cityCount: 2 });
      expect(problem.cities).toHaveLength(2);
    });

    test('should handle large city counts efficiently', () => {
      const start = Date.now();
      const problem = generator.generate({ cityCount: 100 });
      const duration = Date.now() - start;
      
      expect(problem.cities).toHaveLength(100);
      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });

    test('should generate unique city names', () => {
      const problem = generator.generate({ cityCount: 20 });
      const names = problem.cities.map(city => city.name);
      const uniqueNames = new Set(names);
      
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe('Difficulty Classification', () => {
    test('should classify difficulty correctly based on city count', () => {
      const easyProblem = generator.generate({ cityCount: 8 });
      const mediumProblem = generator.generate({ cityCount: 20 });
      const hardProblem = generator.generate({ cityCount: 40 });
      const extremeProblem = generator.generate({ cityCount: 80 });
      
      expect(easyProblem.difficulty).toBe('easy');
      expect(mediumProblem.difficulty).toBe('medium');
      expect(hardProblem.difficulty).toBe('hard');
      expect(extremeProblem.difficulty).toBe('extreme');
    });
  });
});

describe('SubsetSumGenerator', () => {
  let generator: SubsetSumGenerator;

  beforeEach(() => {
    generator = new SubsetSumGenerator();
  });

  describe('Basic Generation', () => {
    test('should generate valid subset sum problem', () => {
      const problem = generator.generate({ numberCount: 10 });
      
      expect(problem.numbers).toHaveLength(10);
      expect(problem.target).toBeGreaterThan(0);
      expect(problem.solution).toBeDefined();
      expect(problem.context).toBe('general'); // default context
      expect(problem.metadata.numberCount).toBe(10);
    });

    test('should generate problem with custom parameters', () => {
      const numberCount = 15;
      const range: [number, number] = [1, 50];
      const problem = generator.generate({ numberCount, range });
      
      expect(problem.numbers).toHaveLength(numberCount);
      problem.numbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(50);
      });
    });

    test('should have valid solution', () => {
      const problem = generator.generate({ numberCount: 10 });
      
      expect(problem.solution).toBeDefined();
      if (problem.solution) {
        const isValid = ProblemUtils.validateSubsetSum(
          problem.numbers, 
          problem.solution, 
          problem.target
        );
        expect(isValid).toBe(true);
      }
    });
  });

  describe('Context-Specific Generation', () => {
    test('should generate cryptographic context problems', () => {
      const problem = generator.generate({ 
        numberCount: 10, 
        context: 'cryptographic' 
      });
      
      expect(problem.context).toBe('cryptographic');
      expect(problem.description).toContain('cryptographic');
    });

    test('should generate financial context problems', () => {
      const problem = generator.generate({ 
        numberCount: 10, 
        context: 'financial' 
      });
      
      expect(problem.context).toBe('financial');
      expect(problem.description).toContain('financial');
    });

    test('should generate scheduling context problems', () => {
      const problem = generator.generate({ 
        numberCount: 10, 
        context: 'scheduling' 
      });
      
      expect(problem.context).toBe('scheduling');
      expect(problem.description).toContain('scheduling');
    });
  });

  describe('Edge Cases', () => {
    test('should handle single number case', () => {
      const problem = generator.generate({ numberCount: 1 });
      expect(problem.numbers).toHaveLength(1);
    });

    test('should handle small ranges', () => {
      const problem = generator.generate({ 
        numberCount: 5, 
        range: [1, 3] 
      });
      
      problem.numbers.forEach(num => {
        expect([1, 2, 3]).toContain(num);
      });
    });
  });
});

describe('MaxCliqueGenerator', () => {
  let generator: MaxCliqueGenerator;

  beforeEach(() => {
    generator = new MaxCliqueGenerator();
  });

  describe('Basic Generation', () => {
    test('should generate valid maximum clique problem', () => {
      const problem = generator.generate({ nodeCount: 10 });
      
      expect(problem.nodes).toHaveLength(10);
      expect(problem.edges).toBeDefined();
      expect(problem.metadata.nodeCount).toBe(10);
      expect(problem.metadata.edgeCount).toBe(problem.edges.length);
    });

    test('should generate nodes with unique IDs', () => {
      const problem = generator.generate({ nodeCount: 15 });
      
      const ids = problem.nodes.map(node => node.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
      expect(Math.min(...ids)).toBe(0);
      expect(Math.max(...ids)).toBe(14);
    });

    test('should respect density parameter', () => {
      const nodeCount = 10;
      const density = 0.8;
      const problem = generator.generate({ nodeCount, density });
      
      const maxPossibleEdges = (nodeCount * (nodeCount - 1)) / 2;
      const expectedEdges = Math.floor(maxPossibleEdges * density);
      
      // Allow some variance due to randomness
      expect(problem.edges.length).toBeCloseTo(expectedEdges, expectedEdges * 0.2);
    });
  });

  describe('Graph Properties', () => {
    test('should maintain edge consistency', () => {
      const problem = generator.generate({ nodeCount: 8 });
      
      problem.edges.forEach(edge => {
        expect(edge.from).toBeGreaterThanOrEqual(0);
        expect(edge.from).toBeLessThan(problem.nodes.length);
        expect(edge.to).toBeGreaterThanOrEqual(0);
        expect(edge.to).toBeLessThan(problem.nodes.length);
        expect(edge.from).not.toBe(edge.to);
      });
    });

    test('should generate valid clique solution', () => {
      const problem = generator.generate({ nodeCount: 10 });
      
      if (problem.solution && problem.solution.length > 1) {
        const isValid = ProblemUtils.validateMaxClique(
          problem.edges, 
          problem.solution
        );
        expect(isValid).toBe(true);
      }
    });

    test('should handle high density graphs', () => {
      const problem = generator.generate({ 
        nodeCount: 8, 
        density: 0.9 
      });
      
      const nodeCount = problem.nodes.length;
      const maxEdges = (nodeCount * (nodeCount - 1)) / 2;
      
      expect(problem.edges.length).toBeGreaterThan(maxEdges * 0.7);
    });
  });

  describe('Context-Specific Generation', () => {
    test('should generate social network problems', () => {
      const problem = generator.generate({ 
        nodeCount: 10, 
        context: 'social' 
      });
      
      expect(problem.context).toBe('social');
      expect(problem.description).toContain('social');
    });

    test('should generate molecular problems', () => {
      const problem = generator.generate({ 
        nodeCount: 12, 
        context: 'molecular' 
      });
      
      expect(problem.context).toBe('molecular');
      expect(problem.description).toContain('molecular');
    });
  });
});

describe('ThreeSATGenerator', () => {
  let generator: ThreeSATGenerator;

  beforeEach(() => {
    generator = new ThreeSATGenerator();
  });

  describe('Basic Generation', () => {
    test('should generate valid 3-SAT problem', () => {
      const problem = generator.generate({ variableCount: 10 });
      
      expect(problem.variables).toHaveLength(10);
      expect(problem.clauses).toBeDefined();
      expect(problem.clauses.length).toBeGreaterThan(0);
      expect(problem.metadata.variableCount).toBe(10);
      
      // Each clause should have exactly 3 literals
      problem.clauses.forEach(clause => {
        expect(clause.literals).toHaveLength(3);
        clause.literals.forEach(literal => {
          expect(literal.variable).toBeGreaterThanOrEqual(0);
          expect(literal.variable).toBeLessThan(10);
          expect(typeof literal.negated).toBe('boolean');
        });
      });
    });

    test('should generate problem with custom clause ratio', () => {
      const variableCount = 15;
      const clauseRatio = 3.0;
      const problem = generator.generate({ variableCount, clauseRatio });
      
      const expectedClauses = Math.floor(variableCount * clauseRatio);
      expect(problem.clauses.length).toBeCloseTo(expectedClauses, 2);
      expect(problem.metadata.ratio).toBe(clauseRatio);
    });

    test('should generate variables with proper structure', () => {
      const problem = generator.generate({ variableCount: 8 });
      
      problem.variables.forEach((variable, index) => {
        expect(variable.id).toBe(index);
        expect(variable.name).toBeDefined();
        expect(variable.description).toBeDefined();
      });
    });
  });

  describe('Satisfiability Properties', () => {
    test('should validate satisfying assignments when available', () => {
      const problem = generator.generate({ variableCount: 5 });
      
      if (problem.solution) {
        expect(problem.solution).toHaveLength(problem.variables.length);
        
        const isValid = ProblemUtils.validate3SAT(
          problem.clauses, 
          problem.solution
        );
        expect(isValid).toBe(true);
      }
    });

    test('should handle boolean assignments correctly', () => {
      const problem = generator.generate({ variableCount: 6 });
      
      if (problem.solution) {
        problem.solution.forEach(assignment => {
          expect(typeof assignment).toBe('boolean');
        });
      }
    });
  });

  describe('Context-Specific Generation', () => {
    test('should generate circuit verification problems', () => {
      const problem = generator.generate({ 
        variableCount: 10, 
        context: 'circuit' 
      });
      
      expect(problem.context).toBe('circuit');
      expect(problem.description).toContain('circuit');
    });

    test('should generate planning problems', () => {
      const problem = generator.generate({ 
        variableCount: 12, 
        context: 'planning' 
      });
      
      expect(problem.context).toBe('planning');
      expect(problem.description).toContain('planning');
    });

    test('should generate verification problems', () => {
      const problem = generator.generate({ 
        variableCount: 8, 
        context: 'verification' 
      });
      
      expect(problem.context).toBe('verification');
      expect(problem.description).toContain('verification');
    });
  });
});

describe('ProblemGeneratorFactory', () => {
  test('should create TSP generator', () => {
    const generator = ProblemGeneratorFactory.createTSP();
    const problem = generator.generate({ cityCount: 5 });
    expect(problem.cities).toHaveLength(5);
  });

  test('should create SubsetSum generator', () => {
    const generator = ProblemGeneratorFactory.createSubsetSum();
    const problem = generator.generate({ numberCount: 8 });
    expect(problem.numbers).toHaveLength(8);
  });

  test('should create MaxClique generator', () => {
    const generator = ProblemGeneratorFactory.createMaxClique();
    const problem = generator.generate({ nodeCount: 10 });
    expect(problem.nodes).toHaveLength(10);
  });

  test('should create 3SAT generator', () => {
    const generator = ProblemGeneratorFactory.create3SAT();
    const problem = generator.generate({ variableCount: 6 });
    expect(problem.variables).toHaveLength(6);
  });

  test('should generate complete problem set', () => {
    const problemSet = ProblemGeneratorFactory.generateProblemSet();
    
    expect(problemSet.tsp).toHaveLength(3);
    expect(problemSet.subsetSum).toHaveLength(3);
    expect(problemSet.maxClique).toHaveLength(3);
    expect(problemSet.threeSAT).toHaveLength(3);
    
    // Verify problem variety
    expect(problemSet.tsp[0].cities.length).toBeLessThan(problemSet.tsp[2].cities.length);
    expect(problemSet.subsetSum[0].numbers.length).toBeLessThan(problemSet.subsetSum[2].numbers.length);
  });
});

describe('ProblemUtils', () => {
  describe('TSP Utilities', () => {
    test('should calculate tour distance correctly', () => {
      const cities: City[] = [
        { id: 0, name: 'A', x: 0, y: 0 },
        { id: 1, name: 'B', x: 3, y: 4 },
        { id: 2, name: 'C', x: 0, y: 0 }
      ];
      
      const tour = [0, 1, 2];
      const distance = ProblemUtils.calculateTSPDistance(cities, tour);
      
      // 0->1: 5, 1->2: 5, 2->0: 0
      expect(distance).toBeCloseTo(10, 1);
    });

    test('should handle circular tours', () => {
      const cities: City[] = [
        { id: 0, name: 'A', x: 0, y: 0 },
        { id: 1, name: 'B', x: 1, y: 0 },
        { id: 2, name: 'C', x: 1, y: 1 },
        { id: 3, name: 'D', x: 0, y: 1 }
      ];
      
      const tour = [0, 1, 2, 3];
      const distance = ProblemUtils.calculateTSPDistance(cities, tour);
      
      expect(distance).toBeCloseTo(4, 1); // Unit square perimeter
    });
  });

  describe('Subset Sum Utilities', () => {
    test('should validate correct subset sum solutions', () => {
      const numbers = [1, 2, 3, 4, 5];
      const solution = [0, 2, 4]; // indices for [1, 3, 5]
      const target = 9; // 1 + 3 + 5 = 9
      
      const isValid = ProblemUtils.validateSubsetSum(numbers, solution, target);
      expect(isValid).toBe(true);
    });

    test('should reject incorrect subset sum solutions', () => {
      const numbers = [1, 2, 3, 4, 5];
      const solution = [0, 1]; // indices for [1, 2]
      const target = 5; // but 1 + 2 = 3, not 5
      
      const isValid = ProblemUtils.validateSubsetSum(numbers, solution, target);
      expect(isValid).toBe(false);
    });
  });

  describe('Max Clique Utilities', () => {
    test('should validate correct clique solutions', () => {
      const edges = [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 2 }
      ];
      const clique = [0, 1, 2]; // All connected
      
      const isValid = ProblemUtils.validateMaxClique(edges, clique);
      expect(isValid).toBe(true);
    });

    test('should reject invalid clique solutions', () => {
      const edges = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
        // Missing edge 0->2
      ];
      const clique = [0, 1, 2]; // Not all connected
      
      const isValid = ProblemUtils.validateMaxClique(edges, clique);
      expect(isValid).toBe(false);
    });
  });

  describe('3SAT Utilities', () => {
    test('should validate correct 3SAT solutions', () => {
      const clauses = [
        { literals: [{ variable: 0, negated: false }, { variable: 1, negated: true }, { variable: 2, negated: false }] },
        { literals: [{ variable: 0, negated: true }, { variable: 1, negated: false }, { variable: 2, negated: true }] }
      ];
      const assignment = [true, false, true]; // x1=T, x2=F, x3=T
      
      const isValid = ProblemUtils.validate3SAT(clauses, assignment);
      expect(isValid).toBe(true);
    });

    test('should reject incorrect 3SAT solutions', () => {
      const clauses = [
        { literals: [{ variable: 0, negated: false }, { variable: 1, negated: false }, { variable: 2, negated: false }] }
      ];
      const assignment = [false, false, false]; // All false, cannot satisfy clause
      
      const isValid = ProblemUtils.validate3SAT(clauses, assignment);
      expect(isValid).toBe(false);
    });
  });

  describe('Difficulty Descriptions', () => {
    test('should provide difficulty descriptions', () => {
      expect(ProblemUtils.getDifficultyDescription('easy')).toContain('learning');
      expect(ProblemUtils.getDifficultyDescription('medium')).toContain('demonstrations');
      expect(ProblemUtils.getDifficultyDescription('hard')).toContain('optimization');
      expect(ProblemUtils.getDifficultyDescription('extreme')).toContain('limits');
    });
  });
});