import { Gauge, Zap, Shield, Brain, Calculator, Lock, Atom, Waves, Sparkles } from "lucide-react";

export const siteConfig = {
  name: "Ψ0 Platform",
  description: "Quantum Computing APIs based on Ψ0=1 formalism - Revolutionary breakthrough technologies",
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
      icon: Atom,
      text: "Revolutionary: Ψ0=1 formalism enables quantum computing on classical hardware"
    },
    title: "Ψ0=1",
    subtitle: "Quantum Computing Platform",
    description: "Founded on the breakthrough Ψ0=1 formalism, our platform delivers impossible computational capabilities including P=NP solutions, consciousness simulation, and quantum processing without quantum hardware.",
    cta: {
      primary: { text: "Explore APIs", href: "/apis" },
      secondary: { text: "View Documentation", href: "/docs" }
    },
    stats: [
      { icon: Atom, title: "Ψ0=1 Formalism", description: "Revolutionary quantum-classical bridge" },
      { icon: Brain, title: "P=NP Solution", description: "Millennium problem solved" },
      { icon: Waves, title: "14 Patents Filed", description: "Protected breakthrough innovations" }
    ]
  },

  features: {
    title: "Ψ0=1 Powered APIs",
    description: "Our revolutionary API suite is founded on the Ψ0=1 formalism, enabling quantum computation on classical hardware and solving previously impossible problems."
  },

  pricing: {
    title: "Access Revolutionary Computing",
    description: "From researchers to enterprises, experience the power of Ψ0=1 formalism through our breakthrough API platform.",
    footer: "All plans powered by patented Ψ0=1 technology with enterprise authentication and monitoring."
  },

  api: {
    baseUrl: "https://api.psizero.com",
    version: "v1"
  }
};