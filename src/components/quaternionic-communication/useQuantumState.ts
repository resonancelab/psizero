import { useState, useEffect, useRef, useCallback } from 'react';
import {
  QuantumContextState,
  QuantumContextActions,
  QuantumNode as QuantumNodeType,
  RNETSpace,
  NonLocalMessage,
  QuantumMemory,
  OverlayType,
  ChatMessage,
  GlobalAnnouncement,
  SharedPhaseState
} from './types';
import {
  messageToOctonion,
  octonionToQuaternion,
  octonionConjugate,
  quaternionToBloch,
  calculateTwist,
  calculateNonLocalCorrelation,
  evolvePrimeBasisPhases,
  goldenRatioPhase,
  primeToQuaternion
} from './quantum-math';
import {
  PRIMES,
  PHI,
  encodeMemoryToPrimes,
  encodeHolographic,
  searchHolographicMemories,
  createPhaseRing,
  calculateInterferencePattern
} from './holographic-encoding';
import { QuantumApiManager } from './api-integration';

const SPLIT_PRIMES = [13, 37, 61, 73, 97, 109, 157, 181, 193, 229];

const createInitialNode = (id: string, name: string): QuantumNodeType => ({
  id,
  name,
  quaternion: { a: 1, b: 0, c: 0, d: 0 },
  octonion: { e0: 1, e1: 0, e2: 0, e3: 0, e4: 0, e5: 0, e6: 0, e7: 0 },
  blochVector: { x: 0, y: 0, z: 1 },
  twist: 0,
  coherence: 0.0,
  entropy: 1.0,
  message: '',
  lastActivity: new Date(),
  isEntangled: false,
  resonanceChannel: Math.floor(Math.random() * 8) + 1,
  // Holographic memory extensions
  memories: [],
  currentMemory: '',
  searchQuery: '',
  holographicField: [],
  interferencePattern: [],
  selectedFragment: null,
  reconstructionMode: 'full',
  holographicResolution: 20,
  phaseCoherence: 0.0,
  holographicDensity: 0.0,
  view3D: false,
  rotationAngle: 0,
  phaseRing: [],
  activeOverlay: 'holographic',
  chatHistory: []
});

export const useQuantumState = (): QuantumContextState & QuantumContextActions => {
  const animationRef = useRef<number>();
  
  const animationFrameRef = useRef<number | null>(null);
  const apiManagerRef = useRef<QuantumApiManager | null>(null);

  // Initialize quantum space
  const [quantumSpace, setQuantumSpace] = useState<RNETSpace>({
    id: 'qcomm_space_001',
    name: 'Quaternionic Entanglement Laboratory',
    basis: {
      primes: PRIMES,
      phases: Array.from({length: PRIMES.length}, (_, i) => goldenRatioPhase(i))
    },
    telemetry: {
      resonanceStrength: 0.0,
      coherence: 0.0,
      locality: 1.0,
      entropy: 1.0,
      nonLocalCorrelation: 0.0,
      entanglementStrength: 0.0
    },
    entanglementState: 'disconnected',
    connectedNodes: 0,
    sharedPhaseState: null,
    globalAnnouncements: []
  });

  // Multi-node system state
  const [nodes, setNodes] = useState<QuantumNodeType[]>([]);
  const [globalAnnouncements, setGlobalAnnouncements] = useState<GlobalAnnouncement[]>([]);
  const [isEntangled, setIsEntangled] = useState(false);
  const [entanglementStrength, setEntanglementStrength] = useState(0.0);
  const [nonLocalCorrelation, setNonLocalCorrelation] = useState(0.0);
  const [sharedPhaseState, setSharedPhaseState] = useState<SharedPhaseState | null>(null);

  // Legacy compatibility
  const [nodeA, setNodeA] = useState<QuantumNodeType>(createInitialNode('node_alpha', 'Node A (α)'));
  const [nodeB, setNodeB] = useState<QuantumNodeType>(createInitialNode('node_beta', 'Node B (β)'));
  const [nonLocalMessages, setNonLocalMessages] = useState<NonLocalMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [evolutionStartTime, setEvolutionStartTime] = useState(0);

  // Initialize entanglement with proper RNET coordination
  const initializeEntanglement = useCallback(async () => {
    setQuantumSpace(prev => ({ ...prev, entanglementState: 'initializing' }));
    
    try {
      // STEP 1: Connect to APIs if not already connected
      if (!apiManagerRef.current || apiManagerRef.current.getStatus().rnet !== 'connected') {
        console.log('Connecting to RNET backbone for entanglement coordination...');
        if (!apiManagerRef.current) {
          apiManagerRef.current = new QuantumApiManager((status) => {
            console.log('API Status Update:', status);
          });
        }
        await apiManagerRef.current.connectToAPIs();
      }

      // STEP 2: Use split prime for genuine quantum state
      const basePrime = SPLIT_PRIMES[Math.floor(Math.random() * SPLIT_PRIMES.length)];
      const sharedQuaternion = primeToQuaternion(basePrime, Date.now() % 1000);
      
      // STEP 3: Sync the quantum basis to RNET collaborative space
      const entangledBasis = [...PRIMES, basePrime];
      const entangledPhases = entangledBasis.map((_, i) => goldenRatioPhase(i));
      
      if (apiManagerRef.current) {
        await apiManagerRef.current.synchronizePrimeBasis(entangledBasis, entangledPhases);
      }

      // STEP 4: Entangle nodes with anti-correlated states
      setNodeA(prev => ({
        ...prev,
        quaternion: sharedQuaternion,
        blochVector: quaternionToBloch(sharedQuaternion),
        twist: calculateTwist(sharedQuaternion),
        isEntangled: true,
        coherence: 0.9,
        entropy: 0.2
      }));

      // Anti-correlated quaternion for genuine entanglement
      const antiCorrelatedQuaternion = {
        a: sharedQuaternion.a,
        b: -sharedQuaternion.b,
        c: sharedQuaternion.c,
        d: -sharedQuaternion.d
      };

      setNodeB(prev => ({
        ...prev,
        quaternion: antiCorrelatedQuaternion,
        blochVector: quaternionToBloch(antiCorrelatedQuaternion),
        twist: calculateTwist(antiCorrelatedQuaternion),
        isEntangled: true,
        coherence: 0.9,
        entropy: 0.2
      }));

      // STEP 5: Update multi-node system entanglement
      setNodes(prev => prev.map(node => ({
        ...node,
        isEntangled: true,
        coherence: 0.9,
        entropy: 0.2
      })));

      setIsEntangled(true);
      setEntanglementStrength(0.95);
      setNonLocalCorrelation(0.9);

      // STEP 6: Update quantum space with entangled state
      setQuantumSpace(prev => ({
        ...prev,
        entanglementState: 'entangled',
        connectedNodes: 2 + nodes.length,
        basis: {
          primes: entangledBasis,
          phases: entangledPhases
        },
        telemetry: {
          ...prev.telemetry,
          resonanceStrength: 0.95,
          coherence: 0.9,
          locality: 0.1, // Low locality for quantum non-local effects
          entanglementStrength: 0.95,
          nonLocalCorrelation: 0.9
        }
      }));

      console.log('Quantum entanglement established through RNET coordination');
    } catch (error) {
      console.error('Failed to initialize quantum entanglement:', error);
      setQuantumSpace(prev => ({ ...prev, entanglementState: 'disconnected' }));
    }
  }, [nodes.length]);

  // Separate nodes for non-local communication testing
  const separateNodes = useCallback(() => {
    if (quantumSpace.entanglementState !== 'entangled') return;
    
    setQuantumSpace(prev => ({
      ...prev,
      entanglementState: 'separated',
      telemetry: {
        ...prev.telemetry,
        locality: 0.1 // Very low locality = high non-locality
      }
    }));
  }, [quantumSpace.entanglementState]);

  // Transmit message through quantum correlation
  const transmitMessage = useCallback((message: string, fromNode: 'A' | 'B') => {
    if (!message.trim()) return;
    
    const sender = fromNode === 'A' ? nodeA : nodeB;
    const receiver = fromNode === 'A' ? nodeB : nodeA;
    const setSender = fromNode === 'A' ? setNodeA : setNodeB;
    const setReceiver = fromNode === 'A' ? setNodeB : setNodeA;
    
    // Encode message into octonion using quantum channel
    const messageOctonion = messageToOctonion(message, sender.resonanceChannel);
    const messageQuaternion = octonionToQuaternion(messageOctonion);
    
    // Update sender state
    setSender(prev => ({
      ...prev,
      quaternion: messageQuaternion,
      octonion: messageOctonion,
      blochVector: quaternionToBloch(messageQuaternion),
      twist: calculateTwist(messageQuaternion),
      message,
      lastActivity: new Date()
    }));
    
    // Non-local correlation effect (only if separated)
    if (quantumSpace.entanglementState === 'separated') {
      setTimeout(() => {
        // Create anti-correlated response using octonion conjugate
        const correlatedOctonion = octonionConjugate(messageOctonion);
        
        // Apply channel mixing for non-local correlation
        const mixedOctonion = {
          e0: correlatedOctonion.e0, e1: -correlatedOctonion.e1,
          e2: correlatedOctonion.e2, e3: -correlatedOctonion.e3,
          e4: -correlatedOctonion.e4, e5: correlatedOctonion.e5,
          e6: -correlatedOctonion.e6, e7: correlatedOctonion.e7
        };
        
        const correlatedQuaternion = octonionToQuaternion(mixedOctonion);
        
        setReceiver(prev => ({
          ...prev,
          quaternion: correlatedQuaternion,
          octonion: mixedOctonion,
          blochVector: quaternionToBloch(correlatedQuaternion),
          twist: calculateTwist(correlatedQuaternion),
          message: `[Non-local correlation detected: ${message}]`,
          lastActivity: new Date()
        }));
        
        // Calculate correlation strength
        const correlationStrength = calculateNonLocalCorrelation(messageOctonion, mixedOctonion);
        
        // Record non-local message
        const nonLocalMsg: NonLocalMessage = {
          id: `nlm_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          from: sender.name,
          to: receiver.name,
          content: message,
          timestamp: new Date(),
          correlationStrength,
          quaternionEncoding: messageQuaternion,
          octonionChannel: messageOctonion
        };
        
        setNonLocalMessages(prev => [...prev.slice(-9), nonLocalMsg]);
        
        // Update space telemetry
        setQuantumSpace(prev => ({
          ...prev,
          telemetry: {
            ...prev.telemetry,
            nonLocalCorrelation: correlationStrength
          }
        }));
      }, 100 + Math.random() * 300); // Simulate quantum propagation delay
    }
  }, [nodeA, nodeB, quantumSpace.entanglementState]);

  // Evolution animation with prime basis oscillation
  useEffect(() => {
    if (!isRunning) return;

    const evolve = () => {
      const t = (Date.now() - evolutionStartTime) * 0.001;
      
      // Evolve quantum phases based on prime frequencies
      setQuantumSpace(prev => ({
        ...prev,
        basis: {
          ...prev.basis,
          phases: evolvePrimeBasisPhases(prev.basis.phases, prev.basis.primes, t)
        },
        telemetry: {
          ...prev.telemetry,
          resonanceStrength: prev.entanglementState === 'separated' 
            ? Math.max(0.3, prev.telemetry.resonanceStrength * 0.999)
            : prev.telemetry.resonanceStrength,
          coherence: prev.entanglementState === 'separated'
            ? Math.max(0.2, prev.telemetry.coherence * 0.9995) 
            : prev.telemetry.coherence
        }
      }));
      
      animationRef.current = requestAnimationFrame(evolve);
    };

    evolve();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, evolutionStartTime]);

  // Control functions
  const startEvolution = useCallback(() => {
    setIsRunning(true);
    setEvolutionStartTime(Date.now());
  }, []);

  const stopEvolution = useCallback(() => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // Multi-node system functions
  const addNode = useCallback(() => {
    const newNodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNode = createInitialNode(newNodeId, `Node ${nodes.length + 1}`);
    setNodes(prev => [...prev, newNode]);
  }, [nodes.length]);

  const removeNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
  }, []);

  const updateNodeMemoryInput = useCallback((nodeId: string, value: string) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, currentMemory: value } : node
    ));
  }, []);

  const updateNodeSearchQuery = useCallback((nodeId: string, value: string) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, searchQuery: value } : node
    ));
  }, []);

  const switchOverlay = useCallback((nodeId: string, overlayType: OverlayType) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, activeOverlay: overlayType } : node
    ));
  }, []);

  const storeHolographicMemory = useCallback(async (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.currentMemory.trim()) return;

    const centerX = 0.3 + Math.random() * 0.4;
    const centerY = 0.3 + Math.random() * 0.4;
    const phaseOffset = Math.random() * 2 * Math.PI;

    const hologramData = encodeHolographic(node.currentMemory, centerX, centerY, node.holographicResolution);
    const coefficients = encodeMemoryToPrimes(node.currentMemory);

    const newMemory: QuantumMemory = {
      id: `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: node.currentMemory,
      timestamp: new Date().toISOString(),
      holographicData: {
        centerX,
        centerY,
        phaseOffset,
        data: hologramData,
        totalFragments: hologramData.length,
        avgIntensity: hologramData.reduce((sum, h) => sum + h.totalIntensity, 0) / hologramData.length
      },
      nodeOrigin: nodeId,
      coefficients
    };

    setNodes(prev => prev.map(n =>
      n.id === nodeId
        ? { ...n, memories: [...n.memories, newMemory], currentMemory: '' }
        : n
    ));
  }, [nodes]);

  const selectFragment = useCallback((nodeId: string, memoryId: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id !== nodeId) return node;
      
      const selectedFragment = node.memories.find(mem => mem.id === memoryId);
      return { ...node, selectedFragment: selectedFragment || null };
    }));
  }, []);

  const sendChatMessage = useCallback(async (nodeId: string, message: string) => {
    if (!apiManagerRef.current) return;
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !message.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now()
    };

    // IMPORTANT: Chat messages use QCR/holographic for response generation
    // but quantum message transmission uses NLC channels
    const response = await apiManagerRef.current.generateHolographicResponse(node, message);
    
    // If this is quantum communication, transmit through NLC non-local channels
    let transmissionResult = response;
    if (node.isEntangled) {
      transmissionResult = await apiManagerRef.current.transmitQuantumMessage(
        response,
        node,
        node.isEntangled,
        nonLocalCorrelation
      );
    }

    const aiMessage: ChatMessage = {
      role: 'assistant',
      content: transmissionResult,
      timestamp: Date.now()
    };

    setNodes(prev => prev.map(n =>
      n.id === nodeId
        ? {
            ...n,
            chatHistory: [...n.chatHistory, userMessage, aiMessage].slice(-20)
          }
        : n
    ));
  }, [nodes, nonLocalCorrelation]);

  const broadcastAnnouncement = useCallback(async (nodeId: string, message: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !message.trim()) return;

    // Create announcement with resonance signature
    const resonanceSignature = encodeMemoryToPrimes(message);
    const announcement: GlobalAnnouncement = {
      id: Date.now() + Math.random() * 1000000,
      nodeOrigin: nodeId,
      nodeName: node.name,
      message: message,
      timestamp: new Date().toISOString(),
      resonanceSignature,
      entanglementStrength: isEntangled ? entanglementStrength : 0
    };

    // IMPORTANT: Broadcast through NLC non-local channels for quantum distribution
    if (apiManagerRef.current && isEntangled) {
      try {
        await apiManagerRef.current.transmitQuantumMessage(
          `[BROADCAST] ${message}`,
          node,
          isEntangled,
          entanglementStrength
        );
        
        // Sync the updated resonance signature to RNET collaborative space
        await apiManagerRef.current.synchronizePrimeBasis(
          quantumSpace.basis.primes,
          [...quantumSpace.basis.phases, ...resonanceSignature.slice(0, 3)]
        );
      } catch (error) {
        console.error('Failed to broadcast through quantum channels:', error);
      }
    }

    setGlobalAnnouncements(prev => [announcement, ...prev.slice(0, 49)]);
  }, [nodes, isEntangled, entanglementStrength, quantumSpace.basis, apiManagerRef]);

  const connectToAPIs = useCallback(async () => {
    if (!apiManagerRef.current) {
      apiManagerRef.current = new QuantumApiManager((status) => {
        // Update global API status when connections change
        console.log('API Status Update:', status);
      });
    }
    await apiManagerRef.current.connectToAPIs();
    
    // Sync initial prime basis to RNET collaborative space
    if (quantumSpace.basis.primes.length > 0) {
      await apiManagerRef.current.synchronizePrimeBasis(
        quantumSpace.basis.primes,
        quantumSpace.basis.phases
      );
    }
  }, [quantumSpace.basis]);

  const disconnectFromAPIs = useCallback(async () => {
    if (apiManagerRef.current) {
      await apiManagerRef.current.disconnectFromAPIs();
    }
  }, []);

  const reset = useCallback(() => {
    stopEvolution();
    setQuantumSpace(prev => ({
      ...prev,
      entanglementState: 'disconnected',
      connectedNodes: 0,
      telemetry: {
        resonanceStrength: 0.0,
        coherence: 0.0,
        locality: 1.0,
        entropy: 1.0,
        nonLocalCorrelation: 0.0,
        entanglementStrength: 0.0
      },
      sharedPhaseState: null,
      globalAnnouncements: []
    }));
    
    const resetNodeState = {
      quaternion: { a: 1, b: 0, c: 0, d: 0 },
      octonion: { e0: 1, e1: 0, e2: 0, e3: 0, e4: 0, e5: 0, e6: 0, e7: 0 },
      blochVector: { x: 0, y: 0, z: 1 },
      twist: 0,
      coherence: 0.0,
      entropy: 1.0,
      message: '',
      isEntangled: false
    };
    
    setNodeA(prev => ({ ...prev, ...resetNodeState }));
    setNodeB(prev => ({ ...prev, ...resetNodeState }));
    setNodes([]);
    setGlobalAnnouncements([]);
    setIsEntangled(false);
    setEntanglementStrength(0.0);
    setNonLocalCorrelation(0.0);
    setSharedPhaseState(null);
    setNonLocalMessages([]);
  }, [stopEvolution]);

  // Initialize with two nodes for multi-node system
  useEffect(() => {
    if (nodes.length === 0) {
      addNode();
      addNode();
    }
  }, [nodes.length, addNode]);

  return {
    // Legacy state (for backward compatibility)
    quantumSpace,
    nodeA,
    nodeB,
    nonLocalMessages,
    isRunning,
    evolutionStartTime,
    
    // Multi-node system state
    nodes,
    globalAnnouncements,
    isEntangled,
    entanglementStrength,
    nonLocalCorrelation,
    sharedPhaseState,
    animationFrameId: animationFrameRef.current,
    qcrSessionId: apiManagerRef.current?.getSessions().qcrSessionId || null,
    rnetSessionId: apiManagerRef.current?.getSessions().rnetSessionId || null,
    apiStatus: apiManagerRef.current?.getStatus() || { qcr: 'disconnected', rnet: 'disconnected', nlc: 'disconnected' },
    
    // Legacy actions
    startEvolution,
    stopEvolution,
    initializeEntanglement,
    separateNodes,
    transmitMessage,
    reset,
    
    // Multi-node system actions
    addNode,
    removeNode,
    updateNodeMemoryInput,
    updateNodeSearchQuery,
    switchOverlay,
    storeHolographicMemory,
    selectFragment,
    sendChatMessage,
    broadcastAnnouncement,
    connectToAPIs,
    disconnectFromAPIs
  };
};