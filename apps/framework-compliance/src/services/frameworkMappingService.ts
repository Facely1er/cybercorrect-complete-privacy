/**
 * Framework Mapping Service
 * Provides cross-framework mapping and analysis capabilities with NIST Privacy Framework as principal
 * Adapted from toolkitv2 for privacy compliance platform
 */

export interface FrameworkControl {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  implementationStatus: 'not_implemented' | 'partially_implemented' | 'fully_implemented' | 'not_applicable';
  evidence?: string[];
  lastAssessed?: Date;
  nextReview?: Date;
  owner?: string;
  costEstimate?: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  relatedControls: string[];
  frameworkSpecificId: string; // Original control ID in the specific framework
}

export interface FrameworkMapping {
  sourceFramework: string;
  targetFramework: string;
  controlId: string;
  mappedControlId: string;
  mappingType: 'direct' | 'partial' | 'equivalent' | 'superset' | 'subset';
  confidence: number; // 0-100
  notes?: string;
  evidence?: string[];
}

export interface CrossFrameworkAnalysis {
  framework: string;
  overallScore: number;
  domainScores: Record<string, number>;
  controlCount: number;
  implementedCount: number;
  gapCount: number;
  criticalGaps: number;
  estimatedCost: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  maturityLevel: string;
  lastUpdated: Date;
}

export interface UnifiedComplianceReport {
  principalFramework: string; // NIST Privacy Framework
  analysisDate: Date;
  organizationName: string;
  overallComplianceScore: number;
  frameworkAnalyses: CrossFrameworkAnalysis[];
  crossFrameworkMappings: FrameworkMapping[];
  unifiedGaps: UnifiedGap[];
  recommendations: Recommendation[];
  executiveSummary: ExecutiveSummary;
}

export interface UnifiedGap {
  id: string;
  title: string;
  description: string;
  affectedFrameworks: string[];
  primaryFramework: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  businessImpact: string;
  complianceRisk: string;
  estimatedCost: number;
  timeframe: string;
  owner: string;
  relatedControls: string[];
  remediationSteps: string[];
  evidence: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  affectedFrameworks: string[];
  estimatedEffort: string;
  estimatedCost: number;
  businessValue: string;
  implementationSteps: string[];
  successCriteria: string[];
}

export interface ExecutiveSummary {
  totalFrameworks: number;
  averageComplianceScore: number;
  totalGaps: number;
  criticalGaps: number;
  totalEstimatedCost: number;
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  keyFindings: string[];
  topRecommendations: string[];
}

