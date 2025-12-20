# Preview Review Page - Access Guide

## Overview
A dedicated review page has been created to easily access and review all product preview content in one place. This makes content review, visual readiness checks, and QA testing much more efficient.

## Access the Review Page

### URL Routes
- **Primary**: `/preview-review`
- **Alternative**: `/preview-review` (absolute path)

### How to Access
1. **Direct URL**: Navigate to `http://localhost:5173/preview-review` (or your dev server URL)
2. **From Store Page**: Click "Back to Store" button (when implemented in navigation)
3. **Direct Link**: Add a link in your admin/developer menu

## Features

### 1. Product Grid View
- See all products at a glance
- Visual indicators for reviewed/unreviewed products
- Quick access to preview each product

### 2. Review Progress Tracking
- Progress bar showing review completion
- Checkmarks for reviewed products
- Real-time progress updates

### 3. Preview Modal Integration
- Click "Review Previews" to open the full preview modal
- Navigate through all previews for each product
- Same preview experience as customers see

### 4. Review Checklist
Built-in checklist reminders:
- ✅ Content Accuracy
- ✅ Visual Design
- ✅ Dark Mode Compatibility
- ✅ Responsiveness
- ✅ Navigation Functionality
- ✅ Format Labels

### 5. Export Reports
- **JSON Export**: Structured data for tracking
- **Text Export**: Human-readable report

## Usage Instructions

### Step 1: Start Development Server
```bash
cd apps/framework-compliance
npm run dev
```

### Step 2: Navigate to Review Page
Open browser to: `http://localhost:5173/preview-review`

### Step 3: Review Each Product
1. Click "Review Previews" button on any product card
2. Review all previews using Previous/Next navigation
3. Check:
   - Content accuracy
   - Visual design
   - Dark mode (toggle in your browser/dev tools)
   - Responsiveness (resize browser window)
4. Close modal - product is automatically marked as reviewed

### Step 4: Export Review Report
- Click "Export JSON Report" for structured data
- Click "Export Text Report" for human-readable format

## Review Checklist for Each Product

### Privacy Toolkit Pro
- [ ] DPIA Generator Sample - Check content, formatting, colors
- [ ] Privacy Policy Sample - Verify sections, compliance badges
- [ ] Data Mapping Tool Interface - Check visual flow diagram

### GDPR Complete Kit
- [ ] GDPR Privacy Notice - Verify Article 13 compliance indicators
- [ ] Data Breach Notification Template - Check incident details format
- [ ] Data Subject Rights Request Manager - Verify table layout and status badges

### Policy Template Library
- [ ] Website Privacy Policy - Check section structure
- [ ] Cookie Policy Template - Verify cookie category grid
- [ ] Terms of Service Template - Check section list

### Compliance Assessment Suite
- [ ] Gap Analysis Report Sample - Verify percentage displays and findings
- [ ] Compliance Roadmap Generator - Check table layout and priority badges

### Compliance Framework Templates
- [ ] Gap Analysis Worksheet - Verify table structure and status indicators
- [ ] Evidence Collection Checklist - Check checklist items and formatting

## Testing Checklist

### Visual Testing
- [ ] Light mode - All content readable and visually appealing
- [ ] Dark mode - All content readable and visually appealing
- [ ] Mobile view (375px width) - Modal is responsive
- [ ] Tablet view (768px width) - Layout adapts correctly
- [ ] Desktop view (1920px width) - Optimal layout

### Functional Testing
- [ ] Preview modal opens correctly
- [ ] Navigation between previews works (Previous/Next)
- [ ] Dot indicators show current preview
- [ ] Close button works
- [ ] "Add to Cart" button works (if testing from store)
- [ ] Progress tracking updates correctly
- [ ] Export functions work

### Content Review
- [ ] All text is accurate and matches product descriptions
- [ ] Format labels (PDF/Word/Excel) are correct
- [ ] Sample data is realistic and representative
- [ ] No placeholder text or "TODO" comments
- [ ] Compliance badges and indicators are accurate

## Quick Access Tips

### For Content Reviewers
1. Use the review page to systematically go through each product
2. Mark products as reviewed as you complete them
3. Export reports to track your progress
4. Test in both light and dark modes

### For Developers
1. Use the review page to verify preview content after changes
2. Test responsive design quickly
3. Export reports for documentation
4. Share review page URL with stakeholders

### For QA Testers
1. Use the review page as a test checklist
2. Verify all previews render correctly
3. Test navigation and interactions
4. Document issues found during review

## Troubleshooting

### Preview Modal Not Opening
- Check browser console for errors
- Verify ProductPreviewModal component is imported correctly
- Check that product data is loading

### Progress Not Saving
- Progress is stored in component state (resets on page refresh)
- For persistent tracking, implement localStorage or backend storage

### Export Not Working
- Check browser console for errors
- Verify browser allows file downloads
- Try different browser if issues persist

## Future Enhancements

Potential improvements:
- [ ] Persistent review tracking (localStorage or backend)
- [ ] Comments/notes for each product
- [ ] Screenshot capture functionality
- [ ] Comparison view (side-by-side products)
- [ ] Filter by review status
- [ ] Search functionality
- [ ] Admin-only access control

## Files Created

1. **`apps/framework-compliance/src/pages/PreviewReview.tsx`**
   - Main review page component
   - Product grid with review tracking
   - Export functionality

2. **`apps/framework-compliance/src/routes/monetizationRoutes.tsx`** (modified)
   - Added preview-review route

## Access Summary

**URL**: `/preview-review`  
**Purpose**: Content review and visual readiness checking  
**Audience**: Content reviewers, QA testers, developers  
**Status**: ✅ Ready to use

---

**Created**: 2025-02-05  
**Version**: 1.0.0

