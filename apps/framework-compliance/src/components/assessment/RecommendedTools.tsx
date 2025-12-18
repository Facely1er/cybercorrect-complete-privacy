import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  FileCheck, 
  Database, 
  Building, 
  ArrowRight,
  Target,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Video,
  HelpCircle
} from 'lucide-react';

interface SectionScore {
  title: string;
  percentage: number;
  completed?: boolean;
}

interface AssessmentResults {
  overallScore?: number;
  sectionScores?: SectionScore[];
  frameworkName?: string;
}

interface RecommendedTool {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  priority: 'critical' | 'high' | 'medium';
  reason: string;
  category: string;
  estimatedTime?: string;
  learningResources?: {
    type: 'video' | 'article' | 'guide';
    title: string;
    url: string;
    duration?: string;
  }[];
  prerequisites?: string[];
}

interface RecommendedToolsProps {
  assessmentResults: AssessmentResults;
  onToolClick?: (toolId: string) => void;
}

const RecommendedTools: React.FC<RecommendedToolsProps> = ({ 
  assessmentResults, 
  onToolClick 
}) => {
  // Determine recommended tools based on assessment results
  const getRecommendedTools = (): RecommendedTool[] => {
    const tools: RecommendedTool[] = [];
    const sectionScores = assessmentResults.sectionScores || [];
    
    // Always recommend Privacy Gap Analyzer first
    tools.push({
      id: 'privacy-gap-analyzer',
      title: 'Privacy Gap Analyzer',
      description: 'Get detailed gap analysis based on your assessment results with prioritized remediation steps',
      path: '/toolkit/privacy-gap-analyzer',
      icon: BarChart3,
      priority: 'critical',
      reason: 'Directly analyzes your assessment results to identify specific compliance gaps',
      category: 'Assessment',
      estimatedTime: '15-20 minutes',
      learningResources: [
        {
          type: 'guide',
          title: 'How to Use the Gap Analyzer',
          url: '/resources/documentation/gap-analysis-guide',
          duration: '5 min read'
        },
        {
          type: 'article',
          title: 'Understanding Privacy Gaps',
          url: '/resources/documentation/understanding-gaps',
          duration: '8 min read'
        }
      ],
      prerequisites: ['Completed privacy assessment', 'Organization profile setup']
    });

    // Recommend based on section scores
    sectionScores.forEach(section => {
      if (section.percentage < 70) {
        switch (section.title) {
          case 'Identify':
            // Low Identify score - need data mapping
            if (!tools.find(t => t.id === 'gdpr-mapper')) {
              tools.push({
                id: 'gdpr-mapper',
                title: 'GDPR Data Mapper',
                description: 'Map your data processing activities to address gaps in data identification',
                path: '/toolkit/gdpr-mapper',
                icon: Database,
                priority: section.percentage < 60 ? 'critical' : 'high',
                reason: `Your ${section.title} section scored ${section.percentage}% - data mapping will help identify all processing activities`,
                category: 'Data Management',
                estimatedTime: '30-45 minutes',
                learningResources: [
                  {
                    type: 'guide',
                    title: 'Data Mapping Best Practices',
                    url: '/resources/documentation/data-mapping-guide',
                    duration: '10 min read'
                  }
                ],
                prerequisites: ['List of systems and data sources']
              });
            }
            break;
          
          case 'Control':
            // Low Control score - need DPIA
            if (!tools.find(t => t.id === 'dpia-generator')) {
              tools.push({
                id: 'dpia-generator',
                title: 'DPIA Generator',
                description: 'Generate Data Protection Impact Assessments for high-risk processing activities',
                path: '/toolkit/dpia-generator',
                icon: FileCheck,
                priority: section.percentage < 60 ? 'critical' : 'high',
                reason: `Your ${section.title} section scored ${section.percentage}% - DPIAs help assess and mitigate privacy risks`,
                category: 'Documentation',
                estimatedTime: '45-60 minutes',
                learningResources: [
                  {
                    type: 'guide',
                    title: 'DPIA Step-by-Step Guide',
                    url: '/resources/documentation/dpia-guide',
                    duration: '12 min read'
                  },
                  {
                    type: 'article',
                    title: 'When DPIAs are Required',
                    url: 'https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/accountability-and-governance/data-protection-impact-assessments/',
                    duration: '6 min read'
                  }
                ],
                prerequisites: ['Data processing activities documented', 'Risk assessment framework']
              });
            }
            break;
          
          case 'Protect':
            // Low Protect score - need vendor assessment
            if (!tools.find(t => t.id === 'vendor-risk-assessment')) {
              tools.push({
                id: 'vendor-risk-assessment',
                title: 'Vendor Risk Assessment',
                description: 'Assess third-party vendors to ensure they meet your privacy protection requirements',
                path: '/toolkit/vendor-risk-assessment',
                icon: Building,
                priority: section.percentage < 60 ? 'critical' : 'high',
                reason: `Your ${section.title} section scored ${section.percentage}% - vendor assessments ensure data protection across your supply chain`,
                category: 'Vendor Management'
              });
            }
            break;
        }
      }
    });

    // If overall score is low, recommend gap analyzer more strongly
    if (assessmentResults.overallScore && assessmentResults.overallScore < 60) {
      // Already added as first tool
    }

    // Sort by priority: critical > high > medium
    const priorityOrder = { critical: 0, high: 1, medium: 2 };
    return tools.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  const recommendedTools = getRecommendedTools();
  const priorityTools = recommendedTools.slice(0, 3); // Show top 3

  if (priorityTools.length === 0) {
    return null;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'high':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return AlertTriangle;
      case 'high':
        return Target;
      default:
        return CheckCircle;
    }
  };

  return (
    <div className="mt-8">
      {/* Learning Resources Overview Card */}
      <Card className="mb-6 border-secondary/20 bg-secondary/5">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-secondary" />
            Learning Resources & Guides
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Access comprehensive guides and tutorials to maximize the value of each tool
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Step-by-Step Guides</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Detailed walkthroughs for each tool with best practices and examples
              </p>
            </div>

            <div className="p-3 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Video className="h-4 w-4 text-secondary" />
                <span className="text-sm font-semibold text-foreground">Video Tutorials</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Watch expert demonstrations and implementation tips
              </p>
            </div>

            <div className="p-3 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold text-foreground">FAQs & Support</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Common questions and expert support when you need it
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <Target className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Recommended Next Steps
              </h2>
              <p className="text-muted-foreground">
                Based on your assessment results, these tools will help you address your most critical privacy gaps. 
                Start with the highest priority items first.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {priorityTools.map((tool) => {
              const Icon = tool.icon;
              const PriorityIcon = getPriorityIcon(tool.priority);
              
              return (
                <Card 
                  key={tool.id} 
                  className={`hover:shadow-lg transition-all duration-300 border-2 ${getPriorityColor(tool.priority)}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(tool.priority)}`}>
                        <PriorityIcon className="h-3 w-3" />
                        {tool.priority.toUpperCase()}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground italic">
                        "{tool.reason}"
                      </p>
                    </div>
                    
                    <Link 
                      to={tool.path}
                      state={{ 
                        assessmentResults: assessmentResults,
                        fromAssessment: true 
                      }}
                      onClick={() => onToolClick?.(tool.id)}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                        size="sm"
                      >
                        Launch Tool
                        <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {recommendedTools.length > 3 && (
            <div className="mt-6 text-center">
              <Link to="/toolkit">
                <Button variant="outline">
                  View All Tools ({recommendedTools.length} recommended)
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendedTools;


