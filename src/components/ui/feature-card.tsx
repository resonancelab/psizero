import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Feature } from "@/data/features";

interface FeatureCardProps {
  feature: Feature;
  className?: string;
}

const FeatureCard = ({ feature, className }: FeatureCardProps) => {
  const IconComponent = feature.icon;

  return (
    <Card className={`border-border hover:shadow-elegant transition-all duration-300 group ${className}`}>
      <CardHeader>
        <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">
          {feature.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;