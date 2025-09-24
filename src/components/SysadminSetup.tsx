import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, ShieldCheck, AlertCircle, Loader2, CheckCircle, Info } from "lucide-react";
import psiZeroApi from "@/lib/api";

interface SysadminSetupProps {
  onSetupComplete: () => void;
}

const SysadminSetup: React.FC<SysadminSetupProps> = ({ onSetupComplete }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [setupStatus, setSetupStatus] = useState<{
    setupComplete: boolean;
    hasUsers: boolean;
    userCount: number;
    automaticSetupConfigured: boolean;
  } | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check setup status on component mount
  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const response = await psiZeroApi.auth.getSetupStatus();
        if (response.data) {
          setSetupStatus(response.data);
          
          // If setup is already complete, redirect to sign-in page
          if (response.data.setupComplete) {
            setTimeout(() => {
              navigate('/signin');
            }, 3000); // 3 second delay to show the message
          }
        } else {
          setError(response.error || "Failed to check setup status");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check setup status");
      } finally {
        setCheckingStatus(false);
      }
    };

    checkSetupStatus();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 12) {
      setError("Password must be at least 12 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const setupToken = import.meta.env.VITE_INITIAL_SETUP_TOKEN || 'local-setup-token-123';
      
      // Step 1: Register the sysadmin user
      const response = await psiZeroApi.auth.register({
        email,
        password,
        setupToken
      });

      if (response.error || !response.data) {
        setError(response.error || "An unknown error occurred during registration.");
        return;
      }

      // Step 2: Automatically log in the new sysadmin user
      const loginResponse = await psiZeroApi.auth.login({
        email,
        password
      });

      if (loginResponse.error || !loginResponse.data) {
        console.warn('Sysadmin created but auto-login failed:', loginResponse.error);
        // User was created successfully, just redirect to sign-in
        onSetupComplete();
        return;
      }

      // Step 3: Create default organization for the sysadmin
      try {
        // Extract organization name from email domain or use default
        const emailDomain = email.split('@')[1];
        const orgName = emailDomain ?
          `${emailDomain.split('.')[0].charAt(0).toUpperCase() + emailDomain.split('.')[0].slice(1)} Organization` :
          'Default Organization';
        
        const orgSlug = emailDomain ?
          emailDomain.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '') :
          'default';

        console.log('Creating default organization for sysadmin:', { orgName, orgSlug });

        const orgResponse = await psiZeroApi.client.post('/organizations', {
          name: orgName,
          slug: orgSlug,
          description: 'Default organization for system administrator'
        });

        if (orgResponse.error) {
          console.warn('Failed to create default organization:', orgResponse.error);
          // Don't fail the entire setup for this - user can create org later
        } else {
          console.log('Default organization created successfully:', orgResponse.data);
        }
      } catch (orgError) {
        console.warn('Error creating default organization:', orgError);
        // Don't fail the entire setup for this - user can create org later
      }

      // Setup completed successfully
      onSetupComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking status
  if (checkingStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Checking setup status...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show setup complete message with redirect
  if (setupStatus?.setupComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-green-600">
              <CheckCircle className="h-6 w-6" />
              Setup Complete
            </CardTitle>
            <CardDescription>
              System administrator account has already been created.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {setupStatus.automaticSetupConfigured && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Administrator account was created automatically using environment configuration.
                </AlertDescription>
              </Alert>
            )}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Redirecting to sign-in page in a few seconds...
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => navigate('/signin')}
              className="w-full"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show setup form if setup is not complete
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ShieldCheck className="h-6 w-6 text-primary" />
            System Administrator Setup
          </CardTitle>
          <CardDescription>
            Create the first administrator account for your PsiZero platform. This can only be done once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {setupStatus?.automaticSetupConfigured && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Automatic setup is configured but no administrator account was created yet. You can create one manually using the form below.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Administrator Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@psizero.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Create Administrator
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SysadminSetup;