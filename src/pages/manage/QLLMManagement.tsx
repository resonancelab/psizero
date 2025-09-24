import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { MessageSquare, Plus, Upload, Play } from 'lucide-react';
import { LanguageModel, FineTuningJob, Conversation, InferenceJob, Dataset } from "@/types/qllm";
import { ModelCard } from "@/components/qllm/ModelCard";
import { CreateModelDialog } from "@/components/qllm/CreateModelDialog";

const QLLMManagement = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<LanguageModel[]>([]);
  const [fineTuningJobs, setFineTuningJobs] = useState<FineTuningJob[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [inferenceJobs, setInferenceJobs] = useState<InferenceJob[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedModel, setSelectedModel] = useState<LanguageModel | null>(null);
  const [showCreateModelDialog, setShowCreateModelDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockModels: LanguageModel[] = [
      {
        id: 'model_1',
        name: 'CustomerSupport-GPT-4',
        description: 'Fine-tuned GPT-4 model for customer support interactions',
        baseModel: 'gpt-4',
        status: 'ready',
        createdAt: '2024-01-15T10:00:00Z',
        lastUsed: '5 minutes ago',
        config: {
          maxTokens: 4096,
          temperature: 0.7,
          topP: 0.9,
          frequencyPenalty: 0.1,
          presencePenalty: 0.1,
          stopSequences: ['END', 'STOP'],
          primeBasisIntegration: true,
          quantumEnhanced: true
        },
        performance: {
          totalTokens: 2847291,
          averageLatency: 1240,
          successRate: 0.967,
          conversationsCount: 1847,
          lastWeekUsage: 89234
        },
        capabilities: ['text-generation', 'conversation', 'reasoning', 'code-assistance']
      },
      {
        id: 'model_2',
        name: 'Technical-Claude-3',
        description: 'Claude-3 fine-tuned for technical documentation and code review',
        baseModel: 'claude-3',
        status: 'fine-tuning',
        createdAt: '2024-01-12T08:15:00Z',
        lastUsed: '2 hours ago',
        config: {
          maxTokens: 8192,
          temperature: 0.3,
          topP: 0.8,
          frequencyPenalty: 0.0,
          presencePenalty: 0.0,
          stopSequences: [],
          primeBasisIntegration: true,
          quantumEnhanced: false
        },
        fineTuning: {
          currentStep: 750,
          totalSteps: 1000,
          loss: 0.234,
          accuracy: 0.847,
          startTime: '2024-01-20T14:30:00Z',
          estimatedCompletion: '3 hours',
          datasetSize: 12000
        },
        performance: {
          totalTokens: 1594832,
          averageLatency: 890,
          successRate: 0.923,
          conversationsCount: 934,
          lastWeekUsage: 45123
        },
        capabilities: ['technical-writing', 'code-review', 'analysis', 'documentation']
      },
      {
        id: 'model_3',
        name: 'Creative-Mistral-7B',
        description: 'Mistral model optimized for creative writing and content generation',
        baseModel: 'mistral',
        status: 'ready',
        createdAt: '2024-01-18T16:45:00Z',
        lastUsed: '1 hour ago',
        config: {
          maxTokens: 2048,
          temperature: 0.9,
          topP: 0.95,
          frequencyPenalty: 0.2,
          presencePenalty: 0.3,
          stopSequences: ['---', '###'],
          primeBasisIntegration: false,
          quantumEnhanced: true
        },
        performance: {
          totalTokens: 892341,
          averageLatency: 650,
          successRate: 0.912,
          conversationsCount: 567,
          lastWeekUsage: 23567
        },
        capabilities: ['creative-writing', 'storytelling', 'content-generation', 'brainstorming']
      }
    ];

    setTimeout(() => {
      setModels(mockModels);
      setSelectedModel(mockModels[0]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Simulate fine-tuning progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setModels(prevModels =>
        prevModels.map(model => {
          if (model.status === 'fine-tuning' && model.fineTuning) {
            const newStep = Math.min(model.fineTuning.totalSteps, model.fineTuning.currentStep + 5);
            return {
              ...model,
              fineTuning: {
                ...model.fineTuning,
                currentStep: newStep,
                loss: Math.max(0.1, model.fineTuning.loss - Math.random() * 0.01),
                accuracy: Math.min(0.99, model.fineTuning.accuracy + Math.random() * 0.005)
              }
            };
          }
          return model;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateModel = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Model creation wizard will be available in the next update.",
    });
    setShowCreateModelDialog(false);
  };

  const handleStartFineTuning = (modelId: string) => {
    setModels(prevModels =>
      prevModels.map(model =>
        model.id === modelId
          ? { ...model, status: 'fine-tuning' as const }
          : model
      )
    );
    toast({
      title: "Fine-tuning Started",
      description: "Model fine-tuning process has begun.",
    });
  };

  const handleStopFineTuning = (modelId: string) => {
    setModels(prevModels =>
      prevModels.map(model =>
        model.id === modelId
          ? { ...model, status: 'ready' as const }
          : model
      )
    );
    toast({
      title: "Fine-tuning Stopped",
      description: "Fine-tuning process has been halted.",
    });
  };

  const handleDeleteModel = (modelId: string) => {
    setModels(prevModels => prevModels.filter(model => model.id !== modelId));
    toast({
      title: "Model Deleted",
      description: "Language model has been permanently removed.",
      variant: "destructive"
    });
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
                  <MessageSquare className="h-10 w-10 text-blue-600" />
                  QLLM Management
                </h1>
                <p className="text-xl text-muted-foreground">
                  Create, fine-tune, and manage quantum-enhanced language models for advanced conversational AI.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Dataset
                </Button>
                <Button variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Run Inference
                </Button>
                <CreateModelDialog
                  open={showCreateModelDialog}
                  onOpenChange={setShowCreateModelDialog}
                  onCreateModel={handleCreateModel}
                />
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                    onClick={() => setShowCreateModelDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Model
                  </Button>
                </DialogTrigger>
              </div>
            </div>
          </div>

          <Tabs defaultValue="models" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="fine-tuning">Fine-tuning</TabsTrigger>
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="inference">Inference</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {models.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    onSelect={setSelectedModel}
                    onStartFineTuning={handleStartFineTuning}
                    onStopFineTuning={handleStopFineTuning}
                    onDelete={handleDeleteModel}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="fine-tuning" className="space-y-6">
              <Card>
                <CardContent className="py-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Fine-tuning jobs will appear here when models are being trained.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conversations" className="space-y-6">
              <Card>
                <CardContent className="py-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Conversation history and analytics will be displayed here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inference" className="space-y-6">
              <Card>
                <CardContent className="py-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Active inference jobs and results will be shown here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardContent className="py-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Model performance analytics and insights will be available here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </PageLayout>
  );
};

export default QLLMManagement;