import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Webhook, Plus, Settings, TestTube, Eye, Trash2, AlertCircle, 
  CheckCircle, XCircle, Clock, Send, Key, Copy, RotateCcw 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  status: 'active' | 'failed' | 'pending';
  successRate: number;
}

interface WebhookEvent {
  id: string;
  event: string;
  description: string;
  category: string;
  example: unknown;
}

const WebhookConfiguration = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null);
  
  // Form state
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: ''
  });

  // Available webhook events
  const webhookEvents: WebhookEvent[] = [
    {
      id: 'srs.collapse',
      event: 'srs.collapse',
      description: 'SRS solver finds solution or determines unsatisfiability',
      category: 'Symbolic Resonance Solver',
      example: {
        event: 'srs.collapse',
        data: {
          jobId: 'srs_job_123',
          feasible: true,
          metrics: { entropy: 0.034, resonanceStrength: 0.95 }
        }
      }
    },
    {
      id: 'nlc.stable',
      event: 'nlc.stable',
      description: 'Non-local communication channel reaches stable resonance',
      category: 'Non-Local Communication',
      example: {
        event: 'nlc.stable',
        data: {
          sessionId: 'nlc_session_456',
          channelQuality: 0.89,
          phaseAlignment: 'golden'
        }
      }
    },
    {
      id: 'qcr.converged',
      event: 'qcr.converged',
      description: 'Quantum consciousness resonator reaches triadic convergence',
      category: 'Quantum Consciousness Resonator',
      example: {
        event: 'qcr.converged',
        data: {
          sessionId: 'qcr_session_789',
          iteration: 15,
          resonanceStrength: 0.87
        }
      }
    },
    {
      id: 'iching.stabilized',
      event: 'iching.stabilized',
      description: 'I-Ching hexagram sequence reaches stable attractor',
      category: 'I-Ching Oracle',
      example: {
        event: 'iching.stabilized',
        data: {
          requestId: 'iching_req_321',
          finalHexagram: '101010',
          attractorProximity: 0.95
        }
      }
    }
  ];

  // Mock webhook configurations
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: 'wh_1',
      name: 'Production Notifications',
      url: 'https://api.yourapp.com/webhooks/nomyx',
      events: ['srs.collapse', 'nlc.stable'],
      secret: 'whsec_K8B9J3...',
      isActive: true,
      createdAt: '2024-03-15T10:30:00Z',
      lastTriggered: '2024-03-20T14:45:00Z',
      status: 'active',
      successRate: 98.5
    },
    {
      id: 'wh_2',
      name: 'Development Testing',
      url: 'https://webhook.site/unique-dev-url',
      events: ['qcr.converged'],
      secret: 'whsec_L9C2K4...',
      isActive: true,
      createdAt: '2024-03-10T09:15:00Z',
      lastTriggered: '2024-03-18T11:20:00Z',
      status: 'failed',
      successRate: 75.2
    }
  ]);

  const handleCreateWebhook = async () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least one event.",
        variant: "destructive",
      });
      return;
    }

    const webhook: WebhookConfig = {
      id: `wh_${Date.now()}`,
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      secret: newWebhook.secret || `whsec_${Math.random().toString(36).substr(2, 9)}...`,
      isActive: true,
      createdAt: new Date().toISOString(),
      status: 'pending',
      successRate: 100
    };

    setWebhooks([webhook, ...webhooks]);
    setNewWebhook({ name: '', url: '', events: [], secret: '' });
    setIsCreateDialogOpen(false);

    toast({
      title: "Webhook Created",
      description: `${webhook.name} has been configured successfully.`,
    });
  };

  const handleTestWebhook = async (webhookId: string) => {
    toast({
      title: "Webhook Test Sent",
      description: "Test payload sent to webhook endpoint. Check your logs for delivery status.",
    });
    setIsTestDialogOpen(false);
  };

  const toggleWebhook = (webhookId: string) => {
    setWebhooks(webhooks.map(wh => 
      wh.id === webhookId ? { ...wh, isActive: !wh.isActive } : wh
    ));
  };

  const deleteWebhook = (webhookId: string) => {
    setWebhooks(webhooks.filter(wh => wh.id !== webhookId));
    toast({
      title: "Webhook Deleted",
      description: "Webhook configuration has been removed.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleEventToggle = (eventId: string, checked: boolean) => {
    if (checked) {
      setNewWebhook(prev => ({
        ...prev,
        events: [...prev.events, eventId]
      }));
    } else {
      setNewWebhook(prev => ({
        ...prev,
        events: prev.events.filter(e => e !== eventId)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Webhook className="w-5 h-5 mr-2" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>
                Configure webhooks to receive real-time notifications about resonance API events
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Webhook</DialogTitle>
                  <DialogDescription>
                    Configure a webhook endpoint to receive event notifications from the Nomyx Resonance platform
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhookName">Webhook Name *</Label>
                      <Input
                        id="webhookName"
                        placeholder="e.g., Production Notifications"
                        value={newWebhook.name}
                        onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">Endpoint URL *</Label>
                      <Input
                        id="webhookUrl"
                        type="url"
                        placeholder="https://api.yourapp.com/webhooks"
                        value={newWebhook.url}
                        onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhookSecret">Webhook Secret (Optional)</Label>
                    <Input
                      id="webhookSecret"
                      placeholder="Auto-generated if left empty"
                      value={newWebhook.secret}
                      onChange={(e) => setNewWebhook(prev => ({ ...prev, secret: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Used to verify webhook authenticity via HMAC signatures
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label>Event Subscriptions *</Label>
                    <div className="space-y-3">
                      {webhookEvents.map((event) => (
                        <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            id={event.id}
                            checked={newWebhook.events.includes(event.event)}
                            onCheckedChange={(checked) => handleEventToggle(event.event, checked as boolean)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Label htmlFor={event.id} className="font-medium cursor-pointer">
                                {event.event}
                              </Label>
                              <Badge variant="outline" className="text-xs">
                                {event.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateWebhook}>
                      Create Webhook
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="webhooks" className="space-y-4">
            <TabsList>
              <TabsTrigger value="webhooks">Active Webhooks</TabsTrigger>
              <TabsTrigger value="events">Available Events</TabsTrigger>
              <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="webhooks" className="space-y-4">
              {webhooks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.map((webhook) => (
                      <TableRow key={webhook.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{webhook.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Created {new Date(webhook.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {webhook.url.length > 40 ? webhook.url.substring(0, 40) + '...' : webhook.url}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.map((event) => (
                              <Badge key={event} variant="outline" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(webhook.status)}
                            <div className="flex items-center gap-1">
                              <Switch
                                checked={webhook.isActive}
                                onCheckedChange={() => toggleWebhook(webhook.id)}
                              />
                              <span className="text-xs text-muted-foreground">
                                {webhook.isActive ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{webhook.successRate}%</div>
                            {webhook.lastTriggered && (
                              <div className="text-xs text-muted-foreground">
                                Last: {new Date(webhook.lastTriggered).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <TestTube className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Test Webhook</DialogTitle>
                                  <DialogDescription>
                                    Send a test event to {webhook.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Select Test Event</Label>
                                    <Select defaultValue={webhook.events[0]}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {webhook.events.map((event) => (
                                          <SelectItem key={event} value={event}>
                                            {event}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline">Cancel</Button>
                                    <Button onClick={() => handleTestWebhook(webhook.id)}>
                                      <Send className="w-4 h-4 mr-2" />
                                      Send Test
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteWebhook(webhook.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Webhook className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No webhooks configured yet.</p>
                  <p className="text-sm">Click "Add Webhook" to get started with event notifications.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="grid gap-4">
                {webhookEvents.map((event) => (
                  <Card key={event.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{event.event}</CardTitle>
                          <Badge variant="outline">{event.category}</Badge>
                        </div>
                      </div>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label className="text-sm font-medium">Example Payload:</Label>
                        <div className="bg-muted p-3 rounded-lg mt-2">
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(event.example, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Webhook delivery logs are retained for 30 days. Failed deliveries are automatically retried up to 3 times with exponential backoff.
                </AlertDescription>
              </Alert>
              
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Delivery logs will appear here after webhook events are triggered.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookConfiguration;