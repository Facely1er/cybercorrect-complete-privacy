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
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
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
    
    // Log warning in both dev and production, but don't throw
    console.warn(message);
    console.warn('The app will continue with limited functionality. Some features may not work correctly.');
  }

  // Validate URL format if provided
  if (requiredVars.VITE_SUPABASE_URL) {
    try {
      new URL(requiredVars.VITE_SUPABASE_URL);
    } catch {
      console.warn('VITE_SUPABASE_URL must be a valid URL');
    }
  }

  // Validate boolean environment variables
  if (requiredVars.VITE_ENABLE_ANALYTICS && !['true', 'false'].includes(requiredVars.VITE_ENABLE_ANALYTICS)) {
    console.warn('VITE_ENABLE_ANALYTICS must be "true" or "false", defaulting to false');
    requiredVars.VITE_ENABLE_ANALYTICS = 'false';
  }

  if (requiredVars.VITE_ENABLE_CHAT_SUPPORT && !['true', 'false'].includes(requiredVars.VITE_ENABLE_CHAT_SUPPORT)) {
    console.warn('VITE_ENABLE_CHAT_SUPPORT must be "true" or "false", defaulting to false');
    requiredVars.VITE_ENABLE_CHAT_SUPPORT = 'false';
  }

  // Ensure analytics is only enabled if both flag and ID are provided
  if (requiredVars.VITE_ENABLE_ANALYTICS === 'true' && !requiredVars.VITE_ANALYTICS_ID) {
    console.warn('Analytics is enabled but no analytics ID provided. Disabling analytics.');
    requiredVars.VITE_ENABLE_ANALYTICS = 'false';
  }

  return requiredVars as EnvironmentConfig;
}

export const env = validateEnvironment();
export default env;