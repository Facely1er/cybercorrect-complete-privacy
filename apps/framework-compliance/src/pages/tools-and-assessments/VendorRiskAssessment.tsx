import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { toast } from '../../components/ui/Toaster';
import { storageAdapter } from '../../utils/storage';
import { EmptyState } from '../../components/ui/EmptyState';
import { 
  Building,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Calendar,
  BarChart3,
  Award,
  ArrowLeft
} from 'lucide-react';

interface VendorAssessment {
  id: string;
  vendorName: string;
  serviceDescription: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceStatus: 'compliant' | 'review_needed' | 'non_compliant';
  assessmentScore: number;
  contractStartDate: string;
  contractEndDate: string;
  lastAssessmentDate: string;
  nextAssessmentDue: string;
  dataTypesProcessed: string[];
  applicableRegulations: string[];
  securityCertifications: string[];
  privacyPolicyReviewed: boolean;
  dpaSigned: boolean;
  employeeDataAccess: boolean;
}

const VendorRiskAssessment = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  const [selectedCompliance, setSelectedCompliance] = useState('all');
  const [vendorAssessments, setVendorAssessments] = useState<VendorAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadVendorAssessments();
  }, []);

  const loadVendorAssessments = () => {
    try {
      setLoading(true);
      const vendors = storageAdapter.getVendorAssessments();
      setVendorAssessments(Array.isArray(vendors) ? vendors : []);
    } catch (error) {
      console.error('Error loading vendor assessments:', error);
      setVendorAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const saveVendorAssessments = (assessments: VendorAssessment[]) => {
    storageAdapter.setVendorAssessments(assessments);
    setVendorAssessments(assessments);
  };

  const filteredVendors = vendorAssessments.filter(vendor => {
    const matchesRisk = selectedRiskLevel === 'all' || vendor.riskLevel === selectedRiskLevel;
    const matchesCompliance = selectedCompliance === 'all' || vendor.complianceStatus === selectedCompliance;
    return matchesRisk && matchesCompliance;
  });

  const getRiskBadge = (riskLevel: string) => {
    const className = 
      riskLevel === 'critical' ? 'bg-destructive/10 text-destructive' :
      riskLevel === 'high' ? 'bg-warning/10 text-warning' :
      riskLevel === 'medium' ? 'bg-warning/10 text-warning' :
      'bg-success/10 text-success';
    
    return <Badge className={className}>{riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}</Badge>;
  };

  const getComplianceBadge = (status: string) => {
    const className = 
      status === 'compliant' ? 'bg-success/10 text-success' :
      status === 'review_needed' ? 'bg-warning/10 text-warning' :
      'bg-destructive/10 text-destructive';
    
    return <Badge className={className}>{status.replace('_', ' ')}</Badge>;
  };

  // Calculate metrics
  const totalVendors = vendorAssessments.length;
  const compliantVendors = vendorAssessments.filter(v => v.complianceStatus === 'compliant').length;
  const highRiskVendors = vendorAssessments.filter(v => v.riskLevel === 'high' || v.riskLevel === 'critical').length;
  const reviewNeeded = vendorAssessments.filter(v => v.complianceStatus === 'review_needed').length;

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
          reportId: `VENDOR-${Date.now()}`,
          version: '1.0'
        },
        summary: {
          totalVendors,
          compliantVendors,
          highRiskVendors,
          reviewNeeded
        },
        assessments: vendorAssessments
      };

      const creditsUsed = monetization.useExportCredits(format, 'Vendor Risk Assessment');
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
        a.download = `vendor-assessments-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'JSON report downloaded');
      } else if (format === 'csv') {
        const csvRows: string[] = [];
        csvRows.push('Vendor Name,Service Description,Risk Level,Compliance Status,Assessment Score,Last Assessment,Next Assessment,Regulations');
        
        vendorAssessments.forEach(vendor => {
          csvRows.push([
            vendor.vendorName,
            vendor.serviceDescription,
            vendor.riskLevel,
            vendor.complianceStatus,
            vendor.assessmentScore.toString(),
            vendor.lastAssessmentDate,
            vendor.nextAssessmentDue,
            vendor.applicableRegulations.join(';')
          ].join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vendor-assessments-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'CSV report downloaded');
      } else if (format === 'pdf') {
        const { generateVendorRiskAssessmentPdf } = await import('../../utils/pdf');
        generateVendorRiskAssessmentPdf(reportData);
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
            <p className="text-muted-foreground">Loading vendor assessments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      
      <div className="mb-6">
        <Link to="/toolkit" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Toolkit
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Vendor Risk Assessment</h1>
        <p className="text-muted-foreground">
          Evaluate and monitor third-party vendors for privacy compliance and data protection
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="vendors">All Vendors</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-2xl font-bold">{totalVendors}</span>
                </div>
                <h3 className="font-semibold mb-1">Total Vendors</h3>
                <p className="text-sm text-muted-foreground">Under assessment</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <span className="text-2xl font-bold text-success">
                    {compliantVendors}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Compliant</h3>
                <p className="text-sm text-muted-foreground">Meeting requirements</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <span className="text-2xl font-bold text-destructive">
                    {highRiskVendors}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">High Risk</h3>
                <p className="text-sm text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {reviewNeeded}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Review Needed</h3>
                <p className="text-sm text-muted-foreground">Requires action</p>
              </CardContent>
            </Card>
          </div>

          {/* Risk Distribution */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Risk Level Distribution
              </h2>
              <div className="space-y-4">
                {['low', 'medium', 'high', 'critical'].map((risk) => {
                  const count = vendorAssessments.filter(v => v.riskLevel === risk).length;
                  const percentage = totalVendors > 0 ? Math.round((count / totalVendors) * 100) : 0;
                  
                  return (
                    <div key={risk} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getRiskBadge(risk)}
                          <span className="font-medium capitalize">{risk} Risk</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {count} vendors ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            risk === 'critical' ? 'bg-destructive' :
                            risk === 'high' ? 'bg-warning' :
                            risk === 'medium' ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* High Priority Vendors */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Vendors Requiring Attention</h2>
              <div className="space-y-4">
                {vendorAssessments
                  .filter(v => v.riskLevel === 'high' || v.riskLevel === 'critical' || v.complianceStatus !== 'compliant')
                  .slice(0, 5)
                  .map((vendor) => (
                    <div key={vendor.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium">{vendor.vendorName}</h3>
                            {getRiskBadge(vendor.riskLevel)}
                            {getComplianceBadge(vendor.complianceStatus)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{vendor.serviceDescription}</p>
                          <div className="text-sm text-muted-foreground">
                            Score: {vendor.assessmentScore}/100 • Last assessed: {vendor.lastAssessmentDate}
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

        <TabsContent value="vendors" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search vendors..."
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={selectedRiskLevel}
                    onChange={(e) => setSelectedRiskLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <select
                    value={selectedCompliance}
                    onChange={(e) => setSelectedCompliance(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="compliant">Compliant</option>
                    <option value="review_needed">Review Needed</option>
                    <option value="non_compliant">Non-Compliant</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                  </Button>
                  <Button variant="outline" onClick={() => exportReport('json')} disabled={isExporting}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendors List */}
          <div className="space-y-4">
            {filteredVendors.length === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="No Vendor Assessments"
                description="Add your first vendor to begin assessing third-party risks and compliance status."
                action={{
                  label: "Add Vendor",
                  onClick: () => window.location.href = '/toolkit/vendor-risk/new',
                  icon: Plus
                }}
              />
            ) : (
              filteredVendors.map((vendor) => (
                <Card key={vendor.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{vendor.vendorName}</h3>
                          {getRiskBadge(vendor.riskLevel)}
                          {getComplianceBadge(vendor.complianceStatus)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{vendor.serviceDescription}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">Assessment Score:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-lg font-semibold">{vendor.assessmentScore}/100</span>
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    vendor.assessmentScore >= 90 ? 'bg-success' :
                                    vendor.assessmentScore >= 75 ? 'bg-warning' :
                                    vendor.assessmentScore >= 60 ? 'bg-warning' : 'bg-destructive'
                                  }`}
                                  style={{ width: `${vendor.assessmentScore}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Contract Period:</span>
                            <div className="text-muted-foreground mt-1">
                              {vendor.contractStartDate} to {vendor.contractEndDate}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Next Assessment:</span>
                            <div className="text-muted-foreground mt-1">
                              {vendor.nextAssessmentDue}
                            </div>
                          </div>
                        </div>

                        {/* Data Types */}
                        {vendor.dataTypesProcessed && vendor.dataTypesProcessed.length > 0 && (
                          <div className="mb-4">
                            <span className="font-medium text-sm">Data Types Processed:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {vendor.dataTypesProcessed.map((dataType, index) => (
                                <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {dataType}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Applicable Regulations */}
                        {vendor.applicableRegulations && vendor.applicableRegulations.length > 0 && (
                          <div className="mb-4">
                            <span className="font-medium text-sm">Applicable Regulations:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {vendor.applicableRegulations.map((reg) => (
                                <Badge key={reg} variant="info">
                                  {reg.toUpperCase()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Security Certifications */}
                        {vendor.securityCertifications && vendor.securityCertifications.length > 0 && (
                          <div className="mb-4">
                            <span className="font-medium text-sm">Security Certifications:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {vendor.securityCertifications.map((cert, index) => (
                                <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
                                  <Award className="h-3 w-3" />
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Compliance Indicators */}
                        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            {vendor.privacyPolicyReviewed ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                            <span>Privacy Policy</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {vendor.dpaSigned ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                            <span>DPA Signed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {vendor.employeeDataAccess ? (
                              <AlertTriangle className="h-4 w-4 text-warning" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-success" />
                            )}
                            <span>Employee Data Access</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Assessment
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Update
                        </Button>
                        <Button size="sm">
                          Re-assess
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Assessment Templates</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'GDPR Compliance Assessment', regulations: ['GDPR'], description: 'Standard GDPR vendor evaluation' },
                  { name: 'CCPA Assessment', regulations: ['CCPA'], description: 'California Consumer Privacy Act assessment' },
                  { name: 'Multi-Regulation Assessment', regulations: ['GDPR', 'CCPA', 'LGPD'], description: 'Comprehensive multi-regulation compliance' },
                  { name: 'International Vendor Assessment', regulations: ['GDPR', 'PIPEDA'], description: 'Assessment for vendors processing international data' },
                  { name: 'Security-Focused Assessment', regulations: ['General'], description: 'Technical security and data protection evaluation' },
                  { name: 'Biometric Data Assessment', regulations: ['BIPA', 'GDPR'], description: 'Specialized assessment for biometric data processing' }
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

          {/* Assessment Calendar */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-success" />
                Upcoming Assessments
              </h2>
              <div className="space-y-4">
                {vendorAssessments
                  .filter(v => new Date(v.nextAssessmentDue) <= new Date(new Date().setMonth(new Date().getMonth() + 3)))
                  .sort((a, b) => new Date(a.nextAssessmentDue).getTime() - new Date(b.nextAssessmentDue).getTime())
                  .map((vendor) => (
                    <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{vendor.vendorName}</h3>
                        <p className="text-sm text-muted-foreground">Due: {vendor.nextAssessmentDue}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getRiskBadge(vendor.riskLevel)}
                        <Button variant="outline" size="sm">
                          Schedule Assessment
                        </Button>
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
              <h2 className="text-xl font-semibold mb-4">Vendor Compliance Overview</h2>
              <div className="space-y-6">
                {/* By Regulation */}
                <div>
                  <h3 className="font-medium mb-3">Compliance by Regulation</h3>
                  <div className="space-y-3">
                    {['GDPR', 'CCPA', 'LGPD', 'PIPEDA'].map((reg) => {
                      const relevantVendors = vendorAssessments.filter(v => v.applicableRegulations.includes(reg));
                      const compliant = relevantVendors.filter(v => v.complianceStatus === 'compliant').length;
                      const total = relevantVendors.length;
                      const percentage = total > 0 ? Math.round((compliant / total) * 100) : 0;
                      
                      return (
                        <div key={reg} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant="info">{reg}</Badge>
                              <span className="font-medium">Vendor Compliance</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {compliant}/{total} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Compliance Actions */}
                <div>
                  <h3 className="font-medium mb-3">Required Actions</h3>
                  <div className="space-y-3">
                    {vendorAssessments
                      .filter(v => v.complianceStatus !== 'compliant')
                      .map((vendor) => (
                        <div key={vendor.id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <div>
                            <h4 className="font-medium text-amber-800 dark:text-amber-300">{vendor.vendorName}</h4>
                            <p className="text-xs text-amber-700 dark:text-amber-400">
                              {vendor.complianceStatus === 'review_needed' ? 'Requires privacy policy review and compliance verification' :
                               vendor.complianceStatus === 'non_compliant' ? 'Does not meet compliance requirements - consider termination' :
                               'Status unclear - requires assessment'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getComplianceBadge(vendor.complianceStatus)}
                            <Button variant="outline" size="sm">
                              Take Action
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorRiskAssessment;

