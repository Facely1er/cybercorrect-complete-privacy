import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { addCyberCorrectHeader, addCyberCorrectFooter } from './logoUtils';

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

interface DpiaData {
  projectName: string;
  dataController: string;
  processingPurpose: string;
  legalBasis: string;
  dataCategories: string[];
  dataSubjects: string[];
  riskLevel: string;
  safeguards: string[];
  assessmentDate?: string;
  assessor?: string;
}

export const generateDpiaPdf = async (data: DpiaData): Promise<void> => {
  const doc = new jsPDF();
  
  // Add header with logo
  let y = await addCyberCorrectHeader(doc, 'Data Protection Impact Assessment (DPIA)', data.projectName || 'DPIA Report');
  
  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Assessment Date: ${data.assessmentDate || new Date().toLocaleDateString()}`, 20, y);
  y += 5;
  if (data.assessor) {
    doc.text(`Assessed by: ${data.assessor}`, 20, y);
    y += 5;
  }
  doc.text(`Data Controller: ${data.dataController || 'Not specified'}`, 20, y);
  y += 10;

  // 1. PROJECT OVERVIEW
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('1. PROJECT OVERVIEW', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Project Name: ${data.projectName || 'Not specified'}`, 20, y);
  y += 6;
  doc.text(`Data Controller: ${data.dataController || 'Not specified'}`, 20, y);
  y += 6;
  doc.text(`Date of Assessment: ${data.assessmentDate || new Date().toLocaleDateString()}`, 20, y);
  y += 6;
  if (data.assessor) {
    doc.text(`Assessed by: ${data.assessor}`, 20, y);
    y += 6;
  }
  y += 5;

  // 2. DESCRIPTION OF PROCESSING
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('2. DESCRIPTION OF PROCESSING', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Processing Purpose:', 20, y);
  y += 6;
  const purposeLines = doc.splitTextToSize(
    data.processingPurpose || 'Processing purpose not specified. Please provide detailed description of the data processing activities, including the business objectives and operational context.',
    170
  );
  doc.text(purposeLines, 25, y);
  y += purposeLines.length * 5 + 3;
  
  doc.text(`Legal Basis: ${data.legalBasis || 'Legal basis not specified. Please identify the lawful basis under GDPR Article 6 (consent, contract, legal obligation, vital interests, public task, or legitimate interests).'}`, 20, y);
  y += 10;

  // 3. NECESSITY AND PROPORTIONALITY ASSESSMENT
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('3. NECESSITY AND PROPORTIONALITY ASSESSMENT', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const necessityText = 'This section requires a detailed assessment of necessity and proportionality. Please document: (1) Why the processing is necessary for the stated purpose, (2) How the processing is proportionate to the purpose, (3) Whether less intrusive alternatives were considered, and (4) How data minimization principles are applied. This assessment should demonstrate that the processing does not go beyond what is necessary to achieve the stated purpose.';
  const necessityLines = doc.splitTextToSize(necessityText, 170);
  doc.text(necessityLines, 20, y);
  y += necessityLines.length * 5 + 5;

  // 4. DATA SUBJECTS AND PERSONAL DATA
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('4. DATA SUBJECTS AND PERSONAL DATA', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Categories of Data Subjects:', 20, y);
  y += 6;
  const subjectsText = data.dataSubjects.length > 0 
    ? data.dataSubjects.join(', ')
    : 'Data subject categories not specified. Please identify all categories of individuals whose personal data will be processed (e.g., customers, employees, website visitors, suppliers).';
  const subjectsLines = doc.splitTextToSize(subjectsText, 170);
  doc.text(subjectsLines, 25, y);
  y += subjectsLines.length * 5 + 3;

  doc.text('Categories of Personal Data:', 20, y);
  y += 6;
  const categoriesText = data.dataCategories.length > 0
    ? data.dataCategories.join(', ')
    : 'Data categories not specified. Please identify all types of personal data that will be processed (e.g., names, email addresses, IP addresses, financial information, health data).';
  const categoriesLines = doc.splitTextToSize(categoriesText, 170);
  doc.text(categoriesLines, 25, y);
  y += categoriesLines.length * 5 + 5;

  // 5. PRIVACY RISK ASSESSMENT
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('5. PRIVACY RISK ASSESSMENT', 20, y);
  y += 10;

  doc.setFontSize(10);
  const riskColor = data.riskLevel === 'high' ? [200, 0, 0] :
                    data.riskLevel === 'medium' ? [255, 150, 0] : [0, 150, 0];
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`Risk Level: ${data.riskLevel ? data.riskLevel.toUpperCase() : 'Not assessed'}`, 20, y);
  y += 6;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Identified Risks:', 20, y);
  y += 6;
  const risks = [
    'Risk to individual privacy rights',
    'Risk of unauthorized processing',
    'Risk of data breach or loss'
  ];
  risks.forEach(risk => {
    doc.text(`- ${risk}`, 25, y);
    y += 5;
  });
  y += 3;

  // 6. MEASURES TO ADDRESS RISKS
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('6. MEASURES TO ADDRESS RISKS', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Safeguards and Controls:', 20, y);
  y += 6;
  
  if (data.safeguards.length > 0) {
    data.safeguards.forEach(safeguard => {
      doc.text(`- ${safeguard}`, 25, y);
      y += 5;
    });
  } else {
    doc.text('- No safeguards specified. Please document all technical and organizational measures to address identified risks, including encryption, access controls, pseudonymization, staff training, and audit procedures.', 25, y);
    y += 8;
  }
  y += 3;

  // 7. CONSULTATION AND APPROVAL
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('7. CONSULTATION AND APPROVAL', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('DPO Consultation: Consultation with Data Protection Officer required. Document date, outcome, and any recommendations provided.', 20, y);
  y += 6;
  doc.text('Stakeholder Consultation: Document all stakeholders consulted, their input, and how concerns were addressed.', 20, y);
  y += 6;
  doc.text('Final Approval: Document approval date, approver name and title, and any conditions attached to approval.', 20, y);
  y += 5;

  // 8. MONITORING AND REVIEW
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('8. MONITORING AND REVIEW', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Review Date: Review schedule not specified. DPIAs should be reviewed annually or when processing activities change significantly.', 20, y);
  y += 6;
  doc.text('Monitoring Procedures: Document ongoing monitoring approach, including frequency of reviews, key metrics to track, and triggers for reassessment.', 20, y);
  y += 10;

  // Footer note
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const footerNote = 'This DPIA was generated using CyberCorrect™ Privacy Platform\'s automated DPIA generator. Please review and customize all sections based on your specific processing activities. This document should be completed in consultation with your Data Protection Officer and relevant stakeholders.';
  const footerLines = doc.splitTextToSize(footerNote, 170);
  doc.text(footerLines, 20, y);
  y += footerLines.length * 4 + 3;
  doc.text(`Generated: ${new Date().toLocaleDateString()} | CyberCorrect™ Privacy Platform`, 20, y);

  // Add footer with branding
  addCyberCorrectFooter(doc);

  // Save the PDF
  const filename = `dpia-${(data.projectName || 'generated').replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

