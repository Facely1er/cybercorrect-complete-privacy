# Hybrid Marketing Architecture

## Overview

CyberCorrect now uses a **hybrid marketing approach** with three interconnected sites:

1. **Marketing Site** (`apps/marketing-site`) - Root domain (e.g., `www.cybercorrect.com`)
2. **Framework Compliance** (`apps/framework-compliance`) - Subdomain (e.g., `www.app.cybercorrect.com`)
3. **Privacy Portal** (`apps/privacy-portal`) - Subdomain (e.g., `www.portal.cybercorrect.com`)

## Architecture

```
┌─────────────────────────────────────┐
│   Marketing Site (Root Domain)      │
│   www.cybercorrect.com             │
│   - Unified branding                │
│   - Product overview                │
│   - Links to both apps              │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼──────┐  ┌─────▼──────┐
│ Framework   │  │ Privacy    │
│ Compliance  │  │ Portal     │
│ www.app.cyb│  │ www.portal.│
│             │  │            │
│ - B2B focus │  │ - B2C focus│
│ - Keep own  │  │ - Keep own │
│   landing   │  │   landing  │
└─────────────┘  └────────────┘
```

## Site Purposes

### Marketing Site (`/`)
- **Purpose**: Unified entry point and brand presence
- **Audience**: All visitors (organizations and individuals)
- **Content**: 
  - Product overview
  - Feature highlights
  - Clear CTAs to both apps
  - Company information

### Framework Compliance (`www.app.cybercorrect.com`)
- **Purpose**: Enterprise privacy compliance platform
- **Audience**: Organizations, DPOs, legal teams
- **Landing Page**: Product-focused, B2B oriented
- **Features**: Assessments, DPIAs, project management

### Privacy Portal (`www.portal.cybercorrect.com`)
- **Purpose**: Data subject rights portal
- **Audience**: Individuals exercising privacy rights
- **Landing Page**: User-focused, B2C oriented
- **Features**: Data rights requests, privacy dashboard

## Cross-Linking Strategy

All three sites are cross-linked in their footers:

### Marketing Site Footer
- Links to Framework Compliance
- Links to Privacy Portal
- Legal pages

### Framework Compliance Footer
- Links to Marketing Site
- Links to Privacy Portal
- Internal navigation

### Privacy Portal Footer
- Links to Marketing Site
- Links to Framework Compliance
- Internal navigation

## Development

### Running All Sites

```bash
# From root directory
npm install

# Run all three sites simultaneously
npm run dev:all

# Or run individually
npm run dev:marketing      # Port 5175
npm run dev:framework      # Port 5173
npm run dev:portal         # Port 5174
```

### Building

```bash
# Build all sites
npm run build:all

# Build individually
npm run build:marketing
npm run build:framework
npm run build:portal
```

## Environment Variables

### Marketing Site
Create `apps/marketing-site/.env`:
```env
VITE_FRAMEWORK_COMPLIANCE_URL=https://www.app.cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com
```

### Framework Compliance
Create `apps/framework-compliance/.env`:
```env
VITE_MARKETING_SITE_URL=https://www.cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com
```

### Privacy Portal
Create `apps/privacy-portal/.env`:
```env
VITE_MARKETING_SITE_URL=https://www.cybercorrect.com
VITE_FRAMEWORK_COMPLIANCE_URL=https://www.app.cybercorrect.com
```

## Deployment

### Marketing Site
- **Domain**: Root domain (`www.cybercorrect.com`)
- **Build**: `npm run build:marketing`
- **Output**: `dist/marketing-site/`
- **Config**: `apps/marketing-site/vercel.json`

### Framework Compliance
- **Domain**: Subdomain (`www.app.cybercorrect.com`)
- **Build**: `npm run build:framework`
- **Output**: `dist/framework-compliance/`
- **Config**: Root `vercel.json`

### Privacy Portal
- **Domain**: Subdomain (`www.portal.cybercorrect.com`)
- **Build**: `npm run build:portal`
- **Output**: `dist/privacy-portal/`
- **Config**: `apps/privacy-portal/vercel.json`

## Benefits

✅ **Unified Branding** - Marketing site provides consistent brand experience  
✅ **Independent Landing Pages** - Each app keeps its own focused landing page  
✅ **Clear User Journeys** - Users can easily navigate between products  
✅ **SEO Optimization** - Each site can be optimized for its specific audience  
✅ **Independent Deployment** - Each app deploys separately  
✅ **Scalability** - Easy to add more products or sites in the future

## Next Steps

1. **Install Dependencies**: Run `npm install` from root
2. **Set Environment Variables**: Configure URLs for each app
3. **Test Locally**: Run `npm run dev:all` to test all three sites
4. **Deploy**: Set up Vercel projects for each site with appropriate domains
5. **Update DNS**: Configure subdomains for Framework Compliance and Privacy Portal

## File Structure

```
cybercorrect-complete-privacy/
├── apps/
│   ├── marketing-site/          # NEW: Marketing site
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   └── MarketingLanding.tsx
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── vercel.json
│   ├── framework-compliance/    # Existing: Keep Landing.tsx
│   └── privacy-portal/          # Existing: Keep HomePage.tsx
├── package.json                 # Updated with marketing scripts
└── HYBRID_MARKETING_ARCHITECTURE.md
```

