/**
 * Script to fetch Stripe Price IDs for subscription plans
 * Usage: tsx scripts/get-stripe-price-ids.ts <STRIPE_SECRET_KEY>
 */

// Get Stripe secret key from command line, environment variable, or use default
// NOTE: For security, prefer using environment variable: export STRIPE_SECRET_KEY=sk_live_...
const STRIPE_SECRET_KEY = process.argv[2] || process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ Error: Stripe Secret Key required');
  console.log('\nUsage:');
  console.log('  tsx scripts/get-stripe-price-ids.ts <STRIPE_SECRET_KEY>');
  console.log('\nOr set STRIPE_SECRET_KEY environment variable');
  console.log('\nYou can get your Stripe Secret Key from:');
  console.log('  - Supabase Dashboard → Edge Functions → Secrets → STRIPE_SECRET_KEY');
  console.log('  - Stripe Dashboard → Developers → API keys → Secret key');
  process.exit(1);
}

interface StripePrice {
  id: string;
  active: boolean;
  currency: string;
  unit_amount: number;
  recurring?: {
    interval: 'month' | 'year';
  };
  product: string | {
    id: string;
    name: string;
  };
}

interface StripeProduct {
  id: string;
  name: string;
  description: string;
}

async function fetchStripePrices(): Promise<void> {
  try {
    console.log('🔍 Fetching Stripe products and prices...\n');

    // Fetch all products
    const productsResponse = await fetch('https://api.stripe.com/v1/products?limit=100', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      },
    });

    if (!productsResponse.ok) {
      const error = await productsResponse.text();
      throw new Error(`Failed to fetch products: ${error}`);
    }

    const productsData = await productsResponse.json();
    const products: StripeProduct[] = productsData.data;

    // Fetch all prices
    const pricesResponse = await fetch('https://api.stripe.com/v1/prices?limit=100&expand[]=data.product', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      },
    });

    if (!pricesResponse.ok) {
      const error = await pricesResponse.text();
      throw new Error(`Failed to fetch prices: ${error}`);
    }

    const pricesData = await pricesResponse.json();
    const prices: StripePrice[] = pricesData.data;

    // Filter for subscription prices (recurring)
    const subscriptionPrices = prices.filter(p => p.recurring && p.active);

    // Match prices to products
    const priceMap: Record<string, { monthly?: string; annual?: string; productName: string }> = {};

    subscriptionPrices.forEach((price) => {
      const product = typeof price.product === 'string' 
        ? products.find(p => p.id === price.product)
        : price.product;
      
      if (!product) return;

      const productName = product.name.toLowerCase();
      const interval = price.recurring?.interval;

      // Try to match by product name
      let tier: string | null = null;
      if (productName.includes('starter')) tier = 'starter';
      else if (productName.includes('professional')) tier = 'professional';
      else if (productName.includes('enterprise')) tier = 'enterprise';

      if (tier) {
        if (!priceMap[tier]) {
          priceMap[tier] = { productName: product.name };
        }
        if (interval === 'month') {
          priceMap[tier].monthly = price.id;
        } else if (interval === 'year') {
          priceMap[tier].annual = price.id;
        }
      }
    });

    console.log('✅ Found Stripe Price IDs:\n');
    console.log('='.repeat(60));
    
    // Display results
    const tiers = ['starter', 'professional', 'enterprise'];
    const secrets: Array<{ name: string; value: string }> = [];

    tiers.forEach(tier => {
      const prices = priceMap[tier];
      if (prices) {
        console.log(`\n📦 ${tier.toUpperCase()} (${prices.productName}):`);
        if (prices.monthly) {
          console.log(`   Monthly: ${prices.monthly}`);
          secrets.push({ name: `STRIPE_PRICE_${tier.toUpperCase()}_MONTHLY`, value: prices.monthly });
        } else {
          console.log(`   Monthly: ❌ Not found`);
        }
        if (prices.annual) {
          console.log(`   Annual:  ${prices.annual}`);
          secrets.push({ name: `STRIPE_PRICE_${tier.toUpperCase()}_ANNUAL`, value: prices.annual });
        } else {
          console.log(`   Annual:  ❌ Not found`);
        }
      } else {
        console.log(`\n📦 ${tier.toUpperCase()}: ❌ No matching product found`);
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log('\n📋 Copy these secrets to Supabase Edge Functions:\n');

    secrets.forEach(secret => {
      console.log(`Name:  ${secret.name}`);
      console.log(`Value: ${secret.value}`);
      console.log('');
    });

    if (secrets.length === 0) {
      console.log('⚠️  No subscription prices found!');
      console.log('\n💡 You may need to:');
      console.log('   1. Create products in Stripe Dashboard → Products');
      console.log('   2. Add recurring prices (monthly and annual) to each product');
      console.log('   3. Name products with "Starter", "Professional", or "Enterprise" in the name');
    }

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

fetchStripePrices();

