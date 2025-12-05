import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { NotificationProvider } from './context/NotificationContext';
import { ChatbotProvider } from './components/chat/ChatbotProvider';
import { ChatSupportProvider } from './components/chat/ChatSupportProvider';
import { Toaster } from './components/ui/Toaster';
import ErrorBoundary from './components/ErrorBoundary';
import DevTools from './components/DevTools';
import { setAppSetting, getAppSetting } from './utils/storage';
import AnalyticsWrapper from './components/AnalyticsWrapper';
import { AppRoutes } from './routes';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = getAppSetting('darkMode');
        if (stored !== null && stored !== undefined) {
          return stored;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch (error) {
        console.warn('Error accessing dark mode setting:', error);
        return false;
      }
    }
    return false;
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      setAppSetting('darkMode', newValue);
      return newValue;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProjectProvider>
          <NotificationProvider>
            <ChatbotProvider>
              <ChatSupportProvider>
              <AnalyticsWrapper>
                <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
                  <AppRoutes toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                  <Toaster />
                  <DevTools />
                </div>
              </AnalyticsWrapper>
              </ChatSupportProvider>
            </ChatbotProvider>
          </NotificationProvider>
        </ProjectProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;