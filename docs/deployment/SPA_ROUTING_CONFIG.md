# SPA Routing Configuration

This document explains how direct URL access is configured for different hosting platforms.

## Problem
Single Page Applications (SPAs) use client-side routing. When users access a route directly (e.g., `/assessment-hub`), the server looks for that path as a file. Since it doesn't exist, it returns a 404 error.

## Solution
Configure the server to serve `index.html` for all routes, allowing React Router to handle the routing on the client side.

## Platform-Specific Configurations

### ✅ Netlify (Already Configured)
**File:** `public/_redirects`
```
/*    /index.html   200
```
This file is automatically copied to `dist/_redirects` during build.

**How it works:**
- All routes (`/*`) redirect to `/index.html` with a 200 status code
- React Router then handles the routing on the client

### ✅ Vercel (Newly Added)
**File:** `vercel.json`
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**How it works:**
- The rewrite rule sends all requests to `index.html`
- React Router handles the routing

### ✅ Apache Servers (Newly Added)
**File:** `public/.htaccess`
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**How it works:**
- Rewrites all non-existent file/directory requests to `index.html`
- Requires `mod_rewrite` to be enabled

### ✅ GitHub Pages (Newly Added)
**File:** `public/404.html`
- Contains JavaScript that redirects to `index.html` with the current path
- GitHub Pages automatically uses `404.html` for 404 errors

**Client-side handling:**
- Updated `src/main.tsx` to handle redirect query parameters
- Restores the original URL after loading

### ✅ Vite Dev/Preview Server
**Configuration:** Automatic (no config needed)
- Vite's dev server handles history API fallback automatically
- The preview server (`npm run preview`) also handles this correctly

## Testing Direct URL Access

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview the build:**
   ```bash
   npm run preview
   ```

3. **Test direct URLs:**
   - Open: `http://localhost:4173/assessment-hub`
   - Open: `http://localhost:4173/toolkit`
   - Open: `http://localhost:4173/about`
   - All should work without 404 errors

## Deployment Checklist

- [x] Netlify: `public/_redirects` configured
- [x] Vercel: `vercel.json` created
- [x] Apache: `public/.htaccess` created
- [x] GitHub Pages: `public/404.html` created
- [x] Client-side redirect handling in `src/main.tsx`

## Troubleshooting

### Issue: Still getting 404 errors on direct URLs

1. **Check if the configuration file is in the dist folder:**
   - `_redirects` should be in `dist/` (copied from `public/`)
   - `.htaccess` should be in `dist/` (copied from `public/`)
   - `404.html` should be in `dist/` (copied from `public/`)

2. **Verify your hosting platform:**
   - Netlify: Check Site Settings → Build & Deploy → Publish directory is `dist`
   - Vercel: Ensure `vercel.json` is in the project root
   - Apache: Ensure `mod_rewrite` is enabled on your server
   - GitHub Pages: Ensure `404.html` is in the repository root or docs folder

3. **Test locally:**
   ```bash
   npm run build
   npm run preview
   ```
   Then test direct URLs in the preview server.

### Issue: Routes work in browser but not on refresh

This means the server configuration is missing. Ensure the appropriate configuration file exists for your hosting platform.

## Files Added/Modified

1. ✅ `vercel.json` - Vercel rewrite configuration
2. ✅ `public/.htaccess` - Apache rewrite configuration  
3. ✅ `public/404.html` - GitHub Pages fallback
4. ✅ `src/main.tsx` - Client-side redirect handling for GitHub Pages
5. ✅ `public/_redirects` - Already existed for Netlify

All files are automatically copied to `dist/` during the build process.

