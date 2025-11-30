export interface Regulation {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  coverage?: string;
}

export const northAmericanRegulations: Regulation[] = [
  { 
    id: 'ada', 
    name: 'ADA', 
    fullName: 'Americans with Disabilities Act',
    description: 'Federal law protecting employee privacy and disability information',
    coverage: 'All employees and job applicants'
  },
  { 
    id: 'eeoc', 
    name: 'EEOC', 
    fullName: 'Equal Employment Opportunity Commission Guidelines',
    description: 'Federal guidelines protecting workplace privacy rights',
    coverage: 'All employees and job applicants'
  },
  { 
    id: 'ccpa', 
    name: 'CCPA', 
    fullName: 'California Consumer Privacy Act',
    description: 'California state privacy law including employment data',
    coverage: 'California residents'
  },
  { 
    id: 'bipa', 
    name: 'BIPA', 
    fullName: 'Biometric Information Privacy Act',
    description: 'Illinois biometric data protection law for workplace use',
    coverage: 'Illinois biometric data'
  },
  { 
    id: 'shield', 
    name: 'SHIELD', 
    fullName: 'Stop Hacks and Improve Electronic Data Security Act',
    description: 'New York data security law for employment data',
    coverage: 'New York residents'
  },
  { 
    id: 'cpra', 
    name: 'CPRA', 
    fullName: 'California Privacy Rights Act',
    description: 'Enhanced California privacy protections for employment',
    coverage: 'California residents'
  },
  { 
    id: 'pipeda', 
    name: 'PIPEDA', 
    fullName: 'Personal Information Protection and Electronic Documents Act',
    description: 'Canadian federal privacy law for employment data',
    coverage: 'Canadian residents'
  },
  { 
    id: 'gdpr', 
    name: 'GDPR', 
    fullName: 'General Data Protection Regulation',
    description: 'European Union privacy regulation for employment data',
    coverage: 'EU data subjects'
  },
  { 
    id: 'ferpa', 
    name: 'FERPA', 
    fullName: 'Family Educational Rights and Privacy Act',
    description: 'Federal law protecting employee employment records',
    coverage: 'All employees and families'
  },
  { 
    id: 'coppa', 
    name: 'COPPA', 
    fullName: 'Children\'s Online Privacy Protection Act',
    description: 'Federal law protecting children under 13 online',
    coverage: 'Students under 13'
  }
];