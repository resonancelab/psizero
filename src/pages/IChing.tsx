import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hexagon, Zap, Target, ArrowRight, Code, BarChart3, Compass, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import MermaidDiagram from "@/components/ui/mermaid-diagram";

const IChing = () => {
  return (
    <PageLayout>
      <Section>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-lg">
                <Hexagon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">I-Ching Oracle</h1>
                <p className="text-xl text-gray-600">Ancient wisdom meets quantum entropy dynamics for modern divination</p>
              </div>
              <Badge className="bg-green-100 text-green-800 ml-auto">Stable</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <Hexagon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">64</div>
                <div className="text-sm text-gray-600">Hexagram States</div>
              </div>
              <div className="text-center p-6 bg-red-50 rounded-lg">
                <Waves className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Dynamic</div>
                <div className="text-sm text-gray-600">Entropy Evolution</div>
              </div>
              <div className="text-center p-6 bg-amber-50 rounded-lg">
                <Compass className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Quantum</div>
                <div className="text-sm text-gray-600">Attractor Dynamics</div>
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
                  <CardTitle>How Quantum I-Ching Works</CardTitle>
                  <CardDescription>
                    The I-Ching Oracle combines 3000+ years of ancient wisdom with cutting-edge entropy dynamics to provide guidance through hexagram evolution sequences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Core Capabilities</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center"><Hexagon className="h-4 w-4 text-orange-500 mr-2" />64 hexagram state system</li>
                        <li className="flex items-center"><Waves className="h-4 w-4 text-orange-500 mr-2" />Entropy-driven evolution</li>
                        <li className="flex items-center"><Compass className="h-4 w-4 text-orange-500 mr-2" />Attractor landscape navigation</li>
                        <li className="flex items-center"><BarChart3 className="h-4 w-4 text-orange-500 mr-2" />Stabilization detection</li>
                        <li className="flex items-center"><Zap className="h-4 w-4 text-orange-500 mr-2" />Real-time guidance generation</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Evolution Process</h3>
                      <div className="text-sm space-y-2">
                        <p><strong>1. Question Input:</strong> Submit your inquiry to the oracle</p>
                        <p><strong>2. Initial Hexagram:</strong> Generate starting hexagram from question entropy</p>
                        <p><strong>3. Evolution Steps:</strong> Allow hexagram to evolve through entropy dynamics</p>
                        <p><strong>4. Attractor Seeking:</strong> System seeks stable attractor states</p>
                        <p><strong>5. Wisdom Extraction:</strong> Interpret final stabilized pattern</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quantum Divination Theory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm mb-2"><strong>Hexagram State Representation:</strong></p>
                    <p className="font-mono text-sm">|H⟩ = |b₅b₄b₃b₂b₁b₀⟩ where bᵢ ∈ &#123;0,1&#125;</p>
                    <p className="text-xs text-gray-600 mt-2">6-bit binary representation of 64 possible hexagram states</p>
                    
                    <p className="text-sm mt-4 mb-2"><strong>Entropy Evolution Dynamics:</strong></p>
                    <p className="font-mono text-sm">H(t+1) = f(H(t), S(t), A(t))</p>
                    <p className="text-xs text-gray-600 mt-2">Next hexagram depends on current state, entropy S(t), and attractor proximity A(t)</p>
                    
                    <p className="text-sm mt-4 mb-2"><strong>Stabilization Condition:</strong></p>
                    <p className="font-mono text-sm">|∇S| &lt; ε and A(t) &gt; threshold</p>
                    <p className="text-xs text-gray-600 mt-2">System stabilizes when entropy gradient is minimal and attractor proximity is high</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>I-Ching Evolution Workflow</CardTitle>
                  <CardDescription>
                    Complete process for hexagram evolution from question input to wisdom extraction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram
                    chart={`
                      graph TD
                        START([Submit Question]) --> PARSE{Parse Question}
                        PARSE --> |Valid| ENTROPY[Calculate Question Entropy]
                        PARSE --> |Invalid| ERROR[Return Error]
                        
                        ENTROPY --> INITIAL[Generate Initial Hexagram]
                        INITIAL --> SETUP[Setup Evolution Parameters]
                        SETUP --> STEPS[Configure Evolution Steps]
                        
                        STEPS --> EVOLUTION{Begin Evolution Loop}
                        EVOLUTION --> CURRENT[Current Hexagram State]
                        CURRENT --> ENTROPY_CALC[Calculate System Entropy]
                        ENTROPY_CALC --> ATTRACTOR[Measure Attractor Proximity]
                        
                        ATTRACTOR --> TRANSFORM[Apply Transformation Rules]
                        TRANSFORM --> NEXT[Generate Next Hexagram]
                        NEXT --> RECORD[Record Evolution Step]
                        
                        RECORD --> CHECK{Check Convergence}
                        CHECK --> |Continue| EVOLUTION
                        CHECK --> |Stabilized| STABLE[System Stabilized]
                        CHECK --> |Max Steps| TIMEOUT[Evolution Complete]
                        
                        STABLE --> INTERPRET[Interpret Final Pattern]
                        TIMEOUT --> INTERPRET
                        INTERPRET --> WISDOM[Extract Wisdom]
                        WISDOM --> GUIDANCE[Generate Guidance]
                        
                        GUIDANCE --> RESPONSE[Return Oracle Response]
                        RESPONSE --> END([Complete])
                        ERROR --> END
                        
                        subgraph "Hexagram Transformation"
                          TRANSFORM --> YIN[Yin Line Analysis]
                          TRANSFORM --> YANG[Yang Line Analysis]
                          YIN --> BALANCE[Seek Balance]
                          YANG --> BALANCE
                          BALANCE --> HARMONY[Attain Harmony]
                        end
                        
                        subgraph "Attractor Landscape"
                          ATTRACTOR --> HEAVEN[Heaven Attractor]
                          ATTRACTOR --> EARTH[Earth Attractor]
                          ATTRACTOR --> HUMAN[Human Attractor]
                          HEAVEN --> COSMIC[Cosmic Principles]
                          EARTH --> NATURAL[Natural Laws]
                          HUMAN --> WISDOM_PATH[Wisdom Path]
                        end
                        
                        classDef startEnd fill:#22c55e,stroke:#16a34a,stroke-width:3px,color:#fff
                        classDef process fill:#f97316,stroke:#ea580c,stroke-width:2px,color:#fff
                        classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                        classDef hexagram fill:#dc2626,stroke:#b91c1c,stroke-width:2px,color:#fff
                        classDef wisdom fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                        classDef error fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
                        
                        class START,END startEnd
                        class ENTROPY,INITIAL,SETUP,STEPS,CURRENT,ENTROPY_CALC,RECORD,INTERPRET,GUIDANCE,RESPONSE process
                        class PARSE,EVOLUTION,CHECK decision
                        class ATTRACTOR,TRANSFORM,NEXT,STABLE,TIMEOUT,YIN,YANG,BALANCE,HARMONY,HEAVEN,EARTH,HUMAN hexagram
                        class WISDOM,COSMIC,NATURAL,WISDOM_PATH wisdom
                        class ERROR error
                    `}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hexagram Evolution Sequence</CardTitle>
                    <CardDescription>How hexagrams transform through entropy dynamics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        sequenceDiagram
                          participant Q as Question
                          participant IChing as I-Ching Engine
                          participant HG as Hexagram Generator
                          participant ED as Entropy Dynamics
                          participant AL as Attractor Landscape
                          participant WE as Wisdom Extractor
                          
                          Q->>IChing: Submit question for guidance
                          IChing->>HG: Generate initial hexagram from question
                          HG->>ED: Begin entropy-driven evolution
                          
                          loop Evolution Steps
                            ED->>ED: Calculate current entropy
                            ED->>AL: Measure attractor proximity
                            AL->>ED: Return landscape forces
                            ED->>HG: Transform hexagram state
                            HG->>IChing: Record evolution step
                          end
                          
                          alt System Stabilized
                            AL->>IChing: Attractor reached
                            IChing->>WE: Extract wisdom from pattern
                          else Maximum Steps
                            IChing->>WE: Extract wisdom from final state
                          end
                          
                          WE->>Q: Return guidance and interpretation
                          
                          Note over ED: Entropy dynamics guide<br/>natural hexagram evolution
                          Note over AL: Attractor landscape provides<br/>stable wisdom states
                      `}
                      className="w-full"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attractor Landscape Navigation</CardTitle>
                    <CardDescription>How the system finds stable wisdom states</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        flowchart TB
                          CURRENT[Current Hexagram<br/>State] --> FORCES[Calculate<br/>Landscape Forces]
                          
                          FORCES --> HEAVEN{Heaven<br/>Attractor}
                          FORCES --> EARTH{Earth<br/>Attractor}
                          FORCES --> HUMAN{Human<br/>Attractor}
                          
                          HEAVEN --> |Strong| COSMIC[Cosmic Wisdom<br/>Principles]
                          EARTH --> |Strong| NATURAL[Natural Law<br/>Guidance]
                          HUMAN --> |Strong| PRACTICAL[Practical Life<br/>Wisdom]
                          
                          HEAVEN --> |Weak| GRADIENT[Follow<br/>Gradient]
                          EARTH --> |Weak| GRADIENT
                          HUMAN --> |Weak| GRADIENT
                          
                          GRADIENT --> TRANSFORM[Transform<br/>Hexagram]
                          TRANSFORM --> MEASURE[Measure New<br/>Proximity]
                          
                          MEASURE --> CONVERGED{Converged to<br/>Attractor?}
                          
                          CONVERGED --> |Yes| STABLE[Stable Wisdom<br/>State Reached]
                          CONVERGED --> |No| CURRENT
                          
                          COSMIC --> STABLE
                          NATURAL --> STABLE
                          PRACTICAL --> STABLE
                          
                          STABLE --> WISDOM[Extract<br/>Final Wisdom]
                          
                          subgraph "64 Hexagram Space"
                            TRANSFORM --> H1[☰ Qian - Heaven]
                            TRANSFORM --> H2[☷ Kun - Earth]
                            TRANSFORM --> H3[☵ Kan - Water]
                            TRANSFORM --> H64[... 64 States]
                          end
                          
                          classDef current fill:#f97316,stroke:#ea580c,stroke-width:2px,color:#fff
                          classDef process fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                          classDef attractor fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
                          classDef wisdom fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                          classDef hexagram fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                          
                          class CURRENT current
                          class FORCES,GRADIENT,TRANSFORM,MEASURE process
                          class HEAVEN,EARTH,HUMAN,CONVERGED attractor
                          class COSMIC,NATURAL,PRACTICAL,STABLE,WISDOM wisdom
                          class H1,H2,H3,H64 hexagram
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
                    POST /v1/iching/evolve
                  </CardTitle>
                  <CardDescription>
                    Submit a question to the I-Ching oracle and receive guidance through hexagram evolution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Request Parameters</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm"><code>{`{
  "question": "What direction should I take in my career?",
  "steps": 7
}`}</code></pre>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Response Format</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm"><code>{`{
  "sequence": [
    {
      "step": 0,
      "hexagram": "101010",
      "entropy": 1.35,
      "attractorProximity": 0.12
    },
    {
      "step": 1,
      "hexagram": "101011",
      "entropy": 1.28,
      "attractorProximity": 0.18
    },
    {
      "step": 7,
      "hexagram": "111000",
      "entropy": 0.45,
      "attractorProximity": 0.89
    }
  ],
  "stabilized": true,
  "interpretation": {
    "finalHexagram": "Heaven over Mountain",
    "meaning": "Gradual progress and patient cultivation lead to lasting success",
    "guidance": "Focus on steady development of your skills rather than seeking immediate advancement",
    "timeframe": "3-6 months for significant progress"
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
                    <CardTitle>Career Guidance</CardTitle>
                    <CardDescription>Seek direction for professional development</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Sample Question</h4>
                        <p className="text-sm text-gray-600 mb-2">"Should I change careers or develop in my current field?"</p>
                        <p className="text-sm text-green-600">Expected: Clear guidance on professional path</p>
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
                    <CardTitle>Relationship Wisdom</CardTitle>
                    <CardDescription>Navigate personal relationships and connections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Sample Question</h4>
                        <p className="text-sm text-gray-600 mb-2">"How can I improve communication in my relationship?"</p>
                        <p className="text-sm text-green-600">Expected: Wisdom on harmony and understanding</p>
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
                    <CardTitle>Business Strategy</CardTitle>
                    <CardDescription>Strategic decision-making for business ventures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Sample Question</h4>
                        <p className="text-sm text-gray-600 mb-2">"Is this the right time to launch my startup?"</p>
                        <p className="text-sm text-green-600">Expected: Timing and strategic guidance</p>
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
                    <CardTitle>Personal Growth</CardTitle>
                    <CardDescription>Inner development and spiritual progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Sample Question</h4>
                        <p className="text-sm text-gray-600 mb-2">"What aspect of myself should I focus on developing?"</p>
                        <p className="text-sm text-green-600">Expected: Personal development insights</p>
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
                    <CardTitle>Decision Support Systems</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Strategic business planning</li>
                      <li>• Investment timing analysis</li>
                      <li>• Product development guidance</li>
                      <li>• Market entry decisions</li>
                      <li>• Risk assessment frameworks</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Personal Development</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Life coaching applications</li>
                      <li>• Career transition guidance</li>
                      <li>• Relationship counseling</li>
                      <li>• Personal growth planning</li>
                      <li>• Mindfulness practices</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Creative Industries</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Story development guidance</li>
                      <li>• Artistic inspiration systems</li>
                      <li>• Game design decisions</li>
                      <li>• Creative project planning</li>
                      <li>• Innovation workshops</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Wellness & Therapy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Therapeutic guidance tools</li>
                      <li>• Stress management systems</li>
                      <li>• Mental health support</li>
                      <li>• Meditation enhancement</li>
                      <li>• Holistic wellness planning</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready for Ancient Wisdom?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover timeless guidance through quantum-enhanced I-Ching oracle, where 3000 years of wisdom meets cutting-edge entropy dynamics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/playground?api=iching">
                  Try I-Ching Playground
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/docs/iching">View Full Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default IChing;