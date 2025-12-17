/**
 * Gap-Based Journey Configuration
 * 
 * This defines the journey based on compliance gaps identified in the assessment,
 * rather than predefined role-based paths. More universally applicable and actionable.
 */

import {
  Shield,
  Eye,
  Lock,
  Users,
  Settings,
  type LucideIcon
} from 'lucide-react';

export type GapDomain = 'govern' | 'identify' | 'control' | 'communicate' | 'protect';
export type GapSeverity = 'critical' | 'high' | 'moderate' | 'low';
export type GapStatus = 'not_started' | 'in_progress' | 'completed';

export interface GapDefinition {
  id: string;
  domain: GapDomain;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface IdentifiedGap {
  id: string;
  domain: GapDomain;
  domainTitle: string;
  score: number; // 0-100
  severity: GapSeverity;
  priority: number; // 1 = highest priority
  timeline: string; // "Immediate", "30 days", "90 days"
  estimatedEffort: string; // "2-4 weeks"
  impact: string; // "High risk reduction"
  recommendedTools: string[]; // Tool IDs
  description: string;
  status: GapStatus;
}

export interface GapJourneyProgress {
  totalGaps: number;
  completedGaps: number;
  inProgressGaps: number;
  criticalGapsRemaining: number;
  overallCompletionPercentage: number;
  nextRecommendedGap: IdentifiedGap | null;
}

// NIST Privacy Framework Domains
export const GAP_DOMAINS: Record<GapDomain, GapDefinition> = {
  govern: {
    id: 'govern',
    domain: 'govern',
    title: 'Govern',
    description: 'Privacy governance, risk management, and policies',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  identify: {
    id: 'identify',
    domain: 'identify',
    title: 'Identify',
    description: 'Data inventory and privacy risk identification',
    icon: Eye,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  control: {
    id: 'control',
    domain: 'control',
    title: 'Control',
    description: 'Data processing controls and management',
    icon: Settings,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  communicate: {
    id: 'communicate',
    domain: 'communicate',
    title: 'Communicate',
    description: 'Stakeholder and data subject communication',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800'
  },
  protect: {
    id: 'protect',
    domain: 'protect',
    title: 'Protect',
    description: 'Technical and organizational safeguards',
    icon: Lock,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800'
  }
};

// Severity configuration
export const GAP_SEVERITY_CONFIG: Record<GapSeverity, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  timeline: string;
}> = {
  critical: {
    label: 'Critical',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    borderColor: 'border-red-300 dark:border-red-700',
    icon: '🔴',
    timeline: 'Immediate'
  },
  high: {
    label: 'High',
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    borderColor: 'border-orange-300 dark:border-orange-700',
    icon: '🟠',
    timeline: 'Within 30 days'
  },
  moderate: {
    label: 'Moderate',
    color: 'text-yellow-700 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-300 dark:border-yellow-700',
    icon: '🟡',
    timeline: 'Within 90 days'
  },
  low: {
    label: 'Low',
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    borderColor: 'border-green-300 dark:border-green-700',
    icon: '🟢',
    timeline: 'Ongoing maintenance'
  }
};

// Tool mappings by domain
export const DOMAIN_TOOL_MAPPINGS: Record<GapDomain, {
  toolId: string;
  toolName: string;
  toolPath: string;
  solvesGap: string;
  estimatedTime: string;
}[]> = {
  govern: [
    {
      toolId: 'privacy-gap-analyzer',
      toolName: 'Privacy Gap Analyzer',
      toolPath: '/toolkit/privacy-gap-analyzer',
      solvesGap: 'Identifies governance gaps and creates action plan',
      estimatedTime: '30 min'
    },
    {
      toolId: 'privacy-policy-generator',
      toolName: 'Privacy Policy Generator',
      toolPath: '/toolkit/privacy-policy-generator',
      solvesGap: 'Creates compliant privacy policies',
      estimatedTime: '15 min'
    }
  ],
  identify: [
    {
      toolId: 'gdpr-mapper',
      toolName: 'GDPR Data Mapper',
      toolPath: '/toolkit/gdpr-mapper',
      solvesGap: 'Creates Article 30 processing records',
      estimatedTime: '25 min'
    },
    {
      toolId: 'pii-data-flow-mapper',
      toolName: 'PII Data Flow Mapper',
      toolPath: '/toolkit/pii-data-flow-mapper',
      solvesGap: 'Maps data flows and transfers',
      estimatedTime: '30 min'
    },
    {
      toolId: 'vendor-risk-assessment',
      toolName: 'Vendor Risk Assessment',
      toolPath: '/toolkit/vendor-risk-assessment',
      solvesGap: 'Assesses third-party privacy risks',
      estimatedTime: '25 min'
    }
  ],
  control: [
    {
      toolId: 'consent-management',
      toolName: 'Consent Management',
      toolPath: '/toolkit/consent-management',
      solvesGap: 'Tracks consent and preferences',
      estimatedTime: '20 min'
    },
    {
      toolId: 'privacy-rights-manager',
      toolName: 'Privacy Rights Manager',
      toolPath: '/toolkit/privacy-rights-manager',
      solvesGap: 'Manages DSAR requests',
      estimatedTime: '30 min'
    },
    {
      toolId: 'retention-policy-generator',
      toolName: 'Retention Policy Generator',
      toolPath: '/toolkit/retention-policy-generator',
      solvesGap: 'Creates data retention schedules',
      estimatedTime: '20 min'
    }
  ],
  communicate: [
    {
      toolId: 'privacy-policy-generator',
      toolName: 'Privacy Notice Generator',
      toolPath: '/toolkit/privacy-policy-generator',
      solvesGap: 'Creates transparent privacy notices',
      estimatedTime: '15 min'
    },
    {
      toolId: 'dpia-generator',
      toolName: 'DPIA Generator',
      toolPath: '/toolkit/dpia-generator',
      solvesGap: 'Documents impact assessments',
      estimatedTime: '20 min'
    }
  ],
  protect: [
    {
      toolId: 'privacy-settings-audit',
      toolName: 'Privacy Settings Audit',
      toolPath: '/toolkit/privacy-settings-audit',
      solvesGap: 'Reviews system privacy configurations',
      estimatedTime: '30 min'
    },
    {
      toolId: 'privacy-by-design-assessment',
      toolName: 'Privacy by Design Assessment',
      toolPath: '/toolkit/privacy-by-design-assessment',
      solvesGap: 'Evaluates privacy in system design',
      estimatedTime: '30 min'
    },
    {
      toolId: 'incident-response-manager',
      toolName: 'Incident Response Manager',
      toolPath: '/toolkit/incident-response-manager',
      solvesGap: 'Manages breach response',
      estimatedTime: '25 min'
    }
  ]
};

/**
 * Calculate severity based on assessment score
 */
export function calculateGapSeverity(score: number): GapSeverity {
  if (score < 60) return 'critical';
  if (score < 70) return 'high';
  if (score < 80) return 'moderate';
  return 'low';
}

/**
 * Generate identified gaps from assessment results
 */
export function generateGapsFromAssessment(assessmentResults: {
  sectionScores: Array<{ title: string; percentage: number; completed: boolean }>;
}): IdentifiedGap[] {
  const gaps: IdentifiedGap[] = [];
  let priority = 1;

  // Sort sections by score (lowest first = highest priority)
  const sortedSections = [...assessmentResults.sectionScores].sort(
    (a, b) => a.percentage - b.percentage
  );

  sortedSections.forEach((section) => {
    const domainKey = section.title.toLowerCase() as GapDomain;
    const domain = GAP_DOMAINS[domainKey];
    
    if (!domain) return;

    const severity = calculateGapSeverity(section.percentage);
    const severityConfig = GAP_SEVERITY_CONFIG[severity];
    const tools = DOMAIN_TOOL_MAPPINGS[domainKey] || [];

    // Only create gaps for areas below 80%
    if (section.percentage < 80) {
      gaps.push({
        id: `gap-${domainKey}`,
        domain: domainKey,
        domainTitle: section.title,
        score: section.percentage,
        severity,
        priority: priority++,
        timeline: severityConfig.timeline,
        estimatedEffort: severity === 'critical' ? '2-4 weeks' : severity === 'high' ? '4-6 weeks' : '6-8 weeks',
        impact: severity === 'critical' ? 'High risk reduction' : severity === 'high' ? 'Medium risk reduction' : 'Low risk reduction',
        recommendedTools: tools.map(t => t.toolId),
        description: `${domain.description} - Current score: ${section.percentage}%`,
        status: 'not_started'
      });
    }
  });

  return gaps;
}

/**
 * Calculate journey progress based on completed gaps
 */
export function calculateGapJourneyProgress(
  identifiedGaps: IdentifiedGap[],
  completedGapIds: string[]
): GapJourneyProgress {
  const totalGaps = identifiedGaps.length;
  const completedGaps = identifiedGaps.filter(gap => 
    completedGapIds.includes(gap.id)
  ).length;
  
  const inProgressGaps = identifiedGaps.filter(gap => 
    gap.status === 'in_progress'
  ).length;

  const criticalGapsRemaining = identifiedGaps.filter(gap => 
    gap.severity === 'critical' && !completedGapIds.includes(gap.id)
  ).length;

  const overallCompletionPercentage = totalGaps > 0 
    ? Math.round((completedGaps / totalGaps) * 100) 
    : 0;

  // Next recommended gap is the highest priority incomplete gap
  const nextRecommendedGap = identifiedGaps
    .filter(gap => !completedGapIds.includes(gap.id))
    .sort((a, b) => a.priority - b.priority)[0] || null;

  return {
    totalGaps,
    completedGaps,
    inProgressGaps,
    criticalGapsRemaining,
    overallCompletionPercentage,
    nextRecommendedGap
  };
}

/**
 * Get tools for a specific gap
 */
export function getToolsForGap(gapDomain: GapDomain) {
  return DOMAIN_TOOL_MAPPINGS[gapDomain] || [];
}

/**
 * Mark gap as started/completed
 */
export function updateGapStatus(
  gaps: IdentifiedGap[],
  gapId: string,
  status: GapStatus
): IdentifiedGap[] {
  return gaps.map(gap => 
    gap.id === gapId ? { ...gap, status } : gap
  );
}

/**
 * Get the domain that a tool belongs to
 */
export function getToolDomain(toolId: string): GapDomain | null {
  for (const [domain, tools] of Object.entries(DOMAIN_TOOL_MAPPINGS)) {
    if (tools.some(t => t.toolId === toolId)) {
      return domain as GapDomain;
    }
  }
  return null;
}

/**
 * Get all tool IDs for a specific domain
 */
export function getToolIdsForDomain(domain: GapDomain): string[] {
  return DOMAIN_TOOL_MAPPINGS[domain]?.map(t => t.toolId) || [];
}

/**
 * Calculate gap completion percentage based on completed tools
 */
export function calculateGapCompletionFromTools(
  domain: GapDomain,
  completedToolIds: string[]
): number {
  const domainTools = getToolIdsForDomain(domain);
  if (domainTools.length === 0) return 0;
  
  const completedCount = domainTools.filter(toolId => 
    completedToolIds.includes(toolId)
  ).length;
  
  return Math.round((completedCount / domainTools.length) * 100);
}

/**
 * Check if a gap should be marked as completed based on tool usage
 * Requires at least 50% of domain tools to be completed
 */
export function shouldMarkGapCompleted(
  domain: GapDomain,
  completedToolIds: string[]
): boolean {
  const completionPercentage = calculateGapCompletionFromTools(domain, completedToolIds);
  return completionPercentage >= 50;
}

/**
 * Get recommended next tool for a gap based on what's already completed
 */
export function getNextRecommendedTool(
  domain: GapDomain,
  completedToolIds: string[]
): { toolId: string; toolName: string; toolPath: string } | null {
  const domainTools = DOMAIN_TOOL_MAPPINGS[domain] || [];
  const nextTool = domainTools.find(tool => !completedToolIds.includes(tool.toolId));
  return nextTool ? { 
    toolId: nextTool.toolId, 
    toolName: nextTool.toolName, 
    toolPath: nextTool.toolPath 
  } : null;
}

