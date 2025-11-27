import { useState, useEffect, useCallback } from 'react';
import { realTimeMonitoring, SystemMetrics, MonitoringAlert } from '../utils/monitoring/realTimeMonitoring';

interface MonitoringHookState {
  metrics: SystemMetrics | null;
  alerts: MonitoringAlert[];
  isOnline: boolean;
  loading: boolean;
  error: string | null;
}

export const useRealTimeMonitoring = (autoRefresh: boolean = true) => {
  const [state, setState] = useState<MonitoringHookState>({
    metrics: null,
    alerts: [],
    isOnline: navigator.onLine,
    loading: true,
    error: null
  });

  const refreshData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const dashboardData = await realTimeMonitoring.getDashboardData();
      
      setState(prev => ({
        ...prev,
        metrics: dashboardData.currentStatus,
        alerts: dashboardData.alerts,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load monitoring data'
      }));
    }
  }, []);

  useEffect(() => {
    // Initial load
    refreshData();
    
    // Subscribe to real-time updates
    const unsubscribe = realTimeMonitoring.subscribe((metrics: SystemMetrics) => {
      setState(prev => ({
        ...prev,
        metrics
      }));
    });

    // Subscribe to alerts
    const unsubscribeAlerts = realTimeMonitoring.subscribeToAlerts((alert: MonitoringAlert) => {
      setState(prev => ({
        ...prev,
        alerts: [...prev.alerts, alert]
      }));
    });
    
    // Monitor online status
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Auto-refresh setup
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    }

    return () => {
      unsubscribe();
      unsubscribeAlerts();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshData]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    realTimeMonitoring.acknowledgeAlert(alertId, 'user');
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.filter(alert => alert.id !== alertId)
    }));
  }, []);

  const exportData = useCallback(async (format: 'json' | 'csv' = 'json') => {
    return await realTimeMonitoring.exportMonitoringData(format);
  }, []);

  return {
    ...state,
    refreshData,
    acknowledgeAlert,
    exportData,
    isHealthy: state.metrics && 
      state.metrics.compliance.overallScore > 60 && 
      state.metrics.application.errorRate < 5 &&
      state.metrics.security.threatLevel !== 'critical'
  };
};

