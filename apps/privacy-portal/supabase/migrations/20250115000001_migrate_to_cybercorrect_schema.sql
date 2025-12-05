/*
  # Migrate existing data to cybercorrect schema
  
  This migration ensures that any existing data in the public schema
  is properly migrated to the cybercorrect schema to avoid conflicts
  with other Supabase projects.
*/

-- First, check if we have any existing data in public schema that needs migration
DO $$
DECLARE
  public_profiles_count integer;
  public_requests_count integer;
  public_consent_count integer;
  public_incidents_count integer;
  public_compliance_count integer;
BEGIN
  -- Check if tables exist in public schema and have data
  SELECT COUNT(*) INTO public_profiles_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'profiles';
  
  IF public_profiles_count > 0 THEN
    -- Check if profiles table has data
    EXECUTE 'SELECT COUNT(*) FROM public.profiles' INTO public_profiles_count;
    
    IF public_profiles_count > 0 THEN
      -- Migrate profiles data to cybercorrect schema
      INSERT INTO cybercorrect.profiles (
        id, organization_id, role, full_name, email, department, 
        avatar_url, settings, preferences, last_login, login_count, 
        is_active, created_at, updated_at
      )
      SELECT 
        id, organization_id, 
        COALESCE(role::text, 'student')::cybercorrect.user_role,
        full_name, email, department, avatar_url, 
        COALESCE(settings, '{}'::jsonb), 
        COALESCE(preferences, '{}'::jsonb),
        last_login, COALESCE(login_count, 0), 
        COALESCE(is_active, true),
        COALESCE(created_at, now()),
        COALESCE(updated_at, now())
      FROM public.profiles
      WHERE NOT EXISTS (
        SELECT 1 FROM cybercorrect.profiles WHERE cybercorrect.profiles.id = public.profiles.id
      );
      
      RAISE NOTICE 'Migrated % profiles to cybercorrect schema', public_profiles_count;
    END IF;
  END IF;
  
  -- Check for data subject requests
  SELECT COUNT(*) INTO public_requests_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'data_subject_requests';
  
  IF public_requests_count > 0 THEN
    EXECUTE 'SELECT COUNT(*) FROM public.data_subject_requests' INTO public_requests_count;
    
    IF public_requests_count > 0 THEN
      -- Migrate data subject requests
      INSERT INTO cybercorrect.data_subject_requests (
        id, organization_id, user_id, request_type, requester_name, 
        requester_email, requester_relationship, student_identifier,
        request_details, applicable_regulations, status, submitted_at, 
        due_date, completed_at, assigned_to, notes, response_data, 
        verification_status, communication_log, created_at, updated_at
      )
      SELECT 
        id, organization_id, user_id, request_type, requester_name,
        requester_email, requester_relationship, 
        COALESCE(employee_identifier, student_identifier),
        COALESCE(request_details, '{}'::jsonb),
        COALESCE(applicable_regulations, '{}'::text[]),
        COALESCE(status::text, 'submitted')::cybercorrect.request_status,
        COALESCE(submitted_at, now()),
        due_date, completed_at, assigned_to, notes,
        COALESCE(response_data, '{}'::jsonb),
        verification_status,
        COALESCE(communication_log, '[]'::jsonb),
        COALESCE(created_at, now()),
        COALESCE(updated_at, now())
      FROM public.data_subject_requests
      WHERE NOT EXISTS (
        SELECT 1 FROM cybercorrect.data_subject_requests 
        WHERE cybercorrect.data_subject_requests.id = public.data_subject_requests.id
      );
      
      RAISE NOTICE 'Migrated % data subject requests to cybercorrect schema', public_requests_count;
    END IF;
  END IF;
  
  -- Check for consent records
  SELECT COUNT(*) INTO public_consent_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'consent_records';
  
  IF public_consent_count > 0 THEN
    EXECUTE 'SELECT COUNT(*) FROM public.consent_records' INTO public_consent_count;
    
    IF public_consent_count > 0 THEN
      -- Migrate consent records
      INSERT INTO cybercorrect.consent_records (
        id, organization_id, student_id, student_name, 
        parent_guardian_name, parent_guardian_email, consent_type, 
        purpose, service_provider, consent_given, consent_date, 
        withdrawal_date, expiry_date, renewal_required, 
        applicable_regulations, metadata, created_at, updated_at
      )
      SELECT 
        id, organization_id, 
        COALESCE(employee_id, student_id),
        COALESCE(employee_name, student_name),
        hr_contact_name, hr_contact_email, consent_type,
        COALESCE(purpose::text, 'other')::cybercorrect.consent_purpose,
        service_provider, consent_given, consent_date,
        withdrawal_date, expiry_date, COALESCE(renewal_required, false),
        COALESCE(applicable_regulations, '{}'::text[]),
        COALESCE(metadata, '{}'::jsonb),
        COALESCE(created_at, now()),
        COALESCE(updated_at, now())
      FROM public.consent_records
      WHERE NOT EXISTS (
        SELECT 1 FROM cybercorrect.consent_records 
        WHERE cybercorrect.consent_records.id = public.consent_records.id
      );
      
      RAISE NOTICE 'Migrated % consent records to cybercorrect schema', public_consent_count;
    END IF;
  END IF;
  
  -- Check for privacy incidents
  SELECT COUNT(*) INTO public_incidents_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'privacy_incidents';
  
  IF public_incidents_count > 0 THEN
    EXECUTE 'SELECT COUNT(*) FROM public.privacy_incidents' INTO public_incidents_count;
    
    IF public_incidents_count > 0 THEN
      -- Migrate privacy incidents
      INSERT INTO cybercorrect.privacy_incidents (
        id, organization_id, incident_number, incident_type, severity,
        title, description, affected_individuals_count, data_types_affected,
        discovery_date, incident_date, containment_date, resolution_date,
        reported_to_authorities, notification_authorities, individuals_notified,
        notification_method, cause_analysis, remediation_actions, lessons_learned,
        status, assigned_to, applicable_regulations, created_at, updated_at
      )
      SELECT 
        id, organization_id, incident_number,
        COALESCE(incident_type::text, 'privacy_violation')::cybercorrect.incident_type,
        COALESCE(severity::text, 'medium')::cybercorrect.incident_severity,
        title, description, COALESCE(affected_individuals_count, 0),
        COALESCE(data_types_affected, '{}'::text[]),
        discovery_date, incident_date, containment_date, resolution_date,
        COALESCE(reported_to_authorities, false),
        COALESCE(notification_authorities, '{}'::text[]),
        COALESCE(individuals_notified, false),
        notification_method, cause_analysis,
        COALESCE(remediation_actions, '[]'::jsonb),
        lessons_learned, COALESCE(status, 'open'),
        assigned_to, COALESCE(applicable_regulations, '{}'::text[]),
        COALESCE(created_at, now()),
        COALESCE(updated_at, now())
      FROM public.privacy_incidents
      WHERE NOT EXISTS (
        SELECT 1 FROM cybercorrect.privacy_incidents 
        WHERE cybercorrect.privacy_incidents.id = public.privacy_incidents.id
      );
      
      RAISE NOTICE 'Migrated % privacy incidents to cybercorrect schema', public_incidents_count;
    END IF;
  END IF;
  
  -- Check for compliance tracking
  SELECT COUNT(*) INTO public_compliance_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'compliance_tracking';
  
  IF public_compliance_count > 0 THEN
    EXECUTE 'SELECT COUNT(*) FROM public.compliance_tracking' INTO public_compliance_count;
    
    IF public_compliance_count > 0 THEN
      -- Migrate compliance tracking
      INSERT INTO cybercorrect.compliance_tracking (
        id, organization_id, event_id, event_title, status, assigned_to,
        due_date, completed_at, documentation, notes, created_at, updated_at
      )
      SELECT 
        id, organization_id, event_id, event_title,
        COALESCE(status::text, 'pending')::cybercorrect.compliance_status,
        assigned_to, due_date, completed_at,
        COALESCE(documentation, '{}'::jsonb),
        notes, COALESCE(created_at, now()),
        COALESCE(updated_at, now())
      FROM public.compliance_tracking
      WHERE NOT EXISTS (
        SELECT 1 FROM cybercorrect.compliance_tracking 
        WHERE cybercorrect.compliance_tracking.id = public.compliance_tracking.id
      );
      
      RAISE NOTICE 'Migrated % compliance tracking records to cybercorrect schema', public_compliance_count;
    END IF;
  END IF;
  
  RAISE NOTICE 'Migration to cybercorrect schema completed successfully';
END $$;

-- Update the application metadata to reflect the migration
UPDATE cybercorrect.application_metadata 
SET 
  last_updated = now(),
  configuration = configuration || jsonb_build_object(
    'schema_migration_completed', true,
    'migration_date', now()::text
  )
WHERE application_name = 'cybercorrect-privacy-portal';