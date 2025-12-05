/**
 * Audit Pack Service - Evidence Aggregation and Export
 * 
 * This service aggregates evidence from all compliance tools and creates
 * audit-ready documentation packs for compliance audits.
 * 
 * Note: This service accesses the shared Supabase database used by framework-compliance
 */

import { supabase } from '../lib/supabase';

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
 * Get current user ID
 */
async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
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
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const startDate = options?.startDate;
  const endDate = options?.endDate || new Date().toISOString().split('T')[0];

  // Fetch all compliance data from shared database (cc_privacy_* tables are in public schema)
  // Note: These tables are shared with framework-compliance app
  const [ropaResult, dsarResult, dpiasResult, incidentsResult, evidenceResult] = await Promise.all([
    // RoPA records
    supabase
      .from('cc_privacy_processing_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    
    // DSAR requests (from framework-compliance schema)
    supabase
      .from('cc_privacy_data_subject_requests')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_date', { ascending: false }),
    
    // DPIAs
    supabase
      .from('cc_privacy_dpias')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    
    // Incidents
    supabase
      .from('cc_privacy_privacy_incidents')
      .select('*')
      .eq('user_id', userId)
      .order('reported_date', { ascending: false }),
    
    // Evidence records (if requested)
    options?.includeEvidence !== false
      ? supabase
          .from('cc_privacy_evidence_records')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);

  // Filter by date range if provided
  const filterByDate = (records: any[], dateField: string) => {
    if (!startDate) return records;
    return records.filter(record => {
      const recordDate = record[dateField] || record.created_at;
      if (!recordDate) return true;
      const dateStr = typeof recordDate === 'string' ? recordDate.split('T')[0] : recordDate;
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  const ropaRecords = filterByDate(ropaResult.data || [], 'created_at');
  const dsarRecords = filterByDate(dsarResult.data || [], 'submitted_date');
  const dpiasRecords = filterByDate(dpiasResult.data || [], 'created_date');
  const incidentsRecords = filterByDate(incidentsResult.data || [], 'reported_date');
  const evidenceRecords = filterByDate(evidenceResult.data || [], 'created_at');

  return {
    ropa: {
      records: ropaRecords,
      count: ropaRecords.length,
    },
    dsar: {
      records: dsarRecords,
      count: dsarRecords.length,
    },
    dpias: {
      records: dpiasRecords,
      count: dpiasRecords.length,
    },
    incidents: {
      records: incidentsRecords,
      count: incidentsRecords.length,
    },
    evidence: {
      records: evidenceRecords,
      count: evidenceRecords.length,
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
 * Convert database record to CSV row
 */
function recordToCSVRow(record: any, fields: string[]): string {
  return fields
    .map(field => {
      const value = record[field];
      if (value === null || value === undefined) return '';
      if (Array.isArray(value)) return value.join('; ');
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value).replace(/"/g, '""');
    })
    .map(cell => `"${cell}"`)
    .join(',');
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

  // Import JSZip dynamically
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  // Add RoPA CSV
  if (contents.ropa.count > 0) {
    const headers = ['Name', 'Purpose', 'Legal Basis', 'Data Types', 'Data Subjects', 'Recipients', 'Retention Period', 'Risk Level', 'Status'];
    const rows = contents.ropa.records.map(record => 
      recordToCSVRow(record, ['name', 'purpose', 'legal_basis', 'data_types', 'data_subjects', 'recipients', 'retention_period', 'risk_level', 'status'])
    );
    const csv = [headers.join(','), ...rows].join('\n');
    zip.file('ropa-records.csv', csv);
  }

  // Add DSAR CSV
  if (contents.dsar.count > 0) {
    const headers = ['Request ID', 'Type', 'Status', 'Priority', 'Requester Name', 'Requester Email', 'Submitted Date', 'Due Date', 'Completed Date'];
    const rows = contents.dsar.records.map(record =>
      recordToCSVRow(record, ['request_id', 'request_type', 'status', 'priority', 'requester_name', 'requester_email', 'submitted_date', 'due_date', 'completed_date'])
    );
    const csv = [headers.join(','), ...rows].join('\n');
    zip.file('dsar-requests.csv', csv);
  }

  // Add DPIA CSV
  if (contents.dpias.count > 0) {
    const headers = ['Title', 'Processing Activity', 'Status', 'Priority', 'Risk Level', 'Data Controller', 'Assessor', 'Created Date', 'Due Date'];
    const rows = contents.dpias.records.map(record =>
      recordToCSVRow(record, ['title', 'processing_activity', 'status', 'priority', 'risk_level', 'data_controller', 'assessor', 'created_date', 'due_date'])
    );
    const csv = [headers.join(','), ...rows].join('\n');
    zip.file('dpia-assessments.csv', csv);
  }

  // Add Incidents CSV
  if (contents.incidents.count > 0) {
    const headers = ['Title', 'Type', 'Severity', 'Status', 'Reported Date', 'Detected Date', 'Affected Data Subjects', 'Assigned To'];
    const rows = contents.incidents.records.map(record =>
      recordToCSVRow(record, ['title', 'type', 'severity', 'status', 'reported_date', 'detected_date', 'affected_data_subjects', 'assigned_to'])
    );
    const csv = [headers.join(','), ...rows].join('\n');
    zip.file('incidents.csv', csv);
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

  if (format === 'json') {
    const json = await exportAuditPackAsJSON(options);
    blob = new Blob([json], { type: 'application/json' });
    filename = `audit-pack-${new Date().toISOString().split('T')[0]}.json`;
  } else {
    blob = await exportAuditPackAsZIP(options);
    filename = `audit-pack-${new Date().toISOString().split('T')[0]}.zip`;
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

