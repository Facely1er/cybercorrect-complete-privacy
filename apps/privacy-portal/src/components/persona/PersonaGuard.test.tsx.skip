import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PersonaGuard } from '../components/persona/PersonaGuard';

// Mock the persona context
const mockPersonaContext = {
  selectedPersona: 'worker',
  hasCompletedOnboarding: vi.fn(() => true),
  setSelectedPersona: vi.fn(),
  getPersonaConfig: vi.fn(() => ({
    id: 'worker',
    name: 'Current Employee',
    description: 'Test description',
    features: [],
    regulations: [],
  })),
};

vi.mock('../contexts/PersonaContext', () => ({
  usePersona: () => mockPersonaContext,
}));

// Mock the brand context
vi.mock('../hooks/useBrand', () => ({
  useBrand: () => ({
    brand: {
      productNameWithTM: 'CyberCorrect™ Privacy Portal',
    },
  }),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('PersonaGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when persona is selected and onboarding is completed', () => {
    render(
      <TestWrapper>
        <PersonaGuard>
          <div>Protected content</div>
        </PersonaGuard>
      </TestWrapper>
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects to persona selection when no persona is selected', () => {
    mockPersonaContext.selectedPersona = null;
    
    render(
      <TestWrapper>
        <PersonaGuard>
          <div>Protected content</div>
        </PersonaGuard>
      </TestWrapper>
    );

    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('redirects to onboarding when persona is selected but onboarding is not completed', () => {
    mockPersonaContext.selectedPersona = 'worker';
    mockPersonaContext.hasCompletedOnboarding.mockReturnValue(false);
    
    render(
      <TestWrapper>
        <PersonaGuard>
          <div>Protected content</div>
        </PersonaGuard>
      </TestWrapper>
    );

    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockPersonaContext.hasCompletedOnboarding.mockImplementation(() => {
      // Simulate async check
      return new Promise(resolve => setTimeout(() => resolve(true), 100));
    });
    
    render(
      <TestWrapper>
        <PersonaGuard>
          <div>Protected content</div>
        </PersonaGuard>
      </TestWrapper>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles persona context errors gracefully', () => {
    mockPersonaContext.getPersonaConfig.mockImplementation(() => {
      throw new Error('Persona config error');
    });
    
    render(
      <TestWrapper>
        <PersonaGuard>
          <div>Protected content</div>
        </PersonaGuard>
      </TestWrapper>
    );

    expect(screen.getByText('Error loading persona configuration')).toBeInTheDocument();
  });

  it('allows custom fallback component', () => {
    mockPersonaContext.selectedPersona = null;
    
    render(
      <TestWrapper>
        <PersonaGuard fallback={<div>Custom fallback</div>}>
          <div>Protected content</div>
        </PersonaGuard>
      </TestWrapper>
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  it('calls onPersonaChange when persona changes', () => {
    const onPersonaChange = vi.fn();
    
    render(
      <TestWrapper>
        <PersonaGuard onPersonaChange={onPersonaChange}>
          <div>Protected content</div>
        </PersonaGuard>
      </TestWrapper>
    );

    expect(onPersonaChange).toHaveBeenCalledWith('worker');
  });

  it('validates persona configuration', () => {
    mockPersonaContext.getPersonaConfig.mockReturnValue({
      id: 'worker',
      name: 'Current Employee',
      description: 'Test description',
      features: ['feature1', 'feature2'],
      regulations: ['ADA', 'CCPA'],
    });
    
    render(
      <TestWrapper>
        <PersonaGuard>
          <div>Protected content</div>
        </PersonaGuard>
      </TestWrapper>
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('handles invalid persona configuration', () => {
    mockPersonaContext.getPersonaConfig.mockReturnValue(null);
    
    render(
      <TestWrapper>
        <PersonaGuard>
          <div>Protected content</div>
        </PersonaGuard>
      </TestWrapper>
    );

    expect(screen.getByText('Invalid persona configuration')).toBeInTheDocument();
  });
});
