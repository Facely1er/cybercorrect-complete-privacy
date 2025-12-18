import React from 'react';
import { FileText, Download, Eye, Shield, CheckCircle, Users, Building, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

const DpiaTemplateViewer: React.FC = () => {
  const handleDownload = () => {
    // Simulate download functionality
    const content = `DPIA Template - Data Protection Impact Assessment

SECTION 1: PROJECT OVERVIEW
Project Name: [Insert Project Name]
Data Controller: [Insert Controller Name]
Date of Assessment: [Insert Date]
Assessed by: [Insert Assessor Name]

SECTION 2: DESCRIPTION OF PROCESSING
Nature of Processing: [Describe the processing activities]
Scope of Processing: [Define the scope and context]
Context of Processing: [Explain the context]
Purposes of Processing: [List all purposes]

SECTION 3: NECESSITY AND PROPORTIONALITY
Lawful Basis: [Identify lawful basis under GDPR Article 6]
Legitimate Interests: [If applicable, describe legitimate interests]
Data Minimization: [Explain how data is minimized]
Purpose Limitation: [Describe purpose limitations]

SECTION 4: DATA SUBJECTS AND PERSONAL DATA
Categories of Data Subjects: [List categories]
Categories of Personal Data: [List data types]
Special Category Data: [If applicable, list special categories]
Retention Period: [Define retention periods]

SECTION 5: RISKS TO DATA SUBJECTS
High Risk Factors: [Identify high risk factors]
Impact on Data Subjects: [Assess potential impacts]
Likelihood of Risk: [Assess likelihood]
Risk Rating: [Provide overall risk rating]

SECTION 6: MEASURES TO ADDRESS RISKS
Technical Measures: [List technical safeguards]
Organizational Measures: [List organizational safeguards]
Data Subject Rights: [Explain how rights are protected]
Consent Mechanisms: [If applicable, describe consent]

SECTION 7: CONSULTATION AND APPROVAL
DPO Consultation: [Document DPO consultation]
Stakeholder Involvement: [List stakeholders consulted]
Supervisory Authority: [If consulted, document details]
Approval Date: [Insert approval date]

SECTION 8: MONITORING AND REVIEW
Review Schedule: [Define review frequency]
Monitoring Procedures: [Describe monitoring activities]
Update Triggers: [Define when DPIA should be updated]
Documentation: [Describe documentation requirements]

This template should be customized based on your specific processing activities and organizational requirements.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dpia-template.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">DPIA Template Viewer</h1>
            <p className="text-muted-foreground">Data Protection Impact Assessment template for GDPR compliance</p>
          </div>
        </div>
      </div>

      {/* Template Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-foreground">GDPR Compliant</h3>
                <p className="text-sm text-muted-foreground">Follows GDPR Article 35 requirements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-foreground">8 Sections</h3>
                <p className="text-sm text-muted-foreground">Comprehensive assessment structure</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-foreground">Ready to Use</h3>
                <p className="text-sm text-muted-foreground">Download and customize</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              DPIA Template Structure
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Template Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  section: "1. Project Overview",
                  description: "Basic project information, data controller details, and assessment metadata",
                  icon: Building,
                  color: "text-blue-600"
                },
                {
                  section: "2. Description of Processing",
                  description: "Nature, scope, context, and purposes of the data processing activities",
                  icon: Eye,
                  color: "text-green-600"
                },
                {
                  section: "3. Necessity and Proportionality",
                  description: "Lawful basis, legitimate interests, data minimization, and purpose limitation",
                  icon: Shield,
                  color: "text-purple-600"
                },
                {
                  section: "4. Data Subjects and Personal Data",
                  description: "Categories of data subjects, personal data types, and retention periods",
                  icon: Users,
                  color: "text-orange-600"
                },
                {
                  section: "5. Risks to Data Subjects",
                  description: "Risk identification, impact assessment, likelihood, and risk rating",
                  icon: AlertTriangle,
                  color: "text-red-600"
                },
                {
                  section: "6. Measures to Address Risks",
                  description: "Technical and organizational measures, data subject rights protection",
                  icon: CheckCircle,
                  color: "text-green-600"
                },
                {
                  section: "7. Consultation and Approval",
                  description: "DPO consultation, stakeholder involvement, and approval documentation",
                  icon: Users,
                  color: "text-blue-600"
                },
                {
                  section: "8. Monitoring and Review",
                  description: "Review schedule, monitoring procedures, and update triggers",
                  icon: Calendar,
                  color: "text-purple-600"
                }
              ].map((item, index) => (
                <Card key={index} className="border hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <item.icon className={`h-6 w-6 ${item.color} mt-1`} />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{item.section}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Usage Instructions */}
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How to Use This Template</h3>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>• Download the template and customize it for your specific processing activities</p>
                  <p>• Complete each section thoroughly, providing detailed information</p>
                  <p>• Conduct the DPIA before beginning any high-risk processing activities</p>
                  <p>• Consult with your Data Protection Officer (DPO) during the assessment</p>
                  <p>• Review and update the DPIA regularly or when processing changes</p>
                  <p>• Keep documentation of the assessment process and outcomes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DpiaTemplateViewer;
