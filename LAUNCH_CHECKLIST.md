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
VITE_FRAMEWORK_COMPLIANCE_URL=https://www.platform.cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com
```

**apps/framework-compliance/.env** (add if not exists)
```env
VITE_MARKETING_SITE_URL=https://www.cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com
```

**apps/privacy-portal/.env** (add if not exists)
```env
VITE_MARKETING_SITE_URL=https://www.cybercorrect.com
VITE_FRAMEWORK_COMPLIANCE_URL=https://www.platform.cybercorrect.com
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
   - `VITE_FRAMEWORK_COMPLIANCE_URL=https://www.platform.cybercorrect.com`
   - `VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com`
7. Domain: `www.cybercorrect.com` (root domain)

#### Framework Compliance (Subdomain)
1. Existing Vercel project
2. Root directory: `.` (root of repo)
3. Build command: `npm run build:framework`
4. Output directory: `dist/framework-compliance`
5. Environment variables:
   - `VITE_MARKETING_SITE_URL=https://www.cybercorrect.com`
   - `VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com`
6. Domain: `www.platform.cybercorrect.com`

#### Privacy Portal (Subdomain)
1. Existing Vercel project
2. Root directory: `apps/privacy-portal`
3. Build command: `npm run build`
4. Output directory: `dist/privacy-portal`
5. Environment variables:
   - `VITE_MARKETING_SITE_URL=https://www.cybercorrect.com`
   - `VITE_FRAMEWORK_COMPLIANCE_URL=https://www.platform.cybercorrect.com`
6. Domain: `www.portal.cybercorrect.com`

### Step 6: DNS Configuration
- ✅ Configure `www.cybercorrect.com` → Marketing Site
- ✅ Configure `www.platform.cybercorrect.com` → Framework Compliance
- ✅ Configure `www.portal.cybercorrect.com` → Privacy Portal

### Step 7: Post-Deployment Verification

#### Domain Verification
- [ ] Marketing site loads at `https://www.cybercorrect.com`
- [ ] Framework Compliance loads at `https://www.platform.cybercorrect.com`
- [ ] Privacy Portal loads at `https://www.portal.cybercorrect.com`
- [ ] SSL certificates active for all domains
- [ ] No mixed content warnings
- [ ] All sites redirect HTTP to HTTPS

#### Cross-Link Verification
- [ ] Marketing Site → Framework Compliance link works
- [ ] Marketing Site → Privacy Portal link works
- [ ] Framework Compliance → Marketing Site link works
- [ ] Framework Compliance → Privacy Portal link works
- [ ] Privacy Portal → Marketing Site link works
- [ ] Privacy Portal → Framework Compliance link works
- [ ] All footer links functional on all three sites
- [ ] All navigation links work correctly

#### Configuration Verification
- [ ] Environment variables set correctly in Vercel dashboard
- [ ] All three apps have correct environment variables
- [ ] No console errors on any site
- [ ] Build outputs are correct
- [ ] Source maps disabled in production (if configured)

#### Functionality Verification
- [ ] All CTAs and navigation links work
- [ ] Mobile responsiveness verified on all three sites
- [ ] Desktop view verified on all three sites
- [ ] Tablet view verified on all three sites
- [ ] SEO meta tags verified (check with browser dev tools)
- [ ] Open Graph tags working (test with social media debuggers)
- [ ] Twitter Card tags working
- [ ] Analytics tracking works (if configured)
- [ ] Error monitoring works (if configured)

#### Performance Verification
- [ ] Page load times acceptable (< 3s)
- [ ] No performance warnings in browser console
- [ ] Images and assets load correctly
- [ ] No broken resources (404s)
- [ ] Core Web Vitals within acceptable ranges
- [ ] Lighthouse scores acceptable (> 90)

#### Security Verification
- [ ] Security headers present (check with securityheaders.com)
- [ ] No sensitive data exposed in client-side code
- [ ] HTTPS enforced on all domains
- [ ] No console errors exposing sensitive information

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

