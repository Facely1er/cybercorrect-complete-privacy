import React, { useEffect, useState } from 'react';
import { useUser } from './useSupabase';
import { AuthContext } from './useAuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading, error, signIn, signUp, signOut, updateProfile } = useUser();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Set checking session to false after initial load
    if (!loading) {
      setCheckingSession(false);
    }
  }, [loading]);

  const userRole = profile?.role || null;
  const isAuthenticated = !!user && !loading;

  const value = {
    user,
    profile,
    isAuthenticated,
    isLoading: loading,
    error,
    checkingSession,
    userRole,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};