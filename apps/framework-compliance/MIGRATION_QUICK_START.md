# 🚀 Database Migration Quick Start

**Fastest way to apply all database migrations**

---

## ⚡ Quick Method (5 minutes)

### Step 1: Generate Combined Migration

```bash
cd apps/framework-compliance
npm run migrate:generate
```

This creates `supabase/migrations/ALL_MIGRATIONS_COMBINED.sql`

### Step 2: Apply in Supabase Dashboard

1. **Open Supabase Dashboard**: https://app.supabase.com
2. **Select your project** (from `VITE_SUPABASE_URL`)
3. **Go to SQL Editor** → Click "New query"
4. **Open file**: `apps/framework-compliance/supabase/migrations/ALL_MIGRATIONS_COMBINED.sql`
5. **Copy ALL content** (Ctrl+A, Ctrl+C)
6. **Paste into SQL Editor** (Ctrl+V)
7. **Click Run** (or press Ctrl+Enter)
8. **Wait for "Success"** message (30-60 seconds)

### Step 3: Verify

```bash
npm run verify:migrations
```

---

## ✅ What Gets Created

- **20+ database tables** for privacy tools, subscriptions, purchases
- **Indexes** for performance
- **RLS policies** for security
- **Triggers** for automatic updates
- **Functions** for business logic

---

## 📋 Detailed Guide

For detailed instructions, troubleshooting, and alternative methods, see:
- `docs/COMPLETE_MIGRATION_GUIDE.md` - Full migration guide
- `docs/APPLY_MIGRATIONS.md` - Step-by-step instructions

---

## ⚠️ Important Notes

- Uses `IF NOT EXISTS` - safe to run multiple times
- Some warnings about existing objects are OK
- Cron jobs migration may fail (requires Pro plan) - this is OK to skip
- All tables use `cc_privacy_` prefix to avoid conflicts

---

**Time Required**: 5-10 minutes  
**Difficulty**: Easy (copy-paste)  
**Risk**: Low

