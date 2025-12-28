// Supabase Edge Function for checking regulatory updates
// Uses RSS Aggregator instead of direct source feeds
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch from RSS Aggregator instead of direct source feeds
    const aggregatorUrl = Deno.env.get('RSS_AGGREGATOR_URL') || 
                          'https://api.cybercorrect.com/rss-aggregator/regulatory-updates';

    console.log('Fetching regulatory updates from RSS Aggregator:', aggregatorUrl);

    const aggregatorResponse = await fetch(`${aggregatorUrl}?limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!aggregatorResponse.ok) {
      throw new Error(`RSS Aggregator returned ${aggregatorResponse.status}: ${aggregatorResponse.statusText}`);
    }

    const aggregatorData = await aggregatorResponse.json();
    const aggregatedUpdates = aggregatorData.updates || [];

    console.log(`Received ${aggregatedUpdates.length} updates from RSS Aggregator`);

    // Sync aggregated updates to database
    let syncedCount = 0;
    let errorCount = 0;

    for (const update of aggregatedUpdates) {
      try {
        // Check if update already exists (by guid or link)
        const { data: existing } = await supabase
          .from('regulatory_updates')
          .select('id')
          .or(`guid.eq.${update.guid || ''},link.eq.${update.link || ''}`)
          .limit(1)
          .maybeSingle();

        if (!existing) {
          // Determine impact level and update type
          const impactLevel = assessImpactLevel(update);
          const updateType = determineUpdateType(update);

          // Insert new update
          const { error: insertError } = await supabase
            .from('regulatory_updates')
            .insert({
              framework: update.framework || 'Unknown',
              region: update.region,
              update_type: updateType,
              title: update.title || '',
              description: update.description || update.summary || '',
              impact_level: impactLevel,
              published_at: update.publishedAt || update.pubDate || update.published_at || new Date().toISOString(),
              link: update.link || update.url || '',
              guid: update.guid || update.id,
              metadata: {
                source: update.source || update.feedName || 'RSS Aggregator',
                categories: update.categories || update.tags || [],
                aggregated: true,
              },
            });

          if (insertError) {
            console.error(`Failed to insert update: ${update.title}`, insertError);
            errorCount++;
          } else {
            syncedCount++;
          }
        }
      } catch (error) {
        console.error(`Error processing update: ${update.title}`, error);
        errorCount++;
      }
    }

    // Get recently synced updates for notification
    const { data: recentUpdates, error: updatesError } = await supabase
      .from('regulatory_updates')
      .select('*')
      .gte('published_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('published_at', { ascending: false });

    if (updatesError) {
      throw updatesError;
    }

    if (!recentUpdates || recentUpdates.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No new regulatory updates' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all users who should be notified
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      throw usersError;
    }

    const notificationsCreated = [];

    // Notify affected users
    for (const update of recentUpdates) {
      const affectedUsers = update.affected_users || [];
      
      // If no specific users, notify all users
      const usersToNotify = affectedUsers.length > 0 
        ? users.users.filter(u => affectedUsers.includes(u.id))
        : users.users;

      for (const user of usersToNotify) {
        try {
          // Check if notification already exists
          const { data: existing } = await supabase
            .from('notifications')
            .select('id')
            .eq('user_id', user.id)
            .eq('type', 'regulatory')
            .eq('data->>updateId', update.id)
            .single();

          if (!existing) {
            // Create notification
            await supabase
              .from('notifications')
              .insert({
                user_id: user.id,
                type: 'regulatory',
                priority: update.impact_level === 'critical' ? 'critical' : 
                         update.impact_level === 'high' ? 'high' : 'normal',
                title: `Regulatory Update: ${update.title}`,
                message: update.description,
                action_url: '/regulatory',
                action_label: 'View Update',
                data: { updateId: update.id, framework: update.framework },
              });

            notificationsCreated.push({
              userId: user.id,
              updateId: update.id,
            });
          }
        } catch (error) {
          console.error(`Failed to notify user ${user.id} about update ${update.id}:`, error);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Regulatory update check completed',
        source: 'RSS Aggregator',
        updatesSynced: syncedCount,
        syncErrors: errorCount,
        updatesFound: recentUpdates.length,
        notificationsCreated: notificationsCreated.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking regulatory updates from RSS Aggregator:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        source: 'RSS Aggregator',
        fallback: 'Consider checking aggregator service status',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Assess impact level based on update content
 */
function assessImpactLevel(update: any): 'low' | 'medium' | 'high' | 'critical' {
  const titleLower = (update.title || '').toLowerCase();
  const descLower = (update.description || update.summary || '').toLowerCase();
  const combined = `${titleLower} ${descLower}`;

  // Critical keywords
  if (combined.match(/\b(critical|urgent|immediate|breach|violation|penalty|fine|enforcement)\b/i)) {
    return 'critical';
  }

  // High impact keywords
  if (combined.match(/\b(new regulation|amendment|compliance|deadline|requirement|mandatory)\b/i)) {
    return 'high';
  }

  // Medium impact keywords
  if (combined.match(/\b(guidance|update|change|revision|clarification)\b/i)) {
    return 'medium';
  }

  return 'low';
}

/**
 * Determine update type from content
 */
function determineUpdateType(update: any): 'new_regulation' | 'amendment' | 'guidance' | 'enforcement' | 'other' {
  const titleLower = (update.title || '').toLowerCase();
  const descLower = (update.description || update.summary || '').toLowerCase();
  const combined = `${titleLower} ${descLower}`;

  if (combined.match(/\b(new regulation|new law|new rule)\b/i)) {
    return 'new_regulation';
  }
  if (combined.match(/\b(amendment|amended|revised|updated regulation)\b/i)) {
    return 'amendment';
  }
  if (combined.match(/\b(guidance|guidelines|best practices|recommendations)\b/i)) {
    return 'guidance';
  }
  if (combined.match(/\b(enforcement|penalty|fine|violation|sanction)\b/i)) {
    return 'enforcement';
  }

  return 'other';
}

