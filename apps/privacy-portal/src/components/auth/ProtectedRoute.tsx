import React from 'react';
import { appConfig } from '../../config/environment';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthContext';
import { useLocalUser } from '../../hooks/useLocalUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children
}: ProtectedRouteProps) {
  // Always call hooks at the top level
  const { isAuthenticated } = useAuth();
  const { localUser } = useLocalUser();
  const location = useLocation();

  // If auth is not required, always allow access
  if (!appConfig.auth?.requireAuth) {
    return <>{children}</>;
  }

  // Otherwise, enforce authentication (either provider or local user)
  if (!isAuthenticated && !localUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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