import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JOURNEY_STEPS, type JourneyStep } from '../components/onboarding/JourneyProgressTracker';

interface JourneyContextType {
  currentStepIndex: number;
  completedSteps: string[];
  hasCompletedAssessment: boolean;
  hasVisitedBefore: boolean;
  completeStep: (stepKey: string) => void;
  setCurrentStep: (stepIndex: number) => void;
  resetJourney: () => void;
  getProgress: () => number;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

interface JourneyProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  CURRENT_STEP: 'cybercorrect_journey_step',
  COMPLETED_STEPS: 'cybercorrect_completed_steps',
  VISITED: 'cybercorrect_visited',
  ASSESSMENT_COMPLETED: 'cybercorrect_assessment_completed'
};

export const JourneyProvider: React.FC<JourneyProviderProps> = ({ children }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);

  // Load journey state from localStorage on mount
  useEffect(() => {
    try {
      const visited = localStorage.getItem(STORAGE_KEYS.VISITED);
      const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      const savedCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED_STEPS);
      const assessmentCompleted = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_COMPLETED);

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
    } catch (error) {
      console.error('Error loading journey state:', error);
    }
  }, []);

  // Save journey state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStepIndex.toString());
      localStorage.setItem(STORAGE_KEYS.COMPLETED_STEPS, JSON.stringify(completedSteps));
      
      if (hasVisitedBefore) {
        localStorage.setItem(STORAGE_KEYS.VISITED, 'true');
      }

      if (hasCompletedAssessment) {
        localStorage.setItem(STORAGE_KEYS.ASSESSMENT_COMPLETED, 'true');
      }
    } catch (error) {
      console.error('Error saving journey state:', error);
    }
  }, [currentStepIndex, completedSteps, hasVisitedBefore, hasCompletedAssessment]);

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
    
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_STEPS);
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_COMPLETED);
    } catch (error) {
      console.error('Error resetting journey state:', error);
    }
  };

  const getProgress = (): number => {
    return Math.round((completedSteps.length / JOURNEY_STEPS.length) * 100);
  };

  const value: JourneyContextType = {
    currentStepIndex,
    completedSteps,
    hasCompletedAssessment,
    hasVisitedBefore,
    completeStep,
    setCurrentStep,
    resetJourney,
    getProgress
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

