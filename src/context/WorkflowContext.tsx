import React, { createContext, useContext, useState, useEffect } from 'react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  currentStepId?: string;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

interface WorkflowContextType {
  workflows: Record<string, Workflow>;
  currentWorkflow: Workflow | null;
  startWorkflow: (workflowId: string) => void;
  completeStep: (workflowId: string, stepId: string) => void;
  setCurrentStep: (workflowId: string, stepId: string) => void;
  getWorkflowProgress: (workflowId: string) => number;
  resetWorkflow: (workflowId: string) => void;
}

export const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workflows, setWorkflows] = useState<Record<string, Workflow>>(() => {
    const saved = localStorage.getItem('workflows');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    localStorage.setItem('workflows', JSON.stringify(workflows));
  }, [workflows]);

  const startWorkflow = (workflowId: string) => {
    setWorkflows(prev => {
      const workflow = prev[workflowId];
      if (!workflow) return prev;

      const updatedWorkflow = {
        ...workflow,
        currentStepId: workflow.steps[0]?.id,
        startedAt: new Date().toISOString(),
        completed: false
      };

      setCurrentWorkflow(updatedWorkflow);
      return {
        ...prev,
        [workflowId]: updatedWorkflow
      };
    });
  };

  const completeStep = (workflowId: string, stepId: string) => {
    setWorkflows(prev => {
      const workflow = prev[workflowId];
      if (!workflow) return prev;

      const updatedSteps = workflow.steps.map(step =>
        step.id === stepId ? { ...step, completed: true } : step
      );

      const allStepsCompleted = updatedSteps.every(step => step.completed);
      const nextStep = updatedSteps.find(step => !step.completed);

      const updatedWorkflow = {
        ...workflow,
        steps: updatedSteps,
        currentStepId: nextStep?.id,
        completed: allStepsCompleted,
        completedAt: allStepsCompleted ? new Date().toISOString() : undefined
      };

      if (workflowId === currentWorkflow?.id) {
        setCurrentWorkflow(updatedWorkflow);
      }

      return {
        ...prev,
        [workflowId]: updatedWorkflow
      };
    });
  };

  const setCurrentStep = (workflowId: string, stepId: string) => {
    setWorkflows(prev => {
      const workflow = prev[workflowId];
      if (!workflow) return prev;

      const updatedWorkflow = {
        ...workflow,
        currentStepId: stepId
      };

      if (workflowId === currentWorkflow?.id) {
        setCurrentWorkflow(updatedWorkflow);
      }

      return {
        ...prev,
        [workflowId]: updatedWorkflow
      };
    });
  };

  const getWorkflowProgress = (workflowId: string): number => {
    const workflow = workflows[workflowId];
    if (!workflow) return 0;

    const completedSteps = workflow.steps.filter(step => step.completed).length;
    return Math.round((completedSteps / workflow.steps.length) * 100);
  };

  const resetWorkflow = (workflowId: string) => {
    setWorkflows(prev => {
      const workflow = prev[workflowId];
      if (!workflow) return prev;

      const resetSteps = workflow.steps.map(step => ({
        ...step,
        completed: false
      }));

      const resetWorkflow = {
        ...workflow,
        steps: resetSteps,
        currentStepId: resetSteps[0]?.id,
        completed: false,
        startedAt: new Date().toISOString(),
        completedAt: undefined
      };

      if (workflowId === currentWorkflow?.id) {
        setCurrentWorkflow(resetWorkflow);
      }

      return {
        ...prev,
        [workflowId]: resetWorkflow
      };
    });
  };

  return (
    <WorkflowContext.Provider value={{
      workflows,
      currentWorkflow,
      startWorkflow,
      completeStep,
      setCurrentStep,
      getWorkflowProgress,
      resetWorkflow
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};

export { useWorkflow, WorkflowProvider };