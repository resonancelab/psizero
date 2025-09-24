import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface CreateModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateModel: () => void;
}

export const CreateModelDialog = ({ 
  open, 
  onOpenChange, 
  onCreateModel 
}: CreateModelDialogProps) => {
  const [temperature, setTemperature] = useState([0.7]);
  const [primeBasisIntegration, setPrimeBasisIntegration] = useState(false);
  const [quantumEnhancement, setQuantumEnhancement] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Language Model</DialogTitle>
          <DialogDescription>
            Set up a new language model for fine-tuning and deployment
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modelName">Model Name</Label>
              <Input id="modelName" placeholder="Enter model name" />
            </div>
            <div>
              <Label htmlFor="baseModel">Base Model</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select base model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude-3">Claude-3</SelectItem>
                  <SelectItem value="llama-2">Llama-2</SelectItem>
                  <SelectItem value="mistral">Mistral-7B</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="modelDesc">Description</Label>
            <Textarea id="modelDesc" placeholder="Describe the model's purpose" />
          </div>

          <div className="space-y-4">
            <Label>Model Configuration</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input id="maxTokens" type="number" placeholder="4096" />
              </div>
              <div>
                <Label htmlFor="temperature">Temperature</Label>
                <div className="pt-2">
                  <Slider 
                    value={temperature} 
                    onValueChange={setTemperature}
                    max={2} 
                    min={0} 
                    step={0.1} 
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    Current: {temperature[0]}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Prime Basis Integration</Label>
                <p className="text-sm text-muted-foreground">Enable quantum-enhanced processing</p>
              </div>
              <Switch 
                checked={primeBasisIntegration}
                onCheckedChange={setPrimeBasisIntegration}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Quantum Enhancement</Label>
                <p className="text-sm text-muted-foreground">Advanced quantum processing capabilities</p>
              </div>
              <Switch 
                checked={quantumEnhancement}
                onCheckedChange={setQuantumEnhancement}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onCreateModel}>
            Create Model
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};