import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Check, ArrowRight, Users, UserCheck, Shield, Scale, Building2, X } from 'lucide-react';
import { 
  getRoleCohort, 
  getCohortInfo, 
  getRoleBetaMessage, 
  getBetaBenefits
} from '../../utils/portalBetaMapping';

export interface PortalBetaInvitationProps {
  userRole: string;
  assessmentData?: Record<string, unknown>;
  onDismiss?: () => void;
  variant?: 'full' | 'banner' | 'minimal';
  showDismiss?: boolean;
}

const COHORT_ICONS = {
  Users,
  UserCheck,
  Shield,
  Scale,
  Building2
};

export function PortalBetaInvitation({ 
  userRole, 
  assessmentData,
  onDismiss,
  variant = 'full',
  showDismiss = true
}: PortalBetaInvitationProps) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  
  const cohort = getRoleCohort(userRole);
  const cohortInfo = getCohortInfo(cohort);
  const roleMessage = getRoleBetaMessage(userRole, cohort);
  const benefits = getBetaBenefits(cohort);
  
  // Get icon component
  const IconComponent = COHORT_ICONS[cohortInfo.icon as keyof typeof COHORT_ICONS] || Users;

  const handleJoinBeta = () => {
    navigate('/portal-beta', {
      state: {
        role: userRole,
        cohort,
        fromAssessment: true,
        assessmentData
      }
    });
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
    // Store dismissal in localStorage
    localStorage.setItem('portalBetaInviteDismissed', 'true');
  };

  if (dismissed) return null;

  // Minimal variant (for smaller spaces)
  if (variant === 'minimal') {
    return (
      <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-900/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <IconComponent className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">Join Privacy Portal Beta</h4>
                  <Badge className="bg-amber-400 text-amber-900 text-xs">BETA</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Help us build Portal features for {cohortInfo.shortName.toLowerCase()}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white h-8" onClick={handleJoinBeta}>
                    Learn More
                  </Button>
                  {showDismiss && (
                    <Button size="sm" variant="ghost" className="h-8" onClick={handleDismiss}>
                      Dismiss
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {showDismiss && (
              <button
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Banner variant (for dashboard)
  if (variant === 'banner') {
    return (
      <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-xl">
                <IconComponent className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-amber-400 text-amber-900 text-xs font-bold">
                    🧪 BETA INVITATION
                  </Badge>
                  <Badge variant="info" className="text-xs">
                    {cohortInfo.shortName}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">{roleMessage.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {roleMessage.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-2 mb-4">
                  {roleMessage.stakeholderNeeds.slice(0, 4).map((need, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{need}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={handleJoinBeta}>
                    {roleMessage.ctaText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {showDismiss && (
                    <Button variant="outline" onClick={handleDismiss}>
                      Maybe Later
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {showDismiss && (
              <button
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close invitation"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant (for assessment results)
  return (
    <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-amber-900/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-amber-400 text-amber-900 text-sm font-bold px-3 py-1">
                🧪 BETA INVITATION
              </Badge>
              <Badge variant="info" className="text-sm">
                For {userRole}
              </Badge>
            </div>
            <CardTitle className="text-2xl mb-2">{roleMessage.title}</CardTitle>
            <p className="text-muted-foreground">
              {roleMessage.description}
            </p>
          </div>
          {showDismiss && (
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close invitation"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Cohort Info */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 bg-${cohortInfo.color}-100 dark:bg-${cohortInfo.color}-900/30 rounded-lg`}>
              <IconComponent className={`h-6 w-6 text-${cohortInfo.color}-600 dark:text-${cohortInfo.color}-400`} />
            </div>
            <div>
              <h4 className="font-bold">{cohortInfo.name}</h4>
              <p className="text-xs text-muted-foreground">{cohortInfo.testers}</p>
            </div>
          </div>
          
          <p className="text-sm font-semibold mb-2">We'll build together:</p>
          <div className="space-y-1">
            {cohortInfo.builds.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What You Need */}
        <div>
          <h4 className="font-semibold mb-3">What You Need:</h4>
          <div className="grid md:grid-cols-2 gap-2">
            {roleMessage.stakeholderNeeds.map((need, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-white/60 dark:bg-gray-800/60 rounded p-2">
                <Check className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{need}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Beta Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-amber-300 dark:border-amber-700">
          <h4 className="font-bold mb-3">🎁 Beta Participant Benefits</h4>
          
          <div className="mb-3">
            <div className="text-lg font-bold text-amber-700 dark:text-amber-300 mb-1">
              {benefits.pricing}
            </div>
            <p className="text-xs text-muted-foreground">{roleMessage.betaValue}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-2 mb-3">
            {benefits.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-amber-200 dark:border-amber-800">
            {benefits.extras.map((extra, idx) => (
              <p key={idx} className="text-xs text-muted-foreground">
                {idx === 0 && '⚡ '}{extra}
              </p>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <Button 
            size="lg"
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleJoinBeta}
          >
            {roleMessage.ctaText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          {showDismiss && (
            <Button 
              size="lg"
              variant="outline"
              onClick={handleDismiss}
            >
              Maybe Later
            </Button>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Limited to 100 organizations • {cohortInfo.slotsTotal} spots in {cohortInfo.shortName} cohort
        </p>
      </CardContent>
    </Card>
  );
}

