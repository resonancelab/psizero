/**
 * Error Boundary Component for Quantum Optimization
 * Provides graceful error handling and recovery mechanisms for React components
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Bug, 
  Home,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Shield
} from 'lucide-react';
import { useOptimizationErrorHandler, type OptimizationError } from '@/lib/quantum-optimizer/error-handling';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

export class OptimizationErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Log the error
    console.error('Optimization Error Boundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset if resetKeys changed
    if (hasError && resetKeys && prevProps.resetKeys !== resetKeys) {
      if (resetKeys.some((key, idx) => prevProps.resetKeys?.[idx] !== key)) {
        this.resetErrorBoundary();
      }
    }

    // Reset if props changed and resetOnPropsChange is true
    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: this.state.retryCount + 1
    });
  };

  retryWithDelay = (delay: number = 1000) => {
    this.resetTimeoutId = window.setTimeout(() => {
      this.resetErrorBoundary();
    }, delay);
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  copyErrorToClipboard = async () => {
    const { error, errorInfo } = this.state;
    const errorText = `
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy error to clipboard:', err);
    }
  };

  getErrorSeverity(): 'low' | 'medium' | 'high' {
    const { error } = this.state;
    if (!error) return 'low';

    // Analyze error to determine severity
    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      return 'medium'; // Network/loading issues
    }
    if (error.message.includes('TypeError') || error.message.includes('ReferenceError')) {
      return 'high'; // Code errors
    }
    return 'medium';
  }

  render() {
    const { hasError, error, errorInfo, showDetails, retryCount } = this.state;
    const { children, fallback, maxRetries = 3 } = this.props;

    if (hasError) {
      const severity = this.getErrorSeverity();
      const canRetry = retryCount < maxRetries;

      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Optimization Error</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={severity === 'high' ? 'destructive' : 'secondary'}>
                      {severity} severity
                    </Badge>
                    {retryCount > 0 && (
                      <Badge variant="outline">
                        Retry {retryCount}/{maxRetries}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error Alert */}
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>
                  {error?.message || 'An unexpected error occurred while processing the optimization.'}
                </AlertDescription>
              </Alert>

              {/* Recovery Actions */}
              <div className="space-y-3">
                <h4 className="font-medium">What you can do:</h4>
                <div className="grid gap-2">
                  {canRetry && (
                    <Button
                      onClick={this.resetErrorBoundary}
                      className="justify-start"
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => this.retryWithDelay(2000)}
                    className="justify-start"
                    variant="outline"
                    disabled={!canRetry}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry with Delay
                  </Button>

                  <Button
                    onClick={() => window.location.reload()}
                    className="justify-start"
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload Page
                  </Button>

                  <Button
                    onClick={() => window.location.href = '/'}
                    className="justify-start"
                    variant="outline"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go to Home
                  </Button>
                </div>
              </div>

              {/* Error Details */}
              <div className="border-t pt-4">
                <Button
                  onClick={this.toggleDetails}
                  variant="ghost"
                  size="sm"
                  className="justify-start p-0 h-auto"
                >
                  {showDetails ? (
                    <ChevronUp className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  )}
                  {showDetails ? 'Hide' : 'Show'} Error Details
                </Button>

                {showDetails && (
                  <div className="mt-3 space-y-3">
                    {/* Error Message */}
                    <div>
                      <h5 className="font-medium text-sm mb-1">Error Message:</h5>
                      <code className="block p-2 bg-muted rounded text-xs font-mono break-all">
                        {error?.message}
                      </code>
                    </div>

                    {/* Stack Trace */}
                    {error?.stack && (
                      <div>
                        <h5 className="font-medium text-sm mb-1">Stack Trace:</h5>
                        <code className="block p-2 bg-muted rounded text-xs font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {error.stack}
                        </code>
                      </div>
                    )}

                    {/* Component Stack */}
                    {errorInfo?.componentStack && (
                      <div>
                        <h5 className="font-medium text-sm mb-1">Component Stack:</h5>
                        <code className="block p-2 bg-muted rounded text-xs font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {errorInfo.componentStack}
                        </code>
                      </div>
                    )}

                    {/* Copy Button */}
                    <Button
                      onClick={this.copyErrorToClipboard}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Error Details
                    </Button>
                  </div>
                )}
              </div>

              {/* Help Text */}
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                <p className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    This error has been contained to prevent it from affecting other parts of the application. 
                    The optimization service may still be functional - try refreshing or navigating to a different section.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <OptimizationErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </OptimizationErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Hook-based error boundary for functional components
 */
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

/**
 * Optimization-specific error boundary with built-in fallbacks
 */
export const OptimizationErrorBoundaryWithFallback: React.FC<{
  children: ReactNode;
  fallbackType?: 'minimal' | 'detailed' | 'custom';
  customFallback?: ReactNode;
}> = ({ children, fallbackType = 'detailed', customFallback }) => {
  const { errors, clearErrors } = useOptimizationErrorHandler();

  const getFallback = () => {
    if (customFallback) return customFallback;

    if (fallbackType === 'minimal') {
      return (
        <div className="flex items-center justify-center h-32">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unable to load optimization</AlertTitle>
            <AlertDescription>
              Please try refreshing the page or contact support if the problem persists.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return undefined; // Use default detailed fallback
  };

  return (
    <OptimizationErrorBoundary
      fallback={getFallback()}
      onError={(error, errorInfo) => {
        // Log to error handling system
        console.error('Optimization component error:', error, errorInfo);
      }}
      resetKeys={[errors.length]} // Reset when errors change
    >
      {children}
    </OptimizationErrorBoundary>
  );
};

export default OptimizationErrorBoundary;