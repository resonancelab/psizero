// Retry utility functions

import { RETRY_CONFIG } from '../core/constants';
import { ResonanceError } from '../core/errors';

/**
 * Retry configuration options
 */
export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Initial delay between retries in milliseconds */
  initialDelay?: number;
  /** Maximum delay between retries in milliseconds */
  maxDelay?: number;
  /** Backoff factor for exponential backoff */
  backoffFactor?: number;
  /** Whether to add jitter to delays */
  jitter?: boolean;
  /** Custom retry condition function */
  retryCondition?: (error: Error, attempt: number) => boolean;
  /** Called before each retry attempt */
  onRetry?: (error: Error, attempt: number) => void;
}

/**
 * Default retry condition - retries on network errors and 5xx status codes
 */
const defaultRetryCondition = (error: Error): boolean => {
  if (error instanceof ResonanceError) {
    return error.retryable;
  }
  
  // Retry on network errors
  if (error.message.includes('network') || error.message.includes('timeout')) {
    return true;
  }
  
  return false;
};

/**
 * Calculate delay with exponential backoff and optional jitter
 */
const calculateDelay = (
  attempt: number, 
  initialDelay: number, 
  maxDelay: number, 
  backoffFactor: number, 
  jitter: boolean
): number => {
  let delay = initialDelay * Math.pow(backoffFactor, attempt - 1);
  delay = Math.min(delay, maxDelay);
  
  if (jitter) {
    // Add random jitter ±25%
    const jitterAmount = delay * 0.25;
    delay += (Math.random() - 0.5) * 2 * jitterAmount;
  }
  
  return Math.max(delay, 0);
};

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = {
    maxRetries: options.maxRetries ?? RETRY_CONFIG.MAX_RETRIES,
    initialDelay: options.initialDelay ?? RETRY_CONFIG.INITIAL_DELAY,
    maxDelay: options.maxDelay ?? RETRY_CONFIG.MAX_DELAY,
    backoffFactor: options.backoffFactor ?? RETRY_CONFIG.BACKOFF_FACTOR,
    jitter: options.jitter ?? RETRY_CONFIG.JITTER,
    retryCondition: options.retryCondition ?? defaultRetryCondition,
    onRetry: options.onRetry
  };

  let lastError: Error = new Error('Unknown error');
  
  for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on the last attempt
      if (attempt > config.maxRetries) {
        break;
      }
      
      // Check if we should retry this error
      if (!config.retryCondition(lastError, attempt)) {
        break;
      }
      
      // Call onRetry callback if provided
      if (config.onRetry) {
        config.onRetry(lastError, attempt);
      }
      
      // Calculate delay and wait
      const delay = calculateDelay(
        attempt,
        config.initialDelay,
        config.maxDelay,
        config.backoffFactor,
        config.jitter
      );
      
      await sleep(delay);
    }
  }
  
  throw lastError;
}

/**
 * Retry with a specific number of attempts
 */
export async function retryWithAttempts<T>(
  fn: () => Promise<T>,
  attempts: number,
  delay: number = 1000
): Promise<T> {
  return retry(fn, {
    maxRetries: attempts - 1,
    initialDelay: delay,
    backoffFactor: 1, // Linear delay
    jitter: false
  });
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  backoffFactor: number = 2
): Promise<T> {
  return retry(fn, {
    maxRetries,
    initialDelay,
    backoffFactor,
    jitter: true
  });
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a retry decorator for class methods
 */
export function retryable(options: RetryOptions = {}) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value as (...args: unknown[]) => Promise<unknown>;
    
    descriptor.value = async function (...args: unknown[]) {
      return retry(() => originalMethod.apply(this, args), options);
    };
    
    return descriptor;
  };
}

/**
 * Circuit breaker state
 */
export type CircuitBreakerState = 'closed' | 'open' | 'half-open';

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerOptions {
  /** Number of failures before opening the circuit */
  failureThreshold?: number;
  /** Time to wait before trying to close the circuit */
  resetTimeout?: number;
  /** Number of successful calls needed to close the circuit from half-open */
  successThreshold?: number;
  /** Monitor function called on state changes */
  onStateChange?: (state: CircuitBreakerState) => void;
}

/**
 * Circuit breaker pattern implementation
 */
export class CircuitBreaker<T extends unknown[], R> {
  private state: CircuitBreakerState = 'closed';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  
  constructor(
    private fn: (...args: T) => Promise<R>,
    private options: CircuitBreakerOptions = {}
  ) {
    this.options = {
      failureThreshold: 5,
      resetTimeout: 60000,
      successThreshold: 2,
      ...options
    };
  }

  async execute(...args: T): Promise<R> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime >= this.options.resetTimeout!) {
        this.state = 'half-open';
        this.successCount = 0;
        this.notifyStateChange();
      } else {
        throw new ResonanceError('CIRCUIT_BREAKER_OPEN', 'Circuit breaker is open');
      }
    }

    try {
      const result = await this.fn(...args);
      
      if (this.state === 'half-open') {
        this.successCount++;
        if (this.successCount >= this.options.successThreshold!) {
          this.state = 'closed';
          this.failureCount = 0;
          this.notifyStateChange();
        }
      } else if (this.state === 'closed') {
        this.failureCount = 0;
      }
      
      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      
      if (this.state === 'closed' && this.failureCount >= this.options.failureThreshold!) {
        this.state = 'open';
        this.notifyStateChange();
      } else if (this.state === 'half-open') {
        this.state = 'open';
        this.notifyStateChange();
      }
      
      throw error;
    }
  }

  getState(): CircuitBreakerState {
    return this.state;
  }

  getFailureCount(): number {
    return this.failureCount;
  }

  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
    this.notifyStateChange();
  }

  private notifyStateChange(): void {
    if (this.options.onStateChange) {
      this.options.onStateChange(this.state);
    }
  }
}

/**
 * Create a circuit breaker for a function
 */
export function circuitBreaker<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  options: CircuitBreakerOptions = {}
): CircuitBreaker<T, R> {
  return new CircuitBreaker(fn, options);
}