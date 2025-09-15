/* eslint-disable no-case-declarations */
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Cpu, Target, Globe, Brain, Hexagon, Atom, Network, 
  Play, RotateCcw, Settings, Download, Upload,
  Zap, TrendingUp, Activity, AlertCircle, CheckCircle,
  Copy, Send, Eye, Code, BarChart3
} from "lucide-react";

interface ApiConfig {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  endpoint: string;
  params: Record<string, unknown>;
  defaultPayload: Record<string, unknown>;
  description: string;
}

interface PlaygroundState {
  selectedApi: string;
  isRunning: boolean;
  results: Record<string, unknown>;
  performance: {
    responseTime: number;
    success: boolean;
    timestamp: Date;
  };
  visualizationData: unknown[];
}

const apiConfigs: ApiConfig[] = [
  {
    id: 'rnet',
    name: 'Resonance Network (RNET)',
    icon: Network,
    color: 'indigo',
    endpoint: '/v1/spaces',
    params: {
      clientCount: 4,
      deltaRate: 2.0,
      coherenceThreshold: 0.8,
      resonanceTarget: 0.85
    },
    defaultPayload: {
      name: 'demo-space',
      basis: { primes: [2, 3, 5, 7, 11, 13], cutoff: 1024 },
      phases: { golden: true, silver: true },
      operators: { resonanceTarget: 0.85 }
    },
    description: 'Create collaborative resonance spaces with real-time synchronization'
  },
  {
    id: 'srs',
    name: 'Symbolic Resonance Solver',
    icon: Cpu,
    color: 'blue',
    endpoint: '/v1/srs/solve',
    params: {
      complexity: 0.7,
      maxIterations: 1000,
      plateauThreshold: 0.01,
      entropyMode: 'adaptive'
    },
    defaultPayload: {
      problem: 'optimization',
      constraints: ['x + y <= 10', 'x - y >= 0'],
      objective: 'maximize: 2x + 3y',
      variables: ['x', 'y']
    },
    description: 'Solve NP-complete problems using entropy particle systems'
  },
  {
    id: 'qsem',
    name: 'Quantum Semantics',
    icon: Network,
    color: 'emerald',
    endpoint: '/v1/qsem/analyze',
    params: {
      primeBase: 7,
      vectorDimensions: 3,
      coherenceThreshold: 0.8,
      resonanceMode: 'harmonic'
    },
    defaultPayload: {
      text: 'quantum consciousness and semantic understanding',
      context: 'scientific analysis',
      depth: 'comprehensive'
    },
    description: 'Analyze semantic meaning through prime basis vector spaces'
  },
  {
    id: 'hqe',
    name: 'Holographic Quantum Encoder',
    icon: Target,
    color: 'purple',
    endpoint: '/v1/hqe/encode',
    params: {
      dimensions: 3,
      coherenceLevel: 0.9,
      resonanceTarget: 'phi_golden',
      evolutionSteps: 100
    },
    defaultPayload: {
      quantumState: [0.707, 0.707],
      holographicLayers: 5,
      eigenstateBasis: 'prime_sequence'
    },
    description: 'Encode data in 3D holographic quantum states'
  },
  {
    id: 'nlc',
    name: 'Non-Local Communication',
    icon: Globe,
    color: 'green',
    endpoint: '/v1/nlc/transmit',
    params: {
      channelPrimes: [2, 3, 5, 7],
      phaseSync: 'golden_silver',
      stabilityThreshold: 0.85,
      entanglementStrength: 0.9
    },
    defaultPayload: {
      message: 'Quantum entanglement transmission test',
      recipient: 'quantum_channel_01',
      priority: 'high'
    },
    description: 'Transmit information through quantum entanglement channels'
  },
  {
    id: 'qcr',
    name: 'Quantum Consciousness Resonator',
    icon: Brain,
    color: 'pink',
    endpoint: '/v1/qcr/resonate',
    params: {
      cognitiveMode: 'triadic',
      consciousnessLevel: 0.75,
      resonancePattern: 'harmonic',
      networkComplexity: 5
    },
    defaultPayload: {
      consciousnessPattern: 'awareness_state_alpha',
      intention: 'problem_solving',
      context: 'creative_thinking'
    },
    description: 'Simulate consciousness through triadic resonance networks'
  },
  {
    id: 'iching',
    name: 'I-Ching Oracle',
    icon: Hexagon,
    color: 'amber',
    endpoint: '/v1/iching/divine',
    params: {
      entropySource: 'quantum',
      hexagramEvolution: true,
      landscapeMapping: true,
      attractorAnalysis: true
    },
    defaultPayload: {
      question: 'What is the optimal path forward in this technological endeavor?',
      context: 'innovation_decision',
      timeframe: 'near_future'
    },
    description: 'Divine insights through hexagram transformations and entropy landscapes'
  },
  {
    id: 'unified',
    name: 'Unified Physics',
    icon: Atom,
    color: 'cyan',
    endpoint: '/v1/unified/compute',
    params: {
      observerCount: 5,
      entropyCoefficient: 0.75,
      gravityMode: 'emergent',
      couplingStrength: 0.85
    },
    defaultPayload: {
      observerConfiguration: 'distributed',
      spacetimeRegion: 'local_cluster',
      computationTarget: 'gravity_constant'
    },
    description: 'Compute emergent gravity through observer-entropy coupling'
  }
];

