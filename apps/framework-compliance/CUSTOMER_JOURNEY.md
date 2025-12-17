# Customer Journey Implementation

## Overview

This document describes the clear, guided customer journey implemented in CyberCorrect to help users understand exactly what steps to take from the moment they arrive on the platform.

## The 4-Step Journey

The customer journey has been designed around 4 clear, sequential steps:

### 1. **Assess** (15-20 minutes)
- **What**: Take the comprehensive privacy assessment
- **Where**: `/assessments/privacy-assessment`
- **Purpose**: Evaluate current privacy posture across GDPR, CCPA, NIST, and other frameworks
- **Outcome**: Personalized compliance score and gap identification

### 2. **Discover** (Instant)
- **What**: Get your personalized compliance journey
- **Where**: `/compliance`
- **Purpose**: Receive customized roadmap with prioritized actions based on specific gaps
- **Outcome**: Clear understanding of priority actions and role-specific guidance

### 3. **Act** (Ongoing)
- **What**: Use specialized compliance tools
- **Where**: `/toolkit`
- **Purpose**: Address gaps and build documentation using 20+ specialized tools
- **Outcome**: Created policies, DPIAs, processing records, and other compliance artifacts

### 4. **Maintain** (Continuous)
- **What**: Track progress and maintain compliance
- **Where**: `/dashboard/privacy`
- **Purpose**: Monitor compliance status, track progress, and generate audit-ready reports
- **Outcome**: Ongoing compliance visibility and stakeholder reporting

## Key Components

### 1. OnboardingFlow Component
**Location**: `src/components/onboarding/OnboardingFlow.tsx`

A full-screen modal that appears for first-time visitors, clearly explaining the 4-step journey with:
- Visual progress indicator
- Step-by-step cards showing what each phase involves
- Benefits and time estimates for each step
- Direct action buttons to start the journey
- Can be reopened anytime via "View Journey Guide" buttons

**Features**:
- Automatic display for first-time users (after 1.5 second delay)
- Stores visit state in localStorage
- Interactive step cards with hover effects
- Responsive design for all screen sizes
- Clear visual hierarchy with icons and colors

### 2. JourneyProgressTracker Component
**Location**: `src/components/onboarding/JourneyProgressTracker.tsx`

A persistent progress tracker that shows users where they are in their journey:
- Overall progress percentage
- Visual progress bars for each step
- Completed vs. remaining steps
- Recommended next actions
- Compact and full view modes

**Usage**:
```tsx
import JourneyProgressTracker from '@/components/onboarding/JourneyProgressTracker';

<JourneyProgressTracker 
  currentStepIndex={1}
  completedSteps={['assess']}
  compact={false}
  showNextAction={true}
/>
```

### 3. JourneyContext Provider
**Location**: `src/context/JourneyContext.tsx`

Global state management for journey progress:
- Tracks current step index
- Maintains list of completed steps
- Persists state to localStorage
- Provides hooks for updating journey status

**API**:
```tsx
const {
  currentStepIndex,        // Current step (0-3)
  completedSteps,          // Array of completed step keys
  hasCompletedAssessment,  // Boolean flag
  hasVisitedBefore,        // Boolean flag
  completeStep,            // Function to mark step complete
  setCurrentStep,          // Function to update current step
  resetJourney,            // Function to reset progress
  getProgress              // Function returning % complete
} = useJourney();
```

## Implementation Details

### First-Time User Experience

1. User lands on homepage (`/`)
2. After 1.5 seconds, OnboardingFlow modal appears
3. Modal shows clear 4-step journey with visual progression
4. User can either:
   - Click "Start Free Assessment" to begin immediately
   - Click "I'll Explore First" to close modal and browse
5. Visit is recorded in localStorage to prevent repeated displays

### Returning User Experience

1. User lands on homepage
2. No onboarding modal (already visited)
3. Journey progress is loaded from localStorage
4. Progress tracker shows on relevant pages
5. User can reopen journey guide via "View Journey Guide" button

### Progress Tracking

Journey progress is automatically tracked and persisted:
- Current step index stored in `localStorage`
- Completed steps array stored in `localStorage`
- Progress syncs across browser tabs
- Survives page refreshes and sessions

### Visual Design

The journey uses a consistent visual language:
- **Blue → Cyan**: Step 1 (Assess)
- **Purple → Pink**: Step 2 (Discover)
- **Green → Emerald**: Step 3 (Act)
- **Orange → Amber**: Step 4 (Maintain)

Each step has:
- Unique gradient background
- Consistent icon
- Duration estimate
- Clear action button
- Benefit list

## Integration Points

### Landing Page (`/`)
- Hero section with primary "Start Your Journey" CTA
- "View Journey Guide" button to open onboarding modal
- Full 4-step visual journey section with cards
- Pulsing animation on primary CTA for attention

### Compliance Page (`/compliance`)
- Journey progress tracker at top of page
- "View Journey Guide" button in hero
- Integration with role-based journeys
- Quick start tools section

### Assessment Page (Future)
When user completes assessment:
```tsx
const { completeStep } = useJourney();
// After assessment completion
completeStep('assess');
// This automatically advances to step 2
```

### Toolkit Pages (Future)
Track tool usage:
```tsx
const { completeStep } = useJourney();
// After using multiple tools
completeStep('tools');
// Advances to step 4
```

## localStorage Keys

The journey system uses these localStorage keys:
- `cybercorrect_visited`: Boolean flag for first visit
- `cybercorrect_journey_step`: Current step index (0-3)
- `cybercorrect_completed_steps`: JSON array of completed step keys
- `cybercorrect_assessment_completed`: Boolean flag for assessment completion

## Best Practices

### For Developers

1. **Always wrap new pages in JourneyProvider**
   The provider is already in App.tsx, so all pages have access

2. **Use the useJourney hook for progress tracking**
   ```tsx
   import { useJourney } from '@/context/JourneyContext';
   const { completeStep } = useJourney();
   ```

3. **Call completeStep at meaningful milestones**
   - After assessment completion
   - After creating first policy/DPIA
   - After viewing dashboard

4. **Show JourneyProgressTracker on key pages**
   - Compliance hub
   - Dashboard
   - Assessment results

### For UX/Design

1. **Keep the 4-step structure consistent**
   Don't add or remove steps without updating all components

2. **Maintain visual hierarchy**
   Current step should always be most prominent

3. **Provide clear CTAs**
   Every step card should have an actionable button

4. **Use the established color scheme**
   Stick to the gradient colors for consistency

## Future Enhancements

### Planned
- [ ] Confetti animation when completing assessment
- [ ] Achievement badges for journey milestones
- [ ] Email progress reports
- [ ] Team journey collaboration features
- [ ] Journey recommendations based on role
- [ ] Estimated time to completion
- [ ] Skip step functionality with warnings

### Under Consideration
- Journey gamification (points, levels)
- Social sharing of journey progress
- Journey templates for different industries
- Integration with compliance calendar
- Automated journey checkpoints

## Testing

To test the customer journey:

1. **First-time user flow**:
   - Clear all localStorage
   - Visit homepage
   - Verify onboarding modal appears
   - Complete assessment
   - Verify progress updates

2. **Returning user flow**:
   - With localStorage populated
   - Visit homepage
   - Verify no modal appears
   - Check progress persists

3. **Progress tracking**:
   - Complete steps manually
   - Refresh page
   - Verify progress persists
   - Open new tab
   - Verify progress syncs

## Troubleshooting

### Onboarding modal not showing
- Check localStorage for `cybercorrect_visited` key
- Clear localStorage and refresh
- Check browser console for errors

### Progress not persisting
- Verify localStorage is enabled in browser
- Check for localStorage quota errors
- Ensure JourneyProvider is wrapping App

### Progress not syncing across tabs
- localStorage updates should trigger storage events
- Check browser support for storage events
- May need to implement manual sync

## Support

For questions or issues with the customer journey implementation, contact the development team or file an issue in the project repository.

