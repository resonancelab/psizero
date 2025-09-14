import { LucideIcon } from "lucide-react";
import { Code, Database, Shield, Zap, BarChart3, Webhook } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  category?: string;
}

export const features: Feature[] = [
  {
    icon: Code,
    title: "RESTful API",
    description: "Clean, intuitive endpoints with comprehensive documentation and interactive testing.",
    category: "development"
  },
  {
    icon: Database,
    title: "Real-time Data",
    description: "Access live data streams with WebSocket support and instant updates.",
    category: "data"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "OAuth 2.0, API keys, and rate limiting to keep your applications secure.",
    category: "security"
  },
  {
    icon: Zap,
    title: "High Performance",
    description: "Global CDN, intelligent caching, and optimized infrastructure for speed.",
    category: "performance"
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description: "Detailed metrics, performance insights, and usage tracking in real-time.",
    category: "analytics"
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Event-driven architecture with reliable webhook delivery and retries.",
    category: "integration"
  },
];