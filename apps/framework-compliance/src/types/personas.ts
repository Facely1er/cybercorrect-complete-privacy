// Persona definitions and types for privacy compliance platform
export interface Persona {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  primaryUseCases: UseCase[];
  dashboardSections: DashboardSection[];
  navigationItems: NavigationItem[];
  permissions: string[];
  onboardingSteps: OnboardingStep[];
  features: PersonaFeature[];
  regulations: string[];
  estimatedTimeCommitment: string;
  priorityLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'as-needed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  steps: UseCaseStep[];
  expectedOutcome: string;
  relatedFeatures: string[];
  regulations: string[];
}

export interface UseCaseStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  required: boolean;
  order: number;
}

export interface DashboardSection {
  id: string;
  title: string;
  description: string;
  component: string;
  order: number;
  size: 'small' | 'medium' | 'large' | 'full';
  required: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  order: number;
  badge?: string;
  children?: NavigationItem[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  order: number;
  required: boolean;
  estimatedTime: string;
}

export interface PersonaFeature {
  id: string;
  name: string;
  description: string;
  category: 'data-rights' | 'compliance' | 'reporting' | 'management' | 'education';
  priority: 'low' | 'medium' | 'high' | 'critical';
  available: boolean;
  comingSoon?: boolean;
}

// Persona-specific configurations adapted for privacy compliance platform
export const PERSONAS: Record<string, Persona> = {
  privacy_officer: {
    id: 'privacy_officer',
    name: 'Privacy Officer',
    displayName: 'Privacy Officer',
    description: 'Privacy officers responsible for organizational privacy compliance and oversight',
    icon: 'Shield',
    color: 'red',
    priorityLevel: 'critical',
    estimatedTimeCommitment: '2-4 hours per week',
    regulations: ['GDPR', 'CCPA', 'PIPEDA', 'LGPD', 'PDPA'],
    primaryUseCases: [
      {
        id: 'privacy-program-oversight',
        title: 'Privacy Program Oversight',
        description: 'Oversee the organization\'s privacy program and compliance activities',
        frequency: 'weekly',
        priority: 'critical',
        expectedOutcome: 'Comprehensive privacy program oversight and compliance',
        relatedFeatures: ['compliance-dashboard', 'gap-analysis', 'risk-assessment'],
        regulations: ['All Applicable'],
        steps: [
          {
            id: 'review-compliance-status',
            title: 'Review Compliance Status',
            description: 'Review overall privacy compliance status and metrics',
            estimatedTime: '15-20 minutes',
            required: true,
            order: 1
          },
          {
            id: 'identify-risks',
            title: 'Identify Privacy Risks',
            description: 'Identify and assess privacy risks and compliance gaps',
            estimatedTime: '20-30 minutes',
            required: true,
            order: 2
          },
          {
            id: 'develop-remediation',
            title: 'Develop Remediation Plans',
            description: 'Develop plans to address identified risks and gaps',
            estimatedTime: '30-45 minutes',
            required: true,
            order: 3
          }
        ]
      }
    ],
    dashboardSections: [
      {
        id: 'compliance-overview',
        title: 'Compliance Overview',
        description: 'High-level view of privacy compliance status',
        component: 'ComplianceOverviewWidget',
        order: 1,
        size: 'full',
        required: true
      },
      {
        id: 'gap-analysis',
        title: 'Gap Analysis',
        description: 'Privacy compliance gap analysis and remediation',
        component: 'GapAnalysisWidget',
        order: 2,
        size: 'large',
        required: true
      },
      {
        id: 'risk-assessment',
        title: 'Risk Assessment',
        description: 'Privacy risk assessment and mitigation',
        component: 'RiskAssessmentWidget',
        order: 3,
        size: 'medium',
        required: true
      }
    ],
    navigationItems: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'Home',
        order: 1
      },
      {
        id: 'gap-analyzer',
        label: 'Gap Analyzer',
        path: '/toolkit/privacy-gap-analyzer',
        icon: 'Target',
        order: 2
      },
      {
        id: 'dpia',
        label: 'DPIA Manager',
        path: '/toolkit/dpia-manager',
        icon: 'FileText',
        order: 3
      },
      {
        id: 'privacy-rights',
        label: 'Privacy Rights',
        path: '/toolkit/privacy-rights-manager',
        icon: 'Shield',
        order: 4
      },
      {
        id: 'reports',
        label: 'Reports',
        path: '/reports',
        icon: 'BarChart3',
        order: 5
      }
    ],
    permissions: [
      'view_all_data',
      'manage_compliance',
      'view_analytics',
      'generate_reports',
      'admin_access'
    ],
    onboardingSteps: [
      {
        id: 'welcome',
        title: 'Welcome Privacy Officer',
        description: 'Introduction to privacy compliance management tools',
        component: 'WelcomeStep',
        order: 1,
        required: true,
        estimatedTime: '5 minutes'
      },
      {
        id: 'compliance-setup',
        title: 'Compliance Setup',
        description: 'Configure compliance frameworks and assessments',
        component: 'ComplianceSetupStep',
        order: 2,
        required: true,
        estimatedTime: '10 minutes'
      }
    ],
    features: [
      {
        id: 'compliance-dashboard',
        name: 'Compliance Dashboard',
        description: 'Comprehensive privacy compliance oversight dashboard',
        category: 'compliance',
        priority: 'critical',
        available: true
      },
      {
        id: 'gap-analysis',
        name: 'Gap Analysis',
        description: 'Privacy compliance gap analysis and remediation',
        category: 'compliance',
        priority: 'critical',
        available: true
      },
      {
        id: 'risk-management',
        name: 'Risk Management',
        description: 'Privacy risk assessment and mitigation tools',
        category: 'compliance',
        priority: 'critical',
        available: true
      }
    ]
  },
  data_steward: {
    id: 'data_steward',
    name: 'Data Steward',
    displayName: 'Data Steward',
    description: 'Data stewards managing data classification, retention, and privacy by design',
    icon: 'Database',
    color: 'blue',
    priorityLevel: 'high',
    estimatedTimeCommitment: '1-2 hours per week',
    regulations: ['GDPR', 'CCPA', 'PIPEDA'],
    primaryUseCases: [
      {
        id: 'data-classification',
        title: 'Data Classification',
        description: 'Classify and manage data according to privacy requirements',
        frequency: 'weekly',
        priority: 'high',
        expectedOutcome: 'Properly classified data with retention policies',
        relatedFeatures: ['data-classification', 'retention-policies'],
        regulations: ['GDPR', 'CCPA'],
        steps: [
          {
            id: 'classify-data',
            title: 'Classify Data',
            description: 'Classify data according to privacy requirements',
            estimatedTime: '10-15 minutes',
            required: true,
            order: 1
          },
          {
            id: 'apply-retention',
            title: 'Apply Retention Policies',
            description: 'Apply appropriate retention policies to classified data',
            estimatedTime: '5-10 minutes',
            required: true,
            order: 2
          }
        ]
      }
    ],
    dashboardSections: [
      {
        id: 'data-classification',
        title: 'Data Classification',
        description: 'Manage data classification and retention',
        component: 'DataClassificationWidget',
        order: 1,
        size: 'large',
        required: true
      },
      {
        id: 'retention-policies',
        title: 'Retention Policies',
        description: 'Manage data retention policies',
        component: 'RetentionPoliciesWidget',
        order: 2,
        size: 'medium',
        required: true
      }
    ],
    navigationItems: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'Home',
        order: 1
      },
      {
        id: 'data-classification',
        label: 'Data Classification',
        path: '/toolkit/data-classification',
        icon: 'Database',
        order: 2
      },
      {
        id: 'retention-policies',
        label: 'Retention Policies',
        path: '/toolkit/retention-policy-generator',
        icon: 'Clock',
        order: 3
      },
      {
        id: 'privacy-by-design',
        label: 'Privacy by Design',
        path: '/toolkit/privacy-by-design-assessment',
        icon: 'Shield',
        order: 4
      }
    ],
    permissions: [
      'manage_data_classification',
      'manage_retention_policies',
      'view_data_flows',
      'manage_privacy_by_design'
    ],
    onboardingSteps: [
      {
        id: 'welcome',
        title: 'Welcome Data Steward',
        description: 'Introduction to data stewardship tools',
        component: 'WelcomeStep',
        order: 1,
        required: true,
        estimatedTime: '3 minutes'
      }
    ],
    features: [
      {
        id: 'data-classification',
        name: 'Data Classification',
        description: 'Classify and manage data according to privacy requirements',
        category: 'management',
        priority: 'high',
        available: true
      },
      {
        id: 'retention-policies',
        name: 'Retention Policies',
        description: 'Manage data retention policies',
        category: 'management',
        priority: 'high',
        available: true
      }
    ]
  },
  legal_counsel: {
    id: 'legal_counsel',
    name: 'Legal Counsel',
    displayName: 'Legal Counsel',
    description: 'Legal professionals managing privacy policies, contracts, and regulatory compliance',
    icon: 'Scale',
    color: 'purple',
    priorityLevel: 'high',
    estimatedTimeCommitment: '1-2 hours per week',
    regulations: ['GDPR', 'CCPA', 'PIPEDA', 'LGPD'],
    primaryUseCases: [
      {
        id: 'policy-management',
        title: 'Policy Management',
        description: 'Create and manage privacy policies and legal documents',
        frequency: 'monthly',
        priority: 'high',
        expectedOutcome: 'Up-to-date privacy policies and legal documents',
        relatedFeatures: ['policy-generator', 'legal-documents'],
        regulations: ['All Applicable'],
        steps: [
          {
            id: 'review-policies',
            title: 'Review Policies',
            description: 'Review existing privacy policies',
            estimatedTime: '15-20 minutes',
            required: true,
            order: 1
          },
          {
            id: 'update-policies',
            title: 'Update Policies',
            description: 'Update policies based on regulatory changes',
            estimatedTime: '20-30 minutes',
            required: true,
            order: 2
          }
        ]
      }
    ],
    dashboardSections: [
      {
        id: 'policy-management',
        title: 'Policy Management',
        description: 'Manage privacy policies and legal documents',
        component: 'PolicyManagementWidget',
        order: 1,
        size: 'large',
        required: true
      },
      {
        id: 'regulatory-updates',
        title: 'Regulatory Updates',
        description: 'Track regulatory changes and updates',
        component: 'RegulatoryUpdatesWidget',
        order: 2,
        size: 'medium',
        required: true
      }
    ],
    navigationItems: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'Home',
        order: 1
      },
      {
        id: 'policy-generator',
        label: 'Policy Generator',
        path: '/toolkit/privacy-policy-generator',
        icon: 'FileText',
        order: 2
      },
      {
        id: 'privacy-policy',
        label: 'Privacy Policy',
        path: '/toolkit/privacy-policy-generator',
        icon: 'Shield',
        order: 3
      },
      {
        id: 'regulatory',
        label: 'Regulatory Intelligence',
        path: '/regulatory',
        icon: 'TrendingUp',
        order: 4
      }
    ],
    permissions: [
      'manage_policies',
      'view_regulatory_updates',
      'generate_legal_documents',
      'review_compliance'
    ],
    onboardingSteps: [
      {
        id: 'welcome',
        title: 'Welcome Legal Counsel',
        description: 'Introduction to legal compliance tools',
        component: 'WelcomeStep',
        order: 1,
        required: true,
        estimatedTime: '3 minutes'
      }
    ],
    features: [
      {
        id: 'policy-generator',
        name: 'Policy Generator',
        description: 'Generate privacy policies and legal documents',
        category: 'management',
        priority: 'high',
        available: true
      },
      {
        id: 'regulatory-intelligence',
        name: 'Regulatory Intelligence',
        description: 'Track regulatory changes and updates',
        category: 'compliance',
        priority: 'high',
        available: true
      }
    ]
  },
  compliance_manager: {
    id: 'compliance_manager',
    name: 'Compliance Manager',
    displayName: 'Compliance Manager',
    description: 'Compliance professionals managing assessments, evidence, and remediation',
    icon: 'CheckCircle',
    color: 'green',
    priorityLevel: 'high',
    estimatedTimeCommitment: '2-3 hours per week',
    regulations: ['GDPR', 'CCPA', 'NIST', 'ISO 27001'],
    primaryUseCases: [
      {
        id: 'compliance-assessments',
        title: 'Compliance Assessments',
        description: 'Conduct and manage privacy compliance assessments',
        frequency: 'monthly',
        priority: 'critical',
        expectedOutcome: 'Comprehensive compliance assessments and gap analysis',
        relatedFeatures: ['gap-analyzer', 'assessments', 'evidence'],
        regulations: ['All Applicable'],
        steps: [
          {
            id: 'run-assessment',
            title: 'Run Assessment',
            description: 'Conduct privacy compliance assessment',
            estimatedTime: '30-45 minutes',
            required: true,
            order: 1
          },
          {
            id: 'review-gaps',
            title: 'Review Gaps',
            description: 'Review identified compliance gaps',
            estimatedTime: '20-30 minutes',
            required: true,
            order: 2
          },
          {
            id: 'create-remediation',
            title: 'Create Remediation Plan',
            description: 'Develop remediation plans for gaps',
            estimatedTime: '30-45 minutes',
            required: true,
            order: 3
          }
        ]
      }
    ],
    dashboardSections: [
      {
        id: 'compliance-status',
        title: 'Compliance Status',
        description: 'Current compliance status across frameworks',
        component: 'ComplianceStatusWidget',
        order: 1,
        size: 'full',
        required: true
      },
      {
        id: 'gap-analysis',
        title: 'Gap Analysis',
        description: 'Compliance gaps and remediation status',
        component: 'GapAnalysisWidget',
        order: 2,
        size: 'large',
        required: true
      },
      {
        id: 'evidence',
        title: 'Evidence Collection',
        description: 'Compliance evidence and documentation',
        component: 'EvidenceWidget',
        order: 3,
        size: 'medium',
        required: true
      }
    ],
    navigationItems: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'Home',
        order: 1
      },
      {
        id: 'gap-analyzer',
        label: 'Gap Analyzer',
        path: '/toolkit/privacy-gap-analyzer',
        icon: 'Target',
        order: 2
      },
      {
        id: 'assessments',
        label: 'Assessments',
        path: '/assessments',
        icon: 'CheckSquare',
        order: 3
      },
      {
        id: 'evidence',
        label: 'Evidence',
        path: '/project/evidence',
        icon: 'FileText',
        order: 4
      },
      {
        id: 'reports',
        label: 'Reports',
        path: '/reports',
        icon: 'BarChart3',
        order: 5
      }
    ],
    permissions: [
      'run_assessments',
      'view_gap_analysis',
      'manage_evidence',
      'generate_reports',
      'manage_remediation'
    ],
    onboardingSteps: [
      {
        id: 'welcome',
        title: 'Welcome Compliance Manager',
        description: 'Introduction to compliance management tools',
        component: 'WelcomeStep',
        order: 1,
        required: true,
        estimatedTime: '5 minutes'
      }
    ],
    features: [
      {
        id: 'gap-analyzer',
        name: 'Gap Analyzer',
        description: 'Comprehensive compliance gap analysis',
        category: 'compliance',
        priority: 'critical',
        available: true
      },
      {
        id: 'assessments',
        name: 'Assessments',
        description: 'Privacy compliance assessments',
        category: 'compliance',
        priority: 'critical',
        available: true
      },
      {
        id: 'evidence-management',
        name: 'Evidence Management',
        description: 'Manage compliance evidence and documentation',
        category: 'management',
        priority: 'high',
        available: true
      }
    ]
  }
};

// Helper functions for persona management
export const getPersonaById = (id: string): Persona | undefined => {
  return PERSONAS[id];
};

export const getPersonaByRole = (role: string): Persona | undefined => {
  const roleToPersonaMap: Record<string, string> = {
    'privacy_officer': 'privacy_officer',
    'data_protection_officer': 'privacy_officer',
    'dpo': 'privacy_officer',
    'data_steward': 'data_steward',
    'legal_counsel': 'legal_counsel',
    'compliance_manager': 'compliance_manager',
    'compliance_officer': 'compliance_manager'
  };
  
  const personaId = roleToPersonaMap[role.toLowerCase()];
  return personaId ? PERSONAS[personaId] : PERSONAS.privacy_officer; // Default to privacy officer
};

export const getAllPersonas = (): Persona[] => {
  return Object.values(PERSONAS);
};

export const getPersonaFeatures = (personaId: string): PersonaFeature[] => {
  const persona = getPersonaById(personaId);
  return persona ? persona.features : [];
};

export const getPersonaUseCases = (personaId: string): UseCase[] => {
  const persona = getPersonaById(personaId);
  return persona ? persona.primaryUseCases : [];
};


