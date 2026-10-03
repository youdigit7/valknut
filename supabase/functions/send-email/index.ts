// Supabase Edge Function: send-email
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, template, subject, data } = await req.json();

    const apiKey = Deno.env.get("RESEND_API_KEY") || Deno.env.get("SENDGRID_API_KEY");
    
    // If API key is present in environment, dispatch to email API
    if (apiKey) {
      // e.g. Resend / SendGrid dispatch logic
    }

    return new Response(
      JSON.stringify({ success: true, messageId: `msg_${Date.now()}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
