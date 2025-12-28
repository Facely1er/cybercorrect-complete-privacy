// Membership Product Catalog
// Quarterly memberships with defined deliverables each quarter

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';
export type BillingPeriod = 'quarterly';

export interface SubscriptionProduct {
  id: string;
  tier: SubscriptionTier;
  name: string;
  description: string;
  tagline: string;
  quarterlyPrice: number;
  monthlyEquivalent?: number; // For display purposes
  billing: string; // e.g., "per quarter"
  quarterlyDeliverables: string[]; // What they get each quarter
  ongoingAccess: string[]; // Platform access features
  professionalServices?: string[]; // Professional services (Enterprise only)
  category: 'membership';
  stripePriceId?: {
    quarterly?: string;
  };
}

// Membership Product Catalog
export const SUBSCRIPTION_PRODUCTS: SubscriptionProduct[] = [
  {
    id: 'subscription-free',
    tier: 'free',
    name: 'Free Trial',
    tagline: 'Start your privacy compliance journey',
    description: 'Try all features free for 14 days - no credit card required',
    quarterlyPrice: 0,
    monthlyEquivalent: 0,
    billing: '14-day trial',
    category: 'membership',
    quarterlyDeliverables: [],
    ongoingAccess: [
      'Privacy assessments (basic GDPR/CCPA)',
      'Privacy Gap Analyzer (view-only)',
      '3 basic templates (Privacy Policy, Cookie Policy, Terms)',
      '3 exports (JSON/CSV formats)',
      'Data mapping tool (up to 5 data flows)',
      'Risk tracking (up to 25 risks)',
      'Evidence vault',
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
    name: 'Essential Membership',
    tagline: 'Quarterly compliance support for small teams',
    description: 'Quarterly membership with essential compliance deliverables',
    quarterlyPrice: 147,
    monthlyEquivalent: 49,
    billing: 'per quarter',
    category: 'membership',
    quarterlyDeliverables: [
      'Quarterly privacy compliance assessment',
      'Quarterly gap analysis report',
      'Quarterly executive summary (board-ready)',
      'Quarterly compliance health review',
      '2 scheduled assessments per quarter',
      'Quarterly framework updates'
    ],
    ongoingAccess: [
      'Platform access for the quarter',
      'Multi-regulation privacy assessments',
      'Up to 100 risks tracked',
      '5 compliance templates',
      '10 exports per quarter (PDF, Word, JSON, CSV)',
      'Compliance health score tracking',
      'Progress dashboard',
      'Email & in-app notifications',
      'Email support (48hr response)',
      '2 privacy frameworks',
      'Risk analytics'
    ],
    stripePriceId: {
      quarterly: import.meta.env.VITE_STRIPE_PRICE_STARTER_QUARTERLY || ''
    }
  },
  {
    id: 'subscription-professional',
    tier: 'professional',
    name: 'Professional Membership',
    tagline: 'Comprehensive quarterly compliance program',
    description: 'Quarterly membership with comprehensive compliance deliverables and ongoing platform access',
    quarterlyPrice: 297,
    monthlyEquivalent: 99,
    billing: 'per quarter',
    category: 'membership',
    quarterlyDeliverables: [
      'Quarterly comprehensive compliance assessment',
      'Quarterly executive dashboard (board-ready)',
      'Quarterly regulatory impact analysis',
      'Unlimited scheduled assessments',
      'Quarterly framework updates',
      'Quarterly compliance roadmap'
    ],
    ongoingAccess: [
      'Platform access for the quarter',
      'Full privacy framework coverage',
      'Unlimited risk tracking',
      '20+ compliance templates',
      'Unlimited exports (PDF, Word, JSON, CSV, Excel)',
      'Unlimited custom reports',
      'Weekly automated compliance reports',
      'Real-time risk alerts',
      'Custom notification rules',
      'Email & in-app notifications',
      'Regulatory change alerts (24-hour)',
      'Regulatory intelligence dashboard',
      'Predictive compliance analytics',
      'Advanced analytics & dashboards',
      'Up to 5 privacy frameworks',
      'Priority support (24hr response)'
    ],
    stripePriceId: {
      quarterly: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL_QUARTERLY || ''
    }
  },
  {
    id: 'subscription-enterprise',
    tier: 'enterprise',
    name: 'Enterprise Membership',
    tagline: 'White-glove quarterly compliance program',
    description: 'Quarterly membership with comprehensive deliverables and dedicated professional services',
    quarterlyPrice: 0, // Contact for pricing
    monthlyEquivalent: 0,
    billing: 'custom pricing per quarter',
    category: 'membership',
    quarterlyDeliverables: [
      'Quarterly board-ready executive report',
      'Quarterly compliance audit preparation',
      'Quarterly regulatory change impact assessment',
      'Quarterly compliance strategy session',
      'Quarterly training session',
      'Continuous automated assessments',
      'Quarterly custom framework updates'
    ],
    ongoingAccess: [
      'Everything in Professional',
      'Real-time compliance monitoring',
      'Weekly detailed reports',
      'Regulatory intelligence dashboard',
      'Unlimited compliance frameworks',
      'Custom privacy control mapping'
    ],
    professionalServices: [
      'White-glove implementation support',
      'Dedicated compliance specialist',
      'Custom integrations',
      '24/7 dedicated support with SLA',
      'Custom feature development',
      'Training and certification programs'
    ],
    stripePriceId: {
      quarterly: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE_QUARTERLY || ''
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

