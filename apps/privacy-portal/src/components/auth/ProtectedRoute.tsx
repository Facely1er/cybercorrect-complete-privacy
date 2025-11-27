import React from 'react';
import { appConfig } from '../../config/environment';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthContext';
import { useLocalUser } from '../../hooks/useLocalUser';
import { useUser } from '../../hooks/useSupabase';
import { useOnboarding } from '../../hooks/useOnboarding';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  fallbackPath?: string;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({ 
  children,
  requireOnboarding = false
}: ProtectedRouteProps) {
  // Always call hooks at the top level
  const { isAuthenticated } = useAuth();
  const { localUser } = useLocalUser();
  const { user } = useUser();
  const { isLoading: onboardingLoading, isCompleted: onboardingCompleted } = useOnboarding();
  const location = useLocation();

  // If auth is not required, always allow access
  if (!appConfig.auth?.requireAuth) {
    return <>{children}</>;
  }

  // Otherwise, enforce authentication (either provider or local user)
  if (!isAuthenticated && !localUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check onboarding status if required
  // Note: requireOnboarding defaults to false, so onboarding is optional by default
  if (requireOnboarding && user) {
    // Don't check onboarding for onboarding page itself
    if (location.pathname === '/onboarding') {
      return <>{children}</>;
    }

    // Show loading while checking onboarding status (with reasonable timeout)
    if (onboardingLoading) {
      return <div>Loading...</div>;
    }

    // Only redirect if explicitly not completed (false)
    // If onboardingCompleted is undefined/null (error state), allow access
    // This ensures minimal architecture setups don't get blocked
    if (onboardingCompleted === false) {
      return <Navigate to="/onboarding" state={{ from: location }} replace />;
    }
    
    // If onboardingCompleted is true or undefined (not required/error), allow access
  }

  return <>{children}</>;
}

// Convenience components for common protection patterns
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['administrator']}>
      {children}
    </ProtectedRoute>
  );
}

export function HRRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['administrator', 'hr_staff']}>
      {children}
    </ProtectedRoute>
  );
}

export function EmployeeRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={['employee', 'job_applicant', 'former_employee']}>
      {children}
    </ProtectedRoute>
  );
}