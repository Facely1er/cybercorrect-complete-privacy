import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePersona } from '../../hooks/usePersona';
import { LoadingState } from '../../common/LoadingState';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  User, 
  ArrowRight, 
  CheckCircle, 
  Clock,
  AlertCircle
} from 'lucide-react';

interface PersonaGuardProps {
  children: React.ReactNode;
}

export const PersonaGuard: React.FC<PersonaGuardProps> = ({ children }) => {
  const { personaId } = useParams<{ personaId: string }>();
  const navigate = useNavigate();
  const { 
    currentPersona, 
    error, 
    hasCompletedOnboarding
  } = usePersona();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!personaId) {
        setIsChecking(false);
        return;
      }

      try {
        // Check if user has completed onboarding for this persona
        const hasCompleted = hasCompletedOnboarding(personaId);
        
        // If we're on the onboarding page and user has completed it, redirect to dashboard
        if (window.location.pathname.includes('/onboarding') && hasCompleted) {
          navigate(`/persona/${personaId}/dashboard`, { replace: true });
          return;
        }

        // If we're on the dashboard page and user hasn't completed onboarding, redirect to onboarding
        if (window.location.pathname.includes('/dashboard') && !hasCompleted) {
          navigate(`/persona/${personaId}/onboarding`, { replace: true });
          return;
        }

      } catch (err) {
        console.error('Error checking onboarding status:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkOnboardingStatus();
  }, [personaId, navigate, hasCompletedOnboarding]);

  if (isChecking) {
    return <LoadingState message="Checking your onboarding status..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Persona</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentPersona) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Persona Selected</h2>
          <p className="text-muted-foreground mb-4">
            Please select a persona to continue.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Select Persona
          </Button>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

// Component to show onboarding status
export const OnboardingStatusCard: React.FC<{ personaId: string }> = ({ personaId }) => {
  const { hasCompletedOnboarding } = usePersona();
  const navigate = useNavigate();
  
  const hasCompleted = hasCompletedOnboarding(personaId);

  if (hasCompleted) {
    return (
      <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-300">
              Onboarding Complete
            </h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              You've completed the setup process for this role.
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={() => navigate(`/persona/${personaId}/onboarding`)}
        >
          Review Onboarding
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
      <div className="flex items-center space-x-3">
        <Clock className="h-6 w-6 text-yellow-600" />
        <div>
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-300">
            Onboarding Required
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Complete the setup process to access all features.
          </p>
        </div>
      </div>
      <Button 
        size="sm" 
        className="mt-4"
        onClick={() => navigate(`/persona/${personaId}/onboarding`)}
      >
        Start Onboarding
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </Card>
  );
};
