import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Check, CreditCard, Lock, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { ProductCatalog } from '../utils/monetization';
import { toast } from '../components/ui/Toaster';
import { 
  createOneTimeCheckoutSession, 
  validateCheckoutItems, 
  calculateTax,
  type OneTimeCheckoutItem 
} from '../services/oneTimeCheckoutService';
import { logError } from '../utils/common';
import { isSupabaseConfigured } from '../lib/supabase';

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
  const [error, setError] = useState<string | null>(null);
  const [taxAmount, setTaxAmount] = useState(0);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      if (cart.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to save cart to localStorage'), { context: 'Checkout' });
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

  const getCartItems = (): OneTimeCheckoutItem[] => {
    return cart.map((productId) => {
      const product = ProductCatalog.getProduct(productId);
      const bundle = ProductCatalog.getBundle(productId);
      const item = product || bundle;
      
      return {
        productId,
        name: item?.name || 'Unknown Product',
        price: item?.price || 0,
        quantity: 1,
      };
    }).filter(item => item.price > 0);
  };

  // Calculate tax when cart changes
  useEffect(() => {
    const subtotal = getCartTotal();
    const calculatedTax = calculateTax(subtotal);
    setTaxAmount(calculatedTax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  const handleCheckout = async () => {
    // Clear any previous errors
    setError(null);
    setIsProcessing(true);

    // Declare items outside try-catch so it's accessible in catch block
    let items: OneTimeCheckoutItem[] = [];

    try {
      // Validate cart
      if (cart.length === 0) {
        setError('Your cart is empty');
        toast.error('Cart Empty', 'Please add items to your cart before checkout');
        setIsProcessing(false);
        return;
      }

      // Get cart items
      items = getCartItems();
      
      // Validate items
      const validation = validateCheckoutItems(items);
      if (!validation.valid) {
        setError(validation.error || 'Invalid cart items');
        toast.error('Validation Error', validation.error || 'Please check your cart and try again');
        setIsProcessing(false);
        return;
      }

      // Create checkout session
      const successUrl = `${window.location.origin}/store/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/store`;

      toast.info('Processing', 'Creating secure checkout session...');

      console.log('Creating checkout session with:', {
        itemsCount: items.length,
        items: items.map(i => ({ productId: i.productId, name: i.name, price: i.price })),
        successUrl,
        cancelUrl,
        hasSupabase: isSupabaseConfigured(),
        stripeKey: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
      });

      const session = await createOneTimeCheckoutSession(items, successUrl, cancelUrl);

      console.log('Checkout session result:', {
        hasSession: !!session,
        hasUrl: !!session?.url,
        sessionId: session?.sessionId,
        url: session?.url,
      });

      if (!session || !session.url) {
        // This should not happen if error handling is correct, but keep as safety check
        console.error('Checkout session is null or missing URL:', session);
        setError('Unable to create checkout session. Please try again.');
        toast.error(
          'Checkout Unavailable', 
          'Payment processing is currently unavailable. Please try again later or contact support.'
        );
        setIsProcessing(false);
        return;
      }

      // Redirect to Stripe Checkout
      toast.success('Redirecting', 'Redirecting to secure payment page...');
      window.location.href = session.url;

      // Note: setIsProcessing(false) won't be reached if redirect succeeds,
      // but we keep it for error cases
    } catch (err) {
      // Log detailed error information
      const errorDetails = {
        error: err,
        errorMessage: err instanceof Error ? err.message : String(err),
        errorStack: err instanceof Error ? err.stack : undefined,
        cartItems: items?.length || 0,
        hasSupabase: isSupabaseConfigured(),
        stripeKey: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
      };
      
      console.error('Checkout Error Details:', errorDetails);
      logError(err instanceof Error ? err : new Error('Checkout error'), { 
        context: 'Checkout',
        ...errorDetails,
      });
      
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(
        'Checkout Failed', 
        errorMessage || 'Please try again or contact support if the problem persists.'
      );
      setIsProcessing(false);
    }
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
                    <span>
                      {taxAmount > 0 ? `$${taxAmount.toFixed(2)}` : (
                        <span className="text-xs">Calculated at checkout</span>
                      )}
                    </span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-foreground">
                        ${(getCartTotal() + taxAmount).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {taxAmount > 0 ? 'Including tax' : 'Tax calculated at checkout'} • One-time payment
                    </p>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="mt-4 p-3 bg-alert-coral/10 border border-alert-coral/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-alert-coral flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-alert-coral">Error</p>
                          <p className="text-xs text-muted-foreground mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isProcessing || cart.length === 0}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin flex-shrink-0" />
                        <span className="whitespace-normal">Processing...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                        <span className="whitespace-normal">Complete Purchase</span>
                      </>
                    )}
                  </Button>

                  <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center">
                    By completing this purchase, you agree to our{' '}
                      <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                      {', '}
                      <Link to="/ecommerce" className="text-primary hover:underline">E-Commerce Policies</Link>
                      {', '}
                      <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                      {', and '}
                      <Link to="/acceptable-use" className="text-primary hover:underline">Acceptable Use Policy</Link>
                  </p>
                  </div>

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
