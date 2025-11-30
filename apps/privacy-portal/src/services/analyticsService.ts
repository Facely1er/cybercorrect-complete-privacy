// Analytics service for user behavior tracking
import { appConfig } from '../config/environment';

interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  customDimensions?: Record<string, string | number>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

interface PageView {
  path: string;
  title: string;
  referrer?: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

class AnalyticsService {
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean;
  private eventQueue: AnalyticsEvent[] = [];
  private pageViewQueue: PageView[] = [];
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = appConfig.analytics.enabled && !!appConfig.analytics.id;
    this.loadUserId();
    this.startBatchFlush();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadUserId(): void {
    try {
      const stored = localStorage.getItem('analytics_user_id');
      if (stored) {
        this.userId = stored;
      }
    } catch (error) {
      console.warn('Failed to load user ID from localStorage:', error);
    }
  }

  private setUserId(userId: string): void {
    this.userId = userId;
    try {
      localStorage.setItem('analytics_user_id', userId);
    } catch (error) {
      console.warn('Failed to save user ID to localStorage:', error);
    }
  }

  private startBatchFlush(): void {
    if (!this.isEnabled) return;

    this.flushTimer = setInterval(() => {
      this.flushEvents();
    }, this.flushInterval);
  }

  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0 && this.pageViewQueue.length === 0) return;

    try {
      // Send events in batches
      if (this.eventQueue.length > 0) {
        const eventsToSend = this.eventQueue.splice(0, this.batchSize);
        await this.sendEvents(eventsToSend);
      }

      // Send page views
      if (this.pageViewQueue.length > 0) {
        const pageViewsToSend = this.pageViewQueue.splice(0, this.batchSize);
        await this.sendPageViews(pageViewsToSend);
      }
    } catch {
      console.warn('Failed to flush analytics events');
      // Re-queue events on failure
      this.eventQueue.unshift(...this.eventQueue);
    }
  }

  private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
    if (!this.isEnabled) return;

    try {
      // Send to analytics endpoint (Google Analytics, Mixpanel, etc.)
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          sessionId: this.sessionId,
          userId: this.userId,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }
    } catch {
      // Fallback to Google Analytics if available
      this.sendToGoogleAnalytics(events);
    }
  }

  private async sendPageViews(pageViews: PageView[]): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const response = await fetch('/api/analytics/pageviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageViews,
          sessionId: this.sessionId,
          userId: this.userId,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }
    } catch {
      // Fallback to Google Analytics if available
      this.sendPageViewsToGoogleAnalytics(pageViews);
    }
  }

  private sendToGoogleAnalytics(events: AnalyticsEvent[]): void {
    if (typeof window === 'undefined' || !window.gtag) return;

    events.forEach(event => {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_map: event.customDimensions
      });
    });
  }

  private sendPageViewsToGoogleAnalytics(pageViews: PageView[]): void {
    if (typeof window === 'undefined' || !window.gtag) return;

    pageViews.forEach(pageView => {
      window.gtag('config', appConfig.analytics.id, {
        page_title: pageView.title,
        page_location: pageView.path
      });
    });
  }

  // Public API methods
  trackEvent(name: string, category: string, action: string, label?: string, value?: number, customDimensions?: Record<string, string | number>): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name,
      category,
      action,
      label,
      value,
      customDimensions,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.eventQueue.push(event);

    // Send immediately if batch is full
    if (this.eventQueue.length >= this.batchSize) {
      this.flushEvents();
    }
  }

  trackPageView(path: string, title: string, referrer?: string): void {
    if (!this.isEnabled) return;

    const pageView: PageView = {
      path,
      title,
      referrer,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.pageViewQueue.push(pageView);

    // Send page views immediately
    this.flushEvents();
  }

  trackUserAction(action: string, details?: Record<string, unknown>): void {
    this.trackEvent('user_action', 'engagement', action, undefined, undefined, details as Record<string, string | number>);
  }

  trackFormSubmission(formName: string, success: boolean): void {
    this.trackEvent('form_submission', 'engagement', success ? 'success' : 'error', formName);
  }

  trackDataRightsRequest(requestType: string, status: string): void {
    this.trackEvent('data_rights_request', 'privacy', requestType, status);
  }

  trackPrivacyIncident(incidentType: string, severity: string): void {
    this.trackEvent('privacy_incident', 'security', incidentType, severity);
  }

  trackComplianceEvent(eventType: string, regulation: string): void {
    this.trackEvent('compliance_event', 'compliance', eventType, regulation);
  }

  setUser(userId: string, userProperties?: Record<string, string | number>): void {
    this.setUserId(userId);
    
    if (userProperties) {
      this.trackEvent('user_identified', 'user', 'identification', undefined, undefined, userProperties);
    }
  }

  clearUser(): void {
    this.userId = undefined;
    try {
      localStorage.removeItem('analytics_user_id');
    } catch (error) {
      console.warn('Failed to clear user ID from localStorage:', error);
    }
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.trackEvent('performance', 'performance', metric, unit, value);
  }

  trackError(error: Error, context?: string): void {
    this.trackEvent('error', 'error', error.name, context, undefined, {
      error_message: error.message,
      error_stack: error.stack?.substring(0, 500) || ''
    });
  }

  // Cleanup
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushEvents(); // Flush remaining events
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

// Export types for external use
export type { AnalyticsEvent, PageView };