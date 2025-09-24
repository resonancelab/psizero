import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/Navigation';
import { Shield, Key, Eye, Copy, Plus, Trash2, AlertTriangle, Clock, MapPin } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useDashboard } from '@/hooks/useDashboard';

interface SecurityLog {
  id: string;
  event: string;
  description: string;
  timestamp: string;
  location: string;
  ip: string;
  status: 'success' | 'failed';
}

const Security = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [isNewKeyDialogOpen, setIsNewKeyDialogOpen] = useState(false);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const { toast } = useToast();
  const { apiKeys, createApiKey, deleteApiKey } = useDashboard();

  // Initialize with some mock security logs for now
  useEffect(() => {
    const mockLogs: SecurityLog[] = [
      {
        id: '1',
        event: 'Login',
        description: 'Successful login from new device',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(), // 2 hours ago
        location: 'San Francisco, CA',
        ip: '192.168.1.1',
        status: 'success'
      },
      {
        id: '2',
        event: 'API Key Created',
        description: 'New API key created',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(), // 1 day ago
        location: 'San Francisco, CA',
        ip: '192.168.1.1',
        status: 'success'
      },
      {
        id: '3',
        event: 'Failed Login',
        description: 'Failed login attempt detected',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString(), // 7 days ago
        location: 'Unknown',
        ip: '10.0.0.1',
        status: 'failed'
      }
    ];
    setSecurityLogs(mockLogs);
  }, []);

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newApiKey = await createApiKey(newApiKeyName, ['read', 'write']);
      if (newApiKey) {
        setNewApiKeyName('');
        setIsNewKeyDialogOpen(false);
        
        // Add security log entry
        const newLog: SecurityLog = {
          id: Date.now().toString(),
          event: 'API Key Created',
          description: `New API key "${newApiKeyName}" created`,
          timestamp: new Date().toLocaleString(),
          location: 'Current Session',
          ip: 'Current IP',
          status: 'success'
        };
        setSecurityLogs(prev => [newLog, ...prev]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key.",
        variant: "destructive",
      });
    }
  };

  const handleCopyKey = (keyPrefix: string) => {
    // Since we can't access the full key, copy the prefix for reference
    navigator.clipboard.writeText(`${keyPrefix}...`);
    toast({
      title: "Key prefix copied",
      description: "API key prefix has been copied to your clipboard.",
    });
  };

  const handleDeleteKey = async (keyId: string, keyName: string) => {
    try {
      await deleteApiKey(keyId, keyName);
      
      // Add security log entry
      const newLog: SecurityLog = {
        id: Date.now().toString(),
        event: 'API Key Deleted',
        description: `API key "${keyName}" was deleted`,
        timestamp: new Date().toLocaleString(),
        location: 'Current Session',
        ip: 'Current IP',
        status: 'success'
      };
      setSecurityLogs(prev => [newLog, ...prev]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key.",
        variant: "destructive",
      });
    }
  };

  const getPermissionBadge = (permissions: string[]) => {
    const hasWrite = permissions.includes('write');
    const hasRead = permissions.includes('read');
    const hasAdmin = permissions.includes('admin');
    
    let permissionLevel = 'limited';
    let variant: "default" | "destructive" | "outline" | "secondary" = 'outline';
    
    if (hasAdmin) {
      permissionLevel = 'admin';
      variant = 'destructive';
    } else if (hasWrite && hasRead) {
      permissionLevel = 'full';
      variant = 'default';
    } else if (hasRead) {
      permissionLevel = 'read';
      variant = 'secondary';
    }
    
    return (
      <Badge variant={variant}>
        {permissionLevel.charAt(0).toUpperCase() + permissionLevel.slice(1)}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    return status === 'success' 
      ? <Shield className="w-4 h-4 text-api-success" />
      : <AlertTriangle className="w-4 h-4 text-destructive" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <Shield className="w-8 h-8 mr-3 text-api-secondary" />
              PsiZero Resonance Security
            </h1>
            <p className="text-muted-foreground">
              Manage your API keys, OAuth2 enterprise credentials, two-factor authentication, and security preferences.
            </p>
          </div>

          <div className="grid gap-6">
            {/* OAuth2 Enterprise Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  OAuth2 Enterprise Authentication
                </CardTitle>
                <CardDescription>
                  Client credentials flow for enterprise applications with enhanced security and scalability.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">OAuth2 Client Credentials</h4>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Client ID</span>
                          <Badge>Enterprise</Badge>
                        </div>
                        <code className="text-sm bg-muted p-2 rounded block">
                          psizero_enterprise_client_abc123
                        </code>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Client Secret</span>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            Reveal
                          </Button>
                        </div>
                        <code className="text-sm bg-muted p-2 rounded block">
                          ••••••••••••••••••••••••••••••••
                        </code>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Token Endpoint</span>
                        </div>
                        <code className="text-sm bg-muted p-2 rounded block break-all">
                          https://auth.psizero.dev/oauth/token
                        </code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Implementation Example</h4>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                      <pre>{`// OAuth2 Client Credentials Flow
const getAccessToken = async () => {
  const response = await fetch('https://auth.psizero.dev/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: 'your_client_id',
      client_secret: 'your_client_secret',
      scope: 'platform.read platform.write'
    })
  });
  
  const { access_token } = await response.json();
  return access_token;
};

// Using the token for API calls
const apiResponse = await fetch('https://api.psizero.dev/v1/srs/solve', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${access_token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    problem: "3sat",
    spec: { /* problem specification */ }
  })
});`}</pre>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Available Scopes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-sm font-medium">platform.read</code>
                        <Badge variant="secondary">Read</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Read access to all API endpoints, usage metrics, and account information
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-sm font-medium">platform.write</code>
                        <Badge variant="default">Write</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Full access including compute operations, session management, and configuration
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    OAuth2 credentials are available for Enterprise and Custom plan customers.
                    Contact our sales team to upgrade and receive your client credentials.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Authentication Methods Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Authentication Methods</CardTitle>
                <CardDescription>
                  Choose the right authentication method for your use case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Key className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold">API Keys</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Best for:</strong> Development, testing, simple integrations</p>
                      <p><strong>Security:</strong> Basic</p>
                      <p><strong>Expiration:</strong> Manual management</p>
                      <p><strong>Scope:</strong> Full access</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg border-primary bg-primary/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 text-green-600" />
                      <h4 className="font-semibold">OAuth2 Client Credentials</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Best for:</strong> Production, enterprise applications</p>
                      <p><strong>Security:</strong> High</p>
                      <p><strong>Expiration:</strong> Automatic (1 hour)</p>
                      <p><strong>Scope:</strong> Configurable permissions</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <h4 className="font-semibold">Session-Based</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Best for:</strong> NLC, QCR stateful APIs</p>
                      <p><strong>Security:</strong> Enhanced</p>
                      <p><strong>Expiration:</strong> Session-based</p>
                      <p><strong>Scope:</strong> API-specific</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h4 className="font-medium">
                      {twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Enable two-factor authentication'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled 
                        ? 'Your account is protected with 2FA using an authenticator app.'
                        : 'Secure your account with an additional verification step.'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                    {twoFactorEnabled && (
                      <Badge variant="default">Enabled</Badge>
                    )}
                  </div>
                </div>
                
                {!twoFactorEnabled && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your account is more vulnerable without two-factor authentication. We recommend enabling it.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* API Keys Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Key className="w-5 h-5 mr-2" />
                      API Keys
                    </CardTitle>
                    <CardDescription>
                      Manage your API keys for accessing the PsiZero Resonance platform.
                    </CardDescription>
                  </div>
                  
                  <Dialog open={isNewKeyDialogOpen} onOpenChange={setIsNewKeyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-hero">
                        <Plus className="w-4 h-4 mr-2" />
                        Create API Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New API Key</DialogTitle>
                        <DialogDescription>
                          Give your API key a descriptive name to identify its purpose.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateApiKey} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="keyName">Key Name</Label>
                          <Input
                            id="keyName"
                            placeholder="e.g., Production API, Mobile App"
                            value={newApiKeyName}
                            onChange={(e) => setNewApiKeyName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsNewKeyDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-gradient-hero">
                            Create Key
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {key.key_prefix}...
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyKey(key.key_prefix)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPermissionBadge(key.permissions || ['read'])}
                        </TableCell>
                        <TableCell>
                          {new Date(key.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteKey(key.id, key.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Security Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Security Activity</CardTitle>
                <CardDescription>
                  Recent security events and account activity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.event}</TableCell>
                        <TableCell>{log.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm">{log.location}</div>
                              <div className="text-xs text-muted-foreground">{log.ip}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(log.status)}
                            <span className="text-sm capitalize">{log.status}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;