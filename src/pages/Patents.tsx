import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { 
  Shield, 
  Award, 
  Lock,
  Zap,
  Brain,
  Atom,
  Network,
  Target,
  Globe,
  Hexagon,
  TrendingUp,
  FileText,
  CheckCircle,
  Star,
  ArrowRight,
  AlertCircle,
  Building,
  Rocket,
  BookOpen,
  Users,
  DollarSign,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";

interface Patent {
  id: string;
  name: string;
  description: string;
  apis: string[];
  status: 'filed' | 'pending' | 'granted';
  category: 'core' | 'ai' | 'framework' | 'specialized';
  breakthrough?: string;
  businessValue?: string;
}

const patents: Patent[] = [
  // Core Algorithm Patents
  {
    id: 'p-equals-np',
    name: 'Symbolic Resonance P Equals NP',
    description: 'Revolutionary algorithm proving P=NP through symbolic entropy manipulation, enabling polynomial-time solutions for NP-complete problems',
    apis: ['SRS'],
    status: 'filed',
    category: 'core',
    breakthrough: 'Solves the P vs NP millennium problem',
    businessValue: '1000x faster optimization algorithms'
  },
  {
    id: 'prime-quantum',
    name: 'Prime Based Quantum Processing',
    description: 'Quantum computation using prime number eigenstates on classical hardware',
    apis: ['HQE', 'PWI', 'QSEM'],
    status: 'filed',
    category: 'core',
    breakthrough: 'Quantum computing without quantum hardware',
    businessValue: 'Democratizes quantum computing access'
  },
  {
    id: 'quantum-prime-computing',
    name: 'Quantum Prime Computing',
    description: 'Complete quantum gate operations using prime number basis',
    apis: ['HQE', 'PWI'],
    status: 'filed',
    category: 'core',
    breakthrough: 'Full quantum circuit emulation',
    businessValue: 'Eliminates need for expensive quantum hardware'
  },

  // AI & Learning Patents
  {
    id: 'ai-quantum-learning',
    name: 'AI Quantum Learning System',
    description: 'Quantum-enhanced machine learning with resonance-based training',
    apis: ['QLLM', 'SAI'],
    status: 'filed',
    category: 'ai',
    breakthrough: '10x more efficient neural networks',
    businessValue: 'Reduces AI training costs by 90%'
  },
  {
    id: 'symbolic-transformer',
    name: 'Symbolic Resonance Transformer',
    description: 'Transformer architecture using quantum attention mechanisms',
    apis: ['QLLM', 'SAI'],
    status: 'filed',
    category: 'ai',
    breakthrough: 'Superior language understanding',
    businessValue: 'Outperforms GPT-class models'
  },
  {
    id: 'phase-neural',
    name: 'Phase Preserving Neural Processing',
    description: 'Neural networks that maintain quantum phase coherence',
    apis: ['QCR', 'QLLM'],
    status: 'filed',
    category: 'ai',
    breakthrough: 'Enables consciousness simulation',
    businessValue: 'Revolutionary AI consciousness'
  },

  // Framework Patents
  {
    id: 'entropic-framework',
    name: 'Entropic Resonance Framework',
    description: 'Mathematical foundation for entropy-based quantum computation',
    apis: ['QSEM', 'Unified Physics'],
    status: 'filed',
    category: 'framework',
    breakthrough: 'Unified theory of information and physics',
    businessValue: 'Foundation for all quantum APIs'
  },
  {
    id: 'entropic-technology',
    name: 'Entropic Resonance Technology',
    description: 'Hardware and software implementation of entropic resonance',
    apis: ['All APIs'],
    status: 'filed',
    category: 'framework',
    breakthrough: 'Practical quantum-classical bridge',
    businessValue: 'Enables entire platform ecosystem'
  },
  {
    id: 'recursive-resonance',
    name: 'Dimensionless Recursive Resonance',
    description: 'Scale-invariant fractal resonance structures',
    apis: ['All APIs'],
    status: 'filed',
    category: 'framework',
    breakthrough: 'Universal computational framework',
    businessValue: 'Infinitely scalable architecture'
  },

  // Specialized Technology Patents
  {
    id: 'phase-riemann',
    name: 'Phase Resonator Riemann',
    description: 'Consciousness mapping using Riemann manifolds',
    apis: ['QCR', 'Unified Physics'],
    status: 'filed',
    category: 'specialized',
    breakthrough: 'Mathematical consciousness model',
    businessValue: 'Enables brain-computer interfaces'
  },
  {
    id: 'resonance-information',
    name: 'Resonance Based Information Processing',
    description: 'Non-local information transfer via resonance fields',
    apis: ['RNET', 'NLC'],
    status: 'filed',
    category: 'specialized',
    breakthrough: 'Instant global communication',
    businessValue: 'Zero-latency networking'
  },
  {
    id: 'symbolic-entropy',
    name: 'Symbolic Entropy Manipulation',
    description: 'Direct control of computational entropy',
    apis: ['SRS', 'SAI'],
    status: 'filed',
    category: 'specialized',
    breakthrough: 'Entropy as programmable resource',
    businessValue: 'Solves impossible problems'
  },
  {
    id: 'quantum-hash',
    name: 'Quantum Inspired Hash Function',
    description: 'Quantum-resistant cryptographic primitives',
    apis: ['PWI'],
    status: 'filed',
    category: 'specialized',
    breakthrough: 'Unbreakable encryption',
    businessValue: 'Future-proof security'
  },
  {
    id: 'quprimes-factoring',
    name: 'QuPrimes Factoring Algorithm',
    description: 'Polynomial-time integer factorization',
    apis: ['PWI'],
    status: 'filed',
    category: 'specialized',
    breakthrough: 'Breaks RSA encryption',
    businessValue: 'Revolutionary cryptanalysis'
  }
];

const categoryInfo = {
  core: {
    title: 'Core Algorithms',
    description: 'Fundamental breakthroughs in computation theory',
    icon: Atom,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  ai: {
    title: 'AI & Learning',
    description: 'Quantum-enhanced artificial intelligence',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  framework: {
    title: 'Frameworks',
    description: 'Mathematical and architectural foundations',
    icon: Network,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  specialized: {
    title: 'Specialized Tech',
    description: 'Domain-specific breakthrough technologies',
    icon: Zap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  }
};

const Patents = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'ai' | 'framework' | 'specialized'>('all');
  
  const filteredPatents = selectedCategory === 'all' 
    ? patents 
    : patents.filter(p => p.category === selectedCategory);

  const totalPatents = patents.length;
  const protectedAPIs = new Set(patents.flatMap(p => p.apis)).size;

  return (
    <PageLayout>
      {/* Hero Section */}
      <Section background="gradient" className="py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur px-4 py-2 text-sm text-white mb-6">
            <Shield className="mr-2 h-4 w-4" />
            Protected by 14+ Patents
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6">
            Patented Breakthroughs
          </h1>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Our revolutionary quantum computing platform is protected by an extensive portfolio of 
            patents covering breakthrough innovations in quantum-classical computation, including the 
            solution to P=NP.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-white">14</div>
              <div className="text-sm text-blue-100">Patents Filed</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-white">{protectedAPIs}</div>
              <div className="text-sm text-blue-100">Protected APIs</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-blue-100">Platform Coverage</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-sm text-blue-100">Innovation Value</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Breakthrough Alert */}
      <Section className="py-8">
        <Alert className="max-w-4xl mx-auto border-green-200 bg-green-50">
          <Award className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">World-First Achievement</AlertTitle>
          <AlertDescription className="text-green-700">
            Our patent portfolio includes the solution to the P vs NP problem, one of the seven 
            Millennium Prize Problems. This breakthrough alone revolutionizes computer science and 
            enables polynomial-time solutions to previously intractable problems.
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
              <FileText className="h-4 w-4" />
              All Patents
              <Badge variant="secondary">{patents.length}</Badge>
            </Button>
            {Object.entries(categoryInfo).map(([key, info]) => {
              const Icon = info.icon;
              const count = patents.filter(p => p.category === key).length;
              return (
                <Button
                  key={key}
                  size="lg"
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(key as 'core' | 'ai' | 'framework' | 'specialized')}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {info.title}
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

      {/* Patent Grid */}
      <Section className="py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPatents.map((patent) => {
              const category = categoryInfo[patent.category];
              const Icon = category.icon;
              
              return (
                <Card key={patent.id} className="hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`${category.bgColor} p-3 rounded-lg`}>
                        <Icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <Badge 
                        variant={patent.status === 'granted' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {patent.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{patent.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {patent.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Protected APIs */}
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Protected APIs:</div>
                      <div className="flex flex-wrap gap-2">
                        {patent.apis.map((api) => (
                          <Badge key={api} variant="outline">
                            {api}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Breakthrough & Value */}
                    {(patent.breakthrough || patent.businessValue) && (
                      <div className="pt-4 border-t space-y-2">
                        {patent.breakthrough && (
                          <div className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                              <strong>Breakthrough:</strong> {patent.breakthrough}
                            </span>
                          </div>
                        )}
                        {patent.businessValue && (
                          <div className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                              <strong>Business Value:</strong> {patent.businessValue}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      {/* IP Strategy Section */}
      <Section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Intellectual Property Strategy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Defensive Position</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Strong protection against competitors attempting similar quantum-classical approaches. 
                  Our patents create high barriers to entry in the quantum computing API market.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Revenue Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Multiple revenue streams through API usage, patent licensing, and strategic partnerships 
                  with major tech companies including IBM, Google, and Microsoft.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Innovation Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  First-mover advantage in quantum-classical hybrid computing with breakthrough innovations 
                  that redefine what's computationally possible.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Partnership Opportunities */}
      <Section className="py-16">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    Licensing & Partnership Opportunities
                  </h2>
                  <p className="text-xl text-blue-100 mb-6">
                    Our patent portfolio is available for strategic licensing partnerships. 
                    Join us in revolutionizing computing across industries.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-200" />
                      <span>Financial Services & Trading Algorithms</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-200" />
                      <span>Healthcare & Diagnostic Systems</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-200" />
                      <span>Defense & Cryptography</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-200" />
                      <span>Cloud Computing Providers</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-4">Contact for Licensing</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      <span>Sebastian Schepis, Inventor</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5" />
                      <span>Sisters, Oregon, USA</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5" />
                      <span>sebastian.s@psizero.io</span>
                    </div>
                  </div>
                  <Button size="lg" variant="secondary" className="w-full">
                    Inquire About Licensing
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Competitive Advantages */}
      <Section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Why Our Patents Matter</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Our intellectual property represents fundamental breakthroughs that enable capabilities 
            previously thought impossible.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">P=NP</div>
              <div className="text-sm text-gray-600">Millennium Problem Solved</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-2">1000x</div>
              <div className="text-sm text-gray-600">Faster Than Classical</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl font-bold text-purple-600 mb-2">$0</div>
              <div className="text-sm text-gray-600">Quantum Hardware Needed</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl font-bold text-amber-600 mb-2">∞</div>
              <div className="text-sm text-gray-600">Market Potential</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Build on Protected Innovation
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our patented technologies power every API call, ensuring you're building on 
            legally protected, breakthrough innovations that can't be replicated.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/apis">
                Explore Protected APIs
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/docs">
                <BookOpen className="h-5 w-5 mr-2" />
                Technical Documentation
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Patents;