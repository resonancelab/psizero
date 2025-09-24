import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Section from "@/components/layout/Section";
import { 
  Cpu, 
  Target, 
  Globe, 
  Brain, 
  Hexagon, 
  Atom, 
  Network,
  ArrowRight,
  Play,
  Zap,
  TrendingUp,
  Settings,
  Gauge
} from "lucide-react";
import { Link } from "react-router-dom";

interface ApiDemo {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
  route: string;
  features: string[];
  demoDescription: string;
  status: 'stable' | 'beta' | 'alpha';
}

const apiDemos: ApiDemo[] = [
  {
    id: 'srs',
    name: 'NP-Complete Solver',
    description: 'Polynomial-time algorithmic framework for solving NP-complete computational problems',
    icon: Brain,
    color: 'text-blue-600',
    bgGradient: 'from-blue-500 to-purple-600',
    route: '/demos/impossible-optimizer',
    features: ['P=NP Solution', 'Advanced Algorithms', 'Computational Framework', 'NP→P Transformation'],
    demoDescription: 'Experience polynomial-time solutions to NP-complete problems through advanced algorithmic frameworks',
    status: 'stable'
  },
  {
    id: 'rnet',
    name: 'Resonance Network (RNET)',
    description: 'Real-time collaborative prime-basis resonance spaces with ultra-low latency synchronization',
    icon: Network,
    color: 'text-indigo-600',
    bgGradient: 'from-indigo-500 to-purple-600',
    route: '/apis/rnet',
    features: ['Multi-Client Sync', 'Real-time Deltas', 'CRDT Consistency', 'Prime Basis Spaces'],
    demoDescription: 'Experience live multi-client collaboration in shared quantum resonance spaces',
    status: 'stable'
  },
  {
    id: 'qsem',
    name: 'Quantum Semantics',
    description: 'Prime basis vector space analysis for semantic understanding and concept resonance',
    icon: Network,
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-500 to-teal-600',
    route: '/apis/qsem',
    features: ['Prime Vector Space', 'Concept Networks', 'Semantic Coherence', '3D Visualization'],
    demoDescription: 'Explore 3D prime basis vector spaces and semantic resonance networks',
    status: 'stable'
  },
  {
    id: 'hqe',
    name: 'Holographic Quantum Encoder',
    description: 'Multi-dimensional quantum holographic state evolution with prime eigenstate resonance',
    icon: Target,
    color: 'text-purple-600',
    bgGradient: 'from-purple-500 to-violet-600',
    route: '/apis/hqe',
    features: ['3D Holographic State', 'Prime Eigenstates', 'Quantum Coherence', 'Resonance Tracking'],
    demoDescription: '3D quantum holographic state evolution with real-time amplitude tracking',
    status: 'beta'
  },
  {
    id: 'nlc',
    name: 'Non-Local Communication',
    description: 'Quantum communication channels using prime eigenstate resonance synchronization',
    icon: Globe,
    color: 'text-green-600',
    bgGradient: 'from-green-500 to-teal-600',
    route: '/apis/nlc',
    features: ['Quantum Channels', 'Golden Ratio Phase', 'Instant Transmission', 'Entanglement'],
    demoDescription: 'Quantum channel synchronization with golden and silver ratio phase alignment',
    status: 'beta'
  },
  {
    id: 'qcr',
    name: 'Quantum Consciousness Resonator',
    description: 'Triadic consciousness network simulation with cognitive mode resonance patterns',
    icon: Brain,
    color: 'text-pink-600',
    bgGradient: 'from-pink-500 to-rose-600',
    route: '/apis/qcr',
    features: ['Consciousness Networks', 'Triadic Resonance', 'Cognitive Modes', 'Neural Dynamics'],
    demoDescription: 'Interactive consciousness simulation with triadic resonance visualization',
    status: 'alpha'
  },
  {
    id: 'iching',
    name: 'I-Ching Oracle',
    description: 'Dynamic hexagram transformations through entropy landscape topology mapping',
    icon: Hexagon,
    color: 'text-amber-600',
    bgGradient: 'from-amber-500 to-yellow-600',
    route: '/apis/iching',
    features: ['Hexagram Evolution', 'Entropy Landscapes', 'Attractor Dynamics', 'Ancient Wisdom'],
    demoDescription: 'Dynamic hexagram transformations with entropy landscape topology',
    status: 'beta'
  },
  {
    id: 'unified',
    name: 'Unified Physics',
    description: 'Emergent gravity computation through observer-entropy coupling dynamics',
    icon: Atom,
    color: 'text-cyan-600',
    bgGradient: 'from-cyan-500 to-blue-600',
    route: '/apis/unified',
    features: ['Emergent Gravity', 'Observer Coupling', 'Spacetime Curvature', 'G(t) Evolution'],
    demoDescription: 'Real-time gravity field visualization with observer-entropy coupling',
    status: 'alpha'
  }
];

