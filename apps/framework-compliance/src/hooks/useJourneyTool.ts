/**
 * Hook for tool pages to automatically track journey progress
 * 
 * Usage:
 * ```tsx
 * const MyTool = () => {
 *   const { markCompleted } = useJourneyTool('my-tool-id');
 *   
 *   const handleSave = () => {
 *     // ... save logic
 *     markCompleted(); // Mark tool as completed
 *   };
 *   
 *   return <div>...</div>;
 * };
 * ```
 */

import { useEffect } from 'react';
import { useJourney } from '../context/JourneyContext';

/**
 * Hook that automatically marks a tool as started when component mounts
 * and provides a function to mark it as completed
 */
export const useJourneyTool = (toolId: string) => {
  const { markToolStarted, markToolCompleted } = useJourney();

  useEffect(() => {
    markToolStarted(toolId);
  }, [markToolStarted, toolId]);

  const markCompleted = () => {
    markToolCompleted(toolId);
  };

  return { markCompleted };
};

