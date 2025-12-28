# Run Privacy Risk Radar Migration

## Quick Steps

### 1. Open Supabase Dashboard
- Go to: https://app.supabase.com
- Login to your account
- Select project: **achowlksgmwuvfbvjfrt** (or your project ID from `VITE_SUPABASE_URL`)

### 2. Open SQL Editor
- Click **SQL Editor** in the left sidebar
- Click **New query** button

### 3. Copy Migration SQL
The migration SQL is in the file below. Copy the entire contents.

### 4. Paste and Run
- Paste the SQL into the SQL Editor
- Click **Run** button (or press Ctrl+Enter)
- Wait for "Success" message

### 5. Verify
Run this query to verify the table was created:

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

You should see:
- ✅ Table: `cc_privacy_risk_detections`
- ✅ 4 RLS policies
- ✅ 7 indexes

---

## Migration SQL

Copy everything below this line:

