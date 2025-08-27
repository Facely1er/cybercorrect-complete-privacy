import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Clock,
  Phone,
  FileText,
  Globe
} from 'lucide-react';

const BreachNotificationGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Button 
          variant="outline" 
          className="mb-8"
          onClick={() => navigate('/guides')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Guides
        </Button>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Breach Notification Implementation Guide</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Implement compliant breach notification procedures for global privacy regulations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Clock className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">GDPR 72-Hour Rule</h3>
              <p className="text-muted-foreground mb-4">
                Meet the strict GDPR notification timeline requirements.
              </p>
              <Button variant="outline" className="w-full">
                Learn Requirements
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Phone className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Authority Notification</h3>
              <p className="text-muted-foreground mb-4">
                Properly notify data protection authorities.
              </p>
              <Button variant="outline" className="w-full">
                View Procedures
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Individual Notice</h3>
              <p className="text-muted-foreground mb-4">
                Communicate breaches to affected individuals.
              </p>
              <Button variant="outline" className="w-full">
                Get Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Breach Notification Resources</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
            Access comprehensive breach notification tools and templates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Download Notification Kit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreachNotificationGuide;