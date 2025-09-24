import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Zap, 
  Target, 
  Clock,
  MapPin,
  Route,
  Activity,
  Download,
  Copy
} from 'lucide-react';

interface City {
  id: number;
  name: string;
  x: number;
  y: number;
}

interface TSPSolution {
  route: number[];
  distance: number;
  iterations: number;
  convergenceTime: number;
}

interface QuantumParams {
  primeBasisSize: number;
  resonanceThreshold: number;
  maxIterations: number;
  quantumAnnealing: boolean;
  entropyScaling: number;
}

const QuantumTSPSolver: React.FC = () => {
  // State management
  const [cities, setCities] = useState<City[]>([]);
  const [solution, setSolution] = useState<TSPSolution | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [bestDistance, setBestDistance] = useState<number | null>(null);
  const [quantumParams, setQuantumParams] = useState<QuantumParams>({
    primeBasisSize: 23,
    resonanceThreshold: 0.95,
    maxIterations: 1000,
    quantumAnnealing: true,
    entropyScaling: 1.0
  });

  // Generate random cities
  const generateCities = useCallback((count: number) => {
    const newCities: City[] = [];
    const cityNames = [
      'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
      'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi'
    ];

    for (let i = 0; i < count; i++) {
      newCities.push({
        id: i,
        name: cityNames[i] || `City ${i + 1}`,
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50
      });
    }
    setCities(newCities);
    setSolution(null);
    setBestDistance(null);
  }, []);

  // Calculate distance between two cities
  const calculateDistance = (city1: City, city2: City): number => {
    return Math.sqrt(Math.pow(city2.x - city1.x, 2) + Math.pow(city2.y - city1.y, 2));
  };

  // Calculate total route distance
  const calculateTotalDistance = (route: number[]): number => {
    let total = 0;
    for (let i = 0; i < route.length; i++) {
      const from = cities[route[i]];
      const to = cities[route[(i + 1) % route.length]];
      total += calculateDistance(from, to);
    }
    return total;
  };

  // Quantum TSP Solver simulation
  const solveQuantumTSP = async () => {
    if (cities.length < 3) return;

    setIsRunning(true);
    setProgress(0);
    setCurrentIteration(0);
    setBestDistance(null);

    // Initialize with a random route
    let currentRoute = cities.map((_, index) => index);
    let bestRoute = [...currentRoute];
    let bestDist = calculateTotalDistance(currentRoute);

    const startTime = Date.now();

    // Quantum-enhanced optimization loop
    for (let iteration = 0; iteration < quantumParams.maxIterations; iteration++) {
      if (!isRunning) break;

      // Simulate quantum annealing with prime basis resonance
      const temperature = 1 - (iteration / quantumParams.maxIterations);
      const resonanceBoost = Math.sin(iteration * Math.PI / quantumParams.primeBasisSize) * 
                           quantumParams.entropyScaling;

      // Try quantum-enhanced local optimizations
      for (let attempts = 0; attempts < 5; attempts++) {
        const newRoute = [...currentRoute];
        
        // Quantum 2-opt with prime basis selection
        const primeIndices = [2, 3, 5, 7, 11, 13, 17, 19, 23];
        const i = primeIndices[iteration % primeIndices.length] % cities.length;
        const j = (i + primeIndices[(iteration + 1) % primeIndices.length]) % cities.length;
        
        if (i !== j) {
          // Perform 2-opt swap
          const [start, end] = i < j ? [i, j] : [j, i];
          newRoute.splice(start, end - start + 1, ...newRoute.slice(start, end + 1).reverse());
          
          const newDistance = calculateTotalDistance(newRoute);
          const deltaE = newDistance - bestDist;
          
          // Quantum acceptance probability with resonance
          const quantumProb = quantumParams.quantumAnnealing ? 
            Math.exp(-deltaE / (temperature + resonanceBoost)) * quantumParams.resonanceThreshold :
            quantumParams.resonanceThreshold;

          if (newDistance < bestDist || (temperature > 0 && Math.random() < quantumProb)) {
            currentRoute = newRoute;
            if (newDistance < bestDist) {
              bestRoute = [...newRoute];
              bestDist = newDistance;
              setBestDistance(bestDist);
            }
          }
        }
      }

      setCurrentIteration(iteration + 1);
      setProgress((iteration / quantumParams.maxIterations) * 100);

      // Yield control for UI updates
      if (iteration % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }

    const convergenceTime = Date.now() - startTime;

    setSolution({
      route: bestRoute,
      distance: bestDist,
      iterations: currentIteration,
      convergenceTime
    });

    setIsRunning(false);
    setProgress(100);
  };

  // Initialize with default cities
  useEffect(() => {
    generateCities(8);
  }, [generateCities]);

  const resetSolver = () => {
    setIsRunning(false);
    setSolution(null);
    setProgress(0);
    setCurrentIteration(0);
    setBestDistance(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-violet-600" />
                Quantum TSP Solver
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Solve the Traveling Salesman Problem using quantum-enhanced symbolic resonance algorithms
              </p>
            </div>
            <Badge className="bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200">
              Advanced
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visualization Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Problem Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20 h-80 overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 500 400">
                {/* Draw solution route */}
                {solution && solution.route.length > 0 && (
                  <g>
                    {solution.route.map((cityIndex, i) => {
                      const from = cities[cityIndex];
                      const to = cities[solution.route[(i + 1) % solution.route.length]];
                      return (
                        <line
                          key={i}
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke="rgb(139 92 246)"
                          strokeWidth="2"
                          opacity="0.8"
                        />
                      );
                    })}
                  </g>
                )}

                {/* Draw cities */}
                {cities.map((city, index) => (
                  <g key={city.id}>
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r="8"
                      fill="rgb(59 130 246)"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={city.x}
                      y={city.y - 15}
                      textAnchor="middle"
                      className="text-xs fill-foreground"
                      fontWeight="bold"
                    >
                      {city.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateCities(6)}
              >
                6 Cities
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateCities(8)}
              >
                8 Cities
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateCities(10)}
              >
                10 Cities
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateCities(12)}
              >
                12 Cities
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quantum Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primeBasis">Prime Basis Size: {quantumParams.primeBasisSize}</Label>
              <Slider
                id="primeBasis"
                min={7}
                max={47}
                step={2}
                value={[quantumParams.primeBasisSize]}
                onValueChange={([value]) => 
                  setQuantumParams(prev => ({ ...prev, primeBasisSize: value }))
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="resonance">Resonance Threshold: {quantumParams.resonanceThreshold}</Label>
              <Slider
                id="resonance"
                min={0.1}
                max={1.0}
                step={0.05}
                value={[quantumParams.resonanceThreshold]}
                onValueChange={([value]) => 
                  setQuantumParams(prev => ({ ...prev, resonanceThreshold: value }))
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="iterations">Max Iterations: {quantumParams.maxIterations}</Label>
              <Slider
                id="iterations"
                min={100}
                max={2000}
                step={100}
                value={[quantumParams.maxIterations]}
                onValueChange={([value]) => 
                  setQuantumParams(prev => ({ ...prev, maxIterations: value }))
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="entropy">Entropy Scaling: {quantumParams.entropyScaling}</Label>
              <Slider
                id="entropy"
                min={0.1}
                max={2.0}
                step={0.1}
                value={[quantumParams.entropyScaling]}
                onValueChange={([value]) => 
                  setQuantumParams(prev => ({ ...prev, entropyScaling: value }))
                }
                className="mt-2"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                onClick={isRunning ? () => setIsRunning(false) : solveQuantumTSP}
                disabled={cities.length < 3}
                className="flex-1"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Solve
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetSolver}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quantum Solving Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Iteration</div>
                <div className="font-mono">{currentIteration.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Best Distance</div>
                <div className="font-mono">
                  {bestDistance ? bestDistance.toFixed(2) : '—'}
                </div>
              </div>
            </div>

            {isRunning && (
              <div className="flex items-center gap-2 text-sm text-violet-600">
                <div className="w-2 h-2 bg-violet-600 rounded-full animate-pulse"></div>
                Quantum resonance active...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Solution Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {solution ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Distance</div>
                    <div className="text-2xl font-bold text-violet-600">
                      {solution.distance.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Convergence Time</div>
                    <div className="text-lg font-semibold">
                      {solution.convergenceTime}ms
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-2">Optimal Route</div>
                  <div className="font-mono text-sm bg-muted p-2 rounded">
                    {solution.route.map(cityIndex => cities[cityIndex].name).join(' → ')} → {cities[solution.route[0]].name}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Route
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Route className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Run the quantum solver to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Code Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Implementation Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript">
            <TabsList>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="javascript">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`// Configure quantum TSP solver
const solver = new SRS.QuantumSolver({
  algorithm: "quantum_annealing",
  primeBasisSize: ${quantumParams.primeBasisSize},
  resonanceThreshold: ${quantumParams.resonanceThreshold},
  entropyScaling: ${quantumParams.entropyScaling}
});

// Define TSP problem
const cities = ${JSON.stringify(cities.slice(0, 3), null, 2)};

// Solve TSP instance
const solution = await solver.solve({
  problem: {
    type: "TSP",
    cities: cities,
    distanceMatrix: calculateDistanceMatrix(cities)
  },
  maxIterations: ${quantumParams.maxIterations}
});

console.log("Optimal route:", solution.route);
console.log("Total distance:", solution.distance);`}</code>
              </pre>
            </TabsContent>
            
            <TabsContent value="python">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`import requests
import json

# Configure quantum solver
config = {
    "algorithm": "quantum_annealing",
    "prime_basis_size": ${quantumParams.primeBasisSize},
    "resonance_threshold": ${quantumParams.resonanceThreshold},
    "entropy_scaling": ${quantumParams.entropyScaling}
}

# Define TSP problem
cities = ${JSON.stringify(cities.slice(0, 3), null, 2)}

# Solve via API
response = requests.post("https://api.np-complete.com/v1/srs/solve", 
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "problem_type": "TSP",
        "cities": cities,
        "config": config,
        "max_iterations": ${quantumParams.maxIterations}
    }
)

solution = response.json()
print(f"Optimal route: {solution['route']}")
print(f"Total distance: {solution['distance']}")`}</code>
              </pre>
            </TabsContent>
            
            <TabsContent value="curl">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`curl -X POST "https://api.np-complete.com/v1/srs/solve" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "problem_type": "TSP",
    "cities": ${JSON.stringify(cities.slice(0, 3))},
    "config": {
      "algorithm": "quantum_annealing",
      "prime_basis_size": ${quantumParams.primeBasisSize},
      "resonance_threshold": ${quantumParams.resonanceThreshold},
      "entropy_scaling": ${quantumParams.entropyScaling}
    },
    "max_iterations": ${quantumParams.maxIterations}
  }'`}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuantumTSPSolver;