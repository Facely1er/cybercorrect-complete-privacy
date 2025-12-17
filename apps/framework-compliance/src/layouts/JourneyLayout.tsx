import React, { ReactNode } from 'react';
import JourneyProgressTracker from '../components/onboarding/JourneyProgressTracker';
import { useJourney } from '../context/JourneyContext';

interface JourneyLayoutProps {
  children: ReactNode;
  showProgress?: boolean;
}

/**
 * JourneyLayout - Wrapper component that adds journey progress tracking to pages
 * 
 * This layout ensures users always see their journey progress across key pages,
 * maintaining context about where they are in the compliance journey.
 * 
 * @param children - The page content to render
 * @param showProgress - Whether to show the progress tracker (default: true)
 */
export const JourneyLayout: React.FC<JourneyLayoutProps> = ({ 
  children, 
  showProgress = true 
}) => {
  const { currentStepIndex, completedSteps } = useJourney();
  
  return (
    <div className="space-y-6">
      {showProgress && (
        <JourneyProgressTracker 
          currentStepIndex={currentStepIndex}
          completedSteps={completedSteps}
        />
      )}
      {children}
    </div>
  );
};

export default JourneyLayout;

