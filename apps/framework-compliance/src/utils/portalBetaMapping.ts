// Role to Cohort Mapping for Portal Beta Program

export type CohortType = 'employee' | 'hr' | 'compliance' | 'legal' | 'multiple';

export interface CohortInfo {
  name: string;
  shortName: string;
  testers: string;
  builds: string[];
  slotsTotal: number;
  icon: string;
  color: string;
}

export const COHORT_INFO: Record<CohortType, CohortInfo> = {
  employee: {
    name: 'Cohort A: Employee Features',
    shortName: 'Employee Features',
    testers: '5-10 employees per organization',
    builds: [
      'Employee self-service data rights',
      'Data access request workflow',
      'Correction and deletion requests',
      'Privacy preference management',
      'Employee dashboard interface'
    ],
    slotsTotal: 25,
    icon: 'Users',
    color: 'blue'
  },
  hr: {
    name: 'Cohort B: HR & Manager Features',
    shortName: 'HR Features',
    testers: '2-3 HR staff per organization',
    builds: [
      'HR privacy duty tracking',
      'Request processing workflows',
      'Incident reporting tools',
      'Consent management interface',
      'HR compliance guidelines'
    ],
    slotsTotal: 25,
    icon: 'UserCheck',
    color: 'green'
  },
  compliance: {
    name: 'Cohort C: Compliance & Oversight',
    shortName: 'Compliance Features',
    testers: '1-2 compliance officers per organization',
    builds: [
      'Executive oversight dashboard',
      'Request monitoring system',
      'Compliance analytics',
      'Audit report generation',
      'Stakeholder access management'
    ],
    slotsTotal: 25,
    icon: 'Shield',
    color: 'purple'
  },
  legal: {
    name: 'Cohort D: Legal & Representative Access',
    shortName: 'Legal Features',
    testers: 'Legal representatives and authorized parties',
    builds: [
      'Authorized representative portal',
      'Verification workflows',
      'Request submission system',
      'Status tracking interface',
      'Secure communication channels'
    ],
    slotsTotal: 25,
    icon: 'Scale',
    color: 'amber'
  },
  multiple: {
    name: 'Multiple Cohorts (White-Label Focus)',
    shortName: 'Multi-Cohort Access',
    testers: 'Various stakeholder types across organization',
    builds: [
      'Comprehensive cross-role testing',
      'White-label customization',
      'Multi-tenant features',
      'Reseller capabilities',
      'Enterprise-scale features'
    ],
    slotsTotal: 25,
    icon: 'Building2',
    color: 'indigo'
  }
};

export const ROLE_TO_COHORT_MAP: Record<string, CohortType> = {
  // Compliance & Privacy Roles
  'Data Protection Officer': 'compliance',
  'Privacy Officer': 'compliance',
  'Chief Privacy Officer': 'compliance',
  'Compliance Manager': 'compliance',
  'Compliance Officer': 'compliance',
  'Privacy Manager': 'compliance',
  
  // Legal Roles
  'Legal Counsel': 'legal',
  'General Counsel': 'legal',
  'Attorney': 'legal',
  'Legal Representative': 'legal',
  
  // HR Roles
  'HR Manager': 'hr',
  'HR Director': 'hr',
  'People Operations': 'hr',
  'Employee Relations': 'hr',
  'HR Specialist': 'hr',
  'Chief People Officer': 'hr',
  
  // Small Business / Founder (Employee self-service focus)
  'Small Business Owner': 'employee',
  'Startup Founder': 'employee',
  'Entrepreneur': 'employee',
  'Business Owner': 'employee',
  
  // IT & Security (Compliance focus)
  'IT Manager': 'compliance',
  'Security Officer': 'compliance',
  'CISO': 'compliance',
  'IT Director': 'compliance',
  
  // Consultants & Service Providers (Multiple cohorts + white-label)
  'Consultant': 'multiple',
  'MSP': 'multiple',
  'Service Provider': 'multiple',
  'Privacy Consultant': 'multiple',
  'Compliance Consultant': 'multiple'
};

export function getRoleCohort(role: string): CohortType {
  // Direct match
  if (ROLE_TO_COHORT_MAP[role]) {
    return ROLE_TO_COHORT_MAP[role];
  }
  
  // Fuzzy matching for common variations
  const roleLower = role.toLowerCase();
  
  if (roleLower.includes('dpo') || roleLower.includes('data protection')) {
    return 'compliance';
  }
  if (roleLower.includes('privacy') && (roleLower.includes('officer') || roleLower.includes('manager'))) {
    return 'compliance';
  }
  if (roleLower.includes('compliance')) {
    return 'compliance';
  }
  if (roleLower.includes('legal') || roleLower.includes('counsel') || roleLower.includes('attorney')) {
    return 'legal';
  }
  if (roleLower.includes('hr') || roleLower.includes('human resources') || roleLower.includes('people')) {
    return 'hr';
  }
  if (roleLower.includes('consultant') || roleLower.includes('msp') || roleLower.includes('service provider')) {
    return 'multiple';
  }
  if (roleLower.includes('owner') || roleLower.includes('founder') || roleLower.includes('entrepreneur')) {
    return 'employee';
  }
  
  // Default to employee cohort (most accessible)
  return 'employee';
}

export function getCohortInfo(cohort: CohortType): CohortInfo {
  return COHORT_INFO[cohort];
}

export interface RoleBetaMessage {
  title: string;
  description: string;
  stakeholderNeeds: string[];
  betaValue: string;
  ctaText: string;
}

export function getRoleBetaMessage(role: string, cohort: CohortType): RoleBetaMessage {
  // Role-specific messaging
  const messages: Record<CohortType, RoleBetaMessage> = {
    compliance: {
      title: 'Help Us Build Portal for Privacy Professionals',
      description: `As a ${role}, you can shape Privacy Portal's compliance oversight and workforce management features.`,
      stakeholderNeeds: [
        'Employee self-service reduces your request workload',
        'HR team privacy duty tracking',
        'Compliance oversight dashboard for monitoring',
        'Automated reporting and audit trails'
      ],
      betaValue: 'Your expertise helps us build enterprise-grade compliance tools.',
      ctaText: 'Join Compliance Beta Cohort'
    },
    hr: {
      title: 'Build Portal Features for HR Professionals',
      description: `As an ${role}, you understand HR privacy challenges. Help us build tools that actually work for HR teams.`,
      stakeholderNeeds: [
        'Privacy duty checklist for HR tasks',
        'Employee data rights request workflow',
        'Consent management for HR processes',
        'Incident reporting and tracking'
      ],
      betaValue: 'Shape HR features from your real-world experience.',
      ctaText: 'Join HR Beta Cohort'
    },
    legal: {
      title: 'Shape Portal for Legal Professionals',
      description: `As ${role}, you can help build Portal's legal representative access and verification features.`,
      stakeholderNeeds: [
        'Authorized representative portal',
        'Verification and authentication workflows',
        'Secure client communication channels',
        'Legal request tracking and status'
      ],
      betaValue: 'Build legal-grade privacy tools with proper authorization.',
      ctaText: 'Join Legal Beta Cohort'
    },
    employee: {
      title: 'Extend Privacy to Your Entire Team',
      description: `As a ${role}, Privacy Portal gives your team self-service privacy tools, reducing your workload.`,
      stakeholderNeeds: [
        'Employee self-service for data rights',
        'Automated request processing',
        'Team privacy awareness tools',
        'Simple compliance interface'
      ],
      betaValue: 'Perfect for small teams managing privacy without dedicated staff.',
      ctaText: 'Join Employee Beta Cohort'
    },
    multiple: {
      title: 'White-Label Portal for Your Clients',
      description: `As a ${role}, deploy Privacy Portal to your clients under YOUR brand with our white-label option.`,
      stakeholderNeeds: [
        'White-label Portal for client deployments',
        'Multi-tenant management capabilities',
        'Reseller licensing opportunity',
        'Revenue from Portal as a service'
      ],
      betaValue: 'Turn Portal into a billable service offering for your practice.',
      ctaText: 'Join White-Label Beta'
    }
  };
  
  return messages[cohort];
}

export function shouldShowBetaInvite(
  userHasPortal: boolean, 
  userDismissedInvite: boolean,
  assessmentCompleted: boolean
): boolean {
  // Don't show if user already has Portal
  if (userHasPortal) return false;
  
  // Don't show if user dismissed
  if (userDismissedInvite) return false;
  
  // Only show after assessment completed
  if (!assessmentCompleted) return false;
  
  return true;
}

export interface BetaBenefits {
  pricing: string;
  features: string[];
  extras: string[];
}

export function getBetaBenefits(cohort: CohortType): BetaBenefits {
  const baseBenefits = {
    pricing: 'Lock in +$99/mo forever (50% off $199/mo)',
    features: [
      'Shape features for YOUR stakeholders',
      'Direct founder access & VIP support',
      'Priority feature requests',
      'Lifetime beta pricing guarantee'
    ],
    extras: [
      'Limited to 100 organizations',
      `${COHORT_INFO[cohort].slotsTotal} spots in your cohort`,
      'Production launch in 6 months'
    ]
  };
  
  // Add white-label benefits for multiple/consultant cohort
  if (cohort === 'multiple') {
    baseBenefits.features.unshift('White-label beta: +$249/mo locked forever');
    baseBenefits.features.push('Reseller program priority access');
    baseBenefits.extras.push('Revenue opportunity from client deployments');
  }
  
  return baseBenefits;
}

