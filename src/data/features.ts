import { LucideIcon } from "lucide-react";
import {
  Brain, Calculator, Shield, Zap, BarChart3, Layers, Code, Lock,
  Atom, Waves, Sparkles, Network, Target, Shuffle, Globe, Webhook,
  Key, MessageSquare, Eye, Hexagon, Gauge
} from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  category?: string;
}

export const features: Feature[] = [
  // Core Symbolic Resonance Solver
  {
    icon: Brain,
    title: "Symbolic Resonance Solver (SRS)",
    description: "Advanced NP-complete problem solving using symbolic entropy spaces and resonance operators for 3-SAT, subset sum, Hamiltonian paths, and custom problems.",
    category: "srs"
  },
  {
    icon: Calculator,
    title: "Multiple Problem Types",
    description: "Support for 3-SAT, k-SAT, subset sum, vertex cover, clique detection, exact 3-cover, and custom constraint problems with configurable projectors.",
    category: "srs"
  },
  
  // Holographic Quantum Encoder
  {
    icon: Atom,
    title: "Holographic Quantum Encoder (HQE)",
    description: "Simulate quantum holographic systems with prime eigenstate evolution, entropy dissipation, and resonance targeting for complex system modeling.",
    category: "hqe"
  },
  {
    icon: Waves,
    title: "Prime Eigenstate Evolution",
    description: "Time-series evolution of prime number eigenstates with configurable step sizes, amplitude tracking, and stability metrics.",
    category: "hqe"
  },
  
  // Quantum Semantics
  {
    icon: Sparkles,
    title: "Quantum Semantics (QSEM)",
    description: "Encode natural language concepts into prime-basis quantum vectors and compute semantic resonance, coherence, and concept relationships.",
    category: "qsem"
  },
  {
    icon: Network,
    title: "Concept Resonance Analysis",
    description: "Advanced semantic analysis through quantum vector spaces, enabling deep understanding of concept relationships and meaning resonance.",
    category: "qsem"
  },
  
  // Non-Local Communication
  {
    icon: Globe,
    title: "Non-Local Communication (NLC)",
    description: "Establish quantum communication channels using prime eigenstate resonance with golden and silver phase modulation for information transmission.",
    category: "nlc"
  },
  {
    icon: MessageSquare,
    title: "Quantum Channels",
    description: "Session-based communication with real-time channel quality monitoring, phase synchronization, and non-locality metrics tracking.",
    category: "nlc"
  },
  
  // Quantum Consciousness Resonator
  {
    icon: Eye,
    title: "Quantum Consciousness Resonator (QCR)",
    description: "Triadic consciousness simulation with multiple cognitive modes (analytical, creative, ethical, pragmatic, emotional) and stabilization tracking.",
    category: "qcr"
  },
  {
    icon: Target,
    title: "Cognitive Mode Integration",
    description: "Multi-modal consciousness resonance with configurable iterations, prompt-response cycles, and emergence pattern detection.",
    category: "qcr"
  },
  
  // I-Ching Oracle
  {
    icon: Hexagon,
    title: "I-Ching Oracle Evolution",
    description: "Hexagram sequence evolution using symbolic entropy dynamics, attractor analysis, and stabilization detection for divination and pattern recognition.",
    category: "iching"
  },
  {
    icon: Shuffle,
    title: "Symbolic Entropy Dynamics",
    description: "Advanced oracle consultation with entropy-driven hexagram transitions, proximity tracking, and convergence analysis.",
    category: "iching"
  },
  
  // Unified Physics
  {
    icon: Gauge,
    title: "Unified Physics Modeling",
    description: "Compute emergent gravitational effects from observer entropy reduction rates, field gradients, and informational density proxies.",
    category: "unified"
  },
  {
    icon: Layers,
    title: "Observer-Entropy Coupling",
    description: "Model gravitational emergence through observer consciousness and entropy reduction, bridging physics and information theory.",
    category: "unified"
  },
  
  // Platform Infrastructure
  {
    icon: Shield,
    title: "Enterprise Authentication",
    description: "Dual authentication system with API keys for development and OAuth2 client credentials for enterprise applications with comprehensive scoping.",
    category: "security"
  },
  {
    icon: Webhook,
    title: "Event Webhooks",
    description: "Real-time event notifications for session convergence, stability detection, resonance collapses, and system state changes.",
    category: "integration"
  },
  {
    icon: BarChart3,
    title: "Advanced Telemetry",
    description: "Comprehensive metrics collection including entropy tracking, Lyapunov exponents, satisfaction rates, and resonance strength measurements.",
    category: "analytics"
  },
  {
    icon: Code,
    title: "RESTful API Suite",
    description: "Modern OpenAPI 3.1 specification with automatic documentation, JSON schema validation, and idempotency support across all endpoints.",
    category: "development"
  },
  {
    icon: Lock,
    title: "Rate Limiting & Security",
    description: "Advanced rate limiting with enterprise tiers, secure headers, CORS configuration, and comprehensive error handling with RFC 7807 problem details.",
    category: "security"
  },
  {
    icon: Key,
    title: "Session Management",
    description: "Stateful session handling for NLC and QCR APIs with automatic cleanup, status tracking, and persistent state management.",
    category: "platform"
  },
];