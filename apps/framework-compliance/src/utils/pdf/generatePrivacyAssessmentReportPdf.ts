import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { addCyberCorrectHeader, addCyberCorrectFooter } from './logoUtils';
import { generateGapsFromAssessment, type IdentifiedGap } from '../gapJourneyConfig';

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

interface AssessmentReportPdfData {
  assessmentResults: {
    overallScore: number;
    sectionScores: Array<{
      title: string;
      percentage: number;
      completed?: boolean;
    }>;
    frameworkName: string;
    completedDate: string;
    assessmentType?: string;
  };
  identifiedGaps: IdentifiedGap[];
  roadmapPhases: Array<{
    id: string;
    name: string;
    duration: string;
    status: string;
    milestones: Array<{ name: string; date: string; status: string }>;
    deliverables: string[];
    keyActivities: string[];
    gaps: IdentifiedGap[];
  }>;
  metadata: {
    title: string;
    timestamp: string;
    reportId: string;
    version: string;
    generatedBy?: string;
  };
}

export const generatePrivacyAssessmentReportPdf = async (data: AssessmentReportPdfData): Promise<void> => {
  const doc = new jsPDF();
  const { assessmentResults, identifiedGaps, roadmapPhases, metadata } = data;
  
  // Cover page
  let y = await addCyberCorrectHeader(doc, metadata.title, `Framework: ${assessmentResults.frameworkName}`);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date(metadata.timestamp).toLocaleDateString()}`, 20, y);
  y += 5;
  doc.text(`Report ID: ${metadata.reportId}`, 20, y);
  y += 5;
  doc.text(`Version: ${metadata.version}`, 20, y);
  y += 5;
  doc.text(`Assessment Date: ${assessmentResults.completedDate}`, 20, y);
  y += 10;
  
  // Executive Summary
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('Executive Summary', 20, y);
  y += 10;
  
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Overall Compliance Score: ${assessmentResults.overallScore}%`, 20, y);
  y += 8;
  doc.text(`Total Gaps Identified: ${identifiedGaps.length}`, 20, y);
  y += 8;
  doc.text(`Critical Gaps: ${identifiedGaps.filter(g => g.severity === 'critical').length}`, 20, y);
  y += 8;
  doc.text(`High Priority Gaps: ${identifiedGaps.filter(g => g.severity === 'high').length}`, 20, y);
  y += 8;
  doc.text(`Moderate Gaps: ${identifiedGaps.filter(g => g.severity === 'moderate').length}`, 20, y);
  y += 15;
  
  // Maturity Level
  const maturityLevel = assessmentResults.overallScore >= 90 ? 'Optimized' :
                        assessmentResults.overallScore >= 80 ? 'Managed' :
                        assessmentResults.overallScore >= 70 ? 'Defined' :
                        assessmentResults.overallScore >= 50 ? 'Developing' : 'Initial';
  doc.setFontSize(11);
  doc.text(`Maturity Level: ${maturityLevel}`, 20, y);
  y += 10;
  
  // Add footer
  addCyberCorrectFooter(doc);
  
  // Section Scores
  doc.addPage();
  y = await addCyberCorrectHeader(doc, 'Assessment Results by Domain', '');
  y += 10;
  
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Domain Scores', 20, y);
  y += 10;
  
  // Table of section scores
  const sectionData = assessmentResults.sectionScores.map(section => [
    section.title,
    `${section.percentage}%`,
    section.percentage >= 80 ? 'Strong' :
    section.percentage >= 60 ? 'Moderate' :
    section.percentage >= 40 ? 'Needs Improvement' : 'Critical'
  ]);
  
  doc.autoTable({
    head: [['Domain', 'Score', 'Status']],
    body: sectionData,
    startY: y,
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 60, halign: 'center' }
    }
  });
  
  y = (doc.lastAutoTable?.finalY || y) + 20;
  
  // Detailed Gap Analysis
  if (identifiedGaps.length > 0) {
    doc.addPage();
    y = await addCyberCorrectHeader(doc, 'Identified Compliance Gaps', '');
    y += 10;
    
    doc.setFontSize(14);
    doc.text('Gap Analysis', 20, y);
    y += 10;
    
    identifiedGaps.forEach((gap, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${gap.domainTitle}`, 20, y);
      y += 6;
      
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`Score: ${gap.score}% | Severity: ${gap.severity.toUpperCase()} | Timeline: ${gap.timeline}`, 20, y);
      y += 6;
      
      doc.text(`Description: ${gap.description}`, 20, y);
      y += 6;
      
      if (gap.recommendedTools.length > 0) {
        doc.text(`Recommended Tools: ${gap.recommendedTools.join(', ')}`, 20, y);
        y += 6;
      }
      
      y += 5;
    });
  }
  
  // Roadmap
  if (roadmapPhases.length > 0) {
    doc.addPage();
    y = await addCyberCorrectHeader(doc, 'Implementation Roadmap', '');
    y += 10;
    
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Phased Implementation Plan', 20, y);
    y += 15;
    
    roadmapPhases.forEach((phase, index) => {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`Phase ${index + 1}: ${phase.name}`, 20, y);
      y += 7;
      
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`Duration: ${phase.duration} | Status: ${phase.status}`, 20, y);
      y += 6;
      doc.text(`Gaps to Address: ${phase.gaps.length}`, 20, y);
      y += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text('Key Deliverables:', 20, y);
      y += 6;
      
      doc.setFont(undefined, 'normal');
      phase.deliverables.slice(0, 5).forEach((deliverable, i) => {
        doc.text(`• ${deliverable}`, 25, y);
        y += 5;
      });
      
      if (phase.deliverables.length > 5) {
        doc.text(`... and ${phase.deliverables.length - 5} more`, 25, y);
        y += 5;
      }
      
      y += 10;
    });
  }
  
  // Recommendations
  doc.addPage();
  y = await addCyberCorrectHeader(doc, 'Recommendations', '');
  y += 10;
  
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text('Next Steps', 20, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  const recommendations = [
    'Review identified gaps and prioritize based on severity',
    'Create implementation roadmap using the provided phases',
    'Assign resources and set timelines for each phase',
    'Use recommended tools to address specific gaps',
    'Monitor progress and update roadmap as needed',
    'Conduct regular reassessments to track improvement'
  ];
  
  recommendations.forEach((rec, index) => {
    doc.text(`${index + 1}. ${rec}`, 20, y);
    y += 7;
  });
  
  // Add footer to last page
  addCyberCorrectFooter(doc);
  
  // Save PDF
  doc.save(`privacy-assessment-report-${Date.now()}.pdf`);
};

