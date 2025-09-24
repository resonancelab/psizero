import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone, 
  Zap, 
  Clock,
  Activity,
  AlertCircle
} from "lucide-react";
import { GlobalAnnouncement } from './types';

interface AnnouncementPanelProps {
  currentUser: string;
  globalAnnouncements: GlobalAnnouncement[];
  entangledUsers: string[];
  onBroadcast: (message: string) => void;
}

export const AnnouncementPanel: React.FC<AnnouncementPanelProps> = ({
  currentUser,
  globalAnnouncements,
  entangledUsers,
  onBroadcast
}) => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState('');

  const handleBroadcast = () => {
    if (currentAnnouncement.trim()) {
      onBroadcast(currentAnnouncement.trim());
      setCurrentAnnouncement('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBroadcast();
    }
  };

  const hasEntanglement = entangledUsers.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Quantum Announcements
          {hasEntanglement && (
            <Badge className="bg-purple-600 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Entangled Network
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Broadcast Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder={`Broadcast to ${hasEntanglement ? 'all entangled nodes' : 'local node only'}...`}
              value={currentAnnouncement}
              onChange={(e) => setCurrentAnnouncement(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleBroadcast} 
              disabled={!currentAnnouncement.trim()}
              className={hasEntanglement ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-600 hover:bg-gray-700'}
            >
              <Megaphone className="mr-2 h-4 w-4" />
              Broadcast
            </Button>
          </div>
          
          {/* Network Status Info */}
          {hasEntanglement ? (
            <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-md p-2 flex items-center gap-2">
              <Zap className="h-3 w-3" />
              <span>
                Connected to {entangledUsers.length} entangled node{entangledUsers.length > 1 ? 's' : ''} - 
                announcements will propagate through quantum channels
              </span>
            </div>
          ) : (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2 flex items-center gap-2">
              <AlertCircle className="h-3 w-3" />
              <span>No quantum entanglements - announcements will be local only</span>
            </div>
          )}
        </div>
        
        {/* Announcements List */}
        <div className="h-64 overflow-y-auto space-y-2">
          {globalAnnouncements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <div className="text-sm">No announcements yet</div>
              <div className="text-xs mt-1">
                {hasEntanglement 
                  ? "Broadcast a message to all entangled nodes!"
                  : "Entangle with other nodes to enable network-wide announcements"
                }
              </div>
            </div>
          ) : (
            globalAnnouncements.map(announcement => (
              <div 
                key={announcement.id} 
                className={`p-3 rounded-md border-l-4 transition-all hover:shadow-sm ${
                  announcement.nodeOrigin === currentUser 
                    ? 'bg-cyan-50 border-cyan-500 border border-cyan-200' 
                    : 'bg-purple-50 border-purple-500 border border-purple-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {announcement.nodeOrigin === currentUser ? 'You' : announcement.nodeName}
                    </span>
                    {announcement.nodeOrigin !== currentUser && (
                      <Badge variant="outline" className="text-xs">
                        Remote Node
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(announcement.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                
                {/* Message */}
                <div className="text-sm text-gray-900 mb-2">
                  {announcement.message}
                </div>
                
                {/* Quantum Properties */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {announcement.entanglementStrength > 0 && (
                      <div className="flex items-center gap-1 text-purple-600">
                        <Zap className="h-3 w-3" />
                        <span>Entanglement: {(announcement.entanglementStrength * 100).toFixed(1)}%</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-blue-600">
                      <Activity className="h-3 w-3" />
                      <span>Resonance: {announcement.resonanceSignature.slice(0, 3).map(r => r.toFixed(2)).join(', ')}...</span>
                    </div>
                  </div>
                  
                  {announcement.entanglementStrength > 0.8 && (
                    <Badge className="bg-red-500 text-xs">
                      High Coherence
                    </Badge>
                  )}
                </div>
                
                {/* Quantum Propagation Effect */}
                {announcement.entanglementStrength > 0 && (
                  <div className="mt-2 text-xs text-purple-600 bg-purple-100 rounded px-2 py-1">
                    ⚡ Propagated through quantum entanglement channels
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Usage Tips */}
        {globalAnnouncements.length > 0 && (
          <div className="text-xs text-gray-500 bg-gray-100 rounded-md p-2">
            <div className="font-medium mb-1">Quantum Broadcasting:</div>
            <div>Announcements propagate instantly through entangled nodes, demonstrating non-local 
            information transfer. Higher entanglement strength results in stronger signal coherence.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};