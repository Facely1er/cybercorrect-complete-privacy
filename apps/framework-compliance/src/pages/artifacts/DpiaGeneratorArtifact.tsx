import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateDataExportPdf } from '@/utils/pdf/generateExportPdf';

const DpiaGeneratorArtifact: React.FC = () => {
  const navigate = useNavigate();

  const handleExportPdf = async () => {
    try {
      await generateDataExportPdf(
        {
          title: 'Data Protection Impact Assessment (DPIA)',
          subtitle: 'Comprehensive Privacy Risk Assessment',
          timestamp: new Date().toISOString(),
          reportId: `DPIA-${Date.now()}`,
          version: '1.0',
          generatedBy: 'DPIA Generator Tool'
        },
        {
          'Assessment Date': new Date().toLocaleDateString(),
          'Assessment Version': '1.0',
          'Next Review Date': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          'Assessed By': 'Data Protection Officer',
          'Risk Level': 'MEDIUM',
          'Status': 'Approved'
        },
        [
          {
            title: 'Processing Activity Details',
            headers: ['Field', 'Value'],
            rows: [
              ['Processing Activity Name', 'Customer Data Collection and Storage'],
              ['Purpose of Processing', 'To manage customer relationships, process orders, provide customer support, and maintain service records'],
              ['Legal Basis', 'Contract performance (GDPR Article 6(1)(b)) and Legitimate Interest (GDPR Article 6(1)(f))'],
              ['Processing Duration', 'For the duration of the customer relationship plus 7 years for legal compliance']
            ]
          },
          {
            title: 'Identified Risks',
            headers: ['Risk', 'Likelihood', 'Impact', 'Mitigation Status'],
            rows: [
              ['Unauthorized Access', 'Medium', 'High', 'Mitigated'],
              ['Data Breach', 'Low', 'High', 'Mitigated'],
              ['Inadequate Data Retention', 'Medium', 'Medium', 'Mitigated'],
              ['Insufficient Transparency', 'Low', 'Medium', 'Mitigated']
            ]
          }
        ],
        `dpia-assessment-${new Date().toISOString().split('T')[0]}.pdf`
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
          <h1 className="text-3xl font-bold text-foreground">Data Protection Impact Assessment (DPIA)</h1>
        </div>
        <Button onClick={handleExportPdf}>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800">
            <p className="text-foreground/80 mb-4">
              This Data Protection Impact Assessment (DPIA) evaluates the privacy risks associated with the processing of personal data in our customer relationship management system. The assessment identifies potential risks to data subjects' rights and freedoms and outlines mitigation measures to address identified risks.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-foreground">Assessment Date:</strong>
                <p className="text-foreground/70">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <strong className="text-foreground">Assessment Version:</strong>
                <p className="text-foreground/70">1.0</p>
              </div>
              <div>
                <strong className="text-foreground">Next Review Date:</strong>
                <p className="text-foreground/70">{new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <div>
                <strong className="text-foreground">Assessed By:</strong>
                <p className="text-foreground/70">Data Protection Officer</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Description of Processing Activity</h2>
            <div className="space-y-3 text-foreground/80">
              <p><strong className="text-foreground">Processing Activity Name:</strong> Customer Data Collection and Storage</p>
              <p><strong className="text-foreground">Purpose of Processing:</strong> To manage customer relationships, process orders, provide customer support, and maintain service records.</p>
              <p><strong className="text-foreground">Legal Basis:</strong> Contract performance (GDPR Article 6(1)(b)) and Legitimate Interest (GDPR Article 6(1)(f))</p>
              <p><strong className="text-foreground">Data Controller:</strong> [Your Organization Name], [Address], [Contact Information]</p>
              <p><strong className="text-foreground">Data Processor:</strong> [Third-party service providers as applicable]</p>
              <p><strong className="text-foreground">Processing Duration:</strong> For the duration of the customer relationship plus 7 years for legal compliance</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Categories of Personal Data</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded">
                <strong className="text-foreground">Identity Data:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/80">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Mailing address</li>
                  <li>Date of birth</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded">
                <strong className="text-foreground">Financial Data:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/80">
                  <li>Payment card information (tokenized)</li>
                  <li>Billing address</li>
                  <li>Transaction history</li>
                  <li>Bank account details (where applicable)</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded">
                <strong className="text-foreground">Technical Data:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/80">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Usage analytics</li>
                  <li>Login timestamps</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded">
                <strong className="text-foreground">Profile Data:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/80">
                  <li>Preferences and interests</li>
                  <li>Purchase history</li>
                  <li>Support ticket history</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Subjects</h2>
            <p className="text-foreground/80">
              The processing activity affects the following categories of data subjects: customers, prospective customers, website visitors, and individuals who contact our support services. Estimated number of data subjects: [To be determined based on business scale].
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Recipients and Transfers</h2>
            <div className="space-y-3 text-foreground/80">
              <p><strong className="text-foreground">Internal Recipients:</strong> Authorized employees in sales, customer support, and IT departments on a need-to-know basis. Access is logged and monitored.</p>
              <p><strong className="text-foreground">External Recipients:</strong> Cloud service providers (AWS, Azure), payment processors (Stripe), email service providers, and analytics platforms. All processors are bound by Data Processing Agreements (DPAs).</p>
              <p><strong className="text-foreground">International Transfers:</strong> Data may be transferred to countries outside the EEA. All transfers are subject to appropriate safeguards including Standard Contractual Clauses (SCCs), adequacy decisions, or Binding Corporate Rules (BCRs).</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Risk Assessment</h2>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-2">
                  <strong className="text-foreground text-lg">Overall Risk Level: MEDIUM</strong>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-sm font-semibold">
                    Medium Risk
                  </span>
                </div>
                <p className="text-sm text-foreground/70">Risk calculated based on likelihood and impact assessment of all identified risks.</p>
              </div>
              
              <div>
                <strong className="text-foreground mb-3 block text-lg">Identified Risks:</strong>
                <div className="space-y-3">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded">
                    <strong className="text-foreground">Risk 1: Unauthorized Access (Likelihood: Medium, Impact: High)</strong>
                    <p className="text-foreground/80 mt-2">Potential for unauthorized access to customer data through security vulnerabilities, insider threats, or compromised credentials. Could result in identity theft, financial fraud, or privacy violations.</p>
                    <p className="text-foreground/70 mt-2"><strong>Mitigation:</strong> Multi-factor authentication, role-based access control, regular access reviews, intrusion detection systems.</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <strong className="text-foreground">Risk 2: Data Breach (Likelihood: Low, Impact: High)</strong>
                    <p className="text-foreground/80 mt-2">Risk of data breach through cyberattacks, system failures, or human error. Could expose sensitive customer information to unauthorized parties.</p>
                    <p className="text-foreground/70 mt-2"><strong>Mitigation:</strong> Encryption at rest and in transit, regular security audits, incident response plan, 72-hour breach notification procedures.</p>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <strong className="text-foreground">Risk 3: Inadequate Data Retention (Likelihood: Medium, Impact: Medium)</strong>
                    <p className="text-foreground/80 mt-2">Data may be retained longer than necessary, violating data minimization principles and increasing exposure risk.</p>
                    <p className="text-foreground/70 mt-2"><strong>Mitigation:</strong> Automated data retention policies, scheduled deletion procedures, regular data audits.</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <strong className="text-foreground">Risk 4: Insufficient Transparency (Likelihood: Low, Impact: Medium)</strong>
                    <p className="text-foreground/80 mt-2">Data subjects may not be adequately informed about processing activities, limiting their ability to exercise rights.</p>
                    <p className="text-foreground/70 mt-2"><strong>Mitigation:</strong> Clear privacy notices, accessible privacy policy, easy-to-use data subject rights request process.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Mitigation Measures</h2>
            <div className="space-y-4 text-foreground/80">
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800">
                <strong className="text-foreground text-lg">Security Measures:</strong>
                <ul className="list-disc list-inside mt-3 space-y-2">
                  <li>Encryption at rest (AES-256) and in transit (TLS 1.3)</li>
                  <li>Multi-factor authentication (MFA) for all system access</li>
                  <li>Role-based access control (RBAC) with principle of least privilege</li>
                  <li>Regular security audits and penetration testing (quarterly)</li>
                  <li>Intrusion detection and monitoring systems (24/7)</li>
                  <li>Automated backup and disaster recovery procedures</li>
                  <li>Network segmentation and firewall protection</li>
                  <li>Regular software updates and patch management</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded">
                <strong className="text-foreground text-lg">Organizational Measures:</strong>
                <ul className="list-disc list-inside mt-3 space-y-2">
                  <li>Privacy training for all staff (annually, with updates as needed)</li>
                  <li>Data Protection Officer (DPO) oversight and consultation</li>
                  <li>Incident response plan with 72-hour notification procedures</li>
                  <li>Regular data protection impact assessments (annually or when changes occur)</li>
                  <li>Data processing agreements with all processors</li>
                  <li>Privacy by design and default principles in system development</li>
                  <li>Regular compliance audits and reviews</li>
                </ul>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded">
                <strong className="text-foreground text-lg">Technical Measures:</strong>
                <ul className="list-disc list-inside mt-3 space-y-2">
                  <li>Automated data retention policies with scheduled deletion</li>
                  <li>Data minimization - only collect necessary data</li>
                  <li>Pseudonymization where possible</li>
                  <li>Regular data quality checks and validation</li>
                  <li>Automated logging and audit trails</li>
                  <li>Data subject rights request automation</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Consultation and Approval</h2>
            <div className="space-y-3 text-foreground/80">
              <p><strong className="text-foreground">DPO Review:</strong> [Date] - Approved with recommendations implemented</p>
              <p><strong className="text-foreground">IT Security Review:</strong> [Date] - Approved, security measures validated</p>
              <p><strong className="text-foreground">Legal Review:</strong> [Date] - Approved, legal basis confirmed</p>
              <p><strong className="text-foreground">Management Approval:</strong> [Date] - Approved, resources allocated</p>
              <p className="text-foreground/70 mt-4 italic border-l-4 border-primary pl-4">
                This DPIA has been reviewed and approved by the Data Protection Officer and relevant stakeholders. The processing activity may proceed subject to implementation of all identified mitigation measures. This assessment will be reviewed annually or when significant changes to the processing occur.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/10 rounded">
            <p className="text-sm text-foreground/70">
              ✓ GDPR Article 35 Compliant | ✓ Comprehensive risk assessment | ✓ Detailed mitigation measures | ✓ Regular review schedule | ✓ Stakeholder consultation
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DpiaGeneratorArtifact;

