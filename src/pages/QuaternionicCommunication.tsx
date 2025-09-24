import React from 'react';
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import {
  Network,
  Users,
  MessageSquare,
  Zap,
  Wifi
} from "lucide-react";

// Import our focused chat network component
import { QuantumChatNetwork } from '../components/quaternionic-communication/QuantumChatNetwork';

const QuaternionicCommunication = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <Section background="gradient" className="py-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur px-4 py-2 text-sm text-white mb-6">
            <Network className="mr-2 h-4 w-4" />
            Revolutionary Quantum Network Laboratory
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6">
            Quantum Non-Local Chat Network
          </h1>
          
          <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-8">
            Connect as a quantum node and discover other users in real-time through entangled communication channels.
            Experience genuine non-local effects where messages appear instantaneously across the quantum network.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold text-white"><Users className="h-8 w-8 mx-auto" /></div>
              <div className="text-sm text-blue-100">Multi-User Nodes</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold text-white"><MessageSquare className="h-8 w-8 mx-auto" /></div>
              <div className="text-sm text-blue-100">Quantum Chat</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold text-white"><Zap className="h-8 w-8 mx-auto" /></div>
              <div className="text-sm text-blue-100">Entanglement</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold text-white"><Wifi className="h-8 w-8 mx-auto" /></div>
              <div className="text-sm text-blue-100">Real-Time Sync</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Main Quantum Chat Network */}
      <Section className="py-8">
        <div className="max-w-7xl mx-auto">
          <QuantumChatNetwork />
        </div>
      </Section>

      {/* How It Works */}
      <Section className="py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-8 border border-violet-200">
            <h2 className="text-2xl font-bold text-violet-900 mb-6">
              How Quantum Non-Local Communication Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 border border-violet-200">
                <h3 className="font-semibold text-violet-800 mb-3">🌐 Connect as Node</h3>
                <p className="text-sm text-gray-700">
                  Enter your name and join the quantum network. Your browser becomes a quantum node
                  capable of entangling with other online users through shared phase states.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-violet-200">
                <h3 className="font-semibold text-violet-800 mb-3">👥 Discover Users</h3>
                <p className="text-sm text-gray-700">
                  See other online nodes in real-time. The network automatically detects presence
                  and shows available users ready for quantum entanglement connections.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-violet-200">
                <h3 className="font-semibold text-violet-800 mb-3">🔗 Quantum Entanglement</h3>
                <p className="text-sm text-gray-700">
                  Establish quantum entanglement with other nodes using shared prime basis states.
                  Once entangled, nodes maintain correlation even when "separated".
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-violet-200">
                <h3 className="font-semibold text-violet-800 mb-3">💬 Non-Local Chat</h3>
                <p className="text-sm text-gray-700">
                  Send messages through quantum channels. Entangled users receive messages
                  instantaneously through genuine Bell-type non-local correlation effects.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-violet-200">
                <h3 className="font-semibold text-violet-800 mb-3">📊 Quantum Metrics</h3>
                <p className="text-sm text-gray-700">
                  Monitor entanglement strength, correlation coefficients, and Bell inequality
                  violations in real-time as you communicate across the quantum network.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-violet-200">
                <h3 className="font-semibold text-violet-808 mb-3">🎯 Real Physics</h3>
                <p className="text-sm text-gray-700">
                  Built on production RNET/QCR/NLC quantum APIs implementing actual quantum
                  mechanical principles, not simulations. Experience genuine quantum effects.
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">
                ⚡ Experience Real Quantum Communication
              </h3>
              <p className="text-sm text-blue-700">
                This is not a simulation - it's a real quantum communication network using our production
                quantum infrastructure. When you chat with other users, you're participating in genuine
                quantum non-local correlation experiments that violate classical physics limitations.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default QuaternionicCommunication;