import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuthContext';
import { Persona, getPersonaByRole, getPersonaById } from '../types/personas';
import { PersonaContext } from '../hooks/usePersona';
import { useLocalUser } from '../hooks/useLocalUser';

export const PersonaProvider = ({ children }: { children: React.ReactNode }) => {
  const { userRole, isAuthenticated } = useAuth();
  const { localUser, updateLocalUser } = useLocalUser();
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
            return;
          }
        }

        // Fallback to role-based persona selection
        if (!isAuthenticated || !userRole) {
          setCurrentPersona(null);
          return;
        }

        const persona = getPersonaByRole(userRole);
        if (persona) {
          setCurrentPersona(persona);
        } else {
          setError(`No persona found for role: ${userRole}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load persona');
      } finally {
        setIsLoading(false);
      }
    };

    loadPersona();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userRole, localUser]);

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

  // New onboarding-related methods
  const hasCompletedOnboarding = (personaId: string) => {
    const completedSteps = localStorage.getItem(`onboarding_${personaId}_completed`);
    return completedSteps !== null;
  };

  const markOnboardingComplete = (personaId: string) => {
    const onboardingSteps = getPersonaOnboardingSteps();
    const allStepIds = onboardingSteps.map(step => step.id);
    localStorage.setItem(`onboarding_${personaId}_completed`, JSON.stringify(allStepIds));
  };

  const getSelectedPersona = () => {
    // First check local user preferences
    if (localUser?.preferences?.selectedPersona) {
      return localUser.preferences.selectedPersona as string;
    }
    
    // Fallback to localStorage
    return localStorage.getItem('selectedPersona');
  };

  const setSelectedPersona = (personaId: string) => {
    localStorage.setItem('selectedPersona', personaId);
    
    // Also update local user preferences if available
    if (localUser && updateLocalUser) {
      updateLocalUser({ 
        preferences: { 
          ...localUser.preferences, 
          selectedPersona: personaId 
        } 
      });
    }
  };

  const personaFeatures = currentPersona?.features || [];
  const personaUseCases = currentPersona?.primaryUseCases || [];

  const value = {
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