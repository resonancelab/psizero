import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
  Zap,
  Activity,
  Bot,
  Brain,
  Layers,
  Sparkles,
  Code,
  MessageSquare,
  BookOpen,
  MessageCircle,
  FileText,
  Target,
  Database
} from 'lucide-react';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ready':
      return <Badge className="bg-green-500">Ready</Badge>;
    case 'fine-tuning':
      return <Badge className="bg-blue-500">Fine-tuning</Badge>;
    case 'training':
      return <Badge className="bg-orange-500">Training</Badge>;
    case 'deploying':
      return <Badge className="bg-purple-500">Deploying</Badge>;
    case 'error':
      return <Badge variant="destructive">Error</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ready':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'fine-tuning':
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'training':
      return <Cpu className="h-4 w-4 text-orange-500 animate-pulse" />;
    case 'deploying':
      return <Zap className="h-4 w-4 text-purple-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

export const getBaseModelIcon = (baseModel: string) => {
  switch (baseModel) {
    case 'gpt-4':
      return <Bot className="h-4 w-4" />;
    case 'claude-3':
      return <Brain className="h-4 w-4" />;
    case 'llama-2':
      return <Layers className="h-4 w-4" />;
    case 'mistral':
      return <Sparkles className="h-4 w-4" />;
    case 'custom':
      return <Code className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

export const getDatasetTypeIcon = (type: string) => {
  switch (type) {
    case 'instruction':
      return <BookOpen className="h-4 w-4" />;
    case 'conversation':
      return <MessageCircle className="h-4 w-4" />;
    case 'completion':
      return <FileText className="h-4 w-4" />;
    case 'classification':
      return <Target className="h-4 w-4" />;
    default:
      return <Database className="h-4 w-4" />;
  }
};

export const formatFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatTokenCount = (count: number) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

export const formatLatency = (latency: number) => {
  if (latency < 1000) {
    return `${latency}ms`;
  } else {
    return `${(latency / 1000).toFixed(1)}s`;
  }
};