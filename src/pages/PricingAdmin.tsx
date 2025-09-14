import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePricingPlans, PricingPlan } from "@/hooks/usePricingPlans";
import PricingCardAdmin from "@/components/ui/pricing-card-admin";
import CreatePlanDialog from "@/components/CreatePlanDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { toast } from "sonner";

const PricingAdmin = () => {
  const { plans, isLoading, createPlan, updatePlan, deletePlan } = usePricingPlans();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<string | null>(null);

  const handleCreatePlan = async (planData: Omit<PricingPlan, 'id' | 'created_at' | 'updated_at' | 'features'> & { features: string[] }) => {
    if (editingPlan) {
      await updatePlan(editingPlan.id, planData);
    } else {
      await createPlan(planData);
    }
    setEditingPlan(null);
  };

  const handleEditPlan = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setShowCreateDialog(true);
  };

  const handleDeletePlan = async () => {
    if (!deletingPlan) return;
    
    try {
      await deletePlan(deletingPlan);
      toast.success("Plan deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete plan");
    } finally {
      setDeletingPlan(null);
    }
  };

  const handleOpenCreateDialog = () => {
    setEditingPlan(null);
    setShowCreateDialog(true);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Section padding="lg">
          <LoadingSkeleton />
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Pricing Plans Management
              </h1>
              <p className="text-muted-foreground">
                Create and manage subscription plans for your application
              </p>
            </div>
            <Button onClick={handleOpenCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Plan
            </Button>
          </div>

          {plans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No pricing plans found.</p>
              <Button onClick={handleOpenCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Plan
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PricingCardAdmin
                  key={plan.id}
                  plan={plan}
                  onEdit={handleEditPlan}
                  onDelete={setDeletingPlan}
                />
              ))}
            </div>
          )}

          <CreatePlanDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onCreatePlan={handleCreatePlan}
            editingPlan={editingPlan}
          />

          <ConfirmDialog
            open={!!deletingPlan}
            onOpenChange={(open) => !open && setDeletingPlan(null)}
            onConfirm={handleDeletePlan}
            title="Delete Pricing Plan"
            description="Are you sure you want to delete this pricing plan? This action cannot be undone."
          />
        </div>
      </Section>
    </PageLayout>
  );
};

export default PricingAdmin;