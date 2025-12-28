import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  X,
  CheckCircle,
  Circle,
  ArrowRight,
  Eye,
  Target,
  Wrench,
  BarChart3,
  Sparkles,
  Shield
} from 'lucide-react';

interface OnboardingFlowProps {
  onClose?: () => void;
  currentStep?: number;
  isVisible?: boolean;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onClose,
  currentStep = 0,
  isVisible = true
}) => {
  const [activeStep, setActiveStep] = useState(currentStep);

  useEffect(() => {
    setActiveStep(currentStep);
  }, [currentStep]);

  const steps = [
    {
      id: 1,
      title: 'Assess Your Current State',
      description: 'Take our comprehensive privacy assessment to understand where you stand',
      icon: Eye,
      action: 'Start Free Assessment',
      path: '/assessments/privacy-assessment',
      duration: '15-20 min',
      color: 'from-blue-500 to-cyan-500',
      benefits: [
        'Multi-framework compliance scoring',
        'Identify critical gaps',
        'No credit card required'
      ]
    },
    {
      id: 2,
      title: 'Discover Your Priority Gaps',
      description: 'See which compliance areas need attention first, ranked by severity and impact',
      icon: Target,
      action: 'View Gap Analysis',
      path: '/compliance',
      duration: 'Instant',
      color: 'from-purple-500 to-pink-500',
      benefits: [
        'Gaps ranked by severity',
        'Clear action priorities',
        'Risk impact analysis'
      ]
    },
    {
      id: 3,
      title: 'Close Your Gaps',
      description: 'Use recommended tools to address each gap, starting with the most critical',
      icon: Wrench,
      action: 'Start Closing Gaps',
      path: '/toolkit',
      duration: 'Ongoing',
      color: 'from-green-500 to-emerald-500',
      benefits: [
        'Tools matched to your gaps',
        'Step-by-step guidance',
        'Track gap closure progress'
      ]
    },
    {
      id: 4,
      title: 'Track & Maintain',
      description: 'Monitor progress and maintain compliance with continuous tracking',
      icon: BarChart3,
      action: 'View Project Dashboard',
      path: '/project/dashboard',
      duration: 'Continuous',
      color: 'from-orange-500 to-amber-500',
      benefits: [
        'Real-time progress tracking',
        'Compliance calendar',
        'Audit-ready reports'
      ]
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="max-w-5xl w-full my-8 shadow-2xl border-2 border-primary/20">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              aria-label="Close onboarding"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Welcome to CyberCorrect</h2>
                <p className="text-white/90 text-sm">Your Privacy Compliance Journey in 4 Clear Steps</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-muted/30 bg-muted/10 p-4">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        index < activeStep
                          ? 'bg-green-500 text-white'
                          : index === activeStep
                          ? 'bg-primary text-white ring-4 ring-primary/20'
                          : 'bg-gray-200 text-gray-400 dark:bg-gray-700'
                      }`}
                    >
                      {index < activeStep ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" fill={index === activeStep ? 'white' : 'none'} />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1 font-medium hidden sm:block ${
                        index <= activeStep ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      Step {step.id}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${
                        index < activeStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Steps Content */}
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === activeStep;
                const isCompleted = index < activeStep;

                return (
                  <div
                    key={step.id}
                    className={`relative transition-all duration-300 ${
                      isActive ? 'scale-105' : 'scale-100 opacity-75'
                    }`}
                  >
                    <Card
                      className={`h-full border-2 ${
                        isActive
                          ? 'border-primary shadow-lg'
                          : isCompleted
                          ? 'border-green-300 dark:border-green-700'
                          : 'border-border'
                      }`}
                    >
                      <CardContent className="p-5">
                        {/* Step indicator badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${
                              isCompleted
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : isActive
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                          >
                            {isCompleted ? '✓ Complete' : isActive ? 'Current' : 'Upcoming'}
                          </span>
                          <span className="text-xs text-muted-foreground">{step.duration}</span>
                        </div>

                        {/* Icon */}
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg`}
                        >
                          <StepIcon className="w-7 h-7 text-white" />
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-lg font-bold mb-2 text-foreground ">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 min-h-[2.5rem]">
                          {step.description}
                        </p>

                        {/* Benefits */}
                        <ul className="space-y-2 mb-4">
                          {step.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs">
                              <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Action Button */}
                        <Link to={step.path} onClick={onClose}>
                          <Button
                            size="sm"
                            className={`w-full ${
                              isActive
                                ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90'
                                : isCompleted
                                ? ''
                                : 'opacity-50'
                            }`}
                            variant={isCompleted ? 'outline' : 'default'}
                            disabled={!isActive && !isCompleted}
                          >
                            {step.action}
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-pulse">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-xl text-center border border-primary/20">
              <h3 className="text-xl font-bold mb-2 text-foreground">
                Ready to Start Your Compliance Journey?
              </h3>
              <p className="text-muted-foreground mb-4">
                Begin with our free privacy assessment. Get your personalized compliance roadmap in just 15-20 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/assessments/privacy-assessment" onClick={onClose}>
                  <Button size="lg" variant="default">
                    <Eye className="mr-2 h-5 w-5" />
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                {onClose && (
                  <Button size="lg" variant="outline" onClick={onClose}>
                    I'll Explore First
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ✓ No credit card required • ✓ NIST-aligned framework • ✓ Instant results
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;


