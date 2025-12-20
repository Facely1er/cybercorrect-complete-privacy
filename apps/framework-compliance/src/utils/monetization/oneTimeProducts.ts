// One-Time Product Catalog for LocalStorage Privacy Tools
// These products are sold with lifetime licenses and work entirely offline

import { logError } from '../common/logger';
import type { SubscriptionProduct } from './subscriptionProducts';

export type OneTimeProductCategory = 'toolkit' | 'assessment' | 'gdpr' | 'templates' | 'bundle';
export type ProductLicenseType = 'lifetime' | 'annual';
export type ProductDeploymentModel = 'localStorage' | 'standalone' | 'hybrid';

export interface OneTimeProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: OneTimeProductCategory;
  price: number;
  originalPrice?: number; // For showing discounts
  licenseType: ProductLicenseType;
  deploymentModel: ProductDeploymentModel;
  features: string[];
  includedTools: string[];
  limitations: string[];
  targetAudience: string[];
  technicalRequirements: string[];
  refundPolicy: 'standard'; // All sales final except as provided in Refund & Cancellation Policy
  updatePolicy: string; // e.g., "v1.x updates included"
  supportLevel: 'email' | 'priority' | 'dedicated';
  icon?: string;
}

export interface ProductBundle {
  id: string;
  name: string;
  description: string;
  products: string[]; // Product IDs included in bundle
  price: number;
  savings: number;
  category: OneTimeProductCategory;
}

export interface Purchase {
  id: string;
  productId: string;
  purchaseDate: string;
  price: number;
  licenseKey: string;
  status: 'active' | 'refunded' | 'expired';
  expirationDate?: string; // For annual licenses
}

