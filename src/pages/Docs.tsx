import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import ApiReference from "@/components/ApiReference";
import ApiProxyDocumentation from "@/components/ApiProxyDocumentation";

const Docs = () => {
  return (
    <PageLayout>
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">API Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Complete reference for our powerful API endpoints with interactive testing.
            </p>
          </div>
          <ApiReference />
        </div>
      </Section>
      
      <div className="border-t pt-16">
        <Section>
          <ApiProxyDocumentation />
        </Section>
      </div>
    </PageLayout>
  );
};

export default Docs;