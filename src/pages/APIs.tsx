import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain, Atom, Sparkles, Globe, Eye, Hexagon, Gauge,
  ArrowRight, Zap, Target, Network
} from "lucide-react";
import { Link } from "react-router-dom";
import MermaidDiagram from "@/components/ui/mermaid-diagram";

interface ApiCategoryProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  status: "stable" | "beta" | "alpha";
  endpoints: number;
  category: string;
  features: string[];
}

const ApiCategory = ({ icon: IconComponent, title, description, status, endpoints, category, features }: ApiCategoryProps) => {
  const statusColors = {
    stable: "bg-green-100 text-green-800",
    beta: "bg-yellow-100 text-yellow-800", 
    alpha: "bg-red-100 text-red-800"
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <Badge className={statusColors[status]}>{status}</Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Endpoints:</span>
            <span className="font-medium">{endpoints}</span>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Key Features:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Target className="h-3 w-3 text-blue-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <Button asChild className="w-full">
            <Link to={`/apis/${category}`}>
              Explore API
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const APIs = () => {
  const apiCategories: ApiCategoryProps[] = [
    {
      icon: Brain,
      title: "Symbolic Resonance Solver (SRS)",
      description: "Advanced NP-complete problem solving using symbolic entropy spaces and resonance operators.",
      status: "stable",
      endpoints: 1,
      category: "srs",
      features: [
        "3-SAT, k-SAT, subset sum problems",
        "Custom constraint definitions", 
        "Resonance telemetry tracking",
        "Configurable solver parameters"
      ]
    },
    {
      icon: Atom,
      title: "Holographic Quantum Encoder (HQE)",
      description: "Simulate quantum holographic systems with prime eigenstate evolution and resonance targeting.",
      status: "stable",
      endpoints: 1,
      category: "hqe",
      features: [
        "Prime eigenstate simulation",
        "Time-series amplitude tracking",
        "Entropy dissipation modeling",
        "Resonance stability metrics"
      ]
    },
    {
      icon: Sparkles,
      title: "Quantum Semantics (QSEM)",
      description: "Encode natural language concepts into prime-basis quantum vectors for semantic analysis.",
      status: "beta",
      endpoints: 2,
      category: "qsem",
      features: [
        "Concept encoding to quantum vectors",
        "Semantic resonance computation",
        "Coherence analysis",
        "Relationship mapping"
      ]
    },
    {
      icon: Globe,
      title: "Non-Local Communication (NLC)",
      description: "Establish quantum communication channels using prime eigenstate resonance.",
      status: "beta",
      endpoints: 3,
      category: "nlc",
      features: [
        "Quantum channel establishment",
        "Golden/silver phase modulation",
        "Message transmission",
        "Channel quality monitoring"
      ]
    },
    {
      icon: Eye,
      title: "Quantum Consciousness Resonator (QCR)",
      description: "Triadic consciousness simulation with multiple cognitive modes and stabilization.",
      status: "alpha",
      endpoints: 3,
      category: "qcr",
      features: [
        "Multi-modal consciousness",
        "Triadic resonance patterns",
        "Prompt-response cycles",
        "Stabilization detection"
      ]
    },
    {
      icon: Hexagon,
      title: "I-Ching Oracle",
      description: "Hexagram sequence evolution using symbolic entropy dynamics and attractor analysis.",
      status: "stable",
      endpoints: 1,
      category: "iching",
      features: [
        "Hexagram evolution",
        "Entropy dynamics",
        "Attractor proximity",
        "Stabilization analysis"
      ]
    },
    {
      icon: Gauge,
      title: "Unified Physics",
      description: "Compute emergent gravitational effects from observer entropy reduction and field gradients.",
      status: "alpha",
      endpoints: 1,
      category: "unified",
      features: [
        "Emergent gravity computation",
        "Observer-entropy coupling",
        "Field strength calculation",
        "Informational density modeling"
      ]
    }
  ];

  return (
    <PageLayout>
      <Section>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              PsiZero Resonance API Suite
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive collection of cutting-edge resonance-based APIs for symbolic solving, 
              quantum encoding, semantic analysis, consciousness simulation, and unified physics modeling.
            </p>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <Network className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">7</div>
              <div className="text-sm text-gray-600">API Categories</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">Total Endpoints</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">Uptime SLA</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <Brain className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </div>

          {/* API Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiCategories.map((category, index) => (
              <ApiCategory key={index} {...category} />
            ))}
          </div>

          {/* Platform Architecture Diagram */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Architecture</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Understanding the interconnected nature of PsiZero Resonance APIs and their workflow relationships.
              </p>
            </div>
            
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>API Integration Flow</CardTitle>
                <CardDescription>
                  Complete workflow showing how different resonance APIs interact and complement each other
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  chart={`
                    graph TB
                      Client[Client Application] --> Auth[Authentication Gateway]
                      Auth --> API[API Router]
                      
                      API --> SRS[SRS - Symbolic Resonance Solver]
                      API --> HQE[HQE - Holographic Quantum Encoder]
                      API --> QSEM[QSEM - Quantum Semantics]
                      API --> NLC[NLC - Non-Local Communication]
                      API --> QCR[QCR - Quantum Consciousness]
                      API --> ICHING[I-Ching Oracle]
                      API --> UNIFIED[Unified Physics]
                      
                      SRS --> Entropy[Entropy Space Engine]
                      HQE --> Quantum[Quantum State Manager]
                      QSEM --> Vector[Vector Processing]
                      NLC --> Channel[Quantum Channels]
                      QCR --> Consciousness[Consciousness Engine]
                      ICHING --> Symbols[Symbol Dynamics]
                      UNIFIED --> Physics[Physics Modeling]
                      
                      Entropy --> Analytics[Real-time Analytics]
                      Quantum --> Analytics
                      Vector --> Analytics
                      Channel --> Analytics
                      Consciousness --> Analytics
                      Symbols --> Analytics
                      Physics --> Analytics
                      
                      Analytics --> Webhooks[Webhook System]
                      Analytics --> Dashboard[Dashboard Updates]
                      
                      subgraph "Core Resonance Engine"
                        Entropy
                        Quantum
                        Vector
                        Channel
                        Consciousness
                        Symbols
                        Physics
                      end
                      
                      subgraph "API Layer"
                        SRS
                        HQE
                        QSEM
                        NLC
                        QCR
                        ICHING
                        UNIFIED
                      end
                      
                      classDef apiNode fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                      classDef engineNode fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                      classDef systemNode fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
                      
                      class SRS,HQE,QSEM,NLC,QCR,ICHING,UNIFIED apiNode
                      class Entropy,Quantum,Vector,Channel,Consciousness,Symbols,Physics engineNode
                      class Analytics,Webhooks,Dashboard systemNode
                  `}
                  className="w-full"
                />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>Request Processing Flow</CardTitle>
                  <CardDescription>How API requests flow through the resonance platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram
                    chart={`
                      sequenceDiagram
                        participant C as Client
                        participant A as Auth Gateway
                        participant R as API Router
                        participant E as Resonance Engine
                        participant S as Storage
                        participant W as Webhooks
                        
                        C->>A: API Request + Key
                        A->>A: Validate Credentials
                        A->>R: Authenticated Request
                        R->>E: Route to Specific API
                        E->>E: Process with Resonance
                        E->>S: Store Results
                        E->>R: Return Response
                        R->>A: Formatted Response
                        A->>C: Final Response
                        E->>W: Trigger Events (if configured)
                        W->>C: Webhook Notifications
                    `}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Multi-API Workflow</CardTitle>
                  <CardDescription>Example of chaining multiple resonance APIs together</CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram
                    chart={`
                      flowchart LR
                        START([Start Workflow]) --> QSEM{QSEM Encode}
                        QSEM --> |Concepts to Vectors| HQE{HQE Simulate}
                        HQE --> |Quantum States| SRS{SRS Solve}
                        SRS --> |Solutions| QCR{QCR Analyze}
                        QCR --> |Consciousness| NLC{NLC Transmit}
                        NLC --> |Channel| ICHING{I-Ching Oracle}
                        ICHING --> |Guidance| END([Complete])
                        
                        QSEM -.-> Analytics[Analytics Engine]
                        HQE -.-> Analytics
                        SRS -.-> Analytics
                        QCR -.-> Analytics
                        NLC -.-> Analytics
                        ICHING -.-> Analytics
                        
                        Analytics --> Dashboard[Real-time Dashboard]
                        Analytics --> Webhooks[Event Notifications]
                        
                        classDef startEnd fill:#22c55e,stroke:#16a34a,stroke-width:3px,color:#fff
                        classDef apiNode fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                        classDef systemNode fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                        
                        class START,END startEnd
                        class QSEM,HQE,SRS,QCR,NLC,ICHING apiNode
                        class Analytics,Dashboard,Webhooks systemNode
                    `}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Getting Started Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Choose your plan and start exploring the possibilities of resonance-based computing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/playground">
                  Try API Playground
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/docs">View Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default APIs;