const AdvancedPlayground = () => {
  const [state, setState] = useState<PlaygroundState>({
    selectedApi: 'srs',
    isRunning: false,
    results: {},
    performance: {
      responseTime: 0,
      success: false,
      timestamp: new Date()
    },
    visualizationData: []
  });

  const [requestPayload, setRequestPayload] = useState<string>('');
  const [apiParams, setApiParams] = useState<Record<string, unknown>>({});
  const [showResponse, setShowResponse] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedConfig = apiConfigs.find(config => config.id === state.selectedApi) || apiConfigs[0];

  // Initialize payload and params when API changes
  useEffect(() => {
    setRequestPayload(JSON.stringify(selectedConfig.defaultPayload, null, 2));
    setApiParams(selectedConfig.params);
  }, [state.selectedApi]);

  // Real-time visualization simulation
  useEffect(() => {
    if (!state.isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const startTime = Date.now();

    const animate = () => {
      const time = (Date.now() - startTime) * 0.001;
      
      // Clear canvas with API-specific background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const colors = getApiColors(selectedConfig.color);
      gradient.addColorStop(0, `${colors.primary}20`);
      gradient.addColorStop(1, `${colors.secondary}10`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw API-specific visualization
      drawApiVisualization(ctx, selectedConfig.id, time, canvas.width, canvas.height);

      if (state.isRunning) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [state.isRunning, selectedConfig]);

  const getApiColors = (colorName: string) => {
    const colorMap: Record<string, { primary: string; secondary: string }> = {
      indigo: { primary: '#6366f1', secondary: '#4f46e5' },
      blue: { primary: '#3b82f6', secondary: '#1e40af' },
      emerald: { primary: '#10b981', secondary: '#059669' },
      purple: { primary: '#8b35c1', secondary: '#6b21a8' },
      green: { primary: '#22c55e', secondary: '#16a34a' },
      pink: { primary: '#ec4899', secondary: '#be185d' },
      amber: { primary: '#f59e0b', secondary: '#d97706' },
      cyan: { primary: '#06b6d4', secondary: '#0891b2' }
    };
    return colorMap[colorName] || colorMap.blue;
  };

  const drawApiVisualization = (ctx: CanvasRenderingContext2D, apiId: string, time: number, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    switch (apiId) {
      case 'rnet': {
        // Multi-client resonance space
        const clients = 4;
        for (let i = 0; i < clients; i++) {
          const angle = (i / clients) * Math.PI * 2 + time * 0.3;
          const radius = 60 + Math.sin(time + i) * 20;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          ctx.fillStyle = `hsl(${240 + i * 30}, 70%, 60%)`;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
          
          // Connection to center
          ctx.strokeStyle = `hsl(${240 + i * 30}, 70%, 60%)`;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(centerX, centerY);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        
        // Center resonance space
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25 + Math.sin(time * 2) * 5, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      
      case 'srs':
        // Entropy particles
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2 + time;
          const radius = 50 + Math.sin(time + i) * 30;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          ctx.fillStyle = `hsl(${200 + i * 10}, 70%, 60%)`;
          ctx.beginPath();
          ctx.arc(x, y, 3 + Math.sin(time * 2 + i) * 2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'qsem':
        // Prime vector network
        const primes = [2, 3, 5, 7, 11];
        primes.forEach((prime, i) => {
          const angle = (i / primes.length) * Math.PI * 2;
          const x = centerX + Math.cos(angle) * 80;
          const y = centerY + Math.sin(angle) * 80;
          
          ctx.strokeStyle = `hsl(${120 + i * 20}, 60%, 50%)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.stroke();
          
          ctx.fillStyle = `hsl(${120 + i * 20}, 80%, 60%)`;
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();
        });
        break;

      case 'hqe':
        // 3D holographic projection
        for (let layer = 0; layer < 5; layer++) {
          const radius = 20 + layer * 15;
          const rotation = time + layer * 0.5;
          
          ctx.strokeStyle = `rgba(139, 69, 193, ${0.8 - layer * 0.15})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, rotation, rotation + Math.PI * 1.5);
          ctx.stroke();
        }
        break;

      case 'nlc':
        // Quantum entanglement channels
        const channels = 6;
        for (let i = 0; i < channels; i++) {
          const angle1 = (i / channels) * Math.PI * 2 + time;
          const angle2 = ((i + 1) / channels) * Math.PI * 2 + time;
          
          const x1 = centerX + Math.cos(angle1) * 60;
          const y1 = centerY + Math.sin(angle1) * 60;
          const x2 = centerX + Math.cos(angle2) * 60;
          const y2 = centerY + Math.sin(angle2) * 60;
          
          ctx.strokeStyle = `hsl(${120}, 70%, 60%)`;
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        break;

      case 'qcr':
        // Triadic consciousness network
        const nodes = 3;
        for (let i = 0; i < nodes; i++) {
          const angle = (i / nodes) * Math.PI * 2 + time * 0.5;
          const x = centerX + Math.cos(angle) * 50;
          const y = centerY + Math.sin(angle) * 50;
          
          // Consciousness field
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
          gradient.addColorStop(0, 'rgba(236, 72, 153, 0.6)');
          gradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, 30, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'iching':
        // Hexagram evolution
        const hexagramRadius = 60;
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const x = centerX + Math.cos(angle) * hexagramRadius;
          const y = centerY + Math.sin(angle) * hexagramRadius;
          
          const lineLength = 20;
          const isBroken = Math.sin(time + i) > 0;
          
          ctx.strokeStyle = `hsl(${45}, 80%, 60%)`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          
          if (isBroken) {
            ctx.moveTo(x - lineLength/2, y);
            ctx.lineTo(x - 3, y);
            ctx.moveTo(x + 3, y);
            ctx.lineTo(x + lineLength/2, y);
          } else {
            ctx.moveTo(x - lineLength/2, y);
            ctx.lineTo(x + lineLength/2, y);
          }
          ctx.stroke();
        }
        break;

      case 'unified':
        // Emergent gravity field
        const fieldPoints = 15;
        for (let i = 0; i < fieldPoints; i++) {
          for (let j = 0; j < fieldPoints; j++) {
            const x = (i / fieldPoints) * width;
            const y = (j / fieldPoints) * height;
            const distance = Math.sqrt((x - centerX)**2 + (y - centerY)**2);
            const fieldStrength = Math.max(0, 1 - distance / 100);
            
            if (fieldStrength > 0.1) {
              ctx.fillStyle = `rgba(6, 182, 212, ${fieldStrength * 0.5})`;
              ctx.beginPath();
              ctx.arc(x, y, fieldStrength * 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        break;
    }
  };

  const executeApiCall = async () => {
    setState(prev => ({ ...prev, isRunning: true }));
    setShowResponse(false);

    try {
      // Simulate API call
      const startTime = Date.now();
      
      // Parse payload
      const payload = JSON.parse(requestPayload);
      
      // Simulate processing time based on API complexity
      const processingTime = Math.random() * 1000 + 500;
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Generate mock response based on API type
      const mockResponse = generateMockResponse(selectedConfig.id, payload, apiParams);
      
      const responseTime = Date.now() - startTime;
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        results: {
          ...prev.results,
          [selectedConfig.id]: mockResponse
        },
        performance: {
          responseTime,
          success: true,
          timestamp: new Date()
        }
      }));
      
      setShowResponse(true);
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        performance: {
          responseTime: 0,
          success: false,
          timestamp: new Date()
        }
      }));
    }
  };

  const generateMockResponse = (apiId: string, payload: Record<string, unknown>, params: Record<string, unknown>) => {
    const baseResponse = {
      status: 'success',
      timestamp: new Date().toISOString(),
      processingTime: Math.random() * 500 + 100,
      apiVersion: '1.0.0'
    };

    switch (apiId) {
      case 'rnet':
        return {
          ...baseResponse,
          space: {
            id: 'space_' + Math.random().toString(36).substr(2, 8),
            name: (payload as { name?: string }).name || 'demo-space',
            epoch: 1,
            version: Math.floor(Math.random() * 100) + 100,
            members: (params as { clientCount?: number }).clientCount || 4,
            status: 'active'
          },
          session: {
            sessionId: 'session_' + Math.random().toString(36).substr(2, 8),
            websocketUrl: 'wss://rt.psizero.com/spaces/demo',
            token: 'jwt_' + Math.random().toString(36).substr(2, 16),
            expiresIn: 3600
          },
          telemetry: {
            resonanceStrength: Math.random() * 0.3 + 0.7,
            coherence: Math.random() * 0.2 + 0.8,
            locality: Math.random() * 0.4 + 0.6,
            entropy: Math.random() * 0.3 + 0.3,
            dominance: Math.random() * 0.2 + 0.7
          }
        };

      case 'srs':
        return {
          ...baseResponse,
          solution: {
            variables: { x: 3.2, y: 2.8 },
            objectiveValue: 14.8,
            iterations: Math.floor(Math.random() * 500 + 100),
            convergenceRate: 0.95,
            entropyReduction: 0.87
          },
          metrics: {
            plateauDetections: 3,
            particleSystemStability: 0.92,
            constraintSatisfaction: 1.0
          }
        };

      case 'qsem':
        return {
          ...baseResponse,
          analysis: {
            semanticCoherence: 0.89,
            primeVectorMapping: [[2, 0.8], [3, 0.6], [5, 0.9], [7, 0.7]],
            conceptResonance: {
              quantum: 0.95,
              consciousness: 0.87,
              understanding: 0.82
            }
          },
          insights: [
            'Strong quantum-consciousness correlation detected',
            'Prime basis 5 shows highest semantic resonance',
            'Conceptual network exhibits coherent structure'
          ]
        };

      case 'hqe':
        return {
          ...baseResponse,
          encoding: {
            holographicLayers: 5,
            quantumCoherence: 0.94,
            eigenstateStability: 0.91,
            resonanceTarget: 'phi_golden',
            evolutionSteps: 100
          },
          visualization: {
            dimensions: 3,
            amplitudeSpectrum: Array.from({length: 10}, () => Math.random()),
            phaseCoherence: 0.88
          }
        };

      case 'nlc':
        return {
          ...baseResponse,
          transmission: {
            messageId: 'nlc_' + Math.random().toString(36).substr(2, 8),
            channelQuality: 0.96,
            transmissionTime: '<1ms',
            entanglementStrength: 0.93,
            phaseAlignment: {
              golden: 0.89,
              silver: 0.85
            }
          },
          channels: [
            { prime: 2, stability: 0.94, synchronized: true },
            { prime: 3, stability: 0.91, synchronized: true },
            { prime: 5, stability: 0.88, synchronized: false },
            { prime: 7, stability: 0.96, synchronized: true }
          ]
        };

      case 'qcr':
        return {
          ...baseResponse,
          resonance: {
            consciousnessLevel: 0.82,
            triadicHarmony: 0.78,
            cognitiveMode: 'enhanced_awareness',
            networkComplexity: 5,
            resonancePattern: 'harmonic'
          },
          insights: {
            emergentPatterns: ['creative_synthesis', 'intuitive_leap', 'logical_integration'],
            consciousnessMetrics: {
              awareness: 0.85,
              intention: 0.79,
              integration: 0.88
            }
          }
        };

      case 'iching':
        return {
          ...baseResponse,
          divination: {
            hexagram: {
              name: 'Innovation (革)',
              number: 49,
              trigrams: ['Fire', 'Lake'],
              lines: [true, false, true, true, false, true]
            },
            interpretation: 'The time of transformation has arrived. Revolutionary changes bring new opportunities.',
            entropyLandscape: {
              currentPosition: [0.3, 0.7],
              attractorStrength: 0.85,
              pathStability: 0.72
            }
          },
          guidance: [
            'Embrace technological innovation with wisdom',
            'Balance revolutionary ideas with practical implementation',
            'The quantum path reveals hidden possibilities'
          ]
        };

      case 'unified':
        return {
          ...baseResponse,
          computation: {
            emergentGravity: {
              fieldStrength: 9.81 * (1 + Math.random() * 0.1),
              gravitationalConstant: 6.674e-11 * (1 + Math.random() * 0.05),
              observerCoupling: 0.84
            },
            spacetimeMetrics: {
              curvature: 0.03,
              observerInfluence: 0.76,
              entropyGradient: 0.68
            }
          },
          observers: Array.from({length: 5}, (_, i) => ({
            id: i + 1,
            position: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 20 - 10],
            mass: 1 + Math.random() * 4,
            entropy: Math.random() * 0.5 + 0.3,
            coupling: Math.random() * 0.4 + 0.5
          }))
        };

      default:
        return baseResponse;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resetPlayground = () => {
    setState({
      selectedApi: 'srs',
      isRunning: false,
      results: {},
      performance: {
        responseTime: 0,
        success: false,
        timestamp: new Date()
      },
      visualizationData: []
    });
    setShowResponse(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Advanced API Playground
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Interactive testing environment for all 7 revolutionary APIs with real-time visualization and performance feedback.
        </p>
      </div>

      {/* API Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            API Selection & Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-3 block">Select API:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {apiConfigs.map((config) => {
                  const IconComponent = config.icon;
                  return (
                    <Card 
                      key={config.id}
                      className={`cursor-pointer transition-all ${
                        state.selectedApi === config.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setState(prev => ({ ...prev, selectedApi: config.id }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-${config.color}-100`}>
                            <IconComponent className={`h-5 w-5 text-${config.color}-600`} />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{config.name}</div>
                            <div className="text-xs text-gray-500">{config.endpoint}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">API Parameters:</label>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(apiParams).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-xs font-medium mb-1 block capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </label>
                    {typeof value === 'number' ? (
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) => 
                          setApiParams(prev => ({ ...prev, [key]: newValue }))
                        }
                        min={0}
                        max={key.includes('Count') || key.includes('Steps') ? 20 : 1}
                        step={0.01}
                        className="w-full"
                      />
                    ) : typeof value === 'boolean' ? (
                      <Select value={value.toString()} onValueChange={(newValue) =>
                        setApiParams(prev => ({ ...prev, [key]: newValue === 'true' }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">True</SelectItem>
                          <SelectItem value="false">False</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={String(value)}
                        onChange={(e) => 
                          setApiParams(prev => ({ ...prev, [key]: e.target.value }))
                        }
                        className="text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Configuration & Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Request Payload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">JSON Payload:</label>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(requestPayload)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={requestPayload}
                  onChange={(e) => setRequestPayload(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="Enter JSON payload..."
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={executeApiCall}
                  disabled={state.isRunning}
                  className="flex-1"
                >
                  {state.isRunning ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Execute API Call
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={resetPlayground}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full border rounded-lg bg-gray-50"
              />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">API Status:</div>
                  <Badge variant={state.isRunning ? "default" : "secondary"}>
                    {state.isRunning ? "Processing" : "Ready"}
                  </Badge>
                </div>
                <div>
                  <div className="font-medium">Selected:</div>
                  <div className="text-gray-600">{selectedConfig.name}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response & Performance */}
      {showResponse && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {state.performance.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  API Response
                </CardTitle>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(JSON.stringify(state.results[selectedConfig.id], null, 2))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm max-h-96 overflow-y-auto">
                <pre>{JSON.stringify(state.results[selectedConfig.id], null, 2)}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {state.performance.responseTime}ms
                    </div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {state.performance.success ? '200' : '500'}
                    </div>
                    <div className="text-sm text-gray-600">Status Code</div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Response Time Distribution:</label>
                  <Progress value={Math.min(100, state.performance.responseTime / 10)} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0ms</span>
                    <span>1000ms</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <div>Timestamp: {state.performance.timestamp.toLocaleTimeString()}</div>
                  <div>API: {selectedConfig.endpoint}</div>
                  <div>Status: {state.performance.success ? 'Success' : 'Error'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <selectedConfig.icon className="h-5 w-5" />
            {selectedConfig.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{selectedConfig.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Endpoint:</h4>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                POST https://api.np-complete.com{selectedConfig.endpoint}
              </code>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Authentication:</h4>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                Bearer YOUR_API_KEY
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedPlayground;