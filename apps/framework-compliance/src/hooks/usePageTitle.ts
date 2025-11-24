import { useEffect } from 'react';

/**
 * Hook to set page title consistently across the application
 * @param title - The page title (will be appended to base title)
 * @param baseTitle - Optional base title (defaults to 'CyberCorrect Privacy Platform')
 */
export const usePageTitle = (title: string, baseTitle: string = 'CyberCorrect Privacy Platform') => {
  useEffect(() => {
    const fullTitle = title 
      ? `${title} | ${baseTitle}`
      : baseTitle;
    
    document.title = fullTitle;
    
    // Update meta title for SEO
    const metaTitle = document.querySelector('meta[name="title"]');
    if (metaTitle) {
      metaTitle.setAttribute('content', fullTitle);
    }
    
    // Cleanup: restore default title on unmount
    return () => {
      document.title = baseTitle;
    };
  }, [title, baseTitle]);
};

