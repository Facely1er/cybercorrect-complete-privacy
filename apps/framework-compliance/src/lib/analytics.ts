// Analytics initialization and utilities
import { track, page, identify } from '@vercel/analytics';
import { env } from './env';

// Initialize analytics only if enabled and ID is provided
export const initAnalytics = () => {
  try {
    const isEnabled = env.VITE_ENABLE_ANALYTICS === 'true';
    const analyticsId = env.VITE_ANALYTICS_ID;
    
    if (!isEnabled) {
      console.log('Analytics disabled');
      return null;
    }

    if (!analyticsId) {
      console.log('Analytics ID not provided');
      return null;
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
    return null;
  }
};

// Analytics utility functions
export const analytics = {
  trackEvent: (event: string, properties?: Record<string, unknown>) => {
    try {
      track(event, properties);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  },

  trackPageView: (pageName: string, properties?: Record<string, unknown>) => {
    try {
      page(pageName, properties);
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  },

  identifyUser: (userId: string | null, traits?: Record<string, unknown>) => {
    try {
      identify(userId, traits);
    } catch (error) {
      console.error('Failed to identify user:', error);
    }
  },

  trackConversion: (event: string, properties?: Record<string, unknown>) => {
    try {
      track(event, { ...properties, event_type: 'conversion' });
    } catch (error) {
      console.error('Failed to track conversion:', error);
    }
  },

  trackError: (errorEvent: string, properties?: Record<string, unknown>) => {
    try {
      track(errorEvent, { ...properties, event_type: 'error' });
    } catch (error) {
      console.error('Failed to track error:', error);
    }
  },

  trackPerformance: (metric: string, properties?: Record<string, unknown>) => {
    try {
      track(metric, { ...properties, event_type: 'performance' });
    } catch (error) {
      console.error('Failed to track performance:', error);
    }
  },

  trackFeatureUsage: (feature: string, properties?: Record<string, unknown>) => {
    try {
      track(feature, { ...properties, event_type: 'feature_usage' });
    } catch (error) {
      console.error('Failed to track feature usage:', error);
    }
  }
};