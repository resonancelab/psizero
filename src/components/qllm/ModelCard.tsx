import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Settings, Trash2, Play, Square } from 'lucide-react';
import { LanguageModel } from "@/types/qllm";
import { getStatusBadge, getStatusIcon, getBaseModelIcon, formatTokenCount, formatLatency } from "./utils";

interface ModelCardProps {
  model: LanguageModel;
  onSelect: (model: LanguageModel) => void;
  onStartFineTuning: (modelId: string) => void;
  onStopFineTuning: (modelId: string) => void;
  onDelete: (modelId: string) => void;
}

export const ModelCard = ({ 
  model, 
  onSelect, 
  onStartFineTuning, 
  onStopFineTuning, 
  onDelete 
}: ModelCardProps) => {
  return (
    <Card 
      key={model.id} 
      className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelect(model)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(model.status)}
            <CardTitle className="text-lg">{model.name}</CardTitle>
          </div>
          {getStatusBadge(model.status)}
        </div>
        <CardDescription className="line-clamp-2">
          {model.description || 'No description provided'}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getBaseModelIcon(model.baseModel)}
            <Badge variant="outline" className="capitalize">
              {model.baseModel.replace('-', ' ')}
            </Badge>
          </div>
          <div className="flex gap-1">
            {model.config.primeBasisIntegration && (
              <Badge variant="secondary" className="text-xs">Prime</Badge>
            )}
            {model.config.quantumEnhanced && (
              <Badge variant="secondary" className="text-xs">Quantum</Badge>
            )}
          </div>
        </div>

        {model.fineTuning && model.status === 'fine-tuning' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Fine-tuning Progress</span>
              <span>{model.fineTuning.currentStep}/{model.fineTuning.totalSteps}</span>
            </div>
            <Progress value={(model.fineTuning.currentStep / model.fineTuning.totalSteps) * 100} />
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Loss:</span>
                <span className="font-semibold ml-1">{model.fineTuning.loss.toFixed(3)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Accuracy:</span>
                <span className="font-semibold ml-1">{(model.fineTuning.accuracy * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Tokens</p>
            <p className="font-semibold">{formatTokenCount(model.performance.totalTokens)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg Latency</p>
            <p className="font-semibold">{formatLatency(model.performance.averageLatency)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Success Rate</p>
            <p className="font-semibold">{(model.performance.successRate * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Conversations</p>
            <p className="font-semibold">{model.performance.conversationsCount}</p>
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Capabilities:</p>
          <div className="flex flex-wrap gap-1">
            {model.capabilities.slice(0, 3).map((capability) => (
              <Badge key={capability} variant="outline" className="text-xs">
                {capability.replace('-', ' ')}
              </Badge>
            ))}
            {model.capabilities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{model.capabilities.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {model.status === 'ready' && (
            <Button size="sm" className="flex-1" onClick={(e) => {
              e.stopPropagation();
              onStartFineTuning(model.id);
            }}>
              <Play className="h-3 w-3 mr-1" />
              Fine-tune
            </Button>
          )}
          {model.status === 'fine-tuning' && (
            <Button size="sm" variant="outline" className="flex-1" onClick={(e) => {
              e.stopPropagation();
              onStopFineTuning(model.id);
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
            onDelete(model.id);
          }}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};