# Launch Checklist - Hybrid Marketing Architecture

## ✅ Pre-Launch Inspection Complete

### 1. File Structure Verification
- ✅ Marketing site app created in `apps/marketing-site/`
- ✅ All required configuration files present
- ✅ Source files properly structured
- ✅ Public assets (favicon, logo) copied

### 2. Code Quality
- ✅ No linting errors
- ✅ TypeScript configuration correct
- ✅ Environment variables properly used (`import.meta.env`)
- ✅ Cross-links implemented correctly

### 3. Configuration Files
- ✅ `package.json` - Dependencies and scripts configured
- ✅ `vite.config.ts` - Build configuration correct
- ✅ `vercel.json` - Deployment configuration ready
- ✅ `tsconfig.json` - TypeScript settings correct
- ✅ `tailwind.config.js` - Styling configuration ready
- ✅ `eslint.config.js` - Linting rules configured

### 4. Cross-Linking
- ✅ Marketing Site → Framework Compliance (✅)
- ✅ Marketing Site → Privacy Portal (✅)
- ✅ Framework Compliance → Marketing Site (✅)
- ✅ Framework Compliance → Privacy Portal (✅)
- ✅ Privacy Portal → Marketing Site (✅)
- ✅ Privacy Portal → Framework Compliance (✅)

### 5. Environment Variables
All apps use `import.meta.env` correctly:
- ✅ Marketing Site: `VITE_FRAMEWORK_COMPLIANCE_URL`, `VITE_PRIVACY_PORTAL_URL`
- ✅ Framework Compliance: `VITE_MARKETING_SITE_URL`, `VITE_PRIVACY_PORTAL_URL`
- ✅ Privacy Portal: `VITE_MARKETING_SITE_URL`, `VITE_FRAMEWORK_COMPLIANCE_URL`

### 6. Build Configuration
- ✅ Root `package.json` includes marketing site scripts
- ✅ Build output directories configured correctly
- ✅ Port assignments don't conflict (5173, 5174, 5175)

## 🚀 Pre-Launch Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Environment Files

**apps/marketing-site/.env**
```env
VITE_FRAMEWORK_COMPLIANCE_URL=https://app.cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://portal.cybercorrect.com
```

**apps/framework-compliance/.env** (add if not exists)
```env
VITE_MARKETING_SITE_URL=https://cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://portal.cybercorrect.com
```

**apps/privacy-portal/.env** (add if not exists)
```env
VITE_MARKETING_SITE_URL=https://cybercorrect.com
VITE_FRAMEWORK_COMPLIANCE_URL=https://app.cybercorrect.com
```

### Step 3: Test Locally
```bash
# Test all three sites
npm run dev:all

# Or test individually
npm run dev:marketing      # http://localhost:5175
npm run dev:framework      # http://localhost:5173
npm run dev:portal         # http://localhost:5174
```

### Step 4: Verify Builds
```bash
# Build all sites
npm run build:all

# Verify outputs exist
ls dist/marketing-site
ls dist/framework-compliance
ls dist/privacy-portal
```

### Step 5: Vercel Deployment Setup

#### Marketing Site (Root Domain)
1. Create new Vercel project
2. Root directory: `apps/marketing-site`
3. Build command: `npm run build` (runs from app directory)
4. Output directory: `dist/marketing-site`
5. Install command: `npm install` (from root)
6. Environment variables:
   - `VITE_FRAMEWORK_COMPLIANCE_URL=https://app.cybercorrect.com`
   - `VITE_PRIVACY_PORTAL_URL=https://portal.cybercorrect.com`
7. Domain: `cybercorrect.com` (root domain)

#### Framework Compliance (Subdomain)
1. Existing Vercel project
2. Root directory: `.` (root of repo)
3. Build command: `npm run build:framework`
4. Output directory: `dist/framework-compliance`
5. Environment variables:
   - `VITE_MARKETING_SITE_URL=https://cybercorrect.com`
   - `VITE_PRIVACY_PORTAL_URL=https://portal.cybercorrect.com`
6. Domain: `app.cybercorrect.com`

#### Privacy Portal (Subdomain)
1. Existing Vercel project
2. Root directory: `apps/privacy-portal`
3. Build command: `npm run build`
4. Output directory: `dist/privacy-portal`
5. Environment variables:
   - `VITE_MARKETING_SITE_URL=https://cybercorrect.com`
   - `VITE_FRAMEWORK_COMPLIANCE_URL=https://app.cybercorrect.com`
6. Domain: `portal.cybercorrect.com`

### Step 6: DNS Configuration
- ✅ Configure `cybercorrect.com` → Marketing Site
- ✅ Configure `app.cybercorrect.com` → Framework Compliance
- ✅ Configure `portal.cybercorrect.com` → Privacy Portal

### Step 7: Post-Deployment Verification
- [ ] Marketing site loads at root domain
- [ ] Framework Compliance loads at subdomain
- [ ] Privacy Portal loads at subdomain
- [ ] Cross-links work between all three sites
- [ ] Environment variables are set correctly in production
- [ ] All CTAs and navigation links work
- [ ] Mobile responsiveness verified
- [ ] SEO meta tags verified

## 📋 Known Issues
None identified during inspection.

## 🔧 Potential Improvements (Post-Launch)
- Add analytics tracking
- Add error monitoring (Sentry)
- Add performance monitoring
- Create sitemap.xml for marketing site
- Add 404 page for marketing site
- Add loading states and error boundaries

## 📝 Notes
- All three apps maintain their own landing pages
- Marketing site serves as unified entry point
- Cross-linking ensures seamless navigation
- Each app can be deployed independently

