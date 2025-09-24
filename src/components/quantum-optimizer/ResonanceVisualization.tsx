import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Activity, Zap, Target } from 'lucide-react';

interface ResonanceData {
  frequency: number;
  amplitude: number;
  phase: number;
  convergence: number;
  iteration: number;
  energy: number;
}

interface QuantumState {
  superposition: number[];
  entanglement: number;
  coherence: number;
  fidelity: number;
}

interface AlgorithmStep {
  step: number;
  name: string;
  description: string;
  completed: boolean;
  duration: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface OptimizationSolution {
  type: string;
  size: number;
  duration: number;
  convergence: number;
  quantumAdvantage: number;
}

interface ResonanceVisualizationProps {
  isActive?: boolean;
  problemType?: string;
  problemSize?: number;
  onProgress?: (progress: number) => void;
  onComplete?: (solution: OptimizationSolution) => void;
}

export const ResonanceVisualization: React.FC<ResonanceVisualizationProps> = ({
  isActive = false,
  problemType = 'TSP',
  problemSize = 25,
  onProgress,
  onComplete
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [resonanceData, setResonanceData] = useState<ResonanceData[]>([]);
  const [quantumState, setQuantumState] = useState<QuantumState>({
    superposition: [0.5, 0.5, 0.5, 0.5],
    entanglement: 0,
    coherence: 1.0,
    fidelity: 0
  });
  const [overallProgress, setOverallProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const algorithmSteps: AlgorithmStep[] = [
    {
      step: 1,
      name: "Quantum State Initialization",
      description: "Creating superposition of all possible solutions",
      completed: false,
      duration: 500,
      status: 'pending'
    },
    {
      step: 2,
      name: "Resonance Calibration",
      description: "Tuning quantum oscillators to problem frequency",
      completed: false,
      duration: 800,
      status: 'pending'
    },
    {
      step: 3,
      name: "Entanglement Formation",
      description: "Correlating quantum variables across solution space",
      completed: false,
      duration: 1200,
      status: 'pending'
    },
    {
      step: 4,
      name: "Amplitude Amplification",
      description: "Enhancing probability of optimal solutions",
      completed: false,
      duration: 1500,
      status: 'pending'
    },
    {
      step: 5,
      name: "Resonance Collapse",
      description: "Collapsing superposition to classical solution",
      completed: false,
      duration: 600,
      status: 'pending'
    },
    {
      step: 6,
      name: "Solution Validation",
      description: "Verifying quantum-classical consistency",
      completed: false,
      duration: 300,
      status: 'pending'
    }
  ];

  const [steps, setSteps] = useState<AlgorithmStep[]>(algorithmSteps);

  // Generate realistic resonance data
  const generateResonanceData = (iteration: number): ResonanceData => {
    const time = iteration * 0.1;
    const problemComplexity = Math.log(problemSize) / Math.log(2);
    
    // Simulate quantum resonance patterns
    const baseFreq = 2.5 + (problemComplexity * 0.3);
    const frequency = baseFreq + 0.5 * Math.sin(time * 0.8) + 0.2 * Math.sin(time * 2.1);
    
    const convergenceFactor = Math.min(iteration / 100, 1);
    const amplitude = Math.exp(-iteration * 0.01) * (1 + 0.3 * Math.sin(time * 1.5));
    
    const phase = (time * frequency * 2 * Math.PI) % (2 * Math.PI);
    const convergence = Math.min(Math.pow(convergenceFactor, 0.7) * 100, 95);
    
    // Energy decreases as we approach optimal solution
    const energy = 100 * Math.exp(-iteration * 0.02) + 5 * Math.random();

    return {
      frequency,
      amplitude,
      phase,
      convergence,
      iteration,
      energy
    };
  };

  // Update quantum state based on algorithm progress
  const updateQuantumState = (step: number, progress: number) => {
    const newState: QuantumState = { ...quantumState };
    
    switch (step) {
      case 0: // Initialization
        newState.superposition = [0.5, 0.5, 0.5, 0.5];
        newState.entanglement = progress * 0.2;
        newState.coherence = 1.0 - (progress * 0.1);
        break;
      case 1: // Calibration
        newState.entanglement = 0.2 + (progress * 0.3);
        newState.coherence = 0.9 - (progress * 0.1);
        break;
      case 2: // Entanglement
        newState.entanglement = 0.5 + (progress * 0.4);
        newState.superposition = newState.superposition.map((_, i) => 
          0.5 + 0.3 * Math.sin((progress + i) * Math.PI)
        );
        break;
      case 3: // Amplification
        newState.fidelity = progress * 0.8;
        newState.coherence = 0.8 - (progress * 0.2);
        break;
      case 4: // Collapse
        newState.superposition = newState.superposition.map(() => 
          Math.random() * (1 - progress) + progress
        );
        newState.entanglement = 0.9 * (1 - progress);
        newState.fidelity = 0.8 + (progress * 0.15);
        break;
      case 5: // Validation
        newState.fidelity = 0.95 + (progress * 0.05);
        newState.coherence = 0.1 + (progress * 0.1);
        break;
    }
    
    setQuantumState(newState);
  };

  // Draw resonance visualization
  const drawResonance = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    if (resonanceData.length === 0) return;

    // Draw resonance wave
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const latest = resonanceData[resonanceData.length - 1];
    const centerY = height / 2;
    const maxPoints = Math.min(resonanceData.length, width / 2);

    for (let i = 0; i < maxPoints; i++) {
      const dataIndex = Math.max(0, resonanceData.length - maxPoints + i);
      const data = resonanceData[dataIndex];
      const x = (i / maxPoints) * width;
      const y = centerY + (data.amplitude * 50 * Math.sin(data.phase));

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw frequency spectrum
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    for (let i = 0; i < maxPoints; i++) {
      const dataIndex = Math.max(0, resonanceData.length - maxPoints + i);
      const data = resonanceData[dataIndex];
      const x = (i / maxPoints) * width;
      const barHeight = (data.frequency / 5) * (height / 3);
      ctx.fillRect(x, height - barHeight, 2, barHeight);
    }

    // Draw convergence line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < maxPoints; i++) {
      const dataIndex = Math.max(0, resonanceData.length - maxPoints + i);
      const data = resonanceData[dataIndex];
      const x = (i / maxPoints) * width;
      const y = height - (data.convergence / 100) * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw current metrics
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(`Frequency: ${latest.frequency.toFixed(3)} Hz`, 10, 20);
    ctx.fillText(`Amplitude: ${latest.amplitude.toFixed(3)}`, 10, 35);
    ctx.fillText(`Convergence: ${latest.convergence.toFixed(1)}%`, 10, 50);
    ctx.fillText(`Energy: ${latest.energy.toFixed(1)} au`, 10, 65);
  };

  // Animation loop
  const animate = () => {
    if (!isRunning) return;

    const currentTime = Date.now();
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime;
    }

    const elapsed = currentTime - startTimeRef.current;
    setElapsedTime(elapsed);

    // Generate new resonance data
    const iteration = Math.floor(elapsed / 50);
    const newData = generateResonanceData(iteration);
    
    setResonanceData(prev => {
      const updated = [...prev, newData];
      return updated.slice(-200); // Keep last 200 data points
    });

    // Update algorithm steps
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    const stepProgress = elapsed / totalDuration;
    setOverallProgress(Math.min(stepProgress * 100, 100));

    // Determine current step
    let cumulativeDuration = 0;
    let activeStep = 0;
    
    for (let i = 0; i < steps.length; i++) {
      const stepEnd = cumulativeDuration + steps[i].duration;
      if (elapsed < stepEnd) {
        activeStep = i;
        break;
      }
      cumulativeDuration = stepEnd;
    }

    setCurrentStep(activeStep);

    // Update steps status
    setSteps(prevSteps => 
      prevSteps.map((step, index) => {
        let status: AlgorithmStep['status'] = 'pending';
        let completed = false;

        if (index < activeStep) {
          status = 'completed';
          completed = true;
        } else if (index === activeStep) {
          status = 'running';
        }

        return { ...step, status, completed };
      })
    );

    // Update quantum state
    const stepLocalProgress = (elapsed - cumulativeDuration) / (steps[activeStep]?.duration || 1);
    updateQuantumState(activeStep, Math.min(stepLocalProgress, 1));

    // Report progress
    onProgress?.(stepProgress * 100);

    // Check completion
    if (elapsed >= totalDuration) {
      setIsRunning(false);
      onComplete?.({
        type: problemType,
        size: problemSize,
        duration: elapsed,
        convergence: newData.convergence,
        quantumAdvantage: Math.random() * 500 + 100 // Simulated speedup
      });
      return;
    }

    drawResonance();
    animationRef.current = requestAnimationFrame(animate);
  };

  // Control functions
  const startAnimation = () => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now();
    }
  };

  const pauseAnimation = () => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const resetAnimation = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setResonanceData([]);
    setOverallProgress(0);
    setElapsedTime(0);
    setSteps(algorithmSteps);
    setQuantumState({
      superposition: [0.5, 0.5, 0.5, 0.5],
      entanglement: 0,
      coherence: 1.0,
      fidelity: 0
    });
    startTimeRef.current = undefined;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Effects
  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (isActive && !isRunning) {
      startAnimation();
    }
  }, [isActive]);

  // Render quantum state bars
  const renderQuantumState = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">Superposition</span>
        <div className="flex gap-1">
          {quantumState.superposition.map((value, i) => (
            <div
              key={i}
              className="w-4 h-6 bg-gray-700 relative overflow-hidden rounded-sm"
            >
              <div
                className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300"
                style={{ height: `${value * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Entanglement</span>
          <span className="text-sm font-mono">{(quantumState.entanglement * 100).toFixed(1)}%</span>
        </div>
        <Progress value={quantumState.entanglement * 100} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Coherence</span>
          <span className="text-sm font-mono">{(quantumState.coherence * 100).toFixed(1)}%</span>
        </div>
        <Progress value={quantumState.coherence * 100} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Fidelity</span>
          <span className="text-sm font-mono">{(quantumState.fidelity * 100).toFixed(1)}%</span>
        </div>
        <Progress value={quantumState.fidelity * 100} className="h-2" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Quantum Resonance Solver
              </CardTitle>
              <CardDescription>
                Real-time visualization of SRS algorithm progress for {problemType} ({problemSize} variables)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isRunning ? "secondary" : "default"}
                size="sm"
                onClick={isRunning ? pauseAnimation : startAnimation}
                disabled={overallProgress >= 100}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button variant="outline" size="sm" onClick={resetAnimation}>
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-400">
                  {(elapsedTime / 1000).toFixed(1)}s elapsed
                </span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>

            {/* Current Metrics */}
            {resonanceData.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-mono text-blue-400">
                    {resonanceData[resonanceData.length - 1].frequency.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">Frequency (Hz)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-mono text-green-400">
                    {resonanceData[resonanceData.length - 1].convergence.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">Convergence</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-mono text-purple-400">
                    {resonanceData[resonanceData.length - 1].amplitude.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">Amplitude</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-mono text-orange-400">
                    {resonanceData[resonanceData.length - 1].energy.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400">Energy (au)</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resonance Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Resonance Patterns
            </CardTitle>
            <CardDescription>
              Real-time quantum oscillation and convergence dynamics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              className="w-full border border-gray-700 rounded bg-gray-900"
            />
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-blue-500"></div>
                Resonance Wave
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-blue-400 opacity-50"></div>
                Frequency Spectrum
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-green-500"></div>
                Convergence
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quantum State */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quantum State
            </CardTitle>
            <CardDescription>
              Current quantum system parameters and coherence levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderQuantumState()}
          </CardContent>
        </Card>

        {/* Algorithm Steps */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Algorithm Execution Steps</CardTitle>
            <CardDescription>
              Detailed breakdown of quantum optimization phases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step.step}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    step.status === 'running'
                      ? 'border-blue-500 bg-blue-500/10'
                      : step.status === 'completed'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <Badge
                      variant={
                        step.status === 'running'
                          ? 'default'
                          : step.status === 'completed'
                          ? 'secondary'
                          : 'outline'
                      }
                      className={
                        step.status === 'running'
                          ? 'animate-pulse'
                          : ''
                      }
                    >
                      {step.step}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{step.name}</div>
                    <div className="text-sm text-gray-400">{step.description}</div>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-500">
                    {step.duration}ms
                  </div>
                  {step.status === 'running' && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                  {step.status === 'completed' && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResonanceVisualization;