import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { 
  Scale, 
  CheckCircle, 
  FileText, 
  Clock, 
  BookOpen
} from 'lucide-react';

const LegalCounselJourney = () => {
  const journeySteps = [
    {
      phase: 'Legal Review',
      title: 'Privacy Legal Assessment',
      description: 'Review current privacy practices against legal requirements',
      duration: '1-2 weeks',
      tools: [
        { name: 'Legal Compliance Review', path: '/toolkit/privacy-gap-analyzer', icon: Scale },
        { name: 'Regulatory Mapping', path: '/documentation/privacy-framework-guide', icon: Globe }
      ],
      outcomes: [
        'Legal risk assessment',
        'Regulatory gap analysis', 
        'Jurisdiction-specific requirements',
        'Legal basis validation'
      ]
    },
    {
      phase: 'Policy Development',
      title: 'Privacy Legal Framework',
      description: 'Develop legally compliant privacy policies and procedures',
      duration: '3-4 weeks',
      tools: [
        { name: 'Privacy Policy Generator', path: '/toolkit/privacy-policy-generator', icon: FileText },
        { name: 'Legal Template Library', path: '/toolkit/resources/viewers/ccpa-policy', icon: BookOpen }
      ],
      outcomes: [
        'Comprehensive privacy policies',
        'Legal procedures documentation',
        'Multi-jurisdiction compliance',
        'Contract template updates'
      ]
    },
    {
      phase: 'Implementation Support',
      title: 'Legal Implementation Guidance',
      description: 'Provide legal guidance during privacy program implementation',
      duration: '4-6 weeks',
      tools: [
        { name: 'DPIA Legal Review', path: '/toolkit/dpia-generator', icon: Shield },
        { name: 'Evidence Review', path: '/project/evidence', icon: Database }
      ],
      outcomes: [
        'Legal implementation guidance',
        'Risk mitigation strategies',
        'Vendor contract reviews',
        'Training material validation'
      ]
    },
    {
      phase: 'Compliance Monitoring',
      title: 'Ongoing Legal Oversight',
      description: 'Monitor legal compliance and respond to regulatory changes',
      duration: 'Ongoing',
      tools: [
        { name: 'Compliance Dashboard', path: '/project', icon: Activity },
        { name: 'Legal Documentation', path: '/project/evidence', icon: FileText }
      ],
      outcomes: [
        'Regulatory change monitoring',
        'Legal compliance validation',
        'Incident response support',
        'Audit preparation assistance'
      ]
    }
  ];

  const legalCapabilities = [
    {
      icon: Scale,
      title: 'Multi-Jurisdiction Compliance',
      description: 'Navigate complex privacy laws across multiple jurisdictions',
      features: ['Regulatory analysis', 'Jurisdiction mapping', 'Legal basis assessment', 'Cross-border transfers']
    },
    {
      icon: FileText,
      title: 'Policy and Contract Review',
      description: 'Review and develop privacy-compliant policies and contracts',
      features: ['Privacy policy drafting', 'Contract privacy clauses', 'Vendor agreements', 'Data processing agreements']
    },
    {
      icon: Shield,
      title: 'Risk Assessment and Mitigation',
      description: 'Assess legal risks and develop mitigation strategies',
      features: ['Legal risk analysis', 'Mitigation planning', 'Regulatory strategy', 'Compliance validation']
    },
    {
      icon: AlertTriangle,
      title: 'Incident and Breach Response',
      description: 'Provide legal guidance during privacy incidents',
      features: ['Breach notification guidance', 'Regulatory reporting', 'Legal investigation support', 'Damage assessment']
    }
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 bg-grid opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-8">
            <Breadcrumbs />
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="bg-purple-100 text-purple-700 dark:bg-dark-primary/10 dark:text-dark-primary px-4 py-2 rounded-full inline-flex items-center text-sm font-medium">
                <Scale className="w-4 h-4 mr-2" />
                Legal Counsel Journey
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground dark:text-dark-text">
              Privacy <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Legal</span> Excellence
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Navigate complex privacy laws with comprehensive legal tools and frameworks
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/toolkit/privacy-gap-analyzer">
                <Button size="lg" className="enhanced-button bg-purple-600 hover:bg-purple-700">
                  Legal Compliance Review
                  <Scale className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/toolkit/privacy-policy-generator">
                <Button size="lg" variant="outline" className="hover:-translate-y-1 transition-transform">
                  Policy Generator
                  <FileText className="ml-2 h-5 w-5" />
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
                Your Legal Privacy Journey
              </h2>
              <p className="text-xl text-muted-foreground">
                Four phases to comprehensive privacy legal compliance
              </p>
            </div>

            <div className="space-y-12">
              {journeySteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="lg:w-1/3">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mr-3 font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm text-purple-600 font-medium">{step.phase}</span>
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
                                  <tool.icon className="w-5 h-5 text-purple-600 mr-3" />
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

      {/* Legal Capabilities */}
      <section className="py-20 bg-gray-50 dark:bg-dark-support/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
                Legal Counsel Capabilities
              </h2>
              <p className="text-xl text-muted-foreground">
                Specialized tools for privacy legal professionals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {legalCapabilities.map((capability, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                      <capability.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-dark-primary dark:to-dark-primary">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Navigate Privacy Law?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Use our legal tools to ensure comprehensive privacy compliance across jurisdictions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/toolkit/privacy-gap-analyzer" className="no-underline">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 border-2 border-white font-semibold shadow-lg">
                  Legal Compliance Review
                  <Scale className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/documentation/privacy-framework-guide" className="no-underline">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900 font-semibold shadow-lg">
                  Legal Resources
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