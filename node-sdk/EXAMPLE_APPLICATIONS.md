
# Nomyx Resonance SDK Example Applications

## Overview

This document provides comprehensive example applications demonstrating various usage patterns and capabilities of the Nomyx Resonance SDK across all 9 API subsystems.

## Quick Start Examples

### 1. Basic Space Creation and AI Engine Setup

```typescript
// examples/basic/quick-start.ts
import { ResonanceClient } from '@nomyx/resonance-sdk';

async function quickStart() {
  const client = new ResonanceClient({
    apiKey: process.env.NOMYX_API_KEY!
  });

  // Create collaborative space
  const space = await client.rnet.createSpace({
    name: 'my-first-space',
    basis: { primes: [2, 3, 5] }
  });
  
  console.log('Space created:', space.id);

  // Create AI engine
  const engine = await client.sai.createEngine({
    name: 'my-ai-engine',
    spaceId: space.id
  });
  
  console.log('Engine ready:', engine.id);

  // Generate text
  const result = await client.sai.processText(engine.id, {
    prompt: 'Hello, quantum world!',
    maxTokens: 50
  });
  
  console.log('AI says:', result.text);
}

quickStart().catch(console.error);
```

### 2. Real-time Collaboration Setup

```typescript
// examples/basic/realtime-collaboration.ts
import { ResonanceClient } from '@nomyx/resonance-sdk';

async function realtimeDemo() {
  const client = new ResonanceClient({
    apiKey: process.env.NOMYX_API_KEY!
  });

  // Create space
  const space = await client.rnet.createSpace({
    name: 'collaborative-demo',
    basis: { primes: [2, 3, 5, 7] }
  });

  // Join space for real-time collaboration
  const session = await client.rnet.joinSpace(space.id, {
    role: 'writer',
    displayName: 'Demo User'
  });

  // Listen to events
  session.on('deltaApplied', (delta) => {
    console.log('Space updated:', delta);
  });

  session.on('memberJoined', (member) => {
    console.log('New member:', member.displayName);
  });

  // Propose changes
  await session.proposeDelta({
    changes: [{
      type: 'update',
      path: 'demo.value',
      value: 'Hello from real-time!'
    }],
    metadata: {
      description: 'Demo update',
      author: 'demo-user'
    }
  });

  console.log('Real-time collaboration active');
}

realtimeDemo().catch(console.error);
```

## Intermediate Examples

### 3. Quantum-Enhanced Chatbot

```typescript
// examples/intermediate/quantum-chatbot.ts
import { ResonanceClient, SpaceSession } from '@nomyx/resonance-sdk';

class QuantumChatbot {
  private client: ResonanceClient;
  private space: any;
  private engine: any;
  private session: SpaceSession | null = null;

  constructor(apiKey: string) {
    this.client = new ResonanceClient({ apiKey });
  }

  async initialize() {
    // Create quantum-enhanced space
    this.space = await this.client.rnet.createSpace({
      name: 'quantum-chatbot-space',
      basis: { primes: [2, 3, 5, 7, 11] }
    });

    // Create AI engine with quantum enhancement
    this.engine = await this.client.sai.createEngine({
      name: 'quantum-chatbot-engine',
      spaceId: this.space.id,
      configuration: {
        model: 'transformer-quantum',
        parameters: {
          temperature: 0.8,
          quantumNoise: 0.05
        }
      }
    });

    // Join space for real-time updates
    this.session = await this.client.rnet.joinSpace(this.space.id, {
      role: 'owner',
      displayName: 'Quantum Chatbot'
    });

    console.log('Quantum chatbot initialized');
  }

  async chat(message: string): Promise<string> {
    try {
      // Encode message semantically
      const encoding = await this.client.engines.qsem.encode({
        text: message,
        basis: [2, 3, 5, 7]
      });

      // Simulate quantum processing for enhanced understanding
      const quantumSim = await this.client.engines.hqe.simulate({
        system: {
          qubits: 4,
          initialState: '|0000⟩',
          semanticEncoding: encoding.vector
        }
      });

      // Generate response with quantum enhancement
      const response = await this.client.sai.processText(this.engine.id, {
        prompt: message,
        enhancement: {
          semanticVector: encoding.vector,
          quantumState: quantumSim.finalState,
          resonanceScore: encoding.resonanceScore
        }
      });

      // Update space with conversation context
      if (this.session) {
        await this.session.proposeDelta({
          changes: [{
            type: 'add',
            path: 'conversation',
            value: {
              user: message,
              bot: response.text,
              timestamp: Date.now(),
              quantumEnhancement: quantumSim.entanglement
            }
          }],
          metadata: {
            description: 'Chat interaction',
            author: 'quantum-chatbot'
          }
        });
      }

      return response.text;
    } catch (error) {
      console.error('Chat error:', error);
      return 'I encountered a quantum uncertainty. Please try again.';
    }
  }

  async getConversationHistory(): Promise<any[]> {
    const snapshot = await this.client.rnet.getSnapshot(this.space.id);
    return snapshot.state.conversation || [];
  }

  async destroy() {
    if (this.session) {
      await this.session.close();
    }
  }
}

// Usage example
async function chatbotDemo() {
  const bot = new QuantumChatbot(process.env.NOMYX_API_KEY!);
  await bot.initialize();

  const response1 = await bot.chat('What is quantum consciousness?');
  console.log('Bot:', response1);

  const response2 = await bot.chat('How does quantum entanglement work?');
  console.log('Bot:', response2);

  const history = await bot.getConversationHistory();
  console.log('Conversation history:', history);

  await bot.destroy();
}

chatbotDemo().catch(console.error);
```

