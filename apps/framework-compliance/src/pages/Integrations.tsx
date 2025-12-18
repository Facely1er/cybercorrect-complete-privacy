import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, ArrowRight, Link2, Check, ExternalLink, Plug, Cloud, Lock, Shield, AlertTriangle, Server, Database, HelpCircle } from 'lucide-react';

import { Link } from 'react-router-dom';

import { toast } from '../components/ui/Toaster';

const Integrations = () => {

  
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  const integrationCategories = [
    {
      title: "Security Tools",
      description: "Connect with your existing security infrastructure",
      integrations: [
        { name: "CrowdStrike", icon: Shield, status: "Available", description: "Endpoint detection and response data" },
        { name: "SentinelOne", icon: Shield, status: "Available", description: "Endpoint security monitoring" },
        { name: "Microsoft Defender", icon: Shield, status: "Available", description: "Threat protection insights" },
        { name: "Carbon Black", icon: Shield, status: "Available", description: "Endpoint security platform" }
      ]
    },
    {
      title: "Cloud Platforms",
      description: "Integrate with major cloud service providers",
      integrations: [
        { name: "AWS", icon: Cloud, status: "Available", description: "Amazon Web Services security posture" },
        { name: "Azure", icon: Cloud, status: "Available", description: "Microsoft Azure compliance data" },
        { name: "Google Cloud", icon: Cloud, status: "Available", description: "Google Cloud Platform security metrics" },
        { name: "Oracle Cloud", icon: Cloud, status: "Available", description: "Oracle Cloud Infrastructure security" }
      ]
    },
    {
      title: "Identity & Access",
      description: "Connect to identity management systems",
      integrations: [
        { name: "Okta", icon: Lock, status: "Available", description: "Identity and access management" },
        { name: "Azure AD", icon: Lock, status: "Available", description: "Microsoft identity platform" },
        { name: "Ping Identity", icon: Lock, status: "Coming Soon", description: "Enterprise identity solutions" }
      ]
    },
    {
      title: "Vulnerability Management",
      description: "Import vulnerability data from scanning tools",
      integrations: [
        { name: "Tenable", icon: AlertTriangle, status: "Available", description: "Vulnerability scanning results" },
        { name: "Qualys", icon: AlertTriangle, status: "Available", description: "Vulnerability management data" },
        { name: "Rapid7", icon: AlertTriangle, status: "Coming Soon", description: "InsightVM vulnerability insights" }
      ]
    },
    {
      title: "DevOps Tools",
      description: "Integrate with development and operations platforms",
      integrations: [
        { name: "GitHub", icon: Server, status: "Available", description: "Code repository security scanning" },
        { name: "Jira", icon: Server, status: "Professional Services", description: "Issue tracking and management (Enterprise custom integration)" },
        { name: "Jenkins", icon: Server, status: "Coming Soon", description: "CI/CD security integration" }
      ]
    },
    {
      title: "Data Systems",
      description: "Connect to database and data storage systems",
      integrations: [
        { name: "Microsoft SQL", icon: Database, status: "Available", description: "SQL Server security assessment" },
        { name: "Oracle", icon: Database, status: "Coming Soon", description: "Oracle database security" },
        { name: "MongoDB", icon: Database, status: "Coming Soon", description: "NoSQL database security" }
      ]
    }
  ];

  const handleRequestCustomIntegration = () => {
    setShowRequestForm(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRequestForm(false);
    toast.success('Request Submitted', 'Our integration team will contact you shortly');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/features" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Features
        </Link>
        <h1 className="text-3xl font-bold mb-4 text-foreground">Integrations</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Connect CyberCorrect Privacy Platform with your existing tools and systems for seamless privacy and compliance management
        </p>
      </div>

      <div className="mb-12">
        <Card className="border-primary-teal">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Powerful Integration Framework</h2>
                <p className="text-muted-foreground mb-6">
                  Connect your existing privacy and IT tools with CyberCorrect Privacy Platform through our integration framework.
                  Import data automatically, synchronize configurations, and maintain a single source of truth for compliance.
                  Custom integrations available for Enterprise customers through professional services.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Bi-directional data synchronization</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Scheduled or real-time data imports</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Integration framework with comprehensive documentation</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Implementation support from our integration team</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Button onClick={handleRequestCustomIntegration}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Request Custom Integration
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-80 h-80">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-24 h-24 rounded-full bg-primary-teal/20 flex items-center justify-center">
                      <Plug className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  
                  {/* Connection lines and satellite icons */}
                  {[0, 60, 120, 180, 240, 300].map((degree, idx) => {
                    const radian = degree * Math.PI / 180;
                    const x = Math.cos(radian) * 120;
                    const y = Math.sin(radian) * 120;
                    const IconComponent = [Shield, Cloud, Lock, AlertTriangle, Server, Database][idx % 6];
                    
                    return (
                      <React.Fragment key={idx}>
                        <div 
                          className="absolute top-1/2 left-1/2 w-0.5 bg-gradient-to-r from-primary-teal/60 to-primary-teal/20"
                          style={{ 
                            transformOrigin: '0 0', 
                            transform: `rotate(${degree}deg)`, 
                            height: '120px'
                          }}
                        ></div>
                        <div 
                          className="absolute w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-primary-teal/30 flex items-center justify-center shadow-md"
                          style={{ 
                            top: `calc(50% + ${y}px)`, 
                            left: `calc(50% + ${x}px)`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showRequestForm && (
        <Card className="mb-8 border-primary-teal">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Request Custom Integration</h3>
            <form onSubmit={handleSubmitRequest}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name</label>
                  <input 
                    type="text"
                    id="integration-name"
                    name="name"
                    className="w-full rounded-md border-border bg-background py-2 px-3 text-sm"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email"
                    id="integration-email"
                    name="email"
                    className="w-full rounded-md border-border bg-background py-2 px-3 text-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Integration Type</label>
                  <select 
                    id="integration-type"
                    name="integrationType"
                    className="w-full rounded-md border-border bg-background py-2 px-3 text-sm"
                  >
                    <option value="">Select integration type...</option>
                    <option value="security">Security Tool</option>
                    <option value="cloud">Cloud Platform</option>
                    <option value="identity">Identity & Access</option>
                    <option value="vulnerability">Vulnerability Management</option>
                    <option value="devops">DevOps Tool</option>
                    <option value="data">Data System</option>
                    <option value="custom">Other (Custom)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Integration Details</label>
                  <textarea
                    id="integration-details"
                    name="details"
                    rows={4}
                    className="w-full rounded-md border-border bg-background py-2 px-3 text-sm"
                    placeholder="Describe the integration you need"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Available Integrations</h2>
        <div className="space-y-12">
          {integrationCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
              <p className="text-muted-foreground mb-6">{category.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.integrations.map((integration, integrationIndex) => (
                  <Card key={integrationIndex} className="hover:shadow-md transition-all border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-muted/30 rounded-lg">
                          <integration.icon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{integration.name}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              integration.status === 'Available' 
                                ? 'bg-success/10 text-success dark:bg-success/30 dark:text-success' 
                                : 'bg-warning/10 text-warning dark:bg-warning/30 dark:text-warning'
                            }`}>
                              {integration.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={integration.status !== 'Available'}
                          >
                            {integration.status === 'Available' ? 'Configure' : 'Coming Soon'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 bg-muted/30 dark:bg-muted/10 rounded-lg p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Need a Custom Integration?</h2>
            <p className="text-muted-foreground mb-6">
              Our integration team can build custom connectors for your organization's unique tools and systems.
              We'll work with you to understand your requirements and develop a seamless integration that fits your workflow.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleRequestCustomIntegration}>
                Request Custom Integration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a href="https://docs.cybercorrect.com/api" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  API Documentation
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
          
          <div className="md:w-1/3 flex justify-center">
            <div className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-2">Integration Support</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Our technical team is available to help with any integration questions or challenges.
                  </p>
                  <a href="mailto:integrations@cybercorrect.com" className="text-sm text-primary hover:underline">
                    integrations@cybercorrect.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
