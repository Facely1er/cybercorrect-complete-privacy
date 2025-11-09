# Test Supabase Connection - Step-by-Step Guide

## 🎯 Objective

Test the application's connection to Supabase and verify data sync works correctly.

## ⏱️ Estimated Time: 15 minutes

---

## 📋 Prerequisites

- Environment variables configured (✅ Done)
- Database migrations applied (✅ Done)
- Edge Functions deployed (✅ Done)
- Function secrets configured (⏳ In Progress)

---

## 🚀 Step-by-Step Instructions

### Step 1: Start Development Server

1. Open terminal in project directory:
```bash
cd cybercorrect-complete-privacy/cybercorrect-complete-privacy
```

2. Start development server:
```bash
npm run dev
```

3. Wait for: ✅ **Server running** message
4. Note the URL (usually: `http://localhost:5173`)

---

### Step 2: Open Application in Browser

1. Open browser
2. Navigate to: `http://localhost:5173`
3. Verify: Application loads without errors

**Expected Result**:
- ✅ Application loads successfully
- ✅ No console errors
- ✅ UI displays correctly

---

### Step 3: Test Authentication (Optional)

1. Click: **Sign Up** or **Login** (if available)
2. Create a test account or login
3. Verify: Authentication works

**Note**: If authentication is not implemented yet, skip this step.

---

### Step 4: Test Privacy Tool - Consent Management

1. Navigate to: **Toolkit** or **Privacy Tools**
2. Click on: **Consent Management**
3. Click: **Create New Consent Record**

4. Fill in test data:
   - **Data Subject Name**: `Test User`
   - **Email**: `test@example.com`
   - **Consent Type**: `Marketing`
   - **Status**: `Active`
   - **Consent Date**: Today's date

5. Click: **Save** or **Create**

**Expected Result**:
- ✅ Record created successfully
- ✅ Success message displayed
- ✅ Record appears in list

---

### Step 5: Verify Data Saved to Supabase

1. Go to: https://app.supabase.com
2. Select project: **achowlksgmwuvfbvjfrt**
3. Navigate to: **Table Editor** (left sidebar)
4. Find table: **cc_privacy_consent_records**
5. Click on the table
6. Verify: Your test record appears in the table

**Expected Result**:
- ✅ Test record visible in table
- ✅ All fields populated correctly
- ✅ `created_at` timestamp present
- ✅ `user_id` populated (if authenticated)

---

### Step 6: Test Other Privacy Tools (Optional)

Repeat Step 4-5 for other tools:

1. **Vendor Risk Assessment**
   - Table: `cc_privacy_vendor_assessments`

2. **Retention Policy Generator**
   - Table: `cc_privacy_retention_policies`

3. **DPIA Manager**
   - Table: `cc_privacy_dpias`

4. **Privacy by Design Assessment**
   - Table: `cc_privacy_privacy_by_design_assessments`

5. **Service Provider Manager**
   - Table: `cc_privacy_service_providers`

6. **Incident Response Manager**
   - Table: `cc_privacy_privacy_incidents`

---

### Step 7: Test Data Sync (localStorage → Supabase)

1. In the application, create a record
2. Check browser console (F12 → Console tab)
3. Look for: Sync messages or errors

**Expected Result**:
- ✅ Data saved to localStorage immediately
- ✅ Data synced to Supabase in background
- ✅ No sync errors in console

---

### Step 8: Test Offline Functionality

1. In browser, open: **Developer Tools** (F12)
2. Go to: **Network** tab
3. Select: **Offline** checkbox (or use browser's offline mode)
4. Try to create a new record
5. Verify: Record still saves to localStorage

**Expected Result**:
- ✅ Record saves to localStorage
- ✅ Application doesn't crash
- ✅ When online, data syncs to Supabase

---

## ✅ Verification Checklist

After testing, verify:

- [ ] Application loads without errors
- [ ] Can create records in privacy tools
- [ ] Records appear in Supabase tables
- [ ] Data syncs from localStorage to Supabase
- [ ] Application works offline (localStorage)
- [ ] No console errors
- [ ] No network errors

---

## 🐛 Troubleshooting

### Error: "Failed to fetch" or Network Error

**Cause**: Supabase URL or key incorrect, or network issue.

**Solution**:
1. Check `.env` file has correct values:
   - `VITE_SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
2. Restart development server
3. Check browser console for specific error

### Error: "relation does not exist"

**Cause**: Table not created yet.

**Solution**:
1. Verify migrations were applied
2. Check Supabase Dashboard → **Table Editor**
3. Run missing migrations if needed

### Error: "permission denied" or RLS Error

**Cause**: Row Level Security policy blocking access.

**Solution**:
1. Check if user is authenticated
2. Verify RLS policies are correct
3. Check user_id matches authenticated user

### Data Not Appearing in Supabase

**Cause**: Sync failed or not configured.

**Solution**:
1. Check browser console for errors
2. Verify `storageAdapter` is configured
3. Check Supabase connection is working
4. Verify user is authenticated (if required)

---

## 📊 Expected Behavior

### localStorage (Always Works)

- ✅ Data saves immediately
- ✅ Works offline
- ✅ No network required
- ✅ Privacy by Design compliant

### Supabase Sync (When Available)

- ✅ Syncs in background
- ✅ Non-blocking
- ✅ Graceful degradation if fails
- ✅ Retries automatically

---

## 🧪 Test Script

You can also use the test script:

```bash
npm run supabase:test
```

This will test the Supabase connection programmatically.

---

## 📚 Related Documentation

- **Configure Secrets**: `CONFIGURE_EDGE_FUNCTION_SECRETS.md`
- **Storage Adapter**: `src/utils/storageAdapter.ts`
- **Supabase Client**: `src/lib/supabase.ts`
- **Quick Reference**: `QUICK_REFERENCE.md`

---

## 🎉 Success!

Once all tests pass, your application is ready for production!

**Next Steps**:
1. Configure external services (optional):
   - Stripe (for payments)
   - SendGrid (for emails)
   - Sentry (for error monitoring)

2. Deploy to production:
   - Build: `npm run build`
   - Deploy to Netlify/Vercel
   - Set environment variables

---

**Status**: Ready to test
**Estimated Time**: 15 minutes
**Last Updated**: 2025-02-02

