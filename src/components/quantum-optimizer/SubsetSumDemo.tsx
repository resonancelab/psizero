/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Shield,
  Key,
  Hash,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Target,
  Binary,
  Zap,
  Clock,
  Info,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import srsApi from '@/lib/api/services/srs';

interface SubsetSumProblem {
  numbers: number[];
  target: number;
  solution?: number[];
  hasSolution: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'cryptographic';
  context: string;
}

interface SearchState {
  currentSubset: number[];
  currentSum: number;
  explored: number;
  totalStates: number;
  found: boolean;
  iterations: number;
}

interface SubsetSumDemoProps {
  onSolve?: (problem: SubsetSumProblem, solution: number[]) => void;
  onProgress?: (progress: number) => void;
}

export const SubsetSumDemo: React.FC<SubsetSumDemoProps> = ({
  onSolve,
  onProgress
}) => {
  const [currentProblem, setCurrentProblem] = useState<SubsetSumProblem | null>(null);
  const [searchState, setSearchState] = useState<SearchState | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMethod, setSearchMethod] = useState<'quantum' | 'classical'>('quantum');
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set());
  const [currentSum, setCurrentSum] = useState(0);
  const [problemSize, setProblemSize] = useState([12]);
  const [difficulty, setDifficulty] = useState<string>('medium');
  
  const animationRef = useRef<number>();
  const searchTimeoutRef = useRef<NodeJS.Timeout | { stop: () => void }>();

  // Cryptographic example problems
  const cryptographicExamples: any = useMemo(() => [
    {
      numbers: [157, 89, 233, 144, 377, 610, 121, 199],
      target: 766,
      solution: [157, 233, 376],
      hasSolution: true,
      difficulty: 'cryptographic',
      context: 'Merkle-Hellman Knapsack: Find private key subset for encryption'
    },
    {
      numbers: [43, 89, 178, 356, 712, 1424, 2848, 5696],
      target: 6267,
      solution: [43, 178, 712, 1424, 2848],
      hasSolution: true,
      difficulty: 'cryptographic', 
      context: 'Lattice-based cryptography: Hidden subset sum problem'
    },
    {
      numbers: [97, 194, 388, 776, 1552, 3104, 6208, 12416, 24832],
      target: 31415,
      solution: [97, 388, 6208, 24832],
      hasSolution: true,
      difficulty: 'cryptographic',
      context: 'Post-quantum cryptography: NTRU parameter subset'
    }
  ], []);

  // Generate random subset sum problem - memoized to prevent regeneration
  const generateProblem = useMemo(() => (size: number, difficultyLevel: string): SubsetSumProblem => {
    const numbers: number[] = [];
    let maxNum = 100;
    let density = 0.5;
    
    switch (difficultyLevel) {
      case 'easy':
        maxNum = 50;
        density = 0.8;
        break;
      case 'medium':
        maxNum = 100;
        density = 0.6;
        break;
      case 'hard':
        maxNum = 200;
        density = 0.4;
        break;
      case 'cryptographic':
        return cryptographicExamples[Math.floor(Math.random() * cryptographicExamples.length)];
    }

    // Generate numbers with some structure to ensure interesting problems
    for (let i = 0; i < size; i++) {
      if (i < 3 && Math.random() < 0.7) {
        // Add some small numbers to make solutions more likely
        numbers.push(Math.floor(Math.random() * 20) + 1);
      } else {
        numbers.push(Math.floor(Math.random() * maxNum) + 1);
      }
    }

    // Sort numbers for better visualization
    numbers.sort((a, b) => a - b);

    // Generate a target that has a solution with given density
    const solution: number[] = [];
    let target = 0;
    
    for (let i = 0; i < numbers.length; i++) {
      if (Math.random() < density) {
        solution.push(numbers[i]);
        target += numbers[i];
      }
    }

    // If no solution generated, pick a few random numbers
    if (solution.length === 0) {
      const numToSelect = Math.max(1, Math.floor(size * density));
      for (let i = 0; i < numToSelect; i++) {
        const idx = Math.floor(Math.random() * numbers.length);
        if (!solution.includes(numbers[idx])) {
          solution.push(numbers[idx]);
          target += numbers[idx];
        }
      }
    }

    return {
      numbers,
      target,
      solution,
      hasSolution: true,
      difficulty: difficultyLevel as 'easy' | 'medium' | 'hard' | 'cryptographic',
      context: getContextForDifficulty(difficultyLevel)
    };
  }, [cryptographicExamples]);

  const getContextForDifficulty = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy':
        return 'Basic subset sum: Find numbers that add to target';
      case 'medium':
        return 'Resource allocation: Optimize budget distribution';
      case 'hard':
        return 'Portfolio optimization: Select assets for target value';
      case 'cryptographic':
        return 'Cryptographic application: Security protocol implementation';
      default:
        return 'Optimization problem';
    }
  };

  // Use real API for quantum search
  const performQuantumSearch = async (problem: SubsetSumProblem) => {
    try {
      console.log('🔮 Starting quantum subset sum search via SRS API...');
      
      // Call the actual SRS API
      const result = await srsApi.solveSubsetSum(problem.numbers, problem.target);
      
      if (result.data) {
        console.log('✅ SRS API returned solution:', result.data);
        
        // Extract solution indices from the API response
        const solutionIndices = result.data.certificate?.indices || [];
        const foundSolution = solutionIndices.length > 0 && result.data.feasible;
        
        setSearchState({
          currentSubset: solutionIndices.map(i => problem.numbers[i]),
          currentSum: foundSolution ? problem.target : 0,
          explored: Math.pow(2, problem.numbers.length),
          totalStates: Math.pow(2, problem.numbers.length),
          found: foundSolution,
          iterations: result.data.telemetry?.length || 1
        });
        
        if (foundSolution) {
          // Convert indices to our selection format
          const selectedIndices = new Set(solutionIndices);
          setSelectedNumbers(selectedIndices);
          setCurrentSum(problem.target);
          onSolve?.(problem, solutionIndices.map(i => problem.numbers[i]));
        }
        
        onProgress?.(100);
      } else {
        throw new Error(result.error || 'No solution found');
      }
    } catch (error) {
      console.error('❌ SRS API error:', error);
      // Fall back to showing no solution found
      setSearchState({
        currentSubset: [],
        currentSum: 0,
        explored: Math.pow(2, problem.numbers.length),
        totalStates: Math.pow(2, problem.numbers.length),
        found: false,
        iterations: 1
      });
      onProgress?.(100);
    } finally {
      setIsSearching(false);
    }
  };

  // Simulate classical search for comparison
  const simulateClassicalSearch = (problem: SubsetSumProblem, shouldContinue: () => boolean) => {
    const totalStates = Math.pow(2, problem.numbers.length);
    let explored = 0;
    let found = false;
    let iterations = 0;
    
    const searchStep = () => {
      if (!shouldContinue()) return;

      const speed = 10; // Classical is slower
      explored += speed;
      iterations++;

      // Simulate finding solution
      const progress = explored / totalStates;
      found = progress > 0.5 + Math.random() * 0.4;

      setSearchState({
        currentSubset: generateRandomSubset(problem.numbers),
        currentSum: 0,
        explored: Math.min(explored, totalStates),
        totalStates,
        found,
        iterations
      });

      onProgress?.(Math.min(progress * 100, 100));

      if (found || explored >= totalStates) {
        setIsSearching(false);
        if (found && problem.solution) {
          // Convert solution array to indices for proper selection
          const solutionIndices = new Set(
            problem.solution.map(num => problem.numbers.findIndex(n => n === num))
          );
          setSelectedNumbers(solutionIndices);
          setCurrentSum(problem.target);
          onSolve?.(problem, problem.solution);
        }
      } else {
        searchTimeoutRef.current = setTimeout(searchStep, 100);
      }
    };

    searchStep();
  };

  const generateRandomSubset = (numbers: number[]): number[] => {
    const subset: number[] = [];
    const numToSelect = Math.floor(Math.random() * numbers.length / 2) + 1;
    
    for (let i = 0; i < numToSelect; i++) {
      const idx = Math.floor(Math.random() * numbers.length);
      if (!subset.includes(numbers[idx])) {
        subset.push(numbers[idx]);
      }
    }
    
    return subset;
  };

  // Handle number selection
  const toggleNumber = (index: number) => {
    if (!currentProblem || isSearching) return;

    const newSelected = new Set(selectedNumbers);
    const number = currentProblem.numbers[index];
    
    if (newSelected.has(index)) {
      newSelected.delete(index);
      setCurrentSum(prev => prev - number);
    } else {
      newSelected.add(index);
      setCurrentSum(prev => prev + number);
    }
    
    setSelectedNumbers(newSelected);
  };

  // Control functions
  const startSearch = async () => {
    if (!currentProblem || isSearching) return;
    
    setIsSearching(true);
    setSearchState({
      currentSubset: [],
      currentSum: 0,
      explored: 0,
      totalStates: Math.pow(2, currentProblem.numbers.length),
      found: false,
      iterations: 0
    });
    
    if (searchMethod === 'quantum') {
      // Use real API for quantum search
      await performQuantumSearch(currentProblem);
    } else {
      // Simulate classical search for comparison
      const shouldContinue = { value: true };
      setTimeout(() => {
        simulateClassicalSearch(currentProblem, () => shouldContinue.value);
      }, 10);
      
      // Store reference to stop function
      searchTimeoutRef.current = {
        stop: () => { shouldContinue.value = false; }
      } as any;
    }
  };

  const stopSearch = () => {
    setIsSearching(false);
    if (searchTimeoutRef.current) {
      if ('stop' in searchTimeoutRef.current) {
        searchTimeoutRef.current.stop();
      } else {
        clearTimeout(searchTimeoutRef.current);
      }
    }
  };

  const resetProblem = useCallback(() => {
    stopSearch();
    setSelectedNumbers(new Set());
    setCurrentSum(0);
    setSearchState(null);
    const newProblem = generateProblem(problemSize[0], difficulty);
    setCurrentProblem(newProblem);
  }, [problemSize, difficulty, generateProblem]);

  const loadCryptographicExample = (example: SubsetSumProblem) => {
    stopSearch();
    setCurrentProblem(example);
    setSelectedNumbers(new Set());
    setCurrentSum(0);
    setSearchState(null);
    setDifficulty('cryptographic');
  };

  // Initialize with a problem only once
  useEffect(() => {
    if (!currentProblem) {
      const newProblem = generateProblem(problemSize[0], difficulty);
      setCurrentProblem(newProblem);
    }
  }, [currentProblem, problemSize, difficulty, generateProblem]);

  const renderNumberGrid = () => {
    if (!currentProblem) return null;

    return (
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {currentProblem.numbers.map((number, index) => {
          const isSelected = selectedNumbers.has(index);
          const isSolution = currentProblem.solution?.includes(number) && searchState?.found;
          
          return (
            <button
              key={index}
              onClick={() => toggleNumber(index)}
              disabled={isSearching}
              className={`
                p-3 rounded-lg border text-sm font-mono transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-500/20 text-blue-300' 
                  : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                }
                ${isSolution ? 'ring-2 ring-green-500' : ''}
                ${isSearching ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}
              `}
            >
              {number}
            </button>
          );
        })}
      </div>
    );
  };

  const renderCryptographicExamples = () => (
    <div className="space-y-3">
      {cryptographicExamples.map((example, index) => (
        <Card key={index} className="cursor-pointer hover:border-blue-500/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Cryptographic Example {index + 1}
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {example.numbers.length} numbers
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{example.context}</p>
              <div className="flex items-center justify-between text-xs">
                <span>Target: <span className="font-mono text-blue-600">{example.target}</span></span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => loadCryptographicExample(example)}
                  className="text-xs"
                >
                  Load Example
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (!currentProblem) {
    return <div>Loading...</div>;
  }

  const isCorrect = currentSum === currentProblem.target;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Binary className="w-5 h-5" />
                Subset Sum Problem
              </CardTitle>
              <CardDescription>
                {currentProblem.context}
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
                {isSearching ? 'Stop' : 'Auto Solve'}
              </Button>
              <Button variant="outline" size="sm" onClick={resetProblem}>
                <RotateCcw className="w-4 h-4" />
                New Problem
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Target Display */}
            <div className="lg:col-span-1">
              <div className={`text-center p-6 border rounded-lg transition-all duration-300 ${
                isCorrect
                  ? 'border-green-500 bg-green-500/10 ring-2 ring-green-500/20'
                  : 'border-gray-700 bg-gray-800/50'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-cyan-600" />
                  <span className="text-sm text-muted-foreground">Target Sum</span>
                </div>
                <div className="text-3xl font-mono text-cyan-600 mb-2">
                  {currentProblem.target}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current: <span className={`font-mono ${
                    isCorrect ? 'text-green-600' : currentSum > currentProblem.target ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {currentSum}
                  </span>
                </div>
                
                {isCorrect && (
                  <div className="flex items-center justify-center gap-1 mt-3 p-2 bg-green-500/20 rounded-lg border border-green-500">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-base font-medium text-green-400">Perfect Solution Found!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Problem Configuration */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="text-sm font-medium">Problem Size: {problemSize[0]} numbers</label>
                <Slider
                  value={problemSize}
                  onValueChange={setProblemSize}
                  max={16}
                  min={6}
                  step={1}
                  className="mt-2"
                  disabled={isSearching}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['easy', 'medium', 'hard', 'cryptographic'].map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDifficulty(level)}
                      disabled={isSearching}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

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
                    Classical Brute Force
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Numbers Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Numbers</CardTitle>
              <CardDescription>
                Click numbers to include them in your subset (Selected: {selectedNumbers.size})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderNumberGrid()}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Search Progress */}
          {searchState && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Search Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>States Explored</span>
                    <span className="font-mono">
                      {searchState.explored.toLocaleString()} / {searchState.totalStates.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(searchState.explored / searchState.totalStates) * 100} />
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-lg font-mono text-blue-600">{searchState.iterations}</div>
                    <div className="text-xs text-muted-foreground">Iterations</div>
                  </div>
                  <div>
                    <div className="text-lg font-mono text-purple-600">
                      {((searchState.explored / searchState.totalStates) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Complete</div>
                  </div>
                </div>

                {searchState.found && (
                  <div className="flex items-center justify-center gap-2 text-green-400 mt-3">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Solution Found!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Cryptographic Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Key className="w-4 h-4" />
                Cryptographic Examples
              </CardTitle>
              <CardDescription className="text-xs">
                Real-world security applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCryptographicExamples()}
            </CardContent>
          </Card>

          {/* Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Info className="w-4 h-4" />
                About Subset Sum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <p>
                The subset sum problem is NP-complete and forms the basis of several
                cryptographic systems including the Merkle-Hellman knapsack cryptosystem.
              </p>
              <p>
                Quantum algorithms like Grover's search can provide quadratic speedup
                over classical brute force approaches.
              </p>
              <div className="flex items-center gap-2 text-yellow-400">
                <Hash className="w-3 h-3" />
                <span>Complexity: O(2^n) classical, O(2^(n/2)) quantum</span>
              </div>
              
              {searchMethod === 'quantum' && (
                <Alert className="border-blue-500/50 bg-blue-500/10">
                  <AlertCircle className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    Using real Symbolic Resonance Solver (SRS) API for quantum optimization
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubsetSumDemo;