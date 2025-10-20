import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { InternalLink, RelatedContent } from '../../components/ui/InternalLinkingHelper';
import { 
  Eye, 
  CheckCircle, 
  Plus, 
  Edit, 
  Download, 
  ArrowLeft,
  Users,
  Scale,
  Globe
} from 'lucide-react';
import { toast } from '../../components/ui/Toaster';

interface ProcessingActivity {
  id: string;
  name: string;
  purpose: string;
  legalBasis: string;
  dataTypes: string[];
  dataSubjects: string[];
  recipients: string[];
  retentionPeriod: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const GdprMapper = () => {
  const [activities] = useState<ProcessingActivity[]>([
    {
      id: 'activity-1',
      name: 'Customer Registration',
      purpose: 'User account creation and management',
      legalBasis: 'Contract',
      dataTypes: ['Name', 'Email', 'Phone'],
      dataSubjects: ['Customers', 'Prospects'],
      recipients: ['Internal Staff', 'Payment Processor'],
      retentionPeriod: '7 years',
      riskLevel: 'medium'
    },
    {
      id: 'activity-2',
      name: 'Marketing Communications',
      purpose: 'Direct marketing and promotional activities',
      legalBasis: 'Consent',
      dataTypes: ['Email', 'Preferences', 'Behavior Data'],
      dataSubjects: ['Customers', 'Newsletter Subscribers'],
      recipients: ['Marketing Team', 'Email Service Provider'],
      retentionPeriod: '2 years or until consent withdrawn',
      riskLevel: 'low'
    },
    {
      id: 'activity-3',
      name: 'Employee HR Management',
      purpose: 'Human resources administration',
      legalBasis: 'Legal Obligation',
      dataTypes: ['Personal Details', 'Employment History', 'Performance Data'],
      dataSubjects: ['Employees', 'Job Applicants'],
      recipients: ['HR Department', 'Payroll Provider'],
      retentionPeriod: '6 years after employment ends',
      riskLevel: 'high'
    }
  ]);

  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const handleExportMapping = () => {
    const mappingData = {
      metadata: {
        title: 'GDPR Data Processing Mapping',
        created: new Date().toISOString(),
        version: '1.0',
        organization: 'Sample Organization'
      },
      processingActivities: activities,
      compliance: {
        framework: 'GDPR',
        articles: ['Article 6', 'Article 30', 'Article 32'],
        dpiaRequired: activities.some(a => a.riskLevel === 'high')
      }
    };

    const blob = new Blob([JSON.stringify(mappingData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gdpr-processing-mapping-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Mapping exported", "GDPR processing mapping has been exported successfully");
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-200';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getLegalBasisColor = (basis: string) => {
    const colors: Record<string, string> = {
      'Consent': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      'Contract': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      'Legal Obligation': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
      'Legitimate Interest': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200'
    };
    return colors[basis] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/toolkit" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Toolkit
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">GDPR Data Processing Mapper</h1>
            <p className="text-muted-foreground">Map and document personal data processing activities for GDPR compliance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
            <Button onClick={handleExportMapping}>
              <Download className="h-4 w-4 mr-2" />
              Export Mapping
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Processing Activities List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-5 w-5 mr-2 text-primary" />
                Data Processing Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <Card 
                    key={activity.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedActivity === activity.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedActivity(activity.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{activity.name}</h3>
                          <p className="text-sm text-muted-foreground">{activity.purpose}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(activity.riskLevel)}`}>
                            {activity.riskLevel.toUpperCase()} RISK
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLegalBasisColor(activity.legalBasis)}`}>
                            {activity.legalBasis}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="font-medium">Data Types:</span>
                          <div className="mt-1">
                            {activity.dataTypes.slice(0, 2).map((type, idx) => (
                              <span key={idx} className="inline-block bg-muted text-muted-foreground px-1 py-0.5 rounded mr-1">
                                {type}
                              </span>
                            ))}
                            {activity.dataTypes.length > 2 && (
                              <span className="text-muted-foreground">+{activity.dataTypes.length - 2} more</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Data Subjects:</span>
                          <div className="mt-1">
                            {activity.dataSubjects.map((subject, idx) => (
                              <span key={idx} className="inline-block bg-muted text-muted-foreground px-1 py-0.5 rounded mr-1">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Retention:</span>
                          <div className="mt-1 text-muted-foreground">{activity.retentionPeriod}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Details Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-primary" />
                Activity Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedActivity ? (
                <div className="space-y-4">
                  {(() => {
                    const activity = activities.find(a => a.id === selectedActivity);
                    if (!activity) return null;
                    
                    return (
                      <>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">{activity.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{activity.purpose}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Legal Basis</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getLegalBasisColor(activity.legalBasis)}`}>
                            {activity.legalBasis}
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Personal Data Categories</h4>
                          <div className="space-y-1">
                            {activity.dataTypes.map((type, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <CheckCircle className="h-3 w-3 text-primary mr-2" />
                                <span>{type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Data Subjects</h4>
                          <div className="space-y-1">
                            {activity.dataSubjects.map((subject, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <Users className="h-3 w-3 text-primary mr-2" />
                                <span>{subject}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Recipients</h4>
                          <div className="space-y-1">
                            {activity.recipients.map((recipient, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <Globe className="h-3 w-3 text-primary mr-2" />
                                <span>{recipient}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button variant="outline" className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Activity
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a processing activity to view its details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* GDPR Compliance Check */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                GDPR Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Records of Processing (Art. 30)</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lawful Basis Documented</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Subject Rights</span>
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">DPIA Required</span>
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <Link to="/toolkit/resources/viewers/dpia-template">
                  <Button variant="outline" size="sm" className="w-full">
                    Generate DPIA
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* GDPR Requirements Info */}
      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-4">
          <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">GDPR Article 30 - Records of Processing</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Organizations must maintain records of all personal data processing activities under GDPR Article 30.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="text-sm space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Document purposes of processing for each activity</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Identify categories of data subjects and personal data</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Map data recipients and international transfers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Define retention periods and security measures</span>
                </li>
              </ul>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Next Steps:</p>
                <InternalLink href="/toolkit/privacy-rights-manager" className="text-sm block">
                  → Set up data subject rights management
                </InternalLink>
                <InternalLink href="/toolkit/dpia-generator" className="text-sm block">
                  → Generate DPIAs for high-risk processing
                </InternalLink>
                <InternalLink href="/documentation/gdpr-implementation-guide" className="text-sm block">
                  → Read complete GDPR implementation guide
                </InternalLink>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add related content */}
        <RelatedContent currentPath="/toolkit/gdpr-mapper" />
      </div>
    </div>
  );
};

export default GdprMapper;