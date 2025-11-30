/**
 * Onboarding Page
 * 
 * Main orchestrator for the onboarding flow
 * Implements the common onboarding flow established for ERMITS products
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useSupabase';
import { useOnboarding } from '../hooks/useOnboarding';
import { OnboardingService } from '../services/onboardingService';
import { WelcomeScreen } from '../components/onboarding/WelcomeScreen';
import { OnboardingChecklist } from '../components/onboarding/OnboardingChecklist';
import { LoadingState } from '../common/LoadingState';
import { logger } from '../utils/logger';
import { useNotifications } from '../hooks/useNotifications';

export function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { isLoading, isCompleted, refreshProgress } = useOnboarding();
  const { addNotification } = useNotifications();
  const [showWelcome, setShowWelcome] = useState(true);
  const [onboardingInitialized, setOnboardingInitialized] = useState(false);

  // Initialize onboarding when component mounts
  useEffect(() => {
    const initializeOnboarding = async () => {
      if (user?.id && !onboardingInitialized) {
        try {
          await OnboardingService.completeOnboarding(user.id);
          setOnboardingInitialized(true);
        } catch (error) {
          logger.error('Error initializing onboarding', error, {
            component: 'OnboardingPage',
            operation: 'initializeOnboarding',
            userId: user.id
          });
          // Continue even if initialization fails, but log the error
          setOnboardingInitialized(true);
        }
      }
    };

    initializeOnboarding();
  }, [user?.id, onboardingInitialized]);

  // Check if onboarding is already completed
  // Also handle case where onboarding check fails (allows access to prevent blocking)
  useEffect(() => {
    if (!isLoading) {
      // If completed or if check failed (undefined), allow access to dashboard
      // Only block if explicitly not completed (false)
      if (isCompleted !== false) {
        // Redirect to dashboard if onboarding is already completed or not required
        navigate('/privacy/dashboard', { replace: true });
      }
    }
  }, [isLoading, isCompleted, navigate]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleWelcomeSkip = () => {
    setShowWelcome(false);
  };

  const handleChecklistComplete = async () => {
    if (user?.id) {
      try {
        await OnboardingService.markOnboardingCompleted(user.id);
        await refreshProgress();
        navigate('/privacy/dashboard', { replace: true });
      } catch (error) {
        logger.error('Error completing onboarding, redirecting anyway', error, {
          component: 'OnboardingPage',
          operation: 'handleChecklistComplete',
          userId: user.id
        });
        
        // Even if marking complete fails, allow navigation to prevent blocking
        // This ensures minimal architecture setups don't get stuck
        addNotification({
          type: 'warning',
          title: 'Onboarding',
          message: 'Onboarding completion could not be saved, but you can continue.',
          timestamp: Date.now(),
          read: false,
          category: 'system'
        });
        navigate('/privacy/dashboard', { replace: true });
      }
    } else {
      // If no user, still allow navigation
      navigate('/privacy/dashboard', { replace: true });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Loading onboarding..." />
      </div>
    );
  }

  if (isCompleted) {
    // Will be redirected by useEffect, but show loading in the meantime
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Redirecting to dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {showWelcome ? (
        <WelcomeScreen
          onComplete={handleWelcomeComplete}
          onSkip={handleWelcomeSkip}
          userName={user?.user_metadata?.full_name || user?.email?.split('@')[0]}
        />
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to CyberCorrect
            </h1>
            <p className="text-muted-foreground">
              Complete these steps to get started with privacy compliance management
            </p>
          </div>
          
          <OnboardingChecklist />
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleChecklistComplete}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Skip onboarding and go to dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnboardingPage;

