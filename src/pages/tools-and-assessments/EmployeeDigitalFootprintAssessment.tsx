import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Users, 
  ArrowLeft,
  AlertTriangle,
  Download,
  Plus,
  FileText,
  Shield,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Database,
  Network,
  Briefcase,
  Building
} from 'lucide-react';
import { toast } from '../../components/ui/Toaster';
import { secureStorage } from '../../utils/secureStorage';

interface DataCategory {
  id: string;
  name: string;
  type: 'personal_identifier' | 'account_profile' | 'digital_activity' | 'professional_info' | 'organizational_data';
  sensitivity: 'high' | 'medium' | 'low';
  description: string;
  examples: string[];
}

interface AccountProfile {
  id: string;
  platform: string;
  accountType: 'corporate' | 'employee' | 'vendor';
  username?: string;
  email?: string;
  status: 'active' | 'inactive' | 'suspended';
  privacyLevel: 'public' | 'private' | 'restricted';
  dataShared: string[];
}

interface Activity {
  id: string;
  type: 'browsing' | 'communication' | 'file_sharing' | 'cloud_storage' | 'other';
  platform: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
  dataCollected: string[];
}

interface ProfessionalData {
  id: string;
  type: 'employment_history' | 'education' | 'certifications' | 'professional_network' | 'other';
  source: string;
  visibility: 'public' | 'private' | 'restricted';
  dataPoints: string[];
}

interface OrganizationalData {
  id: string;
  type: 'employee_directory' | 'org_chart' | 'business_contacts' | 'vendor_info' | 'other';
  source: string;
  sensitivity: 'high' | 'medium' | 'low';
  dataPoints: string[];
}

interface ComplianceStatus {
  gdpr: 'compliant' | 'partial' | 'non_compliant';
  ccpa: 'compliant' | 'partial' | 'non_compliant';
  nist: 'compliant' | 'partial' | 'non_compliant';
  overall: 'compliant' | 'partial' | 'non_compliant';
}

interface EmployeeDigitalFootprint {
  employeeDataCategories: DataCategory[];
  accountProfiles: AccountProfile[];
  digitalActivities: Activity[];
  professionalInfo: ProfessionalData[];
  organizationalData: OrganizationalData[];
  riskScore: number;
  exposureLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceStatus: ComplianceStatus;
  lastAssessed: string;
  assessedBy: string;
}

