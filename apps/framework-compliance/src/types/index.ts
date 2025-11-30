export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'risk_manager' | 'auditor' | 'viewer';
  avatar?: string;
};

// Re-export framework mapping types for convenience
export type {
  FrameworkControl,
  FrameworkMapping,
  CrossFrameworkAnalysis,
  UnifiedComplianceReport,
  UnifiedGap,
  Recommendation,
  ExecutiveSummary
} from '../services/frameworkMappingService';