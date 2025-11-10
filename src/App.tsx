import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { NotificationProvider } from './context/NotificationContext';
import { ChatbotProvider } from './components/chat/ChatbotProvider';
import { ChatSupportProvider } from './components/chat/ChatSupportProvider';
import { Toaster } from './components/ui/Toaster';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import LandingLayout from './components/layout/LandingLayout';
import DevTools from './components/DevTools';
import ToolkitLayout from './components/layout/ToolkitLayout';
import AssessmentLayout from './components/layout/AssessmentLayout';
import { setAppSetting, getAppSetting } from './utils/secureStorage';
import AnalyticsWrapper from './components/AnalyticsWrapper';
import { lazyWithRetry } from './utils/lazyWithRetry';

// Pages
import Landing from './pages/Landing';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import AcceptableUse from './pages/AcceptableUse';
import Features from './pages/Features';
import Demo from './pages/Demo';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
const Profile = lazy(() => import('./pages/account/Profile'));
const Settings = lazy(() => import('./pages/account/Settings'));
const Subscription = lazy(() => import('./pages/account/Subscription'));
import NotFound from './pages/NotFound';
import Integrations from './pages/Integrations';

// Assessment and Tools - Lazy loaded for better performance
const AssessmentHub = lazy(() => import('./pages/AssessmentHub'));
const PrivacyAssessment = lazy(() => import('./pages/tools-and-assessments/PrivacyAssessment'));
const PrivacyResults = lazy(() => import('./pages/tools-and-assessments/PrivacyResults'));
const PrivacyRecommendations = lazy(() => import('./pages/tools-and-assessments/PrivacyRecommendations'));
const GdprMapper = lazy(() => import('./pages/tools-and-assessments/GdprMapper'));
const PrivacyGapAnalyzer = lazy(() => import('./pages/tools-and-assessments/PrivacyGapAnalyzer'));
const PrivacyPolicyGenerator = lazy(() => import('./pages/tools-and-assessments/PrivacyPolicyGenerator'));
const PrivacyRightsManager = lazy(() => import('./pages/tools-and-assessments/PrivacyRightsManager'));
const PiiDataFlowMapper = lazy(() => import('./pages/tools-and-assessments/PiiDataFlowMapper'));

// Project Management - Lazy loaded with retry logic
const PrivacyProjectDashboard = lazyWithRetry(
  () => import('./pages/project/PrivacyProjectDashboard'),
  {
    maxRetries: 3,
    retryDelay: 1000,
    onError: (error, retryCount) => {
      console.warn(`PrivacyProjectDashboard import failed (retry ${retryCount}):`, error);
    }
  }
);
const PrivacyRoadmap = lazy(() => import('./pages/project/PrivacyRoadmap'));
const PrivacyRaci = lazy(() => import('./pages/project/PrivacyRaci'));
const PrivacyWbs = lazy(() => import('./pages/project/PrivacyWbs'));
const EvidenceVault = lazy(() => import('./pages/project/EvidenceVault'));

// Resources - Lazy loaded
const ResourcesLanding = lazy(() => import('./pages/ResourcesLanding'));
const Documentation = lazy(() => import('./pages/resources/Documentation'));
const Guides = lazy(() => import('./pages/resources/Guides'));
const Support = lazy(() => import('./pages/resources/Support'));

// Documentation Pages
import GdprGuide from './pages/resources/documentation/GdprGuide';
import AssessmentGuide from './pages/resources/documentation/AssessmentGuide';
import GettingStarted from './pages/resources/documentation/GettingStarted';
import QuickStart from './pages/resources/documentation/QuickStart';
import PlatformOverview from './pages/resources/documentation/PlatformOverview';
import UnderstandingDashboard from './pages/resources/documentation/UnderstandingDashboard';
import UnderstandingRmf from './pages/resources/documentation/UnderstandingRmf';
import ControlImplementationGuide from './pages/resources/documentation/ControlImplementationGuide';
import IncidentResponseGuide from './pages/resources/documentation/IncidentResponseGuide';
import IncidentReporting from './pages/resources/documentation/IncidentReporting';
import BreachResponseGuide from './pages/resources/documentation/BreachResponseGuide';
import Tutorials from './pages/resources/documentation/Tutorials';
import Faqs from './pages/resources/documentation/faqs';
import PrivacyFrameworkGuide from './pages/resources/documentation/PrivacyFrameworkGuide';

