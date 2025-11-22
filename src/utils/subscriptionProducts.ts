// Subscription Product Catalog
// These products are recurring subscriptions with monthly or annual billing

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';
export type BillingPeriod = 'monthly' | 'annual';

export interface SubscriptionProduct {
  id: string;
  tier: SubscriptionTier;
  name: string;
  description: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  billing: string; // e.g., "per user/month"
  popular?: boolean;
  features: string[];
  category: 'subscription';
  stripePriceId?: {
    monthly?: string;
    annual?: string;
  };
}

// Subscription Product Catalog
export const SUBSCRIPTION_PRODUCTS: SubscriptionProduct[] = [
  {
    id: 'subscription-free',
    tier: 'free',
    name: 'Free',
    tagline: 'Perfect for individuals and students learning about privacy compliance',
    description: 'Perfect for individuals and students learning about privacy compliance',
    monthlyPrice: 0,
    annualPrice: 0,
    billing: 'forever',
    category: 'subscription',
    features: [
      '1 privacy assessment per month',
      'Privacy Gap Analyzer (view-only)',
      '3 basic templates (Privacy Policy, Cookie Policy, Terms)',
      '3 exports per month (JSON/CSV)',
      'Data mapping tool (up to 5 data flows)',
      'Manual risk tracking (up to 25 risks)',
      'Evidence vault (100MB storage)',
      'Basic compliance score dashboard',
      'In-app notifications (weekly digest)',
      'Community forum access',
      'All educational content & tutorials',
      'LocalStorage only (no cloud sync)',
      'No team collaboration'
    ]
  },
  {
    id: 'subscription-starter',
    tier: 'starter',
    name: 'Starter',
    tagline: 'Perfect for small teams starting their privacy compliance journey',
    description: 'Perfect for small teams starting their privacy compliance journey',
    monthlyPrice: 49,
    annualPrice: 39,
    billing: 'per user/month',
    category: 'subscription',
    features: [
      'Everything in Free, plus:',
      'Multi-regulation privacy assessments',
      'Essential privacy controls coverage',
      'Up to 100 risks tracked',
      '5 compliance templates',
      '10 exports per month (PDF, Word, JSON, CSV)',
      'Monthly automated compliance reports',
      'Weekly compliance status emails',
      'Quarterly executive summaries (automated)',
      'Scheduled assessments (up to 2 per quarter)',
      'Compliance health score tracking',
      'Basic progress dashboard',
      'Email & in-app notifications',
      'Email support (48hr response)',
      '2 privacy frameworks',
      'Basic risk analytics'
    ],
    stripePriceId: {
      monthly: process.env.VITE_STRIPE_PRICE_STARTER_MONTHLY || '',
      annual: process.env.VITE_STRIPE_PRICE_STARTER_ANNUAL || ''
    }
  },
  {
    id: 'subscription-professional',
    tier: 'professional',
    name: 'Professional',
    tagline: 'Complete privacy compliance suite for growing organizations',
    description: 'Complete privacy compliance suite for growing organizations',
    monthlyPrice: 99,
    annualPrice: 79,
    billing: 'per user/month',
    popular: true,
    category: 'subscription',
    features: [
      'Everything in Starter, plus:',
      'Full privacy framework coverage',
      'Unlimited risk tracking',
      '20+ compliance templates',
      'Unlimited exports (PDF, Word, JSON, CSV, Excel)',
      'Automated compliance planning',
      'Unlimited custom reports',
      'Daily compliance health digest',
      'Weekly automated compliance reports',
      'Monthly comprehensive reports (automated)',
      'Quarterly executive dashboards (automated)',
      'Unlimited scheduled assessments',
      'Real-time risk alerts (all priorities)',
      'Custom notification rules',
      'Multi-channel notifications (Email, SMS, Slack)',
      'Regulatory change alerts (24-hour)',
      'Regulatory intelligence dashboard',
      'Predictive compliance analytics',
      'Advanced progress analytics',
      'Compliance velocity metrics',
      'Priority support (24hr response)',
      'Up to 5 privacy frameworks',
      'Advanced analytics & dashboards',
      'Custom workflows',
      'API access',
      'Quarterly privacy reviews'
    ],
    stripePriceId: {
      monthly: process.env.VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY || '',
      annual: process.env.VITE_STRIPE_PRICE_PROFESSIONAL_ANNUAL || ''
    }
  },
  {
    id: 'subscription-enterprise',
    tier: 'enterprise',
    name: 'Enterprise',
    tagline: 'White-glove privacy compliance support for large organizations',
    description: 'White-glove privacy compliance support for large organizations',
    monthlyPrice: 0, // Contact for pricing
    annualPrice: 0, // Contact for pricing
    billing: 'custom pricing',
    category: 'subscription',
    features: [
      'Everything in Professional',
      'Real-time compliance monitoring',
      'Daily compliance briefings (automated)',
      'Weekly detailed reports (automated)',
      'Monthly executive reports (board-ready)',
      'Continuous automated assessments',
      'Custom notification workflows',
      'Role-based notification routing',
      'ITSM integration (Jira, ServiceNow)',
      'Executive dashboard alerts',
      'Predictive compliance analytics',
      'Anomaly detection',
      'Industry benchmarking',
      'Regulatory intelligence dashboard',
      'Privacy consultant collaboration tools',
      'White-glove implementation support',
      'Unlimited compliance frameworks',
      'Custom privacy control mapping',
      'Dedicated compliance specialist',
      'On-premise deployment option',
      'Custom integrations',
      '24/7 dedicated support with SLA',
      'Custom feature development',
      'Training and certification programs'
    ],
    stripePriceId: {
      monthly: process.env.VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
      annual: process.env.VITE_STRIPE_PRICE_ENTERPRISE_ANNUAL || ''
    }
  }
];

/**
 * Get subscription product by tier
 */
export function getSubscriptionByTier(tier: SubscriptionTier): SubscriptionProduct | undefined {
  return SUBSCRIPTION_PRODUCTS.find(p => p.tier === tier);
}

/**
 * Get subscription product by ID
 */
export function getSubscriptionById(id: string): SubscriptionProduct | undefined {
  return SUBSCRIPTION_PRODUCTS.find(p => p.id === id);
}

/**
 * Get all subscription products
 */
export function getAllSubscriptions(): SubscriptionProduct[] {
  return SUBSCRIPTION_PRODUCTS;
}

