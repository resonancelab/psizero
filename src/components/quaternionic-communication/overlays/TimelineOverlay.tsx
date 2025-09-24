import React from 'react';
import { QuantumNode } from '../types';
import { Clock, Circle } from 'lucide-react';

interface TimelineOverlayProps {
  node: QuantumNode;
  onSelectFragment: (nodeId: string, memoryId: string) => void;
}

export const TimelineOverlay: React.FC<TimelineOverlayProps> = ({ node, onSelectFragment }) => {
  const sortedMemories = [...node.memories].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-amber-300">
        <Clock size={16} />
        Memory Timeline
      </h3>
      
      <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-gray-800 space-y-2">
        {sortedMemories.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <Clock size={32} className="mx-auto mb-2 opacity-50" />
            <p>No memories encoded yet</p>
            <p className="text-xs">Start by encoding some information</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-purple-500 to-cyan-500 opacity-30" />
            
            {sortedMemories.map((memory, i) => (
              <div 
                key={memory.id}
                className="relative flex gap-3 p-3 bg-gray-800/50 rounded-md hover:bg-gray-800/70 transition-all cursor-pointer border border-gray-700/50 hover:border-amber-500/30 group"
                onClick={() => onSelectFragment(node.id, memory.id)}
              >
                {/* Timeline dot */}
                <div className="flex-shrink-0 relative">
                  <Circle 
                    size={8}
                    className={`mt-2 ${
                      memory.isNonLocal 
                        ? 'text-green-500 fill-green-500' 
                        : 'text-purple-500 fill-purple-500'
                    }`}
                  />
                  {memory.isNonLocal && (
                    <div className="absolute -inset-1 animate-ping">
                      <Circle size={10} className="text-green-400 opacity-75" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <span className="font-medium">
                        {new Date(memory.timestamp).toLocaleString()}
                      </span>
                      <span className="text-amber-400">
                        {formatTimeAgo(memory.timestamp)}
                      </span>
                      {memory.isNonLocal && (
                        <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-xs">
                          Non-local
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-white mb-2 line-clamp-2 group-hover:text-amber-100">
                    {memory.text}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>Fragments: {memory.holographicData.totalFragments}</span>
                      <span>Intensity: {memory.holographicData.avgIntensity.toFixed(3)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <div className="w-12 bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            memory.isNonLocal 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                              : 'bg-gradient-to-r from-purple-500 to-pink-400'
                          }`}
                          style={{ 
                            width: `${Math.min(100, memory.holographicData.avgIntensity * 200)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {sortedMemories.length > 0 && (
        <div className="text-xs text-gray-500 flex justify-between">
          <span>Total: {sortedMemories.length} memories</span>
          <span>
            Non-local: {sortedMemories.filter(m => m.isNonLocal).length}
          </span>
        </div>
      )}
    </div>
  );
};