/**
 * Loading States Management for Quantum Optimization Components
 * Provides coordinated loading experiences with progressive enhancement
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

// Loading phase types
export type LoadingPhase = 
  | 'idle'
  | 'initializing'
  | 'fetching'
  | 'processing'
  | 'computing'
  | 'rendering'
  | 'complete'
  | 'error';

export type LoadingPriority = 'low' | 'normal' | 'high' | 'critical';

export interface LoadingState {
  phase: LoadingPhase;
  progress: number; // 0-100
  message?: string;
  error?: string;
  startTime: number;
  estimatedTime?: number;
}

export interface LoadingConfig {
  minDisplayTime?: number; // Minimum time to show loading (prevents flashing)
  gracePeriod?: number; // Grace period before showing loading
  priority?: LoadingPriority;
  enableSkeleton?: boolean;
  enableProgressAnimation?: boolean;
  enableTimeEstimation?: boolean;
}

/**
 * Enhanced loading hook with phase management and progress tracking
 */
export function useLoadingState(
  config: LoadingConfig = {}
) {
  const {
    minDisplayTime = 300,
    gracePeriod = 100,
    priority = 'normal',
    enableSkeleton = true,
    enableProgressAnimation = true,
    enableTimeEstimation = true
  } = config;

  const [state, setState] = useState<LoadingState>({
    phase: 'idle',
    progress: 0,
    startTime: 0
  });

  const [shouldShowLoading, setShouldShowLoading] = useState(false);
  const [graceTimer, setGraceTimer] = useState<NodeJS.Timeout | null>(null);
  const [minDisplayTimer, setMinDisplayTimer] = useState<NodeJS.Timeout | null>(null);

  // Start loading with grace period
  const startLoading = useCallback((phase: LoadingPhase = 'initializing', message?: string) => {
    const startTime = Date.now();
    
    setState(prev => ({
      ...prev,
      phase,
      progress: 0,
      message,
      error: undefined,
      startTime
    }));

    // Clear existing timers
    if (graceTimer) clearTimeout(graceTimer);
    if (minDisplayTimer) clearTimeout(minDisplayTimer);

    // Set grace period before showing loading
    const timer = setTimeout(() => {
      setShouldShowLoading(true);
    }, gracePeriod);
    
    setGraceTimer(timer);
  }, [gracePeriod, graceTimer, minDisplayTimer]);

  // Update loading progress and phase
  const updateLoading = useCallback((
    updates: Partial<Pick<LoadingState, 'phase' | 'progress' | 'message' | 'estimatedTime'>>
  ) => {
    setState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Complete loading with minimum display time
  const completeLoading = useCallback(() => {
    const elapsed = Date.now() - state.startTime;
    const remaining = Math.max(0, minDisplayTime - elapsed);

    const finishLoading = () => {
      setState(prev => ({
        ...prev,
        phase: 'complete',
        progress: 100
      }));
      setShouldShowLoading(false);
    };

    if (remaining > 0 && shouldShowLoading) {
      const timer = setTimeout(finishLoading, remaining);
      setMinDisplayTimer(timer);
    } else {
      finishLoading();
    }
  }, [state.startTime, minDisplayTime, shouldShowLoading]);

  // Error handling
  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      phase: 'error',
      error
    }));
  }, []);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (graceTimer) clearTimeout(graceTimer);
      if (minDisplayTimer) clearTimeout(minDisplayTimer);
    };
  }, [graceTimer, minDisplayTimer]);

  // Estimate remaining time based on progress
  const estimatedTimeRemaining = useMemo(() => {
    if (!enableTimeEstimation || state.progress === 0) return undefined;
    
    const elapsed = Date.now() - state.startTime;
    const rate = state.progress / elapsed;
    const remaining = (100 - state.progress) / rate;
    
    return remaining;
  }, [enableTimeEstimation, state.progress, state.startTime]);

  return {
    ...state,
    isLoading: shouldShowLoading,
    estimatedTimeRemaining,
    startLoading,
    updateLoading,
    completeLoading,
    setError,
    config: {
      enableSkeleton,
      enableProgressAnimation,
      priority
    }
  };
}

/**
 * Coordinated loading manager for multiple components
 */
export class LoadingCoordinator {
  private loadingStates = new Map<string, LoadingState>();
  private listeners = new Set<(states: Map<string, LoadingState>) => void>();
  private priorities: Record<LoadingPriority, number> = {
    low: 1,
    normal: 2,
    high: 3,
    critical: 4
  };

  // Register a component's loading state
  register(componentId: string, config: LoadingConfig = {}): LoadingController {
    const initialState: LoadingState = {
      phase: 'idle',
      progress: 0,
      startTime: 0
    };

    this.loadingStates.set(componentId, initialState);
    this.notifyListeners();

    return new LoadingController(componentId, this, config);
  }

  // Update a component's loading state
  updateState(componentId: string, updates: Partial<LoadingState>): void {
    const current = this.loadingStates.get(componentId);
    if (!current) return;

    const updated = { ...current, ...updates };
    this.loadingStates.set(componentId, updated);
    this.notifyListeners();
  }

  // Get overall loading state
  getOverallState(): {
    isLoading: boolean;
    phase: LoadingPhase;
    progress: number;
    criticalOperations: number;
  } {
    const states = Array.from(this.loadingStates.values());
    const activeStates = states.filter(s => s.phase !== 'idle' && s.phase !== 'complete');
    
    const isLoading = activeStates.length > 0;
    const criticalOperations = activeStates.filter(s => s.phase === 'computing').length;
    
    let overallPhase: LoadingPhase = 'idle';
    let overallProgress = 0;

    if (activeStates.length > 0) {
      // Determine highest priority phase
      const phases = activeStates.map(s => s.phase);
      if (phases.includes('error')) overallPhase = 'error';
      else if (phases.includes('computing')) overallPhase = 'computing';
      else if (phases.includes('processing')) overallPhase = 'processing';
      else if (phases.includes('fetching')) overallPhase = 'fetching';
      else if (phases.includes('rendering')) overallPhase = 'rendering';
      else overallPhase = 'initializing';

      // Calculate weighted average progress
      overallProgress = activeStates.reduce((sum, state) => sum + state.progress, 0) / activeStates.length;
    }

    return {
      isLoading,
      phase: overallPhase,
      progress: overallProgress,
      criticalOperations
    };
  }

  // Subscribe to state changes
  subscribe(listener: (states: Map<string, LoadingState>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(new Map(this.loadingStates)));
  }

  // Cleanup
  dispose(): void {
    this.loadingStates.clear();
    this.listeners.clear();
  }
}

/**
 * Individual component loading controller
 */
export class LoadingController {
  constructor(
    private componentId: string,
    private coordinator: LoadingCoordinator,
    private config: LoadingConfig
  ) {}

  start(phase: LoadingPhase = 'initializing', message?: string): void {
    this.coordinator.updateState(this.componentId, {
      phase,
      progress: 0,
      message,
      error: undefined,
      startTime: Date.now()
    });
  }

  update(updates: Partial<LoadingState>): void {
    this.coordinator.updateState(this.componentId, updates);
  }

  setProgress(progress: number, message?: string): void {
    this.coordinator.updateState(this.componentId, {
      progress: Math.min(100, Math.max(0, progress)),
      message
    });
  }

  setPhase(phase: LoadingPhase, message?: string): void {
    this.coordinator.updateState(this.componentId, { phase, message });
  }

  complete(): void {
    this.coordinator.updateState(this.componentId, {
      phase: 'complete',
      progress: 100
    });
  }

  error(error: string): void {
    this.coordinator.updateState(this.componentId, {
      phase: 'error',
      error
    });
  }
}

/**
 * Progressive loading enhancement utilities
 */
export class ProgressiveLoader {
  private static readonly PHASES: LoadingPhase[] = [
    'initializing',
    'fetching',
    'processing',
    'computing',
    'rendering',
    'complete'
  ];

  // Create a realistic loading progression
  static createProgressionPlan(
    totalTime: number,
    phases: LoadingPhase[] = ProgressiveLoader.PHASES
  ): Array<{ phase: LoadingPhase; duration: number; progress: number }> {
    const phaseWeights = {
      initializing: 0.1,
      fetching: 0.2,
      processing: 0.3,
      computing: 0.3,
      rendering: 0.1,
      complete: 0.0
    };

    let cumulativeProgress = 0;
    return phases.map(phase => {
      const weight = phaseWeights[phase] || 0.1;
      const duration = totalTime * weight;
      const progress = Math.min(100, cumulativeProgress + (weight * 100));
      cumulativeProgress = progress;

      return { phase, duration, progress };
    });
  }

  // Execute loading progression with realistic timing
  static async executeProgression(
    controller: LoadingController,
    plan: Array<{ phase: LoadingPhase; duration: number; progress: number }>,
    onProgress?: (phase: LoadingPhase, progress: number) => void
  ): Promise<void> {
    for (const step of plan) {
      controller.setPhase(step.phase);
      
      // Animate progress within this phase
      const stepDuration = step.duration;
      const frameRate = 60; // FPS
      const frameInterval = 1000 / frameRate;
      const totalFrames = Math.floor(stepDuration / frameInterval);
      
      for (let frame = 0; frame <= totalFrames; frame++) {
        const frameProgress = (frame / totalFrames) * step.progress;
        controller.setProgress(Math.floor(frameProgress));
        
        onProgress?.(step.phase, frameProgress);
        
        await new Promise(resolve => setTimeout(resolve, frameInterval));
      }
    }
    
    controller.complete();
  }
}

/**
 * Hook for component-specific loading with coordination
 */
export function useCoordinatedLoading(
  componentId: string,
  coordinator: LoadingCoordinator,
  config: LoadingConfig = {}
) {
  const [controller] = useState(() => coordinator.register(componentId, config));
  const [localState, setLocalState] = useState<LoadingState>({
    phase: 'idle',
    progress: 0,
    startTime: 0
  });

  useEffect(() => {
    const unsubscribe = coordinator.subscribe((states) => {
      const state = states.get(componentId);
      if (state) {
        setLocalState(state);
      }
    });

    return unsubscribe;
  }, [componentId, coordinator]);

  return {
    ...localState,
    controller,
    isLoading: localState.phase !== 'idle' && localState.phase !== 'complete',
    config
  };
}

/**
 * Skeleton loading transition utilities
 */
export class SkeletonTransitionManager {
  private static transitions = new Map<string, {
    skeleton: React.ComponentType;
    component: React.ComponentType;
    transitionDuration: number;
  }>();

  static register(
    id: string,
    skeleton: React.ComponentType,
    component: React.ComponentType,
    transitionDuration = 300
  ): void {
    this.transitions.set(id, { skeleton, component, transitionDuration });
  }

  static createTransition(id: string, isLoading: boolean): {
    component: React.ComponentType | null;
    className: string;
  } {
    const transition = this.transitions.get(id);
    if (!transition) {
      return { component: null, className: '' };
    }

    return {
      component: isLoading ? transition.skeleton : transition.component,
      className: isLoading ? 'opacity-100' : 'opacity-0 animate-fade-in'
    };
  }
}

// Default loading messages for different phases
export const DEFAULT_LOADING_MESSAGES: Record<LoadingPhase, string> = {
  idle: 'Ready',
  initializing: 'Setting up quantum systems...',
  fetching: 'Retrieving optimization data...',
  processing: 'Analyzing problem structure...',
  computing: 'Running quantum algorithms...',
  rendering: 'Generating visualizations...',
  complete: 'Complete',
  error: 'An error occurred'
};

// Export utilities
export const LoadingUtils = {
  ProgressiveLoader,
  SkeletonTransitionManager,
  LoadingCoordinator,
  DEFAULT_LOADING_MESSAGES
};

export default {
  useLoadingState,
  useCoordinatedLoading,
  LoadingCoordinator,
  LoadingController,
  ProgressiveLoader,
  SkeletonTransitionManager
};