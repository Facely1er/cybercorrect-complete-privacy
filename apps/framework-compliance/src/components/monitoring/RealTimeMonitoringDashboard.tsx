import React, { useState } from 'react';
import {
  Activity, TrendingUp, Shield, AlertTriangle,
  RefreshCw,
  Cpu, Network, Database, Lock, FileText, X
} from 'lucide-react';
import { realTimeMonitoring } from '../../utils/monitoring/realTimeMonitoring';
import { useRealTimeMonitoring } from '../../hooks/useRealTimeMonitoring';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

interface RealTimeMonitoringDashboardProps {
  onClose: () => void;
  className?: string;
}

export const RealTimeMonitoringDashboard: React.FC<RealTimeMonitoringDashboardProps> = ({
  onClose,
  className = ''
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { metrics, alerts, loading, refreshData: _refreshData, acknowledgeAlert, exportData, isHealthy: _isHealthy } = useRealTimeMonitoring(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '3h' | '6h' | '24h'>('1h');

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600 dark:text-green-400';
    if (value >= thresholds.warning) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'error': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'info': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const data = await exportData(format);
      const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `monitoring-data-${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading && !metrics) {
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              Loading Real-time Monitoring...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Monitoring Data Unavailable
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Unable to load real-time monitoring data
          </p>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  // Get trend data
  const trendData = realTimeMonitoring.getMetricsHistory(
    selectedTimeframe === '1h' ? 60 : 
    selectedTimeframe === '3h' ? 180 : 
    selectedTimeframe === '6h' ? 360 : 1440
  ).map(m => ({
    time: m.timestamp.toLocaleTimeString(),
    score: m.compliance.overallScore
  }));

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Real-Time Monitoring Dashboard
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Live system performance and compliance status
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-300">Last Updated</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {metrics.timestamp.toLocaleTimeString()}
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-green-100 dark:bg-green-900/30' : ''}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Live' : 'Paused'}
              </Button>
              
              <Button variant="ghost" onClick={onClose} size="sm">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className={`text-lg font-bold ${getStatusColor(metrics.compliance.overallScore, { good: 80, warning: 60 })}`}>
                    {metrics.compliance.overallScore}%
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Compliance Score</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Cpu className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className={`text-lg font-bold ${getStatusColor(100 - (metrics.performance.jsHeapUsed / (1024 * 1024)), { good: 80, warning: 60 })}`}>
                    {Math.round(metrics.performance.jsHeapUsed / (1024 * 1024))}MB
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Memory Usage</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatLevelColor(metrics.security.threatLevel)}`}>
                    {metrics.security.threatLevel.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Threat Level</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Network className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className={`text-lg font-bold ${getStatusColor(1000 - metrics.performance.networkLatency, { good: 800, warning: 500 })}`}>
                    {Math.round(metrics.performance.networkLatency)}ms
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Network Latency</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className={`text-lg font-bold ${getStatusColor(100 - metrics.compliance.criticalGaps * 10, { good: 80, warning: 60 })}`}>
                    {metrics.compliance.criticalGaps}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Critical Gaps</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className={`text-lg font-bold ${getStatusColor(metrics.application.cacheHitRate, { good: 80, warning: 60 })}`}>
                    {Math.round(metrics.application.cacheHitRate)}%
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Cache Hit Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Trend Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-green-600 dark:text-green-400" />
                  Compliance Score Trend
                </CardTitle>
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-600 rounded-lg p-1">
                  {(['1h', '3h', '6h', '24h'] as const).map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        selectedTimeframe === timeframe
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Compliance Score (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* System Health Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Page Load Time</span>
                    <span className={`font-bold ${getStatusColor(5000 - metrics.performance.pageLoadTime, { good: 4000, warning: 2000 })}`}>
                      {Math.round(metrics.performance.pageLoadTime)}ms
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Memory Usage</span>
                    <span className={`font-bold ${getStatusColor(100 - (metrics.performance.jsHeapUsed / metrics.performance.jsHeapTotal * 100), { good: 70, warning: 50 })}`}>
                      {Math.round((metrics.performance.jsHeapUsed / metrics.performance.jsHeapTotal) * 100)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Connection Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {metrics.performance.connectionType}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Network Latency</span>
                    <span className={`font-bold ${getStatusColor(1000 - metrics.performance.networkLatency, { good: 800, warning: 500 })}`}>
                      {Math.round(metrics.performance.networkLatency)}ms
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Authentication</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      metrics.security.authenticationStatus === 'authenticated' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                    }`}>
                      {metrics.security.authenticationStatus}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Session Duration</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round(metrics.security.sessionDuration / (60 * 1000))}min
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Security Events</span>
                    <span className={`font-bold ${metrics.security.securityEvents > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {metrics.security.securityEvents}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Threat Level</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getThreatLevelColor(metrics.security.threatLevel)}`}>
                      {metrics.security.threatLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Alerts */}
          {alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
                  Active Alerts ({alerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/50 dark:bg-gray-800/50">
                              {alert.severity.toUpperCase()}
                            </span>
                            <span className="text-xs">
                              {alert.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="font-medium mb-1">{alert.message}</p>
                          <p className="text-sm opacity-80">
                            Current: {alert.currentValue} | Threshold: {alert.threshold}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="ml-4"
                        >
                          Acknowledge
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex space-x-3">
              <Button onClick={() => handleExport('json')} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              
              <Button onClick={() => handleExport('csv')} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
            
            <Button onClick={onClose}>
              Close Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


