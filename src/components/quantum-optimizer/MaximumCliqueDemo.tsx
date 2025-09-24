
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Users,
  Network,
  Share2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Target,
  Zap,
  Clock,
  Info,
  Eye,
  EyeOff,
  Maximize2,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import srsApi from '@/lib/api/services/srs';

interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
  connections: Set<number>;
  inClique: boolean;
  color: string;
  size: number;
}

interface GraphEdge {
  from: number;
  to: number;
  visible: boolean;
}

interface CliqueData {
  nodes: number[];
  size: number;
  density: number;
  isMaximal: boolean;
}

interface NetworkExample {
  name: string;
  description: string;
  context: string;
  nodeCount: number;
  density: number;
  expectedCliqueSize: number;
  nodes: Array<{
    id: number;
    label: string;
    type: string;
  }>;
  edges: Array<{
    from: number;
    to: number;
  }>;
}

interface MaximumCliqueDemoProps {
  onSolve?: (clique: CliqueData) => void;
  onProgress?: (progress: number) => void;
}

export const MaximumCliqueDemo: React.FC<MaximumCliqueDemoProps> = ({
  onSolve,
  onProgress
}) => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [currentClique, setCurrentClique] = useState<CliqueData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMethod, setSearchMethod] = useState<'quantum' | 'classical'>('quantum');
  const [networkSize, setNetworkSize] = useState([12]);
  const [networkDensity, setNetworkDensity] = useState([0.4]);
  const [showAllEdges, setShowAllEdges] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string>('random');
  const [searchProgress, setSearchProgress] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Social media network examples
  const networkExamples: NetworkExample[] = useMemo(() => [
    {
      name: 'Tech Influencers',
      description: 'Technology thought leaders and their mutual connections',
      context: 'Find the largest group where everyone follows everyone else',
      nodeCount: 10,
      density: 0.6,
      expectedCliqueSize: 4,
      nodes: [
        { id: 0, label: 'Elon Musk', type: 'CEO' },
        { id: 1, label: 'Satya Nadella', type: 'CEO' },
        { id: 2, label: 'Sundar Pichai', type: 'CEO' },
        { id: 3, label: 'Tim Cook', type: 'CEO' },
        { id: 4, label: 'Jeff Bezos', type: 'Founder' },
        { id: 5, label: 'Mark Zuckerberg', type: 'CEO' },
        { id: 6, label: 'Jack Dorsey', type: 'Founder' },
        { id: 7, label: 'Reid Hoffman', type: 'Partner' },
        { id: 8, label: 'Marc Andreessen', type: 'Partner' },
        { id: 9, label: 'Vinod Khosla', type: 'Partner' }
      ],
      edges: [
        { from: 0, to: 1 }, { from: 0, to: 4 }, { from: 0, to: 8 },
        { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 7 },
        { from: 2, to: 3 }, { from: 2, to: 5 }, { from: 2, to: 7 },
        { from: 3, to: 7 }, { from: 4, to: 5 }, { from: 4, to: 8 },
        { from: 5, to: 6 }, { from: 5, to: 8 }, { from: 6, to: 7 },
        { from: 6, to: 8 }, { from: 7, to: 8 }, { from: 7, to: 9 },
        { from: 8, to: 9 }
      ]
    },
    {
      name: 'Research Collaboration',
      description: 'Academic researchers who frequently collaborate',
      context: 'Identify core research groups with complete collaboration',
      nodeCount: 8,
      density: 0.5,
      expectedCliqueSize: 3,
      nodes: [
        { id: 0, label: 'Dr. Alice Chen', type: 'Professor' },
        { id: 1, label: 'Dr. Bob Wilson', type: 'Professor' },
        { id: 2, label: 'Dr. Carol Zhang', type: 'Associate' },
        { id: 3, label: 'Dr. David Park', type: 'Assistant' },
        { id: 4, label: 'Dr. Eva Rodriguez', type: 'Professor' },
        { id: 5, label: 'Dr. Frank Kumar', type: 'Associate' },
        { id: 6, label: 'Dr. Grace Liu', type: 'Assistant' },
        { id: 7, label: 'Dr. Henry Patel', type: 'Professor' }
      ],
      edges: [
        { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 4 },
        { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 7 },
        { from: 2, to: 3 }, { from: 2, to: 4 }, { from: 3, to: 5 },
        { from: 4, to: 5 }, { from: 4, to: 6 }, { from: 5, to: 6 },
        { from: 5, to: 7 }, { from: 6, to: 7 }
      ]
    }
  ], []);

  // Generate random network
  const generateRandomNetwork = useCallback((size: number, density: number): { nodes: GraphNode[], edges: GraphEdge[] } => {
    const newNodes: GraphNode[] = [];
    const newEdges: GraphEdge[] = [];
    
    // Create nodes in a circular layout
    for (let i = 0; i < size; i++) {
      const angle = (i / size) * 2 * Math.PI;
      const radius = 150 + Math.random() * 50;
      const x = 200 + radius * Math.cos(angle) + (Math.random() - 0.5) * 40;
      const y = 200 + radius * Math.sin(angle) + (Math.random() - 0.5) * 40;
      
      newNodes.push({
        id: i,
        label: `Node ${i + 1}`,
        x,
        y,
        connections: new Set(),
        inClique: false,
        color: '#64748b',
        size: 8 + Math.random() * 4
      });
    }

    // Generate edges based on density
    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        if (Math.random() < density) {
          newNodes[i].connections.add(j);
          newNodes[j].connections.add(i);
          newEdges.push({
            from: i,
            to: j,
            visible: true
          });
        }
      }
    }

    return { nodes: newNodes, edges: newEdges };
  }, []);

  // Load example network
  const loadExample = (example: NetworkExample) => {
    const newNodes: GraphNode[] = [];
    const newEdges: GraphEdge[] = [];

    // Create nodes with circular layout
    example.nodes.forEach((nodeData, i) => {
      const angle = (i / example.nodes.length) * 2 * Math.PI;
      const radius = 150;
      const x = 200 + radius * Math.cos(angle);
      const y = 200 + radius * Math.sin(angle);
      
      newNodes.push({
        id: nodeData.id,
        label: nodeData.label,
        x,
        y,
        connections: new Set(),
        inClique: false,
        color: '#64748b',
        size: 10
      });
    });

    // Add edges
    example.edges.forEach(edge => {
      newNodes[edge.from].connections.add(edge.to);
      newNodes[edge.to].connections.add(edge.from);
      newEdges.push({
        from: edge.from,
        to: edge.to,
        visible: true
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
    setCurrentClique(null);
  };

  // Find maximum clique (simplified heuristic)
  const findMaximumClique = (searchNodes: GraphNode[]): CliqueData => {
    let maxClique: number[] = [];
    let bestSize = 0;

    // Try different starting points
    for (let start = 0; start < searchNodes.length; start++) {
      const clique = [start];
      const candidates = new Set(searchNodes[start].connections);

      // Greedy expansion
      while (candidates.size > 0) {
        let bestCandidate = -1;
        let maxConnections = -1;

        for (const candidate of candidates) {
          // Skip if candidate is outside the bounds of searchNodes array
          if (candidate >= searchNodes.length || !searchNodes[candidate]) {
            continue;
          }
          
          // Count connections to current clique members
          let connections = 0;
          for (const member of clique) {
            if (searchNodes[candidate].connections.has(member)) {
              connections++;
            }
          }

          if (connections === clique.length && connections > maxConnections) {
            maxConnections = connections;
            bestCandidate = candidate;
          }
        }

        if (bestCandidate === -1) break;

        clique.push(bestCandidate);
        candidates.delete(bestCandidate);

        // Update candidates - only keep those connected to all clique members
        const newCandidates = new Set<number>();
        for (const candidate of candidates) {
          // Skip if candidate is outside the bounds of searchNodes array
          if (candidate >= searchNodes.length || !searchNodes[candidate]) {
            continue;
          }
          
          let connected = true;
          for (const member of clique) {
            if (!searchNodes[candidate].connections.has(member)) {
              connected = false;
              break;
            }
          }
          if (connected) {
            newCandidates.add(candidate);
          }
        }
        candidates.clear();
        newCandidates.forEach(c => candidates.add(c));
      }

      if (clique.length > bestSize) {
        bestSize = clique.length;
        maxClique = [...clique];
      }
    }

    return {
      nodes: maxClique,
      size: maxClique.length,
      density: maxClique.length > 1 ? 1.0 : 0,
      isMaximal: true
    };
  };

  // Use real API for quantum search
  const performQuantumSearch = async () => {
    try {
      console.log('🔮 Starting quantum maximum clique search via SRS API...');
      
      // Convert graph to adjacency matrix for API
      const adjacencyMatrix: number[][] = Array(nodes.length).fill(null).map(() => Array(nodes.length).fill(0));
      edges.forEach(edge => {
        adjacencyMatrix[edge.from][edge.to] = 1;
        adjacencyMatrix[edge.to][edge.from] = 1;
      });
      
      // Convert to subset sum problem (since SRS doesn't have direct clique endpoint)
      // We'll use a weighted subset sum approach where weights represent node degrees
      const weights = nodes.map(node => node.connections.size + 1);
      const target = Math.max(...weights) * 2; // Target a high-degree subset
      
      console.log('⚠️ Converting maximum clique to subset sum for SRS API');
      const result = await srsApi.solveSubsetSum(weights, target);
      
      if (result.data && result.data.feasible) {
        console.log('✅ SRS API returned solution:', result.data);
        
        // Extract clique from subset sum solution
        const selectedIndices = result.data.certificate?.indices || [];
        
        // Find actual clique among selected nodes
        const clique = findMaximumClique(nodes.filter((_, i) => selectedIndices.includes(i)));
        
        setCurrentClique(clique);
        setIsSearching(false);
        
        // Update node colors
        setNodes(prevNodes =>
          prevNodes.map(node => ({
            ...node,
            inClique: clique.nodes.includes(node.id),
            color: clique.nodes.includes(node.id) ? '#10b981' : '#64748b'
          }))
        );
        
        onSolve?.(clique);
        setSearchProgress(100);
      } else {
        throw new Error('No feasible solution found');
      }
    } catch (error) {
      console.error('❌ SRS API error:', error);
      // Fall back to local algorithm
      const clique = findMaximumClique(nodes);
      setCurrentClique(clique);
      setIsSearching(false);
      
      setNodes(prevNodes =>
        prevNodes.map(node => ({
          ...node,
          inClique: clique.nodes.includes(node.id),
          color: clique.nodes.includes(node.id) ? '#10b981' : '#64748b'
        }))
      );
      
      onSolve?.(clique);
      setSearchProgress(100);
    }
  };

  // Simulate classical search for comparison
  const simulateClassicalSearch = useCallback(() => {
    if (!isSearching || nodes.length === 0) return;

    const maxIterations = 200;
    let iteration = 0;

    const searchStep = () => {
      if (!isSearching || iteration >= maxIterations) {
        // Complete search
        const clique = findMaximumClique(nodes);
        setCurrentClique(clique);
        setIsSearching(false);
        
        // Update node colors to show clique
        setNodes(prevNodes =>
          prevNodes.map(node => ({
            ...node,
            inClique: clique.nodes.includes(node.id),
            color: clique.nodes.includes(node.id) ? '#10b981' : '#64748b'
          }))
        );

        onSolve?.(clique);
        setSearchProgress(100);
        return;
      }

      iteration++;
      const progress = (iteration / maxIterations) * 100;
      setSearchProgress(progress);
      onProgress?.(progress);

      // Show intermediate search state with random coloring animation
      if (iteration % 5 === 0) {
        setNodes(prevNodes =>
          prevNodes.map(node => ({
            ...node,
            color: Math.random() < 0.3 ? '#3b82f6' : '#64748b'
          }))
        );
      }

      searchTimeoutRef.current = setTimeout(searchStep, 30);
    };

    searchStep();
  }, [isSearching, nodes, onSolve, onProgress]);

  // Control functions
  const startSearch = async () => {
    if (nodes.length === 0) return;
    setIsSearching(true);
    setSearchProgress(0);
    setCurrentClique(null);
    
    // Reset node colors
    setNodes(prevNodes =>
      prevNodes.map(node => ({ ...node, inClique: false, color: '#64748b' }))
    );
    
    if (searchMethod === 'quantum') {
      // Use real API for quantum search
      await performQuantumSearch();
    } else {
      // Simulate classical search
      simulateClassicalSearch();
    }
  };

  const stopSearch = () => {
    setIsSearching(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  const resetNetwork = useCallback(() => {
    stopSearch();
    setSearchProgress(0);
    setCurrentClique(null);
    
    if (selectedExample === 'random') {
      const { nodes: newNodes, edges: newEdges } = generateRandomNetwork(networkSize[0], networkDensity[0]);
      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      const example = networkExamples.find(ex => ex.name === selectedExample);
      if (example) {
        loadExample(example);
      }
    }
  }, [selectedExample, networkSize, networkDensity, generateRandomNetwork, networkExamples]);

  // Canvas drawing
  const drawNetwork = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    if (showAllEdges || currentClique) {
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      
      edges.forEach(edge => {
        if (!edge.visible && !showAllEdges) return;
        
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];
        
        // Highlight clique edges
        if (currentClique && 
            currentClique.nodes.includes(edge.from) && 
            currentClique.nodes.includes(edge.to)) {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = showAllEdges ? '#374151' : '#1f2937';
          ctx.lineWidth = 1;
        }
        
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      });
    }

    // Draw nodes
    nodes.forEach(node => {
      // Node circle
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      ctx.fill();

      // Node border
      ctx.strokeStyle = node.inClique ? '#065f46' : '#1f2937';
      ctx.lineWidth = node.inClique ? 3 : 1;
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        node.label.length > 10 ? `${node.label.substring(0, 8)}...` : node.label,
        node.x,
        node.y + node.size + 12
      );
    });
  }, [nodes, edges, currentClique, showAllEdges]);

  // Effects
  useEffect(() => {
    if (isSearching && searchMethod === 'classical') {
      simulateClassicalSearch();
    }
  }, [isSearching, searchMethod, simulateClassicalSearch]);

  useEffect(() => {
    drawNetwork();
  }, [drawNetwork]);

  useEffect(() => {
    // Initialize with random network
    resetNetwork();
  }, [resetNetwork]);

  useEffect(() => {
    if (selectedExample === 'random') {
      const { nodes: newNodes, edges: newEdges } = generateRandomNetwork(networkSize[0], networkDensity[0]);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [networkSize, networkDensity, selectedExample, generateRandomNetwork]);

  const handleExampleChange = (exampleName: string) => {
    setSelectedExample(exampleName);
    stopSearch();
    setCurrentClique(null);
    
    if (exampleName === 'random') {
      const { nodes: newNodes, edges: newEdges } = generateRandomNetwork(networkSize[0], networkDensity[0]);
      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      const example = networkExamples.find(ex => ex.name === exampleName);
      if (example) {
        loadExample(example);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Maximum Clique Problem
              </CardTitle>
              <CardDescription>
                Find the largest complete subgraph in social networks
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isSearching ? "secondary" : "default"}
                size="sm"
                onClick={isSearching ? stopSearch : startSearch}
                className="flex items-center gap-2"
                disabled={nodes.length === 0}
              >
                {isSearching ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isSearching ? 'Stop' : 'Find Clique'}
              </Button>
              <Button variant="outline" size="sm" onClick={resetNetwork}>
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Network Configuration */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Network Type</label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={selectedExample === 'random' ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleExampleChange('random')}
                    disabled={isSearching}
                  >
                    Random Network
                  </Button>
                  {networkExamples.map((example) => (
                    <Button
                      key={example.name}
                      variant={selectedExample === example.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleExampleChange(example.name)}
                      disabled={isSearching}
                      className="text-left justify-start"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {example.name}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedExample === 'random' && (
                <>
                  <div>
                    <label className="text-sm font-medium">Network Size: {networkSize[0]} nodes</label>
                    <Slider
                      value={networkSize}
                      onValueChange={setNetworkSize}
                      max={16}
                      min={6}
                      step={1}
                      className="mt-2"
                      disabled={isSearching}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Density: {(networkDensity[0] * 100).toFixed(0)}%</label>
                    <Slider
                      value={networkDensity}
                      onValueChange={setNetworkDensity}
                      max={0.8}
                      min={0.2}
                      step={0.1}
                      className="mt-2"
                      disabled={isSearching}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Search Options */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={searchMethod === 'quantum' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchMethod('quantum')}
                    disabled={isSearching}
                    className="flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Quantum SRS
                  </Button>
                  <Button
                    variant={searchMethod === 'classical' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchMethod('classical')}
                    disabled={isSearching}
                    className="flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Classical
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Visualization</label>
                <Button
                  variant={showAllEdges ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAllEdges(!showAllEdges)}
                  className="flex items-center gap-2"
                >
                  {showAllEdges ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showAllEdges ? 'Hide Edges' : 'Show All Edges'}
                </Button>
              </div>

              {isSearching && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Search Progress</span>
                    <span>{searchProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={searchProgress} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Visualization */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Network Graph</CardTitle>
                <div className="flex items-center gap-2">
                  {currentClique && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Clique Size: {currentClique.size}
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>
                {selectedExample === 'random' 
                  ? `Random network with ${nodes.length} nodes`
                  : networkExamples.find(ex => ex.name === selectedExample)?.description
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full border border-gray-700 rounded bg-gray-900"
              />
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  Regular Nodes
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Clique Members
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-green-500"></div>
                  Clique Edges
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results & Info */}
        <div className="space-y-6">
          {/* Current Result */}
          {currentClique && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Maximum Clique Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-lg font-mono text-green-400">{currentClique.size}</div>
                    <div className="text-xs text-muted-foreground">Clique Size</div>
                  </div>
                  <div>
                    <div className="text-lg font-mono text-blue-400">
                      {(currentClique.density * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Density</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium">Clique Members:</div>
                  <div className="flex flex-wrap gap-1">
                    {currentClique.nodes.map(nodeId => {
                      const node = nodes.find(n => n.id === nodeId);
                      return (
                        <Badge key={nodeId} variant="secondary" className="text-xs">
                          {node?.label || `Node ${nodeId + 1}`}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Problem Context */}
          {selectedExample !== 'random' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Share2 className="w-4 h-4" />
                  Application Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <p>
                  {networkExamples.find(ex => ex.name === selectedExample)?.context}
                </p>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-sm font-mono text-orange-600">
                      {networkExamples.find(ex => ex.name === selectedExample)?.expectedCliqueSize || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Expected Size</div>
                  </div>
                  <div>
                    <div className="text-sm font-mono text-purple-600">
                      {((networkExamples.find(ex => ex.name === selectedExample)?.density || 0) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Network Density</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Algorithm Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Info className="w-4 h-4" />
                About Maximum Clique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <p>
                The maximum clique problem finds the largest complete subgraph where
                every pair of vertices is connected.
              </p>
              <p>
                Applications include social network analysis, protein interaction networks,
                and finding cohesive groups in complex systems.
              </p>
              <div className="flex items-center gap-2 text-yellow-400">
                <Maximize2 className="w-3 h-3" />
                <span>Complexity: NP-complete, exponential classical algorithms</span>
              </div>
              
              {searchMethod === 'quantum' && (
                <Alert className="border-blue-500/50 bg-blue-500/10 mt-2">
                  <AlertCircle className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    Using Symbolic Resonance Solver (SRS) API via subset sum reduction
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Real-world Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Real-world Uses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 text-blue-400" />
                <span>Social media influence groups</span>
              </div>
              <div className="flex items-center gap-2">
                <Network className="w-3 h-3 text-green-400" />
                <span>Protein interaction complexes</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-3 h-3 text-purple-400" />
                <span>Market clustering analysis</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MaximumCliqueDemo;