import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useProject } from '../../context/ProjectContext';
import { secureStorage } from '../../utils/storage';
import { toast } from '../../components/ui/Toaster';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Users,
  FileText,
  Edit,
  Activity,
  BarChart3,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './PrivacyRoadmap.css';

type Phase = {
  id: string;
  name: string;
  duration: string;
  status: string;
  milestones: Array<{ name: string; date: string; status: string }>;
  deliverables: string[];
  keyActivities: string[];
};

const PrivacyRoadmap = () => {
  const { getCurrentProject, userMode } = useProject();
  const [viewMode, setViewMode] = useState<'timeline' | 'gantt'>('timeline');
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  // setRoadmapPhases will be used when edit functionality is implemented
  const [roadmapPhases] = useState<Phase[]>(() => {
    const saved = secureStorage.getItem<Phase[]>('privacy_roadmap_phases');
    return saved || [];
  });

  const project = getCurrentProject();

  // Auto-save roadmap phases
  useEffect(() => {
    if (roadmapPhases.length > 0) {
      secureStorage.setItem('privacy_roadmap_phases', roadmapPhases);
    }
  }, [roadmapPhases]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'in_progress': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'pending': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const handleViewDetails = (phase: Phase) => {
    setSelectedPhase(phase);
    setIsEditMode(false);
  };

  const handleEditPhase = (phase: Phase) => {
    setSelectedPhase(phase);
    setIsEditMode(true);
  };

  const handleCloseModal = () => {
    setSelectedPhase(null);
    setIsEditMode(false);
  };

  const parseDuration = (duration: string): number => {
    // Parse "4-6 weeks" or "3-4 weeks" to get average weeks
    const match = duration.match(/(\d+)-(\d+)/);
    if (match) {
      return (parseInt(match[1]) + parseInt(match[2])) / 2;
    }
    return 4; // default
  };

  const getStartDate = (index: number): Date => {
    const start = new Date();
    let weeksOffset = 0;
    for (let i = 0; i < index; i++) {
      weeksOffset += parseDuration(roadmapPhases[i].duration);
    }
    start.setDate(start.getDate() + (weeksOffset * 7));
    return start;
  };

  const renderGanttChart = () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (roadmapPhases.reduce((sum, phase) => sum + parseDuration(phase.duration), 0) * 7));
    const totalWeeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gantt Chart View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Timeline header */}
              <div className="flex mb-4 border-b pb-2">
                <div className="w-48 flex-shrink-0 font-semibold">Phase</div>
                <div className="flex-1 grid grid-cols-16 gap-1">
                  {Array.from({ length: Math.min(16, totalWeeks) }).map((_, i) => (
                    <div key={i} className="text-xs text-center text-muted-foreground">
                      W{i + 1}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Phase bars */}
              {roadmapPhases.map((phase, index) => {
                const phaseStart = getStartDate(index);
                const weeksFromStart = Math.floor((phaseStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
                const duration = parseDuration(phase.duration);
                const statusColors = {
                  completed: 'bg-green-500',
                  in_progress: 'bg-blue-500',
                  pending: 'bg-gray-300'
                };
                
                // Calculate positioning values
                const leftPercent = `${(weeksFromStart / 16) * 100}%`;
                const widthPercent = `${Math.min((duration / 16) * 100, (16 - weeksFromStart) / 16 * 100)}%`;
                
                // Ref callback to apply styles without using style attribute in JSX
                const setBarRef = (node: HTMLDivElement | null) => {
                  if (node) {
                    node.style.setProperty('--bar-left', leftPercent);
                    node.style.setProperty('--bar-width', widthPercent);
                  }
                };
                
                return (
                  <div key={phase.id} className="flex items-center mb-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded">
                    <div className="w-48 flex-shrink-0">
                      <div className="font-medium">{phase.name}</div>
                      <div className="text-xs text-muted-foreground">{phase.duration}</div>
                    </div>
                    <div className="flex-1 relative h-8">
                      <div className="absolute inset-0 grid grid-cols-16 gap-1">
                        {Array.from({ length: Math.min(16, totalWeeks) }).map((_, i) => (
                          <div key={i} className="border border-gray-200 dark:border-gray-700 rounded"></div>
                        ))}
                      </div>
                      {weeksFromStart >= 0 && weeksFromStart < 16 && (
                        <div 
                          ref={setBarRef}
                          className={`gantt-phase-bar ${statusColors[phase.status as keyof typeof statusColors] || 'bg-gray-300'}`}
                          onClick={() => handleViewDetails(phase)}
                          title={`${phase.name} - ${phase.duration}`}
                        >
                          {duration >= 2 && phase.name}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTimelineView = () => {
    return (
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
                        phase.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                        phase.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Team assignment functionality - currently under development
                            toast.info('Team Assignment', 'Team assignment functionality is currently under development. This feature will allow you to assign team members to specific roadmap phases and send automated notifications.');
                          }}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Assign Team
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditPhase(phase)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Phase
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleViewDetails(phase)}
                      >
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
    );
  };

  return (
    <div className="space-y-6">
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

      {/* View Content */}
      {viewMode === 'timeline' ? renderTimelineView() : renderGanttChart()}

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
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {roadmapPhases.reduce((sum, phase) => sum + parseDuration(phase.duration), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Weeks Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{roadmapPhases.length}</div>
              <div className="text-sm text-muted-foreground">Major Phases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {roadmapPhases.reduce((sum, phase) => sum + phase.milestones.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Key Milestones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {roadmapPhases.reduce((sum, phase) => sum + phase.deliverables.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Deliverables</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Detail Modal */}
      {selectedPhase && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {isEditMode ? 'Edit Phase' : 'Phase Details'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseModal}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{selectedPhase.name}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Duration: {selectedPhase.duration}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPhase.status)}`}>
                    {selectedPhase.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Milestones */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    Key Milestones
                  </h4>
                  <div className="space-y-2">
                    {selectedPhase.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-center text-sm p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                        {getMilestoneIcon(milestone.status)}
                        <span className="ml-2 flex-1">{milestone.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(milestone.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    Key Deliverables
                  </h4>
                  <div className="space-y-2">
                    {selectedPhase.deliverables.map((deliverable, idx) => (
                      <div key={idx} className="flex items-center text-sm p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <span>{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Activities */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-primary" />
                  Key Activities
                </h4>
                <div className="space-y-2">
                  {selectedPhase.keyActivities.map((activity, idx) => (
                    <div key={idx} className="flex items-start text-sm p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></div>
                      <span>{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {isEditMode && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Phase editing functionality will be available in a future update.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="outline" onClick={handleCloseModal}>
                  Close
                </Button>
                {!isEditMode && (
                  <Button onClick={() => handleEditPhase(selectedPhase)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Phase
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyRoadmap;
