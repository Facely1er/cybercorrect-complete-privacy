import React, { useState } from 'react';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { ComplianceReportGenerator } from '../../components/reports/ComplianceReportGenerator';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { BarChart3, Calendar, Shield, BookOpen, Users, FileText, Download, Archive, Loader2 } from 'lucide-react';
import { downloadAuditPack } from '../../services/auditPackService';
import { useNotifications } from '../../hooks/useNotifications';

export function ReportsPage() {
  const [isDownloadingAuditPack, setIsDownloadingAuditPack] = useState(false);
  const [auditPackFormat, setAuditPackFormat] = useState<'zip' | 'json'>('zip');
  const [auditPackStartDate, setAuditPackStartDate] = useState('');
  const [auditPackEndDate, setAuditPackEndDate] = useState(new Date().toISOString().split('T')[0]);
  const { addNotification } = useNotifications();

  const handleDownloadAuditPack = async () => {
    setIsDownloadingAuditPack(true);
    try {
      await downloadAuditPack(auditPackFormat, {
        startDate: auditPackStartDate || undefined,
        endDate: auditPackEndDate,
        includeEvidence: true,
      });
      
      addNotification({
        type: 'success',
        title: 'Audit Pack Downloaded',
        message: `Audit pack has been downloaded successfully as ${auditPackFormat.toUpperCase()}.`,
        timestamp: Date.now(),
        read: false,
        category: 'compliance',
      });
    } catch (error) {
      console.error('Error downloading audit pack:', error);
      addNotification({
        type: 'error',
        title: 'Download Failed',
        message: error instanceof Error ? error.message : 'Failed to download audit pack. Please try again.',
        timestamp: Date.now(),
        read: false,
        category: 'compliance',
      });
    } finally {
      setIsDownloadingAuditPack(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Compliance Reports</h1>
        <p className="text-muted-foreground">
          Generate comprehensive privacy compliance reports for stakeholders
        </p>
      </div>

      {/* Audit Pack Download Section */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <Archive className="h-5 w-5 mr-2 text-primary" />
              Audit Pack Download
            </h2>
            <p className="text-muted-foreground">
              Download a complete audit-ready evidence pack containing all compliance documentation including RoPA records, DSAR requests, DPIAs, incidents, and evidence records.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select
              value={auditPackFormat}
              onChange={(e) => setAuditPackFormat(e.target.value as 'zip' | 'json')}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              aria-label="Select audit pack format"
            >
              <option value="zip">ZIP (Recommended - includes all CSV files)</option>
              <option value="json">JSON (Single file with all data)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={auditPackEndDate}
              onChange={(e) => setAuditPackEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              aria-label="Select end date for audit pack"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Start Date (Optional - leave empty for all records)</label>
          <input
            type="date"
            value={auditPackStartDate}
            onChange={(e) => setAuditPackStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            aria-label="Select start date for audit pack"
          />
        </div>

        <Button
          onClick={handleDownloadAuditPack}
          disabled={isDownloadingAuditPack}
          className="w-full md:w-auto"
        >
          {isDownloadingAuditPack ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Audit Pack...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Audit Pack ({auditPackFormat.toUpperCase()})
            </>
          )}
        </Button>

        <div className="mt-4 p-4 bg-background/50 rounded-lg">
          <p className="text-sm font-medium mb-2">What's included in the audit pack:</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Records of Processing Activities (RoPA) - CSV</li>
            <li>Data Subject Access Requests (DSAR) - CSV</li>
            <li>Data Protection Impact Assessments (DPIA) - CSV</li>
            <li>Privacy Incidents - CSV</li>
            <li>Evidence Records (if available)</li>
            <li>Metadata and summary report</li>
          </ul>
        </div>
      </div>

      <ComplianceReportGenerator organizationId="a1b2c3d4-e5f6-7890-1234-567890abcdef" />
      
      {/* Report Resources */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Reporting Resources</h2>
        <p className="text-muted-foreground mb-4">
          Access additional resources to enhance your compliance reporting and stakeholder communication.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/privacy/analytics" title="View detailed privacy analytics for reporting">
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Privacy Analytics Dashboard
            </Button>
          </Link>
          <Link to="/privacy/obligations" title="Include compliance status in reports">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Compliance Status
            </Button>
          </Link>
          <Link to="/privacy/incidents" title="Include incident summaries in reports">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Incident Summaries
            </Button>
          </Link>
          <Link to="/how-it-works" title="Learn report writing best practices">
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              Report Writing Training
            </Button>
          </Link>
          <Link to="/privacy/stakeholders" title="Manage report distribution to stakeholders">
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Stakeholder Distribution
            </Button>
          </Link>
          <Link to="/resources/tools-templates" title="Access report templates and tools">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Report Templates
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}