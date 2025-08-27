import { useState, useCallback } from 'react';
import { toast } from '../components/ui/Toaster';

interface ErrorState {
  error: Error | null;
  isError: boolean;
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false
  });

  const handleError = useCallback((error: Error | string, showToast = true) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    setErrorState({
      error: errorObj,
      isError: true
    });

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('Error caught by useErrorHandler:', errorObj);
    }

    // Show user-friendly error message
    if (showToast) {
      toast.error(
        'Something went wrong',
        errorObj.message || 'An unexpected error occurred. Please try again.'
      );
    }

    // TODO: Send to error monitoring service in production
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(errorObj);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false
    });
  }, []);

  return {
    error: errorState.error,
    isError: errorState.isError,
    handleError,
    clearError
  };
};

export default useErrorHandler;