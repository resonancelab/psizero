// Constants for the Nomyx Resonance SDK

/**
 * Default API configuration
 */
export const DEFAULT_CONFIG = {
  BASE_URL: 'https://api.nomyx.dev',
  TIMEOUT: 30000,
  RETRIES: 3,
  RATE_LIMIT_PER_SECOND: 10,
  WEBSOCKET_URL: 'wss://rt.nomyx.dev',
  RECONNECT_ATTEMPTS: 5,
  HEARTBEAT_INTERVAL: 30000,
} as const;

/**
 * API version information
 */
export const API_VERSION = {
  CURRENT: 'v1',
  SUPPORTED: ['v1'],
} as const;

/**
 * SDK metadata
 */
export const SDK_INFO = {
  NAME: '@nomyx/resonance-sdk',
  VERSION: '1.0.0',
  USER_AGENT: '@nomyx/resonance-sdk/1.0.0',
} as const;

/**
 * HTTP headers
 */
export const HEADERS = {
  CONTENT_TYPE: 'application/json',
  USER_AGENT: 'User-Agent',
  API_KEY: 'X-API-Key',
  AUTHORIZATION: 'Authorization',
} as const;

/**
 * WebSocket event types
 */
export const WS_EVENTS = {
  OPEN: 'open',
  CLOSE: 'close',
  ERROR: 'error',
  MESSAGE: 'message',
  DELTA: 'delta',
  TELEMETRY: 'telemetry',
  MEMBER_JOINED: 'member_joined',
  MEMBER_LEFT: 'member_left',
  COLLAPSE: 'collapse',
} as const;

/**
 * Error codes
 */
export const ERROR_CODES = {
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  VERSION_CONFLICT: 'VERSION_CONFLICT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  QUANTUM_ERROR: 'QUANTUM_ERROR',
  ENGINE_ERROR: 'ENGINE_ERROR',
  SPACE_ERROR: 'SPACE_ERROR',
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Prime numbers for quantum calculations
 */
export const PRIMES = {
  SMALL: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
  MEDIUM: [31, 37, 41, 43, 47, 53, 59, 61, 67, 71],
  LARGE: [73, 79, 83, 89, 97, 101, 103, 107, 109, 113],
  QUANTUM: [127, 131, 137, 139, 149, 151, 157, 163, 167, 173],
} as const;

/**
 * Engine types
 */
export const ENGINE_TYPES = {
  SRS: 'srs',
  HQE: 'hqe', 
  QSEM: 'qsem',
  NLC: 'nlc',
  QCR: 'qcr',
  ICHING: 'iching',
  UNIFIED: 'unified',
  SAI: 'sai',
  RNET: 'rnet',
} as const;

/**
 * Space visibility levels
 */
export const SPACE_VISIBILITY = {
  PRIVATE: 'private',
  SHARED: 'shared',
  PUBLIC: 'public',
} as const;

/**
 * Member roles
 */
export const MEMBER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  WRITER: 'writer',
  READER: 'reader',
  OBSERVER: 'observer',
} as const;

/**
 * Permissions
 */
export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin',
  DELETE: 'delete',
  INVITE: 'invite',
  MODERATE: 'moderate',
} as const;

/**
 * Job statuses
 */
export const JOB_STATUS = {
  QUEUED: 'queued',
  STARTING: 'starting',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

/**
 * Quantum gate types
 */
export const QUANTUM_GATES = {
  H: 'H',
  X: 'X',
  Y: 'Y',
  Z: 'Z',
  CNOT: 'CNOT',
  CZ: 'CZ',
  SWAP: 'SWAP',
  RX: 'RX',
  RY: 'RY',
  RZ: 'RZ',
  TOFFOLI: 'Toffoli',
  FREDKIN: 'Fredkin',
} as const;

/**
 * I-Ching hexagrams
 */
export const HEXAGRAMS = {
  QIAN_HEAVEN: 'QIAN_HEAVEN',
  KUN_EARTH: 'KUN_EARTH',
  ZHUN_DIFFICULTY: 'ZHUN_DIFFICULTY',
  MENG_YOUTHFUL_FOLLY: 'MENG_YOUTHFUL_FOLLY',
  XU_WAITING: 'XU_WAITING',
  SONG_CONFLICT: 'SONG_CONFLICT',
  SHI_ARMY: 'SHI_ARMY',
  BI_HOLDING_TOGETHER: 'BI_HOLDING_TOGETHER',
} as const;

/**
 * Complexity classes
 */
export const COMPLEXITY_CLASSES = {
  P: 'P',
  NP: 'NP',
  NP_COMPLETE: 'NP-Complete',
  NP_HARD: 'NP-Hard',
  PSPACE: 'PSPACE',
  EXPTIME: 'EXPTIME',
} as const;

/**
 * Encoding types
 */
export const ENCODING_TYPES = {
  STANDARD: 'standard',
  QUANTUM: 'quantum',
  HOLOGRAPHIC: 'holographic',
} as const;

/**
 * Default retry configuration
 */
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 30000,
  BACKOFF_FACTOR: 2,
  JITTER: true,
} as const;

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT_CONFIG = {
  DEFAULT_RATE: 10,
  BURST_RATE: 50,
  WINDOW_SIZE: 1000, // 1 second
} as const;