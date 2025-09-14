import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import PricingSection from "@/components/PricingSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const Plans = () => {
  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Plan Management
            </h1>
            <p className="text-muted-foreground">
              Upgrade or downgrade your plan and monitor your usage
            </p>
          </div>

          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Current Usage
                  <Badge variant="secondary" className="bg-api-secondary/10 text-api-secondary">
                    Pro Plan
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Your API usage for the current billing period
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>API Calls</span>
                    <span>12,847 / 100,000</span>
                  </div>
                  <Progress value={12.847} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Storage Used</span>
                    <span>2.3 GB / 50 GB</span>
                  </div>
                  <Progress value={4.6} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Team Members</span>
                    <span>3 / 10</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <PricingSection />
        </div>
      </Section>
    </PageLayout>
  );
};

export default Plans;