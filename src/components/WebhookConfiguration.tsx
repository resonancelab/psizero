import { useState, useEffect, useCallback } from 'react';
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
import psiZeroApi from '@/lib/api/index';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
  lastTriggered?: string;
  status?: 'active' | 'failed' | 'pending';
  successRate?: number;
  deliveryAttempts?: number;
  failureCount?: number;
}

interface WebhookEvent {
  id: string;
  event: string;
  description: string;
  category: string;
  example?: unknown;
}

interface CreateWebhookRequest {
  name: string;
  url: string;
  events: string[];
  secret?: string;
  contentType?: string;
  insecureSSL?: boolean;
}

interface WebhookResponse {
  webhook: WebhookConfig;
}

interface WebhooksListResponse {
  webhooks: WebhookConfig[];
  total: number;
}

const WebhookConfiguration = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [availableEvents, setAvailableEvents] = useState<string[]>([]);
  
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

  const fetchWebhooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await psiZeroApi.client.get<WebhooksListResponse>('/v1/webhooks');
      
      if (response.data) {
        setWebhooks(response.data.webhooks || []);
      }
    } catch (error: Error | unknown) {
      console.error('Error fetching webhooks:', error);
      toast({
        title: "Error",
        description: "Failed to load webhooks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch webhooks on component mount
  useEffect(() => {
    fetchWebhooks();
    fetchAvailableEvents();
  }, [fetchWebhooks]);

  const fetchAvailableEvents = async () => {
    try {
      const response = await psiZeroApi.client.get<{ events: string[] }>('/v1/webhooks/events');
      
      if (response.data) {
        setAvailableEvents(response.data.events || []);
      }
    } catch (error: Error | unknown) {
      console.error('Error fetching available events:', error);
    }
  };

  const handleCreateWebhook = async () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select at least one event.",
        variant: "destructive",
      });
      return;
    }

    try {
      const requestData: CreateWebhookRequest = {
        name: newWebhook.name,
        url: newWebhook.url,
        events: newWebhook.events,
        secret: newWebhook.secret || undefined,
        contentType: 'application/json',
        insecureSSL: false
      };

      const response = await psiZeroApi.client.post<WebhookResponse>('/v1/webhooks', requestData);

      if (response.data) {
        await fetchWebhooks(); // Refresh the list
        setNewWebhook({ name: '', url: '', events: [], secret: '' });
        setIsCreateDialogOpen(false);

        toast({
          title: "Webhook Created",
          description: `${response.data.webhook.name} has been configured successfully.`,
        });
      }
    } catch (error: Error | unknown) {
      console.error('Error creating webhook:', error);
      toast({
        title: "Error",
        description: "Failed to create webhook",
        variant: "destructive",
      });
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    try {
      await psiZeroApi.client.post(`/v1/webhooks/${webhookId}/test`);
      
      toast({
        title: "Webhook Test Sent",
        description: "Test payload sent to webhook endpoint. Check your logs for delivery status.",
      });
      setIsTestDialogOpen(false);
    } catch (error: Error | unknown) {
      console.error('Error testing webhook:', error);
      toast({
        title: "Error",
        description: "Failed to test webhook",
        variant: "destructive",
      });
    }
  };

  const toggleWebhook = async (webhookId: string) => {
    try {
      const webhook = webhooks.find(wh => wh.id === webhookId);
      if (!webhook) return;

      const updatedWebhook = { ...webhook, isActive: !webhook.isActive };
      
      await psiZeroApi.client.put(`/v1/webhooks/${webhookId}`, {
        name: webhook.name,
        url: webhook.url,
        events: webhook.events,
        isActive: updatedWebhook.isActive
      });

      await fetchWebhooks(); // Refresh the list
    } catch (error: Error | unknown) {
      console.error('Error updating webhook:', error);
      toast({
        title: "Error",
        description: "Failed to update webhook",
        variant: "destructive",
      });
    }
  };

  const deleteWebhook = async (webhookId: string) => {
    try {
      await psiZeroApi.client.delete(`/v1/webhooks/${webhookId}`);
      
      await fetchWebhooks(); // Refresh the list
      
      toast({
        title: "Webhook Deleted",
        description: "Webhook has been removed successfully.",
      });
    } catch (error: Error | unknown) {
      console.error('Error deleting webhook:', error);
      toast({
        title: "Error",
        description: "Failed to delete webhook",
        variant: "destructive",
      });
    }
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
                    Configure a webhook endpoint to receive event notifications from the PsiZero Resonance platform
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
                      {availableEvents.length > 0 ? (
                        availableEvents.map((event) => (
                          <div key={event} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <Checkbox
                              id={event}
                              checked={newWebhook.events.includes(event)}
                              onCheckedChange={(checked) => handleEventToggle(event, checked as boolean)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Label htmlFor={event} className="font-medium cursor-pointer">
                                  {event}
                                </Label>
                                <Badge variant="outline" className="text-xs">
                                  {event.split('.')[0].toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Event triggered when {event.replace(/\./g, ' ')} occurs
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-4">
                          {loading ? 'Loading events...' : 'No events available'}
                        </div>
                      )}
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