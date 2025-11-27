// Compliance health monitoring service
import { supabase } from '../../lib/supabase';
import { secureStorage } from '../storage';

export interface ComplianceHealthScore {
  id?: string;
  user_id?: string;
  score: number;
  framework?: string;
  trend?: 'improving' | 'stable' | 'declining' | 'unknown';
  metadata?: Record<string, unknown>;
  recorded_at?: string;
}

export interface ScoreTrend {
  period: '7d' | '30d' | '60d' | '90d';
  scores: Array<{ date: string; score: number }>;
  average: number;
  change: number;
  changePercent: number;
  trend: 'improving' | 'stable' | 'declining';
}

const SCORES_STORAGE_KEY = 'cybercorrect_compliance_scores';

class ComplianceHealthMonitor {
  private scoresCache: ComplianceHealthScore[] = [];

  /**
   * Calculate compliance health score from compliance data
   */
  calculateHealthScore(complianceData: {
    overallScore?: number;
    totalControls?: number;
    implementedControls?: number;
    gapCount?: number;
    criticalGaps?: number;
    framework?: string;
  }): number {
    // If overall score is provided, use it
    if (complianceData.overallScore !== undefined) {
      return Math.max(0, Math.min(100, complianceData.overallScore));
    }

    // Calculate score based on controls
    if (complianceData.totalControls && complianceData.implementedControls !== undefined) {
      const implementationRate = (complianceData.implementedControls / complianceData.totalControls) * 100;
      
      // Adjust for gaps
      let score = implementationRate;
      if (complianceData.gapCount !== undefined && complianceData.totalControls > 0) {
        const gapPenalty = (complianceData.gapCount / complianceData.totalControls) * 20;
        score -= gapPenalty;
      }

      // Additional penalty for critical gaps
      if (complianceData.criticalGaps !== undefined && complianceData.totalControls > 0) {
        const criticalPenalty = (complianceData.criticalGaps / complianceData.totalControls) * 30;
        score -= criticalPenalty;
      }

      return Math.max(0, Math.min(100, score));
    }

    // Default score if no data
    return 0;
  }

  /**
   * Track compliance score
   */
  async trackScore(scoreData: Omit<ComplianceHealthScore, 'id' | 'user_id' | 'recorded_at'>): Promise<ComplianceHealthScore | null> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Calculate trend if we have previous scores
      const previousScores = await this.getScoreHistory({ limit: 1, framework: scoreData.framework });
      let trend: ComplianceHealthScore['trend'] = 'unknown';
      
      if (previousScores.length > 0) {
        const previousScore = previousScores[0].score;
        const diff = scoreData.score - previousScore;
        
        if (diff > 5) {
          trend = 'improving';
        } else if (diff < -5) {
          trend = 'declining';
        } else {
          trend = 'stable';
        }
      }

      const scoreWithTrend: ComplianceHealthScore = {
        ...scoreData,
        trend,
      };

