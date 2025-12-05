import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './hooks/useAuth';
import { PersonaProvider } from './contexts/PersonaContext';
import { ErrorBoundary } from './common/ErrorBoundary';
import { ProtectedRoute, AdminRoute, HRRoute } from './components/auth/ProtectedRoute';
import { initializeAccessibility } from './utils/accessibility';
import { LoadingState } from './common/LoadingState';
import { logger } from './utils/logger';

// Layout components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Core pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorks';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { LegalPage } from './pages/LegalPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { AcceptableUsePolicyPage } from './pages/AcceptableUsePolicyPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { PrivacyPortalPage } from './pages/PrivacyPortalPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

// Authentication pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { PersonaSelectionPage } from './pages/PersonaSelectionPage';
import { OnboardingPage } from './pages/OnboardingPage';

// Privacy portal pages - lazy loaded for better performance
const DataRightsExercisePage = lazy(() => import('./pages/DataRightsExercisePage').then(m => ({ default: m.DataRightsExercisePage })));
const StakeholderDutiesPage = lazy(() => import('./pages/StakeholderDutiesPage').then(m => ({ default: m.StakeholderDutiesPage })));
const PrivacyDashboardPage = lazy(() => import('./pages/privacy/PrivacyDashboardPage').then(m => ({ default: m.PrivacyDashboardPage })));
const ComplianceObligationsPage = lazy(() => import('./pages/privacy/ComplianceObligationsPage').then(m => ({ default: m.ComplianceObligationsPage })));
const PrivacyIncidentsPage = lazy(() => import('./pages/privacy/PrivacyIncidentsPage').then(m => ({ default: m.PrivacyIncidentsPage })));
const VendorAssessmentsPage = lazy(() => import('./pages/privacy/VendorAssessmentsPage').then(m => ({ default: m.VendorAssessmentsPage })));
const ConsentManagementPage = lazy(() => import('./pages/privacy/ConsentManagementPage').then(m => ({ default: m.ConsentManagementPage })));
const StakeholderManagementPage = lazy(() => import('./pages/privacy/StakeholderManagementPage').then(m => ({ default: m.StakeholderManagementPage })));
const AutomationPage = lazy(() => import('./pages/privacy/AutomationPage').then(m => ({ default: m.AutomationPage })));
const AnalyticsPage = lazy(() => import('./pages/privacy/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const ReportsPage = lazy(() => import('./pages/privacy/ReportsPage').then(m => ({ default: m.ReportsPage })));
const DataRightsPortalPage = lazy(() => import('./pages/privacy/DataRightsPortalPage').then(m => ({ default: m.DataRightsPortalPage })));
const TrainingPage = lazy(() => import('./pages/TrainingPage').then(m => ({ default: m.TrainingPage })));
const ResourceDetailPage = lazy(() => import('./pages/ResourceDetailPage').then(m => ({ default: m.ResourceDetailPage })));

// Persona components - lazy loaded for better performance
const PersonaOnboarding = lazy(() => import('./components/persona/PersonaOnboarding').then(m => ({ default: m.PersonaOnboarding })));
const PersonaDashboard = lazy(() => import('./components/persona/PersonaDashboard').then(m => ({ default: m.PersonaDashboard })));
const PersonaGuard = lazy(() => import('./components/persona/PersonaGuard').then(m => ({ default: m.PersonaGuard })));

// New privacy compliance modules - lazy loaded for better performance
const DataInventoryPage = lazy(() => import('./pages/privacy/DataInventoryPage').then(m => ({ default: m.DataInventoryPage })));
const PrivacyByDesignPage = lazy(() => import('./pages/privacy/PrivacyByDesignPage').then(m => ({ default: m.PrivacyByDesignPage })));
const DPIAPage = lazy(() => import('./pages/privacy/DPIAPage').then(m => ({ default: m.DPIAPage })));
const DataLawfulnessPage = lazy(() => import('./pages/privacy/DataLawfulnessPage').then(m => ({ default: m.DataLawfulnessPage })));
const RetentionPolicyPage = lazy(() => import('./pages/privacy/RetentionPolicyPage').then(m => ({ default: m.RetentionPolicyPage })));
const IndustryCompliancePage = lazy(() => import('./pages/privacy/IndustryCompliancePage').then(m => ({ default: m.IndustryCompliancePage })));
const ServiceProviderPage = lazy(() => import('./pages/privacy/ServiceProviderPage').then(m => ({ default: m.ServiceProviderPage })));
const SensitiveDataPage = lazy(() => import('./pages/privacy/SensitiveDataPage').then(m => ({ default: m.SensitiveDataPage })));

// Persona-specific components - lazy loaded for better performance
const PersonaGuidanceSystem = lazy(() => import('./components/persona/PersonaGuidanceSystem').then(m => ({ default: m.PersonaGuidanceSystem })));
const WorkflowStepComponent = lazy(() => import('./components/persona/workflow/WorkflowStepComponent').then(m => ({ default: m.WorkflowStepComponent })));
import { personaWorkflowService } from './services/personaWorkflowService';

// Wrapper components for routing
const PersonaGuidanceWrapper = () => {
  const { personaId } = useParams<{ personaId: string }>();
  const navigate = useNavigate();
  
  return (
    <PersonaGuidanceSystem 
      personaId={personaId || ""} 
      onStartWorkflow={(workflowId: string) => {
        navigate(`/persona/${personaId}/workflow/${workflowId}/welcome`);
      }} 
    />
  );
};

const WorkflowStepWrapper = () => {
  const { personaId, workflowId, stepId } = useParams<{ personaId: string; workflowId: string; stepId: string }>();
  const navigate = useNavigate();
  
  // Get the actual step from the workflow service
  const step = personaWorkflowService.getWorkflowSteps(personaId || '', workflowId || '').find(s => s.id === stepId);
  
  if (!step) {
    return <div>Step not found</div>;
  }
  
  return (
    <WorkflowStepComponent 
      step={step} 
      workflowId={workflowId || ""} 
      onStepComplete={(stepId: string, data: Record<string, unknown>) => {
        // Handle step completion
        logger.info('Step completed', { stepId, data }, { component: 'WorkflowStep', operation: 'stepComplete' });
      }} 
      onStepBack={() => {
        navigate(`/persona/${personaId}/dashboard`);
      }} 
      progress={0} 
    />
  );
};

function App() {
  useEffect(() => {
    // Initialize accessibility features
    initializeAccessibility();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="theme">
        <AuthProvider>
          <PersonaProvider>
            <NotificationProvider>
            <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Skip link for accessibility */}
            <a 
              href="#main-content" 
              className="skip-link focus-visible"
              onFocus={(e) => e.target.classList.add('focus-visible')}
              onBlur={(e) => e.target.classList.remove('focus-visible')}
            >
              Skip to main content
            </a>
            
            <Header />
            
            <main id="main-content" className="flex-1 focus:outline-none pt-16" tabIndex={-1}>
              <Routes>
                {/* Public pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/training" element={
                  <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading training..." />}>
                    <TrainingPage />
                  </Suspense>
                } />
                <Route path="/resources/:slug" element={
                  <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading resource..." />}>
                    <ResourceDetailPage />
                  </Suspense>
                } />
                <Route path="/legal" element={<LegalPage />} />
                {/* Policy routes - redirect to centralized policies on framework-compliance */}
                <Route path="/terms" element={
                  <Navigate 
                    to={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.platform.cybercorrect.com'}/terms`} 
                    replace 
                  />
                } />
                <Route path="/privacy-policy" element={
                  <Navigate 
                    to={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.platform.cybercorrect.com'}/privacy`} 
                    replace 
                  />
                } />
                <Route path="/acceptable-use-policy" element={
                  <Navigate 
                    to={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.platform.cybercorrect.com'}/acceptable-use`} 
                    replace 
                  />
                } />
                <Route path="/cookie-policy" element={
                  <Navigate 
                    to={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.platform.cybercorrect.com'}/cookies`} 
                    replace 
                  />
                } />

                {/* Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                {/* Onboarding */}
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                } />
                
                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <PersonaSelectionPage />
                  </ProtectedRoute>
                } />

                {/* Privacy portal entry points */}
                <Route path="/data-rights" element={
                  <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading data rights exercise..." />}>
                    <DataRightsExercisePage />
                  </Suspense>
                } />
                <Route path="/stakeholder-duties" element={
                  <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading stakeholder duties..." />}>
                    <StakeholderDutiesPage />
                  </Suspense>
                } />

                {/* Privacy portal routes */}
                <Route path="/privacy" element={<PrivacyPortalPage />} />
                <Route path="/privacy/dashboard" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading privacy dashboard..." />}>
                      <PrivacyDashboardPage />
                    </Suspense>
                  </HRRoute>
                } />
                <Route path="/privacy/data-rights" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading data rights portal..." />}>
                      <DataRightsPortalPage />
                    </Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/privacy/obligations" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading compliance obligations..." />}>
                      <ComplianceObligationsPage />
                    </Suspense>
                  </HRRoute>
                } />
                <Route path="/privacy/incidents" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading privacy incidents..." />}>
                      <PrivacyIncidentsPage />
                    </Suspense>
                  </HRRoute>
                } />
                <Route path="/privacy/vendors" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading vendor assessments..." />}>
                      <VendorAssessmentsPage />
                    </Suspense>
                  </HRRoute>
                } />
                <Route path="/privacy/consent" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading consent management..." />}>
                      <ConsentManagementPage />
                    </Suspense>
                  </HRRoute>
                } />
                <Route path="/privacy/stakeholders" element={
                  <AdminRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading stakeholder management..." />}>
                      <StakeholderManagementPage />
                    </Suspense>
                  </AdminRoute>
                } />
                <Route path="/privacy/automation" element={
                  <AdminRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading automation settings..." />}>
                      <AutomationPage />
                    </Suspense>
                  </AdminRoute>
                } />
                <Route path="/privacy/analytics" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading analytics dashboard..." />}>
                      <AnalyticsPage />
                    </Suspense>
                  </HRRoute>
                } />
                <Route path="/privacy/reports" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading reports..." />}>
                      <ReportsPage />
                    </Suspense>
                  </HRRoute>
                } />

                {/* New privacy compliance modules */}
                <Route path="/privacy/data-inventory" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading data inventory..." />}>
                      <DataInventoryPage />
                    </Suspense>
                  </HRRoute>
                } />
                <Route path="/privacy/privacy-by-design" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading privacy by design..." />}>
                      <PrivacyByDesignPage />
                    </Suspense>
                  </HRRoute>
                } />
                <Route path="/privacy/dpia" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading DPIA assessments..." />}>
                      <DPIAPage />
                    </Suspense>
                  </HRRoute>
                } />
                <Route path="/privacy/data-lawfulness" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading data lawfulness assessments..." />}>
                      <DataLawfulnessPage />
                    </Suspense>
                  </HRRoute>
                } />
                <Route path="/privacy/retention-policy" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading retention policy management..." />}>
                      <RetentionPolicyPage />
                    </Suspense>
                  </HRRoute>
                } />
                <Route path="/privacy/industry-compliance" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading industry compliance..." />}>
                      <IndustryCompliancePage />
                    </Suspense>
                  </HRRoute>
                } />
                <Route path="/privacy/service-providers" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading service provider management..." />}>
                      <ServiceProviderPage />
                    </Suspense>
                  </HRRoute>
                } />
                <Route path="/privacy/sensitive-data" element={
                  <HRRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading sensitive data management..." />}>
                      <SensitiveDataPage />
                    </Suspense>
                  </HRRoute>
                } />

                {/* Persona-specific routes */}
                <Route path="/persona/:personaId/onboarding" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading onboarding..." />}>
                      <PersonaGuard>
                        <PersonaOnboarding />
                      </PersonaGuard>
                    </Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/persona/:personaId/dashboard" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading persona dashboard..." />}>
                      <PersonaGuard>
                        <PersonaDashboard />
                      </PersonaGuard>
                    </Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/persona/:personaId/guidance" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading persona guidance..." />}>
                      <PersonaGuard>
                        <PersonaGuidanceWrapper />
                      </PersonaGuard>
                    </Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/persona/:personaId/workflow/:workflowId/:stepId" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingState loading={true} loadingMessage="Loading workflow step..." />}>
                      <PersonaGuard>
                        <WorkflowStepWrapper />
                      </PersonaGuard>
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
            </NotificationProvider>
          </PersonaProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;