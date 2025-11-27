/**
 * Onboarding Guard Component
 * 
 * Redirects users to onboarding if they haven't completed it yet
 * Use this to wrap protected routes that require onboarding completion
 */

import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../hooks/useSupabase';
import { useOnboarding } from '../../hooks/useOnboarding';
import { LoadingState } from '../common/LoadingState';

interface OnboardingGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function OnboardingGuard({ 
  children, 
  redirectTo = '/onboarding' 
}: OnboardingGuardProps) {
  const { user } = useUser();
  const { isLoading, isCompleted } = useOnboarding();

  // Don't check onboarding for unauthenticated users
  if (!user) {
    return <>{children}</>;
  }

  // Show loading while checking onboarding status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Checking onboarding status..." />
      </div>
    );
  }

  // Redirect to onboarding if not completed
  if (!isCompleted) {
    return <Navigate to={redirectTo} replace />;
  }

  // User has completed onboarding, allow access
  return <>{children}</>;
}

