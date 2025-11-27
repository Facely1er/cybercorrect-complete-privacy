import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const Layout: React.FC<LayoutProps> = ({ toggleDarkMode, darkMode }) => {

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
      />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;