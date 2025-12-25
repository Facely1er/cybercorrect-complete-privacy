import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { JOURNEY_STEPS } from '../config/journeySteps';
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
import { toast } from '../components/ui/Toaster';
import {
  JOURNEY_THRESHOLDS,
  JOURNEY_ADVANCEMENT,
  JOURNEY_NOTIFICATIONS,
  JOURNEY_VALIDATION,
  JOURNEY_STORAGE_KEYS,
  JOURNEY_VERSION,
} from '../config/journeyThresholds';
import {
  validateJourneyState,
  recoverJourneyState,
  exportJourneyData,
  importJourneyData,
  getValidationSummary,
  type JourneyState as ValidationJourneyState,
} from '../utils/journeyValidation';
import {
  startSession,
  endSession,
  trackToolStarted as analyticsTrackToolStarted,
  trackToolCompleted as analyticsTrackToolCompleted,
  trackStepVisit,
  trackStepCompletion,
  trackGapClosed,
  initializeAnalytics,
} from '../utils/journeyAnalytics';

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
  resetJourney: (skipConfirmation?: boolean) => Promise<boolean>;
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
  
  // Journey export/import
  exportJourney: () => string;
  importJourney: (jsonData: string) => Promise<boolean>;
  
  // Journey validation
  validateCurrentState: () => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

interface JourneyProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = JOURNEY_STORAGE_KEYS;

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

  // Load journey state from localStorage on mount with validation
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

      const stepIndex = savedStep ? parseInt(savedStep, 10) : 0;
      const completed = savedCompleted ? JSON.parse(savedCompleted) : [];
      const gaps = savedGaps ? JSON.parse(savedGaps) : [];
      const completedGaps = savedCompletedGaps ? JSON.parse(savedCompletedGaps) : [];
      const completedTools = savedCompletedTools ? JSON.parse(savedCompletedTools) : [];
      const toolHistory = savedToolUsageHistory ? JSON.parse(savedToolUsageHistory) : [];

      // Validate journey state if enabled
      if (JOURNEY_VALIDATION.VALIDATE_ON_MOUNT && gaps.length > 0) {
        const state: ValidationJourneyState = {
          currentStepIndex: stepIndex,
          completedSteps: completed,
          identifiedGaps: gaps,
          completedGapIds: completedGaps,
          completedToolIds: completedTools,
          hasCompletedAssessment: assessmentCompleted === 'true',
          version: localStorage.getItem(STORAGE_KEYS.VERSION) || undefined,
          startedAt: localStorage.getItem(STORAGE_KEYS.JOURNEY_STARTED_AT) || undefined,
          lastUpdatedAt: localStorage.getItem(STORAGE_KEYS.LAST_UPDATED_AT) || undefined,
        };

        const validation = validateJourneyState(state);

        if (!validation.valid) {
          console.warn('Journey validation issues found:', getValidationSummary(validation));
          
          if (JOURNEY_VALIDATION.AUTO_RECOVER_ERRORS && validation.canRecover) {
            const recovered = recoverJourneyState(state);
            console.warn('Auto-recovered journey state');
            
            setCurrentStepIndex(recovered.currentStepIndex);
            setCompletedSteps(recovered.completedSteps);
            setIdentifiedGaps(recovered.identifiedGaps);
            setCompletedGapIds(recovered.completedGapIds);
            setCompletedToolIds(recovered.completedToolIds);
            setHasCompletedAssessment(recovered.hasCompletedAssessment);
            setToolUsageHistory(toolHistory);
            
            toast.info(
              'Journey Recovered',
              'We detected and fixed some inconsistencies in your journey data.',
              JOURNEY_NOTIFICATIONS.SUCCESS_DURATION
            );
            return;
          } else if (!validation.canRecover) {
            toast.error(
              'Journey Data Error',
              'Critical errors found in journey data. Please restart your journey.',
              JOURNEY_NOTIFICATIONS.ERROR_DURATION
            );
          }
        }
      }

      // Load state normally if validation passed or disabled
      setCurrentStepIndex(stepIndex);
      setCompletedSteps(completed);
      setIdentifiedGaps(gaps);
      setCompletedGapIds(completedGaps);
      setCompletedToolIds(completedTools);
      setToolUsageHistory(toolHistory);

      if (assessmentCompleted) {
        setHasCompletedAssessment(true);
      }
    } catch (error) {
      console.error('Error loading journey state:', error);
      toast.error(
        'Failed to Load Journey',
        'Could not load your journey progress. Starting fresh.',
        JOURNEY_NOTIFICATIONS.ERROR_DURATION
      );
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
      localStorage.setItem(STORAGE_KEYS.VERSION, JOURNEY_VERSION);
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATED_AT, new Date().toISOString());
      
      // Set journey start time if not already set
      if (!localStorage.getItem(STORAGE_KEYS.JOURNEY_STARTED_AT)) {
        localStorage.setItem(STORAGE_KEYS.JOURNEY_STARTED_AT, new Date().toISOString());
      }
      
      if (hasVisitedBefore) {
        localStorage.setItem(STORAGE_KEYS.VISITED, 'true');
      }

      if (hasCompletedAssessment) {
        localStorage.setItem(STORAGE_KEYS.ASSESSMENT_COMPLETED, 'true');
      }
    } catch (error) {
      console.error('Error saving journey state:', error);
      toast.error(
        'Save Failed',
        'Failed to save your journey progress. Your changes may not be persisted.',
        JOURNEY_NOTIFICATIONS.ERROR_DURATION
      );
    }
  }, [currentStepIndex, completedSteps, hasVisitedBefore, hasCompletedAssessment, identifiedGaps, completedGapIds, completedToolIds, toolUsageHistory]);

  // Initialize analytics and session on mount
  useEffect(() => {
    // Initialize analytics
    initializeAnalytics();
    
    // Start a new session
    startSession();
    
    // Cleanup: end session on unmount
    return () => {
      endSession();
    };
  }, []);

  // Track step visits when current step changes
  useEffect(() => {
    if (JOURNEY_STEPS[currentStepIndex]) {
      trackStepVisit(JOURNEY_STEPS[currentStepIndex].key);
    }
  }, [currentStepIndex]);

  // Calculate gap progress whenever gaps or completed gaps change
  useEffect(() => {
    if (identifiedGaps.length > 0) {
      const progress = calculateGapJourneyProgress(identifiedGaps, completedGapIds);
      setGapProgress(progress);
    }
  }, [identifiedGaps, completedGapIds]);

  const completeStep = useCallback((stepKey: string) => {
    if (!completedSteps.includes(stepKey)) {
      const newCompletedSteps = [...completedSteps, stepKey];
      setCompletedSteps(newCompletedSteps);

      // Track step completion in analytics
      const stepIndex = JOURNEY_STEPS.findIndex(s => s.key === stepKey);
      if (stepIndex >= 0) {
        // Calculate duration (simplified - could be enhanced with actual timing)
        const duration = 0; // Could track actual time spent
        trackStepCompletion(stepKey, duration);
      }

      // Special handling for assessment completion
      if (stepKey === 'assess') {
        setHasCompletedAssessment(true);
      }

      // Auto-advance to next step if current step is completed
      if (stepIndex === currentStepIndex && stepIndex < JOURNEY_STEPS.length - 1) {
        setCurrentStepIndex(stepIndex + 1);
      }
    }
  }, [completedSteps, currentStepIndex]);

  const setCurrentStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < JOURNEY_STEPS.length) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const resetJourney = async (skipConfirmation = false): Promise<boolean> => {
    // Show confirmation dialog unless skipped
    if (!skipConfirmation) {
      const confirmed = await new Promise<boolean>((resolve) => {
        const message = 'Are you sure you want to reset your journey? This will delete all progress, including:';
        const details = [
          `${completedSteps.length} completed steps`,
          `${completedGapIds.length} closed gaps`,
          `${completedToolIds.length} completed tools`,
          'All assessment results',
          'All journey history',
        ];
        
        // Use native confirm for now - can be replaced with custom dialog
        const result = window.confirm(
          `${message}\n\n${details.map(d => `• ${d}`).join('\n')}\n\nThis action cannot be undone.`
        );
        resolve(result);
      });

      if (!confirmed) {
        return false;
      }
    }

    try {
      // Reset all state
      setCurrentStepIndex(0);
      setCompletedSteps([]);
      setHasCompletedAssessment(false);
      setIdentifiedGaps([]);
      setCompletedGapIds([]);
      setGapProgress(null);
      setCompletedToolIds([]);
      setToolUsageHistory([]);
      
      // Clear localStorage
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      toast.success(
        'Journey Reset',
        'Your journey has been reset. You can start fresh!',
        JOURNEY_NOTIFICATIONS.SUCCESS_DURATION
      );
      
      return true;
    } catch (error) {
      console.error('Error resetting journey state:', error);
      toast.error(
        'Reset Failed',
        'Failed to reset journey. Please try again or contact support.',
        JOURNEY_NOTIFICATIONS.ERROR_DURATION
      );
      return false;
    }
  };

  const getProgress = (): number => {
    return Math.round((completedSteps.length / JOURNEY_STEPS.length) * 100);
  };

  // Journey completion logic - check if all steps are satisfied
  useEffect(() => {
    const gapCompletionRate = identifiedGaps.length > 0 
      ? completedGapIds.length / identifiedGaps.length 
      : 0;
    
    const allStepsCompleted =
      hasCompletedAssessment &&
      identifiedGaps.length > 0 &&
      gapCompletionRate >= (JOURNEY_THRESHOLDS.GAP_COMPLETION_PERCENTAGE / 100) &&
      completedToolIds.length >= JOURNEY_THRESHOLDS.MINIMUM_TOOLS_COMPLETED;

    if (allStepsCompleted && !completedSteps.includes('maintain') && JOURNEY_ADVANCEMENT.AUTO_ADVANCE_ENABLED) {
      completeStep('maintain');
      
      // Show celebration notification if enabled
      if (JOURNEY_ADVANCEMENT.SHOW_MILESTONE_NOTIFICATIONS) {
        toast.success(
          '🎉 Journey Complete!', 
          `Congratulations! You've closed ${completedGapIds.length} gaps using ${completedToolIds.length} tools. Your organization is now in maintenance mode.`,
          JOURNEY_NOTIFICATIONS.MILESTONE_DURATION
        );
      }
    }
  }, [hasCompletedAssessment, identifiedGaps.length, completedGapIds.length, completedToolIds.length, completedSteps, completeStep]);

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
    // Find the gap before updating state
    const gap = identifiedGaps.find(g => g.id === gapId);
    
    setIdentifiedGaps(prev => 
      prev.map(g => 
        g.id === gapId ? { ...g, status: 'completed' as const } : g
      )
    );
    
    if (!completedGapIds.includes(gapId)) {
      setCompletedGapIds(prev => [...prev, gapId]);
      
      // Track gap closure in analytics
      if (gap) {
        trackGapClosed(gap.domain);
      }
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
      
      // Track in analytics
      analyticsTrackToolStarted(toolId, domain);
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
    const toolUsage = toolUsageHistory.find(u => u.toolId === toolId);
    const startTime = toolUsage?.startedAt ? new Date(toolUsage.startedAt).getTime() : Date.now();
    const duration = Date.now() - startTime;

    setToolUsageHistory(prev => 
      prev.map(usage => 
        usage.toolId === toolId 
          ? { ...usage, completedAt: new Date().toISOString() }
          : usage
      )
    );

    // Track in analytics
    const domain = getToolDomain(toolId);
    analyticsTrackToolCompleted(toolId, domain, duration);

    // Enhanced gap-tool linkage: Check if tool completion closes any gaps
    const newCompletedToolIds = [...completedToolIds, toolId];
    
    // Find all gaps that include this tool in their recommended tools
    const relatedGaps = identifiedGaps.filter(gap =>
      gap.recommendedTools?.includes(toolId)
    );

    relatedGaps.forEach(gap => {
      // Calculate gap completion percentage
      const gapTools = gap.recommendedTools || [];
      const completedCount = gapTools.filter(t =>
        newCompletedToolIds.includes(t)
      ).length;

      const completionPercentage = gapTools.length > 0 
        ? (completedCount / gapTools.length) * 100 
        : 0;

      // If all tools for this gap are completed, mark gap as complete
      if (completionPercentage >= JOURNEY_THRESHOLDS.GAP_COMPLETION_TOOL_THRESHOLD && gap.status !== 'completed') {
        markGapCompleted(gap.id);
        
        // Show success notification if enabled
        if (JOURNEY_ADVANCEMENT.SHOW_GAP_CLOSURE_NOTIFICATIONS) {
          toast.success(
            '✨ Gap Closed!', 
            `Great work! You've completed all recommended actions for ${gap.domainTitle}.`,
            JOURNEY_NOTIFICATIONS.GAP_CLOSURE_DURATION
          );
        }
      } else if (completionPercentage >= JOURNEY_THRESHOLDS.TOOL_PROGRESS_THRESHOLD && gap.status === 'not_started') {
        // Mark gap as in progress if threshold of tools are complete
        markGapStarted(gap.id);
      }
    });

    // Also check domain-based completion for backwards compatibility
    const domain = getToolDomain(toolId);
    if (domain) {
      if (shouldMarkGapCompleted(domain, newCompletedToolIds)) {
        const gapId = `gap-${domain}`;
        const gap = identifiedGaps.find(g => g.id === gapId);
        if (gap && gap.status !== 'completed') {
          markGapCompleted(gapId);
        }
      }
    }

    // Check if we should auto-advance journey steps
    // Complete "Discover" step when first tool is used (auto-advances to "Act" step)
    if (completedToolIds.length === 0 && currentStepIndex <= 1) {
      if (!completedSteps.includes('discover')) {
        completeStep('discover'); // This will auto-advance from index 1 to index 2 (Act)
      }
    }

    // Check overall gap progress for journey advancement
    const totalGaps = identifiedGaps.length;
    const currentCompletedCount = completedGapIds.length + 
      relatedGaps.filter(g => g.recommendedTools?.every(t => newCompletedToolIds.includes(t))).length;
    
    if (totalGaps > 0 && JOURNEY_ADVANCEMENT.AUTO_ADVANCE_ENABLED) {
      const overallGapProgress = (currentCompletedCount / totalGaps) * 100;

      // Auto-advance to step 4 (Maintain) when threshold of gaps are closed
      if (overallGapProgress >= JOURNEY_THRESHOLDS.GAP_COMPLETION_PERCENTAGE && !completedSteps.includes('act')) {
        completeStep('act');
        
        // Show journey progress notification if enabled
        if (JOURNEY_ADVANCEMENT.SHOW_MILESTONE_NOTIFICATIONS) {
          toast.info(
            '🚀 Journey Progress', 
            `Excellent work! Moving to Maintain phase. You've completed ${currentCompletedCount} of ${totalGaps} gaps (${overallGapProgress.toFixed(1)}%).`,
            JOURNEY_NOTIFICATIONS.SUCCESS_DURATION
          );
        }
      }
    }
  };

  const isToolCompleted = (toolId: string): boolean => {
    return completedToolIds.includes(toolId);
  };

  const getGapCompletionPercentage = (domain: GapDomain): number => {
    return calculateGapCompletionFromTools(domain, completedToolIds);
  };

  // Export journey data
  const exportJourney = (): string => {
    const state: ValidationJourneyState = {
      currentStepIndex,
      completedSteps,
      identifiedGaps,
      completedGapIds,
      completedToolIds,
      hasCompletedAssessment,
      version: JOURNEY_VERSION,
      startedAt: localStorage.getItem(STORAGE_KEYS.JOURNEY_STARTED_AT) || undefined,
      lastUpdatedAt: new Date().toISOString(),
    };
    return exportJourneyData(state);
  };

  // Import journey data
  const importJourney = async (jsonData: string): Promise<boolean> => {
    try {
      const result = importJourneyData(jsonData);
      
      if (result.error || !result.state) {
        toast.error(
          'Import Failed',
          result.error || 'Invalid journey data format.',
          JOURNEY_NOTIFICATIONS.ERROR_DURATION
        );
        return false;
      }

      if (result.validation && !result.validation.valid) {
        const warnings = result.validation.warnings.length;
        toast.warning(
          'Import with Warnings',
          `Journey imported with ${warnings} warning(s). Some data may have been corrected.`,
          JOURNEY_NOTIFICATIONS.SUCCESS_DURATION
        );
      }

      // Apply imported state
      setCurrentStepIndex(result.state.currentStepIndex);
      setCompletedSteps(result.state.completedSteps);
      setIdentifiedGaps(result.state.identifiedGaps);
      setCompletedGapIds(result.state.completedGapIds);
      setCompletedToolIds(result.state.completedToolIds);
      setHasCompletedAssessment(result.state.hasCompletedAssessment);

      toast.success(
        'Import Successful',
        'Your journey data has been restored.',
        JOURNEY_NOTIFICATIONS.SUCCESS_DURATION
      );

      return true;
    } catch (error) {
      console.error('Error importing journey:', error);
      toast.error(
        'Import Failed',
        'An error occurred while importing journey data.',
        JOURNEY_NOTIFICATIONS.ERROR_DURATION
      );
      return false;
    }
  };

  // Validate current journey state
  const validateCurrentState = () => {
    const state: ValidationJourneyState = {
      currentStepIndex,
      completedSteps,
      identifiedGaps,
      completedGapIds,
      completedToolIds,
      hasCompletedAssessment,
      version: localStorage.getItem(STORAGE_KEYS.VERSION) || undefined,
      startedAt: localStorage.getItem(STORAGE_KEYS.JOURNEY_STARTED_AT) || undefined,
      lastUpdatedAt: localStorage.getItem(STORAGE_KEYS.LAST_UPDATED_AT) || undefined,
    };

    const validation = validateJourneyState(state);
    
    if (!validation.valid) {
      console.warn('Journey validation:', validation);
      
      if (JOURNEY_VALIDATION.SHOW_DETAILED_ERRORS) {
        const summary = getValidationSummary(validation);
        toast.warning('Journey Validation', summary, JOURNEY_NOTIFICATIONS.SUCCESS_DURATION);
      }
      
      if (validation.canRecover && JOURNEY_VALIDATION.AUTO_RECOVER_ERRORS) {
        const recovered = recoverJourneyState(state);
        setCurrentStepIndex(recovered.currentStepIndex);
        setCompletedSteps(recovered.completedSteps);
        setIdentifiedGaps(recovered.identifiedGaps);
        setCompletedGapIds(recovered.completedGapIds);
        setCompletedToolIds(recovered.completedToolIds);
        setHasCompletedAssessment(recovered.hasCompletedAssessment);
      }
    } else if (JOURNEY_VALIDATION.SHOW_DETAILED_ERRORS) {
      toast.success('Validation Passed', 'Journey state is valid.', JOURNEY_NOTIFICATIONS.SUCCESS_DURATION);
    }
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
    getGapCompletionPercentage,
    // Journey export/import
    exportJourney,
    importJourney,
    // Journey validation
    validateCurrentState
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useJourney = (): JourneyContextType => {
  const context = React.useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};

export default JourneyContext;

