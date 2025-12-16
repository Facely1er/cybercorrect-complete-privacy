import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Eye, 
  CheckCircle, 
  Clock, 
  Target,
  BarChart3,
  Users,
  FileText,
  Shield,
  Database,
  Building,
  Sparkles,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface AssessmentCustomization {
  overallScore: number;
  weakAreas: string[];
  strongAreas: string[];
  priorityLevel: 'critical' | 'high' | 'moderate' | 'maintenance';
  customSteps: { phase: string; focus: string; priority: 'high' | 'medium' | 'low' }[];
}

const DataProtectionOfficerJourney = () => {
  const location = useLocation();
  const assessmentResults = location.state?.assessmentResults;
  const customization: AssessmentCustomization | null = location.state?.customization;
  const fromAssessment = location.state?.fromAssessment;
  const journeySteps = [
    {
      phase: 'Assessment',
      title: 'Privacy Program Assessment',
      description: 'Evaluate current privacy posture against global regulations',
      duration: '2-3 weeks',
      tools: [
        { name: 'Privacy Assessment', path: '/assessments/privacy-assessment', icon: Eye },
        { name: 'Privacy Gap Analyzer', path: '/toolkit/privacy-gap-analyzer', icon: BarChart3 }
      ],
      outcomes: [
        'Multi-regulation compliance scoring',
        'Privacy gap analysis with priorities',
        'Risk-based remediation roadmap',
        'Regulatory requirement mapping'
      ]
    },
    {
      phase: 'Planning',
      title: 'Privacy Program Planning',
      description: 'Develop comprehensive privacy implementation plan',
      duration: '2-3 weeks',
      tools: [
        { name: 'Privacy Roadmap', path: '/project/roadmap', icon: Target },
        { name: 'RACI Matrix', path: '/project/raci', icon: Users }
      ],
      outcomes: [
        'Privacy implementation roadmap',
        'Role-based responsibility matrix',
        'Resource allocation plan',
        'Implementation timeline'
      ]
    },
    {
      phase: 'Implementation',
      title: 'Privacy Controls Implementation',
      description: 'Deploy privacy controls and processes across the organization',
      duration: '8-12 weeks',
      tools: [
        { name: 'Privacy Policy Generator', path: '/toolkit/privacy-policy-generator', icon: FileText },
        { name: 'DPIA Manager', path: '/toolkit/dpia-manager', icon: Shield },
        { name: 'Data Mapping Tool', path: '/toolkit/gdpr-mapper', icon: Database },
        { name: 'Vendor Risk Assessment', path: '/toolkit/vendor-risk-assessment', icon: Building },
        { name: 'Service Provider Manager', path: '/toolkit/service-provider-manager', icon: Building }
      ],
      outcomes: [
        'Privacy governance framework',
        'Comprehensive privacy policies',
        'Data processing documentation',
        'Privacy training program'
      ]
    },
    {
      phase: 'Monitoring',
      title: 'Continuous Privacy Monitoring',
      description: 'Monitor privacy program effectiveness and maintain compliance',
      duration: 'Ongoing',
      tools: [
        { name: 'Evidence Vault', path: '/project/evidence', icon: Database },
        { name: 'Privacy Dashboard', path: '/project', icon: BarChart3 },
        { name: 'Service Provider Manager', path: '/toolkit/service-provider-manager', icon: Building },
        { name: 'Vendor Risk Assessment', path: '/toolkit/vendor-risk-assessment', icon: Building }
      ],
      outcomes: [
        'Real-time compliance monitoring',
        'Organized evidence management',
        'Regular privacy program reviews',
        'Continuous improvement process'
      ]
    }
  ];

  const dpoCapabilities = [
    {
      icon: Eye,
      title: 'Privacy Program Leadership',
      description: 'Lead organizational privacy initiatives and ensure regulatory compliance',
      features: ['Privacy strategy development', 'Regulatory monitoring', 'Executive reporting', 'Stakeholder engagement']
    },
    {
      icon: Shield,
      title: 'Data Protection Impact Assessments',
      description: 'Conduct and oversee DPIAs for high-risk processing activities',
      features: ['DPIA methodology', 'Risk assessment', 'Stakeholder consultation', 'Mitigation planning']
    },
    {
      icon: Users,
      title: 'Data Subject Rights Management',
      description: 'Oversee data subject rights fulfillment and complaint handling',
      features: ['Rights request processing', 'Identity verification', 'Response coordination', 'Escalation handling']
    },
    {
      icon: Database,
      title: 'Data Processing Oversight',
      description: 'Monitor data processing activities and maintain processing records',
      features: ['Processing activity monitoring', 'Article 30 records', 'Third-party assessments', 'Transfer oversight']
    }
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 bg-grid opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="bg-primary/10 text-primary dark:bg-dark-primary/10 dark:text-dark-primary px-4 py-2 rounded-full inline-flex items-center text-sm font-medium">
                <Eye className="w-4 h-4 mr-2" />
                Data Protection Officer Journey
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground dark:text-dark-text">
              Privacy <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">Leadership</span> Excellence
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Lead your organization's privacy program with comprehensive tools for global privacy compliance
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessments/privacy-assessment">
                <Button size="lg" variant="default" className="enhanced-button">
                  Start Privacy Assessment
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/project">
                <Button size="lg" variant="outline" className="hover:-translate-y-1 transition-transform">
                  Create Privacy Project
                  <Target className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Steps */}
      <section className="py-20 bg-white dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
                Your Privacy Leadership Journey
              </h2>
              <p className="text-xl text-muted-foreground">
                Four phases to comprehensive global privacy compliance
              </p>
            </div>

            <div className="space-y-12">
              {journeySteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="lg:w-1/3">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm text-primary font-medium">{step.phase}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-foreground">{step.title}</h3>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {step.duration}
                      </div>
                    </div>
                    
                    <div className="lg:w-2/3">
                      <Card className="mb-4">
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-4">Tools & Resources</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {step.tools.map((tool, toolIndex) => (
                              <Link key={toolIndex} to={tool.path} className="block">
                                <div className="flex items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                  <tool.icon className="w-5 h-5 text-primary mr-3" />
                                  <span className="font-medium">{tool.name}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                          
                          <h4 className="font-semibold mb-3">Key Outcomes</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {step.outcomes.map((outcome, outcomeIndex) => (
                              <div key={outcomeIndex} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{outcome}</span>
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

      {/* DPO Capabilities */}
      <section className="py-20 bg-gray-50 dark:bg-dark-support/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
                Data Protection Officer Capabilities
              </h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive tools for leading organizational privacy programs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dpoCapabilities.map((capability, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <capability.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{capability.title}</h3>
                    <p className="text-muted-foreground mb-4">{capability.description}</p>
                    <ul className="space-y-2">
                      {capability.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
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
      <section className="py-10 bg-gradient-to-r from-primary to-secondary dark:from-dark-primary dark:to-dark-primary">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Lead Your Privacy Program?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Start with our comprehensive privacy assessment and build your global compliance strategy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessments/privacy-assessment" className="no-underline">
                <Button variant="outline" className="bg-white text-primary hover:bg-gray-100 border-2 border-white shadow-lg">
                  Start Privacy Assessment
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/project" className="no-underline">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900 shadow-lg">
                  Create Privacy Project
                  <Target className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataProtectionOfficerJourney;