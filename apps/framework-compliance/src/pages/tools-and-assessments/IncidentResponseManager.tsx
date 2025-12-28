import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useJourneyTool } from '../../hooks/useJourneyTool';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { toast } from '../../components/ui/Toaster';
import { EmptyState } from '../../components/ui/EmptyState';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import {
  getPrivacyIncidents,
  createPrivacyIncident,
  exportToCSV,
  type PrivacyIncident,
} from '../../services/incidentService';
import { logError } from '../../utils/common/logger';
import { 
  AlertTriangle,
  Shield,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Plus,
  Eye,
  Edit,
  Download,
  Building,
  Loader2,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

// Using PrivacyIncident type from incidentService

const IncidentResponseManager = () => {
  // Journey tracking - automatically marks tool as started on mount
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { markCompleted } = useJourneyTool('incident-response-manager');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [privacyIncidents, setPrivacyIncidents] = useState<PrivacyIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    title: '',
    description: '',
    type: 'data_breach' as PrivacyIncident['type'],
    severity: 'medium' as PrivacyIncident['severity'],
    status: 'reported' as PrivacyIncident['status'],
    reportedDate: new Date().toISOString().split('T')[0],
    detectedDate: new Date().toISOString().split('T')[0],
    reportedBy: '',
    assignedTo: '',
    affectedDataSubjects: 0,
    affectedDataTypes: [] as string[],
    affectedSystems: [] as string[],
    rootCause: '',
    impact: ''
  });

  const incidentTypes = [
    { id: 'data_breach', name: 'Data Breach', color: 'red', icon: <Shield className="h-4 w-4" /> },
    { id: 'unauthorized_access', name: 'Unauthorized Access', color: 'orange', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'data_loss', name: 'Data Loss', color: 'amber', icon: <FileText className="h-4 w-4" /> },
    { id: 'privacy_violation', name: 'Privacy Violation', color: 'yellow', icon: <Eye className="h-4 w-4" /> },
    { id: 'consent_violation', name: 'Consent Violation', color: 'blue', icon: <Users className="h-4 w-4" /> },
    { id: 'vendor_incident', name: 'Vendor Incident', color: 'purple', icon: <Building className="h-4 w-4" /> }
  ];

  useEffect(() => {
    loadPrivacyIncidents();
  }, []);

  const loadPrivacyIncidents = async () => {
    try {
      setLoading(true);
      const loaded = await getPrivacyIncidents();
      setPrivacyIncidents(loaded);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Error loading privacy incidents'), { component: 'IncidentResponseManager' });
      toast.error('Load failed', 'Failed to load privacy incidents. Please refresh the page.');
      setPrivacyIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredIncidents = privacyIncidents.filter(incident => {
    const matchesType = selectedType === 'all' || incident.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' || incident.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || incident.status === selectedStatus;
    return matchesType && matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (severity: string) => {
    const className = 
      severity === 'critical' ? 'bg-destructive/10 text-destructive' :
      severity === 'high' ? 'bg-warning/10 text-warning' :
      severity === 'medium' ? 'bg-warning/10 text-warning' :
      'bg-success/10 text-success';
    
    return <Badge className={className}>{severity.charAt(0).toUpperCase() + severity.slice(1)}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const className = 
      status === 'resolved' || status === 'closed' ? 'bg-success/10 text-success' :
      status === 'contained' ? 'bg-primary/10 text-primary' :
      status === 'investigating' ? 'bg-warning/10 text-warning' :
      'bg-destructive/10 text-destructive';
    
    return <Badge className={className}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  // Calculate metrics
  const totalIncidents = privacyIncidents.length;
  const openIncidents = privacyIncidents.filter(i => i.status !== 'resolved' && i.status !== 'closed').length;
  const resolvedIncidents = privacyIncidents.filter(i => i.status === 'resolved' || i.status === 'closed').length;
  const highSeverityIncidents = privacyIncidents.filter(i => i.severity === 'high' || i.severity === 'critical').length;

  const handleCreateIncident = async () => {
    if (!incidentForm.title || !incidentForm.description) {
      toast.error('Validation Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const newIncident = await createPrivacyIncident({
        ...incidentForm,
        affectedDataSubjects: Number(incidentForm.affectedDataSubjects) || 0,
        affectedDataTypes: incidentForm.affectedDataTypes.filter(Boolean),
        affectedSystems: incidentForm.affectedSystems.filter(Boolean),
      });

      setPrivacyIncidents([...privacyIncidents, newIncident]);
      setShowIncidentForm(false);
      setIncidentForm({
        title: '',
        description: '',
        type: 'data_breach',
        severity: 'medium',
        status: 'reported',
        reportedDate: new Date().toISOString().split('T')[0],
        detectedDate: new Date().toISOString().split('T')[0],
        reportedBy: '',
        assignedTo: '',
        affectedDataSubjects: 0,
        affectedDataTypes: [],
        affectedSystems: [],
        rootCause: '',
        impact: ''
      });
      toast.success('Incident Created', 'Privacy incident has been successfully reported');
      setActiveTab('incidents');
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to create incident'), { component: 'IncidentResponseManager' });
      toast.error('Creation Failed', 'Failed to create incident. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          reportId: `INCIDENT-${Date.now()}`,
          version: '1.0'
        },
        summary: {
          totalIncidents,
          openIncidents,
          resolvedIncidents,
          highSeverityIncidents
        },
        incidents: privacyIncidents
      };

      const creditsUsed = monetization.useExportCredits(format, 'Incident Response Manager');
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
        a.download = `privacy-incidents-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'JSON report downloaded');
      } else if (format === 'csv') {
        const csv = exportToCSV(privacyIncidents);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `privacy-incidents-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'CSV report downloaded');
      } else if (format === 'pdf') {
        const { generateIncidentResponsePdf } = await import('../../utils/pdf');
        generateIncidentResponsePdf(reportData);
        toast.success('Export successful', 'PDF report downloaded');
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Export failed'), { component: 'IncidentResponseManager', operation: 'export' });
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
            <p className="text-muted-foreground">Loading privacy incidents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Incident Response Manager</h1>
        <p className="page-description">
          Track and manage privacy incidents, data breaches, and compliance violations
        </p>
      </div>

      <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="incidents">All Incidents</TabsTrigger>
          <TabsTrigger value="report">Report Incident</TabsTrigger>
          <TabsTrigger value="response">Response Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-2xl font-bold">{totalIncidents}</span>
                </div>
                <h3 className="font-semibold mb-1">Total Incidents</h3>
                <p className="text-sm text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-warning" />
                  </div>
                  <span className="text-2xl font-bold text-warning">
                    {openIncidents}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Open</h3>
                <p className="text-sm text-muted-foreground">Requiring attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <span className="text-2xl font-bold text-success">
                    {resolvedIncidents}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Resolved</h3>
                <p className="text-sm text-muted-foreground">This year</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <span className="text-2xl font-bold text-destructive">
                    {highSeverityIncidents}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">High Severity</h3>
                <p className="text-sm text-muted-foreground">This year</p>
              </CardContent>
            </Card>
          </div>

          {/* Incidents by Type */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Incidents by Type</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {incidentTypes.map((type) => {
                  const count = privacyIncidents.filter(i => i.type === type.id).length;
                  return (
                    <div key={type.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 bg-${type.color}-100 dark:bg-${type.color}-900/30 rounded-lg`}>
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{type.name}</h3>
                          <p className="text-2xl font-bold">{count}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Incidents */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
              <div className="space-y-4">
                {privacyIncidents
                  .sort((a, b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime())
                  .slice(0, 5)
                  .map((incident) => (
                    <div key={incident.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium">{incident.title}</h3>
                            {getSeverityBadge(incident.severity)}
                            {getStatusBadge(incident.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                          <div className="text-sm text-muted-foreground">
                            Reported: {incident.reportedDate} • Affected: {incident.affectedDataSubjects} data subjects
                          </div>
                        </div>
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

        <TabsContent value="incidents" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="incident-type-filter" className="sr-only">Filter by incident type</label>
                  <select
                    id="incident-type-filter"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    aria-label="Filter incidents by type"
                  >
                    <option value="all">All Types</option>
                    {incidentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="incident-severity-filter" className="sr-only">Filter by severity</label>
                  <select
                    id="incident-severity-filter"
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    aria-label="Filter incidents by severity"
                  >
                    <option value="all">All Severities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="incident-status-filter" className="sr-only">Filter by status</label>
                  <select
                    id="incident-status-filter"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    aria-label="Filter incidents by status"
                  >
                    <option value="all">All Status</option>
                    <option value="reported">Reported</option>
                    <option value="investigating">Investigating</option>
                    <option value="contained">Contained</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => setActiveTab('report')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Report Incident
                  </Button>
                  <Button variant="outline" onClick={() => exportReport('json')} disabled={isExporting}>
                    {isExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incidents List */}
          <div className="space-y-4">
            {filteredIncidents.length === 0 ? (
              <EmptyState
                icon={AlertTriangle}
                title="No Incidents Recorded"
                description="Click 'Report Incident' to create your first privacy incident record and begin tracking your response."
                action={{
                  label: "Report First Incident",
                  onClick: () => window.location.href = '/toolkit/incident-response',
                  icon: Plus
                }}
              />
            ) : (
              filteredIncidents.map((incident) => (
                <Card key={incident.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{incident.title}</h3>
                          {getSeverityBadge(incident.severity)}
                          {getStatusBadge(incident.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">Type:</span>
                            <div className="text-muted-foreground capitalize">{incident.type.replace('_', ' ')}</div>
                          </div>
                          <div>
                            <span className="font-medium">Reported:</span>
                            <div className="text-muted-foreground">{incident.reportedDate}</div>
                          </div>
                          <div>
                            <span className="font-medium">Assigned To:</span>
                            <div className="text-muted-foreground">{incident.assignedTo}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">Affected Data Subjects:</span>
                            <div className="text-muted-foreground">{incident.affectedDataSubjects}</div>
                          </div>
                          <div>
                            <span className="font-medium">Root Cause:</span>
                            <div className="text-muted-foreground">{incident.rootCause}</div>
                          </div>
                          <div>
                            <span className="font-medium">Impact:</span>
                            <div className="text-muted-foreground">{incident.impact}</div>
                          </div>
                        </div>

                        {/* Regulatory Notifications */}
                        {incident.regulatoryNotifications && (
                          <div className="mb-4">
                            <span className="font-medium text-sm">Regulatory Notifications:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.entries(incident.regulatoryNotifications).map(([framework, notification]) => (
                                notification && (
                                  <div key={framework} className="flex items-center gap-1">
                                    {notification.notified ? (
                                      <CheckCircle className="h-4 w-4 text-success" />
                                    ) : (
                                      <AlertTriangle className="h-4 w-4 text-destructive" />
                                    )}
                                    <span className="text-xs uppercase">{framework}</span>
                                  </div>
                                )
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Data Subject Notifications */}
                        {incident.dataSubjectNotifications?.required && (
                          <div className="mb-4">
                            <span className="font-medium text-sm">Data Subject Notifications: </span>
                            {incident.dataSubjectNotifications.sent ? (
                              <Badge className="bg-success/10 text-success">
                                Sent on {incident.dataSubjectNotifications.date || 'N/A'}
                              </Badge>
                            ) : (
                              <Badge className="bg-destructive/10 text-destructive">
                                Pending
                              </Badge>
                            )}
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

        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Report New Incident</h2>
              <div className="space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h3 className="font-medium text-primary mb-2">Incident Reporting Form</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use this form to report privacy incidents, data breaches, or compliance violations.
                    All incidents are tracked and managed through the incident response workflow.
                  </p>
                  <Button onClick={() => setShowIncidentForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Open Incident Form
                  </Button>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Required Information:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      'Incident type and description',
                      'Date and time of detection',
                      'Affected data subjects and data types',
                      'Initial impact assessment',
                      'Immediate containment actions',
                      'Regulatory notification requirements'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Incident Response Plan</h2>
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Detection & Reporting', description: 'Identify and report the incident immediately', timeframe: 'Immediate' },
                  { step: 2, title: 'Assessment & Classification', description: 'Assess severity and classify the incident', timeframe: 'Within 1 hour' },
                  { step: 3, title: 'Containment', description: 'Contain the incident to prevent further damage', timeframe: 'Within 4 hours' },
                  { step: 4, title: 'Investigation', description: 'Investigate root cause and full extent of impact', timeframe: 'Within 24 hours' },
                  { step: 5, title: 'Remediation', description: 'Remediate vulnerabilities and restore systems', timeframe: 'Within 72 hours' },
                  { step: 6, title: 'Notification', description: 'Notify regulatory authorities and data subjects as required', timeframe: 'Within 72 hours (GDPR)' },
                  { step: 7, title: 'Documentation', description: 'Document incident, response, and lessons learned', timeframe: 'Within 1 week' },
                  { step: 8, title: 'Post-Incident Review', description: 'Conduct post-incident review and implement improvements', timeframe: 'Within 2 weeks' }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <div className="text-xs text-muted-foreground">
                        Timeframe: {item.timeframe}
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Regulatory Notification Requirements</h2>
              <div className="space-y-4">
                {[
                  { framework: 'GDPR', timeframe: '72 hours', authority: 'Supervisory Authority', description: 'Notify supervisory authority within 72 hours of becoming aware of a personal data breach' },
                  { framework: 'CCPA', timeframe: 'As soon as possible', authority: 'California Attorney General', description: 'Notify affected consumers without unreasonable delay' },
                  { framework: 'HIPAA', timeframe: '60 days', authority: 'HHS & Affected Individuals', description: 'Notify HHS within 60 days and affected individuals within 60 days' },
                  { framework: 'State Breach Laws', timeframe: 'Varies by state', authority: 'State Attorney General', description: 'Comply with state-specific breach notification requirements' }
                ].map((req) => (
                  <div key={req.framework} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="info">{req.framework}</Badge>
                          <span className="font-medium">{req.framework} Notification</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{req.description}</p>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Timeframe: </span>{req.timeframe}
                          <span className="mx-2">•</span>
                          <span className="font-medium">Authority: </span>{req.authority}
                        </div>
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

      {/* Incident Creation Dialog */}
      <Dialog open={showIncidentForm} onOpenChange={setShowIncidentForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report New Privacy Incident</DialogTitle>
            <DialogDescription>
              Fill in the details below to report a new privacy incident or data breach.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Incident Title *</label>
              <Input
                value={incidentForm.title}
                onChange={(e) => setIncidentForm({ ...incidentForm, title: e.target.value })}
                placeholder="e.g., Unauthorized Access to Customer Database"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <Textarea
                value={incidentForm.description}
                onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                placeholder="Provide a detailed description of the incident..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Incident Type *</label>
                <select
                  value={incidentForm.type}
                  onChange={(e) => setIncidentForm({ ...incidentForm, type: e.target.value as PrivacyIncident['type'] })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  {incidentTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Severity *</label>
                <select
                  value={incidentForm.severity}
                  onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value as PrivacyIncident['severity'] })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Detected Date *</label>
                <Input
                  type="date"
                  value={incidentForm.detectedDate}
                  onChange={(e) => setIncidentForm({ ...incidentForm, detectedDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Reported Date *</label>
                <Input
                  type="date"
                  value={incidentForm.reportedDate}
                  onChange={(e) => setIncidentForm({ ...incidentForm, reportedDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reported By *</label>
                <Input
                  value={incidentForm.reportedBy}
                  onChange={(e) => setIncidentForm({ ...incidentForm, reportedBy: e.target.value })}
                  placeholder="Name or email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Assigned To</label>
                <Input
                  value={incidentForm.assignedTo}
                  onChange={(e) => setIncidentForm({ ...incidentForm, assignedTo: e.target.value })}
                  placeholder="Name or email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Affected Data Subjects</label>
              <Input
                type="number"
                value={incidentForm.affectedDataSubjects}
                onChange={(e) => setIncidentForm({ ...incidentForm, affectedDataSubjects: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Affected Data Types (comma-separated)</label>
              <Input
                value={incidentForm.affectedDataTypes.join(', ')}
                onChange={(e) => setIncidentForm({ ...incidentForm, affectedDataTypes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="e.g., Email addresses, Names, Phone numbers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Affected Systems (comma-separated)</label>
              <Input
                value={incidentForm.affectedSystems.join(', ')}
                onChange={(e) => setIncidentForm({ ...incidentForm, affectedSystems: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="e.g., Customer Database, Email Server"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Root Cause</label>
              <Textarea
                value={incidentForm.rootCause}
                onChange={(e) => setIncidentForm({ ...incidentForm, rootCause: e.target.value })}
                placeholder="Describe the root cause of the incident..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Impact</label>
              <Textarea
                value={incidentForm.impact}
                onChange={(e) => setIncidentForm({ ...incidentForm, impact: e.target.value })}
                placeholder="Describe the impact of the incident..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIncidentForm(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateIncident} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Report Incident
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncidentResponseManager;


