// Unit tests for ResonanceClient

import { ResonanceClient } from '../src/resonance-client';
import { ConfigurationError } from '../src/core/errors';

describe('ResonanceClient', () => {
  const validConfig = {
    apiKey: global.testUtils.generateTestApiKey(),
    baseURL: global.testUtils.generateTestBaseUrl(),
    timeout: 5000,
    retries: 3,
    debug: false
  };

  describe('constructor', () => {
    it('should create a client with valid configuration', () => {
      const client = new ResonanceClient(validConfig);
      expect(client).toBeInstanceOf(ResonanceClient);
      expect(client.rnet).toBeDefined();
      expect(client.sai).toBeDefined();
      expect(client.engines).toBeDefined();
    });

    it('should throw ConfigurationError for invalid API key', () => {
      const invalidConfig = { ...validConfig, apiKey: '' };
      expect(() => new ResonanceClient(invalidConfig)).toThrow(ConfigurationError);
    });

    it('should throw ConfigurationError for invalid base URL', () => {
      const invalidConfig = { ...validConfig, baseURL: 'invalid-url' };
      expect(() => new ResonanceClient(invalidConfig)).toThrow(ConfigurationError);
    });

    it('should throw ConfigurationError for negative timeout', () => {
      const invalidConfig = { ...validConfig, timeout: -100 };
      expect(() => new ResonanceClient(invalidConfig)).toThrow(ConfigurationError);
    });

    it('should throw ConfigurationError for negative retries', () => {
      const invalidConfig = { ...validConfig, retries: -1 };
      expect(() => new ResonanceClient(invalidConfig)).toThrow(ConfigurationError);
    });
  });

  describe('engine clients', () => {
    let client: ResonanceClient;

    beforeEach(() => {
      client = new ResonanceClient(validConfig);
    });

    it('should have all engine clients initialized', () => {
      expect(client.engines.srs).toBeDefined();
      expect(client.engines.hqe).toBeDefined();
      expect(client.engines.qsem).toBeDefined();
      expect(client.engines.nlc).toBeDefined();
      expect(client.engines.qcr).toBeDefined();
      expect(client.engines.iching).toBeDefined();
      expect(client.engines.unified).toBeDefined();
    });

    it('should have proper engine client types', () => {
      expect(typeof client.engines.srs.solve).toBe('function');
      expect(typeof client.engines.hqe.encode).toBe('function');
      expect(typeof client.engines.qsem.encodeText).toBe('function');
      expect(typeof client.engines.nlc.establishSession).toBe('function');
      expect(typeof client.engines.qcr.initializeSession).toBe('function');
      expect(typeof client.engines.iching.castHexagram).toBe('function');
      expect(typeof client.engines.unified.computeGravitationalField).toBe('function');
    });
  });

  describe('client methods', () => {
    let client: ResonanceClient;

    beforeEach(() => {
      client = new ResonanceClient(validConfig);
    });

    it('should have setAuthToken method', () => {
      expect(typeof client.setAuthToken).toBe('function');
    });

    it('should have updateHeaders method', () => {
      expect(typeof client.updateHeaders).toBe('function');
    });

    it('should have getWebSocketManager method', () => {
      expect(typeof client.getWebSocketManager).toBe('function');
    });

    it('should have getDynamicApi method', () => {
      expect(typeof client.getDynamicApi).toBe('function');
    });

    it('should have cleanup method', () => {
      expect(typeof client.cleanup).toBe('function');
    });
  });
});