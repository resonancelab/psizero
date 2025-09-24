import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  Zap, 
  Activity,
  TrendingUp,
  AlertTriangle,
  Target,
  Cpu
} from "lucide-react";
import { NetworkMetrics, QuantumUser, primes } from './types';

interface AnalyticsPanelProps {
  networkMetrics: NetworkMetrics;
  discoveredUsers: QuantumUser[];
  entangledUsers: string[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  networkMetrics,
  discoveredUsers,
  entangledUsers
}) => {
  // Calculate additional analytics
  const onlineUsers = discoveredUsers.filter(u => u.isOnline);
  const averagePhaseCoherence = discoveredUsers.length > 0 
    ? discoveredUsers.reduce((sum, u) => sum + u.phaseCoherence, 0) / discoveredUsers.length 
    : 0;
  
  const averageHolographicDensity = discoveredUsers.length > 0 
    ? discoveredUsers.reduce((sum, u) => sum + u.holographicDensity, 0) / discoveredUsers.length 
    : 0;

  const totalMemoryCount = discoveredUsers.reduce((sum, u) => sum + u.memoryCount, 0);
  
  const entangledUserDetails = discoveredUsers.filter(u => entangledUsers.includes(u.id));
  const avgEntanglementStrength = entangledUserDetails.length > 0
    ? entangledUserDetails.reduce((sum, u) => sum + u.entanglementStrength, 0) / entangledUserDetails.length
    : 0;

  const bellViolationStatus = networkMetrics.bellInequalityViolation > 0.707;
  const quantumSupremacy = networkMetrics.quantumSupremacyIndicator;

  return (
    <div className="space-y-6">
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {networkMetrics.totalNodes}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Users className="h-3 w-3" />
              Total Nodes
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {onlineUsers.length} online
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {networkMetrics.entangledNodes}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Zap className="h-3 w-3" />
              Entangled Nodes
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {(avgEntanglementStrength * 100).toFixed(1)}% avg strength
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {(networkMetrics.nonLocalCorrelation * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Activity className="h-3 w-3" />
              Non-Local Correlation
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {bellViolationStatus ? 'Bell inequality violated' : 'Classical correlation'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className={`text-2xl font-bold mb-1 ${
              bellViolationStatus ? 'text-red-600' : 'text-gray-600'
            }`}>
              {(networkMetrics.bellInequalityViolation * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Target className="h-3 w-3" />
              Bell Violation
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {bellViolationStatus ? 'Quantum confirmed' : 'Below threshold'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quantum Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Quantum Status Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium">Bell Inequality</span>
              <Badge className={bellViolationStatus ? 'bg-red-500' : 'bg-gray-500'}>
                {bellViolationStatus ? 'Violated' : 'Satisfied'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium">Quantum Supremacy</span>
              <Badge className={quantumSupremacy ? 'bg-purple-500' : 'bg-gray-500'}>
                {quantumSupremacy ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium">Network Coherence</span>
              <Badge className={averagePhaseCoherence > 0.8 ? 'bg-green-500' : 'bg-yellow-500'}>
                {(averagePhaseCoherence * 100).toFixed(0)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Network Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Phase Coherence</span>
                <span className="font-mono text-sm">{(averagePhaseCoherence * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                  style={{ width: `${averagePhaseCoherence * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Holographic Density</span>
                <span className="font-mono text-sm">{(averageHolographicDensity * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" 
                  style={{ width: `${averageHolographicDensity * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Global Entanglement</span>
                <span className="font-mono text-sm">{(networkMetrics.globalEntanglementStrength * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                  style={{ width: `${networkMetrics.globalEntanglementStrength * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Prime Resonance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {primes.slice(0, 8).map((prime, i) => {
                // Simulate resonance distribution based on user data
                const resonance = discoveredUsers.length > 0 
                  ? discoveredUsers.reduce((sum, u) => sum + (u.phaseCoherence * Math.sin(prime * u.holographicDensity)), 0) / discoveredUsers.length
                  : 0;
                const normalizedResonance = Math.abs(resonance) * 100;
                
                return (
                  <div key={prime} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono">Prime {prime}</span>
                      <span className="text-gray-500">{normalizedResonance.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full" 
                        style={{ width: `${Math.min(100, normalizedResonance)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              Prime resonance patterns show quantum field oscillations across the network
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Memory and Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Network Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-600">{totalMemoryCount}</div>
              <div className="text-xs text-gray-600">Total Memories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {discoveredUsers.length > 0 ? (totalMemoryCount / discoveredUsers.length).toFixed(1) : '0'}
              </div>
              <div className="text-xs text-gray-600">Avg per Node</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {((onlineUsers.length / Math.max(1, discoveredUsers.length)) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">Online Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {entangledUsers.length > 0 ? ((entangledUsers.length / discoveredUsers.length) * 100).toFixed(0) : '0'}%
              </div>
              <div className="text-xs text-gray-600">Entanglement Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Notes */}
      <Card>
        <CardContent className="p-4">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="font-medium">Quantum Mechanics Notes:</div>
            <div>• Bell inequality violation threshold: 70.7% (√2/2)</div>
            <div>• Quantum supremacy requires &gt;80% correlation with violated Bell inequality</div>
            <div>• Phase coherence measures quantum state preservation across the network</div>
            <div>• Prime resonance shows how quantum information distributes across basis states</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};