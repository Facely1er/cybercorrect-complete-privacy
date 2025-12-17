import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { JOURNEY_STEPS } from '../components/onboarding/JourneyProgressTracker';
import {
  IdentifiedGap,
  GapJourneyProgress,
  calculateGapJourneyProgress,
  generateGapsFromAssessment,
  getToolDomain,
  shouldMarkGapCompleted,
  calculateGapCompletionFromTools,
  type GapDomain
} from '../utils/gapJourneyConfig';

// Type for assessment results input
interface AssessmentResultsInput {
  sectionScores: Array<{ title: string; percentage: number; completed: boolean }>;
  overallScore?: number;
  assessmentType?: string;
  frameworkName?: string;
  completedDate?: string;
}

interface ToolUsage {
  toolId: string;
  startedAt: string;
  completedAt?: string;
  domain: GapDomain | null;
}

export interface JourneyContextType {
  currentStepIndex: number;
  completedSteps: string[];
  hasCompletedAssessment: boolean;
  hasVisitedBefore: boolean;
  completeStep: (stepKey: string) => void;
  setCurrentStep: (stepIndex: number) => void;
  resetJourney: () => void;
  getProgress: () => number;
  
  // Gap-based journey tracking
  identifiedGaps: IdentifiedGap[];
  completedGapIds: string[];
  gapProgress: GapJourneyProgress | null;
  setAssessmentResults: (results: AssessmentResultsInput, preserveProgress?: boolean) => void;
  markGapStarted: (gapId: string) => void;
  markGapCompleted: (gapId: string) => void;
  getNextPriorityGap: () => IdentifiedGap | null;
  
  // Tool completion tracking
  completedToolIds: string[];
  toolUsageHistory: ToolUsage[];
  markToolStarted: (toolId: string) => void;
  markToolCompleted: (toolId: string) => void;
  isToolCompleted: (toolId: string) => boolean;
  getGapCompletionPercentage: (domain: GapDomain) => number;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

interface JourneyProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  CURRENT_STEP: 'cybercorrect_journey_step',
  COMPLETED_STEPS: 'cybercorrect_completed_steps',
  VISITED: 'cybercorrect_visited',
  ASSESSMENT_COMPLETED: 'cybercorrect_assessment_completed',
  IDENTIFIED_GAPS: 'cybercorrect_identified_gaps',
  COMPLETED_GAPS: 'cybercorrect_completed_gaps',
  ASSESSMENT_RESULTS: 'cybercorrect_assessment_results',
  COMPLETED_TOOLS: 'cybercorrect_completed_tools',
  TOOL_USAGE_HISTORY: 'cybercorrect_tool_usage_history'
};

