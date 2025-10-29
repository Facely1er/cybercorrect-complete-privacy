import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-medium leading-tight whitespace-normal break-words text-center min-w-0 max-w-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md transition-all duration-200",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md transition-all duration-200",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-md transition-all duration-200",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md transition-all duration-200",
        ghost: "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
        link: "underline-offset-4 hover:underline text-primary",
        success: "bg-success text-success-foreground hover:bg-success/90 hover:shadow-md transition-all duration-200",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 hover:shadow-md transition-all duration-200",
        premium: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-600 hover:shadow-lg transition-all duration-200"
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
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