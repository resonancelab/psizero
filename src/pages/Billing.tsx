import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import BillingSection from "@/components/BillingSection";

const Billing = () => {
  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Billing & Payments
            </h1>
            <p className="text-muted-foreground">
              Manage your subscription, payment methods, and billing history
            </p>
          </div>
          
          <BillingSection />
        </div>
      </Section>
    </PageLayout>
  );
};

export default Billing;