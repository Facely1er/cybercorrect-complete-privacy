# Deployment Fixes - December 26, 2025

## Issues Identified and Resolved

### 1. Node Version Mismatch (CRITICAL)
**Problem:** 
- CI workflows and package-lock.json were configured for Node 18
- Project dependencies (Vite 7, Supabase packages, React Router 7, Vitest, jsdom) require Node 20+
- This caused esbuild version mismatch errors during npm install

**Solution:**
- Updated `.github/workflows/ci.yml` to use Node 20
- Updated `.github/workflows/deploy.yml` to use Node 20  
- Updated root `package.json` engines requirement to `>=20.0.0`
- Deleted and regenerated `package-lock.json` with Node 20
- `.nvmrc` already specified Node 20 (Vercel respects this automatically)

### 2. Dependency Version Conflicts
**Problem:**
- `privacy-portal/package.json` had incompatible versions: `vitest@3.2.4` and `@vitest/ui@4.0.15`

**Solution:**
- Fixed `@vitest/ui` version to `^3.2.4` to match vitest version

### 3. Code Errors - Duplicate Variable Declaration
**Problem:**
- `JourneyContext.tsx` line 548: Duplicate declaration of `const domain`
- Variable was declared twice in the same function scope (lines 507 and 548)

**Solution:**
- Removed the duplicate declaration at line 548
- Reused the existing `domain` variable from line 507

### 4. Missing Component Exports
**Problem:**
- `RecommendedTools.tsx` only had default export, causing import errors
- `Dialog.tsx` missing `DialogFooter` component export

**Solution:**
- Added named export for `RecommendedTools` component
- Created and exported `DialogFooter` component in `Dialog.tsx`

## Files Modified

1. `.github/workflows/ci.yml` - Updated Node version from 18 to 20
2. `.github/workflows/deploy.yml` - Updated Node version from 18 to 20
3. `package.json` - Updated engines.node from `>=18.0.0` to `>=20.0.0`
4. `apps/privacy-portal/package.json` - Fixed @vitest/ui version
5. `apps/framework-compliance/src/context/JourneyContext.tsx` - Removed duplicate variable
6. `apps/framework-compliance/src/components/assessment/RecommendedTools.tsx` - Added named export
7. `apps/framework-compliance/src/components/ui/Dialog.tsx` - Added DialogFooter component
8. `package-lock.json` - Regenerated with Node 20 dependencies
9. `vercel.json` - Added framework and devCommand properties

## Build Status

✅ **framework-compliance** - Builds successfully
- Build time: ~24 seconds
- Bundle sizes are large but within acceptable limits for production

⚠️ **Linting Issues Remain**
- 173 lint errors and 625 warnings exist
- These don't block deployment but should be addressed
- Most are TypeScript `any` type warnings and unused variables

## Next Steps for CI/CD Success

1. **Immediate:** The code changes fix the critical build errors
2. **Short-term:** Address the linting errors to pass CI checks
3. **Long-term:** Consider code splitting to reduce bundle sizes (some chunks > 1MB)

## Verification Commands

```bash
# Test build locally
npm run build:framework

# Test with type checking
npm run lint --workspace=@cybercorrect/framework-compliance

# Install with correct Node version
nvm use 20
npm install
```

## Notes

- Vercel deployments should now succeed as they read `.nvmrc` automatically
- GitHub Actions will now use Node 20 for all CI jobs
- The marketing site was already deploying successfully and remains unaffected
