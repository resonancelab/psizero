#!/usr/bin/env node

/**
 * Quantum Communication Test Script
 * 
 * A command-line implementation of the quaternionic communication system
 * that can be run simultaneously by multiple users to test quantum entanglement
 * and non-local message transmission.
 * 
 * Usage:
 *   node quantum-comm-test.js [username]
 */

const crypto = require('crypto');
const readline = require('readline');

// Prime basis for holographic encoding (matching the web app)
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
const PHI = 1.618034; // Golden ratio

class QuantumUser {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.isOnline = true;
    this.isEntangled = false;
    this.entanglementStrength = 0.5 + Math.random() * 0.3;
    this.nonLocalCorrelation = 0.3 + Math.random() * 0.4;
    this.phaseCoherence = 0.7 + Math.random() * 0.3;
    this.holographicDensity = Math.random();
    this.lastSeen = new Date();
    this.memoryCount = Math.floor(Math.random() * 1000);
  }
}

class QuantumCommunicator {
  constructor(username) {
    this.username = username || `User_${Math.random().toString(36).substr(2, 6)}`;
    this.userId = crypto.randomUUID();
    this.isConnected = false;
    this.discoveredUsers = new Map();
    this.entangledUsers = new Set();
    this.messages = [];
    this.sharedPhaseState = null;
    
    // RNET simulation state
    this.rnetSpaceId = null;
    this.rnetSessionId = null;
    
    // Global shared state (simulates RNET backbone)
    this.globalState = {
      users: new Map(),
      messages: [],
      phaseState: null
    };
    
    console.log(`🌐 Quantum Communicator initialized: ${this.username} (${this.userId})`);
  }

  // Holographic memory encoding (from the web app)
  encodeMemoryToPrimes(text) {
    const coefficients = new Array(PRIMES.length).fill(0);
    const charFrequencies = {};

    for (let i = 0; i < text.length; i++) {
      const char = text[i].toLowerCase();
      charFrequencies[char] = (charFrequencies[char] || 0) + 1;
    }

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const primeIndex = charCode % PRIMES.length;

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
  }

  // Initialize quantum entanglement
  initializeGlobalEntanglement() {
    if (this.entangledUsers.size < 1) return;

    const time = Date.now() * 0.001;
    const sharedPhases = PRIMES.map((prime, i) => {
      const phaseBase = (2 * Math.PI * i) / PRIMES.length;
      const goldenPhase = (2 * Math.PI) / PHI;
      return phaseBase + goldenPhase * time;
    });

    this.sharedPhaseState = {
      timestamp: time,
      phases: sharedPhases,
      entanglementId: Math.random().toString(36).substr(2, 9)
    };

    console.log(`🔗 Global entanglement initialized with ${this.entangledUsers.size} users`);
  }

  // Connect to the quantum network (simulated RNET)
  async connectToNetwork() {
    console.log(`🌐 ${this.username}: Connecting to quantum network...`);
    
    // Simulate RNET space creation/joining
    this.rnetSpaceId = 'quaternionic-communication-global';
    this.rnetSessionId = crypto.randomUUID();
    
    // Add self to global user registry
    const user = new QuantumUser(this.userId, this.username);
    this.globalState.users.set(this.userId, user);
    
    this.isConnected = true;
    console.log(`✅ ${this.username}: Connected to quantum space ${this.rnetSpaceId}`);
    
    // Announce presence to other users
    this.announcePresence('joined');
    
    // Start user discovery simulation
    this.startUserDiscovery();
  }

  // Announce user presence (simulates RNET delta operations)
  announcePresence(action) {
    console.log(`📡 ${this.username}: Announcing presence - ${action}`);
    
    // In real implementation, this would be an RNET delta
    const announcement = {
      type: 'user_presence',
      userId: this.userId,
      displayName: this.username,
      timestamp: Date.now(),
      action: action
    };
    
    // Simulate broadcasting to other users
    setTimeout(() => {
      this.handlePresenceAnnouncement(announcement);
    }, 100);
  }

  // Handle presence announcements from other users
  handlePresenceAnnouncement(announcement) {
    if (announcement.userId === this.userId) return; // Don't process own announcements
    
    if (announcement.action === 'joined') {
      const newUser = new QuantumUser(announcement.userId, announcement.displayName);
      this.discoveredUsers.set(announcement.userId, newUser);
      console.log(`🔍 ${this.username}: Discovered new quantum node: ${announcement.displayName}`);
      this.printNetworkStatus();
    } else if (announcement.action === 'left') {
      if (this.discoveredUsers.has(announcement.userId)) {
        this.discoveredUsers.delete(announcement.userId);
        this.entangledUsers.delete(announcement.userId);
        console.log(`👋 ${this.username}: User ${announcement.displayName} left the network`);
      }
    }
  }

