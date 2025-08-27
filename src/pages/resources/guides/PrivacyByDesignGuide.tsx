import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Eye,
  CheckCircle,
  ArrowLeft,
  Settings,
  Shield,
  Target,
  Users
} from 'lucide-react';

const PrivacyByDesignGuide = () => {
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
          <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy by Design Implementation Guide</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Embed privacy protection into your systems and processes from the ground up
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Eye className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Design Principles</h3>
              <p className="text-muted-foreground mb-4">
                Learn the foundational principles of privacy by design.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Proactive not reactive</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Privacy as the default</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Full functionality</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Learn Principles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Settings className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Implementation Framework</h3>
              <p className="text-muted-foreground mb-4">
                Structured approach to implementing privacy by design.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Privacy impact assessments</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Data minimization strategies</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Privacy engineering</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                View Framework
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Implement Privacy by Design</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
            Start building privacy protection into your development lifecycle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Start Implementation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyByDesignGuide;