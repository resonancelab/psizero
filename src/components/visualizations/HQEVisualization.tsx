import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Atom, Play, Pause, RotateCcw, Zap, Target, Waves, BarChart3 } from "lucide-react";

interface PrimeEigenstate {
  prime: number;
  amplitude: number;
  phase: number;
  frequency: number;
  energy: number;
}

interface QuantumSnapshot {
  step: number;
  time: number;
  eigenstates: PrimeEigenstate[];
  totalEnergy: number;
  entanglement: number;
  coherence: number;
}

const HQEVisualization = () => {
  const canvas3DRef = useRef<HTMLCanvasElement>(null);
  const canvasAmplitudeRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSnapshot, setCurrentSnapshot] = useState<QuantumSnapshot | null>(null);
  const [snapshots, setSnapshots] = useState<QuantumSnapshot[]>([]);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [time, setTime] = useState(0);
  
  const [config, setConfig] = useState({
    primes: [2, 3, 5, 7, 11],
    dt: 0.1,
    lambda: 0.02,
    resonanceTarget: 0.8,
    evolutionSteps: 256
  });
  
  const [metrics, setMetrics] = useState({
    resonanceStrength: 0.3,
    coherenceLevel: 0.7,
    entanglementDegree: 0.5,
    energyStability: 0.8,
    targetProgress: 0.2
  });

  // Initialize quantum system
  useEffect(() => {
    const initialEigenstates: PrimeEigenstate[] = config.primes.map((prime, index) => ({
      prime,
      amplitude: 1 / Math.sqrt(config.primes.length), // Normalized initial state
      phase: (index * Math.PI) / config.primes.length,
      frequency: Math.log(prime) * 0.5, // Frequency based on prime logarithm
      energy: Math.random() * 0.5 + 0.3
    }));

    const initialSnapshot: QuantumSnapshot = {
      step: 0,
      time: 0,
      eigenstates: initialEigenstates,
      totalEnergy: initialEigenstates.reduce((sum, state) => sum + state.energy, 0),
      entanglement: 0.3,
      coherence: 0.7
    };

    setCurrentSnapshot(initialSnapshot);
    setSnapshots([initialSnapshot]);
  }, [config.primes]);

  // Quantum evolution step
  const evolveQuantumSystem = (current: QuantumSnapshot): QuantumSnapshot => {
    const newTime = current.time + config.dt;
    const newStep = current.step + 1;

    // Evolve each prime eigenstate
    const evolvedStates = current.eigenstates.map((state, index) => {
      // Unitary evolution with entropy dissipation
      const newPhase = state.phase + state.frequency * config.dt;
      const dissipationFactor = Math.exp(-config.lambda * config.dt);
      
      // Add quantum interference effects
      const interferenceSum = current.eigenstates.reduce((sum, otherState, otherIndex) => {
        if (index !== otherIndex) {
          const phaseDiff = state.phase - otherState.phase;
          return sum + otherState.amplitude * Math.cos(phaseDiff) * 0.1;
        }
        return sum;
      }, 0);

      let newAmplitude = state.amplitude * dissipationFactor + interferenceSum * config.dt;
      
      // Resonance target attraction
      const targetInfluence = (config.resonanceTarget - state.amplitude) * 0.05;
      newAmplitude += targetInfluence * config.dt;
      
      // Normalize and add quantum fluctuations
      newAmplitude = Math.max(0.01, Math.min(1.0, newAmplitude + (Math.random() - 0.5) * 0.02));
      
      const newEnergy = state.energy * (1 - config.lambda * config.dt) + 
                       newAmplitude * newAmplitude * 0.1;

      return {
        ...state,
        amplitude: newAmplitude,
        phase: newPhase,
        energy: newEnergy
      };
    });

    // Renormalize amplitudes
    const totalAmplitudeSquared = evolvedStates.reduce((sum, state) => sum + state.amplitude * state.amplitude, 0);
    const normalization = 1 / Math.sqrt(totalAmplitudeSquared);
    
    const normalizedStates = evolvedStates.map(state => ({
      ...state,
      amplitude: state.amplitude * normalization
    }));

    // Calculate system properties
    const totalEnergy = normalizedStates.reduce((sum, state) => sum + state.energy, 0);
    
    // Quantum entanglement (simplified measure)
    const entanglement = Math.min(1, totalAmplitudeSquared * 0.5 + Math.random() * 0.1);
    
    // Coherence based on phase relationships
    const coherence = Math.abs(normalizedStates.reduce((sum, state) =>
      sum + state.amplitude * Math.cos(state.phase), 0)) / normalizedStates.length;

    return {
      step: newStep,
      time: newTime,
      eigenstates: normalizedStates,
      totalEnergy,
      entanglement: Math.max(0, Math.min(1, entanglement)),
      coherence: Math.max(0, Math.min(1, coherence || 0.5))
    };
  };

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !currentSnapshot) return;
    
    const animate = () => {
      // Evolve quantum system
      const evolved = evolveQuantumSystem(currentSnapshot);
      setCurrentSnapshot(evolved);
      
      // Add to snapshots history
      setSnapshots(prev => {
        const newSnapshots = [...prev, evolved];
        return newSnapshots.slice(-100); // Keep last 100 snapshots
      });

      // Update 3D rotation
      setRotation(prev => ({
        x: prev.x + 0.008,
        y: prev.y + 0.005,
        z: prev.z + 0.003
      }));

      setTime(prev => prev + config.dt);

      // Update metrics
      const avgAmplitude = evolved.eigenstates.reduce((sum, state) => sum + state.amplitude, 0) / evolved.eigenstates.length;
      const resonanceStrength = Math.min(1, avgAmplitude * 2);
      const targetProgress = Math.min(1, Math.abs(resonanceStrength - config.resonanceTarget) < 0.1 ? 1 : resonanceStrength);
      
      setMetrics({
        resonanceStrength,
        coherenceLevel: evolved.coherence,
        entanglementDegree: evolved.entanglement,
        energyStability: 1 - (evolved.totalEnergy - 2) / 2, // Normalized around expected energy
        targetProgress
      });

      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentSnapshot, config]);

  // 3D Holographic Visualization
  useEffect(() => {
    const canvas = canvas3DRef.current;
    if (!canvas || !currentSnapshot) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 80;

    // Clear with quantum field background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
    gradient.addColorStop(0, `rgba(147, 51, 234, ${metrics.coherenceLevel * 0.4})`);
    gradient.addColorStop(0.5, `rgba(59, 130, 246, ${metrics.coherenceLevel * 0.3})`);
    gradient.addColorStop(1, 'rgba(15, 15, 35, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3D projection functions
    const project3D = (x: number, y: number, z: number) => {
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const cosZ = Math.cos(rotation.z);
      const sinZ = Math.sin(rotation.z);

      // Rotate around Y axis
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      
      // Rotate around X axis
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      
      // Project to 2D
      const perspective = 300 / (300 + z2);
      return {
        x: centerX + x1 * scale * perspective,
        y: centerY + y2 * scale * perspective,
        z: z2
      };
    };

    // Draw 3D coordinate system
    const axisLength = 2;
    const origin = project3D(0, 0, 0);
    
    // X axis (red)
    const xAxis = project3D(axisLength, 0, 0);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(xAxis.x, xAxis.y);
    ctx.stroke();
    
    // Y axis (green)
    const yAxis = project3D(0, axisLength, 0);
    ctx.strokeStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(yAxis.x, yAxis.y);
    ctx.stroke();
    
    // Z axis (blue)
    const zAxis = project3D(0, 0, axisLength);
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(zAxis.x, zAxis.y);
    ctx.stroke();

    // Draw prime eigenstate vectors in 3D
    currentSnapshot.eigenstates.forEach((state, index) => {
      const angle = (index / currentSnapshot.eigenstates.length) * 2 * Math.PI;
      const radius = state.amplitude * 1.5;
      const height = Math.sin(state.phase + time * state.frequency) * 0.5;
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = height;
      
      const projected = project3D(x, y, z);
      const vectorEnd = project3D(x * 1.2, y * 1.2, z);
      
      // Prime eigenstate colors
      const hue = (Math.log(state.prime) * 50) % 360;
      const color = `hsl(${hue}, 70%, 60%)`;
      
      // Draw eigenstate vector
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(projected.x, projected.y);
      ctx.stroke();
      
      // Draw eigenstate node
      const nodeSize = 4 + state.amplitude * 8;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, nodeSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Quantum field around eigenstate
      const fieldGradient = ctx.createRadialGradient(
        projected.x, projected.y, 0,
        projected.x, projected.y, nodeSize * 3
      );
      fieldGradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.4)`);
      fieldGradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0)`);
      
      ctx.fillStyle = fieldGradient;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, nodeSize * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Prime number label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px bold monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${state.prime}`, projected.x, projected.y - nodeSize - 8);
    });

    // Draw quantum interference patterns
    for (let i = 0; i < currentSnapshot.eigenstates.length; i++) {
      for (let j = i + 1; j < currentSnapshot.eigenstates.length; j++) {
        const state1 = currentSnapshot.eigenstates[i];
        const state2 = currentSnapshot.eigenstates[j];
        
        const angle1 = (i / currentSnapshot.eigenstates.length) * 2 * Math.PI;
        const angle2 = (j / currentSnapshot.eigenstates.length) * 2 * Math.PI;
        
        const pos1 = project3D(
          Math.cos(angle1) * state1.amplitude * 1.5,
          Math.sin(angle1) * state1.amplitude * 1.5,
          Math.sin(state1.phase + time * state1.frequency) * 0.5
        );
        
        const pos2 = project3D(
          Math.cos(angle2) * state2.amplitude * 1.5,
          Math.sin(angle2) * state2.amplitude * 1.5,
          Math.sin(state2.phase + time * state2.frequency) * 0.5
        );
        
        const interferenceStrength = state1.amplitude * state2.amplitude * 0.5;
        const phaseDiff = Math.abs(state1.phase - state2.phase);
        const coherenceEffect = Math.cos(phaseDiff) * interferenceStrength;
        
        if (coherenceEffect > 0.1) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${coherenceEffect})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(pos1.x, pos1.y);
          ctx.lineTo(pos2.x, pos2.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    // Draw resonance target indicator
    if (metrics.targetProgress > 0.8) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = '#22c55e';
      ctx.font = '16px bold monospace';
      ctx.textAlign = 'center';
      ctx.fillText('RESONANCE TARGET', centerX, centerY - 120);
      ctx.fillText('ACHIEVED', centerX, centerY - 100);
    }

  }, [currentSnapshot, rotation, time, metrics]);

  // Prime amplitude evolution chart
  useEffect(() => {
    const canvas = canvasAmplitudeRef.current;
    if (!canvas || snapshots.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const margin = 40;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    // Draw grid
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = margin + (i * chartHeight) / 5;
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(width - margin, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    const timeSteps = Math.min(snapshots.length, 50);
    for (let i = 0; i <= 10; i++) {
      const x = margin + (i * chartWidth) / 10;
      ctx.beginPath();
      ctx.moveTo(x, margin);
      ctx.lineTo(x, height - margin);
      ctx.stroke();
    }

    // Draw amplitude evolution for each prime
    if (currentSnapshot) {
      currentSnapshot.eigenstates.forEach((state, primeIndex) => {
        const hue = (Math.log(state.prime) * 50) % 360;
        const color = `hsl(${hue}, 70%, 60%)`;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const recentSnapshots = snapshots.slice(-timeSteps);
        recentSnapshots.forEach((snapshot, timeIndex) => {
          const x = margin + (timeIndex * chartWidth) / (timeSteps - 1);
          const amplitude = snapshot.eigenstates[primeIndex]?.amplitude || 0;
          const y = height - margin - (amplitude * chartHeight);
          
          if (timeIndex === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
        
        // Draw current amplitude point
        const currentX = width - margin;
        const currentY = height - margin - (state.amplitude * chartHeight);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Prime label
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Prime ${state.prime}`, 10, 20 + primeIndex * 15);
        ctx.fillStyle = color;
        ctx.fillRect(80, 15 + primeIndex * 15, 10, 6);
      });
    }

    // Axis labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Time Evolution', width / 2, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Amplitude', 0, 0);
    ctx.restore();

  }, [snapshots, currentSnapshot]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setRotation({ x: 0, y: 0, z: 0 });
    setSnapshots([]);
    
    // Reinitialize system
    const initialEigenstates: PrimeEigenstate[] = config.primes.map((prime, index) => ({
      prime,
      amplitude: 1 / Math.sqrt(config.primes.length),
      phase: (index * Math.PI) / config.primes.length,
      frequency: Math.log(prime) * 0.5,
      energy: Math.random() * 0.5 + 0.3
    }));

    const initialSnapshot: QuantumSnapshot = {
      step: 0,
      time: 0,
      eigenstates: initialEigenstates,
      totalEnergy: initialEigenstates.reduce((sum, state) => sum + state.energy, 0),
      entanglement: 0.3,
      coherence: 0.7
    };

    setCurrentSnapshot(initialSnapshot);
    setSnapshots([initialSnapshot]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Atom className="h-5 w-5 text-purple-500" />
                3D Holographic State Evolution
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" onClick={togglePlayPause}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Evolve Quantum State'}
                </Button>
                <Button size="sm" variant="outline" onClick={reset}>
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvas3DRef}
                width={600}
                height={400}
                className="w-full h-auto border rounded bg-gray-900"
              />
              
              {/* Overlay controls */}
              <div className="absolute top-4 left-4 bg-black/60 p-2 rounded">
                <div className="text-white text-xs">
                  <div>Step: {currentSnapshot?.step || 0}</div>
                  <div>Time: {time.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4">
                <Badge variant={metrics.targetProgress > 0.8 ? "default" : "secondary"}>
                  <Target className="h-3 w-3 mr-1" />
                  Target: {(metrics.targetProgress * 100).toFixed(0)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-blue-500" />
              Prime Amplitude Evolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasAmplitudeRef}
              width={500}
              height={300}
              className="w-full h-auto border rounded"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quantum Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Resonance Strength</span>
                <span>{(metrics.resonanceStrength * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.resonanceStrength * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Coherence Level</span>
                <span>{(metrics.coherenceLevel * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.coherenceLevel * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Entanglement Degree</span>
                <span>{(metrics.entanglementDegree * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.entanglementDegree * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Energy Stability</span>
                <span>{(metrics.energyStability * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.energyStability * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Prime Eigenstates:
              </label>
              <Select 
                value={config.primes.join(',')} 
                onValueChange={(value) => setConfig(prev => ({ 
                  ...prev, 
                  primes: value.split(',').map(Number) 
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2,3,5,7">Basic: [2,3,5,7]</SelectItem>
                  <SelectItem value="2,3,5,7,11">Standard: [2,3,5,7,11]</SelectItem>
                  <SelectItem value="2,3,5,7,11,13">Extended: [2,3,5,7,11,13]</SelectItem>
                  <SelectItem value="2,3,5,7,11,13,17,19">Advanced: [2,3,5,7,11,13,17,19]</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Evolution Rate (dt): {config.dt.toFixed(2)}
              </label>
              <Slider
                value={[config.dt]}
                onValueChange={([value]) => setConfig(prev => ({ ...prev, dt: value }))}
                max={0.5}
                min={0.01}
                step={0.01}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Dissipation (λ): {config.lambda.toFixed(3)}
              </label>
              <Slider
                value={[config.lambda]}
                onValueChange={([value]) => setConfig(prev => ({ ...prev, lambda: value }))}
                max={0.1}
                min={0.001}
                step={0.001}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Resonance Target: {config.resonanceTarget.toFixed(2)}
              </label>
              <Slider
                value={[config.resonanceTarget]}
                onValueChange={([value]) => setConfig(prev => ({ ...prev, resonanceTarget: value }))}
                max={1.0}
                min={0.1}
                step={0.05}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {currentSnapshot && (
        <Card>
          <CardHeader>
            <CardTitle>Current Eigenstate Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Prime</th>
                    <th className="text-center p-2">Amplitude</th>
                    <th className="text-center p-2">Phase</th>
                    <th className="text-center p-2">Frequency</th>
                    <th className="text-center p-2">Energy</th>
                    <th className="text-center p-2">Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSnapshot.eigenstates.map((state, index) => {
                    const hue = (Math.log(state.prime) * 50) % 360;
                    const color = `hsl(${hue}, 70%, 60%)`;
                    const probability = state.amplitude * state.amplitude;
                    
                    return (
                      <tr key={state.prime} className="border-b">
                        <td className="p-2 font-bold" style={{ color }}>
                          Prime {state.prime}
                        </td>
                        <td className="text-center p-2">
                          <div className="flex items-center justify-center">
                            <div className="w-16 h-3 bg-gray-200 rounded mr-2">
                              <div 
                                className="h-3 rounded"
                                style={{ 
                                  backgroundColor: color,
                                  width: `${state.amplitude * 100}%`
                                }}
                              />
                            </div>
                            <span className="text-xs">{state.amplitude.toFixed(3)}</span>
                          </div>
                        </td>
                        <td className="text-center p-2 font-mono text-xs">
                          {(state.phase % (2 * Math.PI)).toFixed(2)}
                        </td>
                        <td className="text-center p-2 font-mono text-xs">
                          {state.frequency.toFixed(3)}
                        </td>
                        <td className="text-center p-2 font-mono text-xs">
                          {state.energy.toFixed(3)}
                        </td>
                        <td className="text-center p-2 font-mono text-xs">
                          {(probability * 100).toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HQEVisualization;