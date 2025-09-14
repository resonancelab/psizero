import { LucideIcon } from "lucide-react";
import { Brain, Calculator, Shield, Zap, BarChart3, Layers, Code, Lock } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  category?: string;
}

export const features: Feature[] = [
  {
    icon: Brain,
    title: "SRT Algorithm",
    description: "Patent-pending Symbolic Resonance Transformer algorithm for solving NP-complete problems in polynomial time.",
    category: "algorithm"
  },
  {
    icon: Calculator,
    title: "3-SAT Solver",
    description: "Efficiently solve 3-SAT problems by encoding into symbolic entropy spaces with resonance operators.",
    category: "solver"
  },
  {
    icon: Layers,
    title: "Symbolic Encoding",
    description: "Advanced symbolic entropy spaces that transform complex problems into solvable representations.",
    category: "encoding"
  },
  {
    icon: Zap,
    title: "Polynomial Time",
    description: "Breakthrough performance achieving polynomial-time solutions for traditionally exponential problems.",
    category: "performance"
  },
  {
    icon: Shield,
    title: "API Security",
    description: "Secure API key authentication with bcrypt hashing and HTTPS encryption for all requests.",
    category: "security"
  },
  {
    icon: BarChart3,
    title: "Usage Tracking",
    description: "Comprehensive quota management and usage analytics with subscription-based rate limiting.",
    category: "analytics"
  },
  {
    icon: Code,
    title: "RESTful Interface",
    description: "Modern FastAPI-based REST endpoints with automatic Swagger documentation and JSON schema validation.",
    category: "development"
  },
  {
    icon: Lock,
    title: "Rate Limiting",
    description: "Redis-powered rate limiting with tiered access based on subscription plans for fair usage.",
    category: "security"
  },
];