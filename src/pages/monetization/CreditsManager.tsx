import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  ArrowLeft,
  Download,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Plus,
  History
} from 'lucide-react';
import { toast } from '../../components/ui/Toaster';
import { monetization, EXPORT_CREDIT_COSTS, ExportFormat } from '../../utils/monetization';

const CreditsManager = () => {
  const [credits, setCredits] = useState(monetization.getRemainingCredits());
  const [history, setHistory] = useState(monetization.getCreditsHistory());
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCreditPackage, setSelectedCreditPackage] = useState<number | null>(null);

  const subscriptionTier = monetization.getSubscriptionTier();
  const subscription = monetization.getSubscriptionTier();

  useEffect(() => {
    // Refresh credits periodically
    const interval = setInterval(() => {
      setCredits(monetization.getRemainingCredits());
      setHistory(monetization.getCreditsHistory());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const creditPackages = [
    { amount: 10, price: 10, bonus: 0 },
    { amount: 25, price: 20, bonus: 5 },
    { amount: 50, price: 35, bonus: 10 },
    { amount: 100, price: 60, bonus: 20 },
    { amount: 250, price: 125, bonus: 50 }
  ];

  const handlePurchaseCredits = (amount: number, price: number) => {
    const result = monetization.purchaseExportCredits(amount, price);
    if (result.success) {
      toast.success('Credits purchased', result.message);
      setCredits(monetization.getRemainingCredits());
      setShowPurchaseModal(false);
      setSelectedCreditPackage(null);
    } else {
      toast.error('Purchase failed', result.message);
    }
  };

  const getCreditLimit = () => {
    const limits = {
      free: 0,
      starter: 10,
      professional: -1, // unlimited
      enterprise: -1 // unlimited
    };
    return limits[subscriptionTier];
  };

  const creditLimit = getCreditLimit();
  const isUnlimited = creditLimit === -1;

  return (
    <div className="py-8">
      <div className="mb-6">
        <Link to="/toolkit" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Toolkit
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Export Credits</h1>
        <p className="text-muted-foreground">
          Manage your export credits and purchase additional credits if needed
        </p>
      </div>

      {/* Credits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Remaining Credits</span>
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {isUnlimited ? '∞' : credits}
            </div>
            {!isUnlimited && (
              <div className="text-xs text-muted-foreground mt-1">
                of {creditLimit} monthly credits
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current Plan</span>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold capitalize text-foreground">{subscriptionTier}</div>
            {!isUnlimited && (
              <div className="text-xs text-muted-foreground mt-1">
                {creditLimit} credits/month included
              </div>
            )}
            {isUnlimited && (
              <div className="text-xs text-success mt-1">
                Unlimited exports included
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Usage This Month</span>
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{history.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              exports completed
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Costs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Export Credit Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(EXPORT_CREDIT_COSTS).map(([format, cost]) => (
              <div key={format} className="border border-border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">{format.toUpperCase()}</div>
                <div className="text-2xl font-bold">{cost}</div>
                <div className="text-xs text-muted-foreground">credits</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Purchase Credits Section */}
      {!isUnlimited && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Purchase Additional Credits</span>
              <Button onClick={() => setShowPurchaseModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Buy Credits
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {creditPackages.map((pkg, idx) => (
                <div 
                  key={idx} 
                  className="border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedCreditPackage(idx);
                    setShowPurchaseModal(true);
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{pkg.amount}</div>
                    <div className="text-sm text-muted-foreground mb-2">credits</div>
                    {pkg.bonus > 0 && (
                      <div className="text-xs text-success mb-2">+{pkg.bonus} bonus</div>
                    )}
                    <div className="text-lg font-semibold">${pkg.price}</div>
                    <div className="text-xs text-muted-foreground">
                      ${(pkg.price / (pkg.amount + pkg.bonus)).toFixed(2)}/credit
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Need More Credits?</p>
                  <p className="text-muted-foreground">
                    Upgrade to Professional or Enterprise plan for unlimited exports. 
                    <Link to="/pricing" className="text-primary hover:underline ml-1">
                      View Plans
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Export History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No exports yet</p>
              <p className="text-sm">Your export history will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.slice().reverse().map((usage) => (
                <div 
                  key={usage.id} 
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Download className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{usage.tool}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(usage.date).toLocaleDateString()} • {usage.format.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    -{usage.creditsUsed} credits
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Purchase Export Credits</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCreditPackage !== null ? (
                <div>
                  {(() => {
                    const pkg = creditPackages[selectedCreditPackage];
                    return (
                      <div>
                        <div className="mb-4">
                          <div className="bg-muted p-4 rounded-lg mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span>Credits:</span>
                              <span className="text-2xl font-bold">{pkg.amount + pkg.bonus}</span>
                            </div>
                            {pkg.bonus > 0 && (
                              <div className="text-sm text-success">
                                Includes {pkg.bonus} bonus credits
                              </div>
                            )}
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                              <span>Price:</span>
                              <span className="text-xl font-semibold">${pkg.price}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                              setShowPurchaseModal(false);
                              setSelectedCreditPackage(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            className="flex-1"
                            onClick={() => handlePurchaseCredits(pkg.amount + pkg.bonus, pkg.price)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Purchase ${pkg.price}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 text-center">
                          Payment will be processed securely. In production, this would integrate with Stripe.
                        </p>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a credit package to purchase:
                  </p>
                  <div className="space-y-2">
                    {creditPackages.map((pkg, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCreditPackage(idx)}
                        className="w-full p-4 border border-border rounded-lg hover:border-primary transition-colors text-left"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{pkg.amount + pkg.bonus} Credits</div>
                            {pkg.bonus > 0 && (
                              <div className="text-xs text-success">+{pkg.bonus} bonus</div>
                            )}
                          </div>
                          <div className="text-lg font-bold">${pkg.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setShowPurchaseModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreditsManager;

