// Report generation service for automated reports
import { supabase } from '../../lib/supabase';
import { secureStorage } from '../storage/secureStorage';
import { logError } from '../common/logger';

export type ReportType = 'compliance' | 'executive' | 'risk' | 'health' | 'quarterly' | 'monthly' | 'weekly' | 'custom';
export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
export type ReportFormat = 'pdf' | 'word' | 'excel' | 'json' | 'csv';

export interface AutomatedReport {
  id?: string;
  user_id?: string;
  report_type: ReportType;
  frequency: ReportFrequency;
  last_generated?: string;
  next_generation: string;
  config?: Record<string, unknown>;
  status: 'active' | 'paused' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
}

export interface ReportData {
  metadata: {
    title: string;
    generated_at: string;
    generated_by: string;
    report_type: ReportType;
    period?: string;
  };
  summary: {
    overall_score?: number;
    total_controls?: number;
    implemented_controls?: number;
    gap_count?: number;
    critical_gaps?: number;
    risk_level?: string;
  };
  details?: Record<string, unknown>;
  recommendations?: Array<{
    priority: string;
    title: string;
    description: string;
    timeframe: string;
    cost?: number;
  }>;
  trends?: {
    score_trend?: 'improving' | 'stable' | 'declining';
    change_percent?: number;
    period?: string;
  };
}

const REPORTS_STORAGE_KEY = 'cybercorrect_automated_reports';
const REPORT_HISTORY_STORAGE_KEY = 'cybercorrect_report_history';

