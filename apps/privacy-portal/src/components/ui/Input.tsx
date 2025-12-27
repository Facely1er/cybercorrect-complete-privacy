import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helpText?: string;
  helperText?: string; // Alias for helpText
  error?: string | boolean;
  errorMessage?: string; // Alias for error
  success?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, helpText, helperText, error, errorMessage, success, size = 'md', ...props }, ref) => {
    // Normalize prop names
    const helperTextToShow = helperText || helpText;
    const errorToShow = typeof error === 'string' ? error : errorMessage;
    const hasError = !!error || !!errorMessage;

    // Size classes
    const sizeClasses = {
      sm: 'h-8 text-xs px-2',
      md: 'h-10 text-sm px-3',
      lg: 'h-12 text-base px-4'
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex w-full rounded-md border bg-background py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            sizeClasses[size],
            hasError && 'border-red-500 focus-visible:ring-red-500',
            success && 'border-green-500 focus-visible:ring-green-500',
            !hasError && !success && 'border-input',
            className
          )}
          ref={ref}
          {...props}
        />
        {helperTextToShow && !hasError && (
          <p className="text-sm text-muted-foreground">{helperTextToShow}</p>
        )}
        {errorToShow && (
          <p className="text-sm text-red-500">{errorToShow}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';