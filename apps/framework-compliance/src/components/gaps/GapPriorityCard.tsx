import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  ArrowRight,
  CheckCircle,
  Circle,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';
import {
  IdentifiedGap,
  GAP_DOMAINS,
  GAP_SEVERITY_CONFIG,
  getToolsForGap
} from '../../utils/gapJourneyConfig';

interface GapPriorityCardProps {
  gap: IdentifiedGap;
  onStartGap?: (gapId: string) => void;
  showTools?: boolean;
  compact?: boolean;
}

const GapPriorityCard: React.FC<GapPriorityCardProps> = ({
  gap,
  onStartGap,
  showTools = true,
  compact = false
}) => {
  const domain = GAP_DOMAINS[gap.domain];
  const severityConfig = GAP_SEVERITY_CONFIG[gap.severity];
  const tools = getToolsForGap(gap.domain);
  const DomainIcon = domain.icon;
  const isCompleted = gap.status === 'completed';
  const isInProgress = gap.status === 'in_progress';

  const getSeverityColor = () => {
    switch (gap.severity) {
      case 'critical':
        return 'from-red-500 to-orange-500';
      case 'high':
        return 'from-orange-500 to-amber-500';
      case 'moderate':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  if (compact) {
    return (
      <Card className={`border-2 ${isCompleted ? 'border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/20' : domain.borderColor}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-lg ${domain.bgColor} flex items-center justify-center`}>
                <DomainIcon className={`w-5 h-5 ${domain.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{gap.domainTitle}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${severityConfig.bgColor} ${severityConfig.color}`}>
                    {severityConfig.icon} {severityConfig.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{gap.score}% compliance</p>
              </div>
            </div>
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Button size="sm" onClick={() => onStartGap?.(gap.id)}>
                Start
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 hover:shadow-lg transition-all ${
      isCompleted 
        ? 'border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/20' 
        : isInProgress
        ? 'border-primary shadow-md'
        : domain.borderColor
    }`}>
      <CardContent className="p-6">
        {/* Header with status badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getSeverityColor()} flex items-center justify-center shadow-lg`}>
              <DomainIcon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-foreground">{gap.domainTitle} Domain</h3>
                {isCompleted && (
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    ✓ Completed
                  </span>
                )}
                {isInProgress && (
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary text-white animate-pulse">
                    In Progress
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{gap.description}</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-muted/30 dark:bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{gap.score}%</div>
            <div className="text-xs text-muted-foreground">Current Score</div>
          </div>
          <div className="text-center p-3 bg-muted/30 dark:bg-muted/20 rounded-lg">
            <div className={`text-lg font-bold ${severityConfig.color}`}>
              {severityConfig.icon} {severityConfig.label}
            </div>
            <div className="text-xs text-muted-foreground">Severity</div>
          </div>
          <div className="text-center p-3 bg-muted/30 dark:bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-lg font-bold text-foreground">
              <Clock className="w-4 h-4" />
              {gap.timeline}
            </div>
            <div className="text-xs text-muted-foreground">Timeline</div>
          </div>
          <div className="text-center p-3 bg-muted/30 dark:bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-lg font-bold text-foreground">
              <TrendingUp className="w-4 h-4" />
              {gap.impact}
            </div>
            <div className="text-xs text-muted-foreground">Impact</div>
          </div>
        </div>

        {/* Gap Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Estimated effort:</span>
            <span className="font-medium text-foreground">{gap.estimatedEffort}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Circle className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Priority level:</span>
            <span className="font-medium text-foreground">#{gap.priority} of all gaps</span>
          </div>
        </div>

        {/* Recommended Tools */}
        {showTools && tools.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Recommended Tools to Close This Gap
            </h4>
            <div className="space-y-2">
              {tools.slice(0, 3).map((tool, index) => (
                <Link
                  key={tool.toolId}
                  to={tool.toolPath}
                  className="block p-3 bg-muted/30 dark:bg-muted/20 rounded-lg hover:bg-muted/50 transition-colors border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-foreground text-sm">{tool.toolName}</div>
                      <div className="text-xs text-muted-foreground">{tool.solvesGap}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{tool.estimatedTime}</span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isCompleted && (
          <Button
            className="w-full"
            size="lg"
            onClick={() => onStartGap?.(gap.id)}
          >
            {isInProgress ? 'Continue Working on This Gap' : 'Start Addressing This Gap'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}

        {isCompleted && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-800 dark:text-green-400">
              Gap successfully closed! This area is now compliant.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GapPriorityCard;

