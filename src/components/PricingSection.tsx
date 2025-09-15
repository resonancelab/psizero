import { siteConfig } from "@/config/siteConfig";
import PricingCard from "@/components/ui/pricing-card";
import Section from "@/components/layout/Section";
import { pricingPlans } from "@/data/pricing";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const PricingSection = () => {
  const handleSelectPlan = (planId: string) => {
    window.location.href = '/signup';
  };

  return (
    <Section background="muted">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          {siteConfig.pricing.title}
        </h2>
        <p className="text-xl text-muted-foreground">
          {siteConfig.pricing.description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {pricingPlans.map((plan) => (
          <PricingCard 
            key={plan.id} 
            plan={plan}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>
      
      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          {siteConfig.pricing.footer}{" "}
          <a href="/plans" className="text-api-secondary hover:underline">
            Compare all features →
          </a>
        </p>
      </div>
    </Section>
  );
};

export default PricingSection;