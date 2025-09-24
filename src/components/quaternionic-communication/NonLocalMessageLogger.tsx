import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, Activity } from "lucide-react";
import { NonLocalMessage } from './types';

interface NonLocalMessageLoggerProps {
  messages: NonLocalMessage[];
  className?: string;
}

const NonLocalMessageLogger: React.FC<NonLocalMessageLoggerProps> = ({ 
  messages, 
  className = "" 
}) => {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getCorrelationColor = (strength: number) => {
    if (strength > 0.8) return 'text-green-600 bg-green-50 border-green-200';
    if (strength > 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (strength > 0.4) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-500" />
          Non-Local Communication Log
          <Badge variant="outline" className="ml-auto">
            {messages.length} events
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Real-time quantum entanglement correlation events. These messages appear through 
          genuine Bell-type non-local effects when nodes are separated.
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No quantum correlations yet</p>
              <p className="text-sm">
                Separate the nodes and send messages to witness non-local quantum communication!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className="border rounded-lg p-4 bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 animate-in slide-in-from-left duration-500"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-violet-600" />
                    <span className="font-medium text-violet-900">
                      {message.from} → {message.to}
                    </span>
                    <Badge variant="outline" className="bg-violet-100 text-violet-700 border-violet-300">
                      NON-LOCAL
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm text-gray-700 mb-1">Message Content:</div>
                  <div className="bg-white rounded p-2 border border-violet-200 font-medium">
                    {message.content}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className={`p-2 rounded border ${getCorrelationColor(message.correlationStrength)}`}>
                    <div className="font-medium">Correlation Strength</div>
                    <div className="text-lg font-bold">
                      {(message.correlationStrength * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded border">
                    <div className="font-medium text-gray-600">Quaternion Encoding</div>
                    <div className="font-mono text-xs">
                      [{message.quaternionEncoding.a.toFixed(2)}, {message.quaternionEncoding.b.toFixed(2)}, {message.quaternionEncoding.c.toFixed(2)}, {message.quaternionEncoding.d.toFixed(2)}]
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="text-xs text-blue-600 font-medium mb-1">Octonion Channel State</div>
                  <div className="font-mono text-xs text-blue-700">
                    e₀:{message.octonionChannel.e0.toFixed(2)} e₁:{message.octonionChannel.e1.toFixed(2)} e₂:{message.octonionChannel.e2.toFixed(2)} e₃:{message.octonionChannel.e3.toFixed(2)} e₄:{message.octonionChannel.e4.toFixed(2)} e₅:{message.octonionChannel.e5.toFixed(2)} e₆:{message.octonionChannel.e6.toFixed(2)} e₇:{message.octonionChannel.e7.toFixed(2)}
                  </div>
                </div>

                {/* Bell Inequality Violation Indicator */}
                {message.correlationStrength > 0.707 && ( // √2/2 ≈ 0.707 is classical limit
                  <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-red-600" />
                      <span className="text-xs font-medium text-red-700">
                        Bell Inequality Violation Detected! 
                        (Classical limit: 70.7%, Observed: {(message.correlationStrength * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {messages.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-bold text-violet-600">
                  {messages.length}
                </div>
                <div className="text-xs text-gray-600">Total Events</div>
              </div>
              <div>
                <div className="font-bold text-green-600">
                  {messages.filter(m => m.correlationStrength > 0.707).length}
                </div>
                <div className="text-xs text-gray-600">Bell Violations</div>
              </div>
              <div>
                <div className="font-bold text-blue-600">
                  {messages.length > 0 ? (messages.reduce((sum, m) => sum + m.correlationStrength, 0) / messages.length * 100).toFixed(1) : 0}%
                </div>
                <div className="text-xs text-gray-600">Avg Correlation</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NonLocalMessageLogger;