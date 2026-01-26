import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Settings, LogOut, Home, Database, Eye, UserCheck, FileText, HelpCircle, Menu, X } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { useAuth } from '../../hooks/useAuthContext';
import { useBrand } from '../../hooks/useBrand';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { brand } = useBrand();

  // Handle scroll effect for sticky header
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Privacy Portal', href: '/privacy', icon: Database },
    { name: 'Exercise Data Rights', href: '/data-rights', icon: Eye },
    { name: 'My Privacy Duties', href: '/stakeholder-duties', icon: UserCheck },
    { name: 'How It Works', href: '/how-it-works', icon: HelpCircle },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full max-w-full border-b transition-all duration-300 overflow-hidden ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm border-border/50' 
        : 'bg-background/80 backdrop-blur-sm border-transparent'
    }`}>
      <div className="container mx-auto px-3 sm:px-4 max-w-full overflow-hidden">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-1.5 sm:gap-2 min-w-0 max-h-full">
          {/* Logo and Brand */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
              <img 
                src="/logos/cybercorrect-logo.png" 
                alt={brand.logo.alt} 
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 flex-shrink-0"
              />
              <div className="hidden md:flex md:flex-col font-bold leading-tight min-w-0">
                <span className="text-sm truncate">{brand.companyNameWithTM}</span>
                <span className="text-xs font-medium truncate">{brand.tagline}</span>
                <span className="text-xs font-normal text-muted-foreground truncate">by {brand.legal.companyName}</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 flex-shrink-0">
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
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0 touch-target"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            <ThemeToggle />
            <NotificationDropdown />
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-1 p-1.5 sm:p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden lg:inline text-sm">
                  {user ? (String(profile?.full_name || user.email?.split('@')[0] || 'Account')) : 'Account'}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg py-1 z-50">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          await signOut();
                        }}
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
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
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Mobile User Actions */}
            <div className="border-t border-border/50 pt-4 mt-4">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3">
                  <ThemeToggle />
                  <NotificationDropdown />
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-700 dark:text-gray-200 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                    {user ? (String(profile?.full_name || user.email?.split('@')[0] || 'Account')) : 'Account'}
                  </span>
                </div>
              </div>
              
              {user ? (
                <div className="space-y-2 mt-3">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-accent transition-all duration-200 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-accent transition-all duration-200 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await signOut();
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-accent transition-all duration-200 rounded-lg w-full text-left"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 mt-3">
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-accent transition-all duration-200 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-accent transition-all duration-200 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};