import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain, Atom, Sparkles, Globe, Eye, Hexagon, Gauge,
  ArrowRight, Play, Zap, Network, TrendingUp, Building, BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import MermaidDiagram from "@/components/ui/mermaid-diagram";

const MultiApiDemo = () => {
  const demoWorkflows = [
    {
      id: "ai-decision-engine",
      title: "AI-Enhanced Decision Engine",
      description: "Combine QSEM semantic analysis → QCR consciousness processing → I-Ching strategic guidance",
      apis: ["QSEM", "QCR", "I-Ching"],
      category: "Business Intelligence",
      complexity: "Advanced",
      useCase: "Strategic business decisions with multi-perspective analysis"
    },
    {
      id: "quantum-optimization",
      title: "Quantum-Enhanced Optimization",
      description: "SRS solves constraints → HQE optimizes quantum states → Unified Physics models outcomes",
      apis: ["SRS", "HQE", "Unified"],
      category: "Scientific Computing",
      complexity: "Expert",
      useCase: "Complex system optimization with quantum advantages"
    },
    {
      id: "consciousness-communication",
      title: "Consciousness-Driven Communication",
      description: "QCR generates conscious responses → QSEM encodes semantics → NLC transmits via quantum channels",
      apis: ["QCR", "QSEM", "NLC"],
      category: "Advanced AI",
      complexity: "Expert",
      useCase: "Intelligent, conscious communication systems"
    },
    {
      id: "adaptive-oracle",
      title: "Adaptive Oracle System",
      description: "I-Ching provides guidance → QSEM analyzes concepts → QCR validates with consciousness",
      apis: ["I-Ching", "QSEM", "QCR"],
      category: "Decision Support",
      complexity: "Intermediate",
      useCase: "Dynamic guidance systems with multi-modal validation"
    }
  ];

  const industryScenarios = [
    {
      title: "Financial Trading Platform",
      description: "Real-time market analysis with quantum-enhanced decision making",
      apis: ["SRS", "QSEM", "QCR", "I-Ching"],
      workflow: "Market data → SRS optimization → QSEM sentiment → QCR risk analysis → I-Ching timing",
      benefits: ["Quantum-speed optimization", "Semantic market analysis", "Conscious risk assessment", "Strategic timing"],
      icon: TrendingUp
    },
    {
      title: "Healthcare Diagnosis System",
      description: "Multi-modal diagnostic analysis with consciousness-driven insights",
      apis: ["QSEM", "QCR", "HQE", "Unified"],
      workflow: "Symptoms → QSEM encoding → QCR analysis → HQE modeling → Unified physics validation",
      benefits: ["Semantic symptom analysis", "Conscious medical reasoning", "Quantum biological modeling", "Physics-based validation"],
      icon: Building
    },
    {
      title: "Research Collaboration Network",
      description: "Quantum-secured research communication with conscious content analysis",
      apis: ["NLC", "QSEM", "QCR", "SRS"],
      workflow: "Research data → QSEM conceptual analysis → QCR validation → NLC secure transmission → SRS optimization",
      benefits: ["Quantum-secure communication", "Intelligent content analysis", "Conscious validation", "Optimal collaboration"],
      icon: Network
    }
  ];

  return (
    <PageLayout>
      <Section>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Multi-API Demo Workflows</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the true power of the PsiZero Resonance Platform through sophisticated workflows that combine multiple APIs for breakthrough applications.
            </p>
          </div>

          <Tabs defaultValue="workflows" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workflows">Demo Workflows</TabsTrigger>
              <TabsTrigger value="industry">Industry Scenarios</TabsTrigger>
              <TabsTrigger value="interactive">Interactive Demos</TabsTrigger>
            </TabsList>

            <TabsContent value="workflows" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {demoWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{workflow.title}</CardTitle>
                          <CardDescription className="text-base">{workflow.description}</CardDescription>
                        </div>
                        <Badge variant={workflow.complexity === 'Expert' ? 'destructive' : workflow.complexity === 'Advanced' ? 'default' : 'secondary'}>
                          {workflow.complexity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">APIs Used:</h4>
                        <div className="flex flex-wrap gap-2">
                          {workflow.apis.map((api) => (
                            <Badge key={api} variant="outline" className="flex items-center gap-1">
                              {api === 'SRS' && <Brain className="h-3 w-3" />}
                              {api === 'HQE' && <Atom className="h-3 w-3" />}
                              {api === 'QSEM' && <Sparkles className="h-3 w-3" />}
                              {api === 'NLC' && <Globe className="h-3 w-3" />}
                              {api === 'QCR' && <Eye className="h-3 w-3" />}
                              {api === 'I-Ching' && <Hexagon className="h-3 w-3" />}
                              {api === 'Unified' && <Gauge className="h-3 w-3" />}
                              {api}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Use Case:</h4>
                        <p className="text-sm text-gray-600">{workflow.useCase}</p>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button size="sm" className="flex-1">
                          <Play className="h-4 w-4 mr-2" />
                          Run Demo
                        </Button>
                        <Button size="sm" variant="outline">
                          View Code
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Detailed Workflow Example */}
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle>AI-Enhanced Decision Engine: Detailed Workflow</CardTitle>
                  <CardDescription>
                    See how QSEM, QCR, and I-Ching work together to create an intelligent decision-making system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram
                    chart={`
                      graph TD
                        INPUT[Business Decision<br/>Input Query] --> QSEM[QSEM: Concept Analysis]
                        
                        QSEM --> ENCODE[Encode Key Concepts<br/>to Quantum Vectors]
                        ENCODE --> SEMANTIC[Analyze Semantic<br/>Relationships]
                        SEMANTIC --> CONTEXT[Extract Decision<br/>Context]
                        
                        CONTEXT --> QCR[QCR: Consciousness Processing]
                        QCR --> MODES[Activate Cognitive Modes<br/>Analytical + Creative + Ethical]
                        MODES --> PROCESS[Multi-Perspective<br/>Analysis]
                        PROCESS --> SYNTHESIZE[Synthesize Conscious<br/>Response]
                        
                        SYNTHESIZE --> ICHING[I-Ching: Strategic Guidance]
                        ICHING --> ORACLE[Generate Oracle<br/>Question]
                        ORACLE --> EVOLVE[Hexagram Evolution<br/>Process]
                        EVOLVE --> WISDOM[Extract Strategic<br/>Wisdom]
                        
                        WISDOM --> INTEGRATE[Integration Layer]
                        SEMANTIC --> INTEGRATE
                        SYNTHESIZE --> INTEGRATE
                        
                        INTEGRATE --> DECISION[Final Decision<br/>Recommendation]
                        DECISION --> CONFIDENCE[Confidence Score<br/>& Reasoning]
                        CONFIDENCE --> OUTPUT[Structured Output<br/>with Multi-API Insights]
                        
                        subgraph "QSEM Processing"
                          ENCODE --> VECTORS[Prime Basis Vectors]
                          VECTORS --> RESONANCE[Concept Resonance]
                          RESONANCE --> SEMANTIC
                        end
                        
                        subgraph "QCR Processing"
                          MODES --> ANALYTICAL[Analytical Mode]
                          MODES --> CREATIVE[Creative Mode]
                          MODES --> ETHICAL[Ethical Mode]
                          ANALYTICAL --> PROCESS
                          CREATIVE --> PROCESS
                          ETHICAL --> PROCESS
                        end
                        
                        subgraph "I-Ching Processing"
                          ORACLE --> ENTROPY[Entropy Dynamics]
                          ENTROPY --> ATTRACTORS[Attractor Landscape]
                          ATTRACTORS --> EVOLVE
                        end
                        
                        classDef input fill:#22c55e,stroke:#16a34a,stroke-width:3px,color:#fff
                        classDef qsem fill:#ec4899,stroke:#db2777,stroke-width:2px,color:#fff
                        classDef qcr fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#fff
                        classDef iching fill:#f97316,stroke:#ea580c,stroke-width:2px,color:#fff
                        classDef integration fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                        classDef output fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
                        
                        class INPUT input
                        class QSEM,ENCODE,SEMANTIC,CONTEXT,VECTORS,RESONANCE qsem
                        class QCR,MODES,PROCESS,SYNTHESIZE,ANALYTICAL,CREATIVE,ETHICAL qcr
                        class ICHING,ORACLE,EVOLVE,WISDOM,ENTROPY,ATTRACTORS iching
                        class INTEGRATE integration
                        class DECISION,CONFIDENCE,OUTPUT output
                    `}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="industry" className="space-y-8">
              {industryScenarios.map((scenario, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <scenario.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{scenario.title}</CardTitle>
                        <CardDescription className="text-base">{scenario.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Workflow Process:</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-mono text-sm">{scenario.workflow}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">APIs Integrated:</h4>
                        <div className="flex flex-wrap gap-2">
                          {scenario.apis.map((api) => (
                            <Badge key={api} variant="outline" className="flex items-center gap-1">
                              {api === 'SRS' && <Brain className="h-3 w-3" />}
                              {api === 'HQE' && <Atom className="h-3 w-3" />}
                              {api === 'QSEM' && <Sparkles className="h-3 w-3" />}
                              {api === 'NLC' && <Globe className="h-3 w-3" />}
                              {api === 'QCR' && <Eye className="h-3 w-3" />}
                              {api === 'I-Ching' && <Hexagon className="h-3 w-3" />}
                              {api === 'Unified' && <Gauge className="h-3 w-3" />}
                              {api}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Key Benefits:</h4>
                        <ul className="space-y-1">
                          {scenario.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm flex items-center">
                              <Zap className="h-3 w-3 text-green-500 mr-2" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Launch Demo
                      </Button>
                      <Button size="sm" variant="outline">
                        Technical Details
                      </Button>
                      <Button size="sm" variant="outline">
                        ROI Calculator
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="interactive" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Live API Orchestration</CardTitle>
                    <CardDescription>
                      Build custom workflows by connecting APIs in real-time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-2">Drag & Drop Interface</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Create sophisticated workflows by dragging API blocks and connecting them with intelligent data flow.
                      </p>
                      <Button className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Open Visual Builder
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Real-Time Analytics</CardTitle>
                    <CardDescription>
                      Monitor multi-API performance and optimization metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-2">Performance Dashboard</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Track latency, resonance quality, and system coherence across all integrated APIs.
                      </p>
                      <Button className="w-full">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Custom Scenario Builder</CardTitle>
                    <CardDescription>
                      Design and test your own multi-API scenarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-2">Scenario Designer</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Create custom business scenarios and test them with our full API suite.
                      </p>
                      <Button className="w-full">
                        <Brain className="h-4 w-4 mr-2" />
                        Create Scenario
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Enterprise Simulator</CardTitle>
                    <CardDescription>
                      Simulate large-scale enterprise deployments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                      <h4 className="font-semibold mb-2">Scale Testing</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Test your multi-API workflows under enterprise-level load and complexity.
                      </p>
                      <Button className="w-full">
                        <Gauge className="h-4 w-4 mr-2" />
                        Run Simulation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Build Revolutionary Applications?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Combine the power of quantum computing, consciousness simulation, and symbolic resonance to create applications that were impossible before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/playground">Interactive Playground</Link>
              </Button>
              <Button size="lg" variant="outline">
                Get Enterprise Access
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default MultiApiDemo;