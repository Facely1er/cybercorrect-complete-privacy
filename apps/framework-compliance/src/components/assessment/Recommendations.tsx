import React from 'react';
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  BarChart, 
  Download, 
  ArrowLeft, 
  Shield, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Users, 
  Network, 
  Database, 
  File,
  FileText,
  BookOpen,
  ExternalLink,
  Copy,
  Lightbulb,
  Target
} from 'lucide-react';

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  effort: 'minimal' | 'moderate' | 'significant';
  timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  impact: string;
  steps: string[];
  references: {
    title: string;
    url: string;
  }[];
  template?: string;
  implementationGuide?: string;
  successCriteria?: string[];
  commonPitfalls?: string[];
}

interface RecommendationsProps {
  title: string;
  subtitle: string;
  assessmentType: string;
  recommendations: RecommendationItem[];
  onBack: () => void;
  onExport: () => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({
  title,
  subtitle,
  recommendations,
  onBack,
  onExport}) => {
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = React.useState<string>('all');
  
  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-alert-coral bg-alert-coral/10 dark:bg-dark-alert/20 dark:text-dark-alert';
      case 'high': return 'text-premium-gold bg-premium-gold/10 dark:bg-dark-premium/20 dark:text-dark-premium';
      case 'medium': return 'text-primary-teal bg-primary-teal/10 dark:bg-dark-primary/20 dark:text-dark-primary';
      case 'low': return 'text-success-green bg-success-green/10 dark:bg-dark-success/20 dark:text-dark-success';
      default: return 'text-muted-foreground bg-support-gray dark:bg-dark-support';
    }
  };

  const getEffortIcon = (effort: string) => {
    switch (effort) {
      case 'minimal': return '●';
      case 'moderate': return '●●';
      case 'significant': return '●●●';
      default: return '●';
    }
  };

  const getTimeframeText = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate': return '< 30 days';
      case 'short-term': return '1-3 months';
      case 'medium-term': return '3-6 months';
      case 'long-term': return '6+ months';
      default: return 'Undefined';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'authentication': return <Lock className="h-5 w-5 text-primary-teal dark:text-dark-primary" />;
      case 'access control': return <Users className="h-5 w-5 text-primary-teal dark:text-dark-primary" />;
      case 'network': return <Network className="h-5 w-5 text-primary-teal dark:text-dark-primary" />;
      case 'data protection': return <Database className="h-5 w-5 text-primary-teal dark:text-dark-primary" />;
      case 'governance': return <Shield className="h-5 w-5 text-primary-teal dark:text-dark-primary" />;
      case 'documentation': return <File className="h-5 w-5 text-primary-teal dark:text-dark-primary" />;
      default: return <Shield className="h-5 w-5 text-primary-teal dark:text-dark-primary" />;
    }
  };

  // Filter recommendations by priority
  const filteredRecommendations = activeFilter === 'all'
    ? recommendations
    : recommendations.filter(rec => rec.priority === activeFilter);

  // Group recommendations by category
  const groupedRecommendations: Record<string, RecommendationItem[]> = {};
  filteredRecommendations.forEach(rec => {
    if (!groupedRecommendations[rec.category]) {
      groupedRecommendations[rec.category] = [];
    }
    groupedRecommendations[rec.category].push(rec);
  });

  return (
    <div>
      <div className="mb-6 flex justify-between flex-col md:flex-row items-start md:items-center gap-4">
        <div>
          <Button
            variant="outline"
            className="mb-2"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-dark-text">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <Button onClick={onExport} className="bg-primary-teal hover:bg-secondary-teal text-white dark:bg-dark-primary dark:hover:bg-dark-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Export Recommendations
        </Button>
      </div>

      <div className="mb-6">
        <div className="bg-support-gray/30 dark:bg-dark-support/10 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-primary-teal dark:text-dark-primary" />
            <span className="font-medium text-foreground dark:text-dark-text">Filter by Priority:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm"
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('all')}
              className={activeFilter === 'all' ? 'bg-primary-teal hover:bg-secondary-teal dark:bg-dark-primary' : ''}
            >
              All
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'critical' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('critical')}
              className={activeFilter === 'critical' ? 'bg-alert-coral hover:bg-alert-coral/90 dark:bg-dark-alert' : 'border-alert-coral/50 text-alert-coral hover:bg-alert-coral/10 dark:border-dark-alert/50 dark:text-dark-alert dark:hover:bg-dark-alert/10'}
            >
              <AlertTriangle className="h-4 w-4 mr-1 text-alert-coral dark:text-dark-alert" /> 
              Critical
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'high' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('high')}
              className={activeFilter === 'high' ? 'bg-premium-gold hover:bg-premium-gold/90 text-gray-900 dark:bg-dark-premium' : 'border-premium-gold/50 text-premium-gold hover:bg-premium-gold/10 dark:border-dark-premium/50 dark:text-dark-premium dark:hover:bg-dark-premium/10'}
            >
              <AlertTriangle className="h-4 w-4 mr-1 text-premium-gold dark:text-dark-premium" />
              High
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'medium' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('medium')}
              className={activeFilter === 'medium' ? 'bg-primary-teal hover:bg-primary-teal/90 dark:bg-dark-primary' : 'border-primary-teal/50 text-primary-teal hover:bg-primary-teal/10 dark:border-dark-primary/50 dark:text-dark-primary dark:hover:bg-dark-primary/10'}
            >
              Medium
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'low' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('low')}
              className={activeFilter === 'low' ? 'bg-success-green hover:bg-success-green/90 dark:bg-dark-success' : 'border-success-green/50 text-success-green hover:bg-success-green/10 dark:border-dark-success/50 dark:text-dark-success dark:hover:bg-dark-success/10'}
            >
              <CheckCircle className="h-4 w-4 mr-1 text-success-green dark:text-dark-success" />
              Low
            </Button>
          </div>
        </div>
      </div>

      {/* Implementation Resources Section */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Implementation Resources & Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-lg border border-border">
              <FileText className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Templates & Tools</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Download ready-to-use templates for policies, assessments, and documentation
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Browse Templates
              </Button>
            </div>

            <div className="p-4 bg-background rounded-lg border border-border">
              <BookOpen className="h-8 w-8 text-secondary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Implementation Guides</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Access detailed step-by-step guides for each recommendation
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Guides
              </Button>
            </div>

            <div className="p-4 bg-background rounded-lg border border-border">
              <Users className="h-8 w-8 text-success-green mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Expert Support</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Get help from compliance experts to accelerate your implementation
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {Object.entries(groupedRecommendations).length === 0 ? (
          <Card className="border border-support-gray dark:border-dark-support text-center p-12">
            <CheckCircle className="h-12 w-12 text-success-green dark:text-dark-success mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground dark:text-dark-text mb-2">No Recommendations Needed</h3>
            <p className="text-muted-foreground">
              Great job! No recommendations were found for the selected filter.
            </p>
          </Card>
        ) : (
          Object.entries(groupedRecommendations).map(([category, items]) => (
            <div key={category} className="mb-8">
              <div className="flex items-center mb-4">
                {getCategoryIcon(category)}
                <h2 className="text-xl font-semibold ml-2 text-foreground dark:text-dark-text">{category}</h2>
              </div>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="border border-support-gray dark:border-dark-support">
                    <CardContent className="p-6">
                      <div 
                        className="flex justify-between items-start cursor-pointer" 
                        onClick={() => toggleItem(item.id)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(item.priority)}`}>
                              {item.priority.toUpperCase()}
                            </span>
                            <span className="text-xs bg-support-gray dark:bg-dark-support text-muted-foreground px-2 py-0.5 rounded-full">
                              {getTimeframeText(item.timeframe)}
                            </span>
                            <span className="text-xs bg-support-gray dark:bg-dark-support text-muted-foreground px-2 py-0.5 rounded-full">
                              Effort: {getEffortIcon(item.effort)}
                            </span>
                          </div>
                          <CardTitle className="text-lg text-foreground dark:text-dark-text">{item.title}</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon">
                          {expandedItems[item.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <CardContent className={`px-0 pb-0 ${expandedItems[item.id] ? 'block' : 'hidden'}`}>
                        <CardDescription className="mb-4">{item.description}</CardDescription>
                        
                        <div className="bg-support-gray/30 dark:bg-dark-support/10 p-3 rounded-lg mb-4">
                          <div className="flex items-center mb-2">
                            <Shield className="h-4 w-4 mr-2 text-primary-teal dark:text-dark-primary" />
                            <span className="font-medium text-sm text-foreground dark:text-dark-text">Expected Impact</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.impact}</p>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 mr-2 text-primary-teal dark:text-dark-primary" />
                            <span className="font-medium text-sm text-foreground dark:text-dark-text">Implementation Steps</span>
                          </div>
                          <ol className="space-y-2">
                            {item.steps.map((step, index) => (
                              <li key={index} className="flex items-center text-sm">
                                <span className="text-foreground dark:text-dark-text">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        
                        {/* Success Criteria */}
                        {item.successCriteria && item.successCriteria.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center mb-2">
                              <Target className="h-4 w-4 mr-2 text-success-green dark:text-dark-success" />
                              <span className="font-medium text-sm text-foreground dark:text-dark-text">Success Criteria</span>
                            </div>
                            <ul className="space-y-1">
                              {item.successCriteria.map((criteria, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-success-green dark:text-dark-success mt-0.5 flex-shrink-0" />
                                  <span className="text-muted-foreground">{criteria}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Common Pitfalls */}
                        {item.commonPitfalls && item.commonPitfalls.length > 0 && (
                          <div className="mb-4 p-3 bg-warning/5 border border-warning/20 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Lightbulb className="h-4 w-4 mr-2 text-warning" />
                              <span className="font-medium text-sm text-foreground dark:text-dark-text">Common Pitfalls to Avoid</span>
                            </div>
                            <ul className="space-y-1">
                              {item.commonPitfalls.map((pitfall, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                                  <span className="text-muted-foreground">{pitfall}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Template/Guide Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          {item.template && (
                            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary dark:text-dark-primary" />
                                  <span className="font-medium text-sm text-foreground dark:text-dark-text">Template Available</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(item.template || '');
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Click to copy starter template
                              </p>
                            </div>
                          )}

                          {item.implementationGuide && (
                            <a
                              href={item.implementationGuide}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg hover:bg-secondary/10 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-secondary" />
                                  <span className="font-medium text-sm text-foreground dark:text-dark-text">Implementation Guide</span>
                                </div>
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Step-by-step tutorial
                              </p>
                            </a>
                          )}
                        </div>

                        {item.references.length > 0 && (
                          <div>
                            <div className="flex items-center mb-2">
                              <File className="h-4 w-4 mr-2 text-primary-teal dark:text-dark-primary" />
                              <span className="font-medium text-sm text-foreground dark:text-dark-text">References & Resources</span>
                            </div>
                            <ul className="space-y-1">
                              {item.references.map((ref, index) => (
                                <li key={index} className="text-sm">
                                  <a 
                                    href={ref.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-primary-teal hover:underline dark:text-dark-primary inline-flex items-center gap-1"
                                  >
                                    {ref.title}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Recommendations;