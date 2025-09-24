import React, { useState } from 'react';
import { QuantumNode, QuantumMemory } from '../types';
import { Zap, Search, Eye, EyeOff } from 'lucide-react';
import { searchHolographicMemories } from '../holographic-encoding';
import HolographicVisualizer from '../HolographicVisualizer';

interface HolographicOverlayProps {
  node: QuantumNode;
  onStoreMemory: (nodeId: string) => Promise<void>;
  onUpdateMemoryInput: (nodeId: string, value: string) => void;
  onUpdateSearchQuery: (nodeId: string, value: string) => void;
  onSelectFragment: (nodeId: string, memoryId: string) => void;
}

export const HolographicOverlay: React.FC<HolographicOverlayProps> = ({
  node,
  onStoreMemory,
  onUpdateMemoryInput,
  onUpdateSearchQuery,
  onSelectFragment
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [show3D, setShow3D] = useState(false);

  const handleStoreMemory = async () => {
    if (!node.currentMemory.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      await onStoreMemory(node.id);
    } finally {
      setIsLoading(false);
    }
  };

  const searchResults = searchHolographicMemories(node.memories, node.searchQuery);

  return (
    <div className="space-y-4">
      {/* Memory encoding section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-300">
          <Zap size={16} />
          Holographic Memory Encoder
        </h3>
        
        <textarea
          value={node.currentMemory}
          onChange={(e) => onUpdateMemoryInput(node.id, e.target.value)}
          placeholder={`Enter memory for ${node.name}...`}
          className="w-full h-24 p-3 bg-gray-900/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm resize-none"
          disabled={isLoading}
        />
        
        <button
          onClick={handleStoreMemory}
          disabled={!node.currentMemory.trim() || isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 px-4 py-2 rounded-md font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Encoding Holographically...
            </>
          ) : (
            <>
              <Zap size={16} />
              Encode Holographically
            </>
          )}
        </button>
      </div>

      {/* Holographic search section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-cyan-300">
          <Search size={16} />
          Holographic Search
        </h3>
        
        <div className="relative">
          <input
            type="text"
            value={node.searchQuery}
            onChange={(e) => onUpdateSearchQuery(node.id, e.target.value)}
            placeholder="Search memories..."
            className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none text-sm pr-10"
          />
          <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800 space-y-2">
          {searchResults.map((result) => (
            <div 
              key={result.id}
              className={`p-3 bg-gray-800/50 rounded-md border-l-4 hover:bg-gray-800/70 transition-all cursor-pointer ${
                result.isNonLocal ? 'border-green-500' : 'border-purple-500'
              }`}
              onClick={() => onSelectFragment(node.id, result.id)}
            >
              <div className="text-xs text-gray-400 mb-1 flex items-center justify-between">
                <span>
                  Resonance: {result.resonance.toFixed(3)} | 
                  Fragments: {result.matchingFragments}
                  {result.isNonLocal && (
                    <span className="ml-2 bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-xs">
                      Non-local
                    </span>
                  )}
                </span>
              </div>
              <div className="text-white text-sm line-clamp-2">{result.text}</div>
              <div className="text-xs text-gray-500 mt-1">
                Total Fragments: {result.holographicData.totalFragments}
              </div>
            </div>
          ))}
          {node.searchQuery && searchResults.length === 0 && (
            <div className="text-gray-500 text-center py-4">
              No resonant memories found for "{node.searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Holographic field visualization */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-300">
            <Eye size={16} />
            Holographic Field
          </h3>
          <button
            onClick={() => setShow3D(!show3D)}
            className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-xs"
          >
            {show3D ? <EyeOff size={14} /> : <Eye size={14} />}
            {show3D ? '2D View' : '3D View'}
          </button>
        </div>
        
        <div className="relative bg-black/40 rounded-lg border border-gray-700/50 overflow-hidden">
          <HolographicVisualizer
            node={node}
            onFragmentSelect={(memoryId) => onSelectFragment(node.id, memoryId)}
          />
          
          {/* Field overlay info */}
          <div className="absolute top-2 left-2 bg-black/60 rounded px-2 py-1 text-xs text-gray-300">
            Field: {node.holographicField.length} points | 
            Memories: {node.memories.length}
          </div>
          
          {node.memories.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-gray-400">
                <Zap size={32} className="mx-auto mb-2 opacity-50" />
                <p>No holographic field generated</p>
                <p className="text-xs">Encode memories to see visualization</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-gray-800/50 p-2 rounded-md text-center border border-gray-700/50">
          <div className="text-gray-300">Phase Coherence</div>
          <div className="text-cyan-400 font-mono text-sm">{node.phaseCoherence.toFixed(3)}</div>
        </div>
        <div className="bg-gray-800/50 p-2 rounded-md text-center border border-gray-700/50">
          <div className="text-gray-300">Field Density</div>
          <div className="text-purple-400 font-mono text-sm">{node.holographicDensity.toFixed(3)}</div>
        </div>
        <div className="bg-gray-800/50 p-2 rounded-md text-center border border-gray-700/50">
          <div className="text-gray-300">Resolution</div>
          <div className="text-emerald-400 font-mono text-sm">{node.holographicResolution}</div>
        </div>
      </div>
    </div>
  );
};