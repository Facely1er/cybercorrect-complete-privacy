/**
 * Organizational Recommendation Engine
 * Analyzes assessment results to recommend team structure and resource allocation
 */

import { AssessmentData, RoleRecommendation } from './roleRecommendation';

export type OrganizationSize = 'small' | 'medium' | 'large' | 'enterprise';
export type RolePriority = 'critical' | 'recommended' | 'optional';

export interface TeamMember {
  roleId: string;
  roleName: string;
  roleTitle: string;
  path: string;
  matchScore: number;
  priority: RolePriority;
  fte: string; // e.g., "1.0", "0.5-1.0", "0.25"
  timeframe: string; // e.g., "Immediate", "Within 3 months"
  reasoning: string[];
  canBeCombinedWith?: string[];
}

export interface FunctionalTask {
  taskName: string;
  description: string;
  primaryOwner: string; // Role name
  contributors: string[]; // Other role names
  requiredForGaps: boolean;
  priority: 'high' | 'medium' | 'low';
  relatedSections: string[]; // Assessment sections
}

export interface OrganizationalRecommendation {
  organizationSize: OrganizationSize;
  criticalRoles: TeamMember[];
  recommendedRoles: TeamMember[];
  optionalRoles: TeamMember[];
  minimalTeam: TeamMember[];
  optimalTeam: TeamMember[];
  functionalTasks: FunctionalTask[];
  resourceEstimates: {
    minimumHeadcount: number;
    optimalHeadcount: number;
    estimatedBudgetRange: string;
    skillGapsToAddress: string[];
    hiringPriority: string[];
  };
  teamStructureGuidance: {
    smallOrg: string;
    mediumOrg: string;
    largeOrg: string;
  };
}

/**
 * Determine organization size based on context or user input
 * Default to medium if not specified
 */
export function determineOrganizationSize(
  context?: { employees?: number; dataVolume?: string; complexity?: string }
): OrganizationSize {
  if (!context?.employees) return 'medium';
  
  if (context.employees < 50) return 'small';
  if (context.employees < 500) return 'medium';
  if (context.employees < 5000) return 'large';
  return 'enterprise';
}

/**
 * Generate organizational team recommendations based on assessment
 */
export function generateOrganizationalRecommendations(
  assessmentData: AssessmentData,
  organizationSize: OrganizationSize = 'medium'
): OrganizationalRecommendation {
  const allRoles = analyzeRoleNeeds(assessmentData);
  
  // Categorize roles by priority
  const criticalRoles = allRoles.filter(r => r.priority === 'critical');
  const recommendedRoles = allRoles.filter(r => r.priority === 'recommended');
  const optionalRoles = allRoles.filter(r => r.priority === 'optional');
  
  // Build minimal and optimal teams based on org size
  const { minimalTeam, optimalTeam } = buildTeamStructure(
    allRoles,
    organizationSize,
    assessmentData.overallScore
  );
  
  // Generate functional task assignments
  const functionalTasks = generateFunctionalTasks(assessmentData, allRoles);
  
  // Calculate resource estimates
  const resourceEstimates = calculateResourceEstimates(
    minimalTeam,
    optimalTeam,
    assessmentData
  );
  
  // Generate team structure guidance
  const teamStructureGuidance = generateTeamStructureGuidance(assessmentData);
  
  return {
    organizationSize,
    criticalRoles,
    recommendedRoles,
    optionalRoles,
    minimalTeam,
    optimalTeam,
    functionalTasks,
    resourceEstimates,
    teamStructureGuidance
  };
}

/**
 * Analyze which roles are needed and their priority
 */
function analyzeRoleNeeds(assessmentData: AssessmentData): TeamMember[] {
  const teamMembers: TeamMember[] = [];
  const sectionScores = assessmentData.sectionScores.reduce((acc, s) => {
    acc[s.title] = s.percentage;
    return acc;
  }, {} as Record<string, number>);
  
  // Data Protection Officer - Critical if governance/risk gaps exist
  const governScore = sectionScores['Govern'] || 50;
  const identifyScore = sectionScores['Identify'] || 50;
  const dpoPriority: RolePriority = 
    (governScore < 65 || identifyScore < 65) ? 'critical' :
    (governScore < 75 || identifyScore < 75) ? 'recommended' : 'optional';
    
  teamMembers.push({
    roleId: 'data-protection-officer',
    roleName: 'Data Protection Officer',
    roleTitle: 'DPO',
    path: '/roles/data-protection-officer',
    matchScore: calculateDPOMatch(assessmentData),
    priority: dpoPriority,
    fte: dpoPriority === 'critical' ? '1.0' : '0.5-1.0',
    timeframe: dpoPriority === 'critical' ? 'Immediate' : 'Within 3 months',
    reasoning: [
      `Governance at ${governScore}% ${governScore < 65 ? '(critical gap)' : ''}`,
      `Risk identification at ${identifyScore}% ${identifyScore < 65 ? '(critical gap)' : ''}`,
      'Oversees privacy program and regulatory compliance'
    ].filter(r => !r.includes('undefined')),
    canBeCombinedWith: dpoPriority !== 'critical' ? ['legal-counsel'] : undefined
  });
  
  // Legal Counsel - Important for policy and communication
  const communicateScore = sectionScores['Communicate'] || 50;
  const legalPriority: RolePriority =
    (communicateScore < 60 || governScore < 60) ? 'critical' :
    (communicateScore < 75) ? 'recommended' : 'optional';
    
  teamMembers.push({
    roleId: 'legal-counsel',
    roleName: 'Legal Counsel',
    roleTitle: 'Legal',
    path: '/roles/legal-counsel',
    matchScore: calculateLegalMatch(assessmentData),
    priority: legalPriority,
    fte: legalPriority === 'critical' ? '0.5-1.0' : '0.25-0.5',
    timeframe: legalPriority === 'critical' ? 'Within 1 month' : 'Within 6 months',
    reasoning: [
      `Communication/transparency at ${communicateScore}%`,
      'Privacy policies and legal compliance',
      legalPriority !== 'critical' ? 'Can be consultant/part-time initially' : undefined
    ].filter(r => r !== undefined) as string[],
    canBeCombinedWith: legalPriority !== 'critical' ? ['data-protection-officer'] : undefined
  });
  
  // Data Steward - Critical for data management
  const controlScore = sectionScores['Control'] || 50;
  const protectScore = sectionScores['Protect'] || 50;
  const stewardPriority: RolePriority =
    (identifyScore < 65 || controlScore < 65 || protectScore < 65) ? 'critical' :
    (identifyScore < 75 || controlScore < 75) ? 'recommended' : 'optional';
    
  teamMembers.push({
    roleId: 'data-steward',
    roleName: 'Data Steward',
    roleTitle: 'Data Steward',
    path: '/roles/data-steward',
    matchScore: calculateStewardMatch(assessmentData),
    priority: stewardPriority,
    fte: stewardPriority === 'critical' ? '1.0' : '0.5-1.0',
    timeframe: stewardPriority === 'critical' ? 'Within 1 month' : 'Within 3 months',
    reasoning: [
      `Data inventory/control at ${identifyScore}%/${controlScore}%`,
      `Data protection at ${protectScore}%`,
      'Essential for data mapping and lifecycle management'
    ]
  });
  
  // Privacy Officer - For day-to-day operations
  const privacyOfficerPriority: RolePriority =
    assessmentData.overallScore < 60 ? 'recommended' :
    assessmentData.overallScore < 75 ? 'optional' : 'optional';
    
  teamMembers.push({
    roleId: 'privacy-officer',
    roleName: 'Privacy Officer',
    roleTitle: 'Privacy Officer',
    path: '/roles/privacy-officer',
    matchScore: calculatePrivacyOfficerMatch(assessmentData),
    priority: privacyOfficerPriority,
    fte: '0.5-1.0',
    timeframe: 'Within 6 months',
    reasoning: [
      'Day-to-day privacy operations',
      'Training and awareness programs',
      'Individual rights management'
    ]
  });
  
  return teamMembers.sort((a, b) => {
    const priorityOrder = { critical: 0, recommended: 1, optional: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority] || b.matchScore - a.matchScore;
  });
}

/**
 * Build minimal and optimal team structures
 */
function buildTeamStructure(
  allRoles: TeamMember[],
  orgSize: OrganizationSize,
  overallScore: number
): { minimalTeam: TeamMember[]; optimalTeam: TeamMember[] } {
  const criticalRoles = allRoles.filter(r => r.priority === 'critical');
  const recommendedRoles = allRoles.filter(r => r.priority === 'recommended');
  
  let minimalTeam: TeamMember[];
  let optimalTeam: TeamMember[];
  
  if (orgSize === 'small') {
    // Small orgs: minimal team, roles can be combined
    minimalTeam = criticalRoles.slice(0, 2); // Top 2 critical roles
    optimalTeam = [...criticalRoles, ...recommendedRoles.slice(0, 1)];
  } else if (orgSize === 'medium') {
    // Medium orgs: all critical + some recommended
    minimalTeam = criticalRoles;
    optimalTeam = [...criticalRoles, ...recommendedRoles];
  } else {
    // Large/enterprise: full team with specialists
    minimalTeam = [...criticalRoles, ...recommendedRoles.slice(0, 1)];
    optimalTeam = allRoles;
  }
  
  // Adjust based on severity
  if (overallScore < 50) {
    // Critical situation: need more immediate help
    minimalTeam = allRoles.filter(r => r.priority !== 'optional');
  }
  
  return { minimalTeam, optimalTeam };
}

/**
 * Generate functional task assignments
 */
