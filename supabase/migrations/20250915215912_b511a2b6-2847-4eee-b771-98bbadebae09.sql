-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('sysadmin', 'admin', 'user');

-- Create user roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create API endpoints table
CREATE TABLE public.api_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path TEXT NOT NULL,
    method TEXT NOT NULL,
    target_url TEXT NOT NULL,
    target_method TEXT NOT NULL,
    requires_auth BOOLEAN DEFAULT true,
    auth_type TEXT DEFAULT 'bearer',
    auth_header_name TEXT DEFAULT 'Authorization',
    timeout_ms INTEGER DEFAULT 30000,
    rate_limit_per_minute INTEGER DEFAULT 60,
    cost_per_request DECIMAL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (path, method)
);

-- Enable RLS on api_endpoints
ALTER TABLE public.api_endpoints ENABLE ROW LEVEL SECURITY;

-- Create API target configs table
CREATE TABLE public.api_target_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint_id UUID REFERENCES public.api_endpoints(id) ON DELETE CASCADE NOT NULL,
    config_name TEXT NOT NULL,
    config_value TEXT NOT NULL,
    is_encrypted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (endpoint_id, config_name)
);

-- Enable RLS on api_target_configs
ALTER TABLE public.api_target_configs ENABLE ROW LEVEL SECURITY;

-- Create API keys table
CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on api_keys
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create API usage table for metrics
CREATE TABLE public.api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    api_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL,
    endpoint_path TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    request_size_bytes INTEGER DEFAULT 0,
    response_size_bytes INTEGER DEFAULT 0,
    forwarded_to TEXT,
    cost_units DECIMAL DEFAULT 1,
    error_message TEXT
);

-- Enable RLS on api_usage
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Create API rate limits table
CREATE TABLE public.api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE NOT NULL,
    endpoint_id UUID REFERENCES public.api_endpoints(id) ON DELETE CASCADE NOT NULL,
    requests_count INTEGER DEFAULT 0,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (api_key_id, endpoint_id, window_start)
);

-- Enable RLS on api_rate_limits
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price_monthly DECIMAL NOT NULL,
    price_yearly DECIMAL,
    api_calls_limit INTEGER,
    rate_limit_per_minute INTEGER DEFAULT 60,
    features TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subscription_plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE RESTRICT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    stripe_subscription_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create admin function to get user details
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
    id UUID,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    roles TEXT[]
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    u.id,
    u.email,
    u.created_at,
    COALESCE(array_agg(ur.role::TEXT) FILTER (WHERE ur.role IS NOT NULL), '{}') as roles
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id
  GROUP BY u.id, u.email, u.created_at
  ORDER BY u.created_at DESC;
$$;

-- RLS Policies for sysadmin/admin access
CREATE POLICY "Sysadmins can manage all user_roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'sysadmin'));

CREATE POLICY "Sysadmins can manage all api_endpoints" ON public.api_endpoints
  FOR ALL USING (public.has_role(auth.uid(), 'sysadmin'));

CREATE POLICY "Sysadmins can manage all api_target_configs" ON public.api_target_configs
  FOR ALL USING (public.has_role(auth.uid(), 'sysadmin'));

CREATE POLICY "Users can view their own api_keys" ON public.api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own api_keys" ON public.api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own api_keys" ON public.api_keys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Sysadmins can manage all api_keys" ON public.api_keys
  FOR ALL USING (public.has_role(auth.uid(), 'sysadmin'));

CREATE POLICY "Users can view their own api_usage" ON public.api_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Sysadmins can view all api_usage" ON public.api_usage
  FOR SELECT USING (public.has_role(auth.uid(), 'sysadmin'));

CREATE POLICY "System can insert api_usage" ON public.api_usage
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Sysadmins can manage all api_rate_limits" ON public.api_rate_limits
  FOR ALL USING (public.has_role(auth.uid(), 'sysadmin'));

CREATE POLICY "Everyone can view active subscription_plans" ON public.subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Sysadmins can manage all subscription_plans" ON public.subscription_plans
  FOR ALL USING (public.has_role(auth.uid(), 'sysadmin'));

CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Sysadmins can manage all user_subscriptions" ON public.user_subscriptions
  FOR ALL USING (public.has_role(auth.uid(), 'sysadmin'));

-- Create indexes for performance
CREATE INDEX idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX idx_api_usage_timestamp ON public.api_usage(timestamp);
CREATE INDEX idx_api_usage_endpoint_path ON public.api_usage(endpoint_path);
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON public.api_keys(key_hash);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, api_calls_limit, rate_limit_per_minute, features) VALUES
('Hobbyist', 'Perfect for personal projects and experimentation', 9.99, 99.99, 1000, 10, ARRAY['1,000 API calls/month', '10 calls/minute', 'Community support', 'Basic analytics']),
('Pro', 'Ideal for small to medium businesses', 49.99, 499.99, 10000, 60, ARRAY['10,000 API calls/month', '60 calls/minute', 'Priority support', 'Advanced analytics', 'Custom endpoints']),
('Business', 'Designed for growing companies', 199.99, 1999.99, 100000, 300, ARRAY['100,000 API calls/month', '300 calls/minute', '24/7 support', 'Full analytics suite', 'Custom integrations', 'SLA guarantee']),
('Enterprise', 'Custom solutions for large organizations', 999.99, 9999.99, -1, 1000, ARRAY['Unlimited API calls', '1,000 calls/minute', 'Dedicated support', 'Custom analytics', 'On-premise deployment', 'Custom SLA']);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_api_endpoints_updated_at BEFORE UPDATE ON public.api_endpoints
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();