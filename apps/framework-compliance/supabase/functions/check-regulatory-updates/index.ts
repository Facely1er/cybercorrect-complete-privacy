// Supabase Edge Function for checking regulatory updates
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

    // In a real implementation, fetch regulatory updates from external API
    // For now, we'll check for new updates in the database
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
        updatesFound: recentUpdates.length,
        notificationsCreated: notificationsCreated.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking regulatory updates:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

