import { useLocation, Navigate } from 'react-router-dom';
import { OrganizationalResults } from '../../components/assessment/OrganizationalResults';
import { generateOrganizationalRecommendations, determineOrganizationSize } from '../../utils/organizationalRecommendation';

interface AssessmentResults {
  overallScore: number;
  sectionScores: Array<{
    title: string;
    percentage: number;
    completed: boolean;
  }>;
  assessmentType: string;
  frameworkName: string;
  completedDate: string;
  answers: Record<string, string>;
}

interface LocationState {
  assessmentResults: AssessmentResults;
  assessmentMode?: string;
}

const PrivacyResultsOrganizational = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  // Redirect if no assessment results
  if (!state || !state.assessmentResults) {
    return <Navigate to="/assessment" replace />;
  }

  const { assessmentResults } = state;

  // Generate organizational recommendations
  const organizationSize = determineOrganizationSize(); // Can be enhanced to accept actual org context
  const recommendation = generateOrganizationalRecommendations(
    {
      overallScore: assessmentResults.overallScore,
      sectionScores: assessmentResults.sectionScores
    },
    organizationSize
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <OrganizationalResults
        recommendation={recommendation}
        overallScore={assessmentResults.overallScore}
        completedDate={assessmentResults.completedDate}
      />
    </div>
  );
};

export default PrivacyResultsOrganizational;

