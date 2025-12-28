import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Eye, 
  CheckCircle, 
  Clock, 
  Target,
  BarChart3,
  Users,
  FileText,
  Shield,
  Database,
  Building,
  Sparkles,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface AssessmentCustomization {
  overallScore: number;
  weakAreas: string[];
  strongAreas: string[];
  priorityLevel: 'critical' | 'high' | 'moderate' | 'maintenance';
  customSteps: { phase: string; focus: string; priority: 'high' | 'medium' | 'low' }[];
}

const DataProtectionOfficerJourney = () => {
  const location = useLocation();
  const assessmentResults = location.state?.assessmentResults;
  const customization: AssessmentCustomization | null = location.state?.customization;
  const fromAssessment = location.state?.fromAssessment;
  const journeySteps = [
    {
      phase: 'Assessment',
      title: 'Privacy Program Assessment',
      description: 'Evaluate current privacy posture against global regulations',
      duration: '2-3 weeks',
      tools: [
        { name: 'Privacy Assessment', path: '/assessments/privacy-assessment', icon: Eye },
        { name: 'Privacy Gap Analyzer', path: '/toolkit/privacy-gap-analyzer', icon: BarChart3 },
        { name: 'Privacy Risk Radar', path: '/toolkit/privacy-risk-radar', icon: Shield }
      ],
      outcomes: [
        'Multi-regulation compliance scoring',
        'Privacy gap analysis with priorities',
        'Risk-based remediation roadmap',
        'Regulatory requirement mapping'
      ]
    },
    {
      phase: 'Planning',
      title: 'Privacy Program Planning',
      description: 'Develop comprehensive privacy implementation plan',
      duration: '2-3 weeks',
      tools: [
        { name: 'Privacy Roadmap', path: '/project/roadmap', icon: Target },
        { name: 'RACI Matrix', path: '/project/raci', icon: Users }
      ],
      outcomes: [
        'Privacy implementation roadmap',
        'Role-based responsibility matrix',
        'Resource allocation plan',
        'Implementation timeline'
      ]
    },
    {
      phase: 'Documentation',
      title: 'Privacy Documentation Tools',
      description: 'Use tools to create privacy documentation and track activities',
      duration: '8-12 weeks (documentation and tracking)',
      tools: [
        { name: 'DPIA Manager', path: '/toolkit/dpia-manager', icon: Shield },
        { name: 'Data Mapping Tool', path: '/toolkit/gdpr-mapper', icon: Database },
        { name: 'Vendor Risk Assessment', path: '/toolkit/vendor-risk-assessment', icon: Building },
        { name: 'Service Provider Manager', path: '/toolkit/service-provider-manager', icon: Building }
      ],
      outcomes: [
        'DPIA documentation tools',
        'Data processing activity records',
        'Privacy documentation templates',
        'Vendor assessment tracking tools'
      ]
    },
    {
      phase: 'Dashboard',
      title: 'Privacy Dashboard and Evidence Management',
      description: 'Use dashboards to view compliance status and manage evidence',
      duration: 'Ongoing',
      tools: [
        { name: 'Evidence Vault', path: '/project/evidence', icon: Database },
        { name: 'Privacy Dashboard', path: '/project', icon: BarChart3 },
        { name: 'Service Provider Manager', path: '/toolkit/service-provider-manager', icon: Building },
        { name: 'Vendor Risk Assessment', path: '/toolkit/vendor-risk-assessment', icon: Building }
      ],
      outcomes: [
        'Compliance status dashboard',
        'Evidence storage and organization',
        'Documentation tracking',
        'Progress visualization tools'
      ]
    }
  ];

  const dpoCapabilities = [
    {
      icon: Eye,
      title: 'Privacy Program Documentation Tools',
      description: 'Tools to support privacy program documentation and tracking',
      features: ['Privacy strategy documentation templates', 'Regulatory requirement reference guides', 'Executive reporting templates', 'Stakeholder coordination tools']
    },
    {
      icon: Shield,
      title: 'DPIA Management Tools',
      description: 'Tools to manage DPIA documentation and workflow',
      features: ['DPIA documentation templates', 'Risk assessment data collection tools', 'Stakeholder consultation tracking', 'Approval workflow tools']
    },
    {
      icon: Users,
      title: 'Data Subject Rights Management Tools',
      description: 'Tools to track and manage data subject rights requests',
      features: ['Request tracking and workflow tools', 'Identity verification templates', 'Response coordination tools', 'SLA tracking (not monitoring)']
    },
    {
      icon: Database,
      title: 'Vendor Management Tools',
      description: 'Tools to track vendor assessments and agreements',
      features: ['Vendor risk assessment templates', 'Service provider tracking tools', 'DPA status tracking', 'Cross-border transfer documentation']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
        <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 bg-grid opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="bg-primary/10 text-primary dark:bg-dark-primary/10 dark:text-primary px-4 py-2 rounded-full inline-flex items-center text-sm font-medium">
                <Eye className="w-4 h-4 mr-2" />
                Privacy Leadership Journey
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground dark:text-foreground">
              Your Privacy <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">Leadership</span> Journey
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              A structured path for leading your organization's privacy program with phase-based guidance and comprehensive tools
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessments/privacy-assessment">
                <Button size="lg" variant="default">
                  Start Privacy Assessment
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/project">
                <Button size="lg" variant="outline" className="hover:-translate-y-1 transition-transform">
                  Create Privacy Project
                  <Target className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Assessment Banner - Shows when coming from assessment */}
      {fromAssessment && customization && (
        <section className="py-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="border-2 border-primary/20 bg-white/80 dark:bg-background/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">Your Personalized DPO Journey</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          customization.priorityLevel === 'critical' ? 'bg-destructive/10 text-destructive' :
                          customization.priorityLevel === 'high' ? 'bg-warning/10 text-warning' :
                          customization.priorityLevel === 'moderate' ? 'bg-primary/10 text-primary' :
                          'bg-success/10 text-success'
                        }`}>
                          {customization.priorityLevel === 'critical' ? 'Critical Priority' :
                           customization.priorityLevel === 'high' ? 'High Priority' :
                           customization.priorityLevel === 'moderate' ? 'Moderate Priority' : 'Maintenance Mode'}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Based on your assessment score of <strong className="text-foreground">{customization.overallScore}%</strong>, 
                        we've customized your journey to focus on your specific compliance gaps.
                      </p>
                      
                      {customization.customSteps.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-warning" />
                            Priority Focus Areas:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {customization.weakAreas.map((area, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-warning/10 text-warning text-sm rounded-full border border-warning/20"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {customization.strongAreas.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-success" />
                            Your Strengths:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {customization.strongAreas.map((area, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-success/10 text-success text-sm rounded-full border border-success/20"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Baseline Tasks Section */}
      <section className="py-16 bg-gray-50 bg-muted/5 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-3 text-foreground dark:text-foreground">
                Baseline Tasks for All Roles
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                These foundational tasks are common to all privacy professionals, regardless of role
              </p>
            </div>
            <Card className="bg-white dark:bg-background">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-2" />
                      Assessment & Analysis
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Complete Privacy Assessment to understand current compliance posture</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Use Privacy Gap Analyzer to identify compliance gaps</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Review compliance scores across GDPR, CCPA, and other frameworks</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-2" />
                      Monitoring & Documentation
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Monitor compliance status via Privacy Dashboard</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Maintain evidence documentation in Evidence Vault</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Use GDPR Mapper to understand data processing activities</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Journey Steps */}
      <section className="py-20 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-foreground">
                Your Privacy Leadership Journey
              </h2>
              <p className="text-xl text-muted-foreground mb-4">
                {fromAssessment 
                  ? 'Steps prioritized based on your assessment results' 
                  : 'Four phases using privacy compliance tools'}
              </p>
              <p className="text-base text-muted-foreground italic">
                As a DPO, you use these tools to support strategic privacy initiatives and documentation
              </p>
            </div>

            <div className="space-y-12">
              {journeySteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="lg:w-1/3">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm text-primary font-medium">{step.phase}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-foreground">{step.title}</h3>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {step.duration}
                      </div>
                    </div>
                    
                    <div className="lg:w-2/3">
                      <Card className="mb-4">
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-4">Tools & Resources</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {step.tools.map((tool, toolIndex) => (
                              <Link key={toolIndex} to={tool.path} className="block">
                                <div className="flex items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                  <tool.icon className="w-5 h-5 text-primary mr-3" />
                                  <span className="font-medium">{tool.name}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                          
                          <h4 className="font-semibold mb-3">Key Outcomes</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {step.outcomes.map((outcome, outcomeIndex) => (
                              <div key={outcomeIndex} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{outcome}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {index < journeySteps.length - 1 && (
                    <div className="flex justify-center my-8">
                      <div className="w-0.5 h-8 bg-muted"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DPO Capabilities */}
      <section className="py-20 bg-gray-50 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-foreground">
                DPO Documentation and Tracking Tools
              </h2>
              <p className="text-xl text-muted-foreground mb-4">
                Tools to support strategic privacy program documentation and tracking
              </p>
              <p className="text-base text-muted-foreground italic max-w-3xl mx-auto">
                While all roles use baseline assessment and dashboard tools, DPOs use these tools to support 
                strategic privacy program documentation, tracking, and coordination
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dpoCapabilities.map((capability, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <capability.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{capability.title}</h3>
                    <p className="text-muted-foreground mb-4">{capability.description}</p>
                    <ul className="space-y-2">
                      {capability.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-primary dark:bg-dark-primary">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Lead Your Privacy Program?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Start with our comprehensive privacy assessment and build your global compliance strategy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessments/privacy-assessment" className="no-underline">
                <Button className="bg-white text-primary hover:bg-gray-100 shadow-lg font-semibold">
                  Start Privacy Assessment
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/project" className="no-underline">
                <Button variant="outline" className="bg-transparent text-white hover:bg-white/10 border-2 border-white shadow-lg font-semibold">
                  Create Privacy Project
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

export default DataProtectionOfficerJourney;
