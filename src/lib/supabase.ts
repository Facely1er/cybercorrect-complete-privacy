import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Database helpers
export const getAssets = async () => {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createAsset = async (asset: any) => {
  const { data, error } = await supabase
    .from('assets')
    .insert([asset])
    .select();
  return { data, error };
};

export const updateAsset = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('assets')
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
};

export const deleteAsset = async (id: string) => {
  const { data, error } = await supabase
    .from('assets')
    .delete()
    .eq('id', id);
  return { data, error };
};