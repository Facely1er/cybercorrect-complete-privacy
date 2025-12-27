import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helpText?: string;
  description?: string; // Alias for helpText
  error?: string | boolean;
  errorMessage?: string; // Alias for error
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, helpText, description, error, errorMessage, indeterminate, ...props }, ref) => {
    // Normalize prop names
    const descriptionToShow = description || helpText;
    const errorToShow = typeof error === 'string' ? error : errorMessage;
    const hasError = !!error || !!errorMessage;

    // Handle indeterminate state
    const checkboxRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
      const checkbox = checkboxRef.current || (ref && typeof ref === 'object' && 'current' in ref ? ref.current : null);
      if (checkbox) {
        checkbox.indeterminate = indeterminate || false;
      }
    }, [indeterminate, ref]);

    const combinedRef = (node: HTMLInputElement) => {
      checkboxRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement>).current = node;
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            className={cn(
              'h-4 w-4 rounded border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              hasError && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            ref={combinedRef}
            {...props}
          />
          {label && (
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
        {descriptionToShow && !hasError && (
          <p className="text-sm text-muted-foreground">{descriptionToShow}</p>
        )}
        {errorToShow && (
          <p className="text-sm text-red-500">{errorToShow}</p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';