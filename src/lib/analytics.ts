// Analytics initialization
import { Analytics } from '@vercel/analytics/react';
import { env } from './env';

// Initialize analytics only if enabled and ID is provided
export const initAnalytics = () => {
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

  return Analytics;
};

export { Analytics };