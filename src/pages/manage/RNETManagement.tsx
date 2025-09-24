import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import {
  Network,
  Plus,
  Users,
  Activity,
  Settings,
  Play,
  Pause,
  Trash2,
  Eye,
  Edit,
  Radio,
  Zap,
  Clock,
  Globe,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Wifi,
  UserPlus,
  Crown,
  Shield,
  Pen,
  BookOpen
} from 'lucide-react';

interface ResonanceSpace {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'locked' | 'archived';
  memberCount: number;
  ownerOrg: string;
  createdAt: string;
  epoch: number;
  version: number;
  config: {
    basis: {
      primes: number[];
      order: 'ascending' | 'learned';
      cutoff: number;
    };
    phases: {
      golden: boolean;
      silver: boolean;
      custom?: number[];
    };
    operators: {
      resonanceTarget: number;
      localityBias: number;
      mixer: {
        gamma0: number;
        temperature0: number;
      };
    };
    entropy: {
      lambda: number;
      collapseThreshold: number;
    };
    policy: {
      maxMembers: number;
      publishHz: number;
      allowGuest: boolean;
    };
  };
  telemetry?: {
    resonanceStrength: number;
    coherence: number;
    locality: number;
    entropy: number;
    dominance: number;
  };
}

interface SpaceMember {
  id: string;
  userId: string;
  email: string;
  role: 'owner' | 'admin' | 'writer' | 'reader';
  joinedAt: string;
  lastActivity?: string;
  isOnline: boolean;
}

