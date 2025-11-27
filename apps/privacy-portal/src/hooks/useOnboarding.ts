/**
 * useOnboarding Hook
 * 
 * Custom hook for managing onboarding state and progress
 */

import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useSupabase';
import { OnboardingService, type OnboardingProgress } from '../services/onboardingService';

export interface UseOnboardingReturn {
  isLoading: boolean;
  isCompleted: boolean;
  progress: OnboardingProgress | null;
  refreshProgress: () => Promise<void>;
  markComplete: () => Promise<void>;
}

export function useOnboarding(): UseOnboardingReturn {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);

  const refreshProgress = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [completed, progressData] = await Promise.all([
        OnboardingService.isOnboardingCompleted(user.id),
        OnboardingService.getOnboardingProgress(user.id),
      ]);

      setIsCompleted(completed);
      setProgress(progressData);
    } catch (error) {
      console.error('Error refreshing onboarding progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const markComplete = useCallback(async () => {
    if (!user?.id) return;

    try {
      await OnboardingService.markOnboardingCompleted(user.id);
      setIsCompleted(true);
      if (progress) {
        setProgress({ ...progress, completed: true, progress: 100 });
      }
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
      throw error;
    }
  }, [user?.id, progress]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  return {
    isLoading,
    isCompleted,
    progress,
    refreshProgress,
    markComplete,
  };
}

