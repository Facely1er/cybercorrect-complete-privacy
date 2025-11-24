import { Fragment } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

type StepId = 'assessment' | 'results' | 'gap-analysis';

interface AssessmentFlowProgressProps {
  currentStep: StepId;
  assessmentResults?: {
    overallScore?: number;
    completedDate?: string;
  };
}

export const AssessmentFlowProgress: React.FC<AssessmentFlowProgressProps> = ({
  currentStep,
  assessmentResults
}) => {
  const steps = [
    { 
      id: 'assessment' as StepId, 
      label: 'Assessment', 
      path: '/assessments/privacy-assessment',
      description: 'Complete NIST Privacy Framework Assessment'
    },
    { 
      id: 'results' as StepId, 
      label: 'Results', 
      path: '/privacy-results',
      description: 'Review Assessment Results'
    },
    { 
      id: 'gap-analysis' as StepId, 
      label: 'Gap Analysis', 
      path: '/toolkit/privacy-gap-analyzer',
      description: 'View Integrated Gap Analysis'
    }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isCompleted = currentStepIndex > index;
          const isCurrent = currentStep.id === step.id;
          const isAccessible = isCompleted || isCurrent || (index === 0);

          return (
            <Fragment key={step.id}>
              <div className="flex flex-col items-center">
                {isAccessible ? (
                  <Link
                    to={step.path}
                    className={`flex flex-col items-center group ${
                      isCurrent ? 'cursor-default' : 'cursor-pointer'
                    }`}
                    state={assessmentResults ? { assessmentResults } : undefined}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                          : isCompleted
                          ? 'bg-success text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                      aria-current={isCurrent ? 'step' : undefined}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium transition-colors ${
                        isCurrent
                          ? 'text-primary'
                          : isCompleted
                          ? 'text-success'
                          : 'text-muted-foreground'
                      } ${!isCurrent && isAccessible ? 'group-hover:text-primary' : ''}`}
                    >
                      {step.label}
                    </span>
                    {step.description && (
                      <span className="text-xs text-muted-foreground mt-1 max-w-[100px] text-center">
                        {step.description}
                      </span>
                    )}
                  </Link>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                      <span className="text-sm font-semibold">{index + 1}</span>
                    </div>
                    <span className="text-xs mt-2 font-medium text-muted-foreground">
                      {step.label}
                    </span>
                  </div>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 transition-colors ${
                    currentStepIndex > index ? 'bg-success' : 'bg-muted'
                  }`}
                  aria-hidden="true"
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

