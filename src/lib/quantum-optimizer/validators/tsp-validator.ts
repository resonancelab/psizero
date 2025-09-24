/**
 * TSP Solution Validator
 */

import type { TSPProblem, City } from '../problem-generators';
import type { TSPSolution, SolutionQuality, SolutionValidator } from '../types';

export class TSPValidator {
  /**
   * Validate a TSP solution
   */
  static validate(problem: TSPProblem, solution: TSPSolution): SolutionQuality {
    const violations: string[] = [];
    const improvements: string[] = [];
    const metrics: Record<string, number> = {};

    // Basic validation
    const isValidTour = this.validateTour(problem, solution.tour, violations);
    const calculatedDistance = this.calculateDistance(problem.cities, solution.tour);
    
    metrics.calculatedDistance = calculatedDistance;
    metrics.reportedDistance = solution.distance;
    metrics.distanceError = Math.abs(calculatedDistance - solution.distance);

    // Distance accuracy check
    if (metrics.distanceError > 0.01) {
      violations.push(`Distance calculation error: reported ${solution.distance}, actual ${calculatedDistance}`);
    }

    // Quality assessment
    const quality = this.assessTSPQuality(problem, solution, calculatedDistance);
    metrics.tourEfficiency = quality.efficiency;
    metrics.crossingPenalty = quality.crossingPenalty;
    metrics.clusteringBonus = quality.clusteringBonus;

    // Generate improvements
    this.suggestTSPImprovements(problem, solution, improvements);

    const score = isValidTour ? Math.max(0, 1 - (calculatedDistance / this.estimateWorstDistance(problem))) : 0;
    const optimality = this.estimateTSPOptimality(problem, calculatedDistance);

    return {
      isValid: isValidTour && violations.length === 0,
      score,
      optimality,
      confidence: 0.8, // TSP optimality is reasonably estimable
      details: {
        violations,
        improvements,
        metrics
      }
    };
  }

  private static validateTour(problem: TSPProblem, tour: number[], violations: string[]): boolean {
    const cityCount = problem.cities.length;
    
    // Check tour length
    if (tour.length !== cityCount) {
      violations.push(`Tour length ${tour.length} does not match city count ${cityCount}`);
      return false;
    }

    // Check for valid city indices
    const validIndices = new Set(Array.from({ length: cityCount }, (_, i) => i));
    const tourSet = new Set(tour);

    for (const cityIndex of tour) {
      if (!validIndices.has(cityIndex)) {
        violations.push(`Invalid city index: ${cityIndex}`);
        return false;
      }
    }

    // Check for duplicate cities
    if (tourSet.size !== cityCount) {
      violations.push('Tour contains duplicate cities');
      return false;
    }

    return true;
  }

  private static calculateDistance(cities: City[], tour: number[]): number {
    let totalDistance = 0;
    
    for (let i = 0; i < tour.length; i++) {
      const from = cities[tour[i]];
      const to = cities[tour[(i + 1) % tour.length]];
      const dx = from.x - to.x;
      const dy = from.y - to.y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }
    
    return totalDistance;
  }

  private static assessTSPQuality(
    problem: TSPProblem, 
    solution: TSPSolution, 
    distance: number
  ): { efficiency: number; crossingPenalty: number; clusteringBonus: number } {
    const cities = problem.cities;
    const tour = solution.tour;

    // Efficiency: shorter tours are better
    const worstDistance = this.estimateWorstDistance(problem);
    const bestEstimate = this.estimateBestDistance(problem);
    const efficiency = Math.max(0, 1 - (distance - bestEstimate) / (worstDistance - bestEstimate));

    // Crossing penalty: detect tour crossings
    const crossings = this.countTourCrossings(cities, tour);
    const crossingPenalty = Math.max(0, 1 - crossings / (cities.length * 0.1));

    // Clustering bonus: reward tours that keep nearby cities together
    const clusteringScore = this.calculateClusteringScore(cities, tour);
    const clusteringBonus = clusteringScore;

    return { efficiency, crossingPenalty, clusteringBonus };
  }

  private static estimateWorstDistance(problem: TSPProblem): number {
    // Estimate worst-case distance using diagonal of bounding box
    const cities = problem.cities;
    const minX = Math.min(...cities.map(c => c.x));
    const maxX = Math.max(...cities.map(c => c.x));
    const minY = Math.min(...cities.map(c => c.y));
    const maxY = Math.max(...cities.map(c => c.y));
    
    const diagonal = Math.sqrt((maxX - minX) ** 2 + (maxY - minY) ** 2);
    return diagonal * cities.length * 0.8; // Rough estimate
  }

