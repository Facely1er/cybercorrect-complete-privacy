/**
 * Journey Analytics and Metrics Tracking
 * 
 * Tracks user progress through the compliance journey for insights and optimization.
 */

import { JOURNEY_ANALYTICS } from '../config/journeyThresholds';
import { GapDomain } from './gapJourneyConfig';

export interface JourneyMetrics {
  // Journey timing
  startedAt?: string;
  lastActiveAt: string;
  totalTimeSpent: number; // in milliseconds
  timePerStep: Record<string, number>;
  
  // Progress metrics
  stepsCompleted: number;
  gapsAddressed: number;
  toolsCompleted: number;
  toolsAttempted: number;
  
  // Domain-specific metrics
  domainProgress: Record<GapDomain, {
    gapsIdentified: number;
    gapsClosed: number;
    toolsUsed: number;
    timeSpent: number;
  }>;
  
  // Engagement metrics
  sessionCount: number;
  averageSessionDuration: number;
  lastSessionDuration: number;
  daysActive: number;
  
  // Completion metrics
  completionRate: number;
  estimatedTimeToCompletion?: number;
  dropOffPoint?: string;
}

export interface ToolUsageMetric {
  toolId: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  completed: boolean;
}

export interface SessionMetric {
  sessionId: string;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  stepsVisited: string[];
  toolsUsed: string[];
  actionsPerformed: number;
}

const ANALYTICS_STORAGE_KEY = 'cybercorrect_journey_analytics';
const SESSION_STORAGE_KEY = 'cybercorrect_current_session';

/**
 * Initialize or load journey analytics
 */
export function initializeAnalytics(): JourneyMetrics {
  try {
    const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading analytics:', error);
  }

  // Initialize new metrics
  const metrics: JourneyMetrics = {
    startedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    totalTimeSpent: 0,
    timePerStep: {},
    stepsCompleted: 0,
    gapsAddressed: 0,
    toolsCompleted: 0,
    toolsAttempted: 0,
    domainProgress: {
      govern: { gapsIdentified: 0, gapsClosed: 0, toolsUsed: 0, timeSpent: 0 },
      identify: { gapsIdentified: 0, gapsClosed: 0, toolsUsed: 0, timeSpent: 0 },
      control: { gapsIdentified: 0, gapsClosed: 0, toolsUsed: 0, timeSpent: 0 },
      communicate: { gapsIdentified: 0, gapsClosed: 0, toolsUsed: 0, timeSpent: 0 },
      protect: { gapsIdentified: 0, gapsClosed: 0, toolsUsed: 0, timeSpent: 0 },
    },
    sessionCount: 0,
    averageSessionDuration: 0,
    lastSessionDuration: 0,
    daysActive: 1,
    completionRate: 0,
  };

  saveAnalytics(metrics);
  return metrics;
}

/**
 * Save analytics to localStorage
 */
export function saveAnalytics(metrics: JourneyMetrics): void {
  if (!JOURNEY_ANALYTICS.ENABLED) return;

  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(metrics));
  } catch (error) {
    console.error('Error saving analytics:', error);
  }
}

/**
 * Start a new session
 */
export function startSession(): SessionMetric {
  const session: SessionMetric = {
    sessionId: `session_${Date.now()}`,
    startedAt: new Date().toISOString(),
    stepsVisited: [],
    toolsUsed: [],
    actionsPerformed: 0,
  };

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error starting session:', error);
  }

  return session;
}

/**
 * Get current session or start new one
 */
export function getCurrentSession(): SessionMetric {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading session:', error);
  }

  return startSession();
}

/**
 * Update current session
 */
export function updateSession(updates: Partial<SessionMetric>): void {
  const session = getCurrentSession();
  const updated = { ...session, ...updates };
  
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating session:', error);
  }
}

/**
 * End current session and update metrics
 */