// NIST Privacy Framework as Principal Framework
export const NIST_PRIVACY_FRAMEWORK = {
  id: 'nist_privacy_framework',
  name: 'NIST Privacy Framework',
  version: '1.0',
  description: 'A tool for improving privacy through enterprise risk management',
  domains: [
    {
      id: 'identify',
      name: 'Identify',
      description: 'Develop the organizational understanding to manage privacy risk for individuals arising from data processing'
    },
    {
      id: 'govern',
      name: 'Govern',
      description: 'Develop and implement organizational governance structure to enable an ongoing understanding of the organizational context'
    },
    {
      id: 'control',
      name: 'Control',
      description: 'Develop and implement appropriate activities to enable organizations and individuals to manage data with sufficient granularity'
    },
    {
      id: 'communicate',
      name: 'Communicate',
      description: 'Develop and implement appropriate activities to enable organizations and individuals to have a reliable understanding'
    },
    {
      id: 'protect',
      name: 'Protect',
      description: 'Develop and implement appropriate data processing safeguards'
    }
  ],
  controls: [
    // ID-PI: Identity and Privacy
    {
      id: 'ID-PI-1',
      title: 'Asset Management',
      description: 'The data, systems, devices, and other assets that enable organizational operations are identified and managed consistent with their relative importance to organizational objectives and the organization\'s risk strategy',
      category: 'identify',
      subcategory: 'identity',
      priority: 'high'
    },
    {
      id: 'ID-PI-2',
      title: 'Business Environment',
      description: 'The organization\'s mission, objectives, and activities are understood and communicated',
      category: 'identify',
      subcategory: 'identity',
      priority: 'high'
    },
    {
      id: 'ID-PI-3',
      title: 'Governance',
      description: 'The policies, procedures, and processes to manage and monitor the organization\'s regulatory, legal, risk, environmental, and operational requirements are understood and inform the management of the organization\'s privacy risk',
      category: 'identify',
      subcategory: 'identity',
      priority: 'critical'
    },
    {
      id: 'ID-PI-4',
      title: 'Risk Assessment',
      description: 'The organization understands the privacy risk to individuals and other stakeholders',
      category: 'identify',
      subcategory: 'identity',
      priority: 'critical'
    },
    {
      id: 'ID-PI-5',
      title: 'Risk Management Strategy',
      description: 'The organization\'s priorities, constraints, risk tolerances, and assumptions are established and used to support operational risk decisions',
      category: 'identify',
      subcategory: 'identity',
      priority: 'high'
    },
    {
      id: 'ID-PI-6',
      title: 'Supply Chain Risk Management',
      description: 'The organization\'s priorities, constraints, risk tolerances, and assumptions are established and used to support risk decisions associated with managing supply chain risk',
      category: 'identify',
      subcategory: 'identity',
      priority: 'medium'
    },
    // GV-PO: Governance and Privacy Outcomes
    {
      id: 'GV-PO-1',
      title: 'Governance Structure',
      description: 'The organization\'s privacy risk management governance structure is established, communicated, and monitored',
      category: 'govern',
      subcategory: 'privacy_outcomes',
      priority: 'critical'
    },
    {
      id: 'GV-PO-2',
      title: 'Privacy Program',
      description: 'The organization\'s privacy program is established, communicated, and monitored',
      category: 'govern',
      subcategory: 'privacy_outcomes',
      priority: 'critical'
    },
    {
      id: 'GV-PO-3',
      title: 'Privacy Risk Management Process',
      description: 'The organization\'s privacy risk management process is established, communicated, and monitored',
      category: 'govern',
      subcategory: 'privacy_outcomes',
      priority: 'critical'
    },
    {
      id: 'GV-PO-4',
      title: 'Privacy Risk Management Program Roles',
      description: 'Privacy risk management program roles and responsibilities are established, communicated, and monitored',
      category: 'govern',
      subcategory: 'privacy_outcomes',
      priority: 'high'
    },
    {
      id: 'GV-PO-5',
      title: 'Privacy Risk Management Program Resources',
      description: 'Privacy risk management program resources are established, communicated, and monitored',
      category: 'govern',
      subcategory: 'privacy_outcomes',
      priority: 'high'
    },
    {
      id: 'GV-PO-6',
      title: 'Privacy Risk Management Program Training',
      description: 'Privacy risk management program training is established, communicated, and monitored',
      category: 'govern',
      subcategory: 'privacy_outcomes',
      priority: 'medium'
    },
    {
      id: 'GV-PO-7',
      title: 'Privacy Risk Management Program Communication',
      description: 'Privacy risk management program communication is established, communicated, and monitored',
      category: 'govern',
      subcategory: 'privacy_outcomes',
      priority: 'medium'
    },
    {
      id: 'GV-PO-8',
      title: 'Privacy Risk Management Program Monitoring',
      description: 'Privacy risk management program monitoring is established, communicated, and monitored',
      category: 'govern',
      subcategory: 'privacy_outcomes',
      priority: 'high'
    },
    // CT-DP: Control and Data Processing
    {
      id: 'CT-DP-1',
      title: 'Data Processing Management',
      description: 'Data processing activities are managed to meet the organization\'s privacy risk management objectives',
      category: 'control',
      subcategory: 'data_processing',
      priority: 'critical'
    },
    {
      id: 'CT-DP-2',
      title: 'Data Processing Policies',
      description: 'Data processing policies are established, communicated, and monitored',
      category: 'control',
      subcategory: 'data_processing',
      priority: 'critical'
    },
    {
      id: 'CT-DP-3',
      title: 'Data Processing Procedures',
      description: 'Data processing procedures are established, communicated, and monitored',
      category: 'control',
      subcategory: 'data_processing',
      priority: 'high'
    },
    {
      id: 'CT-DP-4',
      title: 'Data Processing Controls',
      description: 'Data processing controls are established, communicated, and monitored',
      category: 'control',
      subcategory: 'data_processing',
      priority: 'high'
    },
    {
      id: 'CT-DP-5',
      title: 'Data Processing Monitoring',
      description: 'Data processing monitoring is established, communicated, and monitored',
      category: 'control',
      subcategory: 'data_processing',
      priority: 'high'
    },
    // CM-DP: Communicate and Data Processing
    {
      id: 'CM-DP-1',
      title: 'Data Processing Communication',
      description: 'Data processing communication is established, communicated, and monitored',
      category: 'communicate',
      subcategory: 'data_processing',
      priority: 'high'
    },
    {
      id: 'CM-DP-2',
      title: 'Data Processing Transparency',
      description: 'Data processing transparency is established, communicated, and monitored',
      category: 'communicate',
      subcategory: 'data_processing',
      priority: 'high'
    },
    {
      id: 'CM-DP-3',
      title: 'Data Processing Consent',
      description: 'Data processing consent is established, communicated, and monitored',
      category: 'communicate',
      subcategory: 'data_processing',
      priority: 'critical'
    },
    {
      id: 'CM-DP-4',
      title: 'Data Processing Rights',
      description: 'Data processing rights are established, communicated, and monitored',
      category: 'communicate',
      subcategory: 'data_processing',
      priority: 'critical'
    },
    // PR-DP: Protect and Data Processing
    {
      id: 'PR-DP-1',
      title: 'Data Processing Protection',
      description: 'Data processing protection is established, communicated, and monitored',
      category: 'protect',
      subcategory: 'data_processing',
      priority: 'critical'
    },
    {
      id: 'PR-DP-2',
      title: 'Data Processing Security',
      description: 'Data processing security is established, communicated, and monitored',
      category: 'protect',
      subcategory: 'data_processing',
      priority: 'critical'
    },
    {
      id: 'PR-DP-3',
      title: 'Data Processing Access',
      description: 'Data processing access is established, communicated, and monitored',
      category: 'protect',
      subcategory: 'data_processing',
      priority: 'high'
    },
    {
      id: 'PR-DP-4',
      title: 'Data Processing Integrity',
      description: 'Data processing integrity is established, communicated, and monitored',
      category: 'protect',
      subcategory: 'data_processing',
      priority: 'high'
    },
    {
      id: 'PR-DP-5',
      title: 'Data Processing Availability',
      description: 'Data processing availability is established, communicated, and monitored',
      category: 'protect',
      subcategory: 'data_processing',
      priority: 'high'
    }
  ]
};

// Privacy-focused Compliance Frameworks
export const COMPLIANCE_FRAMEWORKS = {
  nist_privacy_framework: {
    id: 'nist_privacy_framework',
    name: 'NIST Privacy Framework',
    version: '1.0',
    description: 'A tool for improving privacy through enterprise risk management',
    domains: ['Identify', 'Govern', 'Control', 'Communicate', 'Protect'],
    totalControls: 25
  },
  gdpr: {
    id: 'gdpr',
    name: 'GDPR',
    version: '2018',
    description: 'General Data Protection Regulation',
    domains: ['Lawfulness of Processing', 'Conditions for Consent', 'Information and Access to Personal Data', 'Right to Rectification and Erasure', 'Right to Restrict Processing', 'Data Portability', 'Right to Object', 'Automated Individual Decision-Making', 'Processing of Special Categories', 'Data Protection by Design and by Default', 'Data Protection Impact Assessment', 'Data Protection Officer', 'Codes of Conduct and Certification', 'Transfers of Personal Data', 'Cooperation with Supervisory Authority', 'Liability and Penalties'],
    totalControls: 99
  },
  ccpa: {
    id: 'ccpa',
    name: 'CCPA',
    version: '2020',
    description: 'California Consumer Privacy Act',
    domains: ['Consumer Rights', 'Business Obligations', 'Data Collection and Use', 'Data Sharing and Sales', 'Data Security', 'Privacy Notices', 'Opt-Out Rights', 'Non-Discrimination', 'Enforcement and Penalties'],
    totalControls: 45
  },
  cpra: {
    id: 'cpra',
    name: 'CPRA',
    version: '2023',
    description: 'California Privacy Rights Act',
    domains: ['Consumer Rights', 'Business Obligations', 'Data Collection and Use', 'Data Sharing and Sales', 'Data Security', 'Privacy Notices', 'Opt-Out Rights', 'Non-Discrimination', 'Enforcement and Penalties', 'Sensitive Personal Information'],
    totalControls: 52
  },
  vcdpa: {
    id: 'vcdpa',
    name: 'VCDPA',
    version: '2023',
    description: 'Virginia Consumer Data Protection Act',
    domains: ['Consumer Rights', 'Business Obligations', 'Data Collection and Use', 'Data Security', 'Privacy Notices', 'Opt-Out Rights', 'Non-Discrimination'],
    totalControls: 38
  },
  iso_27001: {
    id: 'iso_27001',
    name: 'ISO 27001',
    version: '2022',
    description: 'Information Security Management Systems',
    domains: ['Information Security Policies', 'Organization of Information Security', 'Human Resource Security', 'Asset Management', 'Access Control', 'Cryptography', 'Physical and Environmental Security', 'Operations Security', 'Communications Security', 'System Acquisition', 'Supplier Relationships', 'Information Security Incident Management', 'Information Security Aspects of Business Continuity Management', 'Compliance'],
    totalControls: 114
  },
  hipaa: {
    id: 'hipaa',
    name: 'HIPAA',
    version: '2013',
    description: 'Health Insurance Portability and Accountability Act',
    domains: ['Administrative Safeguards', 'Physical Safeguards', 'Technical Safeguards', 'Organizational Requirements', 'Policies and Procedures', 'Documentation Requirements'],
    totalControls: 54
  },
  nist_csf: {
    id: 'nist_csf',
    name: 'NIST Cybersecurity Framework',
    version: '1.1',
    description: 'A framework for improving critical infrastructure cybersecurity',
    domains: ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'],
    totalControls: 108
  }
};

// Cross-framework mapping definitions - Privacy-focused mappings
export const FRAMEWORK_MAPPINGS: FrameworkMapping[] = [
  // NIST Privacy Framework to GDPR mappings
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'gdpr',
    controlId: 'CM-DP-3',
    mappedControlId: 'GDPR-6.1.a',
    mappingType: 'direct',
    confidence: 95,
    notes: 'Consent management aligns with GDPR Article 6(1)(a)'
  },
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'gdpr',
    controlId: 'CM-DP-4',
    mappedControlId: 'GDPR-15-22',
    mappingType: 'superset',
    confidence: 90,
    notes: 'Privacy framework data subject rights encompass GDPR rights (Articles 15-22)'
  },
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'gdpr',
    controlId: 'CT-DP-1',
    mappedControlId: 'GDPR-25',
    mappingType: 'partial',
    confidence: 85,
    notes: 'Data processing management supports data protection by design (Article 25)'
  },
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'gdpr',
    controlId: 'ID-PI-4',
    mappedControlId: 'GDPR-35',
    mappingType: 'direct',
    confidence: 90,
    notes: 'Risk assessment maps to Data Protection Impact Assessment (Article 35)'
  },
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'gdpr',
    controlId: 'GV-PO-1',
    mappedControlId: 'GDPR-37',
    mappingType: 'partial',
    confidence: 85,
    notes: 'Governance structure supports Data Protection Officer requirements (Article 37)'
  },
  
  // NIST Privacy Framework to CCPA mappings
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'ccpa',
    controlId: 'CM-DP-4',
    mappedControlId: 'CCPA-1798.100',
    mappingType: 'direct',
    confidence: 95,
    notes: 'Data subject rights align with CCPA consumer rights (Section 1798.100)'
  },
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'ccpa',
    controlId: 'CM-DP-2',
    mappedControlId: 'CCPA-1798.100',
    mappingType: 'partial',
    confidence: 80,
    notes: 'Transparency requirements support CCPA disclosure obligations'
  },
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'ccpa',
    controlId: 'CM-DP-3',
    mappedControlId: 'CCPA-1798.120',
    mappingType: 'partial',
    confidence: 85,
    notes: 'Consent management supports opt-out rights (Section 1798.120)'
  },
  
  // NIST Privacy Framework to CPRA mappings
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'cpra',
    controlId: 'CM-DP-4',
    mappedControlId: 'CPRA-1798.100',
    mappingType: 'direct',
    confidence: 95,
    notes: 'Data subject rights align with CPRA consumer rights'
  },
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'cpra',
    controlId: 'PR-DP-1',
    mappedControlId: 'CPRA-1798.100.5',
    mappingType: 'partial',
    confidence: 85,
    notes: 'Data protection aligns with CPRA sensitive personal information requirements'
  },
  
  // NIST Privacy Framework to ISO 27001 mappings
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'iso_27001',
    controlId: 'GV-PO-1',
    mappedControlId: 'A.5.1.1',
    mappingType: 'direct',
    confidence: 90,
    notes: 'Governance structure aligns with information security policies'
  },
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'iso_27001',
    controlId: 'PR-DP-1',
    mappedControlId: 'A.8.1',
    mappingType: 'partial',
    confidence: 85,
    notes: 'Data protection maps to asset management and access control'
  },
  
  // NIST Privacy Framework to NIST CSF mappings
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'nist_csf',
    controlId: 'ID-PI-1',
    mappedControlId: 'ID.AM-1',
    mappingType: 'direct',
    confidence: 95,
    notes: 'Asset management principles align directly between frameworks'
  },
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'nist_csf',
    controlId: 'ID-PI-4',
    mappedControlId: 'ID.RA-1',
    mappingType: 'direct',
    confidence: 90,
    notes: 'Risk assessment methodologies are compatible'
  },
  {
    sourceFramework: 'nist_privacy_framework',
    targetFramework: 'nist_csf',
    controlId: 'PR-DP-2',
    mappedControlId: 'PR.AC-1',
    mappingType: 'partial',
    confidence: 85,
    notes: 'Privacy protection maps to multiple CSF protect controls'
  }
];

export class FrameworkMappingService {
  private static instance: FrameworkMappingService;
  
  public static getInstance(): FrameworkMappingService {
    if (!FrameworkMappingService.instance) {
      FrameworkMappingService.instance = new FrameworkMappingService();
    }
    return FrameworkMappingService.instance;
  }

  /**
   * Get all available compliance frameworks
   */
  getAvailableFrameworks() {
    return Object.values(COMPLIANCE_FRAMEWORKS);
  }

  /**
   * Get the principal framework (NIST Privacy Framework)
   */
  getPrincipalFramework() {
    return NIST_PRIVACY_FRAMEWORK;
  }

  /**
   * Get framework mappings for a specific framework
   */
  getFrameworkMappings(frameworkId: string): FrameworkMapping[] {
    return FRAMEWORK_MAPPINGS.filter(mapping => 
      mapping.sourceFramework === frameworkId || mapping.targetFramework === frameworkId
    );
  }

  /**
   * Map controls between frameworks
   */
  mapControls(sourceFramework: string, targetFramework: string, controlId: string): FrameworkMapping[] {
    return FRAMEWORK_MAPPINGS.filter(mapping => 
      mapping.sourceFramework === sourceFramework && 
      mapping.targetFramework === targetFramework && 
      mapping.controlId === controlId
    );
  }

