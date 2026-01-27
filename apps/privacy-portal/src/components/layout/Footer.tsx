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
          <div className="col-span-2 md:col-span-2 space-y-2.5 md:pr-4 lg:pr-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logos/cybercorrect-logo.png" 
                alt={brand.logo.alt} 
                className="h-14 w-14 flex-shrink-0 rounded-lg"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base leading-tight group-hover:text-primary transition-colors">CyberCorrect™</span>
                <span className="font-medium text-sm leading-tight text-muted-foreground">Privacy Portal</span>
                <span className="text-xs leading-tight text-muted-foreground">by ERMITS</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
              {brand.description}
            </p>
            <p className="text-xs text-muted-foreground">
              CyberCorrect™ v1.0 · © {currentYear} ERMITS. All rights reserved.
            </p>
          </div>

          {/* Privacy Portal */}
          <div className="space-y-2 md:ml-2 lg:ml-4">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Privacy Portal
            </h3>
            <ul className="space-y-0 text-sm leading-none">
              <li className="leading-none">
                <Link to="/data-rights" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors py-0">
                  <Eye className="h-4 w-4 flex-shrink-0" />
                  <span>Exercise Data Rights</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link to="/stakeholder-duties" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors py-0">
                  <UserCheck className="h-4 w-4 flex-shrink-0" />
                  <span>My Privacy Duties</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link to="/contact" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors py-0">
                  <HelpCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Privacy Support</span>
                </Link>
              </li>
            </ul>
          </div>
            
          {/* Legal */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Legal
            </h3>
            <ul className="space-y-0 text-sm leading-none">
              <li className="leading-none">
                <a 
                  href={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.cybercorrect.com'}/privacy`}
                  className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors py-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li className="leading-none">
                <a 
                  href={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.cybercorrect.com'}/terms`}
                  className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors py-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Lock className="h-4 w-4 flex-shrink-0" />
                  <span>Terms of Service</span>
                </a>
              </li>
              <li className="leading-none">
                <a 
                  href={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.cybercorrect.com'}/cookies`}
                  className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors py-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Cookie className="h-4 w-4 flex-shrink-0" />
                  <span>Cookie Policy</span>
                </a>
              </li>
              <li className="leading-none">
                <a 
                  href={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.cybercorrect.com'}/acceptable-use`}
                  className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors py-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  <span>Acceptable Use</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              Support
            </h3>
            <ul className="space-y-0 text-sm leading-none">
              <li className="leading-none">
                <Link to="/faq" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors py-0">
                  <HelpCircle className="h-4 w-4 flex-shrink-0" />
                  <span>FAQ</span>
                </Link>
              </li>
              <li className="leading-none">
                <Link to="/contact" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors py-0">
                  <Mail className="h-4 w-4 flex-shrink-0" />
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