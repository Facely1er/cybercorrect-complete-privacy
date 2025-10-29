import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-base font-medium leading-tight whitespace-normal break-words text-center min-w-0 max-w-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary-teal to-secondary-teal text-white hover:shadow-lg hover:brightness-110 dark:from-dark-primary dark:to-dark-primary/80",
        destructive: "bg-gradient-to-r from-alert-coral to-red-500 text-white hover:shadow-lg hover:brightness-110",
        outline: "border-2 border-primary/30 bg-transparent text-foreground hover:bg-primary hover:text-white hover:border-primary dark:border-dark-primary/30 dark:hover:bg-dark-primary",
        secondary: "bg-gradient-to-r from-secondary-teal to-accent-cyan text-white hover:shadow-lg hover:brightness-110",
        ghost: "hover:bg-primary/10 hover:text-primary dark:hover:bg-dark-primary/10 dark:hover:text-dark-primary",
        link: "underline-offset-4 hover:underline text-primary dark:text-dark-primary",
        success: "bg-gradient-to-r from-success-green to-green-500 text-white hover:shadow-lg hover:brightness-110",
        warning: "bg-gradient-to-r from-premium-gold to-yellow-500 text-gray-900 hover:shadow-lg hover:brightness-110",
        premium: "bg-gradient-to-r from-premium-gold via-yellow-400 to-premium-gold text-gray-900 hover:shadow-lg hover:brightness-110"
      },
      size: {
        default: "h-10 py-2.5 px-5 text-base",
        sm: "h-9 py-2 px-3.5 rounded-md text-sm",
        lg: "h-11 py-3 px-9 rounded-md text-base",
        xl: "h-12 py-3 px-12 rounded-md text-lg",
        icon: "h-10 w-10 text-base",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };