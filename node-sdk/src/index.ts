// Main export file for the Nomyx Resonance SDK
export { ResonanceClient } from './resonance-client';

// Core types and interfaces
export * from './core/types';
export * from './core/errors';
export * from './core/constants';

// Foundation layer (RNET)
export * from './foundation/rnet-client';
export * from './foundation/types';

// Flagship service (SAI)
export * from './flagship/sai-client';
export * from './flagship/types';

// Specialized engines
export * from './engines/srs-client';
export * from './engines/hqe-client';
export * from './engines/qsem-client';
export * from './engines/nlc-client';
export * from './engines/qcr-client';
export * from './engines/iching-client';
export * from './engines/unified-client';
export * from './engines/types';

// Real-time capabilities
export * from './realtime/websocket-manager';
export * from './realtime/space-session';
export * from './realtime/types';

// Utilities
export * from './utils/retry';
export * from './utils/validation';
export * from './utils/logger';

// Re-export the existing dynamic API for advanced users
export { DynamicApi } from './dynamic-api';
