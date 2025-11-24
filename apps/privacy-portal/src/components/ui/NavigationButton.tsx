import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonProps } from './Button';

interface NavigationButtonProps extends Omit<ButtonProps, 'onClick'> {
  to: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  replace?: boolean;
  state?: Record<string, unknown>;
}

/**
 * A Button component that handles navigation internally.
 * This prevents the common anti-pattern of wrapping Button components with Link components.
 */
export const NavigationButton = React.forwardRef<HTMLButtonElement, NavigationButtonProps>(
  ({ to, onClick, replace = false, state, ...buttonProps }, ref) => {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Call the provided onClick handler first
      if (onClick) {
        onClick(e);
      }
      
      // Only navigate if the onClick handler didn't prevent default
      if (!e.defaultPrevented) {
        navigate(to, { replace, state });
      }
    };

    return (
      <Button
        {...buttonProps}
        ref={ref}
        onClick={handleClick}
      />
    );
  }
);

NavigationButton.displayName = 'NavigationButton';
