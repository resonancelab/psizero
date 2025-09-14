-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('sysadmin', 'admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS
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
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'sysadmin' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'user' THEN 3
    END
  LIMIT 1
$$;

-- RLS Policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Sysadmins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'sysadmin'));

-- Create function to get admin users data (security definer for sysadmin access)
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  role app_role,
  username TEXT,
  avatar_url TEXT,
  plan_tier TEXT,
  monthly_api_limit INTEGER,
  subscription_status TEXT,
  api_keys_count BIGINT,
  usage_last_30_days BIGINT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    u.id,
    u.email,
    u.created_at,
    u.last_sign_in_at,
    ur.role,
    p.username,
    p.avatar_url,
    us.plan_tier,
    us.monthly_api_limit,
    us.status,
    COUNT(DISTINCT ak.id) as api_keys_count,
    COUNT(DISTINCT CASE WHEN au.timestamp >= NOW() - INTERVAL '30 days' THEN au.id END) as usage_last_30_days
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON ur.user_id = u.id
  LEFT JOIN public.profiles p ON p.id = u.id
  LEFT JOIN public.user_subscriptions us ON us.user_id = u.id AND us.status = 'active'
  LEFT JOIN public.api_keys ak ON ak.user_id = u.id AND ak.is_active = true
  LEFT JOIN public.api_usage au ON au.user_id = u.id
  WHERE public.has_role(auth.uid(), 'sysadmin')
  GROUP BY u.id, u.email, u.created_at, u.last_sign_in_at, ur.role, p.username, p.avatar_url, us.plan_tier, us.monthly_api_limit, us.status
$$;