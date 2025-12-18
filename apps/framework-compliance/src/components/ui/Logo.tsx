import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'medium', showText = true }) => {
  // Size mappings using standard Tailwind classes
  const sizes = {
    small: 'h-6 w-auto', // Small size
    medium: 'h-12 w-auto', // Medium size
    large: 'h-14 w-auto', // Large size
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/cybercorrect.png" 
        alt="CyberCorrect Privacy Platform" 
        className={`${sizes[size]}`}
      />
      {showText && (
        <div className="ml-2 flex flex-col">
          <span className="font-bold text-foreground leading-tight">CyberCorrect<sup>™</sup> </span>
          <span className="text-xs text-foreground leading-tight">Privacy Platform </span>
          <span className="text-xs text-muted-foreground leading-tight">by ERMITS </span>
        </div>
      )}
    </div>
  );
};

export default Logo;