# CyberCorrect Marketing Site

Unified marketing landing page for CyberCorrect privacy compliance solutions.

## Overview

This is the main marketing site that serves as the entry point for both:
- **Framework Compliance** - Enterprise privacy compliance platform
- **Privacy Portal** - Individual data subject rights portal

## Development

```bash
# Install dependencies (from root)
npm install

# Run development server
npm run dev:marketing

# Build for production
npm run build:marketing
```

The marketing site runs on port **5175** by default.

## Environment Variables

Create a `.env` file in the marketing site root:

```env
VITE_FRAMEWORK_COMPLIANCE_URL=https://www.platform.cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com
```

## Deployment

The marketing site should be deployed to the root domain (e.g., `www.cybercorrect.com`).

### Vercel Deployment

1. Create a new Vercel project for the marketing site
2. Set the root directory to `apps/marketing-site`
3. Set build command: `npm run build:marketing`
4. Set output directory: `dist/marketing-site`
5. Configure environment variables in Vercel dashboard

## Architecture

The marketing site provides:
- Unified branding and messaging
- Clear navigation to both products
- Feature highlights for each platform
- Cross-linking between all three sites

## Cross-Linking

All three sites (Marketing, Framework Compliance, Privacy Portal) are cross-linked:
- Marketing site → Both apps
- Framework Compliance → Marketing site & Privacy Portal
- Privacy Portal → Marketing site & Framework Compliance

