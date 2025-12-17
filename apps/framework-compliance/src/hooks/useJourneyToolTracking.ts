/**
 * Simplified hook for journey tool tracking
 * 
 * Use this hook when you don't need the full JourneyToolWrapper UI
 * but still want to track tool completion in the journey system.
 */

import { useJourneyTool } from './useJourneyTool';
import { useJourney } from '../context/JourneyContext';

export const useJourneyToolTracking = (toolId: string) => {
  const { markCompleted } = useJourneyTool(toolId);
  const { isToolCompleted } = useJourney();
  
  const isCompleted = isToolCompleted(toolId);

  return {
    isCompleted,
    markCompleted,
  };
};

export default useJourneyToolTracking;

