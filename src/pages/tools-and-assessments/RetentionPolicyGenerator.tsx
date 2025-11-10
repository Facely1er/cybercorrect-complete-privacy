import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { toast } from '../../components/ui/Toaster';
import { storageAdapter } from '../../utils/storageAdapter';
import { 
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Download,
  BarChart3,
  Database,
  Calendar,
  Award,
  FileText,
  Trash2,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

interface RetentionPolicy {
  id: string;
  name: string;
  description: string;
  dataCategory: string;
  dataTypes: string[];
  purposes: string[];
  retentionPeriod: string;
  legalBasis: string;
  regulations: string[];
  retentionStart: 'creation' | 'last_access' | 'last_update' | 'completion' | 'custom';
  customStartDate?: string;
  retentionEnd: 'automatic' | 'manual' | 'event_based';
  endEvent?: string;
  disposalMethod: 'delete' | 'anonymize' | 'archive' | 'transfer';
  reviewCycle: string;
  lastReview: string;
  nextReview: string;
  status: 'active' | 'draft' | 'under_review' | 'expired';
  complianceStatus: 'compliant' | 'needs_review' | 'non_compliant';
  createdDate: string;
  createdBy: string;
  approvedBy: string;
  approvalDate: string;
  exceptions: string[];
  notes: string;
}

interface DataRecord {
  id: string;
  dataType: string;
  dataCategory: string;
  subject: string;
  createdDate: string;
  lastAccessed: string;
  lastUpdated: string;
  retentionPolicy: string;
  retentionEndDate: string;
  status: 'active' | 'expired' | 'scheduled_deletion' | 'deleted' | 'anonymized';
  disposalDate?: string;
  disposalMethod?: string;
  location: string;
  size: string;
  sensitivity: 'low' | 'medium' | 'high' | 'critical';
}

const RetentionPolicyGenerator = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCompliance, setSelectedCompliance] = useState('all');
  const [policies, setPolicies] = useState<RetentionPolicy[]>([]);
  const [dataRecords, setDataRecords] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setLoading(true);
      const loadedPolicies = storageAdapter.getRetentionPolicies();
      const loadedRecords = storageAdapter.getDataRecords();
      setPolicies(Array.isArray(loadedPolicies) ? loadedPolicies : []);
      setDataRecords(Array.isArray(loadedRecords) ? loadedRecords : []);
    } catch (error) {
      console.error('Error loading data:', error);
      setPolicies([]);
      setDataRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const savePolicies = (updatedPolicies: RetentionPolicy[]) => {
    storageAdapter.setRetentionPolicies(updatedPolicies);
    setPolicies(updatedPolicies);
  };

  const saveDataRecords = (updatedRecords: DataRecord[]) => {
    storageAdapter.setDataRecords(updatedRecords);
    setDataRecords(updatedRecords);
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesCategory = selectedCategory === 'all' || policy.dataCategory === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || policy.status === selectedStatus;
    const matchesCompliance = selectedCompliance === 'all' || policy.complianceStatus === selectedCompliance;
    return matchesCategory && matchesStatus && matchesCompliance;
  });

  const getStatusBadge = (status: string) => {
    const className = 
      status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
      status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' :
      status === 'under_review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    
    return <Badge className={className}>{status.replace('_', ' ')}</Badge>;
  };

  const getComplianceBadge = (status: string) => {
    const className = 
      status === 'compliant' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
      status === 'needs_review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    
    return <Badge className={className}>{status.replace('_', ' ')}</Badge>;
  };

  // Calculate metrics
  const totalPolicies = policies.length;
  const activePolicies = policies.filter(p => p.status === 'active').length;
  const compliantPolicies = policies.filter(p => p.complianceStatus === 'compliant').length;
  const expiredRecords = dataRecords.filter(r => r.status === 'expired').length;
  const scheduledDeletion = dataRecords.filter(r => r.status === 'scheduled_deletion').length;
  const totalRecords = dataRecords.length;

  const upcomingReviews = policies.filter(p => {
    const nextReview = new Date(p.nextReview);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return nextReview <= thirtyDaysFromNow && p.status === 'active';
  }).length;

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
          reportId: `RETENTION-${Date.now()}`,
          version: '1.0'
        },
        summary: {
          totalPolicies,
          activePolicies,
          compliantPolicies,
          totalRecords,
          expiredRecords,
          scheduledDeletion
        },
        policies,
        dataRecords
      };

      const creditsUsed = monetization.useExportCredits(format, 'Retention Policy Generator');
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
        a.download = `retention-policies-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'JSON report downloaded');
      } else if (format === 'csv') {
        const csvRows: string[] = [];
        csvRows.push('Policy Name,Data Category,Retention Period,Status,Compliance Status,Next Review');
        
        policies.forEach(policy => {
          csvRows.push([
            policy.name,
            policy.dataCategory,
            policy.retentionPeriod,
            policy.status,
            policy.complianceStatus,
            policy.nextReview
          ].join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `retention-policies-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'CSV report downloaded');
      } else if (format === 'pdf') {
        const { generateRetentionPolicyPdf } = await import('../../utils/generateExportPdf');
        generateRetentionPolicyPdf(reportData);
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
        <Breadcrumbs className="mb-6" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading retention policies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumbs className="mb-6" />
      
      <div className="mb-6">
        <Link to="/toolkit" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Toolkit
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Retention Policy Generator</h1>
        <p className="text-muted-foreground">
          Manage data retention policies and ensure compliance with legal requirements
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="records">Data Records</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-2xl font-bold">{totalPolicies}</span>
                </div>
                <h3 className="font-semibold mb-1">Total Policies</h3>
                <p className="text-sm text-muted-foreground">Retention policies</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {activePolicies}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Active Policies</h3>
                <p className="text-sm text-muted-foreground">Currently in effect</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {compliantPolicies}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Compliant</h3>
                <p className="text-sm text-muted-foreground">Meeting requirements</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {upcomingReviews}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Due for Review</h3>
                <p className="text-sm text-muted-foreground">Next 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Data Records Overview */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-500" />
                Data Records Overview
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalRecords}</div>
                  <div className="text-sm text-muted-foreground">Total Records</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{expiredRecords}</div>
                  <div className="text-sm text-muted-foreground">Expired</div>
                </div>
                <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{scheduledDeletion}</div>
                  <div className="text-sm text-muted-foreground">Scheduled Deletion</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {totalRecords - expiredRecords - scheduledDeletion}
                  </div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Categories */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                Policy Categories
              </h2>
              <div className="space-y-4">
                {['employee_data', 'customer_data', 'financial_data', 'health_data', 'marketing_data'].map((category) => {
                  const count = policies.filter(p => p.dataCategory === category).length;
                  const percentage = totalPolicies > 0 ? Math.round((count / totalPolicies) * 100) : 0;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="info" className="capitalize">
                            {category.replace('_', ' ')}
                          </Badge>
                          <span className="font-medium capitalize">{category.replace('_', ' ')}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {count} policies ({percentage}%)
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
            </CardContent>
          </Card>

          {/* Upcoming Reviews */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-amber-500" />
                Upcoming Policy Reviews
              </h2>
              <div className="space-y-4">
                {policies
                  .filter(p => {
                    const nextReview = new Date(p.nextReview);
                    const thirtyDaysFromNow = new Date();
                    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                    return nextReview <= thirtyDaysFromNow && p.status === 'active';
                  })
                  .slice(0, 3)
                  .map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{policy.name}</h3>
                          {getStatusBadge(policy.status)}
                          {getComplianceBadge(policy.complianceStatus)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Category:</span>
                            <div className="capitalize">{policy.dataCategory.replace('_', ' ')}</div>
                          </div>
                          <div>
                            <span className="font-medium">Retention Period:</span>
                            <div>{policy.retentionPeriod}</div>
                          </div>
                          <div>
                            <span className="font-medium">Next Review:</span>
                            <div>{policy.nextReview}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="employee_data">Employee Data</option>
                    <option value="customer_data">Customer Data</option>
                    <option value="financial_data">Financial Data</option>
                    <option value="health_data">Health Data</option>
                    <option value="marketing_data">Marketing Data</option>
                  </select>
                </div>
                <div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="under_review">Under Review</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <select
                    value={selectedCompliance}
                    onChange={(e) => setSelectedCompliance(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="all">All Compliance</option>
                    <option value="compliant">Compliant</option>
                    <option value="needs_review">Needs Review</option>
                    <option value="non_compliant">Non-Compliant</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    New Policy
                  </Button>
                  <Button variant="outline" onClick={() => exportReport('json')} disabled={isExporting}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policies List */}
          <div className="space-y-4">
            {filteredPolicies.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No retention policies found. Click "New Policy" to create your first policy.
                </CardContent>
              </Card>
            ) : (
              filteredPolicies.map((policy) => (
                <Card key={policy.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{policy.name}</h3>
                          {getStatusBadge(policy.status)}
                          {getComplianceBadge(policy.complianceStatus)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{policy.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">Data Category:</span>
                            <div className="text-muted-foreground capitalize">{policy.dataCategory.replace('_', ' ')}</div>
                          </div>
                          <div>
                            <span className="font-medium">Retention Period:</span>
                            <div className="text-muted-foreground">{policy.retentionPeriod}</div>
                          </div>
                          <div>
                            <span className="font-medium">Legal Basis:</span>
                            <div className="text-muted-foreground">{policy.legalBasis}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">Created:</span>
                            <div className="text-muted-foreground">{policy.createdDate}</div>
                          </div>
                          <div>
                            <span className="font-medium">Last Review:</span>
                            <div className="text-muted-foreground">{policy.lastReview}</div>
                          </div>
                          <div>
                            <span className="font-medium">Next Review:</span>
                            <div className="text-muted-foreground">{policy.nextReview}</div>
                          </div>
                        </div>

                        {policy.dataTypes && policy.dataTypes.length > 0 && (
                          <div className="mb-4">
                            <span className="font-medium text-sm">Data Types:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {policy.dataTypes.map((type, index) => (
                                <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {policy.purposes && policy.purposes.length > 0 && (
                          <div className="mb-4">
                            <span className="font-medium text-sm">Purposes:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {policy.purposes.map((purpose, index) => (
                                <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                                  {purpose}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {policy.regulations.map(reg => (
                            <Badge key={reg} variant="info">
                              {reg.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
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

        <TabsContent value="records" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Data Records</h2>
              <div className="space-y-4">
                {dataRecords.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No data records found.
                  </div>
                ) : (
                  dataRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{record.dataType}</h3>
                          <Badge className={
                            record.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            record.status === 'expired' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            record.status === 'scheduled_deletion' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                          }>
                            {record.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Subject:</span>
                            <div>{record.subject}</div>
                          </div>
                          <div>
                            <span className="font-medium">Created:</span>
                            <div>{record.createdDate}</div>
                          </div>
                          <div>
                            <span className="font-medium">Retention End:</span>
                            <div>{record.retentionEndDate}</div>
                          </div>
                          <div>
                            <span className="font-medium">Location:</span>
                            <div>{record.location}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {record.status === 'expired' && (
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Dispose
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Retention Schedule</h2>
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{policy.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Category:</span>
                            <div className="capitalize">{policy.dataCategory.replace('_', ' ')}</div>
                          </div>
                          <div>
                            <span className="font-medium">Retention Period:</span>
                            <div>{policy.retentionPeriod}</div>
                          </div>
                          <div>
                            <span className="font-medium">Disposal Method:</span>
                            <div className="capitalize">{policy.disposalMethod}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(policy.status)}
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
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
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                    <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Compliant Policies</h3>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {compliantPolicies}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-400">
                      {totalPolicies > 0 ? Math.round((compliantPolicies / totalPolicies) * 100) : 0}% of total
                    </div>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Needs Review</h3>
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {policies.filter(p => p.complianceStatus === 'needs_review').length}
                    </div>
                    <div className="text-sm text-amber-700 dark:text-amber-400">
                      Require attention
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">Non-Compliant</h3>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {policies.filter(p => p.complianceStatus === 'non_compliant').length}
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-400">
                      Immediate action required
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Compliance Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Review All Policies
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => exportReport('json')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Compliance Report
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Reviews
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Audit Trail
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RetentionPolicyGenerator;

