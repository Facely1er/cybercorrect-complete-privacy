import { Link, useNavigate } from 'react-router-dom';
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
  Sparkles
} from 'lucide-react';

const Landing = () => {
  useChatbot();
  const navigate = useNavigate();

  // Hero heading carousel items
  const heroHeadings = [
    // Heading 1: Current privacy compliance focus
    <h1 key="heading-1" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground">
      <span className="text-foreground">Demystify </span>
      <span className="text-primary">Privacy Compliance</span>
    </h1>,
    // Heading 2: Automated solution focus
    <h1 key="heading-2" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground">
      <span className="text-foreground">Automate Your </span>
      <span className="text-primary">Privacy</span>
      <br className="hidden sm:block" />
      <span className="text-primary">by Design</span>
    </h1>
  ];





  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 bg-grid opacity-30 dark:opacity-20"></div>
        <FloatingPrivacyIcons />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge with Shield Icon */}
            <div className="inline-block mb-6">
              <span className="bg-primary/10 text-primary border border-primary/20 text-sm px-4 py-2 rounded-full inline-flex items-center">
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
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Whether you're a privacy professional or just got assigned "figure out compliance"—we guide you through it. 
              Discover your compliance gaps and get a clear, prioritized action plan. No privacy expertise required.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link 
                to="/assessments/privacy-assessment"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl animate-pulse-slow"
              >
                <Eye className="mr-2 h-5 w-5" />
                Start Your Journey — Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                No privacy expertise required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                Results in 20 minutes
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                NIST Privacy Framework aligned
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clear Customer Journey Path */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header with Value Prop */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Clear Path to Compliance
              </div>
              <h2 className="section-title text-3xl md:text-4xl mb-4">
                Your Privacy Compliance Pathway in 4 Clear Steps
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Discover your gaps, get prioritized actions, and close compliance risks with clear guidance
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
                    description: 'See your compliance gaps ranked by severity with clear priorities',
                    icon: Target,
                    duration: 'Instant',
                    color: 'from-purple-500 to-pink-500',
                    action: 'View Gap Analysis',
                    path: '/compliance'
                  },
                  {
                    step: '3',
                    title: 'Close Gaps',
                    description: 'Use recommended tools to address each gap, starting with critical ones',
                    icon: FileCheck,
                    duration: 'Ongoing',
                    color: 'from-green-500 to-emerald-500',
                    action: 'Start Closing Gaps',
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
                        <h3 className="text-xl font-bold mb-2 text-foreground text-center">
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
                Ready to Discover Your Compliance Gaps?
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start with our free assessment and get your prioritized gap analysis in just 15-20 minutes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/assessments/privacy-assessment">
                  <Button size="lg" variant="default" className="px-8">
                    <Eye className="mr-2 h-5 w-5" />
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
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
      <section className="py-16 md:py-24 bg-background">
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
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform shadow-lg`}>
                    <goal.icon className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground text-center">{goal.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{goal.description}</p>
                  <div className="space-y-1 mb-6">
                    {goal.outcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-center justify-center text-sm">
                        <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                        <span className="text-foreground">{outcome}</span>
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
          <div className="text-center mt-16 pt-8 border-t border-border/50">
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
      <section className="py-16 md:py-24 bg-muted/30 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title text-3xl md:text-4xl">
                Built for Privacy Professionals
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                (But You Don't Need to Be One)
              </p>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto mt-4">
                CyberCorrect is used by privacy professionals and compliance teams—but designed so 
                <strong> anyone</strong> responsible for privacy compliance can use it effectively.
              </p>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto mt-2">
                <strong>Not sure where you fit?</strong> Take our assessment—we'll guide you regardless of your title.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Eye,
                  title: 'Privacy Professionals',
                  subtitle: 'e.g., DPOs, Privacy Officers',
                  description: 'Lead privacy programs, conduct DPIAs, and oversee compliance across global regulations.',
                  path: '/roles/data-protection-officer',
                  cta: 'Explore Guide'
                },
                {
                  icon: Scale,
                  title: 'Legal & Risk Teams',
                  subtitle: 'e.g., Legal Counsel, Risk Managers',
                  description: 'Review policies, assess legal risks, and ensure regulatory compliance across jurisdictions.',
                  path: '/roles/legal-counsel',
                  cta: 'Explore Guide'
                },
                {
                  icon: Database,
                  title: 'Data & IT Teams',
                  subtitle: 'e.g., Data Stewards, IT Managers',
                  description: 'Manage data inventories, processing records, and maintain privacy controls.',
                  path: '/roles/data-steward',
                  cta: 'Explore Guide'
                },
                {
                  icon: Users,
                  title: 'Everyone Else',
                  subtitle: 'Business owners, Operations, HR',
                  description: 'Just got assigned privacy compliance? We guide you through everything step-by-step.',
                  path: '/assessments/privacy-assessment',
                  cta: 'Start Assessment'
                }
              ].map((journey, index) => (
                <Card key={index} className="card-hover text-center border border-border">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <journey.icon className="w-7 h-7 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-foreground">{journey.title}</h3>
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
            
            {/* Universal Fallback */}
            <div className="text-center mt-16 pt-8 border-t border-border/50">
              <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Not Sure Where You Fit?
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    That's perfectly fine! Most people aren't sure at first. Start with our free assessment—we'll analyze your 
                    situation and recommend the best path forward, regardless of your title or experience level.
                  </p>
                  <Link to="/assessments/privacy-assessment" className="no-underline">
                    <Button size="lg" className="px-8">
                      <Eye className="mr-2 h-5 w-5" />
                      Start Free Assessment — We'll Guide You
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-4">
                    No experience required. Takes 20 minutes. Instant results.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Portal Section */}
      <section className="py-16 md:py-20 bg-muted/30 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                NEW: Privacy Portal Beta Program
              </div>
              <h2 className="section-title text-3xl md:text-4xl mb-4">
                Extend Privacy to Your Entire Workforce
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                CyberCorrect Platform automates compliance for professionals. <strong>Privacy Portal</strong> (Beta) empowers 
                employees, HR, and employers with self-service privacy rights and duties.
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
                      <h3 className="text-lg font-bold text-foreground">Framework Compliance</h3>
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

              {/* Privacy Portal - Multistakeholder Beta */}
              <Card className="border-2 border-amber-400/50 dark:border-amber-600/30 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 relative overflow-hidden">
                <div className="absolute top-0 right-0">
                  <span className="inline-block bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                    🧪 BETA
                  </span>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Privacy Portal</h3>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Co-Create With Your Stakeholders</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Extend Platform to your workforce. Build Portal WITH your employees, HR, compliance, and legal teams.
                  </p>
                  
                  {/* Stakeholder Cohorts */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { label: 'Employees', count: '250+' },
                      { label: 'HR Teams', count: '75+' },
                      { label: 'Compliance', count: '50+' },
                      { label: 'Legal Reps', count: '25+' }
                    ].map((cohort, idx) => (
                      <div key={idx} className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-2 text-center">
                        <div className="text-xs text-muted-foreground">{cohort.label}</div>
                        <div className="text-sm font-bold text-amber-600">{cohort.count} testers</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
                    <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mb-2">Beta Pricing:</p>
                    <div className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
                      <div className="flex justify-between">
                        <span>Standard:</span>
                        <span className="font-bold">+$99/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Branded:</span>
                        <span className="font-bold">+$149/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>White-Label:</span>
                        <span className="font-bold">+$249/mo</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full group bg-amber-500 hover:bg-amber-600 text-white border-0"
                    onClick={() => navigate('/portal-beta')}
                  >
                    Learn About Beta Program
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Limited to 100 organizations • White-label ready
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-primary dark:bg-dark-primary">
        <div className="container mx-auto px-4">
          <div className="text-center text-primary-foreground max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Close Your Compliance Gaps?
            </h2>
            <p className="text-lg text-white/95 dark:text-foreground mb-8 leading-relaxed">
              Take our free assessment and get your prioritized gap analysis with clear actions to reduce compliance risk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessments/privacy-assessment" className="no-underline">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-100 shadow-xl px-8"
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
                  className="bg-transparent text-white hover:bg-white/10 border-2 border-white shadow-lg px-8"
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
