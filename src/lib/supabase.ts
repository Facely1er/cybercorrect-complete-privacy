import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { errorMonitoring } from './errorMonitoring';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;
let supabaseError: Error | null = null;

// Lazy initialization of Supabase client
function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (supabaseError) {
    throw supabaseError;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    supabaseError = new Error('Missing Supabase environment variables. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    errorMonitoring.captureException(supabaseError, { 
      context: 'supabase_initialization',
      missingVars: { 
        url: !!supabaseUrl, 
        key: !!supabaseAnonKey 
      }
    });
    throw supabaseError;
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
    throw supabaseError;
  }
}

// Export a proxy that initializes on first access
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseClient();
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