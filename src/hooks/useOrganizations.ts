import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  role: 'owner' | 'admin' | 'member';
  is_active: boolean;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  user?: {
    email?: string;
  };
}

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('get_user_organizations');
      
      if (error) throw error;
      
      // Type-cast the role to ensure it matches our union type
      const typedOrganizations: Organization[] = (data || []).map(org => ({
        ...org,
        role: org.role as 'owner' | 'admin' | 'member'
      }));
      
      setOrganizations(typedOrganizations);
      
      // Set current organization to first one if none selected
      if (typedOrganizations.length > 0 && !currentOrganization) {
        setCurrentOrganization(typedOrganizations[0]);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createOrganization = async (name: string, slug: string, description?: string) => {
    try {
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name,
          slug,
          description,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Add current user as owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          role: 'owner',
        });

      if (memberError) throw memberError;

      toast({
        title: "Success",
        description: "Organization created successfully",
      });

      fetchOrganizations(); // Refresh data
      return { success: true, data: org };
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create organization",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateOrganization = async (id: string, updates: Partial<Pick<Organization, 'name' | 'slug' | 'description' | 'logo_url'>>) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Organization updated successfully",
      });

      fetchOrganizations(); // Refresh data
      return { success: true };
    } catch (error: any) {
      console.error('Error updating organization:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update organization",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const addMember = async (organizationId: string, email: string, role: 'admin' | 'member') => {
    try {
      // This would need a function to invite users by email
      // For now, just show a toast
      toast({
        title: "Feature Coming Soon",
        description: "Member invitation will be available soon",
      });
      return { success: false, error: "Not implemented" };
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add member",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateMemberRole = async (organizationId: string, userId: string, role: 'owner' | 'admin' | 'member') => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ role })
        .eq('organization_id', organizationId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member role updated successfully",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error updating member role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update member role",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const removeMember = async (organizationId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('organization_id', organizationId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member removed successfully",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove member",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return {
    organizations,
    currentOrganization,
    setCurrentOrganization,
    isLoading,
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    addMember,
    updateMemberRole,
    removeMember,
  };
};