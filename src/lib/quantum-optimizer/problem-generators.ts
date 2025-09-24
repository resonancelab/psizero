
/**
 * Problem Generation Utilities for Quantum Optimization Demos
 * Generates random instances of NP-Complete problems for testing and visualization
 */

// Seeded random number generator for reproducible results
class SeededRandom {
  public seed: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed;
  }

  getSeed(): number {
    return this.seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

// City coordinates for TSP
export interface City {
  id: number;
  name: string;
  x: number;
  y: number;
  population?: number;
  country?: string;
}

// TSP Problem instance
export interface TSPProblem {
  id: string;
  name: string;
  description: string;
  cities: City[];
  optimalTour?: number[];
  optimalDistance?: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  metadata: {
    cityCount: number;
    mapWidth: number;
    mapHeight: number;
    seed: number;
    generated: Date;
  };
}

// Subset Sum Problem instance
export interface SubsetSumProblem {
  id: string;
  name: string;
  description: string;
  numbers: number[];
  target: number;
  solution?: number[];
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  context: 'cryptographic' | 'financial' | 'scheduling' | 'general';
  metadata: {
    numberCount: number;
    range: [number, number];
    density: number; // proportion of numbers that should be in solution
    seed: number;
    generated: Date;
  };
}

// Maximum Clique Problem instance
export interface MaxCliqueProblem {
  id: string;
  name: string;
  description: string;
  nodes: Array<{
    id: number;
    name: string;
    type?: string;
    metadata?: Record<string, string | number | boolean>;
  }>;
  edges: Array<{
    from: number;
    to: number;
    weight?: number;
  }>;
  solution?: number[];
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  context: 'social' | 'molecular' | 'scheduling' | 'general';
  metadata: {
    nodeCount: number;
    edgeCount: number;
    density: number;
    seed: number;
    generated: Date;
  };
}

// 3-SAT Problem instance
export interface ThreeSATProblem {
  id: string;
  name: string;
  description: string;
  variables: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
  clauses: Array<{
    literals: Array<{
      variable: number;
      negated: boolean;
    }>;
  }>;
  solution?: boolean[];
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  context: 'circuit' | 'planning' | 'verification' | 'general';
  metadata: {
    variableCount: number;
    clauseCount: number;
    ratio: number; // clause to variable ratio
    seed: number;
    generated: Date;
  };
}

/**
 * TSP Problem Generator
 */
export class TSPGenerator {
  private rng: SeededRandom;

  constructor(seed?: number) {
    this.rng = new SeededRandom(seed);
  }

  /**
   * Generate a random TSP instance
   */
  generate(options: {
    cityCount: number;
    mapWidth?: number;
    mapHeight?: number;
    clusterCount?: number;
    name?: string;
    difficulty?: 'easy' | 'medium' | 'hard' | 'extreme';
  }): TSPProblem {
    const {
      cityCount,
      mapWidth = 1000,
      mapHeight = 800,
      clusterCount = Math.ceil(cityCount / 10),
      name = `TSP-${cityCount}`,
      difficulty = this.determineDifficulty(cityCount)
    } = options;

    const cities: City[] = [];
    const cityNames = this.generateCityNames(cityCount);

    if (clusterCount > 1 && cityCount > 10) {
      // Generate clustered cities for more realistic problems
      cities.push(...this.generateClusteredCities(
        cityCount, mapWidth, mapHeight, clusterCount, cityNames
      ));
    } else {
      // Generate uniformly distributed cities
      cities.push(...this.generateUniformCities(
        cityCount, mapWidth, mapHeight, cityNames
      ));
    }

    const id = `tsp_${Date.now()}_${cityCount}`;
    const description = this.generateTSPDescription(cityCount, difficulty);

    return {
      id,
      name,
      description,
      cities,
      difficulty,
      metadata: {
        cityCount,
        mapWidth,
        mapHeight,
        seed: this.rng.seed,
        generated: new Date()
      }
    };
  }

  private generateClusteredCities(
    count: number, width: number, height: number, 
    clusterCount: number, names: string[]
  ): City[] {
    const cities: City[] = [];
    const clusterCenters = [];

    // Generate cluster centers
    for (let i = 0; i < clusterCount; i++) {
      clusterCenters.push({
        x: this.rng.nextFloat(width * 0.1, width * 0.9),
        y: this.rng.nextFloat(height * 0.1, height * 0.9)
      });
    }

    // Distribute cities among clusters
    const citiesPerCluster = Math.floor(count / clusterCount);
    const remainder = count % clusterCount;

    let cityIndex = 0;
    for (let cluster = 0; cluster < clusterCount; cluster++) {
      const centerX = clusterCenters[cluster].x;
      const centerY = clusterCenters[cluster].y;
      const clusterRadius = Math.min(width, height) * 0.15;
      
      const citiesInThisCluster = citiesPerCluster + (cluster < remainder ? 1 : 0);
      
      for (let j = 0; j < citiesInThisCluster; j++) {
        const angle = this.rng.nextFloat(0, 2 * Math.PI);
        const radius = this.rng.nextFloat(0, clusterRadius);
        
        cities.push({
          id: cityIndex,
          name: names[cityIndex],
          x: Math.max(0, Math.min(width, centerX + radius * Math.cos(angle))),
          y: Math.max(0, Math.min(height, centerY + radius * Math.sin(angle))),
          population: this.rng.nextInt(10000, 1000000)
        });
        cityIndex++;
      }
    }

    return cities;
  }

  private generateUniformCities(
    count: number, width: number, height: number, names: string[]
  ): City[] {
    const cities: City[] = [];
    
    for (let i = 0; i < count; i++) {
      cities.push({
        id: i,
        name: names[i],
        x: this.rng.nextFloat(50, width - 50),
        y: this.rng.nextFloat(50, height - 50),
        population: this.rng.nextInt(10000, 1000000)
      });
    }

    return cities;
  }

  private generateCityNames(count: number): string[] {
    const prefixes = ['New', 'Old', 'East', 'West', 'North', 'South', 'Upper', 'Lower'];
    const bases = [
      'York', 'London', 'Paris', 'Berlin', 'Tokyo', 'Sydney', 'Cairo', 'Mumbai',
      'Venice', 'Prague', 'Vienna', 'Oslo', 'Helsinki', 'Stockholm', 'Copenhagen',
      'Amsterdam', 'Brussels', 'Zurich', 'Geneva', 'Milan', 'Rome', 'Athens',
      'Budapest', 'Warsaw', 'Moscow', 'Kiev', 'Istanbul', 'Tehran', 'Baghdad',
      'Damascus', 'Riyadh', 'Doha', 'Dubai', 'Muscat', 'Kabul', 'Karachi',
      'Delhi', 'Chennai', 'Kolkata', 'Bangkok', 'Manila', 'Jakarta', 'Singapore',
      'Seoul', 'Beijing', 'Shanghai', 'Hong Kong', 'Taipei', 'Osaka', 'Kyoto'
    ];
    const suffixes = ['City', 'Town', 'burg', 'ville', 'ford', 'haven', 'port'];

    const names: string[] = [];
    const used = new Set<string>();

    // Add some real city names first
    const realCities = this.rng.shuffle([...bases]).slice(0, Math.min(count, bases.length));
    names.push(...realCities);
    realCities.forEach(name => used.add(name));

    // Generate synthetic names for remaining cities
    while (names.length < count) {
      let name: string;
      if (this.rng.next() < 0.3 && prefixes.length > 0) {
        // Prefix + base
        name = `${this.rng.choice(prefixes)} ${this.rng.choice(bases)}`;
      } else if (this.rng.next() < 0.3 && suffixes.length > 0) {
        // Base + suffix
        name = `${this.rng.choice(bases)}${this.rng.choice(suffixes)}`;
      } else {
        // Just base
        name = this.rng.choice(bases);
      }

      if (!used.has(name)) {
        names.push(name);
        used.add(name);
      }
    }

    return names;
  }

  private generateTSPDescription(cityCount: number, difficulty: string): string {
    const contexts = [
      'delivery route optimization',
      'tourist itinerary planning',
      'supply chain logistics',
      'circuit board drilling',
      'warehouse robot navigation',
      'sales territory planning'
    ];

    const context = this.rng.choice(contexts);
    return `${cityCount}-city ${context} problem (${difficulty} difficulty). Find the shortest route visiting all cities exactly once.`;
  }

  private determineDifficulty(cityCount: number): 'easy' | 'medium' | 'hard' | 'extreme' {
    if (cityCount <= 10) return 'easy';
    if (cityCount <= 25) return 'medium';
    if (cityCount <= 50) return 'hard';
    return 'extreme';
  }
}

/**
 * Subset Sum Problem Generator
 */
export class SubsetSumGenerator {
  private rng: SeededRandom;

  constructor(seed?: number) {
    this.rng = new SeededRandom(seed);
  }

  generate(options: {
    numberCount: number;
    range?: [number, number];
    targetRatio?: number;
    context?: 'cryptographic' | 'financial' | 'scheduling' | 'general';
    difficulty?: 'easy' | 'medium' | 'hard' | 'extreme';
    name?: string;
  }): SubsetSumProblem {
    const {
      numberCount,
      range = [1, 100],
      targetRatio = 0.5,
      context = 'general',
      difficulty = this.determineDifficulty(numberCount),
      name = `SubsetSum-${numberCount}`
    } = options;

    // Generate solution subset first (ensures solvability)
    const solutionSize = Math.max(1, Math.floor(numberCount * targetRatio));
    const solutionIndices = new Set<number>();
    
    while (solutionIndices.size < solutionSize) {
      solutionIndices.add(this.rng.nextInt(0, numberCount - 1));
    }

    const numbers: number[] = [];
    let target = 0;

    // Generate numbers with solution subset
    for (let i = 0; i < numberCount; i++) {
      if (solutionIndices.has(i)) {
        // This number is in the solution
        const value = this.generateContextualNumber(context, range);
        numbers.push(value);
        target += value;
      } else {
        // This number is not in the solution
        numbers.push(this.generateContextualNumber(context, range));
      }
    }

    // Add some noise to make it more challenging
    if (difficulty !== 'easy') {
      target += this.rng.nextInt(-Math.floor(target * 0.1), Math.floor(target * 0.1));
    }

    const solution = Array.from(solutionIndices).sort();
    const id = `subset_${Date.now()}_${numberCount}`;
    const description = this.generateSubsetSumDescription(numberCount, context, difficulty);

    return {
      id,
      name,
      description,
      numbers,
      target,
      solution,
      difficulty,
      context,
      metadata: {
        numberCount,
        range,
        density: targetRatio,
        seed: this.rng.seed,
        generated: new Date()
      }
    };
  }

  private generateContextualNumber(context: string, range: [number, number]): number {
    switch (context) {
      case 'cryptographic': {
        // Powers of 2 and related numbers for crypto contexts
        if (this.rng.next() < 0.3) {
          const power = this.rng.nextInt(1, 10);
          return Math.pow(2, power);
        }
        return this.rng.nextInt(range[0], range[1]);
      }

      case 'financial': {
        // Common financial amounts
        const amounts = [100, 250, 500, 1000, 2500, 5000, 10000];
        if (this.rng.next() < 0.4) {
          return this.rng.choice(amounts);
        }
        return this.rng.nextInt(range[0], range[1]) * 10;
      }

      case 'scheduling': {
        // Time-based numbers (hours, minutes)
        return this.rng.nextInt(Math.max(1, range[0]), Math.min(168, range[1])); // Max 1 week
      }

      default:
        return this.rng.nextInt(range[0], range[1]);
    }
  }

  private generateSubsetSumDescription(
    numberCount: number, context: string, difficulty: string
  ): string {
    const contextDescriptions = {
      cryptographic: 'cryptographic key generation',
      financial: 'budget allocation optimization',
      scheduling: 'time slot assignment',
      general: 'resource allocation'
    };

    const desc = contextDescriptions[context];
    return `${numberCount}-number ${desc} problem (${difficulty} difficulty). Find a subset that sums to the target value.`;
  }

  private determineDifficulty(numberCount: number): 'easy' | 'medium' | 'hard' | 'extreme' {
    if (numberCount <= 10) return 'easy';
    if (numberCount <= 20) return 'medium';
    if (numberCount <= 35) return 'hard';
    return 'extreme';
  }
}

/**
 * Maximum Clique Problem Generator
 */
export class MaxCliqueGenerator {
  private rng: SeededRandom;

  constructor(seed?: number) {
    this.rng = new SeededRandom(seed);
  }

  generate(options: {
    nodeCount: number;
    density?: number;
    context?: 'social' | 'molecular' | 'scheduling' | 'general';
    difficulty?: 'easy' | 'medium' | 'hard' | 'extreme';
    name?: string;
  }): MaxCliqueProblem {
    const {
      nodeCount,
      density = 0.3,
      context = 'general',
      difficulty = this.determineDifficulty(nodeCount),
      name = `MaxClique-${nodeCount}`
    } = options;

    const nodes = this.generateNodes(nodeCount, context);
    const edges = this.generateEdges(nodes, density);
    const solution = this.findMaximumClique(nodes, edges);

    const id = `clique_${Date.now()}_${nodeCount}`;
    const description = this.generateMaxCliqueDescription(nodeCount, context, difficulty);

    return {
      id,
      name,
      description,
      nodes,
      edges,
      solution,
      difficulty,
      context,
      metadata: {
        nodeCount,
        edgeCount: edges.length,
        density,
        seed: this.rng.seed,
        generated: new Date()
      }
    };
  }

  private generateNodes(count: number, context: string): MaxCliqueProblem['nodes'] {
    const nodes: MaxCliqueProblem['nodes'] = [];

    for (let i = 0; i < count; i++) {
      nodes.push({
        id: i,
        name: this.generateNodeName(i, context),
        type: this.generateNodeType(context),
        metadata: this.generateNodeMetadata(context)
      });
    }

    return nodes;
  }

  private generateNodeName(id: number, context: string): string {
    switch (context) {
      case 'social': {
        const names = ['Alice', 'Bob', 'Carol', 'David', 'Eva', 'Frank', 'Grace', 'Henry'];
        const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
        const name = names[id % names.length];
        const surname = surnames[this.rng.nextInt(0, surnames.length - 1)];
        return `${name} ${surname}`;
      }

      case 'molecular': {
        const atoms = ['C', 'N', 'O', 'S', 'P', 'H'];
        return `${this.rng.choice(atoms)}${id + 1}`;
      }

      case 'scheduling': {
        return `Task_${String(id + 1).padStart(3, '0')}`;
      }

      default:
        return `Node_${id + 1}`;
    }
  }

  private generateNodeType(context: string): string {
    const types = {
      social: ['person', 'organization', 'group'],
      molecular: ['atom', 'bond', 'group'],
      scheduling: ['task', 'resource', 'constraint'],
      general: ['node', 'entity', 'element']
    };

    return this.rng.choice(types[context]);
  }

  private generateNodeMetadata(context: string): Record<string, string | number | boolean> {
    switch (context) {
      case 'social':
        return {
          age: this.rng.nextInt(18, 65),
          connections: this.rng.nextInt(5, 50),
          influence: this.rng.nextFloat(0, 1)
        };

      case 'molecular':
        return {
          atomicNumber: this.rng.nextInt(1, 18),
          bondCount: this.rng.nextInt(1, 4),
          electronegativity: this.rng.nextFloat(0.5, 4.0)
        };

      case 'scheduling':
        return {
          duration: this.rng.nextInt(1, 8),
          priority: this.rng.nextInt(1, 5),
          dependencies: this.rng.nextInt(0, 3)
        };

      default:
        return {
          weight: this.rng.nextFloat(0, 1),
          value: this.rng.nextInt(1, 100)
        };
    }
  }

  private generateEdges(nodes: MaxCliqueProblem['nodes'], density: number): MaxCliqueProblem['edges'] {
    const edges: MaxCliqueProblem['edges'] = [];
    const nodeCount = nodes.length;
    
    // Create edges based on density
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (this.rng.next() < density) {
          edges.push({
            from: i,
            to: j,
            weight: this.rng.nextFloat(0, 1)
          });
        }
      }
    }

    return edges;
  }

  private findMaximumClique(
    nodes: MaxCliqueProblem['nodes'], 
    edges: MaxCliqueProblem['edges']
  ): number[] {
    // Simple greedy approximation for demonstration
    // In practice, would use more sophisticated algorithms
    const adjacencyList = new Map<number, Set<number>>();
    
    // Build adjacency list
    nodes.forEach(node => adjacencyList.set(node.id, new Set()));
    edges.forEach(edge => {
      adjacencyList.get(edge.from)?.add(edge.to);
      adjacencyList.get(edge.to)?.add(edge.from);
    });

    // Greedy algorithm: start with highest degree node
    const degrees = new Map<number, number>();
    nodes.forEach(node => {
      degrees.set(node.id, adjacencyList.get(node.id)?.size || 0);
    });

    const sortedNodes = nodes.sort((a, b) => (degrees.get(b.id) || 0) - (degrees.get(a.id) || 0));
    
    const clique: number[] = [];
    
    for (const node of sortedNodes) {
      // Check if this node is connected to all nodes in current clique
      const isConnectedToAll = clique.every(cliqueNode => 
        adjacencyList.get(node.id)?.has(cliqueNode)
      );
      
      if (isConnectedToAll) {
        clique.push(node.id);
      }
    }

    return clique.sort();
  }

  private generateMaxCliqueDescription(
    nodeCount: number, context: string, difficulty: string
  ): string {
    const contextDescriptions = {
      social: 'social network analysis',
      molecular: 'molecular structure optimization',
      scheduling: 'resource scheduling',
      general: 'graph analysis'
    };

    const desc = contextDescriptions[context];
    return `${nodeCount}-node ${desc} problem (${difficulty} difficulty). Find the largest fully connected subgraph.`;
  }

  private determineDifficulty(nodeCount: number): 'easy' | 'medium' | 'hard' | 'extreme' {
    if (nodeCount <= 15) return 'easy';
    if (nodeCount <= 30) return 'medium';
    if (nodeCount <= 50) return 'hard';
    return 'extreme';
  }
}

