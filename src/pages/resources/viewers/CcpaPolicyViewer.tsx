import React, { useState } from 'react';
import { 
  Shield, 
  Download, 
  FileText, 
  CheckCircle, 
  Users,
  Globe,
  Lock,
  Eye,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { toast } from '../../../components/ui/Toaster';

const CcpaPolicyViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const downloadTemplate = () => {
    const templateContent = `
CALIFORNIA CONSUMER PRIVACY ACT (CCPA) COMPLIANCE POLICY

1. PURPOSE AND SCOPE
This policy establishes procedures for compliance with the California Consumer Privacy Act (CCPA) and ensures the protection of California residents' personal information.

2. CONSUMER RIGHTS UNDER CCPA
- Right to Know: Consumers can request disclosure of personal information collected
- Right to Delete: Consumers can request deletion of personal information
- Right to Opt-Out: Consumers can opt-out of the sale of personal information
- Right to Non-Discrimination: Protection against discriminatory treatment

3. PERSONAL INFORMATION CATEGORIES
- Identifiers (name, email, IP address)
- Commercial information (purchase history)
- Biometric information
- Internet activity information
- Geolocation data
- Audio, electronic, visual information
- Professional information
- Education information
- Inferences drawn from personal information

4. DATA COLLECTION PROCEDURES
- Provide clear notice at or before collection
- Specify purposes for which personal information is collected
- Obtain explicit consent for sensitive personal information
- Maintain records of data collection practices

5. CONSUMER REQUEST PROCEDURES
- Establish identity verification procedures
- Respond to requests within 45 days (extendable to 90 days)
- Provide information in portable format
- Maintain audit trail of all requests

6. EMPLOYEE RESPONSIBILITIES
- Data Protection Officer: Oversee CCPA compliance
- Privacy Team: Handle consumer requests
- Legal Team: Review and update policies
- IT Team: Implement technical controls

7. VENDOR MANAGEMENT
- Assess third-party processors for CCPA compliance
- Include CCPA requirements in contracts
- Monitor vendor compliance regularly
- Maintain data processing agreements

8. BREACH NOTIFICATION
- Notify consumers of data breaches affecting personal information
- Coordinate with legal team for breach response
- Document all breach incidents and responses

9. TRAINING AND AWARENESS
- Conduct annual CCPA training for all employees
- Maintain training records
- Update training materials as regulations change

10. COMPLIANCE MONITORING
- Regular audits of data processing activities
- Monitor changes to CCPA regulations
- Update policies and procedures as needed
- Report compliance status to management

This template provides a foundation for CCPA compliance. Customize according to your organization's specific needs and consult with legal counsel.
    `;

    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ccpa-compliance-policy-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Download started", "CCPA policy template downloaded successfully");
  };

  const sections = [
    { id: 'overview', title: 'Policy Overview', icon: Shield },
    { id: 'rights', title: 'Consumer Rights', icon: Users },
    { id: 'procedures', title: 'Procedures', icon: Settings },
    { id: 'compliance', title: 'Compliance Monitoring', icon: Eye }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">CCPA Compliance Policy</h1>
            <p className="text-muted-foreground">California Consumer Privacy Act compliance framework and procedures</p>
          </div>
          <Button onClick={downloadTemplate} variant="default">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>
      </div>

      {/* Policy Framework Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            CCPA Compliance Framework
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg inline-block mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Consumer Rights</h3>
              <p className="text-sm text-muted-foreground">4 Core Rights</p>
            </div>
            <div className="text-center">
              <div className="bg-success/10 dark:bg-success/20 p-3 rounded-lg inline-block mb-2">
                <Globe className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold text-foreground">Data Categories</h3>
              <p className="text-sm text-muted-foreground">9 PI Categories</p>
            </div>
            <div className="text-center">
              <div className="bg-warning/10 dark:bg-warning/20 p-3 rounded-lg inline-block mb-2">
                <Lock className="h-6 w-6 text-warning" />
              </div>
              <h3 className="font-semibold text-foreground">Response Time</h3>
              <p className="text-sm text-muted-foreground">45-90 Days</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 dark:bg-accent/20 p-3 rounded-lg inline-block mb-2">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Documentation</h3>
              <p className="text-sm text-muted-foreground">Required Records</p>
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Policy Purpose and Scope</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This policy establishes procedures for compliance with the California Consumer Privacy Act (CCPA) 
                  and ensures the protection of California residents' personal information.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Applies To:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Organizations with CA customers</li>
                      <li>• Businesses meeting CCPA thresholds</li>
                      <li>• Service providers handling CA data</li>
                      <li>• Third-party vendors and contractors</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Key Requirements:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Consumer rights fulfillment</li>
                      <li>• Privacy notice requirements</li>
                      <li>• Data minimization principles</li>
                      <li>• Vendor management obligations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'rights' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Consumer Rights Under CCPA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Eye className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">Right to Know</h4>
                        <p className="text-sm text-muted-foreground">
                          Consumers can request disclosure of what personal information is collected, used, shared, or sold.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">Right to Delete</h4>
                        <p className="text-sm text-muted-foreground">
                          Consumers can request deletion of their personal information from business records.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Settings className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">Right to Opt-Out</h4>
                        <p className="text-sm text-muted-foreground">
                          Consumers can opt-out of the sale of their personal information to third parties.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground">Right to Non-Discrimination</h4>
                        <p className="text-sm text-muted-foreground">
                          Protection against discriminatory treatment for exercising CCPA rights.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'procedures' && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Implementation Procedures</h3>
            <p className="text-muted-foreground">
              Detailed guidance on implementing CCPA consumer rights procedures, including verification processes, request handling workflows, and response timelines
            </p>
          </div>
        )}

        {activeSection === 'compliance' && (
          <div className="text-center py-12">
            <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Compliance Monitoring</h3>
            <p className="text-muted-foreground">
              Tools and metrics for monitoring CCPA compliance, including request tracking, disclosure audits, and policy update management
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CcpaPolicyViewer;