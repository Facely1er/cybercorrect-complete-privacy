/**
 * Guidance Tooltip Component
 * Provides contextual help and customer journey guidance
 */

import { useState } from 'react';
import { Info, X, HelpCircle } from 'lucide-react';
import { cn } from '../../utils/common';

interface GuidanceTooltipProps {
  content: string | React.ReactNode;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'info' | 'help' | 'guide';
  className?: string;
  children?: React.ReactNode;
}

export const GuidanceTooltip = ({
  content,
  title,
  position = 'top',
  variant = 'info',
  className,
  children,
}: GuidanceTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = variant === 'help' ? HelpCircle : Info;

  return (
    <div className={cn('relative inline-block', className)}>
      {children ? (
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-help"
        >
          {children}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors touch-target"
          aria-label="Show guidance"
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className={cn(
              'absolute z-50 w-64 sm:w-80 p-4 bg-popover border border-border rounded-lg shadow-lg animate-in',
              position === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
              position === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2',
              position === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2',
              position === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2'
            )}
            role="tooltip"
          >
            <div className="flex items-start justify-between mb-2">
              {title && (
                <h4 className="text-sm font-semibold text-foreground">{title}</h4>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="ml-2 text-muted-foreground hover:text-foreground transition-colors touch-target"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {typeof content === 'string' ? <p>{content}</p> : content}
            </div>
          </div>
        </>
      )}
    </div>
  );
};


