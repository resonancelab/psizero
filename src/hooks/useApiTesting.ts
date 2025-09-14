import { useState } from "react";
import { useToast } from "./use-toast";
import { ApiEndpoint } from "./useApiEndpoints";
import { supabase } from "@/integrations/supabase/client";

export const useApiTesting = () => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const testEndpoint = async (endpoint: ApiEndpoint, params?: Record<string, any>) => {
    setIsLoading(true);
    
    try {
      // For now, return sample response since we can't test with hashed keys
      // This is a security limitation - we don't store the actual API keys
      const sampleResponse = endpoint.sampleResponse || {
        status: 200,
        data: { message: "Test successful - using sample data", endpoint: endpoint.path }
      };
      
      setResponse(JSON.stringify(sampleResponse, null, 2));
      
      toast({
        title: "Sample Response",
        description: `Showing sample response for ${endpoint.method} ${endpoint.path}`,
      });
      
      return sampleResponse;
    } catch (error) {
      const errorResponse = {
        status: 500,
        error: "Test Error",
        message: error instanceof Error ? error.message : "Something went wrong"
      };
      
      setResponse(JSON.stringify(errorResponse, null, 2));
      
      toast({
        title: "API Test Failed", 
        description: error instanceof Error ? error.message : "Unable to test endpoint",
        variant: "destructive",
      });
      
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  };

  const clearResponse = () => {
    setResponse("");
  };

  return {
    response,
    isLoading,
    testEndpoint,
    clearResponse
  };
};