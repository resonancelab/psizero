// API Types generated from OpenAPI specification
// Based on specs/api.yaml

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
  message?: string;
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  code?: string;
  meta?: Record<string, unknown>;
}

// Common types
export interface TelemetryPoint {
  t: number; // iteration/time index
  S: number; // symbolic entropy
  L: number; // Lyapunov metric
  satRate: number; // constraint satisfaction rate [0,1]
}

export interface ResonanceMetrics {
  entropy: number;
  plateauDetected: boolean;
  dominance: number; // max mass / coherence [0,1]
  locality: number; // non-locality inverse; lower=more non-local
  resonanceStrength: number; // phase-lock strength [0,1]
}

// SRS Types
export interface SRSProjector {
  type: 'clause' | 'equality' | 'inequality' | 'adjacency' | 'degree' | 'custom';
  params?: Record<string, unknown>;
}

export interface SRSMixerConfig {
  temperature0?: number;
  beta?: number;
  gamma0?: number;
  gammaGrowth?: number;
}

export interface SRSConfig {
  seed?: number;
  init?: {
    spread?: 'uniform' | 'biased';
    activeBudget?: number;
  };
  schedules?: {
    eta0?: number;
    etaDecay?: number;
    alphaMin?: number;
    alphaGrowth?: number;
  };
  stop?: {
    plateauEps?: number;
    plateauT?: number;
    massThreshold?: number;
    satProb?: number;
    iterMax?: number;
    restarts?: number;
  };
  entropy?: {
    lambdaPrime?: number;
    betaPrimes?: string;
  };
}

export interface SRS3SATSpec {
  variables: number;
  clauses: Array<{
    var: number;
    neg: boolean;
  }[]>;
}

export interface SRSSubsetSumSpec {
  weights: number[];
  target: number;
}

export interface SRSRequest {
  Problem: '3sat' | 'ksat' | 'subsetsum' | 'hamiltonian_path' | 'vertex_cover' | 'clique' | 'x3c' | 'custom';
  Spec: SRS3SATSpec | SRSSubsetSumSpec | Record<string, unknown>;
  Projectors?: SRSProjector[];
  Mixer?: SRSMixerConfig;
  Config?: SRSConfig;
}

export interface SRSolution {
  feasible: boolean;
  certificate?: {
    assignment?: number[];
    indices?: number[];
  };
  metrics: ResonanceMetrics;
  telemetry: TelemetryPoint[];
}

// HQE Types
export interface HQERequest {
  simulation_type: string;
  primes: number[];
  steps: number;
  lambda: number;
  config?: HQEConfig;
  parameters?: Record<string, unknown>;
}

export interface HQEConfig {
  bulk_dimension?: number;
  boundary_dimension?: number;
  slice_count?: number;
  boundary_state_count?: number;
  ads_radius?: number;
  max_iterations?: number;
  time_step?: number;
  reconstruction_tolerance?: number;
  entanglement_threshold?: number;
  holographic_complexity?: number;
  timeout_seconds?: number;
}

export interface HQESnapshot {
  step: number;
  amplitudes: number[];
  metrics: ResonanceMetrics;
}

export interface HQEResponse {
  snapshots: HQESnapshot[];
  finalMetrics: ResonanceMetrics;
}

export interface HQESession {
  id: string;
  status: 'initializing' | 'running' | 'plateau' | 'converged' | 'failed' | 'closed';
  step: number;
  metrics: ResonanceMetrics;
}

// QSEM Types
export interface QSemEncodeRequest {
  Concepts: string[];
  Basis?: 'prime' | 'hybrid';
}

export interface QSemVector {
  concept: string;
  alpha: number[];
}

export interface QSemEncodeResponse {
  vectors: QSemVector[];
}

export interface QSemResonanceRequest {
  Vectors: QSemVector[];
  Config?: QSemConfig;
}

export interface QSemConfig {
  semantic_dimensions?: number;
  max_concepts?: number;
  prime_basis_size?: number;
  context_depth?: number;
  learning_rate?: number;
  coherence_threshold?: number;
  activation_threshold?: number;
  semantic_radius?: number;
  clustering_threshold?: number;
  max_iterations?: number;
  timeout_seconds?: number;
}

export interface QSemResonanceResponse {
  coherence: number;
  pairwise: Array<{
    a: number;
    b: number;
    resonance: number;
  }>;
}

// NLC Types
export interface NLCSessionCreate {
  primes: number[];
  phases?: number[];
  goldenPhase?: boolean;
  silverPhase?: boolean;
}

export interface NLCSession {
  id: string;
  status: 'initializing' | 'syncing' | 'stable' | 'degraded' | 'closed';
  metrics: ResonanceMetrics;
}

export interface NLCMessage {
  content: string;
  stamp: string;
  channelQuality: number;
}

// QCR Types
export interface QCRSessionCreate {
  modes: ('analytical' | 'creative' | 'ethical' | 'pragmatic' | 'emotional')[];
  maxIterations?: number;
}

export interface QCRObservation {
  prompt: string;
  response: string;
  metrics: ResonanceMetrics;
}

export interface QCRState {
  id: string;
  iteration: number;
  stabilized: boolean;
  lastObservation?: QCRObservation;
}

// I-Ching Types
export interface IChingEvolveRequest {
  question: string;
  context?: string;
  querent?: string;
  steps?: number;
  config?: IChingConfig;
}

