import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  CheckCircle,
  ArrowLeft,
  FileText,
  Globe
} from 'lucide-react';

const IncidentReporting = () => {
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
          <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy Incident Reporting</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Guidelines for reporting privacy incidents to regulatory authorities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Globe className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Regulatory Requirements</h3>
              <p className="text-muted-foreground mb-4">
                Understand reporting requirements across different privacy regulations.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>GDPR reporting requirements</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>CCPA notification obligations</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Multi-jurisdiction compliance</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                View Requirements
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Reporting Templates</h3>
              <p className="text-muted-foreground mb-4">
                Access standardized templates for incident reporting.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Regulatory authority templates</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Individual notification templates</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Internal documentation forms</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Download Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Privacy Incident Response Resources</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
            Get prepared with comprehensive incident response documentation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Access Incident Response Kit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReporting;