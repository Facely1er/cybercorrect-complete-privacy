import { createContext, useContext } from 'react';
import { Persona, UseCase, PersonaFeature, DashboardSection, NavigationItem, OnboardingStep } from '../types/personas';

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
  // New onboarding-related methods
  hasCompletedOnboarding: (personaId: string) => boolean;
  markOnboardingComplete: (personaId: string) => void;
  getSelectedPersona: () => string | null;
  setSelectedPersona: (personaId: string) => void;
}

export const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};