// NLC (Non-Local Communication) Client - Quantum Entanglement Communication

import { DynamicApi } from '../dynamic-api';
import {
  CommunicationSession,
  CommunicationSessionResult,
  MessageTransmission,
  SecurityConfig,
  EntanglementConfig
} from './types';
import { loggers } from '../utils/logger';
import { validateRequiredProperties } from '../utils/validation';

/**
 * NLC Client - Non-Local Communication for quantum-entangled messaging
 */
export class NLCClient {
  constructor(private api: DynamicApi) {}

  /**
   * Establish communication session
   */
  async establishSession(session: CommunicationSession): Promise<CommunicationSessionResult> {
    loggers.engines.debug('NLC establishing session', {
      participants: session.participants.length,
      protocol: session.protocol,
      security: session.security.encryption
    });

    // Validate session structure
    this.validateCommunicationSession(session);

    const apiMethods = this.api.createApiMethods();
    const startTime = performance.now();

    const establishMethod = apiMethods['nlc.establishSession'];
    if (!establishMethod) {
      throw new Error('NLC establishSession method not available');
    }

    const result = await establishMethod(session);

    const processingTime = performance.now() - startTime;
    loggers.engines.info('NLC session established', {
      sessionId: result.sessionId,
      channelId: result.channelId,
      entangled: result.entangled,
      latency: result.latency,
      processingTime
    });

    return result;
  }

  /**
   * Transmit message through quantum channel
   */
  async transmitMessage(transmission: MessageTransmission): Promise<{
    messageId: string;
    success: boolean;
    latency: number;
    entanglementStrength: number;
    securityLevel: string;
  }> {
    loggers.engines.debug('NLC transmitting message', {
      encoding: transmission.encoding,
      priority: transmission.priority,
      contentLength: transmission.content.length
    });

    // Validate transmission structure
    this.validateMessageTransmission(transmission);

    const apiMethods = this.api.createApiMethods();
    const startTime = performance.now();

    const transmitMethod = apiMethods['nlc.transmitMessage'];
    if (!transmitMethod) {
      throw new Error('NLC transmitMessage method not available');
    }

    const result = await transmitMethod(transmission);

    const processingTime = performance.now() - startTime;
    loggers.engines.info('NLC message transmitted', {
      messageId: result.messageId,
      success: result.success,
      latency: result.latency,
      entanglementStrength: result.entanglementStrength,
      processingTime
    });

    return result;
  }

  /**
   * Receive messages from quantum channel
   */
  async receiveMessages(sessionId: string, timeout?: number): Promise<Array<{
    messageId: string;
    content: string;
    sender: string;
    timestamp: number;
    entanglementStrength: number;
    fidelity: number;
  }>> {
    loggers.engines.debug('NLC receiving messages', { sessionId, timeout });

    const apiMethods = this.api.createApiMethods();
    const receiveMethod = apiMethods['nlc.receiveMessages'];
    if (!receiveMethod) {
      throw new Error('NLC receiveMessages method not available');
    }

    const messages = await receiveMethod({ sessionId, timeout });

    loggers.engines.info('NLC messages received', {
      messageCount: messages.length,
      sessionId
    });

    return messages;
  }

  /**
   * Create quantum-entanglement session
   */
  async createEntanglementSession(
    participants: string[],
    security: SecurityConfig
  ): Promise<CommunicationSessionResult> {
    return this.establishSession({
      participants,
      protocol: 'quantum-entanglement',
      security
    });
  }

  /**
   * Create prime-resonance session
   */
  async createPrimeResonanceSession(
    participants: string[],
    security: SecurityConfig
  ): Promise<CommunicationSessionResult> {
    return this.establishSession({
      participants,
      protocol: 'prime-resonance',
      security
    });
  }

  /**
   * Create holographic-link session
   */
  async createHolographicSession(
    participants: string[],
    security: SecurityConfig
  ): Promise<CommunicationSessionResult> {
    return this.establishSession({
      participants,
      protocol: 'holographic-link',
      security
    });
  }

  /**
   * Send text message
   */
  async sendTextMessage(
    sessionId: string,
    content: string,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<{
    messageId: string;
    success: boolean;
    latency: number;
    entanglementStrength: number;
  }> {
    return this.transmitMessage({
      content,
      encoding: 'quantum-superposition',
      entanglement: {
        basis: [2, 3, 5, 7, 11], // Default prime basis
        coherence: 0.95,
        strength: 0.9
      },
      priority
    });
  }

  /**
   * Send binary message
   */
  async sendBinaryMessage(
    sessionId: string,
    content: Buffer,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<{
    messageId: string;
    success: boolean;
    latency: number;
    entanglementStrength: number;
  }> {
    return this.transmitMessage({
      content: content.toString('base64'),
      encoding: 'prime-basis',
      entanglement: {
        basis: [2, 3, 5, 7, 11],
        coherence: 0.95,
        strength: 0.9
      },
      priority
    });
  }

  /**
   * Send structured message
   */
  async sendStructuredMessage(
    sessionId: string,
    content: Record<string, unknown>,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<{
    messageId: string;
    success: boolean;
    latency: number;
    entanglementStrength: number;
  }> {
    return this.transmitMessage({
      content: JSON.stringify(content),
      encoding: 'holographic',
      entanglement: {
        basis: [2, 3, 5, 7, 11],
        coherence: 0.95,
        strength: 0.9
      },
      priority
    });
  }

  /**
   * Measure entanglement strength
   */
  async measureEntanglement(sessionId: string): Promise<{
    strength: number;
    coherence: number;
    fidelity: number;
    bellInequality: number;
    mutualInformation: number;
  }> {
    const apiMethods = this.api.createApiMethods();
    const measureMethod = apiMethods['nlc.measureEntanglement'];
    if (!measureMethod) {
      throw new Error('NLC measureEntanglement method not available');
    }

    return await measureMethod({ sessionId });
  }

  /**
   * Amplify entanglement
   */
  async amplifyEntanglement(
    sessionId: string,
    targetStrength: number
  ): Promise<{
    success: boolean;
    currentStrength: number;
    amplificationFactor: number;
    stability: number;
  }> {
    loggers.engines.debug('NLC amplifying entanglement', {
      sessionId,
      targetStrength
    });

    const apiMethods = this.api.createApiMethods();
    const amplifyMethod = apiMethods['nlc.amplifyEntanglement'];
    if (!amplifyMethod) {
      throw new Error('NLC amplifyEntanglement method not available');
    }

    const result = await amplifyMethod({ sessionId, targetStrength });

    loggers.engines.info('NLC entanglement amplified', {
      sessionId,
      success: result.success,
      currentStrength: result.currentStrength,
      amplificationFactor: result.amplificationFactor
    });

    return result;
  }

  /**
   * Stabilize quantum channel
   */
  async stabilizeChannel(sessionId: string): Promise<{
    success: boolean;
    stability: number;
    coherenceTime: number;
    errorRate: number;
  }> {
    const apiMethods = this.api.createApiMethods();
    const stabilizeMethod = apiMethods['nlc.stabilizeChannel'];
    if (!stabilizeMethod) {
      throw new Error('NLC stabilizeChannel method not available');
    }

    return await stabilizeMethod({ sessionId });
  }

  /**
   * Create secure communication channel
   */
  async createSecureChannel(
    participants: string[],
    encryption: 'quantum-key-distribution' | 'prime-encryption' | 'holographic-cipher',
    authentication: 'prime-signature' | 'quantum-signature' | 'biometric-resonance'
  ): Promise<CommunicationSessionResult> {
    const security: SecurityConfig = {
      encryption,
      authentication,
      parameters: {
        keyLength: 256,
        refreshInterval: 300000, // 5 minutes
        maxRetries: 3
      }
    };

    return this.createEntanglementSession(participants, security);
  }

  /**
   * Broadcast message to all participants
   */
  async broadcastMessage(
    sessionId: string,
    content: string,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<Array<{
    participant: string;
    messageId: string;
    success: boolean;
    latency: number;
  }>> {
    loggers.engines.debug('NLC broadcasting message', {
      sessionId,
      contentLength: content.length,
      priority
    });

    const apiMethods = this.api.createApiMethods();
    const broadcastMethod = apiMethods['nlc.broadcastMessage'];
    if (!broadcastMethod) {
      throw new Error('NLC broadcastMessage method not available');
    }

    const results = await broadcastMethod({
      sessionId,
      content,
      priority
    });

    loggers.engines.info('NLC message broadcasted', {
      sessionId,
      recipientCount: results.length,
      successCount: results.filter((r: { success: boolean }) => r.success).length
    });

    return results;
  }

  /**
   * Get session participants
   */
  async getSessionParticipants(sessionId: string): Promise<{
    participants: Array<{
      id: string;
      status: 'connected' | 'disconnected' | 'connecting';
      entanglementStrength: number;
      lastActivity: number;
    }>;
    sessionStatus: 'active' | 'inactive' | 'terminated';
  }> {
    const apiMethods = this.api.createApiMethods();
    const getParticipantsMethod = apiMethods['nlc.getSessionParticipants'];
    if (!getParticipantsMethod) {
      throw new Error('NLC getSessionParticipants method not available');
    }

    return await getParticipantsMethod({ sessionId });
  }

  /**
   * Terminate communication session
   */
  async terminateSession(sessionId: string): Promise<{
    success: boolean;
    cleanupTime: number;
    finalEntanglement: number;
  }> {
    loggers.engines.debug('NLC terminating session', { sessionId });

    const apiMethods = this.api.createApiMethods();
    const terminateMethod = apiMethods['nlc.terminateSession'];
    if (!terminateMethod) {
      throw new Error('NLC terminateSession method not available');
    }

    const result = await terminateMethod({ sessionId });

    loggers.engines.info('NLC session terminated', {
      sessionId,
      success: result.success,
      cleanupTime: result.cleanupTime,
      finalEntanglement: result.finalEntanglement
    });

    return result;
  }

  /**
   * Get communication statistics
   */
  async getCommunicationStats(): Promise<{
    totalSessions: number;
    activeSessions: number;
    totalMessages: number;
    averageLatency: number;
    averageEntanglementStrength: number;
    successRate: number;
    protocolDistribution: Record<string, number>;
  }> {
    const apiMethods = this.api.createApiMethods();
    const getStatsMethod = apiMethods['nlc.getStats'];
    if (!getStatsMethod) {
      throw new Error('NLC getStats method not available');
    }

    return await getStatsMethod();
  }

  /**
   * Get NLC engine status
   */
  async getStatus(): Promise<{
    online: boolean;
    quantumCoherence: number;
    entanglementCapacity: number;
    activeChannels: number;
    processingLoad: number;
    errorRate: number;
  }> {
    const apiMethods = this.api.createApiMethods();
    const getStatusMethod = apiMethods['nlc.getStatus'];
    if (!getStatusMethod) {
      throw new Error('NLC getStatus method not available');
    }

    return await getStatusMethod();
  }

  /**
   * Benchmark communication performance
   */
  async benchmarkCommunication(
    messageSizes: number[],
    protocols: string[] = ['quantum-entanglement', 'prime-resonance', 'holographic-link']
  ): Promise<Array<{
    protocol: string;
    messageSize: number;
    latency: number;
    throughput: number;
    entanglementStrength: number;
    successRate: number;
  }>> {
    loggers.engines.debug('NLC benchmarking communication', {
      messageSizes,
      protocols
    });

    const results = [];

    for (const protocol of protocols) {
      for (const size of messageSizes) {
        // Create test session
        const session = await this.establishSession({
          participants: ['test-sender', 'test-receiver'],
          protocol: protocol as any,
          security: {
            encryption: 'quantum-key-distribution',
            authentication: 'quantum-signature'
          }
        });

        // Send test messages
        const testMessage = 'A'.repeat(size);
        const latencies = [];

        for (let i = 0; i < 5; i++) { // 5 test messages
          const startTime = performance.now();
          await this.sendTextMessage(session.sessionId, testMessage);
          latencies.push(performance.now() - startTime);
        }

        const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
        const throughput = size / (avgLatency / 1000); // bytes per second

        results.push({
          protocol,
          messageSize: size,
          latency: avgLatency,
          throughput,
          entanglementStrength: 0.9, // Placeholder
          successRate: 0.95 // Placeholder
        });

        // Clean up
        await this.terminateSession(session.sessionId);
      }
    }

    loggers.engines.info('NLC communication benchmark completed', {
      resultsCount: results.length
    });

    return results;
  }

  /**
   * Validate communication session structure
   */
  private validateCommunicationSession(session: CommunicationSession): void {
    validateRequiredProperties(
      session as unknown as Record<string, unknown>,
      ['participants', 'protocol', 'security']
    );

    if (session.participants.length < 2) {
      throw new Error('Communication session requires at least 2 participants');
    }

    if (session.participants.length > 100) {
      throw new Error('Communication session cannot have more than 100 participants');
    }

    const validProtocols = ['quantum-entanglement', 'prime-resonance', 'holographic-link'];
    if (!validProtocols.includes(session.protocol)) {
      throw new Error(`Invalid protocol. Must be one of: ${validProtocols.join(', ')}`);
    }
  }

  /**
   * Validate message transmission structure
   */
  private validateMessageTransmission(transmission: MessageTransmission): void {
    validateRequiredProperties(
      transmission as unknown as Record<string, unknown>,
      ['content', 'encoding', 'entanglement']
    );

    if (transmission.content.length === 0) {
      throw new Error('Message content cannot be empty');
    }

    if (transmission.content.length > 1000000) { // 1MB limit
      throw new Error('Message content cannot exceed 1MB');
    }

    const validEncodings = ['quantum-superposition', 'prime-basis', 'holographic'];
    if (!validEncodings.includes(transmission.encoding)) {
      throw new Error(`Invalid encoding. Must be one of: ${validEncodings.join(', ')}`);
    }

    if (transmission.entanglement.coherence < 0 || transmission.entanglement.coherence > 1) {
      throw new Error('Entanglement coherence must be between 0 and 1');
    }
  }
}