import { features } from "@/data/features";
import { siteConfig } from "@/config/siteConfig";
import FeatureCard from "@/components/ui/feature-card";
import Section from "@/components/layout/Section";

const FeaturesSection = () => {
  return (
    <Section background="default">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          {siteConfig.features.title}
        </h2>
        <p className="text-xl text-muted-foreground">
          {siteConfig.features.description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </div>
    </Section>
  );
};

export default FeaturesSection;