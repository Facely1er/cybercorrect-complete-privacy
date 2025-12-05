import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, HelpCircle, Mail, CheckCircle, AlertCircle, Database, Eye, UserCheck, BarChart3, FileText, Lock, Cookie } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLocalUser } from '../../hooks/useLocalUser';
import { useBrand } from '../../hooks/useBrand';
import { useAuth } from '../../hooks/useAuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import { logger } from '../../utils/logger';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const { localUser, saveNewsletterSubscription } = useLocalUser();
  const { brand } = useBrand();
  const { userRole } = useAuth();
  const { addNotification } = useNotifications();
  
  // Check if user has HR or Admin access
  const isHROrAdmin = userRole === 'administrator' || userRole === 'hr_staff';
  const isAdmin = userRole === 'administrator';

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setSubscriptionSuccess(false);
    setSubscriptionError(null);
  };

  const handleSubscribe = () => {
    setSubscriptionSuccess(false);
    setSubscriptionError(null);
    
    if (!email) {
      setSubscriptionError('Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscriptionError('Please enter a valid email address');
      return;
    }
    
    setIsSubscribing(true);
    
    setTimeout(() => {
      setIsSubscribing(false);

      try {
        saveNewsletterSubscription(email);
        setSubscriptionSuccess(true);
        setEmail('');
        
        const subscribedEmails = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
        subscribedEmails.push({
          email,
          timestamp: new Date().toISOString(),
          userId: localUser?.id || 'anonymous'
        });
        localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscribedEmails));
      } catch (error) {
        logger.error('Error saving newsletter subscription', error, {
          component: 'Footer',
          operation: 'saveNewsletterSubscription',
          userId: localUser?.id
        });
        const errorMessage = 'Failed to save your subscription. Please try again.';
        setSubscriptionError(errorMessage);
        addNotification({
          type: 'error',
          title: 'Subscription Failed',
          message: errorMessage,
          timestamp: Date.now(),
          read: false,
          category: 'system'
        });
      }
    }, 1500);
  };

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isHROrAdmin ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
            {/* Brand */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-3 group">
                <img 
                  src="/logos/cybercorrect-logo.png" 
                  alt={brand.logo.alt} 
                  className="h-12 w-12 flex-shrink-0"
                />
                <div className="flex flex-col space-y-1">
                  <span className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">CyberCorrect™</span>
                  <span className="font-medium text-xs leading-tight text-muted-foreground">Privacy Portal</span>
                  <span className="text-xs text-muted-foreground leading-tight">by ERMITS</span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {brand.description}
              </p>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  © 2025 ERMITS LLC. All rights reserved.
                </p>
              </div>
            </div>

            {/* Privacy Portal Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-foreground mb-4">Privacy Portal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/data-rights" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <Eye className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Exercise Data Rights</span>
                  </Link>
                </li>
                <li>
                  <Link to="/stakeholder-duties" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <UserCheck className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>My Privacy Duties</span>
                  </Link>
                </li>
                {isHROrAdmin && (
                  <li>
                    <Link to="/privacy/dashboard" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                      <Database className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                      <span>Privacy Dashboard</span>
                    </Link>
                  </li>
                )}
                {isAdmin && (
                  <li>
                    <Link to="/privacy/stakeholders" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                      <Shield className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                      <span>Stakeholder Access</span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <HelpCircle className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Privacy Support</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Privacy Management - Only for HR/Admin */}
            {isHROrAdmin && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-foreground mb-4">Privacy Management</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link to="/privacy/obligations" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                      <FileText className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                      <span>Compliance Obligations</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy/incidents" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                      <Shield className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                      <span>Privacy Incidents</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy/vendors" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                      <Database className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                      <span>Vendor Assessments</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy/consent" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                      <UserCheck className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                      <span>Consent Management</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy/analytics" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                      <BarChart3 className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                      <span>Privacy Analytics</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
            
            {/* Legal */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-foreground mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a 
                    href={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.platform.cybercorrect.com'}/privacy`}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Shield className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.platform.cybercorrect.com'}/terms`}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Lock className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Terms of Service</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.platform.cybercorrect.com'}/cookies`}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Cookie className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Cookie Policy</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={`${import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.platform.cybercorrect.com'}/acceptable-use`}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Shield className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Acceptable Use Policy</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Support & Resources */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-foreground mb-4">Support & Resources</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a 
                    href={import.meta.env.VITE_MARKETING_SITE_URL || 'https://www.cybercorrect.com'} 
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Shield className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Marketing Site</span>
                  </a>
                </li>
                <li>
                  <a 
                    href={import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.platform.cybercorrect.com'} 
                    className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Database className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Framework Compliance</span>
                  </a>
                </li>
                <li>
                  <Link to="/legal" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <FileText className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Legal Notices</span>
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <HelpCircle className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>FAQ</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground flex items-center gap-3 transition-colors duration-200 group">
                    <Mail className="h-4 w-4 flex-shrink-0 group-hover:text-primary" />
                    <span>Contact Support</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter Section - Full Width */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold mb-1">Privacy Rights Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified about privacy regulation changes affecting workplace stakeholders.
                </p>
              </div>
              
              <div className="flex-shrink-0 w-full md:w-auto md:max-w-md space-y-3">
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="your.email@domain.com" 
                    value={email}
                    onChange={handleEmailChange}
                    disabled={isSubscribing}
                  />
                  <Button onClick={handleSubscribe} disabled={isSubscribing} size="sm">
                    {isSubscribing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Subscribe
                      </>
                    )}
                  </Button>
                </div>
                
                {subscriptionSuccess && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span>Success! You'll receive privacy rights and regulation updates.</span>
                  </div>
                )}
                
                {subscriptionError && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{subscriptionError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}