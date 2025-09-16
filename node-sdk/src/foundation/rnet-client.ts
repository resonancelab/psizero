// RNET (Resonance Network) Foundation Layer Client

import { DynamicApi } from '../dynamic-api';
import { WebSocketManager } from '../realtime/websocket-manager';
import { SpaceSession } from '../realtime/space-session';
import {
  Space,
  SpaceConfig,
  SessionConfig,
  SessionToken,
  SpaceDelta,
  SpaceSnapshot,
  DeltaResult,
  SpaceMember,
  SpaceInvitation,
  SpaceMemberInvite,
  SpaceActivity,
  SpaceTelemetry
} from './types';
import { PaginatedResponse } from '../core/types';

/**
 * RNET Client - Foundation layer for collaborative resonance spaces
 */
export class RNETClient {
  constructor(
    private api: DynamicApi,
    private wsManager: WebSocketManager
  ) {}

  /**
   * Create a new resonance space for collaboration
   */
  async createSpace(config: SpaceConfig): Promise<Space> {
    const apiMethods = this.api.createApiMethods();
    const createMethod = apiMethods.createSpace;
    if (!createMethod) {
      throw new Error('RNET createSpace method not available');
    }
    return await createMethod(config);
  }

  /**
   * List available spaces
   */
  async listSpaces(options?: {
    page?: number;
    limit?: number;
    visibility?: 'private' | 'shared' | 'public';
    search?: string;
  }): Promise<PaginatedResponse<Space>> {
    const apiMethods = this.api.createApiMethods();
    const listMethod = apiMethods.listSpaces;
    if (!listMethod) {
      throw new Error('RNET listSpaces method not available');
    }
    return await listMethod(options);
  }

  /**
   * Get space by ID
   */
  async getSpace(spaceId: string): Promise<Space> {
    const apiMethods = this.api.createApiMethods();
    const getMethod = apiMethods.getSpace;
    if (!getMethod) {
      throw new Error('RNET getSpace method not available');
    }
    return await getMethod({ id: spaceId });
  }

  /**
   * Update space settings
   */
  async updateSpace(spaceId: string, updates: Partial<SpaceConfig>): Promise<Space> {
    const apiMethods = this.api.createApiMethods();
    const updateMethod = apiMethods.updateSpace;
    if (!updateMethod) {
      throw new Error('RNET updateSpace method not available');
    }
    return await updateMethod({ id: spaceId, ...updates });
  }

  /**
   * Update space's mathematical basis
   */
  async updateSpaceBasis(spaceId: string, basis: SpaceConfig['basis']): Promise<Space> {
    const apiMethods = this.api.createApiMethods();
    const updateBasisMethod = apiMethods.updateSpaceBasis;
    if (!updateBasisMethod) {
      throw new Error('RNET updateSpaceBasis method not available');
    }
    return await updateBasisMethod({ id: spaceId, basis });
  }

  /**
   * Delete a space
   */
  async deleteSpace(spaceId: string): Promise<void> {
    const apiMethods = this.api.createApiMethods();
    const deleteMethod = apiMethods.deleteSpace;
    if (!deleteMethod) {
      throw new Error('RNET deleteSpace method not available');
    }
    await deleteMethod({ id: spaceId });
  }

  /**
   * Join a space for real-time collaboration
   */
  async joinSpace(spaceId: string, config: SessionConfig): Promise<SpaceSession> {
    // First create session token via REST API
    const apiMethods = this.api.createApiMethods();
    const createSessionMethod = apiMethods.createSession;
    if (!createSessionMethod) {
      throw new Error('RNET createSession method not available');
    }
    const sessionToken: SessionToken = await createSessionMethod({
      spaceId,
      ...config
    });

    // Then establish WebSocket connection for real-time collaboration
    return await this.wsManager.connectToSpace(spaceId, sessionToken.token);
  }

  /**
   * Get current space snapshot
   */
  async getSnapshot(spaceId: string): Promise<SpaceSnapshot> {
    const apiMethods = this.api.createApiMethods();
    const getSnapshotMethod = apiMethods.getSnapshot;
    if (!getSnapshotMethod) {
      throw new Error('RNET getSnapshot method not available');
    }
    return await getSnapshotMethod({ id: spaceId });
  }

  /**
   * Propose changes to space state
   */
  async proposeDelta(spaceId: string, delta: Omit<SpaceDelta, 'metadata'> & { 
    metadata: Omit<SpaceDelta['metadata'], 'timestamp'> 
  }): Promise<DeltaResult> {
    const apiMethods = this.api.createApiMethods();
    const deltaWithTimestamp = {
      ...delta,
      metadata: {
        ...delta.metadata,
        timestamp: Date.now()
      }
    };
    const proposeMethod = apiMethods.proposeDelta;
    if (!proposeMethod) {
      throw new Error('RNET proposeDelta method not available');
    }
    return await proposeMethod({ spaceId, ...deltaWithTimestamp });
  }

  /**
   * Get space members
   */
  async getMembers(spaceId: string): Promise<SpaceMember[]> {
    const apiMethods = this.api.createApiMethods();
    const getMembersMethod = apiMethods.getMembers;
    if (!getMembersMethod) {
      throw new Error('RNET getMembers method not available');
    }
    return await getMembersMethod({ spaceId });
  }

  /**
   * Invite member to space
   */
  async inviteMember(spaceId: string, invitation: SpaceMemberInvite): Promise<SpaceInvitation> {
    const apiMethods = this.api.createApiMethods();
    const inviteMethod = apiMethods.inviteMember;
    if (!inviteMethod) {
      throw new Error('RNET inviteMember method not available');
    }
    return await inviteMethod({ spaceId, ...invitation });
  }

