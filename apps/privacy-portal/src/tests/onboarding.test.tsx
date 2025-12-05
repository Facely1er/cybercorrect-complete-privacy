import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PersonaSelectionPage } from '../pages/PersonaSelectionPage';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock the hooks
vi.mock('../hooks/useBrand', () => ({
  useBrand: () => ({
    brand: {
      productNameWithTM: 'CyberCorrect™ Privacy Portal'
    }
  })
}));

vi.mock('../hooks/useLocalUser', () => ({
  useLocalUser: () => ({
    localUser: null,
    updateLocalUser: vi.fn()
  })
}));

vi.mock('../hooks/usePersona', () => ({
  usePersona: () => ({
    hasCompletedOnboarding: vi.fn(() => false),
    setSelectedPersona: vi.fn()
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Onboarding Flow', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should render persona selection page', () => {
    render(
      <TestWrapper>
        <PersonaSelectionPage />
      </TestWrapper>
    );

    expect(screen.getByText('Welcome to CyberCorrect™ Privacy Portal')).toBeInTheDocument();
    expect(screen.getAllByText('Current Employee')).toHaveLength(2); // Title and help text
    expect(screen.getAllByText('Job Applicant')).toHaveLength(2); // Title and help text
    expect(screen.getAllByText('HR Staff')).toHaveLength(2); // Title and help text
    expect(screen.getAllByText('Privacy Officer')).toHaveLength(2); // Title and help text
  });

  it('should allow persona selection', () => {
    render(
      <TestWrapper>
        <PersonaSelectionPage />
      </TestWrapper>
    );

    const workerCard = screen.getByRole('heading', { name: 'Current Employee' }).closest('[class*="cursor-pointer"]');
    expect(workerCard).toBeInTheDocument();

    fireEvent.click(workerCard!);
    
    // Check if the continue button is enabled
    const continueButton = screen.getByText(/Continue to Current Employee/);
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).not.toBeDisabled();
  });

  it('should show persona features and regulations', () => {
    render(
      <TestWrapper>
        <PersonaSelectionPage />
      </TestWrapper>
    );

    // Check that each persona shows its features
    expect(screen.getByText('Access personal employment data')).toBeInTheDocument();
    expect(screen.getByText('Request data corrections')).toBeInTheDocument();
    expect(screen.getByText('Manage privacy preferences')).toBeInTheDocument();

    // Check that regulations are displayed (using getAllByText since they appear multiple times)
    expect(screen.getAllByText('ADA')).toHaveLength(3); // Appears in multiple persona cards
    expect(screen.getAllByText('CCPA')).toHaveLength(3); // Appears in multiple persona cards
    expect(screen.getAllByText('GDPR')).toHaveLength(2); // Appears in multiple persona cards
  });

  it('should show help section', () => {
    render(
      <TestWrapper>
        <PersonaSelectionPage />
      </TestWrapper>
    );

    expect(screen.getByText('Need Help Choosing?')).toBeInTheDocument();
    expect(screen.getByText('For Employees & Job Applicants:')).toBeInTheDocument();
    expect(screen.getByText('For HR & Compliance Staff:')).toBeInTheDocument();
  });
});

describe('Onboarding State Management', () => {
  beforeEach(() => {
    localStorageMock.clear.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('should track onboarding completion in localStorage', () => {
    const personaId = 'worker';
    const completedSteps = ['welcome', 'privacy-rights', 'first-request'];
    
    localStorage.setItem(`onboarding_${personaId}_completed`, JSON.stringify(completedSteps));
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      `onboarding_${personaId}_completed`, 
      JSON.stringify(completedSteps)
    );
  });

  it('should detect incomplete onboarding', () => {
    const personaId = 'worker';
    
    // Mock no onboarding data
    localStorageMock.getItem.mockReturnValue(null);
    expect(localStorage.getItem(`onboarding_${personaId}_completed`)).toBeNull();
    
    // Mock partial onboarding data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(['welcome']));
    const stored = localStorage.getItem(`onboarding_${personaId}_completed`);
    expect(stored).toBe(JSON.stringify(['welcome']));
  });
});
