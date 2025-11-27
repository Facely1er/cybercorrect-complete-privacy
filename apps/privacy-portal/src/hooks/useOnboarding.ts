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
      setIsCompleted(true); // Allow access for unauthenticated users
      return;
    }

    try {
      setIsLoading(true);
      const [completed, progressData] = await Promise.all([
        OnboardingService.isOnboardingCompleted(user.id),
        OnboardingService.getOnboardingProgress(user.id),
      ]);

      // Ensure we always set a valid state, defaulting to allowing access
      setIsCompleted(completed !== false); // Treat undefined/null as true (allow access)
      setProgress(progressData);
    } catch (error) {
      console.warn('Error refreshing onboarding progress, allowing access:', error);
      // On error, default to allowing access to prevent blocking core functionality
      setIsCompleted(true);
      setProgress({
        completed: true,
        progress: 100,
        checklistItems: {
          createDataInventory: false,
          runComplianceAssessment: false,
          setupDataRights: false,
          exploreDashboard: true,
        },
      });
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
      // Even if marking complete fails, update local state to allow navigation
      // This ensures minimal architecture setups don't get stuck
      console.warn('Error marking onboarding complete, updating local state anyway:', error);
      setIsCompleted(true);
      if (progress) {
        setProgress({ ...progress, completed: true, progress: 100 });
      }
      // Don't throw - allow completion to proceed
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

