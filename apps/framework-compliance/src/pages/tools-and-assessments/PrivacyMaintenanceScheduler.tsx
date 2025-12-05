import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Calendar, 
  ArrowLeft,
  AlertTriangle,
  Download,
  Plus,
  FileText,
  Shield,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Clock,
  Bell,
  Repeat,
  Target
} from 'lucide-react';
import { toast } from '../../components/ui/Toaster';
import { secureStorage } from '../../utils/storage';

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  category: 'assessment' | 'documentation' | 'training' | 'review' | 'compliance_check' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  dueDate: string;
  reminderDate?: string;
  frequency: 'one_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  assignedTo: string;
  notes: string;
  completedDate?: string;
  nextOccurrence?: string;
}

interface Reminder {
  id: string;
  taskId: string;
  type: 'email' | 'in_app' | 'browser';
  triggerDate: string;
  sent: boolean;
  sentDate?: string;
}

interface PrivacyMaintenanceData {
  tasks: MaintenanceTask[];
  reminders: Reminder[];
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  upcomingTasks: number;
  lastUpdated: string;
  organizationName: string;
}

const PrivacyMaintenanceScheduler = () => {
  const [data, setData] = useState<PrivacyMaintenanceData>(() => {
    const saved = secureStorage.getItem<PrivacyMaintenanceData>('privacy_maintenance_data');
    return saved || {
      tasks: [],
      reminders: [],
      totalTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
      upcomingTasks: 0,
      lastUpdated: new Date().toISOString(),
      organizationName: ''
    };
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'reminders' | 'calendar'>('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'upcoming' | 'completed'>('all');

  // Auto-save data
  useEffect(() => {
    secureStorage.setItem('privacy_maintenance_data', data);
    updateStats();
    checkOverdueTasks();
  }, [data]);

  const updateStats = () => {
    const now = new Date();
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter(t => t.status === 'completed').length;
    const overdueTasks = data.tasks.filter(t => 
      t.status !== 'completed' && t.status !== 'cancelled' && new Date(t.dueDate) < now
    ).length;
    const upcomingTasks = data.tasks.filter(t => 
      t.status === 'pending' && new Date(t.dueDate) >= now && new Date(t.dueDate) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    setData(prev => ({
      ...prev,
      totalTasks,
      completedTasks,
      overdueTasks,
      upcomingTasks,
      lastUpdated: new Date().toISOString()
    }));
  };

  const checkOverdueTasks = () => {
    const now = new Date();
    const overdue = data.tasks.filter(t => 
      t.status !== 'completed' && t.status !== 'cancelled' && new Date(t.dueDate) < now
    );
    
    overdue.forEach(task => {
      if (task.status !== 'overdue') {
        updateTask(task.id, { status: 'overdue' });
      }
    });
  };

  const addTask = (task: Omit<MaintenanceTask, 'id'>) => {
    const newTask: MaintenanceTask = {
      ...task,
      id: `task-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
    toast.success('Task added', 'Maintenance task has been created');
  };

  const updateTask = (id: string, updates: Partial<MaintenanceTask>) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
    toast.success('Task updated', 'Maintenance task has been updated');
  };

  const deleteTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
      reminders: prev.reminders.filter(r => r.taskId !== id)
    }));
    toast.success('Task removed', 'Maintenance task has been removed');
  };

  const completeTask = (id: string) => {
    updateTask(id, { 
      status: 'completed', 
      completedDate: new Date().toISOString() 
    });
    
    // Handle recurring tasks
    const task = data.tasks.find(t => t.id === id);
    if (task && task.frequency !== 'one_time') {
      const nextDate = calculateNextOccurrence(task.dueDate, task.frequency);
      addTask({
        ...task,
        status: 'pending',
        dueDate: nextDate,
        completedDate: undefined,
        nextOccurrence: nextDate
      });
    }
  };

  const calculateNextOccurrence = (currentDate: string, frequency: string): string => {
    const date = new Date(currentDate);
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    return date.toISOString().split('T')[0];
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-warning/10 text-warning',
      'in_progress': 'bg-primary/10 text-primary',
      'completed': 'bg-success/10 text-success',
      'overdue': 'bg-destructive/10 text-destructive',
      'cancelled': 'bg-muted text-muted-foreground'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-destructive/10 text-destructive',
      'medium': 'bg-warning/10 text-warning',
      'low': 'bg-success/10 text-success'
    };
    return colors[priority] || 'bg-muted text-muted-foreground';
  };

  const getFilteredTasks = () => {
    const now = new Date();
    switch (filter) {
      case 'pending':
        return data.tasks.filter(t => t.status === 'pending');
      case 'overdue':
        return data.tasks.filter(t => t.status === 'overdue' || (t.status !== 'completed' && t.status !== 'cancelled' && new Date(t.dueDate) < now));
      case 'upcoming':
        return data.tasks.filter(t => t.status === 'pending' && new Date(t.dueDate) >= now && new Date(t.dueDate) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));
      case 'completed':
        return data.tasks.filter(t => t.status === 'completed');
      default:
        return data.tasks;
    }
  };

  const exportReport = async (format: 'json' | 'csv' | 'pdf') => {
    const { monetization } = await import('../../utils/monetization');
    const canExport = monetization.canExport(format);
    
    if (!canExport.allowed) {
      toast.error('Export not available', canExport.reason || 'You do not have permission to export in this format');
      if (canExport.creditsNeeded) {
        setTimeout(() => {
          window.location.href = '/monetization/credits';
        }, 2000);
      }
      return;
    }

    setIsExporting(true);
    try {
      const reportData = {
        metadata: {
          timestamp: new Date().toISOString(),
          reportId: `PMS-${Date.now()}`,
          version: '1.0',
          generatedBy: 'CyberCorrect Privacy Maintenance Scheduler'
        },
        data,
        summary: {
          totalTasks: data.totalTasks,
          completedTasks: data.completedTasks,
          overdueTasks: data.overdueTasks,
          upcomingTasks: data.upcomingTasks
        }
      };

      const creditsUsed = monetization.useExportCredits(format, 'Privacy Maintenance Scheduler');
      if (!creditsUsed && format !== 'json') {
        toast.error('Insufficient credits', 'Please purchase more export credits');
        setIsExporting(false);
        return;
      }

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `privacy-maintenance-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'JSON report downloaded');
      } else if (format === 'csv') {
        const csvRows: string[] = [];
        csvRows.push('Title,Category,Status,Priority,Due Date,Assigned To');
        
        data.tasks.forEach(task => {
          csvRows.push(`${task.title},${task.category},${task.status},${task.priority},${task.dueDate},${task.assignedTo}`);
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `privacy-maintenance-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export successful', 'CSV report downloaded');
      } else if (format === 'pdf') {
        const { generatePrivacyMaintenancePdf } = await import('../../utils/pdf');
        generatePrivacyMaintenancePdf(reportData);
        toast.success('Export successful', 'PDF report downloaded');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', 'Please try again');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="py-8">
      <div className="mb-6">
        <Link to="/toolkit" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Toolkit
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Privacy Maintenance Scheduler</h1>
        <p className="text-muted-foreground">
          Schedule and manage automated privacy compliance maintenance tasks and reminders
        </p>
      </div>

      {/* Overview Stats */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold text-foreground">{data.totalTasks}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">{data.completedTasks}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-destructive">{data.overdueTasks}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-warning">{data.upcomingTasks}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 border-b border-border">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'tasks', label: 'Tasks', icon: Target },
            { id: 'reminders', label: 'Reminders', icon: Bell },
            { id: 'calendar', label: 'Calendar', icon: Calendar }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'tasks' | 'reminders' | 'calendar')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'tasks' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Maintenance Tasks</CardTitle>
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'overdue' | 'upcoming' | 'completed')}
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
                <Button onClick={() => setShowAddTask(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {getFilteredTasks().length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No tasks found</p>
                <Button onClick={() => setShowAddTask(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Task
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {getFilteredTasks().map(task => (
                  <div key={task.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{task.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.frequency !== 'one_time' && (
                            <span className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground flex items-center gap-1">
                              <Repeat className="h-3 w-3" />
                              {task.frequency}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Category: {task.category.replace('_', ' ')}</span>
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          <span>Assigned: {task.assignedTo}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {task.status !== 'completed' && (
                          <Button variant="ghost" size="icon" onClick={() => completeTask(task.id)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Export Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => exportReport('json')}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button
                variant="outline"
                onClick={() => exportReport('csv')}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => exportReport('pdf')}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">About Privacy Maintenance Scheduler</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This tool helps organizations schedule and manage automated privacy compliance maintenance tasks and reminders. 
              Track recurring tasks, set up automated reminders, and ensure ongoing compliance.
            </p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Schedule recurring compliance tasks</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Set up automated reminders</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Track task completion and progress</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Export maintenance reports</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyMaintenanceScheduler;

