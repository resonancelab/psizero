import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Gauge, Zap, Target, ArrowRight, Code, BarChart3, Orbit, Atom, AlertCircle, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import MermaidDiagram from "@/components/ui/mermaid-diagram";
import UnifiedPhysicsVisualization from "@/components/visualizations/UnifiedPhysicsVisualization";
import ApiKeySetup from "@/components/ApiKeySetup";
import psiZeroApi from "@/lib/api";
import { GravityRequest, GravityResponse } from "@/lib/api/types";

const UnifiedPhysics = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entropyRate, setEntropyRate] = useState(12.4);
  const [entropyGradient, setEntropyGradient] = useState(0.002);
  const [blackHoleDensity, setBlackHoleDensity] = useState(1.5e-3);
  const [gravityResult, setGravityResult] = useState<GravityResponse | null>(null);
  const [isComputing, setIsComputing] = useState(false);
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

  const handleComputeGravity = async () => {
    setIsComputing(true);
    setError(null);

    try {
      const request: GravityRequest = {
        observerEntropyReductionRate: entropyRate,
        regionEntropyGradient: entropyGradient
      };

      const response = await psiZeroApi.unified.computeGravity(request);
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setGravityResult(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gravity computation failed');
    } finally {
      setIsComputing(false);
    }
  };

  const resetDemo = () => {
    setGravityResult(null);
    setError(null);
    setIsComputing(false);
  };

  const getGravityInterpretation = (g: number) => {
    const earthG = 9.81;
    if (Math.abs(g - earthG) < 0.1) return "Earth-like gravity - familiar conditions";
    if (g > earthG * 2) return "High gravity - challenging movement, stronger structures";
    if (g < earthG * 0.5) return "Low gravity - easier movement, floating sensations";
    if (g > earthG) return "Above Earth gravity - heavier than familiar";
    return "Below Earth gravity - lighter than familiar";
  };

  return (
    <PageLayout>
      <Section>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-lg">
                <Gauge className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Unified Physics</h1>
                <p className="text-xl text-muted-foreground">Compute emergent gravitational effects from observer-entropy coupling dynamics</p>
              </div>
              <Badge className="bg-red-100/70 dark:bg-red-900/30 text-red-800 dark:text-red-200 ml-auto">Alpha</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-red-50/50 dark:bg-red-900/20 rounded-lg">
                <Gauge className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">Emergent</div>
                <div className="text-sm text-muted-foreground">Gravitational Constant</div>
              </div>
              <div className="text-center p-6 bg-pink-50/50 dark:bg-pink-900/20 rounded-lg">
                <Orbit className="h-8 w-8 text-pink-600 dark:text-pink-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">Observer</div>
                <div className="text-sm text-muted-foreground">Entropy Coupling</div>
              </div>
              <div className="text-center p-6 bg-rose-50/50 dark:bg-rose-900/20 rounded-lg">
                <Atom className="h-8 w-8 text-rose-600 dark:text-rose-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">Unified</div>
                <div className="text-sm text-muted-foreground">Field Theory</div>
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
                  <CardTitle>How Unified Physics Works</CardTitle>
                  <CardDescription>
                    The Unified Physics API models gravity as an emergent phenomenon arising from observer-entropy coupling, providing new insights into fundamental forces and spacetime geometry.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Core Capabilities</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center"><Gauge className="h-4 w-4 text-red-500 mr-2" />Emergent gravity computation</li>
                        <li className="flex items-center"><Orbit className="h-4 w-4 text-red-500 mr-2" />Observer-entropy coupling analysis</li>
                        <li className="flex items-center"><Atom className="h-4 w-4 text-red-500 mr-2" />Spacetime curvature modeling</li>
                        <li className="flex items-center"><BarChart3 className="h-4 w-4 text-red-500 mr-2" />Field strength calculations</li>
                        <li className="flex items-center"><Zap className="h-4 w-4 text-red-500 mr-2" />Dynamic constant evolution</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Computation Process</h3>
                      <div className="text-sm space-y-2">
                        <p><strong>1. Observer Analysis:</strong> Measure observer entropy reduction rate</p>
                        <p><strong>2. Entropy Gradient:</strong> Calculate regional entropy gradients</p>
                        <p><strong>3. Coupling Dynamics:</strong> Model observer-entropy interactions</p>
                        <p><strong>4. Field Generation:</strong> Compute emergent gravitational fields</p>
                        <p><strong>5. Constant Derivation:</strong> Extract effective gravitational constant</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergent Gravity Theory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm mb-2"><strong>Observer-Entropy Coupling:</strong></p>
                    <p className="font-mono text-sm">G_eff = G₀ × f(∂S_obs/∂t, ∇S_region)</p>
                    <p className="text-xs text-muted-foreground mt-2">Effective gravitational constant depends on observer entropy reduction and regional gradients</p>
                    
                    <p className="text-sm mt-4 mb-2"><strong>Field Strength Relation:</strong></p>
                    <p className="font-mono text-sm">F_gravity = G_eff × (m₁m₂/r²) × η(S)</p>
                    <p className="text-xs text-muted-foreground mt-2">Gravitational force modulated by entropy coupling factor η(S)</p>
                    
                    <p className="text-sm mt-4 mb-2"><strong>Spacetime Curvature:</strong></p>
                    <p className="font-mono text-sm">R_μν - ½gμνR = 8πG_eff/c⁴ × T_μν^obs</p>
                    <p className="text-xs text-muted-foreground mt-2">Einstein equations with observer-coupled stress-energy tensor</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Unified Physics Computation Workflow</CardTitle>
                  <CardDescription>
                    Complete process for computing emergent gravitational effects from observer-entropy dynamics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram
                    chart={`
                      graph TD
                        START([Input Observer Parameters]) --> VALIDATE{Validate Parameters}
                        VALIDATE --> |Valid| OBSERVER[Analyze Observer State]
                        VALIDATE --> |Invalid| ERROR[Return Error]
                        
                        OBSERVER --> ENTROPY_RATE[Calculate Entropy Reduction Rate]
                        ENTROPY_RATE --> GRADIENT[Measure Regional Entropy Gradient]
                        GRADIENT --> DENSITY[Assess Information Density]
                        
                        DENSITY --> COUPLING[Compute Observer-Entropy Coupling]
                        COUPLING --> FIELD_GEN[Generate Gravitational Field]
                        FIELD_GEN --> CURVATURE[Calculate Spacetime Curvature]
                        
                        CURVATURE --> G_EFFECTIVE[Derive Effective G Constant]
                        G_EFFECTIVE --> STRENGTH[Calculate Field Strength]
                        STRENGTH --> DYNAMICS[Model Dynamic Evolution]
                        
                        DYNAMICS --> STABILITY{Check Stability}
                        STABILITY --> |Stable| CONVERGED[System Converged]
                        STABILITY --> |Unstable| ADJUST[Adjust Parameters]
                        STABILITY --> |Oscillating| DYNAMICS
                        
                        ADJUST --> COUPLING
                        CONVERGED --> EXTRACT[Extract Physical Quantities]
                        EXTRACT --> RESULTS[Compile Results]
                        
                        RESULTS --> END([Return Physics Response])
                        ERROR --> END
                        
                        subgraph "Entropy Dynamics"
                          ENTROPY_RATE --> S_LOCAL[Local Entropy Change]
                          GRADIENT --> S_FIELD[Entropy Field Gradient]
                          S_LOCAL --> S_COUPLING[Entropy-Gravity Coupling]
                          S_FIELD --> S_COUPLING
                          S_COUPLING --> EMERGENT[Emergent Gravity]
                        end
                        
                        subgraph "Observer Effects"
                          OBSERVER --> MEASUREMENT[Measurement Process]
                          MEASUREMENT --> COLLAPSE[Wavefunction Collapse]
                          COLLAPSE --> INFO_GAIN[Information Gain]
                          INFO_GAIN --> ENTROPY_REDUCTION[Entropy Reduction]
                          ENTROPY_REDUCTION --> GRAVITY_SOURCE[Gravity Source]
                        end
                        
                        classDef startEnd fill:#22c55e,stroke:#16a34a,stroke-width:3px,color:#fff
                        classDef process fill:#dc2626,stroke:#b91c1c,stroke-width:2px,color:#fff
                        classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                        classDef physics fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                        classDef observer fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                        classDef error fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
                        
                        class START,END startEnd
                        class OBSERVER,ENTROPY_RATE,GRADIENT,DENSITY,RESULTS process
                        class VALIDATE,STABILITY decision
                        class COUPLING,FIELD_GEN,CURVATURE,G_EFFECTIVE,STRENGTH,DYNAMICS,CONVERGED,EXTRACT,S_LOCAL,S_FIELD,S_COUPLING,EMERGENT physics
                        class MEASUREMENT,COLLAPSE,INFO_GAIN,ENTROPY_REDUCTION,GRAVITY_SOURCE observer
                        class ERROR,ADJUST error
                    `}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Observer-Entropy Coupling Mechanism</CardTitle>
                    <CardDescription>How conscious observation generates gravitational effects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        sequenceDiagram
                          participant O as Observer
                          participant Q as Quantum System
                          participant E as Entropy Field
                          participant G as Gravity Field
                          participant ST as Spacetime
                          
                          O->>Q: Perform measurement
                          Q->>Q: Wavefunction collapse
                          Q->>E: Reduce local entropy
                          E->>E: Create entropy gradient
                          
                          E->>G: Generate gravity field
                          G->>ST: Curve spacetime
                          ST->>O: Affect observer motion
                          
                          loop Dynamic Feedback
                            O->>O: Update observation rate
                            O->>E: Modify entropy reduction
                            E->>G: Adjust gravity strength
                            G->>O: Influence next observation
                          end
                          
                          Note over O,E: Observer entropy reduction<br/>drives gravitational coupling
                          Note over G,ST: Emergent gravity curves<br/>spacetime geometry
                      `}
                      className="w-full"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gravitational Constant Evolution</CardTitle>
                    <CardDescription>How G_eff changes with observer-entropy dynamics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MermaidDiagram
                      chart={`
                        flowchart TB
                          G0[Standard G₀<br/>6.67 × 10⁻¹¹] --> OBSERVER_RATE[Observer Entropy<br/>Reduction Rate]
                          
                          OBSERVER_RATE --> COUPLING_FACTOR[Calculate<br/>Coupling Factor f]
                          GRADIENT[Regional Entropy<br/>Gradient ∇S] --> COUPLING_FACTOR
                          
                          COUPLING_FACTOR --> MODULATION[Gravity Strength<br/>Modulation]
                          MODULATION --> G_EFF[Effective G_eff]
                          
                          G_EFF --> COMPARISON{Compare to G₀}
                          
                          COMPARISON --> |G_eff &gt; G₀| ENHANCED[Enhanced Gravity<br/>Strong Observer Effect]
                          COMPARISON --> |G_eff = G₀| STANDARD[Standard Gravity<br/>No Observer Effect]
                          COMPARISON --> |G_eff &lt; G₀| REDUCED[Reduced Gravity<br/>Negative Coupling]
                          
                          ENHANCED --> APPLICATIONS[Strong Field<br/>Applications]
                          STANDARD --> CLASSICAL[Classical<br/>Physics Regime]
                          REDUCED --> EXOTIC[Exotic Matter<br/>Effects]
                          
                          subgraph "Physical Regimes"
                            APPLICATIONS --> BLACK_HOLES[Black Hole<br/>Formation]
                            CLASSICAL --> PLANETARY[Planetary<br/>Dynamics]
                            EXOTIC --> WARP_DRIVE[Warp Drive<br/>Propulsion]
                          end
                          
                          classDef constant fill:#dc2626,stroke:#b91c1c,stroke-width:2px,color:#fff
                          classDef process fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
                          classDef decision fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
                          classDef result fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
                          classDef application fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
                          
                          class G0,G_EFF constant
                          class OBSERVER_RATE,GRADIENT,COUPLING_FACTOR,MODULATION process
                          class COMPARISON decision
                          class ENHANCED,STANDARD,REDUCED result
                          class APPLICATIONS,CLASSICAL,EXOTIC,BLACK_HOLES,PLANETARY,WARP_DRIVE application
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
                      <Gauge className="h-5 w-5 mr-2" />
                      Interactive Unified Physics Demo
                    </CardTitle>
                    <CardDescription>
                      Compute emergent gravitational effects from observer-entropy coupling dynamics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Parameter Input */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="entropyRate">Observer Entropy Rate (bits/sec)</Label>
                          <Input
                            id="entropyRate"
                            type="number"
                            step="0.1"
                            value={entropyRate}
                            onChange={(e) => setEntropyRate(parseFloat(e.target.value) || 12.4)}
                            disabled={isComputing}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            How fast the observer reduces entropy
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="entropyGradient">Entropy Gradient (bits/m³)</Label>
                          <Input
                            id="entropyGradient"
                            type="number"
                            step="0.0001"
                            value={entropyGradient}
                            onChange={(e) => setEntropyGradient(parseFloat(e.target.value) || 0.002)}
                            disabled={isComputing}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Regional entropy variation
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="blackHoleDensity">Black Hole Density</Label>
                          <Input
                            id="blackHoleDensity"
                            type="number"
                            step="1e-6"
                            value={blackHoleDensity}
                            onChange={(e) => setBlackHoleDensity(parseFloat(e.target.value) || 1.5e-3)}
                            disabled={isComputing}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Informational density proxy
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          onClick={handleComputeGravity}
                          disabled={isComputing}
                          className="flex-1"
                        >
                          {isComputing ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Computing Gravity...
                            </>
                          ) : (
                            <>
                              <Calculator className="h-4 w-4 mr-2" />
                              Compute Emergent Gravity
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={resetDemo}
                          disabled={isComputing}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>

                    {/* Progress */}
                    {isComputing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Computing gravitational coupling...</span>
                          <span>Processing quantum-classical transition</span>
                        </div>
                        <Progress value={75} className="w-full" />
                      </div>
                    )}

                    {/* Results */}
                    {gravityResult && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Emergent Gravity Results</CardTitle>
                          <CardDescription>
                            Gravitational effects computed from observer-entropy coupling
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Main Results */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center p-6 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
                              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                                {gravityResult.effectiveG.toExponential(3)}
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">Effective Gravitational Constant</div>
                              <div className="text-xs text-muted-foreground">
                                Standard G₀ = 6.674 × 10⁻¹¹ m³ kg⁻¹ s⁻²
                              </div>
                            </div>

                            <div className="text-center p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                {gravityResult.fieldStrength.toFixed(2)}
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">Field Strength (m/s²)</div>
                              <div className="text-xs text-muted-foreground">
                                Earth gravity = 9.81 m/s²
                              </div>
                            </div>
                          </div>

                          {/* Interpretation */}
                          <div className="bg-muted p-4 rounded-lg">
                            <h5 className="font-semibold mb-2">Physical Interpretation</h5>
                            <p className="text-sm text-muted-foreground mb-3">
                              {getGravityInterpretation(gravityResult.fieldStrength)}
                            </p>
                            <div className="text-xs text-muted-foreground italic">
                              {gravityResult.notes}
                            </div>
                          </div>

                          {/* Parameter Summary */}
                          <div className="space-y-4">
                            <h5 className="font-semibold">Computation Parameters</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="bg-muted p-3 rounded">
                                <div className="font-medium">Entropy Rate</div>
                                <div className="text-muted-foreground">{entropyRate} bits/sec</div>
                              </div>
                              <div className="bg-muted p-3 rounded">
                                <div className="font-medium">Entropy Gradient</div>
                                <div className="text-muted-foreground">{entropyGradient} bits/m³</div>
                              </div>
                              <div className="bg-muted p-3 rounded">
                                <div className="font-medium">Black Hole Density</div>
                                <div className="text-muted-foreground">{blackHoleDensity.toExponential(1)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Coupling Visualization */}
                          <div className="space-y-4">
                            <h5 className="font-semibold">Observer-Entropy Coupling</h5>
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm">Coupling Strength</span>
                                <span className="text-sm font-medium">
                                  {((gravityResult.effectiveG / 6.674e-11 - 1) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${Math.min(Math.abs(gravityResult.effectiveG / 6.674e-11 - 1) * 50, 100)}%`
                                  }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>Standard Gravity</span>
                                <span>Modified by Observer Effect</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Error Display */}
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    POST /v1/unified/gravity/compute
                  </CardTitle>
                  <CardDescription>
                    Compute emergent gravitational effects from observer-entropy coupling parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Request Parameters</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm"><code>{`{
  "observerEntropyReductionRate": 12.4,
  "regionEntropyGradient": 0.002,
  "blackHoleProxyDensity": 1.5e15
}`}</code></pre>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Response Format</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm"><code>{`{
  "effectiveG": 6.67e-11,
  "fieldStrength": 9.81,
  "notes": "Emergent gravitational constant computed from observer-entropy coupling. Standard gravity regime detected with minimal observer effects.",
  "analysis": {
    "couplingStrength": 0.15,
    "entropyGradientMagnitude": 0.002,
    "gravitationalEnhancement": 1.0,
    "stabilityIndex": 0.98,
    "regime": "classical"
  },
  "predictions": {
    "orbitalPeriodModification": 0.0001,
    "tidalForceVariation": 1.2e-8,
    "spacetimeCurvatureDeviation": 2.3e-12
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
                    <CardTitle>Laboratory Physics</CardTitle>
                    <CardDescription>Compute observer effects in controlled laboratory settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Configuration</h4>
                        <p className="text-sm text-muted-foreground mb-2">Observer Rate: 5.2 bits/sec</p>
                        <p className="text-sm text-muted-foreground mb-2">Gradient: 0.001 bits/m³</p>
                        <p className="text-sm text-muted-foreground">Expected: Minimal deviation from G₀</p>
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
                    <CardTitle>Astrophysical Simulation</CardTitle>
                    <CardDescription>Model gravitational effects in extreme cosmic environments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Configuration</h4>
                        <p className="text-sm text-muted-foreground mb-2">Observer Rate: 1000+ bits/sec</p>
                        <p className="text-sm text-muted-foreground mb-2">Near black hole: High density</p>
                        <p className="text-sm text-muted-foreground">Expected: Significant G enhancement</p>
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
                    <CardTitle>Consciousness Research</CardTitle>
                    <CardDescription>Explore the physical effects of conscious observation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Configuration</h4>
                        <p className="text-sm text-muted-foreground mb-2">Variable observer attention rates</p>
                        <p className="text-sm text-muted-foreground mb-2">Controlled entropy environments</p>
                        <p className="text-sm text-muted-foreground">Expected: Observer-gravity correlation</p>
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
                    <CardTitle>Propulsion Physics</CardTitle>
                    <CardDescription>Investigate exotic propulsion using modified gravity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Configuration</h4>
                        <p className="text-sm text-muted-foreground mb-2">Negative entropy gradients</p>
                        <p className="text-sm text-muted-foreground mb-2">Controlled observer coupling</p>
                        <p className="text-sm text-muted-foreground">Expected: Gravity modification</p>
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
                    <CardTitle>Fundamental Physics Research</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Quantum gravity unification</li>
                      <li>• Observer effect quantification</li>
                      <li>• Consciousness-matter interaction</li>
                      <li>• Spacetime emergence studies</li>
                      <li>• Information-geometry relationships</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Propulsion</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Gravity modification drives</li>
                      <li>• Warp field generation</li>
                      <li>• Reactionless propulsion</li>
                      <li>• Faster-than-light travel</li>
                      <li>• Energy-efficient spacecraft</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Astrophysics & Cosmology</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Dark matter alternatives</li>
                      <li>• Black hole information paradox</li>
                      <li>• Cosmic structure formation</li>
                      <li>• Universe expansion modeling</li>
                      <li>• Gravitational wave analysis</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Consciousness Studies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Mind-matter interaction research</li>
                      <li>• Consciousness measurement tools</li>
                      <li>• Observer effect quantification</li>
                      <li>• Psychophysics experiments</li>
                      <li>• Meditation state analysis</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Unify Physics?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Explore the deepest mysteries of gravity, consciousness, and spacetime through observer-entropy coupling dynamics and emergent field theory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/playground?api=unified">
                  Try Unified Physics Playground
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/docs/unified">View Full Documentation</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Interactive Visualization */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Atom className="h-5 w-5 text-blue-500" />
                Interactive Unified Physics Demonstration
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Experience emergent gravity computation through observer-entropy coupling dynamics. Watch how quantum observers
                influence gravitational field strength and witness the evolution of the gravitational constant in real-time.
              </p>
            </CardHeader>
            <CardContent>
              <UnifiedPhysicsVisualization />
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default UnifiedPhysics;