// Brand provider component for white label support
import React, { useEffect } from 'react';
import { brandService } from '../../services/brandService';
import { BrandContext } from '../../hooks/useBrandContext';

interface BrandProviderProps {
  children: React.ReactNode;
}

export function BrandProvider({ children }: BrandProviderProps) {
  const [brandData, setBrandData] = React.useState(() => brandService.getBrandedProps());

  useEffect(() => {
    // Initialize brand service and apply branding
    brandService.initialize();
    setBrandData(brandService.getBrandedProps());
  }, []);

  return (
    <BrandContext.Provider value={brandData}>
      {children}
    </BrandContext.Provider>
  );
}

// Brand-aware link component
interface BrandLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function BrandLink({ href, children, className = '', external = false }: BrandLinkProps) {
  const brand = useBrandContext();
  
  // Replace brand variables in href
  const brandedHref = href
    .replace('{brand.website}', brand.social?.website || '#')
    .replace('{brand.support}', `mailto:${brand.contact.supportEmail}`)
    .replace('{brand.privacy}', `mailto:${brand.contact.privacyEmail}`);
  
  if (external) {
    return (
      <a 
        href={brandedHref} 
        className={className}
        target="_blank" 
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  
  return (
    <a href={brandedHref} className={className}>
      {children}
    </a>
  );
}

// Brand-aware image component
interface BrandImageProps {
  type: 'primary' | 'icon';
  className?: string;
  alt?: string;
}

export function BrandImage({ type, className = '', alt }: BrandImageProps) {
  const brand = useBrandContext();
  const logo = brand.logo;
  
  return (
    <img 
      src={logo[type]} 
      alt={alt || logo.alt} 
      className={className}
      onError={(e) => {
        // Fallback to a generic logo if brand logo fails to load
        (e.target as HTMLImageElement).src = `data:image/svg+xml;base64,${btoa(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" fill="${brand.colors.primary}" rx="4"/>
            <text x="16" y="20" font-family="Arial" font-size="14" fill="white" text-anchor="middle">
              ${brand.brandName.charAt(0)}
            </text>
          </svg>
        `)}`;
      }}
    />
  );
}

// Brand-aware text component
interface BrandTextProps {
  type: 'name' | 'fullName' | 'tagline' | 'description' | 'companyName' | 'productName';
  trademark?: boolean;
  short?: boolean;
  className?: string;
}

export function BrandText({ type, trademark = false, short = false, className = '' }: BrandTextProps) {
  const brand = useBrandContext();
  
  const getText = () => {
    switch (type) {
      case 'name':
        return trademark ? `${brand.brandName}™` : brand.brandName;
      case 'fullName':
        return trademark ? `${brand.fullBrandName}™` : brand.fullBrandName;
      case 'tagline':
        return brand.tagline;
      case 'description':
        return short ? brand.shortDescription : brand.fullDescription;
      case 'companyName':
        return trademark ? brand.companyNameWithTM : brand.companyName;
      case 'productName':
        return trademark ? brand.productNameWithTM : brand.productName;
      default:
        return brand.brandName;
    }
  };

  return <span className={className}>{getText()}</span>;
}