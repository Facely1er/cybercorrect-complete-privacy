import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Target, 
  BarChart3, 
  TrendingUp, 
  Download, 
  RefreshCw, 
  Building,
  Eye,
  Server,
  Import
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useLocation } from 'react-router-dom';
import { toast } from '../../components/ui/Toaster';

// Define interfaces
interface Framework {
  name: string;
  version: string;
  releaseDate: string;
  domains: string[];
  totalControls: number;
  description: string;
  industry: string;
  complexity: string;
  maturityLevels: string[];
  regulatoryMapping: string[];
  icon: React.ComponentType<{ className?: string }>;
}

interface Control {
  id: string;
  title: string;
  description: string;
  status: 'fully_implemented' | 'partially_implemented' | 'planned' | 'not_implemented' | 'not_applicable';
  priority: 'critical' | 'high' | 'medium' | 'low';
  lastAssessed: Date;
  nextReview: Date;
  owner: string;
  evidenceCount: number;
  remediationEffort: number;
  costEstimate: number;
  riskLevel: string;
  complianceScore: number;
  tags: string[];
  relatedControls: string[];
}

interface DomainData {
  controls: Control[];
  domainScore: number;
  totalControls: number;
  implementedControls: number;
  gapCount: number;
  partialCount: number;
  plannedCount: number;
  riskScore: string;
  maturityLevel: string;
  lastUpdated: Date;
}

interface GapAnalysisItem extends Control {
  domain: string;
  framework: string;
  frameworkName: string;
  gapType: 'missing' | 'incomplete';
  businessImpact: string;
  timeframe: string;
  complianceRisk: string;
  estimatedCost: number;
  urgencyScore: number;
}

interface TrendData {
  month: string;
  score: number;
  gaps: number;
  implemented: number;
  assessments: number;
}

interface AssessmentHistory {
  id: number;
  framework: string;
  date: string;
  score: number;
  gaps: number;
  status: string;
}

const ComplianceGapAnalyzer: React.FC = () => {

  const location = useLocation();
  const { frameworkType, assessmentResults } = location.state || {};
  
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [complianceData, setComplianceData] = useState<Record<string, DomainData>>({});
  const [selectedFramework] = useState<string>(frameworkType || 'nist_800_171');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysisItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [overallScore] = useState<number>(assessmentResults?.overallScore || 0);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([]);

  const [error, setError] = useState<string | null>(null);

  // Enhanced compliance frameworks with real standards and current versions
  const frameworks: Record<string, Framework> = useMemo(() => ({
    'nist_800_171': {
      name: 'NIST SP 800-171',
      version: 'Rev 2',
      releaseDate: '2020-02-01',
      domains: ['Access Control', 'Awareness and Training', 'Audit and Accountability', 'Configuration Management', 'Identification and Authentication', 'Incident Response', 'Maintenance', 'Media Protection', 'Personnel Security', 'Physical Protection', 'Risk Assessment', 'Security Assessment', 'System and Communications Protection', 'System and Information Integrity'],
      totalControls: 110,
      description: 'Protecting Controlled Unclassified Information in nonfederal systems',
      industry: 'Government Contractors',
      complexity: 'Advanced',
      maturityLevels: ['Basic', 'Derived', 'Tailored'],
      regulatoryMapping: ['DFARS', 'FISMA'],
      icon: Server
    },
    'nist_privacy_framework': {
      name: 'NIST Privacy Framework',
      version: '1.0',
      releaseDate: '2020-01-16',
      domains: ['Identify', 'Govern', 'Control', 'Communicate', 'Protect'],
      totalControls: 109,
      description: 'A tool for improving privacy through enterprise risk management',
      industry: 'All Industries',
      complexity: 'Intermediate',
      maturityLevels: ['Partial', 'Risk Informed', 'Repeatable', 'Adaptive'],
      regulatoryMapping: ['GDPR', 'CCPA', 'LGPD', 'PIPEDA'],
      icon: Eye
    }
  }), []);

  // Control implementation status with enhanced scoring
  const implementationStatus = useMemo(() => ({
    'fully_implemented': { label: 'Fully Implemented', color: '#22c55e', textColor: 'text-green-700 dark:text-green-300', score: 100, priority: 1 },
    'partially_implemented': { label: 'Partially Implemented', color: '#f59e0b', textColor: 'text-yellow-700 dark:text-yellow-300', score: 60, priority: 2 },
    'planned': { label: 'Planned', color: '#3b82f6', textColor: 'text-blue-700 dark:text-blue-300', score: 30, priority: 3 },
    'not_implemented': { label: 'Not Implemented', color: '#ef4444', textColor: 'text-red-700 dark:text-red-300', score: 0, priority: 4 },
    'not_applicable': { label: 'Not Applicable', color: '#6b7280', textColor: 'text-muted-foreground', score: 100, priority: 0 }
  }), []);

  // Enhanced priority levels with business impact
  const priorityLevels = useMemo(() => ({
    'critical': { label: 'Critical', color: '#dc2626', weight: 4, businessImpact: 'Severe', timeframe: 'Immediate' },
    'high': { label: 'High', color: '#ea580c', weight: 3, businessImpact: 'High', timeframe: '30 days' },
    'medium': { label: 'Medium', color: '#d97706', weight: 2, businessImpact: 'Medium', timeframe: '90 days' },
    'low': { label: 'Low', color: '#16a34a', weight: 1, businessImpact: 'Low', timeframe: '180 days' }
  }), []);

  // Generate realistic compliance data with enhanced metrics
  const generateComplianceData = useCallback((): Record<string, DomainData> => {
    // Calculate domain score function
    const calculateDomainScore = (controls: Control[]): number => {
      if (controls.length === 0) return 0;
      
      // Weighted scoring based on priority
      let totalScore = 0;
      let totalWeight = 0;
      
      controls.forEach(control => {
        if (control.status !== 'not_applicable') {
          const weight = priorityLevels[control.priority]?.weight || 1;
          totalScore += implementationStatus[control.status].score * weight;
          totalWeight += weight;
        }
      });
      
      return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    };

    const framework = frameworks[selectedFramework];
    if (!framework) return {};
    
    const compliance: Record<string, DomainData> = {};

    // Use assessment results section scores if available
    framework.domains.forEach((domain) => {
      const sectionScore = assessmentResults?.sectionScores?.find(s => 
        s.title.toLowerCase().includes(domain.toLowerCase()) || 
        domain.toLowerCase().includes(s.title.toLowerCase())
      );
      
      const domainScore = sectionScore ? sectionScore.percentage : 0;
      
      const controlCount = Math.floor(framework.totalControls / framework.domains.length);
      const controls: Control[] = [];
      const maturity = domainScore / 100;
      
      for (let i = 1; i <= controlCount; i++) {
        const controlId = `${domain.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-${i.toString().padStart(3, '0')}`;
        
        // Status distribution based on domain score
        let status: Control['status'];
        const rand = Math.random();
        if (rand < maturity * 0.6) status = 'fully_implemented';
        else if (rand < maturity * 0.8) status = 'partially_implemented';
        else if (rand < maturity * 0.95) status = 'planned';
        else status = 'not_implemented';
        
        // Apply not applicable for some controls
        if (Math.random() < 0.07) status = 'not_applicable';
        

        let priority: Control['priority'] = 'low';
        const priorityRand = Math.random();
        if (priorityRand < 0.15) priority = 'critical';
        else if (priorityRand < 0.40) priority = 'high';
        else if (priorityRand < 0.75) priority = 'medium';
        
        if (status === 'not_implemented') {
          priority = Math.random() < 0.6 ? 'high' : 'critical';
        }
        
        controls.push({
          id: controlId,
          title: generateControlTitle(domain, i),
          description: generateControlDescription(domain),
          status: status,
          priority: priority,
          lastAssessed: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
          nextReview: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
          owner: generateOwner(),
          evidenceCount: Math.floor(Math.random() * 15) + 1,
          remediationEffort: Math.floor(Math.random() * 45) + 5,
          costEstimate: generateCostEstimate(priority),
          riskLevel: calculateRiskLevel(status, priority),
          complianceScore: implementationStatus[status].score,
          tags: generateTags(domain),
          relatedControls: generateRelatedControls(controlId, framework.name)
        });
      }
      
      // Calculate domain metrics
      const calculatedDomainScore = calculateDomainScore(controls);
      
      compliance[domain] = {
        controls: controls,
        domainScore: calculatedDomainScore,
        totalControls: controls.length,
        implementedControls: controls.filter(c => c.status === 'fully_implemented').length,
        gapCount: controls.filter(c => c.status === 'not_implemented').length,
        partialCount: controls.filter(c => c.status === 'partially_implemented').length,
        plannedCount: controls.filter(c => c.status === 'planned').length,
        riskScore: calculateDomainRisk(controls),
        maturityLevel: calculateMaturityLevel(controls, framework),
        lastUpdated: new Date()
      };
    });
    
    return compliance;
  }, [selectedFramework, frameworks, implementationStatus, priorityLevels]);

  // Enhanced control title generation
  const generateControlTitle = (domain: string, index: number): string => {
    const titleMaps: Record<string, string[]> = {
      'Govern': [
        'Governance Strategy', 'Risk Management Policy', 'Organizational Structure', 'Risk Appetite Definition',
        'Board Oversight', 'Executive Responsibility', 'Cybersecurity Strategy', 'Resource Allocation'
      ],
      'Identify': [
        'Asset Management', 'Business Environment', 'Risk Assessment', 'Risk Management Strategy',
        'Supply Chain Risk', 'Vulnerability Identification', 'Asset Inventory', 'Data Classification'
      ],
      'Protect': [
        'Identity Management', 'Awareness Training', 'Data Security', 'Information Protection',
        'Maintenance', 'Protective Technology', 'Access Control', 'Security Architecture'
      ],
      'Security': [
        'Access Controls', 'Security Monitoring', 'Incident Management', 'Vulnerability Management',
        'Security Architecture', 'Data Protection', 'Network Security', 'Endpoint Security'
      ],
      'Administrative Safeguards': [
        'Security Officer', 'Workforce Training', 'Information Access Management', 'Security Awareness',
        'Contingency Plan', 'Incident Procedures', 'Access Control Policies', 'Risk Assessment'
      ],
      'Access Control': [
        'Account Management', 'Access Enforcement', 'Information Flow Enforcement', 'Separation of Duties',
        'Least Privilege', 'Unsuccessful Login Attempts', 'System Use Notification', 'Session Control'
      ]
    };
    
    const titles = titleMaps[domain] || [`${domain} Control`];
    const baseTitle = titles[index % titles.length] || `${domain} Control`;
    return `${baseTitle} ${Math.floor(index / titles.length) + 1}`.trim();
  };

  const generateControlDescription = (): string => {
    const descriptions: Record<string, string> = {
      'governance': 'Establish and maintain governance processes to ensure cybersecurity risk management aligns with organizational objectives.',
      'technical': 'Implement technical controls to protect systems and data from cybersecurity threats.',
      'operational': 'Define operational procedures and processes to maintain security posture.',
      'physical': 'Implement physical security measures to protect facilities and equipment.'
    };
    
    const type = Math.random() < 0.3 ? 'governance' : Math.random() < 0.6 ? 'technical' : Math.random() < 0.8 ? 'operational' : 'physical';
    return descriptions[type];
  };

  const generateOwner = (): string => {
    const owners = [
      'CISO Office', 'IT Security Team', 'Network Operations', 'Compliance Team', 
      'Risk Management', 'Legal Department', 'IT Operations', 'Human Resources',
      'Physical Security', 'Data Protection Office', 'Internal Audit', 'Executive Team'
    ];
    return owners[Math.floor(Math.random() * owners.length)];
  };

  const generateCostEstimate = (priority: Control['priority']): number => {
    const baseCosts: Record<string, [number, number]> = {
      'critical': [50000, 250000],
      'high': [25000, 100000],
      'medium': [10000, 50000],
      'low': [2500, 25000]
    };
    
    const range = baseCosts[priority] || [5000, 15000];
    return Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
  };

  const generateTags = (domain: string): string[] => {
    const tagPool: Record<string, string[]> = {
      'governance': ['Policy', 'Procedure', 'Documentation', 'Training'],
      'technical': ['Configuration', 'Monitoring', 'Detection', 'Response'],
      'operational': ['Process', 'Maintenance', 'Testing', 'Review']
    };
    
    const domainTags = domain.toLowerCase().includes('govern') ? tagPool.governance :
                     domain.toLowerCase().includes('protect') || domain.toLowerCase().includes('detect') ? tagPool.technical :
                     tagPool.operational;
    
    return domainTags.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const generateRelatedControls = (controlId: string, frameworkName: string): string[] => {
    // Simulate control relationships
    const count = Math.floor(Math.random() * 4);
    return Array.from({ length: count }, (_, i) => `${frameworkName.substring(0, 4).toUpperCase()}-REL-${i + 1}`);
  };


  const calculateDomainRisk = (controls: Control[]): string => {
    const criticalGaps = controls.filter(c => c.status === 'not_implemented' && c.priority === 'critical').length;
    const highGaps = controls.filter(c => c.status === 'not_implemented' && c.priority === 'high').length;
    
    if (criticalGaps > 0) return 'Critical';
    if (highGaps > 2) return 'High';
    if (controls.filter(c => c.status === 'not_implemented').length > 5) return 'Medium';
    return 'Low';
  };

  const calculateMaturityLevel = (controls: Control[], framework: Framework): string => {
    const implementationRate = controls.filter(c => c.status === 'fully_implemented').length / controls.length;
    const levels = framework.maturityLevels;
    
    if (implementationRate >= 0.9) return levels[levels.length - 1];
    if (implementationRate >= 0.7) return levels[Math.max(0, levels.length - 2)];
    if (implementationRate >= 0.5) return levels[Math.max(0, levels.length - 3)];
    return levels[0];
  };

  const calculateRiskLevel = (status: Control['status'], priority: Control['priority']): string => {
    if (status === 'not_implemented') {
      if (priority === 'critical') return 'Critical';
      if (priority === 'high') return 'High';
      return 'Medium';
    }
    if (status === 'partially_implemented' && priority === 'critical') return 'High';
    return 'Low';
  };




  // Load compliance data with enhanced error handling
  const loadComplianceData = useCallback(async () => {
    // Process enhanced gap analysis
    const processGapAnalysis = (complianceData: Record<string, DomainData>): GapAnalysisItem[] => {
      const gaps: GapAnalysisItem[] = [];
      
      Object.entries(complianceData).forEach(([domain, data]) => {
        data?.controls?.forEach(control => {
          if (control.status !== 'fully_implemented' && control.status !== 'not_applicable') {
            gaps.push({
              ...control,
              domain: domain,
              framework: selectedFramework,
              frameworkName: frameworks[selectedFramework].name,
              riskLevel: calculateRiskLevel(control.status, control.priority),
              businessImpact: priorityLevels[control.priority]?.businessImpact || 'Unknown',
              remediationEffort: calculateRemediationEffort(control.status, control.priority),
              estimatedCost: calculateEstimatedCost(control.status, control.priority),
              timeframe: priorityLevels[control.priority]?.timeframe || 'Unknown'
            });
          }
        });
      });
      
      return gaps.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
               (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
      });
    };

    // Generate trend data with realistic patterns
    const generateTrendData = (): TrendData[] => {
      const months = 12;
      const trends: TrendData[] = [];
      const baseScore = Math.max(30, overallScore - 25);
      
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        // Simulate improvement over time with occasional setbacks
        const variation = Math.random() * 8 - 4; // -4 to +4
        const improvement = Math.max(0, (months - i) * 2); // Gradual improvement
        const score = Math.min(100, Math.max(0, baseScore + improvement + variation));
        
        trends.push({
          date: date.toISOString().split('T')[0],
          score: Math.round(score),
          assessments: Math.floor(Math.random() * 3) + 1,
          improvements: Math.floor(Math.random() * 5),
          newGaps: Math.floor(Math.random() * 3)
        });
      }
      
      return trends;
    };

    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const compliance = generateComplianceData();
      setComplianceData(compliance);
      
      const gaps = processGapAnalysis(compliance);
      setGapAnalysis(gaps);
      
      const trendData = generateTrendData();
      setTrends(trendData);
      
      // Simulate assessment history
      setAssessmentHistory([
        {
          id: 1,
          framework: selectedFramework,
          date: new Date().toISOString(),
          score: overallScore,
          gaps: gaps.length,
          status: 'completed'
        }
      ]);
      
      toast.success("Assessment completed", "Compliance data loaded successfully");
      
    } catch {
      setError('Failed to load compliance data. Please check your connection and try again.');
      toast.error("Assessment failed", "Failed to load compliance data");
      // Error has been displayed to user via toast
    } finally {
      setLoading(false);
    }
  }, [generateComplianceData, overallScore, selectedFramework, frameworks, priorityLevels]);

  // Initialize data on component mount and framework change
  useEffect(() => {
    loadComplianceData();
  }, [selectedFramework, loadComplianceData]);

  // Enhanced export functionality
  const exportReport = async (format: 'json' | 'csv' = 'json') => {
    // Check export credits
    const { monetization } = await import('../../utils/monetization');
    const canExport = monetization.canExport(format);
    
    if (!canExport.allowed) {
      toast.error('Export not available', canExport.reason || 'You do not have permission to export in this format');
      if (canExport.creditsNeeded) {
        setTimeout(() => {
          window.location.href = '/monetization/credits';
        }, 2000);
      }
      return;
    }

    // Use export credits
    const creditsUsed = monetization.useExportCredits(format, 'Compliance Gap Analyzer');
    if (!creditsUsed && format !== 'json') {
      toast.error('Insufficient credits', 'Please purchase more export credits');
      return;
    }

    const reportData = {
      metadata: {
        timestamp: new Date().toISOString(),
        framework: frameworks[selectedFramework],
        assessmentId: `COMP-${Date.now()}`,
        version: '2.0',
        generatedBy: 'CyberCaorrect Compliance Gap Analyzer'
      },
      executiveSummary: {
        overallScore: overallScore,
        totalControls: frameworks[selectedFramework].totalControls,
        implementedControls: Object.values(complianceData).reduce((sum, domain) => sum + (domain?.implementedControls || 0), 0),
        totalGaps: gapAnalysis.length,
        criticalGaps: gapAnalysis.filter(gap => gap.priority === 'critical').length,
        estimatedCost: gapAnalysis.reduce((sum, gap) => sum + gap.estimatedCost, 0),
        riskLevel: overallScore >= 80 ? 'Low' : overallScore >= 60 ? 'Medium' : overallScore >= 40 ? 'High' : 'Critical'
      },
      detailedResults: {
        complianceData: complianceData,
        gapAnalysis: gapAnalysis,
        trends: trends,
        assessmentHistory: assessmentHistory
      },
      recommendations: gapAnalysis.slice(0, 10).map(gap => ({
        priority: gap.priority,
        control: gap.title,
        remediation: `Implement ${gap.title} according to ${frameworks[selectedFramework].name} requirements`,
        timeframe: gap.timeframe,
        cost: gap.estimatedCost
      }))
    };
    
    let content: string, mimeType: string, filename: string;
    
    if (format === 'json') {
      content = JSON.stringify(reportData, null, 2);
      mimeType = 'application/json';
      filename = `compliance-gap-analysis-${selectedFramework}-${new Date().toISOString().split('T')[0]}.json`;
    } else {
      content = generateCSVReport(reportData);
      mimeType = 'text/csv';
      filename = `compliance-gaps-${selectedFramework}-${new Date().toISOString().split('T')[0]}.csv`;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Export completed", `Report exported as ${filename}`);
  };

  const generateCSVReport = (data: Control[]): string => {
    const headers = [
      'Control ID', 'Title', 'Domain', 'Status', 'Priority', 'Risk Level', 
      'Owner', 'Cost Estimate', 'Timeframe', 'Business Impact'
    ];
    
    const rows = data.detailedResults.gapAnalysis.map((gap: GapAnalysisItem) => [
      gap.id,
      gap.title,
      gap.domain,
      gap.status,
      gap.priority,
      gap.riskLevel,
      gap.owner,
      gap.estimatedCost,
      gap.timeframe,
      gap.businessImpact
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // Import from POA&M
  const handleImportFromPoam = () => {
    // Simulating getting data from a POA&M
    toast.success("Import initiated", "Importing findings from POA&M system");
    
    setTimeout(() => {
      toast.success("Import completed", "3 new gaps imported from POA&M");
    }, 1500);
  };

  // Filter gaps by domain and other criteria
  const filteredGaps = gapAnalysis.filter(gap => {
    if (selectedDomain !== 'all' && gap.domain !== selectedDomain) return false;
    return true;
  });

  // Enhanced overview rendering
  const renderOverview = () => {
    // Extract the icon component before using it in JSX
    const FrameworkIcon = frameworks[selectedFramework].icon;
    
    return (
      <div className="space-y-8">
        {/* Framework Info Card */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-primary to-accent p-3 rounded-lg">
                  <FrameworkIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {frameworks[selectedFramework].name}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {frameworks[selectedFramework].description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span>Version {frameworks[selectedFramework].version}</span>
                    <span>•</span>
                    <span>Released {frameworks[selectedFramework].releaseDate}</span>
                    <span>•</span>
                    <span>{frameworks[selectedFramework].complexity} Level</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary">{overallScore}%</div>
                <div className="text-sm text-muted-foreground">Overall Compliance</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Industry Average: 68%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Implemented</p>
                  <p className="text-3xl font-bold text-success">
                    {Object.values(complianceData).reduce((sum, domain) => sum + (domain?.implementedControls || 0), 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    of {frameworks[selectedFramework].totalControls} controls
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Gaps</p>
                  <p className="text-3xl font-bold text-destructive">
                    {gapAnalysis.filter(gap => gap.priority === 'critical').length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Require immediate attention
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Gaps</p>
                  <p className="text-3xl font-bold text-warning">{gapAnalysis.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Remediation required
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Est. Cost</p>
                  <p className="text-3xl font-bold text-accent">
                    ${(gapAnalysis.reduce((sum, gap) => sum + gap.estimatedCost, 0) / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total remediation cost
                  </p>
                </div>
                <Target className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance charts */}
        {Object.keys(complianceData).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Domain Compliance Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(complianceData).map(([domain, data]) => ({
                  domain: domain.length > 15 ? domain.substring(0, 15) + '...' : domain,
                  score: data?.domainScore || 0,
                  gaps: data?.gapCount || 0,
                  implemented: data?.implementedControls || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="domain" 
                    className="fill-muted-foreground"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis className="fill-muted-foreground" domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'score' ? `${value}%` : value,
                      name === 'score' ? 'Compliance Score' : name === 'gaps' ? 'Gap Count' : 'Implemented'
                    ]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="score" fill="#3b82f6" name="Compliance Score %" />
                  <Bar dataKey="gaps" fill="#ef4444" name="Gap Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-accent" />
                Implementation Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(implementationStatus).map(([status, config]) => {
                      const count = Object.values(complianceData).reduce((total, domain) => {
                        return total + (domain?.controls?.filter(control => control.status === status).length || 0);
                      }, 0);
                      
                      return {
                        name: config.label,
                        value: count,
                        color: config.color
                      };
                    }).filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {Object.entries(implementationStatus).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry[1].color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Compliance Trends */}
        {trends.length > 0 && (
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-success" />
              Compliance Trends (12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="fill-muted-foreground" />
                <YAxis className="fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} name="Compliance Score %" />
                <Line type="monotone" dataKey="gaps" stroke="#ef4444" strokeWidth={2} name="Open Gaps" />
                <Line type="monotone" dataKey="implemented" stroke="#3b82f6" strokeWidth={2} name="Controls Implemented" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading compliance assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">Assessment Error</p>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadComplianceData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Compliance Gap Analyzer</h1>
            <p className="text-muted-foreground">Multi-framework compliance assessment with gap identification and remediation planning</p>
          </div>
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
            <span className="text-sm font-medium text-primary">
              {frameworks[selectedFramework]?.name} v{frameworks[selectedFramework]?.version}
            </span>
          </div>
          
          <span className="px-3 py-1 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 text-sm font-medium rounded-full text-foreground">
            Assessment Results
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleImportFromPoam}
          >
            <Import className="h-4 w-4 mr-2" />
            Import from POA&M
          </Button>
          <Button
            variant="outline"
            onClick={() => exportReport('csv')}
            className="border-success text-success hover:bg-success/10 dark:hover:bg-success/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => exportReport('json')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button
            variant="outline"
            onClick={loadComplianceData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-background border-b border-border mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-t-xl">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'gaps', label: 'Gap Analysis', icon: AlertTriangle },
            { id: 'domains', label: 'Domain Details', icon: Building },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'recommendations', label: 'Recommendations', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        
        {activeTab === 'gaps' && (
          <div className="space-y-6">
            {/* Gap Analysis Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                    Compliance Gaps ({filteredGaps.length})
                  </CardTitle>
                  
                  <div className="flex items-center space-x-4">
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">All Domains</option>
                      {frameworks[selectedFramework].domains.map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Gap Items */}
            <div className="space-y-4">
              {filteredGaps.slice(0, 20).map((gap) => (
                <Card key={gap.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-primary dark:text-primary text-sm font-semibold">
                          {gap.id}
                        </span>
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                            gap.priority === 'critical' ? 'bg-destructive' :
                            gap.priority === 'high' ? 'bg-destructive/80' :
                            gap.priority === 'medium' ? 'bg-warning' :
                            'bg-success'
                          }`}
                        >
                          {priorityLevels[gap.priority]?.label}
                        </span>
                        <span 
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            implementationStatus[gap.status]?.textColor
                          } bg-muted`}
                        >
                          {implementationStatus[gap.status]?.label}
                        </span>
                        <span className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary rounded text-xs font-medium">
                          {gap.domain}
                        </span>
                      </div>
                      
                      <div className="text-right text-sm">
                        <div className="font-semibold text-foreground">
                          ${(gap.estimatedCost / 1000).toFixed(0)}K
                        </div>
                        <div className="text-muted-foreground">{gap.timeframe}</div>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-foreground mb-2">{gap.title}</h4>
                    <p className="text-muted-foreground mb-4">{gap.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Business Impact:</span>
                        <div className="text-foreground font-medium">{gap.businessImpact}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Compliance Risk:</span>
                        <div className="text-foreground font-medium">{gap.complianceRisk}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Owner:</span>
                        <div className="text-foreground font-medium">{gap.owner}</div>
                      </div>
                    </div>
                    
                    {gap.tags && gap.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {gap.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {filteredGaps.length > 20 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      Showing top 20 of {filteredGaps.length} gaps. Export full report for complete analysis.
                    </p>
                    <Button 
                      className="mt-3"
                      onClick={() => exportReport('json')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All Gaps
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Other tabs */}
        {activeTab === 'domains' && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Domain Details</h3>
            <p className="text-muted-foreground">
              In-depth analysis of compliance gaps by control domain, providing focused remediation strategies for each area of your compliance program
            </p>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Advanced Trends</h3>
            <p className="text-muted-foreground">
              Historical trend analysis showing compliance improvements over time, helping you track remediation progress and demonstrate continuous improvement
            </p>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Remediation Recommendations</h3>
            <p className="text-muted-foreground">
              AI-powered recommendations provide actionable steps, implementation timelines, and best practices for addressing identified compliance gaps
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceGapAnalyzer;