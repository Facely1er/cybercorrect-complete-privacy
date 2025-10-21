import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AssessmentResults } from '../../components/assessment/AssessmentResults';
import { generateResultsPdf } from '../../utils/generatePdf';

const PrivacyResults = () => {
  const navigate = useNavigate();
  
  // In a real application, this would be passed through the location state
  const mockResults = {
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
      mockResults.overallScore,
      mockResults.sectionScores,
      mockResults.completedDate,
      'privacy-assessment-results.pdf'
    );
  };

  const handleViewGapAnalysis = () => {
    navigate('/toolkit/privacy-gap-analyzer', {
      state: {
        assessmentResults: mockResults,
        frameworkType: 'nist_privacy_framework'
      }
    });
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Privacy Framework Assessment Results</h1>
      
      <AssessmentResults 
        data={mockResults}
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

      <div className="mt-8 flex justify-end">
        <div className="flex gap-4">
          <button
            onClick={handleViewGapAnalysis}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            View Gap Analysis
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
    </div>
  );
};

export default PrivacyResults;