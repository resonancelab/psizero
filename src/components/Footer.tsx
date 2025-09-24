import { Link } from "react-router-dom";
import { 
  Atom, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin, 
  MapPin, 
  Phone,
  ExternalLink,
  Brain,
  Sparkles,
  Globe,
  Eye,
  Hexagon,
  Gauge,
  Building,
  MessageSquare,
  Network,
  Zap,
  Bot
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/siteConfig";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const apiLinks = [
    { name: "SRS", path: "/apis/srs", icon: Brain, description: "Symbolic Resonance Solver" },
    { name: "HQE", path: "/apis/hqe", icon: Atom, description: "Holographic Quantum Encoder" },
    { name: "QSEM", path: "/apis/qsem", icon: Sparkles, description: "Quantum Semantics" },
    { name: "QLLM", path: "/apis/qllm", icon: MessageSquare, description: "Quantum Language Model" },
    { name: "NLC", path: "/apis/nlc", icon: Globe, description: "Non-Local Communication" },
    { name: "QCR", path: "/apis/qcr", icon: Eye, description: "Quantum Consciousness" }
  ];

  const resourceLinks = [
    { name: "Documentation", path: "/docs" },
    { name: "API Reference", path: "/apis" },
    { name: "Tutorials", path: "/tutorials" },
    { name: "Examples", path: "/examples" },
    { name: "Blog", path: "/blog" },
    { name: "Changelog", path: "/changelog" }
  ];

  const platformLinks = [
    { name: "Playground", path: "/playground" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Demos", path: "/demos" },
    { name: "Patents", path: "/patents" },
    { name: "Getting Started", path: "/getting-started" },
    { name: "SDK Downloads", path: "/sdks" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" },
    { name: "Security", path: "/security" },
    { name: "Contact", path: "/contact" },
    { name: "Help", path: "/help" }
  ];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/psizero" },
    { name: "GitHub", icon: Github, href: "https://github.com/psizero" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/psizero" }
  ];

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Atom className="h-8 w-8 text-api-secondary" />
              <span className="font-bold text-xl text-foreground">{siteConfig.name}</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              {siteConfig.description}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@psizero.com" className="hover:text-api-secondary transition-colors">
                  contact@psizero.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-api-secondary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* API Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">API Services</h3>
            <ul className="space-y-3">
              {apiLinks.map((api) => (
                <li key={api.name}>
                  <Link
                    to={api.path}
                    className="text-sm text-muted-foreground hover:text-api-secondary transition-colors flex items-center space-x-2"
                  >
                    <api.icon className="h-3 w-3" />
                    <span>{api.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-api-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-3 mb-6">
              {platformLinks.slice(0, 3).map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-api-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              {legalLinks.slice(0, 3).map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-api-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-api-secondary transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-api-secondary transition-colors">
              Terms
            </Link>
            <Link to="/security" className="hover:text-api-secondary transition-colors">
              Security
            </Link>
            <a 
              href="https://status.psizero.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-api-secondary transition-colors flex items-center space-x-1"
            >
              <span>Status</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Powered by Notice */}
        <div className="mt-8 pt-8 border-t border-muted/20">
          <div className="text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center space-x-2">
              <Brain className="h-3 w-3" />
              <span>Powered by Ψ0=1 Formalism & Entropy Particle Physics</span>
              <Sparkles className="h-3 w-3" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;