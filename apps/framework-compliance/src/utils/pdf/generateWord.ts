import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { logError } from '../common/logger';

export interface SSPExportData {
  metadata: {
    exportDate: string;
    version: string;
    organization: string;
    systemName: string;
    classification: string;
  };
  systemInfo: {
    name: string;
    owner: string;
    identifier: string;
    description: string;
    classification: string;
  };
  sections: Array<{
    title: string;
    status: string;
    content: Record<string, unknown>;
  }>;
  controls: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    implementation: {
      status: string;
      notes: string;
      lastAssessed: string;
      assessedBy: string;
    };
  }>;
  metrics: {
    totalControls: number;
    implementedControls: number;
    compliancePercentage: number;
  };
}

export const generateSSPWordDocument = async (data: SSPExportData): Promise<void> => {
  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: `System Security Plan (SSP)`,
            heading: HeadingLevel.TITLE,
            alignment: 'center',
          }),
          
          new Paragraph({
            text: data.systemInfo.name,
            heading: HeadingLevel.HEADING_1,
            alignment: 'center',
          }),
          
          new Paragraph({
            text: `Organization: ${data.metadata.organization}`,
            spacing: { after: 200 },
          }),
          
          new Paragraph({
            text: `Generated: ${new Date(data.metadata.exportDate).toLocaleDateString()}`,
            spacing: { after: 200 },
          }),
          
          new Paragraph({
            text: `Classification: ${data.metadata.classification}`,
            spacing: { after: 400 },
          }),

          // System Information Section
          new Paragraph({
            text: "1. System Information",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "System Name: ", bold: true }),
              new TextRun({ text: data.systemInfo.name }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "System Owner: ", bold: true }),
              new TextRun({ text: data.systemInfo.owner }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "System Identifier: ", bold: true }),
              new TextRun({ text: data.systemInfo.identifier }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Description: ", bold: true }),
              new TextRun({ text: data.systemInfo.description }),
            ],
            spacing: { after: 400 },
          }),

          // Compliance Summary
          new Paragraph({
            text: "2. Compliance Summary",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Total Controls: ", bold: true }),
              new TextRun({ text: data.metrics.totalControls.toString() }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Implemented Controls: ", bold: true }),
              new TextRun({ text: data.metrics.implementedControls.toString() }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Compliance Percentage: ", bold: true }),
              new TextRun({ text: `${data.metrics.compliancePercentage}%` }),
            ],
            spacing: { after: 400 },
          }),

          // Controls Table
          new Paragraph({
            text: "3. Security Controls",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Control ID", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Title", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Status", bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: "Priority", bold: true })] }),
                ],
              }),
              ...data.controls.map(control => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: control.id })] }),
                    new TableCell({ children: [new Paragraph({ text: control.title })] }),
                    new TableCell({ children: [new Paragraph({ text: control.status })] }),
                    new TableCell({ children: [new Paragraph({ text: control.priority })] }),
                  ],
                })
              ),
            ],
          }),

          // Sections
          ...data.sections.map((section, index) => [
            new Paragraph({
              text: `${index + 4}. ${section.title}`,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Status: ", bold: true }),
                new TextRun({ text: section.status }),
              ],
            }),
            new Paragraph({
              text: "Content details would be included here based on section type.",
              spacing: { after: 200 },
            }),
          ]).flat(),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    const filename = `SSP-${data.systemInfo.identifier || 'draft'}-${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(blob, filename);
    
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Error generating Word document'), { component: 'generateWord' });
    throw error;
  }
};
