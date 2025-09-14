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
    <div className="space-y-8">
      {/* Endpoint List */}
      <div className="grid gap-4">
        {endpoints.map((endpoint) => (
          <EndpointCard
            key={endpoint.id}
            endpoint={endpoint}
            isActive={activeEndpoint === endpoint.id}
            onClick={() => setActiveEndpoint(endpoint.id)}
          />
        ))}
      </div>

      {/* Endpoint Details */}
      {currentEndpoint && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className={getMethodColor(currentEndpoint.method)}>
                  {currentEndpoint.method}
                </Badge>
                <CardTitle>{currentEndpoint.title}</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleConfigureEndpoint(currentEndpoint)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
                <Button 
                  onClick={() => testEndpoint(currentEndpoint)}
                  variant="gradient"
                  disabled={isLoading}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isLoading ? "Testing..." : "Test Endpoint"}
                </Button>
              </div>
            </div>
            <CardDescription>{currentEndpoint.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="parameters" className="w-full">
              <TabsList>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="example">Code Example</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
              </TabsList>
              
              <TabsContent value="parameters" className="space-y-4">
                <div className="space-y-3">
                  {currentEndpoint.parameters.map((param, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {param.name}
                        </code>
                        <Badge variant="outline" className="text-xs">
                          {param.type}
                        </Badge>
                        {param.required && (
                          <Badge variant="destructive" className="text-xs">
                            required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{param.description}</p>
                      {param.example && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Example: <code className="bg-muted px-1 rounded">{JSON.stringify(param.example)}</code>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="example" className="space-y-4">
                <div className="space-y-4">
                  <CodeBlock 
                    code={generateCurlExample(currentEndpoint)}
                    language="bash"
                    title="cURL"
                  />
                  
                  <CodeBlock 
                    code={generateJavaScriptExample(currentEndpoint)}
                    language="javascript"
                    title="JavaScript"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="response" className="space-y-4">
                {response ? (
                  <CodeBlock 
                    code={response}
                    language="json"
                    title="Response"
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Click "Test Endpoint" to see the response
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
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