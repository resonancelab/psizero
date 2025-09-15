import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  api_calls_limit: number;
  rate_limit_per_minute: number;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePricingPlans = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      
      // Fetch plans with their features
      const { data: plansData, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (plansError) throw plansError;

      setPlans(plansData || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching pricing plans:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pricing plans');
    } finally {
      setIsLoading(false);
    }
  };

  const createPlan = async (planData: Omit<PricingPlan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .insert({
          name: planData.name,
          description: planData.description,
          price_monthly: planData.price_monthly,
          price_yearly: planData.price_yearly,
          api_calls_limit: planData.api_calls_limit,
          rate_limit_per_minute: planData.rate_limit_per_minute,
          features: planData.features,
          is_active: planData.is_active
        })
        .select()
        .single();

      if (planError) throw planError;

      await fetchPlans();
      return plan;
    } catch (err) {
      console.error('Error creating plan:', err);
      throw err;
    }
  };

  const updatePlan = async (id: string, planData: Partial<Omit<PricingPlan, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      // Update plan
      const { error: planError } = await supabase
        .from('subscription_plans')
        .update({
          ...(planData.name && { name: planData.name }),
          ...(planData.description && { description: planData.description }),
          ...(planData.price_monthly !== undefined && { price_monthly: planData.price_monthly }),
          ...(planData.price_yearly !== undefined && { price_yearly: planData.price_yearly }),
          ...(planData.api_calls_limit !== undefined && { api_calls_limit: planData.api_calls_limit }),
          ...(planData.rate_limit_per_minute !== undefined && { rate_limit_per_minute: planData.rate_limit_per_minute }),
          ...(planData.features && { features: planData.features }),
          ...(planData.is_active !== undefined && { is_active: planData.is_active })
        })
        .eq('id', id);

      if (planError) throw planError;

      await fetchPlans();
    } catch (err) {
      console.error('Error updating plan:', err);
      throw err;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchPlans();
    } catch (err) {
      console.error('Error deleting plan:', err);
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
    refetch: fetchPlans
  };
};