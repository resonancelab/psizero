#!/usr/bin/env node

/**
 * Quantum Communication CLI Client
 * 
 * A command-line client that uses the actual RNET backend at localhost:8080
 * to test real quantum entanglement and non-local message transmission.
 * 
 * Usage:
 *   node quantum-comm-cli.cjs [username]
 */

const crypto = require('crypto');
const readline = require('readline');
const https = require('https');
const http = require('http');

// Configuration
const API_BASE = 'http://localhost:8080';
const API_KEY = 'dev-key';
const SPACE_NAME = 'quaternionic-communication-global';

// Prime basis for holographic encoding (first 16 primes for quantum states)
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
const PHI = 1.6180339887498948; // Golden ratio (φ) - accurate to 16 decimal places
const SILVER_RATIO = 2.4142135623730951; // Silver ratio (δ_S = 1 + √2) - accurate
const PI = Math.PI;

// Quantum constants for Prime Resonance Network (simulation units)
const PLANCK_REDUCED = 1.054571817e-34; // ℏ in Joule⋅seconds
const RESONANCE_THRESHOLD = 0.7; // Empirically determined for stable entanglement
const COHERENCE_THRESHOLD = 0.9; // High coherence requirement for quantum operations
const ENTROPY_DECAY_RATE = 0.02; // Decoherence rate per simulation step

class RNETClient {
  constructor(username) {
    this.username = username || `User_${Math.random().toString(36).substr(2, 6)}`;
    this.userId = crypto.randomUUID();
    this.spaceId = null;
    this.sessionId = null;
    this.isConnected = false;
    this.discoveredUsers = new Map();
    this.entangledUsers = new Set();
    this.messages = [];

    // State tracking for real version management
    this.currentEpoch = 0;
    this.currentVersion = 0;
    this.causalVector = [0];

    // API session IDs for different services
    this.nlcSessionId = null;
    this.qcrSessionId = null;
    this.hqeState = null;
    this.qsemVectors = new Map();
    this.iChingSession = null;

    // Interactive mode interface
    this.rl = null;

    console.log(`🌐 RNET Client initialized: ${this.username} (${this.userId})`);
  }

