/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity, AlertTriangle, Clock, Zap } from "lucide-react";

interface ApiUsage {
  requests: number;
  limit: number;
  resetTime: Date;
  lastRequest: Date | null;
}

interface ApiUsageMonitorProps {
  compact?: boolean;
}

const ApiUsageMonitor: React.FC<ApiUsageMonitorProps> = ({ compact = false }) => {
  const [usage, setUsage] = useState<ApiUsage>({
    requests: 0,
    limit: 1000, // Default limit
    resetTime: new Date(Date.now() + 3600000), // 1 hour from now
    lastRequest: null
  });

  const [isNearLimit, setIsNearLimit] = useState(false);

  // Simulate API usage tracking (in real implementation, this would come from API responses)
  const trackApiCall = useCallback(() => {
    setUsage(prev => {
      const newRequests = prev.requests + 1;
      const newUsage = {
        ...prev,
        requests: newRequests,
        lastRequest: new Date()
      };

      // Check if near rate limit (80% usage)
      setIsNearLimit(newRequests / prev.limit >= 0.8);

      return newUsage;
    });
  }, []);

  // Reset usage counter periodically (simulate hourly reset)
  useEffect(() => {
    const resetInterval = setInterval(() => {
      setUsage(prev => ({
        ...prev,
        requests: 0,
        resetTime: new Date(Date.now() + 3600000)
      }));
      setIsNearLimit(false);
    }, 3600000); // Reset every hour

    return () => clearInterval(resetInterval);
  }, []);

  // Expose trackApiCall for parent components to use
  useEffect(() => {
    (window as any).trackApiUsage = trackApiCall;
    return () => {
      delete (window as any).trackApiUsage;
    };
  }, [trackApiCall]);

  const getUsagePercentage = () => (usage.requests / usage.limit) * 100;

  const getTimeUntilReset = () => {
    const now = new Date();
    const diff = usage.resetTime.getTime() - now.getTime();
    const minutes = Math.ceil(diff / 60000);
    return Math.max(0, minutes);
  };

  const getUsageColor = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Activity className={`h-4 w-4 ${isNearLimit ? 'text-yellow-500' : 'text-green-500'}`} />
        <span className="text-sm">
          {usage.requests}/{usage.limit}
        </span>
        {isNearLimit && (
          <Badge variant="secondary" className="text-xs">
            Near Limit
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          API Usage Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Usage Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Requests this hour</span>
            <span>{usage.requests} / {usage.limit}</span>
          </div>
          <Progress
            value={getUsagePercentage()}
            className="h-2"
          />
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Reset In</p>
              <p className="text-xs text-gray-600">{getTimeUntilReset()} minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Last Request</p>
              <p className="text-xs text-gray-600">
                {usage.lastRequest
                  ? usage.lastRequest.toLocaleTimeString()
                  : 'None yet'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Rate Limit Warning */}
        {isNearLimit && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Approaching Rate Limit</strong>
              <p className="text-sm mt-1">
                You're using {Math.round(getUsagePercentage())}% of your hourly API quota.
                Consider reducing request frequency or upgrading your plan.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Usage Tips */}
        <div className="text-xs text-gray-600 space-y-1">
          <p>• API calls are tracked per hour</p>
          <p>• Rate limits reset automatically</p>
          <p>• Monitor usage to avoid interruptions</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiUsageMonitor;