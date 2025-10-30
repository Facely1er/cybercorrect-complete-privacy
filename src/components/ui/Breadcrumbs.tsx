import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

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

  // Map path segments to user-friendly names
  const pathNameMap: Record<string, string> = {
    'assessment-hub': 'Assessment Hub',
    'privacy-assessment': 'Privacy Assessment',
    'privacy-results': 'Privacy Results',
    'privacy-recommendations': 'Privacy Recommendations',
    'gdpr-mapper': 'GDPR Mapper',
    'toolkit': 'Toolkit',
    'resources-landing': 'Resources',
    'documentation': 'Documentation',
    'guides': 'Guides',
    'support': 'Support',
    'roles': 'Compliance',
    'data-protection-officer': 'Data Protection Officer',
    'legal-counsel': 'Legal Counsel',
    'data-steward': 'Data Steward',
    'viewers': 'Templates',
    'dpia-template': 'DPIA Template',
    'ccpa-policy': 'CCPA Policy',
    'gdpr-checklist': 'GDPR Checklist',
    'privacy-notice': 'Privacy Notice',
    'data-processing-record': 'Processing Records',
    'breach-notification': 'Breach Notification'
  };

  const getBreadcrumbName = (segment: string) => {
    return pathNameMap[segment] || segment.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Implement breadcrumb truncation for long paths
  const truncatedPathnames = pathnames.length > maxItems 
    ? [...pathnames.slice(0, 1), '...', ...pathnames.slice(-2)]
    : pathnames;

  const renderBreadcrumbItem = (segment: string, index: number, isLast: boolean) => {
    if (segment === '...') {
      return (
        <React.Fragment key="ellipsis">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">...</span>
        </React.Fragment>
      );
    }

    const routeTo = `/${pathnames.slice(0, pathnames.indexOf(segment) + 1).join('/')}`;
    
    return (
      <React.Fragment key={segment}>
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
      
      {truncatedPathnames.map((segment, index) => {
        const isLast = index === pathnames.length - 1;
        return renderBreadcrumbItem(segment, index, isLast);
      })}
    </nav>
  );
};

export default Breadcrumbs;