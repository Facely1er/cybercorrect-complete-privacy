import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useChatbot } from '../components/chat/ChatbotProvider';
import { useJourney } from '../context/JourneyContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { HeroHeadingCarousel } from '../components/ui/HeroHeadingCarousel';
import FloatingPrivacyIcons from '../components/ui/FloatingPrivacyIcons';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';
import JourneyProgressTracker from '../components/onboarding/JourneyProgressTracker';
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
  Sparkles,
  PlayCircle
} from 'lucide-react';

const Landing = () => {
  const { openChatbot } = useChatbot();
  const { hasVisitedBefore, currentStepIndex, completedSteps } = useJourney();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding for first-time users after a short delay
    if (!hasVisitedBefore) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasVisitedBefore]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  const handleOpenOnboarding = () => {
    setShowOnboarding(true);
  };

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
      {/* Onboarding Modal */}
      <OnboardingFlow 
        isVisible={showOnboarding} 
        onClose={handleCloseOnboarding}
        currentStep={0}
      />

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
              Discover your compliance gaps and get a clear, prioritized action plan that reduces risk and saves hundreds of hours.
            </p>

            {/* Primary CTA with Journey Guide */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link 
                to="/assessments/privacy-assessment"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl animate-pulse-slow"
              >
                <Eye className="mr-2 h-5 w-5" />
                Start Your Journey — Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 bg-background dark:bg-dark-surface border-2 border-primary text-primary rounded-lg text-lg font-semibold hover:bg-primary/5 transition-all"
                onClick={handleOpenOnboarding}
                aria-label="View Journey Guide"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                View Journey Guide
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

      {/* Clear Customer Journey Path */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header with Value Prop */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Clear Path to Compliance
              </div>
              <h2 className="section-title text-3xl md:text-4xl mb-4">
                Your Privacy Compliance Journey in 4 Clear Steps
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We've simplified the complex world of privacy compliance into a straightforward, guided journey
              </p>
            </div>

            {/* Visual Journey Map */}
            <div className="relative mb-12">
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  {
                    step: '1',
                    title: 'Assess',
                    description: 'Evaluate your current privacy posture across GDPR, CCPA, NIST, and more',
                    icon: Eye,
                    duration: '15-20 min',
                    color: 'from-blue-500 to-cyan-500',
                    action: 'Start Free Assessment',
                    path: '/assessments/privacy-assessment'
                  },
                  {
                    step: '2',
                    title: 'Discover',
                    description: 'Get your personalized compliance roadmap with prioritized actions',
                    icon: Target,
                    duration: 'Instant',
                    color: 'from-purple-500 to-pink-500',
                    action: 'View Your Journey',
                    path: '/compliance'
                  },
                  {
                    step: '3',
                    title: 'Act',
                    description: 'Use specialized tools to address gaps and build documentation',
                    icon: FileCheck,
                    duration: 'Ongoing',
                    color: 'from-green-500 to-emerald-500',
                    action: 'Explore Toolkit',
                    path: '/toolkit'
                  },
                  {
                    step: '4',
                    title: 'Maintain',
                    description: 'Monitor progress, track compliance, and prove it to stakeholders',
                    icon: BarChart3,
                    duration: 'Continuous',
                    color: 'from-orange-500 to-amber-500',
                    action: 'View Dashboard',
                    path: '/dashboard/privacy'
                  }
                ].map((phase, index) => (
                  <div key={index} className="relative">
                    <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 group">
                      <CardContent className="p-6">
                        {/* Step Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary text-white">
                            Step {phase.step}
                          </span>
                          <span className="text-xs text-muted-foreground">{phase.duration}</span>
                        </div>

                        {/* Icon */}
                        <div className={`w-14 h-14 bg-gradient-to-br ${phase.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                          <phase.icon className="w-7 h-7 text-white" aria-hidden="true" />
                        </div>

                        {/* Connector Line */}
                        {index < 3 && (
                          <div className="absolute top-24 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent hidden md:block" aria-hidden="true" />
                        )}

                        {/* Content */}
                        <h3 className="text-xl font-bold mb-2 text-foreground dark:text-dark-text text-center">
                          {phase.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 text-center min-h-[3rem]">
                          {phase.description}
                        </p>

                        {/* Action Button */}
                        <Link to={phase.path}>
                          <Button 
                            variant="outline" 
                            className="w-full text-xs group-hover:bg-primary group-hover:text-white transition-colors"
                            size="sm"
                          >
                            {phase.action}
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary CTA */}
            <div className="text-center p-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                Ready to Begin Your Compliance Journey?
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start with our free assessment and get a personalized compliance roadmap in just 15-20 minutes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/assessments/privacy-assessment">
                  <Button size="lg" className="enhanced-button px-8">
                    <Eye className="mr-2 h-5 w-5" />
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" onClick={handleOpenOnboarding} className="px-8">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  View Interactive Guide
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-primary mr-2" />
                  Get results in 20 minutes
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-primary mr-2" />
                  NIST Privacy Framework aligned
                </div>
              </div>
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

      {/* Compliance Journeys */}
      <section className="py-16 md:py-24 bg-muted/30 dark:bg-dark-support/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Assessment-First Banner */}
            <div className="mb-12 text-center">
              <Card className="inline-block border-2 border-primary/20 bg-primary/5 dark:bg-primary/10">
                <CardContent className="p-4 px-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Target className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-foreground">
                      <strong>New here?</strong> Take our <Link to="/assessments/privacy-assessment" className="text-primary underline font-semibold hover:text-primary/80">free assessment</Link> to get a personalized journey recommendation based on your gaps.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mb-16">
              <h2 className="section-title text-3xl md:text-4xl">
                Explore Compliance Journeys
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Each journey provides a structured path with phase-based guidance, curated tools, and clear outcomes
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Eye,
                  title: 'Privacy Leadership Journey',
                  subtitle: 'For DPOs & Privacy Leaders',
                  description: 'Lead privacy programs, conduct DPIAs, and oversee compliance across global regulations.',
                  path: '/roles/data-protection-officer',
                  cta: 'Explore Journey'
                },
                {
                  icon: Shield,
                  title: 'Privacy Operations Journey',
                  subtitle: 'For Privacy Officers',
                  description: 'Develop privacy strategies, coordinate initiatives, and ensure organizational compliance.',
                  path: '/roles/privacy-officer',
                  cta: 'Explore Journey'
                },
                {
                  icon: Scale,
                  title: 'Legal Compliance Journey',
                  subtitle: 'For Legal Counsel',
                  description: 'Review policies, assess legal risks, and ensure regulatory compliance across jurisdictions.',
                  path: '/roles/legal-counsel',
                  cta: 'Explore Journey'
                },
                {
                  icon: Database,
                  title: 'Data Governance Journey',
                  subtitle: 'For Data Stewards',
                  description: 'Manage data inventories, processing records, and maintain privacy controls.',
                  path: '/roles/data-steward',
                  cta: 'Explore Journey'
                }
              ].map((journey, index) => (
                <Card key={index} className="card-hover text-center border border-border dark:border-dark-support">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-primary/10 dark:bg-dark-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <journey.icon className="w-7 h-7 text-primary dark:text-dark-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-foreground dark:text-dark-text">{journey.title}</h3>
                    <p className="text-xs text-primary mb-3">{journey.subtitle}</p>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{journey.description}</p>
                    <Link to={journey.path} className="no-underline">
                      <Button variant="outline" className="w-full" aria-label={journey.cta}>
                        {journey.cta}
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
              Take our free assessment and get your personalized compliance journey with step-by-step guidance tailored to your gaps.
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
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white text-primary border-2 border-white hover:bg-white/90 shadow-lg px-8"
                  aria-label="Contact Our Team"
                >
                  <Users className="mr-2 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>Contact Our Team</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;