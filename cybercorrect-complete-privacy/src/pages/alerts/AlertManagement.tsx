import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  AlertTriangle, 
  Settings,
  Trash2,
  Edit,
  ToggleLeft,
  ToggleRight,
  Clock,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { alertService, AlertRule, AlertRuleType, Alert } from '../../utils/alertService';
import { toast } from '../../components/ui/Toaster';

export const AlertManagement: React.FC = () => {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [upcomingAlerts, setUpcomingAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [newRule, setNewRule] = useState<{
    rule_type: AlertRuleType;
    name: string;
    conditions: Record<string, unknown>;
    actions: Record<string, unknown>;
    enabled: boolean;
  }>({
    rule_type: 'deadline',
    name: '',
    conditions: {},
    actions: { createNotification: true },
    enabled: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const rules = await alertService.getAlertRules();
      setAlertRules(rules);
      
      const alerts = await alertService.getUpcomingAlerts(20);
      setUpcomingAlerts(alerts);
    } catch (error) {
      console.error('Failed to load alert data:', error);
      toast.error('Failed to load alert data', 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRule = async () => {
    try {
      if (!newRule.name.trim()) {
        toast.error('Rule name required', 'Please enter a name for the alert rule');
        return;
      }

      const created = await alertService.createAlertRule(newRule);
      if (created) {
        await loadData();
        setShowCreateModal(false);
        setNewRule({
          rule_type: 'deadline',
          name: '',
          conditions: {},
          actions: { createNotification: true },
          enabled: true,
        });
        toast.success('Alert rule created', 'Alert rule has been created successfully');
      }
    } catch (error) {
      console.error('Failed to create alert rule:', error);
      toast.error('Failed to create alert rule', 'Please try again');
    }
  };

  const handleUpdateRule = async (ruleId: string, updates: Partial<AlertRule>) => {
    try {
      const success = await alertService.updateAlertRule(ruleId, updates);
      if (success) {
        await loadData();
        setEditingRule(null);
        toast.success('Alert rule updated', 'Alert rule has been updated successfully');
      }
    } catch (error) {
      console.error('Failed to update alert rule:', error);
      toast.error('Failed to update alert rule', 'Please try again');
    }
  };

  const handleToggleEnabled = async (rule: AlertRule) => {
    await handleUpdateRule(rule.id!, { enabled: !rule.enabled });
  };

  const handleDelete = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this alert rule?')) {
      return;
    }

    try {
      const success = await alertService.deleteAlertRule(ruleId);
      if (success) {
        await loadData();
        toast.success('Alert rule deleted', 'Alert rule has been deleted');
      }
    } catch (error) {
      console.error('Failed to delete alert rule:', error);
      toast.error('Failed to delete alert rule', 'Please try again');
    }
  };

  const getRuleTypeLabel = (type: AlertRuleType) => {
    const labels: Record<AlertRuleType, string> = {
      deadline: 'Deadline',
      score: 'Score',
      risk: 'Risk',
      compliance: 'Compliance',
      custom: 'Custom',
    };
    return labels[type] || type;
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'high':
        return 'text-orange-600 dark:text-orange-400';
      case 'normal':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-muted-foreground';
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
            <h1 className="text-3xl font-bold mb-2 text-foreground">Alert Management</h1>
            <p className="text-muted-foreground">
              Configure alert rules and manage upcoming alerts
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Alert Rule
          </Button>
        </div>
      </div>

      {showCreateModal && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create Alert Rule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rule Name</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter rule name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Rule Type</label>
                <select
                  value={newRule.rule_type}
                  onChange={(e) => setNewRule({ ...newRule, rule_type: e.target.value as AlertRuleType })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="deadline">Deadline</option>
                  <option value="score">Score</option>
                  <option value="risk">Risk</option>
                  <option value="compliance">Compliance</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newRule.enabled}
                  onChange={(e) => setNewRule({ ...newRule, enabled: e.target.checked })}
                  className="h-4 w-4"
                />
                <label className="text-sm font-medium">Enabled</label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateRule}>Create Rule</Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Alert Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading alert rules...
              </div>
            ) : alertRules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No alert rules. Create one to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">{rule.name}</h3>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded">
                            {getRuleTypeLabel(rule.rule_type)}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {rule.enabled ? (
                            <span className="text-green-600 dark:text-green-400">Active</span>
                          ) : (
                            <span className="text-muted-foreground">Disabled</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleEnabled(rule)}
                          title={rule.enabled ? 'Disable' : 'Enable'}
                        >
                          {rule.enabled ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingRule(rule)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(rule.id!)}
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

        {/* Upcoming Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming alerts
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`h-5 w-5 ${getPriorityColor(alert.priority)}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(alert.priority)}`}>
                            {alert.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        {alert.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(alert.dueDate).toLocaleDateString()}
                            {alert.daysUntil !== undefined && (
                              <span className="ml-2">
                                ({alert.daysUntil} day{alert.daysUntil !== 1 ? 's' : ''} remaining)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