const RNETManagement = () => {
  const { toast } = useToast();
  const [spaces, setSpaces] = useState<ResonanceSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ResonanceSpace | null>(null);
  const [spaceMembers, setSpaceMembers] = useState<SpaceMember[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  // Load real data from API
  useEffect(() => {
    const fetchRNETData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch resonance spaces
        const spacesResponse = await fetch('/api/rnet/spaces', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (spacesResponse.ok) {
          const spacesData = await spacesResponse.json();
          setSpaces(spacesData);
          if (spacesData.length > 0) {
            setSelectedSpace(spacesData[0]);
          }
        }

        // Fetch space members for the first space
        if (spaces.length > 0) {
          const membersResponse = await fetch(`/api/rnet/spaces/${spaces[0].id}/members`, {
            method: 'GET',
            credentials: 'include'
          });
          
          if (membersResponse.ok) {
            const membersData = await membersResponse.json();
            setSpaceMembers(membersData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch RNET data:', error);
        toast({
          title: "Error",
          description: "Failed to load RNET data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRNETData();
  }, []);

  // Real-time telemetry simulation
  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      setSpaces(prevSpaces => 
        prevSpaces.map(space => ({
          ...space,
          telemetry: space.telemetry ? {
            ...space.telemetry,
            resonanceStrength: Math.max(0.1, Math.min(1.0, 
              space.telemetry.resonanceStrength + (Math.random() - 0.5) * 0.05
            )),
            coherence: Math.max(0.1, Math.min(1.0,
              space.telemetry.coherence + (Math.random() - 0.5) * 0.03
            )),
            entropy: Math.max(0.0, Math.min(1.0,
              space.telemetry.entropy + (Math.random() - 0.5) * 0.02
            ))
          } : space.telemetry
        }))
      );
    }, 1000); // 1Hz update for demo

    return () => clearInterval(interval);
  }, [realTimeEnabled]);

  const handleCreateSpace = () => {
    // Implementation for creating new space
    toast({
      title: "Feature Coming Soon",
      description: "Space creation wizard will be available in the next update.",
    });
    setShowCreateDialog(false);
  };

  const handleJoinSpace = (spaceId: string) => {
    toast({
      title: "Joining Space",
      description: "Establishing connection to resonance space...",
    });
  };

  const handleAddMember = () => {
    toast({
      title: "Feature Coming Soon", 
      description: "Member invitation will be available in the next update.",
    });
    setShowMemberDialog(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'writer':
        return <Pen className="h-4 w-4 text-green-500" />;
      case 'reader':
        return <BookOpen className="h-4 w-4 text-gray-500" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'locked':
        return <Badge variant="destructive">Locked</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Section>
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Section>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Network className="h-10 w-10 text-indigo-600" />
                  RNET Management
                </h1>
                <p className="text-xl text-muted-foreground">
                  Manage resonance spaces, monitor real-time collaboration, and configure prime-basis synchronization.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-green-500" />
                  <Label htmlFor="realtime">Real-time Updates</Label>
                  <Switch 
                    id="realtime"
                    checked={realTimeEnabled}
                    onCheckedChange={setRealTimeEnabled}
                  />
                </div>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Space
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Resonance Space</DialogTitle>
                      <DialogDescription>
                        Set up a new collaborative prime-basis resonance space
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="spaceName">Space Name</Label>
                        <Input id="spaceName" placeholder="Enter space name" />
                      </div>
                      <div>
                        <Label htmlFor="spaceDesc">Description</Label>
                        <Textarea id="spaceDesc" placeholder="Describe the purpose of this space" />
                      </div>
                      <div>
                        <Label htmlFor="maxMembers">Maximum Members</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select member limit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 members</SelectItem>
                            <SelectItem value="10">10 members</SelectItem>
                            <SelectItem value="20">20 members</SelectItem>
                            <SelectItem value="50">50 members</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateSpace}>
                        Create Space
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <Tabs defaultValue="spaces" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="spaces">Spaces</TabsTrigger>
              <TabsTrigger value="telemetry">Live Telemetry</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="spaces" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {spaces.map((space) => (
                  <Card key={space.id} className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedSpace(space)}>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5" />
                    <CardHeader className="relative">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{space.name}</CardTitle>
                        {getStatusBadge(space.status)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {space.description || 'No description provided'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Members</p>
                          <p className="font-semibold flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {space.memberCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Version</p>
                          <p className="font-semibold">v{space.version}</p>
                        </div>
                      </div>

                      {space.telemetry && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Resonance</span>
                            <span>{(space.telemetry.resonanceStrength * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={space.telemetry.resonanceStrength * 100} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span>Coherence</span>
                            <span>{(space.telemetry.coherence * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={space.telemetry.coherence * 100} className="h-2" />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" onClick={(e) => {
                          e.stopPropagation();
                          handleJoinSpace(space.id);
                        }}>
                          <Wifi className="h-3 w-3 mr-1" />
                          Join
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                        }}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                        }}>
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="telemetry" className="space-y-6">
              {selectedSpace && selectedSpace.telemetry ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-500" />
                        Resonance Strength
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        {(selectedSpace.telemetry.resonanceStrength * 100).toFixed(1)}%
                      </div>
                      <Progress value={selectedSpace.telemetry.resonanceStrength * 100} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Measures quantum field coupling strength
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Radio className="h-5 w-5 text-green-500" />
                        Coherence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        {(selectedSpace.telemetry.coherence * 100).toFixed(1)}%
                      </div>
                      <Progress value={selectedSpace.telemetry.coherence * 100} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Phase alignment across prime basis
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-purple-500" />
                        Locality
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        {(selectedSpace.telemetry.locality * 100).toFixed(1)}%
                      </div>
                      <Progress value={selectedSpace.telemetry.locality * 100} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Local vs non-local correlations
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-orange-500" />
                        Entropy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        {selectedSpace.telemetry.entropy.toFixed(3)}
                      </div>
                      <Progress value={selectedSpace.telemetry.entropy * 100} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        System information entropy
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-red-500" />
                        Dominance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        {(selectedSpace.telemetry.dominance * 100).toFixed(1)}%
                      </div>
                      <Progress value={selectedSpace.telemetry.dominance * 100} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Maximum component amplitude
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-indigo-500" />
                        Update Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        {selectedSpace.config.policy.publishHz}Hz
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Real-time telemetry frequency
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs">Live</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select a space to view live telemetry data
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Space Members</h3>
                <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Member</DialogTitle>
                      <DialogDescription>
                        Invite a user to join the resonance space
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="memberEmail">Email Address</Label>
                        <Input id="memberEmail" type="email" placeholder="user@example.com" />
                      </div>
                      <div>
                        <Label htmlFor="memberRole">Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reader">Reader</SelectItem>
                            <SelectItem value="writer">Writer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowMemberDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMember}>
                        Send Invitation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {spaceMembers.map((member) => (
                      <div key={member.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {member.email.charAt(0).toUpperCase()}
                            </div>
                            {member.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{member.email}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {getRoleIcon(member.role)}
                              <span className="capitalize">{member.role}</span>
                              {member.lastActivity && (
                                <>
                                  <span>•</span>
                                  <span>Active {member.lastActivity}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.isOnline ? 'default' : 'secondary'}>
                            {member.isOnline ? 'Online' : 'Offline'}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Space Activity</CardTitle>
                    <CardDescription>Member engagement over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                        <p>Analytics visualization will be available soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Resonance quality indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Average Coherence</span>
                        <span className="font-semibold">87.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Peak Resonance</span>
                        <span className="font-semibold">94.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Stability Score</span>
                        <span className="font-semibold">8.9/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Collaboration Index</span>
                        <span className="font-semibold">High</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </PageLayout>
  );
};

export default RNETManagement;