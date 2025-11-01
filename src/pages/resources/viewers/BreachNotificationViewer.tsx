import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Download, 
  FileText, 
  CheckCircle, 
  Clock,
  Phone,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { toast } from '../../../components/ui/Toaster';

const BreachNotificationViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const downloadTemplate = () => {
    const templateContent = `
PRIVACY BREACH NOTIFICATION TEMPLATE

INCIDENT OVERVIEW
Incident ID: [AUTO-GENERATED]
Date Detected: [DATE]
Detection Method: [HOW DISCOVERED]
Incident Type: [CONFIDENTIALITY/INTEGRITY/AVAILABILITY BREACH]

AFFECTED DATA
Types of Personal Data Involved:
□ Contact information (names, addresses, phone numbers, email)
□ Financial information (credit card numbers, bank accounts)
□ Identity information (SSN, passport numbers, driver's license)
□ Health information (medical records, health insurance)
□ Biometric data (fingerprints, facial recognition data)
□ Special category data (race, religion, political opinions)
□ Other: [SPECIFY]

Number of Affected Individuals: [NUMBER]
Geographic Scope: [COUNTRIES/REGIONS AFFECTED]

BREACH DETAILS
How the Breach Occurred: [DETAILED DESCRIPTION]
Security Measures Bypassed: [WHAT PROTECTIONS FAILED]
Access Gained: [WHAT SYSTEMS/DATA ACCESSED]
Duration of Breach: [FROM - TO DATES]

IMMEDIATE RESPONSE ACTIONS TAKEN
□ Containment measures implemented
□ Breach source identified and secured
□ Affected systems isolated
□ Incident response team activated
□ Law enforcement notified (if applicable)
□ Insurance company notified
□ Forensic investigation initiated

RISK ASSESSMENT
Likelihood of Harm to Individuals:
□ Low - Minimal risk of harm
□ Medium - Some risk of identity theft or fraud
□ High - Significant risk of harm to individuals

Severity of Potential Consequences:
□ Low - Minor inconvenience
□ Medium - Financial loss possible
□ High - Substantial harm likely

REGULATORY NOTIFICATIONS

GDPR Notification (if applicable):
□ Supervisory authority notified within 72 hours
□ Individual notification sent (if high risk)
Authority Notified: [SUPERVISORY AUTHORITY NAME]
Notification Date: [DATE]
Reference Number: [AUTHORITY REFERENCE]

CCPA Notification (if applicable):
□ California Attorney General notified
□ Individual notification provided
Notification Method: [EMAIL/MAIL/WEBSITE POSTING]

Other Jurisdictions:
[LIST OTHER APPLICABLE NOTIFICATION REQUIREMENTS]

INDIVIDUAL NOTIFICATION
Notification Required: □ Yes □ No
Reason if No: [JUSTIFY WHY NO NOTIFICATION NEEDED]

If Yes:
Notification Method: □ Email □ Mail □ Phone □ Website posting
Date Sent: [DATE]
Number of Individuals Notified: [COUNT]

NOTIFICATION CONTENT CHECKLIST
□ Nature of breach described
□ Categories of data involved specified
□ Likely consequences explained
□ Measures taken to address breach outlined
□ Measures recommended for individuals included
□ Contact information provided

REMEDIATION MEASURES
Immediate Actions:
□ Change passwords/credentials
□ Patch security vulnerabilities
□ Enhance monitoring
□ Additional staff training

Long-term Improvements:
□ Security control enhancements
□ Process improvements
□ Technology upgrades
□ Policy updates

LESSONS LEARNED
Root Cause: [PRIMARY CAUSE OF BREACH]
Contributing Factors: [SECONDARY FACTORS]
Process Improvements: [WHAT WILL BE CHANGED]

DOCUMENTATION
□ Incident report completed
□ Evidence preserved
□ Timeline documented
□ Communications logged
□ Regulatory correspondence filed

APPROVAL
Prepared by: [NAME AND TITLE]
Date: [DATE]
Reviewed by: [DPO/PRIVACY OFFICER]
Date: [DATE]
Approved by: [SENIOR MANAGEMENT]
Date: [DATE]

This template ensures comprehensive documentation of privacy breaches and compliance with notification requirements across jurisdictions.
    `;

    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breach-notification-template-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Download started", "Breach notification template downloaded successfully");
  };

  const sections = [
    { id: 'overview', title: 'Template Overview', icon: AlertTriangle },
    { id: 'requirements', title: 'Notification Requirements', icon: Clock },
    { id: 'process', title: 'Notification Process', icon: FileText },
    { id: 'compliance', title: 'Compliance Checklist', icon: CheckCircle }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Breach Notification Template</h1>
            <p className="text-muted-foreground">Comprehensive template for privacy breach notification procedures</p>
          </div>
          <Button onClick={downloadTemplate} variant="destructive">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>
      </div>

      {/* Template Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Breach Notification Framework
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-destructive/10 dark:bg-destructive/20 p-3 rounded-lg inline-block mb-2">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-foreground">72-Hour Rule</h3>
              <p className="text-sm text-muted-foreground">GDPR notification deadline</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg inline-block mb-2">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground">Authority Notification</h3>
              <p className="text-sm text-muted-foreground">Regulatory reporting</p>
            </div>
            <div className="text-center">
              <div className="bg-success/10 dark:bg-success/20 p-3 rounded-lg inline-block mb-2">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground">Individual Notice</h3>
              <p className="text-sm text-muted-foreground">Data subject notification</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 dark:bg-accent/20 p-3 rounded-lg inline-block mb-2">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground">Documentation</h3>
              <p className="text-sm text-muted-foreground">Incident records</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="bg-background border-b border-border mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                activeSection === section.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <section.icon className="w-4 h-4 mr-2" />
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content */}
      <div className="space-y-6">
        {activeSection === 'overview' && (
          <Card>
            <CardHeader>
              <CardTitle>Breach Notification Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Privacy breach notification requirements vary by jurisdiction but generally require prompt notification 
                to both regulatory authorities and affected individuals when certain criteria are met.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Key Notification Triggers:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Unauthorized access to personal data</li>
                    <li>• Data theft or loss of devices containing personal data</li>
                    <li>• Accidental disclosure to unauthorized parties</li>
                    <li>• System breaches affecting personal data integrity</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Risk Assessment Factors:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Types of personal data affected</li>
                    <li>• Number of individuals impacted</li>
                    <li>• Likelihood of harm to individuals</li>
                    <li>• Severity of potential consequences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === 'requirements' && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Notification Requirements</h3>
            <p className="text-muted-foreground">
              Comprehensive guidance on breach notification requirements under GDPR Article 33 and 34, including the 72-hour notification timeline, content requirements, and supervisory authority obligations
            </p>
          </div>
        )}

        {activeSection === 'process' && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Notification Process</h3>
            <p className="text-muted-foreground">
              Step-by-step workflow for managing data breach notifications, from initial detection and assessment to notification execution and documentation
            </p>
          </div>
        )}

        {activeSection === 'compliance' && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Compliance Checklist</h3>
            <p className="text-muted-foreground">
              Detailed checklist to ensure your breach notification process meets all regulatory requirements across GDPR, CCPA, and other applicable privacy regulations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreachNotificationViewer;