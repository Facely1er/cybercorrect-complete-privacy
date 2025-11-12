import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle, XCircle, Calendar, CreditCard, AlertCircle, ArrowRight } from 'lucide-react';
import { getUserSubscription, cancelSubscription, updateSubscription, checkSubscriptionAccess } from '../../services/subscriptionService';
import { SubscriptionStatus } from '../../services/subscriptionService';
import { SUBSCRIPTION_LIMITS } from '../../utils/monetization';

const Subscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const sub = await getUserSubscription();
      setSubscription(sub);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.')) {
      return;
    }

    try {
      setCancelling(true);
      await cancelSubscription();
      await loadSubscription();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  const handleUpgrade = async (newTier: 'starter' | 'professional') => {
    try {
      await updateSubscription(newTier);
      await loadSubscription();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription');
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading subscription...</div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="py-20">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">No Active Subscription</h2>
              <p className="text-muted-foreground mb-6">
                You're currently on the free plan. Upgrade to unlock premium features.
              </p>
              <Button onClick={() => window.location.href = '/pricing'}>
                View Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const limits = SUBSCRIPTION_LIMITS[subscription.tier] || SUBSCRIPTION_LIMITS.free;
  const isActive = subscription.status === 'active' || subscription.status === 'trialing';
  const isExpired = new Date(subscription.currentPeriodEnd) < new Date();

  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage your subscription, billing, and access to premium features.
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Subscription */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl capitalize">{subscription.tier} Plan</CardTitle>
                <CardDescription>Your current subscription details</CardDescription>
              </div>
              <Badge variant={isActive && !isExpired ? "default" : "destructive"}>
                {subscription.status === 'active' && !isExpired ? 'Active' : 
                 subscription.status === 'trialing' ? 'Trialing' :
                 subscription.status === 'past_due' ? 'Past Due' :
                 subscription.status === 'cancelled' ? 'Cancelled' : 'Expired'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Current Period</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Billing</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {subscription.stripeCustomerId ? 'Stripe' : 'Free Plan'}
                </p>
              </div>
            </div>

            {subscription.cancelAtPeriodEnd && (
              <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center gap-2 text-warning">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Subscription will cancel at the end of the billing period</span>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              {subscription.tier !== 'enterprise' && (
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/pricing'}
                >
                  Change Plan
                </Button>
              )}
              {isActive && !subscription.cancelAtPeriodEnd && (
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
            <CardDescription>Features included in your current plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Export Credits</h4>
                <p className="text-sm text-muted-foreground">
                  {limits.exportsPerMonth === -1 ? 'Unlimited' : `${limits.exportsPerMonth} per month`}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Available Formats</h4>
                <div className="flex flex-wrap gap-2">
                  {limits.exportFormats.map((format) => (
                    <Badge key={format} variant="outline">
                      {format.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Templates</h4>
                <p className="text-sm text-muted-foreground">
                  {limits.templates === -1 ? 'Unlimited' : `${limits.templates} premium templates`}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Email Notifications</h4>
                <div className="flex items-center gap-2">
                  {limits.notifications.emailEnabled ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm">{limits.notifications.emailEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Automated Reports</h4>
                <div className="flex items-center gap-2">
                  {limits.reports.monthly ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm">{limits.reports.monthly ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Compliance Health Monitoring</h4>
                <div className="flex items-center gap-2">
                  {limits.complianceHealth.enabled ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm">{limits.complianceHealth.enabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Options */}
        {subscription.tier !== 'enterprise' && (
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Options</CardTitle>
              <CardDescription>Upgrade to unlock more features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscription.tier === 'free' && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Starter Plan</h4>
                        <p className="text-sm text-muted-foreground">$49/month or $39/month (annual)</p>
                      </div>
                      <Button onClick={() => window.location.href = '/pricing'}>
                        Upgrade
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                {subscription.tier === 'starter' && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Professional Plan</h4>
                        <p className="text-sm text-muted-foreground">$99/month or $79/month (annual)</p>
                      </div>
                      <Button onClick={() => window.location.href = '/pricing'}>
                        Upgrade
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Subscription;


