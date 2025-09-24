import React, { useState } from 'react';
import { ArrowLeft, Settings, Play, Square, Pause, Download, Upload, Trash2, Copy, Activity, Database, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { EngineState, EngineStatus, UpdateEngineRequest, TrainingExample } from '@/types/sai';
import SAIVisualization from '@/components/visualizations/SAIVisualization';

interface EngineDetailViewProps {
  engine: EngineState;
  onBack: () => void;
  onUpdate: (id: string, updates: UpdateEngineRequest) => Promise<EngineState>;
  onDelete: (id: string) => Promise<void>;
  onClone: (id: string, name: string) => Promise<EngineState>;
  onStartTraining: (id: string, data: TrainingExample[]) => Promise<void>;
  onStopTraining: (id: string) => Promise<void>;
  className?: string;
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
    case 'running': return 'bg-green-500';
    case 'paused': return 'bg-yellow-500';
    case 'failed': return 'bg-red-500';
    case 'completed': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
}

const EngineDetailView: React.FC<EngineDetailViewProps> = ({
  engine,
  onBack,
  onUpdate,
  onDelete,
  onClone,
  onStartTraining,
  onStopTraining,
  className
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [cloneName, setCloneName] = useState(`${engine.config.name} (Copy)`);

  const status = getEngineStatus(engine);
  const latestSession = engine.training_history[engine.training_history.length - 1];

  const handleStartTraining = async () => {
    // Mock training data for demo
    const mockTrainingData: TrainingExample[] = [
      {
        id: 'example_1',
        input: 'Sample training text',
        output: 'Expected symbolic output',
        context: {},
        weight: 1.0,
        labels: ['training'],
        metadata: {},
        created_at: new Date().toISOString()
      }
    ];
    
    await onStartTraining(engine.id, mockTrainingData);
  };

  const handleDelete = async () => {
    await onDelete(engine.id);
    setShowDeleteDialog(false);
    onBack();
  };

  const handleClone = async () => {
    await onClone(engine.id, cloneName);
    setShowCloneDialog(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{engine.config.name}</h1>
            <p className="text-gray-600">Engine ID: {engine.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={`${getStatusColor(status)} text-white`}>
            {status.toUpperCase()}
          </Badge>
          <Button variant="outline" onClick={() => setShowCloneDialog(true)}>
            <Copy className="h-4 w-4 mr-2" />
            Clone
          </Button>
          <Button variant="outline" onClick={() => setShowDeleteDialog(true)} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Texts Processed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {engine.statistics.total_processed_texts.toLocaleString()}
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Symbols Learned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {engine.statistics.total_symbols_learned}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Training Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {engine.statistics.total_training_sessions}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(engine.statistics.last_training_accuracy * 100).toFixed(1)}%
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Training Controls</CardTitle>
              <CardDescription>Manage training sessions and monitor progress</CardDescription>
            </div>
            <div className="flex gap-2">
              {status === 'idle' && (
                <Button onClick={handleStartTraining} className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start Training
                </Button>
              )}
              {status === 'running' && (
                <Button onClick={() => onStopTraining(engine.id)} variant="outline">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Training
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {latestSession && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Training Progress</span>
                <span className="text-sm text-gray-600">
                  Epoch {latestSession.current_epoch}/{latestSession.total_epochs}
                </span>
              </div>
              <Progress value={latestSession.progress} className="h-2" />
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Loss:</span> {latestSession.current_loss.toFixed(4)}
                </div>
                <div>
                  <span className="font-medium">Best Loss:</span> {latestSession.best_loss.toFixed(4)}
                </div>
                <div>
                  <span className="font-medium">Learning Rate:</span> {latestSession.learning_rate}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="configuration" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="visualization">Live Demo</TabsTrigger>
          <TabsTrigger value="training">Training History</TabsTrigger>
          <TabsTrigger value="symbols">Symbol Mappings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engine Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Max Symbols</label>
                  <p className="text-sm text-gray-600">{engine.config.max_symbols}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Entropy Threshold</label>
                  <p className="text-sm text-gray-600">{engine.config.entropy_threshold}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Symbol Mapping Type</label>
                  <p className="text-sm text-gray-600 capitalize">{engine.config.symbol_mapping_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Auto Save</label>
                  <p className="text-sm text-gray-600">{engine.config.auto_save ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Prime Limits</h4>
                <div className="flex flex-wrap gap-2">
                  {engine.config.prime_limits.map((prime, index) => (
                    <Badge key={index} variant="outline">{prime}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization">
          <Card>
            <CardHeader>
              <CardTitle>Live Engine Demonstration</CardTitle>
              <CardDescription>
                Interactive visualization of this engine's symbolic processing capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SAIVisualization />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training History</CardTitle>
            </CardHeader>
            <CardContent>
              {engine.training_history.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No training sessions yet</p>
                  <Button onClick={handleStartTraining} className="mt-4 bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Start First Training Session
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {engine.training_history.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(session.status)} text-white`}>
                            {session.status}
                          </Badge>
                          <span className="font-medium">Session {session.id}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(session.start_time).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Epochs:</span> {session.current_epoch}/{session.total_epochs}
                        </div>
                        <div>
                          <span className="font-medium">Loss:</span> {session.current_loss.toFixed(4)}
                        </div>
                        <div>
                          <span className="font-medium">Examples:</span> {session.training_examples}
                        </div>
                        <div>
                          <span className="font-medium">Progress:</span> {session.progress}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="symbols">
          <Card>
            <CardHeader>
              <CardTitle>Symbol Mappings</CardTitle>
              <CardDescription>Current symbol-to-prime mappings for this engine</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(engine.symbol_mappings).length === 0 ? (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No symbol mappings yet</p>
                  <p className="text-sm text-gray-500">Start training to generate symbol mappings</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(engine.symbol_mappings).map(([key, mapping]) => (
                    <div key={key} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-lg">{mapping.symbol}</span>
                        <Badge variant="outline">
                          Prime: {mapping.prime_signature.join('×')}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Frequency: {(mapping.frequency * 100).toFixed(1)}%</div>
                        <div>Entropy: {mapping.entropy.toFixed(3)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the engine "{engine.config.name}" and all its training data. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete Engine
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clone Dialog */}
      <AlertDialog open={showCloneDialog} onOpenChange={setShowCloneDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clone Engine</AlertDialogTitle>
            <AlertDialogDescription>
              Create a copy of "{engine.config.name}" with the same configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={cloneName}
              onChange={(e) => setCloneName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter name for cloned engine"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClone}>
              Clone Engine
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EngineDetailView;
