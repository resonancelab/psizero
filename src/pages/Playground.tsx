import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, Copy, RotateCcw, Plus, X, Brain, Calculator, Atom, 
  Sparkles, Globe, Eye, Hexagon, Gauge, Zap 
} from "lucide-react";
import CodeBlock from "@/components/ui/code-block";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

const Playground = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [selectedApi, setSelectedApi] = useState(searchParams.get('api') || 'srs');
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("ak_demo_nomyx_key_testing");

  // SRS State
  const [clauses, setClauses] = useState([["x1", "-x2", "x3"], ["-x1", "x2", "-x3"]]);
  const [maxIterations, setMaxIterations] = useState(5000);

  // HQE State
  const [primes, setPrimes] = useState([2, 3, 5, 7]);
  const [steps, setSteps] = useState(256);
  const [lambda, setLambda] = useState("0.02");

  // QSEM State
  const [concepts, setConcepts] = useState(["love", "entropy", "pattern"]);

  // NLC State
  const [nlcPrimes, setNlcPrimes] = useState([2, 3, 5]);
  const [message, setMessage] = useState("Hello through the quantum channel");

  // QCR State
  const [modes, setModes] = useState(["analytical", "creative", "ethical"]);
  const [prompt, setPrompt] = useState("What is the nature of consciousness?");

  // I-Ching State
  const [question, setQuestion] = useState("What direction should I take?");
  const [ichingSteps, setIchingSteps] = useState(7);

  // Unified State
  const [entropyRate, setEntropyRate] = useState("12.4");
  const [gradient, setGradient] = useState("0.002");

  const apiConfigs = {
    srs: {
      name: "Symbolic Resonance Solver",
      icon: Brain,
      color: "blue",
      description: "Solve NP-complete problems using symbolic resonance",
      endpoint: "/v1/srs/solve",
      status: "stable"
    },
    hqe: {
      name: "Holographic Quantum Encoder",
      icon: Atom,
      color: "purple",
      description: "Simulate quantum holographic systems",
      endpoint: "/v1/hqe/simulate",
      status: "stable"
    },
    qsem: {
      name: "Quantum Semantics",
      icon: Sparkles,
      color: "pink",
      description: "Encode concepts into quantum semantic vectors",
      endpoint: "/v1/qsem/encode",
      status: "beta"
    },
    nlc: {
      name: "Non-Local Communication",
      icon: Globe,
      color: "green",
      description: "Establish quantum communication channels",
      endpoint: "/v1/nlc/sessions",
      status: "beta"
    },
    qcr: {
      name: "Quantum Consciousness Resonator",
      icon: Eye,
      color: "indigo",
      description: "Triadic consciousness simulation",
      endpoint: "/v1/qcr/sessions",
      status: "alpha"
    },
    iching: {
      name: "I-Ching Oracle",
      icon: Hexagon,
      color: "orange",
      description: "Hexagram evolution using entropy dynamics",
      endpoint: "/v1/iching/evolve",
      status: "stable"
    },
    unified: {
      name: "Unified Physics",
      icon: Gauge,
      color: "red",
      description: "Compute emergent gravitational effects",
      endpoint: "/v1/unified/gravity/compute",
      status: "alpha"
    }
  };

  const handleApiTest = async () => {
    setIsLoading(true);
    
    let requestData = {};
    let mockResponse = {};

    // Simulate different API responses based on selected API
    switch (selectedApi) {
      case 'srs': {
        const validClauses = clauses
          .map(clause => clause.filter(literal => literal.trim() !== ""))
          .filter(clause => clause.length > 0);
        
        requestData = {
          problem: "3sat",
          spec: {
            variables: 4,
            clauses: validClauses.map(clause =>
              clause.map(literal => ({
                var: parseInt(literal.replace(/[^0-9]/g, '')) || 1,
                neg: literal.startsWith('-')
              }))
            )
          },
          config: { stop: { iterMax: maxIterations } }
        };
        
        mockResponse = {
          feasible: true,
          certificate: { assignment: [1, 0, 1, 0] },
          metrics: {
            entropy: 0.034,
            plateauDetected: true,
            dominance: 0.89,
            resonanceStrength: 0.95
          }
        };
        break;
      }

      case 'hqe': {
        requestData = { primes, steps, lambda: parseFloat(lambda) };
        mockResponse = {
          snapshots: [
            { step: 0, amplitudes: [0.5, 0.3, 0.2, 0.1], metrics: { entropy: 1.23 } },
            { step: steps, amplitudes: [0.1, 0.7, 0.15, 0.05], metrics: { entropy: 0.15 } }
          ],
          finalMetrics: { entropy: 0.15, plateauDetected: true, resonanceStrength: 0.92 }
        };
        break;
      }

      case 'qsem': {
        requestData = { concepts, basis: "prime" };
        mockResponse = {
          vectors: concepts.map(concept => ({
            concept,
            alpha: Array.from({length: 5}, () => Math.random())
          }))
        };
        break;
      }

      case 'nlc': {
        requestData = { primes: nlcPrimes, goldenPhase: true };
        mockResponse = {
          id: "nlc_" + Math.random().toString(36).substr(2, 8),
          status: "syncing",
          metrics: { entropy: 0.23, resonanceStrength: 0.78 }
        };
        break;
      }

      case 'qcr': {
        requestData = { modes, maxIterations: 21 };
        mockResponse = {
          id: "qcr_" + Math.random().toString(36).substr(2, 8),
          iteration: 0,
          stabilized: false
        };
        break;
      }

      case 'iching': {
        requestData = { question, steps: ichingSteps };
        mockResponse = {
          sequence: Array.from({length: ichingSteps}, (_, i) => ({
            step: i,
            hexagram: Math.random().toString(2).substr(2, 6).padEnd(6, '0'),
            entropy: 1.35 - (i * 0.15),
            attractorProximity: i * 0.1
          })),
          stabilized: true
        };
        break;
      }

      case 'unified': {
        requestData = {
          observerEntropyReductionRate: parseFloat(entropyRate),
          regionEntropyGradient: parseFloat(gradient)
        };
        mockResponse = {
          effectiveG: 6.67e-11,
          fieldStrength: 9.81,
          notes: "Emergent gravitational constant computed from observer-entropy coupling"
        };
        break;
      }
    }

    // Simulate API call delay
    setTimeout(() => {
      setResponse(JSON.stringify(mockResponse, null, 2));
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    toast({
      title: "Copied!",
      description: "Response copied to clipboard",
    });
  };

  const resetForm = () => {
    setResponse("");
    // Reset all form states to defaults
    setClauses([["x1", "-x2", "x3"], ["-x1", "x2", "-x3"]]);
    setPrimes([2, 3, 5, 7]);
    setConcepts(["love", "entropy", "pattern"]);
    setPrompt("What is the nature of consciousness?");
    setQuestion("What direction should I take?");
    setMessage("Hello through the quantum channel");
  };

  const renderApiInterface = () => {
    switch (selectedApi) {
      case 'srs':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">3-SAT Clauses</Label>
              <div className="space-y-2">
                {clauses.map((clause, clauseIndex) => (
                  <div key={clauseIndex} className="flex gap-2 items-center">
                    <span className="text-xs text-muted-foreground w-6">({clauseIndex + 1})</span>
                    {clause.map((literal, literalIndex) => (
                      <Input
                        key={literalIndex}
                        value={literal}
                        onChange={(e) => {
                          const newClauses = [...clauses];
                          newClauses[clauseIndex][literalIndex] = e.target.value;
                          setClauses(newClauses);
                        }}
                        placeholder={`x${literalIndex + 1}`}
                        className="flex-1"
                      />
                    ))}
                    {clauses.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setClauses(clauses.filter((_, i) => i !== clauseIndex))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={() => setClauses([...clauses, ["", "", ""]])}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Clause
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Max Iterations</Label>
              <Input
                type="number"
                value={maxIterations}
                onChange={(e) => setMaxIterations(parseInt(e.target.value) || 5000)}
              />
            </div>
          </div>
        );

      case 'hqe':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Prime Eigenstates</Label>
              <Input
                value={primes.join(', ')}
                onChange={(e) => setPrimes(e.target.value.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p)))}
                placeholder="2, 3, 5, 7, 11"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Evolution Steps</Label>
              <Input
                type="number"
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value) || 256)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Entropy Dissipation (λ)</Label>
              <Input
                value={lambda}
                onChange={(e) => setLambda(e.target.value)}
                placeholder="0.02"
              />
            </div>
          </div>
        );

      case 'qsem':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Concepts to Encode</Label>
              <div className="space-y-2">
                {concepts.map((concept, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={concept}
                      onChange={(e) => {
                        const newConcepts = [...concepts];
                        newConcepts[index] = e.target.value;
                        setConcepts(newConcepts);
                      }}
                      placeholder="concept"
                    />
                    {concepts.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConcepts(concepts.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={() => setConcepts([...concepts, ""])}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Concept
                </Button>
              </div>
            </div>
          </div>
        );

      case 'nlc':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Channel Primes</Label>
              <Input
                value={nlcPrimes.join(', ')}
                onChange={(e) => setNlcPrimes(e.target.value.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p)))}
                placeholder="2, 3, 5"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Test Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message to transmit"
              />
            </div>
          </div>
        );

      case 'qcr':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Cognitive Modes</Label>
              <Select value={modes.join(',')} onValueChange={(value) => setModes(value.split(','))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select modes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analytical,creative,ethical">Analytical + Creative + Ethical</SelectItem>
                  <SelectItem value="analytical,pragmatic">Analytical + Pragmatic</SelectItem>
                  <SelectItem value="creative,emotional">Creative + Emotional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Prompt</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your consciousness query"
              />
            </div>
          </div>
        );

      case 'iching':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Oracle Question</Label>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What question do you seek guidance on?"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Evolution Steps</Label>
              <Input
                type="number"
                value={ichingSteps}
                onChange={(e) => setIchingSteps(parseInt(e.target.value) || 7)}
                min="1"
                max="21"
              />
            </div>
          </div>
        );

      case 'unified':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Observer Entropy Reduction Rate (bits/sec)</Label>
              <Input
                value={entropyRate}
                onChange={(e) => setEntropyRate(e.target.value)}
                placeholder="12.4"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Region Entropy Gradient (bits/m³)</Label>
              <Input
                value={gradient}
                onChange={(e) => setGradient(e.target.value)}
                placeholder="0.002"
              />
            </div>
          </div>
        );

      default:
        return <div>API interface not implemented</div>;
    }
  };

  const currentApi = apiConfigs[selectedApi as keyof typeof apiConfigs];
  const IconComponent = currentApi?.icon || Atom;

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Atom className="h-10 w-10 text-api-secondary" />
              Nomyx Resonance API Playground
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore and test all 7 resonance-based APIs in our interactive playground. 
              Experience the power of cutting-edge quantum and symbolic technologies.
            </p>
          </div>

          <Alert className="mb-8">
            <Calculator className="h-4 w-4" />
            <AlertDescription>
              This is a demonstration playground with simulated responses. In production, you'll need a valid API key and the actual service endpoints.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* API Selection & Input */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6" />
                      API Selection
                    </div>
                    <Button variant="outline" size="sm" onClick={resetForm}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Choose API</Label>
                    <Select value={selectedApi} onValueChange={setSelectedApi}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an API" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(apiConfigs).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <config.icon className="h-4 w-4" />
                              <span>{config.name}</span>
                              <Badge variant="outline" className="ml-auto">
                                {config.status}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {currentApi && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">{currentApi.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        <strong>Endpoint:</strong> {currentApi.endpoint}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderApiInterface()}

                  <div>
                    <Label className="text-sm font-medium mb-2 block">API Key</Label>
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="ak_your_nomyx_api_key_here"
                    />
                  </div>

                  <Button 
                    onClick={handleApiTest} 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Test {currentApi?.name}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Response & Code */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    API Response
                    {response && (
                      <div className="flex gap-2">
                        <Badge className="bg-green-500/10 text-green-600">
                          Success
                        </Badge>
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {response ? (
                    <Tabs defaultValue="response" className="space-y-4">
                      <TabsList>
                        <TabsTrigger value="response">Response</TabsTrigger>
                        <TabsTrigger value="code">Code Example</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="response">
                        <div className="bg-muted rounded-lg p-4">
                          <CodeBlock language="json" code={response} />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="code">
                        <CodeBlock
                          language="javascript"
                          code={`// JavaScript example for ${currentApi?.name}
fetch('https://api.nomyx.dev${currentApi?.endpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': '${apiKey}'
  },
  body: JSON.stringify({
    // Your request parameters here
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
                        />
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <IconComponent className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Select an API and configure parameters to see the response!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* API Info */}
              {currentApi && (
                <Card>
                  <CardHeader>
                    <CardTitle>About {currentApi.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong>Status:</strong> <Badge variant="outline">{currentApi.status}</Badge>
                      </div>
                      <div>
                        <strong>Endpoint:</strong> <code className="text-xs bg-muted px-1 py-0.5 rounded">{currentApi.endpoint}</code>
                      </div>
                      <div>
                        <strong>Description:</strong> {currentApi.description}
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground">
                          This playground provides simulated responses for testing and exploration. 
                          Real API responses will include additional telemetry and metrics data.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Playground;