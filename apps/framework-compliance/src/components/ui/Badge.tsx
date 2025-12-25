import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ children, variant = "default", size = "md", className = "" }: BadgeProps) {
  const getVariantStyles = (): string => {
    switch (variant) {
      case 'success':
        return 'bg-success/10 text-success border-success/20 dark:bg-success/20 dark:text-success dark:border-success/30';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20 dark:bg-warning/20 dark:text-warning dark:border-warning/30';
      case 'error':
        return 'bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20 dark:text-destructive dark:border-destructive/30';
      case 'info':
        return 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30';
      case 'secondary':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20 dark:bg-secondary/20 dark:text-secondary-foreground dark:border-secondary/30';
      default:
        return 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30';
    }
  };

  const getSizeStyles = (): string => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-3 py-1 text-sm';
      default:
        return 'px-2.5 py-0.5 text-xs';
    }
  };

  const styles = `${getVariantStyles()} ${getSizeStyles()}`;

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${styles} ${className}`}>
      {children}
    </span>
  );
}


