import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Brain, Cpu, Database, Play, Pause, RotateCcw, Settings, FileText, TrendingUp, Hash } from "lucide-react";

interface SymbolMapping {
  symbol: string;
  unicode: string;
  prime: number;
  frequency: number;
  entropy: number;
  signature: string;
}

interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  learningRate: number;
  temperature: number;
  symbolsLearned: number;
  patternMatches: number;
}

interface Engine {
  id: string;
  name: string;
  status: 'idle' | 'training' | 'processing' | 'error';
  symbolMappings: SymbolMapping[];
  trainingMetrics: TrainingMetrics;
  totalTextsProcessed: number;
  autonomyLevel: number;
}

const SAIVisualization = () => {
  const canvasSymbolsRef = useRef<HTMLCanvasElement>(null);
  const canvasTrainingRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [isTraining, setIsTraining] = useState(false);
  const [engine, setEngine] = useState<Engine>({
    id: 'engine_demo_001',
    name: 'Demo Symbolic Engine',
    status: 'idle',
    symbolMappings: [],
    trainingMetrics: {
      epoch: 0,
      loss: 1.0,
      accuracy: 0.1,
      learningRate: 0.01,
      temperature: 1.0,
      symbolsLearned: 0,
      patternMatches: 0
    },
    totalTextsProcessed: 0,
    autonomyLevel: 0.3
  });
  
  const [inputText, setInputText] = useState('The quantum AI system learns symbolic patterns through prime-based encoding.');
  const [trainingData, setTrainingData] = useState([
    'Artificial intelligence processes symbolic information.',
    'Neural networks learn patterns from training data.',
    'Machine learning algorithms optimize through iterations.',
    'Deep learning models understand complex relationships.',
    'Symbolic AI represents knowledge through symbols.'
  ]);
  
  const [parameters, setParameters] = useState({
    learningRate: 0.01,
    temperature: 1.0,
    batchSize: 32,
    maxEpochs: 100,
    entropyThreshold: 0.8
  });

  const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

  // Initialize symbol mappings
  useEffect(() => {
    const commonSymbols = ['a', 'e', 'i', 'o', 'u', 't', 'n', 'r', 's', 'l', 'c', 'd', 'p', 'm', 'f', 'g', 'h', 'b', 'y', 'w'];
    
    const initialMappings: SymbolMapping[] = commonSymbols.map((symbol, index) => ({
      symbol,
      unicode: symbol.charCodeAt(0).toString(16).padStart(4, '0'),
      prime: primeNumbers[index] || 2,
      frequency: Math.random() * 0.1 + 0.05,
      entropy: Math.random() * 0.3 + 0.2,
      signature: generatePrimeSignature(symbol, primeNumbers[index] || 2)
    }));
    
    setEngine(prev => ({
      ...prev,
      symbolMappings: initialMappings,
      trainingMetrics: {
        ...prev.trainingMetrics,
        symbolsLearned: initialMappings.length
      }
    }));
  }, []);

  function generatePrimeSignature(symbol: string, prime: number): string {
    const charCode = symbol.charCodeAt(0);
    const signature = (charCode * prime) % 1000;
    return signature.toString(16).padStart(3, '0');
  }

  // Training simulation
  useEffect(() => {
    if (!isTraining) return;

    const trainStep = () => {
      setEngine(prev => {
        const newEpoch = prev.trainingMetrics.epoch + 1;
        const progress = Math.min(newEpoch / parameters.maxEpochs, 1);
        
        // Simulate loss decrease and accuracy increase
        const newLoss = Math.max(0.05, prev.trainingMetrics.loss * 0.995);
        const newAccuracy = Math.min(0.95, prev.trainingMetrics.accuracy + 0.002);
        const newTemperature = parameters.temperature * Math.exp(-progress * 2);
        
        // Update symbol mappings with learning
        const updatedMappings = prev.symbolMappings.map(mapping => ({
          ...mapping,
          frequency: Math.min(1.0, mapping.frequency + Math.random() * 0.001),
          entropy: Math.max(0.1, mapping.entropy + (Math.random() - 0.5) * 0.01)
        }));

        // Add new symbols occasionally
        if (newEpoch % 10 === 0 && updatedMappings.length < 50) {
          const newSymbol = String.fromCharCode(97 + updatedMappings.length);
          updatedMappings.push({
            symbol: newSymbol,
            unicode: newSymbol.charCodeAt(0).toString(16).padStart(4, '0'),
            prime: primeNumbers[updatedMappings.length % primeNumbers.length],
            frequency: Math.random() * 0.05,
            entropy: Math.random() * 0.2 + 0.1,
            signature: generatePrimeSignature(newSymbol, primeNumbers[updatedMappings.length % primeNumbers.length])
          });
        }

        const newStatus = progress >= 1 ? 'idle' : 'training';
        if (newStatus === 'idle') {
          setIsTraining(false);
        }

        return {
          ...prev,
          status: newStatus,
          symbolMappings: updatedMappings,
          trainingMetrics: {
            epoch: newEpoch,
            loss: newLoss,
            accuracy: newAccuracy,
            learningRate: parameters.learningRate,
            temperature: newTemperature,
            symbolsLearned: updatedMappings.length,
            patternMatches: prev.trainingMetrics.patternMatches + Math.floor(Math.random() * 5)
          },
          totalTextsProcessed: prev.totalTextsProcessed + Math.floor(Math.random() * 3),
          autonomyLevel: Math.min(0.9, prev.autonomyLevel + 0.001)
        };
      });
    };

    const interval = setInterval(trainStep, 200);
    return () => clearInterval(interval);
  }, [isTraining, parameters]);

  // Symbol mapping visualization
  useEffect(() => {
    const canvas = canvasSymbolsRef.current;
    if (!canvas || engine.symbolMappings.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f0f9ff');
      gradient.addColorStop(1, '#e0f2fe');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cols = 8;
      const rows = Math.ceil(engine.symbolMappings.length / cols);
      const cellWidth = canvas.width / cols;
      const cellHeight = Math.min(60, canvas.height / rows);

      // Draw symbol mappings as a grid
      engine.symbolMappings.forEach((mapping, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = col * cellWidth;
        const y = row * cellHeight;

        // Symbol background based on frequency
        const intensity = mapping.frequency * 255;
        ctx.fillStyle = `rgba(34, 197, 94, ${mapping.frequency})`;
        ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);

        // Symbol character
        ctx.fillStyle = '#1f2937';
        ctx.font = '20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(mapping.symbol, x + cellWidth/2, y + cellHeight/2 - 5);

        // Prime number
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px monospace';
        ctx.fillText(`P${mapping.prime}`, x + cellWidth/2, y + cellHeight/2 + 10);

        // Unicode
        ctx.fillStyle = '#9ca3af';
        ctx.font = '8px monospace';
        ctx.fillText(`U+${mapping.unicode}`, x + cellWidth/2, y + cellHeight/2 + 20);

        // Entropy indicator
        const entropyBarWidth = (cellWidth - 10) * mapping.entropy;
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x + 5, y + cellHeight - 8, entropyBarWidth, 3);
      });

      // Draw prime signature connections
      if (isTraining) {
        engine.symbolMappings.forEach((mapping, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const x = col * cellWidth + cellWidth/2;
          const y = row * cellHeight + cellHeight/2;

          // Find related symbols (same prime modulo)
          engine.symbolMappings.forEach((otherMapping, otherIndex) => {
            if (index !== otherIndex && mapping.prime % 7 === otherMapping.prime % 7) {
              const otherCol = otherIndex % cols;
              const otherRow = Math.floor(otherIndex / cols);
              const otherX = otherCol * cellWidth + cellWidth/2;
              const otherY = otherRow * cellHeight + cellHeight/2;

              ctx.strokeStyle = `rgba(139, 92, 246, ${mapping.entropy * 0.3})`;
              ctx.lineWidth = 1;
              ctx.setLineDash([2, 2]);
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(otherX, otherY);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          });
        });
      }
    };

    const interval = setInterval(draw, 100);
    return () => clearInterval(interval);
  }, [engine.symbolMappings, isTraining]);

  // Training metrics visualization
  useEffect(() => {
    const canvas = canvasTrainingRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const padding = 40;
      const chartWidth = canvas.width - padding * 2;
      const chartHeight = canvas.height - padding * 2;

      // Draw grid
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let i = 0; i <= 10; i++) {
        const x = padding + (i / 10) * chartWidth;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
      }

      // Draw loss curve (decreasing)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      const maxEpochs = Math.max(parameters.maxEpochs || 100, engine.trainingMetrics.epoch);
      for (let i = 0; i <= engine.trainingMetrics.epoch; i++) {
        const x = padding + (i / maxEpochs) * chartWidth;
        const loss = Math.exp(-i * 0.02) * 0.9 + 0.05; // Exponential decay
        const y = padding + chartHeight - (loss * chartHeight);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw accuracy curve (increasing)
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      for (let i = 0; i <= engine.trainingMetrics.epoch; i++) {
        const x = padding + (i / maxEpochs) * chartWidth;
        const accuracy = 1 - Math.exp(-i * 0.015); // Exponential approach to 1
        const y = padding + chartHeight - (accuracy * chartHeight);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw temperature curve (cooling)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i <= engine.trainingMetrics.epoch; i++) {
        const x = padding + (i / maxEpochs) * chartWidth;
        const temp = Math.exp(-i * 0.03) * parameters.temperature;
        const y = padding + chartHeight - (temp / parameters.temperature * chartHeight * 0.5);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      
      ctx.fillStyle = '#ef4444';
      ctx.fillText('Loss', padding + 10, padding + 20);
      
      ctx.fillStyle = '#22c55e';
      ctx.fillText('Accuracy', padding + 10, padding + 40);
      
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('Temperature', padding + 10, padding + 60);

      // Current values
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.fillText(`Epoch: ${engine.trainingMetrics.epoch}`, canvas.width - padding - 10, padding + 20);
      ctx.fillText(`Loss: ${engine.trainingMetrics.loss.toFixed(4)}`, canvas.width - padding - 10, padding + 40);
      ctx.fillText(`Acc: ${engine.trainingMetrics.accuracy.toFixed(3)}`, canvas.width - padding - 10, padding + 60);
    };

    const interval = setInterval(draw, 100);
    return () => clearInterval(interval);
  }, [engine.trainingMetrics, parameters]);

  const processText = async () => {
    if (!inputText.trim()) return;
    
    setEngine(prev => ({ ...prev, status: 'processing' }));
    
    // Simulate text processing
    setTimeout(() => {
      const words = inputText.toLowerCase().split(/\s+/);
      const processedSymbols = new Set();
      
      words.forEach(word => {
        for (const char of word) {
          if (/[a-z]/.test(char)) {
            processedSymbols.add(char);
          }
        }
      });

      setEngine(prev => {
        const updatedMappings = prev.symbolMappings.map(mapping => {
          if (processedSymbols.has(mapping.symbol)) {
            return {
              ...mapping,
              frequency: Math.min(1.0, mapping.frequency + 0.05),
              entropy: Math.min(1.0, mapping.entropy + 0.02)
            };
          }
          return mapping;
        });

        return {
          ...prev,
          status: 'idle',
          symbolMappings: updatedMappings,
          totalTextsProcessed: prev.totalTextsProcessed + 1
        };
      });
    }, 1000);
  };

  const startTraining = () => {
    setIsTraining(true);
    setEngine(prev => ({ 
      ...prev, 
      status: 'training',
      trainingMetrics: {
        ...prev.trainingMetrics,
        epoch: 0,
        loss: 1.0,
        accuracy: 0.1
      }
    }));
  };

  const stopTraining = () => {
    setIsTraining(false);
    setEngine(prev => ({ ...prev, status: 'idle' }));
  };

  const resetEngine = () => {
    setIsTraining(false);
    setEngine(prev => ({
      ...prev,
      status: 'idle',
      trainingMetrics: {
        epoch: 0,
        loss: 1.0,
        accuracy: 0.1,
        learningRate: parameters.learningRate,
        temperature: parameters.temperature,
        symbolsLearned: prev.symbolMappings.length,
        patternMatches: 0
      },
      totalTextsProcessed: 0,
      autonomyLevel: 0.3
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-emerald-500" />
                Symbolic Engine Status
              </CardTitle>
              <Badge 
                variant={engine.status === 'training' ? 'default' : 
                        engine.status === 'processing' ? 'secondary' : 'outline'}
              >
                {engine.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Training Progress</span>
                  <span>{engine.trainingMetrics.epoch}/{parameters.maxEpochs}</span>
                </div>
                <Progress value={(engine.trainingMetrics.epoch / parameters.maxEpochs) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Accuracy</span>
                  <span>{(engine.trainingMetrics.accuracy * 100).toFixed(1)}%</span>
                </div>
                <Progress value={engine.trainingMetrics.accuracy * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Autonomy Level</span>
                  <span>{(engine.autonomyLevel * 100).toFixed(1)}%</span>
                </div>
                <Progress value={engine.autonomyLevel * 100} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-lg font-bold text-emerald-600">
                      {engine.trainingMetrics.symbolsLearned}
                    </div>
                    <div className="text-xs text-gray-600">Symbols Learned</div>
                  </div>
                  <div className="text-center p-3 bg-teal-50 rounded-lg">
                    <div className="text-lg font-bold text-teal-600">
                      {engine.totalTextsProcessed}
                    </div>
                    <div className="text-xs text-gray-600">Texts Processed</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Training Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasTrainingRef}
              width={400}
              height={200}
              className="w-full h-auto border rounded bg-gray-900"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-purple-500" />
            Symbol Mappings & Prime Signatures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasSymbolsRef}
            width={800}
            height={300}
            className="w-full h-auto border rounded bg-blue-50"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Text Processing Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Input Text:</label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to process through symbolic engine..."
                className="min-h-[80px]"
              />
            </div>
            
            <Button 
              onClick={processText} 
              disabled={engine.status === 'processing' || !inputText.trim()}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Process Text
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={startTraining} 
                disabled={isTraining}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Training
              </Button>
              
              <Button 
                onClick={stopTraining} 
                disabled={!isTraining}
                variant="outline"
                className="flex-1"
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop
              </Button>
              
              <Button 
                onClick={resetEngine}
                variant="outline"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Learning Rate: {parameters.learningRate}</label>
                <Slider
                  value={[parameters.learningRate]}
                  onValueChange={([value]) => setParameters(prev => ({ ...prev, learningRate: value }))}
                  min={0.001}
                  max={0.1}
                  step={0.001}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Temperature: {parameters.temperature.toFixed(2)}</label>
                <Slider
                  value={[parameters.temperature]}
                  onValueChange={([value]) => setParameters(prev => ({ ...prev, temperature: value }))}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Max Epochs: {parameters.maxEpochs}</label>
                <Slider
                  value={[parameters.maxEpochs]}
                  onValueChange={([value]) => setParameters(prev => ({ ...prev, maxEpochs: value }))}
                  min={10}
                  max={500}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {trainingData.map((text, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                <span className="font-mono text-xs text-gray-500 mr-2">{index + 1}.</span>
                {text}
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Loss:</span> {engine.trainingMetrics.loss.toFixed(4)}
              </div>
              <div>
                <span className="font-medium">Temperature:</span> {engine.trainingMetrics.temperature.toFixed(3)}
              </div>
              <div>
                <span className="font-medium">Pattern Matches:</span> {engine.trainingMetrics.patternMatches}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SAIVisualization;