import { Gauge, Zap, Shield, Brain, Calculator, Lock, Atom, Waves, Sparkles, Cpu } from "lucide-react";

export const siteConfig = {
  name: "Symbolic AI Engine",
  description: "Revolutionary Symbolic AI Engine solving P=NP through Ψ0=1 formalism - The world's first NP-complete problem solver",
  url: "https://psizero.com",
  
  navigation: {
    main: [
      { name: "Home", href: "/" },
      { name: "APIs", href: "/apis" },
      { name: "Documentation", href: "/docs" },
      { name: "Tutorials", href: "/tutorials" },
      { name: "Playground", href: "/playground" },
    ],
  },

  hero: {
    announcement: {
      icon: Brain,
      text: "BREAKTHROUGH: World's first Symbolic AI Engine solving P=NP through Ψ0=1 formalism"
    },
    title: "Symbolic AI Engine",
    subtitle: "P=NP Solved",
    description: "The world's first commercially available Symbolic AI Engine that solves NP-complete problems in polynomial time through revolutionary entropy particle physics and Ψ0=1 formalism. Transform impossible optimization challenges into tractable solutions.",
    cta: {
      primary: { text: "Try Symbolic AI", href: "/srs" },
      secondary: { text: "View Documentation", href: "/docs" }
    },
    stats: [
      { icon: Cpu, title: "Symbolic AI Engine", description: "World's first P=NP solver" },
      { icon: Brain, title: "NP → P", description: "Millennium problem solved" },
      { icon: Waves, title: "Entropy Particles", description: "Revolutionary physics engine" }
    ]
  },

  features: {
    title: "Symbolic AI Powered Platform",
    description: "Our breakthrough Symbolic AI Engine revolutionizes computation by solving the P=NP problem through entropy particle physics and Ψ0=1 formalism, enabling impossible optimizations across multiple domains."
  },

  pricing: {
    title: "Access The Symbolic AI Revolution",
    description: "From researchers to enterprises, harness the world's first P=NP solving Symbolic AI Engine through our breakthrough API platform.",
    footer: "All plans powered by patented Symbolic AI Engine with Ψ0=1 technology and enterprise authentication."
  },

  api: {
    baseUrl: "https://api.psizero.com",
    version: "v1"
  }
};