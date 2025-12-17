import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Users, 
  ArrowLeft, 
  AlertTriangle,
  Eye,
  Edit,
  Download,
  Upload,
  Plus,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  Mail,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from '../../components/ui/Toaster';
import { secureStorage } from '../../utils/storage';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { ImportDialog } from '../../components/ui/ImportDialog';
import { validators } from '../../utils/import/jsonValidator';
import { required, email, minLength, combine } from '../../utils/validation';
import { logError } from '../../utils/common/logger';
import {
  getDataSubjectRequests,
  createDataSubjectRequest,
  updateDataSubjectRequest,
  exportToCSV,
  calculateSLADeadline,
  getMostUrgentSLA,
  type DataSubjectRequest,
} from '../../services/dsarService';
import { useJourney } from '../../context/JourneyContext';
import JourneyProgressTracker from '../../components/onboarding/JourneyProgressTracker';

const PrivacyRightsManager = () => {
  const { markToolStarted, markToolCompleted, currentStepIndex, completedSteps } = useJourney();
  const [requests, setRequests] = useState<DataSubjectRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const newRequestFormRef = useRef<HTMLDivElement>(null);

  // Mark tool as started when component mounts
  useEffect(() => {
    markToolStarted('privacy-rights-manager');
  }, [markToolStarted]);

  // Load requests on mount
  useEffect(() => {
    loadRequests();
  }, []);

  // Save selected request to localStorage for persistence
  useEffect(() => {
    if (selectedRequest) {
      secureStorage.setItem('privacy_rights_selected_request', selectedRequest);
    }
  }, [selectedRequest]);

  const loadRequests = async () => {
    try {
      const loaded = await getDataSubjectRequests();
      setRequests(loaded);
      
      // Restore selected request from localStorage
      const savedSelected = secureStorage.getItem<string | null>('privacy_rights_selected_request', null);
      if (savedSelected && loaded.some(r => r.id === savedSelected)) {
        setSelectedRequest(savedSelected);
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Error loading requests'), { component: 'PrivacyRightsManager' });
      toast.error('Load failed', 'Failed to load data subject requests. Please refresh the page.');
    }
  };

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    requestId: string;
    status: DataSubjectRequest['status'];
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // New request form state
  const [newRequest, setNewRequest] = useState<Partial<DataSubjectRequest>>({
    requestType: 'access',
    requesterName: '',
    requesterEmail: '',
    description: '',
    priority: 'medium',
    assignedTo: 'Data Protection Officer'
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState<{
    requesterName?: string;
    requesterEmail?: string;
    description?: string;
  }>({});


  const getRequestTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'access': 'bg-primary/10 text-primary',
      'rectification': 'bg-success/10 text-success',
      'erasure': 'bg-destructive/10 text-destructive',
      'portability': 'bg-accent/10 text-accent',
      'restriction': 'bg-warning/10 text-warning',
      'objection': 'bg-warning/10 text-warning'
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-warning/10 text-warning',
      'in_progress': 'bg-primary/10 text-primary',
      'completed': 'bg-success/10 text-success',
      'rejected': 'bg-destructive/10 text-destructive'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'access': return <Eye className="h-4 w-4" />;
      case 'rectification': return <Edit className="h-4 w-4" />;
      case 'erasure': return <AlertTriangle className="h-4 w-4" />;
      case 'portability': return <Download className="h-4 w-4" />;
      case 'restriction': return <Shield className="h-4 w-4" />;
      case 'objection': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: DataSubjectRequest['status']) => {
    // Show confirmation dialog for rejected status
    if (newStatus === 'rejected') {
      setConfirmDialog({
        open: true,
        requestId,
        status: newStatus
      });
      return;
    }

    // For other statuses, update via service
    try {
      setSaving(true);
      const updates: Partial<DataSubjectRequest> = { status: newStatus };
      
      // Set completed date if status is completed
      if (newStatus === 'completed') {
        updates.completedDate = new Date().toISOString().split('T')[0];
      }

      const updated = await updateDataSubjectRequest(requestId, updates);
      setRequests(prev => prev.map(req => req.id === requestId ? updated : req));
      toast.success('Status updated', `Request ${updated.requestId} status changed to ${newStatus}`);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Error updating status'), { component: 'PrivacyRightsManager', operation: 'updateStatus' });
      toast.error('Update failed', error instanceof Error ? error.message : 'Failed to update request status');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!confirmDialog) return;

    try {
      setSaving(true);
      const updates: Partial<DataSubjectRequest> = {
        status: confirmDialog.status,
      };
      
      if (confirmDialog.status === 'rejected' && rejectionReason) {
        updates.notes = rejectionReason;
      }

      const updated = await updateDataSubjectRequest(confirmDialog.requestId, updates);
      setRequests(prev => prev.map(req => req.id === confirmDialog.requestId ? updated : req));

      toast.success(
        'Request Rejected',
        `Request ${confirmDialog.requestId} has been rejected${rejectionReason ? ' with reason provided' : ''}`
      );
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Error rejecting request'), { component: 'PrivacyRightsManager', operation: 'rejectRequest' });
      toast.error('Update failed', error instanceof Error ? error.message : 'Failed to reject request');
    } finally {
      setSaving(false);
      setConfirmDialog(null);
      setRejectionReason('');
    }
  };

  // Validate individual field
  const validateField = (fieldName: 'requesterName' | 'requesterEmail' | 'description', value: string) => {
    let error: string | undefined;

    switch (fieldName) {
      case 'requesterName': {
        const nameResult = combine(
          required('Requester name'),
          minLength(2, 'Requester name')
        )(value);
        error = nameResult.error;
        break;
      }
      case 'requesterEmail': {
        const emailResult = combine(
          required('Email'),
          email
        )(value);
        error = emailResult.error;
        break;
      }
      case 'description': {
        const descResult = combine(
          required('Description'),
          minLength(10, 'Description')
        )(value);
        error = descResult.error;
        break;
      }
    }

    setFormErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    return !error;
  };

  // Handle field blur for real-time validation
  const handleFieldBlur = (fieldName: 'requesterName' | 'requesterEmail' | 'description') => {
    const value = newRequest[fieldName] as string || '';
    validateField(fieldName, value);
  };

  // Handle field change and clear errors
  const handleFieldChange = (fieldName: 'requesterName' | 'requesterEmail' | 'description', value: string) => {
    setNewRequest({ ...newRequest, [fieldName]: value });

    // Clear error when user starts typing
    if (formErrors[fieldName]) {
      setFormErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handleCreateRequest = async () => {
    // Validate all fields
    const nameValid = validateField('requesterName', newRequest.requesterName || '');
    const emailValid = validateField('requesterEmail', newRequest.requesterEmail || '');
    const descValid = validateField('description', newRequest.description || '');

    if (!nameValid || !emailValid || !descValid) {
      toast.error('Validation Error', 'Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);
      const today = new Date().toISOString().split('T')[0];
      
      const newRequestItem = await createDataSubjectRequest({
        requestType: newRequest.requestType!,
        status: 'submitted',
        priority: newRequest.priority!,
        requesterName: newRequest.requesterName!,
        requesterEmail: newRequest.requesterEmail!,
        description: newRequest.description!,
        applicableRegulations: ['GDPR'], // Default to GDPR, can be made configurable
        submittedDate: today,
        assignedTo: newRequest.assignedTo || 'Data Protection Officer',
      });

      setRequests(prev => [...prev, newRequestItem]);
      
      // Mark tool as completed when first request is created
      if (requests.length === 0) {
        markToolCompleted('privacy-rights-manager');
      }
      
      setShowNewRequest(false);
      setNewRequest({
        requestType: 'access',
        requesterName: '',
        requesterEmail: '',
        description: '',
        priority: 'medium',
        assignedTo: 'Data Protection Officer'
      });
      setFormErrors({});
      toast.success('Request Created', `New data subject request ${newRequestItem.requestId} has been created`);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Error creating request'), { component: 'PrivacyRightsManager', operation: 'createRequest' });
      toast.error('Create failed', error instanceof Error ? error.message : 'Failed to create request');
    } finally {
      setSaving(false);
    }
  };

  const handleImportData = async (importedData: Partial<DataSubjectRequest>[]) => {
    try {
      let importedCount = 0;
      
      for (const item of importedData) {
        const newRequest = {
          requestType: item.requestType || 'access',
          requesterName: item.requesterName || 'Unknown',
          requesterEmail: item.requesterEmail || '',
          description: item.description || '',
          submittedDate: item.submittedDate || new Date().toISOString().split('T')[0],
          status: (item.status || 'submitted') as 'submitted' | 'acknowledged' | 'in_progress' | 'completed' | 'rejected' | 'cancelled',
          priority: item.priority || 'medium',
          applicableRegulations: item.applicableRegulations || ['GDPR'],
        };

        await createDataSubjectRequest(newRequest);
        importedCount++;
      }

      // Reload all requests
      await loadRequests();

      toast.success(
        'Import Successful',
        `Imported ${importedCount} data subject request(s)`
      );
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data subject requests');
    }
  };

  const handleExportReport = async (format: 'json' | 'pdf' | 'csv' = 'json') => {
    if (requests.length === 0) {
      toast.error('No data', 'No data subject requests to export');
      return;
    }

    setIsExporting(true);
    try {
      if (format === 'csv') {
        const csv = exportToCSV(requests);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dsar-requests-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Report Exported', 'Data subject rights report has been exported as CSV');
      } else if (format === 'json') {
        const pendingRequests = requests.filter(r => r.status === 'submitted' || r.status === 'acknowledged').length;
        const inProgressRequests = requests.filter(r => r.status === 'in_progress').length;
        const completedRequests = requests.filter(r => r.status === 'completed').length;
        
        const exportData = {
          metadata: {
            timestamp: new Date().toISOString(),
            reportId: `PRR-${Date.now()}`,
            version: '1.0'
          },
          summary: {
            totalRequests: requests.length,
            pendingRequests,
            inProgressRequests,
            completedRequests,
          },
          requests: requests.map(r => ({
            id: r.id,
            requestId: r.requestId,
            type: r.requestType,
            requesterName: r.requesterName,
            requesterEmail: r.requesterEmail,
            status: r.status,
            priority: r.priority,
            submittedDate: r.submittedDate,
            dueDate: r.dueDate,
            completedDate: r.completedDate,
            applicableRegulations: r.applicableRegulations,
          }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `privacy-rights-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Report Exported', 'Data subject rights report has been exported successfully');
      } else if (format === 'pdf') {
        const { generatePrivacyRightsPdf } = await import('../../utils/pdf');
        const completedRequests = requests.filter(r => r.status === 'completed');
        const totalDays = completedRequests.reduce((sum, r) => {
          if (r.submittedDate && r.completedDate) {
            const submitted = new Date(r.submittedDate);
            const completed = new Date(r.completedDate);
            return sum + Math.ceil((completed.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
          }
          return sum;
        }, 0);
        const averageProcessingTime = completedRequests.length > 0 
          ? `${Math.round(totalDays / completedRequests.length)} days`
          : '0 days';
        
        const exportData = {
          metadata: {
            timestamp: new Date().toISOString(),
            reportId: `PRR-${Date.now()}`,
            version: '1.0'
          },
          summary: {
            totalRequests: requests.length,
            pendingRequests: requests.filter(r => r.status === 'submitted' || r.status === 'acknowledged').length,
            completedRequests: completedRequests.length,
            averageProcessingTime,
          },
          requests: requests.map(r => ({
            id: r.id || '',
            requestId: r.requestId,
            type: r.requestType,
            requesterName: r.requesterName,
            status: r.status,
            submittedDate: r.submittedDate,
            completedDate: r.completedDate
          }))
        };
        generatePrivacyRightsPdf(exportData);
        toast.success('Report Exported', 'PDF report downloaded');
      }
    } catch (error) {
      toast.error('Export Failed', error instanceof Error ? error.message : 'Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle keyboard navigation for cards
  const handleCardKeyDown = (e: React.KeyboardEvent, requestId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedRequest(requestId);
    }
  };

  return (
    <div className="page-container">
      <JourneyProgressTracker 
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
        compact={true}
        showNextAction={true}
      />
      <div className="page-header">
        <Link to="/toolkit" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Toolkit
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">Privacy Rights Manager</h1>
            <p className="page-description">
              Manage data subject rights requests and ensure timely compliance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowNewRequest(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
            <Button variant="outline" onClick={() => setShowImportDialog(true)} title="Import Requests">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" onClick={() => handleExportReport('csv')} disabled={isExporting || requests.length === 0}>
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => handleExportReport('json')} disabled={isExporting || requests.length === 0}>
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => handleExportReport('pdf')} disabled={isExporting || requests.length === 0} className="border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20">
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-warning">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-warning">
                  {requests.filter(req => req.status === 'submitted' || req.status === 'acknowledged').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-primary">
                  {requests.filter(req => req.status === 'in_progress').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-success">
                  {requests.filter(req => req.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Response</p>
                <p className="text-3xl font-bold text-accent">18</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Data Subject Requests ({requests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No Requests Yet"
                  description="Get started by creating your first data subject rights request"
                  action={{
                    label: "Create First Request",
                    onClick: () => setShowNewRequest(true),
                    icon: Plus
                  }}
                />
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <Card 
                      key={request.id} 
                      className={`cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        selectedRequest === request.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedRequest(request.id || null)}
                      onKeyDown={(e) => handleCardKeyDown(e, request.id || '')}
                      tabIndex={0}
                      role="button"
                      aria-label={`Select request ${request.id || 'unknown'} from ${request.requesterName}`}
                    >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-semibold text-primary">{request.requestId || request.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getRequestTypeColor(request.requestType)}`}>
                            {getRequestTypeIcon(request.requestType)}
                            <span className="ml-1 capitalize">{request.requestType}</span>
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right text-sm">
                          {request.dueDate && (
                            <>
                              <div className="font-semibold text-foreground">Due: {new Date(request.dueDate).toLocaleDateString()}</div>
                              <div className="text-muted-foreground">
                                {Math.ceil((new Date(request.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-foreground mb-2">{request.requesterName}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="font-medium">Email:</span>
                          <div className="text-muted-foreground">{request.requesterEmail}</div>
                        </div>
                        <div>
                          <span className="font-medium">Assigned To:</span>
                          <div className="text-muted-foreground">{request.assignedTo}</div>
                        </div>
                      </div>
                    </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Request Details Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-primary" />
                Request Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRequest ? (
                <div className="space-y-4">
                  {(() => {
                    const request = requests.find(r => r.id === selectedRequest);
                    if (!request) return null;
                    
                    return (
                      <>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">{request.requestId || request.id}</h3>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <div className="font-medium capitalize">{request.requestType}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Priority:</span>
                            <div className="font-medium capitalize">{request.priority}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Submitted:</span>
                            <div className="font-medium">{new Date(request.submittedDate).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Due:</span>
                            <div className="font-medium">{new Date(request.dueDate).toLocaleDateString()}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Requester Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-primary mr-2" />
                              <span>{request.requesterName}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 text-primary mr-2" />
                              <span>{request.requesterEmail}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">SLA Information</h4>
                          <div className="space-y-2 text-sm">
                            {(() => {
                              const slaInfo = calculateSLADeadline(request.submittedDate, request.applicableRegulations);
                              const mostUrgent = getMostUrgentSLA(slaInfo);
                              if (mostUrgent) {
                                return (
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Deadline:</span>
                                      <span className="font-medium">{new Date(mostUrgent.dueDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Days Remaining:</span>
                                      <span className={`font-medium ${mostUrgent.isOverdue ? 'text-destructive' : mostUrgent.daysRemaining <= 7 ? 'text-warning' : 'text-success'}`}>
                                        {mostUrgent.daysRemaining} days
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Regulation:</span>
                                      <span className="font-medium">{mostUrgent.regulation}</span>
                                    </div>
                                    {mostUrgent.isOverdue && (
                                      <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded text-xs">
                                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                                        Overdue - Immediate action required
                                      </div>
                                    )}
                                  </>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Status Actions</h4>
                          <div className="space-y-2">
                            {['submitted', 'acknowledged', 'in_progress', 'completed', 'rejected'].map(status => (
                              <Button
                                key={status}
                                variant={request.status === status ? 'default' : 'outline'}
                                size="sm"
                                className="w-full"
                                onClick={() => handleStatusUpdate(request.id!, status as DataSubjectRequest['status'])}
                                disabled={saving}
                              >
                                {status.replace('_', ' ').toUpperCase()}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a request to view details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Request Modal */}
      {showNewRequest && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowNewRequest(false)}
        >
          <Card 
            ref={newRequestFormRef}
            className="w-full max-w-2xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Create New Data Subject Request</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowNewRequest(false)}
                  aria-label="Close new request dialog"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="request-type-select" className="block text-sm font-medium mb-2">
                    Request Type <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="request-type-select"
                    title="Select request type"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={newRequest.requestType}
                    onChange={(e) => setNewRequest({ ...newRequest, requestType: e.target.value as DataSubjectRequest['requestType'] })}
                  >
                    <option value="access">Access</option>
                    <option value="rectification">Rectification</option>
                    <option value="erasure">Erasure</option>
                    <option value="portability">Portability</option>
                    <option value="restriction">Restriction</option>
                    <option value="objection">Objection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Requester Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 ${
                      formErrors.requesterName
                        ? 'border-destructive focus:ring-destructive'
                        : 'border-border focus:ring-primary'
                    }`}
                    value={newRequest.requesterName}
                    onChange={(e) => handleFieldChange('requesterName', e.target.value)}
                    onBlur={() => handleFieldBlur('requesterName')}
                    placeholder="Enter requester's name"
                    {...(formErrors.requesterName && { 'aria-invalid': true, 'aria-describedby': 'requesterName-error' })}
                  />
                  {formErrors.requesterName && (
                    <p id="requesterName-error" className="text-destructive text-sm mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.requesterName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Requester Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    className={`w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 ${
                      formErrors.requesterEmail
                        ? 'border-destructive focus:ring-destructive'
                        : 'border-border focus:ring-primary'
                    }`}
                    value={newRequest.requesterEmail}
                    onChange={(e) => handleFieldChange('requesterEmail', e.target.value)}
                    onBlur={() => handleFieldBlur('requesterEmail')}
                    placeholder="Enter requester's email"
                    {...(formErrors.requesterEmail && { 'aria-invalid': true, 'aria-describedby': 'requesterEmail-error' })}
                  />
                  {formErrors.requesterEmail && (
                    <p id="requesterEmail-error" className="text-destructive text-sm mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.requesterEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    className={`w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 min-h-[100px] ${
                      formErrors.description
                        ? 'border-destructive focus:ring-destructive'
                        : 'border-border focus:ring-primary'
                    }`}
                    value={newRequest.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    onBlur={() => handleFieldBlur('description')}
                    placeholder="Describe the data subject request..."
                    {...(formErrors.description && { 'aria-invalid': true, 'aria-describedby': 'description-error' })}
                  />
                  {formErrors.description && (
                    <p id="description-error" className="text-destructive text-sm mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priority-select" className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      id="priority-select"
                      title="Select priority level"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={newRequest.priority}
                      onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value as DataSubjectRequest['priority'] })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Assigned To</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={newRequest.assignedTo}
                      onChange={(e) => setNewRequest({ ...newRequest, assignedTo: e.target.value })}
                      placeholder="Data Protection Officer"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowNewRequest(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRequest}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Request
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rights Information */}
      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">Data Subject Rights Under GDPR</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Organizations must respond to data subject requests within one month under GDPR Articles 15-22.
            </p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Right to access personal data (Article 15)</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Right to rectification of inaccurate data (Article 16)</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Right to erasure "right to be forgotten" (Article 17)</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Right to data portability (Article 20)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Rejecting Requests */}
      <ConfirmDialog
        open={confirmDialog?.open ?? false}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDialog(null);
            setRejectionReason('');
          }
        }}
        title="Reject Data Subject Request?"
        description={`Are you sure you want to reject request ${confirmDialog?.requestId}? This action will mark the request as rejected and notify the requester.`}
        confirmLabel="Reject Request"
        cancelLabel="Cancel"
        onConfirm={handleConfirmStatusChange}
        variant="destructive"
      >
        <div>
          <label className="block text-sm font-medium mb-2">
            Rejection Reason (Optional)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Provide a reason for rejecting this request..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            This reason will be saved in the request notes and can be included in the response to the requester.
          </p>
        </div>
      </ConfirmDialog>

      {/* Import Dialog */}
      <ImportDialog<DataSubjectRequest>
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImportData}
        title="Import Data Subject Requests"
        description="Upload a CSV or JSON file containing data subject access requests"
        csvHeaders={[
          'id',
          'requestType',
          'requesterName',
          'requesterEmail',
          'description',
          'requestDate',
          'deadline',
          'status',
          'priority',
          'assignedTo',
          'notes'
        ]}
        jsonValidation={{
          required: ['requesterName', 'requesterEmail'],
          schema: {
            requestType: validators.oneOf(['access', 'rectification', 'erasure', 'portability', 'restriction', 'objection']),
            requesterName: validators.isString,
            requesterEmail: validators.isEmail,
            status: validators.oneOf(['pending', 'in_progress', 'completed', 'rejected']),
            priority: validators.oneOf(['low', 'medium', 'high']),
          },
        }}
        maxRecords={500}
      />
    </div>
  );
};

export default PrivacyRightsManager;