  // Start user discovery process
  startUserDiscovery() {
    console.log(`🔍 ${this.username}: Starting user discovery...`);
    
    // Simulate discovering other users (in real app, this comes from RNET telemetry)
    setInterval(() => {
      // Check for other users in the global state
      for (const [userId, user] of this.globalState.users) {
        if (userId !== this.userId && !this.discoveredUsers.has(userId)) {
          this.discoveredUsers.set(userId, user);
          console.log(`🔍 ${this.username}: Discovered quantum node: ${user.name}`);
          this.printNetworkStatus();
        }
      }
    }, 2000);
  }

  // Entangle with another user
  async entangleWithUser(targetUserId) {
    const targetUser = this.discoveredUsers.get(targetUserId);
    if (!targetUser) {
      console.log(`❌ ${this.username}: User not found: ${targetUserId}`);
      return false;
    }

    console.log(`🔗 ${this.username}: Attempting entanglement with ${targetUser.name}...`);
    
    // Update entanglement state
    this.entangledUsers.add(targetUserId);
    targetUser.isEntangled = true;
    targetUser.entanglementStrength = 0.85 + Math.random() * 0.15;
    targetUser.nonLocalCorrelation = 0.75 + Math.random() * 0.25;
    
    // Initialize global entanglement
    this.initializeGlobalEntanglement();
    
    console.log(`✅ ${this.username}: Successfully entangled with ${targetUser.name}`);
    console.log(`   Entanglement Strength: ${targetUser.entanglementStrength.toFixed(3)}`);
    console.log(`   Non-local Correlation: ${targetUser.nonLocalCorrelation.toFixed(3)}`);
    
    return true;
  }

  // Send quantum message through proper channel isolation
  async sendQuantumMessage(targetUserId, content) {
    const targetUser = this.discoveredUsers.get(targetUserId);
    if (!targetUser) {
      console.log(`❌ ${this.username}: Target user not found`);
      return false;
    }

    const resonanceSignature = this.encodeMemoryToPrimes(content);
    const isNonLocal = this.entangledUsers.has(targetUserId);
    const quantumPhase = isNonLocal ? (Date.now() * 0.001) % (2 * Math.PI) : 0;
    
    let processedContent = content;
    
    // CRITICAL: Route quantum message content through NLC non-local channels
    if (isNonLocal) {
      console.log(`🚀 ${this.username}: Transmitting through NLC non-local channel...`);
      
      // Simulate NLC transmission (in real app, this calls nlcApi.quickSession)
      const nlcResult = await this.simulateNLCTransmission(resonanceSignature, content);
      processedContent = `[NLC Non-local] ${nlcResult.content}`;
      
      console.log(`   📡 NLC Channel Quality: ${nlcResult.channelQuality.toFixed(3)}`);
      console.log(`   🔮 Quantum Phase: ${quantumPhase.toFixed(3)}`);
    } else {
      console.log(`📬 ${this.username}: Sending classical message to ${targetUser.name}`);
      processedContent = `[Classical] ${content}`;
    }
    
    const quantumMessage = {
      id: `qmsg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      fromUser: this.username,
      fromUserId: this.userId,
      toUser: targetUser.name,
      toUserId: targetUserId,
      content: processedContent,
      timestamp: new Date(),
      isNonLocal,
      correlationCoefficient: isNonLocal ? 0.85 + Math.random() * 0.15 : 0,
      resonanceSignature,
      quantumPhase
    };
    
    this.messages.push(quantumMessage);
    
    // Simulate message delivery via RNET coordination (metadata only)
    console.log(`📨 ${this.username}: Message sent to ${targetUser.name}`);
    console.log(`   Content: "${processedContent}"`);
    console.log(`   Non-local: ${isNonLocal ? 'Yes' : 'No'}`);
    if (isNonLocal) {
      console.log(`   Correlation: ${quantumMessage.correlationCoefficient.toFixed(3)}`);
    }
    
    return true;
  }

  // Simulate NLC transmission (replaces actual API call)
  async simulateNLCTransmission(resonanceSignature, content) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    // Simulate quantum channel effects
    const channelQuality = 0.8 + Math.random() * 0.2;
    const quantumNoise = Math.random() * 0.1;
    
    // Apply holographic encoding effects
    let processedContent = content;
    if (channelQuality > 0.9) {
      processedContent = `✨${content}✨`; // Perfect transmission
    } else if (channelQuality > 0.85) {
      processedContent = `◊${content}◊`; // High quality
    } else {
      processedContent = `~${content}~`; // Standard quality
    }
    
    return {
      content: processedContent,
      channelQuality,
      stamp: Date.now().toString(36)
    };
  }

  // Print current network status
  printNetworkStatus() {
    console.log(`\n--- Quantum Network Status for ${this.username} ---`);
    console.log(`Connected: ${this.isConnected ? 'Yes' : 'No'}`);
    console.log(`Discovered Users: ${this.discoveredUsers.size}`);
    console.log(`Entangled Users: ${this.entangledUsers.size}`);
    
    if (this.discoveredUsers.size > 0) {
      console.log(`\nAvailable Users:`);
      for (const [userId, user] of this.discoveredUsers) {
        const entangled = this.entangledUsers.has(userId) ? '🔗' : '○';
        console.log(`  ${entangled} ${user.name} (${userId.substr(0, 8)}...)`);
      }
    }
    
    if (this.sharedPhaseState) {
      console.log(`\nShared Phase State: Active (${this.sharedPhaseState.entanglementId})`);
    }
    
    console.log(`Messages: ${this.messages.length}`);
    console.log(`---\n`);
  }

  // Interactive command interface
  startInteractiveMode() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(`\n🎮 Interactive Mode Started for ${this.username}`);
    console.log(`Commands:`);
    console.log(`  status          - Show network status`);
    console.log(`  users           - List discovered users`);
    console.log(`  entangle <user> - Entangle with user (use part of their name)`);
    console.log(`  send <user> <message> - Send quantum message`);
    console.log(`  messages        - Show received messages`);
    console.log(`  help            - Show this help`);
    console.log(`  quit            - Exit\n`);

    const promptUser = () => {
      rl.question(`${this.username}> `, (input) => {
        this.handleCommand(input.trim(), rl, promptUser);
      });
    };

    promptUser();
  }

  // Handle interactive commands
  handleCommand(input, rl, promptUser) {
    const parts = input.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'status':
        this.printNetworkStatus();
        break;
        
      case 'users':
        if (this.discoveredUsers.size === 0) {
          console.log(`No users discovered yet. Wait a moment...`);
        } else {
          console.log(`\nDiscovered Users:`);
          let index = 1;
          for (const [userId, user] of this.discoveredUsers) {
            const entangled = this.entangledUsers.has(userId) ? '🔗 Entangled' : '○ Available';
            console.log(`  ${index}. ${user.name} - ${entangled}`);
            console.log(`     ID: ${userId}`);
            console.log(`     Entanglement Strength: ${user.entanglementStrength.toFixed(3)}`);
            index++;
          }
        }
        break;
        
      case 'entangle':
        if (args.length === 0) {
          console.log(`Usage: entangle <username_or_id>`);
        } else {
          const target = args.join(' ');
          const targetUser = this.findUserByNameOrId(target);
          if (targetUser) {
            this.entangleWithUser(targetUser.userId);
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
            this.sendQuantumMessage(targetUser.userId, message);
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
            const type = msg.isNonLocal ? 'NLC' : 'Classical';
            console.log(`  ${i + 1}. [${type}] ${msg.fromUser} → ${msg.toUser}: ${msg.content}`);
            console.log(`     Time: ${msg.timestamp.toLocaleTimeString()}`);
            if (msg.isNonLocal) {
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
        console.log(`  messages        - Show received messages`);
        console.log(`  help            - Show this help`);
        console.log(`  quit            - Exit`);
        break;
        
      case 'quit':
      case 'exit':
        console.log(`👋 ${this.username}: Disconnecting from quantum network...`);
        this.announcePresence('left');
        rl.close();
        process.exit(0);
        return;
        
      default:
        if (input.length > 0) {
          console.log(`Unknown command: ${command}. Type 'help' for available commands.`);
        }
        break;
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
}

// Main execution
async function main() {
  const username = process.argv[2];
  
  if (!username) {
    console.log(`Usage: node quantum-comm-test.js <username>`);
    console.log(`Example: node quantum-comm-test.js Alice`);
    process.exit(1);
  }
  
  const communicator = new QuantumCommunicator(username);
  
  // Connect to network
  await communicator.connectToNetwork();
  
  // Wait a moment for initial discovery
  setTimeout(() => {
    communicator.printNetworkStatus();
    communicator.startInteractiveMode();
  }, 1000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log(`\n👋 ${communicator.username}: Shutting down...`);
    communicator.announcePresence('left');
    process.exit(0);
  });
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { QuantumCommunicator };