/**
 * 3-SAT Problem Generator
 */
export class ThreeSATGenerator {
  private rng: SeededRandom;

  constructor(seed?: number) {
    this.rng = new SeededRandom(seed);
  }

  generate(options: {
    variableCount: number;
    clauseRatio?: number;
    context?: 'circuit' | 'planning' | 'verification' | 'general';
    difficulty?: 'easy' | 'medium' | 'hard' | 'extreme';
    name?: string;
  }): ThreeSATProblem {
    const {
      variableCount,
      clauseRatio = 4.3, // Standard ratio for hard 3-SAT instances
      context = 'general',
      difficulty = this.determineDifficulty(variableCount),
      name = `3SAT-${variableCount}`
    } = options;

    const clauseCount = Math.floor(variableCount * clauseRatio);
    const variables = this.generateVariables(variableCount, context);
    const clauses = this.generateClauses(variableCount, clauseCount);
    const solution = this.findSatisfyingAssignment(variables, clauses);

    const id = `sat_${Date.now()}_${variableCount}`;
    const description = this.generateThreeSATDescription(variableCount, context, difficulty);

    return {
      id,
      name,
      description,
      variables,
      clauses,
      solution,
      difficulty,
      context,
      metadata: {
        variableCount,
        clauseCount,
        ratio: clauseRatio,
        seed: this.rng.seed,
        generated: new Date()
      }
    };
  }

