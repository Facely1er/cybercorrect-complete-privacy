import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { PieChart, CheckCircle, AlertTriangle, Download, FileOutput, ArrowRight, Info, TrendingUp, Shield, Target, Clock, Zap, BookOpen, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SectionScore {
  title: string;
  percentage: number;
  completed: boolean;
}

interface ResultData {
  overallScore: number;
  sectionScores: SectionScore[];
  assessmentType: 'ransomware' | 'supplychain' | 'cui' | 'privacy';
  frameworkName: string;
  completedDate: string;
}

interface AssessmentResultsProps {
  data: ResultData;
  onExport: () => void;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ data, onExport }) => {
  // Helper functions
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-primary';
    if (score >= 40) return 'bg-warning';
    return 'bg-destructive';
  };

  const getSeverityText = (score: number) => {
    if (score >= 80) return 'Low Risk';
    if (score >= 60) return 'Moderate Risk';
    if (score >= 40) return 'High Risk';
    return 'Critical Risk';
  };

  const getScoreHslColor = (score: number) => {
    if (score >= 80) return 'hsl(var(--success))';
    if (score >= 60) return 'hsl(var(--primary))';
    if (score >= 40) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const getMaturityLevel = (score: number) => {
    if (score >= 90) return { level: 'Optimized', description: 'Continuously improving and industry-leading compliance posture' };
    if (score >= 80) return { level: 'Managed', description: 'Strong compliance program with defined processes' };
    if (score >= 70) return { level: 'Defined', description: 'Documented procedures with some gaps remaining' };
    if (score >= 50) return { level: 'Developing', description: 'Basic compliance framework in place' };
    return { level: 'Initial', description: 'Significant gaps requiring immediate attention' };
  };

  const getIndustryBenchmark = (score: number) => {
    // Industry benchmark data (these would typically come from real data)
    const benchmarks = {
      excellent: 85,
      good: 70,
      average: 55,
      belowAverage: 40
    };

    if (score >= benchmarks.excellent) return { position: 'Top 10%', comparison: 'Well above industry average' };
    if (score >= benchmarks.good) return { position: 'Top 30%', comparison: 'Above industry average' };
    if (score >= benchmarks.average) return { position: 'Average', comparison: 'Meeting industry baseline' };
    if (score >= benchmarks.belowAverage) return { position: 'Bottom 50%', comparison: 'Below industry average' };
    return { position: 'Bottom 20%', comparison: 'Significant improvement needed' };
  };

  const getKeyInsights = (score: number, sectionScores: SectionScore[]) => {
    const insights = [];
    const lowestSection = [...sectionScores].sort((a, b) => a.percentage - b.percentage)[0];
    const highestSection = [...sectionScores].sort((a, b) => b.percentage - a.percentage)[0];

    if (highestSection.percentage >= 80) {
      insights.push({
        type: 'strength',
        icon: CheckCircle,
        title: 'Strong Foundation',
        message: `Your ${highestSection.title} practices are exemplary at ${highestSection.percentage}%. This provides a solid foundation to build upon.`
      });
    }

    if (lowestSection.percentage < 60) {
      insights.push({
        type: 'urgent',
        icon: AlertTriangle,
        title: 'Priority Gap Identified',
        message: `Your ${lowestSection.title} area scored ${lowestSection.percentage}% and requires immediate attention to reduce compliance risk.`
      });
    }

    const gapCount = sectionScores.filter(s => s.percentage < 70).length;
    if (gapCount > 0) {
      insights.push({
        type: 'action',
        icon: Target,
        title: 'Action Items',
        message: `${gapCount} area${gapCount > 1 ? 's need' : ' needs'} improvement. Prioritize based on risk and regulatory requirements.`
      });
    }

    return insights;
  };

  const getEstimatedEffort = (score: number) => {
    if (score >= 80) return { time: '1-2 months', effort: 'Low', description: 'Fine-tuning and documentation' };
    if (score >= 60) return { time: '3-6 months', effort: 'Moderate', description: 'Focused improvements in key areas' };
    if (score >= 40) return { time: '6-12 months', effort: 'Significant', description: 'Comprehensive program development' };
    return { time: '12+ months', effort: 'Extensive', description: 'Full privacy program implementation' };
  };

  const maturityLevel = getMaturityLevel(data.overallScore);
  const benchmark = getIndustryBenchmark(data.overallScore);
  const insights = getKeyInsights(data.overallScore, data.sectionScores);
  const effort = getEstimatedEffort(data.overallScore);

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {data.assessmentType === 'cui' && (
                <FileOutput className="h-12 w-12 text-primary" />
              )}
              {data.assessmentType === 'privacy' && (
                <Info className="h-12 w-12 text-accent" />
              )}
              {data.assessmentType === 'ransomware' && (
                <PieChart className="h-12 w-12 text-destructive" />
              )}
              {data.assessmentType === 'supplychain' && (
                <CheckCircle className="h-12 w-12 text-primary" />
              )}
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">Assessment Results</CardTitle>
                <p className="text-muted-foreground">{data.frameworkName} • {data.completedDate}</p>
              </div>
            </div>
            <Button onClick={onExport} variant="default">
              <Download className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/30 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className={`text-6xl font-bold ${getScoreColor(data.overallScore)}`}>{data.overallScore}%</div>
                  <div className={`text-sm font-medium mt-1 ${getScoreColor(data.overallScore)}`}>{getSeverityText(data.overallScore)}</div>

                  {/* Circular progress indicator */}
                  <svg className="absolute -top-4 -left-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      className="fill-none stroke-muted stroke-[5%]"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      className="fill-none stroke-[5%]"
                      stroke={getScoreHslColor(data.overallScore)}
                      strokeDasharray={`${data.overallScore} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-foreground">Overall Compliance Score</div>
                </div>

                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${getScoreBackground(data.overallScore)}`}
                    style={{
                      width: `${data.overallScore}%`
                    }}>
                  </div>
                </div>
              </div>

              {data.overallScore < 70 && (
                <div className="mt-4 p-3 bg-destructive/10 rounded-lg flex items-center text-sm">
                  <AlertTriangle className="h-4 w-4 text-destructive mr-2" />
                  <div>
                    <span className="font-medium">Action required.</span> Your assessment indicates gaps that should be addressed.
                  </div>
                </div>
              )}

              <div className="mt-4">
                <Link to={`/${data.assessmentType}-recommendations`}>
                  <Button variant="default" className="w-full">
                    View Recommendations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-foreground">Section Scores</h3>
              <div className="space-y-4">
                {data.sectionScores.map((section, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium text-foreground">{section.title}</div>
                      <div className={`text-sm font-medium ${getScoreColor(section.percentage)}`}>{section.percentage}%</div>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${getScoreBackground(section.percentage)}`}
                        style={{
                          width: `${section.percentage}%`
                        }}>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Maturity Level</div>
                    <div className="text-lg font-bold text-foreground">{maturityLevel.level}</div>
                    <div className="text-xs text-muted-foreground mt-1">{maturityLevel.description}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Industry Benchmark</div>
                    <div className="text-lg font-bold text-foreground">{benchmark.position}</div>
                    <div className="text-xs text-muted-foreground mt-1">{benchmark.comparison}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Estimated Effort</div>
                    <div className="text-lg font-bold text-foreground">{effort.time}</div>
                    <div className="text-xs text-muted-foreground mt-1">{effort.description}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Quick Wins</div>
                    <div className="text-lg font-bold text-foreground">{data.sectionScores.filter(s => s.percentage >= 65 && s.percentage < 80).length}</div>
                    <div className="text-xs text-muted-foreground mt-1">Areas near completion</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights Section */}
      {insights.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Key Insights from Your Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                const colorClass = insight.type === 'strength' ? 'border-success/30 bg-success/5' : 
                                   insight.type === 'urgent' ? 'border-destructive/30 bg-destructive/5' : 
                                   'border-primary/30 bg-primary/5';
                const iconColor = insight.type === 'strength' ? 'text-success' : 
                                 insight.type === 'urgent' ? 'text-destructive' : 
                                 'text-primary';

                return (
                  <div key={index} className={`p-4 rounded-lg border-2 ${colorClass}`}>
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 ${iconColor} mt-0.5 flex-shrink-0`} />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Executive Summary Section */}
      <Card className="mb-6 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileOutput className="h-5 w-5 text-primary" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your organization achieved an overall compliance score of <strong className="text-foreground">{data.overallScore}%</strong> on 
              the {data.frameworkName} assessment, placing you in the <strong className="text-foreground">{benchmark.position}</strong> of 
              organizations in terms of privacy maturity. This assessment identified both strengths and opportunities for improvement 
              across {data.sectionScores.length} key privacy domains.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Your Strengths
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {data.sectionScores
                    .filter(s => s.percentage >= 70)
                    .map((section, idx) => (
                      <li key={idx}>• {section.title} ({section.percentage}%)</li>
                    ))}
                  {data.sectionScores.filter(s => s.percentage >= 70).length === 0 && (
                    <li className="text-warning">Continue building your compliance foundation</li>
                  )}
                </ul>
              </div>

              <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Priority Focus Areas
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {data.sectionScores
                    .filter(s => s.percentage < 70)
                    .sort((a, b) => a.percentage - b.percentage)
                    .slice(0, 3)
                    .map((section, idx) => (
                      <li key={idx}>• {section.title} ({section.percentage}%) - 
                        <span className={section.percentage < 50 ? 'text-destructive font-medium' : 'text-warning'}>
                          {section.percentage < 50 ? ' Critical' : ' High Priority'}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Recommended Next Steps
              </h4>
              <ol className="text-sm text-muted-foreground space-y-2 ml-4">
                <li>1. Review the detailed gap analysis to understand specific deficiencies</li>
                <li>2. Prioritize remediation efforts based on risk and regulatory requirements</li>
                <li>3. Leverage recommended tools to address identified gaps systematically</li>
                <li>4. Establish a timeline for closing critical gaps within {effort.time}</li>
                <li>5. Schedule a follow-up assessment to measure progress</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Resources Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Supporting Resources & Learning Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://www.nist.gov/privacy-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border-2 border-border hover:border-primary/50 rounded-lg transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    NIST Privacy Framework Guide
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Official framework documentation and implementation guidance
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
            </a>

            <Link
              to="/resources/documentation/assessment-guide"
              className="p-4 border-2 border-border hover:border-primary/50 rounded-lg transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    Reading Assessment Results
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Learn how to interpret scores and develop action plans
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
            </Link>

            <a
              href="https://ico.org.uk/for-organisations/guide-to-data-protection/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border-2 border-border hover:border-primary/50 rounded-lg transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    ICO Data Protection Guide
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive GDPR compliance resources and templates
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
            </a>

            <Link
              to="/toolkit"
              className="p-4 border-2 border-border hover:border-primary/50 rounded-lg transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    Privacy Compliance Toolkit
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Access tools for DPIAs, policy generation, and more
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { AssessmentResults };