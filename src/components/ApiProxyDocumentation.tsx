import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "@/components/ui/code-block";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Zap, Shield, Activity } from "lucide-react";

const ApiProxyDocumentation = () => {
  const curlExample = `curl -X GET "${window.location.origin}/api-proxy/users" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ak_your_api_key"`;

  const jsExample = `fetch("${window.location.origin}/api-proxy/users", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "ak_your_api_key"
  }
})
.then(response => response.json())
.then(data => console.log(data));`;

  const responseExample = `{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">API Proxy Documentation</h1>
        <p className="text-xl text-muted-foreground">
          Secure, metered API access with built-in billing and rate limiting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-api-secondary" />
              High Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Lightning-fast API proxy with sub-100ms overhead and automatic request optimization.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-api-success" />
              Secure by Default
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Enterprise-grade security with API key authentication and rate limiting protection.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-api-warning" />
              Real-time Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Comprehensive usage analytics with billing integration and cost tracking.
            </p>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Our API proxy acts as a secure gateway between your applications and target APIs, 
          providing metering, billing, rate limiting, and comprehensive analytics.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>
            Get started with our API proxy in just a few steps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">1</Badge>
              <span>Create an API key in your dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">2</Badge>
              <span>Choose from our available endpoints</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">3</Badge>
              <span>Make requests to /api-proxy/[endpoint] with your API key</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">4</Badge>
              <span>Monitor usage and costs in real-time</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              All API requests require authentication using your API key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Include your API key in the <code className="bg-muted px-1 rounded">x-api-key</code> header:
            </p>
            <CodeBlock 
              code={curlExample}
              language="bash"
              title="cURL Example"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
            <CardDescription>
              Requests are rate limited based on your subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Free Plan</span>
                <Badge variant="outline">100 req/min</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pro Plan</span>
                <Badge variant="outline">1000 req/min</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Enterprise</span>
                <Badge variant="outline">Unlimited</Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Rate limits are enforced per API key and reset every minute.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>JavaScript Example</CardTitle>
          <CardDescription>
            Example implementation using the Fetch API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock 
            code={jsExample}
            language="javascript"
            title="JavaScript"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response Format</CardTitle>
          <CardDescription>
            All API responses follow a consistent format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock 
            code={responseExample}
            language="json"
            title="Example Response"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Handling</CardTitle>
          <CardDescription>
            Common error responses and their meanings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="destructive">401</Badge>
                <span className="ml-2 text-sm">Unauthorized</span>
              </div>
              <span className="text-xs text-muted-foreground">Invalid or missing API key</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="destructive">429</Badge>
                <span className="ml-2 text-sm">Rate Limited</span>
              </div>
              <span className="text-xs text-muted-foreground">Too many requests</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="destructive">404</Badge>
                <span className="ml-2 text-sm">Not Found</span>
              </div>
              <span className="text-xs text-muted-foreground">Endpoint not available</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="destructive">500</Badge>
                <span className="ml-2 text-sm">Server Error</span>
              </div>
              <span className="text-xs text-muted-foreground">Internal server error</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiProxyDocumentation;