import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Settings, 
  ArrowLeft,
  AlertTriangle,
  Download,
  CheckCircle,
  X,
  Shield,
  FileText,
  Database,
  Users,
  Globe,
  Lock,
  Eye
} from 'lucide-react';
import { toast } from '../../components/ui/Toaster';
import { secureStorage } from '../../utils/secureStorage';

interface PlatformConfig {
  id: string;
  platform: string;
  category: 'social_media' | 'cloud_storage' | 'collaboration' | 'analytics' | 'marketing' | 'other';
  status: 'configured' | 'needs_review' | 'not_configured' | 'non_applicable';
  privacyLevel: 'high' | 'medium' | 'low' | 'unknown';
  lastAudited?: string;
  settings: {
    dataSharing: 'enabled' | 'disabled' | 'limited' | 'unknown';
    publicProfile: 'enabled' | 'disabled' | 'unknown';
    thirdPartyAccess: 'enabled' | 'disabled' | 'limited' | 'unknown';
    dataRetention: 'configured' | 'default' | 'unknown';
    encryption: 'enabled' | 'disabled' | 'unknown';
  };
  complianceNotes: string;
  actionItems: string[];
}

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable';
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

interface PrivacySettingsAuditData {
  platforms: PlatformConfig[];
  checklist: ChecklistItem[];
  overallScore: number;
  lastAudited: string;
  organizationName: string;
  auditBy: string;
}

const PrivacySettingsAudit = () => {
  const [data, setData] = useState<PrivacySettingsAuditData>(() => {
    const saved = secureStorage.getItem<PrivacySettingsAuditData>('privacy_settings_audit_data');
    return saved || {
      platforms: [],
      checklist: [],
      overallScore: 0,
      lastAudited: new Date().toISOString(),
      organizationName: '',
      auditBy: 'Privacy Officer'
    };
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'platforms' | 'checklist' | 'recommendations'>('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig | null>(null);

  // Auto-save data
  useEffect(() => {
    secureStorage.setItem('privacy_settings_audit_data', data);
    calculateScore();
  }, [data]);

  const calculateScore = () => {
    if (data.platforms.length === 0 && data.checklist.length === 0) {
      setData(prev => ({ ...prev, overallScore: 0 }));
      return;
    }

    let totalScore = 0;
    let maxScore = 0;

    // Calculate from platforms
    data.platforms.forEach(platform => {
      maxScore += 100;
      if (platform.status === 'configured' && platform.privacyLevel === 'high') {
        totalScore += 100;
      } else if (platform.status === 'configured' && platform.privacyLevel === 'medium') {
        totalScore += 75;
      } else if (platform.status === 'needs_review') {
        totalScore += 50;
      } else if (platform.status === 'not_configured') {
        totalScore += 25;
      }
    });

    // Calculate from checklist
    data.checklist.forEach(item => {
      maxScore += 100;
      if (item.status === 'compliant') {
        totalScore += 100;
      } else if (item.status === 'partial') {
        totalScore += 50;
      } else if (item.status === 'non_compliant') {
        totalScore += 0;
      }
    });

    const score = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    setData(prev => ({ ...prev, overallScore: score }));
  };

  const addPlatform = (platform: Omit<PlatformConfig, 'id'>) => {
    const newPlatform: PlatformConfig = {
      ...platform,
      id: `platform-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      platforms: [...prev.platforms, newPlatform]
    }));
    toast.success('Platform added', 'Platform has been added to audit');
  };

  const updatePlatform = (id: string, updates: Partial<PlatformConfig>) => {
    setData(prev => ({
      ...prev,
      platforms: prev.platforms.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
    toast.success('Platform updated', 'Platform configuration has been updated');
  };

  const deletePlatform = (id: string) => {
    setData(prev => ({
      ...prev,
      platforms: prev.platforms.filter(p => p.id !== id)
    }));
    toast.success('Platform removed', 'Platform has been removed from audit');
  };

  const addChecklistItem = (item: Omit<ChecklistItem, 'id'>) => {
    const newItem: ChecklistItem = {
      ...item,
      id: `checklist-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      checklist: [...prev.checklist, newItem]
    }));
    toast.success('Checklist item added', 'Item has been added to checklist');
  };

  const updateChecklistItem = (id: string, updates: Partial<ChecklistItem>) => {
    setData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
    toast.success('Checklist item updated', 'Item has been updated');
  };

  const deleteChecklistItem = (id: string) => {
    setData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== id)
    }));
    toast.success('Checklist item removed', 'Item has been removed from checklist');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'configured': 'bg-success/10 text-success',
      'needs_review': 'bg-warning/10 text-warning',
      'not_configured': 'bg-destructive/10 text-destructive',
      'non_applicable': 'bg-muted text-muted-foreground',
      'compliant': 'bg-success/10 text-success',
      'partial': 'bg-warning/10 text-warning',
      'non_compliant': 'bg-destructive/10 text-destructive',
      'not_applicable': 'bg-muted text-muted-foreground'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
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
          reportId: `PSA-${Date.now()}`,
          version: '1.0',
          generatedBy: 'CyberCorrect Privacy Settings Audit'
        },
        data,
        summary: {
          overallScore: data.overallScore,
          totalPlatforms: data.platforms.length,
          configuredPlatforms: data.platforms.filter(p => p.status === 'configured').length,
          totalChecklistItems: data.checklist.length,
          compliantItems: data.checklist.filter(i => i.status === 'compliant').length
        }
      };

      const creditsUsed = monetization.useExportCredits(format, 'Privacy Settings Audit');
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
        a.download = `privacy-settings-audit-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'JSON report downloaded');
      } else if (format === 'csv') {
        const csvRows: string[] = [];
        csvRows.push('Platform,Category,Status,Privacy Level,Last Audited');
        
        data.platforms.forEach(platform => {
          csvRows.push(`${platform.platform},${platform.category},${platform.status},${platform.privacyLevel},${platform.lastAudited || ''}`);
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `privacy-settings-audit-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'CSV report downloaded');
      } else if (format === 'pdf') {
        toast.info('PDF Export', 'PDF export functionality is currently under development. You can export your privacy settings audit data using the Word export option available in the export menu.');
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
        <h1 className="text-3xl font-bold mb-2 text-foreground">Privacy Settings Audit</h1>
        <p className="text-muted-foreground">
          Audit and configure organizational privacy settings across platforms and services
        </p>
      </div>

      {/* Overview Stats */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(data.overallScore)}`}>
                    {data.overallScore}%
                  </p>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Platforms</p>
                  <p className="text-2xl font-bold text-foreground">{data.platforms.length}</p>
                </div>
                <Globe className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Configured</p>
                  <p className="text-2xl font-bold text-success">
                    {data.platforms.filter(p => p.status === 'configured').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Checklist Items</p>
                  <p className="text-2xl font-bold text-primary">{data.checklist.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 border-b border-border">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'platforms', label: 'Platforms', icon: Globe },
            { id: 'checklist', label: 'Checklist', icon: FileText },
            { id: 'recommendations', label: 'Recommendations', icon: AlertTriangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'platforms' && (
        <Card>
          <CardHeader>
            <CardTitle>Platform Configurations</CardTitle>
          </CardHeader>
          <CardContent>
            {data.platforms.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No platforms configured yet</p>
                <Button onClick={() => {/* Add platform modal */}}>
                  Add First Platform
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {data.platforms.map(platform => (
                  <div key={platform.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{platform.platform}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(platform.status)}`}>
                            {platform.status.replace('_', ' ')}
                          </span>
                          <span className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground">
                            {platform.category.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Privacy Level: <span className="font-medium">{platform.privacyLevel}</span>
                        </p>
                        {platform.lastAudited && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Last Audited: {new Date(platform.lastAudited).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedPlatform(platform)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Export Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => exportReport('json')}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button
                variant="outline"
                onClick={() => exportReport('csv')}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => exportReport('pdf')}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">About Privacy Settings Audit</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This tool helps organizations audit and configure privacy settings across platforms and services. 
              Track platform configurations, maintain compliance checklists, and ensure proper privacy controls.
            </p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Audit platform privacy settings</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Maintain compliance checklists</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Track configuration status</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Export audit reports</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsAudit;

