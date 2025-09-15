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
    id: "developer",
    name: "Developer",
    price: "$0",
    period: "per month",
    description: "Explore resonance technologies with essential API access",
    features: [
      "Access to all 7 API categories",
      "Limited monthly requests per API",
      "Community support",
      "Basic documentation",
      "Standard rate limits",
      "API key authentication",
      "Basic telemetry data",
    ],
    apiAccess: ["SRS", "HQE", "QSEM", "NLC", "QCR", "I-Ching", "Unified"],
    requestLimits: {
      srs: 50,
      hqe: 25,
      qsem: 100,
      nlc: 10,
      qcr: 20,
      iching: 50,
      unified: 25
    },
    rateLimit: "10 requests/minute",
    cta: "Start Free",
    popular: false,
    tier: "free"
  },
  {
    id: "professional",
    name: "Professional",
    price: "$49",
    period: "per month",
    description: "For researchers and professional developers building resonance applications",
    features: [
      "Full access to all APIs",
      "Increased request quotas",
      "Priority email support",
      "Advanced documentation",
      "Session management for NLC/QCR",
      "Webhook notifications",
      "Enhanced telemetry & analytics",
      "99.5% uptime SLA",
    ],
    apiAccess: ["SRS", "HQE", "QSEM", "NLC", "QCR", "I-Ching", "Unified", "Webhooks"],
    requestLimits: {
      srs: 1000,
      hqe: 500,
      qsem: 2000,
      nlc: 200,
      qcr: 300,
      iching: 1000,
      unified: 500
    },
    rateLimit: "50 requests/minute",
    cta: "Choose Professional",
    popular: true,
    tier: "pro"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$199",
    period: "per month",
    description: "For organizations requiring high-volume access and enterprise features",
    features: [
      "Unlimited API access",
      "OAuth2 authentication",
      "Dedicated support channel",
      "Custom session configurations",
      "Advanced webhook management",
      "Real-time monitoring dashboard",
      "Custom integrations support",
      "99.9% uptime SLA",
      "Priority processing queues",
    ],
    apiAccess: ["All APIs", "OAuth2", "Enterprise Webhooks", "Custom Sessions"],
    requestLimits: {
      srs: 10000,
      hqe: 5000,
      qsem: 20000,
      nlc: 2000,
      qcr: 3000,
      iching: 10000,
      unified: 5000
    },
    rateLimit: "200 requests/minute",
    cta: "Choose Enterprise",
    popular: false,
    tier: "enterprise"
  },
  {
    id: "research",
    name: "Research & Academic",
    price: "$99",
    period: "per month",
    description: "Special pricing for academic institutions and research organizations",
    features: [
      "Academic institution verification required",
      "Extended research quotas",
      "Academic support channels",
      "Research collaboration tools",
      "Data export capabilities",
      "Extended session durations",
      "Research-focused documentation",
      "Flexible usage patterns",
    ],
    apiAccess: ["All APIs", "Extended Sessions", "Data Export"],
    requestLimits: {
      srs: 5000,
      hqe: 2500,
      qsem: 10000,
      nlc: 1000,
      qcr: 1500,
      iching: 5000,
      unified: 2500
    },
    rateLimit: "100 requests/minute",
    cta: "Apply for Academic",
    popular: false,
    tier: "pro"
  },
  {
    id: "custom",
    name: "Custom Solutions",
    price: "Contact Us",
    period: "tailored pricing",
    description: "Bespoke resonance computing solutions for unique requirements",
    features: [
      "Custom API development",
      "Dedicated infrastructure",
      "White-label solutions",
      "Custom resonance algorithms",
      "Private cloud deployment",
      "24/7 dedicated support",
      "Custom SLA agreements",
      "Integration consulting",
      "Training and onboarding",
    ],
    apiAccess: ["Custom APIs", "Private Infrastructure", "Dedicated Support"],
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