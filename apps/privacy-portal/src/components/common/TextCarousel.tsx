import React, { useState, useEffect } from 'react';

interface TextCarouselProps {
  messages: string[];
  interval?: number;
  className?: string;
}

export function TextCarousel({ 
  messages, 
  interval = 4000, 
  className = '' 
}: TextCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (messages.length <= 1) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === messages.length - 1 ? 0 : prevIndex + 1
        );
        setIsAnimating(false);
      }, 300); // Half of fade transition time
      
    }, interval);

    return () => clearInterval(timer);
  }, [messages.length, interval]);

  if (messages.length === 0) return null;

  // Find the longest message to use as a height placeholder
  const longestMessage = messages.reduce((longest, msg) => 
    msg.length > longest.length ? msg : longest, 
    messages[0] || ''
  );

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative min-h-[3rem] md:min-h-[4rem] flex items-center justify-center">
        {/* Invisible placeholder to maintain consistent height */}
        <p 
          className="invisible text-center w-full"
          aria-hidden="true"
        >
          {longestMessage}
        </p>
        {/* Visible carousel text with absolute positioning */}
        <p 
          className={`absolute inset-0 flex items-center justify-center text-center w-full transition-opacity duration-600 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {messages[currentIndex]}
        </p>
      </div>
    </div>
  );
}