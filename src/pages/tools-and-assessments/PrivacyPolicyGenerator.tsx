import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  FileText, 
  ArrowLeft, 
  Settings,
  Shield,
  Zap,
  Copy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '../../components/ui/Toaster';

const PrivacyPolicyGenerator = () => {
  const [selectedRegulation, setSelectedRegulation] = useState('gdpr');
  const [organizationType, setOrganizationType] = useState('business');
  const [policyType, setPolicyType] = useState('comprehensive');
  const [, ] = useState(1);

  const regulations = [
    {
      id: 'gdpr',
      name: 'GDPR',
      description: 'European General Data Protection Regulation',
      icon: Eye,
      color: 'blue'
    },
    {
      id: 'ccpa',
      name: 'CCPA',
      description: 'California Consumer Privacy Act',
      icon: Users,
      color: 'purple'
    },
    {
      id: 'lgpd',
      name: 'LGPD',
      description: 'Brazilian Lei Geral de Proteção de Dados',
      icon: Globe,
      color: 'green'
    },
    {
      id: 'pipeda',
      name: 'PIPEDA',
      description: 'Canadian Personal Information Protection Act',
      icon: Scale,
      color: 'orange'
    }
  ];

  const policyTypes = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Privacy Policy',
      description: 'Full privacy policy covering all data processing activities',
      sections: ['Data collection', 'Use purposes', 'Sharing', 'Rights', 'Security', 'Contact info']
    },
    {
      id: 'notice',
      name: 'Privacy Notice',
      description: 'Concise privacy notice for specific processing activities',
      sections: ['Purpose', 'Legal basis', 'Recipients', 'Retention', 'Rights']
    },
    {
      id: 'cookie',
      name: 'Cookie Policy',
      description: 'Specialized policy for website cookie usage',
      sections: ['Cookie types', 'Purposes', 'Third parties', 'User choices']
    },
    {
      id: 'employee',
      name: 'Employee Privacy Policy',
      description: 'Internal policy for employee data processing',
      sections: ['HR data', 'Monitoring', 'Rights', 'Retention', 'Security']
    }
  ];

  const handleGenerate = () => {
    const policyContent = generatePolicyContent();
    downloadPolicy(policyContent);
  };

  const generatePolicyContent = () => {
    const regulation = regulations.find(r => r.id === selectedRegulation);
    const policy = policyTypes.find(p => p.id === policyType);
    
    return `
${policy?.name.toUpperCase()} - ${regulation?.name} COMPLIANT

1. INTRODUCTION
This ${policy?.name.toLowerCase()} explains how we collect, use, and protect your personal information in compliance with ${regulation?.description}.

2. DATA CONTROLLER INFORMATION
Organization Name: [Your Organization]
Address: [Organization Address]
Contact: [Contact Information]
Data Protection Officer: [DPO Contact]

3. LEGAL BASIS FOR PROCESSING
We process personal data under the following legal bases:
- Consent (Article 6(1)(a))
- Contract (Article 6(1)(b))
- Legal obligation (Article 6(1)(c))
- Legitimate interests (Article 6(1)(f))

4. PERSONAL DATA CATEGORIES
We collect and process the following categories of personal data:
- Contact information (name, email, phone)
- Identification data (government ID numbers)
- Financial information (payment details)
- Usage data (website analytics)
- Communication records

5. DATA SUBJECT RIGHTS
Under ${regulation?.name}, you have the following rights:
- Right to access your personal data
- Right to rectification of inaccurate data
- Right to erasure ("right to be forgotten")
- Right to restrict processing
- Right to data portability
- Right to object to processing

6. DATA RETENTION
We retain personal data for the following periods:
- Customer data: 7 years after contract termination
- Marketing data: 2 years or until consent withdrawal
- Legal compliance data: As required by law

7. DATA SECURITY
We implement appropriate technical and organizational measures including:
- Encryption of data in transit and at rest
- Access controls and authentication
- Regular security assessments
- Staff training on data protection

8. INTERNATIONAL TRANSFERS
When we transfer data outside the EEA, we ensure adequate protection through:
- Adequacy decisions
- Standard Contractual Clauses (SCCs)
- Binding Corporate Rules (BCRs)

9. BREACH NOTIFICATION
In case of a personal data breach that poses high risk to your rights and freedoms, we will notify you within 72 hours of becoming aware of the breach.

10. CONTACT INFORMATION
For any questions about this policy or to exercise your rights:
Data Protection Officer: [DPO Email]
Privacy Team: [Privacy Email]
Phone: [Contact Number]

This policy was generated using PrivacyCorrect's automated policy generator and should be reviewed by legal counsel before implementation.

Last updated: ${new Date().toLocaleDateString()}
    `;
  };

  const downloadPolicy = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedRegulation}-${policyType}-policy-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Policy generated', 'Privacy policy has been generated and downloaded');
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
            <h1 className="text-3xl font-bold text-foreground">Privacy Policy Generator</h1>
            <p className="text-muted-foreground">
              Generate compliant privacy policies for global privacy regulations
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Policy Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Regulation Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Select Regulation</label>
                  <div className="space-y-2">
                    {regulations.map(regulation => (
                      <Card 
                        key={regulation.id}
                        className={`cursor-pointer transition-all ${
                          selectedRegulation === regulation.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedRegulation(regulation.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center">
                            <regulation.icon className="h-5 w-5 text-primary mr-2" />
                            <div>
                              <div className="font-medium text-sm">{regulation.name}</div>
                              <div className="text-xs text-muted-foreground">{regulation.description}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Policy Type Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Policy Type</label>
                  <div className="space-y-2">
                    {policyTypes.map(type => (
                      <Card 
                        key={type.id}
                        className={`cursor-pointer transition-all ${
                          policyType === type.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setPolicyType(type.id)}
                      >
                        <CardContent className="p-3">
                          <div className="font-medium text-sm mb-1">{type.name}</div>
                          <div className="text-xs text-muted-foreground mb-2">{type.description}</div>
                          <div className="flex flex-wrap gap-1">
                            {type.sections.slice(0, 3).map(section => (
                              <span key={section} className="text-xs bg-muted px-1 py-0.5 rounded">
                                {section}
                              </span>
                            ))}
                            {type.sections.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{type.sections.length - 3}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Organization Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Organization Type</label>
                  <select
                    value={organizationType}
                    onChange={(e) => setOrganizationType(e.target.value)}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  >
                    <option value="business">Business/Commercial</option>
                    <option value="nonprofit">Non-profit</option>
                    <option value="government">Government Agency</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Educational Institution</option>
                    <option value="financial">Financial Services</option>
                  </select>
                </div>

                <Button className="w-full" onClick={handleGenerate}>
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policy Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Policy Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/20 p-6 rounded-lg min-h-[400px] font-mono text-sm">
                <div className="text-center mb-6">
                  <h2 className="text-lg font-bold">
                    {policyTypes.find(p => p.id === policyType)?.name.toUpperCase()}
                  </h2>
                  <p className="text-muted-foreground">
                    {regulations.find(r => r.id === selectedRegulation)?.description} Compliant
                  </p>
                </div>
                
                <div className="space-y-4 text-xs">
                  <div>
                    <h3 className="font-bold">1. INTRODUCTION</h3>
                    <p>This privacy policy explains how we collect, use, and protect your personal information...</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold">2. DATA CONTROLLER INFORMATION</h3>
                    <p>[Organization Details]</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold">3. PERSONAL DATA WE COLLECT</h3>
                    <p>Categories of personal data processed...</p>
                  </div>
                  
                  <div className="text-center text-muted-foreground">
                    ... additional sections ...
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" onClick={() => {
                    navigator.clipboard.writeText(generatePolicyContent());
                    toast.success('Copied to clipboard', 'Policy content copied');
                  }}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Policy Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Regulation Compliant</h3>
            <p className="text-sm text-muted-foreground">
              Generated policies meet current requirements for GDPR, CCPA, LGPD, PIPEDA, and other major privacy regulations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Customizable Templates</h3>
            <p className="text-sm text-muted-foreground">
              Policies are generated from proven templates that can be customized for your specific organizational needs.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Instant Generation</h3>
            <p className="text-sm text-muted-foreground">
              Generate complete privacy policies in minutes, not weeks. Save time while ensuring compliance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyGenerator;