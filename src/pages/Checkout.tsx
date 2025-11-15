import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Check, CreditCard, Lock, ShoppingCart } from 'lucide-react';
import { ProductCatalog } from '../utils/oneTimeProducts';

interface CheckoutState {
  cart: string[];
}

const CART_STORAGE_KEY = 'onetimestore_cart';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CheckoutState | null;

  // Load cart from state or localStorage
  const [cart] = useState<string[]>(() => {
    if (state?.cart && state.cart.length > 0) {
      return state.cart;
    }
    // Fallback to localStorage
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      if (cart.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);

  useEffect(() => {
    // If no items in cart, redirect to store
    if (cart.length === 0) {
      navigate('/store');
    }
  }, [cart, navigate]);

  const getCartTotal = () => {
    return cart.reduce((total, productId) => {
      const product = ProductCatalog.getProduct(productId);
      const bundle = ProductCatalog.getBundle(productId);
      return total + (product?.price || bundle?.price || 0);
    }, 0);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);

    // TODO: Integrate with Stripe for payment processing
    // For now, show a message that this feature is coming soon
    alert('Checkout integration with Stripe is coming soon! You will receive a license key via email after payment.');

    setTimeout(() => {
      setIsProcessing(false);
      // In production, redirect to success page after payment
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/store')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Button>
          <h1 className="text-4xl font-bold text-foreground">Checkout</h1>
          <p className="text-muted-foreground mt-2">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((productId) => {
                    const product = ProductCatalog.getProduct(productId);
                    const bundle = ProductCatalog.getBundle(productId);
                    const item = product || bundle;

                    if (!item) return null;

                    return (
                      <div key={productId} className="flex justify-between items-start border-b border-border pb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {product ? product.tagline : bundle?.description}
                          </p>
                          {bundle && (
                            <div className="mt-2">
                              <span className="inline-block bg-success/10 text-success text-xs px-2 py-1 rounded">
                                Save ${bundle.savings}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-lg text-foreground">${item.price}</div>
                          <div className="text-xs text-muted-foreground">one-time</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* What's Included */}
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3">What's Included</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Lifetime access to all purchased products</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>All v1.x updates included free</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>100% offline operation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>License key delivered via email</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Email support included</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information (Placeholder) */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-8 bg-muted/30 rounded-lg text-center">
                  <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Secure Payment Processing</h3>
                  <p className="text-muted-foreground mb-4">
                    Payment integration with Stripe is being configured. You'll be able to complete your purchase securely with credit card, debit card, or other payment methods.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>256-bit SSL encrypted checkout</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Total Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-foreground">${getCartTotal()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">One-time payment</p>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      'Processing...'
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Complete Purchase
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By completing this purchase, you agree to our{' '}
                    <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                  </p>

                  {/* Security Badges */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground text-center mb-2">
                      Secure Payment Powered By
                    </div>
                    <div className="flex justify-center items-center gap-4 opacity-60">
                      <span className="font-semibold">Stripe</span>
                      <Lock className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
