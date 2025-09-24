import React from 'react';
import { QuantumNode } from '../types';
import { Network, Wifi, WifiOff } from 'lucide-react';

interface NetworkOverlayProps {
  node: QuantumNode;
  allNodes: QuantumNode[];
  isEntangled: boolean;
  entanglementStrength: number;
}

export const NetworkOverlay: React.FC<NetworkOverlayProps> = ({
  node,
  allNodes,
  isEntangled,
  entanglementStrength
}) => {
  const connections = isEntangled ? allNodes.filter(n => n.id !== node.id) : [];
  const totalNodes = allNodes.length;
  
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-300">
        <Network size={16} />
        Network Topology
        {isEntangled ? (
          <Wifi size={14} className="text-green-400 animate-pulse" />
        ) : (
          <WifiOff size={14} className="text-gray-500" />
        )}
      </h3>
      
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
        <svg width="100%" height="200" className="w-full">
          {/* Central node */}
          <circle 
            cx="50%" 
            cy="50%" 
            r="30" 
            fill="#8b5cf6" 
            stroke="#a78bfa" 
            strokeWidth="2"
            className="drop-shadow-lg"
          />
          <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dy="5" 
            className="fill-white text-xs font-semibold"
          >
            {node.name}
          </text>
          
          {/* Connection lines and nodes */}
          {connections.map((conn, i) => {
            const angle = (i / connections.length) * 2 * Math.PI;
            const x = 50 + 40 * Math.cos(angle);
            const y = 50 + 40 * Math.sin(angle);
            const opacity = isEntangled ? entanglementStrength : 0.3;
            
            return (
              <g key={conn.id}>
                {/* Connection line */}
                <line 
                  x1="50%" 
                  y1="50%" 
                  x2={`${x}%`} 
                  y2={`${y}%`}
                  stroke={isEntangled ? '#10b981' : '#6b7280'}
                  strokeWidth={isEntangled ? '2' : '1'}
                  strokeDasharray={isEntangled ? 'none' : '5,5'}
                  opacity={opacity}
                  className="transition-all duration-500"
                >
                  {isEntangled && (
                    <animate
                      attributeName="stroke-dasharray"
                      values="0,100;100,0;0,100"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  )}
                </line>
                
                {/* Connection node */}
                <circle 
                  cx={`${x}%`} 
                  cy={`${y}%`} 
                  r="20"
                  fill="#1f2937"
                  stroke={isEntangled ? '#10b981' : '#6b7280'}
                  strokeWidth="2"
                  opacity={opacity}
                  className="transition-all duration-500"
                />
                <text 
                  x={`${x}%`} 
                  y={`${y}%`} 
                  textAnchor="middle" 
                  dy="5"
                  className="fill-white text-xs"
                  opacity={opacity}
                >
                  {conn.name}
                </text>
                
                {/* Data flow indicators */}
                {isEntangled && (
                  <circle 
                    cx="50%" 
                    cy="50%" 
                    r="2" 
                    fill="#10b981"
                    opacity="0.8"
                  >
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      path={`M 0,0 L ${(x - 50) * 4},${(y - 50) * 4}`}
                    />
                  </circle>
                )}
              </g>
            );
          })}
          
          {/* Quantum field visualization */}
          {isEntangled && (
            <g opacity="0.3">
              <circle 
                cx="50%" 
                cy="50%" 
                r="60" 
                fill="none" 
                stroke="url(#quantumGradient)" 
                strokeWidth="1"
              >
                <animate
                  attributeName="r"
                  values="60;80;60"
                  dur="4s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.1;0.3"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
              <defs>
                <radialGradient id="quantumGradient">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </radialGradient>
              </defs>
            </g>
          )}
        </svg>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700/50">
          <div className="text-xs text-gray-300 mb-1">Connection Status</div>
          <div className={`text-lg font-mono font-bold ${
            isEntangled ? 'text-green-400' : 'text-gray-400'
          }`}>
            {isEntangled ? 'Entangled' : 'Isolated'}
          </div>
          {isEntangled && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Strength</span>
                <span>{(entanglementStrength * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${entanglementStrength * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700/50">
          <div className="text-xs text-gray-300 mb-1">Network Size</div>
          <div className="text-lg font-mono text-indigo-400 font-bold">{totalNodes}</div>
          <div className="text-xs text-gray-500 mt-1">
            Connected: {connections.length}
          </div>
        </div>
      </div>
      
      {connections.length > 0 && (
        <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700/50">
          <h4 className="text-sm font-semibold mb-2 text-indigo-300">Active Connections</h4>
          <div className="space-y-2">
            {connections.map((conn) => (
              <div key={conn.id} className="flex justify-between items-center text-xs">
                <span className="text-gray-300">{conn.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{conn.memories.length} memories</span>
                  <div className={`w-2 h-2 rounded-full ${
                    isEntangled ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};