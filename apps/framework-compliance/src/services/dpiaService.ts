/**
 * DPIA Service - Data Protection Impact Assessment
 * 
 * This service handles CRUD operations, GDPR Article 35 risk threshold calculations,
 * enhanced scoring algorithms, mitigation tracking, and export functionality.
 */

import { supabase, getCurrentUser } from '../lib/supabase';
import { errorMonitoring } from '../lib/errorMonitoring';
import { secureStorage } from '../utils/storage';
import { generateGdprMappingPdf } from '../utils/pdf';

export type DPIAStatus = 'draft' | 'in_progress' | 'review' | 'approved' | 'rejected';
export type DPIAPriority = 'low' | 'medium' | 'high' | 'critical';
export type DPIARiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type RiskLikelihood = 'low' | 'medium' | 'high';
export type RiskImpact = 'low' | 'medium' | 'high';

export interface DPIA {
  id?: string;
  title: string;
  description?: string;
  processingActivity: string;
  dataController: string;
  dataProcessor?: string;
  status: DPIAStatus;
  priority: DPIAPriority;
  riskLevel: DPIARiskLevel;
  createdDate: string; // ISO date string
  dueDate: string; // ISO date string
  lastUpdated?: string;
  assessor: string;
  reviewer?: string;
  dataSubjects: string[];
  dataTypes: string[];
  purposes: string[];
  legalBasis: string[];
  retentionPeriod?: string;
  dataSources: string[];
  recipients: string[];
  transfers?: {
    country: string;
    adequacy: boolean;
    safeguards: string[];
  }[];
  risks: {
    id?: string;
    type: string;
    description: string;
    likelihood: RiskLikelihood;
    impact: RiskImpact;
    mitigation: string;
    residualRisk: RiskLikelihood;
    status?: 'identified' | 'mitigated' | 'accepted';
  }[];
  measures: {
    technical: string[];
    organizational: string[];
    legal: string[];
  };
  consultation: {
    dpo: boolean;
    stakeholders: boolean;
    public: boolean;
    authorities: boolean;
  };
  approval: {
    dpo: boolean;
    management: boolean;
    legal: boolean;
    date?: string;
  };
  nextReview?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DPIAScore {
  overallScore: number; // 0-100
  riskScore: number; // 0-100
  mitigationScore: number; // 0-100
  complianceScore: number; // 0-100
  breakdown: {
    dataSensitivity: number;
    processingScale: number;
    automationLevel: number;
    profiling: number;
    specialCategories: number;
    transfers: number;
    mitigationEffectiveness: number;
  };
}

export interface Article35Assessment {
  isRequired: boolean;
  isHighRisk: boolean;
  riskFactors: string[];
  reasoning: string[];
  recommendedActions: string[];
}

/**
 * Determine if DPIA is required under GDPR Article 35
 */
export function assessArticle35Requirement(dpia: Partial<DPIA>): Article35Assessment {
  const riskFactors: string[] = [];
  const reasoning: string[] = [];
  const recommendedActions: string[] = [];
  let isRequired = false;
  let isHighRisk = false;

  // Article 35(3) - Mandatory DPIA scenarios
  const mandatoryScenarios = [
    {
      check: () => dpia.dataTypes?.some(type => 
        type.toLowerCase().includes('biometric') || 
        type.toLowerCase().includes('genetic') ||
        type.toLowerCase().includes('health') ||
        type.toLowerCase().includes('racial') ||
        type.toLowerCase().includes('political')
      ),
      factor: 'Special category data processing',
      reason: 'GDPR Article 35(3)(a): Processing special categories of personal data requires mandatory DPIA',
    },
    {
      check: () => dpia.dataTypes?.some(type => 
        type.toLowerCase().includes('criminal') || 
        type.toLowerCase().includes('conviction')
      ),
      factor: 'Criminal conviction data',
      reason: 'GDPR Article 35(3)(b): Processing data relating to criminal convictions requires mandatory DPIA',
    },
    {
      check: () => {
        // Systematic and extensive evaluation including profiling
        const hasProfiling = dpia.purposes?.some(p => 
          p.toLowerCase().includes('profiling') || 
          p.toLowerCase().includes('evaluation') ||
          p.toLowerCase().includes('scoring')
        );
        const hasAutomation = dpia.dataTypes?.some(type => 
          type.toLowerCase().includes('automated') || 
          type.toLowerCase().includes('algorithm')
        );
        return hasProfiling || hasAutomation;
      },
      factor: 'Systematic monitoring or profiling',
      reason: 'GDPR Article 35(3)(c): Systematic and extensive evaluation including profiling requires mandatory DPIA',
    },
    {
      check: () => {
        // Large-scale processing of special categories
        const hasSpecialData = dpia.dataTypes?.some(type => 
          type.toLowerCase().includes('biometric') || 
          type.toLowerCase().includes('genetic') ||
          type.toLowerCase().includes('health')
        );
        const hasLargeScale = dpia.dataSubjects && dpia.dataSubjects.length > 1000;
        return hasSpecialData && hasLargeScale;
      },
      factor: 'Large-scale special category data',
      reason: 'GDPR Article 35(3)(d): Large-scale processing of special categories requires mandatory DPIA',
    },
  ];

  for (const scenario of mandatoryScenarios) {
    if (scenario.check()) {
      isRequired = true;
      isHighRisk = true;
      riskFactors.push(scenario.factor);
      reasoning.push(scenario.reason);
    }
  }

  // Article 35(1) - High-risk processing assessment
  if (!isRequired) {
    // Check for high-risk indicators
    const highRiskIndicators = [
      {
        check: () => dpia.transfers && dpia.transfers.some(t => !t.adequacy && (!t.safeguards || t.safeguards.length === 0)),
        factor: 'International transfers without adequate safeguards',
        reason: 'Transfers to third countries without adequacy decisions or safeguards pose high risk',
      },
      {
        check: () => dpia.dataSubjects && dpia.dataSubjects.some(s => 
          s.toLowerCase().includes('child') || 
          s.toLowerCase().includes('vulnerable')
        ),
        factor: 'Processing data of vulnerable individuals',
        reason: 'Processing data of children or vulnerable individuals requires careful assessment',
      },
      {
        check: () => dpia.recipients && dpia.recipients.length > 5,
        factor: 'Multiple data recipients',
        reason: 'Sharing data with multiple recipients increases complexity and risk',
      },
      {
        check: () => dpia.risks && dpia.risks.some(r => r.likelihood === 'high' && r.impact === 'high'),
        factor: 'High likelihood and high impact risks identified',
        reason: 'Identified risks with both high likelihood and high impact indicate high-risk processing',
      },
    ];

    for (const indicator of highRiskIndicators) {
      if (indicator.check()) {
        isRequired = true;
        isHighRisk = true;
        riskFactors.push(indicator.factor);
        reasoning.push(indicator.reason);
      }
    }
  }

  // Recommended actions
  if (isRequired) {
    recommendedActions.push('Conduct comprehensive DPIA assessment');
    recommendedActions.push('Document all identified risks and mitigation measures');
    recommendedActions.push('Consult with Data Protection Officer (DPO) if appointed');
  }

  if (isHighRisk) {
    recommendedActions.push('Prioritize implementation of technical and organizational measures');
    recommendedActions.push('Consider consulting supervisory authority before processing');
    recommendedActions.push('Establish regular review schedule for high-risk processing');
  }

  if (riskFactors.length === 0) {
    reasoning.push('No mandatory DPIA triggers identified. DPIA may still be recommended as best practice.');
    recommendedActions.push('Consider conducting DPIA as a best practice for transparency and compliance');
  }

  return {
    isRequired,
    isHighRisk,
    riskFactors,
    reasoning,
    recommendedActions,
  };
}

/**
 * Calculate comprehensive DPIA risk score
 */
export function calculateDpiAScore(dpia: DPIA): DPIAScore {
  let riskScore = 0;
  let mitigationScore = 0;
  let complianceScore = 0;

  // Data Sensitivity Score (0-20 points)
  const dataSensitivity = calculateDataSensitivityScore(dpia.dataTypes || []);
  
  // Processing Scale Score (0-15 points)
  const processingScale = calculateProcessingScaleScore(dpia.dataSubjects || [], dpia.recipients || []);
  
  // Automation Level Score (0-15 points)
  const automationLevel = calculateAutomationScore(dpia.purposes || [], dpia.dataTypes || []);
  
  // Profiling Score (0-15 points)
  const profiling = calculateProfilingScore(dpia.purposes || []);
  
  // Special Categories Score (0-20 points)
  const specialCategories = calculateSpecialCategoriesScore(dpia.dataTypes || []);
  
  // Transfers Score (0-15 points)
  const transfers = calculateTransfersScore(dpia.transfers || []);

  // Risk Score (sum of all risk factors, max 100)
  riskScore = dataSensitivity + processingScale + automationLevel + profiling + specialCategories + transfers;

  // Mitigation Effectiveness Score (0-100)
  mitigationScore = calculateMitigationScore(dpia.risks || [], dpia.measures || {});

  // Compliance Score (0-100)
  complianceScore = calculateComplianceScore(dpia);

  // Overall Score (weighted average)
  const overallScore = Math.round(
    (riskScore * 0.4) + // Risk contributes 40%
    (mitigationScore * 0.4) + // Mitigation contributes 40%
    (complianceScore * 0.2) // Compliance contributes 20%
  );

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    riskScore: Math.min(100, Math.max(0, riskScore)),
    mitigationScore: Math.min(100, Math.max(0, mitigationScore)),
    complianceScore: Math.min(100, Math.max(0, complianceScore)),
    breakdown: {
      dataSensitivity,
      processingScale,
      automationLevel,
      profiling,
      specialCategories,
      transfers,
      mitigationEffectiveness: mitigationScore,
    },
  };
}

/**
 * Calculate data sensitivity score
 */
function calculateDataSensitivityScore(dataTypes: string[]): number {
  let score = 0;
  const specialCategories = ['biometric', 'genetic', 'health', 'racial', 'ethnic', 'political', 'religious', 'philosophical', 'sexual', 'union'];
  const sensitive = ['financial', 'location', 'behavioral', 'preference', 'identity'];
  
  for (const type of dataTypes) {
    const lowerType = type.toLowerCase();
    if (specialCategories.some(cat => lowerType.includes(cat))) {
      score += 5; // Special category data is high risk
    } else if (sensitive.some(s => lowerType.includes(s))) {
      score += 2; // Sensitive but not special category
    } else {
      score += 0.5; // Standard personal data
    }
  }
  
  return Math.min(20, score);
}

/**
 * Calculate processing scale score
 */
function calculateProcessingScaleScore(dataSubjects: string[], recipients: string[]): number {
  let score = 0;
  
  // Number of data subjects
  if (dataSubjects.length > 10000) score += 8;
  else if (dataSubjects.length > 1000) score += 5;
  else if (dataSubjects.length > 100) score += 3;
  else if (dataSubjects.length > 10) score += 1;
  
  // Number of recipients
  if (recipients.length > 10) score += 7;
  else if (recipients.length > 5) score += 4;
  else if (recipients.length > 2) score += 2;
  
  return Math.min(15, score);
}

/**
 * Calculate automation level score
 */
function calculateAutomationScore(purposes: string[], dataTypes: string[]): number {
  let score = 0;
  const automationKeywords = ['automated', 'algorithm', 'ai', 'machine learning', 'artificial intelligence', 'decision', 'scoring'];
  
  for (const purpose of purposes) {
    const lowerPurpose = purpose.toLowerCase();
    if (automationKeywords.some(keyword => lowerPurpose.includes(keyword))) {
      score += 5;
    }
  }
  
  for (const type of dataTypes) {
    const lowerType = type.toLowerCase();
    if (automationKeywords.some(keyword => lowerType.includes(keyword))) {
      score += 3;
    }
  }
  
  return Math.min(15, score);
}

/**
 * Calculate profiling score
 */
function calculateProfilingScore(purposes: string[]): number {
  let score = 0;
  const profilingKeywords = ['profiling', 'evaluation', 'scoring', 'prediction', 'analysis', 'assessment'];
  
  for (const purpose of purposes) {
    const lowerPurpose = purpose.toLowerCase();
    if (profilingKeywords.some(keyword => lowerPurpose.includes(keyword))) {
      score += 5;
    }
  }
  
  return Math.min(15, score);
}

/**
 * Calculate special categories score
 */
function calculateSpecialCategoriesScore(dataTypes: string[]): number {
  let score = 0;
  const specialCategories = ['biometric', 'genetic', 'health', 'medical', 'racial', 'ethnic', 'political', 'religious', 'philosophical', 'sexual', 'union'];
  
  for (const type of dataTypes) {
    const lowerType = type.toLowerCase();
    if (specialCategories.some(cat => lowerType.includes(cat))) {
      score += 4; // Each special category adds significant risk
    }
  }
  
  return Math.min(20, score);
}

