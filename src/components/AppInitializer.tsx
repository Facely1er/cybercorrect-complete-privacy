import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import LoadingSpinner from './LoadingSpinner';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { loading: authLoading } = useAuth();
  const { loading: projectLoading } = useProject();

  useEffect(() => {
    // Initialize any global app settings or configurations
    const initializeApp = async () => {
      try {
        // Set up any global event listeners
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            // App became visible, refresh any necessary data
            console.log('App became visible');
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup function
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  // Show loading spinner while auth or project data is loading
  if (authLoading || projectLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default AppInitializer;