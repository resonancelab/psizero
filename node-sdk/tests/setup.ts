// Jest test setup file for Nomyx Resonance SDK

// Extend global type for test utilities
declare global {
  var testUtils: {
    generateRandomString: (length?: number) => string;
    generateRandomNumber: (min?: number, max?: number) => number;
    generateTestApiKey: () => string;
    generateTestBaseUrl: () => string;
    wait: (ms: number) => Promise<void>;
    mockApiResponse: (data: any, status?: number) => any;
    mockWebSocketMessage: (type: string, data: any) => any;
  };
}

// Global test utilities
global.testUtils = {
  // Generate random test data
  generateRandomString: (length: number = 10): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Generate random number within range
  generateRandomNumber: (min: number = 0, max: number = 100): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Generate test API key
  generateTestApiKey: (): string => {
    return `nmx_test_api_key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Generate test base URL
  generateTestBaseUrl: (): string => {
    return `https://api.test${Math.random().toString(36).substr(2, 5)}.nomyx.dev`;
  },

  // Wait for specified milliseconds
  wait: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Mock API response
  mockApiResponse: (data: any, status: number = 200) => ({
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {
      'content-type': 'application/json',
      'x-request-id': `req_${Date.now()}`
    },
    config: {
      url: 'https://api.nomyx.dev/v1/test',
      method: 'GET'
    }
  }),

  // Mock WebSocket message
  mockWebSocketMessage: (type: string, data: any) => ({
    type,
    data,
    timestamp: Date.now(),
    sessionId: `session_${Math.random().toString(36).substr(2, 9)}`
  })
};

// Configure Jest timeouts
jest.setTimeout(30000);

// Mock console methods to reduce noise during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Global test configuration
process.env.NODE_ENV = 'test';
process.env.NOMYX_API_KEY = global.testUtils.generateTestApiKey();
process.env.NOMYX_BASE_URL = global.testUtils.generateTestBaseUrl();

// Export for use in tests
export {};