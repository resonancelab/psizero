/**
 * Quantum Optimizer Components Index
 * Centralized exports for all quantum optimization visualization components
 */

// Animated Components
export { default as AnimatedTSPVisualizer } from './AnimatedTSPVisualizer';
export { default as AnimatedQualityMetrics } from './AnimatedQualityMetrics';

// Export Components
export { default as ExportDialog } from './ExportDialog';

// Responsive Components
export { default as ResponsiveOptimizationLayout } from './ResponsiveOptimizationLayout';
export { default as MobileTSPVisualizer } from './MobileTSPVisualizer';

// Error Handling Components
export {
  OptimizationErrorBoundary,
  OptimizationErrorBoundaryWithFallback,
  withErrorBoundary,
  useErrorBoundary
} from './ErrorBoundary';

// Skeleton Loading Components
export {
  TSPVisualizerSkeleton,
  QualityMetricsSkeleton,
  ProblemGallerySkeleton,
  SolutionComparisonSkeleton,
  PerformanceDashboardSkeleton,
  AlgorithmExplainerSkeleton,
  ConfigurationPanelSkeleton,
  LoadingOverlay,
  LoadingDots
} from './SkeletonLoaders';

// Progressive Loading Wrapper
export { ProgressiveLoadingWrapper } from './ProgressiveLoadingWrapper';

// Performance Benchmarking
export { PerformanceBenchmarkDashboard } from './PerformanceBenchmarkDashboard';

// Demo Components
export { default as TSPVisualizer } from './TSPVisualizer';
export { default as SubsetSumDemo } from './SubsetSumDemo';
export { default as MaximumCliqueDemo } from './MaximumCliqueDemo';
export { default as ThreeSATDemo } from './3SATDemo';

// Accessibility Features
export { AccessibilityProvider, useAccessibility, AccessibilityOptionsPanel } from './AccessibilityProvider';
export { AccessibleTSPVisualizer } from './AccessibleTSPVisualizer';
export { AccessibilityHelp } from './AccessibilityHelp';

// Core Animation System (re-exported for convenience)
export {
  TSPAnimator,
  QualityAnimator,
  ParticleSystem,
  CSSAnimations,
  useAnimation,
  AnimationPresets
} from '../../lib/quantum-optimizer/animations';

// Accessibility Utilities (re-exported for convenience)
export {
  useAnnouncements,
  useKeyboardNavigation,
  useFocusManagement,
  useAccessibilityPreferences,
  AriaLabels,
  ScreenReader,
  KeyboardShortcuts,
  HighContrastTheme,
  ReducedMotion
} from '../../lib/quantum-optimizer/accessibility-utils';

// Type definitions for component props
export type {
  TSPProblem,
  TSPSolution,
  SubsetSumProblem,
  SubsetSumSolution,
  MaxCliqueProblem,
  MaxCliqueSolution,
  ThreeSATProblem,
  ThreeSATSolution,
  SolutionQuality,
  OptimizationProblem,
  OptimizationSolution,
  ProblemType
} from '../../lib/quantum-optimizer/types';

// Problem generators (re-exported for convenience)
export {
  TSPGenerator,
  SubsetSumGenerator,
  MaxCliqueGenerator,
  ThreeSATGenerator,
  ProblemGeneratorFactory,
  ProblemUtils
} from '../../lib/quantum-optimizer/problem-generators';

// Solution validators (re-exported for convenience)
export {
  SolutionValidatorFactory,
  SolutionComparison,
  TSPValidator,
  SubsetSumValidator,
  MaxCliqueValidator,
  ThreeSATValidator
} from '../../lib/quantum-optimizer/validators';

// Data structures (re-exported for convenience)
export {
  ProblemStorage,
  SolutionStorage,
  SessionManager,
  SettingsManager
} from '../../lib/quantum-optimizer/data-structures';

// Export utilities (re-exported for convenience)
export {
  ProblemExporter,
  SolutionExporter,
  ExportUtils
} from '../../lib/quantum-optimizer/export-utils';

// Error handling utilities (re-exported for convenience)
export {
  OptimizationErrorHandler,
  APICircuitBreaker,
  RetryManager,
  ServiceHealthMonitor
} from '../../lib/quantum-optimizer/error-handling';

// Performance benchmarking utilities (re-exported for convenience)
export {
  PerformanceBenchmark
} from '../../lib/quantum-optimizer/performance-benchmark';

export type {
  BenchmarkSuite
} from '../../lib/quantum-optimizer/performance-benchmark';