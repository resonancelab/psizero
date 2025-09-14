import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Code, BarChart3, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Code className="h-8 w-8 text-api-secondary" />
          <span className="font-bold text-xl text-foreground">APIFlow</span>
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
          <Link 
            to="/docs" 
            className={`text-sm font-medium transition-colors hover:text-api-secondary ${
              location.pathname === "/docs" ? "text-api-secondary" : "text-muted-foreground"
            }`}
          >
            Documentation
          </Link>
          <Link 
            to="/dashboard" 
            className={`text-sm font-medium transition-colors hover:text-api-secondary ${
              location.pathname === "/dashboard" ? "text-api-secondary" : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
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