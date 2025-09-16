// Error classes for the Nomyx Resonance SDK

/**
 * Base error class for all Resonance SDK errors
 */
export class ResonanceError extends Error {
  public readonly code: string;
  public readonly details?: unknown;
  public readonly retryable: boolean;

  constructor(
    code: string,
    message: string,
    details?: unknown,
    retryable: boolean = false
  ) {
    super(message);
    this.name = 'ResonanceError';
    this.code = code;
    this.details = details;
    this.retryable = retryable;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResonanceError);
    }
  }
}

/**
 * Space-specific error class
 */
export class SpaceError extends ResonanceError {
  public readonly spaceId: string | undefined;

  constructor(code: string, message: string, spaceId?: string, details?: unknown) {
    super(code, message, details);
    this.name = 'SpaceError';
    this.spaceId = spaceId;
  }
}

/**
 * Engine-specific error class
 */
export class EngineError extends ResonanceError {
  public readonly engineType: string | undefined;
  public readonly engineId: string | undefined;

  constructor(
    code: string,
    message: string,
    engineType?: string,
    engineId?: string,
    details?: unknown
  ) {
    super(code, message, details);
    this.name = 'EngineError';
    this.engineType = engineType;
    this.engineId = engineId;
  }
}

/**
 * Authentication error class
 */
export class AuthenticationError extends ResonanceError {
  constructor(message: string = 'Authentication failed', details?: unknown) {
    super('AUTHENTICATION_ERROR', message, details);
    this.name = 'AuthenticationError';
  }
}

/**
 * Rate limiting error class
 */
export class RateLimitError extends ResonanceError {
  public readonly retryAfter: number | undefined;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number, details?: unknown) {
    super('RATE_LIMITED', message, details, true);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Service unavailable error class
 */
export class ServiceUnavailableError extends ResonanceError {
  constructor(message: string = 'Service temporarily unavailable', details?: unknown) {
    super('SERVICE_UNAVAILABLE', message, details, true);
    this.name = 'ServiceUnavailableError';
  }
}

/**
 * Version conflict error class
 */
export class VersionConflictError extends SpaceError {
  public readonly currentVersion: number | undefined;
  public readonly expectedVersion: number | undefined;

  constructor(
    message: string = 'Version conflict detected',
    spaceId?: string,
    currentVersion?: number,
    expectedVersion?: number
  ) {
    super('VERSION_CONFLICT', message, spaceId);
    this.name = 'VersionConflictError';
    this.currentVersion = currentVersion;
    this.expectedVersion = expectedVersion;
  }
}

/**
 * Network error class
 */
export class NetworkError extends ResonanceError {
  constructor(message: string = 'Network request failed', details?: unknown) {
    super('NETWORK_ERROR', message, details, true);
    this.name = 'NetworkError';
  }
}

/**
 * Validation error class
 */
export class ValidationError extends ResonanceError {
  public readonly field: string | undefined;

  constructor(message: string, field?: string, details?: unknown) {
    super('VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Configuration error class
 */
export class ConfigurationError extends ResonanceError {
  constructor(message: string, details?: unknown) {
    super('CONFIGURATION_ERROR', message, details);
    this.name = 'ConfigurationError';
  }
}

/**
 * Quantum simulation error class
 */
export class QuantumError extends EngineError {
  public readonly quantumState: string | undefined;

  constructor(
    message: string,
    quantumState?: string,
    engineId?: string,
    details?: unknown
  ) {
    super('QUANTUM_ERROR', message, 'quantum', engineId, details);
    this.name = 'QuantumError';
    this.quantumState = quantumState;
  }
}

/**
 * Type guard to check if error is a ResonanceError
 */
export function isResonanceError(error: unknown): error is ResonanceError {
  return error instanceof ResonanceError;
}

/**
 * Type guard to check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  return isResonanceError(error) && error.retryable;
}

/**
 * Create appropriate error from HTTP response
 */
export function createErrorFromResponse(
  status: number,
  data: { error?: string; message?: string; code?: string },
  details?: unknown
): ResonanceError {
  const message = data.message || data.error || 'Unknown error';
  const code = data.code || `HTTP_${status}`;

  switch (status) {
    case 401:
      return new AuthenticationError(message, details);
    case 409:
      return new VersionConflictError(message, undefined, undefined, undefined);
    case 422:
      return new ValidationError(message, undefined, details);
    case 429:
      return new RateLimitError(message, undefined, details);
    case 503:
      return new ServiceUnavailableError(message, details);
    default:
      return new ResonanceError(code, message, details, status >= 500);
  }
}