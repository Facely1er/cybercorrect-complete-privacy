import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Shield,
  CheckCircle,
  ArrowLeft,
  Eye
} from 'lucide-react';

const ControlImplementationGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Button 
          variant="outline" 
          className="mb-8"
          onClick={() => navigate('/resources')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Button>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy Control Implementation Guide</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Step-by-step guide to implementing privacy controls across global regulations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Eye className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">NIST Privacy Framework Controls</h3>
              <p className="text-muted-foreground mb-4">
                Implement controls across the five privacy framework functions.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Identify Function Controls</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Govern Function Controls</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Control Function Controls</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                View NIST Controls
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">GDPR Implementation</h3>
              <p className="text-muted-foreground mb-4">
                Implement controls to meet GDPR requirements and demonstrate compliance.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Data Protection by Design</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Data Subject Rights</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Breach Notification</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                View GDPR Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Start Implementing Privacy Controls</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
            Begin with a privacy assessment to identify which controls need implementation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Start Privacy Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Control Library
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlImplementationGuide;