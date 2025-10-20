# Broken Links Report

## Critical Issues Found

### 1. **Wrong GDPR Guide Path**
**Broken**: `/documentation/gdpr-guide`  
**Correct**: `/documentation/gdpr-implementation-guide`  
**Locations**:
- `src/pages/Landing.tsx`
- `src/pages/tools-and-assessments/GdprMapper.tsx`
- `src/pages/roles/PrivacyOfficerJourney.tsx` (multiple instances)
- `src/pages/resources/Documentation.tsx` (multiple instances)
- `src/pages/ResourcesLanding.tsx`
- `src/components/ui/InternalLinkingHelper.tsx`

### 2. **Non-existent Security Assessment Routes** (Not privacy-focused)
**Broken**: `/assessments/security-assessment`  
**Issue**: This route doesn't exist and shouldn't (platform is privacy-focused)  
**Locations**:
- `src/pages/Features.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/chat/ChatGuideBot.tsx` (multiple instances)

### 3. **Non-existent CUI Routes** (Government security, not privacy)
**Broken**: 
- `/cui-assessment`
- `/assessments/cui-assessment`
- `/cui-recommendations`

**Issue**: CUI (Controlled Unclassified Information) is government security-related, not privacy  
**Locations**:
- `src/pages/resources/Support.tsx`
- `src/pages/tools-and-assessments/PoamGenerator.tsx`
- `src/pages/tools-and-assessments/CuiResults.tsx`
- `src/pages/ResourcesLanding.tsx`
- `src/pages/Features.tsx` (multiple instances)
- `src/components/ui/Breadcrumbs.tsx`
- `src/components/chat/ChatGuideBot.tsx` (multiple instances)

### 4. **Non-existent Privacy Framework Guide**
**Broken**: `/documentation/privacy-framework-guide`  
**Locations**:
- `src/pages/roles/LegalCounselJourney.tsx`
- `src/pages/roles/DataStewardJourney.tsx`

### 5. **Wrong Compliance Gap Analyzer Path**
**Broken**: `/toolkit/compliance-gap-analyzer`  
**Correct**: `/toolkit/privacy-gap-analyzer`  
**Location**: `src/components/ui/InternalLinkingHelper.tsx`

### 6. **Non-existent CMMC Route** (Security, not privacy)
**Broken**: `/cmmc-quick-check`  
**Location**: `src/components/chat/ChatGuideBot.tsx`

### 7. **Non-existent Documentation Routes**
**Broken**:
- `/documentation/security-framework-guide`
- `/documentation/cui-handling-guide`

**Locations**: `src/components/chat/ChatGuideBot.tsx`

## Recommended Fixes

### Immediate Actions:
1. Replace all `/documentation/gdpr-guide` with `/documentation/gdpr-implementation-guide`
2. Remove or replace all security assessment references with privacy assessment
3. Remove all CUI-related routes (not privacy-focused)
4. Create `/documentation/privacy-framework-guide` or redirect to existing guide
5. Fix compliance gap analyzer path
6. Remove CMMC references (not privacy-focused)

### Files Requiring Updates:
- [ ] `src/pages/Landing.tsx`
- [ ] `src/pages/Features.tsx`
- [ ] `src/pages/tools-and-assessments/GdprMapper.tsx`
- [ ] `src/pages/tools-and-assessments/PoamGenerator.tsx`
- [ ] `src/pages/resources/Support.tsx`
- [ ] `src/pages/resources/Documentation.tsx`
- [ ] `src/pages/ResourcesLanding.tsx`
- [ ] `src/pages/roles/PrivacyOfficerJourney.tsx`
- [ ] `src/pages/roles/LegalCounselJourney.tsx`
- [ ] `src/pages/roles/DataStewardJourney.tsx`
- [ ] `src/components/layout/Header.tsx`
- [ ] `src/components/layout/Footer.tsx`
- [ ] `src/components/ui/InternalLinkingHelper.tsx`
- [ ] `src/components/ui/Breadcrumbs.tsx`
- [ ] `src/components/chat/ChatGuideBot.tsx`