class ReportService {
  private reportsCache: AutomatedReport[] = [];
  private reportHistoryCache: Array<{ id: string; report_type: ReportType; generated_at: string; data: ReportData }> = [];

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    complianceData: {
      overallScore?: number;
      totalControls?: number;
      implementedControls?: number;
      gapCount?: number;
      criticalGaps?: number;
      framework?: string;
      gapAnalysis?: Array<{
        title: string;
        priority: string;
        timeframe: string;
        estimatedCost?: number;
      }>;
    },
    format: ReportFormat = 'pdf'
  ): Promise<Blob | null> {
    try {
      const reportData: ReportData = {
        metadata: {
          title: 'Compliance Report',
          generated_at: new Date().toISOString(),
          generated_by: 'CyberCorrect Privacy Platform',
          report_type: 'compliance',
        },
        summary: {
          overall_score: complianceData.overallScore,
          total_controls: complianceData.totalControls,
          implemented_controls: complianceData.implementedControls,
          gap_count: complianceData.gapCount,
          critical_gaps: complianceData.criticalGaps,
          risk_level: complianceData.overallScore
            ? complianceData.overallScore >= 80
              ? 'Low'
              : complianceData.overallScore >= 60
              ? 'Medium'
              : complianceData.overallScore >= 40
              ? 'High'
              : 'Critical'
            : undefined,
        },
        recommendations: complianceData.gapAnalysis?.map(gap => ({
          priority: gap.priority,
          title: gap.title,
          description: `Implement ${gap.title} according to compliance requirements`,
          timeframe: gap.timeframe,
          cost: gap.estimatedCost,
        })),
      };

      // Generate report based on format
      return await this.generateReportBlob(reportData, format);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to generate compliance report'), {
        context: 'reportService.generateComplianceReport',
        format
      });
      return null;
    }
  }

  /**
   * Generate executive summary
   */
  async generateExecutiveSummary(
    summaryData: {
      overallScore?: number;
      trends?: {
        score_trend?: 'improving' | 'stable' | 'declining';
        change_percent?: number;
        period?: string;
      };
      keyMetrics?: Record<string, unknown>;
      topRisks?: Array<{
        title: string;
        priority: string;
        impact: string;
      }>;
      achievements?: string[];
      nextSteps?: string[];
    },
    format: ReportFormat = 'pdf'
  ): Promise<Blob | null> {
    try {
      const reportData: ReportData = {
        metadata: {
          title: 'Executive Summary',
          generated_at: new Date().toISOString(),
          generated_by: 'CyberCorrect Privacy Platform',
          report_type: 'executive',
        },
        summary: {
          overall_score: summaryData.overallScore,
          risk_level: summaryData.overallScore
            ? summaryData.overallScore >= 80
              ? 'Low'
              : summaryData.overallScore >= 60
              ? 'Medium'
              : summaryData.overallScore >= 40
              ? 'High'
              : 'Critical'
            : undefined,
        },
        trends: summaryData.trends,
        details: summaryData.keyMetrics,
        recommendations: [
          ...(summaryData.topRisks?.map(risk => ({
            priority: risk.priority,
            title: risk.title,
            description: risk.impact,
            timeframe: 'Immediate',
          })) || []),
          ...(summaryData.nextSteps?.map(step => ({
            priority: 'medium',
            title: step,
            description: step,
            timeframe: '30 days',
          })) || []),
        ],
      };

      return await this.generateReportBlob(reportData, format);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to generate executive summary'), {
        context: 'reportService.generateExecutiveSummary',
        format
      });
      return null;
    }
  }

  /**
   * Generate risk report
   */
  async generateRiskReport(
    riskData: {
      risks?: Array<{
        title: string;
        severity: string;
        likelihood: string;
        impact: string;
        mitigation?: string;
      }>;
      overallRiskLevel?: string;
      riskTrend?: 'increasing' | 'stable' | 'decreasing';
    },
    format: ReportFormat = 'pdf'
  ): Promise<Blob | null> {
    try {
      const reportData: ReportData = {
        metadata: {
          title: 'Risk Assessment Report',
          generated_at: new Date().toISOString(),
          generated_by: 'CyberCorrect Privacy Platform',
          report_type: 'risk',
        },
        summary: {
          risk_level: riskData.overallRiskLevel,
        },
        details: {
          risks: riskData.risks,
          risk_trend: riskData.riskTrend,
        },
        recommendations: riskData.risks?.map(risk => ({
          priority: risk.severity,
          title: risk.title,
          description: risk.mitigation || `Mitigate ${risk.title}`,
          timeframe: '30 days',
        })),
      };

      return await this.generateReportBlob(reportData, format);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to generate risk report'), {
        context: 'reportService.generateRiskReport',
        format
      });
      return null;
    }
  }

  /**
   * Generate health report
   */
  async generateHealthReport(
    healthData: {
      currentScore?: number;
      trend?: 'improving' | 'stable' | 'declining';
      changePercent?: number;
      framework?: string;
    },
    format: ReportFormat = 'pdf'
  ): Promise<Blob | null> {
    try {
      const reportData: ReportData = {
        metadata: {
          title: 'Compliance Health Report',
          generated_at: new Date().toISOString(),
          generated_by: 'CyberCorrect Privacy Platform',
          report_type: 'health',
        },
        summary: {
          overall_score: healthData.currentScore,
        },
        trends: {
          score_trend: healthData.trend,
          change_percent: healthData.changePercent,
        },
        details: {
          framework: healthData.framework,
        },
      };

      return await this.generateReportBlob(reportData, format);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to generate health report'), {
        context: 'reportService.generateHealthReport',
        format
      });
      return null;
    }
  }

  /**
   * Generate report blob based on format
   */
  private async generateReportBlob(
    reportData: ReportData,
    format: ReportFormat
  ): Promise<Blob | null> {
    try {
      switch (format) {
        case 'json':
          return new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        
        case 'csv':
          return this.generateCSVReport(reportData);
        
        case 'pdf':
          // Use existing PDF generation utility
          // For now, generate a simple text-based PDF
          return this.generateTextPDF(reportData);
        
        case 'word':
          // Use Word generation utility
          return await this.generateTextWord(reportData);
        
        case 'excel':
          return this.generateExcelReport(reportData);
        
        default:
          return new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to generate report blob'), {
        context: 'reportService.generateReportBlob',
        format
      });
      return null;
    }
  }

  /**
   * Generate CSV report
   */
  private generateCSVReport(reportData: ReportData): Blob {
    const rows: string[] = [];
    
    // Header
    rows.push('Section,Field,Value');
    
    // Summary
    if (reportData.summary) {
      Object.entries(reportData.summary).forEach(([key, value]) => {
        rows.push(`Summary,${key},${value}`);
      });
    }
    
    // Recommendations
    if (reportData.recommendations) {
      reportData.recommendations.forEach((rec, index) => {
        rows.push(`Recommendation ${index + 1},Priority,${rec.priority}`);
        rows.push(`Recommendation ${index + 1},Title,${rec.title}`);
        rows.push(`Recommendation ${index + 1},Timeframe,${rec.timeframe}`);
      });
    }
    
    const csvContent = rows.join('\n');
    return new Blob([csvContent], { type: 'text/csv' });
  }

  /**
   * Generate text-based PDF (simplified)
   */
  private generateTextPDF(reportData: ReportData): Blob {
    const text = this.formatReportAsText(reportData);
    // In a real implementation, use jsPDF or similar library
    // For now, return as text/plain
    return new Blob([text], { type: 'text/plain' });
  }

  /**
   * Generate Word document using docx library
   */
  private async generateTextWord(reportData: ReportData): Promise<Blob> {
    try {
      const { generateReportWord } = await import('../export/generateWord');
      // Generate Word document (this will trigger download)
      // Return a placeholder blob for compatibility
      await generateReportWord({
        title: reportData.metadata.title,
        summary: reportData.summary,
        recommendations: reportData.recommendations,
        metadata: {
          generatedAt: new Date(reportData.metadata.generated_at).toLocaleString(),
          generatedBy: reportData.metadata.generated_by,
        },
      });
      // Return a small blob to indicate success
      return new Blob(['Word document generated'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to generate Word document'), {
        context: 'reportService.generateTextWord',
      });
      // Fallback to text
      const text = this.formatReportAsText(reportData);
      return new Blob([text], { type: 'text/plain' });
    }
  }

  /**
   * Generate Excel report using xlsx library
   */
  private generateExcelReport(reportData: ReportData): Blob {
    try {
      // Dynamic import for Excel generation
      import('../export/generateExcel').then(({ generateReportExcel }) => {
        // Generate Excel workbook (this will trigger download)
        generateReportExcel({
          title: reportData.metadata.title,
          summary: reportData.summary,
          recommendations: reportData.recommendations,
          metadata: {
            generatedAt: new Date(reportData.metadata.generated_at).toLocaleString(),
            generatedBy: reportData.metadata.generated_by,
          },
        });
      }).catch((error) => {
        logError(error instanceof Error ? error : new Error('Failed to import Excel generator'), {
          context: 'reportService.generateExcelReport',
        });
      });
      // Return a small blob to indicate success
      return new Blob(['Excel workbook generated'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to generate Excel report'), {
        context: 'reportService.generateExcelReport',
      });
      // Fallback to CSV
      return this.generateCSVReport(reportData);
    }
  }

  /**
   * Format report as text
   */
  private formatReportAsText(reportData: ReportData): string {
    let text = `${reportData.metadata.title}\n`;
    text += `Generated: ${new Date(reportData.metadata.generated_at).toLocaleString()}\n`;
    text += `Generated by: ${reportData.metadata.generated_by}\n\n`;
    
    text += 'SUMMARY\n';
    text += '=======\n';
    if (reportData.summary) {
      Object.entries(reportData.summary).forEach(([key, value]) => {
        text += `${key}: ${value}\n`;
      });
    }
    
    if (reportData.trends) {
      text += '\nTRENDS\n';
      text += '======\n';
      if (reportData.trends.score_trend) {
        text += `Score Trend: ${reportData.trends.score_trend}\n`;
      }
      if (reportData.trends.change_percent !== undefined) {
        text += `Change: ${reportData.trends.change_percent > 0 ? '+' : ''}${reportData.trends.change_percent.toFixed(1)}%\n`;
      }
    }
    
    if (reportData.recommendations && reportData.recommendations.length > 0) {
      text += '\nRECOMMENDATIONS\n';
      text += '===============\n';
      reportData.recommendations.forEach((rec, index) => {
        text += `${index + 1}. [${rec.priority}] ${rec.title}\n`;
        text += `   ${rec.description}\n`;
        text += `   Timeframe: ${rec.timeframe}\n`;
        if (rec.cost) {
          text += `   Estimated Cost: $${rec.cost}\n`;
        }
        text += '\n';
      });
    }
    
    return text;
  }

  /**
   * Schedule automated report
   */
  async scheduleReport(
    reportType: ReportType,
    frequency: ReportFrequency,
    config?: Record<string, unknown>
  ): Promise<AutomatedReport | null> {
    try {
      // Calculate next generation date
      const nextGeneration = this.calculateNextGeneration(frequency);

      const report: AutomatedReport = {
        report_type: reportType,
        frequency,
        next_generation: nextGeneration.toISOString(),
        config: config || {},
        status: 'active',
      };

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Store in Supabase
        const { data, error } = await supabase
          .from('automated_reports')
          .insert({
            user_id: user.id,
            ...report,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          this.reportsCache.push(data as AutomatedReport);
          this.syncReportsToLocal();
          return data as AutomatedReport;
        }
      }

      // Fallback to local storage
      return this.scheduleLocalReport(report);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to schedule report'), {
        context: 'reportService.scheduleReport',
        reportType
      });
      return this.scheduleLocalReport({
        report_type: reportType,
        frequency,
        next_generation: this.calculateNextGeneration(frequency).toISOString(),
        config: config || {},
        status: 'active',
      });
    }
  }

  /**
   * Schedule local report
   */
  private scheduleLocalReport(report: AutomatedReport): AutomatedReport {
    const localReport: AutomatedReport = {
      ...report,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };

    this.reportsCache.push(localReport);
    this.syncReportsToLocal();

    return localReport;
  }

  /**
   * Calculate next generation date
   */
  private calculateNextGeneration(frequency: ReportFrequency): Date {
    const now = new Date();
    const next = new Date(now);

    switch (frequency) {
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
  }

  /**
   * Get report history
   */
  async getReportHistory(options?: {
    limit?: number;
    report_type?: ReportType;
  }): Promise<Array<{ id: string; report_type: ReportType; generated_at: string; data: ReportData }>> {
    try {
      const history = secureStorage.getItem<typeof this.reportHistoryCache>(REPORT_HISTORY_STORAGE_KEY) || [];
      
      let filtered = [...history];

      if (options?.report_type) {
        filtered = filtered.filter(h => h.report_type === options.report_type);
      }

      // Sort by generated_at descending
      filtered.sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime());

      if (options?.limit) {
        filtered = filtered.slice(0, options.limit);
      }

      this.reportHistoryCache = filtered;
      return filtered;
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to get report history'), {
        context: 'reportService.getReportHistory'
      });
      return [];
    }
  }

  /**
   * Save report to history
   */
  async saveReportToHistory(reportData: ReportData): Promise<void> {
    try {
      const history = secureStorage.getItem<typeof this.reportHistoryCache>(REPORT_HISTORY_STORAGE_KEY) || [];
      
      history.unshift({
        id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        report_type: reportData.metadata.report_type,
        generated_at: reportData.metadata.generated_at,
        data: reportData,
      });

      // Keep only last 100 reports
      if (history.length > 100) {
        history.splice(100);
      }

      secureStorage.setItem(REPORT_HISTORY_STORAGE_KEY, history);
      this.reportHistoryCache = history;
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to save report to history'), {
        context: 'reportService.saveReportToHistory',
        reportType: reportData.metadata.report_type
      });
    }
  }

  /**
   * Sync reports to local storage
   */
  private syncReportsToLocal(): void {
    try {
      secureStorage.setItem(REPORTS_STORAGE_KEY, this.reportsCache);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to sync reports to local storage'), {
        context: 'reportService.syncReportsToLocalStorage'
      });
    }
  }

  /**
   * Initialize report service
   */
  async initialize(): Promise<void> {
    try {
      // Load from local storage
      const localReports = secureStorage.getItem<AutomatedReport[]>(REPORTS_STORAGE_KEY);
      if (localReports) {
        this.reportsCache = localReports;
      }

      // Fetch from Supabase if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('automated_reports')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('next_generation', { ascending: true });

        if (!error && data) {
          this.reportsCache = data as AutomatedReport[];
          this.syncReportsToLocal();
        }
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to initialize report service'), {
        context: 'reportService.initialize'
      });
    }
  }
}

export const reportService = new ReportService();

// Initialize on module load
if (typeof window !== 'undefined') {
  reportService.initialize();
}

