import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import LoadingSkeleton from "@/components/LoadingSkeleton";

interface ChangePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
  onPlanChange: (planId: string) => void;
}

const ChangePlanDialog = ({ open, onOpenChange, currentPlan, onPlanChange }: ChangePlanDialogProps) => {
  const { plans, isLoading } = usePricingPlans();
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan);

  const handleConfirm = () => {
    onPlanChange(selectedPlan);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change Your Plan</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-colors ${
                  selectedPlan === plan.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {plan.is_popular && (
                      <Badge variant="default">Recommended</Badge>
                    )}
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold">
                      {plan.price_cents === 0 ? "Free" : `$${(plan.price_cents / 100).toFixed(0)}`}
                    </span>
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-3">
                    {plan.description}
                  </CardDescription>
                  <ul className="space-y-1 text-sm">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-muted-foreground text-xs">
                        +{plan.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedPlan === currentPlan}
          >
            {selectedPlan === currentPlan ? 'Current Plan' : 'Change Plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePlanDialog;