import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wifi, WifiOff, AlertCircle, Settings, RefreshCw } from "lucide-react";
import psiZeroApi from "@/lib/api";
import ApiKeySetup from "@/components/ApiKeySetup";

interface ApiStatus {
  connected: boolean;
  authenticated: boolean;
  error?: string;
  lastChecked?: Date;
}

interface ApiStatusIndicatorProps {
  compact?: boolean;
  showSetup?: boolean;
}

const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({
  compact = false,
  showSetup = true
}) => {
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  const checkApiStatus = async () => {
    setIsChecking(true);
    try {
      const result = await psiZeroApi.testConnection();
      setStatus({
        ...result,
        lastChecked: new Date()
      });
    } catch (error) {
      setStatus({
        connected: false,
        authenticated: false,
        error: error instanceof Error ? error.message : 'Connection failed',
        lastChecked: new Date()
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (!status) return 'bg-gray-500';
    if (status.authenticated) return 'bg-green-500';
    if (status.connected) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (!status) return 'Checking...';
    if (status.authenticated) return 'API Connected';
    if (status.connected) return 'API Connected (No Auth)';
    return 'API Disconnected';
  };

  const getStatusIcon = () => {
    if (isChecking) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (!status) return <Wifi className="h-4 w-4" />;
    if (status.authenticated) return <Wifi className="h-4 w-4" />;
    return <WifiOff className="h-4 w-4" />;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <span className="text-sm">{getStatusText()}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={checkApiStatus}
          disabled={isChecking}
        >
          {getStatusIcon()}
        </Button>
      </div>
    );
  }

  if (status && !status.authenticated && showSetup) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <strong>API Access Required</strong>
                <p className="text-sm mt-1">
                  Configure your PsiZero API key to access quantum computing features
                </p>
              </div>
              <Button
                onClick={() => setShowSetupModal(true)}
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Setup API
              </Button>
            </AlertDescription>
          </Alert>

          {showSetupModal && (
            <div className="mt-4">
              <ApiKeySetup
                onConfigured={() => {
                  setShowSetupModal(false);
                  checkApiStatus();
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
            <div>
              <h3 className="font-medium">API Status</h3>
              <p className="text-sm text-gray-600">{getStatusText()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkApiStatus}
              disabled={isChecking}
            >
              {getStatusIcon()}
              <span className="ml-2">Refresh</span>
            </Button>

            {!status?.authenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSetupModal(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Setup
              </Button>
            )}
          </div>
        </div>

        {status?.error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{status.error}</AlertDescription>
          </Alert>
        )}

        {status?.lastChecked && (
          <p className="text-xs text-gray-500 mt-2">
            Last checked: {status.lastChecked.toLocaleTimeString()}
          </p>
        )}

        {showSetupModal && (
          <div className="mt-4">
            <ApiKeySetup
              onConfigured={() => {
                setShowSetupModal(false);
                checkApiStatus();
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiStatusIndicator;