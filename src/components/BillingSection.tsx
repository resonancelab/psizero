import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import ChangePlanDialog from "./ChangePlanDialog";
import InvoicesDialog from "./InvoicesDialog";
import { useToast } from "@/hooks/use-toast";

const BillingSection = () => {
  const { subscription, invoices, usageStats, isLoading } = useDashboard();
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const { toast } = useToast();

  const handlePlanChange = (planId: string) => {
    // In a real app, this would handle the plan change
    toast({
      title: "Plan Change Requested",
      description: `Your request to change to ${planId} plan has been received.`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const formatAmount = (amountCents: number) => {
    const amount = amountCents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUsagePercentage = () => {
    if (!usageStats || !subscription) return 0;
    return (usageStats.currentMonthUsage / subscription.monthly_api_limit) * 100;
  };

  const recentInvoices = invoices.slice(0, 3);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-api-secondary" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {subscription?.plan_name || 'No Active Plan'}
              </h3>
              <p className="text-muted-foreground">
                {subscription?.monthly_api_limit?.toLocaleString() || '0'} API calls/month
              </p>
            </div>
            <Badge variant="secondary" className="bg-api-secondary/10 text-api-secondary">
              {subscription?.status || 'Inactive'}
            </Badge>
          </div>
          
          {usageStats && subscription && (
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Usage this month</span>
                <span className="text-sm font-medium">
                  {usageStats.currentMonthUsage.toLocaleString()} / {subscription.monthly_api_limit.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowChangePlan(true)}
            >
              Change Plan
            </Button>
            <Button 
              variant="gradient" 
              className="flex-1"
              onClick={() => setShowChangePlan(true)}
            >
              Upgrade
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Your recent invoices and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInvoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No invoices found
              </div>
            ) : (
              recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{invoice.plan_name}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(invoice.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant="secondary" 
                      className={
                        invoice.status === 'paid' 
                          ? "bg-api-success/10 text-api-success" 
                          : "bg-api-warning/10 text-api-warning"
                      }
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                    <span className="font-medium">{formatAmount(invoice.amount_cents)}</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowInvoices(true)}
            >
              View All Invoices
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChangePlanDialog
        open={showChangePlan}
        onOpenChange={setShowChangePlan}
        currentPlan={subscription?.plan_name || 'Free'}
        onPlanChange={handlePlanChange}
      />

      <InvoicesDialog
        open={showInvoices}
        onOpenChange={setShowInvoices}
        invoices={invoices}
      />
    </div>
  );
};

export default BillingSection;