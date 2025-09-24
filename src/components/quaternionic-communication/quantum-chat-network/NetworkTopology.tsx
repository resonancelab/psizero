import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  Zap, 
  Users,
  Activity,
  Radio
} from "lucide-react";
import { QuantumUser, NetworkMetrics } from './types';

interface NetworkTopologyProps {
  currentUser: string;
  discoveredUsers: QuantumUser[];
  entangledUsers: string[];
  networkMetrics: NetworkMetrics;
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  currentUser,
  discoveredUsers,
  entangledUsers,
  networkMetrics
}) => {
  const onlineUsers = discoveredUsers.filter(u => u.isOnline);
  const connectedUsers = onlineUsers.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Network Topology
          <Badge variant="outline" className="ml-auto">
            {connectedUsers + 1} nodes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Network Visualization */}
        <div className="bg-gray-50 rounded-lg p-4">
          <svg width="100%" height="300" className="w-full">
            {/* Central node (current user) */}
            <g>
              <circle 
                cx="50%" 
                cy="50%" 
                r="25" 
                fill="#8b5cf6" 
                stroke="#a78bfa" 
                strokeWidth="3"
                className="drop-shadow-lg"
              />
              <text 
                x="50%" 
                y="50%" 
                textAnchor="middle" 
                dy="5" 
                className="fill-white text-xs font-semibold"
              >
                {currentUser.slice(0, 8)}
              </text>
              
              {/* Central node indicator */}
              <circle 
                cx="50%" 
                cy="30%" 
                r="3" 
                fill="#10b981"
                className="animate-pulse"
              />
            </g>
            
            {/* Connected users */}
            {onlineUsers.map((user, i) => {
              const angle = (i / Math.max(1, onlineUsers.length)) * 2 * Math.PI;
              const radius = 35; // Distance from center
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);
              const isEntangled = entangledUsers.includes(user.id);
              
              return (
                <g key={user.id}>
                  {/* Connection line */}
                  <line 
                    x1="50%" 
                    y1="50%" 
                    x2={`${x}%`} 
                    y2={`${y}%`} 
                    stroke={isEntangled ? '#10b981' : '#6b7280'} 
                    strokeWidth={isEntangled ? '3' : '1'} 
                    strokeDasharray={isEntangled ? 'none' : '5,5'}
                    opacity={isEntangled ? user.entanglementStrength : 0.4}
                    className={isEntangled ? 'animate-pulse' : ''}
                  />
                  
                  {/* Quantum field effect for entangled connections */}
                  {isEntangled && (
                    <line 
                      x1="50%" 
                      y1="50%" 
                      x2={`${x}%`} 
                      y2={`${y}%`} 
                      stroke="#10b981" 
                      strokeWidth="1" 
                      opacity="0.3"
                      strokeDasharray="2,2"
                      className="animate-ping"
                    />
                  )}
                  
                  {/* User node */}
                  <circle 
                    cx={`${x}%`} 
                    cy={`${y}%`} 
                    r="18" 
                    fill="#1f2937" 
                    stroke={isEntangled ? '#10b981' : '#6b7280'} 
                    strokeWidth="2"
                    className="drop-shadow-md"
                  />
                  
                  {/* User name */}
                  <text 
                    x={`${x}%`} 
                    y={`${y}%`} 
                    textAnchor="middle" 
                    dy="3" 
                    className="fill-white text-xs font-medium"
                  >
                    {user.name.slice(0, 6)}
                  </text>
                  
                  {/* Entanglement indicator */}
                  {isEntangled && (
                    <circle 
                      cx={`${x}%`} 
                      cy={`${y - 8}%`} 
                      r="2" 
                      fill="#10b981"
                      className="animate-pulse"
                    />
                  )}
                  
                  {/* Phase coherence indicator */}
                  <circle 
                    cx={`${x + 6}%`} 
                    cy={`${y + 6}%`} 
                    r="1.5" 
                    fill={user.phaseCoherence > 0.8 ? '#f59e0b' : '#9ca3af'}
                  />
                </g>
              );
            })}
            
            {/* Network legend */}
            <g transform="translate(10, 10)">
              <text x="0" y="0" className="fill-gray-600 text-xs font-medium">
                Network Legend:
              </text>
              <g transform="translate(0, 15)">
                <line x1="0" y1="0" x2="15" y2="0" stroke="#10b981" strokeWidth="2" />
                <text x="20" y="4" className="fill-gray-600 text-xs">Entangled</text>
              </g>
              <g transform="translate(0, 30)">
                <line x1="0" y1="0" x2="15" y2="0" stroke="#6b7280" strokeWidth="1" strokeDasharray="5,5" />
                <text x="20" y="4" className="fill-gray-600 text-xs">Discovered</text>
              </g>
            </g>
          </svg>
        </div>

        {/* Network Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-md text-center">
            <div className="text-xs text-gray-500 mb-1">Connection Status</div>
            <div className={`text-lg font-mono ${
              entangledUsers.length > 0 ? 'text-green-600' : 'text-gray-600'
            }`}>
              {entangledUsers.length > 0 ? 'Entangled' : 'Isolated'}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md text-center">
            <div className="text-xs text-gray-500 mb-1">Connected Nodes</div>
            <div className="text-lg font-mono text-cyan-600">
              {connectedUsers}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md text-center">
            <div className="text-xs text-gray-500 mb-1">Entangled Links</div>
            <div className="text-lg font-mono text-purple-600">
              {entangledUsers.length}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md text-center">
            <div className="text-xs text-gray-500 mb-1">Network Coherence</div>
            <div className="text-lg font-mono text-blue-600">
              {(networkMetrics.globalEntanglementStrength * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Quantum Field Properties */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Quantum Field Properties
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Non-Local Correlation</span>
              <span className={`font-mono ${
                networkMetrics.nonLocalCorrelation > 0.707 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {(networkMetrics.nonLocalCorrelation * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Bell Inequality</span>
              <Badge className={
                networkMetrics.bellInequalityViolation > 0.707 ? 'bg-red-500' : 'bg-gray-500'
              }>
                {networkMetrics.bellInequalityViolation > 0.707 ? 'Violated' : 'Satisfied'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Quantum Supremacy</span>
              <Badge className={
                networkMetrics.quantumSupremacyIndicator ? 'bg-purple-500' : 'bg-gray-500'
              }>
                {networkMetrics.quantumSupremacyIndicator ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Network Tips */}
        {entangledUsers.length === 0 && onlineUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="text-xs text-blue-700">
              <strong>💡 Network Tip:</strong> Entangle with other nodes to create quantum 
              communication channels. The more entangled connections, the stronger the 
              overall network coherence becomes.
            </div>
          </div>
        )}

        {entangledUsers.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="text-xs text-green-700">
              <strong>⚡ Quantum Network Active:</strong> You have {entangledUsers.length} 
              entangled connection{entangledUsers.length > 1 ? 's' : ''}. Messages and 
              announcements will propagate instantly through quantum channels.
            </div>
          </div>
        )}

        {/* No Users Message */}
        {onlineUsers.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Radio className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <div className="text-sm">No other nodes detected</div>
            <div className="text-xs mt-1">Scanning quantum field for connections...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};