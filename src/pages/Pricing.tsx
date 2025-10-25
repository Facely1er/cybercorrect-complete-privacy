import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, ArrowRight, Shield, XCircle, Calculator, Check, ChevronDown, ChevronUp, Building, Cloud, Network } from 'lucide-react';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [calculator, setCalculator] = useState({ employees: 10, complexity: 'medium', companySize: '11-50', complianceLevel: 'partial' });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
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
        "Basic quarterly reports",
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

  const faqs = [
    {
      question: "What happens during the free trial?",
      answer: "You get full access to your chosen plan for 14 days. We'll help you import your current compliance data and get your first assessment started within 24 hours. Our team will guide you through the platform to ensure you get maximum value from your trial."
    },
    {
      question: "How does the annual discount work?",
      answer: "Annual plans are billed once per year and include a 20% discount compared to monthly billing. You can switch between billing periods at any time before your renewal date. All annual plans also include additional benefits like extended support hours and priority feature requests."
    },
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can upgrade, downgrade or cancel your subscription at any time. Upgrades take effect immediately, while downgrades or cancellations take effect at the end of your current billing cycle."
    },
    {
      question: "How long does compliance certification take?",
      answer: "The timeline varies depending on your organization's size and current privacy posture. With CyberCorrect Privacy Platform, most small-to-medium businesses can achieve GDPR readiness in 4-6 weeks, and comprehensive multi-regulation privacy compliance in 3-6 months. Our platform accelerates this process by automating privacy documentation and gap analysis."
    },
    {
      question: "Do you provide implementation support?",
      answer: "Yes. Professional plans include quarterly review sessions, while Enterprise plans include dedicated compliance specialists to guide your implementation process with a structured 30-60-90 day plan. We also offer implementation workshops and technical configuration guidance for all customers."
    },
    {
      question: "What if I need additional users?",
      answer: "You can add additional users to your plan at any time. User pricing is prorated based on your billing cycle, and volume discounts are available for organizations with more than 50 users."
    },
    {
      question: "Can I export my data and documentation?",
      answer: "Yes, all documentation generated in CyberCorrect Privacy Platform can be exported in standard formats (PDF, Word, Excel) that are accepted by privacy auditors and regulators. Our templates are designed to meet GDPR, CCPA, and other privacy regulation requirements and have been reviewed by privacy professionals."
    },
    {
      question: "Is my data secure with CyberCorrect Privacy Platform?",
      answer: "Absolutely. We maintain SOC 2 Type II compliance and implement comprehensive security controls including encryption in transit and at rest, multi-factor authentication, regular penetration testing, and role-based access control to ensure your security and compliance data remains protected."
    }
  ];

  // Calculate savings based on inputs
  const calculateSavings = () => {
    // Base savings by company size
    const baseSavings = {
      '1-10': 25000,
      '11-50': 75000,
      '51-200': 180000,
      '201+': 350000
    };
    
    // Multiplier based on compliance level
    const multiplier = {
      'none': 1.5,
      'partial': 1.2,
      'mostly': 0.8
    };
    
    // Map employees to company size range
    let companySize;
    if (calculator.employees <= 10) companySize = '1-10';
    else if (calculator.employees <= 50) companySize = '11-50';
    else if (calculator.employees <= 200) companySize = '51-200';
    else companySize = '201+';
    
    // Map complexity to compliance level
    let complianceLevel;
    if (calculator.complexity === 'low') complianceLevel = 'none';
    else if (calculator.complexity === 'medium') complianceLevel = 'partial';
    else complianceLevel = 'mostly';
    
    const base = baseSavings[companySize as keyof typeof baseSavings];
    const mult = multiplier[complianceLevel as keyof typeof multiplier];
    
    return {
      consultantCost: base,
      platformCost: Math.round(base * 0.3), // Platform costs 30% of consultant
      savings: Math.round(base * 0.7),      // Savings = consultant cost - platform cost
      roi: Math.round(70 * mult)            // ROI percentage adjusted by complexity
    };
  };

  const roiResults = calculateSavings();

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
          Join 500+ organizations achieving compliance faster
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
              >
                {plan.price === "Contact us" ? "Contact Sales" : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Value proposition stats */}
      <div className="bg-primary-teal/5 dark:bg-dark-primary/10 rounded-lg p-6 mt-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary-teal dark:text-dark-primary">60%</div>
              <div className="text-sm text-muted-foreground">Faster compliance</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary-teal dark:text-dark-primary">$250K</div>
              <div className="text-sm text-muted-foreground">Average cost savings vs. consultants</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary-teal dark:text-dark-primary">500+</div>
              <div className="text-sm text-muted-foreground">Organizations certified</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary-teal dark:text-dark-primary">97%</div>
              <div className="text-sm text-muted-foreground">Customer satisfaction</div>
            </CardContent>
          </Card>
        </div>
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

      {/* Plan Comparison by Use Case */}
      <section className="max-w-7xl mx-auto mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Find The Right Plan For Your Organization</h2>
          <p className="text-muted-foreground">Plans tailored to your compliance requirements and organization size</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="rounded-full p-3 bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Small Business</h3>
              <p className="text-muted-foreground mb-4">Defense contractors with 5-50 employees</p>
              <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                <p className="font-medium mb-1 text-sm">Recommended Plan:</p>
                <p className="text-lg font-bold text-primary">Starter or Professional</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Cost-effective compliance</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>DIY with guided implementation</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Basic documentation templates</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                View Small Business Plans
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-primary shadow-md">
            <CardContent className="p-6">
              <div className="rounded-full p-3 bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Network className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Mid-Market</h3>
              <p className="text-muted-foreground mb-4">Defense contractors with 50-250 employees</p>
              <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                <p className="font-medium mb-1 text-sm">Recommended Plan:</p>
                <p className="text-lg font-bold text-primary">Professional</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Full compliance readiness</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Automated compliance workflows</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Multiple framework support</span>
                </li>
              </ul>
              <Button className="w-full">
                View Mid-Market Plans
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="rounded-full p-3 bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Cloud className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-muted-foreground mb-4">Large organizations with 250+ employees</p>
              <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                <p className="font-medium mb-1 text-sm">Recommended Plan:</p>
                <p className="text-lg font-bold text-primary">Enterprise</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>White-glove implementation</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Dedicated compliance specialists</span>
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Custom integrations and workflows</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                View Enterprise Plans
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Calculate Your ROI</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            See how much you can save compared to traditional consulting services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Cost Savings Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Employees</label>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={calculator.employees}
                    onChange={(e) => setCalculator({...calculator, employees: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5</span>
                    <span>{calculator.employees}</span>
                    <span>500</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Implementation Complexity</label>
                  <select
                    value={calculator.complexity}
                    onChange={(e) => setCalculator({...calculator, complexity: e.target.value})}
                    className="w-full rounded-md border-border bg-background py-2 px-3 text-sm"
                  >
                    <option value="low">Low - Limited data processing</option>
                    <option value="medium">Medium - Standard privacy workflow</option>
                    <option value="high">High - Complex environment with multiple systems</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-muted">
                  <div className="text-sm font-medium mb-2">Your Results</div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Traditional Consulting</p>
                      <p className="text-2xl font-bold text-foreground">${roiResults.consultantCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CyberCorrect Privacy Platform Professional</p>
                      <p className="text-2xl font-bold text-primary">${roiResults.platformCost.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Your Savings</span>
                      <span className="text-sm font-bold text-success">${roiResults.savings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">ROI</span>
                      <span className="text-sm font-bold text-success">{roiResults.roi}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Why CyberCorrect Privacy Platform Is More Cost-Effective
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Automated assessment processes</p>
                    <p className="text-sm text-muted-foreground">Save hundreds of hours compared to manual consultations</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Built-in documentation templates</p>
                    <p className="text-sm text-muted-foreground">No need to develop documents from scratch</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Continuous compliance monitoring</p>
                    <p className="text-sm text-muted-foreground">Maintain compliance without expensive reassessments</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Scalable platform approach</p>
                    <p className="text-sm text-muted-foreground">Pay per user instead of hourly consulting rates</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Self-service capabilities</p>
                    <p className="text-sm text-muted-foreground">Empower your team to manage compliance without constant consultant involvement</p>
                  </div>
                </li>
              </ul>
              
              <Button className="w-full mt-6">
                Schedule ROI Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 max-w-7xl mx-auto">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="dark:border-muted overflow-hidden">
                <div 
                  className="px-6 py-4 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${expandedFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-6 pb-4 text-muted-foreground">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="mt-12 text-center max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-primary-teal to-secondary-teal rounded-xl p-6 text-white dark:from-dark-primary dark:to-dark-primary/70">
          <h3 className="text-xl font-bold mb-3">Ready to achieve compliance?</h3>
          <p className="mb-5">Start your free 14-day trial or schedule a demo with our compliance experts</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary-teal hover:bg-gray-100 border-2 border-white shadow-lg">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button className="bg-gray-900 text-white hover:bg-gray-800 border-2 border-gray-900 shadow-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;