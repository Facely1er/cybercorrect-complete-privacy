/**
 * Role Recommendation Engine
 * Analyzes assessment results to recommend the most suitable role-based compliance journey
 */

export interface SectionScore {
  title: string;
  percentage: number;
  completed: boolean;
}

export interface AssessmentData {
  overallScore: number;
  sectionScores: SectionScore[];
  assessmentType?: string;
  frameworkName?: string;
  completedDate?: string;
}

export interface RoleRecommendation {
  roleId: string;
  roleName: string;
  roleTitle: string;
  path: string;
  matchScore: number;
  matchPercentage: number;
  reasoning: string[];
  priorityAreas: string[];
  description: string;
  icon: string;
}

interface RoleProfile {
  roleId: string;
  roleName: string;
  roleTitle: string;
  path: string;
  description: string;
  icon: string;
  // Weight multipliers for each assessment section (0-1)
  sectionWeights: {
    Govern: number;
    Identify: number;
    Control: number;
    Communicate: number;
    Protect: number;
  };
  // Score thresholds that make this role more relevant
  scoreIndicators: {
    lowScoresSections: string[]; // If these are low, role is more relevant
    highScoresSections: string[]; // If these are high, role is more relevant
  };
  // Key responsibilities that map to assessment gaps
  keyResponsibilities: string[];
}

const roleProfiles: RoleProfile[] = [
  {
    roleId: 'data-protection-officer',
    roleName: 'Data Protection Officer',
    roleTitle: 'DPO Journey',
    path: '/roles/data-protection-officer',
    description: 'Strategic oversight of privacy program, regulatory compliance, and organizational accountability',
    icon: 'Shield',
    sectionWeights: {
      Govern: 1.0,      // DPO heavily focuses on governance
      Identify: 0.9,    // Risk identification is key
      Control: 0.7,     // Oversees controls
      Communicate: 0.8, // Manages communication with authorities
      Protect: 0.6      // Oversees but doesn't implement directly
    },
    scoreIndicators: {
      lowScoresSections: ['Govern', 'Identify'], // If governance/risk are low, DPO is critical
      highScoresSections: []
    },
    keyResponsibilities: [
      'Privacy governance structure',
      'Risk management strategy',
      'Regulatory compliance monitoring',
      'DPIA oversight',
      'Authority liaison'
    ]
  },
  {
    roleId: 'legal-counsel',
    roleName: 'Legal Counsel',
    roleTitle: 'Legal Journey',
    path: '/roles/legal-counsel',
    description: 'Legal compliance, contractual requirements, and regulatory interpretation',
    icon: 'Scale',
    sectionWeights: {
      Govern: 0.8,      // Policy interpretation
      Identify: 0.7,    // Legal basis identification
      Control: 0.6,     // Contract controls
      Communicate: 0.9, // Privacy notices, consent language
      Protect: 0.5      // Legal aspects of protection
    },
    scoreIndicators: {
      lowScoresSections: ['Communicate', 'Govern'], // Legal needs for notices/policies
      highScoresSections: []
    },
    keyResponsibilities: [
      'Legal basis documentation',
      'Privacy policy drafting',
      'Contract review',
      'Consent management',
      'Regulatory interpretation'
    ]
  },
  {
    roleId: 'data-steward',
    roleName: 'Data Steward',
    roleTitle: 'Data Steward Journey',
    path: '/roles/data-steward',
    description: 'Data quality, classification, lifecycle management, and operational controls',
    icon: 'Database',
    sectionWeights: {
      Govern: 0.5,      // Some governance aspects
      Identify: 1.0,    // Data inventory is core
      Control: 1.0,     // Data processing controls
      Communicate: 0.4, // Less focus on external communication
      Protect: 0.9      // Technical data protection
    },
    scoreIndicators: {
      lowScoresSections: ['Identify', 'Control', 'Protect'], // Data management gaps
      highScoresSections: []
    },
    keyResponsibilities: [
      'Data inventory management',
      'Data classification',
      'Data flow mapping',
      'Retention management',
      'Data quality controls'
    ]
  },
  {
    roleId: 'privacy-officer',
    roleName: 'Privacy Officer',
    roleTitle: 'Privacy Officer Journey',
    path: '/roles/privacy-officer',
    description: 'Day-to-day privacy operations, training, and individual rights management',
    icon: 'UserCheck',
    sectionWeights: {
      Govern: 0.7,      // Policy implementation
      Identify: 0.6,    // Understanding data processing
      Control: 0.8,     // Operational controls
      Communicate: 1.0, // Individual rights, training
      Protect: 0.8      // Operational protection
    },
    scoreIndicators: {
      lowScoresSections: ['Communicate', 'Control'], // Operational gaps
      highScoresSections: []
    },
    keyResponsibilities: [
      'Privacy rights management',
      'Training coordination',
      'Incident response',
      'Day-to-day compliance',
      'Staff awareness'
    ]
  }
];

/**
 * Calculate match score for a role based on assessment results
 */
function calculateRoleMatchScore(
  assessmentData: AssessmentData,
  roleProfile: RoleProfile
): { score: number; reasoning: string[]; priorityAreas: string[] } {
  const reasoning: string[] = [];
  const priorityAreas: string[] = [];
  let totalWeight = 0;
  let weightedScore = 0;

  // Get section scores as a map
  const sectionScoreMap: Record<string, number> = {};
  assessmentData.sectionScores.forEach(section => {
    sectionScoreMap[section.title] = section.percentage;
  });

  // Calculate weighted relevance score
  Object.entries(roleProfile.sectionWeights).forEach(([section, weight]) => {
    const sectionScore = sectionScoreMap[section] || 50;
    
    // Invert the score - lower assessment scores mean higher relevance for improvement
    const improvementNeed = 100 - sectionScore;
    
    // Weight the improvement need by role's focus on that section
    const weightedNeed = improvementNeed * weight;
    weightedScore += weightedNeed;
    totalWeight += weight * 100;

    // Track priority areas (sections with low scores that role focuses on)
    if (sectionScore < 70 && weight >= 0.7) {
      priorityAreas.push(section);
      reasoning.push(`${section} needs improvement (${sectionScore}%) - key focus area for ${roleProfile.roleName}`);
    }
  });

  // Normalize score to 0-100
  const normalizedScore = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 50;

  // Bonus points for matching low score indicators
  let bonusScore = 0;
  roleProfile.scoreIndicators.lowScoresSections.forEach(section => {
    const sectionScore = sectionScoreMap[section] || 50;
    if (sectionScore < 65) {
      bonusScore += 10;
      if (!reasoning.some(r => r.includes(section))) {
        reasoning.push(`Critical gap in ${section} (${sectionScore}%) aligns with ${roleProfile.roleName} responsibilities`);
      }
    }
  });

  // Overall score consideration
  if (assessmentData.overallScore < 60) {
    reasoning.push(`Overall score of ${assessmentData.overallScore}% indicates need for comprehensive ${roleProfile.roleName} guidance`);
  }

  return {
    score: Math.min(100, normalizedScore + bonusScore),
    reasoning: reasoning.length > 0 ? reasoning : [`${roleProfile.roleName} journey provides structured guidance for your compliance needs`],
    priorityAreas
  };
}

/**
 * Generate role recommendations based on assessment data
 * Returns all roles sorted by match score, with the top recommendation highlighted
 */
export function generateRoleRecommendations(assessmentData: AssessmentData): RoleRecommendation[] {
  const recommendations: RoleRecommendation[] = roleProfiles.map(profile => {
    const { score, reasoning, priorityAreas } = calculateRoleMatchScore(assessmentData, profile);
    
    return {
      roleId: profile.roleId,
      roleName: profile.roleName,
      roleTitle: profile.roleTitle,
      path: profile.path,
      matchScore: score,
      matchPercentage: Math.round(score),
      reasoning,
      priorityAreas,
      description: profile.description,
      icon: profile.icon
    };
  });

  // Sort by match score (highest first)
  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Get the top recommended role for quick access
 */
export function getTopRecommendedRole(assessmentData: AssessmentData): RoleRecommendation {
  const recommendations = generateRoleRecommendations(assessmentData);
  return recommendations[0];
}

/**
 * Get journey customization data based on assessment results
 * This can be passed to role journey pages for personalized content
 */
export function getJourneyCustomization(assessmentData: AssessmentData) {
  const topRole = getTopRecommendedRole(assessmentData);
  
  // Identify weak areas that need focus
  const weakAreas = assessmentData.sectionScores
    .filter(s => s.percentage < 65)
    .sort((a, b) => a.percentage - b.percentage)
    .map(s => s.title);

  // Identify strong areas
  const strongAreas = assessmentData.sectionScores
    .filter(s => s.percentage >= 80)
    .map(s => s.title);

  return {
    recommendedRole: topRole,
    overallScore: assessmentData.overallScore,
    weakAreas,
    strongAreas,
    priorityLevel: assessmentData.overallScore < 50 ? 'critical' : 
                   assessmentData.overallScore < 70 ? 'high' : 
                   assessmentData.overallScore < 85 ? 'moderate' : 'maintenance',
    customSteps: generateCustomSteps(assessmentData, topRole)
  };
}

/**
 * Generate customized journey steps based on assessment gaps
 */
function generateCustomSteps(assessmentData: AssessmentData, topRole: RoleRecommendation) {
  const steps: { phase: string; focus: string; priority: 'high' | 'medium' | 'low' }[] = [];
  
  assessmentData.sectionScores.forEach(section => {
    let priority: 'high' | 'medium' | 'low' = 'low';
    if (section.percentage < 50) priority = 'high';
    else if (section.percentage < 70) priority = 'medium';
    
    if (priority !== 'low') {
      steps.push({
        phase: section.title,
        focus: `Improve ${section.title} from ${section.percentage}% to target 80%`,
        priority
      });
    }
  });

  return steps.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

