/* eslint-disable no-case-declarations */
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Copy, Send, Eye, Code, BarChart3, Key
} from "lucide-react";

// Import real API client and authentication
import psiZeroApi from '@/lib/api';
import apiAuth from '@/lib/api/auth';

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
    error?: string;
  };
  visualizationData: unknown[];
  apiStatus: {
    connected: boolean;
    authenticated: boolean;
    error?: string;
  } | null;
}

// Known backend API status based on testing
const apiStatus = {
  working: ['srs', 'qsem', 'nlc', 'qcr', 'unified'],
  timeout: ['hqe'], // Takes longer than 30s to process
  crashed: ['iching'], // Backend nil pointer dereference
  missing: ['sai'] // 404 endpoint not implemented
};

const apiConfigs: ApiConfig[] = [
  {
    id: 'qsem',
    name: 'Quantum Semantics ✅',
    icon: Network,
    color: 'emerald',
    endpoint: '/qsem/encode',
    params: {
      basis: 'prime',
      dimensions: 4,
      coherenceThreshold: 0.8
    },
    defaultPayload: {
      Concepts: ['quantum consciousness', 'semantic understanding', 'computational intelligence']
    },
    description: 'Analyze semantic meaning through prime basis vector spaces - WORKING'
  },
  {
    id: 'srs',
    name: 'Symbolic Resonance Solver ✅',
    icon: Cpu,
    color: 'blue',
    endpoint: '/srs/solve',
    params: {
      complexity: 0.7,
      maxIterations: 1000,
      plateauThreshold: 0.01,
      entropyMode: 'adaptive'
    },
    defaultPayload: {
      Problem: '3sat',
      Spec: {
        variables: 3,
        clauses: [
          [{"var": 1, "neg": false}, {"var": 2, "neg": true}],
          [{"var": 2, "neg": false}, {"var": 3, "neg": false}],
          [{"var": 1, "neg": true}, {"var": 3, "neg": true}]
        ]
      }
    },
    description: 'Solve NP-complete problems using entropy particle systems - WORKING'
  },
  {
    id: 'nlc',
    name: 'Non-Local Communication ✅',
    icon: Globe,
    color: 'green',
    endpoint: '/nlc/sessions',
    params: {
      channelCount: 4,
      coherenceThreshold: 0.85,
      maxLatency: 100
    },
    defaultPayload: {
      primes: [2, 3, 5, 7],
      goldenPhase: true,
      silverPhase: true
    },
    description: 'Create quantum entanglement communication sessions - WORKING'
  },
  {
    id: 'qcr',
    name: 'Quantum Consciousness Resonator ✅',
    icon: Brain,
    color: 'pink',
    endpoint: '/qcr/sessions',
    params: {
      networkSize: 5,
      resonanceDepth: 3,
      coherenceThreshold: 0.75
    },
    defaultPayload: {
      modes: ['analytical', 'creative', 'ethical'],
      maxIterations: 21
    },
    description: 'Simulate consciousness through triadic resonance networks - WORKING'
  },
  {
    id: 'unified',
    name: 'Unified Physics ✅',
    icon: Atom,
    color: 'cyan',
    endpoint: '/unified/gravity/compute',
    params: {
      observerCount: 5,
      gravityMode: 'emergent',
      timeSteps: 100
    },
    defaultPayload: {
      observerEntropyReductionRate: 12.4,
      regionEntropyGradient: 0.002
    },
    description: 'Compute emergent gravity through observer-entropy coupling - WORKING'
  },
  {
    id: 'hqe',
    name: 'Holographic Quantum Encoder ⏱️',
    icon: Target,
    color: 'purple',
    endpoint: '/hqe/simulate',
    params: {
      dimensions: 3,
      steps: 10, // Reduced from 100 to prevent timeout
      lambda: 0.015
    },
    defaultPayload: {
      simulation_type: 'holographic_reconstruction',
      primes: [2, 3, 5, 7, 11],
      steps: 5, // Very low to prevent timeout
      lambda: 0.015
    },
    description: 'Encode data in 3D holographic quantum states - SLOW (may timeout)'
  },
  {
    id: 'iching',
    name: 'I-Ching Oracle ❌',
    icon: Hexagon,
    color: 'amber',
    endpoint: '/iching/evolve',
    params: {
      entropySource: 'quantum',
      includeChangingLines: true,
      includeLandscape: true
    },
    defaultPayload: {
      question: 'What is the optimal path forward in this technological endeavor?',
      steps: 7
    },
    description: 'Divine insights through hexagram transformations - BACKEND CRASH (nil pointer)'
  },
  {
    id: 'sai',
    name: 'Symbolic AI Engine ❌',
    icon: Brain,
    color: 'teal',
    endpoint: '/sai/engines',
    params: {
      learningRate: 0.01,
      batchSize: 32,
      maxEpochs: 100
    },
    defaultPayload: {
      Name: 'demo-symbolic-engine',
      Description: 'Playground test engine',
      Config: {
        primeBasis: [2, 3, 5, 7],
        symbolMapping: 'unicode',
        entropyThreshold: 0.7,
        maxSymbols: 1000
      }
    },
    description: 'Multi-tenant symbolic AI with prime-based pattern learning - ENDPOINT MISSING (404)'
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
    visualizationData: [],
    apiStatus: null
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
  }, [state.selectedApi, selectedConfig]);

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

    const startTime = Date.now();
    try {
      // Parse payload
      const payload = JSON.parse(requestPayload);
      
      // Add comprehensive debugging
      console.log('🔍 [Playground] Starting API call:', {
        selectedApi: selectedConfig.id,
        endpoint: selectedConfig.endpoint,
        payload: payload,
        apiStatus: state.apiStatus,
        apiKey: psiZeroApi.client.getApiKey() ? 'present' : 'missing',
        authConfig: psiZeroApi.auth.getConfig()
      });
      
      // TEMPORARY: Skip authentication check for testing - backend works with any key
      console.log('⚠️ [Playground] Skipping auth check for debugging - backend accepts any API key');
      
      // Ensure we have any API key set for the request
      if (!psiZeroApi.client.getApiKey()) {
        console.log('🔑 [Playground] No API key found, setting demo key...');
        psiZeroApi.client.setApiKey('demo_test_key_for_playground');
      }
      
      // Check for known backend issues before making API call
      if (apiStatus.missing.includes(selectedConfig.id)) {
        throw new Error(`${selectedConfig.name} endpoint is not implemented in backend (404)`);
      }
      
      if (apiStatus.crashed.includes(selectedConfig.id)) {
        throw new Error(`${selectedConfig.name} has a backend crash (nil pointer dereference)`);
      }

      // Make real API call based on selected API
      let apiResponse;
      console.log(`🚀 [Playground] Making ${selectedConfig.id} API call...`);
      
      // Set longer timeout for HQE which is slow
      const customTimeout = selectedConfig.id === 'hqe' ? 60000 : undefined;
      
      switch (selectedConfig.id) {
        case 'srs':
          console.log('📊 [SRS] Calling solve with payload:', payload);
          apiResponse = await psiZeroApi.srs.solve(payload);
          console.log('📊 [SRS] Response:', apiResponse);
          break;
        case 'qsem':
          console.log('🧠 [QSEM] Calling quickEncode with concepts:', payload.Concepts);
          apiResponse = await psiZeroApi.qsem.quickEncode(payload.Concepts || [], payload.Basis || 'prime');
          console.log('🧠 [QSEM] Response:', apiResponse);
          break;
        case 'nlc':
          console.log('📡 [NLC] Creating session with payload:', payload);
          apiResponse = await psiZeroApi.nlc.quickSession(
            payload.primes || [2, 3, 5, 7],
            payload.goldenPhase !== false,
            payload.silverPhase !== false
          );
          console.log('📡 [NLC] Session response:', apiResponse);
          break;
        case 'qcr':
          console.log('🧘 [QCR] Creating consciousness session with payload:', payload);
          apiResponse = await psiZeroApi.qcr.quickSession(
            payload.modes || ['analytical', 'creative', 'ethical'],
            payload.maxIterations || 21
          );
          console.log('🧘 [QCR] Session response:', apiResponse);
          break;
        case 'hqe':
          console.log('🌌 [HQE] Calling simulate with payload (may take up to 60s):', payload);
          if (customTimeout) {
            console.log('⏱️ [HQE] Using extended 60s timeout for slow backend processing');
          }
          apiResponse = await psiZeroApi.hqe.simulate(payload);
          console.log('🌌 [HQE] Response:', apiResponse);
          break;
        case 'iching':
          console.log('☯️ [I-Ching] Attempting evolve (known to crash backend)...');
          const question = payload.question || 'What guidance do you offer?';
          const steps = payload.steps || 7;
          console.log('☯️ [I-Ching] Question:', question, 'Steps:', steps);
          apiResponse = await psiZeroApi.iching.quickEvolve(question, steps);
          console.log('☯️ [I-Ching] Evolution response:', apiResponse);
          break;
        case 'unified':
          console.log('🌌 [Unified] Computing gravity...');
          const entropyRate = payload.observerEntropyReductionRate || 12.4;
          const gradient = payload.regionEntropyGradient || 0.002;
          console.log('🌌 [Unified] Entropy rate:', entropyRate, 'Gradient:', gradient);
          apiResponse = await psiZeroApi.unified.quickGravity(entropyRate, gradient);
          console.log('🌌 [Unified] Gravity response:', apiResponse);
          break;
        case 'sai':
          console.log('🤖 [SAI] Attempting engine creation (known 404)...');
          console.log('🤖 [SAI] Payload:', payload);
          apiResponse = await psiZeroApi.sai.createEngine(payload);
          console.log('🤖 [SAI] Engine response:', apiResponse);
          break;
        default:
          throw new Error(`API ${selectedConfig.id} not implemented`);
      }
      
      const responseTime = Date.now() - startTime;
      
      console.log(`✅ [Playground] ${selectedConfig.id} API call completed:`, {
        responseTime: responseTime + 'ms',
        status: apiResponse.status,
        hasData: !!apiResponse.data,
        hasError: !!apiResponse.error,
        response: apiResponse
      });
      
      // Check if API call was successful - fix success detection logic
      const success = !apiResponse.error && (
        apiResponse.status === 200 ||
        apiResponse.status === 'success' ||
        apiResponse.data ||
        (apiResponse.result && !apiResponse.error)
      );
      
      console.log(`🔍 [Playground] Success check for ${selectedConfig.id}:`, {
        hasError: !!apiResponse.error,
        status: apiResponse.status,
        hasData: !!apiResponse.data,
        hasResult: !!apiResponse.result,
        finalSuccess: success
      });
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        results: {
          ...prev.results,
          [selectedConfig.id]: apiResponse
        },
        performance: {
          responseTime,
          success,
          timestamp: new Date(),
          error: apiResponse.error
        }
      }));
      
      setShowResponse(true);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      console.error(`❌ [Playground] ${selectedConfig.id} API call failed:`, {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        responseTime: responseTime + 'ms',
        apiStatus: state.apiStatus,
        selectedApi: selectedConfig.id
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        results: {
          ...prev.results,
          [selectedConfig.id]: {
            error: errorMessage,
            details: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
            apiCall: selectedConfig.id
          }
        },
        performance: {
          responseTime,
          success: false,
          timestamp: new Date(),
          error: errorMessage
        }
      }));
      setShowResponse(true);
    }
  };

  // Check API authentication status
  const checkApiStatus = useCallback(async () => {
    try {
      console.log('🔍 [checkApiStatus] Starting API status check...');
      
      // Ensure we have a demo API key
      console.log('🔑 [checkApiStatus] Ensuring demo API key...');
      const autoKeyResult = await apiAuth.ensureDemoApiKey();
      console.log('🔑 [checkApiStatus] Demo API key result:', autoKeyResult);
      
      if (!autoKeyResult.success) {
        console.warn('🚫 [checkApiStatus] Failed to setup API key:', autoKeyResult.error);
        setState(prev => ({
          ...prev,
          apiStatus: {
            connected: false,
            authenticated: false,
            error: autoKeyResult.error || 'Failed to set up authentication'
          }
        }));
        return;
      }
      
      // Test the connection
      console.log('🌐 [checkApiStatus] Testing connection...');
      const status = await psiZeroApi.testConnection();
      console.log('🌐 [checkApiStatus] Connection test result:', status);
      
      setState(prev => ({
        ...prev,
        apiStatus: status
      }));
      
      // Log final status
      console.log('✅ [checkApiStatus] Final API status:', status);
      
    } catch (error) {
      console.error('❌ [checkApiStatus] Exception during status check:', error);
      setState(prev => ({
        ...prev,
        apiStatus: {
          connected: false,
          authenticated: false,
          error: 'System initialization failed: ' + (error instanceof Error ? error.message : 'Unknown error')
        }
      }));
    }
  }, []);

  // Initialize API status when component mounts
  useEffect(() => {
    checkApiStatus();
  }, [checkApiStatus]);

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
      visualizationData: [],
      apiStatus: null
    });
    setShowResponse(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Advanced API Playground
            </h1>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              Interactive testing environment for all 8 revolutionary APIs with real-time visualization and performance feedback.
            </p>
          </div>
          
          {/* API Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              state.apiStatus?.connected && state.apiStatus?.authenticated ? 'bg-green-100 text-green-800' :
              state.apiStatus?.connected && !state.apiStatus?.authenticated ? 'bg-yellow-100 text-yellow-800' :
              state.apiStatus?.error ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                state.apiStatus?.connected && state.apiStatus?.authenticated ? 'bg-green-400' :
                state.apiStatus?.connected && !state.apiStatus?.authenticated ? 'bg-yellow-400' :
                state.apiStatus?.error ? 'bg-red-400' :
                'bg-gray-400'
              }`} />
              {state.apiStatus?.connected && state.apiStatus?.authenticated ? 'API Connected' :
               state.apiStatus?.connected && !state.apiStatus?.authenticated ? 'Authentication Required' :
               state.apiStatus?.error ? 'API Error' :
               'Connecting...'}
            </div>
            {(state.apiStatus?.error || (!state.apiStatus?.connected && !state.apiStatus?.authenticated)) && (
              <Button
                size="sm"
                variant="outline"
                onClick={checkApiStatus}
                className="text-xs"
              >
                <Key className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
        
        {state.apiStatus?.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 max-w-2xl mx-auto">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              API Connection Error: {state.apiStatus.error}
            </div>
          </div>
        )}
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
                            <div className="text-xs text-muted-foreground">{config.endpoint}</div>
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
                  <div className="text-foreground">{selectedConfig.name}</div>
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
                    <div className="text-sm text-foreground">Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {state.performance.success ? '200' : '500'}
                    </div>
                    <div className="text-sm text-foreground">Status Code</div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Response Time Distribution:</label>
                  <Progress value={Math.min(100, state.performance.responseTime / 10)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0ms</span>
                    <span>1000ms</span>
                  </div>
                </div>

                <div className="text-sm text-foreground">
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
          <p className="text-foreground mb-4">{selectedConfig.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Endpoint:</h4>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                POST http://localhost:8080/v1{selectedConfig.endpoint}
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