import React, { useState, useEffect } from 'react';
import { usePersona } from '../../hooks/usePersona';
import { personaWorkflowService } from '../../services/personaWorkflowService';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressTracker } from '../../common/ProgressTracker';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  Target,
  Shield,
  Users,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';

interface PersonaGuidanceSystemProps {
  personaId: string;
  onStartWorkflow: (workflowId: string) => void;
}

export const PersonaGuidanceSystem: React.FC<PersonaGuidanceSystemProps> = ({
  personaId,
  onStartWorkflow
}) => {
  const { currentPersona, personaUseCases, personaFeatures } = usePersona();
  const [workflowProgress, setWorkflowProgress] = useState<Record<string, unknown>>({});

  useEffect(() => {
    // Load workflow progress for all available workflows
    const workflows = personaWorkflowService.getAvailableWorkflows(personaId);
    const progress: Record<string, unknown> = {};
    
    workflows.forEach(workflowId => {
      const workflowProgress = personaWorkflowService.getWorkflowProgress(personaId, workflowId);
      if (workflowProgress) {
        progress[workflowId] = workflowProgress;
      }
    });
    
    setWorkflowProgress(progress);
  }, [personaId]);

  const getUseCaseProgress = (useCaseId: string) => {
    const workflowId = useCaseId.replace(/-/g, '_');
    const progress = workflowProgress[workflowId];
    if (!progress) return 0;
    
    const totalSteps = personaWorkflowService.getWorkflowSteps(personaId, workflowId).length;
    return Math.round((progress.completedSteps.length / totalSteps) * 100);
  };

  const getUseCaseStatus = (useCaseId: string) => {
    const workflowId = useCaseId.replace(/-/g, '_');
    const progress = workflowProgress[workflowId];
    if (!progress) return 'not_started';
    return progress.status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Play className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getFeatureIcon = (category: string) => {
    switch (category) {
      case 'data-rights':
        return <Shield className="h-5 w-5" />;
      case 'compliance':
        return <CheckCircle className="h-5 w-5" />;
      case 'reporting':
        return <BarChart3 className="h-5 w-5" />;
      case 'management':
        return <Users className="h-5 w-5" />;
      case 'education':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (!currentPersona) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Persona Not Found</h2>
        <p className="text-muted-foreground">Please select a valid persona to view guidance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Persona Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg bg-${currentPersona.color}-100 dark:bg-${currentPersona.color}-900/30`}>
            {getFeatureIcon('data-rights')}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentPersona.displayName} Guidance</h1>
            <p className="text-muted-foreground">{currentPersona.description}</p>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {currentPersona.estimatedTimeCommitment}
              </Badge>
              <Badge variant="outline">
                <Target className="h-3 w-3 mr-1" />
                {personaUseCases.length} Use Cases
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Use Cases & Workflows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {personaUseCases.map((useCase) => {
            const status = getUseCaseStatus(useCase.id);
            const progress = getUseCaseProgress(useCase.id);
            
            return (
              <Card key={useCase.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status)}
                    <div>
                      <h3 className="font-semibold">{useCase.title}</h3>
                      <p className="text-sm text-muted-foreground">{useCase.description}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(status)}>
                    {status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <ProgressTracker
                    currentStep={status === 'completed' ? 100 : progress}
                    totalSteps={100}
                    progress={progress}
                  />

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      <Clock className="h-3 w-3 inline mr-1" />
                      {useCase.frequency}
                    </span>
                    <span>
                      <Target className="h-3 w-3 inline mr-1" />
                      {useCase.priority} Priority
                    </span>
                  </div>

                  <div className="pt-3 border-t">
                    <Button
                      onClick={() => onStartWorkflow(useCase.id.replace(/-/g, '_'))}
                      className="w-full"
                      variant={status === 'completed' ? 'outline' : 'default'}
                    >
                      {status === 'completed' ? 'Review Workflow' : 
                       status === 'in_progress' ? 'Continue Workflow' : 
                       'Start Workflow'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personaFeatures.map((feature) => (
            <Card key={feature.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {getFeatureIcon(feature.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{feature.name}</h3>
                    <Badge 
                      variant={feature.available ? 'default' : 'outline'}
                      className={feature.comingSoon ? 'bg-yellow-100 text-yellow-800' : ''}
                    >
                      {feature.available ? 'Available' : 
                       feature.comingSoon ? 'Coming Soon' : 'Unavailable'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className={feature.priority === 'critical' ? 'border-red-200 text-red-700' :
                                 feature.priority === 'high' ? 'border-orange-200 text-orange-700' :
                                 'border-gray-200 text-gray-700'}
                    >
                      {feature.priority} Priority
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {feature.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <BookOpen className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="font-medium mb-2">Learn Your Rights</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Understand your privacy rights and responsibilities
            </p>
            <Button variant="outline" size="sm">
              Start Learning
            </Button>
          </Card>

          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <FileText className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h3 className="font-medium mb-2">Submit Request</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Submit a data rights request or privacy inquiry
            </p>
            <Button variant="outline" size="sm">
              Submit Now
            </Button>
          </Card>

          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Settings className="h-8 w-8 mx-auto mb-3 text-purple-600" />
            <h3 className="font-medium mb-2">Manage Settings</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Update your privacy preferences and settings
            </p>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </Card>
        </div>
      </div>

      {/* Regulations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Applicable Regulations</h2>
        <div className="flex flex-wrap gap-2">
          {currentPersona.regulations.map((regulation) => (
            <Badge key={regulation} variant="outline" className="px-3 py-1">
              {regulation}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};