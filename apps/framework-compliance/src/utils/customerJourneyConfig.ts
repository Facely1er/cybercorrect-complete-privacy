/**
 * Customer Journey Configuration for CyberCorrect Toolkit
 * 
 * This file defines the mapping of toolkit tools to customer journey phases,
 * their criticality levels, and positioning within the compliance workflow.
 */

import {
  BarChart3,
  Target,
  Building,
  Database,
  Network,
  Shield,
  FileText,
  FileCheck,
  Users,
  Calendar,
  Settings,
  AlertTriangle,
  RefreshCw,
  Eye,
  Clock,
  type LucideIcon
} from 'lucide-react';

// Journey Phase Definitions
export type JourneyPhase = 'discovery' | 'foundation' | 'documentation' | 'operations' | 'optimization';

export type CriticalityLevel = 'critical' | 'high' | 'medium' | 'low';

export type ToolPosition = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'emergency';

export interface JourneyPhaseConfig {
  id: JourneyPhase;
  name: string;
  description: string;
  duration: string;
  order: number;
  criticalityDefault: CriticalityLevel;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface ToolJourneyMapping {
  toolId: string;
  toolName: string;
  toolPath: string;
  description: string;
  icon: LucideIcon;
  phase: JourneyPhase;
  criticality: CriticalityLevel;
  position: ToolPosition;
  customerValue: string;
  timeEstimate: string;
  complexity: 'Basic' | 'Intermediate' | 'Advanced';
  triggerConditions: string[];
  prerequisites: string[];
  outputs: string[];
  personas: string[];
  regulations: string[];
  features: string[];
}

export interface PersonaJourney {
  personaId: string;
  personaName: string;
  journeyPath: string[];
  primaryTools: string[];
  priorityLevel: 'critical' | 'high' | 'medium' | 'low';
}

// Journey Phases Configuration
export const JOURNEY_PHASES: Record<JourneyPhase, JourneyPhaseConfig> = {
  discovery: {
    id: 'discovery',
    name: 'Discovery',
    description: 'Assess current privacy posture and identify compliance gaps',
    duration: 'Week 1-2',
    order: 1,
    criticalityDefault: 'critical',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800'
  },
  foundation: {
    id: 'foundation',
    name: 'Foundation',
    description: 'Map data flows and establish processing documentation',
    duration: 'Week 2-4',
    order: 2,
    criticalityDefault: 'critical',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800'
  },
  documentation: {
    id: 'documentation',
    name: 'Documentation',
    description: 'Create policies, DPIAs, and compliance documentation',
    duration: 'Week 4-8',
    order: 3,
    criticalityDefault: 'high',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  operations: {
    id: 'operations',
    name: 'Operations',
    description: 'Manage ongoing privacy operations and requests',
    duration: 'Ongoing',
    order: 4,
    criticalityDefault: 'high',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  optimization: {
    id: 'optimization',
    name: 'Optimization',
    description: 'Continuously improve and maintain compliance posture',
    duration: 'Ongoing',
    order: 5,
    criticalityDefault: 'medium',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800'
  }
};

// Criticality Level Configuration
export const CRITICALITY_CONFIG: Record<CriticalityLevel, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  order: number;
}> = {
  critical: {
    label: 'Critical',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    borderColor: 'border-red-300 dark:border-red-700',
    icon: '🔴',
    order: 1
  },
  high: {
    label: 'High',
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    borderColor: 'border-orange-300 dark:border-orange-700',
    icon: '🟠',
    order: 2
  },
  medium: {
    label: 'Medium',
    color: 'text-yellow-700 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-300 dark:border-yellow-700',
    icon: '🟡',
    order: 3
  },
  low: {
    label: 'Low',
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    borderColor: 'border-green-300 dark:border-green-700',
    icon: '🟢',
    order: 4
  }
};

// Complete Tool Journey Mappings
export const TOOL_JOURNEY_MAPPINGS: ToolJourneyMapping[] = [
  // ===== DISCOVERY PHASE =====
  {
    toolId: 'privacy-gap-analyzer',
    toolName: 'Privacy Gap Analyzer',
    toolPath: '/toolkit/privacy-gap-analyzer',
    description: 'Multi-regulation privacy assessment with gap identification and prioritized remediation',
    icon: BarChart3,
    phase: 'discovery',
    criticality: 'critical',
    position: 'primary',
    customerValue: 'Understand your complete privacy compliance posture across GDPR, CCPA, LGPD, PIPEDA, and NIST frameworks',
    timeEstimate: '30 mins',
    complexity: 'Advanced',
    triggerConditions: ['New customer onboarding', 'Annual compliance review', 'Post-incident assessment'],
    prerequisites: [],
    outputs: ['Compliance score', 'Gap analysis report', 'Remediation roadmap', 'Risk prioritization'],
    personas: ['privacy_officer', 'compliance_manager', 'data_protection_officer'],
    regulations: ['GDPR', 'CCPA', 'LGPD', 'PIPEDA', 'NIST Privacy Framework'],
    features: ['Multi-regulation mapping', 'Gap prioritization', 'Risk assessment', 'Remediation planning']
  },
  {
    toolId: 'privacy-risk-radar',
    toolName: 'Privacy Risk Radar',
    toolPath: '/toolkit/privacy-risk-radar',
    description: 'Continuous monitoring and real-time detection of privacy compliance risks from actual data',
    icon: Shield,
    phase: 'discovery',
    criticality: 'high',
    position: 'primary',
    customerValue: 'Proactively identify and address privacy risks before they become compliance violations',
    timeEstimate: '5 mins',
    complexity: 'Intermediate',
    triggerConditions: ['Continuous monitoring', 'After data changes', 'Regular compliance checks', 'Post-remediation verification'],
    prerequisites: ['privacy-gap-analyzer'],
    outputs: ['Detected risks', 'Privacy metrics', 'Risk trends', 'Remediation recommendations'],
    personas: ['privacy_officer', 'compliance_manager', 'data_protection_officer'],
    regulations: ['GDPR', 'CCPA', 'LGPD', 'PIPEDA'],
    features: ['Real-time risk detection', 'Privacy metrics dashboard', 'Automated scanning', 'Risk prioritization']
  },
  {
    toolId: 'privacy-by-design-assessment',
    toolName: 'Privacy by Design Assessment',
    toolPath: '/toolkit/privacy-by-design-assessment',
    description: 'Evaluate systems and processes against the 7 Privacy by Design principles',
    icon: Target,
    phase: 'discovery',
    criticality: 'high',
    position: 'secondary',
    customerValue: 'Ensure privacy is embedded into system design from the ground up',
    timeEstimate: '30 mins',
    complexity: 'Intermediate',
    triggerConditions: ['New system development', 'System acquisition', 'Process redesign'],
    prerequisites: [],
    outputs: ['PbD compliance score', 'Principle-by-principle assessment', 'Implementation guidance'],
    personas: ['privacy_officer', 'data_steward', 'compliance_manager'],
    regulations: ['GDPR', 'CCPA'],
    features: ['7 principles assessment', 'Scoring system', 'Implementation guidance', 'Compliance tracking']
  },
  {
    toolId: 'vendor-risk-assessment',
    toolName: 'Vendor Risk Assessment',
    toolPath: '/toolkit/vendor-risk-assessment',
    description: 'Evaluate and monitor third-party vendors for privacy compliance and data protection',
    icon: Building,
    phase: 'discovery',
    criticality: 'high',
    position: 'tertiary',
    customerValue: 'Identify and mitigate third-party privacy risks in your supply chain',
    timeEstimate: '25 mins',
    complexity: 'Intermediate',
    triggerConditions: ['New vendor onboarding', 'Annual vendor review', 'Incident involving vendor'],
    prerequisites: [],
    outputs: ['Vendor risk scores', 'DPA status tracking', 'Compliance recommendations'],
    personas: ['privacy_officer', 'compliance_manager', 'legal_counsel'],
    regulations: ['GDPR', 'CCPA', 'LGPD'],
    features: ['Risk categorization', 'Compliance tracking', 'Assessment scoring', 'DPA status tracking']
  },

  // ===== FOUNDATION PHASE =====
  {
    toolId: 'gdpr-mapper',
    toolName: 'GDPR Data Mapper',
    toolPath: '/toolkit/gdpr-mapper',
    description: 'Map personal data processing for privacy compliance with Article 30 RoPA',
    icon: Database,
    phase: 'foundation',
    criticality: 'critical',
    position: 'primary',
    customerValue: 'Create comprehensive Records of Processing Activities required by GDPR Article 30',
    timeEstimate: '25 mins',
    complexity: 'Intermediate',
    triggerConditions: ['Gap analyzer shows Identify weakness', 'GDPR compliance requirement', 'Audit preparation'],
    prerequisites: ['privacy-gap-analyzer'],
    outputs: ['Processing activity records', 'Legal basis documentation', 'Data flow diagrams'],
    personas: ['privacy_officer', 'data_steward', 'compliance_manager'],
    regulations: ['GDPR'],
    features: ['Data processing mapping', 'Legal basis tracking', 'Rights management', 'Article 30 compliance']
  },
  {
    toolId: 'pii-data-flow-mapper',
    toolName: 'PII Data Flow Mapper',
    toolPath: '/toolkit/pii-data-flow-mapper',
    description: 'Visualize and document PII flows for multi-regulation compliance',
    icon: Network,
    phase: 'foundation',
    criticality: 'critical',
    position: 'secondary',
    customerValue: 'Understand exactly how personal data moves through your organization and to third parties',
    timeEstimate: '30 mins',
    complexity: 'Intermediate',
    triggerConditions: ['Cross-border data transfers', 'Complex data flows', 'Multi-system integration'],
    prerequisites: ['gdpr-mapper'],
    outputs: ['PII flow visualization', 'Cross-border transfer documentation', 'Third-party processor map'],
    personas: ['privacy_officer', 'data_steward', 'compliance_manager'],
    regulations: ['GDPR', 'CCPA', 'PIPEDA'],
    features: ['PII flow visualization', 'Legal basis validation', 'Data subject rights mapping', 'Cross-border transfer tracking', 'Third-party processor documentation']
  },
  {
    toolId: 'employee-digital-footprint',
    toolName: 'Employee Digital Footprint Assessment',
    toolPath: '/toolkit/employee-digital-footprint',
    description: 'Assess employee digital footprint exposure for security awareness',
    icon: Users,
    phase: 'foundation',
    criticality: 'medium',
    position: 'tertiary',
    customerValue: 'Understand internal data exposure and employee privacy training needs',
    timeEstimate: '20 mins',
    complexity: 'Intermediate',
    triggerConditions: ['Security awareness training', 'Incident response', 'Annual assessment'],
    prerequisites: [],
    outputs: ['Employee data inventory', 'Risk assessment report', 'Training recommendations'],
    personas: ['privacy_officer', 'data_steward'],
    regulations: ['GDPR', 'CCPA'],
    features: ['Employee data inventory', 'Risk assessment', 'Compliance tracking', 'Export reports']
  },

  // ===== DOCUMENTATION PHASE =====
  {
    toolId: 'dpia-generator',
    toolName: 'DPIA Generator',
    toolPath: '/toolkit/dpia-generator',
    description: 'Create Data Protection Impact Assessments for high-risk processing',
    icon: FileCheck,
    phase: 'documentation',
    criticality: 'critical',
    position: 'primary',
    customerValue: 'Meet GDPR Article 35 requirements with structured impact assessments',
    timeEstimate: '20 mins',
    complexity: 'Intermediate',
    triggerConditions: ['High-risk processing identified', 'New processing activity', 'Gap analyzer shows Control weakness'],
    prerequisites: ['gdpr-mapper', 'pii-data-flow-mapper'],
    outputs: ['DPIA report', 'Risk assessment', 'Mitigation recommendations', 'DPO consultation record'],
    personas: ['privacy_officer', 'data_protection_officer', 'compliance_manager'],
    regulations: ['GDPR'],
    features: ['Risk-based assessment', 'Template library', 'Stakeholder consultation', 'Compliance validation']
  },
  {
    toolId: 'dpia-manager',
    toolName: 'DPIA Manager',
    toolPath: '/toolkit/dpia-manager',
    description: 'Enhanced DPIA management with lifecycle tracking and risk matrix',
    icon: FileCheck,
    phase: 'documentation',
    criticality: 'high',
    position: 'secondary',
    customerValue: 'Track and manage all DPIAs throughout their lifecycle with visual risk analysis',
    timeEstimate: '25 mins',
    complexity: 'Intermediate',
    triggerConditions: ['Multiple DPIAs to manage', 'DPIA review cycle', 'Audit preparation'],
    prerequisites: ['dpia-generator'],
    outputs: ['DPIA portfolio view', 'Risk matrix visualization', 'Review schedules', 'Audit documentation'],
    personas: ['privacy_officer', 'data_protection_officer', 'compliance_manager'],
    regulations: ['GDPR'],
    features: ['DPIA lifecycle management', 'Risk matrix visualization', 'Multiple templates', 'Checklist guidance']
  },
  {
    toolId: 'privacy-policy-generator',
    toolName: 'Privacy Policy Generator',
    toolPath: '/toolkit/privacy-policy-generator',
    description: 'Generate privacy policies for global regulations',
    icon: FileText,
    phase: 'documentation',
    criticality: 'high',
    position: 'tertiary',
    customerValue: 'Create legally compliant privacy notices customized for your organization',
    timeEstimate: '15 mins',
    complexity: 'Intermediate',
    triggerConditions: ['New privacy policy needed', 'Policy update required', 'Multi-jurisdiction expansion'],
    prerequisites: ['privacy-gap-analyzer'],
    outputs: ['Privacy policy document', 'Multi-regulation compliance', 'Customized clauses'],
    personas: ['legal_counsel', 'privacy_officer', 'compliance_manager'],
    regulations: ['GDPR', 'CCPA', 'LGPD', 'PIPEDA'],
    features: ['Multi-regulation support', 'Organization customization', 'Template library', 'Export formats']
  },
  {
    toolId: 'retention-policy-generator',
    toolName: 'Retention Policy Generator',
    toolPath: '/toolkit/retention-policy-generator',
    description: 'Manage data retention policies and ensure compliance with legal requirements',
    icon: Clock,
    phase: 'documentation',
    criticality: 'medium',
    position: 'quaternary',
    customerValue: 'Define and enforce data retention schedules aligned with regulations',
    timeEstimate: '20 mins',
    complexity: 'Intermediate',
    triggerConditions: ['Data lifecycle management', 'Storage optimization', 'Compliance requirement'],
    prerequisites: ['gdpr-mapper'],
    outputs: ['Retention policy document', 'Retention schedules', 'Compliance tracking report'],
    personas: ['data_steward', 'privacy_officer', 'compliance_manager'],
    regulations: ['GDPR', 'CCPA'],
    features: ['Policy creation', 'Retention schedules', 'Compliance tracking', 'Review cycles']
  },

  // ===== OPERATIONS PHASE =====
  {
    toolId: 'privacy-rights-manager',
    toolName: 'Privacy Rights Manager',
    toolPath: '/toolkit/privacy-rights-manager',
    description: 'Manage data subject rights requests and responses with SLA tracking',
    icon: Users,
    phase: 'operations',
    criticality: 'critical',
    position: 'primary',
    customerValue: 'Handle DSARs efficiently within regulatory timeframes (30 days GDPR, 45 days CCPA)',
    timeEstimate: '30 mins',
    complexity: 'Intermediate',
    triggerConditions: ['DSAR received', 'Rights request workflow setup', 'SLA monitoring needed'],
    prerequisites: ['gdpr-mapper'],
    outputs: ['Request tracking', 'Response documentation', 'SLA compliance reports', 'Audit trail'],
    personas: ['privacy_officer', 'data_protection_officer', 'compliance_manager'],
    regulations: ['GDPR', 'CCPA', 'LGPD', 'PIPEDA'],
    features: ['Request workflow management', 'Identity verification', 'Response automation', 'Comprehensive audit tracking']
  },
  {
    toolId: 'consent-management',
    toolName: 'Consent Management',
    toolPath: '/toolkit/consent-management',
    description: 'Track and manage consent and privacy preferences',
    icon: Users,
    phase: 'operations',
    criticality: 'high',
    position: 'secondary',
    customerValue: 'Maintain compliant consent records with renewal tracking',
    timeEstimate: '20 mins',
    complexity: 'Intermediate',
    triggerConditions: ['Consent collection required', 'Consent audit', 'Marketing compliance'],
    prerequisites: [],
    outputs: ['Consent records', 'Preference center', 'Renewal schedules', 'Compliance documentation'],
    personas: ['privacy_officer', 'compliance_manager'],
    regulations: ['GDPR', 'CCPA', 'ePrivacy'],
    features: ['Consent tracking', 'Renewal management', 'Form templates', 'Multi-regulation support']
  },
  {
    toolId: 'service-provider-manager',
    toolName: 'Service Provider Manager',
    toolPath: '/toolkit/service-provider-manager',
    description: 'Comprehensive processor and service provider management',
    icon: Building,
    phase: 'operations',
    criticality: 'high',
    position: 'tertiary',
    customerValue: 'Track processor agreements, compliance status, and renewal dates',
    timeEstimate: '30 mins',
    complexity: 'Intermediate',
    triggerConditions: ['DPA management needed', 'Vendor onboarding', 'Contract renewal'],
    prerequisites: ['vendor-risk-assessment'],
    outputs: ['Provider inventory', 'Agreement tracking', 'Compliance status', 'Renewal alerts'],
    personas: ['privacy_officer', 'legal_counsel', 'compliance_manager'],
    regulations: ['GDPR', 'CCPA'],
    features: ['Provider management', 'Agreement tracking', 'Compliance monitoring', 'Risk assessment']
  },
  {
    toolId: 'incident-response-manager',
    toolName: 'Incident Response Manager',
    toolPath: '/toolkit/incident-response-manager',
    description: 'Track and manage privacy incidents and data breaches',
    icon: AlertTriangle,
    phase: 'operations',
    criticality: 'critical',
    position: 'emergency',
    customerValue: 'Respond to breaches within 72-hour notification requirements',
    timeEstimate: '25 mins',
    complexity: 'Intermediate',
    triggerConditions: ['Security incident', 'Data breach suspected', 'Compliance violation'],
    prerequisites: [],
    outputs: ['Incident log', 'Notification decisions', 'Response documentation', 'Regulatory filings'],
    personas: ['privacy_officer', 'data_protection_officer', 'compliance_manager'],
    regulations: ['GDPR', 'CCPA', 'HIPAA'],
    features: ['Incident tracking', 'Regulatory notifications', 'Response workflow', 'Documentation']
  },

  // ===== OPTIMIZATION PHASE =====
  {
    toolId: 'privacy-maintenance-scheduler',
    toolName: 'Privacy Maintenance Scheduler',
    toolPath: '/toolkit/privacy-maintenance-scheduler',
    description: 'Schedule and manage automated privacy compliance maintenance tasks',
    icon: Calendar,
    phase: 'optimization',
    criticality: 'low',
    position: 'primary',
    customerValue: 'Automate compliance task reminders and prevent compliance drift',
    timeEstimate: '15 mins',
    complexity: 'Basic',
    triggerConditions: ['Compliance program established', 'Recurring tasks needed', 'Team coordination'],
    prerequisites: ['privacy-gap-analyzer'],
    outputs: ['Task schedules', 'Automated reminders', 'Progress tracking', 'Compliance calendar'],
    personas: ['privacy_officer', 'compliance_manager'],
    regulations: ['All'],
    features: ['Task scheduling', 'Automated reminders', 'Recurring tasks', 'Progress tracking']
  },
  {
    toolId: 'privacy-settings-audit',
    toolName: 'Privacy Settings Audit',
    toolPath: '/toolkit/privacy-settings-audit',
    description: 'Audit and configure organizational privacy settings across platforms',
    icon: Settings,
    phase: 'optimization',
    criticality: 'medium',
    position: 'secondary',
    customerValue: 'Ensure consistent privacy configurations across all systems',
    timeEstimate: '30 mins',
    complexity: 'Intermediate',
    triggerConditions: ['Platform configuration review', 'New system deployment', 'Compliance audit'],
    prerequisites: [],
    outputs: ['Configuration audit report', 'Privacy checklists', 'Compliance scoring'],
    personas: ['privacy_officer', 'data_steward'],
    regulations: ['GDPR', 'CCPA'],
    features: ['Platform auditing', 'Privacy checklists', 'Configuration tracking', 'Compliance scoring']
  },
  {
    toolId: 'data-broker-removal',
    toolName: 'Data Broker Removal Manager',
    toolPath: '/toolkit/data-broker-removal',
    description: 'Track and manage organizational data removal requests from data brokers',
    icon: RefreshCw,
    phase: 'optimization',
    criticality: 'medium',
    position: 'tertiary',
    customerValue: 'Systematically remove organizational data from data broker databases',
    timeEstimate: '25 mins',
    complexity: 'Intermediate',
    triggerConditions: ['Data minimization initiative', 'CCPA compliance', 'Privacy enhancement'],
    prerequisites: [],
    outputs: ['Removal request tracking', 'Opt-out documentation', 'Status reports'],
    personas: ['privacy_officer', 'data_steward'],
    regulations: ['CCPA', 'GDPR'],
    features: ['Removal tracking', 'Opt-out templates', 'Status monitoring', 'Export reports']
  }
];

// Persona Journey Configurations
export const PERSONA_JOURNEYS: PersonaJourney[] = [
  {
    personaId: 'privacy_officer',
    personaName: 'Privacy Officer / DPO',
    journeyPath: ['privacy-gap-analyzer', 'gdpr-mapper', 'dpia-manager', 'privacy-rights-manager', 'incident-response-manager'],
    primaryTools: ['privacy-gap-analyzer', 'dpia-manager', 'privacy-rights-manager'],
    priorityLevel: 'critical'
  },
  {
    personaId: 'data_steward',
    personaName: 'Data Steward',
    journeyPath: ['privacy-gap-analyzer', 'gdpr-mapper', 'pii-data-flow-mapper', 'retention-policy-generator', 'privacy-by-design-assessment'],
    primaryTools: ['gdpr-mapper', 'pii-data-flow-mapper', 'retention-policy-generator'],
    priorityLevel: 'high'
  },
  {
    personaId: 'legal_counsel',
    personaName: 'Legal Counsel',
    journeyPath: ['privacy-gap-analyzer', 'privacy-policy-generator', 'service-provider-manager', 'vendor-risk-assessment'],
    primaryTools: ['privacy-policy-generator', 'service-provider-manager'],
    priorityLevel: 'high'
  },
  {
    personaId: 'compliance_manager',
    personaName: 'Compliance Manager',
    journeyPath: ['privacy-gap-analyzer', 'dpia-generator', 'privacy-rights-manager', 'consent-management', 'privacy-maintenance-scheduler'],
    primaryTools: ['privacy-gap-analyzer', 'dpia-generator', 'consent-management'],
    priorityLevel: 'high'
  }
];

// Helper Functions
export const getToolsByPhase = (phase: JourneyPhase): ToolJourneyMapping[] => {
  return TOOL_JOURNEY_MAPPINGS
    .filter(tool => tool.phase === phase)
    .sort((a, b) => {
      const positionOrder = { primary: 1, secondary: 2, tertiary: 3, quaternary: 4, emergency: 0 };
      return positionOrder[a.position] - positionOrder[b.position];
    });
};

export const getToolsByCriticality = (criticality: CriticalityLevel): ToolJourneyMapping[] => {
  return TOOL_JOURNEY_MAPPINGS.filter(tool => tool.criticality === criticality);
};

export const getToolsByPersona = (personaId: string): ToolJourneyMapping[] => {
  return TOOL_JOURNEY_MAPPINGS.filter(tool => tool.personas.includes(personaId));
};

export const getToolById = (toolId: string): ToolJourneyMapping | undefined => {
  return TOOL_JOURNEY_MAPPINGS.find(tool => tool.toolId === toolId);
};

export const getPersonaJourney = (personaId: string): PersonaJourney | undefined => {
  return PERSONA_JOURNEYS.find(journey => journey.personaId === personaId);
};

export const getRecommendedNextTool = (currentToolId: string, personaId?: string): ToolJourneyMapping | undefined => {
  const currentTool = getToolById(currentToolId);
  if (!currentTool) return undefined;

  // Get tools that have current tool as prerequisite
  const dependentTools = TOOL_JOURNEY_MAPPINGS.filter(
    tool => tool.prerequisites.includes(currentToolId)
  );

  if (dependentTools.length > 0) {
    // If persona specified, prioritize tools for that persona
    if (personaId) {
      const personaTools = dependentTools.filter(tool => tool.personas.includes(personaId));
      if (personaTools.length > 0) {
        return personaTools.sort((a, b) => 
          CRITICALITY_CONFIG[a.criticality].order - CRITICALITY_CONFIG[b.criticality].order
        )[0];
      }
    }
    return dependentTools.sort((a, b) => 
      CRITICALITY_CONFIG[a.criticality].order - CRITICALITY_CONFIG[b.criticality].order
    )[0];
  }

  // Otherwise, get next tool in the same phase
  const phaseTools = getToolsByPhase(currentTool.phase);
  const currentIndex = phaseTools.findIndex(t => t.toolId === currentToolId);
  if (currentIndex < phaseTools.length - 1) {
    return phaseTools[currentIndex + 1];
  }

  // Or first tool in next phase
  const phases = Object.values(JOURNEY_PHASES).sort((a, b) => a.order - b.order);
  const currentPhaseIndex = phases.findIndex(p => p.id === currentTool.phase);
  if (currentPhaseIndex < phases.length - 1) {
    const nextPhase = phases[currentPhaseIndex + 1];
    const nextPhaseTools = getToolsByPhase(nextPhase.id);
    return nextPhaseTools[0];
  }

  return undefined;
};

export const getJourneyProgress = (completedToolIds: string[]): {
  phaseProgress: Record<JourneyPhase, { total: number; completed: number; percentage: number }>;
  overallProgress: number;
  nextRecommendedTools: ToolJourneyMapping[];
} => {
  const phases = Object.keys(JOURNEY_PHASES) as JourneyPhase[];
  
  const phaseProgress = phases.reduce((acc, phase) => {
    const phaseTools = getToolsByPhase(phase);
    const completed = phaseTools.filter(tool => completedToolIds.includes(tool.toolId)).length;
    acc[phase] = {
      total: phaseTools.length,
      completed,
      percentage: phaseTools.length > 0 ? Math.round((completed / phaseTools.length) * 100) : 0
    };
    return acc;
  }, {} as Record<JourneyPhase, { total: number; completed: number; percentage: number }>);

  const totalTools = TOOL_JOURNEY_MAPPINGS.length;
  const totalCompleted = completedToolIds.filter(id => 
    TOOL_JOURNEY_MAPPINGS.some(tool => tool.toolId === id)
  ).length;
  const overallProgress = Math.round((totalCompleted / totalTools) * 100);

  // Get next recommended tools (not completed, sorted by criticality)
  const nextRecommendedTools = TOOL_JOURNEY_MAPPINGS
    .filter(tool => !completedToolIds.includes(tool.toolId))
    .filter(tool => {
      // Check if prerequisites are met
      return tool.prerequisites.every(prereq => completedToolIds.includes(prereq));
    })
    .sort((a, b) => {
      // Sort by phase order first, then criticality
      const phaseOrderA = JOURNEY_PHASES[a.phase].order;
      const phaseOrderB = JOURNEY_PHASES[b.phase].order;
      if (phaseOrderA !== phaseOrderB) return phaseOrderA - phaseOrderB;
      return CRITICALITY_CONFIG[a.criticality].order - CRITICALITY_CONFIG[b.criticality].order;
    })
    .slice(0, 3);

  return { phaseProgress, overallProgress, nextRecommendedTools };
};

// Summary Statistics
export const getJourneyStats = () => {
  const criticalTools = getToolsByCriticality('critical').length;
  const highTools = getToolsByCriticality('high').length;
  const mediumTools = getToolsByCriticality('medium').length;
  const lowTools = getToolsByCriticality('low').length;

  const phases = Object.keys(JOURNEY_PHASES) as JourneyPhase[];
  const phaseStats = phases.map(phase => ({
    phase: JOURNEY_PHASES[phase],
    toolCount: getToolsByPhase(phase).length
  }));

  return {
    totalTools: TOOL_JOURNEY_MAPPINGS.length,
    byCriticality: { critical: criticalTools, high: highTools, medium: mediumTools, low: lowTools },
    byPhase: phaseStats
  };
};

