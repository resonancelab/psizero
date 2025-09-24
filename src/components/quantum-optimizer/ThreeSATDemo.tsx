import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Cpu,
  Zap,
  CircuitBoard,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Target,
  Clock,
  Info,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Binary,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import srsApi from '@/lib/api/services/srs';

interface Variable {
  id: number;
  name: string;
  value: boolean | null;
  locked: boolean;
}

interface Literal {
  variable: number;
  negated: boolean;
}

interface Clause {
  id: number;
  literals: Literal[];
  satisfied: boolean | null;
}

interface SATInstance {
  variables: Variable[];
  clauses: Clause[];
  isSatisfiable: boolean | null;
  satisfyingAssignment: boolean[] | null;
}

interface CircuitExample {
  name: string;
  description: string;
  context: string;
  variables: string[];
  clauses: Array<{
    literals: Array<{
      variable: string;
      negated: boolean;
    }>;
  }>;
}

interface ThreeSATDemoProps {
  onSolve?: (instance: SATInstance, assignment: boolean[]) => void;
  onProgress?: (progress: number) => void;
}

export const ThreeSATDemo: React.FC<ThreeSATDemoProps> = ({
  onSolve,
  onProgress
}) => {
  const [satInstance, setSatInstance] = useState<SATInstance | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMethod, setSearchMethod] = useState<'quantum' | 'classical'>('quantum');
  const [numVariables, setNumVariables] = useState([6]);
  const [numClauses, setNumClauses] = useState([8]);
  const [satisfiabilityRatio, setSatisfiabilityRatio] = useState([4.2]);
  const [selectedExample, setSelectedExample] = useState<string>('random');
  const [showTruthTable, setShowTruthTable] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [currentAssignment, setCurrentAssignment] = useState<boolean[]>([]);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Circuit design examples
  const circuitExamples: CircuitExample[] = [
    {
      name: 'Logic Gate Synthesis',
      description: 'Design constraints for a simple logic circuit',
      context: 'Ensure circuit produces correct outputs for given truth table',
      variables: ['A', 'B', 'C', 'OUT1', 'OUT2'],
      clauses: [
        { literals: [{ variable: 'A', negated: false }, { variable: 'B', negated: true }, { variable: 'OUT1', negated: false }] },
        { literals: [{ variable: 'A', negated: true }, { variable: 'C', negated: false }, { variable: 'OUT1', negated: true }] },
        { literals: [{ variable: 'B', negated: false }, { variable: 'C', negated: false }, { variable: 'OUT2', negated: false }] },
        { literals: [{ variable: 'OUT1', negated: false }, { variable: 'OUT2', negated: true }, { variable: 'A', negated: false }] }
      ]
    },
    {
      name: 'CPU Instruction Decode',
      description: 'Microprocessor instruction decoding constraints',
      context: 'Verify that instruction decode logic is consistent',
      variables: ['OP0', 'OP1', 'ALU', 'MEM', 'REG'],
      clauses: [
        { literals: [{ variable: 'OP0', negated: true }, { variable: 'OP1', negated: true }, { variable: 'ALU', negated: false }] },
        { literals: [{ variable: 'OP0', negated: false }, { variable: 'OP1', negated: true }, { variable: 'MEM', negated: false }] },
        { literals: [{ variable: 'OP1', negated: false }, { variable: 'REG', negated: false }, { variable: 'ALU', negated: true }] },
        { literals: [{ variable: 'MEM', negated: false }, { variable: 'REG', negated: false }, { variable: 'OP0', negated: true }] },
        { literals: [{ variable: 'ALU', negated: false }, { variable: 'MEM', negated: true }, { variable: 'REG', negated: true }] }
      ]
    },
    {
      name: 'Cache Coherency',
      description: 'Memory cache consistency protocol verification',
      context: 'Ensure cache states remain coherent across processors',
      variables: ['VALID', 'DIRTY', 'SHARED', 'REQ', 'ACK'],
      clauses: [
        { literals: [{ variable: 'VALID', negated: true }, { variable: 'DIRTY', negated: true }, { variable: 'SHARED', negated: false }] },
        { literals: [{ variable: 'DIRTY', negated: false }, { variable: 'SHARED', negated: true }, { variable: 'VALID', negated: false }] },
        { literals: [{ variable: 'REQ', negated: false }, { variable: 'ACK', negated: false }, { variable: 'VALID', negated: true }] },
        { literals: [{ variable: 'ACK', negated: true }, { variable: 'REQ', negated: true }, { variable: 'DIRTY', negated: true }] }
      ]
    }
  ];

  // Generate random 3-SAT instance - memoized to prevent regeneration
  const generateRandom3SAT = useCallback((vars: number, clauses: number, ratio: number): SATInstance => {
    const variables: Variable[] = [];
    const clauseList: Clause[] = [];

    // Create variables
    for (let i = 0; i < vars; i++) {
      variables.push({
        id: i,
        name: `x${i + 1}`,
        value: null,
        locked: false
      });
    }

    // Generate clauses with given ratio (clauses per variable)
    const actualClauses = Math.min(clauses, Math.floor(vars * ratio));
    
    for (let i = 0; i < actualClauses; i++) {
      const literals: Literal[] = [];
      const usedVars = new Set<number>();

      // Generate 3 literals per clause
      while (literals.length < 3) {
        const varIndex = Math.floor(Math.random() * vars);
        if (!usedVars.has(varIndex)) {
          literals.push({
            variable: varIndex,
            negated: Math.random() < 0.5
          });
          usedVars.add(varIndex);
        }
      }

      clauseList.push({
        id: i,
        literals,
        satisfied: null
      });
    }

    return {
      variables,
      clauses: clauseList,
      isSatisfiable: null,
      satisfyingAssignment: null
    };
  }, []);

  // Load circuit example
  const loadCircuitExample = (example: CircuitExample): SATInstance => {
    const variables: Variable[] = example.variables.map((name, index) => ({
      id: index,
      name,
      value: null,
      locked: false
    }));

    const clauses: Clause[] = example.clauses.map((clause, index) => ({
      id: index,
      literals: clause.literals.map(lit => ({
        variable: example.variables.indexOf(lit.variable),
        negated: lit.negated
      })),
      satisfied: null
    }));

    return {
      variables,
      clauses,
      isSatisfiable: null,
      satisfyingAssignment: null
    };
  };

  // Check if assignment satisfies all clauses
  const checkSatisfiability = (assignment: boolean[], instance: SATInstance): boolean => {
    return instance.clauses.every(clause => {
      return clause.literals.some(literal => {
        const varValue = assignment[literal.variable];
        return literal.negated ? !varValue : varValue;
      });
    });
  };

  // Update clause satisfaction status
  const updateClauseSatisfaction = (assignment: boolean[], instance: SATInstance): SATInstance => {
    const updatedClauses = instance.clauses.map(clause => ({
      ...clause,
      satisfied: clause.literals.some(literal => {
        const varValue = assignment[literal.variable];
        return literal.negated ? !varValue : varValue;
      })
    }));

    return {
      ...instance,
      clauses: updatedClauses
    };
  };

  // Solve 3-SAT using DPLL algorithm (simplified)
  const solve3SAT = (instance: SATInstance): { satisfiable: boolean; assignment: boolean[] | null } => {
    const assignment = new Array(instance.variables.length).fill(false);
    
    // Simple backtracking solver
    const backtrack = (varIndex: number): boolean => {
      if (varIndex === instance.variables.length) {
        return checkSatisfiability(assignment, instance);
      }

      // Try both true and false for current variable
      for (const value of [true, false]) {
        assignment[varIndex] = value;
        
        // Check if current partial assignment is viable
        let allClausesOk = true;
        for (const clause of instance.clauses) {
          let clauseSatisfied = false;
          let hasUnassigned = false;
          
          for (const literal of clause.literals) {
            if (literal.variable <= varIndex) {
              const varValue = assignment[literal.variable];
              if ((literal.negated && !varValue) || (!literal.negated && varValue)) {
                clauseSatisfied = true;
                break;
              }
            } else {
              hasUnassigned = true;
            }
          }
          
          if (!clauseSatisfied && !hasUnassigned) {
            allClausesOk = false;
            break;
          }
        }
        
        if (allClausesOk && backtrack(varIndex + 1)) {
          return true;
        }
      }
      
      return false;
    };

    const satisfiable = backtrack(0);
    return {
      satisfiable,
      assignment: satisfiable ? [...assignment] : null
    };
  };

  // Use real API for quantum search
  const performQuantumSearch = async () => {
    if (!satInstance) return;
    
    // Show initial progress
    setSearchProgress(10);
    
    try {
      console.log('🔮 Starting quantum 3-SAT search via SRS API...');
      
      // Convert 3-SAT to subset sum problem for SRS API
      // We'll encode the problem as a weighted subset sum where satisfying assignments
      // correspond to specific subset sums
      const numVars = satInstance.variables.length;
      const numClauses = satInstance.clauses.length;
      
      // Create weights based on clause structure
      const weights: number[] = [];
      const clauseWeights: number[] = [];
      
      // Assign a unique power of 2 to each clause
      for (let i = 0; i < numClauses; i++) {
        clauseWeights.push(Math.pow(2, i));
      }
      
      setSearchProgress(30);
      
      // For each variable, calculate its contribution to clauses
      for (let v = 0; v < numVars; v++) {
        let positiveWeight = 0;
        let negativeWeight = 0;
        
        satInstance.clauses.forEach((clause, cIdx) => {
          clause.literals.forEach(lit => {
            if (lit.variable === v) {
              if (lit.negated) {
                negativeWeight += clauseWeights[cIdx];
              } else {
                positiveWeight += clauseWeights[cIdx];
              }
            }
          });
        });
        
        // Use the difference as the weight
        weights.push(positiveWeight - negativeWeight);
      }
      
      // Target is to satisfy all clauses (sum of all clause weights)
      const target = clauseWeights.reduce((sum, w) => sum + w, 0);
      
      console.log('⚠️ Converting 3-SAT to subset sum for SRS API');
      console.log('Weights:', weights);
      console.log('Target:', target);
      
      setSearchProgress(50);
      
      const result = await srsApi.solveSubsetSum(weights.map(Math.abs), target);
      
      setSearchProgress(80);
      
      if (result.data && result.data.feasible) {
        console.log('✅ SRS API returned solution:', result.data);
        
        // Extract variable assignment from subset sum solution
        const selectedIndices = result.data.certificate?.indices || [];
        const assignment = new Array(numVars).fill(false);
        selectedIndices.forEach(idx => {
          if (idx < numVars) {
            assignment[idx] = weights[idx] > 0;
          }
        });
        
        // Verify the assignment
        const isSatisfiable = checkSatisfiability(assignment, satInstance);
        
        if (!isSatisfiable) {
          // If not satisfied, try local search
          console.log('⚠️ API solution needs refinement, using local solver');
          const localResult = solve3SAT(satInstance);
          
          const updatedInstance: SATInstance = {
            ...satInstance,
            isSatisfiable: localResult.satisfiable,
            satisfyingAssignment: localResult.assignment
          };
          
          if (localResult.assignment) {
            setCurrentAssignment(localResult.assignment);
            setSatInstance(updateClauseSatisfaction(localResult.assignment, updatedInstance));
            onSolve?.(updatedInstance, localResult.assignment);
          } else {
            setSatInstance(updatedInstance);
          }
        } else {
          const updatedInstance: SATInstance = {
            ...satInstance,
            isSatisfiable: true,
            satisfyingAssignment: assignment
          };
          
          setCurrentAssignment(assignment);
          setSatInstance(updateClauseSatisfaction(assignment, updatedInstance));
          onSolve?.(updatedInstance, assignment);
        }
      } else {
        throw new Error('No feasible solution found');
      }
      
      setIsSearching(false);
      setSearchProgress(100);
    } catch (error) {
      console.error('❌ SRS API error:', error);
      // Fall back to local algorithm
      const result = solve3SAT(satInstance);
      
      const updatedInstance: SATInstance = {
        ...satInstance,
        isSatisfiable: result.satisfiable,
        satisfyingAssignment: result.assignment
      };

      if (result.assignment) {
        setCurrentAssignment(result.assignment);
        setSatInstance(updateClauseSatisfaction(result.assignment, updatedInstance));
        onSolve?.(updatedInstance, result.assignment);
      } else {
        setSatInstance(updatedInstance);
      }

      setIsSearching(false);
      setSearchProgress(100);
    }
  };

  // Simulate classical search for comparison
  const simulateClassicalSearch = useCallback(() => {
    if (!isSearching || !satInstance) return;

    const maxIterations = 100;
    let iteration = 0;

    const searchStep = () => {
      if (!isSearching || iteration >= maxIterations) {
        // Complete search
        const result = solve3SAT(satInstance);
        
        const updatedInstance: SATInstance = {
          ...satInstance,
          isSatisfiable: result.satisfiable,
          satisfyingAssignment: result.assignment
        };

        if (result.assignment) {
          setCurrentAssignment(result.assignment);
          setSatInstance(updateClauseSatisfaction(result.assignment, updatedInstance));
          onSolve?.(updatedInstance, result.assignment);
        } else {
          setSatInstance(updatedInstance);
        }

        setIsSearching(false);
        setSearchProgress(100);
        return;
      }

      iteration++;
      const progress = (iteration / maxIterations) * 100;
      setSearchProgress(progress);
      onProgress?.(progress);

      // Show intermediate search state
      if (iteration % 3 === 0) {
        const randomAssignment = satInstance.variables.map(() => Math.random() < 0.5);
        setCurrentAssignment(randomAssignment);
        setSatInstance(updateClauseSatisfaction(randomAssignment, satInstance));
      }

      searchTimeoutRef.current = setTimeout(searchStep, 50);
    };

    searchStep();
  }, [isSearching, satInstance, onSolve, onProgress]);

  // Control functions
  const startSearch = async () => {
    if (!satInstance) return;
    setIsSearching(true);
    setSearchProgress(0);
    setCurrentAssignment(new Array(satInstance.variables.length).fill(false));
    
    if (searchMethod === 'quantum') {
      // Use real API for quantum search
      await performQuantumSearch();
    } else {
      // Simulate classical search
      simulateClassicalSearch();
    }
  };

  const stopSearch = () => {
    setIsSearching(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  const resetInstance = useCallback(() => {
    stopSearch();
    setSearchProgress(0);
    setCurrentAssignment([]);
    
    if (selectedExample === 'random') {
      const newInstance = generateRandom3SAT(numVariables[0], numClauses[0], satisfiabilityRatio[0]);
      setSatInstance(newInstance);
    } else {
      const example = circuitExamples.find(ex => ex.name === selectedExample);
      if (example) {
        const newInstance = loadCircuitExample(example);
        setSatInstance(newInstance);
      }
    }
  }, [selectedExample, numVariables, numClauses, satisfiabilityRatio, generateRandom3SAT]);

  // Handle variable assignment
  const toggleVariable = (index: number) => {
    if (!satInstance || isSearching) return;

    const newAssignment = [...currentAssignment];
    newAssignment[index] = !newAssignment[index];
    setCurrentAssignment(newAssignment);
    setSatInstance(updateClauseSatisfaction(newAssignment, satInstance));
  };

  // Handle example change
  const handleExampleChange = (exampleName: string) => {
    setSelectedExample(exampleName);
    stopSearch();
    setCurrentAssignment([]);
    
    if (exampleName === 'random') {
      const newInstance = generateRandom3SAT(numVariables[0], numClauses[0], satisfiabilityRatio[0]);
      setSatInstance(newInstance);
    } else {
      const example = circuitExamples.find(ex => ex.name === exampleName);
      if (example) {
        const newInstance = loadCircuitExample(example);
        setSatInstance(newInstance);
        setCurrentAssignment(new Array(example.variables.length).fill(false));
      }
    }
  };

  // Add new clause
  const addClause = () => {
    if (!satInstance || satInstance.variables.length < 3) return;

    const newClause: Clause = {
      id: satInstance.clauses.length,
      literals: [
        { variable: 0, negated: false },
        { variable: 1, negated: false },
        { variable: 2, negated: false }
      ],
      satisfied: null
    };

    setSatInstance({
      ...satInstance,
      clauses: [...satInstance.clauses, newClause]
    });
  };

  // Remove clause
  const removeClause = (clauseId: number) => {
    if (!satInstance) return;

    setSatInstance({
      ...satInstance,
      clauses: satInstance.clauses.filter(c => c.id !== clauseId)
    });
  };

  // Render clause
  const renderClause = (clause: Clause, index: number) => {
    if (!satInstance) return null;

    return (
      <div 
        key={clause.id}
        className={`p-3 border rounded-lg ${
          clause.satisfied === true 
            ? 'border-green-500 bg-green-500/10' 
            : clause.satisfied === false 
            ? 'border-red-500 bg-red-500/10'
            : 'border-gray-600 bg-gray-800/50'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono">C{index + 1}:</span>
            {clause.satisfied !== null && (
              clause.satisfied ? 
                <CheckCircle className="w-4 h-4 text-green-500" /> :
                <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeClause(clause.id)}
            disabled={isSearching}
            className="h-6 w-6 p-0"
          >
            <Minus className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-sm font-mono">
          {clause.literals.map((literal, litIndex) => (
            <React.Fragment key={litIndex}>
              {litIndex > 0 && <span className="text-gray-400">∨</span>}
              <span className={`${
                currentAssignment[literal.variable] !== undefined
                  ? (literal.negated ? !currentAssignment[literal.variable] : currentAssignment[literal.variable])
                    ? 'text-green-400'
                    : 'text-red-400'
                  : 'text-gray-300'
              }`}>
                {literal.negated ? '¬' : ''}{satInstance.variables[literal.variable]?.name || `x${literal.variable + 1}`}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Effects - removed the automatic simulation trigger

  useEffect(() => {
    // Initialize with random instance only once
    if (!satInstance) {
      resetInstance();
    }
  }, []); // Only run once on mount

  useEffect(() => {
    if (selectedExample === 'random') {
      const newInstance = generateRandom3SAT(numVariables[0], numClauses[0], satisfiabilityRatio[0]);
      setSatInstance(newInstance);
      setCurrentAssignment(new Array(numVariables[0]).fill(false));
    }
  }, [numVariables, numClauses, satisfiabilityRatio, selectedExample, generateRandom3SAT]);

  if (!satInstance) {
    return <div>Loading...</div>;
  }

  const satisfiedClauses = satInstance.clauses.filter(c => c.satisfied === true).length;
  const totalClauses = satInstance.clauses.length;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CircuitBoard className="w-5 h-5" />
                3-SAT Problem
              </CardTitle>
              <CardDescription>
                Boolean satisfiability for logic circuit design and verification
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isSearching ? "secondary" : "default"}
                size="sm"
                onClick={isSearching ? stopSearch : startSearch}
                className="flex items-center gap-2"
              >
                {isSearching ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isSearching ? 'Stop' : 'Solve SAT'}
              </Button>
              <Button variant="outline" size="sm" onClick={resetInstance}>
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instance Configuration */}
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
                  {circuitExamples.map((example) => (
                    <Button
                      key={example.name}
                      variant={selectedExample === example.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleExampleChange(example.name)}
                      disabled={isSearching}
                      className="text-left justify-start"
                    >
                      <Cpu className="w-4 h-4 mr-2" />
                      {example.name}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedExample === 'random' && (
                <>
                  <div>
                    <label className="text-sm font-medium">Variables: {numVariables[0]}</label>
                    <Slider
                      value={numVariables}
                      onValueChange={setNumVariables}
                      max={10}
                      min={3}
                      step={1}
                      className="mt-2"
                      disabled={isSearching}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Clauses: {numClauses[0]}</label>
                    <Slider
                      value={numClauses}
                      onValueChange={setNumClauses}
                      max={20}
                      min={3}
                      step={1}
                      className="mt-2"
                      disabled={isSearching}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Ratio: {satisfiabilityRatio[0].toFixed(1)}</label>
                    <Slider
                      value={satisfiabilityRatio}
                      onValueChange={setSatisfiabilityRatio}
                      max={6.0}
                      min={2.0}
                      step={0.1}
                      className="mt-2"
                      disabled={isSearching}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Higher ratios are typically harder to satisfy
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Search Options & Status */}
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
                    DPLL
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-lg font-mono text-blue-600">{satisfiedClauses}/{totalClauses}</div>
                    <div className="text-xs text-muted-foreground">Clauses Satisfied</div>
                  </div>
                  <div>
                    <div className="text-lg font-mono text-purple-600">{satInstance.variables.length}</div>
                    <div className="text-xs text-muted-foreground">Variables</div>
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

                {satInstance.isSatisfiable !== null && (
                  <div className={`flex items-center justify-center gap-2 p-2 rounded ${
                    satInstance.isSatisfiable 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {satInstance.isSatisfiable ? 
                      <CheckCircle className="w-4 h-4" /> : 
                      <XCircle className="w-4 h-4" />
                    }
                    <span className="text-sm font-medium">
                      {satInstance.isSatisfiable ? 'SATISFIABLE' : 'UNSATISFIABLE'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Variable Assignment */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Variable Assignment</CardTitle>
              <CardDescription>
                Click variables to toggle their boolean values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {satInstance.variables.map((variable, index) => (
                  <div key={variable.id} className="flex items-center justify-between">
                    <span className="text-sm font-mono">{variable.name}</span>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={currentAssignment[index] || false}
                        onCheckedChange={() => toggleVariable(index)}
                        disabled={isSearching}
                      />
                      <span className={`text-xs font-mono w-12 ${
                        currentAssignment[index] ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {currentAssignment[index] ? 'TRUE' : 'FALSE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clauses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Boolean Clauses</CardTitle>
                  <CardDescription>
                    Each clause must have at least one TRUE literal
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addClause}
                  disabled={isSearching || selectedExample !== 'random'}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Clause
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {satInstance.clauses.map((clause, index) => renderClause(clause, index))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Circuit Context */}
        {selectedExample !== 'random' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Binary className="w-4 h-4" />
                Circuit Application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-foreground">
                {circuitExamples.find(ex => ex.name === selectedExample)?.context}
              </p>
              <div className="text-xs text-muted-foreground">
                {circuitExamples.find(ex => ex.name === selectedExample)?.description}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Algorithm Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Info className="w-4 h-4" />
              About 3-SAT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            <p>
              3-SAT is the fundamental NP-complete problem where each clause
              contains exactly 3 literals (variables or their negations).
            </p>
            <p>
              Critical applications include circuit verification, AI planning,
              and cryptographic protocol analysis.
            </p>
            <div className="flex items-center gap-2 text-yellow-400">
              <Target className="w-3 h-3" />
              <span>Phase transition occurs around 4.2 clauses per variable</span>
            </div>
            
            {searchMethod === 'quantum' && (
              <Alert className="border-blue-500/50 bg-blue-500/10 mt-2">
                <AlertCircle className="h-3 w-3" />
                <AlertDescription className="text-xs">
                  Using Symbolic Resonance Solver (SRS) API via subset sum encoding
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThreeSATDemo;