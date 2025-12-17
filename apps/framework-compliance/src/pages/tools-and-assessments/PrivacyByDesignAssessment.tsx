import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useJourneyTool } from '../../hooks/useJourneyTool';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { toast } from '../../components/ui/Toaster';
import { storageAdapter } from '../../utils/storage';
import { 
  Shield,
  CheckCircle,
  Plus,
  Eye,
  Edit,
  Download,
  BarChart3,
  Target,
  Award
} from 'lucide-react';

interface PrivacyByDesignAssessment {
  id: string;
  name: string;
  description: string;
  systemType: 'new_system' | 'existing_system' | 'process' | 'service';
  status: 'draft' | 'in_progress' | 'completed' | 'needs_review';
  assessmentDate: string;
  assessor: string;
  overallScore: number;
  principles: {
    proactive: { score: number; notes: string; };
    default: { score: number; notes: string; };
    embedded: { score: number; notes: string; };
    full: { score: number; notes: string; };
    end_to_end: { score: number; notes: string; };
    visibility: { score: number; notes: string; };
    respect: { score: number; notes: string; };
  };
  recommendations: string[];
  nextReviewDate: string;
  complianceStatus: 'compliant' | 'needs_improvement' | 'non_compliant';
}

const PrivacyByDesignAssessment = () => {
  // Journey tracking - automatically marks tool as started on mount
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { markCompleted } = useJourneyTool('privacy-by-design-assessment');
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCompliance, setSelectedCompliance] = useState('all');
  const [assessments, setAssessments] = useState<PrivacyByDesignAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const privacyPrinciples = [
    {
      id: 'proactive',
      name: 'Proactive not Reactive',
      description: 'Anticipate and prevent privacy-invasive events before they happen',
      weight: 15
    },
    {
      id: 'default',
      name: 'Privacy as the Default',
      description: 'Ensure that personal data is automatically protected in any given IT system or business practice',
      weight: 20
    },
    {
      id: 'embedded',
      name: 'Privacy Embedded into Design',
      description: 'Privacy is built into the system architecture and design',
      weight: 15
    },
    {
      id: 'full',
      name: 'Full Functionality',
      description: 'Ensure that all legitimate interests and objectives are met',
      weight: 10
    },
    {
      id: 'end_to_end',
      name: 'End-to-End Security',
      description: 'Ensure complete lifecycle protection of personal data',
      weight: 15
    },
    {
      id: 'visibility',
      name: 'Visibility and Transparency',
      description: 'Ensure that all stakeholders can verify compliance',
      weight: 15
    },
    {
      id: 'respect',
      name: 'Respect for User Privacy',
      description: 'Keep the interests of the individual paramount',
      weight: 10
    }
  ];

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = () => {
    try {
      setLoading(true);
      const loaded = storageAdapter.getPrivacyByDesignAssessments();
      setAssessments(Array.isArray(loaded) ? loaded : []);
    } catch (error) {
      console.error('Error loading assessments:', error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  // Unused for now but kept for future functionality
  // const saveAssessments = (updated: PrivacyByDesignAssessment[]) => {
  //   storageAdapter.setPrivacyByDesignAssessments(updated);
  //   setAssessments(updated);
  // };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesStatus = selectedStatus === 'all' || assessment.status === selectedStatus;
    const matchesCompliance = selectedCompliance === 'all' || assessment.complianceStatus === selectedCompliance;
    return matchesStatus && matchesCompliance;
  });

  const getStatusBadge = (status: string) => {
    const className = 
      status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
      status === 'in_progress' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
      status === 'needs_review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    
    return <Badge className={className}>{status.replace('_', ' ')}</Badge>;
  };

  const getComplianceBadge = (status: string) => {
    const className = 
      status === 'compliant' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
      status === 'needs_improvement' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    
    return <Badge className={className}>{status.replace('_', ' ')}</Badge>;
  };

  // Calculate metrics
  const totalAssessments = assessments.length;
  const completedAssessments = assessments.filter(a => a.status === 'completed').length;
  const compliantAssessments = assessments.filter(a => a.complianceStatus === 'compliant').length;
  const averageScore = assessments.length > 0 
    ? Math.round(assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length)
    : 0;

  const exportReport = async (format: 'json' | 'csv' | 'pdf') => {
    const { monetization } = await import('../../utils/monetization');
    const canExport = monetization.canExport(format);
    
    if (!canExport.allowed) {
      toast.error('Export not available', canExport.reason || 'You do not have permission to export in this format');
      return;
    }

    setIsExporting(true);
    try {
      const reportData = {
        metadata: {
          timestamp: new Date().toISOString(),
          reportId: `PBD-${Date.now()}`,
          version: '1.0'
        },
        summary: {
          totalAssessments,
          completedAssessments,
          compliantAssessments,
          averageScore
        },
        assessments
      };

      const creditsUsed = monetization.useExportCredits(format, 'Privacy by Design Assessment');
      if (!creditsUsed && format !== 'json') {
        toast.error('Insufficient credits', 'Please purchase more export credits');
        setIsExporting(false);
        return;
      }

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `privacy-by-design-assessments-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'JSON report downloaded');
      } else if (format === 'csv') {
        const csvRows: string[] = [];
        csvRows.push('Name,Description,System Type,Status,Compliance Status,Overall Score,Assessment Date');
        
        assessments.forEach(assessment => {
          csvRows.push([
            assessment.name,
            assessment.description,
            assessment.systemType,
            assessment.status,
            assessment.complianceStatus,
            assessment.overallScore.toString(),
            assessment.assessmentDate
          ].join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `privacy-by-design-assessments-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'CSV report downloaded');
      } else if (format === 'pdf') {
        const { generatePrivacyByDesignPdf } = await import('../../utils/pdf');
        generatePrivacyByDesignPdf(reportData);
        toast.success('Export successful', 'PDF report downloaded');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', 'Please try again');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading assessments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Privacy by Design Assessment</h1>
        <p className="text-muted-foreground">
          Evaluate systems and processes against the 7 Privacy by Design principles
        </p>
      </div>

      <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="principles">Principles</TabsTrigger>
          <TabsTrigger value="guidance">Guidance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-2xl font-bold">{totalAssessments}</span>
                </div>
                <h3 className="font-semibold mb-1">Total Assessments</h3>
                <p className="text-sm text-muted-foreground">All assessments</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {completedAssessments}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Completed</h3>
                <p className="text-sm text-muted-foreground">Finished assessments</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {compliantAssessments}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Compliant</h3>
                <p className="text-sm text-muted-foreground">Meeting requirements</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {averageScore}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Average Score</h3>
                <p className="text-sm text-muted-foreground">Out of 100</p>
              </CardContent>
            </Card>
          </div>

          {/* Principles Overview */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-500" />
                Principles Overview
              </h2>
              <div className="space-y-4">
                {privacyPrinciples.map((principle) => {
                  const principleScores = assessments
                    .filter(a => a.principles[principle.id as keyof typeof assessments[0]['principles']])
                    .map(a => a.principles[principle.id as keyof typeof a.principles].score);
                  const avgScore = principleScores.length > 0
                    ? Math.round(principleScores.reduce((sum, s) => sum + s, 0) / principleScores.length)
                    : 0;
                  const progressStyle = { width: `${avgScore}%` };
                  
                  return (
                    <div key={principle.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="info" className="capitalize">
                            {principle.name}
                          </Badge>
                          <span className="font-medium">{principle.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Avg Score: {avgScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        {/* Dynamic width for progress bar */}
                        {/* eslint-disable-next-line react/forbid-dom-props */}
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          data-score={avgScore}
                          style={progressStyle}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{principle.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="pbd-status-filter" className="sr-only">Filter by status</label>
                  <select
                    id="pbd-status-filter"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    aria-label="Filter assessments by status"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="needs_review">Needs Review</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="pbd-compliance-filter" className="sr-only">Filter by compliance status</label>
                  <select
                    id="pbd-compliance-filter"
                    value={selectedCompliance}
                    onChange={(e) => setSelectedCompliance(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    aria-label="Filter assessments by compliance status"
                  >
                    <option value="all">All Compliance</option>
                    <option value="compliant">Compliant</option>
                    <option value="needs_improvement">Needs Improvement</option>
                    <option value="non_compliant">Non-Compliant</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    New Assessment
                  </Button>
                  <Button variant="outline" onClick={() => exportReport('json')} disabled={isExporting}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessments List */}
          <div className="space-y-4">
            {filteredAssessments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No assessments found. Click "New Assessment" to create your first assessment.
                </CardContent>
              </Card>
            ) : (
              filteredAssessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{assessment.name}</h3>
                          {getStatusBadge(assessment.status)}
                          {getComplianceBadge(assessment.complianceStatus)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{assessment.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">System Type:</span>
                            <div className="text-muted-foreground capitalize">{assessment.systemType.replace('_', ' ')}</div>
                          </div>
                          <div>
                            <span className="font-medium">Overall Score:</span>
                            <div className="text-muted-foreground">{assessment.overallScore}/100</div>
                          </div>
                          <div>
                            <span className="font-medium">Assessment Date:</span>
                            <div className="text-muted-foreground">{assessment.assessmentDate}</div>
                          </div>
                        </div>

                        {/* Principles Scores */}
                        <div className="mb-4">
                          <span className="font-medium text-sm">Principle Scores:</span>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                            {privacyPrinciples.map((principle) => {
                              const score = assessment.principles[principle.id as keyof typeof assessment.principles].score;
                              return (
                                <div key={principle.id} className="text-xs">
                                  <div className="font-medium">{principle.name.split(' ')[0]}:</div>
                                  <div className="text-muted-foreground">{score}/100</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {assessment.recommendations && assessment.recommendations.length > 0 && (
                          <div className="mb-4">
                            <span className="font-medium text-sm">Recommendations:</span>
                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                              {assessment.recommendations.slice(0, 3).map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="principles" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">The 7 Privacy by Design Principles</h2>
              <div className="space-y-6">
                {privacyPrinciples.map((principle, index) => (
                  <div key={principle.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{principle.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{principle.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Weight: {principle.weight}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidance" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Privacy by Design Implementation Guidance</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">What is Privacy by Design?</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    Privacy by Design is a framework that promotes privacy and data protection compliance from the start. 
                    It requires that privacy be built into the design and architecture of IT systems and business practices, 
                    not bolted on as an afterthought.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Key Benefits:</h3>
                  <ul className="space-y-2">
                    {[
                      'Reduces privacy risks before they occur',
                      'Ensures compliance with GDPR Article 25',
                      'Builds trust with data subjects',
                      'Reduces costs of privacy incidents',
                      'Improves overall data protection posture'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <h3 className="font-medium text-amber-900 dark:text-amber-300 mb-2">GDPR Article 25 Requirements</h3>
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    GDPR Article 25 requires data controllers to implement appropriate technical and organizational measures 
                    both at the time of determining the means for processing and at the time of processing itself, 
                    designed to implement data protection principles effectively and to integrate necessary safeguards.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default PrivacyByDesignAssessment;

