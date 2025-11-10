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
  Users,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Plus,
  Download,
  Mail,
  Calendar,
  AlertTriangle,
  Eye,
  Edit,
  RefreshCw,
  Search,
  ArrowLeft
} from 'lucide-react';

interface ConsentRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  consentType: string;
  serviceProvider: string;
  status: 'active' | 'withdrawn' | 'expired' | 'pending';
  consentGiven: boolean;
  consentDate?: string;
  withdrawalDate?: string;
  expiryDate?: string;
  renewalRequired: boolean;
  applicableRegulations: string[];
  parentGuardianName?: string;
  notes?: string;
}

const ConsentManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedConsentType, setSelectedConsentType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Organizational consent types (adapted from FERPA/COPPA to GDPR/CCPA)
  const consentTypes = [
    { id: 'marketing_communications', name: 'Marketing Communications', regulation: 'GDPR/CCPA' },
    { id: 'data_sharing', name: 'Data Sharing', regulation: 'GDPR/CCPA' },
    { id: 'biometric_data', name: 'Biometric Data', regulation: 'BIPA/GDPR' },
    { id: 'research_participation', name: 'Research Participation', regulation: 'GDPR' },
    { id: 'third_party_processing', name: 'Third-Party Processing', regulation: 'GDPR' },
    { id: 'international_transfer', name: 'International Data Transfer', regulation: 'GDPR' },
    { id: 'profiling_automated', name: 'Profiling & Automated Decision', regulation: 'GDPR' }
  ];

  useEffect(() => {
    loadConsentRecords();
  }, []);

  const loadConsentRecords = () => {
    try {
      setLoading(true);
      const consents = storageAdapter.getConsentRecords();
      setConsentRecords(Array.isArray(consents) ? consents : []);
    } catch (error) {
      console.error('Error loading consent records:', error);
      setConsentRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const saveConsentRecords = (records: ConsentRecord[]) => {
    storageAdapter.setConsentRecords(records);
    setConsentRecords(records);
  };

  const filteredConsent = consentRecords.filter(record => {
    const matchesType = selectedConsentType === 'all' || record.consentType === selectedConsentType;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  // Calculate metrics
  const totalConsent = consentRecords.length;
  const activeConsent = consentRecords.filter(r => r.status === 'active').length;
  const withdrawnConsent = consentRecords.filter(r => r.status === 'withdrawn').length;
  const renewalRequired = consentRecords.filter(r => r.renewalRequired).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'withdrawn':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'expired':
        return <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const className = 
      status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
      status === 'withdrawn' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
      status === 'expired' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' :
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    
    return (
      <Badge className={className}>
        {status}
      </Badge>
    );
  };

  const exportReport = async (format: 'json' | 'csv' | 'pdf') => {
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

    setIsExporting(true);
    try {
      const reportData = {
        metadata: {
          timestamp: new Date().toISOString(),
          reportId: `CONSENT-${Date.now()}`,
          version: '1.0',
          generatedBy: 'CyberCorrect Consent Management'
        },
        summary: {
          totalRecords: totalConsent,
          activeRecords: activeConsent,
          withdrawnRecords: withdrawnConsent,
          renewalRequired: renewalRequired
        },
        records: consentRecords
      };

      const creditsUsed = monetization.useExportCredits(format, 'Consent Management');
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
        a.download = `consent-records-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'JSON report downloaded');
      } else if (format === 'csv') {
        const csvRows: string[] = [];
        csvRows.push('ID,Employee Name,Employee ID,Consent Type,Service Provider,Status,Consent Date,Expiry Date,Regulations');
        
        consentRecords.forEach(record => {
          csvRows.push([
            record.id,
            record.employeeName,
            record.employeeId,
            record.consentType,
            record.serviceProvider,
            record.status,
            record.consentDate || '',
            record.expiryDate || '',
            record.applicableRegulations.join(';')
          ].join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consent-records-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'CSV report downloaded');
      } else if (format === 'pdf') {
        toast.info('PDF Export', 'PDF export functionality is currently under development. You can export your consent management data using the Word export option available in the export menu.');
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
            <p className="text-muted-foreground">Loading consent records...</p>
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
        <h1 className="text-3xl font-bold mb-2 text-foreground">Consent Management</h1>
        <p className="text-muted-foreground">
          Track and manage employee consent and privacy preferences for GDPR and CCPA compliance
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consent">Consent Records</TabsTrigger>
          <TabsTrigger value="forms">Consent Forms</TabsTrigger>
          <TabsTrigger value="renewal">Renewals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-2xl font-bold">{totalConsent}</span>
                </div>
                <h3 className="font-semibold mb-1">Total Records</h3>
                <p className="text-sm text-muted-foreground">All consent records</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {activeConsent}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Active Consent</h3>
                <p className="text-sm text-muted-foreground">Currently valid</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {withdrawnConsent}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Withdrawn</h3>
                <p className="text-sm text-muted-foreground">Consent revoked</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <RefreshCw className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {renewalRequired}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Need Renewal</h3>
                <p className="text-sm text-muted-foreground">Require updates</p>
              </CardContent>
            </Card>
          </div>

          {/* Consent by Type */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Consent by Type</h2>
              <div className="space-y-4">
                {consentTypes.map((type) => {
                  const typeRecords = consentRecords.filter(r => r.consentType === type.id);
                  const activeTypeRecords = typeRecords.filter(r => r.status === 'active').length;
                  const total = typeRecords.length;
                  const percentage = total > 0 ? Math.round((activeTypeRecords / total) * 100) : 0;
                  
                  return (
                    <div key={type.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{type.name}</span>
                          <span className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {type.regulation}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {activeTypeRecords}/{total} ({percentage}% active)
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

          {/* Recent Consent Activity */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Consent Activity</h2>
              <div className="space-y-4">
                {consentRecords.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(record.status)}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{record.employeeName}</h3>
                        <p className="text-xs text-muted-foreground">
                          {record.consentType.replace('_', ' ')} - {record.serviceProvider}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(record.status)}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consent" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={selectedConsentType}
                    onChange={(e) => setSelectedConsentType(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="all">All Consent Types</option>
                    {consentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
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
                    <option value="withdrawn">Withdrawn</option>
                    <option value="expired">Expired</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Consent
                  </Button>
                  <Button variant="outline" onClick={() => exportReport('json')} disabled={isExporting}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consent Records Table */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">All Consent Records</h2>
              
              <div className="divide-y">
                {filteredConsent.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No consent records found. Click "Add Consent" to create your first record.
                  </div>
                ) : (
                  filteredConsent.map((record) => (
                    <div key={record.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium">{record.employeeName}</h3>
                            <span className="text-xs text-muted-foreground">ID: {record.employeeId}</span>
                            {getStatusBadge(record.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>{record.consentType.replace('_', ' ')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{record.serviceProvider}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {record.consentDate ? `Granted: ${record.consentDate}` : 
                                 record.withdrawalDate ? `Withdrawn: ${record.withdrawalDate}` : 'Pending'}
                              </span>
                            </div>
                          </div>

                          {/* Applicable Regulations */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {record.applicableRegulations.map(reg => (
                              <Badge key={reg} variant="info">
                                {reg.toUpperCase()}
                              </Badge>
                            ))}
                          </div>

                          {/* Renewal Notice */}
                          {record.renewalRequired && record.status === 'active' && (
                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                                <RefreshCw className="h-4 w-4" />
                                <span className="text-sm font-medium">Renewal Required</span>
                              </div>
                              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                This consent expires on {record.expiryDate} and requires renewal
                              </p>
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
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-6">
          {/* Consent Form Templates */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Consent Form Templates</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {consentTypes.map((type) => (
                  <div key={type.id} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{type.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Required under {type.regulation}
                    </p>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          const template = `${type.name.toUpperCase()} CONSENT FORM TEMPLATE
Required under: ${type.regulation}

================================================================================
CONSENT FORM FOR: ${type.name}
================================================================================

ORGANIZATION INFORMATION
- Organization Name: 
- Contact Information: 
- Data Protection Officer (if applicable): 

CONSENT DETAILS
- Consent Type: ${type.name}
- Purpose of Processing: 
- Data Categories: 
- Data Recipients: 
- Data Retention Period: 
- International Transfers: [ ] Yes [ ] No
  If yes, safeguards: 

YOUR RIGHTS
You have the right to:
- Withdraw consent at any time
- Access your personal data
- Rectify inaccurate data
- Erase your data (right to be forgotten)
- Restrict processing
- Data portability
- Object to processing
- Lodge a complaint with supervisory authority

CONSENT STATEMENT
I, [Name], hereby provide my consent for [Organization Name] to process my personal data 
for the purposes described above.

[ ] I consent to the processing of my personal data as described
[ ] I understand I can withdraw my consent at any time
[ ] I have been informed of my rights regarding my personal data

SIGNATURE
- Name: 
- Signature: 
- Date: 

WITHDRAWAL OF CONSENT
If you wish to withdraw your consent, please contact us at:
- Email: 
- Phone: 
- Address: 

================================================================================
END OF TEMPLATE
================================================================================
`;

                          const blob = new Blob([template], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${type.name.replace(/\s+/g, '-')}-Consent-Template-${new Date().toISOString().split('T')[0]}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          toast.info("Preview Consent Form", `Preview functionality for ${type.name} consent forms is currently under development. This feature will allow you to preview how consent forms will appear to users before publishing.`);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Form
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="renewal" className="space-y-6">
          {/* Renewal Dashboard */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Consent Renewals</h2>
              <div className="space-y-4">
                {consentRecords
                  .filter(r => r.renewalRequired || (r.expiryDate && new Date(r.expiryDate) <= new Date(new Date().setMonth(new Date().getMonth() + 2))))
                  .map((record) => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium">{record.employeeName}</h3>
                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                              Renewal Required
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Consent Type:</span>
                              <div>{record.consentType.replace('_', ' ')}</div>
                            </div>
                            <div>
                              <span className="font-medium">Service Provider:</span>
                              <div>{record.serviceProvider}</div>
                            </div>
                            <div>
                              <span className="font-medium">Expires:</span>
                              <div className="text-amber-600 dark:text-amber-400">
                                {record.expiryDate || 'Annual renewal'}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminder
                          </Button>
                          <Button size="sm">
                            Process Renewal
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsentManagement;

