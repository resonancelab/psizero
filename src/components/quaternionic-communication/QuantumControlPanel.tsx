import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Activity,
  Radio,
  Target,
  GitBranch
} from "lucide-react";
import { RNETSpace } from './types';

interface QuantumControlPanelProps {
  quantumSpace: RNETSpace;
  isRunning: boolean;
  onStartEvolution: () => void;
  onStopEvolution: () => void;
  onInitializeEntanglement: () => void;
  onSeparateNodes: () => void;
  onReset: () => void;
}

const QuantumControlPanel: React.FC<QuantumControlPanelProps> = ({
  quantumSpace,
  isRunning,
  onStartEvolution,
  onStopEvolution,
  onInitializeEntanglement,
  onSeparateNodes,
  onReset
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-violet-500" />
          Quantum Control Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={isRunning ? onStopEvolution : onStartEvolution}
              className={isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isRunning ? 'Pause Evolution' : 'Start Evolution'}
            </Button>
            
            <Button 
              onClick={onInitializeEntanglement}
              disabled={quantumSpace.entanglementState !== 'disconnected'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <GitBranch className="h-4 w-4 mr-2" />
              Initialize Entanglement
            </Button>
            
            <Button 
              onClick={onSeparateNodes}
              disabled={quantumSpace.entanglementState !== 'entangled'}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Target className="h-4 w-4 mr-2" />
              SEPARATE NODES
            </Button>
            
            <Button onClick={onReset} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span>State: <strong>{quantumSpace.entanglementState.toUpperCase()}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-blue-500" />
              <span>Nodes: <strong>{quantumSpace.connectedNodes}</strong></span>
            </div>
          </div>
        </div>
        
        {/* Additional Status Info */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-violet-600">
                {quantumSpace.basis.primes.length}D
              </div>
              <div className="text-xs text-gray-600">Prime Basis</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {(quantumSpace.telemetry.resonanceStrength * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">Resonance</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {(quantumSpace.telemetry.coherence * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">Coherence</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {(quantumSpace.telemetry.nonLocalCorrelation * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">Non-Local</div>
            </div>
          </div>
        </div>

        {/* Phase Evolution Display */}
        {isRunning && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-gray-600 mb-2">Prime Basis Evolution</div>
            <div className="flex flex-wrap gap-1">
              {quantumSpace.basis.primes.slice(0, 10).map((prime, i) => (
                <Badge 
                  key={prime} 
                  variant="outline" 
                  className="text-xs"
                  style={{
                    backgroundColor: `hsl(${(quantumSpace.basis.phases[i] * 180 / Math.PI) % 360}, 50%, 90%)`
                  }}
                >
                  p{prime}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantumControlPanel;