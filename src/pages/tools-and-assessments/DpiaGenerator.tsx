import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Shield, 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '../../components/ui/Toaster';

const DpiaGenerator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectName: '',
    dataController: '',
    processingPurpose: '',
    legalBasis: '',
    dataCategories: [] as string[],
    dataSubjects: [] as string[],
    riskLevel: '',
    safeguards: [] as string[]
  });

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

  const handleGenerate = () => {
    const dpiaContent = generateDpiaContent();
    downloadDpia(dpiaContent);
  };

  const generateDpiaContent = () => {
    return `
DATA PROTECTION IMPACT ASSESSMENT (DPIA)

1. PROJECT OVERVIEW
Project Name: ${formData.projectName || '[Project Name]'}
Data Controller: ${formData.dataController || '[Organization Name]'}
Date of Assessment: ${new Date().toLocaleDateString()}
Assessed by: [Assessor Name]

2. DESCRIPTION OF PROCESSING
Processing Purpose: ${formData.processingPurpose || '[Processing Purpose]'}
Legal Basis: ${formData.legalBasis || '[Legal Basis]'}

3. NECESSITY AND PROPORTIONALITY ASSESSMENT
[Detailed assessment of necessity and proportionality]

4. DATA SUBJECTS AND PERSONAL DATA
Categories of Data Subjects: ${formData.dataSubjects.join(', ') || '[Data Subject Categories]'}
Categories of Personal Data: ${formData.dataCategories.join(', ') || '[Data Categories]'}

5. PRIVACY RISK ASSESSMENT
Risk Level: ${formData.riskLevel || '[Risk Level]'}
Identified Risks:
- Risk to individual privacy rights
- Risk of unauthorized processing
- Risk of data breach or loss

6. MEASURES TO ADDRESS RISKS
Safeguards and Controls:
${formData.safeguards.map(s => `- ${s}`).join('\n') || '- [Safeguards to be implemented]'}

7. CONSULTATION AND APPROVAL
DPO Consultation: [Date and outcome]
Stakeholder Consultation: [Details]
Final Approval: [Approval details]

8. MONITORING AND REVIEW
Review Date: [Next review date]
Monitoring Procedures: [Ongoing monitoring approach]

This DPIA was generated using CyberCorrect Privacy Platform's automated DPIA generator. 
Please review and customize based on your specific processing activities.

Generated: ${new Date().toLocaleDateString()}
    `;
  };

  const downloadDpia = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dpia-${formData.projectName.replace(/\s+/g, '-').toLowerCase() || 'generated'}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('DPIA generated', 'Data Protection Impact Assessment has been generated and downloaded');
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
            <h1 className="text-3xl font-bold text-foreground">DPIA Generator</h1>
            <p className="text-muted-foreground">
              Generate GDPR-compliant Data Protection Impact Assessments
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Progress Steps */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
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
                        ? 'bg-green-100 text-green-800' 
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
                    <label className="text-sm font-medium mb-2 block">Legal Basis for Processing</label>
                    <select
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
                                  dataCategories: prev.dataCategories.filter(c => c !== category)
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
                                  dataSubjects: prev.dataSubjects.filter(s => s !== subject)
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
                                risk.id === 'low' ? 'bg-green-500' :
                                risk.id === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
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
                                  safeguards: prev.safeguards.filter(s => s !== safeguard)
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
                  
                  <Button className="w-full" onClick={handleGenerate}>
                    <Download className="h-4 w-4 mr-2" />
                    Generate DPIA
                  </Button>
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