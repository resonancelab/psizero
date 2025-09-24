import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Key,
  CheckCircle,
  AlertCircle,
  TestTube,
  Settings,
  Globe,
  Shield,
  Zap
} from "lucide-react";
import psiZeroApi from "@/lib/api";

interface ApiKeySetupProps {
  onConfigured?: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onConfigured }) => {
  const [apiKey, setApiKey] = useState('');
  const [environment, setEnvironment] = useState<'production' | 'sandbox'>('sandbox');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Load existing configuration
    const existingKey = psiZeroApi.auth.getApiKey();
    const existingConfig = psiZeroApi.auth.getConfig();

    if (existingKey) {
      setApiKey(existingKey);
    }
    if (existingConfig) {
      setEnvironment(existingConfig.environment);
      setIsConfigured(true);
    }
  }, []);

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter an API key'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // Test the connection
      const result = await psiZeroApi.testConnection();

      if (result.authenticated) {
        setTestResult({
          success: true,
          message: 'API key is valid and connection successful!'
        });
      } else {
        setTestResult({
          success: false,
          message: result.error || 'API key validation failed'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter an API key'
      });
      return;
    }

    try {
      // Configure the API
      psiZeroApi.auth.setApiKey(apiKey, environment);

      // Test the configuration
      await handleTestConnection();

      if (testResult?.success) {
        setIsConfigured(true);
        onConfigured?.();
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to save configuration'
      });
    }
  };

  const handleClearConfiguration = () => {
    psiZeroApi.auth.clearAuth();
    setApiKey('');
    setIsConfigured(false);
    setTestResult(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Configuration
        </CardTitle>
        <CardDescription>
          Configure your PsiZero API key to access quantum computing demos and APIs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="info">API Info</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                isConfigured ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="text-sm font-medium">
                {isConfigured ? 'API Configured' : 'API Not Configured'}
              </span>
              {isConfigured && (
                <Badge variant="secondary" className="ml-auto">
                  {environment.toUpperCase()}
                </Badge>
              )}
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your PsiZero API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isTesting}
              />
              <p className="text-xs text-gray-500">
                Your API key is stored locally and never sent to our servers except for authentication
              </p>
            </div>

            {/* Environment Selection */}
            <div className="space-y-2">
              <Label>Environment</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={environment === 'sandbox' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEnvironment('sandbox')}
                  disabled={isTesting}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Sandbox
                </Button>
                <Button
                  type="button"
                  variant={environment === 'production' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEnvironment('production')}
                  disabled={isTesting}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Production
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Sandbox for testing, Production for live quantum computing
              </p>
            </div>

            {/* Test Result */}
            {testResult && (
              <Alert variant={testResult.success ? 'default' : 'destructive'}>
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleTestConnection}
                disabled={isTesting || !apiKey.trim()}
                variant="outline"
              >
                {isTesting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>

              <Button
                onClick={handleSaveConfiguration}
                disabled={isTesting || !apiKey.trim()}
              >
                <Settings className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>

              {isConfigured && (
                <Button
                  onClick={handleClearConfiguration}
                  variant="destructive"
                  size="sm"
                >
                  Clear
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Endpoints
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sandbox:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">sandbox.psizero.dev</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Production:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">api.psizero.dev</code>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </h3>
                <ul className="text-sm space-y-1">
                  <li>• API keys are stored locally only</li>
                  <li>• All requests use HTTPS</li>
                  <li>• Rate limiting applied per key</li>
                  <li>• Keys can be revoked anytime</li>
                </ul>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Need an API key?</strong> Contact PsiZero support or sign up for early access
                to get your quantum computing API key.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiKeySetup;