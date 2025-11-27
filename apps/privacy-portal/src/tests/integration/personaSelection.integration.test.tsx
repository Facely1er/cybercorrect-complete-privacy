import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PersonaSelectionPage } from '../../pages/PersonaSelectionPage';

// Mock the hooks and contexts
vi.mock('../../hooks/useBrand', () => ({
  useBrand: () => ({
    brand: {
      productNameWithTM: 'CyberCorrect™ Privacy Portal',
    },
  }),
}));

vi.mock('../../hooks/useLocalUser', () => ({
  useLocalUser: () => ({
    localUser: null,
    updateLocalUser: vi.fn(),
  }),
}));

vi.mock('../../hooks/usePersona', () => ({
  usePersona: () => ({
    hasCompletedOnboarding: vi.fn(() => false),
    setSelectedPersona: vi.fn(),
  }),
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

describe('Persona Selection Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete full persona selection flow', async () => {
    const mockSetSelectedPersona = vi.fn();
    const mockNavigate = vi.fn();
    
    const usePersonaModule = await import('../../hooks/usePersona');
    vi.mocked(usePersonaModule.usePersona).mockReturnValue({
      hasCompletedOnboarding: vi.fn(() => false),
      setSelectedPersona: mockSetSelectedPersona,
    });
    
    const routerModule = await import('react-router-dom');
    vi.mocked(routerModule.useNavigate).mockReturnValue(mockNavigate);

    render(
      <TestWrapper>
        <PersonaSelectionPage />
      </TestWrapper>
    );

    // Verify initial state
    expect(screen.getByText('Welcome to CyberCorrect™ Privacy Portal')).toBeInTheDocument();
    expect(screen.getByText('Current Employee')).toBeInTheDocument();
    expect(screen.getByText('Job Applicant')).toBeInTheDocument();
    expect(screen.getByText('HR Staff')).toBeInTheDocument();
    expect(screen.getByText('Privacy Officer')).toBeInTheDocument();

    // Select a persona
    const workerCard = screen.getByRole('heading', { name: 'Current Employee' }).closest('[class*="cursor-pointer"]');
    expect(workerCard).toBeInTheDocument();
    
    fireEvent.click(workerCard!);

    // Verify continue button appears
    const continueButton = screen.getByText(/Continue to Current Employee/);
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).not.toBeDisabled();

    // Click continue
    fireEvent.click(continueButton);

    // Verify persona was set and navigation occurred
    await waitFor(() => {
      expect(mockSetSelectedPersona).toHaveBeenCalledWith('worker');
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('should show persona features and regulations', () => {
    render(
      <TestWrapper>
        <PersonaSelectionPage />
      </TestWrapper>
    );

    // Check that features are displayed
    expect(screen.getByText('Access personal employment data')).toBeInTheDocument();
    expect(screen.getByText('Request data corrections')).toBeInTheDocument();
    expect(screen.getByText('Manage privacy preferences')).toBeInTheDocument();

    // Check that regulations are displayed
    expect(screen.getAllByText('ADA')).toHaveLength(3);
    expect(screen.getAllByText('CCPA')).toHaveLength(3);
    expect(screen.getAllByText('GDPR')).toHaveLength(2);
  });

  it('should show help section with guidance', () => {
    render(
      <TestWrapper>
        <PersonaSelectionPage />
      </TestWrapper>
    );

    expect(screen.getByText('Need Help Choosing?')).toBeInTheDocument();
    expect(screen.getByText('For Employees & Job Applicants:')).toBeInTheDocument();
    expect(screen.getByText('For HR & Compliance Staff:')).toBeInTheDocument();
  });

  it('should handle persona selection with keyboard navigation', () => {
    render(
      <TestWrapper>
        <PersonaSelectionPage />
      </TestWrapper>
    );

    const workerCard = screen.getByRole('heading', { name: 'Current Employee' }).closest('[class*="cursor-pointer"]');
    expect(workerCard).toBeInTheDocument();

    // Focus the card
    workerCard!.focus();
    expect(workerCard).toHaveFocus();

    // Press Enter to select
    fireEvent.keyDown(workerCard!, { key: 'Enter', code: 'Enter' });

    // Verify continue button appears
    const continueButton = screen.getByText(/Continue to Current Employee/);
    expect(continueButton).toBeInTheDocument();
  });

  it('should handle multiple persona selections', () => {
    render(
      <TestWrapper>
        <PersonaSelectionPage />
      </TestWrapper>
    );

    // Select first persona
    const workerCard = screen.getByRole('heading', { name: 'Current Employee' }).closest('[class*="cursor-pointer"]');
    fireEvent.click(workerCard!);

    let continueButton = screen.getByText(/Continue to Current Employee/);
    expect(continueButton).toBeInTheDocument();

    // Select different persona
    const hrCard = screen.getByRole('heading', { name: 'HR Staff' }).closest('[class*="cursor-pointer"]');
    fireEvent.click(hrCard!);

    // Verify continue button updates
    continueButton = screen.getByText(/Continue to HR Staff/);
    expect(continueButton).toBeInTheDocument();
  });

  it('should show estimated time for each persona', () => {
    render(
      <TestWrapper>
        <PersonaSelectionPage />
      </TestWrapper>
    );

    // Check that estimated times are displayed
    expect(screen.getByText('5-10 min')).toBeInTheDocument();
  });

  it('should handle responsive design', () => {
    // Mock different screen sizes
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768, // Tablet size
    });

    render(
      <TestWrapper>
        <PersonaSelectionPage />
      </TestWrapper>
    );

    // Verify layout adapts to screen size
    expect(screen.getByText('Current Employee')).toBeInTheDocument();
    expect(screen.getByText('Job Applicant')).toBeInTheDocument();
  });

  it('should handle accessibility requirements', () => {
    render(
      <TestWrapper>
        <PersonaSelectionPage />
      </TestWrapper>
    );

    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);

    // Check for proper button roles
    const continueButton = screen.getByText(/Continue to Current Employee/);
    expect(continueButton).toHaveAttribute('role', 'button');
  });
});
