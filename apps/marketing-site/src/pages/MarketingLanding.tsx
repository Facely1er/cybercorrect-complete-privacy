import { useState } from 'react';
import { 
  ArrowRight, 
  Shield, 
  Eye,
  Users,
  Building2,
  User,
  CheckCircle,
  FileCheck,
  Database,
  Lock,
  BarChart3,
  Zap,
  FileText,
  Menu,
  X,
  HelpCircle,
  Cookie
} from 'lucide-react';
import { HeroHeadingCarousel } from '../components/HeroHeadingCarousel';

const MarketingLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const frameworkComplianceUrl = import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.cybercorrect.com';
  const privacyPortalUrl = import.meta.env.VITE_PRIVACY_PORTAL_URL || 'https://www.portal.cybercorrect.com';

  // Hero heading carousel items
  const heroHeadings = [
    // Heading 1: Current privacy compliance focus
    <h1 key="heading-1" className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
      <span className="text-foreground">Stop Losing Sleep Over </span>
      <span className="text-primary">Privacy</span>
      <br className="hidden sm:block" />
      <span className="text-primary">Compliance</span>
    </h1>,
    // Heading 2: Automated solution focus
    <h1 key="heading-2" className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
      <span className="text-foreground">Automate Your </span>
      <span className="text-primary">Privacy</span>
      <br className="hidden sm:block" />
      <span className="text-primary">Compliance Journey</span>
    </h1>
  ];

  const navigation = [
    { name: 'Solutions', href: '#solutions', icon: Database },
    { name: 'Features', href: '#features', icon: Zap },
    { name: 'About', href: '#about', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-3">
                <img 
                  src="/cybercorrect.png" 
                  alt="CyberCorrect" 
                  className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0"
                />
                <div className="hidden sm:flex sm:flex-col justify-center font-bold leading-tight">
                  <span className="text-sm leading-none">CyberCorrect™</span>
                  <span className="text-xs font-medium leading-tight mt-0.5">Privacy Compliance</span>
                  <span className="text-xs font-normal text-muted-foreground leading-tight mt-0.5">by ERMITS</span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <a 
                href="#solutions" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-sm"
              >
                <Database className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Solutions</span>
              </a>
              <a 
                href="#features" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-sm"
              >
                <Zap className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Features</span>
              </a>
              <a 
                href="#about" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-sm"
              >
                <HelpCircle className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">About</span>
              </a>
            </nav>

            {/* Right side actions */}
            <div className="hidden md:flex items-center space-x-2">
              <a 
                href={privacyPortalUrl}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-sm"
              >
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">For Individuals</span>
              </a>
              <a 
                href={frameworkComplianceUrl}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">For Organizations</span>
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-border/50 py-4">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </a>
                  );
                })}
              </nav>
              
              {/* Mobile Actions */}
              <div className="border-t border-border/50 pt-4 mt-4">
                <div className="space-y-2">
                  <a
                    href={privacyPortalUrl}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span>For Individuals</span>
                  </a>
                  <a
                    href={frameworkComplianceUrl}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 bg-primary text-primary-foreground shadow-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span>For Organizations</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
              Regulatory fines can reach millions. Data breaches destroy trust. Manual compliance processes drain resources. 
              Get automated privacy compliance that protects your business, reduces risk, and saves your team hundreds of hours.
            </p>

            {/* Primary CTAs - Phase 1: Awareness & Trust */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <a 
                href={`${frameworkComplianceUrl}/assessment-hub`}
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                <Eye className="mr-2 h-5 w-5" />
                Start Free Privacy Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href={`${frameworkComplianceUrl}/login`}
                className="inline-flex items-center justify-center px-8 py-4 bg-background border-2 border-primary text-primary rounded-lg text-lg font-semibold hover:bg-primary/5 transition-all"
              >
                <Shield className="mr-2 h-5 w-5" />
                Log In
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>

            {/* Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={frameworkComplianceUrl}
                className="inline-flex items-center justify-center px-6 py-3 bg-muted text-foreground rounded-lg text-base font-medium hover:bg-muted/80 transition-all"
              >
                <Building2 className="mr-2 h-4 w-4" />
                For Organizations
              </a>
              <a 
                href={privacyPortalUrl}
                className="inline-flex items-center justify-center px-6 py-3 bg-muted text-foreground rounded-lg text-base font-medium hover:bg-muted/80 transition-all"
              >
                <User className="mr-2 h-4 w-4" />
                For Individuals
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              Solve Your Privacy Challenges
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're managing enterprise compliance or exercising your data rights, we've built the tools you need to succeed
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Framework Compliance Card */}
            <div className="bg-background border-2 border-border rounded-xl p-8 hover:shadow-xl transition-all hover:border-primary/50">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Framework Compliance</h3>
                  <p className="text-sm text-muted-foreground">For Organizations</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                <strong className="text-foreground">Reduce compliance risk by 80%</strong> while cutting assessment time from weeks to hours. 
                Stay audit-ready for GDPR, CCPA, NIST Privacy Framework, and more—without hiring expensive consultants.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground"><strong className="text-foreground">Avoid regulatory fines:</strong> Automated gap analysis across multiple frameworks</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground"><strong className="text-foreground">Save weeks of work:</strong> AI-powered DPIA generation in minutes</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground"><strong className="text-foreground">Align your team:</strong> Collaborative workflows with clear accountability</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground"><strong className="text-foreground">Pass audits confidently:</strong> Complete evidence vault with full audit trails</span>
                </div>
              </div>

              <a 
                href={frameworkComplianceUrl}
                className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Explore Framework Compliance
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>

            {/* Privacy Portal Card */}
            <div className="bg-background border-2 border-border rounded-xl p-8 hover:shadow-xl transition-all hover:border-primary/50">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Privacy Portal</h3>
                  <p className="text-sm text-muted-foreground">For Individuals</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                <strong className="text-foreground">Take control of your personal data.</strong> Exercise your rights under GDPR and CCPA 
                without the frustration of email chains and legal jargon. Get transparency, control, and peace of mind.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground"><strong className="text-foreground">Know what companies have:</strong> Request and view your personal data</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground"><strong className="text-foreground">Delete what you don't want:</strong> One-click data deletion requests</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground"><strong className="text-foreground">Control your consent:</strong> Manage privacy preferences across services</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground"><strong className="text-foreground">Stay informed:</strong> Get notified of data breaches affecting you</span>
                </div>
              </div>

              <a 
                href={privacyPortalUrl}
                className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Explore Privacy Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              Real Results, Not Just Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how organizations are reducing compliance costs, avoiding fines, and building customer trust
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Avoid Multi-Million Dollar Fines',
                description: 'Stay compliant across GDPR, CCPA, LGPD, PIPEDA, and NIST Privacy Framework with automated gap detection'
              },
              {
                icon: Zap,
                title: 'Cut Assessment Time by 90%',
                description: 'Automated workflows turn weeks of manual work into hours, freeing your team for strategic initiatives'
              },
              {
                icon: Database,
                title: 'Eliminate Data Blind Spots',
                description: 'Map every data flow across your organization to identify risks before they become breaches'
              },
              {
                icon: FileCheck,
                title: 'Pass Audits on First Try',
                description: 'Maintain a complete evidence vault with full audit trails—no more scrambling when regulators call'
              },
              {
                icon: Users,
                title: 'Align Teams Without Chaos',
                description: 'Clear accountability and RACI matrices ensure nothing falls through the cracks'
              },
              {
                icon: BarChart3,
                title: 'Make Data-Driven Decisions',
                description: 'Real-time dashboards show exactly where you stand and what needs attention'
              },
              {
                icon: Lock,
                title: 'Respond to Requests in Hours, Not Weeks',
                description: 'Automated workflows handle data subject rights requests within regulatory deadlines'
              },
              {
                icon: Eye,
                title: 'Build Privacy Into Everything',
                description: 'Privacy impact assessments and risk management prevent problems before they start'
              },
              {
                icon: CheckCircle,
                title: 'Sleep Better at Night',
                description: 'Complete documentation and continuous monitoring mean you\'re always audit-ready'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stop Risking Your Business
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Every day without proper compliance is a day you're exposed to fines, breaches, and lost trust. 
              Start protecting your business today—it takes less than 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={frameworkComplianceUrl}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-lg text-lg font-semibold hover:bg-white/90 transition-all shadow-lg"
              >
                <Building2 className="mr-2 h-5 w-5" />
                Start with Framework Compliance
              </a>
              <a 
                href={privacyPortalUrl}
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white/10 transition-all"
              >
                <User className="mr-2 h-5 w-5" />
                Access Privacy Portal
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5 group">
                <img 
                  src="/cybercorrect.png" 
                  alt="CyberCorrect" 
                  className="h-10 w-10 flex-shrink-0"
                />
                <div className="flex flex-col justify-center leading-tight">
                  <span className="font-bold text-sm leading-none group-hover:text-primary transition-colors">CyberCorrect™</span>
                  <span className="text-xs text-muted-foreground leading-tight mt-0.5">by ERMITS</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Comprehensive privacy compliance solutions for organizations and individuals.
              </p>
              <div className="pt-1">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  CyberCorrect™ v1.0 – Privacy & Data Rights Operations
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  © {new Date().getFullYear()} ERMITS. All rights reserved.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-foreground mb-3">Products</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href={frameworkComplianceUrl} 
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Database className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Framework Compliance</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={privacyPortalUrl} 
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <User className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Privacy Portal</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-foreground mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href={`${frameworkComplianceUrl}/documentation`} 
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Documentation</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={`${frameworkComplianceUrl}/pricing`} 
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BarChart3 className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Pricing</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-foreground mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href={`${frameworkComplianceUrl}/privacy`} 
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Shield className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={`${frameworkComplianceUrl}/terms`} 
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Lock className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Terms of Service</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={`${frameworkComplianceUrl}/cookies`} 
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Cookie className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Cookie Policy</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={`${frameworkComplianceUrl}/acceptable-use`} 
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Shield className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Acceptable Use Policy</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLanding;

