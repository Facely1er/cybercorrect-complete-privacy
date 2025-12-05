import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { localStorageService } from './localStorageService';
import type { 
  DataRightsRequest,
  PrivacyIncident,
  VendorAssessment,
  ComplianceObligation
} from '../types/storage';

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
      margin?: { top?: number; right?: number; bottom?: number; left?: number };
      theme?: 'striped' | 'grid' | 'plain';
    }) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

interface ReportMetadata {
  reportType: string;
  reportTitle: string;
  organizationId: string;
  startDate?: string;
  endDate?: string;
  regulations: string[];
  generatedBy?: string;
}

interface ComplianceMetrics {
  overallScore: number;
  dataRightsRequests: {
    total: number;
    pending: number;
    completed: number;
    averageProcessingTime: string;
  };
  privacyIncidents: {
    total: number;
    open: number;
    resolved: number;
    highSeverity: number;
  };
  vendorAssessments: {
    total: number;
    compliant: number;
    highRisk: number;
    averageScore: number;
  };
  complianceObligations: {
    total: number;
    completed: number;
    overdue: number;
    inProgress: number;
  };
}

/**
 * Professional PDF Report Generator for Privacy Compliance Reports
 */
export class PDFReportService {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: { top: number; right: number; bottom: number; left: number };
  private currentY: number;
  private brandColor = { r: 59, g: 130, b: 246 }; // Blue-500
  private textColor = { r: 31, g: 41, b: 55 }; // Gray-800
  private lightGray = { r: 243, g: 244, b: 246 }; // Gray-100

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = { top: 20, right: 15, bottom: 20, left: 15 };
    this.currentY = this.margin.top;
  }

  /**
   * Generate a comprehensive compliance report PDF
   */
  async generateComplianceReport(metadata: ReportMetadata): Promise<void> {
    // Collect data
    const dataRightsRequests = localStorageService.getDataRightsRequests();
    const privacyIncidents = localStorageService.getPrivacyIncidents();
    const vendorAssessments = localStorageService.getVendorAssessments();
    const complianceObligations = localStorageService.getComplianceObligations();

    // Calculate metrics
    const metrics = this.calculateMetrics(
      dataRightsRequests,
      privacyIncidents,
      vendorAssessments,
      complianceObligations,
      metadata.startDate,
      metadata.endDate
    );

    // Generate PDF
    this.addCoverPage(metadata, metrics);
    this.addTableOfContents(metadata);
    this.addExecutiveSummary(metadata, metrics);
    this.addComplianceMetrics(metadata, metrics, dataRightsRequests, privacyIncidents, vendorAssessments, complianceObligations);
    this.addRegulatoryAnalysis(metadata, metrics);
    this.addRecommendations(metadata, metrics);
    this.addAppendices(metadata, dataRightsRequests, privacyIncidents, vendorAssessments);
    this.addFooter();

    // Save PDF
    const filename = this.generateFilename(metadata);
    this.doc.save(filename);
  }

  /**
   * Add professional cover page
   */
  private addCoverPage(metadata: ReportMetadata, metrics: ComplianceMetrics): void {
    // Background color bar
    this.doc.setFillColor(this.brandColor.r, this.brandColor.g, this.brandColor.b);
    this.doc.rect(0, 0, this.pageWidth, 50, 'F');

    // Logo/Title area
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CyberCorrect™', this.pageWidth / 2, 25, { align: 'center' });
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Privacy Compliance Platform', this.pageWidth / 2, 35, { align: 'center' });

    // Report Title
    this.currentY = 70;
    this.doc.setTextColor(this.textColor.r, this.textColor.g, this.textColor.b);
    this.doc.setFontSize(22);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(metadata.reportTitle, this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += 15;

    // Report Type Badge
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Report Type: ${this.formatReportType(metadata.reportType)}`, this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += 20;

    // Key Metrics Boxes
    const boxWidth = (this.pageWidth - this.margin.left - this.margin.right - 20) / 3;
    const boxHeight = 30;
    const startX = this.margin.left;

    // Compliance Score
    this.addMetricBox(startX, this.currentY, boxWidth, boxHeight, 'Overall Compliance', `${metrics.overallScore}%`, this.brandColor);
    
    // Data Rights Requests
    this.addMetricBox(startX + boxWidth + 10, this.currentY, boxWidth, boxHeight, 'Data Rights Requests', metrics.dataRightsRequests.total.toString(), { r: 34, g: 197, b: 94 });
    
    // Privacy Incidents
    this.addMetricBox(startX + (boxWidth + 10) * 2, this.currentY, boxWidth, boxHeight, 'Privacy Incidents', metrics.privacyIncidents.total.toString(), { r: 245, g: 158, b: 11 });

    this.currentY += boxHeight + 20;

    // Report Metadata
    this.doc.setFontSize(10);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, this.margin.left, this.currentY);
    this.currentY += 5;
    
    if (metadata.startDate && metadata.endDate) {
      this.doc.text(`Period: ${new Date(metadata.startDate).toLocaleDateString()} - ${new Date(metadata.endDate).toLocaleDateString()}`, this.margin.left, this.currentY);
      this.currentY += 5;
    }

    if (metadata.regulations.length > 0) {
      this.doc.text(`Regulations: ${metadata.regulations.map(r => r.toUpperCase()).join(', ')}`, this.margin.left, this.currentY);
      this.currentY += 5;
    }

    if (metadata.generatedBy) {
      this.doc.text(`Prepared by: ${metadata.generatedBy}`, this.margin.left, this.currentY);
    }

    this.currentY = this.pageHeight - this.margin.bottom;
    this.doc.setFontSize(8);
    this.doc.setTextColor(150, 150, 150);
    this.doc.text('CONFIDENTIAL - For Internal Use Only', this.pageWidth / 2, this.currentY, { align: 'center' });

    this.doc.addPage();
    this.currentY = this.margin.top;
  }

  /**
   * Add metric box with styling
   */
  private addMetricBox(x: number, y: number, width: number, height: number, label: string, value: string, color: { r: number; g: number; b: number }): void {
    // Box background
    this.doc.setFillColor(this.lightGray.r, this.lightGray.g, this.lightGray.b);
    this.doc.roundedRect(x, y, width, height, 3, 3, 'F');

    // Border
    this.doc.setDrawColor(color.r, color.g, color.b);
    this.doc.setLineWidth(0.5);
    this.doc.roundedRect(x, y, width, height, 3, 3);

    // Label
    this.doc.setFontSize(9);
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(label, x + width / 2, y + 8, { align: 'center' });

    // Value
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(color.r, color.g, color.b);
    this.doc.text(value, x + width / 2, y + 20, { align: 'center' });
  }

  /**
   * Add table of contents
   */
  private addTableOfContents(metadata: ReportMetadata): void {
    this.addSectionHeader('Table of Contents');
    this.currentY += 5;

    const tocItems = [
      'Executive Summary',
      'Compliance Metrics Overview',
      'Data Rights Management',
      'Privacy Incident Analysis',
      'Vendor Risk Assessment',
      'Compliance Obligations Status',
      'Regulatory Framework Analysis',
      'Recommendations & Action Items',
      'Appendices'
    ];

    this.doc.setFontSize(11);
    this.doc.setTextColor(this.textColor.r, this.textColor.g, this.textColor.b);
    
    tocItems.forEach((item, index) => {
      const yPos = this.currentY + (index * 7);
      this.doc.text(`${index + 1}.`, this.margin.left, yPos);
      this.doc.text(item, this.margin.left + 8, yPos);
      
      // Dotted line
      const dotSpacing = 2;
      const startX = this.margin.left + 60;
      const endX = this.pageWidth - this.margin.right - 15;
      const dots = Math.floor((endX - startX) / dotSpacing);
      
      for (let i = 0; i < dots; i++) {
        this.doc.circle(startX + i * dotSpacing, yPos - 1, 0.3, 'F');
      }
      
      // Page number (mock)
      this.doc.text(`${index + 2}`, this.pageWidth - this.margin.right, yPos, { align: 'right' });
    });

    this.doc.addPage();
    this.currentY = this.margin.top;
  }

  /**
   * Add executive summary section
   */
  private addExecutiveSummary(metadata: ReportMetadata, metrics: ComplianceMetrics): void {
    this.addSectionHeader('Executive Summary');
    this.currentY += 5;

    this.doc.setFontSize(10);
    this.doc.setTextColor(this.textColor.r, this.textColor.g, this.textColor.b);
    this.doc.setFont('helvetica', 'normal');

    const summaryText = `This ${this.formatReportType(metadata.reportType)} provides a comprehensive overview of the organization's privacy compliance program performance. ` +
      `The report covers compliance metrics, data rights management, privacy incidents, vendor assessments, and regulatory obligations. ` +
      `Overall compliance score stands at ${metrics.overallScore}%, indicating ${this.getComplianceStatus(metrics.overallScore)} compliance posture.`;

    const summaryLines = this.doc.splitTextToSize(summaryText, this.pageWidth - this.margin.left - this.margin.right);
    this.doc.text(summaryLines, this.margin.left, this.currentY);
    this.currentY += summaryLines.length * 6 + 10;

    // Key Highlights
    this.addSubsectionHeader('Key Highlights');
    this.currentY += 3;

    const highlights = [
      `Overall Compliance Score: ${metrics.overallScore}%`,
      `Data Rights Requests Processed: ${metrics.dataRightsRequests.completed} of ${metrics.dataRightsRequests.total}`,
      `Privacy Incidents: ${metrics.privacyIncidents.total} total (${metrics.privacyIncidents.resolved} resolved)`,
      `Vendor Assessments: ${metrics.vendorAssessments.compliant} compliant vendors out of ${metrics.vendorAssessments.total}`,
      `Compliance Obligations: ${metrics.complianceObligations.completed} completed, ${metrics.complianceObligations.overdue} overdue`
    ];

    highlights.forEach(highlight => {
      this.doc.setFontSize(9);
      this.doc.text('•', this.margin.left, this.currentY);
      this.doc.text(highlight, this.margin.left + 5, this.currentY);
      this.currentY += 6;
    });

    this.checkPageBreak(30);
  }

  /**
   * Add compliance metrics section
   */
  private addComplianceMetrics(
    metadata: ReportMetadata,
    metrics: ComplianceMetrics,
    dataRightsRequests: DataRightsRequest[],
    privacyIncidents: PrivacyIncident[],
    vendorAssessments: VendorAssessment[],
    complianceObligations: ComplianceObligation[]
  ): void {
    this.addSectionHeader('Compliance Metrics Overview');
    this.currentY += 5;

    // Metrics Table
    const metricsData = [
      ['Metric', 'Value', 'Status'],
      ['Overall Compliance Score', `${metrics.overallScore}%`, this.getStatusBadge(metrics.overallScore)],
      ['Data Rights Requests (Total)', metrics.dataRightsRequests.total.toString(), 'Active'],
      ['Data Rights Requests (Completed)', metrics.dataRightsRequests.completed.toString(), 'Completed'],
      ['Privacy Incidents (Total)', metrics.privacyIncidents.total.toString(), metrics.privacyIncidents.total > 0 ? 'Attention' : 'Good'],
      ['Privacy Incidents (Resolved)', metrics.privacyIncidents.resolved.toString(), 'Resolved'],
      ['Vendor Assessments (Total)', metrics.vendorAssessments.total.toString(), 'Active'],
      ['Vendor Assessments (Compliant)', metrics.vendorAssessments.compliant.toString(), 'Compliant'],
      ['Compliance Obligations (Total)', metrics.complianceObligations.total.toString(), 'Active'],
      ['Compliance Obligations (Completed)', metrics.complianceObligations.completed.toString(), 'Completed'],
      ['Compliance Obligations (Overdue)', metrics.complianceObligations.overdue.toString(), metrics.complianceObligations.overdue > 0 ? 'Critical' : 'Good']
    ];

    this.doc.autoTable({
      head: [metricsData[0]],
      body: metricsData.slice(1),
      startY: this.currentY,
      headStyles: {
        fillColor: [this.brandColor.r, this.brandColor.g, this.brandColor.b],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [this.textColor.r, this.textColor.g, this.textColor.b]
      },
      alternateRowStyles: {
        fillColor: [this.lightGray.r, this.lightGray.g, this.lightGray.b]
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 40, halign: 'center' },
        2: { cellWidth: 50, halign: 'center' }
      },
      margin: { left: this.margin.left, right: this.margin.right }
    });

    this.currentY = (this.doc.lastAutoTable?.finalY || this.currentY) + 15;
    this.checkPageBreak(50);
  }

  /**
   * Add regulatory analysis section
   */
  private addRegulatoryAnalysis(metadata: ReportMetadata, metrics: ComplianceMetrics): void {
    this.addSectionHeader('Regulatory Framework Analysis');
    this.currentY += 5;

    if (metadata.regulations.length === 0) {
      this.doc.setFontSize(10);
      this.doc.text('No specific regulations selected for this report.', this.margin.left, this.currentY);
      this.currentY += 10;
      return;
    }

    this.doc.setFontSize(10);
    this.doc.setTextColor(this.textColor.r, this.textColor.g, this.textColor.b);

    metadata.regulations.forEach(regulation => {
      this.addSubsectionHeader(regulation.toUpperCase());
      this.currentY += 3;

      const regulationText = this.getRegulationDescription(regulation);
      const lines = this.doc.splitTextToSize(regulationText, this.pageWidth - this.margin.left - this.margin.right);
      this.doc.text(lines, this.margin.left, this.currentY);
      this.currentY += lines.length * 6 + 8;

      this.checkPageBreak(30);
    });
  }

  /**
   * Add recommendations section
   */
  private addRecommendations(metadata: ReportMetadata, metrics: ComplianceMetrics): void {
    this.addSectionHeader('Recommendations & Action Items');
    this.currentY += 5;

    const recommendations = this.generateRecommendations(metrics);

    this.doc.setFontSize(10);
    this.doc.setTextColor(this.textColor.r, this.textColor.g, this.textColor.b);

    recommendations.forEach((rec, index) => {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${index + 1}. ${rec.title}`, this.margin.left, this.currentY);
      this.currentY += 6;

      this.doc.setFont('helvetica', 'normal');
      const lines = this.doc.splitTextToSize(rec.description, this.pageWidth - this.margin.left - this.margin.right - 10);
      this.doc.text(lines, this.margin.left + 5, this.currentY);
      this.currentY += lines.length * 5 + 8;

      this.checkPageBreak(30);
    });
  }

  /**
   * Add appendices with detailed data
   */
  private addAppendices(
    metadata: ReportMetadata,
    dataRightsRequests: DataRightsRequest[],
    privacyIncidents: PrivacyIncident[],
    vendorAssessments: VendorAssessment[]
  ): void {
    this.addSectionHeader('Appendices');
    this.currentY += 5;

    // Data Rights Requests Table
    if (dataRightsRequests.length > 0) {
      this.addSubsectionHeader('A. Data Rights Requests');
      this.currentY += 3;

      const requestsData = dataRightsRequests.slice(0, 50).map(req => [
        req.id.substring(0, 8),
        req.type,
        req.requesterName || 'N/A',
        req.status,
        new Date(req.submittedAt).toLocaleDateString()
      ]);

      this.doc.autoTable({
        head: [['ID', 'Type', 'Requester', 'Status', 'Submitted']],
        body: requestsData,
        startY: this.currentY,
        headStyles: {
          fillColor: [this.brandColor.r, this.brandColor.g, this.brandColor.b],
          textColor: [255, 255, 255],
          fontSize: 9
        },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: {
          fillColor: [this.lightGray.r, this.lightGray.g, this.lightGray.b]
        },
        margin: { left: this.margin.left, right: this.margin.right }
      });

      this.currentY = (this.doc.lastAutoTable?.finalY || this.currentY) + 15;
      this.checkPageBreak(50);
    }

    // Privacy Incidents Table
    if (privacyIncidents.length > 0) {
      this.addSubsectionHeader('B. Privacy Incidents');
      this.currentY += 3;

      const incidentsData = privacyIncidents.slice(0, 50).map(incident => [
        incident.incidentNumber,
        incident.title.substring(0, 40),
        incident.severity,
        incident.status,
        new Date(incident.discoveryDate).toLocaleDateString()
      ]);

      this.doc.autoTable({
        head: [['Incident #', 'Title', 'Severity', 'Status', 'Discovery Date']],
        body: incidentsData,
        startY: this.currentY,
        headStyles: {
          fillColor: [this.brandColor.r, this.brandColor.g, this.brandColor.b],
          textColor: [255, 255, 255],
          fontSize: 9
        },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: {
          fillColor: [this.lightGray.r, this.lightGray.g, this.lightGray.b]
        },
        margin: { left: this.margin.left, right: this.margin.right }
      });

      this.currentY = (this.doc.lastAutoTable?.finalY || this.currentY) + 15;
      this.checkPageBreak(50);
    }

    // Vendor Assessments Table
    if (vendorAssessments.length > 0) {
      this.addSubsectionHeader('C. Vendor Assessments');
      this.currentY += 3;

      const vendorsData = vendorAssessments.slice(0, 50).map(vendor => [
        vendor.vendorName.substring(0, 30),
        vendor.riskLevel,
        `${vendor.assessmentScore}%`,
        vendor.complianceStatus,
        new Date(vendor.lastAssessmentDate).toLocaleDateString()
      ]);

      this.doc.autoTable({
        head: [['Vendor Name', 'Risk Level', 'Score', 'Compliance', 'Last Assessment']],
        body: vendorsData,
        startY: this.currentY,
        headStyles: {
          fillColor: [this.brandColor.r, this.brandColor.g, this.brandColor.b],
          textColor: [255, 255, 255],
          fontSize: 9
        },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: {
          fillColor: [this.lightGray.r, this.lightGray.g, this.lightGray.b]
        },
        margin: { left: this.margin.left, right: this.margin.right }
      });
    }
  }

  /**
   * Add footer to all pages
   */
  private addFooter(): void {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Footer line
      this.doc.setDrawColor(200, 200, 200);
      this.doc.setLineWidth(0.5);
      this.doc.line(this.margin.left, this.pageHeight - this.margin.bottom, this.pageWidth - this.margin.right, this.pageHeight - this.margin.bottom);
      
      // Footer text
      this.doc.setFontSize(8);
      this.doc.setTextColor(150, 150, 150);
      this.doc.text('CyberCorrect™ Privacy Compliance Platform', this.margin.left, this.pageHeight - this.margin.bottom + 5);
      this.doc.text(`Page ${i} of ${pageCount}`, this.pageWidth - this.margin.right, this.pageHeight - this.margin.bottom + 5, { align: 'right' });
      this.doc.text(`Generated: ${new Date().toLocaleDateString()}`, this.pageWidth / 2, this.pageHeight - this.margin.bottom + 5, { align: 'center' });
    }
  }

  /**
   * Helper methods
   */
  private addSectionHeader(text: string): void {
    this.checkPageBreak(20);
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.brandColor.r, this.brandColor.g, this.brandColor.b);
    this.doc.text(text, this.margin.left, this.currentY);
    
    // Underline
    this.doc.setDrawColor(this.brandColor.r, this.brandColor.g, this.brandColor.b);
    this.doc.setLineWidth(1);
    this.doc.line(this.margin.left, this.currentY + 2, this.pageWidth - this.margin.right, this.currentY + 2);
    
    this.currentY += 8;
  }

  private addSubsectionHeader(text: string): void {
    this.checkPageBreak(15);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.textColor.r, this.textColor.g, this.textColor.b);
    this.doc.text(text, this.margin.left, this.currentY);
    this.currentY += 6;
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin.bottom) {
      this.doc.addPage();
      this.currentY = this.margin.top;
    }
  }

  private calculateMetrics(
    dataRightsRequests: DataRightsRequest[],
    privacyIncidents: PrivacyIncident[],
    vendorAssessments: VendorAssessment[],
    complianceObligations: ComplianceObligation[],
    startDate?: string,
    endDate?: string
  ): ComplianceMetrics {
    // Filter by date range if provided
    const filterByDate = (date: string) => {
      if (!startDate && !endDate) return true;
      const itemDate = new Date(date);
      if (startDate && itemDate < new Date(startDate)) return false;
      if (endDate && itemDate > new Date(endDate)) return false;
      return true;
    };

    const filteredRequests = dataRightsRequests.filter(req => filterByDate(req.submittedAt));
    const filteredIncidents = privacyIncidents.filter(inc => filterByDate(inc.discoveryDate));
    const filteredObligations = complianceObligations;

    // Calculate data rights metrics
    const completedRequests = filteredRequests.filter(r => r.status === 'completed' || r.status === 'resolved').length;
    const pendingRequests = filteredRequests.filter(r => r.status === 'pending' || r.status === 'in_progress').length;

    // Calculate incident metrics
    const resolvedIncidents = filteredIncidents.filter(i => i.status === 'resolved' || i.status === 'closed').length;
    const openIncidents = filteredIncidents.filter(i => i.status === 'open' || i.status === 'in_progress').length;
    const highSeverityIncidents = filteredIncidents.filter(i => i.severity === 'high' || i.severity === 'critical').length;

    // Calculate vendor metrics
    const compliantVendors = vendorAssessments.filter(v => v.complianceStatus === 'compliant' || v.assessmentScore >= 80).length;
    const highRiskVendors = vendorAssessments.filter(v => v.riskLevel === 'high' || v.riskLevel === 'critical').length;
    const averageVendorScore = vendorAssessments.length > 0
      ? Math.round(vendorAssessments.reduce((sum, v) => sum + (v.assessmentScore || 0), 0) / vendorAssessments.length)
      : 0;

    // Calculate obligation metrics
    const completedObligations = filteredObligations.filter(o => o.status === 'completed').length;
    const overdueObligations = filteredObligations.filter(o => {
      if (o.status === 'completed') return false;
      return new Date(o.dueDate) < new Date();
    }).length;
    const inProgressObligations = filteredObligations.filter(o => o.status === 'in_progress').length;

    // Calculate overall compliance score
    const scores = [
      filteredRequests.length > 0 ? (completedRequests / filteredRequests.length) * 100 : 100,
      filteredIncidents.length > 0 ? (resolvedIncidents / filteredIncidents.length) * 100 : 100,
      vendorAssessments.length > 0 ? averageVendorScore : 100,
      filteredObligations.length > 0 ? (completedObligations / filteredObligations.length) * 100 : 100
    ];
    const overallScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);

    return {
      overallScore,
      dataRightsRequests: {
        total: filteredRequests.length,
        pending: pendingRequests,
        completed: completedRequests,
        averageProcessingTime: '5.2 days'
      },
      privacyIncidents: {
        total: filteredIncidents.length,
        open: openIncidents,
        resolved: resolvedIncidents,
        highSeverity: highSeverityIncidents
      },
      vendorAssessments: {
        total: vendorAssessments.length,
        compliant: compliantVendors,
        highRisk: highRiskVendors,
        averageScore: averageVendorScore
      },
      complianceObligations: {
        total: filteredObligations.length,
        completed: completedObligations,
        overdue: overdueObligations,
        inProgress: inProgressObligations
      }
    };
  }

  private formatReportType(type: string): string {
    const types: Record<string, string> = {
      quarterly: 'Quarterly Compliance Report',
      annual: 'Annual Privacy Report',
      incident: 'Incident Summary Report',
      vendor: 'Vendor Assessment Report',
      data_rights: 'Data Rights Activity Report'
    };
    return types[type] || type;
  }

  private getComplianceStatus(score: number): string {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'moderate';
    return 'needs improvement';
  }

  private getStatusBadge(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Moderate';
    return 'Needs Improvement';
  }

  private getRegulationDescription(regulation: string): string {
    const descriptions: Record<string, string> = {
      ferpa: 'Family Educational Rights and Privacy Act (FERPA) protects the privacy of student education records. Compliance requires proper handling of student data, parental consent, and secure record management.',
      coppa: 'Children\'s Online Privacy Protection Act (COPPA) requires operators of websites and online services to protect children\'s privacy. Compliance involves obtaining parental consent and implementing appropriate data protection measures.',
      ccpa: 'California Consumer Privacy Act (CCPA) grants California residents rights over their personal information. Compliance requires transparency, consumer rights fulfillment, and proper data handling practices.',
      bipa: 'Biometric Information Privacy Act (BIPA) regulates the collection, use, and storage of biometric data. Compliance requires informed consent and secure biometric data management.',
      shield: 'New York SHIELD Act requires businesses to implement reasonable data security safeguards. Compliance involves implementing administrative, technical, and physical safeguards.',
      gdpr: 'General Data Protection Regulation (GDPR) protects EU residents\' personal data. Compliance requires lawful processing, data subject rights, privacy by design, and breach notification procedures.'
    };
    return descriptions[regulation.toLowerCase()] || `Compliance with ${regulation.toUpperCase()} requirements.`;
  }

  private generateRecommendations(metrics: ComplianceMetrics): Array<{ title: string; description: string }> {
    const recommendations: Array<{ title: string; description: string }> = [];

    if (metrics.overallScore < 75) {
      recommendations.push({
        title: 'Improve Overall Compliance Posture',
        description: `Current compliance score of ${metrics.overallScore}% indicates areas for improvement. Focus on completing overdue obligations and resolving open privacy incidents.`
      });
    }

    if (metrics.dataRightsRequests.pending > 10) {
      recommendations.push({
        title: 'Accelerate Data Rights Request Processing',
        description: `There are ${metrics.dataRightsRequests.pending} pending data rights requests. Consider streamlining the request processing workflow to meet regulatory deadlines.`
      });
    }

    if (metrics.privacyIncidents.open > 0) {
      recommendations.push({
        title: 'Resolve Open Privacy Incidents',
        description: `Address ${metrics.privacyIncidents.open} open privacy incident(s) promptly. High-severity incidents should be prioritized for immediate resolution.`
      });
    }

    if (metrics.vendorAssessments.highRisk > 0) {
      recommendations.push({
        title: 'Address High-Risk Vendor Relationships',
        description: `Review and remediate ${metrics.vendorAssessments.highRisk} high-risk vendor assessment(s). Consider additional security controls or vendor replacement.`
      });
    }

    if (metrics.complianceObligations.overdue > 0) {
      recommendations.push({
        title: 'Complete Overdue Compliance Obligations',
        description: `Address ${metrics.complianceObligations.overdue} overdue compliance obligation(s) to maintain regulatory compliance and reduce risk exposure.`
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Maintain Current Compliance Posture',
        description: 'Continue monitoring compliance metrics and maintaining current privacy program effectiveness. Regular assessments and updates are recommended.'
      });
    }

    return recommendations;
  }

  private generateFilename(metadata: ReportMetadata): string {
    const dateStr = new Date().toISOString().split('T')[0];
    const typeStr = metadata.reportType.replace('_', '-');
    return `compliance-report-${typeStr}-${dateStr}.pdf`;
  }
}

// Export singleton instance
export const pdfReportService = new PDFReportService();

