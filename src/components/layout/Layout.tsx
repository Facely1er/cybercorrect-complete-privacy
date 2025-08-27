import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const Layout: React.FC<LayoutProps> = ({ toggleDarkMode, darkMode }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-surface border-t border-support-gray dark:bg-dark-surface dark:border-dark-support py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} CyberCorrect Tools. All rights reserved.
            </p>
            <div className="flex mt-2 md:mt-0 space-x-4">
              <a href="https://cybercorrect.com" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Main Website</a>
              <a href="https://cybercorrect.com/support" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Support</a>
              <a href="https://cybercorrect.com/privacy" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Privacy</a>
              <a href="https://cybercorrect.com/terms" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;