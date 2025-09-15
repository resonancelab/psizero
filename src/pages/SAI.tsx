import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Cpu, Database, ArrowRight, Code, BarChart3, Settings, Users, Zap, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import MermaidDiagram from "@/components/ui/mermaid-diagram";
import SAIVisualization from "@/components/visualizations/SAIVisualization";

const SAI = () => {
  return (
    <PageLayout>
      <Section>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Symbolic AI (SAI)</h1>
                <p className="text-xl text-gray-600">Multi-tenant symbolic AI service with prime-based pattern learning and training</p>
              </div>
              <div className="ml-auto">
                <Badge className="bg-emerald-100 text-emerald-800">Production Ready</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-emerald-50 rounded-lg">
                <Brain className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Symbolic</div>
                <div className="text-sm text-gray-600">AI Engine</div>
              </div>
              <div className="text-center p-6 bg-teal-50 rounded-lg">
                <Users className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Multi-Tenant</div>
                <div className="text-sm text-gray-600">User Isolation</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">&lt;200ms</div>
                <div className="text-sm text-gray-600">Processing Time</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Database className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Prime-Based</div>
                <div className="text-sm text-gray-600">Symbol Mapping</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-8 text-white mb-8">
              <h2 className="text-2xl font-bold mb-4">Enterprise Symbolic AI Platform</h2>
              <p className="text-lg text-emerald-100 mb-6">
                Build and train custom symbolic AI models with prime-based cryptographic signatures, entropy-driven learning, 
                and comprehensive multi-tenant architecture. Transform text into symbolic representations with advanced pattern recognition.
              </p>
              <div className="flex gap-4">
                <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                  Try Interactive Demo
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Code className="h-5 w-5 mr-2" />
                  API Documentation
                </Button>
              </div>
            </div>
          </div>

          {/* Core Features */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Core Capabilities</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Symbolic Engine Architecture</CardTitle>
                  <CardDescription>Advanced text-to-symbol conversion with prime signatures</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Unicode Mapping:</strong> Convert text to symbolic representations with comprehensive Unicode support
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Prime Signatures:</strong> Cryptographic pattern signatures using prime number assignments
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Entropy Dynamics:</strong> Temperature-based learning with adaptive entropy calculations
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Context Memory:</strong> Relationship learning with contextual pattern recognition
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Multi-Tenant Infrastructure</CardTitle>
                  <CardDescription>Enterprise-grade isolation and resource management</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <strong>User Isolation:</strong> Complete data separation with per-user directory structures
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Engine Pooling:</strong> Efficient resource management with LRU eviction policies
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <strong>API Key Auth:</strong> Secure authentication with JWT session management
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <strong>Rate Limiting:</strong> Per-user quotas with usage monitoring and enforcement
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
                  <Brain className="h-5 w-5 text-emerald-500" />
                  Interactive SAI Demonstration
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Experience symbolic AI engine training in real-time. Watch symbol mappings evolve, training metrics improve, 
                  and prime-based pattern signatures emerge through interactive symbolic learning.
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-600">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Interactive SAI visualization coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Architecture */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">System Architecture</h2>
            
            <Tabs defaultValue="architecture" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="architecture">Multi-Tenant Architecture</TabsTrigger>
                <TabsTrigger value="workflow">Training Workflow</TabsTrigger>
                <TabsTrigger value="api">API Structure</TabsTrigger>
              </TabsList>
              
              <TabsContent value="architecture" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Multi-Tenant SAI Architecture</CardTitle>
                    <CardDescription>Enterprise-grade symbolic AI infrastructure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        graph TB
                          CLIENT[API Clients] --> LB[Load Balancer]
                          LB --> API[REST API Server]
                          
                          API --> AUTH[Authentication Layer]
                          API --> ENGINE[Engine Manager]
                          API --> STORAGE[Multi-tenant Storage]
                          API --> WS[WebSocket Server]
                          
                          AUTH --> JWT[JWT Tokens]
                          AUTH --> KEYS[API Key Validation]
                          AUTH --> RATE[Rate Limiting]
                          
                          ENGINE --> FACTORY[Engine Factory]
                          ENGINE --> POOL[Engine Pool]
                          ENGINE --> CACHE[Engine Cache]
                          
                          FACTORY --> SE[Symbolic Engine]
                          FACTORY --> TRAINER[Trainer Instance]
                          FACTORY --> DM[Data Manager]
                          
                          STORAGE --> USERDATA[User Data Isolation]
                          STORAGE --> FILESYSTEM[File-based Storage]
                          STORAGE --> BACKUP[State Backup]
                          
                          SE --> SYMBOLS[Symbol Mappings]
                          SE --> PRIMES[Prime System]
                          SE --> MEMORY[Learning Memory]
                          
                          WS --> PROGRESS[Training Progress]
                          WS --> REALTIME[Real-time Updates]
                          
                          classDef client fill:#22c55e,stroke:#16a34a,stroke-width:2px,color:#fff
                          classDef api fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                          classDef auth fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                          classDef engine fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
                          classDef storage fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                          
                          class CLIENT client
                          class LB,API api
                          class AUTH,JWT,KEYS,RATE auth
                          class ENGINE,FACTORY,POOL,CACHE,SE,TRAINER,DM,SYMBOLS,PRIMES,MEMORY engine
                          class STORAGE,USERDATA,FILESYSTEM,BACKUP storage
                          class WS,PROGRESS,REALTIME api
                      `}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="workflow" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Symbolic AI Training Workflow</CardTitle>
                    <CardDescription>End-to-end training process with real-time monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        graph TB
                          START([Create Engine]) --> CONFIGURE[Configure Parameters]
                          CONFIGURE --> UPLOAD[Upload Training Data]
                          UPLOAD --> VALIDATE[Validate Dataset]
                          VALIDATE --> INIT[Initialize Symbolic Mappings]
                          
                          INIT --> TRAIN_START[Start Training Session]
                          TRAIN_START --> PROCESS[Process Text Samples]
                          PROCESS --> EXTRACT[Extract Symbol Patterns]
                          EXTRACT --> PRIME[Generate Prime Signatures]
                          
                          PRIME --> LEARN[Update Learning Memory]
                          LEARN --> ENTROPY[Calculate Entropy Dynamics]
                          ENTROPY --> TEMP[Adjust Temperature]
                          TEMP --> PROGRESS{Training Progress}
                          
                          PROGRESS --> |Continue| PROCESS
                          PROGRESS --> |Converged| EVALUATE[Evaluate Performance]
                          PROGRESS --> |Max Iterations| EVALUATE
                          
                          EVALUATE --> METRICS[Generate Metrics]
                          METRICS --> SAVE[Save Engine State]
                          SAVE --> DEPLOY[Deploy for Inference]
                          DEPLOY --> END([Ready for Use])
                          
                          subgraph "Real-time Monitoring"
                            WS_UPDATE[WebSocket Updates]
                            LIVE_METRICS[Live Metrics]
                            STATUS_BROADCAST[Status Broadcast]
                          end
                          
                          TRAIN_START --> WS_UPDATE
                          PROGRESS --> LIVE_METRICS
                          EVALUATE --> STATUS_BROADCAST
                          
                          classDef start fill:#22c55e,stroke:#16a34a,stroke-width:3px,color:#fff
                          classDef process fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                          classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                          classDef monitoring fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                          
                          class START,END start
                          class CONFIGURE,UPLOAD,VALIDATE,INIT,TRAIN_START,PROCESS,EXTRACT,PRIME,LEARN,ENTROPY,TEMP,EVALUATE,METRICS,SAVE,DEPLOY process
                          class PROGRESS decision
                          class WS_UPDATE,LIVE_METRICS,STATUS_BROADCAST monitoring
                      `}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="api" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SAI API Structure</CardTitle>
                    <CardDescription>Comprehensive REST API endpoints for symbolic AI operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-emerald-600">Engine Management</h4>
                        <div className="space-y-2 text-sm">
                          <div className="bg-gray-50 p-2 rounded font-mono">POST /api/engines</div>
                          <div className="bg-gray-50 p-2 rounded font-mono">GET /api/engines</div>
                          <div className="bg-gray-50 p-2 rounded font-mono">GET /api/engines/&#123;id&#125;</div>
                          <div className="bg-gray-50 p-2 rounded font-mono">PUT /api/engines/&#123;id&#125;</div>
                          <div className="bg-gray-50 p-2 rounded font-mono">DELETE /api/engines/&#123;id&#125;</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 text-teal-600">Text Processing</h4>
                        <div className="space-y-2 text-sm">
                          <div className="bg-gray-50 p-2 rounded font-mono">POST /api/engines/&#123;id&#125;/process</div>
                          <div className="bg-gray-50 p-2 rounded font-mono">POST /api/engines/&#123;id&#125;/batch-process</div>
                          <div className="bg-gray-50 p-2 rounded font-mono">GET /api/engines/&#123;id&#125;/symbols</div>
                          <div className="bg-gray-50 p-2 rounded font-mono">POST /api/engines/&#123;id&#125;/symbols</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 text-blue-600">Training Operations</h4>
                        <div className="space-y-2 text-sm">
                          <div className="bg-gray-50 p-2 rounded font-mono">POST /api/engines/&#123;id&#125;/training/start</div>
                          <div className="bg-gray-50 p-2 rounded font-mono">GET /api/engines/&#123;id&#125;/training/status</div>
                          <div className="bg-gray-50 p-2 rounded font-mono">POST /api/engines/&#123;id&#125;/training/stop</div>
                          <div className="bg-gray-50 p-2 rounded font-mono">GET /api/engines/&#123;id&#125;/training/history</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 text-purple-600">Authentication & Data</h4>
                        <div className="space-y-2 text-sm">
                          <div className="bg-gray-50 p-2 rounded font-mono">POST /api/auth/register</div>
                          <div className="bg-gray-50 p-2 rounded font-mono">POST /api/auth/login</div>
                          <div className="bg-gray-50 p-2 rounded font-mono">GET /api/engines/&#123;id&#125;/training-data</div>
                          <div className="bg-gray-50 p-2 rounded font-mono">POST /api/engines/&#123;id&#125;/training-data</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Integration Examples */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">RNET Integration & Collaboration</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Collaborative Training</CardTitle>
                  <CardDescription>Multi-user symbolic learning with RNET synchronization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="font-mono text-sm">
                        <div className="text-emerald-600 mb-2">// Create collaborative SAI space</div>
                        <pre>{`const rnetSpace = await rnet.spaces.create({
  name: "symbolic-ai-training",
  basis: { primes: [2,3,5,7,11,13,17,19] },
  operators: { resonanceTarget: 0.9 }
});

// SAI engines sync training progress  
const engine = await sai.engines.create({
  name: "collaborative-model",
  collaborativeSpace: rnetSpace.id,
  sharedTraining: true
});

await engine.training.start({
  dataset: trainingData,
  syncProgress: true,
  shareSymbolMappings: true
});`}</pre>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Multiple SAI engines collaborate through RNET spaces, sharing symbol mappings and training progress in real-time.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distributed Symbol Learning</CardTitle>
                  <CardDescription>Shared prime signatures across collaborative engines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="font-mono text-sm">
                        <div className="text-teal-600 mb-2">// Distributed prime signature learning</div>
                        <pre>{`const symbolSpace = await rnet.spaces.create({
  name: "shared-symbols",
  basis: { primes: [2,3,5,7,11,13], order: "learned" },
  entropy: { collapseThreshold: 0.95 }
});

// SAI engines contribute to shared symbol evolution
await sai.engines.process({
  text: documents,
  symbolSpace: symbolSpace.id,
  contributeSignatures: true,
  learnFromPeers: true
});`}</pre>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      SAI engines contribute prime signatures to shared RNET spaces, enabling collective symbol evolution and pattern learning.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Performance & Features */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Performance & Enterprise Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-emerald-600" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Text Processing:</span>
                      <span className="font-mono text-sm">&lt;200ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Concurrent Users:</span>
                      <span className="font-mono text-sm">100+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Uptime SLA:</span>
                      <span className="font-mono text-sm">99.9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-teal-600" />
                    Multi-Tenancy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">User Isolation:</span>
                      <span className="font-mono text-sm">Complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Data Separation:</span>
                      <span className="font-mono text-sm">Directory</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Resource Pooling:</span>
                      <span className="font-mono text-sm">LRU</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    Customization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Symbol Mappings:</span>
                      <span className="font-mono text-sm">Custom</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Prime Config:</span>
                      <span className="font-mono text-sm">Flexible</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Training Params:</span>
                      <span className="font-mono text-sm">Full Control</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Training Metrics:</span>
                      <span className="font-mono text-sm">Real-time</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Usage Analytics:</span>
                      <span className="font-mono text-sm">Detailed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Performance:</span>
                      <span className="font-mono text-sm">Live Stats</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Getting Started */}
          <div className="mb-12">
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-2xl">Get Started with SAI</CardTitle>
                <CardDescription>
                  Ready to build and train custom symbolic AI models with enterprise-grade infrastructure?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">1. Register Account</h4>
                      <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                        POST /api/auth/register
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">2. Create Engine</h4>
                      <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                        POST /api/engines
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">3. Start Training</h4>
                      <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                        POST /api/engines/&#123;id&#125;/training/start
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button asChild>
                    <Link to="/docs/sai">
                      <FileText className="h-4 w-4 mr-2" />
                      API Documentation
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

export default SAI;