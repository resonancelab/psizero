
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Target, 
  MapPin, 
  Binary, 
  Network, 
  CircuitBoard, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Shuffle,
  Save,
  Upload,
  Download,
  RotateCcw
} from 'lucide-react';

interface TSPConfig {
  numCities: number;
  layout: 'random' | 'circular' | 'clustered' | 'grid';
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  seed: number;
  useRealCities: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SubsetSumConfig {
  numElements: number;
  valueRange: { min: number; max: number };
  targetPercentage: number;
  density: number;
  useCryptographic: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'cryptographic';
}

interface MaxCliqueConfig {
  numNodes: number;
  edgeProbability: number;
  networkType: 'random' | 'social' | 'research' | 'biological';
  ensureClique: boolean;
  minCliqueSize: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SATConfig {
  numVariables: number;
  numClauses: number;
  clauseLength: number;
  satisfiabilityRatio: number;
  useCircuitExample: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'random';
}

interface OptimizationConstraints {
  maxIterations: number;
  timeLimit: number; // seconds
  targetQuality: number; // percentage
  convergenceThreshold: number;
  memoryLimit: number; // MB
  enableEarlyStop: boolean;
}

type ProblemConfig = TSPConfig | SubsetSumConfig | MaxCliqueConfig | SATConfig;

interface ProblemPreset {
  name: string;
  description: string;
  category: string;
  config: ProblemConfig;
  constraints: OptimizationConstraints;
  expectedDifficulty: number; // 1-5 scale
}

interface ProblemConfigurationProps {
  problemType: 'TSP' | 'SubsetSum' | 'MaxClique' | '3SAT';
  onConfigChange?: (config: ProblemConfig, constraints: OptimizationConstraints) => void;
  onGenerate?: (config: ProblemConfig, constraints: OptimizationConstraints) => void;
  onSave?: (preset: ProblemPreset) => void;
  onLoad?: (preset: ProblemPreset) => void;
}

export const ProblemConfiguration: React.FC<ProblemConfigurationProps> = ({
  problemType,
  onConfigChange,
  onGenerate,
  onSave,
  onLoad
}) => {
  const [activeTab, setActiveTab] = useState('parameters');
  const [tspConfig, setTSPConfig] = useState<TSPConfig>({
    numCities: 15,
    layout: 'random',
    bounds: { minX: 0, maxX: 800, minY: 0, maxY: 600 },
    seed: 12345,
    useRealCities: false,
    difficulty: 'medium'
  });
  
  const [subsetConfig, setSubsetConfig] = useState<SubsetSumConfig>({
    numElements: 12,
    valueRange: { min: 1, max: 100 },
    targetPercentage: 50,
    density: 0.6,
    useCryptographic: false,
    difficulty: 'medium'
  });
  
  const [cliqueConfig, setCliqueConfig] = useState<MaxCliqueConfig>({
    numNodes: 12,
    edgeProbability: 0.4,
    networkType: 'random',
    ensureClique: true,
    minCliqueSize: 3,
    difficulty: 'medium'
  });
  
  const [satConfig, setSATConfig] = useState<SATConfig>({
    numVariables: 8,
    numClauses: 12,
    clauseLength: 3,
    satisfiabilityRatio: 4.2,
    useCircuitExample: false,
    difficulty: 'medium'
  });
  
  const [constraints, setConstraints] = useState<OptimizationConstraints>({
    maxIterations: 1000,
    timeLimit: 60,
    targetQuality: 90,
    convergenceThreshold: 0.01,
    memoryLimit: 512,
    enableEarlyStop: true
  });

  const [presetName, setPresetName] = useState('');
  const [estimatedDifficulty, setEstimatedDifficulty] = useState(3);

  // Problem presets
  const presets: Record<string, ProblemPreset[]> = {
    TSP: [
      {
        name: 'Small Tour',
        description: 'Quick demo with 8 cities',
        category: 'demo',
        config: { ...tspConfig, numCities: 8, difficulty: 'easy' },
        constraints: { ...constraints, maxIterations: 500, timeLimit: 30 },
        expectedDifficulty: 1
      },
      {
        name: 'Regional Sales',
        description: 'Medium complexity with 25 cities',
        category: 'business',
        config: { ...tspConfig, numCities: 25, layout: 'clustered', difficulty: 'medium' },
        constraints: { ...constraints, maxIterations: 2000, timeLimit: 120 },
        expectedDifficulty: 3
      },
      {
        name: 'Continental Route',
        description: 'Large-scale optimization with 50+ cities',
        category: 'research',
        config: { ...tspConfig, numCities: 50, useRealCities: true, difficulty: 'hard' },
        constraints: { ...constraints, maxIterations: 5000, timeLimit: 300 },
        expectedDifficulty: 5
      }
    ],
    SubsetSum: [
      {
        name: 'Basic Subset',
        description: 'Simple subset sum problem',
        category: 'demo',
        config: { ...subsetConfig, numElements: 8, difficulty: 'easy' },
        constraints: { ...constraints, maxIterations: 300, timeLimit: 20 },
        expectedDifficulty: 2
      },
      {
        name: 'Knapsack Crypto',
        description: 'Cryptographic application',
        category: 'security',
        config: { ...subsetConfig, numElements: 16, useCryptographic: true, difficulty: 'cryptographic' },
        constraints: { ...constraints, maxIterations: 3000, timeLimit: 180 },
        expectedDifficulty: 4
      }
    ],
    MaxClique: [
      {
        name: 'Small Network',
        description: 'Social network clique detection',
        category: 'demo',
        config: { ...cliqueConfig, numNodes: 10, networkType: 'social', difficulty: 'easy' },
        constraints: { ...constraints, maxIterations: 400, timeLimit: 40 },
        expectedDifficulty: 2
      },
      {
        name: 'Research Collaboration',
        description: 'Academic collaboration network',
        category: 'academic',
        config: { ...cliqueConfig, numNodes: 20, networkType: 'research', difficulty: 'medium' },
        constraints: { ...constraints, maxIterations: 1500, timeLimit: 100 },
        expectedDifficulty: 3
      }
    ],
    '3SAT': [
      {
        name: 'Logic Gates',
        description: 'Simple circuit verification',
        category: 'demo',
        config: { ...satConfig, numVariables: 6, useCircuitExample: true, difficulty: 'easy' },
        constraints: { ...constraints, maxIterations: 200, timeLimit: 15 },
        expectedDifficulty: 2
      },
      {
        name: 'CPU Verification',
        description: 'Processor design verification',
        category: 'hardware',
        config: { ...satConfig, numVariables: 15, satisfiabilityRatio: 4.5, difficulty: 'hard' },
        constraints: { ...constraints, maxIterations: 2500, timeLimit: 150 },
        expectedDifficulty: 4
      }
    ]
  };

  // Calculate estimated difficulty
  useEffect(() => {
    let difficulty = 1;
    
    switch (problemType) {
      case 'TSP':
        difficulty = Math.min(5, 1 + Math.log2(tspConfig.numCities / 8));
        break;
      case 'SubsetSum':
        difficulty = Math.min(5, 1 + Math.log2(subsetConfig.numElements / 6));
        if (subsetConfig.useCryptographic) difficulty += 1;
        break;
      case 'MaxClique':
        difficulty = Math.min(5, 1 + Math.log2(cliqueConfig.numNodes / 8) + cliqueConfig.edgeProbability);
        break;
      case '3SAT':
        difficulty = Math.min(5, 1 + Math.log2(satConfig.numVariables / 6));
        if (satConfig.satisfiabilityRatio > 4.0) difficulty += 0.5;
        break;
    }
    
    setEstimatedDifficulty(Math.round(difficulty * 2) / 2);
  }, [problemType, tspConfig, subsetConfig, cliqueConfig, satConfig]);

  // Notify parent of config changes
  useEffect(() => {
    let config;
    switch (problemType) {
      case 'TSP': config = tspConfig; break;
      case 'SubsetSum': config = subsetConfig; break;
      case 'MaxClique': config = cliqueConfig; break;
      case '3SAT': config = satConfig; break;
    }
    onConfigChange?.(config, constraints);
  }, [problemType, tspConfig, subsetConfig, cliqueConfig, satConfig, constraints, onConfigChange]);

  const getCurrentConfig = () => {
    switch (problemType) {
      case 'TSP': return tspConfig;
      case 'SubsetSum': return subsetConfig;
      case 'MaxClique': return cliqueConfig;
      case '3SAT': return satConfig;
    }
  };

  const generateRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 100000);
    if (problemType === 'TSP') {
      setTSPConfig(prev => ({ ...prev, seed: newSeed }));
    }
  };

  const loadPreset = (preset: ProblemPreset) => {
    switch (problemType) {
      case 'TSP':
        setTSPConfig(preset.config as TSPConfig);
        break;
      case 'SubsetSum':
        setSubsetConfig(preset.config as SubsetSumConfig);
        break;
      case 'MaxClique':
        setCliqueConfig(preset.config as MaxCliqueConfig);
        break;
      case '3SAT':
        setSATConfig(preset.config as SATConfig);
        break;
    }
    setConstraints(preset.constraints);
    onLoad?.(preset);
  };

  const saveCurrentAsPreset = () => {
    if (!presetName.trim()) return;
    
    const preset: ProblemPreset = {
      name: presetName,
      description: 'Custom configuration',
      category: 'custom',
      config: getCurrentConfig(),
      constraints,
      expectedDifficulty: estimatedDifficulty
    };
    
    onSave?.(preset);
    setPresetName('');
  };

  const renderDifficultyIndicator = () => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400">Difficulty:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(level => (
          <div
            key={level}
            className={`w-3 h-3 rounded-full ${
              level <= estimatedDifficulty 
                ? level <= 2 ? 'bg-green-500' 
                  : level <= 3 ? 'bg-yellow-500'
                  : 'bg-red-500'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
      <Badge variant={
        estimatedDifficulty <= 2 ? 'secondary' :
        estimatedDifficulty <= 3 ? 'default' : 'destructive'
      }>
        {estimatedDifficulty <= 2 ? 'Easy' :
         estimatedDifficulty <= 3 ? 'Medium' :
         estimatedDifficulty <= 4 ? 'Hard' : 'Expert'}
      </Badge>
    </div>
  );

  const renderTSPConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Number of Cities: {tspConfig.numCities}</Label>
            <Slider
              value={[tspConfig.numCities]}
              onValueChange={([value]) => setTSPConfig(prev => ({ ...prev, numCities: value }))}
              min={4}
              max={100}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>City Layout</Label>
            <Select 
              value={tspConfig.layout} 
              onValueChange={(value) => setTSPConfig(prev => ({ ...prev, layout: value as TSPConfig['layout'] }))}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Random Distribution</SelectItem>
                <SelectItem value="circular">Circular Pattern</SelectItem>
                <SelectItem value="clustered">Clustered Regions</SelectItem>
                <SelectItem value="grid">Grid Layout</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={tspConfig.useRealCities}
              onCheckedChange={(checked) => setTSPConfig(prev => ({ ...prev, useRealCities: checked }))}
            />
            <Label>Use Real City Coordinates</Label>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Random Seed</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                value={tspConfig.seed}
                onChange={(e) => setTSPConfig(prev => ({ ...prev, seed: parseInt(e.target.value) || 0 }))}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={generateRandomSeed}>
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min X: {tspConfig.bounds.minX}</Label>
              <Slider
                value={[tspConfig.bounds.minX]}
                onValueChange={([value]) => setTSPConfig(prev => ({
                  ...prev,
                  bounds: { ...prev.bounds, minX: value }
                }))}
                min={0}
                max={400}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Max X: {tspConfig.bounds.maxX}</Label>
              <Slider
                value={[tspConfig.bounds.maxX]}
                onValueChange={([value]) => setTSPConfig(prev => ({
                  ...prev,
                  bounds: { ...prev.bounds, maxX: value }
                }))}
                min={400}
                max={1200}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubsetSumConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Number of Elements: {subsetConfig.numElements}</Label>
            <Slider
              value={[subsetConfig.numElements]}
              onValueChange={([value]) => setSubsetConfig(prev => ({ ...prev, numElements: value }))}
              min={4}
              max={20}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Target Percentage: {subsetConfig.targetPercentage}%</Label>
            <Slider
              value={[subsetConfig.targetPercentage]}
              onValueChange={([value]) => setSubsetConfig(prev => ({ ...prev, targetPercentage: value }))}
              min={20}
              max={80}
              step={5}
              className="mt-2"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={subsetConfig.useCryptographic}
              onCheckedChange={(checked) => setSubsetConfig(prev => ({ ...prev, useCryptographic: checked }))}
            />
            <Label>Use Cryptographic Examples</Label>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min Value</Label>
              <Input
                type="number"
                value={subsetConfig.valueRange.min}
                onChange={(e) => setSubsetConfig(prev => ({
                  ...prev,
                  valueRange: { ...prev.valueRange, min: parseInt(e.target.value) || 1 }
                }))}
                min={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Max Value</Label>
              <Input
                type="number"
                value={subsetConfig.valueRange.max}
                onChange={(e) => setSubsetConfig(prev => ({
                  ...prev,
                  valueRange: { ...prev.valueRange, max: parseInt(e.target.value) || 100 }
                }))}
                min={subsetConfig.valueRange.min}
                className="mt-2"
              />
            </div>
          </div>
          
          <div>
            <Label>Solution Density: {(subsetConfig.density * 100).toFixed(0)}%</Label>
            <Slider
              value={[subsetConfig.density]}
              onValueChange={([value]) => setSubsetConfig(prev => ({ ...prev, density: value }))}
              min={0.2}
              max={0.8}
              step={0.1}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaxCliqueConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Number of Nodes: {cliqueConfig.numNodes}</Label>
            <Slider
              value={[cliqueConfig.numNodes]}
              onValueChange={([value]) => setCliqueConfig(prev => ({ ...prev, numNodes: value }))}
              min={6}
              max={25}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Edge Probability: {(cliqueConfig.edgeProbability * 100).toFixed(0)}%</Label>
            <Slider
              value={[cliqueConfig.edgeProbability]}
              onValueChange={([value]) => setCliqueConfig(prev => ({ ...prev, edgeProbability: value }))}
              min={0.1}
              max={0.8}
              step={0.05}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Network Type</Label>
            <Select 
              value={cliqueConfig.networkType} 
              onValueChange={(value) => setCliqueConfig(prev => ({ ...prev, networkType: value as MaxCliqueConfig['networkType'] }))}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Random Network</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="research">Research Collaboration</SelectItem>
                <SelectItem value="biological">Biological Network</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Minimum Clique Size: {cliqueConfig.minCliqueSize}</Label>
            <Slider
              value={[cliqueConfig.minCliqueSize]}
              onValueChange={([value]) => setCliqueConfig(prev => ({ ...prev, minCliqueSize: value }))}
              min={2}
              max={8}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={cliqueConfig.ensureClique}
              onCheckedChange={(checked) => setCliqueConfig(prev => ({ ...prev, ensureClique: checked }))}
            />
            <Label>Guarantee Solution Exists</Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSATConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Number of Variables: {satConfig.numVariables}</Label>
            <Slider
              value={[satConfig.numVariables]}
              onValueChange={([value]) => setSATConfig(prev => ({ ...prev, numVariables: value }))}
              min={3}
              max={20}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Number of Clauses: {satConfig.numClauses}</Label>
            <Slider
              value={[satConfig.numClauses]}
              onValueChange={([value]) => setSATConfig(prev => ({ ...prev, numClauses: value }))}
              min={satConfig.numVariables}
              max={satConfig.numVariables * 6}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={satConfig.useCircuitExample}
              onCheckedChange={(checked) => setSATConfig(prev => ({ ...prev, useCircuitExample: checked }))}
            />
            <Label>Use Circuit Design Examples</Label>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Satisfiability Ratio: {satConfig.satisfiabilityRatio.toFixed(1)}</Label>
            <Slider
              value={[satConfig.satisfiabilityRatio]}
              onValueChange={([value]) => setSATConfig(prev => ({ ...prev, satisfiabilityRatio: value }))}
              min={2.0}
              max={6.0}
              step={0.1}
              className="mt-2"
            />
            <div className="text-xs text-gray-400 mt-1">
              Higher ratios are typically harder to satisfy (phase transition ~4.2)
            </div>
          </div>
          
          <div>
            <Label>Clause Length: {satConfig.clauseLength}</Label>
            <Slider
              value={[satConfig.clauseLength]}
              onValueChange={([value]) => setSATConfig(prev => ({ ...prev, clauseLength: value }))}
              min={2}
              max={5}
              step={1}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderConstraints = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Max Iterations: {constraints.maxIterations.toLocaleString()}</Label>
            <Slider
              value={[constraints.maxIterations]}
              onValueChange={([value]) => setConstraints(prev => ({ ...prev, maxIterations: value }))}
              min={100}
              max={10000}
              step={100}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Time Limit: {constraints.timeLimit}s</Label>
            <Slider
              value={[constraints.timeLimit]}
              onValueChange={([value]) => setConstraints(prev => ({ ...prev, timeLimit: value }))}
              min={10}
              max={600}
              step={10}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Target Quality: {constraints.targetQuality}%</Label>
            <Slider
              value={[constraints.targetQuality]}
              onValueChange={([value]) => setConstraints(prev => ({ ...prev, targetQuality: value }))}
              min={50}
              max={99}
              step={1}
              className="mt-2"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Convergence Threshold: {constraints.convergenceThreshold}</Label>
            <Slider
              value={[constraints.convergenceThreshold]}
              onValueChange={([value]) => setConstraints(prev => ({ ...prev, convergenceThreshold: value }))}
              min={0.001}
              max={0.1}
              step={0.001}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Memory Limit: {constraints.memoryLimit}MB</Label>
            <Slider
              value={[constraints.memoryLimit]}
              onValueChange={([value]) => setConstraints(prev => ({ ...prev, memoryLimit: value }))}
              min={128}
              max={2048}
              step={128}
              className="mt-2"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={constraints.enableEarlyStop}
              onCheckedChange={(checked) => setConstraints(prev => ({ ...prev, enableEarlyStop: checked }))}
            />
            <Label>Enable Early Stopping</Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPresets = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets[problemType]?.map((preset, index) => (
          <Card key={index} className="cursor-pointer hover:border-blue-500/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{preset.name}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {preset.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">{preset.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= preset.expectedDifficulty 
                            ? level <= 2 ? 'bg-green-500' 
                              : level <= 3 ? 'bg-yellow-500'
                              : 'bg-red-500'
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => loadPreset(preset)}
                    className="text-xs"
                  >
                    Load
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Save Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={saveCurrentAsPreset}
              disabled={!presetName.trim()}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getIcon = () => {
    switch (problemType) {
      case 'TSP':
        return <MapPin className="w-5 h-5" />;
      case 'SubsetSum':
        return <Binary className="w-5 h-5" />;
      case 'MaxClique':
        return <Network className="w-5 h-5" />;
      case '3SAT':
        return <CircuitBoard className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  const getProblemName = () => {
    switch (problemType) {
      case 'TSP':
        return 'Traveling Salesman Problem';
      case 'SubsetSum':
        return 'Subset Sum Problem';
      case 'MaxClique':
        return 'Maximum Clique Problem';
      case '3SAT':
        return '3-SAT Problem';
      default:
        return 'Optimization Problem';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getIcon()}
                {getProblemName()} Configuration
              </CardTitle>
              <CardDescription>
                Configure problem parameters and optimization constraints
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              {renderDifficultyIndicator()}
              <Button
                onClick={() => onGenerate?.(getCurrentConfig(), constraints)}
                className="flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Generate Problem
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parameters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Problem Parameters</CardTitle>
              <CardDescription>
                Configure the specific parameters for the {problemType} problem
              </CardDescription>
            </CardHeader>
            <CardContent>
              {problemType === 'TSP' && renderTSPConfig()}
              {problemType === 'SubsetSum' && renderSubsetSumConfig()}
              {problemType === 'MaxClique' && renderMaxCliqueConfig()}
              {problemType === '3SAT' && renderSATConfig()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="constraints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Optimization Constraints</CardTitle>
              <CardDescription>
                Set limits and stopping criteria for the optimization process
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderConstraints()}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="w-4 h-4" />
                Performance Estimates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-mono text-blue-400">
                    ~{Math.round(constraints.maxIterations * (estimatedDifficulty / 5) * 0.1)}
                  </div>
                  <div className="text-xs text-gray-400">Expected Iterations</div>
                </div>
                
                <div>
                  <div className="text-lg font-mono text-green-400">
                    ~{Math.round(constraints.timeLimit * (estimatedDifficulty / 5) * 0.3)}s
                  </div>
                  <div className="text-xs text-gray-400">Expected Time</div>
                </div>
                
                <div>
                  <div className="text-lg font-mono text-purple-400">
                    ~{Math.round(constraints.memoryLimit * (estimatedDifficulty / 5) * 0.2)}MB
                  </div>
                  <div className="text-xs text-gray-400">Expected Memory</div>
                </div>
              </div>
              
              {estimatedDifficulty >= 4 && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-400">
                    High difficulty problem - consider increasing resource limits
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="presets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Problem Presets</CardTitle>
              <CardDescription>
                Load predefined configurations or save your custom settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderPresets()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProblemConfiguration;