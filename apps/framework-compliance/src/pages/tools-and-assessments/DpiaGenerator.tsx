import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useJourneyTool } from '../../hooks/useJourneyTool';
import { usePageTitle } from '../../hooks/usePageTitle';
import { 
  Shield, 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '../../components/ui/Toaster';
import { secureStorage } from '../../utils/storage';
import { createDpia } from '../../services/dpiaService';
import { logError, logWarning } from '../../utils/common/logger';
import { generateDpiaPdf } from '../../utils/pdf';

type DpiaFormData = {
  projectName: string;
  dataController: string;
  processingPurpose: string;
  legalBasis: string;
  dataCategories: string[];
  dataSubjects: string[];
  riskLevel: string;
  safeguards: string[];
};

const DpiaGenerator = () => {
  usePageTitle('DPIA Generator');
  const { markCompleted } = useJourneyTool('dpia-generator');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DpiaFormData>(() => {
    const savedData = secureStorage.getItem<DpiaFormData>('dpia_form_data');
    return savedData || {
      projectName: '',
      dataController: '',
      processingPurpose: '',
      legalBasis: '',
      dataCategories: [],
      dataSubjects: [],
      riskLevel: '',
      safeguards: []
    };
  });

  // Auto-save form data to localStorage
  useEffect(() => {
    secureStorage.setItem('dpia_form_data', formData);
  }, [formData]);

  const dpiaSteps = [
    {
      id: 1,
      title: 'Project Overview',
      description: 'Basic information about the processing activity',
      fields: ['projectName', 'dataController', 'processingPurpose']
    },
    {
      id: 2,
      title: 'Legal Basis & Data',
      description: 'Legal basis and data categories involved',
      fields: ['legalBasis', 'dataCategories', 'dataSubjects']
    },
    {
      id: 3,
      title: 'Risk Assessment', 
      description: 'Assess privacy risks and impacts',
      fields: ['riskLevel', 'safeguards']
    },
    {
      id: 4,
      title: 'Review & Generate',
      description: 'Review inputs and generate DPIA',
      fields: []
    }
  ];

  const handleGenerate = async () => {
    try {
      // Generate PDF with logo
      await generateDpiaPdf({
        projectName: formData.projectName,
        dataController: formData.dataController,
        processingPurpose: formData.processingPurpose,
        legalBasis: formData.legalBasis,
        dataCategories: formData.dataCategories,
        dataSubjects: formData.dataSubjects,
        riskLevel: formData.riskLevel,
        safeguards: formData.safeguards,
        assessmentDate: new Date().toLocaleDateString(),
        assessor: 'System Generated'
      });
      
      // Optionally save to database
      try {
        const today = new Date().toISOString().split('T')[0];
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + 3); // 3 months from now
        
        // Create DPIA record
        await createDpia({
          title: formData.projectName || 'Generated DPIA',
          description: formData.processingPurpose || '',
          processingActivity: formData.processingPurpose || '',
          dataController: formData.dataController || '',
          status: 'draft',
          priority: 'medium',
          riskLevel: (formData.riskLevel as 'low' | 'medium' | 'high' | 'critical') || 'medium',
          createdDate: today,
          dueDate: dueDate.toISOString().split('T')[0],
          assessor: 'System Generated',
          dataSubjects: formData.dataSubjects || [],
          dataTypes: formData.dataCategories || [],
          purposes: formData.processingPurpose ? [formData.processingPurpose] : [],
          legalBasis: formData.legalBasis ? [formData.legalBasis] : [],
          dataSources: [],
          recipients: [],
          risks: [],
          measures: {
            technical: [],
            organizational: formData.safeguards || [],
            legal: [],
          },
          consultation: {
            dpo: false,
            stakeholders: false,
            public: false,
            authorities: false,
          },
          approval: {
            dpo: false,
            management: false,
            legal: false,
          },
        });
        
        toast.success('DPIA saved', 'DPIA has been generated, downloaded, and saved to your DPIA Manager');
        markCompleted();
      } catch (saveError) {
        // If save fails, still show success for download
        logWarning('Failed to save DPIA to database', { error: saveError, component: 'DpiaGenerator' });
        toast.success('DPIA generated', 'Data Protection Impact Assessment has been generated and downloaded');
        markCompleted();
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Error generating DPIA'), { component: 'DpiaGenerator' });
      toast.error('Generation failed', 'Failed to generate DPIA. Please try again.');
    }
  };

  const handleClearForm = () => {
    setFormData({
      projectName: '',
      dataController: '',
      processingPurpose: '',
      legalBasis: '',
      dataCategories: [],
      dataSubjects: [],
      riskLevel: '',
      safeguards: []
    });
    secureStorage.removeItem('dpia_form_data');
    setCurrentStep(1);
    toast.success('Form cleared', 'DPIA form has been reset');
  };


  return (
    <div className="page-container">
      <div className="page-header">
        <Link to="/toolkit" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Toolkit
        </Link>
        <h1 className="page-title">DPIA Generator</h1>
        <p className="page-description">
          Generate GDPR-compliant Data Protection Impact Assessments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Progress Steps */}
        <div className="lg:col-span-1">
          <Card className="modern-card sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                DPIA Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dpiaSteps.map(step => (
                  <div 
                    key={step.id} 
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      currentStep === step.id 
                        ? 'bg-primary text-white' 
                        : currentStep > step.id 
                        ? 'bg-success/10 text-success' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2 text-sm font-bold">
                        {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                      </div>
                      <span className="font-medium">{step.title}</span>
                    </div>
                    <p className="text-xs opacity-80">{step.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                Step {currentStep}: {dpiaSteps.find(s => s.id === currentStep)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project/Processing Name</label>
                    <input
                      type="text"
                      id="dpia-project-name"
                      name="projectName"
                      className="w-full p-3 border border-border rounded-md bg-background"
                      placeholder="e.g., Customer Data Analytics Platform"
                      value={formData.projectName}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Data Controller</label>
                    <input
                      type="text"
                      id="dpia-data-controller"
                      name="dataController"
                      className="w-full p-3 border border-border rounded-md bg-background"
                      placeholder="Organization name and contact details"
                      value={formData.dataController}
                      onChange={(e) => setFormData(prev => ({ ...prev, dataController: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Processing Purpose</label>
                    <textarea
                      id="dpia-processing-purpose"
                      name="processingPurpose"
                      rows={4}
                      className="w-full p-3 border border-border rounded-md bg-background"
                      placeholder="Describe the purpose and context of the data processing"
                      value={formData.processingPurpose}
                      onChange={(e) => setFormData(prev => ({ ...prev, processingPurpose: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="legal-basis-select" className="text-sm font-medium mb-2 block">Legal Basis for Processing</label>
                    <select
                      id="legal-basis-select"
                      title="Select legal basis for processing"
                      className="w-full p-3 border border-border rounded-md bg-background"
                      value={formData.legalBasis}
                      onChange={(e) => setFormData(prev => ({ ...prev, legalBasis: e.target.value }))}
                    >
                      <option value="">Select legal basis</option>
                      <option value="consent">Consent (Art. 6(1)(a))</option>
                      <option value="contract">Contract (Art. 6(1)(b))</option>
                      <option value="legal_obligation">Legal Obligation (Art. 6(1)(c))</option>
                      <option value="vital_interests">Vital Interests (Art. 6(1)(d))</option>
                      <option value="public_task">Public Task (Art. 6(1)(e))</option>
                      <option value="legitimate_interests">Legitimate Interests (Art. 6(1)(f))</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Categories of Personal Data</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Contact Information', 'Identification Data', 'Financial Data',
                        'Location Data', 'Behavioral Data', 'Health Data',
                        'Biometric Data', 'Special Category Data'
                      ].map(category => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={formData.dataCategories.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  dataCategories: [...prev.dataCategories, category]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  dataCategories: prev.dataCategories.filter((c: string) => c !== category)
                                }));
                              }
                            }}
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Categories of Data Subjects</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Employees', 'Customers', 'Prospects', 'Suppliers',
                        'Website Visitors', 'Minors', 'Vulnerable Adults', 'Public Officials'
                      ].map(subject => (
                        <label key={subject} className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={formData.dataSubjects.includes(subject)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  dataSubjects: [...prev.dataSubjects, subject]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  dataSubjects: prev.dataSubjects.filter((s: string) => s !== subject)
                                }));
                              }
                            }}
                          />
                          <span className="text-sm">{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Overall Risk Level</label>
                    <div className="space-y-2">
                      {[
                        { id: 'low', label: 'Low Risk', description: 'Minimal privacy impact' },
                        { id: 'medium', label: 'Medium Risk', description: 'Some privacy concerns' },
                        { id: 'high', label: 'High Risk', description: 'Significant privacy impact' }
                      ].map(risk => (
                        <Card 
                          key={risk.id}
                          className={`cursor-pointer ${formData.riskLevel === risk.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, riskLevel: risk.id }))}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full mr-3 ${
                                risk.id === 'low' ? 'bg-success' :
                                risk.id === 'medium' ? 'bg-warning' : 'bg-destructive'
                              }`}></div>
                              <div>
                                <div className="font-medium">{risk.label}</div>
                                <div className="text-xs text-muted-foreground">{risk.description}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Safeguards and Controls</label>
                    <div className="space-y-2">
                      {[
                        'Data Encryption', 'Access Controls', 'Data Minimization', 'Purpose Limitation',
                        'Retention Policies', 'Staff Training', 'Privacy by Design', 'Regular Audits'
                      ].map(safeguard => (
                        <label key={safeguard} className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={formData.safeguards.includes(safeguard)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  safeguards: [...prev.safeguards, safeguard]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  safeguards: prev.safeguards.filter((s: string) => s !== safeguard)
                                }));
                              }
                            }}
                          />
                          <span className="text-sm">{safeguard}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">DPIA Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Project:</span>
                        <div className="font-medium">{formData.projectName || 'Not specified'}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Controller:</span>
                        <div className="font-medium">{formData.dataController || 'Not specified'}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Legal Basis:</span>
                        <div className="font-medium">{formData.legalBasis || 'Not specified'}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Risk Level:</span>
                        <div className="font-medium capitalize">{formData.riskLevel || 'Not assessed'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full" onClick={handleGenerate}>
                      <Download className="h-4 w-4 mr-2" />
                      Generate DPIA
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleClearForm}>
                      Clear Form
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                    Next Step
                  </Button>
                ) : (
                  <Button onClick={() => setCurrentStep(1)} variant="outline">
                    Start Over
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DPIA Information */}
      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">About Data Protection Impact Assessments</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A DPIA is required under GDPR Article 35 when processing is likely to result in high risk to individuals.
            </p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Required for high-risk processing activities</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Must be completed before processing begins</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Helps identify and mitigate privacy risks</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Demonstrates accountability under GDPR</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DpiaGenerator;
