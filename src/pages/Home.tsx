import PageLayout from "@/components/layout/PageLayout";
import Hero from "@/components/Hero";
import PricingSection from "@/components/PricingSection";
import FeaturesSection from "@/components/FeaturesSection";
import ApiShowcaseSection from "@/components/ApiShowcaseSection";

const Home = () => {
  return (
    <PageLayout>
      <Hero />
      <ApiShowcaseSection />
      <FeaturesSection />
      <PricingSection />
    </PageLayout>
  );
};

export default Home;