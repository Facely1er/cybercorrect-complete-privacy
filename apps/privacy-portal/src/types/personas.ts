// Persona definitions and types for the privacy portal
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

// Persona-specific configurations
export const PERSONAS: Record<string, Persona> = {
  worker: {
    id: 'worker',
    name: 'Current Employee',
    displayName: 'Current Employee',
    description: 'Active employees exercising their privacy rights and managing personal employment data',
    icon: 'User',
    color: 'blue',
    priorityLevel: 'high',
    estimatedTimeCommitment: '5-10 minutes per month',
    regulations: ['ADA', 'EEOC', 'CCPA', 'GDPR', 'BIPA'],
    primaryUseCases: [
      {
        id: 'access-personal-data',
        title: 'Access Personal Employment Data',
        description: 'Request and view copies of personal employment records and HR data',
        frequency: 'as-needed',
        priority: 'high',
        expectedOutcome: 'Complete access to personal employment data in portable format',
        relatedFeatures: ['data-rights-portal', 'document-download'],
        regulations: ['ADA', 'CCPA', 'GDPR'],
        steps: [
          {
            id: 'submit-request',
            title: 'Submit Data Access Request',
            description: 'Complete the data access request form with required information',
            estimatedTime: '2-3 minutes',
            required: true,
            order: 1
          },
          {
            id: 'verify-identity',
            title: 'Verify Identity',
            description: 'Provide identity verification documents as required',
            estimatedTime: '1-2 minutes',
            required: true,
            order: 2
          },
          {
            id: 'track-progress',
            title: 'Track Request Progress',
            description: 'Monitor the status of your data access request',
            estimatedTime: '30 seconds',
            required: false,
            order: 3
          },
          {
            id: 'download-data',
            title: 'Download Personal Data',
            description: 'Access and download your personal employment data',
            estimatedTime: '1-2 minutes',
            required: true,
            order: 4
          }
        ]
      },
      {
        id: 'correct-inaccurate-data',
        title: 'Correct Inaccurate Personal Data',
        description: 'Request correction of inaccurate or incomplete personal information',
        frequency: 'as-needed',
        priority: 'medium',
        expectedOutcome: 'Accurate personal data records maintained by employer',
        relatedFeatures: ['data-correction', 'status-tracking'],
        regulations: ['ADA', 'CCPA', 'GDPR'],
        steps: [
          {
            id: 'identify-inaccuracy',
            title: 'Identify Data Inaccuracy',
            description: 'Review personal data and identify inaccurate information',
            estimatedTime: '2-3 minutes',
            required: true,
            order: 1
          },
          {
            id: 'submit-correction',
            title: 'Submit Correction Request',
            description: 'Submit detailed correction request with supporting documentation',
            estimatedTime: '3-5 minutes',
            required: true,
            order: 2
          },
          {
            id: 'provide-evidence',
            title: 'Provide Supporting Evidence',
            description: 'Submit documentation supporting the correction request',
            estimatedTime: '2-3 minutes',
            required: true,
            order: 3
          }
        ]
      },
      {
        id: 'manage-privacy-preferences',
        title: 'Manage Privacy Preferences',
        description: 'Control how personal data is used and shared within the organization',
        frequency: 'monthly',
        priority: 'medium',
        expectedOutcome: 'Personalized privacy settings aligned with individual preferences',
        relatedFeatures: ['privacy-settings', 'consent-management'],
        regulations: ['CCPA', 'GDPR'],
        steps: [
          {
            id: 'review-preferences',
            title: 'Review Current Preferences',
            description: 'View current privacy settings and data usage preferences',
            estimatedTime: '1-2 minutes',
            required: true,
            order: 1
          },
          {
            id: 'update-settings',
            title: 'Update Privacy Settings',
            description: 'Modify privacy preferences and consent choices',
            estimatedTime: '2-3 minutes',
            required: true,
            order: 2
          }
        ]
      }
    ],
    dashboardSections: [
      {
        id: 'quick-actions',
        title: 'Quick Actions',
        description: 'Common privacy tasks and data rights exercises',
        component: 'QuickActionsWidget',
        order: 1,
        size: 'medium',
        required: true
      },
      {
        id: 'recent-requests',
        title: 'Recent Requests',
        description: 'Track status of your recent data rights requests',
        component: 'RecentRequestsWidget',
        order: 2,
        size: 'large',
        required: true
      },
      {
        id: 'privacy-education',
        title: 'Privacy Education',
        description: 'Learn about your privacy rights and workplace data protection',
        component: 'PrivacyEducationWidget',
        order: 3,
        size: 'medium',
        required: false
      },
      {
        id: 'privacy-settings',
        title: 'Privacy Settings',
        description: 'Manage your privacy preferences and consent choices',
        component: 'PrivacySettingsWidget',
        order: 4,
        size: 'small',
        required: false
      }
    ],
    navigationItems: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/privacy/dashboard',
        icon: 'Home',
        order: 1
      },
      {
        id: 'data-rights',
        label: 'My Data Rights',
        path: '/privacy/data-rights',
        icon: 'Shield',
        order: 2
      },
      {
        id: 'requests',
        label: 'My Requests',
        path: '/privacy/requests',
        icon: 'FileText',
        order: 3
      },
      {
        id: 'privacy-settings',
        label: 'Privacy Settings',
        path: '/settings',
        icon: 'Settings',
        order: 4
      },
      {
        id: 'help',
        label: 'Help & Support',
        path: '/faq',
        icon: 'HelpCircle',
        order: 5
      }
    ],
    permissions: [
      'view_own_data',
      'request_data_access',
      'request_data_correction',
      'request_data_deletion',
      'manage_privacy_preferences',
      'view_own_requests',
      'download_own_data'
    ],
    onboardingSteps: [
      {
        id: 'welcome',
        title: 'Welcome to Your Privacy Portal',
        description: 'Learn about your privacy rights and how to use this portal',
        component: 'WelcomeStep',
        order: 1,
        required: true,
        estimatedTime: '2 minutes'
      },
      {
        id: 'privacy-rights',
        title: 'Understanding Your Privacy Rights',
        description: 'Overview of your rights under employment privacy laws',
        component: 'PrivacyRightsStep',
        order: 2,
        required: true,
        estimatedTime: '3 minutes'
      },
      {
        id: 'first-request',
        title: 'Submit Your First Request',
        description: 'Walk through submitting a data access request',
        component: 'FirstRequestStep',
        order: 3,
        required: false,
        estimatedTime: '5 minutes'
      }
    ],
    features: [
      {
        id: 'data-access-requests',
        name: 'Data Access Requests',
        description: 'Request copies of your personal employment data',
        category: 'data-rights',
        priority: 'high',
        available: true
      },
      {
        id: 'data-correction-requests',
        name: 'Data Correction Requests',
        description: 'Request correction of inaccurate personal information',
        category: 'data-rights',
        priority: 'high',
        available: true
      },
      {
        id: 'data-deletion-requests',
        name: 'Data Deletion Requests',
        description: 'Request deletion of personal data when legally permissible',
        category: 'data-rights',
        priority: 'medium',
        available: true
      },
      {
        id: 'privacy-preferences',
        name: 'Privacy Preferences',
        description: 'Manage how your data is used and shared',
        category: 'management',
        priority: 'medium',
        available: true
      },
      {
        id: 'request-tracking',
        name: 'Request Tracking',
        description: 'Track the status of your data rights requests',
        category: 'management',
        priority: 'high',
        available: true
      }
    ]
  },
  job_prospect: {
    id: 'job_prospect',
    name: 'Job Applicant',
    displayName: 'Job Applicant',
    description: 'Individuals applying for employment who need to understand their privacy rights during the application process',
    icon: 'Briefcase',
    color: 'green',
    priorityLevel: 'medium',
    estimatedTimeCommitment: '3-5 minutes per application',
    regulations: ['ADA', 'EEOC', 'CCPA', 'BIPA'],
    primaryUseCases: [
      {
        id: 'understand-application-privacy',
        title: 'Understand Application Privacy Rights',
        description: 'Learn about privacy rights during the job application process',
        frequency: 'as-needed',
        priority: 'high',
        expectedOutcome: 'Clear understanding of privacy rights during job applications',
        relatedFeatures: ['privacy-education', 'rights-overview'],
        regulations: ['ADA', 'EEOC', 'CCPA'],
        steps: [
          {
            id: 'review-privacy-notice',
            title: 'Review Privacy Notice',
            description: 'Read the organization\'s privacy notice for job applicants',
            estimatedTime: '2-3 minutes',
            required: true,
            order: 1
          },
          {
            id: 'understand-rights',
            title: 'Understand Your Rights',
            description: 'Learn about your privacy rights as a job applicant',
            estimatedTime: '3-5 minutes',
            required: true,
            order: 2
          }
        ]
      },
      {
        id: 'request-application-data',
        title: 'Request Application Data',
        description: 'Request access to personal data collected during the application process',
        frequency: 'as-needed',
        priority: 'medium',
        expectedOutcome: 'Access to personal data collected during job application',
        relatedFeatures: ['data-access-requests', 'application-data-portal'],
        regulations: ['CCPA', 'GDPR'],
        steps: [
          {
            id: 'submit-application-request',
            title: 'Submit Application Data Request',
            description: 'Request access to data collected during your job application',
            estimatedTime: '2-3 minutes',
            required: true,
            order: 1
          },
          {
            id: 'verify-applicant-identity',
            title: 'Verify Applicant Identity',
            description: 'Provide identity verification for applicant data access',
            estimatedTime: '1-2 minutes',
            required: true,
            order: 2
          }
        ]
      }
    ],
    dashboardSections: [
      {
        id: 'application-privacy',
        title: 'Application Privacy Rights',
        description: 'Understand your privacy rights during the job application process',
        component: 'ApplicationPrivacyWidget',
        order: 1,
        size: 'large',
        required: true
      },
      {
        id: 'quick-actions',
        title: 'Quick Actions',
        description: 'Common tasks for job applicants',
        component: 'ApplicantQuickActionsWidget',
        order: 2,
        size: 'medium',
        required: true
      }
    ],
    navigationItems: [
      {
        id: 'application-privacy',
        label: 'Application Privacy',
        path: '/data-rights',
        icon: 'Briefcase',
        order: 1
      },
      {
        id: 'my-rights',
        label: 'My Rights',
        path: '/data-rights',
        icon: 'Shield',
        order: 2
      },
      {
        id: 'data-requests',
        label: 'Data Requests',
        path: '/privacy/data-rights',
        icon: 'FileText',
        order: 3
      }
    ],
    permissions: [
      'view_application_privacy',
      'request_application_data',
      'understand_applicant_rights'
    ],
    onboardingSteps: [
      {
        id: 'welcome-applicant',
        title: 'Welcome Job Applicant',
        description: 'Introduction to privacy rights during job applications',
        component: 'ApplicantWelcomeStep',
        order: 1,
        required: true,
        estimatedTime: '2 minutes'
      },
      {
        id: 'application-privacy-rights',
        title: 'Application Privacy Rights',
        description: 'Learn about your privacy rights as a job applicant',
        component: 'ApplicationPrivacyRightsStep',
        order: 2,
        required: true,
        estimatedTime: '3 minutes'
      }
    ],
    features: [
      {
        id: 'application-privacy-education',
        name: 'Application Privacy Education',
        description: 'Learn about privacy rights during job applications',
        category: 'education',
        priority: 'high',
        available: true
      },
      {
        id: 'application-data-requests',
        name: 'Application Data Requests',
        description: 'Request access to data collected during job applications',
        category: 'data-rights',
        priority: 'medium',
        available: true
      }
    ]
  },
  hr_staff: {
    id: 'hr_staff',
    name: 'HR Staff',
    displayName: 'HR Staff',
    description: 'Human resources professionals managing employee data and privacy compliance',
    icon: 'Users',
    color: 'purple',
    priorityLevel: 'high',
    estimatedTimeCommitment: '30-60 minutes per week',
    regulations: ['ADA', 'EEOC', 'CCPA', 'GDPR', 'BIPA', 'SHIELD'],
    primaryUseCases: [
      {
        id: 'process-data-requests',
        title: 'Process Employee Data Requests',
        description: 'Handle and respond to employee data rights requests',
        frequency: 'weekly',
        priority: 'critical',
        expectedOutcome: 'Timely processing of all employee data rights requests',
        relatedFeatures: ['data-request-management', 'compliance-tracking'],
        regulations: ['ADA', 'CCPA', 'GDPR'],
        steps: [
          {
            id: 'review-request',
            title: 'Review Data Request',
            description: 'Review incoming data rights requests for completeness and validity',
            estimatedTime: '2-3 minutes',
            required: true,
            order: 1
          },
          {
            id: 'verify-identity',
            title: 'Verify Requester Identity',
            description: 'Verify the identity of the person making the request',
            estimatedTime: '1-2 minutes',
            required: true,
            order: 2
          },
          {
            id: 'collect-data',
            title: 'Collect Requested Data',
            description: 'Gather the requested employee data from various systems',
            estimatedTime: '10-15 minutes',
            required: true,
            order: 3
          },
          {
            id: 'prepare-response',
            title: 'Prepare Response',
            description: 'Prepare the response with the requested data',
            estimatedTime: '5-10 minutes',
            required: true,
            order: 4
          },
          {
            id: 'deliver-response',
            title: 'Deliver Response',
            description: 'Deliver the response to the requester within legal timeframes',
            estimatedTime: '2-3 minutes',
            required: true,
            order: 5
          }
        ]
      },
      {
        id: 'manage-consent',
        title: 'Manage Employee Consent',
        description: 'Track and manage employee consent for data processing',
        frequency: 'weekly',
        priority: 'high',
        expectedOutcome: 'Up-to-date consent records for all employees',
        relatedFeatures: ['consent-management', 'consent-tracking'],
        regulations: ['CCPA', 'GDPR'],
        steps: [
          {
            id: 'review-consent-status',
            title: 'Review Consent Status',
            description: 'Check current consent status for all employees',
            estimatedTime: '5-10 minutes',
            required: true,
            order: 1
          },
          {
            id: 'update-consent-records',
            title: 'Update Consent Records',
            description: 'Update consent records based on employee preferences',
            estimatedTime: '10-15 minutes',
            required: true,
            order: 2
          }
        ]
      }
    ],
    dashboardSections: [
      {
        id: 'pending-requests',
        title: 'Pending Requests',
        description: 'Data rights requests requiring attention',
        component: 'PendingRequestsWidget',
        order: 1,
        size: 'large',
        required: true
      },
      {
        id: 'compliance-overview',
        title: 'Compliance Overview',
        description: 'Current compliance status and metrics',
        component: 'ComplianceOverviewWidget',
        order: 2,
        size: 'medium',
        required: true
      },
      {
        id: 'consent-management',
        title: 'Consent Management',
        description: 'Employee consent tracking and management',
        component: 'ConsentManagementWidget',
        order: 3,
        size: 'medium',
        required: true
      },
      {
        id: 'recent-activities',
        title: 'Recent Activities',
        description: 'Recent privacy-related activities and updates',
        component: 'RecentActivitiesWidget',
        order: 4,
        size: 'small',
        required: false
      }
    ],
    navigationItems: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/privacy/dashboard',
        icon: 'Home',
        order: 1
      },
      {
        id: 'data-rights',
        label: 'Data Rights',
        path: '/privacy/data-rights',
        icon: 'Shield',
        order: 2
      },
      {
        id: 'consent',
        label: 'Consent Management',
        path: '/privacy/consent',
        icon: 'CheckCircle',
        order: 3
      },
      {
        id: 'incidents',
        label: 'Privacy Incidents',
        path: '/privacy/incidents',
        icon: 'AlertTriangle',
        order: 4
      },
      {
        id: 'reports',
        label: 'Reports',
        path: '/privacy/reports',
        icon: 'BarChart3',
        order: 5
      }
    ],
    permissions: [
      'view_employee_data',
      'process_data_requests',
      'manage_consent',
      'view_compliance_status',
      'manage_incidents',
      'generate_reports',
      'view_analytics'
    ],
    onboardingSteps: [
      {
        id: 'hr-welcome',
        title: 'Welcome HR Staff',
        description: 'Introduction to HR privacy management tools',
        component: 'HRWelcomeStep',
        order: 1,
        required: true,
        estimatedTime: '3 minutes'
      },
      {
        id: 'data-request-process',
        title: 'Data Request Processing',
        description: 'Learn how to process employee data rights requests',
        component: 'DataRequestProcessStep',
        order: 2,
        required: true,
        estimatedTime: '5 minutes'
      },
      {
        id: 'consent-management',
        title: 'Consent Management',
        description: 'Understand consent tracking and management',
        component: 'ConsentManagementStep',
        order: 3,
        required: true,
        estimatedTime: '3 minutes'
      }
    ],
    features: [
      {
        id: 'data-request-management',
        name: 'Data Request Management',
        description: 'Process and track employee data rights requests',
        category: 'data-rights',
        priority: 'critical',
        available: true
      },
      {
        id: 'consent-tracking',
        name: 'Consent Tracking',
        description: 'Track and manage employee consent records',
        category: 'management',
        priority: 'high',
        available: true
      },
      {
        id: 'compliance-monitoring',
        name: 'Compliance Monitoring',
        description: 'Monitor privacy compliance status and metrics',
        category: 'compliance',
        priority: 'high',
        available: true
      },
      {
        id: 'incident-management',
        name: 'Incident Management',
        description: 'Report and manage privacy incidents',
        category: 'management',
        priority: 'high',
        available: true
      }
    ]
  },
  dpo: {
    id: 'dpo',
    name: 'Data Protection Officer',
    displayName: 'Data Protection Officer (DPO)',
    description: 'Data Protection Officers responsible for organizational privacy compliance and oversight',
    icon: 'Shield',
    color: 'red',
    priorityLevel: 'critical',
    estimatedTimeCommitment: '2-4 hours per week',
    regulations: ['ADA', 'EEOC', 'CCPA', 'GDPR', 'BIPA', 'SHIELD', 'PIPEDA'],
    primaryUseCases: [
      {
        id: 'privacy-program-oversight',
        title: 'Privacy Program Oversight',
        description: 'Oversee the organization\'s privacy program and compliance activities',
        frequency: 'weekly',
        priority: 'critical',
        expectedOutcome: 'Comprehensive privacy program oversight and compliance',
        relatedFeatures: ['privacy-dashboard', 'compliance-analytics', 'risk-assessment'],
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
      },
      {
        id: 'stakeholder-management',
        title: 'Stakeholder Management',
        description: 'Manage privacy portal access and permissions for all stakeholders',
        frequency: 'monthly',
        priority: 'high',
        expectedOutcome: 'Proper access controls and permissions for all users',
        relatedFeatures: ['stakeholder-management', 'access-control'],
        regulations: ['GDPR', 'CCPA'],
        steps: [
          {
            id: 'review-access-controls',
            title: 'Review Access Controls',
            description: 'Review current access controls and permissions',
            estimatedTime: '10-15 minutes',
            required: true,
            order: 1
          },
          {
            id: 'update-permissions',
            title: 'Update Permissions',
            description: 'Update user permissions based on role and responsibilities',
            estimatedTime: '15-20 minutes',
            required: true,
            order: 2
          }
        ]
      }
    ],
    dashboardSections: [
      {
        id: 'privacy-overview',
        title: 'Privacy Program Overview',
        description: 'High-level view of privacy program status and metrics',
        component: 'PrivacyOverviewWidget',
        order: 1,
        size: 'full',
        required: true
      },
      {
        id: 'compliance-metrics',
        title: 'Compliance Metrics',
        description: 'Detailed compliance metrics and analytics',
        component: 'ComplianceMetricsWidget',
        order: 2,
        size: 'large',
        required: true
      },
      {
        id: 'risk-assessment',
        title: 'Risk Assessment',
        description: 'Privacy risk assessment and mitigation status',
        component: 'RiskAssessmentWidget',
        order: 3,
        size: 'medium',
        required: true
      },
      {
        id: 'stakeholder-management',
        title: 'Stakeholder Management',
        description: 'Manage user access and permissions',
        component: 'StakeholderManagementWidget',
        order: 4,
        size: 'medium',
        required: true
      }
    ],
    navigationItems: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/privacy/dashboard',
        icon: 'Home',
        order: 1
      },
      {
        id: 'analytics',
        label: 'Analytics',
        path: '/privacy/analytics',
        icon: 'BarChart3',
        order: 2
      },
      {
        id: 'stakeholders',
        label: 'Stakeholders',
        path: '/privacy/stakeholders',
        icon: 'Users',
        order: 3
      },
      {
        id: 'obligations',
        label: 'Obligations',
        path: '/privacy/obligations',
        icon: 'FileText',
        order: 4
      },
      {
        id: 'incidents',
        label: 'Incidents',
        path: '/privacy/incidents',
        icon: 'AlertTriangle',
        order: 5
      },
      {
        id: 'vendors',
        label: 'Vendors',
        path: '/privacy/vendors',
        icon: 'Building',
        order: 6
      },
      {
        id: 'automation',
        label: 'Automation',
        path: '/privacy/automation',
        icon: 'Settings',
        order: 7
      },
      {
        id: 'reports',
        label: 'Reports',
        path: '/privacy/reports',
        icon: 'FileText',
        order: 8
      }
    ],
    permissions: [
      'view_all_data',
      'manage_all_requests',
      'manage_stakeholders',
      'view_analytics',
      'manage_compliance',
      'manage_incidents',
      'manage_vendors',
      'configure_automation',
      'generate_reports',
      'admin_access'
    ],
    onboardingSteps: [
      {
        id: 'dpo-welcome',
        title: 'Welcome DPO',
        description: 'Introduction to DPO privacy management tools',
        component: 'DPOWelcomeStep',
        order: 1,
        required: true,
        estimatedTime: '5 minutes'
      },
      {
        id: 'privacy-program-setup',
        title: 'Privacy Program Setup',
        description: 'Configure privacy program settings and compliance tracking',
        component: 'PrivacyProgramSetupStep',
        order: 2,
        required: true,
        estimatedTime: '10 minutes'
      },
      {
        id: 'stakeholder-configuration',
        title: 'Stakeholder Configuration',
        description: 'Set up stakeholder access and permissions',
        component: 'StakeholderConfigurationStep',
        order: 3,
        required: true,
        estimatedTime: '8 minutes'
      }
    ],
    features: [
      {
        id: 'privacy-dashboard',
        name: 'Privacy Dashboard',
        description: 'Comprehensive privacy program oversight dashboard',
        category: 'management',
        priority: 'critical',
        available: true
      },
      {
        id: 'compliance-analytics',
        name: 'Compliance Analytics',
        description: 'Advanced analytics and reporting for privacy compliance',
        category: 'reporting',
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
      },
      {
        id: 'stakeholder-management',
        name: 'Stakeholder Management',
        description: 'Manage user access, permissions, and roles',
        category: 'management',
        priority: 'high',
        available: true
      },
      {
        id: 'vendor-oversight',
        name: 'Vendor Oversight',
        description: 'Assess and monitor third-party vendor privacy compliance',
        category: 'compliance',
        priority: 'high',
        available: true
      },
      {
        id: 'automation-configuration',
        name: 'Automation Configuration',
        description: 'Configure automated privacy compliance workflows',
        category: 'management',
        priority: 'medium',
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
    'employee': 'worker',
    'job_applicant': 'job_prospect',
    'hr_staff': 'hr_staff',
    'administrator': 'dpo'
  };
  
  const personaId = roleToPersonaMap[role];
  return personaId ? PERSONAS[personaId] : undefined;
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