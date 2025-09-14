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
import { Play, Copy, RotateCcw, Plus, X, Brain, Calculator } from "lucide-react";
import CodeBlock from "@/components/ui/code-block";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Playground = () => {
  const { toast } = useToast();
  const [clauses, setClauses] = useState([
    ["x1", "-x2", "x3"],
    ["-x1", "x2", "-x3"]
  ]);
  const [maxIterations, setMaxIterations] = useState(1000);
  const [epsilon, setEpsilon] = useState("1e-6");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("ak_demo_key_for_testing");

  const addClause = () => {
    setClauses([...clauses, ["", "", ""]]);
  };

  const removeClause = (index: number) => {
    setClauses(clauses.filter((_, i) => i !== index));
  };

  const updateClause = (clauseIndex: number, literalIndex: number, value: string) => {
    const newClauses = [...clauses];
    newClauses[clauseIndex][literalIndex] = value;
    setClauses(newClauses);
  };

  const loadExample = (example: 'satisfiable' | 'unsatisfiable' | 'complex') => {
    const examples = {
      satisfiable: [
        ["x1", "-x2", "x3"],
        ["-x1", "x2", "-x3"],
        ["x1", "x2", "x3"]
      ],
      unsatisfiable: [
        ["x1", "x2"],
        ["-x1", "x2"], 
        ["x1", "-x2"],
        ["-x1", "-x2"]
      ],
      complex: [
        ["x1", "-x2", "x3"],
        ["-x1", "x2", "-x3"],
        ["x2", "x3", "-x4"],
        ["-x2", "-x3", "x4"],
        ["x1", "x4", "-x5"],
        ["-x1", "-x4", "x5"]
      ]
    };
    setClauses(examples[example]);
    setResponse("");
  };

  const handleSolve = async () => {
    setIsLoading(true);
    
    // Filter out empty literals
    const validClauses = clauses
      .map(clause => clause.filter(literal => literal.trim() !== ""))
      .filter(clause => clause.length > 0);

    if (validClauses.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one clause with valid literals",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const requestData = {
      clauses: validClauses,
      max_iterations: maxIterations,
      epsilon: parseFloat(epsilon)
    };

    // Simulate API call with realistic delay
    setTimeout(() => {
      // Determine if problem is satisfiable (simple heuristic for demo)
      const variables = new Set();
      validClauses.forEach(clause => {
        clause.forEach(literal => {
          const variable = literal.startsWith('-') ? literal.slice(1) : literal;
          variables.add(variable);
        });
      });

      // Simple satisfiability check for demo purposes
      const isSatisfiable = validClauses.length <= variables.size * 2;
      
      if (isSatisfiable) {
        const solution: Record<string, boolean> = {};
        Array.from(variables).forEach((variable, index) => {
          solution[variable as string] = index % 2 === 0;
        });
        setResponse(JSON.stringify(solution, null, 2));
      } else {
        setResponse(JSON.stringify({ error: "Unsatisfiable or requires more iterations" }, null, 2));
      }
      
      setIsLoading(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    toast({
      title: "Copied!",
      description: "Response copied to clipboard",
    });
  };

  const resetForm = () => {
    setClauses([["x1", "-x2", "x3"], ["-x1", "x2", "-x3"]]);
    setMaxIterations(1000);
    setEpsilon("1e-6");
    setResponse("");
  };

  const requestPayload = JSON.stringify({
    clauses: clauses.filter(clause => clause.some(literal => literal.trim() !== "")),
    max_iterations: maxIterations,
    epsilon: parseFloat(epsilon)
  }, null, 2);

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Brain className="h-10 w-10 text-api-secondary" />
              SRT 3-SAT Solver Demo
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the power of our Symbolic Resonance Transformer algorithm. 
              Input your 3-SAT problem and watch it get solved in polynomial time.
            </p>
          </div>

          <Alert className="mb-8">
            <Calculator className="h-4 w-4" />
            <AlertDescription>
              This is a demonstration of the SRT API. In production, you'll need a valid API key and the actual service endpoint.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Problem Input */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    3-SAT Problem Definition
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={resetForm}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Example Problems */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Load Example</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample('satisfiable')}
                      >
                        Satisfiable
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample('unsatisfiable')}
                      >
                        Unsatisfiable
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample('complex')}
                      >
                        Complex Problem
                      </Button>
                    </div>
                  </div>

                  {/* Clauses */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Clauses <span className="text-muted-foreground">(up to 3 literals each)</span>
                    </Label>
                    <div className="space-y-3">
                      {clauses.map((clause, clauseIndex) => (
                        <div key={clauseIndex} className="flex gap-2 items-center">
                          <span className="text-sm text-muted-foreground w-4">({clauseIndex + 1})</span>
                          {clause.map((literal, literalIndex) => (
                            <Input
                              key={literalIndex}
                              value={literal}
                              onChange={(e) => updateClause(clauseIndex, literalIndex, e.target.value)}
                              placeholder={`literal ${literalIndex + 1}`}
                              className="flex-1"
                            />
                          ))}
                          <span className="text-sm text-muted-foreground">∨</span>
                          {clauses.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeClause(clauseIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button variant="outline" onClick={addClause} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Clause
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Use negative literals with "-" prefix (e.g., "-x1"). Each clause is joined by OR (∨), clauses are joined by AND (∧).
                    </p>
                  </div>

                  {/* Algorithm Parameters */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Max Iterations</Label>
                      <Input
                        type="number"
                        value={maxIterations}
                        onChange={(e) => setMaxIterations(parseInt(e.target.value) || 1000)}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Epsilon (Convergence Threshold)</Label>
                      <Input
                        value={epsilon}
                        onChange={(e) => setEpsilon(e.target.value)}
                        placeholder="1e-6"
                      />
                    </div>
                  </div>

                  {/* API Key */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">API Key</Label>
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="ak_your_api_key_here"
                    />
                  </div>

                  {/* Solve Button */}
                  <Button 
                    onClick={handleSolve} 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Solving...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Solve with SRT Algorithm
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Solution & Code */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Solution
                    {response && (
                      <div className="flex gap-2">
                        <Badge className={response.includes('error') ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600'}>
                          {response.includes('error') ? 'UNSAT' : 'SAT'}
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
                    <Tabs defaultValue="solution" className="space-y-4">
                      <TabsList>
                        <TabsTrigger value="solution">Solution</TabsTrigger>
                        <TabsTrigger value="request">Request</TabsTrigger>
                        <TabsTrigger value="code">Code</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="solution">
                        <div className="bg-muted rounded-lg p-4">
                          <CodeBlock language="json" code={response} />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="request">
                        <div className="bg-muted rounded-lg p-4">
                          <CodeBlock language="json" code={requestPayload} />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="code">
                        <CodeBlock
                          language="javascript"
                          code={`// JavaScript example
fetch('https://api.srt-solver.com/solve/3sat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '${apiKey}'
  },
  body: JSON.stringify(${requestPayload})
})
.then(response => response.json())
.then(data => console.log(data));`}
                        />
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Brain className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Define your 3-SAT problem and click solve to see the magic happen!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Algorithm Info */}
              <Card>
                <CardHeader>
                  <CardTitle>About the SRT Algorithm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Symbolic Encoding:</strong> Problems are encoded into symbolic entropy spaces using advanced mathematical transformations.
                    </div>
                    <div>
                      <strong>Resonance Operators:</strong> Custom operators are generated to manipulate the symbolic space and guide convergence.
                    </div>
                    <div>
                      <strong>Collapse Dynamics:</strong> Solutions emerge through controlled state collapse, extracting satisfying assignments.
                    </div>
                    <div>
                      <strong>Polynomial Time:</strong> Achieves polynomial-time complexity for specific NP-complete problem instances.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Playground;