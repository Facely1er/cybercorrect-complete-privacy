import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, ArrowRight, XCircle, Check, ChevronDown, ChevronUp, ShoppingBag, Zap } from 'lucide-react';
import { ONE_TIME_PRODUCTS, PRODUCT_BUNDLES, getAllSubscriptions } from '../utils/monetization';
import { logWarning, logError } from '../utils/common';

const Pricing = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showComparisonDetails, setShowComparisonDetails] = useState<string | null>(null);

  const toggleBillingPeriod = () => {
    setBillingPeriod(prev => prev === 'monthly' ? 'annual' : 'monthly');
  };

  // Get subscription plans from catalog
  const subscriptionProducts = getAllSubscriptions();
  
  // Convert subscription products to plan format for display
  const plans = subscriptionProducts.map(product => ({
    name: product.name,
    description: product.description,
    price: product.tier === 'free' 
      ? "0" 
      : product.tier === 'enterprise'
      ? "Contact us"
      : billingPeriod === "monthly" 
        ? product.monthlyPrice.toString() 
        : product.annualPrice.toString(),
    billing: product.billing,
    free: product.tier === 'free',
    popular: product.popular || false,
    tier: product.tier,
    features: product.features
  }));

  // Feature comparison data for detailed comparison table
  const featureCategories = [
    {
      id: "assessment",
      name: "Assessment Tools",
      features: [
        { name: "Privacy Gap Analysis", free: "Basic", starter: "Enhanced", professional: true, enterprise: true },
        { name: "GDPR/CCPA Assessment", free: "1 framework", starter: "2 frameworks", professional: true, enterprise: true },
        { name: "Risk Tracking", free: "Up to 25", starter: "Up to 100", professional: "Unlimited", enterprise: "Unlimited" },
        { name: "Custom Assessment Templates", free: false, starter: "Limited", professional: "Advanced", enterprise: true },
        { name: "Supply Chain Risk Assessment", free: false, starter: false, professional: true, enterprise: true }
      ]
    },
    {
      id: "documents",
      name: "Documentation & Evidence",
      features: [
        { name: "Privacy Policy Generation", free: "Basic", starter: "Enhanced", professional: true, enterprise: true },
        { name: "DPIA Templates", free: false, starter: "Basic", professional: "Advanced", enterprise: "Custom" },
        { name: "Policy Templates", free: "3 templates", starter: "10 templates", professional: "25+ templates", enterprise: "Unlimited + Custom" },
        { name: "Evidence Management", free: "Manual", starter: "Basic", professional: true, enterprise: true },
        { name: "Document Version Control", free: false, starter: false, professional: true, enterprise: true },
        { name: "Export Formats", free: "PDF only", starter: "PDF, Word", professional: "All formats", enterprise: "All formats + Custom" }
      ]
    },
    {
      id: "compliance",
      name: "Compliance Management",
      features: [
        { name: "Control Mapping", free: "Basic", starter: "Enhanced", professional: true, enterprise: true },
        { name: "Compliance Dashboard", free: "Basic", starter: "Standard", professional: "Advanced", enterprise: "Custom" },
        { name: "Continuous Monitoring", free: false, starter: false, professional: true, enterprise: true },
        { name: "Gap Analysis", free: "Basic", starter: "Standard", professional: "Advanced", enterprise: "Advanced + AI" },
        { name: "Compliance Scoring", free: true, starter: true, professional: true, enterprise: true },
        { name: "Automated Reporting", free: false, starter: "Monthly", professional: "Weekly/Daily", enterprise: "Real-time" },
      ]
    },
    {
      id: "support",
      name: "Support & Services",
      features: [
        { name: "Customer Support", free: "Community", starter: "Email (48hr)", professional: "Priority (24hr)", enterprise: "24/7 Dedicated" },
        { name: "Implementation Support", free: "Self-service", starter: "Documentation", professional: "Guided", enterprise: "White glove" },
        { name: "Compliance Expert Access", free: false, starter: false, professional: "Quarterly", enterprise: "Dedicated" },
        { name: "Training Sessions", free: "Self-paced", starter: "2 sessions", professional: "Monthly", enterprise: "Unlimited" },
        { name: "Custom Integrations", free: false, starter: false, professional: "Basic API", enterprise: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-4 md:pt-6 pb-12 md:pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Simple, Transparent Pricing</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose between flexible subscriptions or own your tools forever
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              <span>Subscriptions: Continuous updates & support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              <span>One-Time: Own forever, 100% offline</span>
            </div>
          </div>
        </div>

        {/* Subscription Plans Section */}
        <div className="max-w-7xl mx-auto mb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Subscription Plans</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Continuous compliance with automated updates, alerts, and team features
          </p>
        
        {/* Billing toggle */}
        <div className="flex items-center justify-center space-x-3 mb-10">
          <span className={`text-sm ${billingPeriod === 'monthly' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button 
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              billingPeriod === 'annual' ? 'bg-primary' : 'bg-muted'
            }`}
            onClick={toggleBillingPeriod}
            aria-label={`Switch to ${billingPeriod === 'monthly' ? 'annual' : 'monthly'} billing`}
            title={`Switch to ${billingPeriod === 'monthly' ? 'annual' : 'monthly'} billing`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingPeriod === 'annual' ? 'translate-x-[1.25rem]' : 'translate-x-[0.25rem]'
              }`}
            />
          </button>
          <span className={`text-sm ${billingPeriod === 'annual' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
            Annual
          </span>
          <span className="ml-2 bg-success/10 text-success text-xs px-2 py-1 rounded-full">
            Save 20%
          </span>
        </div>
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`relative h-full flex flex-col transition-all hover:shadow-xl dark:border-muted ${
              plan.popular ? 'border-primary border-2 shadow-lg dark:shadow-primary/10 scale-105' : 'hover:border-primary/50'
            }`}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
              <CardDescription className="text-sm mt-2">{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <div className="mb-6">
                {!plan.free && plan.price !== "Contact us" && (
                  <span className="inline-block bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-1 rounded text-xs font-semibold mb-3">
                    SUBSCRIPTION
                  </span>
                )}
                {plan.free && (
                  <span className="inline-block bg-success/10 text-success px-2 py-1 rounded text-xs font-semibold mb-3">
                    FREE FOREVER
                  </span>
                )}
                <div className="flex items-end gap-2">
                  {plan.price === "Contact us" ? (
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  ) : (
                    <>
                      <span className="text-sm mt-2 text-foreground">$</span>
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.billing}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full mt-auto"
                variant={plan.free ? "default" : (plan.popular ? "default" : "outline")}
                size="lg"
                onClick={async () => {
                  if (plan.free) {
                    navigate('/login');
                    return;
                  }

                  if (plan.price === "Contact us") {
                    window.location.href = "mailto:sales@cybercorrect.com?subject=Enterprise Plan Inquiry";
                    return;
                  }

                  try {
                    const { createCheckoutSession } = await import('../services/subscriptionService');
                    const tier = plan.tier as 'starter' | 'professional' | 'enterprise';

                    if (tier === 'enterprise') {
                      window.location.href = "mailto:sales@cybercorrect.com?subject=Enterprise Plan Inquiry";
                      return;
                    }

                    const session = await createCheckoutSession(tier, billingPeriod);

                    if (session?.url) {
                      window.location.href = session.url;
                    } else {
                      // Service not configured or failed
                      logWarning('Checkout session not available');
                      alert('Payment processing is currently unavailable. Please contact support or try again later.');
                    }
                  } catch (error) {
                    // Show user-friendly error message
                    const errorMessage = error instanceof Error ? error.message : 'Failed to start checkout. Please try again.';
                    logError(error instanceof Error ? error : new Error('Error creating checkout session'), { context: 'Pricing' });
                    alert(`Unable to process payment: ${errorMessage}\n\nPlease check your connection and try again, or contact support if the problem persists.`);
                  }
                }}
              >
                {plan.free ? "Get Started Free" : (plan.price === "Contact us" ? "Contact Sales" : "Subscribe Now")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      {/* One-Time Products Section */}
      <div className="max-w-7xl mx-auto mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">One-Time Purchase Products</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Own your privacy tools forever with 100% offline operation. No recurring fees, complete data control.
          </p>
          <div className="flex justify-center flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">Lifetime access to all purchased tools</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">100% offline - your data never leaves your device</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">All v1.x updates included free</span>
            </div>
          </div>
        </div>

        {/* Featured Bundle */}
        {PRODUCT_BUNDLES.filter(b => b.id === 'complete-privacy-suite').map((bundle) => (
          <Card key={bundle.id} className="mb-8 bg-gradient-to-br from-primary/5 via-background to-cyan-500/5 border-2 border-primary/30">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      <Zap className="h-3.5 w-3.5" />
                      BEST VALUE
                    </span>
                    <span className="inline-flex items-center bg-success/10 text-success px-3 py-1 rounded-full text-xs font-semibold">
                      SAVE ${bundle.savings}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{bundle.name}</h3>
                  <p className="text-muted-foreground mb-4">{bundle.description}</p>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-4xl font-bold text-foreground">${bundle.price}</span>
                    <span className="text-2xl text-muted-foreground line-through">
                      ${bundle.products.reduce((sum, pid) => {
                        const product = ONE_TIME_PRODUCTS.find(p => p.id === pid);
                        return sum + (product?.price || 0);
                      }, 0)}
                    </span>
                    <span className="text-success font-medium">Save ${bundle.savings}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Includes all 5 premium tools + lifetime updates</p>
                </div>
                <div>
                  <Button
                    size="lg"
                    onClick={() => navigate('/store')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Buy Complete Suite
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Individual One-Time Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {ONE_TIME_PRODUCTS.map((product) => (
            <Card key={product.id} className="relative hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">{product.name}</CardTitle>
                <CardDescription>{product.tagline}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-4">
                  <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold mb-3">
                    ONE-TIME PURCHASE
                  </span>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-sm mt-2 text-foreground">$</span>
                    <span className="text-4xl font-bold text-foreground">{product.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Pay once, own forever</p>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-4">{product.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>100% offline</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>All v1.x updates</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate('/store')}
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/store')}
            className="border-2"
          >
            View Full Product Catalog & Bundles
            <ShoppingBag className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Feature comparison section */}
      <div className="max-w-7xl mx-auto mt-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Compare Features</h2>
          <p className="text-lg text-muted-foreground">A detailed comparison of features across our plans</p>
        </div>

        {/* Feature Comparison Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto mobile-scroll-container -mx-4 sm:mx-0">
              <table className="w-full border-collapse min-w-[640px] sm:min-w-0">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-medium text-foreground border-b border-border">Feature</th>
                    <th className="text-center p-4 font-medium text-foreground border-b border-border">Free</th>
                    <th className="text-center p-4 font-medium text-foreground border-b border-border">Starter</th>
                    <th className="text-center p-4 font-medium text-foreground border-b border-border bg-primary/5">Professional</th>
                    <th className="text-center p-4 font-medium text-foreground border-b border-border">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {featureCategories.map((category) => (
                    <React.Fragment key={category.id}>
                      <tr className="bg-muted/20">
                        <td colSpan={5} className="p-4 font-semibold text-foreground border-t border-b border-border">
                          <button
                            className="flex items-center justify-between w-full text-left"
                            onClick={() => setShowComparisonDetails(showComparisonDetails === category.id ? null : category.id)}
                          >
                            {category.name}
                            {showComparisonDetails === category.id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {(showComparisonDetails === category.id) && category.features.map((feature, idx) => (
                        <tr key={`${category.id}-${idx}`} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}>
                          <td className="p-4 text-sm border-b border-border">{feature.name}</td>
                          <td className="text-center p-4 border-b border-border">
                            {feature.free === true && <Check className="h-5 w-5 text-primary mx-auto" />}
                            {feature.free === false && <XCircle className="h-5 w-5 text-muted-foreground/50 mx-auto" />}
                            {typeof feature.free === 'string' && <span className="text-sm">{feature.free}</span>}
                          </td>
                          <td className="text-center p-4 border-b border-border">
                            {feature.starter === true && <Check className="h-5 w-5 text-primary mx-auto" />}
                            {feature.starter === false && <XCircle className="h-5 w-5 text-muted-foreground/50 mx-auto" />}
                            {typeof feature.starter === 'string' && <span className="text-sm">{feature.starter}</span>}
                          </td>
                          <td className="text-center p-4 border-b border-border bg-primary/5">
                            {feature.professional === true && <Check className="h-5 w-5 text-primary mx-auto" />}
                            {feature.professional === false && <XCircle className="h-5 w-5 text-muted-foreground/50 mx-auto" />}
                            {typeof feature.professional === 'string' && <span className="text-sm">{feature.professional}</span>}
                          </td>
                          <td className="text-center p-4 border-b border-border">
                            {feature.enterprise === true && <Check className="h-5 w-5 text-primary mx-auto" />}
                            {feature.enterprise === false && <XCircle className="h-5 w-5 text-muted-foreground/50 mx-auto" />}
                            {typeof feature.enterprise === 'string' && <span className="text-sm">{feature.enterprise}</span>}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="mt-24 text-center max-w-5xl mx-auto px-4">
        <div className="bg-primary dark:bg-dark-primary rounded-xl p-8 md:p-10 text-white shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to achieve compliance?</h3>
          <p className="mb-6 text-lg">View our interactive demo to explore the platform</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-2xl mx-auto px-4">
            <Button 
              className="bg-white text-primary hover:bg-gray-100 shadow-lg font-semibold w-full sm:w-auto"
              onClick={() => navigate('/demo')}
            >
              <span className="whitespace-normal">View Demo</span>
              <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
            </Button>
            <Button 
              variant="outline"
              className="bg-transparent text-white hover:bg-white/10 border-2 border-white shadow-lg font-semibold w-full sm:w-auto"
              onClick={() => navigate('/assessments/privacy-assessment')}
            >
              <span className="whitespace-normal">Start Assessment</span>
              <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Pricing;