// One-Time Product Catalog
export const ONE_TIME_PRODUCTS: OneTimeProduct[] = [
  {
    id: 'privacy-toolkit-pro',
    name: 'Privacy Toolkit Pro',
    tagline: 'Complete offline privacy compliance toolkit',
    description: 'All-in-one privacy compliance tools that run 100% in your browser. No cloud dependencies, complete data ownership.',
    longDescription: `CyberCorrect™ Privacy Toolkit Pro is a comprehensive suite of privacy compliance tools designed for complete data sovereignty.
    All processing happens locally in your browser using localStorage, ensuring your sensitive compliance data never leaves your control.
    Perfect for small businesses, consultants, and privacy professionals who need powerful tools without ongoing subscriptions.`,
    category: 'toolkit',
    price: 299,
    licenseType: 'lifetime',
    deploymentModel: 'localStorage',
    features: [
      'DPIA Generator with 10+ templates',
      'Privacy Policy Generator (GDPR, CCPA, HIPAA)',
      'Data Mapping Tool (unlimited data flows)',
      'Consent Management Tracker',
      'Vendor Risk Assessment Tool',
      'Incident Response Tracker',
      'Retention Policy Generator',
      'Privacy by Design Assessment',
      'Service Provider Manager',
      'Export to PDF, Word, Excel (unlimited)',
      'Import/export data (JSON backup)',
      'All future v1.x updates included',
      '100% offline - no cloud dependencies',
      'Complete data ownership and privacy'
    ],
    includedTools: [
      'DPIA Generator',
      'Privacy Policy Generator',
      'Data Mapping Tool',
      'Consent Management',
      'Vendor Risk Assessment',
      'Incident Response Manager',
      'Retention Policy Generator',
      'Privacy by Design Assessment',
      'Service Provider Manager'
    ],
    limitations: [
      'No cloud sync',
      'No automated reports',
      'No regulatory update notifications',
      'No team collaboration features',
      'Email support only (no SLA)',
      'Manual data backup required'
    ],
    targetAudience: [
      'Small businesses (1-50 employees)',
      'Privacy consultants doing client assessments',
      'Individuals managing personal privacy compliance',
      'Organizations requiring complete data control',
      'Budget-conscious compliance teams'
    ],
    technicalRequirements: [
      'Modern web browser (Chrome, Firefox, Safari, Edge)',
      'JavaScript enabled',
      'Minimum 100MB free storage',
      'Screen resolution 1280x720 or higher',
      'Internet connection for initial download only'
    ],
    refundPolicy: 'standard', // All sales final except as provided in Refund & Cancellation Policy
    updatePolicy: 'All v1.x updates included free. Major version upgrades (v2.0+) may require upgrade fee.',
    supportLevel: 'email'
  },
  {
    id: 'compliance-assessment-suite',
    name: 'Compliance Assessment Suite',
    tagline: 'Professional privacy assessment tools',
    description: 'Offline assessment tools with local scoring for GDPR, CCPA, and NIST privacy frameworks.',
    longDescription: `CyberCorrect™ Compliance Assessment Suite provides professional-grade privacy assessment tools that run entirely in your browser.
    Conduct comprehensive privacy gap analyses, generate compliance roadmaps, and create detailed reports - all without sending data to the cloud.
    Ideal for consultants performing client assessments or organizations managing periodic compliance reviews.`,
    category: 'assessment',
    price: 149,
    licenseType: 'lifetime',
    deploymentModel: 'localStorage',
    features: [
      'Privacy Gap Analyzer (GDPR, CCPA, NIST)',
      'Multi-framework assessment templates',
      'Risk scoring calculator',
      'Compliance roadmap generator',
      'Control mapping tool',
      'POA&M template generator',
      'Gap analysis reports (PDF, Excel)',
      '50+ compliance frameworks',
      'Customizable assessment criteria',
      'Offline scoring and reporting',
      'Unlimited assessments',
      'All v1.x updates included'
    ],
    includedTools: [
      'Privacy Gap Analyzer',
      'Risk Scoring Calculator',
      'Compliance Roadmap Generator',
      'Control Mapping Tool',
      'POA&M Generator'
    ],
    limitations: [
      'No automated re-assessments',
      'No compliance tracking over time',
      'Static frameworks (no automatic updates)',
      'No cloud backup',
      'No team collaboration'
    ],
    targetAudience: [
      'Privacy consultants',
      'Compliance auditors',
      'Organizations doing periodic assessments',
      'Project-based compliance work'
    ],
    technicalRequirements: [
      'Modern web browser',
      'JavaScript enabled',
      'Minimum 50MB free storage'
    ],
    refundPolicy: 'standard', // All sales final except as provided in Refund & Cancellation Policy
    updatePolicy: 'All v1.x updates included. Framework updates released quarterly.',
    supportLevel: 'email'
  },
  {
    id: 'gdpr-complete-kit',
    name: 'GDPR Complete Kit',
    tagline: 'Everything you need for GDPR compliance',
    description: 'Complete GDPR compliance toolkit with all templates and documentation generators - works 100% offline.',
    longDescription: `CyberCorrect™ GDPR Complete Kit is a comprehensive package for organizations subject to the General Data Protection Regulation.
    Includes all essential templates, generators, and tools required for GDPR compliance, from privacy policies to data breach notifications.
    All processing happens locally, ensuring your GDPR documentation remains private and under your control.`,
    category: 'gdpr',
    price: 199,
    licenseType: 'lifetime',
    deploymentModel: 'localStorage',
    features: [
      'GDPR Privacy Policy Generator',
      'Data Processing Agreement templates',
      'DPIA Generator (GDPR-specific)',
      'Data Subject Rights Request Manager',
      'Consent Management System',
      'Data Breach Notification Generator',
      'Record of Processing Activities (ROPA) tool',
      'GDPR Article 30 Documentation',
      'Cookie Consent Manager',
      'Privacy Impact Assessment templates',
      'All exports included (PDF, Word)',
      'Multi-language support (EN, DE, FR, ES)',
      'GDPR compliance checklist',
      'Lifetime updates for GDPR requirements'
    ],
    includedTools: [
      'GDPR Privacy Policy Generator',
      'DPA Templates',
      'DPIA Generator',
      'DSR Manager',
      'Consent Management',
      'Breach Notification Generator',
      'ROPA Tool',
      'Article 30 Documentation'
    ],
    limitations: [
      'No automated compliance monitoring',
      'No regulatory change notifications',
      'No cloud sync',
      'No team features'
    ],
    targetAudience: [
      'EU-based small businesses',
      'Organizations processing EU data',
      'GDPR-only compliance needs',
      'Data Protection Officers (DPOs)'
    ],
    technicalRequirements: [
      'Modern web browser',
      'JavaScript enabled',
      'Minimum 75MB free storage'
    ],
    refundPolicy: 'standard', // All sales final except as provided in Refund & Cancellation Policy
    updatePolicy: 'GDPR-specific updates included for life. Updated within 30 days of regulatory changes.',
    supportLevel: 'email'
  },
  {
    id: 'policy-template-library',
    name: 'Policy & Template Library',
    tagline: '50+ privacy policy templates',
    description: 'Comprehensive library of privacy policies and templates with offline generation and customization.',
    longDescription: `CyberCorrect™ Policy & Template Library provides instant access to over 50 professionally-drafted privacy policy templates
    covering multiple jurisdictions and industries. Customize templates with your organization's details and generate
    publication-ready documents entirely offline. No recurring fees, no cloud dependencies.`,
    category: 'templates',
    price: 99,
    licenseType: 'lifetime',
    deploymentModel: 'localStorage',
    features: [
      '50+ privacy policy templates',
      'Multi-jurisdiction coverage (GDPR, CCPA, PIPEDA, LGPD, etc.)',
      'Industry-specific templates (healthcare, finance, e-commerce, SaaS)',
      'Cookie policies and notices',
      'Terms of Service templates',
      'Employee privacy policies',
      'Vendor management templates',
      'Incident response templates',
      'Easy customization interface',
      'Export to Word, PDF',
      'Template merge and customization',
      'Regular template updates'
    ],
    includedTools: [
      'Privacy Policy Generator',
      'Cookie Policy Generator',
      'Terms of Service Generator',
      'Template Customization Tool'
    ],
    limitations: [
      'No legal review included',
      'No automated policy updates',
      'No version control',
      'No cloud storage'
    ],
    targetAudience: [
      'Startups needing basic documentation',
      'Small businesses',
      'Website operators',
      'App developers'
    ],
    technicalRequirements: [
      'Modern web browser',
      'JavaScript enabled',
      'Minimum 30MB free storage'
    ],
    refundPolicy: 'standard', // All sales final except as provided in Refund & Cancellation Policy
    updatePolicy: 'Template updates released monthly. All updates included.',
    supportLevel: 'email'
  },
  {
    id: 'compliance-toolkit',
    name: 'Compliance Framework Templates',
    tagline: 'Multi-framework compliance templates',
    description: 'Downloadable compliance templates for NIST, ISO 27001, SOC 2, HIPAA, GDPR, CMMC, and PCI-DSS frameworks',
    longDescription: `CyberCorrect™ Compliance Framework Templates provide comprehensive, ready-to-use templates for major compliance frameworks.
    Includes gap analysis worksheets, control mapping matrices, evidence collection checklists, and audit preparation guides.
    Perfect for compliance teams, auditors, and organizations preparing for certifications. All templates are customizable and work offline.`,
    category: 'toolkit',
    price: 199,
    licenseType: 'lifetime',
    deploymentModel: 'localStorage',
    features: [
      'Multi-framework gap analysis worksheets',
      'Control mapping matrices (50+ pre-mapped controls)',
      'Maturity assessment templates',
      'Risk-based prioritization frameworks',
      'Evidence collection checklists by framework',
      'Documentation templates',
      'Evidence repository organization guides',
      'Audit trail templates',
      'Pre-audit readiness checklists',
      'Auditor interview preparation guides',
      'Evidence validation workflows',
      'Remediation tracking templates',
      'Compliance program charter templates',
      'Continuous monitoring frameworks',
      'Control testing procedures',
      'Compliance reporting templates',
      'CyberCorrect setup guides',
      'Workflow configuration templates',
      'Automation setup instructions',
      'Dashboard customization guides',
      'Export to PDF, Word, Excel',
      'All v1.x updates included'
    ],
    includedTools: [
      'Gap Analysis Templates',
      'Control Mapping Matrix',
      'Evidence Collection Checklists',
      'Audit Preparation Guides',
      'Compliance Program Templates'
    ],
    limitations: [
      'No automated compliance tracking',
      'No cloud sync',
      'No team collaboration',
      'Manual framework updates'
    ],
    targetAudience: [
      'Compliance teams preparing for audits',
      'Security consultants',
      'Organizations seeking certifications',
      'Audit preparation teams'
    ],
    technicalRequirements: [
      'Modern web browser',
      'JavaScript enabled',
      'Minimum 50MB free storage'
    ],
    refundPolicy: 'standard',
    updatePolicy: 'Framework updates released quarterly. All v1.x updates included.',
    supportLevel: 'email'
  }
];

// Product Bundles
export const PRODUCT_BUNDLES: ProductBundle[] = [
  {
    id: 'complete-privacy-suite',
    name: 'Complete Privacy Suite',
    description: 'All five one-time products in one comprehensive package. Everything you need for complete privacy compliance.',
    products: [
      'privacy-toolkit-pro',
      'compliance-assessment-suite',
      'gdpr-complete-kit',
      'policy-template-library',
      'compliance-toolkit'
    ],
    price: 699,
    savings: 246, // Original total: $945 ($299 + $149 + $199 + $99 + $199)
    category: 'bundle'
  },
  {
    id: 'consultant-bundle',
    name: 'Privacy Consultant Bundle',
    description: 'Essential tools for privacy consultants performing client assessments and documentation.',
    products: [
      'privacy-toolkit-pro',
      'compliance-assessment-suite'
    ],
    price: 399,
    savings: 49, // Original total: $448
    category: 'bundle'
  },
  {
    id: 'gdpr-specialist-bundle',
    name: 'GDPR Specialist Bundle',
    description: 'Complete GDPR compliance package with all tools and templates.',
    products: [
      'gdpr-complete-kit',
      'policy-template-library'
    ],
    price: 249,
    savings: 49, // Original total: $298
    category: 'bundle'
  }
];

// License Key Management
export class LicenseManager {
  private static STORAGE_KEY = 'ermits_licenses';

  static generateLicenseKey(productId: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    const productCode = productId.substring(0, 4).toUpperCase();
    return `${productCode}-${timestamp}-${random}`.toUpperCase();
  }

  static activateLicense(productId: string, licenseKey: string): Purchase {
    const purchase: Purchase = {
      id: `purchase-${Date.now()}`,
      productId,
      purchaseDate: new Date().toISOString(),
      price: ONE_TIME_PRODUCTS.find(p => p.id === productId)?.price || 0,
      licenseKey,
      status: 'active'
    };

    const purchases = this.getPurchases();
    purchases.push(purchase);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(purchases));

    return purchase;
  }

  static getPurchases(): Purchase[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static hasPurchased(productId: string): boolean {
    const purchases = this.getPurchases();
    return purchases.some(p => p.productId === productId && p.status === 'active');
  }

  static verifyLicense(productId: string, licenseKey: string): boolean {
    const purchases = this.getPurchases();
    return purchases.some(
      p => p.productId === productId &&
           p.licenseKey === licenseKey &&
           p.status === 'active'
    );
  }

  static revokeLicense(licenseKey: string): boolean {
    const purchases = this.getPurchases();
    const index = purchases.findIndex(p => p.licenseKey === licenseKey);

    if (index !== -1) {
      purchases[index].status = 'refunded';
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(purchases));
      return true;
    }

    return false;
  }

  static exportLicenses(): string {
    const purchases = this.getPurchases();
    return JSON.stringify(purchases, null, 2);
  }

  static importLicenses(data: string): boolean {
    try {
      const purchases: Purchase[] = JSON.parse(data);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(purchases));
      return true;
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to import licenses'), { component: 'OneTimeProducts' });
      return false;
    }
  }
}

// Unified Product Types
export type ProductType = 'one-time' | 'subscription';
export type UnifiedProduct = OneTimeProduct | { type: 'subscription'; id: string; name: string; category: 'subscription' };

// Product Discovery Helpers
export class ProductCatalog {
  static getProduct(productId: string): OneTimeProduct | undefined {
    return ONE_TIME_PRODUCTS.find(p => p.id === productId);
  }

  static getBundle(bundleId: string): ProductBundle | undefined {
    return PRODUCT_BUNDLES.find(b => b.id === bundleId);
  }

  static getProductsByCategory(category: OneTimeProductCategory): OneTimeProduct[] {
    return ONE_TIME_PRODUCTS.filter(p => p.category === category);
  }

  static getAllProducts(): OneTimeProduct[] {
    return ONE_TIME_PRODUCTS;
  }

  static getAllBundles(): ProductBundle[] {
    return PRODUCT_BUNDLES;
  }

  /**
   * Get all products including subscriptions
   * This provides a unified view of all available products
   * Note: Import SUBSCRIPTION_PRODUCTS from './subscriptionProducts' when using this method
   */
  static getAllProductsIncludingSubscriptions(subscriptionProducts?: SubscriptionProduct[]): Array<OneTimeProduct | { type: 'subscription'; id: string; name: string; category: 'subscription' }> {
    if (!subscriptionProducts) {
      return ONE_TIME_PRODUCTS;
    }
    
    const subscriptions = subscriptionProducts.map((sub: SubscriptionProduct) => ({
      type: 'subscription' as const,
      id: sub.id,
      name: sub.name,
      category: 'subscription' as const,
      tier: sub.tier,
      description: sub.description,
      monthlyPrice: sub.monthlyEquivalent,
      annualPrice: sub.quarterlyPrice * 4
    }));
    
    return [...ONE_TIME_PRODUCTS, ...subscriptions];
  }

  static calculateBundleSavings(bundleId: string): number {
    const bundle = this.getBundle(bundleId);
    if (!bundle) return 0;

    const totalPrice = bundle.products.reduce((sum, productId) => {
      const product = this.getProduct(productId);
      return sum + (product?.price || 0);
    }, 0);

    return totalPrice - bundle.price;
  }

  static getProductsInBundle(bundleId: string): OneTimeProduct[] {
    const bundle = this.getBundle(bundleId);
    if (!bundle) return [];

    return bundle.products
      .map(pid => this.getProduct(pid))
      .filter((p): p is OneTimeProduct => p !== undefined);
  }

  static searchProducts(query: string): OneTimeProduct[] {
    const lowerQuery = query.toLowerCase();
    return ONE_TIME_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.features.some(f => f.toLowerCase().includes(lowerQuery))
    );
  }

  static getRecommendations(currentProductId: string): OneTimeProduct[] {
    const currentProduct = this.getProduct(currentProductId);
    if (!currentProduct) return [];

    // Recommend products in the same category
    return ONE_TIME_PRODUCTS
      .filter(p =>
        p.id !== currentProductId &&
        (p.category === currentProduct.category ||
         p.targetAudience.some(ta => currentProduct.targetAudience.includes(ta)))
      )
      .slice(0, 3);
  }
}
