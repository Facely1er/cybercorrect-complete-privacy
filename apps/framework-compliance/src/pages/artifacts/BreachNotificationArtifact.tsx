import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateDataExportPdf } from '@/utils/pdf/generateExportPdf';

const BreachNotificationArtifact: React.FC = () => {
  const navigate = useNavigate();

  const handleExportPdf = async () => {
    try {
      await generateDataExportPdf(
        {
          title: 'Data Breach Notification',
          subtitle: 'GDPR Article 33/34 Compliance Documentation',
          timestamp: new Date().toISOString(),
          reportId: `BREACH-${Date.now()}`,
          version: '1.0',
          generatedBy: 'Breach Notification Template'
        },
        {
          'Incident ID': `INC-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}-001`,
          'Date Detected': new Date().toLocaleString(),
          'Severity Level': 'High',
          'Status': 'Notification Required'
        },
        [
          {
            title: 'Incident Details',
            headers: ['Field', 'Value'],
            rows: [
              ['Incident Type', 'Unauthorized access / Data breach'],
              ['Affected Data Categories', 'Contact information, email addresses, names'],
              ['Number of Data Subjects', 'To be determined'],
              ['Geographic Scope', 'Multiple regions']
            ]
          },
          {
            title: 'Notification Status',
            headers: ['Recipient', 'Status', 'Date', 'Method'],
            rows: [
              ['Supervisory Authority', 'Required', 'Within 72 hours', 'Online portal'],
              ['Data Subjects', 'If high risk', 'Without undue delay', 'Email/Postal'],
              ['Processors', 'Completed', new Date().toLocaleDateString(), 'Email']
            ]
          }
        ],
        `breach-notification-${new Date().toISOString().split('T')[0]}.pdf`
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
          <h1 className="text-3xl font-bold text-foreground">Data Breach Notification Template</h1>
        </div>
        <Button onClick={handleExportPdf}>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Incident Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-foreground">Incident ID:</strong>
                <p className="text-foreground/70">INC-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-{String(new Date().getDate()).padStart(2, '0')}-001</p>
              </div>
              <div>
                <strong className="text-foreground">Date Detected:</strong>
                <p className="text-foreground/70">{new Date().toLocaleString()}</p>
              </div>
              <div>
                <strong className="text-foreground">Date Occurred:</strong>
                <p className="text-foreground/70">[Estimated date/time of breach]</p>
              </div>
              <div>
                <strong className="text-foreground">Date Reported:</strong>
                <p className="text-foreground/70">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <strong className="text-foreground">Incident Type:</strong>
                <p className="text-foreground/70">Unauthorized access / Data breach / System compromise</p>
              </div>
              <div>
                <strong className="text-foreground">Severity Level:</strong>
                <p className="text-foreground/70">High / Medium / Low</p>
              </div>
              <div>
                <strong className="text-foreground">Affected Data Categories:</strong>
                <p className="text-foreground/70">Contact information, email addresses, names, [other categories]</p>
              </div>
              <div>
                <strong className="text-foreground">Number of Data Subjects Affected:</strong>
                <p className="text-foreground/70">[Number] individuals</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Nature of the Breach</h2>
            <div className="space-y-3 text-foreground/80">
              <p><strong className="text-foreground">Description:</strong> [Detailed description of what happened, how the breach occurred, and what systems/data were affected]</p>
              <p><strong className="text-foreground">Cause:</strong> [Suspected or confirmed cause - e.g., cyberattack, human error, system failure, insider threat]</p>
              <p><strong className="text-foreground">Attack Vector:</strong> [If applicable - e.g., phishing, malware, SQL injection, unauthorized access]</p>
              <p><strong className="text-foreground">Data Compromised:</strong> [Specific data types and sensitivity levels]</p>
              <p><strong className="text-foreground">Potential Impact:</strong> [Assessment of potential harm to data subjects]</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Immediate Response Actions</h2>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded">
              <div className="space-y-2 text-foreground/80">
                <p>✓ Containment measures implemented - [Details]</p>
                <p>✓ System isolation completed - [Affected systems isolated]</p>
                <p>✓ Investigation initiated - [Investigation team and timeline]</p>
                <p>✓ Forensic analysis commenced - [Tools and methods]</p>
                <p>✓ Access credentials revoked/changed - [Number of accounts]</p>
                <p>✓ Security patches applied - [If applicable]</p>
                <p>✓ Law enforcement notified - [If applicable, date and agency]</p>
                <p>✓ Third-party security experts engaged - [If applicable]</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Assessment of Risk to Data Subjects</h2>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded">
                <strong className="text-foreground text-lg">Risk Level: HIGH / MEDIUM / LOW</strong>
                <p className="text-foreground/80 mt-2">[Explanation of risk assessment]</p>
              </div>
              <div>
                <strong className="text-foreground">Potential Consequences:</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-foreground/80">
                  <li>Identity theft</li>
                  <li>Financial fraud</li>
                  <li>Phishing attacks</li>
                  <li>Unauthorized access to accounts</li>
                  <li>Reputation damage</li>
                  <li>[Other specific risks]</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Mitigation Measures for Data Subjects:</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-foreground/80">
                  <li>Change passwords immediately</li>
                  <li>Monitor accounts for suspicious activity</li>
                  <li>Enable two-factor authentication</li>
                  <li>Review credit reports</li>
                  <li>Be cautious of phishing attempts</li>
                  <li>[Other recommendations]</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Notification Details</h2>
            <div className="space-y-4 text-foreground/80">
              <div>
                <strong className="text-foreground">Supervisory Authority Notification:</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Authority: [Name of supervisory authority]</li>
                  <li>Date Notified: [Date within 72 hours of detection]</li>
                  <li>Notification Method: [Online portal / Email / Other]</li>
                  <li>Reference Number: [If provided by authority]</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Data Subject Notification:</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Notification Method: Email / Postal mail / Website notice</li>
                  <li>Date Notified: [Date]</li>
                  <li>Number Notified: [Number] individuals</li>
                  <li>Language: [Languages used for notification]</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Processor Notification (if applicable):</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Processors Notified: [List of processors]</li>
                  <li>Date Notified: [Date]</li>
                  <li>Coordination: [Details of coordination efforts]</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Remediation Measures</h2>
            <div className="space-y-4 text-foreground/80">
              <div>
                <strong className="text-foreground">Short-term Measures (Completed):</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>[Specific measures taken]</li>
                  <li>[Timeline and status]</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Long-term Measures (Planned):</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>[Security enhancements]</li>
                  <li>[Process improvements]</li>
                  <li>[Training and awareness]</li>
                  <li>[Timeline for implementation]</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Compliance Checklist</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded">
                <strong className="text-foreground">GDPR Article 33:</strong>
                <p className="text-foreground/70 mt-1">Supervisory authority notified within 72 hours</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded">
                <strong className="text-foreground">GDPR Article 34:</strong>
                <p className="text-foreground/70 mt-1">Data subjects notified without undue delay (if high risk)</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded">
                <strong className="text-foreground">CCPA:</strong>
                <p className="text-foreground/70 mt-1">Notification requirements met (if applicable)</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded">
                <strong className="text-foreground">Other Jurisdictions:</strong>
                <p className="text-foreground/70 mt-1">[State/provincial requirements if applicable]</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Contact Information</h2>
            <div className="space-y-2 text-foreground/80">
              <p><strong className="text-foreground">Data Protection Officer:</strong> dpo@yourcompany.com</p>
              <p><strong className="text-foreground">Incident Response Team:</strong> security@yourcompany.com</p>
              <p><strong className="text-foreground">Phone:</strong> [Phone number]</p>
              <p><strong className="text-foreground">Support for Affected Individuals:</strong> breach-support@yourcompany.com</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded">
            <p className="text-sm text-foreground/70">
              ✓ 72-hour GDPR notification checklist | ✓ CCPA requirements | ✓ Multi-jurisdiction compliance | ✓ Comprehensive incident documentation | ✓ Remediation tracking
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreachNotificationArtifact;

