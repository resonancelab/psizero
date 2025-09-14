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
    name: "Freemium",
    price: "$0",
    period: "per month",
    description: "Try our SRT algorithm with limited requests",
    features: [
      "10 3-SAT solutions/month",
      "Basic problem complexity",
      "Email support",
      "Standard rate limits (10/min)",
      "Community access",
    ],
    cta: "Start Free",
    popular: false,
    tier: "free"
  },
  {
    id: "pro",
    name: "Basic",
    price: "$10",
    period: "per month",
    description: "Perfect for individual developers and small projects",
    features: [
      "100 3-SAT solutions/month",
      "Complex problem support",
      "Email support",
      "10 requests per minute",
      "Usage analytics dashboard",
      "API documentation access",
    ],
    cta: "Choose Basic",
    popular: true,
    tier: "pro"
  },
  {
    id: "enterprise", 
    name: "Premium",
    price: "$50",
    period: "per month",
    description: "For businesses and high-volume applications",
    features: [
      "1,000 3-SAT solutions/month",
      "Priority processing queue",
      "Priority email support",
      "Higher rate limits (50/min)",
      "Advanced usage analytics",
      "Custom problem types (future)",
      "SLA guarantee",
    ],
    cta: "Choose Premium",
    popular: false,
    tier: "enterprise"
  },
];