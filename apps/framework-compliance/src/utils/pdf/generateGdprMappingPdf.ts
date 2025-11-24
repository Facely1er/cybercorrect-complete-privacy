import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ProcessingActivity {
  id: string;
  name: string;
  purpose: string;
  legalBasis: string;
  dataTypes: string[];
  dataSubjects: string[];
  recipients: string[];
  retentionPeriod: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface GdprMappingData {
  metadata: {
    title: string;
    created: string;
    version: string;
    organization: string;
  };
  processingActivities: ProcessingActivity[];
  compliance: {
    framework: string;
    articles: string[];
    dpiaRequired: boolean;
  };
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head?: string[][];
      body?: Array<Array<string | number>>;
      startY?: number;
      headStyles?: Record<string, unknown>;
      alternateRowStyles?: Record<string, unknown>;
      styles?: Record<string, unknown>;
      columnStyles?: Record<number, Record<string, unknown>>;
    }) => jsPDF;
  }
}

export const generateGdprMappingPdf = (data: GdprMappingData): void => {
  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(data.metadata.title, 105, y, { align: 'center' });
  y += 10;

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(data.metadata.organization, 105, y, { align: 'center' });
  y += 15;

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Generated: ${new Date(data.metadata.created).toLocaleDateString()}`, 20, y);
  y += 5;
  doc.text(`Version: ${data.metadata.version}`, 20, y);
  y += 5;
  doc.text(`Framework: ${data.compliance.framework}`, 20, y);
  y += 5;
  doc.text(`Relevant Articles: ${data.compliance.articles.join(', ')}`, 20, y);
  y += 15;

  // Compliance Summary
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Compliance Summary', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Processing Activities: ${data.processingActivities.length}`, 20, y);
  y += 5;

  const highRiskCount = data.processingActivities.filter(a => a.riskLevel === 'high').length;
  const mediumRiskCount = data.processingActivities.filter(a => a.riskLevel === 'medium').length;
  const lowRiskCount = data.processingActivities.filter(a => a.riskLevel === 'low').length;

  doc.text(`High Risk Activities: ${highRiskCount}`, 20, y);
  y += 5;
  doc.text(`Medium Risk Activities: ${mediumRiskCount}`, 20, y);
  y += 5;
  doc.text(`Low Risk Activities: ${lowRiskCount}`, 20, y);
  y += 5;

  // DPIA Status
  const dpiaColor = data.compliance.dpiaRequired ? [200, 0, 0] : [0, 150, 0];
  const dpiaText = data.compliance.dpiaRequired ? 'Required' : 'Not Required';
  doc.setTextColor(dpiaColor[0], dpiaColor[1], dpiaColor[2]);
  doc.text(`DPIA Status: ${dpiaText}`, 20, y);
  y += 15;

  // Processing Activities Overview Table
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Processing Activities Overview', 20, y);
  y += 10;

  const activitiesTableData = data.processingActivities.map(activity => [
    activity.name.length > 40 ? activity.name.substring(0, 40) + '...' : activity.name,
    activity.legalBasis,
    activity.riskLevel.toUpperCase(),
    activity.dataTypes.length.toString(),
    activity.dataSubjects.length.toString(),
    activity.retentionPeriod || 'N/A'
  ]);

  doc.autoTable({
    head: [['Activity Name', 'Legal Basis', 'Risk Level', 'Data Types', 'Data Subjects', 'Retention']],
    body: activitiesTableData,
    startY: y,
    headStyles: { fillColor: [60, 100, 240], fontSize: 9 },
    alternateRowStyles: { fillColor: [240, 240, 240], fontSize: 8 },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 35 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 },
      5: { cellWidth: 30 }
    }
  });

  // Get last table Y position
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;

  // Detailed Activity Information
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Detailed Activity Information', 20, y);
  y += 10;

  data.processingActivities.forEach((activity, index) => {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Activity Header
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`${index + 1}. ${activity.name}`, 20, y);
    y += 8;

    // Risk Level Badge
    const riskColors: Record<string, number[]> = {
      'high': [200, 0, 0],
      'medium': [255, 150, 0],
      'low': [0, 150, 0]
    };
    const riskColor = riskColors[activity.riskLevel] || [100, 100, 100];
    doc.setFontSize(10);
    doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.text(`Risk Level: ${activity.riskLevel.toUpperCase()}`, 20, y);
    y += 6;

    // Purpose
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('Purpose:', 20, y);
    y += 5;
    const purposeLines = doc.splitTextToSize(activity.purpose, 170);
    doc.text(purposeLines, 25, y);
    y += purposeLines.length * 5 + 3;

    // Legal Basis
    doc.text(`Legal Basis: ${activity.legalBasis}`, 20, y);
    y += 5;

    // Data Types
    doc.text('Personal Data Categories:', 20, y);
    y += 5;
    const dataTypesText = activity.dataTypes.length > 0 
      ? activity.dataTypes.join(', ')
      : 'None specified';
    const dataTypesLines = doc.splitTextToSize(dataTypesText, 165);
    doc.text(dataTypesLines, 25, y);
    y += dataTypesLines.length * 5 + 3;

    // Data Subjects
    doc.text('Data Subjects:', 20, y);
    y += 5;
    const dataSubjectsText = activity.dataSubjects.length > 0
      ? activity.dataSubjects.join(', ')
      : 'None specified';
    const dataSubjectsLines = doc.splitTextToSize(dataSubjectsText, 165);
    doc.text(dataSubjectsLines, 25, y);
    y += dataSubjectsLines.length * 5 + 3;

    // Recipients
    doc.text('Recipients:', 20, y);
    y += 5;
    const recipientsText = activity.recipients.length > 0
      ? activity.recipients.join(', ')
      : 'None specified';
    const recipientsLines = doc.splitTextToSize(recipientsText, 165);
    doc.text(recipientsLines, 25, y);
    y += recipientsLines.length * 5 + 3;

    // Retention Period
    doc.text(`Retention Period: ${activity.retentionPeriod || 'Not specified'}`, 20, y);
    y += 10;

    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 10;
  });

  // Footer
  const pageCount = doc.getNumberOfPages ? doc.getNumberOfPages() : 1;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    doc.text('CyberCorrect Privacy Platform - GDPR Data Processing Mapping', 20, 285);
    doc.text(`${new Date().toISOString().split('T')[0]}`, 190, 285, { align: 'right' });
  }

  // Save the PDF
  const filename = `gdpr-processing-mapping-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
