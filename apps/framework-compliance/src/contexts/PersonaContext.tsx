import React, { useEffect, useState } from 'react';
import { 
  Persona, 
  getPersonaByRole, 
  getPersonaById,
  PersonaFeature,
  UseCase,
  DashboardSection,
  NavigationItem,
  OnboardingStep
} from '../types/personas';
import { useAuth } from './AuthContext';
import { secureStorage } from '../utils/storage';

interface PersonaContextType {
  currentPersona: Persona | null;
  personaFeatures: PersonaFeature[];
  personaUseCases: UseCase[];
  isLoading: boolean;
  error: string | null;
  switchPersona: (personaId: string) => void;
  getPersonaDashboardSections: () => DashboardSection[];
  getPersonaNavigationItems: () => NavigationItem[];
  getPersonaOnboardingSteps: () => OnboardingStep[];
  hasCompletedOnboarding: (personaId: string) => boolean;
  markOnboardingComplete: (personaId: string) => void;
  getSelectedPersona: () => string | null;
  setSelectedPersona: (personaId: string) => void;
}

export const PersonaContext = React.createContext<PersonaContextType | undefined>(undefined);

export const usePersona = () => {
  const context = React.useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};

interface PersonaProviderProps {
  children: React.ReactNode;
}

export const PersonaProvider: React.FC<PersonaProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load persona based on user role or selected persona
  useEffect(() => {
    const loadPersona = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First check if user has a selected persona preference
        const selectedPersonaId = getSelectedPersona();
        if (selectedPersonaId) {
          const persona = getPersonaById(selectedPersonaId);
          if (persona) {
            setCurrentPersona(persona);
            setIsLoading(false);
            return;
          }
        }

        // Fallback to role-based persona selection
        if (user?.role) {
          const persona = getPersonaByRole(user.role);
          if (persona) {
            setCurrentPersona(persona);
          } else {
            // Default to privacy officer if role doesn't match
            setCurrentPersona(getPersonaById('privacy_officer') || null);
          }
        } else {
          // No user or role, set to null
          setCurrentPersona(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load persona');
      } finally {
        setIsLoading(false);
      }
    };

    loadPersona();
  }, [user]);

  const switchPersona = (personaId: string) => {
    const persona = getPersonaById(personaId);
    if (persona) {
      setCurrentPersona(persona);
      setSelectedPersona(personaId);
      setError(null);
    } else {
      setError(`Persona not found: ${personaId}`);
    }
  };

  const getPersonaDashboardSections = () => {
    return currentPersona?.dashboardSections || [];
  };

  const getPersonaNavigationItems = () => {
    return currentPersona?.navigationItems || [];
  };

  const getPersonaOnboardingSteps = () => {
    return currentPersona?.onboardingSteps || [];
  };

  const hasCompletedOnboarding = (personaId: string) => {
    const completedSteps = secureStorage.getItem<string[]>(`onboarding_${personaId}_completed`);
    return completedSteps !== null && completedSteps.length > 0;
  };

  const markOnboardingComplete = (personaId: string) => {
    const onboardingSteps = getPersonaOnboardingSteps();
    const allStepIds = onboardingSteps.map(step => step.id);
    secureStorage.setItem(`onboarding_${personaId}_completed`, allStepIds);
  };

  const getSelectedPersona = (): string | null => {
    return secureStorage.getItem<string>('selectedPersona');
  };

  const setSelectedPersona = (personaId: string) => {
    secureStorage.setItem('selectedPersona', personaId);
  };

  const personaFeatures = currentPersona?.features || [];
  const personaUseCases = currentPersona?.primaryUseCases || [];

  const value: PersonaContextType = {
    currentPersona,
    personaFeatures,
    personaUseCases,
    isLoading,
    error,
    switchPersona,
    getPersonaDashboardSections,
    getPersonaNavigationItems,
    getPersonaOnboardingSteps,
    hasCompletedOnboarding,
    markOnboardingComplete,
    getSelectedPersona,
    setSelectedPersona
  };

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
};

