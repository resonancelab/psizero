import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Sparkles, Network, Brain } from "lucide-react";

interface ConceptVector {
  id: string;
  concept: string;
  position: { x: number; y: number; z: number };
  primeAmplitudes: number[];
  resonance: number;
  color: string;
}

interface ResonanceEdge {
  from: string;
  to: string;
  strength: number;
  active: boolean;
}

const QSEMVisualization = () => {
  const canvas2DRef = useRef<HTMLCanvasElement>(null);
  const canvas3DRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [concepts, setConcepts] = useState<ConceptVector[]>([]);
  const [edges, setEdges] = useState<ResonanceEdge[]>([]);
  const [newConcept, setNewConcept] = useState('');
  const [resonanceThreshold, setResonanceThreshold] = useState(0.5);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  
  const [metrics, setMetrics] = useState({
    totalCoherence: 0.7,
    averageResonance: 0.6,
    networkDensity: 0.3,
    semanticEntropy: 0.4
  });

  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
  const conceptColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  // Initialize with sample concepts
  useEffect(() => {
    const sampleConcepts = [
      'consciousness', 'quantum', 'information', 'entropy', 'resonance', 'reality', 'love', 'time'
    ];
    
    const initialConcepts: ConceptVector[] = sampleConcepts.map((concept, i) => ({
      id: `concept-${i}`,
      concept,
      position: {
        x: Math.cos(i * 2 * Math.PI / sampleConcepts.length) * 150,
        y: Math.sin(i * 2 * Math.PI / sampleConcepts.length) * 150,
        z: (Math.random() - 0.5) * 100
      },
      primeAmplitudes: primes.map(() => Math.random()),
      resonance: Math.random(),
      color: conceptColors[i % conceptColors.length]
    }));

    setConcepts(initialConcepts);
    computeResonanceEdges(initialConcepts);
  }, []);

  const computeResonanceEdges = (conceptsList: ConceptVector[]) => {
    const newEdges: ResonanceEdge[] = [];
    
    for (let i = 0; i < conceptsList.length; i++) {
      for (let j = i + 1; j < conceptsList.length; j++) {
        const concept1 = conceptsList[i];
        const concept2 = conceptsList[j];
        
        // Compute quantum inner product
        let dotProduct = 0;
        let norm1 = 0, norm2 = 0;
        
        for (let k = 0; k < primes.length; k++) {
          dotProduct += concept1.primeAmplitudes[k] * concept2.primeAmplitudes[k];
          norm1 += concept1.primeAmplitudes[k] ** 2;
          norm2 += concept2.primeAmplitudes[k] ** 2;
        }
        
        const resonanceStrength = Math.abs(dotProduct) / (Math.sqrt(norm1) * Math.sqrt(norm2));
        
        newEdges.push({
          from: concept1.id,
          to: concept2.id,
          strength: resonanceStrength,
          active: resonanceStrength > resonanceThreshold
        });
      }
    }
    
    setEdges(newEdges);
    
    // Update metrics
    const activeEdges = newEdges.filter(e => e.active);
    const avgResonance = newEdges.reduce((sum, e) => sum + e.strength, 0) / newEdges.length;
    const networkDensity = activeEdges.length / newEdges.length;
    
    setMetrics(prev => ({
      ...prev,
      totalCoherence: Math.min(0.95, avgResonance + networkDensity * 0.3),
      averageResonance: avgResonance,
      networkDensity,
      semanticEntropy: 1 - networkDensity * 0.7
    }));
  };

  // Animation loop for rotation and resonance updates
  useEffect(() => {
    if (!isPlaying) return;
    
    const animate = () => {
      setRotation(prev => ({
        x: prev.x + 0.01,
        y: prev.y + 0.005
      }));
      
      // Update resonance values
      setConcepts(prev => prev.map(concept => ({
        ...concept,
        resonance: Math.max(0, Math.min(1, concept.resonance + (Math.random() - 0.5) * 0.02))
      })));
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // 2D Network Visualization
  useEffect(() => {
    const canvas = canvas2DRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Clear canvas
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw semantic field background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
    gradient.addColorStop(0, `rgba(147, 51, 234, ${metrics.semanticEntropy * 0.3})`);
    gradient.addColorStop(0.5, `rgba(59, 130, 246, ${metrics.semanticEntropy * 0.2})`);
    gradient.addColorStop(1, 'rgba(15, 15, 35, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw resonance edges
    edges.forEach(edge => {
      if (!edge.active) return;
      
      const concept1 = concepts.find(c => c.id === edge.from);
      const concept2 = concepts.find(c => c.id === edge.to);
      
      if (!concept1 || !concept2) return;
      
      const x1 = centerX + concept1.position.x;
      const y1 = centerY + concept1.position.y;
      const x2 = centerX + concept2.position.x;
      const y2 = centerY + concept2.position.y;
      
      ctx.strokeStyle = `rgba(34, 197, 94, ${edge.strength * 0.8})`;
      ctx.lineWidth = edge.strength * 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      // Resonance pulse effect
      if (edge.strength > 0.7) {
        ctx.strokeStyle = `rgba(251, 191, 36, ${Math.sin(Date.now() * 0.01) * 0.3 + 0.4})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Draw concept nodes
    concepts.forEach(concept => {
      const x = centerX + concept.position.x;
      const y = centerY + concept.position.y;
      const size = 8 + concept.resonance * 12;
      
      // Node glow
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
      glowGradient.addColorStop(0, `${concept.color}80`);
      glowGradient.addColorStop(0.5, `${concept.color}40`);
      glowGradient.addColorStop(1, `${concept.color}00`);
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Node core
      ctx.fillStyle = concept.color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Concept label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(concept.concept, x, y + size + 16);
    });

  }, [concepts, edges, metrics]);

  // 3D Prime Vector Space Visualization
  useEffect(() => {
    const canvas = canvas3DRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw 3D coordinate system
    const scale = 100;
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);

    // Transform 3D to 2D projection
    const project3D = (x: number, y: number, z: number) => {
      // Rotate around X axis
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      
      // Rotate around Y axis
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;
      
      return {
        x: centerX + x2,
        y: centerY + y1,
        z: z2
      };
    };

    // Draw coordinate axes
    const axisLength = 150;
    const origin = project3D(0, 0, 0);
    const xAxis = project3D(axisLength, 0, 0);
    const yAxis = project3D(0, axisLength, 0);
    const zAxis = project3D(0, 0, axisLength);

    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(xAxis.x, xAxis.y);
    ctx.stroke();

    ctx.strokeStyle = '#4ecdc4';
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(yAxis.x, yAxis.y);
    ctx.stroke();

    ctx.strokeStyle = '#45b7d1';
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(zAxis.x, zAxis.y);
    ctx.stroke();

    // Draw prime basis vectors and concept projections
    concepts.forEach(concept => {
      // Use first 3 prime amplitudes for 3D visualization
      const x = concept.primeAmplitudes[0] * scale;
      const y = concept.primeAmplitudes[1] * scale;
      const z = concept.primeAmplitudes[2] * scale;
      
      const projected = project3D(x, y, z);
      const size = 6 + concept.resonance * 8;
      
      // Draw vector from origin
      ctx.strokeStyle = `${concept.color}80`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(projected.x, projected.y);
      ctx.stroke();
      
      // Draw concept point
      ctx.fillStyle = concept.color;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Concept label
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(concept.concept, projected.x, projected.y - size - 5);
    });

    // Draw axis labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Prime 2', xAxis.x, xAxis.y + 15);
    ctx.fillText('Prime 3', yAxis.x, yAxis.y + 15);
    ctx.fillText('Prime 5', zAxis.x, zAxis.y + 15);

  }, [concepts, rotation]);

  const addConcept = () => {
    if (!newConcept.trim()) return;
    
    const newConceptVector: ConceptVector = {
      id: `concept-${Date.now()}`,
      concept: newConcept.trim(),
      position: {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        z: (Math.random() - 0.5) * 100
      },
      primeAmplitudes: primes.map(() => Math.random()),
      resonance: Math.random(),
      color: conceptColors[concepts.length % conceptColors.length]
    };
    
    const updatedConcepts = [...concepts, newConceptVector];
    setConcepts(updatedConcepts);
    computeResonanceEdges(updatedConcepts);
    setNewConcept('');
  };

  const reset = () => {
    setIsPlaying(false);
    setRotation({ x: 0, y: 0 });
    setConcepts([]);
    setEdges([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-pink-500" />
                Concept Resonance Network
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={reset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvas2DRef}
              width={500}
              height={400}
              className="w-full h-auto border rounded"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Prime Vector Space (3D)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvas3DRef}
              width={500}
              height={400}
              className="w-full h-auto border rounded"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Semantic Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {(metrics.totalCoherence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Total Coherence</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {(metrics.averageResonance * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Avg Resonance</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {(metrics.networkDensity * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Network Density</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {(metrics.semanticEntropy * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Semantic Entropy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter concept..."
                value={newConcept}
                onChange={(e) => setNewConcept(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addConcept()}
              />
              <Button onClick={addConcept}>
                <Brain className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Resonance Threshold: {resonanceThreshold.toFixed(2)}
              </label>
              <Slider
                value={[resonanceThreshold]}
                onValueChange={([value]) => {
                  setResonanceThreshold(value);
                  computeResonanceEdges(concepts);
                }}
                max={1.0}
                min={0.1}
                step={0.05}
                className="w-full"
              />
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Active Concepts:</h4>
              <div className="flex flex-wrap gap-1">
                {concepts.map(concept => (
                  <Badge key={concept.id} style={{ backgroundColor: concept.color }}>
                    {concept.concept}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prime Amplitude Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Concept</th>
                  {primes.slice(0, 8).map(prime => (
                    <th key={prime} className="text-center p-2">Prime {prime}</th>
                  ))}
                  <th className="text-center p-2">Resonance</th>
                </tr>
              </thead>
              <tbody>
                {concepts.slice(0, 8).map(concept => (
                  <tr key={concept.id} className="border-b">
                    <td className="p-2 font-medium" style={{ color: concept.color }}>
                      {concept.concept}
                    </td>
                    {concept.primeAmplitudes.slice(0, 8).map((amp, i) => (
                      <td key={i} className="text-center p-2">
                        <div 
                          className="w-8 h-2 bg-gray-200 rounded mx-auto"
                          style={{
                            background: `linear-gradient(to right, ${concept.color} ${amp * 100}%, #e5e7eb ${amp * 100}%)`
                          }}
                        />
                      </td>
                    ))}
                    <td className="text-center p-2">
                      {(concept.resonance * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QSEMVisualization;