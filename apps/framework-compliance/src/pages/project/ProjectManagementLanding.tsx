import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { usePageTitle } from '../../hooks/usePageTitle';
import {
  Target,
  Users,
  Calendar,
  Database,
  BarChart3,
  FileText,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ClipboardList,
  FolderKanban,
  Network,
  Shield,
  Milestone,
  Activity
} from 'lucide-react';
import './ProjectManagementLanding.css';

const ProjectManagementLanding = () => {
  usePageTitle('Privacy Project Management');

  const projectModules = [
    {
      id: 'dashboard',
      title: 'Project Dashboard',
      description: 'Central hub for monitoring project progress, team activities, and compliance health',
      icon: Activity,
      path: '/project/dashboard',
      color: 'from-blue-500 to-blue-600',
      features: ['Progress tracking', 'Team overview', 'Recent activity', 'Compliance score'],
      recommended: true
    },
    {
      id: 'roadmap',
      title: 'Privacy Roadmap',
      description: 'Plan and track your privacy implementation journey with milestones and deadlines',
      icon: Calendar,
      path: '/project/roadmap',
      color: 'from-purple-500 to-purple-600',
      features: ['Milestone planning', 'Timeline view', 'Dependency tracking', 'Progress visualization']
    },
    {
      id: 'wbs',
      title: 'Work Breakdown Structure',
      description: 'Break down complex privacy projects into manageable tasks and deliverables',
      icon: FolderKanban,
      path: '/project/wbs',
      color: 'from-green-500 to-green-600',
      features: ['Task hierarchy', 'Deliverable tracking', 'Effort estimation', 'Resource allocation']
    },
    {
      id: 'raci',
      title: 'RACI Matrix',
      description: 'Define roles and responsibilities for privacy compliance activities',
      icon: Users,
      path: '/project/raci',
      color: 'from-orange-500 to-orange-600',
      features: ['Role assignment', 'Responsibility mapping', 'Accountability tracking', 'Consultation flow']
    },
    {
      id: 'evidence',
      title: 'Evidence Vault',
      description: 'Centralized repository for compliance evidence, documentation, and audit trails',
      icon: Database,
      path: '/project/evidence',
      color: 'from-teal-500 to-teal-600',
      features: ['Document storage', 'Version control', 'Audit trail', 'Search & filter']
    }
  ];

  const projectBenefits = [
    {
      icon: Target,
      title: 'Structured Implementation',
      description: 'Follow proven methodologies for privacy compliance implementation'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Real-time visibility into project status and compliance metrics'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Assign tasks, track responsibilities, and collaborate effectively'
    },
    {
      icon: Shield,
      title: 'Audit Ready',
      description: 'Maintain comprehensive documentation and evidence for audits'
    }
  ];

  const quickStartSteps = [
    {
      step: 1,
      title: 'Create Project',
      description: 'Set up your privacy compliance project with basic details',
      icon: ClipboardList,
      action: 'Start Project',
      path: '/project/dashboard'
    },
    {
      step: 2,
      title: 'Define Roadmap',
      description: 'Plan milestones and set realistic timelines',
      icon: Milestone,
      action: 'Plan Roadmap',
      path: '/project/roadmap'
    },
    {
      step: 3,
      title: 'Assign Roles',
      description: 'Define who is responsible for what',
      icon: Users,
      action: 'Setup RACI',
      path: '/project/raci'
    },
    {
      step: 4,
      title: 'Execute & Track',
      description: 'Execute tasks and collect evidence',
      icon: Target,
      action: 'Track Progress',
      path: '/project/wbs'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <FolderKanban className="w-4 h-4" />
              <span className="text-sm font-medium">Privacy Project Management</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Manage Your Privacy
              <span className="block bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Compliance Projects
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Plan, execute, and track your privacy compliance initiatives with structured 
              project management tools designed for privacy professionals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/project/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg">
                  Open Project Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/project/roadmap">
                <Button size="lg" variant="outline" className="hover:bg-accent">
                  <Calendar className="mr-2 h-5 w-5" />
                  View Roadmap
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectBenefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modules */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Project Management Modules</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to manage every aspect of your privacy compliance project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {projectModules.map((module) => (
              <Card 
                key={module.id} 
                className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  module.recommended ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardContent className="p-6">
                  {module.recommended && (
                    <div className="flex items-center gap-1 text-primary text-xs font-medium mb-3">
                      <Sparkles className="h-3 w-3" />
                      Recommended Starting Point
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{module.title}</h3>
                  <p className="text-muted-foreground mb-4">{module.description}</p>

                  <div className="space-y-2 mb-6">
                    {module.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to={module.path}>
                    <Button className="w-full" variant={module.recommended ? 'default' : 'outline'}>
                      Open {module.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Quick Start Guide</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to set up and manage your privacy compliance project
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStartSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  {/* Connection Line */}
                  {index < quickStartSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0 connection-line"></div>
                  )}
                  
                  <Card className="relative z-10 h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      
                      <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                      
                      <Link to={step.path}>
                        <Button variant="outline" size="sm" className="w-full">
                          {step.action}
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integration with Toolkit */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/5 via-background to-secondary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-primary mb-4">
                    <Network className="h-5 w-5" />
                    <span className="font-medium">Integrated Workflow</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Seamlessly Connected to Your Toolkit
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Your project management activities are directly connected to the privacy toolkit. 
                    Assessment results, DPIA outputs, and compliance documentation automatically feed 
                    into your project evidence and progress tracking.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Link to="/toolkit">
                      <Button variant="outline">
                        <Target className="mr-2 h-4 w-4" />
                        Open Toolkit
                      </Button>
                    </Link>
                    <Link to="/assessments/privacy-assessment">
                      <Button variant="outline">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Start Assessment
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                      <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <span className="text-sm font-medium">Assessments</span>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                      <FileText className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <span className="text-sm font-medium">Documentation</span>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                      <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">DPIAs</span>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                      <Database className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                      <span className="text-sm font-medium">Evidence</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary dark:bg-dark-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Organize Your Privacy Compliance?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Start managing your privacy projects with structure, visibility, and control. 
            Your compliance journey begins here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/project/dashboard">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-lg font-semibold">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/resources">
              <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-white/10 border-2 border-white shadow-lg font-semibold">
                Read Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectManagementLanding;


