import { useState, useCallback } from 'react';
import { toast } from '../components/ui/Toaster';
import { errorMonitoring } from '../lib/errorMonitoring';

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

    // Show user-friendly error message
    if (showToast) {
      toast.error(
        'Something went wrong',
        errorObj.message || 'An unexpected error occurred. Please try again.'
      );
    }

    // Send to error monitoring service
    errorMonitoring.captureException(errorObj, {
      hook: 'useErrorHandler',
    });
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