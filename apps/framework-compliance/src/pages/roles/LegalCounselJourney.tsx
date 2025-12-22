import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Scale, 
  CheckCircle, 
  FileText, 
  Clock, 
  BookOpen,
  Globe,
  Shield,
  Database,
  Activity,
  AlertTriangle,
  Building,
  Sparkles
} from 'lucide-react';

interface AssessmentCustomization {
  overallScore: number;
  weakAreas: string[];
  strongAreas: string[];
  priorityLevel: 'critical' | 'high' | 'moderate' | 'maintenance';
  customSteps: { phase: string; focus: string; priority: 'high' | 'medium' | 'low' }[];
}

const LegalCounselJourney = () => {
  const location = useLocation();
  const customization: AssessmentCustomization | null = location.state?.customization;
  const fromAssessment = location.state?.fromAssessment;
  const journeySteps = [
    {
      phase: 'Assessment',
      title: 'Privacy Compliance Gap Analysis',
      description: 'Use assessment tools to identify compliance gaps and requirements',
      duration: '1-2 weeks (tool usage)',
      tools: [
        { name: 'Privacy Gap Analyzer', path: '/toolkit/privacy-gap-analyzer', icon: Scale },
        { name: 'Privacy Framework Guide', path: '/documentation/privacy-framework-guide', icon: Globe }
      ],
      outcomes: [
        'Compliance gap identification (not legal advice)',
        'Regulatory requirement mapping',
        'Jurisdiction-specific requirement identification',
        'Legal basis documentation support'
      ]
    },
    {
      phase: 'Documentation',
      title: 'Privacy Policy Templates',
      description: 'Access templates and tools to support privacy policy development (legal review required)',
      duration: '3-4 weeks (includes legal review time)',
      tools: [
        { name: 'Privacy Policy Templates', path: '/toolkit/resources/viewers/ccpa-policy', icon: BookOpen },
        { name: 'DPIA Template', path: '/toolkit/resources/viewers/dpia-template', icon: FileText }
      ],
      outcomes: [
        'Access to privacy policy templates',
        'Documentation templates for compliance',
        'Multi-jurisdiction requirement references',
        'Template-based starting points (legal review required)'
      ]
    },
    {
      phase: 'Tool Usage',
      title: 'Compliance Tool Usage',
      description: 'Use compliance tools to support privacy program implementation (not legal services)',
      duration: '4-6 weeks (ongoing tool usage)',
      tools: [
        { name: 'DPIA Manager', path: '/toolkit/dpia-manager', icon: Shield },
        { name: 'Evidence Vault', path: '/project/evidence', icon: Database },
        { name: 'Vendor Risk Assessment', path: '/toolkit/vendor-risk-assessment', icon: Building },
        { name: 'Service Provider Manager', path: '/toolkit/service-provider-manager', icon: Building },
        { name: 'Incident Response Manager', path: '/toolkit/incident-response-manager', icon: AlertTriangle }
      ],
      outcomes: [
        'Tool-based compliance support',
        'Risk identification assistance',
        'Vendor assessment templates',
        'Documentation organization tools'
      ]
    },
    {
      phase: 'Dashboard',
      title: 'Compliance Status Dashboard',
      description: 'View compliance status and manage documentation',
      duration: 'Ongoing',
      tools: [
        { name: 'Compliance Dashboard', path: '/project', icon: Activity },
        { name: 'Evidence Vault', path: '/project/evidence', icon: FileText },
        { name: 'Retention Policy Generator', path: '/toolkit/retention-policy-generator', icon: FileText },
        { name: 'Incident Response Manager', path: '/toolkit/incident-response-manager', icon: AlertTriangle }
      ],
      outcomes: [
        'Compliance status visualization',
        'Documentation organization',
        'Incident documentation tools',
        'Template access for audit preparation'
      ]
    }
  ];

  const legalCapabilities = [
    {
      icon: Scale,
      title: 'Compliance Gap Analysis Tools',
      description: 'Tools to identify compliance gaps and regulatory requirements (not legal advice)',
      features: ['Regulatory requirement identification tools', 'Jurisdiction-specific requirement mapping', 'Legal basis documentation support', 'Cross-border transfer requirement references']
    },
    {
      icon: FileText,
      title: 'Privacy Policy Templates',
      description: 'Template-based starting points for privacy policies (legal review and customization required)',
      features: ['Privacy policy template access', 'Compliance checklist references', 'Vendor agreement template references', 'Data processing agreement template references']
    },
    {
      icon: Shield,
      title: 'Risk Assessment Tools',
      description: 'Tools to assist with privacy risk identification (not legal risk assessment)',
      features: ['Compliance gap identification', 'Regulatory requirement mapping', 'Risk prioritization tools', 'Gap analysis assistance']
    },
    {
      icon: AlertTriangle,
      title: 'Incident Documentation Tools',
      description: 'Tools to support incident documentation and notification planning (legal review required)',
      features: ['Breach notification template references', 'Regulatory notification requirement guides', 'Incident documentation tools', 'Compliance tracking assistance']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-accent/10 via-background to-secondary/10 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 bg-grid opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="bg-accent/10 text-accent dark:bg-dark-primary/10 dark:text-primary px-4 py-2 rounded-full inline-flex items-center text-sm font-medium">
                <Scale className="w-4 h-4 mr-2" />
                Legal Compliance Journey
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Your Legal <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">Compliance</span> Journey
            </h1>
            <p className="text-lg md:text-xl text-foreground/90 dark:text-foreground/80 mb-8">
              A structured path using compliance tools and templates to support privacy legal work (legal review required)
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/toolkit/privacy-gap-analyzer">
                <Button size="lg" variant="secondary" className="enhanced-button">
                  Privacy Gap Analyzer
                  <Scale className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/toolkit/resources/viewers/ccpa-policy">
                <Button size="lg" variant="outline" className="hover:-translate-y-1 transition-transform">
                  Privacy Templates
                  <FileText className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Assessment Banner */}
      {fromAssessment && customization && (
        <section className="py-8 bg-gradient-to-r from-accent/5 via-secondary/5 to-accent/5 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="border-2 border-accent/20 bg-white/80 dark:bg-background/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-secondary/10">
                      <Sparkles className="w-8 h-8 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg md:text-xl font-bold text-foreground">Your Personalized Legal Journey</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          customization.priorityLevel === 'critical' ? 'bg-destructive/10 text-destructive' :
                          customization.priorityLevel === 'high' ? 'bg-warning/10 text-warning' :
                          customization.priorityLevel === 'moderate' ? 'bg-accent/10 text-accent' :
                          'bg-success/10 text-success'
                        }`}>
                          {customization.priorityLevel === 'critical' ? 'Critical Priority' :
                           customization.priorityLevel === 'high' ? 'High Priority' :
                           customization.priorityLevel === 'moderate' ? 'Moderate Priority' : 'Maintenance Mode'}
                        </span>
                      </div>
                      <p className="text-foreground/80 dark:text-foreground/70 mb-4">
                        Based on your assessment score of <strong className="text-foreground">{customization.overallScore}%</strong>, 
                        we've customized your legal journey to focus on key compliance gaps.
                      </p>
                      
                      {customization.weakAreas.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-warning" />
                            Priority Focus Areas:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {customization.weakAreas.map((area, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-warning/10 text-warning text-sm rounded-full border border-warning/20"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {customization.strongAreas.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-success" />
                            Your Strengths:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {customization.strongAreas.map((area, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-success/10 text-success text-sm rounded-full border border-success/20"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Baseline Tasks Section */}
      <section className="py-16 bg-gray-50 bg-muted/5 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                Baseline Tasks for All Roles
              </h2>
              <p className="text-base md:text-lg text-foreground/80 dark:text-foreground/70 mb-8">
                These foundational tasks are common to all privacy professionals, regardless of role
              </p>
            </div>
            <Card className="bg-white dark:bg-background">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-2" />
                      Assessment & Analysis
                    </h3>
                    <ul className="space-y-2 text-sm text-foreground/80 dark:text-foreground/70">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Complete Privacy Assessment to understand current compliance posture</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Use Privacy Gap Analyzer to identify compliance gaps</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Review compliance scores across GDPR, CCPA, and other frameworks</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-2" />
                      Monitoring & Documentation
                    </h3>
                    <ul className="space-y-2 text-sm text-foreground/80 dark:text-foreground/70">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Monitor compliance status via Privacy Dashboard</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Maintain evidence documentation in Evidence Vault</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Use GDPR Mapper to understand data processing activities</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Journey Steps */}
      <section className="py-20 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Your Privacy Compliance Tools Journey
              </h2>
              <p className="text-lg md:text-xl text-foreground/90 dark:text-foreground/80 mb-4">
                {fromAssessment 
                  ? 'Steps prioritized based on your assessment results' 
                  : 'Four phases using compliance tools and templates'}
              </p>
              <p className="text-base text-foreground/80 dark:text-foreground/70 italic">
                As Legal Counsel, you use these tools to support legal review, contract analysis, and compliance documentation
              </p>
            </div>

            <div className="space-y-12">
              {journeySteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="lg:w-1/3">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center mr-3 font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm text-accent font-medium">{step.phase}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground">{step.title}</h3>
                      <p className="text-foreground/80 dark:text-foreground/70 mb-4">{step.description}</p>
                      <div className="flex items-center text-sm text-foreground/70 dark:text-foreground/60">
                        <Clock className="w-4 h-4 mr-1" />
                        {step.duration}
                      </div>
                    </div>
                    
                    <div className="lg:w-2/3">
                      <Card className="mb-4">
                        <CardContent className="p-6">
                          <h4 className="text-lg font-semibold mb-4 text-foreground">Tools & Resources</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {step.tools.map((tool, toolIndex) => (
                              <Link key={toolIndex} to={tool.path} className="block">
                                <div className="flex items-center p-3 bg-muted/30 dark:bg-muted/20 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors border border-border/50">
                                  <tool.icon className="w-5 h-5 text-primary dark:text-primary mr-3" />
                                  <span className="font-medium text-foreground">{tool.name}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                          
                          <h4 className="text-lg font-semibold mb-3 text-foreground">Key Outcomes</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {step.outcomes.map((outcome, outcomeIndex) => (
                              <div key={outcomeIndex} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-foreground/90 dark:text-foreground/80">{outcome}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {index < journeySteps.length - 1 && (
                    <div className="flex justify-center my-8">
                      <div className="w-0.5 h-8 bg-muted"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legal Capabilities */}
      <section className="py-20 bg-gray-50 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Legal Counsel Documentation Tools
              </h2>
              <p className="text-lg md:text-xl text-foreground/90 dark:text-foreground/80 mb-4">
                Tools to support legal compliance and contract documentation work
              </p>
              <p className="text-base text-foreground/80 dark:text-foreground/70 italic max-w-3xl mx-auto">
                While all roles use baseline assessment and dashboard tools, Legal Counsel uses these tools to support 
                legal interpretation, contract review, and regulatory compliance documentation (legal review required)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {legalCapabilities.map((capability, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent/10 dark:bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <capability.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{capability.title}</h3>
                    <p className="text-foreground/80 dark:text-foreground/70 mb-4">{capability.description}</p>
                    <ul className="space-y-2">
                      {capability.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                          <span className="text-foreground/90 dark:text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-primary dark:bg-dark-primary">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
              Ready to Navigate Privacy Law?
            </h2>
            <p className="text-base md:text-lg text-white/90 mb-6">
              Use compliance tools and templates to support privacy compliance work across jurisdictions (legal review required)
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/toolkit/privacy-gap-analyzer" className="no-underline">
                <Button className="bg-white text-primary hover:bg-gray-100 shadow-lg font-semibold">
                  Privacy Gap Analyzer
                  <Scale className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/documentation/privacy-framework-guide" className="no-underline">
                <Button variant="outline" className="bg-transparent text-white hover:bg-white/10 border-2 border-white shadow-lg font-semibold">
                  Compliance Resources
                  <BookOpen className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalCounselJourney;
