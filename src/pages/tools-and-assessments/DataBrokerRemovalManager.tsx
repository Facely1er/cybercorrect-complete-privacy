import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Database, 
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
  Clock,
  Mail,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { toast } from '../../components/ui/Toaster';
import { secureStorage } from '../../utils/secureStorage';

interface DataBroker {
  id: string;
  name: string;
  website: string;
  category: 'people_search' | 'background_check' | 'data_aggregator' | 'marketing' | 'other';
  dataTypes: string[];
  removalStatus: 'pending' | 'in_progress' | 'completed' | 'failed' | 'not_started';
  requestDate?: string;
  completionDate?: string;
  removalMethod: 'email' | 'online_form' | 'mail' | 'phone' | 'other';
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
    formUrl?: string;
  };
  notes: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number; // days
}

interface OptOutTemplate {
  id: string;
  brokerName: string;
  templateType: 'email' | 'letter' | 'form';
  subject?: string;
  content: string;
  requiredInfo: string[];
  instructions: string;
}

interface DataBrokerRemovalData {
  brokers: DataBroker[];
  optOutTemplates: OptOutTemplate[];
  totalRemoved: number;
  totalPending: number;
  lastUpdated: string;
  organizationName: string;
}

const DataBrokerRemovalManager = () => {
  const [data, setData] = useState<DataBrokerRemovalData>(() => {
    const saved = secureStorage.getItem<DataBrokerRemovalData>('data_broker_removal_data');
    return saved || {
      brokers: [],
      optOutTemplates: [],
      totalRemoved: 0,
      totalPending: 0,
      lastUpdated: new Date().toISOString(),
      organizationName: ''
    };
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'brokers' | 'templates' | 'tracking'>('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [showAddBroker, setShowAddBroker] = useState(false);
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [editingBroker, setEditingBroker] = useState<DataBroker | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<OptOutTemplate | null>(null);

  // Auto-save data
  useEffect(() => {
    secureStorage.setItem('data_broker_removal_data', data);
    updateStats();
  }, [data]);

  const updateStats = () => {
    const totalRemoved = data.brokers.filter(b => b.removalStatus === 'completed').length;
    const totalPending = data.brokers.filter(b => 
      b.removalStatus === 'pending' || b.removalStatus === 'in_progress'
    ).length;
    
    setData(prev => ({
      ...prev,
      totalRemoved,
      totalPending,
      lastUpdated: new Date().toISOString()
    }));
  };

  const addBroker = (broker: Omit<DataBroker, 'id'>) => {
    const newBroker: DataBroker = {
      ...broker,
      id: `broker-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      brokers: [...prev.brokers, newBroker]
    }));
    toast.success('Broker added', 'Data broker has been added to tracking');
  };

  const updateBroker = (id: string, updates: Partial<DataBroker>) => {
    setData(prev => ({
      ...prev,
      brokers: prev.brokers.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
    toast.success('Broker updated', 'Data broker information has been updated');
  };

  const deleteBroker = (id: string) => {
    setData(prev => ({
      ...prev,
      brokers: prev.brokers.filter(b => b.id !== id)
    }));
    toast.success('Broker removed', 'Data broker has been removed from tracking');
  };

  const addTemplate = (template: Omit<OptOutTemplate, 'id'>) => {
    const newTemplate: OptOutTemplate = {
      ...template,
      id: `template-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      optOutTemplates: [...prev.optOutTemplates, newTemplate]
    }));
    toast.success('Template added', 'Opt-out template has been created');
  };

  const updateTemplate = (id: string, updates: Partial<OptOutTemplate>) => {
    setData(prev => ({
      ...prev,
      optOutTemplates: prev.optOutTemplates.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
    toast.success('Template updated', 'Opt-out template has been updated');
  };

  const deleteTemplate = (id: string) => {
    setData(prev => ({
      ...prev,
      optOutTemplates: prev.optOutTemplates.filter(t => t.id !== id)
    }));
    toast.success('Template deleted', 'Opt-out template has been removed');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'not_started': 'bg-muted text-muted-foreground',
      'pending': 'bg-warning/10 text-warning',
      'in_progress': 'bg-primary/10 text-primary',
      'completed': 'bg-success/10 text-success',
      'failed': 'bg-destructive/10 text-destructive'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-destructive/10 text-destructive',
      'medium': 'bg-warning/10 text-warning',
      'low': 'bg-success/10 text-success'
    };
    return colors[priority] || 'bg-muted text-muted-foreground';
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
          reportId: `DBR-${Date.now()}`,
          version: '1.0',
          generatedBy: 'CyberCorrect Data Broker Removal Manager'
        },
        data,
        summary: {
          totalBrokers: data.brokers.length,
          totalRemoved: data.totalRemoved,
          totalPending: data.totalPending,
          totalTemplates: data.optOutTemplates.length
        }
      };

      const creditsUsed = monetization.useExportCredits(format, 'Data Broker Removal Manager');
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
        a.download = `data-broker-removal-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'JSON report downloaded');
      } else if (format === 'csv') {
        const csvRows: string[] = [];
        csvRows.push('Broker Name,Category,Status,Priority,Request Date,Completion Date');
        
        data.brokers.forEach(broker => {
          csvRows.push(`${broker.name},${broker.category},${broker.removalStatus},${broker.priority},${broker.requestDate || ''},${broker.completionDate || ''}`);
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `data-broker-removal-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'CSV report downloaded');
      } else if (format === 'pdf') {
        toast.info('PDF Export', 'PDF export functionality is currently under development. You can export your data broker removal data using the Word export option available in the export menu.');
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
        <h1 className="text-3xl font-bold mb-2 text-foreground">Data Broker Removal Manager</h1>
        <p className="text-muted-foreground">
          Track and manage organizational data removal requests from data brokers and vendors
        </p>
      </div>

      {/* Overview Stats */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Brokers</p>
                  <p className="text-2xl font-bold text-foreground">{data.brokers.length}</p>
                </div>
                <Database className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Removed</p>
                  <p className="text-2xl font-bold text-success">{data.totalRemoved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">{data.totalPending}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Templates</p>
                  <p className="text-2xl font-bold text-primary">{data.optOutTemplates.length}</p>
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
            { id: 'brokers', label: 'Data Brokers', icon: Database },
            { id: 'templates', label: 'Opt-Out Templates', icon: FileText },
            { id: 'tracking', label: 'Tracking', icon: RefreshCw }
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
      {activeTab === 'brokers' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Data Brokers</CardTitle>
              <Button onClick={() => setShowAddBroker(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Broker
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {data.brokers.length === 0 ? (
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No data brokers tracked yet</p>
                <Button onClick={() => setShowAddBroker(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Broker
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {data.brokers.map(broker => (
                  <div key={broker.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{broker.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(broker.removalStatus)}`}>
                            {broker.removalStatus.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(broker.priority)}`}>
                            {broker.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Category: {broker.category.replace('_', ' ')}</p>
                        {broker.website && (
                          <a href={broker.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            {broker.website}
                          </a>
                        )}
                        {broker.requestDate && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Request Date: {new Date(broker.requestDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingBroker(broker)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteBroker(broker.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
            <h3 className="font-semibold mb-2">About Data Broker Removal Manager</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This tool helps organizations track and manage data removal requests from data brokers and vendors. 
              Monitor removal status, create opt-out templates, and maintain compliance with privacy regulations.
            </p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Track data broker removal requests</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Create and manage opt-out templates</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Monitor removal status and progress</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Export removal reports</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataBrokerRemovalManager;

