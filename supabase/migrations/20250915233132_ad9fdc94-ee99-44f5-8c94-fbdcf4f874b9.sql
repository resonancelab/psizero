-- Fix infinite recursion in RLS policies by creating security definer functions

-- 1. Create security definer function to safely check user roles without recursion
CREATE OR REPLACE FUNCTION public.get_user_role_safe(_user_id uuid DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN is_sysadmin = true THEN 'sysadmin'
      ELSE 'user'
    END
  FROM public.profiles 
  WHERE id = _user_id;
$$;

-- 2. Create security definer function to check organization ownership safely
CREATE OR REPLACE FUNCTION public.check_organization_ownership(_org_id uuid, _user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = _org_id 
      AND user_id = _user_id 
      AND role = 'owner'
  );
$$;

-- 3. Create security definer function to check organization membership safely
CREATE OR REPLACE FUNCTION public.check_organization_membership(_org_id uuid, _user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE organization_id = _org_id 
      AND user_id = _user_id
  );
$$;

-- 4. Drop existing problematic policies that cause recursion
DROP POLICY IF EXISTS "Organization owners can manage members" ON public.organization_members;
DROP POLICY IF EXISTS "Sysadmins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Sysadmins can update all profiles" ON public.profiles;

-- 5. Create new safe policies using security definer functions
CREATE POLICY "Organization owners can manage members safely" 
ON public.organization_members 
FOR ALL 
USING (public.check_organization_ownership(organization_id, auth.uid()));

CREATE POLICY "Sysadmins can view all profiles safely" 
ON public.profiles 
FOR SELECT 
USING (public.get_user_role_safe(auth.uid()) = 'sysadmin');

CREATE POLICY "Sysadmins can update all profiles safely" 
ON public.profiles 
FOR UPDATE 
USING (public.get_user_role_safe(auth.uid()) = 'sysadmin');