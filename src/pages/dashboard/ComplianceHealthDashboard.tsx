import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { complianceHealthMonitor, ComplianceHealthScore, ScoreTrend } from '../../utils/complianceHealthMonitor';
import { toast } from '../../components/ui/Toaster';

export const ComplianceHealthDashboard: React.FC = () => {
  usePageTitle('Compliance Health Dashboard');
  const [currentScore, setCurrentScore] = useState<ComplianceHealthScore | null>(null);
  const [scoreHistory, setScoreHistory] = useState<ComplianceHealthScore[]>([]);
  const [trend30d, setTrend30d] = useState<ScoreTrend | null>(null);
  const [trend60d, setTrend60d] = useState<ScoreTrend | null>(null);
  const [trend90d, setTrend90d] = useState<ScoreTrend | null>(null);
  const [predictedScore, setPredictedScore] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '60d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFramework, setSelectedFramework] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, [selectedFramework, selectedPeriod]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load current score
      const current = await complianceHealthMonitor.getCurrentScore(selectedFramework);
      setCurrentScore(current);

      // Load score history
      const history = await complianceHealthMonitor.getScoreHistory({
        limit: 100,
        framework: selectedFramework,
        period: selectedPeriod,
      });
      setScoreHistory(history);

      // Load trends
      const trend30 = await complianceHealthMonitor.getTrends({
        framework: selectedFramework,
        period: '30d',
      });
      setTrend30d(trend30);

      const trend60 = await complianceHealthMonitor.getTrends({
        framework: selectedFramework,
        period: '60d',
      });
      setTrend60d(trend60);

      const trend90 = await complianceHealthMonitor.getTrends({
        framework: selectedFramework,
        period: '90d',
      });
      setTrend90d(trend90);

      // Predict future score
      const predicted = complianceHealthMonitor.predictScore(selectedFramework, 30);
      setPredictedScore(predicted);
    } catch (error) {
      console.error('Failed to load compliance health data:', error);
      toast.error('Failed to load compliance health data', 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    if (score >= 40) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getTrendIcon = (trend: ScoreTrend['trend']) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-success" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-destructive" />;
      default:
        return <Minus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: ScoreTrend['trend']) => {
    switch (trend) {
      case 'improving':
        return 'text-success';
      case 'declining':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const currentTrend = selectedPeriod === '30d' ? trend30d : selectedPeriod === '60d' ? trend60d : trend90d;

  // Prepare chart data
  const chartData = scoreHistory.map(score => ({
    date: score.recorded_at ? new Date(score.recorded_at).toLocaleDateString() : '',
    score: score.score,
    framework: score.framework || 'Overall',
  }));

  // Framework distribution
  const frameworkScores = scoreHistory.reduce((acc, score) => {
    const framework = score.framework || 'Overall';
    if (!acc[framework]) {
      acc[framework] = { name: framework, score: 0, count: 0 };
    }
    acc[framework].score += score.score;
    acc[framework].count += 1;
    return acc;
  }, {} as Record<string, { name: string; score: number; count: number }>);

  const frameworkData = Object.values(frameworkScores).map(fw => ({
    name: fw.name,
    score: Math.round(fw.score / fw.count),
  }));

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--destructive))',
    'hsl(var(--accent))'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Compliance Health Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your compliance health score and track trends over time
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
          Loading compliance health data...
        </div>
      ) : (
        <>
          {/* Current Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Current Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentScore ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-6xl font-bold ${getScoreColor(currentScore.score)}`}>
                        {currentScore.score.toFixed(1)}
                      </div>
                      <div className="text-lg text-muted-foreground mt-2">
                        {getScoreLabel(currentScore.score)}
                      </div>
                      {currentScore.framework && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Framework: {currentScore.framework}
                        </div>
                      )}
                    </div>
                    <div className={`p-6 rounded-lg ${getScoreBgColor(currentScore.score)}`}>
                      {currentScore.trend && getTrendIcon(currentScore.trend)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No compliance score recorded yet
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Predicted Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                {predictedScore !== null ? (
                  <div>
                    <div className={`text-4xl font-bold ${getScoreColor(predictedScore)}`}>
                      {predictedScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Predicted in 30 days
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Not enough data to predict
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Trend Cards */}
          {currentTrend && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">30-Day Trend</CardTitle>
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
                  <CardTitle className="text-sm">60-Day Trend</CardTitle>
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
                  <CardTitle className="text-sm">90-Day Trend</CardTitle>
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
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Score History
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
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Compliance Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No score history available
                  </div>
                )}
              </CardContent>
            </Card>

            {frameworkData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Framework Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={frameworkData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, score }) => `${name}: ${score}`}
                        outerRadius={80}
                        fill="hsl(var(--primary))"
                        dataKey="score"
                      >
                        {frameworkData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Score History Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Score History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scoreHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Score</th>
                        <th className="text-left p-2">Framework</th>
                        <th className="text-left p-2">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scoreHistory.slice(0, 20).map((score) => (
                        <tr key={score.id || score.recorded_at} className="border-b">
                          <td className="p-2">
                            {score.recorded_at ? new Date(score.recorded_at).toLocaleDateString() : '-'}
                          </td>
                          <td className="p-2">
                            <span className={`font-semibold ${getScoreColor(score.score)}`}>
                              {score.score.toFixed(1)}
                            </span>
                          </td>
                          <td className="p-2 text-muted-foreground">
                            {score.framework || 'Overall'}
                          </td>
                          <td className="p-2">
                            {score.trend && (
                              <span className="flex items-center gap-1">
                                {getTrendIcon(score.trend)}
                                <span className={getTrendColor(score.trend)}>
                                  {score.trend}
                                </span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No score history available
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

