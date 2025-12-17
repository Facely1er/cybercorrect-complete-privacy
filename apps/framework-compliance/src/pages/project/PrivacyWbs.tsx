import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useProject } from '../../context/ProjectContext';
import { 
  BarChart3, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowLeft,
  Edit,
  Download,
  ChevronRight,
  ChevronDown,
  Eye,
  FileText,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface WbsItem {
  id: string;
  name: string;
  level: number;
  parent?: string;
  children?: string[];
  type: 'phase' | 'work_package' | 'task';
  status: 'not_started' | 'in_progress' | 'completed';
  assignee?: string;
  duration: number; // in days
  startDate: string;
  endDate: string;
  effort: number; // in hours
  deliverable?: string;
  dependencies?: string[];
}

const PrivacyWbs = () => {
  const { getCurrentProject } = useProject();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['1', '2', '3', '4']));
  const [selectedView, setSelectedView] = useState<'tree' | 'table'>('tree');

  const project = getCurrentProject();

  // Privacy-specific Work Breakdown Structure
  const wbsStructure: WbsItem[] = [
    // Phase 1: Privacy Foundation
    {
      id: '1',
      name: 'Privacy Foundation',
      level: 1,
      type: 'phase',
      status: 'in_progress',
      duration: 30,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      effort: 240
    },
    {
      id: '1.1',
      name: 'Privacy Assessment',
      level: 2,
      parent: '1',
      type: 'work_package',
      status: 'completed',
      duration: 7,
      startDate: '2024-01-15',
      endDate: '2024-01-22',
      effort: 56,
      deliverable: 'Privacy Assessment Report'
    },
    {
      id: '1.1.1',
      name: 'Conduct NIST Privacy Framework assessment',
      level: 3,
      parent: '1.1',
      type: 'task',
      status: 'completed',
      assignee: 'Data Protection Officer',
      duration: 3,
      startDate: '2024-01-15',
      endDate: '2024-01-18',
      effort: 24
    },
    {
      id: '1.1.2',
      name: 'Evaluate GDPR compliance gaps',
      level: 3,
      parent: '1.1',
      type: 'task',
      status: 'completed',
      assignee: 'Legal Counsel',
      duration: 2,
      startDate: '2024-01-18',
      endDate: '2024-01-20',
      effort: 16
    },
    {
      id: '1.1.3',
      name: 'Assess CCPA readiness',
      level: 3,
      parent: '1.1',
      type: 'task',
      status: 'completed',
      assignee: 'Data Protection Officer',
      duration: 2,
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      effort: 16
    },
    {
      id: '1.2',
      name: 'Data Inventory and Mapping',
      level: 2,
      parent: '1',
      type: 'work_package',
      status: 'in_progress',
      duration: 14,
      startDate: '2024-01-22',
      endDate: '2024-02-05',
      effort: 112,
      deliverable: 'Data Processing Inventory'
    },
    {
      id: '1.2.1',
      name: 'Inventory data processing activities',
      level: 3,
      parent: '1.2',
      type: 'task',
      status: 'in_progress',
      assignee: 'Data Steward',
      duration: 7,
      startDate: '2024-01-22',
      endDate: '2024-01-29',
      effort: 56
    },
    {
      id: '1.2.2',
      name: 'Map data flows across systems',
      level: 3,
      parent: '1.2',
      type: 'task',
      status: 'not_started',
      assignee: 'IT Administrator',
      duration: 5,
      startDate: '2024-01-29',
      endDate: '2024-02-03',
      effort: 40
    },
    {
      id: '1.2.3',
      name: 'Document legal basis for processing',
      level: 3,
      parent: '1.2',
      type: 'task',
      status: 'not_started',
      assignee: 'Legal Counsel',
      duration: 2,
      startDate: '2024-02-03',
      endDate: '2024-02-05',
      effort: 16
    },

    // Phase 2: Privacy Governance
    {
      id: '2',
      name: 'Privacy Governance',
      level: 1,
      type: 'phase',
      status: 'not_started',
      duration: 21,
      startDate: '2024-02-05',
      endDate: '2024-02-26',
      effort: 168
    },
    {
      id: '2.1',
      name: 'Policy Development',
      level: 2,
      parent: '2',
      type: 'work_package',
      status: 'not_started',
      duration: 10,
      startDate: '2024-02-05',
      endDate: '2024-02-15',
      effort: 80,
      deliverable: 'Privacy Policy Suite'
    },
    {
      id: '2.1.1',
      name: 'Draft privacy policy',
      level: 3,
      parent: '2.1',
      type: 'task',
      status: 'not_started',
      assignee: 'Legal Counsel',
      duration: 5,
      startDate: '2024-02-05',
      endDate: '2024-02-10',
      effort: 40
    },
    {
      id: '2.1.2',
      name: 'Review and approve policies',
      level: 3,
      parent: '2.1',
      type: 'task',
      status: 'not_started',
      assignee: 'Data Protection Officer',
      duration: 3,
      startDate: '2024-02-10',
      endDate: '2024-02-13',
      effort: 24
    },
    {
      id: '2.1.3',
      name: 'Implement policy communication',
      level: 3,
      parent: '2.1',
      type: 'task',
      status: 'not_started',
      assignee: 'Business Analyst',
      duration: 2,
      startDate: '2024-02-13',
      endDate: '2024-02-15',
      effort: 16
    }
  ];

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'not_started': return <AlertTriangle className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'in_progress': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'not_started': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  const renderWbsTree = () => (
    <div className="space-y-2">
      {wbsStructure
        .filter(item => item.level <= 2 || expandedItems.has(item.parent || ''))
        .map(item => (
          <div 
            key={item.id} 
            className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
            style={{ marginLeft: `${(item.level - 1) * 24}px` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                {item.type !== 'task' && (
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="mr-2 p-1 hover:bg-muted rounded"
                  >
                    {expandedItems.has(item.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
                
                {getStatusIcon(item.status)}
                
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <h3 className={`font-medium ${
                      item.type === 'phase' ? 'text-lg' : 
                      item.type === 'work_package' ? 'text-base' : 'text-sm'
                    }`}>
                      {item.id} {item.name}
                    </h3>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span>Duration: {item.duration} days</span>
                    <span>Effort: {item.effort}h</span>
                    {item.assignee && <span>Assignee: {item.assignee}</span>}
                    {item.deliverable && <span>Deliverable: {item.deliverable}</span>}
                  </div>
                </div>
              </div>
              
              {item.type === 'task' && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/project" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Project Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Work Breakdown Structure</h1>
            <p className="text-muted-foreground">
              Hierarchical decomposition of privacy implementation work
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedView === 'tree' ? 'default' : 'outline'}
              onClick={() => setSelectedView('tree')}
            >
              Tree View
            </Button>
            <Button 
              variant={selectedView === 'table' ? 'default' : 'outline'}
              onClick={() => setSelectedView('table')}
            >
              Table View
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* WBS Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-3xl font-bold text-foreground">{wbsStructure.length}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {wbsStructure.filter(item => item.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {wbsStructure.filter(item => item.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Effort</p>
                <p className="text-3xl font-bold text-purple-600">
                  {wbsStructure.reduce((sum, item) => sum + item.effort, 0)}h
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WBS Tree View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            Privacy Implementation Work Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedView === 'tree' ? renderWbsTree() : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Table view provides a detailed list of all tasks with enhanced filtering and sorting capabilities. Use the Tree View for hierarchical visualization.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyWbs;