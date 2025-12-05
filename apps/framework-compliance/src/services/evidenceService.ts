/**
 * Evidence Service - Evidence Records Management
 * 
 * This service handles CRUD operations for evidence records used in
 * compliance audits and documentation.
 */

import { supabase, getCurrentUser } from '../lib/supabase';
import { errorMonitoring } from '../lib/errorMonitoring';
import { secureStorage } from '../utils/storage';

export type EvidenceType = 'ropa' | 'dsar' | 'dpia' | 'incident' | 'policy' | 'training' | 'audit' | 'other';
export type EvidenceCategory = 'documentation' | 'assessment' | 'policy' | 'training' | 'incident' | 'audit' | 'compliance' | 'other';
export type EvidenceStatus = 'draft' | 'active' | 'expired' | 'archived';

export interface EvidenceRecord {
  id?: string;
  title: string;
  description?: string;
  evidenceType: EvidenceType;
  relatedRecordType?: string;
  relatedRecordId?: string;
  framework?: string[];
  category: EvidenceCategory;
  filePath?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  source?: string;
  author?: string;
  reviewDate?: string;
  expiryDate?: string;
  status: EvidenceStatus;
  tags?: string[];
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Get all evidence records for the current user
 */
export async function getEvidenceRecords(): Promise<EvidenceRecord[]> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const localData = secureStorage.getItem<EvidenceRecord[]>('evidence_records', []);
      return localData || [];
    }

    const { data, error } = await supabase
      .from('cc_privacy_evidence_records')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(transformFromDb);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to get evidence records'), {
      context: 'evidence_get_records',
    });
    
    // Fallback to localStorage
    const localData = secureStorage.getItem<EvidenceRecord[]>('evidence_records', []);
    return localData || [];
  }
}

/**
 * Get evidence records by type
 */
export async function getEvidenceRecordsByType(type: EvidenceType): Promise<EvidenceRecord[]> {
  const allRecords = await getEvidenceRecords();
  return allRecords.filter(record => record.evidenceType === type);
}

/**
 * Get evidence records related to a specific record
 */
export async function getEvidenceRecordsByRelatedRecord(
  recordType: string,
  recordId: string,
): Promise<EvidenceRecord[]> {
  const allRecords = await getEvidenceRecords();
  return allRecords.filter(
    record => record.relatedRecordType === recordType && record.relatedRecordId === recordId,
  );
}

/**
 * Get a single evidence record by ID
 */
export async function getEvidenceRecord(id: string): Promise<EvidenceRecord | null> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const records = secureStorage.getItem<EvidenceRecord[]>('evidence_records', []);
      return records.find(r => r.id === id) || null;
    }

    const { data, error } = await supabase
      .from('cc_privacy_evidence_records')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return transformFromDb(data);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to get evidence record'), {
      context: 'evidence_get_record',
      recordId: id,
    });
    
    // Fallback to localStorage
    const records = secureStorage.getItem<EvidenceRecord[]>('evidence_records', []);
    return records.find(r => r.id === id) || null;
  }
}

/**
 * Create a new evidence record
 */
export async function createEvidenceRecord(
  record: Omit<EvidenceRecord, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<EvidenceRecord> {
  try {
    const { user } = await getCurrentUser();
    
    const newRecord: EvidenceRecord = {
      ...record,
      id: crypto.randomUUID(),
      status: record.status || 'draft',
      tags: record.tags || [],
      framework: record.framework || [],
      metadata: record.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!user) {
      // Fallback to localStorage
      const records = secureStorage.getItem<EvidenceRecord[]>('evidence_records', []);
      records.push(newRecord);
      secureStorage.setItem('evidence_records', records);
      return newRecord;
    }

    // Transform to database format
    const dbRecord = transformToDb(newRecord, user.id);

    const { data, error } = await supabase
      .from('cc_privacy_evidence_records')
      .insert([dbRecord])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Also save to localStorage as backup
    const records = secureStorage.getItem<EvidenceRecord[]>('evidence_records', []);
    records.push(transformFromDb(data));
    secureStorage.setItem('evidence_records', records);

    return transformFromDb(data);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to create evidence record'), {
      context: 'evidence_create_record',
    });
    throw err;
  }
}

/**
 * Update an existing evidence record
 */