// Privacy-specific Guide Pages
import DataProtectionGuide from './pages/resources/guides/DataProtectionGuide';
import PrivacyByDesignGuide from './pages/resources/guides/PrivacyByDesignGuide';
import DataSubjectRightsGuide from './pages/resources/guides/DataSubjectRightsGuide';
import BreachNotificationGuide from './pages/resources/guides/BreachNotificationGuide';
import PrivacyImpactAssessmentGuide from './pages/resources/guides/PrivacyImpactAssessmentGuide';

// Privacy Role Journey Pages
import DataProtectionOfficerJourney from './pages/roles/DataProtectionOfficerJourney';
import LegalCounselJourney from './pages/roles/LegalCounselJourney';
import DataStewardJourney from './pages/roles/DataStewardJourney';
import PrivacyOfficerJourney from './pages/roles/PrivacyOfficerJourney';

// Template Viewers
import DpiaTemplateViewer from './pages/resources/viewers/DpiaTemplateViewer';
import CcpaPolicyViewer from './pages/resources/viewers/CcpaPolicyViewer';
import GdprChecklistViewer from './pages/resources/viewers/GdprChecklistViewer';
import PrivacyNoticeViewer from './pages/resources/viewers/PrivacyNoticeViewer';
import DataProcessingRecordViewer from './pages/resources/viewers/DataProcessingRecordViewer';
import BreachNotificationViewer from './pages/resources/viewers/BreachNotificationViewer';

// Support Pages
import ChatInterface from './pages/support/ChatInterface';

// Lazy load toolkit pages for better performance
const Toolkit = lazy(() => import('./pages/Toolkit'));
const DpiaGenerator = lazy(() => import('./pages/tools-and-assessments/DpiaGenerator'));
const EmployeeDigitalFootprintAssessment = lazy(() => import('./pages/tools-and-assessments/EmployeeDigitalFootprintAssessment'));
const DataBrokerRemovalManager = lazy(() => import('./pages/tools-and-assessments/DataBrokerRemovalManager'));
const PrivacySettingsAudit = lazy(() => import('./pages/tools-and-assessments/PrivacySettingsAudit'));
const PrivacyMaintenanceScheduler = lazy(() => import('./pages/tools-and-assessments/PrivacyMaintenanceScheduler'));

// Privacy Portal Tools - Lazy loaded
const ConsentManagement = lazy(() => import('./pages/tools-and-assessments/ConsentManagement'));
const VendorRiskAssessment = lazy(() => import('./pages/tools-and-assessments/VendorRiskAssessment'));
const RetentionPolicyGenerator = lazy(() => import('./pages/tools-and-assessments/RetentionPolicyGenerator'));
const DpiaManager = lazy(() => import('./pages/tools-and-assessments/DpiaManager'));
const PrivacyByDesignAssessment = lazy(() => import('./pages/tools-and-assessments/PrivacyByDesignAssessment'));
const ServiceProviderManager = lazy(() => import('./pages/tools-and-assessments/ServiceProviderManager'));
const IncidentResponseManager = lazy(() => import('./pages/tools-and-assessments/IncidentResponseManager'));

// Monetization pages
const TemplateStore = lazy(() => import('./pages/monetization/TemplateStore'));
const CreditsManager = lazy(() => import('./pages/monetization/CreditsManager'));

// Subscription enhancement pages
const NotificationCenter = lazy(() => import('./components/notifications/NotificationCenter'));
const ComplianceHealthDashboard = lazy(() => import('./pages/dashboard/ComplianceHealthDashboard'));
const AutomatedReports = lazy(() => import('./pages/reports/AutomatedReports'));
const ScheduledAssessments = lazy(() => import('./pages/assessments/ScheduledAssessments'));
const AlertManagement = lazy(() => import('./pages/alerts/AlertManagement'));
const RegulatoryIntelligence = lazy(() => import('./pages/regulatory/RegulatoryIntelligence'));
const ProgressTracking = lazy(() => import('./pages/dashboard/ProgressTracking'));

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = getAppSetting('darkMode');
        if (stored !== null && stored !== undefined) {
          return stored;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch (error) {
        console.warn('Error accessing dark mode setting:', error);
        return false;
      }
    }
    return false;
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      setAppSetting('darkMode', newValue);
      return newValue;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProjectProvider>
          <NotificationProvider>
            <ChatbotProvider>
              <ChatSupportProvider>
              <AnalyticsWrapper>
                <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
                <Routes>
                  {/* Main Layout Routes */}
                  <Route path="/" element={<LandingLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}>
                    <Route index element={<Landing />} />
                    <Route path="about" element={<About />} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="features" element={<Features />} />
                    <Route path="demo" element={<Demo />} />
                    <Route path="integrations" element={<Integrations />} />
                    <Route path="login" element={<Login />} />
                    <Route path="profile" element={<UserProfile />} />
                    
                    {/* Account Routes */}
                    <Route path="account/profile" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Profile />
                      </Suspense>
                    } />
                    <Route path="account/settings" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Settings />
                      </Suspense>
                    } />
                    <Route path="account/subscription" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Subscription />
                      </Suspense>
                    } />
                    
                    {/* Legal Pages */}
                    <Route path="privacy" element={<Privacy />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="cookies" element={<Cookies />} />
                    <Route path="acceptable-use" element={<AcceptableUse />} />
                    
                    {/* Assessment Hub */}
                    <Route path="assessment-hub" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <AssessmentHub />
                      </Suspense>
                    } />
                    
                    {/* Assessment Routes */}
                    <Route path="assessments" element={<AssessmentLayout />}>
                      <Route path="privacy-assessment" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <PrivacyAssessment />
                        </Suspense>
                      } />
                    </Route>
                    
                    {/* Results Pages */}
                    <Route path="privacy-results" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <PrivacyResults />
                      </Suspense>
                    } />
                    <Route path="privacy-recommendations" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <PrivacyRecommendations />
                      </Suspense>
                    } />
                    
                    {/* Project Management Routes */}
                    <Route path="project" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <PrivacyProjectDashboard />
                      </Suspense>
                    } />
                    <Route path="project/roadmap" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <PrivacyRoadmap />
                      </Suspense>
                    } />
                    <Route path="project/raci" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <PrivacyRaci />
                      </Suspense>
                    } />
                    <Route path="project/wbs" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <PrivacyWbs />
                      </Suspense>
                    } />
                    <Route path="project/evidence" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <EvidenceVault />
                      </Suspense>
                    } />
                    
                    {/* Toolkit Routes */}
                    <Route path="toolkit" element={<ToolkitLayout />}>
                      <Route index element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <Toolkit />
                        </Suspense>
                      } />
                      <Route path="privacy-gap-analyzer" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <PrivacyGapAnalyzer />
                        </Suspense>
                      } />
                      <Route path="privacy-policy-generator" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <PrivacyPolicyGenerator />
                        </Suspense>
                      } />
                      <Route path="gdpr-mapper" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <GdprMapper />
                        </Suspense>
                      } />
                      <Route path="pii-data-flow-mapper" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <PiiDataFlowMapper />
                        </Suspense>
                      } />
                      <Route path="privacy-rights-manager" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <PrivacyRightsManager />
                        </Suspense>
                      } />
                      <Route path="dpia-generator" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <DpiaGenerator />
                        </Suspense>
                      } />
                      <Route path="employee-digital-footprint" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <EmployeeDigitalFootprintAssessment />
                        </Suspense>
                      } />
                      <Route path="data-broker-removal" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <DataBrokerRemovalManager />
                        </Suspense>
                      } />
                      <Route path="privacy-settings-audit" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <PrivacySettingsAudit />
                        </Suspense>
                      } />
                      <Route path="privacy-maintenance-scheduler" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <PrivacyMaintenanceScheduler />
                        </Suspense>
                      } />
                      <Route path="consent-management" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <ConsentManagement />
                        </Suspense>
                      } />
                      <Route path="vendor-risk-assessment" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <VendorRiskAssessment />
                        </Suspense>
                      } />
                      <Route path="retention-policy-generator" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <RetentionPolicyGenerator />
                        </Suspense>
                      } />
                      <Route path="dpia-manager" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <DpiaManager />
                        </Suspense>
                      } />
                      <Route path="privacy-by-design-assessment" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <PrivacyByDesignAssessment />
                        </Suspense>
                      } />
                      <Route path="service-provider-manager" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <ServiceProviderManager />
                        </Suspense>
                      } />
                      <Route path="incident-response-manager" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <IncidentResponseManager />
                        </Suspense>
                      } />
                    </Route>
                    
                    {/* Monetization Routes */}
                    <Route path="monetization/templates" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <TemplateStore />
                      </Suspense>
                    } />
                    <Route path="monetization/credits" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <CreditsManager />
                      </Suspense>
                    } />
                    
                    {/* Subscription Enhancement Routes */}
                    <Route path="notifications" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <NotificationCenter />
                      </Suspense>
                    } />
                    <Route path="dashboard/compliance-health" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ComplianceHealthDashboard />
                      </Suspense>
                    } />
                    <Route path="reports/automated" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <AutomatedReports />
                      </Suspense>
                    } />
                    <Route path="assessments/scheduled" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ScheduledAssessments />
                      </Suspense>
                    } />
                    <Route path="alerts" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <AlertManagement />
                      </Suspense>
                    } />
                    <Route path="regulatory" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <RegulatoryIntelligence />
                      </Suspense>
                    } />
                    <Route path="dashboard/progress" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ProgressTracking />
                      </Suspense>
                    } />
                    
                    {/* Resources Routes */}
                    <Route path="resources-landing" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ResourcesLanding />
                      </Suspense>
                    } />
                    <Route path="documentation" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Documentation />
                      </Suspense>
                    } />
                    <Route path="guides" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Guides />
                      </Suspense>
                    } />
                    <Route path="support" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Support />
                      </Suspense>
                    } />
                    <Route path="support/chat" element={<ChatInterface />} />
                    
                    {/* Documentation Routes */}
                    <Route path="documentation/gdpr-implementation-guide" element={<GdprGuide />} />
                    <Route path="documentation/assessment-guide" element={<AssessmentGuide />} />
                    <Route path="documentation/getting-started" element={<GettingStarted />} />
                    <Route path="documentation/quick-start" element={<QuickStart />} />
                    <Route path="documentation/platform-overview" element={<PlatformOverview />} />
                    <Route path="documentation/understanding-dashboard" element={<UnderstandingDashboard />} />
                    <Route path="documentation/understanding-rmf" element={<UnderstandingRmf />} />
                    <Route path="documentation/control-implementation-guide" element={<ControlImplementationGuide />} />
                    <Route path="documentation/incident-response-guide" element={<IncidentResponseGuide />} />
                    <Route path="documentation/incident-reporting" element={<IncidentReporting />} />
                    <Route path="documentation/breach-response-guide" element={<BreachResponseGuide />} />
                    <Route path="documentation/tutorials" element={<Tutorials />} />
                    <Route path="documentation/faqs" element={<Faqs />} />
                    <Route path="documentation/privacy-framework-guide" element={<PrivacyFrameworkGuide />} />
                    
                    {/* Guide Routes */}
                    <Route path="guides/data-protection" element={<DataProtectionGuide />} />
                    <Route path="guides/privacy-by-design" element={<PrivacyByDesignGuide />} />
                    <Route path="guides/data-subject-rights" element={<DataSubjectRightsGuide />} />
                    <Route path="guides/breach-notification" element={<BreachNotificationGuide />} />
                    <Route path="guides/privacy-impact-assessment" element={<PrivacyImpactAssessmentGuide />} />
                    
                    {/* Role Journey Routes */}
                    <Route path="roles/data-protection-officer" element={<DataProtectionOfficerJourney />} />
                    <Route path="roles/legal-counsel" element={<LegalCounselJourney />} />
                    <Route path="roles/data-steward" element={<DataStewardJourney />} />
                    <Route path="roles/privacy-officer" element={<PrivacyOfficerJourney />} />
                    
                    {/* Template Viewer Routes */}
                    <Route path="toolkit/resources/viewers/dpia-template" element={<DpiaTemplateViewer />} />
                    <Route path="toolkit/resources/viewers/ccpa-policy" element={<CcpaPolicyViewer />} />
                    <Route path="toolkit/resources/viewers/gdpr-checklist" element={<GdprChecklistViewer />} />
                    <Route path="toolkit/resources/viewers/privacy-notice" element={<PrivacyNoticeViewer />} />
                    <Route path="toolkit/resources/viewers/data-processing-record" element={<DataProcessingRecordViewer />} />
                    <Route path="toolkit/resources/viewers/breach-notification" element={<BreachNotificationViewer />} />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
                
                <Toaster />
                <DevTools />
                </div>
              </AnalyticsWrapper>
              </ChatSupportProvider>
            </ChatbotProvider>
          </NotificationProvider>
        </ProjectProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;