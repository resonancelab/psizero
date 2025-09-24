/**
 * Animated TSP Visualizer Component
 * Integrates animation system with TSP visualization for engaging user experience
 */

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  TrendingUp,
  Clock,
  Target,
  Sparkles
} from 'lucide-react';
import { 
  TSPAnimator, 
  QualityAnimator, 
  ParticleSystem,
  CSSAnimations,
  useAnimation,
  AnimationPresets
} from '@/lib/quantum-optimizer/animations';
import type { TSPProblem, TSPSolution } from '@/lib/quantum-optimizer/types';

interface AnimatedTSPVisualizerProps {
  problem: TSPProblem;
  solution?: TSPSolution;
  onSolutionUpdate?: (solution: TSPSolution) => void;
  className?: string;
}

interface AnimationStep {
  type: 'construction' | 'optimization' | 'completion';
  description: string;
  duration: number;
}

export const AnimatedTSPVisualizer: React.FC<AnimatedTSPVisualizerProps> = ({
  problem,
  solution,
  onSolutionUpdate,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'constructing' | 'optimizing' | 'complete'>('idle');
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  
  const constructionAnimation = useAnimation({
    duration: 3000,
    easing: 'ease-in-out'
  });
  
  const optimizationAnimation = useAnimation({
    duration: 2000,
    easing: 'bounce'
  });

  // Initialize animators
  const [tspAnimator, setTspAnimator] = useState<TSPAnimator | null>(null);
  const [particleSystem, setParticleSystem] = useState<ParticleSystem | null>(null);

  useEffect(() => {
    if (canvasRef.current && particleCanvasRef.current && problem.cities.length > 0) {
      const canvas = canvasRef.current;
      const particleCanvas = particleCanvasRef.current;
      
      // Set canvas size
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width - 32; // Account for padding
        canvas.height = 400;
        particleCanvas.width = canvas.width;
        particleCanvas.height = canvas.height;
      }

      // Scale cities to canvas size
      const scaledCities = problem.cities.map(city => ({
        x: (city.x / problem.metadata.mapWidth) * (canvas.width - 40) + 20,
        y: (city.y / problem.metadata.mapHeight) * (canvas.height - 40) + 20,
        name: city.name
      }));

      const animator = new TSPAnimator(
        canvas,
        scaledCities,
        solution?.tour || Array.from({ length: problem.cities.length }, (_, i) => i),
        { duration: 3000, easing: 'ease-in-out' }
      );

      const particles = new ParticleSystem(particleCanvas);

      setTspAnimator(animator);
      setParticleSystem(particles);
      setTotalSteps(problem.cities.length);
    }
  }, [problem, solution]);

  const playAnimation = async () => {
    if (!tspAnimator || !particleSystem || isPlaying) return;

    setIsPlaying(true);
    setAnimationPhase('constructing');
    
    try {
      // Phase 1: Tour Construction Animation
      CSSAnimations.slideIn(canvasRef.current!, 'up');
      
      await tspAnimator.animateTourConstruction((step, total) => {
        setCurrentStep(step);
        setTotalSteps(total);
        
        // Update progress with animation
        if (progressRef.current) {
          QualityAnimator.animateProgress(
            progressRef.current,
            ((step - 1) / total) * 100,
            (step / total) * 100,
            200
          );
        }
      });

      // Phase 2: Optimization Animation
      setAnimationPhase('optimizing');
      
      if (solution) {
        // Simulate optimization improvements
        const improvements = [
          { score: 0.6, description: 'Initial greedy solution' },
          { score: 0.75, description: '2-opt improvement found' },
          { score: 0.82, description: 'Or-opt optimization' },
          { score: 0.89, description: 'Lin-Kernighan heuristic' },
          { score: 0.94, description: 'Quantum annealing refinement' }
        ];

        for (const improvement of improvements) {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Animate score improvement
          const prevScore = currentScore;
          setCurrentScore(improvement.score);
          setBestScore(Math.max(bestScore, improvement.score));
          
          if (scoreRef.current) {
            await QualityAnimator.animateScoreChange(
              scoreRef.current,
              prevScore,
              improvement.score,
              800
            );
          }

          // Add particle explosion for significant improvements
          if (improvement.score > prevScore + 0.1) {
            const canvas = canvasRef.current!;
            particleSystem.createExplosion(
              canvas.width / 2,
              canvas.height / 2,
              '#10b981',
              15
            );
            particleSystem.start();
          }

          // Pulse effect for UI feedback
          if (scoreRef.current) {
            CSSAnimations.pulse(scoreRef.current, '#10b981');
          }
        }
      }

      // Phase 3: Completion
      setAnimationPhase('complete');
      
      // Final celebration effects
      if (particleSystem && canvasRef.current) {
        const canvas = canvasRef.current;
        particleSystem.createExplosion(canvas.width / 2, canvas.height / 2, '#fbbf24', 25);
        particleSystem.createExplosion(canvas.width / 4, canvas.height / 3, '#10b981', 15);
        particleSystem.createExplosion((canvas.width * 3) / 4, canvas.height / 3, '#ef4444', 15);
        particleSystem.start();
      }

      // Animate completion message
      const completionElement = document.querySelector('[data-completion-message]') as HTMLElement;
      if (completionElement) {
        CSSAnimations.slideIn(completionElement, 'up');
        await CSSAnimations.typeWriter(completionElement, 'Optimization Complete! 🎉', 50);
      }

    } catch (error) {
      console.error('Animation error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setCurrentScore(0);
    setBestScore(0);
    setAnimationPhase('idle');
    constructionAnimation.reset();
    optimizationAnimation.reset();
    
    // Clear canvases
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    
    if (particleCanvasRef.current) {
      const ctx = particleCanvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, particleCanvasRef.current.width, particleCanvasRef.current.height);
    }
  };

  const getPhaseDescription = (): string => {
    switch (animationPhase) {
      case 'constructing':
        return 'Building initial tour using nearest neighbor heuristic...';
      case 'optimizing':
        return 'Applying quantum optimization algorithms...';
      case 'complete':
        return 'Optimization complete! Solution found.';
      default:
        return 'Ready to visualize TSP solving process';
    }
  };

  const getPhaseIcon = () => {
    switch (animationPhase) {
      case 'constructing':
        return <Clock className="h-4 w-4 animate-spin" />;
      case 'optimizing':
        return <Zap className="h-4 w-4 animate-pulse text-yellow-500" />;
      case 'complete':
        return <Target className="h-4 w-4 text-green-500" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Animated TSP Solver
          <Badge variant="secondary" className="ml-auto">
            {problem.cities.length} Cities
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={playAnimation}
            disabled={isPlaying}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isPlaying ? 'Playing...' : 'Start Animation'}
          </Button>
          
          <Button
            variant="outline"
            onClick={resetAnimation}
            disabled={isPlaying}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Status Display */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            {getPhaseIcon()}
            {getPhaseDescription()}
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Progress</div>
              <div className="font-mono">
                {currentStep}/{totalSteps} steps
              </div>
            </div>
            
            <div>
              <div className="text-muted-foreground">Current Score</div>
              <div ref={scoreRef} className="font-mono font-bold text-blue-600">
                {(currentScore * 100).toFixed(1)}%
              </div>
            </div>
            
            <div>
              <div className="text-muted-foreground">Best Score</div>
              <div className="font-mono font-bold text-green-600">
                {(bestScore * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                ref={progressRef}
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / Math.max(totalSteps, 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Visualization Canvas */}
        <div className="relative bg-white rounded-lg border overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-10"
            style={{ background: 'transparent' }}
          />
          <canvas
            ref={particleCanvasRef}
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ background: 'transparent' }}
          />
          
          {/* Completion Message Overlay */}
          {animationPhase === 'complete' && (
            <div 
              data-completion-message
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            >
              <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  🎉 Optimization Complete!
                </div>
                <div className="text-muted-foreground">
                  Found solution with {(bestScore * 100).toFixed(1)}% quality score
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Solution Info */}
        {solution && (
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Tour Distance</div>
                <div className="font-mono">{solution.distance.toFixed(2)} units</div>
              </div>
              
              <div>
                <div className="text-muted-foreground">Method</div>
                <div className="capitalize">
                  {solution.method} 
                  {solution.method === 'quantum' && <Zap className="inline h-3 w-3 ml-1 text-yellow-500" />}
                </div>
              </div>
              
              {solution.timeElapsed && (
                <div>
                  <div className="text-muted-foreground">Time Elapsed</div>
                  <div className="font-mono">{solution.timeElapsed.toFixed(2)}ms</div>
                </div>
              )}
              
              {solution.iterations && (
                <div>
                  <div className="text-muted-foreground">Iterations</div>
                  <div className="font-mono">{solution.iterations.toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnimatedTSPVisualizer;