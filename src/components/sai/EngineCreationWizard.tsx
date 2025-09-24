/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Brain, Settings, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDefaultSAIConfig, CreateEngineRequest } from '@/types/sai';

interface EngineCreationWizardProps {
  onEngineCreated: (name: string, description?: string) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: WizardStep[] = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Configure engine name and description',
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: 'settings',
    title: 'Engine Settings',
    description: 'Configure processing and training parameters',
    icon: <Settings className="h-5 w-5" />,
  },
  {
    id: 'advanced',
    title: 'Advanced Options',
    description: 'Fine-tune prime system and storage settings',
    icon: <Database className="h-5 w-5" />,
  },
];

const EngineCreationWizard: React.FC<EngineCreationWizardProps> = ({
  onEngineCreated,
  onCancel,
  className,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxSymbols: 10000,
    entropyThreshold: 0.1,
    symbolMappingType: 'unicode' as 'unicode' | 'ascii' | 'custom',
    
    // Training settings
    batchSize: 32,
    learningRate: 0.001,
    maxEpochs: 100,
    earlyStopping: true,
    patienceEpochs: 10,
    validationSplit: 0.2,
    saveCheckpoints: true,
    checkpointInterval: 10,
    
    // Advanced settings
    primeLimits: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47],
    maxTrainingSize: 1000,
    autoSave: true,
    maxCacheSize: 1000,
    validationEnabled: true,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      await onEngineCreated(formData.name, formData.description);
    } catch (error) {
      console.error('Failed to create engine:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim().length > 0;
      case 1:
        return formData.batchSize > 0 && formData.learningRate > 0 && formData.maxEpochs > 0;
      case 2:
        return formData.maxTrainingSize > 0 && formData.maxCacheSize > 0;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Engine Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Document Analyzer"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-gray-600">
                Choose a descriptive name for your symbolic AI engine
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what this engine will be used for..."
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className="w-full h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbolMappingType">Symbol Mapping Type</Label>
              <Select
                value={formData.symbolMappingType}
                onValueChange={(value) => updateFormData('symbolMappingType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unicode">Unicode (Recommended)</SelectItem>
                  <SelectItem value="ascii">ASCII Only</SelectItem>
                  <SelectItem value="custom">Custom Mapping</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600">
                Unicode provides the most comprehensive symbol support
              </p>
            </div>

            <div className="space-y-2">
              <Label>Maximum Symbols: {formData.maxSymbols.toLocaleString()}</Label>
              <Slider
                value={[formData.maxSymbols]}
                onValueChange={([value]) => updateFormData('maxSymbols', value)}
                min={1000}
                max={100000}
                step={1000}
                className="w-full"
              />
              <p className="text-sm text-gray-600">
                Higher values allow for more complex symbolic representations
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Batch Size: {formData.batchSize}</Label>
                <Slider
                  value={[formData.batchSize]}
                  onValueChange={([value]) => updateFormData('batchSize', value)}
                  min={1}
                  max={128}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">
                  Number of training examples processed together
                </p>
              </div>

              <div className="space-y-2">
                <Label>Learning Rate: {formData.learningRate}</Label>
                <Slider
                  value={[formData.learningRate]}
                  onValueChange={([value]) => updateFormData('learningRate', value)}
                  min={0.0001}
                  max={0.1}
                  step={0.0001}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">
                  Controls how quickly the engine adapts during training
                </p>
              </div>

              <div className="space-y-2">
                <Label>Max Epochs: {formData.maxEpochs}</Label>
                <Slider
                  value={[formData.maxEpochs]}
                  onValueChange={([value]) => updateFormData('maxEpochs', value)}
                  min={10}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">
                  Maximum number of training iterations
                </p>
              </div>

              <div className="space-y-2">
                <Label>Validation Split: {Math.round(formData.validationSplit * 100)}%</Label>
                <Slider
                  value={[formData.validationSplit]}
                  onValueChange={([value]) => updateFormData('validationSplit', value)}
                  min={0.1}
                  max={0.5}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">
                  Percentage of data reserved for validation
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="earlyStopping">Early Stopping</Label>
                  <p className="text-sm text-gray-600">Stop training when improvement plateaus</p>
                </div>
                <Switch
                  id="earlyStopping"
                  checked={formData.earlyStopping}
                  onCheckedChange={(checked) => updateFormData('earlyStopping', checked)}
                />
              </div>

              {formData.earlyStopping && (
                <div className="space-y-2 ml-4">
                  <Label>Patience Epochs: {formData.patienceEpochs}</Label>
                  <Slider
                    value={[formData.patienceEpochs]}
                    onValueChange={([value]) => updateFormData('patienceEpochs', value)}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="saveCheckpoints">Save Checkpoints</Label>
                  <p className="text-sm text-gray-600">Enable resumable training sessions</p>
                </div>
                <Switch
                  id="saveCheckpoints"
                  checked={formData.saveCheckpoints}
                  onCheckedChange={(checked) => updateFormData('saveCheckpoints', checked)}
                />
              </div>

              {formData.saveCheckpoints && (
                <div className="space-y-2 ml-4">
                  <Label>Checkpoint Interval: {formData.checkpointInterval} epochs</Label>
                  <Slider
                    value={[formData.checkpointInterval]}
                    onValueChange={([value]) => updateFormData('checkpointInterval', value)}
                    min={5}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Entropy Threshold: {formData.entropyThreshold}</Label>
              <Slider
                value={[formData.entropyThreshold]}
                onValueChange={([value]) => updateFormData('entropyThreshold', value)}
                min={0.01}
                max={1.0}
                step={0.01}
                className="w-full"
              />
              <p className="text-sm text-gray-600">
                Minimum entropy level for symbol acceptance
              </p>
            </div>

            <div className="space-y-2">
              <Label>Prime Limits (First 15 primes)</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {formData.primeLimits.map((prime, index) => (
                    <span key={index} className="px-2 py-1 bg-white rounded text-sm font-mono">
                      {prime}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Prime numbers used for cryptographic signatures
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Max Training Size: {formData.maxTrainingSize.toLocaleString()}</Label>
                <Slider
                  value={[formData.maxTrainingSize]}
                  onValueChange={([value]) => updateFormData('maxTrainingSize', value)}
                  min={100}
                  max={10000}
                  step={100}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">
                  Maximum number of training examples
                </p>
              </div>

              <div className="space-y-2">
                <Label>Cache Size: {formData.maxCacheSize.toLocaleString()}</Label>
                <Slider
                  value={[formData.maxCacheSize]}
                  onValueChange={([value]) => updateFormData('maxCacheSize', value)}
                  min={100}
                  max={10000}
                  step={100}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">
                  Number of processed results to cache
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSave">Auto Save</Label>
                  <p className="text-sm text-gray-600">Automatically save engine state periodically</p>
                </div>
                <Switch
                  id="autoSave"
                  checked={formData.autoSave}
                  onCheckedChange={(checked) => updateFormData('autoSave', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="validationEnabled">Validation Enabled</Label>
                  <p className="text-sm text-gray-600">Enable data validation during processing</p>
                </div>
                <Switch
                  id="validationEnabled"
                  checked={formData.validationEnabled}
                  onCheckedChange={(checked) => updateFormData('validationEnabled', checked)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" onClick={onCancel} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New SAI Engine</h1>
            <p className="text-gray-600">Configure your symbolic AI engine settings</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${index <= currentStep 
                  ? 'bg-emerald-600 border-emerald-600 text-white' 
                  : 'border-gray-300 text-gray-400'
                }
              `}>
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  h-1 w-16 mx-4 transition-colors
                  ${index < currentStep ? 'bg-emerald-600' : 'bg-gray-300'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {steps[currentStep].icon}
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
          
          <div className="flex justify-between pt-6 border-t mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isCreating}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isCreating ? 'Creating...' : 'Create Engine'}
                <Check className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngineCreationWizard;