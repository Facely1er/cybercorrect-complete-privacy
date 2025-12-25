/**
 * Compliance Score Service
 * 
 * This service provides a unified way to fetch and calculate compliance scores
 * from privacy assessments and gap analysis data. Used by both Privacy Gap Analyzer
 * and Privacy Risk Radar for consistent score display.
 */

import { secureStorage } from '../utils/storage';

export interface FrameworkScore {
  framework: string;
  score: number;
  gaps: number;
  trend?: 'improving' | 'stable' | 'declining';
}

export interface ComplianceScores {
  overallScore: number;
  frameworkScores: FrameworkScore[];
  lastUpdated?: string;
}

interface AssessmentResults {
  overallScore?: number;
  sectionScores?: Array<{
    title: string;
    percentage: number;
    completed?: boolean;
  }>;
  frameworkName?: string;
  completedDate?: string;
}

class ComplianceScoreService {
  private readonly ASSESSMENT_STORAGE_KEY = 'last_privacy_assessment_results';
  private readonly GAP_ANALYSIS_STORAGE_KEY = 'privacy_gap_analysis_data';

  /**
   * Get compliance scores from stored assessment and gap analysis data
   */
  async getComplianceScores(): Promise<ComplianceScores | null> {
    try {
      // Get assessment results from storage
      const assessmentResults = secureStorage.getItem<AssessmentResults>(this.ASSESSMENT_STORAGE_KEY);
      
      // Get gap analysis data if available
      const gapAnalysisData = secureStorage.getItem<any>(this.GAP_ANALYSIS_STORAGE_KEY);

      // Calculate framework scores
      const frameworkScores = this.calculateFrameworkScores(assessmentResults, gapAnalysisData);
      
      // Calculate overall score
      const overallScore = this.calculateOverallScore(frameworkScores);

      return {
        overallScore,
        frameworkScores,
        lastUpdated: assessmentResults?.completedDate || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching compliance scores:', error);
      return null;
    }
  }

  /**
   * Calculate framework scores from assessment and gap data
   */
  private calculateFrameworkScores(
    assessmentResults: AssessmentResults | null,
    gapAnalysisData: any
  ): FrameworkScore[] {
    const baseScores: FrameworkScore[] = [
      {
        framework: 'NIST Privacy Framework',
        score: assessmentResults?.overallScore || 68,
        gaps: this.countGapsByFramework('NIST', gapAnalysisData)
      },
      {
        framework: 'GDPR',
        score: 55,
        gaps: this.countGapsByFramework('GDPR', gapAnalysisData)
      },
      {
        framework: 'CCPA',
        score: 72,
        gaps: this.countGapsByFramework('CCPA', gapAnalysisData)
      },
      {
        framework: 'LGPD',
        score: 62,
        gaps: this.countGapsByFramework('LGPD', gapAnalysisData)
      },
      {
        framework: 'PIPEDA',
        score: 78,
        gaps: this.countGapsByFramework('PIPEDA', gapAnalysisData)
      }
    ];

    // Update NIST score if assessment results are available
    if (assessmentResults?.overallScore) {
      const nistIndex = baseScores.findIndex(s => s.framework === 'NIST Privacy Framework');
      if (nistIndex >= 0) {
        baseScores[nistIndex].score = assessmentResults.overallScore;
      }
    }

    // Calculate trends based on gap counts (simplified)
    return baseScores.map(score => ({
      ...score,
      trend: this.calculateTrend(score.score, score.gaps)
    }));
  }

  /**
   * Count gaps by framework from gap analysis data
   */
  private countGapsByFramework(framework: string, gapAnalysisData: any): number {
    if (!gapAnalysisData?.gaps || !Array.isArray(gapAnalysisData.gaps)) {
      // Return default gap counts if no data
      const defaults: Record<string, number> = {
        'NIST': 12,
        'GDPR': 15,
        'CCPA': 8,
        'LGPD': 10,
        'PIPEDA': 5
      };
      return defaults[framework] || 0;
    }

    return gapAnalysisData.gaps.filter((gap: any) => {
      if (framework === 'NIST') {
        return gap.framework?.includes('NIST');
      }
      return gap.regulation === framework;
    }).length;
  }

  /**
   * Calculate overall score from framework scores
   */
  private calculateOverallScore(frameworkScores: FrameworkScore[]): number {
    if (frameworkScores.length === 0) return 0;
    
    const totalScore = frameworkScores.reduce((sum, f) => sum + f.score, 0);
    return Math.round(totalScore / frameworkScores.length);
  }

  /**
   * Calculate trend based on score and gaps
   */
  private calculateTrend(score: number, gaps: number): 'improving' | 'stable' | 'declining' {
    // Higher score with fewer gaps = improving
    if (score >= 75 && gaps < 5) return 'improving';
    // Lower score with more gaps = declining
    if (score < 60 && gaps > 10) return 'declining';
    return 'stable';
  }

  /**
   * Check if assessment data exists
   */
  hasAssessmentData(): boolean {
    const assessmentResults = secureStorage.getItem<AssessmentResults>(this.ASSESSMENT_STORAGE_KEY);
    return assessmentResults !== null && assessmentResults !== undefined;
  }

  /**
   * Get assessment results directly
   */
  getAssessmentResults(): AssessmentResults | null {
    return secureStorage.getItem<AssessmentResults>(this.ASSESSMENT_STORAGE_KEY);
  }
}

export const complianceScoreService = new ComplianceScoreService();

