import { useState, useEffect } from "react";
import psiZeroApi from "@/lib/api";
import { useToast } from "./use-toast";
import { useAuth } from "./useAuth";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  role: 'owner' | 'admin' | 'member';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  updated_at?: string;
  user?: {
    id: string;
    email?: string;
    full_name?: string;
  };
}

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  slug?: string;
  description?: string;
  logo_url?: string;
}

export interface InviteMemberRequest {
  email: string;
  role: 'admin' | 'member';
}

export interface UpdateMemberRoleRequest {
  role: 'owner' | 'admin' | 'member';
}

export interface OrganizationsListResponse {
  organizations: Organization[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      
      const response = await psiZeroApi.client.get<OrganizationsListResponse>('/organizations');
      
      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to fetch organizations');
      }
      
      const typedOrganizations = response.data.organizations;
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
      setOrganizations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createOrganization = async (name: string, slug: string, description?: string, logoUrl?: string) => {
    try {
      const request: CreateOrganizationRequest = {
        name,
        slug,
        description,
        logo_url: logoUrl
      };

      const response = await psiZeroApi.client.post<Organization>('/organizations', request);

      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to create organization');
      }

      toast({
        title: "Success",
        description: "Organization created successfully",
      });

      await fetchOrganizations(); // Refresh data
      return { success: true, data: response.data as Organization };
    } catch (error: Error | unknown) {
      console.error('Error creating organization:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create organization",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateOrganization = async (id: string, updates: UpdateOrganizationRequest) => {
    try {
      const response = await psiZeroApi.client.put<Organization>(`/organizations/${id}`, updates);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Success",
        description: "Organization updated successfully",
      });

      await fetchOrganizations(); // Refresh data
      return { success: true, data: response.data };
    } catch (error: Error | unknown) {
      console.error('Error updating organization:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update organization",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteOrganization = async (id: string) => {
    try {
      const response = await psiZeroApi.client.delete(`/organizations/${id}`);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Success",
        description: "Organization deleted successfully",
      });

      await fetchOrganizations(); // Refresh data
      return { success: true };
    } catch (error: Error | unknown) {
      console.error('Error deleting organization:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete organization",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const fetchMembers = async (organizationId: string) => {
    try {
      const response = await psiZeroApi.client.get<OrganizationMember[]>(`/organizations/${organizationId}/members`);
      
      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to fetch members');
      }
      
      return { success: true, data: response.data as OrganizationMember[] };
    } catch (error: Error | unknown) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch members",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const inviteMember = async (organizationId: string, email: string, role: 'admin' | 'member') => {
    try {
      const request: InviteMemberRequest = { email, role };
      const response = await psiZeroApi.client.post<OrganizationMember>(
        `/organizations/${organizationId}/members/invite`,
        request
      );

      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to invite member');
      }

      toast({
        title: "Success",
        description: `Invitation sent to ${email}`,
      });

      return { success: true, data: response.data as OrganizationMember };
    } catch (error: Error | unknown) {
      console.error('Error inviting member:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to invite member",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const addMember = async (organizationId: string, email: string, role: 'admin' | 'member') => {
    // Alias for inviteMember for backward compatibility
    return inviteMember(organizationId, email, role);
  };

  const updateMemberRole = async (organizationId: string, userId: string, role: 'owner' | 'admin' | 'member') => {
    try {
      const request: UpdateMemberRoleRequest = { role };
      const response = await psiZeroApi.client.put<OrganizationMember>(
        `/organizations/${organizationId}/members/${userId}`,
        request
      );

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Success",
        description: "Member role updated successfully",
      });

      return { success: true, data: response.data };
    } catch (error: Error | unknown) {
      console.error('Error updating member role:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update member role",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const removeMember = async (organizationId: string, userId: string) => {
    try {
      const response = await psiZeroApi.client.delete(`/organizations/${organizationId}/members/${userId}`);

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Success",
        description: "Member removed successfully",
      });

      return { success: true };
    } catch (error: Error | unknown) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove member",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const switchOrganization = async (organizationId: string) => {
    try {
      const response = await psiZeroApi.client.post(`/organizations/${organizationId}/switch`);

      if (response.error) {
        throw new Error(response.error);
      }

      // Find and set the new current organization
      const newOrg = organizations.find(org => org.id === organizationId);
      if (newOrg) {
        setCurrentOrganization(newOrg);
      }

      toast({
        title: "Success",
        description: "Organization switched successfully",
      });

      return { success: true };
    } catch (error: Error | unknown) {
      console.error('Error switching organization:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to switch organization",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const getOrganizationStats = async (organizationId: string) => {
    try {
      const response = await psiZeroApi.client.get(`/organizations/${organizationId}/stats`);
      
      if (response.error || !response.data) {
        throw new Error(response.error || 'Failed to fetch organization stats');
      }
      
      return { success: true, data: response.data };
    } catch (error: Error | unknown) {
      console.error('Error fetching organization stats:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrganizations();
    } else {
      // Clear organizations when user logs out
      setOrganizations([]);
      setCurrentOrganization(null);
      setIsLoading(false);
    }
  }, [user]);

  return {
    // State
    organizations,
    currentOrganization,
    isLoading,
    
    // Organization management
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    switchOrganization,
    setCurrentOrganization,
    
    // Member management
    fetchMembers,
    addMember,
    inviteMember,
    updateMemberRole,
    removeMember,
    
    // Analytics
    getOrganizationStats,
  };
};