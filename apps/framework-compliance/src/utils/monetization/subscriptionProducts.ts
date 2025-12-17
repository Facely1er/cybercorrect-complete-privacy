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
    name: 'Free Trial',
    tagline: 'Start your privacy compliance journey',
    description: 'Try all features free for 14 days - no credit card required',
    monthlyPrice: 0,
    annualPrice: 0,
    billing: '14-day trial',
    category: 'subscription',
    features: [
      'Privacy assessments (basic GDPR/CCPA)',
      'Privacy Gap Analyzer (view-only)',
      '3 basic templates (Privacy Policy, Cookie Policy, Terms)',
      '3 exports (JSON/CSV formats)',
      'Data mapping tool (up to 5 data flows)',
      'Risk tracking (up to 25 risks)',
      'Evidence vault (100MB storage)',
      'Compliance score dashboard',
      'In-app notifications',
      'All educational content & tutorials',
      'Community forum access',
      'LocalStorage only (no cloud sync)'
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
      'Up to 100 risks tracked',
      '5 compliance templates',
      '10 exports per month (PDF, Word, JSON, CSV)',
      'Monthly automated compliance reports',
      'Weekly compliance status emails',
      'Quarterly executive summaries',
      'Scheduled assessments (up to 2 per quarter)',
      'Compliance health score tracking',
      'Progress dashboard',
      'Email & in-app notifications',
      'Email support (48hr response)',
      '2 privacy frameworks',
      'Risk analytics'
    ],
    stripePriceId: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_STARTER_MONTHLY || '',
      annual: import.meta.env.VITE_STRIPE_PRICE_STARTER_ANNUAL || ''
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
      'Unlimited custom reports',
      'Daily compliance health digest',
      'Weekly automated compliance reports',
      'Monthly comprehensive reports',
      'Quarterly executive dashboards',
      'Unlimited scheduled assessments',
      'Real-time risk alerts',
      'Custom notification rules',
      'Email & in-app notifications (SMS & Slack coming soon)',
      'Regulatory change alerts (24-hour)',
      'Regulatory intelligence dashboard',
      'Predictive compliance analytics',
      'Advanced analytics & dashboards',
      'Priority support (24hr response)',
      'Up to 5 privacy frameworks',
      'Quarterly privacy reviews'
    ],
    stripePriceId: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL_MONTHLY || '',
      annual: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL_ANNUAL || ''
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
      'Daily compliance briefings',
      'Weekly detailed reports',
      'Monthly executive reports (board-ready)',
      'Continuous automated assessments',
      'Custom notification workflows',
      'Role-based notification routing',
      'Executive dashboard alerts',
      'Regulatory intelligence dashboard',
      'Unlimited compliance frameworks',
      'Custom privacy control mapping',
      'PowerPoint export',
      'White-glove implementation support (professional services)',
      'Dedicated compliance specialist (professional services)',
      'Custom integrations (professional services)',
      '24/7 dedicated support with SLA',
      'Custom feature development (professional services)',
      'Training and certification programs (professional services)'
    ],
    stripePriceId: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
      annual: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE_ANNUAL || ''
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

