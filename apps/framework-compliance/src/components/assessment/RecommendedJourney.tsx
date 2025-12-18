import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Shield, 
  Scale, 
  Database, 
  UserCheck, 
  ArrowRight, 
  Star, 
  CheckCircle,
  Target,
  Sparkles
} from 'lucide-react';
import { 
  generateRoleRecommendations, 
  RoleRecommendation,
  AssessmentData,
  getJourneyCustomization
} from '../../utils/roleRecommendation';

interface RecommendedJourneyProps {
  assessmentResults: AssessmentData;
}

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Scale,
  Database,
  UserCheck
};

const RecommendedJourney: React.FC<RecommendedJourneyProps> = ({ assessmentResults }) => {
  const navigate = useNavigate();
  const recommendations = generateRoleRecommendations(assessmentResults);
  const customization = getJourneyCustomization(assessmentResults);
  const topRecommendation = recommendations[0];
  const otherRecommendations = recommendations.slice(1, 4);

  const handleStartJourney = (recommendation: RoleRecommendation) => {
    navigate(recommendation.path, {
      state: {
        assessmentResults,
        customization,
        fromAssessment: true
      }
    });
  };

  const getPriorityBadge = (level: string) => {
    const styles = {
      critical: 'bg-destructive/10 text-destructive border-destructive/20',
      high: 'bg-warning/10 text-warning border-warning/20',
      moderate: 'bg-primary/10 text-primary border-primary/20',
      maintenance: 'bg-success/10 text-success border-success/20'
    };
    const labels = {
      critical: 'Critical Priority',
      high: 'High Priority',
      moderate: 'Moderate Priority',
      maintenance: 'Maintenance Mode'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[level as keyof typeof styles]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    );
  };

  const TopIcon = iconMap[topRecommendation.icon] || Shield;

  return (
    <div className="mt-8 space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Your Personalized Compliance Journey
          </h2>
          <p className="text-muted-foreground mt-1">
            Based on your assessment results, we've identified the optimal path forward
          </p>
        </div>
        {getPriorityBadge(customization.priorityLevel)}
      </div>

      {/* Top Recommendation - Featured Card */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-dark-bg dark:to-secondary/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-bl-lg flex items-center gap-1">
          <Star className="h-3 w-3 fill-current" />
          Best Match
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-xl bg-primary/10 dark:bg-primary/20">
              <TopIcon className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-2xl">{topRecommendation.roleName}</CardTitle>
                <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {topRecommendation.matchPercentage}% Match
                </span>
              </div>
              <p className="text-muted-foreground">{topRecommendation.description}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Why This Journey */}
          <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
              <Target className="h-4 w-4 text-primary" />
              Why This Journey?
            </h4>
            <ul className="space-y-2">
              {topRecommendation.reasoning.slice(0, 3).map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Priority Areas */}
          {topRecommendation.priorityAreas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-foreground">Focus Areas:</span>
              {topRecommendation.priorityAreas.map((area, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full border border-warning/20"
                >
                  {area}
                </span>
              ))}
            </div>
          )}

          {/* Customized Steps Preview */}
          {customization.customSteps.length > 0 && (
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold mb-3 text-sm text-foreground">Your Customized Action Plan:</h4>
              <div className="grid gap-2">
                {customization.customSteps.slice(0, 3).map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      step.priority === 'high' 
                        ? 'bg-destructive/5 border border-destructive/20' 
                        : step.priority === 'medium'
                        ? 'bg-warning/5 border border-warning/20'
                        : 'bg-muted/30'
                    }`}
                  >
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      step.priority === 'high' 
                        ? 'bg-destructive/10 text-destructive' 
                        : step.priority === 'medium'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.priority.toUpperCase()}
                    </span>
                    <span className="text-sm text-foreground">{step.focus}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="w-full mt-4 bg-primary hover:bg-primary/90"
            onClick={() => handleStartJourney(topRecommendation)}
          >
            Start Your {topRecommendation.roleName} Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Other Recommendations */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Alternative Journeys</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {otherRecommendations.map((recommendation) => {
            const Icon = iconMap[recommendation.icon] || Shield;
            return (
              <Card 
                key={recommendation.roleId}
                className="hover:border-primary/30 transition-all duration-200 cursor-pointer group"
                onClick={() => handleStartJourney(recommendation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-foreground truncate">{recommendation.roleName}</h4>
                        <span className="text-xs text-muted-foreground ml-2">
                          {recommendation.matchPercentage}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {recommendation.description}
                      </p>
                      {recommendation.priorityAreas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {recommendation.priorityAreas.slice(0, 2).map((area, index) => (
                            <span 
                              key={index}
                              className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Journey</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* View All Journeys Link */}
      <div className="text-center pt-4">
        <Link 
          to="/compliance"
          className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          View all compliance journeys
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

export default RecommendedJourney;


