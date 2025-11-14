import React, { useState, useMemo, useEffect } from 'react';
// Error handling for missing Card components
let Card, CardContent, CardHeader, CardTitle, Button;
try {
  Card = require('../../components/ui/Card').default;
  CardContent = require('../../components/ui/CardContent').default;
  CardHeader = require('../../components/ui/CardHeader').default;
  CardTitle = require('../../components/ui/CardTitle').default;
  Button = require('../../components/ui/Button').default;
} catch (error) {
  console.warn('One or more UI component modules could not be found:', error);
  // Optionally, provide minimal fallback components for development so the rest of the code can still function
  Card = CardContent = CardHeader = CardTitle = Button = (props: any) => <div>{props.children}</div>;
}
import { 
  Eye, 
  ArrowLeft, 
  Download,
  BarChart3,
  AlertTriangle,
  Target,
  Loader2,
  // These imports are required for icons, routing, charts, and utilities.
  // If these modules are not available, make sure to install them:
  // npm install lucide-react react-router-dom recharts

  // Icon imports
  import { 
    Eye, 
    ArrowLeft, 
    Download,
    BarChart3,
    AlertTriangle,
    Target,
    Loader2,
    CheckCircle,
    FileCheck
  } from 'lucide-react';

  // Core routing and navigation from React Router
  import { Link, useLocation, useNavigate } from 'react-router-dom';

  // Visualization (bar chart)
  import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
  } from 'recharts';

  // UI utilities and PDF export
  import { toast } from '../../components/ui/Toaster';
  import { generatePrivacyGapAnalysisPdf } from '../../utils/generatePrivacyGapAnalysisPdf';
import { EmptyState } from '../../components/ui/EmptyState';
import { Tooltip as TooltipComponent } from '../../components/ui/Tooltip';
import { AssessmentFlowProgress } from '../../components/assessment/AssessmentFlowProgress';

interface AssessmentResults {
  overallScore?: number;
  sectionScores?: Array<{
    title: string;
    percentage: number;
    completed?: boolean;
  }>;
  frameworkName?: string;
  completedDate?: string;
}

const PrivacyGapAnalyzer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { assessmentResults, fromAssessment } = (location.state || {}) as { 
    assessmentResults?: AssessmentResults;
    fromAssessment?: boolean;
  };
  const [activeTab, setActiveTab] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);

  // Base privacy gaps - these are always shown
  const basePrivacyGaps = [
    {
      id: 'GAP-001',
      title: 'Data Processing Records Incomplete',
      description: 'Organization lacks comprehensive records of processing activities required under GDPR Article 30',
      regulation: 'GDPR',
      article: 'Article 30',
      priority: 'critical' as const,
      category: 'Documentation',
      effort: 'moderate',
      timeframe: 'immediate',
      impact: 'Regulatory non-compliance - potential GDPR fines',
      recommendation: 'Implement comprehensive data processing inventory system',
      framework: 'NIST Privacy Framework - ID.IM',
      nistSection: 'Identify'
    },
    {
      id: 'GAP-002', 
      title: 'Data Subject Rights Process Missing',
      description: 'No formal process for handling data subject requests (access, rectification, deletion)',
      regulation: 'GDPR',
      article: 'Articles 15-22',
      priority: 'critical' as const,
      category: 'Rights Management',
      effort: 'significant',
      timeframe: 'immediate',
      impact: 'Inability to fulfill data subject rights within required timeframes',
      recommendation: 'Implement data subject rights management system',
      framework: 'NIST Privacy Framework - CM.AW',
      nistSection: 'Communicate'
    },
    {
      id: 'GAP-003',
      title: 'Privacy by Design Not Implemented',
      description: 'New projects and systems do not incorporate privacy considerations from the design phase',
      regulation: 'GDPR',
      article: 'Article 25',
      priority: 'high' as const,
      category: 'Governance',
      effort: 'significant',
      timeframe: 'short-term',
      impact: 'Reactive privacy compliance approach increases risk of violations',
      recommendation: 'Establish privacy by design framework and procedures',
      framework: 'NIST Privacy Framework - GV.PO',
      nistSection: 'Govern'
    },
    {
      id: 'GAP-004',
      title: 'Consent Management Inadequate', 
      description: 'Current consent mechanisms do not meet GDPR requirements for specific, informed, and freely given consent',
      regulation: 'GDPR',
      article: 'Article 7',
      priority: 'high' as const,
      category: 'Consent',
      effort: 'moderate',
      timeframe: 'short-term',
      impact: 'Invalid consent could invalidate legal basis for processing',
      recommendation: 'Implement compliant consent management system',
      framework: 'NIST Privacy Framework - CM.PO',
      nistSection: 'Communicate'
    }
  ];

  // Generate gaps from assessment results
  const assessmentBasedGaps = useMemo(() => {
    if (!assessmentResults?.sectionScores) return [];
    
    const gaps: Array<typeof basePrivacyGaps[0] & { priority: 'critical' | 'high' | 'medium' | 'low' }> = [];
    const nistSectionMapping: Record<string, { 
      gaps: Array<{ id: string; title: string; description: string; framework: string; article: string; category: string }>;
      threshold: number;
    }> = {
      'Identify': {
        gaps: [
          {
            id: 'GAP-ID-001',
            title: 'Incomplete Data Processing Inventory',
            description: 'Data processing activities and systems are not fully inventoried and mapped',
            framework: 'NIST Privacy Framework - ID.IM-P1',
            article: 'GDPR Article 30',
            category: 'Documentation'
          },
          {
            id: 'GAP-ID-002',
            title: 'Insufficient Privacy Risk Assessment',
            description: 'Privacy risk assessments are not conducted systematically for all processing activities',
            framework: 'NIST Privacy Framework - ID.RA-P',
            article: 'GDPR Article 35',
            category: 'Risk Assessment'
          }
        ],
        threshold: 70
      },
      'Govern': {
        gaps: [
          {
            id: 'GAP-GV-001',
            title: 'Privacy Policies and Procedures Incomplete',
            description: 'Privacy policies and procedures are not fully documented or implemented',
            framework: 'NIST Privacy Framework - GV.PO-P',
            article: 'GDPR Article 24',
            category: 'Governance'
          },
          {
            id: 'GAP-GV-002',
            title: 'Privacy Roles and Responsibilities Unclear',
            description: 'Privacy roles and responsibilities are not clearly defined across the organization',
            framework: 'NIST Privacy Framework - GV.RR-P',
            article: 'GDPR Article 37',
            category: 'Governance'
          }
        ],
        threshold: 75
      },
      'Control': {
        gaps: [
          {
            id: 'GAP-CT-001',
            title: 'Data Minimization Not Implemented',
            description: 'Data minimization practices are not consistently applied across processing activities',
            framework: 'NIST Privacy Framework - CT.DM-P',
            article: 'GDPR Article 5(1)(c)',
            category: 'Data Processing'
          },
          {
            id: 'GAP-CT-002',
            title: 'Access Controls Insufficient',
            description: 'Access controls for systems containing personal data need strengthening',
            framework: 'NIST Privacy Framework - CT.AC-P',
            article: 'GDPR Article 32',
            category: 'Security'
          }
        ],
        threshold: 70
      },
      'Communicate': {
        gaps: [
          {
            id: 'GAP-CM-001',
            title: 'Privacy Notices Inadequate',
            description: 'Privacy notices do not fully meet regulatory requirements for transparency',
            framework: 'NIST Privacy Framework - CM.PO-P',
            article: 'GDPR Article 13-14',
            category: 'Transparency'
          },
          {
            id: 'GAP-CM-002',
            title: 'Data Subject Rights Process Gaps',
            description: 'Processes for handling data subject access, rectification, and deletion requests need improvement',
            framework: 'NIST Privacy Framework - CM.AW-P',
            article: 'GDPR Articles 15-22',
            category: 'Rights Management'
          }
        ],
        threshold: 70
      },
      'Protect': {
        gaps: [
          {
            id: 'GAP-PR-001',
            title: 'Data Protection Measures Insufficient',
            description: 'Security measures to protect personal data need enhancement',
            framework: 'NIST Privacy Framework - PR.DS-P',
            article: 'GDPR Article 32',
            category: 'Security'
          },
          {
            id: 'GAP-PR-002',
            title: 'Breach Response Procedures Incomplete',
            description: 'Procedures for detecting and responding to personal data breaches need improvement',
            framework: 'NIST Privacy Framework - PR.AC-P4',
            article: 'GDPR Article 33-34',
            category: 'Incident Response'
          }
        ],
        threshold: 65
      }
    };

    assessmentResults.sectionScores.forEach(section => {
      const sectionData = nistSectionMapping[section.title];
      if (sectionData && section.percentage < sectionData.threshold) {
        sectionData.gaps.forEach(gap => {
          const priority = section.percentage < 50 ? 'critical' as const : 
                          section.percentage < 65 ? 'high' as const : 'medium' as const;
          gaps.push({
            ...gap,
            priority: priority as 'critical' | 'high' | 'medium' | 'low',
            effort: priority === 'critical' ? 'significant' : priority === 'high' ? 'moderate' : 'low',
            timeframe: priority === 'critical' ? 'immediate' : priority === 'high' ? 'short-term' : 'medium-term',
            impact: `Low compliance score (${section.percentage}%) in ${section.title} section indicates gaps in ${gap.category}`,
            recommendation: `Improve ${section.title} section compliance to address ${gap.title}`,
            nistSection: section.title
          } as typeof basePrivacyGaps[0] & { priority: 'critical' | 'high' | 'medium' | 'low' });
        });
      }
    });

    return gaps;
  }, [assessmentResults]);

  // Combine base gaps with assessment-based gaps, removing duplicates
  const privacyGaps = useMemo(() => {
    const combined = [...basePrivacyGaps];
    const existingIds = new Set(basePrivacyGaps.map(g => g.id));
    
    assessmentBasedGaps.forEach(gap => {
      if (!existingIds.has(gap.id)) {
        combined.push(gap);
        existingIds.add(gap.id);
      }
    });
    
    return combined;
  }, [assessmentBasedGaps]);

  // Update compliance data based on assessment results
  const complianceData = useMemo(() => {
    const baseData = [
      { framework: 'NIST Privacy Framework', score: assessmentResults?.overallScore || 68, gaps: privacyGaps.filter(g => g.framework.includes('NIST')).length },
      { framework: 'GDPR', score: 55, gaps: privacyGaps.filter(g => g.regulation === 'GDPR').length },
      { framework: 'CCPA', score: 72, gaps: 8 },
      { framework: 'LGPD', score: 62, gaps: 10 },
      { framework: 'PIPEDA', score: 78, gaps: 5 }
    ];
    
    // If we have assessment results, update NIST score
    if (assessmentResults?.overallScore) {
      baseData[0].score = assessmentResults.overallScore;
    }
    
    return baseData;
  }, [assessmentResults, privacyGaps]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-destructive bg-destructive/10';
      case 'high': return 'text-warning bg-warning/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  // Show welcome message when coming from assessment
  useEffect(() => {
    if (fromAssessment && assessmentResults) {
      toast.success(
        'Assessment Integrated',
        'Your NIST Privacy Framework assessment results have been integrated into the gap analysis'
      );
    }
  }, [fromAssessment, assessmentResults]);

  const handleExportAnalysis = async () => {
    setIsExporting(true);
    try {
      // Show progress toast
      toast.info('Generating PDF', 'Please wait while we generate your gap analysis report...');
      
      const overallScore = assessmentResults?.overallScore || 
        Math.round(complianceData.reduce((sum, f) => sum + f.score, 0) / complianceData.length);
      
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      generatePrivacyGapAnalysisPdf({
        metadata: {
          title: 'Privacy Gap Analysis Report',
          timestamp: new Date().toISOString(),
          reportId: `PGA-${Date.now()}`,
          version: '1.0',
          generatedBy: 'CyberCorrect Privacy Platform'
        },
        executiveSummary: {
          overallScore,
          totalGaps: privacyGaps.length,
          criticalGaps: privacyGaps.filter(gap => gap.priority === 'critical').length,
          highGaps: privacyGaps.filter(gap => gap.priority === 'high').length,
          mediumGaps: privacyGaps.filter(gap => (gap as any).priority === 'medium').length,
          frameworksAssessed: complianceData.length,
          assessmentDate: assessmentResults?.completedDate || new Date().toLocaleDateString(),
          frameworkName: assessmentResults?.frameworkName || 'NIST Privacy Framework'
        },
        complianceData: complianceData.map(f => ({
          framework: f.framework,
          score: f.score,
          gaps: f.gaps
        })),
        gapAnalysis: privacyGaps.map(gap => ({
          id: gap.id,
          title: gap.title,
          description: gap.description,
          priority: gap.priority,
          category: gap.category,
          regulation: gap.regulation,
          article: gap.article,
          framework: gap.framework,
          effort: gap.effort,
          timeframe: gap.timeframe,
          impact: gap.impact,
          recommendation: gap.recommendation,
          nistSection: (gap as any).nistSection || ''
        })),
        assessmentResults: assessmentResults ? {
          overallScore: assessmentResults.overallScore || 0,
          sectionScores: assessmentResults.sectionScores || [],
          frameworkName: assessmentResults.frameworkName || 'NIST Privacy Framework',
          completedDate: assessmentResults.completedDate || new Date().toLocaleDateString()
        } : undefined
      });

      // Success with details
      toast.success(
        'PDF Exported Successfully',
        `Your gap analysis report has been downloaded. It includes ${privacyGaps.length} gaps and ${complianceData.length} framework assessments.`
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Export Failed', 'Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {assessmentResults && (
        <AssessmentFlowProgress 
          currentStep="gap-analysis" 
          assessmentResults={assessmentResults}
        />
      )}
      <div className="mb-6">
        <Link to="/toolkit" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Toolkit
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Privacy Gap Analyzer</h1>
            <p className="text-muted-foreground">
              Multi-framework privacy compliance assessment and gap identification
            </p>
          </div>
          <Button onClick={handleExportAnalysis} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'gaps', label: 'Gap Analysis', icon: AlertTriangle },
            { id: 'recommendations', label: 'Recommendations', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Assessment Integration Banner */}
      {assessmentResults && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">
                Assessment Results Integrated
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Your NIST Privacy Framework Assessment (completed on {assessmentResults.completedDate || 'recently'}) 
                has been integrated into this gap analysis. {assessmentBasedGaps.length} additional gaps 
                were identified based on your assessment responses.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/privacy-results', { state: { assessmentResults } })}
              >
                View Full Results
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State for No Assessment */}
      {!assessmentResults && privacyGaps.length === basePrivacyGaps.length && (
        <EmptyState
          icon={Eye}
          title="No Assessment Data"
          description="Complete a NIST Privacy Framework Assessment to see integrated gap analysis results. The assessment will automatically identify compliance gaps based on your responses."
          action={{
            label: 'Start Assessment',
            onClick: () => navigate('/assessments/privacy-assessment'),
            icon: FileCheck
          }}
          secondaryAction={{
            label: 'View Base Analysis',
            onClick: () => setActiveTab('overview')
          }}
          className="mb-6"
        />
      )}

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {assessmentResults && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-primary" />
                  NIST Privacy Framework Assessment Results
                  <TooltipComponent
                    content="These scores are from your completed NIST Privacy Framework Assessment. Gaps are automatically identified for sections scoring below the threshold."
                    className="ml-2"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    This gap analysis is based on your NIST Privacy Framework Assessment completed on{' '}
                    {assessmentResults.completedDate || 'recently'}.
                  </p>
                  {assessmentResults.sectionScores && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {assessmentResults.sectionScores.map((section, index) => (
                        <div key={index} className="text-center p-3 bg-card rounded border">
                          <div className="text-lg font-semibold text-foreground">{section.title}</div>
                          <div className={`text-2xl font-bold mt-1 ${
                            section.percentage >= 80 ? 'text-success' :
                            section.percentage >= 60 ? 'text-warning' : 'text-destructive'
                          }`}>
                            {section.percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-primary" />
                Privacy Compliance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {assessmentResults?.overallScore || 
                      Math.round(complianceData.reduce((sum, f) => sum + f.score, 0) / complianceData.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-destructive">{privacyGaps.length}</div>
                  <div className="text-sm text-muted-foreground">Total Gaps</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning">
                    {privacyGaps.filter(gap => gap.priority === 'critical').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Critical Gaps</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{complianceData.length}</div>
                  <div className="text-sm text-muted-foreground">Frameworks</div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="framework" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3b82f6" name="Compliance Score %" />
                  <Bar dataKey="gaps" fill="#ef4444" name="Gap Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'gaps' && (
        <div className="space-y-4">
          {privacyGaps.map(gap => (
            <Card key={gap.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-primary text-sm font-semibold">{gap.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(gap.priority)}`}>
                      {gap.priority.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {gap.regulation}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{gap.timeframe}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">{gap.title}</h3>
                <p className="text-muted-foreground mb-4">{gap.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Article/Section:</span>
                    <div className="font-medium">{gap.article}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">NIST Framework:</span>
                    <div className="font-medium">{gap.framework}</div>
                    {(gap as any).nistSection && (
                      <div className="text-xs text-primary mt-1">
                        Section: {(gap as any).nistSection}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <div className="font-medium">{gap.category}</div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-muted/30 rounded">
                  <h4 className="font-medium mb-1">Recommendation</h4>
                  <p className="text-sm text-muted-foreground">{gap.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Privacy Recommendations</h3>
          <p className="text-muted-foreground mb-4">
            Access your personalized privacy remediation recommendations based on your gap analysis results
          </p>
          <Link to="/privacy-recommendations">
            <Button>
              View Privacy Recommendations
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PrivacyGapAnalyzer;