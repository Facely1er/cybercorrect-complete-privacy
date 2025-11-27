# Setup Guide - Hybrid Marketing Architecture

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment Files

**Option A: Use the setup script**
```bash
node scripts/setup-env-files.js
```

**Option B: Create manually**

Create `apps/marketing-site/.env`:
```env
VITE_FRAMEWORK_COMPLIANCE_URL=https://www.app.cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com
```

Create `apps/framework-compliance/.env` (or add to existing):
```env
VITE_MARKETING_SITE_URL=https://www.cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com
```

Create `apps/privacy-portal/.env` (or add to existing):
```env
VITE_MARKETING_SITE_URL=https://www.cybercorrect.com
VITE_FRAMEWORK_COMPLIANCE_URL=https://www.app.cybercorrect.com
```

### 3. Test Locally

Run all three sites:
```bash
npm run dev:all
```

Or run individually:
```bash
npm run dev:marketing      # http://localhost:5175
npm run dev:framework      # http://localhost:5173
npm run dev:portal         # http://localhost:5174
```

### 4. Build for Production

Build all sites:
```bash
npm run build:all
```

Or build individually:
```bash
npm run build:marketing
npm run build:framework
npm run build:portal
```

## Environment Variables Reference

### Marketing Site (`apps/marketing-site/.env`)
- `VITE_FRAMEWORK_COMPLIANCE_URL` - URL to Framework Compliance app
- `VITE_PRIVACY_PORTAL_URL` - URL to Privacy Portal app

### Framework Compliance (`apps/framework-compliance/.env`)
- `VITE_MARKETING_SITE_URL` - URL to Marketing Site (root domain)
- `VITE_PRIVACY_PORTAL_URL` - URL to Privacy Portal app

### Privacy Portal (`apps/privacy-portal/.env`)
- `VITE_MARKETING_SITE_URL` - URL to Marketing Site (root domain)
- `VITE_FRAMEWORK_COMPLIANCE_URL` - URL to Framework Compliance app

## Development Ports

- Marketing Site: `5175`
- Framework Compliance: `5173`
- Privacy Portal: `5174`

## Build Outputs

- Marketing Site: `dist/marketing-site/`
- Framework Compliance: `dist/framework-compliance/`
- Privacy Portal: `dist/privacy-portal/`

## Troubleshooting

### Port Already in Use
If a port is already in use, you can change it in the respective `vite.config.ts` file.

### Environment Variables Not Working
- Ensure `.env` files are in the correct app directories
- Restart the dev server after creating/modifying `.env` files
- Use `import.meta.env.VITE_*` (not `process.env`)

### Build Errors
- Run `npm install` from the root directory
- Ensure all dependencies are installed
- Check that TypeScript compilation passes: `npm run lint`

## Next Steps

After setup, see `LAUNCH_CHECKLIST.md` for deployment instructions.

