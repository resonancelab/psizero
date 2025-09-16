// WebSocket Manager for Real-time Communication

import { EventEmitter } from 'eventemitter3';
import { SpaceSession } from './space-session';
import { 
  WebSocketConfig, 
  ConnectionState, 
  ConnectionStatus,
  WebSocketMessage,
  HeartbeatMessage
} from './types';
import { DEFAULT_CONFIG } from '../core/constants';
import { NetworkError, ResonanceError } from '../core/errors';

/**
 * WebSocket Manager for handling real-time connections
 */
export class WebSocketManager extends EventEmitter {
  private connections: Map<string, WebSocket> = new Map();
  private heartbeatIntervals: Map<string, NodeJS.Timeout> = new Map();
  private reconnectTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private connectionStatus: Map<string, ConnectionStatus> = new Map();

  constructor() {
    super();
  }

  /**
   * Connect to a space for real-time collaboration
   */
  async connectToSpace(spaceId: string, sessionToken: string): Promise<SpaceSession> {
    const wsUrl = `${DEFAULT_CONFIG.WEBSOCKET_URL}/spaces/${spaceId}?token=${sessionToken}`;
    
    const config: WebSocketConfig = {
      url: wsUrl,
      token: sessionToken,
      maxReconnectAttempts: DEFAULT_CONFIG.RECONNECT_ATTEMPTS,
      reconnectDelay: 1000,
      heartbeatInterval: DEFAULT_CONFIG.HEARTBEAT_INTERVAL,
      connectionTimeout: 10000
    };

    const ws = await this.createWebSocketConnection(config);
    this.connections.set(spaceId, ws);

    const session = new SpaceSession(spaceId, ws, this);
    
    // Setup connection monitoring
    this.setupConnectionMonitoring(spaceId, ws, config);
    
    return session;
  }

  /**
   * Stream HQE simulation updates (Server-Sent Events)
   */
  streamHQESimulation(simulationId: string): EventSource {
    const sseUrl = `https://api.nomyx.dev/v1/hqe/simulations/${simulationId}/stream`;
    return new EventSource(sseUrl);
  }

  /**
   * Stream SAI training progress (Server-Sent Events)
   */
  streamTrainingProgress(jobId: string): EventSource {
    const sseUrl = `https://api.nomyx.dev/v1/training/jobs/${jobId}/stream`;
    return new EventSource(sseUrl);
  }

  /**
   * Stream space telemetry (Server-Sent Events)
   */
  streamSpaceTelemetry(spaceId: string): EventSource {
    const sseUrl = `https://api.nomyx.dev/v1/spaces/${spaceId}/telemetry/stream`;
    return new EventSource(sseUrl);
  }

  /**
   * Disconnect from a space
   */
  async disconnectFromSpace(spaceId: string): Promise<void> {
    const ws = this.connections.get(spaceId);
    if (ws) {
      this.clearConnectionMonitoring(spaceId);
      ws.close();
      this.connections.delete(spaceId);
      this.connectionStatus.delete(spaceId);
    }
  }

  /**
   * Get connection status for a space
   */
  getConnectionStatus(spaceId: string): ConnectionStatus | undefined {
    return this.connectionStatus.get(spaceId);
  }

  /**
   * Send message to space
   */
  async sendMessage(spaceId: string, message: WebSocketMessage): Promise<void> {
    const ws = this.connections.get(spaceId);
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      throw new NetworkError('WebSocket connection not available');
    }

    try {
      ws.send(JSON.stringify(message));
    } catch (error) {
      throw new NetworkError('Failed to send WebSocket message', error);
    }
  }

  /**
   * Create WebSocket connection with proper configuration
   */
  private async createWebSocketConnection(config: WebSocketConfig): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      let ws: WebSocket;
      
      try {
        ws = new WebSocket(config.url);
      } catch (error) {
        reject(new NetworkError('Failed to create WebSocket connection', error));
        return;
      }

      const timeout = setTimeout(() => {
        ws.close();
        reject(new NetworkError('WebSocket connection timeout'));
      }, config.connectionTimeout || 10000);

      ws.onopen = () => {
        clearTimeout(timeout);
        resolve(ws);
      };

      ws.onerror = (event) => {
        clearTimeout(timeout);
        reject(new NetworkError('WebSocket connection error', event));
      };

      ws.onclose = (event) => {
        clearTimeout(timeout);
        if (event.code !== 1000) { // Not a normal closure
          reject(new NetworkError(`WebSocket closed with code ${event.code}: ${event.reason}`));
        }
      };
    });
  }

  /**
   * Setup connection monitoring and heartbeat
   */
  private setupConnectionMonitoring(spaceId: string, ws: WebSocket, config: WebSocketConfig): void {
    // Initialize connection status
    this.connectionStatus.set(spaceId, {
      state: 'connected',
      connectedAt: new Date().toISOString(),
      disconnectedAt: undefined,
      reconnectAttempts: 0,
      lastError: undefined,
      latency: undefined
    });

    // Setup heartbeat
    if (config.heartbeatInterval) {
      const interval = setInterval(() => {
        this.sendHeartbeat(spaceId, ws);
      }, config.heartbeatInterval);
      
      this.heartbeatIntervals.set(spaceId, interval);
    }

    // Setup reconnection on disconnect
    ws.onclose = (event) => {
      this.handleDisconnection(spaceId, config, event.code, event.reason);
    };

    ws.onerror = (event) => {
      this.handleConnectionError(spaceId, event);
    };
  }

  /**
   * Clear connection monitoring
   */
  private clearConnectionMonitoring(spaceId: string): void {
    const heartbeatInterval = this.heartbeatIntervals.get(spaceId);
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      this.heartbeatIntervals.delete(spaceId);
    }

    const reconnectTimeout = this.reconnectTimeouts.get(spaceId);
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      this.reconnectTimeouts.delete(spaceId);
    }
  }

  /**
   * Send heartbeat to maintain connection
   */
  private sendHeartbeat(spaceId: string, ws: WebSocket): void {
    if (ws.readyState === WebSocket.OPEN) {
      const heartbeat: HeartbeatMessage = {
        type: 'heartbeat',
        data: {
          timestamp: Date.now(),
          clientTime: performance.now()
        },
        timestamp: new Date().toISOString()
      };

      try {
        ws.send(JSON.stringify(heartbeat));
      } catch (error) {
        console.warn('Failed to send heartbeat:', error);
      }
    }
  }

  /**
   * Handle WebSocket disconnection
   */
  private handleDisconnection(spaceId: string, config: WebSocketConfig, code: number, reason: string): void {
    const status = this.connectionStatus.get(spaceId);
    if (status) {
      status.state = 'disconnected';
      status.disconnectedAt = new Date().toISOString();
      status.lastError = `Connection closed: ${code} - ${reason}`;
    }

    this.emit('disconnected', { spaceId, code, reason });

    // Attempt reconnection if configured
    if (config.maxReconnectAttempts && status && status.reconnectAttempts < config.maxReconnectAttempts) {
      this.scheduleReconnection(spaceId, config);
    }
  }

  /**
   * Handle WebSocket connection error
   */
  private handleConnectionError(spaceId: string, event: Event): void {
    const status = this.connectionStatus.get(spaceId);
    if (status) {
      status.state = 'error';
      status.lastError = 'Connection error occurred';
    }

    this.emit('error', { spaceId, error: event });
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnection(spaceId: string, config: WebSocketConfig): void {
    const status = this.connectionStatus.get(spaceId);
    if (!status) return;

    status.state = 'connecting';
    status.reconnectAttempts++;

    const delay = config.reconnectDelay! * Math.pow(2, status.reconnectAttempts - 1); // Exponential backoff
    
    const timeout = setTimeout(async () => {
      try {
        const ws = await this.createWebSocketConnection(config);
        this.connections.set(spaceId, ws);
        this.setupConnectionMonitoring(spaceId, ws, config);
        
        // Reset reconnect attempts on successful connection
        if (status) {
          status.reconnectAttempts = 0;
        }
        
        this.emit('reconnected', { spaceId });
      } catch (error) {
        this.emit('reconnectionFailed', { spaceId, error });
        
        // Try again if we haven't reached max attempts
        if (status.reconnectAttempts < config.maxReconnectAttempts!) {
          this.scheduleReconnection(spaceId, config);
        } else {
          status.state = 'disconnected';
          this.emit('reconnectionGiveUp', { spaceId });
        }
      }
    }, delay);

    this.reconnectTimeouts.set(spaceId, timeout);
  }

  /**
   * Calculate connection latency
   */
  private updateLatency(spaceId: string, roundTripTime: number): void {
    const status = this.connectionStatus.get(spaceId);
    if (status) {
      status.latency = roundTripTime;
    }
  }

  /**
   * Cleanup all connections
   */
  async cleanup(): Promise<void> {
    const disconnectPromises: Promise<void>[] = [];
    
    for (const spaceId of this.connections.keys()) {
      disconnectPromises.push(this.disconnectFromSpace(spaceId));
    }

    await Promise.all(disconnectPromises);
    
    // Clear all intervals and timeouts
    this.heartbeatIntervals.clear();
    this.reconnectTimeouts.clear();
    this.connectionStatus.clear();
  }
}