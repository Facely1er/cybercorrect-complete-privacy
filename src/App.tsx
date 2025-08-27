import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { ChatbotProvider } from './components/chat/ChatbotProvider';
import { ChatSupportProvider } from './components/chat/ChatSupportProvider';
import { Toaster } from './components/ui/Toaster';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import LandingLayout from './components/layout/LandingLayout';
import DevTools from './components/DevTools';
import ToolkitLayout from './components/layout/ToolkitLayout';
import AssessmentLayout from './components/layout/AssessmentLayout';

// Pages
import Landing from './pages/Landing';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Features from './pages/Features';
import Demo from './pages/Demo';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import Integrations from './pages/Integrations';

// Assessment and Tools
import AssessmentHub from './pages/AssessmentHub';
import PrivacyAssessment from './pages/tools-and-assessments/PrivacyAssessment';
import PrivacyResults from './pages/tools-and-assessments/PrivacyResults';
import PrivacyRecommendations from './pages/tools-and-assessments/PrivacyRecommendations';
import GdprMapper from './pages/tools-and-assessments/GdprMapper';
import PrivacyGapAnalyzer from './pages/tools-and-assessments/PrivacyGapAnalyzer';
import PrivacyPolicyGenerator from './pages/tools-and-assessments/PrivacyPolicyGenerator';

// Project Management
import PrivacyProjectDashboard from './pages/project/PrivacyProjectDashboard';
import PrivacyRoadmap from './pages/project/PrivacyRoadmap';
import PrivacyRaci from './pages/project/PrivacyRaci';
import PrivacyWbs from './pages/project/PrivacyWbs';
import EvidenceVault from './pages/project/EvidenceVault';

// Resources
import ResourcesLanding from './pages/ResourcesLanding';
import Documentation from './pages/resources/Documentation';
import Guides from './pages/resources/Guides';
import Support from './pages/resources/Support';

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
const Toolkit = React.lazy(() => import('./pages/Toolkit'));
const DpiaGenerator = React.lazy(() => import('./pages/tools-and-assessments/DpiaGenerator'));

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
             (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', newValue.toString());
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
          <ChatbotProvider>
            <ChatSupportProvider>
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
                    
                    {/* Legal Pages */}
                    <Route path="privacy" element={<Privacy />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="cookies" element={<Cookies />} />
                    
                    {/* Assessment Hub */}
                    <Route path="assessment-hub" element={<AssessmentHub />} />
                    
                    {/* Assessment Routes */}
                    <Route path="assessments" element={<AssessmentLayout />}>
                      <Route path="privacy-assessment" element={<PrivacyAssessment />} />
                    </Route>
                    
                    {/* Results Pages */}
                    <Route path="privacy-results" element={<PrivacyResults />} />
                    <Route path="privacy-recommendations" element={<PrivacyRecommendations />} />
                    
                    {/* Project Management Routes */}
                    <Route path="project" element={<PrivacyProjectDashboard />} />
                    <Route path="project/roadmap" element={<PrivacyRoadmap />} />
                    <Route path="project/raci" element={<PrivacyRaci />} />
                    <Route path="project/wbs" element={<PrivacyWbs />} />
                    <Route path="project/evidence" element={<EvidenceVault />} />
                    
                    {/* Toolkit Routes */}
                    <Route path="toolkit" element={<ToolkitLayout />}>
                      <Route index element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <Toolkit />
                        </Suspense>
                      } />
                      <Route path="privacy-gap-analyzer" element={<PrivacyGapAnalyzer />} />
                      <Route path="privacy-policy-generator" element={<PrivacyPolicyGenerator />} />
                      <Route path="gdpr-mapper" element={<GdprMapper />} />
                      <Route path="privacy-rights-manager" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          {React.lazy(() => import('./pages/tools-and-assessments/PrivacyRightsManager'))}
                        </Suspense>
                      } />
                      <Route path="dpia-generator" element={
                        <Suspense fallback={<LoadingSpinner />}>
                          <DpiaGenerator />
                        </Suspense>
                      } />
                    </Route>
                    
                    {/* Resources Routes */}
                    <Route path="resources-landing" element={<ResourcesLanding />} />
                    <Route path="documentation" element={<Documentation />} />
                    <Route path="guides" element={<Guides />} />
                    <Route path="support" element={<Support />} />
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
            </ChatSupportProvider>
          </ChatbotProvider>
        </ProjectProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;