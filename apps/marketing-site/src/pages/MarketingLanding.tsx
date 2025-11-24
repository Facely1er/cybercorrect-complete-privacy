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
  Zap
} from 'lucide-react';

const MarketingLanding = () => {
  const frameworkComplianceUrl = process.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://app.cybercorrect.com';
  const privacyPortalUrl = process.env.VITE_PRIVACY_PORTAL_URL || 'https://portal.cybercorrect.com';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">CyberCorrect</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Solutions
              </a>
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <a 
                href={privacyPortalUrl}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                For Individuals
              </a>
              <a 
                href={frameworkComplianceUrl}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                For Organizations
              </a>
            </div>
          </div>
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
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Comprehensive privacy solutions for organizations and individuals. 
              Streamline compliance, protect data rights, and build trust with automated privacy management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={frameworkComplianceUrl}
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                <Building2 className="mr-2 h-5 w-5" />
                For Organizations
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href={privacyPortalUrl}
                className="inline-flex items-center justify-center px-8 py-4 bg-background border-2 border-primary text-primary rounded-lg text-lg font-semibold hover:bg-primary/5 transition-all"
              >
                <User className="mr-2 h-5 w-5" />
                For Individuals
                <ArrowRight className="ml-2 h-5 w-5" />
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
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">CyberCorrect</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprehensive privacy compliance solutions for organizations and individuals.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Products</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href={frameworkComplianceUrl} className="text-muted-foreground hover:text-foreground transition-colors">
                    Framework Compliance
                  </a>
                </li>
                <li>
                  <a href={privacyPortalUrl} className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Portal
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href={`${frameworkComplianceUrl}/documentation`} className="text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href={`${frameworkComplianceUrl}/pricing`} className="text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href={`${frameworkComplianceUrl}/privacy`} className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href={`${frameworkComplianceUrl}/terms`} className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ERMITS LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLanding;

