import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Cookies = () => {
  const cookieTypes = [
    {
      name: "Essential Cookies",
      purpose: "Required for basic site functionality",
      duration: "Session",
      examples: ["Authentication tokens", "Session management", "Security preferences"],
      badge: "Required"
    },
    {
      name: "Analytics Cookies", 
      purpose: "Help us understand how visitors use our site",
      duration: "1-2 years",
      examples: ["Google Analytics", "Usage statistics", "Performance monitoring"],
      badge: "Optional"
    },
    {
      name: "Functional Cookies",
      purpose: "Enable enhanced functionality and personalization",
      duration: "1 year",
      examples: ["User preferences", "Language settings", "Dashboard layouts"],
      badge: "Optional"
    }
  ];

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Cookie Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: December 13, 2024
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>What Are Cookies?</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                  They are widely used to make websites work more efficiently and to provide information to website owners.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>We use cookies to:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Keep you signed in to your account</li>
                  <li>Remember your preferences and settings</li>
                  <li>Analyze site usage and performance</li>
                  <li>Provide personalized content and features</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Types of Cookies We Use</h2>
              {cookieTypes.map((cookie, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{cookie.name}</CardTitle>
                      <Badge variant={cookie.badge === "Required" ? "default" : "secondary"}>
                        {cookie.badge}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{cookie.purpose}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Duration</h4>
                        <p className="text-sm text-muted-foreground">{cookie.duration}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Examples</h4>
                        <ul className="text-sm text-muted-foreground">
                          {cookie.examples.map((example, idx) => (
                            <li key={idx}>• {example}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Managing Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  You can control and manage cookies in various ways. Most browsers allow you to refuse or accept cookies, 
                  delete cookies, or set preferences for certain websites.
                </p>
                <p className="mt-4">
                  Please note that if you choose to block essential cookies, some parts of our website may not function properly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  We may use third-party services like Google Analytics that set their own cookies. 
                  These services have their own privacy policies and cookie practices that are independent of ours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Updates to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  If you have any questions about our use of cookies, please contact us at privacy@apiflow.com.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Cookies;