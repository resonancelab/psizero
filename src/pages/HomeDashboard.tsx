import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Link } from "react-router-dom";
import {
  Brain,
  Network,
  Sparkles,
  MessageSquare,
  Hexagon,
  Target,
  Plus,
  Activity,
  Clock,
  Users,
  TrendingUp,
  Zap,
  BarChart3,
  Settings,
  Calendar,
  FileText,
  PlayCircle,
  ChevronRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface ServiceStats {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  path: string;
  stats: {
    totalUsage: number;
    recentActivity: string;
    status: 'active' | 'idle' | 'error';
    lastUsed?: string;
  };
  quickActions: Array<{
    label: string;
    action: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

interface RecentActivity {
  id: string;
  service: string;
  action: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
  details?: string;
}

const HomeDashboard = () => {
  const { user } = useAuth();
  const { usageStats, isLoading } = useDashboard();
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [serviceStats, setServiceStats] = useState<ServiceStats[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch service statistics
        const servicesResponse = await fetch('/api/dashboard/services', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServiceStats(servicesData);
        }

        // Fetch recent activity
        const activityResponse = await fetch('/api/dashboard/activity', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setRecentActivity(activityData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getServiceIcon = (serviceName: string) => {
    const service = serviceStats.find(s => s.name === serviceName);
    if (service) {
      const IconComponent = service.icon;
      return <IconComponent className="h-4 w-4" />;
    }
    return <Activity className="h-4 w-4" />;
  };

  return (
    <PageLayout>
      <Section>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome back, {user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your quantum computing services and monitor your activity across the PsiZero platform.
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total API Calls</CardDescription>
                <CardTitle className="text-3xl text-blue-600">
                  {isLoading ? '...' : (usageStats?.totalCalls?.toLocaleString() || '647')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Services</CardDescription>
                <CardTitle className="text-3xl text-green-600">
                  {serviceStats.filter(s => s.stats.status === 'active').length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Success Rate</CardDescription>
                <CardTitle className="text-3xl text-emerald-600">
                  {isLoading ? '...' : `${usageStats?.successRate || 99.2}%`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Collaboration</CardDescription>
                <CardTitle className="text-3xl text-purple-600">
                  12
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Shared projects</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="services" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="services">Service Overview</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-6">
              {/* Service Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {serviceStats.map((service) => {
                  const IconComponent = service.icon;
                  return (
                    <Card key={service.name} className="relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5`} />
                      <CardHeader className="relative">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${service.color}`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{service.name}</CardTitle>
                              <CardDescription>{service.description}</CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant={service.stats.status === 'active' ? 'default' : 'secondary'}
                            className={service.stats.status === 'active' ? 'bg-green-500' : ''}
                          >
                            {service.stats.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="relative space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Total Usage</p>
                            <p className="font-semibold">{service.stats.totalUsage}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Used</p>
                            <p className="font-semibold">{service.stats.lastUsed}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Recent Activity</p>
                          <p className="font-medium">{service.stats.recentActivity}</p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Quick Actions</p>
                          <div className="flex flex-wrap gap-2">
                            {service.quickActions.map((action) => {
                              const ActionIcon = action.icon;
                              return (
                                <Button 
                                  key={action.action}
                                  variant="outline" 
                                  size="sm"
                                  className="text-xs"
                                >
                                  <ActionIcon className="h-3 w-3 mr-1" />
                                  {action.label}
                                </Button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button asChild className="w-full">
                            <Link to={service.path}>
                              Manage {service.name}
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest interactions across all services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getServiceIcon(activity.service)}
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {activity.service}
                              </Badge>
                              <span>•</span>
                              <span>{activity.timestamp}</span>
                            </div>
                            {activity.details && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {activity.details}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="ml-auto">
                          {getStatusIcon(activity.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      View All Activity
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Usage Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>QLLM</span>
                          <span>41%</span>
                        </div>
                        <Progress value={41} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>SAI</span>
                          <span>24%</span>
                        </div>
                        <Progress value={24} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>RNET</span>
                          <span>18%</span>
                        </div>
                        <Progress value={18} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>QSEM</span>
                          <span>12%</span>
                        </div>
                        <Progress value={12} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Others</span>
                          <span>5%</span>
                        </div>
                        <Progress value={5} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Performance Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-medium">Excellent Performance</span>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                          Your QLLM models are running 15% faster than average
                        </p>
                      </div>
                      
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-medium">Collaboration Growth</span>
                        </div>
                        <p className="text-sm text-blue-600 dark:text-blue-500 mt-1">
                          Your RNET spaces have 3x more activity this month
                        </p>
                      </div>
                      
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                          <Target className="h-4 w-4" />
                          <span className="font-medium">Optimization Opportunity</span>
                        </div>
                        <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                          Consider tuning your SRS solver parameters for better performance
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Start Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" />
                Quick Start
              </CardTitle>
              <CardDescription>
                Get started with new features and explore advanced capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link to="/playground" className="flex flex-col items-center gap-2">
                    <PlayCircle className="h-6 w-6" />
                    <span>Try Playground</span>
                    <span className="text-xs text-muted-foreground">Interactive demos</span>
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link to="/docs" className="flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Documentation</span>
                    <span className="text-xs text-muted-foreground">API guides & tutorials</span>
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link to="/settings" className="flex flex-col items-center gap-2">
                    <Settings className="h-6 w-6" />
                    <span>Settings</span>
                    <span className="text-xs text-muted-foreground">Customize preferences</span>
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link to="/examples" className="flex flex-col items-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    <span>Examples</span>
                    <span className="text-xs text-muted-foreground">Code samples</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default HomeDashboard;