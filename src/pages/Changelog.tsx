import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Zap, Shield, Bug, Plus, ArrowUp } from "lucide-react";

const Changelog = () => {
  const releases = [
    {
      version: "v2.1.0",
      date: "December 12, 2024",
      type: "feature",
      changes: [
        {
          type: "new",
          icon: Plus,
          title: "Webhook Support",
          description: "Added comprehensive webhook support with custom headers and retry logic"
        },
        {
          type: "improvement", 
          icon: ArrowUp,
          title: "Enhanced Rate Limiting",
          description: "Improved rate limiting with per-endpoint controls and better error messages"
        },
        {
          type: "fix",
          icon: Bug,
          title: "Authentication Bug Fix",
          description: "Fixed issue with token refresh in high-traffic scenarios"
        }
      ]
    },
    {
      version: "v2.0.5",
      date: "December 5, 2024", 
      type: "patch",
      changes: [
        {
          type: "improvement",
          icon: Zap,
          title: "Performance Optimization",
          description: "Reduced average response time by 25% across all endpoints"
        },
        {
          type: "fix",
          icon: Bug,
          title: "CORS Configuration",
          description: "Fixed CORS issues affecting browser-based applications"
        }
      ]
    },
    {
      version: "v2.0.0",
      date: "November 28, 2024",
      type: "major",
      changes: [
        {
          type: "new",
          icon: Plus,
          title: "API v2 Release",
          description: "Complete API redesign with improved performance and new capabilities"
        },
        {
          type: "new",
          icon: Shield,
          title: "Enhanced Security",
          description: "Added OAuth 2.0 support and improved API key management"
        },
        {
          type: "improvement",
          icon: ArrowUp,
          title: "Better Documentation",
          description: "Comprehensive API documentation with interactive examples"
        }
      ]
    },
    {
      version: "v1.9.2",
      date: "November 15, 2024",
      type: "patch",
      changes: [
        {
          type: "fix",
          icon: Bug,
          title: "Database Connection Pool",
          description: "Fixed connection pool exhaustion under high load"
        },
        {
          type: "improvement",
          icon: Zap,
          title: "Caching Layer",
          description: "Improved caching mechanism for frequently accessed data"
        }
      ]
    }
  ];

  const getVersionBadge = (type: string) => {
    switch (type) {
      case "major":
        return <Badge className="bg-api-secondary/10 text-api-secondary">Major Release</Badge>;
      case "feature":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">Feature Release</Badge>;
      case "patch":
        return <Badge variant="outline">Patch</Badge>;
      default:
        return <Badge variant="secondary">Release</Badge>;
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "new":
        return <Plus className="h-4 w-4 text-api-success" />;
      case "improvement":
        return <ArrowUp className="h-4 w-4 text-blue-500" />;
      case "fix":
        return <Bug className="h-4 w-4 text-orange-500" />;
      default:
        return <Zap className="h-4 w-4 text-api-secondary" />;
    }
  };

  const getChangeTypeBadge = (type: string) => {
    switch (type) {
      case "new":
        return <Badge className="bg-api-success/10 text-api-success">New</Badge>;
      case "improvement":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">Improved</Badge>;
      case "fix":
        return <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">Fixed</Badge>;
      default:
        return <Badge variant="outline">Change</Badge>;
    }
  };

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Changelog
            </h1>
            <p className="text-muted-foreground">
              Stay up to date with the latest API updates, improvements, and new features
            </p>
          </div>

          <div className="space-y-8">
            {releases.map((release, index) => (
              <Card key={release.version}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{release.version}</CardTitle>
                      <p className="text-muted-foreground">{release.date}</p>
                    </div>
                    {getVersionBadge(release.type)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {release.changes.map((change, changeIndex) => (
                      <div key={changeIndex}>
                        <div className="flex items-start gap-3">
                          {getChangeIcon(change.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{change.title}</h4>
                              {getChangeTypeBadge(change.type)}
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {change.description}
                            </p>
                          </div>
                        </div>
                        {changeIndex < release.changes.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Want to stay updated?</h3>
                <p className="text-muted-foreground mb-4">
                  Subscribe to our newsletter to get notified about new releases and updates
                </p>
                <div className="flex max-w-md mx-auto gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 border border-border rounded-md"
                  />
                  <button className="px-4 py-2 bg-api-secondary text-white rounded-md hover:bg-api-secondary/90">
                    Subscribe
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Changelog;