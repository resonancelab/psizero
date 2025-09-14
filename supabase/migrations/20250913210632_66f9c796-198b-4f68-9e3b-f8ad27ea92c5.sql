-- Create subscription_plans table
CREATE TABLE public.subscription_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price_cents integer NOT NULL,
  period text NOT NULL,
  description text NOT NULL,
  cta_text text NOT NULL,
  is_popular boolean NOT NULL DEFAULT false,
  tier text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create plan_features table for flexible feature management
CREATE TABLE public.plan_features (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  feature_text text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_features ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans
CREATE POLICY "Anyone can view active plans" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage plans" 
ON public.subscription_plans 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for plan_features  
CREATE POLICY "Anyone can view features for active plans" 
ON public.plan_features 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.subscription_plans 
  WHERE id = plan_features.plan_id AND is_active = true
));

CREATE POLICY "Authenticated users can manage plan features" 
ON public.plan_features 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_subscription_plans_active ON public.subscription_plans(is_active, display_order);
CREATE INDEX idx_plan_features_plan_id ON public.plan_features(plan_id, display_order);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pricing data
INSERT INTO public.subscription_plans (name, price_cents, period, description, cta_text, is_popular, tier, display_order) VALUES
('Free', 0, 'forever', 'Perfect for getting started and small projects', 'Start Free', false, 'free', 1),
('Pro', 4900, 'per month', 'For growing applications and businesses', 'Start Pro Trial', true, 'pro', 2),
('Enterprise', 0, 'pricing', 'For large-scale applications and organizations', 'Contact Sales', false, 'enterprise', 3);

-- Insert features for Free plan
INSERT INTO public.plan_features (plan_id, feature_text, display_order) 
SELECT id, feature_text, display_order FROM public.subscription_plans, 
  (VALUES 
    ('1,000 API calls/month', 1),
    ('Basic analytics', 2),
    ('Email support', 3),
    ('Standard rate limits', 4),
    ('Community access', 5)
  ) AS features(feature_text, display_order)
WHERE name = 'Free';

-- Insert features for Pro plan
INSERT INTO public.plan_features (plan_id, feature_text, display_order)
SELECT id, feature_text, display_order FROM public.subscription_plans,
  (VALUES
    ('100,000 API calls/month', 1),
    ('Advanced analytics', 2), 
    ('Priority support', 3),
    ('Higher rate limits', 4),
    ('Webhooks included', 5),
    ('Custom integrations', 6)
  ) AS features(feature_text, display_order)
WHERE name = 'Pro';

-- Insert features for Enterprise plan
INSERT INTO public.plan_features (plan_id, feature_text, display_order)
SELECT id, feature_text, display_order FROM public.subscription_plans,
  (VALUES
    ('Unlimited API calls', 1),
    ('Enterprise analytics', 2),
    ('24/7 dedicated support', 3), 
    ('Custom rate limits', 4),
    ('SLA guarantee', 5),
    ('On-premise options', 6),
    ('Custom contracts', 7)
  ) AS features(feature_text, display_order)
WHERE name = 'Enterprise';