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

const MarketingLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const frameworkComplianceUrl = import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.platform.cybercorrect.com';
  const privacyPortalUrl = import.meta.env.VITE_PRIVACY_PORTAL_URL || 'https://www.portal.cybercorrect.com';

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
              <a href="/" className="flex items-center space-x-2">
                <img 
                  src="/cybercorrect.png" 
                  alt="CyberCorrect" 
                  className="h-16 w-16"
                />
                <div className="hidden sm:flex sm:flex-col font-bold leading-tight">
                  <span className="text-sm">CyberCorrect™</span>
                  <span className="text-xs font-medium">Privacy Compliance</span>
                  <span className="text-xs font-normal text-muted-foreground">by ERMITS</span>
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
            <div className="inline-block mb-6">
              <span className="bg-primary/10 text-primary border border-primary/20 text-sm px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 mr-2 inline" />
                Privacy Compliance Solutions
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Privacy Compliance
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Made Simple</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Comprehensive privacy solutions for organizations and individuals. 
              Streamline compliance, protect data rights, and build trust with automated privacy management.
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
              Complete Privacy Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Two powerful platforms designed for different privacy needs
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
                Enterprise privacy compliance platform for GDPR, CCPA, NIST Privacy Framework, and more. 
                Automated assessments, DPIAs, project management, and evidence management.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Multi-framework compliance assessments</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Automated DPIA generation</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Collaborative project management</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Evidence vault and audit trails</span>
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
                Personal privacy dashboard for exercising data subject rights. 
                Request access, deletion, portability, and manage your privacy preferences.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Exercise data subject rights (GDPR/CCPA)</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Privacy dashboard and data inventory</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Consent management</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">Privacy incident notifications</span>
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
              Why Choose CyberCorrect?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive privacy solutions built for modern compliance needs
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Multi-Framework Support',
                description: 'GDPR, CCPA, LGPD, PIPEDA, and NIST Privacy Framework compliance'
              },
              {
                icon: Zap,
                title: 'Automated Workflows',
                description: 'Streamline compliance with automated assessments and document generation'
              },
              {
                icon: Database,
                title: 'Data Mapping',
                description: 'Visualize and document data flows across your organization'
              },
              {
                icon: FileCheck,
                title: 'Evidence Management',
                description: 'Centralized vault for compliance documentation and audit trails'
              },
              {
                icon: Users,
                title: 'Role-Based Collaboration',
                description: 'Team workflows with RACI matrices and stakeholder management'
              },
              {
                icon: BarChart3,
                title: 'Compliance Dashboards',
                description: 'Real-time visibility into your privacy compliance posture'
              },
              {
                icon: Lock,
                title: 'Data Subject Rights',
                description: 'Automated handling of access, deletion, and portability requests'
              },
              {
                icon: Eye,
                title: 'Privacy by Design',
                description: 'Built-in privacy impact assessments and risk management'
              },
              {
                icon: CheckCircle,
                title: 'Audit Ready',
                description: 'Maintain compliance documentation ready for regulatory audits'
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
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Choose the platform that fits your needs and start your privacy compliance journey today.
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
        <div className="container mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <img 
                  src="/cybercorrect.png" 
                  alt="CyberCorrect" 
                  className="h-12 w-12 flex-shrink-0"
                />
                <div className="flex flex-col space-y-1">
                  <span className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">CyberCorrect™</span>
                  <span className="text-xs text-muted-foreground leading-tight">by ERMITS</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Comprehensive privacy compliance solutions for organizations and individuals.
              </p>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  CyberCorrect™ v1.0 – Privacy & Data Rights Operations
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  © {new Date().getFullYear()} ERMITS. All rights reserved.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-foreground mb-4">Products</h3>
              <ul className="space-y-3 text-sm">
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
            
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-foreground mb-4">Resources</h3>
              <ul className="space-y-3 text-sm">
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
            
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-foreground mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
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

