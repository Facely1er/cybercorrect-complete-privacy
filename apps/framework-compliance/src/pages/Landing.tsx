import { Link } from 'react-router-dom';
import { useChatbot } from '../components/chat/ChatbotProvider';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { HeroHeadingCarousel } from '../components/ui/HeroHeadingCarousel';
import { InternalLink } from '../components/ui/InternalLinkingHelper';
import FloatingPrivacyIcons from '../components/ui/FloatingPrivacyIcons';
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

  // Hero heading carousel items
  const heroHeadings = [
    // Heading 1: Current privacy compliance focus
    <h1 key="heading-1" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground dark:text-dark-text">
      <span className="text-foreground dark:text-dark-text">Stop Losing Sleep</span>
      <br className="hidden sm:block" />
      <span className="text-foreground dark:text-dark-text">Over </span>
      <span className="text-primary dark:text-dark-primary">Privacy Compliance</span>
    </h1>,
    // Heading 2: Automated solution focus
    <h1 key="heading-2" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground dark:text-dark-text">
      <span className="text-foreground dark:text-dark-text">Automate Your </span>
      <span className="text-primary dark:text-dark-primary">Privacy</span>
      <br className="hidden sm:block" />
      <span className="text-primary dark:text-dark-primary">by Design</span>
    </h1>
  ];





  const handleGuideMe = () => {
    openChatbot();
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 bg-grid opacity-30 dark:opacity-20"></div>
        <FloatingPrivacyIcons />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge with Shield Icon */}
            <div className="inline-block mb-6">
              <span className="bg-primary/10 text-primary dark:bg-dark-primary/10 dark:text-dark-primary border border-primary/20 dark:border-dark-primary/20 text-sm px-4 py-2 rounded-full inline-flex items-center">
                <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
                Avoid Fines. Build Trust. Stay Compliant.
              </span>
            </div>
            
            {/* Main Headline - Carousel with 2 headings */}
            <HeroHeadingCarousel 
              headings={heroHeadings}
              interval={5000}
              className="min-h-[120px] sm:min-h-[140px] md:min-h-[160px] flex items-center justify-center"
            />
            
            {/* Supporting Paragraph */}
            <p className="text-xl text-muted-foreground dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Regulatory fines can reach millions. Data breaches destroy trust. Manual compliance processes drain resources. 
              Get automated privacy compliance that protects your business, reduces risk, and saves your team hundreds of hours.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link 
                to="/assessments/privacy-assessment"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                <Eye className="mr-2 h-5 w-5" />
                Start Free Privacy Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-background dark:bg-dark-surface border-2 border-primary text-primary rounded-lg text-lg font-semibold hover:bg-primary/5 transition-all"
              >
                <Shield className="mr-2 h-5 w-5" />
                Log In
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            {/* Choose Your Role Section */}
            <div className="mt-12 text-center">
              <p className="text-lg text-white/90 dark:text-foreground mb-6 font-medium">New to Privacy Compliance? Choose Your Role</p>
              <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
                <Link to="/roles/data-protection-officer" className="no-underline">
                  <Button 
                    variant="outline"
                    className="glass-effect text-white dark:text-foreground hover:bg-white/30 dark:hover:bg-primary/20 transition-all duration-300 border-white/30 dark:border-primary/30"
                    aria-label="Data Protection Officer Journey"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Data Protection Officer
                  </Button>
                </Link>
                <Link to="/roles/privacy-officer" className="no-underline">
                  <Button 
                    variant="outline"
                    className="glass-effect text-white dark:text-foreground hover:bg-white/30 dark:hover:bg-primary/20 transition-all duration-300 border-white/30 dark:border-primary/30"
                    aria-label="Privacy Officer Journey"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Officer
                  </Button>
                </Link>
                <Link to="/roles/legal-counsel" className="no-underline">
                  <Button 
                    variant="outline"
                    className="glass-effect text-white dark:text-foreground hover:bg-white/30 dark:hover:bg-primary/20 transition-all duration-300 border-white/30 dark:border-primary/30"
                    aria-label="Legal Counsel Journey"
                  >
                    <Scale className="h-4 w-4 mr-2" />
                    Legal Counsel
                  </Button>
                </Link>
                <Link to="/roles/data-steward" className="no-underline">
                  <Button 
                    variant="outline"
                    className="glass-effect text-white dark:text-foreground hover:bg-white/30 dark:hover:bg-primary/20 transition-all duration-300 border-white/30 dark:border-primary/30"
                    aria-label="Data Steward Journey"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Data Steward
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="mt-12 text-center">
              <p className="text-lg text-white/90 dark:text-foreground mb-6 font-medium">Popular Resources</p>
              <div className="flex flex-wrap justify-center gap-4">
                <InternalLink 
                  href="/toolkit/gdpr-mapper" 
                  variant="button" 
                  className="glass-effect text-white dark:text-foreground hover:bg-white/30 dark:hover:bg-primary/20 transition-all duration-300"
                  aria-label="Data Mapping Tool"
                >
                  Data Mapping Tool
                </InternalLink>
                <InternalLink 
                  href="/toolkit/dpia-generator" 
                  variant="button" 
                  className="glass-effect text-white dark:text-foreground hover:bg-white/30 dark:hover:bg-primary/20 transition-all duration-300"
                  aria-label="DPIA Generator"
                >
                  DPIA Generator  
                </InternalLink>
                <InternalLink 
                  href="/documentation/gdpr-implementation-guide" 
                  variant="button" 
                  className="glass-effect text-white dark:text-foreground hover:bg-white/30 dark:hover:bg-primary/20 transition-all duration-300"
                  aria-label="GDPR Guide"
                >
                  GDPR Guide
                </InternalLink>
                <InternalLink 
                  href="/documentation/getting-started" 
                  variant="button" 
                  className="glass-effect text-white dark:text-foreground hover:bg-white/30 dark:hover:bg-primary/20 transition-all duration-300"
                  aria-label="Getting Started Guide"
                >
                  Getting Started
                </InternalLink>
                <InternalLink 
                  href="/pricing" 
                  variant="button" 
                  className="glass-effect text-white dark:text-foreground hover:bg-white/30 dark:hover:bg-primary/20 transition-all duration-300"
                  aria-label="View Pricing"
                >
                  View Pricing
                </InternalLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Focus Areas */}
      <section className="section-padding bg-background dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="section-title text-3xl md:text-4xl">
              Privacy Compliance Areas
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
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
                color: 'from-primary to-secondary',
                assessmentPath: '/assessments/privacy-assessment',
                stats: { value: '5 Regs', label: 'Multi-regulation support' }
              },
              {
                id: 'data-governance',
                title: 'Data Governance',
                subtitle: 'Enterprise Data Management & Protection',
                description: 'Complete data governance framework with data mapping, quality controls, and lifecycle management.',
                icon: Users,
                color: 'from-secondary to-accent',
                assessmentPath: '/toolkit/gdpr-mapper',
                stats: { value: 'Auto', label: 'Data subject rights automation' }
              },
              {
                id: 'security-framework',
                title: 'Security Framework',
                subtitle: 'Enterprise Security Risk Management',
                description: 'Implement the NIST Privacy Framework with structured governance, risk assessment, and continuous monitoring.',
                icon: Shield,
                color: 'from-success to-primary',
                assessmentPath: '/assessments/privacy-assessment',
                stats: { value: '5 Functions', label: 'Framework coverage' }
              }
            ].map((path) => (
              <Card key={path.id} className="card-hover-lift relative overflow-hidden group border border-border dark:border-dark-support">
                <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} aria-hidden="true"></div>
                <CardContent className="relative p-8 md:p-10">
                  <div className="flex items-start mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mr-4 shadow-lg flex-shrink-0`}>
                      <path.icon className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-foreground dark:text-dark-text mb-1">{path.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{path.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">{path.description}</p>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-muted/50 dark:bg-dark-support/30 rounded-lg border border-border/50 dark:border-dark-support/50">
                    <div className="flex-1">
                      <div className="text-base font-semibold text-foreground dark:text-dark-text mb-1">Key Outcome</div>
                      <div className="text-sm text-muted-foreground">Personalized Roadmap</div>
                    </div>
                    <div className="text-right sm:text-left">
                      <div className="text-xs text-muted-foreground mb-1">Key Stat:</div>
                      <div className="text-sm font-semibold text-foreground dark:text-dark-text">
                        {path.stats.value}
                      </div>
                      <div className="text-xs text-muted-foreground">{path.stats.label}</div>
                    </div>
                  </div>
                  
                  <Link to={path.assessmentPath} className="no-underline">
                    <Button 
                      variant="default"
                      size="lg"
                      className="w-full group-hover:shadow-xl transition-all duration-300"
                      aria-label={`Start ${path.title} Assessment`}
                    >
                      <span>Start {path.title} Assessment</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Management Benefits */}
      <section className="section-padding bg-muted/30 dark:bg-dark-support/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="section-title text-3xl md:text-4xl">
              Your Complete Privacy Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
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
              <Card key={index} className="card-hover text-center border border-border dark:border-dark-support">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <benefit.icon className="w-8 h-8 text-primary dark:text-dark-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground dark:text-dark-text">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Roles */}
      <section className="section-padding bg-background dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="section-title text-3xl md:text-4xl">
                Privacy Team Roles
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Specialized workflows for privacy professionals
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="card-hover text-center border border-border dark:border-dark-support">
                <CardContent className="p-8 md:p-10">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Eye className="w-8 h-8 text-primary dark:text-dark-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground dark:text-dark-text">Data Protection Officers</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Lead privacy programs, conduct DPIAs, manage compliance across global regulations, and oversee privacy governance.
                  </p>
                  <Link to="/roles/data-protection-officer" className="no-underline">
                    <Button variant="outline" size="lg" className="w-full" aria-label="View DPO Workflow">
                      DPO Workflow
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="card-hover text-center border border-border dark:border-dark-support">
                <CardContent className="p-8 md:p-10">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Shield className="w-8 h-8 text-primary dark:text-dark-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground dark:text-dark-text">Privacy Officers</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Develop and implement privacy strategies, coordinate cross-functional privacy initiatives, and ensure organizational compliance.
                  </p>
                  <Link to="/roles/privacy-officer" className="no-underline">
                    <Button variant="outline" size="lg" className="w-full" aria-label="View Privacy Officer Workflow">
                      Privacy Officer Workflow
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="card-hover text-center border border-border dark:border-dark-support">
                <CardContent className="p-8 md:p-10">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Scale className="w-8 h-8 text-primary dark:text-dark-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground dark:text-dark-text">Legal Counsel</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Review privacy policies, assess legal risks, and ensure regulatory compliance across jurisdictions.
                  </p>
                  <Link to="/roles/legal-counsel" className="no-underline">
                    <Button variant="outline" size="lg" className="w-full" aria-label="View Legal Workflow">
                      Legal Workflow
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="card-hover text-center border border-border dark:border-dark-support">
                <CardContent className="p-8 md:p-10">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Database className="w-8 h-8 text-primary dark:text-dark-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground dark:text-dark-text">Data Stewards</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Manage data inventories, processing records, and data quality while ensuring privacy controls are maintained.
                  </p>
                  <Link to="/roles/data-steward" className="no-underline">
                    <Button variant="outline" size="lg" className="w-full" aria-label="View Data Steward Workflow">
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
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary via-secondary to-accent dark:from-dark-primary dark:via-dark-primary dark:to-dark-primary">
        <div className="container mx-auto px-4">
          <div className="text-center text-primary-foreground max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your Privacy Journey Today
            </h2>
            <p className="text-lg text-white/95 dark:text-foreground mb-8 leading-relaxed">
              Complete a privacy assessment and get your personalized privacy roadmap with collaborative project management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-3xl mx-auto px-4">
              <Link to="/assessments/privacy-assessment" className="no-underline w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-background text-foreground hover:bg-background/90 border-2 border-background shadow-xl backdrop-blur-sm w-full sm:w-auto"
                  aria-label="Start Privacy Assessment"
                >
                  <span className="whitespace-normal">Start Privacy Assessment</span>
                  <Eye className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/project" className="no-underline w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-background text-foreground hover:bg-background/90 border-2 border-background shadow-xl backdrop-blur-sm w-full sm:w-auto"
                  aria-label="Start Privacy Project Manager"
                >
                  <span className="whitespace-normal">Privacy Project Manager</span>
                  <Target className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" aria-hidden="true" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="ghost"
                className="text-background border-2 border-background/30 hover:bg-background/20 hover:border-background shadow-lg backdrop-blur-sm w-full sm:w-auto"
                onClick={handleGuideMe}
                aria-label="Get Guided Help"
              >
                <span className="whitespace-normal">Get Guided Help</span>
                <Users className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;