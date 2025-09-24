import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Atom, Radio, Send } from "lucide-react";
import { QuantumNode as QuantumNodeType } from './types';
import BlochSphere from './BlochSphere';

interface QuantumNodeProps {
  node: QuantumNodeType;
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onTransmitMessage: () => void;
  borderColor?: string;
  iconColor?: string;
}

const QuantumNode: React.FC<QuantumNodeProps> = ({
  node,
  messageInput,
  onMessageInputChange,
  onTransmitMessage,
  borderColor = "border-blue-200",
  iconColor = "text-blue-500"
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onTransmitMessage();
    }
  };

  return (
    <Card className={borderColor}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Atom className={`h-5 w-5 ${iconColor}`} />
            {node.name}
          </div>
          <div className="flex items-center gap-2">
            {node.isEntangled && (
              <Badge variant="default" className={iconColor.includes('blue') ? "bg-blue-500" : "bg-red-500"}>
                <Radio className="h-3 w-3 mr-1" />
                Entangled
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              Ch: {node.resonanceChannel}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Bloch Sphere Visualization */}
        <BlochSphere 
          blochVector={node.blochVector}
          twist={node.twist}
          nodeId={node.id}
        />
        
        {/* Quantum State Display */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-xs text-gray-600">Quaternion</div>
            <div className="font-mono text-xs">
              {node.quaternion.a.toFixed(2)} + {node.quaternion.b.toFixed(2)}i + {node.quaternion.c.toFixed(2)}j + {node.quaternion.d.toFixed(2)}k
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-xs text-gray-600">Twist Angle</div>
            <div className="font-mono text-xs">{(node.twist * 180 / Math.PI).toFixed(1)}°</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-xs text-gray-600">Coherence</div>
            <div className="font-mono text-xs">{node.coherence.toFixed(3)}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-xs text-gray-600">Entropy</div>
            <div className="font-mono text-xs">{node.entropy.toFixed(3)}</div>
          </div>
        </div>
        
        {/* Octonion Display */}
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-xs text-gray-600 mb-1">Octonion Channel</div>
          <div className="font-mono text-xs text-green-600">
            {node.octonion.e0.toFixed(2)} + {node.octonion.e1.toFixed(2)}e₁ + {node.octonion.e2.toFixed(2)}e₂ + {node.octonion.e3.toFixed(2)}e₃ + {node.octonion.e4.toFixed(2)}e₄ + {node.octonion.e5.toFixed(2)}e₅ + {node.octonion.e6.toFixed(2)}e₆ + {node.octonion.e7.toFixed(2)}e₇
          </div>
        </div>
        
        {/* Message Interface */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter quantum message..."
              value={messageInput}
              onChange={(e) => onMessageInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              onClick={onTransmitMessage}
              disabled={!messageInput.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {node.message && (
            <div className={`border rounded p-3 ${
              node.message.includes('[Non-local correlation') 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className={`text-xs mb-1 ${
                node.message.includes('[Non-local correlation') 
                  ? 'text-orange-600' 
                  : 'text-blue-600'
              }`}>
                {node.message.includes('[Non-local correlation') ? 'Non-Local Correlation' : 'Current State'}
              </div>
              <div className="text-sm">{node.message}</div>
              {node.message.includes('[Non-local correlation') && (
                <div className="text-xs text-orange-500 mt-1">
                  ⚡ Received via quantum entanglement correlation
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Activity Indicator */}
        {Date.now() - node.lastActivity.getTime() < 3000 && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Recent quantum activity</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantumNode;