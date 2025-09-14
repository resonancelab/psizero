import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Code, Mail, CheckCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { user, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already verified
    if (user?.email_confirmed_at) {
      setIsVerified(true);
      // Redirect to onboarding after a short delay
      setTimeout(() => {
        navigate('/onboarding');
      }, 2000);
    }
  }, [user, navigate]);

  const handleResendVerification = async () => {
    if (!user?.email) return;
    
    setIsResending(true);
    try {
      await signUp(user.email, ''); // This will resend verification email
    } catch (error) {
      console.error('Failed to resend verification:', error);
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <Code className="h-8 w-8 text-api-secondary" />
              <span className="font-bold text-2xl text-foreground">APIFlow</span>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Email Verified!</h2>
            <p className="mt-2 text-muted-foreground">
              Your email has been successfully verified.
            </p>
          </div>

          <Card className="shadow-elegant">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-api-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-api-success" />
                </div>
                <p className="text-muted-foreground">
                  Redirecting you to complete your setup...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <Code className="h-8 w-8 text-api-secondary" />
            <span className="font-bold text-2xl text-foreground">APIFlow</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Check your email</h2>
          <p className="mt-2 text-muted-foreground">
            We've sent you a verification link to confirm your email address.
          </p>
        </div>

        <Card className="shadow-elegant">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-api-secondary/10 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-api-secondary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Verify your email address</h3>
                <p className="text-muted-foreground text-sm">
                  Click the verification link in the email we sent you. If you don't see it, check your spam folder.
                </p>
              </div>
              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                  I've verified my email
                </Button>
                <Link to="/signin">
                  <Button variant="outline" className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
              
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Didn't receive an email?{' '}
                  <button 
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="text-api-secondary hover:underline disabled:opacity-50"
                  >
                    {isResending ? 'Sending...' : 'Resend verification'}
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;