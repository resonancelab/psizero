import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  Lightbulb, 
  Zap, 
  Clock, 
  TrendingUp, 
  Target, 
  Cpu, 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Info,
  Award,
  Atom
} from 'lucide-react';

interface ComplexityLevel {
  n: number;
  classical: number;
  quantum: number;
}

interface QuantumAdvantage {
  problemType: string;
  classicalComplexity: string;
  quantumComplexity: string;
  speedup: string;
  description: string;
  realWorldExample: string;
}

interface EducationalSection {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
}

interface QuantumAlgorithmExplainerProps {
  selectedProblem?: 'TSP' | 'SubsetSum' | 'MaxClique' | '3SAT';
  onConceptMastered?: (concept: string) => void;
}

export const QuantumAlgorithmExplainer: React.FC<QuantumAlgorithmExplainerProps> = ({
  selectedProblem,
  onConceptMastered
}) => {
  const [activeTab, setActiveTab] = useState('introduction');
  const [currentSection, setCurrentSection] = useState(0);
  const [expandedConcepts, setExpandedConcepts] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [complexityData, setComplexityData] = useState<ComplexityLevel[]>([]);
  const [masteredConcepts, setMasteredConcepts] = useState<Set<string>>(new Set());
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Quantum advantages for different problems
  const quantumAdvantages: QuantumAdvantage[] = [
    {
      problemType: 'Traveling Salesman Problem (TSP)',
      classicalComplexity: 'O(n!)',
      quantumComplexity: 'O(n² × 2^(n/2))',
      speedup: 'Exponential',
      description: 'Quantum algorithms can explore multiple route combinations simultaneously through superposition',
      realWorldExample: 'Logistics optimization for delivery networks with thousands of stops'
    },
    {
      problemType: 'Subset Sum',
      classicalComplexity: 'O(2^n)',
      quantumComplexity: 'O(2^(n/2))',
      speedup: 'Quadratic',
      description: 'Grover\'s algorithm provides quadratic speedup for unstructured search problems',
      realWorldExample: 'Breaking cryptographic systems based on subset sum problems'
    },
    {
      problemType: 'Maximum Clique',
      classicalComplexity: 'O(2^n × n)',
      quantumComplexity: 'O(2^(n/2) × n)',
      speedup: 'Quadratic',
      description: 'Quantum parallelism helps explore network structures more efficiently',
      realWorldExample: 'Finding communities in social networks or protein interaction networks'
    },
    {
      problemType: '3-SAT',
      classicalComplexity: 'O(2^n)',
      quantumComplexity: 'O(2^(n/2))',
      speedup: 'Quadratic',
      description: 'Amplitude amplification accelerates the search for satisfying assignments',
      realWorldExample: 'Circuit verification and automated theorem proving'
    }
  ];

  // Generate complexity comparison data
  useEffect(() => {
    const data: ComplexityLevel[] = [];
    for (let n = 4; n <= 20; n += 2) {
      data.push({
        n,
        classical: Math.pow(2, n),
        quantum: Math.pow(2, n / 2)
      });
    }
    setComplexityData(data);
  }, []);

  // Draw complexity comparison chart
  const drawComplexityChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || complexityData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    
    // Grid lines
    for (let i = 0; i < 5; i++) {
      const y = padding + (i * (height - 2 * padding)) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw classical complexity line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const maxValue = Math.max(...complexityData.map(d => d.classical));
    
    complexityData.forEach((point, index) => {
      const x = padding + (index / (complexityData.length - 1)) * (width - 2 * padding);
      const y = height - padding - (Math.log(point.classical) / Math.log(maxValue)) * (height - 2 * padding);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw quantum complexity line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    complexityData.forEach((point, index) => {
      const x = padding + (index / (complexityData.length - 1)) * (width - 2 * padding);
      const y = height - padding - (Math.log(point.quantum) / Math.log(maxValue)) * (height - 2 * padding);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText('Problem Size (n)', width / 2 - 50, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Time Complexity', -50, 0);
    ctx.restore();

    // Legend
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(width - 150, 20, 20, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Classical O(2^n)', width - 125, 30);
    
    ctx.fillStyle = '#10b981';
    ctx.fillRect(width - 150, 40, 20, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Quantum O(2^(n/2))', width - 125, 50);
  };

  // Educational sections
  const sections: EducationalSection[] = [
    {
      id: 'np-complete',
      title: 'Understanding NP-Completeness',
      description: 'Learn what makes these problems fundamentally difficult',
      difficulty: 'beginner',
      estimatedTime: 5,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            NP-Complete problems are a special class of computational problems that are:
          </p>
          <ul className="space-y-2 text-gray-300 ml-4">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Easy to verify:</strong> Given a solution, you can quickly check if it's correct</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Hard to solve:</strong> Finding the solution takes exponential time</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Universally equivalent:</strong> If you can solve one efficiently, you can solve them all</span>
            </li>
          </ul>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2">Why This Matters</h4>
            <p className="text-sm text-gray-300">
              Many real-world problems fall into this category: scheduling, resource allocation, 
              network optimization, and cryptography. Understanding their computational limits 
              helps us appreciate why quantum computing is so revolutionary.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'quantum-advantage',
      title: 'How Quantum Computing Helps',
      description: 'Discover the fundamental principles behind quantum speedup',
      difficulty: 'intermediate',
      estimatedTime: 8,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Quantum computers achieve speedup through three key principles:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-purple-500/10 border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-300">Superposition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-300">
                  Qubits can exist in multiple states simultaneously, allowing 
                  parallel exploration of solution spaces.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-500/10 border-green-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-300">Entanglement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-300">
                  Quantum bits can be correlated in ways that classical bits cannot,
                  enabling complex correlations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-500/10 border-orange-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-orange-300">Interference</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-300">
                  Quantum amplitudes can constructively interfere to amplify 
                  correct answers and destructively interfere to suppress wrong ones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'algorithms',
      title: 'Key Quantum Algorithms',
      description: 'Explore the algorithms that power quantum optimization',
      difficulty: 'advanced',
      estimatedTime: 10,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <Card className="bg-gray-800/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Grover's Algorithm</CardTitle>
                  <Badge variant="secondary">O(√N) speedup</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-2">
                  Provides quadratic speedup for unstructured search problems.
                </p>
                <p className="text-xs text-gray-400">
                  Applications: Database search, subset sum, cryptanalysis
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Quantum Approximate Optimization (QAOA)</CardTitle>
                  <Badge variant="secondary">Problem-specific</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-2">
                  Hybrid quantum-classical algorithm for combinatorial optimization.
                </p>
                <p className="text-xs text-gray-400">
                  Applications: Max-Cut, TSP, portfolio optimization
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Variational Quantum Eigensolver (VQE)</CardTitle>
                  <Badge variant="secondary">Near-term</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-2">
                  Finds ground states of quantum systems using variational principles.
                </p>
                <p className="text-xs text-gray-400">
                  Applications: Chemistry, materials science, optimization
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  const toggleConcept = (conceptId: string) => {
    setExpandedConcepts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(conceptId)) {
        newSet.delete(conceptId);
      } else {
        newSet.add(conceptId);
      }
      return newSet;
    });
  };

  const markConceptMastered = (conceptId: string) => {
    setMasteredConcepts(prev => new Set([...prev, conceptId]));
    onConceptMastered?.(conceptId);
  };

  const renderComplexityComparison = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Complexity Growth Comparison
          </CardTitle>
          <CardDescription>
            See how quantum algorithms scale compared to classical approaches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            className="w-full border border-gray-700 rounded bg-gray-900"
          />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-mono text-red-400">2^n</div>
              <div className="text-sm text-gray-400">Classical Complexity</div>
              <div className="text-xs text-gray-500 mt-1">
                For n=20: ~1 million operations
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-green-400">2^(n/2)</div>
              <div className="text-sm text-gray-400">Quantum Complexity</div>
              <div className="text-xs text-gray-500 mt-1">
                For n=20: ~1,000 operations
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {quantumAdvantages.map((advantage, index) => (
          <Card key={index} className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{advantage.problemType}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="destructive" className="text-xs">
                  Classical: {advantage.classicalComplexity}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Quantum: {advantage.quantumComplexity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-2">{advantage.description}</p>
              <div className="bg-blue-500/10 rounded p-2">
                <p className="text-xs text-blue-300">
                  <strong>Real-world:</strong> {advantage.realWorldExample}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEducationalContent = () => (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <Card key={section.id} className="overflow-hidden">
          <CardHeader 
            className="cursor-pointer hover:bg-gray-800/50 transition-colors"
            onClick={() => toggleConcept(section.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {expandedConcepts.has(section.id) ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
                <div>
                  <CardTitle className="text-sm">{section.title}</CardTitle>
                  <CardDescription className="text-xs">{section.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={
                  section.difficulty === 'beginner' ? 'secondary' :
                  section.difficulty === 'intermediate' ? 'default' : 'destructive'
                }>
                  {section.difficulty}
                </Badge>
                <span className="text-xs text-gray-400">{section.estimatedTime}min</span>
                {masteredConcepts.has(section.id) && (
                  <Award className="w-4 h-4 text-yellow-500" />
                )}
              </div>
            </div>
          </CardHeader>
          
          {expandedConcepts.has(section.id) && (
            <CardContent className="border-t border-gray-700">
              <div className="pt-4">
                {section.content}
                <div className="flex justify-end mt-4">
                  <Button
                    size="sm"
                    onClick={() => markConceptMastered(section.id)}
                    disabled={masteredConcepts.has(section.id)}
                    className="flex items-center gap-2"
                  >
                    {masteredConcepts.has(section.id) ? (
                      <>
                        <Award className="w-4 h-4" />
                        Mastered
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4" />
                        Mark as Mastered
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );

  const renderInteractiveDemo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Atom className="w-5 h-5" />
            Interactive Quantum Simulation
          </CardTitle>
          <CardDescription>
            Watch how quantum algorithms explore solution spaces
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-lg text-gray-400 mb-4">
              Interactive quantum simulation coming soon...
            </div>
            <p className="text-sm text-gray-500">
              This will show real-time visualization of quantum superposition, 
              entanglement, and interference during optimization.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Progress Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Concepts Mastered</span>
                <span>{masteredConcepts.size}/{sections.length}</span>
              </div>
              <Progress value={(masteredConcepts.size / sections.length) * 100} />
              
              <div className="space-y-2 text-xs">
                {sections.map(section => (
                  <div key={section.id} className="flex items-center gap-2">
                    {masteredConcepts.has(section.id) ? 
                      <Award className="w-3 h-3 text-yellow-500" /> :
                      <div className="w-3 h-3 border border-gray-600 rounded-sm" />
                    }
                    <span className={masteredConcepts.has(section.id) ? 'text-green-400' : 'text-gray-400'}>
                      {section.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Facts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-medium">P vs NP</div>
                  <div className="text-xs text-gray-400">
                    The most important unsolved problem in computer science
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">Quantum Supremacy</div>
                  <div className="text-xs text-gray-400">
                    Achieved for specific problems, optimization applications emerging
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Near-term Algorithms</div>
                  <div className="text-xs text-gray-400">
                    QAOA and VQE work on current quantum computers
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Draw complexity chart when component mounts
  useEffect(() => {
    drawComplexityChart();
  }, [complexityData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Quantum Algorithm Learning Center
              </CardTitle>
              <CardDescription>
                Master the theory behind quantum optimization algorithms
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {masteredConcepts.size}/{sections.length} Complete
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="introduction">Learn Concepts</TabsTrigger>
          <TabsTrigger value="complexity">Compare Complexity</TabsTrigger>
          <TabsTrigger value="interactive">Interactive Demo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="introduction" className="space-y-6">
          {renderEducationalContent()}
        </TabsContent>
        
        <TabsContent value="complexity" className="space-y-6">
          {renderComplexityComparison()}
        </TabsContent>
        
        <TabsContent value="interactive" className="space-y-6">
          {renderInteractiveDemo()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuantumAlgorithmExplainer;