/**
 * Journey Tool Wrapper Component
 * 
 * Wrapper component that automatically integrates tools with the journey tracking system.
 * Provides consistent journey tracking across all compliance tools.
 */

import React, { ReactNode } from 'react';
import { useJourneyTool } from '../../hooks/useJourneyTool';
import { Card, CardContent } from '../ui/Card';
import { CheckCircle, Info } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { getToolDomain } from '../../utils/gapJourneyConfig';
import styles from './JourneyToolWrapper.module.css';

/**
 * Progress bar component that uses CSS module for dynamic width via CSS custom property
 */
const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
    <div
      className={styles.progressFill}
      ref={(el) => el?.style.setProperty('--progress-width', `${percentage}%`)}
    />
  </div>
);

export interface JourneyToolWrapperProps {
  toolId: string;
  toolName: string;
  toolDescription?: string;
  children: ReactNode | ((props: { handleComplete: () => void; isCompleted: boolean }) => ReactNode);
  showJourneyStatus?: boolean;
  onComplete?: () => void;
}

/**
 * Wraps a tool component and handles journey tracking automatically
 */
export const JourneyToolWrapper: React.FC<JourneyToolWrapperProps> = ({
  toolId,
  toolName,
  children,
  showJourneyStatus = true,
  onComplete,
}) => {
  const { markCompleted } = useJourneyTool(toolId);
  const { isToolCompleted, getGapCompletionPercentage, identifiedGaps } = useJourney();
  
  const isCompleted = isToolCompleted(toolId);
  const domain = getToolDomain(toolId);
  const gapCompletionPercentage = domain ? getGapCompletionPercentage(domain) : 0;
  
  // Find the gap associated with this tool
  const relatedGap = domain 
    ? identifiedGaps.find(gap => gap.domain === domain)
    : null;

  const handleComplete = () => {
    markCompleted();
    onComplete?.();
  };

  return (
    <div className="space-y-4">
      {/* Journey Status Banner */}
      {showJourneyStatus && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isCompleted ? (
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Info className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {isCompleted ? 'Tool Completed' : 'Journey Progress'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isCompleted 
                      ? `You've completed ${toolName}` 
                      : domain && relatedGap
                      ? `${relatedGap.domainTitle}: ${gapCompletionPercentage}% complete`
                      : 'Complete this tool to update your journey progress'}
                  </p>
                </div>
              </div>
              
              {!isCompleted && domain && relatedGap && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{gapCompletionPercentage}%</div>
                  <div className="text-xs text-muted-foreground">Gap Closed</div>
                </div>
              )}
            </div>

            {!isCompleted && domain && relatedGap && (
              <div className="mt-4">
                <ProgressBar percentage={gapCompletionPercentage} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tool Content */}
      <div className="journey-tool-content">
        {typeof children === 'function' 
          ? children({ handleComplete, isCompleted }) 
          : children}
      </div>
    </div>
  );
};

export default JourneyToolWrapper;

