import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface ApiParameter {
  id: string;
  name: string;
  type: 'string' | 'integer' | 'boolean' | 'array' | 'object';
  required: boolean;
  description: string;
  example?: any;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  parameters: ApiParameter[];
  category: string;
  tags: string[];
  sampleResponse?: any;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  // Proxy configuration fields
  target_url?: string;
  target_method?: string;
  requires_auth?: boolean;
  auth_type?: string;
  auth_header_name?: string;
  timeout_ms?: number;
  rate_limit_per_minute?: number;
  cost_per_request?: number;
}

export const useApiEndpoints = () => {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEndpoints = async () => {
    try {
      setIsLoading(true);
      
      // Only select fields that actually exist in the database
      const { data: endpointsData, error: endpointsError } = await supabase
        .from('api_endpoints')
        .select(`
          id,
          method,
          path,
          target_url,
          target_method,
          requires_auth,
          auth_type,
          auth_header_name,
          timeout_ms,
          rate_limit_per_minute,
          cost_per_request,
          is_active,
          created_at,
          updated_at
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (endpointsError) throw endpointsError;

      // Transform the data to match our interface with defaults for missing fields
      const formattedEndpoints: ApiEndpoint[] = (endpointsData || []).map(endpoint => ({
        id: endpoint.id,
        method: endpoint.method as ApiEndpoint['method'],
        path: endpoint.path,
        title: endpoint.path, // Use path as title since title doesn't exist in DB
        description: `API endpoint for ${endpoint.path}`, // Default description
        category: "API", // Default category
        tags: [], // Default empty array
        sampleResponse: "Response varies by endpoint", // Default sample
        created_at: endpoint.created_at,
        updated_at: endpoint.updated_at,
        is_active: endpoint.is_active,
        target_url: endpoint.target_url,
        target_method: endpoint.target_method,
        requires_auth: endpoint.requires_auth,
        auth_type: endpoint.auth_type,
        auth_header_name: endpoint.auth_header_name,
        timeout_ms: endpoint.timeout_ms,
        rate_limit_per_minute: endpoint.rate_limit_per_minute,
        cost_per_request: endpoint.cost_per_request,
        parameters: [] // Default empty array since api_parameters table doesn't exist yet
      }));

      setEndpoints(formattedEndpoints);
    } catch (error) {
      console.error('Error fetching endpoints:', error);
      toast({
        title: "Error",
        description: "Failed to fetch API endpoints",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createEndpoint = async (endpointData: Omit<ApiEndpoint, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Only insert fields that exist in the database
      const { data: newEndpoint, error: insertError } = await supabase
        .from('api_endpoints')
        .insert({
          path: endpointData.path,
          method: endpointData.method,
          target_url: endpointData.target_url || endpointData.path,
          target_method: endpointData.target_method || endpointData.method,
          requires_auth: endpointData.requires_auth ?? true,
          auth_type: endpointData.auth_type || 'bearer',
          auth_header_name: endpointData.auth_header_name || 'Authorization',
          timeout_ms: endpointData.timeout_ms || 30000,
          rate_limit_per_minute: endpointData.rate_limit_per_minute || 60,
          cost_per_request: endpointData.cost_per_request || 1,
          is_active: true
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "API endpoint created successfully",
      });

      fetchEndpoints();
    } catch (error) {
      console.error('Error creating endpoint:', error);
      toast({
        title: "Error",
        description: "Failed to create API endpoint",
        variant: "destructive",
      });
    }
  };

  const updateEndpoint = async (id: string, updates: Partial<ApiEndpoint>) => {
    try {
      // Only update fields that exist in the database
      const { error: endpointError } = await supabase
        .from('api_endpoints')
        .update({
          ...(updates.path && { path: updates.path }),
          ...(updates.method && { method: updates.method }),
          ...(updates.target_url && { target_url: updates.target_url }),
          ...(updates.target_method && { target_method: updates.target_method }),
          ...(updates.requires_auth !== undefined && { requires_auth: updates.requires_auth }),
          ...(updates.auth_type && { auth_type: updates.auth_type }),
          ...(updates.auth_header_name && { auth_header_name: updates.auth_header_name }),
          ...(updates.timeout_ms && { timeout_ms: updates.timeout_ms }),
          ...(updates.rate_limit_per_minute && { rate_limit_per_minute: updates.rate_limit_per_minute }),
          ...(updates.cost_per_request && { cost_per_request: updates.cost_per_request }),
          ...(updates.is_active !== undefined && { is_active: updates.is_active })
        })
        .eq('id', id);

      if (endpointError) throw endpointError;

      toast({
        title: "Success",
        description: "API endpoint updated successfully",
      });

      fetchEndpoints();
    } catch (error) {
      console.error('Error updating endpoint:', error);
      toast({
        title: "Error",
        description: "Failed to update API endpoint",
        variant: "destructive",
      });
    }
  };

  const deleteEndpoint = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_endpoints')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "API endpoint deleted successfully",
      });

      fetchEndpoints();
    } catch (error) {
      console.error('Error deleting endpoint:', error);
      toast({
        title: "Error",
        description: "Failed to delete API endpoint",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  return {
    endpoints,
    isLoading,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    refetch: fetchEndpoints
  };
};