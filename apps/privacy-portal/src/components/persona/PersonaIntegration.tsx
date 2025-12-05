import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersona } from '../../hooks/usePersona';
import { useAuth } from '../../hooks/useAuthContext';
import { PersonaDashboard } from './PersonaDashboard';
import { PersonaGuidanceSystem } from './PersonaGuidanceSystem';
import { PersonaOnboarding } from './PersonaOnboarding';
import { PersonaNavigation } from './PersonaNavigation';
import { PersonaBreadcrumb } from './PersonaNavigation';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Users, 
  Briefcase, 
  Shield, 
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Settings
} from 'lucide-react';

interface PersonaIntegrationProps {
  children?: React.ReactNode;
  showNavigation?: boolean;
  showBreadcrumb?: boolean;
}

export const PersonaIntegration: React.FC<PersonaIntegrationProps> = ({
  children,
  showNavigation = true,
  showBreadcrumb = true
}) => {
  const { currentPersona, isLoading, error } = usePersona();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user needs onboarding
    if (currentPersona && isAuthenticated) {
      const hasCompletedOnboarding = localStorage.getItem(`onboarding_${currentPersona.id}_completed`);
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [currentPersona, isAuthenticated]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your personalized experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Configuration Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentPersona) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Persona Not Found</h2>
          <p className="text-muted-foreground mb-4">
            We couldn't determine your user type. Please contact support.
          </p>
          <Button onClick={() => navigate('/contact')}>
            Contact Support
          </Button>
        </Card>
      </div>
    );
  }

  if (showOnboarding) {
    return <PersonaOnboarding />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Persona Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-${currentPersona.color}-100 dark:bg-${currentPersona.color}-900/30`}>
                {currentPersona.id === 'worker' && <Users className="h-6 w-6 text-blue-600" />}
                {currentPersona.id === 'job_prospect' && <Briefcase className="h-6 w-6 text-green-600" />}
                {currentPersona.id === 'hr_staff' && <Users className="h-6 w-6 text-purple-600" />}
                {currentPersona.id === 'dpo' && <Shield className="h-6 w-6 text-red-600" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{currentPersona.displayName} Portal</h1>
                <p className="text-muted-foreground">{currentPersona.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {currentPersona.estimatedTimeCommitment}
              </Badge>
              <Badge variant="outline">
                <Target className="h-3 w-3 mr-1" />
                {currentPersona.primaryUseCases.length} Use Cases
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          {showNavigation && (
            <div className="w-64 flex-shrink-0">
              <PersonaNavigation variant="sidebar" />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumb */}
            {showBreadcrumb && (
              <div className="mb-6">
                <PersonaBreadcrumb />
              </div>
            )}

            {/* Persona-specific content */}
            {children || (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Available Features</p>
                        <p className="text-2xl font-bold">{currentPersona.features.length}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Target className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Use Cases</p>
                        <p className="text-2xl font-bold">{currentPersona.primaryUseCases.length}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Regulations</p>
                        <p className="text-2xl font-bold">{currentPersona.regulations.length}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Priority Level</p>
                        <p className="text-2xl font-bold capitalize">{currentPersona.priorityLevel}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Persona Dashboard */}
                <PersonaDashboard />

                {/* Quick Actions */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                      onClick={() => navigate(`/persona/${currentPersona.id}/guidance`)}
                    >
                      <BookOpen className="h-6 w-6" />
                      <span>View Guidance</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                      onClick={() => navigate('/privacy/data-rights')}
                    >
                      <Shield className="h-6 w-6" />
                      <span>Data Rights</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                      onClick={() => navigate('/settings')}
                    >
                      <Settings className="h-6 w-6" />
                      <span>Settings</span>
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export individual components for specific use cases
export {
  PersonaDashboard,
  PersonaGuidanceSystem,
  PersonaOnboarding,
  PersonaNavigation,
  PersonaBreadcrumb
};