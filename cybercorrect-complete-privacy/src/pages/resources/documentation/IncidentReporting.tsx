import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  CheckCircle,
  ArrowLeft,
  FileText,
  Globe
} from 'lucide-react';

const IncidentReporting = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Button 
          variant="outline" 
          className="mb-8"
          onClick={() => navigate('/documentation')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documentation
        </Button>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy Incident Reporting</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Guidelines for reporting privacy incidents to regulatory authorities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Globe className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Regulatory Requirements</h3>
              <p className="text-muted-foreground mb-4">
                Understand reporting requirements across different privacy regulations.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>GDPR reporting requirements</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>CCPA notification obligations</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Multi-jurisdiction compliance</span>
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/documentation/breach-response-guide')}
              >
                View Requirements
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Reporting Templates</h3>
              <p className="text-muted-foreground mb-4">
                Access standardized templates for incident reporting.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Regulatory authority templates</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Individual notification templates</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Internal documentation forms</span>
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const templates = `PRIVACY INCIDENT REPORTING TEMPLATES

================================================================================
1. REGULATORY AUTHORITY NOTIFICATION TEMPLATE (GDPR Article 33)
================================================================================

To: [Supervisory Authority Name]
Date: _____________________________
Reference Number: _____________________________

NOTIFICATION OF PERSONAL DATA BREACH

1. NATURE OF THE BREACH
   - Description of the breach:
   - Categories and approximate number of data subjects concerned:
   - Categories and approximate number of personal data records concerned:

2. LIKELY CONSEQUENCES
   - Description of likely consequences of the breach:
   - Potential harm to data subjects:

3. MEASURES PROPOSED OR TAKEN
   - Measures to address the breach:
   - Measures to mitigate possible adverse effects:
   - Additional information:

4. CONTACT INFORMATION
   - Data Protection Officer (if designated):
   - Contact person:
   - Phone:
   - Email:

Signature: _____________________________
Date: _____________________________

================================================================================
2. INDIVIDUAL NOTIFICATION TEMPLATE (GDPR Article 34)
================================================================================

Subject: Notification of Personal Data Breach

Dear [Data Subject Name],

We are writing to inform you of a personal data breach that may affect your personal information.

INCIDENT DETAILS
- Date of breach: 
- Nature of breach: 
- Personal data affected: 

WHAT WE ARE DOING
- Immediate actions taken:
- Measures to address the breach:
- Steps to prevent future occurrences:

WHAT YOU CAN DO
- Recommended actions:
- How to protect yourself:

CONTACT INFORMATION
If you have questions or concerns, please contact us at:
- Email: 
- Phone: 
- Address: 

We sincerely apologize for any inconvenience this may cause.

Sincerely,
[Organization Name]

================================================================================
3. INTERNAL INCIDENT DOCUMENTATION FORM
================================================================================

INCIDENT ID: _____________________________
DATE DISCOVERED: _____________________________
REPORTED BY: _____________________________

1. INCIDENT DESCRIPTION
   - What happened:
   - When did it occur:
   - Where did it occur:
   - Who discovered it:

2. DATA AFFECTED
   - Types of personal data:
   - Number of records:
   - Number of individuals:
   - Special categories of data (if applicable):

3. CAUSE ANALYSIS
   - Root cause:
   - Contributing factors:
   - System/process involved:

4. IMPACT ASSESSMENT
   - Severity level: [ ] Low [ ] Medium [ ] High
   - Likelihood of harm: [ ] Low [ ] Medium [ ] High
   - Potential consequences:

5. RESPONSE ACTIONS
   - Immediate containment:
   - Investigation steps:
   - Remediation measures:

6. NOTIFICATIONS
   - Supervisory authority notified: [ ] Yes [ ] No
   - Date notified: 
   - Individuals notified: [ ] Yes [ ] No
   - Date notified: 

7. FOLLOW-UP
   - Preventive measures:
   - Review date:
   - Lessons learned:

APPROVED BY: _____________________________
DATE: _____________________________
`;

                  const blob = new Blob([templates], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Privacy-Incident-Reporting-Templates-${new Date().toISOString().split('T')[0]}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Privacy Incident Response Resources</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
            Get prepared with comprehensive incident response documentation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/toolkit/incident-response-manager')}
            >
              Access Incident Response Kit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReporting;