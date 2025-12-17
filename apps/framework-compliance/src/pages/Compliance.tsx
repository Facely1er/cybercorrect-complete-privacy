import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import JourneyProgressTracker from '../components/onboarding/JourneyProgressTracker';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';
import GapPriorityCard from '../components/gaps/GapPriorityCard';
import { useJourney } from '../context/JourneyContext';
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
  Lock,
  ExternalLink,
  Users,
  Sparkles,
  ClipboardCheck,
  Route,
  PlayCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const Compliance = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { 
    currentStepIndex, 
    completedSteps, 
    identifiedGaps, 
    gapProgress,
    markGapStarted,
    hasCompletedAssessment
  } = useJourney();
  const roleJourneys = [
    {
      title: 'Privacy Leadership Journey',
      subtitle: 'Recommended for DPOs & Privacy Leaders',
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
      title: 'Legal Compliance Journey',
      subtitle: 'Recommended for Legal Counsel',
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
      title: 'Data Governance Journey',
      subtitle: 'Recommended for Data Stewards',
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
      title: 'Privacy Operations Journey',
      subtitle: 'Recommended for Privacy Officers',
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
    { name: 'Privacy Assessment', path: '/assessments/privacy-assessment', icon: Eye, description: 'Evaluate your compliance posture', external: false },
    { name: 'GDPR Mapper', path: '/toolkit/gdpr-mapper', icon: Database, description: 'Map your data processing activities', external: false },
    { name: 'DPIA Generator', path: '/toolkit/dpia-generator', icon: FileText, description: 'Create impact assessments', external: false },
    { name: 'Policy Generator', path: '/toolkit/privacy-policy-generator', icon: Shield, description: 'Generate compliant policies', external: false },
    { 
      name: 'Privacy Portal', 
      path: import.meta.env.VITE_PRIVACY_PORTAL_URL || 'https://www.portal.cybercorrect.com',
      icon: Users, 
      description: 'Self-service data rights & stakeholder portal',
      external: true 
    }
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg">
      {/* Onboarding Modal */}
      <OnboardingFlow 
        isVisible={showOnboarding} 
        onClose={() => setShowOnboarding(false)}
        currentStep={1}
      />

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
              Your <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">Compliance</span> Pathway
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {hasCompletedAssessment 
                ? 'Close your compliance gaps with prioritized actions and clear guidance'
                : 'Discover your compliance gaps and get a prioritized action plan'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessments/privacy-assessment">
                <Button size="lg" variant="default" className="enhanced-button">
                  Start Assessment
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="hover:-translate-y-1 transition-transform"
                onClick={() => setShowOnboarding(true)}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                View Journey Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Progress Tracker */}
      <section className="py-8 bg-muted/30 dark:bg-dark-support/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <JourneyProgressTracker 
              currentStepIndex={currentStepIndex}
              completedSteps={completedSteps}
              compact={false}
              showNextAction={true}
            />
          </div>
        </div>
      </section>

      {/* Gap-Based Priority Section - Only show after assessment */}
      {hasCompletedAssessment && identifiedGaps.length > 0 && (
        <section className="py-16 bg-white dark:bg-dark-surface border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Target className="w-4 h-4" />
                  Gap-Based Action Plan
                </div>
                <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
                  Your Priority Compliance Gaps
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Based on your assessment, focus on these areas to reduce risk and achieve compliance
                </p>
              </div>

              {/* Gap Progress Stats */}
              {gapProgress && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-foreground">{gapProgress.totalGaps}</div>
                      <div className="text-sm text-muted-foreground">Total Gaps</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-red-200 dark:border-red-800">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-red-600">{gapProgress.criticalGapsRemaining}</div>
                      <div className="text-sm text-muted-foreground">Critical Remaining</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-orange-600">{gapProgress.inProgressGaps}</div>
                      <div className="text-sm text-muted-foreground">In Progress</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-green-200 dark:border-green-800">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-green-600">{gapProgress.completedGaps}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Display Gaps */}
              <div className="space-y-6">
                {identifiedGaps.map((gap) => (
                  <GapPriorityCard
                    key={gap.id}
                    gap={gap}
                    onStartGap={markGapStarted}
                    showTools={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Assessment-First Flow Section - Show if no assessment yet */}
      {!hasCompletedAssessment && (
        <section className="py-16 bg-white dark:bg-dark-surface border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Personalized Experience
              </span>
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start with an assessment to discover your optimal compliance path based on your gaps and organizational context
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <ClipboardCheck className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent hidden md:block"></div>
                  <span className="inline-block bg-primary text-white text-xs font-bold px-2 py-1 rounded-full mb-3">Step 1</span>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Take Assessment</h3>
                  <p className="text-muted-foreground text-sm">
                    Complete the Privacy Assessment to evaluate your current compliance posture across key areas
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-secondary/50 to-transparent hidden md:block"></div>
                  <span className="inline-block bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full mb-3">Step 2</span>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Get Your Journey</h3>
                  <p className="text-muted-foreground text-sm">
                    Receive your personalized compliance journey with prioritized actions based on your specific gaps
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Route className="w-8 h-8 text-white" />
                  </div>
                  <span className="inline-block bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full mb-3">Step 3</span>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Follow Your Journey</h3>
                  <p className="text-muted-foreground text-sm">
                    Access customized tools, workflows, and resources prioritized by your specific compliance gaps
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link to="/assessments/privacy-assessment">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Your Personalized Journey
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-3">
                Takes approximately 15-20 minutes • Get instant recommendations
              </p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Role Journeys - Repositioned as Secondary/Optional */}
      <section className="py-20 bg-muted/30 dark:bg-dark-support/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full text-sm font-medium mb-4 text-muted-foreground">
                <Users className="w-4 h-4" />
                Optional for Large Teams
              </div>
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
                Role-Based Compliance Guides
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                For organizations with dedicated privacy teams, explore role-specific guidance
              </p>
              {hasCompletedAssessment && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-xl mx-auto">
                  <p className="text-sm text-foreground">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    <strong>Note:</strong> Your gap-based action plan above is already prioritized for your needs. 
                    These role guides provide additional context for team members.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {roleJourneys.map((role, index) => (
                <Link key={index} to={role.path} className="block group">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30">
                    <CardContent className="p-6 text-center">
                      <div className={`w-14 h-14 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <role.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-1 text-foreground dark:text-dark-text group-hover:text-primary transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-xs text-primary mb-3">{role.subtitle}</p>
                      <p className="text-muted-foreground mb-4">{role.description}</p>
                      <div className="space-y-2">
                        {role.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center justify-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex items-center justify-center text-primary font-medium group-hover:translate-x-2 transition-transform">
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

      {/* Privacy Portal CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 dark:from-dark-primary/5 dark:via-dark-secondary/5 dark:to-dark-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left side - Info */}
                  <div className="p-8 md:p-10">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary dark:bg-primary/20 px-3 py-1 rounded-full text-sm font-medium mb-4">
                      <Users className="w-4 h-4" />
                      Self-Service Portal
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
                      Privacy Portal for Stakeholders
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      Extend your compliance program by empowering all stakeholders to participate in privacy compliance. 
                      The Privacy Portal democratizes privacy rights and duties across your entire organization.
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Data Subject Rights Exercise</p>
                          <p className="text-sm text-muted-foreground">GDPR, CCPA, EEOC compliant request handling</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Stakeholder Privacy Duties</p>
                          <p className="text-sm text-muted-foreground">Role-based privacy responsibility tracking</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Incident Reporting & Management</p>
                          <p className="text-sm text-muted-foreground">Streamlined privacy breach reporting</p>
                        </div>
                      </div>
                    </div>

                    <a 
                      href={import.meta.env.VITE_PRIVACY_PORTAL_URL || 'https://www.portal.cybercorrect.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button size="lg" className="enhanced-button group">
                        Access Privacy Portal
                        <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                  </div>

                  {/* Right side - Features */}
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 p-8 md:p-10 flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-6 text-foreground dark:text-dark-text">
                      Who Uses the Privacy Portal?
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 bg-white/80 dark:bg-dark-surface/80 p-3 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Administrators</p>
                          <p className="text-xs text-muted-foreground">Institution-wide oversight</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white/80 dark:bg-dark-surface/80 p-3 rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Privacy Officers</p>
                          <p className="text-xs text-muted-foreground">Data protection management</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white/80 dark:bg-dark-surface/80 p-3 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Staff Members</p>
                          <p className="text-xs text-muted-foreground">Daily privacy practices</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white/80 dark:bg-dark-surface/80 p-3 rounded-lg">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Employees & Families</p>
                          <p className="text-xs text-muted-foreground">Exercise data rights</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {quickStartTools.map((tool, index) => {
                const cardContent = (
                  <Card className={`h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${tool.external ? 'border-2 border-primary/30' : ''}`}>
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <tool.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1 text-foreground flex items-center justify-center gap-1">
                        {tool.name}
                        {tool.external && <ExternalLink className="w-3 h-3" />}
                      </h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                );

                return tool.external ? (
                  <a 
                    key={index} 
                    href={tool.path} 
                    className="block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {cardContent}
                  </a>
                ) : (
                  <Link key={index} to={tool.path} className="block">
                    {cardContent}
                  </Link>
                );
              })}
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

