/**
 * Performance Benchmarking Tools for Quantum Optimization
 * Measures and compares quantum vs classical algorithm performance
 */

import type {
  TSPProblem,
  SubsetSumProblem,
  MaxCliqueProblem,
  ThreeSATProblem,
  TSPSolution,
  SubsetSumSolution,
  MaxCliqueSolution,
  ThreeSATSolution,
  OptimizationProblem,
  OptimizationSolution,
  ProblemType
} from './types';

// Benchmark result types
export interface BenchmarkResult {
  problemType: ProblemType;
  problemSize: number;
  algorithmType: 'quantum' | 'classical' | 'hybrid';
  
  // Performance metrics
  executionTime: number; // milliseconds
  iterations: number;
  convergenceTime?: number; // time to reach best solution
  memoryUsage?: number; // MB
  
  // Solution quality
  solutionQuality: number; // 0-1 score
  optimalityGap?: number; // distance from known optimal
  
  // Quantum-specific metrics
  quantumAdvantage?: number; // speedup ratio vs classical
  coherenceTime?: number; // quantum state coherence duration
  errorRate?: number; // quantum error rate
  
  // Additional metadata
  timestamp: Date;
  systemInfo: SystemInfo;
  problemInstance: string; // problem ID for reproducibility
}

export interface SystemInfo {
  platform: string;
  browser: string;
  cpuCores: number;
  memoryTotal: number;
  gpuAcceleration: boolean;
  quantumSimulator: boolean;
}

export interface BenchmarkSuite {
  name: string;
  description: string;
  problems: Array<{
    type: ProblemType;
    sizes: number[];
    instances: number; // number of instances per size
  }>;
  algorithms: Array<{
    name: string;
    type: 'quantum' | 'classical' | 'hybrid';
    implementation: AlgorithmImplementation;
  }>;
}

export interface AlgorithmImplementation {
  solve: (problem: OptimizationProblem) => Promise<{
    solution: OptimizationSolution;
    metrics: PerformanceMetrics;
  }>;
  name: string;
  type: 'quantum' | 'classical' | 'hybrid';
  description: string;
}

export interface PerformanceMetrics {
  executionTime: number;
  iterations: number;
  convergenceTime?: number;
  memoryPeak?: number;
  cpuUtilization?: number;
  quantumMetrics?: QuantumMetrics;
}

export interface QuantumMetrics {
  coherenceTime: number;
  gateCount: number;
  errorRate: number;
  entanglementDepth: number;
  quantumVolume: number;
}

/**
 * Main benchmarking engine
 */
export class PerformanceBenchmark {
  private results: BenchmarkResult[] = [];
  private systemInfo: SystemInfo;
  
  constructor() {
    this.systemInfo = this.detectSystemInfo();
  }

  /**
   * Run a comprehensive benchmark suite
   */
  async runBenchmarkSuite(suite: BenchmarkSuite): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = [];
    
    console.log(`🚀 Starting benchmark suite: ${suite.name}`);
    console.log(`📊 Total problems: ${suite.problems.length} types`);
    console.log(`🔧 Algorithms: ${suite.algorithms.length}`);
    
    for (const problemSpec of suite.problems) {
      for (const size of problemSpec.sizes) {
        for (let instance = 0; instance < problemSpec.instances; instance++) {
          const problem = await this.generateProblem(problemSpec.type, size);
          
          for (const algorithm of suite.algorithms) {
            console.log(`🔄 Testing ${algorithm.name} on ${problemSpec.type}-${size} (instance ${instance + 1})`);
            
            const result = await this.benchmarkSingleRun(
              problem,
              algorithm.implementation,
              `${problemSpec.type}-${size}-${instance}`
            );
            
            results.push(result);
            this.results.push(result);
          }
        }
      }
    }
    
    return results;
  }

  /**
   * Benchmark a single algorithm on a single problem
   */
  async benchmarkSingleRun(
    problem: OptimizationProblem,
    algorithm: AlgorithmImplementation,
    instanceId: string
  ): Promise<BenchmarkResult> {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();
    
    try {
      // Run the algorithm
      const { solution, metrics } = await algorithm.solve(problem);
      
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();
      
      // Calculate performance metrics
      const executionTime = endTime - startTime;
      const memoryUsage = endMemory - startMemory;
      
      // Assess solution quality
      const solutionQuality = this.assessSolutionQuality(problem, solution);
      
      return {
        problemType: this.getProblemType(problem),
        problemSize: this.getProblemSize(problem),
        algorithmType: algorithm.type,
        executionTime,
        iterations: metrics.iterations,
        convergenceTime: metrics.convergenceTime,
        memoryUsage,
        solutionQuality,
        timestamp: new Date(),
        systemInfo: this.systemInfo,
        problemInstance: instanceId,
        ...(algorithm.type === 'quantum' && metrics.quantumMetrics && {
          coherenceTime: metrics.quantumMetrics.coherenceTime,
          errorRate: metrics.quantumMetrics.errorRate
        })
      };
    } catch (error) {
      console.error(`❌ Benchmark failed for ${algorithm.name}:`, error);
      
      return {
        problemType: this.getProblemType(problem),
        problemSize: this.getProblemSize(problem),
        algorithmType: algorithm.type,
        executionTime: -1,
        iterations: 0,
        solutionQuality: 0,
        timestamp: new Date(),
        systemInfo: this.systemInfo,
        problemInstance: instanceId
      };
    }
  }

  /**
   * Calculate quantum advantage metrics
   */
  calculateQuantumAdvantage(results: BenchmarkResult[]): QuantumAdvantageReport {
    const quantumResults = results.filter(r => r.algorithmType === 'quantum');
    const classicalResults = results.filter(r => r.algorithmType === 'classical');
    
    const report: QuantumAdvantageReport = {
      speedupRatios: [],
      qualityImprovements: [],
      scalingAdvantages: [],
      summary: {
        avgSpeedup: 0,
        maxSpeedup: 0,
        avgQualityImprovement: 0,
        problemSizesWithAdvantage: []
      }
    };
    
    // Group results by problem type and size
    const problemGroups = new Map<string, {
      quantum: BenchmarkResult[];
      classical: BenchmarkResult[];
    }>();
    
    results.forEach(result => {
      const key = `${result.problemType}-${result.problemSize}`;
      if (!problemGroups.has(key)) {
        problemGroups.set(key, { quantum: [], classical: [] });
      }
      
      const group = problemGroups.get(key)!;
      if (result.algorithmType === 'quantum') {
        group.quantum.push(result);
      } else if (result.algorithmType === 'classical') {
        group.classical.push(result);
      }
    });
    
    // Calculate advantages for each problem group
    problemGroups.forEach((group, key) => {
      if (group.quantum.length > 0 && group.classical.length > 0) {
        const avgQuantumTime = group.quantum.reduce((sum, r) => sum + r.executionTime, 0) / group.quantum.length;
        const avgClassicalTime = group.classical.reduce((sum, r) => sum + r.executionTime, 0) / group.classical.length;
        
        const avgQuantumQuality = group.quantum.reduce((sum, r) => sum + r.solutionQuality, 0) / group.quantum.length;
        const avgClassicalQuality = group.classical.reduce((sum, r) => sum + r.solutionQuality, 0) / group.classical.length;
        
        const speedupRatio = avgClassicalTime / avgQuantumTime;
        const qualityImprovement = avgQuantumQuality - avgClassicalQuality;
        
        report.speedupRatios.push({ problemKey: key, ratio: speedupRatio });
        report.qualityImprovements.push({ problemKey: key, improvement: qualityImprovement });
        
        if (speedupRatio > 1) {
          report.summary.problemSizesWithAdvantage.push(key);
        }
      }
    });
    
    // Calculate summary statistics
    if (report.speedupRatios.length > 0) {
      report.summary.avgSpeedup = report.speedupRatios.reduce((sum, s) => sum + s.ratio, 0) / report.speedupRatios.length;
      report.summary.maxSpeedup = Math.max(...report.speedupRatios.map(s => s.ratio));
    }
    
    if (report.qualityImprovements.length > 0) {
      report.summary.avgQualityImprovement = report.qualityImprovements.reduce((sum, q) => sum + q.improvement, 0) / report.qualityImprovements.length;
    }
    
    return report;
  }

  /**
   * Generate scaling analysis
   */
  analyzeScaling(results: BenchmarkResult[]): ScalingAnalysis {
    const analysis: ScalingAnalysis = {
      complexityTrends: new Map(),
      scalingExponents: new Map(),
      crossoverPoints: new Map(),
      recommendations: []
    };
    
    // Group by problem type and algorithm
    const groups = new Map<string, BenchmarkResult[]>();
    
    results.forEach(result => {
      const key = `${result.problemType}-${result.algorithmType}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(result);
    });
    
    // Analyze scaling for each group
    groups.forEach((groupResults, key) => {
      const sortedResults = groupResults.sort((a, b) => a.problemSize - b.problemSize);
      
      if (sortedResults.length >= 3) {
        const scalingExponent = this.calculateScalingExponent(sortedResults);
        analysis.scalingExponents.set(key, scalingExponent);
        
        const complexityTrend = this.identifyComplexityTrend(sortedResults);
        analysis.complexityTrends.set(key, complexityTrend);
      }
    });
    
    // Find crossover points
    const quantumGroups = new Map<ProblemType, BenchmarkResult[]>();
    const classicalGroups = new Map<ProblemType, BenchmarkResult[]>();
    
    results.forEach(result => {
      const targetMap = result.algorithmType === 'quantum' ? quantumGroups : classicalGroups;
      if (!targetMap.has(result.problemType)) {
        targetMap.set(result.problemType, []);
      }
      targetMap.get(result.problemType)!.push(result);
    });
    
    quantumGroups.forEach((quantumResults, problemType) => {
      const classicalResults = classicalGroups.get(problemType);
      if (classicalResults) {
        const crossover = this.findCrossoverPoint(quantumResults, classicalResults);
        if (crossover) {
          analysis.crossoverPoints.set(problemType, crossover);
        }
      }
    });
    
    // Generate recommendations
    analysis.recommendations = this.generateScalingRecommendations(analysis);
    
    return analysis;
  }

  /**
   * Export benchmark results
   */
  exportResults(format: 'json' | 'csv' | 'latex'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(this.results, null, 2);
      
      case 'csv':
        return this.exportToCSV();
      
      case 'latex':
        return this.exportToLatex();
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Generate comprehensive performance report
   */
  generateReport(): PerformanceReport {
    const quantumAdvantage = this.calculateQuantumAdvantage(this.results);
    const scalingAnalysis = this.analyzeScaling(this.results);
    
    return {
      summary: {
        totalRuns: this.results.length,
        problemTypes: [...new Set(this.results.map(r => r.problemType))],
        algorithmTypes: [...new Set(this.results.map(r => r.algorithmType))],
        timeRange: {
          start: new Date(Math.min(...this.results.map(r => r.timestamp.getTime()))),
          end: new Date(Math.max(...this.results.map(r => r.timestamp.getTime())))
        }
      },
      quantumAdvantage,
      scalingAnalysis,
      detailedResults: this.results,
      systemInfo: this.systemInfo,
      generatedAt: new Date()
    };
  }

  // Private helper methods
  private async generateProblem(type: ProblemType, size: number): Promise<OptimizationProblem> {
    // This would use the actual problem generators
    // For now, return a mock based on type
    switch (type) {
      case 'tsp':
        return {
          id: `tsp-${size}-${Date.now()}`,
          name: `TSP-${size}`,
          description: `${size}-city TSP problem`,
          cities: Array(size).fill(0).map((_, i) => ({
            id: i,
            name: `City_${i}`,
            x: Math.random() * 1000,
            y: Math.random() * 1000
          })),
          difficulty: 'medium' as const,
          metadata: {
            cityCount: size,
            mapWidth: 1000,
            mapHeight: 1000,
            seed: Date.now(),
            generated: new Date()
          }
        } as TSPProblem;
      
      default:
        throw new Error(`Problem type ${type} not implemented in mock`);
    }
  }

  private detectSystemInfo(): SystemInfo {
    return {
      platform: navigator.platform,
      browser: navigator.userAgent.split(' ').slice(-1)[0],
      cpuCores: navigator.hardwareConcurrency || 4,
      memoryTotal: ('deviceMemory' in navigator) ? (navigator as { deviceMemory: number }).deviceMemory * 1024 : 8192,
      gpuAcceleration: this.detectGPUAcceleration(),
      quantumSimulator: false // Would detect actual quantum hardware
    };
  }

  private detectGPUAcceleration(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const perfMemory = performance as { memory: { usedJSHeapSize: number } };
      return perfMemory.memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  private getProblemType(problem: OptimizationProblem): ProblemType {
    if ('cities' in problem) return 'tsp';
    if ('numbers' in problem) return 'subsetSum';
    if ('nodes' in problem) return 'maxClique';
    if ('variables' in problem) return 'threeSAT';
    throw new Error('Unknown problem type');
  }

  private getProblemSize(problem: OptimizationProblem): number {
    if ('cities' in problem) return problem.cities.length;
    if ('numbers' in problem) return problem.numbers.length;
    if ('nodes' in problem) return problem.nodes.length;
    if ('variables' in problem) return problem.variables.length;
    return 0;
  }

  private assessSolutionQuality(problem: OptimizationProblem, solution: OptimizationSolution): number {
    // Simplified quality assessment - would use actual validators
    return Math.random() * 0.3 + 0.7; // Mock: 0.7-1.0 quality
  }

  private calculateScalingExponent(results: BenchmarkResult[]): number {
    // Simple log-log regression to find scaling exponent
    const logSizes = results.map(r => Math.log(r.problemSize));
    const logTimes = results.map(r => Math.log(r.executionTime));
    
    const n = results.length;
    const sumLogSizes = logSizes.reduce((a, b) => a + b, 0);
    const sumLogTimes = logTimes.reduce((a, b) => a + b, 0);
    const sumLogSizesSquared = logSizes.reduce((a, b) => a + b * b, 0);
    const sumLogSizesLogTimes = logSizes.reduce((a, b, i) => a + b * logTimes[i], 0);
    
    return (n * sumLogSizesLogTimes - sumLogSizes * sumLogTimes) / 
           (n * sumLogSizesSquared - sumLogSizes * sumLogSizes);
  }

  private identifyComplexityTrend(results: BenchmarkResult[]): string {
    const exponent = this.calculateScalingExponent(results);
    
    if (exponent < 1.5) return 'Linear';
    if (exponent < 2.5) return 'Quadratic';
    if (exponent < 3.5) return 'Cubic';
    return 'Exponential';
  }

  private findCrossoverPoint(quantumResults: BenchmarkResult[], classicalResults: BenchmarkResult[]): number | null {
    // Find problem size where quantum becomes faster than classical
    const sizes = [...new Set([...quantumResults.map(r => r.problemSize), ...classicalResults.map(r => r.problemSize)])].sort((a, b) => a - b);
    
    for (const size of sizes) {
      const quantum = quantumResults.filter(r => r.problemSize === size);
      const classical = classicalResults.filter(r => r.problemSize === size);
      
      if (quantum.length > 0 && classical.length > 0) {
        const avgQuantumTime = quantum.reduce((sum, r) => sum + r.executionTime, 0) / quantum.length;
        const avgClassicalTime = classical.reduce((sum, r) => sum + r.executionTime, 0) / classical.length;
        
        if (avgQuantumTime < avgClassicalTime) {
          return size;
        }
      }
    }
    
    return null;
  }

  private generateScalingRecommendations(analysis: ScalingAnalysis): string[] {
    const recommendations: string[] = [];
    
    analysis.scalingExponents.forEach((exponent, key) => {
      if (key.includes('quantum') && exponent < 2) {
        recommendations.push(`Quantum algorithm for ${key.split('-')[0]} shows excellent scaling (exponent: ${exponent.toFixed(2)})`);
      }
      
      if (key.includes('classical') && exponent > 3) {
        recommendations.push(`Classical algorithm for ${key.split('-')[0]} shows poor scaling (exponent: ${exponent.toFixed(2)}) - consider quantum alternative`);
      }
    });
    
    analysis.crossoverPoints.forEach((crossover, problemType) => {
      recommendations.push(`For ${problemType} problems, quantum advantage appears at size ${crossover} and above`);
    });
    
    return recommendations;
  }

  private exportToCSV(): string {
    const headers = [
      'problemType', 'problemSize', 'algorithmType', 'executionTime', 
      'iterations', 'solutionQuality', 'timestamp', 'problemInstance'
    ];
    
    const rows = this.results.map(result => [
      result.problemType,
      result.problemSize,
      result.algorithmType,
      result.executionTime,
      result.iterations,
      result.solutionQuality,
      result.timestamp.toISOString(),
      result.problemInstance
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private exportToLatex(): string {
    // Generate LaTeX table format for academic papers
    let latex = '\\begin{table}[h]\n\\centering\n';
    latex += '\\begin{tabular}{|l|c|c|c|c|}\n\\hline\n';
    latex += 'Problem Type & Size & Algorithm & Time (ms) & Quality \\\\\n\\hline\n';
    
    this.results.forEach(result => {
      latex += `${result.problemType} & ${result.problemSize} & ${result.algorithmType} & `;
      latex += `${result.executionTime.toFixed(2)} & ${result.solutionQuality.toFixed(3)} \\\\\n`;
    });
    
    latex += '\\hline\n\\end{tabular}\n';
    latex += '\\caption{Quantum vs Classical Algorithm Performance Comparison}\n';
    latex += '\\end{table}';
    
    return latex;
  }
}

// Type definitions for analysis results
export interface QuantumAdvantageReport {
  speedupRatios: Array<{ problemKey: string; ratio: number }>;
  qualityImprovements: Array<{ problemKey: string; improvement: number }>;
  scalingAdvantages: Array<{ problemKey: string; advantage: number }>;
  summary: {
    avgSpeedup: number;
    maxSpeedup: number;
    avgQualityImprovement: number;
    problemSizesWithAdvantage: string[];
  };
}

export interface ScalingAnalysis {
  complexityTrends: Map<string, string>;
  scalingExponents: Map<string, number>;
  crossoverPoints: Map<ProblemType, number>;
  recommendations: string[];
}

export interface PerformanceReport {
  summary: {
    totalRuns: number;
    problemTypes: ProblemType[];
    algorithmTypes: string[];
    timeRange: { start: Date; end: Date };
  };
  quantumAdvantage: QuantumAdvantageReport;
  scalingAnalysis: ScalingAnalysis;
  detailedResults: BenchmarkResult[];
  systemInfo: SystemInfo;
  generatedAt: Date;
}

// Export default benchmark instance
export const defaultBenchmark = new PerformanceBenchmark();