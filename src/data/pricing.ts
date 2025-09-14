export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  tier: 'free' | 'pro' | 'enterprise';
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started and small projects",
    features: [
      "1,000 API calls/month",
      "Basic analytics",
      "Email support",
      "Standard rate limits",
      "Community access",
    ],
    cta: "Start Free",
    popular: false,
    tier: "free"
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    period: "per month",
    description: "For growing applications and businesses",
    features: [
      "100,000 API calls/month",
      "Advanced analytics",
      "Priority support",
      "Higher rate limits",
      "Webhooks included",
      "Custom integrations",
    ],
    cta: "Start Pro Trial",
    popular: true,
    tier: "pro"
  },
  {
    id: "enterprise", 
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large-scale applications and organizations",
    features: [
      "Unlimited API calls",
      "Enterprise analytics",
      "24/7 dedicated support",
      "Custom rate limits",
      "SLA guarantee",
      "On-premise options",
      "Custom contracts",
    ],
    cta: "Contact Sales",
    popular: false,
    tier: "enterprise"
  },
];