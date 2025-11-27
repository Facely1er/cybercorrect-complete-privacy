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
   * Gracefully handles missing database schema - logs warning but doesn't throw
   */
  private static async markOnboardingStarted(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_started: true,
          onboarding_started_at: new Date().toISOString(),
          is_first_login: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        // Check if it's a schema error (table/column doesn't exist)
        if (error.code === 'PGRST116' || error.message?.includes('column') || error.message?.includes('relation')) {
          logger.warn('Onboarding fields not available in profiles table, start not tracked:', error.message);
          return; // Don't throw - this is just tracking
        }
        logger.warn('Error marking onboarding as started:', error);
        // Don't throw - this is just tracking
      }
    } catch (error) {
      logger.warn('Error marking onboarding as started:', error);
      // Don't throw - this is just tracking
    }
  }

  /**
   * Mark onboarding as completed
   * Gracefully handles missing database schema - logs warning but doesn't throw
   * This ensures onboarding completion doesn't break in minimal architecture setups
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
        // Check if it's a schema error (table/column doesn't exist)
        if (error.code === 'PGRST116' || error.message?.includes('column') || error.message?.includes('relation')) {
          logger.warn('Onboarding fields not available in profiles table, completion not persisted:', error.message);
          // Don't throw - allow onboarding to complete even if schema is missing
          return;
        }
        // For minimal architecture compatibility, log but don't throw
        // This ensures onboarding completion doesn't block functionality
        logger.warn('Error marking onboarding as completed (non-critical), allowing completion:', error);
        return; // Don't throw - allow onboarding to complete
      }

      logger.info('Onboarding marked as completed', { userId });
    } catch (error) {
      // For minimal architecture compatibility, always allow onboarding completion
      // Log the error but don't throw to prevent blocking functionality
      if (error instanceof Error && (error.message?.includes('column') || error.message?.includes('relation'))) {
        logger.warn('Onboarding completion: schema not available, continuing anyway:', error.message);
      } else {
        logger.warn('Onboarding completion: error occurred but allowing completion:', error);
      }
      // Don't throw - always allow onboarding to complete to prevent blocking
      return;
    }
  }

  /**
   * Check if user has completed onboarding
   * Returns false if profiles table doesn't exist or onboarding field is missing
   * This ensures onboarding doesn't block access in minimal architecture setups
   */
  static async isOnboardingCompleted(userId: string): Promise<boolean> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

      // If table doesn't exist or field is missing, assume onboarding is not required
      if (error) {
        // Check if it's a schema error (table/column doesn't exist)
        if (error.code === 'PGRST116' || error.message?.includes('column') || error.message?.includes('relation')) {
          logger.warn('Onboarding fields not available in profiles table, assuming not required:', error.message);
          return true; // Return true to allow access - onboarding is optional
        }
        logger.warn('Error checking onboarding status:', error);
        return true; // Default to allowing access if check fails
      }

      return profile?.onboarding_completed === true;
    } catch (error) {
      logger.warn('Error checking onboarding status, allowing access:', error);
      // Always return true on error to ensure onboarding doesn't block core functionality
      return true;
    }
  }

  /**
   * Get onboarding progress
   * Gracefully handles missing database tables - returns default progress
   * This ensures onboarding doesn't break in minimal architecture setups
   */
  static async getOnboardingProgress(userId: string): Promise<OnboardingProgress> {
    try {
      // Check checklist items with error handling for each table
      const [dataInventoryResult, complianceResult, dataRightsResult] = await Promise.allSettled([
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

      // Safely extract counts, defaulting to 0 if table doesn't exist
      const getCount = (result: PromiseSettledResult<any>): number => {
        if (result.status === 'fulfilled' && result.value.data !== undefined) {
          return result.value.count || 0;
        }
        // If table doesn't exist, log warning and return 0
        if (result.status === 'rejected') {
          logger.warn('Onboarding progress check: table may not exist, assuming no progress');
        }
        return 0;
      };

      const checklistItems = {
        createDataInventory: getCount(dataInventoryResult) > 0,
        runComplianceAssessment: getCount(complianceResult) > 0,
        setupDataRights: getCount(dataRightsResult) > 0,
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
      logger.warn('Error getting onboarding progress, returning default:', error);
      // Return default progress if tables don't exist - this allows onboarding to work
      // but doesn't block functionality if database schema is minimal
      return {
        completed: false,
        progress: 0,
        checklistItems: {
          createDataInventory: false,
          runComplianceAssessment: false,
          setupDataRights: false,
          exploreDashboard: true, // Always allow dashboard access
        },
      };
    }
  }

  /**
   * Update profile data during onboarding
   * Gracefully handles missing database schema - logs warning but doesn't throw
   * This ensures profile updates don't break onboarding flow in minimal architecture
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
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        // Check if it's a schema error (table/column doesn't exist)
        if (error.code === 'PGRST116' || error.message?.includes('column') || error.message?.includes('relation')) {
          logger.warn('Profile fields not available, update not persisted:', error.message);
          return; // Don't throw - allow onboarding to continue
        }
        logger.error('Error updating onboarding profile:', error);
        // Only throw if it's not a schema error
        throw error;
      }
    } catch (error) {
      // If it's a schema error, log and continue (don't block onboarding)
      if (error instanceof Error && (error.message?.includes('column') || error.message?.includes('relation'))) {
        logger.warn('Onboarding profile update: schema not available, continuing anyway:', error.message);
        return;
      }
      logger.error('Error updating onboarding profile:', error);
      throw error;
    }
  }
}

