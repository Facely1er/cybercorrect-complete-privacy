import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AssessmentResults } from '../../components/assessment/AssessmentResults';
import { generateResultsPdf } from '../../utils/pdf';
import { Loader2, AlertTriangle, ArrowRight, Target, Zap, TrendingUp, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { AssessmentFlowProgress } from '../../components/assessment/AssessmentFlowProgress';
import RecommendedJourney from '../../components/assessment/RecommendedJourney';
import GapPriorityCard from '../../components/gaps/GapPriorityCard';
import RecommendedTools from '../../components/assessment/RecommendedTools';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useJourney } from '../../context/useJourney';
import { JourneyLayout } from '../../layouts/JourneyLayout';

const PrivacyResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const { setAssessmentResults, identifiedGaps, markGapStarted } = useJourney();
  
  // Get assessment results from location state, or use mock data as fallback
  const assessmentResults = useMemo(() => location.state?.assessmentResults || {
    overallScore: 66,
    sectionScores: [
      { title: "Identify", percentage: 73, completed: true },
      { title: "Govern", percentage: 80, completed: true },
      { title: "Control", percentage: 65, completed: true },
      { title: "Communicate", percentage: 70, completed: true },
      { title: "Protect", percentage: 60, completed: true }
    ],
    assessmentType: 'privacy',
    frameworkName: "NIST Privacy Framework",
    completedDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }, [location.state?.assessmentResults]);

  const handleExport = () => {
    generateResultsPdf(
      'Privacy Framework Assessment Results',
      assessmentResults.overallScore,
      assessmentResults.sectionScores,
      assessmentResults.completedDate,
      'privacy-assessment-results.pdf'
    );
  };

  // Generate and save gaps when assessment results are loaded
  // If coming from a retake (fromRetake flag), preserve existing progress
  useEffect(() => {
    if (assessmentResults && assessmentResults.sectionScores) {
      const preserveProgress = location.state?.preserveProgress || false;
      setAssessmentResults(assessmentResults, preserveProgress);
    }
  }, [assessmentResults, setAssessmentResults, location.state?.preserveProgress]);

  const handleViewGapAnalysis = () => {
    setIsNavigating(true);
    navigate('/toolkit/privacy-gap-analyzer', {
      state: {
        assessmentResults: assessmentResults,
        frameworkType: 'nist_privacy_framework',
        fromAssessment: true
      }
    });
  };

  const handleStartGap = (gapId: string) => {
    markGapStarted(gapId);
    // Navigate to compliance page where gaps are displayed
    navigate('/compliance');
  };

  const handleViewCompliance = () => {
    navigate('/compliance');
  };

  // Calculate quick wins and impact analysis
  const quickWins = useMemo(() => {
    return assessmentResults.sectionScores
      ?.filter((s: { percentage: number }) => s.percentage >= 65 && s.percentage < 80)
      .map((section: { title: string; percentage: number }) => ({
        area: section.title,
        currentScore: section.percentage,
        potentialScore: Math.min(section.percentage + 15, 95),
        effort: 'Low',
        timeframe: '2-4 weeks',
        impact: 'Immediate compliance improvement'
      })) || [];
  }, [assessmentResults.sectionScores]);

  const getImpactMatrix = useMemo(() => {
    const sections = assessmentResults.sectionScores || [];
    return {
      criticalHighImpact: sections.filter((s: { percentage: number }) => s.percentage < 60),
      highImpactMediumEffort: sections.filter((s: { percentage: number }) => s.percentage >= 60 && s.percentage < 75),
      quickWins: sections.filter((s: { percentage: number }) => s.percentage >= 75 && s.percentage < 85),
      maintainExcellence: sections.filter((s: { percentage: number }) => s.percentage >= 85)
    };
  }, [assessmentResults.sectionScores]);

  return (
    <JourneyLayout>
      <div className="container mx-auto px-4 py-8">
        <AssessmentFlowProgress 
          currentStep="results" 
          assessmentResults={assessmentResults}
        />
        <h1 className="text-3xl font-bold mb-6 text-foreground">Privacy Framework Assessment Results</h1>
        
        <AssessmentResults 
          data={assessmentResults}
          onExport={handleExport}
      />
      
      {/* Quick Wins Section */}
      {quickWins.length > 0 && (
        <Card className="mt-8 border-success/30 bg-success/5">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-success" />
              Quick Wins: Low-Effort, High-Impact Actions
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              These areas are close to target - small improvements will yield significant compliance gains
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quickWins.map((win: { area: string; currentScore: number; potentialScore: number; effort: string; timeframe: string; impact: string }, index: number) => (
                <div key={index} className="bg-background border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{win.area}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{win.currentScore}%</span>
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-sm font-semibold text-success">{win.potentialScore}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Effort: </span>
                      <span className="font-medium text-foreground">{win.effort}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Timeframe: </span>
                      <span className="font-medium text-foreground">{win.timeframe}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Impact: </span>
                      <span className="font-medium text-success">{win.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Impact/Effort Matrix */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Impact vs. Effort Matrix
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Strategic view of where to focus your compliance efforts
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Critical/High Impact - Do First */}
            {getImpactMatrix.criticalHighImpact.length > 0 && (
              <div className="border-2 border-destructive/30 bg-destructive/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <h4 className="font-semibold text-foreground">Critical Priority</h4>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive font-medium">
                    DO FIRST
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">High impact, requires immediate attention</p>
                <ul className="space-y-2">
                  {getImpactMatrix.criticalHighImpact.map((section: { title: string; percentage: number }, idx: number) => (
                    <li key={idx} className="text-sm flex items-center justify-between">
                      <span className="text-foreground">{section.title}</span>
                      <span className="text-destructive font-medium">{section.percentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* High Impact, Medium Effort - Do Second */}
            {getImpactMatrix.highImpactMediumEffort.length > 0 && (
              <div className="border-2 border-warning/30 bg-warning/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-warning" />
                  <h4 className="font-semibold text-foreground">High Priority</h4>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-warning/20 text-warning font-medium">
                    PLAN & EXECUTE
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Moderate effort, significant impact</p>
                <ul className="space-y-2">
                  {getImpactMatrix.highImpactMediumEffort.map((section: { title: string; percentage: number }, idx: number) => (
                    <li key={idx} className="text-sm flex items-center justify-between">
                      <span className="text-foreground">{section.title}</span>
                      <span className="text-warning font-medium">{section.percentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Wins */}
            {getImpactMatrix.quickWins.length > 0 && (
              <div className="border-2 border-success/30 bg-success/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-5 w-5 text-success" />
                  <h4 className="font-semibold text-foreground">Quick Wins</h4>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-success/20 text-success font-medium">
                    LOW EFFORT
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Easy improvements with visible results</p>
                <ul className="space-y-2">
                  {getImpactMatrix.quickWins.map((section: { title: string; percentage: number }, idx: number) => (
                    <li key={idx} className="text-sm flex items-center justify-between">
                      <span className="text-foreground">{section.title}</span>
                      <span className="text-success font-medium">{section.percentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Maintain Excellence */}
            {getImpactMatrix.maintainExcellence.length > 0 && (
              <div className="border-2 border-primary/30 bg-primary/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Maintain Excellence</h4>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                    SUSTAIN
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Strong performance, continue monitoring</p>
                <ul className="space-y-2">
                  {getImpactMatrix.maintainExcellence.map((section: { title: string; percentage: number }, idx: number) => (
                    <li key={idx} className="text-sm flex items-center justify-between">
                      <span className="text-foreground">{section.title}</span>
                      <span className="text-primary font-medium">{section.percentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Tools Section */}
      <RecommendedTools assessmentResults={assessmentResults} />

      {/* Gap-Based Priority Action Plan */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Your Priority Action Plan
            </h2>
            <p className="text-muted-foreground mt-1">
              Address these gaps in order of priority to reduce compliance risk
            </p>
          </div>
          <Button onClick={handleViewCompliance} variant="outline">
            View Full Gap Analysis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Display identified gaps */}
        {identifiedGaps.length > 0 ? (
          <div className="space-y-6">
            {identifiedGaps.slice(0, 3).map((gap) => (
              <GapPriorityCard
                key={gap.id}
                gap={gap}
                onStartGap={handleStartGap}
                showTools={true}
              />
            ))}
            
            {identifiedGaps.length > 3 && (
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    {identifiedGaps.length - 3} more gaps identified. View your complete gap analysis to see all recommendations.
                  </p>
                  <Button onClick={handleViewCompliance}>
                    View All {identifiedGaps.length} Gaps
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="border-2 border-green-300">
            <CardContent className="p-6 text-center">
              <div className="text-green-600 text-4xl mb-2">🎉</div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Excellent Compliance Posture!
              </h3>
              <p className="text-muted-foreground">
                No critical gaps identified. Continue maintaining your compliance program.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Implementation Timeline */}
      <Card className="mt-8 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Suggested Implementation Timeline
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Recommended phased approach based on your assessment results
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getImpactMatrix.criticalHighImpact.length > 0 && (
              <div className="flex items-start gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="flex-shrink-0 w-20 text-center">
                  <div className="font-bold text-foreground">Week 1-4</div>
                  <div className="text-xs text-muted-foreground">Immediate</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Critical Gaps</h4>
                  <p className="text-sm text-muted-foreground">Address {getImpactMatrix.criticalHighImpact.length} critical area(s) to reduce immediate compliance risk</p>
                </div>
              </div>
            )}

            {quickWins.length > 0 && (
              <div className="flex items-start gap-4 p-4 bg-success/5 rounded-lg border border-success/20">
                <div className="flex-shrink-0 w-20 text-center">
                  <div className="font-bold text-foreground">Week 2-6</div>
                  <div className="text-xs text-muted-foreground">Short-term</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Quick Wins</h4>
                  <p className="text-sm text-muted-foreground">Complete {quickWins.length} near-complete area(s) for visible progress</p>
                </div>
              </div>
            )}

            {getImpactMatrix.highImpactMediumEffort.length > 0 && (
              <div className="flex items-start gap-4 p-4 bg-warning/5 rounded-lg border border-warning/20">
                <div className="flex-shrink-0 w-20 text-center">
                  <div className="font-bold text-foreground">Month 2-4</div>
                  <div className="text-xs text-muted-foreground">Medium-term</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">High-Impact Areas</h4>
                  <p className="text-sm text-muted-foreground">Systematically address {getImpactMatrix.highImpactMediumEffort.length} significant gap(s)</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex-shrink-0 w-20 text-center">
                <div className="font-bold text-foreground">Ongoing</div>
                <div className="text-xs text-muted-foreground">Continuous</div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">Monitor & Maintain</h4>
                <p className="text-sm text-muted-foreground">Regular assessments and continuous improvement of all areas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary: Role-Based Journey Recommendation (Collapsed by default) */}
      <details className="mt-8">
        <summary className="cursor-pointer p-4 bg-muted/30 dark:bg-muted/20 rounded-lg hover:bg-muted/50 transition-colors">
          <span className="font-semibold text-foreground">
            Optional: Browse Role-Based Guides
          </span>
          <span className="text-sm text-muted-foreground ml-2">
            (For teams with defined privacy roles)
          </span>
        </summary>
        <div className="mt-4">
          <RecommendedJourney assessmentResults={assessmentResults} />
        </div>
      </details>

      <div className="mt-8 flex justify-end">
        <div className="flex gap-4">
          <button
            onClick={handleViewGapAnalysis}
            disabled={isNavigating}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isNavigating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'View Gap Analysis'
            )}
          </button>
          <Link to="/privacy-recommendations">
            <button
              className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90 transition-colors"
            >
              View Detailed Recommendations
            </button>
          </Link>
        </div>
      </div>

      {/* Guardrail Disclaimer */}
      <div className="mt-8 bg-muted/50 border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground text-center">
          <AlertTriangle className="w-4 h-4 inline-block mr-2" />
          This tool assists with privacy compliance planning and documentation. It does not constitute legal advice.
        </p>
      </div>
    </div>
    </JourneyLayout>
  );
};

export default PrivacyResults;