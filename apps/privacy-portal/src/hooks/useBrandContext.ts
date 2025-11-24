import { createContext, useContext } from 'react';

export interface BrandContextType {
  brandName: string;
  fullBrandName: string;
  tagline: string;
  description: string;
  logo: {
    primary: string;
    icon: string;
    alt: string;
  };
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
  contact: {
    supportEmail: string;
    privacyEmail: string;
    legalEmail: string;
    phone: string;
    address: string;
  };
  legal: {
    companyName: string;
    registeredAddress: string;
    country: string;
    state: string;
  };
}

export const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const useBrandContext = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrandContext must be used within BrandProvider');
  }
  return context;
};