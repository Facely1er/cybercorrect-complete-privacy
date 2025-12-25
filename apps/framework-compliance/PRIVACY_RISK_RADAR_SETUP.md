# Privacy Risk Radar - Setup Guide

## Overview

The Privacy Risk Radar is a continuous monitoring tool that detects privacy compliance risks from your actual data across all privacy tools. **No mock data** - all risks are detected from real user data.

## Database Migration

### Option 1: Run Individual Migration (Recommended for Development)

1. Navigate to your Supabase project dashboard
2. Go to **SQL Editor** → **New query**
3. Open the file: `apps/framework-compliance/supabase/migrations/20250220000000_privacy_risk_radar.sql`
4. Copy and paste the entire contents
5. Click **Run** (or press Ctrl+Enter)

### Option 2: Run Combined Migrations (For Fresh Setup)

1. Navigate to your Supabase project dashboard
2. Go to **SQL Editor** → **New query**
3. Open the file: `apps/framework-compliance/supabase/migrations/ALL_MIGRATIONS_COMBINED.sql`
4. Copy and paste the entire contents
5. Click **Run** (or press Ctrl+Enter)

**Note:** The combined migrations file includes all migrations including the Privacy Risk Radar.

## Verification

After running the migration, verify the table was created:

```sql
-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'cc_privacy_risk_detections';

-- Check RLS policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'cc_privacy_risk_detections';

-- Check indexes
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'cc_privacy_risk_detections';
```

## Using the Privacy Risk Radar

### Access the Tool

1. Navigate to **Toolkit** in your application
2. Find **Privacy Risk Radar** under "Privacy Assessment Tools"
3. Or go directly to: `/toolkit/privacy-risk-radar`

### Initial Scan

1. Click the **"Scan Now"** button
2. The system will scan your privacy data for risks:
   - Consent records (expired, invalid)
   - Vendor assessments (missing DPAs, low scores)
   - Data Subject Requests (approaching deadlines)
   - DPIAs (incomplete high-risk assessments)
   - Retention policies (expired data records)
   - Expiring consents (within 30 days)

### Viewing Risks

- **Active Risks Tab**: View all detected privacy risks
- **Privacy Metrics Tab**: See calculated metrics from your data
- **Compliance Scores Tab**: Link to gap analysis for compliance scores

### Risk Categories

- **Data Collection**: Issues with data collection practices
- **Data Storage**: Security and storage concerns
- **Data Sharing**: Third-party sharing risks
- **Consent**: Consent management violations
- **Access Rights**: Data subject request issues
- **Retention**: Data retention policy violations

### Risk Severity Levels

- **Critical**: Immediate action required (e.g., delayed SARs, invalid consents)
- **High**: Urgent attention needed (e.g., missing DPAs, incomplete DPIAs)
- **Medium**: Planned remediation (e.g., expiring consents)
- **Low**: Monitoring status

### Auto-Refresh

Enable auto-refresh to automatically scan for new risks every 5 minutes. Toggle the **"Auto-Refresh On/Off"** button.

## Data Sources

The Privacy Risk Radar analyzes data from:

- `cc_privacy_consent_records` - Consent management
- `cc_privacy_vendor_assessments` - Vendor risk assessments
- `cc_privacy_data_subject_requests` - Data subject access requests
- `cc_privacy_dpias` - Data Protection Impact Assessments
- `cc_privacy_data_records` - Data retention records
- `cc_privacy_retention_policies` - Retention policies

## Privacy Metrics

The tool calculates 6 key privacy metrics from your real data:

1. **Data Minimization** - Based on retention policies with clear purposes
2. **Consent Coverage** - Percentage of valid active consents
3. **Encryption Rate** - Based on vendor security certifications
4. **Access Control Strength** - Based on DPA coverage and vendor scores
5. **Retention Compliance** - Data records complying with retention policies
6. **Incident Response Readiness** - Based on incident management system

## Troubleshooting

### No Risks Detected

If no risks are detected, this could mean:
- Your privacy data is compliant (good!)
- You haven't created any privacy records yet
- Try clicking **"Scan Now"** to perform a fresh scan

### Migration Errors

If you encounter migration errors:
1. Check if the `update_cc_privacy_updated_at_column()` function exists
2. Verify you have the correct permissions
3. Check the Supabase logs for detailed error messages

### Performance Issues

If scanning is slow:
- The migration includes indexes for performance
- Large datasets may take a few seconds to scan
- Consider enabling auto-refresh instead of manual scans

## Integration with Other Tools

The Privacy Risk Radar integrates with:
- **Privacy Gap Analyzer** - Shares compliance scores
- **DPIA Manager** - Detects incomplete DPIAs
- **Privacy Rights Manager** - Monitors SAR deadlines
- **Vendor Risk Assessment** - Flags vendor compliance issues
- **Consent Management** - Tracks consent violations

## Support

For issues or questions:
1. Check the application logs
2. Review the error messages in the UI
3. Verify your database connection
4. Ensure all required tables exist

---

**Last Updated:** 2025-02-20
**Version:** 1.0.0

