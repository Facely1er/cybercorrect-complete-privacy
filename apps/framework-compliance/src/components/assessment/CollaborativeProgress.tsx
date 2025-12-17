import { Card, CardContent } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare,
  Clock,
  User,
  Shield
} from 'lucide-react';
import { CollaborationManager } from '../../utils/collaboration';
import { useEffect, useState } from 'react';

interface CollaborativeProgressProps {
  sessionId: string;
}

export function CollaborativeProgress({ sessionId }: CollaborativeProgressProps) {
  const [progress, setProgress] = useState(CollaborationManager.getProgressSummary(sessionId));
  
  useEffect(() => {
    // Update progress every 5 seconds
    const interval = setInterval(() => {
      setProgress(CollaborationManager.getProgressSummary(sessionId));
    }, 5000);

    return () => clearInterval(interval);
  }, [sessionId]);
  
  if (!progress) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-primary/10 text-primary';
      case 'contributor':
        return 'bg-blue-500/10 text-blue-600';
      case 'reviewer':
        return 'bg-purple-500/10 text-purple-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="mb-6 border-2 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team Progress
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last updated: just now</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Overall Completion</span>
              <span className="font-bold text-primary">
                {progress.completionPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress value={progress.completionPercentage} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {progress.answeredQuestions} of {progress.totalQuestions} questions answered
            </p>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
              <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-success">{progress.answeredQuestions}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            
            <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
              <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold text-warning">{progress.flaggedQuestions}</p>
              <p className="text-xs text-muted-foreground">Flagged</p>
            </div>
            
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <MessageSquare className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{progress.unresolvedComments}</p>
              <p className="text-xs text-muted-foreground">Comments</p>
            </div>
          </div>

          {/* Team Member Progress */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Individual Progress ({progress.memberProgress.length} members)
            </h4>
            <div className="space-y-3">
              {progress.memberProgress.map((member) => (
                <div key={member.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {member.role === 'owner' ? (
                          <Shield className="h-4 w-4 text-primary" />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <span className="font-medium">{member.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </div>
                    <span className="text-muted-foreground font-medium">
                      {member.assignedSections.length > 0 
                        ? `${member.completedSections.length}/${member.assignedSections.length} sections`
                        : 'No sections assigned'
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={member.completionRate} 
                      className="h-2 flex-1"
                    />
                    <span className="text-xs font-medium text-muted-foreground min-w-[40px] text-right">
                      {member.completionRate.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Summary */}
          {progress.memberProgress.some(m => m.lastActive) && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Recent Activity</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                {progress.memberProgress
                  .filter(m => m.lastActive)
                  .sort((a, b) => {
                    const dateA = a.lastActive ? new Date(a.lastActive).getTime() : 0;
                    const dateB = b.lastActive ? new Date(b.lastActive).getTime() : 0;
                    return dateB - dateA;
                  })
                  .slice(0, 3)
                  .map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>
                        {member.name} - {member.lastActive && new Date(member.lastActive).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

