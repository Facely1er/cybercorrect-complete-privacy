// Monetization and credits management utility
import { secureStorage } from '../storage/secureStorage';

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';
export type ExportFormat = 'pdf' | 'word' | 'json' | 'csv' | 'excel' | 'powerpoint';
export type TemplateCategory = 'basic' | 'premium' | 'industry' | 'custom';

export interface UserSubscription {
  tier: SubscriptionTier;
  startDate: string;
  endDate?: string;
  billingPeriod: 'monthly' | 'annual';
  status: 'active' | 'expired' | 'cancelled' | 'trialing';
}

export interface ExportCredits {
  total: number;
  used: number;
  remaining: number;
  resetDate: string;
  history: ExportCreditUsage[];
}

export interface ExportCreditUsage {
  id: string;
  date: string;
  format: ExportFormat;
  tool: string;
  creditsUsed: number;
}

export interface TemplatePurchase {
  id: string;
  templateId: string;
  templateName: string;
  category: TemplateCategory;
  purchaseDate: string;
  price: number;
  status: 'active' | 'expired';
}

export interface PremiumTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  industry?: string;
  price: number;
  preview?: string;
  includedInTiers: SubscriptionTier[];
  features: string[];
}

// Subscription tier limits
export const SUBSCRIPTION_LIMITS = {
  free: {
    // Enhanced Free Tier - aligned with pricing recommendations
    templates: 3, // 3 basic templates (Privacy Policy, Cookie Policy, Terms of Service)
    exportsPerMonth: 3, // 3 exports per month
    exportFormats: ['json', 'csv'] as ExportFormat[], // JSON/CSV only
    premiumFeatures: false,
    assessmentsPerMonth: 1, // 1 privacy assessment per month
    dataFlows: 5, // Up to 5 data flows in data mapping tool
    riskTracking: 25, // Up to 25 risks tracked manually
    evidenceStorage: 100, // 100MB evidence storage
    notifications: {
      emailEnabled: false,
      inAppEnabled: true,
      frequency: 'weekly' as const,
      channels: ['in_app'] as const,
    },
    reports: {
      monthly: false,
      quarterly: false,
      custom: false,
    },
    complianceHealth: {
      enabled: true, // Basic compliance score dashboard (view-only)
      predictiveAnalytics: false,
    },
    scheduledAssessments: {
      enabled: false,
      maxSchedules: 0,
    },
    regulatoryIntelligence: {
      enabled: false,
    },
    teamCollaboration: false,
    cloudSync: false, // LocalStorage only
    apiAccess: false,
  },
  starter: {
    templates: 5,
    exportsPerMonth: 10,
    exportFormats: ['pdf', 'word', 'json', 'csv'] as ExportFormat[],
    premiumFeatures: false,
    notifications: {
      emailEnabled: true,
      inAppEnabled: true,
      frequency: 'weekly' as const,
      channels: ['email', 'in_app'] as const,
    },
    reports: {
      monthly: true,
      quarterly: true,
      custom: false,
    },
    complianceHealth: {
      enabled: true,
      predictiveAnalytics: false,
    },
    scheduledAssessments: {
      enabled: true,
      maxSchedules: 2,
    },
    regulatoryIntelligence: {
      enabled: false,
    },
  },
  professional: {
    templates: 20,
    exportsPerMonth: -1, // unlimited
    exportFormats: ['pdf', 'word', 'json', 'csv', 'excel'] as ExportFormat[],
    premiumFeatures: true,
    notifications: {
      emailEnabled: true,
      inAppEnabled: true,
      frequency: 'real_time' as const,
      channels: ['email', 'in_app', 'sms', 'slack'] as const,
    },
    reports: {
      monthly: true,
      quarterly: true,
      custom: true,
    },
    complianceHealth: {
      enabled: true,
      predictiveAnalytics: true,
    },
    scheduledAssessments: {
      enabled: true,
      maxSchedules: -1, // unlimited
    },
    regulatoryIntelligence: {
      enabled: true,
    },
  },
  enterprise: {
    templates: -1, // unlimited
    exportsPerMonth: -1, // unlimited
    exportFormats: ['pdf', 'word', 'json', 'csv', 'excel', 'powerpoint'] as ExportFormat[],
    premiumFeatures: true,
    notifications: {
      emailEnabled: true,
      inAppEnabled: true,
      frequency: 'real_time' as const,
      channels: ['email', 'in_app', 'sms', 'slack', 'teams'] as const,
    },
    reports: {
      monthly: true,
      quarterly: true,
      custom: true,
    },
    complianceHealth: {
      enabled: true,
      predictiveAnalytics: true,
    },
    scheduledAssessments: {
      enabled: true,
      maxSchedules: -1, // unlimited
    },
    regulatoryIntelligence: {
      enabled: true,
    },
  }
};

// Trial configuration
export const TRIAL_CONFIG = {
  durationDays: 14, // 14-day trial (aligns with policy)
  requiresPaymentMethod: true,
  autoConvert: true, // Auto-convert to paid at end
  eligibleTiers: ['starter', 'professional'] as SubscriptionTier[], // No enterprise trials
};

// Helper function to get trial limits (trials get full tier features)
export function getTrialLimits(tier: SubscriptionTier) {
  // Trials get the same limits as the paid tier they're trialing
  return SUBSCRIPTION_LIMITS[tier] || SUBSCRIPTION_LIMITS.free;
}

// Export credit costs
export const EXPORT_CREDIT_COSTS: Record<ExportFormat, number> = {
  json: 1,
  csv: 1,
  pdf: 2,
  word: 2,
  excel: 3,
  powerpoint: 4
};

// Premium templates catalog
export const PREMIUM_TEMPLATES: PremiumTemplate[] = [
  {
    id: 'gdpr-privacy-policy',
    name: 'GDPR Privacy Policy Template',
    description: 'Comprehensive GDPR-compliant privacy policy template with all required sections',
    category: 'premium',
    price: 99,
    includedInTiers: ['professional', 'enterprise'],
    features: ['GDPR Article 13/14 compliant', 'Multi-language support', 'Legal review included']
  },
  {
    id: 'ccpa-policy',
    name: 'CCPA Compliance Policy',
    description: 'Complete CCPA/CPRA compliance policy template for California businesses',
    category: 'premium',
    price: 99,
    includedInTiers: ['professional', 'enterprise'],
    features: ['CCPA/CPRA compliant', 'Consumer rights section', 'Opt-out procedures']
  },
  {
    id: 'hipaa-baa',
    name: 'HIPAA Business Associate Agreement',
    description: 'HIPAA-compliant Business Associate Agreement template',
    category: 'industry',
    industry: 'Healthcare',
    price: 149,
    includedInTiers: ['enterprise'],
    features: ['HIPAA compliant', 'BAA requirements', 'Healthcare-specific clauses']
  },
  {
    id: 'pci-dss-policy',
    name: 'PCI DSS Compliance Policy',
    description: 'Payment Card Industry Data Security Standard compliance policy',
    category: 'industry',
    industry: 'Financial Services',
    price: 149,
    includedInTiers: ['enterprise'],
    features: ['PCI DSS compliant', 'Payment processing security', 'Cardholder data protection']
  },
  {
    id: 'data-processing-agreement',
    name: 'Data Processing Agreement (DPA)',
    description: 'Standard Contractual Clauses (SCCs) compliant DPA template',
    category: 'premium',
    price: 199,
    includedInTiers: ['professional', 'enterprise'],
    features: ['SCCs compliant', 'GDPR Article 28', 'International transfers']
  },
  {
    id: 'breach-notification-template',
    name: 'Data Breach Notification Template',
    description: 'Multi-regulation breach notification template (GDPR, CCPA, HIPAA)',
    category: 'premium',
    price: 149,
    includedInTiers: ['professional', 'enterprise'],
    features: ['Multi-regulation', '72-hour GDPR compliance', 'Regulatory notification']
  },
  {
    id: 'employee-privacy-policy',
    name: 'Employee Privacy Policy',
    description: 'Comprehensive employee data privacy policy template',
    category: 'premium',
    price: 99,
    includedInTiers: ['professional', 'enterprise'],
    features: ['Employee data protection', 'HR compliance', 'Workplace privacy']
  },
  {
    id: 'vendor-management-policy',
    name: 'Vendor Privacy Management Policy',
    description: 'Third-party vendor privacy and data processing policy template',
    category: 'premium',
    price: 149,
    includedInTiers: ['professional', 'enterprise'],
    features: ['Vendor assessment', 'Data processing agreements', 'Risk management']
  }
];

// Template bundles
export const TEMPLATE_BUNDLES = [
  {
    id: 'gdpr-complete-pack',
    name: 'GDPR Complete Compliance Pack',
    description: 'All GDPR compliance templates in one bundle',
    templates: ['gdpr-privacy-policy', 'data-processing-agreement', 'breach-notification-template'],
    price: 299,
    savings: 148,
    includedInTiers: ['professional', 'enterprise']
  },
  {
    id: 'healthcare-pack',
    name: 'Healthcare Privacy Compliance Pack',
    description: 'HIPAA and healthcare privacy compliance templates',
    templates: ['hipaa-baa', 'employee-privacy-policy', 'breach-notification-template'],
    price: 399,
    savings: 48,
    includedInTiers: ['enterprise']
  },
  {
    id: 'financial-services-pack',
    name: 'Financial Services Compliance Pack',
    description: 'PCI DSS and financial privacy compliance templates',
    templates: ['pci-dss-policy', 'data-processing-agreement', 'vendor-management-policy'],
    price: 449,
    savings: 48,
    includedInTiers: ['enterprise']
  }
];

class MonetizationManager {
  private getSubscription(): UserSubscription {
    return secureStorage.getItem<UserSubscription>('user_subscription', {
      tier: 'free',
      startDate: new Date().toISOString(),
      billingPeriod: 'monthly',
      status: 'active'
    });
  }

  private getCredits(): ExportCredits {
    const credits = secureStorage.getItem<ExportCredits>('export_credits');
    if (!credits) {
      const subscription = this.getSubscription();
      const limits = SUBSCRIPTION_LIMITS[subscription.tier];
      const resetDate = new Date();
      resetDate.setMonth(resetDate.getMonth() + 1);
      
      return {
        total: limits.exportsPerMonth === -1 ? -1 : limits.exportsPerMonth,
        used: 0,
        remaining: limits.exportsPerMonth === -1 ? -1 : limits.exportsPerMonth,
        resetDate: resetDate.toISOString(),
        history: []
      };
    }

    // Check if credits need to be reset
    if (new Date(credits.resetDate) < new Date()) {
      const subscription = this.getSubscription();
      const limits = SUBSCRIPTION_LIMITS[subscription.tier];
      const resetDate = new Date();
      resetDate.setMonth(resetDate.getMonth() + 1);
      
      return {
        total: limits.exportsPerMonth === -1 ? -1 : limits.exportsPerMonth,
        used: 0,
        remaining: limits.exportsPerMonth === -1 ? -1 : limits.exportsPerMonth,
        resetDate: resetDate.toISOString(),
        history: []
      };
    }

    return credits;
  }

  private setCredits(credits: ExportCredits): void {
    secureStorage.setItem('export_credits', credits);
  }

  getSubscriptionTier(): SubscriptionTier {
    return this.getSubscription().tier;
  }

  canExport(format: ExportFormat): { allowed: boolean; reason?: string; creditsNeeded?: number } {
    const subscription = this.getSubscription();
    
    // Check if trial is expired
    if (subscription.status === 'trialing' && subscription.endDate) {
      const trialEnd = new Date(subscription.endDate);
      if (trialEnd < new Date()) {
        return {
          allowed: false,
          reason: 'Your trial has expired. Upgrade to continue using this feature.',
        };
      }
    }
    
    const limits = SUBSCRIPTION_LIMITS[subscription.tier];
    
    // Check if format is available for tier
    if (!limits.exportFormats.includes(format)) {
      return {
        allowed: false,
        reason: `${format.toUpperCase()} export is not available in your ${subscription.tier} plan. Upgrade to Professional or Enterprise.`,
        creditsNeeded: EXPORT_CREDIT_COSTS[format]
      };
    }

    // Check credits if not unlimited
    if (limits.exportsPerMonth !== -1) {
      const credits = this.getCredits();
      const cost = EXPORT_CREDIT_COSTS[format];
      
      if (credits.remaining < cost && credits.remaining !== -1) {
        return {
          allowed: false,
          reason: `Insufficient export credits. You need ${cost} credits but only have ${credits.remaining} remaining.`,
          creditsNeeded: cost
        };
      }
    }

    return { allowed: true };
  }

  useExportCredits(format: ExportFormat, tool: string): boolean {
    const subscription = this.getSubscription();
    const limits = SUBSCRIPTION_LIMITS[subscription.tier];
    
    if (limits.exportsPerMonth === -1) {
      // Unlimited exports
      return true;
    }

    const credits = this.getCredits();
    const cost = EXPORT_CREDIT_COSTS[format];

    if (credits.remaining < cost && credits.remaining !== -1) {
      return false;
    }

    // Deduct credits
    const updatedCredits: ExportCredits = {
      ...credits,
      used: credits.used + cost,
      remaining: credits.remaining === -1 ? -1 : credits.remaining - cost,
      history: [
        ...credits.history,
        {
          id: `export-${Date.now()}`,
          date: new Date().toISOString(),
          format,
          tool,
          creditsUsed: cost
        }
      ]
    };

    this.setCredits(updatedCredits);
    return true;
  }

  getRemainingCredits(): number {
    const credits = this.getCredits();
    return credits.remaining;
  }

  getCreditsHistory(): ExportCreditUsage[] {
    const credits = this.getCredits();
    return credits.history;
  }

  canAccessTemplate(templateId: string): boolean {
    const subscription = this.getSubscription();
    const template = PREMIUM_TEMPLATES.find(t => t.id === templateId);
    
    if (!template) {
      return true; // Basic templates are always accessible
    }

    // Check if included in subscription tier
    if (template.includedInTiers.includes(subscription.tier)) {
      return true;
    }

    // Check if purchased
    const purchases = this.getPurchasedTemplates();
    return purchases.some(p => p.templateId === templateId && p.status === 'active');
  }

  getPurchasedTemplates(): TemplatePurchase[] {
    return secureStorage.getItem<TemplatePurchase[]>('purchased_templates', []);
  }

  purchaseTemplate(templateId: string): { success: boolean; message: string } {
    const template = PREMIUM_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      return { success: false, message: 'Template not found' };
    }

    // Check if already purchased
    const purchases = this.getPurchasedTemplates();
    if (purchases.some(p => p.templateId === templateId && p.status === 'active')) {
      return { success: false, message: 'Template already purchased' };
    }

    // Check if included in subscription
    const subscription = this.getSubscription();
    if (template.includedInTiers.includes(subscription.tier)) {
      return { success: false, message: 'Template included in your subscription' };
    }

    // Add purchase (in real implementation, this would call payment API)
    const newPurchase: TemplatePurchase = {
      id: `purchase-${Date.now()}`,
      templateId,
      templateName: template.name,
      category: template.category,
      purchaseDate: new Date().toISOString(),
      price: template.price,
      status: 'active'
    };

    const updatedPurchases = [...purchases, newPurchase];
    secureStorage.setItem('purchased_templates', updatedPurchases);

    return { success: true, message: 'Template purchased successfully' };
  }

  purchaseTemplateBundle(bundleId: string): { success: boolean; message: string } {
    const bundle = TEMPLATE_BUNDLES.find(b => b.id === bundleId);
    if (!bundle) {
      return { success: false, message: 'Bundle not found' };
    }

    // Purchase all templates in bundle
    const results = bundle.templates.map(templateId => this.purchaseTemplate(templateId));
    const failed = results.filter(r => !r.success);

    if (failed.length > 0) {
      return { success: false, message: `Failed to purchase ${failed.length} templates` };
    }

    return { success: true, message: 'Bundle purchased successfully' };
  }

  getAvailableTemplates(): PremiumTemplate[] {
    const subscription = this.getSubscription();
    return PREMIUM_TEMPLATES.filter(template => {
      // Show all templates, but mark which are included
      return true;
    });
  }

  getTemplatesByCategory(category: TemplateCategory): PremiumTemplate[] {
    return PREMIUM_TEMPLATES.filter(t => t.category === category);
  }

  getTemplatesByIndustry(industry: string): PremiumTemplate[] {
    return PREMIUM_TEMPLATES.filter(t => t.industry === industry);
  }

  addExportCredits(amount: number): void {
    const credits = this.getCredits();
    const updatedCredits: ExportCredits = {
      ...credits,
      total: credits.total === -1 ? -1 : credits.total + amount,
      remaining: credits.remaining === -1 ? -1 : credits.remaining + amount
    };
    this.setCredits(updatedCredits);
  }

  purchaseExportCredits(amount: number, price: number): { success: boolean; message: string } {
    // In real implementation, this would call payment API
    // For now, just add credits
    this.addExportCredits(amount);
    return { success: true, message: `Purchased ${amount} export credits for $${price}` };
  }
}

export const monetization = new MonetizationManager();

