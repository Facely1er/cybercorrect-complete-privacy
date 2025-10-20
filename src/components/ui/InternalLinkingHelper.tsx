import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '../../utils/cn';

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'prominent' | 'button';
  showIcon?: boolean;
  external?: boolean;
  className?: string;
}

// Enhanced internal link component with SEO best practices
export const InternalLink: React.FC<InternalLinkProps> = ({ 
  href, 
  children, 
  variant = 'default',
  showIcon = false,
  external = false,
  className = ''
}) => {
  const baseClasses = "transition-colors duration-200 hover:underline";
  
  const variantClasses = {
    default: "text-primary hover:text-primary/80 font-medium",
    subtle: "text-muted-foreground hover:text-foreground",
    prominent: "text-primary font-semibold hover:text-primary/80 text-lg",
    button: "inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 no-underline hover:no-underline"
  };

  const linkProps = external ? {
    href,
    target: "_blank",
    rel: "noopener noreferrer"
  } : {
    to: href
  };

  const LinkComponent = external ? 'a' : Link;

  return (
    <LinkComponent
      {...linkProps}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {children}
      {showIcon && (
        <span className="ml-1">
          {external ? <ExternalLink className="h-4 w-4 inline" /> : <ArrowRight className="h-4 w-4 inline" />}
        </span>
      )}
    </LinkComponent>
  );
};

// Related content suggestions component
interface RelatedLink {
  title: string;
  href: string;
  description: string;
  category: string;
}

interface RelatedContentProps {
  currentPath: string;
  title?: string;
  className?: string;
}

export const RelatedContent: React.FC<RelatedContentProps> = ({ 
  currentPath, 
  title = "Related Resources",
  className = ""
}) => {
  // Define related content mapping based on current path
  const getRelatedLinks = (path: string): RelatedLink[] => {
    const linkMap: Record<string, RelatedLink[]> = {
      '/assessments/privacy-assessment': [
        { title: 'Privacy Project Manager', href: '/project', description: 'Manage privacy implementation projects', category: 'Project Management' },
        { title: 'GDPR Data Mapper', href: '/toolkit/gdpr-mapper', description: 'Map personal data processing', category: 'Tools' },
        { title: 'DPIA Generator', href: '/toolkit/dpia-generator', description: 'Generate impact assessments', category: 'Documentation' },
        { title: 'Privacy Policy Generator', href: '/toolkit/privacy-policy-generator', description: 'Create compliant privacy policies', category: 'Documentation' }
      ],
      '/assessments/privacy-assessment': [
        { title: 'Privacy Gap Analyzer', href: '/toolkit/privacy-gap-analyzer', description: 'Identify privacy compliance gaps', category: 'Analysis' },
        { title: 'Security Results', href: '/security-results', description: 'View assessment results', category: 'Results' },
        { title: 'Documentation Guide', href: '/documentation', description: 'Implementation documentation', category: 'Resources' }
      ],
      '/toolkit/gdpr-mapper': [
        { title: 'Privacy Assessment', href: '/assessments/privacy-assessment', description: 'Evaluate privacy compliance', category: 'Assessment' },
        { title: 'Data Subject Rights Manager', href: '/toolkit/privacy-rights-manager', description: 'Manage individual rights requests', category: 'Tools' },
        { title: 'GDPR Implementation Guide', href: '/documentation/gdpr-implementation-guide', description: 'Step-by-step GDPR compliance', category: 'Documentation' }
      ],
      '/project': [
        { title: 'Privacy Assessment', href: '/assessments/privacy-assessment', description: 'Start with baseline assessment', category: 'Assessment' },
        { title: 'Evidence Vault', href: '/project/evidence', description: 'Manage compliance evidence', category: 'Project Management' },
        { title: 'Implementation Roadmap', href: '/project/roadmap', description: 'Track implementation progress', category: 'Project Management' }
      ]
    };

    return linkMap[path] || [];
  };

  const relatedLinks = getRelatedLinks(currentPath);

  if (relatedLinks.length === 0) return null;

  return (
    <div className={cn("bg-muted/30 rounded-xl p-6 mt-8", className)}>
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedLinks.map((link, index) => (
          <InternalLink
            key={index}
            href={link.href}
            variant="default"
            className="block p-4 bg-background rounded-lg border hover:shadow-md transition-all duration-200 no-underline hover:no-underline"
          >
            <div>
              <div className="font-medium text-foreground mb-1">{link.title}</div>
              <div className="text-sm text-muted-foreground mb-2">{link.description}</div>
              <div className="text-xs text-primary font-medium">{link.category}</div>
            </div>
          </InternalLink>
        ))}
      </div>
    </div>
  );
};

// Contextual CTA component for strategic linking
interface ContextualCTAProps {
  currentPath: string;
  className?: string;
}

export const ContextualCTA: React.FC<ContextualCTAProps> = ({ currentPath, className = "" }) => {
  const getCTAForPath = (path: string) => {
    if (path.includes('documentation') || path.includes('guides')) {
      return {
        title: "Ready to Get Started?",
        description: "Put your knowledge into practice with our assessment tools",
        primaryAction: { text: "Start Privacy Assessment", href: "/assessments/privacy-assessment" },
        secondaryAction: { text: "Explore Tools", href: "/toolkit" }
      };
    }
    
    if (path.includes('assessment')) {
      return {
        title: "Assessment Complete?", 
        description: "Continue with implementation planning and project management",
        primaryAction: { text: "Create Privacy Project", href: "/project" },
        secondaryAction: { text: "View Tools", href: "/toolkit" }
      };
    }
    
    if (path.includes('toolkit')) {
      return {
        title: "Need a Comprehensive Approach?",
        description: "Start with an assessment or create a collaborative project",
        primaryAction: { text: "Privacy Assessment", href: "/assessments/privacy-assessment" },
        secondaryAction: { text: "Project Manager", href: "/project" }
      };
    }

    return null;
  };

  const cta = getCTAForPath(currentPath);
  if (!cta) return null;

  return (
    <div className={cn("bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-white mt-12", className)}>
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">{cta.title}</h3>
        <p className="text-white/90 mb-6">{cta.description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <InternalLink
            href={cta.primaryAction.href}
            variant="button"
            className="bg-white text-primary hover:bg-gray-100"
            showIcon
          >
            {cta.primaryAction.text}
          </InternalLink>
          <InternalLink
            href={cta.secondaryAction.href}
            variant="button"
            className="bg-transparent border-2 border-white hover:bg-white/10"
          >
            {cta.secondaryAction.text}
          </InternalLink>
        </div>
      </div>
    </div>
  );
};