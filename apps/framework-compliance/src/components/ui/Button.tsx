import React from 'react';
import { cn } from '@/utils/common';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          'touch-target min-h-[44px]', // Mobile touch target
          {
            'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 font-semibold shadow-sm': variant === 'default',
            'bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/80': variant === 'destructive',
            'border border-input bg-background hover:bg-accent active:bg-accent/80 hover:text-accent-foreground': variant === 'outline',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 font-medium': variant === 'secondary',
            'hover:bg-accent active:bg-accent/80 hover:text-accent-foreground': variant === 'ghost',
            'text-primary underline-offset-4 hover:underline active:text-primary/80': variant === 'link',
          },
          {
            'h-10 sm:h-10 px-4 py-2': size === 'default',
            'h-9 sm:h-9 rounded-md px-3 min-h-[44px]': size === 'sm',
            'h-11 sm:h-12 rounded-md px-6 sm:px-8 min-h-[48px]': size === 'lg',
            'h-10 w-10 min-h-[44px] min-w-[44px]': size === 'icon',
          },
          className
        )}
        ref={ref}
        aria-label={ariaLabel || (typeof props.children === 'string' ? props.children : undefined)}
        role={props.type === 'button' ? 'button' : undefined}
        tabIndex={props.disabled ? -1 : 0}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };