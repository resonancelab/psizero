export interface ApiParameter {
  name: string;
  type: 'string' | 'integer' | 'boolean' | 'array' | 'object';
  required: boolean;
  description: string;
  example?: unknown;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  parameters: ApiParameter[];
  category: string;
  tags: string[];
  sampleResponse?: unknown;
}

export const apiEndpoints: ApiEndpoint[] = [
  // SRS (Symbolic Resonance Solver) APIs
  {
    id: "srs-solve",
    method: "POST",
    path: "/v1/srs/solve",
    title: "Solve NP-Complete Problem",
    description: "Solve complex NP-complete problems using advanced Symbolic Resonance algorithms with multiple problem types support",
    category: "srs",
    tags: ["srs", "np-complete", "3sat", "subsetsum", "hamiltonian"],
    parameters: [
      {
        name: "problem",
        type: "string",
        required: true,
        description: "Problem type: 3sat, ksat, subsetsum, hamiltonian_path, vertex_cover, clique, x3c, custom",
        example: "3sat"
      },
      {
        name: "spec",
        type: "object",
        required: true,
        description: "Problem specification (variables, clauses, weights, etc.)",
        example: {
          variables: 4,
          clauses: [
            [{ var: 1, neg: false }, { var: 2, neg: true }, { var: 3, neg: false }],
            [{ var: 2, neg: false }, { var: 3, neg: false }, { var: 4, neg: true }]
          ]
        }
      },
      {
        name: "config",
        type: "object",
        required: false,
        description: "Advanced SRS algorithm configuration",
        example: {
          stop: { iterMax: 5000, plateauEps: 1e-6 },
          schedules: { eta0: 0.3, etaDecay: 0.002 }
        }
      },
    ],
    sampleResponse: {
      feasible: true,
      certificate: { assignment: [1, 0, 1, 0] },
      metrics: {
        entropy: 0.034,
        plateauDetected: true,
        dominance: 0.89,
        resonanceStrength: 0.95
      }
    }
  },

  // HQE (Holographic Quantum Encoder) APIs
  {
    id: "hqe-simulate",
    method: "POST",
    path: "/v1/hqe/simulate",
    title: "Quantum Encoder Simulation",
    description: "Run holographic quantum encoder simulations with prime eigenstate evolution and resonance targeting",
    category: "hqe",
    tags: ["hqe", "quantum", "simulation", "primes", "holographic"],
    parameters: [
      {
        name: "primes",
        type: "array",
        required: true,
        description: "Prime eigenstates to include in simulation",
        example: [2, 3, 5, 7, 11]
      },
      {
        name: "steps",
        type: "integer",
        required: false,
        description: "Number of evolution steps (default: 256)",
        example: 256
      },
      {
        name: "lambda",
        type: "string",
        required: false,
        description: "Entropy dissipation rate (default: 0.02)",
        example: "0.02"
      },
      {
        name: "resonanceTarget",
        type: "string",
        required: false,
        description: "Target resonance stability threshold",
        example: "0.8"
      },
    ],
    sampleResponse: {
      snapshots: [
        {
          step: 0,
          amplitudes: [0.5, 0.3, 0.2, 0.1, 0.05],
          metrics: { entropy: 1.23, resonanceStrength: 0.34 }
        }
      ],
      finalMetrics: {
        entropy: 0.15,
        plateauDetected: true,
        resonanceStrength: 0.92
      }
    }
  },

  // QSEM (Quantum Semantics) APIs
  {
    id: "qsem-encode",
    method: "POST",
    path: "/v1/qsem/encode",
    title: "Encode Semantic Concepts",
    description: "Encode natural language concepts into prime-basis quantum semantic vectors for resonance analysis",
    category: "qsem",
    tags: ["qsem", "semantics", "encoding", "concepts", "nlp"],
    parameters: [
      {
        name: "concepts",
        type: "array",
        required: true,
        description: "List of concepts to encode into quantum semantic space",
        example: ["love", "entropy", "pattern", "consciousness"]
      },
      {
        name: "basis",
        type: "string",
        required: false,
        description: "Encoding basis type: prime or hybrid (default: prime)",
        example: "prime"
      },
    ],
    sampleResponse: {
      vectors: [
        {
          concept: "love",
          alpha: [0.3, 0.7, 0.2, 0.1, 0.05]
        },
        {
          concept: "entropy",
          alpha: [0.8, 0.1, 0.4, 0.2, 0.15]
        }
      ]
    }
  },

  {
    id: "qsem-resonance",
    method: "POST",
    path: "/v1/qsem/resonance",
    title: "Compute Concept Resonance",
    description: "Calculate resonance and coherence metrics between encoded concept vectors",
    category: "qsem",
    tags: ["qsem", "resonance", "coherence", "analysis"],
    parameters: [
      {
        name: "vectors",
        type: "array",
        required: true,
        description: "Pre-encoded concept vectors for resonance analysis",
        example: [
          { concept: "love", alpha: [0.3, 0.7, 0.2] },
          { concept: "entropy", alpha: [0.8, 0.1, 0.4] }
        ]
      },
      {
        name: "graph",
        type: "array",
        required: false,
        description: "Optional semantic relationship edges",
        example: [{ i: 0, j: 1, w: 0.5 }]
      },
    ],
    sampleResponse: {
      coherence: 0.67,
      pairwise: [
        { a: 0, b: 1, resonance: 0.42 }
      ]
    }
  },

  // NLC (Non-Local Communication) APIs
  {
    id: "nlc-create-session",
    method: "POST",
    path: "/v1/nlc/sessions",
    title: "Create NLC Session",
    description: "Establish a non-local communication channel using prime eigenstate resonance",
    category: "nlc",
    tags: ["nlc", "communication", "session", "non-local", "primes"],
    parameters: [
      {
        name: "primes",
        type: "array",
        required: true,
        description: "Prime numbers for eigenstate channel establishment",
        example: [2, 3, 5, 7]
      },
      {
        name: "phases",
        type: "array",
        required: false,
        description: "Initial phase configurations",
        example: [0.0, 1.57, 3.14, 4.71]
      },
      {
        name: "goldenPhase",
        type: "boolean",
        required: false,
        description: "Enable golden ratio phase modulation (default: true)",
        example: true
      },
    ],
    sampleResponse: {
      id: "nlc_7f3a9b2c",
      status: "syncing",
      metrics: {
        entropy: 0.23,
        resonanceStrength: 0.78,
        locality: 0.12
      }
    }
  },

  {
    id: "nlc-send-message",
    method: "POST",
    path: "/v1/nlc/sessions/{id}/messages",
    title: "Send NLC Message",
    description: "Transmit a message through the established non-local communication channel",
    category: "nlc",
    tags: ["nlc", "message", "transmission"],
    parameters: [
      {
        name: "content",
        type: "string",
        required: true,
        description: "Message content (max 4000 characters)",
        example: "Hello through the quantum channel"
      },
    ],
    sampleResponse: {
      content: "Hello through the quantum channel",
      stamp: "2024-01-15T10:30:00Z",
      channelQuality: 0.89
    }
  },

  // QCR (Quantum Consciousness Resonator) APIs
  {
    id: "qcr-create-session",
    method: "POST",
    path: "/v1/qcr/sessions",
    title: "Start QCR Session",
    description: "Initialize a triadic consciousness resonance session with multiple cognitive modes",
    category: "qcr",
    tags: ["qcr", "consciousness", "triadic", "cognitive"],
    parameters: [
      {
        name: "modes",
        type: "array",
        required: true,
        description: "Cognitive modes: analytical, creative, ethical, pragmatic, emotional",
        example: ["analytical", "creative", "ethical"]
      },
      {
        name: "maxIterations",
        type: "integer",
        required: false,
        description: "Maximum resonance iterations (default: 21)",
        example: 21
      },
    ],
    sampleResponse: {
      id: "qcr_4d8f2a1e",
      iteration: 0,
      stabilized: false,
      lastObservation: null
    }
  },

  {
    id: "qcr-observe",
    method: "POST",
    path: "/v1/qcr/sessions/{id}/observe",
    title: "QCR Observation",
    description: "Submit a prompt and observe the stabilized triadic consciousness response",
    category: "qcr",
    tags: ["qcr", "observation", "prompt", "response"],
    parameters: [
      {
        name: "prompt",
        type: "string",
        required: true,
        description: "Input prompt for consciousness resonance analysis",
        example: "What is the nature of consciousness?"
      },
    ],
    sampleResponse: {
      prompt: "What is the nature of consciousness?",
      response: "Consciousness emerges through triadic resonance between analytical frameworks, creative insights, and ethical considerations...",
      metrics: {
        entropy: 0.45,
        resonanceStrength: 0.87,
        dominance: 0.34
      }
    }
  },

  // I-Ching Oracle APIs
  {
    id: "iching-evolve",
    method: "POST",
    path: "/v1/iching/evolve",
    title: "I-Ching Evolution",
    description: "Evolve hexagram sequences from questions using symbolic entropy dynamics",
    category: "iching",
    tags: ["iching", "oracle", "hexagram", "evolution"],
    parameters: [
      {
        name: "question",
        type: "string",
        required: true,
        description: "Question for oracle consultation",
        example: "What direction should I take in my career?"
      },
      {
        name: "steps",
        type: "integer",
        required: false,
        description: "Number of evolution steps (default: 7)",
        example: 7
      },
    ],
    sampleResponse: {
      sequence: [
        {
          step: 0,
          hexagram: "101010",
          entropy: 1.35,
          attractorProximity: 0.23
        },
        {
          step: 1,
          hexagram: "101011",
          entropy: 1.12,
          attractorProximity: 0.45
        }
      ],
      stabilized: true
    }
  },

  // Unified Physics APIs
  {
    id: "unified-gravity",
    method: "POST",
    path: "/v1/unified/gravity/compute",
    title: "Emergent Gravity Computation",
    description: "Compute emergent gravitational effects from observer entropy reduction and field gradients",
    category: "unified",
    tags: ["unified", "gravity", "physics", "entropy", "observer"],
    parameters: [
      {
        name: "observerEntropyReductionRate",
        type: "string",
        required: true,
        description: "Observer's internal entropy reduction rate (bits/sec)",
        example: "12.4"
      },
      {
        name: "regionEntropyGradient",
        type: "string",
        required: false,
        description: "Spatial entropy gradient (bits/m³)",
        example: "0.002"
      },
      {
        name: "blackHoleProxyDensity",
        type: "string",
        required: false,
        description: "Informational density proxy",
        example: "1.5e-3"
      },
    ],
    sampleResponse: {
      effectiveG: 6.67e-11,
      fieldStrength: 9.81,
      notes: "Emergent gravitational constant computed from observer-entropy coupling"
    }
  },

  // Webhook Management APIs
  {
    id: "webhooks-register",
    method: "POST",
    path: "/v1/webhooks",
    title: "Register Webhook",
    description: "Register webhook endpoints for platform events (session convergence, stability, collapses)",
    category: "webhooks",
    tags: ["webhooks", "events", "notifications"],
    parameters: [
      {
        name: "url",
        type: "string",
        required: true,
        description: "Webhook endpoint URL",
        example: "https://myapp.com/webhook"
      },
      {
        name: "events",
        type: "array",
        required: true,
        description: "Event types: srs.collapse, nlc.stable, qcr.converged, iching.stabilized",
        example: ["srs.collapse", "qcr.converged"]
      },
      {
        name: "secret",
        type: "string",
        required: false,
        description: "Webhook signature secret",
        example: "webhook_secret_key"
      },
    ],
    sampleResponse: {
      id: "wh_8e3f7a2d",
      url: "https://myapp.com/webhook",
      events: ["srs.collapse", "qcr.converged"]
    }
  },

  // OAuth2 Authentication
  {
    id: "oauth-token",
    method: "POST",
    path: "/oauth/token",
    title: "Get OAuth2 Token",
    description: "Obtain enterprise OAuth2 access token using client credentials flow",
    category: "auth",
    tags: ["oauth2", "authentication", "enterprise"],
    parameters: [
      {
        name: "grant_type",
        type: "string",
        required: true,
        description: "OAuth2 grant type (client_credentials)",
        example: "client_credentials"
      },
      {
        name: "client_id",
        type: "string",
        required: true,
        description: "Enterprise client identifier",
        example: "psizero_enterprise_client"
      },
      {
        name: "client_secret",
        type: "string",
        required: true,
        description: "Enterprise client secret",
        example: "secret_key_here"
      },
      {
        name: "scope",
        type: "string",
        required: false,
        description: "Requested scopes (platform.read, platform.write)",
        example: "platform.read platform.write"
      },
    ],
    sampleResponse: {
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      token_type: "Bearer",
      expires_in: 3600
    }
  },
];