  private generateVariables(count: number, context: string): ThreeSATProblem['variables'] {
    const variables: ThreeSATProblem['variables'] = [];

    for (let i = 0; i < count; i++) {
      variables.push({
        id: i,
        name: this.generateVariableName(i, context),
        description: this.generateVariableDescription(i, context)
      });
    }

    return variables;
  }

  private generateVariableName(id: number, context: string): string {
    switch (context) {
      case 'circuit':
        return `gate_${String(id + 1).padStart(2, '0')}`;
      case 'planning':
        return `action_${String(id + 1).padStart(2, '0')}`;
      case 'verification':
        return `prop_${String(id + 1).padStart(2, '0')}`;
      default:
        return `x${id + 1}`;
    }
  }

  private generateVariableDescription(id: number, context: string): string {
    switch (context) {
      case 'circuit': {
        const gates = ['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR'];
        return `${this.rng.choice(gates)} gate output`;
      }
      case 'planning': {
        const actions = ['move', 'pick', 'place', 'rotate', 'scan', 'process'];
        return `Execute ${this.rng.choice(actions)} operation`;
      }
      case 'verification': {
        return `Property holds at time ${id + 1}`;
      }
      default:
        return `Boolean variable ${id + 1}`;
    }
  }

  private generateClauses(variableCount: number, clauseCount: number): ThreeSATProblem['clauses'] {
    const clauses: ThreeSATProblem['clauses'] = [];

    for (let i = 0; i < clauseCount; i++) {
      const clause = {
        literals: [] as Array<{ variable: number; negated: boolean }>
      };

      // Ensure each clause has exactly 3 literals
      const variables = this.rng.shuffle(Array.from({ length: variableCount }, (_, i) => i));
      
      for (let j = 0; j < 3; j++) {
        clause.literals.push({
          variable: variables[j],
          negated: this.rng.next() < 0.5
        });
      }

      clauses.push(clause);
    }

    return clauses;
  }

