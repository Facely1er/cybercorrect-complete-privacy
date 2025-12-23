/**
 * Email Notification Service
 * 
 * Handles email notifications for beta applications, subscriptions, and user events.
 * Integrates with Supabase Edge Functions for production email delivery.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logError } from '../utils/common';

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface BetaApplicationEmail {
  name: string;
  email: string;
  organizationName: string;
  cohortName: string;
}

/**
 * Send beta application confirmation email
 */
export async function sendBetaApplicationConfirmation(
  data: BetaApplicationEmail
): Promise<{ success: boolean; error?: string }> {
  console.warn('[Email Service] Beta Application Confirmation:', {
    to: data.email,
    name: data.name,
    organization: data.organizationName
  });

  if (import.meta.env.DEV) {
    console.warn(`
📧 MOCK EMAIL: Beta Application Confirmation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${data.email}
Subject: Beta Application Received - Privacy Portal

Hi ${data.name},

Thank you for applying to the Privacy Portal beta program for ${data.organizationName}!

Your Application Details:
• Cohort: ${data.cohortName}
• Organization: ${data.organizationName}

What's Next:
✓ We'll review your application within 2-3 business days
✓ You'll receive an email when your application is reviewed
✓ If accepted, we'll send onboarding instructions and beta access

Questions? Reply to this email.

Best regards,
The CyberCorrect Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }

  // Attempt to send via Supabase Edge Function if configured
  if (isSupabaseConfigured()) {
    try {
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: {
          template: 'beta-application-confirmation',
          to: data.email,
          data: {
            name: data.name,
            organizationName: data.organizationName,
            cohortName: data.cohortName,
          },
        },
      });

      if (error) {
        logError(new Error(`Email service error: ${error.message}`), {
          context: 'email_beta_confirmation',
          email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        });
        // Fall through to return success in dev mode
        if (import.meta.env.PROD) {
          return { success: false, error: error.message };
        }
      }

      if (result?.success) {
        return { success: true };
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Email service failed'), {
        context: 'email_beta_confirmation',
      });
      // In production, return error; in dev, continue with mock
      if (import.meta.env.PROD) {
        return { success: false, error: 'Failed to send email' };
      }
    }
  }

  return { success: true };
}

/**
 * Send beta application acceptance email
 */
export async function sendBetaApplicationAcceptance(
  data: BetaApplicationEmail & { onboardingLink: string }
): Promise<{ success: boolean; error?: string }> {
  console.warn('[Email Service] Beta Application Acceptance:', {
    to: data.email,
    name: data.name
  });

  if (import.meta.env.DEV) {
    console.warn(`
📧 MOCK EMAIL: Beta Application Accepted
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${data.email}
Subject: Welcome to Privacy Portal Beta! 🎉

Hi ${data.name},

Congratulations! ${data.organizationName} has been accepted into the Privacy Portal beta program!

Your Beta Details:
• Cohort: ${data.cohortName}
• Beta Pricing: $99/mo (locked in forever - 50% off $199/mo)
• Access: Immediate

Next Steps:
1. Complete onboarding: ${data.onboardingLink}
2. Invite your team members (${data.cohortName} stakeholders)
3. Join our beta Slack channel for updates
4. Schedule your kickoff call

What You'll Get:
✓ Direct founder access
✓ Influence product roadmap
✓ VIP support
✓ Lifetime beta pricing
✓ Early access to white-label features

Looking forward to building together!

Best regards,
The CyberCorrect Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }

  // Attempt to send via Supabase Edge Function if configured
  if (isSupabaseConfigured()) {
    try {
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: {
          template: 'beta-application-acceptance',
          to: data.email,
          data: {
            name: data.name,
            organizationName: data.organizationName,
            cohortName: data.cohortName,
            onboardingLink: data.onboardingLink,
          },
        },
      });

      if (error) {
        logError(new Error(`Email service error: ${error.message}`), {
          context: 'email_beta_acceptance',
          email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        });
        if (import.meta.env.PROD) {
          return { success: false, error: error.message };
        }
      }

      if (result?.success) {
        return { success: true };
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Email service failed'), {
        context: 'email_beta_acceptance',
      });
      if (import.meta.env.PROD) {
        return { success: false, error: 'Failed to send email' };
      }
    }
  }

  return { success: true };
}

/**
 * Send beta application rejection email (with waitlist offer)
 */
export async function sendBetaApplicationRejection(
  data: BetaApplicationEmail & { reason?: string }
): Promise<{ success: boolean; error?: string }> {
  console.warn('[Email Service] Beta Application Rejection:', {
    to: data.email,
    name: data.name
  });

  if (import.meta.env.DEV) {
    console.warn(`
📧 MOCK EMAIL: Beta Application - Waitlist
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${data.email}
Subject: Privacy Portal Beta - Waitlist Update

Hi ${data.name},

Thank you for your interest in the Privacy Portal beta for ${data.organizationName}.

Unfortunately, the ${data.cohortName} cohort has reached capacity (25 organizations).

Good News:
✓ You've been added to our priority waitlist
✓ You'll be first to know when spots open
✓ Beta pricing ($99/mo) will still be honored

Alternative:
• Join a different cohort (if applicable)
• Wait for next beta cycle (Q2 2025)
• Get early access to Portal when it launches publicly

We'll keep you updated on your waitlist status.

Best regards,
The CyberCorrect Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }

  // Attempt to send via Supabase Edge Function if configured
  if (isSupabaseConfigured()) {
    try {
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: {
          template: 'beta-application-rejection',
          to: data.email,
          data: {
            name: data.name,
            organizationName: data.organizationName,
            cohortName: data.cohortName,
            reason: data.reason,
          },
        },
      });

      if (error) {
        logError(new Error(`Email service error: ${error.message}`), {
          context: 'email_beta_rejection',
          email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        });
        if (import.meta.env.PROD) {
          return { success: false, error: error.message };
        }
      }

      if (result?.success) {
        return { success: true };
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Email service failed'), {
        context: 'email_beta_rejection',
      });
      if (import.meta.env.PROD) {
        return { success: false, error: 'Failed to send email' };
      }
    }
  }

  return { success: true };
}

/**
 * Send assessment completion email
 */
export async function sendAssessmentCompleteEmail(
  email: string,
  name: string,
  assessmentType: string,
  resultsLink: string
): Promise<{ success: boolean; error?: string }> {
  console.warn('[Email Service] Assessment Complete:', { email, assessmentType });

  if (import.meta.env.DEV) {
    console.warn(`
📧 MOCK EMAIL: Assessment Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${email}
Subject: Your ${assessmentType} Assessment Results

Hi ${name},

Great job completing your ${assessmentType} assessment!

View Your Results: ${resultsLink}

Your results include:
✓ Compliance score and maturity level
✓ Gap analysis by domain
✓ Priority recommendations
✓ Implementation roadmap

Next Steps:
• Review your personalized recommendations
• Export your results (PDF/Excel)
• Start addressing high-priority gaps
• Consider upgrading for advanced features

Questions? We're here to help!

Best regards,
The CyberCorrect Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }

  // Attempt to send via Supabase Edge Function if configured
  if (isSupabaseConfigured()) {
    try {
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: {
          template: 'assessment-complete',
          to: email,
          data: {
            name,
            assessmentType,
            resultsLink,
          },
        },
      });

      if (error) {
        logError(new Error(`Email service error: ${error.message}`), {
          context: 'email_assessment_complete',
          email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        });
        if (import.meta.env.PROD) {
          return { success: false, error: error.message };
        }
      }

      if (result?.success) {
        return { success: true };
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Email service failed'), {
        context: 'email_assessment_complete',
      });
      if (import.meta.env.PROD) {
        return { success: false, error: 'Failed to send email' };
      }
    }
  }

  return { success: true };
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmation(
  email: string,
  name: string,
  tier: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  console.warn('[Email Service] Subscription Confirmation:', { email, tier });

  if (import.meta.env.DEV) {
    console.warn(`
📧 MOCK EMAIL: Subscription Confirmation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${email}
Subject: Welcome to CyberCorrect ${tier}! 🎉

Hi ${name},

Your subscription is now active!

Plan Details:
• Tier: ${tier}
• Amount: $${(amount / 100).toFixed(2)}/month
• Billing Date: ${new Date().toLocaleDateString()}

What You Get:
✓ All ${tier} features unlocked
✓ Priority support
✓ Unlimited assessments
✓ Advanced analytics

Get Started:
1. Complete your first assessment
2. Explore compliance tools
3. Set up your dashboard
4. Invite team members

Need help? Check out our knowledge base or contact support.

Best regards,
The CyberCorrect Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }

  // Attempt to send via Supabase Edge Function if configured
  if (isSupabaseConfigured()) {
    try {
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: {
          template: 'subscription-confirmation',
          to: email,
          data: {
            name,
            tier,
            amount: (amount / 100).toFixed(2),
            billingDate: new Date().toLocaleDateString(),
          },
        },
      });

      if (error) {
        logError(new Error(`Email service error: ${error.message}`), {
          context: 'email_subscription_confirmation',
          email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        });
        if (import.meta.env.PROD) {
          return { success: false, error: error.message };
        }
      }

      if (result?.success) {
        return { success: true };
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Email service failed'), {
        context: 'email_subscription_confirmation',
      });
      if (import.meta.env.PROD) {
        return { success: false, error: 'Failed to send email' };
      }
    }
  }

  return { success: true };
}

/**
 * Send trial expiring reminder
 */
export async function sendTrialExpiringReminder(
  email: string,
  name: string,
  daysRemaining: number
): Promise<{ success: boolean; error?: string }> {
  console.warn('[Email Service] Trial Expiring:', { email, daysRemaining });

  if (import.meta.env.DEV) {
    console.warn(`
📧 MOCK EMAIL: Trial Expiring Reminder
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: ${email}
Subject: Your trial expires in ${daysRemaining} days ⏰

Hi ${name},

Your CyberCorrect trial ends in ${daysRemaining} days.

Don't Lose Access To:
• Your assessment results
• Compliance tools
• Custom reports
• Dashboard analytics

Continue Your Journey:
• Upgrade to Starter: $29/mo
• Upgrade to Professional: $99/mo
• Get Enterprise pricing

[Upgrade Now] Button

Questions? We're here to help you choose the right plan.

Best regards,
The CyberCorrect Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }

  // Attempt to send via Supabase Edge Function if configured
  if (isSupabaseConfigured()) {
    try {
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: {
          template: 'trial-expiring-reminder',
          to: email,
          data: {
            name,
            daysRemaining,
          },
        },
      });

      if (error) {
        logError(new Error(`Email service error: ${error.message}`), {
          context: 'email_trial_expiring',
          email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        });
        if (import.meta.env.PROD) {
          return { success: false, error: error.message };
        }
      }

      if (result?.success) {
        return { success: true };
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Email service failed'), {
        context: 'email_trial_expiring',
      });
      if (import.meta.env.PROD) {
        return { success: false, error: 'Failed to send email' };
      }
    }
  }

  return { success: true };
}

/**
 * Check if email service is configured
 */
export function isEmailServiceConfigured(): boolean {
  return !!(
    import.meta.env.SENDGRID_API_KEY ||
    import.meta.env.RESEND_API_KEY ||
    import.meta.env.EMAIL_SERVICE
  );
}

