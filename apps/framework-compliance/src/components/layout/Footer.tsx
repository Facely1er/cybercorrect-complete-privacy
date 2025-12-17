import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  Fingerprint,
  BookOpen,
  HelpCircle,
  Shield,
  Lock,
  Wrench,
  FolderKanban,
  BarChart3,
  Users,
  Target,
  Cookie
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');
  
  // Simplified minimal footer for authenticated app routes
  if (isAppRoute) {
    return (
      <footer className="bg-surface border-t border-support-gray dark:bg-dark-surface dark:border-dark-support py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xs text-muted-foreground">
              <div>CyberCorrect™ v1.0 – Privacy & Data Rights Operations</div>
              <div className="mt-1">© {currentYear} ERMITS. All rights reserved.</div>
            </div>
            <div className="flex mt-2 md:mt-0 space-x-4">
              <Link to="/resources" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Docs & Guides</Link>
              <Link to="/contact" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Contact</Link>
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Privacy</Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Footer with 4 columns (1 branding + 3 vertical menus)
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1 space-y-3 md:pr-6">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="/cybercorrect.png" 
                alt="CyberCorrect" 
                className="h-10 w-10 flex-shrink-0 rounded-lg"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">CyberCorrect™</span>
                <span className="font-medium text-xs leading-tight text-muted-foreground">Privacy Platform</span>
                <span className="text-[10px] leading-tight text-muted-foreground">by ERMITS</span>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-snug">
              Comprehensive privacy compliance solutions aligned with GDPR, CCPA, and the NIST Privacy Framework.
            </p>
            <div className="pt-2 space-y-1">
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                CyberCorrect™ v1.0
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                © {currentYear} ERMITS. All rights reserved.
              </p>
            </div>
          </div>
          
          {/* Platform */}
          <div className="space-y-2">
            <h3 className="font-semibold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5 text-primary" />
              Platform
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/assessment" className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
                  <Target className="h-3 w-3 flex-shrink-0" />
                  <span>Assessment</span>
                </Link>
              </li>
              <li>
                <Link to="/project" className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
                  <FolderKanban className="h-3 w-3 flex-shrink-0" />
                  <span>Project</span>
                </Link>
              </li>
              <li>
                <Link to="/compliance" className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
                  <Users className="h-3 w-3 flex-shrink-0" />
                  <span>Roles</span>
                </Link>
              </li>
              <li>
                <Link to="/toolkit" className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
                  <BarChart3 className="h-3 w-3 flex-shrink-0" />
                  <span>Toolkit</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <h3 className="font-semibold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Resources
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
                  <BookOpen className="h-3 w-3 flex-shrink-0" />
                  <span>Docs & Guides</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
                  <HelpCircle className="h-3 w-3 flex-shrink-0" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <a 
                  href={import.meta.env.VITE_PRIVACY_PORTAL_URL || 'https://www.portal.cybercorrect.com'} 
                  className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Fingerprint className="h-3 w-3 flex-shrink-0" />
                  <span>Privacy Portal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2">
            <h3 className="font-semibold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Legal
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
                  <Shield className="h-3 w-3 flex-shrink-0" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
                  <Lock className="h-3 w-3 flex-shrink-0" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link to="/acceptable-use" className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
                  <FileText className="h-3 w-3 flex-shrink-0" />
                  <span>Acceptable Use</span>
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
                  <Cookie className="h-3 w-3 flex-shrink-0" />
                  <span>Cookies Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;