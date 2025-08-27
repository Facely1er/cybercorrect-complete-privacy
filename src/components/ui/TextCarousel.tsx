import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextCarouselProps {
  items: string[];
  interval?: number; // Time in milliseconds between transitions
  className?: string;
}

const TextCarousel: React.FC<TextCarouselProps> = ({ 
  items, 
  interval = 4000, // Default to 4 seconds
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    // Only set up the interval if we have multiple items
    if (items.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [items.length, interval]);
  
  return (
    <div className={`relative min-h-[4em] overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute w-full text-wrap flex items-center justify-center h-full"
        >
          {items[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TextCarousel;