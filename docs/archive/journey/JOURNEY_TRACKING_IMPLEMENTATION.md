# Journey Tracking Implementation - Tool Pages

## Overview
This document tracks the implementation of journey tracking across all tool pages using the `useJourneyTool` hook.

## Implementation Status

### ✅ Already Implemented (2 tools)
1. **GdprMapper** - ✅ Complete
2. **PrivacyRightsManager** - ✅ Complete

### ✅ Just Implemented (3 tools)
3. **PrivacyGapAnalyzer** - ✅ Added `useJourneyTool('privacy-gap-analyzer')`
4. **VendorRiskAssessment** - ✅ Added `useJourneyTool('vendor-risk-assessment')`  
5. **PrivacyByDesignAssessment** - Pending

### 📋 Tool Pages Requiring Implementation

#### High Priority (Core Compliance Tools)
6. **DpiaGenerator** - Add `useJourneyTool('dpia-generator')`
7. **DpiaManager** - Add `useJourneyTool('dpia-manager')`
8. **PiiDataFlowMapper** - Add `useJourneyTool('pii-data-flow-mapper')`
9. **ConsentManagement** - Add `useJourneyTool('consent-management')`
10. **RetentionPolicyGenerator** - Add `useJourneyTool('retention-policy-generator')`

#### Medium Priority (Operational Tools)
11. **IncidentResponseManager** - Add `useJourneyTool('incident-response-manager')`
12. **PrivacyMaintenanceScheduler** - Add `useJourneyTool('privacy-maintenance-scheduler')`
13. **PrivacySettingsAudit** - Add `useJourneyTool('privacy-settings-audit')`
14. **PrivacyPolicyGenerator** - Add `useJourneyTool('privacy-policy-generator')`
15. **DataClassificationAssessment** - Add `useJourneyTool('data-classification-tool')`

#### Lower Priority (Supporting Tools)
16. **DataBrokerRemovalManager** - Add `useJourneyTool('data-broker-removal-tool')`
17. **EmployeeDigitalFootprintAssessment** - Add `useJourneyTool('digital-footprint-audit')`
18. **ServiceProviderManager** - Add `useJourneyTool('service-provider-manager')`
19. **DataFlowMapper** - Add `useJourneyTool('data-flow-mapper')`

## Implementation Pattern

### Step 1: Add Import
```typescript
import { useJourneyTool } from '../../hooks/useJourneyTool';
// OR
import { useJourneyTool } from '@/hooks/useJourneyTool';
```

### Step 2: Call Hook in Component
```typescript
const ToolName = () => {
  useJourneyTool('tool-id-here'); // Call at top of component
  
  // ... rest of component logic
};
```

### Step 3: Optional - Mark as Completed
If the tool has a clear completion action (e.g., form submission):
```typescript
const ToolName = () => {
  const { markCompleted } = useJourneyTool('tool-id-here');
  
  const handleSave = async () => {
    // ... save logic
    await saveData();
    markCompleted(); // Mark tool as completed in journey
    toast.success('Saved!');
  };
};
```

## Tool ID Mapping

| Tool Page File | Tool ID |
|---------------|---------|
| PrivacyGapAnalyzer.tsx | `privacy-gap-analyzer` |
| VendorRiskAssessment.tsx | `vendor-risk-assessment` |
| GdprMapper.tsx | `gdpr-mapper` |
| PrivacyRightsManager.tsx | `privacy-rights-manager` |
| DpiaGenerator.tsx | `dpia-generator` |
| DpiaManager.tsx | `dpia-manager` |
| PiiDataFlowMapper.tsx | `pii-data-flow-mapper` |
| ConsentManagement.tsx | `consent-management` |
| RetentionPolicyGenerator.tsx | `retention-policy-generator` |
| IncidentResponseManager.tsx | `incident-response-manager` |
| PrivacyMaintenanceScheduler.tsx | `privacy-maintenance-scheduler` |
| PrivacySettingsAudit.tsx | `privacy-settings-audit` |
| PrivacyPolicyGenerator.tsx | `privacy-policy-generator` |
| PrivacyByDesignAssessment.tsx | `privacy-by-design-assessment` |
| DataClassificationAssessment.tsx | `data-classification-tool` |
| DataBrokerRemovalManager.tsx | `data-broker-removal-tool` |
| EmployeeDigitalFootprintAssessment.tsx | `digital-footprint-audit` |
| ServiceProviderManager.tsx | `service-provider-manager` |
| DataFlowMapper.tsx | `data-flow-mapper` |

## Benefits of Implementation

1. **Automatic Journey Tracking** - Tools are automatically marked as "started" when users access them
2. **Gap Linkage** - Tool usage is linked to compliance gaps for automatic closure
3. **Progress Visibility** - Users see their journey progress update in real-time
4. **Completion Tracking** - Optional manual marking when tools have clear completion points
5. **Analytics Data** - Provides data on which tools users actually use

## Notes for Developers

- **Non-intrusive**: The hook automatically handles tracking without requiring changes to existing logic
- **Backward Compatible**: Tools work perfectly fine without calling `markCompleted()` 
- **Lightweight**: No performance impact, just a single `useEffect` call
- **Type-safe**: Full TypeScript support with proper tool ID validation

## Testing Checklist

When implementing for each tool:
- [ ] Verify import path is correct
- [ ] Tool ID matches the ID in `customerJourneyConfig.ts`
- [ ] Hook is called at component top level (not conditionally)
- [ ] Test that tool shows in journey progress when accessed
- [ ] (Optional) Test `markCompleted()` if implemented

## Future Enhancements

1. **Auto-detection**: Could automatically detect tool IDs from route paths
2. **Session Tracking**: Track time spent in each tool
3. **Abandonment Alerts**: Notify users if they start but don't complete critical tools
4. **Completion Suggestions**: Suggest related tools after completing one

---

*Last Updated: December 17, 2025*