  private findSatisfyingAssignment(
    variables: ThreeSATProblem['variables'],
    clauses: ThreeSATProblem['clauses']
  ): boolean[] | undefined {
    // Try random assignments (simplified solver for demo)
    const maxTries = 1000;
    
    for (let attempt = 0; attempt < maxTries; attempt++) {
      const assignment: boolean[] = [];
      
      // Generate random assignment
      for (let i = 0; i < variables.length; i++) {
        assignment.push(this.rng.next() < 0.5);
      }

      // Check if this assignment satisfies all clauses
      if (this.evaluateAssignment(assignment, clauses)) {
        return assignment;
      }
    }

    // If no satisfying assignment found, return undefined
    return undefined;
  }

  private evaluateAssignment(assignment: boolean[], clauses: ThreeSATProblem['clauses']): boolean {
    return clauses.every(clause => {
      return clause.literals.some(literal => {
        const value = assignment[literal.variable];
        return literal.negated ? !value : value;
      });
    });
  }

  private generateThreeSATDescription(
    variableCount: number, context: string, difficulty: string
  ): string {
    const contextDescriptions = {
      circuit: 'circuit verification',
      planning: 'automated planning',
      verification: 'formal verification',
      general: 'boolean satisfiability'
    };

    const desc = contextDescriptions[context];
    return `${variableCount}-variable ${desc} problem (${difficulty} difficulty). Find boolean assignment satisfying all clauses.`;
  }

