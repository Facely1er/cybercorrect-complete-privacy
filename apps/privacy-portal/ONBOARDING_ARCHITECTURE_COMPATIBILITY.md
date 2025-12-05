# Onboarding Architecture Compatibility

## Overview

This document describes how the onboarding system is designed to work seamlessly with minimal architecture setups without interfering with core functionality.

## Design Principles

### 1. **Optional by Default**
- Onboarding is **not enforced** by default on any routes
- The `requireOnboarding` prop in `ProtectedRoute` defaults to `false`
- Routes must explicitly opt-in to require onboarding completion

### 2. **Graceful Degradation**
- All onboarding database operations gracefully handle missing tables/columns
- If database schema is minimal, onboarding assumes completion (allows access)
- Errors in onboarding checks default to allowing access, not blocking it

### 3. **Non-Blocking Architecture**
- Onboarding failures never block access to core features
- Database errors are logged but don't throw exceptions
- Missing schema elements are detected and handled gracefully

## Implementation Details

### Database Schema Handling

The onboarding service checks for schema errors and handles them gracefully:

```typescript
// Example: Checking onboarding completion
if (error.code === 'PGRST116' || error.message?.includes('column') || error.message?.includes('relation')) {
  // Schema not available - assume onboarding not required
  return true; // Allow access
}
```

### Error Handling Strategy

1. **Schema Errors**: Logged as warnings, default to allowing access
2. **Database Errors**: Logged, but don't block functionality
3. **Service Errors**: Caught and handled, navigation continues

### Route Protection

#### Current Implementation
- **No routes require onboarding by default**
- Onboarding route (`/onboarding`) is accessible to authenticated users
- All other routes work without onboarding completion

#### To Require Onboarding (Optional)
If you want to require onboarding for specific routes:

```tsx
<Route path="/privacy/dashboard" element={
  <ProtectedRoute requireOnboarding={true}>
    <PrivacyDashboardPage />
  </ProtectedRoute>
} />
```

Or use `OnboardingGuard`:

```tsx
<Route path="/privacy/dashboard" element={
  <ProtectedRoute>
    <OnboardingGuard>
      <PrivacyDashboardPage />
    </OnboardingGuard>
  </ProtectedRoute>
} />
```

## Database Dependencies

### Required Tables (Optional)
Onboarding works best with these tables, but they're not required:

- `profiles` table with columns:
  - `onboarding_started` (BOOLEAN)
  - `onboarding_started_at` (TIMESTAMP)
  - `onboarding_completed` (BOOLEAN)
  - `onboarding_completed_at` (TIMESTAMP)
  - `is_first_login` (BOOLEAN)

### Progress Tracking Tables (Optional)
These tables are checked for progress tracking but not required:

- `data_inventory` - For "Create Data Inventory" checklist item
- `compliance_assessments` - For "Run Compliance Assessment" checklist item
- `data_rights_requests` - For "Set Up Data Rights Portal" checklist item

**Note**: If these tables don't exist, onboarding still works but progress tracking may be limited.

## Minimal Architecture Compatibility

### What Works Without Database Schema

✅ **User Authentication** - Works independently  
✅ **Public Routes** - Always accessible  
✅ **Protected Routes** - Work without onboarding  
✅ **Onboarding Page** - Accessible, but completion may not persist  
✅ **Core Features** - All functionality accessible  

### What Requires Database Schema

⚠️ **Onboarding Completion Tracking** - Requires `profiles.onboarding_completed`  
⚠️ **Progress Tracking** - Requires checklist-related tables  
⚠️ **Profile Updates** - Requires `profiles` table with relevant columns  

**Important**: Even without these, onboarding still functions - it just won't persist completion state.

## Testing Minimal Architecture

To test with minimal architecture:

1. **Remove onboarding fields from profiles table** (or use minimal schema)
2. **Remove checklist tracking tables** (data_inventory, compliance_assessments, data_rights_requests)
3. **Verify**:
   - Users can access all routes
   - Onboarding page loads
   - Users can skip onboarding
   - Core features work normally

## Error Scenarios Handled

### Scenario 1: Missing Profiles Table
- **Behavior**: Onboarding checks return `true` (allows access)
- **Logging**: Warning logged, no exception thrown
- **User Impact**: None - access granted

### Scenario 2: Missing Onboarding Columns
- **Behavior**: Onboarding checks return `true` (allows access)
- **Logging**: Warning logged about missing columns
- **User Impact**: None - access granted

### Scenario 3: Missing Checklist Tables
- **Behavior**: Progress tracking returns default values
- **Logging**: Warnings logged for each missing table
- **User Impact**: Minimal - checklist shows no progress, but onboarding still works

### Scenario 4: Database Connection Error
- **Behavior**: Onboarding checks return `true` (allows access)
- **Logging**: Error logged
- **User Impact**: None - access granted to prevent blocking

## Best Practices

### For Minimal Architecture Setups

1. **Don't require onboarding** - Leave `requireOnboarding={false}` (default)
2. **Make onboarding optional** - Users can access it but aren't forced
3. **Handle errors gracefully** - Already implemented in service layer

### For Full Architecture Setups

1. **Add database schema** - Include all onboarding fields
2. **Optionally require onboarding** - Set `requireOnboarding={true}` on specific routes
3. **Monitor logs** - Check for any schema-related warnings

## Migration Path

### From Minimal to Full Architecture

1. Add `profiles` table with onboarding columns
2. Add checklist tracking tables (optional)
3. Optionally enable `requireOnboarding` on specific routes
4. Test onboarding flow end-to-end

### From Full to Minimal Architecture

1. Remove `requireOnboarding` props from routes
2. Onboarding will continue to work but won't enforce completion
3. Database schema can remain or be removed (handled gracefully)

## Summary

The onboarding system is designed to:
- ✅ Work with minimal architecture setups
- ✅ Never block core functionality
- ✅ Gracefully handle missing database schema
- ✅ Default to allowing access on errors
- ✅ Be completely optional unless explicitly enabled

This ensures onboarding enhances the user experience when available but never interferes with the minimum viable product architecture.

