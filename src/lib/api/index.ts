// Main API facade - unified interface for all backend services
import apiClient from './client';
import apiAuth from './auth';
import srsApi from './services/srs';
import fastFactorApi from './services/fastfactor';
import hqeApi from './services/hqe';
import qsemApi from './services/qsem';
import nlcApi from './services/nlc';
import qcrApi from './services/qcr';
import ichingApi from './services/iching';
import unifiedApi from './services/unified';
import saiApi from './services/sai';

// Development mode flag for enhanced error handling
const isDevelopment = import.meta.env.MODE === 'development';
const useMockFallback = import.meta.env.VITE_USE_MOCK_API === 'true';

// Re-export types for convenience
export * from './types';

// Re-export services
export {
  apiClient,
  apiAuth,
  srsApi,
  fastFactorApi,
  hqeApi,
  qsemApi,
  nlcApi,
  qcrApi,
  ichingApi,
  unifiedApi,
  saiApi
};

// Main API facade class
class PsiZeroAPI {
  // Authentication
  get auth() {
    return apiAuth;
  }

  // SRS (Symbolic Resonance Solver)
  get srs() {
    return srsApi;
  }

  // FastFactor (Quantum-Inspired Integer Factorization)
  get fastfactor() {
    return fastFactorApi;
  }

  // HQE (Holographic Quantum Encoder)
  get hqe() {
    return hqeApi;
  }

  // QSEM (Quantum Semantics)
  get qsem() {
    return qsemApi;
  }

  // NLC (Non-Local Communication)
  get nlc() {
    return nlcApi;
  }

  // QCR (Quantum Consciousness Resonator)
  get qcr() {
    return qcrApi;
  }

  // I-Ching Oracle
  get iching() {
    return ichingApi;
  }

  // Unified Physics
  get unified() {
    return unifiedApi;
  }

  // SAI (Symbolic AI Engine)
  get sai() {
    return saiApi;
  }

  // Generic API client for custom requests
  get client() {
    return apiClient;
  }

  // Utility methods
  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async testConnection(): Promise<{ connected: boolean; authenticated: boolean; error?: string }> {
    console.log('[DEBUG] testConnection: Starting authentication check...');
    
    const connected = await this.healthCheck();
    console.log('[DEBUG] testConnection: Health check result:', connected);
    
    if (!connected) {
      console.log('[DEBUG] testConnection: Failed - not connected to API');
      return { connected: false, authenticated: false, error: 'Cannot connect to API' };
    }

    const isAuth = apiAuth.isAuthenticated();
    console.log('[DEBUG] testConnection: apiAuth.isAuthenticated():', isAuth);
    console.log('[DEBUG] testConnection: Current API key:', apiAuth.getApiKey());
    console.log('[DEBUG] testConnection: Current config:', apiAuth.getConfig());
    
    if (!isAuth) {
      console.log('[DEBUG] testConnection: Failed - not authenticated (no API key configured)');
      return { connected: true, authenticated: false, error: 'Not authenticated - no API key configured' };
    }

    console.log('[DEBUG] testConnection: Testing API key validity...');
    const authTest = await apiAuth.testApiKey();
    console.log('[DEBUG] testConnection: API key test result:', authTest);
    
    return {
      connected: true,
      authenticated: authTest.valid,
      error: authTest.valid ? undefined : authTest.error
    };
  }
}

// Create singleton instance
const psiZeroApi = new PsiZeroAPI();

// Export both the class and the singleton instance
export { PsiZeroAPI };
export default psiZeroApi;