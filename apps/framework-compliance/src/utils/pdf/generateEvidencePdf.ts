import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { addCyberCorrectHeader, addCyberCorrectFooter } from './logoUtils';

// Extend jsPDF with autotable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head?: string[][];
      body?: Array<Array<string | number>>;
      startY?: number;
      headStyles?: Record<string, unknown>;
      alternateRowStyles?: Record<string, unknown>;
      styles?: Record<string, unknown>;
      columnStyles?: Record<string, unknown>;
    }) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: 'policy' | 'procedure' | 'assessment' | 'training' | 'technical' | 'legal';
  category: string;
  description: string;
  uploadDate: string;
  lastModified: string;
  uploadedBy: string;
  fileSize: string;
  tags: string[];
  linkedTasks: string[];
  complianceFrameworks: string[];
  auditTrail: {
    action: string;
    user: string;
    timestamp: string;
  }[];
}

export const generateEvidencePdf = async (evidenceItems: EvidenceItem[], filename?: string): Promise<void> => {
  const doc = new jsPDF();
  
  // Add header with logo
  let y = await addCyberCorrectHeader(doc, 'Evidence Vault Export', `Generated on: ${new Date().toLocaleDateString()}`);

  // Summary section
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Summary', 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Documents: ${evidenceItems.length}`, 20, y);
  y += 6;

  // Count by type
  const typeCounts: Record<string, number> = {};
  evidenceItems.forEach(item => {
    typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
  });

  doc.text('Documents by Type:', 20, y);
  y += 6;
  Object.entries(typeCounts).forEach(([type, count]) => {
    doc.text(`  • ${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}`, 25, y);
    y += 5;
  });

  y += 10;

  // Documents table
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Documents', 20, y);
  y += 10;

  // Prepare table data
  const tableData = evidenceItems.map(item => [
    item.name,
    item.type.charAt(0).toUpperCase() + item.type.slice(1),
    item.category,
    new Date(item.uploadDate).toLocaleDateString(),
    item.uploadedBy,
    item.fileSize
  ]);

  doc.autoTable({
    head: [['Name', 'Type', 'Category', 'Upload Date', 'Uploaded By', 'Size']],
    body: tableData,
    startY: y,
    headStyles: { fillColor: [60, 100, 240] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 25 },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 20 }
    }
  });

  // Get last table Y position
  y = (doc.lastAutoTable?.finalY || y) + 15;

  // Add detailed information for each document
  evidenceItems.forEach((item, index) => {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Document header
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`${index + 1}. ${item.name}`, 20, y);
    y += 8;

    // Document details
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    
    doc.text(`Type: ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`, 20, y);
    y += 5;
    doc.text(`Category: ${item.category}`, 20, y);
    y += 5;
    doc.text(`Description: ${item.description}`, 20, y);
    y += 5;
    
    // Handle description wrapping
    const descLines = doc.splitTextToSize(`Description: ${item.description}`, 170);
    if (descLines.length > 1) {
      y -= 5; // Reset to before description
      doc.text(`Description:`, 20, y);
      y += 5;
      doc.text(descLines.slice(1), 25, y);
      y += descLines.length * 4;
    } else {
      y += 5;
    }

    doc.text(`Uploaded: ${new Date(item.uploadDate).toLocaleDateString()}`, 20, y);
    y += 5;
    doc.text(`Last Modified: ${new Date(item.lastModified).toLocaleDateString()}`, 20, y);
    y += 5;
    doc.text(`Uploaded By: ${item.uploadedBy}`, 20, y);
    y += 5;
    doc.text(`File Size: ${item.fileSize}`, 20, y);
    y += 8;

    // Tags
    if (item.tags.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      doc.text('Tags:', 20, y);
      y += 5;
      doc.setTextColor(60, 60, 60);
      const tagsText = item.tags.join(', ');
      const tagLines = doc.splitTextToSize(tagsText, 170);
      doc.text(tagLines, 25, y);
      y += tagLines.length * 4 + 3;
    }

    // Compliance Frameworks
    if (item.complianceFrameworks.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      doc.text('Compliance Frameworks:', 20, y);
      y += 5;
      doc.setTextColor(60, 60, 60);
      item.complianceFrameworks.forEach(framework => {
        doc.text(`  • ${framework}`, 25, y);
        y += 5;
      });
      y += 3;
    }

    // Linked Tasks
    if (item.linkedTasks.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      doc.text('Linked Tasks:', 20, y);
      y += 5;
      doc.setTextColor(60, 60, 60);
      const tasksText = item.linkedTasks.join(', ');
      doc.text(`  ${tasksText}`, 25, y);
      y += 5;
    }

    // Audit Trail
    if (item.auditTrail.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      doc.text('Audit Trail:', 20, y);
      y += 5;
      doc.setTextColor(60, 60, 60);
      item.auditTrail.forEach(entry => {
        const auditText = `${entry.action} - ${entry.user} (${entry.timestamp})`;
        const auditLines = doc.splitTextToSize(auditText, 160);
        doc.text(auditLines, 25, y);
        y += auditLines.length * 4 + 2;
      });
    }

    y += 10; // Space between documents
  });

  // Add footer
  // Add footer with branding
  addCyberCorrectFooter(doc);

  // Save the PDF
  const exportFilename = filename || `evidence-vault-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(exportFilename);
};
