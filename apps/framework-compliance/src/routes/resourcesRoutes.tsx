import { lazy } from 'react';
import ChatInterface from '../pages/support/ChatInterface';

// Resource Landing Pages
const ResourcesLanding = lazy(() => import('../pages/ResourcesLanding'));
const Documentation = lazy(() => import('../pages/resources/Documentation'));
const Guides = lazy(() => import('../pages/resources/Guides'));
const Support = lazy(() => import('../pages/resources/Support'));

// Compliance Hub
const Compliance = lazy(() => import('../pages/Compliance'));

// Documentation Pages
import GdprGuide from '../pages/resources/documentation/GdprGuide';
import AssessmentGuide from '../pages/resources/documentation/AssessmentGuide';
import GettingStarted from '../pages/resources/documentation/GettingStarted';
import QuickStart from '../pages/resources/documentation/QuickStart';
import PlatformOverview from '../pages/resources/documentation/PlatformOverview';
import UnderstandingDashboard from '../pages/resources/documentation/UnderstandingDashboard';
import UnderstandingRmf from '../pages/resources/documentation/UnderstandingRmf';
import ControlImplementationGuide from '../pages/resources/documentation/ControlImplementationGuide';
import IncidentResponseGuide from '../pages/resources/documentation/IncidentResponseGuide';
import IncidentReporting from '../pages/resources/documentation/IncidentReporting';
import BreachResponseGuide from '../pages/resources/documentation/BreachResponseGuide';
import Faqs from '../pages/resources/documentation/faqs';
import PrivacyFrameworkGuide from '../pages/resources/documentation/PrivacyFrameworkGuide';

// Privacy Guide Pages
import DataProtectionGuide from '../pages/resources/guides/DataProtectionGuide';
import PrivacyByDesignGuide from '../pages/resources/guides/PrivacyByDesignGuide';
import DataSubjectRightsGuide from '../pages/resources/guides/DataSubjectRightsGuide';
import BreachNotificationGuide from '../pages/resources/guides/BreachNotificationGuide';
import PrivacyImpactAssessmentGuide from '../pages/resources/guides/PrivacyImpactAssessmentGuide';

// Role Journey Pages
import DataProtectionOfficerJourney from '../pages/roles/DataProtectionOfficerJourney';
import LegalCounselJourney from '../pages/roles/LegalCounselJourney';
import DataStewardJourney from '../pages/roles/DataStewardJourney';
import PrivacyOfficerJourney from '../pages/roles/PrivacyOfficerJourney';

// Template Viewers
import DpiaTemplateViewer from '../pages/resources/viewers/DpiaTemplateViewer';
import CcpaPolicyViewer from '../pages/resources/viewers/CcpaPolicyViewer';
import GdprChecklistViewer from '../pages/resources/viewers/GdprChecklistViewer';
import PrivacyNoticeViewer from '../pages/resources/viewers/PrivacyNoticeViewer';
import DataProcessingRecordViewer from '../pages/resources/viewers/DataProcessingRecordViewer';
import BreachNotificationViewer from '../pages/resources/viewers/BreachNotificationViewer';

export const resourcesRoutes = [
  {
    path: 'compliance',
    element: Compliance,
    lazy: true,
  },
  // Resources landing - primary path
  {
    path: 'resources',
    element: ResourcesLanding,
    lazy: true,
  },
  // Legacy path redirect support
  {
    path: 'resources-landing',
    element: ResourcesLanding,
    lazy: true,
  },
  {
    path: 'documentation',
    element: Documentation,
    lazy: true,
  },
  {
    path: 'guides',
    element: Guides,
    lazy: true,
  },
  {
    path: 'support',
    element: Support,
    lazy: true,
  },
  {
    path: '/support/chat',
    element: ChatInterface,
  },
  // Documentation Routes
  { path: '/documentation/gdpr-implementation-guide', element: GdprGuide },
  { path: '/documentation/assessment-guide', element: AssessmentGuide },
  { path: '/documentation/getting-started', element: GettingStarted },
  { path: '/documentation/quick-start', element: QuickStart },
  { path: '/documentation/platform-overview', element: PlatformOverview },
  { path: '/documentation/understanding-dashboard', element: UnderstandingDashboard },
  { path: '/documentation/understanding-rmf', element: UnderstandingRmf },
  { path: '/documentation/control-implementation-guide', element: ControlImplementationGuide },
  { path: '/documentation/incident-response-guide', element: IncidentResponseGuide },
  { path: '/documentation/incident-reporting', element: IncidentReporting },
  { path: '/documentation/breach-response-guide', element: BreachResponseGuide },
  { path: '/documentation/faqs', element: Faqs },
  { path: '/documentation/privacy-framework-guide', element: PrivacyFrameworkGuide },
  // Guide Routes
  { path: '/guides/data-protection', element: DataProtectionGuide },
  { path: '/guides/privacy-by-design', element: PrivacyByDesignGuide },
  { path: '/guides/data-subject-rights', element: DataSubjectRightsGuide },
  { path: '/guides/breach-notification', element: BreachNotificationGuide },
  { path: '/guides/privacy-impact-assessment', element: PrivacyImpactAssessmentGuide },
  // Role Journey Routes
  { path: '/roles/data-protection-officer', element: DataProtectionOfficerJourney },
  { path: '/roles/legal-counsel', element: LegalCounselJourney },
  { path: '/roles/data-steward', element: DataStewardJourney },
  { path: '/roles/privacy-officer', element: PrivacyOfficerJourney },
  // Template Viewer Routes
  { path: '/toolkit/resources/viewers/dpia-template', element: DpiaTemplateViewer },
  { path: '/toolkit/resources/viewers/ccpa-policy', element: CcpaPolicyViewer },
  { path: '/toolkit/resources/viewers/gdpr-checklist', element: GdprChecklistViewer },
  { path: '/toolkit/resources/viewers/privacy-notice', element: PrivacyNoticeViewer },
  { path: '/toolkit/resources/viewers/data-processing-record', element: DataProcessingRecordViewer },
  { path: '/toolkit/resources/viewers/breach-notification', element: BreachNotificationViewer },
];

