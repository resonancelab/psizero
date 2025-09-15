import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Brain, Network, ArrowRight, Code, Target, Atom } from "lucide-react";
import { Link } from "react-router-dom";
import MermaidDiagram from "@/components/ui/mermaid-diagram";

const QSEM = () => {
  return (
    <PageLayout>
      <Section>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Quantum Semantics (QSEM)</h1>
                <p className="text-xl text-gray-600">Encode concepts into prime-basis quantum vectors for semantic resonance analysis</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 ml-auto">Beta</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">∞</div>
                <div className="text-sm text-gray-600">Concepts Encodable</div>
              </div>
              <div className="text-center p-6 bg-pink-50 rounded-lg">
                <Network className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Prime</div>
                <div className="text-sm text-gray-600">Basis Vectors</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Quantum</div>
                <div className="text-sm text-gray-600">Semantic Space</div>
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
                  <CardTitle>How Quantum Semantics Works</CardTitle>
                  <CardDescription>
                    QSEM transforms natural language concepts into quantum vectors using prime number eigenstates, enabling unprecedented semantic analysis through resonance physics.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Core Capabilities</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center"><Sparkles className="h-4 w-4 text-purple-500 mr-2" />Concept encoding to quantum vectors</li>
                        <li className="flex items-center"><Network className="h-4 w-4 text-purple-500 mr-2" />Semantic resonance computation</li>
                        <li className="flex items-center"><Brain className="h-4 w-4 text-purple-500 mr-2" />Coherence analysis between concepts</li>
                        <li className="flex items-center"><Target className="h-4 w-4 text-purple-500 mr-2" />Relationship strength measurement</li>
                        <li className="flex items-center"><Atom className="h-4 w-4 text-purple-500 mr-2" />Prime basis vector decomposition</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Encoding Process</h3>
                      <div className="text-sm space-y-2">
                        <p><strong>1. Concept Input:</strong> Natural language concepts or terms</p>
                        <p><strong>2. Prime Mapping:</strong> Transform to prime number eigenstate space</p>
                        <p><strong>3. Amplitude Assignment:</strong> Calculate quantum amplitudes for each prime</p>
                        <p><strong>4. Vector Generation:</strong> Create normalized quantum semantic vector</p>
                        <p><strong>5. Resonance Analysis:</strong> Compute inter-concept relationships</p>
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
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm mb-2"><strong>Prime Basis Representation:</strong></p>
                    <p className="font-mono text-sm">|concept⟩ = Σᵢ αᵢ|pᵢ⟩</p>
                    <p className="text-xs text-gray-600 mt-2">Where αᵢ are complex amplitudes and |pᵢ⟩ are prime eigenstate vectors</p>
                    
                    <p className="text-sm mt-4 mb-2"><strong>Resonance Computation:</strong></p>
                    <p className="font-mono text-sm">R(A,B) = |⟨A|B⟩|² / (||A|| × ||B||)</p>
                    <p className="text-xs text-gray-600 mt-2">Quantum inner product normalized by vector magnitudes</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quantum Semantic Processing Workflow</CardTitle>
                  <CardDescription>
                    Complete process for encoding concepts into quantum vectors and computing semantic relationships
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram
                    chart={`
                      graph TD
                        START([Input Concepts]) --> PARSE{Parse & Validate}
                        PARSE --> |Valid| TOKENIZE[Tokenize Concepts]
                        PARSE --> |Invalid| ERROR[Return Error]
                        
                        TOKENIZE --> PRIME[Map to Prime Basis]
                        PRIME --> ENCODE[Quantum Vector Encoding]
                        ENCODE --> NORMALIZE[Normalize Amplitudes]
                        
                        NORMALIZE --> BRANCH{Processing Type}
                        
                        BRANCH --> |Single Concept| RETURN[Return Vector]
                        BRANCH --> |Multiple Concepts| RESONANCE[Compute Resonance]
                        
                        RESONANCE --> INTERFERENCE[Quantum Interference]
                        INTERFERENCE --> COHERENCE[Measure Coherence]
                        COHERENCE --> RELATIONSHIPS[Extract Relationships]
                        
                        RELATIONSHIPS --> SEMANTIC[Semantic Analysis]
                        SEMANTIC --> RETURN
                        
                        RETURN --> END([Output Results])
                        ERROR --> END
                        
                        subgraph "Prime Basis Mapping"
                          PRIME --> P2[Prime 2]
                          PRIME --> P3[Prime 3]
                          PRIME --> P5[Prime 5]
                          PRIME --> P7[Prime 7]
                          PRIME --> PN[Prime N...]
                        end
                        
                        classDef startEnd fill:#22c55e,stroke:#16a34a,stroke-width:3px,color:#fff
                        classDef process fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                        classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                        classDef quantum fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                        classDef error fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
                        
                        class START,END startEnd
                        class TOKENIZE,NORMALIZE,RETURN,SEMANTIC process
                        class PARSE,BRANCH decision
                        class PRIME,ENCODE,RESONANCE,INTERFERENCE,COHERENCE,RELATIONSHIPS,P2,P3,P5,P7,PN quantum
                        class ERROR error
                    `}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Concept Encoding Process</CardTitle>
                    <CardDescription>How natural language concepts become quantum vectors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        sequenceDiagram
                          participant C as Client
                          participant QSEM as QSEM Engine
                          participant PM as Prime Mapper
                          participant QE as Quantum Encoder
                          participant VN as Vector Normalizer
                          
                          C->>QSEM: Send concepts ["love", "quantum", "consciousness"]
                          QSEM->>PM: Map concepts to prime basis
                          
                          loop For each concept
                            PM->>PM: Analyze semantic content
                            PM->>PM: Assign prime weights
                            PM->>QE: Send prime mapping
                            QE->>QE: Create superposition state
                            QE->>VN: Normalize amplitudes
                            VN->>QSEM: Return quantum vector
                          end
                          
                          QSEM->>C: Return encoded vectors
                          
                          Note over PM: "love" → {2: 0.7, 3: 0.4, 7: 0.6}
                          Note over QE: Creates |ψ⟩ = Σ αᵢ|pᵢ⟩
                          Note over VN: Ensures Σ|αᵢ|² = 1
                      `}
                      className="w-full"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Semantic Resonance Computation</CardTitle>
                    <CardDescription>Measuring quantum relationships between concepts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        flowchart LR
                          V1[Vector 1<br/>|concept₁⟩] --> INNER[Inner Product<br/>⟨ψ₁|ψ₂⟩]
                          V2[Vector 2<br/>|concept₂⟩] --> INNER
                          
                          INNER --> AMP[Amplitude<br/>Analysis]
                          AMP --> PHASE[Phase<br/>Relationships]
                          
                          PHASE --> ENTANGLE[Entanglement<br/>Detection]
                          ENTANGLE --> COHERENCE[Coherence<br/>Measurement]
                          
                          COHERENCE --> SEMANTIC[Semantic<br/>Distance]
                          SEMANTIC --> RELATION[Relationship<br/>Classification]
                          
                          RELATION --> SIMILARITY[Similarity Score]
                          RELATION --> OPPOSITION[Opposition Score]
                          RELATION --> ORTHOGONAL[Orthogonal Score]
                          
                          subgraph "Resonance Types"
                            SIMILARITY --> |High Overlap| SYNONYMOUS[Synonymous]
                            OPPOSITION --> |Phase Shift π| ANTONYMOUS[Antonymous]
                            ORTHOGONAL --> |Zero Overlap| INDEPENDENT[Independent]
                          end
                          
                          classDef vector fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                          classDef quantum fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                          classDef result fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
                          
                          class V1,V2 vector
                          class INNER,AMP,PHASE,ENTANGLE,COHERENCE quantum
                          class SEMANTIC,RELATION,SIMILARITY,OPPOSITION,ORTHOGONAL,SYNONYMOUS,ANTONYMOUS,INDEPENDENT result
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
                      POST /v1/qsem/encode
                    </CardTitle>
                    <CardDescription>
                      Encode natural language concepts into prime-basis quantum semantic vectors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Request Example</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm"><code>{`{
  "concepts": ["love", "entropy", "pattern", "consciousness"],
  "basis": "prime"
}`}</code></pre>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Response Format</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm"><code>{`{
  "vectors": [
    {
      "concept": "love",
      "alpha": [0.3, 0.7, 0.2, 0.1, 0.05]
    },
    {
      "concept": "entropy", 
      "alpha": [0.8, 0.1, 0.4, 0.2, 0.15]
    }
  ]
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
                      POST /v1/qsem/resonance
                    </CardTitle>
                    <CardDescription>
                      Compute resonance and coherence metrics between encoded concept vectors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Request Example</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm"><code>{`{
  "vectors": [
    {"concept": "love", "alpha": [0.3, 0.7, 0.2]},
    {"concept": "entropy", "alpha": [0.8, 0.1, 0.4]}
  ]
}`}</code></pre>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Response Format</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm"><code>{`{
  "coherence": 0.67,
  "pairwise": [
    {"a": 0, "b": 1, "resonance": 0.42}
  ]
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
                    <CardTitle>Emotional Concept Analysis</CardTitle>
                    <CardDescription>Analyze relationships between emotional concepts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Input Concepts</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">love</Badge>
                          <Badge variant="outline">fear</Badge>
                          <Badge variant="outline">joy</Badge>
                          <Badge variant="outline">anger</Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Expected Resonance</h4>
                        <p className="text-sm text-gray-600">love ↔ joy: <span className="text-green-600 font-medium">0.85</span></p>
                        <p className="text-sm text-gray-600">fear ↔ anger: <span className="text-yellow-600 font-medium">0.62</span></p>
                        <p className="text-sm text-gray-600">love ↔ fear: <span className="text-red-600 font-medium">0.23</span></p>
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
                    <CardTitle>Scientific Concept Mapping</CardTitle>
                    <CardDescription>Map relationships in scientific domains</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Input Concepts</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">quantum</Badge>
                          <Badge variant="outline">entropy</Badge>
                          <Badge variant="outline">information</Badge>
                          <Badge variant="outline">consciousness</Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Expected Resonance</h4>
                        <p className="text-sm text-gray-600">quantum ↔ information: <span className="text-green-600 font-medium">0.78</span></p>
                        <p className="text-sm text-gray-600">entropy ↔ information: <span className="text-green-600 font-medium">0.91</span></p>
                        <p className="text-sm text-gray-600">quantum ↔ consciousness: <span className="text-blue-600 font-medium">0.56</span></p>
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
                    <CardTitle>Natural Language Processing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Semantic similarity analysis</li>
                      <li>• Concept clustering and categorization</li>
                      <li>• Text meaning extraction</li>
                      <li>• Language model enhancement</li>
                      <li>• Cross-linguistic concept mapping</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Knowledge Representation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Ontology development</li>
                      <li>• Knowledge graph construction</li>
                      <li>• Concept relationship discovery</li>
                      <li>• Semantic search optimization</li>
                      <li>• Information retrieval systems</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cognitive Science</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Mental model analysis</li>
                      <li>• Concept formation studies</li>
                      <li>• Cognitive bias detection</li>
                      <li>• Learning pattern analysis</li>
                      <li>• Consciousness research</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI & Machine Learning</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Feature engineering enhancement</li>
                      <li>• Embedding space optimization</li>
                      <li>• Transfer learning improvement</li>
                      <li>• Multi-modal AI systems</li>
                      <li>• Explainable AI development</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlock Quantum Semantic Analysis</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Transform your understanding of concepts and meanings using quantum semantic vectors and resonance analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/playground?api=qsem">
                  Try QSEM Playground
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/docs/qsem">View Full Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default QSEM;