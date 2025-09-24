import React, { useState } from 'react';
import { QuantumNode, GlobalAnnouncement } from '../types';
import { Radio, Send } from 'lucide-react';

interface AnnounceOverlayProps {
  node: QuantumNode;
  announcements: GlobalAnnouncement[];
  isEntangled: boolean;
  entanglementStrength: number;
  onBroadcast: (nodeId: string, message: string) => Promise<void>;
}

export const AnnounceOverlay: React.FC<AnnounceOverlayProps> = ({
  node,
  announcements,
  isEntangled,
  entanglementStrength,
  onBroadcast
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter announcements based on entanglement
  const nodeAnnouncements = announcements.filter(a => 
    isEntangled || a.nodeOrigin === node.id
  );

  const handleBroadcast = async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      await onBroadcast(node.id, input);
      setInput('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBroadcast();
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-cyan-300">
        <Radio size={16} />
        Quantum Announcements
        {isEntangled && (
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
            Entangled Network
          </span>
        )}
      </h3>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Broadcast to ${isEntangled ? 'all entangled nodes' : 'local node only'}...`}
          className="flex-1 p-2 bg-gray-900/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none text-sm"
          disabled={isLoading}
        />
        <button
          onClick={handleBroadcast}
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 rounded-md transition-colors flex items-center gap-2"
        >
          <Send size={16} />
          Broadcast
        </button>
      </div>
      
      <div className="h-48 overflow-y-auto bg-gray-900/50 rounded-lg p-3 space-y-2 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800">
        {nodeAnnouncements.map((ann) => (
          <div 
            key={ann.id}
            className={`p-2 bg-gray-800/50 rounded-md border-l-4 transition-all ${
              ann.nodeOrigin === node.id ? 'border-cyan-500' : 'border-purple-500'
            } ${isEntangled && ann.nodeOrigin !== node.id ? 'animate-[quantumPulse_2s_ease-out]' : ''}`}
          >
            <div className="text-xs text-gray-400 flex justify-between items-center">
              <span className="font-medium">{ann.nodeName}</span>
              <span>{new Date(ann.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="text-white mt-1">{ann.message}</div>
            {isEntangled && (
              <div className="text-xs text-purple-400 mt-1 flex items-center gap-2">
                <span>Entanglement: {(ann.entanglementStrength * 100).toFixed(1)}%</span>
                <div className="flex-1 bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${ann.entanglementStrength * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        {nodeAnnouncements.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            No announcements yet. Be the first to broadcast!
          </div>
        )}
      </div>
    </div>
  );
};