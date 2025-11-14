import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { ONE_TIME_PRODUCTS, PRODUCT_BUNDLES, ProductCatalog, LicenseManager } from '../utils/oneTimeProducts';

const OneTimeStore = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Products', icon: ShoppingCart },
    { id: 'bundle', name: 'Bundles', icon: Sparkles },
    { id: 'toolkit', name: 'Toolkits', icon: Database },
    { id: 'assessment', name: 'Assessments', icon: FileText },
    { id: 'gdpr', name: 'GDPR', icon: Shield },
    { id: 'templates', name: 'Templates', icon: FileText }
  ];

  const filteredProducts = selectedCategory === 'all'
    ? ONE_TIME_PRODUCTS
    : ProductCatalog.getProductsByCategory(selectedCategory as any);

  const filteredBundles = selectedCategory === 'all' || selectedCategory === 'bundle'
    ? PRODUCT_BUNDLES
    : [];

  const addToCart = (productId: string) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(id => id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, productId) => {
      const product = ProductCatalog.getProduct(productId);
      const bundle = ProductCatalog.getBundle(productId);
      return total + (product?.price || bundle?.price || 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-dark-primary dark:to-dark-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Tools You Own Forever
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              No subscriptions. No recurring fees. Complete privacy with 100% offline tools.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center">
                <Check className="w-6 h-6 mr-2" />
                <span>Lifetime Access</span>
              </div>
              <div className="flex items-center">
                <Check className="w-6 h-6 mr-2" />
                <span>100% Offline</span>
              </div>
              <div className="flex items-center">
                <Check className="w-6 h-6 mr-2" />
                <span>14-Day Guarantee</span>
              </div>
              <div className="flex items-center">
                <Check className="w-6 h-6 mr-2" />
                <span>Complete Privacy</span>
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
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Individual Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Individual Products
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the tools you need, pay once, own forever
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {filteredProducts.map((product) => {
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

                    {/* Refund Policy */}
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-semibold text-blue-800 dark:text-blue-300">14-Day Money-Back Guarantee</span>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Try risk-free. Full refund if product doesn't meet your expectations.
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
                      <Button variant="outline" className="w-full">
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
                <Button variant="outline" onClick={() => setCart([])}>
                  Clear Cart
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => navigate('/checkout', { state: { cart } })}
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
                  <h3 className="font-bold text-lg mb-2">How does the 14-day money-back guarantee work?</h3>
                  <p className="text-muted-foreground">
                    If you're not satisfied within 14 days, email contact@ermits.com for a full refund. See our{' '}
                    <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link> for details.
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
    </div>
  );
};

export default OneTimeStore;
