import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Globe, Atom, Zap, Play, Pause, RotateCcw, Settings, TrendingUp, Activity } from "lucide-react";

interface ObserverState {
  id: string;
  position: { x: number; y: number; z: number };
  mass: number;
  entropy: number;
  coupling: number;
  gravityField: number;
  velocity: { x: number; y: number; z: number };
}

interface GravityField {
  x: number;
  y: number;
  strength: number;
  gradient: number;
  curvature: number;
}

const UnifiedPhysicsVisualization = () => {
  const canvasGravityRef = useRef<HTMLCanvasElement>(null);
  const canvasCouplingRef = useRef<HTMLCanvasElement>(null);
  const canvasEvolutionRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [observers, setObservers] = useState<ObserverState[]>([]);
  const [gravityField, setGravityField] = useState<GravityField[][]>([]);
  const [time, setTime] = useState(0);
  
  const [parameters, setParameters] = useState({
    observerCount: 5,
    entropyCoefficient: 0.75,
    couplingStrength: 0.85,
    gravityConstant: 6.674e-11,
    fieldResolution: 20,
    timeStep: 0.01
  });

  const [metrics, setMetrics] = useState({
    totalEntropy: 0,
    averageCoupling: 0,
    fieldStrength: 0,
    gravityConstant: 6.674e-11,
    emergentForce: 0,
    systemCoherence: 0
  });

  // Initialize observers and gravity field
  useEffect(() => {
    const newObservers: ObserverState[] = [];
    
    for (let i = 0; i < parameters.observerCount; i++) {
      const angle = (i / parameters.observerCount) * 2 * Math.PI;
      const radius = 50 + Math.random() * 100;
      
      newObservers.push({
        id: `observer-${i}`,
        position: {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: (Math.random() - 0.5) * 20
        },
        mass: 1 + Math.random() * 4,
        entropy: Math.random() * 0.5 + 0.3,
        coupling: Math.random() * 0.4 + 0.5,
        gravityField: 0,
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
          z: (Math.random() - 0.5) * 0.5
        }
      });
    }
    
    setObservers(newObservers);
    
    // Initialize gravity field grid
    const fieldGrid: GravityField[][] = [];
    for (let x = 0; x < parameters.fieldResolution; x++) {
      fieldGrid[x] = [];
      for (let y = 0; y < parameters.fieldResolution; y++) {
        fieldGrid[x][y] = {
          x: (x / parameters.fieldResolution - 0.5) * 400,
          y: (y / parameters.fieldResolution - 0.5) * 400,
          strength: 0,
          gradient: 0,
          curvature: 0
        };
      }
    }
    setGravityField(fieldGrid);
  }, [parameters.observerCount, parameters.fieldResolution]);

  // Physics simulation
  useEffect(() => {
    if (!isPlaying) return;
    
    const simulate = () => {
      setTime(prev => prev + parameters.timeStep);
      
      setObservers(prevObservers => {
        return prevObservers.map(observer => {
          // Observer-entropy coupling evolution
          const entropyFluctuation = Math.sin(time * 2 + observer.mass) * 0.02;
          const newEntropy = Math.max(0.1, Math.min(1.0, 
            observer.entropy + entropyFluctuation
          ));
          
          // Coupling strength based on entropy and proximity to other observers
          let proximityEffect = 0;
          prevObservers.forEach(other => {
            if (other.id !== observer.id) {
              const dx = observer.position.x - other.position.x;
              const dy = observer.position.y - other.position.y;
              const dz = observer.position.z - other.position.z;
              const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
              
              if (distance > 0) {
                proximityEffect += (1 / (distance + 1)) * other.entropy * 0.1;
              }
            }
          });
          
          const newCoupling = Math.max(0.1, Math.min(1.0,
            observer.coupling * 0.99 + proximityEffect + 
            newEntropy * parameters.entropyCoefficient * 0.01
          ));
          
          // Emergent gravity field calculation
          let gravityContribution = 0;
          prevObservers.forEach(other => {
            if (other.id !== observer.id) {
              const dx = observer.position.x - other.position.x;
              const dy = observer.position.y - other.position.y;
              const dz = observer.position.z - other.position.z;
              const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
              
              if (distance > 0) {
                // Modified gravity with observer-entropy coupling
                const coupledMass = other.mass * (1 + other.entropy * newCoupling);
                gravityContribution += (parameters.gravityConstant * coupledMass) / (distance * distance);
              }
            }
          });
          
          // Update position based on emergent forces
          const forceX = -observer.position.x * gravityContribution * 0.00001;
          const forceY = -observer.position.y * gravityContribution * 0.00001;
          const forceZ = -observer.position.z * gravityContribution * 0.00001;
          
          const newVelocity = {
            x: observer.velocity.x * 0.99 + forceX * parameters.timeStep,
            y: observer.velocity.y * 0.99 + forceY * parameters.timeStep,
            z: observer.velocity.z * 0.99 + forceZ * parameters.timeStep
          };
          
          const newPosition = {
            x: observer.position.x + newVelocity.x * parameters.timeStep * 10,
            y: observer.position.y + newVelocity.y * parameters.timeStep * 10,
            z: observer.position.z + newVelocity.z * parameters.timeStep * 10
          };
          
          return {
            ...observer,
            entropy: newEntropy,
            coupling: newCoupling,
            gravityField: gravityContribution,
            position: newPosition,
            velocity: newVelocity
          };
        });
      });

      // Update gravity field grid
      setGravityField(prevField => {
        return prevField.map(row => 
          row.map(cell => {
            let totalStrength = 0;
            let totalGradient = 0;
            
            observers.forEach(observer => {
              const dx = cell.x - observer.position.x;
              const dy = cell.y - observer.position.y;
              const distance = Math.sqrt(dx*dx + dy*dy);
              
              if (distance > 0) {
                const coupledMass = observer.mass * (1 + observer.entropy * observer.coupling);
                const fieldStrength = (parameters.gravityConstant * coupledMass) / (distance * distance);
                totalStrength += fieldStrength;
                totalGradient += fieldStrength / distance;
              }
            });
            
            return {
              ...cell,
              strength: totalStrength,
              gradient: totalGradient,
              curvature: totalGradient * 0.1
            };
          })
        );
      });

      // Update metrics
      setMetrics(prev => {
        const totalEntropy = observers.reduce((sum, obs) => sum + obs.entropy, 0);
        const avgCoupling = observers.reduce((sum, obs) => sum + obs.coupling, 0) / observers.length;
        const maxField = Math.max(...observers.map(obs => obs.gravityField));
        
        // Dynamic gravity constant based on observer-entropy coupling
        const dynamicG = parameters.gravityConstant * (1 + avgCoupling * totalEntropy * 0.1);
        
        const emergentForce = observers.reduce((sum, obs) => 
          sum + Math.sqrt(obs.velocity.x**2 + obs.velocity.y**2 + obs.velocity.z**2), 0
        );
        
        const systemCoherence = avgCoupling * (totalEntropy / observers.length);
        
        return {
          totalEntropy,
          averageCoupling: avgCoupling,
          fieldStrength: maxField,
          gravityConstant: dynamicG,
          emergentForce,
          systemCoherence
        };
      });

      animationRef.current = requestAnimationFrame(simulate);
    };
    
    animationRef.current = requestAnimationFrame(simulate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, parameters, observers, time]);

  // Gravity field heatmap visualization
  useEffect(() => {
    const canvas = canvasGravityRef.current;
    if (!canvas || !gravityField.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellWidth = canvas.width / parameters.fieldResolution;
    const cellHeight = canvas.height / parameters.fieldResolution;

    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Find max field strength for normalization
    const maxStrength = Math.max(...gravityField.flat().map(cell => cell.strength));

    // Draw gravity field heatmap
    gravityField.forEach((row, x) => {
      row.forEach((cell, y) => {
        const intensity = maxStrength > 0 ? Math.min(1, cell.strength / maxStrength) : 0;
        const hue = 240 - (intensity * 60); // Blue to red gradient
        const saturation = Math.min(100, intensity * 100);
        const lightness = 20 + intensity * 60;
        
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fillRect(
          x * cellWidth, 
          y * cellHeight, 
          cellWidth, 
          cellHeight
        );

        // Add curvature indicators for strong fields
        if (intensity > 0.5) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          const centerX = x * cellWidth + cellWidth / 2;
          const centerY = y * cellHeight + cellHeight / 2;
          const radius = intensity * 5;
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    });

    // Draw observers
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = canvas.width / 400;

    observers.forEach(observer => {
      const x = centerX + observer.position.x * scale;
      const y = centerY + observer.position.y * scale;
      const size = 4 + observer.mass * 3;
      
      // Observer field
      const fieldGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
      const fieldColor = `hsl(${60 + observer.entropy * 120}, 80%, 60%)`;
      fieldGradient.addColorStop(0, `${fieldColor}80`);
      fieldGradient.addColorStop(1, `${fieldColor}00`);
      
      ctx.fillStyle = fieldGradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Observer core
      ctx.fillStyle = fieldColor;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Coupling indicator
      if (observer.coupling > 0.7) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, size + 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

  }, [gravityField, observers, parameters.fieldResolution]);

  // Observer-entropy coupling visualization
  useEffect(() => {
    const canvas = canvasCouplingRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with coupling field
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, `rgba(75, 0, 130, ${metrics.systemCoherence * 0.3})`);
    gradient.addColorStop(1, `rgba(25, 25, 112, ${metrics.systemCoherence * 0.2})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw coupling network
    for (let i = 0; i < observers.length; i++) {
      for (let j = i + 1; j < observers.length; j++) {
        const obs1 = observers[i];
        const obs2 = observers[j];
        
        const dx = obs1.position.x - obs2.position.x;
        const dy = obs1.position.y - obs2.position.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < 150) {
          const coupling = (obs1.coupling + obs2.coupling) / 2;
          const entropy = (obs1.entropy + obs2.entropy) / 2;
          
          const x1 = centerX + obs1.position.x * 0.5;
          const y1 = centerY + obs1.position.y * 0.5;
          const x2 = centerX + obs2.position.x * 0.5;
          const y2 = centerY + obs2.position.y * 0.5;
          
          ctx.strokeStyle = `rgba(147, 51, 234, ${coupling * entropy * 0.8})`;
          ctx.lineWidth = coupling * 3;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    // Draw observers with entropy visualization
    observers.forEach(observer => {
      const x = centerX + observer.position.x * 0.5;
      const y = centerY + observer.position.y * 0.5;
      const size = 6 + observer.entropy * 8;
      
      // Entropy field
      const entropyGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
      entropyGradient.addColorStop(0, `hsl(${observer.entropy * 60 + 180}, 70%, 60%)`);
      entropyGradient.addColorStop(1, `hsl(${observer.entropy * 60 + 180}, 70%, 20%)`);
      
      ctx.fillStyle = entropyGradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Observer node
      ctx.fillStyle = `hsl(${observer.coupling * 120 + 240}, 80%, 70%)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Coupling strength indicator
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = observer.coupling * 3;
      ctx.beginPath();
      ctx.arc(x, y, size + 3, 0, Math.PI * 2 * observer.coupling);
      ctx.stroke();
    });

  }, [observers, metrics.systemCoherence]);

  // Gravitational constant evolution chart
  useEffect(() => {
    const canvas = canvasEvolutionRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw evolution timeline
    const timelineY = canvas.height / 2;
    const currentX = (time % 100) / 100 * canvas.width;
    
    // Background grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const x = (i / 10) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let i = 0; i < 5; i++) {
      const y = (i / 5) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw G evolution curve
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < canvas.width; i++) {
      const t = (i / canvas.width) * 10;
      const gValue = parameters.gravityConstant * (1 + Math.sin(t + time) * metrics.systemCoherence * 0.1);
      const normalizedG = (gValue - parameters.gravityConstant * 0.9) / (parameters.gravityConstant * 0.2);
      const y = timelineY - normalizedG * 100;
      
      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }
    ctx.stroke();

    // Current time indicator
    ctx.strokeStyle = '#ff0066';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(currentX, 0);
    ctx.lineTo(currentX, canvas.height);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText('G(t) Evolution', 10, 20);
    ctx.fillText(`Current G: ${metrics.gravityConstant.toExponential(3)}`, 10, canvas.height - 10);

  }, [time, metrics.gravityConstant, parameters.gravityConstant, metrics.systemCoherence]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setObservers([]);
    // Re-initialize will be triggered by useEffect
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Atom className="h-5 w-5 text-blue-500" />
                Emergent Gravity Field
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setIsPlaying(!isPlaying)}>
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
            <canvas
              ref={canvasGravityRef}
              width={500}
              height={400}
              className="w-full h-auto border rounded bg-gray-900"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              Observer-Entropy Coupling
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasCouplingRef}
              width={500}
              height={400}
              className="w-full h-auto border rounded bg-gray-900"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Gravitational Constant Evolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasEvolutionRef}
            width={800}
            height={200}
            className="w-full h-auto border rounded bg-gray-900"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Observer Count: {parameters.observerCount}</label>
              <Slider
                value={[parameters.observerCount]}
                onValueChange={([value]) => setParameters(prev => ({ ...prev, observerCount: value }))}
                min={3}
                max={12}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Entropy Coefficient: {parameters.entropyCoefficient.toFixed(2)}</label>
              <Slider
                value={[parameters.entropyCoefficient]}
                onValueChange={([value]) => setParameters(prev => ({ ...prev, entropyCoefficient: value }))}
                min={0.1}
                max={1.0}
                step={0.05}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Coupling Strength: {parameters.couplingStrength.toFixed(2)}</label>
              <Slider
                value={[parameters.couplingStrength]}
                onValueChange={([value]) => setParameters(prev => ({ ...prev, couplingStrength: value }))}
                min={0.1}
                max={1.0}
                step={0.05}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Field Resolution: {parameters.fieldResolution}</label>
              <Slider
                value={[parameters.fieldResolution]}
                onValueChange={([value]) => setParameters(prev => ({ ...prev, fieldResolution: value }))}
                min={10}
                max={30}
                step={2}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Total Entropy</span>
                <span>{metrics.totalEntropy.toFixed(2)}</span>
              </div>
              <Progress value={(metrics.totalEntropy / parameters.observerCount) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Average Coupling</span>
                <span>{(metrics.averageCoupling * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.averageCoupling * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>System Coherence</span>
                <span>{(metrics.systemCoherence * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.systemCoherence * 100} className="h-2" />
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-xs">
                <span>Current G:</span>
                <span className="font-mono">{metrics.gravityConstant.toExponential(3)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Field Strength:</span>
                <span className="font-mono">{metrics.fieldStrength.toExponential(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Emergent Force:</span>
                <span className="font-mono">{metrics.emergentForce.toFixed(3)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Simulation Time:</span>
                <span className="font-mono">{time.toFixed(2)}s</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {observers.length}
                  </div>
                  <div className="text-xs text-gray-600">Active Observers</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {isPlaying ? 'ACTIVE' : 'PAUSED'}
                  </div>
                  <div className="text-xs text-gray-600">Simulation Status</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedPhysicsVisualization;