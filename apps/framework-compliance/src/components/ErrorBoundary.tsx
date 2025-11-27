import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { errorMonitoring } from '../lib/errorMonitoring';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<Record<string, unknown>>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<Record<string, unknown>>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if this is a dynamic import failure
    const isDynamicImportError = 
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Failed to load module') ||
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk');
    
    if (isDynamicImportError) {
      console.warn('Dynamic import error detected:', error);
      // Log additional context for debugging
      errorMonitoring.captureException(error, {
        tags: {
          errorType: 'dynamic_import',
          component: 'ErrorBoundary'
        },
        extra: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Send error to monitoring service
    errorMonitoring.captureException(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDynamicImportError = 
        this.state.error?.message.includes('Failed to fetch dynamically imported module') ||
        this.state.error?.message.includes('Failed to load module') ||
        this.state.error?.name === 'ChunkLoadError' ||
        this.state.error?.message.includes('Loading chunk');
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              {isDynamicImportError ? (
                <>
                  We're having trouble loading a component. This is usually a temporary network issue.
                  <br />
                  <br />
                  Please try refreshing the page. If the problem persists, it may be due to a deployment update.
                </>
              ) : (
                "We're sorry, but something unexpected happened. Please try refreshing the page."
              )}
            </p>
            <div className="space-y-3">
              <Button onClick={this.handleReload} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;