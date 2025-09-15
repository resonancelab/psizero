import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Atom, Sparkles, Globe, Eye, Hexagon, Gauge,
  ArrowRight, BookOpen, Code, Lightbulb, Target, CheckCircle,
  Clock, Users, Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import CodeBlock from "@/components/ui/code-block";

const Tutorials = () => {
  const tutorialCategories = [
    {
      id: "srs",
      name: "Symbolic Resonance Solver",
      icon: Brain,
      color: "blue",
      difficulty: "Beginner",
      duration: "15 mins",
      description: "Learn to solve NP-complete problems using symbolic resonance",
      tutorials: [
        "Getting Started with 3-SAT",
        "Advanced Problem Types",
        "Performance Optimization",
        "Real-world Applications"
      ]
    },
    {
      id: "hqe",
      name: "Holographic Quantum Encoder",
      icon: Atom,
      color: "purple",
      difficulty: "Intermediate",
      duration: "25 mins",
      description: "Master quantum holographic system simulation",
      tutorials: [
        "Prime Eigenstate Basics",
        "Evolution Dynamics",
        "Entropy Analysis",
        "Pattern Recognition"
      ]
    },
    {
      id: "qsem",
      name: "Quantum Semantics",
      icon: Sparkles,
      color: "pink",
      difficulty: "Intermediate",
      duration: "20 mins",
      description: "Encode concepts into quantum semantic vectors",
      tutorials: [
        "Concept Encoding Fundamentals",
        "Semantic Resonance",
        "Relationship Analysis",
        "Language Processing"
      ]
    },
    {
      id: "nlc",
      name: "Non-Local Communication",
      icon: Globe,
      color: "green",
      difficulty: "Advanced",
      duration: "30 mins",
      description: "Establish quantum communication channels",
      tutorials: [
        "Channel Establishment",
        "Message Transmission",
        "Phase Modulation",
        "Security & Encryption"
      ]
    },
    {
      id: "qcr",
      name: "Quantum Consciousness Resonator",
      icon: Eye,
      color: "indigo",
      difficulty: "Expert",
      duration: "40 mins",
      description: "Simulate triadic consciousness dynamics",
      tutorials: [
        "Consciousness Modeling",
        "Multi-modal Processing",
        "Stabilization Techniques",
        "Cognitive Analysis"
      ]
    },
    {
      id: "iching",
      name: "I-Ching Oracle",
      icon: Hexagon,
      color: "orange",
      difficulty: "Beginner",
      duration: "10 mins",
      description: "Navigate symbolic entropy dynamics",
      tutorials: [
        "Hexagram Basics",
        "Evolution Patterns",
        "Attractor Analysis",
        "Decision Making"
      ]
    },
    {
      id: "unified",
      name: "Unified Physics",
      icon: Gauge,
      color: "red",
      difficulty: "Expert",
      duration: "45 mins",
      description: "Compute emergent gravitational effects",
      tutorials: [
        "Entropy-Gravity Coupling",
        "Field Calculations",
        "Observer Effects",
        "Cosmological Applications"
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-orange-100 text-orange-800";
      case "Expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <BookOpen className="h-10 w-10 text-primary" />
              API Tutorials & Guides
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive step-by-step tutorials for mastering all Nomyx Resonance APIs. 
              From beginner concepts to advanced implementations.
            </p>
          </div>

          {/* Quick Start Guide */}
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Quick Start Guide</CardTitle>
              </div>
              <CardDescription>Get up and running with Nomyx Resonance APIs in under 10 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</div>
                    <h3 className="font-semibold">Get API Key</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Sign up for a free account and obtain your API key from the dashboard</p>
                  <Button size="sm" asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</div>
                    <h3 className="font-semibold">Install SDK</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Choose your preferred language and install the official SDK</p>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/sdks">View SDKs</Link>
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</div>
                    <h3 className="font-semibold">Try APIs</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Test API calls in our interactive playground</p>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/playground">Open Playground</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tutorial Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tutorialCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <Badge className={getDifficultyColor(category.difficulty)}>
                        {category.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription className="text-sm">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {category.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {category.tutorials.length} guides
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Tutorial Topics:</h4>
                        <ul className="space-y-1">
                          {category.tutorials.map((tutorial, index) => (
                            <li key={index} className="flex items-center text-xs text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {tutorial}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button className="w-full" size="sm">
                        Start Tutorial
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Featured Tutorial */}
          <Tabs defaultValue="srs-3sat" className="w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Featured Tutorial: Solving 3-SAT with SRS</h2>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="srs-3sat">Introduction</TabsTrigger>
                <TabsTrigger value="setup">Setup</TabsTrigger>
                <TabsTrigger value="implementation">Implementation</TabsTrigger>
                <TabsTrigger value="optimization">Optimization</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="srs-3sat" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Brain className="h-6 w-6 text-blue-600" />
                    Understanding 3-SAT Problems
                  </CardTitle>
                  <CardDescription>
                    Learn the fundamentals of Boolean satisfiability and how SRS solves these NP-complete problems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">What is 3-SAT?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      3-SAT (3-Boolean Satisfiability) is about finding truth values for variables that satisfy 
                      a boolean formula in conjunctive normal form, where each clause contains exactly 3 literals.
                    </p>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Example Problem:</h4>
                      <p className="text-sm mb-2">Find values for x₁, x₂, x₃ that satisfy:</p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• (x₁ ∨ ¬x₂ ∨ x₃) AND</li>
                        <li>• (¬x₁ ∨ x₂ ∨ ¬x₃) AND</li>
                        <li>• (x₁ ∨ x₂ ∨ x₃)</li>
                      </ul>
                      <p className="text-sm mt-2 text-green-600">Solution: x₁=true, x₂=false, x₃=true</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">How SRS Solves It</h3>
                    <p className="text-sm text-muted-foreground">
                      SRS transforms the boolean formula into a symbolic entropy space where solutions emerge 
                      through resonance dynamics, achieving polynomial-time complexity for many instances.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="setup" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Environment Setup</CardTitle>
                  <CardDescription>Prepare your development environment for SRS API integration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">1. Install the SDK</h3>
                    <CodeBlock
                      language="bash"
                      code={`# JavaScript/Node.js
npm install @nomyx/resonance-sdk

# Python
pip install nomyx-resonance

# Go
go get github.com/nomyx/resonance-go`}
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">2. Initialize the Client</h3>
                    <CodeBlock
                      language="javascript"
                      code={`import { NomyxResonance } from '@nomyx/resonance-sdk';

const client = new NomyxResonance('your-api-key-here');

// Verify connection
const status = await client.status();
console.log('API Status:', status);`}
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">3. Test Basic Functionality</h3>
                    <CodeBlock
                      language="javascript"
                      code={`// Simple 3-SAT test
const result = await client.srs.solve({
  problem: '3sat',
  spec: {
    variables: 3,
    clauses: [
      [{ var: 1, neg: false }, { var: 2, neg: true }, { var: 3, neg: false }]
    ]
  }
});

console.log('Solution found:', result.feasible);
console.log('Assignment:', result.certificate.assignment);`}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="implementation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Implementation</CardTitle>
                  <CardDescription>Step-by-step implementation of a 3-SAT solver using SRS</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Full Example: Restaurant Scheduling</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Let's solve a real-world problem: scheduling restaurant staff with constraints.
                    </p>
                    
                    <CodeBlock
                      language="javascript"
                      code={`import { NomyxResonance } from '@nomyx/resonance-sdk';

class RestaurantScheduler {
  constructor(apiKey) {
    this.client = new NomyxResonance(apiKey);
  }

  async scheduleStaff(staff, shifts, constraints) {
    // Convert scheduling problem to 3-SAT
    const clauses = this.buildConstraintClauses(staff, shifts, constraints);
    
    const result = await this.client.srs.solve({
      problem: '3sat',
      spec: {
        variables: staff.length * shifts.length,
        clauses: clauses
      },
      config: {
        stop: { iterMax: 10000, plateauEps: 1e-8 },
        schedules: { eta0: 0.3, etaDecay: 0.001 }
      }
    });

    if (result.feasible) {
      return this.parseSchedule(result.certificate.assignment, staff, shifts);
    } else {
      throw new Error('No valid schedule found');
    }
  }

  buildConstraintClauses(staff, shifts, constraints) {
    const clauses = [];
    
    // Each shift must have at least one person
    shifts.forEach((shift, shiftIdx) => {
      const clause = staff.map((_, staffIdx) => ({
        var: staffIdx * shifts.length + shiftIdx + 1,
        neg: false
      }));
      clauses.push(clause);
    });

    // No person can work overlapping shifts
    staff.forEach((_, staffIdx) => {
      for (let i = 0; i < shifts.length; i++) {
        for (let j = i + 1; j < shifts.length; j++) {
          if (this.shiftsOverlap(shifts[i], shifts[j])) {
            clauses.push([
              { var: staffIdx * shifts.length + i + 1, neg: true },
              { var: staffIdx * shifts.length + j + 1, neg: true }
            ]);
          }
        }
      }
    });

    return clauses;
  }

  parseSchedule(assignment, staff, shifts) {
    const schedule = {};
    
    assignment.forEach((assigned, varIdx) => {
      if (assigned === 1) {
        const staffIdx = Math.floor(varIdx / shifts.length);
        const shiftIdx = varIdx % shifts.length;
        
        if (!schedule[staff[staffIdx]]) {
          schedule[staff[staffIdx]] = [];
        }
        schedule[staff[staffIdx]].push(shifts[shiftIdx]);
      }
    });

    return schedule;
  }

  shiftsOverlap(shift1, shift2) {
    // Simple overlap check (implement based on your time format)
    return shift1.end > shift2.start && shift2.end > shift1.start;
  }
}

// Usage
const scheduler = new RestaurantScheduler('your-api-key');

const staff = ['Alice', 'Bob', 'Charlie', 'Diana'];
const shifts = [
  { name: 'Morning', start: 8, end: 16 },
  { name: 'Evening', start: 16, end: 24 },
  { name: 'Night', start: 0, end: 8 }
];

const schedule = await scheduler.scheduleStaff(staff, shifts, {});
console.log('Optimal schedule:', schedule);`}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Optimization</CardTitle>
                  <CardDescription>Advanced techniques for optimizing SRS performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">1. Parameter Tuning</h3>
                    <CodeBlock
                      language="javascript"
                      code={`// Optimize for large problems
const config = {
  stop: {
    iterMax: 50000,           // Increase for complex problems
    plateauEps: 1e-10,        // Tighter convergence
    minMassThreshold: 0.8     // Higher confidence requirement
  },
  schedules: {
    eta0: 0.5,                // Higher initial learning rate
    etaDecay: 0.0005,         // Slower decay for large problems
    adaptiveScheduling: true   // Enable adaptive learning
  },
  projectors: {
    type: 'adaptive',         // Use adaptive projectors
    dampingFactor: 0.95       // Reduce oscillations
  }
};

const result = await client.srs.solve({
  problem: '3sat',
  spec: problemSpec,
  config: config
});`}
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">2. Monitoring & Debugging</h3>
                    <CodeBlock
                      language="javascript"
                      code={`// Enable detailed telemetry
const result = await client.srs.solve({
  problem: '3sat',
  spec: problemSpec,
  config: {
    telemetry: {
      enabled: true,
      samplingRate: 100,  // Sample every 100 iterations
      includeConvergence: true
    }
  }
});

// Analyze convergence patterns
result.telemetry.forEach(point => {
  console.log(\`Step \${point.t}: Entropy=\${point.S}, Satisfaction=\${point.satRate}\`);
});

// Check for convergence issues
if (!result.metrics.plateauDetected) {
  console.warn('Solution may not have converged - consider increasing iterMax');
}

if (result.metrics.dominance < 0.7) {
  console.warn('Low solution confidence - try adjusting parameters');
}`}
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">3. Batch Processing</h3>
                    <CodeBlock
                      language="javascript"
                      code={`// Process multiple problems efficiently
class SRSBatchProcessor {
  constructor(client) {
    this.client = client;
    this.queue = [];
  }

  async processBatch(problems, batchSize = 5) {
    const results = [];
    
    for (let i = 0; i < problems.length; i += batchSize) {
      const batch = problems.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (problem) => {
        try {
          return await this.client.srs.solve(problem);
        } catch (error) {
          return { error: error.message, problem };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Rate limiting - wait between batches
      if (i + batchSize < problems.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }
}

const processor = new SRSBatchProcessor(client);
const results = await processor.processBatch(problemSet);`}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Building?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Explore our comprehensive tutorials and start integrating Nomyx Resonance APIs into your applications today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/playground">
                  Try Interactive Playground
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/docs">Browse Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Tutorials;