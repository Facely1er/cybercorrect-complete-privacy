import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Shield,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  Phone,
  Clock,
  FileText,
  Users
} from 'lucide-react';

const IncidentResponseGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Button 
          variant="outline" 
          className="mb-8"
          onClick={() => navigate('/documentation')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documentation
        </Button>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy Incident Response Guide</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive guide to handling privacy incidents and data breaches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <AlertTriangle className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Incident Classification</h3>
              <p className="text-muted-foreground mb-4">
                Learn how to classify and prioritize privacy incidents effectively.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Incident severity levels</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Data breach assessment</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Risk evaluation criteria</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Learn Classification
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Clock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Response Timeline</h3>
              <p className="text-muted-foreground mb-4">
                Understand regulatory timeframes and response requirements.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>GDPR 72-hour notification</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Individual notification requirements</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Documentation deadlines</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                View Timeline Requirements
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Privacy Incident Response Resources</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
            Access templates and tools for effective privacy incident response
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Download Response Templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Breach Procedures
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentResponseGuide;