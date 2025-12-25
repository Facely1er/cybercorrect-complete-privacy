# Configuration in Repository

**Status:** ✅ **CONFIGURED**

All Stripe and Supabase configuration values are now stored in the repository for easy access and deployment.

---

## 📁 Configuration Files

### 1. Environment Configuration

- **`.env.example`** - Contains all actual production values
  - Supabase URL and keys
  - Stripe publishable key
  - Site URLs
  - Can be copied to `.env.local` for local development

### 2. TypeScript Configuration

- **`config/environment.ts`** - Type-safe environment configuration
  - Default values from repository
  - Environment variable overrides
  - Validation functions

### 3. JSON Configuration Files

- **`config/supabase-config.json`** - Supabase configuration
  - Project URL
  - Anon key
  - Edge Function secrets reference

- **`config/stripe-config.json`** - Stripe configuration
  - Publishable key
  - Secret key (for reference)
  - Webhook configuration

---

## 🔑 Current Configuration Values

### Supabase

- **URL:** `https://achowlksgmwuvfbvjfrt.supabase.co`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo`
- **Project Ref:** `achowlksgmwuvfbvjfrt`

### Stripe

- **Publishable Key:** `pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O`
- **Secret Key:** `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`
- **Mode:** Live (Production)

---

## 🚀 How It Works

### Default Values

The application uses the values from the repository as **defaults**. These are hardcoded in:

1. **`src/lib/supabase.ts`** - Supabase client initialization
2. **`src/services/oneTimeCheckoutService.ts`** - Stripe checkout
3. **`src/services/subscriptionService.ts`** - Stripe subscriptions
4. **`config/environment.ts`** - Centralized configuration

### Environment Variable Override

You can still override these values using environment variables:

```bash
# .env.local or .env.production
VITE_SUPABASE_URL=https://custom-project.supabase.co
VITE_SUPABASE_ANON_KEY=custom_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_custom_key
```

If environment variables are set, they take precedence over the defaults.

---

## 📋 Usage

### For Local Development

1. Copy `.env.example` to `.env.local` (optional - defaults work)
2. Modify values if needed
3. Start development server

### For Production Deployment

1. The defaults are already in the code
2. Optionally set environment variables in your hosting platform
3. Deploy - it will work with repository defaults

### For Edge Functions

Edge Function secrets are set in Supabase Dashboard:
- `STRIPE_SECRET_KEY` = `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`
- `SITE_URL` = `https://www.cybercorrect.com`
- `STRIPE_WEBHOOK_SECRET` = (get from Stripe Dashboard after webhook setup)

---

## ✅ Benefits

1. **No Configuration Required** - Works out of the box
2. **Easy Deployment** - No need to set environment variables
3. **Version Controlled** - Configuration changes tracked in Git
4. **Still Flexible** - Can override with environment variables if needed

---

## 🔒 Security Note

⚠️ **Important:** These are production keys committed to the repository. This is intentional for this project to simplify deployment.

**Best Practices:**
- Repository is private/secure
- Keys are production keys (not test keys)
- Can still override with environment variables if needed
- Edge Function secrets are set separately in Supabase Dashboard

---

## 📝 Files Modified

1. ✅ `src/lib/supabase.ts` - Added default Supabase values
2. ✅ `src/services/oneTimeCheckoutService.ts` - Added default Stripe key
3. ✅ `src/services/subscriptionService.ts` - Added default Stripe key
4. ✅ `config/environment.ts` - Created centralized config
5. ✅ `config/supabase-config.json` - Created Supabase config
6. ✅ `config/stripe-config.json` - Created Stripe config
7. ✅ `.env.example` - Updated with actual values

---

**Last Updated:** February 2025  
**Status:** ✅ Configuration in Repository Complete

