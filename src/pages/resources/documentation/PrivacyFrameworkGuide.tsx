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
  FileText,
  Settings
} from 'lucide-react';

const PrivacyFrameworkGuide = () => {
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
          <h1 className="text-4xl font-bold mb-4 text-foreground">NIST Privacy Framework Guide</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive guide to implementing the NIST Privacy Framework for organizational privacy risk management
          </p>
        </div>

        {/* Framework Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Understanding the NIST Privacy Framework</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="h-6 w-6 text-primary mr-2" />
                  What is the NIST Privacy Framework?
                </h3>
                <p className="text-muted-foreground mb-4">
                  The NIST Privacy Framework is a voluntary tool designed to help organizations identify, assess, manage, and communicate privacy risks. It provides a common language for privacy risk management and helps organizations align their privacy practices with business objectives.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Voluntary, flexible, and adaptable
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Risk-based approach to privacy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Complements existing privacy laws
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Globe className="h-6 w-6 text-primary mr-2" />
                  Core Functions
                </h3>
                <p className="text-muted-foreground mb-4">
                  The Framework is organized around five core functions that provide a high-level view of privacy risk management activities.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <span className="font-medium">Identify-P (ID.P)</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <span className="font-medium">Govern-P (GV.P)</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <span className="font-medium">Control-P (CT.P)</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <span className="font-medium">Communicate-P (CM.P)</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <span className="font-medium">Protect-P (PR.P)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Implementation Tiers */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Implementation Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Settings className="h-6 w-6 text-primary mr-2" />
                  Tier 1: Partial
                </h3>
                <p className="text-muted-foreground mb-4">
                  Risk management practices are not formalized and risk is managed in an ad hoc manner.
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Limited awareness of privacy risks</li>
                  <li>• Ad hoc privacy practices</li>
                  <li>• Limited organizational privacy risk management</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="h-6 w-6 text-primary mr-2" />
                  Tier 2: Risk Informed
                </h3>
                <p className="text-muted-foreground mb-4">
                  Risk management practices are approved by management but may not be established as organizational-wide policy.
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Awareness of privacy risks</li>
                  <li>• Documented privacy practices</li>
                  <li>• Risk-informed decision making</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-primary mr-2" />
                  Tier 3: Repeatable
                </h3>
                <p className="text-muted-foreground mb-4">
                  Risk management practices are formally approved and expressed as policy and organizational procedures.
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Formal privacy risk management</li>
                  <li>• Organizational-wide policies</li>
                  <li>• Consistent implementation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Core Functions Detail */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Core Functions Explained</h2>
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Search className="h-6 w-6 text-primary mr-2" />
                  Identify-P (ID.P): Develop organizational understanding
                </h3>
                <p className="text-muted-foreground mb-4">
                  Develop the organizational understanding to manage privacy risk for systems, people, assets, data, and capabilities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Activities:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Inventory data processing activities</li>
                      <li>• Identify privacy risks</li>
                      <li>• Map data flows</li>
                      <li>• Assess current privacy posture</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Outcomes:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Clear understanding of data processing</li>
                      <li>• Identified privacy risks</li>
                      <li>• Baseline privacy assessment</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <UserCheck className="h-6 w-6 text-primary mr-2" />
                  Govern-P (GV.P): Establish privacy governance
                </h3>
                <p className="text-muted-foreground mb-4">
                  Establish organizational privacy governance and risk management policies and procedures.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Activities:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Establish privacy policies</li>
                      <li>• Define roles and responsibilities</li>
                      <li>• Create governance structure</li>
                      <li>• Set privacy objectives</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Outcomes:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Clear privacy governance</li>
                      <li>• Defined accountability</li>
                      <li>• Organizational commitment</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Lock className="h-6 w-6 text-primary mr-2" />
                  Control-P (CT.P): Implement privacy controls
                </h3>
                <p className="text-muted-foreground mb-4">
                  Implement appropriate privacy controls to manage privacy risks.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Activities:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Implement technical controls</li>
                      <li>• Establish administrative controls</li>
                      <li>• Create physical controls</li>
                      <li>• Monitor control effectiveness</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Outcomes:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Effective privacy controls</li>
                      <li>• Risk mitigation</li>
                      <li>• Compliance assurance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Eye className="h-6 w-6 text-primary mr-2" />
                  Communicate-P (CM.P): Enable privacy communication
                </h3>
                <p className="text-muted-foreground mb-4">
                  Enable privacy communication and transparency to stakeholders.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Activities:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Create privacy notices</li>
                      <li>• Establish communication channels</li>
                      <li>• Provide privacy training</li>
                      <li>• Enable data subject rights</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Outcomes:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Transparent privacy practices</li>
                      <li>• Informed stakeholders</li>
                      <li>• Trust and confidence</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Fingerprint className="h-6 w-6 text-primary mr-2" />
                  Protect-P (PR.P): Implement privacy protection
                </h3>
                <p className="text-muted-foreground mb-4">
                  Implement privacy protection measures to safeguard personal information.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Activities:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Data encryption</li>
                      <li>• Access controls</li>
                      <li>• Data minimization</li>
                      <li>• Security monitoring</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Outcomes:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Protected personal data</li>
                      <li>• Reduced privacy risks</li>
                      <li>• Enhanced security</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Implementation Steps */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Implementation Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold mb-2">Assess Current State</h3>
                <p className="text-sm text-muted-foreground">
                  Evaluate your current privacy practices and identify gaps
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold mb-2">Set Target Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Define your desired privacy risk management outcomes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold mb-2">Implement Controls</h3>
                <p className="text-sm text-muted-foreground">
                  Deploy privacy controls to address identified gaps
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">4</span>
                </div>
                <h3 className="font-semibold mb-2">Monitor & Improve</h3>
                <p className="text-sm text-muted-foreground">
                  Continuously monitor and improve your privacy program
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-foreground">Benefits of Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="h-6 w-6 text-primary mr-2" />
                  Risk Management
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Proactive privacy risk identification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Structured approach to risk assessment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Consistent risk management practices
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Globe className="h-6 w-6 text-primary mr-2" />
                  Compliance & Trust
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Enhanced regulatory compliance
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Improved stakeholder trust
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Competitive advantage
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Ready to Implement?</h2>
              <p className="text-muted-foreground mb-6">
                Use our tools to assess your privacy program and implement the NIST Privacy Framework
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/tools-and-assessments/privacy-assessment')}
                  className="flex items-center"
                >
                  Start Privacy Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/tools-and-assessments/gdpr-mapper')}
                  className="flex items-center"
                >
                  GDPR Mapper Tool
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyFrameworkGuide;
