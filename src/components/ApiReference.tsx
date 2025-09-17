import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Play, Settings } from "lucide-react";
import { useState } from "react";
import { useApiEndpoints } from "@/hooks/useApiEndpoints";
import { siteConfig } from "@/config/siteConfig";
import { useApiTesting } from "@/hooks/useApiTesting";
import CodeBlock from "@/components/ui/code-block";
import EndpointCard from "@/components/ui/endpoint-card";
import EndpointConfigDialog from "@/components/EndpointConfigDialog";

const ApiReference = () => {
  const { endpoints, isLoading: endpointsLoading, refetch } = useApiEndpoints();
  const [activeEndpoint, setActiveEndpoint] = useState("");
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedEndpointForConfig, setSelectedEndpointForConfig] = useState(null);
  const { response, isLoading, testEndpoint } = useApiTesting();

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-api-success/10 text-api-success";
      case "POST": return "bg-api-secondary/10 text-api-secondary";
      case "PUT": return "bg-api-warning/10 text-api-warning";
      case "DELETE": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Set the first endpoint as active when endpoints load
  const currentEndpoint = endpoints.find(ep => ep.id === activeEndpoint) || endpoints[0];
  
  // Update active endpoint when endpoints load
  if (endpoints.length > 0 && !activeEndpoint) {
    setActiveEndpoint(endpoints[0].id);
  }

  const generateCurlExample = (endpoint: any) => {
    if (!endpoint) return '';
    
    return `curl -X ${endpoint.method} "${window.location.origin}/api-proxy${endpoint.path}" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;
  };

  const generateJavaScriptExample = (endpoint: any) => {
    if (!endpoint) return '';
    
    return `const response = await fetch('${window.location.origin}/api-proxy${endpoint.path}', {
  method: '${endpoint.method}',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();`;
  };

  const handleConfigureEndpoint = (endpoint: any) => {
    setSelectedEndpointForConfig(endpoint);
    setConfigDialogOpen(true);
  };

  const handleConfigSaved = () => {
    refetch();
  };

  if (endpointsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading API endpoints...</p>
        </div>
      </div>
    );
  }

  if (endpoints.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No API endpoints found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enhanced Endpoint Cards */}
      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <EndpointCard
            key={endpoint.id}
            endpoint={endpoint}
            isActive={activeEndpoint === endpoint.id}
            onClick={() => setActiveEndpoint(activeEndpoint === endpoint.id ? "" : endpoint.id)}
            onTest={testEndpoint}
            onConfigure={handleConfigureEndpoint}
            isTestLoading={isLoading}
            testResponse={activeEndpoint === endpoint.id ? response : undefined}
          />
        ))}
      </div>
      
      <EndpointConfigDialog
        endpoint={selectedEndpointForConfig}
        isOpen={configDialogOpen}
        onClose={() => {
          setConfigDialogOpen(false);
          setSelectedEndpointForConfig(null);
        }}
        onSave={handleConfigSaved}
      />
    </div>
  );
};

export default ApiReference;