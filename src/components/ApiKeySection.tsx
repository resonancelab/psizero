import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Key, Copy, Eye, EyeOff, RotateCcw, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDashboard } from "@/hooks/useDashboard";
import CreateApiKeyDialog from "./CreateApiKeyDialog";

const ApiKeySection = () => {
  const { apiKeys, createApiKey, revokeApiKey, isLoading } = useDashboard();
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (key: string, name: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "API Key Copied",
      description: `${name} has been copied to your clipboard.`,
    });
  };

  const maskKey = (keyPrefix: string) => {
    return keyPrefix + "•".repeat(24) + "••••••••";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLastUsedText = (lastUsedAt?: string) => {
    if (!lastUsedAt) return 'Never used';
    
    const lastUsed = new Date(lastUsedAt);
    const now = new Date();
    const diffMs = now.getTime() - lastUsed.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading API Keys...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="h-5 w-5 mr-2 text-api-secondary" />
          API Keys
        </CardTitle>
        <CardDescription>
          Manage your API keys for secure access to our services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKeys.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No API keys found. Create your first API key to get started.
          </div>
        ) : (
          apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">{apiKey.name}</h4>
                  <Badge 
                    variant="secondary" 
                    className={apiKey.is_active ? "bg-api-success/10 text-api-success" : "bg-muted/10 text-muted-foreground"}
                  >
                    {apiKey.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleShowKey(apiKey.id)}
                    title={showKeys[apiKey.id] ? "Hide key" : "Show key"}
                  >
                    {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(apiKey.key_prefix, apiKey.name)}
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => revokeApiKey(apiKey.id)}
                    title="Revoke key"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Input 
                  value={showKeys[apiKey.id] ? `${apiKey.key_prefix}...` : maskKey(apiKey.key_prefix)}
                  readOnly
                  className="font-mono text-sm bg-api-code-bg text-api-code-text border-api-code-bg"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Created: {formatDate(apiKey.created_at)}</span>
                  <span>Last used: {getLastUsedText(apiKey.last_used_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
        
        <Button 
          variant="gradient" 
          className="w-full"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New API Key
        </Button>

        <CreateApiKeyDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreateKey={createApiKey}
        />
      </CardContent>
    </Card>
  );
};

export default ApiKeySection;