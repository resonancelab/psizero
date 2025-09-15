import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

      // Transform database data to match UI interface
      const transformedPlans: PricingPlan[] = (plansData || []).map(dbPlan => ({
        id: dbPlan.id,
        name: dbPlan.name,
        price_cents: Math.round(dbPlan.price_monthly * 100), // Convert to cents
        period: "per month",
        description: dbPlan.description || "",
        cta_text: "Get Started",
        is_popular: dbPlan.name === "Pro", // Mark Pro as popular
        tier: dbPlan.name.toLowerCase(),
        is_active: dbPlan.is_active,
        display_order: 0,
        features: dbPlan.features || [],
        created_at: dbPlan.created_at,
        updated_at: dbPlan.updated_at
      }));

      setPlans(transformedPlans);
      setError(null);
    } catch (err) {
      console.error('Error fetching pricing plans:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pricing plans');
    } finally {
      setIsLoading(false);
    }
  };

  const createPlan = async (planData: Omit<PricingPlan, 'id' | 'created_at' | 'updated_at' | 'features'> & { features: string[] }) => {
    try {
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .insert({
          name: planData.name,
          description: planData.description,
          price_monthly: planData.price_cents / 100, // Convert cents to dollars
          price_yearly: (planData.price_cents / 100) * 10, // Yearly discount
          api_calls_limit: 1000, // Default value
          rate_limit_per_minute: 60, // Default value
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

  const updatePlan = async (id: string, planData: Partial<Omit<PricingPlan, 'id' | 'created_at' | 'updated_at' | 'features'>> & { features?: string[] }) => {
    try {
      // Update plan
      const { error: planError } = await supabase
        .from('subscription_plans')
        .update({
          ...(planData.name && { name: planData.name }),
          ...(planData.description && { description: planData.description }),
          ...(planData.price_cents !== undefined && { price_monthly: planData.price_cents / 100 }),
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