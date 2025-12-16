import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { toast } from '../../components/ui/Toaster';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  getDpias,
  exportToCSV,
  type DPIA,
} from '../../services/dpiaService';
import { 
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Edit,
  Download,
  BarChart3,
  AlertCircle,
  Info,
  ArrowLeft
} from 'lucide-react';
import { logError } from '../../utils/common/logger';

// Using DPIA type from dpiaService

// Progress bar component to avoid inline styles
const ProgressBar = ({ percentage, colorClass }: { percentage: number; colorClass: string }) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.setProperty('--progress-width', `${percentage}%`);
    }
  }, [percentage]);

  return (
    <div 
      ref={barRef}
      className={`h-2 rounded-full transition-all duration-300 progress-bar-fill ${colorClass}`}
    />
  );
};

const DpiaManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [dpias, setDpias] = useState<DPIA[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadDpias();
  }, []);

  const loadDpias = async () => {
    try {
      setLoading(true);
      const loaded = await getDpias();
      setDpias(loaded);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Error loading DPIAs'), { component: 'DpiaManager' });
      toast.error('Load failed', 'Failed to load DPIAs. Please refresh the page.');
      setDpias([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDpias = dpias.filter(dpia => {
    const matchesStatus = selectedStatus === 'all' || dpia.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || dpia.priority === selectedPriority;
    const matchesRisk = selectedRisk === 'all' || dpia.riskLevel === selectedRisk;
    return matchesStatus && matchesPriority && matchesRisk;
  });

  const getStatusBadge = (status: string) => {
    const className = 
      status === 'approved' ? 'bg-success/10 text-success' :
      status === 'review' ? 'bg-primary/10 text-primary' :
      status === 'in_progress' ? 'bg-warning/10 text-warning' :
      status === 'draft' ? 'bg-muted text-muted-foreground' :
      'bg-destructive/10 text-destructive';
    
    return <Badge className={className}>{status.replace('_', ' ')}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const className = 
      priority === 'critical' ? 'bg-destructive/10 text-destructive' :
      priority === 'high' ? 'bg-warning/10 text-warning' :
      priority === 'medium' ? 'bg-warning/10 text-warning' :
      'bg-success/10 text-success';
    
    return <Badge className={className}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>;
  };

  const getRiskBadge = (risk: string) => {
    const className = 
      risk === 'critical' ? 'bg-destructive/10 text-destructive' :
      risk === 'high' ? 'bg-warning/10 text-warning' :
      risk === 'medium' ? 'bg-warning/10 text-warning' :
      'bg-success/10 text-success';
    
    return <Badge className={className}>{risk.charAt(0).toUpperCase() + risk.slice(1)} Risk</Badge>;
  };

  // Calculate metrics
  const totalDpias = dpias.length;
  const completedDpias = dpias.filter(d => d.status === 'approved').length;
  const inProgressDpias = dpias.filter(d => d.status === 'in_progress' || d.status === 'review').length;
  const highRiskDpias = dpias.filter(d => d.riskLevel === 'high' || d.riskLevel === 'critical').length;

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
          reportId: `DPIA-${Date.now()}`,
          version: '1.0'
        },
        summary: {
          totalDpias,
          completedDpias,
          inProgressDpias,
          highRiskDpias
        },
        dpias
      };

      const creditsUsed = monetization.useExportCredits(format, 'DPIA Manager');
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
        a.download = `dpias-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'JSON report downloaded');
      } else if (format === 'csv') {
        const csv = exportToCSV(dpias);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dpias-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'CSV report downloaded');
      } else if (format === 'pdf') {
        const { generateDpiaManagerPdf } = await import('../../utils/pdf');
        const pdfReportData = {
          metadata: reportData.metadata,
          summary: reportData.summary,
          dpias: dpias.map(dpia => ({
            title: dpia.title,
            processingActivity: dpia.processingActivity,
            riskLevel: dpia.riskLevel,
            status: dpia.status,
            createdDate: dpia.createdDate,
            lastUpdated: dpia.lastUpdated || dpia.createdDate
          }))
        };
        generateDpiaManagerPdf(pdfReportData);
        toast.success('Export successful', 'PDF report downloaded');
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Export failed'), { component: 'DpiaManager', operation: 'export' });
      toast.error('Export failed', 'Please try again');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Breadcrumbs className="mb-6" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading DPIAs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Breadcrumbs className="mb-6" />
      
      <div className="page-header">
        <Link to="/toolkit" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Toolkit
        </Link>
        <h1 className="page-title">DPIA Manager</h1>
        <p className="page-description">
          Enhanced Data Protection Impact Assessment management with lifecycle tracking
        </p>
      </div>

      <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dpias">All DPIAs</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="guidance">Guidance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Key Metrics */}
          <div className="page-section">
            <h2 className="section-title">Overview</h2>
            <div className="responsive-grid-4">
              <Card className="modern-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-2xl font-bold">{totalDpias}</span>
                  </div>
                  <h3 className="font-semibold mb-1">Total DPIAs</h3>
                  <p className="text-sm text-muted-foreground">All assessments</p>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                    <span className="text-2xl font-bold text-success">
                      {completedDpias}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">Completed</h3>
                  <p className="text-sm text-muted-foreground">Approved assessments</p>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <Clock className="h-6 w-6 text-warning" />
                    </div>
                    <span className="text-2xl font-bold text-warning">
                      {inProgressDpias}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">In Progress</h3>
                  <p className="text-sm text-muted-foreground">Under review</p>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-destructive/10 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <span className="text-2xl font-bold text-destructive">
                      {highRiskDpias}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">High Risk</h3>
                  <p className="text-sm text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>
          </div>
          </div>

          {/* Risk Distribution */}
          <Card className="modern-card">
            <CardContent className="p-6">
              <h2 className="section-title flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Risk Level Distribution
              </h2>
              <div className="space-y-4">
                {['low', 'medium', 'high', 'critical'].map((risk) => {
                  const count = dpias.filter(d => d.riskLevel === risk).length;
                  const percentage = totalDpias > 0 ? Math.round((count / totalDpias) * 100) : 0;
                  
                  return (
                    <div key={risk} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getRiskBadge(risk)}
                          <span className="font-medium capitalize">{risk} Risk</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {count} DPIAs ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <ProgressBar 
                          percentage={percentage}
                          colorClass={
                            risk === 'critical' ? 'bg-destructive' :
                            risk === 'high' ? 'bg-warning' :
                            risk === 'medium' ? 'bg-warning' : 'bg-success'
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* High Priority DPIAs */}
          <Card>
            <CardContent className="p-6">
              <h2 className="section-title">High Priority DPIAs</h2>
              <div className="space-y-4">
                {dpias
                  .filter(d => d.priority === 'high' || d.priority === 'critical' || d.riskLevel === 'high' || d.riskLevel === 'critical')
                  .slice(0, 5)
                  .map((dpia) => (
                    <div key={dpia.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium">{dpia.title}</h3>
                            {getStatusBadge(dpia.status)}
                            {getPriorityBadge(dpia.priority)}
                            {getRiskBadge(dpia.riskLevel)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{dpia.description}</p>
                          <div className="text-sm text-muted-foreground">
                            Processing Activity: {dpia.processingActivity} • Due: {dpia.dueDate}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dpias" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="dpia-status-filter" className="sr-only">Filter by status</label>
                  <select
                    id="dpia-status-filter"
                    title="Filter DPIAs by status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    aria-label="Filter DPIAs by status"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dpia-priority-filter" className="sr-only">Filter by priority</label>
                  <select
                    id="dpia-priority-filter"
                    title="Filter DPIAs by priority"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    aria-label="Filter DPIAs by priority"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dpia-risk-filter" className="sr-only">Filter by risk level</label>
                  <select
                    id="dpia-risk-filter"
                    title="Filter DPIAs by risk level"
                    value={selectedRisk}
                    onChange={(e) => setSelectedRisk(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    aria-label="Filter DPIAs by risk level"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    New DPIA
                  </Button>
                  <Button variant="outline" onClick={() => exportReport('json')} disabled={isExporting}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DPIAs List */}
          <div className="space-y-4">
            {filteredDpias.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No DPIAs Found"
                description="Click 'New DPIA' to create your first Data Protection Impact Assessment."
                action={{
                  label: "Create First DPIA",
                  onClick: () => window.location.href = '/toolkit/dpia-generator',
                  icon: Plus
                }}
              />
            ) : (
              filteredDpias.map((dpia) => (
                <Card key={dpia.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{dpia.title}</h3>
                          {getStatusBadge(dpia.status)}
                          {getPriorityBadge(dpia.priority)}
                          {getRiskBadge(dpia.riskLevel)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{dpia.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">Processing Activity:</span>
                            <div className="text-muted-foreground">{dpia.processingActivity}</div>
                          </div>
                          <div>
                            <span className="font-medium">Assessor:</span>
                            <div className="text-muted-foreground">{dpia.assessor}</div>
                          </div>
                          <div>
                            <span className="font-medium">Due Date:</span>
                            <div className="text-muted-foreground">{dpia.dueDate}</div>
                          </div>
                        </div>

                        {dpia.dataTypes && dpia.dataTypes.length > 0 && (
                          <div className="mb-4">
                            <span className="font-medium text-sm">Data Types:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {dpia.dataTypes.map((type, index) => (
                                <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {dpia.risks && dpia.risks.length > 0 && (
                          <div className="mb-4">
                            <span className="font-medium text-sm">Identified Risks:</span>
                            <div className="space-y-2 mt-2">
                              {dpia.risks.slice(0, 3).map((risk, index) => (
                                <div key={index} className="text-xs bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded p-2">
                                  <div className="font-medium">{risk.type}</div>
                                  <div className="text-muted-foreground">{risk.description}</div>
                                  <div className="mt-1">
                                    <span className="font-medium">Likelihood: </span>
                                    <span className="capitalize">{risk.likelihood}</span>
                                    <span className="mx-2">•</span>
                                    <span className="font-medium">Impact: </span>
                                    <span className="capitalize">{risk.impact}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
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

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">DPIA Templates</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Standard DPIA Template', description: 'Comprehensive GDPR-compliant DPIA template', regulations: ['GDPR'] },
                  { name: 'High-Risk Processing Template', description: 'Template for high-risk data processing activities', regulations: ['GDPR'] },
                  { name: 'Automated Decision-Making Template', description: 'Specialized template for automated decision-making', regulations: ['GDPR'] },
                  { name: 'Biometric Data Template', description: 'Template for biometric data processing', regulations: ['GDPR', 'BIPA'] },
                  { name: 'Cross-Border Transfer Template', description: 'Template for international data transfers', regulations: ['GDPR'] },
                  { name: 'Large-Scale Processing Template', description: 'Template for large-scale data processing', regulations: ['GDPR'] }
                ].map((template, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.regulations.map(reg => (
                        <span key={reg} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {reg}
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">DPIA Checklist</h2>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Identify the need for a DPIA', description: 'Determine if processing is likely to result in high risk' },
                  { step: 2, title: 'Describe the processing', description: 'Document the nature, scope, context, and purposes of processing' },
                  { step: 3, title: 'Assess necessity and proportionality', description: 'Evaluate if processing is necessary and proportionate' },
                  { step: 4, title: 'Identify and assess risks', description: 'Identify risks to individuals and assess their likelihood and impact' },
                  { step: 5, title: 'Identify measures to address risks', description: 'Determine technical and organizational measures to mitigate risks' },
                  { step: 6, title: 'Consult stakeholders', description: 'Consult with DPO, data subjects, and other stakeholders' },
                  { step: 7, title: 'Document and approve', description: 'Document the DPIA and obtain necessary approvals' },
                  { step: 8, title: 'Review and update', description: 'Regularly review and update the DPIA as needed' }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidance" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">When is a DPIA Required?</h2>
              <div className="space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-primary mb-2">GDPR Article 35 Requirements</h3>
                      <p className="text-sm text-muted-foreground">
                        A DPIA is required when processing is likely to result in a high risk to the rights and freedoms of natural persons, 
                        particularly when using new technologies or processing special categories of data.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">High-Risk Processing Activities Include:</h3>
                  <ul className="space-y-2">
                    {[
                      'Systematic and extensive evaluation of personal aspects',
                      'Large-scale processing of special categories of data',
                      'Systematic monitoring of publicly accessible areas',
                      'Automated decision-making with legal or significant effects',
                      'Processing of children\'s data on a large scale',
                      'Cross-border transfers to countries without adequacy decisions'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-warning mb-2">Important Note</h3>
                      <p className="text-sm text-muted-foreground">
                        If a DPIA indicates that processing would result in a high risk in the absence of measures taken 
                        by the controller to mitigate the risk, the controller must consult the supervisory authority before processing.
                      </p>
                    </div>
                  </div>
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

export default DpiaManager;

