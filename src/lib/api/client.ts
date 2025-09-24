import {
  ApiClientConfig,
  ApiRequestConfig,
  ApiResponse,
  ApiError,
  ApiKeyConfig
} from './types';

// Debug flag - set to false for production
const DEBUG_MODE = true;

// Circuit breaker for failing services
interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

class CircuitBreaker {
  private services: Map<string, CircuitBreakerState> = new Map();
  private readonly failureThreshold = 5; // Allow more failures before circuit breaking
  private readonly recoveryTimeout = 30000; // Reduced to 30 seconds
  private readonly requestTimeout = 30000; // Increased to 30 seconds

  shouldAllowRequest(serviceName: string): boolean {
    const state = this.getServiceState(serviceName);
    
    switch (state.state) {
      case 'CLOSED':
        return true;
      case 'OPEN':
        if (Date.now() - state.lastFailureTime > this.recoveryTimeout) {
          this.setServiceState(serviceName, { ...state, state: 'HALF_OPEN' });
          return true;
        }
        return false;
      case 'HALF_OPEN':
        return true;
      default:
        return true;
    }
  }

  recordSuccess(serviceName: string): void {
    this.setServiceState(serviceName, {
      failures: 0,
      lastFailureTime: 0,
      state: 'CLOSED'
    });
  }

  recordFailure(serviceName: string): void {
    const state = this.getServiceState(serviceName);
    const newFailures = state.failures + 1;
    
    this.setServiceState(serviceName, {
      failures: newFailures,
      lastFailureTime: Date.now(),
      state: newFailures >= this.failureThreshold ? 'OPEN' : state.state
    });
  }

  getServiceHealth(serviceName: string): { healthy: boolean; failures: number; state: string } {
    const state = this.getServiceState(serviceName);
    return {
      healthy: state.state === 'CLOSED',
      failures: state.failures,
      state: state.state
    };
  }

  private getServiceState(serviceName: string): CircuitBreakerState {
    return this.services.get(serviceName) || {
      failures: 0,
      lastFailureTime: 0,
      state: 'CLOSED'
    };
  }

  private setServiceState(serviceName: string, state: CircuitBreakerState): void {
    this.services.set(serviceName, state);
  }
}

// Request throttling and resource management
class RequestThrottler {
  private pendingRequests: Map<string, number> = new Map();
  private quantumPendingCount = 0;
  private globalPendingCount = 0;
  private lastRequestTimes: Map<string, number> = new Map();

  // Minimal delays since backend is fast and working
  private readonly serviceDelays: Map<string, number> = new Map([
    ['iching', 1000],   // 1s delay
    ['nlc', 500],       // 0.5s delay
    ['qsem', 500],      // 0.5s delay
    ['hqe', 1000],      // 1s delay
    ['unified', 1000],  // 1s delay
    ['qcr', 500],       // 0.5s delay
    ['srs', 500],       // 0.5s delay
    ['sai', 500]        // 0.5s delay
  ]);

  private readonly maxConcurrentPerService = 3; // Allow 3 concurrent requests per service

  // Quantum services
  private readonly quantumServices = new Set(['hqe', 'qsem', 'iching', 'nlc', 'qcr', 'srs', 'unified']);
  
  // App services that should never be throttled
  private readonly appServices = new Set(['dashboard', 'auth', 'billing', 'organizations', 'api-keys', 'usage', 'plans', 'health', 'unknown']);

  async throttleRequest<T>(serviceName: string, requestFn: () => Promise<T>): Promise<T> {
    const isQuantumService = this.quantumServices.has(serviceName);
    const isAppService = this.appServices.has(serviceName);
    
    if (isAppService) {
      // No throttling for app services
    } else if (isQuantumService) {
      // Apply strict throttling to prevent backend errors
      const currentPending = this.pendingRequests.get(serviceName) || 0;
      if (currentPending >= this.maxConcurrentPerService) {
        throw new Error(`Service ${serviceName} busy - preventing backend overload`);
      }

      // Enforce service-specific delays
      const requiredDelay = this.serviceDelays.get(serviceName) || 1000;
      const lastRequestTime = this.lastRequestTimes.get(serviceName) || 0;
      const timeSinceLastRequest = Date.now() - lastRequestTime;
      
      if (timeSinceLastRequest < requiredDelay) {
        const waitTime = requiredDelay - timeSinceLastRequest;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      this.lastRequestTimes.set(serviceName, Date.now());
      this.pendingRequests.set(serviceName, currentPending + 1);
    }

    // Track pending requests
    if (isQuantumService) {
      this.quantumPendingCount++;
    }
    this.globalPendingCount++;

    try {
      const result = await requestFn();
      return result;
    } finally {
      // Cleanup pending requests
      if (isQuantumService) {
        this.quantumPendingCount = Math.max(0, this.quantumPendingCount - 1);
        const pending = this.pendingRequests.get(serviceName) || 1;
        if (pending <= 1) {
          this.pendingRequests.delete(serviceName);
        } else {
          this.pendingRequests.set(serviceName, pending - 1);
        }
      }
      this.globalPendingCount = Math.max(0, this.globalPendingCount - 1);
    }
  }

  getPendingRequestCount(): number {
    return this.globalPendingCount;
  }

  getServicePendingCount(serviceName: string): number {
    return this.pendingRequests.get(serviceName) || 0;
  }

  getQuantumPendingCount(): number {
    return this.quantumPendingCount;
  }

  getGlobalPendingCount(): number {
    return this.globalPendingCount;
  }
}

class ApiClient {
  private config: ApiClientConfig;
  private apiKey: string | null = null;
  private jwtToken: string | null = null;
  private circuitBreaker: CircuitBreaker = new CircuitBreaker();
  private throttler: RequestThrottler = new RequestThrottler();
  
