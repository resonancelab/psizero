import { Gauge, Zap, Shield, Brain, Calculator, Lock } from "lucide-react";

export const siteConfig = {
  name: "SRT API",
  description: "Symbolic Resonance Transformer - Solve NP-Complete Problems",
  url: "https://srt-api.com",
  
  navigation: {
    main: [
      { name: "Home", href: "/" },
      { name: "Documentation", href: "/docs" },
      { name: "Dashboard", href: "/dashboard" },
    ],
  },

  hero: {
    announcement: {
      icon: Brain,
      text: "New: 3-SAT problem solving with polynomial-time solutions"
    },
    title: "Symbolic Resonance",
    subtitle: "Transformer API", 
    description: "Breakthrough computational approach to solving NP-complete problems. Our patented SRT algorithm provides polynomial-time solutions for 3-SAT and other complex optimization challenges.",
    cta: {
      primary: { text: "Start Solving", href: "/signup" },
      secondary: { text: "View Documentation", href: "/docs" }
    },
    stats: [
      { icon: Calculator, title: "3-SAT Solutions", description: "Polynomial-time NP-complete solving" },
      { icon: Zap, title: "Patent-Pending", description: "Proprietary SRT algorithm technology" },
      { icon: Lock, title: "Enterprise Ready", description: "Secure API with rate limiting" }
    ]
  },

  features: {
    title: "Revolutionary Problem Solving",
    description: "Our SRT algorithm leverages symbolic entropy spaces and resonance operators to solve previously intractable computational problems."
  },

  pricing: {
    title: "Flexible Pricing for Every Need",
    description: "From individual developers to enterprise solutions, choose the plan that fits your computational requirements.",
    footer: "All plans include API key authentication, rate limiting, and comprehensive error handling."
  },

  api: {
    baseUrl: "https://api.srt-solver.com",
    version: "v1"
  }
};