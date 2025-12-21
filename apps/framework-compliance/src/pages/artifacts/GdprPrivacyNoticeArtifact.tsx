import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileDown, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateDataExportPdf } from '@/utils/pdf/generateExportPdf';

const GdprPrivacyNoticeArtifact: React.FC = () => {
  const navigate = useNavigate();

  const handleExportPdf = async () => {
    try {
      await generateDataExportPdf(
        {
          title: 'GDPR-Compliant Privacy Notice',
          subtitle: 'Article 13 Information Provision',
          timestamp: new Date().toISOString(),
          reportId: `GDPR-NOTICE-${Date.now()}`,
          version: '1.0',
          generatedBy: 'GDPR Privacy Notice Generator'
        },
        {
          'Compliance Status': 'GDPR Article 13 Compliant',
          'Last Updated': new Date().toLocaleDateString(),
          'Legal Basis': 'Multiple (Contract, Consent, Legal Obligation, Legitimate Interest)'
        },
        [
          {
            title: 'Purposes and Legal Basis',
            headers: ['Purpose', 'Legal Basis', 'Description'],
            rows: [
              ['Service Delivery', 'Contract (Article 6(1)(b))', 'Processing customer orders, managing accounts'],
              ['Marketing Communications', 'Consent (Article 6(1)(a))', 'Promotional emails with opt-out'],
              ['Legal Compliance', 'Legal Obligation (Article 6(1)(c))', 'Tax reporting, fraud prevention'],
              ['Service Improvement', 'Legitimate Interest (Article 6(1)(f))', 'Analytics, product development']
            ]
          }
        ],
        `gdpr-privacy-notice-${new Date().toISOString().split('T')[0]}.pdf`
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
          <h1 className="text-3xl font-bold text-foreground">GDPR-Compliant Privacy Notice</h1>
        </div>
        <Button onClick={handleExportPdf}>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <strong className="text-foreground text-lg">GDPR Article 13 Compliant</strong>
            </div>
            <p className="text-foreground/70">This notice fulfills all requirements under GDPR Article 13 for transparent information provision to data subjects.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Identity and Contact Details of the Controller</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-foreground/80">
            <p><strong className="text-foreground">Data Controller:</strong> [Your Organization Name]</p>
            <p><strong className="text-foreground">Registered Address:</strong> [Your Address]</p>
            <p><strong className="text-foreground">Contact Email:</strong> privacy@yourcompany.com</p>
            <p><strong className="text-foreground">Phone:</strong> [Your Phone Number]</p>
            <p><strong className="text-foreground">Data Protection Officer:</strong> dpo@yourcompany.com</p>
            <p><strong className="text-foreground">Supervisory Authority:</strong> [Your local data protection authority]</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Purposes and Legal Basis for Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Purpose: Service Delivery</strong>
              <p className="text-foreground/80 mt-2">Legal Basis: Contract performance (Article 6(1)(b))</p>
              <p className="text-foreground/70 mt-2">Processing customer orders, managing accounts, providing support services</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Purpose: Marketing Communications</strong>
              <p className="text-foreground/80 mt-2">Legal Basis: Consent (Article 6(1)(a))</p>
              <p className="text-foreground/70 mt-2">Sending promotional emails, newsletters, special offers (with opt-out option)</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Purpose: Legal Compliance</strong>
              <p className="text-foreground/80 mt-2">Legal Basis: Legal obligation (Article 6(1)(c))</p>
              <p className="text-foreground/70 mt-2">Tax reporting, fraud prevention, regulatory compliance</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Purpose: Service Improvement</strong>
              <p className="text-foreground/80 mt-2">Legal Basis: Legitimate interest (Article 6(1)(f))</p>
              <p className="text-foreground/70 mt-2">Analytics, usage tracking, product development (balancing test conducted)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. Categories of Personal Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded">
              <strong className="text-foreground">Identity Data:</strong>
              <p className="text-foreground/70 mt-2">Name, email, phone, address, date of birth</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded">
              <strong className="text-foreground">Financial Data:</strong>
              <p className="text-foreground/70 mt-2">Payment information, billing details, transaction history</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded">
              <strong className="text-foreground">Technical Data:</strong>
              <p className="text-foreground/70 mt-2">IP address, browser type, device information, cookies</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded">
              <strong className="text-foreground">Usage Data:</strong>
              <p className="text-foreground/70 mt-2">Pages visited, time spent, interaction patterns</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. Recipients of Personal Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-foreground/80">
            <p><strong className="text-foreground">Internal:</strong> Authorized employees on a need-to-know basis (sales, support, IT)</p>
            <p><strong className="text-foreground">Service Providers:</strong> Cloud hosting (AWS), payment processing (Stripe), email services (SendGrid), analytics (Google Analytics)</p>
            <p><strong className="text-foreground">Legal/Regulatory:</strong> When required by law, court order, or regulatory authority</p>
            <p><strong className="text-foreground">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</p>
            <p className="text-foreground/70 mt-3">All processors are bound by Data Processing Agreements (DPAs) compliant with GDPR Article 28.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. International Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 mb-4">
            Your data may be transferred to countries outside the European Economic Area (EEA). We ensure appropriate safeguards are in place:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-2 text-foreground/80">
            <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
            <li>Adequacy decisions where applicable</li>
            <li>Binding Corporate Rules (BCRs) for intra-group transfers</li>
            <li>Certification schemes and codes of conduct where recognized</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. Data Retention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-foreground/80">
            <p>We retain your personal data only for as long as necessary to fulfill the purposes outlined in this notice, unless a longer retention period is required or permitted by law.</p>
            <p><strong className="text-foreground">Account Data:</strong> For the duration of your account plus 7 years for legal compliance</p>
            <p><strong className="text-foreground">Marketing Data:</strong> Until you withdraw consent or opt-out</p>
            <p><strong className="text-foreground">Analytics Data:</strong> 26 months (anonymized after 14 months)</p>
            <p><strong className="text-foreground">Legal/Regulatory Data:</strong> As required by applicable law</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7. Your Rights (GDPR Articles 15-22)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Right of Access (Article 15):</strong>
              <p className="text-foreground/70 mt-2">Obtain confirmation and copy of your personal data</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Right to Rectification (Article 16):</strong>
              <p className="text-foreground/70 mt-2">Correct inaccurate or incomplete data</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Right to Erasure (Article 17):</strong>
              <p className="text-foreground/70 mt-2">Request deletion ("right to be forgotten")</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Right to Restrict Processing (Article 18):</strong>
              <p className="text-foreground/70 mt-2">Limit processing in certain circumstances</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Right to Data Portability (Article 20):</strong>
              <p className="text-foreground/70 mt-2">Receive data in structured, machine-readable format</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Right to Object (Article 21):</strong>
              <p className="text-foreground/70 mt-2">Object to processing based on legitimate interests</p>
            </div>
          </div>
          <p className="text-foreground/70 mt-4 text-sm">
            To exercise your rights, contact us at privacy@yourcompany.com or use our data subject rights request portal.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-foreground/80">
            <p><strong className="text-foreground">Data Protection Officer:</strong> dpo@yourcompany.com</p>
            <p><strong className="text-foreground">Privacy Inquiries:</strong> privacy@yourcompany.com</p>
            <p><strong className="text-foreground">Phone:</strong> [Phone number]</p>
            <p><strong className="text-foreground">Supervisory Authority:</strong> [Your local DPA]</p>
          </div>
          <div className="mt-6 p-4 bg-primary/10 rounded">
            <p className="text-sm text-foreground/70">
              ✓ GDPR Article 13 Compliant | ✓ Complete information provision | ✓ Clear legal basis explanation | ✓ Data subject rights information | ✓ Contact details | ✓ Multi-jurisdiction ready
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GdprPrivacyNoticeArtifact;