  private determineDifficulty(variableCount: number): 'easy' | 'medium' | 'hard' | 'extreme' {
    if (variableCount <= 10) return 'easy';
    if (variableCount <= 25) return 'medium';
    if (variableCount <= 50) return 'hard';
    return 'extreme';
  }
}

/**
 * Unified Problem Generator Factory
 */
export class ProblemGeneratorFactory {
  static createTSP(seed?: number): TSPGenerator {
    return new TSPGenerator(seed);
  }

  static createSubsetSum(seed?: number): SubsetSumGenerator {
    return new SubsetSumGenerator(seed);
  }

  static createMaxClique(seed?: number): MaxCliqueGenerator {
    return new MaxCliqueGenerator(seed);
  }

  static create3SAT(seed?: number): ThreeSATGenerator {
    return new ThreeSATGenerator(seed);
  }

  /**
   * Generate a complete problem set for testing
   */
  static generateProblemSet(seed?: number): {
    tsp: TSPProblem[];
    subsetSum: SubsetSumProblem[];
    maxClique: MaxCliqueProblem[];
    threeSAT: ThreeSATProblem[];
  } {
    const tspGen = new TSPGenerator(seed);
    const subsetGen = new SubsetSumGenerator(seed);
    const cliqueGen = new MaxCliqueGenerator(seed);
    const satGen = new ThreeSATGenerator(seed);

    return {
      tsp: [
        tspGen.generate({ cityCount: 10, name: 'Small City Tour' }),
        tspGen.generate({ cityCount: 25, name: 'Regional Delivery Route' }),
        tspGen.generate({ cityCount: 50, name: 'Cross-Country Logistics' })
      ],
      subsetSum: [
        subsetGen.generate({ numberCount: 10, context: 'cryptographic', name: 'Crypto Key Selection' }),
        subsetGen.generate({ numberCount: 15, context: 'financial', name: 'Portfolio Optimization' }),
        subsetGen.generate({ numberCount: 20, context: 'scheduling', name: 'Time Allocation' })
      ],
      maxClique: [
        cliqueGen.generate({ nodeCount: 15, context: 'social', name: 'Friend Group Analysis' }),
        cliqueGen.generate({ nodeCount: 20, context: 'molecular', name: 'Chemical Structure' }),
        cliqueGen.generate({ nodeCount: 25, context: 'scheduling', name: 'Resource Conflicts' })
      ],
      threeSAT: [
        satGen.generate({ variableCount: 10, context: 'circuit', name: 'Logic Gate Design' }),
        satGen.generate({ variableCount: 15, context: 'planning', name: 'Action Planning' }),
        satGen.generate({ variableCount: 20, context: 'verification', name: 'Property Verification' })
      ]
    };
  }
}

/**
 * Utility functions for problem manipulation
 */
export const ProblemUtils = {
  /**
   * Calculate TSP tour distance
   */
  calculateTSPDistance(cities: City[], tour: number[]): number {
    let totalDistance = 0;
    
    for (let i = 0; i < tour.length; i++) {
      const from = cities[tour[i]];
      const to = cities[tour[(i + 1) % tour.length]];
      const dx = from.x - to.x;
      const dy = from.y - to.y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }
    
    return totalDistance;
  },

  /**
   * Validate subset sum solution
   */
  validateSubsetSum(numbers: number[], solution: number[], target: number): boolean {
    const sum = solution.reduce((acc, index) => acc + numbers[index], 0);
    return sum === target;
  },

  /**
   * Validate maximum clique solution
   */
  validateMaxClique(edges: MaxCliqueProblem['edges'], clique: number[]): boolean {
    const edgeSet = new Set<string>();
    edges.forEach(edge => {
      edgeSet.add(`${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`);
    });

    // Check if all pairs in clique are connected
    for (let i = 0; i < clique.length; i++) {
      for (let j = i + 1; j < clique.length; j++) {
        const key = `${Math.min(clique[i], clique[j])}-${Math.max(clique[i], clique[j])}`;
        if (!edgeSet.has(key)) {
          return false;
        }
      }
    }
    
    return true;
  },

  /**
   * Validate 3-SAT solution
   */
  validate3SAT(clauses: ThreeSATProblem['clauses'], assignment: boolean[]): boolean {
    return clauses.every(clause => {
      return clause.literals.some(literal => {
        const value = assignment[literal.variable];
        return literal.negated ? !value : value;
      });
    });
  },

  /**
   * Generate problem difficulty description
   */
  getDifficultyDescription(difficulty: 'easy' | 'medium' | 'hard' | 'extreme'): string {
    const descriptions = {
      easy: 'Suitable for learning and quick testing',
      medium: 'Moderate complexity, good for demonstrations',
      hard: 'Challenging problems requiring optimization',
      extreme: 'Large-scale instances testing algorithmic limits'
    };
    return descriptions[difficulty];
  }
};