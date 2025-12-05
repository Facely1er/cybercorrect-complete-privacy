// Alert and reminder service
import { supabase } from '../../lib/supabase';
import { secureStorage } from '../storage/secureStorage';
import { notificationService } from './notificationService';

export type AlertRuleType = 'deadline' | 'score' | 'risk' | 'compliance' | 'custom';
export type AlertPriority = 'low' | 'normal' | 'high' | 'critical';

export interface AlertRule {
  id?: string;
  user_id?: string;
  rule_type: AlertRuleType;
  name: string;
  conditions: Record<string, unknown>;
  actions: Record<string, unknown>;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Alert {
  id: string;
  type: AlertRuleType;
  priority: AlertPriority;
  title: string;
  message: string;
  dueDate?: string;
  daysUntil?: number;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

const ALERT_RULES_STORAGE_KEY = 'cybercorrect_alert_rules';
const ALERTS_STORAGE_KEY = 'cybercorrect_alerts';

class AlertService {
  private alertRulesCache: AlertRule[] = [];
  private alertsCache: Alert[] = [];

  /**
   * Create alert rule
   */
  async createAlertRule(rule: Omit<AlertRule, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<AlertRule | null> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const alertRule: AlertRule = {
        ...rule,
        user_id: user?.id,
      };

      if (user) {
        // Store in Supabase
        const { data, error } = await supabase
          .from('alert_rules')
          .insert(alertRule)
          .select()
          .single();

        if (error) throw error;

        if (data) {
          this.alertRulesCache.push(data as AlertRule);
          this.syncAlertRulesToLocal();
          return data as AlertRule;
        }
      }

      // Fallback to local storage
      return this.createLocalAlertRule(rule);
    } catch (error) {
      console.error('Failed to create alert rule:', error);
      return this.createLocalAlertRule(rule);
    }
  }

  /**
   * Create local alert rule
   */
  private createLocalAlertRule(rule: Omit<AlertRule, 'id' | 'user_id' | 'created_at' | 'updated_at'>): AlertRule {
    const localRule: AlertRule = {
      ...rule,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.alertRulesCache.push(localRule);
    this.syncAlertRulesToLocal();

    return localRule;
  }

  /**
   * Get alert rules
   */
  async getAlertRules(options?: {
    enabledOnly?: boolean;
    ruleType?: AlertRuleType;
  }): Promise<AlertRule[]> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch from Supabase
        let query = supabase
          .from('alert_rules')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (options?.enabledOnly) {
          query = query.eq('enabled', true);
        }

        if (options?.ruleType) {
          query = query.eq('rule_type', options.ruleType);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data) {
          this.alertRulesCache = data as AlertRule[];
          this.syncAlertRulesToLocal();
          return this.alertRulesCache;
        }
      }

      // Fallback to local storage
      return this.getLocalAlertRules(options);
    } catch (error) {
      console.error('Failed to fetch alert rules:', error);
      return this.getLocalAlertRules(options);
    }
  }

  /**
   * Get local alert rules
   */
  private getLocalAlertRules(options?: {
    enabledOnly?: boolean;
    ruleType?: AlertRuleType;
  }): AlertRule[] {
    const localRules = secureStorage.getItem<AlertRule[]>(ALERT_RULES_STORAGE_KEY) || [];
    
    let filtered = [...localRules];

    if (options?.enabledOnly) {
      filtered = filtered.filter(r => r.enabled);
    }

    if (options?.ruleType) {
      filtered = filtered.filter(r => r.rule_type === options.ruleType);
    }

    this.alertRulesCache = filtered;
    return filtered;
  }

  /**
   * Update alert rule
   */
  async updateAlertRule(ruleId: string, updates: Partial<AlertRule>): Promise<boolean> {
    try {
      // Update cache
      this.alertRulesCache = this.alertRulesCache.map(r => 
        r.id === ruleId ? { ...r, ...updates, updated_at: new Date().toISOString() } : r
      );

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Update in Supabase
        const { error } = await supabase
          .from('alert_rules')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', ruleId)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      // Sync to local storage
      this.syncAlertRulesToLocal();

      return true;
    } catch (error) {
      console.error('Failed to update alert rule:', error);
      return false;
    }
  }

  /**
   * Delete alert rule
   */
  async deleteAlertRule(ruleId: string): Promise<boolean> {
    try {
      // Remove from cache
      this.alertRulesCache = this.alertRulesCache.filter(r => r.id !== ruleId);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Delete from Supabase
        const { error } = await supabase
          .from('alert_rules')
          .delete()
          .eq('id', ruleId)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      // Sync to local storage
      this.syncAlertRulesToLocal();

      return true;
    } catch (error) {
      console.error('Failed to delete alert rule:', error);
      return false;
    }
  }

  /**
   * Check deadlines and generate alerts
   */
  async checkDeadlines(deadlines: Array<{
    id: string;
    title: string;
    dueDate: string;
    priority?: AlertPriority;
    actionUrl?: string;
  }>): Promise<Alert[]> {
    try {
      const alerts: Alert[] = [];
      const now = new Date();

      for (const deadline of deadlines) {
        const dueDate = new Date(deadline.dueDate);
        const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Generate alerts at 7, 3, and 1 days before
        if (daysUntil <= 7 && daysUntil > 0) {
          const shouldAlert = daysUntil === 7 || daysUntil === 3 || daysUntil === 1;

          if (shouldAlert) {
            const alert: Alert = {
              id: `deadline_${deadline.id}_${daysUntil}`,
              type: 'deadline',
              priority: deadline.priority || (daysUntil <= 1 ? 'critical' : daysUntil <= 3 ? 'high' : 'normal'),
              title: `Deadline Approaching: ${deadline.title}`,
              message: `${deadline.title} is due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
              dueDate: deadline.dueDate,
              daysUntil,
              actionUrl: deadline.actionUrl,
            };

            alerts.push(alert);

            // Create notification
            await notificationService.createNotification({
              type: 'deadline',
              priority: alert.priority,
              title: alert.title,
              message: alert.message,
              action_url: alert.actionUrl,
              action_label: 'View',
            });
          }
        } else if (daysUntil <= 0) {
          // Overdue
          const alert: Alert = {
            id: `deadline_${deadline.id}_overdue`,
            type: 'deadline',
            priority: 'critical',
            title: `Overdue: ${deadline.title}`,
            message: `${deadline.title} is overdue`,
            dueDate: deadline.dueDate,
            daysUntil: 0,
            actionUrl: deadline.actionUrl,
          };

          alerts.push(alert);

          // Create notification
          await notificationService.createNotification({
            type: 'deadline',
            priority: 'critical',
            title: alert.title,
            message: alert.message,
            action_url: alert.actionUrl,
            action_label: 'View',
          });
        }
      }

      // Update alerts cache
      this.alertsCache = [...this.alertsCache, ...alerts];
      this.syncAlertsToLocal();

      return alerts;
    } catch (error) {
      console.error('Failed to check deadlines:', error);
      return [];
    }
  }

  /**
   * Evaluate alert rules
   */
  async evaluateAlertRules(context: Record<string, unknown>): Promise<Alert[]> {
    try {
      const rules = await this.getAlertRules({ enabledOnly: true });
      const alerts: Alert[] = [];

      for (const rule of rules) {
        const shouldTrigger = this.evaluateRuleConditions(rule.conditions, context);

        if (shouldTrigger) {
          const alert = this.createAlertFromRule(rule, context);
          alerts.push(alert);

          // Execute rule actions
          await this.executeRuleActions(rule.actions, alert);
        }
      }

      // Update alerts cache
      this.alertsCache = [...this.alertsCache, ...alerts];
      this.syncAlertsToLocal();

      return alerts;
    } catch (error) {
      console.error('Failed to evaluate alert rules:', error);
      return [];
    }
  }

  /**
   * Evaluate rule conditions
   */
  private evaluateRuleConditions(conditions: Record<string, unknown>, context: Record<string, unknown>): boolean {
    // Simple condition evaluation
    // In a real implementation, this would be more sophisticated
    for (const [key, value] of Object.entries(conditions)) {
      const contextValue = context[key];
      
      if (typeof value === 'object' && value !== null) {
        // Handle comparison operators
        if ('operator' in value && 'value' in value) {
          const operator = (value as { operator: string; value: unknown }).operator;
          const expectedValue = (value as { operator: string; value: unknown }).value;
          
          switch (operator) {
            case 'gt':
              if (typeof contextValue === 'number' && typeof expectedValue === 'number') {
                if (contextValue <= expectedValue) return false;
              }
              break;
            case 'lt':
              if (typeof contextValue === 'number' && typeof expectedValue === 'number') {
                if (contextValue >= expectedValue) return false;
              }
              break;
            case 'eq':
              if (contextValue !== expectedValue) return false;
              break;
            case 'ne':
              if (contextValue === expectedValue) return false;
              break;
          }
        }
      } else {
        // Simple equality check
        if (contextValue !== value) return false;
      }
    }

    return true;
  }

  /**
   * Create alert from rule
   */
  private createAlertFromRule(rule: AlertRule, context: Record<string, unknown>): Alert {
    return {
      id: `alert_${rule.id}_${Date.now()}`,
      type: rule.rule_type,
      priority: (context.priority as AlertPriority) || 'normal',
      title: rule.name,
      message: context.message as string || `Alert triggered: ${rule.name}`,
      actionUrl: context.actionUrl as string,
      metadata: context,
    };
  }

  /**
   * Execute rule actions
   */
  private async executeRuleActions(actions: Record<string, unknown>, alert: Alert): Promise<void> {
    try {
      // Create notification
      if (actions.createNotification !== false) {
        await notificationService.createNotification({
          type: 'alert',
          priority: alert.priority,
          title: alert.title,
          message: alert.message,
          action_url: alert.actionUrl,
          action_label: 'View',
        });
      }

      // Additional actions can be added here (email, webhook, etc.)
    } catch (error) {
      console.error('Failed to execute rule actions:', error);
    }
  }

  /**
   * Get upcoming alerts
   */
  async getUpcomingAlerts(limit?: number): Promise<Alert[]> {
    try {
      const alerts = secureStorage.getItem<Alert[]>(ALERTS_STORAGE_KEY) || [];
      
      // Filter for upcoming alerts (not past due)
      const upcoming = alerts.filter(alert => {
        if (!alert.dueDate) return true;
        const dueDate = new Date(alert.dueDate);
        return dueDate >= new Date();
      });

      // Sort by due date
      upcoming.sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });

      if (limit) {
        return upcoming.slice(0, limit);
      }

      return upcoming;
    } catch (error) {
      console.error('Failed to get upcoming alerts:', error);
      return [];
    }
  }

  /**
   * Sync alert rules to local storage
   */
  private syncAlertRulesToLocal(): void {
    try {
      secureStorage.setItem(ALERT_RULES_STORAGE_KEY, this.alertRulesCache);
    } catch (error) {
      console.error('Failed to sync alert rules to local storage:', error);
    }
  }

  /**
   * Sync alerts to local storage
   */
  private syncAlertsToLocal(): void {
    try {
      secureStorage.setItem(ALERTS_STORAGE_KEY, this.alertsCache);
    } catch (error) {
      console.error('Failed to sync alerts to local storage:', error);
    }
  }

  /**
   * Initialize alert service
   */
  async initialize(): Promise<void> {
    try {
      // Load from local storage
      const localRules = secureStorage.getItem<AlertRule[]>(ALERT_RULES_STORAGE_KEY);
      if (localRules) {
        this.alertRulesCache = localRules;
      }

      const localAlerts = secureStorage.getItem<Alert[]>(ALERTS_STORAGE_KEY);
      if (localAlerts) {
        this.alertsCache = localAlerts;
      }

      // Fetch from Supabase if authenticated
      await this.getAlertRules();
    } catch (error) {
      console.error('Failed to initialize alert service:', error);
    }
  }
}

export const alertService = new AlertService();

// Initialize on module load
if (typeof window !== 'undefined') {
  alertService.initialize();
}

