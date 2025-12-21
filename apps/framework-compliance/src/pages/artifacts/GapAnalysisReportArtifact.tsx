import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateDataExportPdf } from '@/utils/pdf/generateExportPdf';

const GapAnalysisReportArtifact: React.FC = () => {
  const navigate = useNavigate();

  const handleExportPdf = async () => {
    try {
      await generateDataExportPdf(
        {
          title: 'Privacy Gap Analysis Report',
          subtitle: 'Comprehensive Compliance Assessment',
          timestamp: new Date().toISOString(),
          reportId: `GAP-ANALYSIS-${Date.now()}`,
          version: '1.0',
          generatedBy: 'Gap Analysis Tool'
        },
        {
          'Overall Compliance': '65%',
          'Compliant Controls': '65%',
          'Partial Controls': '25%',
          'Gap Controls': '10%',
          'Assessment Date': new Date().toLocaleDateString(),
          'Frameworks Assessed': 'GDPR, CCPA, NIST Privacy Framework'
        },
        [
          {
            title: 'Key Findings',
            headers: ['Finding', 'Priority', 'Status'],
            rows: [
              ['Data retention policies need updating to align with GDPR requirements', 'High', 'In Progress'],
              ['Consent mechanisms require enhancement for explicit opt-in', 'High', 'Planned'],
              ['DPIA process needs formalization and documentation', 'Medium', 'Planned'],
              ['Data subject rights procedures need streamlining', 'Medium', 'In Progress']
            ]
          },
          {
            title: 'Compliance Breakdown',
            headers: ['Framework', 'Compliance Score', 'Status'],
            rows: [
              ['GDPR', '68%', 'Partial Compliance'],
              ['CCPA', '72%', 'Partial Compliance'],
              ['NIST Privacy Framework', '58%', 'Needs Improvement']
            ]
          }
        ],
        `gap-analysis-report-${new Date().toISOString().split('T')[0]}.pdf`
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Privacy Gap Analysis Report</h1>
        </div>
        <Button onClick={handleExportPdf}>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-6 bg-green-50 dark:bg-green-900/30 rounded text-center border border-green-200 dark:border-green-800">
              <div className="text-4xl font-bold text-green-700 dark:text-green-300 mb-2">65%</div>
              <div className="text-foreground/70">Compliant</div>
            </div>
            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded text-center border border-yellow-200 dark:border-yellow-800">
              <div className="text-4xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">25%</div>
              <div className="text-foreground/70">Partial</div>
            </div>
            <div className="p-6 bg-red-50 dark:bg-red-900/30 rounded text-center border border-red-200 dark:border-red-800">
              <div className="text-4xl font-bold text-red-700 dark:text-red-300 mb-2">10%</div>
              <div className="text-foreground/70">Gaps</div>
            </div>
          </div>
          <p className="text-foreground/80">
            This comprehensive gap analysis report evaluates your organization's privacy compliance posture across multiple frameworks including GDPR, CCPA, and NIST Privacy Framework. The assessment identifies areas of compliance, partial implementation, and gaps requiring remediation.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Key Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <strong className="text-foreground">Data Retention Policies</strong>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-sm">
                  High Priority
                </span>
              </div>
              <p className="text-foreground/80">Data retention policies need updating to align with GDPR requirements. Current policies do not specify retention periods for all data categories and lack automated deletion procedures.</p>
              <p className="text-foreground/70 mt-2 text-sm">Status: In Progress</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <strong className="text-foreground">Consent Mechanisms</strong>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded text-sm">
                  High Priority
                </span>
              </div>
              <p className="text-foreground/80">Consent mechanisms require enhancement for explicit opt-in. Current consent collection does not meet GDPR Article 7 requirements for clear, affirmative action.</p>
              <p className="text-foreground/70 mt-2 text-sm">Status: Planned</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-2">
                <strong className="text-foreground">DPIA Process</strong>
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-sm">
                  Medium Priority
                </span>
              </div>
              <p className="text-foreground/80">DPIA process needs formalization and documentation. While some assessments have been conducted, there is no standardized process or documentation template.</p>
              <p className="text-foreground/70 mt-2 text-sm">Status: Planned</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <strong className="text-foreground">Data Subject Rights Procedures</strong>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm">
                  Medium Priority
                </span>
              </div>
              <p className="text-foreground/80">Data subject rights procedures need streamlining. Current processes are manual and do not meet the 30-day response requirement consistently.</p>
              <p className="text-foreground/70 mt-2 text-sm">Status: In Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Framework-Specific Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded">
              <div className="flex items-center justify-between mb-2">
                <strong className="text-foreground text-lg">GDPR Compliance</strong>
                <span className="text-2xl font-bold text-foreground">68%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full w-[68%]"></div>
              </div>
              <p className="text-foreground/70 mt-2 text-sm">Partial Compliance - Key gaps in data retention, consent management, and DPIA processes</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <div className="flex items-center justify-between mb-2">
                <strong className="text-foreground text-lg">CCPA Compliance</strong>
                <span className="text-2xl font-bold text-foreground">72%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full w-[72%]"></div>
              </div>
              <p className="text-foreground/70 mt-2 text-sm">Partial Compliance - Strong in disclosure requirements, needs improvement in opt-out mechanisms</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <div className="flex items-center justify-between mb-2">
                <strong className="text-foreground text-lg">NIST Privacy Framework</strong>
                <span className="text-2xl font-bold text-foreground">58%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '58%' }}></div>
              </div>
              <p className="text-foreground/70 mt-2 text-sm">Needs Improvement - Data governance and risk management functions require enhancement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prioritized Remediation Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-foreground">1. Update Data Retention Policies</strong>
                  <p className="text-foreground/70 mt-1">Timeline: 30 days | Owner: Legal & Compliance</p>
                </div>
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded">
                  High Priority
                </span>
              </div>
            </div>
            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-foreground">2. Enhance Consent Mechanisms</strong>
                  <p className="text-foreground/70 mt-1">Timeline: 60 days | Owner: Product & Engineering</p>
                </div>
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded">
                  High Priority
                </span>
              </div>
            </div>
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-foreground">3. Formalize DPIA Process</strong>
                  <p className="text-foreground/70 mt-1">Timeline: 45 days | Owner: Privacy Team</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded">
                  Medium Priority
                </span>
              </div>
            </div>
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-foreground">4. Streamline DSR Procedures</strong>
                  <p className="text-foreground/70 mt-1">Timeline: 30 days | Owner: Privacy & IT</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">
                  Medium Priority
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-foreground">Assessment Date:</strong>
              <p className="text-foreground/70 mt-1">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <strong className="text-foreground">Assessed By:</strong>
              <p className="text-foreground/70 mt-1">Privacy Compliance Team</p>
            </div>
            <div>
              <strong className="text-foreground">Frameworks Assessed:</strong>
              <p className="text-foreground/70 mt-1">GDPR, CCPA, NIST Privacy Framework</p>
            </div>
            <div>
              <strong className="text-foreground">Next Review Date:</strong>
              <p className="text-foreground/70 mt-1">{new Date(Date.now() + 90*24*60*60*1000).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-primary/10 rounded">
            <p className="text-sm text-foreground/70">
              ✓ Comprehensive assessment covering GDPR, CCPA, NIST Privacy Framework | ✓ Prioritized remediation roadmap | ✓ Framework-specific compliance scoring | ✓ Detailed gap analysis | ✓ Actionable recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GapAnalysisReportArtifact;

