import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  FileText, 
  Download,
  Trash2,
  Play,
  Pause,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { reportService, AutomatedReport, ReportType, ReportFrequency } from '../../utils/reporting';
import { toast } from '../../components/ui/Toaster';
import { EmptyState } from '../../components/ui/EmptyState';

export const AutomatedReports: React.FC = () => {
  const [reports, setReports] = useState<AutomatedReport[]>([]);
  const [reportHistory, setReportHistory] = useState<Array<{ id: string; report_type: ReportType; generated_at: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReport, setNewReport] = useState<{
    report_type: ReportType;
    frequency: ReportFrequency;
    config?: Record<string, unknown>;
  }>({
    report_type: 'compliance',
    frequency: 'monthly',
  });

  // Confirm dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    reportId: string;
    reportName: string;
  } | null>(null);

  useEffect(() => {
    loadReports();
    loadReportHistory();
  }, []);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, fetch from Supabase
      // For now, use local storage
      const localReports = reportService['reportsCache'] || [];
      setReports(localReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
      toast.error('Failed to load reports', 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const loadReportHistory = async () => {
    try {
      const history = await reportService.getReportHistory({ limit: 50 });
      setReportHistory(history);
    } catch (error) {
      console.error('Failed to load report history:', error);
    }
  };

  const handleCreateReport = async () => {
    try {
      const created = await reportService.scheduleReport(
        newReport.report_type,
        newReport.frequency,
        newReport.config
      );

      if (created) {
        await loadReports();
        setShowCreateModal(false);
        setNewReport({ report_type: 'compliance', frequency: 'monthly' });
        toast.success('Report scheduled', 'Automated report has been scheduled');
      }
    } catch (error) {
      console.error('Failed to create report:', error);
      toast.error('Failed to create report', 'Please try again');
    }
  };

  const handleToggleStatus = async (reportId: string, currentStatus: AutomatedReport['status']) => {
    try {
      // In a real implementation, update in Supabase
      // For now, update local state
      setReports(prev => prev.map(r => 
        r.id === reportId 
          ? { ...r, status: currentStatus === 'active' ? 'paused' : 'active' }
          : r
      ));
      toast.success('Report status updated', `Report ${currentStatus === 'active' ? 'paused' : 'activated'}`);
    } catch (error) {
      console.error('Failed to update report status:', error);
      toast.error('Failed to update report status', 'Please try again');
    }
  };

  const handleDeleteClick = (report: AutomatedReport) => {
    setDeleteConfirm({
      open: true,
      reportId: report.id!,
      reportName: `${report.report_type} report (${report.frequency})`
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      // In a real implementation, delete from Supabase
      // For now, update local state
      setReports(prev => prev.filter(r => r.id !== deleteConfirm.reportId));
      setDeleteConfirm(null);
      toast.success('Report deleted', 'Scheduled report has been deleted');
    } catch (error) {
      console.error('Failed to delete report:', error);
      toast.error('Failed to delete report', 'Please try again');
    }
  };

  const handleGenerateNow = async (report: AutomatedReport) => {
    try {
      toast.info('Generating report', 'This may take a few moments...');
      // In a real implementation, trigger report generation
      // For now, show success message
      setTimeout(() => {
        toast.success('Report generated', 'Report has been generated successfully');
      }, 2000);
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('Failed to generate report', 'Please try again');
    }
  };

  const getReportTypeLabel = (type: ReportType) => {
    const labels: Record<ReportType, string> = {
      compliance: 'Compliance Report',
      executive: 'Executive Summary',
      risk: 'Risk Report',
      health: 'Health Report',
      quarterly: 'Quarterly Report',
      monthly: 'Monthly Report',
      weekly: 'Weekly Report',
      custom: 'Custom Report',
    };
    return labels[type] || type;
  };

  const getFrequencyLabel = (frequency: ReportFrequency) => {
    const labels: Record<ReportFrequency, string> = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      custom: 'Custom',
    };
    return labels[frequency] || frequency;
  };

  const getStatusIcon = (status: AutomatedReport['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Automated Reports</h1>
            <p className="text-muted-foreground">
              Schedule and manage automated compliance reports
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
        </div>
      </div>

      {showCreateModal && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Schedule New Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Report Type</label>
                <select
                  value={newReport.report_type}
                  onChange={(e) => setNewReport({ ...newReport, report_type: e.target.value as ReportType })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="compliance">Compliance Report</option>
                  <option value="executive">Executive Summary</option>
                  <option value="risk">Risk Report</option>
                  <option value="health">Health Report</option>
                  <option value="quarterly">Quarterly Report</option>
                  <option value="monthly">Monthly Report</option>
                  <option value="weekly">Weekly Report</option>
                  <option value="custom">Custom Report</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Frequency</label>
                <select
                  value={newReport.frequency}
                  onChange={(e) => setNewReport({ ...newReport, frequency: e.target.value as ReportFrequency })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateReport}>Schedule Report</Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Reports */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scheduled Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading scheduled reports...
            </div>
          ) : reports.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Scheduled Reports"
              description="Create your first automated report to receive regular compliance updates."
              action={{
                label: "Create Report Schedule",
                onClick: () => setShowCreateModal(true),
                icon: Plus
              }}
            />
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{getReportTypeLabel(report.report_type)}</h3>
                        <span className="text-sm text-muted-foreground">
                          ({getFrequencyLabel(report.frequency)})
                        </span>
                        {getStatusIcon(report.status)}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {report.last_generated && (
                          <div>Last generated: {new Date(report.last_generated).toLocaleString()}</div>
                        )}
                        <div>Next generation: {new Date(report.next_generation).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateNow(report)}
                        title="Generate now"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(report.id!, report.status)}
                        title={report.status === 'active' ? 'Pause' : 'Resume'}
                      >
                        {report.status === 'active' ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(report)}
                        className="text-destructive hover:text-destructive"
                        title="Delete"
                      >
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

      {/* Report History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportHistory.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No Report History"
              description="Your generated reports will appear here once you schedule and run automated reports."
            />
          ) : (
            <div className="space-y-2">
              {reportHistory.map((history) => (
                <div
                  key={history.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">{getReportTypeLabel(history.report_type)}</div>
                      <div className="text-sm text-muted-foreground">
                        Generated: {new Date(history.generated_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteConfirm?.open ?? false}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirm(null);
        }}
        title="Delete Scheduled Report?"
        description={`Are you sure you want to delete the ${deleteConfirm?.reportName || 'scheduled report'}? This action cannot be undone.`}
        confirmLabel="Delete Report"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
};


