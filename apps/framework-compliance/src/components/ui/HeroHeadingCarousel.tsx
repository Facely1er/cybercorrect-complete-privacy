import { useState, useEffect } from 'react';

interface HeroHeadingCarouselProps {
  headings: React.ReactNode[];
  interval?: number;
  className?: string;
}

export function HeroHeadingCarousel({ 
  headings, 
  interval = 5000,
  className = '' 
}: HeroHeadingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (headings.length <= 1) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === headings.length - 1 ? 0 : prevIndex + 1
        );
        setIsAnimating(false);
      }, 300); // Half of fade transition time
      
    }, interval);

    return () => clearInterval(timer);
  }, [headings.length, interval]);

  if (headings.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`transition-opacity duration-500 ease-in-out ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {headings[currentIndex]}
      </div>
    </div>
  );
}

