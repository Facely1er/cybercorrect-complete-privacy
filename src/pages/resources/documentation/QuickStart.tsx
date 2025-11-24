import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Shield,
  CheckCircle,
  AlertTriangle,
  Settings,
  Users,
  Lock,
  Info,
  ArrowLeft
} from 'lucide-react';

const QuickStart = () => {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Choose Your Role",
      description: "Select your role to see personalized privacy compliance guidance",
      tasks: [
        "Identify your role (DPO, Privacy Officer, Legal Counsel, Data Steward)",
        "View role-specific journey",
        "Understand your responsibilities",
        "Access role-appropriate tools"
      ],
      icon: Users,
      status: "required",
      path: "/documentation/getting-started"
    },
    {
      title: "Privacy Assessment",
      description: "Complete your first privacy compliance assessment",
      tasks: [
        "Start Privacy Assessment",
        "Answer questions about your privacy practices",
        "Review compliance scores",
        "Get prioritized gap analysis"
      ],
      icon: Shield,
      status: "required",
      path: "/assessments/privacy-assessment"
    },
    {
      title: "Review Results & Recommendations",
      description: "Understand your privacy compliance status and next steps",
      tasks: [
        "Review compliance scores by framework",
        "Identify privacy gaps",
        "Prioritize remediation actions",
        "Access implementation recommendations"
      ],
      icon: AlertTriangle,
      status: "required",
      path: "/privacy-results"
    },
    {
      title: "Set Up Privacy Project",
      description: "Create a privacy implementation project to track your progress",
      tasks: [
        "Create privacy project",
        "Set up team roles (RACI matrix)",
        "Define implementation roadmap",
        "Configure evidence vault"
      ],
      icon: Settings,
      status: "recommended",
      path: "/project"
    },
    {
      title: "Explore Privacy Tools",
      description: "Get started with essential privacy compliance tools",
      tasks: [
        "Try DPIA Generator",
        "Use Privacy Policy Generator",
        "Map data processing activities",
        "Set up Privacy Rights Manager"
      ],
      icon: Shield,
      status: "recommended",
      path: "/toolkit"
    },
    {
      title: "Configure Compliance Monitoring",
      description: "Set up automated privacy compliance monitoring and reporting",
      tasks: [
        "Configure privacy compliance notifications",
        "Set up automated compliance reports",
        "Schedule privacy assessments",
        "Enable compliance health tracking"
      ],
      icon: Settings,
      status: "optional",
      path: "/notifications"
    }
  ];

  const tips = [
    "Start with your most critical data processing activities",
    "Involve privacy stakeholders (DPO, legal, IT)",
    "Be thorough in documenting data flows",
    "Prioritize high-risk privacy gaps first",
    "Regularly review and update your privacy documentation"
  ];

  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          className="mb-8"
          onClick={() => navigate('/documentation')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documentation
        </Button>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy Compliance Quick Start Guide</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get up and running with CyberCorrect Privacy Platform in 30 minutes or less
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative dark:border-muted">
              <div className="absolute -left-4 top-6 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center z-10">
                {index + 1}
              </div>
              
              <CardContent className="p-6 ml-8">
                <div className="flex items-center gap-2 mb-3">
                  <step.icon className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ml-auto ${
                    step.status === 'required' 
                      ? 'bg-destructive/10 dark:bg-destructive/20 text-destructive'
                      : step.status === 'recommended'
                      ? 'bg-warning/10 dark:bg-warning/20 text-warning'
                      : 'bg-muted dark:bg-muted/30 text-muted-foreground'
                  }`}>
                    {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                  </span>
                </div>

                <p className="text-muted-foreground mb-4">{step.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {step.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      <span className="text-foreground">{task}</span>
                    </div>
                  ))}
                </div>

                <Button onClick={() => navigate(step.path)} className="w-full sm:w-auto">
                  Start Step {index + 1}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-muted/30 dark:bg-muted/20 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <Info className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Pro Tips</h3>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button 
            variant="outline"
            onClick={() => navigate('/assessments/privacy-assessment')}
          >
            Start Privacy Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickStart;