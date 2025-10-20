// Environment variable validation and configuration
interface EnvironmentConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  NODE_ENV: 'development' | 'production' | 'test';
  VITE_ERROR_MONITORING_ENDPOINT?: string;
  VITE_ANALYTICS_ID?: string;
  VITE_ENABLE_ANALYTICS?: string;
  VITE_ENABLE_CHAT_SUPPORT?: string;
}

function validateEnvironment(): EnvironmentConfig {
  const requiredVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    NODE_ENV: import.meta.env.NODE_ENV || 'development',
    VITE_ERROR_MONITORING_ENDPOINT: import.meta.env.VITE_ERROR_MONITORING_ENDPOINT || '',
    VITE_ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID || '',
    VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS || 'false',
    VITE_ENABLE_CHAT_SUPPORT: import.meta.env.VITE_ENABLE_CHAT_SUPPORT || 'false'
  };

  // Check for missing required environment variables (excluding optional ones)
  const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value || value === '')
    .filter(([key]) => !['VITE_ERROR_MONITORING_ENDPOINT', 'VITE_ANALYTICS_ID', 'VITE_ENABLE_ANALYTICS', 'VITE_ENABLE_CHAT_SUPPORT'].includes(key))
    .map(([key]) => key);

  if (missingVars.length > 0) {
    const message = `Missing required environment variables: ${missingVars.join(', ')}`;
    
    // Only log in development
    if (import.meta.env.DEV) {
      console.error(message);
    }
    
    if (import.meta.env.NODE_ENV === 'production') {
      throw new Error(message);
    }
  }

  // Validate URL format
  if (requiredVars.VITE_SUPABASE_URL) {
    try {
      new URL(requiredVars.VITE_SUPABASE_URL);
    } catch {
      throw new Error('VITE_SUPABASE_URL must be a valid URL');
    }
  }

  // Validate boolean environment variables
  if (requiredVars.VITE_ENABLE_ANALYTICS && !['true', 'false'].includes(requiredVars.VITE_ENABLE_ANALYTICS)) {
    throw new Error('VITE_ENABLE_ANALYTICS must be "true" or "false"');
  }

  if (requiredVars.VITE_ENABLE_CHAT_SUPPORT && !['true', 'false'].includes(requiredVars.VITE_ENABLE_CHAT_SUPPORT)) {
    throw new Error('VITE_ENABLE_CHAT_SUPPORT must be "true" or "false"');
  }

  return requiredVars as EnvironmentConfig;
}

export const env = validateEnvironment();
export default env;