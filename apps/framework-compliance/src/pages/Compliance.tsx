import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Shield,
  Eye,
  Scale,
  Database,
  UserCheck,
  ArrowRight,
  CheckCircle,
  Target,
  FileText,
  Lock
} from 'lucide-react';

const Compliance = () => {
  const roleJourneys = [
    {
      title: 'Data Protection Officer',
      description: 'Lead organizational privacy initiatives and ensure regulatory compliance across global operations',
      icon: Eye,
      path: '/roles/data-protection-officer',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Privacy program leadership',
        'DPIA oversight',
        'Data subject rights management',
        'Regulatory liaison'
      ]
    },
    {
      title: 'Legal Counsel',
      description: 'Navigate complex privacy regulations and ensure legal compliance across jurisdictions',
      icon: Scale,
      path: '/roles/legal-counsel',
      color: 'from-purple-500 to-pink-500',
      features: [
        'Regulatory interpretation',
        'Contract review',
        'Legal risk assessment',
        'Compliance advisory'
      ]
    },
    {
      title: 'Data Steward',
      description: 'Manage data quality, governance, and ensure proper handling of organizational data assets',
      icon: Database,
      path: '/roles/data-steward',
      color: 'from-green-500 to-emerald-500',
      features: [
        'Data quality management',
        'Data classification',
        'Processing oversight',
        'Record maintenance'
      ]
    },
    {
      title: 'Privacy Officer',
      description: 'Implement and maintain privacy controls to protect personal information across the organization',
      icon: UserCheck,
      path: '/roles/privacy-officer',
      color: 'from-orange-500 to-amber-500',
      features: [
        'Privacy policy implementation',
        'Training coordination',
        'Incident response',
        'Vendor assessment'
      ]
    }
  ];

  const complianceFrameworks = [
    { name: 'GDPR', description: 'EU General Data Protection Regulation', region: 'Europe' },
    { name: 'CCPA/CPRA', description: 'California Consumer Privacy Act', region: 'USA' },
    { name: 'LGPD', description: 'Lei Geral de Proteção de Dados', region: 'Brazil' },
    { name: 'PIPEDA', description: 'Personal Information Protection and Electronic Documents Act', region: 'Canada' },
    { name: 'POPIA', description: 'Protection of Personal Information Act', region: 'South Africa' },
    { name: 'PDPA', description: 'Personal Data Protection Act', region: 'Singapore' }
  ];

  const quickStartTools = [
    { name: 'Privacy Assessment', path: '/assessments/privacy-assessment', icon: Eye, description: 'Evaluate your compliance posture' },
    { name: 'GDPR Mapper', path: '/toolkit/gdpr-mapper', icon: Database, description: 'Map your data processing activities' },
    { name: 'DPIA Generator', path: '/toolkit/dpia-generator', icon: FileText, description: 'Create impact assessments' },
    { name: 'Policy Generator', path: '/toolkit/privacy-policy-generator', icon: Shield, description: 'Generate compliant policies' }
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
                <Shield className="w-4 h-4 mr-2" />
                Privacy Compliance Hub
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground dark:text-dark-text">
              Role-Based <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">Compliance</span> Journeys
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Tailored compliance pathways for every privacy professional in your organization
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessments/privacy-assessment">
                <Button size="lg" variant="default" className="enhanced-button">
                  Start Assessment
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/toolkit">
                <Button size="lg" variant="outline" className="hover:-translate-y-1 transition-transform">
                  Explore Toolkit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role Journeys */}
      <section className="py-20 bg-white dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
                Choose Your Compliance Journey
              </h2>
              <p className="text-xl text-muted-foreground">
                Select your role to access tailored tools, workflows, and resources
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {roleJourneys.map((role, index) => (
                <Link key={index} to={role.path} className="block group">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <role.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-foreground dark:text-dark-text group-hover:text-primary transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{role.description}</p>
                      <div className="space-y-2">
                        {role.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                        Start Journey <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Tools */}
      <section className="py-20 bg-gray-50 dark:bg-dark-support/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
                Quick Start Tools
              </h2>
              <p className="text-xl text-muted-foreground">
                Jump straight into our most-used compliance tools
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStartTools.map((tool, index) => (
                <Link key={index} to={tool.path} className="block">
                  <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <tool.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1 text-foreground">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Supported Frameworks */}
      <section className="py-20 bg-white dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
                Global Privacy Frameworks
              </h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive coverage across major privacy regulations worldwide
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {complianceFrameworks.map((framework, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground">{framework.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{framework.region}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary dark:from-dark-primary dark:to-dark-primary">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Compliance Journey?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Begin with our comprehensive privacy assessment to understand your current compliance posture
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessments/privacy-assessment" className="no-underline">
                <Button variant="outline" className="bg-white text-primary hover:bg-gray-100 border-2 border-white shadow-lg">
                  Start Privacy Assessment
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/demo" className="no-underline">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900 shadow-lg">
                  View Demo
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

export default Compliance;

