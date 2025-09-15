import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  Atom, User, ChevronDown, Brain, Sparkles, Globe, Eye, Hexagon, Gauge
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/siteConfig";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const apiCategories = [
    { name: "SRS", path: "/apis/srs", icon: Brain, description: "Symbolic Resonance Solver" },
    { name: "HQE", path: "/apis/hqe", icon: Atom, description: "Holographic Quantum Encoder" },
    { name: "QSEM", path: "/apis/qsem", icon: Sparkles, description: "Quantum Semantics" },
    { name: "NLC", path: "/apis/nlc", icon: Globe, description: "Non-Local Communication" },
    { name: "QCR", path: "/apis/qcr", icon: Eye, description: "Quantum Consciousness Resonator" },
    { name: "I-Ching", path: "/apis/iching", icon: Hexagon, description: "Oracle Evolution" },
    { name: "Unified", path: "/apis/unified", icon: Gauge, description: "Physics Modeling" },
  ];
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Atom className="h-8 w-8 text-api-secondary" />
          <span className="font-bold text-xl text-foreground">{siteConfig.name}</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-api-secondary ${
              location.pathname === "/" ? "text-api-secondary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          
          {/* APIs Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`text-sm font-medium transition-colors hover:text-api-secondary flex items-center space-x-1 ${
                  location.pathname.startsWith("/apis") ? "text-api-secondary" : "text-muted-foreground"
                }`}
              >
                <span>APIs</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem asChild>
                <Link to="/apis" className="flex items-center space-x-3 py-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded">
                    <Atom className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">All APIs</div>
                    <div className="text-xs text-muted-foreground">Complete platform overview</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {apiCategories.map((api) => (
                <DropdownMenuItem key={api.name} asChild>
                  <Link to={api.path} className="flex items-center space-x-3 py-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded">
                      <api.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">{api.name}</div>
                      <div className="text-xs text-muted-foreground">{api.description}</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link
            to="/docs"
            className={`text-sm font-medium transition-colors hover:text-api-secondary ${
              location.pathname === "/docs" ? "text-api-secondary" : "text-muted-foreground"
            }`}
          >
            Documentation
          </Link>
          <Link
            to="/demos"
            className={`text-sm font-medium transition-colors hover:text-api-secondary ${
              location.pathname === "/demos" ? "text-api-secondary" : "text-muted-foreground"
            }`}
          >
            Demos
          </Link>
          <Link
            to="/tutorials"
            className={`text-sm font-medium transition-colors hover:text-api-secondary ${
              location.pathname === "/tutorials" ? "text-api-secondary" : "text-muted-foreground"
            }`}
          >
            Tutorials
          </Link>
          <Link
            to="/patents"
            className={`text-sm font-medium transition-colors hover:text-api-secondary ${
              location.pathname === "/patents" ? "text-api-secondary" : "text-muted-foreground"
            }`}
          >
            Patents
          </Link>
          <Link
            to="/playground"
            className={`text-sm font-medium transition-colors hover:text-api-secondary ${
              location.pathname === "/playground" ? "text-api-secondary" : "text-muted-foreground"
            }`}
          >
            Playground
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-api-secondary ${
                location.pathname === "/dashboard" ? "text-api-secondary" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/account">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/team">Team Management</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/security">Security</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button variant="gradient" size="sm" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;