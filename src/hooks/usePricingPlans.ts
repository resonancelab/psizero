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
        .select(`
          *,
          plan_features (
            feature_text,
            display_order
          )
        `)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (plansError) throw plansError;

      // Transform the data to match our interface
      const transformedPlans: PricingPlan[] = (plansData || []).map(plan => ({
        id: plan.id,
        name: plan.name,
        price_cents: plan.price_cents,
        period: plan.period,
        description: plan.description,
        cta_text: plan.cta_text,
        is_popular: plan.is_popular,
        tier: plan.tier,
        is_active: plan.is_active,
        display_order: plan.display_order,
        created_at: plan.created_at,
        updated_at: plan.updated_at,
        features: (plan.plan_features || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((f: any) => f.feature_text)
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
          price_cents: planData.price_cents,
          period: planData.period,
          description: planData.description,
          cta_text: planData.cta_text,
          is_popular: planData.is_popular,
          tier: planData.tier,
          is_active: planData.is_active,
          display_order: planData.display_order
        })
        .select()
        .single();

      if (planError) throw planError;

      // Insert features
      if (planData.features.length > 0) {
        const featuresData = planData.features.map((feature, index) => ({
          plan_id: plan.id,
          feature_text: feature,
          display_order: index + 1
        }));

        const { error: featuresError } = await supabase
          .from('plan_features')
          .insert(featuresData);

        if (featuresError) throw featuresError;
      }

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
          ...(planData.price_cents !== undefined && { price_cents: planData.price_cents }),
          ...(planData.period && { period: planData.period }),
          ...(planData.description && { description: planData.description }),
          ...(planData.cta_text && { cta_text: planData.cta_text }),
          ...(planData.is_popular !== undefined && { is_popular: planData.is_popular }),
          ...(planData.tier && { tier: planData.tier }),
          ...(planData.is_active !== undefined && { is_active: planData.is_active }),
          ...(planData.display_order !== undefined && { display_order: planData.display_order })
        })
        .eq('id', id);

      if (planError) throw planError;

      // Update features if provided
      if (planData.features) {
        // Delete existing features
        await supabase
          .from('plan_features')
          .delete()
          .eq('plan_id', id);

        // Insert new features
        if (planData.features.length > 0) {
          const featuresData = planData.features.map((feature, index) => ({
            plan_id: id,
            feature_text: feature,
            display_order: index + 1
          }));

          const { error: featuresError } = await supabase
            .from('plan_features')
            .insert(featuresData);

          if (featuresError) throw featuresError;
        }
      }

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