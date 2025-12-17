/**
 * Portal Beta Service
 * 
 * Handles all Portal beta program operations including:
 * - Beta application submission
 * - Cohort capacity checking
 * - Participant management
 * - Feedback submission
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { errorMonitoring } from '../lib/errorMonitoring';

// ============================================================================
// TYPES
// ============================================================================

export interface BetaApplicationData {
  // Organization
  organizationName: string;
  organizationSize: '1-50' | '51-200' | '201-1000' | '1001-5000' | '5000+';
  organizationIndustry?: string;
  organizationWebsite?: string;
  
  // Contact
  contactName: string;
  contactEmail: string;
  contactRole: string;
  contactPhone?: string;
  
  // Beta Program
  primaryCohort: 'employee' | 'hr' | 'compliance' | 'legal' | 'multiple';
  interestedStakeholders: string[];
  expectedTesters: number;
  
  // Use Case
  currentChallenges?: string;
  specificNeeds?: string;
  featurePriorities?: string[];
  
  // Technical
  existingTools?: string[];
  integrationNeeds?: string;
  
  // White-Label
  whiteLabelInterest?: boolean;
  resellerInterest?: boolean;
  clientDeploymentCount?: number;
  
  // Context
  cameFromAssessment?: boolean;
  assessmentId?: string;
}

export interface BetaApplication {
  id: string;
  organizationName: string;
  contactEmail: string;
  primaryCohort: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'waitlist';
  createdAt: string;
  userId?: string;
}

export interface CohortInfo {
  cohortType: string;
  cohortName: string;
  maxOrganizations: number;
  currentOrganizations: number;
  isFull: boolean;
  availableSpots: number;
}

export interface BetaFeedback {
  participantId: string;
  feedbackType: 'bug' | 'feature_request' | 'improvement' | 'praise' | 'complaint';
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  pageUrl?: string;
  userRole?: string;
  cohortType?: string;
}

// ============================================================================
// APPLICATION SUBMISSION
// ============================================================================

/**
 * Submit a Portal beta application
 */
export async function submitBetaApplication(
  applicationData: BetaApplicationData
): Promise<{ success: boolean; applicationId?: string; error?: string }> {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock beta application');
      
      // In dev mode, simulate successful submission
      if (import.meta.env.DEV) {
        console.log('Mock beta application submitted:', applicationData);
        return {
          success: true,
          applicationId: `mock_beta_${Date.now()}`,
        };
      }
      
      return {
        success: false,
        error: 'Backend service not configured. Please contact support.',
      };
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.warn('User not authenticated for beta application');
      // Continue anyway - anonymous applications allowed
    }

    // Check cohort capacity
    const cohortCapacity = await getCohortCapacity(applicationData.primaryCohort);
    if (cohortCapacity && cohortCapacity.isFull) {
      return {
        success: false,
        error: `The ${cohortCapacity.cohortName} is currently full. You've been added to the waitlist.`,
      };
    }

    // Prepare application data
    const dbApplication = {
      // Organization
      organization_name: applicationData.organizationName,
      organization_size: applicationData.organizationSize,
      organization_industry: applicationData.organizationIndustry || null,
      organization_website: applicationData.organizationWebsite || null,
      
      // Contact
      contact_name: applicationData.contactName,
      contact_email: applicationData.contactEmail,
      contact_role: applicationData.contactRole,
      contact_phone: applicationData.contactPhone || null,
      
      // Beta Program
      primary_cohort: applicationData.primaryCohort,
      interested_stakeholders: applicationData.interestedStakeholders,
      expected_testers: applicationData.expectedTesters,
      
      // Use Case
      current_challenges: applicationData.currentChallenges || null,
      specific_needs: applicationData.specificNeeds || null,
      feature_priorities: applicationData.featurePriorities || [],
      
      // Technical
      existing_tools: applicationData.existingTools || [],
      integration_needs: applicationData.integrationNeeds || null,
      
      // White-Label
      white_label_interest: applicationData.whiteLabelInterest || false,
      reseller_interest: applicationData.resellerInterest || false,
      client_deployment_count: applicationData.clientDeploymentCount || null,
      
      // Context
      user_id: user?.id || null,
      assessment_id: applicationData.assessmentId || null,
      came_from_assessment: applicationData.cameFromAssessment || false,
      
      // Status (waitlist if cohort is full)
      status: cohortCapacity?.isFull ? 'waitlist' : 'pending',
    };

    // Submit to database
    const { data, error } = await supabase
      .from('portal_beta_applications')
      .insert([dbApplication])
      .select('id')
      .single();

    if (error) {
      console.error('Error submitting beta application:', error);
      errorMonitoring.captureException(error, {
        context: 'portal_beta_service',
        operation: 'submit_application',
      });
      
      return {
        success: false,
        error: 'Failed to submit application. Please try again or contact support.',
      };
    }

    // Send confirmation email (if email service is configured)
    try {
      await sendApplicationConfirmationEmail(applicationData.contactEmail, applicationData.contactName);
    } catch (emailError) {
      // Don't fail the application if email fails
      console.warn('Failed to send confirmation email:', emailError);
    }

    return {
      success: true,
      applicationId: data.id,
    };
  } catch (error) {
    console.error('Unexpected error submitting beta application:', error);
    errorMonitoring.captureException(
      error instanceof Error ? error : new Error('Failed to submit beta application'),
      { context: 'portal_beta_service' }
    );
    
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

// ============================================================================
// COHORT MANAGEMENT
// ============================================================================

/**
 * Get capacity information for a specific cohort
 */
export async function getCohortCapacity(
  cohortType: string
): Promise<CohortInfo | null> {
  try {
    if (!isSupabaseConfigured()) {
      // Return mock data in dev mode
      if (import.meta.env.DEV) {
        return {
          cohortType,
          cohortName: `Cohort ${cohortType}`,
          maxOrganizations: 25,
          currentOrganizations: Math.floor(Math.random() * 20),
          isFull: false,
          availableSpots: 25 - Math.floor(Math.random() * 20),
        };
      }
      return null;
    }

    const { data, error } = await supabase
      .from('portal_beta_cohorts')
      .select('*')
      .eq('cohort_type', cohortType)
      .single();

    if (error) {
      console.error('Error fetching cohort capacity:', error);
      return null;
    }

    return {
      cohortType: data.cohort_type,
      cohortName: data.cohort_name,
      maxOrganizations: data.max_organizations,
      currentOrganizations: data.current_organizations,
      isFull: data.is_full,
      availableSpots: data.max_organizations - data.current_organizations,
    };
  } catch (error) {
    console.error('Unexpected error fetching cohort capacity:', error);
    return null;
  }
}

/**
 * Get capacity for all cohorts
 */
export async function getAllCohortCapacities(): Promise<CohortInfo[]> {
  try {
    if (!isSupabaseConfigured()) {
      // Return mock data in dev mode
      if (import.meta.env.DEV) {
        return [
          { cohortType: 'employee', cohortName: 'Employee Self-Service', maxOrganizations: 25, currentOrganizations: 12, isFull: false, availableSpots: 13 },
          { cohortType: 'hr', cohortName: 'HR & Manager Features', maxOrganizations: 25, currentOrganizations: 18, isFull: false, availableSpots: 7 },
          { cohortType: 'compliance', cohortName: 'Compliance & Oversight', maxOrganizations: 25, currentOrganizations: 21, isFull: false, availableSpots: 4 },
          { cohortType: 'legal', cohortName: 'Legal & Representative', maxOrganizations: 25, currentOrganizations: 15, isFull: false, availableSpots: 10 },
          { cohortType: 'multiple', cohortName: 'White-Label Beta', maxOrganizations: 25, currentOrganizations: 8, isFull: false, availableSpots: 17 },
        ];
      }
      return [];
    }

    const { data, error } = await supabase
      .from('portal_beta_cohorts')
      .select('*')
      .order('cohort_type');

    if (error) {
      console.error('Error fetching all cohort capacities:', error);
      return [];
    }

    return data.map(cohort => ({
      cohortType: cohort.cohort_type,
      cohortName: cohort.cohort_name,
      maxOrganizations: cohort.max_organizations,
      currentOrganizations: cohort.current_organizations,
      isFull: cohort.is_full,
      availableSpots: cohort.max_organizations - cohort.current_organizations,
    }));
  } catch (error) {
    console.error('Unexpected error fetching cohort capacities:', error);
    return [];
  }
}

// ============================================================================
// APPLICATION MANAGEMENT
// ============================================================================

/**
 * Get user's beta applications
 */
export async function getUserBetaApplications(): Promise<BetaApplication[]> {
  try {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return [];
    }

    const { data, error } = await supabase
      .from('portal_beta_applications')
      .select('id, organization_name, contact_email, primary_cohort, status, created_at, user_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user beta applications:', error);
      return [];
    }

    return data.map(app => ({
      id: app.id,
      organizationName: app.organization_name,
      contactEmail: app.contact_email,
      primaryCohort: app.primary_cohort,
      status: app.status,
      createdAt: app.created_at,
      userId: app.user_id,
    }));
  } catch (error) {
    console.error('Unexpected error fetching user applications:', error);
    return [];
  }
}

/**
 * Check if user has already applied for beta
 */
export async function hasUserAppliedForBeta(): Promise<boolean> {
  try {
    const applications = await getUserBetaApplications();
    return applications.length > 0;
  } catch (error) {
    console.error('Error checking beta application status:', error);
    return false;
  }
}

// ============================================================================
// FEEDBACK SUBMISSION
// ============================================================================

/**
 * Submit beta feedback
 */
export async function submitBetaFeedback(
  feedback: BetaFeedback
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, feedback not submitted');
      if (import.meta.env.DEV) {
        console.log('Mock feedback submitted:', feedback);
        return { success: true };
      }
      return { success: false, error: 'Backend service not configured' };
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('portal_beta_feedback')
      .insert([{
        participant_id: feedback.participantId,
        user_id: user?.id || null,
        feedback_type: feedback.feedbackType,
        title: feedback.title,
        description: feedback.description,
        priority: feedback.priority || 'medium',
        page_url: feedback.pageUrl || null,
        user_role: feedback.userRole || null,
        cohort_type: feedback.cohortType || null,
      }]);

    if (error) {
      console.error('Error submitting feedback:', error);
      return { success: false, error: 'Failed to submit feedback' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error submitting feedback:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// ============================================================================
// EMAIL NOTIFICATIONS (Stub for future implementation)
// ============================================================================

/**
 * Send application confirmation email
 * @todo Implement with Supabase Edge Function + Email service (SendGrid/Resend)
 */
async function sendApplicationConfirmationEmail(
  email: string,
  name: string
): Promise<void> {
  // This would call a Supabase Edge Function that sends emails
  console.log(`Would send confirmation email to ${email} (${name})`);
  
  // Example implementation:
  // await supabase.functions.invoke('send-beta-confirmation-email', {
  //   body: { email, name }
  // });
}

/**
 * Send application status update email
 * @todo Implement with Supabase Edge Function + Email service
 */
export async function sendStatusUpdateEmail(
  email: string,
  name: string,
  status: 'accepted' | 'rejected' | 'waitlist'
): Promise<void> {
  console.log(`Would send status update email to ${email} (${name}): ${status}`);
}

// ============================================================================
// ANALYTICS & TRACKING
// ============================================================================

/**
 * Track beta application event
 */
export function trackBetaEvent(
  eventName: string,
  properties?: Record<string, any>
): void {
  try {
    // This would integrate with your analytics service
    console.log('Beta event:', eventName, properties);
    
    // Example: analytics.track(eventName, properties);
  } catch (error) {
    console.warn('Failed to track beta event:', error);
  }
}

