import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useProject } from '../../context/ProjectContext';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Users,
  FileText,
  ArrowLeft,
  Edit,
  Activity,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyRoadmap = () => {
  const { getCurrentProject, userMode } = useProject();
  const [, ] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'gantt'>('timeline');

  const project = getCurrentProject();

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Active Project</h1>
          <Link to="/project">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Sample roadmap data based on privacy compliance requirements
  const roadmapPhases = [
    {
      id: 'foundation',
      name: 'Privacy Foundation',
      duration: '4-6 weeks',
      status: 'in_progress',
      milestones: [
        { name: 'Privacy Assessment Complete', date: '2024-02-15', status: 'completed' },
        { name: 'Data Inventory Complete', date: '2024-02-28', status: 'in_progress' },
        { name: 'Legal Basis Mapping', date: '2024-03-05', status: 'pending' }
      ],
      deliverables: [
        'Privacy Assessment Report',
        'Data Processing Inventory',
        'Legal Basis Documentation',
        'Initial Risk Assessment'
      ],
      keyActivities: [
        'Conduct comprehensive privacy assessment',
        'Map all data processing activities',
        'Document legal basis for each processing activity',
        'Identify high-risk processing requiring DPIA'
      ]
    },
    {
      id: 'governance',
      name: 'Privacy Governance',
      duration: '3-4 weeks',
      status: 'pending',
      milestones: [
        { name: 'Privacy Policy Framework', date: '2024-03-15', status: 'pending' },
        { name: 'Governance Structure', date: '2024-03-22', status: 'pending' },
        { name: 'Training Program Launch', date: '2024-03-30', status: 'pending' }
      ],
      deliverables: [
        'Privacy Management Framework',
        'Privacy Policies and Procedures',
        'Governance Structure Documentation',
        'Privacy Training Materials'
      ],
      keyActivities: [
        'Establish privacy governance structure',
        'Develop privacy policies and procedures',
        'Create privacy training program',
        'Implement privacy management processes'
      ]
    },
    {
      id: 'controls',
      name: 'Privacy Controls',
      duration: '6-8 weeks',
      status: 'pending',
      milestones: [
        { name: 'Technical Controls Implementation', date: '2024-04-15', status: 'pending' },
        { name: 'Process Controls Documentation', date: '2024-04-30', status: 'pending' },
        { name: 'Data Subject Rights Portal', date: '2024-05-10', status: 'pending' }
      ],
      deliverables: [
        'Privacy Controls Implementation',
        'Data Subject Rights Procedures',
        'Privacy Notice Framework',
        'Consent Management System'
      ],
      keyActivities: [
        'Implement data protection by design',
        'Deploy data subject rights management',
        'Configure privacy notices and consent',
        'Implement data retention and deletion'
      ]
    },
    {
      id: 'validation',
      name: 'Validation & Monitoring',
      duration: '2-3 weeks',
      status: 'pending',
      milestones: [
        { name: 'Control Testing Complete', date: '2024-05-20', status: 'pending' },
        { name: 'Evidence Package Ready', date: '2024-05-25', status: 'pending' },
        { name: 'Monitoring Dashboard Live', date: '2024-05-31', status: 'pending' }
      ],
      deliverables: [
        'Control Validation Report',
        'Evidence Package',
        'Monitoring Dashboard',
        'Compliance Certificate'
      ],
      keyActivities: [
        'Test privacy control effectiveness',
        'Compile evidence for audit readiness',
        'Implement continuous monitoring',
        'Conduct final compliance review'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/project" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Project Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Privacy Implementation Roadmap</h1>
            <p className="text-muted-foreground">
              {userMode === 'solo' ? 'Solo practitioner roadmap' : 'Team collaboration roadmap'} • 
              Track your privacy compliance journey
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              onClick={() => setViewMode('timeline')}
            >
              Timeline View
            </Button>
            <Button 
              variant={viewMode === 'gantt' ? 'default' : 'outline'}
              onClick={() => setViewMode('gantt')}
            >
              Gantt Chart
            </Button>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-8">
        {roadmapPhases.map((phase, index) => (
          <Card key={phase.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                {/* Phase Timeline Indicator */}
                <div className="w-2 bg-gradient-to-b from-blue-500 to-purple-500 flex-shrink-0"></div>
                
                {/* Phase Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                        phase.status === 'completed' ? 'bg-green-100 text-green-600' :
                        phase.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{phase.name}</h2>
                        <p className="text-sm text-muted-foreground">{phase.duration}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(phase.status)}`}>
                      {phase.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Milestones */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        Key Milestones
                      </h3>
                      <div className="space-y-2">
                        {phase.milestones.map((milestone, idx) => (
                          <div key={idx} className="flex items-center text-sm">
                            {getMilestoneIcon(milestone.status)}
                            <span className="ml-2">{milestone.name}</span>
                            <span className="ml-auto text-xs text-muted-foreground">
                              {new Date(milestone.date).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        Key Deliverables
                      </h3>
                      <div className="space-y-2">
                        {phase.deliverables.map((deliverable, idx) => (
                          <div key={idx} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                            <span>{deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Activities */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-primary" />
                        Key Activities
                      </h3>
                      <div className="space-y-2">
                        {phase.keyActivities.map((activity, idx) => (
                          <div key={idx} className="flex items-start text-sm">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></div>
                            <span>{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Phase Actions */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex justify-end gap-2">
                      {userMode === 'team' && (
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-1" />
                          Assign Team
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Phase
                      </Button>
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Roadmap Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            Roadmap Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">15-20</div>
              <div className="text-sm text-muted-foreground">Weeks Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-muted-foreground">Major Phases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-muted-foreground">Key Milestones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">16</div>
              <div className="text-sm text-muted-foreground">Deliverables</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyRoadmap;