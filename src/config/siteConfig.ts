import { Gauge, Zap, Shield, Brain, Calculator, Lock, Atom, Waves, Sparkles } from "lucide-react";

export const siteConfig = {
  name: "Nomyx Resonance Platform",
  description: "Advanced Resonance-Based API Suite - SRS, HQE, QSEM, NLC, QCR & Unified Physics",
  url: "https://api.nomyx.dev",
  
  navigation: {
    main: [
      { name: "Home", href: "/" },
      { name: "APIs", href: "/apis" },
      { name: "Documentation", href: "/docs" },
      { name: "Tutorials", href: "/tutorials" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Playground", href: "/playground" },
    ],
  },

  hero: {
    announcement: {
      icon: Atom,
      text: "New: Complete resonance-based API suite with quantum semantics and consciousness interfaces"
    },
    title: "Nomyx Resonance",
    subtitle: "Platform",
    description: "Cutting-edge resonance technologies for symbolic solving, quantum encoding, semantic resonance, non-local communication, consciousness simulation, and unified physics modeling.",
    cta: {
      primary: { text: "Explore APIs", href: "/apis" },
      secondary: { text: "View Documentation", href: "/docs" }
    },
    stats: [
      { icon: Brain, title: "7 API Categories", description: "SRS, HQE, QSEM, NLC, QCR, I-Ching, Unified" },
      { icon: Waves, title: "Resonance-Based", description: "Advanced symbolic and quantum technologies" },
      { icon: Sparkles, title: "Enterprise Ready", description: "OAuth2, webhooks, session management" }
    ]
  },

  features: {
    title: "Advanced Resonance Technologies",
    description: "Our comprehensive API suite leverages cutting-edge resonance physics, quantum semantics, and consciousness modeling to solve complex computational and conceptual challenges."
  },

  pricing: {
    title: "Flexible Pricing for Every Scale",
    description: "From individual researchers to enterprise applications, choose the plan that fits your resonance computing requirements.",
    footer: "All plans include API key authentication, OAuth2 enterprise options, webhooks, and comprehensive telemetry."
  },

  api: {
    baseUrl: "https://api.nomyx.dev",
    version: "v1"
  }
};