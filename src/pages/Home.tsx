import PageLayout from "@/components/layout/PageLayout";
import Hero from "@/components/Hero";
import PricingSection from "@/components/PricingSection";
import FeaturesSection from "@/components/FeaturesSection";

const Home = () => {
  return (
    <PageLayout>
      <Hero />
      <FeaturesSection />
      <PricingSection />
    </PageLayout>
  );
};

export default Home;