### 4. P=NP Problem Solver with Visualization

```typescript
// examples/intermediate/pnp-solver.ts
import { ResonanceClient } from '@nomyx/resonance-sdk';

interface ProblemResult {
  problem: any;
  solution: any;
  complexity: string;
  executionTime: number;
  quantumAcceleration?: number;
}

class PNPSolver {
  private client: ResonanceClient;
  private space: any;

  constructor(apiKey: string) {
    this.client = new ResonanceClient({ apiKey });
  }

  async initialize() {
    this.space = await this.client.rnet.createSpace({
      name: 'pnp-solver-space',
      basis: { primes: [2, 3, 5, 7, 11, 13] }
    });
  }

  async solve3SAT(variables: string[], clauses: string[][]): Promise<ProblemResult> {
    const startTime = Date.now();
    
    // Traditional approach
    const traditionalSolution = await this.client.engines.srs.solve({
      type: '3-sat',
      variables,
      clauses,
      method: 'classical'
    });

    // Quantum-enhanced approach
    const quantumSolution = await this.client.engines.srs.solve({
      type: '3-sat',
      variables,
      clauses,
      method: 'quantum-enhanced',
      optimizations: ['quantum-acceleration', 'prime-factorization']
    });

    const executionTime = Date.now() - startTime;
    
    return {
      problem: { variables, clauses },
      solution: quantumSolution.assignment,
      complexity: quantumSolution.complexity,
      executionTime,
      quantumAcceleration: traditionalSolution.executionTime / quantumSolution.executionTime
    };
  }

  async solveTSP(cities: number[][], startCity: number = 0): Promise<ProblemResult> {
    const startTime = Date.now();

    // Encode as semantic problem
    const encoding = await this.client.engines.qsem.encode({
      text: `Traveling salesman problem with ${cities.length} cities`,
      basis: [2, 3, 5, 7]
    });

    // Use quantum simulation for optimization
    const quantumOpt = await this.client.engines.hqe.simulate({
      system: {
        qubits: Math.ceil(Math.log2(cities.length)),
        optimization: 'traveling-salesman',
        cityDistances: cities
      }
    });

    // Solve with SRS
    const solution = await this.client.engines.srs.solve({
      type: 'traveling-salesman',
      cities,
      startCity,
      quantumHint: quantumOpt.finalState,
      semanticContext: encoding.vector
    });

    const executionTime = Date.now() - startTime;

    return {
      problem: { cities, startCity },
      solution: solution.path,
      complexity: solution.complexity,
      executionTime,
      quantumAcceleration: quantumOpt.speedup
    };
  }

  async benchmarkComplexity(problemSizes: number[]): Promise<any[]> {
    const results = [];

    for (const size of problemSizes) {
      // Generate random 3-SAT problem
      const variables = Array.from({ length: size }, (_, i) => `x${i}`);
      const clauses = Array.from({ length: size * 3 }, () => {
        return Array.from({ length: 3 }, () => {
          const varIndex = Math.floor(Math.random() * size);
          const negated = Math.random() < 0.5;
          return negated ? `!${variables[varIndex]}` : variables[varIndex];
        });
      });

      const result = await this.solve3SAT(variables, clauses);
      results.push({
        problemSize: size,
        ...result
      });

      console.log(`Problem size ${size}: ${result.executionTime}ms, ${result.complexity}`);
    }

    return results;
  }
}

// Usage example
async function solverDemo() {
  const solver = new PNPSolver(process.env.NOMYX_API_KEY!);
  await solver.initialize();

  // Simple 3-SAT example
  console.log('Solving 3-SAT problem...');
  const satResult = await solver.solve3SAT(
    ['x1', 'x2', 'x3'],
    [['x1', '!x2', 'x3'], ['!x1', 'x2', '!x3'], ['x1', 'x2', 'x3']]
  );
  console.log('3-SAT Result:', satResult);

  // TSP example
  console.log('Solving TSP problem...');
  const cities = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
  ];
  const tspResult = await solver.solveTSP(cities);
  console.log('TSP Result:', tspResult);

  // Complexity benchmark
  console.log('Running complexity benchmark...');
  const benchmark = await solver.benchmarkComplexity([5, 10, 15, 20]);
  console.log('Benchmark results:', benchmark);
}

solverDemo().catch(console.error);
```

## Advanced Examples

### 5. Collaborative Quantum Research Platform

```typescript
// examples/advanced/research-platform.ts
import { ResonanceClient, SpaceSession } from '@nomyx/resonance-sdk';
import { EventEmitter } from 'events';

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  participants: string[];
  experiments: Experiment[];
  status: 'active' | 'completed' | 'paused';
}

interface Experiment {
  id: string;
  hypothesis: string;
  methodology: string;
  results?: any;
  status: 'planned' | 'running' | 'completed' | 'failed';
}

class QuantumResearchPlatform extends EventEmitter {
  private client: ResonanceClient;
  private projects: Map<string, ResearchProject> = new Map();
  private sessions: Map<string, SpaceSession> = new Map();

  constructor(apiKey: string) {
    super();
    this.client = new ResonanceClient({ apiKey });
  }

  async createProject(title: string, description: string): Promise<ResearchProject> {
    // Create dedicated research space
    const space = await this.client.rnet.createSpace({
      name: `research-${title.toLowerCase().replace(/\s+/g, '-')}`,
      description,
      basis: { primes: [2, 3, 5, 7, 11, 13] },
      visibility: 'shared'
    });

    // Create AI assistant for the project
    const assistant = await this.client.sai.createEngine({
      name: `research-assistant-${space.id}`,
      spaceId: space.id,
      configuration: {
        model: 'research-assistant',
        parameters: {
          domain: 'quantum-research',
          creativity: 0.7
        }
      }
    });

    const project: ResearchProject = {
      id: space.id,
      title,
      description,
      participants: [],
      experiments: [],
      status: 'active'
    };

    this.projects.set(project.id, project);

    // Join space for real-time collaboration
    const session = await this.client.rnet.joinSpace(space.id, {
      role: 'owner',
      displayName: 'Research Platform'
    });

    this.setupSessionHandlers(session, project.id);
    this.sessions.set(project.id, session);

    return project;
  }

  async addParticipant(projectId: string, email: string, role: 'researcher' | 'observer'): Promise<void> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    // Invite to RNET space
    await this.client.rnet.inviteMember(projectId, {
      email,
      role: role === 'researcher' ? 'writer' : 'reader',
      permissions: role === 'researcher' ? ['read', 'write', 'experiment'] : ['read']
    });

    project.participants.push(email);
    this.emit('participantAdded', { projectId, email, role });
  }

  async createExperiment(projectId: string, hypothesis: string, methodology: string): Promise<Experiment> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const experiment: Experiment = {
      id: `exp_${Date.now()}`,
      hypothesis,
      methodology,
      status: 'planned'
    };

    project.experiments.push(experiment);

    // Update project state in RNET space
    const session = this.sessions.get(projectId);
    if (session) {
      await session.proposeDelta({
        changes: [{
          type: 'add',
          path: 'experiments',
          value: experiment
        }],
        metadata: {
          description: 'New experiment created',
          author: 'research-platform'
        }
      });
    }

    this.emit('experimentCreated', { projectId, experiment });
    return experiment;
  }

  async runExperiment(projectId: string, experimentId: string): Promise<any> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const experiment = project.experiments.find(e => e.id === experimentId);
    if (!experiment) throw new Error('Experiment not found');

    experiment.status = 'running';
    this.emit('experimentStarted', { projectId, experimentId });

    try {
      // Multi-engine experimental framework
      const results = await this.executeMultiEngineExperiment(experiment);
      
      experiment.results = results;
      experiment.status = 'completed';

      // Update space with results
      const session = this.sessions.get(projectId);
      if (session) {
        await session.proposeDelta({
          changes: [{
            type: 'update',
            path: `experiments.${experimentId}`,
            value: experiment
          }],
          metadata: {
            description: 'Experiment completed',
            author: 'research-platform'
          }
        });
      }

      this.emit('experimentCompleted', { projectId, experimentId, results });
      return results;

    } catch (error) {
      experiment.status = 'failed';
      this.emit('experimentFailed', { projectId, experimentId, error });
      throw error;
    }
  }

  private async executeMultiEngineExperiment(experiment: Experiment): Promise<any> {
    const results: any = {
      hypothesis: experiment.hypothesis,
      methodology: experiment.methodology,
      timestamp: new Date().toISOString(),
      engines: {}
    };

    // 1. Semantic analysis of hypothesis
    const semanticAnalysis = await this.client.engines.qsem.encode({
      text: experiment.hypothesis,
      basis: [2, 3, 5, 7, 11],
      analysis: 'deep-semantic'
    });
    results.engines.qsem = semanticAnalysis;

    // 2. Logical verification with SRS
    const logicalVerification = await this.client.engines.srs.solve({
      type: 'hypothesis-verification',
      hypothesis: experiment.hypothesis,
      methodology: experiment.methodology,
      semanticContext: semanticAnalysis.vector
    });
    results.engines.srs = logicalVerification;

    // 3. Quantum simulation if applicable
    if (experiment.methodology.includes('quantum')) {
      const quantumSim = await this.client.engines.hqe.simulate({
        hypothesis: experiment.hypothesis,
        parameters: this.extractQuantumParameters(experiment.methodology)
      });
      results.engines.hqe = quantumSim;
    }

    // 4. Non-local correlation analysis
    const nlcAnalysis = await this.client.engines.nlc.analyzeCorrelations({
      hypothesis: experiment.hypothesis,
      methodology: experiment.methodology,
      quantumEffects: results.engines.hqe || null
    });
    results.engines.nlc = nlcAnalysis;

    // 5. Consciousness resonance measurement
    const consciousnessAnalysis = await this.client.engines.qcr.measureResonance({
      subject: experiment.hypothesis,
      observer: 'research-platform',
      entanglement: nlcAnalysis.entanglement
    });
    results.engines.qcr = consciousnessAnalysis;

    // 6. I-Ching oracle consultation
    const oracleResult = await this.client.engines.iching.consultOracle({
      question: `What is the future of: ${experiment.hypothesis}?`,
      context: 'scientific-research'
    });
    results.engines.iching = oracleResult;

    // 7. Unified physics validation
    if (experiment.methodology.includes('physics')) {
      const physicsValidation = await this.client.engines.unified.validateHypothesis({
        hypothesis: experiment.hypothesis,
        framework: 'unified-field-theory'
      });
      results.engines.unified = physicsValidation;
    }

    // Synthesize results
    results.synthesis = await this.synthesizeResults(results);
    results.confidence = this.calculateConfidence(results);

    return results;
  }

  private extractQuantumParameters(methodology: string): any {
    // Simple parameter extraction from methodology description
    const params: any = {};
    
    const qubitMatch = methodology.match(/(\d+)\s*qubit/i);
    if (qubitMatch) params.qubits = parseInt(qubitMatch[1]);
    
    if (methodology.includes('entanglement')) params.entanglement = true;
    if (methodology.includes('superposition')) params.superposition = true;
    
    return params;
  }

  private async synthesizeResults(results: any): Promise<string> {
    // Use SAI to synthesize comprehensive analysis
    const synthesis = await this.client.sai.processText('research-synthesizer', {
      prompt: `Synthesize these research results: ${JSON.stringify(results, null, 2)}`,
      temperature: 0.3, // Lower temperature for factual synthesis
      maxTokens: 1000
    });

    return synthesis.text;
  }

  private calculateConfidence(results: any): number {
    // Weighted confidence calculation across engines
    const weights = {
      qsem: 0.15,
      srs: 0.25,
      hqe: 0.20,
      nlc: 0.15,
      qcr: 0.10,
      iching: 0.05,
      unified: 0.10
    };

    let totalConfidence = 0;
    let totalWeight = 0;

    for (const [engine, weight] of Object.entries(weights)) {
      if (results.engines[engine]) {
        const engineConfidence = results.engines[engine].confidence || 0.5;
        totalConfidence += engineConfidence * weight;
        totalWeight += weight;
      }
    }

    return totalWeight > 0 ? totalConfidence / totalWeight : 0.5;
  }

  private setupSessionHandlers(session: SpaceSession, projectId: string): void {
    session.on('deltaApplied', (delta) => {
      this.emit('projectUpdated', { projectId, delta });
    });

    session.on('memberJoined', (member) => {
      this.emit('participantJoined', { projectId, member });
    });

    session.on('telemetry', (metrics) => {
      this.emit('projectMetrics', { projectId, metrics });
    });
  }

  async getProjectStatus(projectId: string): Promise<any> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const snapshot = await this.client.rnet.getSnapshot(projectId);
    
    return {
      project,
      spaceState: snapshot.state,
      realTimeMetrics: snapshot.metrics
    };
  }

  async generateProjectReport(projectId: string): Promise<string> {
    const status = await this.getProjectStatus(projectId);
    
    const report = await this.client.sai.processText('report-generator', {
      prompt: `Generate a comprehensive research project report: ${JSON.stringify(status, null, 2)}`,
      temperature: 0.2,
      maxTokens: 2000
    });

    return report.text;
  }

  async cleanup(): Promise<void> {
    for (const session of this.sessions.values()) {
      await session.close();
    }
    this.sessions.clear();
  }
}

// Usage example
async function researchPlatformDemo() {
  const platform = new QuantumResearchPlatform(process.env.NOMYX_API_KEY!);

  // Create research project
  const project = await platform.createProject(
    'Quantum Consciousness Correlation Study',
    'Investigating the relationship between quantum mechanics and consciousness'
  );

  console.log('Project created:', project.id);

  // Add participants
  await platform.addParticipant(project.id, 'researcher1@example.com', 'researcher');
  await platform.addParticipant(project.id, 'observer1@example.com', 'observer');

  // Create experiment
  const experiment = await platform.createExperiment(
    project.id,
    'Quantum entanglement affects consciousness measurement',
    'Use quantum simulation with 8 qubits and consciousness resonance measurement'
  );

  console.log('Experiment created:', experiment.id);

  // Run experiment
  console.log('Running experiment...');
  const results = await platform.runExperiment(project.id, experiment.id);
  
  console.log('Experiment results:', results);
  console.log('Confidence:', results.confidence);

  // Generate report
  const report = await platform.generateProjectReport(project.id);
  console.log('Project report:', report);

  await platform.cleanup();
}

researchPlatformDemo().catch(console.error);
```

### 6. Multi-Engine Quantum Computing Simulator

```typescript
// examples/advanced/quantum-simulator.ts
import { ResonanceClient } from '@nomyx/resonance-sdk';

interface QuantumCircuit {
  qubits: number;
  gates: QuantumGate[];
  measurements?: Measurement[];
}

interface QuantumGate {
  type: 'H' | 'X' | 'Y' | 'Z' | 'CNOT' | 'RZ' | 'RY' | 'RX' | 'Toffoli';
  target: number;
  control?: number;
  angle?: number;
}

interface Measurement {
  qubit: number;
  observable: 'X' | 'Y' | 'Z';
}

interface SimulationResult {
  finalState: number[][];
  measurements: { [key: number]: number };
  entanglement: number;
  fidelity: number;
  executionTime: number;
  quantumVolume: number;
}

class QuantumSimulator {
  private client: ResonanceClient;
  private space: any;
  private simulationEngine: any;

  constructor(apiKey: string) {
    this.client = new ResonanceClient({ apiKey });
  }

  async initialize() {
    // Create quantum simulation space
    this.space = await this.client.rnet.createSpace({
      name: 'quantum-simulator-space',
      basis: { primes: [2, 3, 5, 7, 11, 13, 17, 19] } // 8 primes for advanced quantum ops
    });

    // Create specialized simulation engine
    this.simulationEngine = await this.client.sai.createEngine({
      name: 'quantum-simulation-engine',
      spaceId: this.space.id,
      configuration: {
        model: 'quantum-simulator',
        parameters: {
          precision: 'high',
          errorCorrection: true
        }
      }
    });
  }

  async simulateCircuit(circuit: QuantumCircuit): Promise<SimulationResult> {
    const startTime = Date.now();

    // 1. Encode circuit semantically
    const circuitDescription = this.describeCircuit(circuit);
    const semanticEncoding = await this.client.engines.qsem.encode({
      text: circuitDescription,
      basis: [2, 3, 5, 7, 11, 13, 17, 19]
    });

    // 2. Primary quantum simulation with HQE
    const hqeResult = await this.client.engines.hqe.simulate({
      system: {
        qubits: circuit.qubits,
        initialState: `|${'0'.repeat(circuit.qubits)}⟩`,
        gates: circuit.gates
      },
      measurement: {
        observables: circuit.measurements?.map(m => m.observable) || ['Z'],
        shots: 1000
      },
      holographic: {
        encoding: 'surface-code',
        errorCorrection: true
      }
    });

    // 3. Verify with SRS logical analysis
    const logicalVerification = await this.client.engines.srs.solve({
      type: 'quantum-circuit-verification',
      circuit: circuit,
      expectedBehavior: 'unitary-evolution',
      semanticContext: semanticEncoding.vector
    });

    // 4. Non-local correlation analysis
    const correlationAnalysis = await this.client.engines.nlc.analyzeQuantumCorrelations({
      qubits: circuit.qubits,
      entanglingGates: circuit.gates.filter(g => g.control !== undefined),
      measurements: circuit.measurements
    });

    // 5. Consciousness measurement effects
    const consciousnessEffects = await this.client.engines.qcr.measureQuantumObserver({
      system: 'quantum-circuit',
      qubits: circuit.qubits,
      observerComplexity: 'high'
    });

    // 6. Oracle consultation for optimization
    const oracleAdvice = await this.client.engines.iching.consultCircuitOracle({
      circuit: circuitDescription,
      optimization: 'depth-reduction'
    });

    // 7. Physics validation
    const physicsValidation = await this.client.engines.unified.validateQuantumCircuit({
      circuit: circuit,
      framework: 'quantum-field-theory'
    });

    const executionTime = Date.now() - startTime;

    // Synthesize results
    const result: SimulationResult = {
      finalState: hqeResult.finalState,
      measurements: hqeResult.measurements,
      entanglement: hqeResult.entanglement,
      fidelity: hqeResult.fidelity,
      executionTime,
      quantumVolume: this.calculateQuantumVolume(circuit, hqeResult)
    };

    // Store simulation in space
    await this.storeSimulation(circuit, result, {
      semanticEncoding,
      logicalVerification,
      correlationAnalysis,
      consciousnessEffects,
      oracleAdvice,
      physicsValidation
    });

    return result;
  }

  async optimizeCircuit(circuit: QuantumCircuit): Promise<QuantumCircuit> {
    // Use multiple engines to optimize the circuit
    const optimization = await this.client.engines.srs.solve({
      type: 'circuit-optimization',
      circuit: circuit,
      objectives: ['minimize-depth', 'minimize-gates', 'maximize-fidelity']
    });

    // Apply I-Ching wisdom for unconventional optimizations
    const oracleOptimization = await this.client.engines.iching.optimizeCircuit({
      circuit: circuit,
      strategy: 'holistic-harmony'
    });

    // Combine optimizations
    return this.combineOptimizations(circuit, optimization.optimizedCircuit, oracleOptimization.suggestions);
  }

  async benchmarkAlgorithms(): Promise<any[]> {
    const algorithms = [
      this.createGroverCircuit(4),
      this.createShorCircuit(15),
      this.createQFTCircuit(8),
      this.createVQECircuit(6)
    ];

    const results = [];

    for (const [name, circuit] of algorithms) {
      console.log(`Benchmarking ${name}...`);
      const result = await this.simulateCircuit(circuit);
      results.push({
        algorithm: name,
        qubits: circuit.qubits,
        gates: circuit.gates.length,
        ...result
      });
    }

    return results;
  }

  private describe