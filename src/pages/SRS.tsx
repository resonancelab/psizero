import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Zap, Target, ArrowRight, Code, BarChart3, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import MermaidDiagram from "@/components/ui/mermaid-diagram";

const SRS = () => {
  return (
    <PageLayout>
      <Section>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Symbolic Resonance Solver</h1>
                <p className="text-xl text-gray-600">Advanced NP-complete problem solving using symbolic entropy spaces</p>
              </div>
              <Badge className="bg-green-100 text-green-800 ml-auto">Stable</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">Problem Types Supported</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">O(n³)</div>
                <div className="text-sm text-gray-600">Polynomial Time Complexity</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">95%+</div>
                <div className="text-sm text-gray-600">Solution Success Rate</div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>
                    The Symbolic Resonance Solver transforms NP-complete problems into symbolic entropy spaces where solutions emerge through resonance dynamics.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Supported Problem Types</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center"><Target className="h-4 w-4 text-blue-500 mr-2" />3-SAT (Boolean Satisfiability)</li>
                        <li className="flex items-center"><Target className="h-4 w-4 text-blue-500 mr-2" />k-SAT (Generalized SAT)</li>
                        <li className="flex items-center"><Target className="h-4 w-4 text-blue-500 mr-2" />Subset Sum</li>
                        <li className="flex items-center"><Target className="h-4 w-4 text-blue-500 mr-2" />Hamiltonian Path</li>
                        <li className="flex items-center"><Target className="h-4 w-4 text-blue-500 mr-2" />Vertex Cover</li>
                        <li className="flex items-center"><Target className="h-4 w-4 text-blue-500 mr-2" />Clique Detection</li>
                        <li className="flex items-center"><Target className="h-4 w-4 text-blue-500 mr-2" />Exact 3-Cover</li>
                        <li className="flex items-center"><Target className="h-4 w-4 text-blue-500 mr-2" />Custom Problems</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Key Features</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center"><Settings className="h-4 w-4 text-green-500 mr-2" />Configurable projectors and mixers</li>
                        <li className="flex items-center"><BarChart3 className="h-4 w-4 text-green-500 mr-2" />Real-time telemetry tracking</li>
                        <li className="flex items-center"><Zap className="h-4 w-4 text-green-500 mr-2" />Adaptive learning schedules</li>
                        <li className="flex items-center"><Target className="h-4 w-4 text-green-500 mr-2" />Plateau detection</li>
                        <li className="flex items-center"><Brain className="h-4 w-4 text-green-500 mr-2" />Entropy-based stopping criteria</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SRS Problem-Solving Workflow</CardTitle>
                  <CardDescription>
                    Complete process flow from problem input to solution discovery using symbolic resonance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram
                    chart={`
                      flowchart TD
                        START([Problem Input]) --> PARSE{Parse Problem Spec}
                        PARSE --> |Valid| ENTROPY[Initialize Entropy Space]
                        PARSE --> |Invalid| ERROR[Return Error]
                        
                        ENTROPY --> ENCODE[Encode Constraints]
                        ENCODE --> OPERATORS[Setup Resonance Operators]
                        OPERATORS --> INIT[Initialize State Vector]
                        
                        INIT --> ITERATE{Begin Iteration Loop}
                        ITERATE --> PROJECT[Apply Projector]
                        PROJECT --> MIX[Apply Mixer]
                        MIX --> MEASURE[Measure State]
                        
                        MEASURE --> TELEMETRY[Update Telemetry]
                        TELEMETRY --> CHECK{Check Convergence}
                        
                        CHECK --> |Continue| ITERATE
                        CHECK --> |Plateau| EXTRACT[Extract Solution]
                        CHECK --> |Max Iter| EXTRACT
                        
                        EXTRACT --> VALIDATE{Validate Solution}
                        VALIDATE --> |Valid| SOLUTION[Return Solution]
                        VALIDATE --> |Invalid| UNSOLVED[Return Unsolved]
                        
                        SOLUTION --> END([Complete])
                        UNSOLVED --> END
                        ERROR --> END
                        
                        classDef startEnd fill:#22c55e,stroke:#16a34a,stroke-width:3px,color:#fff
                        classDef process fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                        classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                        classDef error fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
                        
                        class START,END startEnd
                        class ENTROPY,ENCODE,OPERATORS,INIT,PROJECT,MIX,MEASURE,TELEMETRY,EXTRACT,SOLUTION,UNSOLVED process
                        class PARSE,ITERATE,CHECK,VALIDATE decision
                        class ERROR error
                    `}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resonance Evolution</CardTitle>
                    <CardDescription>State transitions in the symbolic entropy space</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        stateDiagram-v2
                          [*] --> Initialization : Problem Input
                          
                          Initialization --> HighEntropy : Setup Operators
                          HighEntropy --> Exploration : Begin Resonance
                          
                          Exploration --> Exploration : Apply P(t) & M(t)
                          Exploration --> Convergence : Plateau Detection
                          Exploration --> Divergence : Energy Increase
                          
                          Convergence --> SolutionFound : Valid Assignment
                          Convergence --> LocalMinimum : Invalid Assignment
                          
                          Divergence --> ParameterAdjust : Adapt Schedule
                          ParameterAdjust --> Exploration : Resume
                          
                          LocalMinimum --> Restart : New Initial State
                          Restart --> HighEntropy : Reset Entropy
                          
                          SolutionFound --> [*] : Return Certificate
                          
                          note right of Convergence
                            Entropy < threshold
                            Plateau detected
                            Mass > min_threshold
                          end note
                          
                          note left of Divergence
                            Entropy increasing
                            No progress detected
                            Adjust eta schedule
                          end note
                      `}
                      className="w-full"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>3-SAT Solving Process</CardTitle>
                    <CardDescription>Specific workflow for Boolean satisfiability problems</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        sequenceDiagram
                          participant C as Client
                          participant SRS as SRS Engine
                          participant ES as Entropy Space
                          participant OP as Operators
                          participant T as Telemetry
                          
                          C->>SRS: Submit 3-SAT Problem
                          SRS->>ES: Initialize N-dimensional space
                          SRS->>OP: Setup Projector/Mixer
                          
                          loop Resonance Iteration
                            SRS->>OP: Apply Projector P(t)
                            OP->>ES: Update state vector
                            SRS->>OP: Apply Mixer M(t)
                            OP->>ES: Evolve quantum state
                            ES->>T: Record metrics (S, L, satRate)
                            T->>SRS: Check convergence
                          end
                          
                          alt Solution Found
                            ES->>SRS: Extract assignment
                            SRS->>C: Return feasible solution
                          else No Solution
                            SRS->>C: Return infeasible result
                          end
                          
                          Note over ES: Entropy space encodes<br/>all possible assignments
                          Note over OP: Operators enforce<br/>constraint satisfaction
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
                    POST /v1/srs/solve
                  </CardTitle>
                  <CardDescription>
                    Submit an NP-complete problem for solving using the Symbolic Resonance algorithm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Request Parameters</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm"><code>{`{
  "problem": "3sat",
  "spec": {
    "variables": 4,
    "clauses": [
      [{"var": 1, "neg": false}, {"var": 2, "neg": true}, {"var": 3, "neg": false}],
      [{"var": 2, "neg": false}, {"var": 3, "neg": false}, {"var": 4, "neg": true}]
    ]
  },
  "config": {
    "stop": {"iterMax": 5000, "plateauEps": 1e-6},
    "schedules": {"eta0": 0.3, "etaDecay": 0.002}
  }
}`}</code></pre>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Response Format</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm"><code>{`{
  "feasible": true,
  "certificate": {
    "assignment": [1, 0, 1, 0]
  },
  "metrics": {
    "entropy": 0.034,
    "plateauDetected": true,
    "dominance": 0.89,
    "resonanceStrength": 0.95
  },
  "telemetry": [
    {"t": 0, "S": 1.23, "L": 0.45, "satRate": 0.67},
    {"t": 100, "S": 0.034, "L": 0.12, "satRate": 1.0}
  ]
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
                    <CardTitle>3-SAT Example</CardTitle>
                    <CardDescription>Solve a Boolean satisfiability problem</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Problem</h4>
                        <p className="text-sm text-gray-600 mb-2">Find values for x₁, x₂, x₃ that satisfy:</p>
                        <ul className="text-sm space-y-1">
                          <li>(x₁ ∨ ¬x₂ ∨ x₃)</li>
                          <li>(¬x₁ ∨ x₂ ∨ ¬x₃)</li>
                        </ul>
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
                    <CardTitle>Subset Sum Example</CardTitle>
                    <CardDescription>Find subset that sums to target</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Problem</h4>
                        <p className="text-sm text-gray-600 mb-2">Weights: [3, 7, 1, 14, 2]</p>
                        <p className="text-sm text-gray-600">Target: 9</p>
                        <p className="text-sm text-green-600 mt-2">Solution: [7, 2] = 9</p>
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

            <TabsContent value="telemetry" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Telemetry & Metrics</CardTitle>
                  <CardDescription>
                    The SRS API provides comprehensive telemetry data for monitoring solution convergence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Real-time Metrics</h4>
                      <ul className="space-y-2 text-sm">
                        <li><strong>Symbolic Entropy (S):</strong> Measure of system disorder</li>
                        <li><strong>Lyapunov Metric (L):</strong> Stability indicator</li>
                        <li><strong>Satisfaction Rate:</strong> Constraint fulfillment [0,1]</li>
                        <li><strong>Resonance Strength:</strong> Phase-lock quality [0,1]</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Convergence Indicators</h4>
                      <ul className="space-y-2 text-sm">
                        <li><strong>Plateau Detection:</strong> Automatic convergence detection</li>
                        <li><strong>Mass Threshold:</strong> Solution confidence level</li>
                        <li><strong>Dominance:</strong> Max mass/coherence ratio</li>
                        <li><strong>Locality:</strong> Non-locality inverse measure</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Solve Complex Problems?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Start using the Symbolic Resonance Solver to tackle your most challenging NP-complete problems with breakthrough efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/playground?api=srs">
                  Try SRS Playground
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/docs/srs">View Full Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default SRS;