const EmployeeDigitalFootprintAssessment = () => {
  const [footprint, setFootprint] = useState<EmployeeDigitalFootprint>(() => {
    const saved = secureStorage.getItem<EmployeeDigitalFootprint>('employee_digital_footprint_data');
    return saved || {
      employeeDataCategories: [],
      accountProfiles: [],
      digitalActivities: [],
      professionalInfo: [],
      organizationalData: [],
      riskScore: 0,
      exposureLevel: 'low',
      complianceStatus: {
        gdpr: 'non_compliant',
        ccpa: 'non_compliant',
        nist: 'non_compliant',
        overall: 'non_compliant'
      },
      lastAssessed: new Date().toISOString().split('T')[0],
      assessedBy: 'Data Protection Officer'
    };
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'accounts' | 'activities' | 'professional' | 'organizational'>('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: string; id: string } | null>(null);

  // Auto-save footprint data
  useEffect(() => {
    secureStorage.setItem('employee_digital_footprint_data', footprint);
    calculateRiskScore();
  }, [footprint]);

  const calculateRiskScore = () => {
    let score = 0;
    let totalItems = 0;

    // Calculate based on data categories
    footprint.employeeDataCategories.forEach(cat => {
      totalItems++;
      if (cat.sensitivity === 'high') score += 3;
      else if (cat.sensitivity === 'medium') score += 2;
      else if (cat.sensitivity === 'low') score += 1;
    });

    // Calculate based on account profiles
    footprint.accountProfiles.forEach(acc => {
      totalItems++;
      if (acc.privacyLevel === 'public') score += 3;
      else if (acc.privacyLevel === 'private') score += 1;
      else score += 0;
    });

    // Calculate based on activities
    footprint.digitalActivities.forEach(act => {
      totalItems++;
      if (act.dataCollected.length > 5) score += 3;
      else if (act.dataCollected.length > 2) score += 2;
      else score += 1;
    });

    const averageScore = totalItems > 0 ? (score / totalItems) * 33.33 : 0;
    const finalScore = Math.min(100, Math.round(averageScore));

    let exposureLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (finalScore >= 75) exposureLevel = 'critical';
    else if (finalScore >= 50) exposureLevel = 'high';
    else if (finalScore >= 25) exposureLevel = 'medium';

    setFootprint(prev => ({
      ...prev,
      riskScore: finalScore,
      exposureLevel
    }));
  };

  const getExposureColor = (level: string) => {
    const colors: Record<string, string> = {
      'low': 'bg-success/10 text-success',
      'medium': 'bg-warning/10 text-warning',
      'high': 'bg-destructive/10 text-destructive',
      'critical': 'bg-destructive text-destructive-foreground'
    };
    return colors[level] || 'bg-muted text-muted-foreground';
  };

  const getSensitivityColor = (sensitivity: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-destructive/10 text-destructive',
      'medium': 'bg-warning/10 text-warning',
      'low': 'bg-success/10 text-success'
    };
    return colors[sensitivity] || 'bg-muted text-muted-foreground';
  };

  const addDataCategory = (category: Omit<DataCategory, 'id'>) => {
    const newCategory: DataCategory = {
      ...category,
      id: `cat-${Date.now()}`
    };
    setFootprint(prev => ({
      ...prev,
      employeeDataCategories: [...prev.employeeDataCategories, newCategory]
    }));
    toast.success('Data category added', 'New data category has been added to the assessment');
    setShowAddCategory(false);
  };

  const addAccountProfile = (account: Omit<AccountProfile, 'id'>) => {
    const newAccount: AccountProfile = {
      ...account,
      id: `acc-${Date.now()}`
    };
    setFootprint(prev => ({
      ...prev,
      accountProfiles: [...prev.accountProfiles, newAccount]
    }));
    toast.success('Account profile added', 'New account profile has been added');
    setShowAddAccount(false);
  };

  const deleteItem = (type: string, id: string) => {
    switch (type) {
      case 'category':
        setFootprint(prev => ({
          ...prev,
          employeeDataCategories: prev.employeeDataCategories.filter(c => c.id !== id)
        }));
        break;
      case 'account':
        setFootprint(prev => ({
          ...prev,
          accountProfiles: prev.accountProfiles.filter(a => a.id !== id)
        }));
        break;
      case 'activity':
        setFootprint(prev => ({
          ...prev,
          digitalActivities: prev.digitalActivities.filter(a => a.id !== id)
        }));
        break;
      case 'professional':
        setFootprint(prev => ({
          ...prev,
          professionalInfo: prev.professionalInfo.filter(p => p.id !== id)
        }));
        break;
      case 'organizational':
        setFootprint(prev => ({
          ...prev,
          organizationalData: prev.organizationalData.filter(o => o.id !== id)
        }));
        break;
    }
    toast.success('Item deleted', 'Item has been removed from the assessment');
  };

  const exportReport = async (format: 'json' | 'csv' | 'pdf') => {
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

    setIsExporting(true);
    try {
      const reportData = {
        metadata: {
          timestamp: new Date().toISOString(),
          assessmentId: `EDF-${Date.now()}`,
          version: '1.0',
          generatedBy: 'CyberCorrect Employee Digital Footprint Assessment'
        },
        assessment: footprint,
        summary: {
          totalDataCategories: footprint.employeeDataCategories.length,
          totalAccounts: footprint.accountProfiles.length,
          totalActivities: footprint.digitalActivities.length,
          riskScore: footprint.riskScore,
          exposureLevel: footprint.exposureLevel,
          complianceStatus: footprint.complianceStatus
        }
      };

      // Use export credits
      const creditsUsed = monetization.useExportCredits(format, 'Employee Digital Footprint Assessment');
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
        a.download = `employee-digital-footprint-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'JSON report downloaded');
      } else if (format === 'csv') {
        const csvRows: string[] = [];
        csvRows.push('Type,Name,Category,Sensitivity,Status');
        
        footprint.employeeDataCategories.forEach(cat => {
          csvRows.push(`Data Category,${cat.name},${cat.type},${cat.sensitivity},Active`);
        });
        
        footprint.accountProfiles.forEach(acc => {
          csvRows.push(`Account,${acc.platform},${acc.accountType},${acc.privacyLevel},${acc.status}`);
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `employee-digital-footprint-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'CSV report downloaded');
      } else if (format === 'pdf') {
        // PDF export would use jsPDF similar to SSP generator
        toast.info('PDF export', 'PDF export functionality coming soon');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', 'Please try again');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="py-8">
      <div className="mb-6">
        <Link to="/toolkit" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Toolkit
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Employee Digital Footprint Assessment</h1>
        <p className="text-muted-foreground">
          Assess and document employee digital footprint exposure for security awareness and compliance training
        </p>
      </div>

      {/* Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Risk Score</span>
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{footprint.riskScore}</div>
            <div className="text-xs text-muted-foreground mt-1">out of 100</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Exposure Level</span>
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div className={`text-lg font-semibold px-3 py-1 rounded-full inline-block ${getExposureColor(footprint.exposureLevel)}`}>
              {footprint.exposureLevel.toUpperCase()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Data Categories</span>
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{footprint.employeeDataCategories.length}</div>
            <div className="text-xs text-muted-foreground mt-1">categories tracked</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex border-b border-border overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'categories', label: 'Data Categories', icon: Database },
              { id: 'accounts', label: 'Account Profiles', icon: Users },
              { id: 'activities', label: 'Digital Activities', icon: Network },
              { id: 'professional', label: 'Professional Info', icon: Briefcase },
              { id: 'organizational', label: 'Organizational Data', icon: Building }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Data Inventory</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data Categories:</span>
                      <span className="font-medium">{footprint.employeeDataCategories.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Profiles:</span>
                      <span className="font-medium">{footprint.accountProfiles.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Digital Activities:</span>
                      <span className="font-medium">{footprint.digitalActivities.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Professional Records:</span>
                      <span className="font-medium">{footprint.professionalInfo.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Organizational Data:</span>
                      <span className="font-medium">{footprint.organizationalData.length}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Compliance Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">GDPR:</span>
                      <span className={`px-2 py-1 rounded text-xs capitalize ${footprint.complianceStatus.gdpr === 'compliant' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        {footprint.complianceStatus.gdpr.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">CCPA:</span>
                      <span className={`px-2 py-1 rounded text-xs capitalize ${footprint.complianceStatus.ccpa === 'compliant' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        {footprint.complianceStatus.ccpa.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">NIST:</span>
                      <span className={`px-2 py-1 rounded text-xs capitalize ${footprint.complianceStatus.nist === 'compliant' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        {footprint.complianceStatus.nist.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Export Assessment</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportReport('json')}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportReport('csv')}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportReport('pdf')}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {activeTab === 'categories' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Data Categories</span>
              <Button size="sm" onClick={() => setShowAddCategory(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {footprint.employeeDataCategories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No data categories added yet</p>
                <Button variant="outline" className="mt-4" onClick={() => setShowAddCategory(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Category
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {footprint.employeeDataCategories.map(category => (
                  <div key={category.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{category.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${getSensitivityColor(category.sensitivity)}`}>
                            {category.sensitivity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Type:</span> {category.type.replace('_', ' ')}
                        </div>
                        {category.examples.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs font-medium">Examples:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {category.examples.map((ex, idx) => (
                                <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                                  {ex}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteItem('category', category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'accounts' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Account Profiles</span>
              <Button size="sm" onClick={() => setShowAddAccount(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {footprint.accountProfiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No account profiles added yet</p>
                <Button variant="outline" className="mt-4" onClick={() => setShowAddAccount(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Account
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {footprint.accountProfiles.map(account => (
                  <div key={account.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{account.platform}</h4>
                          <span className="px-2 py-1 rounded text-xs bg-muted">
                            {account.accountType}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            account.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted'
                          }`}>
                            {account.status}
                          </span>
                        </div>
                        {account.username && (
                          <p className="text-sm text-muted-foreground">Username: {account.username}</p>
                        )}
                        {account.email && (
                          <p className="text-sm text-muted-foreground">Email: {account.email}</p>
                        )}
                        <div className="mt-2">
                          <span className="text-xs font-medium">Privacy Level:</span>
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            account.privacyLevel === 'public' ? 'bg-destructive/10 text-destructive' :
                            account.privacyLevel === 'private' ? 'bg-success/10 text-success' :
                            'bg-warning/10 text-warning'
                          }`}>
                            {account.privacyLevel}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteItem('account', account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Add Data Category</span>
                <Button variant="ghost" size="icon" onClick={() => setShowAddCategory(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddCategoryForm
                onSubmit={(category) => {
                  addDataCategory(category);
                }}
                onCancel={() => setShowAddCategory(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Add Account Profile</span>
                <Button variant="ghost" size="icon" onClick={() => setShowAddAccount(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddAccountForm
                onSubmit={(account) => {
                  addAccountProfile(account);
                }}
                onCancel={() => setShowAddAccount(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Information Card */}
      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">About Employee Digital Footprint Assessment</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This tool helps organizations assess employee digital footprint exposure for security awareness and compliance training. 
              Track data categories, account profiles, and digital activities to identify privacy risks and ensure compliance.
            </p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Identify high-sensitivity employee data</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Track account profiles and privacy levels</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Assess digital activity exposure</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Generate compliance reports</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Category Form Component
const AddCategoryForm = ({ onSubmit, onCancel }: { onSubmit: (category: Omit<DataCategory, 'id'>) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState<Omit<DataCategory, 'id'>>({
    name: '',
    type: 'personal_identifier',
    sensitivity: 'medium',
    description: '',
    examples: []
  });
  const [exampleInput, setExampleInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast.error('Validation error', 'Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  const addExample = () => {
    if (exampleInput.trim()) {
      setFormData(prev => ({
        ...prev,
        examples: [...prev.examples, exampleInput.trim()]
      }));
      setExampleInput('');
    }
  };

  const removeExample = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Category Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Employee Contact Information"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Type <span className="text-destructive">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DataCategory['type'] }))}
            required
          >
            <option value="personal_identifier">Personal Identifier</option>
            <option value="account_profile">Account Profile</option>
            <option value="digital_activity">Digital Activity</option>
            <option value="professional_info">Professional Info</option>
            <option value="organizational_data">Organizational Data</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Sensitivity <span className="text-destructive">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.sensitivity}
            onChange={(e) => setFormData(prev => ({ ...prev, sensitivity: e.target.value as DataCategory['sensitivity'] }))}
            required
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the data category..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Examples</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={exampleInput}
            onChange={(e) => setExampleInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addExample();
              }
            }}
            placeholder="Enter example and press Enter"
          />
          <Button type="button" onClick={addExample}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.examples.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.examples.map((ex, idx) => (
              <span key={idx} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
                {ex}
                <button
                  type="button"
                  onClick={() => removeExample(idx)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
    </form>
  );
};

// Add Account Form Component
const AddAccountForm = ({ onSubmit, onCancel }: { onSubmit: (account: Omit<AccountProfile, 'id'>) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState<Omit<AccountProfile, 'id'>>({
    platform: '',
    accountType: 'employee',
    username: '',
    email: '',
    status: 'active',
    privacyLevel: 'private',
    dataShared: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform) {
      toast.error('Validation error', 'Please enter a platform name');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Platform <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.platform}
          onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
          placeholder="e.g., LinkedIn, GitHub, Slack"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Account Type <span className="text-destructive">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.accountType}
            onChange={(e) => setFormData(prev => ({ ...prev, accountType: e.target.value as AccountProfile['accountType'] }))}
            required
          >
            <option value="corporate">Corporate</option>
            <option value="employee">Employee</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Status <span className="text-destructive">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as AccountProfile['status'] }))}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Privacy Level <span className="text-destructive">*</span>
        </label>
        <select
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.privacyLevel}
          onChange={(e) => setFormData(prev => ({ ...prev, privacyLevel: e.target.value as AccountProfile['privacyLevel'] }))}
          required
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="restricted">Restricted</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>
    </form>
  );
};

export default EmployeeDigitalFootprintAssessment;

