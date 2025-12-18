import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Users, 
  TrendingUp, 
  Calendar,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Target,
  ArrowRight,
  Download,
  Building2,
  Briefcase,
  Shield,
  UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrganizationalRecommendation, TeamMember, FunctionalTask } from '../../utils/organizationalRecommendation';

interface OrganizationalResultsProps {
  recommendation: OrganizationalRecommendation;
  overallScore: number;
  completedDate: string;
}

export function OrganizationalResults({ 
  recommendation, 
  overallScore,
  completedDate 
}: OrganizationalResultsProps) {
  
  const getPriorityColor = (priority: 'critical' | 'recommended' | 'optional') => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'recommended': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'optional': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    }
  };
  
  const getTaskPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'low': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
          <Building2 className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">
          Your Organizational Privacy Team
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Recommended team structure and resource allocation
        </p>
        <p className="text-sm text-muted-foreground">
          Assessment completed on {completedDate}
        </p>
      </div>
      
      {/* Overall Score Card */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Organization Privacy Maturity</h3>
              <p className="text-sm text-muted-foreground">
                Based on NIST Privacy Framework assessment
              </p>
            </div>
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {overallScore >= 80 ? 'Strong' : overallScore >= 60 ? 'Developing' : 'Needs Improvement'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Resource Estimates */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Resource Estimates</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Minimum Team Size</p>
                <p className="text-3xl font-bold text-foreground">
                  {recommendation.resourceEstimates.minimumHeadcount} FTE
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Optimal Team Size</p>
                <p className="text-3xl font-bold text-primary">
                  {recommendation.resourceEstimates.optimalHeadcount} FTE
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estimated Budget Range</p>
                <p className="text-2xl font-bold text-foreground">
                  {recommendation.resourceEstimates.estimatedBudgetRange}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  *Based on industry averages, adjust for your region
                </p>
              </div>
            </div>
          </div>
          
          {recommendation.resourceEstimates.skillGapsToAddress.length > 0 && (
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900 dark:text-orange-200 mb-2">
                    Skill Gaps to Address
                  </p>
                  <ul className="text-sm text-orange-800 dark:text-orange-300 space-y-1">
                    {recommendation.resourceEstimates.skillGapsToAddress.map((gap, index) => (
                      <li key={index}>• {gap}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Team Structure */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Recommended Team Structure</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Minimal Team */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Minimal Team (Start Here)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Essential roles to address critical gaps immediately
              </p>
              <div className="space-y-3">
                {recommendation.minimalTeam.map((member) => (
                  <RoleCard key={member.roleId} member={member} />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Optimal Team */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Optimal Team (Goal)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete team for comprehensive privacy management
              </p>
              <div className="space-y-3">
                {recommendation.optimalTeam.map((member) => (
                  <RoleCard key={member.roleId} member={member} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Hiring Priority */}
        {recommendation.resourceEstimates.hiringPriority.length > 0 && (
          <Card className="border-2 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold">Hiring Priority</h3>
              </div>
              <div className="space-y-2">
                {recommendation.resourceEstimates.hiringPriority.map((priority, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-foreground">{priority}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Functional Tasks */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Functional Task Assignments</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Clear ownership and collaboration model for privacy activities
        </p>
        
        <div className="space-y-4">
          {recommendation.functionalTasks.map((task, index) => (
            <TaskCard key={index} task={task} getTaskPriorityColor={getTaskPriorityColor} />
          ))}
        </div>
      </div>
      
      {/* Team Structure Guidance by Org Size */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">Team Structure Guidance by Organization Size</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Small Organizations
              </h4>
              <p className="text-sm text-muted-foreground">
                {recommendation.teamStructureGuidance.smallOrg}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Medium Organizations
              </h4>
              <p className="text-sm text-muted-foreground">
                {recommendation.teamStructureGuidance.mediumOrg}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Large/Enterprise
              </h4>
              <p className="text-sm text-muted-foreground">
                {recommendation.teamStructureGuidance.largeOrg}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* All Roles by Priority */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Roles by Priority</h2>
        
        <div className="space-y-6">
          {/* Critical Roles */}
          {recommendation.criticalRoles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Critical Roles
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendation.criticalRoles.map((member) => (
                  <DetailedRoleCard key={member.roleId} member={member} getPriorityColor={getPriorityColor} />
                ))}
              </div>
            </div>
          )}
          
          {/* Recommended Roles */}
          {recommendation.recommendedRoles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-orange-600" />
                Recommended Roles
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendation.recommendedRoles.map((member) => (
                  <DetailedRoleCard key={member.roleId} member={member} getPriorityColor={getPriorityColor} />
                ))}
              </div>
            </div>
          )}
          
          {/* Optional Roles */}
          {recommendation.optionalRoles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                Optional Roles (Future Growth)
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendation.optionalRoles.map((member) => (
                  <DetailedRoleCard key={member.roleId} member={member} getPriorityColor={getPriorityColor} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button size="lg" className="px-8">
          <Download className="mr-2 h-5 w-5" />
          Download Full Report
        </Button>
        <Link to="/assessment">
          <Button size="lg" variant="outline" className="px-8">
            Back to Assessments
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Role Card Component (compact)
function RoleCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex items-start justify-between p-3 bg-muted/30 rounded-lg">
      <div className="flex-grow">
        <h4 className="font-semibold text-sm text-foreground">{member.roleName}</h4>
        <p className="text-xs text-muted-foreground">FTE: {member.fte} • {member.timeframe}</p>
      </div>
      <Link to={member.path}>
        <Button size="sm" variant="ghost" className="ml-2">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

// Detailed Role Card Component
function DetailedRoleCard({ 
  member, 
  getPriorityColor 
}: { 
  member: TeamMember; 
  getPriorityColor: (priority: 'critical' | 'recommended' | 'optional') => string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-foreground">{member.roleName}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(member.priority)}`}>
                {member.priority.charAt(0).toUpperCase() + member.priority.slice(1)}
              </span>
              <span className="text-xs text-muted-foreground">Match: {member.matchScore}%</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{member.timeframe}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">FTE: {member.fte}</span>
          </div>
        </div>
        
        <div className="space-y-1 mb-3">
          {member.reasoning.map((reason, index) => (
            <p key={index} className="text-xs text-muted-foreground">• {reason}</p>
          ))}
        </div>
        
        {member.canBeCombinedWith && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
            💡 Can be combined with: {member.canBeCombinedWith.join(', ')}
          </p>
        )}
        
        <Link to={member.path}>
          <Button size="sm" variant="outline" className="w-full">
            View Journey
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Task Card Component
function TaskCard({ 
  task, 
  getTaskPriorityColor 
}: { 
  task: FunctionalTask;
  getTaskPriorityColor: (priority: 'high' | 'medium' | 'low') => string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-semibold text-foreground">{task.taskName}</h4>
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${getTaskPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mt-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Primary Owner</p>
            <p className="text-sm font-medium text-foreground">{task.primaryOwner}</p>
          </div>
          
          {task.contributors.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Contributors</p>
              <p className="text-sm text-foreground">{task.contributors.join(', ')}</p>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span>Related: {task.relatedSections.join(', ')}</span>
          {task.requiredForGaps && (
            <span className="text-orange-600 dark:text-orange-400 font-medium">
              ⚠️ Required for gaps
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


