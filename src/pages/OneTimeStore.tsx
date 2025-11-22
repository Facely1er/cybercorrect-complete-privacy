import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  ShoppingCart,
  Check,
  X,
  Download,
  Shield,
  FileText,
  Database,
  Lock,
  Sparkles,
  TrendingUp,
  Star,
  Info,
  ChevronRight
} from 'lucide-react';
import { ONE_TIME_PRODUCTS, PRODUCT_BUNDLES, ProductCatalog, OneTimeProduct, ProductBundle } from '../utils/oneTimeProducts';
import { UnifiedProductCatalog, UnifiedProduct } from '../utils/unifiedProductCatalog';

const CART_STORAGE_KEY = 'onetimestore_cart';

const OneTimeStore = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<string[]>(() => {
    // Load cart from localStorage on mount
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const [selectedProduct, setSelectedProduct] = useState<OneTimeProduct | ProductBundle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Products', icon: ShoppingCart },
    { id: 'subscription', name: 'Subscriptions', icon: TrendingUp },
    { id: 'bundle', name: 'Bundles', icon: Sparkles },
    { id: 'toolkit', name: 'Toolkits', icon: Database },
    { id: 'assessment', name: 'Assessments', icon: FileText },
    { id: 'gdpr', name: 'GDPR', icon: Shield },
    { id: 'templates', name: 'Templates', icon: FileText }
  ];

  // Get all products from unified catalog
  const allUnifiedProducts = UnifiedProductCatalog.getAllProducts();
  
  // Filter products based on category
  const filteredUnifiedProducts = selectedCategory === 'all'
    ? allUnifiedProducts.filter(p => p.type !== 'bundle')
    : UnifiedProductCatalog.getProductsByCategory(selectedCategory as any).filter(p => p.type !== 'bundle');

  // Separate subscriptions and one-time products
  const subscriptionProducts = filteredUnifiedProducts.filter(p => p.type === 'subscription');
  const oneTimeProducts = filteredUnifiedProducts.filter(p => p.type === 'one-time');

  const filteredBundles = selectedCategory === 'all' || selectedCategory === 'bundle'
    ? PRODUCT_BUNDLES
    : [];

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (productId: string) => {
    if (!cart.includes(productId)) {
      const newCart = [...cart, productId];
      setCart(newCart);
    }
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(id => id !== productId);
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleLearnMore = (productId: string) => {
    const unifiedProduct = UnifiedProductCatalog.getProduct(productId);
    if (unifiedProduct) {
      if (unifiedProduct.type === 'subscription') {
        // Redirect to pricing page for subscriptions
        navigate('/pricing');
        return;
      } else if (unifiedProduct.type === 'one-time') {
        const product = ProductCatalog.getProduct(productId);
        if (product) {
          setSelectedProduct(product);
          setIsModalOpen(true);
        }
      } else if (unifiedProduct.type === 'bundle') {
        const bundle = ProductCatalog.getBundle(productId);
        if (bundle) {
          setSelectedProduct(bundle);
          setIsModalOpen(true);
        }
      }
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout', { state: { cart } });
  };

  const getCartTotal = () => {
    return cart.reduce((total, productId) => {
      const unifiedProduct = UnifiedProductCatalog.getProduct(productId);
      if (unifiedProduct?.type === 'one-time' || unifiedProduct?.type === 'bundle') {
        const product = ProductCatalog.getProduct(productId);
        const bundle = ProductCatalog.getBundle(productId);
        return total + (product?.price || bundle?.price || 0);
      }
      return total;
    }, 0);
  };

  const handleSubscriptionClick = (productId: string) => {
    // Redirect to pricing page for subscription purchases
    navigate('/pricing');
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-dark-primary dark:to-dark-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Complete Privacy Compliance Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Choose from one-time purchases or subscriptions. Find the perfect solution for your privacy compliance needs.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center">
                <Check className="w-6 h-6 mr-2" />
                <span>One-Time & Subscriptions</span>
              </div>
              <div className="flex items-center">
                <Check className="w-6 h-6 mr-2" />
                <span>Complete Privacy Options</span>
              </div>
              <div className="flex items-center">
                <Check className="w-6 h-6 mr-2" />
                <span>Flexible Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white dark:bg-dark-surface border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white shadow-lg scale-105'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Bundles */}
      {filteredBundles.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                Best Value
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Bundle & Save
              </h2>
              <p className="text-xl text-muted-foreground">
                Get multiple tools at a discounted price
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {filteredBundles.map((bundle) => {
                const productsInBundle = ProductCatalog.getProductsInBundle(bundle.id);
                const inCart = cart.includes(bundle.id);

                return (
                  <Card key={bundle.id} className="relative overflow-hidden hover:shadow-2xl transition-shadow duration-300 border-2 border-accent/20">
                    {bundle.id === 'complete-privacy-suite' && (
                      <div className="absolute top-0 right-0 bg-accent text-white px-4 py-1 text-sm font-bold">
                        BEST VALUE
                      </div>
                    )}
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">{bundle.name}</h3>
                        <p className="text-muted-foreground">{bundle.description}</p>
                      </div>

                      <div className="mb-6">
                        <div className="text-4xl font-bold text-center mb-2">
                          ${bundle.price}
                          <span className="text-lg text-muted-foreground line-through ml-2">
                            ${bundle.price + bundle.savings}
                          </span>
                        </div>
                        <div className="text-center text-accent font-semibold">
                          Save ${bundle.savings} ({Math.round((bundle.savings / (bundle.price + bundle.savings)) * 100)}%)
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="font-semibold text-sm text-muted-foreground uppercase">Includes:</div>
                        {productsInBundle.map((product) => (
                          <div key={product.id} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{product.name}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <Button
                          onClick={() => inCart ? removeFromCart(bundle.id) : addToCart(bundle.id)}
                          className={`w-full ${inCart ? 'bg-red-500 hover:bg-red-600' : 'bg-accent hover:bg-accent/90'}`}
                        >
                          {inCart ? (
                            <>
                              <X className="w-5 h-5 mr-2" />
                              Remove from Cart
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleLearnMore(bundle.id)}
                        >
                          <Info className="w-5 h-5 mr-2" />
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Subscription Plans */}
      {subscriptionProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Subscription Plans
              </h2>
              <p className="text-xl text-muted-foreground">
                Continuous compliance with cloud sync and team features
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {subscriptionProducts.map((product) => {
                return (
                  <Card key={product.id} className={`hover:shadow-xl transition-shadow duration-300 ${product.popular ? 'border-2 border-accent' : ''}`}>
                    {product.popular && (
                      <div className="absolute top-0 right-0 bg-accent text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                        POPULAR
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>

                      <div className="mb-4">
                        <div className="text-3xl font-bold text-primary">
                          {product.monthlyPrice === 0 ? 'Free' : `$${product.monthlyPrice}`}
                        </div>
                        {product.monthlyPrice > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {product.billing}
                            {product.annualPrice && product.annualPrice < product.monthlyPrice * 12 && (
                              <div className="text-accent mt-1">
                                Save ${(product.monthlyPrice * 12 - product.annualPrice).toFixed(0)}/year with annual billing
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {product.features && product.features.length > 0 && (
                        <div className="mb-4">
                          <div className="space-y-2">
                            {product.features.slice(0, 4).map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                                <span className="text-xs text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                            {product.features.length > 4 && (
                              <div className="text-xs text-primary font-medium">
                                + {product.features.length - 4} more features
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={() => handleSubscriptionClick(product.id)}
                        className={`w-full ${product.popular ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'}`}
                      >
                        {product.monthlyPrice === 0 ? 'Get Started' : 'View Plan'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Individual Products */}
      {oneTimeProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                One-Time Purchase Products
              </h2>
              <p className="text-xl text-muted-foreground">
                Choose the tools you need, pay once, own forever
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {oneTimeProducts.map((unifiedProduct) => {
                const product = ProductCatalog.getProduct(unifiedProduct.id);
                if (!product) return null;
                
                const inCart = cart.includes(product.id);

                return (
                <Card key={product.id} className="hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                          <p className="text-muted-foreground font-medium">{product.tagline}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary">${product.price}</div>
                          <div className="text-sm text-muted-foreground">Lifetime</div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{product.description}</p>
                    </div>

                    {/* Key Features */}
                    <div className="mb-6">
                      <div className="font-semibold mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5 text-accent" />
                        Key Features
                      </div>
                      <div className="space-y-2">
                        {product.features.slice(0, 5).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                        {product.features.length > 5 && (
                          <div className="text-sm text-primary font-medium">
                            + {product.features.length - 5} more features
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Privacy Badge */}
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-green-800 dark:text-green-300">100% Privacy Guaranteed</span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        All data stored locally in your browser. No cloud uploads, complete data control.
                      </p>
                    </div>


                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => inCart ? removeFromCart(product.id) : addToCart(product.id)}
                        className={`w-full ${inCart ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
                      >
                        {inCart ? (
                          <>
                            <X className="w-5 h-5 mr-2" />
                            Remove from Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart - ${product.price}
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleLearnMore(product.id)}
                      >
                        <Info className="w-5 h-5 mr-2" />
                        Learn More
                      </Button>
                    </div>

                    {/* Target Audience */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold">Perfect for:</span> {product.targetAudience.join(', ')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Comparison with Subscriptions */}
      <section className="py-16 bg-muted/20 dark:bg-dark-support/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                One-Time vs. Subscription: Which is Right for You?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* One-Time Purchase */}
              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Download className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">One-Time Purchase</h3>
                    <p className="text-muted-foreground">Own the tools forever</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Pay once, own forever</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">100% offline - complete privacy</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">No recurring fees</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">All v1.x updates included</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">No cloud sync</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">No automated reports</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">No team collaboration</span>
                    </div>
                  </div>

                  <div className="text-center font-semibold text-primary">
                    Best for: Consultants, one-time projects, privacy-first users
                  </div>
                </CardContent>
              </Card>

              {/* Subscription */}
              <Card className="border-2 border-accent">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <TrendingUp className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Subscription</h3>
                    <p className="text-muted-foreground">Continuous compliance</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Cloud sync and backup</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Automated compliance monitoring</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Real-time regulatory updates</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Team collaboration features</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Priority support</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Recurring monthly/annual fees</span>
                    </div>
                  </div>

                  <div className="text-center font-semibold text-accent mb-4">
                    Best for: Organizations, ongoing compliance, teams
                  </div>

                  <Link to="/pricing">
                    <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-white">
                      View Subscription Plans
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Shopping Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t-2 border-primary shadow-2xl z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center gap-4">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-bold text-lg">{cart.length} item(s) in cart</div>
                  <div className="text-sm text-muted-foreground">Total: ${getCartTotal()}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleProceedToCheckout}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Proceed to Checkout (${getCartTotal()})
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">What does "lifetime access" mean?</h3>
                  <p className="text-muted-foreground">
                    Lifetime access means you can use the product forever with no expiration. You'll receive all v1.x updates free.
                    Major version upgrades (v2.0+) may require an upgrade fee, but v1.x will continue to work indefinitely.
                  </p>
                </CardContent>
              </Card>


              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Is my data really 100% private?</h3>
                  <p className="text-muted-foreground">
                    Yes! All one-time products use localStorage in your browser. Data never leaves your device.
                    No cloud uploads, no servers - complete data sovereignty.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Can I upgrade to a subscription later?</h3>
                  <p className="text-muted-foreground">
                    Absolutely! One-time purchases don't count toward subscription pricing, but you can add cloud sync
                    and team features by subscribing to Professional or Enterprise plans.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">What technical requirements are needed?</h3>
                  <p className="text-muted-foreground">
                    Just a modern web browser (Chrome, Firefox, Safari, Edge) with JavaScript enabled.
                    Minimum 50-100MB free storage depending on the product.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-dark-primary dark:to-dark-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Own Your Privacy Tools?</h2>
          <p className="text-xl mb-8">Join thousands of privacy professionals using our offline tools</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-white text-primary hover:bg-gray-100 font-semibold">
              <Download className="w-5 h-5 mr-2" />
              Browse All Products
            </Button>
            <Link to="/pricing">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Compare with Subscriptions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {isModalOpen && selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-foreground">
                {selectedProduct.name}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6">
              {'tagline' in selectedProduct && (
                <p className="text-lg text-muted-foreground mb-4">{selectedProduct.tagline}</p>
              )}
              
              {'longDescription' in selectedProduct ? (
                <p className="text-muted-foreground mb-6">{selectedProduct.longDescription}</p>
              ) : (
                <p className="text-muted-foreground mb-6">{selectedProduct.description}</p>
              )}

              {'features' in selectedProduct && selectedProduct.features && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent" />
                    Features
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedProduct.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {'includedTools' in selectedProduct && selectedProduct.includedTools && selectedProduct.includedTools.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Included Tools</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedProduct.includedTools.map((tool, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-primary" />
                        <span className="text-sm">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {'products' in selectedProduct && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Bundle Includes</h3>
                  <div className="space-y-2">
                    {ProductCatalog.getProductsInBundle(selectedProduct.id).map((product) => (
                      <div key={product.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.tagline}</div>
                        </div>
                        <div className="text-primary font-semibold">${product.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {'targetAudience' in selectedProduct && selectedProduct.targetAudience && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Perfect For</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.targetAudience.map((audience, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {'technicalRequirements' in selectedProduct && selectedProduct.technicalRequirements && selectedProduct.technicalRequirements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Technical Requirements</h3>
                  <ul className="space-y-2">
                    {selectedProduct.technicalRequirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-primary">${selectedProduct.price}</div>
                    <div className="text-sm text-muted-foreground">One-time payment, lifetime access</div>
                  </div>
                  <div className="flex gap-3">
                    {cart.includes(selectedProduct.id) ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          removeFromCart(selectedProduct.id);
                        }}
                        className="border-red-500 text-red-500 hover:bg-red-50"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Remove from Cart
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          addToCart(selectedProduct.id);
                        }}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart - ${selectedProduct.price}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OneTimeStore;
