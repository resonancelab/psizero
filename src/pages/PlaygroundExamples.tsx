import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { PlaygroundExample } from '@/types/playground';
import { usePlaygroundExamples, useFeaturedExamples } from '@/hooks/usePlaygroundExamples';
import {
  Play,
  Code,
  Rocket,
  Sparkles,
  Network,
  Brain,
  Cpu,
  MessageSquare,
  Circle,
  Database,
  BookOpen,
  Zap,
  GitBranch,
  Target,
  Users,
  Clock,
  Award,
  Eye,
  Copy,
  ExternalLink
} from 'lucide-react';

const PlaygroundExamples = () => {
  const [selectedExample, setSelectedExample] = useState<PlaygroundExample | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const { examples, loading, incrementViewCount } = usePlaygroundExamples();
  const { examples: featuredExamples, loading: featuredLoading } = useFeaturedExamples();

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'RNET': return <Network className="h-5 w-5" />;
      case 'SAI': return <Brain className="h-5 w-5" />;
      case 'SRS': return <Cpu className="h-5 w-5" />;
      case 'QLLM': return <MessageSquare className="h-5 w-5" />;
      case 'I-Ching': return <Circle className="h-5 w-5" />;
      case 'QSEM': return <Database className="h-5 w-5" />;
      default: return <Code className="h-5 w-5" />;
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'RNET': return 'text-cyan-600 dark:text-cyan-400';
      case 'SAI': return 'text-emerald-600 dark:text-emerald-400';
      case 'SRS': return 'text-violet-600 dark:text-violet-400';
      case 'QLLM': return 'text-blue-600 dark:text-blue-400';
      case 'I-Ching': return 'text-purple-600 dark:text-purple-400';
      case 'QSEM': return 'text-indigo-600 dark:text-indigo-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge className="bg-green-100/70 dark:bg-green-900/30 text-green-800 dark:text-green-200">Beginner</Badge>;
      case 'intermediate':
        return <Badge className="bg-yellow-100/70 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">Intermediate</Badge>;
      case 'advanced':
        return <Badge className="bg-red-100/70 dark:bg-red-900/30 text-red-800 dark:text-red-200">Advanced</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tutorial': return <BookOpen className="h-4 w-4" />;
      case 'advanced': return <Rocket className="h-4 w-4" />;
      case 'showcase': return <Sparkles className="h-4 w-4" />;
      case 'integration': return <GitBranch className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const filteredExamples = activeFilter === 'all' 
    ? examples 
    : examples.filter(example => 
        example.service === activeFilter || 
        example.category === activeFilter ||
        example.difficulty === activeFilter
      );

  const handleExampleClick = (example: PlaygroundExample) => {
    setSelectedExample(example);
    incrementViewCount(example.id);
  };

  if (loading && !examples.length) {
    return (
      <PageLayout>
        <Section>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading playground examples...</p>
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
                  <Code className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                  Playground Examples
                </h1>
                <p className="text-xl text-muted-foreground">
                  Interactive tutorials and demonstrations showcasing quantum-enhanced AI services.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
                <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                  <Rocket className="h-4 w-4 mr-2" />
                  Start Building
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Examples */}
          {!featuredLoading && featuredExamples.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Featured Examples</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {featuredExamples.map((example) => (
                  <Card key={example.id} className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleExampleClick(example)}>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-600/5" />
                    <CardHeader className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`flex items-center gap-2 ${getServiceColor(example.service)}`}>
                          {getServiceIcon(example.service)}
                          <Badge variant="outline">{example.service}</Badge>
                        </div>
                        {example.liveDemo && (
                          <Badge className="bg-green-100/70 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                            <Play className="h-3 w-3 mr-1" />
                            Live Demo
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {example.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="flex items-center justify-between mb-4">
                        {getDifficultyBadge(example.difficulty)}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {example.estimatedTime}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {example.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {example.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{example.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {example.viewCount} views
                        </span>
                      </div>
                      <Button className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Try Example
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="RNET">RNET</TabsTrigger>
              <TabsTrigger value="SAI">SAI</TabsTrigger>
              <TabsTrigger value="SRS">SRS</TabsTrigger>
              <TabsTrigger value="QLLM">QLLM</TabsTrigger>
              <TabsTrigger value="I-Ching">I-Ching</TabsTrigger>
              <TabsTrigger value="QSEM">QSEM</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {examples.map((example) => (
                  <Card key={example.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleExampleClick(example)}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`flex items-center gap-2 ${getServiceColor(example.service)}`}>
                          {getServiceIcon(example.service)}
                          <Badge variant="outline">{example.service}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(example.category)}
                          {example.liveDemo && <Play className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {example.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        {getDifficultyBadge(example.difficulty)}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {example.estimatedTime}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {example.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {example.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{example.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {example.viewCount} views
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Service-specific tabs */}
            {['RNET', 'SAI', 'SRS', 'QLLM', 'I-Ching', 'QSEM'].map((service) => (
              <TabsContent key={service} value={service} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {examples.filter(ex => ex.service === service).map((example) => (
                    <Card key={example.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => handleExampleClick(example)}>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(example.category)}
                            <span className="text-sm capitalize">{example.category}</span>
                          </div>
                          {example.liveDemo && (
                            <Badge className="bg-green-100/70 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                              <Play className="h-3 w-3 mr-1" />
                              Live Demo
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{example.title}</CardTitle>
                        <CardDescription>
                          {example.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          {getDifficultyBadge(example.difficulty)}
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {example.estimatedTime}
                          </div>
                        </div>
                        
                        {example.codeSnippet && (
                          <div className="mb-4">
                            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                              <code>{example.codeSnippet.slice(0, 120)}...</code>
                            </pre>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {example.viewCount} views
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <Play className="h-4 w-4 mr-2" />
                            Try Example
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Section>
    </PageLayout>
  );
};

export default PlaygroundExamples;