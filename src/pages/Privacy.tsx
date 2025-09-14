import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: December 13, 2024
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>We collect information you provide directly to us, such as:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Account registration information (name, email, company)</li>
                  <li>Billing and payment information</li>
                  <li>API usage data and analytics</li>
                  <li>Support communications</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send billing notifications</li>
                  <li>Respond to your comments and questions</li>
                  <li>Monitor and analyze usage trends</li>
                  <li>Detect and prevent fraud or abuse</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Data Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy. 
                  We may share your information with trusted service providers who assist us in operating our platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction. All data transmissions are encrypted using industry-standard protocols.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, 
                  unless a longer retention period is required by law.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Export your data in a portable format</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  If you have any questions about this Privacy Policy, please contact us at privacy@apiflow.com or through our support channel.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Privacy;