export async function updateEvidenceRecord(
  id: string,
  updates: Partial<Omit<EvidenceRecord, 'id' | 'createdAt'>>,
): Promise<EvidenceRecord> {
  try {
    const { user } = await getCurrentUser();
    
    const updatedRecord: Partial<EvidenceRecord> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!user) {
      // Fallback to localStorage
      const records = secureStorage.getItem<EvidenceRecord[]>('evidence_records', []);
      const index = records.findIndex(r => r.id === id);
      if (index === -1) {
        throw new Error('Evidence record not found');
      }
      records[index] = { ...records[index], ...updatedRecord };
      secureStorage.setItem('evidence_records', records);
      return records[index];
    }

    // Transform to database format
    const dbUpdates = transformToDb(updatedRecord as EvidenceRecord, user.id, true);

    const { data, error } = await supabase
      .from('cc_privacy_evidence_records')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Also update localStorage
    const records = secureStorage.getItem<EvidenceRecord[]>('evidence_records', []);
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = transformFromDb(data);
      secureStorage.setItem('evidence_records', records);
    }

    return transformFromDb(data);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to update evidence record'), {
      context: 'evidence_update_record',
      recordId: id,
    });
    throw err;
  }
}

/**
 * Delete an evidence record
 */
export async function deleteEvidenceRecord(id: string): Promise<void> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const records = secureStorage.getItem<EvidenceRecord[]>('evidence_records', []);
      const filtered = records.filter(r => r.id !== id);
      secureStorage.setItem('evidence_records', filtered);
      return;
    }

    const { error } = await supabase
      .from('cc_privacy_evidence_records')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    // Also remove from localStorage
    const records = secureStorage.getItem<EvidenceRecord[]>('evidence_records', []);
    const filtered = records.filter(r => r.id !== id);
    secureStorage.setItem('evidence_records', filtered);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to delete evidence record'), {
      context: 'evidence_delete_record',
      recordId: id,
    });
    throw err;
  }
}

/**
 * Transform database record to application format
 */
function transformFromDb(dbRecord: any): EvidenceRecord {
  return {
    id: dbRecord.id,
    title: dbRecord.title,
    description: dbRecord.description,
    evidenceType: dbRecord.evidence_type,
    relatedRecordType: dbRecord.related_record_type,
    relatedRecordId: dbRecord.related_record_id,
    framework: dbRecord.framework || [],
    category: dbRecord.category,
    filePath: dbRecord.file_path,
    fileName: dbRecord.file_name,
    fileType: dbRecord.file_type,
    fileSize: dbRecord.file_size,
    source: dbRecord.source,
    author: dbRecord.author,
    reviewDate: dbRecord.review_date,
    expiryDate: dbRecord.expiry_date,
    status: dbRecord.status,
    tags: dbRecord.tags || [],
    metadata: dbRecord.metadata || {},
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at,
  };
}

/**
 * Transform application format to database format
 */
function transformToDb(record: Partial<EvidenceRecord>, userId: string, isUpdate = false): any {
  const dbRecord: any = {
    user_id: userId,
  };

  if (record.title !== undefined) dbRecord.title = record.title;
  if (record.description !== undefined) dbRecord.description = record.description;
  if (record.evidenceType !== undefined) dbRecord.evidence_type = record.evidenceType;
  if (record.relatedRecordType !== undefined) dbRecord.related_record_type = record.relatedRecordType;
  if (record.relatedRecordId !== undefined) dbRecord.related_record_id = record.relatedRecordId;
  if (record.framework !== undefined) dbRecord.framework = record.framework;
  if (record.category !== undefined) dbRecord.category = record.category;
  if (record.filePath !== undefined) dbRecord.file_path = record.filePath;
  if (record.fileName !== undefined) dbRecord.file_name = record.fileName;
  if (record.fileType !== undefined) dbRecord.file_type = record.fileType;
  if (record.fileSize !== undefined) dbRecord.file_size = record.fileSize;
  if (record.source !== undefined) dbRecord.source = record.source;
  if (record.author !== undefined) dbRecord.author = record.author;
  if (record.reviewDate !== undefined) dbRecord.review_date = record.reviewDate;
  if (record.expiryDate !== undefined) dbRecord.expiry_date = record.expiryDate;
  if (record.status !== undefined) dbRecord.status = record.status;
  if (record.tags !== undefined) dbRecord.tags = record.tags;
  if (record.metadata !== undefined) dbRecord.metadata = record.metadata;

  return dbRecord;
}


