export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  tier: 'free' | 'pro' | 'enterprise' | 'custom';
  apiAccess: string[];
  requestLimits: {
    srs: number;
    hqe: number;
    qsem: number;
    nlc: number;
    qcr: number;
    iching: number;
    unified: number;
  };
  rateLimit: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "hobbyist",
    name: "Hobbyist",
    price: "$19",
    period: "per month",
    description: "Perfect for personal projects and learning NP-complete problem solving",
    features: [
      "1,000 3-SAT requests/month",
      "500 Subset Sum requests/month", 
      "Basic API documentation",
      "Community support",
      "Standard rate limits",
      "API key authentication",
      "Basic usage analytics",
    ],
    apiAccess: ["3-SAT", "Subset Sum", "Basic SRT"],
    requestLimits: {
      srs: 1000,
      hqe: 500,
      qsem: 500,
      nlc: 500,
      qcr: 500,
      iching: 500,
      unified: 500
    },
    rateLimit: "10 requests/minute",
    cta: "Start Building",
    popular: false,
    tier: "free"
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79",
    period: "per month",
    description: "For developers and researchers building production applications",
    features: [
      "10,000 3-SAT requests/month",
      "5,000 Subset Sum requests/month",
      "All NP-complete problem types",
      "Priority email support",
      "Advanced documentation",
      "Webhook notifications",
      "Enhanced analytics",
      "99.5% uptime SLA",
    ],
    apiAccess: ["All Problem Types", "Webhooks", "Advanced Analytics"],
    requestLimits: {
      srs: 10000,
      hqe: 5000,
      qsem: 5000,
      nlc: 5000,
      qcr: 5000,
      iching: 5000,
      unified: 5000
    },
    rateLimit: "50 requests/minute",
    cta: "Go Professional",
    popular: true,
    tier: "pro"
  },
  {
    id: "business",
    name: "Business",
    price: "$249",
    period: "per month",
    description: "For teams and businesses requiring higher throughput and reliability",
    features: [
      "50,000 requests/month (all types)",
      "Custom problem configurations",
      "Dedicated support channel",
      "Advanced webhook management",
      "Real-time monitoring dashboard",
      "Team management tools",
      "99.9% uptime SLA",
      "Custom integrations support",
    ],
    apiAccess: ["All APIs", "Custom Configs", "Team Management", "Priority Queue"],
    requestLimits: {
      srs: 50000,
      hqe: 50000,
      qsem: 50000,
      nlc: 50000,
      qcr: 50000,
      iching: 50000,
      unified: 50000
    },
    rateLimit: "200 requests/minute",
    cta: "Scale Your Business",
    popular: false,
    tier: "enterprise"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "contact sales",
    description: "Enterprise-grade solutions with unlimited access and custom deployment",
    features: [
      "Unlimited API requests",
      "Custom algorithm tuning",
      "On-premise deployment options",
      "24/7 dedicated support",
      "Custom SLA agreements",
      "White-label solutions",
      "Advanced security features",
      "Integration consulting",
      "Training and onboarding",
    ],
    apiAccess: ["Unlimited Access", "Custom Deployment", "Dedicated Infrastructure"],
    requestLimits: {
      srs: -1,
      hqe: -1,
      qsem: -1,
      nlc: -1,
      qcr: -1,
      iching: -1,
      unified: -1
    },
    rateLimit: "Custom limits",
    cta: "Contact Sales",
    popular: false,
    tier: "custom"
  },
];