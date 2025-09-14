-- Create tables for API keys and billing management

-- API Keys table
CREATE TABLE public.api_keys (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL,
  key_prefix text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_used_at timestamp with time zone,
  is_active boolean DEFAULT true,
  expires_at timestamp with time zone
);

-- Invoices table
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number text NOT NULL UNIQUE,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL CHECK (status IN ('draft', 'paid', 'pending', 'failed', 'cancelled')),
  plan_name text NOT NULL,
  billing_period_start timestamp with time zone NOT NULL,
  billing_period_end timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  paid_at timestamp with time zone,
  due_date timestamp with time zone
);

-- User subscriptions table
CREATE TABLE public.user_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  plan_tier text NOT NULL CHECK (plan_tier IN ('free', 'starter', 'pro', 'enterprise')),
  monthly_api_limit integer NOT NULL,
  price_cents integer NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start timestamp with time zone NOT NULL,
  current_period_end timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- API usage tracking table
CREATE TABLE public.api_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key_id uuid REFERENCES public.api_keys(id) ON DELETE SET NULL,
  endpoint_path text,
  method text,
  status_code integer,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  response_time_ms integer
);

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_keys
CREATE POLICY "Users can manage their own API keys" 
ON public.api_keys 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for invoices
CREATE POLICY "Users can view their own invoices" 
ON public.invoices 
FOR SELECT 
USING (auth.uid() = user_id);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.user_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
ON public.user_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for api_usage
CREATE POLICY "Users can view their own usage" 
ON public.api_usage 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_active ON public.api_keys(user_id, is_active);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_api_usage_user_id_timestamp ON public.api_usage(user_id, timestamp DESC);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for current user (this will be handled by the app)
-- Sample subscription plans
INSERT INTO public.user_subscriptions (user_id, plan_name, plan_tier, monthly_api_limit, price_cents, status, current_period_start, current_period_end) 
VALUES 
(auth.uid(), 'Pro Plan', 'pro', 100000, 4900, 'active', 
 date_trunc('month', now()), 
 date_trunc('month', now()) + interval '1 month')
WHERE auth.uid() IS NOT NULL;

-- Sample invoices
INSERT INTO public.invoices (user_id, invoice_number, amount_cents, status, plan_name, billing_period_start, billing_period_end, paid_at, due_date)
SELECT 
  auth.uid(),
  'INV-' || to_char(generate_series(1, 3), 'FM000000'),
  4900,
  'paid',
  'Pro Plan',
  date_trunc('month', now()) - (generate_series(1, 3) || ' months')::interval,
  date_trunc('month', now()) - (generate_series(0, 2) || ' months')::interval,
  date_trunc('month', now()) - (generate_series(0, 2) || ' months')::interval + interval '5 days',
  date_trunc('month', now()) - (generate_series(0, 2) || ' months')::interval + interval '30 days'
WHERE auth.uid() IS NOT NULL;