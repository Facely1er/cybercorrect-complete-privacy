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

export function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { isLoading, isCompleted, refreshProgress } = useOnboarding();
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
          console.error('Error initializing onboarding:', error);
          // Continue even if initialization fails
          setOnboardingInitialized(true);
        }
      }
    };

    initializeOnboarding();
  }, [user?.id, onboardingInitialized]);

  // Check if onboarding is already completed
  useEffect(() => {
    if (!isLoading && isCompleted) {
      // Redirect to dashboard if onboarding is already completed
      navigate('/privacy/dashboard', { replace: true });
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
        console.error('Error completing onboarding:', error);
      }
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

