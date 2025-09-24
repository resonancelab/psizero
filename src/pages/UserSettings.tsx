import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';
import PasswordChangeDialog from '@/components/PasswordChangeDialog';
import { 
  User, 
  Bell, 
  Brain, 
  Network, 
  Sparkles, 
  MessageSquare, 
  Hexagon, 
  Target,
  Settings,
  Palette,
  Shield
} from 'lucide-react';

interface ServicePreferences {
  rnet: {
    defaultMemberRole: 'admin' | 'writer' | 'reader';
    autoJoinSpaces: boolean;
    telemetryRate: number;
    maxConcurrentSpaces: number;
  };
  sai: {
    defaultTrainingEpochs: number;
    autoSaveInterval: number;
    preferredPrimeBasis: string;
    enableCollaborativeTraining: boolean;
  };
  srs: {
    defaultSolverTimeout: number;
    maxRestarts: number;
    preferredEntropyThreshold: number;
    enableSolutionCaching: boolean;
  };
  qllm: {
    defaultTemperature: number;
    maxTokens: number;
    enableResonanceAttention: boolean;
    conversationRetention: number;
  };
  iching: {
    defaultEvolutionSteps: number;
    autoSaveConsultations: boolean;
    enableWisdomAnalytics: boolean;
    preferredVisualization: string;
  };
  qsem: {
    defaultBasisDimension: number;
    autoNormalization: boolean;
    enableResonanceCache: boolean;
    maxConceptGraphSize: number;
  };
}

