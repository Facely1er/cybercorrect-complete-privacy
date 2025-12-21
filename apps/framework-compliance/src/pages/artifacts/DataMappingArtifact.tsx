import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateDataExportPdf } from '@/utils/pdf/generateExportPdf';

const DataMappingArtifact: React.FC = () => {
  const navigate = useNavigate();

  const handleExportPdf = async () => {
    try {
      await generateDataExportPdf(
        {
          title: 'Data Flow Mapping Tool',
          subtitle: 'Comprehensive Data Flow Documentation',
          timestamp: new Date().toISOString(),
          reportId: `DATA-MAPPING-${Date.now()}`,
          version: '1.0',
          generatedBy: 'Data Mapping Tool'
        },
        {
          'Total Data Flows': '15',
          'Systems Mapped': '8',
          'Third-Party Vendors': '5',
          'Compliance Frameworks': 'GDPR, CCPA, NIST'
        },
        [
          {
            title: 'Data Flow Details',
            headers: ['Stage', 'System', 'Data Elements', 'Retention', 'Legal Basis'],
            rows: [
              ['Collection', 'Web Form', 'Name, Email, Phone', '7 years', 'Contract'],
              ['Processing', 'CRM System', 'All customer data', 'Account lifetime', 'Contract'],
              ['Storage', 'Cloud Database', 'Encrypted records', '7 years', 'Legal obligation'],
              ['Analytics', 'Analytics Platform', 'Aggregated data', '26 months', 'Legitimate interest']
            ]
          }
        ],
        `data-mapping-${new Date().toISOString().split('T')[0]}.pdf`
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
          <h1 className="text-3xl font-bold text-foreground">Data Flow Mapping Tool</h1>
        </div>
        <Button onClick={handleExportPdf}>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Flow Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 mb-6">
            This interactive tool allows you to map data flows from collection through processing, storage, and deletion. Track data across systems, identify compliance requirements, and document data subject rights applicability.
          </p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Sample Data Flow: Customer Registration</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded text-center border border-blue-200 dark:border-blue-800">
                <div className="font-semibold text-foreground mb-2">1. Collection</div>
                <div className="text-sm text-foreground/70 mb-1">Web Form</div>
                <div className="text-xs text-foreground/60">Name, Email, Phone</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded text-center border border-green-200 dark:border-green-800">
                <div className="font-semibold text-foreground mb-2">2. Validation</div>
                <div className="text-sm text-foreground/70 mb-1">API Gateway</div>
                <div className="text-xs text-foreground/60">Format Check</div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded text-center border border-purple-200 dark:border-purple-800">
                <div className="font-semibold text-foreground mb-2">3. Processing</div>
                <div className="text-sm text-foreground/70 mb-1">CRM System</div>
                <div className="text-xs text-foreground/60">Account Creation</div>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded text-center border border-orange-200 dark:border-orange-800">
                <div className="font-semibold text-foreground mb-2">4. Storage</div>
                <div className="text-sm text-foreground/70 mb-1">Cloud DB</div>
                <div className="text-xs text-foreground/60">Encrypted</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Flow Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left text-foreground">Stage</th>
                  <th className="p-3 text-left text-foreground">System</th>
                  <th className="p-3 text-left text-foreground">Data Elements</th>
                  <th className="p-3 text-left text-foreground">Retention</th>
                  <th className="p-3 text-left text-foreground">Legal Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-3 text-foreground/80">Collection</td>
                  <td className="p-3 text-foreground/80">Web Form</td>
                  <td className="p-3 text-foreground/80">Name, Email, Phone</td>
                  <td className="p-3 text-foreground/80">7 years</td>
                  <td className="p-3 text-foreground/80">Contract</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 text-foreground/80">Processing</td>
                  <td className="p-3 text-foreground/80">CRM System</td>
                  <td className="p-3 text-foreground/80">All customer data</td>
                  <td className="p-3 text-foreground/80">Account lifetime</td>
                  <td className="p-3 text-foreground/80">Contract</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 text-foreground/80">Storage</td>
                  <td className="p-3 text-foreground/80">Cloud Database</td>
                  <td className="p-3 text-foreground/80">Encrypted records</td>
                  <td className="p-3 text-foreground/80">7 years</td>
                  <td className="p-3 text-foreground/80">Legal obligation</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 text-foreground/80">Analytics</td>
                  <td className="p-3 text-foreground/80">Analytics Platform</td>
                  <td className="p-3 text-foreground/80">Aggregated data</td>
                  <td className="p-3 text-foreground/80">26 months</td>
                  <td className="p-3 text-foreground/80">Legitimate interest</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Third-Party Data Sharing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Payment Processor:</strong>
              <p className="text-foreground/80 mt-1">Stripe - Payment data only, encrypted, DPA in place</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Email Service:</strong>
              <p className="text-foreground/80 mt-1">SendGrid - Email addresses, DPA in place</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Analytics:</strong>
              <p className="text-foreground/80 mt-1">Google Analytics - Aggregated usage data, anonymized</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Compliance Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded">
              <strong className="text-foreground">GDPR:</strong>
              <p className="text-foreground/70 mt-2">Article 30 Record, Article 35 DPIA required</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded">
              <strong className="text-foreground">CCPA:</strong>
              <p className="text-foreground/70 mt-2">Data inventory, disclosure requirements</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded">
              <strong className="text-foreground">NIST:</strong>
              <p className="text-foreground/70 mt-2">Data flow documentation, risk assessment</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Visual Data Flow Mapping:</strong>
              <p className="text-foreground/70 mt-2">Unlimited flows with visual representation</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Export Capabilities:</strong>
              <p className="text-foreground/70 mt-2">Export to Excel, PDF for documentation</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Compliance Tracking:</strong>
              <p className="text-foreground/70 mt-2">Automated compliance requirement identification</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">DPIA Generation:</strong>
              <p className="text-foreground/70 mt-2">Automated DPIA generation from data flows</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Data Subject Rights Mapping:</strong>
              <p className="text-foreground/70 mt-2">Track data subject rights applicability</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Retention Policy Enforcement:</strong>
              <p className="text-foreground/70 mt-2">Automated retention policy tracking</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Vendor Tracking:</strong>
              <p className="text-foreground/70 mt-2">Third-party vendor and processor tracking</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Real-Time Collaboration:</strong>
              <p className="text-foreground/70 mt-2">Team collaboration on data flow mapping</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-primary/10 rounded">
            <p className="text-sm text-foreground/70">
              ✓ Visual data flow mapping with unlimited flows | ✓ Export to Excel/PDF | ✓ Compliance tracking | ✓ Automated DPIA generation | ✓ Data subject rights mapping | ✓ Retention policy enforcement | ✓ Third-party vendor tracking | ✓ Real-time collaboration
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataMappingArtifact;

