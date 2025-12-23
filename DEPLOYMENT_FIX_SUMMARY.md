# Deployment MIME Type Fix

## Issue
Assets (CSS, JS files) were being served with MIME type `text/html` instead of their correct types, causing browser errors:
- `Refused to apply style from '.../assets/index-uIHLs2QR.css' because its MIME type ('text/html') is not a supported stylesheet MIME type`
- `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"`

## Root Cause
The Vercel rewrite rule was catching asset requests and serving `index.html` instead of the actual asset files.

## Solution Applied
Updated `vercel.json` to exclude `/assets/` paths from the SPA rewrite rule using a negative lookahead pattern:

```json
{
  "rewrites": [
    {
      "source": "/((?!assets/).*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures:
- Asset requests to `/assets/*` are NOT rewritten and are served directly by Vercel
- All other routes are rewritten to `/index.html` for SPA routing
- Vercel automatically serves static files with correct MIME types

## Next Steps

1. **Commit and push the fix:**
   ```bash
   git add vercel.json
   git commit -m "Fix: Exclude assets from SPA rewrite to prevent MIME type errors"
   git push
   ```

2. **Redeploy on Vercel:**
   - If auto-deploy is enabled, Vercel will automatically redeploy
   - Or manually trigger a redeploy from the Vercel dashboard

3. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or test in incognito mode

4. **Verify the fix:**
   - Check browser console - MIME type errors should be gone
   - Verify assets load correctly
   - Test navigation between pages

## Alternative Solution (if negative lookahead doesn't work)

If Vercel doesn't support negative lookaheads in rewrite patterns, the configuration relies on Vercel's automatic static file serving, which should serve files from `outputDirectory` before processing rewrites. If issues persist, verify:

1. **Build output location:** Ensure files are in `apps/framework-compliance/dist/assets/`
2. **Output directory:** Verify `outputDirectory: "apps/framework-compliance/dist"` is correct
3. **File existence:** Check that asset files exist in the build output

## Configuration Details

- **Build Command:** `npm run build --workspace=@cybercorrect/framework-compliance`
- **Output Directory:** `apps/framework-compliance/dist`
- **Headers:** Content-Type headers are already configured for assets in the `headers` section

