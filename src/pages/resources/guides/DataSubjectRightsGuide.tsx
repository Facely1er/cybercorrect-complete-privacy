import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Users,
  CheckCircle,
  ArrowLeft,
  Eye,
  RefreshCw,
  UserX,
  Database
} from 'lucide-react';

const DataSubjectRightsGuide = () => {
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
          <h1 className="text-4xl font-bold mb-4 text-foreground">Data Subject Rights Implementation Guide</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Implement and manage data subject rights under GDPR and other privacy regulations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Eye className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Right to Access</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enable individuals to access their personal data.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Implementation Guide
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <RefreshCw className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Right to Rectification</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Allow correction of inaccurate personal data.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Implementation Guide
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <UserX className="h-8 w-8 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Right to Erasure</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Handle "right to be forgotten" requests.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Implementation Guide
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Database className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Right to Portability</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enable data export in structured formats.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Implementation Guide
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Data Subject Rights Resources</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
            Access tools and templates for implementing data subject rights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Download Implementation Kit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSubjectRightsGuide;