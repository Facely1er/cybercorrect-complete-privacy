# Internal Access Setup for Preview Review Pages

## Overview
The preview review pages (`/preview-review` and `/preview-artifact/*`) are restricted to internal use only. They are not accessible to customers.

## Access Control

### Development Mode
- **Automatically enabled** when running locally (`localhost` or `127.0.0.1`)
- **Automatically enabled** when `NODE_ENV === 'development'`
- No additional configuration needed

### Production Mode
To enable internal access in production, set the environment variable:

```bash
VITE_ENABLE_INTERNAL_REVIEW=true
```

### Access Denied
If access is denied, users will see:
- Lock icon
- "Access Restricted" message
- Redirect button to the public store page

## How It Works

The access control checks:
1. Environment variable: `VITE_ENABLE_INTERNAL_REVIEW === 'true'`
2. Development mode: `import.meta.env.MODE === 'development'`
3. Localhost: `window.location.hostname === 'localhost'` or `'127.0.0.1'`

If any of these conditions are true, access is granted.

## Setting Up for Production

### Option 1: Environment Variable (Recommended)
Add to your `.env.production` or deployment environment:

```bash
VITE_ENABLE_INTERNAL_REVIEW=true
```

### Option 2: IP/Hostname Restriction
The code automatically allows localhost access. For production, you can:
- Access via internal network IP
- Use a VPN or private network
- Add additional hostname checks in the code

### Option 3: Authentication-Based (Future Enhancement)
For more secure access, you could:
- Add authentication check
- Check user role/permissions
- Use API key or token validation

## Current Implementation

### Files Protected
- `/preview-review` - Main review page
- `/preview-artifact/:productId` - Individual artifact viewer
- `/preview-artifact/:productId/:previewIndex` - Specific artifact

### Access Check Location
Both pages check access in `useEffect` hook:
- Shows loading state while checking
- Shows access denied if not internal
- Shows content if access granted

## Testing

### Test Access Denied
1. Set `VITE_ENABLE_INTERNAL_REVIEW=false` (or unset)
2. Run in production mode
3. Access from non-localhost domain
4. Should see "Access Restricted" message

### Test Access Granted
1. Run in development mode (automatic)
2. Or set `VITE_ENABLE_INTERNAL_REVIEW=true`
3. Access from localhost
4. Should see review pages

## Notes

- **Customer-facing previews** remain available through the store page (`/store`)
- Customers can click "Preview" buttons on product cards
- Only the review/admin pages are restricted
- The ProductPreviewModal component (used in store) is public

---

**Status**: ✅ Internal access control implemented
**Date**: 2025-12-20

