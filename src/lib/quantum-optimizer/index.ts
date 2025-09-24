/**
 * Quantum Optimizer Library
 * Complete solution for NP-Complete problem generation, solving, and validation
 */

// Export problem generators
export * from './problem-generators';

// Export solution validators
export * from './validators';

// Export data structures
export * from './data-structures';

// Export types
export * from './types';

// Re-export specific commonly used items for convenience
export {
  ProblemGeneratorFactory,
  TSPGenerator,
  SubsetSumGenerator,
  MaxCliqueGenerator,
  ThreeSATGenerator
} from './problem-generators';

export {
  SolutionValidatorFactory,
  SolutionComparison,
  TSPValidator,
  SubsetSumValidator,
  MaxCliqueValidator,
  ThreeSATValidator
} from './validators';

export {
  ProblemStorage,
  SolutionStorage,
  SessionManager,
  SettingsManager,
  DataUtils
} from './data-structures';

// Library metadata
export const QUANTUM_OPTIMIZER_VERSION = '1.0.0';
export const SUPPORTED_PROBLEM_TYPES = ['tsp', 'subsetSum', 'maxClique', 'threeSAT'] as const;