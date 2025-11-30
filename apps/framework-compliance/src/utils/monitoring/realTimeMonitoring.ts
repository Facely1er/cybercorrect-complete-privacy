// Real-time monitoring service for compliance, performance, and security metrics
import { errorMonitoring } from '../../lib/errorMonitoring';
import { secureStorage } from '../storage';
import { complianceHealthMonitor } from '../compliance/complianceHealthMonitor';
import { supabase } from '../../lib/supabase';

interface SystemMetrics {
  timestamp: Date;
  performance: {
    pageLoadTime: number;
    jsHeapUsed: number;
    jsHeapTotal: number;
    connectionType: string;
    networkLatency: number;
  };
  security: {
    authenticationStatus: 'authenticated' | 'anonymous' | 'expired';
    sessionDuration: number;
    securityEvents: number;
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  application: {
    assessmentsInProgress: number;
    completedAssessments: number;
    activeUsers: number;
    errorRate: number;
    cacheHitRate: number;
  };
  compliance: {
    overallScore: number;
    criticalGaps: number;
    evidenceCollection: number;
    implementationProgress: number;
  };
}

interface AlertConfig {
  metric: string;
  threshold: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
  enabled: boolean;
  cooldown: number; // milliseconds
}

interface MonitoringAlert {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  metric: string;
  currentValue: number;
  threshold: number;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

const isProduction = import.meta.env.PROD;
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export class RealTimeMonitoring {
  private static instance: RealTimeMonitoring;
  private metricsHistory: SystemMetrics[] = [];
  private activeAlerts: MonitoringAlert[] = [];
  private alertConfigs: AlertConfig[] = [
    {
      metric: 'performance.jsHeapUsed',
      threshold: 80 * 1024 * 1024, // 80MB
      severity: 'warning',
      enabled: true,
      cooldown: 300000 // 5 minutes
    },
    {
      metric: 'application.errorRate',
      threshold: 5, // 5% error rate
      severity: 'error',
      enabled: true,
      cooldown: 60000 // 1 minute
    },
    {
      metric: 'security.threatLevel',
      threshold: 3, // High threat level (numeric: low=1, medium=2, high=3, critical=4)
      severity: 'critical',
      enabled: true,
      cooldown: 0 // No cooldown for security alerts
    },
    {
      metric: 'compliance.criticalGaps',
      threshold: 5, // More than 5 critical gaps
      severity: 'warning',
      enabled: true,
      cooldown: 3600000 // 1 hour
    }
  ];
  private listeners: Array<(metrics: SystemMetrics) => void> = [];
  private alertListeners: Array<(alert: MonitoringAlert) => void> = [];
  private monitoringInterval: number | null = null;
  private sessionStartTime: number = Date.now();
  private errorCount: number = 0;
  private errorWindowStart: number = Date.now();

  static getInstance(): RealTimeMonitoring {
    if (!RealTimeMonitoring.instance) {
      RealTimeMonitoring.instance = new RealTimeMonitoring();
    }
    return RealTimeMonitoring.instance;
  }

  private constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    if (isProduction) {
      this.startRealTimeMonitoring();
      this.setupPerformanceObservers();
      this.setupSecurityMonitoring();
    }
    
    // Track session start
    if (!sessionStorage.getItem('session-start-time')) {
      sessionStorage.setItem('session-start-time', Date.now().toString());
    }
  }

  private startRealTimeMonitoring(): void {
    // Collect metrics every 30 seconds
    this.monitoringInterval = window.setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);

    // Initial collection
    this.collectSystemMetrics();
  }

  private async collectSystemMetrics(): Promise<void> {
    try {
      const metrics: SystemMetrics = {
        timestamp: new Date(),
        performance: await this.collectPerformanceMetrics(),
        security: await this.collectSecurityMetrics(),
        application: await this.collectApplicationMetrics(),
        compliance: await this.collectComplianceMetrics()
      };

      this.metricsHistory.push(metrics);
      
      // Keep only last 24 hours of metrics (2880 entries at 30s intervals)
      if (this.metricsHistory.length > 2880) {
        this.metricsHistory.shift();
      }

      // Check for alerts
      this.checkAlerts(metrics);

      // Notify listeners
      this.notifyListeners(metrics);

      // Cache latest metrics
      await secureStorage.setItem('monitoring:latest', metrics, {
        ttl: 60000, // 1 minute
      });

    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Monitoring error'), {
        tags: { type: 'monitoringError', operation: 'collectMetrics' }
      });
    }
  }

  private async collectPerformanceMetrics(): Promise<SystemMetrics['performance']> {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const memory = (performance as any).memory;
    const connection = (navigator as any).connection;

    return {
      pageLoadTime: navigation ? navigation.loadEventEnd - navigation.navigationStart : 0,
      jsHeapUsed: memory ? memory.usedJSHeapSize : 0,
      jsHeapTotal: memory ? memory.totalJSHeapSize : 0,
      connectionType: connection ? connection.effectiveType : 'unknown',
      networkLatency: await this.measureNetworkLatency()
    };
  }

  private async collectSecurityMetrics(): Promise<SystemMetrics['security']> {
    const sessionStart = sessionStorage.getItem('session-start-time');
    const sessionDuration = sessionStart ? Date.now() - parseInt(sessionStart) : 0;
    
    // Get recent security events from error monitoring
    const recentSecurityEvents = this.getRecentSecurityEvents();

    const threatLevel = this.calculateThreatLevel(recentSecurityEvents);

    return {
      authenticationStatus: await this.getAuthenticationStatus(),
      sessionDuration,
      securityEvents: recentSecurityEvents,
      threatLevel
    };
  }

  private async collectApplicationMetrics(): Promise<SystemMetrics['application']> {
    // Get assessments from storage
    const assessments = secureStorage.getItem<any[]>('cybercorrect-privacy-assessments') || [];
    
    return {
      assessmentsInProgress: assessments.filter((a: any) => !a.isComplete).length,
      completedAssessments: assessments.filter((a: any) => a.isComplete).length,
      activeUsers: 1, // Single user in browser context
      errorRate: this.calculateErrorRate(),
      cacheHitRate: 0 // Placeholder - can be enhanced with actual cache metrics
    };
  }

  private async collectComplianceMetrics(): Promise<SystemMetrics['compliance']> {
    try {
      // Get current compliance score from complianceHealthMonitor
      const currentScore = await complianceHealthMonitor.getCurrentScore();
      const overallScore = currentScore?.score || 0;

      // Calculate critical gaps based on score
      const criticalGaps = Math.max(0, Math.floor((100 - overallScore) / 10));

      return {
        overallScore,
        criticalGaps,
        evidenceCollection: Math.min(100, overallScore + 10),
        implementationProgress: Math.min(100, overallScore + 5)
      };
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Compliance metrics error'), {
        tags: { type: 'monitoringError', operation: 'collectComplianceMetrics' }
      });
      
      return {
        overallScore: 0,
        criticalGaps: 0,
        evidenceCollection: 0,
        implementationProgress: 0
      };
    }
  }

  private async measureNetworkLatency(): Promise<number> {
    if (!navigator.onLine) return -1;

    try {
      const start = performance.now();
      await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' });
      return performance.now() - start;
    } catch {
      return -1;
    }
  }

  private async getAuthenticationStatus(): Promise<'authenticated' | 'anonymous' | 'expired'> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 'anonymous';
      
      // Check if session is expired (Supabase handles this, but we can check)
      return 'authenticated';
    } catch {
      return 'anonymous';
    }
  }

  private getRecentSecurityEvents(): number {
    // Count errors in the last hour
    const oneHourAgo = Date.now() - 3600000;
    if (this.errorWindowStart < oneHourAgo) {
      // Reset error count if window has passed
      this.errorCount = 0;
      this.errorWindowStart = Date.now();
    }
    return this.errorCount;
  }

  private calculateThreatLevel(recentEvents: number): 'low' | 'medium' | 'high' | 'critical' {
    if (recentEvents >= 10) return 'critical';
    if (recentEvents >= 5) return 'high';
    if (recentEvents >= 2) return 'medium';
    return 'low';
  }

  private calculateErrorRate(): number {
    // Calculate error rate based on recent errors
    const oneHourAgo = Date.now() - 3600000;
    if (this.errorWindowStart < oneHourAgo) {
      return 0;
    }
    
    // Simple error count as percentage (max 100%)
    return Math.min(100, this.errorCount);
  }

  // Track error for monitoring
  trackError(): void {
    this.errorCount++;
    const oneHourAgo = Date.now() - 3600000;
    if (this.errorWindowStart < oneHourAgo) {
      this.errorWindowStart = Date.now();
      this.errorCount = 1;
    }
  }

  private checkAlerts(metrics: SystemMetrics): void {
    for (const config of this.alertConfigs) {
      if (!config.enabled) continue;

      const currentValue = this.getMetricValue(metrics, config.metric);
      const shouldAlert = this.shouldTriggerAlert(currentValue, config);

      if (shouldAlert) {
        this.createAlert(config, currentValue, metrics);
      }
    }
  }

  private getMetricValue(metrics: SystemMetrics, metricPath: string): number {
    const path = metricPath.split('.');
    let value: any = metrics;
    
    for (const key of path) {
      value = value?.[key];
    }
    
    // Handle threat level as numeric
    if (metricPath === 'security.threatLevel' && typeof value === 'string') {
      const threatMap: Record<string, number> = {
        'low': 1,
        'medium': 2,
        'high': 3,
        'critical': 4
      };
      return threatMap[value] || 0;
    }
    
    return typeof value === 'number' ? value : 0;
  }

  private shouldTriggerAlert(currentValue: number, config: AlertConfig): boolean {
    // Check if already alerted recently (cooldown)
    const recentAlert = this.activeAlerts.find(alert => 
      alert.metric === config.metric &&
      !alert.acknowledged &&
      Date.now() - alert.timestamp.getTime() < config.cooldown
    );

    if (recentAlert) return false;

    // Check threshold
    return currentValue >= config.threshold;
  }

  private createAlert(config: AlertConfig, currentValue: number, metrics: SystemMetrics): void {
    const alert: MonitoringAlert = {
      id: Date.now().toString(),
      type: config.metric,
      severity: config.severity,
      message: this.generateAlertMessage(config, currentValue),
      metric: config.metric,
      currentValue,
      threshold: config.threshold,
      timestamp: new Date(),
      acknowledged: false
    };

    this.activeAlerts.push(alert);

    // Keep only last 100 alerts
    if (this.activeAlerts.length > 100) {
      this.activeAlerts.shift();
    }

    // Log critical alerts
    if (config.severity === 'critical' || config.severity === 'error') {
      errorMonitoring.captureMessage(`Monitoring alert: ${alert.message}`, config.severity, {
        alertId: alert.id,
        metric: config.metric,
        currentValue,
        threshold: config.threshold
      });
    }

    // Notify alert listeners
    this.notifyAlertListeners(alert);
  }

  private generateAlertMessage(config: AlertConfig, currentValue: number): string {
    const messages: Record<string, (value: number, threshold: number) => string> = {
      'performance.jsHeapUsed': (value, threshold) => 
        `High memory usage: ${Math.round((value / (1024 * 1024)))}MB (threshold: ${Math.round(threshold / (1024 * 1024))}MB)`,
      'application.errorRate': (value, threshold) => 
        `High error rate: ${value}% (threshold: ${threshold}%)`,
      'security.threatLevel': (value, threshold) => 
        `Elevated threat level detected: Level ${value}`,
      'compliance.criticalGaps': (value, threshold) => 
        `Multiple critical compliance gaps: ${value} gaps (threshold: ${threshold})`
    };

    const generator = messages[config.metric];
    return generator ? generator(currentValue, config.threshold) : 
      `Alert: ${config.metric} = ${currentValue} (threshold: ${config.threshold})`;
  }

  // Public API methods
  getLatestMetrics(): SystemMetrics | null {
    return this.metricsHistory[this.metricsHistory.length - 1] || null;
  }

  getMetricsHistory(minutes: number = 60): SystemMetrics[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.metricsHistory.filter(m => m.timestamp.getTime() > cutoff);
  }

  getActiveAlerts(): MonitoringAlert[] {
    return this.activeAlerts.filter(alert => !alert.acknowledged);
  }

  acknowledgeAlert(alertId: string, acknowledgedBy: string): void {
    const alert = this.activeAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = acknowledgedBy;
      alert.acknowledgedAt = new Date();

      errorMonitoring.captureMessage('Alert acknowledged', 'info', {
        alertId,
        acknowledgedBy,
        metric: alert.metric
      });
    }
  }

  subscribe(listener: (metrics: SystemMetrics) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  subscribeToAlerts(listener: (alert: MonitoringAlert) => void): () => void {
    this.alertListeners.push(listener);
    return () => {
      this.alertListeners = this.alertListeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(metrics: SystemMetrics): void {
    this.listeners.forEach(listener => {
      try {
        listener(metrics);
      } catch (error) {
        errorMonitoring.captureException(error instanceof Error ? error : new Error('Listener error'), {
          tags: { type: 'monitoringListenerError' }
        });
      }
    });
  }

  private notifyAlertListeners(alert: MonitoringAlert): void {
    this.alertListeners.forEach(listener => {
      try {
        listener(alert);
      } catch (error) {
        errorMonitoring.captureException(error instanceof Error ? error : new Error('Alert listener error'), {
          tags: { type: 'alertListenerError' }
        });
      }
    });
  }

  private setupPerformanceObservers(): void {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              errorMonitoring.captureMessage('Performance metric: LCP', 'info', {
                metric: 'LCP',
                value: entry.startTime,
                timestamp: Date.now()
              });
            }
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fid = (entry as any).processingStart - entry.startTime;
            errorMonitoring.captureMessage('Performance metric: FID', 'info', {
              metric: 'FID',
              value: fid,
              timestamp: Date.now()
            });
          }
        }).observe({ entryTypes: ['first-input'] });
      } catch (error) {
        // Performance observers not supported or failed
        errorMonitoring.captureException(error instanceof Error ? error : new Error('Performance observer error'), {
          tags: { type: 'performanceObserverError' }
        });
      }
    }
  }

  private setupSecurityMonitoring(): void {
    // Monitor for security-related browser events
    document.addEventListener('securitypolicyviolation', (event) => {
      errorMonitoring.captureMessage('CSP violation detected', 'warning', {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy
      });
      this.trackError();
    });

    // Monitor for failed resource loads (potential security issues)
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        errorMonitoring.captureMessage('Resource load failed', 'info', {
          source: (event.target as any).src || (event.target as any).href,
          type: (event.target as any).tagName
        });
        this.trackError();
      }
    });
  }

  // Dashboard data for real-time compliance monitoring
  async getDashboardData(): Promise<{
    currentStatus: SystemMetrics;
    trends: Array<{ time: string; score: number }>;
    alerts: MonitoringAlert[];
    recommendations: Array<{
      priority: 'high' | 'medium' | 'low';
      title: string;
      description: string;
      action: string;
    }>;
  }> {
    const currentStatus = this.getLatestMetrics();
    const recentMetrics = this.getMetricsHistory(180); // Last 3 hours
    
    const trends = recentMetrics.map(m => ({
      time: m.timestamp.toLocaleTimeString(),
      score: m.compliance.overallScore
    }));

    const alerts = this.getActiveAlerts();
    
    const recommendations = this.generateRecommendations(currentStatus, alerts);

    return {
      currentStatus: currentStatus || await this.createDefaultMetrics(),
      trends,
      alerts,
      recommendations
    };
  }

  private async createDefaultMetrics(): Promise<SystemMetrics> {
    return {
      timestamp: new Date(),
      performance: {
        pageLoadTime: 0,
        jsHeapUsed: 0,
        jsHeapTotal: 0,
        connectionType: 'unknown',
        networkLatency: 0
      },
      security: {
        authenticationStatus: await this.getAuthenticationStatus(),
        sessionDuration: 0,
        securityEvents: 0,
        threatLevel: 'low'
      },
      application: {
        assessmentsInProgress: 0,
        completedAssessments: 0,
        activeUsers: 1,
        errorRate: 0,
        cacheHitRate: 0
      },
      compliance: {
        overallScore: 0,
        criticalGaps: 0,
        evidenceCollection: 0,
        implementationProgress: 0
      }
    };
  }

  private generateRecommendations(
    metrics: SystemMetrics | null, 
    alerts: MonitoringAlert[]
  ): Array<{
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action: string;
  }> {
    const recommendations = [];

    if (!metrics) return recommendations;

    // Performance recommendations
    if (metrics.performance.jsHeapUsed > 50 * 1024 * 1024) { // 50MB
      recommendations.push({
        priority: 'medium' as const,
        title: 'High Memory Usage',
        description: 'Application is using significant memory resources',
        action: 'Consider refreshing the page or closing unused tabs'
      });
    }

    // Security recommendations
    if (metrics.security.threatLevel === 'high' || metrics.security.threatLevel === 'critical') {
      recommendations.push({
        priority: 'high' as const,
        title: 'Elevated Security Threat',
        description: 'Multiple security events detected recently',
        action: 'Review recent activity and ensure system security'
      });
    }

    // Compliance recommendations
    if (metrics.compliance.criticalGaps > 3) {
      recommendations.push({
        priority: 'high' as const,
        title: 'Critical Compliance Gaps',
        description: `${metrics.compliance.criticalGaps} critical compliance gaps identified`,
        action: 'Prioritize addressing critical gaps in your implementation'
      });
    }

    // Application recommendations
    if (metrics.application.errorRate > 2) {
      recommendations.push({
        priority: 'medium' as const,
        title: 'Increased Error Rate',
        description: 'Application errors are above normal levels',
        action: 'Check system status and recent changes'
      });
    }

    return recommendations;
  }

  // Export monitoring data
  async exportMonitoringData(format: 'json' | 'csv' = 'json'): Promise<string> {
    if (format === 'json') {
      return JSON.stringify({
        metrics: this.metricsHistory,
        alerts: this.activeAlerts,
        exportTimestamp: new Date().toISOString(),
        version: APP_VERSION
      }, null, 2);
    } else {
      // CSV format
      const headers = [
        'timestamp', 'overallScore', 'criticalGaps', 'errorRate', 
        'heapUsed', 'threatLevel', 'networkLatency'
      ];
      
      const rows = this.metricsHistory.map(m => [
        m.timestamp.toISOString(),
        m.compliance.overallScore,
        m.compliance.criticalGaps,
        m.application.errorRate,
        Math.round(m.performance.jsHeapUsed / (1024 * 1024)), // MB
        m.security.threatLevel,
        m.performance.networkLatency
      ]);

      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }
  }

  destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.listeners.length = 0;
    this.alertListeners.length = 0;
  }
}

export const realTimeMonitoring = RealTimeMonitoring.getInstance();

// Initialize monitoring when module loads (only in production)
if (isProduction) {
  realTimeMonitoring;
}

