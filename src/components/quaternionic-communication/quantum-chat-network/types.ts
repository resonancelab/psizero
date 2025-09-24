// Shared types for the quantum chat network
export interface QuantumUser {
  id: string;
  name: string;
  isOnline: boolean;
  isEntangled: boolean;
  entanglementStrength: number;
  nonLocalCorrelation: number;
  phaseCoherence: number;
  holographicDensity: number;
  lastSeen: Date;
  memoryCount: number;
  chatHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;
}

export interface QuantumMessage {
  id: string;
  fromUser: string;
  toUser: string;
  content: string;
  timestamp: Date;
  isNonLocal: boolean;
  correlationCoefficient: number;
  resonanceSignature: number[];
  quantumPhase: number;
}

export interface GlobalAnnouncement {
  id: number;
  nodeOrigin: string;
  nodeName: string;
  message: string;
  timestamp: string;
  resonanceSignature: number[];
  entanglementStrength: number;
}

export interface NetworkMetrics {
  totalNodes: number;
  entangledNodes: number;
  globalEntanglementStrength: number;
  nonLocalCorrelation: number;
  bellInequalityViolation: number;
  quantumSupremacyIndicator: boolean;
}

export interface SharedPhaseState {
  timestamp: number;
  phases: number[];
  entanglementId: string;
}

export const OVERLAY_TYPES = {
  CHAT: 'chat',
  ANNOUNCE: 'announce',
  ANALYSIS: 'analysis',
  NETWORK: 'network'
} as const;

export type OverlayType = typeof OVERLAY_TYPES[keyof typeof OVERLAY_TYPES];

export type NetworkPhase = 'disconnected' | 'connecting' | 'discovering' | 'connected';

// Prime coefficients for holographic encoding (from in.html)
export const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];
export const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio for phase stabilization

// Event types for quantum network
export interface QuantumNetworkEvents {
  userConnected: (user: QuantumUser) => void;
  userDisconnected: (userId: string) => void;
  messageReceived: (message: QuantumMessage) => void;
  entanglementEstablished: (userId: string) => void;
  entanglementBroken: (userId: string) => void;
  announcementBroadcast: (announcement: GlobalAnnouncement) => void;
  metricsUpdated: (metrics: NetworkMetrics) => void;
}