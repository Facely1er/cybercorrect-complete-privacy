// Regulatory intelligence engine for monitoring and impact analysis
import { supabase } from '../lib/supabase';
import { notificationService } from './notificationService';

export type RegulatoryUpdateType = 'new_regulation' | 'amendment' | 'guidance' | 'enforcement' | 'other';
export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RegulatoryUpdate {
  id: string;
  framework: string;
  region?: string;
  update_type: RegulatoryUpdateType;
  title: string;
  description: string;
  impact_level: ImpactLevel;
  published_at: string;
  affected_users?: string[];
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface ImpactAssessment {
  updateId: string;
  framework: string;
  impactLevel: ImpactLevel;
  affectedControls: string[];
  requiredActions: string[];
  timeframe: string;
  estimatedCost?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface FrameworkTracking {
  framework: string;
  region?: string;
  lastUpdate?: string;
  updateCount: number;
  criticalUpdates: number;
  highImpactUpdates: number;
}

class RegulatoryIntelligence {
  /**
   * Monitor regulatory changes
   */
  async monitorRegulatoryChanges(frameworks?: string[]): Promise<RegulatoryUpdate[]> {
    try {
      // In a real implementation, this would fetch from external APIs
      // For now, fetch from database
      let query = supabase
        .from('regulatory_updates')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(50);

      if (frameworks && frameworks.length > 0) {
        query = query.in('framework', frameworks);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data as RegulatoryUpdate[]) || [];
    } catch (error) {
      console.error('Failed to monitor regulatory changes:', error);
      return [];
    }
  }

  /**
   * Assess impact of regulatory update
   */
  async assessImpact(update: RegulatoryUpdate, userContext?: {
    frameworks?: string[];
    industry?: string;
    region?: string;
  }): Promise<ImpactAssessment | null> {
    try {
      // Determine if update affects user
      let isAffected = false;

      if (userContext?.frameworks) {
        isAffected = userContext.frameworks.includes(update.framework);
      }

      if (userContext?.region && update.region) {
        isAffected = isAffected || userContext.region === update.region;
      }

      if (!isAffected) {
        return null;
      }

      // Assess impact based on update type and level
      const impactLevel = update.impact_level;
      const affectedControls: string[] = [];
      const requiredActions: string[] = [];
      let timeframe = '90 days';
      let estimatedCost = 0;
      let priority: ImpactAssessment['priority'] = 'medium';

      switch (update.update_type) {
        case 'new_regulation':
          affectedControls.push('All controls');
          requiredActions.push('Review new regulation requirements');
          requiredActions.push('Update compliance program');
          requiredActions.push('Train staff on new requirements');
          timeframe = '180 days';
          estimatedCost = 50000;
          priority = impactLevel === 'critical' ? 'critical' : 'high';
          break;

        case 'amendment':
          affectedControls.push('Related controls');
          requiredActions.push('Review amendment details');
          requiredActions.push('Update affected controls');
          timeframe = '90 days';
          estimatedCost = 20000;
          priority = impactLevel === 'critical' ? 'high' : 'medium';
          break;

        case 'guidance':
          affectedControls.push('Guidance-related controls');
          requiredActions.push('Review guidance document');
          requiredActions.push('Update procedures if needed');
          timeframe = '60 days';
          estimatedCost = 10000;
          priority = impactLevel === 'critical' ? 'medium' : 'low';
          break;

        case 'enforcement':
          affectedControls.push('Enforcement-related controls');
          requiredActions.push('Review enforcement action');
          requiredActions.push('Ensure compliance with enforcement requirements');
          timeframe = '30 days';
          estimatedCost = 30000;
          priority = 'high';
          break;

        default:
          affectedControls.push('General controls');
          requiredActions.push('Review update');
          timeframe = '90 days';
          priority = 'medium';
      }

      // Adjust based on impact level
      if (impactLevel === 'critical') {
        timeframe = '30 days';
        estimatedCost *= 2;
        priority = 'critical';
      } else if (impactLevel === 'high') {
        timeframe = '60 days';
        estimatedCost *= 1.5;
        priority = 'high';
      }

      return {
        updateId: update.id,
        framework: update.framework,
        impactLevel,
        affectedControls,
        requiredActions,
        timeframe,
        estimatedCost,
        priority,
      };
    } catch (error) {
      console.error('Failed to assess impact:', error);
      return null;
    }
  }

  /**
   * Get framework-specific updates
   */
  async getFrameworkUpdates(framework: string, limit: number = 20): Promise<RegulatoryUpdate[]> {
    try {
      const { data, error } = await supabase
        .from('regulatory_updates')
        .select('*')
        .eq('framework', framework)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data as RegulatoryUpdate[]) || [];
    } catch (error) {
      console.error('Failed to get framework updates:', error);
      return [];
    }
  }

  /**
   * Get industry-specific updates
   */
  async getIndustryUpdates(industry: string, limit: number = 20): Promise<RegulatoryUpdate[]> {
    try {
      // In a real implementation, filter by industry metadata
      // For now, return all updates
      const { data, error } = await supabase
        .from('regulatory_updates')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data as RegulatoryUpdate[]) || [];
    } catch (error) {
      console.error('Failed to get industry updates:', error);
      return [];
    }
  }

  /**
   * Track framework updates
   */
  async trackFramework(framework: string, region?: string): Promise<FrameworkTracking> {
    try {
      let query = supabase
        .from('regulatory_updates')
        .select('*')
        .eq('framework', framework);

      if (region) {
        query = query.eq('region', region);
      }

      const { data, error } = await query;

      if (error) throw error;

      const updates = (data as RegulatoryUpdate[]) || [];
      const criticalUpdates = updates.filter(u => u.impact_level === 'critical').length;
      const highImpactUpdates = updates.filter(u => u.impact_level === 'high' || u.impact_level === 'critical').length;
      const lastUpdate = updates.length > 0 ? updates[0].published_at : undefined;

      return {
        framework,
        region,
        lastUpdate,
        updateCount: updates.length,
        criticalUpdates,
        highImpactUpdates,
      };
    } catch (error) {
      console.error('Failed to track framework:', error);
      return {
        framework,
        region,
        updateCount: 0,
        criticalUpdates: 0,
        highImpactUpdates: 0,
      };
    }
  }

  /**
   * Notify users about regulatory updates
   */
  async notifyUsers(update: RegulatoryUpdate, affectedUserIds?: string[]): Promise<void> {
    try {
      // If specific users are affected, notify only them
      if (affectedUserIds && affectedUserIds.length > 0) {
        for (const userId of affectedUserIds) {
          await notificationService.createNotification({
            type: 'regulatory',
            priority: update.impact_level === 'critical' ? 'critical' : 
                     update.impact_level === 'high' ? 'high' : 'normal',
            title: `Regulatory Update: ${update.title}`,
            message: update.description,
            action_url: '/regulatory',
            action_label: 'View Update',
            data: { updateId: update.id, framework: update.framework },
          });
        }
      } else {
        // Notify all users (in a real implementation, filter by subscription tier)
        // For now, create a general notification
        await notificationService.createNotification({
          type: 'regulatory',
          priority: update.impact_level === 'critical' ? 'critical' : 
                   update.impact_level === 'high' ? 'high' : 'normal',
          title: `Regulatory Update: ${update.title}`,
          message: update.description,
          action_url: '/regulatory',
          action_label: 'View Update',
          data: { updateId: update.id, framework: update.framework },
        });
      }
    } catch (error) {
      console.error('Failed to notify users:', error);
    }
  }

  /**
   * Get compliance requirement updates
   */
  async getComplianceRequirements(framework: string): Promise<Array<{
    requirement: string;
    description: string;
    effectiveDate: string;
    status: 'new' | 'updated' | 'removed';
  }>> {
    try {
      // In a real implementation, fetch from regulatory database
      // For now, return mock data
      return [
        {
          requirement: 'Data Breach Notification',
          description: '72-hour notification requirement for data breaches',
          effectiveDate: new Date().toISOString(),
          status: 'new',
        },
      ];
    } catch (error) {
      console.error('Failed to get compliance requirements:', error);
      return [];
    }
  }
}

export const regulatoryIntelligence = new RegulatoryIntelligence();