  private static estimateBestDistance(problem: TSPProblem): number {
    // Rough estimate using MST (Minimum Spanning Tree) lower bound
    const cities = problem.cities;
    const edges: Array<{ distance: number; from: number; to: number }> = [];
    
    // Generate all edges
    for (let i = 0; i < cities.length; i++) {
      for (let j = i + 1; j < cities.length; j++) {
        const dx = cities[i].x - cities[j].x;
        const dy = cities[i].y - cities[j].y;
        edges.push({
          distance: Math.sqrt(dx * dx + dy * dy),
          from: i,
          to: j
        });
      }
    }

    // Sort edges by distance
    edges.sort((a, b) => a.distance - b.distance);

    // Build MST using Kruskal's algorithm
    const parent = Array.from({ length: cities.length }, (_, i) => i);
    
    const find = (x: number): number => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x]);
      }
      return parent[x];
    };

    let mstWeight = 0;
    let edgesUsed = 0;

    for (const edge of edges) {
      const rootFrom = find(edge.from);
      const rootTo = find(edge.to);
      
      if (rootFrom !== rootTo) {
        parent[rootFrom] = rootTo;
        mstWeight += edge.distance;
        edgesUsed++;
        
        if (edgesUsed === cities.length - 1) break;
      }
    }

    return mstWeight; // MST is a lower bound for TSP
  }

  private static countTourCrossings(cities: City[], tour: number[]): number {
    let crossings = 0;
    const n = tour.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 2; j < n; j++) {
        if (j === n - 1 && i === 0) continue; // Skip adjacent edges

        const edge1 = {
          start: cities[tour[i]],
          end: cities[tour[(i + 1) % n]]
        };
        const edge2 = {
          start: cities[tour[j]],
          end: cities[tour[(j + 1) % n]]
        };

        if (this.doEdgesCross(edge1, edge2)) {
          crossings++;
        }
      }
    }

    return crossings / 2; // Each crossing is counted twice
  }

  private static doEdgesCross(
    edge1: { start: City; end: City },
    edge2: { start: City; end: City }
  ): boolean {
    const { start: p1, end: q1 } = edge1;
    const { start: p2, end: q2 } = edge2;

    const orientation = (p: City, q: City, r: City): number => {
      const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
      if (val === 0) return 0; // Collinear
      return val > 0 ? 1 : 2; // Clockwise or Counterclockwise
    };

    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);

    // General case
    if (o1 !== o2 && o3 !== o4) return true;

    return false; // No intersection
  }

  private static calculateClusteringScore(cities: City[], tour: number[]): number {
    let score = 0;
    const n = tour.length;

    for (let i = 0; i < n; i++) {
      const current = cities[tour[i]];
      const next = cities[tour[(i + 1) % n]];
      const prev = cities[tour[(i - 1 + n) % n]];

      // Calculate local density
      let nearbyCount = 0;
      const searchRadius = 100; // Adjust based on map scale

      for (const city of cities) {
        const dx = city.x - current.x;
        const dy = city.y - current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= searchRadius && city !== current) {
          nearbyCount++;
        }
      }

      // Bonus for visiting nearby cities consecutively
      const nextDist = Math.sqrt((next.x - current.x) ** 2 + (next.y - current.y) ** 2);
      const prevDist = Math.sqrt((prev.x - current.x) ** 2 + (prev.y - current.y) ** 2);

      if (nearbyCount > 0) {
        const localBonus = Math.min(nextDist, prevDist) <= searchRadius ? 1 : 0;
        score += localBonus / nearbyCount;
      }
    }

    return score / n;
  }

  private static estimateTSPOptimality(problem: TSPProblem, distance: number): number {
    const bestEstimate = this.estimateBestDistance(problem);
    const worstEstimate = this.estimateWorstDistance(problem);
    
    // Simple linear interpolation
    return Math.max(0, Math.min(1, 1 - (distance - bestEstimate) / (worstEstimate - bestEstimate)));
  }

  private static suggestTSPImprovements(
    problem: TSPProblem,
    solution: TSPSolution,
    improvements: string[]
  ): void {
    const tour = solution.tour;
    const cities = problem.cities;

    // Detect obvious improvements
    const crossings = this.countTourCrossings(cities, tour);
    if (crossings > 0) {
      improvements.push(`Remove ${Math.round(crossings)} tour crossings using 2-opt improvement`);
    }

    // Check for very long edges
    const edges = tour.map((cityIdx, i) => {
      const nextIdx = tour[(i + 1) % tour.length];
      const city1 = cities[cityIdx];
      const city2 = cities[nextIdx];
      const distance = Math.sqrt((city1.x - city2.x) ** 2 + (city1.y - city2.y) ** 2);
      return { from: cityIdx, to: nextIdx, distance };
    });

    const avgDistance = edges.reduce((sum, e) => sum + e.distance, 0) / edges.length;
    const longEdges = edges.filter(e => e.distance > avgDistance * 2);

    if (longEdges.length > 0) {
      improvements.push(`Consider rerouting ${longEdges.length} unusually long connections`);
    }

    // Suggest algorithm improvements
    if (solution.method === 'classical') {
      improvements.push('Try quantum annealing for potentially better global optimization');
    }
  }
}