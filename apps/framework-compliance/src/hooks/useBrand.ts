// Brand hook for framework-compliance app
import { useMemo } from 'react';

export function useBrand() {
  const brand = useMemo(() => ({
    brandName: 'CyberCorrect',
    fullBrandName: 'CyberCorrect™ Framework Compliance',
    tagline: 'Framework Compliance',
    description: 'Privacy compliance framework assessment and gap analysis platform',
    productNameWithTM: 'CyberCorrect™ Framework Compliance',
    companyName: 'CyberCorrect',
    companyNameWithTM: 'CyberCorrect™',
    productName: 'CyberCorrect Framework Compliance',
    shortDescription: 'Privacy compliance framework assessment platform',
    fullDescription: 'Privacy compliance framework assessment and gap analysis platform',
    logo: {
      primary: '/cybercorrect.png',
      icon: '/cybercorrect.png',
      alt: 'CyberCorrect Logo'
    },
    colors: {
      primary: '#1E40AF',
      accent: '#1E3A8A',
      background: '#F8FAFF',
      text: '#0B1220'
    },
    contact: {
      supportEmail: 'support@cybercorrect.com',
      privacyEmail: 'privacy@cybercorrect.com',
      legalEmail: 'legal@cybercorrect.com',
      phone: '(240) 599-0102',
      address: 'Gaithersburg, MD 20877'
    },
    legal: {
      companyName: 'ERMITS',
      registeredAddress: 'Gaithersburg, MD 20877',
      country: 'United States',
      state: 'Maryland'
    },
    social: {
      website: 'https://cybercorrect.com'
    }
  }), []);

  return { brand };
}

