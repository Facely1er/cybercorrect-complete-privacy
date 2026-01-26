import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, HelpCircle, Mail, Eye, UserCheck, Lock, Cookie } from 'lucide-react';
import { useBrand } from '../../hooks/useBrand';
import { useAuth } from '../../hooks/useAuthContext';

export function Footer() {
  const { brand } = useBrand();
  const { userRole } = useAuth();
  const currentYear = new Date().getFullYear();
  
  // Check if user has HR or Admin access
  const isHROrAdmin = userRole === 'administrator' || userRole === 'hr_staff';
  const isAdmin = userRole === 'administrator';

  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-2 sm:py-2.5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 space-y-1 md:pr-4 lg:pr-6">
            <Link to="/" className="flex items-center gap-1 group">
              <img 
                src="/logos/cybercorrect-logo.png" 
                alt={brand.logo.alt} 
                className="h-5 w-5 flex-shrink-0 rounded-lg"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-[10px] leading-tight group-hover:text-primary transition-colors">CyberCorrect™</span>
                <span className="font-medium text-[9px] leading-tight text-muted-foreground">Privacy Portal</span>
                <span className="text-[8px] leading-tight text-muted-foreground">by ERMITS</span>
              </div>
            </Link>
            <p className="text-[9px] text-muted-foreground leading-tight line-clamp-2">
              {brand.description}
            </p>
            <p className="text-[8px] text-muted-foreground">
              CyberCorrect™ v1.0 · © {currentYear} ERMITS. All rights reserved.
            </p>
          </div>

          {/* Privacy Portal */}
          <div className="space-y-0.5 md:ml-2 lg:ml-4">
            <h3 className="font-semibold text-[9px] text-foreground flex items-center gap-0.5">
              <Eye className="h-2.5 w-2.5 text-primary" />
              Privacy Portal
            </h3>
            <ul className="space-y-0 text-[9px] leading-tight">
              <li className="leading-none">
                <Link to="/data-rights" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5">
                  <Eye className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Exercise Data Rights</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link to="/stakeholder-duties" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5">
                  <UserCheck className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>My Privacy Duties</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link to="/contact" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5">
                  <HelpCircle className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Privacy Support</span>
                </Link>
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
                <a 
                  href={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.cybercorrect.com'}/privacy`}
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Shield className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li className="leading-none">
                <a 
                  href={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.cybercorrect.com'}/terms`}
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Lock className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Terms of Service</span>
                </a>
              </li>
              <li className="leading-none">
                <a 
                  href={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.cybercorrect.com'}/cookies`}
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Cookie className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Cookie Policy</span>
                </a>
              </li>
              <li className="leading-none">
                <a 
                  href={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.cybercorrect.com'}/acceptable-use`}
                  className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Shield className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Acceptable Use</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div className="space-y-0.5">
            <h3 className="font-semibold text-[9px] text-foreground flex items-center gap-0.5">
              <HelpCircle className="h-2.5 w-2.5 text-primary" />
              Support
            </h3>
            <ul className="space-y-0 text-[9px] leading-tight">
              <li className="leading-none">
                <Link to="/faq" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5">
                  <HelpCircle className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>FAQ</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link to="/contact" className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors py-0.5">
                  <Mail className="h-2.5 w-2.5 flex-shrink-0" />
                  <span>Contact Support</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}