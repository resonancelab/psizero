import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Atom, Zap, Target, ArrowRight, Code, BarChart3, Settings, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import MermaidDiagram from "@/components/ui/mermaid-diagram";
import HQEVisualization from "@/components/visualizations/HQEVisualization";

const HQE = () => {
  return (
    <PageLayout>
      <Section>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-4 rounded-lg">
                <Atom className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Holographic Quantum Encoder</h1>
                <p className="text-xl text-muted-foreground">Simulate quantum holographic systems using prime eigenstate dynamics</p>
              </div>
              <Badge className="bg-green-100 text-green-800 ml-auto">Stable</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg">
                <Atom className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">∞</div>
                <div className="text-sm text-muted-foreground">Prime Eigenstates</div>
              </div>
              <div className="text-center p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                <Waves className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">Quantum</div>
                <div className="text-sm text-muted-foreground">Holographic Evolution</div>
              </div>
              <div className="text-center p-6 bg-green-50/50 dark:bg-green-900/20 rounded-lg">
                <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">Real-time</div>
                <div className="text-sm text-muted-foreground">State Simulation</div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How Holographic Quantum Encoding Works</CardTitle>
                  <CardDescription>
                    The HQE system simulates quantum holographic dynamics using prime number eigenstates, enabling unprecedented quantum system modeling and optimization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Core Capabilities</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center text-muted-foreground"><Atom className="h-4 w-4 text-purple-500 mr-2" />Prime eigenstate simulation</li>
                        <li className="flex items-center text-muted-foreground"><Waves className="h-4 w-4 text-purple-500 mr-2" />Holographic state evolution</li>
                        <li className="flex items-center text-muted-foreground"><Target className="h-4 w-4 text-purple-500 mr-2" />Resonance target optimization</li>
                        <li className="flex items-center text-muted-foreground"><BarChart3 className="h-4 w-4 text-purple-500 mr-2" />Real-time amplitude tracking</li>
                        <li className="flex items-center text-muted-foreground"><Zap className="h-4 w-4 text-purple-500 mr-2" />Entropy dissipation control</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Simulation Process</h3>
                      <div className="text-sm space-y-2">
                        <p className="text-muted-foreground"><strong>1. Prime Selection:</strong> Choose prime eigenstates for the quantum system</p>
                        <p className="text-muted-foreground"><strong>2. Initial Conditions:</strong> Set amplitude distribution and resonance targets</p>
                        <p className="text-muted-foreground"><strong>3. Evolution Steps:</strong> Configure time discretization and step count</p>
                        <p className="text-muted-foreground"><strong>4. Dissipation Control:</strong> Apply entropy dissipation parameters</p>
                        <p className="text-muted-foreground"><strong>5. State Tracking:</strong> Monitor quantum state evolution in real-time</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mathematical Foundation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm mb-2"><strong>Quantum State Evolution:</strong></p>
                    <p className="font-mono text-sm">|ψ(t+dt)⟩ = U(dt)|ψ(t)⟩ exp(-λdt)</p>
                    <p className="text-xs text-muted-foreground mt-2">Where U(dt) is the evolution operator and λ controls entropy dissipation</p>
                    
                    <p className="text-sm mt-4 mb-2"><strong>Prime Eigenstate Superposition:</strong></p>
                    <p className="font-mono text-sm">|ψ⟩ = Σᵢ αᵢ|pᵢ⟩</p>
                    <p className="text-xs text-muted-foreground mt-2">Quantum superposition over prime number eigenstates |pᵢ⟩</p>
                    
                    <p className="text-sm mt-4 mb-2"><strong>Resonance Target Optimization:</strong></p>
                    <p className="font-mono text-sm">r_stable = ⟨ψ|H|ψ⟩ / ||ψ||²</p>
                    <p className="text-xs text-muted-foreground mt-2">Target resonance value for quantum state stabilization</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>HQE Simulation Workflow</CardTitle>
                  <CardDescription>
                    Complete process for simulating quantum holographic systems with prime eigenstate dynamics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram
                    chart={`
                      graph TD
                        START([Initialize HQE System]) --> PRIMES{Select Prime Eigenstates}
                        PRIMES --> |Valid Primes| SETUP[Setup Quantum State]
                        PRIMES --> |Invalid| ERROR[Return Error]
                        
                        SETUP --> AMPLITUDES[Initialize Amplitudes]
                        AMPLITUDES --> TARGET[Set Resonance Target]
                        TARGET --> PARAMS[Configure Parameters]
                        
                        PARAMS --> EVOLUTION{Begin Evolution Loop}
                        EVOLUTION --> UNITARY[Apply Unitary Evolution]
                        UNITARY --> DISSIPATE[Apply Entropy Dissipation]
                        DISSIPATE --> MEASURE[Measure Quantum State]
                        
                        MEASURE --> SNAPSHOT[Record Snapshot]
                        SNAPSHOT --> CONVERGENCE{Check Convergence}
                        
                        CONVERGENCE --> |Continue| EVOLUTION
                        CONVERGENCE --> |Target Reached| STABILIZED[System Stabilized]
                        CONVERGENCE --> |Max Steps| TIMEOUT[Evolution Complete]
                        
                        STABILIZED --> EXTRACT[Extract Final Metrics]
                        TIMEOUT --> EXTRACT
                        EXTRACT --> RESULT[Return HQE Response]
                        
                        RESULT --> END([Complete])
                        ERROR --> END
                        
                        subgraph "Quantum Evolution"
                          UNITARY --> PHASE[Phase Evolution]
                          UNITARY --> INTERFERENCE[Quantum Interference]
                          PHASE --> COHERENCE[Maintain Coherence]
                          INTERFERENCE --> COHERENCE
                        end
                        
                        classDef startEnd fill:#22c55e,stroke:#16a34a,stroke-width:3px,color:#fff
                        classDef process fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                        classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                        classDef quantum fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                        classDef error fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
                        
                        class START,END startEnd
                        class SETUP,AMPLITUDES,TARGET,PARAMS,SNAPSHOT,EXTRACT,RESULT process
                        class PRIMES,EVOLUTION,CONVERGENCE decision
                        class UNITARY,DISSIPATE,MEASURE,STABILIZED,TIMEOUT,PHASE,INTERFERENCE,COHERENCE quantum
                        class ERROR error
                    `}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quantum State Evolution</CardTitle>
                    <CardDescription>How quantum states evolve through prime eigenstate dynamics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        sequenceDiagram
                          participant C as Client
                          participant HQE as HQE Engine
                          participant QS as Quantum Simulator
                          participant PE as Prime Eigenstates
                          participant M as Metrics Collector
                          
                          C->>HQE: Submit simulation request
                          HQE->>PE: Initialize prime eigenstates
                          PE->>QS: Setup quantum superposition
                          
                          loop Evolution Steps
                            QS->>QS: Apply unitary evolution
                            QS->>QS: Entropy dissipation
                            QS->>PE: Update prime amplitudes
                            PE->>M: Collect state metrics
                            M->>HQE: Check convergence
                          end
                          
                          alt Target Reached
                            HQE->>C: Return stabilized state
                          else Max Steps
                            HQE->>C: Return final evolution
                          end
                          
                          Note over QS: Quantum coherence maintained<br/>throughout evolution
                          Note over PE: Prime eigenstate basis<br/>provides stability
                      `}
                      className="w-full"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resonance Targeting</CardTitle>
                    <CardDescription>Optimization process for achieving target resonance values</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        flowchart TB
                          TARGET[Resonance Target<br/>r_stable] --> CURRENT[Current State<br/>|ψ(t)⟩]
                          
                          CURRENT --> HAMILTONIAN[Hamiltonian<br/>Expectation ⟨H⟩]
                          HAMILTONIAN --> DELTA[Compute Δr]
                          
                          DELTA --> FEEDBACK{|Δr| < ε}
                          
                          FEEDBACK --> |No| ADJUST[Adjust Evolution<br/>Parameters]
                          FEEDBACK --> |Yes| CONVERGED[Target Achieved<br/>System Stable]
                          
                          ADJUST --> UNITARY[Modified Unitary<br/>Evolution]
                          UNITARY --> CURRENT
                          
                          CONVERGED --> METRICS[Final Resonance<br/>Metrics]
                          
                          subgraph "Optimization Loop"
                            DELTA
                            FEEDBACK
                            ADJUST
                          end
                          
                          classDef target fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
                          classDef process fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                          classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                          classDef result fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                          
                          class TARGET target
                          class CURRENT,HAMILTONIAN,ADJUST,UNITARY process
                          class FEEDBACK decision
                          class CONVERGED,METRICS result
                      `}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    POST /v1/hqe/simulate
                  </CardTitle>
                  <CardDescription>
                    Run a holographic quantum encoder simulation with prime eigenstate dynamics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Request Parameters</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm"><code>{`{
  "primes": [2, 3, 5, 7, 11],
  "dt": 0.1,
  "steps": 256,
  "lambda": 0.02,
  "resonanceTarget": 0.8,
  "initialAmplitudes": [0.4, 0.3, 0.2, 0.08, 0.02]
}`}</code></pre>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Response Format</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm"><code>{`{
  "snapshots": [
    {
      "step": 0,
      "amplitudes": [0.4, 0.3, 0.2, 0.08, 0.02],
      "metrics": {
        "entropy": 1.23,
        "resonanceStrength": 0.45,
        "dominance": 0.4
      }
    },
    {
      "step": 256,
      "amplitudes": [0.1, 0.7, 0.15, 0.04, 0.01],
      "metrics": {
        "entropy": 0.15,
        "resonanceStrength": 0.92,
        "dominance": 0.7
      }
    }
  ],
  "finalMetrics": {
    "entropy": 0.15,
    "plateauDetected": true,
    "resonanceStrength": 0.92,
    "locality": 0.23
  }
}`}</code></pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quantum State Optimization</CardTitle>
                    <CardDescription>Optimize quantum system to achieve target resonance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Configuration</h4>
                        <p className="text-sm text-muted-foreground mb-2">Primes: [2, 3, 5, 7]</p>
                        <p className="text-sm text-muted-foreground mb-2">Target: 0.85 resonance</p>
                        <p className="text-sm text-muted-foreground">Steps: 128</p>
                      </div>
                      <Button size="sm" className="w-full">
                        Try in Playground
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>High-Dimensional Simulation</CardTitle>
                    <CardDescription>Simulate complex quantum systems with many prime eigenstates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Configuration</h4>
                        <p className="text-sm text-muted-foreground mb-2">Primes: [2, 3, 5, 7, 11, 13, 17]</p>
                        <p className="text-sm text-muted-foreground mb-2">λ: 0.01 (low dissipation)</p>
                        <p className="text-sm text-muted-foreground">Steps: 512</p>
                      </div>
                      <Button size="sm" className="w-full">
                        Try in Playground
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quantum Computing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Quantum algorithm simulation</li>
                      <li>• Quantum error correction modeling</li>
                      <li>• Quantum gate optimization</li>
                      <li>• Decoherence analysis</li>
                      <li>• Quantum circuit design</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Materials Science</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Quantum material properties</li>
                      <li>• Superconductor modeling</li>
                      <li>• Magnetic system simulation</li>
                      <li>• Phase transition analysis</li>
                      <li>• Electronic structure calculations</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cryptography & Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Quantum key distribution</li>
                      <li>• Quantum random number generation</li>
                      <li>• Post-quantum cryptography</li>
                      <li>• Quantum-safe protocols</li>
                      <li>• Security vulnerability analysis</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI & Machine Learning</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Quantum machine learning</li>
                      <li>• Variational quantum algorithms</li>
                      <li>• Quantum neural networks</li>
                      <li>• Optimization landscapes</li>
                      <li>• Quantum advantage analysis</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Simulate Quantum Systems?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Explore the frontiers of quantum holographic simulation with prime eigenstate dynamics and real-time evolution tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/playground?api=hqe">
                  Try HQE Playground
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/docs/hqe">View Full Documentation</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Interactive Visualization */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Interactive HQE Demonstration
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Experience 3D quantum holographic state evolution in real-time. Watch prime eigenstate amplitude animations,
                resonance target tracking, and holographic quantum coherence dynamics unfold before your eyes.
              </p>
            </CardHeader>
            <CardContent>
              <HQEVisualization />
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default HQE;