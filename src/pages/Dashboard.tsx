import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import ApiUsageChart from "@/components/ApiUsageChart";
import BillingSection from "@/components/BillingSection";
import ApiKeySection from "@/components/ApiKeySection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";

const Dashboard = () => {
  const { subscription, usageStats, isLoading } = useDashboard();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  return (
    <PageLayout>
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Monitor your API usage, manage billing, and access your API keys.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>This Month</CardDescription>
                <CardTitle className="text-3xl text-api-secondary">
                  {isLoading ? '...' : (usageStats?.currentMonthUsage?.toLocaleString() || '0')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">API Calls</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Success Rate</CardDescription>
                <CardTitle className="text-3xl text-api-success">
                  {isLoading ? '...' : `${usageStats?.successRate || 99.9}%`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Current Plan</CardDescription>
                <CardTitle className="text-3xl">
                  {isLoading ? '...' : (subscription?.plan_tier?.charAt(0).toUpperCase() + subscription?.plan_tier?.slice(1) || 'Free')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {subscription?.monthly_api_limit?.toLocaleString() || '0'} calls/month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Next Billing</CardDescription>
                <CardTitle className="text-3xl">
                  {isLoading ? '...' : (subscription?.price_cents ? formatCurrency(subscription.price_cents) : 'Free')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {subscription?.current_period_end ? formatDate(subscription.current_period_end) : 'N/A'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <ApiUsageChart />
              <ApiKeySection />
            </div>
            <div>
              <BillingSection />
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Dashboard;