import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "@/components/ui/code-block";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Zap, Shield, Activity } from "lucide-react";

const ApiProxyDocumentation = () => {
  const curlExample = `curl -X POST "${window.location.origin}/solve/3sat" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ak_your_api_key" \\
  -d '{
    "clauses": [
      ["x1", "-x2", "x3"],
      ["-x1", "x2", "-x3"]
    ],
    "max_iterations": 1000,
    "epsilon": 1e-6
  }'`;

  const jsExample = `fetch("${window.location.origin}/solve/3sat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "ak_your_api_key"
  },
  body: JSON.stringify({
    clauses: [
      ["x1", "-x2", "x3"],
      ["-x1", "x2", "-x3"]
    ],
    max_iterations: 1000,
    epsilon: 1e-6
  })
})
.then(response => response.json())
.then(data => console.log(data));`;

  const responseExample = `{
  "x1": true,
  "x2": true, 
  "x3": false
}`;

  const quotaExample = `{
  "username": "user1",
  "subscription_plan": "basic",
  "requests_remaining": 95
}`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">SRT API Documentation</h1>
        <p className="text-xl text-muted-foreground">
          Revolutionary NP-complete problem solving with Symbolic Resonance Transformer algorithm
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-api-secondary" />
              Polynomial Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Breakthrough algorithm achieving polynomial-time solutions for traditionally exponential NP-complete problems.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-api-success" />
              Patent-Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Proprietary Symbolic Resonance Transformer technology with secure API key authentication.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-api-warning" />
              3-SAT Solver
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Advanced boolean satisfiability solver using symbolic entropy spaces and resonance operators.
            </p>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Our SRT API leverages symbolic entropy spaces, resonance operators, and collapse dynamics to solve 
          3-SAT and other NP-complete problems in polynomial time.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>
            Get started solving NP-complete problems in just a few steps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">1</Badge>
              <span>Sign up and create an API key</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">2</Badge>
              <span>Format your 3-SAT problem as clauses</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">3</Badge>
              <span>POST to /solve/3sat with your problem</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">4</Badge>
              <span>Receive polynomial-time solution</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Solving 3-SAT Problems</CardTitle>
            <CardDescription>
              POST your 3-SAT problem to get solutions using SRT algorithm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Include your API key in the <code className="bg-muted px-1 rounded">x-api-key</code> header and 
              format clauses as arrays of literals:
            </p>
            <CodeBlock 
              code={curlExample}
              language="bash"
              title="3-SAT cURL Example"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
            <CardDescription>
              Requests are limited based on your subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Freemium</span>
                <Badge variant="outline">10 req/month</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Basic Plan</span>
                <Badge variant="outline">100 req/month</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Premium Plan</span>
                <Badge variant="outline">1000 req/month</Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Rate limits reset monthly. All plans include 10 requests per minute limit.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>JavaScript Example</CardTitle>
          <CardDescription>
            Example implementation for solving 3-SAT problems
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
          <CardTitle>Solution Response</CardTitle>
          <CardDescription>
            Variable assignments for satisfiable problems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock 
            code={responseExample}
            language="json"
            title="3-SAT Solution"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Check Your Quota</CardTitle>
          <CardDescription>
            Monitor your subscription usage and remaining requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            GET /user/quota to check your remaining requests:
          </p>
          <CodeBlock 
            code={quotaExample}
            language="json"
            title="Quota Response"
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
                <Badge variant="destructive">403</Badge>
                <span className="ml-2 text-sm">Quota Exceeded</span>
              </div>
              <span className="text-xs text-muted-foreground">Upgrade your subscription</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="destructive">404</Badge>
                <span className="ml-2 text-sm">Unsatisfiable</span>
              </div>
              <span className="text-xs text-muted-foreground">Problem has no solution</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="destructive">429</Badge>
                <span className="ml-2 text-sm">Rate Limited</span>
              </div>
              <span className="text-xs text-muted-foreground">Too many requests per minute</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiProxyDocumentation;