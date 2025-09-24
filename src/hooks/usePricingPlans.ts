import { useState, useEffect } from 'react';
import psiZeroApi from '@/lib/api';
import { useToast } from './use-toast';

export interface PricingPlan {
  id: string;
  name: string;
  price_cents: number;
  period: string;
  description: string;
  cta_text: string;
  is_popular: boolean;
  tier: string;
  is_active: boolean;
  display_order: number;
  features: string[];
  created_at: string;
  updated_at: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  limits: {
    monthly_requests?: number;
    rate_limit_rpm?: number;
  };
}

export interface CreatePricingPlanRequest {
  name: string;
  description: string;
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

export interface UpdatePricingPlanRequest {
  name?: string;
  description?: string;
  price_monthly?: number;
  price_yearly?: number;
  currency?: string;
  features?: string[];
  limits?: {
    monthly_requests?: number;
    rate_limit_rpm?: number;
  };
  is_active?: boolean;
}

export const usePricingPlans = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      
      const response = await psiZeroApi.client.get<PricingPlan[]>('/billing/plans');
      
      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to fetch pricing plans');
      }

      // Transform API data to match UI interface
      const transformedPlans: PricingPlan[] = (response.data as PricingPlan[]).map(apiPlan => ({
        ...apiPlan,
        price_cents: Math.round(apiPlan.price_monthly * 100), // Convert to cents for UI compatibility
        period: "per month",
        cta_text: "Get Started",
        is_popular: apiPlan.name === "Pro", // Mark Pro as popular
        tier: apiPlan.name.toLowerCase(),
        display_order: 0,
      }));

      setPlans(transformedPlans);
      setError(null);
    } catch (err) {
      console.error('Error fetching pricing plans:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pricing plans');
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createPlan = async (planData: Omit<PricingPlan, 'id' | 'created_at' | 'updated_at' | 'price_cents' | 'period' | 'cta_text' | 'is_popular' | 'tier' | 'display_order'>) => {
    try {
      const request: CreatePricingPlanRequest = {
        name: planData.name,
        description: planData.description,
        price_monthly: planData.price_monthly,
        price_yearly: planData.price_yearly,
        currency: planData.currency || 'USD',
        features: planData.features,
        limits: planData.limits || {
          monthly_requests: 1000,
          rate_limit_rpm: 60
        },
        is_active: planData.is_active
      };

      const response = await psiZeroApi.client.post<PricingPlan>('/billing/plans', request);

      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to create pricing plan');
      }

      toast({
        title: "Success",
        description: "Pricing plan created successfully",
      });

      await fetchPlans();
      return response.data as PricingPlan;
    } catch (err) {
      console.error('Error creating plan:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create pricing plan",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updatePlan = async (id: string, planData: UpdatePricingPlanRequest) => {
    try {
      const response = await psiZeroApi.client.put<PricingPlan>(`/billing/plans/${id}`, planData);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Success",
        description: "Pricing plan updated successfully",
      });

      await fetchPlans();
      return response.data;
    } catch (err) {
      console.error('Error updating plan:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update pricing plan",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      const response = await psiZeroApi.client.delete(`/billing/plans/${id}`);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Success",
        description: "Pricing plan deleted successfully",
      });

      await fetchPlans();
    } catch (err) {
      console.error('Error deleting plan:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete pricing plan",
        variant: "destructive",
      });
      throw err;
    }
  };

  const activatePlan = async (id: string) => {
    try {
      const response = await psiZeroApi.client.post(`/billing/plans/${id}/activate`);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Success",
        description: "Pricing plan activated successfully",
      });

      await fetchPlans();
    } catch (err) {
      console.error('Error activating plan:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to activate pricing plan",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deactivatePlan = async (id: string) => {
    try {
      const response = await psiZeroApi.client.post(`/billing/plans/${id}/deactivate`);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Success",
        description: "Pricing plan deactivated successfully",
      });

      await fetchPlans();
    } catch (err) {
      console.error('Error deactivating plan:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to deactivate pricing plan",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    isLoading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    activatePlan,
    deactivatePlan,
    refetch: fetchPlans
  };
};