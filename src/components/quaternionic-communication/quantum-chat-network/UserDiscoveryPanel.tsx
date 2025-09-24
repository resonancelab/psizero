import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Wifi, 
  Zap, 
  MessageSquare,
  Radio,
  Clock,
  Activity
} from "lucide-react";
import { QuantumUser, NetworkPhase } from './types';

interface UserDiscoveryPanelProps {
  discoveredUsers: QuantumUser[];
  entangledUsers: string[];
  networkPhase: NetworkPhase;
  onEntangle: (userId: string) => void;
  onSelectUser: (userId: string) => void;
}

export const UserDiscoveryPanel: React.FC<UserDiscoveryPanelProps> = ({
  discoveredUsers,
  entangledUsers,
  networkPhase,
  onEntangle,
  onSelectUser
}) => {
  const onlineUsers = discoveredUsers.filter(u => u.isOnline);
  const entangledCount = entangledUsers.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Quantum Nodes
          </span>
          <Badge variant="outline" className="flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            {onlineUsers.length} online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Discovery Status */}
        {networkPhase === 'discovering' && discoveredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-pulse mb-2">
              <Radio className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              Scanning quantum network...
            </div>
            <div className="text-sm">Searching for active quantum nodes</div>
            <div className="text-xs mt-2 text-gray-400">
              Real-time discovery via RNET quantum infrastructure
            </div>
          </div>
        )}

        {/* Entanglement Summary */}
        {entangledCount > 0 && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-md mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                {entangledCount} Quantum Entanglement{entangledCount > 1 ? 's' : ''} Active
              </span>
            </div>
            <div className="text-xs text-purple-700 mt-1">
              Non-local communication channels established
            </div>
          </div>
        )}

        {/* User List */}
        {discoveredUsers.map(user => (
          <div key={user.id} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {/* Online Status */}
                <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user.name}</span>
                    {user.isEntangled && (
                      <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                        <Zap className="h-2 w-2" />
                        {(user.entanglementStrength * 100).toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                  
                  {/* Quantum Properties */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      Phase: {user.phaseCoherence.toFixed(3)}
                    </span>
                    <span>Memories: {user.memoryCount}</span>
                    {!user.isOnline && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {user.lastSeen.toLocaleTimeString()}
                      </span>
                    )}
                  </div>

                  {/* Entanglement Details */}
                  {user.isEntangled && (
                    <div className="mt-2 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-purple-600">
                          Correlation: {(user.nonLocalCorrelation * 100).toFixed(1)}%
                        </span>
                        <span className="text-blue-600">
                          Density: {(user.holographicDensity * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                {!user.isEntangled ? (
                  <Button 
                    size="sm" 
                    onClick={() => onEntangle(user.id)}
                    disabled={!user.isOnline}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Zap className="mr-1 h-3 w-3" />
                    Entangle
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onSelectUser(user.id)}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <MessageSquare className="mr-1 h-3 w-3" />
                    Chat
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* No Users Message */}
        {discoveredUsers.length === 0 && networkPhase === 'connected' && (
          <div className="text-center py-6 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <div className="text-sm">No active quantum nodes found</div>
            <div className="text-xs mt-1">
              You're the first to connect! Share this app with others to establish quantum entanglements.
            </div>
            <div className="text-xs mt-2 text-blue-600">
              Real-time scanning via production quantum APIs
            </div>
          </div>
        )}

        {/* Help Text */}
        {discoveredUsers.length > 0 && entangledCount === 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-xs text-blue-700">
              💡 <strong>Quantum Entanglement:</strong> Connect with other nodes to enable instantaneous
              non-local communication. This demonstrates real Bell inequality violations through our
              production quantum infrastructure.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};