/**
 * Calculate transfers score
 */
function calculateTransfersScore(transfers: DPIA['transfers']): number {
  if (!transfers || transfers.length === 0) return 0;
  
  let score = 0;
  for (const transfer of transfers) {
    if (!transfer.adequacy) {
      score += 5; // No adequacy decision
      if (!transfer.safeguards || transfer.safeguards.length === 0) {
        score += 5; // No safeguards
      } else {
        score += 2; // Has safeguards but no adequacy
      }
    } else {
      score += 1; // Has adequacy decision (low risk)
    }
  }
  
  return Math.min(15, score);
}

/**
 * Calculate mitigation effectiveness score
 */
function calculateMitigationScore(risks: DPIA['risks'], measures: DPIA['measures']): number {
  if (risks.length === 0) return 100; // No risks = perfect mitigation
  
  let totalRiskReduction = 0;
  let totalRisks = risks.length;
  
  for (const risk of risks) {
    // Calculate risk reduction based on mitigation status
    const originalRisk = getRiskValue(risk.likelihood, risk.impact);
    const residualRisk = getRiskValue(risk.residualRisk, risk.impact);
    const riskReduction = originalRisk - residualRisk;
    totalRiskReduction += riskReduction;
  }
  
  // Calculate mitigation measures effectiveness
  const technicalMeasures = measures.technical?.length || 0;
  const organizationalMeasures = measures.organizational?.length || 0;
  const legalMeasures = measures.legal?.length || 0;
  const totalMeasures = technicalMeasures + organizationalMeasures + legalMeasures;
  
  // Base score from risk reduction
  const riskReductionScore = (totalRiskReduction / totalRisks) * 50;
  
  // Additional score from measures (max 50 points)
  const measuresScore = Math.min(50, totalMeasures * 5);
  
  return Math.min(100, riskReductionScore + measuresScore);
}

/**
 * Get numeric risk value
 */
function getRiskValue(likelihood: RiskLikelihood | RiskImpact, impact: RiskImpact): number {
  const likelihoodValue = likelihood === 'high' ? 3 : likelihood === 'medium' ? 2 : 1;
  const impactValue = impact === 'high' ? 3 : impact === 'medium' ? 2 : 1;
  return likelihoodValue * impactValue; // Max 9
}

/**
 * Calculate compliance score
 */
