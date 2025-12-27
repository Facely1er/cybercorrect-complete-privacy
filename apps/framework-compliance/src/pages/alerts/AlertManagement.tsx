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
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { alertService, AlertRule, AlertRuleType, Alert } from '../../utils/compliance';
import { toast } from '../../components/ui/Toaster';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { required, minLength, combine } from '../../utils/validation';

export const AlertManagement: React.FC = () => {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [upcomingAlerts, setUpcomingAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    ruleId: string;
    ruleName: string;
  } | null>(null);
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

  // Form validation errors
  const [ruleNameError, setRuleNameError] = useState<string>();

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

  // Validate rule name field
  const validateRuleName = (value: string): boolean => {
    const result = combine(
      required('Rule name'),
      minLength(3, 'Rule name')
    )(value);

    setRuleNameError(result.error);
    return result.isValid;
  };

  // Handle field blur for validation
  const handleRuleNameBlur = () => {
    validateRuleName(newRule.name);
  };

  // Handle field change and clear errors
  const handleRuleNameChange = (value: string) => {
    setNewRule({ ...newRule, name: value });
    if (ruleNameError) {
      setRuleNameError(undefined);
    }
  };

  const handleCreateRule = async () => {
    try {
      // Validate rule name
      if (!validateRuleName(newRule.name)) {
        toast.error('Validation Error', 'Please fix the errors in the form');
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
        setRuleNameError(undefined);
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
    const rule = alertRules.find(r => r.id === ruleId);
    if (!rule) return;

    setDeleteConfirm({
      open: true,
      ruleId,
      ruleName: rule.name
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const success = await alertService.deleteAlertRule(deleteConfirm.ruleId);
      if (success) {
        await loadData();
        toast.success('Alert rule deleted', `"${deleteConfirm.ruleName}" has been deleted`);
      }
    } catch (error) {
      console.error('Failed to delete alert rule:', error);
      toast.error('Failed to delete alert rule', 'Please try again');
    } finally {
      setDeleteConfirm(null);
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
                <label className="text-sm font-medium mb-2 block">
                  Rule Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => handleRuleNameChange(e.target.value)}
                  onBlur={handleRuleNameBlur}
                  className={`w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 ${
                    ruleNameError
                      ? 'border-destructive focus:ring-destructive'
                      : 'border-border focus:ring-primary'
                  }`}
                  placeholder="Enter rule name (min 3 characters)"
                  aria-invalid={!!ruleNameError}
                  aria-describedby={ruleNameError ? 'ruleName-error' : undefined}
                />
                {ruleNameError && (
                  <p id="ruleName-error" className="text-destructive text-sm mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {ruleNameError}
                  </p>
                )}
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
              <EmptyState
                icon={AlertTriangle}
                title="No Alert Rules"
                description="Create alert rules to get notified about compliance deadlines and important updates"
                action={{
                  label: "Create First Alert Rule",
                  onClick: () => setShowCreateModal(true),
                  icon: Plus
                }}
              />
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
              <EmptyState
                icon={Calendar}
                title="No Upcoming Alerts"
                description="You don't have any scheduled alerts at this time"
              />
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm?.open ?? false}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirm(null);
        }}
        title="Delete Alert Rule?"
        description={`Are you sure you want to delete the alert rule "${deleteConfirm?.ruleName}"? This action cannot be undone and will stop all alerts generated by this rule.`}
        confirmLabel="Delete Rule"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
};