export function endSession(): void {
  const session = getCurrentSession();
  const endedAt = new Date().toISOString();
  const duration = new Date(endedAt).getTime() - new Date(session.startedAt).getTime();

  // Update journey metrics
  const metrics = initializeAnalytics();
  metrics.sessionCount += 1;
  metrics.lastSessionDuration = duration;
  metrics.totalTimeSpent += duration;
  metrics.averageSessionDuration = metrics.totalTimeSpent / metrics.sessionCount;
  metrics.lastActiveAt = endedAt;

  saveAnalytics(metrics);

  // Clear session
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

/**
 * Track step visit
 */
export function trackStepVisit(stepKey: string): void {
  if (!JOURNEY_ANALYTICS.TRACK_TIME_PER_STEP) return;

  const session = getCurrentSession();
  if (!session.stepsVisited.includes(stepKey)) {
    session.stepsVisited.push(stepKey);
    updateSession(session);
  }
}

/**
 * Track step completion
 */
export function trackStepCompletion(stepKey: string, duration: number): void {
  if (!JOURNEY_ANALYTICS.TRACK_TIME_PER_STEP) return;

  const metrics = initializeAnalytics();
  metrics.stepsCompleted += 1;
  metrics.timePerStep[stepKey] = (metrics.timePerStep[stepKey] || 0) + duration;
  
  saveAnalytics(metrics);
}

/**
 * Track tool usage
 */
export function trackToolStarted(toolId: string, domain: GapDomain | null): void {
  if (!JOURNEY_ANALYTICS.TRACK_TOOL_USAGE) return;

  const session = getCurrentSession();
  if (!session.toolsUsed.includes(toolId)) {
    session.toolsUsed.push(toolId);
    updateSession(session);
  }

  const metrics = initializeAnalytics();
  metrics.toolsAttempted += 1;

  if (domain) {
    metrics.domainProgress[domain].toolsUsed += 1;
  }

  saveAnalytics(metrics);
}

/**
 * Track tool completion
 */
export function trackToolCompleted(_toolId: string, domain: GapDomain | null, duration: number): void {
  if (!JOURNEY_ANALYTICS.TRACK_TOOL_USAGE) return;

  const metrics = initializeAnalytics();
  metrics.toolsCompleted += 1;

  if (domain) {
    metrics.domainProgress[domain].timeSpent += duration;
  }

  saveAnalytics(metrics);
}

/**
 * Track gap closure
 */
export function trackGapClosed(domain: GapDomain): void {
  const metrics = initializeAnalytics();
  metrics.gapsAddressed += 1;
  metrics.domainProgress[domain].gapsClosed += 1;

  saveAnalytics(metrics);
}

/**
 * Track action performed
 * @param actionType - Type of action (reserved for future use)
 */
export function trackAction(actionType?: string): void {
  const session = getCurrentSession();
  session.actionsPerformed += 1;
  updateSession(session);
  
  // actionType reserved for future detailed action tracking
  if (actionType) {
    // Future: Track specific action types
  }
}

/**
 * Calculate completion rate
 */
export function calculateCompletionRate(totalSteps: number, completedSteps: number): number {
  if (totalSteps === 0) return 0;
  return Math.round((completedSteps / totalSteps) * 100);
}

/**
 * Estimate time to completion based on current progress
 */
export function estimateTimeToCompletion(
  totalSteps: number,
  completedSteps: number,
  timeSpentSoFar: number
): number {
  if (completedSteps === 0) return 0;
  
  const averageTimePerStep = timeSpentSoFar / completedSteps;
  const remainingSteps = totalSteps - completedSteps;
  
  return Math.round(averageTimePerStep * remainingSteps);
}

/**
 * Get journey insights
 */
export function getJourneyInsights(): {
  mostUsedTools: string[];
  fastestCompletedSteps: string[];
  slowestCompletedSteps: string[];
  mostProductiveDomain: GapDomain | null;
  averageToolCompletionTime: number;
} {
  const metrics = initializeAnalytics();

  // Most productive domain (most gaps closed)
  let mostProductiveDomain: GapDomain | null = null;
  let maxGapsClosed = 0;

  Object.entries(metrics.domainProgress).forEach(([domain, progress]) => {
    if (progress.gapsClosed > maxGapsClosed) {
      maxGapsClosed = progress.gapsClosed;
      mostProductiveDomain = domain as GapDomain;
    }
  });

  // Sort steps by completion time
  const stepTimes = Object.entries(metrics.timePerStep);
  const fastestSteps = stepTimes.sort((a, b) => a[1] - b[1]).slice(0, 3).map(([step]) => step);
  const slowestSteps = stepTimes.sort((a, b) => b[1] - a[1]).slice(0, 3).map(([step]) => step);

  // Average tool completion time
  const averageToolTime = metrics.toolsCompleted > 0
    ? Object.values(metrics.domainProgress).reduce((sum, d) => sum + d.timeSpent, 0) / metrics.toolsCompleted
    : 0;

  return {
    mostUsedTools: [], // Would need to track individual tool usage
    fastestCompletedSteps: fastestSteps,
    slowestCompletedSteps: slowestSteps,
    mostProductiveDomain,
    averageToolCompletionTime: averageToolTime,
  };
}

/**
 * Export analytics data
 */
export function exportAnalytics(): string {
  const metrics = initializeAnalytics();
  return JSON.stringify({
    version: '1.0',
    exportedAt: new Date().toISOString(),
    metrics,
  }, null, 2);
}

/**
 * Clear all analytics data
 */
export function clearAnalytics(): void {
  try {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing analytics:', error);
  }
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

