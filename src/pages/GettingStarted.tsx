import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Key, Code, Zap, Book } from "lucide-react";

const GettingStarted = () => {
  const steps = [
    {
      id: 1,
      title: "Get Your API Key",
      description: "Generate your first API key to start making requests",
      icon: Key,
      completed: false,
      action: "Generate Key"
    },
    {
      id: 2,
      title: "Make Your First API Call",
      description: "Test your integration with a simple API request",
      icon: Code,
      completed: false,
      action: "Try Now"
    },
    {
      id: 3,
      title: "Explore Features",
      description: "Discover advanced features and capabilities",
      icon: Zap,
      completed: false,
      action: "Learn More"
    },
    {
      id: 4,
      title: "Read Documentation",
      description: "Deep dive into our comprehensive API documentation",
      icon: Book,
      completed: false,
      action: "View Docs"
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Getting Started with APIFlow
            </h1>
            <p className="text-muted-foreground">
              Follow these steps to get up and running with our API platform
            </p>
          </div>

          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Your Progress
                  <Badge variant="secondary">
                    {completedSteps}/{steps.length} Complete
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Complete these steps to get the most out of APIFlow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progressPercentage} className="h-2" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.id} className={step.completed ? "border-api-success/50" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {step.completed ? (
                            <CheckCircle className="h-6 w-6 text-api-success" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="h-5 w-5 text-api-secondary" />
                            <CardTitle className="text-lg">
                              Step {step.id}: {step.title}
                            </CardTitle>
                          </div>
                          <CardDescription className="text-base">
                            {step.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Button 
                        variant={step.completed ? "outline" : "default"}
                        size="sm"
                      >
                        {step.completed ? "Done" : step.action}
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
                <p className="text-muted-foreground mb-4">
                  Our support team is here to help you succeed
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline">
                    View Documentation
                  </Button>
                  <Button>
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default GettingStarted;