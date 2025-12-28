import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useJourneyTool } from '@/hooks/useJourneyTool';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Eye, 
  Lock, 
  Users, 
  Database, 
  Globe, 
  FileText, 
  Zap,
  RefreshCw,
  ArrowLeft,
  Loader2,
  BarChart3
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/Toaster';
import { privacyRiskDetector, type PrivacyRisk, type RiskCategory, type RiskSeverity, type RiskStatus } from '@/services/privacyRiskDetector';
import { privacyMetricsCalculator, type PrivacyMetrics } from '@/services/privacyMetricsCalculator';
import { complianceScoreService, type ComplianceScores } from '@/services/complianceScoreService';
import { EmptyState } from '@/components/ui/EmptyState';

const PrivacyRiskRadar = () => {
  usePageTitle('Privacy Risk Radar');
  useJourneyTool('privacy-risk-radar');
  const navigate = useNavigate();
  
  const [activeRisks, setActiveRisks] = useState<PrivacyRisk[]>([]);
  const [metrics, setMetrics] = useState<PrivacyMetrics | null>(null);
  const [complianceScores, setComplianceScores] = useState<ComplianceScores | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('risks');

  // Load risks and metrics on mount
  useEffect(() => {
    loadData();
  }, []);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadRisks();
      loadMetrics();
    }, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([loadRisks(), loadMetrics(), loadComplianceScores()]);
    setIsLoading(false);
  };

  const loadComplianceScores = async () => {
    try {
      const scores = await complianceScoreService.getComplianceScores();
      setComplianceScores(scores);
    } catch (error) {
      console.error('Error loading compliance scores:', error);
    }
  };

  const loadRisks = async () => {
    try {
      const risks = await privacyRiskDetector.getStoredRisks();
      setActiveRisks(risks);
    } catch (error) {
      console.error('Error loading risks:', error);
      toast.error('Load Failed', 'Failed to load privacy risks. Please try again.');
    }
  };

  const loadMetrics = async () => {
    try {
      const calculatedMetrics = await privacyMetricsCalculator.calculateMetrics();
      setMetrics(calculatedMetrics);
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const handleScanNow = async () => {
    setIsScanning(true);
    try {
      toast.info('Scanning', 'Scanning your privacy data for risks...');
      
      // Scan for new risks
      const detectedRisks = await privacyRiskDetector.scanForRisks();
      
      // Store new risks
      const { getCurrentUser } = await import('@/lib/supabase');
      const { user } = await getCurrentUser();
      if (user) {
        await privacyRiskDetector.storeRisks(user.id, detectedRisks);
      }
      
      // Reload risks
      await loadRisks();
      
      toast.success(
        'Scan Complete',
        `Scan completed. ${detectedRisks.length} new risk(s) detected.`
      );
    } catch (error) {
      console.error('Error scanning for risks:', error);
      toast.error('Scan Failed', 'Failed to scan for risks. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleUpdateRiskStatus = async (riskId: string, status: RiskStatus) => {
    try {
      const success = await privacyRiskDetector.updateRiskStatus(riskId, status);
      if (success) {
        await loadRisks();
        toast.success('Risk Updated', 'Risk status has been updated.');
      } else {
        toast.error('Update Failed', 'Failed to update risk status.');
      }
    } catch (error) {
      console.error('Error updating risk:', error);
      toast.error('Update Failed', 'Failed to update risk status.');
    }
  };

  const getSeverityColor = (severity: RiskSeverity) => {
    switch (severity) {
      case 'critical': return 'text-destructive bg-destructive/10';
      case 'high': return 'text-warning bg-warning/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getCategoryIcon = (category: RiskCategory) => {
    switch (category) {
      case 'data_collection': return <Database className="h-4 w-4" />;
      case 'data_storage': return <Lock className="h-4 w-4" />;
      case 'data_sharing': return <Globe className="h-4 w-4" />;
      case 'consent': return <FileText className="h-4 w-4" />;
      case 'access_rights': return <Eye className="h-4 w-4" />;
      case 'breach_risk': return <AlertTriangle className="h-4 w-4" />;
      case 'retention': return <Activity className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-success" />;
      default: return <Activity className="h-4 w-4 text-primary" />;
    }
  };

  const filteredRisks = useMemo(() => {
    if (selectedCategory === 'all') return activeRisks;
    return activeRisks.filter(risk => risk.category === selectedCategory);
  }, [activeRisks, selectedCategory]);

  const riskDistribution = useMemo(() => {
    return {
      critical: activeRisks.filter(r => r.severity === 'critical' && r.status === 'active').length,
      high: activeRisks.filter(r => r.severity === 'high' && r.status === 'active').length,
      medium: activeRisks.filter(r => r.severity === 'medium' && r.status === 'active').length,
      low: activeRisks.filter(r => r.severity === 'low' && r.status === 'active').length
    };
  }, [activeRisks]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/toolkit" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Toolkit
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Privacy Risk Radar</h1>
            <p className="text-muted-foreground mt-2">
              Continuous monitoring and assessment of privacy compliance risks
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleScanNow}
              disabled={isScanning}
              variant="default"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Scan Now
                </>
              )}
            </Button>
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? "default" : "outline"}
            >
              <Zap className="h-4 w-4 mr-2" />
              {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
            </Button>
          </div>
        </div>
      </div>

      {/* Risk Distribution Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-destructive">Critical Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{riskDistribution.critical}</div>
            <p className="text-xs text-muted-foreground mt-1">Immediate action required</p>
          </CardContent>
        </Card>
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-warning">High Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{riskDistribution.high}</div>
            <p className="text-xs text-muted-foreground mt-1">Urgent attention needed</p>
          </CardContent>
        </Card>
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-warning">Medium Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{riskDistribution.medium}</div>
            <p className="text-xs text-muted-foreground mt-1">Planned remediation</p>
          </CardContent>
        </Card>
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-primary">Low Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{riskDistribution.low}</div>
            <p className="text-xs text-muted-foreground mt-1">Monitoring status</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="risks">Active Risks</TabsTrigger>
          <TabsTrigger value="metrics">Privacy Metrics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Scores</TabsTrigger>
        </TabsList>

        {/* Active Risks Tab */}
        <TabsContent value="risks" className="space-y-4 mt-4">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
            >
              All Categories
            </Button>
            <Button
              onClick={() => setSelectedCategory('data_collection')}
              variant={selectedCategory === 'data_collection' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" /> Data Collection
            </Button>
            <Button
              onClick={() => setSelectedCategory('consent')}
              variant={selectedCategory === 'consent' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> Consent
            </Button>
            <Button
              onClick={() => setSelectedCategory('data_storage')}
              variant={selectedCategory === 'data_storage' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <Lock className="h-4 w-4" /> Data Storage
            </Button>
            <Button
              onClick={() => setSelectedCategory('data_sharing')}
              variant={selectedCategory === 'data_sharing' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" /> Data Sharing
            </Button>
            <Button
              onClick={() => setSelectedCategory('access_rights')}
              variant={selectedCategory === 'access_rights' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" /> Access Rights
            </Button>
          </div>

          {/* Risk List */}
          {filteredRisks.length === 0 ? (
            <EmptyState
              icon={Shield}
              title="No Risks Detected"
              description="No privacy risks found in your data. Click 'Scan Now' to perform a fresh scan of your privacy compliance data."
              action={{
                label: 'Scan Now',
                onClick: handleScanNow,
                icon: RefreshCw
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredRisks.map((risk) => (
                <Card 
                  key={risk.id} 
                  className={`border-l-4 ${
                    risk.severity === 'critical' ? 'border-destructive' :
                    risk.severity === 'high' ? 'border-warning' :
                    risk.severity === 'medium' ? 'border-warning' :
                    'border-primary'
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getCategoryIcon(risk.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{risk.title}</CardTitle>
                            <Badge className={getSeverityColor(risk.severity)}>
                              {risk.severity.toUpperCase()}
                            </Badge>
                            {getTrendIcon(risk.trend)}
                          </div>
                          <p className="text-muted-foreground">{risk.description}</p>
                        </div>
                      </div>
                      <Badge variant={risk.status === 'active' ? 'error' : risk.status === 'mitigated' ? 'success' : 'secondary'}>
                        {risk.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-foreground">Risk ID:</span>
                        <p className="text-muted-foreground">{risk.risk_id}</p>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Detected:</span>
                        <p className="text-muted-foreground">{new Date(risk.detected_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Data Subjects Affected:</span>
                        <p className="text-muted-foreground">{risk.data_subjects_count.toLocaleString()}</p>
                      </div>
                    </div>

                    {risk.regulation && risk.regulation.length > 0 && (
                      <div>
                        <span className="font-medium text-foreground text-sm">Regulatory Requirements:</span>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {risk.regulation.map((reg, idx) => (
                            <Badge key={idx} variant="secondary" size="sm">
                              {reg}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {risk.affected_systems && risk.affected_systems.length > 0 && (
                      <div>
                        <span className="font-medium text-foreground text-sm">Affected Systems:</span>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {risk.affected_systems.map((system, idx) => (
                            <Badge key={idx} variant="info" size="sm">
                              {system}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {risk.remediation_steps && risk.remediation_steps.length > 0 && (
                      <div>
                        <span className="font-medium text-foreground text-sm">Remediation Steps:</span>
                        <ol className="mt-2 space-y-1 ml-4 text-sm text-muted-foreground">
                          {risk.remediation_steps.map((step, idx) => (
                            <li key={idx} className="list-decimal">{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {risk.status === 'active' && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateRiskStatus(risk.id, 'mitigated')}
                        >
                          Mark as Mitigated
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateRiskStatus(risk.id, 'monitoring')}
                        >
                          Mark as Monitoring
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Privacy Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4 mt-4">
          {metrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Data Minimization
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Measurement of unnecessary data collection
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-2xl font-bold">{metrics.dataMinimization}%</span>
                      <Badge variant={metrics.dataMinimization >= 80 ? 'success' : 'warning'}>
                        {metrics.dataMinimization >= 80 ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${metrics.dataMinimization >= 80 ? 'bg-success' : 'bg-warning'}`}
                        style={{ width: `${metrics.dataMinimization}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Consent Coverage
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Valid consent for data processing activities
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-2xl font-bold">{metrics.consentCoverage}%</span>
                      <Badge variant={metrics.consentCoverage >= 90 ? 'success' : 'warning'}>
                        {metrics.consentCoverage >= 90 ? 'Excellent' : 'Good'}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${metrics.consentCoverage >= 90 ? 'bg-success' : 'bg-warning'}`}
                        style={{ width: `${metrics.consentCoverage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Encryption Rate
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Data encrypted at rest and in transit
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-2xl font-bold">{metrics.encryptionRate}%</span>
                      <Badge variant="success">Excellent</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-success"
                        style={{ width: `${metrics.encryptionRate}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Access Control Strength
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Role-based access and least privilege implementation
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-2xl font-bold">{metrics.accessControlStrength}%</span>
                      <Badge variant="warning">Good</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-warning"
                        style={{ width: `${metrics.accessControlStrength}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Retention Compliance
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Data retention policies properly enforced
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-2xl font-bold">{metrics.retentionCompliance}%</span>
                      <Badge variant="success">Good</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-success"
                        style={{ width: `${metrics.retentionCompliance}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Incident Response Readiness
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Breach notification and response preparedness
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-2xl font-bold">{metrics.incidentResponseReadiness}%</span>
                      <Badge variant="warning">Good</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-warning"
                        style={{ width: `${metrics.incidentResponseReadiness}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <EmptyState
              icon={Activity}
              title="No Metrics Available"
              description="Privacy metrics will be calculated from your data. Click 'Scan Now' to refresh."
            />
          )}
        </TabsContent>

        {/* Compliance Scores Tab */}
        <TabsContent value="compliance" className="space-y-4 mt-4">
          {complianceScores ? (
            <div className="space-y-4">
              {/* Overall Score Card */}
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Overall Compliance Score</span>
                    <Badge className="text-lg px-3 py-1">
                      {complianceScores.overallScore}%
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Average compliance across all frameworks
                    {complianceScores.lastUpdated && (
                      <span className="ml-2">
                        • Last updated: {new Date(complianceScores.lastUpdated).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        complianceScores.overallScore >= 80 ? 'bg-success' :
                        complianceScores.overallScore >= 60 ? 'bg-warning' :
                        'bg-destructive'
                      }`}
                      style={{ width: `${complianceScores.overallScore}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Framework Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complianceScores.frameworkScores.map((framework) => (
                  <Card key={framework.framework}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{framework.framework}</CardTitle>
                        <div className="flex items-center gap-2">
                          {framework.trend === 'improving' && (
                            <TrendingUp className="h-4 w-4 text-success" />
                          )}
                          {framework.trend === 'declining' && (
                            <TrendingDown className="h-4 w-4 text-destructive" />
                          )}
                          {framework.trend === 'stable' && (
                            <Activity className="h-4 w-4 text-primary" />
                          )}
                          <Badge
                            className={
                              framework.score >= 80 ? 'bg-success/10 text-success' :
                              framework.score >= 60 ? 'bg-warning/10 text-warning' :
                              'bg-destructive/10 text-destructive'
                            }
                          >
                            {framework.score}%
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Gaps identified:</span>
                          <span className="font-medium">{framework.gaps}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              framework.score >= 80 ? 'bg-success' :
                              framework.score >= 60 ? 'bg-warning' :
                              'bg-destructive'
                            }`}
                            style={{ width: `${framework.score}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/toolkit/privacy-gap-analyzer">
                      <Button variant="default" className="w-full sm:w-auto">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Detailed Gap Analysis
                      </Button>
                    </Link>
                    <Link to="/toolkit/privacy-assessment">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <FileCheck className="h-4 w-4 mr-2" />
                        Take Privacy Assessment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Compliance Scoring</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Compliance scores are calculated from your privacy assessment results and gap analysis.
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <EmptyState
                    icon={BarChart3}
                    title="No Compliance Scores Available"
                    description="Complete a privacy assessment or gap analysis to see your compliance scores here."
                    action={{
                      label: 'Take Privacy Assessment',
                      onClick: () => navigate('/toolkit/privacy-assessment'),
                      icon: FileCheck
                    }}
                  />
                  <div className="mt-4 flex gap-3 justify-center">
                    <Link to="/toolkit/privacy-gap-analyzer">
                      <Button variant="outline">
                        View Gap Analysis
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrivacyRiskRadar;

