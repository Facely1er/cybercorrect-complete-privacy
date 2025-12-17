import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AssessmentResults } from '../../components/assessment/AssessmentResults';
import { generateResultsPdf } from '../../utils/pdf';
import { Loader2, AlertTriangle, ArrowRight, Target } from 'lucide-react';
import { AssessmentFlowProgress } from '../../components/assessment/AssessmentFlowProgress';
import RecommendedTools from '../../components/assessment/RecommendedTools';
import RecommendedJourney from '../../components/assessment/RecommendedJourney';
import GapPriorityCard from '../../components/gaps/GapPriorityCard';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useJourney } from '../../context/JourneyContext';
import { generateGapsFromAssessment } from '../../utils/gapJourneyConfig';

const PrivacyResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const { setAssessmentResults, identifiedGaps, markGapStarted } = useJourney();
  
  // Get assessment results from location state, or use mock data as fallback
  const assessmentResults = location.state?.assessmentResults || {
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
  };

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
  useEffect(() => {
    if (assessmentResults && assessmentResults.sectionScores) {
      setAssessmentResults(assessmentResults);
    }
  }, [assessmentResults, setAssessmentResults]);

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
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Key Findings</h2>
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg">
            <h3 className="font-medium mb-2 text-foreground">Primary Risk Areas</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Data protection safeguards need improvement (60% compliance)</li>
              <li>Data processing controls require enhancement (65% compliance)</li>
              <li>Identification of privacy risks could be strengthened (73% compliance)</li>
            </ul>
          </div>
          
          <div className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg">
            <h3 className="font-medium mb-2 text-foreground">Strengths</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Strong governance structure for privacy (80% compliance)</li>
              <li>Good communication practices with data subjects (70% compliance)</li>
              <li>Effective inventory of data processing activities (part of 73% Identify compliance)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Personalized Role-Based Journey Recommendation */}
      <RecommendedJourney assessmentResults={assessmentResults} />

      {/* Personalized Tool Recommendations - Phase 3: Guided Action */}
      <RecommendedTools assessmentResults={assessmentResults} />

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