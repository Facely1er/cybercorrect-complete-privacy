# Storage Adapter - Supabase Integration Guide

## Overview

The `storageAdapter` has been updated to support **optional Supabase cloud sync** while maintaining **localStorage as the mandatory primary storage** (Privacy by Design requirement).

---

## Privacy by Design Principles

### ✅ localStorage is MANDATORY
- All data is stored locally by default
- Works completely offline
- No internet connection required
- Privacy by default

### ✅ Supabase is OPTIONAL
- Cloud sync is opt-in, not required
- Only syncs when user is authenticated
- Gracefully degrades if Supabase is not configured
- Background sync (non-blocking)

---

## How It Works

### Storage Flow

```
User Action
    ↓
Save to localStorage (IMMEDIATE - Privacy by Design requirement)
    ↓
Return success (synchronous)
    ↓
[Background] Check if Supabase available
    ↓
[Background] If authenticated, sync to Supabase (non-blocking)
    ↓
[Background] If sync fails, silently continue (localStorage is primary)
```

### Read Flow

```
User Action
    ↓
Read from localStorage (IMMEDIATE - Privacy by Design requirement)
    ↓
Return data (synchronous)
    ↓
[Optional] Sync from Supabase on login (manual or automatic)
```

---

## API Reference

### Get Methods (Synchronous - localStorage only)

```typescript
// All get methods read from localStorage immediately
const records = storageAdapter.getConsentRecords();
const assessments = storageAdapter.getVendorAssessments();
const dpias = storageAdapter.getDpias();
const policies = storageAdapter.getRetentionPolicies();
const dataRecords = storageAdapter.getDataRecords();
const assessments = storageAdapter.getPrivacyByDesignAssessments();
const providers = storageAdapter.getServiceProviders();
const incidents = storageAdapter.getPrivacyIncidents();
```

### Set Methods (Synchronous - localStorage + background Supabase sync)

```typescript
// All set methods save to localStorage immediately
// Supabase sync happens in background (non-blocking)
storageAdapter.setConsentRecords(records);
storageAdapter.setVendorAssessments(assessments);
storageAdapter.setDpias(dpias);
storageAdapter.setRetentionPolicies(policies);
storageAdapter.setDataRecords(records);
storageAdapter.setPrivacyByDesignAssessments(assessments);
storageAdapter.setServiceProviders(providers);
storageAdapter.setPrivacyIncidents(incidents);
```

### Sync From Supabase Methods (Optional - for cloud sync)

```typescript
// Sync data from Supabase to localStorage (optional)
// Useful for initial sync when user logs in
await storageAdapter.syncConsentRecordsFromSupabase();
await storageAdapter.syncVendorAssessmentsFromSupabase();
await storageAdapter.syncDpiasFromSupabase();
await storageAdapter.syncRetentionPoliciesFromSupabase();
await storageAdapter.syncDataRecordsFromSupabase();
await storageAdapter.syncPrivacyByDesignAssessmentsFromSupabase();
await storageAdapter.syncServiceProvidersFromSupabase();
await storageAdapter.syncPrivacyIncidentsFromSupabase();

// Sync all data at once
const results = await storageAdapter.syncAllFromSupabase();
// Returns: { consent, vendor, dpias, retention, dataRecords, pbd, serviceProviders, incidents }
```

---

## Database Tables

All tables use the `cc_privacy_` prefix to avoid conflicts:

- `cc_privacy_consent_records`
- `cc_privacy_vendor_assessments`
- `cc_privacy_retention_policies`
- `cc_privacy_data_records`
- `cc_privacy_dpias`
- `cc_privacy_privacy_by_design_assessments`
- `cc_privacy_service_providers`
- `cc_privacy_privacy_incidents`

---

## Usage Examples

### Example 1: Basic Usage (localStorage only)

```typescript
// Works offline - no Supabase required
const records = storageAdapter.getConsentRecords();
storageAdapter.setConsentRecords([...records, newRecord]);
```

### Example 2: With Supabase Sync (optional)

```typescript
// Save to localStorage (immediate)
storageAdapter.setConsentRecords(records);
// Supabase sync happens automatically in background (if authenticated)

// Later, sync from Supabase to localStorage (optional)
if (userIsAuthenticated) {
  await storageAdapter.syncConsentRecordsFromSupabase();
}
```

### Example 3: Initial Sync on Login

```typescript
// When user logs in, sync all data from Supabase
async function onUserLogin() {
  const results = await storageAdapter.syncAllFromSupabase();
  console.log('Sync results:', results);
  // { consent: true, vendor: true, dpias: true, ... }
}
```

---

## Error Handling

### Supabase Sync Errors

- **Silently handled**: Supabase sync errors don't affect localStorage operations
- **Logged**: Errors are logged to error monitoring service
- **Non-blocking**: localStorage operations continue even if Supabase sync fails

### localStorage Errors

- **Graceful degradation**: If localStorage is unavailable, methods return `false` or `null`
- **Error monitoring**: Errors are logged to error monitoring service

---

## Privacy by Design Compliance

### ✅ Principle 1: Proactive
- Data stored locally prevents exposure
- No data leaves device unless explicitly synced

### ✅ Principle 2: Privacy as Default
- localStorage is default storage
- Supabase sync is optional, not required

### ✅ Principle 3: Embedded in Design
- localStorage is architectural foundation
- Supabase is optional enhancement

### ✅ Principle 4: Full Functionality
- All tools work fully offline
- No feature loss without Supabase

### ✅ Principle 5: End-to-End Security
- Data lifecycle protection on user's device
- Optional cloud sync with user control

### ✅ Principle 6: Visibility
- Users can inspect localStorage data
- Clear sync status (optional)

### ✅ Principle 7: User-Centric
- User maintains sovereignty over data
- User controls when to sync

---

## Migration from localStorage to Supabase

### Automatic Sync (Background)

When you call `set*` methods:
1. Data is saved to localStorage immediately
2. If user is authenticated, data syncs to Supabase in background
3. No blocking - operation returns immediately

### Manual Sync (On Demand)

When you call `sync*FromSupabase` methods:
1. Data is fetched from Supabase
2. Data is merged/replaced in localStorage
3. Returns success/failure status

### Initial Sync (On Login)

```typescript
// In your auth context or login handler
import { storageAdapter } from '../utils/storageAdapter';

async function handleLogin() {
  // After successful login
  const syncResults = await storageAdapter.syncAllFromSupabase();
  
  // Check which tools synced successfully
  if (syncResults.consent) {
    console.log('Consent records synced');
  }
  // ... check other tools
}
```

---

## Configuration

### Required: None
- localStorage works without any configuration
- Supabase is optional

### Optional: Supabase Setup

If you want cloud sync:

1. **Set environment variables**:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. **Apply database migration**:
```sql
-- Run: supabase/migrations/20250202000000_privacy_tools_schema.sql
```

3. **User authentication**:
- User must be authenticated for sync to work
- Sync only happens for authenticated users

---

## Best Practices

### 1. Always Use localStorage First
```typescript
// ✅ Good: Read from localStorage immediately
const records = storageAdapter.getConsentRecords();

// ❌ Bad: Don't wait for Supabase sync
const records = await storageAdapter.syncConsentRecordsFromSupabase();
```

### 2. Save to localStorage Immediately
```typescript
// ✅ Good: Save immediately, sync in background
storageAdapter.setConsentRecords(records);

// ❌ Bad: Don't wait for Supabase sync
await storageAdapter.setConsentRecords(records); // Not async!
```

### 3. Sync on Login (Optional)
```typescript
// ✅ Good: Sync on login for multi-device support
async function onLogin() {
  await storageAdapter.syncAllFromSupabase();
}
```

### 4. Handle Sync Errors Gracefully
```typescript
// ✅ Good: Sync errors don't affect localStorage
try {
  await storageAdapter.syncConsentRecordsFromSupabase();
} catch (err) {
  // localStorage still has the data
  console.log('Sync failed, but localStorage has data');
}
```

---

## Troubleshooting

### Sync Not Working

**Check**:
1. Is Supabase configured? (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)
2. Is user authenticated? (`await supabase.auth.getUser()`)
3. Are database tables created? (Run migration)
4. Are RLS policies active? (Check Supabase dashboard)

**Solution**: localStorage still works - sync is optional

### Data Not Syncing

**Check**:
1. Check browser console for errors
2. Check Supabase logs
3. Verify user is authenticated
4. Verify database tables exist

**Solution**: localStorage has the data - sync is optional

### localStorage Full

**Check**:
1. Check localStorage usage: `localStorage.length`
2. Clear old data if needed
3. Export data before clearing

**Solution**: Use `storageAdapter.clear()` or export data first

---

## Performance Considerations

### localStorage
- **Fast**: Instant read/write
- **Limited**: 5-10MB per origin
- **No network**: No latency

### Supabase Sync
- **Background**: Non-blocking
- **Network**: Depends on connection
- **Optional**: Doesn't affect localStorage performance

---

## Security Considerations

### localStorage
- **Browser storage**: Data stored in browser
- **Same-origin**: Isolated per domain
- **No encryption**: Use `secureStorage.setSecureItem()` for encryption

### Supabase
- **RLS policies**: User can only access their own data
- **Encrypted in transit**: HTTPS
- **Encrypted at rest**: Supabase encryption
- **User authentication**: Required for sync

---

## Testing

### Test localStorage (Offline)
```typescript
// Works without Supabase
const records = storageAdapter.getConsentRecords();
storageAdapter.setConsentRecords([...records, newRecord]);
```

### Test Supabase Sync (Online)
```typescript
// Requires Supabase and authentication
await storageAdapter.syncConsentRecordsFromSupabase();
```

### Test Error Handling
```typescript
// Disable Supabase temporarily
// localStorage should still work
storageAdapter.setConsentRecords(records);
```

---

## Summary

### Key Points

1. **localStorage is MANDATORY** - Privacy by Design requirement
2. **Supabase is OPTIONAL** - Cloud sync is opt-in
3. **localStorage is PRIMARY** - Always read/write to localStorage first
4. **Supabase is SECONDARY** - Background sync only
5. **Non-blocking** - Supabase sync doesn't block localStorage operations
6. **Graceful degradation** - Works even if Supabase is not configured

### Benefits

- ✅ Full offline functionality
- ✅ Privacy by default
- ✅ Optional cloud sync
- ✅ Multi-device support (when synced)
- ✅ No vendor lock-in
- ✅ User control

---

**Last Updated**: 2025-02-02
**Status**: ✅ Complete
**Migration File**: `20250202000000_privacy_tools_schema.sql`
**Storage Adapter**: `src/utils/storageAdapter.ts`

