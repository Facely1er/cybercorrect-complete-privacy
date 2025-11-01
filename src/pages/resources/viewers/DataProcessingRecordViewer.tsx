import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  FileText, 
  CheckCircle, 
  Users,
  Globe,
  Scale
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { toast } from '../../../components/ui/Toaster';

const DataProcessingRecordViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const downloadTemplate = () => {
    const templateContent = `
GDPR ARTICLE 30 - RECORDS OF PROCESSING ACTIVITIES TEMPLATE

CONTROLLER INFORMATION
Name of Controller: [Organization Name]
Address: [Organization Address]
Contact Details: [Phone, Email]
Representative (if applicable): [EU Representative Details]
Data Protection Officer: [DPO Contact Information]

PROCESSING ACTIVITY RECORD #1

1. NAME AND CONTACT DETAILS
Controller: [Organization Name]
Joint Controller (if applicable): [Details]
Controller Representative: [EU Representative if applicable]
Data Protection Officer: [DPO Contact]

2. PURPOSES OF PROCESSING
Primary Purpose: [e.g., Customer relationship management]
Secondary Purposes: [e.g., Marketing communications, Service improvement]
Legal Basis: [Consent/Contract/Legal Obligation/Vital Interests/Public Task/Legitimate Interests]

3. CATEGORIES OF DATA SUBJECTS
- Customers and prospects
- Website visitors
- Newsletter subscribers
- [Other categories]

4. CATEGORIES OF PERSONAL DATA
- Contact information (name, email, phone)
- Identification data (customer ID, account number)
- Financial information (payment details, billing address)
- Usage data (website analytics, service usage)
- [Other categories]

5. CATEGORIES OF RECIPIENTS
Internal Recipients:
- Customer service team
- Marketing department
- IT support team

External Recipients:
- Payment processors
- Email service providers
- Analytics providers
- [Other third parties]

6. TRANSFERS TO THIRD COUNTRIES
Country/Organization: [If applicable]
Adequacy Decision: [Yes/No]
Safeguards: [Standard Contractual Clauses/Binding Corporate Rules/Other]
Copy Available: [Location where copy can be obtained]

7. RETENTION PERIODS
- Customer data: 7 years after contract termination
- Marketing data: 2 years or until consent withdrawal
- Website analytics: 26 months
- [Other retention periods]

8. SECURITY MEASURES
Technical Measures:
- Encryption of data in transit and at rest
- Access controls and authentication
- Regular security updates and patches

Organizational Measures:
- Staff training on data protection
- Data processing agreements with processors
- Regular security assessments

PROCESSING ACTIVITY RECORD #2
[Repeat structure for each processing activity]

This template complies with GDPR Article 30 requirements. Customize for your specific processing activities and consult legal counsel for compliance validation.

Generated: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gdpr-article30-records-template-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Download started", "Article 30 records template downloaded successfully");
  };

  const sections = [
    { id: 'overview', title: 'Template Overview', icon: Database },
    { id: 'requirements', title: 'GDPR Requirements', icon: Scale },
    { id: 'structure', title: 'Record Structure', icon: FileText },
    { id: 'compliance', title: 'Compliance Tips', icon: CheckCircle }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Data Processing Records Template</h1>
            <p className="text-muted-foreground">GDPR Article 30 compliant records of processing activities</p>
          </div>
          <Button onClick={downloadTemplate} variant="default">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>
      </div>

      {/* Template Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-blue-600" />
            Article 30 Records Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg inline-block mb-2">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground">Complete Template</h3>
              <p className="text-sm text-muted-foreground">All required fields</p>
            </div>
            <div className="text-center">
              <div className="bg-success/10 dark:bg-success/20 p-3 rounded-lg inline-block mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground">GDPR Compliant</h3>
              <p className="text-sm text-muted-foreground">Article 30 requirements</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 dark:bg-accent/20 p-3 rounded-lg inline-block mb-2">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground">Multi-Purpose</h3>
              <p className="text-sm text-muted-foreground">Various processing activities</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg inline-block mb-2">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-foreground">Audit Ready</h3>
              <p className="text-sm text-muted-foreground">Supervisor authority ready</p>
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
                  ? 'border-blue-500 text-blue-600'
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
              <CardTitle>GDPR Article 30 Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Article 30 of the GDPR requires organizations to maintain records of all personal data processing activities. 
                These records must be available to supervisory authorities upon request.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Who Must Maintain Records:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Organizations with 250+ employees</li>
                    <li>• Organizations processing high-risk data</li>
                    <li>• Organizations processing special category data</li>
                    <li>• Organizations processing criminal conviction data</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Record Requirements:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Must be in writing (electronic form acceptable)</li>
                    <li>• Must be available to supervisory authority</li>
                    <li>• Must be kept up to date</li>
                    <li>• Must cover all processing activities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === 'requirements' && (
          <div className="text-center py-12">
            <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">GDPR Requirements</h3>
            <p className="text-muted-foreground">
              Detailed requirements interface coming soon
            </p>
          </div>
        )}

        {activeSection === 'structure' && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Record Structure</h3>
            <p className="text-muted-foreground">
              Record structure guide coming soon
            </p>
          </div>
        )}

        {activeSection === 'compliance' && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Compliance Tips</h3>
            <p className="text-muted-foreground">
              Compliance guidance interface coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataProcessingRecordViewer;