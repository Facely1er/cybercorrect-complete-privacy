import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AssessmentResults } from '../../components/assessment/AssessmentResults';
import { generateResultsPdf } from '../../utils/pdf';
import { Loader2, AlertTriangle, ArrowRight, Target } from 'lucide-react';
import { AssessmentFlowProgress } from '../../components/assessment/AssessmentFlowProgress';
import RecommendedJourney from '../../components/assessment/RecommendedJourney';
import GapPriorityCard from '../../components/gaps/GapPriorityCard';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useJourney } from '../../context/useJourney';

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
  return (
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
  );
};

export default PrivacyResults;