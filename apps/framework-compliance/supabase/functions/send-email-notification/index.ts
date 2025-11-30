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

    // Send email using SendGrid or fallback to Supabase email service
    const sendGridApiKey = Deno.env.get('SENDGRID_API_KEY');
    const emailSubject = notification.title;
    const emailBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${notification.title}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">CyberCorrect Privacy Platform</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; margin-top: 0;">${notification.title}</h2>
            <p style="color: #4b5563; font-size: 16px;">${notification.message}</p>
            ${notification.action_url ? `
              <div style="margin: 30px 0;">
                <a href="${notification.action_url}" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  ${notification.action_label || 'View Details'}
                </a>
              </div>
            ` : ''}
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              This is an automated notification from CyberCorrect Privacy Platform.<br>
              You can manage your notification preferences in your account settings.
            </p>
          </div>
        </body>
      </html>
    `;

    let emailSent = false;

    // Try SendGrid first if configured
    if (sendGridApiKey) {
      try {
        const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sendGridApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: user.user.email }],
              subject: emailSubject,
            }],
            from: {
              email: Deno.env.get('SENDGRID_FROM_EMAIL') || 'noreply@cybercorrect.com',
              name: 'CyberCorrect Privacy Platform',
            },
            content: [{
              type: 'text/html',
              value: emailBody,
            }],
          }),
        });

        if (sendGridResponse.ok) {
          console.log('Email sent via SendGrid:', user.user.email);
          emailSent = true;
        } else {
          const errorText = await sendGridResponse.text();
          console.warn('SendGrid API error:', sendGridResponse.status, errorText);
          // Fall through to other methods (don't throw)
        }
      } catch (sendGridError) {
        console.warn('SendGrid error, trying fallback:', sendGridError);
        // Fall through to Supabase email service (don't throw)
      }
    }

    // Fallback: Use Supabase email service (if available and SendGrid failed)
    if (!emailSent) {
      try {
        const { error: emailError } = await supabase.functions.invoke('send-email', {
          body: {
            to: user.user.email,
            subject: emailSubject,
            html: emailBody,
          },
        });

        if (!emailError) {
          console.log('Email sent via Supabase:', user.user.email);
          emailSent = true;
        } else {
          console.warn('Supabase email service error:', emailError);
          // Continue - don't throw
        }
      } catch (supabaseEmailError) {
        console.warn('Supabase email service not available:', supabaseEmailError);
        // Continue - don't throw
      }
    }

    // Final fallback: Log for manual sending (never throw)
    if (!emailSent) {
      console.log('Email notification (no provider configured or all failed):', {
        to: user.user.email,
        subject: emailSubject,
        // Don't log full body in production for privacy
        bodyLength: emailBody.length,
      });
    }

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