function generateFunctionalTasks(
  assessmentData: AssessmentData,
  teamMembers: TeamMember[]
): FunctionalTask[] {
  const tasks: FunctionalTask[] = [];
  const sectionScores = assessmentData.sectionScores.reduce((acc, s) => {
    acc[s.title] = s.percentage;
    return acc;
  }, {} as Record<string, number>);
  
  // DPIA Execution
  if (sectionScores['Identify'] < 70 || sectionScores['Govern'] < 70) {
    tasks.push({
      taskName: 'Data Protection Impact Assessments (DPIA)',
      description: 'Conduct DPIAs for high-risk processing activities',
      primaryOwner: 'Data Protection Officer',
      contributors: ['Legal Counsel', 'Data Steward'],
      requiredForGaps: true,
      priority: sectionScores['Identify'] < 60 ? 'high' : 'medium',
      relatedSections: ['Identify', 'Govern']
    });
  }
  
  // Data Inventory & Mapping
  if (sectionScores['Identify'] < 70) {
    tasks.push({
      taskName: 'Data Inventory & Mapping',
      description: 'Create comprehensive data inventory and flow diagrams',
      primaryOwner: 'Data Steward',
      contributors: ['Data Protection Officer'],
      requiredForGaps: true,
      priority: 'high',
      relatedSections: ['Identify']
    });
  }
  
  // Privacy Policy Development
  if (sectionScores['Communicate'] < 70 || sectionScores['Govern'] < 70) {
    tasks.push({
      taskName: 'Privacy Policy Development',
      description: 'Draft and implement comprehensive privacy policies',
      primaryOwner: 'Legal Counsel',
      contributors: ['Data Protection Officer', 'Privacy Officer'],
      requiredForGaps: true,
      priority: sectionScores['Communicate'] < 60 ? 'high' : 'medium',
      relatedSections: ['Communicate', 'Govern']
    });
  }
  
  // Technical Controls Implementation
  if (sectionScores['Protect'] < 70 || sectionScores['Control'] < 70) {
    tasks.push({
      taskName: 'Technical Privacy Controls',
      description: 'Implement technical safeguards and access controls',
      primaryOwner: 'Data Steward',
      contributors: ['Data Protection Officer'],
      requiredForGaps: true,
      priority: sectionScores['Protect'] < 60 ? 'high' : 'medium',
      relatedSections: ['Protect', 'Control']
    });
  }
  
  // Training & Awareness
  tasks.push({
    taskName: 'Privacy Training & Awareness',
    description: 'Develop and deliver privacy training programs',
    primaryOwner: 'Privacy Officer',
    contributors: ['Data Protection Officer', 'Legal Counsel'],
    requiredForGaps: assessmentData.overallScore < 70,
    priority: assessmentData.overallScore < 60 ? 'high' : 'medium',
    relatedSections: ['Govern', 'Communicate']
  });
  
  // Vendor Management
  if (sectionScores['Control'] < 70) {
    tasks.push({
      taskName: 'Vendor & Third-Party Management',
      description: 'Assess and manage privacy risks from vendors',
      primaryOwner: 'Data Protection Officer',
      contributors: ['Legal Counsel', 'Data Steward'],
      requiredForGaps: true,
      priority: 'medium',
      relatedSections: ['Control', 'Govern']
    });
  }
  
  return tasks.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Calculate resource estimates
 */
function calculateResourceEstimates(
  minimalTeam: TeamMember[],
  optimalTeam: TeamMember[],
  assessmentData: AssessmentData
) {
  const minimumHeadcount = minimalTeam.reduce((sum, member) => {
    const fte = parseFloat(member.fte.split('-')[0]);
    return sum + fte;
  }, 0);
  
  const optimalHeadcount = optimalTeam.reduce((sum, member) => {
    const fte = parseFloat(member.fte.split('-').pop() || member.fte);
    return sum + fte;
  }, 0);
  
  // Rough budget estimates (can be customized based on region/industry)
  const avgSalaryPerFTE = 120000; // Example: $120k average
  const minBudget = Math.round(minimumHeadcount * avgSalaryPerFTE / 1000) * 1000;
  const maxBudget = Math.round(optimalHeadcount * avgSalaryPerFTE / 1000) * 1000;
  
  // Identify skill gaps
  const skillGaps: string[] = [];
  if (assessmentData.sectionScores.find(s => s.title === 'Govern' && s.percentage < 65)) {
    skillGaps.push('Privacy governance and policy expertise');
  }
  if (assessmentData.sectionScores.find(s => s.title === 'Identify' && s.percentage < 65)) {
    skillGaps.push('Data mapping and risk assessment');
  }
  if (assessmentData.sectionScores.find(s => s.title === 'Communicate' && s.percentage < 65)) {
    skillGaps.push('Privacy law and regulatory compliance');
  }
  if (assessmentData.sectionScores.find(s => s.title === 'Protect' && s.percentage < 65)) {
    skillGaps.push('Technical data protection and security');
  }
  
  // Hiring priority
  const hiringPriority = minimalTeam
    .filter(m => m.priority === 'critical')
    .map(m => `${m.roleName} (${m.timeframe})`);
  
  return {
    minimumHeadcount: Math.round(minimumHeadcount * 10) / 10,
    optimalHeadcount: Math.round(optimalHeadcount * 10) / 10,
    estimatedBudgetRange: `$${minBudget.toLocaleString()} - $${maxBudget.toLocaleString()}/year`,
    skillGapsToAddress: skillGaps,
    hiringPriority
  };
}

/**
 * Generate team structure guidance for different org sizes
 */
function generateTeamStructureGuidance(assessmentData: AssessmentData) {
  const overallScore = assessmentData.overallScore;
  
  return {
    smallOrg: overallScore < 60 
      ? 'DPO + Data Steward (DPO can initially handle legal duties; consider part-time legal counsel)'
      : 'DPO (can combine with privacy officer duties initially)',
    mediumOrg: overallScore < 60
      ? 'Full team: DPO + Legal Counsel + Data Steward + Privacy Officer for comprehensive coverage'
      : 'Core team: DPO + Data Steward + part-time Legal Counsel',
    largeOrg: 'Dedicated specialists in each role with clear separation of duties and potential sub-teams'
  };
}

// Helper functions for match score calculations
function calculateDPOMatch(data: AssessmentData): number {
  const govern = data.sectionScores.find(s => s.title === 'Govern')?.percentage || 50;
  const identify = data.sectionScores.find(s => s.title === 'Identify')?.percentage || 50;
  return Math.round(((100 - govern) + (100 - identify)) / 2);
}

function calculateLegalMatch(data: AssessmentData): number {
  const communicate = data.sectionScores.find(s => s.title === 'Communicate')?.percentage || 50;
  const govern = data.sectionScores.find(s => s.title === 'Govern')?.percentage || 50;
  return Math.round(((100 - communicate) * 0.6 + (100 - govern) * 0.4));
}

function calculateStewardMatch(data: AssessmentData): number {
  const identify = data.sectionScores.find(s => s.title === 'Identify')?.percentage || 50;
  const control = data.sectionScores.find(s => s.title === 'Control')?.percentage || 50;
  const protect = data.sectionScores.find(s => s.title === 'Protect')?.percentage || 50;
  return Math.round(((100 - identify) + (100 - control) + (100 - protect)) / 3);
}

function calculatePrivacyOfficerMatch(data: AssessmentData): number {
  const communicate = data.sectionScores.find(s => s.title === 'Communicate')?.percentage || 50;
  const control = data.sectionScores.find(s => s.title === 'Control')?.percentage || 50;
  return Math.round(((100 - communicate) + (100 - control)) / 2);
}

