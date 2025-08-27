import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className = '' }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Map path segments to user-friendly names
  const pathNameMap: Record<string, string> = {
    'assessment-hub': 'Assessment Hub',
    'cmmc-quick-check': 'CMMC Quick Check',
    'cui-assessment': 'CUI Assessment',
    'cui-results': 'CUI Results',
    'cui-recommendations': 'CUI Recommendations',
    'privacy-assessment': 'Privacy Assessment',
    'privacy-results': 'Privacy Results',
    'privacy-recommendations': 'Privacy Recommendations',
    'cui-mapper': 'CUI Data Flow Mapper',
    'poam-generator': 'POA&M Generator',
    'gdpr-mapper': 'GDPR Mapper',
    'toolkit': 'Toolkit',
    'resources-landing': 'Resources',
    'documentation': 'Documentation',
    'guides': 'Guides',
    'support': 'Support',
    'roles': 'Compliance',
    'privacy-officer': 'Privacy Officer',
    'it-security-team': 'IT Security Team',
    'compliance-manager': 'Compliance Manager'
  };

  const getBreadcrumbName = (segment: string) => {
    return pathNameMap[segment] || segment.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center text-muted-foreground hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
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
      })}
    </nav>
  );
};

export default Breadcrumbs;