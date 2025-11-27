import { createContext, useContext } from 'react';

interface User {
  id: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  role?: string;
  [key: string]: unknown;
}

interface AuthResponse {
  user: User;
  session: Session;
}

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  user: User;
}

interface AuthError {
  message: string;
  status?: number;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  checkingSession: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<{ data: AuthResponse | null; error: AuthError | null }>;
  signUp: (email: string, password: string, userData: Record<string, unknown>) => Promise<{ data: AuthResponse | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ data: Profile | null; error: AuthError | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { User, Profile, AuthResponse, Session, AuthError, AuthContextType };