import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SyncRequest {
  table: string
  records: Record<string, unknown>[]
  operation: 'insert' | 'update' | 'upsert'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { table, records, operation }: SyncRequest = await req.json()

    if (!table || !records || !Array.isArray(records)) {
      throw new Error('Invalid request: table, records array required')
    }

    // Validate table name to prevent SQL injection
    const allowedTables = [
      'cybercorrect.profiles',
      'cybercorrect.data_subject_requests',
      'cybercorrect.consent_records',
      'cybercorrect.privacy_incidents',
      'cybercorrect.compliance_tracking',
      'cybercorrect.cache_metadata',
      'cybercorrect.data_sync_log'
    ]

    if (!allowedTables.includes(table)) {
      throw new Error(`Invalid table: ${table}`)
    }

    let result
    const timestamp = new Date().toISOString()

    // Add metadata to records
    const processedRecords = records.map(record => ({
      ...record,
      cc_last_synced: timestamp,
      cc_sync_status: 'synced'
    }))

    switch (operation) {
      case 'insert':
        result = await supabaseClient
          .from(table)
          .insert(processedRecords)
          .select()
        break

      case 'update': {
        // For updates, we need to handle each record individually
        const updatePromises = processedRecords.map(record => {
          const { id, ...updateData } = record
          return supabaseClient
            .from(table)
            .update(updateData)
            .eq('id', id)
            .select()
        })
        result = await Promise.all(updatePromises)
        break
      }

      case 'upsert':
        result = await supabaseClient
          .from(table)
          .upsert(processedRecords, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })
          .select()
        break

      default:
        throw new Error(`Invalid operation: ${operation}`)
    }

    if (result.error) {
      throw result.error
    }

    // Log sync operation
    await supabaseClient
      .from('cybercorrect.data_sync_log')
      .insert([{
        table_name: table,
        record_id: records[0]?.id || 'batch',
        operation: operation,
        sync_status: 'synced',
        created_at: timestamp
      }])

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully ${operation}ed ${records.length} records`,
        data: result.data,
        timestamp
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Sync failed:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})