export interface IChingConfig {
  oracle_mode?: string;
  divination_method?: string;
  wisdom_accumulation?: boolean;
  pattern_recognition?: boolean;
  cosmic_alignment?: boolean;
  temporal_prediction?: boolean;
  max_readings_per_session?: number;
  reading_validity_hours?: number;
  evolution_steps?: number;
  resonance_threshold?: number;
  certainty_threshold?: number;
  timeout_seconds?: number;
}

export interface IChingStep {
  step: number;
  hexagram: string; // 6-character binary string
  entropy: number;
  attractorProximity: number;
}

export interface IChingEvolveResponse {
  sequence: IChingStep[];
  stabilized: boolean;
}

// Unified Physics Types
export interface GravityRequest {
  observerEntropyReductionRate: number;
  regionEntropyGradient: number;
  config?: UnifiedConfig;
}

export interface UnifiedConfig {
  precision_level?: string;
  quantum_corrections?: boolean;
  relativistic_effects?: boolean;
  computation_timeout?: number;
}

export interface GravityResponse {
  effectiveG: number;
  fieldStrength: number;
  notes: string;
}

// Webhook Types
export interface WebhookRegistration {
  url: string;
  events: string[];
  secret?: string;
}

export interface WebhookResponse {
  id: string;
  url: string;
  events: string[];
}

// Authentication Types
export interface ApiKeyConfig {
  key: string;
  baseUrl: string;
  environment: 'production' | 'sandbox' | 'local';
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

export interface User {
  id: string;
  email: string;
  plan: string;
  quota_limit: number;
  quota_used: number;
  quota_reset_at: string;
  created_at: string;
  updated_at: string;
  last_active: string;
  status: string;
  api_key?: string;
  is_sysadmin?: boolean; // Computed field
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ValidationResponse {
  valid: boolean;
  user: User;
  claims: {
    user_id: string;
    token_type: string;
    session_id: string;
    expires_at: string;
  };
}

export interface RefreshResponse {
  user: User;
  tokens: AuthTokens;
}

// Request/Response Types
export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ApiClientConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
  retries?: number;
}

// RNET Types
export interface RNETSpaceCreate {
  name: string;
  basis: {
    primes: number[];
    phases: number[];
  };
  operators?: {
    resonanceTarget?: number;
    localityBias?: number;
    damping?: number;
    mixer?: {
      gamma0?: number;
      gammaGrowth?: number;
      temperature0?: number;
      beta?: number;
    };
  };
  entropy?: {
    collapseThreshold?: number;
    plateauDetection?: boolean;
    lambda?: number;
  };
  policy?: {
    maxClients?: number;
    telemetryRate?: number;
    deltaCompression?: boolean;
    enableWebhooks?: boolean;
  };
}

export interface RNETSpace {
  id: string;
  name: string;
  basis: {
    primes: number[];
    phases: number[];
  };
  telemetry: {
    resonanceStrength: number;
    coherence: number;
    locality: number;
    entropy: number;
    nonLocalCorrelation: number;
    entanglementStrength: number;
  };
  entanglementState: 'disconnected' | 'initializing' | 'entangled' | 'separated';
  connectedNodes: number;
  sharedPhaseState: SharedPhaseState | null;
  globalAnnouncements: GlobalAnnouncement[];
  createdAt: string;
  updatedAt: string;
}

export interface RNETSession {
  id: string;
  spaceId: string;
  clientId: string;
  status: 'connecting' | 'active' | 'syncing' | 'disconnected';
  version: number;
  lastActivity: string;
  createdAt: string;
}

export interface RNETDelta {
  fromVersion: number;
  toVersion?: number;
  operations: Array<{
    type: 'update_phase' | 'update_amplitude' | 'sync_basis' | 'collapse_state';
    target: string;
    value: number | number[];
    metadata?: Record<string, unknown>;
  }>;
  timestamp: string;
  sessionId: string;
}

export interface SharedPhaseState {
  timestamp: number;
  phases: number[];
  entanglementId: string;
}

export interface GlobalAnnouncement {
  id: number;
  nodeOrigin: string;
  nodeName: string;
  message: string;
  timestamp: string;
  resonanceSignature: number[];
  entanglementStrength: number;
}

// FastFactor Types
export interface FastFactorRequest {
  number: string;
  config?: FastFactorConfig;
}

export interface FastFactorConfig {
  max_iterations?: number;
  resonance_threshold?: number;
  phase_coherence?: number;
  basis_set_size?: number;
  adaptive_thresholding?: boolean;
  parallel_processors?: number;
  timeout_seconds?: number;
  max_digits?: number;
}

export interface FastFactorResponse {
  number: string;
  factors: FactorInfo[];
  is_prime: boolean;
  is_complete: boolean;
  confidence: number;
  resonance_metrics: ResonanceMetrics;
  metrics: {
    entropy: number;
    plateauDetected: boolean;
    dominance?: number;
    resonanceStrength?: number;
    convergenceTime?: number;
    iterations?: number;
  };
  telemetry?: TelemetryPoint[];
  timing: FastFactorTimingInfo;
}

export interface FactorInfo {
  value: string;
  confidence: number;
  resonance_strength: number;
  phase_signature: number[];
  discovered_at: number;
}

export interface FastFactorTimingInfo {
  start_time: string;
  end_time: string;
  duration_ms: number;
  iterations: number;
}

export interface ResonanceMetrics {
  average_resonance: number;
  peak_resonance: number;
  coherence_strength: number;
  pattern_stability: number;
  quantum_interference: number;
}