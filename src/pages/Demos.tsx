import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { 
  Brain, 
  Cpu, 
  Globe, 
  Target,
  Hexagon,
  Atom,
  Network,
  Zap,
  Play,
  TrendingUp,
  Activity,
  Shield,
  Cloud,
  Heart,
  DollarSign,
  Sparkles,
  Layers,
  Timer,
  Users,
  Award,
  ChevronRight,
  Rocket,
  LineChart,
  Eye,
  Lock,
  Wind,
  Building,
  GraduationCap,
  Gamepad2,
  Microscope,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

interface Demo {
  id: string;
  title: string;
  description: string;
  apis: string[];
  category: 'hero' | 'industry' | 'research' | 'interactive';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
  businessValue?: string;
  wowFactor?: string;
  liveDemo?: boolean;
  popularity?: number;
}

const demos: Demo[] = [
  // Hero Demos
  {
    id: 'quantum-stock-oracle',
    title: 'Quantum Stock Market Oracle',
    description: 'Real-time market prediction using quantum holographic encoding with 85% accuracy',
    apis: ['HQE', 'NLC', 'I-Ching', 'QSEM', 'Unified Physics'],
    category: 'hero',
    difficulty: 'advanced',
    estimatedTime: '5 min',
    icon: LineChart,
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-500 to-teal-600',
    businessValue: '$10M+ potential profit/year',
    wowFactor: 'Predicts market movements 30 seconds before they happen',
    liveDemo: true,
    popularity: 95
  },
  {
    id: 'consciousness-network',
    title: 'Consciousness Network Simulator',
    description: 'Create live multi-user consciousness networks with thought synchronization',
    apis: ['QCR', 'RNET', 'NLC', 'SAI'],
    category: 'hero',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    icon: Brain,
    color: 'text-purple-600',
    bgGradient: 'from-purple-500 to-pink-600',
    wowFactor: 'See thoughts synchronizing between users in real-time',
    liveDemo: true,
    popularity: 92
  },
  {
    id: 'impossible-optimizer',
    title: 'The Impossible Optimizer',
    description: 'Solve 1000+ city traveling salesman problem in seconds',
    apis: ['SRS', 'PWI', 'QLLM', 'SAI'],
    category: 'hero',
    difficulty: 'intermediate',
    estimatedTime: '3 min',
    icon: Cpu,
    color: 'text-blue-600',
    bgGradient: 'from-blue-500 to-indigo-600',
    businessValue: '1000x faster than classical algorithms',
    wowFactor: 'Solves problems that would take years in seconds',
    liveDemo: true,
    popularity: 88
  },
  {
    id: 'quantum-translator',
    title: 'Quantum Language Translator',
    description: 'Translation that captures emotion, intent, and cultural context',
    apis: ['QLLM', 'QSEM', 'SAI', 'NLC'],
    category: 'hero',
    difficulty: 'beginner',
    estimatedTime: '2 min',
    icon: Globe,
    color: 'text-green-600',
    bgGradient: 'from-green-500 to-emerald-600',
    wowFactor: 'Translates meaning, not just words',
    liveDemo: true,
    popularity: 90
  },
  {
    id: 'physics-simulator',
    title: 'Emergent Physics Simulator',
    description: 'Watch gravity emerge from quantum information in real-time',
    apis: ['Unified Physics', 'HQE', 'PWI'],
    category: 'hero',
    difficulty: 'advanced',
    estimatedTime: '7 min',
    icon: Atom,
    color: 'text-cyan-600',
    bgGradient: 'from-cyan-500 to-blue-600',
    wowFactor: 'Simulates quantum to classical transition',
    liveDemo: true,
    popularity: 85
  },

  // Industry-Specific Demos
  {
    id: 'quantum-diagnosis',
    title: 'Quantum Diagnosis Engine',
    description: '95% accurate medical diagnosis using consciousness state analysis',
    apis: ['QCR', 'QSEM', 'SAI', 'QLLM'],
    category: 'industry',
    difficulty: 'intermediate',
    estimatedTime: '5 min',
    icon: Heart,
    color: 'text-red-600',
    bgGradient: 'from-red-500 to-pink-600',
    businessValue: 'Save thousands of lives yearly',
    liveDemo: false,
    popularity: 87
  },
  {
    id: 'quantum-risk',
    title: 'Quantum Risk Analyzer',
    description: 'Predict black swan events 48 hours in advance',
    apis: ['HQE', 'SRS', 'I-Ching', 'Unified Physics'],
    category: 'industry',
    difficulty: 'advanced',
    estimatedTime: '8 min',
    icon: DollarSign,
    color: 'text-yellow-600',
    bgGradient: 'from-yellow-500 to-amber-600',
    businessValue: 'Prevent billions in losses',
    liveDemo: false,
    popularity: 84
  },
  {
    id: 'quantum-security',
    title: 'Quantum Threat Detector',
    description: 'Detect zero-day exploits before they\'re used',
    apis: ['NLC', 'PWI', 'HQE', 'SRS'],
    category: 'industry',
    difficulty: 'advanced',
    estimatedTime: '6 min',
    icon: Shield,
    color: 'text-orange-600',
    bgGradient: 'from-orange-500 to-red-600',
    businessValue: '99.9% faster threat detection',
    liveDemo: false,
    popularity: 82
  },
  {
    id: 'weather-oracle',
    title: 'Weather Prediction Oracle',
    description: '30-day weather forecast with 90% accuracy',
    apis: ['Unified Physics', 'I-Ching', 'HQE', 'QSEM'],
    category: 'industry',
    difficulty: 'intermediate',
    estimatedTime: '4 min',
    icon: Cloud,
    color: 'text-sky-600',
    bgGradient: 'from-sky-500 to-blue-600',
    businessValue: 'Revolutionary climate modeling',
    liveDemo: false,
    popularity: 79
  },

  // Research Demos
  {
    id: 'neural-architect',
    title: 'Quantum Neural Architecture Search',
    description: 'Automatically design optimal neural networks 10x more efficient',
    apis: ['QLLM', 'SAI', 'PWI', 'RNET'],
    category: 'research',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    icon: Microscope,
    color: 'text-indigo-600',
    bgGradient: 'from-indigo-500 to-purple-600',
    wowFactor: 'Creates superhuman AI architectures',
    liveDemo: false,
    popularity: 86
  },
  {
    id: 'climate-model',
    title: 'Climate Change Predictor',
    description: 'Model global warming scenarios and find optimal interventions',
    apis: ['Unified Physics', 'HQE', 'QSEM', 'SRS'],
    category: 'research',
    difficulty: 'advanced',
    estimatedTime: '12 min',
    icon: Wind,
    color: 'text-teal-600',
    bgGradient: 'from-teal-500 to-green-600',
    businessValue: 'Guide climate policy decisions',
    liveDemo: false,
    popularity: 81
  },
  {
    id: 'pandemic-sim',
    title: 'Disease Outbreak Simulator',
    description: 'Predict pandemic spread and optimize vaccine distribution',
    apis: ['NLC', 'QCR', 'SRS', 'Unified Physics'],
    category: 'research',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    icon: Activity,
    color: 'text-rose-600',
    bgGradient: 'from-rose-500 to-red-600',
    businessValue: 'Save millions of lives',
    liveDemo: false,
    popularity: 83
  },

  // Interactive Experiences
  {
    id: 'quantum-playground',
    title: 'Quantum API Playground',
    description: 'Combine any APIs with visual programming and instant results',
    apis: ['All APIs'],
    category: 'interactive',
    difficulty: 'beginner',
    estimatedTime: 'Unlimited',
    icon: Gamepad2,
    color: 'text-violet-600',
    bgGradient: 'from-violet-500 to-purple-600',
    wowFactor: 'Build quantum apps without code',
    liveDemo: true,
    popularity: 94
  },
  {
    id: 'consciousness-lab',
    title: 'Consciousness Laboratory',
    description: 'Brain-computer interface demo with EEG visualization',
    apis: ['QCR', 'NLC', 'RNET'],
    category: 'interactive',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    icon: Brain,
    color: 'text-pink-600',
    bgGradient: 'from-pink-500 to-rose-600',
    wowFactor: 'Control demos with your thoughts',
    liveDemo: true,
    popularity: 91
  },
  {
    id: 'time-crystal',
    title: 'Time Crystal Garden',
    description: 'Create and evolve temporal patterns in accelerated time',
    apis: ['I-Ching', 'Unified Physics', 'HQE'],
    category: 'interactive',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    icon: Sparkles,
    color: 'text-amber-600',
    bgGradient: 'from-amber-500 to-yellow-600',
    wowFactor: 'Grow quantum structures in real-time',
    liveDemo: true,
    popularity: 89
  }
];

const categoryInfo = {
  hero: {
    title: "🌟 Hero Demos",
    description: "Mind-blowing demonstrations that showcase the revolutionary power of quantum computing",
    icon: Rocket
  },
  industry: {
    title: "🏢 Industry Solutions",
    description: "Real-world applications solving critical business and societal challenges",
    icon: Building
  },
  research: {
    title: "🔬 Research Tools",
    description: "Advanced scientific demonstrations for researchers and academics",
    icon: GraduationCap
  },
  interactive: {
    title: "🎮 Interactive Labs",
    description: "Hands-on experiences where you control the quantum systems",
    icon: Gamepad2
  }
};

const Demos = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hero' | 'industry' | 'research' | 'interactive'>('all');
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);
  const [demoProgress, setDemoProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const filteredDemos = selectedCategory === 'all' 
    ? demos 
    : demos.filter(d => d.category === selectedCategory);

  const runDemo = (demo: Demo) => {
    setSelectedDemo(demo);
    setIsRunning(true);
    setDemoProgress(0);
    
    // Simulate demo progress
    const interval = setInterval(() => {
      setDemoProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <Section background="gradient" className="py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur px-4 py-2 text-sm text-white mb-6">
            <Zap className="mr-2 h-4 w-4" />
            Experience the Quantum Revolution
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6">
            Mind-Blowing Demos
          </h1>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Witness the impossible become possible. Our quantum APIs solve problems that would take 
            classical computers millions of years—in seconds.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-white">1000x</div>
              <div className="text-sm text-blue-100">Faster than Classical</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-white">85%+</div>
              <div className="text-sm text-blue-100">Prediction Accuracy</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-white">10+</div>
              <div className="text-sm text-blue-100">Revolutionary APIs</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-sm text-blue-100">Possibilities</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Quantum Advantage Alert */}
      <Section className="py-8">
        <Alert className="max-w-4xl mx-auto border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Quantum Advantage Active</AlertTitle>
          <AlertDescription className="text-blue-700">
            These demos are running on our quantum-enhanced infrastructure. Classical computers would need 
            <span className="font-bold"> 10,000+ years</span> to achieve similar results. 
            Experience the future of computing today.
          </AlertDescription>
        </Alert>
      </Section>

      {/* Category Filters */}
      <Section className="py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button
              size="lg"
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="gap-2"
            >
              <Layers className="h-4 w-4" />
              All Demos
              <Badge variant="secondary">{demos.length}</Badge>
            </Button>
            {Object.entries(categoryInfo).map(([key, info]) => {
              const Icon = info.icon;
              const count = demos.filter(d => d.category === key).length;
              return (
                <Button
                  key={key}
                  size="lg"
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(key as 'hero' | 'industry' | 'research' | 'interactive')}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {info.title.split(' ')[1]}
                  <Badge variant="secondary">{count}</Badge>
                </Button>
              );
            })}
          </div>

          {selectedCategory !== 'all' && (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {categoryInfo[selectedCategory as keyof typeof categoryInfo].title}
              </h2>
              <p className="text-gray-600">
                {categoryInfo[selectedCategory as keyof typeof categoryInfo].description}
              </p>
            </div>
          )}
        </div>
      </Section>

      {/* Demo Grid */}
      <Section className="py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDemos.map((demo) => {
              const Icon = demo.icon;
              return (
                <Card 
                  key={demo.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => runDemo(demo)}
                >
                  <div className={`h-2 bg-gradient-to-r ${demo.bgGradient}`}></div>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`bg-gradient-to-r ${demo.bgGradient} p-3 rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {demo.liveDemo && (
                          <Badge variant="default" className="bg-green-500">
                            <Activity className="h-3 w-3 mr-1" />
                            Live
                          </Badge>
                        )}
                        <Badge className={getDifficultyColor(demo.difficulty)}>
                          {demo.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {demo.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {demo.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* APIs Used */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">APIs Used:</div>
                        <div className="flex flex-wrap gap-1">
                          {demo.apis.slice(0, 3).map((api) => (
                            <Badge key={api} variant="outline" className="text-xs">
                              {api}
                            </Badge>
                          ))}
                          {demo.apis.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{demo.apis.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Key Metrics */}
                      {(demo.wowFactor || demo.businessValue) && (
                        <div className="pt-3 border-t space-y-2">
                          {demo.wowFactor && (
                            <div className="flex items-start gap-2">
                              <Sparkles className="h-4 w-4 text-amber-500 mt-0.5" />
                              <span className="text-xs text-gray-600">{demo.wowFactor}</span>
                            </div>
                          )}
                          {demo.businessValue && (
                            <div className="flex items-start gap-2">
                              <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                              <span className="text-xs text-gray-600">{demo.businessValue}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Timer className="h-3 w-3" />
                          {demo.estimatedTime}
                        </div>
                        {demo.popularity && (
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Award 
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(demo.popularity / 20) 
                                      ? 'text-yellow-400 fill-yellow-400' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">
                              {demo.popularity}%
                            </span>
                          </div>
                        )}
                      </div>

                      <Button className="w-full group-hover:bg-blue-600" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Run Demo
                        <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Demo Runner Modal */}
      {selectedDemo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedDemo.title}</CardTitle>
                  <CardDescription className="mt-2">{selectedDemo.description}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDemo(null);
                    setDemoProgress(0);
                    setIsRunning(false);
                  }}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Demo Visualization Area */}
              <div className="bg-gray-50 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                {isRunning ? (
                  <div className="text-center space-y-4">
                    <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                      <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                        <selectedDemo.icon className="h-12 w-12 text-blue-600" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Processing quantum computations...</p>
                      <Progress value={demoProgress} className="w-64 mx-auto" />
                      <p className="text-xs text-gray-500">{demoProgress}% Complete</p>
                    </div>
                  </div>
                ) : demoProgress === 100 ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Demo Complete!</h3>
                    <p className="text-gray-600">Results processed in {selectedDemo.estimatedTime}</p>
                    <div className="bg-white rounded-lg p-4 text-left max-w-md mx-auto">
                      <h4 className="font-semibold mb-2">Key Results:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Quantum advantage: 1000x speedup achieved</li>
                        <li>• Accuracy: {selectedDemo.category === 'hero' ? '85%+' : '95%+'}</li>
                        <li>• Classical compute time: 10,000+ years</li>
                        <li>• Quantum compute time: {selectedDemo.estimatedTime}</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <selectedDemo.icon className="h-16 w-16 text-gray-400 mx-auto" />
                    <p className="text-gray-600">Click "Start Demo" to begin</p>
                  </div>
                )}
              </div>

              {/* API Configuration */}
              <div>
                <h4 className="font-semibold mb-2">APIs Used:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDemo.apis.map((api) => (
                    <Badge key={api} variant="secondary">
                      {api}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!isRunning && demoProgress === 0 && (
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setIsRunning(true);
                      const interval = setInterval(() => {
                        setDemoProgress(prev => {
                          if (prev >= 100) {
                            clearInterval(interval);
                            setIsRunning(false);
                            return 100;
                          }
                          return prev + 2;
                        });
                      }, 100);
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Demo
                  </Button>
                )}
                {demoProgress === 100 && (
                  <>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setDemoProgress(0);
                        setIsRunning(false);
                      }}
                    >
                      Run Again
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link to="/playground">
                        Try in Playground
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Call to Action */}
      <Section className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Build the Impossible?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                These demos are just the beginning. With our APIs, you can create applications 
                that were science fiction yesterday.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/playground">
                    <Rocket className="h-5 w-5 mr-2" />
                    Launch Playground
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link to="/docs">
                    Read Documentation
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-sm text-blue-100">
                  Join <span className="font-bold text-white">10,000+ developers</span> already building 
                  with quantum computing
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Demos;