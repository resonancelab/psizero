import { useState, useEffect, useCallback, useRef } from 'react';
import {
  QuantumUser,
  QuantumMessage,
  GlobalAnnouncement,
  NetworkMetrics,
  SharedPhaseState,
  NetworkPhase,
  primes,
  PHI
} from './types';
import rnetApi from '@/lib/api/services/rnet';
import nlcApi from '@/lib/api/services/nlc';

export const useQuantumNetwork = () => {
  // Core state
  const [currentUser, setCurrentUser] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [discoveredUsers, setDiscoveredUsers] = useState<QuantumUser[]>([]);
  const [entangledUsers, setEntangledUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<QuantumMessage[]>([]);
  const [globalAnnouncements, setGlobalAnnouncements] = useState<GlobalAnnouncement[]>([]);
  const [networkPhase, setNetworkPhase] = useState<NetworkPhase>('disconnected');
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics>({
    totalNodes: 0,
    entangledNodes: 0,
    globalEntanglementStrength: 0,
    nonLocalCorrelation: 0,
    bellInequalityViolation: 0,
    quantumSupremacyIndicator: false
  });
  const [sharedPhaseState, setSharedPhaseState] = useState<SharedPhaseState | null>(null);
  
  // RNET integration state
  const rnetSpaceRef = useRef<{ spaceId: string; sessionId: string; websocket: WebSocket | null }>({
    spaceId: '',
    sessionId: '',
    websocket: null
  });

  // Holographic memory encoding function (adapted from in.html)
  const encodeMemoryToPrimes = useCallback((text: string): number[] => {
    const coefficients = new Array(primes.length).fill(0);
    const charFrequencies: Record<string, number> = {};

    for (let i = 0; i < text.length; i++) {
      const char = text[i].toLowerCase();
      charFrequencies[char] = (charFrequencies[char] || 0) + 1;
    }

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const primeIndex = charCode % primes.length;

      let amplitude = Math.cos(charCode * Math.PI / 128);
      const char = text[i].toLowerCase();
      if (charFrequencies[char]) {
        amplitude += (charFrequencies[char] / text.length) * 0.5;
      }
      amplitude *= (1 + (i / text.length) * 0.1);

      coefficients[primeIndex] += amplitude / Math.sqrt(text.length);
    }

    const norm = Math.sqrt(coefficients.reduce((sum, c) => sum + c * c, 0));
    return coefficients.map(c => norm > 0 ? c / norm : 0);
  }, []);

  // Calculate non-local correlation (adapted from in.html)
  const calculateNonLocalCorrelation = useCallback((): number => {
    if (entangledUsers.length < 2 || !sharedPhaseState) return 0;

    let totalPhaseCorrelation = 0;
    let pairCount = 0;

    for (let i = 0; i < entangledUsers.length; i++) {
      for (let j = i + 1; j < entangledUsers.length; j++) {
        const user1 = discoveredUsers.find(u => u.id === entangledUsers[i]);
        const user2 = discoveredUsers.find(u => u.id === entangledUsers[j]);
        
        if (user1 && user2) {
          // Simulate phase correlation calculation
          const phaseDiff = Math.abs(user1.phaseCoherence - user2.phaseCoherence);
          const correlation = Math.cos(phaseDiff) * user1.entanglementStrength * user2.entanglementStrength;
          totalPhaseCorrelation += Math.abs(correlation);
          pairCount++;
        }
      }
    }
    
    return pairCount > 0 ? totalPhaseCorrelation / (primes.length * pairCount) : 0;
  }, [entangledUsers, discoveredUsers, sharedPhaseState]);

  // Initialize quantum entanglement (adapted from in.html)
  const initializeGlobalEntanglement = useCallback(() => {
    if (entangledUsers.length < 2) return;

    const time = Date.now() * 0.001;
    const sharedPhases = primes.map((prime, i) => {
      const phaseBase = (2 * Math.PI * i) / primes.length;
      const goldenPhase = (2 * Math.PI) / PHI;
      return phaseBase + goldenPhase * time;
    });

    setSharedPhaseState({
      timestamp: time,
      phases: sharedPhases,
      entanglementId: Math.random().toString(36).substr(2, 9)
    });

    // Update entangled users with shared phase state
    setDiscoveredUsers(prev => 
      prev.map(user => 
        entangledUsers.includes(user.id) 
          ? { 
              ...user, 
              phaseCoherence: 0.8 + Math.random() * 0.2,
              nonLocalCorrelation: 0.75 + Math.random() * 0.25
            }
          : user
      )
    );
  }, [entangledUsers]);

  // Connect to quantum network
  const connectToNetwork = useCallback((userName: string) => {
    if (!userName.trim()) return;
    
    setCurrentUser(userName);
    setNetworkPhase('connecting');
    
    setTimeout(() => {
      setIsConnected(true);
      setNetworkPhase('connected');
    }, 1500);
  }, []);

  // RNET-based user discovery using the actual backend telemetry stream
  useEffect(() => {
    if (isConnected) {
      console.log('🌐 RNET: Connecting to backend quantum communication space');
      setNetworkPhase('discovering');
      
      const initializeRNETSpace = async () => {
        try {
          // Use a SHARED space name for all quaternionic communication users
          const SHARED_SPACE_NAME = 'quaternionic-communication-global';
          
          // Create or join the shared RNET space via actual backend
          const spaceResponse = await rnetApi.createQuantumEntanglementSpace(
            [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37], // Extended prime basis
            {
              name: SHARED_SPACE_NAME,
              maxClients: 256, // Allow many users
              goldenPhase: true,
              silverPhase: true
            }
          );

          if (spaceResponse.data) {
            const space = spaceResponse.data;
            console.log('🌐 RNET: Connected to backend quantum space:', space.id);
            
            // Join the shared space
            const sessionResponse = await rnetApi.joinSpace(space.id);
            if (sessionResponse.data) {
              const session = sessionResponse.data;
              console.log('🌐 RNET: Joined backend space with session:', session.id);
              
              // Store RNET connection details
              rnetSpaceRef.current.spaceId = space.id;
              rnetSpaceRef.current.sessionId = session.id;
              
              // Use Server-Sent Events for real-time telemetry and user presence
              const telemetryStream = rnetApi.createTelemetryStream(space.id, (data: unknown) => {
                try {
                  console.log('🌐 RNET: Received telemetry from backend:', data);
                  
                  // Handle telemetry data from the backend
                  if (data && typeof data === 'object' && 'resonanceStrength' in data) {
                    const telemetry = data as {
                      resonanceStrength?: number;
                      coherence?: number;
                      locality?: number;
                      entanglementStrength?: number;
                      connectedNodes?: number;
                    };
                    setNetworkMetrics(prev => ({
                      ...prev,
                      totalNodes: telemetry.connectedNodes || prev.totalNodes,
                      globalEntanglementStrength: telemetry.resonanceStrength || prev.globalEntanglementStrength,
                      nonLocalCorrelation: telemetry.coherence || prev.nonLocalCorrelation,
                      bellInequalityViolation: telemetry.locality > 0.707 ? telemetry.locality : prev.bellInequalityViolation,
                      quantumSupremacyIndicator: telemetry.entanglementStrength > 0.8
                    }));
                  }
                } catch (error) {
                  console.error('🌐 RNET: Failed to process telemetry data:', error);
                }
              });

              if (telemetryStream) {
                rnetSpaceRef.current.websocket = telemetryStream as unknown as WebSocket; // Store SSE connection
                
                // Simulate user presence announcements via RNET deltas
                // In production, this would be handled by the backend's session management
                setTimeout(async () => {
                  try {
                    await rnetApi.proposeDelta(space.id, session.id, {
                      fromVersion: 1,
                      operations: [{
                        type: 'update_amplitude',
                        target: 'user_presence',
                        value: 1,
                        metadata: {
                          userId: currentUser,
                          displayName: currentUser,
                          action: 'joined'
                        }
                      }],
                      timestamp: new Date().toISOString(),
                      sessionId: session.id
                    });
                    console.log('🌐 RNET: Announced user presence to backend');
                  } catch (error) {
                    console.error('🌐 RNET: Failed to announce presence:', error);
                  }
                }, 1000);
                
                setNetworkPhase('connected');
              } else {
                console.error('🌐 RNET: Failed to establish telemetry stream');
                setNetworkPhase('connected');
              }
            }
          }

        } catch (error) {
          console.error('🌐 RNET: Failed to connect to backend quantum space:', error);
          setNetworkPhase('connected');
          
          // Fallback: simulate some users for testing when backend is unavailable
          setTimeout(() => {
            if (discoveredUsers.length === 0) {
              console.log('🌐 RNET: Adding simulated users (backend unavailable)');
              const simulatedUsers: QuantumUser[] = [
                {
                  id: 'sim_user_1',
                  name: 'Quantum Node Alpha',
                  isOnline: true,
                  isEntangled: false,
                  entanglementStrength: 0.75,
                  nonLocalCorrelation: 0.65,
                  phaseCoherence: 0.85,
                  holographicDensity: 0.8,
                  lastSeen: new Date(),
                  memoryCount: 234,
                  chatHistory: []
                },
                {
                  id: 'sim_user_2',
                  name: 'Quantum Node Beta',
                  isOnline: true,
                  isEntangled: false,
                  entanglementStrength: 0.68,
                  nonLocalCorrelation: 0.72,
                  phaseCoherence: 0.91,
                  holographicDensity: 0.6,
                  lastSeen: new Date(),
                  memoryCount: 156,
                  chatHistory: []
                }
              ];
              setDiscoveredUsers(simulatedUsers);
            }
          }, 2000);
        }
      };

      initializeRNETSpace();
    }

    // Cleanup function
    return () => {
      // Leave RNET space properly
      if (rnetSpaceRef.current.spaceId && rnetSpaceRef.current.sessionId) {
        // Announce departure via delta before leaving
        rnetApi.proposeDelta(rnetSpaceRef.current.spaceId, rnetSpaceRef.current.sessionId, {
          fromVersion: 1,
          operations: [{
            type: 'update_amplitude',
            target: 'user_presence',
            value: 0,
            metadata: {
              userId: currentUser,
              displayName: currentUser,
              action: 'left'
            }
          }],
          timestamp: new Date().toISOString(),
          sessionId: rnetSpaceRef.current.sessionId
        }).catch(error => console.error('Failed to announce departure:', error));
        
        // Leave the space
        rnetApi.leaveSpace(rnetSpaceRef.current.spaceId, rnetSpaceRef.current.sessionId)
          .catch(error => console.error('Failed to leave RNET space:', error));
      }
      
      // Close telemetry stream
      if (rnetSpaceRef.current.websocket) {
        if ('close' in rnetSpaceRef.current.websocket) {
          rnetSpaceRef.current.websocket.close();
        }
        rnetSpaceRef.current.websocket = null;
      }
    };
  }, [isConnected, currentUser]);

  // Update network metrics
  useEffect(() => {
    const totalOnline = discoveredUsers.filter(u => u.isOnline).length + (isConnected ? 1 : 0);
    const entangled = entangledUsers.length;
    const avgEntanglement = entangled > 0 
      ? discoveredUsers
          .filter(u => entangledUsers.includes(u.id))
          .reduce((sum, u) => sum + u.entanglementStrength, 0) / entangled
      : 0;
    
    const nonLocalCorr = calculateNonLocalCorrelation();
    const bellViolation = nonLocalCorr > 0.707 ? nonLocalCorr : 0;

    setNetworkMetrics({
      totalNodes: totalOnline,
      entangledNodes: entangled,
      globalEntanglementStrength: avgEntanglement,
      nonLocalCorrelation: nonLocalCorr,
      bellInequalityViolation: bellViolation,
      quantumSupremacyIndicator: bellViolation > 0.8
    });
  }, [discoveredUsers, entangledUsers, isConnected, calculateNonLocalCorrelation]);

  // Initialize global entanglement when users get entangled
  useEffect(() => {
    if (entangledUsers.length >= 2) {
      initializeGlobalEntanglement();
    }
  }, [entangledUsers, initializeGlobalEntanglement]);

  // Entangle with a user
  const entangleWithUser = useCallback((userId: string) => {
    setEntangledUsers(prev => [...prev, userId]);
    setDiscoveredUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              isEntangled: true, 
              entanglementStrength: 0.85 + Math.random() * 0.15,
              nonLocalCorrelation: 0.75 + Math.random() * 0.25
            }
          : user
      )
    );
  }, []);

  // Send quantum message through proper channel isolation
  const sendQuantumMessage = useCallback(async (toUser: string, content: string) => {
    if (!content.trim()) return;

    const resonanceSignature = encodeMemoryToPrimes(content);
    const isNonLocal = entangledUsers.includes(toUser);
    const quantumPhase = isNonLocal ? (Date.now() * 0.001) % (2 * Math.PI) : 0;
    
    let processedContent = content;
    
    // CRITICAL: Route quantum message content through NLC non-local channels
    // This ensures quantum data bypasses localized network infrastructure
    if (isNonLocal) {
      try {
        // Send through NLC API for non-local quantum transmission
        const nlcResponse = await nlcApi.quickSession(
          resonanceSignature.slice(0, 8).map(coef => Math.floor(Math.abs(coef) * 100) + 2),
          true,
          true
        );
        
        if (nlcResponse.data) {
          const messageResponse = await nlcApi.sendMessage(nlcResponse.data.id, content);
          if (messageResponse.data) {
            console.log('🚀 NLC: Quantum message transmitted through non-local channel');
            processedContent = `[NLC Non-local] ${messageResponse.data.content}`;
          }
        }
      } catch (error) {
        console.error('🚀 NLC: Failed to transmit through non-local channel:', error);
        processedContent = `[NLC Error] Local fallback: ${content}`;
      }
    }
    
    const newMessage: QuantumMessage = {
      id: `qmsg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      fromUser: currentUser,
      toUser,
      content: processedContent,
      timestamp: new Date(),
      isNonLocal,
      correlationCoefficient: isNonLocal ? 0.85 + Math.random() * 0.15 : 0,
      resonanceSignature,
      quantumPhase
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Send message notification through RNET shared space (metadata only)
    if (rnetSpaceRef.current.websocket) {
      rnetSpaceRef.current.websocket.send(JSON.stringify({
        type: 'quantum_message',
        data: {
          id: newMessage.id,
          fromUser: currentUser,
          toUser,
          content: processedContent, // Contains NLC transmission result
          timestamp: newMessage.timestamp.toISOString(),
          isNonLocal,
          correlationCoefficient: newMessage.correlationCoefficient,
          resonanceSignature,
          quantumPhase
        }
      }));
    }
    
    // Update local chat history
    setDiscoveredUsers(prev =>
      prev.map(user => {
        if (user.id === toUser) {
          return {
            ...user,
            chatHistory: [...user.chatHistory, {
              role: 'user' as const,
              content: processedContent,
              timestamp: Date.now()
            }]
          };
        }
        return user;
      })
    );
  }, [currentUser, entangledUsers, encodeMemoryToPrimes]);

  // Broadcast quantum announcement
  const broadcastAnnouncement = useCallback((message: string) => {
    if (!message.trim()) return;

    const announcement: GlobalAnnouncement = {
      id: Date.now(),
      nodeOrigin: currentUser,
      nodeName: currentUser,
      message: message,
      timestamp: new Date().toISOString(),
      resonanceSignature: encodeMemoryToPrimes(message),
      entanglementStrength: networkMetrics.globalEntanglementStrength
    };

    setGlobalAnnouncements(prev => [announcement, ...prev.slice(0, 49)]);
  }, [currentUser, networkMetrics.globalEntanglementStrength, encodeMemoryToPrimes]);

  // Get messages for a specific user conversation
  const getConversationMessages = useCallback((userId: string): QuantumMessage[] => {
    return messages.filter(msg => 
      (msg.fromUser === currentUser && msg.toUser === userId) ||
      (msg.fromUser === userId && msg.toUser === currentUser)
    );
  }, [messages, currentUser]);

  // Get user by ID
  const getUserById = useCallback((userId: string): QuantumUser | undefined => {
    return discoveredUsers.find(u => u.id === userId);
  }, [discoveredUsers]);

  // Check if user is entangled
  const isUserEntangled = useCallback((userId: string): boolean => {
    return entangledUsers.includes(userId);
  }, [entangledUsers]);

  // Get entanglement strength for a user
  const getEntanglementStrength = useCallback((userId: string): number => {
    const user = discoveredUsers.find(u => u.id === userId);
    return user?.entanglementStrength || 0;
  }, [discoveredUsers]);

  return {
    // State
    currentUser,
    isConnected,
    discoveredUsers,
    entangledUsers,
    messages,
    globalAnnouncements,
    networkPhase,
    networkMetrics,
    sharedPhaseState,

    // Actions
    connectToNetwork,
    entangleWithUser,
    sendQuantumMessage,
    broadcastAnnouncement,

    // Utilities
    getConversationMessages,
    getUserById,
    isUserEntangled,
    getEntanglementStrength,
    encodeMemoryToPrimes,
    calculateNonLocalCorrelation
  };
};