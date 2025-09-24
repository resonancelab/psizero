import React, { useState } from 'react';
import { MoreVertical, Play, Pause, Square, Copy, Trash2, Settings, Activity, Database, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EngineState, EngineStatus, TrainingExample } from '@/types/sai';

interface EngineCardProps {
  engine: EngineState;
  viewMode: 'grid' | 'list';
  onSelect: () => void;
  onUpdate: (id: string, updates: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClone: (id: string, name: string) => Promise<void>;
  onStartTraining: (id: string, data: TrainingExample[]) => Promise<void>;
  onStopTraining: (id: string) => Promise<void>;
}

// Helper function to get engine status
function getEngineStatus(engine: EngineState): EngineStatus {
  if (engine.training_history.some(session => session.status === 'running')) {
    return 'running';
  }
  if (engine.training_history.some(session => session.status === 'paused')) {
    return 'paused';
  }
  if (engine.training_history.some(session => session.status === 'failed')) {
    return 'failed';
  }
  return 'idle';
}

// Helper function to get status color
function getStatusColor(status: EngineStatus): string {
  switch (status) {
    case 'running':
      return 'bg-blue-100 text-blue-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    }
    return `${hours}h ago`;
  }
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
}

const EngineCard: React.FC<EngineCardProps> = ({
  engine,
  viewMode,
  onSelect,
  onUpdate,
  onDelete,
  onClone,
  onStartTraining,
  onStopTraining,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const status = getEngineStatus(engine);
  const statusColor = getStatusColor(status);
  const lastAccessed = formatDate(engine.last_accessed);
  
  const activeTrainingSession = engine.training_history.find(
    session => session.status === 'running' || session.status === 'paused'
  );

  const handleAction = async (action: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTraining = () => {
    const mockTrainingData: TrainingExample[] = [
      {
        id: '1',
        input: 'Sample training text 1',
        output: 'Expected output 1',
        context: {},
        weight: 1.0,
        labels: ['sample'],
        metadata: {},
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        input: 'Sample training text 2',
        output: 'Expected output 2',
        context: {},
        weight: 1.0,
        labels: ['sample'],
        metadata: {},
        created_at: new Date().toISOString(),
      },
    ];
    
    handleAction(() => onStartTraining(engine.id, mockTrainingData));
  };

  const handleStopTraining = () => {
    handleAction(() => onStopTraining(engine.id));
  };

  const handleClone = () => {
    const newName = `${engine.config.name} (Copy)`;
    handleAction(() => onClone(engine.id, newName));
  };

  const handleDelete = () => {
    handleAction(() => onDelete(engine.id));
    setShowDeleteDialog(false);
  };

  if (viewMode === 'list') {
    return (
      <>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1" onClick={onSelect}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{engine.config.name}</h3>
                    <Badge className={statusColor}>{status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {engine.statistics.total_processed_texts} texts processed • Last used {lastAccessed}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {status === 'running' && activeTrainingSession && (
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-600">
                      Epoch {activeTrainingSession.current_epoch}/{activeTrainingSession.total_epochs}
                    </div>
                    <Progress 
                      value={activeTrainingSession.progress} 
                      className="w-24 h-2"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  {status === 'idle' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleStartTraining}
                      disabled={isLoading}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {(status === 'running' || status === 'paused') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleStopTraining}
                      disabled={isLoading}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={onSelect}>
                        <Settings className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleClone}>
                        <Copy className="h-4 w-4 mr-2" />
                        Clone Engine
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Engine
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Engine</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{engine.config.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Grid view
  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{engine.config.name}</CardTitle>
              <CardDescription className="text-sm">
                Created {formatDate(engine.config.created_at)}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect(); }}>
                  <Settings className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleClone(); }}>
                  <Copy className="h-4 w-4 mr-2" />
                  Clone Engine
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); setShowDeleteDialog(true); }}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Engine
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge className={statusColor}>{status}</Badge>
            {status === 'running' && (
              <Badge variant="outline" className="text-blue-600">
                <Activity className="h-3 w-3 mr-1" />
                Training
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Training Progress */}
          {status === 'running' && activeTrainingSession && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Training Progress</span>
                <span className="text-sm text-blue-600">
                  {activeTrainingSession.current_epoch}/{activeTrainingSession.total_epochs} epochs
                </span>
              </div>
              <Progress 
                value={activeTrainingSession.progress} 
                className="h-2"
              />
            </div>
          )}
          
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Database className="h-4 w-4 text-gray-600" />
                <span className="text-lg font-semibold text-gray-900">
                  {engine.statistics.total_processed_texts}
                </span>
              </div>
              <p className="text-xs text-gray-600">Texts Processed</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Activity className="h-4 w-4 text-gray-600" />
                <span className="text-lg font-semibold text-gray-900">
                  {engine.statistics.total_symbols_learned}
                </span>
              </div>
              <p className="text-xs text-gray-600">Symbols Learned</p>
            </div>
          </div>
          
          {/* Last Activity */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Last used {lastAccessed}</span>
            </div>
            <span className="text-xs">
              v{engine.version}
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {status === 'idle' && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleStartTraining}
                disabled={isLoading}
              >
                <Play className="h-4 w-4 mr-1" />
                Start Training
              </Button>
            )}
            
            {status === 'running' && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleStopTraining}
                disabled={isLoading}
              >
                <Square className="h-4 w-4 mr-1" />
                Stop Training
              </Button>
            )}
            
            {status === 'paused' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleStartTraining}
                  disabled={isLoading}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleStopTraining}
                  disabled={isLoading}
                >
                  <Square className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              </>
            )}
            
            {(status === 'failed' || status === 'completed') && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleStartTraining}
                disabled={isLoading}
              >
                <Play className="h-4 w-4 mr-1" />
                Restart Training
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Engine</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{engine.config.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EngineCard;