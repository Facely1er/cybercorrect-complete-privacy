import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { 
  Eye, 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  FileText, 
  BarChart3, 
  Users, 
  Clock, 
  Target, 
  Database,
  Scale,
  Settings,
  BookOpen,
  Fingerprint,
  AlertTriangle,
  Download
} from 'lucide-react';

const PrivacyOfficerJourney = () => {
  const journeySteps = [
    {
      phase: 'Assessment',
      title: 'Privacy Compliance Assessment',
      description: 'Start with a comprehensive privacy assessment to understand your current posture',
      duration: '25 minutes',
      tools: [
        { name: 'Privacy Assessment', path: '/assessments/privacy-assessment', icon: Eye },
        { name: 'GDPR Mapper', path: '/toolkit/gdpr-mapper', icon: Scale }
      ],
      outcomes: [
        'Compliance score across GDPR, CCPA, LGPD',
        'Gap analysis with prioritized actions',
        'Risk assessment and impact evaluation',
        'Regulatory requirement mapping'
      ]
    },
    {
      phase: 'Dashboard',
      title: 'Privacy Compliance Dashboard',
      description: 'Monitor your privacy program with real-time insights and metrics',
      duration: 'Ongoing',
      tools: [
        { name: 'Privacy Dashboard', path: '/app/privacy-dashboard', icon: BarChart3 },
        { name: 'Data Subject Requests', path: '/app/dsr-management', icon: Users }
      ],
      outcomes: [
        'Real-time compliance monitoring',
        'Data subject request tracking',
        'Breach notification readiness',
        'Privacy risk heat maps'
      ]
    },
    {
      phase: 'Resources',
      title: 'Privacy Implementation Guides',
      description: 'Access comprehensive guides and templates for privacy compliance',
      duration: 'Reference',
      tools: [
        { name: 'GDPR Guide', path: '/documentation/gdpr-guide', icon: BookOpen },
        { name: 'Privacy Templates', path: '/toolkit/resources/viewers/dpia-template', icon: FileText }
      ],
      outcomes: [
        'Step-by-step implementation guides',
        'Legal requirement explanations',
        'Best practice recommendations',
        'Industry-specific guidance'
      ]
    },
    {
      phase: 'Toolkit',
      title: 'Privacy Automation Tools',
      description: 'Automate privacy processes with intelligent tools',
      duration: 'As needed',
      tools: [
        { name: 'DPIA Generator', path: '/toolkit/resources/viewers/dpia-template', icon: Shield },
        { name: 'Policy Generator', path: '/toolkit/policy-generator', icon: Settings }
      ],
      outcomes: [
        'Automated DPIA creation',
        'Privacy policy generation',
        'Data mapping automation',
        'Compliance documentation'
      ]
    }
  ];

  const keyCapabilities = [
    {
      icon: Eye,
      title: 'Data Subject Rights Management',
      description: 'Handle access, rectification, erasure, and portability requests efficiently',
      features: ['Request workflow automation', 'Identity verification', 'Response templates', 'Audit trails']
    },
    {
      icon: Shield,
      title: 'Privacy Impact Assessments',
      description: 'Conduct thorough DPIAs with guided workflows and risk scoring',
      features: ['Automated DPIA generation', 'Risk assessment scoring', 'Mitigation recommendations', 'Stakeholder collaboration']
    },
    {
      icon: Database,
      title: 'Data Processing Records',
      description: 'Maintain comprehensive records of all data processing activities',
      features: ['Processing activity mapping', 'Legal basis documentation', 'Data flow visualization', 'Retention scheduling']
    },
    {
      icon: AlertTriangle,
      title: 'Breach Notification',
      description: '72-hour breach notification readiness with automated workflows',
      features: ['Incident detection alerts', 'Risk assessment automation', 'Notification templates', 'Regulatory reporting']
    }
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 bg-grid opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-8">
            <Breadcrumbs />
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="bg-blue-100 text-blue-700 dark:bg-dark-primary/10 dark:text-dark-primary px-4 py-2 rounded-full inline-flex items-center text-sm font-medium">
                <Eye className="w-4 h-4 mr-2" />
                Privacy Officer Journey
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground dark:text-dark-text">
              Privacy <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">Compliance</span> Made Simple
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Your complete journey from privacy assessment to ongoing compliance management
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessments/privacy-assessment">
                <Button size="lg" className="enhanced-button bg-blue-600 hover:bg-blue-700">
                  Start Privacy Assessment
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/documentation/gdpr-guide">
                <Button size="lg" variant="outline" className="hover:-translate-y-1 transition-transform">
                  View GDPR Guide
                  <BookOpen className="ml-2 h-5 w-5" />
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
                Your Privacy Compliance Journey
              </h2>
              <p className="text-xl text-muted-foreground">
                Four phases to comprehensive privacy compliance
              </p>
            </div>

            <div className="space-y-12">
              {journeySteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="lg:w-1/3">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm text-blue-600 font-medium">{step.phase}</span>
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
                                  <tool.icon className="w-5 h-5 text-blue-600 mr-3" />
                                  <span className="font-medium">{tool.name}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                          
                          <h4 className="font-semibold mb-3">Key Outcomes</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {step.outcomes.map((outcome, outcomeIndex) => (
                              <div key={outcomeIndex} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
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

      {/* Key Capabilities */}
      <section className="py-20 bg-gray-50 dark:bg-dark-support/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
                Privacy Officer Capabilities
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to manage a comprehensive privacy program
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {keyCapabilities.map((capability, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                      <capability.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-dark-primary dark:to-dark-primary">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Privacy Journey?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Begin with our comprehensive privacy assessment and get your personalized roadmap
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessments/privacy-assessment" className="no-underline">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 border-2 border-white font-semibold shadow-lg">
                  Start Privacy Assessment
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/documentation/gdpr-guide" className="no-underline">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900 font-semibold shadow-lg">
                  Read Implementation Guide
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

export default PrivacyOfficerJourney;