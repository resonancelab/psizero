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
      description: "Official JavaScript SDK for all Nomyx Resonance APIs with TypeScript support and async/await",
      version: "v3.0.0",
      downloads: "45k",
      stars: 892,
      status: "Official",
      languages: ["JavaScript", "TypeScript"],
      platforms: ["Browser", "Node.js", "React", "Vue", "Angular"],
      installation: "npm install @nomyx/resonance-sdk",
      example: `import { NomyxResonance } from '@nomyx/resonance-sdk';

const client = new NomyxResonance('your-api-key');

// Solve 3-SAT problem with SRS
const solution = await client.srs.solve({
  problem: '3sat',
  spec: {
    variables: 3,
    clauses: [
      [{ var: 1, neg: false }, { var: 2, neg: true }, { var: 3, neg: false }]
    ]
  }
});

// Encode concepts with QSEM
const vectors = await client.qsem.encode({
  concepts: ['consciousness', 'resonance', 'quantum']
});

// Create NLC session
const session = await client.nlc.createSession({
  primes: [2, 3, 5, 7]
});`
    },
    {
      name: "Python",
      description: "Comprehensive Python SDK with async support for all resonance APIs and scientific computing integration",
      version: "v2.0.1",
      downloads: "32k",
      stars: 654,
      status: "Official",
      languages: ["Python"],
      platforms: ["Python 3.8+", "Jupyter", "NumPy", "SciPy"],
      installation: "pip install nomyx-resonance",
      example: `from nomyx_resonance import NomyxClient
import asyncio

client = NomyxClient(api_key='your-api-key')

# Solve subset sum problem
solution = await client.srs.solve({
    'problem': 'subsetsum',
    'spec': {
        'weights': [3, 7, 1, 14, 2],
        'target': 9
    }
})

# Run HQE simulation
simulation = await client.hqe.simulate({
    'primes': [2, 3, 5, 7, 11],
    'steps': 256,
    'lambda': 0.02
})

# I-Ching oracle consultation
oracle = await client.iching.evolve({
    'question': 'What path should I take?',
    'steps': 7
})`
    },
    {
      name: "PHP",
      description: "Modern PHP SDK for Nomyx Resonance APIs with PSR-4 compliance and Laravel integration",
      version: "v1.0.0",
      downloads: "8k",
      stars: 234,
      status: "Official",
      languages: ["PHP"],
      platforms: ["PHP 8.0+", "Laravel", "Symfony", "WordPress"],
      installation: "composer require nomyx/resonance-php",
      example: `<?php
use Nomyx\\Resonance\\Client;

$client = new Client('your-api-key');

// QCR consciousness session
$session = $client->qcr()->createSession([
    'modes' => ['analytical', 'creative', 'ethical']
]);

$observation = $client->qcr()->observe($session['id'], [
    'prompt' => 'What is the nature of reality?'
]);

// Unified physics computation
$gravity = $client->unified()->computeGravity([
    'observerEntropyReductionRate' => 12.4,
    'regionEntropyGradient' => 0.002
]);`
    },
    {
      name: "Go",
      description: "High-performance Go SDK with context support and concurrent processing for resonance APIs",
      version: "v1.0.0",
      downloads: "5k",
      stars: 187,
      status: "Official",
      languages: ["Go"],
      platforms: ["Go 1.19+"],
      installation: "go get github.com/nomyx/resonance-go",
      example: `package main

import (
    "context"
    "github.com/nomyx/resonance-go"
)

func main() {
    client := resonance.New("your-api-key")
    ctx := context.Background()
    
    // Solve Hamiltonian path problem
    solution, err := client.SRS.Solve(ctx, &resonance.SRSRequest{
        Problem: "hamiltonian_path",
        Spec: map[string]interface{}{
            "vertices": 5,
            "edges": [][]int{{0,1}, {1,2}, {2,3}, {3,4}},
        },
    })
    
    // QSEM concept resonance
    resonanceResult, err := client.QSEM.ComputeResonance(ctx, vectors)
}`
    },
    {
      name: "Ruby",
      description: "Elegant Ruby SDK for resonance APIs following Rails conventions with session management",
      version: "v1.0.2",
      downloads: "3k",
      stars: 143,
      status: "Official",
      languages: ["Ruby"],
      platforms: ["Ruby 3.0+", "Rails", "Sinatra"],
      installation: "gem install nomyx-resonance",
      example: `require 'nomyx/resonance'

client = Nomyx::Resonance::Client.new(api_key: 'your-api-key')

# Solve vertex cover problem
solution = client.srs.solve(
  problem: 'vertex_cover',
  spec: {
    vertices: 6,
    edges: [[0,1], [1,2], [2,3]],
    k: 3
  }
)

# NLC message transmission
session = client.nlc.create_session(primes: [2, 3, 5])
message = client.nlc.send_message(
  session.id,
  content: 'Hello through quantum channel'
)`
    },
    {
      name: "Java",
      description: "Enterprise-ready Java SDK with Spring Boot integration and reactive streams for resonance APIs",
      version: "v1.0.0",
      downloads: "2k",
      stars: 89,
      status: "Official",
      languages: ["Java", "Kotlin"],
      platforms: ["Java 11+", "Spring Boot", "Android"],
      installation: "implementation 'dev.nomyx:resonance-java:1.0.0'",
      example: `import dev.nomyx.resonance.NomyxResonanceClient;
import dev.nomyx.resonance.models.*;

NomyxResonanceClient client = new NomyxResonanceClient("your-api-key");

// SRS clique detection
SRSSolution solution = client.srs().solve(
    SRSRequest.builder()
        .problem("clique")
        .spec(Map.of(
            "vertices", 5,
            "edges", List.of(List.of(0,1), List.of(1,2)),
            "k", 3
        ))
        .build()
);

// HQE prime eigenstate simulation
HQEResponse simulation = client.hqe().simulate(
    HQERequest.builder()
        .primes(List.of(2, 3, 5, 7))
        .steps(128)
        .lambda(0.02)
        .build()
);`
    }
  ];

  const communitySDKs = [
    {
      name: "C# (.NET)",
      author: "Community",
      description: "Unofficial .NET SDK for Nomyx Resonance APIs with async/await support",
      version: "v0.3.0",
      stars: 67,
      status: "Community"
    },
    {
      name: "Rust",
      author: "Community",
      description: "High-performance Rust implementation for resonance computations",
      version: "v0.2.1",
      stars: 45,
      status: "Community"
    },
    {
      name: "Swift",
      author: "Community",
      description: "Native iOS/macOS SDK for mobile resonance applications",
      version: "v0.1.5",
      stars: 32,
      status: "Community"
    },
    {
      name: "R",
      author: "Community",
      description: "Statistical computing package for resonance data analysis",
      version: "v0.1.2",
      stars: 28,
      status: "Community"
    },
    {
      name: "MATLAB",
      author: "Community",
      description: "Scientific computing toolbox for quantum resonance modeling",
      version: "v0.1.0",
      stars: 15,
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
              Official client libraries and community packages to integrate Nomyx Resonance APIs in your favorite programming language.
              Access all 7 API categories: SRS, HQE, QSEM, NLC, QCR, I-Ching Oracle, and Unified Physics.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Getting Started Section */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started with Nomyx Resonance SDKs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Quick Start Steps</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li>1. Sign up for a free account and get your API key</li>
                      <li>2. Install the SDK for your preferred language</li>
                      <li>3. Initialize the client with your API key</li>
                      <li>4. Start with the SRS API for simple problem solving</li>
                      <li>5. Explore advanced APIs like QSEM and QCR</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">SDK Features</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Full TypeScript support with auto-completion</li>
                      <li>• Async/await patterns for all APIs</li>
                      <li>• Built-in error handling and retry logic</li>
                      <li>• Session management for stateful APIs</li>
                      <li>• Webhook integration support</li>
                      <li>• Comprehensive examples and documentation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contribution Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contributing to the Ecosystem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Don't see your favorite language? The Nomyx Resonance ecosystem thrives on community contributions!
                Whether you're building SDKs, creating examples, or developing plugins, we provide comprehensive guidelines
                and support for contributors working with our resonance APIs.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">
                  SDK Development Guide
                </Button>
                <Button variant="outline">
                  API Reference
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