const ApiShowcaseSection = () => {
  const [selectedApi, setSelectedApi] = useState(apiDemos[0]);

  return (
    <Section background="default" className="py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm text-white mb-6">
            <Brain className="mr-2 h-4 w-4" />
            Advanced Computational Platform
          </div>
          <h2 className="text-5xl font-bold text-foreground mb-6">
            NP-Complete Problem Solver
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Polynomial-Time Solutions + 8 Advanced APIs
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access polynomial-time algorithmic solutions for NP-complete problems,
            plus quantum mechanics, consciousness simulation, holographic encoding, and unified physics—all accessible through REST APIs.
          </p>
        </div>

        {/* API Grid Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {apiDemos.map((api) => {
            const IconComponent = api.icon;
            return (
              <Card 
                key={api.id} 
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedApi.id === api.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedApi(api)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`bg-gradient-to-r ${api.bgGradient} p-3 rounded-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant={api.status === 'stable' ? 'default' : api.status === 'beta' ? 'secondary' : 'outline'}>
                      {api.status.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {api.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground mb-3">{api.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {api.features.slice(0, 2).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {api.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{api.features.length - 2} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured API Demo */}
        {selectedApi && (
          <Card className="mb-16 overflow-hidden">
            <div className={`bg-gradient-to-r ${selectedApi.bgGradient} p-8 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-4 rounded-xl">
                    <selectedApi.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedApi.name}</h3>
                    <p className="text-white/90 text-lg max-w-2xl">{selectedApi.description}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    asChild
                  >
                    <Link to={selectedApi.route}>
                      <Play className="h-4 w-4 mr-2" />
                      Try Demo
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/80 dark:border-white/60 text-white hover:bg-white/30 dark:hover:bg-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-sm"
                    asChild
                  >
                    <Link to="/docs">
                      View Docs
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold mb-4">Interactive Demo</h4>
                  <p className="text-foreground mb-6">{selectedApi.demoDescription}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {selectedApi.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button asChild className="w-full">
                    <Link to={selectedApi.route}>
                      Experience {selectedApi.name}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
                
                <div className="bg-muted/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-4">Quick Start Example</h4>
                  <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 text-green-400 font-mono text-sm">
                    <div className="mb-2 text-gray-400"># {selectedApi.name} API</div>
                    <div>curl -X POST "https://api.np-complete.com/v1/{selectedApi.id.toLowerCase()}" \</div>
                    <div className="ml-4">-H "Authorization: Bearer YOUR_API_KEY" \</div>
                    <div className="ml-4">-H "Content-Type: application/json" \</div>
                    <div className="ml-4">-d '{JSON.stringify({
                      input: selectedApi.id === 'srs' ? 'optimization_problem' :
                             selectedApi.id === 'qsem' ? 'semantic_query' :
                             selectedApi.id === 'hqe' ? 'quantum_state' :
                             selectedApi.id === 'nlc' ? 'message_content' :
                             selectedApi.id === 'qcr' ? 'consciousness_pattern' :
                             selectedApi.id === 'iching' ? 'question' :
                             'observer_configuration'
                    }, null, 2)}'</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Stats */}
        <div className="bg-muted/30 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Computational Performance Metrics</h3>
            <p className="text-muted-foreground">Performance characteristics of our polynomial-time NP-complete problem solver</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">P=NP</div>
              <div className="text-sm text-muted-foreground">Problem Solved</div>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">Poly</div>
              <div className="text-sm text-muted-foreground">Time Complexity</div>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-1">∞</div>
              <div className="text-sm text-muted-foreground">NP Problems Solved</div>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Atom className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-600 mb-1">O(P)</div>
              <div className="text-sm text-muted-foreground">Time Complexity</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Access Polynomial-Time Solutions</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Access our computational platform that provides polynomial-time solutions to NP-complete problems and efficient factorization algorithms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/demos/impossible-optimizer">
                  <Brain className="h-5 w-5 mr-2" />
                  Try the Solver
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/80 dark:border-white/60 text-white hover:bg-white/30 dark:hover:bg-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-sm" asChild>
                <Link to="/docs">
                  Factor Large Numbers
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ApiShowcaseSection;