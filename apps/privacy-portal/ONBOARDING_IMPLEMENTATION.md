# Onboarding Implementation - CyberCorrect Privacy Portal

## Overview

This document describes the onboarding flow implementation for the CyberCorrect Privacy Portal, following the common onboarding flow established for all ERMITS products.

## Components Created

### 1. OnboardingService (`src/services/onboardingService.ts`)

Core service layer that handles:
- Initializing onboarding for new users
- Tracking onboarding progress
- Marking onboarding as completed
- Checking completion status
- Updating profile data during onboarding

**Key Methods:**
- `completeOnboarding(userId)` - Initialize onboarding
- `markOnboardingCompleted(userId)` - Mark as complete
- `isOnboardingCompleted(userId)` - Check status
- `getOnboardingProgress(userId)` - Get progress with checklist items
- `updateOnboardingProfile(userId, profileData)` - Update profile data

### 2. OnboardingPage (`src/pages/OnboardingPage.tsx`)

Main orchestrator component that:
- Shows welcome screen first
- Transitions to checklist
- Handles completion
- Redirects to dashboard when done

**Features:**
- Multi-step welcome flow
- Checklist-based onboarding
- Auto-completion detection
- Skip option available

### 3. WelcomeScreen (`src/components/onboarding/WelcomeScreen.tsx`)

Phase 3 component that:
- Welcomes new users
- Collects profile data (role, organization size, industry)
- Shows product features
- Provides quick action links

**Steps:**
1. Welcome & Product Overview
2. Role & Organization Data Collection
3. Get Started Actions

### 4. OnboardingChecklist (`src/components/onboarding/OnboardingChecklist.tsx`)

Phase 4 component that:
- Shows checklist of required actions
- Auto-detects completion
- Tracks progress
- Auto-completes onboarding when all items done

**Checklist Items:**
1. Create Your Data Inventory
2. Run Compliance Assessment
3. Set Up Data Rights Portal
4. Explore Your Dashboard

### 5. useOnboarding Hook (`src/hooks/useOnboarding.ts`)

Custom hook for managing onboarding state:
- `isLoading` - Loading state
- `isCompleted` - Completion status
- `progress` - Progress data with checklist items
- `refreshProgress()` - Refresh progress
- `markComplete()` - Manually mark complete

### 6. OnboardingGuard (`src/components/onboarding/OnboardingGuard.tsx`)

Component to protect routes requiring onboarding:
- Checks onboarding status
- Redirects to onboarding if not completed
- Shows loading state while checking

## Database Schema

The onboarding flow requires these fields in the `profiles` table:

```sql
onboarding_started BOOLEAN DEFAULT false
onboarding_started_at TIMESTAMP
onboarding_completed BOOLEAN DEFAULT false
onboarding_completed_at TIMESTAMP
is_first_login BOOLEAN DEFAULT true
```

## Routing

### Onboarding Route

```tsx
<Route path="/onboarding" element={
  <ProtectedRoute>
    <OnboardingPage />
  </ProtectedRoute>
} />
```

### Protected Routes with Onboarding

Routes that require onboarding completion can use:

```tsx
<Route path="/privacy/dashboard" element={
  <ProtectedRoute requireOnboarding={true}>
    <PrivacyDashboardPage />
  </ProtectedRoute>
} />
```

Or use the OnboardingGuard component:

```tsx
<Route path="/privacy/dashboard" element={
  <ProtectedRoute>
    <OnboardingGuard>
      <PrivacyDashboardPage />
    </OnboardingGuard>
  </ProtectedRoute>
} />
```

## Flow

1. **User Registration** → Account created
2. **First Login** → Redirected to `/onboarding`
3. **Welcome Screen** → User sees welcome, provides profile data
4. **Checklist** → User completes checklist items
5. **Auto-Completion** → When all items done, onboarding marked complete
6. **Dashboard** → User redirected to main dashboard

## Usage Examples

### Check Onboarding Status

```tsx
import { useOnboarding } from '../hooks/useOnboarding';

function MyComponent() {
  const { isLoading, isCompleted, progress } = useOnboarding();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isCompleted) return <Navigate to="/onboarding" />;
  
  return <div>Content</div>;
}
```

### Manually Complete Onboarding

```tsx
import { useOnboarding } from '../hooks/useOnboarding';

function MyComponent() {
  const { markComplete } = useOnboarding();
  
  const handleComplete = async () => {
    await markComplete();
    // Onboarding is now complete
  };
  
  return <button onClick={handleComplete}>Complete Onboarding</button>;
}
```

### Update Profile During Onboarding

```tsx
import { OnboardingService } from '../services/onboardingService';

await OnboardingService.updateOnboardingProfile(userId, {
  role: 'privacy_officer',
  organization_size: 'medium',
  industry: 'education'
});
```

## Customization

### Modify Checklist Items

Edit `OnboardingChecklist.tsx` to change checklist items:

```tsx
const [checklist, setChecklist] = useState<ChecklistItem[]>([
  {
    id: 'your-item-id',
    title: 'Your Item Title',
    description: 'Description',
    route: '/your-route',
    completed: false,
  },
  // Add more items...
]);
```

### Modify Welcome Steps

Edit `WelcomeScreen.tsx` to change welcome flow steps.

### Modify Progress Detection

Edit `OnboardingService.getOnboardingProgress()` to change how completion is detected.

## Testing

### Test Onboarding Flow

1. Register a new user
2. Login with new user
3. Should be redirected to `/onboarding`
4. Complete welcome screen
5. Complete checklist items
6. Should be redirected to dashboard

### Test Skip Functionality

1. Go to `/onboarding`
2. Click "Skip Tour" or "Skip onboarding"
3. Should mark onboarding as complete
4. Should redirect to dashboard

### Test Completion Detection

1. Complete checklist items manually (via UI)
2. Onboarding should auto-complete
3. Should redirect to dashboard

## Integration with Existing Features

The onboarding flow integrates with:
- **Persona Selection** - Can be done after onboarding
- **Privacy Portal** - Main destination after onboarding
- **Profile Management** - Profile data collected during onboarding
- **Authentication** - Works with existing auth system

## Future Enhancements

Potential improvements:
- Add onboarding tour/tutorial
- Add video tutorials
- Add interactive demos
- Add progress persistence
- Add onboarding analytics
- Add A/B testing for different flows

## Related Documentation

- `COMMON_ONBOARDING_FLOW.md` - Common onboarding flow documentation
- `ONBOARDING_QUICK_REFERENCE.md` - Quick reference guide
- `ONBOARDING_IMPLEMENTATION_TEMPLATE.md` - Implementation template

---

**Last Updated**: November 2025

