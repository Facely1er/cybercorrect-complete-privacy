import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock environment variables using Vitest's env stubbing API
beforeAll(() => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-key');
});

describe('Supabase Configuration', () => {
  it('has environment variables defined', () => {
    expect(import.meta.env.VITE_SUPABASE_URL).toBeDefined();
    expect(import.meta.env.VITE_SUPABASE_ANON_KEY).toBeDefined();
  });

  it('creates Supabase client', async () => {
    // Dynamic import to avoid module loading issues
    const { supabase } = await import('./supabase');
    expect(supabase).toBeDefined();
  });
});