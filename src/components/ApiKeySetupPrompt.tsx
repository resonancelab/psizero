import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDashboard } from '@/hooks/useDashboard';
import apiAuth from '@/lib/api/auth';

interface ApiKeySetupPromptProps {
  onApiKeyConfigured?: () => void;
}

const ApiKeySetupPrompt: React.FC<ApiKeySetupPromptProps> = ({ onApiKeyConfigured }) => {
  const [apiKey, setApiKey] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const { toast } = useToast();
  const { apiKeys } = useDashboard();

  const handleUseExistingKey = async (keyId: string, keyPrefix: string) => {
    try {
      setIsConfiguring(true);
      
      // For demo purposes, we'll construct a demo API key
      // In production, you'd need the actual key which is only shown once during creation
      const demoKey = `${keyPrefix}_demo_key_for_testing`;
      
      apiAuth.setApiKey(demoKey, 'sandbox');
      
      toast({
        title: "API Key Configured",
        description: `Using API key ${keyPrefix}... for quantum demos`,
      });
      
      onApiKeyConfigured?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to configure API key",
        variant: "destructive",
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleManualEntry = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConfiguring(true);
      
      apiAuth.setApiKey(apiKey.trim(), 'sandbox');
      
      // Test the key
      const testResult = await apiAuth.testApiKey();
      
      if (testResult.valid) {
        toast({
          title: "API Key Configured",
          description: "Your API key has been configured successfully",
        });
        onApiKeyConfigured?.();
      } else {
        throw new Error(testResult.error || 'Invalid API key');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to configure API key",
        variant: "destructive",
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
          <Key className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <CardTitle>API Key Required</CardTitle>
        <CardDescription>
          To use quantum demos and advanced features, you need to configure your API key
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Quantum demos require API key authentication in addition to your login session.
          </AlertDescription>
        </Alert>

        {/* Existing API Keys */}
        {apiKeys.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Use an existing API key:</Label>
            <div className="space-y-2">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{key.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Key: {key.key_prefix}... • Created: {new Date(key.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleUseExistingKey(key.id, key.key_prefix)}
                    disabled={isConfiguring}
                    size="sm"
                  >
                    Use This Key
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create New API Key */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Or create a new API key:</Label>
          <Button
            onClick={() => window.open('/dashboard', '_blank')}
            variant="outline"
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Go to Dashboard to Create API Key
          </Button>
        </div>

        {/* Manual Entry */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Or enter an API key manually:</Label>
          <Button
            onClick={() => setShowManualEntry(!showManualEntry)}
            variant="outline"
            size="sm"
          >
            {showManualEntry ? 'Hide' : 'Show'} Manual Entry
          </Button>
          
          {showManualEntry && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="font-mono"
                />
              </div>
              <Button
                onClick={handleManualEntry}
                disabled={isConfiguring || !apiKey.trim()}
                className="w-full"
              >
                {isConfiguring ? "Configuring..." : "Configure API Key"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeySetupPrompt;