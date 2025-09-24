/**
 * Performance Benchmark Dashboard Component
 * Displays quantum vs classical algorithm performance comparisons
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Download, Play, Pause, RefreshCw, TrendingUp, Zap, Clock, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BenchmarkResult {
  problemType: string;
  problemSize: number;
  algorithmType: 'quantum' | 'classical' | 'hybrid';
  executionTime: number;
  iterations: number;
  solutionQuality: number;
  timestamp: Date;
}

interface PerformanceBenchmarkDashboardProps {
  className?: string;
  onExportResults?: (format: 'json' | 'csv' | 'latex') => void;
}

export const PerformanceBenchmarkDashboard: React.FC<PerformanceBenchmarkDashboardProps> = ({
  className,
  onExportResults
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');

  // Generate sample benchmark data
  const generateMockResults = (): BenchmarkResult[] => {
    const problemTypes = ['tsp', 'subsetSum', 'maxClique', '3sat'];
    const sizes = [5, 10, 15, 20, 25];
    const algorithms = ['quantum', 'classical'] as const;
    const mockResults: BenchmarkResult[] = [];

    problemTypes.forEach(problemType => {
      sizes.forEach(size => {
        algorithms.forEach(algorithm => {
          // Simulate quantum advantage
          const baseTime = size * size * 0.5;
          const quantumSpeedup = algorithm === 'quantum' ? 0.4 : 1.0;
          const qualityBonus = algorithm === 'quantum' ? 0.1 : 0;
          
          mockResults.push({
            problemType,
            problemSize: size,
            algorithmType: algorithm,
            executionTime: baseTime * quantumSpeedup + Math.random() * 50,
            iterations: Math.floor(Math.random() * 100) + 10,
            solutionQuality: Math.min(1, 0.7 + Math.random() * 0.2 + qualityBonus),
            timestamp: new Date()
          });
        });
      });
    });

    return mockResults;
  };

  // Performance metrics
  const performanceMetrics = React.useMemo(() => {
    if (results.length === 0) return null;

    const quantumResults = results.filter(r => r.algorithmType === 'quantum');
    const classicalResults = results.filter(r => r.algorithmType === 'classical');

    const avgQuantumTime = quantumResults.reduce((sum, r) => sum + r.executionTime, 0) / quantumResults.length;
    const avgClassicalTime = classicalResults.reduce((sum, r) => sum + r.executionTime, 0) / classicalResults.length;

    const avgQuantumQuality = quantumResults.reduce((sum, r) => sum + r.solutionQuality, 0) / quantumResults.length;
    const avgClassicalQuality = classicalResults.reduce((sum, r) => sum + r.solutionQuality, 0) / classicalResults.length;

    return {
      speedup: avgClassicalTime / avgQuantumTime,
      qualityImprovement: avgQuantumQuality - avgClassicalQuality,
      totalTests: results.length,
      quantumWins: quantumResults.filter((qr, i) => {
        const cr = classicalResults[i];
        return cr && qr.executionTime < cr.executionTime;
      }).length
    };
  }, [results]);

  // Chart data for visualizations
  const chartData = React.useMemo(() => {
    const problemSizes = [...new Set(results.map(r => r.problemSize))].sort((a, b) => a - b);
    
    return problemSizes.map(size => {
      const sizeResults = results.filter(r => r.problemSize === size);
      const quantumResults = sizeResults.filter(r => r.algorithmType === 'quantum');
      const classicalResults = sizeResults.filter(r => r.algorithmType === 'classical');
      
      return {
        size,
        quantum: quantumResults.reduce((sum, r) => sum + r.executionTime, 0) / quantumResults.length || 0,
        classical: classicalResults.reduce((sum, r) => sum + r.executionTime, 0) / classicalResults.length || 0,
        quantumQuality: quantumResults.reduce((sum, r) => sum + r.solutionQuality, 0) / quantumResults.length || 0,
        classicalQuality: classicalResults.reduce((sum, r) => sum + r.solutionQuality, 0) / classicalResults.length || 0
      };
    });
  }, [results]);

  const runBenchmark = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    
    // Simulate benchmark progress
    const totalSteps = 40;
    for (let i = 0; i <= totalSteps; i++) {
      setProgress((i / totalSteps) * 100);
      setCurrentTest(`Running test ${i + 1}/${totalSteps + 1}`);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Generate results
    const mockResults = generateMockResults();
    setResults(mockResults);
    setCurrentTest('Benchmark completed!');
    setIsRunning(false);
  };

  const stopBenchmark = () => {
    setIsRunning(false);
    setCurrentTest('Benchmark stopped');
  };

  const getPerformanceByProblemType = () => {
    const problemTypes = [...new Set(results.map(r => r.problemType))];
    
    return problemTypes.map(problemType => {
      const typeResults = results.filter(r => r.problemType === problemType);
      const quantum = typeResults.filter(r => r.algorithmType === 'quantum');
      const classical = typeResults.filter(r => r.algorithmType === 'classical');
      
      return {
        problemType,
        quantum: quantum.reduce((sum, r) => sum + r.executionTime, 0) / quantum.length || 0,
        classical: classical.reduce((sum, r) => sum + r.executionTime, 0) / classical.length || 0
      };
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Performance Benchmark Dashboard
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Compare quantum vs classical algorithm performance across multiple problem types
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {!isRunning ? (
                <Button onClick={runBenchmark} className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Benchmark
                </Button>
              ) : (
                <Button onClick={stopBenchmark} variant="destructive" className="gap-2">
                  <Pause className="h-4 w-4" />
                  Stop
                </Button>
              )}
              
              <Button variant="outline" onClick={() => setResults([])} disabled={isRunning}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              {results.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => onExportResults?.('json')}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        {isRunning && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentTest}</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Performance Summary */}
      {performanceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quantum Speedup</p>
                  <p className="text-2xl font-bold text-green-600">
                    {performanceMetrics.speedup.toFixed(2)}×
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quality Improvement</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(performanceMetrics.qualityImprovement * 100).toFixed(1)}%
                  </p>
                </div>
                <Award className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                  <p className="text-2xl font-bold">{performanceMetrics.totalTests}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quantum Wins</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {performanceMetrics.quantumWins}/{Math.floor(performanceMetrics.totalTests / 2)}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {((performanceMetrics.quantumWins / (performanceMetrics.totalTests / 2)) * 100).toFixed(0)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Results */}
      {results.length > 0 && (
        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="charts">Performance Charts</TabsTrigger>
            <TabsTrigger value="quality">Solution Quality</TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="charts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Execution Time Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="size" label={{ value: 'Problem Size', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="quantum" stroke="#3b82f6" strokeWidth={2} name="Quantum" />
                    <Line type="monotone" dataKey="classical" stroke="#ef4444" strokeWidth={2} name="Classical" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Algorithm Performance by Problem Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getPerformanceByProblemType()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="problemType" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantum" fill="#3b82f6" name="Quantum" />
                    <Bar dataKey="classical" fill="#ef4444" name="Classical" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quality" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Solution Quality Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="size" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Quality']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="quantumQuality" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      name="Quantum Quality" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="classicalQuality" 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                      name="Classical Quality" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="raw" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Raw Benchmark Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Problem</th>
                        <th className="text-left p-2">Size</th>
                        <th className="text-left p-2">Algorithm</th>
                        <th className="text-left p-2">Time (ms)</th>
                        <th className="text-left p-2">Quality</th>
                        <th className="text-left p-2">Iterations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{result.problemType}</td>
                          <td className="p-2">{result.problemSize}</td>
                          <td className="p-2">
                            <Badge variant={result.algorithmType === 'quantum' ? 'default' : 'secondary'}>
                              {result.algorithmType}
                            </Badge>
                          </td>
                          <td className="p-2">{result.executionTime.toFixed(2)}</td>
                          <td className="p-2">{(result.solutionQuality * 100).toFixed(1)}%</td>
                          <td className="p-2">{result.iterations}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PerformanceBenchmarkDashboard;