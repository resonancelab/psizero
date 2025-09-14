import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { PricingPlan } from "@/hooks/usePricingPlans";
import { toast } from "sonner";

interface CreatePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePlan: (planData: Omit<PricingPlan, 'id' | 'created_at' | 'updated_at' | 'features'> & { features: string[] }) => Promise<void>;
  editingPlan?: PricingPlan | null;
}

const CreatePlanDialog = ({ open, onOpenChange, onCreatePlan, editingPlan }: CreatePlanDialogProps) => {
  const [formData, setFormData] = useState({
    name: editingPlan?.name || "",
    price_cents: editingPlan?.price_cents || 0,
    period: editingPlan?.period || "per month",
    description: editingPlan?.description || "",
    cta_text: editingPlan?.cta_text || "",
    is_popular: editingPlan?.is_popular || false,
    tier: editingPlan?.tier || "free",
    is_active: editingPlan?.is_active ?? true,
    display_order: editingPlan?.display_order || 0,
  });
  
  const [features, setFeatures] = useState<string[]>(editingPlan?.features || []);
  const [newFeature, setNewFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Plan name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreatePlan({
        ...formData,
        features
      });
      
      toast.success(editingPlan ? "Plan updated successfully!" : "Plan created successfully!");
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error("Failed to save plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price_cents: 0,
      period: "per month",
      description: "",
      cta_text: "",
      is_popular: false,
      tier: "free",
      is_active: true,
      display_order: 0,
    });
    setFeatures([]);
    setNewFeature("");
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen && !isSubmitting) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPlan ? "Edit Subscription Plan" : "Create New Subscription Plan"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Pro"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tier">Tier</Label>
              <Select value={formData.tier} onValueChange={(value) => setFormData({ ...formData, tier: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (cents)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price_cents}
                onChange={(e) => setFormData({ ...formData, price_cents: parseInt(e.target.value) || 0 })}
                placeholder="0 for free, 4900 for $49"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Input
                id="period"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="per month, per year, forever"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the plan"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cta">Call to Action Text</Label>
              <Input
                id="cta"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                placeholder="Start Free, Get Started, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                placeholder="1, 2, 3..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="popular"
                checked={formData.is_popular}
                onCheckedChange={(value) => setFormData({ ...formData, is_popular: value })}
              />
              <Label htmlFor="popular">Mark as Popular</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(value) => setFormData({ ...formData, is_active: value })}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex space-x-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeFeature(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleDialogChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlanDialog;