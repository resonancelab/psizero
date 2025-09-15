import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import AdvancedPlayground from "@/components/AdvancedPlayground";

const Playground = () => {
  return (
    <PageLayout>
      <Section background="default" className="py-8">
        <div className="max-w-7xl mx-auto">
          <AdvancedPlayground />
        </div>
      </Section>
    </PageLayout>
  );
};

export default Playground;