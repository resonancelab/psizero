import React from 'react';
import { QuantumNode, OverlayType } from './types';
import { useQuantumState } from './useQuantumState';
import { Plus, Minus, Radio, Wifi, WifiOff, Link, Unlink, Play, Pause } from 'lucide-react';
import {
  HolographicOverlay,
  ChatOverlay,
  AnnounceOverlay,
  AnalysisOverlay,
  TimelineOverlay,
  NetworkOverlay
} from './overlays';

interface MultiNodePanelProps {
  className?: string;
}

export const MultiNodePanel: React.FC<MultiNodePanelProps> = ({ className }) => {
  const {
    nodes,
    globalAnnouncements,
    isEntangled,
    entanglementStrength,
    nonLocalCorrelation,
    isRunning,
    addNode,
    removeNode,
    updateNodeMemoryInput,
    updateNodeSearchQuery,
    switchOverlay,
    storeHolographicMemory,
    selectFragment,
    sendChatMessage,
    broadcastAnnouncement,
    startEvolution,
    stopEvolution,
    initializeEntanglement,
    separateNodes
  } = useQuantumState();

  const overlayTypes: { type: OverlayType; icon: string; label: string }[] = [
    { type: 'holographic', icon: 'M12 2v20M2 12h20', label: 'Holographic' },
    { type: 'chat', icon: 'M8 12h8m-8 4h8m-8 -8h8', label: 'Chat' },
    { type: 'announce', icon: 'M3 12l18 0', label: 'Announce' },
    { type: 'analysis', icon: 'M3 3v18h18', label: 'Analysis' },
    { type: 'timeline', icon: 'M12 6v6l4 2', label: 'Timeline' },
    { type: 'network', icon: 'M12 2l0 9m0 0l-6 4m6 -4l6 4', label: 'Network' }
  ];

  const renderOverlayContent = (node: QuantumNode) => {
    switch (node.activeOverlay) {
      case 'holographic':
        return (
          <HolographicOverlay
            node={node}
            onStoreMemory={storeHolographicMemory}
            onUpdateMemoryInput={updateNodeMemoryInput}
            onUpdateSearchQuery={updateNodeSearchQuery}
            onSelectFragment={selectFragment}
          />
        );
      case 'chat':
        return (
          <ChatOverlay
            node={node}
            onSendMessage={sendChatMessage}
          />
        );
      case 'announce':
        return (
          <AnnounceOverlay
            node={node}
            announcements={globalAnnouncements}
            isEntangled={isEntangled}
            entanglementStrength={entanglementStrength}
            onBroadcast={broadcastAnnouncement}
          />
        );
      case 'analysis':
        return (
          <AnalysisOverlay node={node} />
        );
      case 'timeline':
        return (
          <TimelineOverlay
            node={node}
            onSelectFragment={selectFragment}
          />
        );
      case 'network':
        return (
          <NetworkOverlay
            node={node}
            allNodes={nodes}
            isEntangled={isEntangled}
            entanglementStrength={entanglementStrength}
          />
        );
      default:
        return <div className="text-gray-500">Select an overlay mode</div>;
    }
  };

  return (
    <div className={className}>
      {/* Enhanced Global Controls */}
      <div className="mb-6 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-purple-500/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={isRunning ? stopEvolution : startEvolution}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                isRunning 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              <span>{isRunning ? 'Pause Encoding' : 'Start Encoding'}</span>
            </button>

            <button
              onClick={isEntangled ? separateNodes : initializeEntanglement}
              disabled={!isEntangled && nodes.length < 2}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                isEntangled 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600'
              }`}
            >
              {isEntangled ? <Unlink size={16} /> : <Link size={16} />}
              <span>{isEntangled ? 'Break Entanglement' : 'Initialize Entanglement'}</span>
            </button>

            <button
              onClick={addNode}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <Plus size={16} />
              Add Node
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm mt-4 sm:mt-0">
            <div className="flex items-center gap-2">
              <span>Nodes: <span className="font-mono text-cyan-400">{nodes.length}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span>Entanglement: <span className="font-mono text-green-400">{entanglementStrength.toFixed(3)}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span>Correlation: <span className="font-mono text-purple-400">{nonLocalCorrelation.toFixed(3)}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Node Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <div key={node.id} className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio size={20} className="text-purple-400" />
                <h3 className="text-xl font-semibold">{node.name}</h3>
                {isEntangled && (
                  <Wifi size={16} className="text-green-400 animate-pulse" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-400">
                  <span>{node.memories.length}</span> memories
                </div>
                <button
                  onClick={() => removeNode(node.id)}
                  className="text-gray-400 hover:text-red-500 text-lg"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Enhanced Overlay Toolbar */}
            <div className="flex gap-1 mb-3 p-1 bg-gray-800/50 rounded-lg">
              {overlayTypes.map((overlay) => (
                <button
                  key={overlay.type}
                  onClick={() => switchOverlay(node.id, overlay.type)}
                  className={`flex-1 p-2 rounded transition-colors ${
                    node.activeOverlay === overlay.type 
                      ? 'bg-purple-600' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title={overlay.label}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d={overlay.icon}></path>
                  </svg>
                </button>
              ))}
            </div>

            {/* Enhanced Overlay Content */}
            <div className="overlay-enter">
              {renderOverlayContent(node)}
            </div>

            {/* Enhanced Node Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm mt-4">
              <div className="bg-gray-800/50 p-2 rounded-md">
                <div className="text-xs text-gray-300">Phase Coherence</div>
                <div className="text-lg font-mono text-cyan-400">{node.phaseCoherence.toFixed(3)}</div>
              </div>
              <div className="bg-gray-800/50 p-2 rounded-md">
                <div className="text-xs text-gray-300">Holographic Density</div>
                <div className="text-lg font-mono text-purple-400">{node.holographicDensity.toFixed(3)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {nodes.length === 0 && (
        <div className="text-center py-12">
          <Radio size={64} className="mx-auto mb-4 text-purple-400/50" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Quantum Nodes</h3>
          <p className="text-gray-500 mb-6">Create your first node to begin holographic encoding</p>
          <button
            onClick={addNode}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Create First Node
          </button>
        </div>
      )}
    </div>
  );
};