// Predictive analytics for compliance score forecasting and risk prediction
import { complianceHealthMonitor, ScoreTrend } from './complianceHealthMonitor';

export interface ScoreForecast {
  currentScore: number;
  forecast30d: number;
  forecast60d: number;
  forecast90d: number;
  confidence: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface RiskPrediction {
  riskType: string;
  likelihood: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'critical';
  timeframe: string;
  mitigation: string;
}

export interface DeadlineRisk {
  deadlineId: string;
  title: string;
  dueDate: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  daysUntil: number;
  probabilityOfMiss: number;
  recommendedActions: string[];
}

export interface ResourceForecast {
  resourceType: string;
  currentUsage: number;
  forecast30d: number;
  forecast60d: number;
  forecast90d: number;
  recommendations: string[];
}

class PredictiveAnalytics {
  /**
   * Forecast compliance score
   */
  async forecastScore(framework?: string, daysAhead: number = 30): Promise<ScoreForecast | null> {
    try {
      // Get current score
      const currentScore = await complianceHealthMonitor.getCurrentScore(framework);
      if (!currentScore) {
        return null;
      }

      // Get trends
      const trend30d = await complianceHealthMonitor.getTrends({ framework, period: '30d' });
      const trend60d = await complianceHealthMonitor.getTrends({ framework, period: '60d' });
      const trend90d = await complianceHealthMonitor.getTrends({ framework, period: '90d' });

      // Calculate forecasts using linear regression
      const forecast30d = this.calculateForecast(currentScore.score, trend30d, 30);
      const forecast60d = this.calculateForecast(currentScore.score, trend60d, 60);
      const forecast90d = this.calculateForecast(currentScore.score, trend90d, 90);

      // Calculate confidence based on data points
      const confidence = this.calculateConfidence(trend30d, trend60d, trend90d);

      // Determine trend
      const trend = this.determineTrend(forecast30d, currentScore.score);

      return {
        currentScore: currentScore.score,
        forecast30d,
        forecast60d,
        forecast90d,
        confidence,
        trend,
      };
    } catch (error) {
      console.error('Failed to forecast score:', error);
      return null;
    }
  }

  /**
   * Calculate forecast using linear regression
   */
  private calculateForecast(currentScore: number, trend: ScoreTrend, daysAhead: number): number {
    if (trend.scores.length < 2) {
      return currentScore;
    }

    // Simple linear regression
    const n = trend.scores.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    trend.scores.forEach((score, index) => {
      const x = index;
      const y = score.score;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Forecast future score
    const futureX = n + (daysAhead / 7); // Approximate weeks
    const forecast = slope * futureX + intercept;

    return Math.max(0, Math.min(100, forecast));
  }

  /**
   * Calculate confidence level
   */
  private calculateConfidence(trend30d: ScoreTrend, trend60d: ScoreTrend, trend90d: ScoreTrend): number {
    // Confidence based on number of data points
    const dataPoints = trend30d.scores.length + trend60d.scores.length + trend90d.scores.length;
    const maxDataPoints = 30; // Maximum expected data points
    
    // Base confidence on data availability
    let confidence = Math.min(100, (dataPoints / maxDataPoints) * 100);
    
    // Adjust for trend consistency
    if (trend30d.trend === trend60d.trend && trend60d.trend === trend90d.trend) {
      confidence += 10; // More confident if trends are consistent
    }
    
    return Math.min(100, confidence);
  }

  /**
   * Determine trend direction
   */
  private determineTrend(forecast30d: number, currentScore: number): 'improving' | 'stable' | 'declining' {
    const diff = forecast30d - currentScore;
    
    if (diff > 5) {
      return 'improving';
    } else if (diff < -5) {
      return 'declining';
    } else {
      return 'stable';
    }
  }

  /**
   * Predict risks
   */
  async predictRisks(context: {
    currentScore?: number;
    gapCount?: number;
    criticalGaps?: number;
    trend?: 'improving' | 'stable' | 'declining';
  }): Promise<RiskPrediction[]> {
    try {
      const risks: RiskPrediction[] = [];

      // Predict compliance risk
      if (context.currentScore !== undefined) {
        if (context.currentScore < 40) {
          risks.push({
            riskType: 'Compliance Risk',
            likelihood: 'high',
            impact: 'critical',
            timeframe: 'Immediate',
            mitigation: 'Implement critical controls immediately',
          });
        } else if (context.currentScore < 60) {
          risks.push({
            riskType: 'Compliance Risk',
            likelihood: 'medium',
            impact: 'high',
            timeframe: '30 days',
            mitigation: 'Address high-priority gaps',
          });
        }
      }

      // Predict gap-related risks
      if (context.criticalGaps !== undefined && context.criticalGaps > 0) {
        risks.push({
          riskType: 'Gap Risk',
          likelihood: context.criticalGaps > 5 ? 'high' : 'medium',
          impact: 'high',
          timeframe: '30 days',
          mitigation: `Address ${context.criticalGaps} critical gaps`,
        });
      }

      // Predict trend-based risks
      if (context.trend === 'declining') {
        risks.push({
          riskType: 'Declining Compliance',
          likelihood: 'medium',
          impact: 'medium',
          timeframe: '60 days',
          mitigation: 'Review and improve compliance controls',
        });
      }

      return risks;
    } catch (error) {
      console.error('Failed to predict risks:', error);
      return [];
    }
  }

  /**
   * Assess deadline risk
   */
  async assessDeadlineRisk(deadlines: Array<{
    id: string;
    title: string;
    dueDate: string;
    priority?: 'low' | 'normal' | 'high' | 'critical';
  }>): Promise<DeadlineRisk[]> {
    try {
      const risks: DeadlineRisk[] = [];
      const now = new Date();

      for (const deadline of deadlines) {
        const dueDate = new Date(deadline.dueDate);
        const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Calculate probability of missing deadline
        let probabilityOfMiss = 0;
        let riskLevel: DeadlineRisk['riskLevel'] = 'low';
        const recommendedActions: string[] = [];

        if (daysUntil < 0) {
          // Already overdue
          probabilityOfMiss = 100;
          riskLevel = 'critical';
          recommendedActions.push('Immediate action required');
          recommendedActions.push('Notify stakeholders');
        } else if (daysUntil <= 1) {
          // Due today or tomorrow
          probabilityOfMiss = 50;
          riskLevel = 'critical';
          recommendedActions.push('Urgent attention needed');
          recommendedActions.push('Allocate resources immediately');
        } else if (daysUntil <= 3) {
          // Due within 3 days
          probabilityOfMiss = 30;
          riskLevel = 'high';
          recommendedActions.push('Accelerate progress');
          recommendedActions.push('Review resource allocation');
        } else if (daysUntil <= 7) {
          // Due within a week
          probabilityOfMiss = 15;
          riskLevel = 'medium';
          recommendedActions.push('Monitor progress closely');
          recommendedActions.push('Ensure resources are available');
        } else {
          // More than a week away
          probabilityOfMiss = 5;
          riskLevel = 'low';
          recommendedActions.push('Continue normal progress');
        }

        // Adjust based on priority
        if (deadline.priority === 'critical') {
          probabilityOfMiss += 20;
          if (riskLevel !== 'critical') {
            riskLevel = riskLevel === 'low' ? 'medium' : riskLevel === 'medium' ? 'high' : 'critical';
          }
        }

        risks.push({
          deadlineId: deadline.id,
          title: deadline.title,
          dueDate: deadline.dueDate,
          riskLevel,
          daysUntil,
          probabilityOfMiss: Math.min(100, probabilityOfMiss),
          recommendedActions,
        });
      }

      return risks;
    } catch (error) {
      console.error('Failed to assess deadline risk:', error);
      return [];
    }
  }

  /**
   * Forecast resource requirements
   */
  async forecastResources(context: {
    currentScore?: number;
    targetScore?: number;
    gapCount?: number;
    criticalGaps?: number;
  }): Promise<ResourceForecast[]> {
    try {
      const forecasts: ResourceForecast[] = [];

      // Estimate time requirements
      if (context.gapCount !== undefined) {
        const estimatedHours = context.gapCount * 4; // 4 hours per gap on average
        const forecast30d = estimatedHours * 0.3; // 30% in first month
        const forecast60d = estimatedHours * 0.6; // 60% in first 2 months
        const forecast90d = estimatedHours * 0.9; // 90% in first 3 months

        forecasts.push({
          resourceType: 'Time (Hours)',
          currentUsage: 0,
          forecast30d,
          forecast60d,
          forecast90d,
          recommendations: [
            `Estimated ${estimatedHours} hours needed to address all gaps`,
            'Allocate resources based on priority',
            'Consider external consultants for critical gaps',
          ],
        });
      }

      // Estimate cost requirements
      if (context.criticalGaps !== undefined && context.criticalGaps > 0) {
        const estimatedCost = context.criticalGaps * 5000; // $5k per critical gap
        const forecast30d = estimatedCost * 0.4;
        const forecast60d = estimatedCost * 0.7;
        const forecast90d = estimatedCost * 1.0;

        forecasts.push({
          resourceType: 'Cost (USD)',
          currentUsage: 0,
          forecast30d,
          forecast60d,
          forecast90d,
          recommendations: [
            `Estimated $${estimatedCost.toLocaleString()} needed for critical gaps`,
            'Budget for immediate critical gap remediation',
            'Plan for ongoing compliance maintenance',
          ],
        });
      }

      return forecasts;
    } catch (error) {
      console.error('Failed to forecast resources:', error);
      return [];
    }
  }
}

export const predictiveAnalytics = new PredictiveAnalytics();

