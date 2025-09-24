/**
 * Export Utilities for Quantum Optimization Problems and Solutions
 * Provides comprehensive export functionality in multiple formats (JSON, CSV, etc.)
 */

import type {
  TSPProblem,
  TSPSolution,
  SubsetSumProblem,
  SubsetSumSolution,
  MaxCliqueProblem,
  MaxCliqueSolution,
  ThreeSATProblem,
  ThreeSATSolution,
  OptimizationProblem,
  OptimizationSolution,
  SolutionQuality,
  ProblemType
} from './types';

import type { City } from './problem-generators';

// Export configuration options
export interface ExportOptions {
  format: 'json' | 'csv' | 'tsv' | 'xlsx';
  includeMetadata?: boolean;
  includeQuality?: boolean;
  compressed?: boolean;
  filename?: string;
  dateFormat?: 'iso' | 'locale' | 'timestamp';
}

// Export result with download information
export interface ExportResult {
  success: boolean;
  filename: string;
  size: number;
  format: string;
  downloadUrl?: string;
  error?: string;
}

/**
 * Problem Export Utilities
 */
export class ProblemExporter {
  /**
   * Export single problem to specified format
   */
  static async exportProblem(
    problem: OptimizationProblem,
    options: ExportOptions = { format: 'json' }
  ): Promise<ExportResult> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = options.filename || `problem_${problem.id}_${timestamp}`;
      
      switch (options.format) {
        case 'json':
          return this.exportProblemJSON(problem, filename, options);
        case 'csv':
          return this.exportProblemCSV(problem, filename, options);
        case 'tsv':
          return this.exportProblemTSV(problem, filename, options);
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }
    } catch (error) {
      return {
        success: false,
        filename: '',
        size: 0,
        format: options.format,
        error: error instanceof Error ? error.message : 'Unknown export error'
      };
    }
  }

  /**
   * Export multiple problems as a collection
   */
  static async exportProblems(
    problems: OptimizationProblem[],
    options: ExportOptions = { format: 'json' }
  ): Promise<ExportResult> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = options.filename || `problems_collection_${timestamp}`;
      
      const collection = {
        exportInfo: {
          timestamp: new Date().toISOString(),
          count: problems.length,
          types: [...new Set(problems.map(p => this.getProblemType(p)))],
          version: '1.0.0'
        },
        problems: options.includeMetadata ? problems : problems.map(p => this.stripMetadata(p))
      };

      switch (options.format) {
        case 'json':
          return this.downloadJSON(collection, `${filename}.json`);
        case 'csv':
          return this.exportProblemsCSV(problems, filename, options);
        default:
          throw new Error(`Unsupported format for multiple problems: ${options.format}`);
      }
    } catch (error) {
      return {
        success: false,
        filename: '',
        size: 0,
        format: options.format,
        error: error instanceof Error ? error.message : 'Unknown export error'
      };
    }
  }

  private static exportProblemJSON(
    problem: OptimizationProblem,
    filename: string,
    options: ExportOptions
  ): ExportResult {
    const data = options.includeMetadata ? problem : this.stripMetadata(problem);
    return this.downloadJSON(data, `${filename}.json`);
  }

  private static exportProblemCSV(
    problem: OptimizationProblem,
    filename: string,
    options: ExportOptions
  ): ExportResult {
    const problemType = this.getProblemType(problem);
    let csvContent: string;

    switch (problemType) {
      case 'tsp':
        csvContent = this.tspToCSV(problem as TSPProblem, options);
        break;
      case 'subsetSum':
        csvContent = this.subsetSumToCSV(problem as SubsetSumProblem, options);
        break;
      case 'maxClique':
        csvContent = this.maxCliqueToCSV(problem as MaxCliqueProblem, options);
        break;
      case 'threeSAT':
        csvContent = this.threeSATToCSV(problem as ThreeSATProblem, options);
        break;
      default:
        throw new Error(`CSV export not supported for problem type: ${problemType}`);
    }

    return this.downloadCSV(csvContent, `${filename}.csv`);
  }

  private static exportProblemTSV(
    problem: OptimizationProblem,
    filename: string,
    options: ExportOptions
  ): ExportResult {
    // Convert CSV to TSV by replacing commas with tabs
    const csvResult = this.exportProblemCSV(problem, filename, options);
    if (!csvResult.success) return csvResult;

    // This is a simplified approach - in practice would regenerate with tabs
    return {
      ...csvResult,
      filename: filename.replace('.csv', '.tsv')
    };
  }

  private static tspToCSV(problem: TSPProblem, options: ExportOptions): string {
    const headers = ['city_id', 'name', 'x', 'y', 'population', 'country'];
    const rows = problem.cities.map(city => [
      city.id,
      `"${city.name}"`,
      city.x,
      city.y,
      city.population || '',
      `"${city.country || ''}"`
    ]);

    let csv = headers.join(',') + '\n';
    csv += rows.map(row => row.join(',')).join('\n');

    if (options.includeMetadata) {
      csv += '\n\n# Metadata\n';
      csv += `# Problem ID: ${problem.id}\n`;
      csv += `# Name: ${problem.name}\n`;
      csv += `# Description: ${problem.description}\n`;
      csv += `# Difficulty: ${problem.difficulty}\n`;
      csv += `# City Count: ${problem.metadata.cityCount}\n`;
      csv += `# Map Dimensions: ${problem.metadata.mapWidth}x${problem.metadata.mapHeight}\n`;
      csv += `# Generated: ${problem.metadata.generated.toISOString()}\n`;
    }

    return csv;
  }

  private static subsetSumToCSV(problem: SubsetSumProblem, options: ExportOptions): string {
    const headers = ['index', 'value'];
    const rows = problem.numbers.map((num, index) => [index, num]);

    let csv = headers.join(',') + '\n';
    csv += rows.map(row => row.join(',')).join('\n');
    csv += `\n# Target Sum: ${problem.target}\n`;

    if (options.includeMetadata) {
      csv += `# Problem ID: ${problem.id}\n`;
      csv += `# Name: ${problem.name}\n`;
      csv += `# Description: ${problem.description}\n`;
      csv += `# Context: ${problem.context}\n`;
      csv += `# Difficulty: ${problem.difficulty}\n`;
    }

    return csv;
  }

  private static maxCliqueToCSV(problem: MaxCliqueProblem, options: ExportOptions): string {
    // Export nodes
    let csv = '# Nodes\n';
    csv += 'node_id,name,type\n';
    problem.nodes.forEach(node => {
      csv += `${node.id},"${node.name}","${node.type || ''}"\n`;
    });

    // Export edges
    csv += '\n# Edges\n';
    csv += 'from,to,weight\n';
    problem.edges.forEach(edge => {
      csv += `${edge.from},${edge.to},${edge.weight || ''}\n`;
    });

    if (options.includeMetadata) {
      csv += '\n# Metadata\n';
      csv += `# Problem ID: ${problem.id}\n`;
      csv += `# Name: ${problem.name}\n`;
      csv += `# Context: ${problem.context}\n`;
      csv += `# Node Count: ${problem.metadata.nodeCount}\n`;
      csv += `# Edge Count: ${problem.metadata.edgeCount}\n`;
      csv += `# Density: ${problem.metadata.density}\n`;
    }

    return csv;
  }

  private static threeSATToCSV(problem: ThreeSATProblem, options: ExportOptions): string {
    // Export variables
    let csv = '# Variables\n';
    csv += 'variable_id,name,description\n';
    problem.variables.forEach(variable => {
      csv += `${variable.id},"${variable.name}","${variable.description || ''}"\n`;
    });

    // Export clauses
    csv += '\n# Clauses\n';
    csv += 'clause_id,literal1_var,literal1_neg,literal2_var,literal2_neg,literal3_var,literal3_neg\n';
    problem.clauses.forEach((clause, index) => {
      const literals = clause.literals;
      csv += `${index},${literals[0].variable},${literals[0].negated},${literals[1].variable},${literals[1].negated},${literals[2].variable},${literals[2].negated}\n`;
    });

    if (options.includeMetadata) {
      csv += '\n# Metadata\n';
      csv += `# Problem ID: ${problem.id}\n`;
      csv += `# Name: ${problem.name}\n`;
      csv += `# Context: ${problem.context}\n`;
      csv += `# Variable Count: ${problem.metadata.variableCount}\n`;
      csv += `# Clause Count: ${problem.metadata.clauseCount}\n`;
      csv += `# Ratio: ${problem.metadata.ratio}\n`;
    }

    return csv;
  }

  private static exportProblemsCSV(
    problems: OptimizationProblem[],
    filename: string,
    options: ExportOptions
  ): ExportResult {
    // Create summary CSV of all problems
    const headers = ['id', 'name', 'type', 'difficulty', 'size', 'generated'];
    const rows = problems.map(problem => [
      problem.id,
      `"${problem.name}"`,
      this.getProblemType(problem),
      problem.difficulty,
      this.getProblemSize(problem),
      this.formatDate(this.getProblemDate(problem), options.dateFormat)
    ]);

    let csv = headers.join(',') + '\n';
    csv += rows.map(row => row.join(',')).join('\n');

    return this.downloadCSV(csv, `${filename}.csv`);
  }

  private static getProblemType(problem: OptimizationProblem): ProblemType {
    if ('cities' in problem) return 'tsp';
    if ('numbers' in problem && 'target' in problem) return 'subsetSum';
    if ('nodes' in problem && 'edges' in problem) return 'maxClique';
    if ('variables' in problem && 'clauses' in problem) return 'threeSAT';
    throw new Error('Unknown problem type');
  }

  private static getProblemSize(problem: OptimizationProblem): number {
    if ('cities' in problem) return problem.cities.length;
    if ('numbers' in problem) return problem.numbers.length;
    if ('nodes' in problem) return problem.nodes.length;
    if ('variables' in problem) return problem.variables.length;
    return 0;
  }

  private static getProblemDate(problem: OptimizationProblem): Date {
    if ('metadata' in problem && problem.metadata && 'generated' in problem.metadata) {
      return problem.metadata.generated;
    }
    return new Date();
  }

  private static stripMetadata(problem: OptimizationProblem): OptimizationProblem {
    const { metadata, ...strippedProblem } = problem as OptimizationProblem & { metadata?: unknown };
    return strippedProblem as OptimizationProblem;
  }

  private static formatDate(date: Date, format?: string): string {
    switch (format) {
      case 'locale':
        return date.toLocaleDateString();
      case 'timestamp':
        return date.getTime().toString();
      default:
        return date.toISOString();
    }
  }

  private static downloadJSON(data: unknown, filename: string): ExportResult {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    this.triggerDownload(url, filename);
    
    return {
      success: true,
      filename,
      size: blob.size,
      format: 'json',
      downloadUrl: url
    };
  }

  private static downloadCSV(csvContent: string, filename: string): ExportResult {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    this.triggerDownload(url, filename);
    
    return {
      success: true,
      filename,
      size: blob.size,
      format: 'csv',
      downloadUrl: url
    };
  }

  private static triggerDownload(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL after a delay to ensure download starts
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/**
 * Solution Export Utilities
 */
export class SolutionExporter {
  /**
   * Export single solution with optional quality metrics
   */
  static async exportSolution(
    solution: OptimizationSolution,
    problem: OptimizationProblem,
    quality?: SolutionQuality,
    options: ExportOptions = { format: 'json' }
  ): Promise<ExportResult> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = options.filename || `solution_${timestamp}`;
      
      const exportData = {
        solution,
        problem: options.includeMetadata ? problem : ProblemExporter['stripMetadata'](problem),
        quality: options.includeQuality ? quality : undefined,
        exportInfo: {
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      };

      switch (options.format) {
        case 'json':
          return ProblemExporter['downloadJSON'](exportData, `${filename}.json`);
        case 'csv':
          return this.exportSolutionCSV(solution, problem, quality, filename, options);
        default:
          throw new Error(`Unsupported solution export format: ${options.format}`);
      }
    } catch (error) {
      return {
        success: false,
        filename: '',
        size: 0,
        format: options.format,
        error: error instanceof Error ? error.message : 'Unknown export error'
      };
    }
  }

  /**
   * Export multiple solutions for comparison
   */
  static async exportSolutions(
    solutions: Array<{
      solution: OptimizationSolution;
      problem: OptimizationProblem;
      quality?: SolutionQuality;
    }>,
    options: ExportOptions = { format: 'json' }
  ): Promise<ExportResult> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = options.filename || `solutions_comparison_${timestamp}`;
      
      const collection = {
        exportInfo: {
          timestamp: new Date().toISOString(),
          count: solutions.length,
          version: '1.0.0'
        },
        solutions: solutions.map(({ solution, problem, quality }) => ({
          solution,
          problem: options.includeMetadata ? problem : ProblemExporter['stripMetadata'](problem),
          quality: options.includeQuality ? quality : undefined
        }))
      };

      switch (options.format) {
        case 'json':
          return ProblemExporter['downloadJSON'](collection, `${filename}.json`);
        case 'csv':
          return this.exportSolutionsCSV(solutions, filename, options);
        default:
          throw new Error(`Unsupported format for multiple solutions: ${options.format}`);
      }
    } catch (error) {
      return {
        success: false,
        filename: '',
        size: 0,
        format: options.format,
        error: error instanceof Error ? error.message : 'Unknown export error'
      };
    }
  }

  private static exportSolutionCSV(
    solution: OptimizationSolution,
    problem: OptimizationProblem,
    quality: SolutionQuality | undefined,
    filename: string,
    options: ExportOptions
  ): ExportResult {
    const problemType = ProblemExporter['getProblemType'](problem);
    let csvContent: string;

    switch (problemType) {
      case 'tsp':
        csvContent = this.tspSolutionToCSV(solution as TSPSolution, problem as TSPProblem, quality, options);
        break;
      case 'subsetSum':
        csvContent = this.subsetSumSolutionToCSV(solution as SubsetSumSolution, problem as SubsetSumProblem, quality, options);
        break;
      case 'maxClique':
        csvContent = this.maxCliqueSolutionToCSV(solution as MaxCliqueSolution, problem as MaxCliqueProblem, quality, options);
        break;
      case 'threeSAT':
        csvContent = this.threeSATSolutionToCSV(solution as ThreeSATSolution, problem as ThreeSATProblem, quality, options);
        break;
      default:
        throw new Error(`CSV export not supported for solution type: ${problemType}`);
    }

    return ProblemExporter['downloadCSV'](csvContent, `${filename}.csv`);
  }

  private static exportSolutionsCSV(
    solutions: Array<{
      solution: OptimizationSolution;
      problem: OptimizationProblem;
      quality?: SolutionQuality;
    }>,
    filename: string,
    options: ExportOptions
  ): ExportResult {
    // Create comparison CSV
    const headers = ['solution_id', 'problem_id', 'method', 'quality_score', 'optimality', 'time_elapsed', 'valid'];
    const rows = solutions.map((item, index) => [
      index + 1,
      item.problem.id,
      item.solution.method,
      item.quality ? (item.quality.score * 100).toFixed(2) : '',
      item.quality ? (item.quality.optimality * 100).toFixed(2) : '',
      item.solution.timeElapsed || '',
      item.quality ? item.quality.isValid : ''
    ]);

    let csv = headers.join(',') + '\n';
    csv += rows.map(row => row.join(',')).join('\n');

    return ProblemExporter['downloadCSV'](csv, `${filename}.csv`);
  }

  private static tspSolutionToCSV(
    solution: TSPSolution,
    problem: TSPProblem,
    quality: SolutionQuality | undefined,
    options: ExportOptions
  ): string {
    let csv = '# TSP Solution\n';
    csv += 'step,city_id,city_name,x,y\n';
    
    solution.tour.forEach((cityIndex, step) => {
      const city = problem.cities[cityIndex];
      csv += `${step + 1},${city.id},"${city.name}",${city.x},${city.y}\n`;
    });

    csv += `\n# Solution Info\n`;
    csv += `# Total Distance: ${solution.distance.toFixed(2)}\n`;
    csv += `# Method: ${solution.method}\n`;
    csv += `# Timestamp: ${solution.timestamp.toISOString()}\n`;

    if (quality && options.includeQuality) {
      csv += `# Quality Score: ${(quality.score * 100).toFixed(2)}%\n`;
      csv += `# Optimality: ${(quality.optimality * 100).toFixed(2)}%\n`;
      csv += `# Valid: ${quality.isValid}\n`;
    }

    return csv;
  }

  private static subsetSumSolutionToCSV(
    solution: SubsetSumSolution,
    problem: SubsetSumProblem,
    quality: SolutionQuality | undefined,
    options: ExportOptions
  ): string {
    let csv = '# Subset Sum Solution\n';
    csv += 'index,value,selected\n';
    
    problem.numbers.forEach((value, index) => {
      const selected = solution.indices.includes(index);
      csv += `${index},${value},${selected}\n`;
    });

    csv += `\n# Solution Info\n`;
    csv += `# Target: ${problem.target}\n`;
    csv += `# Achieved Sum: ${solution.sum}\n`;
    csv += `# Method: ${solution.method}\n`;
    csv += `# Selected Indices: ${solution.indices.join(',')}\n`;

    if (quality && options.includeQuality) {
      csv += `# Quality Score: ${(quality.score * 100).toFixed(2)}%\n`;
      csv += `# Valid: ${quality.isValid}\n`;
    }

    return csv;
  }

  private static maxCliqueSolutionToCSV(
    solution: MaxCliqueSolution,
    problem: MaxCliqueProblem,
    quality: SolutionQuality | undefined,
    options: ExportOptions
  ): string {
    let csv = '# Maximum Clique Solution\n';
    csv += 'node_id,name,in_clique\n';
    
    problem.nodes.forEach(node => {
      const inClique = solution.clique.includes(node.id);
      csv += `${node.id},"${node.name}",${inClique}\n`;
    });

    csv += `\n# Solution Info\n`;
    csv += `# Clique Size: ${solution.size}\n`;
    csv += `# Clique Nodes: ${solution.clique.join(',')}\n`;
    csv += `# Method: ${solution.method}\n`;

    if (quality && options.includeQuality) {
      csv += `# Quality Score: ${(quality.score * 100).toFixed(2)}%\n`;
      csv += `# Valid: ${quality.isValid}\n`;
    }

    return csv;
  }

  private static threeSATSolutionToCSV(
    solution: ThreeSATSolution,
    problem: ThreeSATProblem,
    quality: SolutionQuality | undefined,
    options: ExportOptions
  ): string {
    let csv = '# 3-SAT Solution\n';
    csv += 'variable_id,name,assignment\n';
    
    problem.variables.forEach((variable, index) => {
      const assignment = solution.assignment[index];
      csv += `${variable.id},"${variable.name}",${assignment}\n`;
    });

    csv += `\n# Solution Info\n`;
    csv += `# Satisfied Clauses: ${solution.satisfiedClauses}\n`;
    csv += `# Total Clauses: ${problem.clauses.length}\n`;
    csv += `# Method: ${solution.method}\n`;

    if (quality && options.includeQuality) {
      csv += `# Quality Score: ${(quality.score * 100).toFixed(2)}%\n`;
      csv += `# Valid: ${quality.isValid}\n`;
    }

    return csv;
  }
}

/**
 * Unified Export Utilities
 */
export const ExportUtils = {
  /**
   * Export problem and solution together
   */
  async exportComplete(
    problem: OptimizationProblem,
    solution: OptimizationSolution,
    quality?: SolutionQuality,
    options: ExportOptions = { format: 'json' }
  ): Promise<ExportResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = options.filename || `complete_${problem.id}_${timestamp}`;
    
    const completeData = {
      problem: options.includeMetadata ? problem : ProblemExporter['stripMetadata'](problem),
      solution,
      quality: options.includeQuality ? quality : undefined,
      exportInfo: {
        timestamp: new Date().toISOString(),
        type: 'complete',
        version: '1.0.0'
      }
    };

    switch (options.format) {
      case 'json':
        return ProblemExporter['downloadJSON'](completeData, `${filename}.json`);
      default:
        throw new Error(`Complete export not supported for format: ${options.format}`);
    }
  },

  /**
   * Get file size estimate before export
   */
  estimateSize(data: unknown, format: string): number {
    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(data)]).size;
      case 'csv':
        // Rough estimate for CSV
        return JSON.stringify(data).length * 0.7;
      default:
        return 0;
    }
  },

  /**
   * Validate export data before processing
   */
  validateExportData(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data) {
      errors.push('No data provided for export');
      return { valid: false, errors };
    }

    // Add more validation as needed
    return { valid: errors.length === 0, errors };
  }
};