/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FRAMEWORK_COMPLIANCE_URL?: string
  readonly VITE_PRIVACY_PORTAL_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

