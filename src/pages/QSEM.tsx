import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Brain, Network, ArrowRight, Code, Target, Atom, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import MermaidDiagram from "@/components/ui/mermaid-diagram";
import ApiKeySetup from "@/components/ApiKeySetup";
import psiZeroApi from "@/lib/api";
import { QSemVector, QSemResonanceResponse } from "@/lib/api/types";

const QSEM = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [concepts, setConcepts] = useState('love\nentropy\npattern\nconsciousness');
  const [vectors, setVectors] = useState<QSemVector[]>([]);
  const [resonanceData, setResonanceData] = useState<QSemResonanceResponse | null>(null);
  const [isEncoding, setIsEncoding] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [encodingProgress, setEncodingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(psiZeroApi.auth.isAuthenticated());
    };

    checkAuth();

    // Check periodically in case user configures API key in another tab
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleEncode = async () => {
    setIsEncoding(true);
    setError(null);
    setEncodingProgress(0);
    setVectors([]);
    setResonanceData(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setEncodingProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const conceptList = concepts.split('\n').filter(c => c.trim());
      if (conceptList.length === 0) {
        throw new Error('Please enter at least one concept');
      }

      const response = await psiZeroApi.qsem.quickEncode(conceptList);

      clearInterval(progressInterval);
      setEncodingProgress(100);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setVectors(response.data.vectors);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encoding failed');
    } finally {
      setIsEncoding(false);
    }
  };

  const handleAnalyzeResonance = async () => {
    if (vectors.length < 2) {
      setError('Need at least 2 concepts to analyze resonance');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await psiZeroApi.qsem.computeResonance(vectors);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setResonanceData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resonance analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetDemo = () => {
    setVectors([]);
    setResonanceData(null);
    setError(null);
    setEncodingProgress(0);
    setIsEncoding(false);
    setIsAnalyzing(false);
  };

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
                <h1 className="text-4xl font-bold text-foreground">Quantum Semantics (QSEM)</h1>
                <p className="text-xl text-muted-foreground">Encode concepts into prime-basis quantum vectors for semantic resonance analysis</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 ml-auto">Beta</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg">
                <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">∞</div>
                <div className="text-sm text-muted-foreground">Concepts Encodable</div>
              </div>
              <div className="text-center p-6 bg-pink-50/50 dark:bg-pink-900/20 rounded-lg">
                <Network className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">Prime</div>
                <div className="text-sm text-muted-foreground">Basis Vectors</div>
              </div>
              <div className="text-center p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">Quantum</div>
                <div className="text-sm text-muted-foreground">Semantic Space</div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="interactive">Interactive Demo</TabsTrigger>
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
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm mb-2"><strong>Prime Basis Representation:</strong></p>
                    <p className="font-mono text-sm">|concept⟩ = Σᵢ αᵢ|pᵢ⟩</p>
                    <p className="text-xs text-muted-foreground mt-2">Where αᵢ are complex amplitudes and |pᵢ⟩ are prime eigenstate vectors</p>
                    
                    <p className="text-sm mt-4 mb-2"><strong>Resonance Computation:</strong></p>
                    <p className="font-mono text-sm">R(A,B) = |⟨A|B⟩|² / (||A|| × ||B||)</p>
                    <p className="text-xs text-muted-foreground mt-2">Quantum inner product normalized by vector magnitudes</p>
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

            <TabsContent value="interactive" className="space-y-6">
              {/* API Key Setup */}
              {!isAuthenticated && (
                <div className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You need to configure your API key to use the interactive demos.
                      The API key is stored locally and used to authenticate requests to the PsiZero quantum computing platform.
                    </AlertDescription>
                  </Alert>
                  <ApiKeySetup onConfigured={() => setIsAuthenticated(true)} />
                </div>
              )}

              {/* Interactive Demo */}
              {isAuthenticated && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Interactive Semantic Encoding Demo
                    </CardTitle>
                    <CardDescription>
                      Encode concepts into quantum semantic vectors and analyze their resonance patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Input Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="concepts">Concepts to Encode</Label>
                          <Textarea
                            id="concepts"
                            placeholder="love&#10;entropy&#10;pattern&#10;consciousness"
                            value={concepts}
                            onChange={(e) => setConcepts(e.target.value)}
                            rows={6}
                            disabled={isEncoding}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Enter one concept per line (2-10 concepts recommended)
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={handleEncode}
                            disabled={isEncoding || !concepts.trim()}
                            className="flex-1"
                          >
                            {isEncoding ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Encoding...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Encode Concepts
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={resetDemo}
                            disabled={isEncoding}
                          >
                            Reset
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Encoding Preview</h4>
                        <div className="bg-muted p-4 rounded-lg text-sm">
                          <p><strong>Concepts:</strong> {concepts.split('\n').filter(c => c.trim()).length}</p>
                          <p><strong>Basis:</strong> Prime</p>
                          <p><strong>Status:</strong> {vectors.length > 0 ? 'Encoded' : 'Ready'}</p>
                        </div>

                        {vectors.length > 0 && (
                          <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <h5 className="font-semibold mb-2">Encoded Vectors:</h5>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {vectors.slice(0, 3).map((vector, i) => (
                                <div key={i} className="text-xs">
                                  <strong>{vector.concept}:</strong> [{vector.alpha.slice(0, 5).join(', ')}...]
                                </div>
                              ))}
                              {vectors.length > 3 && (
                                <div className="text-xs text-muted-foreground">
                                  ... and {vectors.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    {isEncoding && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Encoding concepts...</span>
                          <span>{encodingProgress}%</span>
                        </div>
                        <Progress value={encodingProgress} className="w-full" />
                      </div>
                    )}

                    {/* Error Display */}
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Resonance Analysis */}
                    {vectors.length >= 2 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Semantic Resonance Analysis</CardTitle>
                          <CardDescription>
                            Analyze resonance patterns between encoded concepts
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex gap-4">
                            <Button
                              onClick={handleAnalyzeResonance}
                              disabled={isAnalyzing}
                              className="flex-1"
                            >
                              {isAnalyzing ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <Network className="h-4 w-4 mr-2" />
                                  Analyze Resonance
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Resonance Results */}
                          {resonanceData && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-green-50/50 dark:bg-green-900/20 p-4 rounded-lg">
                                  <h5 className="font-semibold text-green-800 mb-2">Overall Coherence</h5>
                                  <div className="text-2xl font-bold text-green-600">
                                    {(resonanceData.coherence * 100).toFixed(1)}%
                                  </div>
                                  <p className="text-sm text-green-700 mt-1">
                                    {resonanceData.coherence > 0.7 ? 'High coherence detected' :
                                     resonanceData.coherence > 0.4 ? 'Moderate coherence' :
                                     'Low coherence - concepts may be unrelated'}
                                  </p>
                                </div>

                                <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-lg">
                                  <h5 className="font-semibold text-blue-800 mb-2">Pairwise Resonance</h5>
                                  <div className="text-sm space-y-1 max-h-24 overflow-y-auto">
                                    {resonanceData.pairwise.slice(0, 3).map((pair, i) => (
                                      <div key={i} className="flex justify-between">
                                        <span>{vectors[pair.a]?.concept} ↔ {vectors[pair.b]?.concept}</span>
                                        <span className="font-mono">{(pair.resonance * 100).toFixed(0)}%</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Resonance Matrix Visualization */}
                              <div className="bg-muted p-4 rounded-lg">
                                <h5 className="font-semibold mb-3">Resonance Matrix</h5>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr>
                                        <th className="text-left p-1">Concept</th>
                                        {vectors.map((_, i) => (
                                          <th key={i} className="text-center p-1 min-w-12">
                                            {vectors[i].concept.slice(0, 3)}...
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {vectors.map((vectorA, i) => (
                                        <tr key={i}>
                                          <td className="font-medium p-1">{vectorA.concept}</td>
                                          {vectors.map((vectorB, j) => {
                                            const resonance = i === j ? 1 :
                                              resonanceData.pairwise.find(p =>
                                                (p.a === i && p.b === j) || (p.a === j && p.b === i)
                                              )?.resonance || 0;
                                            return (
                                              <td key={j} className="text-center p-1">
                                                <div
                                                  className="w-8 h-8 rounded flex items-center justify-center text-white font-mono text-xs"
                                                  style={{
                                                    backgroundColor: i === j ? '#10b981' :
                                                      `hsl(${120 * resonance}, 70%, 50%)`
                                                  }}
                                                >
                                                  {(resonance * 100).toFixed(0)}
                                                </div>
                                              </td>
                                            );
                                          })}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              )}
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
                        <div className="bg-muted p-4 rounded-lg">
                          <pre className="text-sm"><code>{`{
  "concepts": ["love", "entropy", "pattern", "consciousness"],
  "basis": "prime"
}`}</code></pre>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Response Format</h4>
                        <div className="bg-muted p-4 rounded-lg">
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
                        <div className="bg-muted p-4 rounded-lg">
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
                        <div className="bg-muted p-4 rounded-lg">
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
                        <p className="text-sm text-muted-foreground">love ↔ joy: <span className="text-green-600 font-medium">0.85</span></p>
                        <p className="text-sm text-muted-foreground">fear ↔ anger: <span className="text-yellow-600 font-medium">0.62</span></p>
                        <p className="text-sm text-muted-foreground">love ↔ fear: <span className="text-red-600 font-medium">0.23</span></p>
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
                        <p className="text-sm text-muted-foreground">quantum ↔ information: <span className="text-green-600 font-medium">0.78</span></p>
                        <p className="text-sm text-muted-foreground">entropy ↔ information: <span className="text-green-600 font-medium">0.91</span></p>
                        <p className="text-sm text-muted-foreground">quantum ↔ consciousness: <span className="text-blue-600 font-medium">0.56</span></p>
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
          <div className="mt-12 text-center bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">Unlock Quantum Semantic Analysis</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
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