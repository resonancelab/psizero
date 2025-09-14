import { Gauge, Zap, Shield } from "lucide-react";

export const siteConfig = {
  name: "APIFlow",
  description: "The API Platform Developers Love",
  url: "https://apiflow.com",
  
  navigation: {
    main: [
      { name: "Home", href: "/" },
      { name: "Documentation", href: "/docs" },
      { name: "Dashboard", href: "/dashboard" },
    ],
  },

  hero: {
    announcement: {
      icon: Zap,
      text: "New: Enhanced API performance and reliability"
    },
    title: "The API Platform",
    subtitle: "Developers Love", 
    description: "Power your applications with our lightning-fast, secure, and scalable API. From prototype to production, we've got you covered with flexible pricing and world-class developer experience.",
    cta: {
      primary: { text: "Start Building Free", href: "/signup" },
      secondary: { text: "View Documentation", href: "/docs" }
    },
    stats: [
      { icon: Gauge, title: "99.9% Uptime", description: "Enterprise-grade reliability" },
      { icon: Zap, title: "Sub-100ms Response", description: "Lightning-fast performance" },
      { icon: Shield, title: "Bank-Level Security", description: "Your data is always safe" }
    ]
  },

  features: {
    title: "Everything You Need to Build",
    description: "Our API platform provides all the tools and features you need to create amazing applications with confidence."
  },

  pricing: {
    title: "Simple, Transparent Pricing",
    description: "Choose the plan that fits your needs. Scale up or down anytime.",
    footer: "All plans include SSL, CORS support, and 99.9% uptime SLA."
  },

  api: {
    baseUrl: "https://api.apiflow.com",
    version: "v1"
  }
};