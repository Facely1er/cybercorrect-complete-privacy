// Supabase Edge Function for running scheduled assessments
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

    // Get assessments that are due for execution
    const now = new Date().toISOString();
    const { data: dueAssessments, error: assessmentsError } = await supabase
      .from('scheduled_assessments')
      .select('*')
      .eq('status', 'active')
      .lte('next_run', now);

    if (assessmentsError) {
      throw assessmentsError;
    }

    if (!dueAssessments || dueAssessments.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No assessments due for execution' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    // Execute assessments
    for (const assessment of dueAssessments) {
      try {
        // Execute assessment based on type
        const assessmentResult = await executeAssessment(assessment, supabase);

        // Calculate next run date
        const nextRun = calculateNextRun(assessment.schedule);
        
        await supabase
          .from('scheduled_assessments')
          .update({
            last_run: now,
            next_run: nextRun.toISOString(),
            status: 'active',
          })
          .eq('id', assessment.id);

        // Create notification for user
        await supabase
          .from('notifications')
          .insert({
            user_id: assessment.user_id,
            type: 'assessment',
            priority: 'normal',
            title: `${assessment.assessment_type} Assessment Completed`,
            message: `Your scheduled ${assessment.assessment_type} assessment has been completed.`,
            action_url: `/assessments/scheduled`,
            action_label: 'View Results',
          });

        results.push({
          assessmentId: assessment.id,
          status: 'success',
          executedAt: now,
        });
      } catch (error) {
        console.error(`Failed to execute assessment ${assessment.id}:`, error);
        
        // Update assessment status to failed
        await supabase
          .from('scheduled_assessments')
          .update({ status: 'failed' })
          .eq('id', assessment.id);

        results.push({
          assessmentId: assessment.id,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Assessment execution completed',
        results,
        totalProcessed: dueAssessments.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error running scheduled assessments:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function executeAssessment(assessment: any, supabase: any) {
  // In a real implementation, execute the actual assessment
  // This would call the appropriate assessment service
  // For now, return mock data
  return {
    assessmentId: assessment.id,
    assessmentType: assessment.assessment_type,
    executedAt: new Date().toISOString(),
    result: {
      score: 75,
      status: 'completed',
    },
  };
}

function calculateNextRun(schedule: string): Date {
  const now = new Date();
  const next = new Date(now);

  switch (schedule) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    default:
      next.setDate(next.getDate() + 7);
  }

  return next;
}

