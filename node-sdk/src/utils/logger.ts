// Logger utility for debugging and monitoring

// Simple debug function to avoid dependency issues
const createDebug = (namespace: string) => {
  return (message: string, data?: unknown) => {
    if (process.env.DEBUG || process.env.NOMYX_DEBUG) {
      const timestamp = new Date().toISOString();
      if (data !== undefined) {
        console.debug(`[${timestamp}] DEBUG ${namespace}: ${message}`, data);
      } else {
        console.debug(`[${timestamp}] DEBUG ${namespace}: ${message}`);
      }
    }
  };
};

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  /** Minimum log level to output */
  level?: LogLevel;
  /** Enable console output */
  console?: boolean;
  /** Custom log handler */
  handler?: (level: LogLevel, message: string, data?: unknown) => void;
  /** Logger namespace */
  namespace?: string;
}

/**
 * Logger class for SDK debugging
 */
export class Logger {
  private debugLogger: ReturnType<typeof createDebug>;
  private config: Required<LoggerConfig>;

  constructor(namespace: string = 'resonance-sdk', config: LoggerConfig = {}) {
    this.config = {
      level: config.level ?? LogLevel.INFO,
      console: config.console ?? true,
      handler: config.handler ?? this.defaultHandler.bind(this),
      namespace: config.namespace ?? namespace
    };

    this.debugLogger = createDebug(this.config.namespace);
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log info message
   */
  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log error message
   */
  error(message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, message, data);
  }

  /**
   * Log API request
   */
  logRequest(method: string, url: string, data?: unknown): void {
    this.debug(`→ ${method} ${url}`, data);
  }

  /**
   * Log API response
   */
  logResponse(method: string, url: string, status: number, data?: unknown): void {
    const level = status >= 400 ? LogLevel.WARN : LogLevel.DEBUG;
    this.log(level, `← ${method} ${url} ${status}`, data);
  }

  /**
   * Log WebSocket events
   */
  logWebSocket(event: string, spaceId?: string, data?: unknown): void {
    const message = spaceId ? `WS[${spaceId}] ${event}` : `WS ${event}`;
    this.debug(message, data);
  }

  /**
   * Log retry attempts
   */
  logRetry(attempt: number, maxRetries: number, error: Error): void {
    this.warn(`Retry attempt ${attempt}/${maxRetries}: ${error.message}`);
  }

  /**
   * Log performance metrics
   */
  logPerformance(operation: string, duration: number, metadata?: Record<string, unknown>): void {
    this.info(`Performance: ${operation} took ${duration}ms`, metadata);
  }

  /**
   * Create a child logger with additional namespace
   */
  child(namespace: string): Logger {
    return new Logger(`${this.config.namespace}:${namespace}`, this.config);
  }

  /**
   * Update logger configuration
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Check if log level is enabled
   */
  isLevelEnabled(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.isLevelEnabled(level)) {
      return;
    }

    // Use debug logger for debug level
    if (level === LogLevel.DEBUG) {
      if (data !== undefined) {
        this.debugLogger(message, data);
      } else {
        this.debugLogger(message);
      }
    }

    // Call custom handler
    this.config.handler(level, message, data);
  }

  /**
   * Default log handler
   */
  private defaultHandler(level: LogLevel, message: string, data?: unknown): void {
    if (!this.config.console) {
      return;
    }

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const prefix = `[${timestamp}] ${levelName} [${this.config.namespace}]`;
    const fullMessage = `${prefix} ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        // Debug messages are handled by the debug logger
        break;
      case LogLevel.INFO:
        if (data !== undefined) {
          console.info(fullMessage, data);
        } else {
          console.info(fullMessage);
        }
        break;
      case LogLevel.WARN:
        if (data !== undefined) {
          console.warn(fullMessage, data);
        } else {
          console.warn(fullMessage);
        }
        break;
      case LogLevel.ERROR:
        if (data !== undefined) {
          console.error(fullMessage, data);
        } else {
          console.error(fullMessage);
        }
        break;
    }
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Create a logger for a specific module
 */
export function createLogger(namespace: string, config?: LoggerConfig): Logger {
  return new Logger(namespace, config);
}

/**
 * Performance timer utility
 */
export class PerformanceTimer {
  private startTime: number;
  private marks: Map<string, number> = new Map();

  constructor(private logger: Logger, private operation: string) {
    this.startTime = performance.now();
  }

  /**
   * Mark a point in time
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * Get duration since start or since a mark
   */
  getDuration(since?: string): number {
    const now = performance.now();
    const start = since ? this.marks.get(since) ?? this.startTime : this.startTime;
    return now - start;
  }

  /**
   * Complete the timer and log the result
   */
  complete(metadata?: Record<string, unknown>): number {
    const duration = this.getDuration();
    
    const logData = {
      ...metadata,
      marks: Object.fromEntries(
        Array.from(this.marks.entries()).map(([name, time]) => [
          name,
          time - this.startTime
        ])
      )
    };

    this.logger.logPerformance(this.operation, duration, logData);
    return duration;
  }
}

/**
 * Create a performance timer
 */
export function createTimer(logger: Logger, operation: string): PerformanceTimer {
  return new PerformanceTimer(logger, operation);
}

/**
 * Decorator for timing method execution
 */
export function timed(logger?: Logger) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value as (...args: unknown[]) => unknown;
    const loggerInstance = logger ?? createLogger(`timer:${propertyKey}`);
    
    descriptor.value = async function (...args: unknown[]) {
      const timer = createTimer(loggerInstance, propertyKey);
      try {
        const result = await originalMethod.apply(this, args);
        timer.complete({ success: true });
        return result;
      } catch (error) {
        timer.complete({ success: false, error: error instanceof Error ? error.message : String(error) });
        throw error;
      }
    };
    
    return descriptor;
  };
}

/**
 * Log structured data in a consistent format
 */
export function logStructured(
  logger: Logger,
  level: LogLevel,
  event: string,
  data: Record<string, unknown>
): void {
  const structuredData = {
    event,
    timestamp: new Date().toISOString(),
    ...data
  };

  switch (level) {
    case LogLevel.DEBUG:
      logger.debug(event, structuredData);
      break;
    case LogLevel.INFO:
      logger.info(event, structuredData);
      break;
    case LogLevel.WARN:
      logger.warn(event, structuredData);
      break;
    case LogLevel.ERROR:
      logger.error(event, structuredData);
      break;
  }
}

/**
 * Create contextual loggers for different SDK components
 */
export const loggers = {
  core: createLogger('resonance-sdk:core'),
  api: createLogger('resonance-sdk:api'),
  rnet: createLogger('resonance-sdk:rnet'),
  sai: createLogger('resonance-sdk:sai'),
  engines: createLogger('resonance-sdk:engines'),
  realtime: createLogger('resonance-sdk:realtime'),
  retry: createLogger('resonance-sdk:retry'),
  validation: createLogger('resonance-sdk:validation')
};