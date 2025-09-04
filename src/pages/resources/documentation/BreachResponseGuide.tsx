import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  AlertTriangle,
  ArrowLeft,
  Clock,
  FileText
} from 'lucide-react';

const BreachResponseGuide = () => {
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
          <h1 className="text-4xl font-bold mb-4 text-foreground">Data Breach Response Guide</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive guide for responding to personal data breaches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <AlertTriangle className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Detection & Assessment</h3>
              <p className="text-muted-foreground mb-4">
                Quickly identify and assess the scope of data breaches.
              </p>
              <Button variant="outline" className="w-full">
                Learn Detection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Clock className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">72-Hour Response</h3>
              <p className="text-muted-foreground mb-4">
                Meet GDPR's 72-hour notification requirements.
              </p>
              <Button variant="outline" className="w-full">
                View Timeline
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Documentation</h3>
              <p className="text-muted-foreground mb-4">
                Properly document all breach response activities.
              </p>
              <Button variant="outline" className="w-full">
                Get Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Data Breach Response Resources</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
            Access comprehensive breach response tools and templates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Download Breach Response Kit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreachResponseGuide;