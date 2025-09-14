import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingPlan } from "@/hooks/usePricingPlans";

interface PricingCardAdminProps {
  plan: PricingPlan;
  onEdit: (plan: PricingPlan) => void;
  onDelete: (planId: string) => void;
}

const PricingCardAdmin = ({ plan, onEdit, onDelete }: PricingCardAdminProps) => {
  const formatPrice = (priceCents: number) => {
    if (priceCents === 0) return "Free";
    return `$${(priceCents / 100).toFixed(0)}`;
  };

  return (
    <Card className={`relative ${plan.is_popular ? 'border-primary shadow-lg' : ''}`}>
      {plan.is_popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
          Most Popular
        </Badge>
      )}
      
      <CardHeader className="text-center">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
          <Badge variant={plan.is_active ? "default" : "secondary"}>
            {plan.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold text-foreground">
            {formatPrice(plan.price_cents)}
          </span>
          <span className="text-muted-foreground">{plan.period}</span>
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="space-y-2">
        <Button 
          onClick={() => onEdit(plan)}
          variant="outline" 
          className="w-full"
        >
          Edit Plan
        </Button>
        <Button 
          onClick={() => onDelete(plan.id)}
          variant="destructive" 
          size="sm" 
          className="w-full"
        >
          Delete Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCardAdmin;