import React from 'react';
import { useBrandContext, BrandContextType } from '../../hooks/useBrandContext';

// Higher-order component for brand-aware components
export function withBrand<P extends object>(
  Component: React.ComponentType<P & { brand: BrandContextType }>
) {
  return function BrandAwareComponent(props: P) {
    const brand = useBrandContext();
    return <Component {...props} brand={brand} />;
  };
}