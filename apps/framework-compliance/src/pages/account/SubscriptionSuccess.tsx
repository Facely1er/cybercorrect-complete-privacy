import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from '../../components/ui/Toaster';
import { getUserSubscription, syncSubscriptionFromSupabase } from '../../services/subscriptionService';
import { getSubscriptionByTier } from '../../utils/monetization';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const tier = searchParams.get('tier');
    const billing = searchParams.get('billing');

    // If we have a session_id from Stripe, sync subscription
    if (sessionId) {
      syncSubscription();
    } else if (tier) {
      // Mock/dev mode - just show success
      setSubscriptionTier(tier);
      setLoading(false);
    } else {
      setError('Invalid subscription success parameters');
      setLoading(false);
    }
  }, [searchParams]);

  const syncSubscription = async () => {
    try {
      // Sync from Supabase to get latest subscription data
      await syncSubscriptionFromSupabase();
      const subscription = await getUserSubscription();
      
      if (subscription) {
        setSubscriptionTier(subscription.tier);
      } else {
        setError('Subscription not found. Please contact support if you were charged.');
      }
    } catch (err) {
      console.error('Error syncing subscription:', err);
      setError('Failed to verify subscription. Please check your account or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const subscriptionProduct = subscriptionTier ? getSubscriptionByTier(subscriptionTier as any) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying your subscription...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-foreground">Subscription Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/account/subscription')}>
                View Subscription
              </Button>
              <Button onClick={() => navigate('/pricing')}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Subscription Activated!</h1>
            <p className="text-lg text-muted-foreground">
              Your {subscriptionProduct?.name || subscriptionTier} subscription is now active.
            </p>
          </div>

          {subscriptionProduct && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-3 text-foreground">What's Next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>You now have access to all {subscriptionProduct.name} features</span>
                </li>
                {subscriptionProduct.quarterlyDeliverables.length > 0 && (
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>Your quarterly deliverables will be available in your account</span>
                  </li>
                )}
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Check your email for subscription confirmation and receipt</span>
                </li>
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/account/subscription')} size="lg">
              View Subscription Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} size="lg">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;

