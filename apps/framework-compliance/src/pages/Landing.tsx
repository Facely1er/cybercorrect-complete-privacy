import { Link } from 'react-router-dom';
import { useChatbot } from '../components/chat/ChatbotProvider';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { HeroHeadingCarousel } from '../components/ui/HeroHeadingCarousel';
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
  CheckCircle,
  Clock,
  BarChart3,
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

            {/* Single Universal CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link 
                to="/assessments/privacy-assessment"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                <Eye className="mr-2 h-5 w-5" />
                See Where You Stand — Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Button 
                size="lg"
                variant="outline"
                className="px-8 py-4 bg-background dark:bg-dark-surface border-2 border-primary text-primary rounded-lg text-lg font-semibold hover:bg-primary/5 transition-all"
                onClick={handleGuideMe}
                aria-label="Contact Our Team"
              >
                <Users className="mr-2 h-5 w-5" />
                Contact Our Team
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-muted-foreground dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-primary dark:text-dark-primary mr-2 flex-shrink-0" />
                Results in 30 minutes
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-primary dark:text-dark-primary mr-2 flex-shrink-0" />
                NIST Privacy Framework aligned
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Moved up for better flow */}
      <section className="py-16 md:py-24 bg-muted/30 dark:bg-dark-support/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl md:text-4xl">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Four simple steps to privacy compliance
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Assess',
                  description: 'Answer questions about your organization and current privacy practices',
                  icon: Eye
                },
                {
                  step: '2',
                  title: 'Discover',
                  description: 'Get personalized insights, compliance scores, and priority recommendations',
                  icon: Target
                },
                {
                  step: '3',
                  title: 'Act',
                  description: 'Use our toolkit to address gaps and build your compliance program',
                  icon: FileCheck
                },
                {
                  step: '4',
                  title: 'Maintain',
                  description: 'Monitor progress and prove compliance to stakeholders',
                  icon: BarChart3
                }
              ].map((phase, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <phase.icon className="w-8 h-8 text-primary dark:text-dark-primary" aria-hidden="true" />
                  </div>
                  {index < 3 && (
                    <div className="absolute top-8 left-[60%] w-[80%] h-0.5 bg-primary/20 dark:bg-dark-primary/20 hidden md:block" aria-hidden="true" />
                  )}
                  <div className="text-xs font-semibold text-primary dark:text-dark-primary mb-1">Step {phase.step}</div>
                  <h3 className="text-lg font-bold mb-2 text-foreground dark:text-dark-text">{phase.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Outcome-Based Entry Points */}
      <section className="py-16 md:py-24 bg-background dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl md:text-4xl">
              What Do You Need to Achieve?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Select your primary goal—we'll guide you to the right solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Target,
                title: 'Understand My Risk',
                description: 'Get a clear picture of your current privacy compliance posture and exposure',
                outcomes: ['Compliance score', 'Risk assessment', 'Gap identification'],
                cta: 'Start Assessment',
                path: '/assessments/privacy-assessment',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Shield,
                title: 'Reduce My Exposure',
                description: 'Identify and address the most critical compliance gaps first',
                outcomes: ['Priority rankings', 'Action items', 'Quick wins'],
                cta: 'Analyze Gaps',
                path: '/toolkit/privacy-gap-analyzer',
                color: 'from-red-500 to-orange-500'
              },
              {
                icon: FileCheck,
                title: 'Build a Program',
                description: 'Create a structured privacy compliance program with clear milestones',
                outcomes: ['Implementation roadmap', 'Project templates', 'Team workflows'],
                cta: 'Create Roadmap',
                path: '/project',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: BarChart3,
                title: 'Prove Compliance',
                description: 'Generate audit-ready documentation and evidence for stakeholders',
                outcomes: ['Evidence vault', 'Compliance reports', 'Audit trails'],
                cta: 'View Reports',
                path: '/project/evidence',
                color: 'from-purple-500 to-pink-500'
              }
            ].map((goal, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden shadow-lg"
              >
                <div className={`h-2 bg-gradient-to-r ${goal.color}`} />
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <goal.icon className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground dark:text-dark-text">{goal.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{goal.description}</p>
                  <div className="space-y-1 mb-6">
                    {goal.outcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                        <span className="text-foreground dark:text-dark-text">{outcome}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={goal.path} className="no-underline">
                    <Button className="w-full group-hover:shadow-lg transition-all" aria-label={goal.cta}>
                      {goal.cta}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Universal CTA - No role selection required */}
          <div className="text-center mt-16 pt-8 border-t border-border/50 dark:border-dark-support/50">
            <p className="text-muted-foreground mb-4">Not sure where to start?</p>
            <Link to="/assessments/privacy-assessment" className="no-underline">
              <Button size="lg" variant="outline" className="px-8">
                <Eye className="mr-2 h-5 w-5" />
                Take the Free Assessment — We'll Guide You
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Privacy Team Roles */}
      <section className="py-16 md:py-24 bg-muted/30 dark:bg-dark-support/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title text-3xl md:text-4xl">
                Privacy Team Roles
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Specialized workflows for every privacy professional
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Eye,
                  title: 'Data Protection Officer',
                  description: 'Lead privacy programs, conduct DPIAs, and oversee compliance across global regulations.',
                  path: '/roles/data-protection-officer',
                  cta: 'DPO Journey'
                },
                {
                  icon: Shield,
                  title: 'Privacy Officer',
                  description: 'Develop privacy strategies, coordinate initiatives, and ensure organizational compliance.',
                  path: '/roles/privacy-officer',
                  cta: 'Privacy Officer Journey'
                },
                {
                  icon: Scale,
                  title: 'Legal Counsel',
                  description: 'Review policies, assess legal risks, and ensure regulatory compliance across jurisdictions.',
                  path: '/roles/legal-counsel',
                  cta: 'Legal Journey'
                },
                {
                  icon: Database,
                  title: 'Data Steward',
                  description: 'Manage data inventories, processing records, and maintain privacy controls.',
                  path: '/roles/data-steward',
                  cta: 'Data Steward Journey'
                }
              ].map((role, index) => (
                <Card key={index} className="card-hover text-center border border-border dark:border-dark-support">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <role.icon className="w-7 h-7 text-primary dark:text-dark-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-foreground dark:text-dark-text">{role.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{role.description}</p>
                    <Link to={role.path} className="no-underline">
                      <Button variant="outline" className="w-full" aria-label={role.cta}>
                        {role.cta}
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Portal Section */}
      <section className="py-16 md:py-20 bg-muted/30 dark:bg-dark-support/10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary dark:bg-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Users className="w-4 h-4" />
                Extend Your Compliance Program
              </div>
              <h2 className="section-title text-3xl md:text-4xl mb-4">
                Empower Your Entire Workforce
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                While CyberCorrect provides professional compliance tools, our <strong>Privacy Portal</strong> extends privacy rights and duties to all stakeholders
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Framework Compliance */}
              <Card className="border-2 border-primary/30 dark:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground dark:text-dark-text">Framework Compliance</h3>
                      <p className="text-xs text-muted-foreground">Professional Compliance Tools</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Expert tools for DPOs, legal counsel, and compliance professionals
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Privacy gap analysis & risk scoring',
                      'DPIA generation & GDPR mapping',
                      'Policy generation & compliance reports',
                      'Multi-framework assessments'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Privacy Portal */}
              <Card className="border-2 border-secondary/30 dark:border-secondary/20 bg-gradient-to-br from-secondary/5 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-secondary/10 dark:bg-secondary/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-secondary dark:text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground dark:text-dark-text">Privacy Portal</h3>
                      <p className="text-xs text-muted-foreground">Self-Service for All Stakeholders</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Democratize privacy compliance across your organization
                  </p>
                  <ul className="space-y-2 mb-6">
                    {[
                      'Data rights exercise (GDPR/CCPA/EEOC)',
                      'Role-based privacy duties tracking',
                      'Privacy incident reporting',
                      'Consent & preference management'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={import.meta.env.VITE_PRIVACY_PORTAL_URL || 'https://www.portal.cybercorrect.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full group border-2">
                      Access Privacy Portal
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-primary/80 dark:from-dark-primary dark:to-dark-primary">
        <div className="container mx-auto px-4">
          <div className="text-center text-primary-foreground max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/95 dark:text-foreground mb-8 leading-relaxed">
              Take our free assessment to see where you stand and get a personalized roadmap for your privacy compliance journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessments/privacy-assessment" className="no-underline">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-background text-foreground hover:bg-background/90 border-2 border-background shadow-xl backdrop-blur-sm px-8"
                  aria-label="See Where You Stand"
                >
                  <Eye className="mr-2 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>See Where You Stand — Free</span>
                  <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white text-primary border-2 border-white hover:bg-white/90 shadow-lg px-8"
                onClick={handleGuideMe}
                aria-label="Contact Our Team"
              >
                <Users className="mr-2 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span>Contact Our Team</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;