import React, { useState } from 'react';
import { ConnectionInterface } from './ConnectionInterface';
import { NetworkStatusBar } from './NetworkStatusBar';
import { UserDiscoveryPanel } from './UserDiscoveryPanel';
import { ChatInterface } from './ChatInterface';
import { AnnouncementPanel } from './AnnouncementPanel';
import { AnalyticsPanel } from './AnalyticsPanel';
import { NetworkTopology } from './NetworkTopology';
import { useQuantumNetwork } from './useQuantumNetwork';
import { OVERLAY_TYPES, type OverlayType } from './types';

export const QuantumChatNetwork: React.FC = () => {
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(OVERLAY_TYPES.CHAT);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const {
    // State
    currentUser,
    isConnected,
    discoveredUsers,
    entangledUsers,
    messages,
    globalAnnouncements,
    networkPhase,
    networkMetrics,

    // Actions
    connectToNetwork,
    entangleWithUser,
    sendQuantumMessage,
    broadcastAnnouncement,

    // Utilities
    getConversationMessages,
    getUserById,
    isUserEntangled,
    getEntanglementStrength
  } = useQuantumNetwork();

  // Handle user selection for chat
  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setActiveOverlay(OVERLAY_TYPES.CHAT);
  };

  // Handle sending messages
  const handleSendMessage = (content: string) => {
    if (selectedUserId) {
      sendQuantumMessage(selectedUserId, content);
    }
  };

  // If not connected, show connection interface
  if (!isConnected) {
    return (
      <ConnectionInterface
        networkPhase={networkPhase}
        onConnect={connectToNetwork}
      />
    );
  }

  const selectedUser = selectedUserId ? getUserById(selectedUserId) : null;
  const conversationMessages = selectedUserId ? getConversationMessages(selectedUserId) : [];

  return (
    <div className="space-y-6">
      {/* Network Status Bar */}
      <NetworkStatusBar
        currentUser={currentUser}
        activeOverlay={activeOverlay}
        networkMetrics={networkMetrics}
        onOverlayChange={setActiveOverlay}
      />

      {/* Main Content based on active overlay */}
      {activeOverlay === OVERLAY_TYPES.CHAT && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Discovery Panel */}
          <UserDiscoveryPanel
            discoveredUsers={discoveredUsers}
            entangledUsers={entangledUsers}
            networkPhase={networkPhase}
            onEntangle={entangleWithUser}
            onSelectUser={handleSelectUser}
          />

          {/* Chat Interface */}
          <ChatInterface
            selectedUser={selectedUser}
            currentUser={currentUser}
            messages={conversationMessages}
            isUserEntangled={isUserEntangled}
            getEntanglementStrength={getEntanglementStrength}
            onSendMessage={handleSendMessage}
            onSelectUser={handleSelectUser}
          />
        </div>
      )}

      {activeOverlay === OVERLAY_TYPES.ANNOUNCE && (
        <AnnouncementPanel
          currentUser={currentUser}
          globalAnnouncements={globalAnnouncements}
          entangledUsers={entangledUsers}
          onBroadcast={broadcastAnnouncement}
        />
      )}

      {activeOverlay === OVERLAY_TYPES.ANALYSIS && (
        <AnalyticsPanel
          networkMetrics={networkMetrics}
          discoveredUsers={discoveredUsers}
          entangledUsers={entangledUsers}
        />
      )}

      {activeOverlay === OVERLAY_TYPES.NETWORK && (
        <NetworkTopology
          currentUser={currentUser}
          discoveredUsers={discoveredUsers}
          entangledUsers={entangledUsers}
          networkMetrics={networkMetrics}
        />
      )}
    </div>
  );
};