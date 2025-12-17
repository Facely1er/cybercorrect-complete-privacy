import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CollaborationSetup } from '../../components/assessment/CollaborationSetup';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CollaborativeAssessment = () => {
  const navigate = useNavigate();

  const handleStartCollaborative = (sessionId: string) => {
    // Navigate to the assessment page with the session ID
    navigate(`/assessment/collaborate/${sessionId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to="/assessment" 
          className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessments
        </Link>
      </div>
      
      <CollaborationSetup onStart={handleStartCollaborative} />
    </div>
  );
};

export default CollaborativeAssessment;

