import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Copy, 
  CheckCircle,
  X,
  ArrowRight,
  Building2,
  User
} from 'lucide-react';
import { CollaborationManager } from '../../utils/collaboration';
import { toast } from '../ui/Toaster';

interface CollaborationSetupProps {
  onStart: (sessionId: string) => void;
}

export function CollaborationSetup({ onStart }: CollaborationSetupProps) {
  const [step, setStep] = useState<'create' | 'invite' | 'ready'>('create');
  const [sessionName, setSessionName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<Array<{ name: string; email: string }>>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const handleCreateSession = () => {
    if (!sessionName || !organizationName || !ownerName || !ownerEmail) {
      toast.error('Please fill in all required fields', 'Missing information', 3000);
      return;
    }

    try {
      const session = CollaborationManager.createSession(
        sessionName,
        organizationName,
        { name: ownerName, email: ownerEmail }
      );

      setSessionId(session.id);
      setStep('invite');
      toast.success('Collaboration session created!', 'Session ready to share', 3000);
    } catch (error) {
      toast.error('Failed to create session', 'Please try again', 3000);
    }
  };

  const handleAddMember = () => {
    if (!newMemberName || !newMemberEmail) {
      toast.error('Please enter name and email', 'Missing information', 3000);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMemberEmail)) {
      toast.error('Please enter a valid email address', 'Invalid email', 3000);
      return;
    }

    setTeamMembers([...teamMembers, { name: newMemberName, email: newMemberEmail }]);
    setNewMemberName('');
    setNewMemberEmail('');
    toast.success(`Added ${newMemberName} to the team`, '', 2000);
  };

  const handleRemoveMember = (index: number) => {
    const updated = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updated);
  };

  const handleInviteMembers = () => {
    if (!sessionId) return;

    try {
      teamMembers.forEach(member => {
        CollaborationManager.addTeamMember(sessionId, member);
      });

      setStep('ready');
      toast.success(`Invited ${teamMembers.length} team members`, 'Team ready!', 3000);
    } catch (error) {
      toast.error('Failed to invite members', 'Please try again', 3000);
    }
  };

  const handleCopyLink = () => {
    if (!sessionId) return;
    
    const link = CollaborationManager.generateShareLink(sessionId);
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!', 'Share with your team', 2000);
  };

  const handleStartAssessment = () => {
    if (sessionId) {
      CollaborationManager.updateSessionStatus(sessionId, 'in-progress');
      onStart(sessionId);
    }
  };

  if (step === 'create') {
    return (
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Create Collaborative Assessment</h2>
            <p className="text-muted-foreground">
              Set up a team assessment session where multiple people can contribute
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Session Name *</label>
              <Input
                placeholder="e.g., Q4 2024 Privacy Assessment"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Organization Name *</label>
              <Input
                placeholder="Your company name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                icon={<Building2 className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name *</label>
                <Input
                  placeholder="John Doe"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  icon={<User className="h-4 w-4" />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Email *</label>
                <Input
                  type="email"
                  placeholder="john@company.com"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>
            </div>

            <Button onClick={handleCreateSession} className="w-full" size="lg">
              Create Session
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'invite') {
    return (
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Invite Team Members</h2>
            <p className="text-muted-foreground">
              Add people who will contribute to this assessment
            </p>
          </div>

          <div className="space-y-6">
            {/* Share Link */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Share Link</span>
                <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <code className="text-xs bg-background p-2 rounded block overflow-x-auto">
                {sessionId && CollaborationManager.generateShareLink(sessionId)}
              </code>
            </div>

            {/* Add Team Members */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">Add Team Members</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleAddMember} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>

            {/* Team Members List */}
            {teamMembers.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-3">
                  Team Members ({teamMembers.length})
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {teamMembers.map((member, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between bg-muted/30 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleStartAssessment()} 
                className="flex-1"
              >
                Skip & Start Now
              </Button>
              <Button 
                onClick={handleInviteMembers} 
                className="flex-1"
                disabled={teamMembers.length === 0}
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ready to start
  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardContent className="p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Team Ready!</h2>
          <p className="text-muted-foreground mb-6">
            Your collaborative assessment session is set up and ready to go
          </p>

          <div className="bg-muted/30 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold mb-4">Session Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Session Name:</span>
                <span className="font-medium">{sessionName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organization:</span>
                <span className="font-medium">{organizationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Size:</span>
                <span className="font-medium">{teamMembers.length + 1} members</span>
              </div>
            </div>
          </div>

          <Button onClick={handleStartAssessment} size="lg" className="w-full">
            Start Collaborative Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


