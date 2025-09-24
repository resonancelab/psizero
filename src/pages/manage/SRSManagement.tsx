
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import {
  Cpu,
  Plus,
  Play,
  Pause,
  Square,
  Upload,
  Download,
  Settings,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  Clock,
  Zap,
  Database,
  FileText,
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Target,
  Users,
  Sparkles,
  LineChart,
  PieChart,
  Monitor,
  Puzzle,
  Calculator,
  Timer,
  Award,
  Layers,
  Network,
  Binary,
  Gauge,
  Beaker,
  GitBranch,
  Hash,
  Package
} from 'lucide-react';

interface ProblemInstance {
  id: string;
  name: string;
  type: 'TSP' | 'SAT' | 'KNAPSACK' | 'GRAPH_COLORING' | 'MAX_CLIQUE' | 'SUBSET_SUM';
  description?: string;
  size: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  createdAt: string;
  status: 'unsolved' | 'solving' | 'solved' | 'failed';
  bestSolution?: {
    value: number;
    time: number;
    algorithm: string;
    solvedAt: string;
  };
  attempts: number;
}

interface SolverConfig {
  id: string;
  name: string;
  description?: string;
  algorithm: 'quantum_annealing' | 'simulated_annealing' | 'genetic_algorithm' | 'branch_bound' | 'hybrid';
  parameters: {
    maxIterations: number;
    temperature: number;
    coolingRate: number;
    populationSize?: number;
    mutationRate?: number;
    crossoverRate?: number;
    primeBasisSize: number;
    resonanceThreshold: number;
  };
  isActive: boolean;
  createdAt: string;
  performance: {
    avgSolveTime: number;
    successRate: number;
    problemsSolved: number;
  };
}

interface SolveJob {
  id: string;
  problemId: string;
  problemName: string;
  configId: string;
  configName: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startTime: string;
  estimatedCompletion?: string;
  currentValue?: number;
  bestValue?: number;
  iterations: number;
  maxIterations: number;
}

interface SolutionHistory {
  id: string;
  problemId: string;
  problemName: string;
  algorithm: string;
  value: number;
  time: number;
  iterations: number;
  solvedAt: string;
  parameters: Record<string, string | number | boolean>;
}

