# CyberCorrect Monorepo

This repository contains the CyberCorrect platform as a monorepo with separate applications and shared packages.

## Structure

```
cybercorrect-complete-privacy/
├── apps/
│   ├── framework-compliance/    # Main privacy compliance platform
│   └── privacy-portal/          # Workplace privacy portal
├── packages/
│   ├── shared-types/            # Shared TypeScript types
│   ├── shared-utils/            # Shared utility functions
│   ├── shared-config/           # Shared configuration
│   └── shared-ui/               # Shared UI components (future)
└── package.json                 # Root workspace configuration
```

## Getting Started

### Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces.

### Development

Run a specific app:

```bash
# Framework Compliance (port 5173)
npm run dev:framework

# Privacy Portal (port 5174)
npm run dev:portal

# Both apps simultaneously
npm run dev:all
```

### Building

```bash
# Build specific app
npm run build:framework
npm run build:portal

# Build all apps
npm run build:all
```

Build outputs:
- Framework Compliance: `dist/framework-compliance/`
- Privacy Portal: `dist/privacy-portal/`

### Testing

```bash
# Run all tests
npm run test

# Run tests for specific workspace
npm run test --workspace=@cybercorrect/framework-compliance
npm run test --workspace=@cybercorrect/privacy-portal
```

### Linting

```bash
# Lint all workspaces
npm run lint

# Lint specific workspace
npm run lint --workspace=@cybercorrect/framework-compliance
```

## Workspace Commands

Each app has its own scripts defined in its `package.json`. You can run them using:

```bash
npm run <script> --workspace=@cybercorrect/<app-name>
```

## Deployment

### Framework Compliance

Deploy to `app.cybercorrect.com` (or main domain):
- Uses root `vercel.json`
- Build command: `npm run build:framework`
- Output: `dist/framework-compliance/`

### Privacy Portal

Deploy to `portal.cybercorrect.com`:
- Uses `apps/privacy-portal/vercel.json`
- Build command: `npm run build:portal`
- Output: `dist/privacy-portal/`

## Shared Packages

### @cybercorrect/shared-types

Common TypeScript type definitions used across applications.

```typescript
import { BaseEntity, PaginatedResponse } from '@cybercorrect/shared-types';
```

### @cybercorrect/shared-utils

Utility functions for common operations.

```typescript
import { cn, formatDate } from '@cybercorrect/shared-utils';
```

### @cybercorrect/shared-config

Shared configuration constants.

```typescript
import { APP_CONFIG, API_ENDPOINTS } from '@cybercorrect/shared-config';
```

## Adding New Packages

1. Create directory in `packages/`
2. Add `package.json` with name `@cybercorrect/<package-name>`
3. Add to root `package.json` workspaces array (already includes `packages/*`)
4. Install dependencies: `npm install`

## Adding New Apps

1. Create directory in `apps/`
2. Copy structure from existing app
3. Update `package.json` with name `@cybercorrect/<app-name>`
4. Update `vite.config.ts` with correct `root` and `outDir`
5. Add to root `package.json` workspaces array (already includes `apps/*`)
6. Add dev/build scripts to root `package.json`

## Port Configuration

- Framework Compliance: 5173 (dev), 4173 (preview)
- Privacy Portal: 5174 (dev), 4174 (preview)

## Notes

- Each app has its own `node_modules` in development
- Shared packages are symlinked by npm workspaces
- Build outputs go to `dist/<app-name>/` at root level
- Each app can be deployed independently

