import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Radio, Satellite, Play, Pause, RotateCcw, Zap, Wifi, Send } from "lucide-react";

interface QuantumChannel {
  id: string;
  prime: number;
  amplitude: number;
  phase: number;
  frequency: number;
  stability: number;
  synchronized: boolean;
}

interface TransmissionPacket {
  id: string;
  content: string;
  timestamp: number;
  progress: number;
  quality: number;
  status: 'encoding' | 'transmitting' | 'delivered' | 'failed';
}

const NLCVisualization = () => {
  const canvasChannelRef = useRef<HTMLCanvasElement>(null);
  const canvasTransmissionRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [channels, setChannels] = useState<QuantumChannel[]>([]);
  const [transmissions, setTransmissions] = useState<TransmissionPacket[]>([]);
  const [message, setMessage] = useState('Hello through quantum entanglement!');
  const [sessionId] = useState('nlc_demo_' + Math.random().toString(36).substr(2, 8));
  
  const [channelMetrics, setChannelMetrics] = useState({
    overallStability: 0.7,
    synchronizationRate: 0.6,
    transmissionQuality: 0.8,
    channelCoherence: 0.75,
    goldenPhaseAlignment: 0.82,
    silverPhaseAlignment: 0.78
  });

  const goldenRatio = 1.618033988749;
  const silverRatio = 2.414213562373;

  // Initialize quantum channels with prime eigenstates
  useEffect(() => {
    const primes = [2, 3, 5, 7, 11, 13];
    const initialChannels: QuantumChannel[] = primes.map((prime, index) => ({
      id: `channel-${prime}`,
      prime,
      amplitude: 0.3 + Math.random() * 0.4,
      phase: (index * Math.PI * 2) / primes.length,
      frequency: Math.log(prime) * 0.3,
      stability: 0.5 + Math.random() * 0.3,
      synchronized: false
    }));
    
    setChannels(initialChannels);
  }, []);

  // Channel synchronization and evolution
  useEffect(() => {
    if (!isPlaying) return;
    
    const evolve = () => {
      setChannels(prev => prev.map(channel => {
        // Evolve phase with frequency
        let newPhase = channel.phase + channel.frequency * 0.1;
        
        // Apply golden and silver ratio phase corrections
        const goldenPhaseTarget = (newPhase * goldenRatio) % (2 * Math.PI);
        const silverPhaseTarget = (newPhase * silverRatio) % (2 * Math.PI);
        
        // Phase synchronization towards golden/silver ratios
        const goldenCorrection = Math.sin(goldenPhaseTarget - newPhase) * 0.02;
        const silverCorrection = Math.sin(silverPhaseTarget - newPhase) * 0.02;
        newPhase += goldenCorrection + silverCorrection;
        
        // Amplitude evolution with resonance coupling
        let newAmplitude = channel.amplitude;
        prev.forEach(otherChannel => {
          if (otherChannel.id !== channel.id) {
            const phaseDiff = Math.abs(newPhase - otherChannel.phase);
            const coupling = Math.cos(phaseDiff) * 0.01;
            newAmplitude += coupling * otherChannel.amplitude;
          }
        });
        
        // Apply quantum noise and stabilization
        newAmplitude = Math.max(0.1, Math.min(1.0, 
          newAmplitude * (1 + (Math.random() - 0.5) * 0.02)
        ));
        
        // Stability evolution
        const targetStability = newAmplitude > 0.7 ? 0.9 : 0.6;
        const newStability = channel.stability * 0.99 + targetStability * 0.01;
        
        // Check synchronization
        const avgPhase = prev.reduce((sum, ch) => sum + ch.phase, 0) / prev.length;
        const phaseDifference = Math.abs(newPhase - avgPhase);
        const synchronized = phaseDifference < 0.3 && newStability > 0.8;
        
        return {
          ...channel,
          amplitude: newAmplitude,
          phase: newPhase,
          stability: newStability,
          synchronized
        };
      }));

      // Update channel metrics
      setChannelMetrics(prev => {
        const avgStability = channels.reduce((sum, ch) => sum + ch.stability, 0) / channels.length;
        const syncCount = channels.filter(ch => ch.synchronized).length;
        const syncRate = syncCount / channels.length;
        
        // Golden and silver phase alignment
        const avgPhase = channels.reduce((sum, ch) => sum + ch.phase, 0) / channels.length;
        const goldenAlignment = Math.abs(Math.sin((avgPhase * goldenRatio) % (2 * Math.PI)));
        const silverAlignment = Math.abs(Math.sin((avgPhase * silverRatio) % (2 * Math.PI)));
        
        return {
          overallStability: avgStability,
          synchronizationRate: syncRate,
          transmissionQuality: Math.min(0.98, avgStability * syncRate),
          channelCoherence: (avgStability + syncRate) / 2,
          goldenPhaseAlignment: 1 - goldenAlignment,
          silverPhaseAlignment: 1 - silverAlignment
        };
      });

      // Update transmission progress
      setTransmissions(prev => prev.map(tx => {
        if (tx.status === 'transmitting') {
          const newProgress = Math.min(1, tx.progress + channelMetrics.transmissionQuality * 0.05);
          const newStatus = newProgress >= 1 ? 'delivered' : 'transmitting';
          return { ...tx, progress: newProgress, status: newStatus };
        }
        return tx;
      }));

      animationRef.current = requestAnimationFrame(evolve);
    };
    
    animationRef.current = requestAnimationFrame(evolve);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, channels, channelMetrics]);

  // Channel visualization
  useEffect(() => {
    const canvas = canvasChannelRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const time = Date.now() * 0.001;

    // Clear with quantum communication field
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 250);
    gradient.addColorStop(0, `rgba(16, 185, 129, ${channelMetrics.channelCoherence * 0.3})`);
    gradient.addColorStop(0.5, `rgba(59, 130, 246, ${channelMetrics.channelCoherence * 0.2})`);
    gradient.addColorStop(1, 'rgba(15, 35, 15, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw golden ratio spiral
    ctx.strokeStyle = `rgba(251, 191, 36, ${channelMetrics.goldenPhaseAlignment * 0.6})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 100; i++) {
      const angle = i * 0.1;
      const radius = angle * goldenRatio * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw silver ratio pattern
    ctx.strokeStyle = `rgba(192, 192, 192, ${channelMetrics.silverPhaseAlignment * 0.4})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      const radius = silverRatio * 30;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      ctx.stroke();
    }

    // Draw quantum channels as rotating nodes
    channels.forEach((channel, index) => {
      const angle = (index / channels.length) * 2 * Math.PI + time * 0.5;
      const radius = 80 + channel.stability * 40;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Channel node
      const nodeSize = 8 + channel.amplitude * 12;
      const nodeColor = channel.synchronized ? '#22c55e' : '#ef4444';
      
      // Channel field
      const channelGradient = ctx.createRadialGradient(x, y, 0, x, y, nodeSize * 3);
      channelGradient.addColorStop(0, `${nodeColor}60`);
      channelGradient.addColorStop(1, `${nodeColor}00`);
      
      ctx.fillStyle = channelGradient;
      ctx.beginPath();
      ctx.arc(x, y, nodeSize * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Node core
      ctx.fillStyle = nodeColor;
      ctx.beginPath();
      ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Prime label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px bold monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`P${channel.prime}`, x, y + 4);
      
      // Stability indicator
      if (channel.stability > 0.8) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, nodeSize + 3, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Phase synchronization waves
      if (channel.synchronized) {
        for (let wave = 1; wave <= 3; wave++) {
          const waveRadius = nodeSize + wave * 8 + Math.sin(time * 2 + wave) * 3;
          ctx.strokeStyle = `rgba(34, 197, 94, ${0.4 / wave})`;
          ctx.lineWidth = 2 / wave;
          ctx.beginPath();
          ctx.arc(x, y, waveRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    });

    // Draw entanglement connections between synchronized channels
    const syncedChannels = channels.filter(ch => ch.synchronized);
    for (let i = 0; i < syncedChannels.length; i++) {
      for (let j = i + 1; j < syncedChannels.length; j++) {
        const ch1 = syncedChannels[i];
        const ch2 = syncedChannels[j];
        
        const index1 = channels.indexOf(ch1);
        const index2 = channels.indexOf(ch2);
        
        const angle1 = (index1 / channels.length) * 2 * Math.PI + time * 0.5;
        const angle2 = (index2 / channels.length) * 2 * Math.PI + time * 0.5;
        
        const radius1 = 80 + ch1.stability * 40;
        const radius2 = 80 + ch2.stability * 40;
        
        const x1 = centerX + Math.cos(angle1) * radius1;
        const y1 = centerY + Math.sin(angle1) * radius1;
        const x2 = centerX + Math.cos(angle2) * radius2;
        const y2 = centerY + Math.sin(angle2) * radius2;
        
        const entanglementStrength = (ch1.amplitude + ch2.amplitude) * 0.3;
        
        ctx.strokeStyle = `rgba(147, 51, 234, ${entanglementStrength})`;
        ctx.lineWidth = entanglementStrength * 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

  }, [channels, channelMetrics]);

  // Transmission visualization
  useEffect(() => {
    const canvas = canvasTransmissionRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with transmission field
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw transmission timeline
    const timelineY = canvas.height / 2;
    const timelineWidth = canvas.width - 40;
    
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, timelineY);
    ctx.lineTo(canvas.width - 20, timelineY);
    ctx.stroke();

    // Draw transmission packets
    transmissions.forEach((tx, index) => {
      const x = 20 + (tx.progress * timelineWidth);
      const y = timelineY - 30 + index * 15;
      
      let color;
      switch (tx.status) {
        case 'encoding': color = '#f59e0b'; break;
        case 'transmitting': color = '#3b82f6'; break;
        case 'delivered': color = '#22c55e'; break;
        case 'failed': color = '#ef4444'; break;
      }
      
      // Packet visualization
      ctx.fillStyle = color;
      ctx.fillRect(x - 5, y - 3, 10, 6);
      
      // Quality indicator
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 3 + tx.quality * 5, 0, Math.PI * 2);
      ctx.stroke();
      
      // Quantum field around packet
      if (tx.status === 'transmitting') {
        const fieldGradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        fieldGradient.addColorStop(0, `${color}40`);
        fieldGradient.addColorStop(1, `${color}00`);
        
        ctx.fillStyle = fieldGradient;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Timeline labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Sender', 25, timelineY + 20);
    ctx.textAlign = 'right';
    ctx.fillText('Receiver', canvas.width - 25, timelineY + 20);

    // Status indicators
    transmissions.forEach((tx, index) => {
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${tx.id}: ${tx.status}`, 10, 20 + index * 12);
    });

  }, [transmissions]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newTransmission: TransmissionPacket = {
      id: `msg-${Date.now()}`,
      content: message,
      timestamp: Date.now(),
      progress: 0,
      quality: channelMetrics.transmissionQuality,
      status: 'encoding'
    };
    
    setTransmissions(prev => [...prev, newTransmission]);
    
    // Start transmission process
    setTimeout(() => {
      setTransmissions(prev => prev.map(tx => 
        tx.id === newTransmission.id ? { ...tx, status: 'transmitting' } : tx
      ));
    }, 500);
  };

  const reset = () => {
    setIsPlaying(false);
    setTransmissions([]);
    setChannels(prev => prev.map(ch => ({
      ...ch,
      amplitude: 0.3 + Math.random() * 0.4,
      phase: Math.random() * 2 * Math.PI,
      stability: 0.5 + Math.random() * 0.3,
      synchronized: false
    })));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-green-500" />
                Quantum Channel Status
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Sync'}
                </Button>
                <Button size="sm" variant="outline" onClick={reset}>
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasChannelRef}
              width={500}
              height={400}
              className="w-full h-auto border rounded bg-gray-900"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Satellite className="h-5 w-5 text-blue-500" />
              Message Transmission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasTransmissionRef}
              width={500}
              height={300}
              className="w-full h-auto border rounded bg-gray-900"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Channel Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Stability</span>
                <span>{(channelMetrics.overallStability * 100).toFixed(1)}%</span>
              </div>
              <Progress value={channelMetrics.overallStability * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Synchronization Rate</span>
                <span>{(channelMetrics.synchronizationRate * 100).toFixed(1)}%</span>
              </div>
              <Progress value={channelMetrics.synchronizationRate * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Transmission Quality</span>
                <span>{(channelMetrics.transmissionQuality * 100).toFixed(1)}%</span>
              </div>
              <Progress value={channelMetrics.transmissionQuality * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Channel Coherence</span>
                <span>{(channelMetrics.channelCoherence * 100).toFixed(1)}%</span>
              </div>
              <Progress value={channelMetrics.channelCoherence * 100} className="h-2" />
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600">
                    {(channelMetrics.goldenPhaseAlignment * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-600">Golden Phase φ</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-600">
                    {(channelMetrics.silverPhaseAlignment * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-600">Silver Phase σ</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Session ID:</label>
              <Input value={sessionId} disabled className="font-mono text-xs" />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Message Content:</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message to transmit via quantum channel..."
                className="min-h-[80px]"
              />
            </div>
            
            <Button 
              onClick={sendMessage} 
              disabled={!message.trim() || channelMetrics.transmissionQuality < 0.5}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Quantum Message
            </Button>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2 text-sm">Channel Status:</h4>
              <div className="space-y-2">
                {channels.map(channel => (
                  <div key={channel.id} className="flex items-center justify-between text-xs">
                    <span>Prime {channel.prime}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-gray-200 rounded">
                        <div 
                          className="h-1 rounded"
                          style={{ 
                            backgroundColor: channel.synchronized ? '#22c55e' : '#ef4444',
                            width: `${channel.stability * 100}%`
                          }}
                        />
                      </div>
                      <Badge variant={channel.synchronized ? "default" : "secondary"}>
                        {channel.synchronized ? 'SYNC' : 'ASYNC'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transmission Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {transmissions.slice(-5).map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant={
                    tx.status === 'delivered' ? 'default' :
                    tx.status === 'transmitting' ? 'secondary' :
                    tx.status === 'failed' ? 'destructive' : 'outline'
                  }>
                    {tx.status.toUpperCase()}
                  </Badge>
                  <span className="truncate max-w-xs">{tx.content}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded">
                    <div 
                      className="h-2 rounded transition-all duration-300"
                      style={{ 
                        backgroundColor: tx.status === 'delivered' ? '#22c55e' : '#3b82f6',
                        width: `${tx.progress * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">
                    {Math.round(tx.progress * 100)}%
                  </span>
                </div>
              </div>
            ))}
            
            {transmissions.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No transmissions yet. Send a quantum message to begin.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NLCVisualization;