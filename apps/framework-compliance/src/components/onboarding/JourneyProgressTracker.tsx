import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Eye,
  Target,
  Wrench,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export interface JourneyStep {
  id: number;
  key: string;
  title: string;
  shortTitle: string;
  path: string;
  icon: typeof Eye;
  completed: boolean;
}

interface JourneyProgressTrackerProps {
  currentStepIndex: number;
  completedSteps?: string[];
  compact?: boolean;
  showNextAction?: boolean;
  className?: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 1,
    key: 'assess',
    title: 'Assess Your Current State',
    shortTitle: 'Assess',
    path: '/assessments/privacy-assessment',
    icon: Eye,
    completed: false
  },
  {
    id: 2,
    key: 'discover',
    title: 'Discover Your Compliance Gaps',
    shortTitle: 'Discover',
    path: '/compliance',
    icon: Target,
    completed: false
  },
  {
    id: 3,
    key: 'act',
    title: 'Act on Recommendations',
    shortTitle: 'Act',
    path: '/toolkit',
    icon: Wrench,
    completed: false
  },
  {
    id: 4,
    key: 'maintain',
    title: 'Maintain Compliance',
    shortTitle: 'Maintain',
    path: '/dashboard/privacy',
    icon: BarChart3,
    completed: false
  }
];

const JourneyProgressTracker: React.FC<JourneyProgressTrackerProps> = ({
  currentStepIndex,
  completedSteps = [],
  compact = false,
  showNextAction = true,
  className = ''
}) => {
  // Update completed status based on completedSteps array
  const steps = JOURNEY_STEPS.map(step => ({
    ...step,
    completed: completedSteps.includes(step.key) || step.id < currentStepIndex + 1
  }));

  const currentStep = steps[currentStepIndex];
  const nextStep = steps[currentStepIndex + 1];
  const progressPercentage = Math.round(((currentStepIndex + 1) / steps.length) * 100);
  const completedCount = steps.filter(s => s.completed).length;

  if (compact) {
    return (
      <Card className={`border-primary/20 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Your Journey Progress</h3>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {steps.length} steps complete
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{progressPercentage}%</div>
            </div>
          </div>

          {/* Compact Progress Bar */}
          <div className="flex items-center gap-2 mb-3">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1">
                    <Link to={step.path} className="w-full">
                      <div
                        className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
                          step.completed
                            ? 'bg-green-500 text-white'
                            : index === currentStepIndex
                            ? 'bg-primary text-white ring-2 ring-primary/30'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <StepIcon className="w-4 h-4" />
                        )}
                      </div>
                    </Link>
                    <span
                      className={`text-[10px] mt-1 font-medium text-center ${
                        index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.shortTitle}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-shrink-0 w-4 transition-all ${
                        step.completed ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Next Action */}
          {showNextAction && currentStep && (
            <Link to={currentStep.path}>
              <Button size="sm" className="w-full" variant="outline">
                Continue: {currentStep.shortTitle}
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full version
  return (
    <Card className={`border-primary/20 bg-gradient-to-r from-primary/5 via-background to-secondary/5 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Your Compliance Journey</h2>
            </div>
            <p className="text-muted-foreground">
              Track your progress through the privacy compliance lifecycle
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">{progressPercentage}%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-6">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` } as React.CSSProperties}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{completedCount} steps completed</span>
            <span>{steps.length - completedCount} remaining</span>
          </div>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStepIndex;
            const isCurrent = !step.completed && isActive;

            return (
              <Link key={step.id} to={step.path} className="block">
                <Card
                  className={`h-full transition-all hover:shadow-lg ${
                    isCurrent
                      ? 'border-2 border-primary shadow-md'
                      : step.completed
                      ? 'border-2 border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/20'
                      : 'border border-border opacity-75 hover:opacity-100'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          step.completed
                            ? 'bg-green-500'
                            : isCurrent
                            ? 'bg-primary'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <StepIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                      {isCurrent && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary text-white animate-pulse">
                          Current
                        </span>
                      )}
                      {step.completed && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Done
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-1 text-foreground">{step.shortTitle}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{step.title}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Next Action CTA */}
        {showNextAction && (
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {currentStep.completed ? 'Great Progress!' : 'Next Step'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentStep.completed && nextStep
                    ? `Continue with: ${nextStep.title}`
                    : currentStep.title}
                </p>
              </div>
              <Link to={currentStep.completed && nextStep ? nextStep.path : currentStep.path}>
                <Button className="flex-shrink-0">
                  {currentStep.completed && nextStep ? 'Continue' : 'Start Now'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JourneyProgressTracker;
export { JOURNEY_STEPS };

