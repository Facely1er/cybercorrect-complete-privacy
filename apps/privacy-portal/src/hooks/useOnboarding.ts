/**
 * useOnboarding Hook
 * 
 * Custom hook for managing onboarding state and progress
 */

import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useSupabase';
import { OnboardingService, type OnboardingProgress } from '../services/onboardingService';
import { logger } from '../utils/logger';
import { useNotifications } from './useNotifications';

export interface UseOnboardingReturn {
  isLoading: boolean;
  isCompleted: boolean;
  progress: OnboardingProgress | null;
  refreshProgress: () => Promise<void>;
  markComplete: () => Promise<void>;
}

export function useOnboarding(): UseOnboardingReturn {
  const { user } = useUser();
  const { addNotification } = useNotifications();
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
      // Log error with context for debugging
      logger.warn('Error refreshing onboarding progress, allowing access', { error }, {
        component: 'useOnboarding',
        operation: 'refreshProgress',
        userId: user?.id
      });
      
      // On error, default to allowing access to prevent blocking core functionality
      // But notify user that there was an issue
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
      
      // Notify user of the issue (non-blocking)
      addNotification({
        type: 'warning',
        title: 'Onboarding Status',
        message: 'Unable to load onboarding progress. You can continue, but some features may be limited.',
        timestamp: Date.now(),
        read: false,
        category: 'system'
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
      
      addNotification({
        type: 'success',
        title: 'Onboarding Complete',
        message: 'Welcome! You can now access all features.',
        timestamp: Date.now(),
        read: false,
        category: 'system'
      });
    } catch (error) {
      // Log error with context
      logger.error('Error marking onboarding complete, updating local state anyway', error, {
        component: 'useOnboarding',
        operation: 'markComplete',
        userId: user.id
      });
      
      // Even if marking complete fails, update local state to allow navigation
      // This ensures minimal architecture setups don't get stuck
      setIsCompleted(true);
      if (progress) {
        setProgress({ ...progress, completed: true, progress: 100 });
      }
      
      // Notify user but allow them to continue
      addNotification({
        type: 'warning',
        title: 'Onboarding Status',
        message: 'Onboarding completion could not be saved, but you can continue.',
        timestamp: Date.now(),
        read: false,
        category: 'system'
      });
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

