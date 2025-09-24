import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Zap, 
  Activity, 
  MessageSquare,
  Megaphone,
  BarChart3,
  Network,
  AlertTriangle
} from "lucide-react";
import { NetworkMetrics, OverlayType, OVERLAY_TYPES } from './types';

interface NetworkStatusBarProps {
  currentUser: string;
  activeOverlay: OverlayType;
  networkMetrics: NetworkMetrics;
  onOverlayChange: (overlay: OverlayType) => void;
}

export const NetworkStatusBar: React.FC<NetworkStatusBarProps> = ({
  currentUser,
  activeOverlay,
  networkMetrics,
  onOverlayChange
}) => {
  const overlayConfig = [
    { type: OVERLAY_TYPES.CHAT, icon: MessageSquare, label: 'Chat' },
    { type: OVERLAY_TYPES.ANNOUNCE, icon: Megaphone, label: 'Announce' },
    { type: OVERLAY_TYPES.ANALYSIS, icon: BarChart3, label: 'Analysis' },
    { type: OVERLAY_TYPES.NETWORK, icon: Network, label: 'Network' }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* User Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Connected as {currentUser}</span>
            </div>
            
            {/* Overlay Switcher */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              {overlayConfig.map(({ type, icon: Icon, label }) => (
                <Button
                  key={type}
                  variant={activeOverlay === type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onOverlayChange(type)}
                  className="flex items-center gap-1 px-3 py-1.5"
                >
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Network Metrics */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Nodes: <span className="font-mono font-semibold">{networkMetrics.totalNodes}</span></span>
            </div>
            
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-purple-500" />
              <span>Entangled: <span className="font-mono font-semibold">{networkMetrics.entangledNodes}</span></span>
            </div>
            
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4 text-green-500" />
              <span>Correlation: <span className="font-mono font-semibold">{(networkMetrics.nonLocalCorrelation * 100).toFixed(1)}%</span></span>
            </div>
            
            {/* Bell Inequality Violation Alert */}
            {networkMetrics.bellInequalityViolation > 0.707 && (
              <Badge className="bg-red-500 animate-pulse flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Bell Violation!
              </Badge>
            )}
            
            {/* Quantum Supremacy Indicator */}
            {networkMetrics.quantumSupremacyIndicator && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Quantum Supremacy
              </Badge>
            )}
          </div>
        </div>

        {/* Expanded Metrics Row */}
        {networkMetrics.entangledNodes > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-4">
                <span>Global Entanglement: <span className="font-mono text-purple-600">{(networkMetrics.globalEntanglementStrength * 100).toFixed(1)}%</span></span>
                {networkMetrics.bellInequalityViolation > 0 && (
                  <span>Bell Violation: <span className="font-mono text-red-600">{(networkMetrics.bellInequalityViolation * 100).toFixed(1)}%</span></span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>QCR</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>RNET</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>NLC</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};