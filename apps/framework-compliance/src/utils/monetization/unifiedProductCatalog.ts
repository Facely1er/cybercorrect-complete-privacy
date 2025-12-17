/**
 * Unified Product Catalog
 * 
 * This module provides a unified interface for accessing both subscription
 * and one-time purchase products in a single catalog.
 */

import { ONE_TIME_PRODUCTS, PRODUCT_BUNDLES, OneTimeProduct, ProductBundle, ProductCatalog as OneTimeCatalog } from './oneTimeProducts';
import { SUBSCRIPTION_PRODUCTS, SubscriptionProduct, getSubscriptionByTier, getSubscriptionById, getAllSubscriptions } from './subscriptionProducts';

export type ProductCategory = 'subscription' | 'toolkit' | 'assessment' | 'gdpr' | 'templates' | 'bundle' | 'all';

export interface UnifiedProduct {
  id: string;
  name: string;
  type: 'subscription' | 'one-time' | 'bundle';
  category: ProductCategory;
  description: string;
  price?: number;
  monthlyPrice?: number;
  annualPrice?: number;
  quarterlyPrice?: number;
  monthlyEquivalent?: number;
  billing?: string;
  popular?: boolean;
  features?: string[];
  // Subscription-specific
  tier?: 'free' | 'starter' | 'professional' | 'enterprise';
  quarterlyDeliverables?: string[];
  ongoingAccess?: string[];
  professionalServices?: string[];
  // One-time specific
  licenseType?: 'lifetime' | 'annual';
  deploymentModel?: 'localStorage' | 'standalone' | 'hybrid';
}

/**
 * Unified Product Catalog Class
 * Provides a single interface for accessing all products (subscriptions and one-time)
 */
export class UnifiedProductCatalog {
  /**
   * Get all products (subscriptions + one-time + bundles)
   */
  static getAllProducts(): UnifiedProduct[] {
    const subscriptions: UnifiedProduct[] = SUBSCRIPTION_PRODUCTS.map(sub => ({
      id: sub.id,
      name: sub.name,
      type: 'subscription' as const,
      category: 'subscription' as const,
      description: sub.description,
      quarterlyPrice: sub.quarterlyPrice,
      monthlyEquivalent: sub.monthlyEquivalent,
      monthlyPrice: sub.monthlyEquivalent, // For backward compatibility
      billing: sub.billing,
      popular: sub.popular,
      tier: sub.tier,
      quarterlyDeliverables: sub.quarterlyDeliverables,
      ongoingAccess: sub.ongoingAccess,
      professionalServices: sub.professionalServices
    }));

    const oneTime: UnifiedProduct[] = ONE_TIME_PRODUCTS.map(product => ({
      id: product.id,
      name: product.name,
      type: 'one-time' as const,
      category: product.category as ProductCategory,
      description: product.description,
      price: product.price,
      features: product.features,
      licenseType: product.licenseType,
      deploymentModel: product.deploymentModel
    }));

    const bundles: UnifiedProduct[] = PRODUCT_BUNDLES.map(bundle => ({
      id: bundle.id,
      name: bundle.name,
      type: 'bundle' as const,
      category: 'bundle' as const,
      description: bundle.description,
      price: bundle.price
    }));

    return [...subscriptions, ...oneTime, ...bundles];
  }

  /**
   * Get products by category
   */
  static getProductsByCategory(category: ProductCategory): UnifiedProduct[] {
    if (category === 'all') {
      return this.getAllProducts();
    }

    if (category === 'subscription') {
      return SUBSCRIPTION_PRODUCTS.map(sub => ({
        id: sub.id,
        name: sub.name,
        type: 'subscription' as const,
        category: 'subscription' as const,
        description: sub.description,
        quarterlyPrice: sub.quarterlyPrice,
        monthlyEquivalent: sub.monthlyEquivalent,
        monthlyPrice: sub.monthlyEquivalent, // For backward compatibility
        billing: sub.billing,
        popular: sub.popular,
        tier: sub.tier,
        quarterlyDeliverables: sub.quarterlyDeliverables,
        ongoingAccess: sub.ongoingAccess,
        professionalServices: sub.professionalServices
      }));
    }

    if (category === 'bundle') {
      return PRODUCT_BUNDLES.map(bundle => ({
        id: bundle.id,
        name: bundle.name,
        type: 'bundle' as const,
        category: 'bundle' as const,
        description: bundle.description,
        price: bundle.price
      }));
    }

    // One-time product categories
    const oneTimeProducts = ONE_TIME_PRODUCTS.filter(p => p.category === category);
    return oneTimeProducts.map(product => ({
      id: product.id,
      name: product.name,
      type: 'one-time' as const,
      category: product.category as ProductCategory,
      description: product.description,
      price: product.price,
      features: product.features,
      licenseType: product.licenseType,
      deploymentModel: product.deploymentModel
    }));
  }