      if (user) {
        // Store in Supabase
        const { data, error } = await supabase
          .from('compliance_health_scores')
          .insert({
            user_id: user.id,
            score: scoreWithTrend.score,
            framework: scoreWithTrend.framework,
            trend: scoreWithTrend.trend,
            metadata: scoreWithTrend.metadata || {},
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          // Update cache
          this.scoresCache.unshift(data as ComplianceHealthScore);
          this.syncScoresToLocal();
          return data as ComplianceHealthScore;
        }
      }

      // Fallback to local storage
      return this.trackLocalScore(scoreWithTrend);
    } catch (error) {
      console.error('Failed to track compliance score:', error);
      return this.trackLocalScore(scoreData);
    }
  }

  /**
   * Track local score
   */
  private trackLocalScore(scoreData: ComplianceHealthScore): ComplianceHealthScore {
    const localScore: ComplianceHealthScore = {
      ...scoreData,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recorded_at: new Date().toISOString(),
    };

    // Add to cache
    this.scoresCache.unshift(localScore);
    this.syncScoresToLocal();

    return localScore;
  }

  /**
   * Get score history
   */
  async getScoreHistory(options?: {
    limit?: number;
    offset?: number;
    framework?: string;
    period?: '7d' | '30d' | '60d' | '90d';
  }): Promise<ComplianceHealthScore[]> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch from Supabase
        let query = supabase
          .from('compliance_health_scores')
          .select('*')
          .eq('user_id', user.id)
          .order('recorded_at', { ascending: false });

        if (options?.framework) {
          query = query.eq('framework', options.framework);
        }

        // Apply period filter
        if (options?.period) {
          const days = {
            '7d': 7,
            '30d': 30,
            '60d': 60,
            '90d': 90,
          }[options.period];
          const date = new Date();
          date.setDate(date.getDate() - days);
          query = query.gte('recorded_at', date.toISOString());
        }

        if (options?.limit) {
          query = query.limit(options.limit);
        }

        if (options?.offset) {
          query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data) {
          this.scoresCache = data as ComplianceHealthScore[];
          this.syncScoresToLocal();
          return this.scoresCache;
        }
      }

      // Fallback to local storage
      return this.getLocalScoreHistory(options);
    } catch (error) {
      console.error('Failed to fetch score history:', error);
      return this.getLocalScoreHistory(options);
    }
  }

  /**
   * Get local score history
   */
  private getLocalScoreHistory(options?: {
    limit?: number;
    offset?: number;
    framework?: string;
    period?: '7d' | '30d' | '60d' | '90d';
  }): ComplianceHealthScore[] {
    const localScores = secureStorage.getItem<ComplianceHealthScore[]>(SCORES_STORAGE_KEY) || [];
    
    let filtered = [...localScores];

    if (options?.framework) {
      filtered = filtered.filter(s => s.framework === options.framework);
    }

    if (options?.period) {
      const days = {
        '7d': 7,
        '30d': 30,
        '60d': 60,
        '90d': 90,
      }[options.period];
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter(s => {
        if (!s.recorded_at) return false;
        return new Date(s.recorded_at) >= cutoffDate;
      });
    }

    // Sort by recorded_at descending
    filtered.sort((a, b) => {
      const dateA = a.recorded_at ? new Date(a.recorded_at).getTime() : 0;
      const dateB = b.recorded_at ? new Date(b.recorded_at).getTime() : 0;
      return dateB - dateA;
    });

    if (options?.limit) {
      filtered = filtered.slice(options.offset || 0, (options.offset || 0) + options.limit);
    }

    this.scoresCache = filtered;
    return filtered;
  }

  /**
   * Get current score
   */
  async getCurrentScore(framework?: string): Promise<ComplianceHealthScore | null> {
    try {
      const history = await this.getScoreHistory({ limit: 1, framework });
      return history.length > 0 ? history[0] : null;
    } catch (error) {
      console.error('Failed to get current score:', error);
      return null;
    }
  }

  /**
   * Get score trends
   */
  async getTrends(options?: {
    framework?: string;
    period?: '7d' | '30d' | '60d' | '90d';
  }): Promise<ScoreTrend> {
    try {
      const period = options?.period || '30d';
      const history = await this.getScoreHistory({ framework: options?.framework, period });

      if (history.length === 0) {
        return {
          period,
          scores: [],
          average: 0,
          change: 0,
          changePercent: 0,
          trend: 'unknown',
        };
      }

      // Calculate average
      const average = history.reduce((sum, score) => sum + score.score, 0) / history.length;

      // Calculate change
      const firstScore = history[history.length - 1].score;
      const lastScore = history[0].score;
      const change = lastScore - firstScore;
      const changePercent = firstScore > 0 ? (change / firstScore) * 100 : 0;

      // Determine trend
      let trend: ScoreTrend['trend'] = 'stable';
      if (change > 5) {
        trend = 'improving';
      } else if (change < -5) {
        trend = 'declining';
      }

      // Format scores for chart
      const scores = history.map(score => ({
        date: score.recorded_at || new Date().toISOString(),
        score: score.score,
      }));

      return {
        period,
        scores,
        average,
        change,
        changePercent,
        trend,
      };
    } catch (error) {
      console.error('Failed to calculate trends:', error);
      return {
        period: options?.period || '30d',
        scores: [],
        average: 0,
        change: 0,
        changePercent: 0,
        trend: 'unknown',
      };
    }
  }

  /**
   * Predict future score (basic linear regression)
   */
  predictScore(framework?: string, daysAhead: number = 30): number | null {
    try {
      const history = this.scoresCache.filter(s => !framework || s.framework === framework);
      
      if (history.length < 2) {
        return null;
      }

      // Simple linear regression
      const sortedHistory = [...history].sort((a, b) => {
        const dateA = a.recorded_at ? new Date(a.recorded_at).getTime() : 0;
        const dateB = b.recorded_at ? new Date(b.recorded_at).getTime() : 0;
        return dateA - dateB;
      });

      const n = sortedHistory.length;
      let sumX = 0;
      let sumY = 0;
      let sumXY = 0;
      let sumX2 = 0;

      sortedHistory.forEach((score, index) => {
        const x = index;
        const y = score.score;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
      });

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      // Predict future score
      const futureX = n + (daysAhead / 7); // Approximate weeks
      const predictedScore = slope * futureX + intercept;

      return Math.max(0, Math.min(100, predictedScore));
    } catch (error) {
      console.error('Failed to predict score:', error);
      return null;
    }
  }

  /**
   * Sync scores to local storage
   */
  private syncScoresToLocal(): void {
    try {
      secureStorage.setItem(SCORES_STORAGE_KEY, this.scoresCache);
    } catch (error) {
      console.error('Failed to sync scores to local storage:', error);
    }
  }

  /**
   * Initialize compliance health monitor
   */
  async initialize(): Promise<void> {
    try {
      // Load from local storage first
      const localScores = secureStorage.getItem<ComplianceHealthScore[]>(SCORES_STORAGE_KEY);
      if (localScores) {
        this.scoresCache = localScores;
      }

      // Fetch from Supabase if authenticated
      await this.getScoreHistory({ limit: 100 });
    } catch (error) {
      console.error('Failed to initialize compliance health monitor:', error);
    }
  }
}

export const complianceHealthMonitor = new ComplianceHealthMonitor();

// Initialize on module load
if (typeof window !== 'undefined') {
  complianceHealthMonitor.initialize();
}

