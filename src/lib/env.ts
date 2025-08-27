// Environment variable validation and configuration
interface EnvironmentConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

function validateEnvironment(): EnvironmentConfig {
  const requiredVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    NODE_ENV: import.meta.env.NODE_ENV || 'development'
  };

  // Check for missing required environment variables
  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value || value === '')
    .map(([key]) => key);

  if (missingVars.length > 0) {
    const message = `Missing required environment variables: ${missingVars.join(', ')}`;
    console.error(message);
    
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

  return requiredVars as EnvironmentConfig;
}

export const env = validateEnvironment();
export default env;