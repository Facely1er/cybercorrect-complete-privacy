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
  CircleDollarSign,
  Shield,
  Lock,
  AlertTriangle,
  ShoppingCart
} from 'lucide-react';
import Logo from '../ui/Logo';
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
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} ERMITS LLC. All rights reserved.
            </p>
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

  // Redesigned compact footer for public routes with refined styling
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-3 group">
                <Logo size="medium" />
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Comprehensive privacy compliance solutions aligned with NIST 800-171 and the NIST Privacy Framework.
              </p>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  © {currentYear} ERMITS LLC. All rights reserved.
                </p>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/assessments/privacy-assessment" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <ClipboardCheck className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Privacy Assessment</span>
                  </Link>
                </li>
                <li>
                  <Link to="/toolkit/gdpr-mapper" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <Database className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>GDPR Mapper</span>
                  </Link>
                </li>
                <li>
                  <Link to="/toolkit/privacy-rights-manager" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <Fingerprint className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Rights Manager</span>
                  </Link>
                </li>
                <li>
                  <Link to="/toolkit/dpia-generator" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <FileCheck className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>DPIA Generator</span>
                  </Link>
                </li>
                <li>
                  <Link to="/toolkit/privacy-policy-generator" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <FileText className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Policy Generator</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Resources & Legal */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-foreground mb-4">Resources & Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/documentation" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <FileText className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Documentation</span>
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <BookOpen className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Guides</span>
                  </Link>
                </li>
                <li>
                  <Link to="/documentation/faqs" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <FileQuestion className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>FAQs</span>
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <HelpCircle className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Support</span>
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <Shield className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <Lock className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Terms of Service</span>
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