export const JourneyProvider: React.FC<JourneyProviderProps> = ({ children }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  
  // Gap-based journey state
  const [identifiedGaps, setIdentifiedGaps] = useState<IdentifiedGap[]>([]);
  const [completedGapIds, setCompletedGapIds] = useState<string[]>([]);
  const [gapProgress, setGapProgress] = useState<GapJourneyProgress | null>(null);
  
  // Tool completion tracking
  const [completedToolIds, setCompletedToolIds] = useState<string[]>([]);
  const [toolUsageHistory, setToolUsageHistory] = useState<ToolUsage[]>([]);

  // Load journey state from localStorage on mount
  useEffect(() => {
    try {
      const visited = localStorage.getItem(STORAGE_KEYS.VISITED);
      const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      const savedCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED_STEPS);
      const assessmentCompleted = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_COMPLETED);
      const savedGaps = localStorage.getItem(STORAGE_KEYS.IDENTIFIED_GAPS);
      const savedCompletedGaps = localStorage.getItem(STORAGE_KEYS.COMPLETED_GAPS);
      const savedCompletedTools = localStorage.getItem(STORAGE_KEYS.COMPLETED_TOOLS);
      const savedToolUsageHistory = localStorage.getItem(STORAGE_KEYS.TOOL_USAGE_HISTORY);

      if (visited) {
        setHasVisitedBefore(true);
      }

      if (savedStep) {
        setCurrentStepIndex(parseInt(savedStep, 10));
      }

      if (savedCompleted) {
        setCompletedSteps(JSON.parse(savedCompleted));
      }

      if (assessmentCompleted) {
        setHasCompletedAssessment(true);
      }

      if (savedGaps) {
        const gaps = JSON.parse(savedGaps);
        setIdentifiedGaps(gaps);
      }

      if (savedCompletedGaps) {
        setCompletedGapIds(JSON.parse(savedCompletedGaps));
      }

      if (savedCompletedTools) {
        setCompletedToolIds(JSON.parse(savedCompletedTools));
      }

      if (savedToolUsageHistory) {
        setToolUsageHistory(JSON.parse(savedToolUsageHistory));
      }
    } catch (error) {
      console.error('Error loading journey state:', error);
    }
  }, []);

  // Save journey state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStepIndex.toString());
      localStorage.setItem(STORAGE_KEYS.COMPLETED_STEPS, JSON.stringify(completedSteps));
      localStorage.setItem(STORAGE_KEYS.IDENTIFIED_GAPS, JSON.stringify(identifiedGaps));
      localStorage.setItem(STORAGE_KEYS.COMPLETED_GAPS, JSON.stringify(completedGapIds));
      localStorage.setItem(STORAGE_KEYS.COMPLETED_TOOLS, JSON.stringify(completedToolIds));
      localStorage.setItem(STORAGE_KEYS.TOOL_USAGE_HISTORY, JSON.stringify(toolUsageHistory));
      
      if (hasVisitedBefore) {
        localStorage.setItem(STORAGE_KEYS.VISITED, 'true');
      }

      if (hasCompletedAssessment) {
        localStorage.setItem(STORAGE_KEYS.ASSESSMENT_COMPLETED, 'true');
      }
    } catch (error) {
      console.error('Error saving journey state:', error);
    }
  }, [currentStepIndex, completedSteps, hasVisitedBefore, hasCompletedAssessment, identifiedGaps, completedGapIds, completedToolIds, toolUsageHistory]);

  // Calculate gap progress whenever gaps or completed gaps change
  useEffect(() => {
    if (identifiedGaps.length > 0) {
      const progress = calculateGapJourneyProgress(identifiedGaps, completedGapIds);
      setGapProgress(progress);
    }
  }, [identifiedGaps, completedGapIds]);

  const completeStep = (stepKey: string) => {
    if (!completedSteps.includes(stepKey)) {
      const newCompletedSteps = [...completedSteps, stepKey];
      setCompletedSteps(newCompletedSteps);

      // Special handling for assessment completion
      if (stepKey === 'assess') {
        setHasCompletedAssessment(true);
      }

      // Auto-advance to next step if current step is completed
      const stepIndex = JOURNEY_STEPS.findIndex(s => s.key === stepKey);
      if (stepIndex === currentStepIndex && stepIndex < JOURNEY_STEPS.length - 1) {
        setCurrentStepIndex(stepIndex + 1);
      }
    }
  };

  const setCurrentStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < JOURNEY_STEPS.length) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const resetJourney = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setHasCompletedAssessment(false);
    setIdentifiedGaps([]);
    setCompletedGapIds([]);
    setGapProgress(null);
    setCompletedToolIds([]);
    setToolUsageHistory([]);
    
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_STEPS);
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_COMPLETED);
      localStorage.removeItem(STORAGE_KEYS.IDENTIFIED_GAPS);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_GAPS);
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_RESULTS);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_TOOLS);
      localStorage.removeItem(STORAGE_KEYS.TOOL_USAGE_HISTORY);
    } catch (error) {
      console.error('Error resetting journey state:', error);
    }
  };

  const getProgress = (): number => {
    return Math.round((completedSteps.length / JOURNEY_STEPS.length) * 100);
  };

  // Gap-based journey functions
  const setAssessmentResults = (results: AssessmentResultsInput, preserveProgress: boolean = false) => {
    try {
      // Generate gaps from assessment
      const gaps = generateGapsFromAssessment(results);
      
      if (preserveProgress && identifiedGaps.length > 0) {
        // Merge new gaps with existing progress
        const mergedGaps = gaps.map(newGap => {
          const existingGap = identifiedGaps.find(g => g.domain === newGap.domain);
          if (existingGap) {
            // Preserve status and update score
            return {
              ...newGap,
              status: existingGap.status,
              // If the score improved, keep tracking progress
            };
          }
          return newGap;
        });
        setIdentifiedGaps(mergedGaps);
      } else {
        setIdentifiedGaps(gaps);
      }
      
      // Save assessment results
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_RESULTS, JSON.stringify(results));
      
      // Auto-advance to step 2 (Discover)
      if (currentStepIndex === 0) {
        setCurrentStep(1);
        completeStep('assess');
      }
    } catch (error) {
      console.error('Error setting assessment results:', error);
    }
  };

  const markGapStarted = (gapId: string) => {
    setIdentifiedGaps(prev => 
      prev.map(gap => 
        gap.id === gapId ? { ...gap, status: 'in_progress' as const } : gap
      )
    );
  };

  const markGapCompleted = (gapId: string) => {
    setIdentifiedGaps(prev => 
      prev.map(gap => 
        gap.id === gapId ? { ...gap, status: 'completed' as const } : gap
      )
    );
    
    if (!completedGapIds.includes(gapId)) {
      setCompletedGapIds(prev => [...prev, gapId]);
    }
  };

  const getNextPriorityGap = (): IdentifiedGap | null => {
    return identifiedGaps
      .filter(gap => gap.status !== 'completed')
      .sort((a, b) => a.priority - b.priority)[0] || null;
  };

  // Tool completion tracking functions
  const markToolStarted = (toolId: string) => {
    const domain = getToolDomain(toolId);
    const existingUsage = toolUsageHistory.find(u => u.toolId === toolId);
    
    if (!existingUsage) {
      setToolUsageHistory(prev => [...prev, {
        toolId,
        startedAt: new Date().toISOString(),
        domain
      }]);
    }

    // Also mark the corresponding gap as in_progress if not already
    if (domain) {
      const gapId = `gap-${domain}`;
      const gap = identifiedGaps.find(g => g.id === gapId);
      if (gap && gap.status === 'not_started') {
        markGapStarted(gapId);
      }
    }
  };

  const markToolCompleted = (toolId: string) => {
    // Add to completed tools if not already
    if (!completedToolIds.includes(toolId)) {
      setCompletedToolIds(prev => [...prev, toolId]);
    }

    // Update tool usage history
    setToolUsageHistory(prev => 
      prev.map(usage => 
        usage.toolId === toolId 
          ? { ...usage, completedAt: new Date().toISOString() }
          : usage
      )
    );

    // Check if this tool completion should auto-complete a gap
    const domain = getToolDomain(toolId);
    if (domain) {
      const newCompletedToolIds = [...completedToolIds, toolId];
      if (shouldMarkGapCompleted(domain, newCompletedToolIds)) {
        const gapId = `gap-${domain}`;
        const gap = identifiedGaps.find(g => g.id === gapId);
        if (gap && gap.status !== 'completed') {
          markGapCompleted(gapId);
        }
      }
    }

    // Check if we should advance journey step to "close" when first tool is completed
    if (!completedSteps.includes('close') && completedToolIds.length === 0) {
      // First tool completed - mark step as started
      if (currentStepIndex < 2) {
        setCurrentStep(2);
      }
    }
  };

  const isToolCompleted = (toolId: string): boolean => {
    return completedToolIds.includes(toolId);
  };

  const getGapCompletionPercentage = (domain: GapDomain): number => {
    return calculateGapCompletionFromTools(domain, completedToolIds);
  };

  const value: JourneyContextType = {
    currentStepIndex,
    completedSteps,
    hasCompletedAssessment,
    hasVisitedBefore,
    completeStep,
    setCurrentStep,
    resetJourney,
    getProgress,
    identifiedGaps,
    completedGapIds,
    gapProgress,
    setAssessmentResults,
    markGapStarted,
    markGapCompleted,
    getNextPriorityGap,
    // Tool completion tracking
    completedToolIds,
    toolUsageHistory,
    markToolStarted,
    markToolCompleted,
    isToolCompleted,
    getGapCompletionPercentage
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
};

export default JourneyContext;

