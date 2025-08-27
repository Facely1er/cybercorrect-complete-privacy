import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Shield,
  CheckCircle,
  ArrowLeft,
  FileText,
  AlertTriangle,
  Info,
  Link,
  Activity,
  Eye,
  FileCheck,
  Lock,
  Settings,
  Users,
  Layers
} from 'lucide-react';

const UnderstandingRmf = () => {
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
          <h1 className="text-4xl font-bold mb-4 text-foreground">Understanding the Risk Management Framework</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive guide to implementing NIST's Risk Management Framework (RMF)
          </p>
        </div>

        {/* RMF Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">The RMF Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="h-6 w-6 text-primary mr-2" />
                  What is the RMF?
                </h3>
                <p className="text-muted-foreground mb-4">
                  The Risk Management Framework (RMF) is a structured approach to managing organizational risk by 
                  integrating security, privacy, and cyber supply chain risk management activities into the system development lifecycle.
                </p>
                <p className="text-muted-foreground">
                  Developed by NIST, the RMF provides a disciplined, structured, and flexible process for managing 
                  security and privacy risk that includes information security categorization; control selection, 
                  implementation, and assessment; system and control authorization; and continuous monitoring.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Activity className="h-6 w-6 text-primary mr-2" />
                  Business Value
                </h3>
                <p className="text-muted-foreground mb-4">
                  Implementing the RMF offers significant benefits for organizations:
                </p>
                <ul className="text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Improved security posture through continuous monitoring</li>
                  <li>Structured approach to risk management</li>
                  <li>Enhanced decision-making with risk-based approach</li>
                  <li>Better compliance with federal regulations</li>
                  <li>Consistent security control implementation</li>
                  <li>Integration of privacy considerations</li>
                  <li>Focus on critical systems and information</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">The Seven Steps of the RMF</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10">
                        <Layers className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium mb-1">Step 0: Prepare</h4>
                      <p className="text-muted-foreground mb-2">
                        Essential activities to help prepare the organization to manage security and privacy risks.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Key Activities:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>Identify and document risk management roles</li>
                            <li>Identify stakeholders</li>
                            <li>Establish risk management strategy</li>
                            <li>Assess organizational risk tolerance</li>
                          </ul>
                        </div>
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Outputs:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>Risk management strategy</li>
                            <li>Risk assessment report</li>
                            <li>Organization structure for risk management</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10">
                        <FileText className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium mb-1">Step 1: Categorize</h4>
                      <p className="text-muted-foreground mb-2">
                        Categorize the system and the information processed, stored, and transmitted by the system based on an impact analysis.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Key Activities:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>Document information types</li>
                            <li>Select provisional impact values</li>
                            <li>Conduct impact analysis</li>
                            <li>Assign system security category</li>
                          </ul>
                        </div>
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Outputs:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>Security categorization</li>
                            <li>Impact level documentation</li>
                            <li>System description</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10">
                        <Settings className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium mb-1">Step 2: Select</h4>
                      <p className="text-muted-foreground mb-2">
                        Select an initial set of controls for the system and tailor as needed based on risk assessment.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Key Activities:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>Select security control baseline</li>
                            <li>Tailor controls based on risk</li>
                            <li>Document control selection rationale</li>
                            <li>Apply overlays as appropriate</li>
                          </ul>
                        </div>
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Outputs:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>Security controls baseline</li>
                            <li>Tailoring documentation</li>
                            <li>Control allocation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10">
                        <Lock className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium mb-1">Step 3: Implement</h4>
                      <p className="text-muted-foreground mb-2">
                        Implement the selected and tailored controls within the system and environment of operation.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Key Activities:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>Implement selected controls</li>
                            <li>Document the implementation</li>
                            <li>Develop security and privacy plans</li>
                          </ul>
                        </div>
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Outputs:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>System security plan (SSP)</li>
                            <li>Security architecture</li>
                            <li>Implementation details</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10">
                        <Eye className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium mb-1">Step 4: Assess</h4>
                      <p className="text-muted-foreground mb-2">
                        Assess whether controls are implemented correctly, operating as intended, and producing desired outcomes.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Key Activities:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>Develop assessment plan</li>
                            <li>Assess security controls</li>
                            <li>Update security documentation</li>
                            <li>Develop plan of action and milestones (POA&M)</li>
                          </ul>
                        </div>
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Outputs:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>Security assessment plan</li>
                            <li>Security assessment report</li>
                            <li>POA&M</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10">
                        <FileCheck className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium mb-1">Step 5: Authorize</h4>
                      <p className="text-muted-foreground mb-2">
                        Provide organizational accountability by requiring a senior management official to make a risk-based decision to authorize the system.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Key Activities:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>Compile authorization package</li>
                            <li>Determine risk to operations</li>
                            <li>Make risk determination</li>
                            <li>Determine if risk is acceptable</li>
                          </ul>
                        </div>
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Outputs:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>Authorization decision document</li>
                            <li>Authorization package</li>
                            <li>Risk acceptance documentation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10">
                        <Activity className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium mb-1">Step 6: Monitor</h4>
                      <p className="text-muted-foreground mb-2">
                        Continuously monitor control implementation and risks to the system.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Key Activities:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>Determine monitoring strategy</li>
                            <li>Implement continuous monitoring</li>
                            <li>Analyze data and report findings</li>
                            <li>Respond to assessment results</li>
                            <li>Review and update authorization status</li>
                          </ul>
                        </div>
                        <div className="bg-muted/30 p-3 rounded">
                          <span className="font-medium text-sm">Outputs:</span>
                          <ul className="text-sm mt-1 list-disc ml-4">
                            <li>Continuous monitoring strategy</li>
                            <li>Updated security status reports</li>
                            <li>Ongoing risk determination</li>
                            <li>Updated POA&M</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-muted/30 rounded-lg p-6 my-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Info className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">RMF Success Factors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium mb-2">Organizational Factors</h4>
                    <ul className="text-muted-foreground space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Strong executive leadership and support</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Effective communication among stakeholders</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Adequate resources for implementation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Clearly defined roles and responsibilities</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Implementation Factors</h4>
                    <ul className="text-muted-foreground space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Integration with enterprise architecture</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Integration with system development lifecycle</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Automation support for continuous monitoring</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Documentation of implementation decisions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RMF Implementation Strategy */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Implementation Strategy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Team Structure</h3>
                <p className="text-muted-foreground mb-4">
                  Establish a cross-functional team for RMF implementation:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Chief Information Security Officer (CISO)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>System Owner</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Authorizing Official (AO)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Information System Security Officer (ISSO)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Privacy Officer</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Key Documentation</h3>
                <p className="text-muted-foreground mb-4">
                  Develop and maintain the following essential documents:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>System Security Plan (SSP)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Plan of Action and Milestones (POA&M)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Security Assessment Report</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Risk Assessment Report</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Continuous Monitoring Strategy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground mb-2">Common Implementation Challenges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>Inadequate resource allocation</li>
                    <li>Lack of executive sponsorship</li>
                    <li>Insufficient documentation</li>
                    <li>Treating RMF as a "check-the-box" exercise</li>
                  </ul>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                    <li>Poor integration with development lifecycle</li>
                    <li>Ineffective continuous monitoring</li>
                    <li>Failure to perform regular assessments</li>
                    <li>Siloed implementation without cross-functional input</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-primary mr-2" />
                RMF Implementation Checklist
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">1</div>
                  <div>
                    <p className="font-medium">Establish RMF governance structure</p>
                    <p className="text-sm text-muted-foreground">Define roles, responsibilities, and reporting structure</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">2</div>
                  <div>
                    <p className="font-medium">Develop RMF implementation plan</p>
                    <p className="text-sm text-muted-foreground">Create timelines, resource allocation, and metrics for success</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">3</div>
                  <div>
                    <p className="font-medium">Conduct system categorization</p>
                    <p className="text-sm text-muted-foreground">Categorize systems based on FIPS 199/NIST SP 800-60</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">4</div>
                  <div>
                    <p className="font-medium">Select and tailor security controls</p>
                    <p className="text-sm text-muted-foreground">Choose appropriate controls based on system categorization</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">5</div>
                  <div>
                    <p className="font-medium">Document control implementation</p>
                    <p className="text-sm text-muted-foreground">Create comprehensive SSP and implementation details</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">6</div>
                  <div>
                    <p className="font-medium">Assess security controls</p>
                    <p className="text-sm text-muted-foreground">Verify effectiveness of implemented controls</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">7</div>
                  <div>
                    <p className="font-medium">Obtain system authorization</p>
                    <p className="text-sm text-muted-foreground">Prepare authorization package for AO review</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">8</div>
                  <div>
                    <p className="font-medium">Implement continuous monitoring</p>
                    <p className="text-sm text-muted-foreground">Establish ongoing monitoring program for security controls</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RMF Tools and Resources */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Tools and Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">NIST Publications</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-3 mb-4">
                  <li className="flex items-center">
                    <Link className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>NIST SP 800-37 (RMF Guide)</span>
                  </li>
                  <li className="flex items-center">
                    <Link className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>NIST SP 800-53 (Security Controls)</span>
                  </li>
                  <li className="flex items-center">
                    <Link className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>NIST SP 800-53A (Assessment Guide)</span>
                  </li>
                  <li className="flex items-center">
                    <Link className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>FIPS 199 (Standards for Security Categorization)</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  <Link className="mr-2 h-4 w-4" />
                  Access NIST Publications
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">RMF Templates</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-3 mb-4">
                  <li className="flex items-center">
                    <Link className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>System Security Plan (SSP) Template</span>
                  </li>
                  <li className="flex items-center">
                    <Link className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>Security Assessment Report Template</span>
                  </li>
                  <li className="flex items-center">
                    <Link className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>Risk Assessment Report Template</span>
                  </li>
                  <li className="flex items-center">
                    <Link className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>Plan of Action & Milestones (POA&M) Template</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Templates
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold ml-3">Automated Tools</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  CyberCorrect provides comprehensive tools to support RMF implementation:
                </p>
                <ul className="text-sm text-muted-foreground space-y-3 mb-4">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>RMF task tracking and management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>Automated control documentation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>Security assessment support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span>Continuous monitoring dashboard</span>
                  </li>
                </ul>
                <Button className="w-full">
                  Explore RMF Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Ready to Implement the RMF?</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
            Get started with our comprehensive RMF implementation tools and expertise
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Explore RMF Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Contact RMF Specialists
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderstandingRmf;