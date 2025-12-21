# Artifact Documents Access Guide

## Overview

Full artifact documents are now available as dedicated pages with complete content, PDF export capabilities, and detailed documentation. These pages are separate from the preview modals and provide comprehensive access to all artifact content.

## Access Routes

### Main Index Page
- **Route:** `/artifacts` or `/store/artifacts`
- **Page:** `ArtifactsIndex.tsx`
- **Description:** Central hub listing all available artifact documents organized by product category

### Individual Artifact Pages

#### Privacy Toolkit Pro
1. **DPIA Generator Sample**
   - **Route:** `/artifacts/dpia-generator` or `/store/artifacts/dpia-generator`
   - **Page:** `DpiaGeneratorArtifact.tsx`
   - **Content:** Complete Data Protection Impact Assessment with:
     - Executive summary
     - Processing activity description
     - Data categories and subjects
     - Risk assessment
     - Mitigation measures
     - Consultation and approval tracking
   - **Export:** PDF export available

#### GDPR Complete Kit
2. **Data Breach Notification Template**
   - **Route:** `/artifacts/breach-notification` or `/store/artifacts/breach-notification`
   - **Page:** `BreachNotificationArtifact.tsx`
   - **Content:** Complete GDPR Article 33/34 breach notification with:
     - Incident overview
     - Nature of breach
     - Immediate response actions
     - Risk assessment
     - Notification details
     - Remediation measures
     - Compliance checklist
   - **Export:** PDF export available

3. **Data Subject Rights Request Manager**
   - **Route:** `/artifacts/dsr-manager` (to be created)
   - **Content:** Interactive DSR management interface

#### Compliance Assessment Suite
4. **Gap Analysis Report Sample**
   - **Route:** `/artifacts/gap-analysis-report` (to be created)
   - **Content:** Comprehensive privacy gap analysis

5. **Compliance Roadmap Generator**
   - **Route:** `/artifacts/compliance-roadmap` (to be created)
   - **Content:** Risk-based compliance roadmap

#### Compliance Framework Templates
6. **Gap Analysis Worksheet**
   - **Route:** `/artifacts/gap-analysis-worksheet` (to be created)
   - **Content:** Multi-framework gap analysis worksheets

7. **Evidence Collection Checklist**
   - **Route:** `/artifacts/evidence-checklist` (to be created)
   - **Content:** Framework-specific evidence collection checklists

## Features

### All Artifact Pages Include:
- ✅ Full content (not just previews)
- ✅ PDF export functionality
- ✅ Back navigation
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Detailed sections and subsections
- ✅ Compliance checklists
- ✅ Best practices and guidance

### Navigation
- Access from main index: `/artifacts`
- Direct links to individual artifacts
- Back button to return to previous page
- Links from preview modals (can be added)

## File Structure

```
apps/framework-compliance/src/pages/artifacts/
├── ArtifactsIndex.tsx              # Main index page
├── DpiaGeneratorArtifact.tsx        # DPIA Generator (Complete)
├── BreachNotificationArtifact.tsx  # Breach Notification (Complete)
├── DsrManagerArtifact.tsx          # DSR Manager (To be created)
├── GapAnalysisReportArtifact.tsx   # Gap Analysis Report (To be created)
├── ComplianceRoadmapArtifact.tsx   # Compliance Roadmap (To be created)
├── GapAnalysisWorksheetArtifact.tsx # Gap Analysis Worksheet (To be created)
└── EvidenceChecklistArtifact.tsx   # Evidence Checklist (To be created)
```

## Routes Configuration

Routes are configured in `apps/framework-compliance/src/routes/monetizationRoutes.tsx`:

```typescript
{
  path: 'artifacts',
  element: ArtifactsIndex,
  lazy: true,
},
{
  path: 'artifacts/dpia-generator',
  element: DpiaGeneratorArtifact,
  lazy: true,
},
{
  path: 'artifacts/breach-notification',
  element: BreachNotificationArtifact,
  lazy: true,
},
// Additional routes to be added...
```

## Usage

1. **Access Main Index:**
   - Navigate to `/artifacts` or `/store/artifacts`
   - Browse artifacts by category
   - Click "View Full Document" to access individual artifacts

2. **View Individual Artifacts:**
   - Direct navigation via URL
   - From index page links
   - Export to PDF using the "Export PDF" button

3. **Export Documents:**
   - Click "Export PDF" button on any artifact page
   - PDF includes all content with proper formatting
   - Includes metadata and timestamps

## Status

### Completed ✅
- ArtifactsIndex page
- DpiaGeneratorArtifact page
- BreachNotificationArtifact page
- Routes configuration

### To Be Created
- DsrManagerArtifact page
- GapAnalysisReportArtifact page
- ComplianceRoadmapArtifact page
- GapAnalysisWorksheetArtifact page
- EvidenceChecklistArtifact page

## Notes

- Artifact pages are separate from preview modals
- Full content is available (not just samples)
- Corporate policies (Privacy, ToS, Cookie, AUP) remain as simple previews
- All artifact pages support PDF export
- Pages are accessible without authentication (can be restricted if needed)

## Next Steps

1. Create remaining artifact pages
2. Add links from preview modals to artifact pages
3. Add navigation breadcrumbs
4. Consider adding search/filter functionality to index page
5. Add print-friendly CSS for better PDF export

---

**Last Updated:** December 20, 2025

