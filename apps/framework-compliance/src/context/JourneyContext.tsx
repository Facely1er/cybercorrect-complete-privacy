import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JOURNEY_STEPS, type JourneyStep } from '../components/onboarding/JourneyProgressTracker';
import {
  IdentifiedGap,
  GapJourneyProgress,
  calculateGapJourneyProgress,
  generateGapsFromAssessment
} from '../utils/gapJourneyConfig';

interface JourneyContextType {
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
  setAssessmentResults: (results: any) => void;
  markGapStarted: (gapId: string) => void;
  markGapCompleted: (gapId: string) => void;
  getNextPriorityGap: () => IdentifiedGap | null;
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
  ASSESSMENT_RESULTS: 'cybercorrect_assessment_results'
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

  // Load journey state from localStorage on mount
  useEffect(() => {
    try {
      const visited = localStorage.getItem(STORAGE_KEYS.VISITED);
      const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      const savedCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED_STEPS);
      const assessmentCompleted = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_COMPLETED);
      const savedGaps = localStorage.getItem(STORAGE_KEYS.IDENTIFIED_GAPS);
      const savedCompletedGaps = localStorage.getItem(STORAGE_KEYS.COMPLETED_GAPS);

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
      
      if (hasVisitedBefore) {
        localStorage.setItem(STORAGE_KEYS.VISITED, 'true');
      }

      if (hasCompletedAssessment) {
        localStorage.setItem(STORAGE_KEYS.ASSESSMENT_COMPLETED, 'true');
      }
    } catch (error) {
      console.error('Error saving journey state:', error);
    }
  }, [currentStepIndex, completedSteps, hasVisitedBefore, hasCompletedAssessment, identifiedGaps, completedGapIds]);

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
    
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_STEPS);
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_COMPLETED);
      localStorage.removeItem(STORAGE_KEYS.IDENTIFIED_GAPS);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_GAPS);
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_RESULTS);
    } catch (error) {
      console.error('Error resetting journey state:', error);
    }
  };

  const getProgress = (): number => {
    return Math.round((completedSteps.length / JOURNEY_STEPS.length) * 100);
  };

  // Gap-based journey functions
  const setAssessmentResults = (results: any) => {
    try {
      // Generate gaps from assessment
      const gaps = generateGapsFromAssessment(results);
      setIdentifiedGaps(gaps);
      
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
    getNextPriorityGap
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = (): JourneyContextType => {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};

export default JourneyContext;

