import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  JOURNEY_PHASES,
  CRITICALITY_CONFIG,
  TOOL_JOURNEY_MAPPINGS,
  getToolsByPhase,
  getJourneyProgress,
  type JourneyPhase,
  type CriticalityLevel,
  type ToolJourneyMapping
} from '../../utils/customerJourneyConfig';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Target,
  Sparkles,
  Filter,
  LayoutGrid,
  List,
  Milestone
} from 'lucide-react';

interface CustomerJourneyMapProps {
  completedToolIds?: string[];
  currentPersonaId?: string;
  onToolSelect?: (toolId: string) => void;
  showProgress?: boolean;
  compact?: boolean;
}

const CustomerJourneyMap: React.FC<CustomerJourneyMapProps> = ({
  completedToolIds = [],
  currentPersonaId,
  onToolSelect,
  showProgress = true,
  compact = false
}) => {
  const [expandedPhase, setExpandedPhase] = useState<JourneyPhase | null>('discovery');
  const [viewMode, setViewMode] = useState<'journey' | 'grid' | 'list'>('journey');
  const [criticalityFilter, setCriticalityFilter] = useState<CriticalityLevel | 'all'>('all');

  const { phaseProgress, overallProgress, nextRecommendedTools } = getJourneyProgress(completedToolIds);
  const phases = Object.values(JOURNEY_PHASES).sort((a, b) => a.order - b.order);

  const filteredTools = (tools: ToolJourneyMapping[]) => {
    if (criticalityFilter === 'all') return tools;
    return tools.filter(tool => tool.criticality === criticalityFilter);
  };

  const getCriticalityBadge = (criticality: CriticalityLevel) => {
    const config = CRITICALITY_CONFIG[criticality];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color} border ${config.borderColor}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const ToolCard: React.FC<{ tool: ToolJourneyMapping; isCompleted: boolean }> = ({ tool, isCompleted }) => {
    const Icon = tool.icon;
    const phaseConfig = JOURNEY_PHASES[tool.phase];

    return (
      <Card 
        className={`hover:shadow-lg transition-all duration-300 border-2 ${
          isCompleted 
            ? 'border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/20' 
            : phaseConfig.borderColor
        }`}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${phaseConfig.bgColor}`}>
              <Icon className={`h-5 w-5 ${phaseConfig.color}`} />
            </div>
            <div className="flex items-center gap-2">
              {isCompleted && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              {getCriticalityBadge(tool.criticality)}
            </div>
          </div>

          <h3 className="font-semibold text-foreground mb-2">{tool.toolName}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{tool.description}</p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {tool.timeEstimate}
            </span>
            <span className={`px-2 py-0.5 rounded ${
              tool.complexity === 'Basic' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              tool.complexity === 'Intermediate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
            }`}>
              {tool.complexity}
            </span>
          </div>

          {tool.prerequisites.length > 0 && !compact && (
            <div className="mb-4 text-xs">
              <span className="text-muted-foreground">Prerequisites: </span>
              <span className="text-foreground">
                {tool.prerequisites.map(prereq => {
                  const prereqTool = TOOL_JOURNEY_MAPPINGS.find(t => t.toolId === prereq);
                  return prereqTool?.toolName;
                }).filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          <Link
            to={tool.toolPath}
            onClick={() => onToolSelect?.(tool.toolId)}
          >
            <Button
              variant={isCompleted ? 'outline' : 'default'}
              className="w-full"
              size="sm"
            >
              {isCompleted ? 'Review Tool' : 'Launch Tool'}
              <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  };

  const PhaseSection: React.FC<{ phase: typeof JOURNEY_PHASES[JourneyPhase] }> = ({ phase }) => {
    const phaseTools = filteredTools(getToolsByPhase(phase.id));
    const progress = phaseProgress[phase.id];
    const isExpanded = expandedPhase === phase.id;

    return (
      <div className={`rounded-xl border-2 ${phase.borderColor} ${phase.bgColor} overflow-hidden`}>
        <button
          onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
          className="w-full p-4 flex items-center justify-between hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm`}>
              <Milestone className={`h-6 w-6 ${phase.color}`} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">{phase.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${phase.bgColor} ${phase.color}`}>
                  {phase.duration}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{phase.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {showProgress && (
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {progress.completed}/{progress.total} tools
                </div>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${phase.color.replace('text-', 'bg-')} transition-all duration-500`}
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            )}
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {isExpanded && phaseTools.length > 0 && (
          <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phaseTools.map(tool => (
              <ToolCard
                key={tool.toolId}
                tool={tool}
                isCompleted={completedToolIds.includes(tool.toolId)}
              />
            ))}
          </div>
        )}

        {isExpanded && phaseTools.length === 0 && (
          <div className="p-4 pt-0 text-center text-muted-foreground">
            No tools match the current filter in this phase.
          </div>
        )}
      </div>
    );
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredTools(TOOL_JOURNEY_MAPPINGS).map(tool => (
        <ToolCard
          key={tool.toolId}
          tool={tool}
          isCompleted={completedToolIds.includes(tool.toolId)}
        />
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-2">
      {filteredTools(TOOL_JOURNEY_MAPPINGS).map(tool => {
        const Icon = tool.icon;
        const phaseConfig = JOURNEY_PHASES[tool.phase];
        const isCompleted = completedToolIds.includes(tool.toolId);

        return (
          <Link
            key={tool.toolId}
            to={tool.toolPath}
            onClick={() => onToolSelect?.(tool.toolId)}
            className="block"
          >
            <div className={`flex items-center gap-4 p-4 rounded-lg border-2 ${
              isCompleted
                ? 'border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-900/20'
                : 'border-border hover:border-primary/50'
            } transition-all hover:shadow-md`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${phaseConfig.bgColor}`}>
                <Icon className={`h-5 w-5 ${phaseConfig.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">{tool.toolName}</h3>
                  {isCompleted && <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground truncate">{tool.description}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-2 py-1 rounded text-xs ${phaseConfig.bgColor} ${phaseConfig.color}`}>
                  {phaseConfig.name}
                </span>
                {getCriticalityBadge(tool.criticality)}
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      {showProgress && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Your Compliance Journey</h2>
                <p className="text-muted-foreground">
                  Track your progress through the privacy compliance lifecycle
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary">{overallProgress}%</div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
            </div>

            {/* Phase Progress Bars */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {phases.map(phase => (
                <div key={phase.id} className="text-center">
                  <div className="text-xs font-medium text-muted-foreground mb-1">{phase.name}</div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${phase.color.replace('text-', 'bg-')} transition-all duration-500`}
                      style={{ width: `${phaseProgress[phase.id].percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {phaseProgress[phase.id].completed}/{phaseProgress[phase.id].total}
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended Next Tools */}
            {nextRecommendedTools.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Recommended Next Steps</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {nextRecommendedTools.map(tool => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.toolId}
                        to={tool.toolPath}
                        onClick={() => onToolSelect?.(tool.toolId)}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-border hover:border-primary/50 transition-all hover:shadow-md"
                      >
                        <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-sm truncate">{tool.toolName}</div>
                          <div className="text-xs text-muted-foreground">{tool.timeEstimate}</div>
                        </div>
                        {getCriticalityBadge(tool.criticality)}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filters and View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Criticality:</span>
          <div className="flex gap-1">
            <Button
              variant={criticalityFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCriticalityFilter('all')}
            >
              All
            </Button>
            {(Object.keys(CRITICALITY_CONFIG) as CriticalityLevel[]).map(level => (
              <Button
                key={level}
                variant={criticalityFilter === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCriticalityFilter(level)}
                className={criticalityFilter === level ? '' : CRITICALITY_CONFIG[level].color}
              >
                {CRITICALITY_CONFIG[level].icon} {CRITICALITY_CONFIG[level].label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'journey' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('journey')}
          >
            <Milestone className="h-4 w-4 mr-1" />
            Journey
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'journey' && (
        <div className="space-y-4">
          {phases.map(phase => (
            <PhaseSection key={phase.id} phase={phase} />
          ))}
        </div>
      )}

      {viewMode === 'grid' && <GridView />}
      {viewMode === 'list' && <ListView />}
    </div>
  );
};

export default CustomerJourneyMap;

