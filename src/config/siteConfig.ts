import { Gauge, Zap, Shield, Brain, Calculator, Lock, Atom, Waves, Sparkles, Cpu } from "lucide-react";

export const siteConfig = {
  name: "NP-Complete Solver",
  description: "Advanced computational platform providing polynomial-time solutions to NP-complete problems and efficient factorization of large integers",
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
      text: "BREAKTHROUGH: Revolutionary computational platform solving NP-complete problems in polynomial time"
    },
    title: "NP-Complete Solver",
    subtitle: "Polynomial-Time Solutions",
    description: "Join the breakthrough revolution. Access the world's first solver that solves NP-complete problems in polynomial time, and factors very large numbers in no time.",
    cta: {
      primary: { text: "Try the Solver", href: "/demos/impossible-optimizer" },
      secondary: { text: "Factor Large Numbers", href: "/docs" }
    },
    stats: [
      { icon: Cpu, title: "NP-Complete Solver", description: "Polynomial-time algorithm implementation" },
      { icon: Brain, title: "NP → P", description: "Computational complexity breakthrough" },
      { icon: Waves, title: "Advanced Mathematics", description: "Novel algorithmic framework" }
    ]
  },

  features: {
    title: "Advanced Computational Platform",
    description: "Our breakthrough algorithmic framework revolutionizes computation by providing polynomial-time solutions to NP-complete problems, enabling previously intractable optimizations across multiple domains."
  },

  pricing: {
    title: "Access Advanced Computational Solutions",
    description: "From researchers to enterprises, harness polynomial-time NP-complete problem solving through our breakthrough algorithmic platform.",
    footer: "All plans powered by advanced computational algorithms with enterprise-grade authentication and security."
  },

  api: {
    baseUrl: "https://api.psizero.com",
    version: "v1"
  }
};