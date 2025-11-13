import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, ArrowRight, XCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showComparisonDetails, setShowComparisonDetails] = useState<string | null>(null);

  const toggleBillingPeriod = () => {
    setBillingPeriod(prev => prev === 'monthly' ? 'annual' : 'monthly');
  };

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams starting their privacy compliance journey",
      price: billingPeriod === "monthly" ? "49" : "39",
      billing: "per user/month",
      features: [
        "Basic privacy assessment",
        "Essential privacy controls coverage",
        "Up to 100 risks tracked",
        "5 compliance templates",
        "Monthly automated compliance reports",
        "Weekly compliance status emails",
        "Quarterly executive summaries (automated)",
        "Deadline alerts (7, 3, 1 days before)",
        "Quarterly automated assessments",
        "Compliance health score tracking",
        "Basic progress dashboard",
        "Email support (48hr response)",
        "1 privacy framework",
        "Basic risk analytics"
      ]
    },
    {
      name: "Professional",
      description: "Complete privacy compliance suite for growing organizations",
      price: billingPeriod === "monthly" ? "99" : "79",
      billing: "per user/month",
      popular: true,
      features: [
        "Multi-regulation privacy assessments",
        "Full privacy framework coverage",
        "Unlimited risk tracking",
        "Automated compliance planning",
        "Unlimited custom reports",
        "Daily compliance health digest",
        "Weekly automated compliance reports",
        "Monthly comprehensive reports (automated)",
        "Quarterly executive dashboards (automated)",
        "Monthly automated assessments",
        "Real-time risk alerts (all priorities)",
        "Custom notification rules",
        "Multi-channel notifications (Email, SMS, Slack)",
        "Regulatory change alerts (24-hour)",
        "Predictive compliance analytics",
        "Advanced progress analytics",
        "Compliance velocity metrics",
        "Priority support (24hr response)",
        "Multiple privacy frameworks",
        "Advanced analytics & dashboards",
        "Custom workflows",
        "API access",
        "Quarterly privacy reviews"
      ]
    },
    {
      name: "Enterprise",
      description: "White-glove privacy compliance support for large organizations",
      price: "Contact us",
      billing: "custom pricing",
      features: [
        "Everything in Professional",
        "Real-time compliance monitoring",
        "Daily compliance briefings (automated)",
        "Weekly detailed reports (automated)",
        "Monthly executive reports (board-ready)",
        "Continuous automated assessments",
        "Custom notification workflows",
        "Role-based notification routing",
        "ITSM integration (Jira, ServiceNow)",
        "Executive dashboard alerts",
        "Predictive compliance analytics",
        "Anomaly detection",
        "Industry benchmarking",
        "Regulatory intelligence dashboard",
        "Privacy consultant collaboration tools",
        "White-glove implementation support",
        "Unlimited compliance frameworks",
        "Custom privacy control mapping",
        "Dedicated compliance specialist",
        "On-premise deployment option",
        "Custom integrations",
        "24/7 dedicated support with SLA",
        "Custom feature development",
        "Training and certification programs"
      ]
    }
  ];

  // Feature comparison data for detailed comparison table
  const featureCategories = [
    {
      id: "assessment",
      name: "Assessment Tools",
      features: [
        { name: "NIST 800-171 Assessment", starter: "Limited", professional: true, enterprise: true },
        { name: "NIST Privacy Framework Assessment", starter: false, professional: true, enterprise: true },
        { name: "Custom Assessment Templates", starter: false, professional: "Limited", enterprise: true },
        { name: "Supply Chain Risk Assessment", starter: false, professional: true, enterprise: true }
      ]
    },
    {
      id: "documents",
      name: "Documentation & Evidence",
      features: [
        { name: "System Security Plan (SSP) Generation", starter: "Basic", professional: true, enterprise: true },
        { name: "Automated POA&M Creation", starter: "Manual", professional: true, enterprise: true },
        { name: "Policy Templates", starter: "5 templates", professional: "20+ templates", enterprise: "Unlimited + Custom" },
        { name: "Evidence Management", starter: "Basic", professional: true, enterprise: true },
        { name: "Document Version Control", starter: false, professional: true, enterprise: true },
        { name: "CUI Flow Mapping", starter: false, professional: true, enterprise: true }
      ]
    },
    {
      id: "compliance",
      name: "Compliance Management",
      features: [
        { name: "Control Mapping", starter: "Basic", professional: true, enterprise: true },
        { name: "Compliance Dashboards", starter: "Basic", professional: true, enterprise: true },
        { name: "Continuous Monitoring", starter: false, professional: true, enterprise: true },
        { name: "Gap Analysis", starter: "Basic", professional: true, enterprise: true },
        { name: "Compliance Scoring", starter: true, professional: true, enterprise: true },
        { name: "Automated Evidence Collection", starter: false, professional: "Limited", enterprise: true },
      ]
    },
    {
      id: "support",
      name: "Support & Services",
      features: [
        { name: "Customer Support", starter: "Email (48hr)", professional: "Priority (24hr)", enterprise: "24/7 Dedicated" },
        { name: "Implementation Support", starter: false, professional: "Self-guided", enterprise: "White glove" },
        { name: "Compliance Expert Access", starter: false, professional: "Quarterly", enterprise: "Dedicated" },
        { name: "Training Sessions", starter: "1 session", professional: "Monthly", enterprise: "Unlimited" },
        { name: "Custom Integrations", starter: false, professional: "Basic API", enterprise: true }
      ]
    }
  ];

  return (
    <div className="py-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Choose the plan that best fits your organization's compliance needs
        </p>
        
        {/* Billing toggle */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <span className={`text-sm ${billingPeriod === 'monthly' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button 
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={toggleBillingPeriod}
            style={{ 
              backgroundColor: billingPeriod === 'annual' ? 'var(--primary)' : 'var(--muted)' 
            }}
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              style={{
                transform: billingPeriod === 'annual' ? 'translateX(1.25rem)' : 'translateX(0.25rem)'
              }}
            />
          </button>
          <span className={`text-sm ${billingPeriod === 'annual' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
            Annual
          </span>
          <span className="ml-2 bg-success/10 text-success text-xs px-2 py-1 rounded-full">
            Save 20%
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          Start your privacy compliance journey today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`relative dark:border-muted ${plan.popular ? 'border-primary shadow-lg dark:shadow-primary/10' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-6">
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

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                onClick={async () => {
                  if (plan.price === "Contact us") {
                    window.location.href = "mailto:sales@cybercorrect.com?subject=Enterprise Plan Inquiry";
                    return;
                  }
                  
                  try {
                    const { createCheckoutSession } = await import('../services/subscriptionService');
                    const tier = plan.name.toLowerCase() as 'starter' | 'professional';
                    
                    // createCheckoutSession never throws - always returns null or session
                    const session = await createCheckoutSession(tier, billingPeriod);
                    
                    if (session?.url) {
                      window.location.href = session.url;
                    } else {
                      // Fallback: redirect to subscription page (service not configured or failed)
                      console.warn('Checkout session not available, redirecting to subscription page');
                      window.location.href = '/account/subscription';
                    }
                  } catch (error) {
                    // This should never happen since createCheckoutSession never throws,
                    // but handle it gracefully just in case
                    console.error('Unexpected error creating checkout session:', error);
                    // Fallback: redirect to subscription page
                    window.location.href = '/account/subscription';
                  }
                }}
              >
                {plan.price === "Contact us" ? "Contact Sales" : "Subscribe Now"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Feature comparison section */}
      <div className="max-w-7xl mx-auto mt-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Compare Features</h2>
          <p className="text-muted-foreground">A detailed comparison of features across our plans</p>
        </div>

        {/* Feature Comparison Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-medium text-foreground border-b border-border w-1/3">Feature</th>
                    <th className="text-center p-4 font-medium text-foreground border-b border-border w-1/5">Starter</th>
                    <th className="text-center p-4 font-medium text-foreground border-b border-border w-1/5 bg-primary/5">Professional</th>
                    <th className="text-center p-4 font-medium text-foreground border-b border-border w-1/5">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {featureCategories.map((category) => (
                    <React.Fragment key={category.id}>
                      <tr className="bg-muted/20">
                        <td colSpan={4} className="p-4 font-semibold text-foreground border-t border-b border-border">
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
      <div className="mt-8 text-center max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-primary-teal to-secondary-teal rounded-xl p-6 text-white dark:from-dark-primary dark:to-dark-primary/70">
          <h3 className="text-xl font-bold mb-3">Ready to achieve compliance?</h3>
          <p className="mb-5">View our interactive demo to explore the platform</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="default" 
              className="bg-background text-primary hover:bg-muted border-2 border-background shadow-lg"
              onClick={() => navigate('/demo')}
            >
              View Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="secondary"
              className="bg-background/10 text-background hover:bg-background/20 border-2 border-background/30 shadow-lg"
              onClick={() => navigate('/assessments/privacy-assessment')}
            >
              Start Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;