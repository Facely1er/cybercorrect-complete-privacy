/**
 * Onboarding Service
 * 
 * Handles onboarding flow automation and state management
 * Based on the common onboarding flow established for ERMITS products
 */

import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

export interface OnboardingProgress {
  completed: boolean;
  progress: number;
  checklistItems: {
    createDataInventory: boolean;
    runComplianceAssessment: boolean;
    setupDataRights: boolean;
    exploreDashboard: boolean;
  };
}

export class OnboardingService {
  /**
   * Initialize onboarding for new user
   * Called when user first signs up or starts onboarding
   */
  static async completeOnboarding(userId: string): Promise<void> {
    try {
      // 1. Create default workspace/profile if needed
      await this.createDefaultProfile(userId);

      // 2. Send welcome email (if email service is configured)
      await this.sendWelcomeEmail(userId);

      // 3. Mark onboarding as started
      await this.markOnboardingStarted(userId);

      logger.info('Onboarding automation completed', { userId });
    } catch (error) {
      logger.error('Error completing onboarding:', error);
      // Don't throw - onboarding should continue even if automation fails
    }
  }

  /**
   * Create default profile for new user
   */
  private static async createDefaultProfile(userId: string): Promise<void> {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        // Profile already exists
        return;
      }

      // Get user email
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not found');
      }

      // Create default profile
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          is_first_login: true,
          onboarding_started: false,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        // If profile table doesn't exist or insert fails, log and continue
        logger.warn('Could not create default profile:', error);
      }
    } catch (error) {
      logger.warn('Error creating default profile:', error);
      // Don't throw - profile creation is optional
    }
  }

  /**
   * Send welcome email
   */
  private static async sendWelcomeEmail(userId: string): Promise<void> {
    try {
      // Check if edge function exists
      const { error } = await supabase.functions.invoke('send-welcome-email', {
        body: { userId },
      });

      if (error) {
        // Email function might not exist, that's okay
        logger.warn('Welcome email function not available:', error.message);
      }
    } catch (error) {
      logger.warn('Error sending welcome email:', error);
      // Don't throw - email failures shouldn't block onboarding
    }
  }

  /**
   * Mark onboarding as started
   */
  private static async markOnboardingStarted(userId: string): Promise<void> {
    try {
      await supabase
        .from('profiles')
        .update({
          onboarding_started: true,
          onboarding_started_at: new Date().toISOString(),
          is_first_login: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
    } catch (error) {
      logger.warn('Error marking onboarding as started:', error);
      // Don't throw - this is just tracking
    }
  }

  /**
   * Mark onboarding as completed
   */
  static async markOnboardingCompleted(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          is_first_login: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        logger.error('Error marking onboarding as completed:', error);
        throw error;
      }

      logger.info('Onboarding marked as completed', { userId });
    } catch (error) {
      logger.error('Error completing onboarding:', error);
      throw error;
    }
  }

  /**
   * Check if user has completed onboarding
   */
  static async isOnboardingCompleted(userId: string): Promise<boolean> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

      return profile?.onboarding_completed === true;
    } catch (error) {
      logger.error('Error checking onboarding status:', error);
      return false;
    }
  }

  /**
   * Get onboarding progress
   */
  static async getOnboardingProgress(userId: string): Promise<OnboardingProgress> {
    try {
      // Check checklist items
      const [dataInventoryCount, complianceCount, dataRightsCount] = await Promise.all([
        // Check if user has created data inventory
        supabase
          .from('data_inventory')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
        // Check if user has run compliance assessment
        supabase
          .from('compliance_assessments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
        // Check if user has set up data rights portal
        supabase
          .from('data_rights_requests')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
      ]);

      const checklistItems = {
        createDataInventory: (dataInventoryCount.count || 0) > 0,
        runComplianceAssessment: (complianceCount.count || 0) > 0,
        setupDataRights: (dataRightsCount.count || 0) > 0,
        exploreDashboard: true, // Dashboard is always accessible
      };

      const completedCount = Object.values(checklistItems).filter(Boolean).length;
      const progress = (completedCount / Object.keys(checklistItems).length) * 100;
      const completed = Object.values(checklistItems).every(item => item === true);

      return {
        completed,
        progress: Math.round(progress),
        checklistItems,
      };
    } catch (error) {
      logger.error('Error getting onboarding progress:', error);
      // Return default progress if tables don't exist
      return {
        completed: false,
        progress: 0,
        checklistItems: {
          createDataInventory: false,
          runComplianceAssessment: false,
          setupDataRights: false,
          exploreDashboard: false,
        },
      };
    }
  }

  /**
   * Update profile data during onboarding
   */
  static async updateOnboardingProfile(
    userId: string,
    profileData: {
      role?: string;
      organization_size?: string;
      industry?: string;
    }
  ): Promise<void> {
    try {
      await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
    } catch (error) {
      logger.error('Error updating onboarding profile:', error);
      throw error;
    }
  }
}

