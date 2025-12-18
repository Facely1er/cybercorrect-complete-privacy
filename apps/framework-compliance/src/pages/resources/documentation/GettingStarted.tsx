import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowRight, 
  CheckCircle,
  FileText,
  Settings,
  BarChart3,
  Users,
  Lock,
  Activity,
  Bell
} from 'lucide-react';

const GettingStarted = () => {
  const navigate = useNavigate();
  const guides = [
    {
      title: "Platform Overview",
      description: "Learn about CyberCorrect's privacy compliance features and capabilities",
      steps: [
        "Privacy compliance platform overview",
        "Key privacy tools and features",
        "User interface basics",
        "Common privacy workflows"
      ],
      time: "15 mins",
      icon: Shield,
      path: "/documentation/platform-overview"
    },
    {
      title: "Privacy Assessment",
      description: "Complete your first privacy assessment using NIST Privacy Framework",
      steps: [
        "Privacy gap identification",
        "Compliance scoring across frameworks",
        "Privacy control evaluation",
        "Remediation planning"
      ],
      time: "30-45 mins",
      icon: FileText,
      path: "/assessments/privacy-assessment"
    },
    {
      title: "Privacy Tools Setup",
      description: "Get started with essential privacy compliance tools",
      steps: [
        "DPIA Generator setup",
        "Privacy Policy Generator",
        "Data mapping tools",
        "Privacy rights management"
      ],
      time: "30 mins",
      icon: Lock,
      path: "/toolkit"
    },
    {
      title: "Privacy Project Management",
      description: "Set up your privacy implementation project",
      steps: [
        "Create privacy project",
        "Define team roles (RACI)",
        "Set up implementation roadmap",
        "Configure evidence vault"
      ],
      time: "20 mins",
      icon: BarChart3,
      path: "/project"
    },
    {
      title: "Role-Based Journey",
      description: "Follow a guided journey based on your role",
      steps: [
        "Choose your role (DPO, Privacy Officer, etc.)",
        "View role-specific tools and workflows",
        "Follow phase-by-phase implementation",
        "Track your progress"
      ],
      time: "15 mins",
      icon: Users,
      path: "/documentation/getting-started"
    },
    {
      title: "Data Processing Mapping",
      description: "Map your data processing activities for GDPR Article 30 compliance",
      steps: [
        "Identify data processing activities",
        "Document legal basis",
        "Map data flows",
        "Create processing records"
      ],
      time: "45 mins",
      icon: Settings,
      path: "/toolkit/gdpr-mapper"
    },
    {
      title: "Subscription Features",
      description: "Set up automated privacy compliance monitoring and reporting",
      steps: [
        "Configure privacy compliance notifications",
        "Set up automated compliance reports",
        "Schedule privacy assessments",
        "Enable compliance health monitoring"
      ],
      time: "20 mins",
      icon: Bell,
      path: "/notifications"
    }
  ];

  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Getting Started with CyberCorrect Privacy Platform</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Follow these guides to set up and start using CyberCorrect for privacy compliance effectively
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((guide, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow dark:border-muted">
            <CardContent className="p-6">
              <guide.icon className="h-12 w-12 text-primary mb-4" />
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded-full">
                  Estimated time: {guide.time}
                </span>
              </div>

              <h3 className="text-xl font-semibold mb-2 text-foreground">{guide.title}</h3>
              <p className="text-muted-foreground mb-4">{guide.description}</p>

              <div className="space-y-2 mb-6">
                {guide.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-foreground">{step}</span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full"
                onClick={() => navigate(guide.path)}
              >
                Start Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="inline-block dark:border-muted">
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">
              Need help? Contact our support team for personalized assistance.
            </p>
            <Button variant="outline">Contact Support</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GettingStarted;
