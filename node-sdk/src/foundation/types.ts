// RNET (Resonance Network) Foundation Layer Types

import { BaseEntity, PrimeBasis, MemberRole, Permission, ResonanceMetrics } from '../core/types';

/**
 * Space configuration for creation
 */
export interface SpaceConfig {
  /** Human-readable space name */
  name: string;
  /** Space description */
  description?: string;
  /** Mathematical basis for resonance calculations */
  basis: PrimeBasis;
  /** Access control level */
  visibility?: 'private' | 'shared' | 'public';
  /** Initial member list */
  members?: SpaceMemberInvite[];
  /** Custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Member invitation data
 */
export interface SpaceMemberInvite {
  /** Member email address */
  email: string;
  /** Member role in space */
  role: MemberRole;
  /** Custom display name */
  displayName?: string;
  /** Specific permissions */
  permissions?: Permission[];
}

/**
 * Space entity
 */
export interface Space extends BaseEntity {
  /** Space name */
  name: string;
  /** Space description */
  description: string | undefined;
  /** Mathematical basis */
  basis: PrimeBasis;
  /** Current status */
  status: 'active' | 'archived' | 'suspended';
  /** Visibility level */
  visibility: 'private' | 'shared' | 'public';
  /** Number of members */
  memberCount: number;
  /** Space permissions */
  permissions: SpacePermissions;
  /** Current version for conflict resolution */
  version: number;
  /** Resonance metrics */
  metrics: ResonanceMetrics;
  /** Custom metadata */
  metadata: Record<string, unknown>;
}

/**
 * Space permissions structure
 */
export interface SpacePermissions {
  /** Can read space content */
  canRead: boolean;
  /** Can write to space */
  canWrite: boolean;
  /** Can invite members */
  canInvite: boolean;
  /** Can moderate content */
  canModerate: boolean;
  /** Can delete space */
  canDelete: boolean;
  /** Can change settings */
  canManage: boolean;
}

/**
 * Session configuration for joining spaces
 */
export interface SessionConfig {
  /** Member role */
  role: MemberRole;
  /** Display name for this session */
  displayName?: string;
  /** Specific capabilities requested */
  capabilities?: SessionCapability[];
  /** Session timeout in seconds */
  timeout?: number;
}

/**
 * Session capabilities
 */
export type SessionCapability = 
  | 'read' 
  | 'write' 
  | 'collaborate' 
  | 'moderate' 
  | 'admin';

/**
 * Space session token information
 */
export interface SessionToken {
  /** JWT token for authentication */
  token: string;
  /** Token expiration time */
  expires: string;
  /** Granted capabilities */
  capabilities: SessionCapability[];
  /** Session ID */
  sessionId: string;
}

/**
 * Change delta for space state updates
 */
export interface SpaceDelta {
  /** Array of individual changes */
  changes: DeltaChange[];
  /** Delta metadata */
  metadata: DeltaMetadata;
  /** Conflict resolution strategy */
  conflictResolution?: 'auto' | 'manual';
  /** Expected space version */
  expectedVersion?: number;
}

/**
 * Individual change in a delta
 */
export interface DeltaChange {
  /** Type of change */
  type: 'add' | 'update' | 'delete';
  /** JSON path to the changed property */
  path: string;
  /** New value (for add/update) */
  value?: unknown;
  /** Previous value (for update/delete) */
  previousValue?: unknown;
  /** Prime basis for this change */
  basis?: number[];
}

/**
 * Delta metadata
 */
export interface DeltaMetadata {
  /** Change author */
  author: string;
  /** Timestamp of change */
  timestamp: number;
  /** Human-readable description */
  description?: string;
  /** Change priority */
  priority?: 'low' | 'normal' | 'high' | 'critical';
  /** Tags for categorization */
  tags?: string[];
}

/**
 * Space state snapshot
 */
export interface SpaceSnapshot {
  /** Snapshot ID */
  id: string;
  /** Space ID */
  spaceId: string;
  /** Version number */
  version: number;
  /** Current state */
  state: Record<string, unknown>;
  /** Resonance metrics */
  metrics: ResonanceMetrics;
  /** Creation timestamp */
  createdAt: string;
  /** State checksum for integrity */
  checksum: string;
}

/**
 * Delta application result
 */
export interface DeltaResult {
  /** Delta ID */
  deltaId: string;
  /** Whether delta was applied successfully */
  applied: boolean;
  /** Any conflicts detected */
  conflicts: DeltaConflict[];
  /** New snapshot after application */
  newSnapshot: SpaceSnapshot;
  /** Resonance impact */
  resonanceImpact: number;
}

/**
 * Delta conflict information
 */
export interface DeltaConflict {
  /** Conflicting path */
  path: string;
  /** Current value in space */
  currentValue: unknown;
  /** Attempted new value */
  attemptedValue: unknown;
  /** Conflict resolution suggestion */
  resolution?: 'use_current' | 'use_new' | 'merge' | 'manual';
}

/**
 * Space member information
 */
export interface SpaceMember {
  /** User ID */
  userId: string;
  /** Email address */
  email: string;
  /** Display name */
  displayName: string;
  /** Member role */
  role: MemberRole;
  /** Specific permissions */
  permissions: Permission[];
  /** When they joined */
  joinedAt: string;
  /** Last activity timestamp */
  lastActivity: string;
  /** Online status */
  online: boolean;
}

/**
 * Space invitation
 */
export interface SpaceInvitation extends BaseEntity {
  /** Space ID */
  spaceId: string;
  /** Invitee email */
  email: string;
  /** Invited role */
  role: MemberRole;
  /** Invitation status */
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  /** Inviter user ID */
  invitedBy: string;
  /** Expiration date */
  expiresAt: string;
  /** Invitation token */
  token: string;
}

/**
 * Space activity event
 */
export interface SpaceActivity extends BaseEntity {
  /** Space ID */
  spaceId: string;
  /** Actor user ID */
  userId: string;
  /** Activity type */
  type: 'joined' | 'left' | 'delta' | 'invitation' | 'role_change' | 'settings_change';
  /** Activity description */
  description: string;
  /** Related data */
  data: Record<string, unknown>;
  /** Impact on resonance */
  resonanceImpact: number;
}

/**
 * Real-time space event
 */
export interface SpaceEvent {
  /** Event type */
  type: 'delta' | 'member_joined' | 'member_left' | 'telemetry' | 'collapse' | 'error';
  /** Event data */
  data: unknown;
  /** Source of event */
  source: string;
  /** Timestamp */
  timestamp: string;
  /** Space ID */
  spaceId: string;
}

/**
 * Telemetry metrics for spaces
 */
export interface SpaceTelemetry {
  /** Space ID */
  spaceId: string;
  /** Current resonance metrics */
  resonance: ResonanceMetrics;
  /** Active member count */
  activeMemberCount: number;
  /** Recent activity count */
  activityCount: number;
  /** Delta frequency (per minute) */
  deltaFrequency: number;
  /** System performance */
  performance: {
    /** Average response time */
    avgResponseTime: number;
    /** Success rate */
    successRate: number;
    /** Error rate */
    errorRate: number;
  };
  /** Timestamp */
  timestamp: string;
}