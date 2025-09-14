import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: December 13, 2024
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  By accessing and using APIFlow's services, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. API Usage and Limitations</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  You agree to use the API services in accordance with the usage limits and guidelines specified in your subscription plan. 
                  Excessive usage beyond your plan limits may result in service throttling or additional charges.
                </p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Rate limits apply to all API endpoints</li>
                  <li>Monthly request quotas are enforced</li>
                  <li>Abuse or misuse may result in account suspension</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Data Privacy and Security</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  We are committed to protecting your data and privacy. All API communications are encrypted, and we follow industry-standard security practices. 
                  We do not store or access your application data unless explicitly required for service operation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Service Availability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  While we strive for 99.9% uptime, APIFlow services are provided "as is" without warranty of any kind. 
                  We may perform scheduled maintenance with advance notice when possible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Billing and Payments</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Subscription fees are billed in advance on a monthly or annual basis. Usage charges are calculated at the end of each billing period. 
                  All fees are non-refundable except as required by law.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Termination</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Either party may terminate this agreement at any time. Upon termination, your access to the API will be immediately revoked, 
                  and any outstanding fees become immediately due and payable.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  If you have any questions about these Terms of Service, please contact us at legal@apiflow.com or through our support channel.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Terms;