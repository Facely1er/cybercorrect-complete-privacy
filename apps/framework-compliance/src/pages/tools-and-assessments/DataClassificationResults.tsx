import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AssessmentResults } from '../../components/assessment/AssessmentResults';
import { generateResultsPdf } from '../../utils/pdf';

const DataClassificationResults = () => {
  const navigate = useNavigate();
  
  // In a real application, this would be passed through the location state
  const mockResults = {
    overallScore: 71,
    sectionScores: [
      { title: "Access Control", percentage: 78, completed: true },
      { title: "Awareness & Training", percentage: 85, completed: true },
      { title: "Audit & Accountability", percentage: 68, completed: true },
      { title: "Configuration Management", percentage: 72, completed: true },
      { title: "Identification & Authentication", percentage: 82, completed: true },
      { title: "Incident Response", percentage: 65, completed: true },
      { title: "Maintenance", percentage: 70, completed: true },
      { title: "Media Protection", percentage: 75, completed: true },
      { title: "Personnel Security", percentage: 80, completed: true },
      { title: "Physical Protection", percentage: 76, completed: true },
      { title: "Risk Assessment", percentage: 60, completed: true },
      { title: "Security Assessment", percentage: 55, completed: true },
      { title: "System & Communications Protection", percentage: 68, completed: true },
      { title: "System & Information Integrity", percentage: 62, completed: true }
    ],
    assessmentType: 'cui',
    frameworkName: "NIST SP 800-171 CUI Protection",
    completedDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };

  const handleExport = () => {
    generateResultsPdf(
      'Privacy Assessment Results',
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
        frameworkType: 'nist_800_171'
      }
    });
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Privacy Assessment Results</h1>
      
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
              <li>Security Assessment practices need improvement (55% compliance)</li>
              <li>Risk Assessment procedures require enhancement (60% compliance)</li>
              <li>System & Information Integrity controls have gaps (62% compliance)</li>
            </ul>
          </div>
          
          <div className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg">
            <h3 className="font-medium mb-2 text-foreground">Strengths</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Strong awareness and training program (85% compliance)</li>
              <li>Solid identification and authentication controls (82% compliance)</li>
              <li>Effective personnel security measures (80% compliance)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Compliance Status</h2>
        <div className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg">
          <p className="text-muted-foreground mb-4">
            With an overall compliance score of 71%, your organization has established a good foundation for CUI protection but still has gaps that need to be addressed to reach full compliance with NIST SP 800-171 requirements.
          </p>
          <p className="text-muted-foreground">
            Review the detailed recommendations to identify specific actions needed to improve your compliance posture and better protect controlled unclassified information within your environment.
          </p>
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

export default DataClassificationResults;
