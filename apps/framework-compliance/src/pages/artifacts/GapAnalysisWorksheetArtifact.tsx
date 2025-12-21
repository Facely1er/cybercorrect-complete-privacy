import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateDataExportPdf } from '@/utils/pdf/generateExportPdf';

const GapAnalysisWorksheetArtifact: React.FC = () => {
  const navigate = useNavigate();

  const handleExportPdf = async () => {
    try {
      await generateDataExportPdf(
        {
          title: 'NIST Privacy Framework Gap Analysis Worksheet',
          subtitle: 'Multi-Framework Compliance Assessment',
          timestamp: new Date().toISOString(),
          reportId: `GAP-WORKSHEET-${Date.now()}`,
          version: '1.0',
          generatedBy: 'Gap Analysis Worksheet Tool'
        },
        {
          'Framework': 'NIST Privacy Framework',
          'Total Controls': '50+',
          'Compliant': '32',
          'Partial': '13',
          'Gaps': '5'
        },
        [
          {
            title: 'Control Assessment',
            headers: ['Control ID', 'Control Name', 'Status', 'Priority'],
            rows: [
              ['ID.AM-1', 'Asset Inventory', 'Compliant', 'High'],
              ['PR.AC-3', 'Access Control', 'Partial', 'High'],
              ['DE.AE-2', 'Anomaly Detection', 'Gap', 'Medium']
            ]
          }
        ],
        `gap-analysis-worksheet-${new Date().toISOString().split('T')[0]}.pdf`
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
          <h1 className="text-3xl font-bold text-foreground">NIST Privacy Framework Gap Analysis</h1>
        </div>
        <Button onClick={handleExportPdf}>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Framework Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 mb-4">
            Comprehensive worksheets for NIST, ISO 27001, SOC 2, HIPAA, GDPR, CMMC, and PCI-DSS with 50+ pre-mapped controls. Each framework includes detailed control descriptions, assessment criteria, and remediation guidance.
          </p>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">NIST</div>
              <div className="text-sm text-foreground/70">Privacy Framework</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">ISO</div>
              <div className="text-sm text-foreground/70">27001</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded text-center">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">SOC 2</div>
              <div className="text-sm text-foreground/70">Type II</div>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded text-center">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-2">GDPR</div>
              <div className="text-sm text-foreground/70">Articles</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Control Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-left text-foreground">Control ID</th>
                  <th className="border border-border p-3 text-left text-foreground">Control Name</th>
                  <th className="border border-border p-3 text-center text-foreground">Status</th>
                  <th className="border border-border p-3 text-center text-foreground">Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 text-foreground/80">ID.AM-1</td>
                  <td className="border border-border p-3 text-foreground/80">Asset Inventory</td>
                  <td className="border border-border p-3 text-center">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-sm">
                      ✓ Compliant
                    </span>
                  </td>
                  <td className="border border-border p-3 text-center text-foreground/80">High</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 text-foreground/80">PR.AC-3</td>
                  <td className="border border-border p-3 text-foreground/80">Access Control</td>
                  <td className="border border-border p-3 text-center">
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-sm">
                      ⚠ Partial
                    </span>
                  </td>
                  <td className="border border-border p-3 text-center text-foreground/80">High</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 text-foreground/80">DE.AE-2</td>
                  <td className="border border-border p-3 text-foreground/80">Anomaly Detection</td>
                  <td className="border border-border p-3 text-center">
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-sm">
                      ✗ Gap
                    </span>
                  </td>
                  <td className="border border-border p-3 text-center text-foreground/80">Medium</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 text-foreground/80">PR.DS-1</td>
                  <td className="border border-border p-3 text-foreground/80">Data-at-Rest Protection</td>
                  <td className="border border-border p-3 text-center">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-sm">
                      ✓ Compliant
                    </span>
                  </td>
                  <td className="border border-border p-3 text-center text-foreground/80">High</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 text-foreground/80">PR.DS-2</td>
                  <td className="border border-border p-3 text-foreground/80">Data-in-Transit Protection</td>
                  <td className="border border-border p-3 text-center">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-sm">
                      ✓ Compliant
                    </span>
                  </td>
                  <td className="border border-border p-3 text-center text-foreground/80">High</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 text-foreground/80">PR.IP-1</td>
                  <td className="border border-border p-3 text-foreground/80">Baseline Configuration</td>
                  <td className="border border-border p-3 text-center">
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-sm">
                      ⚠ Partial
                    </span>
                  </td>
                  <td className="border border-border p-3 text-center text-foreground/80">Medium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Framework-Specific Worksheets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">NIST Privacy Framework:</strong>
              <p className="text-foreground/70 mt-2">Identify, Govern, Control, Communicate, Protect functions with 50+ controls</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">ISO 27001:</strong>
              <p className="text-foreground/70 mt-2">114 controls across 14 domains with Annex A mapping</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">SOC 2:</strong>
              <p className="text-foreground/70 mt-2">Trust Services Criteria with 5 categories (Security, Availability, Processing Integrity, Confidentiality, Privacy)</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">HIPAA:</strong>
              <p className="text-foreground/70 mt-2">Administrative, Physical, and Technical Safeguards with 45+ controls</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">GDPR:</strong>
              <p className="text-foreground/70 mt-2">99 Articles mapped to operational controls and compliance requirements</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">CMMC:</strong>
              <p className="text-foreground/70 mt-2">17 domains with maturity levels 1-5 for DoD contractors</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">PCI-DSS:</strong>
              <p className="text-foreground/70 mt-2">12 requirements with 6 control objectives for payment card data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Worksheet Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Pre-Mapped Controls:</strong>
              <p className="text-foreground/70 mt-2">50+ controls pre-mapped across all major frameworks</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Control Mapping Matrix:</strong>
              <p className="text-foreground/70 mt-2">Cross-framework control mapping and correlation</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Assessment Criteria:</strong>
              <p className="text-foreground/70 mt-2">Detailed assessment criteria and evidence requirements</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Remediation Guidance:</strong>
              <p className="text-foreground/70 mt-2">Actionable remediation steps for each identified gap</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Export Capabilities:</strong>
              <p className="text-foreground/70 mt-2">Export to Excel, PDF for documentation and reporting</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Version Control:</strong>
              <p className="text-foreground/70 mt-2">Track assessment history and changes over time</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-primary/10 rounded">
            <p className="text-sm text-foreground/70">
              ✓ Comprehensive worksheets for NIST, ISO 27001, SOC 2, HIPAA, GDPR, CMMC, and PCI-DSS | ✓ 50+ pre-mapped controls | ✓ Control mapping matrix | ✓ Assessment criteria | ✓ Remediation guidance | ✓ Export capabilities
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GapAnalysisWorksheetArtifact;

