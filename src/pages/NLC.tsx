import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Radio, Zap, ArrowRight, Code, BarChart3, Wifi, Satellite } from "lucide-react";
import { Link } from "react-router-dom";
import MermaidDiagram from "@/components/ui/mermaid-diagram";
import NLCVisualization from "@/components/visualizations/NLCVisualization";

const NLC = () => {
  return (
    <PageLayout>
      <Section>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Non-Local Communication</h1>
                <p className="text-xl text-gray-600">Establish quantum communication channels using prime eigenstate resonance</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 ml-auto">Beta</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Instant</div>
                <div className="text-sm text-gray-600">Non-Local Transmission</div>
              </div>
              <div className="text-center p-6 bg-teal-50 rounded-lg">
                <Radio className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Quantum</div>
                <div className="text-sm text-gray-600">Channel Resonance</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Satellite className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Prime</div>
                <div className="text-sm text-gray-600">Eigenstate Coupling</div>
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
                  <CardTitle>How Non-Local Communication Works</CardTitle>
                  <CardDescription>
                    NLC enables instantaneous information transmission across any distance using quantum entanglement and prime eigenstate resonance channels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Core Capabilities</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center"><Globe className="h-4 w-4 text-green-500 mr-2" />Quantum channel establishment</li>
                        <li className="flex items-center"><Radio className="h-4 w-4 text-green-500 mr-2" />Prime eigenstate synchronization</li>
                        <li className="flex items-center"><Wifi className="h-4 w-4 text-green-500 mr-2" />Real-time channel quality monitoring</li>
                        <li className="flex items-center"><BarChart3 className="h-4 w-4 text-green-500 mr-2" />Message transmission tracking</li>
                        <li className="flex items-center"><Zap className="h-4 w-4 text-green-500 mr-2" />Golden/Silver phase optimization</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Communication Process</h3>
                      <div className="text-sm space-y-2">
                        <p><strong>1. Channel Creation:</strong> Establish quantum entangled channel using prime numbers</p>
                        <p><strong>2. Phase Synchronization:</strong> Align golden and silver phase ratios</p>
                        <p><strong>3. Resonance Tuning:</strong> Optimize channel quality for transmission</p>
                        <p><strong>4. Message Encoding:</strong> Encode information into quantum states</p>
                        <p><strong>5. Instant Transmission:</strong> Send data through non-local channel</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quantum Communication Theory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm mb-2"><strong>Prime Eigenstate Entanglement:</strong></p>
                    <p className="font-mono text-sm">|ψ_AB⟩ = Σᵢ √pᵢ|pᵢ⟩_A ⊗ |pᵢ⟩_B</p>
                    <p className="text-xs text-gray-600 mt-2">Quantum entangled state across prime eigenstate basis</p>
                    
                    <p className="text-sm mt-4 mb-2"><strong>Golden Phase Synchronization:</strong></p>
                    <p className="font-mono text-sm">φ_golden = (1 + √5)/2 ≈ 1.618</p>
                    <p className="text-xs text-gray-600 mt-2">Golden ratio phase provides optimal channel stability</p>
                    
                    <p className="text-sm mt-4 mb-2"><strong>Channel Quality Metric:</strong></p>
                    <p className="font-mono text-sm">Q = |⟨ψ_A|ψ_B⟩|² × e^(-λt)</p>
                    <p className="text-xs text-gray-600 mt-2">Quantum fidelity with decoherence factor</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>NLC Session Workflow</CardTitle>
                  <CardDescription>
                    Complete process for establishing and maintaining quantum communication channels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram
                    chart={`
                      graph TD
                        START([Create NLC Session]) --> VALIDATE{Validate Parameters}
                        VALIDATE --> |Valid| PRIMES[Initialize Prime Eigenstates]
                        VALIDATE --> |Invalid| ERROR[Return Error]
                        
                        PRIMES --> PHASES[Setup Phase Configuration]
                        PHASES --> GOLDEN{Golden Phase Enabled}
                        PHASES --> SILVER{Silver Phase Enabled}
                        
                        GOLDEN --> |Yes| GOLDEN_SYNC[Configure Golden Ratio φ]
                        SILVER --> |Yes| SILVER_SYNC[Configure Silver Ratio σ]
                        GOLDEN --> |No| CHANNEL_INIT[Initialize Channel]
                        SILVER --> |No| CHANNEL_INIT
                        
                        GOLDEN_SYNC --> CHANNEL_INIT
                        SILVER_SYNC --> CHANNEL_INIT
                        
                        CHANNEL_INIT --> ENTANGLE[Create Quantum Entanglement]
                        ENTANGLE --> SYNC[Synchronize Eigenstates]
                        SYNC --> QUALITY[Measure Channel Quality]
                        
                        QUALITY --> STATUS{Channel Status}
                        STATUS --> |Initializing| QUALITY
                        STATUS --> |Syncing| STABILIZE[Stabilize Resonance]
                        STATUS --> |Stable| READY[Ready for Transmission]
                        STATUS --> |Degraded| REPAIR[Attempt Repair]
                        
                        STABILIZE --> READY
                        REPAIR --> |Success| READY
                        REPAIR --> |Failed| DEGRADED[Mark as Degraded]
                        
                        READY --> TRANSMIT[Message Transmission]
                        TRANSMIT --> MONITOR[Monitor Quality]
                        MONITOR --> READY
                        
                        DEGRADED --> CLOSE[Close Session]
                        CLOSE --> END([Session Complete])
                        ERROR --> END
                        
                        subgraph "Phase Synchronization"
                          GOLDEN_SYNC --> PHI[φ = 1.618...]
                          SILVER_SYNC --> SIGMA[σ = 2.414...]
                          PHI --> HARMONY[Phase Harmony]
                          SIGMA --> HARMONY
                        end
                        
                        classDef startEnd fill:#22c55e,stroke:#16a34a,stroke-width:3px,color:#fff
                        classDef process fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
                        classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                        classDef quantum fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                        classDef error fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
                        
                        class START,END startEnd
                        class PRIMES,PHASES,CHANNEL_INIT,STABILIZE,TRANSMIT,MONITOR,CLOSE process
                        class VALIDATE,GOLDEN,SILVER,STATUS decision
                        class ENTANGLE,SYNC,QUALITY,READY,GOLDEN_SYNC,SILVER_SYNC,PHI,SIGMA,HARMONY quantum
                        class ERROR,DEGRADED,REPAIR error
                    `}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Synchronization</CardTitle>
                    <CardDescription>Prime eigenstate synchronization process</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        sequenceDiagram
                          participant C as Client
                          participant NLC as NLC Engine
                          participant PE as Prime Eigenstates
                          participant PS as Phase Synchronizer
                          participant QM as Quality Monitor
                          
                          C->>NLC: Create session with primes
                          NLC->>PE: Initialize eigenstate basis
                          PE->>PS: Setup phase configuration
                          
                          alt Golden Phase Enabled
                            PS->>PS: Configure φ = 1.618...
                          end
                          
                          alt Silver Phase Enabled
                            PS->>PS: Configure σ = 2.414...
                          end
                          
                          PS->>PE: Apply phase synchronization
                          PE->>QM: Begin quality monitoring
                          
                          loop Channel Maintenance
                            QM->>QM: Measure channel fidelity
                            QM->>PS: Adjust phase alignment
                            PS->>PE: Update eigenstate coupling
                          end
                          
                          QM->>NLC: Channel stabilized
                          NLC->>C: Session ready for transmission
                          
                          Note over PS: Golden/Silver phases<br/>provide optimal stability
                          Note over QM: Real-time quality<br/>monitoring ensures reliability
                      `}
                      className="w-full"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Message Transmission</CardTitle>
                    <CardDescription>Quantum message encoding and transmission process</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        flowchart TB
                          MESSAGE[Input Message<br/>Text Content] --> ENCODE[Quantum State<br/>Encoding]
                          
                          ENCODE --> PRIME_MAP[Map to Prime<br/>Eigenstate Basis]
                          PRIME_MAP --> ENTANGLE[Apply Quantum<br/>Entanglement]
                          
                          ENTANGLE --> CHANNEL[Transmit through<br/>NLC Channel]
                          CHANNEL --> QUALITY_CHECK{Channel Quality<br/>Sufficient?}
                          
                          QUALITY_CHECK --> |High| INSTANT[Instantaneous<br/>Transmission]
                          QUALITY_CHECK --> |Low| BOOST[Boost Signal<br/>Strength]
                          
                          BOOST --> RETRY[Retry<br/>Transmission]
                          RETRY --> QUALITY_CHECK
                          
                          INSTANT --> DECODE[Quantum State<br/>Decoding]
                          DECODE --> VERIFY[Verify Message<br/>Integrity]
                          
                          VERIFY --> |Success| DELIVERED[Message<br/>Delivered]
                          VERIFY --> |Error| RETRANSMIT[Request<br/>Retransmission]
                          
                          RETRANSMIT --> CHANNEL
                          
                          subgraph "Non-Local Properties"
                            INSTANT --> NO_DELAY[Zero Propagation<br/>Delay]
                            INSTANT --> NO_DISTANCE[Distance<br/>Independent]
                            NO_DELAY --> QUANTUM_ADV[Quantum<br/>Advantage]
                            NO_DISTANCE --> QUANTUM_ADV
                          end
                          
                          classDef input fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
                          classDef process fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                          classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                          classDef quantum fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                          classDef result fill:#22c55e,stroke:#16a34a,stroke-width:2px,color:#fff
                          
                          class MESSAGE input
                          class ENCODE,PRIME_MAP,BOOST,RETRY,DECODE,VERIFY process
                          class QUALITY_CHECK decision
                          class ENTANGLE,CHANNEL,INSTANT,NO_DELAY,NO_DISTANCE,QUANTUM_ADV quantum
                          class DELIVERED result
                      `}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      POST /v1/nlc/sessions
                    </CardTitle>
                    <CardDescription>
                      Create a new non-local communication session with quantum channel setup
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Request Example</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm"><code>{`{
  "primes": [2, 3, 5, 7, 11],
  "phases": [0.0, 1.57, 3.14, 4.71, 6.28],
  "goldenPhase": true,
  "silverPhase": true
}`}</code></pre>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Response Format</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm"><code>{`{
  "id": "nlc_8k9j2m3n4p5q",
  "status": "syncing",
  "metrics": {
    "entropy": 0.23,
    "plateauDetected": false,
    "dominance": 0.45,
    "locality": 0.12,
    "resonanceStrength": 0.78
  }
}`}</code></pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      POST /v1/nlc/sessions/&#123;id&#125;/messages
                    </CardTitle>
                    <CardDescription>
                      Send a message through the established quantum communication channel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Request Example</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm"><code>{`{
  "content": "Hello through the quantum channel! This message travels instantaneously."
}`}</code></pre>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Response Format</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm"><code>{`{
  "content": "Hello through the quantum channel! This message travels instantaneously.",
  "stamp": "2024-01-15T10:30:45.123Z",
  "channelQuality": 0.94
}`}</code></pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      GET /v1/nlc/sessions/&#123;id&#125;
                    </CardTitle>
                    <CardDescription>
                      Get the current status and metrics of an NLC session
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Response Format</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm"><code>{`{
  "id": "nlc_8k9j2m3n4p5q",
  "status": "stable",
  "metrics": {
    "entropy": 0.12,
    "plateauDetected": true,
    "dominance": 0.89,
    "locality": 0.05,
    "resonanceStrength": 0.96
  }
}`}</code></pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Secure Quantum Channel</CardTitle>
                    <CardDescription>Establish ultra-secure communication channel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Configuration</h4>
                        <p className="text-sm text-gray-600 mb-2">Primes: [2, 3, 5, 7, 11, 13]</p>
                        <p className="text-sm text-gray-600 mb-2">Golden + Silver Phase: Enabled</p>
                        <p className="text-sm text-gray-600">Security: Quantum-grade</p>
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
                    <CardTitle>High-Speed Data Transfer</CardTitle>
                    <CardDescription>Optimize for maximum throughput and reliability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Configuration</h4>
                        <p className="text-sm text-gray-600 mb-2">Primes: [2, 3, 5] (minimal latency)</p>
                        <p className="text-sm text-gray-600 mb-2">Phase Optimization: Speed-focused</p>
                        <p className="text-sm text-gray-600">Throughput: Maximum</p>
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
                    <CardTitle>Quantum Internet</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Instantaneous global communication</li>
                      <li>• Quantum network infrastructure</li>
                      <li>• Ultra-secure data transmission</li>
                      <li>• Distributed quantum computing</li>
                      <li>• Quantum cloud services</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Systems</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• High-frequency trading</li>
                      <li>• Secure transaction processing</li>
                      <li>• Real-time settlement systems</li>
                      <li>• Quantum-safe banking</li>
                      <li>• Cross-border payments</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Scientific Research</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Real-time collaboration</li>
                      <li>• Quantum experiment coordination</li>
                      <li>• Large-scale data synchronization</li>
                      <li>• Remote quantum sensing</li>
                      <li>• Distributed computation</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Space Communications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Instantaneous deep space communication</li>
                      <li>• Satellite network coordination</li>
                      <li>• Mars-Earth real-time links</li>
                      <li>• Space mission control</li>
                      <li>• Interplanetary internet</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-green-50 to-teal-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready for Quantum Communication?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Break the barriers of distance and time with instantaneous quantum communication channels using prime eigenstate resonance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/playground?api=nlc">
                  Try NLC Playground
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/docs/nlc">View Full Documentation</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Interactive Visualization */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-green-500" />
                Interactive NLC Demonstration
              </CardTitle>
              <p className="text-sm text-gray-600">
                Experience real-time quantum communication channel synchronization, phase alignment with golden and silver ratios,
                and message transmission through non-local quantum entanglement.
              </p>
            </CardHeader>
            <CardContent>
              <NLCVisualization />
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default NLC;