import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Minus,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Calendar,
  Activity,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { complianceHealthMonitor, ScoreTrend } from '../../utils/complianceHealthMonitor';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from '../../components/ui/Toaster';

export const ProgressTracking: React.FC = () => {
  const [trend30d, setTrend30d] = useState<ScoreTrend | null>(null);
  const [trend60d, setTrend60d] = useState<ScoreTrend | null>(null);
  const [trend90d, setTrend90d] = useState<ScoreTrend | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '60d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [milestones, setMilestones] = useState<Array<{
    id: string;
    title: string;
    targetDate: string;
    status: 'completed' | 'in_progress' | 'pending';
    progress: number;
  }>>([]);

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load trends
      const trend30 = await complianceHealthMonitor.getTrends({ period: '30d' });
      setTrend30d(trend30);

      const trend60 = await complianceHealthMonitor.getTrends({ period: '60d' });
      setTrend60d(trend60);

      const trend90 = await complianceHealthMonitor.getTrends({ period: '90d' });
      setTrend90d(trend90);

      // Load milestones from storage (empty by default)
      const savedMilestones = localStorage.getItem('progress_milestones');
      if (savedMilestones) {
        try {
          setMilestones(JSON.parse(savedMilestones));
        } catch {
          setMilestones([]);
        }
      } else {
        setMilestones([]);
      }
    } catch (error) {
      console.error('Failed to load progress data:', error);
      toast.error('Failed to load progress data', 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const currentTrend = selectedPeriod === '30d' ? trend30d : selectedPeriod === '60d' ? trend60d : trend90d;

  const getTrendIcon = (trend: ScoreTrend['trend']) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <Minus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: ScoreTrend['trend']) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 dark:text-green-400';
      case 'declining':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  // Prepare chart data
  const chartData = currentTrend?.scores.map(score => ({
    date: new Date(score.date).toLocaleDateString(),
    score: score.score,
  })) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Progress Tracking</h1>
            <p className="text-muted-foreground">
              Track your compliance progress and milestones
            </p>
          </div>
          <Button variant="outline" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading progress data...
        </div>
      ) : (
        <>
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">30-Day Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getTrendIcon(trend30d?.trend || 'unknown')}
                  <div>
                    <div className={`text-2xl font-bold ${getTrendColor(trend30d?.trend || 'unknown')}`}>
                      {trend30d?.changePercent ? `${trend30d.changePercent > 0 ? '+' : ''}${trend30d.changePercent.toFixed(1)}%` : '0%'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg: {trend30d?.average.toFixed(1) || '0'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">60-Day Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getTrendIcon(trend60d?.trend || 'unknown')}
                  <div>
                    <div className={`text-2xl font-bold ${getTrendColor(trend60d?.trend || 'unknown')}`}>
                      {trend60d?.changePercent ? `${trend60d.changePercent > 0 ? '+' : ''}${trend60d.changePercent.toFixed(1)}%` : '0%'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg: {trend60d?.average.toFixed(1) || '0'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">90-Day Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getTrendIcon(trend90d?.trend || 'unknown')}
                  <div>
                    <div className={`text-2xl font-bold ${getTrendColor(trend90d?.trend || 'unknown')}`}>
                      {trend90d?.changePercent ? `${trend90d.changePercent > 0 ? '+' : ''}${trend90d.changePercent.toFixed(1)}%` : '0%'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg: {trend90d?.average.toFixed(1) || '0'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Chart */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Compliance Progress
                </CardTitle>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as '30d' | '60d' | '90d')}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="30d">30 Days</option>
                    <option value="60d">60 Days</option>
                    <option value="90d">90 Days</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#0088FE" 
                      strokeWidth={2}
                      name="Compliance Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No progress data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {milestones.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No milestones set
                </div>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(milestone.status)}
                          <div>
                            <h3 className="font-semibold">{milestone.title}</h3>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3" />
                              Target: {new Date(milestone.targetDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' :
                          milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                        }`}>
                          {milestone.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      {milestone.status === 'in_progress' && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{milestone.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${milestone.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

