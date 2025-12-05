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

interface ExportMetadata {
  title: string;
  subtitle?: string;
  timestamp: string;
  reportId?: string;
  version?: string;
  generatedBy?: string;
}

interface SummaryData {
  [key: string]: string | number;
}

/**
 * Generic PDF generator for data exports
 */
export const generateDataExportPdf = async (
  metadata: ExportMetadata,
  summary: SummaryData,
  tableData: {
    headers: string[];
    rows: Array<Array<string | number>>;
    title?: string;
  }[],
  filename: string
): Promise<void> => {
  const doc = new jsPDF();
  
  // Add header with logo
  let y = await addCyberCorrectHeader(doc, metadata.title, metadata.subtitle);

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date(metadata.timestamp).toLocaleDateString()}`, 20, y);
  y += 5;
  if (metadata.reportId) {
    doc.text(`Report ID: ${metadata.reportId}`, 20, y);
    y += 5;
  }
  if (metadata.version) {
    doc.text(`Version: ${metadata.version}`, 20, y);
    y += 5;
  }
  y += 10;

  // Summary Section
  if (Object.keys(summary).length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Summary', 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    Object.entries(summary).forEach(([key, value]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      doc.text(`${label}: ${value}`, 20, y);
      y += 6;
    });
    y += 10;
  }

  // Tables
  tableData.forEach((table, index) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    if (table.title) {
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text(table.title, 20, y);
      y += 10;
    }

    doc.autoTable({
      head: [table.headers],
      body: table.rows,
      startY: y,
      headStyles: { fillColor: [60, 100, 240], fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 240, 240], fontSize: 8 },
      styles: { fontSize: 8 }
    });

    y = (doc.lastAutoTable?.finalY || y) + 15;
  });

  // Add footer with branding
  addCyberCorrectFooter(doc, metadata.reportId);

  doc.save(filename);
};

/**
 * Generate PDF for Privacy by Design Assessment
 */
export const generatePrivacyByDesignPdf = (data: {
  metadata: { timestamp: string; reportId: string; version: string };
  summary: { totalAssessments: number; completedAssessments: number; compliantAssessments: number; averageScore: number };
  assessments: Array<{
    name: string;
    description: string;
    systemType: string;
    status: string;
    complianceStatus: string;
    overallScore: number;
    assessmentDate: string;
    assessor: string;
    principles: Record<string, { score: number; notes: string }>;
    recommendations: string[];
  }>;
}): void => {
  const tableData = data.assessments.map(assessment => [
    assessment.name.length > 40 ? assessment.name.substring(0, 40) + '...' : assessment.name,
    assessment.systemType,
    assessment.status,
    assessment.complianceStatus,
    `${assessment.overallScore}%`,
    new Date(assessment.assessmentDate).toLocaleDateString()
  ]);

  generateDataExportPdf(
    {
      title: 'Privacy by Design Assessment Report',
      timestamp: data.metadata.timestamp,
      reportId: data.metadata.reportId,
      version: data.metadata.version
    },
    {
      'Total Assessments': data.summary.totalAssessments,
      'Completed': data.summary.completedAssessments,
      'Compliant': data.summary.compliantAssessments,
      'Average Score': `${data.summary.averageScore}%`
    },
    [
      {
        title: 'Assessments',
        headers: ['Name', 'System Type', 'Status', 'Compliance', 'Score', 'Date'],
        rows: tableData
      }
    ],
    `privacy-by-design-assessments-${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Generate PDF for Retention Policy Generator
 */
export const generateRetentionPolicyPdf = (data: {
  metadata: { timestamp: string; reportId: string; version: string };
  summary: {
    totalPolicies: number;
    activePolicies: number;
    compliantPolicies: number;
    totalRecords: number;
    expiredRecords: number;
    scheduledDeletion: number;
  };
  policies: Array<{
    name: string;
    dataCategory: string;
    retentionPeriod: string;
    status: string;
    complianceStatus: string;
    nextReview: string;
  }>;
  dataRecords: Array<{
    dataType: string;
    dataCategory: string;
    subject: string;
    retentionPolicy: string;
    retentionEndDate: string;
    status: string;
  }>;
}): void => {
  const policiesTable = data.policies.map(policy => [
    policy.name.length > 40 ? policy.name.substring(0, 40) + '...' : policy.name,
    policy.dataCategory,
    policy.retentionPeriod,
    policy.status,
    policy.complianceStatus,
    new Date(policy.nextReview).toLocaleDateString()
  ]);

  const recordsTable = data.dataRecords.slice(0, 100).map(record => [
    record.dataType,
    record.dataCategory,
    record.subject.length > 30 ? record.subject.substring(0, 30) + '...' : record.subject,
    record.retentionPolicy.length > 30 ? record.retentionPolicy.substring(0, 30) + '...' : record.retentionPolicy,
    new Date(record.retentionEndDate).toLocaleDateString(),
    record.status
  ]);

  generateDataExportPdf(
    {
      title: 'Retention Policy Report',
      timestamp: data.metadata.timestamp,
      reportId: data.metadata.reportId,
      version: data.metadata.version
    },
    {
      'Total Policies': data.summary.totalPolicies,
      'Active Policies': data.summary.activePolicies,
      'Compliant Policies': data.summary.compliantPolicies,
      'Total Records': data.summary.totalRecords,
      'Expired Records': data.summary.expiredRecords,
      'Scheduled Deletion': data.summary.scheduledDeletion
    },
    [
      {
        title: 'Retention Policies',
        headers: ['Policy Name', 'Data Category', 'Retention Period', 'Status', 'Compliance', 'Next Review'],
        rows: policiesTable
      },
      {
        title: 'Data Records (Sample)',
        headers: ['Data Type', 'Category', 'Subject', 'Policy', 'End Date', 'Status'],
        rows: recordsTable
      }
    ],
    `retention-policies-${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Generate PDF for Vendor Risk Assessment
 */
export const generateVendorRiskAssessmentPdf = (data: {
  metadata: { timestamp: string; reportId: string; version: string };
  summary: {
    totalVendors: number;
    compliantVendors: number;
    highRiskVendors: number;
    reviewNeeded: number;
  };
  assessments: Array<{
    vendorName: string;
    serviceDescription: string;
    riskLevel: string;
    complianceStatus: string;
    assessmentScore: number;
    lastAssessmentDate: string;
    nextAssessmentDue: string;
  }>;
}): void => {
  const averageScore = data.assessments.length > 0
    ? Math.round(data.assessments.reduce((sum, a) => sum + a.assessmentScore, 0) / data.assessments.length)
    : 0;
  
  const tableData = data.assessments.map(assessment => [
    assessment.vendorName.length > 40 ? assessment.vendorName.substring(0, 40) + '...' : assessment.vendorName,
    assessment.serviceDescription.length > 30 ? assessment.serviceDescription.substring(0, 30) + '...' : assessment.serviceDescription,
    assessment.riskLevel,
    assessment.complianceStatus,
    `${assessment.assessmentScore}%`,
    new Date(assessment.lastAssessmentDate).toLocaleDateString()
  ]);

  generateDataExportPdf(
    {
      title: 'Vendor Risk Assessment Report',
      timestamp: data.metadata.timestamp,
      reportId: data.metadata.reportId,
      version: data.metadata.version
    },
    {
      'Total Vendors': data.summary.totalVendors,
      'Compliant Vendors': data.summary.compliantVendors,
      'High Risk Vendors': data.summary.highRiskVendors,
      'Review Needed': data.summary.reviewNeeded,
      'Average Score': `${averageScore}%`
    },
    [
      {
        title: 'Vendor Assessments',
        headers: ['Vendor Name', 'Service', 'Risk Level', 'Compliance', 'Score', 'Last Assessment'],
        rows: tableData
      }
    ],
    `vendor-assessments-${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Generate PDF for Privacy Maintenance Scheduler
 */
export const generatePrivacyMaintenancePdf = (data: {
  metadata: { timestamp: string; reportId: string; version: string; generatedBy?: string };
  summary: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    upcomingTasks: number;
  };
  data: {
    tasks: Array<{
      title: string;
      category: string;
      priority: string;
      dueDate: string;
      status: string;
      assignedTo: string;
    }>;
  };
}): void => {
  const tableData = data.data.tasks.map(task => [
    task.title.length > 40 ? task.title.substring(0, 40) + '...' : task.title,
    task.category,
    task.priority,
    new Date(task.dueDate).toLocaleDateString(),
    task.status,
    task.assignedTo
  ]);

  generateDataExportPdf(
    {
      title: 'Privacy Maintenance Schedule Report',
      timestamp: data.metadata.timestamp,
      reportId: data.metadata.reportId,
      version: data.metadata.version,
      generatedBy: data.metadata.generatedBy
    },
    {
      'Total Tasks': data.summary.totalTasks,
      'Completed': data.summary.completedTasks,
      'Overdue': data.summary.overdueTasks,
      'Upcoming': data.summary.upcomingTasks
    },
    [
      {
        title: 'Maintenance Tasks',
        headers: ['Task', 'Category', 'Priority', 'Due Date', 'Status', 'Assigned To'],
        rows: tableData
      }
    ],
    `privacy-maintenance-${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Generate PDF for Privacy Settings Audit
 */
export const generatePrivacySettingsAuditPdf = (data: {
  metadata: { timestamp: string; reportId: string; version: string; generatedBy?: string };
  summary: {
    overallScore: number;
    totalPlatforms: number;
    configuredPlatforms: number;
    totalChecklistItems: number;
    compliantItems: number;
  };
  data: {
    platforms: Array<{
      platform: string;
      category: string;
      status: string;
      privacyLevel: string;
      lastAudited?: string;
    }>;
    checklist: Array<{
      item: string;
      category: string;
      status: string;
      priority: string;
    }>;
  };
}): void => {
  const platformsTable = data.data.platforms.map(platform => [
    platform.platform,
    platform.category,
    platform.status,
    platform.privacyLevel,
    platform.lastAudited ? new Date(platform.lastAudited).toLocaleDateString() : 'N/A'
  ]);

  const checklistTable = data.data.checklist.map(item => [
    item.item.length > 40 ? item.item.substring(0, 40) + '...' : item.item,
    item.category,
    item.status,
    item.priority
  ]);

  generateDataExportPdf(
    {
      title: 'Privacy Settings Audit Report',
      timestamp: data.metadata.timestamp,
      reportId: data.metadata.reportId,
      version: data.metadata.version,
      generatedBy: data.metadata.generatedBy
    },
    {
      'Overall Score': `${data.summary.overallScore}%`,
      'Total Platforms': data.summary.totalPlatforms,
      'Configured Platforms': data.summary.configuredPlatforms,
      'Checklist Items': data.summary.totalChecklistItems,
      'Compliant Items': data.summary.compliantItems
    },
    [
      {
        title: 'Platforms',
        headers: ['Platform', 'Category', 'Status', 'Privacy Level', 'Last Audited'],
        rows: platformsTable
      },
      {
        title: 'Checklist Items',
        headers: ['Item', 'Category', 'Status', 'Priority'],
        rows: checklistTable
      }
    ],
    `privacy-settings-audit-${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Generate PDF for Service Provider Manager
 */
export const generateServiceProviderPdf = (data: {
  metadata: { timestamp: string; reportId: string; version: string };
  summary: {
    totalProviders: number;
    activeProviders: number;
    highRiskProviders: number;
    averageComplianceScore: number;
  };
  providers: Array<{
    name: string;
    category: string;
    status: string;
    riskAssessment: {
      overallRisk: string;
    };
    monitoring: {
      complianceScore: number;
      lastAudit: string;
    };
  }>;
}): void => {
  const compliantProviders = data.providers.filter(p => 
    p.monitoring.complianceScore >= 80
  ).length;

  const tableData = data.providers.map(provider => [
    provider.name.length > 40 ? provider.name.substring(0, 40) + '...' : provider.name,
    provider.category,
    provider.status,
    provider.riskAssessment.overallRisk,
    `${provider.monitoring.complianceScore}%`,
    new Date(provider.monitoring.lastAudit).toLocaleDateString()
  ]);

  generateDataExportPdf(
    {
      title: 'Service Provider Report',
      timestamp: data.metadata.timestamp,
      reportId: data.metadata.reportId,
      version: data.metadata.version
    },
    {
      'Total Providers': data.summary.totalProviders,
      'Active Providers': data.summary.activeProviders,
      'High Risk Providers': data.summary.highRiskProviders,
      'Compliant Providers': compliantProviders,
      'Average Score': `${data.summary.averageComplianceScore}%`
    },
    [
      {
        title: 'Service Providers',
        headers: ['Provider Name', 'Category', 'Status', 'Risk Level', 'Compliance Score', 'Last Audit'],
        rows: tableData
      }
    ],
    `service-providers-${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Generate PDF for Incident Response Manager
 */
export const generateIncidentResponsePdf = (data: {
  metadata: { timestamp: string; reportId: string; version: string };
  summary: {
    totalIncidents: number;
    openIncidents: number;
    resolvedIncidents: number;
    highSeverityIncidents: number;
  };
  incidents: Array<{
    title: string;
    type: string;
    severity: string;
    status: string;
    reportedDate: string;
    resolvedDate?: string;
  }>;
}): void => {
  const tableData = data.incidents.map(incident => [
    incident.title.length > 40 ? incident.title.substring(0, 40) + '...' : incident.title,
    incident.type.replace('_', ' '),
    incident.severity,
    incident.status,
    new Date(incident.reportedDate).toLocaleDateString(),
    incident.resolvedDate ? new Date(incident.resolvedDate).toLocaleDateString() : 'N/A'
  ]);

  generateDataExportPdf(
    {
      title: 'Privacy Incident Response Report',
      timestamp: data.metadata.timestamp,
      reportId: data.metadata.reportId,
      version: data.metadata.version
    },
    {
      'Total Incidents': data.summary.totalIncidents,
      'Open Incidents': data.summary.openIncidents,
      'Resolved Incidents': data.summary.resolvedIncidents,
      'High Severity': data.summary.highSeverityIncidents
    },
    [
      {
        title: 'Privacy Incidents',
        headers: ['Title', 'Type', 'Severity', 'Status', 'Reported', 'Resolved'],
        rows: tableData
      }
    ],
    `privacy-incidents-${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Generate PDF for Data Broker Removal Manager
 */
export const generateDataBrokerRemovalPdf = (data: {
  metadata: { timestamp: string; reportId: string; version: string; generatedBy?: string };
  summary: {
    totalBrokers: number;
    totalRemoved: number;
    totalPending: number;
    totalTemplates: number;
  };
  data: {
    brokers: Array<{
      name: string;
      category: string;
      removalStatus: string;
      priority: string;
      requestDate?: string;
      completionDate?: string;
    }>;
  };
}): void => {
  const tableData = data.data.brokers.map(broker => [
    broker.name.length > 40 ? broker.name.substring(0, 40) + '...' : broker.name,
    broker.category,
    broker.removalStatus,
    broker.priority,
    broker.requestDate ? new Date(broker.requestDate).toLocaleDateString() : 'N/A',
    broker.completionDate ? new Date(broker.completionDate).toLocaleDateString() : 'Pending'
  ]);

  generateDataExportPdf(
    {
      title: 'Data Broker Removal Report',
      timestamp: data.metadata.timestamp,
      reportId: data.metadata.reportId,
      version: data.metadata.version,
      generatedBy: data.metadata.generatedBy
    },
    {
      'Total Brokers': data.summary.totalBrokers,
      'Removed': data.summary.totalRemoved,
      'Pending Removal': data.summary.totalPending,
      'Templates': data.summary.totalTemplates
    },
    [
      {
        title: 'Data Brokers',
        headers: ['Broker Name', 'Category', 'Status', 'Priority', 'Request Date', 'Completion Date'],
        rows: tableData
      }
    ],
    `data-broker-removal-${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Generate PDF for Employee Digital Footprint Assessment
 */
export const generateEmployeeDigitalFootprintPdf = (data: {
  metadata: { timestamp: string; assessmentId: string; version: string; generatedBy?: string };
  summary: {
    totalDataCategories: number;
    totalAccounts: number;
    totalActivities: number;
    riskScore: number;
    exposureLevel: string;
    complianceStatus: string;
  };
  assessment: {
    employeeDataCategories: Array<{ name: string; type: string; sensitivity: string }>;
    accountProfiles: Array<{ platform: string; accountType: string; privacyLevel: string; status: string }>;
    digitalActivities: Array<{ activity: string; frequency: string; riskLevel: string }>;
  };
}): void => {
  const categoriesTable = data.assessment.employeeDataCategories.map(cat => [
    cat.name,
    cat.type,
    cat.sensitivity
  ]);

  const accountsTable = data.assessment.accountProfiles.map(acc => [
    acc.platform,
    acc.accountType,
    acc.privacyLevel,
    acc.status
  ]);

  const activitiesTable = data.assessment.digitalActivities.map(act => [
    act.activity.length > 40 ? act.activity.substring(0, 40) + '...' : act.activity,
    act.frequency,
    act.riskLevel
  ]);

  generateDataExportPdf(
    {
      title: 'Employee Digital Footprint Assessment Report',
      timestamp: data.metadata.timestamp,
      reportId: data.metadata.assessmentId,
      version: data.metadata.version,
      generatedBy: data.metadata.generatedBy
    },
    {
      'Risk Score': `${data.summary.riskScore}%`,
      'Exposure Level': data.summary.exposureLevel,
      'Compliance Status': data.summary.complianceStatus,
      'Data Categories': data.summary.totalDataCategories,
      'Accounts': data.summary.totalAccounts,
      'Activities': data.summary.totalActivities
    },
    [
      {
        title: 'Data Categories',
        headers: ['Name', 'Type', 'Sensitivity'],
        rows: categoriesTable
      },
      {
        title: 'Account Profiles',
        headers: ['Platform', 'Account Type', 'Privacy Level', 'Status'],
        rows: accountsTable
      },
      {
        title: 'Digital Activities',
        headers: ['Activity', 'Frequency', 'Risk Level'],
        rows: activitiesTable
      }
    ],
    `employee-digital-footprint-${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Generate PDF for Consent Management
 */
export const generateConsentManagementPdf = (data: {
  metadata: { timestamp: string; reportId: string; version: string; generatedBy?: string };
  summary: {
    totalRecords: number;
    activeRecords: number;
    withdrawnRecords: number;
    renewalRequired: number;
  };
  records: Array<{
    employeeName: string;
    consentType: string;
    serviceProvider: string;
    status: string;
    consentDate?: string;
    expiryDate?: string;
  }>;
}): void => {
  const tableData = data.records.map(record => [
    record.employeeName.length > 30 ? record.employeeName.substring(0, 30) + '...' : record.employeeName,
    record.consentType.replace('_', ' '),
    record.serviceProvider.length > 30 ? record.serviceProvider.substring(0, 30) + '...' : record.serviceProvider,
    record.status,
    record.consentDate ? new Date(record.consentDate).toLocaleDateString() : 'N/A',
    record.expiryDate ? new Date(record.expiryDate).toLocaleDateString() : 'N/A'
  ]);

  const consentRate = data.summary.totalRecords > 0
    ? Math.round((data.summary.activeRecords / data.summary.totalRecords) * 100)
    : 0;

  generateDataExportPdf(
    {
      title: 'Consent Management Report',
      timestamp: data.metadata.timestamp,
      reportId: data.metadata.reportId,
      version: data.metadata.version,
      generatedBy: data.metadata.generatedBy
    },
    {
      'Total Records': data.summary.totalRecords,
      'Active Records': data.summary.activeRecords,
      'Withdrawn Records': data.summary.withdrawnRecords,
      'Renewal Required': data.summary.renewalRequired,
      'Consent Rate': `${consentRate}%`
    },
    [
      {
        title: 'Consent Records',
        headers: ['Employee Name', 'Consent Type', 'Service Provider', 'Status', 'Consent Date', 'Expiry Date'],
        rows: tableData
      }
    ],
    `consent-records-${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Generate PDF for DPIA Manager
 */
export const generateDpiaPdf = (data: {
  metadata: { timestamp: string; reportId: string; version: string };
  summary: {
    totalDpias: number;
    completedDpias: number;
    inProgressDpias: number;
    highRiskDpias: number;
  };
  dpias: Array<{
    title: string;
    processingActivity: string;
    riskLevel: string;
    status: string;
    createdDate: string;
    lastUpdated: string;
  }>;
}): void => {
  const tableData = data.dpias.map(dpia => [
    dpia.title.length > 40 ? dpia.title.substring(0, 40) + '...' : dpia.title,
    dpia.processingActivity.length > 40 ? dpia.processingActivity.substring(0, 40) + '...' : dpia.processingActivity,
    dpia.riskLevel,
    dpia.status,
    new Date(dpia.createdDate).toLocaleDateString(),
    new Date(dpia.lastUpdated).toLocaleDateString()
  ]);

  generateDataExportPdf(
    {
      title: 'Data Protection Impact Assessment (DPIA) Report',
      timestamp: data.metadata.timestamp,
      reportId: data.metadata.reportId,
      version: data.metadata.version
    },
    {
      'Total DPIAs': data.summary.totalDpias,
      'Completed': data.summary.completedDpias,
      'In Progress': data.summary.inProgressDpias,
      'High Risk': data.summary.highRiskDpias
    },
    [
      {
        title: 'DPIAs',
        headers: ['Title', 'Processing Activity', 'Risk Level', 'Status', 'Created', 'Last Updated'],
        rows: tableData
      }
    ],
    `dpias-${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Generate PDF for Policy Generator
 */
export const generatePolicyGeneratorPdf = (data: {
  metadata: { timestamp: string; framework: string; version: string };
  policies: Array<{
    title: string;
    type: string;
    framework: string;
    status: string;
    lastUpdated: string;
    sections: number;
  }>;
}): void => {
  const tableData = data.policies.map(policy => [
    policy.title.length > 50 ? policy.title.substring(0, 50) + '...' : policy.title,
    policy.type,
    policy.framework,
    policy.status,
    `${policy.sections} sections`,
    new Date(policy.lastUpdated).toLocaleDateString()
  ]);

  generateDataExportPdf(
    {
      title: 'Privacy Policy Report',
      subtitle: `Framework: ${data.metadata.framework}`,
      timestamp: data.metadata.timestamp,
      version: data.metadata.version
    },
    {
      'Total Policies': data.policies.length,
      'Framework': data.metadata.framework
    },
    [
      {
        title: 'Generated Policies',
        headers: ['Title', 'Type', 'Framework', 'Status', 'Sections', 'Last Updated'],
        rows: tableData
      }
    ],
    `privacy-policies-${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Generate PDF for Compliance Gap Analyzer
 */
export const generateComplianceGapAnalyzerPdf = (data: {
  metadata: { timestamp: string; framework: string; assessmentId: string; version: string; generatedBy: string };
  executiveSummary: {
    overallScore: number;
    totalControls: number;
    implementedControls: number;
    totalGaps: number;
    criticalGaps: number;
    estimatedCost: number;
    riskLevel: string;
  };
  gapAnalysis: Array<{
    title: string;
    priority: string;
    domain: string;
    estimatedCost: number;
    timeframe: string;
  }>;
}): void => {
  const gapsTable = data.gapAnalysis.map(gap => [
    gap.title.length > 50 ? gap.title.substring(0, 50) + '...' : gap.title,
    gap.domain,
    gap.priority,
    gap.timeframe,
    `$${gap.estimatedCost.toLocaleString()}`
  ]);

  generateDataExportPdf(
    {
      title: 'Compliance Gap Analysis Report',
      subtitle: `Framework: ${data.metadata.framework}`,
      timestamp: data.metadata.timestamp,
      reportId: data.metadata.assessmentId,
      version: data.metadata.version,
      generatedBy: data.metadata.generatedBy
    },
    {
      'Overall Score': `${data.executiveSummary.overallScore}%`,
      'Total Controls': data.executiveSummary.totalControls,
      'Implemented': data.executiveSummary.implementedControls,
      'Total Gaps': data.executiveSummary.totalGaps,
      'Critical Gaps': data.executiveSummary.criticalGaps,
      'Risk Level': data.executiveSummary.riskLevel,
      'Estimated Cost': `$${data.executiveSummary.estimatedCost.toLocaleString()}`
    },
    [
      {
        title: 'Compliance Gaps',
        headers: ['Gap Title', 'Domain', 'Priority', 'Timeframe', 'Estimated Cost'],
        rows: gapsTable
      }
    ],
    `compliance-gap-analysis-${new Date().toISOString().split('T')[0]}.pdf`
  );
};

/**
 * Generate PDF for Privacy Rights Manager
 */
export const generatePrivacyRightsPdf = (data: {
  metadata: { timestamp: string; reportId: string; version: string };
  summary: {
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    averageProcessingTime: string;
  };
  requests: Array<{
    id: string;
    type: string;
    requesterName: string;
    status: string;
    submittedDate: string;
    completedDate?: string;
  }>;
}): void => {
  const tableData = data.requests.map(request => [
    request.id,
    request.type,
    request.requesterName.length > 30 ? request.requesterName.substring(0, 30) + '...' : request.requesterName,
    request.status,
    new Date(request.submittedDate).toLocaleDateString(),
    request.completedDate ? new Date(request.completedDate).toLocaleDateString() : 'Pending'
  ]);

  generateDataExportPdf(
    {
      title: 'Privacy Rights Request Report',
      timestamp: data.metadata.timestamp,
      reportId: data.metadata.reportId,
      version: data.metadata.version
    },
    {
      'Total Requests': data.summary.totalRequests,
      'Pending': data.summary.pendingRequests,
      'Completed': data.summary.completedRequests,
      'Avg Processing Time': data.summary.averageProcessingTime
    },
    [
      {
        title: 'Privacy Rights Requests',
        headers: ['Request ID', 'Type', 'Requester', 'Status', 'Submitted', 'Completed'],
        rows: tableData
      }
    ],
    `privacy-rights-requests-${new Date().toISOString().split('T')[0]}.pdf`
  );
};
