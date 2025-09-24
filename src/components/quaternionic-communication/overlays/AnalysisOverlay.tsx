import React from 'react';
import { QuantumNode } from '../types';
import { BarChart3 } from 'lucide-react';
import { PRIMES } from '../holographic-encoding';

interface AnalysisOverlayProps {
  node: QuantumNode;
}

export const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({ node }) => {
  const totalFragments = node.memories.reduce((sum, m) => sum + m.holographicData.totalFragments, 0);
  const avgIntensity = node.memories.length > 0 
    ? node.memories.reduce((sum, m) => sum + m.holographicData.avgIntensity, 0) / node.memories.length 
    : 0;
  const nonLocalMemories = node.memories.filter(m => m.isNonLocal).length;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-300">
        <BarChart3 size={16} />
        Holographic Analysis
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700/50">
          <div className="text-xs text-gray-300 mb-1">Total Memories</div>
          <div className="text-2xl font-mono text-cyan-400 font-bold">{node.memories.length}</div>
        </div>
        <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700/50">
          <div className="text-xs text-gray-300 mb-1">Total Fragments</div>
          <div className="text-2xl font-mono text-purple-400 font-bold">{totalFragments}</div>
        </div>
        <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700/50">
          <div className="text-xs text-gray-300 mb-1">Avg Intensity</div>
          <div className="text-2xl font-mono text-green-400 font-bold">{avgIntensity.toFixed(3)}</div>
        </div>
        <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700/50">
          <div className="text-xs text-gray-300 mb-1">Non-Local</div>
          <div className="text-2xl font-mono text-yellow-400 font-bold">{nonLocalMemories}</div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700/50">
        <h4 className="text-sm font-semibold mb-3 text-emerald-300">Prime Resonance Distribution</h4>
        <div className="space-y-2">
          {PRIMES.slice(0, 8).map((prime, i) => {
            const resonance = node.phaseRing ? node.phaseRing[i]?.amplitude || 0 : 0;
            const width = Math.min(100, Math.max(2, resonance * 200));
            return (
              <div key={prime} className="flex items-center gap-3">
                <span className="text-xs w-6 text-gray-300 font-mono">{prime}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-3 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${width}%` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                </div>
                <span className="text-xs w-12 text-gray-400 font-mono">{resonance.toFixed(3)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700/50">
        <h4 className="text-sm font-semibold mb-3 text-emerald-300">Quantum Metrics</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-300">Phase Coherence</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
                  style={{ width: `${node.phaseCoherence * 100}%` }}
                />
              </div>
              <span className="text-xs text-cyan-400 font-mono w-12">{node.phaseCoherence.toFixed(3)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-300">Holographic Density</span>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                  style={{ width: `${node.holographicDensity * 100}%` }}
                />
              </div>
              <span className="text-xs text-purple-400 font-mono w-12">{node.holographicDensity.toFixed(3)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};