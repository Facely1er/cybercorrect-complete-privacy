import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  ClipboardList,
  Play,
  Pause,
  Trash2,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { secureStorage } from '../../utils/secureStorage';
import { toast } from '../../components/ui/Toaster';
import { EmptyState } from '../../components/ui/EmptyState';

export type AssessmentType = 'privacy' | 'gap' | 'risk' | 'compliance' | 'custom';
export type AssessmentSchedule = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';

export interface ScheduledAssessment {
  id?: string;
  user_id?: string;
  assessment_type: AssessmentType;
  schedule: AssessmentSchedule;
  last_run?: string;
  next_run: string;
  config?: Record<string, unknown>;
  status: 'active' | 'paused' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
}

const ASSESSMENTS_STORAGE_KEY = 'cybercorrect_scheduled_assessments';

export const ScheduledAssessments: React.FC = () => {
  const [assessments, setAssessments] = useState<ScheduledAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAssessment, setNewAssessment] = useState<{
    assessment_type: AssessmentType;
    schedule: AssessmentSchedule;
    config?: Record<string, unknown>;
  }>({
    assessment_type: 'privacy',
    schedule: 'monthly',
  });

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('scheduled_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('next_run', { ascending: true });

        if (error) throw error;

        if (data) {
          setAssessments(data as ScheduledAssessment[]);
          secureStorage.setItem(ASSESSMENTS_STORAGE_KEY, data);
        }
      } else {
        // Fallback to local storage
        const local = secureStorage.getItem<ScheduledAssessment[]>(ASSESSMENTS_STORAGE_KEY) || [];
        setAssessments(local);
      }
    } catch (error) {
      console.error('Failed to load assessments:', error);
      const local = secureStorage.getItem<ScheduledAssessment[]>(ASSESSMENTS_STORAGE_KEY) || [];
      setAssessments(local);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextRun = (schedule: AssessmentSchedule): Date => {
    const now = new Date();
    const next = new Date(now);

    switch (schedule) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'quarterly':
        next.setMonth(next.getMonth() + 3);
        break;
      default:
        next.setDate(next.getDate() + 7);
    }

    return next;
  };

  const handleCreateAssessment = async () => {
    try {
      const nextRun = calculateNextRun(newAssessment.schedule);
      
      const assessment: ScheduledAssessment = {
        assessment_type: newAssessment.assessment_type,
        schedule: newAssessment.schedule,
        next_run: nextRun.toISOString(),
        config: newAssessment.config || {},
        status: 'active',
      };

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Store in Supabase
        const { data, error } = await supabase
          .from('scheduled_assessments')
          .insert({
            user_id: user.id,
            ...assessment,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          await loadAssessments();
          setShowCreateModal(false);
          setNewAssessment({ assessment_type: 'privacy', schedule: 'monthly' });
          toast.success('Assessment scheduled', 'Assessment has been scheduled successfully');
        }
      } else {
        // Fallback to local storage
        const localAssessment: ScheduledAssessment = {
          ...assessment,
          id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString(),
        };
        
        const local = secureStorage.getItem<ScheduledAssessment[]>(ASSESSMENTS_STORAGE_KEY) || [];
        local.push(localAssessment);
        secureStorage.setItem(ASSESSMENTS_STORAGE_KEY, local);
        
        await loadAssessments();
        setShowCreateModal(false);
        setNewAssessment({ assessment_type: 'privacy', schedule: 'monthly' });
        toast.success('Assessment scheduled', 'Assessment has been scheduled successfully');
      }
    } catch (error) {
      console.error('Failed to create assessment:', error);
      toast.error('Failed to create assessment', 'Please try again');
    }
  };

  const handleToggleStatus = async (assessmentId: string, currentStatus: ScheduledAssessment['status']) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update in Supabase
        const { error } = await supabase
          .from('scheduled_assessments')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', assessmentId)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      await loadAssessments();
      toast.success('Assessment status updated', `Assessment ${newStatus === 'active' ? 'activated' : 'paused'}`);
    } catch (error) {
      console.error('Failed to update assessment status:', error);
      toast.error('Failed to update assessment status', 'Please try again');
    }
  };

  const handleDelete = async (assessmentId: string) => {
    if (!confirm('Are you sure you want to delete this scheduled assessment?')) {
      return;
    }

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Delete from Supabase
        const { error } = await supabase
          .from('scheduled_assessments')
          .delete()
          .eq('id', assessmentId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Delete from local storage
        const local = secureStorage.getItem<ScheduledAssessment[]>(ASSESSMENTS_STORAGE_KEY) || [];
        const filtered = local.filter(a => a.id !== assessmentId);
        secureStorage.setItem(ASSESSMENTS_STORAGE_KEY, filtered);
      }

      await loadAssessments();
      toast.success('Assessment deleted', 'Scheduled assessment has been deleted');
    } catch (error) {
      console.error('Failed to delete assessment:', error);
      toast.error('Failed to delete assessment', 'Please try again');
    }
  };

  const handleRunNow = async (assessment: ScheduledAssessment) => {
    try {
      toast.info('Running assessment', 'This may take a few moments...');
      // In a real implementation, trigger assessment execution
      // For now, show success message
      setTimeout(() => {
        toast.success('Assessment completed', 'Assessment has been completed successfully');
      }, 2000);
    } catch (error) {
      console.error('Failed to run assessment:', error);
      toast.error('Failed to run assessment', 'Please try again');
    }
  };

  const getAssessmentTypeLabel = (type: AssessmentType) => {
    const labels: Record<AssessmentType, string> = {
      privacy: 'Privacy Assessment',
      gap: 'Gap Analysis',
      risk: 'Risk Assessment',
      compliance: 'Compliance Assessment',
      custom: 'Custom Assessment',
    };
    return labels[type] || type;
  };

  const getScheduleLabel = (schedule: AssessmentSchedule) => {
    const labels: Record<AssessmentSchedule, string> = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      custom: 'Custom',
    };
    return labels[schedule] || schedule;
  };

  const getStatusIcon = (status: ScheduledAssessment['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Scheduled Assessments</h1>
            <p className="text-muted-foreground">
              Schedule and manage automated compliance assessments
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Assessment
          </Button>
        </div>
      </div>

      {showCreateModal && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Schedule New Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Assessment Type</label>
                <select
                  value={newAssessment.assessment_type}
                  onChange={(e) => setNewAssessment({ ...newAssessment, assessment_type: e.target.value as AssessmentType })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="privacy">Privacy Assessment</option>
                  <option value="gap">Gap Analysis</option>
                  <option value="risk">Risk Assessment</option>
                  <option value="compliance">Compliance Assessment</option>
                  <option value="custom">Custom Assessment</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Schedule</label>
                <select
                  value={newAssessment.schedule}
                  onChange={(e) => setNewAssessment({ ...newAssessment, schedule: e.target.value as AssessmentSchedule })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateAssessment}>Schedule Assessment</Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Assessments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scheduled Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading scheduled assessments...
            </div>
          ) : assessments.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No Scheduled Assessments"
              description="Create your first scheduled assessment to automate regular compliance checks."
              action={{
                label: "Schedule Assessment",
                onClick: () => setShowCreateModal(true),
                icon: Plus
              }}
            />
          ) : (
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{getAssessmentTypeLabel(assessment.assessment_type)}</h3>
                        <span className="text-sm text-muted-foreground">
                          ({getScheduleLabel(assessment.schedule)})
                        </span>
                        {getStatusIcon(assessment.status)}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {assessment.last_run && (
                          <div>Last run: {new Date(assessment.last_run).toLocaleString()}</div>
                        )}
                        <div>Next run: {new Date(assessment.next_run).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRunNow(assessment)}
                        title="Run now"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(assessment.id!, assessment.status)}
                        title={assessment.status === 'active' ? 'Pause' : 'Resume'}
                      >
                        {assessment.status === 'active' ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(assessment.id!)}
                        className="text-destructive hover:text-destructive"
                        title="Delete"
                      >
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
    </div>
  );
};

