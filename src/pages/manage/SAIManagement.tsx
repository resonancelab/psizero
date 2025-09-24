
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import {
  Brain,
  Plus,
  Play,
  Pause,
  Square,
  Upload,
  Download,
  Settings,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  Clock,
  Zap,
  Database,
  FileText,
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Target,
  Users,
  Sparkles,
  LineChart,
  PieChart,
  Monitor
} from 'lucide-react';

interface SymbolicEngine {
  id: string;
  name: string;
  description?: string;
  status: 'idle' | 'training' | 'inference' | 'error';
  createdAt: string;
  lastUsed?: string;
  config: {
    primeBasis: string;
    symbolMappingSize: number;
    entropyThreshold: number;
    temperatureDynamics: boolean;
    collaborativeMode: boolean;
  };
  training?: {
    currentEpoch: number;
    totalEpochs: number;
    loss: number;
    accuracy: number;
    startTime: string;
    estimatedCompletion?: string;
  };
  performance: {
    totalInferences: number;
    averageResponseTime: number;
    successRate: number;
    lastWeekUsage: number;
  };
  datasets: string[];
}

interface TrainingJob {
  id: string;
  engineId: string;
  engineName: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  startTime: string;
  estimatedCompletion?: string;
  metrics: {
    loss: number;
    accuracy: number;
    epoch: number;
    totalEpochs: number;
  };
}

interface Dataset {
  id: string;
  name: string;
  description?: string;
  size: number;
  format: 'text' | 'json' | 'csv';
  uploadedAt: string;
  usedBy: string[];
}

const SAIManagement = () => {
  const { toast } = useToast();
  const [engines, setEngines] = useState<SymbolicEngine[]>([]);
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedEngine, setSelectedEngine] = useState<SymbolicEngine | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDatasetDialog, setShowDatasetDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load real data from API
  useEffect(() => {
    const fetchSAIData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch engines
        const enginesResponse = await fetch('/api/sai/engines', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (enginesResponse.ok) {
          const enginesData = await enginesResponse.json();
          setEngines(enginesData);
          if (enginesData.length > 0) {
            setSelectedEngine(enginesData[0]);
          }
        }

        // Fetch training jobs
        const jobsResponse = await fetch('/api/sai/training-jobs', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setTrainingJobs(jobsData);
        }

        // Fetch datasets
        const datasetsResponse = await fetch('/api/sai/datasets', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (datasetsResponse.ok) {
          const datasetsData = await datasetsResponse.json();
          setDatasets(datasetsData);
        }
      } catch (error) {
        console.error('Failed to fetch SAI data:', error);
        toast({
          title: "Error",
          description: "Failed to load SAI data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSAIData();
  }, []);

  // Simulate training progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEngines(prevEngines =>
        prevEngines.map(engine => {
          if (engine.status === 'training' && engine.training) {
            const newEpoch = Math.min(engine.training.totalEpochs, engine.training.currentEpoch + 1);
            const progress = newEpoch / engine.training.totalEpochs;
            return {
              ...engine,
              training: {
                ...engine.training,
                currentEpoch: newEpoch,
                loss: Math.max(0.1, engine.training.loss - Math.random() * 0.01),
                accuracy: Math.min(0.99, engine.training.accuracy + Math.random() * 0.005)
              }
            };
          }
          return engine;
        })
      );

      setTrainingJobs(prevJobs =>
        prevJobs.map(job => {
          if (job.status === 'running') {
            const newProgress = Math.min(100, job.progress + Math.random() * 2);
            return {
              ...job,
              progress: newProgress,
              metrics: {
                ...job.metrics,
                epoch: Math.floor((newProgress / 100) * job.metrics.totalEpochs),
                loss: Math.max(0.1, job.metrics.loss - Math.random() * 0.01),
                accuracy: Math.min(0.99, job.metrics.accuracy + Math.random() * 0.005)
              }
            };
          }
          return job;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateEngine = async () => {
    try {
      const response = await fetch('/api/sai/engines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: 'New Engine',
          description: 'Symbolic AI Engine',
          config: {
            primeBasis: 'ascending',
            symbolMappingSize: 10000,
            entropyThreshold: 0.95,
            temperatureDynamics: true,
            collaborativeMode: false
          }
        })
      });

      if (response.ok) {
        const newEngine = await response.json();
        setEngines(prev => [...prev, newEngine]);
        toast({
          title: "Engine Created",
          description: "New symbolic AI engine has been created successfully.",
        });
      } else {
        throw new Error('Failed to create engine');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create engine. Please try again.",
        variant: "destructive",
      });
    }
    setShowCreateDialog(false);
  };

  const handleStartTraining = async (engineId: string) => {
    try {
      const response = await fetch(`/api/sai/engines/${engineId}/training/start`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setEngines(prevEngines =>
          prevEngines.map(engine =>
            engine.id === engineId
              ? { ...engine, status: 'training' as const }
              : engine
          )
        );
        toast({
          title: "Training Started",
          description: "Symbolic AI engine training has begun.",
        });
      } else {
        throw new Error('Failed to start training');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start training. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStopTraining = async (engineId: string) => {
    try {
      const response = await fetch(`/api/sai/engines/${engineId}/training/stop`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setEngines(prevEngines =>
          prevEngines.map(engine =>
            engine.id === engineId
              ? { ...engine, status: 'idle' as const }
              : engine
          )
        );
        toast({
          title: "Training Stopped",
          description: "Training process has been halted.",
        });
      } else {
        throw new Error('Failed to stop training');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop training. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEngine = async (engineId: string) => {
    try {
      const response = await fetch(`/api/sai/engines/${engineId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setEngines(prevEngines => prevEngines.filter(engine => engine.id !== engineId));
        toast({
          title: "Engine Deleted",
          description: "Symbolic AI engine has been permanently removed.",
        });
      } else {
        throw new Error('Failed to delete engine');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete engine. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'training':
        return <Badge className="bg-blue-500">Training</Badge>;
      case 'inference':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'idle':
        return <Badge variant="secondary">Idle</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'training':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'inference':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'idle':
        return <Pause className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Section>
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Section>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Brain className="h-10 w-10 text-emerald-600" />
                  SAI Management
                </h1>
                <p className="text-xl text-muted-foreground">
                  Create, train, and manage symbolic AI engines with prime-based learning capabilities.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Dialog open={showDatasetDialog} onOpenChange={setShowDatasetDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Dataset
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Training Dataset</DialogTitle>
                      <DialogDescription>
                        Upload data for training symbolic AI engines
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="datasetName">Dataset Name</Label>
                        <Input id="datasetName" placeholder="Enter dataset name" />
                      </div>
                      <div>
                        <Label htmlFor="datasetDesc">Description</Label>
                        <Textarea id="datasetDesc" placeholder="Describe the dataset" />
                      </div>
                      <div>
                        <Label htmlFor="datasetFile">File Upload</Label>
                        <Input id="datasetFile" type="file" accept=".txt,.json,.csv" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowDatasetDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowDatasetDialog(false)}>
                        Upload
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Engine
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Symbolic AI Engine</DialogTitle>
                      <DialogDescription>
                        Configure a new symbolic AI engine for text processing and pattern recognition
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="engineName">Engine Name</Label>
                          <Input id="engineName" placeholder="Enter engine name" />
                        </div>
                        <div>
                          <Label htmlFor="primeBasis">Prime Basis</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select prime basis" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ascending">Ascending</SelectItem>
                              <SelectItem value="learned">Learned</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="engineDesc">Description</Label>
                        <Textarea id="engineDesc" placeholder="Describe the engine's purpose" />
                      </div>

                      <div className="space-y-4">
                        <Label>Configuration</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="symbolSize">Symbol Mapping Size</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10000">10,000</SelectItem>
                                <SelectItem value="25000">25,000</SelectItem>
                                <SelectItem value="50000">50,000</SelectItem>
                                <SelectItem value="100000">100,000</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="entropyThreshold">Entropy Threshold</Label>
                            <div className="pt-2">
                              <Slider defaultValue={[0.95]} max={1} min={0.8} step={0.01} />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Temperature Dynamics</Label>
                            <p className="text-sm text-muted-foreground">Enable adaptive temperature control</p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Collaborative Mode</Label>
                            <p className="text-sm text-muted-foreground">Allow multi-user training</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateEngine}>
                        Create Engine
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <Tabs defaultValue="engines" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="engines">Engines</TabsTrigger>
              <TabsTrigger value="training">Training Jobs</TabsTrigger>
              <TabsTrigger value="datasets">Datasets</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="engines" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {engines.map((engine) => (
                  <Card key={engine.id} className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedEngine(engine)}>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5" />
                    <CardHeader className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(engine.status)}
                          <CardTitle className="text-lg">{engine.name}</CardTitle>
                        </div>
                        {getStatusBadge(engine.status)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {engine.description || 'No description provided'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      {engine.training && engine.status === 'training' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Training Progress</span>
                            <span>{engine.training.currentEpoch}/{engine.training.totalEpochs}</span>
                          </div>
                          <Progress value={(engine.training.currentEpoch / engine.training.totalEpochs) * 100} />
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-muted-foreground">Loss:</span>
                              <span className="font-semibold ml-1">{engine.training.loss.toFixed(3)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Accuracy:</span>
                              <span className="font-semibold ml-1">{(engine.training.accuracy * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Inferences</p>
                          <p className="font-semibold">{engine.performance.totalInferences.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Success Rate</p>
                          <p className="font-semibold">{(engine.performance.successRate * 100).toFixed(1)}%</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {engine.status === 'idle' && (
                          <Button size="sm" className="flex-1" onClick={(e) => {
                            e.stopPropagation();
                            handleStartTraining(engine.id);
                          }}>
                            <Play className="h-3 w-3 mr-1" />
                            Train
                          </Button>
                        )}
                        {engine.status === 'training' && (
                          <Button size="sm" variant="outline" className="flex-1" onClick={(e) => {
                            e.stopPropagation();
                            handleStopTraining(engine.id);
                          }}>
                            <Square className="h-3 w-3 mr-1" />
                            Stop
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                        }}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                        }}>
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEngine(engine.id);
                        }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="training" className="space-y-6">
              <div className="space-y-4">
                {trainingJobs.map((job) => (
                  <Card key={job.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{job.engineName}</CardTitle>
                          <CardDescription>
                            Started {new Date(job.startTime).toLocaleString()}
                            {job.estimatedCompletion && ` • ETA: ${job.estimatedCompletion}`}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(job.status)}
                          <Button size="sm" variant="outline">
                            <Pause className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Square className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Training Progress</span>
                            <span>{job.metrics.epoch}/{job.metrics.totalEpochs} epochs</span>
                          </div>
                          <Progress value={job.progress} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Loss</p>
                            <p className="text-lg font-semibold">{job.metrics.loss.toFixed(3)}</p>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Accuracy</p>
                            <p className="text-lg font-semibold">{(job.metrics.accuracy * 100).toFixed(1)}%</p>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Epoch</p>
                            <p className="text-lg font-semibold">{job.metrics.epoch}</p>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Progress</p>
                            <p className="text-lg font-semibold">{job.progress.toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {trainingJobs.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No active training jobs. Start training an engine to see progress here.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="datasets" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {datasets.map((dataset) => (
                  <Card key={dataset.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            {dataset.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {dataset.description || 'No description provided'}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="uppercase">
                          {dataset.format}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p className="font-semibold">{formatFileSize(dataset.size)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Uploaded</p>
                          <p className="font-semibold">{new Date(dataset.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Used by engines:</p>
                        <div className="flex flex-wrap gap-1">
                          {dataset.usedBy.map((engineId) => {
                            const engine = engines.find(e => e.id === engineId);
                            return engine ? (
                              <Badge key={engineId} variant="secondary" className="text-xs">
                                {engine.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {selectedEngine && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5" />
                        Training Metrics
                      </CardTitle>
                      <CardDescription>
                        Real-time training performance for {selectedEngine.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">Current Loss</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {selectedEngine.training?.loss.toFixed(3) || 'N/A'}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">Accuracy</p>
                            <p className="text-2xl font-bold text-green-600">
                              {selectedEngine.training ? `${(selectedEngine.training.accuracy * 100).toFixed(1)}%` : 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Training Progress</p>
                          <div className="flex items-center gap-4">
                            <Progress
                              value={selectedEngine.training ? (selectedEngine.training.currentEpoch / selectedEngine.training.totalEpochs) * 100 : 0}
                              className="flex-1"
                            />
                            <span className="text-sm font-medium">
                              {selectedEngine.training ? `${selectedEngine.training.currentEpoch}/${selectedEngine.training.totalEpochs}` : '0/0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Performance Analytics
                      </CardTitle>
                      <CardDescription>
                        Usage statistics and performance metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">Total Inferences</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {selectedEngine.performance.totalInferences.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">Success Rate</p>
                            <p className="text-2xl font-bold text-orange-600">
                              {(selectedEngine.performance.successRate * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Avg Response Time</span>
                            <span className="font-semibold">{selectedEngine.performance.averageResponseTime}ms</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">This Week Usage</span>
                            <span className="font-semibold">{selectedEngine.performance.lastWeekUsage}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Prime Basis</span>
                            <Badge variant="outline">{selectedEngine.config.primeBasis}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        Configuration Overview
                      </CardTitle>
                      <CardDescription>
                        Current engine configuration and settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Core Settings</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Symbol Mapping</span>
                              <span className="font-medium">{selectedEngine.config.symbolMappingSize.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Entropy Threshold</span>
                              <span className="font-medium">{selectedEngine.config.entropyThreshold}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Feature Flags</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Temperature Dynamics</span>
                              <Badge variant={selectedEngine.config.temperatureDynamics ? "default" : "secondary"}>
                                {selectedEngine.config.temperatureDynamics ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Collaborative Mode</span>
                              <Badge variant={selectedEngine.config.collaborativeMode ? "default" : "secondary"}>
                                {selectedEngine.config.collaborativeMode ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Datasets</h4>
                          <div className="space-y-1">
                            {selectedEngine.datasets.map((datasetId) => {
                              const dataset = datasets.find(d => d.id === datasetId);
                              return dataset ? (
                                <Badge key={datasetId} variant="outline" className="text-xs mr-1 mb-1">
                                  {dataset.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {!selectedEngine && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select an engine to view detailed analytics and performance metrics.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </PageLayout>
  );
};

export default SAIManagement;