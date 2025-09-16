// Space Session for Real-time Collaboration

import { EventEmitter } from 'eventemitter3';
import { WebSocketManager } from './websocket-manager';
import { 
  WebSocketMessage, 
  DeltaMessage, 
  MemberMessage, 
  TelemetryMessage, 
  ErrorMessage,
  CollaborationCursor,
  PresenceInfo
} from './types';
import { SpaceDelta, DeltaResult, SpaceMember } from '../foundation/types';
import { ResonanceError } from '../core/errors';

/**
 * Real-time space session for collaboration
 */
export class SpaceSession extends EventEmitter {
  private messageBuffer: WebSocketMessage[] = [];
  private isConnected: boolean = false;
  private presenceMap: Map<string, PresenceInfo> = new Map();
  private cursors: Map<string, CollaborationCursor> = new Map();

  constructor(
    public readonly spaceId: string,
    private ws: WebSocket,
    private wsManager: WebSocketManager
  ) {
    super();
    this.setupWebSocketHandlers();
  }

  /**
   * Check if session is connected
   */
  get connected(): boolean {
    return this.isConnected && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Propose delta changes to space state
   */
  async proposeDelta(delta: Omit<SpaceDelta, 'metadata'> & { 
    metadata: Omit<SpaceDelta['metadata'], 'timestamp'> 
  }): Promise<void> {
    if (!this.connected) {
      throw new ResonanceError('SESSION_DISCONNECTED', 'Session is not connected');
    }

    const message: DeltaMessage = {
      type: 'delta',
      spaceId: this.spaceId,
      data: {
        deltaId: `delta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        changes: delta.changes,
        author: delta.metadata.author,
        timestamp: Date.now()
      },
      timestamp: new Date().toISOString()
    };

    await this.wsManager.sendMessage(this.spaceId, message);
  }

  /**
   * Update cursor position for collaboration
   */
  async updateCursor(position: { x: number; y: number }): Promise<void> {
    if (!this.connected) {
      throw new ResonanceError('SESSION_DISCONNECTED', 'Session is not connected');
    }

    const message: WebSocketMessage = {
      type: 'cursor_update',
      spaceId: this.spaceId,
      data: {
        position,
        timestamp: Date.now()
      },
      timestamp: new Date().toISOString()
    };

    await this.wsManager.sendMessage(this.spaceId, message);
  }

  /**
   * Update presence information
   */
  async updatePresence(activity?: string, metadata?: Record<string, unknown>): Promise<void> {
    if (!this.connected) {
      throw new ResonanceError('SESSION_DISCONNECTED', 'Session is not connected');
    }

    const message: WebSocketMessage = {
      type: 'presence_update',
      spaceId: this.spaceId,
      data: {
        activity,
        metadata,
        timestamp: Date.now()
      },
      timestamp: new Date().toISOString()
    };

    await this.wsManager.sendMessage(this.spaceId, message);
  }

  /**
   * Send custom message to space
   */
  async sendMessage(type: string, data: unknown): Promise<void> {
    if (!this.connected) {
      throw new ResonanceError('SESSION_DISCONNECTED', 'Session is not connected');
    }

    const message: WebSocketMessage = {
      type,
      spaceId: this.spaceId,
      data,
      timestamp: new Date().toISOString()
    };

    await this.wsManager.sendMessage(this.spaceId, message);
  }

  /**
   * Get current presence information for all members
   */
  getPresence(): Map<string, PresenceInfo> {
    return new Map(this.presenceMap);
  }

  /**
   * Get current cursor positions for all members
   */
  getCursors(): Map<string, CollaborationCursor> {
    return new Map(this.cursors);
  }

  /**
   * Request space snapshot
   */
  async requestSnapshot(): Promise<void> {
    if (!this.connected) {
      throw new ResonanceError('SESSION_DISCONNECTED', 'Session is not connected');
    }

    const message: WebSocketMessage = {
      type: 'request_snapshot',
      spaceId: this.spaceId,
      data: {},
      timestamp: new Date().toISOString()
    };

    await this.wsManager.sendMessage(this.spaceId, message);
  }

  /**
   * Close the session
   */
  async close(): Promise<void> {
    if (this.connected) {
      // Send leave message
      const message: WebSocketMessage = {
        type: 'leave_space',
        spaceId: this.spaceId,
        data: {},
        timestamp: new Date().toISOString()
      };

      try {
        await this.wsManager.sendMessage(this.spaceId, message);
      } catch (error) {
        // Ignore errors when closing
      }
    }

    await this.wsManager.disconnectFromSpace(this.spaceId);
    this.isConnected = false;
    this.emit('closed');
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupWebSocketHandlers(): void {
    this.ws.onopen = () => {
      this.isConnected = true;
      this.emit('connected');
      this.processBufferedMessages();
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        this.handleMessage(message);
      } catch (error) {
        this.emit('error', new ResonanceError('MESSAGE_PARSE_ERROR', 'Failed to parse WebSocket message', error));
      }
    };

    this.ws.onclose = (event) => {
      this.isConnected = false;
      this.emit('disconnected', { code: event.code, reason: event.reason });
    };

    this.ws.onerror = (event) => {
      this.emit('error', new ResonanceError('WEBSOCKET_ERROR', 'WebSocket error occurred', event));
    };
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(message: WebSocketMessage): void {
    if (!this.connected) {
      this.messageBuffer.push(message);
      return;
    }

    switch (message.type) {
      case 'delta':
        this.handleDeltaMessage(message as DeltaMessage);
        break;
      
      case 'member_joined':
      case 'member_left':
        this.handleMemberMessage(message as MemberMessage);
        break;
      
      case 'telemetry':
        this.handleTelemetryMessage(message as TelemetryMessage);
        break;
      
      case 'cursor_update':
        this.handleCursorUpdate(message);
        break;
      
      case 'presence_update':
        this.handlePresenceUpdate(message);
        break;
      
      case 'snapshot':
        this.handleSnapshotMessage(message);
        break;
      
      case 'error':
        this.handleErrorMessage(message as ErrorMessage);
        break;
      
      case 'ack':
        this.handleAckMessage(message);
        break;
      
      case 'heartbeat_response':
        this.handleHeartbeatResponse(message);
        break;
      
      default:
        this.emit('message', message);
        break;
    }
  }

  /**
   * Handle delta messages
   */
  private handleDeltaMessage(message: DeltaMessage): void {
    const delta = {
      id: message.data.deltaId,
      changes: message.data.changes,
      author: message.data.author,
      timestamp: message.data.timestamp
    };

    this.emit('deltaApplied', delta);
  }

  /**
   * Handle member join/leave messages
   */
  private handleMemberMessage(message: MemberMessage): void {
    const member = {
      userId: message.data.userId,
      displayName: message.data.displayName,
      timestamp: message.data.timestamp
    };

    if (message.type === 'member_joined') {
      this.emit('memberJoined', member);
    } else {
      this.emit('memberLeft', member);
      // Remove from presence and cursors
      this.presenceMap.delete(member.userId);
      this.cursors.delete(member.userId);
    }
  }

  /**
   * Handle telemetry messages
   */
  private handleTelemetryMessage(message: TelemetryMessage): void {
    this.emit('telemetry', message.data);
  }

  /**
   * Handle cursor updates
   */
  private handleCursorUpdate(message: WebSocketMessage): void {
    const data = message.data as any;
    const cursor: CollaborationCursor = {
      userId: data.userId,
      displayName: data.displayName,
      position: data.position,
      color: data.color,
      timestamp: data.timestamp
    };

    this.cursors.set(cursor.userId, cursor);
    this.emit('cursorUpdate', cursor);
  }

  /**
   * Handle presence updates
   */
  private handlePresenceUpdate(message: WebSocketMessage): void {
    const data = message.data as any;
    const presence: PresenceInfo = {
      userId: data.userId,
      displayName: data.displayName,
      online: data.online,
      activity: data.activity,
      lastSeen: data.lastSeen,
      metadata: data.metadata
    };

    this.presenceMap.set(presence.userId, presence);
    this.emit('presenceUpdate', presence);
  }

  /**
   * Handle snapshot messages
   */
  private handleSnapshotMessage(message: WebSocketMessage): void {
    this.emit('snapshot', message.data);
  }

  /**
   * Handle error messages
   */
  private handleErrorMessage(message: ErrorMessage): void {
    const error = new ResonanceError(
      message.data.code,
      message.data.message,
      message.data.details
    );
    this.emit('error', error);
  }

  /**
   * Handle acknowledgment messages
   */
  private handleAckMessage(message: WebSocketMessage): void {
    this.emit('ack', message.data);
  }

  /**
   * Handle heartbeat response
   */
  private handleHeartbeatResponse(message: WebSocketMessage): void {
    const data = message.data as any;
    const latency = Date.now() - data.clientTime;
    this.emit('heartbeat', { latency, serverTime: data.timestamp });
  }

  /**
   * Process buffered messages when connection is established
   */
  private processBufferedMessages(): void {
    while (this.messageBuffer.length > 0) {
      const message = this.messageBuffer.shift();
      if (message) {
        this.handleMessage(message);
      }
    }
  }
}