/**
 * Privacy Risk Detector Service
 * 
 * This service continuously monitors privacy compliance data and detects
 * privacy risks from real data across all privacy tools.
 * 
 * No mock data - all risks are detected from actual user data.
 */

import { supabase, getCurrentUser } from '../lib/supabase';
import { errorMonitoring } from '../lib/errorMonitoring';

export type RiskCategory = 'data_collection' | 'data_storage' | 'data_sharing' | 'consent' | 'access_rights' | 'breach_risk' | 'retention';
export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low';
export type RiskStatus = 'active' | 'mitigated' | 'accepted' | 'monitoring' | 'false_positive';
export type RiskTrend = 'increasing' | 'stable' | 'decreasing';
export type RiskSourceType = 'consent' | 'vendor' | 'dpia' | 'dsar' | 'retention' | 'incident' | 'assessment';

export interface DetectedRisk {
  risk_id: string;
  category: RiskCategory;
  severity: RiskSeverity;
  title: string;
  description: string;
  regulation: string[];
  affectedSystems: string[];
  dataSubjects: number;
  remediationSteps: string[];
  sourceType: RiskSourceType;
  sourceId?: string;
  trend?: RiskTrend;
}

export interface PrivacyRisk {
  id: string;
  risk_id: string;
  category: RiskCategory;
  severity: RiskSeverity;
  title: string;
  description: string;
  regulation: string[];
  detected_at: string;
  status: RiskStatus;
  affected_systems: string[];
  data_subjects_count: number;
  remediation_steps: string[];
  trend: RiskTrend | null;
  source_type: RiskSourceType;
  source_id: string | null;
  assigned_to: string | null;
  due_date: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
}

