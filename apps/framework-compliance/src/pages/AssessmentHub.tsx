import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { InternalLink} from '../components/ui/InternalLinkingHelper';
import { usePageTitle } from '../hooks/usePageTitle';
import RecommendedTools from '../components/assessment/RecommendedTools';
import { secureStorage } from '../utils/storage';

import { 
  Eye,
  Shield,
  Target,
  ArrowRight, 
  CheckCircle, 
  Clock,
  Bell,
  FileText,
  BookOpen
} from 'lucide-react';

const AssessmentHub = () => {
  usePageTitle('Assessment');
  const location = useLocation();
  const [assessmentResults, setAssessmentResults] = useState<any>(null);

  // Check for assessment results from location state or storage
  useEffect(() => {
    // First check location state (if coming from assessment completion)
    if (location.state?.assessmentResults) {
      setAssessmentResults(location.state.assessmentResults);
      // Also save to storage for future visits
      secureStorage.setItem('last_privacy_assessment_results', location.state.assessmentResults);
    } else {
      // Check storage for previous assessment results
      const storedResults = secureStorage.getItem('last_privacy_assessment_results');
      if (storedResults) {
        setAssessmentResults(storedResults);
      }
    }
  }, [location.state]);

  return (
    <div>
      <div className="container mx-auto px-4 py-8">

      {/* Personalized Recommendations - Phase 3: Guided Action */}
      {assessmentResults && (
        <div className="mb-12">
          <RecommendedTools assessmentResults={assessmentResults} />
        </div>
      )}

      {/* Privacy Assessment - Main Card */}
      <div className="mb-16">
        <div className="max-w-3xl mx-auto">
          <Card className="relative overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-0 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <CardContent className="relative p-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Privacy Framework Assessment</h3>
                  <p className="text-muted-foreground">NIST Privacy Framework</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Evaluate your privacy program against the NIST Privacy Framework with intelligent gap analysis and remediation planning.
              </p>
              
              {/* Phase 2: Light signup messaging */}
              <div className="mb-6 p-3 bg-success/10 border border-success/20 rounded-lg">
                <p className="text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 inline mr-2 text-success" />
                  <strong>Free to start</strong> - No credit card required. Get your privacy posture score in minutes.
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-foreground">What You'll Get:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    'NIST Privacy Framework compliance scoring',
                    'Privacy gap analysis with priorities',
                    'Implementation roadmap and timeline',
                    'Role-based task assignments',
                    'Evidence requirements mapping',
                    'Audit-ready documentation'
                  ].map((outcome, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
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
              
              <div className="flex flex-col gap-3">
                <Link to="/assessments/privacy-assessment">
                  <Button size="lg" variant="default" className="w-full">
                    Start Privacy Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/assessments/collaborative">
                  <Button size="lg" variant="outline" className="w-full">
                    Start Collaborative Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-background dark:from-primary/20 dark:to-dark-surface border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-8 text-center">
            <Bell className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">30-45</div>
            <p className="text-sm text-muted-foreground">Minutes to complete</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-success/10 to-background dark:from-success/20 dark:to-dark-surface border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">5+</div>
            <p className="text-sm text-muted-foreground">Privacy frameworks</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent/10 to-background dark:from-accent/20 dark:to-dark-surface border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-8 text-center">
            <FileText className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">Auto</div>
            <p className="text-sm text-muted-foreground">Report generation</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-warning/10 to-background dark:from-warning/20 dark:to-dark-surface border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-8 text-center">
            <Shield className="h-8 w-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">30</div>
            <p className="text-sm text-muted-foreground">Assessment questions</p>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      {/* Contextual help and navigation */}
      <div className="mt-10 bg-muted/30 dark:bg-muted/10 rounded-xl p-8">
        <div className="text-center mb-6">
          <Target className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2 text-foreground">Next Steps After Assessment</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Complete your privacy assessment, then leverage these resources to implement your compliance roadmap.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-0">
            <CardContent className="p-6 text-center">
              <Eye className="h-10 w-10 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Start Assessment</h4>
              <p className="text-sm text-muted-foreground mb-4">Begin with a comprehensive privacy assessment to understand your current posture</p>
              <InternalLink href="/assessments/privacy-assessment" variant="button" showIcon>
                Start Assessment
              </InternalLink>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 border-0">
            <CardContent className="p-6 text-center">
              <Target className="h-10 w-10 text-accent mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Gap Analysis</h4>
              <p className="text-sm text-muted-foreground mb-4">Identify and prioritize compliance gaps with actionable remediation steps</p>
              <InternalLink href="/toolkit/privacy-gap-analyzer" variant="button" showIcon>
                Analyze Gaps
              </InternalLink>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 border-0">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-10 w-10 text-success mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Learn More</h4>
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