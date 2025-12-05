# Building from Separate Source Folder

This document explains how to build the CyberCorrect monorepo applications from separate source folders.

## Overview

Each app in the monorepo follows a clear separation between:
- **Source folder** (`src/`) - Contains all source code
- **Output folder** (`dist/`) - Contains built/compiled files
- **Public folder** (`public/`) - Contains static assets

## Directory Structure

```
cybercorrect-complete-privacy/
├── apps/
│   ├── privacy-portal/
│   │   ├── src/              ← Source folder
│   │   ├── dist/             ← Build output folder
│   │   ├── public/           ← Static assets
│   │   ├── build.config.js   ← Build configuration
│   │   └── vite.config.ts    ← Vite configuration
│   ├── framework-compliance/
│   │   ├── src/              ← Source folder
│   │   ├── dist/             ← Build output folder
│   │   ├── public/           ← Static assets
│   │   ├── build.config.js   ← Build configuration
│   │   └── vite.config.ts    ← Vite configuration
│   └── marketing-site/
│       ├── src/              ← Source folder
│       ├── dist/             ← Build output folder
│       └── public/           ← Static assets
└── scripts/
    └── build-from-source.js  ← Build script
```

## Build Configuration

Each app has a `build.config.js` file that explicitly defines:

- **sourceDir**: Where source files are located (`./src`)
- **publicDir**: Static assets directory (`./public`)
- **outputDir**: Where built files are written (`./dist`)
- **rootDir**: The app root directory

## Building Applications

### Build All Apps

```bash
# From root directory
npm run build:from-source
```

This will:
1. Validate source directories exist
2. Build each app from its source folder
3. Output to separate dist folders
4. Validate build outputs
5. Show build summary

### Build Specific App

```bash
# Build privacy portal only
npm run build:from-source:portal

# Build framework compliance only
npm run build:from-source:framework

# Build marketing site only
npm run build:from-source:marketing
```

### Build Using Workspace Commands

```bash
# Build all apps (traditional method)
npm run build:all

# Build individual apps
npm run build:portal
npm run build:framework
npm run build:marketing
```

## Build Process

1. **Source Validation**
   - Checks that `src/` directory exists
   - Validates required source files are present
   - Verifies entry points exist

2. **Build Execution**
   - Runs Vite build process
   - Compiles TypeScript to JavaScript
   - Bundles and optimizes assets
   - Generates source maps (development only)

3. **Output Validation**
   - Verifies `dist/` directory was created
   - Checks for required output files (`index.html`)
   - Validates assets directory structure
   - Reports build size

## Build Output Structure

Each app's `dist/` folder contains:

```
dist/
├── index.html           # Main HTML file
├── assets/
│   ├── js/             # JavaScript bundles
│   ├── css/            # CSS files
│   ├── images/         # Image assets
│   └── fonts/          # Font files
└── [other static files]
```

## Vite Configuration

The Vite configs explicitly define:

```typescript
{
  root: __dirname,                    // App root directory
  publicDir: './public',              // Public assets
  build: {
    outDir: './dist',                 // Output directory
    // ... other build options
  }
}
```

## Environment Variables

Build behavior can be controlled with environment variables:

- `NODE_ENV=production` - Production build (minified, optimized)
- `NODE_ENV=development` - Development build (with source maps)
- `ANALYZE=true` - Generate bundle analysis report

## Deployment

### Vercel Deployment

Each app has its own `vercel.json` that specifies:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "cd ../.. && npm install"
}
```

This ensures Vercel:
1. Installs dependencies from root
2. Builds from the app's source folder
3. Deploys from the app's dist folder

### Manual Deployment

1. Build the app:
   ```bash
   cd apps/privacy-portal
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting provider

3. Ensure routing is configured for SPA (single-page application)

## Troubleshooting

### Build Fails - Source Directory Not Found

**Error**: `Source directory not found`

**Solution**: Ensure you're running the build from the correct directory and that the `src/` folder exists.

### Build Output Missing Files

**Error**: `Missing build files: index.html`

**Solution**: 
- Check for build errors in the console
- Verify `index.html` exists in the app root
- Check Vite configuration for correct entry points

### Build Size Too Large

**Solution**:
- Run bundle analysis: `npm run build:analyze`
- Check for duplicate dependencies
- Review code splitting configuration
- Optimize images and assets

## Best Practices

1. **Always build from source** - Never commit `dist/` folders to git
2. **Use build scripts** - Use the provided npm scripts instead of running Vite directly
3. **Validate builds** - Always check build output before deploying
4. **Clean builds** - Delete `dist/` folder before rebuilding for clean output
5. **Environment-specific builds** - Use appropriate `NODE_ENV` for dev/prod

## Related Files

- `apps/*/build.config.js` - Build configuration per app
- `apps/*/vite.config.ts` - Vite configuration per app
- `apps/*/vercel.json` - Deployment configuration per app
- `scripts/build-from-source.js` - Build validation script

---

**Last Updated**: November 2025

