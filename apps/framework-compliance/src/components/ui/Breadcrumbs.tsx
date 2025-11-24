import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/common';

interface BreadcrumbsProps {
  className?: string;
  maxItems?: number;
  showHome?: boolean;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  className = '', 
  maxItems = 4,
  showHome = true 
}) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Comprehensive map of path segments to user-friendly names
  const pathNameMap: Record<string, string> = {
    // Main pages
    'pricing': 'Pricing',
    'features': 'Features',
    'demo': 'Demo',
    'integrations': 'Integrations',
    'login': 'Login',
    'profile': 'Profile',
    
    // Account pages
    'account': 'Account',
    'settings': 'Settings',
    'subscription': 'Subscription',
    
    // Legal pages
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service',
    'cookies': 'Cookie Policy',
    'acceptable-use': 'Acceptable Use Policy',
    'ecommerce': 'E-Commerce Policy',
    
    // Assessment pages
    'assessment-hub': 'Assessment Hub',
    'assessments': 'Assessments',
    'privacy-assessment': 'Privacy Assessment',
    'privacy-results': 'Privacy Results',
    'privacy-recommendations': 'Privacy Recommendations',
    'scheduled': 'Scheduled Assessments',
    
    // Project Management
    'project': 'Project Dashboard',
    'roadmap': 'Privacy Roadmap',
    'raci': 'RACI Matrix',
    'wbs': 'Work Breakdown Structure',
    'evidence': 'Evidence Vault',
    
    // Toolkit pages
    'toolkit': 'Toolkit',
    'privacy-gap-analyzer': 'Privacy Gap Analyzer',
    'privacy-policy-generator': 'Privacy Policy Generator',
    'gdpr-mapper': 'GDPR Mapper',
    'pii-data-flow-mapper': 'PII Data Flow Mapper',
    'privacy-rights-manager': 'Privacy Rights Manager',
    'dpia-generator': 'DPIA Generator',
    'employee-digital-footprint': 'Employee Digital Footprint',
    'data-broker-removal': 'Data Broker Removal',
    'privacy-settings-audit': 'Privacy Settings Audit',
    'privacy-maintenance-scheduler': 'Privacy Maintenance Scheduler',
    'consent-management': 'Consent Management',
    'vendor-risk-assessment': 'Vendor Risk Assessment',
    'retention-policy-generator': 'Retention Policy Generator',
    'dpia-manager': 'DPIA Manager',
    'privacy-by-design-assessment': 'Privacy by Design Assessment',
    'service-provider-manager': 'Service Provider Manager',
    'incident-response-manager': 'Incident Response Manager',
    
    // Dashboard pages
    'dashboard': 'Dashboard',
    'compliance-health': 'Compliance Health',
    'progress': 'Progress Tracking',
    
    // Reports
    'reports': 'Reports',
    'automated': 'Automated Reports',
    
    // Alerts
    'alerts': 'Alert Management',
    
    // Regulatory
    'regulatory': 'Regulatory Intelligence',
    
    // Resources
    'resources-landing': 'Resources',
    'documentation': 'Documentation',
    'guides': 'Guides',
    'support': 'Support',
    'chat': 'Chat Support',
    
    // Documentation pages
    'gdpr-implementation-guide': 'GDPR Implementation Guide',
    'assessment-guide': 'Assessment Guide',
    'getting-started': 'Getting Started',
    'quick-start': 'Quick Start',
    'platform-overview': 'Platform Overview',
    'understanding-dashboard': 'Understanding Dashboard',
    'understanding-rmf': 'Understanding RMF',
    'control-implementation-guide': 'Control Implementation Guide',
    'incident-response-guide': 'Incident Response Guide',
    'incident-reporting': 'Incident Reporting',
    'breach-response-guide': 'Breach Response Guide',
    'faqs': 'FAQs',
    'privacy-framework-guide': 'Privacy Framework Guide',
    
    // Guide pages
    'data-protection': 'Data Protection Guide',
    'privacy-by-design': 'Privacy by Design Guide',
    'data-subject-rights': 'Data Subject Rights Guide',
    'breach-notification': 'Breach Notification Guide',
    'privacy-impact-assessment': 'Privacy Impact Assessment Guide',
    
    // Role Journey pages
    'roles': 'Role-Based Workflows',
    'data-protection-officer': 'Data Protection Officer',
    'legal-counsel': 'Legal Counsel',
    'data-steward': 'Data Steward',
    'privacy-officer': 'Privacy Officer',
    
    // Template Viewers
    'viewers': 'Templates',
    'dpia-template': 'DPIA Template',
    'ccpa-policy': 'CCPA Policy',
    'gdpr-checklist': 'GDPR Checklist',
    'privacy-notice': 'Privacy Notice',
    'data-processing-record': 'Data Processing Record',
    
    // Monetization
    'monetization': 'Monetization',
    'templates': 'Template Store',
    'credits': 'Credits Manager',
    'store': 'Store',
    'one-time-products': 'One-Time Products',
    'products': 'Products',
    'checkout': 'Checkout',
    'success': 'Purchase Success',
    'activate-license': 'Activate License',
    
    // Notifications
    'notifications': 'Notifications',
    
    // Compliance redirect
    'compliance': 'Compliance'
  };

  const getBreadcrumbName = (segment: string) => {
    return pathNameMap[segment] || segment.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Implement breadcrumb truncation for long paths
  const shouldTruncate = pathnames.length > maxItems;
  const truncatedPathnames = shouldTruncate
    ? [...pathnames.slice(0, 1), '...', ...pathnames.slice(-(maxItems - 1))]
    : pathnames;

  // Create a mapping of truncated indices to original indices
  const getOriginalIndex = (truncatedIndex: number): number => {
    if (!shouldTruncate) {
      return truncatedIndex;
    }
    if (truncatedIndex === 0) {
      return 0; // First item
    }
    if (truncatedPathnames[truncatedIndex] === '...') {
      return -1; // Ellipsis
    }
    // For items after ellipsis, calculate their position
    // We show: [first, '...', last-(maxItems-2), ..., last-1, last]
    const itemsAfterEllipsis = truncatedIndex - 2; // Subtract first item and ellipsis
    const startOfLastItems = pathnames.length - (maxItems - 1);
    return startOfLastItems + itemsAfterEllipsis;
  };

  const renderBreadcrumbItem = (segment: string, truncatedIndex: number, isLast: boolean) => {
    if (segment === '...') {
      return (
        <React.Fragment key="ellipsis">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">...</span>
        </React.Fragment>
      );
    }

    const originalIndex = getOriginalIndex(truncatedIndex);
    if (originalIndex === -1) {
      return null; // Shouldn't happen, but handle gracefully
    }

    const routeTo = `/${pathnames.slice(0, originalIndex + 1).join('/')}`;
    
    return (
      <React.Fragment key={`${segment}-${truncatedIndex}`}>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        {isLast ? (
          <span className="text-foreground font-medium">
            {getBreadcrumbName(segment)}
          </span>
        ) : (
          <Link
            to={routeTo}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {getBreadcrumbName(segment)}
          </Link>
        )}
      </React.Fragment>
    );
  };
  
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)} aria-label="Breadcrumb">
      {showHome && (
        <Link
          to="/"
          className="flex items-center text-muted-foreground hover:text-primary transition-colors"
          title="Home"
        >
          <Home className="h-4 w-4" />
        </Link>
      )}
      
      {truncatedPathnames.map((segment, truncatedIndex) => {
        const originalIndex = getOriginalIndex(truncatedIndex);
        const isLast = originalIndex === pathnames.length - 1;
        return renderBreadcrumbItem(segment, truncatedIndex, isLast);
      })}
    </nav>
  );
};

export default Breadcrumbs;