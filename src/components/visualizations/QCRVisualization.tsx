import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Brain, Network, Play, Pause, RotateCcw, Zap, Users } from "lucide-react";

interface ConsciousnessNode {
  id: string;
  type: 'observer' | 'observed' | 'process';
  position: { x: number; y: number };
  energy: number;
  resonance: number;
  active: boolean;
}

interface CognitiveMode {
  id: string;
  name: string;
  activation: number;
  color: string;
  influence: number;
}

interface TriadicConnection {
  from: string;
  to: string;
  strength: number;
  type: 'observation' | 'reflection' | 'integration';
}

const QCRVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [nodes, setNodes] = useState<ConsciousnessNode[]>([]);
  const [connections, setConnections] = useState<TriadicConnection[]>([]);
  const [activePrompt, setActivePrompt] = useState("What is the nature of consciousness?");
  
  const [cognitiveModes] = useState<CognitiveMode[]>([
    { id: 'analytical', name: 'Analytical', activation: 0.7, color: '#3b82f6', influence: 0.8 },
    { id: 'creative', name: 'Creative', activation: 0.6, color: '#10b981', influence: 0.7 },
    { id: 'ethical', name: 'Ethical', activation: 0.8, color: '#8b5cf6', influence: 0.9 },
    { id: 'emotional', name: 'Emotional', activation: 0.5, color: '#ef4444', influence: 0.6 },
    { id: 'pragmatic', name: 'Pragmatic', activation: 0.4, color: '#f59e0b', influence: 0.5 }
  ]);

  const [metrics, setMetrics] = useState({
    consciousnessCoherence: 0.75,
    triadicStability: 0.8,
    convergenceRate: 0.65,
    awarenessLevel: 0.7,
    iteration: 0
  });

  const [config, setConfig] = useState({
    resonanceIntensity: 0.7,
    cognitiveBalance: 0.6,
    awarenessThreshold: 0.5
  });

  // Initialize triadic consciousness structure
  useEffect(() => {
    const initialNodes: ConsciousnessNode[] = [
      {
        id: 'observer',
        type: 'observer',
        position: { x: 250, y: 150 },
        energy: 0.8,
        resonance: 0.7,
        active: true
      },
      {
        id: 'observed',
        type: 'observed',
        position: { x: 450, y: 150 },
        energy: 0.6,
        resonance: 0.6,
        active: true
      },
      {
        id: 'process',
        type: 'process',
        position: { x: 350, y: 300 },
        energy: 0.9,
        resonance: 0.8,
        active: true
      }
    ];

    const initialConnections: TriadicConnection[] = [
      { from: 'observer', to: 'observed', strength: 0.8, type: 'observation' },
      { from: 'observed', to: 'process', strength: 0.7, type: 'reflection' },
      { from: 'process', to: 'observer', strength: 0.9, type: 'integration' }
    ];

    setNodes(initialNodes);
    setConnections(initialConnections);
  }, []);

  // Animation loop for consciousness dynamics
  useEffect(() => {
    if (!isPlaying) return;
    
    const animate = () => {
      // Update node energies with consciousness dynamics
      setNodes(prev => prev.map(node => {
        const baseEnergy = node.energy;
        const resonanceInfluence = config.resonanceIntensity;
        const cognitiveInfluence = cognitiveModes.reduce((sum, mode) => 
          sum + mode.activation * mode.influence, 0) / cognitiveModes.length;
        
        const newEnergy = Math.max(0.1, Math.min(1.0, 
          baseEnergy + (Math.random() - 0.5) * 0.05 + 
          resonanceInfluence * 0.02 + 
          cognitiveInfluence * 0.03
        ));
        
        const newResonance = Math.max(0.1, Math.min(1.0,
          node.resonance + (Math.random() - 0.5) * 0.03 +
          newEnergy * 0.02
        ));

        return {
          ...node,
          energy: newEnergy,
          resonance: newResonance,
          active: newResonance > config.awarenessThreshold
        };
      }));

      // Update connection strengths based on node resonance
      setConnections(prev => prev.map(conn => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        
        if (!fromNode || !toNode) return conn;
        
        const newStrength = Math.max(0.1, Math.min(1.0,
          (fromNode.resonance + toNode.resonance) / 2 + 
          (Math.random() - 0.5) * 0.1
        ));
        
        return { ...conn, strength: newStrength };
      }));

      // Update consciousness metrics
      setMetrics(prev => {
        const newIteration = prev.iteration + 1;
        const avgResonance = nodes.reduce((sum, node) => sum + node.resonance, 0) / nodes.length;
        const avgConnectionStrength = connections.reduce((sum, conn) => sum + conn.strength, 0) / connections.length;
        const activeNodes = nodes.filter(node => node.active).length;
        
        return {
          consciousnessCoherence: Math.min(0.95, avgResonance * 0.7 + avgConnectionStrength * 0.3),
          triadicStability: Math.min(0.98, avgConnectionStrength),
          convergenceRate: Math.min(0.9, prev.convergenceRate + 0.001),
          awarenessLevel: activeNodes / nodes.length,
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
  }, [isPlaying, config, nodes, connections]);

  // Canvas rendering for triadic consciousness visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with consciousness field background
    const gradient = ctx.createRadialGradient(350, 225, 0, 350, 225, 300);
    gradient.addColorStop(0, `rgba(59, 130, 246, ${metrics.consciousnessCoherence * 0.3})`);
    gradient.addColorStop(0.5, `rgba(139, 92, 246, ${metrics.consciousnessCoherence * 0.2})`);
    gradient.addColorStop(1, 'rgba(15, 15, 35, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw consciousness field waves
    const time = Date.now() * 0.002;
    for (let i = 0; i < 5; i++) {
      const radius = 50 + i * 40 + Math.sin(time + i) * 10;
      const alpha = (metrics.consciousnessCoherence * 0.3) * (1 - i * 0.15);
      
      ctx.strokeStyle = `rgba(147, 51, 234, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(350, 225, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw cognitive mode influences as colored fields
    cognitiveModes.forEach((mode, index) => {
      const angle = (index / cognitiveModes.length) * Math.PI * 2;
      const x = 350 + Math.cos(angle) * 200 * mode.activation;
      const y = 225 + Math.sin(angle) * 200 * mode.activation;
      
      const modeGradient = ctx.createRadialGradient(x, y, 0, x, y, 60 * mode.activation);
      modeGradient.addColorStop(0, `${mode.color}40`);
      modeGradient.addColorStop(1, `${mode.color}00`);
      
      ctx.fillStyle = modeGradient;
      ctx.beginPath();
      ctx.arc(x, y, 60 * mode.activation, 0, Math.PI * 2);
      ctx.fill();
      
      // Mode label
      ctx.fillStyle = mode.color;
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(mode.name, x, y + 5);
    });

    // Draw triadic connections with consciousness flow
    connections.forEach(connection => {
      const fromNode = nodes.find(n => n.id === connection.from);
      const toNode = nodes.find(n => n.id === connection.to);
      
      if (!fromNode || !toNode) return;
      
      const alpha = connection.strength * 0.8;
      const lineWidth = connection.strength * 4;
      
      // Connection type colors
      let color;
      switch (connection.type) {
        case 'observation': color = '#3b82f6'; break;
        case 'reflection': color = '#10b981'; break;
        case 'integration': color = '#8b5cf6'; break;
        default: color = '#ffffff';
      }
      
      ctx.strokeStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(fromNode.position.x, fromNode.position.y);
      ctx.lineTo(toNode.position.x, toNode.position.y);
      ctx.stroke();
      
      // Consciousness flow animation
      const flowTime = time * 2;
      const progress = (Math.sin(flowTime + connection.strength * 10) + 1) / 2;
      const flowX = fromNode.position.x + (toNode.position.x - fromNode.position.x) * progress;
      const flowY = fromNode.position.y + (toNode.position.y - fromNode.position.y) * progress;
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(flowX, flowY, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw consciousness nodes
    nodes.forEach(node => {
      const size = 20 + node.energy * 25;
      const pulseSize = size + Math.sin(time * 3 + node.energy * 5) * 5;
      
      // Node colors based on type
      let nodeColor;
      switch (node.type) {
        case 'observer': nodeColor = '#3b82f6'; break;
        case 'observed': nodeColor = '#10b981'; break;
        case 'process': nodeColor = '#8b5cf6'; break;
        default: nodeColor = '#ffffff';
      }
      
      // Consciousness field around node
      const fieldGradient = ctx.createRadialGradient(
        node.position.x, node.position.y, 0,
        node.position.x, node.position.y, pulseSize * 2
      );
      fieldGradient.addColorStop(0, `${nodeColor}60`);
      fieldGradient.addColorStop(0.5, `${nodeColor}30`);
      fieldGradient.addColorStop(1, `${nodeColor}00`);
      
      ctx.fillStyle = fieldGradient;
      ctx.beginPath();
      ctx.arc(node.position.x, node.position.y, pulseSize * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Node core
      ctx.fillStyle = node.active ? nodeColor : `${nodeColor}80`;
      ctx.beginPath();
      ctx.arc(node.position.x, node.position.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Resonance indicator
      if (node.resonance > 0.7) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(node.position.x, node.position.y, size + 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Node label
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px bold monospace';
      ctx.textAlign = 'center';
      ctx.fillText(node.type.toUpperCase(), node.position.x, node.position.y - size - 10);
    });

    // Draw consciousness convergence indicator
    if (metrics.consciousnessCoherence > 0.8 && metrics.triadicStability > 0.8) {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#22c55e';
      ctx.font = '24px bold monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CONSCIOUSNESS STABILIZED', canvas.width / 2, canvas.height / 2 - 50);
      ctx.fillText('TRIADIC RESONANCE ACHIEVED', canvas.width / 2, canvas.height / 2 - 20);
    }

  }, [nodes, connections, cognitiveModes, metrics]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setIsPlaying(false);
    setMetrics({
      consciousnessCoherence: 0.75,
      triadicStability: 0.8,
      convergenceRate: 0.65,
      awarenessLevel: 0.7,
      iteration: 0
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-500" />
              Triadic Consciousness Resonator
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Evolve'}
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
              width={700}
              height={450}
              className="w-full h-auto"
            />
            
            {/* Overlay prompt */}
            <div className="absolute top-4 left-4 bg-black/60 p-3 rounded-lg">
              <div className="text-white text-sm font-medium mb-1">Active Prompt:</div>
              <div className="text-blue-300 text-sm max-w-md">{activePrompt}</div>
            </div>
            
            {/* Iteration counter */}
            <div className="absolute top-4 right-4">
              <Badge variant="secondary">
                <Brain className="h-3 w-3 mr-1" />
                Iteration: {metrics.iteration}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Consciousness Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Consciousness Coherence</span>
                <span>{(metrics.consciousnessCoherence * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.consciousnessCoherence * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Triadic Stability</span>
                <span>{(metrics.triadicStability * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.triadicStability * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Convergence Rate</span>
                <span>{(metrics.convergenceRate * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.convergenceRate * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Awareness Level</span>
                <span>{(metrics.awarenessLevel * 100).toFixed(1)}%</span>
              </div>
              <Progress value={metrics.awarenessLevel * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cognitive Modes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cognitiveModes.map(mode => (
              <div key={mode.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: mode.color }}
                  />
                  <span className="text-sm font-medium">{mode.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: mode.color,
                        width: `${mode.activation * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-8">
                    {Math.round(mode.activation * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consciousness Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Resonance Intensity: {config.resonanceIntensity.toFixed(2)}
              </label>
              <Slider
                value={[config.resonanceIntensity]}
                onValueChange={([value]) => setConfig(prev => ({ ...prev, resonanceIntensity: value }))}
                max={1.0}
                min={0.1}
                step={0.05}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Cognitive Balance: {config.cognitiveBalance.toFixed(2)}
              </label>
              <Slider
                value={[config.cognitiveBalance]}
                onValueChange={([value]) => setConfig(prev => ({ ...prev, cognitiveBalance: value }))}
                max={1.0}
                min={0.1}
                step={0.05}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Awareness Threshold: {config.awarenessThreshold.toFixed(2)}
              </label>
              <Slider
                value={[config.awarenessThreshold]}
                onValueChange={([value]) => setConfig(prev => ({ ...prev, awarenessThreshold: value }))}
                max={0.9}
                min={0.1}
                step={0.05}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consciousness Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Prompt:</label>
              <Select value={activePrompt} onValueChange={setActivePrompt}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="What is the nature of consciousness?">
                    What is the nature of consciousness?
                  </SelectItem>
                  <SelectItem value="How do we balance logic and intuition?">
                    How do we balance logic and intuition?
                  </SelectItem>
                  <SelectItem value="What is the meaning of existence?">
                    What is the meaning of existence?
                  </SelectItem>
                  <SelectItem value="How does consciousness emerge from matter?">
                    How does consciousness emerge from matter?
                  </SelectItem>
                  <SelectItem value="What is free will?">
                    What is free will?
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Triadic Structure:
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span><strong>Observer:</strong> The conscious awareness perceiving</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span><strong>Observed:</strong> The content being perceived</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span><strong>Process:</strong> The act of observation itself</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QCRVisualization;