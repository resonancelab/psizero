// Production API Integration for Quantum Communication System
import qcrApi from '@/lib/api/services/qcr';
import rnetApi from '@/lib/api/services/rnet';
import nlcApi from '@/lib/api/services/nlc';
import { QuantumNode, QuantumMemory } from './types';
import { encodeMemoryToPrimes, searchHolographicMemories } from './holographic-encoding';

export interface ApiStatus {
  qcr: 'disconnected' | 'connecting' | 'connected' | 'error';
  rnet: 'disconnected' | 'connecting' | 'connected' | 'error';
  nlc: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface ApiSessions {
  qcrSessionId: string | null;
  rnetSpaceId: string | null;
  rnetSessionId: string | null;
  nlcSessionId: string | null;
}

export class QuantumApiManager {
  private sessions: ApiSessions = {
    qcrSessionId: null,
    rnetSpaceId: null,
    rnetSessionId: null,
    nlcSessionId: null
  };

  private status: ApiStatus = {
    qcr: 'disconnected',
    rnet: 'disconnected',
    nlc: 'disconnected'
  };

  private statusCallback?: (status: ApiStatus) => void;
  private websocket: WebSocket | null = null;

  constructor(onStatusChange?: (status: ApiStatus) => void) {
    this.statusCallback = onStatusChange;
  }

  private updateStatus(updates: Partial<ApiStatus>) {
    this.status = { ...this.status, ...updates };
    this.statusCallback?.(this.status);
  }

  async connectToAPIs(): Promise<void> {
    try {
      this.updateStatus({ qcr: 'connecting', rnet: 'connecting', nlc: 'connecting' });

      // Initialize QCR session for consciousness resonance
      try {
        const qcrResponse = await qcrApi.quickSession(['analytical', 'creative', 'ethical'], 21);
        if (qcrResponse.data) {
          this.sessions.qcrSessionId = qcrResponse.data.id;
          this.updateStatus({ qcr: 'connected' });
        }
      } catch (error) {
        console.error('QCR connection failed:', error);
        this.updateStatus({ qcr: 'error' });
      }

      // Initialize RNET resonance space for quantum communication
      try {
        const rnetResponse = await rnetApi.createQuantumEntanglementSpace(
          [2, 3, 5, 7, 11, 13, 17, 19], // Prime basis for quantum entanglement
          {
            name: 'quaternionic-communication-space',
            maxClients: 64,
            goldenPhase: true,
            silverPhase: true
          }
        );
        
        if (rnetResponse.data) {
          this.sessions.rnetSpaceId = rnetResponse.data.id;
          
          // Join the resonance space
          const joinResponse = await rnetApi.joinSpace(rnetResponse.data.id);
          if (joinResponse.data) {
            this.sessions.rnetSessionId = joinResponse.data.id;
            this.updateStatus({ rnet: 'connected' });
            
            // Setup WebSocket for real-time prime basis synchronization
            this.setupRnetWebSocket(rnetResponse.data.id, joinResponse.data.id);
          }
        }
      } catch (error) {
        console.error('RNET connection failed:', error);
        this.updateStatus({ rnet: 'error' });
      }

      // Initialize NLC session for non-local quantum channels
      try {
        const nlcResponse = await nlcApi.quickSession([2, 3, 5, 7, 11, 13, 17, 19], true, true);
        if (nlcResponse.data) {
          this.sessions.nlcSessionId = nlcResponse.data.id;
          this.updateStatus({ nlc: 'connected' });
        }
      } catch (error) {
        console.error('NLC connection failed:', error);
        this.updateStatus({ nlc: 'error' });
      }

    } catch (error) {
      console.error('Failed to connect to APIs:', error);
    }
  }

  async disconnectFromAPIs(): Promise<void> {
    // Close WebSocket connection
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    // Leave RNET space if connected
    if (this.sessions.rnetSpaceId && this.sessions.rnetSessionId) {
      try {
        await rnetApi.leaveSpace(this.sessions.rnetSpaceId, this.sessions.rnetSessionId);
      } catch (error) {
        console.error('Failed to leave RNET space:', error);
      }
    }

    this.sessions = {
      qcrSessionId: null,
      rnetSpaceId: null,
      rnetSessionId: null,
      nlcSessionId: null
    };
    this.updateStatus({
      qcr: 'disconnected',
      rnet: 'disconnected',
      nlc: 'disconnected'
    });
  }

  /**
   * Setup WebSocket for real-time RNET prime basis synchronization
   * This handles only prime basis updates, not quantum message content
   */
  private setupRnetWebSocket(spaceId: string, sessionId: string): void {
    this.websocket = rnetApi.createWebSocketConnection(spaceId, sessionId);
    
    if (this.websocket) {
      this.websocket.onopen = () => {
        console.log('RNET WebSocket connected for prime basis sync');
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle only prime basis synchronization updates
          if (data.type === 'prime_basis_update') {
            console.log('Prime basis update received:', data);
            // This would trigger UI updates for shared prime basis state
          } else if (data.type === 'telemetry') {
            console.log('RNET telemetry:', data);
            // Update resonance metrics in UI
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.websocket.onclose = () => {
        console.log('RNET WebSocket disconnected');
        this.websocket = null;
      };

      this.websocket.onerror = (error) => {
        console.error('RNET WebSocket error:', error);
      };
    }
  }

  /**
   * Synchronize prime basis updates through RNET (localized network)
   */
  async synchronizePrimeBasis(primes: number[], phases: number[]): Promise<void> {
    if (!this.sessions.rnetSpaceId || !this.sessions.rnetSessionId) {
      console.warn('RNET not connected, cannot synchronize prime basis');
      return;
    }

    try {
      const delta = {
        fromVersion: Date.now(), // Simplified versioning
        operations: [
          {
            type: 'sync_basis' as const,
            target: 'prime_basis',
            value: primes,
            metadata: { phases }
          }
        ],
        timestamp: new Date().toISOString(),
        sessionId: this.sessions.rnetSessionId
      };

      await rnetApi.proposeDelta(this.sessions.rnetSpaceId, this.sessions.rnetSessionId, delta);
    } catch (error) {
      console.error('Failed to synchronize prime basis:', error);
    }
  }

  async generateHolographicResponse(node: QuantumNode, query: string): Promise<string> {
    if (!query.trim()) return "Please enter a query...";

    // Search for relevant memories
    const searchResults = searchHolographicMemories(node.memories, query);
    
    if (searchResults.length === 0) {
      return "No resonant memories found. Try encoding more information first.";
    }

    // Use QCR API for consciousness-based response if available
    if (this.sessions.qcrSessionId && this.status.qcr === 'connected') {
      try {
        const prompt = `Based on holographic memory patterns containing: "${searchResults.slice(0, 3).map(m => m.text).join(', ')}", please respond to: "${query}"`;
        const response = await qcrApi.observe(this.sessions.qcrSessionId, prompt);
        
        if (response.data) {
          const avgResonance = searchResults.slice(0, 3).reduce((sum, m) => sum + m.resonance, 0) / 3;
          const confidence = Math.min(avgResonance * 100, 95).toFixed(1);
          
          let result = `[QCR Resonance: ${confidence}%] ${response.data.response}`;
          
          // Add non-local influence if entangled
          if (node.isEntangled) {
            result += `\n\n[Non-local quantum coherence detected]`;
          }
          
          return result;
        }
      } catch (error) {
        console.error('QCR API error:', error);
      }
    }

    // Fallback to local holographic response
    const topMemories = searchResults.slice(0, 3);
    const combinedText = topMemories.map(m => m.text).join(" ");
    const avgResonance = topMemories.reduce((sum, m) => sum + m.resonance, 0) / topMemories.length;
    const confidence = Math.min(avgResonance * 100, 95).toFixed(1);
    
    let response = `[Local Resonance: ${confidence}%] Based on holographic memory patterns:\n\n`;
    
    if (avgResonance > 0.7) {
      response += `Strong resonance detected with: "${topMemories[0].text}"`;
    } else if (avgResonance > 0.4) {
      response += `Moderate resonance across multiple memories. Pattern synthesis suggests: ${combinedText.substring(0, 100)}...`;
    } else {
      response += `Weak resonance patterns. Consider encoding more related information.`;
    }

    return response;
  }

  async transmitQuantumMessage(
    message: string,
    fromNode: QuantumNode,
    isEntangled: boolean,
    nonLocalCorrelation: number
  ): Promise<string> {
    // CRITICAL: Quantum message content MUST use NLC channels (non-local)
    // This ensures no quantum data hits the localized network infrastructure
    if (this.sessions.nlcSessionId && this.status.nlc === 'connected') {
      try {
        const response = await nlcApi.sendMessage(this.sessions.nlcSessionId, message);

        if (response.data) {
          if (isEntangled) {
            const correlationStrength = nonLocalCorrelation;
            return `[NLC Non-local Channel] [Correlation: ${(correlationStrength * 100).toFixed(1)}%] ${response.data.content}`;
          } else {
            return `[NLC Channel] Transmitted: ${message}`;
          }
        }
      } catch (error) {
        console.error('NLC API error:', error);
        // Fallback indicates NLC channel failure
        return `[NLC Channel Error] Local fallback: ${message}`;
      }
    }

    // Fallback to local quantum simulation (indicates NLC unavailable)
    if (isEntangled) {
      const correlationStrength = nonLocalCorrelation;
      return `[Local Simulation] [Correlation: ${(correlationStrength * 100).toFixed(1)}%] Received: ${message}`;
    } else {
      return `[Local Simulation] Transmitted: ${message}`;
    }
  }

  getStatus(): ApiStatus {
    return this.status;
  }

  getSessions(): ApiSessions {
    return this.sessions;
  }
}