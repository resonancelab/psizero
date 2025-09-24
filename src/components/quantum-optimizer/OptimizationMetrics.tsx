import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Zap, 
  BarChart3, 
  LineChart, 
  Activity, 
  CheckCircle, 
  AlertCircle,
  Download,
  RefreshCw,
  Trophy,
  Gauge
} from 'lucide-react';

interface MetricPoint {
  timestamp: number;
  value: number;
  iteration: number;
}

interface QualityMetrics {
  solutionQuality: number;
  optimality: number;
  feasibility: number;
  stability: number;
  robustness: number;
}

interface ConvergenceMetrics {
  convergenceRate: number;
  plateauDetection: boolean;
  oscillationLevel: number;
  improvementTrend: 'improving' | 'stable' | 'deteriorating';
  stagnationCounter: number;
}

interface PerformanceMetrics {
  executionTime: number;
  iterationsPerSecond: number;
  memoryUsage: number;
  energyEfficiency: number;
  scalabilityFactor: number;
}

interface OptimizationSolution {
  value: number;
  variables: number[] | boolean[];
  cost: number;
  feasible: boolean;
}

interface OptimizationSession {
  id: string;
  problemType: string;
  problemSize: number;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed' | 'paused';
  bestSolution?: OptimizationSolution;
  totalIterations: number;
  qualityHistory: MetricPoint[];
  convergenceHistory: MetricPoint[];
  performanceData: PerformanceMetrics;
}

interface OptimizationMetricsProps {
  session?: OptimizationSession;
  isActive?: boolean;
  onExport?: (data: OptimizationSession) => void;
  onReset?: () => void;
}

export const OptimizationMetrics: React.FC<OptimizationMetricsProps> = ({
  session,
  isActive = false,
  onExport,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentMetrics, setCurrentMetrics] = useState<QualityMetrics>({
    solutionQuality: 0,
    optimality: 0,
    feasibility: 100,
    stability: 50,
    robustness: 75
  });
  const [convergenceMetrics, setConvergenceMetrics] = useState<ConvergenceMetrics>({
    convergenceRate: 0,
    plateauDetection: false,
    oscillationLevel: 0,
    improvementTrend: 'improving',
    stagnationCounter: 0
  });
  const [realtimeData, setRealtimeData] = useState<MetricPoint[]>([]);
  
  const chartRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Generate realistic optimization metrics
  const generateMetrics = (iteration: number, problemType: string): QualityMetrics => {
    const progress = Math.min(iteration / 100, 1);
    const noise = (Math.random() - 0.5) * 10;
    
    // Different convergence patterns for different problems
    let baseQuality = 0;
    switch (problemType) {
      case 'TSP':
        baseQuality = 60 + progress * 35 + noise;
        break;
      case 'SubsetSum':
        baseQuality = 70 + progress * 25 + noise;
        break;
      case 'MaxClique':
        baseQuality = 50 + progress * 40 + noise;
        break;
      case '3SAT':
        baseQuality = progress > 0.7 ? 95 + noise : 20 + progress * 30 + noise;
        break;
      default:
        baseQuality = 50 + progress * 40 + noise;
    }

    return {
      solutionQuality: Math.max(0, Math.min(100, baseQuality)),
      optimality: Math.max(0, Math.min(100, baseQuality - 5 + Math.random() * 10)),
      feasibility: Math.random() > 0.1 ? 100 : 50 + Math.random() * 50,
      stability: Math.max(0, Math.min(100, 75 + Math.sin(iteration * 0.1) * 20)),
      robustness: Math.max(0, Math.min(100, 70 + progress * 20 + noise * 0.5))
    };
  };

  // Analyze convergence patterns
  const analyzeConvergence = (history: MetricPoint[]): ConvergenceMetrics => {
    if (history.length < 10) {
      return {
        convergenceRate: 0,
        plateauDetection: false,
        oscillationLevel: 0,
        improvementTrend: 'improving',
        stagnationCounter: 0
      };
    }

    const recent = history.slice(-10);
    const older = history.slice(-20, -10);
    
    const recentAvg = recent.reduce((sum, p) => sum + p.value, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, p) => sum + p.value, 0) / older.length : 0;
    
    // Calculate convergence rate
    const improvement = recentAvg - olderAvg;
    const convergenceRate = Math.max(0, improvement);
    
    // Detect plateau
    const variance = recent.reduce((sum, p) => sum + Math.pow(p.value - recentAvg, 2), 0) / recent.length;
    const plateauDetection = variance < 1 && improvement < 0.5;
    
    // Calculate oscillation
    let oscillationLevel = 0;
    for (let i = 1; i < recent.length; i++) {
      if ((recent[i].value - recent[i-1].value) * (recent[i-1].value - recent[i-2]?.value || 0) < 0) {
        oscillationLevel++;
      }
    }
    oscillationLevel = (oscillationLevel / (recent.length - 1)) * 100;
    
    // Determine trend
    let improvementTrend: 'improving' | 'stable' | 'deteriorating' = 'stable';
    if (improvement > 1) improvementTrend = 'improving';
    else if (improvement < -1) improvementTrend = 'deteriorating';
    
    // Count stagnation
    let stagnationCounter = 0;
    if (plateauDetection) {
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i].value < recentAvg - 2) {
          stagnationCounter = history.length - i - 1;
          break;
        }
      }
    }

    return {
      convergenceRate,
      plateauDetection,
      oscillationLevel,
      improvementTrend,
      stagnationCounter
    };
  };

  // Draw quality chart
  const drawQualityChart = () => {
    const canvas = chartRef.current;
    if (!canvas || realtimeData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i < width; i += width / 10) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i < height; i += height / 5) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw quality line
    if (realtimeData.length > 1) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const maxPoints = Math.min(realtimeData.length, 100);
      const dataSlice = realtimeData.slice(-maxPoints);
      
      dataSlice.forEach((point, index) => {
        const x = (index / (maxPoints - 1)) * width;
        const y = height - (point.value / 100) * height;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw points
      ctx.fillStyle = '#3b82f6';
      dataSlice.forEach((point, index) => {
        if (index % 5 === 0) { // Show every 5th point
          const x = (index / (maxPoints - 1)) * width;
          const y = height - (point.value / 100) * height;
          
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    }

    // Draw current value indicator
    if (realtimeData.length > 0) {
      const latest = realtimeData[realtimeData.length - 1];
      const y = height - (latest.value / 100) * height;
      
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Value label
      ctx.fillStyle = '#10b981';
      ctx.font = '12px monospace';
      ctx.fillText(`${latest.value.toFixed(1)}%`, width - 50, y - 5);
    }
  };

  // Update metrics in real-time
  useEffect(() => {
    if (!isActive || !session) return;

    const interval = setInterval(() => {
      const iteration = realtimeData.length;
      const newMetrics = generateMetrics(iteration, session.problemType);
      setCurrentMetrics(newMetrics);
      
      const newPoint: MetricPoint = {
        timestamp: Date.now(),
        value: newMetrics.solutionQuality,
        iteration
      };
      
      setRealtimeData(prev => {
        const updated = [...prev, newPoint];
        // Keep last 200 points
        return updated.slice(-200);
      });
      
      // Update convergence metrics
      setConvergenceMetrics(analyzeConvergence([...realtimeData, newPoint]));
    }, 500);

    return () => clearInterval(interval);
  }, [isActive, session, realtimeData]);

  // Draw chart
  useEffect(() => {
    drawQualityChart();
  }, [realtimeData]);

  const renderMetricCard = (
    title: string,
    value: number,
    unit: string = '%',
    icon: React.ReactNode,
    color: string = 'blue',
    target?: number
  ) => (
    <Card className="relative">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className={`text-2xl font-mono text-${color}-400`}>
            {value.toFixed(1)}{unit}
          </div>
          
          {target && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Target: {target}{unit}</span>
                <span className={value >= target ? 'text-green-400' : 'text-yellow-400'}>
                  {value >= target ? '✓' : '△'}
                </span>
              </div>
              <Progress value={Math.min((value / target) * 100, 100)} className="h-1" />
            </div>
          )}
        </div>
      </CardContent>
      
      {value >= 90 && (
        <div className="absolute top-2 right-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
        </div>
      )}
    </Card>
  );

  const renderConvergenceStatus = () => {
    const { convergenceRate, plateauDetection, improvementTrend, oscillationLevel } = convergenceMetrics;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Convergence Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-mono text-purple-400">
                {convergenceRate.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">Convergence Rate</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-mono text-orange-400">
                {oscillationLevel.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">Oscillation</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Plateau Detection</span>
              <Badge variant={plateauDetection ? "destructive" : "secondary"}>
                {plateauDetection ? 'Detected' : 'Normal'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Improvement Trend</span>
              <Badge variant={
                improvementTrend === 'improving' ? 'default' :
                improvementTrend === 'stable' ? 'secondary' : 'destructive'
              }>
                {improvementTrend}
              </Badge>
            </div>
          </div>
          
          {plateauDetection && (
            <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-400">
                Consider adjusting parameters or trying different approach
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!session) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">No Active Session</h3>
              <p className="text-gray-400">Start an optimization to see real-time metrics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="w-5 h-5" />
                Optimization Metrics
              </CardTitle>
              <CardDescription>
                Real-time tracking for {session.problemType} ({session.problemSize} variables)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {session.status === 'completed' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </Badge>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport?.(session)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-mono text-blue-400">
                {session.totalIterations.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Iterations</div>
            </div>
            
            <div>
              <div className="text-lg font-mono text-green-400">
                {session.endTime 
                  ? `${Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000)}s`
                  : `${Math.round((Date.now() - session.startTime.getTime()) / 1000)}s`
                }
              </div>
              <div className="text-xs text-gray-400">Runtime</div>
            </div>
            
            <div>
              <div className="text-lg font-mono text-purple-400">
                {session.performanceData.iterationsPerSecond.toFixed(1)}
              </div>
              <div className="text-xs text-gray-400">Iter/sec</div>
            </div>
            
            <div>
              <div className="text-lg font-mono text-orange-400">
                {session.performanceData.memoryUsage.toFixed(0)}MB
              </div>
              <div className="text-xs text-gray-400">Memory</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="convergence">Convergence</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderMetricCard(
              'Solution Quality',
              currentMetrics.solutionQuality,
              '%',
              <Target className="w-4 h-4" />,
              'blue',
              85
            )}
            
            {renderMetricCard(
              'Optimality',
              currentMetrics.optimality,
              '%',
              <TrendingUp className="w-4 h-4" />,
              'green',
              80
            )}
            
            {renderMetricCard(
              'Feasibility',
              currentMetrics.feasibility,
              '%',
              <CheckCircle className="w-4 h-4" />,
              'purple'
            )}
            
            {renderMetricCard(
              'Stability',
              currentMetrics.stability,
              '%',
              <Activity className="w-4 h-4" />,
              'orange',
              70
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  Quality Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <canvas
                  ref={chartRef}
                  width={400}
                  height={200}
                  className="w-full border border-gray-700 rounded bg-gray-900"
                />
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-blue-500"></div>
                    Quality Trend
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-green-500"></div>
                    Current Level
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Convergence Status */}
            {renderConvergenceStatus()}
          </div>
        </TabsContent>
        
        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderMetricCard(
              'Solution Quality',
              currentMetrics.solutionQuality,
              '%',
              <Target className="w-4 h-4" />,
              'blue',
              85
            )}
            
            {renderMetricCard(
              'Optimality Gap',
              100 - currentMetrics.optimality,
              '%',
              <TrendingUp className="w-4 h-4" />,
              'red'
            )}
            
            {renderMetricCard(
              'Robustness',
              currentMetrics.robustness,
              '%',
              <Activity className="w-4 h-4" />,
              'green',
              75
            )}
            
            {renderMetricCard(
              'Feasibility',
              currentMetrics.feasibility,
              '%',
              <CheckCircle className="w-4 h-4" />,
              'purple'
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Quality Breakdown</CardTitle>
              <CardDescription>
                Detailed analysis of solution characteristics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(currentMetrics).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-mono">{value.toFixed(1)}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="convergence" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderConvergenceStatus()}
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-mono text-blue-400">
                      {session.performanceData.energyEfficiency.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-400">Energy Efficiency</div>
                  </div>
                  
                  <div>
                    <div className="text-lg font-mono text-green-400">
                      {session.performanceData.scalabilityFactor.toFixed(2)}x
                    </div>
                    <div className="text-xs text-gray-400">Scalability</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Convergence Progress</span>
                    <span>{Math.min(convergenceMetrics.convergenceRate * 10, 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={Math.min(convergenceMetrics.convergenceRate * 10, 100)} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizationMetrics;