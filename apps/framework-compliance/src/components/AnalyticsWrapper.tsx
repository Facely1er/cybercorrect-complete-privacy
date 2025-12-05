import React from 'react';
import { env } from '../lib/env';

// Lazy load Analytics to prevent potential initialization errors
const Analytics = React.lazy(() => 
  import('@vercel/analytics/react')
    .then(module => ({ default: module.Analytics }))
    .catch(error => {
      console.error('Failed to load Analytics:', error);
      // Return a no-op component as fallback
      return { default: () => null };
    })
);

interface AnalyticsWrapperProps {
  children?: React.ReactNode;
}

// Safe Analytics wrapper to prevent undefined property access errors
const AnalyticsWrapper: React.FC<AnalyticsWrapperProps> = ({ children }) => {
  // Only render analytics if both conditions are met
  const shouldRenderAnalytics = React.useMemo(() => {
    try {
      return env.VITE_ENABLE_ANALYTICS === 'true' && 
             env.VITE_ANALYTICS_ID && 
             env.VITE_ANALYTICS_ID.trim() !== '';
    } catch (error) {
      console.error('Error checking analytics configuration:', error);
      return false;
    }
  }, []);

  if (!shouldRenderAnalytics) {
    return children ? <>{children}</> : null;
  }

  try {
    return (
      <>
        {children}
        <React.Suspense fallback={null}>
          <Analytics />
        </React.Suspense>
      </>
    );
  } catch (error) {
    console.error('Analytics rendering error:', error);
    return children ? <>{children}</> : null;
  }
};

export default AnalyticsWrapper;