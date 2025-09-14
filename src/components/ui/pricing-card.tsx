import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { PricingPlan } from "@/data/pricing";

interface PricingCardProps {
  plan: PricingPlan;
  onSelectPlan?: (planId: string) => void;
  className?: string;
}

const PricingCard = ({ plan, onSelectPlan, className }: PricingCardProps) => {
  return (
    <Card 
      className={`relative border-border hover:shadow-hover transition-all duration-300 ${
        plan.popular ? "ring-2 ring-api-secondary shadow-glow" : ""
      } ${className}`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-accent text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
            <Star className="h-4 w-4 mr-1" />
            Most Popular
          </div>
        </div>
      )}
      
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold text-foreground">{plan.price}</span>
          <span className="text-muted-foreground">/{plan.period}</span>
        </div>
        <CardDescription className="mt-2 text-base">
          {plan.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-5 w-5 text-api-success mr-3 flex-shrink-0" />
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          variant={plan.popular ? "gradient" : "outline"}
          size="lg"
          className="w-full"
          onClick={() => onSelectPlan?.(plan.id)}
        >
          {plan.cta}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;