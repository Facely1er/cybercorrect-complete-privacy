// Optimized image component with modern format support and lazy loading
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes = '100vw',
  quality = 80, // eslint-disable-line @typescript-eslint/no-unused-vars
  loading = 'lazy',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized image sources
  const generateSources = (originalSrc: string) => {
    const baseName = originalSrc.replace(/\.[^/.]+$/, '');
    const extension = originalSrc.split('.').pop()?.toLowerCase();
    
    // Only generate modern formats for supported image types
    if (!['png', 'jpg', 'jpeg'].includes(extension || '')) {
      return [{ src: originalSrc, type: 'image/' + extension }];
    }

    const sources = [
      {
        src: `${baseName}.avif`,
        type: 'image/avif'
      },
      {
        src: `${baseName}.webp`,
        type: 'image/webp'
      },
      {
        src: originalSrc,
        type: `image/${extension}`
      }
    ];

    return sources;
  };

  // Check if browser supports modern formats
  const supportsAVIF = () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  };

  const supportsWebP = () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  useEffect(() => {
    // Select the best supported format
    const selectBestFormat = (sources: Array<{ src: string; type: string }>) => {
      if (supportsAVIF()) {
        return sources.find(s => s.type === 'image/avif') || sources[0];
      }
      if (supportsWebP()) {
        return sources.find(s => s.type === 'image/webp') || sources[0];
      }
      return sources[sources.length - 1]; // Fallback to original
    };
    
    const sources = generateSources(src);
    const bestSource = selectBestFormat(sources);
    setCurrentSrc(bestSource.src);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
    
    // Fallback to original image if modern format fails
    if (currentSrc !== src) {
      setCurrentSrc(src);
    }
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is in viewport, start loading
            if (imgRef.current && !imgRef.current.src) {
              imgRef.current.src = currentSrc;
            }
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [currentSrc, priority, loading]);

  if (hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-100 dark:bg-gray-800',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Blur placeholder */}
      {placeholder === 'blur' && blurDataURL && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            width,
            height
          }}
        />
      )}
      
      {/* Loading placeholder */}
      {!isLoaded && placeholder === 'empty' && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{ width, height }}
        />
      )}

      {/* Main image */}
      <picture>
        {generateSources(src).slice(0, -1).map((source, index) => (
          <source
            key={index}
            srcSet={source.src}
            type={source.type}
          />
        ))}
        <img
          ref={imgRef}
          src={priority || loading === 'eager' ? currentSrc : undefined}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={loading}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>
    </div>
  );
}