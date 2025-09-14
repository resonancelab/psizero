import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Copy, Share, Save, RotateCcw } from "lucide-react";
import CodeBlock from "@/components/ui/code-block";
import { useState } from "react";

const Playground = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("users");
  const [method, setMethod] = useState("GET");
  const [response, setResponse] = useState("");

  const endpoints = [
    { id: "users", name: "Users", path: "/v1/users", methods: ["GET", "POST"] },
    { id: "posts", name: "Posts", path: "/v1/posts", methods: ["GET", "POST", "PUT", "DELETE"] },
    { id: "analytics", name: "Analytics", path: "/v1/analytics", methods: ["GET"] },
    { id: "webhooks", name: "Webhooks", path: "/v1/webhooks", methods: ["GET", "POST", "DELETE"] }
  ];

  const sampleResponse = `{
  "data": [
    {
      "id": "usr_1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-12-13T10:30:00Z",
      "status": "active"
    },
    {
      "id": "usr_0987654321", 
      "name": "Jane Smith",
      "email": "jane@example.com",
      "created_at": "2024-12-12T15:45:00Z",
      "status": "active"
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "limit": 10,
    "hasNext": true
  }
}`;

  const handleSendRequest = () => {
    setResponse(sampleResponse);
  };

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              API Playground
            </h1>
            <p className="text-muted-foreground">
              Interactive API testing environment with live examples and real-time responses
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Request Builder */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Request Builder
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Method and Endpoint */}
                  <div className="flex gap-3">
                    <Select value={method} onValueChange={setMethod}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      value={`https://api.apiflow.com${endpoints.find(e => e.id === selectedEndpoint)?.path || ''}`}
                      className="flex-1"
                      readOnly
                    />
                  </div>

                  {/* Quick Endpoints */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Quick Select</Label>
                    <div className="flex flex-wrap gap-2">
                      {endpoints.map((endpoint) => (
                        <Button
                          key={endpoint.id}
                          variant={selectedEndpoint === endpoint.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedEndpoint(endpoint.id)}
                        >
                          {endpoint.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Headers */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Headers</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input placeholder="Authorization" value="Authorization" readOnly className="flex-1" />
                        <Input placeholder="Bearer your-api-key" className="flex-1" />
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Content-Type" value="Content-Type" readOnly className="flex-1" />
                        <Input placeholder="application/json" value="application/json" readOnly className="flex-1" />
                      </div>
                    </div>
                  </div>

                  {/* Query Parameters */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Query Parameters</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input placeholder="limit" className="flex-1" />
                        <Input placeholder="10" className="flex-1" />
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="page" className="flex-1" />
                        <Input placeholder="1" className="flex-1" />
                      </div>
                    </div>
                  </div>

                  {/* Request Body */}
                  {method !== "GET" && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Request Body</Label>
                      <Textarea
                        placeholder="Enter JSON request body..."
                        className="min-h-32 font-mono"
                        defaultValue={`{
  "name": "John Doe",
  "email": "john@example.com"
}`}
                      />
                    </div>
                  )}

                  {/* Send Button */}
                  <Button onClick={handleSendRequest} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Send Request
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Response Viewer */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Response
                    {response && (
                      <div className="flex gap-2">
                        <Badge className="bg-green-500/10 text-green-600">200 OK</Badge>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {response ? (
                    <Tabs defaultValue="response" className="space-y-4">
                      <TabsList>
                        <TabsTrigger value="response">Response</TabsTrigger>
                        <TabsTrigger value="headers">Headers</TabsTrigger>
                        <TabsTrigger value="code">Code Example</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="response">
                        <div className="bg-muted rounded-lg p-4">
                          <CodeBlock language="json" code={response} />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="headers">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span>200 OK</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Content-Type:</span>
                            <span>application/json</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Response-Time:</span>
                            <span>142ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Server:</span>
                            <span>APIFlow/1.0</span>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="code">
                        <CodeBlock
                          language="javascript"
                          code={`fetch('https://api.apiflow.com/v1/users', {
  headers: {
    'Authorization': 'Bearer your-api-key',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
                        />
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Send a request to see the response here</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Example Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Example Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Get all users", method: "GET", path: "/v1/users" },
                      { name: "Create new user", method: "POST", path: "/v1/users" },
                      { name: "Get user analytics", method: "GET", path: "/v1/analytics" },
                      { name: "List webhooks", method: "GET", path: "/v1/webhooks" }
                    ].map((example, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="font-mono text-xs">
                            {example.method}
                          </Badge>
                          <span className="text-sm">{example.name}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Try
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Playground;