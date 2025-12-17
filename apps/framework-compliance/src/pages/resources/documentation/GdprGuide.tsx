import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Shield,
  CheckCircle,
  ArrowLeft,
  Globe,
  UserCheck,
  Lock,
  Eye,
  Fingerprint,
  Search,
  DatabaseBackup,
  FileWarning,
  Scale,
  RefreshCw,
  UserX,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GdprGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Button 
          variant="outline" 
          className="mb-8"
          onClick={() => navigate('/resources')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Button>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">GDPR Compliance Guide</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive guide to understanding and implementing GDPR requirements through the NIST Privacy Framework
          </p>
        </div>

        {/* GDPR Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Understanding GDPR</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Globe className="h-6 w-6 text-primary mr-2" />
                  What is GDPR?
                </h3>
                <p className="text-muted-foreground mb-4">
                  The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection and privacy in the European Union and the European Economic Area. It also addresses the transfer of personal data outside the EU and EEA areas.
                </p>
                <p className="text-muted-foreground">
                  The GDPR aims primarily to give control to individuals over their personal data and to simplify the regulatory environment for international business by unifying the regulation within the EU.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="h-6 w-6 text-primary mr-2" />
                  GDPR Key Principles
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Lawfulness, fairness and transparency</p>
                      <p className="text-xs text-muted-foreground">Processing must be lawful, fair, and transparent to the data subject</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Purpose limitation</p>
                      <p className="text-xs text-muted-foreground">Collected for specified, explicit, and legitimate purposes</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Data minimization</p>
                      <p className="text-xs text-muted-foreground">Adequate, relevant, and limited to what's necessary</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Accuracy</p>
                      <p className="text-xs text-muted-foreground">Data must be kept accurate and up to date</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Storage limitation</p>
                      <p className="text-xs text-muted-foreground">Kept no longer than necessary</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Integrity and confidentiality</p>
                      <p className="text-xs text-muted-foreground">Processed securely to protect against unauthorized processing</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Accountability</p>
                      <p className="text-xs text-muted-foreground">Take responsibility for and demonstrate compliance</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* GDPR to NIST Privacy Framework Mapping */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Fingerprint className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">GDPR and NIST Privacy Framework</h3>
                  <p className="text-muted-foreground mb-4">
                    The NIST Privacy Framework provides a structured approach that aligns with GDPR requirements. By mapping GDPR articles to NIST Privacy Framework controls, organizations can implement a comprehensive privacy program that satisfies both frameworks.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">Benefits of the Mapping Approach:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>Streamlined compliance management</li>
                        <li>Structured implementation methodology</li>
                        <li>Clear accountability and responsibility assignment</li>
                        <li>Risk-based approach to privacy compliance</li>
                        <li>Integration with existing security frameworks</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Key NIST Privacy Functions:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li><span className="font-medium">Identify</span> - Develop understanding of systems, individuals, and data processing</li>
                        <li><span className="font-medium">Govern</span> - Establish governance structure for privacy risks</li>
                        <li><span className="font-medium">Control</span> - Develop and implement data processing controls</li>
                        <li><span className="font-medium">Communicate</span> - Develop and implement communication processes</li>
                        <li><span className="font-medium">Protect</span> - Develop and implement safeguards for data</li>
                      </ul>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/toolkit/gdpr-mapper')}
                  >
                    Use GDPR-NIST Mapper
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GDPR Key Requirements */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Key GDPR Requirements & Implementation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <UserCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold ml-3">Lawful Basis for Processing</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Under GDPR Article 6, you must have a valid lawful basis for processing personal data.
                </p>
                <div className="space-y-3">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="font-medium text-sm">Common Lawful Bases:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5 mt-1">
                      <li>Consent</li>
                      <li>Contract</li>
                      <li>Legal obligation</li>
                      <li>Vital interests</li>
                      <li>Public interest</li>
                      <li>Legitimate interests</li>
                    </ul>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Implementation Steps</p>
                      <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-5">
                        <li>Identify all data processing activities</li>
                        <li>Determine lawful basis for each activity</li>
                        <li>Document justification for chosen basis</li>
                        <li>Implement appropriate mechanisms (e.g., consent forms)</li>
                        <li>Review and update lawful bases regularly</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold ml-3">Transparency & Privacy Notices</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Per GDPR Articles 12-14, provide clear information about data processing to individuals.
                </p>
                <div className="space-y-3">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="font-medium text-sm">Required Information:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5 mt-1">
                      <li>Identity and contact details of controller</li>
                      <li>Purposes and legal basis for processing</li>
                      <li>Data retention periods</li>
                      <li>Rights of the data subject</li>
                      <li>Recipients or categories of recipients</li>
                      <li>Information about transfers to third countries</li>
                    </ul>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Implementation Steps</p>
                      <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-5">
                        <li>Create comprehensive privacy notice</li>
                        <li>Implement layered approach for clear communication</li>
                        <li>Make notices easily accessible</li>
                        <li>Review and update regularly</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold ml-3">Data Subject Rights</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  GDPR Articles 15-22 grant individuals specific rights regarding their personal data.
                </p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted/30 p-2 rounded-md">
                      <p className="font-medium text-xs">Right of access</p>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-md">
                      <p className="font-medium text-xs">Right to rectification</p>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-md">
                      <p className="font-medium text-xs">Right to erasure</p>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-md">
                      <p className="font-medium text-xs">Right to restriction</p>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-md">
                      <p className="font-medium text-xs">Right to portability</p>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-md">
                      <p className="font-medium text-xs">Right to object</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Implementation Steps</p>
                      <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-5">
                        <li>Create data subject request procedures</li>
                        <li>Implement verification processes</li>
                        <li>Establish response timeframes (1 month)</li>
                        <li>Train staff on handling requests</li>
                        <li>Document all requests and responses</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold ml-3">Data Protection by Design</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Article 25 requires implementing appropriate technical and organizational measures by design and by default.
                </p>
                <div className="space-y-3">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="font-medium text-sm">Key Requirements:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5 mt-1">
                      <li>Privacy by design in all projects</li>
                      <li>Data minimization by default</li>
                      <li>Built-in privacy protections</li>
                      <li>Pseudonymization where possible</li>
                    </ul>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Implementation Steps</p>
                      <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-5">
                        <li>Incorporate privacy risk assessments into development</li>
                        <li>Implement data minimization practices</li>
                        <li>Use privacy-enhancing technologies</li>
                        <li>Document design decisions</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <DatabaseBackup className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold ml-3">Records of Processing</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Article 30 requires organizations to maintain records of all processing activities.
                </p>
                <div className="space-y-3">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="font-medium text-sm">Required Documentation:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5 mt-1">
                      <li>Purposes of processing</li>
                      <li>Categories of data subjects and data</li>
                      <li>Recipients of personal data</li>
                      <li>Transfers to third countries</li>
                      <li>Retention schedules</li>
                      <li>Security measures description</li>
                    </ul>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Implementation Steps</p>
                      <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-5">
                        <li>Develop data inventory template</li>
                        <li>Map all data processing activities</li>
                        <li>Document all required information</li>
                        <li>Maintain and update regularly</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <FileWarning className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold ml-3">Breach Notification</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Articles 33-34 require notification of personal data breaches to authorities and affected individuals.
                </p>
                <div className="space-y-3">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="font-medium text-sm">Key Requirements:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5 mt-1">
                      <li>Notify supervisory authority within 72 hours</li>
                      <li>Document all breaches internally</li>
                      <li>Notify affected individuals for high-risk breaches</li>
                      <li>Include specific information in notifications</li>
                    </ul>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Implementation Steps</p>
                      <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-5">
                        <li>Create breach response plan</li>
                        <li>Implement breach detection mechanisms</li>
                        <li>Establish notification procedures</li>
                        <li>Train staff on breach response</li>
                        <li>Conduct regular breach simulations</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Scale className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold ml-3">Data Protection Impact Assessment (DPIA)</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Article 35 requires conducting DPIAs for high-risk processing activities before they begin.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-muted/30 p-3 rounded-md mb-3">
                      <p className="font-medium text-sm">When a DPIA is Required:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5 mt-1">
                        <li>Systematic and extensive profiling with significant effects</li>
                        <li>Large scale processing of special categories of data</li>
                        <li>Systematic monitoring of publicly accessible areas</li>
                        <li>Processing that is likely to result in high risk to individuals</li>
                      </ul>
                    </div>
                    <div className="flex items-start">
                      <Info className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        DPIAs are a key component of the accountability principle and help demonstrate GDPR compliance.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start mb-3">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">DPIA Process</p>
                        <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-5">
                          <li>Identify need for a DPIA</li>
                          <li>Describe the processing</li>
                          <li>Consider consultation with stakeholders</li>
                          <li>Assess necessity and proportionality</li>
                          <li>Identify and assess risks</li>
                          <li>Identify measures to mitigate risks</li>
                          <li>Document outcomes</li>
                          <li>Implement recommendations</li>
                          <li>Review regularly</li>
                        </ol>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const dpiaTemplate = `DATA PROTECTION IMPACT ASSESSMENT (DPIA) TEMPLATE

Organization Name: _____________________________
Date: _____________________________
Assessment ID: _____________________________

1. PROCESSING ACTIVITY DESCRIPTION
   - Name of processing activity: 
   - Purpose of processing: 
   - Nature of processing: 
   - Categories of data subjects: 
   - Categories of personal data: 
   - Special categories of personal data (if applicable): 
   - Volume of data: 
   - Frequency of processing: 

2. NECESSITY AND PROPORTIONALITY
   - Why is the processing necessary? 
   - What are the benefits? 
   - Are there less intrusive alternatives? 
   - Is the processing proportionate to the purpose? 

3. RISK ASSESSMENT
   - Likelihood of risk: [ ] Low [ ] Medium [ ] High
   - Severity of impact: [ ] Low [ ] Medium [ ] High
   - Overall risk level: [ ] Low [ ] Medium [ ] High
   
   Identified Risks:
   1. 
   2. 
   3. 

4. DATA SUBJECTS AFFECTED
   - Number of individuals affected: 
   - Vulnerable groups (if applicable): 
   - Nature of potential harm: 

5. DATA SOURCES AND SHARING
   - Where does the data come from? 
   - Who will have access to the data? 
   - Will data be shared with third parties? 
   - Will data be transferred outside the EU/EEA? 

6. TECHNICAL AND ORGANIZATIONAL MEASURES
   - Security measures in place: 
   - Access controls: 
   - Encryption: 
   - Data minimization measures: 
   - Retention policies: 
   - Other safeguards: 

7. CONSULTATION
   - Have data subjects been consulted? [ ] Yes [ ] No
   - Have the DPO/legal team been consulted? [ ] Yes [ ] No
   - Have other stakeholders been consulted? [ ] Yes [ ] No
   - Consultation notes: 

8. MITIGATION MEASURES
   - Measures to address identified risks:
   1. 
   2. 
   3. 

9. RESIDUAL RISK
   - After mitigation measures, what is the residual risk? 
   - Is the residual risk acceptable? [ ] Yes [ ] No
   - If not acceptable, what additional measures are needed? 

10. APPROVAL AND REVIEW
    - Assessor name: 
    - Assessor signature: 
    - Date: 
    - DPO approval: [ ] Yes [ ] No
    - Next review date: 

11. IMPLEMENTATION AND MONITORING
    - Implementation plan: 
    - Monitoring arrangements: 
    - Review schedule: 

NOTES:
`;

                        const blob = new Blob([dpiaTemplate], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `DPIA-Template-${new Date().toISOString().split('T')[0]}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download DPIA Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-warning/10 dark:bg-warning/20 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground mb-2">Special Categories of Personal Data</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  GDPR Article 9 has stricter requirements for processing special categories of personal data, including:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="bg-muted/30 p-2 rounded-md">
                    <p className="text-xs">Racial or ethnic origin</p>
                  </div>
                  <div className="bg-muted/30 p-2 rounded-md">
                    <p className="text-xs">Political opinions</p>
                  </div>
                  <div className="bg-muted/30 p-2 rounded-md">
                    <p className="text-xs">Religious or philosophical beliefs</p>
                  </div>
                  <div className="bg-muted/30 p-2 rounded-md">
                    <p className="text-xs">Trade union membership</p>
                  </div>
                  <div className="bg-muted/30 p-2 rounded-md">
                    <p className="text-xs">Genetic or biometric data</p>
                  </div>
                  <div className="bg-muted/30 p-2 rounded-md">
                    <p className="text-xs">Health data</p>
                  </div>
                  <div className="bg-muted/30 p-2 rounded-md">
                    <p className="text-xs">Sex life or sexual orientation</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Processing these categories is prohibited unless a specific exception applies, such as explicit consent, vital interests, or substantial public interest.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GDPR-NIST Integration */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Implementing GDPR through NIST Privacy Framework</h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="flex items-center mb-4">
                    <Fingerprint className="h-8 w-8 text-primary mr-2" />
                    <h3 className="text-xl font-semibold">NIST-GDPR Integration</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    The NIST Privacy Framework provides a structured approach to implement GDPR requirements through its five core functions.
                  </p>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Benefits of Integration:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                      <li>Structured implementation approach</li>
                      <li>Clear, actionable controls</li>
                      <li>Alignment with security frameworks</li>
                      <li>Adaptable to organizational needs</li>
                      <li>Enables continuous improvement</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="space-y-4">
                    <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Search className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-medium">Identify Function</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Develop organizational understanding to manage privacy risk for individuals:
                      </p>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <p><span className="font-medium">GDPR Mapping:</span> Articles 5, 6, 30 (lawfulness, records of processing)</p>
                      </div>
                    </div>
                    
                    <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Shield className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-medium">Govern Function</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Develop and implement organizational governance structure:
                      </p>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <p><span className="font-medium">GDPR Mapping:</span> Articles 24-27, 37-39 (DPO, accountability)</p>
                      </div>
                    </div>
                    
                    <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Lock className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-medium">Control Function</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Develop and implement data processing activities:
                      </p>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <p><span className="font-medium">GDPR Mapping:</span> Articles 25, 32 (data protection by design, security)</p>
                      </div>
                    </div>
                    
                    <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <UserCheck className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-medium">Communicate Function</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Develop and implement communication processes:
                      </p>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <p><span className="font-medium">GDPR Mapping:</span> Articles 12-23 (transparency, data subject rights)</p>
                      </div>
                    </div>
                    
                    <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Shield className="h-5 w-5 text-primary mr-2" />
                        <h4 className="font-medium">Protect Function</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Develop and implement data protection safeguards:
                      </p>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <p><span className="font-medium">GDPR Mapping:</span> Articles 25, 32, 33-34 (security, breach notification)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Subject Rights Implementation */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Implementing Data Subject Rights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">Right of Access</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">GDPR Article 15</span><br />
                      Individuals have the right to obtain confirmation of whether personal data is being processed and access to that data.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Implementation Steps:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Create subject access request (SAR) procedure</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Implement identity verification</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Develop data retrieval process</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Create response templates</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">Right to Rectification</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">GDPR Article 16</span><br />
                      Individuals have the right to have inaccurate or incomplete personal data rectified.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Implementation Steps:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Create rectification request procedure</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Add verification mechanisms</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Implement data correction workflows</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Notify third parties of corrections</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <UserX className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">Right to Erasure</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">GDPR Article 17</span><br />
                      The "right to be forgotten" - individuals can request deletion of their personal data in certain circumstances.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Implementation Steps:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Create deletion request procedure</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Assess each request against exceptions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Implement secure deletion methods</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Notify processors and third parties</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">Right to Restriction</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">GDPR Article 18</span><br />
                      Individuals can request restriction of processing in specific circumstances.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Implementation Steps:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Create restriction request procedure</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Implement data flagging system</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Limit processing capabilities</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Notify user before lifting restriction</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <DatabaseBackup className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">Right to Portability</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">GDPR Article 20</span><br />
                      Individuals can request their data in a structured, commonly used, machine-readable format.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Implementation Steps:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Create data portability procedure</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Develop export functionality (CSV, XML, JSON)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Implement secure transmission methods</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Ensure data accuracy and completeness</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">Right to Object</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">GDPR Article 21</span><br />
                      Individuals can object to processing based on legitimate interests, public interest, or for direct marketing.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Implementation Steps:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Create objection procedure</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Implement opt-out mechanisms</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Develop balancing test for legitimate interests</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>Create clear marketing opt-out systems</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                const guide = `DATA SUBJECT RIGHTS IMPLEMENTATION GUIDE
GDPR Articles 15-22 Implementation

================================================================================
1. RIGHT OF ACCESS (Article 15)
================================================================================

What it means:
Individuals have the right to obtain confirmation of whether personal data is being 
processed and access to that data.

Implementation Steps:
1. Create Subject Access Request (SAR) procedure
   - Designate responsible person/team
   - Create request form/template
   - Establish intake process
   - Set up tracking system

2. Implement identity verification
   - Require proof of identity
   - Verify requester is the data subject
   - Document verification process

3. Develop data retrieval process
   - Identify all systems containing personal data
   - Create data extraction procedures
   - Compile comprehensive data package
   - Include processing information (purposes, legal basis, retention, etc.)

4. Create response templates
   - Standard response format
   - Include all required information per Article 15
   - Provide data in commonly used format

5. Establish timelines
   - Respond within 1 month
   - Can extend by 2 months for complex requests
   - Notify if extension needed

6. Handle exemptions
   - Document when access can be restricted
   - Consider third-party rights
   - Balance transparency with other rights

================================================================================
2. RIGHT TO RECTIFICATION (Article 16)
================================================================================

What it means:
Individuals have the right to have inaccurate or incomplete personal data rectified.

Implementation Steps:
1. Create rectification request procedure
   - Designate responsible person/team
   - Create request form
   - Establish intake process

2. Add verification mechanisms
   - Verify identity of requester
   - Verify accuracy of claimed inaccuracy
   - Consider supporting documentation

3. Implement data correction workflows
   - Update data in all relevant systems
   - Ensure corrections propagate across systems
   - Maintain audit trail of changes

4. Notify third parties of corrections
   - Identify recipients of the data
   - Notify them of corrections (unless impossible/disproportionate)
   - Document notifications sent

5. Handle disputes
   - If correction refused, explain why
   - Provide right to complain to supervisory authority
   - Document all decisions

================================================================================
3. RIGHT TO ERASURE / "RIGHT TO BE FORGOTTEN" (Article 17)
================================================================================

What it means:
Individuals can request deletion of their personal data in certain circumstances.

When it applies:
- Data no longer necessary for original purpose
- Consent withdrawn and no other legal basis
- Objection to processing (and no overriding legitimate interest)
- Unlawful processing
- Legal obligation to erase
- Data collected from child (under 16) in relation to information society services

Implementation Steps:
1. Create deletion request procedure
   - Designate responsible person/team
   - Create request form
   - Establish intake process

2. Assess each request against exceptions
   - Freedom of expression and information
   - Legal compliance obligations
   - Public interest in public health
   - Archiving purposes in public interest
   - Scientific/historical research
   - Establishment/exercise/defense of legal claims

3. Implement secure deletion methods
   - Physical deletion where possible
   - Secure overwriting for digital data
   - Verify deletion completion
   - Document deletion actions

4. Notify processors and third parties
   - Identify all recipients of the data
   - Notify them of erasure request
   - Request they erase the data
   - Document notifications sent

5. Handle technical limitations
   - Consider backup systems
   - Plan for restoration scenarios
   - Document any data that cannot be deleted and why

================================================================================
4. RIGHT TO RESTRICTION OF PROCESSING (Article 18)
================================================================================

What it means:
Individuals can request restriction of processing in specific circumstances.

When it applies:
- Accuracy contested (during verification period)
- Processing unlawful but erasure not desired
- Data no longer needed but required for legal claims
- Objection pending (verification of overriding legitimate grounds)

Implementation Steps:
1. Create restriction request procedure
   - Designate responsible person/team
   - Create request form
   - Establish intake process

2. Implement data flagging system
   - Mark restricted data clearly
   - Prevent processing except storage
   - Ensure flags persist across systems

3. Limit processing capabilities
   - Block automated processing
   - Prevent sharing with third parties
   - Allow only essential processing (storage)

4. Notify user before lifting restriction
   - Inform when restriction will be lifted
   - Explain reason for lifting
   - Provide opportunity to object

5. Handle exceptions
   - Processing for legal claims
   - Protection of rights of other individuals
   - Important public interest

================================================================================
5. RIGHT TO DATA PORTABILITY (Article 20)
================================================================================

What it means:
Individuals can request their data in a structured, commonly used, machine-readable format.

When it applies:
- Processing based on consent or contract
- Processing by automated means
- Personal data provided by the data subject

Implementation Steps:
1. Create data portability procedure
   - Designate responsible person/team
   - Create request form
   - Establish intake process

2. Develop export functionality
   - Support multiple formats (CSV, XML, JSON)
   - Include all personal data provided by subject
   - Include data inferred from provided data
   - Exclude data about others

3. Implement secure transmission methods
   - Secure download links
   - Encrypted transmission
   - Password protection if emailing
   - Verify recipient identity

4. Ensure data accuracy and completeness
   - Include all relevant data
   - Verify export completeness
   - Test export formats

5. Handle direct transmission requests
   - If requested, transmit directly to another controller
   - Verify technical feasibility
   - Obtain explicit request for transmission
   - Ensure secure transmission

================================================================================
6. RIGHT TO OBJECT (Article 21)
================================================================================

What it means:
Individuals can object to processing based on legitimate interests, public interest, 
or for direct marketing.

Implementation Steps:
1. Create objection procedure
   - Designate responsible person/team
   - Create request form
   - Establish intake process

2. Implement opt-out mechanisms
   - Easy-to-use opt-out options
   - Clear instructions
   - Immediate effect
   - No cost to data subject

3. Develop balancing test for legitimate interests
   - Assess if legitimate interest overrides data subject interests
   - Document balancing test
   - Consider specific situation of data subject

4. Create clear marketing opt-out systems
   - One-click opt-out for marketing
   - Apply immediately
   - No exceptions for marketing objections
   - Maintain suppression lists

5. Handle processing objections
   - Stop processing unless compelling legitimate grounds
   - Notify data subject of decision
   - Provide right to complain
   - Document all objections and responses

================================================================================
GENERAL IMPLEMENTATION REQUIREMENTS
================================================================================

1. Response Timeframes
   - Respond within 1 month of request
   - Can extend by 2 months for complex requests
   - Must notify if extension needed
   - No fee unless manifestly unfounded/excessive

2. Identity Verification
   - Verify identity of requester
   - Request additional information if needed
   - Document verification process

3. Documentation
   - Maintain records of all requests
   - Document responses provided
   - Track response times
   - Keep audit trail

4. Training
   - Train staff on data subject rights
   - Provide handling procedures
   - Regular updates on requirements
   - Role-specific training

5. Technology Support
   - Systems to track requests
   - Data location and retrieval tools
   - Automated workflows where possible
   - Integration across systems

6. Communication
   - Clear, plain language responses
   - Provide information free of charge
   - Explain any refusals clearly
   - Inform about right to complain

7. Continuous Improvement
   - Regular review of procedures
   - Update based on experience
   - Monitor response times
   - Seek feedback from data subjects

================================================================================
CHECKLIST FOR IMPLEMENTATION
================================================================================

[ ] Procedures created for all six rights
[ ] Staff trained on data subject rights
[ ] Identity verification process established
[ ] Data location tools/maps created
[ ] Response templates developed
[ ] Tracking system implemented
[ ] Timeline monitoring in place
[ ] Documentation procedures established
[ ] Technology solutions deployed
[ ] Regular review schedule set
[ ] DPO/legal team consulted
[ ] Privacy notice updated with rights information
[ ] Contact information for requests published

================================================================================
END OF GUIDE
================================================================================
`;

                const blob = new Blob([guide], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Data-Subject-Rights-Implementation-Guide-${new Date().toISOString().split('T')[0]}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download Data Subject Rights Implementation Guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Ready to Implement GDPR Compliance?</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
            Use our tools to assess your privacy program and map GDPR requirements to NIST Privacy Framework controls
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/assessments/privacy-assessment">
              <Button size="lg">
                Start Privacy Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/toolkit/gdpr-mapper">
              <Button size="lg" variant="outline">
                Use GDPR-NIST Mapper
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GdprGuide;