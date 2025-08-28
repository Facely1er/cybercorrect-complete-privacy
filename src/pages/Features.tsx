import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Shield, FileText, ChevronRight, CheckCircle, Info, Users, BarChart3, Lock, Award, Settings, Database, Network, Layers, Lightbulb, Cloud, Fingerprint, RefreshCw, ArrowRight, Server, Bell, Eye, Scale, Briefcase, UserCheck, Building2, FileSearch, Activity, Target, Zap, Link2, Download, Calendar, Building, Globe } from 'lucide-react';

const Features = () => {
  const [activeTab, setActiveTab] = useState('platform');
  const navigate = useNavigate();

  // Handler functions
  const handleStartAssessment = () => {
    navigate('/assessments/privacy-assessment');
  };

  const handleGuideMe = () => {
    navigate('/guide');
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
          link: '/assessments/cui-assessment'
        },
        {
          icon: Shield,
          title: 'CUI Protection Suite',
          description: 'Complete NIST SP 800-171 and CMMC 2.0 compliance platform',
          benefits: ['CUI data flow mapping', 'SSP generation', 'POA&M automation', 'Continuous monitoring'],
          link: '/cui-assessment'
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
          stats: '25 min average',
          link: '/assessments/privacy-assessment'
        },
        {
          icon: Shield,
          title: 'CUI Compliance Assessment',
          description: 'Complete NIST SP 800-171 and CMMC 2.0 readiness evaluation',
          benefits: ['110 control evaluation', 'CMMC level scoring', 'Gap identification', 'Implementation guidance'],
          stats: '30 min average',
          link: '/assessments/cui-assessment'
        },
        {
          icon: Scale,
          title: 'Multi-Framework Assessment',
          description: 'Single assessment mapped to SOC 2, ISO 27001, NIST, and more',
          benefits: ['12+ frameworks covered', 'Common controls mapping', 'Unified reporting', 'Compliance orchestration'],
          stats: '45 min average',
          link: '/toolkit/compliance-gap-analyzer'
        },
        {
          icon: Target,
          title: 'Risk & Gap Analysis',
          description: 'Comprehensive compliance gap identification and prioritization',
          benefits: ['Risk-based prioritization', 'Cost-benefit analysis', 'Timeline planning', 'Resource allocation'],
          stats: 'Instant results',
          link: '/toolkit/compliance-gap-analyzer'
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
          stats: '95% faster',
          link: '/toolkit/resources/viewers/dpia-template'
        },
        {
          icon: FileText,
          title: 'Policy Generator',
          description: 'Automated policy and procedure generation for multiple frameworks',
          benefits: ['Industry-specific templates', 'Regulatory compliance', 'Version control', 'Approval workflows'],
          stats: '80% time savings',
          link: '/toolkit/policy-generator'
        },
        {
          icon: Database,
          title: 'CUI Data Flow Mapper',
          description: 'Visual mapping and documentation of Controlled Unclassified Information flows',
          benefits: ['Interactive visualization', 'NIST 800-171 alignment', 'Export capabilities', 'Audit documentation'],
          stats: 'CMMC ready',
          link: '/toolkit/cui-mapper'
        },
        {
          icon: FileSearch,
          title: 'Evidence Vault',
          description: 'Centralized repository for compliance evidence and documentation',
          benefits: ['Organized storage', 'Audit-ready reports', 'Version tracking', 'Secure sharing'],
          stats: 'Audit ready',
          link: '/app/document-vault'
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
    }
  };

  const currentTab = platformCapabilities[activeTab as keyof typeof platformCapabilities];

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 bg-grid opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-8">
              <span className="bg-blue-100 text-blue-700 dark:bg-dark-primary/10 dark:text-dark-primary px-6 py-3 rounded-full inline-flex items-center text-sm font-semibold tracking-wide uppercase animate-fade-in">
                <Award className="w-4 h-4 mr-2" />
                Complete Compliance Platform
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground dark:text-dark-text">
              Platform <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">Capabilities</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Explore the comprehensive features and tools that make compliance automation possible
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/assessments/privacy-assessment">
                <Button size="lg" className="enhanced-button bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold">
                  Start Assessment
                  <FileSearch className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/toolkit">
                <Button size="lg" variant="outline" className="hover:-translate-y-1 transition-transform px-8 py-4 text-lg font-semibold">
                  Explore Tools
                  <Settings className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Architecture Overview */}
      <section className="py-24 bg-white dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
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
                  link: '/assessment-hub'
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
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
      <section className="py-24 bg-muted/20 dark:bg-dark-support/5">
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
                      ? 'bg-blue-600 text-white shadow-xl scale-105' 
                      : 'bg-white dark:bg-dark-surface text-foreground hover:bg-gray-100 dark:hover:bg-dark-support shadow-md'
                  }`}
                >
                  {key === 'platform' && <Layers className="w-4 h-4" />}
                  {key === 'assessments' && <FileSearch className="w-4 h-4" />}
                  {key === 'tools' && <Settings className="w-4 h-4" />}
                  {key === 'integration' && <Link2 className="w-4 h-4" />}
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              <div className="text-center mb-16">
                <h3 className="text-2xl font-bold mb-4 text-foreground dark:text-dark-text">
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
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                              <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-xl font-semibold mb-2 text-foreground dark:text-dark-text">
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
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
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
      <section className="py-20 bg-muted/10 dark:bg-dark-support/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
                🤖 AI-Powered Innovation
              </span>
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-dark-text">
                Artificial Intelligence That Works for You
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our AI doesn't just automate—it understands your unique environment and creates tailored compliance documentation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-surface dark:from-purple-900/20 dark:to-dark-surface p-8 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-dark-text">Smart SSP Generation</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your existing policies and procedures. Our AI analyzes, maps, and generates a complete NIST 800-171 compliant SSP.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                    Understands technical context
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                    Maps existing controls automatically
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                    Identifies gaps and suggests content
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-surface dark:from-blue-900/20 dark:to-dark-surface p-8 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground dark:text-dark-text">Intelligent POA&M Creation</h3>
                <p className="text-muted-foreground mb-4">
                  Automatically generate Plans of Action & Milestones based on assessment findings with realistic timelines and resource estimates.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                    Risk-based prioritization
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                    Resource allocation suggestions
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                    Milestone dependency tracking
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-dark-primary dark:to-dark-primary">
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
                className="bg-white text-blue-600 hover:bg-gray-100 border-2 border-white font-semibold shadow-lg"
                onClick={handleStartAssessment}
              >
                Privacy Compliance Path
                <Eye className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/assessments/security-assessment">
                <Button className="bg-white text-green-600 hover:bg-gray-100 border-2 border-white font-semibold shadow-lg">
                  Security Compliance Path
                  <Database className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                className="bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900 font-semibold shadow-lg"
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