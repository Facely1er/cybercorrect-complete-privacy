import { lazy } from 'react';
import ToolkitLayout from '../components/layout/ToolkitLayout';

// Toolkit Main
const Toolkit = lazy(() => import('../pages/Toolkit'));

// ==========================================
// CORE V1 TOOLS - Privacy Compliance
// ==========================================
const GdprMapper = lazy(() => import('../pages/tools-and-assessments/GdprMapper'));
const PrivacyRightsManager = lazy(() => import('../pages/tools-and-assessments/PrivacyRightsManager'));
const DpiaGenerator = lazy(() => import('../pages/tools-and-assessments/DpiaGenerator'));
const DpiaManager = lazy(() => import('../pages/tools-and-assessments/DpiaManager'));
const IncidentResponseManager = lazy(() => import('../pages/tools-and-assessments/IncidentResponseManager'));

// ==========================================
// SUPPORTING TOOLS - Privacy Operations
// ==========================================
const PrivacyGapAnalyzer = lazy(() => import('../pages/tools-and-assessments/PrivacyGapAnalyzer'));
const PrivacyAssessment = lazy(() => import('../pages/tools-and-assessments/PrivacyAssessment'));
const VendorRiskAssessment = lazy(() => import('../pages/tools-and-assessments/VendorRiskAssessment'));
const ServiceProviderManager = lazy(() => import('../pages/tools-and-assessments/ServiceProviderManager'));
const RetentionPolicyGenerator = lazy(() => import('../pages/tools-and-assessments/RetentionPolicyGenerator'));
const DataFlowMapper = lazy(() => import('../pages/tools-and-assessments/DataFlowMapper'));
const PrivacyByDesignAssessment = lazy(() => import('../pages/tools-and-assessments/PrivacyByDesignAssessment'));

// Data Classification - Useful for privacy data categorization
const DataClassificationAssessment = lazy(() => import('../pages/tools-and-assessments/DataClassificationAssessment'));
const DataClassificationRecommendations = lazy(() => import('../pages/tools-and-assessments/DataClassificationRecommendations'));
const DataClassificationResults = lazy(() => import('../pages/tools-and-assessments/DataClassificationResults'));

// ==========================================
// PHASE 2 TOOLS (Enable when ready)
// ==========================================
const ConsentManagement = lazy(() => import('../pages/tools-and-assessments/ConsentManagement'));
const PrivacyPolicyGenerator = lazy(() => import('../pages/tools-and-assessments/PrivacyPolicyGenerator'));
const PiiDataFlowMapper = lazy(() => import('../pages/tools-and-assessments/PiiDataFlowMapper'));

export const toolkitRoutes = [
  {
    path: 'toolkit',
    element: ToolkitLayout,
    children: [
      { path: '', element: Toolkit, lazy: true },
      
      // Core v1 Tools
      { path: 'gdpr-mapper', element: GdprMapper, lazy: true },
      { path: 'privacy-rights-manager', element: PrivacyRightsManager, lazy: true },
      { path: 'dpia-generator', element: DpiaGenerator, lazy: true },
      { path: 'dpia-manager', element: DpiaManager, lazy: true },
      { path: 'incident-response-manager', element: IncidentResponseManager, lazy: true },
      
      // Supporting Tools
      { path: 'privacy-gap-analyzer', element: PrivacyGapAnalyzer, lazy: true },
      { path: 'privacy-assessment', element: PrivacyAssessment, lazy: true },
      { path: 'vendor-risk-assessment', element: VendorRiskAssessment, lazy: true },
      { path: 'service-provider-manager', element: ServiceProviderManager, lazy: true },
      { path: 'retention-policy-generator', element: RetentionPolicyGenerator, lazy: true },
      { path: 'data-flow-mapper', element: DataFlowMapper, lazy: true },
      { path: 'privacy-by-design-assessment', element: PrivacyByDesignAssessment, lazy: true },
      
      // Data Classification
      { path: 'data-classification', element: DataClassificationAssessment, lazy: true },
      { path: 'data-classification/recommendations', element: DataClassificationRecommendations, lazy: true },
      { path: 'data-classification/results', element: DataClassificationResults, lazy: true },
      
      // Phase 2 Tools
      { path: 'consent-management', element: ConsentManagement, lazy: true },
      { path: 'privacy-policy-generator', element: PrivacyPolicyGenerator, lazy: true },
      { path: 'pii-data-flow-mapper', element: PiiDataFlowMapper, lazy: true },
    ],
  },
];
