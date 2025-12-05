import { lazy } from 'react';
import ToolkitLayout from '../components/layout/ToolkitLayout';

// Toolkit Main
const Toolkit = lazy(() => import('../pages/Toolkit'));

// Privacy Tools
const PrivacyGapAnalyzer = lazy(() => import('../pages/tools-and-assessments/PrivacyGapAnalyzer'));
const PrivacyPolicyGenerator = lazy(() => import('../pages/tools-and-assessments/PrivacyPolicyGenerator'));
const GdprMapper = lazy(() => import('../pages/tools-and-assessments/GdprMapper'));
const PiiDataFlowMapper = lazy(() => import('../pages/tools-and-assessments/PiiDataFlowMapper'));
const PrivacyRightsManager = lazy(() => import('../pages/tools-and-assessments/PrivacyRightsManager'));
const DpiaGenerator = lazy(() => import('../pages/tools-and-assessments/DpiaGenerator'));
const DpiaManager = lazy(() => import('../pages/tools-and-assessments/DpiaManager'));

// Advanced Privacy Tools
const EmployeeDigitalFootprintAssessment = lazy(() => import('../pages/tools-and-assessments/EmployeeDigitalFootprintAssessment'));
const DataBrokerRemovalManager = lazy(() => import('../pages/tools-and-assessments/DataBrokerRemovalManager'));
const PrivacySettingsAudit = lazy(() => import('../pages/tools-and-assessments/PrivacySettingsAudit'));
const PrivacyMaintenanceScheduler = lazy(() => import('../pages/tools-and-assessments/PrivacyMaintenanceScheduler'));
const ConsentManagement = lazy(() => import('../pages/tools-and-assessments/ConsentManagement'));
const VendorRiskAssessment = lazy(() => import('../pages/tools-and-assessments/VendorRiskAssessment'));
const RetentionPolicyGenerator = lazy(() => import('../pages/tools-and-assessments/RetentionPolicyGenerator'));
const PrivacyByDesignAssessment = lazy(() => import('../pages/tools-and-assessments/PrivacyByDesignAssessment'));
const ServiceProviderManager = lazy(() => import('../pages/tools-and-assessments/ServiceProviderManager'));
const IncidentResponseManager = lazy(() => import('../pages/tools-and-assessments/IncidentResponseManager'));

export const toolkitRoutes = [
  {
    path: 'toolkit',
    element: ToolkitLayout,
    children: [
      { path: '', element: Toolkit, lazy: true },
      { path: 'privacy-gap-analyzer', element: PrivacyGapAnalyzer, lazy: true },
      { path: 'privacy-policy-generator', element: PrivacyPolicyGenerator, lazy: true },
      { path: 'gdpr-mapper', element: GdprMapper, lazy: true },
      { path: 'pii-data-flow-mapper', element: PiiDataFlowMapper, lazy: true },
      { path: 'privacy-rights-manager', element: PrivacyRightsManager, lazy: true },
      { path: 'dpia-generator', element: DpiaGenerator, lazy: true },
      { path: 'dpia-manager', element: DpiaManager, lazy: true },
      { path: 'employee-digital-footprint', element: EmployeeDigitalFootprintAssessment, lazy: true },
      { path: 'data-broker-removal', element: DataBrokerRemovalManager, lazy: true },
      { path: 'privacy-settings-audit', element: PrivacySettingsAudit, lazy: true },
      { path: 'privacy-maintenance-scheduler', element: PrivacyMaintenanceScheduler, lazy: true },
      { path: 'consent-management', element: ConsentManagement, lazy: true },
      { path: 'vendor-risk-assessment', element: VendorRiskAssessment, lazy: true },
      { path: 'retention-policy-generator', element: RetentionPolicyGenerator, lazy: true },
      { path: 'privacy-by-design-assessment', element: PrivacyByDesignAssessment, lazy: true },
      { path: 'service-provider-manager', element: ServiceProviderManager, lazy: true },
      { path: 'incident-response-manager', element: IncidentResponseManager, lazy: true },
    ],
  },
];

