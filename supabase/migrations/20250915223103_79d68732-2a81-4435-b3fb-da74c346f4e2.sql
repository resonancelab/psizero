-- Create organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create organization members table (many-to-many)
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Add organization_id to existing tables
ALTER TABLE public.api_keys ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.api_usage ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.user_subscriptions ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Enable RLS on new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for organizations
CREATE POLICY "Users can view organizations they belong to" ON public.organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members 
      WHERE organization_id = organizations.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners can manage their organization" ON public.organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organization_members 
      WHERE organization_id = organizations.id 
        AND user_id = auth.uid() 
        AND role = 'owner'
    )
  );

CREATE POLICY "Sysadmins can manage all organizations" ON public.organizations
  FOR ALL USING (public.is_sysadmin());

-- RLS policies for organization members
CREATE POLICY "Users can view organization members for orgs they belong to" ON public.organization_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om 
      WHERE om.organization_id = organization_members.organization_id 
        AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners can manage members" ON public.organization_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organization_members 
      WHERE organization_id = organization_members.organization_id 
        AND user_id = auth.uid() 
        AND role = 'owner'
    )
  );

CREATE POLICY "Sysadmins can manage all organization members" ON public.organization_members
  FOR ALL USING (public.is_sysadmin());

-- Update existing RLS policies to include organization scoping
DROP POLICY IF EXISTS "Users can view their own api_keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can create their own api_keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can update their own api_keys" ON public.api_keys;

CREATE POLICY "Users can view api_keys for their organizations" ON public.api_keys
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.organization_members 
      WHERE organization_id = api_keys.organization_id 
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create api_keys for their organizations" ON public.api_keys
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    (organization_id IS NULL OR EXISTS (
      SELECT 1 FROM public.organization_members 
      WHERE organization_id = api_keys.organization_id 
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    ))
  );

CREATE POLICY "Users can update api_keys for their organizations" ON public.api_keys
  FOR UPDATE USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.organization_members 
      WHERE organization_id = api_keys.organization_id 
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Update api_usage policies
DROP POLICY IF EXISTS "Users can view their own api_usage" ON public.api_usage;

CREATE POLICY "Users can view api_usage for their organizations" ON public.api_usage
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.organization_members 
      WHERE organization_id = api_usage.organization_id 
        AND user_id = auth.uid()
    )
  );

-- Update user_subscriptions policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.user_subscriptions;

CREATE POLICY "Users can view subscriptions for their organizations" ON public.user_subscriptions
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.organization_members 
      WHERE organization_id = user_subscriptions.organization_id 
        AND user_id = auth.uid()
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_organizations_updated_at 
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get user's organizations
CREATE OR REPLACE FUNCTION public.get_user_organizations(_user_id UUID DEFAULT auth.uid())
RETURNS TABLE(
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  logo_url TEXT,
  role TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    o.id,
    o.name,
    o.slug,
    o.description,
    o.logo_url,
    om.role,
    o.is_active,
    o.created_at
  FROM public.organizations o
  JOIN public.organization_members om ON o.id = om.organization_id
  WHERE om.user_id = _user_id AND o.is_active = true
  ORDER BY om.role DESC, o.name;
$$;