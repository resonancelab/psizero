// Shared types for Quaternionic Communication system

export interface QuaternionState {
  a: number; // Real component
  b: number; // i component
  c: number; // j component
  d: number; // k component
}

export interface OctonionChannel {
  e0: number; e1: number; e2: number; e3: number; // Quaternion part
  e4: number; e5: number; e6: number; e7: number; // Extended octonion
}

export interface BlochVector {
  x: number;
  y: number;
  z: number;
}

// Holographic Memory Types
export interface HolographicFragment {
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  spatialEntropy: number;
  intensityMap: Record<number, number>; // prime -> intensity mapping
  totalIntensity: number;
  phaseCoherence: number;
  canvasX: number;
  canvasY: number;
}

export interface HolographicData {
  centerX: number;
  centerY: number;
  phaseOffset: number;
  data: HolographicFragment[];
  totalFragments: number;
  avgIntensity: number;
}

export interface QuantumMemory {
  id: string;
  text: string;
  timestamp: string;
  holographicData: HolographicData;
  nodeOrigin: string;
  isNonLocal?: boolean;
  coefficients?: number[]; // Prime coefficients for resonance calculation
}

export interface PhaseRing {
  prime: number;
  index: number;
  amplitude: number;
  phase: number;
  x: number;
  y: number;
  locked: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
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

export interface SharedPhaseState {
  timestamp: number;
  phases: number[];
  entanglementId: string;
}

export type OverlayType =
  | 'holographic'
  | 'chat'
  | 'announce'
  | 'analysis'
  | 'timeline'
  | 'network';

export interface QuantumNode {
  id: string;
  name: string;
  quaternion: QuaternionState;
  octonion: OctonionChannel;
  blochVector: BlochVector;
  twist: number;
  coherence: number;
  entropy: number;
  message: string;
  lastActivity: Date;
  isEntangled: boolean;
  resonanceChannel: number;
  
  // Holographic memory extensions
  memories: QuantumMemory[];
  currentMemory: string;
  searchQuery: string;
  holographicField: Array<{
    x: number;
    y: number;
    z: number;
    intensity: number;
    phase: number;
    coherence: number;
  }>;
  interferencePattern: Array<{
    x: number;
    y: number;
    amplitude: number;
    phase: number;
    interference: number;
    intensity: number;
  }>;
  selectedFragment: QuantumMemory | null;
  reconstructionMode: 'full' | 'partial' | 'minimal';
  holographicResolution: number;
  phaseCoherence: number;
  holographicDensity: number;
  view3D: boolean;
  rotationAngle: number;
  phaseRing: PhaseRing[];
  activeOverlay: OverlayType;
  chatHistory: ChatMessage[];
}

export interface RNETSpace {
  id: string;
  name: string;
  basis: {
    primes: number[];
    phases: number[];
  };
  telemetry: {
    resonanceStrength: number;
    coherence: number;
    locality: number;
    entropy: number;
    nonLocalCorrelation: number;
    entanglementStrength: number;
  };
  entanglementState: 'disconnected' | 'initializing' | 'entangled' | 'separated';
  connectedNodes: number;
  sharedPhaseState: SharedPhaseState | null;
  globalAnnouncements: GlobalAnnouncement[];
}

export interface NonLocalMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  correlationStrength: number;
  quaternionEncoding: QuaternionState;
  octonionChannel: OctonionChannel;
}

export interface QuantumContextState {
  quantumSpace: RNETSpace;
  nodeA: QuantumNode;
  nodeB: QuantumNode;
  nonLocalMessages: NonLocalMessage[];
  isRunning: boolean;
  evolutionStartTime: number;
  
  // Multi-node system extensions
  nodes: QuantumNode[];
  globalAnnouncements: GlobalAnnouncement[];
  isEntangled: boolean;
  entanglementStrength: number;
  nonLocalCorrelation: number;
  sharedPhaseState: SharedPhaseState | null;
  animationFrameId: number | null;

  // API integration state
  qcrSessionId: string | null;
  rnetSessionId: string | null;
  apiStatus: {
    qcr: 'disconnected' | 'connecting' | 'connected' | 'error';
    rnet: 'disconnected' | 'connecting' | 'connected' | 'error';
    nlc: 'disconnected' | 'connecting' | 'connected' | 'error';
  };
}

export interface QuantumContextActions {
  startEvolution: () => void;
  stopEvolution: () => void;
  initializeEntanglement: () => void;
  separateNodes: () => void;
  transmitMessage: (message: string, fromNode: 'A' | 'B') => void;
  reset: () => void;
  
  // Multi-node system actions
  addNode: () => void;
  removeNode: (nodeId: string) => void;
  updateNodeMemoryInput: (nodeId: string, value: string) => void;
  updateNodeSearchQuery: (nodeId: string, value: string) => void;
  switchOverlay: (nodeId: string, overlayType: OverlayType) => void;
  storeHolographicMemory: (nodeId: string) => Promise<void>;
  selectFragment: (nodeId: string, memoryId: string) => void;
  sendChatMessage: (nodeId: string, message: string) => Promise<void>;
  broadcastAnnouncement: (nodeId: string, message: string) => Promise<void>;
  
  // API operations
  connectToAPIs: () => Promise<void>;
  disconnectFromAPIs: () => Promise<void>;
}