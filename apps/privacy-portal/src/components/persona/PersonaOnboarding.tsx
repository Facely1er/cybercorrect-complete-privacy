import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePersona } from '../../hooks/usePersona';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressTracker } from '../../common/ProgressTracker';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Shield, 
  Users, 
  Briefcase,
  BookOpen,
  Target,
  Play
} from 'lucide-react';

// interface OnboardingStep {
//   id: string;
//   title: string;
//   description: string;
//   component: string;
//   estimatedTime: string;
//   required: boolean;
//   content: React.ReactNode;
// }

export const PersonaOnboarding: React.FC = () => {
  const { currentPersona, getPersonaOnboardingSteps, markOnboardingComplete } = usePersona();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const { personaId } = useParams<{ personaId: string }>();

  const onboardingSteps = getPersonaOnboardingSteps();
  const currentStep = onboardingSteps[currentStepIndex];

  useEffect(() => {
    // Load completed steps from localStorage
    const saved = localStorage.getItem(`onboarding_${personaId}_completed`);
    if (saved) {
      setCompletedSteps(JSON.parse(saved));
    }
  }, [personaId]);

  const handleNext = () => {
    if (currentStep) {
      const newCompletedSteps = [...completedSteps, currentStep.id];
      setCompletedSteps(newCompletedSteps);
      localStorage.setItem(`onboarding_${personaId}_completed`, JSON.stringify(newCompletedSteps));

      if (currentStepIndex < onboardingSteps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        // Mark onboarding as complete in context
        if (personaId) {
          markOnboardingComplete(personaId);
        }
        setIsCompleted(true);
        // Redirect to persona dashboard after completion
        setTimeout(() => {
          navigate(`/persona/${personaId}/dashboard`);
        }, 2000);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep && !currentStep.required) {
      handleNext();
    }
  };

  const getPersonaIcon = () => {
    if (!currentPersona) return <Shield className="h-8 w-8" />;
    
    switch (currentPersona.id) {
      case 'worker':
        return <Users className="h-8 w-8 text-blue-600" />;
      case 'job_prospect':
        return <Briefcase className="h-8 w-8 text-green-600" />;
      case 'hr_staff':
        return <Users className="h-8 w-8 text-purple-600" />;
      case 'dpo':
        return <Shield className="h-8 w-8 text-red-600" />;
      default:
        return <Shield className="h-8 w-8" />;
    }
  };

  const renderStepContent = (step: { component: string; title: string; description: string }) => {
    switch (step.component) {
      case 'WelcomeStep':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              {getPersonaIcon()}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to Your Privacy Portal</h2>
              <p className="text-muted-foreground">
                You're now set up as a <strong>{currentPersona?.displayName}</strong>. 
                This portal is designed to help you understand and exercise your privacy rights 
                in the workplace.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">What you can do:</h3>
              <ul className="text-sm text-left space-y-1">
                <li>• Exercise your data rights (access, correction, deletion)</li>
                <li>• Manage your privacy preferences</li>
                <li>• Track your privacy requests</li>
                <li>• Learn about workplace privacy laws</li>
              </ul>
            </div>
          </div>
        );

      case 'PrivacyRightsStep':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Your Privacy Rights</h2>
              <p className="text-muted-foreground">
                As a {currentPersona?.displayName.toLowerCase()}, you have specific privacy rights 
                under employment laws.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Data Access Rights</h3>
                    <p className="text-sm text-muted-foreground">
                      Request and receive copies of your personal employment data
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Data Correction Rights</h3>
                    <p className="text-sm text-muted-foreground">
                      Request correction of inaccurate personal information
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Data Deletion Rights</h3>
                    <p className="text-sm text-muted-foreground">
                      Request deletion of personal data when legally permissible
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start space-x-3">
                  <BookOpen className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Privacy Control Rights</h3>
                    <p className="text-sm text-muted-foreground">
                      Control how your data is used and shared
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Applicable Regulations:</h3>
              <div className="flex flex-wrap gap-2">
                {currentPersona?.regulations.map((regulation) => (
                  <Badge key={regulation} variant="outline">
                    {regulation}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 'FirstRequestStep':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Submit Your First Request?</h2>
              <p className="text-muted-foreground">
                Let's walk through submitting a data access request to get you started.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Quick Start Guide</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-sm">Choose what data you want to access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-sm">Verify your identity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-sm">Submit your request</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <span className="text-sm">Track your request status</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => navigate(`/persona/${personaId}/workflow/data_access_request/welcome-data-access`)}
                className="mr-4"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Data Access Request
              </Button>
              <Button variant="outline" onClick={handleNext}>
                Skip for Now
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        );
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-lg">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Onboarding Complete!</h2>
          <p className="text-muted-foreground mb-4">
            You're all set up and ready to use your privacy portal. 
            Redirecting you to your dashboard...
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPersona || !currentStep) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-lg">
          <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Persona Not Found</h2>
          <p className="text-muted-foreground">
            We couldn't find the persona you're looking for. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getPersonaIcon()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{currentPersona.displayName} Onboarding</h1>
              <p className="text-muted-foreground">Step {currentStepIndex + 1} of {onboardingSteps.length}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              <Clock className="h-3 w-3 mr-1" />
              {currentStep.estimatedTime}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {currentStep.required ? 'Required' : 'Optional'}
            </p>
          </div>
        </div>
        
        <ProgressTracker
          currentStep={currentStepIndex + 1}
          totalSteps={onboardingSteps.length}
          progress={Math.round(((currentStepIndex + 1) / onboardingSteps.length) * 100)}
        />
      </div>

      {/* Step Content */}
      <Card className="p-8 mb-6">
        {renderStepContent(currentStep)}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="space-x-2">
          {!currentStep.required && (
            <Button variant="outline" onClick={handleSkip}>
              Skip
            </Button>
          )}
          <Button onClick={handleNext}>
            {currentStepIndex === onboardingSteps.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};