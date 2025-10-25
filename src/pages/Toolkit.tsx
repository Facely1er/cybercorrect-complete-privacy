import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { InternalLink, ContextualCTA } from '../components/ui/InternalLinkingHelper';
import { 
  Shield, 
  FileText, 
  Database, 
  BarChart3, 
  Network, 
  Eye, 
  ArrowRight, 
  CheckCircle, 
  FileCheck, 
  AlertTriangle,
  Scale,
  Users,
  BookOpen
} from 'lucide-react';

const Toolkit = () => {
  // Main compliance tools organized by category
  const toolCategories = [
    {
      title: "Privacy Assessment Tools", 
      description: "Evaluate your privacy program against global regulations",
      tools: [
        {
          title: "Privacy Gap Analyzer",
          description: "Multi-regulation privacy assessment with gap identification",
          icon: BarChart3,
          path: "/toolkit/privacy-gap-analyzer",
          timeEstimate: "30 mins",
          complexity: "Advanced",
          features: ["Multi-regulation mapping", "Gap prioritization", "Risk assessment", "Remediation planning"]
        }
      ]
    },
    {
      title: "Privacy Documentation Tools",
      description: "Automate privacy documentation creation",
      tools: [
        {
          title: "Privacy Policy Generator",
          description: "Generate privacy policies for global regulations",
          icon: FileText,
          path: "/toolkit/privacy-policy-generator",
          timeEstimate: "15 mins",
          complexity: "Intermediate",
          features: ["Multi-regulation support", "Organization customization", "Template library", "Export formats"]
        },
        {
          title: "DPIA Generator",
          description: "Create Data Protection Impact Assessments",
          icon: FileCheck,
          path: "/toolkit/dpia-generator",
          timeEstimate: "20 mins",
          complexity: "Intermediate",
          features: ["Risk-based assessment", "Template library", "Stakeholder consultation", "Compliance validation"]
        }
      ]
    },
    {
      title: "Privacy Data Management",
      description: "Map and manage personal data processing activities",
      tools: [
        {
          title: "GDPR Data Mapper",
          description: "Map personal data processing for privacy compliance",
          icon: Database,
          path: "/toolkit/gdpr-mapper",
          timeEstimate: "25 mins",
          complexity: "Intermediate",
          features: ["Data processing mapping", "Legal basis tracking", "Rights management", "Article 30 compliance"]
        },
        {
          title: "Privacy Rights Manager",
          description: "Manage data subject rights requests and responses",
          icon: Users,
          path: "/toolkit/privacy-rights-manager",
          timeEstimate: "30 mins",
          complexity: "Intermediate",
          features: ['Request workflow management', 'Identity verification', 'Response automation', 'Comprehensive audit tracking']
        }
      ]
    }
  ];

  // Resource viewers and templates
  const resourceTools = [
    {
      title: "DPIA Template",
      description: "Data Protection Impact Assessment template",
      icon: Eye,
      path: "/toolkit/resources/viewers/dpia-template"
    },
    {
      title: "Privacy Notice Template",
      description: "GDPR/CCPA compliant privacy notice templates",
      icon: FileText,
      path: "/toolkit/resources/viewers/privacy-notice"
    },
    {
      title: "CCPA Policy Template",
      description: "California Consumer Privacy Act policy template",
      icon: Scale,
      path: "/toolkit/resources/viewers/ccpa-policy"
    },
    {
      title: "GDPR Checklist",
      description: "Comprehensive privacy compliance checklist",
      icon: CheckCircle,
      path: "/toolkit/resources/viewers/gdpr-checklist"
    },
    {
      title: "Data Processing Records",
      description: "Article 30 data processing record templates",
      icon: Database,
      path: "/toolkit/resources/viewers/data-processing-record"
    },
    {
      title: "Breach Notification Template",
      description: "Privacy breach notification templates and procedures",
      icon: AlertTriangle,
      path: "/toolkit/resources/viewers/breach-notification"
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Basic':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-foreground">Compliance Toolkit</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Comprehensive tools for assessment, documentation, and compliance management across multiple frameworks
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assessment Tools</p>
                <p className="text-2xl font-bold text-blue-600">1</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documentation Tools</p>
                <p className="text-2xl font-bold text-green-600">3</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mapping Tools</p>
                <p className="text-2xl font-bold text-purple-600">2</p>
              </div>
              <Network className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Templates</p>
                <p className="text-2xl font-bold text-orange-600">6</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tools */}
      <div className="space-y-12">
        {toolCategories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-foreground">{category.title}</h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {category.tools.map((tool, toolIndex) => (
                <Card key={toolIndex} className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mr-4">
                        <tool.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{tool.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getComplexityColor(tool.complexity)}`}>
                            {tool.complexity}
                          </span>
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                            {tool.timeEstimate}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">{tool.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 text-foreground">Key Features:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {tool.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Link to={tool.path}>
                      <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-300 py-3">
                        Launch {tool.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Resource Templates */}
      <div className="mt-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Resource Templates</h2>
          <p className="text-muted-foreground">Ready-to-use templates and checklists for compliance activities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resourceTools.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                    <resource.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{resource.title}</h3>
                </div>
                
                <p className="text-muted-foreground mb-4 text-sm">{resource.description}</p>
                
                <Link to={resource.path}>
                  <Button variant="outline" className="w-full hover:-translate-y-1 hover:bg-primary hover:text-white transition-all duration-300">
                    View Template
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <ContextualCTA currentPath="/toolkit" />
      
      {/* Additional contextual links */}
      <div className="mt-8 bg-muted/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InternalLink 
            href="/documentation/getting-started"
            className="block p-4 bg-background rounded-lg border hover:shadow-md transition-all no-underline"
          >
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-primary mr-2" />
              <span className="font-medium">Getting Started Guide</span>
            </div>
            <p className="text-sm text-muted-foreground">Learn platform basics</p>
          </InternalLink>
          
          <InternalLink 
            href="/roles/data-protection-officer"
            className="block p-4 bg-background rounded-lg border hover:shadow-md transition-all no-underline"
          >
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-primary mr-2" />
              <span className="font-medium">Role-Based Workflows</span>
            </div>
            <p className="text-sm text-muted-foreground">Tailored for your role</p>
          </InternalLink>
          
          <InternalLink 
            href="/support"
            className="block p-4 bg-background rounded-lg border hover:shadow-md transition-all no-underline"
          >
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-primary mr-2" />
              <span className="font-medium">Get Support</span>
            </div>
            <p className="text-sm text-muted-foreground">Expert assistance</p>
          </InternalLink>
        </div>
      </div>
    </div>
  );
};

export default Toolkit;