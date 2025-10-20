import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { 
  Database, 
  CheckCircle, 
  FileText, 
  Clock,
  BarChart3
} from 'lucide-react';

const DataStewardJourney = () => {
  const journeySteps = [
    {
      phase: 'Data Discovery',
      title: 'Data Landscape Assessment',
      description: 'Discover and catalog personal data across the organization',
      duration: '2-3 weeks',
      tools: [
        { name: 'Data Discovery Tool', path: '/toolkit/gdpr-mapper', icon: Database },
        { name: 'Data Inventory', path: '/project/evidence', icon: FileText }
      ],
      outcomes: [
        'Comprehensive data inventory',
        'Data flow documentation',
        'System and database mapping',
        'Data category classification'
      ]
    },
    {
      phase: 'Data Documentation',
      title: 'Processing Records Management',
      description: 'Create and maintain Article 30 processing records',
      duration: '2-4 weeks',
      tools: [
        { name: 'Processing Records Template', path: '/toolkit/resources/viewers/data-processing-record', icon: FileText },
        { name: 'GDPR Mapper', path: '/toolkit/gdpr-mapper', icon: Database }
      ],
      outcomes: [
        'Article 30 compliant records',
        'Legal basis documentation',
        'Retention schedule creation',
        'Third-party processor mapping'
      ]
    },
    {
      phase: 'Data Quality Management',
      title: 'Data Quality and Governance',
      description: 'Implement data quality controls and governance processes',
      duration: '4-6 weeks',
      tools: [
        { name: 'Data Quality Dashboard', path: '/project', icon: BarChart3 },
        { name: 'Data Governance Framework', path: '/documentation/privacy-framework-guide', icon: Shield }
      ],
      outcomes: [
        'Data quality monitoring',
        'Data governance policies',
        'Data steward training program',
        'Quality metrics and KPIs'
      ]
    },
    {
      phase: 'Ongoing Management',
      title: 'Continuous Data Stewardship',
      description: 'Ongoing data management and privacy maintenance',
      duration: 'Ongoing',
      tools: [
        { name: 'Data Monitoring Dashboard', path: '/project', icon: Activity },
        { name: 'Evidence Management', path: '/project/evidence', icon: Database }
      ],
      outcomes: [
        'Continuous data monitoring',
        'Regular data audits',
        'Privacy control validation',
        'Data lifecycle management'
      ]
    }
  ];

  const stewardCapabilities = [
    {
      icon: Database,
      title: 'Data Lifecycle Management',
      description: 'Manage personal data throughout its entire lifecycle',
      features: ['Data collection oversight', 'Retention management', 'Secure deletion', 'Archive procedures']
    },
    {
      icon: Eye,
      title: 'Data Processing Oversight',
      description: 'Monitor and validate data processing activities',
      features: ['Processing activity monitoring', 'Purpose limitation validation', 'Data minimization enforcement', 'Quality assurance']
    },
    {
      icon: Lock,
      title: 'Data Security Coordination',
      description: 'Coordinate with IT teams on data security measures',
      features: ['Security requirement definition', 'Access control validation', 'Encryption oversight', 'Incident response']
    },
    {
      icon: FileText,
      title: 'Documentation and Reporting',
      description: 'Maintain comprehensive data documentation',
      features: ['Processing records maintenance', 'Data flow documentation', 'Impact assessments', 'Audit preparation']
    }
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-green-50 via-white to-teal-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 bg-grid opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-8">
            <Breadcrumbs />
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="bg-green-100 text-green-700 dark:bg-dark-primary/10 dark:text-dark-primary px-4 py-2 rounded-full inline-flex items-center text-sm font-medium">
                <Database className="w-4 h-4 mr-2" />
                Data Steward Journey
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground dark:text-dark-text">
              Data <span className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">Stewardship</span> Excellence
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Master data management for privacy compliance with comprehensive data stewardship tools
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/toolkit/gdpr-mapper">
                <Button size="lg" className="enhanced-button bg-green-600 hover:bg-green-700">
                  Start Data Mapping
                  <Database className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/project/evidence">
                <Button size="lg" variant="outline" className="hover:-translate-y-1 transition-transform">
                  Evidence Vault
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
                Your Data Stewardship Journey
              </h2>
              <p className="text-xl text-muted-foreground">
                Four phases to comprehensive data stewardship for privacy
              </p>
            </div>

            <div className="space-y-12">
              {journeySteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="lg:w-1/3">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center mr-3 font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm text-green-600 font-medium">{step.phase}</span>
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
                                  <tool.icon className="w-5 h-5 text-green-600 mr-3" />
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

      {/* Data Steward Capabilities */}
      <section className="py-20 bg-gray-50 dark:bg-dark-support/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
                Data Steward Capabilities
              </h2>
              <p className="text-xl text-muted-foreground">
                Essential tools for effective data stewardship in privacy programs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stewardCapabilities.map((capability, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounde-lg flex items-center justify-center mb-4">
                      <capability.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
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
      <section className="py-16 bg-gradient-to-r from-green-600 to-teal-600 dark:from-dark-primary dark:to-dark-primary">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Master Data Stewardship?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Start with data mapping and build comprehensive data stewardship for privacy compliance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/toolkit/gdpr-mapper" className="no-underline">
                <Button className="bg-white text-green-600 hover:bg-gray-100 border-2 border-white shadow-lg">
                  Start Data Mapping
                  <Database className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/project/evidence" className="no-underline">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900 shadow-lg">
                  Evidence Vault
                  <FileText className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataStewardJourney;