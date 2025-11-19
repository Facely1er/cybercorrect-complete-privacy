import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium leading-tight whitespace-normal break-words text-center min-w-0 w-full sm:w-auto max-w-full overflow-hidden box-border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary-teal to-secondary-teal text-white hover:from-secondary-teal hover:to-primary-teal hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/25 transform transition-all duration-300 dark:from-dark-primary dark:to-dark-primary/80",
        destructive: "bg-gradient-to-r from-alert-coral to-red-500 text-white hover:from-red-500 hover:to-alert-coral hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/25 transform transition-all duration-300",
        outline: "border-2 border-primary-teal/30 bg-transparent hover:bg-primary-teal hover:text-white hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/25 hover:border-primary-teal transform transition-all duration-300",
        secondary: "bg-gradient-to-r from-secondary-teal to-accent-cyan text-white hover:from-accent-cyan hover:to-secondary-teal hover:-translate-y-1 hover:shadow-2xl hover:shadow-secondary/25 transform transition-all duration-300",
        ghost: "hover:bg-gradient-to-r hover:from-primary-teal/10 hover:to-secondary-teal/10 hover:text-primary-teal hover:-translate-y-1 hover:shadow-lg transform transition-all duration-300",
        link: "underline-offset-4 hover:underline text-primary-teal dark:text-dark-primary",
        success: "bg-gradient-to-r from-success-green to-green-500 text-white hover:from-green-500 hover:to-success-green hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/25 transform transition-all duration-300",
        warning: "bg-gradient-to-r from-premium-gold to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-premium-gold hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-500/25 transform transition-all duration-300",
        premium: "bg-gradient-to-r from-premium-gold via-yellow-400 to-premium-gold text-gray-900 hover:shadow-2xl hover:shadow-yellow-500/25 hover:-translate-y-1 transform transition-all duration-300 hover:scale-105"
      },
      size: {
        default: "min-h-10 py-2.5 px-3 sm:px-5 text-sm sm:text-base",
        sm: "min-h-9 py-2 px-2.5 sm:px-3.5 rounded-md text-xs sm:text-sm",
        lg: "min-h-11 py-3 px-4 sm:px-9 rounded-md text-sm sm:text-base",
        xl: "min-h-12 py-3 px-4 sm:px-12 rounded-md text-base sm:text-lg",
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
  ({ className, variant, size, rounded, children, type = "button", ...props }, ref) => {
    return (
      <button
        type={type}
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