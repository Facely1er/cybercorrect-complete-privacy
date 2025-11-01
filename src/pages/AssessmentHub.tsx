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


  // Compact page header (replaces hero)
  const headerSection = (
    <section className="py-8 border-b border-border bg-surface dark:bg-dark-bg">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Assessment Hub</h1>
          <p className="text-muted-foreground mt-2">Start your compliance journey with intelligent assessments and actionable insights</p>
        </div>
      </div>
    </section>
  );




  return (
    <div>
      {headerSection}
      <div className="container mx-auto px-4 py-8">

      {/* Privacy Assessment */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Privacy Assessment</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="relative overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-0 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <CardContent className="relative p-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-white" />
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
                <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-300 py-3">
                  Start Privacy Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Project Management Option */}
          <Card className="relative overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-0 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <CardContent className="relative p-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
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
                <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-300 py-3">
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
          <h2 className="text-3xl font-bold mb-4 text-foreground">Quick Privacy Tools</h2>
          <p className="text-muted-foreground">
            Fast tools for specific privacy compliance tasks
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link to="/toolkit/gdpr-mapper">
            <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-md cursor-pointer">
              <CardContent className="p-6 text-center">
                <Database className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Data Mapping</h3>
                <p className="text-sm text-muted-foreground">Quick privacy data processing mapping</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/toolkit/privacy-policy-generator">
            <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-md cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Policy Generator</h3>
                <p className="text-sm text-muted-foreground">Generate compliant privacy policies</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/toolkit/resources/viewers/dpia-template">
            <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-md cursor-pointer">
              <CardContent className="p-6 text-center">
                <Shield className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">DPIA Template</h3>
                <p className="text-sm text-muted-foreground">Data protection impact assessments</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-dark-surface border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-8 text-center">
            <Bell className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">95%</div>
            <p className="text-sm text-muted-foreground">Faster assessments</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-dark-surface border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">12+</div>
            <p className="text-sm text-muted-foreground">Frameworks covered</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-dark-surface border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-8 text-center">
            <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">Auto</div>
            <p className="text-sm text-muted-foreground">Report generation</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-dark-surface border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-8 text-center">
            <Shield className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">$0</div>
            <p className="text-sm text-muted-foreground">Penalties avoided</p>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      {/* Contextual help and navigation */}
      <div className="mt-10 bg-muted/30 dark:bg-muted/10 rounded-xl p-8">
        <div className="text-center mb-6">
          <AlertTriangle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2 text-foreground">Choose Your Starting Point</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Every privacy journey is unique. Choose the approach that best fits your organization's needs and current privacy maturity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-0">
            <CardContent className="p-6 text-center">
              <Eye className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Assessment First</h4>
              <p className="text-sm text-muted-foreground mb-4">Start with a comprehensive privacy assessment to understand your current posture</p>
              <InternalLink href="/assessments/privacy-assessment" variant="button" showIcon>
                Start Assessment
              </InternalLink>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 border-0">
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Team Project</h4>
              <p className="text-sm text-muted-foreground mb-4">Create a collaborative privacy implementation project with role-based workflows</p>
              <InternalLink href="/project" variant="button" showIcon>
                Create Project
              </InternalLink>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 border-0">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-10 w-10 text-green-600 mx-auto mb-4" />
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