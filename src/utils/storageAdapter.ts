/**
 * Storage Adapter - Privacy by Design Implementation
 * 
 * This adapter provides a bridge between localStorage (mandatory) and Supabase (optional).
 * 
 * Privacy by Design Principles:
 * 1. localStorage is MANDATORY - All data is stored locally by default
 * 2. Supabase is OPTIONAL - Cloud sync is opt-in, not required
 * 3. localStorage is PRIMARY - Always read from localStorage first
 * 4. Supabase is SECONDARY - Used only for cloud sync when available
 * 
 * This ensures:
 * - Full offline functionality (localStorage works without internet)
 * - Privacy by default (data stays on user's device)
 * - Optional cloud sync (users can opt-in for multi-device sync)
 * - Graceful degradation (works even if Supabase is not configured)
 */
import { secureStorage } from './secureStorage';
import { supabase } from '../lib/supabase';
import { errorMonitoring } from '../lib/errorMonitoring';

/**
 * Check if Supabase is available and user is authenticated
 */
async function isSupabaseAvailable(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

/**
 * Get current user ID from Supabase
 */
async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

class StorageAdapter {
  // ============================================================================
  // Consent Management
  // ============================================================================

  /**
   * Get consent records from localStorage (PRIMARY - always works)
   */
  getConsentRecords(): any[] {
    return secureStorage.getItem('consent_records', []) || [];
  }

  /**
   * Set consent records to localStorage (PRIMARY) and optionally sync to Supabase
   * Returns immediately after saving to localStorage (Privacy by Design requirement)
   * Supabase sync happens in background (non-blocking)
   */
  setConsentRecords(records: any[]): boolean {
    // Always save to localStorage (Privacy by Design requirement)
    const localSuccess = secureStorage.setItem('consent_records', records);
    
    // Optionally sync to Supabase in background (non-blocking)
    if (localSuccess) {
      isSupabaseAvailable().then(available => {
        if (available) {
          getCurrentUserId().then(userId => {
            if (userId) {
              // Sync to Supabase (background operation, don't block)
              this.syncConsentRecordsToSupabase(records, userId).catch(err => {
                errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
                  context: 'storage_adapter_sync_consent',
                });
              });
            }
          }).catch(() => {
            // Silently fail - localStorage is primary, Supabase is optional
          });
        }
      }).catch(() => {
        // Silently fail - localStorage is primary, Supabase is optional
      });
    }
    
    return localSuccess;
  }

  /**
   * Sync consent records to Supabase (OPTIONAL)
   */
  private async syncConsentRecordsToSupabase(records: any[], userId: string): Promise<void> {
    try {
      // Delete existing records for this user
      await supabase
        .from('cc_privacy_consent_records')
        .delete()
        .eq('user_id', userId);

      // Insert new records
      if (records.length > 0) {
        const recordsToInsert = records.map(record => ({
          user_id: userId,
          employee_name: record.employeeName || '',
          employee_id: record.employeeId || '',
          consent_type: record.consentType || '',
          service_provider: record.serviceProvider || '',
          status: record.status || 'pending',
          consent_given: record.consentGiven || false,
          consent_date: record.consentDate || null,
          withdrawal_date: record.withdrawalDate || null,
          expiry_date: record.expiryDate || null,
          renewal_required: record.renewalRequired || false,
          applicable_regulations: record.applicableRegulations || [],
          parent_guardian_name: record.parentGuardianName || null,
          notes: record.notes || null,
        }));

        await supabase
          .from('cc_privacy_consent_records')
          .insert(recordsToInsert);
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Sync consent records from Supabase to localStorage (OPTIONAL)
   */
  async syncConsentRecordsFromSupabase(): Promise<boolean> {
    try {
      if (!(await isSupabaseAvailable())) {
        return false;
      }

      const userId = await getCurrentUserId();
      if (!userId) {
        return false;
      }

      const { data, error } = await supabase
        .from('cc_privacy_consent_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const records = data.map(record => ({
          id: record.id,
          employeeName: record.employee_name,
          employeeId: record.employee_id,
          consentType: record.consent_type,
          serviceProvider: record.service_provider,
          status: record.status,
          consentGiven: record.consent_given,
          consentDate: record.consent_date,
          withdrawalDate: record.withdrawal_date,
          expiryDate: record.expiry_date,
          renewalRequired: record.renewal_required,
          applicableRegulations: record.applicable_regulations || [],
          parentGuardianName: record.parent_guardian_name,
          notes: record.notes,
        }));

        secureStorage.setItem('consent_records', records);
        return true;
      }

      return false;
    } catch (err) {
      errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
        context: 'storage_adapter_sync_from_consent',
      });
      return false;
    }
  }

  // ============================================================================
  // Vendor Assessments
  // ============================================================================

  getVendorAssessments(): any[] {
    return secureStorage.getItem('vendor_assessments', []) || [];
  }

  setVendorAssessments(assessments: any[]): boolean {
    const localSuccess = secureStorage.setItem('vendor_assessments', assessments);
    
    if (localSuccess) {
      isSupabaseAvailable().then(available => {
        if (available) {
          getCurrentUserId().then(userId => {
            if (userId) {
              this.syncVendorAssessmentsToSupabase(assessments, userId).catch(err => {
                errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
                  context: 'storage_adapter_sync_vendor',
                });
              });
            }
          }).catch(() => {});
        }
      }).catch(() => {});
    }
    
    return localSuccess;
  }

  private async syncVendorAssessmentsToSupabase(assessments: any[], userId: string): Promise<void> {
    try {
      await supabase
        .from('cc_privacy_vendor_assessments')
        .delete()
        .eq('user_id', userId);

      if (assessments.length > 0) {
        const recordsToInsert = assessments.map(record => ({
          user_id: userId,
          vendor_name: record.vendorName || '',
          service_description: record.serviceDescription || '',
          risk_level: record.riskLevel || 'low',
          compliance_status: record.complianceStatus || 'review_needed',
          assessment_score: record.assessmentScore || 0,
          contract_start_date: record.contractStartDate || null,
          contract_end_date: record.contractEndDate || null,
          last_assessment_date: record.lastAssessmentDate || null,
          next_assessment_due: record.nextAssessmentDue || null,
          data_types_processed: record.dataTypesProcessed || [],
          applicable_regulations: record.applicableRegulations || [],
          security_certifications: record.securityCertifications || [],
          privacy_policy_reviewed: record.privacyPolicyReviewed || false,
          dpa_signed: record.dpaSigned || false,
          employee_data_access: record.employeeDataAccess || false,
        }));

        await supabase
          .from('cc_privacy_vendor_assessments')
          .insert(recordsToInsert);
      }
    } catch (err) {
      throw err;
    }
  }

  async syncVendorAssessmentsFromSupabase(): Promise<boolean> {
    try {
      if (!(await isSupabaseAvailable())) return false;
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const { data, error } = await supabase
        .from('cc_privacy_vendor_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const assessments = data.map(record => ({
          id: record.id,
          vendorName: record.vendor_name,
          serviceDescription: record.service_description,
          riskLevel: record.risk_level,
          complianceStatus: record.compliance_status,
          assessmentScore: record.assessment_score,
          contractStartDate: record.contract_start_date,
          contractEndDate: record.contract_end_date,
          lastAssessmentDate: record.last_assessment_date,
          nextAssessmentDue: record.next_assessment_due,
          dataTypesProcessed: record.data_types_processed || [],
          applicableRegulations: record.applicable_regulations || [],
          securityCertifications: record.security_certifications || [],
          privacyPolicyReviewed: record.privacy_policy_reviewed,
          dpaSigned: record.dpa_signed,
          employeeDataAccess: record.employee_data_access,
        }));

        secureStorage.setItem('vendor_assessments', assessments);
        return true;
      }

      return false;
    } catch (err) {
      errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
        context: 'storage_adapter_sync_from_vendor',
      });
      return false;
    }
  }

  // ============================================================================
  // DPIAs
  // ============================================================================

  getDpias(): any[] {
    return secureStorage.getItem('dpias', []) || [];
  }

  setDpias(dpias: any[]): boolean {
    const localSuccess = secureStorage.setItem('dpias', dpias);
    
    if (localSuccess) {
      isSupabaseAvailable().then(available => {
        if (available) {
          getCurrentUserId().then(userId => {
            if (userId) {
              this.syncDpiasToSupabase(dpias, userId).catch(err => {
                errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
                  context: 'storage_adapter_sync_dpias',
                });
              });
            }
          }).catch(() => {});
        }
      }).catch(() => {});
    }
    
    return localSuccess;
  }

  private async syncDpiasToSupabase(dpias: any[], userId: string): Promise<void> {
    try {
      await supabase
        .from('cc_privacy_dpias')
        .delete()
        .eq('user_id', userId);

      if (dpias.length > 0) {
        const recordsToInsert = dpias.map(record => ({
          user_id: userId,
          title: record.title || '',
          description: record.description || '',
          processing_activity: record.processingActivity || '',
          data_controller: record.dataController || '',
          data_processor: record.dataProcessor || '',
          status: record.status || 'draft',
          priority: record.priority || 'low',
          risk_level: record.riskLevel || 'low',
          created_date: record.createdDate || new Date().toISOString().split('T')[0],
          due_date: record.dueDate || new Date().toISOString().split('T')[0],
          last_updated: record.lastUpdated || null,
          assessor: record.assessor || '',
          reviewer: record.reviewer || '',
          data_subjects: record.dataSubjects || [],
          data_types: record.dataTypes || [],
          purposes: record.purposes || [],
          legal_basis: record.legalBasis || [],
          retention_period: record.retentionPeriod || '',
          data_sources: record.dataSources || [],
          recipients: record.recipients || [],
          transfers: record.transfers || [],
          risks: record.risks || [],
          measures: record.measures || {},
          consultation: record.consultation || {},
          approval: record.approval || {},
          next_review: record.nextReview || null,
        }));

        await supabase
          .from('cc_privacy_dpias')
          .insert(recordsToInsert);
      }
    } catch (err) {
      throw err;
    }
  }

  async syncDpiasFromSupabase(): Promise<boolean> {
    try {
      if (!(await isSupabaseAvailable())) return false;
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const { data, error } = await supabase
        .from('cc_privacy_dpias')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const dpias = data.map(record => ({
          id: record.id,
          title: record.title,
          description: record.description,
          processingActivity: record.processing_activity,
          dataController: record.data_controller,
          dataProcessor: record.data_processor,
          status: record.status,
          priority: record.priority,
          riskLevel: record.risk_level,
          createdDate: record.created_date,
          dueDate: record.due_date,
          lastUpdated: record.last_updated,
          assessor: record.assessor,
          reviewer: record.reviewer,
          dataSubjects: record.data_subjects || [],
          dataTypes: record.data_types || [],
          purposes: record.purposes || [],
          legalBasis: record.legal_basis || [],
          retentionPeriod: record.retention_period,
          dataSources: record.data_sources || [],
          recipients: record.recipients || [],
          transfers: record.transfers || [],
          risks: record.risks || [],
          measures: record.measures || {},
          consultation: record.consultation || {},
          approval: record.approval || {},
          nextReview: record.next_review,
        }));

        secureStorage.setItem('dpias', dpias);
        return true;
      }

      return false;
    } catch (err) {
      errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
        context: 'storage_adapter_sync_from_dpias',
      });
      return false;
    }
  }

  // ============================================================================
  // Retention Policies
  // ============================================================================

  getRetentionPolicies(): any[] {
    return secureStorage.getItem('retention_policies', []) || [];
  }

  setRetentionPolicies(policies: any[]): boolean {
    const localSuccess = secureStorage.setItem('retention_policies', policies);
    
    if (localSuccess) {
      isSupabaseAvailable().then(available => {
        if (available) {
          getCurrentUserId().then(userId => {
            if (userId) {
              this.syncRetentionPoliciesToSupabase(policies, userId).catch(err => {
                errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
                  context: 'storage_adapter_sync_retention',
                });
              });
            }
          }).catch(() => {});
        }
      }).catch(() => {});
    }
    
    return localSuccess;
  }

  private async syncRetentionPoliciesToSupabase(policies: any[], userId: string): Promise<void> {
    try {
      await supabase
        .from('cc_privacy_retention_policies')
        .delete()
        .eq('user_id', userId);

      if (policies.length > 0) {
        const recordsToInsert = policies.map(record => ({
          user_id: userId,
          name: record.name || '',
          description: record.description || '',
          data_category: record.dataCategory || '',
          data_types: record.dataTypes || [],
          purposes: record.purposes || [],
          retention_period: record.retentionPeriod || '',
          legal_basis: record.legalBasis || '',
          regulations: record.regulations || [],
          retention_start: record.retentionStart || 'creation',
          custom_start_date: record.customStartDate || null,
          retention_end: record.retentionEnd || 'automatic',
          end_event: record.endEvent || null,
          disposal_method: record.disposalMethod || 'delete',
          review_cycle: record.reviewCycle || '',
          last_review: record.lastReview || null,
          next_review: record.nextReview || null,
          status: record.status || 'draft',
          compliance_status: record.complianceStatus || 'needs_review',
          created_date: record.createdDate || new Date().toISOString().split('T')[0],
          created_by: record.createdBy || '',
          approved_by: record.approvedBy || null,
          approval_date: record.approvalDate || null,
          exceptions: record.exceptions || [],
          notes: record.notes || '',
        }));

        await supabase
          .from('cc_privacy_retention_policies')
          .insert(recordsToInsert);
      }
    } catch (err) {
      throw err;
    }
  }

  getDataRecords(): any[] {
    return secureStorage.getItem('data_records', []) || [];
  }

  setDataRecords(records: any[]): boolean {
    const localSuccess = secureStorage.setItem('data_records', records);
    
    if (localSuccess) {
      isSupabaseAvailable().then(available => {
        if (available) {
          getCurrentUserId().then(userId => {
            if (userId) {
              this.syncDataRecordsToSupabase(records, userId).catch(err => {
                errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
                  context: 'storage_adapter_sync_data_records',
                });
              });
            }
          }).catch(() => {});
        }
      }).catch(() => {});
    }
    
    return localSuccess;
  }

  private async syncDataRecordsToSupabase(records: any[], userId: string): Promise<void> {
    try {
      await supabase
        .from('cc_privacy_data_records')
        .delete()
        .eq('user_id', userId);

      if (records.length > 0) {
        const recordsToInsert = records.map(record => ({
          user_id: userId,
          data_type: record.dataType || '',
          data_category: record.dataCategory || '',
          subject: record.subject || '',
          created_date: record.createdDate || new Date().toISOString().split('T')[0],
          last_accessed: record.lastAccessed || null,
          last_updated: record.lastUpdated || null,
          retention_policy_id: record.retentionPolicy || null,
          retention_end_date: record.retentionEndDate || null,
          status: record.status || 'active',
          disposal_date: record.disposalDate || null,
          disposal_method: record.disposalMethod || null,
          location: record.location || '',
          size: record.size || '',
          sensitivity: record.sensitivity || 'low',
        }));

        await supabase
          .from('cc_privacy_data_records')
          .insert(recordsToInsert);
      }
    } catch (err) {
      throw err;
    }
  }

  // ============================================================================
  // Privacy by Design Assessments
  // ============================================================================

  getPrivacyByDesignAssessments(): any[] {
    return secureStorage.getItem('privacy_by_design_assessments', []) || [];
  }

  setPrivacyByDesignAssessments(assessments: any[]): boolean {
    const localSuccess = secureStorage.setItem('privacy_by_design_assessments', assessments);
    
    if (localSuccess) {
      isSupabaseAvailable().then(available => {
        if (available) {
          getCurrentUserId().then(userId => {
            if (userId) {
              this.syncPrivacyByDesignAssessmentsToSupabase(assessments, userId).catch(err => {
                errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
                  context: 'storage_adapter_sync_pbd',
                });
              });
            }
          }).catch(() => {});
        }
      }).catch(() => {});
    }
    
    return localSuccess;
  }

  private async syncPrivacyByDesignAssessmentsToSupabase(assessments: any[], userId: string): Promise<void> {
    try {
      await supabase
        .from('cc_privacy_privacy_by_design_assessments')
        .delete()
        .eq('user_id', userId);

      if (assessments.length > 0) {
        const recordsToInsert = assessments.map(record => ({
          user_id: userId,
          name: record.name || '',
          description: record.description || '',
          system_type: record.systemType || 'existing_system',
          status: record.status || 'draft',
          assessment_date: record.assessmentDate || new Date().toISOString().split('T')[0],
          assessor: record.assessor || '',
          overall_score: record.overallScore || 0,
          principles: record.principles || {},
          recommendations: record.recommendations || [],
          next_review_date: record.nextReviewDate || null,
          compliance_status: record.complianceStatus || 'needs_improvement',
        }));

        await supabase
          .from('cc_privacy_privacy_by_design_assessments')
          .insert(recordsToInsert);
      }
    } catch (err) {
      throw err;
    }
  }

  // ============================================================================
  // Service Providers
  // ============================================================================

  getServiceProviders(): any[] {
    return secureStorage.getItem('service_providers', []) || [];
  }

  setServiceProviders(providers: any[]): boolean {
    const localSuccess = secureStorage.setItem('service_providers', providers);
    
    if (localSuccess) {
      isSupabaseAvailable().then(available => {
        if (available) {
          getCurrentUserId().then(userId => {
            if (userId) {
              this.syncServiceProvidersToSupabase(providers, userId).catch(err => {
                errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
                  context: 'storage_adapter_sync_service_providers',
                });
              });
            }
          }).catch(() => {});
        }
      }).catch(() => {});
    }
    
    return localSuccess;
  }

  private async syncServiceProvidersToSupabase(providers: any[], userId: string): Promise<void> {
    try {
      await supabase
        .from('cc_privacy_service_providers')
        .delete()
        .eq('user_id', userId);

      if (providers.length > 0) {
        const recordsToInsert = providers.map(record => ({
          user_id: userId,
          name: record.name || '',
          description: record.description || '',
          category: record.category || 'other',
          status: record.status || 'pending',
          priority: record.priority || 'low',
          data_types: record.dataTypes || [],
          data_volume: record.dataVolume || 'low',
          data_sensitivity: record.dataSensitivity || 'low',
          contact_info: record.contactInfo || {},
          agreement: record.agreement || {},
          compliance: record.compliance || {},
          security: record.security || {},
          data_processing: record.dataProcessing || {},
          risk_assessment: record.riskAssessment || {},
          monitoring: record.monitoring || {},
          incidents: record.incidents || {},
          costs: record.costs || {},
          notes: record.notes || '',
          created_date: record.createdDate || new Date().toISOString().split('T')[0],
          created_by: record.createdBy || '',
          last_updated: record.lastUpdated || null,
          updated_by: record.updatedBy || '',
        }));

        await supabase
          .from('cc_privacy_service_providers')
          .insert(recordsToInsert);
      }
    } catch (err) {
      throw err;
    }
  }

  // ============================================================================
  // Privacy Incidents
  // ============================================================================

  getPrivacyIncidents(): any[] {
    return secureStorage.getItem('privacy_incidents', []) || [];
  }

  setPrivacyIncidents(incidents: any[]): boolean {
    const localSuccess = secureStorage.setItem('privacy_incidents', incidents);
    
    if (localSuccess) {
      isSupabaseAvailable().then(available => {
        if (available) {
          getCurrentUserId().then(userId => {
            if (userId) {
              this.syncPrivacyIncidentsToSupabase(incidents, userId).catch(err => {
                errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
                  context: 'storage_adapter_sync_incidents',
                });
              });
            }
          }).catch(() => {});
        }
      }).catch(() => {});
    }
    
    return localSuccess;
  }

  private async syncPrivacyIncidentsToSupabase(incidents: any[], userId: string): Promise<void> {
    try {
      await supabase
        .from('cc_privacy_privacy_incidents')
        .delete()
        .eq('user_id', userId);

      if (incidents.length > 0) {
        const recordsToInsert = incidents.map(record => ({
          user_id: userId,
          title: record.title || '',
          description: record.description || '',
          type: record.type || 'privacy_violation',
          severity: record.severity || 'low',
          status: record.status || 'reported',
          reported_date: record.reportedDate || new Date().toISOString().split('T')[0],
          detected_date: record.detectedDate || new Date().toISOString().split('T')[0],
          contained_date: record.containedDate || null,
          resolved_date: record.resolvedDate || null,
          reported_by: record.reportedBy || '',
          assigned_to: record.assignedTo || '',
          affected_data_subjects: record.affectedDataSubjects || 0,
          affected_data_types: record.affectedDataTypes || [],
          affected_systems: record.affectedSystems || [],
          root_cause: record.rootCause || '',
          impact: record.impact || '',
          mitigation: record.mitigation || [],
          regulatory_notifications: record.regulatoryNotifications || {},
          data_subject_notifications: record.dataSubjectNotifications || {},
          lessons_learned: record.lessonsLearned || [],
          preventive_measures: record.preventiveMeasures || [],
          related_incidents: record.relatedIncidents || [],
          documents: record.documents || [],
          notes: record.notes || '',
        }));

        await supabase
          .from('cc_privacy_privacy_incidents')
          .insert(recordsToInsert);
      }
    } catch (err) {
      throw err;
    }
  }

  // ============================================================================
  // Generic get/set for compatibility
  // ============================================================================

  getItem<T>(key: string, defaultValue?: T): T | null {
    return secureStorage.getItem(key, defaultValue);
  }

  setItem<T>(key: string, value: T): boolean {
    return secureStorage.setItem(key, value);
  }

  // ============================================================================
  // Sync All Data (for initial sync or manual sync)
  // ============================================================================

  // ============================================================================
  // Sync From Supabase Methods (for remaining tools)
  // ============================================================================

  async syncRetentionPoliciesFromSupabase(): Promise<boolean> {
    try {
      if (!(await isSupabaseAvailable())) return false;
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const { data, error } = await supabase
        .from('cc_privacy_retention_policies')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const policies = data.map(record => ({
          id: record.id,
          name: record.name,
          description: record.description,
          dataCategory: record.data_category,
          dataTypes: record.data_types || [],
          purposes: record.purposes || [],
          retentionPeriod: record.retention_period,
          legalBasis: record.legal_basis,
          regulations: record.regulations || [],
          retentionStart: record.retention_start,
          customStartDate: record.custom_start_date,
          retentionEnd: record.retention_end,
          endEvent: record.end_event,
          disposalMethod: record.disposal_method,
          reviewCycle: record.review_cycle,
          lastReview: record.last_review,
          nextReview: record.next_review,
          status: record.status,
          complianceStatus: record.compliance_status,
          createdDate: record.created_date,
          createdBy: record.created_by,
          approvedBy: record.approved_by,
          approvalDate: record.approval_date,
          exceptions: record.exceptions || [],
          notes: record.notes,
        }));

        secureStorage.setItem('retention_policies', policies);
        return true;
      }

      return false;
    } catch (err) {
      errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
        context: 'storage_adapter_sync_from_retention',
      });
      return false;
    }
  }

  async syncDataRecordsFromSupabase(): Promise<boolean> {
    try {
      if (!(await isSupabaseAvailable())) return false;
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const { data, error } = await supabase
        .from('cc_privacy_data_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const records = data.map(record => ({
          id: record.id,
          dataType: record.data_type,
          dataCategory: record.data_category,
          subject: record.subject,
          createdDate: record.created_date,
          lastAccessed: record.last_accessed,
          lastUpdated: record.last_updated,
          retentionPolicy: record.retention_policy_id,
          retentionEndDate: record.retention_end_date,
          status: record.status,
          disposalDate: record.disposal_date,
          disposalMethod: record.disposal_method,
          location: record.location,
          size: record.size,
          sensitivity: record.sensitivity,
        }));

        secureStorage.setItem('data_records', records);
        return true;
      }

      return false;
    } catch (err) {
      errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
        context: 'storage_adapter_sync_from_data_records',
      });
      return false;
    }
  }

  async syncPrivacyByDesignAssessmentsFromSupabase(): Promise<boolean> {
    try {
      if (!(await isSupabaseAvailable())) return false;
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const { data, error } = await supabase
        .from('cc_privacy_privacy_by_design_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const assessments = data.map(record => ({
          id: record.id,
          name: record.name,
          description: record.description,
          systemType: record.system_type,
          status: record.status,
          assessmentDate: record.assessment_date,
          assessor: record.assessor,
          overallScore: record.overall_score,
          principles: record.principles || {},
          recommendations: record.recommendations || [],
          nextReviewDate: record.next_review_date,
          complianceStatus: record.compliance_status,
        }));

        secureStorage.setItem('privacy_by_design_assessments', assessments);
        return true;
      }

      return false;
    } catch (err) {
      errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
        context: 'storage_adapter_sync_from_pbd',
      });
      return false;
    }
  }

  async syncServiceProvidersFromSupabase(): Promise<boolean> {
    try {
      if (!(await isSupabaseAvailable())) return false;
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const { data, error } = await supabase
        .from('cc_privacy_service_providers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const providers = data.map(record => ({
          id: record.id,
          name: record.name,
          description: record.description,
          category: record.category,
          status: record.status,
          priority: record.priority,
          dataTypes: record.data_types || [],
          dataVolume: record.data_volume,
          dataSensitivity: record.data_sensitivity,
          contactInfo: record.contact_info || {},
          agreement: record.agreement || {},
          compliance: record.compliance || {},
          security: record.security || {},
          dataProcessing: record.data_processing || {},
          riskAssessment: record.risk_assessment || {},
          monitoring: record.monitoring || {},
          incidents: record.incidents || {},
          costs: record.costs || {},
          notes: record.notes,
          createdDate: record.created_date,
          createdBy: record.created_by,
          lastUpdated: record.last_updated,
          updatedBy: record.updated_by,
        }));

        secureStorage.setItem('service_providers', providers);
        return true;
      }

      return false;
    } catch (err) {
      errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
        context: 'storage_adapter_sync_from_service_providers',
      });
      return false;
    }
  }

  async syncPrivacyIncidentsFromSupabase(): Promise<boolean> {
    try {
      if (!(await isSupabaseAvailable())) return false;
      const userId = await getCurrentUserId();
      if (!userId) return false;

      const { data, error } = await supabase
        .from('cc_privacy_privacy_incidents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const incidents = data.map(record => ({
          id: record.id,
          title: record.title,
          description: record.description,
          type: record.type,
          severity: record.severity,
          status: record.status,
          reportedDate: record.reported_date,
          detectedDate: record.detected_date,
          containedDate: record.contained_date,
          resolvedDate: record.resolved_date,
          reportedBy: record.reported_by,
          assignedTo: record.assigned_to,
          affectedDataSubjects: record.affected_data_subjects,
          affectedDataTypes: record.affected_data_types || [],
          affectedSystems: record.affected_systems || [],
          rootCause: record.root_cause,
          impact: record.impact,
          mitigation: record.mitigation || [],
          regulatoryNotifications: record.regulatory_notifications || {},
          dataSubjectNotifications: record.data_subject_notifications || {},
          lessonsLearned: record.lessons_learned || [],
          preventiveMeasures: record.preventive_measures || [],
          relatedIncidents: record.related_incidents || [],
          documents: record.documents || [],
          notes: record.notes,
        }));

        secureStorage.setItem('privacy_incidents', incidents);
        return true;
      }

      return false;
    } catch (err) {
      errorMonitoring.captureException(err instanceof Error ? err : new Error('Sync failed'), {
        context: 'storage_adapter_sync_from_incidents',
      });
      return false;
    }
  }

  // ============================================================================
  // Sync All Data (for initial sync or manual sync)
  // ============================================================================

  /**
   * Sync all data from Supabase to localStorage (OPTIONAL)
   * This is useful for initial sync when user logs in
   */
  async syncAllFromSupabase(): Promise<{
    consent: boolean;
    vendor: boolean;
    dpias: boolean;
    retention: boolean;
    dataRecords: boolean;
    pbd: boolean;
    serviceProviders: boolean;
    incidents: boolean;
  }> {
    const results = {
      consent: await this.syncConsentRecordsFromSupabase(),
      vendor: await this.syncVendorAssessmentsFromSupabase(),
      dpias: await this.syncDpiasFromSupabase(),
      retention: await this.syncRetentionPoliciesFromSupabase(),
      dataRecords: await this.syncDataRecordsFromSupabase(),
      pbd: await this.syncPrivacyByDesignAssessmentsFromSupabase(),
      serviceProviders: await this.syncServiceProvidersFromSupabase(),
      incidents: await this.syncPrivacyIncidentsFromSupabase(),
    };

    return results;
  }
}

export const storageAdapter = new StorageAdapter();

