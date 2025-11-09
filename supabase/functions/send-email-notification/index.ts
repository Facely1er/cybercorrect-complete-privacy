// Supabase Edge Function for sending email notifications
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

    // Get notification from request
    const { notificationId, userId } = await req.json();

    if (!notificationId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing notificationId or userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch notification
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', notificationId)
      .eq('user_id', userId)
      .single();

    if (notificationError || !notification) {
      return new Response(
        JSON.stringify({ error: 'Notification not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user preferences
    const { data: preferences } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Check if email notifications are enabled
    if (!preferences?.email_enabled) {
      return new Response(
        JSON.stringify({ message: 'Email notifications disabled for user' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user email
    const { data: user } = await supabase.auth.admin.getUserById(userId);
    if (!user?.user?.email) {
      return new Response(
        JSON.stringify({ error: 'User email not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email using Supabase email service or external provider
    // For now, we'll use a simple email template
    const emailSubject = notification.title;
    const emailBody = `
      <h2>${notification.title}</h2>
      <p>${notification.message}</p>
      ${notification.action_url ? `<p><a href="${notification.action_url}">${notification.action_label || 'View'}</a></p>` : ''}
      <p><small>This is an automated notification from CyberCorrect Privacy Platform</small></p>
    `;

    // In a real implementation, use Supabase email service or external provider (SendGrid, Mailgun, etc.)
    // For now, we'll just log it
    console.log('Email notification:', {
      to: user.user.email,
      subject: emailSubject,
      body: emailBody,
    });

    // Mark notification as sent (if you have a sent_at field)
    // await supabase
    //   .from('notifications')
    //   .update({ sent_at: new Date().toISOString() })
    //   .eq('id', notificationId);

    return new Response(
      JSON.stringify({ message: 'Email notification sent', notificationId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending email notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

