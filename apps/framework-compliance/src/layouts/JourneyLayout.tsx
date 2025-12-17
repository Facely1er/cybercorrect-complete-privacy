import React, { ReactNode } from 'react';
import JourneyProgressTracker from '../components/onboarding/JourneyProgressTracker';

interface JourneyLayoutProps {
  children: ReactNode;
  variant?: 'default' | 'compact';
  showProgress?: boolean;
}

/**
 * JourneyLayout - Wrapper component that adds journey progress tracking to pages
 * 
 * This layout ensures users always see their journey progress across key pages,
 * maintaining context about where they are in the compliance journey.
 * 
 * @param children - The page content to render
 * @param variant - Display variant: 'default' (full) or 'compact' (minimal)
 * @param showProgress - Whether to show the progress tracker (default: true)
 */
export const JourneyLayout: React.FC<JourneyLayoutProps> = ({ 
  children, 
  variant = 'compact',
  showProgress = true 
}) => {
  return (
    <div className="space-y-6">
      {showProgress && <JourneyProgressTracker variant={variant} />}
      {children}
    </div>
  );
};

export default JourneyLayout;

