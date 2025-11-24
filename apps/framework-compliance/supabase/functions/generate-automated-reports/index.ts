// Supabase Edge Function for generating automated reports
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

    // Get reports that are due for generation
    const now = new Date().toISOString();
    const { data: dueReports, error: reportsError } = await supabase
      .from('automated_reports')
      .select('*')
      .eq('status', 'active')
      .lte('next_generation', now);

    if (reportsError) {
      throw reportsError;
    }

    if (!dueReports || dueReports.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No reports due for generation' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    // Generate reports
    for (const report of dueReports) {
      try {
        // Generate report based on type
        const reportData = await generateReport(report, supabase);

        // Store report in Supabase storage (if configured)
        // For now, we'll just update the report record
        const nextGeneration = calculateNextGeneration(report.frequency);
        
        await supabase
          .from('automated_reports')
          .update({
            last_generated: now,
            next_generation: nextGeneration.toISOString(),
            status: 'active',
          })
          .eq('id', report.id);

        // Create notification for user
        await supabase
          .from('notifications')
          .insert({
            user_id: report.user_id,
            type: 'report',
            priority: 'normal',
            title: `${report.report_type} Report Generated`,
            message: `Your ${report.report_type} report has been generated successfully.`,
            action_url: `/reports/automated`,
            action_label: 'View Report',
          });

        results.push({
          reportId: report.id,
          status: 'success',
          generatedAt: now,
        });
      } catch (error) {
        console.error(`Failed to generate report ${report.id}:`, error);
        
        // Update report status to failed
        await supabase
          .from('automated_reports')
          .update({ status: 'failed' })
          .eq('id', report.id);

        results.push({
          reportId: report.id,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Report generation completed',
        results,
        totalProcessed: dueReports.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating automated reports:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateReport(report: any, supabase: any) {
  // In a real implementation, generate the actual report
  // This would call the report generation service
  // For now, return mock data
  return {
    metadata: {
      title: `${report.report_type} Report`,
      generated_at: new Date().toISOString(),
      generated_by: 'CyberCorrect Privacy Platform',
      report_type: report.report_type,
    },
    summary: {
      overall_score: 75,
      total_controls: 100,
      implemented_controls: 75,
    },
  };
}

function calculateNextGeneration(frequency: string): Date {
  const now = new Date();
  const next = new Date(now);

  switch (frequency) {
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

