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
      
      // Fetch endpoints with their parameters
      const { data: endpointsData, error: endpointsError } = await supabase
        .from('api_endpoints')
        .select(`
          id,
          method,
          path,
          title,
          description,
          category,
          tags,
          sample_response,
          created_at,
          updated_at,
          is_active,
          target_url,
          target_method,
          requires_auth,
          auth_type,
          auth_header_name,
          timeout_ms,
          rate_limit_per_minute,
          cost_per_request,
          api_parameters (
            id,
            name,
            type,
            required,
            description,
            example
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (endpointsError) throw endpointsError;

      // Transform the data to match our interface
      const formattedEndpoints: ApiEndpoint[] = (endpointsData || []).map(endpoint => ({
        id: endpoint.id,
        method: endpoint.method as ApiEndpoint['method'],
        path: endpoint.path,
        title: endpoint.title,
        description: endpoint.description,
        category: endpoint.category,
        tags: endpoint.tags || [],
        sampleResponse: endpoint.sample_response,
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
        parameters: (endpoint.api_parameters || []).map((param: any) => ({
          id: param.id,
          name: param.name,
          type: param.type,
          required: param.required,
          description: param.description,
          example: param.example
        }))
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

  const createEndpoint = async (endpoint: Omit<ApiEndpoint, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: endpointData, error: endpointError } = await supabase
        .from('api_endpoints')
        .insert({
          method: endpoint.method,
          path: endpoint.path,
          title: endpoint.title,
          description: endpoint.description,
          category: endpoint.category,
          tags: endpoint.tags,
          sample_response: endpoint.sampleResponse,
        })
        .select()
        .single();

      if (endpointError) throw endpointError;

      // Insert parameters if any
      if (endpoint.parameters && endpoint.parameters.length > 0) {
        const parametersToInsert = endpoint.parameters.map(param => ({
          endpoint_id: endpointData.id,
          name: param.name,
          type: param.type,
          required: param.required,
          description: param.description,
          example: param.example,
        }));

        const { error: parametersError } = await supabase
          .from('api_parameters')
          .insert(parametersToInsert);

        if (parametersError) throw parametersError;
      }

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
      const { error: endpointError } = await supabase
        .from('api_endpoints')
        .update({
          method: updates.method,
          path: updates.path,
          title: updates.title,
          description: updates.description,
          category: updates.category,
          tags: updates.tags,
          sample_response: updates.sampleResponse,
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