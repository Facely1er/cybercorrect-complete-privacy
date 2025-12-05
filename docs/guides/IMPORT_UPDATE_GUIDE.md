# Import Path Update Guide

## Utils Reorganization Complete ✅

All utility files have been moved to categorized subfolders. Update imports as follows:

### Import Path Changes

| Old Path | New Path |
|----------|----------|
| `utils/cn` | `utils/common` |
| `utils/logger` | `utils/common` |
| `utils/lazyWithRetry` | `utils/common` |
| `utils/performance` | `utils/common` |
| `utils/secureStorage` | `utils/storage` |
| `utils/storageAdapter` | `utils/storage` |
| `utils/formValidation` | `utils/validation` |
| `utils/generatePdf` | `utils/pdf` |
| `utils/generateSSPPdf` | `utils/pdf` |
| `utils/generateEvidencePdf` | `utils/pdf` |
| `utils/generateExportPdf` | `utils/pdf` |
| `utils/generateGdprMappingPdf` | `utils/pdf` |
| `utils/generatePrivacyGapAnalysisPdf` | `utils/pdf` |
| `utils/html2canvasPdf` | `utils/pdf` |
| `utils/generateWord` | `utils/pdf` |
| `utils/monetization` | `utils/monetization` (unchanged) |
| `utils/oneTimeProducts` | `utils/monetization` |
| `utils/subscriptionProducts` | `utils/monetization` |
| `utils/unifiedProductCatalog` | `utils/monetization` |
| `utils/reportService` | `utils/reporting` |
| `utils/advancedReporting` | `utils/reporting` |
| `utils/exportTest` | `utils/reporting` |
| `utils/complianceHealthMonitor` | `utils/compliance` |
| `utils/deadlineChecker` | `utils/compliance` |
| `utils/localReminderService` | `utils/compliance` |
| `utils/predictiveAnalytics` | `utils/compliance` |
| `utils/regulatoryIntelligence` | `utils/compliance` |
| `utils/alertService` | `utils/compliance` |
| `utils/notificationService` | `utils/compliance` |

### Files Already Updated ✅

- `src/App.tsx`
- `src/main.tsx`
- `src/routes/projectRoutes.tsx`
- `src/routes/assessmentRoutes.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Textarea.tsx`
- `src/components/ui/Select.tsx`
- `src/components/ui/Button.tsx`
- `src/services/subscriptionService.ts`
- `src/services/oneTimeCheckoutService.ts`
- `src/pages/tools-and-assessments/SspGenerator.tsx`
- `src/pages/tools-and-assessments/GdprMapper.tsx`
- `src/pages/tools-and-assessments/PrivacyGapAnalyzer.tsx`
- `src/pages/project/EvidenceVault.tsx`

### Remaining Files to Update

Run this command to find remaining files:
```bash
grep -r "from.*utils/\(cn\|logger\|secureStorage\|generatePdf\|formValidation\|monetization\|reportService\|complianceHealthMonitor\|alertService\|notificationService\)" src/
```

### Quick Fix Script

You can use find-and-replace in your IDE:
1. Find: `from '../../utils/cn'`
2. Replace: `from '../../utils/common'`

Repeat for each import pattern above.

