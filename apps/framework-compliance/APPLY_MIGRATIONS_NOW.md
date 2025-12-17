# ✅ Apply Database Migrations - Ready to Execute

**Status**: All migration files are ready  
**File**: `supabase/migrations/ALL_MIGRATIONS_COMBINED.sql`  
**Time Required**: 5-10 minutes

---

## 🚀 Quick Steps

### 1. Open Supabase Dashboard
- Go to: https://app.supabase.com
- Login and select your project
- Project ID should match your `VITE_SUPABASE_URL`

### 2. Open SQL Editor
- Click **SQL Editor** in left sidebar
- Click **New query** button

### 3. Copy Migration File
- Open: `apps/framework-compliance/supabase/migrations/ALL_MIGRATIONS_COMBINED.sql`
- **Select ALL** (Ctrl+A)
- **Copy** (Ctrl+C)

### 4. Paste and Run
- **Paste** into SQL Editor (Ctrl+V)
- Click **Run** button (or press Ctrl+Enter)
- **Wait** for "Success" message (30-60 seconds)

### 5. Verify
```bash
cd apps/framework-compliance
npm run verify:migrations
```

Or check manually in Supabase Table Editor - you should see:
- `cc_privacy_consent_records`
- `cc_privacy_vendor_assessments`
- `cc_privacy_retention_policies`
- `cc_privacy_dpias`
- `cc_privacy_subscriptions`
- `cc_one_time_purchases`
- And 15+ more tables...

---

## 📋 What This Creates

### Privacy Tools Tables (8)
- Consent Management
- Vendor Risk Assessment
- Retention Policies
- Data Records
- DPIAs
- Privacy by Design Assessments
- Service Providers
- Privacy Incidents

### Subscription Tables (4)
- Subscriptions
- Subscription History
- Payment Methods
- Invoices

### Other Tables
- One-Time Purchases
- Calendar Events
- RoPA Records
- Evidence Vault
- Portal Beta Applications
- Automated Reports
- Compliance Health Scores
- Scheduled Assessments
- Alert Rules
- Regulatory Updates

**Total**: 20+ tables with indexes, RLS policies, and triggers

---

## ⚠️ Important Notes

1. **Safe to Run**: Uses `IF NOT EXISTS` - won't break existing data
2. **Warnings OK**: Some "already exists" warnings are normal
3. **Cron Jobs**: May fail if you don't have Pro plan - this is OK to skip
4. **Time**: Large migration takes 30-60 seconds - be patient

---

## 🐛 Troubleshooting

### "relation already exists"
✅ **OK** - Table already exists, migration continues

### "permission denied"
❌ **Fix**: Make sure you're using SQL Editor (has admin access)

### "extension pg_cron is not available"
✅ **OK** - Skip cron jobs migration (optional feature)

### Tables not showing
❌ **Fix**: 
1. Refresh Table Editor
2. Check you're looking at `public` schema
3. Verify migration completed (check SQL Editor history)

---

## 📚 More Help

- **Full Guide**: `docs/COMPLETE_MIGRATION_GUIDE.md`
- **Quick Start**: `MIGRATION_QUICK_START.md`
- **Original Guide**: `docs/APPLY_MIGRATIONS.md`

---

## ✅ Success Checklist

After migration, verify:
- [ ] All tables exist in Table Editor
- [ ] Can see tables with `cc_privacy_` prefix
- [ ] RLS is enabled on tables
- [ ] Verification script passes: `npm run verify:migrations`

---

**Ready to apply? Follow the 5 steps above!** 🚀

