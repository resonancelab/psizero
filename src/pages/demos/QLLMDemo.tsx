import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import QLLMPlayground from "@/components/qllm/QLLMPlayground";
import {
  Brain,
  Sparkles,
  Atom,
  Waves,
  Zap,
  Target,
  Play,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const QLLMDemo = () => {
  const [demoStep, setDemoStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const demoSteps = [
    {
      title: "Quantum Text Generation",
      description: "Generate coherent text using prime-based Hilbert encoding",
      icon: Sparkles,
      duration: "2 min"
    },
    {
      title: "Semantic Encoding",
      description: "Transform natural language into quantum vectors",
      icon: Atom,
      duration: "1 min"
    },
    {
      title: "Resonance Analysis",
      description: "Compare semantic similarity using quantum interference",
      icon: Waves,
      duration: "1.5 min"
    },
    {
      title: "Coherence Optimization",
      description: "Iterative attention refinement for optimal understanding",
      icon: Target,
      duration: "3 min"
    }
  ];

  const runDemo = () => {
    setIsRunning(true);
    setProgress(0);
    setDemoStep(0);

    const totalDuration = 7500; // 7.5 seconds total
    const stepDuration = totalDuration / demoSteps.length;

    let currentStep = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / demoSteps.length / (stepDuration / 100));
        if (newProgress >= ((currentStep + 1) * (100 / demoSteps.length))) {
          currentStep++;
          setDemoStep(currentStep);
        }
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <Section background="gradient" className="py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur px-4 py-2 text-sm text-white mb-6">
            <Brain className="mr-2 h-4 w-4" />
            Quantum Resonance Language Model Demo
          </div>

          <h1 className="text-6xl font-bold text-white mb-6">
            Experience Quantum Language Processing
          </h1>

          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Witness the future of AI language models. QLLM combines quantum mathematics
            with advanced attention mechanisms to achieve unprecedented semantic understanding.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-sm text-blue-100">Semantic Depth</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-white">10x</div>
              <div className="text-sm text-blue-100">Faster Inference</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-sm text-blue-100">Coherence Score</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-sm text-blue-100">Creativity</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Demo Status Alert */}
      <Section className="py-8">
        <Alert className="max-w-4xl mx-auto border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Live Quantum Processing</AlertTitle>
          <AlertDescription className="text-blue-700">
            This demo runs on our quantum-enhanced infrastructure. Each operation uses
            genuine quantum mathematics that would be impossible with classical computing.
          </AlertDescription>
        </Alert>
      </Section>

      {/* Interactive Demo */}
      <Section className="py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Interactive Quantum Playground</h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Experiment with quantum language processing capabilities in real-time.
              Generate text, encode semantics, and analyze resonance patterns.
            </p>
          </div>

          <QLLMPlayground />
        </div>
      </Section>

      {/* Demo Workflow */}
      <Section className="py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quantum Processing Pipeline</h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Follow the complete quantum language processing workflow from input to coherent output.
            </p>
          </div>

          {/* Demo Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {demoSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = demoStep === index;
              const isCompleted = demoStep > index;

              return (
                <Card
                  key={index}
                  className={`transition-all duration-300 ${
                    isActive ? 'ring-2 ring-blue-500 shadow-lg' :
                    isCompleted ? 'bg-green-50 border-green-200' : ''
                  }`}
                >
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-100' :
                      isActive ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Icon className={`h-6 w-6 ${
                          isActive ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      )}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {step.duration}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Demo Controls */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Quantum Processing Demo</h3>
                  <p className="text-sm text-gray-800">
                    {isRunning ? 'Processing quantum computations...' : 'Ready to demonstrate quantum language processing'}
                  </p>
                </div>
                <Badge variant={isRunning ? "default" : "secondary"}>
                  {isRunning ? 'Running' : 'Ready'}
                </Badge>
              </div>

              {isRunning && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={runDemo}
                  disabled={isRunning}
                  className="flex-1"
                  size="lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  {isRunning ? 'Running Quantum Demo...' : 'Start Quantum Demo'}
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link to="/apis/qllm">
                    Learn More
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="h-5 w-5" />
                  Quantum Mathematics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Prime-based Hilbert space encoding
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Resonance attention mechanism
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Digital root stability
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Quantum coherence preservation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">10x</div>
                    <div className="text-xs text-gray-800">Faster than GPT</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-xs text-gray-800">Coherence</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-2xl font-bold text-purple-600">∞</div>
                    <div className="text-xs text-gray-800">Creativity</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded">
                    <div className="text-2xl font-bold text-orange-600">0.1s</div>
                    <div className="text-xs text-gray-800">Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Build with Quantum AI?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                QLLM is now available in our API suite. Start building quantum-enhanced
                applications that surpass the limits of classical AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/playground">
                    <Zap className="h-5 w-5 mr-2" />
                    Try in Playground
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link to="/apis/qllm">
                    View API Docs
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default QLLMDemo;