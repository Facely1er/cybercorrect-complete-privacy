import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { toast } from '../../components/ui/Toaster';
import { storageAdapter } from '../../utils/storage';
import { EmptyState } from '../../components/ui/EmptyState';
import { 
  FileText,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Download,
  BarChart3,
  Building,
  Award
} from 'lucide-react';

interface ServiceProvider {
  id: string;
  name: string;
  description: string;
  category: 'cloud' | 'analytics' | 'marketing' | 'payment' | 'communication' | 'security' | 'other';
  status: 'active' | 'pending' | 'expired' | 'terminated' | 'under_review';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dataTypes: string[];
  dataVolume: 'low' | 'medium' | 'high';
  dataSensitivity: 'low' | 'medium' | 'high' | 'critical';
  contactInfo: {
    primary: string;
    email: string;
    phone: string;
    address: string;
  };
  agreement: {
    type: 'DPA' | 'BAA' | 'SLA' | 'MSA' | 'Custom';
    status: 'draft' | 'under_review' | 'approved' | 'expired' | 'terminated';
    startDate: string;
    endDate: string;
    renewalDate: string;
    lastReview: string;
    nextReview: string;
    version: string;
    documentUrl: string;
  };
  compliance: {
    gdpr: boolean;
    ccpa: boolean;
    hipaa: boolean;
    ferpa: boolean;
    sox: boolean;
    pci: boolean;
    iso27001: boolean;
    soc2: boolean;
  };
  security: {
    encryption: boolean;
    accessControls: boolean;
    auditLogging: boolean;
    dataResidency: string;
    breachNotification: boolean;
    incidentResponse: boolean;
    regularAudits: boolean;
    certifications: string[];
  };
  dataProcessing: {
    purposes: string[];
    legalBasis: string[];
    retentionPeriod: string;
    dataMinimization: boolean;
    purposeLimitation: boolean;
    dataSubjectRights: boolean;
    crossBorderTransfers: boolean;
    adequacyDecision: boolean;
    transferMechanisms: string[];
  };
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    dataBreachRisk: 'low' | 'medium' | 'high' | 'critical';
    complianceRisk: 'low' | 'medium' | 'high' | 'critical';
    operationalRisk: 'low' | 'medium' | 'high' | 'critical';
    lastAssessment: string;
    nextAssessment: string;
  };
  monitoring: {
    lastAudit: string;
    nextAudit: string;
    auditFindings: number;
    resolvedFindings: number;
    complianceScore: number;
    performanceScore: number;
  };
  incidents: {
    total: number;
    resolved: number;
    open: number;
    lastIncident: string;
  };
  costs: {
    monthly: number;
    annual: number;
    setup: number;
    termination: number;
  };
  notes: string;
  createdDate: string;
  createdBy: string;
  lastUpdated: string;
  updatedBy: string;
}

const ServiceProviderManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadServiceProviders();
  }, []);

  const loadServiceProviders = () => {
    try {
      setLoading(true);
      const loaded = storageAdapter.getServiceProviders();
      setServiceProviders(Array.isArray(loaded) ? loaded : []);
    } catch (error) {
      console.error('Error loading service providers:', error);
      setServiceProviders([]);
    } finally {
      setLoading(false);
    }
  };

  // Unused for now but kept for future functionality
  // const saveServiceProviders = (updated: ServiceProvider[]) => {
  //   storageAdapter.setServiceProviders(updated);
  //   setServiceProviders(updated);
  // };

  const filteredProviders = serviceProviders.filter(provider => {
    const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || provider.status === selectedStatus;
    const matchesRisk = selectedRisk === 'all' || provider.riskAssessment.overallRisk === selectedRisk;
    return matchesCategory && matchesStatus && matchesRisk;
  });

  const getStatusBadge = (status: string) => {
    const className = 
      status === 'active' ? 'bg-success/10 text-success' :
      status === 'pending' ? 'bg-warning/10 text-warning' :
      status === 'expired' ? 'bg-destructive/10 text-destructive' :
      status === 'terminated' ? 'bg-muted text-muted-foreground' :
      'bg-primary/10 text-primary';
    
    return <Badge className={className}>{status.replace('_', ' ')}</Badge>;
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
  const totalProviders = serviceProviders.length;
  const activeProviders = serviceProviders.filter(p => p.status === 'active').length;
  const highRiskProviders = serviceProviders.filter(p => p.riskAssessment.overallRisk === 'high' || p.riskAssessment.overallRisk === 'critical').length;
  const averageComplianceScore = serviceProviders.length > 0
    ? Math.round(serviceProviders.reduce((sum, p) => sum + p.monitoring.complianceScore, 0) / serviceProviders.length)
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
          reportId: `SERVICE-${Date.now()}`,
          version: '1.0'
        },
        summary: {
          totalProviders,
          activeProviders,
          highRiskProviders,
          averageComplianceScore
        },
        providers: serviceProviders
      };

      const creditsUsed = monetization.useExportCredits(format, 'Service Provider Manager');
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
        a.download = `service-providers-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'JSON report downloaded');
      } else if (format === 'csv') {
        const csvRows: string[] = [];
        csvRows.push('Name,Category,Status,Overall Risk,Compliance Score,Agreement Type,Agreement Status');
        
        serviceProviders.forEach(provider => {
          csvRows.push([
            provider.name,
            provider.category,
            provider.status,
            provider.riskAssessment.overallRisk,
            provider.monitoring.complianceScore.toString(),
            provider.agreement.type,
            provider.agreement.status
          ].join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `service-providers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'CSV report downloaded');
      } else if (format === 'pdf') {
        const { generateServiceProviderPdf } = await import('../../utils/pdf');
        generateServiceProviderPdf(reportData);
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
            <p className="text-muted-foreground">Loading service providers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Service Provider Manager</h1>
        <p className="text-muted-foreground">
          Comprehensive processor and service provider management with agreement tracking
        </p>
      </div>

      <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-2xl font-bold">{totalProviders}</span>
                </div>
                <h3 className="font-semibold mb-1">Total Providers</h3>
                <p className="text-sm text-muted-foreground">All service providers</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <span className="text-2xl font-bold text-success">
                    {activeProviders}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Active</h3>
                <p className="text-sm text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <span className="text-2xl font-bold text-destructive">
                    {highRiskProviders}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">High Risk</h3>
                <p className="text-sm text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <span className="text-2xl font-bold text-accent">
                    {averageComplianceScore}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Avg Compliance</h3>
                <p className="text-sm text-muted-foreground">Out of 100</p>
              </CardContent>
            </Card>
          </div>

          {/* Providers by Category */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Providers by Category
              </h2>
              <div className="space-y-4">
                {['cloud', 'analytics', 'marketing', 'payment', 'communication', 'security', 'other'].map((category) => {
                  const count = serviceProviders.filter(p => p.category === category).length;
                  const percentage = totalProviders > 0 ? Math.round((count / totalProviders) * 100) : 0;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="info" className="capitalize">
                            {category}
                          </Badge>
                          <span className="font-medium capitalize">{category}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {count} providers ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        {/* Dynamic width for category distribution */}
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* High Priority Providers */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">High Priority Providers</h2>
              <div className="space-y-4">
                {serviceProviders
                  .filter(p => p.riskAssessment.overallRisk === 'high' || p.riskAssessment.overallRisk === 'critical' || p.status !== 'active')
                  .slice(0, 5)
                  .map((provider) => (
                    <div key={provider.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium">{provider.name}</h3>
                            {getStatusBadge(provider.status)}
                            {getRiskBadge(provider.riskAssessment.overallRisk)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{provider.description}</p>
                          <div className="text-sm text-muted-foreground">
                            Compliance Score: {provider.monitoring.complianceScore}/100 • 
                            Agreement: {provider.agreement.type} ({provider.agreement.status})
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

        <TabsContent value="providers" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="provider-category-filter" className="sr-only">Filter by category</label>
                  <select
                    id="provider-category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    aria-label="Filter providers by category"
                  >
                    <option value="all">All Categories</option>
                    <option value="cloud">Cloud</option>
                    <option value="analytics">Analytics</option>
                    <option value="marketing">Marketing</option>
                    <option value="payment">Payment</option>
                    <option value="communication">Communication</option>
                    <option value="security">Security</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="provider-status-filter" className="sr-only">Filter by status</label>
                  <select
                    id="provider-status-filter"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    aria-label="Filter providers by status"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                    <option value="terminated">Terminated</option>
                    <option value="under_review">Under Review</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="provider-risk-filter" className="sr-only">Filter by risk level</label>
                  <select
                    id="provider-risk-filter"
                    value={selectedRisk}
                    onChange={(e) => setSelectedRisk(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    aria-label="Filter providers by risk level"
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
                    Add Provider
                  </Button>
                  <Button variant="outline" onClick={() => exportReport('json')} disabled={isExporting}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Providers List */}
          <div className="space-y-4">
            {filteredProviders.length === 0 ? (
              <EmptyState
                icon={Building}
                title="No Service Providers"
                description="Add your first service provider to track data processing agreements and compliance requirements."
                action={{
                  label: "Add Provider",
                  onClick: () => window.location.href = '/toolkit/service-providers/new',
                  icon: Plus
                }}
              />
            ) : (
              filteredProviders.map((provider) => (
                <Card key={provider.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{provider.name}</h3>
                          {getStatusBadge(provider.status)}
                          {getRiskBadge(provider.riskAssessment.overallRisk)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{provider.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">Category:</span>
                            <div className="text-muted-foreground capitalize">{provider.category}</div>
                          </div>
                          <div>
                            <span className="font-medium">Agreement:</span>
                            <div className="text-muted-foreground">{provider.agreement.type} ({provider.agreement.status})</div>
                          </div>
                          <div>
                            <span className="font-medium">Compliance Score:</span>
                            <div className="text-muted-foreground">{provider.monitoring.complianceScore}/100</div>
                          </div>
                        </div>

                        {/* Compliance Indicators */}
                        <div className="mb-4">
                          <span className="font-medium text-sm">Compliance Frameworks:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(provider.compliance).map(([framework, compliant]) => (
                              <div key={framework} className="flex items-center gap-1">
                                {compliant ? (
                                  <CheckCircle className="h-4 w-4 text-success" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-destructive" />
                                )}
                                <span className="text-xs uppercase">{framework}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Security Certifications */}
                        {provider.security.certifications && provider.security.certifications.length > 0 && (
                          <div className="mb-4">
                            <span className="font-medium text-sm">Security Certifications:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {provider.security.certifications.map((cert, index) => (
                                <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
                                  <Award className="h-3 w-3" />
                                  {cert}
                                </span>
                              ))}
                            </div>
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

        <TabsContent value="agreements" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Agreement Management</h2>
              <div className="space-y-4">
                {serviceProviders.map((provider) => (
                  <div key={provider.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{provider.name}</h3>
                          <Badge variant="info">{provider.agreement.type}</Badge>
                          <Badge className={
                            provider.agreement.status === 'approved' ? 'bg-success/10 text-success' :
                            provider.agreement.status === 'under_review' ? 'bg-warning/10 text-warning' :
                            provider.agreement.status === 'expired' ? 'bg-destructive/10 text-destructive' :
                            'bg-muted text-muted-foreground'
                          }>
                            {provider.agreement.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Start Date:</span>
                            <div>{provider.agreement.startDate}</div>
                          </div>
                          <div>
                            <span className="font-medium">End Date:</span>
                            <div>{provider.agreement.endDate}</div>
                          </div>
                          <div>
                            <span className="font-medium">Next Review:</span>
                            <div>{provider.agreement.nextReview}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Agreement
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Compliance Overview</h2>
              <div className="space-y-6">
                {['GDPR', 'CCPA', 'HIPAA', 'FERPA', 'SOX', 'PCI', 'ISO27001', 'SOC2'].map((framework) => {
                  const relevantProviders = serviceProviders.filter(p => {
                    const key = framework.toLowerCase() as keyof typeof serviceProviders[0]['compliance'];
                    return p.compliance[key];
                  });
                  const compliant = relevantProviders.length;
                  const total = serviceProviders.length;
                  const percentage = total > 0 ? Math.round((compliant / total) * 100) : 0;
                  
                  return (
                    <div key={framework} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="info">{framework}</Badge>
                          <span className="font-medium">Compliance</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {compliant}/{total} providers ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        {/* Dynamic width for compliance stats */}
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Monitoring & Audits</h2>
              <div className="space-y-4">
                {serviceProviders.map((provider) => (
                  <div key={provider.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{provider.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Last Audit:</span>
                            <div>{provider.monitoring.lastAudit}</div>
                          </div>
                          <div>
                            <span className="font-medium">Next Audit:</span>
                            <div>{provider.monitoring.nextAudit}</div>
                          </div>
                          <div>
                            <span className="font-medium">Compliance Score:</span>
                            <div>{provider.monitoring.complianceScore}/100</div>
                          </div>
                        </div>
                        {provider.monitoring.auditFindings > 0 && (
                          <div className="mt-3 text-sm">
                            <span className="font-medium">Audit Findings: </span>
                            <span className="text-muted-foreground">
                              {provider.monitoring.resolvedFindings}/{provider.monitoring.auditFindings} resolved
                            </span>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default ServiceProviderManager;

