import { siteConfig } from "@/config/siteConfig";
import PricingCard from "@/components/ui/pricing-card";
import Section from "@/components/layout/Section";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const PricingSection = () => {
  const { plans, isLoading } = usePricingPlans();
  
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
      
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <PricingCard 
              key={plan.id} 
              plan={{
                id: plan.id,
                name: plan.name,
                price: plan.price_cents === 0 ? "$0" : `$${(plan.price_cents / 100).toFixed(0)}`,
                period: plan.period,
                description: plan.description,
                features: plan.features,
                cta: plan.cta_text,
                popular: plan.is_popular,
                tier: plan.tier as 'free' | 'pro' | 'enterprise' | 'custom',
                apiAccess: [],
                requestLimits: {
                  srs: 0,
                  hqe: 0,
                  qsem: 0,
                  nlc: 0,
                  qcr: 0,
                  iching: 0,
                  unified: 0
                },
                rateLimit: "API specific"
              }} 
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>
      )}
      
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