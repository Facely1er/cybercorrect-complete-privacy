import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

import { Shield, FileText, ChevronRight, CheckCircle, Users, Lock, Settings, Database, Layers, Lightbulb, Cloud, RefreshCw, Server, Eye, Scale, FileSearch, Activity, Target, Link2} from 'lucide-react';


const Features = () => {
  const [activeTab, setActiveTab] = useState('platform');
  const navigate = useNavigate();

  // Handler functions
  const handleStartAssessment = () => {
    navigate('/assessments/privacy-assessment');
  };

  const handleGuideMe = () => {
    navigate('/documentation/getting-started');
  };

  // Platform capabilities organized by function
  const platformCapabilities = {
    platform: {
      title: 'Platform Overview',
      description: 'Comprehensive compliance automation platform',
      features: [
        {
          icon: Eye,
          title: 'Privacy-First Architecture',
          description: 'Built from the ground up for GDPR, CCPA, and global privacy regulations',
          benefits: ['Privacy by design', 'Multi-regulation support', 'Data minimization', 'Consent management'],
          link: '/toolkit/gdpr-mapper'
        },
        {
          icon: Shield,
          title: 'Privacy Compliance Suite',
          description: 'Complete GDPR, CCPA, and global privacy compliance platform',
          benefits: ['Privacy impact assessments', 'Data subject rights management', 'Privacy policy generation', 'Continuous monitoring'],
          link: '/assessments/privacy-assessment'
        },
        {
          icon: Lightbulb,
          title: 'AI-Powered Intelligence',
          description: 'Machine learning that understands compliance and automates complex tasks',
          benefits: ['Intelligent gap analysis', 'Automated recommendations', 'Predictive compliance', 'Smart documentation'],
          link: '/features#ai'
        },
        {
          icon: RefreshCw,
          title: 'Continuous Compliance',
          description: 'Real-time monitoring and automated updates keep you compliant 24/7',
          benefits: ['Real-time monitoring', 'Automated alerts', 'Drift detection', 'Performance tracking'],
          link: '/features#monitoring'
        }
      ]
    },
    assessments: {
      title: 'Intelligent Assessments',
      description: 'Role-specific assessments that provide actionable insights',
      features: [
        {
          icon: Eye,
          title: 'Privacy Impact Assessment',
          description: 'Comprehensive GDPR/CCPA privacy assessment with automated DPIA generation',
          benefits: ['25-minute assessment', 'Multi-regulation coverage', 'Automated risk scoring', 'Custom remediation roadmaps'],
          stats: '',
          link: '/assessments/privacy-assessment'
        },
        {
          icon: Shield,
          title: 'Data Classification Assessment',
          description: 'Complete data classification and privacy risk evaluation',
          benefits: ['Privacy risk evaluation', 'Compliance scoring', 'Gap identification', 'Implementation guidance'],
          stats: '',
          link: '/assessments/privacy-assessment'
        },
        {
          icon: Scale,
          title: 'Multi-Framework Assessment',
          description: 'Single assessment mapped to SOC 2, ISO 27001, NIST, and more',
          benefits: ['5+ privacy frameworks', 'Common controls mapping', 'Unified reporting', 'Compliance orchestration'],
          stats: '',
          link: '/toolkit/privacy-gap-analyzer'
        },
        {
          icon: Target,
          title: 'Risk & Gap Analysis',
          description: 'Comprehensive compliance gap identification and prioritization',
          benefits: ['Risk-based prioritization', 'Cost-benefit analysis', 'Timeline planning', 'Resource allocation'],
          stats: 'Instant results',
          link: '/toolkit/privacy-gap-analyzer'
        }
      ]
    },
    tools: {
      title: 'Compliance Toolkit',
      description: 'Powerful tools to automate documentation and streamline compliance',
      features: [
        {
          icon: Eye,
          title: 'DPIA Generator',
          description: 'AI-powered Data Protection Impact Assessment creation',
          benefits: ['Template-based generation', 'Risk assessment integration', 'Multi-language support', 'Regulatory alignment'],
          stats: '',
          link: '/toolkit/resources/viewers/dpia-template'
        },
        {
          icon: FileText,
          title: 'Policy Generator',
          description: 'Automated policy and procedure generation for multiple frameworks',
          benefits: ['Industry-specific templates', 'Regulatory compliance', 'Version control', 'Approval workflows'],
          stats: '',
          link: '/toolkit/privacy-policy-generator'
        },
        {
          icon: Database,
          title: 'Data Mapping Tool',
          description: 'Visual mapping and documentation of personal data flows for privacy compliance',
          benefits: ['Interactive visualization', 'GDPR alignment', 'Export capabilities', 'Audit documentation'],
          stats: 'Compliance ready',
          link: '/toolkit/gdpr-mapper'
        },
        {
          icon: FileSearch,
          title: 'Evidence Vault',
          description: 'Centralized repository for compliance evidence and documentation',
          benefits: ['Organized storage', 'Audit-ready reports', 'Version tracking', 'Secure sharing'],
          stats: 'Audit ready',
          link: '/project/evidence'
        },
        {
          icon: Users,
          title: 'Consent Management',
          description: 'Track and manage employee consent and privacy preferences for GDPR and CCPA compliance',
          benefits: ['Consent tracking', 'Renewal management', 'Form templates', 'Multi-regulation support'],
          stats: 'Compliance ready',
          link: '/toolkit/consent-management'
        },
        {
          icon: Shield,
          title: 'DPIA Manager',
          description: 'Enhanced Data Protection Impact Assessment management with lifecycle tracking',
          benefits: ['DPIA lifecycle management', 'Risk matrix visualization', 'Multiple templates', 'Checklist guidance'],
          stats: 'Enhanced workflow',
          link: '/toolkit/dpia-manager'
        },
        {
          icon: FileText,
          title: 'Retention Policy Generator',
          description: 'Manage data retention policies and ensure compliance with legal requirements',
          benefits: ['Policy creation', 'Retention schedules', 'Compliance tracking', 'Review cycles'],
          stats: 'Automated compliance',
          link: '/toolkit/retention-policy-generator'
        },
        {
          icon: Target,
          title: 'Privacy by Design Assessment',
          description: 'Evaluate systems and processes against the 7 Privacy by Design principles',
          benefits: ['7 principles assessment', 'Scoring system', 'Implementation guidance', 'Compliance tracking'],
          stats: 'Comprehensive evaluation',
          link: '/toolkit/privacy-by-design-assessment'
        },
        {
          icon: Database,
          title: 'Vendor Risk Assessment',
          description: 'Evaluate and monitor third-party vendors for privacy compliance and data protection',
          benefits: ['Risk categorization', 'Compliance tracking', 'Assessment scoring', 'DPA status tracking'],
          stats: 'Risk management',
          link: '/toolkit/vendor-risk-assessment'
        },
        {
          icon: Settings,
          title: 'Service Provider Manager',
          description: 'Comprehensive processor and service provider management with agreement tracking',
          benefits: ['Provider management', 'Agreement tracking', 'Compliance monitoring', 'Risk assessment'],
          stats: 'Centralized management',
          link: '/toolkit/service-provider-manager'
        },
        {
          icon: Activity,
          title: 'Incident Response Manager',
          description: 'Track and manage privacy incidents, data breaches, and compliance violations',
          benefits: ['Incident tracking', 'Regulatory notifications', 'Response workflow', 'Documentation'],
          stats: 'Rapid response',
          link: '/toolkit/incident-response-manager'
        }
      ]
    },
    integration: {
      title: 'Enterprise Integration',
      description: 'Connect with your existing tools for seamless compliance automation',
      features: [
        {
          icon: Cloud,
          title: 'Cloud Platforms',
          description: 'Native integrations with major cloud service providers',
          benefits: ['AWS integration', 'Azure AD sync', 'Google Workspace', 'Multi-cloud support'],
          stats: '50+ integrations',
          link: '/integrations'
        },
        {
          icon: Lock,
          title: 'Identity & Access',
          description: 'Seamless integration with identity management systems',
          benefits: ['Single sign-on', 'Role synchronization', 'Access monitoring', 'Compliance tracking'],
          stats: 'SSO ready',
          link: '/integrations#identity'
        },
        {
          icon: Server,
          title: 'Security Tools',
          description: 'Connect with your existing security infrastructure',
          benefits: ['SIEM integration', 'Vulnerability scanners', 'EDR platforms', 'Automated data collection'],
          stats: 'Real-time sync',
          link: '/integrations#security'
        },
        {
          icon: Link2,
          title: 'API & Webhooks',
          description: 'Flexible API for custom integrations and automation',
          benefits: ['REST API', 'Webhook support', 'Custom workflows', 'Developer resources'],
          stats: 'Full API access',
          link: '/integrations#api'
        }
      ]
    },
    subscription: {
      title: 'Subscription & Engagement',
      description: 'Automated features that keep you compliant and engaged long-term',
      features: [
        {
          icon: Activity,
          title: 'Automated Notifications',
          description: 'Multi-channel notification system with email, in-app, and browser notifications',
          benefits: ['Email notifications', 'In-app notifications', 'Browser alerts', 'Customizable preferences'],
          stats: 'Real-time alerts',
          link: '/notifications'
        },
        {
          icon: FileText,
          title: 'Periodic Reports',
          description: 'Automated monthly, quarterly, and custom compliance reports with executive summaries',
          benefits: ['Monthly reports', 'Quarterly summaries', 'Executive dashboards', 'Board-ready presentations'],
          stats: 'Automated delivery',
          link: '/reports/automated'
        },
        {
          icon: RefreshCw,
          title: 'Scheduled Assessments',
          description: 'Automated compliance assessments with configurable schedules and reminders',
          benefits: ['Quarterly assessments', 'Monthly checks', 'Custom schedules', 'Automated execution'],
          stats: 'Always current',
          link: '/assessments/scheduled'
        },
        {
          icon: Target,
          title: 'Compliance Health',
          description: 'Real-time compliance score tracking with predictive analytics and trend analysis',
          benefits: ['Health score tracking', 'Trend analysis', 'Predictive analytics', 'Risk forecasting'],
          stats: 'Real-time monitoring',
          link: '/dashboard/compliance-health'
        },
        {
          icon: Shield,
          title: 'Alert Management',
          description: 'Proactive deadline alerts, compliance reminders, and custom alert rules',
          benefits: ['Deadline alerts', 'Compliance reminders', 'Custom rules', 'Priority-based routing'],
          stats: 'Never miss deadlines',
          link: '/alerts'
        },
        {
          icon: Users,
          title: 'Progress Tracking',
          description: 'Advanced dashboards with milestone tracking, goal achievement, and analytics',
          benefits: ['Milestone tracking', 'Goal achievement', 'Performance analytics', 'Progress visualization'],
          stats: 'Stay on track',
          link: '/dashboard/progress'
        },
        {
          icon: Eye,
          title: 'Regulatory Intelligence',
          description: 'Automated regulatory update monitoring with impact analysis and recommendations',
          benefits: ['Regulatory updates', 'Impact analysis', 'Compliance recommendations', 'Change dashboard'],
          stats: 'Stay informed',
          link: '/regulatory'
        }
      ]
    }
  };

  const currentTab = platformCapabilities[activeTab as keyof typeof platformCapabilities];

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Page Header */}
      <section className="py-8 border-b border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Platform Capabilities</h1>
            <p className="text-muted-foreground mt-2">Explore the features and tools that make compliance automation possible</p>
          </div>
        </div>
      </section>

      {/* Platform Architecture Overview */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="section-title">
                How It All Works Together
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Integrated platform components for end-to-end compliance management
              </p>
            </div>

            {/* Platform Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {[
                { 
                  icon: FileSearch, 
                  title: 'Assess', 
                  description: 'Intelligent assessments identify gaps',
                  link: '/assessment'
                },
                { 
                  icon: Target, 
                  title: 'Plan', 
                  description: 'Personalized roadmaps with priorities',
                  link: '#planning'
                },
                { 
                  icon: Settings, 
                  title: 'Implement', 
                  description: 'Automated tools generate documentation',
                  link: '/toolkit'
                },
                { 
                  icon: Activity, 
                  title: 'Monitor', 
                  description: 'Continuous compliance tracking',
                  link: '#monitoring'
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <Card className="text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-md">
                    <CardContent className="p-8">
                      <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < 3 && (
                    <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Categories with Tabs */}
      <section className="py-24 bg-muted/20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {Object.entries(platformCapabilities).map(([key, tab]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:-translate-y-1 hover:shadow-lg ${
                    activeTab === key 
                      ? 'bg-primary text-primary-foreground shadow-xl scale-105' 
                      : 'bg-white dark:bg-background text-foreground hover:bg-gray-100 hover:bg-muted shadow-md'
                  }`}
                >
                  {key === 'platform' && <Layers className="w-4 h-4" />}
                  {key === 'assessments' && <FileSearch className="w-4 h-4" />}
                  {key === 'tools' && <Settings className="w-4 h-4" />}
                  {key === 'integration' && <Link2 className="w-4 h-4" />}
                  {key === 'subscription' && <Activity className="w-4 h-4" />}
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              <div className="text-center mb-16">
                <h3 className="text-2xl font-bold mb-4 text-foreground dark:text-foreground">
                  {currentTab.title}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {currentTab.description}
                </p>
              </div>

              <div className="grid gap-8">
                {currentTab.features.map((feature, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="grid lg:grid-cols-3 gap-0">
                        {/* Feature Details */}
                        <div className="lg:col-span-2 p-10">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                              <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-xl font-semibold mb-2 text-foreground dark:text-foreground">
                                {feature.title}
                              </h4>
                              <p className="text-muted-foreground mb-4">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                          <ul className="space-y-3 mb-6">
                            {feature.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start text-sm">
                                <CheckCircle className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



       {/* AI-Powered Features */}
      <section className="py-20 bg-muted/10 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
                🤖 AI-Powered Innovation
              </span>
              <h2 className="section-title">
                Artificial Intelligence That Works for You
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our AI doesn't just automate—it understands your unique environment and creates tailored compliance documentation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-surface dark:from-purple-900/20 dark:to-dark-surface p-8 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-foreground">Smart SSP Generation</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your existing policies and procedures. Our AI analyzes, maps, and generates a complete NIST 800-171 compliant SSP.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent mr-2" />
                    Understands technical context
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent mr-2" />
                    Maps existing controls automatically
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent mr-2" />
                    Identifies gaps and suggests content
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-surface dark:from-blue-900/20 dark:to-dark-surface p-8 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-foreground">Intelligent POA&M Creation</h3>
                <p className="text-muted-foreground mb-4">
                  Automatically generate Plans of Action & Milestones based on assessment findings with realistic timelines and resource estimates.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mr-2" />
                    Risk-based prioritization
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mr-2" />
                    Resource allocation suggestions
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mr-2" />
                    Milestone dependency tracking
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-dark-primary dark:to-dark-primary">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Experience the Complete Platform
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Start with an assessment and see how all platform features work together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-gray-900 hover:bg-gray-100 border-2 border-transparent shadow-lg font-semibold"
                onClick={handleStartAssessment}
              >
                Privacy Compliance Path
                <Eye className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/toolkit/gdpr-mapper">
                <Button variant="outline" className="bg-transparent text-white hover:bg-white/10 border-2 border-white/80 shadow-lg font-semibold">
                  Privacy Toolkit
                  <Database className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline"
                className="bg-transparent text-white hover:bg-white/10 border-2 border-white/80 shadow-lg font-semibold"
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

export default Features;
