import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  Zap, 
  AlertCircle,
  Activity,
  Clock
} from "lucide-react";
import { QuantumMessage, QuantumUser } from './types';

interface ChatInterfaceProps {
  selectedUser: QuantumUser | null;
  currentUser: string;
  messages: QuantumMessage[];
  isUserEntangled: (userId: string) => boolean;
  getEntanglementStrength: (userId: string) => number;
  onSendMessage: (content: string) => void;
  onSelectUser?: (userId: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  selectedUser,
  currentUser,
  messages,
  isUserEntangled,
  getEntanglementStrength,
  onSendMessage,
  onSelectUser
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      onSendMessage(currentMessage.trim());
      setCurrentMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedUser) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Quantum Communication Channel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Select a User to Chat</h3>
            <p className="text-sm max-w-md mx-auto">
              Entangle with other quantum nodes to enable non-local communication.
              Once entangled, your messages will appear instantaneously through quantum correlation.
            </p>
            <div className="mt-6 text-xs text-gray-400">
              💡 Quantum entanglement allows for faster-than-light communication by sharing quantum states
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isEntangled = isUserEntangled(selectedUser.id);
  const entanglementStrength = getEntanglementStrength(selectedUser.id);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Quantum Communication Channel
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              {selectedUser.name}
            </Badge>
            {isEntangled && (
              <Badge className="bg-purple-600 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Entangled
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quantum State Alert */}
        {isEntangled && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-900 font-medium">
                ⚡ NON-LOCAL QUANTUM COMMUNICATION ACTIVE
              </span>
            </div>
            <div className="text-xs text-orange-700 mt-1 flex items-center gap-4">
              <span>Entanglement strength: {(entanglementStrength * 100).toFixed(1)}%</span>
              <span>Correlation: {(selectedUser.nonLocalCorrelation * 100).toFixed(1)}%</span>
              <span>Phase coherence: {selectedUser.phaseCoherence.toFixed(3)}</span>
            </div>
            <div className="text-xs text-orange-600 mt-1">
              Messages will appear instantaneously through quantum correlation
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="h-64 overflow-y-auto border rounded-md p-3 space-y-3 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No messages yet</div>
              <div className="text-xs mt-1">
                {isEntangled 
                  ? "Send a message through the quantum channel!"
                  : "Establish quantum entanglement first to enable secure communication"
                }
              </div>
            </div>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex ${msg.fromUser === currentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                    msg.fromUser === currentUser 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  <div className="text-sm">{msg.content}</div>
                  <div className={`text-xs mt-1 flex items-center justify-between ${
                    msg.fromUser === currentUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                    {msg.isNonLocal && (
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        <span>Non-local ({(msg.correlationCoefficient * 100).toFixed(0)}%)</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Quantum Properties */}
                  {msg.isNonLocal && (
                    <div className={`text-xs mt-1 ${
                      msg.fromUser === currentUser ? 'text-blue-200' : 'text-purple-600'
                    }`}>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Phase: {msg.quantumPhase.toFixed(3)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        <div className="space-y-2">
          {!isEntangled && (
            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2 flex items-center gap-2">
              <AlertCircle className="h-3 w-3" />
              <span>Establish quantum entanglement first to enable secure communication</span>
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              placeholder={
                isEntangled 
                  ? "Type your quantum message..."
                  : "Entangle first to enable messaging..."
              }
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={!isEntangled || !selectedUser.isOnline}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!currentMessage.trim() || !isEntangled || !selectedUser.isOnline}
              className={isEntangled ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {!selectedUser.isOnline && (
            <div className="text-xs text-gray-500 text-center">
              {selectedUser.name} is currently offline
            </div>
          )}
        </div>

        {/* Quantum Technical Info */}
        {isEntangled && messages.length > 0 && (
          <div className="text-xs text-gray-500 bg-gray-100 rounded-md p-2">
            <div className="font-medium mb-1">Quantum Channel Properties:</div>
            <div className="grid grid-cols-2 gap-2">
              <span>Prime Resonance: Active</span>
              <span>Bell Inequality: {selectedUser.nonLocalCorrelation > 0.707 ? 'Violated' : 'Satisfied'}</span>
              <span>Holographic Density: {(selectedUser.holographicDensity * 100).toFixed(1)}%</span>
              <span>Memory Count: {selectedUser.memoryCount}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};