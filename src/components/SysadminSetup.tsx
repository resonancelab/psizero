import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const SysadminSetup = () => {
  const { user, setSysadminStatus } = useAuth();
  const [hasAnySysadmin, setHasAnySysadmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const checkForSysadmin = async () => {
      try {
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_sysadmin', true);

        setHasAnySysadmin((count || 0) > 0);
      } catch (error) {
        console.error('Error checking for sysadmin:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkForSysadmin();
  }, []);

  const handleBecomeSysadmin = async () => {
    if (!user) return;

    setIsCreating(true);
    try {
      const result = await setSysadminStatus(user.id, true);
      if (result.success) {
        setHasAnySysadmin(true);
      }
    } catch (error) {
      console.error('Error becoming sysadmin:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Checking system configuration...</p>
      </div>
    );
  }

  if (hasAnySysadmin || !user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-api-secondary" />
            System Setup Required
          </CardTitle>
          <CardDescription>
            No system administrator found. The first user to sign up becomes the sysadmin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              As the first user, you can claim system administrator privileges. This will give you 
              access to user management, system settings, and administrative functions.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Your email:</strong> {user.email}
            </p>
            
            <Button 
              onClick={handleBecomeSysadmin}
              disabled={isCreating}
              className="w-full"
              variant="default"
            >
              <Crown className="h-4 w-4 mr-2" />
              {isCreating ? "Setting up..." : "Become System Administrator"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SysadminSetup;