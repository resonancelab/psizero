import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, ChevronDown, ChevronUp, Play, Settings } from "lucide-react";
import { ApiEndpoint } from "@/data/apiEndpoints";
import CodeBlock from "@/components/ui/code-block";

interface EndpointCardProps {
  endpoint: ApiEndpoint;
  isActive?: boolean;
  onClick?: () => void;
  onTest?: (endpoint: ApiEndpoint) => void;
  onConfigure?: (endpoint: ApiEndpoint) => void;
  isTestLoading?: boolean;
  testResponse?: string;
  className?: string;
}

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET": return "bg-api-success/10 text-api-success";
    case "POST": return "bg-api-secondary/10 text-api-secondary";
    case "PUT": return "bg-api-warning/10 text-api-warning";
    case "DELETE": return "bg-destructive/10 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
};

const EndpointCard = ({ 
  endpoint, 
  isActive, 
  onClick, 
  onTest, 
  onConfigure, 
  isTestLoading, 
  testResponse,
  className 
}: EndpointCardProps) => {
  const generateCurlExample = (endpoint: ApiEndpoint) => {
    return `curl -X ${endpoint.method} "${window.location.origin}/api-proxy${endpoint.path}" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;
  };

  const generateJavaScriptExample = (endpoint: ApiEndpoint) => {
    return `const response = await fetch('${window.location.origin}/api-proxy${endpoint.path}', {
  method: '${endpoint.method}',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();`;
  };

  return (
    <Card 
      className={`border-border hover:shadow-elegant transition-all duration-300 ${
        isActive ? "ring-2 ring-api-secondary shadow-glow" : ""
      } ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={getMethodColor(endpoint.method)}>
              {endpoint.method}
            </Badge>
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {endpoint.path}
            </code>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClick}
            className="shrink-0"
          >
            {isActive ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div 
          className="cursor-pointer"
          onClick={onClick}
        >
          <CardTitle className="text-lg hover:text-api-secondary transition-colors">
            {endpoint.title}
          </CardTitle>
          <CardDescription>{endpoint.description}</CardDescription>
        </div>
      </CardHeader>

      {/* Expanded Content */}
      {isActive && (
        <CardContent className="space-y-6 border-t bg-muted/20">
          <div className="flex justify-end gap-2 pt-4">
            {onConfigure && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfigure(endpoint);
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            )}
            {onTest && (
              <Button 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onTest(endpoint);
                }}
                variant="gradient"
                disabled={isTestLoading}
              >
                <Play className="h-4 w-4 mr-2" />
                {isTestLoading ? "Testing..." : "Test"}
              </Button>
            )}
          </div>

          <Tabs defaultValue="parameters" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="parameters" className="flex-1">Parameters</TabsTrigger>
              <TabsTrigger value="example" className="flex-1">Code</TabsTrigger>
              <TabsTrigger value="response" className="flex-1">Response</TabsTrigger>
            </TabsList>
            
            <TabsContent value="parameters" className="space-y-4 mt-4">
              <div className="space-y-3">
                {endpoint.parameters.map((param, index) => (
                  <div key={index} className="border border-border rounded-lg p-3 bg-background">
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
                {endpoint.parameters.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No parameters required for this endpoint.
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="example" className="space-y-4 mt-4">
              <div className="space-y-4">
                <CodeBlock 
                  code={generateCurlExample(endpoint)}
                  language="bash"
                  title="cURL"
                />
                
                <CodeBlock 
                  code={generateJavaScriptExample(endpoint)}
                  language="javascript"
                  title="JavaScript"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="response" className="space-y-4 mt-4">
              {testResponse ? (
                <CodeBlock 
                  code={testResponse}
                  language="json"
                  title="Response"
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground bg-background rounded-lg border">
                  Click "Test" to see the response
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

export default EndpointCard;