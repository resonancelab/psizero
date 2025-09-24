import React, { useState, useEffect } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Atom,
  Zap,
  Waves,
  Code,
  Lightbulb,
  MessageSquare,
  Network,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Link } from "react-router-dom";
import QLLMPlayground from '@/components/qllm/QLLMPlayground';
import ApiKeySetup from "@/components/ApiKeySetup";
import psiZeroApi from "@/lib/api";

const QLLM: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  return (
    <PageLayout>
      <Section>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Quantum Resonance Language Model (QLLM)</h1>
                <p className="text-xl text-muted-foreground">Quantum-enhanced language processing with prime-based encoding and resonance attention</p>
              </div>
              <Badge className="bg-green-100/70 dark:bg-green-900/30 text-green-800 dark:text-green-200 ml-auto">Stable</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10x</div>
                <div className="text-sm text-muted-foreground">Faster Inference</div>
              </div>
              <div className="text-center p-6 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg">
                <Atom className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Prime</div>
                <div className="text-sm text-muted-foreground">Basis Encoding</div>
              </div>
              <div className="text-center p-6 bg-green-50/50 dark:bg-green-900/20 rounded-lg">
                <Waves className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">Quantum</div>
                <div className="text-sm text-muted-foreground">Resonance</div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="interactive">Interactive Demo</TabsTrigger>
              <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How QLLM Works</CardTitle>
                  <CardDescription>
                    QLLM represents a breakthrough in language processing by combining quantum mathematics with modern attention mechanisms, enabling unprecedented semantic understanding and generation capabilities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Core Capabilities</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center"><Brain className="h-4 w-4 text-blue-500 mr-2" />Quantum-enhanced text generation</li>
                        <li className="flex items-center"><Atom className="h-4 w-4 text-blue-500 mr-2" />Prime-based semantic encoding</li>
                        <li className="flex items-center"><Waves className="h-4 w-4 text-blue-500 mr-2" />Resonance attention mechanism</li>
                        <li className="flex items-center"><Zap className="h-4 w-4 text-blue-500 mr-2" />Real-time similarity analysis</li>
                        <li className="flex items-center"><Network className="h-4 w-4 text-blue-500 mr-2" />Vector space visualization</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Processing Pipeline</h3>
                      <div className="text-sm space-y-2">
                        <p><strong>1. Prime Encoding:</strong> Transform text tokens into prime-based quantum states</p>
                        <p><strong>2. Resonance Attention:</strong> Apply iterative attention refinement</p>
                        <p><strong>3. Coherence Optimization:</strong> Minimize entropy through quantum interference</p>
                        <p><strong>4. Generation:</strong> Produce semantically coherent output</p>
                        <p><strong>5. Validation:</strong> Ensure quantum stability and digital root periodicity</p>
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
                    <p className="text-sm mb-2"><strong>Prime Hilbert Encoding:</strong></p>
                    <p className="font-mono text-sm">|token⟩ = Σᵢ αᵢ|pᵢ⟩</p>
                    <p className="text-xs text-muted-foreground mt-2">Where αᵢ are quantum amplitudes and |pᵢ⟩ are prime eigenstate vectors</p>
                    
                    <p className="text-sm mt-4 mb-2"><strong>Resonance Attention:</strong></p>
                    <p className="font-mono text-sm">A = softmax(QK^T / √d) → optimize via entropy minimization</p>
                    <p className="text-xs text-muted-foreground mt-2">Iteratively refined attention patterns converging to optimal coherence</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="architecture" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Architecture</CardTitle>
                  <CardDescription>
                    How QLLM integrates with the existing platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Backend (Go)</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Prime Hilbert Encoder</li>
                        <li>• Resonance Attention Mechanism</li>
                        <li>• Quantum Mathematics Library</li>
                        <li>• RESTful API Endpoints</li>
                        <li>• WebSocket Streaming Support</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Frontend (React/TypeScript)</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Interactive Playground</li>
                        <li>• Real-time Visualization</li>
                        <li>• Model Management Interface</li>
                        <li>• Performance Monitoring</li>
                        <li>• Educational Components</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Interactive QLLM Playground
                    </CardTitle>
                    <CardDescription>
                      Experience quantum-enhanced language processing with text generation, encoding, and similarity analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QLLMPlayground />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="algorithms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Core Algorithms</CardTitle>
                  <CardDescription>
                    The quantum-inspired algorithms powering QLLM
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold">Prime-Based Encoding</h4>
                      <p className="text-sm text-muted-foreground">
                        Text tokens are mapped to prime-based Hilbert spaces using modular arithmetic.
                        Each prime number represents a fundamental quantum basis state.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold">Resonance Attention</h4>
                      <p className="text-sm text-muted-foreground">
                        Iterative attention mechanism that refines attention weights through entropy minimization.
                        Converges to optimal attention patterns using quantum interference principles.
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold">Digital Root Stability</h4>
                      <p className="text-sm text-muted-foreground">
                        Applies digital root periodicity to ensure quantum state stability.
                        Digital root 9 provides maximum resonance stability.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Characteristics</CardTitle>
                  <CardDescription>
                    Expected performance improvements and benchmarks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">30-50%</div>
                      <div className="text-sm text-muted-foreground">Faster NP-complete solving</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Through resonance-enhanced optimization
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">10x</div>
                      <div className="text-sm text-muted-foreground">Inference speedup</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Compared to Python implementations
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">90%</div>
                      <div className="text-sm text-muted-foreground">Cache hit rate</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        For repeated computations
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integration" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Integration</CardTitle>
                  <CardDescription>
                    How QLLM enhances existing platform capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Enhanced Services
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">QSEM</Badge>
                          <span>Prime-based semantic encoding</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">QCR</Badge>
                          <span>Consciousness modeling</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Optimizer</Badge>
                          <span>Resonance-enhanced solving</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Stock Oracle</Badge>
                          <span>Quantum market analysis</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Use Cases
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Quantum-enhanced financial analysis</li>
                        <li>• Advanced NP-complete problem solving</li>
                        <li>• Consciousness-integrated AI assistant</li>
                        <li>• Quantum semantic search</li>
                        <li>• Creative content generation</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">Experience Quantum Language Processing</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Transform your applications with quantum-enhanced language understanding and generation capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/playground?api=qllm">
                  Try QLLM Playground
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/docs/qllm">View Full Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default QLLM;
