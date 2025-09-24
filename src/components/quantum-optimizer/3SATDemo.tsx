import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  GitBranch, 
  Zap, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Target,
  Info,
  Binary,
  CircuitBoard,
  Calculator,
  Lightbulb
} from 'lucide-react';

interface Variable {
  id: number;
  name: string;
  value: boolean | null;
  locked: boolean;
}

interface Clause {
  id: number;
  literals: Array<{
    variable: number;
    negated: boolean;
  }>;
  satisfied: boolean;
  highlighted: boolean;
}

interface SATSolution {
  assignment: boolean[];
  satisfiedClauses: number;
  totalClauses: number;
  isSatisfiable: boolean;
}

interface SATExample {
  name: string;
  description: string;
  context: string;
  variables: string[];
  clauses: Array<{
    literals: Array<{
      variable: number;
      negated: boolean;
    }>;
  }>;
  expectedSat: boolean;
}

interface ThreeSATDemoProps {
  onSolve?: (solution: SATSolution) => void;
  onProgress?: (progress: number) => void;
}

export const ThreeSATDemo: React.FC<ThreeSATDemoProps> = ({
  onSolve,
  onProgress
}) => {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [solution, setSolution] = useState<SATSolution | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMethod, setSearchMethod] = useState<'quantum' | 'classical'>('quantum');
  const [problemSize, setProblemSize] = useState([8]);
  const [selectedExample, setSelectedExample] = useState<string>('random');
  const [searchProgress, setSearchProgress] = useState(0);
  const [currentAssignment, setCurrentAssignment] = useState<(boolean | null)[]>([]);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Logic circuit examples
  const satExamples: SATExample[] = [
    {
      name: 'Circuit Verification',
      description: 'Verify if a digital circuit can produce the desired output',
      context: 'Hardware verification: Check if circuit logic is satisfiable',
      variables: ['A', 'B', 'C', 'D'],
      clauses: [
        { literals: [{ variable: 0, negated: false }, { variable: 1, negated: false }, { variable: 2, negated: true }] },
        { literals: [{ variable: 1, negated: true }, { variable: 2, negated: false }, { variable: 3, negated: false }] },
        { literals: [{ variable: 0, negated: true }, { variable: 3, negated: true }, { variable: 2, negated: false }] },
        { literals: [{ variable: 0, negated: false }, { variable: 1, negated: true }, { variable: 3, negated: true }] }
      ],
      expectedSat: true
    },
    {
      name: 'AI Planning',
      description: 'Find a sequence of actions that achieves the goal state',
      context: 'Automated planning: Robot navigation constraints',
      variables: ['Move1', 'Move2', 'Move3', 'AtGoal', 'HasKey'],
      clauses: [
        { literals: [{ variable: 0, negated: false }, { variable: 1, negated: false }, { variable: 2, negated: false }] },
        { literals: [{ variable: 3, negated: false }, { variable: 0, negated: true }, { variable: 4, negated: false }] },
        { literals: [{ variable: 4, negated: false }, { variable: 1, negated: false }, { variable: 2, negated: true }] },
        { literals: [{ variable: 3, negated: true }, { variable: 1, negated: true }, { variable: 4, negated: true }] },
        { literals: [{ variable: 0, negated: false }, { variable: 2, negated: false }, { variable: 3, negated: false }] }
      ],
      expectedSat: true
    },
    {
      name: 'Cryptographic Protocol',
      description: 'Verify security properties of a cryptographic protocol',
      context: 'Security verification: Protocol satisfiability analysis',
      variables: ['Auth', 'Encrypt', 'KeyExch', 'Secure'],
      clauses: [
        { literals: [{ variable: 0, negated: false }, { variable: 1, negated: false }, { variable: 3, negated: false }] },
        { literals: [{ variable: 2, negated: false }, { variable: 1, negated: true }, { variable: 3, negated: false }] },
        { literals: [{ variable: 0, negated: true }, { variable: 2, negated: false }, { variable: 1, negated: false }] },
        { literals: [{ variable: 3, negated: true }, { variable: 0, negated: false }, { variable: 2, negated: true }] }
      ],
      expectedSat: false
    }
  ];

  // Generate random 3-SAT problem
  const generateRandomSAT = (numVars: number, numClauses?: number): void => {
    const clauseCount = numClauses || Math.floor(numVars * 4.2); // Ratio near satisfiability threshold
    
    const newVariables: Variable[] = [];
    for (let i = 0; i < numVars; i++) {
      newVariables.push({
        id: i,
        name: `x${i + 1}`,
        value: null,
        locked: false
      });
    }
    
    const newClauses: Clause[] = [];
    for (let i = 0; i < clauseCount; i++) {
      const literals: Array<{ variable: number; negated: boolean }> = [];
      const selectedVars = new Set<number>();
      
      // Generate exactly 3 literals per clause
      while (literals.length < 3) {
        const varId = Math.floor(Math.random() * numVars);
        if (!selectedVars.has(varId)) {
          selectedVars.add(varId);
          literals.push({
            variable: varId,
            negated: Math.random() < 0.5
          });
        }
      }
      
      newClauses.push({
        id: i,
        literals,
        satisfied: false,
        highlighted: false
      });
    }
    
    setVariables(newVariables);
    setClauses(newClauses);
    setCurrentAssignment(new Array(numVars).fill(null));
    setSolution(null);
  };

  // Load example SAT problem
  const loadExample = (example: SATExample): void => {
    const newVariables: Variable[] = example.variables.map((name, index) => ({
      id: index,
      name,
      value: null,
      locked: false
    }));
    
    const newClauses: Clause[] = example.clauses.map((clauseData, index) => ({
      id: index,
      literals: clauseData.literals,
      satisfied: false,
      highlighted: false
    }));
    
    setVariables(newVariables);
    setClauses(newClauses);
    setCurrentAssignment(new Array(example.variables.length).fill(null));
    setSolution(null);
  };

  // Evaluate if a clause is satisfied by current assignment
  const evaluateClause = (clause: Clause, assignment: (boolean | null)[]): boolean => {
    return clause.literals.some(literal => {
      const varValue = assignment[literal.variable];
      if (varValue === null) return false;
      return literal.negated ? !varValue : varValue;
    });
  };

  // Evaluate all clauses
  const evaluateAssignment = (assignment: (boolean | null)[]): { satisfied: number; total: number } => {
    let satisfied = 0;
    const total = clauses.length;
    
    clauses.forEach(clause => {
      if (evaluateClause(clause, assignment)) {
        satisfied++;
      }
    });
    
    return { satisfied, total };
  };

  // Update clause satisfaction status
  const updateClauseSatisfaction = useCallback((assignment: (boolean | null)[]) => {
    setClauses(prevClauses => 
      prevClauses.map(clause => ({
        ...clause,
        satisfied: evaluateClause(clause, assignment)
      }))
    );
  }, []);

  // Simulate SAT solving
  const simulateSATSolving = useCallback(() => {
    if (!isSearching || variables.length === 0) return;

    const maxIterations = searchMethod === 'quantum' ? 100 : 500;
    let iteration = 0;
    const assignment = [...currentAssignment];

    const searchStep = () => {
      if (!isSearching || iteration >= maxIterations) {
        // Try to find a satisfying assignment
        const finalAssignment = variables.map(() => Math.random() < 0.5);
        const evaluation = evaluateAssignment(finalAssignment);
        
        const isSatisfiable = evaluation.satisfied === evaluation.total;
        
        const finalSolution: SATSolution = {
          assignment: finalAssignment,
          satisfiedClauses: evaluation.satisfied,
          totalClauses: evaluation.total,
          isSatisfiable
        };
        
        setSolution(finalSolution);
        setCurrentAssignment(finalAssignment);
        updateClauseSatisfaction(finalAssignment);
        setIsSearching(false);
        setSearchProgress(100);
        onSolve?.(finalSolution);
        return;
      }

      iteration++;
      const progress = (iteration / maxIterations) * 100;
      setSearchProgress(progress);
      onProgress?.(progress);

      // Simulate trying different assignments
      if (iteration % 10 === 0) {
        const newAssignment = variables.map((_, i) => {
          if (Math.random() < 0.3) {
            return Math.random() < 0.5;
          }
          return assignment[i];
        });
        
        setCurrentAssignment(newAssignment);
        updateClauseSatisfaction(newAssignment);
        
        // Highlight clauses being evaluated
        setClauses(prevClauses => 
          prevClauses.map(clause => ({
            ...clause,
            highlighted: Math.random() < 0.2
          }))
        );
      }

      const delay = searchMethod === 'quantum' ? 50 : 20;
      searchTimeoutRef.current = setTimeout(searchStep, delay);
    };

    searchStep();
  }, [isSearching, variables, searchMethod, currentAssignment, onSolve, onProgress, updateClauseSatisfaction]);

  // Control functions
  const startSearch = () => {
    if (variables.length === 0) return;
    setIsSearching(true);
    setSearchProgress(0);
    setSolution(null);
    setCurrentAssignment(new Array(variables.length).fill(null));
  };

  const stopSearch = () => {
    setIsSearching(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  const resetProblem = () => {
    stopSearch();
    setSearchProgress(0);
    setSolution(null);
    
    if (selectedExample === 'random') {
      generateRandomSAT(problemSize[0]);
    } else {
      const example = satExamples.find(ex => ex.name === selectedExample);
      if (example) {
        loadExample(example);
      }
    }
  };

  const toggleVariable = (index: number) => {
    if (isSearching) return;
    
    const newAssignment = [...currentAssignment];
    newAssignment[index] = newAssignment[index] === null ? true : 
                          newAssignment[index] === true ? false : null;
    
    setCurrentAssignment(newAssignment);
    updateClauseSatisfaction(newAssignment);
  };

  const handleExampleChange = (exampleName: string) => {
    setSelectedExample(exampleName);
    stopSearch();
    setSolution(null);
    
    if (exampleName === 'random') {
      generateRandomSAT(problemSize[0]);
    } else {
      const example = satExamples.find(ex => ex.name === exampleName);
      if (example) {
        loadExample(example);
      }
    }
  };

  // Effects
  useEffect(() => {
    simulateSATSolving();
  }, [simulateSATSolving]);

  useEffect(() => {
    generateRandomSAT(problemSize[0]);
  }, []);

  useEffect(() => {
    if (selectedExample === 'random') {
      generateRandomSAT(problemSize[0]);
    }
  }, [problemSize, selectedExample]);

  // Render clause as logical expression
  const renderClause = (clause: Clause) => {
    return (
      <div className={`
        p-3 rounded border text-sm font-mono transition-all
        ${clause.satisfied ? 'border-green-500 bg-green-500/20' : 'border-gray-600 bg-gray-800'}
        ${clause.highlighted ? 'ring-2 ring-blue-500' : ''}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {clause.literals.map((literal, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-400">∨</span>}
                <span className={`
                  ${literal.negated ? 'text-red-400' : 'text-blue-400'}
                  ${currentAssignment[literal.variable] !== null ? 'font-bold' : ''}
                `}>
                  {literal.negated ? '¬' : ''}{variables[literal.variable]?.name || `x${literal.variable + 1}`}
                </span>
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {clause.satisfied ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>
      </div>
    );
  };

  const evaluation = evaluateAssignment(currentAssignment);
  const satisfactionRate = evaluation.total > 0 ? (evaluation.satisfied / evaluation.total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                3-SAT Boolean Satisfiability
              </CardTitle>
              <CardDescription>
                Find truth assignments that satisfy all logical clauses
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isSearching ? "secondary" : "default"}
                size="sm"
                onClick={isSearching ? stopSearch : startSearch}
                className="flex items-center gap-2"
                disabled={variables.length === 0}
              >
                {isSearching ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isSearching ? 'Stop' : 'Solve SAT'}
              </Button>
              <Button variant="outline" size="sm" onClick={resetProblem}>
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Problem Configuration */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Problem Type</label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={selectedExample === 'random' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleExampleChange('random')}
                    disabled={isSearching}
                  >
                    Random 3-SAT
                  </Button>
                  {satExamples.map((example) => (
                    <Button
                      key={example.name}
                      variant={selectedExample === example.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleExampleChange(example.name)}
                      disabled={isSearching}
                      className="text-left justify-start"
                    >
                      <CircuitBoard className="w-4 h-4 mr-2" />
                      {example.name}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedExample === 'random' && (
                <div>
                  <label className="text-sm font-medium">Variables: {problemSize[0]}</label>
                  <Slider
                    value={problemSize}
                    onValueChange={setProblemSize}
                    max={12}
                    min={4}
                    step={1}
                    className="mt-2"
                    disabled={isSearching}
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Clauses: ~{Math.floor(problemSize[0] * 4.2)}
                  </div>
                </div>
              )}
            </div>

            {/* Search Options & Progress */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={searchMethod === 'quantum' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchMethod('quantum')}
                    disabled={isSearching}
                    className="flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Quantum SRS
                  </Button>
                  <Button
                    variant={searchMethod === 'classical' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchMethod('classical')}
                    disabled={isSearching}
                    className="flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    DPLL Algorithm
                  </Button>
                </div>
              </div>

              {/* Satisfaction Status */}
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Satisfaction Rate</span>
                  <span className={`text-sm font-mono ${
                    satisfactionRate === 100 ? 'text-green-400' : 
                    satisfactionRate > 80 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {satisfactionRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={satisfactionRate} className="mb-2" />
                <div className="text-xs text-gray-400">
                  {evaluation.satisfied} / {evaluation.total} clauses satisfied
                </div>
              </div>

              {isSearching && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Search Progress</span>
                    <span>{searchProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={searchProgress} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Variables */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Binary className="w-4 h-4" />
                Variables
              </CardTitle>
              <CardDescription>
                Click to set truth values (True/False/Unset)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {variables.map((variable, index) => {
                  const value = currentAssignment[index];
                  return (
                    <button
                      key={variable.id}
                      onClick={() => toggleVariable(index)}
                      disabled={isSearching}
                      className={`
                        w-full p-3 rounded border text-left transition-all
                        ${value === true ? 'border-green-500 bg-green-500/20 text-green-300' :
                          value === false ? 'border-red-500 bg-red-500/20 text-red-300' :
                          'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'}
                        ${isSearching ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold">{variable.name}</span>
                        <span className="text-sm">
                          {value === true ? 'TRUE' : value === false ? 'FALSE' : 'UNSET'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clauses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Logical Clauses
              </CardTitle>
              <CardDescription>
                Each clause must be satisfied (at least one literal true)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {clauses.map((clause) => (
                  <div key={clause.id}>
                    {renderClause(clause)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results & Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solution Result */}
        {solution && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {solution.isSatisfiable ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                {solution.isSatisfiable ? 'SATISFIABLE' : 'UNSATISFIABLE'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-mono text-blue-400">
                    {solution.satisfiedClauses}
                  </div>
                  <div className="text-sm text-gray-400">Satisfied</div>
                </div>
                <div>
                  <div className="text-2xl font-mono text-purple-400">
                    {solution.totalClauses}
                  </div>
                  <div className="text-sm text-gray-400">Total</div>
                </div>
              </div>

              {solution.isSatisfiable && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Satisfying Assignment:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {variables.map((variable, index) => (
                      <div key={variable.id} className="flex justify-between text-sm font-mono">
                        <span>{variable.name}:</span>
                        <span className={solution.assignment[index] ? 'text-green-400' : 'text-red-400'}>
                          {solution.assignment[index] ? 'TRUE' : 'FALSE'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              About 3-SAT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-400">
            <p>
              3-SAT is the prototypical NP-complete problem. It asks whether a Boolean 
              formula in conjunctive normal form with exactly 3 literals per clause 
              can be satisfied.
            </p>
            <p>
              This problem is fundamental to computational complexity theory and has 
              applications in circuit design, AI planning, and formal verification.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <CircuitBoard className="w-3 h-3" />
                <span>Circuit verification and design</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <Lightbulb className="w-3 h-3" />
                <span>AI planning and scheduling</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <Binary className="w-3 h-3" />
                <span>Software verification</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Context Information */}
        {selectedExample !== 'random' && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Application Context
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-400">
              <p>
                {satExamples.find(ex => ex.name === selectedExample)?.context}
              </p>
              <div className="mt-3 p-3 bg-gray-800/50 rounded">
                <div className="font-medium text-gray-300 mb-1">Problem Description:</div>
                <p>{satExamples.find(ex => ex.name === selectedExample)?.description}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ThreeSATDemo;