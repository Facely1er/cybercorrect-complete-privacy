 import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SunMoon, Moon, Menu, ChevronDown } from 'lucide-react';

import { Button } from '../ui/Button';
import { NotificationBell } from '../notifications/NotificationBell';

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
    { name: 'GDPR Mapper', path: '/toolkit/gdpr-mapper' },
    { name: 'Policy Generator', path: '/toolkit/privacy-policy-generator' },
  ];

  const resultLinks = [
    { name: 'Privacy Results', path: '/privacy-results' },
    { name: 'Privacy Recommendations', path: '/privacy-recommendations' },
  ];

  return (
    <header className="sticky top-0 z-50 flex h-16 flex-shrink-0 border-b border-border bg-background/95 dark:bg-dark-surface/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-2 sm:px-4 min-w-0">
        <div className="flex items-center min-w-0 flex-shrink">
          <Link to="/" className="flex items-center focus-ring rounded-md p-1" aria-label="CyberCorrect Privacy Platform Home">
            <span className="text-base sm:text-xl font-semibold text-foreground dark:text-dark-text transition-colors hover:text-primary dark:hover:text-dark-primary truncate">CyberCorrect Privacy Platform</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {/* Main Navigation */}
          <div className="relative">
            <button 
              className={`flex items-center text-foreground dark:text-dark-text hover:text-primary dark:hover:text-dark-primary px-3 py-2 text-sm font-medium rounded-md transition-colors focus-ring ${
                location.pathname.includes('assessment') ? 'text-primary dark:text-dark-primary' : ''
              }`}
              onClick={() => toggleDropdown('assessments')}
              aria-expanded={activeDropdown === 'assessments'}
              aria-haspopup="true"
              aria-label="Assessments menu"
            >
              Assessments
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${activeDropdown === 'assessments' ? 'transform rotate-180' : ''}`} aria-hidden="true" />
            </button>
            
            {activeDropdown === 'assessments' && (
              <div className="absolute left-0 mt-2 w-56 bg-popover dark:bg-dark-surface rounded-lg shadow-xl border border-border dark:border-dark-support backdrop-blur-sm animate-in slide-up">
                <div className="py-1">
                  {assessmentLinks.map(link => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center px-4 py-2.5 text-sm rounded-md transition-colors focus-ring ${
                        location.pathname === link.path 
                          ? 'text-primary bg-primary/10 dark:text-dark-primary dark:bg-dark-primary/10 font-medium' 
                          : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                      }`}
                      onClick={() => setActiveDropdown(null)}
                      aria-label={link.name}
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
              className={`flex items-center text-foreground dark:text-dark-text hover:text-primary dark:hover:text-dark-primary px-3 py-2 text-sm font-medium rounded-md transition-colors focus-ring ${
                location.pathname.includes('mapper') || location.pathname.includes('generator') ? 'text-primary dark:text-dark-primary' : ''
              }`}
              onClick={() => toggleDropdown('tools')}
              aria-expanded={activeDropdown === 'tools'}
              aria-haspopup="true"
              aria-label="Tools menu"
            >
              Tools
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${activeDropdown === 'tools' ? 'transform rotate-180' : ''}`} aria-hidden="true" />
            </button>
            
            {activeDropdown === 'tools' && (
              <div className="absolute left-0 mt-2 w-56 bg-popover dark:bg-dark-surface rounded-lg shadow-xl border border-border dark:border-dark-support backdrop-blur-sm animate-in slide-up">
                <div className="py-1">
                  {toolLinks.map(link => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center px-4 py-2.5 text-sm rounded-md transition-colors focus-ring ${
                        location.pathname === link.path 
                          ? 'text-primary bg-primary/10 dark:text-dark-primary dark:bg-dark-primary/10 font-medium' 
                          : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                      }`}
                      onClick={() => setActiveDropdown(null)}
                      aria-label={link.name}
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
              className={`flex items-center text-foreground dark:text-dark-text hover:text-primary dark:hover:text-dark-primary px-3 py-2 text-sm font-medium rounded-md transition-colors focus-ring ${
                location.pathname.includes('results') || location.pathname.includes('recommendations') ? 'text-primary dark:text-dark-primary' : ''
              }`}
              onClick={() => toggleDropdown('results')}
              aria-expanded={activeDropdown === 'results'}
              aria-haspopup="true"
              aria-label="Results menu"
            >
              Results
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${activeDropdown === 'results' ? 'transform rotate-180' : ''}`} aria-hidden="true" />
            </button>
            
            {activeDropdown === 'results' && (
              <div className="absolute left-0 mt-2 w-56 bg-popover dark:bg-dark-surface rounded-lg shadow-xl border border-border dark:border-dark-support backdrop-blur-sm animate-in slide-up">
                <div className="py-1">
                  {resultLinks.map(link => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center px-4 py-2.5 text-sm rounded-md transition-colors focus-ring ${
                        location.pathname === link.path 
                          ? 'text-primary bg-primary/10 dark:text-dark-primary dark:bg-dark-primary/10 font-medium' 
                          : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                      }`}
                      onClick={() => setActiveDropdown(null)}
                      aria-label={link.name}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center md:ml-6 space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-foreground dark:text-dark-text hover:bg-muted/70 dark:hover:bg-dark-support h-9 w-9 sm:h-10 sm:w-10"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunMoon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            )}
          </Button>
          
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-1.5 sm:p-2 rounded-md text-foreground dark:text-dark-text hover:text-primary dark:hover:text-dark-primary focus-ring transition-colors flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
          >
            <Menu className="block h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-16 left-0 right-0 bg-background/98 dark:bg-dark-surface/98 backdrop-blur-md border-b border-border dark:border-dark-support transition-all duration-300 ease-in-out overflow-hidden shadow-lg ${mobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 py-3 space-y-1 overflow-y-auto max-h-[calc(80vh-4rem)]">
          <div className="py-2 border-b border-border dark:border-dark-support">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assessments</div>
            {assessmentLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2.5 text-sm rounded-md transition-colors focus-ring ${
                  location.pathname === link.path 
                    ? 'text-primary bg-primary/10 dark:text-dark-primary dark:bg-dark-primary/10 font-medium' 
                    : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-label={link.name}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="py-2 border-b border-border dark:border-dark-support">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tools</div>
            {toolLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2.5 text-sm rounded-md transition-colors focus-ring ${
                  location.pathname === link.path 
                    ? 'text-primary bg-primary/10 dark:text-dark-primary dark:bg-dark-primary/10 font-medium' 
                    : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-label={link.name}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Results</div>
            {resultLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2.5 text-sm rounded-md transition-colors focus-ring ${
                  location.pathname === link.path 
                    ? 'text-primary bg-primary/10 dark:text-dark-primary dark:bg-dark-primary/10 font-medium' 
                    : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-label={link.name}
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