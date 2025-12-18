import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  MessageSquare, 
  Flag, 
  Send, 
  CheckCircle,
  User
} from 'lucide-react';
import { CollaborationManager } from '../../utils/collaboration';
import { QuestionComment } from '../../types/collaboration';
import { toast } from '../ui/Toaster';

interface QuestionCollaborationProps {
  sessionId: string;
  questionId: string;
  currentUserId: string;
  currentUserName: string;
}

export function QuestionCollaboration({
  sessionId,
  questionId,
  currentUserId,
  currentUserName
}: QuestionCollaborationProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  const session = CollaborationManager.getSession(sessionId);
  const questionData = session?.answers[questionId];
  const comments = questionData?.comments || [];
  const isFlagged = session?.flags.some(f => f.questionId === questionId && f.status === 'pending');

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    CollaborationManager.addComment(
      sessionId,
      questionId,
      newComment,
      currentUserId,
      currentUserName
    );

    setNewComment('');
    toast.success('Comment added', '', 2000);
  };

  const handleResolveComment = (commentId: string) => {
    CollaborationManager.resolveComment(sessionId, questionId, commentId);
    toast.success('Comment resolved', '', 2000);
  };

  const handleFlagQuestion = () => {
    if (!flagReason.trim()) {
      toast.error('Please provide a reason for flagging', '', 2000);
      return;
    }

    CollaborationManager.flagQuestion(sessionId, questionId, currentUserId, flagReason);
    setShowFlagForm(false);
    setFlagReason('');
    toast.success('Question flagged for discussion', '', 2000);
  };

  const handleUnflagQuestion = () => {
    CollaborationManager.unflagQuestion(sessionId, questionId);
    toast.success('Flag removed', '', 2000);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="mt-4 space-y-2">
      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="text-xs"
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          Comments ({comments.length})
        </Button>
        
        {!isFlagged ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFlagForm(!showFlagForm)}
            className="text-xs"
          >
            <Flag className="h-3 w-3 mr-1" />
            Flag for Discussion
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleUnflagQuestion}
            className="text-xs bg-warning/10 border-warning/20"
          >
            <Flag className="h-3 w-3 mr-1 fill-warning text-warning" />
            Flagged
          </Button>
        )}
      </div>

      {/* Flag Form */}
      {showFlagForm && (
        <Card className="border-warning/20">
          <CardContent className="p-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Why are you flagging this question?</label>
              <Input
                placeholder="e.g., Need clarification, Unclear requirements..."
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleFlagQuestion} className="flex-1">
                  <Flag className="h-3 w-3 mr-1" />
                  Flag Question
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowFlagForm(false);
                    setFlagReason('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      {showComments && (
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Existing Comments */}
              {comments.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {comments.map((comment: QuestionComment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-lg ${
                        comment.resolved
                          ? 'bg-muted/30 opacity-60'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-medium">{comment.userName}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {formatTimestamp(comment.timestamp)}
                            </p>
                          </div>
                        </div>
                        {!comment.resolved && comment.userId !== currentUserId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResolveComment(comment.id)}
                            className="h-6 px-2"
                          >
                            <CheckCircle className="h-3 w-3 text-success" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-foreground">{comment.comment}</p>
                      {comment.resolved && (
                        <p className="text-xs text-success mt-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Resolved
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet. Be the first to add one!
                </p>
              )}

              {/* Add New Comment */}
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="text-xs font-medium">Add a comment</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


