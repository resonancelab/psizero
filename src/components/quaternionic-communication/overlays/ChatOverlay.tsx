import React, { useState, useRef, useEffect } from 'react';
import { QuantumNode, ChatMessage } from '../types';
import { MessageCircle, Send } from 'lucide-react';

interface ChatOverlayProps {
  node: QuantumNode;
  onSendMessage: (nodeId: string, message: string) => Promise<void>;
}

export const ChatOverlay: React.FC<ChatOverlayProps> = ({ node, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [node.chatHistory]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      await onSendMessage(node.id, input);
      setInput('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-300">
        <MessageCircle size={16} />
        Holographic Chat Interface
      </h3>
      
      <div className="h-48 overflow-y-auto bg-gray-900/50 rounded-lg p-3 space-y-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
        {node.chatHistory.map((msg, index) => (
          <div 
            key={index}
            className={`animate-[bubbleAppear_0.3s_ease-out] ${
              msg.role === 'user' ? 'text-blue-300' : 'text-green-300'
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">
              {msg.role === 'user' ? 'You' : node.name}
            </div>
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-400 text-sm animate-pulse">
            <div className="text-xs text-gray-500 mb-1">{node.name}</div>
            <div>Processing holographic resonance patterns...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about encoded memories..."
          className="flex-1 p-2 bg-gray-900/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-sm"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-md transition-colors flex items-center gap-2"
        >
          <Send size={16} />
          Send
        </button>
      </div>
    </div>
  );
};