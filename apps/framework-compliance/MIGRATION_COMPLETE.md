# ✅ One-Time Purchases Migration - Complete Setup

## Migration Status: ✅ READY TO APPLY

The migration file has been created and is ready to be applied to your Supabase database.

---

## 📋 What Was Created

1. ✅ **Migration File:** `supabase/migrations/20250205000000_one_time_purchases.sql`
2. ✅ **Added to Combined File:** `supabase/migrations/ALL_MIGRATIONS_COMBINED.sql`
3. ✅ **Verification Script:** `scripts/verify-one-time-purchases-setup.ts`
4. ✅ **Application Script:** `scripts/apply-one-time-purchases-migration.ts`
5. ✅ **Documentation:** `docs/APPLY_ONE_TIME_PURCHASES_MIGRATION.md`

---

## 🚀 Apply Migration (Choose One Method)

### Method 1: Supabase SQL Editor (Recommended - 2 minutes)

1. **Go to:** https://app.supabase.com
2. **Select project:** achowlksgmwuvfbvjfrt
3. **Click:** SQL Editor → New query
4. **Copy SQL from:** `supabase/migrations/20250205000000_one_time_purchases.sql`
5. **Paste and click:** Run (Ctrl+Enter)
6. **Verify:** `npm run verify:one-time`

### Method 2: Use Combined Migrations File

1. **Go to:** Supabase SQL Editor
2. **Open:** `supabase/migrations/ALL_MIGRATIONS_COMBINED.sql`
3. **Find section:** `-- Migration: 20250205000000_one_time_purchases.sql`
4. **Copy that section** and run it

### Method 3: CLI (If Supabase CLI is configured)

```bash
cd apps/framework-compliance
supabase db push
```

---

## ✅ Verification

After applying, verify the migration:

```bash
npm run verify:one-time
```

Or check manually in Supabase Dashboard:
- Go to **Table Editor**
- Look for `cc_one_time_purchases` table

---

## 📊 What the Migration Creates

- **Table:** `cc_one_time_purchases` with 15 columns
- **6 Indexes** for fast queries
- **3 RLS Policies** for security
- **1 Trigger** for auto-updating timestamps

---

## 🎯 Next Steps After Migration

1. ✅ Apply migration (see above)
2. ⚠️ Configure Stripe (follow `STRIPE_SETUP_COMPLETE.md`)
3. ⚠️ Deploy Edge Functions
4. ⚠️ Test checkout flow

---

## 📚 Documentation

- **Quick Guide:** `MIGRATION_READY.md`
- **Detailed Guide:** `docs/APPLY_ONE_TIME_PURCHASES_MIGRATION.md`
- **Readiness Report:** `docs/reports/ONE_TIME_PRODUCTS_READINESS.md`

---

**Status:** ✅ Migration file complete and ready  
**Time to Apply:** ~2 minutes  
**Difficulty:** Easy (copy-paste SQL)

Once applied, the database will be ready for one-time product purchases! 🎉

