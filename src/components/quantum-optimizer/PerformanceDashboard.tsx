
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Timer, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Activity, 
  Cpu, 
  BarChart3, 
  Target, 
  PlayCircle, 
  PauseCircle, 
  RotateCcw,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Gauge
} from 'lucide-react';

interface PerformanceMetric {
  timestamp: number;
  quantumTime: number;
  classicalTime: number;
  quantumQuality: number;
  classicalQuality: number;
  quantumProgress: number;
  classicalProgress: number;
  quantumAdvantage: number;
}

interface SolverStatus {
  status: 'idle' | 'running' | 'completed' | 'error';
  startTime?: number;
  endTime?: number;
  currentIteration: number;
  totalIterations: number;
  bestSolution?: unknown;
  currentSolution?: unknown;
  error?: string;
}

interface ResourceUsage {
  cpuUsage: number;
  memoryUsage: number;
  quantumCircuitDepth: number;
  quantumGates: number;
  entanglementRate: number;
  coherenceTime: number;
}

interface PerformanceDashboardProps {
  problemType: 'TSP' | 'SubsetSum' | 'MaxClique' | '3SAT';
  problemSize: number;
  isActive: boolean;
  onStart?: () => void;
  onStop?: () => void;
  onReset?: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  problemType,
  problemSize,
  isActive,
  onStart,
  onStop,
  onReset
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [quantumStatus, setQuantumStatus] = useState<SolverStatus>({
    status: 'idle',
    currentIteration: 0,
    totalIterations: 1000
  });
  const [classicalStatus, setClassicalStatus] = useState<SolverStatus>({
    status: 'idle',
    currentIteration: 0,
    totalIterations: 1000
  });
  const [resourceUsage, setResourceUsage] = useState<ResourceUsage>({
    cpuUsage: 0,
    memoryUsage: 0,
    quantumCircuitDepth: 0,
    quantumGates: 0,
    entanglementRate: 0,
    coherenceTime: 100
  });
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isExpanded, setIsExpanded] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const metricsIntervalRef = useRef<NodeJS.Timeout>();

  // Simulate quantum and classical solver progress
  const simulateProgress = useCallback(() => {
    if (!isActive) return;

    const now = Date.now();
    
    // Update quantum solver status
    setQuantumStatus(prev => {
      if (prev.status !== 'running') return prev;
      
      const newIteration = Math.min(prev.currentIteration + Math.random() * 10, prev.totalIterations);
      const progress = newIteration / prev.totalIterations;
      
      return {
        ...prev,
        currentIteration: newIteration,
        status: progress >= 1 ? 'completed' : 'running'
      };
    });

    // Update classical solver status (slower progress)
    setClassicalStatus(prev => {
      if (prev.status !== 'running') return prev;
      
      const newIteration = Math.min(prev.currentIteration + Math.random() * 3, prev.totalIterations);
      const progress = newIteration / prev.totalIterations;
      
      return {
        ...prev,
        currentIteration: newIteration,
        status: progress >= 1 ? 'completed' : 'running'
      };
    });

    // Update resource usage
    setResourceUsage(prev => ({
      cpuUsage: Math.min(100, Math.max(0, prev.cpuUsage + (Math.random() - 0.5) * 20)),
      memoryUsage: Math.min(100, Math.max(0, prev.memoryUsage + (Math.random() - 0.5) * 15)),
      quantumCircuitDepth: prev.quantumCircuitDepth + Math.random() * 2,
      quantumGates: prev.quantumGates + Math.random() * 50,
      entanglementRate: Math.min(1, Math.max(0, prev.entanglementRate + (Math.random() - 0.5) * 0.1)),
      coherenceTime: Math.max(0, prev.coherenceTime - Math.random() * 0.5)
    }));

    // Add new performance metric
    const quantumTime = (now - (quantumStatus.startTime || now)) / 1000;
    const classicalTime = (now - (classicalStatus.startTime || now)) / 1000;
    const quantumProgress = quantumStatus.currentIteration / quantumStatus.totalIterations;
    const classicalProgress = classicalStatus.currentIteration / classicalStatus.totalIterations;
    
    const newMetric: PerformanceMetric = {
      timestamp: now,
      quantumTime,
      classicalTime,
      quantumQuality: Math.min(100, 60 + quantumProgress * 35 + Math.random() * 5),
      classicalQuality: Math.min(100, 45 + classicalProgress * 25 + Math.random() * 5),
      quantumProgress: quantumProgress * 100,
      classicalProgress: classicalProgress * 100,
      quantumAdvantage: classicalTime > 0 ? classicalTime / Math.max(quantumTime, 0.1) : 1
    };

    setMetrics(prev => [...prev.slice(-50), newMetric]);
  }, [isActive, quantumStatus.startTime, quantumStatus.currentIteration, quantumStatus.totalIterations, classicalStatus.startTime, classicalStatus.currentIteration, classicalStatus.totalIterations]);

  // Start simulation
  const startSimulation = () => {
    const now = Date.now();
    setQuantumStatus(prev => ({
      ...prev,
      status: 'running',
      startTime: now,
      currentIteration: 0
    }));
    setClassicalStatus(prev => ({
      ...prev,
      status: 'running',
      startTime: now,
      currentIteration: 0
    }));
    onStart?.();
  };

  // Stop simulation
  const stopSimulation = () => {
    setQuantumStatus(prev => ({
      ...prev,
      status: prev.status === 'running' ? 'idle' : prev.status,
      endTime: Date.now()
    }));
    setClassicalStatus(prev => ({
      ...prev,
      status: prev.status === 'running' ? 'idle' : prev.status,
      endTime: Date.now()
    }));
    onStop?.();
  };

  // Reset simulation
  const resetSimulation = () => {
    setQuantumStatus({
      status: 'idle',
      currentIteration: 0,
      totalIterations: 1000
    });
    setClassicalStatus({
      status: 'idle',
      currentIteration: 0,
      totalIterations: 1000
    });
    setMetrics([]);
    setResourceUsage({
      cpuUsage: 0,
      memoryUsage: 0,
      quantumCircuitDepth: 0,
      quantumGates: 0,
      entanglementRate: 0,
      coherenceTime: 100
    });
    onReset?.();
  };

  // Draw performance chart
  const drawPerformanceChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || metrics.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 5; i++) {
      const y = padding + (i * (height - 2 * padding)) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw quantum progress line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    metrics.forEach((metric, index) => {
      const x = padding + (index / (metrics.length - 1)) * (width - 2 * padding);
      const y = height - padding - (metric.quantumProgress / 100) * (height - 2 * padding);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw classical progress line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    metrics.forEach((metric, index) => {
      const x = padding + (index / (metrics.length - 1)) * (width - 2 * padding);
      const y = height - padding - (metric.classicalProgress / 100) * (height - 2 * padding);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText('Time', width / 2 - 15, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Progress %', -30, 0);
    ctx.restore();

    // Legend
    ctx.fillStyle = '#10b981';
    ctx.fillRect(width - 120, 20, 15, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Quantum', width - 100, 30);
    
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(width - 120, 40, 15, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Classical', width - 100, 50);
  };

  // Update metrics when active
  useEffect(() => {
    if (isActive && (quantumStatus.status === 'running' || classicalStatus.status === 'running')) {
      metricsIntervalRef.current = setInterval(simulateProgress, 200);
    } else {
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
    }

    return () => {
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
    };
  }, [isActive, quantumStatus.status, classicalStatus.status, simulateProgress]);

  // Draw chart when metrics update
  useEffect(() => {
    drawPerformanceChart();
  }, [metrics]);

  const getStatusIcon = (status: SolverStatus['status']) => {
    switch (status) {
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: SolverStatus['status']) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const currentMetric = metrics[metrics.length - 1];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Dashboard
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CardTitle>
              <CardDescription>
                Real-time comparison of quantum vs classical optimization for {problemType} (n={problemSize})
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={quantumStatus.status === 'running' ? stopSimulation : startSimulation}
                disabled={quantumStatus.status === 'completed'}
                className="flex items-center gap-2"
              >
                {quantumStatus.status === 'running' ? (
                  <>
                    <PauseCircle className="w-4 h-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    Start
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={resetSimulation}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {isExpanded && (
        <>
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Quantum Solver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(quantumStatus.status)}
                      <span className="text-sm capitalize">{quantumStatus.status}</span>
                    </div>
                  </div>
                  <Progress 
                    value={(quantumStatus.currentIteration / quantumStatus.totalIterations) * 100}
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500">
                    {quantumStatus.currentIteration.toFixed(0)}/{quantumStatus.totalIterations} iterations
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-red-500" />
                  Classical Solver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(classicalStatus.status)}
                      <span className="text-sm capitalize">{classicalStatus.status}</span>
                    </div>
                  </div>
                  <Progress 
                    value={(classicalStatus.currentIteration / classicalStatus.totalIterations) * 100}
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500">
                    {classicalStatus.currentIteration.toFixed(0)}/{classicalStatus.totalIterations} iterations
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Timer className="w-4 h-4 text-yellow-500" />
                  Elapsed Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-400">Quantum:</span>
                    <span>{currentMetric ? `${currentMetric.quantumTime.toFixed(1)}s` : '0.0s'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400">Classical:</span>
                    <span>{currentMetric ? `${currentMetric.classicalTime.toFixed(1)}s` : '0.0s'}</span>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    {currentMetric && currentMetric.quantumAdvantage > 1 ? (
                      <span className="text-green-400">
                        {currentMetric.quantumAdvantage.toFixed(1)}x speedup
                      </span>
                    ) : (
                      'Computing...'
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" />
                  Solution Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-400">Quantum:</span>
                    <span>{currentMetric ? `${currentMetric.quantumQuality.toFixed(1)}%` : '0%'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400">Classical:</span>
                    <span>{currentMetric ? `${currentMetric.classicalQuality.toFixed(1)}%` : '0%'}</span>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    {currentMetric && currentMetric.quantumQuality > currentMetric.classicalQuality ? (
                      <span className="text-green-400 flex items-center justify-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Quantum leads
                      </span>
                    ) : (
                      <span className="text-orange-400 flex items-center justify-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        Classical leads
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Dashboard */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Performance Overview</TabsTrigger>
              <TabsTrigger value="resources">Resource Usage</TabsTrigger>
              <TabsTrigger value="comparison">Detailed Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Progress Over Time</CardTitle>
                  <CardDescription>
                    Real-time comparison of optimization progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={300}
                    className="w-full border border-gray-700 rounded bg-gray-900"
                  />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Current Advantage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-mono text-green-400 mb-2">
                        {currentMetric ? `${currentMetric.quantumAdvantage.toFixed(1)}x` : '1.0x'}
                      </div>
                      <div className="text-xs text-gray-400">Quantum Speedup</div>
                      <Progress 
                        value={Math.min(100, (currentMetric?.quantumAdvantage || 1) * 10)}
                        className="mt-2 h-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Best Solutions Found</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-400">Quantum:</span>
                        <span className="font-mono">
                          {quantumStatus.currentIteration > 0 ? `${(95 + Math.random() * 5).toFixed(2)}%` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-400">Classical:</span>
                        <span className="font-mono">
                          {classicalStatus.currentIteration > 0 ? `${(80 + Math.random() * 10).toFixed(2)}%` : 'N/A'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 pt-1">
                        Objective function optimality
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Convergence Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-400">Quantum:</span>
                        <span className="font-mono">Fast</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-400">Classical:</span>
                        <span className="font-mono">Moderate</span>
                      </div>
                      <div className="text-xs text-gray-500 pt-1">
                        Solution improvement rate
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      CPU Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-mono mb-2">
                        {resourceUsage.cpuUsage.toFixed(1)}%
                      </div>
                      <Progress value={resourceUsage.cpuUsage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Memory Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-mono mb-2">
                        {resourceUsage.memoryUsage.toFixed(1)}%
                      </div>
                      <Progress value={resourceUsage.memoryUsage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      Circuit Depth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-mono mb-2">
                        {resourceUsage.quantumCircuitDepth.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-400">Quantum gates</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Entanglement Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-mono mb-2">
                        {(resourceUsage.entanglementRate * 100).toFixed(1)}%
                      </div>
                      <Progress value={resourceUsage.entanglementRate * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Coherence Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-mono mb-2">
                        {resourceUsage.coherenceTime.toFixed(1)}μs
                      </div>
                      <div className="text-xs text-gray-400">Remaining</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Quantum Gates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-mono mb-2">
                        {resourceUsage.quantumGates.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-400">Total executed</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="comparison" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quantum Algorithm Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Algorithm:</span>
                        <span className="font-mono">QAOA + VQE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Qubits:</span>
                        <span className="font-mono">{Math.ceil(Math.log2(problemSize))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Circuit Layers:</span>
                        <span className="font-mono">{Math.ceil(resourceUsage.quantumCircuitDepth / 10)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Optimization Method:</span>
                        <span className="font-mono">Hybrid</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Complexity:</span>
                        <span className="font-mono">O(2^(n/2))</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Classical Algorithm Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Algorithm:</span>
                        <span className="font-mono">
                          {problemType === 'TSP' ? 'Branch & Bound' :
                           problemType === 'SubsetSum' ? 'Dynamic Programming' :
                           problemType === 'MaxClique' ? 'Bron-Kerbosch' : 'DPLL'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Memory Usage:</span>
                        <span className="font-mono">O(2^n)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time Complexity:</span>
                        <span className="font-mono">
                          {problemType === 'TSP' ? 'O(n!)' :
                           problemType === 'SubsetSum' ? 'O(2^n)' :
                           problemType === 'MaxClique' ? 'O(2^n)' : 'O(2^n)'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Best Known:</span>
                        <span className="font-mono">
                          {problemType === 'TSP' ? 'Held-Karp O(n²2^n)' :
                           problemType === 'SubsetSum' ? 'Meet-in-middle' :
                           problemType === 'MaxClique' ? 'Parameterized' : 'Local Search'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">Quantum Advantages</h4>
                        <ul className="space-y-1 text-xs text-gray-300">
                          <li>• Parallel exploration via superposition</li>
                          <li>• Quantum interference for optimization</li>
                          <li>• Exponential state space coverage</li>
                          <li>• Adaptive parameter optimization</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-400 mb-2">Classical Limitations</h4>
                        <ul className="space-y-1 text-xs text-gray-300">
                          <li>• Sequential search strategies</li>
                          <li>• Exponential time complexity</li>
                          <li>• Limited parallel processing</li>
                          <li>• Local optima trapping</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                      <h4 className="text-sm font-semibold text-blue-300 mb-2">Current Performance</h4>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div className="text-center">
                          <div className="text-lg font-mono text-green-400">
                            {currentMetric ? `${currentMetric.quantumAdvantage.toFixed(1)}x` : '1.0x'}
                          </div>
                          <div className="text-gray-400">Speedup</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-mono text-blue-400">
                            {currentMetric ? `${(currentMetric.quantumQuality - currentMetric.classicalQuality).toFixed(1)}%` : '0%'}
                          </div>
                          <div className="text-gray-400">Quality Gain</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-mono text-purple-400">
                            {resourceUsage.quantumGates.toFixed(0)}
                          </div>
                          <div className="text-gray-400">Gates Used</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default PerformanceDashboard;