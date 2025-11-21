import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Menu,
  X,
  Puzzle as PuzzlePiece,
  CircleDollarSign,
  BookOpen,
  User,
  SunMoon,
  Moon,
  HelpCircle,
  Home,
  ArrowRight,
  Eye,
  ChevronDown
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Breadcrumbs from '../ui/Breadcrumbs';
import { Button } from '../ui/Button';
import { useChatbot } from '../chat/ChatbotProvider';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';

interface LandingLayoutProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const LandingLayout = ({ toggleDarkMode, darkMode }: LandingLayoutProps) => {
  const { openChatbot } = useChatbot();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleViewDemo = () => {
    navigate('/demo');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Listen for scroll to add shadow to navbar
  useEffect(() => {
    const handleScroll = () => {
      // Add shadow to navbar on scroll
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add sticky header CTA that changes based on scroll position
  // Only show on landing page to avoid erroneous display
  const [showStickyCta, setShowStickyCta] = useState(false);
  const isLandingPage = location.pathname === '/';
  
  useEffect(() => {
    // Reset sticky CTA when navigating away from landing page
    if (!isLandingPage) {
      setShowStickyCta(false);
      return;
    }

    const handleScrollCta = () => {
      if (window.scrollY > 600) {
        setShowStickyCta(true);
      } else {
        setShowStickyCta(false);
      }
    };
    
    // Initial check
    handleScrollCta();
    
    window.addEventListener('scroll', handleScrollCta);
    return () => window.removeEventListener('scroll', handleScrollCta);
  }, [isLandingPage]);

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  // Main navigation structure with direct links
  const mainNavItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home
    },
    {
      name: 'Compliance',
      path: '/documentation/platform-overview',
      icon: PuzzlePiece,
      dropdown: true,
      dropdownItems: [
        { name: 'Data Protection Officer', path: '/roles/data-protection-officer' },
        { name: 'Legal Counsel', path: '/roles/legal-counsel' },
        { name: 'Data Steward', path: '/roles/data-steward' }
      ]
    },
    {
      name: 'Assessments',
      path: '/assessment-hub',
      icon: Home
    },
    {
      name: 'Toolkit',
      path: '/toolkit',
      icon: Home
    },
    {
      name: 'Pricing',
      path: '/pricing',
      icon: CircleDollarSign
    },
    {
      name: 'Demo',
      path: '/demo',
      icon: Eye
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''} bg-surface dark:bg-dark-bg`}>
      <nav className={`fixed top-0 left-0 right-0 z-20 bg-surface/90 dark:bg-dark-surface/90 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'py-1' : 'py-1'}`}>
        <div className="container mx-auto px-2 sm:px-4 max-w-full overflow-hidden">
          <div className="flex justify-between items-center h-14 gap-2 sm:gap-4 min-w-0">
            {/* Column 1: Logo (left) */}
            <div className="flex items-center flex-shrink-0 min-w-0">
              <Link to="/" className="flex items-center min-w-0">
                <Logo size="medium" />
              </Link>
            </div>
            
            {/* Column 2: Navigation (center) */}
            <div className="hidden lg:flex items-center flex-1 justify-center min-w-0 overflow-hidden">
                {mainNavItems?.map(item => {
                  if (item.dropdown) {
                    return (
                      <div key={item.name} className="relative">
                        <button 
                          className={`nav-link flex items-center text-foreground dark:text-dark-text hover:text-primary-teal dark:hover:text-dark-primary transition-colors duration-200 px-3 py-2 text-sm font-medium ${location.pathname === item.path ? 'text-primary-teal dark:text-dark-primary active' : ''}`}
                          onClick={() => toggleDropdown(item.name)}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.name}
                          <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${activeDropdown === item.name ? 'transform rotate-180' : ''}`} />
                        </button>
                        
                        {activeDropdown === item.name && (
                          <div className="absolute left-0 mt-1 w-56 bg-white dark:bg-dark-surface rounded-md shadow-lg border border-support-gray dark:border-dark-support z-50">
                            <div className="py-1">
                              <Link
                                to={item.path}
                                className={`flex items-center px-4 py-2 text-sm font-medium border-b border-support-gray dark:border-dark-support ${
                                  location.pathname === item.path 
                                    ? 'text-primary-teal bg-primary-teal/5 dark:text-dark-primary dark:bg-dark-primary/10' 
                                    : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                                }`}
                                onClick={() => setActiveDropdown(null)}
                              >
                                Overview
                              </Link>
                              {item.dropdownItems?.map(dropdownItem => (
                                <Link
                                  key={dropdownItem.name}
                                  to={dropdownItem.path}
                                  className={`flex items-center px-4 py-2 text-sm ${
                                    location.pathname === dropdownItem.path 
                                      ? 'text-primary-teal bg-primary-teal/5 dark:text-dark-primary dark:bg-dark-primary/10' 
                                      : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'
                                  }`}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {dropdownItem.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <Link 
                        key={item.name}
                        to={item.path}
                        className={`nav-link flex items-center text-foreground dark:text-dark-text hover:text-primary-teal dark:hover:text-dark-primary transition-colors duration-200 px-3 py-2 text-sm font-medium ${location.pathname === item.path ? 'text-primary-teal dark:text-dark-primary active' : ''}`}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  }
                })}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {/* Sticky CTA that appears on scroll - only on landing page */}
                {isLandingPage && showStickyCta && (
                  <Button 
                    className="hidden md:flex enhanced-button rounded-full shadow-glow animate-in slide-in-from-right" 
                    size="sm"
                    onClick={handleViewDemo}
                  >
                    View Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-md text-foreground dark:text-dark-text hover:text-primary-teal dark:hover:text-dark-primary transition-colors duration-200"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <SunMoon className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:scale-105 transition-transform" 
                  onClick={() => openChatbot()}
                  aria-label="Guide Me"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <Link to={user ? "/profile" : "/login"}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="flex items-center bg-primary-teal hover:bg-secondary-teal text-white dark:bg-dark-primary dark:hover:bg-dark-primary/90 rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                {/* Column 3: Action buttons (right) */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden ml-2 inline-flex items-center justify-center p-2 rounded-md text-foreground dark:text-dark-text hover:text-primary-teal dark:hover:text-dark-primary"
                  aria-expanded={mobileMenuOpen}
                  aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
        </div>
        
        {/* Mobile menu */}
        <div
          className={`lg:hidden absolute top-16 left-0 right-0 bg-surface dark:bg-dark-surface border-b border-support-gray dark:border-dark-support transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-[80vh]' : 'max-h-0'}`}
        >
          <div className="px-4 py-2 space-y-1 overflow-y-auto max-h-[calc(80vh-4rem)]">
            {mainNavItems?.map(item => {
              if (item.dropdown) {
                return (
                  <div key={item.name}>
                    <div className="px-3 py-2 text-sm font-medium text-foreground dark:text-dark-text">
                      <item.icon className="mr-3 h-5 w-5 inline" />
                      {item.name}
                    </div>
                    <Link
                      to={item.path}
                      className={`flex items-center px-6 py-2 text-base font-medium rounded-md ${location.pathname === item.path ? 'text-primary-teal bg-primary-teal/5 dark:text-dark-primary dark:bg-dark-primary/10' : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'}`}
                    >
                      Overview
                    </Link>
                    {item.dropdownItems?.map(dropdownItem => (
                      <Link
                        key={dropdownItem.name}
                        to={dropdownItem.path}
                        className={`flex items-center px-6 py-2 text-base font-medium rounded-md ${location.pathname === dropdownItem.path ? 'text-primary-teal bg-primary-teal/5 dark:text-dark-primary dark:bg-dark-primary/10' : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'}`}
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                );
              } else {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${location.pathname === item.path ? 'text-primary-teal bg-primary-teal/5 dark:text-dark-primary dark:bg-dark-primary/10' : 'text-foreground dark:text-dark-text hover:bg-muted dark:hover:bg-dark-support'}`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              }
            })}
          </div>
        </div>
      </nav>
      
      <main className="flex-1 mx-auto w-full max-w-screen-2xl pt-14 overflow-x-hidden">
        {(() => {
          const path = location.pathname;
          const isRoot = path === '/';
          const handledByNestedLayout = path.startsWith('/assessments') || path.startsWith('/toolkit');
          if (!isRoot && !handledByNestedLayout) {
            return (
              <div className="container mx-auto px-4 py-6">
                <Breadcrumbs className="mb-2" />
                <Outlet />
              </div>
            );
          }
          return <Outlet />;
        })()}
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingLayout;