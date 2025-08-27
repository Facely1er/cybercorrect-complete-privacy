import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone,
  FileText,
  ClipboardCheck,
  Fingerprint,
  FileCheck,
  Database,
  BookOpen,
  HelpCircle,
  Info,
  FileQuestion,
  CircleDollarSign,
  Shield,
  Lock,
  Download
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
      <footer className="bg-surface border-t border-support-gray dark:bg-dark-surface dark:border-dark-support py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} CyberCorrect. All rights reserved.
            </p>
            <div className="flex mt-2 md:mt-0 space-x-4">
              <Link to="/documentation" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Documentation</Link>
              <Link to="/support" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Support</Link>
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Privacy</Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Redesigned compact footer for public routes
  return (
    <footer className="bg-surface border-t border-support-gray dark:bg-dark-surface dark:border-dark-support">
      <div className="container mx-auto px-6">
        {/* Main Footer Content - Reduced to 2 rows */}
        <div className="py-8 flex flex-col md:flex-row gap-8">
          {/* Company Info - Left column */}
          <div className="md:w-1/3">
            <Link to="/" className="flex items-center">
              <Logo size="medium" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Comprehensive CUI protection and privacy compliance solutions aligned with NIST 800-171 and the NIST Privacy Framework.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">+1 (240) 599-0102</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">contact@ermits.com</span>
              </div>
            </div>
          </div>
          
          {/* Navigation Links - Right columns */}
          <div className="md:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="text-base font-medium mb-3 text-foreground dark:text-dark-text">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/assessments/security-assessment" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><Database className="h-3.5 w-3.5 mr-1.5" />Security Assessment</Link></li>
                  <li><Link to="/assessments/privacy-assessment" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />Privacy Assessment</Link></li>
                  <li><Link to="/assessments/privacy-assessment" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><Fingerprint className="h-3.5 w-3.5 mr-1.5" />Privacy Assessment</Link></li>
                  <li><Link to="/toolkit/dpia-generator" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><FileCheck className="h-3.5 w-3.5 mr-1.5" />DPIA Generator</Link></li>
                  <li><Link to="/toolkit/gdpr-mapper" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><Database className="h-3.5 w-3.5 mr-1.5" />Data Flow Mapper</Link></li>
                </ul>
              </div>
              
              {/* Resources */}
              <div>
                <h3 className="text-base font-medium mb-3 text-foreground dark:text-dark-text">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/documentation" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><FileText className="h-3.5 w-3.5 mr-1.5" />Documentation</Link></li>
                  <li><Link to="/guides" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><BookOpen className="h-3.5 w-3.5 mr-1.5" />Guides</Link></li>
                  <li><Link to="/documentation/faqs" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><FileQuestion className="h-3.5 w-3.5 mr-1.5" />FAQs</Link></li>
                  <li><Link to="/support" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><HelpCircle className="h-3.5 w-3.5 mr-1.5" />Support</Link></li>
                  <li>
                    <a 
                      href="/assets/CMMC-2.0-Level-2-Checklist.pdf" 
                      download 
                      className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      CMMC 2.0 Checklist
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Company & Contact */}
              <div>
                <h3 className="text-base font-medium mb-3 text-foreground dark:text-dark-text">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/about" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><Info className="h-3.5 w-3.5 mr-1.5" />About</Link></li>
                  <li><Link to="/pricing" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><CircleDollarSign className="h-3.5 w-3.5 mr-1.5" />Pricing</Link></li>
                  <li><Link to="/privacy" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><Shield className="h-3.5 w-3.5 mr-1.5" />Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><Lock className="h-3.5 w-3.5 mr-1.5" />Terms of Service</Link></li>
                  <li><Link to="/cookies" className="text-muted-foreground hover:text-primary-teal dark:hover:text-dark-primary flex items-center"><FileText className="h-3.5 w-3.5 mr-1.5" />Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom - Copyright & Legal */}
        <div className="py-4 border-t border-support-gray dark:border-dark-support flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-muted-foreground">
            &copy; {currentYear} CyberCorrect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;