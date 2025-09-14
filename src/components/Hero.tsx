import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import Section from "@/components/layout/Section";

interface HeroStatProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const HeroStat = ({ icon: IconComponent, title, description }: HeroStatProps) => {
  return (
    <div className="text-center">
      <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 backdrop-blur">
        <IconComponent className="h-8 w-8 text-white" />
      </div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-blue-100 text-sm">{description}</p>
    </div>
  );
};

const Hero = () => {
  const { hero } = siteConfig;
  const AnnouncementIcon = hero.announcement.icon;

  return (
    <Section background="gradient" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
            <AnnouncementIcon className="mr-2 h-4 w-4" />
            {hero.announcement.text}
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          {hero.title}
          <br />
          <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            {hero.subtitle}
          </span>
        </h1>
        
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          {hero.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="bg-white text-api-primary hover:bg-gray-100 px-8 py-3">
            {hero.cta.primary.text}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white text-white hover:bg-white/10 px-8 py-3"
          >
            {hero.cta.secondary.text}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {hero.stats.map((stat, index) => (
            <HeroStat key={index} {...stat} />
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </Section>
  );
};

export default Hero;