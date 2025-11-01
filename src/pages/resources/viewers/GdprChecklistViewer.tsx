import React, { useState } from 'react';
import { 
  Shield, 
  Download, 
  FileText, 
  CheckCircle, 
  Users,
  AlertTriangle,
  Database,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { toast } from '../../../components/ui/Toaster';

const GdprChecklistViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheckItem = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const downloadChecklist = () => {
    const checklistContent = `
GDPR COMPLIANCE CHECKLIST

LAWFUL BASIS AND CONSENT
☐ Identify lawful basis for all data processing activities
☐ Implement consent mechanisms where required
☐ Ensure consent is freely given, specific, informed, and unambiguous
☐ Provide easy withdrawal of consent mechanisms
☐ Document consent records and withdrawal requests

DATA SUBJECT RIGHTS
☐ Implement right to access procedures
☐ Establish right to rectification processes
☐ Create right to erasure (right to be forgotten) workflows
☐ Implement data portability mechanisms
☐ Establish right to object procedures
☐ Implement automated decision-making safeguards

DATA PROTECTION BY DESIGN AND DEFAULT
☐ Conduct Data Protection Impact Assessments (DPIAs)
☐ Implement privacy by design in new systems
☐ Establish data minimization principles
☐ Implement purpose limitation controls
☐ Ensure accuracy and storage limitation compliance

INTERNATIONAL TRANSFERS
☐ Assess adequacy decisions for data transfers
☐ Implement appropriate safeguards (SCCs, BCRs)
☐ Conduct Transfer Impact Assessments (TIAs)
☐ Document all international transfer mechanisms

BREACH NOTIFICATION
☐ Establish 72-hour breach notification procedures
☐ Implement data subject notification processes
☐ Create breach documentation and reporting systems
☐ Train incident response teams on GDPR requirements

RECORDS AND DOCUMENTATION
☐ Maintain Records of Processing Activities (ROPA)
☐ Document lawful basis for each processing activity
☐ Maintain consent records and evidence
☐ Keep training records and compliance documentation

VENDOR MANAGEMENT
☐ Assess processor GDPR compliance
☐ Implement Data Processing Agreements (DPAs)
☐ Monitor sub-processor arrangements
☐ Conduct regular vendor audits

GOVERNANCE AND ACCOUNTABILITY
☐ Appoint Data Protection Officer (if required)
☐ Implement privacy governance structure
☐ Establish accountability measures
☐ Conduct regular compliance reviews
    `;

    const blob = new Blob([checklistContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gdpr-compliance-checklist-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Download started", "GDPR checklist downloaded successfully");
  };

  const checklistSections = [
    {
      id: 'lawful-basis',
      title: 'Lawful Basis & Consent',
      items: [
        'Identify lawful basis for all processing',
        'Implement consent mechanisms',
        'Ensure consent is freely given and specific',
        'Provide easy consent withdrawal',
        'Document consent records'
      ]
    },
    {
      id: 'rights',
      title: 'Data Subject Rights',
      items: [
        'Right to access procedures',
        'Right to rectification processes',
        'Right to erasure workflows',
        'Data portability mechanisms',
        'Right to object procedures'
      ]
    },
    {
      id: 'privacy-design',
      title: 'Privacy by Design',
      items: [
        'Conduct DPIAs for high-risk processing',
        'Implement privacy by design principles',
        'Establish data minimization controls',
        'Ensure purpose limitation compliance',
        'Implement storage limitation'
      ]
    },
    {
      id: 'transfers',
      title: 'International Transfers',
      items: [
        'Assess adequacy decisions',
        'Implement appropriate safeguards',
        'Conduct Transfer Impact Assessments',
        'Document transfer mechanisms',
        'Monitor transfer compliance'
      ]
    }
  ];

  const sections = [
    { id: 'overview', title: 'Overview', icon: Shield },
    { id: 'checklist', title: 'Compliance Checklist', icon: CheckCircle },
    { id: 'rights', title: 'Data Subject Rights', icon: Users },
    { id: 'documentation', title: 'Documentation', icon: FileText }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">GDPR Compliance Checklist</h1>
            <p className="text-muted-foreground">General Data Protection Regulation compliance verification and tracking</p>
          </div>
          <Button onClick={downloadChecklist} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Download Checklist
          </Button>
        </div>
      </div>

      {/* GDPR Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            GDPR Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg inline-block mb-2">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground">Completed</h3>
              <p className="text-sm text-muted-foreground">{checkedItems.size} items</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg inline-block mb-2">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-foreground">Remaining</h3>
              <p className="text-sm text-muted-foreground">
                {checklistSections.reduce((total, section) => total + section.items.length, 0) - checkedItems.size} items
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg inline-block mb-2">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground">Data Categories</h3>
              <p className="text-sm text-muted-foreground">9 categories</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg inline-block mb-2">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground">Rights</h3>
              <p className="text-sm text-muted-foreground">8 data subject rights</p>
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

      {/* Tab Content */}
      <div>
        {activeSection === 'overview' && (
          <Card>
            <CardHeader>
              <CardTitle>GDPR Compliance Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                The General Data Protection Regulation (GDPR) is a comprehensive data protection law that requires 
                organizations to implement robust privacy protection measures and respect data subject rights.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Key Principles:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Lawfulness, fairness and transparency</li>
                    <li>• Purpose limitation</li>
                    <li>• Data minimization</li>
                    <li>• Accuracy</li>
                    <li>• Storage limitation</li>
                    <li>• Integrity and confidentiality</li>
                    <li>• Accountability</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === 'checklist' && (
          <div className="space-y-6">
            {checklistSections.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.items.map((item, index) => {
                      const itemId = `${section.id}-${index}`;
                      return (
                        <div key={itemId} className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleCheckItem(itemId)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              checkedItems.has(itemId)
                                ? 'bg-green-600 border-green-600'
                                : 'border-gray-300 hover:border-green-500'
                            }`}
                          >
                            {checkedItems.has(itemId) && (
                              <CheckCircle className="h-3 w-3 text-white" />
                            )}
                          </button>
                          <span className={`${
                            checkedItems.has(itemId) 
                              ? 'text-muted-foreground line-through' 
                              : 'text-foreground'
                          }`}>
                            {item}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeSection === 'rights' && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Data Subject Rights</h3>
            <p className="text-muted-foreground">
              This section will display detailed guidance on implementing GDPR data subject rights, including right of access, rectification, erasure, restriction, portability, and objection
            </p>
          </div>
        )}

        {activeSection === 'documentation' && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Documentation Requirements</h3>
            <p className="text-muted-foreground">
              This section will provide comprehensive templates and guidance for GDPR documentation requirements including records of processing activities, privacy policies, and consent management
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GdprChecklistViewer;