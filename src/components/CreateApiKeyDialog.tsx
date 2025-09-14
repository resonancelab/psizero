import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Key, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateKey: (name: string) => Promise<string | null>;
}

const CreateApiKeyDialog = ({ open, onOpenChange, onCreateKey }: CreateApiKeyDialogProps) => {
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const newKey = await onCreateKey(name.trim());
      if (newKey) {
        setCreatedKey(newKey);
      }
    } catch (error) {
      console.error('Error creating API key:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      toast({
        title: "Copied!",
        description: "API key copied to clipboard",
      });
    }
  };

  const handleClose = () => {
    setName("");
    setCreatedKey(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-api-secondary" />
            Create New API Key
          </DialogTitle>
          <DialogDescription>
            {!createdKey 
              ? "Create a new API key to access our services. Give it a descriptive name to help you identify it later."
              : "Your API key has been created! Make sure to copy it now as you won't be able to see it again."
            }
          </DialogDescription>
        </DialogHeader>

        {!createdKey ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">API Key Name</Label>
              <Input
                id="keyName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Production Key, Development Key"
                disabled={isCreating}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This is the only time you'll be able to see your API key. Make sure to save it in a secure location.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Your new API key</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={createdKey}
                  readOnly
                  className="font-mono text-sm bg-api-code-bg text-api-code-text border-api-code-bg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {!createdKey ? (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isCreating}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create API Key"}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} className="w-full">
              I've saved my API key
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateApiKeyDialog;