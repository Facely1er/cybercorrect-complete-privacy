import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersona } from '../../hooks/usePersona';
import { LoadingState } from '../../common/LoadingState';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  User, 
  Briefcase, 
  Users, 
  Shield, 
  FileText, 
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

// Persona-specific dashboard widgets
const QuickActionsWidget = ({ persona }: { persona: { id: string; name: string; role: string } }) => {
  const navigate = useNavigate();
  
  const getQuickActions = () => {
    switch (persona.id) {
      case 'worker':
        return [
          { id: 'access-data', label: 'Access My Data', icon: FileText, path: '/privacy/data-rights' },
          { id: 'correct-data', label: 'Correct Data', icon: CheckCircle, path: '/privacy/data-rights' },
          { id: 'privacy-settings', label: 'Privacy Settings', icon: Shield, path: '/settings' }
        ];
      case 'job_prospect':
        return [
          { id: 'application-privacy', label: 'Application Privacy', icon: Briefcase, path: '/data-rights' },
          { id: 'my-rights', label: 'My Rights', icon: Shield, path: '/data-rights' }
        ];
      case 'hr_staff':
        return [
          { id: 'pending-requests', label: 'Pending Requests', icon: Clock, path: '/privacy/data-rights' },
          { id: 'consent-management', label: 'Consent Management', icon: CheckCircle, path: '/privacy/consent' },
          { id: 'incidents', label: 'Privacy Incidents', icon: AlertTriangle, path: '/privacy/incidents' }
        ];
      case 'dpo':
        return [
          { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/privacy/analytics' },
          { id: 'stakeholders', label: 'Stakeholders', icon: Users, path: '/privacy/stakeholders' },
          { id: 'compliance', label: 'Compliance', icon: TrendingUp, path: '/privacy/obligations' }
        ];
      default:
        return [];
    }
  };

  const actions = getQuickActions();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={action.id}
              variant="outline"
              className="justify-start h-auto p-3"
              onClick={() => navigate(action.path)}
            >
              <IconComponent className="h-4 w-4 mr-3" />
              <span className="text-sm">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

const RecentRequestsWidget = () => {
  // Mock data - in real app, this would come from API
  const recentRequests = [
    { id: '1', type: 'Data Access', status: 'Completed', date: '2024-01-15' },
    { id: '2', type: 'Data Correction', status: 'In Progress', date: '2024-01-14' },
    { id: '3', type: 'Data Deletion', status: 'Pending', date: '2024-01-13' }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Requests</h3>
      <div className="space-y-3">
        {recentRequests.map((request) => (
          <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-sm">{request.type}</p>
              <p className="text-xs text-muted-foreground">{request.date}</p>
            </div>
            <Badge 
              variant={request.status === 'Completed' ? 'default' : 
                      request.status === 'In Progress' ? 'secondary' : 'outline'}
            >
              {request.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

const PrivacyEducationWidget = ({ persona }: { persona: { id: string; name: string; role: string } }) => {
  const navigate = useNavigate();
  
  const getEducationContent = () => {
    switch (persona.id) {
      case 'worker':
        return {
          title: 'Your Privacy Rights',
          content: 'Learn about your rights under employment privacy laws including ADA, EEOC, and CCPA.',
          link: '/training'
        };
      case 'job_prospect':
        return {
          title: 'Application Privacy Rights',
          content: 'Understand your privacy rights during the job application process.',
          link: '/training'
        };
      default:
        return null;
    }
  };

  const education = getEducationContent();
  if (!education) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{education.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{education.content}</p>
      <Button variant="outline" size="sm" onClick={() => navigate(education.link)}>
        Learn More
      </Button>
    </Card>
  );
};

const ComplianceOverviewWidget = () => {
  // Mock data - in real app, this would come from API
  const complianceMetrics = {
    totalRequests: 45,
    completedRequests: 38,
    pendingRequests: 7,
    complianceScore: 92
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Compliance Overview</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{complianceMetrics.completedRequests}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{complianceMetrics.pendingRequests}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>Compliance Score</span>
          <span>{complianceMetrics.complianceScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full" 
            style={{ width: `${complianceMetrics.complianceScore}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

const PendingRequestsWidget = () => {
  // Mock data - in real app, this would come from API
  const pendingRequests = [
    { id: '1', employee: 'John Doe', type: 'Data Access', priority: 'High', daysOpen: 2 },
    { id: '2', employee: 'Jane Smith', type: 'Data Correction', priority: 'Medium', daysOpen: 5 },
    { id: '3', employee: 'Bob Johnson', type: 'Data Deletion', priority: 'Low', daysOpen: 1 }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Pending Requests</h3>
      <div className="space-y-3">
        {pendingRequests.map((request) => (
          <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-sm">{request.employee}</p>
              <p className="text-xs text-muted-foreground">{request.type} • {request.daysOpen} days</p>
            </div>
            <Badge 
              variant={request.priority === 'High' ? 'destructive' : 
                      request.priority === 'Medium' ? 'secondary' : 'outline'}
            >
              {request.priority}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

const PrivacyOverviewWidget = () => {
  // Mock data - in real app, this would come from API
  const overviewMetrics = {
    totalStakeholders: 1247,
    activeRequests: 23,
    complianceRate: 94,
    riskLevel: 'Low'
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Privacy Program Overview</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{overviewMetrics.totalStakeholders}</p>
          <p className="text-xs text-muted-foreground">Total Stakeholders</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{overviewMetrics.activeRequests}</p>
          <p className="text-xs text-muted-foreground">Active Requests</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{overviewMetrics.complianceRate}%</p>
          <p className="text-xs text-muted-foreground">Compliance Rate</p>
        </div>
        <div className="text-center">
          <Badge variant={overviewMetrics.riskLevel === 'Low' ? 'default' : 'destructive'}>
            {overviewMetrics.riskLevel} Risk
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">Risk Level</p>
        </div>
      </div>
    </Card>
  );
};

export const PersonaDashboard = () => {
  const { currentPersona, isLoading, error } = usePersona();

  if (isLoading) {
    return <LoadingState message="Loading your personalized dashboard..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentPersona) {
    return (
      <div className="p-6">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Persona Selected</h2>
          <p className="text-muted-foreground">Please select a persona to view your dashboard.</p>
        </div>
      </div>
    );
  }

  const renderDashboardSections = () => {
    return currentPersona.dashboardSections.map((section) => {
      switch (section.component) {
        case 'QuickActionsWidget':
          return <QuickActionsWidget key={section.id} persona={currentPersona} />;
        case 'RecentRequestsWidget':
          return <RecentRequestsWidget key={section.id} />;
        case 'PrivacyEducationWidget':
          return <PrivacyEducationWidget key={section.id} persona={currentPersona} />;
        case 'ComplianceOverviewWidget':
          return <ComplianceOverviewWidget key={section.id} />;
        case 'PendingRequestsWidget':
          return <PendingRequestsWidget key={section.id} />;
        case 'PrivacyOverviewWidget':
          return <PrivacyOverviewWidget key={section.id} />;
        default:
          return null;
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Persona Header */}
      <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <div className={`p-3 rounded-lg bg-${currentPersona.color}-100 dark:bg-${currentPersona.color}-900/30`}>
          {currentPersona.id === 'worker' && <User className="h-6 w-6 text-blue-600" />}
          {currentPersona.id === 'job_prospect' && <Briefcase className="h-6 w-6 text-green-600" />}
          {currentPersona.id === 'hr_staff' && <Users className="h-6 w-6 text-purple-600" />}
          {currentPersona.id === 'dpo' && <Shield className="h-6 w-6 text-red-600" />}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{currentPersona.displayName} Dashboard</h1>
          <p className="text-muted-foreground">{currentPersona.description}</p>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderDashboardSections()}
      </div>
    </div>
  );
};