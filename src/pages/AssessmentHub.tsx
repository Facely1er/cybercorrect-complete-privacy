import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

import { InternalLink} from '../components/ui/InternalLinkingHelper';

import { 
  Eye,
  Shield,
  Database, 
  Target,
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Bell,
  FileText,
  Users,
  BookOpen
} from 'lucide-react';

const AssessmentHub = () => {


  // Hero Section - moved outside container for full-width styling
  const heroSection = (
    <section className="relative section-padding overflow-hidden bg-gradient-to-br from-muted/30 via-background to-muted/30">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-8">
            <span className="hero-badge bg-primary/10 text-primary border border-primary/20">
              <Target className="w-4 h-4 mr-2" />
              Intelligent Assessments
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Assessment <span className="gradient-text">Hub</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Start your compliance journey with intelligent assessments that provide personalized roadmaps and actionable insights
          </p>
        </div>
      </div>
    </section>
  );




  return (
    <div>
      {heroSection}
      
      <div className="container mx-auto px-4 py-8">

      {/* Privacy Assessment */}
      <div className="mb-16">
        <h2 className="section-title">Privacy Assessment</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="card-hover-lift">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Comprehensive Privacy Assessment</h3>
                  <p className="text-muted-foreground">NIST Privacy Framework, GDPR, CCPA & Global Regulations</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Evaluate your privacy program against multiple global regulations with intelligent gap analysis and remediation planning.
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-foreground">What You'll Get:</h4>
                <div className="space-y-2">
                  {[
                    'Multi-regulation compliance scoring',
                    'Privacy gap analysis with priorities',
                    'Implementation roadmap and timeline',
                    'Role-based task assignments',
                    'Evidence requirements mapping',
                    'Audit-ready documentation'
                  ].map((outcome, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    30-45 minutes
                  </span>
                  <span className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    Comprehensive
                  </span>
                </div>
              </div>
              
              <Link to="/assessments/privacy-assessment">
                <Button size="lg" className="w-full">
                  Start Privacy Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Project Management Option */}
          <Card className="card-hover-lift">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Privacy Project Management</h3>
                  <p className="text-muted-foreground">Collaborative Implementation & Evidence Management</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Full project management suite with role-based collaboration, evidence management, and comprehensive project tracking.
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-foreground">Features Include:</h4>
                <div className="space-y-2">
                  {[
                    'Privacy implementation roadmap',
                    'RACI matrix for role assignments',
                    'Work breakdown structure (WBS)',
                    'Evidence vault and audit trail',
                    'Team collaboration tools',
                    'Progress tracking dashboard'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Link to="/project">
                <Button size="lg" variant="secondary" className="w-full">
                  Start Privacy Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Tools */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="section-title">Quick Privacy Tools</h2>
          <p className="text-muted-foreground">
            Fast tools for specific privacy compliance tasks
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link to="/toolkit/gdpr-mapper">
            <Card className="card-hover-lift cursor-pointer">
              <CardContent className="p-6 text-center">
                <Database className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Data Mapping</h3>
                <p className="text-sm text-muted-foreground">Quick privacy data processing mapping</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/toolkit/privacy-policy-generator">
            <Card className="card-hover-lift cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="h-10 w-10 text-success mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Policy Generator</h3>
                <p className="text-sm text-muted-foreground">Generate compliant privacy policies</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/toolkit/resources/viewers/dpia-template">
            <Card className="card-hover-lift cursor-pointer">
              <CardContent className="p-6 text-center">
                <Shield className="h-10 w-10 text-warning mx-auto mb-3" />
                <h3 className="font-semibold mb-2">DPIA Template</h3>
                <p className="text-sm text-muted-foreground">Data protection impact assessments</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20 hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Bell className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">95%</div>
            <p className="text-sm text-muted-foreground">Faster assessments</p>
          </CardContent>
        </Card>
        
        <Card className="bg-success/5 border-success/20 hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">12+</div>
            <p className="text-sm text-muted-foreground">Frameworks covered</p>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/5 border-secondary/20 hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">Auto</div>
            <p className="text-sm text-muted-foreground">Report generation</p>
          </CardContent>
        </Card>
        
        <Card className="bg-warning/5 border-warning/20 hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Shield className="h-8 w-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">$0</div>
            <p className="text-sm text-muted-foreground">Penalties avoided</p>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      {/* Contextual help and navigation */}
      <div className="mt-10 bg-muted/30 rounded-xl p-8">
        <div className="text-center mb-6">
          <AlertTriangle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2 text-foreground">Choose Your Starting Point</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Every privacy journey is unique. Choose the approach that best fits your organization's needs and current privacy maturity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-hover-lift">
            <CardContent className="p-6 text-center">
              <Eye className="h-10 w-10 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Assessment First</h4>
              <p className="text-sm text-muted-foreground mb-4">Start with a comprehensive privacy assessment to understand your current posture</p>
              <InternalLink href="/assessments/privacy-assessment" variant="button" showIcon>
                Start Assessment
              </InternalLink>
            </CardContent>
          </Card>
          
          <Card className="card-hover-lift">
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 text-secondary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Team Project</h4>
              <p className="text-sm text-muted-foreground mb-4">Create a collaborative privacy implementation project with role-based workflows</p>
              <InternalLink href="/project" variant="button" showIcon>
                Create Project
              </InternalLink>
            </CardContent>
          </Card>
          
          <Card className="card-hover-lift">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-10 w-10 text-success mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Learn First</h4>
              <p className="text-sm text-muted-foreground mb-4">Explore our comprehensive documentation and implementation guides</p>
              <InternalLink href="/documentation" variant="button" showIcon>
                Browse Guides
              </InternalLink>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AssessmentHub;