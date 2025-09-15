import React, { createContext, useContext, ReactNode } from 'react';
import { useOrganizations, Organization } from '@/hooks/useOrganizations';

interface OrganizationContextType {
  organizations: Organization[];
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization | null) => void;
  isLoading: boolean;
  fetchOrganizations: () => Promise<void>;
  createOrganization: (name: string, slug: string, description?: string) => Promise<{ success: boolean; data?: any; error?: any }>;
  updateOrganization: (id: string, updates: Partial<Pick<Organization, 'name' | 'slug' | 'description' | 'logo_url'>>) => Promise<{ success: boolean; error?: any }>;
  addMember: (organizationId: string, email: string, role: 'admin' | 'member') => Promise<{ success: boolean; error?: any }>;
  updateMemberRole: (organizationId: string, userId: string, role: 'owner' | 'admin' | 'member') => Promise<{ success: boolean; error?: any }>;
  removeMember: (organizationId: string, userId: string) => Promise<{ success: boolean; error?: any }>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganizationContext must be used within an OrganizationProvider');
  }
  return context;
};

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider = ({ children }: OrganizationProviderProps) => {
  const organizationHook = useOrganizations();

  return (
    <OrganizationContext.Provider value={organizationHook}>
      {children}
    </OrganizationContext.Provider>
  );
};