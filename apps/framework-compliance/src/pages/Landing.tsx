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
  FileCheck,
  CheckCircle,
  Clock,
  BarChart3,
} from 'lucide-react';

const Landing = () => {
  const { openChatbot } = useChatbot();

  // Hero heading carousel items - Universal messaging
  const heroHeadings = [
    // Heading 1: Universal value proposition
    <h1 key="heading-1" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground dark:text-dark-text">
      <span className="text-foreground dark:text-dark-text">Privacy Compliance</span>
      <br className="hidden sm:block" />
      <span className="text-primary dark:text-dark-primary">Made Manageable</span>
    </h1>,
    // Heading 2: Outcome-focused
    <h1 key="heading-2" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground dark:text-dark-text">
      <span className="text-foreground dark:text-dark-text">From Risk to </span>
      <span className="text-primary dark:text-dark-primary">Confidence</span>
      <br className="hidden sm:block" />
      <span className="text-foreground dark:text-dark-text">in </span>
      <span className="text-primary dark:text-dark-primary">30 Minutes</span>
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
                Trusted by Privacy Teams Worldwide
              </span>
            </div>
            
            {/* Main Headline - Carousel with 2 headings */}
            <HeroHeadingCarousel 
              headings={heroHeadings}
              interval={5000}
              className="min-h-[120px] sm:min-h-[140px] md:min-h-[160px] flex items-center justify-center"
            />
            
            {/* Supporting Paragraph - Universal messaging */}
            <p className="text-xl text-muted-foreground dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Whether you're assessing risk, building a program, or proving compliance to stakeholders—we help you get there faster with less complexity.
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
                aria-label="Talk to an Expert"
              >
                <Users className="mr-2 h-5 w-5" />
                Talk to an Expert
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

      {/* Privacy Focus Areas - Outcome Focused */}
      <section className="section-padding bg-background dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl md:text-4xl">
              Comprehensive Privacy Coverage
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              One platform to manage compliance across multiple frameworks and regulations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                id: 'regulatory-compliance',
                title: 'Regulatory Compliance',
                subtitle: 'GDPR, CCPA, PIPEDA & More',
                description: 'Stay compliant with global privacy regulations through automated assessments, gap analysis, and remediation guidance.',
                icon: Eye,
                color: 'from-primary to-secondary',
                path: '/assessments/privacy-assessment',
                cta: 'Assess Compliance',
                stats: { value: '5+', label: 'Regulations covered' }
              },
              {
                id: 'data-management',
                title: 'Data Management',
                subtitle: 'Mapping, Inventory & Governance',
                description: 'Understand where your data lives, how it flows, and ensure proper controls are in place throughout its lifecycle.',
                icon: Database,
                color: 'from-secondary to-accent',
                path: '/toolkit/gdpr-mapper',
                cta: 'Map Your Data',
                stats: { value: 'Auto', label: 'Data flow tracking' }
              },
              {
                id: 'risk-framework',
                title: 'Risk Framework',
                subtitle: 'NIST Privacy Framework Aligned',
                description: 'Implement structured privacy governance with risk assessment, continuous monitoring, and stakeholder reporting.',
                icon: Shield,
                color: 'from-success to-primary',
                path: '/assessments/privacy-assessment',
                cta: 'Evaluate Risk',
                stats: { value: '5', label: 'Framework functions' }
              }
            ].map((area) => (
              <Card key={area.id} className="card-hover-lift relative overflow-hidden group border border-border dark:border-dark-support">
                <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} aria-hidden="true"></div>
                <CardContent className="relative p-8">
                  <div className="flex items-start mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center mr-4 shadow-lg flex-shrink-0`}>
                      <area.icon className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-foreground dark:text-dark-text mb-1">{area.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{area.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed text-sm">{area.description}</p>
                  
                  <div className="flex items-center justify-between mb-6 p-3 bg-muted/50 dark:bg-dark-support/30 rounded-lg">
                    <div className="text-sm text-muted-foreground">{area.stats.label}</div>
                    <div className="text-lg font-bold text-primary dark:text-dark-primary">{area.stats.value}</div>
                  </div>
                  
                  <Link to={area.path} className="no-underline">
                    <Button 
                      variant="default"
                      className="w-full group-hover:shadow-xl transition-all duration-300"
                      aria-label={area.cta}
                    >
                      <span>{area.cta}</span>
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

      {/* Outcome-Based Entry Points */}
      <section className="section-padding bg-background dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl md:text-4xl">
              What Do You Need to Achieve?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Select your primary goal—we'll guide you to the right solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
          <div className="text-center mt-12">
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

      {/* How It Works - Universal journey */}
      <section className="section-padding bg-muted/30 dark:bg-dark-support/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl md:text-4xl">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              One simple process that adapts to your needs
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Assess',
                  description: 'Answer questions about your organization and current practices',
                  icon: Eye
                },
                {
                  step: '2',
                  title: 'Discover',
                  description: 'Get personalized insights, scores, and priority recommendations',
                  icon: Target
                },
                {
                  step: '3',
                  title: 'Act',
                  description: 'Use our toolkit to address gaps and build your program',
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

      {/* Final CTA - Universal */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary via-secondary to-accent dark:from-dark-primary dark:via-dark-primary dark:to-dark-primary">
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
                variant="ghost"
                className="text-background border-2 border-background/30 hover:bg-background/20 hover:border-background shadow-lg backdrop-blur-sm px-8"
                onClick={handleGuideMe}
                aria-label="Talk to an Expert"
              >
                <Users className="mr-2 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span>Talk to an Expert</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;