  /**
   * Perform cross-framework analysis
   */
  async performCrossFrameworkAnalysis(
    frameworks: string[], 
    complianceData: Record<string, any>
  ): Promise<CrossFrameworkAnalysis[]> {
    const analyses: CrossFrameworkAnalysis[] = [];
    
    for (const frameworkId of frameworks) {
      const framework = COMPLIANCE_FRAMEWORKS[frameworkId as keyof typeof COMPLIANCE_FRAMEWORKS];
      if (!framework) continue;

      const analysis: CrossFrameworkAnalysis = {
        framework: frameworkId,
        overallScore: this.calculateOverallScore(complianceData[frameworkId]),
        domainScores: this.calculateDomainScores(complianceData[frameworkId]),
        controlCount: framework.totalControls,
        implementedCount: this.countImplementedControls(complianceData[frameworkId]),
        gapCount: this.countGaps(complianceData[frameworkId]),
        criticalGaps: this.countCriticalGaps(complianceData[frameworkId]),
        estimatedCost: this.calculateEstimatedCost(complianceData[frameworkId]),
        riskLevel: this.calculateRiskLevel(complianceData[frameworkId]),
        maturityLevel: this.calculateMaturityLevel(complianceData[frameworkId]),
        lastUpdated: new Date()
      };
      
      analyses.push(analysis);
    }
    
    return analyses;
  }

  /**
   * Generate unified compliance report
   */
  async generateUnifiedReport(
    organizationName: string,
    frameworks: string[],
    complianceData: Record<string, any>
  ): Promise<UnifiedComplianceReport> {
    const frameworkAnalyses = await this.performCrossFrameworkAnalysis(frameworks, complianceData);
    const unifiedGaps = this.identifyUnifiedGaps(complianceData, frameworks);
    const recommendations = this.generateRecommendations(unifiedGaps, frameworkAnalyses);
    
    const report: UnifiedComplianceReport = {
      principalFramework: 'nist_privacy_framework',
      analysisDate: new Date(),
      organizationName,
      overallComplianceScore: this.calculateOverallComplianceScore(frameworkAnalyses),
      frameworkAnalyses,
      crossFrameworkMappings: FRAMEWORK_MAPPINGS,
      unifiedGaps,
      recommendations,
      executiveSummary: this.generateExecutiveSummary(frameworkAnalyses, unifiedGaps, recommendations)
    };
    
    return report;
  }

  private calculateOverallScore(data: any): number {
    if (!data || !data.overallScore) return 0;
    return data.overallScore;
  }

  private calculateDomainScores(data: any): Record<string, number> {
    if (!data || !data.domainScores) return {};
    return data.domainScores;
  }

  private countImplementedControls(data: any): number {
    if (!data || !data.controls) return 0;
    return data.controls.filter((control: any) => 
      control.implementationStatus === 'fully_implemented'
    ).length;
  }

  private countGaps(data: any): number {
    if (!data || !data.controls) return 0;
    return data.controls.filter((control: any) => 
      control.implementationStatus === 'not_implemented' || 
      control.implementationStatus === 'partially_implemented'
    ).length;
  }

  private countCriticalGaps(data: any): number {
    if (!data || !data.controls) return 0;
    return data.controls.filter((control: any) => 
      (control.implementationStatus === 'not_implemented' || 
       control.implementationStatus === 'partially_implemented') &&
      control.priority === 'critical'
    ).length;
  }

  private calculateEstimatedCost(data: any): number {
    if (!data || !data.controls) return 0;
    return data.controls.reduce((total: number, control: any) => 
      total + (control.costEstimate || 0), 0
    );
  }

  private calculateRiskLevel(data: any): 'low' | 'medium' | 'high' | 'critical' {
    const criticalGaps = this.countCriticalGaps(data);
    const totalGaps = this.countGaps(data);
    
    if (criticalGaps > 5) return 'critical';
    if (criticalGaps > 2 || totalGaps > 20) return 'high';
    if (totalGaps > 10) return 'medium';
    return 'low';
  }

  private calculateMaturityLevel(data: any): string {
    const overallScore = this.calculateOverallScore(data);
    
    if (overallScore >= 90) return 'Advanced';
    if (overallScore >= 75) return 'Proficient';
    if (overallScore >= 50) return 'Developing';
    if (overallScore >= 25) return 'Basic';
    return 'Initial';
  }

  private identifyUnifiedGaps(complianceData: Record<string, any>, frameworks: string[]): UnifiedGap[] {
    const unifiedGaps: UnifiedGap[] = [];
    const gapMap = new Map<string, UnifiedGap>();
    
    frameworks.forEach(frameworkId => {
      const data = complianceData[frameworkId];
      if (!data || !data.controls) return;
      
      data.controls.forEach((control: any) => {
        if (control.implementationStatus === 'not_implemented' || 
            control.implementationStatus === 'partially_implemented') {
          
          const gapKey = this.generateGapKey(control);
          let unifiedGap = gapMap.get(gapKey);
          
          if (!unifiedGap) {
            unifiedGap = {
              id: `gap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: control.title,
              description: control.description,
              affectedFrameworks: [],
              primaryFramework: frameworkId,
              priority: control.priority,
              businessImpact: this.calculateBusinessImpact(control),
              complianceRisk: this.calculateComplianceRisk(control),
              estimatedCost: control.costEstimate || 0,
              timeframe: this.calculateTimeframe(control),
              owner: control.owner || 'TBD',
              relatedControls: [control.id],
              remediationSteps: this.generateRemediationSteps(control),
              evidence: control.evidence || []
            };
            gapMap.set(gapKey, unifiedGap);
          }
          
          unifiedGap.affectedFrameworks.push(frameworkId);
          unifiedGap.relatedControls.push(control.id);
          
          // Update priority to highest across frameworks
          if (this.getPriorityWeight(control.priority) > this.getPriorityWeight(unifiedGap.priority)) {
            unifiedGap.priority = control.priority;
          }
        }
      });
    });
    
    return Array.from(gapMap.values()).sort((a, b) => 
      this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority)
    );
  }

  private generateGapKey(control: any): string {
    // Create a key based on control title and description for deduplication
    return `${control.title.toLowerCase().replace(/\s+/g, '-')}-${control.description.substring(0, 50).toLowerCase().replace(/\s+/g, '-')}`;
  }

  private calculateBusinessImpact(control: any): string {
    const priority = control.priority;
    const impactMap: Record<string, string> = {
      'critical': 'Severe - Major business disruption, regulatory penalties, reputation damage',
      'high': 'High - Significant operational impact, potential compliance issues',
      'medium': 'Medium - Moderate operational impact, some compliance risk',
      'low': 'Low - Minor operational impact, minimal compliance risk'
    };
    return impactMap[priority] || 'Unknown impact';
  }

  private calculateComplianceRisk(control: any): string {
    const priority = control.priority;
    const riskMap: Record<string, string> = {
      'critical': 'Critical - Immediate regulatory action likely (GDPR: up to €20M or 4% revenue)',
      'high': 'High - Significant compliance deficiency (CCPA: $2,500-$7,500 per violation)',
      'medium': 'Medium - Moderate compliance gap',
      'low': 'Low - Minor compliance issue'
    };
    return riskMap[priority] || 'Unknown risk';
  }

  private calculateTimeframe(control: any): string {
    const priority = control.priority;
    const timeframeMap: Record<string, string> = {
      'critical': 'Immediate (0-30 days)',
      'high': 'Short-term (1-3 months)',
      'medium': 'Medium-term (3-6 months)',
      'low': 'Long-term (6-12 months)'
    };
    return timeframeMap[priority] || 'TBD';
  }

  private generateRemediationSteps(control: any): string[] {
    return [
      `Assess current implementation status of ${control.title}`,
      `Develop implementation plan with specific milestones`,
      `Assign ownership and resources for implementation`,
      `Implement technical and administrative controls`,
      `Test and validate implementation`,
      `Document evidence and maintain ongoing monitoring`
    ];
  }

  private getPriorityWeight(priority: string): number {
    const weights: Record<string, number> = {
      'critical': 4,
      'high': 3,
      'medium': 2,
      'low': 1
    };
    return weights[priority] || 0;
  }

  private generateRecommendations(unifiedGaps: UnifiedGap[], frameworkAnalyses: CrossFrameworkAnalysis[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Generate recommendations based on critical gaps
    const criticalGaps = unifiedGaps.filter(gap => gap.priority === 'critical');
    if (criticalGaps.length > 0) {
      recommendations.push({
        id: 'rec-critical-gaps',
        title: 'Address Critical Privacy Compliance Gaps',
        description: `Immediately address ${criticalGaps.length} critical compliance gaps across multiple privacy frameworks`,
        priority: 'critical',
        affectedFrameworks: [...new Set(criticalGaps.flatMap(gap => gap.affectedFrameworks))],
        estimatedEffort: 'High',
        estimatedCost: criticalGaps.reduce((sum, gap) => sum + gap.estimatedCost, 0),
        businessValue: 'Prevent regulatory penalties (GDPR: up to €20M, CCPA: $2,500-$7,500 per violation) and maintain business continuity',
        implementationSteps: [
          'Prioritize critical gaps by business impact and regulatory risk',
          'Assign dedicated resources and budget',
          'Implement immediate compensating controls',
          'Develop detailed remediation plans',
          'Establish executive oversight and reporting'
        ],
        successCriteria: [
          'All critical gaps addressed within 30 days',
          'Compensating controls implemented and tested',
          'Executive sign-off on remediation plans'
        ]
      });
    }
    
    // Generate recommendations based on framework maturity
    const lowMaturityFrameworks = frameworkAnalyses.filter(analysis => 
      analysis.maturityLevel === 'Initial' || analysis.maturityLevel === 'Basic'
    );
    
    if (lowMaturityFrameworks.length > 0) {
      recommendations.push({
        id: 'rec-maturity-improvement',
        title: 'Improve Privacy Framework Maturity',
        description: `Enhance maturity level for ${lowMaturityFrameworks.length} privacy compliance frameworks`,
        priority: 'high',
        affectedFrameworks: lowMaturityFrameworks.map(analysis => analysis.framework),
        estimatedEffort: 'Medium',
        estimatedCost: lowMaturityFrameworks.reduce((sum, analysis) => sum + analysis.estimatedCost, 0),
        businessValue: 'Improve overall privacy compliance posture and reduce regulatory risk',
        implementationSteps: [
          'Conduct detailed maturity assessment',
          'Develop framework-specific improvement plans',
          'Implement governance and process improvements',
          'Provide privacy training and awareness programs',
          'Establish continuous monitoring and improvement'
        ],
        successCriteria: [
          'All frameworks reach at least "Developing" maturity',
          'Process improvements documented and implemented',
          'Training completion rates above 90%'
        ]
      });
    }
    
    return recommendations;
  }

  private calculateOverallComplianceScore(frameworkAnalyses: CrossFrameworkAnalysis[]): number {
    if (frameworkAnalyses.length === 0) return 0;
    const totalScore = frameworkAnalyses.reduce((sum, analysis) => sum + analysis.overallScore, 0);
    return Math.round(totalScore / frameworkAnalyses.length);
  }

  private generateExecutiveSummary(
    frameworkAnalyses: CrossFrameworkAnalysis[], 
    unifiedGaps: UnifiedGap[], 
    recommendations: Recommendation[]
  ): ExecutiveSummary {
    const criticalGaps = unifiedGaps.filter(gap => gap.priority === 'critical').length;
    const totalEstimatedCost = unifiedGaps.reduce((sum, gap) => sum + gap.estimatedCost, 0);
    const averageComplianceScore = this.calculateOverallComplianceScore(frameworkAnalyses);
    
    let overallRiskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (criticalGaps > 5) overallRiskLevel = 'critical';
    else if (criticalGaps > 2 || averageComplianceScore < 50) overallRiskLevel = 'high';
    else if (averageComplianceScore < 75) overallRiskLevel = 'medium';
    
    return {
      totalFrameworks: frameworkAnalyses.length,
      averageComplianceScore,
      totalGaps: unifiedGaps.length,
      criticalGaps,
      totalEstimatedCost,
      overallRiskLevel,
      keyFindings: [
        `${frameworkAnalyses.length} privacy compliance frameworks analyzed`,
        `${averageComplianceScore}% average compliance score`,
        `${unifiedGaps.length} total gaps identified`,
        `${criticalGaps} critical gaps requiring immediate attention`,
        `$${(totalEstimatedCost / 1000000).toFixed(1)}M estimated remediation cost`
      ],
      topRecommendations: recommendations.slice(0, 3).map(rec => rec.title)
    };
  }
}

export default FrameworkMappingService;