  /**
   * Remove member from space
   */
  async removeMember(spaceId: string, userId: string): Promise<void> {
    const apiMethods = this.api.createApiMethods();
    const removeMethod = apiMethods.removeMember;
    if (!removeMethod) {
      throw new Error('RNET removeMember method not available');
    }
    await removeMethod({ spaceId, userId });
  }

  /**
   * Update member role
   */
  async updateMemberRole(spaceId: string, userId: string, role: SpaceMember['role']): Promise<SpaceMember> {
    const apiMethods = this.api.createApiMethods();
    const updateRoleMethod = apiMethods.updateMemberRole;
    if (!updateRoleMethod) {
      throw new Error('RNET updateMemberRole method not available');
    }
    return await updateRoleMethod({ spaceId, userId, role });
  }

  /**
   * Get space activity history
   */
  async getActivity(spaceId: string, options?: {
    page?: number;
    limit?: number;
    type?: SpaceActivity['type'];
    userId?: string;
    since?: string;
  }): Promise<PaginatedResponse<SpaceActivity>> {
    const apiMethods = this.api.createApiMethods();
    const getActivityMethod = apiMethods.getActivity;
    if (!getActivityMethod) {
      throw new Error('RNET getActivity method not available');
    }
    return await getActivityMethod({ spaceId, ...options });
  }

  /**
   * Get space telemetry data
   */
  async getTelemetry(spaceId: string, options?: {
    since?: string;
    until?: string;
    interval?: 'minute' | 'hour' | 'day';
  }): Promise<SpaceTelemetry[]> {
    const apiMethods = this.api.createApiMethods();
    const getTelemetryMethod = apiMethods.getTelemetry;
    if (!getTelemetryMethod) {
      throw new Error('RNET getTelemetry method not available');
    }
    return await getTelemetryMethod({ spaceId, ...options });
  }

  /**
   * Stream real-time telemetry (Server-Sent Events)
   */
  streamTelemetry(spaceId: string): EventSource {
    return this.wsManager.streamSpaceTelemetry(spaceId);
  }

  /**
   * Get pending invitations for current user
   */
  async getPendingInvitations(): Promise<SpaceInvitation[]> {
    const apiMethods = this.api.createApiMethods();
    const getInvitationsMethod = apiMethods.getPendingInvitations;
    if (!getInvitationsMethod) {
      throw new Error('RNET getPendingInvitations method not available');
    }
    return await getInvitationsMethod();
  }

  /**
   * Accept space invitation
   */
  async acceptInvitation(invitationId: string): Promise<Space> {
    const apiMethods = this.api.createApiMethods();
    const acceptMethod = apiMethods.acceptInvitation;
    if (!acceptMethod) {
      throw new Error('RNET acceptInvitation method not available');
    }
    return await acceptMethod({ id: invitationId });
  }

  /**
   * Decline space invitation
   */
  async declineInvitation(invitationId: string): Promise<void> {
    const apiMethods = this.api.createApiMethods();
    const declineMethod = apiMethods.declineInvitation;
    if (!declineMethod) {
      throw new Error('RNET declineInvitation method not available');
    }
    await declineMethod({ id: invitationId });
  }

  /**
   * Search spaces
   */
  async searchSpaces(query: string, options?: {
    visibility?: 'private' | 'shared' | 'public';
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Space>> {
    const apiMethods = this.api.createApiMethods();
    const searchMethod = apiMethods.searchSpaces;
    if (!searchMethod) {
      throw new Error('RNET searchSpaces method not available');
    }
    return await searchMethod({ query, ...options });
  }

  /**
   * Get space statistics
   */
  async getSpaceStats(spaceId: string): Promise<{
    memberCount: number;
    activityCount: number;
    deltaCount: number;
    lastActivity: string;
    resonanceMetrics: SpaceSnapshot['metrics'];
  }> {
    const apiMethods = this.api.createApiMethods();
    const getStatsMethod = apiMethods.getSpaceStats;
    if (!getStatsMethod) {
      throw new Error('RNET getSpaceStats method not available');
    }
    return await getStatsMethod({ id: spaceId });
  }

  /**
   * Archive a space
   */
  async archiveSpace(spaceId: string): Promise<Space> {
    const apiMethods = this.api.createApiMethods();
    const archiveMethod = apiMethods.archiveSpace;
    if (!archiveMethod) {
      throw new Error('RNET archiveSpace method not available');
    }
    return await archiveMethod({ id: spaceId });
  }

  /**
   * Restore archived space
   */
  async restoreSpace(spaceId: string): Promise<Space> {
    const apiMethods = this.api.createApiMethods();
    const restoreMethod = apiMethods.restoreSpace;
    if (!restoreMethod) {
      throw new Error('RNET restoreSpace method not available');
    }
    return await restoreMethod({ id: spaceId });
  }

  /**
   * Export space data
   */
  async exportSpace(spaceId: string, format: 'json' | 'csv' | 'xml' = 'json'): Promise<Blob> {
    const apiMethods = this.api.createApiMethods();
    const exportMethod = apiMethods.exportSpace;
    if (!exportMethod) {
      throw new Error('RNET exportSpace method not available');
    }
    return await exportMethod({ id: spaceId, format });
  }

  /**
   * Import space data
   */
  async importSpace(data: Blob | File, options?: {
    name?: string;
    mergeBasis?: boolean;
  }): Promise<Space> {
    const apiMethods = this.api.createApiMethods();
    const importMethod = apiMethods.importSpace;
    if (!importMethod) {
      throw new Error('RNET importSpace method not available');
    }
    return await importMethod({ data, ...options });
  }
}