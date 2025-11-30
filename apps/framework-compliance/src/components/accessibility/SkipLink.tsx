import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

/**
 * Skip link component for keyboard navigation accessibility
 * Allows users to skip to main content
 */
export const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Skip to main content"
    >
      {children}
    </a>
  );
};

export default SkipLink;

