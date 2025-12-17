/**
 * Journey Configuration Constants
 * 
 * Centralized configuration for all journey thresholds, settings, and validation rules.
 * Update these values to adjust journey behavior across the application.
 */

/**
 * Journey completion thresholds
 */
export const JOURNEY_THRESHOLDS = {
  /**
   * Percentage of gaps that must be completed to advance to Maintain phase
   * @default 70
   */
  GAP_COMPLETION_PERCENTAGE: 70,

  /**
   * Minimum number of tools that must be completed for journey completion
   * @default 5
   */
  MINIMUM_TOOLS_COMPLETED: 5,

  /**
   * Percentage of domain tools needed to mark a gap as "in progress"
   * @default 50
   */
  TOOL_PROGRESS_THRESHOLD: 50,

  /**
   * Percentage of domain tools needed to mark a gap as completed
   * @default 100
   */
  GAP_COMPLETION_TOOL_THRESHOLD: 100,

  /**
   * Assessment score threshold below which a gap is identified
   * @default 80
   */
  GAP_IDENTIFICATION_THRESHOLD: 80,
} as const;

/**
 * Journey auto-advancement settings
 */
export const JOURNEY_ADVANCEMENT = {
  /**
   * Whether to automatically advance to next step when current step is completed
   * @default true
   */
  AUTO_ADVANCE_ENABLED: true,

  /**
   * Whether to show celebration notifications on journey milestones
   * @default true
   */
  SHOW_MILESTONE_NOTIFICATIONS: true,

  /**
   * Whether to show gap closure notifications when gaps are completed
   * @default true
   */
  SHOW_GAP_CLOSURE_NOTIFICATIONS: true,
} as const;

/**
 * Journey validation rules
 */
export const JOURNEY_VALIDATION = {
  /**
   * Whether to validate journey state on mount
   * @default true
   */
  VALIDATE_ON_MOUNT: true,

  /**
   * Whether to attempt automatic recovery from corrupted state
   * @default true
   */
  AUTO_RECOVER_ERRORS: true,

  /**
   * Whether to show detailed error messages to users
   * @default false (only in development)
   */
  SHOW_DETAILED_ERRORS: process.env.NODE_ENV === 'development',

  /**
   * Maximum age of stored journey data before considering it stale (in days)
   * @default 90
   */
  MAX_JOURNEY_AGE_DAYS: 90,
} as const;

/**
 * Journey storage keys
 */
export const JOURNEY_STORAGE_KEYS = {
  CURRENT_STEP: 'cybercorrect_journey_step',
  COMPLETED_STEPS: 'cybercorrect_completed_steps',
  VISITED: 'cybercorrect_visited',
  ASSESSMENT_COMPLETED: 'cybercorrect_assessment_completed',
  IDENTIFIED_GAPS: 'cybercorrect_identified_gaps',
  COMPLETED_GAPS: 'cybercorrect_completed_gaps',
  ASSESSMENT_RESULTS: 'cybercorrect_assessment_results',
  COMPLETED_TOOLS: 'cybercorrect_completed_tools',
  TOOL_USAGE_HISTORY: 'cybercorrect_tool_usage_history',
  JOURNEY_STARTED_AT: 'cybercorrect_journey_started_at',
  LAST_UPDATED_AT: 'cybercorrect_journey_last_updated',
  VERSION: 'cybercorrect_journey_version',
} as const;

/**
 * Journey version for data migration
 */
export const JOURNEY_VERSION = '1.0.0';

/**
 * Journey milestones and their notification messages
 */
export const JOURNEY_MILESTONES = [
  {
    threshold: 25,
    title: 'Great Start!',
    message: "You're 25% through your compliance journey. Keep going!",
    icon: '🎯',
  },
  {
    threshold: 50,
    title: 'Halfway There!',
    message: 'Amazing progress! You\'ve completed half of your journey.',
    icon: '🚀',
  },
  {
    threshold: 75,
    title: 'Almost Done!',
    message: 'Excellent work! Just a few more steps to complete your journey.',
    icon: '⭐',
  },
  {
    threshold: 100,
    title: 'Journey Complete!',
    message: 'Congratulations! You\'ve completed your compliance journey. Welcome to maintenance mode.',
    icon: '🎉',
  },
] as const;

/**
 * Journey notification durations (in milliseconds)
 */
export const JOURNEY_NOTIFICATIONS = {
  /**
   * Duration for success notifications
   */
  SUCCESS_DURATION: 4000,

  /**
   * Duration for milestone celebrations
   */
  MILESTONE_DURATION: 7000,

  /**
   * Duration for gap closure notifications
   */
  GAP_CLOSURE_DURATION: 5000,

  /**
   * Duration for error notifications
   */
  ERROR_DURATION: 6000,
} as const;

/**
 * Journey analytics settings
 */
export const JOURNEY_ANALYTICS = {
  /**
   * Whether to track journey analytics
   * @default true
   */
  ENABLED: true,

  /**
   * Interval for saving analytics data (in milliseconds)
   * @default 30000 (30 seconds)
   */
  SAVE_INTERVAL: 30000,

  /**
   * Whether to track time spent per step
   * @default true
   */
  TRACK_TIME_PER_STEP: true,

  /**
   * Whether to track tool usage patterns
   * @default true
   */
  TRACK_TOOL_USAGE: true,
} as const;

