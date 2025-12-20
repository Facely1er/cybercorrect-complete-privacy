# Individual Artifact Review Guide

## Overview
You can now review each preview artifact separately on dedicated pages. This allows for focused, detailed review of individual preview content without navigating through a modal.

## Access Methods

### Method 1: From Preview Review Page
1. Navigate to `/preview-review`
2. Click **"View Individual Artifacts"** button on any product card
3. You'll see all previews for that product listed
4. Click any preview to view it individually

### Method 2: Direct URL Access
Access individual artifacts directly via URL:

**Format**: `/preview-artifact/:productId/:previewIndex`

**Examples**:
- `/preview-artifact/privacy-toolkit-pro/0` - First preview (DPIA Sample)
- `/preview-artifact/privacy-toolkit-pro/1` - Second preview (Privacy Policy)
- `/preview-artifact/gdpr-complete-kit/0` - GDPR Privacy Notice
- `/preview-artifact/compliance-assessment-suite/1` - Compliance Roadmap

### Method 3: View All Previews for a Product
- `/preview-artifact/privacy-toolkit-pro` - Shows all previews for Privacy Toolkit Pro

## Product IDs and Preview Indexes

### Privacy Toolkit Pro (`privacy-toolkit-pro`)
- **Index 0**: DPIA Generator Sample (PDF)
- **Index 1**: Privacy Policy Sample (Word)
- **Index 2**: Data Mapping Tool Interface (Interactive)

### GDPR Complete Kit (`gdpr-complete-kit`)
- **Index 0**: GDPR Privacy Notice (PDF)
- **Index 1**: Data Breach Notification Template (Word)
- **Index 2**: Data Subject Rights Request Manager (Interactive)

### Policy Template Library (`policy-template-library`)
- **Index 0**: Website Privacy Policy (Word)
- **Index 1**: Cookie Policy Template (PDF)
- **Index 2**: Terms of Service Template (Word)

### Compliance Assessment Suite (`compliance-assessment-suite`)
- **Index 0**: Gap Analysis Report Sample (PDF)
- **Index 1**: Compliance Roadmap Generator (Excel)

### Compliance Framework Templates (`compliance-toolkit`)
- **Index 0**: Gap Analysis Worksheet (Excel)
- **Index 1**: Evidence Collection Checklist (PDF)

## Features

### Individual Artifact Page
- **Focused View**: One artifact per page for detailed review
- **Navigation**: Previous/Next buttons to move between artifacts
- **Dot Indicators**: Visual navigation between all previews
- **Export**: Export individual artifact metadata as JSON
- **All Previews List**: Sidebar showing all previews for the product
- **Direct Links**: Click any preview in the list to jump to it

### Review Capabilities
- **Full Screen Focus**: No modal overlay, full page view
- **URL Sharing**: Share specific artifact URLs for review
- **Bookmarking**: Bookmark specific artifacts for later review
- **Export**: Export artifact information for documentation

## Usage Workflow

### For Content Reviewers

1. **Start at Review Page**
   ```
   /preview-review
   ```

2. **Select a Product**
   - Click "View Individual Artifacts" on any product

3. **Review Each Artifact**
   - Navigate through previews using Previous/Next
   - Or click directly on previews in the sidebar
   - Review content, visuals, formatting

4. **Export if Needed**
   - Click "Export" to save artifact metadata
   - Use for documentation or tracking

### For QA Testers

1. **Test Individual URLs**
   - Access each artifact via direct URL
   - Verify routing works correctly
   - Test navigation between artifacts

2. **Test Responsive Design**
   - Resize browser window
   - Test on mobile/tablet/desktop
   - Verify layout adapts correctly

3. **Test Dark Mode**
   - Toggle dark mode
   - Verify all content is readable
   - Check color contrast

## URL Structure

```
/preview-artifact/:productId/:previewIndex
```

- `productId`: The product identifier (e.g., `privacy-toolkit-pro`)
- `previewIndex`: Optional, zero-based index of the preview (0, 1, 2, etc.)

If `previewIndex` is omitted, shows the first preview (index 0).

## Quick Access Links

### Privacy Toolkit Pro
- [DPIA Sample](http://localhost:5173/preview-artifact/privacy-toolkit-pro/0)
- [Privacy Policy](http://localhost:5173/preview-artifact/privacy-toolkit-pro/1)
- [Data Mapping](http://localhost:5173/preview-artifact/privacy-toolkit-pro/2)

### GDPR Complete Kit
- [Privacy Notice](http://localhost:5173/preview-artifact/gdpr-complete-kit/0)
- [Breach Notification](http://localhost:5173/preview-artifact/gdpr-complete-kit/1)
- [DSR Manager](http://localhost:5173/preview-artifact/gdpr-complete-kit/2)

### Policy Template Library
- [Website Privacy Policy](http://localhost:5173/preview-artifact/policy-template-library/0)
- [Cookie Policy](http://localhost:5173/preview-artifact/policy-template-library/1)
- [Terms of Service](http://localhost:5173/preview-artifact/policy-template-library/2)

### Compliance Assessment Suite
- [Gap Analysis](http://localhost:5173/preview-artifact/compliance-assessment-suite/0)
- [Roadmap](http://localhost:5173/preview-artifact/compliance-assessment-suite/1)

### Compliance Framework Templates
- [Gap Analysis Worksheet](http://localhost:5173/preview-artifact/compliance-toolkit/0)
- [Evidence Checklist](http://localhost:5173/preview-artifact/compliance-toolkit/1)

## Benefits

### Individual Review
- ✅ Focus on one artifact at a time
- ✅ No modal distractions
- ✅ Full page real estate for content
- ✅ Better for detailed content review

### URL-Based Access
- ✅ Share specific artifacts via URL
- ✅ Bookmark for quick access
- ✅ Direct linking in documentation
- ✅ Better for QA testing

### Navigation
- ✅ Easy movement between artifacts
- ✅ Visual indicators of current position
- ✅ Quick access to all previews
- ✅ Sidebar preview list

## Export Functionality

Click the "Export" button to download artifact metadata as JSON:

```json
{
  "product": {
    "id": "privacy-toolkit-pro",
    "name": "Privacy Toolkit Pro"
  },
  "preview": {
    "id": "dpia-sample",
    "title": "DPIA Generator Sample",
    "type": "template",
    "format": "PDF"
  },
  "exportedAt": "2025-12-20T..."
}
```

## Files Created

1. **`apps/framework-compliance/src/pages/PreviewArtifactViewer.tsx`**
   - Individual artifact viewer component
   - Navigation between artifacts
   - Export functionality

2. **Routes Updated**: `apps/framework-compliance/src/routes/monetizationRoutes.tsx`
   - Added `/preview-artifact/:productId` route
   - Added `/preview-artifact/:productId/:previewIndex` route

3. **PreviewReview Updated**: Added "View Individual Artifacts" button

## Tips

1. **Use Browser Bookmarks**: Bookmark frequently reviewed artifacts
2. **Share URLs**: Share specific artifact URLs with team members
3. **Use Export**: Export artifact metadata for documentation
4. **Test Navigation**: Verify Previous/Next works correctly
5. **Check Responsive**: Test on different screen sizes

---

**Created**: 2025-12-20  
**Version**: 1.0.0