class PrivacyRiskDetector {
  /**
   * Scan all data sources and detect privacy risks
   */
  async scanForRisks(userId?: string): Promise<DetectedRisk[]> {
    try {
      const currentUserId = userId || (await getCurrentUser()).user?.id;
      if (!currentUserId) {
        return [];
      }

      const risks: DetectedRisk[] = [];

      // Run all detection methods in parallel
      const [
        consentRisks,
        vendorRisks,
        sarRisks,
        dpiaRisks,
        retentionRisks,
        expiringConsentRisks
      ] = await Promise.all([
        this.detectConsentViolations(currentUserId),
        this.detectVendorRisks(currentUserId),
        this.detectDelayedSARs(currentUserId),
        this.detectIncompleteDPIAs(currentUserId),
        this.detectRetentionViolations(currentUserId),
        this.detectExpiringConsents(currentUserId)
      ]);

      risks.push(
        ...consentRisks,
        ...vendorRisks,
        ...sarRisks,
        ...dpiaRisks,
        ...retentionRisks,
        ...expiringConsentRisks
      );

      return risks;
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Risk detection failed'), {
        context: 'privacy_risk_detection',
        operation: 'scanForRisks'
      });
      return [];
    }
  }

  /**
   * Detect consent violations from cc_privacy_consent_records
   */
  private async detectConsentViolations(userId: string): Promise<DetectedRisk[]> {
    const risks: DetectedRisk[] = [];

    try {
      const { data: consents, error } = await supabase
        .from('cc_privacy_consent_records')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        errorMonitoring.captureException(new Error(error.message), {
          context: 'consent_violation_detection'
        });
        return risks;
      }

      if (!consents || consents.length === 0) {
        return risks;
      }

      // Check for expired consents that need renewal
      const expiredConsents = consents.filter(c => 
        c.expiry_date && 
        new Date(c.expiry_date) < new Date() && 
        c.status === 'active' &&
        c.renewal_required
      );

      if (expiredConsents.length > 0) {
        risks.push({
          risk_id: `CONSENT-EXPIRED-${Date.now()}`,
          category: 'consent',
          severity: expiredConsents.length > 10 ? 'high' : 'medium',
          title: 'Expired Consent Records Requiring Renewal',
          description: `${expiredConsents.length} consent record(s) have expired and require renewal to maintain compliance`,
          regulation: ['GDPR Article 7', 'CCPA Section 1798.100'],
          affectedSystems: [...new Set(expiredConsents.map((c: any) => c.service_provider))],
          dataSubjects: expiredConsents.length,
          remediationSteps: [
            'Review expired consent records',
            'Contact data subjects for consent renewal',
            'Update consent management system',
            'Document renewal process'
          ],
          sourceType: 'consent',
          sourceId: expiredConsents[0]?.id
        });
      }

      // Check for consent records without consent_given = true
      const invalidConsents = consents.filter((c: any) => 
        c.status === 'active' && 
        !c.consent_given
      );

      if (invalidConsents.length > 0) {
        risks.push({
          risk_id: `CONSENT-INVALID-${Date.now()}`,
          category: 'consent',
          severity: 'critical',
          title: 'Active Consent Records Without Valid Consent',
          description: `${invalidConsents.length} consent record(s) are marked as active but do not have valid consent`,
          regulation: ['GDPR Article 7', 'ePrivacy Directive'],
          affectedSystems: [...new Set(invalidConsents.map((c: any) => c.service_provider))],
          dataSubjects: invalidConsents.length,
          remediationSteps: [
            'Review all active consent records',
            'Verify consent was properly obtained',
            'Update records or suspend processing',
            'Implement consent validation checks'
          ],
          sourceType: 'consent'
        });
      }
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Consent violation detection failed'), {
        context: 'consent_violation_detection'
      });
    }

    return risks;
  }

  /**
   * Detect vendor/third-party sharing risks from cc_privacy_vendor_assessments
   */
  private async detectVendorRisks(userId: string): Promise<DetectedRisk[]> {
    const risks: DetectedRisk[] = [];

    try {
      const { data: vendors, error } = await supabase
        .from('cc_privacy_vendor_assessments')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        errorMonitoring.captureException(new Error(error.message), {
          context: 'vendor_risk_detection'
        });
        return risks;
      }

      if (!vendors || vendors.length === 0) {
        return risks;
      }

      // Check for vendors without DPA
      const vendorsWithoutDPA = vendors.filter((v: any) => 
        v.data_types_processed && 
        Array.isArray(v.data_types_processed) &&
        v.data_types_processed.length > 0 && 
        !v.dpa_signed
      );

      if (vendorsWithoutDPA.length > 0) {
        risks.push({
          risk_id: `VENDOR-DPA-${Date.now()}`,
          category: 'data_sharing',
          severity: vendorsWithoutDPA.length > 5 ? 'high' : 'medium',
          title: 'Third-Party Data Transfer Without DPA',
          description: `${vendorsWithoutDPA.length} vendor(s) processing personal data without signed Data Processing Agreement`,
          regulation: ['GDPR Article 28', 'CCPA Section 1798.140(w)'],
          affectedSystems: vendorsWithoutDPA.map((v: any) => v.vendor_name),
          dataSubjects: 0,
          remediationSteps: [
            'Negotiate and execute Data Processing Agreements',
            'Verify processor security controls',
            'Implement data transfer safeguards',
            'Update vendor management records'
          ],
          sourceType: 'vendor',
          sourceId: vendorsWithoutDPA[0]?.id
        });
      }

      // Check for high-risk vendors with low compliance scores
      const highRiskVendors = vendors.filter((v: any) => 
        (v.risk_level === 'high' || v.risk_level === 'critical') &&
        v.assessment_score < 70
      );

      if (highRiskVendors.length > 0) {
        risks.push({
          risk_id: `VENDOR-RISK-${Date.now()}`,
          category: 'data_sharing',
          severity: 'high',
          title: 'High-Risk Vendors with Low Compliance Scores',
          description: `${highRiskVendors.length} vendor(s) have high risk levels but low compliance assessment scores`,
          regulation: ['GDPR Article 28', 'GDPR Article 32'],
          affectedSystems: highRiskVendors.map((v: any) => v.vendor_name),
          dataSubjects: 0,
          remediationSteps: [
            'Conduct detailed vendor security assessment',
            'Review vendor compliance documentation',
            'Consider alternative vendors if necessary',
            'Implement additional monitoring controls'
          ],
          sourceType: 'vendor',
          sourceId: highRiskVendors[0]?.id
        });
      }
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Vendor risk detection failed'), {
        context: 'vendor_risk_detection'
      });
    }

    return risks;
  }

  /**
   * Detect delayed SAR responses from cc_privacy_data_subject_requests
   */
  private async detectDelayedSARs(userId: string): Promise<DetectedRisk[]> {
    const risks: DetectedRisk[] = [];

    try {
      const { data: requests, error } = await supabase
        .from('cc_privacy_data_subject_requests')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['submitted', 'acknowledged', 'in_progress']);

      if (error) {
        errorMonitoring.captureException(new Error(error.message), {
          context: 'sar_delay_detection'
        });
        return risks;
      }

      if (!requests || requests.length === 0) {
        return risks;
      }

      const now = new Date();
      const delayedRequests = requests.filter((req: any) => {
        if (!req.due_date) return false;
        const dueDate = new Date(req.due_date);
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue < 7 && daysUntilDue >= 0;
      });

      if (delayedRequests.length > 0) {
        const criticalDelayed = delayedRequests.filter((req: any) => {
          const dueDate = new Date(req.due_date);
          const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntilDue < 3;
        });

        risks.push({
          risk_id: `SAR-DELAYED-${Date.now()}`,
          category: 'access_rights',
          severity: criticalDelayed.length > 0 ? 'critical' : 'high',
          title: 'Data Subject Requests Approaching Deadline',
          description: `${delayedRequests.length} data subject request(s) are approaching the regulatory deadline (${criticalDelayed.length} critical)`,
          regulation: ['GDPR Article 15', 'CCPA Section 1798.100'],
          affectedSystems: ['Data Subject Request System'],
          dataSubjects: delayedRequests.length,
          remediationSteps: [
            'Prioritize requests approaching deadline',
            'Assign additional resources if needed',
            'Set up escalation alerts',
            'Review request processing workflow'
          ],
          sourceType: 'dsar',
          sourceId: delayedRequests[0]?.id
        });
      }
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('SAR delay detection failed'), {
        context: 'sar_delay_detection'
      });
    }

    return risks;
  }

  /**
   * Detect incomplete DPIAs from cc_privacy_dpias
   */
  private async detectIncompleteDPIAs(userId: string): Promise<DetectedRisk[]> {
    const risks: DetectedRisk[] = [];

    try {
      const { data: dpias, error } = await supabase
        .from('cc_privacy_dpias')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['draft', 'in_progress']);

      if (error) {
        errorMonitoring.captureException(new Error(error.message), {
          context: 'dpia_incomplete_detection'
        });
        return risks;
      }

      if (!dpias || dpias.length === 0) {
        return risks;
      }

      // Check for high-risk DPIAs that are incomplete
      const highRiskIncomplete = dpias.filter((d: any) => 
        (d.risk_level === 'high' || d.risk_level === 'critical') &&
        (d.status === 'draft' || d.status === 'in_progress')
      );

      if (highRiskIncomplete.length > 0) {
        risks.push({
          risk_id: `DPIA-INCOMPLETE-${Date.now()}`,
          category: 'data_collection',
          severity: 'high',
          title: 'Incomplete High-Risk DPIAs',
          description: `${highRiskIncomplete.length} high-risk Data Protection Impact Assessment(s) are incomplete`,
          regulation: ['GDPR Article 35'],
          affectedSystems: highRiskIncomplete.map((d: any) => d.processing_activity),
          dataSubjects: 0,
          remediationSteps: [
            'Complete pending DPIAs for high-risk processing',
            'Review risk assessment findings',
            'Implement recommended controls',
            'Obtain necessary approvals'
          ],
          sourceType: 'dpia',
          sourceId: highRiskIncomplete[0]?.id
        });
      }
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('DPIA incomplete detection failed'), {
        context: 'dpia_incomplete_detection'
      });
    }

    return risks;
  }

  /**
   * Detect retention policy violations from cc_privacy_data_records
   */
  private async detectRetentionViolations(userId: string): Promise<DetectedRisk[]> {
    const risks: DetectedRisk[] = [];

    try {
      const { data: dataRecords, error } = await supabase
        .from('cc_privacy_data_records')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) {
        errorMonitoring.captureException(new Error(error.message), {
          context: 'retention_violation_detection'
        });
        return risks;
      }

      if (!dataRecords || dataRecords.length === 0) {
        return risks;
      }

      const expiredRecords = dataRecords.filter((record: any) => {
        if (!record.retention_end_date) return false;
        return new Date(record.retention_end_date) < new Date();
      });

      if (expiredRecords.length > 0) {
        risks.push({
          risk_id: `RETENTION-EXPIRED-${Date.now()}`,
          category: 'retention',
          severity: expiredRecords.length > 100 ? 'high' : 'medium',
          title: 'Data Records Past Retention Period',
          description: `${expiredRecords.length} data record(s) have exceeded their retention period and should be disposed`,
          regulation: ['GDPR Article 5(1)(e)', 'CCPA Section 1798.105'],
          affectedSystems: ['Data Retention System'],
          dataSubjects: expiredRecords.length,
          remediationSteps: [
            'Review expired data records',
            'Execute disposal according to retention policy',
            'Document disposal activities',
            'Update data inventory'
          ],
          sourceType: 'retention',
          sourceId: expiredRecords[0]?.id
        });
      }
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Retention violation detection failed'), {
        context: 'retention_violation_detection'
      });
    }

    return risks;
  }

  /**
   * Detect expiring consents requiring renewal
   */
  private async detectExpiringConsents(userId: string): Promise<DetectedRisk[]> {
    const risks: DetectedRisk[] = [];

    try {
      const { data: consents, error } = await supabase
        .from('cc_privacy_consent_records')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) {
        errorMonitoring.captureException(new Error(error.message), {
          context: 'consent_expiring_detection'
        });
        return risks;
      }

      if (!consents || consents.length === 0) {
        return risks;
      }

      const expiringSoon = consents.filter((c: any) => {
        if (!c.expiry_date) return false;
        const expiryDate = new Date(c.expiry_date);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0 && c.renewal_required;
      });

      if (expiringSoon.length > 0) {
        risks.push({
          risk_id: `CONSENT-EXPIRING-${Date.now()}`,
          category: 'consent',
          severity: 'medium',
          title: 'Consent Records Expiring Soon',
          description: `${expiringSoon.length} consent record(s) will expire within 30 days and require renewal`,
          regulation: ['GDPR Article 7'],
          affectedSystems: [...new Set(expiringSoon.map((c: any) => c.service_provider))],
          dataSubjects: expiringSoon.length,
          remediationSteps: [
            'Initiate consent renewal process',
            'Contact data subjects before expiry',
            'Update consent management workflows',
            'Set up automated renewal reminders'
          ],
          sourceType: 'consent',
          sourceId: expiringSoon[0]?.id
        });
      }
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Consent expiring detection failed'), {
        context: 'consent_expiring_detection'
      });
    }

    return risks;
  }

  /**
   * Store detected risks in database
   */
  async storeRisks(userId: string, risks: DetectedRisk[]): Promise<void> {
    if (risks.length === 0) return;

    try {
      const riskRecords = risks.map(risk => ({
        user_id: userId,
        risk_id: risk.risk_id,
        category: risk.category,
        severity: risk.severity,
        title: risk.title,
        description: risk.description,
        regulation: risk.regulation,
        affected_systems: risk.affectedSystems,
        data_subjects_count: risk.dataSubjects,
        remediation_steps: risk.remediationSteps,
        source_type: risk.sourceType,
        source_id: risk.sourceId || null,
        trend: risk.trend || 'stable'
      }));

      // Check if risks already exist
      const existingRiskIds = riskRecords.map(r => r.risk_id);
      const { data: existing } = await supabase
        .from('cc_privacy_risk_detections')
        .select('risk_id')
        .eq('user_id', userId)
        .in('risk_id', existingRiskIds);

      const existingIds = new Set(existing?.map((r: any) => r.risk_id) || []);
      const newRisks = riskRecords.filter(r => !existingIds.has(r.risk_id));

      if (newRisks.length > 0) {
        const { error: insertError } = await supabase
          .from('cc_privacy_risk_detections')
          .insert(newRisks);

        if (insertError) {
          errorMonitoring.captureException(new Error(insertError.message), {
            context: 'store_risks',
            operation: 'insert'
          });
        }
      }
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Store risks failed'), {
        context: 'store_risks'
      });
    }
  }

  /**
   * Get all stored risks for a user
   */
  async getStoredRisks(userId?: string, filters?: {
    status?: RiskStatus;
    severity?: RiskSeverity;
    category?: RiskCategory;
  }): Promise<PrivacyRisk[]> {
    try {
      const currentUserId = userId || (await getCurrentUser()).user?.id;
      if (!currentUserId) {
        return [];
      }

      let query = supabase
        .from('cc_privacy_risk_detections')
        .select('*')
        .eq('user_id', currentUserId)
        .order('detected_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;

      if (error) {
        errorMonitoring.captureException(new Error(error.message), {
          context: 'get_stored_risks'
        });
        return [];
      }

      return (data || []) as PrivacyRisk[];
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Get stored risks failed'), {
        context: 'get_stored_risks'
      });
      return [];
    }
  }

  /**
   * Update risk status
   */
  async updateRiskStatus(riskId: string, status: RiskStatus, resolutionNotes?: string): Promise<boolean> {
    try {
      const { user } = await getCurrentUser();
      if (!user) return false;

      const updates: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'mitigated' || status === 'accepted') {
        updates.resolved_at = new Date().toISOString();
        if (resolutionNotes) {
          updates.resolution_notes = resolutionNotes;
        }
      }

      const { error } = await supabase
        .from('cc_privacy_risk_detections')
        .update(updates)
        .eq('id', riskId)
        .eq('user_id', user.id);

      if (error) {
        errorMonitoring.captureException(new Error(error.message), {
          context: 'update_risk_status',
          riskId
        });
        return false;
      }

      return true;
    } catch (error) {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Update risk status failed'), {
        context: 'update_risk_status',
        riskId
      });
      return false;
    }
  }
}

export const privacyRiskDetector = new PrivacyRiskDetector();

