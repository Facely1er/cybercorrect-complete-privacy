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
  Target,
  Cookie,
  Route,
  CreditCard,
  Radar,
  FileCheck,
  Database,
  ExternalLink
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');
  
  // Simplified minimal footer for authenticated app routes
  if (isAppRoute) {
    return (
      <footer className="bg-background border-t border-border py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xs text-muted-foreground">
              <div>CyberCorrect™ v1.0 – Privacy & Data Rights Operations</div>
              <div className="mt-1">© {currentYear} ERMITS. All rights reserved.</div>
            </div>
            <div className="flex mt-2 md:mt-0 space-x-4">
              <Link to="/faq" className="text-xs text-muted-foreground hover:text-primary">FAQ</Link>
              <Link to="/resources" className="text-xs text-muted-foreground hover:text-primary">Docs</Link>
              <Link to="/contact" className="text-xs text-muted-foreground hover:text-primary">Contact</Link>
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Footer with 3 navigation columns + Legal (5 columns total including company info)
  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-2 sm:py-2.5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-2 space-y-1 md:pr-4 lg:pr-6">
            <Link to="/" className="flex items-center gap-1 group">
              <img 
                src="/cybercorrect.png" 
                alt="CyberCorrect" 
                className="h-5 w-5 flex-shrink-0 rounded-lg"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-[10px] leading-tight group-hover:text-primary transition-colors">
                  CyberCorrect™
                </span>
                <span className="font-medium text-[9px] leading-tight text-muted-foreground">
                  Privacy Platform
                </span>
                <span className="text-[8px] leading-tight text-muted-foreground">by ERMITS</span>
              </div>
            </Link>
            <p className="text-[9px] text-muted-foreground leading-tight line-clamp-2">
              Comprehensive privacy compliance solutions aligned with GDPR, CCPA, and the NIST Privacy Framework.
            </p>
            <p className="text-[8px] text-muted-foreground">
              CyberCorrect™ v1.0 · © {currentYear} ERMITS. All rights reserved.
            </p>
          </div>
          
          {/* Column 1: Platform */}
          <div className="space-y-0.5 md:ml-2 lg:ml-4">
            <h3 className="font-semibold text-[9px] text-foreground flex items-center gap-0.5">
              <Route className="h-2.5 w-2.5 text-primary" />
              Platform
            </h3>
            <ul className="space-y-0 text-[9px] leading-tight">
              <li className="leading-none">
                <Link 
                  to="/assessment" 
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                >
                  <Target className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Assessment</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link 
                  to="/compliance" 
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                >
                  <Route className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Your Journey</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link 
                  to="/project" 
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                >
                  <FolderKanban className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Project</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link 
                  to="/toolkit" 
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                >
                  <Wrench className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Toolkit</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Tools */}
          <div className="space-y-0.5">
            <h3 className="font-semibold text-[9px] text-foreground flex items-center gap-0.5">
              <Wrench className="h-2.5 w-2.5 text-primary" />
              Tools
            </h3>
            <ul className="space-y-0 text-[9px] leading-tight">
              <li className="leading-none">
                <Link 
                  to="/toolkit/privacy-risk-radar" 
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                >
                  <Radar className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Risk Radar</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link 
                  to="/toolkit/privacy-gap-analyzer" 
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                >
                  <BarChart3 className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Gap Analyzer</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link 
                  to="/toolkit/dpia-generator" 
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                >
                  <FileCheck className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>DPIA Generator</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link 
                  to="/toolkit/gdpr-mapper" 
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                >
                  <Database className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>GDPR Mapper</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-0.5">
            <h3 className="font-semibold text-[9px] text-foreground flex items-center gap-0.5">
              <HelpCircle className="h-2.5 w-2.5 text-primary" />
              Support
            </h3>
            <ul className="space-y-0 text-[9px] leading-tight">
              <li className="leading-none">
                <Link 
                  to="/faq" 
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                >
                  <HelpCircle className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>FAQ</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link 
                  to="/resources" 
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                >
                  <BookOpen className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Documentation</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                >
                  <HelpCircle className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Contact</span>
                </Link>
              </li>
              <li className="leading-none">
                <a 
                  href={import.meta.env.VITE_PRIVACY_PORTAL_URL || 'https://www.portal.cybercorrect.com'} 
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Fingerprint className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Privacy Portal</span>
                  <ExternalLink className="h-2 w-2 ml-0.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-0.5">
            <h3 className="font-semibold text-[9px] text-foreground flex items-center gap-0.5">
              <Shield className="h-2.5 w-2.5 text-primary" />
              Legal
            </h3>
            <ul className="space-y-0 text-[9px] leading-tight">
              <li className="leading-none">
                <Link to="/privacy" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5">
                  <Shield className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link to="/terms" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5">
                  <Lock className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link to="/acceptable-use" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5">
                  <FileText className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Acceptable Use</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link to="/cookies" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5">
                  <Cookie className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Cookies Policy</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link to="/ecommerce#refund-policy" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5">
                  <CreditCard className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Refund Policy</span>
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
