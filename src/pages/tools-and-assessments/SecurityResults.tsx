import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AssessmentResults } from '../../components/assessment/AssessmentResults';
import { generateResultsPdf } from '../../utils/generatePdf';

const SecurityResults = () => {
  const navigate = useNavigate();
  
  const mockResults = {
    overallScore: 74,
    sectionScores: [
      { title: "Access Control", percentage: 78, completed: true },
      { title: "Security Awareness", percentage: 85, completed: true },
      { title: "Audit & Monitoring", percentage: 68, completed: true }
    ],
    assessmentType: 'security',
    frameworkName: "Enterprise Security Framework",
    completedDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };

  const handleExport = () => {
    generateResultsPdf(
      'Security Framework Assessment Results',
      mockResults.overallScore,
      mockResults.sectionScores,
      mockResults.completedDate,
      'security-assessment-results.pdf'
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Security Framework Assessment Results</h1>
      
      <AssessmentResults 
        data={mockResults as any}
        onExport={handleExport}
      />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Key Findings</h2>
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg">
            <h3 className="font-medium mb-2 text-foreground">Areas for Improvement</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Audit and monitoring practices need enhancement (68% compliance)</li>
              <li>Access control procedures require strengthening (78% compliance)</li>
            </ul>
          </div>
          
          <div className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg">
            <h3 className="font-medium mb-2 text-foreground">Strengths</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Strong security awareness and training program (85% compliance)</li>
              <li>Good foundation in access controls (78% compliance)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityResults;