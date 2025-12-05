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
      styles?: Record<string, unknown>;
      columnStyles?: Record<number | string, Record<string, unknown>>;
    }) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

interface PrivacyGapAnalysisPdfData {
  metadata: {
    title: string;
    timestamp: string;
    reportId: string;
    version: string;
    generatedBy: string;
  };
  executiveSummary: {
    overallScore: number;
    totalGaps: number;
    criticalGaps: number;
    highGaps: number;
    mediumGaps: number;
    frameworksAssessed: number;
    assessmentDate: string;
    frameworkName: string;
  };
  complianceData: Array<{
    framework: string;
    score: number;
    gaps: number;
  }>;
  gapAnalysis: Array<{
    id: string;
    title: string;
    description: string;
    priority: string;
    category: string;
    regulation: string;
    article: string;
    framework: string;
    effort: string;
    timeframe: string;
    impact: string;
    recommendation: string;
    nistSection?: string;
  }>;
  assessmentResults?: {
    overallScore: number;
    sectionScores: Array<{
      title: string;
      percentage: number;
      completed?: boolean;
    }>;
    frameworkName: string;
    completedDate: string;
  };
}

export const generatePrivacyGapAnalysisPdf = async (data: PrivacyGapAnalysisPdfData): Promise<void> => {
  const doc = new jsPDF();
  
  // Add header with logo
  let y = await addCyberCorrectHeader(doc, data.metadata.title, `Framework: ${data.executiveSummary.frameworkName}`);

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date(data.metadata.timestamp).toLocaleDateString()}`, 20, y);
  y += 5;
  doc.text(`Report ID: ${data.metadata.reportId}`, 20, y);
  y += 5;
  doc.text(`Version: ${data.metadata.version}`, 20, y);
  y += 5;
  if (data.assessmentResults) {
    doc.text(`Assessment Date: ${data.assessmentResults.completedDate}`, 20, y);
    y += 5;
  }
  y += 10;

  // Executive Summary
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('Executive Summary', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  // Overall Score with color coding
  const scoreColor = data.executiveSummary.overallScore >= 80 ? [0, 150, 0] :
                     data.executiveSummary.overallScore >= 60 ? [255, 150, 0] : [200, 0, 0];
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setFontSize(14);
  doc.text(`Overall Compliance Score: ${data.executiveSummary.overallScore}%`, 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Gaps Identified: ${data.executiveSummary.totalGaps}`, 20, y);
  y += 5;
  doc.setTextColor(200, 0, 0);
  doc.text(`Critical Gaps: ${data.executiveSummary.criticalGaps}`, 20, y);
  y += 5;
  doc.setTextColor(255, 150, 0);
  doc.text(`High Priority Gaps: ${data.executiveSummary.highGaps}`, 20, y);
  y += 5;
  doc.setTextColor(100, 100, 100);
  doc.text(`Medium Priority Gaps: ${data.executiveSummary.mediumGaps}`, 20, y);
  y += 5;
  doc.setTextColor(60, 60, 60);
  doc.text(`Frameworks Assessed: ${data.executiveSummary.frameworksAssessed}`, 20, y);
  y += 15;

  // Assessment Results Section (if available)
  if (data.assessmentResults) {
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('NIST Privacy Framework Assessment Results', 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    // Section scores table
    const sectionData = data.assessmentResults.sectionScores.map(section => [
      section.title,
      `${section.percentage}%`,
      section.completed ? 'Complete' : 'Incomplete'
    ]);

    doc.autoTable({
      head: [['Section', 'Score', 'Status']],
      body: sectionData,
      startY: y,
      headStyles: { fillColor: [60, 100, 240], fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 240, 240], fontSize: 9 },
      styles: { fontSize: 9 }
    });

    y = (doc.lastAutoTable?.finalY || y) + 15;
  }

  // Compliance Framework Scores
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Compliance Framework Scores', 20, y);
  y += 10;

  const frameworkData = data.complianceData.map(f => [
    f.framework,
    `${f.score}%`,
    f.gaps.toString()
  ]);

  doc.autoTable({
    head: [['Framework', 'Compliance Score', 'Gaps']],
    body: frameworkData,
    startY: y,
    headStyles: { fillColor: [60, 100, 240], fontSize: 9 },
    alternateRowStyles: { fillColor: [240, 240, 240], fontSize: 9 },
    styles: { fontSize: 9 }
  });

  y = (doc.lastAutoTable?.finalY || y) + 15;

  // Gap Analysis by Priority
  const priorityOrder = ['critical', 'high', 'medium', 'low'];
  
  for (const priority of priorityOrder) {
    const priorityGaps = data.gapAnalysis.filter(gap => gap.priority === priority);
    if (priorityGaps.length === 0) continue;

    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    const priorityLabel = priority.charAt(0).toUpperCase() + priority.slice(1);
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text(`${priorityLabel} Priority Gaps`, 20, y);
    y += 10;

    // Add gaps for this priority
    for (const gap of priorityGaps) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text(`${gap.id}: ${gap.title}`, 20, y);
      y += 6;

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      
      const descriptionLines = doc.splitTextToSize(gap.description, 170);
      doc.text(descriptionLines, 20, y);
      y += descriptionLines.length * 4 + 2;

      doc.text(`Category: ${gap.category}`, 20, y);
      y += 4;
      doc.text(`Regulation: ${gap.regulation} - ${gap.article}`, 20, y);
      y += 4;
      doc.text(`Framework: ${gap.framework}`, 20, y);
      y += 4;
      if (gap.nistSection) {
        doc.text(`NIST Section: ${gap.nistSection}`, 20, y);
        y += 4;
      }
      doc.text(`Effort: ${gap.effort.charAt(0).toUpperCase() + gap.effort.slice(1)} | Timeframe: ${gap.timeframe.charAt(0).toUpperCase() + gap.timeframe.slice(1)}`, 20, y);
      y += 4;

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const impactLines = doc.splitTextToSize(`Impact: ${gap.impact}`, 170);
      doc.text(impactLines, 20, y);
      y += impactLines.length * 4 + 2;

      const recommendationLines = doc.splitTextToSize(`Recommendation: ${gap.recommendation}`, 170);
      doc.text(recommendationLines, 20, y);
      y += recommendationLines.length * 4 + 5;

      // Add separator line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, 190, y);
      y += 8;
    }
  }

  // Add footer with branding
  addCyberCorrectFooter(doc, data.metadata.reportId);

  // Save the PDF
  const filename = `privacy-gap-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};

