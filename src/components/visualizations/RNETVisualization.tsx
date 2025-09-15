import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Users, Network, Zap, Play, Pause, RotateCcw, Settings, UserPlus, Activity } from "lucide-react";

interface Client {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'writer' | 'reader';
  position: { x: number; y: number };
  color: string;
  connected: boolean;
  lastActivity: Date;
  deltaCount: number;
}

interface ResonanceSpace {
  id: string;
  name: string;
  epoch: number;
  version: number;
  members: number;
  basis: {
    primes: number[];
    phases: number[];
  };
  telemetry: {
    resonanceStrength: number;
    coherence: number;
    locality: number;
    entropy: number;
    dominance: number;
  };
}

interface Delta {
  id: string;
  fromVersion: number;
  toVersion: number;
  clientId: string;
  timestamp: Date;
  operation: string;
  applied: boolean;
}

const RNETVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [isRunning, setIsRunning] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [space, setSpace] = useState<ResonanceSpace>({
    id: 'demo_space_001',
    name: 'Collaborative Demo Space',
    epoch: 1,
    version: 128,
    members: 0,
    basis: {
      primes: [2, 3, 5, 7, 11, 13],
      phases: [0, 0.618, 1.236, 1.854, 2.472, 3.09]
    },
    telemetry: {
      resonanceStrength: 0.75,
      coherence: 0.82,
      locality: 0.68,
      entropy: 0.45,
      dominance: 0.71
    }
  });
  
  const [deltas, setDeltas] = useState<Delta[]>([]);
  const [newClientName, setNewClientName] = useState('');
  const [parameters, setParameters] = useState({
    clientCount: 4,
    deltaRate: 2.0,
    resonanceTarget: 0.8,
    coherenceDecay: 0.02
  });

  const clientColors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  // Initialize clients
  useEffect(() => {
    const initialClients: Client[] = [
      { id: 'client_1', name: 'Alice', role: 'owner', position: { x: 0.2, y: 0.3 }, color: clientColors[0], connected: true, lastActivity: new Date(), deltaCount: 0 },
      { id: 'client_2', name: 'Bob', role: 'writer', position: { x: 0.8, y: 0.4 }, color: clientColors[1], connected: true, lastActivity: new Date(), deltaCount: 0 },
      { id: 'client_3', name: 'Carol', role: 'writer', position: { x: 0.5, y: 0.8 }, color: clientColors[2], connected: true, lastActivity: new Date(), deltaCount: 0 },
      { id: 'client_4', name: 'Dave', role: 'reader', position: { x: 0.3, y: 0.6 }, color: clientColors[3], connected: true, lastActivity: new Date(), deltaCount: 0 }
    ];
    
    setClients(initialClients.slice(0, parameters.clientCount));
    setSpace(prev => ({ ...prev, members: Math.min(parameters.clientCount, initialClients.length) }));
  }, [parameters.clientCount]);

  // Animation and simulation
  useEffect(() => {
    if (!isRunning) return;

    const simulate = () => {
      const now = Date.now();
      
      // Update space telemetry based on client activity and resonance
      setSpace(prev => {
        const activeClients = clients.filter(c => c.connected).length;
        const avgDeltaActivity = clients.reduce((sum, c) => sum + c.deltaCount, 0) / clients.length;
        
        // Simulate resonance evolution
        const targetResonance = parameters.resonanceTarget;
        const resonanceStrength = prev.telemetry.resonanceStrength * 0.99 + 
          (targetResonance + (Math.random() - 0.5) * 0.1) * 0.01;
        
        // Coherence based on client synchronization
        const coherence = Math.max(0.3, Math.min(0.95, 
          prev.telemetry.coherence * (1 - parameters.coherenceDecay) + 
          (activeClients / Math.max(clients.length, 1)) * 0.3 * parameters.coherenceDecay
        ));
        
        // Locality and entropy evolution
        const locality = 0.5 + Math.sin(now * 0.001) * 0.2 + Math.random() * 0.1;
        const entropy = Math.max(0.1, Math.min(0.8, prev.telemetry.entropy + (Math.random() - 0.5) * 0.02));
        const dominance = resonanceStrength * coherence * 0.8 + Math.random() * 0.2;

        return {
          ...prev,
          version: prev.version + (Math.random() < 0.1 ? 1 : 0),
          members: activeClients,
          telemetry: {
            resonanceStrength,
            coherence,
            locality,
            entropy,
            dominance
          }
        };
      });

      // Generate random deltas from clients
      if (Math.random() < parameters.deltaRate / 10) {
        const activeClients = clients.filter(c => c.connected && c.role !== 'reader');
        if (activeClients.length > 0) {
          const client = activeClients[Math.floor(Math.random() * activeClients.length)];
          const operations = ['set_phase', 'shift_phase', 'set_operator', 'adjust_entropy'];
          const operation = operations[Math.floor(Math.random() * operations.length)];
          
          const newDelta: Delta = {
            id: `delta_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            fromVersion: space.version,
            toVersion: space.version + 1,
            clientId: client.id,
            timestamp: new Date(),
            operation,
            applied: false
          };
          
          setDeltas(prev => [...prev.slice(-20), newDelta]);
          
          // Update client activity
          setClients(prev => prev.map(c => 
            c.id === client.id 
              ? { ...c, lastActivity: new Date(), deltaCount: c.deltaCount + 1 }
              : c
          ));

          // Apply delta after short delay (simulate network)
          setTimeout(() => {
            setDeltas(prev => prev.map(d => 
              d.id === newDelta.id ? { ...d, applied: true } : d
            ));
          }, 100 + Math.random() * 200);
        }
      }

      // Update phase evolution
      setSpace(prev => ({
        ...prev,
        basis: {
          ...prev.basis,
          phases: prev.basis.phases.map((phase, i) => 
            phase + Math.sin(now * 0.001 + i) * 0.01
          )
        }
      }));

      animationRef.current = requestAnimationFrame(simulate);
    };

    animationRef.current = requestAnimationFrame(simulate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, clients, space.version, parameters]);

  // Canvas visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear with space background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, `rgba(99, 102, 241, ${space.telemetry.coherence * 0.3})`);
      gradient.addColorStop(0.5, `rgba(139, 92, 246, ${space.telemetry.coherence * 0.2})`);
      gradient.addColorStop(1, 'rgba(15, 15, 35, 0.1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw prime basis resonance field
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = Date.now() * 0.001;

      // Draw resonance waves based on prime basis
      space.basis.primes.forEach((prime, i) => {
        const phase = space.basis.phases[i];
        const radius = 30 + i * 25 + Math.sin(time + phase) * 10;
        const alpha = space.telemetry.resonanceStrength * 0.6;
        
        ctx.strokeStyle = `hsla(${240 + i * 30}, 70%, 60%, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Prime labels
        const labelX = centerX + Math.cos(phase) * (radius + 15);
        const labelY = centerY + Math.sin(phase) * (radius + 15);
        
        ctx.fillStyle = `hsla(${240 + i * 30}, 70%, 70%, 0.8)`;
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`P${prime}`, labelX, labelY);
      });

      // Draw clients
      clients.forEach((client, index) => {
        const x = client.position.x * canvas.width;
        const y = client.position.y * canvas.height;
        const size = client.connected ? 12 : 8;
        const pulseSize = client.connected ? 2 + Math.sin(time * 3) * 1 : 0;

        // Client activity ring
        if (client.connected && Date.now() - client.lastActivity.getTime() < 2000) {
          ctx.strokeStyle = `${client.color}60`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(x, y, size + 8 + pulseSize, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Client connection to center (resonance coupling)
        if (client.connected) {
          const coupling = space.telemetry.coherence * 0.8;
          ctx.strokeStyle = `${client.color}${Math.floor(coupling * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(centerX, centerY);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Client node
        ctx.fillStyle = client.connected ? client.color : `${client.color}60`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Client role indicator
        const roleColors = { owner: '#fbbf24', admin: '#f59e0b', writer: '#22c55e', reader: '#6b7280' };
        ctx.strokeStyle = roleColors[client.role];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, size + 2, 0, Math.PI * 2);
        ctx.stroke();

        // Client name
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px bold sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(client.name, x, y - size - 8);
      });

      // Draw recent deltas as animated pulses
      const recentDeltas = deltas.filter(d => Date.now() - d.timestamp.getTime() < 3000);
      recentDeltas.forEach(delta => {
        const client = clients.find(c => c.id === delta.clientId);
        if (!client) return;

        const age = Date.now() - delta.timestamp.getTime();
        const progress = Math.min(1, age / 1000);
        const radius = progress * 50;
        const alpha = (1 - progress) * 0.8;

        const x = client.position.x * canvas.width;
        const y = client.position.y * canvas.height;

        ctx.strokeStyle = `${client.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = delta.applied ? 3 : 1;
        ctx.setLineDash(delta.applied ? [] : [3, 3]);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw telemetry visualization
      const telemetryHeight = 80;
      const telemetryY = canvas.height - telemetryHeight - 10;
      
      // Resonance strength wave
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < canvas.width; i += 2) {
        const waveHeight = space.telemetry.resonanceStrength * 30 + 
          Math.sin((i + time * 50) * 0.02) * 5;
        const y = telemetryY + 20 + waveHeight;
        
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();

      // Coherence indicator
      ctx.fillStyle = `rgba(59, 130, 246, ${space.telemetry.coherence})`;
      ctx.fillRect(10, telemetryY + 50, space.telemetry.coherence * 100, 8);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Coherence: ${(space.telemetry.coherence * 100).toFixed(1)}%`, 120, telemetryY + 58);
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, [clients, space, deltas]);

  const addClient = () => {
    if (!newClientName.trim() || clients.length >= 8) return;
    
    const newClient: Client = {
      id: `client_${Date.now()}`,
      name: newClientName.trim(),
      role: 'writer',
      position: { 
        x: 0.2 + Math.random() * 0.6, 
        y: 0.2 + Math.random() * 0.6 
      },
      color: clientColors[clients.length % clientColors.length],
      connected: true,
      lastActivity: new Date(),
      deltaCount: 0
    };
    
    setClients(prev => [...prev, newClient]);
    setSpace(prev => ({ ...prev, members: prev.members + 1 }));
    setNewClientName('');
  };

  const toggleClient = (clientId: string) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, connected: !client.connected }
        : client
    ));
  };

  const reset = () => {
    setIsRunning(false);
    setDeltas([]);
    setClients(prev => prev.map(c => ({ ...c, deltaCount: 0, lastActivity: new Date() })));
    setSpace(prev => ({
      ...prev,
      version: 128,
      telemetry: {
        resonanceStrength: 0.75,
        coherence: 0.82,
        locality: 0.68,
        entropy: 0.45,
        dominance: 0.71
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-indigo-500" />
                Multi-Client Resonance Space
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setIsRunning(!isRunning)}>
                  {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isRunning ? 'Pause' : 'Start'}
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
              ref={canvasRef}
              width={500}
              height={400}
              className="w-full h-auto border rounded bg-gray-900"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Space Telemetry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Resonance Strength</span>
                <span>{(space.telemetry.resonanceStrength * 100).toFixed(1)}%</span>
              </div>
              <Progress value={space.telemetry.resonanceStrength * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Coherence</span>
                <span>{(space.telemetry.coherence * 100).toFixed(1)}%</span>
              </div>
              <Progress value={space.telemetry.coherence * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Locality</span>
                <span>{(space.telemetry.locality * 100).toFixed(1)}%</span>
              </div>
              <Progress value={space.telemetry.locality * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Entropy</span>
                <span>{(space.telemetry.entropy * 100).toFixed(1)}%</span>
              </div>
              <Progress value={space.telemetry.entropy * 100} className="h-2" />
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="text-lg font-bold text-indigo-600">
                    v{space.version}
                  </div>
                  <div className="text-xs text-gray-600">Space Version</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {space.members}
                  </div>
                  <div className="text-xs text-gray-600">Active Members</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connected Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {clients.map(client => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: client.color }}
                    />
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{client.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={client.connected ? "default" : "secondary"}>
                      {client.connected ? 'Connected' : 'Offline'}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleClient(client.id)}
                    >
                      {client.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Client name..."
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addClient()}
              />
              <Button onClick={addClient} disabled={!newClientName.trim() || clients.length >= 8}>
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Deltas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {deltas.slice(-10).reverse().map(delta => {
                const client = clients.find(c => c.id === delta.clientId);
                return (
                  <div key={delta.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: client?.color || '#gray' }}
                      />
                      <span className="font-medium">{client?.name || 'Unknown'}</span>
                      <span className="text-gray-500">{delta.operation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        v{delta.fromVersion}→{delta.toVersion}
                      </span>
                      <Badge variant={delta.applied ? "default" : "secondary"} className="text-xs">
                        {delta.applied ? 'Applied' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              
              {deltas.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No deltas yet. Start the simulation to see real-time updates.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Simulation Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Delta Rate: {parameters.deltaRate.toFixed(1)}/s</label>
              <Slider
                value={[parameters.deltaRate]}
                onValueChange={([value]) => setParameters(prev => ({ ...prev, deltaRate: value }))}
                min={0.1}
                max={5.0}
                step={0.1}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Resonance Target: {(parameters.resonanceTarget * 100).toFixed(0)}%</label>
              <Slider
                value={[parameters.resonanceTarget]}
                onValueChange={([value]) => setParameters(prev => ({ ...prev, resonanceTarget: value }))}
                min={0.1}
                max={1.0}
                step={0.05}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Coherence Decay: {(parameters.coherenceDecay * 100).toFixed(1)}%</label>
              <Slider
                value={[parameters.coherenceDecay]}
                onValueChange={([value]) => setParameters(prev => ({ ...prev, coherenceDecay: value }))}
                min={0.001}
                max={0.1}
                step={0.001}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Prime Basis: [{space.basis.primes.join(', ')}]</label>
              <div className="text-xs text-gray-500">
                {space.basis.primes.length} eigenstate dimensions
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RNETVisualization;