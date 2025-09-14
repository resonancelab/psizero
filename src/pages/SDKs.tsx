import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Download, Github, Star, Users } from "lucide-react";
import CodeBlock from "@/components/ui/code-block";

const SDKs = () => {
  const sdks = [
    {
      name: "JavaScript/Node.js",
      description: "Official JavaScript SDK with TypeScript support for browser and Node.js environments",
      version: "v2.1.4",
      downloads: "156k",
      stars: 892,
      status: "Official",
      languages: ["JavaScript", "TypeScript"],
      platforms: ["Browser", "Node.js", "React", "Vue", "Angular"],
      installation: "npm install @apiflow/sdk",
      example: `import { APIFlow } from '@apiflow/sdk';

const client = new APIFlow('your-api-key');

// Get users
const users = await client.users.list();

// Create a new user
const newUser = await client.users.create({
  name: 'John Doe',
  email: 'john@example.com'
});`
    },
    {
      name: "Python", 
      description: "Comprehensive Python SDK with async support and built-in retry mechanisms",
      version: "v1.8.2",
      downloads: "89k",
      stars: 654,
      status: "Official",
      languages: ["Python"],
      platforms: ["Python 3.7+", "Django", "Flask", "FastAPI"],
      installation: "pip install apiflow",
      example: `from apiflow import APIFlow

client = APIFlow(api_key='your-api-key')

# Get users
users = client.users.list()

# Create a new user
new_user = client.users.create(
    name='John Doe',
    email='john@example.com'
)`
    },
    {
      name: "PHP",
      description: "Modern PHP SDK with composer support and PSR-4 compliance",
      version: "v1.5.1", 
      downloads: "32k",
      stars: 234,
      status: "Official",
      languages: ["PHP"],
      platforms: ["PHP 7.4+", "Laravel", "Symfony", "WordPress"],
      installation: "composer require apiflow/php-sdk",
      example: `<?php
use APIFlow\\Client;

$client = new Client('your-api-key');

// Get users
$users = $client->users()->list();

// Create a new user
$newUser = $client->users()->create([
    'name' => 'John Doe',
    'email' => 'john@example.com'
]);`
    },
    {
      name: "Go",
      description: "High-performance Go SDK with context support and automatic retries",
      version: "v1.3.0",
      downloads: "18k", 
      stars: 187,
      status: "Official",
      languages: ["Go"],
      platforms: ["Go 1.18+"],
      installation: "go get github.com/apiflow/go-sdk",
      example: `package main

import (
    "context"
    "github.com/apiflow/go-sdk"
)

func main() {
    client := apiflow.New("your-api-key")
    
    // Get users
    users, err := client.Users.List(context.Background())
    
    // Create a new user
    user := &apiflow.User{
        Name:  "John Doe",
        Email: "john@example.com",
    }
    newUser, err := client.Users.Create(context.Background(), user)
}`
    },
    {
      name: "Ruby",
      description: "Elegant Ruby SDK following Rails conventions with built-in caching",
      version: "v1.2.3",
      downloads: "12k",
      stars: 143,
      status: "Official",
      languages: ["Ruby"],
      platforms: ["Ruby 2.7+", "Rails", "Sinatra"],
      installation: "gem install apiflow",
      example: `require 'apiflow'

client = APIFlow::Client.new(api_key: 'your-api-key')

# Get users
users = client.users.list

# Create a new user
new_user = client.users.create(
  name: 'John Doe',
  email: 'john@example.com'
)`
    },
    {
      name: "Java",
      description: "Enterprise-ready Java SDK with Spring Boot integration and reactive support",
      version: "v1.1.0",
      downloads: "8k",
      stars: 89,
      status: "Official",
      languages: ["Java", "Kotlin"],
      platforms: ["Java 11+", "Spring Boot", "Android"],
      installation: "implementation 'com.apiflow:java-sdk:1.1.0'",
      example: `import com.apiflow.APIFlowClient;
import com.apiflow.models.User;

APIFlowClient client = new APIFlowClient("your-api-key");

// Get users
List<User> users = client.users().list();

// Create a new user
User newUser = client.users().create(
    User.builder()
        .name("John Doe")
        .email("john@example.com")
        .build()
);`
    }
  ];

  const communitySDKs = [
    {
      name: "C# (.NET)",
      author: "Community",
      description: "Unofficial .NET SDK with async/await support",
      version: "v0.8.1",
      stars: 67,
      status: "Community"
    },
    {
      name: "Rust", 
      author: "Community",
      description: "Fast and memory-safe Rust implementation",
      version: "v0.5.2",
      stars: 45,
      status: "Community"
    },
    {
      name: "Swift",
      author: "Community", 
      description: "Native iOS/macOS SDK with Combine support",
      version: "v0.3.1",
      stars: 32,
      status: "Community"
    }
  ];

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              SDKs & Libraries
            </h1>
            <p className="text-muted-foreground">
              Official client libraries and community packages to integrate APIFlow in your favorite language
            </p>
          </div>

          {/* Official SDKs */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Official SDKs</h2>
            <div className="grid gap-6">
              {sdks.map((sdk, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{sdk.name}</CardTitle>
                          <Badge className="bg-primary/10 text-primary">
                            {sdk.status}
                          </Badge>
                          <Badge variant="secondary">
                            {sdk.version}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {sdk.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {sdk.downloads} downloads
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {sdk.stars} stars
                          </div>
                          <div className="flex gap-1">
                            {sdk.platforms.slice(0, 3).map((platform, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                            {sdk.platforms.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{sdk.platforms.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Github className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Installation */}
                    <div>
                      <h4 className="font-medium mb-2">Installation</h4>
                      <div className="bg-muted rounded-lg p-3">
                        <code className="text-sm">{sdk.installation}</code>
                      </div>
                    </div>

                    {/* Code Example */}
                    <div>
                      <h4 className="font-medium mb-2">Quick Start</h4>
                      <CodeBlock
                        language={sdk.languages[0].toLowerCase()}
                        code={sdk.example}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button size="sm">
                        Get Started
                      </Button>
                      <Button variant="outline" size="sm">
                        View Documentation
                      </Button>
                      <Button variant="outline" size="sm">
                        Examples
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Community SDKs */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Community Libraries</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {communitySDKs.map((sdk, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{sdk.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          by {sdk.author}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {sdk.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {sdk.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{sdk.version}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {sdk.stars}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Github className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contribution Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contributing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Don't see your favorite language? We welcome community contributions! 
                Check out our SDK development guidelines and contribute to the ecosystem.
              </p>
              <div className="flex gap-3">
                <Button variant="outline">
                  SDK Guidelines
                </Button>
                <Button variant="outline">
                  Request a Language
                </Button>
                <Button>
                  Contribute on GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default SDKs;