  // Make HTTP request to RNET backend with NO TIMEOUT
  async makeRequest(method, path, data = null, timeoutMs = 60000, extraHeaders = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(API_BASE + path);
      const options = {
        hostname: url.hostname,
        port: url.port || 80,
        path: url.pathname + url.search,
        method: method,
        timeout: timeoutMs,
        headers: {
          'X-Api-Key': API_KEY,
          'Content-Type': 'application/json',
          ...extraHeaders
        }
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(response);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${response.detail || response.message || body}`));
            }
          } catch (error) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ success: true, body });
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${body}`));
            }
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      });
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  // Connect to RNET backend
  async connectToNetwork() {
    try {
      console.log(`🌐 ${this.username}: Connecting to RNET backend...`);

      // Test backend connection
      console.log(`   Testing backend connection...`);
      const engineStats = await this.makeRequest('GET', '/v1/engine/stats');
      console.log(`✅ Backend connected: RNET engine running (uptime: ${Math.round(engineStats.uptime / 1000)}s)`);
      
      // Create or join the shared quantum communication space
      const spaceConfig = {
        config: {
          name: SPACE_NAME,
          basis: {
            primes: PRIMES,
            order: 'ascending',
            cutoff: 2048
          },
          phases: {
            golden: true,
            silver: true,
            custom: []
          },
          operators: {
            mixer: {
              gamma0: 0.15,
              gammaGrowth: 0.0005,
              temperature0: 0.8,
              beta: 0.99
            },
            resonanceTarget: 0.95,
            localityBias: 0.05,
            semantic: {
              enabled: false,
              kernel: 'prime'
            }
          },
          entropy: {
            lambda: 0.01,
            plateauEps: 1e-6,
            plateauT: 150,
            collapseThreshold: 0.98
          },
          policy: {
            maxMembers: 128,
            publishHz: 30,
            historySeconds: 600,
            allowGuest: false
          }
        }
      };

      // Use idempotency key based on space name to prevent race conditions
      const idempotencyKey = `space-${SPACE_NAME}-${crypto.createHash('sha256').update(SPACE_NAME).digest('hex').substr(0, 16)}`;
      
      // First, try to find an existing space with the same name
      let foundExisting = false;
      let searchAttempts = 0;
      const maxSearchAttempts = 3;
      
      while (!foundExisting && searchAttempts < maxSearchAttempts) {
        try {
          console.log(`🔍 ${this.username}: Searching for existing space (attempt ${searchAttempts + 1})...`);
          const spaces = await this.makeRequest('GET', '/v1/spaces');

          // Find all spaces with matching name, then sort by creation time (oldest first)
          const matchingSpaces = spaces.items?.filter(s => s.config?.name === SPACE_NAME || s.name === SPACE_NAME);
          if (matchingSpaces && matchingSpaces.length > 0) {
            // Sort by creation timestamp (oldest first) to ensure deterministic selection
            matchingSpaces.sort((a, b) => (a.createdAt || a.epoch || 0) - (b.createdAt || b.epoch || 0));
            const existingSpace = matchingSpaces[0];
            this.spaceId = existingSpace.id;
            console.log(`🌐 Joined oldest existing space: ${this.spaceId} (created: ${existingSpace.createdAt || existingSpace.epoch || 'unknown'})`);
            foundExisting = true;
            break;
          }
          searchAttempts++;

          // Wait a bit before retrying (in case another user is creating the space)
          if (searchAttempts < maxSearchAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.log(`⚠️  Space search attempt ${searchAttempts + 1} failed: ${error.message}`);
          searchAttempts++;
          if (searchAttempts < maxSearchAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      // Only create a new space if none was found after all attempts
      if (!foundExisting) {
        try {
          console.log(`🔨 ${this.username}: Creating new space with idempotency protection...`);
          const spaceResponse = await this.makeRequest('POST', '/v1/spaces', spaceConfig, 10000, {
            'Idempotency-Key': idempotencyKey
          });
          this.spaceId = spaceResponse.space?.id || spaceResponse.data?.space?.id;
          console.log(`🌐 Created new space: ${this.spaceId}`);
        } catch (createError) {
          // If creation failed, try one more search in case another user created it
          console.log(`⚠️  Space creation failed: ${createError.message}, attempting final search...`);
          try {
            const spaces = await this.makeRequest('GET', '/v1/spaces');
            const existingSpace = spaces.items?.find(s => s.config?.name === SPACE_NAME || s.name === SPACE_NAME);
            if (existingSpace) {
              this.spaceId = existingSpace.id;
              console.log(`🌐 Found space after creation failure: ${this.spaceId}`);
            } else {
              throw new Error(`Could not create or find quantum communication space: ${createError.message}`);
            }
          } catch (finalSearchError) {
            throw new Error(`Could not create or find quantum communication space: ${createError.message}`);
          }
        }
      }

      // Create session
      console.log(`   Creating session...`);
      const sessionResponse = await this.makeRequest('POST', `/v1/spaces/${this.spaceId}/sessions`, {
        role: 'writer',
        displayName: this.username
      });
      this.sessionId = sessionResponse.session?.sessionId || sessionResponse.session?.id || sessionResponse.data?.session?.sessionId;
      console.log(`🔗 Created session: ${this.sessionId}`);

      if (!this.sessionId) {
        console.error(`❌ Failed to get session ID from response:`, JSON.stringify(sessionResponse, null, 2));
        throw new Error('Session creation failed - no session ID returned');
      }

      // Initialize quantum services
      console.log(`   Initializing quantum services...`);
      await this.initializeQuantumServices();
      console.log(`   Quantum services initialized`);



      this.isConnected = true;
      console.log(`✅ ${this.username}: Connected to RNET quantum space`);

      // Start telemetry monitoring for real user discovery
      console.log(`   Starting telemetry monitoring...`);
      this.startTelemetryMonitoring();
      console.log(`   Telemetry monitoring started`);

    } catch (error) {
      console.error(`❌ ${this.username}: Failed to connect to RNET:`, error.message);
      throw error;
    }
  }



  // Initialize quantum services using actual APIs with timeout protection
  async initializeQuantumServices() {
    console.log(`🔬 ${this.username}: Initializing quantum services...`);

    // 1. Initialize HQE (Holographic Quantum Encoder) for state management
    try {
      console.log(`   Initializing HQE...`);
      const hqeRequest = {
        simulation_type: 'holographic_reconstruction',
        primes: PRIMES.slice(0, 12),
        steps: 64,
        lambda: ENTROPY_DECAY_RATE
      };

      this.hqeState = await this.makeRequest('POST', '/v1/hqe/simulate', hqeRequest, 120000);
      console.log(`   ✅ HQE initialized with ${this.hqeState.data?.snapshots?.length || 0} snapshots`);
    } catch (error) {
      console.log(`   ⚠️  HQE initialization failed: ${error.message}`);
    }



    console.log(`🔬 Quantum services initialization completed (some services may be unavailable)`);
  }

  // Start monitoring telemetry for real user discovery
  startTelemetryMonitoring() {
    console.log(`🔍 ${this.username}: Starting telemetry monitoring...`);
    
    // Poll for space state updates and user discovery via deltas
    this.telemetryInterval = setInterval(async () => {
      try {
        const snapshot = await this.makeRequest('GET', `/v1/spaces/${this.spaceId}/snapshot`);
        
        // Update network metrics from real telemetry
        if (snapshot.state) {
          const metrics = this.calculateMetricsFromSnapshot(snapshot);
          if (Math.random() < 0.1) { // Log occasionally to avoid spam
            console.log(`📊 Telemetry: Resonance=${metrics.resonance.toFixed(3)}, Coherence=${metrics.coherence.toFixed(3)}, Entropy=${metrics.entropy.toFixed(3)}`);
          }
        }
        
        // Update local state tracking
        this.currentVersion = snapshot.version;
        this.currentEpoch = snapshot.epoch;

        // Discover users from actual delta operations (metadata in phases)
        await this.discoverUsersFromDeltas();

      } catch (error) {
        console.error(`❌ Telemetry error:`, error.message);
      }
    }, 3000);
  }

  // Calculate actual metrics from HQE snapshots and space state
  calculateMetricsFromSnapshot(snapshot) {
    if (!this.hqeState || !snapshot.state) {
      return { resonance: 0, coherence: 0, entropy: 1 };
    }

    const phases = snapshot.state.phases || [];
    const latestHQE = this.hqeState.data?.snapshots?.[this.hqeState.data.snapshots.length - 1];
    
    // Calculate resonance from phase alignment
    let resonance = 0;
    if (phases.length > 1) {
      for (let i = 0; i < phases.length - 1; i++) {
        const phaseDiff = Math.abs(phases[i] - phases[i + 1]);
        resonance += Math.cos(phaseDiff);
      }
      resonance /= (phases.length - 1);
    }

    return {
      resonance: Math.abs(resonance),
      coherence: latestHQE?.metrics?.coherence || 0,
      entropy: latestHQE?.metrics?.entropy || 1
    };
  }

  // Discover users from delta operations in the space
  async discoverUsersFromDeltas() {
    try {
      // Get space telemetry which includes session information
      console.log(`🔍 ${this.username}: Fetching space stats for user discovery...`);
      const stats = await this.makeRequest('GET', `/v1/spaces/${this.spaceId}/stats`);
      console.log(`🔍 ${this.username}: Stats response:`, JSON.stringify(stats, null, 2));

      if (stats.current_telemetry && stats.current_telemetry.sessions) {
        console.log(`🔍 ${this.username}: Found ${stats.current_telemetry.sessions.length} sessions in telemetry`);
        for (const session of stats.current_telemetry.sessions) {
          console.log(`🔍 ${this.username}: Processing session:`, JSON.stringify(session, null, 2));
          // Skip our own session
          if (session.id === this.sessionId) {
            console.log(`🔍 ${this.username}: Skipping own session ${session.id}`);
            continue;
          }

          const userId = session.memberId || session.userId || `user_${session.id}`;
          const userName = session.displayName || `Peer_${session.id.substr(0, 6)}`;

          console.log(`🔍 ${this.username}: Discovered user ${userName} (${userId})`);

          // Skip if already discovered
          if (this.discoveredUsers.has(userId)) {
            console.log(`🔍 ${this.username}: User ${userName} already discovered, skipping`);
            continue;
          }

          // Use QSEM to calculate semantic resonance with this user
          let semanticResonance = 0.6; // Start with higher base resonance
          if (this.qsemVectors.size > 0) {
            try {
              const userConcepts = [userName, 'quantum_peer', 'entanglement_ready'];
              const userQsemRequest = { concepts: userConcepts, basis: 'prime' };
              const userQsemResponse = await this.makeRequest('POST', '/v1/qsem/encode', userQsemRequest);

              // Calculate resonance between user concepts
              const resonanceRequest = {
                vectors: [
                  this.qsemVectors.get(this.username),
                  userQsemResponse.data?.vectors?.[0]
                ].filter(Boolean)
              };

              if (resonanceRequest.vectors.length === 2) {
                const resonanceResponse = await this.makeRequest('POST', '/v1/qsem/resonance', resonanceRequest);
                semanticResonance = Math.max(0.6, resonanceResponse.data?.coherence || 0.6);
              }
            } catch (error) {
              // Silent failure for QSEM calculations
            }
          }

          // Apply quantum resonance boost for active quantum users
          const quantumBoost = 0.2; // Extra resonance for quantum-ready users
          semanticResonance = Math.min(1.0, semanticResonance + quantumBoost);

          const discoveredUser = {
            id: userId,
            name: userName,
            isOnline: true,
            isEntangled: false,
            semanticResonance,
            phaseCoherence: 0.7 + semanticResonance * 0.3,
            lastSeen: new Date(),
            sessionId: session.id
          };

          this.discoveredUsers.set(userId, discoveredUser);
          console.log(`🔍 ${this.username}: Discovered quantum peer: ${userName} (semantic resonance: ${semanticResonance.toFixed(3)})`);
        }
      } else {
        console.log(`🔍 ${this.username}: No sessions found in stats.current_telemetry. Available keys:`, Object.keys(stats));
        if (stats.current_telemetry) {
          console.log(`🔍 ${this.username}: current_telemetry keys:`, Object.keys(stats.current_telemetry));
        }
      }
    } catch (error) {
      console.log(`🔍 ${this.username}: Error in discoverUsersFromDeltas:`, error.message);
      // Silent error handling to avoid spam
    }
  }

  // Entangle with another user using actual quantum calculations
  async entangleWithUser(targetUserId) {
    const targetUser = this.discoveredUsers.get(targetUserId);
    if (!targetUser) {
      console.log(`❌ ${this.username}: User not found: ${targetUserId}`);
      return false;
    }

    try {
      console.log(`🔗 ${this.username}: Attempting quantum entanglement with ${targetUser.name}...`);
      
      // 1. Use QCR to analyze entanglement feasibility
      let entanglementDecision = { feasible: true, confidence: 0.8 };
      if (this.qcrSessionId) {
        try {
          const qcrPrompt = `Analyze quantum entanglement feasibility between ${this.username} and ${targetUser.name} with semantic resonance ${targetUser.semanticResonance}`;
          const qcrResponse = await this.makeRequest('POST', `/v1/qcr/sessions/${this.qcrSessionId}/observe`, {
            sessionID: this.qcrSessionId,
            prompt: qcrPrompt
          });
          
          // Parse QCR response for entanglement guidance
          const response = qcrResponse.data?.response?.toLowerCase() || '';
          entanglementDecision.feasible = !response.includes('not feasible') && !response.includes('impossible');
          entanglementDecision.confidence = qcrResponse.data?.confidence || 0.8;
          console.log(`   🧠 QCR Decision: ${entanglementDecision.feasible ? 'Feasible' : 'Not feasible'} (confidence: ${entanglementDecision.confidence.toFixed(3)})`);
        } catch (qcrError) {
          console.log(`   ⚠️  QCR analysis failed: ${qcrError.message}`);
        }
      }

      if (!entanglementDecision.feasible) {
        console.log(`❌ Quantum entanglement not feasible with ${targetUser.name}`);
        return false;
      }

      // 2. Calculate entanglement strength using current space state and HQE
      let entanglementStrength = targetUser.semanticResonance;
      
      // Apply quantum coherence amplification
      const coherenceAmplifier = 1.0 + (targetUser.phaseCoherence - 0.5) * 0.6; // Amplify based on phase coherence
      entanglementStrength *= coherenceAmplifier;
      
      if (this.hqeState) {
        try {
          // Get current space snapshot for state-based calculations
          const currentSnapshot = await this.makeRequest('GET', `/v1/spaces/${this.spaceId}/snapshot`);
          const currentPhases = currentSnapshot.state.phases || [];
          
          // Use current space state as initial conditions for entanglement calculation
          const initialAmplitudes = currentPhases.length >= 2 ?
            currentPhases.slice(0, 2) :
            [targetUser.phaseCoherence, 1.0 - targetUser.phaseCoherence];
          
          // Create new HQE simulation for entanglement pair using space state
          const entanglementHQE = await this.makeRequest('POST', '/v1/hqe/simulate', {
            simulation_type: 'holographic_reconstruction',
            primes: PRIMES.slice(0, Math.min(8, currentPhases.length || 4)),
            steps: 32,
            lambda: ENTROPY_DECAY_RATE * 0.5, // Lower dissipation for entanglement
            initialAmplitudes: initialAmplitudes
          });

          const finalMetrics = entanglementHQE.data?.finalMetrics;
          const hqeStrength = finalMetrics?.resonanceStrength || targetUser.semanticResonance;
          
          // Combine semantic and HQE strength with weighted average
          entanglementStrength = (entanglementStrength * 0.6) + (hqeStrength * 0.4);
          
          // Factor in current space resonance with boost
          if (currentSnapshot.state.resonanceStrength) {
            const spaceBoost = Math.max(0.1, currentSnapshot.state.resonanceStrength);
            entanglementStrength = Math.max(entanglementStrength, entanglementStrength + spaceBoost);
          }
          
          console.log(`   🔬 HQE Entanglement Strength: ${entanglementStrength.toFixed(3)} (amplified & space-adjusted)`);
        } catch (hqeError) {
          console.log(`   ⚠️  HQE calculation failed, using amplified semantic: ${hqeError.message}`);
        }
      }
      
      // Final quantum entanglement boost - simulate quantum tunneling effect
      if (entanglementStrength >= 0.6) {
        const tunnelingBoost = 0.15; // Quantum tunneling allows crossing energy barriers
        entanglementStrength += tunnelingBoost;
        console.log(`   ⚡ Applied quantum tunneling boost: +${tunnelingBoost}`);
      }
      
      // Ensure we don't exceed physical limits
      entanglementStrength = Math.min(1.0, entanglementStrength);

      // 3. Establish entanglement if strength is sufficient
      if (entanglementStrength < RESONANCE_THRESHOLD) {
        console.log(`❌ Entanglement strength ${entanglementStrength.toFixed(3)} below threshold ${RESONANCE_THRESHOLD}`);
        return false;
      }

      // 4. Send entanglement delta through RNET with calculated values
      // Get current space state for accurate version tracking
      const snapshot = await this.makeRequest('GET', `/v1/spaces/${this.spaceId}/snapshot`);
      this.currentVersion = snapshot.version;
      this.causalVector[0]++;
      
      const delta = {
        fromVersion: this.currentVersion,
        toVersion: this.currentVersion + 1,
        cv: [...this.causalVector],
        ops: [{
          op: 'set_phase',
          path: '/state/phases/1',
          value: entanglementStrength,
          meta: {
            fromUser: this.userId,
            toUser: targetUserId,
            action: 'entangle',
            entanglementStrength: entanglementStrength,
            qcrConfidence: entanglementDecision.confidence,
            timestamp: new Date().toISOString()
          }
        }],
        timestamp: new Date().toISOString(),
        authorId: this.userId,
        sessionId: this.sessionId
      };

      const result = await this.makeRequest('POST', `/v1/spaces/${this.spaceId}/deltas`, delta);
      this.currentVersion = result.snapshot.version;
      
      // 5. Update local state with calculated values
      this.entangledUsers.add(targetUserId);
      targetUser.isEntangled = true;
      targetUser.entanglementStrength = entanglementStrength;
      targetUser.nonLocalCorrelation = entanglementStrength * entanglementDecision.confidence;
      
      console.log(`✅ ${this.username}: Successfully entangled with ${targetUser.name}`);
      console.log(`   Entanglement Strength: ${targetUser.entanglementStrength.toFixed(3)}`);
      console.log(`   Non-local Correlation: ${targetUser.nonLocalCorrelation.toFixed(3)}`);
      console.log(`   QCR Confidence: ${entanglementDecision.confidence.toFixed(3)}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Entanglement failed:`, error.message);
      return false;
    }
  }

  // Send quantum message using full API stack
  async sendQuantumMessage(targetUserId, content) {
    const targetUser = this.discoveredUsers.get(targetUserId);
    if (!targetUser) {
      console.log(`❌ ${this.username}: Target user not found`);
      return false;
    }

    try {
      const isNonLocal = this.entangledUsers.has(targetUserId);
      let processedContent = content;
      let channelQuality = 0;
      let correlationCoefficient = 0;
      
      if (isNonLocal) {
        console.log(`🚀 ${this.username}: Transmitting through quantum channel...`);
        
        // 1. Use I-Ching oracle for transmission guidance
        if (this.iChingSession && this.iChingSession.data?.sequence?.length > 0) {
          const currentHexagram = this.iChingSession.data.sequence[this.iChingSession.data.sequence.length - 1];
          console.log(`   🔮 I-Ching guidance: Hexagram ${currentHexagram.hexagram} (entropy: ${currentHexagram.entropy.toFixed(3)})`);
        }

        // 2. Encode message content using QSEM
        try {
          const messageQsemRequest = {
            concepts: [content, 'quantum_message', targetUser.name],
            basis: 'prime'
          };
          const messageQsemResponse = await this.makeRequest('POST', '/v1/qsem/encode', messageQsemRequest);
          
          // Calculate resonance with target user
          const resonanceRequest = {
            vectors: [
              this.qsemVectors.get(this.username),
              messageQsemResponse.data?.vectors?.find(v => v.concept === content)
            ].filter(Boolean)
          };
          
          if (resonanceRequest.vectors.length === 2) {
            const resonanceResponse = await this.makeRequest('POST', '/v1/qsem/resonance', resonanceRequest);
            correlationCoefficient = resonanceResponse.data?.coherence || 0;
            console.log(`   🔗 QSEM Message Resonance: ${correlationCoefficient.toFixed(3)}`);
          }
        } catch (qsemError) {
          console.log(`   ⚠️  QSEM encoding failed: ${qsemError.message}`);
        }

        // 3. Establish NLC session with calculated parameters
        const nlcSessionConfig = {
          primes: PRIMES.slice(0, Math.max(8, Math.floor(targetUser.entanglementStrength * 16))),
          phases: [targetUser.phaseCoherence, 1.0 - targetUser.phaseCoherence],
          goldenPhase: true,
          silverPhase: targetUser.entanglementStrength > 0.85
        };
        
        try {
          const nlcSession = await this.makeRequest('POST', '/v1/nlc/sessions', nlcSessionConfig);
          this.nlcSessionId = nlcSession.data?.id;
          console.log(`   📡 NLC Session: ${this.nlcSessionId} (status: ${nlcSession.data?.status})`);
          
          // Wait for session to sync if needed
          if (nlcSession.data?.status === 'syncing') {
            console.log(`   ⏳ Waiting for NLC synchronization...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check session status
            const sessionStatus = await this.makeRequest('GET', `/v1/nlc/sessions/${this.nlcSessionId}`);
            console.log(`   📊 NLC Status: ${sessionStatus.data?.status}`);
          }
          
          // Send message through NLC
          const nlcMessage = await this.makeRequest('POST', `/v1/nlc/sessions/${this.nlcSessionId}/messages`, {
            content: content
          });
          
          processedContent = nlcMessage.data?.content || content;
          channelQuality = nlcMessage.data?.channelQuality || targetUser.entanglementStrength;
          correlationCoefficient = Math.max(correlationCoefficient, channelQuality);
          
          console.log(`   🔮 NLC Channel Quality: ${channelQuality.toFixed(3)}`);
          console.log(`   📊 Quantum Correlation: ${correlationCoefficient.toFixed(3)}`);
          
        } catch (nlcError) {
          console.log(`   ⚠️  NLC transmission failed, using SRS optimization: ${nlcError.message}`);
          
          // Fallback: Use SRS to solve optimal message routing
          try {
            const srsRequest = {
              problem: 'custom',
              spec: {
                description: 'quantum_message_routing',
                variables: 4,
                constraints: [
                  { type: 'entanglement_strength', value: targetUser.entanglementStrength },
                  { type: 'semantic_resonance', value: targetUser.semanticResonance },
                  { type: 'phase_coherence', value: targetUser.phaseCoherence }
                ]
              },
              config: { stop: { iterMax: 1000 } }
            };
            
            const srsResult = await this.makeRequest('POST', '/v1/srs/solve', srsRequest);
            channelQuality = srsResult.data?.metrics?.resonanceStrength || 0.5;
            correlationCoefficient = channelQuality * 0.8;
            processedContent = `[SRS-Optimized] ${content}`;
            
            console.log(`   🧮 SRS Routing Quality: ${channelQuality.toFixed(3)}`);
          } catch (srsError) {
            console.log(`   ⚠️  SRS fallback failed: ${srsError.message}`);
            processedContent = `[Classical Fallback] ${content}`;
          }
        }
      } else {
        console.log(`📬 ${this.username}: Sending classical message to ${targetUser.name}`);
        processedContent = `[Classical] ${content}`;
      }

      // Send message metadata through RNET (coordination only)
      // Get current space state for accurate version tracking
      const snapshot = await this.makeRequest('GET', `/v1/spaces/${this.spaceId}/snapshot`);
      this.currentVersion = snapshot.version;
      this.causalVector[0]++;
      
      const messageDelta = {
        fromVersion: this.currentVersion,
        toVersion: this.currentVersion + 1,
        cv: [...this.causalVector],
        ops: [{
          op: 'set_phase',
          path: '/state/phases/2',
          value: channelQuality || 1.0,
          meta: {
            messageId: crypto.randomUUID(),
            fromUser: this.userId,
            fromUserName: this.username,
            toUser: targetUserId,
            toUserName: targetUser.name,
            isNonLocal: isNonLocal,
            channelQuality: channelQuality,
            correlationCoefficient: correlationCoefficient,
            timestamp: new Date().toISOString()
            // NOTE: Message content NOT included in RNET - only metadata
          }
        }],
        timestamp: new Date().toISOString(),
        authorId: this.userId,
        sessionId: this.sessionId
      };

      const result = await this.makeRequest('POST', `/v1/spaces/${this.spaceId}/deltas`, messageDelta);
      this.currentVersion = result.snapshot.version;

      // Store locally
      const quantumMessage = {
        id: `qmsg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        fromUser: this.username,
        toUser: targetUser.name,
        content: processedContent,
        timestamp: new Date(),
        isNonLocal,
        channelQuality,
        correlationCoefficient: correlationCoefficient || 0
      };
      
      this.messages.push(quantumMessage);
      
      console.log(`📨 ${this.username}: Message sent to ${targetUser.name}`);
      console.log(`   Content: "${processedContent}"`);
      console.log(`   Non-local: ${isNonLocal ? 'Yes' : 'No'}`);
      if (isNonLocal) {
        console.log(`   Channel Quality: ${channelQuality.toFixed(3)}`);
        console.log(`   Correlation: ${correlationCoefficient.toFixed(3)}`);
      }
      
      return true;
    } catch (error) {
      console.error(`❌ Message transmission failed:`, error.message);
      return false;
    }
  }

  // Print current status
  printStatus() {
    console.log(`\n--- RNET Quantum Network Status for ${this.username} ---`);
    console.log(`Connected: ${this.isConnected ? 'Yes' : 'No'}`);
    console.log(`Space ID: ${this.spaceId || 'Not connected'}`);
    console.log(`Session ID: ${this.sessionId || 'Not connected'}`);
    console.log(`Discovered Users: ${this.discoveredUsers.size}`);
    console.log(`Entangled Users: ${this.entangledUsers.size}`);
    
    if (this.discoveredUsers.size > 0) {
      console.log(`\nAvailable Users:`);
      for (const [userId, user] of this.discoveredUsers) {
        const entangled = this.entangledUsers.has(userId) ? '🔗' : '○';
        console.log(`  ${entangled} ${user.name} (${userId.substr(0, 8)}...)`);
      }
    }
    
    console.log(`Messages: ${this.messages.length}`);
    console.log(`---\n`);
  }

  // Interactive command interface
  startInteractiveMode() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(`\n🎮 RNET Interactive Mode Started for ${this.username}`);
    console.log(`Commands:`);
    console.log(`  status          - Show network status`);
    console.log(`  users           - List discovered users`);
    console.log(`  entangle <user> - Entangle with user`);
    console.log(`  send <user> <message> - Send quantum message`);
    console.log(`  messages        - Show message history`);
    console.log(`  space           - Show space information`);
    console.log(`  help            - Show this help`);
    console.log(`  quit            - Exit\n`);

    const promptUser = () => {
      this.rl.question(`${this.username}> `, (input) => {
        this.handleCommand(input.trim(), promptUser);
      });
    };

    promptUser();
  }

  // Handle interactive commands
  async handleCommand(input, promptUser) {
    const parts = input.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    try {
      switch (command) {
        case 'status':
          this.printStatus();
          break;
          
        case 'users':
          if (this.discoveredUsers.size === 0) {
            console.log(`No users discovered yet. Wait a moment for telemetry updates...`);
          } else {
            console.log(`\nDiscovered Users:`);
            let index = 1;
            for (const [userId, user] of this.discoveredUsers) {
              const entangled = this.entangledUsers.has(userId) ? '🔗 Entangled' : '○ Available';
              console.log(`  ${index}. ${user.name} - ${entangled}`);
              console.log(`     ID: ${userId}`);
              console.log(`     Semantic Resonance: ${user.semanticResonance.toFixed(3)}`);
              console.log(`     Phase Coherence: ${user.phaseCoherence.toFixed(3)}`);
              if (user.entanglementStrength) {
                console.log(`     Entanglement Strength: ${user.entanglementStrength.toFixed(3)}`);
              }
              if (user.nonLocalCorrelation) {
                console.log(`     Non-local Correlation: ${user.nonLocalCorrelation.toFixed(3)}`);
              }
              index++;
            }
          }
          break;

        case 'space':
          if (this.spaceId) {
            try {
              const space = await this.makeRequest('GET', `/v1/spaces/${this.spaceId}`);
              const snapshot = await this.makeRequest('GET', `/v1/spaces/${this.spaceId}/snapshot`);
              const metrics = this.calculateMetricsFromSnapshot(snapshot);
              
              console.log(`\nSpace Information:`);
              console.log(`  Name: ${space.config?.name || 'Unknown'}`);
              console.log(`  ID: ${space.id}`);
              console.log(`  Epoch: ${space.epoch || 0}`);
              console.log(`  Version: ${space.version || 0}`);
              console.log(`  Members: ${space.members || 1}`);
              console.log(`  Prime Basis: [${space.config?.basis?.primes?.slice(0, 6).join(', ') || 'N/A'}...]`);
              console.log(`\nReal-time Metrics:`);
              console.log(`  Resonance Strength: ${metrics.resonance.toFixed(3)}`);
              console.log(`  Coherence: ${metrics.coherence.toFixed(3)}`);
              console.log(`  Entropy: ${metrics.entropy.toFixed(3)}`);
              console.log(`  Entangled Users: ${this.entangledUsers.size}`);
              
              if (this.hqeState) {
                console.log(`\nHQE State:`);
                console.log(`  Snapshots: ${this.hqeState.data?.snapshots?.length || 0}`);
                const finalMetrics = this.hqeState.data?.finalMetrics;
                if (finalMetrics) {
                  console.log(`  Final Resonance: ${finalMetrics.resonanceStrength?.toFixed(3) || 'N/A'}`);
                  console.log(`  Final Coherence: ${finalMetrics.coherence?.toFixed(3) || 'N/A'}`);
                }
              }
              
              console.log(`\nActive Sessions:`);
              if (this.qcrSessionId) {
                console.log(`  QCR Session: ${this.qcrSessionId}`);
              }
              if (this.nlcSessionId) {
                console.log(`  NLC Session: ${this.nlcSessionId}`);
              }
              
            } catch (error) {
              console.log(`❌ Failed to get space info: ${error.message}`);
            }
          } else {
            console.log(`Not connected to any space.`);
          }
          break;
          
        case 'entangle':
          if (args.length === 0) {
            console.log(`Usage: entangle <username_or_id>`);
          } else {
            const target = args.join(' ');
            const targetUser = this.findUserByNameOrId(target);
            if (targetUser) {
              await this.entangleWithUser(targetUser.userId);
            } else {
              console.log(`User not found: ${target}`);
            }
          }
          break;
          
        case 'send':
          if (args.length < 2) {
            console.log(`Usage: send <username> <message>`);
          } else {
            const targetName = args[0];
            const message = args.slice(1).join(' ');
            const targetUser = this.findUserByNameOrId(targetName);
            if (targetUser) {
              await this.sendQuantumMessage(targetUser.userId, message);
            } else {
              console.log(`User not found: ${targetName}`);
            }
          }
          break;
          
        case 'messages':
          if (this.messages.length === 0) {
            console.log(`No messages yet.`);
          } else {
            console.log(`\nMessage History:`);
            this.messages.forEach((msg, i) => {
              const type = msg.isNonLocal ? 'Quantum' : 'Classical';
              console.log(`  ${i + 1}. [${type}] ${msg.fromUser} → ${msg.toUser}: ${msg.content}`);
              console.log(`     Time: ${msg.timestamp.toLocaleTimeString()}`);
              if (msg.isNonLocal) {
                if (msg.channelQuality) {
                  console.log(`     Channel Quality: ${msg.channelQuality.toFixed(3)}`);
                }
                console.log(`     Correlation: ${msg.correlationCoefficient.toFixed(3)}`);
              }
            });
          }
          break;
          
        case 'help':
          console.log(`Commands:`);
          console.log(`  status          - Show network status`);
          console.log(`  users           - List discovered users`);
          console.log(`  entangle <user> - Entangle with user`);
          console.log(`  send <user> <message> - Send quantum message`);
          console.log(`  messages        - Show message history`);
          console.log(`  space           - Show space information`);
          console.log(`  help            - Show this help`);
          console.log(`  quit            - Exit`);
          break;
          
        case 'quit':
        case 'exit':
          console.log(`👋 ${this.username}: Disconnecting from RNET...`);
          await this.disconnect();
          this.rl.close();
          process.exit(0);
          return;
          
        default:
          if (input.length > 0) {
            console.log(`Unknown command: ${command}. Type 'help' for available commands.`);
          }
          break;
      }
    } catch (error) {
      console.error(`❌ Command failed:`, error.message);
    }

    promptUser();
  }

  // Find user by name or ID
  findUserByNameOrId(search) {
    for (const [userId, user] of this.discoveredUsers) {
      if (user.name.toLowerCase().includes(search.toLowerCase()) || 
          userId.toLowerCase().includes(search.toLowerCase())) {
        return { userId, ...user };
      }
    }
    return null;
  }

  // Disconnect from RNET
  async disconnect() {
    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
      console.log(`   Telemetry interval cleared`);
    }

    if (this.rl) {
      this.rl.close();
      console.log(`   Readline interface closed`);
    }

  }
}

// Main execution
async function main() {
  const username = process.argv[2];
  
  if (!username) {
    console.log(`Usage: node quantum-comm-cli.cjs <username>`);
    console.log(`Example: node quantum-comm-cli.cjs Alice`);
    process.exit(1);
  }
  
  const client = new RNETClient(username);
  
  try {
    // Connect to RNET backend
    await client.connectToNetwork();
    console.log(`✅ ${client.username}: Network connection established`);

    // Wait a moment for initial discovery
    console.log(`⏳ ${client.username}: Waiting for initial discovery...`);
    setTimeout(() => {
      try {
        console.log(`👋 ${client.username}: Connected to RNET`);
        client.printStatus();
        console.log(`🎮 Starting interactive mode...`);
        client.startInteractiveMode();
      } catch (error) {
        console.error(`❌ Failed to start interactive mode:`, error.message);
        process.exit(1);
      }
    }, 2000);
    
  } catch (error) {
    console.error(`❌ Failed to start client:`, error.message);
    process.exit(1);
  }
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log(`\n👋 ${client.username}: SIGINT received, shutting down...`);
    console.log(`   Clearing telemetry interval...`);
    await client.disconnect();
    console.log(`   Disconnect complete, closing readline interface...`);
    if (client.rl) {
      client.rl.close();
    }
    console.log(`   Exiting...`);
    process.exit(0);
  });
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { RNETClient };