# UI/UX Naming and Terminology Consistency Audit

## Executive Summary
This document identifies naming and terminology inconsistencies across menu items, breadcrumbs, and page titles/headings that need standardization.

## Identified Inconsistencies

### 1. Navigation Menu Terminology

#### Issue: "Tools" vs "Toolkit"
- **Header.tsx** (line 102): Uses "Tools" as menu label
- **LandingLayout.tsx** (line 184): Uses "Toolkit" as menu label
- **Breadcrumbs.tsx** (line 58): Uses "Toolkit"
- **Toolkit.tsx** (line 29): Page title uses "Toolkit"
- **Toolkit.tsx** (line 274): Heading uses "Compliance Toolkit"

**Standardization Decision**: Use "Toolkit" consistently across all navigation elements.

---

### 2. Tool Name Inconsistencies in Header Menu

#### Issue: Multiple names for same tool, incomplete names
- **Header.tsx** (line 32): "Data Flow Mapper" → `/toolkit/gdpr-mapper`
- **Header.tsx** (line 34): "GDPR Mapper" → `/toolkit/gdpr-mapper` (duplicate path)
- **Header.tsx** (line 35): "Policy Generator" → `/toolkit/privacy-policy-generator` (incomplete name)
- **Breadcrumbs.tsx** (line 61): "GDPR Mapper"
- **Breadcrumbs.tsx** (line 60): "Privacy Policy Generator"
- **GdprMapper.tsx** (line 144): Heading "GDPR Data Processing Mapper"
- **PrivacyPolicyGenerator.tsx** (line 202): Heading "Privacy Policy Generator"

**Standardization Decision**: 
- Remove duplicate "Data Flow Mapper" entry
- Use full name "Privacy Policy Generator" instead of "Policy Generator"
- Standardize on "GDPR Mapper" (shorter, matches breadcrumb)

---

### 3. Assessment Menu Inconsistencies

#### Issue: Misplaced tool in assessment menu
- **Header.tsx** (line 28): "Data Governance Review" → `/toolkit/gdpr-mapper` (should be in Tools, not Assessments)

**Standardization Decision**: Remove "Data Governance Review" from Assessments menu (it's a toolkit tool).

---

### 4. Page Title vs Heading Inconsistencies

#### Issue: Page titles don't always match headings
- **Toolkit.tsx**: 
  - Page title: "Toolkit"
  - Heading: "Compliance Toolkit"
- **GdprMapper.tsx**: 
  - No `usePageTitle` hook
  - Heading: "GDPR Data Processing Mapper"
  - Breadcrumb: "GDPR Mapper"

**Standardization Decision**: 
- Align page titles with headings where appropriate
- Add missing `usePageTitle` hooks
- Use consistent naming between breadcrumbs and page headings

---

### 5. Breadcrumb Mapping Gaps

#### Issue: Some page headings not in breadcrumb map
- **GdprMapper.tsx**: Heading "GDPR Data Processing Mapper" but breadcrumb shows "GDPR Mapper"
- Need to verify all toolkit tools have breadcrumb mappings

**Standardization Decision**: Ensure all page headings have corresponding breadcrumb entries.

---

## Standardization Rules

1. **Navigation Menu Labels**:
   - Use "Toolkit" (not "Tools")
   - Use "Assessments" (not "Assessment Hub" in menu)

2. **Tool Names**:
   - Use full descriptive names: "Privacy Policy Generator" (not "Policy Generator")
   - Use consistent names across menu, breadcrumb, and page heading
   - Remove duplicate entries

3. **Page Titles**:
   - Use `usePageTitle` hook consistently
   - Match page titles with page headings where appropriate
   - Use shorter names for page titles, full names for headings

4. **Breadcrumbs**:
   - Match breadcrumb names with menu item names
   - Use user-friendly names (not technical paths)

---

## Files Requiring Updates

1. **src/components/layout/Header.tsx**
   - Change "Tools" to "Toolkit"
   - Remove duplicate "Data Flow Mapper"
   - Change "Policy Generator" to "Privacy Policy Generator"
   - Remove "Data Governance Review" from Assessments menu

2. **src/pages/Toolkit.tsx**
   - Align heading with page title (use "Toolkit" or "Compliance Toolkit" consistently)

3. **src/pages/tools-and-assessments/GdprMapper.tsx**
   - Add `usePageTitle` hook
   - Consider aligning heading with breadcrumb name

4. **src/components/ui/Breadcrumbs.tsx**
   - Verify all toolkit tools have entries
   - Ensure consistency with menu names

---

## Implementation Priority

1. **High Priority**: Fix Header menu inconsistencies (affects user navigation)
2. **Medium Priority**: Standardize page titles and headings
3. **Low Priority**: Breadcrumb mapping verification and updates

