// Type declarations for Deno runtime in Supabase Edge Functions

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// These are available in Deno runtime
declare const Response: typeof globalThis.Response;
declare const fetch: typeof globalThis.fetch;
declare const console: typeof globalThis.console;
declare const URLSearchParams: typeof globalThis.URLSearchParams;

