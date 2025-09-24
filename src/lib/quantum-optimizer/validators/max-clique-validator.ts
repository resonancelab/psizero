/**
 * Maximum Clique Solution Validator
 */

import type { MaxCliqueProblem } from '../problem-generators';
import type { MaxCliqueSolution, SolutionQuality } from '../types';

export class MaxCliqueValidator {
  static validate(problem: MaxCliqueProblem, solution: MaxCliqueSolution): SolutionQuality {
    const violations: string[] = [];
    const improvements: string[] = [];
    const metrics: Record<string, number> = {};

    // Validate clique
    const isValidClique = this.validateClique(problem, solution.clique, violations);
    
    // Size metrics
    metrics.cliqueSize = solution.clique.length;
    metrics.reportedSize = solution.size;
    metrics.maxPossibleSize = this.estimateMaxCliqueSize(problem);
    
    if (metrics.cliqueSize !== metrics.reportedSize) {
      violations.push(`Reported size ${metrics.reportedSize} does not match actual clique size ${metrics.cliqueSize}`);
    }

    // Quality assessment
    metrics.density = this.calculateCliqueDensity(problem, solution.clique);
    metrics.connectivity = this.calculateConnectivity(problem, solution.clique);

    // Generate improvements
    this.suggestMaxCliqueImprovements(problem, solution, improvements);

    const score = isValidClique ? metrics.cliqueSize / problem.nodes.length : 0;
    const optimality = isValidClique ? metrics.cliqueSize / metrics.maxPossibleSize : 0;

    return {
      isValid: isValidClique && violations.length === 0,
      score,
      optimality,
      confidence: 0.7, // Max clique optimality is harder to estimate
      details: {
        violations,
        improvements,
        metrics
      }
    };
  }

  private static validateClique(
    problem: MaxCliqueProblem,
    clique: number[],
    violations: string[]
  ): boolean {
    const nodeCount = problem.nodes.length;
    
    // Validate node indices
    for (const nodeId of clique) {
      if (nodeId < 0 || nodeId >= nodeCount) {
        violations.push(`Invalid node ID: ${nodeId}`);
        return false;
      }
    }

    // Check for duplicates
    const uniqueNodes = new Set(clique);
    if (uniqueNodes.size !== clique.length) {
      violations.push('Clique contains duplicate nodes');
      return false;
    }

    // Build adjacency set for quick lookup
    const adjacencySet = new Set<string>();
    for (const edge of problem.edges) {
      adjacencySet.add(`${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`);
    }

    // Verify all pairs are connected
    for (let i = 0; i < clique.length; i++) {
      for (let j = i + 1; j < clique.length; j++) {
        const edgeKey = `${Math.min(clique[i], clique[j])}-${Math.max(clique[i], clique[j])}`;
        if (!adjacencySet.has(edgeKey)) {
          violations.push(`Nodes ${clique[i]} and ${clique[j]} are not connected`);
          return false;
        }
      }
    }

    return true;
  }

  private static calculateCliqueDensity(problem: MaxCliqueProblem, clique: number[]): number {
    if (clique.length <= 1) return 1;
    
    const expectedEdges = (clique.length * (clique.length - 1)) / 2;
    return expectedEdges > 0 ? expectedEdges / expectedEdges : 0; // Always 1 for valid cliques
  }

  private static calculateConnectivity(problem: MaxCliqueProblem, clique: number[]): number {
    // Average connectivity of clique nodes to rest of graph
    const cliqueSet = new Set(clique);
    const adjacencyMap = new Map<number, Set<number>>();
    
    // Build adjacency map
    for (const node of problem.nodes) {
      adjacencyMap.set(node.id, new Set());
    }
    for (const edge of problem.edges) {
      adjacencyMap.get(edge.from)?.add(edge.to);
      adjacencyMap.get(edge.to)?.add(edge.from);
    }

    let totalConnections = 0;
    for (const nodeId of clique) {
      const connections = adjacencyMap.get(nodeId);
      if (connections) {
        const externalConnections = Array.from(connections).filter(id => !cliqueSet.has(id));
        totalConnections += externalConnections.length;
      }
    }

    const maxPossibleExternal = clique.length * (problem.nodes.length - clique.length);
    return maxPossibleExternal > 0 ? totalConnections / maxPossibleExternal : 0;
  }

  private static estimateMaxCliqueSize(problem: MaxCliqueProblem): number {
    // Use degeneracy-based upper bound
    const degrees = new Map<number, number>();
    
    for (const node of problem.nodes) {
      degrees.set(node.id, 0);
    }
    
    for (const edge of problem.edges) {
      degrees.set(edge.from, (degrees.get(edge.from) || 0) + 1);
      degrees.set(edge.to, (degrees.get(edge.to) || 0) + 1);
    }

    // Upper bound is minimum degree + 1
    const minDegree = Math.min(...Array.from(degrees.values()));
    return Math.min(minDegree + 1, problem.nodes.length);
  }

  private static suggestMaxCliqueImprovements(
    problem: MaxCliqueProblem,
    solution: MaxCliqueSolution,
    improvements: string[]
  ): void {
    const maxEstimate = this.estimateMaxCliqueSize(problem);
    
    if (solution.clique.length < maxEstimate * 0.8) {
      improvements.push(`Current clique size ${solution.clique.length} may be suboptimal (estimated max: ${maxEstimate})`);
    }

    // Context-specific improvements
    switch (problem.context) {
      case 'social': {
        improvements.push('For social networks, consider community detection algorithms');
        break;
      }
      case 'molecular': {
        improvements.push('For molecular structures, consider chemical bonding constraints');
        break;
      }
      case 'scheduling': {
        improvements.push('For scheduling, verify resource compatibility within clique');
        break;
      }
      default: {
        improvements.push('Consider greedy algorithms for initial clique approximation');
        break;
      }
    }

    if (solution.method === 'classical') {
      improvements.push('Try quantum approaches for better exploration of solution space');
    }
  }
}