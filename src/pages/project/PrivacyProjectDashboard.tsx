import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useProject } from '../../context/ProjectContext';
import { InternalLink, RelatedContent } from '../../components/ui/InternalLinkingHelper';
import { complianceHealthMonitor } from '../../utils/complianceHealthMonitor';
import { notificationService } from '../../utils/notificationService';
import { 
  Eye, 
  Users, 
  Target, 
  Calendar, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  Settings,
  FileText,
  Database,
  Activity,
  Bell,
  ClipboardList,
  FileBarChart,
  Building
} from 'lucide-react';

const PrivacyProjectDashboard = () => {
  const { 
    userMode, 
    setUserMode, 
    createProject, 
    getCurrentProject 
  } = useProject();
  const [, setShowCreateProject] = useState(false);
  const [complianceScore, setComplianceScore] = useState<number | null>(null);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  const project = getCurrentProject();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load compliance health score
      const currentScore = await complianceHealthMonitor.getCurrentScore();
      if (currentScore) {
        setComplianceScore(currentScore.score);
      }

      // Load recent notifications
      const notifications = await notificationService.getNotifications({ limit: 5, unreadOnly: false });
      setRecentNotifications(notifications);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleCreateProject = () => {
    createProject({
      projectId: '',
      phases: [],
      teamMembers: [],
      overallProgress: 0,
      currentPhase: 'assessment',
      lastUpdated: new Date().toISOString(),
      startDate: new Date().toISOString().split('T')[0],
      targetCompletionDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowCreateProject(false);
  };

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 text-foreground">Privacy Project Manager</h1>
            <p className="text-xl text-muted-foreground">
              Collaborative privacy compliance project management for teams and solo practitioners
            </p>
          </div>

          {/* User Mode Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Your Working Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    userMode === 'solo' ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setUserMode('solo')}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-2">Solo Practitioner</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Streamlined workflows for individual privacy professionals
                    </p>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Simplified deliverables</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Quick implementation paths</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Essential documentation focus</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    userMode === 'team' ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setUserMode('team')}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-2">Team Collaboration</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Full project management with role-based responsibilities
                    </p>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Role-based assignments (RACI)</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Work breakdown structure (WBS)</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Collaborative evidence management</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span>Project roadmap and milestones</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Create New Project */}
          <div className="text-center">
            <Button size="lg" onClick={handleCreateProject}>
              <Plus className="mr-2 h-5 w-5" />
              Create Privacy Project
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Privacy Project Dashboard</h1>
            <p className="text-muted-foreground">
              {userMode === 'solo' ? 'Solo practitioner mode' : 'Team collaboration mode'} • 
              Project started {new Date(project.startDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Project Settings
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-3xl font-bold text-primary">{project.overallProgress}%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div className="w-full bg-muted h-2 rounded-full mt-2">
              <div 
                className="h-2 rounded-full bg-primary" 
                style={{ width: `${project.overallProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Phase</p>
                <p className="text-lg font-bold text-foreground capitalize">{project.currentPhase}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-3xl font-bold text-foreground">{project.teamMembers.length || 1}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Target Date</p>
                <p className="text-sm font-bold text-foreground">
                  {new Date(project.targetCompletionDate).toLocaleDateString()}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Phases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Project Phases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.phases.map((phase) => (
                <div key={phase.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{phase.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                      phase.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      phase.status === 'planning' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {phase.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {phase.startDate} - {phase.endDate}
                    </span>
                    <span className="text-muted-foreground">
                      {phase.tasks.length} tasks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/project/roadmap">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span className="text-sm">Roadmap</span>
                </Button>
              </Link>
              
              {userMode === 'team' && (
                <Link to="/project/raci">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Users className="h-6 w-6 mb-2" />
                    <span className="text-sm">RACI Matrix</span>
                  </Button>
                </Link>
              )}
              
              <Link to="/project/wbs">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span className="text-sm">Work Breakdown</span>
                </Button>
              </Link>
              
              <Link to="/project/evidence">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <Database className="h-6 w-6 mb-2" />
                  <span className="text-sm">Evidence Vault</span>
                </Button>
              </Link>
              
              <Link to="/assessments/privacy-assessment">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <Eye className="h-6 w-6 mb-2" />
                  <span className="text-sm">Assessment</span>
                </Button>
              </Link>
              
              <Link to="/toolkit/gdpr-mapper">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-sm">Data Mapping</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-muted/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-sm">Privacy Assessment completed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-muted/30 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-sm">GDPR data mapping updated</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-muted/30 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-sm">Privacy policy draft created</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Health Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Compliance Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {complianceScore !== null ? complianceScore.toFixed(1) : '--'}
                </div>
                <p className="text-sm text-muted-foreground">Current Score</p>
              </div>
              <Link to="/dashboard/compliance-health">
                <Button variant="outline" className="w-full">
                  View Health Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentNotifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent notifications</p>
              ) : (
                <div className="space-y-2">
                  {recentNotifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="text-sm">
                      <p className="font-medium truncate">{notification.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/notifications">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View All Notifications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link to="/reports/automated">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileBarChart className="h-4 w-4 mr-2" />
                  Automated Reports
                </Button>
              </Link>
              <Link to="/assessments/scheduled">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Scheduled Assessments
                </Button>
              </Link>
              <Link to="/alerts">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Alert Management
                </Button>
              </Link>
              <Link to="/dashboard/progress">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Progress Tracking
                </Button>
              </Link>
              <Link to="/toolkit/vendor-risk-assessment">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Building className="h-4 w-4 mr-2" />
                  Vendor Risk Assessment
                </Button>
              </Link>
              <Link to="/toolkit/consent-management">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Consent Management
                </Button>
              </Link>
              <Link to="/toolkit/incident-response-manager">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Incident Response
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                  <div>
                    <p className="font-medium text-sm">Complete DPIA for new product</p>
                    <p className="text-xs text-muted-foreground">Due tomorrow</p>
                  </div>
                </div>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">High</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                  <div>
                    <p className="font-medium text-sm">Update privacy notice</p>
                    <p className="text-xs text-muted-foreground">Due in 3 days</p>
                  </div>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Medium</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                  <div>
                    <p className="font-medium text-sm">Review data processing records</p>
                    <p className="text-xs text-muted-foreground">Due in 1 week</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Low</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA for Getting Started */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
        <h2 className="text-xl font-bold mb-4">Ready to Start Your Privacy Project?</h2>
        <p className="mb-4">
          Begin with a privacy assessment to establish your baseline and identify implementation priorities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <InternalLink href="/assessments/privacy-assessment" variant="button" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Assessment
          </InternalLink>
          <InternalLink href="/project/roadmap" variant="button" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
              View Roadmap
          </InternalLink>
          <InternalLink href="/documentation/getting-started" variant="button" className="bg-gray-900 text-white hover:bg-gray-800">
            Implementation Guide
          </InternalLink>
        </div>
      </div>
      
      {/* Add related content */}
      <RelatedContent currentPath="/project" />
    </div>
  );
};

export default PrivacyProjectDashboard;