# How to Access Individual Artifacts for Content Review

## Quick Start Guide

### Step 1: Ensure Internal Access
The review pages are **internal-only**. Access is automatically granted when:
- Running on `localhost` or `127.0.0.1`
- Running in development mode (`npm run dev`)
- Or set `VITE_ENABLE_INTERNAL_REVIEW=true` in production

### Step 2: Access the Review Hub
Navigate to: **`/preview-review`**

This is your central hub for reviewing all product previews.

### Step 3: Access Individual Artifacts

**Option A: From Review Hub**
1. On `/preview-review`, click **"View Individual Artifacts"** on any product card
2. You'll see all previews listed for that product
3. Click any preview to view it individually

**Option B: Direct URL**
Use this URL pattern:
```
/preview-artifact/:productId/:previewIndex
```

## Complete Product & Artifact Reference

### Privacy Toolkit Pro (`privacy-toolkit-pro`)

**All Previews**: `/preview-artifact/privacy-toolkit-pro`

**Individual Artifacts**:
1. **DPIA Generator Sample** (Index 0)
   - URL: `/preview-artifact/privacy-toolkit-pro/0`
   - Format: PDF
   - Content: Data Protection Impact Assessment template

2. **Privacy Policy Sample** (Index 1)
   - URL: `/preview-artifact/privacy-toolkit-pro/1`
   - Format: Word
   - Content: Privacy Policy template with GDPR/CCPA compliance

3. **Data Mapping Tool Interface** (Index 2)
   - URL: `/preview-artifact/privacy-toolkit-pro/2`
   - Format: Interactive
   - Content: Data flow mapping visualization

### GDPR Complete Kit (`gdpr-complete-kit`)

**All Previews**: `/preview-artifact/gdpr-complete-kit`

**Individual Artifacts**:
1. **GDPR Privacy Notice** (Index 0)
   - URL: `/preview-artifact/gdpr-complete-kit/0`
   - Format: PDF
   - Content: GDPR Article 13 compliant privacy notice

2. **Data Breach Notification Template** (Index 1)
   - URL: `/preview-artifact/gdpr-complete-kit/1`
   - Format: Word
   - Content: 72-hour breach notification template

3. **Data Subject Rights Request Manager** (Index 2)
   - URL: `/preview-artifact/gdpr-complete-kit/2`
   - Format: Interactive
   - Content: DSR request tracking interface

### Policy Template Library (`policy-template-library`)

**All Previews**: `/preview-artifact/policy-template-library`

**Individual Artifacts**:
1. **Website Privacy Policy** (Index 0)
   - URL: `/preview-artifact/policy-template-library/0`
   - Format: Word
   - Content: Comprehensive website privacy policy

2. **Cookie Policy Template** (Index 1)
   - URL: `/preview-artifact/policy-template-library/1`
   - Format: PDF
   - Content: Cookie policy with categories

3. **Terms of Service Template** (Index 2)
   - URL: `/preview-artifact/policy-template-library/2`
   - Format: Word
   - Content: Terms of service template

### Compliance Assessment Suite (`compliance-assessment-suite`)

**All Previews**: `/preview-artifact/compliance-assessment-suite`

**Individual Artifacts**:
1. **Gap Analysis Report Sample** (Index 0)
   - URL: `/preview-artifact/compliance-assessment-suite/0`
   - Format: PDF
   - Content: Privacy gap analysis with compliance percentages

2. **Compliance Roadmap Generator** (Index 1)
   - URL: `/preview-artifact/compliance-assessment-suite/1`
   - Format: Excel
   - Content: Prioritized compliance roadmap table

### Compliance Framework Templates (`compliance-toolkit`)

**All Previews**: `/preview-artifact/compliance-toolkit`

**Individual Artifacts**:
1. **Gap Analysis Worksheet** (Index 0)
   - URL: `/preview-artifact/compliance-toolkit/0`
   - Format: Excel
   - Content: NIST Privacy Framework gap analysis table

2. **Evidence Collection Checklist** (Index 1)
   - URL: `/preview-artifact/compliance-toolkit/1`
   - Format: PDF
   - Content: Evidence collection checklist items

## Navigation Features

### On Individual Artifact Pages

1. **Previous/Next Navigation**
   - Use buttons to move between artifacts
   - Dot indicators show current position
   - URL updates automatically

2. **Sidebar Preview List**
   - See all previews for the product
   - Click any preview to jump directly
   - Current preview is highlighted

3. **Export Functionality**
   - Click "Export" to download artifact metadata
   - JSON format for documentation

4. **Breadcrumb Navigation**
   - "Back to Review" returns to `/preview-review`
   - Easy navigation between pages

## Content Review Checklist

For each artifact, review:

### Content Accuracy
- [ ] Text matches actual product deliverables
- [ ] Format labels (PDF/Word/Excel) are correct
- [ ] Sample data is realistic
- [ ] No placeholder text or TODOs

### Visual Design
- [ ] Colors are appropriate and consistent
- [ ] Spacing and typography look good
- [ ] Layout is clean and professional
- [ ] Icons and badges are correct

### Dark Mode
- [ ] All text is readable in dark mode
- [ ] Colors have sufficient contrast
- [ ] Backgrounds adapt correctly
- [ ] Borders and dividers are visible

### Responsiveness
- [ ] Content displays well on mobile (375px)
- [ ] Content displays well on tablet (768px)
- [ ] Content displays well on desktop (1920px)
- [ ] Tables and grids adapt correctly

### Functionality
- [ ] Navigation works (Previous/Next)
- [ ] Dot indicators update correctly
- [ ] Export button works
- [ ] Links navigate properly

## Quick Access URLs

Copy these URLs for quick access during review:

```
# Privacy Toolkit Pro
http://localhost:5173/preview-artifact/privacy-toolkit-pro/0
http://localhost:5173/preview-artifact/privacy-toolkit-pro/1
http://localhost:5173/preview-artifact/privacy-toolkit-pro/2

# GDPR Complete Kit
http://localhost:5173/preview-artifact/gdpr-complete-kit/0
http://localhost:5173/preview-artifact/gdpr-complete-kit/1
http://localhost:5173/preview-artifact/gdpr-complete-kit/2

# Policy Template Library
http://localhost:5173/preview-artifact/policy-template-library/0
http://localhost:5173/preview-artifact/policy-template-library/1
http://localhost:5173/preview-artifact/policy-template-library/2

# Compliance Assessment Suite
http://localhost:5173/preview-artifact/compliance-assessment-suite/0
http://localhost:5173/preview-artifact/compliance-assessment-suite/1

# Compliance Framework Templates
http://localhost:5173/preview-artifact/compliance-toolkit/0
http://localhost:5173/preview-artifact/compliance-toolkit/1
```

## Troubleshooting

### "Access Restricted" Message
- **Solution**: Ensure you're running in development mode or on localhost
- **Check**: Verify `VITE_ENABLE_INTERNAL_REVIEW=true` if in production

### Preview Not Loading
- **Check**: Product ID is correct in URL
- **Check**: Preview index is within range (0 to preview count - 1)
- **Check**: Browser console for errors

### Navigation Not Working
- **Check**: URL parameters are correct
- **Check**: Product has previews defined
- **Refresh**: Page to reset state

### Content Not Displaying
- **Check**: Preview content is defined for that product
- **Check**: Browser console for React errors
- **Verify**: Product ID matches catalog

## Tips for Efficient Review

1. **Use Browser Bookmarks**: Bookmark frequently reviewed artifacts
2. **Open Multiple Tabs**: Review multiple artifacts side-by-side
3. **Use Export**: Export metadata for documentation
4. **Take Screenshots**: Capture visual issues for reference
5. **Use DevTools**: Inspect elements for styling issues

## File Locations for Editing

All preview content is in:
```
apps/framework-compliance/src/pages/PreviewArtifactViewer.tsx
```

Function: `generatePreviewsForProduct()` (starts around line 28)

Each product's previews are in separate `if` blocks:
- Privacy Toolkit Pro: ~line 31
- GDPR Complete Kit: ~line 139
- Policy Template Library: ~line 278
- Compliance Assessment Suite: ~line 384
- Compliance Framework Templates: ~line 495

---

**Last Updated**: 2025-12-20  
**Status**: ✅ Ready for Use

