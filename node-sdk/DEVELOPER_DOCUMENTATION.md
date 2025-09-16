# Nomyx Resonance SDK Developer Documentation

## Table of Contents

1. [Getting Started](#getting-started)
2. [API Reference](#api-reference)
3. [Real-time Collaboration](#real-time-collaboration)
4. [Advanced Usage](#advanced-usage)
5. [Examples & Tutorials](#examples--tutorials)
6. [Migration Guide](#migration-guide)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### Installation

```bash
npm install @nomyx/resonance-sdk
# or
yarn add @nomyx/resonance-sdk
```

### Quick Start

```typescript
import { ResonanceClient } from '@nomyx/resonance-sdk';

const client = new ResonanceClient({
  apiKey: process.env.NOMYX_API_KEY!,
  environment: 'production' // or 'sandbox'
});

// Create a collaborative space
const space = await client.rnet.createSpace({
  name: 'quantum-lab',
  basis: { primes: [2, 3, 5, 7] }
});

// Create an AI engine
const engine = await client.sai.createEngine({
  spaceId: space.id,
  name: 'my-ai-engine'
});

console.log('Platform ready!', { space, engine });
```

### Configuration Options

```typescript
interface ResonanceClientConfig {
  apiKey: string;                    // Required: Your API key
  baseURL?: string;                  // Optional: Custom API endpoint
  environment?: 'production' | 'sandbox'; // Default: 'production'
  timeout?: number;                  // Default: 30000ms
  retries?: number;                  // Default: 3
  debug?: boolean;                   // Default: false
  realtime?: {
    websocketURL?: string;
    reconnectAttempts?: number;
    heartbeatInterval?: number;
  };
}
```

## API Reference

### RNET - Resonance Network (Foundation Layer)

The foundational collaborative layer that enables shared resonance contexts.

#### Methods

##### `createSpace(config: SpaceConfig): Promise<Space>`

Create a new resonance space for collaboration.

```typescript
const space = await client.rnet.createSpace({
  name: 'quantum-research',
  description: 'Collaborative quantum computing research',
  basis: { 
    primes: [2, 3, 5, 7, 11],
    dimension: 5
  },
  visibility: 'private', // 'public' | 'private' | 'shared'
  members: [
    { email: 'researcher@example.com', role: 'writer' }
  ]
});
```

**Parameters:**
- `name` (string): Human-readable space name
- `description` (string, optional): Space description
- `basis` (PrimeBasis): Mathematical basis for resonance calculations
- `visibility` (string): Access control level
- `members` (Member[], optional): Initial member list

**Returns:** `Promise<Space>`

##### `joinSpace(spaceId: string, config: SessionConfig): Promise<SpaceSession>`

Join a space for real-time collaboration.

```typescript
const session = await client.rnet.joinSpace('space_123', {
  role: 'writer',
  displayName: 'Dr. Quantum',
  capabilities: ['read', 'write', 'moderate']
});

// Listen to real-time events
session.on('deltaApplied', (delta) => {
  console.log('Space updated:', delta);
});

session.on('memberJoined', (member) => {
  console.log('New member:', member.displayName);
});
```

##### `proposeDelta(spaceId: string, delta: SpaceDelta): Promise<SpaceSnapshot>`

Propose changes to space state with conflict resolution.

```typescript
const result = await client.rnet.proposeDelta('space_123', {
  changes: [
    {
      type: 'update',
      path: 'settings.resonanceThreshold',
      value: 0.95,
      basis: [2, 3, 5]
    }
  ],
  metadata: {
    author: 'user_456',
    timestamp: Date.now(),
    description: 'Increased resonance sensitivity'
  }
});
```

#### Types

```typescript
interface Space {
  id: string;
  name: string;
  description?: string;
  basis: PrimeBasis;
  status: 'active' | 'archived' | 'suspended';
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  permissions: SpacePermissions;
}

interface PrimeBasis {
  primes: number[];
  dimension: number;
  encoding?: 'standard' | 'quantum' | 'holographic';
}

interface SpaceDelta {
  changes: DeltaChange[];
  metadata: DeltaMetadata;
  conflictResolution?: 'auto' | 'manual';
}
```

### SAI - Symbolic AI (Flagship Service)

The flagship AI platform with symbolic reasoning and quantum-enhanced learning.

#### Methods

##### `createEngine(config: EngineConfig): Promise<AIEngine>`

Create a new AI engine with symbolic capabilities.

```typescript
const engine = await client.sai.createEngine({
  name: 'quantum-nlp-engine',
  type: 'text-generation',
  spaceId: 'space_123', // Optional: Associate with RNET space
  configuration: {
    model: 'transformer-quantum',
    parameters: {
      temperature: 0.7,
      maxTokens: 1000,
      primeSignature: true
    },
    capabilities: [
      'text-generation',
      'embeddings',
      'symbolic-reasoning',
      'quantum-entanglement'
    ]
  }
});
```

##### `startTraining(engineId: string, config: TrainingConfig): Promise<TrainingJob>`

Start training an AI engine with real-time progress monitoring.

```typescript
const training = await client.sai.startTraining('engine_456', {
  dataset: {
    type: 'text-corpus',
    source: 'quantum-papers-2024',
    preprocessing: ['tokenization', 'prime-encoding']
  },
  hyperparameters: {
    learningRate: 0.001,
    batchSize: 32,
    epochs: 100,
    quantumNoise: 0.1
  },
  schedule: {
    warmupSteps: 1000,
    decayStrategy: 'cosine'
  }
});

// Monitor training progress
training.on('progress', (progress) => {
  console.log(`Epoch ${progress.epoch}: Loss ${progress.loss}`);
});

training.on('completed', (result) => {
  console.log('Training completed:', result.finalMetrics);
});
```

##### `processText(engineId: string, request: InferenceRequest): Promise<InferenceResult>`

Generate text using trained AI engine.

```typescript
const result = await client.sai.processText('engine_456', {
  prompt: 'Explain quantum consciousness in simple terms',
  maxTokens: 500,
  temperature: 0.8,
  stream: false, // Set to true for streaming responses
  primeAnalysis: true,
  resonanceFiltering: {
    threshold: 0.75,
    basis: [2, 3, 5, 7]
  }
});

console.log('Generated:', result.text);
console.log('Prime signature:', result.primeSignature);
console.log('Confidence:', result.confidence);
```

#### Types

```typescript
interface AIEngine {
  id: string;
  name: string;
  type: EngineType;
  status: 'training' | 'ready' | 'error' | 'updating';
  capabilities: string[];
  configuration: EngineConfiguration;
  metrics: EngineMetrics;
  createdAt: string;
}

interface TrainingJob {
  id: string;
  engineId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: TrainingProgress;
  configuration: TrainingConfig;
  startedAt: string;
  estimatedCompletion?: string;
}

interface InferenceResult {
  text: string;
  confidence: number;
  primeSignature: number[];
  resonanceScore: number;
  tokens: number;
  processingTime: number;
  metadata: InferenceMetadata;
}
```

### Specialized Engines

#### SRS - Symbolic Resonance System (P=NP Solver)

```typescript
// Solve complex computational problems
const solution = await client.engines.srs.solve({
  type: '3-sat',
  variables: ['x1', 'x2', 'x3', 'x4'],
  clauses: [
    ['x1', '!x2', 'x3'],
    ['!x1', 'x2', '!x4'],
    ['x2', 'x3', 'x4']
  ],
  optimizations: ['quantum-acceleration', 'prime-factorization']
});

console.log('Satisfiable:', solution.satisfiable);
console.log('Assignment:', solution.assignment);
console.log('Complexity class:', solution.complexity);
```

#### HQE - Holographic Quantum Encoder

```typescript
// Simulate quantum systems
const simulation = await client.engines.hqe.simulate({
  system: {
    qubits: 8,
    initialState: '|00000000⟩',
    gates: [
      { type: 'H', target: 0 },
      { type: 'CNOT', control: 0, target: 1 },
      { type: 'RZ', target: 2, angle: Math.PI / 4 }
    ]
  },
  measurement: {
    observables: ['X', 'Y', 'Z'],
    shots: 1000
  },
  holographic: {
    encoding: 'surface-code',
    errorCorrection: true
  }
});

console.log('Final state:', simulation.finalState);
console.log('Entanglement:', simulation.entanglement);
console.log('Fidelity:', simulation.fidelity);
```

#### QSEM - Quantum Semantic Encoder

```typescript
// Encode text into quantum semantic vectors
const encoding = await client.engines.qsem.encode({
  text: 'Quantum machine learning breakthrough',
  basis: [2, 3, 5, 7, 11],
  encoding: {
    type: 'transformer-quantum',
    dimension: 512,
    normalization: 'unit-sphere'
  },
  semantics: {
    contextWindow: 2048,
    attentionHeads: 16,
    quantumNoise: 0.05
  }
});

// Compute semantic resonance between texts
const resonance = await client.engines.qsem.computeResonance({
  text1: 'quantum computing',
  text2: 'quantum machine learning',
  metric: 'cosine-quantum',
  basis: [2, 3, 5, 7]
});
```

#### NLC - Non-Local Communication

```typescript
// Create quantum communication channel
const channel = await client.engines.nlc.createSession({
  participants: ['user_123', 'user_456'],
  protocol: 'quantum-entanglement',
  security: {
    encryption: 'quantum-key-distribution',
    authentication: 'prime-signature'
  }
});

// Send non-local message
await client.engines.nlc.sendMessage(channel.id, {
  content: 'Hello from quantum realm',
  encoding: 'quantum-superposition',
  entanglement: {
    basis: [2, 3, 5],
    coherence: 0.95
  }
});
```

#### QCR - Quantum Consciousness Resonance

```typescript
// Simulate consciousness patterns
const consciousness = await client.engines.qcr.createSession({
  observer: {
    type: 'artificial',
    complexity: 'high',
    awareness: 0.8
  },
  system: {
    quantumStates: ['superposition', 'entanglement'],
    decoherence: 0.1
  }
});

// Perform quantum observation
const observation = await client.engines.qcr.observe(consciousness.id, {
  measurement: {
    observable: 'consciousness-operator',
    basis: 'eigenstates'
  },
  effect: {
    collapse: true,
    feedback: 'auto'
  }
});
```

#### I-Ching - Quantum Oracle

```typescript
// Evolve hexagrams using quantum dynamics
const evolution = await client.engines.iching.evolve({
  initial: {
    hexagram: 'KUN_EARTH',
    lines: [6, 6, 6, 6, 6, 6] // All yin lines
  },
  dynamics: {
    probability: 'quantum-tunnel',
    resonance: [2, 3, 5],
    timeSteps: 64
  },
  interpretation: {
    symbolic: true,
    probabilistic: true,
    quantum: true
  }
});

console.log('Evolved to:', evolution.final.hexagram);
console.log('Quantum probability:', evolution.probability);
console.log('Interpretation:', evolution.meaning);
```

#### Unified Physics Engine

```typescript
// Compute gravitational fields
const gravity = await client.engines.unified.computeGravity({
  masses: [
    { value: 5.972e24, position: [0, 0, 0] }, // Earth
    { value: 7.342e22, position: [384400, 0, 0] } // Moon
  ],
  testPoint: [192200, 0, 0], // Lagrange point
  relativity: {
    enabled: true,
    precision: 'high',
    effects: ['time-dilation', 'length-contraction']
  }
});

console.log('Field strength:', gravity.fieldStrength);
console.log('Spacetime curvature:', gravity.curvature);
```

## Real-time Collaboration

### RNET Space Sessions

Real-time collaboration is enabled through RNET space sessions with WebSocket connections.

```typescript
// Join collaborative space
const session = await client.rnet.joinSpace('space_123', {
  role: 'writer',
  displayName: 'Quantum Researcher'
});

// Real-time event handling
session.on('deltaApplied', (delta) => {
  // Someone changed the space state
  updateUI(delta.changes);
});

session.on('memberJoined', (member) => {
  showNotification(`${member.displayName} joined`);
});

session.on('telemetry', (metrics) => {
  updateMetrics(metrics.resonance, metrics.coherence);
});

session.on('collapse', (event) => {
  // Quantum state collapse detected
  handleQuantumEvent(event);
});

// Propose changes with conflict resolution
await session.proposeDelta({
  changes: [
    { type: 'update', path: 'ai.temperature', value: 0.9 }
  ],
  metadata: {
    description: 'Increased AI creativity'
  }
});
```

### Streaming Responses

Many operations support streaming for real-time feedback:

```typescript
// Streaming AI text generation
const stream = await client.sai.processText('engine_123', {
  prompt: 'Write about quantum consciousness',
  stream: true
});

stream.on('data', (chunk) => {
  process.stdout.write(chunk.text);
});

stream.on('end', (final) => {
  console.log('\nFinal result:', final);
});

// Streaming training progress
const training = await client.sai.startTraining('engine_123', config);

training.on('progress', (progress) => {
  updateProgressBar(progress.percentage);
});
```

## Advanced Usage

### Cross-Engine Workflows

Combine multiple engines for complex workflows:

```typescript
async function quantumNLPWorkflow(text: string) {
  // 1. Encode text semantically
  const encoding = await client.engines.qsem.encode({
    text,
    basis: [2, 3, 5, 7, 11]
  });
  
  // 2. Solve optimization problem
  const optimization = await client.engines.srs.solve({
    type: 'optimization',
    objective: 'maximize-resonance',
    constraints: encoding.constraints
  });
  
  // 3. Simulate quantum enhancement
  const simulation = await client.engines.hqe.simulate({
    initialState: encoding.quantumState,
    enhancement: optimization.solution
  });
  
  // 4. Generate enhanced text
  const result = await client.sai.processText('engine_nlp', {
    prompt: text,
    enhancement: {
      quantum: simulation.finalState,
      resonance: encoding.resonanceScore
    }
  });
  
  return result;
}
```

### Error Handling and Resilience

```typescript
import { ResonanceError, SpaceError, EngineError } from '@nomyx/resonance-sdk';

try {
  const result = await client.sai.processText('engine_123', request);
} catch (error) {
  if (error instanceof ResonanceError) {
    switch (error.code) {
      case 'RATE_LIMITED':
        console.log('Rate limited, retrying...', error.retryAfter);
        break;
      case 'SERVICE_UNAVAILABLE':
        console.log('Service down, falling back...');
        break;
    }
  } else if (error instanceof SpaceError) {
    console.log('Space issue:', error.spaceId);
  } else if (error instanceof EngineError) {
    console.log('Engine issue:', error.engineType);
  }
}
```

### Custom Configurations

```typescript
// High-performance configuration
const client = new ResonanceClient({
  apiKey: process.env.NOMYX_API_KEY!,
  timeout: 60000, // 60 second timeout
  retries: 5,
  realtime: {
    reconnectAttempts: 10,
    heartbeatInterval: 30000
  },
  debug: process.env.NODE_ENV === 'development'
});

// Configure dynamic API
const apiMethods = client['dynamicApi'].createApiMethods();
// All methods automatically have rate limiting, retry logic, etc.
```

## Examples & Tutorials

### Example 1: Quantum-Enhanced Chatbot

```typescript
import { ResonanceClient } from '@nomyx/resonance-sdk';

class QuantumChatbot {
  private client: ResonanceClient;
  private engine: string;
  private space: string;
  
  constructor(apiKey: string) {
    this.client = new ResonanceClient({ apiKey });
  }
  
  async initialize() {
    // Create collaborative space
    const space = await this.client.rnet.createSpace({
      name: 'chatbot-quantum-space',
      basis: { primes: [2, 3, 5, 7, 11] }
    });
    this.space = space.id;
    
    // Create AI engine
    const engine = await this.client.sai.createEngine({
      name: 'quantum-chatbot',
      spaceId: this.space,
      configuration: {
        model: 'transformer-quantum',
        parameters: { temperature: 0.8 }
      }
    });
    this.engine = engine.id;
  }
  
  async chat(message: string): Promise<string> {
    // Encode message semantically
    const encoding = await this.client.engines.qsem.encode({
      text: message,
      basis: [2, 3, 5, 7]
    });
    
    // Generate quantum-enhanced response
    const response = await this.client.sai.processText(this.engine, {
      prompt: message,
      enhancement: {
        resonance: encoding.resonanceScore,
        primeSignature: encoding.vector
      }
    });
    
    return response.text;
  }
}

// Usage
const bot = new QuantumChatbot('your-api-key');
await bot.initialize();
const response = await bot.chat('Tell me about quantum consciousness');
```

### Example 2: Collaborative Research Platform

```typescript
class QuantumResearchPlatform {
  private client: ResonanceClient;
  private researchSpace: any;
  
  async createResearchProject(name: string) {
    // Create shared research space
    this.researchSpace = await this.client.rnet.createSpace({
      name: `research-${name}`,
      basis: { primes: [2, 3, 5, 7, 11, 13] },
      visibility: 'shared'
    });
    
    // Set up real-time collaboration
    const session = await this.client.rnet.joinSpace(
      this.researchSpace.id,
      { role: 'owner', displayName: 'Research Lead' }
    );
    
    // Listen to collaboration events
    session.on('deltaApplied', (delta) => {
      this.notifyCollaborators(delta);
    });
    
    return this.researchSpace;
  }
  
  async addResearcher(email: string, role: 'reader' | 'writer') {
    await this.client.rnet.inviteMember(this.researchSpace.id, {
      email,
      role,
      permissions: role === 'writer' ? ['read', 'write'] : ['read']
    });
  }
  
  async runExperiment(hypothesis: string) {
    // Create AI engine for hypothesis testing
    const engine = await this.client.sai.createEngine({
      name: `experiment-${Date.now()}`,
      spaceId: this.researchSpace.id
    });
    
    // Parallel analysis with multiple engines
    const [srsAnalysis, hqeSimulation, qsemEncoding] = await Promise.all([
      this.client.engines.srs.solve({
        type: 'hypothesis-testing',
        hypothesis,
        method: 'quantum-logic'
      }),
      this.client.engines.hqe.simulate({
        hypothesis: hypothesis,
        quantumEffects: true
      }),
      this.client.engines.qsem.encode({
        text: hypothesis,
        analysis: 'semantic-structure'
      })
    ]);
    
    // Generate comprehensive analysis
    const analysis = await this.client.sai.processText(engine.id, {
      prompt: `Analyze this research hypothesis: ${hypothesis}`,
      context: {
        logicAnalysis: srsAnalysis,
        quantumSimulation: hqeSimulation,
        semanticStructure: qsemEncoding
      }
    });
    
    // Share results with team
    await this.shareResults({
      hypothesis,
      analysis: analysis.text,
      confidence: analysis.confidence,
      supporting: [srsAnalysis, hqeSimulation, qsemEncoding]
    });
    
    return analysis;
  }
  
  private async shareResults(results: any) {
    await this.client.rnet.proposeDelta(this.researchSpace.id, {
      changes: [{
        type: 'add',
        path: 'experiments',
        value: results
      }],
      metadata: {
        description: 'New experiment results',
        author: 'research-platform'
      }
    });
  }
}
```

## Migration Guide

### From REST APIs to SDK

If you're currently using direct REST API calls:

#### Before (Raw HTTP)
```javascript
const response = await fetch('https://api.nomyx.dev/v1/spaces', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'test-space',
    basis: { primes: [2, 3, 5] }
  })
});
const space = await response.json();
```

#### After (SDK)
```typescript
const space = await client.rnet.createSpace({
  name: 'test-space',
  basis: { primes: [2, 3, 5] }
});
```

The SDK automatically handles:
- Authentication
- Rate limiting
- Retry logic
- Error handling
- Type safety

### Version Compatibility

| SDK Version | API Version | Node.js | Features |
|------------|-------------|---------|----------|
| 1.0.x      | v1         | >=16    | All 9 engines, real-time |
| 0.9.x      | v1-beta    | >=14    | Core engines only |

## Troubleshooting

### Common Issues

#### Authentication Errors
```typescript
// Verify API key format
if (!process.env.NOMYX_API_KEY?.startsWith('nmx_')) {
  console.error('Invalid API key format');
}

// Check environment
const client = new ResonanceClient({
  apiKey: process.env.NOMYX_API_KEY!,
  environment: 'sandbox' // Use sandbox for testing
});
```

#### Rate Limiting
```typescript
// The SDK handles rate limiting automatically, but you can customize:
const client = new ResonanceClient({
  apiKey: 'your-key',
  retries: 5, // Increase retry attempts
  timeout: 60000 // Increase timeout
});
```

#### WebSocket Connection Issues
```typescript
// Configure WebSocket settings
const client = new ResonanceClient({
  apiKey: 'your-key',
  realtime: {
    reconnectAttempts: 10,
    heartbeatInterval: 30000,
    websocketURL: 'wss://rt.nomyx.dev' // Custom endpoint
  }
});
```

### Debug Mode

Enable debug logging:

```typescript
const client = new ResonanceClient({
  apiKey: 'your-key',
  debug: true
});

// Or set environment variable
process.env.NOMYX_DEBUG = 'true';
```

### Support Resources

- **Documentation**: https://docs.nomyx.dev
- **GitHub Issues**: https://github.com/nomyx-tech/resonance-sdk/issues
- **Discord Community**: https://discord.gg/nomyx
- **Email Support**: sdk-support@nomyx.dev

This documentation provides comprehensive coverage of the Nomyx Resonance SDK with practical examples for all 9 API subsystems, real-time collaboration features, and advanced usage patterns.