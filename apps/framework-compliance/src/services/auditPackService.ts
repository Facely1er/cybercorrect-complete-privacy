/**
 * Audit Pack Service - Evidence Aggregation and Export
 * 
 * This service aggregates evidence from all compliance tools and creates
 * audit-ready documentation packs for compliance audits.
 */

import { getProcessingActivities, exportToPDF as exportRoPAPDF, exportToCSV as exportRoPACSV } from './ropaService';
import { getDataSubjectRequests, exportToCSV as exportDSARCSV } from './dsarService';
import { getEvidenceRecords } from './evidenceService';
import { getPrivacyIncidents, exportToCSV as exportIncidentsCSV } from './incidentService';
import { getDpias, exportToCSV as exportDPIACSV } from './dpiaService';

export interface AuditPackContents {
  ropa: {
    records: any[];
    count: number;
  };
  dsar: {
    records: any[];
    count: number;
  };
  dpias: {
    records: any[];
    count: number;
  };
  incidents: {
    records: any[];
    count: number;
  };
  evidence: {
    records: any[];
    count: number;
  };
  metadata: {
    generatedAt: string;
    generatedBy?: string;
    organization?: string;
    period?: {
      start: string;
      end: string;
    };
  };
}

/**
 * Generate audit pack contents by aggregating all compliance data
 */
export async function generateAuditPackContents(
  options?: {
    startDate?: string;
    endDate?: string;
    includeEvidence?: boolean;
  },
): Promise<AuditPackContents> {
  const startDate = options?.startDate;
  const endDate = options?.endDate || new Date().toISOString().split('T')[0];

  // Fetch all compliance data
  const [ropaRecords, dsarRecords, dpias, incidents, evidenceRecords] = await Promise.all([
    getProcessingActivities(),
    getDataSubjectRequests(),
    getDpias(),
    getPrivacyIncidents(),
    options?.includeEvidence !== false ? getEvidenceRecords() : Promise.resolve([]),
  ]);

  // Filter by date range if provided
  const filterByDate = (records: any[], dateField: string) => {
    if (!startDate) return records;
    return records.filter(record => {
      const recordDate = record[dateField] || record.createdAt;
      if (!recordDate) return true;
      return recordDate >= startDate && recordDate <= endDate;
    });
  };

  const filteredRopa = filterByDate(ropaRecords, 'createdAt');
  const filteredDSAR = filterByDate(dsarRecords, 'submittedDate');
  const filteredDPIAs = filterByDate(dpias, 'createdDate');
  const filteredIncidents = filterByDate(incidents, 'reportedDate');
  const filteredEvidence = filterByDate(evidenceRecords, 'createdAt');

  return {
    ropa: {
      records: filteredRopa,
      count: filteredRopa.length,
    },
    dsar: {
      records: filteredDSAR,
      count: filteredDSAR.length,
    },
    dpias: {
      records: filteredDPIAs,
      count: filteredDPIAs.length,
    },
    incidents: {
      records: filteredIncidents,
      count: filteredIncidents.length,
    },
    evidence: {
      records: filteredEvidence,
      count: filteredEvidence.length,
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      period: startDate
        ? {
            start: startDate,
            end: endDate,
          }
        : undefined,
    },
  };
}

/**
 * Export audit pack as JSON
 */
export async function exportAuditPackAsJSON(
  options?: {
    startDate?: string;
    endDate?: string;
    includeEvidence?: boolean;
  },
): Promise<string> {
  const contents = await generateAuditPackContents(options);
  return JSON.stringify(contents, null, 2);
}

/**
 * Export audit pack as ZIP (combines all CSV exports)
 */
export async function exportAuditPackAsZIP(
  options?: {
    startDate?: string;
    endDate?: string;
    includeEvidence?: boolean;
  },
): Promise<Blob> {
  const contents = await generateAuditPackContents(options);

  // Import JSZip dynamically (you may need to install it: npm install jszip)
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  // Add RoPA CSV
  if (contents.ropa.count > 0) {
    const ropaCSV = exportRoPACSV(contents.ropa.records);
    zip.file('ropa-records.csv', ropaCSV);
  }

  // Add DSAR CSV
  if (contents.dsar.count > 0) {
    const dsarCSV = exportDSARCSV(contents.dsar.records);
    zip.file('dsar-requests.csv', dsarCSV);
  }

  // Add DPIA CSV
  if (contents.dpias.count > 0) {
    const dpiaCSV = exportDPIACSV(contents.dpias.records);
    zip.file('dpia-assessments.csv', dpiaCSV);
  }

  // Add Incidents CSV
  if (contents.incidents.count > 0) {
    const incidentsCSV = exportIncidentsCSV(contents.incidents.records);
    zip.file('incidents.csv', incidentsCSV);
  }

  // Add metadata JSON
  zip.file('metadata.json', JSON.stringify(contents.metadata, null, 2));

  // Add summary report
  const summary = generateSummaryReport(contents);
  zip.file('summary.txt', summary);

  // Generate ZIP blob
  return zip.generateAsync({ type: 'blob' });
}

/**
 * Generate a text summary report
 */
function generateSummaryReport(contents: AuditPackContents): string {
  const lines = [
    'CyberCorrect Privacy Compliance Audit Pack',
    '==========================================',
    '',
    `Generated: ${new Date(contents.metadata.generatedAt).toLocaleString()}`,
    contents.metadata.period
      ? `Period: ${contents.metadata.period.start} to ${contents.metadata.period.end}`
      : 'Period: All records',
    '',
    'Contents:',
    `- Records of Processing Activities (RoPA): ${contents.ropa.count}`,
    `- Data Subject Access Requests (DSAR): ${contents.dsar.count}`,
    `- Data Protection Impact Assessments (DPIA): ${contents.dpias.count}`,
    `- Privacy Incidents: ${contents.incidents.count}`,
    `- Evidence Records: ${contents.evidence.count}`,
    '',
    'Files Included:',
    '- ropa-records.csv: All processing activities',
    '- dsar-requests.csv: All data subject requests',
    '- dpia-assessments.csv: All DPIA assessments',
    '- incidents.csv: All privacy incidents',
    '- metadata.json: Audit pack metadata',
    '- summary.txt: This summary',
    '',
    'This audit pack contains compliance documentation for privacy regulations',
    'including GDPR, CCPA, and other applicable frameworks.',
  ];

  return lines.join('\n');
}

/**
 * Download audit pack
 */
export async function downloadAuditPack(
  format: 'json' | 'zip' = 'zip',
  options?: {
    startDate?: string;
    endDate?: string;
    includeEvidence?: boolean;
  },
): Promise<void> {
  let blob: Blob;
  let filename: string;
  let mimeType: string;

  if (format === 'json') {
    const json = await exportAuditPackAsJSON(options);
    blob = new Blob([json], { type: 'application/json' });
    filename = `audit-pack-${new Date().toISOString().split('T')[0]}.json`;
    mimeType = 'application/json';
  } else {
    blob = await exportAuditPackAsZIP(options);
    filename = `audit-pack-${new Date().toISOString().split('T')[0]}.zip`;
    mimeType = 'application/zip';
  }

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}