const UserSettings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    company: '',
    title: '',
    bio: '',
    timezone: 'UTC',
    language: 'en'
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    securityAlerts: true,
    serviceUpdates: true,
    billingAlerts: true,
    collaborationNotifications: true,
    weeklyDigest: false
  });

  const [servicePrefs, setServicePrefs] = useState<ServicePreferences>({
    rnet: {
      defaultMemberRole: 'writer',
      autoJoinSpaces: true,
      telemetryRate: 10,
      maxConcurrentSpaces: 5
    },
    sai: {
      defaultTrainingEpochs: 100,
      autoSaveInterval: 10,
      preferredPrimeBasis: 'ascending',
      enableCollaborativeTraining: true
    },
    srs: {
      defaultSolverTimeout: 300,
      maxRestarts: 20,
      preferredEntropyThreshold: 0.95,
      enableSolutionCaching: true
    },
    qllm: {
      defaultTemperature: 0.7,
      maxTokens: 2048,
      enableResonanceAttention: true,
      conversationRetention: 30
    },
    iching: {
      defaultEvolutionSteps: 7,
      autoSaveConsultations: true,
      enableWisdomAnalytics: true,
      preferredVisualization: 'hexagram'
    },
    qsem: {
      defaultBasisDimension: 2048,
      autoNormalization: true,
      enableResonanceCache: true,
      maxConceptGraphSize: 1000
    }
  });

  const [uiPreferences, setUiPreferences] = useState({
    theme: 'system',
    compactMode: false,
    showAdvancedOptions: false,
    dashboardLayout: 'grid',
    enableAnimations: true,
    autoRefreshData: true
  });

  const handleProfileSave = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile changes.",
        variant: "destructive",
      });
    }
  };

  const handleServicePrefsSave = async () => {
    try {
      const response = await fetch('/api/user/service-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(servicePrefs)
      });

      if (!response.ok) {
        throw new Error('Failed to update service preferences');
      }

      toast({
        title: "Service Preferences Updated",
        description: "Your service preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service preferences.",
        variant: "destructive",
      });
    }
  };

  const renderServiceSettings = (
    serviceName: keyof ServicePreferences,
    icon: React.ComponentType<{ className?: string }>,
    title: string,
    description: string
  ) => {
    const IconComponent = icon;
    const prefs = servicePrefs[serviceName];
    
    return (
      <Card key={serviceName}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(prefs).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
                <p className="text-xs text-muted-foreground">
                  Configure default {key.toLowerCase()} setting
                </p>
              </div>
              {typeof value === 'boolean' ? (
                <Switch
                  checked={value}
                  onCheckedChange={(checked) =>
                    setServicePrefs(prev => ({
                      ...prev,
                      [serviceName]: { ...prev[serviceName], [key]: checked }
                    }))
                  }
                />
              ) : typeof value === 'number' ? (
                <Input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    setServicePrefs(prev => ({
                      ...prev,
                      [serviceName]: { ...prev[serviceName], [key]: Number(e.target.value) }
                    }))
                  }
                  className="w-24"
                />
              ) : (
                <Input
                  value={value}
                  onChange={(e) =>
                    setServicePrefs(prev => ({
                      ...prev,
                      [serviceName]: { ...prev[serviceName], [key]: e.target.value }
                    }))
                  }
                  className="w-32"
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">User Settings</h1>
            <p className="text-muted-foreground">
              Manage your account, service preferences, and application settings.
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="interface">Interface</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      Contact support to change your email address.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) => setProfile({...profile, company: e.target.value})}
                        placeholder="Enter your company"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={profile.title}
                        onChange={(e) => setProfile({...profile, title: e.target.value})}
                        placeholder="Enter your job title"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      placeholder="Brief description about yourself"
                    />
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleProfileSave} className="bg-gradient-to-r from-blue-600 to-purple-600">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderServiceSettings('rnet', Network, 'Resonance Network', 'Collaborative space and real-time synchronization preferences')}
                {renderServiceSettings('sai', Brain, 'Symbolic AI', 'Training and symbolic engine configuration defaults')}
                {renderServiceSettings('srs', Target, 'Symbolic Resonance Solver', 'NP-complete problem solving preferences')}
                {renderServiceSettings('qllm', MessageSquare, 'Quantum Language Model', 'Language processing and generation settings')}
                {renderServiceSettings('iching', Hexagon, 'I-Ching Oracle', 'Divination and wisdom consultation preferences')}
                {renderServiceSettings('qsem', Sparkles, 'Quantum Semantics', 'Semantic analysis and vector encoding settings')}
              </div>
              
              <div className="pt-4">
                <Button onClick={handleServicePrefsSave} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Save Service Preferences
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you'd like to receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {key === 'emailUpdates' && 'Receive general updates about your account'}
                            {key === 'securityAlerts' && 'Get notified about security-related activities'}
                            {key === 'serviceUpdates' && 'Receive news about service improvements and features'}
                            {key === 'billingAlerts' && 'Get notified about billing and payment issues'}
                            {key === 'collaborationNotifications' && 'Notifications when others share data with you'}
                            {key === 'weeklyDigest' && 'Weekly summary of your activity across all services'}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, [key]: checked})
                          }
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4">
                    <Button className="bg-gradient-to-r from-green-600 to-blue-600">
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interface" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Interface Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your application interface and experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {Object.entries(uiPreferences).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {key === 'theme' && 'Choose your preferred color scheme'}
                            {key === 'compactMode' && 'Use more compact layouts to fit more content'}
                            {key === 'showAdvancedOptions' && 'Show advanced configuration options by default'}
                            {key === 'dashboardLayout' && 'Choose how data is displayed on dashboards'}
                            {key === 'enableAnimations' && 'Enable smooth transitions and animations'}
                            {key === 'autoRefreshData' && 'Automatically refresh data in management pages'}
                          </p>
                        </div>
                        {typeof value === 'boolean' ? (
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) =>
                              setUiPreferences({...uiPreferences, [key]: checked})
                            }
                          />
                        ) : (
                          <Badge variant="outline">{value}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                      Save Interface Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Password & Security
                  </CardTitle>
                  <CardDescription>
                    Manage your password and security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Change Password</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Update your password to keep your account secure.
                      </p>
                      <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                        Change Password
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add an extra layer of security to your account.
                      </p>
                      <Button variant="outline">
                        Enable 2FA
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Active Sessions</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage devices that are currently signed in to your account.
                      </p>
                      <Button variant="outline">
                        View Sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>
                    Manage your subscription and billing details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Billing management will be available once you upgrade to a paid plan.
                    </p>
                    <Button className="mt-4 bg-gradient-to-r from-green-600 to-blue-600">
                      View Pricing Plans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-8 border-t">
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions that affect your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                  <div>
                    <h4 className="font-medium">Sign Out</h4>
                    <p className="text-sm text-muted-foreground">
                      Sign out of your account on this device.
                    </p>
                  </div>
                  <Button variant="destructive" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                  <div>
                    <h4 className="font-medium">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PasswordChangeDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />
    </PageLayout>
  );
};

export default UserSettings;