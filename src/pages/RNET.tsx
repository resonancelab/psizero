import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Network, Zap, ArrowRight, Code, BarChart3, Radio, Globe, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import MermaidDiagram from "@/components/ui/mermaid-diagram";
import RNETVisualization from "@/components/visualizations/RNETVisualization";

const RNET = () => {
  return (
    <PageLayout>
      <Section>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-lg">
                <Network className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Resonance Network (RNET)</h1>
                <p className="text-xl text-gray-600">Real-time collaborative prime-basis resonance spaces with ultra-low latency synchronization</p>
              </div>
              <div className="ml-auto">
                <Badge className="bg-purple-100 text-purple-800">Core Infrastructure</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-indigo-50 rounded-lg">
                <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Multi-Client</div>
                <div className="text-sm text-gray-600">Collaborative Spaces</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">&lt;60ms</div>
                <div className="text-sm text-gray-600">Delta Fanout</div>
              </div>
              <div className="text-center p-6 bg-pink-50 rounded-lg">
                <Radio className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">5-20Hz</div>
                <div className="text-sm text-gray-600">Telemetry Rate</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">CRDT</div>
                <div className="text-sm text-gray-600">Consistency Model</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white mb-8">
              <h2 className="text-2xl font-bold mb-4">Foundational Infrastructure Service</h2>
              <p className="text-lg text-indigo-100 mb-6">
                RNET provides the collaborative backbone that powers all other APIs. Create shared resonance spaces where 
                multiple clients can co-create, synchronize, and evolve prime-basis quantum states in real-time.
              </p>
              <div className="flex gap-4">
                <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                  Try Live Demo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Code className="h-5 w-5 mr-2" />
                  View SDK
                </Button>
              </div>
            </div>
          </div>

          {/* Core Concepts */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Core Architecture</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Resonance Spaces</CardTitle>
                  <CardDescription>Shared quantum contexts for real-time collaboration</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Prime Basis:</strong> Agreed eigenstate foundation [p₁, p₂, ..., pₖ] with configurable ordering and truncation
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Phase Profiles:</strong> Golden/silver ratio synchronization with custom phase arrays and seeding rules
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Operator Sets:</strong> Resonance mixers, temperature controls, and semantic kernel configurations
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Entropy Fields:</strong> Damping parameters, plateau detection, and collapse threshold management
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Real-time Synchronization</CardTitle>
                  <CardDescription>Ultra-low latency collaborative updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <strong>CRDT Model:</strong> Conflict-free replicated data types with commutative operations and causal vectors
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Delta Compression:</strong> Minimal updates with MessagePack/CBOR binary encoding for bandwidth efficiency
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <strong>WebSocket/SSE:</strong> Bidirectional real-time communication with automatic reconnection and backoff
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Telemetry Stream:</strong> Live resonance strength, coherence, entropy, and dominance metrics
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Interactive Visualization */}
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-indigo-500" />
                  Live RNET Demonstration
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Experience real-time multi-client resonance space synchronization. Watch as multiple virtual clients 
                  collaborate to evolve shared prime-basis quantum states with live telemetry and phase updates.
                </p>
              </CardHeader>
              <CardContent>
                <RNETVisualization />
              </CardContent>
            </Card>
          </div>

          {/* System Architecture */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">System Architecture</h2>
            
            <Tabs defaultValue="workflow" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="workflow">Collaboration Workflow</TabsTrigger>
                <TabsTrigger value="protocol">Real-time Protocol</TabsTrigger>
                <TabsTrigger value="scaling">Horizontal Scaling</TabsTrigger>
              </TabsList>
              
              <TabsContent value="workflow" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Multi-Client Collaboration Flow</CardTitle>
                    <CardDescription>How clients join spaces and synchronize state</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        graph TB
                          START([Client Joins Space]) --> AUTH[Authenticate with API Key]
                          AUTH --> CREATE_SESSION[Create Session Token]
                          CREATE_SESSION --> WS_CONNECT[WebSocket Connection]
                          WS_CONNECT --> HELLO[Send Hello Frame]
                          HELLO --> WELCOME[Receive Welcome]
                          WELCOME --> SNAPSHOT[Get Current Snapshot]
                          SNAPSHOT --> SUBSCRIBE[Subscribe to Updates]
                          
                          SUBSCRIBE --> ACTIVE{Active Session}
                          ACTIVE --> |Receive| DELTA_IN[Incoming Deltas]
                          ACTIVE --> |Send| DELTA_OUT[Propose Deltas]
                          ACTIVE --> |Monitor| TELEMETRY[Live Telemetry]
                          
                          DELTA_IN --> APPLY[Apply to Local State]
                          DELTA_OUT --> VALIDATE[Server Validation]
                          VALIDATE --> |Success| FANOUT[Fanout to All Clients]
                          VALIDATE --> |Conflict| CONFLICT[Version Conflict]
                          CONFLICT --> REFETCH[Refetch Snapshot]
                          REFETCH --> ACTIVE
                          
                          FANOUT --> APPLY
                          TELEMETRY --> METRICS[Update Metrics Display]
                          METRICS --> ACTIVE
                          
                          APPLY --> RENDER[Render Visualization]
                          RENDER --> ACTIVE
                          
                          classDef startEnd fill:#22c55e,stroke:#16a34a,stroke-width:3px,color:#fff
                          classDef process fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                          classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                          classDef error fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
                          
                          class START startEnd
                          class AUTH,CREATE_SESSION,WS_CONNECT,HELLO,WELCOME,SNAPSHOT,SUBSCRIBE,APPLY,VALIDATE,FANOUT,REFETCH,RENDER process
                          class ACTIVE decision
                          class CONFLICT error
                      `}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="protocol" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>WebSocket Protocol Frames</CardTitle>
                    <CardDescription>Bidirectional communication between clients and server</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-green-600">Client → Server</h4>
                        <div className="space-y-3">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-mono text-sm">
                              <div className="text-green-600">// Connection handshake</div>
                              <div>{`{ "type": "hello", "version": 1, "sessionId": "..." }`}</div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-mono text-sm">
                              <div className="text-green-600">// Subscribe to updates</div>
                              <div>{`{ "type": "subscribe", "kinds": ["telemetry", "deltas"] }`}</div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-mono text-sm">
                              <div className="text-green-600">// Propose state change</div>
                              <div>{`{ "type": "propose_delta", "delta": { "fromVersion": 128, "ops": [...] } }`}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 text-blue-600">Server → Client</h4>
                        <div className="space-y-3">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-mono text-sm">
                              <div className="text-blue-600">// Welcome with state</div>
                              <div>{`{ "type": "welcome", "spaceId": "...", "epoch": 3, "version": 128 }`}</div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-mono text-sm">
                              <div className="text-blue-600">// State update</div>
                              <div>{`{ "type": "delta", "fromVersion": 128, "toVersion": 129, "ops": [...] }`}</div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-mono text-sm">
                              <div className="text-blue-600">// Live metrics</div>
                              <div>{`{ "type": "telemetry", "resonanceStrength": 0.83, "coherence": 0.77 }`}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="scaling" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Horizontal Scaling Architecture</CardTitle>
                    <CardDescription>Multi-region deployment with edge optimization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        graph TB
                          subgraph "Edge Regions"
                            EDGE1[Edge Node US-West]
                            EDGE2[Edge Node US-East] 
                            EDGE3[Edge Node EU-West]
                          end
                          
                          subgraph "Core Infrastructure"
                            LB[Load Balancer]
                            API1[API Node 1]
                            API2[API Node 2]
                            API3[API Node 3]
                            
                            REDIS[(Redis Cluster)]
                            NATS[(NATS Streaming)]
                            POSTGRES[(Aurora PostgreSQL)]
                            CLICKHOUSE[(ClickHouse)]
                          end
                          
                          CLIENT1[Client A] --> EDGE1
                          CLIENT2[Client B] --> EDGE2
                          CLIENT3[Client C] --> EDGE3
                          
                          EDGE1 --> LB
                          EDGE2 --> LB
                          EDGE3 --> LB
                          
                          LB --> API1
                          LB --> API2
                          LB --> API3
                          
                          API1 --> REDIS
                          API2 --> REDIS
                          API3 --> REDIS
                          
                          API1 --> NATS
                          API2 --> NATS
                          API3 --> NATS
                          
                          API1 --> POSTGRES
                          API2 --> POSTGRES
                          API3 --> POSTGRES
                          
                          NATS --> CLICKHOUSE
                          
                          classDef client fill:#22c55e,stroke:#16a34a,stroke-width:2px,color:#fff
                          classDef edge fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                          classDef api fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                          classDef storage fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                          
                          class CLIENT1,CLIENT2,CLIENT3 client
                          class EDGE1,EDGE2,EDGE3 edge
                          class LB,API1,API2,API3 api
                          class REDIS,NATS,POSTGRES,CLICKHOUSE storage
                      `}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* API Integration Examples */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Integration with Other APIs</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Collaborative SRS Solving</CardTitle>
                  <CardDescription>Multiple agents working on NP-complete problems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-mono text-sm">
                        <div className="text-blue-600 mb-2">// Create collaborative SRS space</div>
                        <pre>{`const space = await rnet.spaces.create({
  name: "optimization-room",
  basis: { primes: [2,3,5,7,11,13,17,19] },
  operators: { resonanceTarget: 0.9 },
  entropy: { collapseThreshold: 0.95 }
});

// Multiple SRS instances sync progress
await srs.solve({
  problem: complexOptimization,
  resonanceSpace: space.id,
  collaborative: true
});`}</pre>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Agents share entropy particle states and coordinate plateau escapes through the resonance space.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Synchronized QSEM Analysis</CardTitle>
                  <CardDescription>Shared semantic understanding across contexts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="font-mono text-sm">
                        <div className="text-green-600 mb-2">// Collaborative semantic space</div>
                        <pre>{`const semanticSpace = await rnet.spaces.create({
  name: "concept-alignment",
  basis: { primes: [2,3,5,7,11], order: "learned" },
  phases: { golden: true, silver: true }
});

// QSEM instances share concept mappings
await qsem.analyze({
  text: documents,
  sharedContext: semanticSpace.id,
  syncConceptVectors: true
});`}</pre>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Multiple QSEM instances build shared concept networks with synchronized prime basis vectors.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distributed QCR Networks</CardTitle>
                  <CardDescription>Multi-node consciousness simulation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="font-mono text-sm">
                        <div className="text-purple-600 mb-2">// Consciousness collective</div>
                        <pre>{`const mindSpace = await rnet.spaces.create({
  name: "collective-consciousness",
  basis: { primes: [2,3,5,7,11,13,17] },
  operators: { 
    resonanceTarget: 0.85,
    semantic: { enabled: true, kernel: "triadic" }
  }
});

// QCR nodes form distributed consciousness
await qcr.resonate({
  pattern: "group-awareness",
  collective: mindSpace.id,
  triadicSync: true
});`}</pre>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      QCR instances synchronize triadic resonance patterns to simulate collective consciousness phenomena.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Unified Physics Collaboration</CardTitle>
                  <CardDescription>Distributed observer-entropy computation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <div className="font-mono text-sm">
                        <div className="text-cyan-600 mb-2">// Physics simulation cluster</div>
                        <pre>{`const physicsSpace = await rnet.spaces.create({
  name: "emergent-gravity",
  basis: { primes: [2,3,5,7,11,13,17,19,23] },
  entropy: { lambda: 0.01, collapseThreshold: 0.98 }
});

// Distributed gravity computation
await unified.compute({
  spacetimeRegion: "local_cluster",
  observerNetwork: physicsSpace.id,
  distributedCompute: true
});`}</pre>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Multiple Unified Physics instances collaborate to compute emergent gravity across distributed observers.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Performance & Scaling */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Performance Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Space Create/Join:</span>
                      <span className="font-mono text-sm">&lt;120ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Delta Fanout:</span>
                      <span className="font-mono text-sm">&lt;60ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">WebSocket RTT:</span>
                      <span className="font-mono text-sm">&lt;30ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Throughput
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Telemetry Rate:</span>
                      <span className="font-mono text-sm">5-20Hz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Concurrent Clients:</span>
                      <span className="font-mono text-sm">128/space</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Delta Rate:</span>
                      <span className="font-mono text-sm">1K/sec</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Network className="h-5 w-5 text-purple-600" />
                    Consistency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Model:</span>
                      <span className="font-mono text-sm">CRDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ordering:</span>
                      <span className="font-mono text-sm">Causal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Conflicts:</span>
                      <span className="font-mono text-sm">Commutative</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-indigo-600" />
                    Scaling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Edge Regions:</span>
                      <span className="font-mono text-sm">Global</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">API Nodes:</span>
                      <span className="font-mono text-sm">Stateless</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Storage:</span>
                      <span className="font-mono text-sm">Distributed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Getting Started */}
          <div className="mb-12">
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-2xl">Get Started with RNET</CardTitle>
                <CardDescription>
                  Ready to build collaborative applications with real-time quantum synchronization?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">1. Install SDK</h4>
                      <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                        npm i @psizero/resonance-spaces
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">2. Create Space</h4>
                      <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                        const space = await rnet.spaces.create(config)
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">3. Real-time Sync</h4>
                      <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                        await session.proposeDelta(delta)
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button asChild>
                    <Link to="/docs/rnet">
                      <Code className="h-4 w-4 mr-2" />
                      Documentation
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/playground">
                      Try in Playground
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default RNET;