import { useState, useEffect, useCallback } from "react";
import psiZeroApi from "@/lib/api";
import { useToast } from "./use-toast";

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at?: string;
  is_active: boolean;
  expires_at?: string;
  permissions?: string[];
  rate_limit_requests?: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'failed' | 'cancelled';
  description?: string;
  due_date?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'suspended';
  billing_cycle: 'monthly' | 'yearly';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  cancelled_at?: string;
  trial_start?: string;
  trial_end?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  features: string[];
  limits: {
    monthly_requests?: number;
    rate_limit_rpm?: number;
  };
  is_active: boolean;
}

export interface UsageStats {
  totalCalls: number;
  successRate: number;
  currentMonthUsage: number;
  limit: number;
  recentActivity: Array<{
    endpoint: string;
    count: number;
    last_used: string;
  }>;
}

export interface DashboardStats {
  total_requests: number;
  requests_today: number;
  success_rate: number;
  active_api_keys: number;
  quota_used: number;
  quota_limit: number;
}

export const useDashboard = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [pricingPlan, setPricingPlan] = useState<PricingPlan | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardStats = async () => {
    try {
      const response = await psiZeroApi.client.get<DashboardStats>('/dashboard/stats');
      
      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to fetch dashboard stats');
      }
      
      setDashboardStats(response.data as DashboardStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set fallback data
      setDashboardStats({
        total_requests: 0,
        requests_today: 0,
        success_rate: 0,
        active_api_keys: 0,
        quota_used: 0,
        quota_limit: 1000
      });
    }
  };

  const fetchApiKeys = async () => {
    try {
      const response = await psiZeroApi.client.get<ApiKey[]>('/api-keys');
      
      if (response.error || !response.data) {
        // Silently handle missing endpoint
        setApiKeys([]);
        return;
      }
      
      // Handle different response structures
      let apiKeysArray: ApiKey[];
      if (Array.isArray(response.data)) {
        apiKeysArray = response.data;
      } else if (response.data && typeof response.data === 'object' && 'api_keys' in response.data) {
        apiKeysArray = (response.data as { api_keys: ApiKey[] }).api_keys;
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        apiKeysArray = (response.data as { data: ApiKey[] }).data;
      } else {
        apiKeysArray = response.data as ApiKey[];
      }
      
      setApiKeys(apiKeysArray || []);
    } catch (error) {
      // Silently handle missing endpoint - don't log 404s
      setApiKeys([]);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await psiZeroApi.client.get<Invoice[]>('/billing/invoices');
      
      if (response.error || !response.data) {
        // Silently handle missing endpoint
        setInvoices([]);
        return;
      }
      
      setInvoices(response.data as Invoice[]);
    } catch (error) {
      // Silently handle missing endpoint
      setInvoices([]);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await psiZeroApi.client.get<Subscription>('/billing/subscription');
      
      if (response.error || !response.data) {
        // Silently handle missing endpoint
        setSubscription(null);
        return;
      }
      
      setSubscription(response.data as Subscription);
    } catch (error) {
      // Silently handle missing endpoint
      setSubscription(null);
    }
  };

  const fetchPricingPlan = useCallback(async () => {
    try {
      if (!subscription) return;
      
      const response = await psiZeroApi.client.get<PricingPlan>(`/billing/plans/${subscription.plan_id}`);
      
      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to fetch pricing plan');
      }
      
      setPricingPlan(response.data as PricingPlan);
    } catch (error) {
      console.error('Error fetching pricing plan:', error);
      setPricingPlan(null);
    }
  }, [subscription]);

  const fetchUsageStats = useCallback(async () => {
    try {
      const response = await psiZeroApi.client.get<UsageStats>('/dashboard/usage');
      
      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to fetch usage stats');
      }
      
      setUsageStats(response.data as UsageStats);
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      // Set fallback data
      setUsageStats({
        totalCalls: dashboardStats?.total_requests || 0,
        successRate: dashboardStats?.success_rate || 99.9,
        currentMonthUsage: dashboardStats?.quota_used || 0,
        limit: dashboardStats?.quota_limit || 1000,
        recentActivity: []
      });
    }
  }, [dashboardStats]);

  const createApiKey = async (name: string, permissions: string[] = [], expiresAt?: string) => {
    try {
      const response = await psiZeroApi.client.post<{ key: string; api_key: ApiKey }>('/api-keys', {
        name,
        scopes: permissions.length > 0 ? permissions : ['read'],
        rate_limit_tier: 'basic',
        expires_at: expiresAt
      });

      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to create API key');
      }

      toast({
        title: "API Key Created",
        description: `${name} has been created successfully. Make sure to save it!`,
      });

      await fetchApiKeys();
      return (response.data as { key: string; api_key: ApiKey }).key; // Return the full key for display
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteApiKey = async (id: string, name: string) => {
    try {
      console.log(`[DEBUG] Attempting to delete API key: ${id} (${name})`);
      console.log(`[DEBUG] Current API keys before deletion:`, apiKeys);
      
      const response = await psiZeroApi.client.delete(`/api-keys/${id}`);
      
      console.log(`[DEBUG] DELETE response:`, response);

      if (response.error) {
        console.error(`[DEBUG] DELETE request failed with error:`, response.error);
        throw new Error(response.error);
      }

      console.log(`[DEBUG] DELETE request successful, refreshing API key list...`);

      toast({
        title: "API Key Deleted",
        description: `${name} has been deleted successfully.`,
      });

      await fetchApiKeys();
      console.log(`[DEBUG] API keys after refresh:`, apiKeys);
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  // Keep the old function name for backward compatibility
  const revokeApiKey = deleteApiKey;

  const updateApiKey = async (id: string, updates: Partial<ApiKey>) => {
    try {
      const response = await psiZeroApi.client.put(`/api-keys/${id}`, updates);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "API Key Updated",
        description: "The API key has been updated successfully.",
      });

      await fetchApiKeys();
    } catch (error) {
      console.error('Error updating API key:', error);
      toast({
        title: "Error",
        description: "Failed to update API key",
        variant: "destructive",
      });
    }
  };

  const getApiKeyUsage = async (id: string) => {
    try {
      const response = await psiZeroApi.client.get(`/api-keys/${id}/usage`);
      
      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to fetch API key usage');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching API key usage:', error);
      return null;
    }
  };

  const changePlan = async (planId: string) => {
    try {
      const response = await psiZeroApi.client.post('/billing/change-plan', {
        plan_id: planId
      });

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Plan Changed",
        description: "Your subscription plan has been updated successfully.",
      });

      await fetchSubscription();
      await fetchPricingPlan();
    } catch (error) {
      console.error('Error changing plan:', error);
      toast({
        title: "Error",
        description: "Failed to change plan",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch basic dashboard stats first
        await fetchDashboardStats();
        
        // Then fetch other data in parallel
        await Promise.all([
          fetchApiKeys(),
          fetchInvoices(),
          fetchSubscription(),
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (subscription) {
      fetchPricingPlan();
    }
  }, [subscription, fetchPricingPlan]);

  useEffect(() => {
    if (dashboardStats) {
      fetchUsageStats();
    }
  }, [dashboardStats, fetchUsageStats]);

  return {
    // Data
    apiKeys,
    invoices,
    subscription,
    pricingPlan,
    usageStats,
    dashboardStats,
    isLoading,
    
    // API Key functions
    createApiKey,
    deleteApiKey,
    revokeApiKey, // Backward compatibility
    updateApiKey,
    getApiKeyUsage,
    
    // Billing functions
    changePlan,
    
    // Utility functions
    refetch: async () => {
      await Promise.all([
        fetchDashboardStats(),
        fetchApiKeys(),
        fetchInvoices(),
        fetchSubscription(),
        fetchUsageStats(),
      ]);
    }
  };
};