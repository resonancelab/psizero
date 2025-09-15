-- Create profiles table with sysadmin flag
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  is_sysadmin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles  
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Sysadmins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_sysadmin = true
    )
  );

CREATE POLICY "Sysadmins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_sysadmin = true
    )
  );

-- Function to check if user is sysadmin
CREATE OR REPLACE FUNCTION public.is_sysadmin(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_sysadmin FROM public.profiles WHERE id = _user_id),
    false
  );
$$;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, is_sysadmin)
  VALUES (new.id, false);
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing RLS policies to use new is_sysadmin function
DROP POLICY IF EXISTS "Sysadmins can manage all user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Sysadmins can manage all api_endpoints" ON public.api_endpoints;
DROP POLICY IF EXISTS "Sysadmins can manage all api_target_configs" ON public.api_target_configs;
DROP POLICY IF EXISTS "Sysadmins can manage all api_keys" ON public.api_keys;
DROP POLICY IF EXISTS "Sysadmins can view all api_usage" ON public.api_usage;
DROP POLICY IF EXISTS "Sysadmins can manage all api_rate_limits" ON public.api_rate_limits;
DROP POLICY IF EXISTS "Sysadmins can manage all subscription_plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Sysadmins can manage all user_subscriptions" ON public.user_subscriptions;

-- Recreate policies using is_sysadmin function
CREATE POLICY "Sysadmins can manage all user_roles" ON public.user_roles
  FOR ALL USING (public.is_sysadmin());

CREATE POLICY "Sysadmins can manage all api_endpoints" ON public.api_endpoints
  FOR ALL USING (public.is_sysadmin());

CREATE POLICY "Sysadmins can manage all api_target_configs" ON public.api_target_configs
  FOR ALL USING (public.is_sysadmin());

CREATE POLICY "Sysadmins can manage all api_keys" ON public.api_keys
  FOR ALL USING (public.is_sysadmin());

CREATE POLICY "Sysadmins can view all api_usage" ON public.api_usage
  FOR SELECT USING (public.is_sysadmin());

CREATE POLICY "Sysadmins can manage all api_rate_limits" ON public.api_rate_limits
  FOR ALL USING (public.is_sysadmin());

CREATE POLICY "Sysadmins can manage all subscription_plans" ON public.subscription_plans
  FOR ALL USING (public.is_sysadmin());

CREATE POLICY "Sysadmins can manage all user_subscriptions" ON public.user_subscriptions
  FOR ALL USING (public.is_sysadmin());

-- Add trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();