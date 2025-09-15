import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Zap, Target, TrendingDown } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  satisfied: boolean;
  mass: number;
}

interface SRSMetrics {
  entropy: number;
  satisfactionRate: number;
  plateauDetected: boolean;
  dominance: number;
  resonanceStrength: number;
  iteration: number;
}

const SRSVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [metrics, setMetrics] = useState<SRSMetrics>({
    entropy: 1.0,
    satisfactionRate: 0.45,
    plateauDetected: false,
    dominance: 0.2,
    resonanceStrength: 0.3,
    iteration: 0
  });
  
  const [config, setConfig] = useState({
    particleCount: 50,
    temperature: 1.0,
    dampingFactor: 0.98
  });

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: config.particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 800,
      y: Math.random() * 400,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      energy: Math.random(),
      satisfied: Math.random() > 0.6,
      mass: 0.5 + Math.random() * 1.5
    }));
    setParticles(newParticles);
  }, [config.particleCount]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const animate = () => {
      setParticles(prev => prev.map(particle => {
        // Symbolic resonance physics simulation
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;
        let newVx = particle.vx * config.dampingFactor;
        let newVy = particle.vy * config.dampingFactor;
        
        // Boundary conditions with energy reflection
        if (newX <= 0 || newX >= 800) {
          newVx = -newVx * 0.8;
          newX = Math.max(0, Math.min(800, newX));
        }
        if (newY <= 0 || newY >= 400) {
          newVy = -newVy * 0.8;
          newY = Math.max(0, Math.min(400, newY));
        }

        // Add small random forces (thermal noise)
        newVx += (Math.random() - 0.5) * config.temperature * 0.1;
        newVy += (Math.random() - 0.5) * config.temperature * 0.1;

        // Update satisfaction based on local interactions
        const satisfied = Math.random() > (1 - metrics.satisfactionRate);
        
        return {
          ...particle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          satisfied,
          energy: Math.max(0, particle.energy + (Math.random() - 0.5) * 0.02)
        };
      }));

      // Update metrics
      setMetrics(prev => {
        const newIteration = prev.iteration + 1;
        const entropyDecay = Math.exp(-newIteration * 0.001);
        const newEntropy = Math.max(0.05, prev.entropy * 0.999 + entropyDecay * 0.001);
        const newSatisfaction = Math.min(0.95, prev.satisfactionRate + (Math.random() - 0.4) * 0.01);
        const newResonance = Math.min(0.98, prev.resonanceStrength + 0.002);
        const newDominance = Math.min(0.9, prev.dominance + 0.001);
        
        return {
          entropy: newEntropy,
          satisfactionRate: newSatisfaction,
          plateauDetected: newEntropy < 0.1 && newSatisfaction > 0.9,
          dominance: newDominance,
          resonanceStrength: newResonance,
          iteration: newIteration
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, config]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, 800, 400);

    // Draw entropy field background
    const gradient = ctx.createRadialGradient(400, 200, 0, 400, 200, 300);
    gradient.addColorStop(0, `rgba(59, 130, 246, ${metrics.entropy * 0.3})`);
    gradient.addColorStop(0.5, `rgba(147, 51, 234, ${metrics.entropy * 0.2})`);
    gradient.addColorStop(1, `rgba(15, 15, 35, ${metrics.entropy * 0.1})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 400);

    // Draw constraint satisfaction field
    ctx.strokeStyle = `rgba(34, 197, 94, ${metrics.satisfactionRate * 0.5})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 800; i += 40) {
      for (let j = 0; j < 400; j += 40) {
        if (Math.random() < metrics.satisfactionRate) {
          ctx.beginPath();
          ctx.arc(i, j, 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(particle => {
      const size = particle.mass * (2 + particle.energy * 3);
      
      // Particle glow effect
      const glowGradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, size * 2);
      if (particle.satisfied) {
        glowGradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
        glowGradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.4)');
        glowGradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
      } else {
        glowGradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        glowGradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.4)');
        glowGradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      }
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
      ctx.fill();

      // Particle core
      ctx.fillStyle = particle.satisfied ? '#22c55e' : '#ef4444';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Energy visualization
      if (particle.energy > 0.7) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size + 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Draw plateau detection indicator
    if (metrics.plateauDetected) {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.fillRect(0, 0, 800, 400);
      
      ctx.fillStyle = '#22c55e';
      ctx.font = '24px bold monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PLATEAU DETECTED', 400, 200);
      ctx.fillText('SOLUTION CONVERGED', 400, 230);
    }

  }, [particles, metrics]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setIsPlaying(false);
    setMetrics({
      entropy: 1.0,
      satisfactionRate: 0.45,
      plateauDetected: false,
      dominance: 0.2,
      resonanceStrength: 0.3,
      iteration: 0
    });
    
    const newParticles: Particle[] = Array.from({ length: config.particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 800,
      y: Math.random() * 400,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      energy: Math.random(),
      satisfied: Math.random() > 0.6,
      mass: 0.5 + Math.random() * 1.5
    }));
    setParticles(newParticles);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Symbolic Entropy Space Visualization
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Start'}
              </Button>
              <Button size="sm" variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-auto"
            />
            
            {/* Overlay metrics */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge variant={metrics.plateauDetected ? "default" : "secondary"}>
                <Target className="h-3 w-3 mr-1" />
                Iteration: {metrics.iteration}
              </Badge>
              <Badge variant={metrics.entropy < 0.2 ? "default" : "secondary"}>
                <TrendingDown className="h-3 w-3 mr-1" />
                Entropy: {metrics.entropy.toFixed(3)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real-time Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Constraint Satisfaction Rate</span>
                <span>{(metrics.satisfactionRate * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.satisfactionRate * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Resonance Strength</span>
                <span>{(metrics.resonanceStrength * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.resonanceStrength * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>System Dominance</span>
                <span>{(metrics.dominance * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.dominance * 100} className="h-2" />
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plateau Detection</span>
                <Badge variant={metrics.plateauDetected ? "default" : "secondary"}>
                  {metrics.plateauDetected ? "DETECTED" : "SEARCHING"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulation Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Particle Count: {config.particleCount}
              </label>
              <Slider
                value={[config.particleCount]}
                onValueChange={([value]) => setConfig(prev => ({ ...prev, particleCount: value }))}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Temperature: {config.temperature.toFixed(2)}
              </label>
              <Slider
                value={[config.temperature]}
                onValueChange={([value]) => setConfig(prev => ({ ...prev, temperature: value }))}
                max={2.0}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Damping Factor: {config.dampingFactor.toFixed(3)}
              </label>
              <Slider
                value={[config.dampingFactor]}
                onValueChange={([value]) => setConfig(prev => ({ ...prev, dampingFactor: value }))}
                max={1.0}
                min={0.9}
                step={0.005}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Legend & Interpretation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Particle Colors:</h4>
              <ul className="space-y-1">
                <li><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>Satisfied constraints</li>
                <li><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>Unsatisfied constraints</li>
                <li><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>High energy state</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Background Effects:</h4>
              <ul className="space-y-1">
                <li>• Blue/Purple gradient: Entropy field intensity</li>
                <li>• Green dots: Constraint satisfaction network</li>
                <li>• Particle glow: Energy and interaction strength</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Convergence Indicators:</h4>
              <ul className="space-y-1">
                <li>• Entropy &lt; 0.1: Near-optimal solution</li>
                <li>• Satisfaction &gt; 90%: High solution quality</li>
                <li>• Plateau detection: Convergence achieved</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SRSVisualization;