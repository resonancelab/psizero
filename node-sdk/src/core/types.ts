// Core type definitions for the Nomyx Resonance SDK

/**
 * Main SDK configuration interface
 */
export interface ResonanceClientConfig {
  /** API key for authentication */
  apiKey: string;
  /** Base URL for the API (optional) */
  baseURL?: string;
  /** Environment setting */
  environment?: 'production' | 'sandbox';
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Number of retry attempts */
  retries?: number;
  /** Enable debug logging */
  debug?: boolean;
  /** Real-time configuration */
  realtime?: RealtimeConfig;
}

/**
 * Real-time configuration options
 */
export interface RealtimeConfig {
  /** WebSocket URL override */
  websocketURL?: string;
  /** Number of reconnect attempts */
  reconnectAttempts?: number;
  /** Heartbeat interval in milliseconds */
  heartbeatInterval?: number;
}

/**
 * Prime basis for quantum calculations
 */
export interface PrimeBasis {
  /** Array of prime numbers */
  primes: number[];
  /** Dimensional space */
  dimension: number;
  /** Encoding type */
  encoding?: 'standard' | 'quantum' | 'holographic';
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

/**
 * Base entity interface
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User information
 */
export interface User extends BaseEntity {
  email: string;
  displayName: string;
  role: 'admin' | 'user' | 'researcher';
}

/**
 * Member role in spaces
 */
export type MemberRole = 'owner' | 'admin' | 'writer' | 'reader' | 'observer';

/**
 * Member permissions
 */
export type Permission = 'read' | 'write' | 'admin' | 'delete' | 'invite' | 'moderate';


/**
 * Quantum state representation
 */
export interface QuantumState {
  /** State vector coefficients */
  amplitudes: number[][];
  /** Measurement basis */
  basis: string[];
  /** Entanglement information */
  entanglement?: number;
  /** Coherence measure */
  coherence?: number;
}

/**
 * Resonance metrics
 */
export interface ResonanceMetrics {
  /** Resonance score (0-1) */
  resonance: number;
  /** Coherence measure */
  coherence: number;
  /** Entanglement strength */
  entanglement: number;
  /** Quantum volume */
  volume?: number;
  /** Computational complexity */
  complexity?: string;
}

/**
 * Telemetry data structure
 */
export interface TelemetryData {
  /** Timestamp of measurement */
  timestamp: string;
  /** Resonance metrics */
  metrics: ResonanceMetrics;
  /** System status */
  status: 'active' | 'idle' | 'error';
  /** Performance data */
  performance: {
    latency: number;
    throughput: number;
    errorRate: number;
  };
}

/**
 * Event types for real-time communication
 */
export type EventType = 
  | 'delta' 
  | 'telemetry' 
  | 'member_joined' 
  | 'member_left' 
  | 'collapse' 
  | 'error';

/**
 * Real-time event structure
 */
export interface RealtimeEvent {
  type: EventType;
  data: any;
  timestamp: string;
  source: string;
}

/**
 * Training job status
 */
export type JobStatus = 'queued' | 'starting' | 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * Engine types
 */
export type EngineType = 
  | 'text-generation'
  | 'embeddings' 
  | 'classification'
  | 'quantum-enhanced'
  | 'research-assistant';

/**
 * Quantum gate types
 */
export type QuantumGateType = 
  | 'H' | 'X' | 'Y' | 'Z' 
  | 'CNOT' | 'CZ' | 'SWAP'
  | 'RX' | 'RY' | 'RZ'
  | 'Toffoli' | 'Fredkin';

/**
 * Problem complexity classes
 */
export type ComplexityClass = 'P' | 'NP' | 'NP-Complete' | 'NP-Hard' | 'PSPACE' | 'EXPTIME';

/**
 * I-Ching hexagram names
 */
export type HexagramName = 
  | 'QIAN_HEAVEN' | 'KUN_EARTH' | 'ZHUN_DIFFICULTY' | 'MENG_YOUTHFUL_FOLLY'
  | 'XU_WAITING' | 'SONG_CONFLICT' | 'SHI_ARMY' | 'BI_HOLDING_TOGETHER'
  // ... (other hexagrams would be listed here)
  ;

/**
 * Generic callback function type
 */
export type CallbackFunction<T = any> = (data: T) => void;

/**
 * Error callback function type
 */
export type ErrorCallback = (error: Error) => void;

/**
 * Promise-based callback type
 */
export type AsyncCallbackFunction<T = any> = (data: T) => Promise<void>;