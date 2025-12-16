import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ClipboardCheck,
  Fingerprint,
  FileCheck,
  Database,
  BookOpen,
  HelpCircle,
  FileQuestion,
  Shield,
  Lock
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

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
              <Link to="/documentation" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Documentation</Link>
              <Link to="/support" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Support</Link>
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Privacy</Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Terms</Link>
              <Link to="/acceptable-use" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">AUP</Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Redesigned compact footer for public routes with refined styling - 1/3 size optimized
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-2 sm:py-3">
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Company Info */}
            <div className="space-y-2">
              <Link to="/" className="flex items-center gap-2 group">
                <img 
                  src="/cybercorrect.png" 
                  alt="CyberCorrect" 
                  className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 rounded-lg"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-xs sm:text-sm leading-tight group-hover:text-primary transition-colors">CyberCorrect™</span>
                  <span className="font-medium text-[10px] sm:text-xs leading-tight text-muted-foreground">Framework Compliance</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">by ERMITS</span>
                </div>
              </Link>
              <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                Comprehensive privacy compliance solutions aligned with NIST 800-171 and the NIST Privacy Framework.
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground pt-1">
                CyberCorrect™ v1.0 – Privacy & Data Rights Operations
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                © {currentYear} ERMITS. All rights reserved.
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                © {currentYear} ERMITS. All rights reserved.
              </p>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-2">
              <h3 className="font-semibold text-xs sm:text-sm text-foreground mb-2">Quick Links</h3>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li>
                  <Link to="/assessments/privacy-assessment" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200">
                    <ClipboardCheck className="h-3 w-3 flex-shrink-0" />
                    <span>Privacy Assessment</span>
                  </Link>
                </li>
                <li>
                  <Link to="/toolkit/gdpr-mapper" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200">
                    <Database className="h-3 w-3 flex-shrink-0" />
                    <span>GDPR Mapper</span>
                  </Link>
                </li>
                <li>
                  <Link to="/toolkit/privacy-rights-manager" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200">
                    <Fingerprint className="h-3 w-3 flex-shrink-0" />
                    <span>Rights Manager</span>
                  </Link>
                </li>
                <li>
                  <Link to="/toolkit/dpia-generator" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200">
                    <FileCheck className="h-3 w-3 flex-shrink-0" />
                    <span>DPIA Generator</span>
                  </Link>
                </li>
                <li>
                  <Link to="/toolkit/privacy-policy-generator" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200">
                    <FileText className="h-3 w-3 flex-shrink-0" />
                    <span>Policy Generator</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Resources */}
            <div className="space-y-2">
              <h3 className="font-semibold text-xs sm:text-sm text-foreground mb-2">Resources</h3>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li>
                  <Link to="/documentation" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200">
                    <FileText className="h-3 w-3 flex-shrink-0" />
                    <span>Documentation</span>
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200">
                    <BookOpen className="h-3 w-3 flex-shrink-0" />
                    <span>Guides</span>
                  </Link>
                </li>
                <li>
                  <Link to="/documentation/faqs" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200">
                    <FileQuestion className="h-3 w-3 flex-shrink-0" />
                    <span>FAQs</span>
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200">
                    <HelpCircle className="h-3 w-3 flex-shrink-0" />
                    <span>Support</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/"
                    className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200"
                  >
                    <Shield className="h-3 w-3 flex-shrink-0" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <a 
                    href={import.meta.env.VITE_PRIVACY_PORTAL_URL || 'https://www.portal.cybercorrect.com'} 
                    className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200"
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
              <h3 className="font-semibold text-xs sm:text-sm text-foreground mb-2">Legal</h3>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200">
                    <Shield className="h-3 w-3 flex-shrink-0" />
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200">
                    <Lock className="h-3 w-3 flex-shrink-0" />
                    <span>Terms of Service</span>
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200">
                    <FileText className="h-3 w-3 flex-shrink-0" />
                    <span>Cookie Policy</span>
                  </Link>
                </li>
                <li>
                  <Link to="/acceptable-use" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200">
                    <Shield className="h-3 w-3 flex-shrink-0" />
                    <span>Acceptable Use Policy</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;