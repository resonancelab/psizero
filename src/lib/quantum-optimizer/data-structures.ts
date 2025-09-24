/**
 * Data Structures for Optimization Problem and Solution Management
 * Provides persistent storage, caching, and management utilities
 */

import type {
  OptimizationProblem,
  OptimizationSolution,
  ProblemType,
  SolutionQuality,
  TSPSolution,
  SubsetSumSolution,
  MaxCliqueSolution,
  ThreeSATSolution
} from './types';

import type {
  TSPProblem,
  SubsetSumProblem,
  MaxCliqueProblem,
  ThreeSATProblem
} from './problem-generators';

// Storage keys for localStorage
const STORAGE_KEYS = {
  PROBLEMS: 'quantum_optimizer_problems',
  SOLUTIONS: 'quantum_optimizer_solutions',
  SESSIONS: 'quantum_optimizer_sessions',
  SETTINGS: 'quantum_optimizer_settings'
} as const;

// Problem metadata
export interface ProblemMetadata {
  id: string;
  type: ProblemType;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  tags: string[];
  created: Date;
  modified: Date;
  size: number; // Problem size (cities, numbers, nodes, variables)
  estimatedSolveTime: number; // Estimated solve time in milliseconds
  isCustom: boolean; // True if user-generated, false if from gallery
}

// Solution metadata
export interface SolutionMetadata {
  id: string;
  problemId: string;
  method: 'quantum' | 'classical' | 'hybrid';
  created: Date;
  timeElapsed: number;
  iterations?: number;
  quality?: SolutionQuality;
  isOptimal: boolean;
  notes?: string;
}

// Optimization session data
export interface OptimizationSession {
  id: string;
  name: string;
  problemId: string;
  solutions: string[]; // Solution IDs
  started: Date;
  lastActive: Date;
  status: 'active' | 'completed' | 'paused';
  settings: {
    maxIterations: number;
    timeLimit: number; // milliseconds
    convergenceThreshold: number;
    algorithm: string;
  };
  metrics: {
    totalTime: number;
    totalIterations: number;
    bestScore: number;
    convergenceHistory: Array<{
      iteration: number;
      score: number;
      timestamp: Date;
    }>;
  };
}

// User preferences and settings
export interface OptimizerSettings {
  visualization: {
    animationSpeed: number; // 0.1 to 2.0
    showGrid: boolean;
    showLabels: boolean;
    colorScheme: 'default' | 'dark' | 'high-contrast';
  };
  algorithm: {
    defaultMethod: 'quantum' | 'classical' | 'hybrid';
    maxIterations: number;
    timeLimit: number;
    autoSave: boolean;
  };
  ui: {
    autoStart: boolean;
    showHints: boolean;
    compactMode: boolean;
    expertMode: boolean;
  };
}

/**
 * Problem Storage Manager
 */
export class ProblemStorage {
  private static cache = new Map<string, OptimizationProblem>();
  private static metadata = new Map<string, ProblemMetadata>();

  /**
   * Store a problem with metadata
   */
  static store(problem: OptimizationProblem, metadata: Partial<ProblemMetadata>): string {
    const id = metadata.id || this.generateId();
    const fullMetadata: ProblemMetadata = {
      id,
      type: this.inferProblemType(problem),
      name: metadata.name || `Problem ${id.slice(-8)}`,
      description: metadata.description || '',
      difficulty: metadata.difficulty || 'medium',
      tags: metadata.tags || [],
      created: metadata.created || new Date(),
      modified: new Date(),
      size: this.calculateProblemSize(problem),
      estimatedSolveTime: this.estimateSolveTime(problem),
      isCustom: metadata.isCustom ?? true
    };

    // Store in cache
    this.cache.set(id, problem);
    this.metadata.set(id, fullMetadata);

    // Persist to localStorage
    this.persist();

    return id;
  }

  /**
   * Retrieve a problem by ID
   */
  static get(id: string): OptimizationProblem | null {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    // Try loading from localStorage
    this.load();
    return this.cache.get(id) || null;
  }

  /**
   * Get problem metadata
   */
  static getMetadata(id: string): ProblemMetadata | null {
    if (this.metadata.has(id)) {
      return this.metadata.get(id)!;
    }

    this.load();
    return this.metadata.get(id) || null;
  }

  /**
   * List all problems with optional filtering
   */
  static list(filter?: {
    type?: ProblemType;
    difficulty?: string;
    tags?: string[];
    isCustom?: boolean;
  }): ProblemMetadata[] {
    this.load();
    let problems = Array.from(this.metadata.values());

    if (filter) {
      problems = problems.filter(p => {
        if (filter.type && p.type !== filter.type) return false;
        if (filter.difficulty && p.difficulty !== filter.difficulty) return false;
        if (filter.isCustom !== undefined && p.isCustom !== filter.isCustom) return false;
        if (filter.tags && !filter.tags.some(tag => p.tags.includes(tag))) return false;
        return true;
      });
    }

    return problems.sort((a, b) => b.modified.getTime() - a.modified.getTime());
  }

  /**
   * Delete a problem
   */
  static delete(id: string): boolean {
    if (this.cache.has(id)) {
      this.cache.delete(id);
      this.metadata.delete(id);
      this.persist();
      return true;
    }
    return false;
  }

  /**
   * Update problem metadata
   */
  static updateMetadata(id: string, updates: Partial<ProblemMetadata>): boolean {
    const existing = this.metadata.get(id);
    if (!existing) return false;

    const updated = {
      ...existing,
      ...updates,
      modified: new Date()
    };

    this.metadata.set(id, updated);
    this.persist();
    return true;
  }

  /**
   * Export problems to JSON
   */
  static export(ids?: string[]): string {
    this.load();
    const toExport = ids || Array.from(this.cache.keys());
    
    const exportData = {
      version: '1.0.0',
      exported: new Date().toISOString(),
      problems: toExport.map(id => ({
        metadata: this.metadata.get(id),
        problem: this.cache.get(id)
      })).filter(item => item.metadata && item.problem)
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import problems from JSON
   */
  static import(jsonData: string): { success: number; errors: string[] } {
    try {
      const data = JSON.parse(jsonData);
      const errors: string[] = [];
      let success = 0;

      for (const item of data.problems || []) {
        try {
          if (item.metadata && item.problem) {
            this.store(item.problem, item.metadata);
            success++;
          }
        } catch (error) {
          errors.push(`Failed to import problem ${item.metadata?.name}: ${error}`);
        }
      }

      return { success, errors };
    } catch (error) {
      return { success: 0, errors: [`Invalid JSON data: ${error}`] };
    }
  }

  private static generateId(): string {
    return `prob_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  private static inferProblemType(problem: OptimizationProblem): ProblemType {
    if ('cities' in problem) return 'tsp';
    if ('numbers' in problem) return 'subsetSum';
    if ('nodes' in problem && 'edges' in problem) return 'maxClique';
    if ('variables' in problem && 'clauses' in problem) return 'threeSAT';
    throw new Error('Unknown problem type');
  }

  private static calculateProblemSize(problem: OptimizationProblem): number {
    if ('cities' in problem) return problem.cities.length;
    if ('numbers' in problem) return problem.numbers.length;
    if ('nodes' in problem) return problem.nodes.length;
    if ('variables' in problem) return problem.variables.length;
    return 0;
  }

  private static estimateSolveTime(problem: OptimizationProblem): number {
    const size = this.calculateProblemSize(problem);
    const type = this.inferProblemType(problem);
    
    // Rough estimates in milliseconds based on problem type and size
    const baseTime = {
      tsp: size * size * 10,
      subsetSum: size * 50,
      maxClique: size * size * 20,
      threeSAT: size * 100
    };

    return baseTime[type] || 1000;
  }

  private static persist(): void {
    try {
      const problemsData = Array.from(this.cache.entries()).map(([id, problem]) => ({
        id,
        problem,
        metadata: this.metadata.get(id)
      }));

      localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(problemsData));
    } catch (error) {
      console.warn('Failed to persist problems to localStorage:', error);
    }
  }

  private static load(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
      if (!stored) return;

      const problemsData = JSON.parse(stored);
      for (const item of problemsData) {
        if (item.id && item.problem && item.metadata) {
          this.cache.set(item.id, item.problem);
          this.metadata.set(item.id, {
            ...item.metadata,
            created: new Date(item.metadata.created),
            modified: new Date(item.metadata.modified)
          });
        }
      }
    } catch (error) {
      console.warn('Failed to load problems from localStorage:', error);
    }
  }
}

/**
 * Solution Storage Manager
 */
export class SolutionStorage {
  private static cache = new Map<string, OptimizationSolution>();
  private static metadata = new Map<string, SolutionMetadata>();

  /**
   * Store a solution with metadata
   */
  static store(
    solution: OptimizationSolution, 
    problemId: string, 
    metadata: Partial<SolutionMetadata>
  ): string {
    const id = metadata.id || this.generateId();
    const fullMetadata: SolutionMetadata = {
      id,
      problemId,
      method: metadata.method || solution.method,
      created: metadata.created || new Date(),
      timeElapsed: metadata.timeElapsed || solution.timeElapsed || 0,
      iterations: metadata.iterations || solution.iterations,
      quality: metadata.quality,
      isOptimal: metadata.isOptimal || false,
      notes: metadata.notes
    };

    this.cache.set(id, solution);
    this.metadata.set(id, fullMetadata);
    this.persist();

    return id;
  }

  /**
   * Retrieve a solution by ID
   */
  static get(id: string): OptimizationSolution | null {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    this.load();
    return this.cache.get(id) || null;
  }

  /**
   * Get solution metadata
   */
  static getMetadata(id: string): SolutionMetadata | null {
    if (this.metadata.has(id)) {
      return this.metadata.get(id)!;
    }

    this.load();
    return this.metadata.get(id) || null;
  }

  /**
   * List solutions for a problem
   */
  static listForProblem(problemId: string): SolutionMetadata[] {
    this.load();
    return Array.from(this.metadata.values())
      .filter(s => s.problemId === problemId)
      .sort((a, b) => b.created.getTime() - a.created.getTime());
  }

  /**
   * Get best solution for a problem
   */
  static getBestForProblem(problemId: string): { solution: OptimizationSolution; metadata: SolutionMetadata } | null {
    const solutions = this.listForProblem(problemId);
    if (solutions.length === 0) return null;

    // Find solution with highest quality score
    const best = solutions.reduce((prev, current) => {
      const prevScore = prev.quality?.score || 0;
      const currentScore = current.quality?.score || 0;
      return currentScore > prevScore ? current : prev;
    });

    const solution = this.get(best.id);
    return solution ? { solution, metadata: best } : null;
  }

  /**
   * Delete a solution
   */
  static delete(id: string): boolean {
    if (this.cache.has(id)) {
      this.cache.delete(id);
      this.metadata.delete(id);
      this.persist();
      return true;
    }
    return false;
  }

  /**
   * Export solutions to JSON
   */
  static export(problemId?: string): string {
    this.load();
    let toExport = Array.from(this.cache.keys());
    
    if (problemId) {
      const problemSolutions = this.listForProblem(problemId);
      toExport = problemSolutions.map(s => s.id);
    }
    
    const exportData = {
      version: '1.0.0',
      exported: new Date().toISOString(),
      problemId,
      solutions: toExport.map(id => ({
        metadata: this.metadata.get(id),
        solution: this.cache.get(id)
      })).filter(item => item.metadata && item.solution)
    };

    return JSON.stringify(exportData, null, 2);
  }

  private static generateId(): string {
    return `sol_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  private static persist(): void {
    try {
      const solutionsData = Array.from(this.cache.entries()).map(([id, solution]) => ({
        id,
        solution,
        metadata: this.metadata.get(id)
      }));

      localStorage.setItem(STORAGE_KEYS.SOLUTIONS, JSON.stringify(solutionsData));
    } catch (error) {
      console.warn('Failed to persist solutions to localStorage:', error);
    }
  }

  private static load(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SOLUTIONS);
      if (!stored) return;

      const solutionsData = JSON.parse(stored);
      for (const item of solutionsData) {
        if (item.id && item.solution && item.metadata) {
          this.cache.set(item.id, item.solution);
          this.metadata.set(item.id, {
            ...item.metadata,
            created: new Date(item.metadata.created)
          });
        }
      }
    } catch (error) {
      console.warn('Failed to load solutions from localStorage:', error);
    }
  }
}

/**
 * Session Manager
 */
export class SessionManager {
  private static cache = new Map<string, OptimizationSession>();
  private static activeSessionId: string | null = null;

  /**
   * Create a new optimization session
   */
  static create(
    problemId: string, 
    name: string, 
    settings: Partial<OptimizationSession['settings']>
  ): string {
    const id = this.generateId();
    const session: OptimizationSession = {
      id,
      name,
      problemId,
      solutions: [],
      started: new Date(),
      lastActive: new Date(),
      status: 'active',
      settings: {
        maxIterations: settings.maxIterations || 1000,
        timeLimit: settings.timeLimit || 300000, // 5 minutes
        convergenceThreshold: settings.convergenceThreshold || 0.001,
        algorithm: settings.algorithm || 'quantum'
      },
      metrics: {
        totalTime: 0,
        totalIterations: 0,
        bestScore: 0,
        convergenceHistory: []
      }
    };

    this.cache.set(id, session);
    this.activeSessionId = id;
    this.persist();

    return id;
  }

  /**
   * Get active session
   */
  static getActive(): OptimizationSession | null {
    if (!this.activeSessionId) return null;
    return this.get(this.activeSessionId);
  }

  /**
   * Get session by ID
   */
  static get(id: string): OptimizationSession | null {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    this.load();
    return this.cache.get(id) || null;
  }

  /**
   * Add solution to session
   */
  static addSolution(sessionId: string, solutionId: string, score: number): boolean {
    const session = this.get(sessionId);
    if (!session) return false;

    session.solutions.push(solutionId);
    session.lastActive = new Date();
    
    if (score > session.metrics.bestScore) {
      session.metrics.bestScore = score;
    }

    session.metrics.convergenceHistory.push({
      iteration: session.metrics.totalIterations,
      score,
      timestamp: new Date()
    });

    this.cache.set(sessionId, session);
    this.persist();
    return true;
  }

  /**
   * Update session metrics
   */
  static updateMetrics(
    sessionId: string, 
    updates: Partial<OptimizationSession['metrics']>
  ): boolean {
    const session = this.get(sessionId);
    if (!session) return false;

    session.metrics = { ...session.metrics, ...updates };
    session.lastActive = new Date();
    
    this.cache.set(sessionId, session);
    this.persist();
    return true;
  }

  /**
   * Complete session
   */
  static complete(sessionId: string): boolean {
    const session = this.get(sessionId);
    if (!session) return false;

    session.status = 'completed';
    session.lastActive = new Date();
    
    if (this.activeSessionId === sessionId) {
      this.activeSessionId = null;
    }
    
    this.cache.set(sessionId, session);
    this.persist();
    return true;
  }

  /**
   * List all sessions
   */
  static list(): OptimizationSession[] {
    this.load();
    return Array.from(this.cache.values())
      .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());
  }

  private static generateId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  private static persist(): void {
    try {
      const sessionsData = {
        sessions: Array.from(this.cache.values()),
        activeSessionId: this.activeSessionId
      };
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessionsData));
    } catch (error) {
      console.warn('Failed to persist sessions to localStorage:', error);
    }
  }

  private static load(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (!stored) return;

      const data = JSON.parse(stored);
      this.activeSessionId = data.activeSessionId;
      
      for (const session of data.sessions || []) {
        // Convert date strings back to Date objects
        session.started = new Date(session.started);
        session.lastActive = new Date(session.lastActive);
        session.metrics.convergenceHistory = session.metrics.convergenceHistory.map((entry: { iteration: number; score: number; timestamp: string }) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        
        this.cache.set(session.id, session);
      }
    } catch (error) {
      console.warn('Failed to load sessions from localStorage:', error);
    }
  }
}

/**
 * Settings Manager
 */
export class SettingsManager {
  private static settings: OptimizerSettings | null = null;

  /**
   * Get current settings
   */
  static get(): OptimizerSettings {
    if (!this.settings) {
      this.load();
    }
    return this.settings || this.getDefaults();
  }

  /**
   * Update settings
   */
  static update(updates: Partial<OptimizerSettings>): void {
    const current = this.get();
    this.settings = this.deepMerge(current, updates) as OptimizerSettings;
    this.persist();
  }

  /**
   * Reset to defaults
   */
  static reset(): void {
    this.settings = this.getDefaults();
    this.persist();
  }

  /**
   * Get default settings
   */
  static getDefaults(): OptimizerSettings {
    return {
      visualization: {
        animationSpeed: 1.0,
        showGrid: true,
        showLabels: true,
        colorScheme: 'default'
      },
      algorithm: {
        defaultMethod: 'quantum',
        maxIterations: 1000,
        timeLimit: 300000, // 5 minutes
        autoSave: true
      },
      ui: {
        autoStart: false,
        showHints: true,
        compactMode: false,
        expertMode: false
      }
    };
  }

  private static persist(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to persist settings to localStorage:', error);
    }
  }

  private static load(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        this.settings = this.deepMerge(this.getDefaults(), JSON.parse(stored)) as OptimizerSettings;
      } else {
        this.settings = this.getDefaults();
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
      this.settings = this.getDefaults();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
}

/**
 * Utility functions for data management
 */
export const DataUtils = {
  /**
   * Clear all stored data
   */
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear caches
    ProblemStorage['cache'].clear();
    ProblemStorage['metadata'].clear();
    SolutionStorage['cache'].clear();
    SolutionStorage['metadata'].clear();
    SessionManager['cache'].clear();
    SessionManager['activeSessionId'] = null;
    SettingsManager['settings'] = null;
  },

  /**
   * Get storage usage statistics
   */
  getStorageStats(): {
    problems: number;
    solutions: number;
    sessions: number;
    totalSize: number;
  } {
    const problems = ProblemStorage.list().length;
    const solutions = Array.from(SolutionStorage['metadata'].values()).length;
    const sessions = SessionManager.list().length;
    
    let totalSize = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        totalSize += new Blob([data]).size;
      }
    });

    return { problems, solutions, sessions, totalSize };
  },

  /**
   * Export all data to JSON
   */
  exportAll(): string {
    return JSON.stringify({
      version: '1.0.0',
      exported: new Date().toISOString(),
      problems: ProblemStorage.export(),
      solutions: SolutionStorage.export(),
      sessions: SessionManager.list(),
      settings: SettingsManager.get()
    }, null, 2);
  }
};