import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Hexagon, Play, Pause, RotateCcw, Compass, TrendingDown, Waves } from "lucide-react";

interface HexagramState {
  lines: boolean[]; // true = Yang (solid), false = Yin (broken)
  entropy: number;
  attractorProximity: number;
  stability: number;
  step: number;
}

interface Attractor {
  position: { x: number; y: number };
  strength: number;
  type: 'heaven' | 'earth' | 'human';
  hexagram: boolean[];
  name: string;
}

const IChingVisualization = () => {
  const canvasMainRef = useRef<HTMLCanvasElement>(null);
  const canvasLandscapeRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentHexagram, setCurrentHexagram] = useState<HexagramState>({
    lines: [true, false, true, false, true, false],
    entropy: 1.35,
    attractorProximity: 0.2,
    stability: 0.3,
    step: 0
  });
  
  const [evolutionHistory, setEvolutionHistory] = useState<HexagramState[]>([]);
  const [question, setQuestion] = useState("What direction should I take in my career?");
  const [evolutionSpeed, setEvolutionSpeed] = useState(0.5);
  const [entropyThreshold, setEntropyThreshold] = useState(0.3);
  
  // Define major attractors in the I-Ching state space
  const [attractors] = useState<Attractor[]>([
    {
      position: { x: 150, y: 100 },
      strength: 0.8,
      type: 'heaven',
      hexagram: [true, true, true, true, true, true], // Qian - Creative
      name: 'Heaven - Creative Force'
    },
    {
      position: { x: 550, y: 350 },
      strength: 0.7,
      type: 'earth',
      hexagram: [false, false, false, false, false, false], // Kun - Receptive
      name: 'Earth - Receptive Force'
    },
    {
      position: { x: 350, y: 225 },
      strength: 0.9,
      type: 'human',
      hexagram: [true, false, true, false, true, false], // Balanced human condition
      name: 'Human - Balanced Way'
    }
  ]);

  const [metrics, setMetrics] = useState({
    currentEntropy: 1.35,
    proximityToWisdom: 0.2,
    stabilizationProgress: 0.15,
    evolutionStep: 0
  });

  // Generate I-Ching names for hexagrams (simplified)
  const getHexagramName = (lines: boolean[]): string => {
    const pattern = lines.map(line => line ? '1' : '0').join('');
    const hexagramNames: { [key: string]: string } = {
      '111111': '1. Qian - The Creative',
      '000000': '2. Kun - The Receptive',
      '100010': '3. Zhun - Difficulty at Beginning',
      '010001': '4. Meng - Youthful Folly',
      '111010': '5. Xu - Waiting',
      '010111': '6. Song - Conflict',
      // Add more as needed...
    };
    return hexagramNames[pattern] || `Hexagram ${pattern}`;
  };

  // Calculate entropy of a hexagram state
  const calculateEntropy = (lines: boolean[]): number => {
    const yangCount = lines.filter(line => line).length;
    const yinCount = 6 - yangCount;
    
    if (yangCount === 0 || yinCount === 0) return 0;
    
    const yangProb = yangCount / 6;
    const yinProb = yinCount / 6;
    
    return -(yangProb * Math.log2(yangProb) + yinProb * Math.log2(yinProb));
  };

  // Calculate distance to nearest attractor
  const calculateAttractorProximity = (hexagram: boolean[]): number => {
    let minDistance = Infinity;
    
    attractors.forEach(attractor => {
      let distance = 0;
      for (let i = 0; i < 6; i++) {
        if (hexagram[i] !== attractor.hexagram[i]) {
          distance += 1;
        }
      }
      
      // Weight by attractor strength
      const weightedDistance = distance / (attractor.strength * 6);
      minDistance = Math.min(minDistance, weightedDistance);
    });
    
    return Math.max(0, 1 - minDistance);
  };

  // Evolution step - transform hexagram based on entropy dynamics
  const evolveHexagram = (current: HexagramState): HexagramState => {
    const newLines = [...current.lines];
    
    // Apply transformation rules based on entropy and attractor fields
    for (let i = 0; i < 6; i++) {
      const transformProbability = 
        (current.entropy * evolutionSpeed * 0.1) + // Entropy-driven change
        (Math.random() - 0.5) * 0.1; // Random fluctuation
      
      if (Math.abs(transformProbability) > 0.05) {
        // Check attractor influence
        let attractorInfluence = 0;
        attractors.forEach(attractor => {
          const influence = attractor.strength * (1 - current.attractorProximity);
          if (Math.random() < influence * 0.1) {
            attractorInfluence += attractor.hexagram[i] ? 0.3 : -0.3;
          }
        });
        
        if (transformProbability + attractorInfluence > 0.05) {
          newLines[i] = !newLines[i];
        }
      }
    }
    
    const newEntropy = calculateEntropy(newLines);
    const newProximity = calculateAttractorProximity(newLines);
    const newStability = 1 - Math.abs(newEntropy - current.entropy);
    
    return {
      lines: newLines,
      entropy: newEntropy,
      attractorProximity: newProximity,
      stability: Math.max(0, Math.min(1, current.stability * 0.99 + newStability * 0.01)),
      step: current.step + 1
    };
  };

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const animate = () => {
      setCurrentHexagram(prev => {
        const evolved = evolveHexagram(prev);
        
        // Add to history
        setEvolutionHistory(history => {
          const newHistory = [...history, evolved];
          return newHistory.slice(-50); // Keep last 50 steps
        });
        
        // Update metrics
        setMetrics({
          currentEntropy: evolved.entropy,
          proximityToWisdom: evolved.attractorProximity,
          stabilizationProgress: evolved.stability,
          evolutionStep: evolved.step
        });
        
        return evolved;
      });
      
      // Slow down evolution as we approach stability
      const delay = currentHexagram.stability > 0.8 ? 200 : 100;
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, delay);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentHexagram.stability, evolutionSpeed]);

  // Main hexagram visualization
  useEffect(() => {
    const canvas = canvasMainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with mystical background
    const gradient = ctx.createRadialGradient(350, 225, 0, 350, 225, 300);
    gradient.addColorStop(0, `rgba(251, 146, 60, ${metrics.proximityToWisdom * 0.3})`);
    gradient.addColorStop(0.5, `rgba(245, 101, 101, ${metrics.proximityToWisdom * 0.2})`);
    gradient.addColorStop(1, 'rgba(26, 26, 46, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw entropy field visualization
    const time = Date.now() * 0.001;
    for (let i = 0; i < 8; i++) {
      const radius = 40 + i * 25 + Math.sin(time + i) * 8;
      const alpha = (1 - metrics.currentEntropy) * 0.4 * (1 - i * 0.1);
      
      ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
      ctx.lineWidth = 2 - i * 0.2;
      ctx.beginPath();
      ctx.arc(350, 225, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw attractors
    attractors.forEach(attractor => {
      const size = 15 + attractor.strength * 10;
      let color;
      switch (attractor.type) {
        case 'heaven': color = '#3b82f6'; break;
        case 'earth': color = '#10b981'; break;
        case 'human': color = '#8b5cf6'; break;
      }
      
      // Attractor field
      const attractorGradient = ctx.createRadialGradient(
        attractor.position.x, attractor.position.y, 0,
        attractor.position.x, attractor.position.y, size * 3
      );
      attractorGradient.addColorStop(0, `${color}60`);
      attractorGradient.addColorStop(1, `${color}00`);
      
      ctx.fillStyle = attractorGradient;
      ctx.beginPath();
      ctx.arc(attractor.position.x, attractor.position.y, size * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Attractor core
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(attractor.position.x, attractor.position.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Attractor label
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(attractor.name, attractor.position.x, attractor.position.y + size + 15);
    });

    // Draw current hexagram in center
    const centerX = 350;
    const centerY = 225;
    const lineWidth = 80;
    const lineHeight = 8;
    const lineSpacing = 20;
    
    // Hexagram background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(centerX - lineWidth/2 - 10, centerY - lineSpacing * 2.5 - 10, lineWidth + 20, lineSpacing * 5 + 20);
    
    // Draw hexagram lines (bottom to top)
    currentHexagram.lines.forEach((isYang, index) => {
      const y = centerY + lineSpacing * (2.5 - index);
      
      if (isYang) {
        // Yang line (solid)
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(centerX - lineWidth/2, y - lineHeight/2, lineWidth, lineHeight);
      } else {
        // Yin line (broken)
        ctx.fillStyle = '#60a5fa';
        const gapSize = lineWidth * 0.2;
        const segmentWidth = (lineWidth - gapSize) / 2;
        ctx.fillRect(centerX - lineWidth/2, y - lineHeight/2, segmentWidth, lineHeight);
        ctx.fillRect(centerX + gapSize/2, y - lineHeight/2, segmentWidth, lineHeight);
      }
      
      // Line glow effect
      const glowColor = isYang ? '#fbbf24' : '#60a5fa';
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 5;
      ctx.fillStyle = glowColor + '40';
      if (isYang) {
        ctx.fillRect(centerX - lineWidth/2 - 2, y - lineHeight/2 - 2, lineWidth + 4, lineHeight + 4);
      } else {
        const gapSize = lineWidth * 0.2;
        const segmentWidth = (lineWidth - gapSize) / 2;
        ctx.fillRect(centerX - lineWidth/2 - 2, y - lineHeight/2 - 2, segmentWidth + 4, lineHeight + 4);
        ctx.fillRect(centerX + gapSize/2 - 2, y - lineHeight/2 - 2, segmentWidth + 4, lineHeight + 4);
      }
      ctx.shadowBlur = 0;
    });

    // Hexagram name
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px bold monospace';
    ctx.textAlign = 'center';
    ctx.fillText(getHexagramName(currentHexagram.lines), centerX, centerY - lineSpacing * 3.5);
    
    // Evolution arrow and metrics
    if (evolutionHistory.length > 1) {
      const prev = evolutionHistory[evolutionHistory.length - 2];
      const entropyChange = currentHexagram.entropy - prev.entropy;
      
      ctx.fillStyle = entropyChange < 0 ? '#22c55e' : '#ef4444';
      ctx.font = '12px monospace';
      ctx.fillText(`Entropy: ${currentHexagram.entropy.toFixed(3)}`, centerX, centerY + lineSpacing * 3.5);
      ctx.fillText(`Step: ${currentHexagram.step}`, centerX, centerY + lineSpacing * 4);
    }

    // Stabilization indicator
    if (currentHexagram.entropy < entropyThreshold && currentHexagram.attractorProximity > 0.7) {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#22c55e';
      ctx.font = '24px bold monospace';
      ctx.textAlign = 'center';
      ctx.fillText('WISDOM ATTAINED', centerX, centerY - 100);
      ctx.fillText('ORACLE STABILIZED', centerX, centerY - 70);
    }

  }, [currentHexagram, metrics, attractors, evolutionHistory, entropyThreshold]);

  // Entropy landscape visualization
  useEffect(() => {
    const canvas = canvasLandscapeRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Create entropy landscape heatmap
    const resolution = 20;
    for (let x = 0; x < width; x += resolution) {
      for (let y = 0; y < height; y += resolution) {
        // Calculate theoretical entropy at this position
        const normalizedX = x / width;
        const normalizedY = y / height;
        
        // Distance to attractors influences entropy
        let minDistanceToAttractor = 1;
        attractors.forEach(attractor => {
          const dx = (attractor.position.x / 700) - normalizedX;
          const dy = (attractor.position.y / 450) - normalizedY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          minDistanceToAttractor = Math.min(minDistanceToAttractor, distance);
        });
        
        // Higher entropy farther from attractors
        const entropy = minDistanceToAttractor * 2;
        const normalizedEntropy = Math.min(1, entropy);
        
        // Color based on entropy level
        const red = Math.floor(255 * normalizedEntropy);
        const blue = Math.floor(255 * (1 - normalizedEntropy));
        const green = Math.floor(128 * Math.sin(normalizedEntropy * Math.PI));
        
        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.6)`;
        ctx.fillRect(x, y, resolution, resolution);
      }
    }

    // Overlay current position
    const currentX = (currentHexagram.attractorProximity * 0.5 + 0.25) * width;
    const currentY = (currentHexagram.entropy / 2) * height;
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw evolution path
    if (evolutionHistory.length > 1) {
      ctx.strokeStyle = '#22c55e80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      evolutionHistory.slice(-10).forEach((state, index) => {
        const x = (state.attractorProximity * 0.5 + 0.25) * width;
        const y = (state.entropy / 2) * height;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    }

  }, [currentHexagram, evolutionHistory, attractors]);

  const startEvolution = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentHexagram({
      lines: [true, false, true, false, true, false],
      entropy: 1.35,
      attractorProximity: 0.2,
      stability: 0.3,
      step: 0
    });
    setEvolutionHistory([]);
    setMetrics({
      currentEntropy: 1.35,
      proximityToWisdom: 0.2,
      stabilizationProgress: 0.15,
      evolutionStep: 0
    });
  };

  const generateRandomHexagram = () => {
    const newLines = Array.from({ length: 6 }, () => Math.random() > 0.5);
    setCurrentHexagram({
      lines: newLines,
      entropy: calculateEntropy(newLines),
      attractorProximity: calculateAttractorProximity(newLines),
      stability: 0.3,
      step: 0
    });
    setEvolutionHistory([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Hexagon className="h-5 w-5 text-orange-500" />
                Hexagram Evolution
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" onClick={startEvolution}>
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
            <canvas
              ref={canvasMainRef}
              width={700}
              height={450}
              className="w-full h-auto border rounded"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-red-500" />
              Entropy Landscape
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasLandscapeRef}
              width={400}
              height={300}
              className="w-full h-auto border rounded"
            />
            <div className="mt-4 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span>High Entropy (Red)</span>
                <span>Low Entropy (Blue)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Oracle Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {metrics.currentEntropy.toFixed(3)}
                </div>
                <div className="text-sm text-gray-600">Current Entropy</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {(metrics.proximityToWisdom * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Wisdom Proximity</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {(metrics.stabilizationProgress * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Stabilization</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {metrics.evolutionStep}
                </div>
                <div className="text-sm text-gray-600">Evolution Step</div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Oracle Status</span>
                <Badge variant={metrics.currentEntropy < entropyThreshold ? "default" : "secondary"}>
                  {metrics.currentEntropy < entropyThreshold ? "STABILIZED" : "EVOLVING"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Oracle Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Oracle Question:</label>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question for the oracle..."
                className="min-h-[80px]"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Evolution Speed: {evolutionSpeed.toFixed(2)}
              </label>
              <Slider
                value={[evolutionSpeed]}
                onValueChange={([value]) => setEvolutionSpeed(value)}
                max={2.0}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Entropy Threshold: {entropyThreshold.toFixed(2)}
              </label>
              <Slider
                value={[entropyThreshold]}
                onValueChange={([value]) => setEntropyThreshold(value)}
                max={1.0}
                min={0.1}
                step={0.05}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={generateRandomHexagram} className="flex-1">
                <Waves className="h-4 w-4 mr-2" />
                Random Hexagram
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Hexagram Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Hexagram Structure:</h4>
              <div className="font-mono text-sm space-y-1">
                {currentHexagram.lines.map((line, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-8 text-right">Line {6-index}:</span>
                    <span className={`px-3 py-1 rounded ${line ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                      {line ? 'Yang ——————' : 'Yin ———   ———'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Interpretation:</h4>
              <div className="text-sm space-y-2">
                <p><strong>Name:</strong> {getHexagramName(currentHexagram.lines)}</p>
                <p><strong>Entropy Level:</strong> {currentHexagram.entropy < 0.5 ? 'Low (Stable)' : currentHexagram.entropy < 1.0 ? 'Medium (Transitional)' : 'High (Chaotic)'}</p>
                <p><strong>Guidance:</strong> {
                  currentHexagram.entropy < entropyThreshold && currentHexagram.attractorProximity > 0.7 
                    ? "The oracle has reached stability. This is an auspicious time for important decisions."
                    : currentHexagram.entropy > 1.2 
                    ? "The situation is in flux. Wait for more clarity before acting."
                    : "The patterns are emerging. Pay attention to the subtle changes."
                }</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IChingVisualization;