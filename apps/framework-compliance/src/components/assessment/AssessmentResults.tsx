import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { PieChart, CheckCircle, AlertTriangle, Download, FileOutput, ArrowRight, Info, TrendingUp, Shield, Target, Clock, Zap, BookOpen, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './AssessmentResults.module.css';

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
  const overallProgressRef = React.useRef<HTMLDivElement>(null);
  const sectionProgressRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showInsights, setShowInsights] = useState(true);

  // Set CSS custom properties for progress bars
  React.useEffect(() => {
    if (overallProgressRef.current) {
      overallProgressRef.current.style.setProperty('--progress-width', `${data.overallScore}%`);
    }
    
    data.sectionScores.forEach((section, index) => {
      if (sectionProgressRefs.current[index]) {
        sectionProgressRefs.current[index]!.style.setProperty('--progress-width', `${section.percentage}%`);
      }
    });
  }, [data.overallScore, data.sectionScores]);

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

  const getKeyInsights = (sectionScores: SectionScore[]) => {
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
  const insights = getKeyInsights(data.sectionScores);
  const effort = getEstimatedEffort(data.overallScore);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              {data.assessmentType === 'cui' && (
                <FileOutput className="h-8 w-8 sm:h-10 sm:w-10 text-primary flex-shrink-0" />
              )}
              {data.assessmentType === 'privacy' && (
                <Info className="h-8 w-8 sm:h-10 sm:w-10 text-accent flex-shrink-0" />
              )}
              {data.assessmentType === 'ransomware' && (
                <PieChart className="h-8 w-8 sm:h-10 sm:w-10 text-destructive flex-shrink-0" />
              )}
              {data.assessmentType === 'supplychain' && (
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary flex-shrink-0" />
              )}
              <div className="min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground truncate">Assessment Results</CardTitle>
                <p className="text-sm text-muted-foreground truncate">{data.frameworkName} • {data.completedDate}</p>
              </div>
            </div>
            <Button onClick={onExport} variant="default" size="sm" className="flex-shrink-0">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Overall Score - Compact */}
            <div className="lg:col-span-1 bg-muted/30 rounded-lg p-4">
              <div className="text-center mb-4">
                <div className="relative inline-block">
                  <div className={`text-4xl sm:text-5xl font-bold ${getScoreColor(data.overallScore)}`}>{data.overallScore}%</div>
                  <div className={`text-xs sm:text-sm font-medium mt-1 ${getScoreColor(data.overallScore)}`}>{getSeverityText(data.overallScore)}</div>
                  <svg className="absolute -top-2 -left-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-muted stroke-[5%]" />
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

              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground">Compliance Score</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    ref={overallProgressRef}
                    className={`h-2 rounded-full ${getScoreBackground(data.overallScore)} ${styles.progressBar}`}
                  >
                  </div>
                </div>
              </div>

              {data.overallScore < 70 && (
                <div className="mb-3 p-2 bg-destructive/10 rounded-lg flex items-start text-xs gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive flex-shrink-0 mt-0.5" />
                  <span><span className="font-medium">Action required.</span> Address identified gaps.</span>
                </div>
              )}

              <Link to={`/${data.assessmentType}-recommendations`}>
                <Button variant="default" className="w-full text-xs" size="sm">
                  View Recommendations
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* Section Scores - Compact */}
            <div className="lg:col-span-2">
              <h3 className="text-base sm:text-lg font-medium mb-3 text-foreground">Section Scores</h3>
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2">
                {data.sectionScores
                  .sort((a, b) => a.percentage - b.percentage)
                  .map((section, index) => {
                    const originalIndex = data.sectionScores.findIndex(s => s.title === section.title);
                    const isCritical = section.percentage < 50;
                    const isStrong = section.percentage >= 80;
                    
                    return (
                      <div 
                        key={originalIndex}
                        className={`p-2.5 rounded-lg border ${
                          isCritical ? 'border-destructive/30 bg-destructive/5' :
                          isStrong ? 'border-success/30 bg-success/5' :
                          'border-border bg-background'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {isCritical && <AlertTriangle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />}
                            {isStrong && <CheckCircle className="h-3.5 w-3.5 text-success flex-shrink-0" />}
                            <div className="text-xs sm:text-sm font-medium text-foreground truncate">{section.title}</div>
                          </div>
                          <div className={`text-xs sm:text-sm font-semibold ${getScoreColor(section.percentage)} flex-shrink-0 ml-2`}>
                            {section.percentage}%
                          </div>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                          <div
                            ref={(el) => { sectionProgressRefs.current[originalIndex] = el; }}
                            className={`h-1.5 rounded-full ${getScoreBackground(section.percentage)} ${styles.progressBar}`}
                          >
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Enhanced Insights Grid - Compact */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="bg-background border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="text-xs text-muted-foreground">Maturity</div>
              </div>
              <div className="text-base font-bold text-foreground">{maturityLevel.level}</div>
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{maturityLevel.description}</div>
            </div>

            <div className="bg-background border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-secondary flex-shrink-0" />
                <div className="text-xs text-muted-foreground">Benchmark</div>
              </div>
              <div className="text-base font-bold text-foreground">{benchmark.position}</div>
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{benchmark.comparison}</div>
            </div>

            <div className="bg-background border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-warning flex-shrink-0" />
                <div className="text-xs text-muted-foreground">Effort</div>
              </div>
              <div className="text-base font-bold text-foreground">{effort.time}</div>
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{effort.description}</div>
            </div>

            <div className="bg-background border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-success flex-shrink-0" />
                <div className="text-xs text-muted-foreground">Quick Wins</div>
              </div>
              <div className="text-base font-bold text-foreground">{data.sectionScores.filter(s => s.percentage >= 65 && s.percentage < 80).length}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Near completion</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights Section - Collapsible */}
      {insights.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Key Insights
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInsights(!showInsights)}
                className="text-xs"
              >
                {showInsights ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {showInsights && (
            <CardContent className="pt-0">
              <div className="space-y-2.5">
                {insights.map((insight, index) => {
                  const Icon = insight.icon;
                  const colorClass = insight.type === 'strength' ? 'border-success/30 bg-success/5' : 
                                     insight.type === 'urgent' ? 'border-destructive/30 bg-destructive/5' : 
                                     'border-primary/30 bg-primary/5';
                  const iconColor = insight.type === 'strength' ? 'text-success' : 
                                   insight.type === 'urgent' ? 'text-destructive' : 
                                   'text-primary';

                  return (
                    <div key={index} className={`p-3 rounded-lg border ${colorClass}`}>
                      <div className="flex items-start gap-2.5">
                        <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-foreground mb-0.5">{insight.title}</h4>
                          <p className="text-xs text-muted-foreground">{insight.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Executive Summary Section - Collapsible */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <FileOutput className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Executive Summary
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExecutiveSummary(!showExecutiveSummary)}
              className="text-xs"
            >
              {showExecutiveSummary ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {showExecutiveSummary && (
          <CardContent className="pt-0">
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Your organization achieved an overall compliance score of <strong className="text-foreground">{data.overallScore}%</strong> on 
                the {data.frameworkName} assessment, placing you in the <strong className="text-foreground">{benchmark.position}</strong> of 
                organizations in terms of privacy maturity. This assessment identified both strengths and opportunities for improvement 
                across {data.sectionScores.length} key privacy domains.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                    Your Strengths
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
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

                <div className="bg-warning/5 border border-warning/20 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                    Priority Focus Areas
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
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

              <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Target className="h-3.5 w-3.5 text-primary" />
                  Recommended Next Steps
                </h4>
                <ol className="text-xs text-muted-foreground space-y-1.5 ml-4">
                  <li>1. Review the detailed gap analysis to understand specific deficiencies</li>
                  <li>2. Prioritize remediation efforts based on risk and regulatory requirements</li>
                  <li>3. Leverage recommended tools to address identified gaps systematically</li>
                  <li>4. Establish a timeline for closing critical gaps within {effort.time}</li>
                  <li>5. Schedule a follow-up assessment to measure progress</li>
                </ol>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Learning Resources Section - Collapsible */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Learning Resources
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResources(!showResources)}
              className="text-xs"
            >
              {showResources ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {showResources && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://www.nist.gov/privacy-framework"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-border hover:border-primary/50 rounded-lg transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      NIST Privacy Framework Guide
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Official framework documentation and implementation guidance
                    </p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2" />
                </div>
              </a>

              <Link
                to="/resources/documentation/assessment-guide"
                className="p-3 border border-border hover:border-primary/50 rounded-lg transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      Reading Assessment Results
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Learn how to interpret scores and develop action plans
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2" />
                </div>
              </Link>

              <a
                href="https://ico.org.uk/for-organisations/guide-to-data-protection/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-border hover:border-primary/50 rounded-lg transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      ICO Data Protection Guide
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Comprehensive GDPR compliance resources and templates
                    </p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2" />
                </div>
              </a>

              <Link
                to="/toolkit"
                className="p-3 border border-border hover:border-primary/50 rounded-lg transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      Privacy Compliance Toolkit
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Access tools for DPIAs, policy generation, and more
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2" />
                </div>
              </Link>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export { AssessmentResults };