  /**
   * Get product by ID (works for subscriptions, one-time products, and bundles)
   */
  static getProduct(productId: string): UnifiedProduct | undefined {
    // Check subscriptions
    const subscription = getSubscriptionById(productId);
    if (subscription) {
      return {
        id: subscription.id,
        name: subscription.name,
        type: 'subscription',
        category: 'subscription',
        description: subscription.description,
        quarterlyPrice: subscription.quarterlyPrice,
        monthlyEquivalent: subscription.monthlyEquivalent,
        monthlyPrice: subscription.monthlyEquivalent, // For backward compatibility
        billing: subscription.billing,
        popular: subscription.popular,
        tier: subscription.tier,
        quarterlyDeliverables: subscription.quarterlyDeliverables,
        ongoingAccess: subscription.ongoingAccess,
        professionalServices: subscription.professionalServices
      };
    }

    // Check one-time products
    const oneTime = OneTimeCatalog.getProduct(productId);
    if (oneTime) {
      return {
        id: oneTime.id,
        name: oneTime.name,
        type: 'one-time',
        category: oneTime.category as ProductCategory,
        description: oneTime.description,
        price: oneTime.price,
        features: oneTime.features,
        licenseType: oneTime.licenseType,
        deploymentModel: oneTime.deploymentModel
      };
    }

    // Check bundles
    const bundle = OneTimeCatalog.getBundle(productId);
    if (bundle) {
      return {
        id: bundle.id,
        name: bundle.name,
        type: 'bundle',
        category: 'bundle',
        description: bundle.description,
        price: bundle.price
      };
    }

    return undefined;
  }

  /**
   * Get subscription by tier
   */
  static getSubscriptionByTier(tier: 'free' | 'starter' | 'professional' | 'enterprise'): UnifiedProduct | undefined {
    const subscription = getSubscriptionByTier(tier);
    if (!subscription) return undefined;

    return {
      id: subscription.id,
      name: subscription.name,
      type: 'subscription',
      category: 'subscription',
      description: subscription.description,
      quarterlyPrice: subscription.quarterlyPrice,
      monthlyEquivalent: subscription.monthlyEquivalent,
      monthlyPrice: subscription.monthlyEquivalent, // For backward compatibility
      billing: subscription.billing,
      popular: subscription.popular,
      tier: subscription.tier,
      quarterlyDeliverables: subscription.quarterlyDeliverables,
      ongoingAccess: subscription.ongoingAccess,
      professionalServices: subscription.professionalServices
    };
  }

  /**
   * Search all products
   */
  static searchProducts(query: string): UnifiedProduct[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllProducts().filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      (p.features && p.features.some(f => f.toLowerCase().includes(lowerQuery)))
    );
  }

  /**
   * Get all subscription products
   */
  static getAllSubscriptions(): UnifiedProduct[] {
    return SUBSCRIPTION_PRODUCTS.map(sub => ({
      id: sub.id,
      name: sub.name,
      type: 'subscription' as const,
      category: 'subscription' as const,
      description: sub.description,
      quarterlyPrice: sub.quarterlyPrice,
      monthlyEquivalent: sub.monthlyEquivalent,
      monthlyPrice: sub.monthlyEquivalent, // For backward compatibility
      billing: sub.billing,
      popular: sub.popular,
      tier: sub.tier,
      quarterlyDeliverables: sub.quarterlyDeliverables,
      ongoingAccess: sub.ongoingAccess,
      professionalServices: sub.professionalServices
    }));
  }

  /**
   * Get all one-time products
   */
  static getAllOneTimeProducts(): UnifiedProduct[] {
    return ONE_TIME_PRODUCTS.map(product => ({
      id: product.id,
      name: product.name,
      type: 'one-time' as const,
      category: product.category as ProductCategory,
      description: product.description,
      price: product.price,
      features: product.features,
      licenseType: product.licenseType,
      deploymentModel: product.deploymentModel
    }));
  }

  /**
   * Get all bundles
   */
  static getAllBundles(): UnifiedProduct[] {
    return PRODUCT_BUNDLES.map(bundle => ({
      id: bundle.id,
      name: bundle.name,
      type: 'bundle' as const,
      category: 'bundle' as const,
      description: bundle.description,
      price: bundle.price
    }));
  }
}

// Export convenience functions
export const getAllProducts = () => UnifiedProductCatalog.getAllProducts();
export const getProductsByCategory = (category: ProductCategory) => UnifiedProductCatalog.getProductsByCategory(category);
export const getProduct = (productId: string) => UnifiedProductCatalog.getProduct(productId);
export const searchProducts = (query: string) => UnifiedProductCatalog.searchProducts(query);

