import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { errorMonitoring } from './errorMonitoring';

// Default values from repository configuration
// These can be overridden by environment variables
const DEFAULT_SUPABASE_URL = 'https://achowlksgmwuvfbvjfrt.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;
let supabaseError: Error | null = null;

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Lazy initialization of Supabase client
// Returns null if not configured (graceful degradation for Privacy by Design)
function getSupabaseClient(): SupabaseClient | null {
  // If not configured, return null (don't throw - Privacy by Design requirement)
  if (!supabaseUrl || !supabaseAnonKey) {
    if (import.meta.env.DEV) {
      console.warn('Supabase not configured. App will work with localStorage only (Privacy by Design).');
      console.warn('To enable cloud sync, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    }
    return null;
  }

  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (supabaseError) {
    // Log error but don't throw - allow app to continue with localStorage
    if (import.meta.env.DEV) {
      console.warn('Supabase initialization error:', supabaseError.message);
      console.warn('App will continue with localStorage only (Privacy by Design).');
    }
    return null;
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return supabaseInstance;
  } catch (error) {
    supabaseError = error instanceof Error ? error : new Error('Failed to create Supabase client');
    errorMonitoring.captureException(supabaseError, { context: 'supabase_initialization' });
    // Don't throw - allow app to continue with localStorage
    if (import.meta.env.DEV) {
      console.warn('Supabase client creation failed:', supabaseError.message);
      console.warn('App will continue with localStorage only (Privacy by Design).');
    }
    return null;
  }
}

// Create a mock Supabase client for when Supabase is not configured
// NOTE: This is a fallback for graceful degradation, not a test mock
const createMockSupabaseClient = (): SupabaseClient => {
  // Warn in production if Supabase should be configured but isn't
  if (import.meta.env.PROD && !import.meta.env.VITE_SUPABASE_URL) {
    console.warn(
      '⚠️ SECURITY WARNING: Using fallback Supabase client in production. ' +
      'Supabase should be properly configured with VITE_SUPABASE_URL environment variable.'
    );
  }
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
    }),
  } as unknown as SupabaseClient;
};

// Export a proxy that initializes on first access
// Returns mock client if Supabase is not configured (graceful degradation)
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      // Return mock client that returns errors (but doesn't crash)
      const mockClient = createMockSupabaseClient();
      const value = mockClient[prop as keyof SupabaseClient];
      return typeof value === 'function' ? value.bind(mockClient) : value;
    }
    const value = client[prop as keyof SupabaseClient];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

// Auth helpers with error handling
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      errorMonitoring.captureException(new Error(error.message), {
        context: 'auth_signup',
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email for privacy
      });
    }
    
    return { data, error };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Sign up failed');
    errorMonitoring.captureException(error, { context: 'auth_signup_unexpected' });
    return { data: null, error: { message: 'Sign up failed', details: error.message } };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      errorMonitoring.captureException(new Error(error.message), {
        context: 'auth_signin',
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email for privacy
      });
    }
    
    return { data, error };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Sign in failed');
    errorMonitoring.captureException(error, { context: 'auth_signin_unexpected' });
    return { data: null, error: { message: 'Sign in failed', details: error.message } };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      errorMonitoring.captureException(new Error(error.message), {
        context: 'auth_signout',
      });
    }
    
    return { error };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Sign out failed');
    errorMonitoring.captureException(error, { context: 'auth_signout_unexpected' });
    return { error: { message: 'Sign out failed', details: error.message } };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      errorMonitoring.captureException(new Error(error.message), {
        context: 'auth_get_user',
      });
    }
    
    return { user, error };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Get user failed');
    errorMonitoring.captureException(error, { context: 'auth_get_user_unexpected' });
    return { user: null, error: { message: 'Get user failed', details: error.message } };
  }
};

// Database helpers with error handling
export const getAssets = async (): Promise<SupabaseResponse<Asset[]>> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      errorMonitoring.captureException(new Error(error.message), {
        context: 'db_get_assets',
      });
    }
    
    return { data, error };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Get assets failed');
    errorMonitoring.captureException(error, { context: 'db_get_assets_unexpected' });
    return { data: null, error: { message: 'Get assets failed', details: error.message } };
  }
};

interface Asset {
  id?: string;
  name: string;
  type: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

export const createAsset = async (asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseResponse<Asset[]>> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .insert([asset])
      .select();
    
    if (error) {
      errorMonitoring.captureException(new Error(error.message), {
        context: 'db_create_asset',
        assetType: asset.type,
      });
    }
    
    return { data, error };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Create asset failed');
    errorMonitoring.captureException(error, { 
      context: 'db_create_asset_unexpected',
      assetType: asset.type,
    });
    return { data: null, error: { message: 'Create asset failed', details: error.message } };
  }
};

export const updateAsset = async (id: string, updates: Partial<Omit<Asset, 'id' | 'created_at'>>): Promise<SupabaseResponse<Asset[]>> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      errorMonitoring.captureException(new Error(error.message), {
        context: 'db_update_asset',
        assetId: id,
      });
    }
    
    return { data, error };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Update asset failed');
    errorMonitoring.captureException(error, { 
      context: 'db_update_asset_unexpected',
      assetId: id,
    });
    return { data: null, error: { message: 'Update asset failed', details: error.message } };
  }
};

export const deleteAsset = async (id: string): Promise<SupabaseResponse<null>> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);
    
    if (error) {
      errorMonitoring.captureException(new Error(error.message), {
        context: 'db_delete_asset',
        assetId: id,
      });
    }
    
    return { data, error };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Delete asset failed');
    errorMonitoring.captureException(error, { 
      context: 'db_delete_asset_unexpected',
      assetId: id,
    });
    return { data: null, error: { message: 'Delete asset failed', details: error.message } };
  }
};