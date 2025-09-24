import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import {
  Network,
  Plus,
  Eye,
  BarChart3,
  Database,
  Search,
  Brain,
  Zap,
  GitBranch,
  Layers,
  Target,
  TrendingUp,
  Clock,
  Users,
  Settings,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Activity,
  Sparkles,
  FileText,
  Globe,
  Lock,
  Share
} from 'lucide-react';
import { ConceptGraph, SemanticProject, VectorStore, SemanticAnalytics } from "@/types/qsem";

const QSEMManagement = () => {
  const { toast } = useToast();
  const [conceptGraphs, setConceptGraphs] = useState<ConceptGraph[]>([]);
  const [projects, setProjects] = useState<SemanticProject[]>([]);
  const [vectorStores, setVectorStores] = useState<VectorStore[]>([]);
  const [analytics, setAnalytics] = useState<SemanticAnalytics | null>(null);
  const [selectedGraph, setSelectedGraph] = useState<ConceptGraph | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockGraphs: ConceptGraph[] = [
      {
        id: 'graph_1',
        name: 'Knowledge Base - AI & ML',
        description: 'Comprehensive concept graph covering artificial intelligence and machine learning domains',
        domain: 'technology',
        nodes: [], // Simplified for demo
        relations: [], // Simplified for demo
        metadata: {
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T14:30:00Z',
          version: '1.3.2',
          size: 2847,
          density: 0.23
        },
        status: 'ready',
        visibility: 'shared'
      },
      {
        id: 'graph_2',
        name: 'Medical Ontology',
        description: 'Medical concepts and relationships for healthcare applications',
        domain: 'healthcare',
        nodes: [],
        relations: [],
        metadata: {
          createdAt: '2024-01-12T08:15:00Z',
          updatedAt: '2024-01-19T16:45:00Z',
          version: '2.1.0',
          size: 5234,
          density: 0.31
        },
        status: 'analyzing',
        visibility: 'private'
      },
      {
        id: 'graph_3',
        name: 'Financial Services',
        description: 'Banking, finance, and investment concept relationships',
        domain: 'finance',
        nodes: [],
        relations: [],
        metadata: {
          createdAt: '2024-01-18T16:45:00Z',
          updatedAt: '2024-01-20T10:22:00Z',
          version: '1.0.5',
          size: 1456,
          density: 0.18
        },
        status: 'building',
        visibility: 'public'
      }
    ];

    const mockProjects: SemanticProject[] = [
      {
        id: 'project_1',
        name: 'AI Concept Clustering',
        description: 'Clustering AI-related concepts to identify knowledge gaps',
        type: 'concept-clustering',
        status: 'running',
        graphIds: ['graph_1'],
        config: {
          vectorDimensions: 768,
          similarityThreshold: 0.85,
          clusteringAlgorithm: 'hierarchical',
          embeddingModel: 'sentence-transformer',
          quantumEnhanced: true
        },
        results: {
          clustersFound: 23,
          semanticSimilarity: 0.79,
          extractedConcepts: 147,
          confidence: 0.91
        },
        createdAt: '2024-01-20T09:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z'
      },
      {
        id: 'project_2',
        name: 'Medical Knowledge Extraction',
        description: 'Extracting medical knowledge from research papers',
        type: 'knowledge-extraction',
        status: 'completed',
        graphIds: ['graph_2'],
        config: {
          vectorDimensions: 1024,
          similarityThreshold: 0.82,
          clusteringAlgorithm: 'kmeans',
          embeddingModel: 'openai',
          quantumEnhanced: false
        },
        results: {
          clustersFound: 45,
          semanticSimilarity: 0.84,
          extractedConcepts: 892,
          confidence: 0.87
        },
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-18T14:22:00Z'
      }
    ];

    const mockVectorStores: VectorStore[] = [
      {
        id: 'store_1',
        name: 'Primary Concept Store',
        description: 'Main vector store for concept embeddings',
        type: 'quantum-enhanced',
        dimensions: 768,
        vectorCount: 15847,
        indexType: 'quantum',
        metadata: {
          createdAt: '2024-01-10T09:00:00Z',
          lastIndexed: '2024-01-20T16:00:00Z',
          size: 2340,
          accuracy: 0.94
        },
        config: {
          distanceMetric: 'cosine',
          nProbe: 16,
          efSearch: 256,
          quantumOptimized: true
        },
        status: 'ready',
        usedBy: ['project_1', 'project_2']
      },
      {
        id: 'store_2',
        name: 'Medical Embeddings',
        description: 'Specialized store for medical concept vectors',
        type: 'faiss',
        dimensions: 1024,
        vectorCount: 8934,
        indexType: 'hnsw',
        metadata: {
          createdAt: '2024-01-12T11:30:00Z',
          lastIndexed: '2024-01-19T12:15:00Z',
          size: 1890,
          accuracy: 0.89
        },
        config: {
          distanceMetric: 'euclidean',
          nProbe: 32,
          efSearch: 128,
          quantumOptimized: false
        },
        status: 'indexing',
        usedBy: ['project_2']
      }
    ];

    const mockAnalytics: SemanticAnalytics = {
      totalConcepts: 9537,
      totalRelations: 23456,
      totalProjects: 12,
      totalVectorStores: 4,
      averageGraphSize: 2846,
      conceptGrowth: {
        daily: 23,
        weekly: 189,
        monthly: 734
      },
      topDomains: [
        { domain: 'technology', count: 3247 },
        { domain: 'healthcare', count: 2891 },
        { domain: 'finance', count: 1567 },
        { domain: 'science', count: 1832 }
      ],
      queryStats: {
        totalQueries: 5647,
        averageResponseTime: 127,
        popularQueryTypes: [
          { type: 'similarity', count: 2834 },
          { type: 'concept-search', count: 1892 },
          { type: 'relation-discovery', count: 921 }
        ]
      }
    };

    setTimeout(() => {
      setConceptGraphs(mockGraphs);
      setProjects(mockProjects);
      setVectorStores(mockVectorStores);
      setAnalytics(mockAnalytics);
      setSelectedGraph(mockGraphs[0]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleNewGraph = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Concept graph creation wizard will be available in the next update.",
    });
  };

  const handleNewProject = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Semantic analysis project wizard will be available in the next update.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-500">Ready</Badge>;
      case 'building':
        return <Badge className="bg-blue-500">Building</Badge>;
      case 'analyzing':
        return <Badge className="bg-orange-500">Analyzing</Badge>;
      case 'running':
        return <Badge className="bg-purple-500">Running</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'indexing':
        return <Badge className="bg-yellow-500">Indexing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'building':
      case 'analyzing':
      case 'running':
      case 'indexing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="h-4 w-4 text-blue-500" />;
      case 'shared':
        return <Share className="h-4 w-4 text-green-500" />;
      case 'private':
        return <Lock className="h-4 w-4 text-gray-500" />;
      default:
        return <Lock className="h-4 w-4" />;
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
                  <Network className="h-10 w-10 text-indigo-600" />
                  QSEM Management
                </h1>
                <p className="text-xl text-muted-foreground">
                  Build concept graphs, analyze semantic relationships, and manage vector stores for advanced knowledge systems.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleNewProject}>
                  <Brain className="h-4 w-4 mr-2" />
                  New Project
                </Button>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600" onClick={handleNewGraph}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Graph
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="graphs" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="graphs">Concept Graphs</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="vectors">Vector Stores</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="graphs" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {conceptGraphs.map((graph) => (
                  <Card key={graph.id} className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedGraph(graph)}>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5" />
                    <CardHeader className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(graph.status)}
                          <CardTitle className="text-lg">{graph.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(graph.status)}
                          {getVisibilityIcon(graph.visibility)}
                        </div>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {graph.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">{graph.domain}</Badge>
                        <Badge variant="secondary" className="text-xs">v{graph.metadata.version}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Concepts</p>
                          <p className="font-semibold">{graph.metadata.size.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Density</p>
                          <p className="font-semibold">{(graph.metadata.density * 100).toFixed(1)}%</p>
                        </div>
                      </div>

                      <div className="text-sm">
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{new Date(graph.metadata.updatedAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={(e) => {
                          e.stopPropagation();
                        }}>
                          <Eye className="h-3 w-3 mr-1" />
                          Explore
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                        }}>
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                        }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Brain className="h-5 w-5" />
                            {project.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {project.type.replace('-', ' ')}
                        </Badge>
                        {project.config.quantumEnhanced && (
                          <Badge variant="secondary" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Quantum
                          </Badge>
                        )}
                      </div>

                      {project.results && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Clusters Found</p>
                            <p className="font-semibold">{project.results.clustersFound}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Concepts</p>
                            <p className="font-semibold">{project.results.extractedConcepts}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Similarity</p>
                            <p className="font-semibold">{(project.results.semanticSimilarity * 100).toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Confidence</p>
                            <div className="flex items-center gap-2">
                              <Progress value={project.results.confidence * 100} className="flex-1 h-2" />
                              <span className="text-xs font-medium">
                                {(project.results.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View Results
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vectors" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {vectorStores.map((store) => (
                  <Card key={store.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            {store.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {store.description}
                          </CardDescription>
                        </div>
                        {getStatusBadge(store.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="uppercase">{store.type}</Badge>
                        <Badge variant="secondary" className="text-xs">{store.indexType}</Badge>
                        {store.config.quantumOptimized && (
                          <Badge variant="secondary" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Quantum
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Vectors</p>
                          <p className="font-semibold">{store.vectorCount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Dimensions</p>
                          <p className="font-semibold">{store.dimensions}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p className="font-semibold">{formatFileSize(store.metadata.size * 1024 * 1024)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Accuracy</p>
                          <div className="flex items-center gap-2">
                            <Progress value={store.metadata.accuracy * 100} className="flex-1 h-2" />
                            <span className="text-xs font-medium">
                              {(store.metadata.accuracy * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm">
                        <p className="text-muted-foreground">Used by projects:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {store.usedBy.slice(0, 3).map((projectId) => (
                            <Badge key={projectId} variant="outline" className="text-xs">
                              {projects.find(p => p.id === projectId)?.name || projectId}
                            </Badge>
                          ))}
                          {store.usedBy.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{store.usedBy.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Search className="h-3 w-3 mr-1" />
                          Query
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {analytics && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Concepts</p>
                            <p className="text-2xl font-bold">{analytics.totalConcepts.toLocaleString()}</p>
                          </div>
                          <Network className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Relations</p>
                            <p className="text-2xl font-bold text-blue-600">{analytics.totalRelations.toLocaleString()}</p>
                          </div>
                          <GitBranch className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Projects</p>
                            <p className="text-2xl font-bold text-green-600">{analytics.totalProjects}</p>
                          </div>
                          <Brain className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Vector Stores</p>
                            <p className="text-2xl font-bold text-purple-600">{analytics.totalVectorStores}</p>
                          </div>
                          <Database className="h-8 w-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Concept Growth
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Daily</span>
                            <span className="font-semibold">+{analytics.conceptGrowth.daily}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Weekly</span>
                            <span className="font-semibold">+{analytics.conceptGrowth.weekly}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Monthly</span>
                            <span className="font-semibold">+{analytics.conceptGrowth.monthly}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Popular Domains
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analytics.topDomains.map((domain) => (
                            <div key={domain.domain} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{domain.domain}</span>
                              <Badge variant="secondary">{domain.count.toLocaleString()}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </PageLayout>
  );
};

export default QSEMManagement;