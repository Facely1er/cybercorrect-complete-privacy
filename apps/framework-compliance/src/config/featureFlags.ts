/**
 * Feature Flags Configuration
 * 
 * Controls visibility of tools and features based on completion status.
 * All tools below are aligned with B2B Privacy Compliance.
 * 
 * Usage:
 * import { isFeatureEnabled } from '@/config/featureFlags';
 * if (isFeatureEnabled('gdpr-mapper')) { ... }
 */

export interface FeatureFlags {
  // Core v1 Tools - Always enabled
  'gdpr-mapper': boolean;
  'privacy-rights-manager': boolean;
  'dpia-generator': boolean;
  'dpia-manager': boolean;
  'incident-response-manager': boolean;
  
  // Supporting Tools - Enabled for v1
  'privacy-assessment': boolean;
  'privacy-gap-analyzer': boolean;
  'vendor-risk-assessment': boolean;
  'service-provider-manager': boolean;
  'data-flow-mapper': boolean;
  'retention-policy-generator': boolean;
  'privacy-by-design-assessment': boolean;
  
  // Data Classification - Privacy categorization
  'data-classification': boolean;
  
  // Phase 2 Tools - Enable when ready
  'consent-management': boolean;
  'privacy-policy-generator': boolean;
  'pii-data-flow-mapper': boolean;
  
  // Feature Areas
  'monetization': boolean;
  'journey-tracking': boolean;
  'export-features': boolean;
  'dark-mode': boolean;
}

/**
 * Default feature flag configuration
 * 
 * true = Feature is visible/enabled
 * false = Feature is hidden/disabled
 */
const defaultFlags: FeatureFlags = {
  // ==========================================
  // CORE V1 TOOLS - Always enabled
  // ==========================================
  'gdpr-mapper': true,
  'privacy-rights-manager': true,
  'dpia-generator': true,
  'dpia-manager': true,
  'incident-response-manager': true,
  
  // ==========================================
  // SUPPORTING TOOLS - Enabled for v1
  // ==========================================
  'privacy-assessment': true,
  'privacy-gap-analyzer': true,
  'vendor-risk-assessment': true,
  'service-provider-manager': true,
  'data-flow-mapper': true,
  'retention-policy-generator': true,
  'privacy-by-design-assessment': true,
  
  // ==========================================
  // DATA CLASSIFICATION - Privacy categorization
  // ==========================================
  'data-classification': true,
  
  // ==========================================
  // PHASE 2 TOOLS - Enable when ready
  // ==========================================
  'consent-management': false,        // Complex, needs more work
  'privacy-policy-generator': false,  // Lower priority for v1
  'pii-data-flow-mapper': false,      // Overlaps with data-flow-mapper
  
  // ==========================================
  // FEATURE AREAS
  // ==========================================
  'monetization': true,       // Stripe integration works
  'journey-tracking': true,   // Customer journey system
  'export-features': true,    // PDF/CSV exports
  'dark-mode': true,          // Theme toggle
};

/**
 * Environment-based overrides
 * In development, you may want to enable more features for testing
 */
const getEnvironmentOverrides = (): Partial<FeatureFlags> => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    return {
      // Enable phase 2 tools in dev for testing
      // 'consent-management': true,
      // 'privacy-policy-generator': true,
    };
  }
  
  return {};
};

/**
 * Get the current feature flags with environment overrides
 */
export const getFeatureFlags = (): FeatureFlags => {
  return {
    ...defaultFlags,
    ...getEnvironmentOverrides(),
  };
};

/**
 * Check if a specific feature is enabled
 */
export const isFeatureEnabled = (featureKey: keyof FeatureFlags): boolean => {
  const flags = getFeatureFlags();
  return flags[featureKey] ?? false;
};

/**
 * Get all enabled tool IDs for navigation filtering
 */
export const getEnabledToolIds = (): string[] => {
  const flags = getFeatureFlags();
  const toolFlags: (keyof FeatureFlags)[] = [
    'gdpr-mapper',
    'privacy-rights-manager',
    'dpia-generator',
    'dpia-manager',
    'incident-response-manager',
    'privacy-assessment',
    'privacy-gap-analyzer',
    'vendor-risk-assessment',
    'service-provider-manager',
    'data-flow-mapper',
    'retention-policy-generator',
    'privacy-by-design-assessment',
    'data-classification',
    'consent-management',
    'privacy-policy-generator',
    'pii-data-flow-mapper',
  ];
  
  return toolFlags.filter(key => flags[key]);
};

/**
 * Tool metadata for UI display
 */
export const TOOL_METADATA: Record<string, {
  name: string;
  description: string;
  category: 'core' | 'supporting' | 'classification' | 'phase2';
  coreOffering?: string;
}> = {
  // Core v1 Tools
  'gdpr-mapper': {
    name: 'GDPR Mapper',
    description: 'Create and manage Records of Processing Activities (RoPA)',
    category: 'core',
    coreOffering: 'RoPA / GDPR Data Mapper',
  },
  'privacy-rights-manager': {
    name: 'Privacy Rights Manager',
    description: 'Manage Data Subject Access Requests (DSARs)',
    category: 'core',
    coreOffering: 'Privacy Rights (DSAR) Manager',
  },
  'dpia-generator': {
    name: 'DPIA Generator',
    description: 'Generate Data Protection Impact Assessments',
    category: 'core',
    coreOffering: 'DPIA Generator & Manager',
  },
  'dpia-manager': {
    name: 'DPIA Manager',
    description: 'Manage DPIA lifecycle and approvals',
    category: 'core',
    coreOffering: 'DPIA Generator & Manager',
  },
  'incident-response-manager': {
    name: 'Incident Response Manager',
    description: 'Log and manage privacy incidents and breaches',
    category: 'core',
    coreOffering: 'Privacy Incident / Breach Manager',
  },
  
  // Supporting Tools
  'privacy-assessment': {
    name: 'Privacy Assessment',
    description: 'Comprehensive privacy compliance assessment',
    category: 'supporting',
  },
  'privacy-gap-analyzer': {
    name: 'Privacy Gap Analyzer',
    description: 'Analyze and prioritize compliance gaps',
    category: 'supporting',
  },
  'vendor-risk-assessment': {
    name: 'Vendor Risk Assessment',
    description: 'Assess third-party vendor privacy risks',
    category: 'supporting',
  },
  'service-provider-manager': {
    name: 'Service Provider Manager',
    description: 'Track DPAs and service provider compliance',
    category: 'supporting',
  },
  'data-flow-mapper': {
    name: 'Data Flow Mapper',
    description: 'Visualize data flows across systems',
    category: 'supporting',
  },
  'retention-policy-generator': {
    name: 'Retention Policy Generator',
    description: 'Generate data retention policies',
    category: 'supporting',
  },
  'privacy-by-design-assessment': {
    name: 'Privacy by Design Assessment',
    description: 'Assess privacy by design principles implementation',
    category: 'supporting',
  },
  
  // Data Classification
  'data-classification': {
    name: 'Data Classification',
    description: 'Categorize personal data for privacy compliance',
    category: 'classification',
  },
  
  // Phase 2
  'consent-management': {
    name: 'Consent Management',
    description: 'Manage consent records and preferences',
    category: 'phase2',
  },
  'privacy-policy-generator': {
    name: 'Privacy Policy Generator',
    description: 'Generate compliant privacy policies',
    category: 'phase2',
  },
  'pii-data-flow-mapper': {
    name: 'PII Data Flow Mapper',
    description: 'Map PII data flows specifically',
    category: 'phase2',
  },
};

export default getFeatureFlags;

