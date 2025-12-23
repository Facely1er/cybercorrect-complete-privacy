/**
 * Artifact Generators
 * Generate downloadable PDF, Word, and Excel files from artifact previews
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { addCyberCorrectHeader, addCyberCorrectFooter } from '../pdf/logoUtils';
import { generateWordDocument, type WordDocumentData } from '../export/generateWord';
import { generateExcelWorkbook, type ExcelWorkbookData } from '../export/generateExcel';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head?: string[][];
      body?: Array<Array<string | number>>;
      startY?: number;
      headStyles?: Record<string, unknown>;
      alternateRowStyles?: Record<string, unknown>;
    }) => jsPDF;
  }
}

export interface ArtifactData {
  productId: string;
  artifactId: string;
  title: string;
  format: 'PDF' | 'Word' | 'Excel' | 'Interactive';
  content: any; // The artifact content structure
}

/**
 * Generate DPIA Sample PDF
 */
export async function generateDpiaSamplePdf(): Promise<void> {
  const doc = new jsPDF();
  let y = await addCyberCorrectHeader(doc, 'Data Protection Impact Assessment (DPIA)', 'Sample Template');
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 20, y);
  y += 5;
  doc.text(`Assessment Version: 1.0`, 20, y);
  y += 5;
  doc.text(`Next Review Date: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}`, 20, y);
  y += 5;
  doc.text(`Assessed By: Data Protection Officer`, 20, y);
  y += 10;

  // Executive Summary
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('1. Executive Summary', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const execSummary = 'This Data Protection Impact Assessment (DPIA) evaluates the privacy risks associated with the processing of personal data in our customer relationship management system. The assessment identifies potential risks to data subjects\' rights and freedoms and outlines mitigation measures to address identified risks.';
  const execLines = doc.splitTextToSize(execSummary, 170);
  doc.text(execLines, 20, y);
  y += execLines.length * 5 + 10;

  // Processing Activity
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('2. Description of Processing Activity', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Processing Activity Name: Customer Data Collection and Storage', 20, y);
  y += 6;
  doc.text('Purpose: To manage customer relationships, process orders, provide customer support, and maintain service records.', 20, y);
  y += 6;
  doc.text('Legal Basis: Contract performance (GDPR Article 6(1)(b)) and Legitimate Interest (GDPR Article 6(1)(f))', 20, y);
  y += 6;
  doc.text('Processing Duration: For the duration of the customer relationship plus 7 years for legal compliance', 20, y);
  y += 10;

  // Data Categories
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('3. Categories of Personal Data', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const dataCategories = [
    ['Category', 'Examples'],
    ['Identity Data', 'Full name, email, phone, address, date of birth'],
    ['Financial Data', 'Payment card info (tokenized), billing address, transaction history'],
    ['Technical Data', 'IP address, browser type, device info, usage analytics'],
    ['Profile Data', 'Preferences, purchase history, support tickets, communication preferences']
  ];
  doc.autoTable({
    head: [dataCategories[0]],
    body: dataCategories.slice(1),
    startY: y,
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // Risk Assessment
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('4. Risk Assessment', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(255, 150, 0);
  doc.text('Overall Risk Level: MEDIUM', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const risks = [
    ['Risk', 'Likelihood', 'Impact', 'Mitigation'],
    ['Unauthorized Access', 'Medium', 'High', 'MFA, RBAC, access reviews, IDS'],
    ['Data Breach', 'Low', 'High', 'Encryption, security audits, incident response'],
    ['Inadequate Retention', 'Medium', 'Medium', 'Automated retention policies, scheduled deletion'],
    ['Insufficient Transparency', 'Low', 'Medium', 'Clear privacy notices, accessible policies']
  ];
  doc.autoTable({
    head: [risks[0]],
    body: risks.slice(1),
    startY: y,
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // Mitigation Measures
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('5. Mitigation Measures', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const measures = [
    'Encryption at rest (AES-256) and in transit (TLS 1.3)',
    'Multi-factor authentication (MFA) for all system access',
    'Role-based access control (RBAC) with principle of least privilege',
    'Regular security audits and penetration testing (quarterly)',
    'Intrusion detection and monitoring systems (24/7)',
    'Automated backup and disaster recovery procedures',
    'Privacy training for all staff (annually)',
    'Data Protection Officer (DPO) oversight and consultation',
    'Incident response plan with 72-hour notification procedures',
    'Regular data protection impact assessments (annually)'
  ];
  measures.forEach((measure, index) => {
    doc.text(`${index + 1}. ${measure}`, 20, y);
    y += 5;
  });

  addCyberCorrectFooter(doc);
  const filename = `dpia-sample-template-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

/**
 * Generate Privacy Policy Word Document
 */
export async function generatePrivacyPolicyWord(): Promise<void> {
  const wordData: WordDocumentData = {
    title: 'Privacy Policy Template',
    subtitle: 'GDPR, CCPA, and Multi-Jurisdiction Compliant',
    metadata: {
      generatedAt: new Date().toLocaleDateString(),
      generatedBy: 'CyberCorrect Privacy Platform',
      version: '1.0'
    },
    sections: [
      {
        title: '1. Introduction',
        content: 'This privacy policy explains how we collect, use, and protect your personal information in compliance with GDPR, CCPA, and other applicable regulations. We are committed to protecting your privacy and ensuring transparency about our data practices.',
        level: 1
      },
      {
        title: '2. Data We Collect',
        content: [
          'We collect information you provide directly when you:',
          '• Register for an account or use our services',
          '• Make a purchase or transaction',
          '• Contact us for support or inquiries',
          '• Subscribe to newsletters or marketing communications',
          '',
          'We automatically collect information when you:',
          '• Use our website or mobile applications',
          '• Interact with our services',
          '• Navigate through our platform',
          '',
          'We may also collect information from third-party sources as permitted by law.'
        ],
        level: 1
      },
      {
        title: '3. How We Use Your Data',
        content: [
          'We use your information to:',
          '• Provide, maintain, and improve our services',
          '• Process transactions and send related information',
          '• Send technical notices, updates, and support messages',
          '• Respond to your comments, questions, and requests',
          '• Monitor and analyze trends, usage, and activities',
          '• Personalize and improve your experience',
          '• Comply with legal obligations and protect our rights'
        ],
        level: 1
      },
      {
        title: '4. Legal Basis for Processing (GDPR)',
        content: 'We process your personal data based on the following legal bases: consent (Article 6(1)(a)), contract performance (Article 6(1)(b)), legal obligation (Article 6(1)(c)), legitimate interests (Article 6(1)(f)), and vital interests (Article 6(1)(d)).',
        level: 1
      },
      {
        title: '5. Data Subject Rights',
        content: [
          'Under GDPR and CCPA, you have the right to:',
          '• Access your personal data (Article 15 GDPR)',
          '• Rectify inaccurate data (Article 16 GDPR)',
          '• Erasure ("right to be forgotten") (Article 17 GDPR)',
          '• Restrict processing (Article 18 GDPR)',
          '• Data portability (Article 20 GDPR)',
          '• Object to processing (Article 21 GDPR)',
          '• Withdraw consent at any time',
          '• Opt-out of sale of personal information (CCPA)'
        ],
        level: 1
      },
      {
        title: '6. Data Retention',
        content: 'We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Retention periods vary based on the type of data and legal requirements.',
        level: 1
      },
      {
        title: '7. Data Security',
        content: 'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, regular security assessments, and staff training.',
        level: 1
      },
      {
        title: '8. International Transfers',
        content: 'Your data may be transferred to countries outside the European Economic Area (EEA). We ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs), adequacy decisions, or Binding Corporate Rules (BCRs).',
        level: 1
      },
      {
        title: '9. Cookies and Tracking Technologies',
        content: 'We use cookies and similar tracking technologies to collect and use information about you. You can control cookies through your browser settings. For more information, please see our Cookie Policy.',
        level: 1
      },
      {
        title: '10. Contact Information',
        content: 'For questions about this privacy policy or to exercise your rights, please contact us at privacy@yourcompany.com or our Data Protection Officer at dpo@yourcompany.com.',
        level: 1
      }
    ]
  };

  await generateWordDocument(wordData, `privacy-policy-template-${new Date().toISOString().split('T')[0]}.docx`);
}

/**
 * Generate Gap Analysis Excel Workbook
 */
export function generateGapAnalysisExcel(): void {
  const excelData: ExcelWorkbookData = {
    sheets: [
      {
        name: 'Gap Analysis Summary',
        headers: ['Domain', 'Compliant', 'Partial', 'Gaps', 'Total Controls', 'Compliance %'],
        rows: [
          ['Govern', 12, 5, 3, 20, '60%'],
          ['Identify', 15, 3, 2, 20, '75%'],
          ['Control', 10, 6, 4, 20, '50%'],
          ['Communicate', 14, 4, 2, 20, '70%'],
          ['Protect', 11, 5, 4, 20, '55%'],
          ['TOTAL', 62, 23, 15, 100, '62%']
        ]
      },
      {
        name: 'Priority Gaps',
        headers: ['Gap ID', 'Control', 'Framework', 'Priority', 'Impact', 'Timeline', 'Status'],
        rows: [
          ['GAP-001', 'Data Retention Policy', 'GDPR', 'High', 'Legal Compliance', '30 days', 'In Progress'],
          ['GAP-002', 'Consent Mechanisms', 'GDPR', 'High', 'Legal Compliance', '45 days', 'Planned'],
          ['GAP-003', 'DPIA Process', 'GDPR', 'Medium', 'Risk Management', '60 days', 'Planned'],
          ['GAP-004', 'Data Subject Rights Portal', 'GDPR', 'High', 'Legal Compliance', '90 days', 'Planned'],
          ['GAP-005', 'Breach Notification Procedures', 'GDPR', 'High', 'Legal Compliance', '30 days', 'In Progress']
        ]
      },
      {
        name: 'Compliance Roadmap',
        headers: ['Action Item', 'Priority', 'Timeline', 'Owner', 'Status', 'Completion %'],
        rows: [
          ['Update Data Retention Policies', 'High', '30 days', 'DPO', 'In Progress', '60%'],
          ['Enhance Consent Mechanisms', 'High', '45 days', 'Legal Team', 'Planned', '0%'],
          ['Formalize DPIA Process', 'Medium', '60 days', 'Privacy Officer', 'Planned', '0%'],
          ['Implement DSR Portal', 'High', '90 days', 'IT Team', 'Planned', '0%'],
          ['Establish Breach Procedures', 'High', '30 days', 'Security Team', 'In Progress', '40%']
        ]
      }
    ],
    metadata: {
      title: 'Privacy Gap Analysis Report',
      author: 'CyberCorrect Privacy Platform',
      created: new Date().toISOString()
    }
  };

  generateExcelWorkbook(excelData, `gap-analysis-report-${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Generate Breach Notification Word Document
 */
export async function generateBreachNotificationWord(): Promise<void> {
  const wordData: WordDocumentData = {
    title: 'Data Breach Notification Template',
    subtitle: 'GDPR Article 33 & 34 Compliant',
    metadata: {
      generatedAt: new Date().toLocaleDateString(),
      generatedBy: 'CyberCorrect Privacy Platform',
      version: '1.0'
    },
    sections: [
      {
        title: '1. Incident Overview',
        content: [
          `Incident ID: INC-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}-001`,
          `Date Detected: ${new Date().toLocaleString()}`,
          `Date Occurred: [Estimated date/time of breach]`,
          `Date Reported: ${new Date().toLocaleDateString()}`,
          'Incident Type: Unauthorized access / Data breach / System compromise',
          'Severity Level: High / Medium / Low',
          'Affected Data Categories: Contact information, email addresses, names, [other categories]',
          'Number of Data Subjects Affected: [Number] individuals',
          'Geographic Scope: [Countries/regions affected]'
        ],
        level: 1
      },
      {
        title: '2. Nature of the Breach',
        content: [
          'Description: [Detailed description of what happened, how the breach occurred, and what systems/data were affected]',
          'Cause: [Suspected or confirmed cause - e.g., cyberattack, human error, system failure, insider threat]',
          'Attack Vector: [If applicable - e.g., phishing, malware, SQL injection, unauthorized access]',
          'Data Compromised: [Specific data types and sensitivity levels]',
          'Potential Impact: [Assessment of potential harm to data subjects]'
        ],
        level: 1
      },
      {
        title: '3. Immediate Response Actions',
        content: [
          '✓ Containment measures implemented - [Details]',
          '✓ System isolation completed - [Affected systems isolated]',
          '✓ Investigation initiated - [Investigation team and timeline]',
          '✓ Forensic analysis commenced - [Tools and methods]',
          '✓ Access credentials revoked/changed - [Number of accounts]',
          '✓ Security patches applied - [If applicable]',
          '✓ Law enforcement notified - [If applicable, date and agency]',
          '✓ Third-party security experts engaged - [If applicable]'
        ],
        level: 1
      },
      {
        title: '4. Assessment of Risk to Data Subjects',
        content: [
          'Risk Level: HIGH / MEDIUM / LOW',
          '[Explanation of risk assessment]',
          '',
          'Potential Consequences:',
          '• Identity theft',
          '• Financial fraud',
          '• Phishing attacks',
          '• Unauthorized access to accounts',
          '• Reputation damage',
          '',
          'Mitigation Measures for Data Subjects:',
          '• Change passwords immediately',
          '• Monitor accounts for suspicious activity',
          '• Enable two-factor authentication',
          '• Review credit reports',
          '• Be cautious of phishing attempts'
        ],
        level: 1
      },
      {
        title: '5. Notification Details',
        content: [
          'Supervisory Authority Notification:',
          '• Authority: [Name of supervisory authority]',
          `• Date Notified: ${new Date().toLocaleDateString()} (within 72 hours of detection)`,
          '• Notification Method: [Online portal / Email / Other]',
          '',
          'Data Subject Notification:',
          '• Notification Method: [Email / Postal mail / Public notice]',
          '• Date Notified: [Date]',
          '• Number Notified: [Number] individuals',
          '• Content: [Summary of information provided to data subjects]'
        ],
        level: 1
      },
      {
        title: '6. Remediation and Prevention',
        content: [
          'Immediate Remediation:',
          '• [Action taken]',
          '• [Action taken]',
          '',
          'Long-term Prevention Measures:',
          '• Enhanced security controls',
          '• Additional staff training',
          '• Improved monitoring and detection',
          '• Regular security assessments',
          '• Updated incident response procedures'
        ],
        level: 1
      }
    ]
  };

  await generateWordDocument(wordData, `breach-notification-template-${new Date().toISOString().split('T')[0]}.docx`);
}

/**
 * Generate Compliance Roadmap Excel
 */
export function generateComplianceRoadmapExcel(): void {
  const excelData: ExcelWorkbookData = {
    sheets: [
      {
        name: 'Compliance Roadmap',
        headers: ['Action Item', 'Priority', 'Timeline', 'Owner', 'Status', 'Completion %', 'Dependencies'],
        rows: [
          ['Update Data Retention Policies', 'High', '30 days', 'DPO', 'In Progress', '60%', 'Legal Review'],
          ['Enhance Consent Mechanisms', 'High', '45 days', 'Legal Team', 'Planned', '0%', 'Development Team'],
          ['Formalize DPIA Process', 'Medium', '60 days', 'Privacy Officer', 'Planned', '0%', 'DPO Approval'],
          ['Implement DSR Portal', 'High', '90 days', 'IT Team', 'Planned', '0%', 'Requirements Gathering'],
          ['Establish Breach Procedures', 'High', '30 days', 'Security Team', 'In Progress', '40%', 'Incident Response Plan'],
          ['Vendor Risk Assessments', 'Medium', '45 days', 'Procurement', 'Planned', '0%', 'Vendor List'],
          ['Privacy Training Program', 'Medium', '60 days', 'HR', 'Planned', '0%', 'Training Materials'],
          ['Data Mapping Exercise', 'High', '90 days', 'Data Steward', 'Planned', '0%', 'System Inventory']
        ]
      },
      {
        name: 'Timeline View',
        headers: ['Month', 'Q1 Actions', 'Q2 Actions', 'Q3 Actions', 'Q4 Actions'],
        rows: [
          ['Month 1', 'Retention Policies', 'DSR Portal Start', '', ''],
          ['Month 2', 'Breach Procedures', 'DSR Portal Dev', 'Vendor Assessments', ''],
          ['Month 3', 'Consent Mechanisms', 'DSR Portal Testing', 'Privacy Training', ''],
          ['Month 4', '', 'DPIA Process', 'Data Mapping', '']
        ]
      }
    ],
    metadata: {
      title: 'Compliance Implementation Roadmap',
      author: 'CyberCorrect Privacy Platform',
      created: new Date().toISOString()
    }
  };

  generateExcelWorkbook(excelData, `compliance-roadmap-${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Generate NIST Gap Analysis Excel
 */
export function generateNistGapAnalysisExcel(): void {
  const excelData: ExcelWorkbookData = {
    sheets: [
      {
        name: 'NIST Privacy Framework Gaps',
        headers: ['Control ID', 'Control Name', 'Category', 'Status', 'Priority', 'Evidence', 'Remediation'],
        rows: [
          ['ID.AM-1', 'Asset Inventory', 'Identify', 'Compliant', 'High', 'Documented', 'N/A'],
          ['ID.AM-2', 'Data Inventory', 'Identify', 'Partial', 'High', 'Incomplete', 'Complete mapping'],
          ['PR.AC-3', 'Access Control', 'Protect', 'Partial', 'High', 'RBAC implemented', 'Enhance monitoring'],
          ['DE.AE-2', 'Anomaly Detection', 'Detect', 'Gap', 'Medium', 'None', 'Implement SIEM'],
          ['RS.CO-1', 'Incident Response', 'Respond', 'Compliant', 'High', 'Plan documented', 'N/A'],
          ['RC.RP-1', 'Recovery Planning', 'Recover', 'Partial', 'Medium', 'Basic plan', 'Enhance procedures']
        ]
      },
      {
        name: 'Control Mapping',
        headers: ['NIST Control', 'GDPR Article', 'CCPA Section', 'ISO 27001', 'Status'],
        rows: [
          ['ID.AM-1', 'Article 30', '1798.100', 'A.8.1.1', 'Mapped'],
          ['PR.AC-3', 'Article 32', '1798.150', 'A.9.2.1', 'Mapped'],
          ['DE.AE-2', 'Article 33', '1798.150', 'A.12.4.1', 'Mapped'],
          ['RS.CO-1', 'Article 33', '1798.150', 'A.16.1.1', 'Mapped']
        ]
      }
    ],
    metadata: {
      title: 'NIST Privacy Framework Gap Analysis',
      author: 'CyberCorrect Privacy Platform',
      created: new Date().toISOString()
    }
  };

  generateExcelWorkbook(excelData, `nist-gap-analysis-${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Generate Cookie Policy Word Document
 */
export async function generateCookiePolicyWord(): Promise<void> {
  const wordData: WordDocumentData = {
    title: 'Cookie Policy Template',
    subtitle: 'GDPR ePrivacy Directive Compliant',
    metadata: {
      generatedAt: new Date().toLocaleDateString(),
      generatedBy: 'CyberCorrect Privacy Platform',
      version: '1.0'
    },
    sections: [
      {
        title: '1. What Are Cookies',
        content: 'Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.',
        level: 1
      },
      {
        title: '2. Types of Cookies We Use',
        content: [
          'Essential Cookies: Required for the website to function properly. These cannot be disabled.',
          'Analytics Cookies: Help us understand how visitors interact with our website (e.g., Google Analytics).',
          'Marketing Cookies: Used to deliver relevant advertisements and track campaign effectiveness.',
          'Functional Cookies: Remember your preferences and settings to enhance your experience.'
        ],
        level: 1
      },
      {
        title: '3. Cookie Categories',
        content: [
          'Essential Cookies:',
          '• Session management',
          '• Security and authentication',
          '• Load balancing',
          '',
          'Analytics Cookies:',
          '• Google Analytics (_ga, _gid)',
          '• Usage tracking and statistics',
          '• Performance monitoring',
          '',
          'Marketing Cookies:',
          '• Advertising networks',
          '• Retargeting pixels',
          '• Conversion tracking'
        ],
        level: 1
      },
      {
        title: '4. Third-Party Cookies',
        content: 'We may use third-party services that set cookies on your device. These include analytics providers, advertising networks, and social media platforms. Please refer to their privacy policies for more information.',
        level: 1
      },
      {
        title: '5. Managing Cookies',
        content: [
          'You can control cookies through:',
          '• Browser settings (most browsers allow you to block or delete cookies)',
          '• Our cookie consent banner (when available)',
          '• Third-party opt-out tools',
          '',
          'Note: Blocking essential cookies may affect website functionality.'
        ],
        level: 1
      },
      {
        title: '6. Cookie Retention',
        content: 'Cookies are retained for different periods: session cookies are deleted when you close your browser, while persistent cookies remain for a specified period (typically 12-24 months) or until you delete them.',
        level: 1
      },
      {
        title: '7. Updates to This Policy',
        content: 'We may update this Cookie Policy from time to time. We will notify you of any material changes by posting the updated policy on our website.',
        level: 1
      }
    ]
  };

  await generateWordDocument(wordData, `cookie-policy-template-${new Date().toISOString().split('T')[0]}.docx`);
}

/**
 * Generate Terms of Service Word Document
 */
export async function generateTermsOfServiceWord(): Promise<void> {
  const wordData: WordDocumentData = {
    title: 'Terms of Service Template',
    subtitle: 'Standard Terms and Conditions',
    metadata: {
      generatedAt: new Date().toLocaleDateString(),
      generatedBy: 'CyberCorrect Privacy Platform',
      version: '1.0'
    },
    sections: [
      {
        title: '1. Acceptance of Terms',
        content: 'By accessing and using this service, you accept and agree to be bound by these Terms of Service. If you do not agree, you may not use the service.',
        level: 1
      },
      {
        title: '2. Description of Service',
        content: 'We provide [description of service]. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.',
        level: 1
      },
      {
        title: '3. User Obligations',
        content: [
          'You agree to:',
          '• Provide accurate and complete information',
          '• Maintain the security of your account',
          '• Use the service in compliance with applicable laws',
          '• Not engage in any illegal or unauthorized activities',
          '• Not attempt to gain unauthorized access to the service'
        ],
        level: 1
      },
      {
        title: '4. Intellectual Property',
        content: 'All content, features, and functionality of the service are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our permission.',
        level: 1
      },
      {
        title: '5. Limitation of Liability',
        content: 'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.',
        level: 1
      },
      {
        title: '6. Termination',
        content: 'We may terminate or suspend your access to the service immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the service will cease immediately.',
        level: 1
      },
      {
        title: '7. Governing Law',
        content: 'These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.',
        level: 1
      },
      {
        title: '8. Changes to Terms',
        content: 'We reserve the right to modify these Terms at any time. We will notify users of material changes. Continued use of the service after changes constitutes acceptance of the new Terms.',
        level: 1
      }
    ]
  };

  await generateWordDocument(wordData, `terms-of-service-template-${new Date().toISOString().split('T')[0]}.docx`);
}

/**
 * Generate Evidence Collection Checklist PDF
 */
export async function generateEvidenceChecklistPdf(): Promise<void> {
  const doc = new jsPDF();
  let y = await addCyberCorrectHeader(doc, 'Evidence Collection Checklist', 'Compliance Framework Templates');
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, y);
  y += 10;

  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Evidence Collection Checklist', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const checklistItems = [
    ['Category', 'Evidence Type', 'Required', 'Status'],
    ['Policies & Procedures', 'Privacy Policy', 'Yes', ''],
    ['Policies & Procedures', 'Data Retention Policy', 'Yes', ''],
    ['Policies & Procedures', 'Incident Response Plan', 'Yes', ''],
    ['Access Controls', 'Access Control Logs', 'Yes', ''],
    ['Access Controls', 'RBAC Documentation', 'Yes', ''],
    ['Training', 'Training Records', 'Yes', ''],
    ['Training', 'Certifications', 'Yes', ''],
    ['Incidents', 'Incident Reports', 'Yes', ''],
    ['Incidents', 'Breach Notifications', 'Yes', ''],
    ['Vendors', 'DPA Agreements', 'Yes', ''],
    ['Vendors', 'Vendor Assessments', 'Yes', ''],
    ['Data Processing', 'ROPA Records', 'Yes', ''],
    ['Data Processing', 'DPIA Documents', 'Yes', ''],
    ['Compliance', 'Audit Reports', 'Yes', ''],
    ['Compliance', 'Compliance Certifications', 'Yes', '']
  ];

  doc.autoTable({
    head: [checklistItems[0]],
    body: checklistItems.slice(1),
    startY: y,
    headStyles: { fillColor: [66, 139, 202], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  addCyberCorrectFooter(doc);
  const filename = `evidence-collection-checklist-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

/**
 * Main artifact generator function
 */
export async function generateArtifact(
  productId: string,
  artifactId: string,
  format: 'PDF' | 'Word' | 'Excel'
): Promise<void> {
  // Map artifacts to generators based on product and artifact ID
  const artifactMap: Record<string, () => Promise<void> | void> = {
    // Privacy Toolkit Pro
    'dpia-sample': generateDpiaSamplePdf,
    'privacy-policy-sample': generatePrivacyPolicyWord,
    'data-mapping-interface': () => { throw new Error('Interactive tool - use main application'); },
    
    // GDPR Complete Kit
    'gdpr-privacy-notice': generatePrivacyPolicyWord,
    'breach-notification-template': generateBreachNotificationWord,
    'dsr-request-manager': () => { throw new Error('Interactive tool - use main application'); },
    
    // Policy Template Library
    'website-privacy-policy': generatePrivacyPolicyWord,
    'cookie-policy-template': generatePrivacyPolicyWord,
    'terms-of-service-template': generatePrivacyPolicyWord,
    
    // Compliance Assessment Suite
    'gap-analysis-report': generateGapAnalysisExcel,
    'compliance-roadmap': generateComplianceRoadmapExcel,
    
    // Compliance Framework Templates
    'gap-analysis-worksheet': generateNistGapAnalysisExcel,
    'evidence-collection-checklist': generateEvidenceChecklistPdf
  };

  const generator = artifactMap[artifactId];
  if (!generator) {
    // Fallback: try to generate based on format
    if (format === 'PDF') {
      await generateDpiaSamplePdf();
    } else if (format === 'Word') {
      await generatePrivacyPolicyWord();
    } else if (format === 'Excel') {
      generateGapAnalysisExcel();
    } else {
      throw new Error(`No generator found for artifact: ${artifactId} with format: ${format}`);
    }
    return;
  }

  await generator();
}

