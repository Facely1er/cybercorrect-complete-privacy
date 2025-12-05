/**
 * Journey Guide Component
 * Provides step-by-step guidance for customer journey
 */

import { useState } from 'react';
import { ChevronRight, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { cn } from '../../utils/common';

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  completed?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface JourneyGuideProps {
  title: string;
  description?: string;
  steps: JourneyStep[];
  onComplete?: () => void;
  className?: string;
  collapsible?: boolean;
}

export const JourneyGuide = ({
  title,
  description,
  steps,
  onComplete,
  className,
  collapsible = true,
}: JourneyGuideProps) => {
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0;

  return (
    <Card className={cn('modern-card', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {collapsible && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-4 text-muted-foreground hover:text-foreground transition-colors touch-target"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <ChevronRight
                className={cn(
                  'w-5 h-5 transition-transform',
                  isExpanded && 'rotate-90'
                )}
              />
            </button>
          )}
        </div>
        {isExpanded && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {completedSteps} of {steps.length} completed
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'flex items-start gap-4 p-4 rounded-lg border transition-colors',
                step.completed
                  ? 'bg-success/5 border-success/20'
                  : 'bg-card border-border'
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {step.completed ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4
                      className={cn(
                        'font-medium mb-1',
                        step.completed
                          ? 'text-success line-through'
                          : 'text-foreground'
                      )}
                    >
                      {index + 1}. {step.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                {step.action && !step.completed && (
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={step.action.onClick}
                      className="w-full sm:w-auto"
                    >
                      {step.action.label}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {completedSteps === steps.length && onComplete && (
            <div className="pt-4 border-t">
              <Button onClick={onComplete} className="w-full sm:w-auto">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

