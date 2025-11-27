// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Get environment variables directly to avoid circular dependency
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const isProduction = import.meta.env.PROD;

// Log warning if environment variables are missing but don't fail
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Some features will be disabled.');
}

// Create client with fallback for missing config
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: isProduction ? undefined : window.localStorage,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-application-name': 'cybercorrect-privacy-portal',
      'x-application-version': isProduction ? '1.0.0' : 'development'
    }
  },
  db: {
    schema: 'cybercorrect'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types based on your schema
export interface Profile {
  id: string
  organization_id?: string
  role: 'administrator' | 'hr_staff' | 'employee' | 'job_applicant' | 'former_employee'
  full_name?: string
  email?: string
  department?: string
  avatar_url?: string
  settings?: Record<string, unknown>
  preferences?: Record<string, unknown>
  last_login?: string
  login_count?: number
  is_active?: boolean
  created_at: string
  updated_at: string
  // Application-specific metadata
  cc_application_version?: string
  cc_data_version?: number
  cc_last_synced?: string
  cc_sync_status?: 'synced' | 'pending' | 'error' | 'offline'
}

export interface DataSubjectRequest {
  id: string
  organization_id: string
  user_id?: string
  request_type: 'access' | 'rectification' | 'erasure' | 'portability' | 'objection' | 'restriction' | 'opt_out' | 'consent_withdrawal' | 'directory_opt_out'
  requester_name: string
  requester_email: string
  requester_relationship?: string
  employee_identifier?: string
  request_details?: Record<string, unknown>
  applicable_regulations?: string[]
  status: 'submitted' | 'under_review' | 'in_progress' | 'completed' | 'rejected' | 'partially_fulfilled'
  submitted_at: string
  due_date: string
  completed_at?: string
  assigned_to?: string
  notes?: string
  response_data?: Record<string, unknown>
  verification_status?: string
  communication_log?: CommunicationLogEntry[]
  created_at: string
  updated_at: string
  // Application-specific metadata
  cc_application_version?: string
  cc_data_version?: number
  cc_last_synced?: string
  cc_sync_status?: 'synced' | 'pending' | 'error' | 'offline'
  cc_offline_created?: boolean
  cc_offline_updated?: boolean
}

export interface ConsentRecord {
  id: string
  organization_id: string
  employee_id: string
  employee_name?: string
  hr_contact_name?: string
  hr_contact_email?: string
  consent_type: string
  purpose: 'employment_services' | 'performance_assessment' | 'administrative' | 'communications' | 'safety_security' | 'compliance' | 'research' | 'marketing' | 'other'
  service_provider?: string
  consent_given: boolean
  consent_date?: string
  withdrawal_date?: string
  expiry_date?: string
  renewal_required: boolean
  applicable_regulations?: string[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface PrivacyIncident {
  id: string
  organization_id: string
  incident_number: string
  incident_type: 'data_breach' | 'unauthorized_access' | 'data_loss' | 'system_compromise' | 'privacy_violation' | 'consent_violation' | 'vendor_incident'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  affected_individuals_count: number
  data_types_affected?: string[]
  discovery_date: string
  incident_date?: string
  containment_date?: string
  resolution_date?: string
  reported_to_authorities: boolean
  notification_authorities?: string[]
  individuals_notified: boolean
  notification_method?: string
  cause_analysis?: string
  remediation_actions?: RemediationAction[]
  lessons_learned?: string
  status: string
  assigned_to?: string
  applicable_regulations?: string[]
  created_at: string
  updated_at: string
}

export interface ComplianceTracking {
  id: string
  organization_id: string
  event_id: string
  event_title: string
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
  assigned_to?: string
  due_date: string
  completed_at?: string
  documentation?: Record<string, unknown>
  notes?: string
  created_at: string
  updated_at: string
}

// Additional interface definitions
export interface CommunicationLogEntry {
  id: string;
  timestamp: string;
  type: 'email' | 'phone' | 'in_person' | 'system';
  content: string;
  sender: string;
  recipient: string;
}

export interface RemediationAction {
  id: string;
  action_type: string;
  description: string;
  assigned_to: string;
  due_date: string;
  completed: boolean;
  completed_at?: string;
}