  // Quantum services for retry logic
  private readonly quantumServices = new Set(['hqe', 'qsem', 'iching', 'nlc', 'qcr', 'srs', 'unified']);

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 30000,
      retries: 3,
      ...config
    };
  }

  /**
   * Set API key for authentication (separate from JWT)
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    if (DEBUG_MODE) console.log('🔑 [ApiClient] API key set:', apiKey ? `${apiKey.substring(0, 20)}...` : 'null');
  }

  /**
   * Set JWT token for session authentication (separate from API key)
   */
  setJwtToken(jwtToken: string): void {
    this.jwtToken = jwtToken;
    if (DEBUG_MODE) console.log('🎫 [ApiClient] JWT token set:', jwtToken ? `${jwtToken.substring(0, 20)}...` : 'null');
  }

  /**
   * Get current API key
   */
  getApiKey(): string | null {
    return this.apiKey;
  }

  /**
   * Get current JWT token
   */
  getJwtToken(): string | null {
    return this.jwtToken;
  }

  /**
   * Clear JWT token
   */
  clearJwtToken(): void {
    this.jwtToken = null;
    if (DEBUG_MODE) console.log('🧹 [ApiClient] JWT token cleared');
  }

  /**
   * Update client configuration
   */
  updateConfig(config: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Make an authenticated API request with circuit breaker and timeout protection
   */
  async request<T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    const serviceName = this.extractServiceName(config.url);
    
    // Check circuit breaker
    if (!this.circuitBreaker.shouldAllowRequest(serviceName)) {
      if (DEBUG_MODE) console.warn(`[CircuitBreaker] Service ${serviceName} is currently unavailable`);
      return {
        error: `Service ${serviceName} is temporarily unavailable due to repeated failures`,
        status: 503,
        message: 'Service unavailable - circuit breaker open'
      };
    }
    
    if (DEBUG_MODE) {
      console.log(`🔄 [ApiClient] Making request to ${serviceName}:`, {
        url: config.url,
        method: config.method,
        hasApiKey: !!this.apiKey,
        hasJwtToken: !!this.jwtToken,
        circuitBreakerBypass: true
      });
    }

    // Apply global throttling to prevent resource exhaustion
    try {
      return await this.throttler.throttleRequest(serviceName, () => this.executeRequest(config));
    } catch (throttleError) {
      if (DEBUG_MODE) console.warn(`[Throttler] ${throttleError.message}`);
      return {
        error: throttleError instanceof Error ? throttleError.message : 'Request throttled',
        status: 503,
        message: 'Service busy - request throttled'
      };
    }
  }

  /**
   * Execute the actual HTTP request (called by throttler)
   */
  private async executeRequest<T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    const serviceName = this.extractServiceName(config.url);
    let url = config.url.startsWith('http')
      ? config.url
      : `${this.config.baseURL}${config.url}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers
    };

    // Define endpoints that require JWT session authentication
    const jwtEndpoints = ['/auth/', '/api-keys', '/dashboard/', '/billing/', '/admin/', '/organizations'];
    const needsJwtAuth = jwtEndpoints.some(endpoint => config.url.includes(endpoint));
    
    // Add JWT token for session-based endpoints (dashboard, billing, admin, etc.)
    if (this.jwtToken && needsJwtAuth) {
      headers['Authorization'] = `Bearer ${this.jwtToken}`;
    }
    
    // Add API key for quantum/service endpoints (but not for session endpoints)
    if (this.apiKey && !needsJwtAuth) {
      headers['X-API-Key'] = this.apiKey;
    }

    // Add idempotency key for POST/PUT/PATCH if not provided
    if (['POST', 'PUT', 'PATCH'].includes(config.method) && !headers['Idempotency-Key']) {
      headers['Idempotency-Key'] = this.generateIdempotencyKey();
    }

    // Create timeout controller
    const timeoutMs = config.timeout || this.config.timeout || 30000; // Increased to 30s
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      if (DEBUG_MODE) console.warn(`[Timeout] Request to ${serviceName} timed out after ${timeoutMs}ms`);
      controller.abort();
    }, timeoutMs);

    const requestConfig: RequestInit = {
      method: config.method,
      headers,
      signal: controller.signal
    };

    // Add body for non-GET requests
    if (config.data && config.method !== 'GET') {
      requestConfig.body = JSON.stringify(config.data);
    }

    // Add query parameters for GET requests
    if (config.params && Object.keys(config.params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}${searchParams.toString()}`;
    }

    let lastError: Error | null = null;
    const maxRetries = this.config.retries || 1; // Allow 1 retry for all services

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, requestConfig);
        clearTimeout(timeoutId); // Clear timeout on successful response

        // Handle rate limiting with immediate circuit breaker activation
        if (response.status === 429) {
          // Immediately record failure for rate limiting to open circuit breaker faster
          this.circuitBreaker.recordFailure(serviceName);
          
          const retryAfter = response.headers.get('Retry-After');
          const baseDelay = retryAfter ? parseInt(retryAfter) * 1000 : 2000; // Increased base delay
          const delay = Math.min(baseDelay * Math.pow(2, attempt), 15000); // Cap at 15s
          
          if (DEBUG_MODE) {
            console.warn(`[RateLimit] Service ${serviceName} rate limited, circuit breaker updated, waiting ${delay}ms before retry ${attempt + 1}`);
          }

          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          } else {
            // Final attempt failed due to rate limiting
            return {
              error: `Service ${serviceName} is rate limited - circuit breaker activated`,
              status: 429,
              message: 'Too Many Requests'
            };
          }
        }

        // Handle successful responses
        if (response.ok) {
          this.circuitBreaker.recordSuccess(serviceName);
          const rawData = await response.json().catch(() => null);
          
          // Backend returns { success: true, data: {...}, request_id, timestamp }
          // Extract the inner 'data' property for successful responses
          const extractedData = rawData && rawData.success && rawData.data ? rawData.data : rawData;
          
          return {
            data: extractedData,
            status: response.status,
            message: response.statusText
          };
        }

        // Handle error responses
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            type: 'api_error',
            title: 'API Error',
            status: response.status,
            detail: response.statusText || 'An error occurred'
          };
        }

        if (DEBUG_MODE) {
          console.error('API Error:', {
            url: `${this.config.baseURL}${config.url}`,
            status: response.status,
            statusText: response.statusText,
            service: serviceName
          });
        }

        // Record failure for circuit breaker
        this.circuitBreaker.recordFailure(serviceName);

        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          return {
            error: errorData.detail || errorData.title,
            status: response.status,
            message: errorData.title
          };
        }

        lastError = new Error(errorData.detail || errorData.title);

      } catch (error) {
        clearTimeout(timeoutId); // Clear timeout on error
        
        if (DEBUG_MODE) {
          console.error('🔥 Quantum API Network Error:', {
            url: `${this.config.baseURL}${config.url}`,
            error: error instanceof Error ? error.message : error,
            attempt: attempt + 1,
            maxRetries,
            service: serviceName
          });
        }
        
        // Record failure for circuit breaker
        this.circuitBreaker.recordFailure(serviceName);
        
        lastError = error instanceof Error ? error : new Error('Network error');

        // Don't retry on abort errors (timeouts)
        if (error instanceof DOMException && error.name === 'AbortError') {
          lastError = new Error(`Request to ${serviceName} timed out after ${timeoutMs}ms`);
          break;
        }
      }
    }

    // All retries failed
    return {
      error: lastError?.message || 'Request failed after retries',
      status: 0,
      message: 'Request failed'
    };
  }

  /**
   * Extract service name from URL for circuit breaker tracking
   */
  private extractServiceName(url: string): string {
    const matches = url.match(/\/(hqe|qsem|iching|nlc|qcr|srs|unified)\//);
    return matches ? matches[1] : 'unknown';
  }

  /**
   * Get circuit breaker status for monitoring
   */
  getServiceHealth(): Record<string, { healthy: boolean; failures: number; state: string; pending?: number }> {
    const services = ['hqe', 'qsem', 'iching', 'nlc', 'qcr', 'srs', 'unified'];
    const health: Record<string, { healthy: boolean; failures: number; state: string; pending?: number }> = {};
    
    services.forEach(service => {
      health[service] = {
        ...this.circuitBreaker.getServiceHealth(service),
        pending: this.throttler.getServicePendingCount(service)
      };
    });
    
    return health;
  }

  getSystemResourceStatus(): { pendingRequests: number; overloaded: boolean } {
    const pendingRequests = this.throttler.getPendingRequestCount();
    return {
      pendingRequests,
      overloaded: pendingRequests >= 3
    };
  }

  /**
   * Convenience methods for HTTP verbs
   */
  async get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, params });
  }

  async post<T = unknown>(url: string, data?: unknown, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data, ...config });
  }

  async put<T = unknown>(url: string, data?: unknown, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data, ...config });
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, data, ...config });
  }

  async delete<T = unknown>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, ...config });
  }

  /**
   * Generate a unique idempotency key
   */
  private generateIdempotencyKey(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/v1';
if (DEBUG_MODE) {
  console.log('🔧 API Client Initialization:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    finalBaseURL: baseURL,
    hostname: window.location.hostname,
    allEnvVars: import.meta.env
  });
}

const apiClient = new ApiClient({ baseURL });

// Export both the class and the singleton instance
export { ApiClient };
export default apiClient;