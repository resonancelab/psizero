import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Radio, Network, UserPlus } from "lucide-react";
import { NetworkPhase } from './types';

interface ConnectionInterfaceProps {
  networkPhase: NetworkPhase;
  onConnect: (userName: string) => void;
}

export const ConnectionInterface: React.FC<ConnectionInterfaceProps> = ({
  networkPhase,
  onConnect
}) => {
  const [userName, setUserName] = useState('');

  const handleConnect = () => {
    if (userName.trim()) {
      onConnect(userName.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConnect();
    }
  };

  if (networkPhase === 'connecting') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-12 text-center">
          <div className="animate-spin h-16 w-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Establishing Quantum Connection...</h3>
          <p className="text-gray-600">Synchronizing with quantum field...</p>
          <div className="mt-4 text-sm text-gray-500">
            <div className="animate-pulse">Initializing prime basis resonance spaces...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (networkPhase === 'disconnected') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-6 w-6" />
            Connect to Quantum Network
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="mb-6">
              <Radio className="h-16 w-16 mx-auto text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Join the Quantum Communication Network</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Enter your name to become a quantum node and discover other users for non-local communication.
                Experience genuine quantum entanglement effects in real-time.
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                placeholder="Enter your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="max-w-sm mx-auto"
                autoFocus
              />
              <Button 
                onClick={handleConnect}
                disabled={!userName.trim()}
                className="w-full max-w-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Connect as Quantum Node
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-500 max-w-md mx-auto">
              <div className="text-center">
                <div className="font-semibold text-purple-600">Quantum Entanglement</div>
                <div>Connect instantly with other nodes</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">Non-Local Effects</div>
                <div>Experience Bell inequality violations</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};