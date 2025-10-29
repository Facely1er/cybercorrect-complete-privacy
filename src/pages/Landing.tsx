import React from 'react';
import { Link } from 'react-router-dom';
import { useChatbot } from '../components/chat/ChatbotProvider';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import TextCarousel from '../components/ui/TextCarousel';
import { InternalLink } from '../components/ui/InternalLinkingHelper';
import { 
  ArrowRight, 
  Shield, 
  Eye,
  Database,
  Target,
  Users,
  Scale,
  FileCheck,
} from 'lucide-react';

const Landing = () => {

  const { openChatbot } = useChatbot();





  const handleGuideMe = () => {
    openChatbot();
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 bg-grid opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Platform Badge */}
            <div className="inline-block mb-8 animate-fade-in">
              <span className="hero-badge bg-primary/10 text-primary dark:bg-dark-primary/10 dark:text-dark-primary">
                <Eye className="w-4 h-4 mr-2" />
                Privacy Compliance Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground dark:text-dark-text">
              Privacy by <span className="bg-gradient-to-r from-primary to-accent dark:from-dark-primary dark:to-accent-cyan bg-clip-text text-transparent">Design</span>
            </h1>
            
            <div className="text-xl md:text-2xl text-muted-foreground dark:text-gray-400 mb-16 max-w-3xl mx-auto">
              <TextCarousel 
                items={[
                  "Global privacy compliance made simple: GDPR, CCPA, NIST Privacy Framework, and more. Collaborative project management for teams or streamlined workflows for solo users.",
                  "Transform your privacy program with intelligent assessments, automated DPIAs, and comprehensive project management tools.",
                  "From data mapping to breach notification - complete privacy compliance solutions with role-based collaboration and evidence management.",
                  "Streamline privacy documentation, automate compliance processes, and maintain audit-ready evidence across all privacy regulations."
                ]}
                interval={5000}
              />
            </div>

            {/* Quick CTA */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/assessments/privacy-assessment" className="no-underline">
                <Button 
                  size="xl"
                  className="w-full sm:w-auto"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Start Privacy Assessment
                </Button>
              </Link>
              <Link to="/project" className="no-underline">
                <Button 
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto bg-white dark:bg-dark-surface"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Start Privacy Project
                </Button>
              </Link>
            </div>
            
            {/* Quick Links Section */}
            <div className="mt-16 text-center">
              <p className="text-lg text-muted-foreground mb-6">Popular Resources</p>
              <div className="flex flex-wrap justify-center gap-4">
                <InternalLink href="/toolkit/gdpr-mapper" variant="button" className="glass-effect">
                  Data Mapping Tool
                </InternalLink>
                <InternalLink href="/toolkit/dpia-generator" variant="button" className="glass-effect">
                  DPIA Generator  
                </InternalLink>
                <InternalLink href="/documentation/gdpr-implementation-guide" variant="button" className="glass-effect">
                  GDPR Guide
                </InternalLink>
                <InternalLink href="/pricing" variant="button" className="glass-effect">
                  View Pricing
                </InternalLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Focus Areas */}
      <section className="section-padding bg-white dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">
              Privacy Compliance Areas
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive privacy management across global regulations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                id: 'privacy-compliance',
                title: 'GDPR Compliance',
                subtitle: 'European General Data Protection Regulation',
                description: 'Comprehensive privacy compliance program with automated DPIAs, consent management, and multi-regulation support.',
                icon: Eye,
                color: 'from-blue-600 to-indigo-600',
                assessmentPath: '/assessments/privacy-assessment',
                stats: { value: '5 Regs', label: 'Multi-regulation support' }
              },
              {
                id: 'data-governance',
                title: 'Data Governance',
                subtitle: 'Enterprise Data Management & Protection',
                description: 'Complete data governance framework with data mapping, quality controls, and lifecycle management.',
                icon: Users,
                color: 'from-purple-600 to-pink-600',
                assessmentPath: '/toolkit/gdpr-mapper',
                stats: { value: 'Auto', label: 'Data subject rights automation' }
              },
              {
                id: 'security-framework',
                title: 'Security Framework',
                subtitle: 'Enterprise Security Risk Management',
                description: 'Implement the NIST Privacy Framework with structured governance, risk assessment, and continuous monitoring.',
                icon: Shield,
                color: 'from-green-600 to-teal-600',
                assessmentPath: '/assessments/privacy-assessment',
                stats: { value: '5 Functions', label: 'Framework coverage' }
              }
            ].map((path) => (
              <Card key={path.id} className="card-hover-lift relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <CardContent className="relative p-8">
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${path.color} flex items-center justify-center mr-4`}>
                      <path.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground dark:text-dark-text">{path.title}</h3>
                      <p className="text-muted-foreground">{path.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">{path.description}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 p-4 rounded-xl shadow-inner">
                      <div className="text-lg font-bold text-foreground dark:text-dark-text">Key Outcome</div>
                      <div className="text-sm text-muted-foreground">Personalized Roadmap</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Key Stat:</div>
                      <div className="text-sm font-medium text-foreground dark:text-dark-text">
                        {path.stats.value} {path.stats.label}
                      </div>
                    </div>
                  </div>
                  
                  <Link to={path.assessmentPath} className="no-underline">
                    <Button 
                      className="w-full"
                      size="lg"
                    >
                      Start {path.title} Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Management Benefits */}
      <section className="section-padding bg-muted/20 dark:bg-dark-support/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">
              Your Complete Privacy Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From privacy assessment to ongoing program management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Target,
                title: 'Privacy Assessment',
                description: 'Comprehensive privacy posture evaluation against global regulations and frameworks'
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Role-based project management with RACI matrices and collaborative workflows'
              },
              {
                icon: FileCheck,
                title: 'Evidence Management',
                description: 'Centralized evidence vault with audit-ready documentation and compliance tracking'
              },
              {
                icon: Shield,
                title: 'Continuous Monitoring',
                description: 'Ongoing privacy program monitoring with automated alerts and compliance dashboards'
              }
            ].map((benefit, index) => (
              <Card key={index} className="card-hover text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-primary dark:text-dark-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground dark:text-dark-text">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Roles */}
      <section className="section-padding bg-white dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title">
                Privacy Team Roles
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Specialized workflows for privacy professionals
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="card-hover text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-8 h-8 text-primary dark:text-dark-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground dark:text-dark-text">Data Protection Officers</h3>
                  <p className="text-muted-foreground mb-4">
                    Lead privacy programs, conduct DPIAs, manage compliance across global regulations, and oversee privacy governance.
                  </p>
                  <Link to="/roles/data-protection-officer" className="no-underline">
                    <Button variant="outline" className="w-full">
                      DPO Workflow
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="card-hover text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Scale className="w-8 h-8 text-primary dark:text-dark-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground dark:text-dark-text">Legal Counsel</h3>
                  <p className="text-muted-foreground mb-4">
                    Review privacy policies, assess legal risks, and ensure regulatory compliance across jurisdictions.
                  </p>
                  <Link to="/roles/legal-counsel" className="no-underline">
                    <Button variant="outline" className="w-full">
                      Legal Workflow
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="card-hover text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Database className="w-8 h-8 text-primary dark:text-dark-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground dark:text-dark-text">Data Stewards</h3>
                  <p className="text-muted-foreground mb-4">
                    Manage data inventories, processing records, and data quality while ensuring privacy controls are maintained.
                  </p>
                  <Link to="/roles/data-steward" className="no-underline">
                    <Button variant="outline" className="w-full">
                      Data Steward Workflow
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent dark:from-dark-primary dark:to-accent-cyan">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Start Your Privacy Journey Today
            </h2>
            <p className="text-lg md:text-xl text-white/95 mb-8">
              Complete a privacy assessment and get your personalized privacy roadmap with collaborative project management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessments/privacy-assessment" className="no-underline">
                <Button 
                  size="xl" 
                  className="w-full sm:w-auto bg-white text-primary hover:bg-gray-50 dark:bg-dark-surface dark:text-dark-primary dark:hover:bg-dark-bg"
                >
                  Start Privacy Assessment
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/project" className="no-underline">
                <Button 
                  size="xl" 
                  className="w-full sm:w-auto bg-white text-primary hover:bg-gray-50 dark:bg-dark-surface dark:text-dark-primary dark:hover:bg-dark-bg"
                >
                  Privacy Project Manager
                  <Target className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="xl" 
                className="w-full sm:w-auto bg-foreground text-white hover:bg-foreground/90 dark:bg-white dark:text-dark-bg dark:hover:bg-gray-100"
                onClick={handleGuideMe}
              >
                Get Guided Help
                <Users className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;