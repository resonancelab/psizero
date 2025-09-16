// Types for all specialized engines

import { BaseEntity, QuantumGateType, ComplexityClass, HexagramName } from '../core/types';

/**
 * Common engine response interface
 */
export interface EngineResponse {
  /** Execution time in milliseconds */
  executionTime: number;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

// ===============================
// SRS (Symbolic Resonance System) Types
// ===============================

/**
 * Problem types supported by SRS
 */
export type ProblemType = 
  | '3-sat' 
  | 'traveling-salesman' 
  | 'knapsack' 
  | 'graph-coloring' 
  | 'vertex-cover' 
  | 'clique' 
  | 'optimization'
  | 'hypothesis-testing'
  | 'hypothesis-verification';

/**
 * SRS problem definition
 */
export interface SRSProblem {
  /** Problem type */
  type: ProblemType;
  /** Problem variables */
  variables?: string[];
  /** Problem clauses (for SAT problems) */
  clauses?: string[][];
  /** Distance matrix (for TSP) */
  distances?: number[][];
  /** Cities count (for TSP) */
  cities?: number;
  /** Start city (for TSP) */
  startCity?: number;
  /** Optimization objective */
  objective?: 'minimize' | 'maximize';
  /** Optimization constraints */
  constraints?: unknown[];
  /** Hypothesis text (for hypothesis problems) */
  hypothesis?: string;
  /** Methodology (for hypothesis problems) */
  methodology?: string;
  /** Semantic context */
  semanticContext?: number[];
}

/**
 * SRS solution result
 */
export interface SRSSolution extends EngineResponse {
  /** Problem ID */
  problemId: string;
  /** Whether problem is satisfiable/solvable */
  satisfiable: boolean;
  /** Solution assignment */
  assignment?: boolean[] | number[];
  /** Solution path (for TSP) */
  path?: number[];
  /** Solution value */
  value?: number;
  /** Complexity class */
  complexity: ComplexityClass;
  /** Prime factorization used */
  primeFactorization?: number[];
  /** Quantum acceleration factor */
  quantumAcceleration?: number;
}

// ===============================
// HQE (Holographic Quantum Encoder) Types
// ===============================

/**
 * Encoding types supported by HQE
 */
export type EncodingType = 'utf-8' | 'ascii' | 'base64' | 'binary' | 'hex' | 'quantum';

/**
 * HQE data input for encoding
 */
export interface HQEData {
  /** Data type */
  type: 'text' | 'binary' | 'numeric' | 'image' | 'structured';
  /** Data content */
  content: string | Buffer | number[] | Record<string, unknown>;
  /** Text encoding (for text data) */
  encoding?: EncodingType;
  /** Precision (for numeric data) */
  precision?: number;
  /** Image format (for image data) */
  format?: string;
  /** Image dimensions (for image data) */
  dimensions?: { width: number; height: number };
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * HQE encoding result
 */
export interface HQEEncoding extends EngineResponse {
  /** Encoding ID */
  encodingId: string;
  /** Holographic layers count */
  holographicLayers: number;
  /** Encoded quantum state */
  quantumState: number[];
  /** Compression ratio achieved */
  compressionRatio: number;
  /** Encoding fidelity */
  fidelity: number;
  /** Quantum entanglement measure */
  quantumEntanglement?: number;
  /** Holographic pattern data */
  holographicData: string;
  /** Original data size */
  originalSize: number;
  /** Encoded data size */
  encodedSize: number;
}

/**
 * HQE decoding result
 */
export interface HQEDecoding extends EngineResponse {
  /** Decoding ID */
  decodingId: string;
  /** Whether decoding was successful */
  success: boolean;
  /** Decoded content */
  content: string | Buffer | number[] | Record<string, unknown>;
  /** Data type */
  type: 'text' | 'binary' | 'numeric' | 'image' | 'structured';
  /** Decoding fidelity */
  fidelity: number;
  /** Data integrity check */
  integrityCheck: boolean;
  /** Reconstruction accuracy */
  accuracy?: number;
}

/**
 * Holographic pattern for multiple data sources
 */
export interface HolographicPattern {
  /** Pattern ID */
  patternId: string;
  /** Number of interference layers */
  layers: number;
  /** Reference beam data */
  referenceBeam: number[];
  /** Object beam data */
  objectBeam: number[];
  /** Interference pattern */
  interferencePattern: number[];
  /** Pattern metadata */
  metadata: Record<string, unknown>;
  /** Source count */
  sourceCount: number;
}

/**
 * Quantum system configuration
 */
export interface QuantumSystem {
  /** Number of qubits */
  qubits: number;
  /** Initial quantum state */
  initialState: string;
  /** Quantum gates to apply */
  gates?: QuantumGate[];
  /** Semantic encoding (optional) */
  semanticEncoding?: number[];
  /** Optimization target */
  optimization?: string;
  /** City distances for TSP optimization */
  cityDistances?: number[][];
}

/**
 * Quantum gate definition
 */
export interface QuantumGate {
  /** Gate type */
  type: QuantumGateType;
  /** Target qubit */
  target: number;
  /** Control qubit (for controlled gates) */
  control?: number;
  /** Rotation angle (for rotation gates) */
  angle?: number;
}

/**
 * Measurement configuration
 */
export interface MeasurementConfig {
  /** Observables to measure */
  observables: string[];
  /** Number of measurement shots */
  shots: number;
  /** Measurement basis */
  basis?: string[];
}

/**
 * Holographic encoding configuration
 */
export interface HolographicConfig {
  /** Encoding type */
  encoding: 'surface-code' | 'color-code' | 'topological';
  /** Error correction enabled */
  errorCorrection: boolean;
  /** Encoding parameters */
  parameters?: Record<string, unknown>;
}

/**
 * HQE simulation result
 */
export interface HQESimulation extends EngineResponse {
  /** Simulation ID */
  simulationId: string;
  /** Final quantum state */
  finalState: number[][];
  /** Measurement results */
  measurements?: Record<string, number>;
  /** Entanglement measure */
  entanglement: number;
  /** Quantum coherence */
  coherence: number;
  /** Fidelity of simulation */
  fidelity: number;
  /** Holographic encoding result */
  holographicEncoding?: string;
  /** Quantum volume achieved */
  quantumVolume?: number;
  /** Speedup factor */
  speedup?: number;
}

// ===============================
// QSEM (Quantum Semantic Engine) Types
// ===============================

/**
 * Semantic encoding request
 */
export interface SemanticEncoding {
  /** Text to encode */
  text: string;
  /** Prime basis for encoding */
  basis: number[];
  /** Encoding type */
  type?: 'transformer-quantum' | 'holographic' | 'prime-vector';
  /** Vector dimension */
  dimension?: number;
  /** Normalization method */
  normalization?: 'unit-sphere' | 'l2-norm' | 'softmax';
  /** Analysis type */
  analysis?: 'semantic-structure' | 'deep-semantic' | 'contextual';
}

/**
 * Semantic encoding result
 */
export interface SemanticEncodingResult extends EngineResponse {
  /** Encoded vector */
  vector: number[];
  /** Prime basis used */
  basis: number[];
  /** Semantic type */
  semantic: string;
  /** Resonance score */
  resonanceScore: number;
  /** Encoding confidence */
  confidence?: number;
  /** Contextual information */
  context?: Record<string, unknown>;
}

/**
 * Resonance computation request
 */
export interface ResonanceComputation {
  /** First text */
  text1: string;
  /** Second text */
  text2: string;
  /** Metric to use */
  metric: 'cosine-quantum' | 'euclidean-prime' | 'resonance-distance';
  /** Prime basis */
  basis: number[];
  /** Additional parameters */
  parameters?: Record<string, unknown>;
}

/**
 * Resonance computation result
 */
export interface ResonanceResult extends EngineResponse {
  /** Resonance score (0-1) */
  resonance: number;
  /** Distance measure */
  distance: number;
  /** Similarity score */
  similarity: number;
  /** Prime correlation */
  primeCorrelation: number[];
}

// ===============================
// NLC (Non-Local Communication) Types
// ===============================

/**
 * Communication session configuration
 */
export interface CommunicationSession {
  /** Session participants */
  participants: string[];
  /** Communication protocol */
  protocol: 'quantum-entanglement' | 'prime-resonance' | 'holographic-link';
  /** Security settings */
  security: SecurityConfig;
  /** Session parameters */
  parameters?: Record<string, unknown>;
}

/**
 * Security configuration
 */
export interface SecurityConfig {
  /** Encryption method */
  encryption: 'quantum-key-distribution' | 'prime-encryption' | 'holographic-cipher';
  /** Authentication method */
  authentication: 'prime-signature' | 'quantum-signature' | 'biometric-resonance';
  /** Additional security parameters */
  parameters?: Record<string, unknown>;
}

/**
 * Communication session result
 */
export interface CommunicationSessionResult extends EngineResponse {
  /** Session ID */
  sessionId: string;
  /** Channel ID */
  channelId: string;
  /** Entanglement status */
  entangled: boolean;
  /** Communication latency in seconds */
  latency: number;
  /** Security level */
  securityLevel: 'low' | 'medium' | 'high' | 'quantum';
}

/**
 * Message transmission request
 */
export interface MessageTransmission {
  /** Message content */
  content: string;
  /** Encoding method */
  encoding: 'quantum-superposition' | 'prime-basis' | 'holographic';
  /** Entanglement configuration */
  entanglement: EntanglementConfig;
  /** Priority level */
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

/**
 * Entanglement configuration
 */
export interface EntanglementConfig {
  /** Prime basis */
  basis: number[];
  /** Coherence level */
  coherence: number;
  /** Entanglement strength */
  strength?: number;
}

// ===============================
// QCR (Quantum Consciousness Resonance) Types
// ===============================

/**
 * Observer configuration
 */
export interface ObserverConfig {
  /** Observer type */
  type: 'artificial' | 'human' | 'quantum' | 'hybrid';
  /** Complexity level */
  complexity: 'low' | 'medium' | 'high' | 'superintelligent';
  /** Awareness level */
  awareness: number; // 0-1 scale
  /** Observer parameters */
  parameters?: Record<string, unknown>;
}

/**
 * Quantum system for consciousness
 */
export interface ConsciousnessSystem {
  /** Quantum states involved */
  quantumStates: string[];
  /** Decoherence rate */
  decoherence: number;
  /** System complexity */
  complexity?: number;
  /** Entanglement network */
  entanglementNetwork?: string[];
}

/**
 * QCR session result
 */
export interface QCRSession extends EngineResponse {
  /** Session ID */
  sessionId: string;
  /** Consciousness level measured */
  consciousnessLevel: number;
  /** Observer effect detected */
  observerEffect: 'none' | 'detected' | 'strong' | 'quantum-collapse';
  /** Quantum coherence */
  quantumCoherence: number;
  /** Resonance pattern */
  resonancePattern?: number[];
}

/**
 * Quantum observation request
 */
export interface QuantumObservation {
  /** Subject being observed */
  subject: string;
  /** Observer description */
  observer: string;
  /** Entanglement with system */
  entanglement?: number;
  /** Measurement type */
  measurement: MeasurementType;
  /** Expected effects */
  effect: ObservationEffect;
}

/**
 * Measurement types
 */
export interface MeasurementType {
  /** Observable being measured */
  observable: string;
  /** Measurement basis */
  basis: string;
  /** Precision required */
  precision?: number;
}

/**
 * Observation effects
 */
export interface ObservationEffect {
  /** Whether to collapse wave function */
  collapse: boolean;
  /** Feedback mechanism */
  feedback: 'auto' | 'manual' | 'delayed';
  /** Effect strength */
  strength?: number;
}

// ===============================
// I-Ching (Quantum Oracle) Types
// ===============================

/**
 * Hexagram information
 */
export interface Hexagram {
  /** Primary hexagram */
  primary: HexagramName;
  /** Transformed hexagram */
  transformed?: HexagramName;
  /** Line values (6-9 traditional) */
  lines: number[];
  /** Changing lines */
  changingLines?: number[];
}

/**
 * Quantum dynamics for evolution
 */
export interface QuantumDynamics {
  /** Probability calculation method */
  probability: 'quantum-tunnel' | 'resonance-field' | 'prime-basis';
  /** Resonance frequencies */
  resonance: number[];
  /** Time evolution steps */
  timeSteps: number;
  /** Quantum noise level */
  noise?: number;
}

/**
 * Oracle interpretation modes
 */
export interface InterpretationMode {
  /** Include symbolic interpretation */
  symbolic: boolean;
  /** Include probabilistic analysis */
  probabilistic: boolean;
  /** Include quantum mechanical aspects */
  quantum: boolean;
  /** Custom interpretation parameters */
  parameters?: Record<string, unknown>;
}

/**
 * I-Ching evolution result
 */
export interface IChingEvolution extends EngineResponse {
  /** Final hexagram state */
  final: Hexagram;
  /** Quantum probability */
  probability: number;
  /** Resonance strength */
  resonance: number;
  /** Interpretation text */
  meaning?: string;
  /** Evolution path */
  evolutionPath?: Hexagram[];
  /** Quantum coherence during evolution */
  coherence?: number;
}

// ===============================
// Unified Physics Engine Types
// ===============================

/**
 * Mass configuration for gravitational computation
 */
export interface Mass {
  /** Mass value in kg */
  value: number;
  /** Position in space [x, y, z] */
  position: number[];
  /** Velocity vector (optional) */
  velocity?: number[];
}

/**
 * Gravitational field computation request
 */
export interface GravitationalComputation {
  /** Array of masses */
  masses: Mass[];
  /** Test point for field calculation */
  testPoint: number[];
  /** Relativity configuration */
  relativity?: RelativityConfig;
  /** Computation precision */
  precision?: 'low' | 'medium' | 'high' | 'ultra';
}

/**
 * Relativity configuration
 */
export interface RelativityConfig {
  /** Enable relativistic effects */
  enabled: boolean;
  /** Precision level */
  precision: 'low' | 'medium' | 'high';
  /** Effects to include */
  effects: RelativisticEffect[];
}

/**
 * Relativistic effects
 */
export type RelativisticEffect = 
  | 'time-dilation' 
  | 'length-contraction' 
  | 'gravitational-redshift'
  | 'frame-dragging'
  | 'geodetic-precession';

/**
 * Unified physics result
 */
export interface UnifiedPhysicsResult extends EngineResponse {
  /** Gravitational field vector */
  gravitationalField: {
    /** Field strength */
    strength: number;
    /** Field direction [x, y, z] */
    direction: number[];
    /** Spacetime curvature */
    curvature: number;
  };
  /** Spacetime metric tensor */
  spacetimeMetric: number[][];
  /** Energy-momentum tensor */
  energyMomentum?: number[][];
  /** Field equations solution */
  fieldSolution?: Record<string, number>;
}

/**
 * Hypothesis validation request
 */
export interface HypothesisValidation {
  /** Hypothesis text */
  hypothesis: string;
  /** Theoretical framework */
  framework: 'general-relativity' | 'quantum-field-theory' | 'unified-field-theory' | 'string-theory';
  /** Validation parameters */
  parameters?: Record<string, unknown>;
}