 import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SunMoon, Moon, Menu, ChevronDown } from 'lucide-react';

import { Button } from '../ui/Button';

interface HeaderProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, darkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const assessmentLinks = [
    { name: 'Privacy Assessment', path: '/assessments/privacy-assessment' },
    { name: 'Data Governance Review', path: '/toolkit/gdpr-mapper' },
  ];

  const toolLinks = [
    { name: 'Data Flow Mapper', path: '/toolkit/gdpr-mapper' },
    { name: 'DPIA Generator', path: '/toolkit/dpia-generator' },
    { name: 'GDPR Mapper', path: '/gdpr-mapper' },
    { name: 'Policy Generator', path: '/toolkit/privacy-policy-generator' },
  ];

  const resultLinks = [
    { name: 'Security Results', path: '/security-results' },
    { name: 'Security Recommendations', path: '/security-recommendations' },
    { name: 'Privacy Results', path: '/privacy-results' },
    { name: 'Privacy Recommendations', path: '/privacy-recommendations' },
  ];

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-border bg-surface dark:bg-dark-surface">
      <div className="container mx-auto flex justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold text-foreground dark:text-dark-text">CyberCorrect Tools</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {/* Main Navigation */}
          <div className="relative">
            <button 
              className={`flex items-center text-foreground dark:text-dark-text hover:text-primary-teal dark:hover:text-dark-primary px-3 py-2 text-sm font-medium ${
                location.pathname.includes('assessment') ? 'text-primary-teal dark:text-dark-primary' : ''
              }`}
              onClick={() => toggleDropdown('assessments')}
            >
              Assessments
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${activeDropdown === 'assessments' ? 'transform rotate-180' : ''}`} />
            </button>
            
            {activeDropdown === 'assessments' && (
              <div className="absolute left-0 mt-1 w-56 bg-white dark:bg-dark-surface rounded-md shadow-lg border border-support-gray dark:border-dark-support">
                <div className="py-1">
                  {assessmentLinks.map(link => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center px-4 py-2 text-sm ${
                        location.pathname === link.path 
                          ? 'text-primary-teal bg-primary-teal/5 dark:text-dark-primary dark:bg-dark-primary/10' 
                          : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                      }`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              className={`flex items-center text-foreground dark:text-dark-text hover:text-primary-teal dark:hover:text-dark-primary px-3 py-2 text-sm font-medium ${
                location.pathname.includes('mapper') || location.pathname.includes('generator') ? 'text-primary-teal dark:text-dark-primary' : ''
              }`}
              onClick={() => toggleDropdown('tools')}
            >
              Tools
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${activeDropdown === 'tools' ? 'transform rotate-180' : ''}`} />
            </button>
            
            {activeDropdown === 'tools' && (
              <div className="absolute left-0 mt-1 w-56 bg-white dark:bg-dark-surface rounded-md shadow-lg border border-support-gray dark:border-dark-support">
                <div className="py-1">
                  {toolLinks.map(link => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center px-4 py-2 text-sm ${
                        location.pathname === link.path 
                          ? 'text-primary-teal bg-primary-teal/5 dark:text-dark-primary dark:bg-dark-primary/10' 
                          : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                      }`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              className={`flex items-center text-foreground dark:text-dark-text hover:text-primary-teal dark:hover:text-dark-primary px-3 py-2 text-sm font-medium ${
                location.pathname.includes('results') || location.pathname.includes('recommendations') ? 'text-primary-teal dark:text-dark-primary' : ''
              }`}
              onClick={() => toggleDropdown('results')}
            >
              Results
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${activeDropdown === 'results' ? 'transform rotate-180' : ''}`} />
            </button>
            
            {activeDropdown === 'results' && (
              <div className="absolute left-0 mt-1 w-56 bg-white dark:bg-dark-surface rounded-md shadow-lg border border-support-gray dark:border-dark-support">
                <div className="py-1">
                  {resultLinks.map(link => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center px-4 py-2 text-sm ${
                        location.pathname === link.path 
                          ? 'text-primary-teal bg-primary-teal/5 dark:text-dark-primary dark:bg-dark-primary/10' 
                          : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                      }`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center md:ml-6 space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-foreground dark:text-dark-text hover:bg-muted/70 dark:hover:bg-dark-support"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunMoon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
          
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground dark:text-dark-text hover:text-primary-teal dark:hover:text-dark-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="block h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-16 left-0 right-0 bg-surface dark:bg-dark-surface border-b border-support-gray dark:border-dark-support transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-[80vh]' : 'max-h-0'}`}
      >
        <div className="px-4 py-2 space-y-1 overflow-y-auto max-h-[calc(80vh-4rem)]">
          <div className="py-2 border-b border-support-gray dark:border-dark-support">
            <div className="px-3 py-2 text-sm font-medium text-foreground dark:text-dark-text">Assessments</div>
            {assessmentLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 text-sm rounded-md ${
                  location.pathname === link.path 
                    ? 'text-primary-teal bg-primary-teal/5 dark:text-dark-primary dark:bg-dark-primary/10' 
                    : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="py-2 border-b border-support-gray dark:border-dark-support">
            <div className="px-3 py-2 text-sm font-medium text-foreground dark:text-dark-text">Tools</div>
            {toolLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 text-sm rounded-md ${
                  location.pathname === link.path 
                    ? 'text-primary-teal bg-primary-teal/5 dark:text-dark-primary dark:bg-dark-primary/10' 
                    : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="py-2">
            <div className="px-3 py-2 text-sm font-medium text-foreground dark:text-dark-text">Results</div>
            {resultLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 text-sm rounded-md ${
                  location.pathname === link.path 
                    ? 'text-primary-teal bg-primary-teal/5 dark:text-dark-primary dark:bg-dark-primary/10' 
                    : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;