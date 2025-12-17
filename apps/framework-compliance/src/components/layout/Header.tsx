import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SunMoon, Moon, Menu, X, Home, ClipboardCheck, Wrench, User, Settings, LogOut, Users, ExternalLink, FolderKanban, BookOpen } from 'lucide-react';

import { Button } from '../ui/Button';
import { NotificationBell } from '../notifications/NotificationBell';

interface HeaderProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, darkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Assessment', href: '/assessment', icon: ClipboardCheck },
    { name: 'Project', href: '/project', icon: FolderKanban },
    { name: 'Roles', href: '/compliance', icon: Users },
    { name: 'Toolkit', href: '/toolkit', icon: Wrench },
    { name: 'Resources', href: '/resources', icon: BookOpen },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm border-border/50' 
        : 'bg-background/80 backdrop-blur-sm border-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/cybercorrect.png" 
                alt="CyberCorrect" 
                className="h-16 w-16"
              />
              <div className="hidden sm:flex sm:flex-col font-bold leading-tight">
                <span className="text-sm">CyberCorrect™</span>
                <span className="text-xs font-medium">Framework Compliance</span>
                <span className="text-xs font-normal text-muted-foreground">by ERMITS</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(item.href)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* Privacy Portal Link */}
            <a
              href={import.meta.env.VITE_PRIVACY_PORTAL_URL || 'https://www.portal.cybercorrect.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-full transition-all duration-200 border border-primary/20 hover:border-primary/30"
              title="Open Privacy Portal for Stakeholders"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Privacy Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            
            <NotificationBell />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-foreground hover:bg-accent h-8 w-8"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunMoon className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Account</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/account/settings"
                    className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation - Outside the flex container */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActivePath(item.href)
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-sm'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Privacy Portal - Mobile */}
            <div className="border-t border-border/50 pt-4 mt-4">
              <a
                href={import.meta.env.VITE_PRIVACY_PORTAL_URL || 'https://www.portal.cybercorrect.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 mx-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-sm">Privacy Portal</span>
                </div>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            {/* Mobile User Actions */}
            <div className="border-t border-border/50 pt-4 mt-4">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={toggleDarkMode}
                  >
                    {darkMode ? <SunMoon className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                  <NotificationBell />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;