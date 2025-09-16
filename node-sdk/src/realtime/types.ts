// Real-time collaboration types

import { SpaceEvent, SpaceTelemetry } from '../foundation/types';
import { RealtimeEvent } from '../core/types';

/**
 * WebSocket connection states
 */
export type ConnectionState = 'connecting' | 'connected' | 'disconnecting' | 'disconnected' | 'error';

/**
 * WebSocket configuration
 */
export interface WebSocketConfig {
  /** WebSocket URL */
  url: string;
  /** Authentication token */
  token: string;
  /** Reconnection attempts */
  maxReconnectAttempts?: number;
  /** Reconnection delay in milliseconds */
  reconnectDelay?: number;
  /** Heartbeat interval in milliseconds */
  heartbeatInterval?: number;
  /** Connection timeout in milliseconds */
  connectionTimeout?: number;
}

/**
 * Connection status information
 */
export interface ConnectionStatus {
  /** Current connection state */
  state: ConnectionState;
  /** Last connection time */
  connectedAt: string | undefined;
  /** Last disconnection time */
  disconnectedAt: string | undefined;
  /** Number of reconnection attempts */
  reconnectAttempts: number;
  /** Last error message */
  lastError: string | undefined;
  /** Latency in milliseconds */
  latency: number | undefined;
}

/**
 * WebSocket message types
 */
export interface WebSocketMessage {
  /** Message type */
  type: string;
  /** Message payload */
  data: unknown;
  /** Message ID for acknowledgment */
  id?: string;
  /** Target space ID */
  spaceId?: string;
  /** Timestamp */
  timestamp: string;
}

/**
 * Heartbeat message
 */
export interface HeartbeatMessage extends WebSocketMessage {
  type: 'heartbeat';
  data: {
    timestamp: number;
    clientTime: number;
  };
}

/**
 * Acknowledgment message
 */
export interface AckMessage extends WebSocketMessage {
  type: 'ack';
  data: {
    messageId: string;
    success: boolean;
    error?: string;
  };
}

/**
 * Space delta message
 */
export interface DeltaMessage extends WebSocketMessage {
  type: 'delta';
  data: {
    deltaId: string;
    changes: unknown[];
    author: string;
    timestamp: number;
  };
}

/**
 * Member activity message
 */
export interface MemberMessage extends WebSocketMessage {
  type: 'member_joined' | 'member_left';
  data: {
    userId: string;
    displayName: string;
    timestamp: number;
  };
}

/**
 * Telemetry message
 */
export interface TelemetryMessage extends WebSocketMessage {
  type: 'telemetry';
  data: SpaceTelemetry;
}

/**
 * Error message
 */
export interface ErrorMessage extends WebSocketMessage {
  type: 'error';
  data: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Event listener function type
 */
export type EventListener<T = unknown> = (data: T) => void;

/**
 * Event subscription
 */
export interface EventSubscription {
  /** Event type */
  type: string;
  /** Listener function */
  listener: EventListener;
  /** Subscription options */
  options?: {
    once?: boolean;
    filter?: (data: unknown) => boolean;
  };
}

/**
 * Space session configuration
 */
export interface SpaceSessionConfig {
  /** Space ID */
  spaceId: string;
  /** WebSocket connection */
  websocket: WebSocket;
  /** Session token */
  token: string;
  /** Auto-reconnect */
  autoReconnect?: boolean;
  /** Event buffer size */
  eventBufferSize?: number;
}

/**
 * Collaboration cursor information
 */
export interface CollaborationCursor {
  /** User ID */
  userId: string;
  /** Display name */
  displayName: string;
  /** Cursor position */
  position: {
    x: number;
    y: number;
  };
  /** Color for display */
  color: string;
  /** Last update timestamp */
  timestamp: number;
}

/**
 * Presence information
 */
export interface PresenceInfo {
  /** User ID */
  userId: string;
  /** Display name */
  displayName: string;
  /** Online status */
  online: boolean;
  /** Current activity */
  activity?: string;
  /** Last seen timestamp */
  lastSeen: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Event sourcing event
 */
export interface SourcedEvent {
  /** Event ID */
  id: string;
  /** Event type */
  type: string;
  /** Event data */
  data: unknown;
  /** Event timestamp */
  timestamp: string;
  /** Event author */
  author: string;
  /** Event version */
  version: number;
}