function calculateComplianceScore(dpia: DPIA): number {
  let score = 0;
  let maxScore = 0;
  
  // Legal basis documented (10 points)
  maxScore += 10;
  if (dpia.legalBasis && dpia.legalBasis.length > 0) {
    score += 10;
  }
  
  // Data subjects identified (10 points)
  maxScore += 10;
  if (dpia.dataSubjects && dpia.dataSubjects.length > 0) {
    score += 10;
  }
  
  // Data types documented (10 points)
  maxScore += 10;
  if (dpia.dataTypes && dpia.dataTypes.length > 0) {
    score += 10;
  }
  
  // Purposes documented (10 points)
  maxScore += 10;
  if (dpia.purposes && dpia.purposes.length > 0) {
    score += 10;
  }
  
  // Risks identified (20 points)
  maxScore += 20;
  if (dpia.risks && dpia.risks.length > 0) {
    score += 20;
  }
  
  // Mitigation measures (20 points)
  maxScore += 20;
  const totalMeasures = (dpia.measures?.technical?.length || 0) + 
                        (dpia.measures?.organizational?.length || 0) + 
                        (dpia.measures?.legal?.length || 0);
  if (totalMeasures > 0) {
    score += Math.min(20, totalMeasures * 5);
  }
  
  // Consultation completed (10 points)
  maxScore += 10;
  if (dpia.consultation) {
    const consultations = [
      dpia.consultation.dpo,
      dpia.consultation.stakeholders,
      dpia.consultation.public,
      dpia.consultation.authorities,
    ].filter(Boolean).length;
    score += Math.min(10, consultations * 2.5);
  }
  
  // Approval obtained (10 points)
  maxScore += 10;
  if (dpia.approval) {
    const approvals = [
      dpia.approval.dpo,
      dpia.approval.management,
      dpia.approval.legal,
    ].filter(Boolean).length;
    score += Math.min(10, approvals * 3.33);
  }
  
  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

/**
 * Determine risk level from score
 */
export function determineRiskLevel(score: number): DPIARiskLevel {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

/**
 * Get all DPIAs for the current user
 */
export async function getDpias(): Promise<DPIA[]> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const localData = secureStorage.getItem<DPIA[]>('dpias', []);
      return localData || [];
    }

    const { data, error } = await supabase
      .from('cc_privacy_dpias')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(transformFromDb);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to get DPIAs'), {
      context: 'dpia_get_dpias',
    });
    
    // Fallback to localStorage
    const localData = secureStorage.getItem<DPIA[]>('dpias', []);
    return localData || [];
  }
}

/**
 * Get a single DPIA by ID
 */
export async function getDpia(id: string): Promise<DPIA | null> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const dpias = secureStorage.getItem<DPIA[]>('dpias', []);
      return dpias.find(d => d.id === id) || null;
    }

    const { data, error } = await supabase
      .from('cc_privacy_dpias')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return transformFromDb(data);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to get DPIA'), {
      context: 'dpia_get_dpia',
      dpiaId: id,
    });
    
    // Fallback to localStorage
    const dpias = secureStorage.getItem<DPIA[]>('dpias', []);
    return dpias.find(d => d.id === id) || null;
  }
}

/**
 * Create a new DPIA
 */
export async function createDpia(dpia: Omit<DPIA, 'id' | 'createdAt' | 'updatedAt'>): Promise<DPIA> {
  try {
    const { user } = await getCurrentUser();
    
    // Calculate scores and risk level
    const score = calculateDpiAScore(dpia as DPIA);
    const riskLevel = determineRiskLevel(score.riskScore);
    
    // Assess Article 35 requirement
    const article35Assessment = assessArticle35Requirement(dpia);
    
    const newDpia: DPIA = {
      ...dpia,
      riskLevel: dpia.riskLevel || riskLevel,
      priority: dpia.priority || (article35Assessment.isHighRisk ? 'high' : 'medium'),
      risks: dpia.risks || [],
      measures: dpia.measures || { technical: [], organizational: [], legal: [] },
      consultation: dpia.consultation || { dpo: false, stakeholders: false, public: false, authorities: false },
      approval: dpia.approval || { dpo: false, management: false, legal: false },
      dataSubjects: dpia.dataSubjects || [],
      dataTypes: dpia.dataTypes || [],
      purposes: dpia.purposes || [],
      legalBasis: dpia.legalBasis || [],
      dataSources: dpia.dataSources || [],
      recipients: dpia.recipients || [],
      transfers: dpia.transfers || [],
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!user) {
      // Fallback to localStorage
      const dpias = secureStorage.getItem<DPIA[]>('dpias', []);
      dpias.push(newDpia);
      secureStorage.setItem('dpias', dpias);
      return newDpia;
    }

    // Transform to database format
    const dbRecord = transformToDb(newDpia, user.id);

    const { data, error } = await supabase
      .from('cc_privacy_dpias')
      .insert([dbRecord])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Also save to localStorage as backup
    const dpias = secureStorage.getItem<DPIA[]>('dpias', []);
    dpias.push(transformFromDb(data));
    secureStorage.setItem('dpias', dpias);

    return transformFromDb(data);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to create DPIA'), {
      context: 'dpia_create_dpia',
    });
    throw err;
  }
}

/**
 * Update an existing DPIA
 */
export async function updateDpia(id: string, updates: Partial<Omit<DPIA, 'id' | 'createdAt'>>): Promise<DPIA> {
  try {
    const { user } = await getCurrentUser();
    
    // Recalculate scores if relevant fields changed
    if (updates.dataTypes || updates.dataSubjects || updates.risks || updates.measures || updates.transfers) {
      const existing = await getDpia(id);
      if (existing) {
        const updated = { ...existing, ...updates };
        const score = calculateDpiAScore(updated);
        updates.riskLevel = determineRiskLevel(score.riskScore);
      }
    }

    const updatedDpia: Partial<DPIA> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!user) {
      // Fallback to localStorage
      const dpias = secureStorage.getItem<DPIA[]>('dpias', []);
      const index = dpias.findIndex(d => d.id === id);
      if (index === -1) {
        throw new Error('DPIA not found');
      }
      dpias[index] = { ...dpias[index], ...updatedDpia };
      secureStorage.setItem('dpias', dpias);
      return dpias[index];
    }

    // Transform to database format
    const dbUpdates = transformToDb(updatedDpia as DPIA, user.id, true);

    const { data, error } = await supabase
      .from('cc_privacy_dpias')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Also update localStorage
    const dpias = secureStorage.getItem<DPIA[]>('dpias', []);
    const index = dpias.findIndex(d => d.id === id);
    if (index !== -1) {
      dpias[index] = transformFromDb(data);
      secureStorage.setItem('dpias', dpias);
    }

    return transformFromDb(data);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to update DPIA'), {
      context: 'dpia_update_dpia',
      dpiaId: id,
    });
    throw err;
  }
}

/**
 * Delete a DPIA
 */
export async function deleteDpia(id: string): Promise<void> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const dpias = secureStorage.getItem<DPIA[]>('dpias', []);
      const filtered = dpias.filter(d => d.id !== id);
      secureStorage.setItem('dpias', filtered);
      return;
    }

    const { error } = await supabase
      .from('cc_privacy_dpias')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    // Also remove from localStorage
    const dpias = secureStorage.getItem<DPIA[]>('dpias', []);
    const filtered = dpias.filter(d => d.id !== id);
    secureStorage.setItem('dpias', filtered);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to delete DPIA'), {
      context: 'dpia_delete_dpia',
      dpiaId: id,
    });
    throw err;
  }
}

/**
 * Export DPIA to CSV
 */
export function exportToCSV(dpias: DPIA[]): string {
  const headers = [
    'Title',
    'Processing Activity',
    'Status',
    'Priority',
    'Risk Level',
    'Data Controller',
    'Assessor',
    'Created Date',
    'Due Date',
    'Data Subjects Count',
    'Data Types Count',
    'Risks Count',
    'Mitigation Measures',
  ];

  const rows = dpias.map(dpia => [
    dpia.title || '',
    dpia.processingActivity || '',
    dpia.status || '',
    dpia.priority || '',
    dpia.riskLevel || '',
    dpia.dataController || '',
    dpia.assessor || '',
    dpia.createdDate || '',
    dpia.dueDate || '',
    (dpia.dataSubjects?.length || 0).toString(),
    (dpia.dataTypes?.length || 0).toString(),
    (dpia.risks?.length || 0).toString(),
    ((dpia.measures?.technical?.length || 0) + 
     (dpia.measures?.organizational?.length || 0) + 
     (dpia.measures?.legal?.length || 0)).toString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Export DPIA to PDF
 */
export function exportToPDF(dpia: DPIA): void {
  // Use existing PDF generation utility
  const mappingData = {
    metadata: {
      title: `DPIA: ${dpia.title}`,
      created: dpia.createdDate || new Date().toISOString(),
      version: '1.0',
      organization: dpia.dataController,
    },
    processingActivities: [{
      id: dpia.id || '',
      name: dpia.processingActivity,
      purpose: dpia.purposes?.join(', ') || '',
      legalBasis: dpia.legalBasis?.join(', ') || '',
      dataTypes: dpia.dataTypes || [],
      dataSubjects: dpia.dataSubjects || [],
      recipients: dpia.recipients || [],
      retentionPeriod: dpia.retentionPeriod || '',
      riskLevel: dpia.riskLevel,
    }],
    compliance: {
      framework: 'GDPR',
      articles: ['Article 35'],
      dpiaRequired: true,
    },
  };

  generateGdprMappingPdf(mappingData);
}

/**
 * Transform database record to application format
 */
function transformFromDb(dbRecord: any): DPIA {
  return {
    id: dbRecord.id,
    title: dbRecord.title,
    description: dbRecord.description,
    processingActivity: dbRecord.processing_activity,
    dataController: dbRecord.data_controller,
    dataProcessor: dbRecord.data_processor,
    status: dbRecord.status,
    priority: dbRecord.priority,
    riskLevel: dbRecord.risk_level,
    createdDate: dbRecord.created_date,
    dueDate: dbRecord.due_date,
    lastUpdated: dbRecord.last_updated,
    assessor: dbRecord.assessor,
    reviewer: dbRecord.reviewer,
    dataSubjects: dbRecord.data_subjects || [],
    dataTypes: dbRecord.data_types || [],
    purposes: dbRecord.purposes || [],
    legalBasis: dbRecord.legal_basis || [],
    retentionPeriod: dbRecord.retention_period,
    dataSources: dbRecord.data_sources || [],
    recipients: dbRecord.recipients || [],
    transfers: dbRecord.transfers || [],
    risks: dbRecord.risks || [],
    measures: dbRecord.measures || { technical: [], organizational: [], legal: [] },
    consultation: dbRecord.consultation || { dpo: false, stakeholders: false, public: false, authorities: false },
    approval: dbRecord.approval || { dpo: false, management: false, legal: false },
    nextReview: dbRecord.next_review,
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at,
  };
}

/**
 * Transform application format to database format
 */
function transformToDb(dpia: Partial<DPIA>, userId: string, isUpdate = false): any {
  const dbRecord: any = {
    user_id: userId,
  };

  if (dpia.title !== undefined) dbRecord.title = dpia.title;
  if (dpia.description !== undefined) dbRecord.description = dpia.description;
  if (dpia.processingActivity !== undefined) dbRecord.processing_activity = dpia.processingActivity;
  if (dpia.dataController !== undefined) dbRecord.data_controller = dpia.dataController;
  if (dpia.dataProcessor !== undefined) dbRecord.data_processor = dpia.dataProcessor;
  if (dpia.status !== undefined) dbRecord.status = dpia.status;
  if (dpia.priority !== undefined) dbRecord.priority = dpia.priority;
  if (dpia.riskLevel !== undefined) dbRecord.risk_level = dpia.riskLevel;
  if (dpia.createdDate !== undefined) dbRecord.created_date = dpia.createdDate;
  if (dpia.dueDate !== undefined) dbRecord.due_date = dpia.dueDate;
  if (dpia.lastUpdated !== undefined) dbRecord.last_updated = dpia.lastUpdated;
  if (dpia.assessor !== undefined) dbRecord.assessor = dpia.assessor;
  if (dpia.reviewer !== undefined) dbRecord.reviewer = dpia.reviewer;
  if (dpia.dataSubjects !== undefined) dbRecord.data_subjects = dpia.dataSubjects;
  if (dpia.dataTypes !== undefined) dbRecord.data_types = dpia.dataTypes;
  if (dpia.purposes !== undefined) dbRecord.purposes = dpia.purposes;
  if (dpia.legalBasis !== undefined) dbRecord.legal_basis = dpia.legalBasis;
  if (dpia.retentionPeriod !== undefined) dbRecord.retention_period = dpia.retentionPeriod;
  if (dpia.dataSources !== undefined) dbRecord.data_sources = dpia.dataSources;
  if (dpia.recipients !== undefined) dbRecord.recipients = dpia.recipients;
  if (dpia.transfers !== undefined) dbRecord.transfers = dpia.transfers;
  if (dpia.risks !== undefined) dbRecord.risks = dpia.risks;
  if (dpia.measures !== undefined) dbRecord.measures = dpia.measures;
  if (dpia.consultation !== undefined) dbRecord.consultation = dpia.consultation;
  if (dpia.approval !== undefined) dbRecord.approval = dpia.approval;
  if (dpia.nextReview !== undefined) dbRecord.next_review = dpia.nextReview;

  return dbRecord;
}

