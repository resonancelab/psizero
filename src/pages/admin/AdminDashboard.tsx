import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import { useApiEndpoints } from "@/hooks/useApiEndpoints";
import { 
  Users, 
  DollarSign, 
  Activity, 
  Database,
  TrendingUp,
  Shield,
  CreditCard,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import psiZeroApi from "@/lib/api";

interface SystemStats {
  total_revenue: number;
  active_subscriptions: number;
  api_calls_today: number;
  error_rate: number;
}

interface RecentActivity {
  id: string;
  endpoint: string;
  endpoint_path: string;
  method: string;
  status_code: number;
  user_id: string;
  timestamp: string;
  username?: string;
  response_time_ms: number;
  profiles?: {
    username: string;
  };
}

const AdminDashboard = () => {
  const { users, getUserStats, isLoading: usersLoading } = useAdminUsers();
  const { plans, isLoading: plansLoading } = usePricingPlans();
  const { endpoints, isLoading: endpointsLoading } = useApiEndpoints();
  
  const [systemStats, setSystemStats] = useState({
    totalRevenue: 0,
    activeSubscriptions: 0,
    apiCallsToday: 0,
    errorRate: 0.2,
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  const userStats = getUserStats();

  useEffect(() => {
    const fetchSystemStats = async () => {
      try {
        // Get system admin stats
        const response = await psiZeroApi.client.get('/v1/admin/stats');
        
        if (response.error || !response.data) {
          console.error('Error fetching system stats:', response.error);
          // Set fallback data
          setSystemStats({
            totalRevenue: 0,
            activeSubscriptions: 0,
            apiCallsToday: 0,
            errorRate: 0.2,
          });
          return;
        }

        const stats = response.data as SystemStats;
        setSystemStats({
          totalRevenue: stats.total_revenue || 0,
          activeSubscriptions: stats.active_subscriptions || 0,
          apiCallsToday: stats.api_calls_today || 0,
          errorRate: stats.error_rate || 0.2,
        });
      } catch (error) {
        console.error('Error fetching system stats:', error);
        // Set fallback data
        setSystemStats({
          totalRevenue: 0,
          activeSubscriptions: 0,
          apiCallsToday: 0,
          errorRate: 0.2,
        });
      }
    };

    const fetchRecentActivity = async () => {
      try {
        // Get recent activity from admin API
        const response = await psiZeroApi.client.get('/v1/admin/activity/recent');
        
        if (response.error || !response.data) {
          console.error('Error fetching recent activity:', response.error);
          setRecentActivity([]);
          return;
        }

        setRecentActivity(response.data as RecentActivity[] || []);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        setRecentActivity([]);
      }
    };

    fetchSystemStats();
    fetchRecentActivity();
  }, []);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (usersLoading || plansLoading || endpointsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">System Overview</h1>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">System Overview</h1>
        <Badge variant="outline" className="text-api-success">
          <Shield className="h-3 w-3 mr-1" />
          System Administrator
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Users
            </CardTitle>
            <div className="text-2xl font-bold text-foreground">
              {userStats.totalUsers}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {userStats.activeUsers} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Total Revenue
            </CardTitle>
            <div className="text-2xl font-bold text-api-success">
              {formatCurrency(systemStats.totalRevenue)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {systemStats.activeSubscriptions} active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              API Calls Today
            </CardTitle>
            <div className="text-2xl font-bold text-api-secondary">
              {systemStats.apiCallsToday.toLocaleString()}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {systemStats.errorRate}% error rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Database className="h-4 w-4 mr-2" />
              API Endpoints
            </CardTitle>
            <div className="text-2xl font-bold text-api-warning">
              {endpoints.length}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Active endpoints
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Roles
            </CardTitle>
            <CardDescription>
              Breakdown of user roles in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  <Shield className="h-3 w-3 mr-1" />
                  Sysadmin
                </Badge>
              </div>
              <span className="font-bold">{userStats.sysadmins}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  <Zap className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              </div>
              <span className="font-bold">{userStats.admins}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  <Users className="h-3 w-3 mr-1" />
                  Users
                </Badge>
              </div>
              <span className="font-bold">{userStats.regularUsers}</span>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Subscription Plans
            </CardTitle>
            <CardDescription>
              Available pricing plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {plans.slice(0, 3).map((plan) => (
              <div key={plan.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {plan.tier}
                  </Badge>
                  <span className="text-sm">{plan.name}</span>
                </div>
                <span className="font-bold">
                  {formatCurrency(plan.price_cents)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Recent API Activity
          </CardTitle>
          <CardDescription>
            Latest API calls and system activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <Badge className={activity.status_code < 400 ? "bg-api-success/10 text-api-success" : "bg-destructive/10 text-destructive"}>
                      {activity.status_code}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">{activity.method} {activity.endpoint_path}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.profiles?.username || 'Unknown user'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(activity.timestamp)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.response_time_ms}ms
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;