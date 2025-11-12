// Supabase Edge Function for tracking compliance health
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

    // Get all active users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      throw usersError;
    }

    const results = [];

    // Calculate compliance health scores for each user
    for (const user of users.users) {
      try {
        // In a real implementation, fetch compliance data and calculate score
        // For now, we'll use a mock calculation
        const score = await calculateComplianceScore(user.id, supabase);

        if (score !== null) {
          // Store score
          const { error: scoreError } = await supabase
            .from('compliance_health_scores')
            .insert({
              user_id: user.id,
              score: score.score,
              framework: score.framework,
              trend: score.trend,
              metadata: score.metadata || {},
            });

          if (scoreError) {
            console.error(`Failed to store score for user ${user.id}:`, scoreError);
          } else {
            // Generate alerts if score is low
            if (score.score < 40) {
              await supabase
                .from('notifications')
                .insert({
                  user_id: user.id,
                  type: 'alert',
                  priority: 'critical',
                  title: 'Low Compliance Health Score',
                  message: `Your compliance health score is ${score.score.toFixed(1)}. Immediate action recommended.`,
                  action_url: '/dashboard/compliance-health',
                  action_label: 'View Dashboard',
                });
            }

            results.push({
              userId: user.id,
              score: score.score,
              status: 'success',
            });
          }
        }
      } catch (error) {
        console.error(`Failed to calculate score for user ${user.id}:`, error);
        results.push({
          userId: user.id,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Compliance health tracking completed',
        results,
        totalProcessed: users.users.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error tracking compliance health:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function calculateComplianceScore(userId: string, supabase: any) {
  // In a real implementation, fetch compliance data and calculate score
  // This would integrate with the compliance gap analyzer
  // For now, return mock data
  return {
    score: 75,
    framework: 'GDPR',
    trend: 'stable' as const,
    metadata: {},
  };
}

