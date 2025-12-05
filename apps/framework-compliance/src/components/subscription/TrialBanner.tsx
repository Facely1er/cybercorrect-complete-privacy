import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { isOnTrial, getTrialDaysRemaining } from '../../services/subscriptionService';

export function TrialBanner() {
  const navigate = useNavigate();
  const [trialDays, setTrialDays] = useState<number | null>(null);
  const [onTrial, setOnTrial] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkTrial() {
      try {
        const trialing = await isOnTrial();
        setOnTrial(trialing);
        if (trialing) {
          const days = await getTrialDaysRemaining();
          setTrialDays(days);
        }
      } catch (error) {
        console.warn('Error checking trial status:', error);
      } finally {
        setLoading(false);
      }
    }
    checkTrial();
  }, []);

  if (loading || !onTrial || trialDays === null) {
    return null;
  }

  const isExpiringSoon = trialDays <= 3;
  const isExpired = trialDays === 0;

  if (isExpired) {
    return (
      <Card className="mb-4 border-destructive bg-destructive/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <strong className="text-destructive">Trial Expired</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Your trial has ended. Upgrade to continue using premium features.
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={() => navigate('/pricing')}
              className="ml-4"
            >
              Upgrade Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`mb-4 ${isExpiringSoon ? 'border-warning bg-warning/5' : 'border-primary bg-primary/5'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className={`h-5 w-5 ${isExpiringSoon ? 'text-warning' : 'text-primary'}`} />
            <div>
              <strong className={isExpiringSoon ? 'text-warning' : 'text-primary'}>
                Free Trial Active
              </strong>
              <p className="text-sm text-muted-foreground mt-1">
                {trialDays === 1 
                  ? '1 day remaining' 
                  : `${trialDays} days remaining`}
                {isExpiringSoon && ' - Upgrade now to continue!'}
                {!isExpiringSoon && ' - Your trial will automatically convert to a paid subscription unless cancelled.'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate('/account/subscription')}
            >
              Manage Trial
            </Button>
            {isExpiringSoon && (
              <Button 
                size="sm" 
                onClick={() => navigate('/pricing')}
                className="ml-2"
              >
                Upgrade Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