const SRSManagement = () => {
  const { toast } = useToast();
  const [problems, setProblems] = useState<ProblemInstance[]>([]);
  const [configs, setConfigs] = useState<SolverConfig[]>([]);
  const [solveJobs, setSolveJobs] = useState<SolveJob[]>([]);
  const [solutionHistory, setSolutionHistory] = useState<SolutionHistory[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<ProblemInstance | null>(null);
  const [showCreateProblemDialog, setShowCreateProblemDialog] = useState(false);
  const [showCreateConfigDialog, setShowCreateConfigDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockProblems: ProblemInstance[] = [
      {
        id: 'problem_1',
        name: 'European Cities TSP',
        type: 'TSP',
        description: 'Traveling salesman problem with 50 European cities',
        size: 50,
        difficulty: 'medium',
        createdAt: '2024-01-15T10:00:00Z',
        status: 'solved',
        bestSolution: {
          value: 12847.5,
          time: 1234,
          algorithm: 'quantum_annealing',
          solvedAt: '2024-01-20T14:30:00Z'
        },
        attempts: 15
      },
      {
        id: 'problem_2',
        name: 'Large SAT Instance',
        type: 'SAT',
        description: '3-SAT problem with 1000 variables and 4200 clauses',
        size: 1000,
        difficulty: 'hard',
        createdAt: '2024-01-12T08:15:00Z',
        status: 'solving',
        attempts: 8
      },
      {
        id: 'problem_3',
        name: 'Knapsack Optimization',
        type: 'KNAPSACK',
        description: '0/1 Knapsack with 200 items and capacity 500',
        size: 200,
        difficulty: 'easy',
        createdAt: '2024-01-18T16:45:00Z',
        status: 'solved',
        bestSolution: {
          value: 2847,
          time: 456,
          algorithm: 'genetic_algorithm',
          solvedAt: '2024-01-19T10:22:00Z'
        },
        attempts: 3
      },
      {
        id: 'problem_4',
        name: 'Graph Coloring Challenge',
        type: 'GRAPH_COLORING',
        description: 'Random graph with 100 vertices, chromatic number estimation',
        size: 100,
        difficulty: 'extreme',
        createdAt: '2024-01-14T12:00:00Z',
        status: 'unsolved',
        attempts: 42
      }
    ];

    const mockConfigs: SolverConfig[] = [
      {
        id: 'config_1',
        name: 'Fast Quantum Annealer',
        description: 'Optimized for quick solutions with good quality',
        algorithm: 'quantum_annealing',
        parameters: {
          maxIterations: 1000,
          temperature: 100.0,
          coolingRate: 0.95,
          primeBasisSize: 17,
          resonanceThreshold: 0.85
        },
        isActive: true,
        createdAt: '2024-01-10T09:00:00Z',
        performance: {
          avgSolveTime: 847,
          successRate: 0.78,
          problemsSolved: 23
        }
      },
      {
        id: 'config_2',
        name: 'Genetic Algorithm Plus',
        description: 'Enhanced genetic algorithm with prime-basis encoding',
        algorithm: 'genetic_algorithm',
        parameters: {
          maxIterations: 5000,
          temperature: 50.0,
          coolingRate: 0.98,
          populationSize: 100,
          mutationRate: 0.15,
          crossoverRate: 0.8,
          primeBasisSize: 23,
          resonanceThreshold: 0.92
        },
        isActive: true,
        createdAt: '2024-01-08T14:30:00Z',
        performance: {
          avgSolveTime: 2145,
          successRate: 0.89,
          problemsSolved: 18
        }
      },
      {
        id: 'config_3',
        name: 'Hybrid Solver',
        description: 'Combines multiple algorithms with adaptive switching',
        algorithm: 'hybrid',
        parameters: {
          maxIterations: 2000,
          temperature: 75.0,
          coolingRate: 0.96,
          populationSize: 50,
          mutationRate: 0.1,
          crossoverRate: 0.7,
          primeBasisSize: 19,
          resonanceThreshold: 0.88
        },
        isActive: false,
        createdAt: '2024-01-05T11:15:00Z',
        performance: {
          avgSolveTime: 1456,
          successRate: 0.82,
          problemsSolved: 11
        }
      }
    ];

    const mockJobs: SolveJob[] = [
      {
        id: 'job_1',
        problemId: 'problem_2',
        problemName: 'Large SAT Instance',
        configId: 'config_1',
        configName: 'Fast Quantum Annealer',
        status: 'running',
        progress: 67,
        startTime: '2024-01-20T15:30:00Z',
        estimatedCompletion: '25 minutes',
        currentValue: 3847,
        bestValue: 4200,
        iterations: 670,
        maxIterations: 1000
      }
    ];

    const mockHistory: SolutionHistory[] = [
      {
        id: 'solution_1',
        problemId: 'problem_1',
        problemName: 'European Cities TSP',
        algorithm: 'quantum_annealing',
        value: 12847.5,
        time: 1234,
        iterations: 890,
        solvedAt: '2024-01-20T14:30:00Z',
        parameters: { temperature: 100, coolingRate: 0.95 }
      },
      {
        id: 'solution_2',
        problemId: 'problem_3',
        problemName: 'Knapsack Optimization',
        algorithm: 'genetic_algorithm',
        value: 2847,
        time: 456,
        iterations: 234,
        solvedAt: '2024-01-19T10:22:00Z',
        parameters: { populationSize: 100, mutationRate: 0.15 }
      },
      {
        id: 'solution_3',
        problemId: 'problem_1',
        problemName: 'European Cities TSP',
        algorithm: 'simulated_annealing',
        value: 13156.8,
        time: 2341,
        iterations: 1200,
        solvedAt: '2024-01-18T09:15:00Z',
        parameters: { temperature: 150, coolingRate: 0.92 }
      }
    ];

    setTimeout(() => {
      setProblems(mockProblems);
      setConfigs(mockConfigs);
      setSolveJobs(mockJobs);
      setSolutionHistory(mockHistory);
      setSelectedProblem(mockProblems[0]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Simulate solving progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSolveJobs(prevJobs =>
        prevJobs.map(job => {
          if (job.status === 'running') {
            const newProgress = Math.min(100, job.progress + Math.random() * 3);
            const newIterations = Math.floor((newProgress / 100) * job.maxIterations);
            return {
              ...job,
              progress: newProgress,
              iterations: newIterations,
              currentValue: job.currentValue ? job.currentValue + Math.random() * 10 - 5 : undefined
            };
          }
          return job;
        })
      );

      setProblems(prevProblems =>
        prevProblems.map(problem => {
          const activeJob = solveJobs.find(job => job.problemId === problem.id && job.status === 'running');
          if (activeJob) {
            return { ...problem, status: 'solving' as const };
          }
          return problem;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [solveJobs]);

  const handleCreateProblem = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Problem instance creation wizard will be available in the next update.",
    });
    setShowCreateProblemDialog(false);
  };

  const handleCreateConfig = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Solver configuration wizard will be available in the next update.",
    });
    setShowCreateConfigDialog(false);
  };

  const handleStartSolving = (problemId: string, configId: string) => {
    const problem = problems.find(p => p.id === problemId);
    const config = configs.find(c => c.id === configId);
    
    if (problem && config) {
      const newJob: SolveJob = {
        id: `job_${Date.now()}`,
        problemId,
        problemName: problem.name,
        configId,
        configName: config.name,
        status: 'running',
        progress: 0,
        startTime: new Date().toISOString(),
        iterations: 0,
        maxIterations: config.parameters.maxIterations
      };
      
      setSolveJobs(prev => [...prev, newJob]);
      setProblems(prev => prev.map(p => 
        p.id === problemId ? { ...p, status: 'solving' as const } : p
      ));
      
      toast({
        title: "Solving Started",
        description: `Started solving ${problem.name} with ${config.name}`,
      });
    }
  };

  const handleStopSolving = (jobId: string) => {
    setSolveJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'cancelled' as const } : job
    ));
    toast({
      title: "Solving Stopped",
      description: "The solving process has been cancelled.",
    });
  };

  const handleDeleteProblem = (problemId: string) => {
    setProblems(prev => prev.filter(p => p.id !== problemId));
    toast({
      title: "Problem Deleted",
      description: "Problem instance has been permanently removed.",
      variant: "destructive"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'solving':
        return <Badge className="bg-blue-500">Solving</Badge>;
      case 'solved':
        return <Badge className="bg-green-500">Solved</Badge>;
      case 'unsolved':
        return <Badge variant="secondary">Unsolved</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solving':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'solved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'unsolved':
        return <Puzzle className="h-4 w-4 text-gray-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <Badge className="bg-green-500">Easy</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'hard':
        return <Badge className="bg-orange-500">Hard</Badge>;
      case 'extreme':
        return <Badge className="bg-red-500">Extreme</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  const getProblemTypeIcon = (type: string) => {
    switch (type) {
      case 'TSP':
        return <Network className="h-4 w-4" />;
      case 'SAT':
        return <Binary className="h-4 w-4" />;
      case 'KNAPSACK':
        return <Package className="h-4 w-4" />;
      case 'GRAPH_COLORING':
        return <Layers className="h-4 w-4" />;
      case 'MAX_CLIQUE':
        return <GitBranch className="h-4 w-4" />;
      case 'SUBSET_SUM':
        return <Hash className="h-4 w-4" />;
      default:
        return <Puzzle className="h-4 w-4" />;
    }
  };

  const getAlgorithmIcon = (algorithm: string) => {
    switch (algorithm) {
      case 'quantum_annealing':
        return <Zap className="h-4 w-4" />;
      case 'genetic_algorithm':
        return <GitBranch className="h-4 w-4" />;
      case 'simulated_annealing':
        return <Gauge className="h-4 w-4" />;
      case 'branch_bound':
        return <Binary className="h-4 w-4" />;
      case 'hybrid':
        return <Beaker className="h-4 w-4" />;
      default:
        return <Calculator className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Section>
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Section>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Cpu className="h-10 w-10 text-violet-600" />
                  SRS Management
                </h1>
                <p className="text-xl text-muted-foreground">
                  Solve NP-complete problems using quantum-enhanced symbolic resonance algorithms.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Dialog open={showCreateConfigDialog} onOpenChange={setShowCreateConfigDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      New Solver Config
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Solver Configuration</DialogTitle>
                      <DialogDescription>
                        Configure a new solving algorithm with optimization parameters
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="configName">Configuration Name</Label>
                          <Input id="configName" placeholder="Enter config name" />
                        </div>
                        <div>
                          <Label htmlFor="algorithm">Algorithm Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="quantum_annealing">Quantum Annealing</SelectItem>
                              <SelectItem value="genetic_algorithm">Genetic Algorithm</SelectItem>
                              <SelectItem value="simulated_annealing">Simulated Annealing</SelectItem>
                              <SelectItem value="branch_bound">Branch & Bound</SelectItem>
                              <SelectItem value="hybrid">Hybrid Approach</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="configDesc">Description</Label>
                        <Textarea id="configDesc" placeholder="Describe the configuration" />
                      </div>

                      <div className="space-y-4">
                        <Label>Algorithm Parameters</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="maxIterations">Max Iterations</Label>
                            <Input id="maxIterations" type="number" placeholder="1000" />
                          </div>
                          <div>
                            <Label htmlFor="temperature">Initial Temperature</Label>
                            <Input id="temperature" type="number" placeholder="100.0" />
                          </div>
                          <div>
                            <Label htmlFor="coolingRate">Cooling Rate</Label>
                            <div className="pt-2">
                              <Slider defaultValue={[0.95]} max={1} min={0.8} step={0.01} />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="primeBasis">Prime Basis Size</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="17">17</SelectItem>
                                <SelectItem value="19">19</SelectItem>
                                <SelectItem value="23">23</SelectItem>
                                <SelectItem value="29">29</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateConfigDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateConfig}>
                        Create Configuration
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showCreateProblemDialog} onOpenChange={setShowCreateProblemDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-violet-600 to-purple-600">
                      <Plus className="h-4 w-4 mr-2" />
                      New Problem
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Problem Instance</DialogTitle>
                      <DialogDescription>
                        Define a new NP-complete problem to solve
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="problemName">Problem Name</Label>
                          <Input id="problemName" placeholder="Enter problem name" />
                        </div>
                        <div>
                          <Label htmlFor="problemType">Problem Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TSP">Traveling Salesman</SelectItem>
                              <SelectItem value="SAT">Boolean Satisfiability</SelectItem>
                              <SelectItem value="KNAPSACK">Knapsack Problem</SelectItem>
                              <SelectItem value="GRAPH_COLORING">Graph Coloring</SelectItem>
                              <SelectItem value="MAX_CLIQUE">Maximum Clique</SelectItem>
                              <SelectItem value="SUBSET_SUM">Subset Sum</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="problemDesc">Description</Label>
                        <Textarea id="problemDesc" placeholder="Describe the problem instance" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="problemSize">Problem Size</Label>
                          <Input id="problemSize" type="number" placeholder="100" />
                        </div>
                        <div>
                          <Label htmlFor="difficulty">Difficulty</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                              <SelectItem value="extreme">Extreme</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="problemData">Problem Data</Label>
                        <Input id="problemData" type="file" accept=".json,.txt,.csv" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Upload problem data in JSON, TXT, or CSV format
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateProblemDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateProblem}>
                        Create Problem
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <Tabs defaultValue="problems" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="problems">Problems</TabsTrigger>
              <TabsTrigger value="solvers">Solvers</TabsTrigger>
              <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
              <TabsTrigger value="history">Solution History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="problems" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {problems.map((problem) => (
                  <Card key={problem.id} className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedProblem(problem)}>
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-600/5" />
                    <CardHeader className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(problem.status)}
                          <CardTitle className="text-lg">{problem.name}</CardTitle>
                        </div>
                        {getStatusBadge(problem.status)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {problem.description || 'No description provided'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getProblemTypeIcon(problem.type)}
                          <Badge variant="outline">{problem.type}</Badge>
                        </div>
                        {getDifficultyBadge(problem.difficulty)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p className="font-semibold">{problem.size}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Attempts</p>
                          <p className="font-semibold">{problem.attempts}</p>
                        </div>
                      </div>

                      {problem.bestSolution && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-xs text-muted-foreground">Best Solution</p>
                          <p className="font-semibold text-green-700 dark:text-green-400">
                            {problem.bestSolution.value.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {problem.bestSolution.time}ms • {problem.bestSolution.algorithm}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" onClick={(e) => {
                          e.stopPropagation();
                          // Open solve dialog with problem
                        }}>
                          <Play className="h-3 w-3 mr-1" />
                          Solve
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                        }}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                        }}>
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProblem(problem.id);
                        }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="solvers" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {configs.map((config) => (
                  <Card key={config.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {getAlgorithmIcon(config.algorithm)}
                            {config.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {config.description || 'No description provided'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={config.isActive ? "default" : "secondary"}>
                            {config.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Switch checked={config.isActive} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Algorithm</p>
                          <p className="font-semibold capitalize">{config.algorithm.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Max Iterations</p>
                          <p className="font-semibold">{config.parameters.maxIterations.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Success Rate</p>
                          <p className="font-semibold">{(config.performance.successRate * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Problems Solved</p>
                          <p className="font-semibold">{config.performance.problemsSolved}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-muted rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span>Temperature:</span>
                            <span className="font-medium">{config.parameters.temperature}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cooling Rate:</span>
                            <span className="font-medium">{config.parameters.coolingRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Prime Basis:</span>
                            <span className="font-medium">{config.parameters.primeBasisSize}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Resonance:</span>
                            <span className="font-medium">{config.parameters.resonanceThreshold}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-6">
              <div className="space-y-4">
                {solveJobs.map((job) => (
                  <Card key={job.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{job.problemName}</CardTitle>
                          <CardDescription>
                            Using {job.configName} • Started {new Date(job.startTime).toLocaleString()}
                            {job.estimatedCompletion && ` • ETA: ${job.estimatedCompletion}`}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(job.status)}
                          <Button size="sm" variant="outline">
                            <Pause className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleStopSolving(job.id)}>
                            <Square className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Solving Progress</span>
                            <span>{job.iterations}/{job.maxIterations} iterations</span>
                          </div>
                          <Progress value={job.progress} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Progress</p>
                            <p className="text-lg font-semibold">{job.progress.toFixed(1)}%</p>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Iterations</p>
                            <p className="text-lg font-semibold">{job.iterations}</p>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Current Value</p>
                            <p className="text-lg font-semibold">{job.currentValue?.toFixed(1) || 'N/A'}</p>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Best Value</p>
                            <p className="text-lg font-semibold">{job.bestValue?.toFixed(1) || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {solveJobs.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Cpu className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No active solving jobs. Start solving a problem to see progress here.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <div className="space-y-4">
                {solutionHistory.map((solution) => (
                  <Card key={solution.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Award className="h-5 w-5 text-yellow-500" />
                            {solution.problemName}
                          </CardTitle>
                          <CardDescription>
                            Solved on {new Date(solution.solvedAt).toLocaleString()} • {solution.time}ms
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getAlgorithmIcon(solution.algorithm)}
                          <Badge variant="outline">{solution.algorithm.replace('_', ' ')}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">Solution Value</p>
                          <p className="text-lg font-bold text-yellow-600">{solution.value.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">Solve Time</p>
                          <p className="text-lg font-bold text-blue-600">{solution.time}ms</p>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">Iterations</p>
                          <p className="text-lg font-bold text-green-600">{solution.iterations}</p>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">Algorithm</p>
                          <p className="text-lg font-bold text-purple-600">{getAlgorithmIcon(solution.algorithm)}</p>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Algorithm Parameters:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(solution.parameters).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {key}: {typeof value === 'number' ? value.toFixed(2) : String(value)}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Export Solution
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {solutionHistory.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No solution history yet. Solve some problems to see results here.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {selectedProblem && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Problem Statistics
                      </CardTitle>
                      <CardDescription>
                        Performance metrics for {selectedProblem.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">Problem Size</p>
                            <p className="text-2xl font-bold text-violet-600">{selectedProblem.size}</p>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">Solve Attempts</p>
                            <p className="text-2xl font-bold text-orange-600">{selectedProblem.attempts}</p>
                          </div>
                        </div>

                        {selectedProblem.bestSolution && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Best Solution Value</span>
                              <span className="font-semibold">{selectedProblem.bestSolution.value.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Solve Time</span>
                              <span className="font-semibold">{selectedProblem.bestSolution.time}ms</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Algorithm Used</span>
                              <Badge variant="outline">{selectedProblem.bestSolution.algorithm}</Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Solver Performance
                      </CardTitle>
                      <CardDescription>
                        Algorithm comparison and efficiency metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {configs.filter(c => c.isActive).map((config) => (
                          <div key={config.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{config.name}</span>
                              <div className="flex items-center gap-1">
                                {getAlgorithmIcon(config.algorithm)}
                                <Badge variant="outline" className="text-xs">
                                  {(config.performance.successRate * 100).toFixed(0)}%
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Avg: {config.performance.avgSolveTime}ms • Solved: {config.performance.problemsSolved}
                            </div>
                            <Progress
                              value={config.performance.successRate * 100}
                              className="mt-2 h-2"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        System Overview
                      </CardTitle>
                      <CardDescription>
                        Current system status and resource utilization
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Active Problems</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Problems</span>
                              <span className="font-medium">{problems.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Solved</span>
                              <span className="font-medium">{problems.filter(p => p.status === 'solved').length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Currently Solving</span>
                              <span className="font-medium">{problems.filter(p => p.status === 'solving').length}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Solver Configs</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Configs</span>
                              <span className="font-medium">{configs.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Active</span>
                              <span className="font-medium">{configs.filter(c => c.isActive).length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Best Success Rate</span>
                              <span className="font-medium">
                                {Math.max(...configs.map(c => c.performance.successRate * 100)).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Performance</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Active Jobs</span>
                              <span className="font-medium">{solveJobs.filter(j => j.status === 'running').length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Solutions</span>
                              <span className="font-medium">{solutionHistory.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Avg Solve Time</span>
                              <span className="font-medium">
                                {solutionHistory.length > 0
                                  ? Math.round(solutionHistory.reduce((acc, s) => acc + s.time, 0) / solutionHistory.length)
                                  : 0}ms
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {!selectedProblem && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select a problem to view detailed analytics and performance metrics.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </PageLayout>
  );
};

export default SRSManagement;